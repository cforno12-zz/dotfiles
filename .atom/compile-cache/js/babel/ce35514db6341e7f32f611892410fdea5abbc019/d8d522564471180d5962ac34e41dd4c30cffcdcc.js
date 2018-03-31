var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _atom = require('atom');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _helpers = require('../helpers');

var _helpers2 = require('./helpers');

var Editor = (function () {
  function Editor(textEditor) {
    var _this = this;

    _classCallCheck(this, Editor);

    this.tooltip = null;
    this.emitter = new _atom.Emitter();
    this.markers = new Map();
    this.messages = new Set();
    this.textEditor = textEditor;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showTooltip', function (showTooltip) {
      _this.showTooltip = showTooltip;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      _this.showProviderName = showProviderName;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      var notInitial = typeof _this.showDecorations !== 'undefined';
      _this.showDecorations = showDecorations;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.gutterPosition', function (gutterPosition) {
      var notInitial = typeof _this.gutterPosition !== 'undefined';
      _this.gutterPosition = gutterPosition;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(textEditor.onDidDestroy(function () {
      _this.dispose();
    }));

    var tooltipSubscription = undefined;
    this.subscriptions.add(atom.config.observe('linter-ui-default.tooltipFollows', function (tooltipFollows) {
      if (tooltipSubscription) {
        tooltipSubscription.dispose();
      }
      tooltipSubscription = tooltipFollows === 'Mouse' ? _this.listenForMouseMovement() : _this.listenForKeyboardMovement();
      _this.removeTooltip();
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      tooltipSubscription.dispose();
    }));
    this.updateGutter();
    this.listenForCurrentLine();
  }

  _createClass(Editor, [{
    key: 'listenForCurrentLine',
    value: function listenForCurrentLine() {
      var _this2 = this;

      this.subscriptions.add(this.textEditor.observeCursors(function (cursor) {
        var marker = undefined;
        var lastRange = undefined;
        var lastEmpty = undefined;
        var handlePositionChange = function handlePositionChange(_ref) {
          var start = _ref.start;
          var end = _ref.end;

          var gutter = _this2.gutter;
          if (!gutter) return;
          // We need that Range.fromObject hack below because when we focus index 0 on multi-line selection
          // end.column is the column of the last line but making a range out of two and then accesing
          // the end seems to fix it (black magic?)
          var currentRange = _atom.Range.fromObject([start, end]);
          var linesRange = _atom.Range.fromObject([[start.row, 0], [end.row, Infinity]]);
          var currentEmpty = currentRange.isEmpty();

          // NOTE: Atom does not paint gutter if multi-line and last line has zero index
          if (start.row !== end.row && currentRange.end.column === 0) {
            linesRange.end.row--;
          }
          if (lastRange && lastRange.isEqual(linesRange) && currentEmpty === lastEmpty) return;
          if (marker) marker.destroy();
          lastRange = linesRange;
          lastEmpty = currentEmpty;

          marker = _this2.textEditor.markScreenRange(linesRange, {
            invalidate: 'never'
          });
          var item = document.createElement('span');
          item.className = 'line-number cursor-line linter-cursor-line ' + (currentEmpty ? 'cursor-line-no-selection' : '');
          gutter.decorateMarker(marker, {
            item: item,
            'class': 'linter-row'
          });
        };

        var cursorMarker = cursor.getMarker();
        var subscriptions = new _atom.CompositeDisposable();
        subscriptions.add(cursorMarker.onDidChange(function (_ref2) {
          var newHeadScreenPosition = _ref2.newHeadScreenPosition;
          var newTailScreenPosition = _ref2.newTailScreenPosition;

          handlePositionChange({ start: newHeadScreenPosition, end: newTailScreenPosition });
        }));
        subscriptions.add(cursor.onDidDestroy(function () {
          _this2.subscriptions.remove(subscriptions);
          subscriptions.dispose();
        }));
        subscriptions.add(new _atom.Disposable(function () {
          if (marker) marker.destroy();
        }));
        _this2.subscriptions.add(subscriptions);
        handlePositionChange(cursorMarker.getScreenRange());
      }));
    }
  }, {
    key: 'listenForMouseMovement',
    value: function listenForMouseMovement() {
      var _this3 = this;

      var editorElement = atom.views.getView(this.textEditor);

      return (0, _disposableEvent2['default'])(editorElement, 'mousemove', (0, _sbDebounce2['default'])(function (event) {
        if (!editorElement.component || !(0, _helpers2.hasParent)(event.target, 'div.scroll-view')) {
          return;
        }
        var tooltip = _this3.tooltip;
        if (tooltip && (0, _helpers2.mouseEventNearPosition)({
          event: event,
          editor: _this3.textEditor,
          editorElement: editorElement,
          tooltipElement: tooltip.element,
          screenPosition: tooltip.marker.getStartScreenPosition()
        })) {
          return;
        }

        _this3.cursorPosition = (0, _helpers2.getBufferPositionFromMouseEvent)(event, _this3.textEditor, editorElement);
        if (_this3.textEditor.largeFileMode) {
          // NOTE: Ignore if file is too large
          _this3.cursorPosition = null;
        }
        if (_this3.cursorPosition) {
          _this3.updateTooltip(_this3.cursorPosition);
        } else {
          _this3.removeTooltip();
        }
      }, 300, true));
    }
  }, {
    key: 'listenForKeyboardMovement',
    value: function listenForKeyboardMovement() {
      var _this4 = this;

      return this.textEditor.onDidChangeCursorPosition((0, _sbDebounce2['default'])(function (_ref3) {
        var newBufferPosition = _ref3.newBufferPosition;

        _this4.cursorPosition = newBufferPosition;
        _this4.updateTooltip(newBufferPosition);
      }, 60));
    }
  }, {
    key: 'updateGutter',
    value: function updateGutter() {
      var _this5 = this;

      this.removeGutter();
      if (!this.showDecorations) {
        this.gutter = null;
        return;
      }
      var priority = this.gutterPosition === 'Left' ? -100 : 100;
      this.gutter = this.textEditor.addGutter({
        name: 'linter-ui-default',
        priority: priority
      });
      this.markers.forEach(function (marker, message) {
        _this5.decorateMarker(message, marker, 'gutter');
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter) {
        try {
          this.gutter.destroy();
        } catch (_) {
          /* This throws when the text editor is disposed */
        }
      }
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(position) {
      var _this6 = this;

      if (!position || this.tooltip && this.tooltip.isValid(position, this.messages)) {
        return;
      }
      this.removeTooltip();
      if (!this.showTooltip) {
        return;
      }

      var messages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, this.textEditor.getPath(), position);
      if (!messages.length) {
        return;
      }

      this.tooltip = new _tooltip2['default'](messages, position, this.textEditor);
      this.tooltip.onDidDestroy(function () {
        _this6.tooltip = null;
      });
    }
  }, {
    key: 'removeTooltip',
    value: function removeTooltip() {
      if (this.tooltip) {
        this.tooltip.marker.destroy();
      }
    }
  }, {
    key: 'apply',
    value: function apply(added, removed) {
      var _this7 = this;

      var textBuffer = this.textEditor.getBuffer();

      for (var i = 0, _length = removed.length; i < _length; i++) {
        var message = removed[i];
        var marker = this.markers.get(message);
        if (marker) {
          marker.destroy();
        }
        this.messages['delete'](message);
        this.markers['delete'](message);
      }

      var _loop = function (i, _length2) {
        var message = added[i];
        var markerRange = (0, _helpers.$range)(message);
        if (!markerRange) {
          // Only for backward compatibility
          return 'continue';
        }
        var marker = textBuffer.markRange(markerRange, {
          invalidate: 'never'
        });
        _this7.markers.set(message, marker);
        _this7.messages.add(message);
        marker.onDidChange(function (_ref4) {
          var oldHeadPosition = _ref4.oldHeadPosition;
          var newHeadPosition = _ref4.newHeadPosition;
          var isValid = _ref4.isValid;

          if (!isValid || newHeadPosition.row === 0 && oldHeadPosition.row !== 0) {
            return;
          }
          if (message.version === 1) {
            message.range = marker.previousEventState.range;
          } else {
            message.location.position = marker.previousEventState.range;
          }
        });
        _this7.decorateMarker(message, marker);
      };

      for (var i = 0, _length2 = added.length; i < _length2; i++) {
        var _ret = _loop(i, _length2);

        if (_ret === 'continue') continue;
      }

      this.updateTooltip(this.cursorPosition);
    }
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(message, marker) {
      var paint = arguments.length <= 2 || arguments[2] === undefined ? 'both' : arguments[2];

      if (paint === 'both' || paint === 'editor') {
        this.textEditor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight linter-' + message.severity
        });
      }

      var gutter = this.gutter;
      if (gutter && (paint === 'both' || paint === 'gutter')) {
        var element = document.createElement('span');
        element.className = 'linter-gutter linter-highlight linter-' + message.severity + ' icon icon-' + (message.icon || 'primitive-dot');
        gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: element
        });
      }
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.removeGutter();
      this.removeTooltip();
    }
  }]);

  return Editor;
})();

module.exports = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MEJBRXFCLGFBQWE7Ozs7K0JBQ04sa0JBQWtCOzs7O29CQUNrQixNQUFNOzt1QkFHbEQsWUFBWTs7Ozt1QkFDcUIsWUFBWTs7d0JBQ2tCLFdBQVc7O0lBR3hGLE1BQU07QUFjQyxXQWRQLE1BQU0sQ0FjRSxVQUFzQixFQUFFOzs7MEJBZGhDLE1BQU07O0FBZVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLCtCQUErQixFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQzNGLFlBQUssV0FBVyxHQUFHLFdBQVcsQ0FBQTtLQUMvQixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLFVBQUMsZ0JBQWdCLEVBQUs7QUFDckcsWUFBSyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQTtLQUN6QyxDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FB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QyxPQUFPLENBQUMsUUFBUSxvQkFBYyxPQUFPLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBQSxBQUFFLENBQUE7QUFDNUgsY0FBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsbUJBQU8sWUFBWTtBQUNuQixjQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQTtPQUNIO0tBQ0Y7OztXQUNXLHNCQUFDLFFBQWtCLEVBQWM7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQ3JCOzs7U0F0UUcsTUFBTTs7O0FBeVFaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkZWJvdW5jZSBmcm9tICdzYi1kZWJvdW5jZSdcbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgQnVmZmVyTWFya2VyLCBUZXh0RWRpdG9yR3V0dGVyLCBQb2ludCB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL3Rvb2x0aXAnXG5pbXBvcnQgeyAkcmFuZ2UsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHsgaGFzUGFyZW50LCBtb3VzZUV2ZW50TmVhclBvc2l0aW9uLCBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIEVkaXRvciB7XG4gIGd1dHRlcjogP1RleHRFZGl0b3JHdXR0ZXI7XG4gIHRvb2x0aXA6ID9Ub29sdGlwO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtYXJrZXJzOiBNYXA8TGludGVyTWVzc2FnZSwgQnVmZmVyTWFya2VyPjtcbiAgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPjtcbiAgdGV4dEVkaXRvcjogVGV4dEVkaXRvcjtcbiAgc2hvd1Rvb2x0aXA6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGN1cnNvclBvc2l0aW9uOiA/UG9pbnQ7XG4gIGd1dHRlclBvc2l0aW9uOiBib29sZWFuO1xuICBzaG93RGVjb3JhdGlvbnM6IGJvb2xlYW47XG4gIHNob3dQcm92aWRlck5hbWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHRoaXMudG9vbHRpcCA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dUb29sdGlwJywgKHNob3dUb29sdGlwKSA9PiB7XG4gICAgICB0aGlzLnNob3dUb29sdGlwID0gc2hvd1Rvb2x0aXBcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQcm92aWRlck5hbWUnLCAoc2hvd1Byb3ZpZGVyTmFtZSkgPT4ge1xuICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgKHNob3dEZWNvcmF0aW9ucykgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnNob3dEZWNvcmF0aW9ucyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuc2hvd0RlY29yYXRpb25zID0gc2hvd0RlY29yYXRpb25zXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsIChndXR0ZXJQb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLmd1dHRlclBvc2l0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgdGhpcy5ndXR0ZXJQb3NpdGlvbiA9IGd1dHRlclBvc2l0aW9uXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pKVxuXG4gICAgbGV0IHRvb2x0aXBTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnRvb2x0aXBGb2xsb3dzJywgKHRvb2x0aXBGb2xsb3dzKSA9PiB7XG4gICAgICBpZiAodG9vbHRpcFN1YnNjcmlwdGlvbikge1xuICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbiA9IHRvb2x0aXBGb2xsb3dzID09PSAnTW91c2UnID8gdGhpcy5saXN0ZW5Gb3JNb3VzZU1vdmVtZW50KCkgOiB0aGlzLmxpc3RlbkZvcktleWJvYXJkTW92ZW1lbnQoKVxuICAgICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICB9KSlcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgdGhpcy5saXN0ZW5Gb3JDdXJyZW50TGluZSgpXG4gIH1cbiAgbGlzdGVuRm9yQ3VycmVudExpbmUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRleHRFZGl0b3Iub2JzZXJ2ZUN1cnNvcnMoKGN1cnNvcikgPT4ge1xuICAgICAgbGV0IG1hcmtlclxuICAgICAgbGV0IGxhc3RSYW5nZVxuICAgICAgbGV0IGxhc3RFbXB0eVxuICAgICAgY29uc3QgaGFuZGxlUG9zaXRpb25DaGFuZ2UgPSAoeyBzdGFydCwgZW5kIH0pID0+IHtcbiAgICAgICAgY29uc3QgZ3V0dGVyID0gdGhpcy5ndXR0ZXJcbiAgICAgICAgaWYgKCFndXR0ZXIpIHJldHVyblxuICAgICAgICAvLyBXZSBuZWVkIHRoYXQgUmFuZ2UuZnJvbU9iamVjdCBoYWNrIGJlbG93IGJlY2F1c2Ugd2hlbiB3ZSBmb2N1cyBpbmRleCAwIG9uIG11bHRpLWxpbmUgc2VsZWN0aW9uXG4gICAgICAgIC8vIGVuZC5jb2x1bW4gaXMgdGhlIGNvbHVtbiBvZiB0aGUgbGFzdCBsaW5lIGJ1dCBtYWtpbmcgYSByYW5nZSBvdXQgb2YgdHdvIGFuZCB0aGVuIGFjY2VzaW5nXG4gICAgICAgIC8vIHRoZSBlbmQgc2VlbXMgdG8gZml4IGl0IChibGFjayBtYWdpYz8pXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3N0YXJ0LCBlbmRdKVxuICAgICAgICBjb25zdCBsaW5lc1JhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbW3N0YXJ0LnJvdywgMF0sIFtlbmQucm93LCBJbmZpbml0eV1dKVxuICAgICAgICBjb25zdCBjdXJyZW50RW1wdHkgPSBjdXJyZW50UmFuZ2UuaXNFbXB0eSgpXG5cbiAgICAgICAgLy8gTk9URTogQXRvbSBkb2VzIG5vdCBwYWludCBndXR0ZXIgaWYgbXVsdGktbGluZSBhbmQgbGFzdCBsaW5lIGhhcyB6ZXJvIGluZGV4XG4gICAgICAgIGlmIChzdGFydC5yb3cgIT09IGVuZC5yb3cgJiYgY3VycmVudFJhbmdlLmVuZC5jb2x1bW4gPT09IDApIHtcbiAgICAgICAgICBsaW5lc1JhbmdlLmVuZC5yb3ctLVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0UmFuZ2UgJiYgbGFzdFJhbmdlLmlzRXF1YWwobGluZXNSYW5nZSkgJiYgY3VycmVudEVtcHR5ID09PSBsYXN0RW1wdHkpIHJldHVyblxuICAgICAgICBpZiAobWFya2VyKSBtYXJrZXIuZGVzdHJveSgpXG4gICAgICAgIGxhc3RSYW5nZSA9IGxpbmVzUmFuZ2VcbiAgICAgICAgbGFzdEVtcHR5ID0gY3VycmVudEVtcHR5XG5cbiAgICAgICAgbWFya2VyID0gdGhpcy50ZXh0RWRpdG9yLm1hcmtTY3JlZW5SYW5nZShsaW5lc1JhbmdlLCB7XG4gICAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGBsaW5lLW51bWJlciBjdXJzb3ItbGluZSBsaW50ZXItY3Vyc29yLWxpbmUgJHtjdXJyZW50RW1wdHkgPyAnY3Vyc29yLWxpbmUtbm8tc2VsZWN0aW9uJyA6ICcnfWBcbiAgICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3Vyc29yTWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoY3Vyc29yTWFya2VyLm9uRGlkQ2hhbmdlKCh7IG5ld0hlYWRTY3JlZW5Qb3NpdGlvbiwgbmV3VGFpbFNjcmVlblBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2UoeyBzdGFydDogbmV3SGVhZFNjcmVlblBvc2l0aW9uLCBlbmQ6IG5ld1RhaWxTY3JlZW5Qb3NpdGlvbiB9KVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChjdXJzb3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb25zKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG1hcmtlcikgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfSkpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHN1YnNjcmlwdGlvbnMpXG4gICAgICBoYW5kbGVQb3NpdGlvbkNoYW5nZShjdXJzb3JNYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKSlcbiAgICB9KSlcbiAgfVxuICBsaXN0ZW5Gb3JNb3VzZU1vdmVtZW50KCkge1xuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy50ZXh0RWRpdG9yKVxuXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVFdmVudChlZGl0b3JFbGVtZW50LCAnbW91c2Vtb3ZlJywgZGVib3VuY2UoKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIWVkaXRvckVsZW1lbnQuY29tcG9uZW50IHx8ICFoYXNQYXJlbnQoZXZlbnQudGFyZ2V0LCAnZGl2LnNjcm9sbC12aWV3JykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCB0b29sdGlwID0gdGhpcy50b29sdGlwXG4gICAgICBpZiAodG9vbHRpcCAmJiBtb3VzZUV2ZW50TmVhclBvc2l0aW9uKHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGVkaXRvcjogdGhpcy50ZXh0RWRpdG9yLFxuICAgICAgICBlZGl0b3JFbGVtZW50LFxuICAgICAgICB0b29sdGlwRWxlbWVudDogdG9vbHRpcC5lbGVtZW50LFxuICAgICAgICBzY3JlZW5Qb3NpdGlvbjogdG9vbHRpcC5tYXJrZXIuZ2V0U3RhcnRTY3JlZW5Qb3NpdGlvbigpLFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50KGV2ZW50LCB0aGlzLnRleHRFZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICBpZiAodGhpcy50ZXh0RWRpdG9yLmxhcmdlRmlsZU1vZGUpIHtcbiAgICAgICAgLy8gTk9URTogSWdub3JlIGlmIGZpbGUgaXMgdG9vIGxhcmdlXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBudWxsXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jdXJzb3JQb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAodGhpcy5jdXJzb3JQb3NpdGlvbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICB9XG4gICAgfSwgMzAwLCB0cnVlKSlcbiAgfVxuICBsaXN0ZW5Gb3JLZXlib2FyZE1vdmVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWJvdW5jZSgoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbmV3QnVmZmVyUG9zaXRpb25cbiAgICAgIHRoaXMudXBkYXRlVG9vbHRpcChuZXdCdWZmZXJQb3NpdGlvbilcbiAgICB9LCA2MCkpXG4gIH1cbiAgdXBkYXRlR3V0dGVyKCkge1xuICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICBpZiAoIXRoaXMuc2hvd0RlY29yYXRpb25zKSB7XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwcmlvcml0eSA9IHRoaXMuZ3V0dGVyUG9zaXRpb24gPT09ICdMZWZ0JyA/IC0xMDAgOiAxMDBcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMudGV4dEVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgbmFtZTogJ2xpbnRlci11aS1kZWZhdWx0JyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goKG1hcmtlciwgbWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIsICdndXR0ZXInKVxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlR3V0dGVyKCkge1xuICAgIGlmICh0aGlzLmd1dHRlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVzdHJveSgpXG4gICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIC8qIFRoaXMgdGhyb3dzIHdoZW4gdGhlIHRleHQgZWRpdG9yIGlzIGRpc3Bvc2VkICovXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVRvb2x0aXAocG9zaXRpb246ID9Qb2ludCkge1xuICAgIGlmICghcG9zaXRpb24gfHwgKHRoaXMudG9vbHRpcCAmJiB0aGlzLnRvb2x0aXAuaXNWYWxpZChwb3NpdGlvbiwgdGhpcy5tZXNzYWdlcykpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICBpZiAoIXRoaXMuc2hvd1Rvb2x0aXApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCh0aGlzLm1lc3NhZ2VzLCB0aGlzLnRleHRFZGl0b3IuZ2V0UGF0aCgpLCBwb3NpdGlvbilcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwID0gbmV3IFRvb2x0aXAobWVzc2FnZXMsIHBvc2l0aW9uLCB0aGlzLnRleHRFZGl0b3IpXG4gICAgdGhpcy50b29sdGlwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgfSlcbiAgfVxuICByZW1vdmVUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5tYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICB9XG4gIGFwcGx5KGFkZGVkOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcmVtb3ZlZDogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICBjb25zdCB0ZXh0QnVmZmVyID0gdGhpcy50ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmVtb3ZlZC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHJlbW92ZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubWFya2Vycy5nZXQobWVzc2FnZSlcbiAgICAgIGlmIChtYXJrZXIpIHtcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIHRoaXMubWFya2Vycy5kZWxldGUobWVzc2FnZSlcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gYWRkZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhZGRlZFtpXVxuICAgICAgY29uc3QgbWFya2VyUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGlmICghbWFya2VyUmFuZ2UpIHtcbiAgICAgICAgLy8gT25seSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGV4dEJ1ZmZlci5tYXJrUmFuZ2UobWFya2VyUmFuZ2UsIHtcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgIH0pXG4gICAgICB0aGlzLm1hcmtlcnMuc2V0KG1lc3NhZ2UsIG1hcmtlcilcbiAgICAgIHRoaXMubWVzc2FnZXMuYWRkKG1lc3NhZ2UpXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKHsgb2xkSGVhZFBvc2l0aW9uLCBuZXdIZWFkUG9zaXRpb24sIGlzVmFsaWQgfSkgPT4ge1xuICAgICAgICBpZiAoIWlzVmFsaWQgfHwgKG5ld0hlYWRQb3NpdGlvbi5yb3cgPT09IDAgJiYgb2xkSGVhZFBvc2l0aW9uLnJvdyAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxKSB7XG4gICAgICAgICAgbWVzc2FnZS5yYW5nZSA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gbWFya2VyLnByZXZpb3VzRXZlbnRTdGF0ZS5yYW5nZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUb29sdGlwKHRoaXMuY3Vyc29yUG9zaXRpb24pXG4gIH1cbiAgZGVjb3JhdGVNYXJrZXIobWVzc2FnZTogTGludGVyTWVzc2FnZSwgbWFya2VyOiBPYmplY3QsIHBhaW50OiAnZ3V0dGVyJyB8ICdlZGl0b3InIHwgJ2JvdGgnID0gJ2JvdGgnKSB7XG4gICAgaWYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdlZGl0b3InKSB7XG4gICAgICB0aGlzLnRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICBjbGFzczogYGxpbnRlci1oaWdobGlnaHQgbGludGVyLSR7bWVzc2FnZS5zZXZlcml0eX1gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBndXR0ZXIgPSB0aGlzLmd1dHRlclxuICAgIGlmIChndXR0ZXIgJiYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdndXR0ZXInKSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBgbGludGVyLWd1dHRlciBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9IGljb24gaWNvbi0ke21lc3NhZ2UuaWNvbiB8fCAncHJpbWl0aXZlLWRvdCd9YFxuICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvclxuIl19
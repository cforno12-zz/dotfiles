Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _sbEventKit = require('sb-event-kit');

var _helpers = require('./helpers');

// NOTE:
// We don't *need* to add the intentions:hide command
// But we're doing it anyway because it helps us keep the code clean
// And can also be used by any other package to fully control this package

// List of core commands we allow during the list, everything else closes it
var CORE_COMMANDS = new Set(['core:move-up', 'core:move-down', 'core:page-up', 'core:page-down', 'core:move-to-top', 'core:move-to-bottom']);

var Commands = (function () {
  function Commands() {
    _classCallCheck(this, Commands);

    this.active = null;
    this.emitter = new _sbEventKit.Emitter();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(Commands, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
        'intentions:show': function intentionsShow(e) {
          if (_this.active && _this.active.type === 'list') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processListShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }

          setImmediate(function () {
            var matched = true;

            subscriptions.add(atom.keymaps.onDidMatchBinding(function (_ref) {
              var binding = _ref.binding;

              matched = matched && CORE_COMMANDS.has(binding.command);
            }));
            subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function () {
              if (matched) {
                return;
              }
              subscriptions.dispose();
              _this.processListHide();
            }));
          });
        },
        'intentions:hide': function intentionsHide() {
          _this.processListHide();
        },
        'intentions:highlight': function intentionsHighlight(e) {
          if (_this.active && _this.active.type === 'highlight') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processHighlightsShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }
          var keyCode = e.originalEvent.keyCode;
          subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function (upE) {
            if (upE.keyCode !== keyCode) {
              return;
            }
            subscriptions.dispose();
            _this.processHighlightsHide();
          }));
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor.intentions-list:not([mini])', {
        'intentions:confirm': (0, _helpers.stoppingEvent)(function () {
          _this.processListConfirm();
        }),
        'core:move-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('up');
        }),
        'core:move-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('down');
        }),
        'core:page-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-up');
        }),
        'core:page-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-down');
        }),
        'core:move-to-top': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-top');
        }),
        'core:move-to-bottom': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-bottom');
        })
      }));
    }
  }, {
    key: 'processListShow',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'list':
            throw new Error('Already active');
          case 'highlight':
            this.processHighlightsHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!(yield this.shouldListShow(editor))) {
        return;
      }
      this.active = { type: 'list', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this2.active && _this2.active.type === 'list' && _this2.active.subscriptions === subscriptions) {
          _this2.processListHide();
          _this2.active = null;
        }
        editorElement.classList.remove('intentions-list');
      });
      subscriptions.add((0, _disposableEvent2['default'])(document.body, 'mouseup', function () {
        setTimeout(function () {
          subscriptions.dispose();
        }, 10);
      }));
      editorElement.classList.add('intentions-list');
    })
  }, {
    key: 'processListHide',
    value: function processListHide() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('list-hide');
    }
  }, {
    key: 'processListMove',
    value: function processListMove(movement) {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-move', movement);
    }
  }, {
    key: 'processListConfirm',
    value: function processListConfirm() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-confirm');
    }
  }, {
    key: 'processHighlightsShow',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'highlight':
            throw new Error('Already active');
          case 'list':
            this.processListHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      var shouldProcess = yield this.shouldHighlightsShow(editor);
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!shouldProcess) {
        return;
      }
      this.active = { type: 'highlight', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this3.active && _this3.active.type === 'highlight' && _this3.active.subscriptions === subscriptions) {
          _this3.processHighlightsHide();
        }
        editorElement.classList.remove('intentions-highlights');
      });
      editorElement.classList.add('intentions-highlights');
    })
  }, {
    key: 'processHighlightsHide',
    value: function processHighlightsHide() {
      if (!this.active || this.active.type !== 'highlight') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('highlights-hide');
    }
  }, {
    key: 'shouldListShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('list-show', event);
      return event.show;
    })
  }, {
    key: 'shouldHighlightsShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('highlights-show', event);
      return event.show;
    })
  }, {
    key: 'onListShow',
    value: function onListShow(callback) {
      return this.emitter.on('list-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onListHide',
    value: function onListHide(callback) {
      return this.emitter.on('list-hide', callback);
    }
  }, {
    key: 'onListMove',
    value: function onListMove(callback) {
      return this.emitter.on('list-move', callback);
    }
  }, {
    key: 'onListConfirm',
    value: function onListConfirm(callback) {
      return this.emitter.on('list-confirm', callback);
    }
  }, {
    key: 'onHighlightsShow',
    value: function onHighlightsShow(callback) {
      return this.emitter.on('highlights-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onHighlightsHide',
    value: function onHighlightsHide(callback) {
      return this.emitter.on('highlights-hide', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.subscriptions.dispose();
      }
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OytCQUU0QixrQkFBa0I7Ozs7MEJBQ1csY0FBYzs7dUJBR3pDLFdBQVc7Ozs7Ozs7O0FBU3pDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7O0lBRXpILFFBQVE7QUFRaEIsV0FSUSxRQUFRLEdBUWI7MEJBUkssUUFBUTs7QUFTekIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyx5QkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFka0IsUUFBUTs7V0FlbkIsb0JBQUc7OztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFO0FBQ3ZFLHlCQUFpQixFQUFFLHdCQUFDLENBQUMsRUFBSztBQUN4QixjQUFJLE1BQUssTUFBTSxJQUFJLE1BQUssTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDOUMsbUJBQU07V0FDUDtBQUNELGNBQU0sYUFBYSxHQUFHLHFDQUF5QixDQUFBO0FBQy9DLGdCQUFLLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQTs7QUFFbkMsY0FBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQzFELG1CQUFNO1dBQ1A7O0FBRUQsc0JB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UyxvQkFBQyxRQUFxQixFQUFFO0FBQ2hDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzlDOzs7V0FDUyxvQkFBQyxRQUEyQyxFQUFFO0FBQ3RELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzlDOzs7V0FDWSx1QkFBQyxRQUFxQixFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2pEOzs7V0FDZSwwQkFBQyxRQUFvRCxFQUFFO0FBQ3JFLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBUyxLQUFLLEVBQUU7QUFDeEQsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNsRCxlQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUE7U0FDdEIsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUNlLDBCQUFDLFFBQXFCLEVBQUU7QUFDdEMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNwRDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3BDO0tBQ0Y7OztTQXRPa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgeyBzdG9wcGluZ0V2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaXN0TW92ZW1lbnQgfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBOT1RFOlxuLy8gV2UgZG9uJ3QgKm5lZWQqIHRvIGFkZCB0aGUgaW50ZW50aW9uczpoaWRlIGNvbW1hbmRcbi8vIEJ1dCB3ZSdyZSBkb2luZyBpdCBhbnl3YXkgYmVjYXVzZSBpdCBoZWxwcyB1cyBrZWVwIHRoZSBjb2RlIGNsZWFuXG4vLyBBbmQgY2FuIGFsc28gYmUgdXNlZCBieSBhbnkgb3RoZXIgcGFja2FnZSB0byBmdWxseSBjb250cm9sIHRoaXMgcGFja2FnZVxuXG4vLyBMaXN0IG9mIGNvcmUgY29tbWFuZHMgd2UgYWxsb3cgZHVyaW5nIHRoZSBsaXN0LCBldmVyeXRoaW5nIGVsc2UgY2xvc2VzIGl0XG5jb25zdCBDT1JFX0NPTU1BTkRTID0gbmV3IFNldChbJ2NvcmU6bW92ZS11cCcsICdjb3JlOm1vdmUtZG93bicsICdjb3JlOnBhZ2UtdXAnLCAnY29yZTpwYWdlLWRvd24nLCAnY29yZTptb3ZlLXRvLXRvcCcsICdjb3JlOm1vdmUtdG8tYm90dG9tJ10pXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRzIHtcbiAgYWN0aXZlOiA/e1xuICAgIHR5cGU6ICdsaXN0JyB8ICdoaWdobGlnaHQnLFxuICAgIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGUsXG4gIH07XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLCB7XG4gICAgICAnaW50ZW50aW9uczpzaG93JzogKGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RTaG93KHN1YnNjcmlwdGlvbnMpXG5cbiAgICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQgfHwgZS5vcmlnaW5hbEV2ZW50LnR5cGUgIT09ICdrZXlkb3duJykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgICBsZXQgbWF0Y2hlZCA9IHRydWVcblxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20ua2V5bWFwcy5vbkRpZE1hdGNoQmluZGluZyhmdW5jdGlvbih7IGJpbmRpbmcgfSkge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IG1hdGNoZWQgJiYgQ09SRV9DT01NQU5EUy5oYXMoYmluZGluZy5jb21tYW5kKVxuICAgICAgICAgIH0pKVxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGVFdmVudChkb2N1bWVudC5ib2R5LCAna2V5dXAnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgJ2ludGVudGlvbnM6aGlkZSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgfSxcbiAgICAgICdpbnRlbnRpb25zOmhpZ2hsaWdodCc6IChlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiB0aGlzLmFjdGl2ZS50eXBlID09PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIHRoaXMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KHN1YnNjcmlwdGlvbnMpXG5cbiAgICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQgfHwgZS5vcmlnaW5hbEV2ZW50LnR5cGUgIT09ICdrZXlkb3duJykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleUNvZGUgPSBlLm9yaWdpbmFsRXZlbnQua2V5Q29kZVxuICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChkaXNwb3NhYmxlRXZlbnQoZG9jdW1lbnQuYm9keSwgJ2tleXVwJywgKHVwRSkgPT4ge1xuICAgICAgICAgIGlmICh1cEUua2V5Q29kZSAhPT0ga2V5Q29kZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICB9KSlcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvci5pbnRlbnRpb25zLWxpc3Q6bm90KFttaW5pXSknLCB7XG4gICAgICAnaW50ZW50aW9uczpjb25maXJtJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6bW92ZS11cCc6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgndXAnKVxuICAgICAgfSksXG4gICAgICAnY29yZTptb3ZlLWRvd24nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgfSksXG4gICAgICAnY29yZTpwYWdlLXVwJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdwYWdlLXVwJylcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6cGFnZS1kb3duJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdwYWdlLWRvd24nKVxuICAgICAgfSksXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgnbW92ZS10by10b3AnKVxuICAgICAgfSksXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgnbW92ZS10by1ib3R0b20nKVxuICAgICAgfSksXG4gICAgfSkpXG4gIH1cbiAgYXN5bmMgcHJvY2Vzc0xpc3RTaG93KHN1YnNjcmlwdGlvbjogPyhDb21wb3NpdGVEaXNwb3NhYmxlIHwgRGlzcG9zYWJsZSkgPSBudWxsKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuYWN0aXZlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSByZXR1cm5cbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHN1YnNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBpZiAoIWF3YWl0IHRoaXMuc2hvdWxkTGlzdFNob3coZWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnMgfVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiB0aGlzLmFjdGl2ZS50eXBlID09PSAnbGlzdCcgJiYgdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9ucyA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgICAgfVxuICAgICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRlbnRpb25zLWxpc3QnKVxuICAgIH0pXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZUV2ZW50KGRvY3VtZW50LmJvZHksICdtb3VzZXVwJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSwgMTApXG4gICAgfSkpXG4gICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbnRlbnRpb25zLWxpc3QnKVxuICB9XG4gIHByb2Nlc3NMaXN0SGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlIHx8IHRoaXMuYWN0aXZlLnR5cGUgIT09ICdsaXN0Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zXG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGlzdC1oaWRlJylcbiAgfVxuICBwcm9jZXNzTGlzdE1vdmUobW92ZW1lbnQ6IExpc3RNb3ZlbWVudCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2xpc3QnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3QtbW92ZScsIG1vdmVtZW50KVxuICB9XG4gIHByb2Nlc3NMaXN0Q29uZmlybSgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlIHx8IHRoaXMuYWN0aXZlLnR5cGUgIT09ICdsaXN0Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsaXN0LWNvbmZpcm0nKVxuICB9XG4gIGFzeW5jIHByb2Nlc3NIaWdobGlnaHRzU2hvdyhzdWJzY3JpcHRpb246ID8oQ29tcG9zaXRlRGlzcG9zYWJsZSB8IERpc3Bvc2FibGUpID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgc3dpdGNoICh0aGlzLmFjdGl2ZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuXG4gICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBjb25zdCBzaG91bGRQcm9jZXNzID0gYXdhaXQgdGhpcy5zaG91bGRIaWdobGlnaHRzU2hvdyhlZGl0b3IpXG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGlmICghc2hvdWxkUHJvY2Vzcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0geyB0eXBlOiAnaGlnaGxpZ2h0Jywgc3Vic2NyaXB0aW9ucyB9XG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdoaWdobGlnaHQnICYmIHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnMgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgfVxuICAgICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKVxuICAgIH0pXG4gICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKVxuICB9XG4gIHByb2Nlc3NIaWdobGlnaHRzSGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlIHx8IHRoaXMuYWN0aXZlLnR5cGUgIT09ICdoaWdobGlnaHQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdoaWdobGlnaHRzLWhpZGUnKVxuICB9XG4gIGFzeW5jIHNob3VsZExpc3RTaG93KGVkaXRvcjogVGV4dEVkaXRvcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGV2ZW50ID0geyBzaG93OiBmYWxzZSwgZWRpdG9yIH1cbiAgICBhd2FpdCB0aGlzLmVtaXR0ZXIuZW1pdCgnbGlzdC1zaG93JywgZXZlbnQpXG4gICAgcmV0dXJuIGV2ZW50LnNob3dcbiAgfVxuICBhc3luYyBzaG91bGRIaWdobGlnaHRzU2hvdyhlZGl0b3I6IFRleHRFZGl0b3IpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBldmVudCA9IHsgc2hvdzogZmFsc2UsIGVkaXRvciB9XG4gICAgYXdhaXQgdGhpcy5lbWl0dGVyLmVtaXQoJ2hpZ2hsaWdodHMtc2hvdycsIGV2ZW50KVxuICAgIHJldHVybiBldmVudC5zaG93XG4gIH1cbiAgb25MaXN0U2hvdyhjYWxsYmFjazogKChlZGl0b3I6IFRleHRFZGl0b3IpID0+IFByb21pc2U8Ym9vbGVhbj4pKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbGlzdC1zaG93JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhldmVudC5lZGl0b3IpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGV2ZW50LnNob3cgPSAhIXJlc3VsdFxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIG9uTGlzdEhpZGUoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbGlzdC1oaWRlJywgY2FsbGJhY2spXG4gIH1cbiAgb25MaXN0TW92ZShjYWxsYmFjazogKChtb3ZlbWVudDogTGlzdE1vdmVtZW50KSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbGlzdC1tb3ZlJywgY2FsbGJhY2spXG4gIH1cbiAgb25MaXN0Q29uZmlybShjYWxsYmFjazogKCgpID0+IGFueSkpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdsaXN0LWNvbmZpcm0nLCBjYWxsYmFjaylcbiAgfVxuICBvbkhpZ2hsaWdodHNTaG93KGNhbGxiYWNrOiAoKGVkaXRvcjogVGV4dEVkaXRvcikgPT4gUHJvbWlzZTxib29sZWFuPikpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdoaWdobGlnaHRzLXNob3cnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGV2ZW50LmVkaXRvcikudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgZXZlbnQuc2hvdyA9ICEhcmVzdWx0XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgb25IaWdobGlnaHRzSGlkZShjYWxsYmFjazogKCgpID0+IGFueSkpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdoaWdobGlnaHRzLWhpZGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICB9XG59XG4iXX0=
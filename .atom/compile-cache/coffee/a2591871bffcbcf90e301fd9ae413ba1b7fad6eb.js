(function() {
  module.exports = function() {
    return {
      Parent: null,
      SmartColor: (require('./modules/SmartColor'))(),
      SmartVariable: (require('./modules/SmartVariable'))(),
      Emitter: (require('./modules/Emitter'))(),
      extensions: {},
      getExtension: function(extensionName) {
        return this.extensions[extensionName];
      },
      isFirstOpen: true,
      canOpen: true,
      element: null,
      selection: null,
      listeners: [],
      activate: function() {
        var _workspace, _workspaceView, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize;
        _workspace = atom.workspace;
        _workspaceView = atom.views.getView(_workspace);
        this.element = {
          el: (function() {
            var _el;
            _el = document.createElement('div');
            _el.classList.add('ColorPicker');
            return _el;
          })(),
          remove: function() {
            return this.el.parentNode.removeChild(this.el);
          },
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setHeight: function(height) {
            return this.el.style.height = height + "px";
          },
          hasChild: function(child) {
            var _parent;
            if (child && (_parent = child.parentNode)) {
              if (child === this.el) {
                return true;
              } else {
                return this.hasChild(_parent);
              }
            }
            return false;
          },
          isOpen: function() {
            return this.hasClass('is--open');
          },
          open: function() {
            return this.addClass('is--open');
          },
          close: function() {
            return this.removeClass('is--open');
          },
          isFlipped: function() {
            return this.hasClass('is--flipped');
          },
          flip: function() {
            return this.addClass('is--flipped');
          },
          unflip: function() {
            return this.removeClass('is--flipped');
          },
          setPosition: function(x, y) {
            this.el.style.left = x + "px";
            this.el.style.top = y + "px";
            return this;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        this.loadExtensions();
        this.listeners.push([
          'mousedown', onMouseDown = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              _this.emitMouseDown(e, _isPickerEvent);
              if (!_isPickerEvent) {
                return _this.close();
              }
            };
          })(this)
        ]);
        window.addEventListener('mousedown', onMouseDown, true);
        this.listeners.push([
          'mousemove', onMouseMove = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseMove(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousemove', onMouseMove, true);
        this.listeners.push([
          'mouseup', onMouseUp = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseUp(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mouseup', onMouseUp, true);
        this.listeners.push([
          'mousewheel', onMouseWheel = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseWheel(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousewheel', onMouseWheel);
        _workspaceView.addEventListener('keydown', (function(_this) {
          return function(e) {
            var _isPickerEvent;
            if (!_this.element.isOpen()) {
              return;
            }
            _isPickerEvent = _this.element.hasChild(e.target);
            _this.emitKeyDown(e, _isPickerEvent);
            return _this.close();
          };
        })(this));
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var _editorView, _subscriptionLeft, _subscriptionTop;
            _editorView = atom.views.getView(editor);
            _subscriptionTop = _editorView.onDidChangeScrollTop(function() {
              return _this.close();
            });
            _subscriptionLeft = _editorView.onDidChangeScrollLeft(function() {
              return _this.close();
            });
            editor.onDidDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
            _this.onBeforeDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
          };
        })(this));
        this.listeners.push([
          'resize', onResize = (function(_this) {
            return function() {
              return _this.close();
            };
          })(this)
        ]);
        window.addEventListener('resize', onResize);
        _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        this.close();
        this.canOpen = true;
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _listener, i, len, ref, ref1;
        this.emitBeforeDestroy();
        ref = this.listeners;
        for (i = 0, len = ref.length; i < len; i++) {
          ref1 = ref[i], _event = ref1[0], _listener = ref1[1];
          window.removeEventListener(_event, _listener);
        }
        this.element.remove();
        return this.canOpen = false;
      },
      loadExtensions: function() {
        var _extension, _requiredExtension, i, len, ref;
        ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (i = 0, len = ref.length; i < len; i++) {
          _extension = ref[i];
          _requiredExtension = (require("./extensions/" + _extension))(this);
          this.extensions[_extension] = _requiredExtension;
          if (typeof _requiredExtension.activate === "function") {
            _requiredExtension.activate();
          }
        }
      },
      emitMouseDown: function(e, isOnPicker) {
        return this.Emitter.emit('mouseDown', e, isOnPicker);
      },
      onMouseDown: function(callback) {
        return this.Emitter.on('mouseDown', callback);
      },
      emitMouseMove: function(e, isOnPicker) {
        return this.Emitter.emit('mouseMove', e, isOnPicker);
      },
      onMouseMove: function(callback) {
        return this.Emitter.on('mouseMove', callback);
      },
      emitMouseUp: function(e, isOnPicker) {
        return this.Emitter.emit('mouseUp', e, isOnPicker);
      },
      onMouseUp: function(callback) {
        return this.Emitter.on('mouseUp', callback);
      },
      emitMouseWheel: function(e, isOnPicker) {
        return this.Emitter.emit('mouseWheel', e, isOnPicker);
      },
      onMouseWheel: function(callback) {
        return this.Emitter.on('mouseWheel', callback);
      },
      emitKeyDown: function(e, isOnPicker) {
        return this.Emitter.emit('keyDown', e, isOnPicker);
      },
      onKeyDown: function(callback) {
        return this.Emitter.on('keyDown', callback);
      },
      emitPositionChange: function(position, colorPickerPosition) {
        return this.Emitter.emit('positionChange', position, colorPickerPosition);
      },
      onPositionChange: function(callback) {
        return this.Emitter.on('positionChange', callback);
      },
      emitOpen: function() {
        return this.Emitter.emit('open');
      },
      onOpen: function(callback) {
        return this.Emitter.on('open', callback);
      },
      emitBeforeOpen: function() {
        return this.Emitter.emit('beforeOpen');
      },
      onBeforeOpen: function(callback) {
        return this.Emitter.on('beforeOpen', callback);
      },
      emitClose: function() {
        return this.Emitter.emit('close');
      },
      onClose: function(callback) {
        return this.Emitter.on('close', callback);
      },
      emitBeforeDestroy: function() {
        return this.Emitter.emit('beforeDestroy');
      },
      onBeforeDestroy: function(callback) {
        return this.Emitter.on('beforeDestroy', callback);
      },
      emitInputColor: function(smartColor, wasFound) {
        if (wasFound == null) {
          wasFound = true;
        }
        return this.Emitter.emit('inputColor', smartColor, wasFound);
      },
      onInputColor: function(callback) {
        return this.Emitter.on('inputColor', callback);
      },
      emitInputVariable: function(match) {
        return this.Emitter.emit('inputVariable', match);
      },
      onInputVariable: function(callback) {
        return this.Emitter.on('inputVariable', callback);
      },
      emitInputVariableColor: function(smartColor, pointer) {
        return this.Emitter.emit('inputVariableColor', smartColor, pointer);
      },
      onInputVariableColor: function(callback) {
        return this.Emitter.on('inputVariableColor', callback);
      },
      open: function(Editor, Cursor) {
        var EditorElement, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (Editor == null) {
          Editor = null;
        }
        if (Cursor == null) {
          Cursor = null;
        }
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        if (!Editor) {
          Editor = atom.workspace.getActiveTextEditor();
        }
        EditorView = atom.views.getView(Editor);
        EditorElement = Editor.getElement();
        if (!EditorView) {
          return;
        }
        this.selection = null;
        if (!Cursor) {
          Cursor = Editor.getLastCursor();
        }
        _visibleRowRange = EditorView.getVisibleRowRange();
        _cursorScreenRow = Cursor.getScreenRow();
        _cursorBufferRow = Cursor.getBufferRow();
        if ((_cursorScreenRow < _visibleRowRange[0]) || (_cursorScreenRow > _visibleRowRange[1])) {
          return;
        }
        _lineContent = Cursor.getCurrentBufferLine();
        _colorMatches = this.SmartColor.find(_lineContent);
        _variableMatches = this.SmartVariable.find(_lineContent, Editor.getPath());
        _matches = _colorMatches.concat(_variableMatches);
        _cursorPosition = EditorElement.pixelPositionForScreenPosition(Cursor.getScreenPosition());
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var i, len;
          for (i = 0, len = _matches.length; i < len; i++) {
            _match = _matches[i];
            if (_match.start <= _cursorColumn && _match.end >= _cursorColumn) {
              return _match;
            }
          }
        })();
        if (_match) {
          Editor.clearSelections();
          _selection = Editor.addSelectionForBufferRange([[_cursorBufferRow, _match.start], [_cursorBufferRow, _match.end]]);
          this.selection = {
            match: _match,
            row: _cursorBufferRow
          };
        } else {
          this.selection = {
            column: _cursorColumn,
            row: _cursorBufferRow
          };
        }
        if (_match) {
          if (_match.isVariable != null) {
            _match.getDefinition().then((function(_this) {
              return function(definition) {
                var _smartColor;
                _smartColor = (_this.SmartColor.find(definition.value))[0].getSmartColor();
                return _this.emitInputVariableColor(_smartColor, definition.pointer);
              };
            })(this))["catch"]((function(_this) {
              return function(error) {
                return _this.emitInputVariableColor(false);
              };
            })(this));
            this.emitInputVariable(_match);
          } else {
            this.emitInputColor(_match.getSmartColor());
          }
        } else if (atom.config.get('color-picker.randomColor')) {
          _randomColor = this.SmartColor.RGBArray([((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0]);
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          _convertedColor = _randomColor["to" + _preferredFormat]();
          _randomColor = this.SmartColor[_preferredFormat](_convertedColor);
          this.emitInputColor(_randomColor, false);
        } else if (this.isFirstOpen) {
          _redColor = this.SmartColor.HEX('#f00');
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          if (_redColor.format !== _preferredFormat) {
            _convertedColor = _redColor["to" + _preferredFormat]();
            _redColor = this.SmartColor[_preferredFormat](_convertedColor);
          }
          this.isFirstOpen = false;
          this.emitInputColor(_redColor, false);
        }
        PaneView = atom.views.getView(atom.workspace.getActivePane());
        _paneOffsetTop = PaneView.offsetTop;
        _paneOffsetLeft = PaneView.offsetLeft;
        _editorOffsetTop = EditorView.parentNode.offsetTop;
        _editorOffsetLeft = EditorView.querySelector('.scroll-view').offsetLeft;
        _editorScrollTop = EditorView.getScrollTop();
        _lineHeight = Editor.getLineHeightInPixels();
        _lineOffsetLeft = EditorView.querySelector('.line').offsetLeft;
        if (_match) {
          _rect = EditorElement.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _lineHeight - _editorScrollTop + _editorOffsetTop;
        _totalOffsetLeft = _paneOffsetLeft + _editorOffsetLeft + _lineOffsetLeft;
        _position = {
          x: _cursorPosition.left + _totalOffsetLeft,
          y: _cursorPosition.top + _totalOffsetTop
        };
        _colorPickerPosition = {
          x: (function(_this) {
            return function() {
              var _colorPickerWidth, _halfColorPickerWidth, _x;
              _colorPickerWidth = _this.element.width();
              _halfColorPickerWidth = (_colorPickerWidth / 2) << 0;
              _x = Math.max(10, _position.x - _halfColorPickerWidth);
              _x = Math.min(_this.Parent.offsetWidth - _colorPickerWidth - 10, _x);
              return _x;
            };
          })(this)(),
          y: (function(_this) {
            return function() {
              _this.element.unflip();
              if (_this.element.height() + _position.y > _this.Parent.offsetHeight - 32) {
                _this.element.flip();
                return _position.y - _lineHeight - _this.element.height();
              } else {
                return _position.y;
              }
            };
          })(this)()
        };
        this.element.setPosition(_colorPickerPosition.x, _colorPickerPosition.y);
        this.emitPositionChange(_position, _colorPickerPosition);
        requestAnimationFrame((function(_this) {
          return function() {
            _this.element.open();
            return _this.emitOpen();
          };
        })(this));
        return true;
      },
      canReplace: true,
      replace: function(color) {
        var Editor, _cursorEnd, _cursorStart;
        if (!this.canReplace) {
          return;
        }
        this.canReplace = false;
        Editor = atom.workspace.getActiveTextEditor();
        Editor.clearSelections();
        if (this.selection.match) {
          _cursorStart = this.selection.match.start;
          _cursorEnd = this.selection.match.end;
        } else {
          _cursorStart = _cursorEnd = this.selection.column;
        }
        Editor.addSelectionForBufferRange([[this.selection.row, _cursorStart], [this.selection.row, _cursorEnd]]);
        Editor.replaceSelectedText(null, (function(_this) {
          return function() {
            return color;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((ref = _this.selection.match) != null) {
              ref.end = _cursorStart + color.length;
            }
            Editor.addSelectionForBufferRange([[_this.selection.row, _cursorStart], [_this.selection.row, _cursorStart + color.length]]);
            return setTimeout((function() {
              return _this.canReplace = true;
            }), 100);
          };
        })(this));
      },
      close: function() {
        this.element.close();
        return this.emitClose();
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL0NvbG9yUGlja2VyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlJO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtXQUNiO01BQUEsTUFBQSxFQUFRLElBQVI7TUFFQSxVQUFBLEVBQVksQ0FBQyxPQUFBLENBQVEsc0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FGWjtNQUdBLGFBQUEsRUFBZSxDQUFDLE9BQUEsQ0FBUSx5QkFBUixDQUFELENBQUEsQ0FBQSxDQUhmO01BSUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBSlQ7TUFNQSxVQUFBLEVBQVksRUFOWjtNQU9BLFlBQUEsRUFBYyxTQUFDLGFBQUQ7ZUFBbUIsSUFBQyxDQUFBLFVBQVcsQ0FBQSxhQUFBO01BQS9CLENBUGQ7TUFTQSxXQUFBLEVBQWEsSUFUYjtNQVVBLE9BQUEsRUFBUyxJQVZUO01BV0EsT0FBQSxFQUFTLElBWFQ7TUFZQSxTQUFBLEVBQVcsSUFaWDtNQWNBLFNBQUEsRUFBVyxFQWRYO01BbUJBLFFBQUEsRUFBVSxTQUFBO0FBQ04sWUFBQTtRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUM7UUFDbEIsY0FBQSxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkI7UUFJakIsSUFBQyxDQUFBLE9BQUQsR0FDSTtVQUFBLEVBQUEsRUFBTyxDQUFBLFNBQUE7QUFDSCxnQkFBQTtZQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtZQUNOLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixhQUFsQjtBQUVBLG1CQUFPO1VBSkosQ0FBQSxDQUFILENBQUEsQ0FBSjtVQU1BLE1BQUEsRUFBUSxTQUFBO21CQUFHLElBQUMsQ0FB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UyxDQUFDLEdBQVosRUFBaUIsVUFBakIsQ0FGOEIsQ0FBbEM7UUFHQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsSUFBM0IsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRztVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztRQUdBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ1AsZ0JBQUE7WUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FDM0IsS0FBQyxDQUFBLFNBQVMsQ0FBQyxHQURnQixFQUNYLFlBRFcsQ0FBL0I7WUFFQSxNQUFNLENBQUMsZUFBUCxDQUFBOztpQkFHZ0IsQ0FBRSxHQUFsQixHQUF3QixZQUFBLEdBQWUsS0FBSyxDQUFDOztZQUU3QyxNQUFNLENBQUMsMEJBQVAsQ0FBa0MsQ0FDOUIsQ0FBQyxLQUFDLENBQUEsU0FBUyxDQUFDLEdBQVosRUFBaUIsWUFBakIsQ0FEOEIsRUFFOUIsQ0FBQyxLQUFDLENBQUEsU0FBUyxDQUFDLEdBQVosRUFBaUIsWUFBQSxHQUFlLEtBQUssQ0FBQyxNQUF0QyxDQUY4QixDQUFsQztBQUdBLG1CQUFPLFVBQUEsQ0FBVyxDQUFFLFNBQUE7cUJBQUcsS0FBQyxDQUFBLFVBQUQsR0FBYztZQUFqQixDQUFGLENBQVgsRUFBb0MsR0FBcEM7VUFYQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWDtNQW5CSyxDQTNaVDtNQStiQSxLQUFBLEVBQU8sU0FBQTtRQUNILElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBO2VBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUZHLENBL2JQOztFQURhO0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICBDb2xvciBQaWNrZXI6IHZpZXdcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAtPlxuICAgICAgICBQYXJlbnQ6IG51bGxcblxuICAgICAgICBTbWFydENvbG9yOiAocmVxdWlyZSAnLi9tb2R1bGVzL1NtYXJ0Q29sb3InKSgpXG4gICAgICAgIFNtYXJ0VmFyaWFibGU6IChyZXF1aXJlICcuL21vZHVsZXMvU21hcnRWYXJpYWJsZScpKClcbiAgICAgICAgRW1pdHRlcjogKHJlcXVpcmUgJy4vbW9kdWxlcy9FbWl0dGVyJykoKVxuXG4gICAgICAgIGV4dGVuc2lvbnM6IHt9XG4gICAgICAgIGdldEV4dGVuc2lvbjogKGV4dGVuc2lvbk5hbWUpIC0+IEBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdXG5cbiAgICAgICAgaXNGaXJzdE9wZW46IHllc1xuICAgICAgICBjYW5PcGVuOiB5ZXNcbiAgICAgICAgZWxlbWVudDogbnVsbFxuICAgICAgICBzZWxlY3Rpb246IG51bGxcblxuICAgICAgICBsaXN0ZW5lcnM6IFtdXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBDcmVhdGUgYW5kIGFjdGl2YXRlIENvbG9yIFBpY2tlciB2aWV3XG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICAgICAgX3dvcmtzcGFjZSA9IGF0b20ud29ya3NwYWNlXG4gICAgICAgICAgICBfd29ya3NwYWNlVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBfd29ya3NwYWNlXG5cbiAgICAgICAgIyAgQ3JlYXRlIGVsZW1lbnRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEBlbGVtZW50ID1cbiAgICAgICAgICAgICAgICBlbDogZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCAnQ29sb3JQaWNrZXInXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9lbFxuICAgICAgICAgICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICByZW1vdmU6IC0+IEBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkIEBlbFxuXG4gICAgICAgICAgICAgICAgYWRkQ2xhc3M6IChjbGFzc05hbWUpIC0+IEBlbC5jbGFzc0xpc3QuYWRkIGNsYXNzTmFtZTsgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzczogKGNsYXNzTmFtZSkgLT4gQGVsLmNsYXNzTGlzdC5yZW1vdmUgY2xhc3NOYW1lOyByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIGhhc0NsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LmNvbnRhaW5zIGNsYXNzTmFtZVxuXG4gICAgICAgICAgICAgICAgd2lkdGg6IC0+IEBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICAgICAgIGhlaWdodDogLT4gQGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgICAgICAgICAgc2V0SGVpZ2h0OiAoaGVpZ2h0KSAtPiBAZWwuc3R5bGUuaGVpZ2h0ID0gXCIjeyBoZWlnaHQgfXB4XCJcblxuICAgICAgICAgICAgICAgIGhhc0NoaWxkOiAoY2hpbGQpIC0+XG4gICAgICAgICAgICAgICAgICAgIGlmIGNoaWxkIGFuZCBfcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY2hpbGQgaXMgQGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIEBoYXNDaGlsZCBfcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgIyBPcGVuICYgQ2xvc2UgdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAgICAgICAgIGlzT3BlbjogLT4gQGhhc0NsYXNzICdpcy0tb3BlbidcbiAgICAgICAgICAgICAgICBvcGVuOiAtPiBAYWRkQ2xhc3MgJ2lzLS1vcGVuJ1xuICAgICAgICAgICAgICAgIGNsb3NlOiAtPiBAcmVtb3ZlQ2xhc3MgJ2lzLS1vcGVuJ1xuXG4gICAgICAgICAgICAgICAgIyBGbGlwICYgVW5mbGlwIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgICAgICAgICBpc0ZsaXBwZWQ6IC0+IEBoYXNDbGFzcyAnaXMtLWZsaXBwZWQnXG4gICAgICAgICAgICAgICAgZmxpcDogLT4gQGFkZENsYXNzICdpcy0tZmxpcHBlZCdcbiAgICAgICAgICAgICAgICB1bmZsaXA6IC0+IEByZW1vdmVDbGFzcyAnaXMtLWZsaXBwZWQnXG5cbiAgICAgICAgICAgICAgICAjIFNldCBDb2xvciBQaWNrZXIgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAjIC0geCB7TnVtYmVyfVxuICAgICAgICAgICAgICAgICMgLSB5IHtOdW1iZXJ9XG4gICAgICAgICAgICAgICAgc2V0UG9zaXRpb246ICh4LCB5KSAtPlxuICAgICAgICAgICAgICAgICAgICBAZWwuc3R5bGUubGVmdCA9IFwiI3sgeCB9cHhcIlxuICAgICAgICAgICAgICAgICAgICBAZWwuc3R5bGUudG9wID0gXCIjeyB5IH1weFwiXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG5cbiAgICAgICAgICAgICAgICAjIEFkZCBhIGNoaWxkIG9uIHRoZSBDb2xvclBpY2tlciBlbGVtZW50XG4gICAgICAgICAgICAgICAgYWRkOiAoZWxlbWVudCkgLT5cbiAgICAgICAgICAgICAgICAgICAgQGVsLmFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgIEBsb2FkRXh0ZW5zaW9ucygpXG5cbiAgICAgICAgIyAgQ2xvc2UgdGhlIENvbG9yIFBpY2tlciBvbiBhbnkgYWN0aXZpdHkgdW5yZWxhdGVkIHRvIGl0XG4gICAgICAgICMgIGJ1dCBhbHNvIGVtaXQgZXZlbnRzIG9uIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNlZG93bicsIG9uTW91c2VEb3duID0gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0TW91c2VEb3duIGUsIF9pc1BpY2tlckV2ZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIEBjbG9zZSgpIHVubGVzcyBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgdHJ1ZVxuXG4gICAgICAgICAgICBAbGlzdGVuZXJzLnB1c2ggWydtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSA9IChlKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQuaXNPcGVuKClcblxuICAgICAgICAgICAgICAgIF9pc1BpY2tlckV2ZW50ID0gQGVsZW1lbnQuaGFzQ2hpbGQgZS50YXJnZXRcbiAgICAgICAgICAgICAgICBAZW1pdE1vdXNlTW92ZSBlLCBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgdHJ1ZVxuXG4gICAgICAgICAgICBAbGlzdGVuZXJzLnB1c2ggWydtb3VzZXVwJywgb25Nb3VzZVVwID0gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0TW91c2VVcCBlLCBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgb25Nb3VzZVVwLCB0cnVlXG5cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWwgPSAoZSkgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBlbGVtZW50LmlzT3BlbigpXG5cbiAgICAgICAgICAgICAgICBfaXNQaWNrZXJFdmVudCA9IEBlbGVtZW50Lmhhc0NoaWxkIGUudGFyZ2V0XG4gICAgICAgICAgICAgICAgQGVtaXRNb3VzZVdoZWVsIGUsIF9pc1BpY2tlckV2ZW50XVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWxcblxuICAgICAgICAgICAgX3dvcmtzcGFjZVZpZXcuYWRkRXZlbnRMaXN0ZW5lciAna2V5ZG93bicsIChlKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQuaXNPcGVuKClcblxuICAgICAgICAgICAgICAgIF9pc1BpY2tlckV2ZW50ID0gQGVsZW1lbnQuaGFzQ2hpbGQgZS50YXJnZXRcbiAgICAgICAgICAgICAgICBAZW1pdEtleURvd24gZSwgX2lzUGlja2VyRXZlbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gQGNsb3NlKClcblxuICAgICAgICAgICAgIyBDbG9zZSBpdCBvbiBzY3JvbGwgYWxzb1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICAgICAgX2VkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgZWRpdG9yXG4gICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvblRvcCA9IF9lZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wID0+IEBjbG9zZSgpXG4gICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbkxlZnQgPSBfZWRpdG9yVmlldy5vbkRpZENoYW5nZVNjcm9sbExlZnQgPT4gQGNsb3NlKClcblxuICAgICAgICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvblRvcC5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbkxlZnQuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgQG9uQmVmb3JlRGVzdHJveSAtPlxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uVG9wLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uTGVmdC5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBDbG9zZSBpdCB3aGVuIHRoZSB3aW5kb3cgcmVzaXplc1xuICAgICAgICAgICAgQGxpc3RlbmVycy5wdXNoIFsncmVzaXplJywgb25SZXNpemUgPSA9PlxuICAgICAgICAgICAgICAgIEBjbG9zZSgpXVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIG9uUmVzaXplXG5cbiAgICAgICAgICAgICMgQ2xvc2UgaXQgd2hlbiB0aGUgYWN0aXZlIGl0ZW0gaXMgY2hhbmdlZFxuICAgICAgICAgICAgX3dvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkub25EaWRDaGFuZ2VBY3RpdmVJdGVtID0+IEBjbG9zZSgpXG5cbiAgICAgICAgIyAgUGxhY2UgdGhlIENvbG9yIFBpY2tlciBlbGVtZW50XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBAY2xvc2UoKVxuICAgICAgICAgICAgQGNhbk9wZW4gPSB5ZXNcblxuICAgICAgICAgICAgIyBUT0RPOiBJcyB0aGlzIHJlYWxseSB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcz8gSGludDogUHJvYmFibHkgbm90XG4gICAgICAgICAgICAoQFBhcmVudCA9IChhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2UpLnF1ZXJ5U2VsZWN0b3IgJy52ZXJ0aWNhbCcpXG4gICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkIEBlbGVtZW50LmVsXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgRGVzdHJveSB0aGUgdmlldyBhbmQgdW5iaW5kIGV2ZW50c1xuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBkZXN0cm95OiAtPlxuICAgICAgICAgICAgQGVtaXRCZWZvcmVEZXN0cm95KClcblxuICAgICAgICAgICAgZm9yIFtfZXZlbnQsIF9saXN0ZW5lcl0gaW4gQGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyIF9ldmVudCwgX2xpc3RlbmVyXG5cbiAgICAgICAgICAgIEBlbGVtZW50LnJlbW92ZSgpXG4gICAgICAgICAgICBAY2FuT3BlbiA9IG5vXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBMb2FkIENvbG9yIFBpY2tlciBleHRlbnNpb25zIC8vIG1vcmUgbGlrZSBkZXBlbmRlbmNpZXNcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbG9hZEV4dGVuc2lvbnM6IC0+XG4gICAgICAgICAgICAjIFRPRE86IFRoaXMgaXMgcmVhbGx5IHN0dXBpZC4gU2hvdWxkIHRoaXMgYmUgZG9uZSB3aXRoIGBmc2Agb3Igc29tZXRoaW5nP1xuICAgICAgICAgICAgIyBUT0RPOiBFeHRlbnNpb24gZmlsZXMgaGF2ZSBwcmV0dHkgbXVjaCB0aGUgc2FtZSBiYXNlLiBTaW1wbGlmeT9cbiAgICAgICAgICAgIGZvciBfZXh0ZW5zaW9uIGluIFsnQXJyb3cnLCAnQ29sb3InLCAnQm9keScsICdTYXR1cmF0aW9uJywgJ0FscGhhJywgJ0h1ZScsICdEZWZpbml0aW9uJywgJ1JldHVybicsICdGb3JtYXQnXVxuICAgICAgICAgICAgICAgIF9yZXF1aXJlZEV4dGVuc2lvbiA9IChyZXF1aXJlIFwiLi9leHRlbnNpb25zLyN7IF9leHRlbnNpb24gfVwiKSh0aGlzKVxuICAgICAgICAgICAgICAgIEBleHRlbnNpb25zW19leHRlbnNpb25dID0gX3JlcXVpcmVkRXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgX3JlcXVpcmVkRXh0ZW5zaW9uLmFjdGl2YXRlPygpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFNldCB1cCBldmVudHMgYW5kIGhhbmRsaW5nXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICMgTW91c2UgZXZlbnRzXG4gICAgICAgIGVtaXRNb3VzZURvd246IChlLCBpc09uUGlja2VyKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnbW91c2VEb3duJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlRG93bjogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ21vdXNlRG93bicsIGNhbGxiYWNrXG5cbiAgICAgICAgZW1pdE1vdXNlTW92ZTogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZU1vdmUnLCBlLCBpc09uUGlja2VyXG4gICAgICAgIG9uTW91c2VNb3ZlOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnbW91c2VNb3ZlJywgY2FsbGJhY2tcblxuICAgICAgICBlbWl0TW91c2VVcDogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZVVwJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlVXA6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdtb3VzZVVwJywgY2FsbGJhY2tcblxuICAgICAgICBlbWl0TW91c2VXaGVlbDogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZVdoZWVsJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlV2hlZWw6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdtb3VzZVdoZWVsJywgY2FsbGJhY2tcblxuICAgICAgICAjIEtleSBldmVudHNcbiAgICAgICAgZW1pdEtleURvd246IChlLCBpc09uUGlja2VyKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAna2V5RG93bicsIGUsIGlzT25QaWNrZXJcbiAgICAgICAgb25LZXlEb3duOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAna2V5RG93bicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBQb3NpdGlvbiBDaGFuZ2VcbiAgICAgICAgZW1pdFBvc2l0aW9uQ2hhbmdlOiAocG9zaXRpb24sIGNvbG9yUGlja2VyUG9zaXRpb24pIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdwb3NpdGlvbkNoYW5nZScsIHBvc2l0aW9uLCBjb2xvclBpY2tlclBvc2l0aW9uXG4gICAgICAgIG9uUG9zaXRpb25DaGFuZ2U6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdwb3NpdGlvbkNoYW5nZScsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBPcGVuaW5nXG4gICAgICAgIGVtaXRPcGVuOiAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnb3BlbidcbiAgICAgICAgb25PcGVuOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnb3BlbicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBCZWZvcmUgb3BlbmluZ1xuICAgICAgICBlbWl0QmVmb3JlT3BlbjogLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2JlZm9yZU9wZW4nXG4gICAgICAgIG9uQmVmb3JlT3BlbjogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2JlZm9yZU9wZW4nLCBjYWxsYmFja1xuXG4gICAgICAgICMgQ2xvc2luZ1xuICAgICAgICBlbWl0Q2xvc2U6IC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdjbG9zZSdcbiAgICAgICAgb25DbG9zZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2Nsb3NlJywgY2FsbGJhY2tcblxuICAgICAgICAjIEJlZm9yZSBkZXN0cm95aW5nXG4gICAgICAgIGVtaXRCZWZvcmVEZXN0cm95OiAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnYmVmb3JlRGVzdHJveSdcbiAgICAgICAgb25CZWZvcmVEZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnYmVmb3JlRGVzdHJveScsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBJbnB1dCBDb2xvclxuICAgICAgICBlbWl0SW5wdXRDb2xvcjogKHNtYXJ0Q29sb3IsIHdhc0ZvdW5kPXRydWUpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdpbnB1dENvbG9yJywgc21hcnRDb2xvciwgd2FzRm91bmRcbiAgICAgICAgb25JbnB1dENvbG9yOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnaW5wdXRDb2xvcicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBJbnB1dCBWYXJpYWJsZVxuICAgICAgICBlbWl0SW5wdXRWYXJpYWJsZTogKG1hdGNoKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnaW5wdXRWYXJpYWJsZScsIG1hdGNoXG4gICAgICAgIG9uSW5wdXRWYXJpYWJsZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2lucHV0VmFyaWFibGUnLCBjYWxsYmFja1xuXG4gICAgICAgICMgSW5wdXQgVmFyaWFibGUgQ29sb3JcbiAgICAgICAgZW1pdElucHV0VmFyaWFibGVDb2xvcjogKHNtYXJ0Q29sb3IsIHBvaW50ZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdpbnB1dFZhcmlhYmxlQ29sb3InLCBzbWFydENvbG9yLCBwb2ludGVyXG4gICAgICAgIG9uSW5wdXRWYXJpYWJsZUNvbG9yOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnaW5wdXRWYXJpYWJsZUNvbG9yJywgY2FsbGJhY2tcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIE9wZW4gdGhlIENvbG9yIFBpY2tlclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBvcGVuOiAoRWRpdG9yPW51bGwsIEN1cnNvcj1udWxsKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAY2FuT3BlblxuICAgICAgICAgICAgQGVtaXRCZWZvcmVPcGVuKClcblxuICAgICAgICAgICAgRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIHVubGVzcyBFZGl0b3JcbiAgICAgICAgICAgIEVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgRWRpdG9yXG4gICAgICAgICAgICBFZGl0b3JFbGVtZW50ID0gRWRpdG9yLmdldEVsZW1lbnQoKVxuXG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIEVkaXRvclZpZXdcblxuICAgICAgICAgICAgIyBSZXNldCBzZWxlY3Rpb25cbiAgICAgICAgICAgIEBzZWxlY3Rpb24gPSBudWxsXG5cbiAgICAgICAgIyAgRmluZCB0aGUgY3VycmVudCBjdXJzb3JcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEN1cnNvciA9IEVkaXRvci5nZXRMYXN0Q3Vyc29yKCkgdW5sZXNzIEN1cnNvclxuXG4gICAgICAgICAgICAjIEZhaWwgaWYgdGhlIGN1cnNvciBpc24ndCB2aXNpYmxlXG4gICAgICAgICAgICBfdmlzaWJsZVJvd1JhbmdlID0gRWRpdG9yVmlldy5nZXRWaXNpYmxlUm93UmFuZ2UoKVxuICAgICAgICAgICAgX2N1cnNvclNjcmVlblJvdyA9IEN1cnNvci5nZXRTY3JlZW5Sb3coKVxuICAgICAgICAgICAgX2N1cnNvckJ1ZmZlclJvdyA9IEN1cnNvci5nZXRCdWZmZXJSb3coKVxuXG4gICAgICAgICAgICByZXR1cm4gaWYgKF9jdXJzb3JTY3JlZW5Sb3cgPCBfdmlzaWJsZVJvd1JhbmdlWzBdKSBvciAoX2N1cnNvclNjcmVlblJvdyA+IF92aXNpYmxlUm93UmFuZ2VbMV0pXG5cbiAgICAgICAgICAgICMgVHJ5IG1hdGNoaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgY3VycmVudCBsaW5lIHRvIGNvbG9yIHJlZ2V4ZXNcbiAgICAgICAgICAgIF9saW5lQ29udGVudCA9IEN1cnNvci5nZXRDdXJyZW50QnVmZmVyTGluZSgpXG5cbiAgICAgICAgICAgIF9jb2xvck1hdGNoZXMgPSBAU21hcnRDb2xvci5maW5kIF9saW5lQ29udGVudFxuICAgICAgICAgICAgX3ZhcmlhYmxlTWF0Y2hlcyA9IEBTbWFydFZhcmlhYmxlLmZpbmQgX2xpbmVDb250ZW50LCBFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgICBfbWF0Y2hlcyA9IF9jb2xvck1hdGNoZXMuY29uY2F0IF92YXJpYWJsZU1hdGNoZXNcblxuICAgICAgICAgICAgIyBGaWd1cmUgb3V0IHdoaWNoIG9mIHRoZSBtYXRjaGVzIGlzIHRoZSBvbmUgdGhlIHVzZXIgd2FudHNcbiAgICAgICAgICAgIF9jdXJzb3JQb3NpdGlvbiA9IEVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uIEN1cnNvci5nZXRTY3JlZW5Qb3NpdGlvbigpXG4gICAgICAgICAgICBfY3Vyc29yQ29sdW1uID0gQ3Vyc29yLmdldEJ1ZmZlckNvbHVtbigpXG5cbiAgICAgICAgICAgIF9tYXRjaCA9IGRvIC0+IGZvciBfbWF0Y2ggaW4gX21hdGNoZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gX21hdGNoIGlmIF9tYXRjaC5zdGFydCA8PSBfY3Vyc29yQ29sdW1uIGFuZCBfbWF0Y2guZW5kID49IF9jdXJzb3JDb2x1bW5cblxuICAgICAgICAgICAgIyBJZiB3ZSd2ZSBnb3QgYSBtYXRjaCwgd2Ugc2hvdWxkIHNlbGVjdCBpdFxuICAgICAgICAgICAgaWYgX21hdGNoXG4gICAgICAgICAgICAgICAgRWRpdG9yLmNsZWFyU2VsZWN0aW9ucygpXG5cbiAgICAgICAgICAgICAgICBfc2VsZWN0aW9uID0gRWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlIFtcbiAgICAgICAgICAgICAgICAgICAgW19jdXJzb3JCdWZmZXJSb3csIF9tYXRjaC5zdGFydF1cbiAgICAgICAgICAgICAgICAgICAgW19jdXJzb3JCdWZmZXJSb3csIF9tYXRjaC5lbmRdXVxuICAgICAgICAgICAgICAgIEBzZWxlY3Rpb24gPSBtYXRjaDogX21hdGNoLCByb3c6IF9jdXJzb3JCdWZmZXJSb3dcbiAgICAgICAgICAgICMgQnV0IGlmIHdlIGRvbid0IGhhdmUgYSBtYXRjaCwgY2VudGVyIHRoZSBDb2xvciBQaWNrZXIgb24gbGFzdCBjdXJzb3JcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2VsZWN0aW9uID0gY29sdW1uOiBfY3Vyc29yQ29sdW1uLCByb3c6IF9jdXJzb3JCdWZmZXJSb3dcblxuICAgICAgICAjICBFbWl0XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiBfbWF0Y2hcbiAgICAgICAgICAgICAgICAjIFRoZSBtYXRjaCBpcyBhIHZhcmlhYmxlLiBMb29rIHVwIHRoZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgX21hdGNoLmlzVmFyaWFibGU/XG4gICAgICAgICAgICAgICAgICAgIF9tYXRjaC5nZXREZWZpbml0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuIChkZWZpbml0aW9uKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zbWFydENvbG9yID0gKEBTbWFydENvbG9yLmZpbmQgZGVmaW5pdGlvbi52YWx1ZSlbMF0uZ2V0U21hcnRDb2xvcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGVtaXRJbnB1dFZhcmlhYmxlQ29sb3IgX3NtYXJ0Q29sb3IsIGRlZmluaXRpb24ucG9pbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoIChlcnJvcikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZW1pdElucHV0VmFyaWFibGVDb2xvciBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBAZW1pdElucHV0VmFyaWFibGUgX21hdGNoXG4gICAgICAgICAgICAgICAgIyBUaGUgbWF0Y2ggaXMgYSBjb2xvclxuICAgICAgICAgICAgICAgIGVsc2UgQGVtaXRJbnB1dENvbG9yIF9tYXRjaC5nZXRTbWFydENvbG9yKClcbiAgICAgICAgICAgICMgTm8gbWF0Y2gsIGJ1dCBgcmFuZG9tQ29sb3JgIG9wdGlvbiBpcyBzZXRcbiAgICAgICAgICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIucmFuZG9tQ29sb3InXG4gICAgICAgICAgICAgICAgX3JhbmRvbUNvbG9yID0gQFNtYXJ0Q29sb3IuUkdCQXJyYXkgW1xuICAgICAgICAgICAgICAgICAgICAoKE1hdGgucmFuZG9tKCkgKiAyNTUpICsgLjUpIDw8IDBcbiAgICAgICAgICAgICAgICAgICAgKChNYXRoLnJhbmRvbSgpICogMjU1KSArIC41KSA8PCAwXG4gICAgICAgICAgICAgICAgICAgICgoTWF0aC5yYW5kb20oKSAqIDI1NSkgKyAuNSkgPDwgMF1cblxuICAgICAgICAgICAgICAgICMgQ29udmVydCB0byBgcHJlZmVycmVkQ29sb3JgLCBhbmQgdGhlbiBlbWl0IGl0XG4gICAgICAgICAgICAgICAgX3ByZWZlcnJlZEZvcm1hdCA9IGF0b20uY29uZmlnLmdldCAnY29sb3ItcGlja2VyLnByZWZlcnJlZEZvcm1hdCdcbiAgICAgICAgICAgICAgICBfY29udmVydGVkQ29sb3IgPSBfcmFuZG9tQ29sb3JbXCJ0byN7IF9wcmVmZXJyZWRGb3JtYXQgfVwiXSgpXG4gICAgICAgICAgICAgICAgX3JhbmRvbUNvbG9yID0gQFNtYXJ0Q29sb3JbX3ByZWZlcnJlZEZvcm1hdF0oX2NvbnZlcnRlZENvbG9yKVxuXG4gICAgICAgICAgICAgICAgQGVtaXRJbnB1dENvbG9yIF9yYW5kb21Db2xvciwgZmFsc2VcbiAgICAgICAgICAgICMgTm8gbWF0Y2gsIGFuZCBpdCdzIHRoZSBmaXJzdCBvcGVuXG4gICAgICAgICAgICBlbHNlIGlmIEBpc0ZpcnN0T3BlblxuICAgICAgICAgICAgICAgIF9yZWRDb2xvciA9IEBTbWFydENvbG9yLkhFWCAnI2YwMCdcblxuICAgICAgICAgICAgICAgICMgQ29udmVydCB0byBgcHJlZmVycmVkQ29sb3JgLCBhbmQgdGhlbiBlbWl0IGl0XG4gICAgICAgICAgICAgICAgX3ByZWZlcnJlZEZvcm1hdCA9IGF0b20uY29uZmlnLmdldCAnY29sb3ItcGlja2VyLnByZWZlcnJlZEZvcm1hdCdcblxuICAgICAgICAgICAgICAgIGlmIF9yZWRDb2xvci5mb3JtYXQgaXNudCBfcHJlZmVycmVkRm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIF9jb252ZXJ0ZWRDb2xvciA9IF9yZWRDb2xvcltcInRvI3sgX3ByZWZlcnJlZEZvcm1hdCB9XCJdKClcbiAgICAgICAgICAgICAgICAgICAgX3JlZENvbG9yID0gQFNtYXJ0Q29sb3JbX3ByZWZlcnJlZEZvcm1hdF0oX2NvbnZlcnRlZENvbG9yKVxuICAgICAgICAgICAgICAgIEBpc0ZpcnN0T3BlbiA9IG5vXG5cbiAgICAgICAgICAgICAgICBAZW1pdElucHV0Q29sb3IgX3JlZENvbG9yLCBmYWxzZVxuXG4gICAgICAgICMgIEFmdGVyICgmIGlmKSBoYXZpbmcgc2VsZWN0ZWQgdGV4dCAoYXMgdGhpcyBtaWdodCBjaGFuZ2UgdGhlIHNjcm9sbFxuICAgICAgICAjICBwb3NpdGlvbikgZ2F0aGVyIGluZm9ybWF0aW9uIGFib3V0IHRoZSBFZGl0b3JcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFBhbmVWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgX3BhbmVPZmZzZXRUb3AgPSBQYW5lVmlldy5vZmZzZXRUb3BcbiAgICAgICAgICAgIF9wYW5lT2Zmc2V0TGVmdCA9IFBhbmVWaWV3Lm9mZnNldExlZnRcblxuICAgICAgICAgICAgX2VkaXRvck9mZnNldFRvcCA9IEVkaXRvclZpZXcucGFyZW50Tm9kZS5vZmZzZXRUb3BcbiAgICAgICAgICAgIF9lZGl0b3JPZmZzZXRMZWZ0ID0gRWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKS5vZmZzZXRMZWZ0XG4gICAgICAgICAgICBfZWRpdG9yU2Nyb2xsVG9wID0gRWRpdG9yVmlldy5nZXRTY3JvbGxUb3AoKVxuXG4gICAgICAgICAgICBfbGluZUhlaWdodCA9IEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICAgICAgICAgICAgX2xpbmVPZmZzZXRMZWZ0ID0gRWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcubGluZScpLm9mZnNldExlZnRcblxuICAgICAgICAgICAgIyBDZW50ZXIgaXQgb24gdGhlIG1pZGRsZSBvZiB0aGUgc2VsZWN0aW9uIHJhbmdlXG4gICAgICAgICAgICAjIFRPRE86IFRoZXJlIGNhbiBiZSBsaW5lcyBvdmVyIG1vcmUgdGhhbiBvbmUgcm93XG4gICAgICAgICAgICBpZiBfbWF0Y2hcbiAgICAgICAgICAgICAgICBfcmVjdCA9IEVkaXRvckVsZW1lbnQucGl4ZWxSZWN0Rm9yU2NyZWVuUmFuZ2UoX3NlbGVjdGlvbi5nZXRTY3JlZW5SYW5nZSgpKVxuICAgICAgICAgICAgICAgIF9yaWdodCA9IF9yZWN0LmxlZnQgKyBfcmVjdC53aWR0aFxuICAgICAgICAgICAgICAgIF9jdXJzb3JQb3NpdGlvbi5sZWZ0ID0gX3JpZ2h0IC0gKF9yZWN0LndpZHRoIC8gMilcblxuICAgICAgICAjICBGaWd1cmUgb3V0IHdoZXJlIHRvIHBsYWNlIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIF90b3RhbE9mZnNldFRvcCA9IF9wYW5lT2Zmc2V0VG9wICsgX2xpbmVIZWlnaHQgLSBfZWRpdG9yU2Nyb2xsVG9wICsgX2VkaXRvck9mZnNldFRvcFxuICAgICAgICAgICAgX3RvdGFsT2Zmc2V0TGVmdCA9IF9wYW5lT2Zmc2V0TGVmdCArIF9lZGl0b3JPZmZzZXRMZWZ0ICsgX2xpbmVPZmZzZXRMZWZ0XG5cbiAgICAgICAgICAgIF9wb3NpdGlvbiA9XG4gICAgICAgICAgICAgICAgeDogX2N1cnNvclBvc2l0aW9uLmxlZnQgKyBfdG90YWxPZmZzZXRMZWZ0XG4gICAgICAgICAgICAgICAgeTogX2N1cnNvclBvc2l0aW9uLnRvcCArIF90b3RhbE9mZnNldFRvcFxuXG4gICAgICAgICMgIEZpZ3VyZSBvdXQgd2hlcmUgdG8gYWN0dWFsbHkgcGxhY2UgdGhlIENvbG9yIFBpY2tlciBieVxuICAgICAgICAjICBzZXR0aW5nIHVwIGJvdW5kYXJpZXMgYW5kIGZsaXBwaW5nIGl0IGlmIG5lY2Vzc2FyeVxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgX2NvbG9yUGlja2VyUG9zaXRpb24gPVxuICAgICAgICAgICAgICAgIHg6IGRvID0+XG4gICAgICAgICAgICAgICAgICAgIF9jb2xvclBpY2tlcldpZHRoID0gQGVsZW1lbnQud2lkdGgoKVxuICAgICAgICAgICAgICAgICAgICBfaGFsZkNvbG9yUGlja2VyV2lkdGggPSAoX2NvbG9yUGlja2VyV2lkdGggLyAyKSA8PCAwXG5cbiAgICAgICAgICAgICAgICAgICAgIyBNYWtlIHN1cmUgdGhlIENvbG9yIFBpY2tlciBpc24ndCB0b28gZmFyIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICAgICAgICAgIF94ID0gTWF0aC5tYXggMTAsIF9wb3NpdGlvbi54IC0gX2hhbGZDb2xvclBpY2tlcldpZHRoXG4gICAgICAgICAgICAgICAgICAgICMgTWFrZSBzdXJlIHRoZSBDb2xvciBQaWNrZXIgaXNuJ3QgdG9vIGZhciB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgX3ggPSBNYXRoLm1pbiAoQFBhcmVudC5vZmZzZXRXaWR0aCAtIF9jb2xvclBpY2tlcldpZHRoIC0gMTApLCBfeFxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfeFxuICAgICAgICAgICAgICAgIHk6IGRvID0+XG4gICAgICAgICAgICAgICAgICAgIEBlbGVtZW50LnVuZmxpcCgpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBUT0RPOiBJdCdzIG5vdCByZWFsbHkgd29ya2luZyBvdXQgZ3JlYXRcblxuICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBjb2xvciBwaWNrZXIgaXMgdG9vIGZhciBkb3duLCBmbGlwIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmIEBlbGVtZW50LmhlaWdodCgpICsgX3Bvc2l0aW9uLnkgPiBAUGFyZW50Lm9mZnNldEhlaWdodCAtIDMyXG4gICAgICAgICAgICAgICAgICAgICAgICBAZWxlbWVudC5mbGlwKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcG9zaXRpb24ueSAtIF9saW5lSGVpZ2h0IC0gQGVsZW1lbnQuaGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgIyBCdXQgaWYgaXQncyBmaW5lLCBrZWVwIHRoZSBZIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIF9wb3NpdGlvbi55XG5cbiAgICAgICAgICAgICMgU2V0IENvbG9yIFBpY2tlciBwb3NpdGlvbiBhbmQgZW1pdCBldmVudHNcbiAgICAgICAgICAgIEBlbGVtZW50LnNldFBvc2l0aW9uIF9jb2xvclBpY2tlclBvc2l0aW9uLngsIF9jb2xvclBpY2tlclBvc2l0aW9uLnlcbiAgICAgICAgICAgIEBlbWl0UG9zaXRpb25DaGFuZ2UgX3Bvc2l0aW9uLCBfY29sb3JQaWNrZXJQb3NpdGlvblxuXG4gICAgICAgICAgICAjIE9wZW4gdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0+ICMgd2FpdCBmb3IgY2xhc3MgZGVsYXlcbiAgICAgICAgICAgICAgICBAZWxlbWVudC5vcGVuKClcbiAgICAgICAgICAgICAgICBAZW1pdE9wZW4oKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFJlcGxhY2Ugc2VsZWN0ZWQgY29sb3JcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgY2FuUmVwbGFjZTogeWVzXG4gICAgICAgIHJlcGxhY2U6IChjb2xvcikgLT5cbiAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGNhblJlcGxhY2VcbiAgICAgICAgICAgIEBjYW5SZXBsYWNlID0gbm9cblxuICAgICAgICAgICAgRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICBFZGl0b3IuY2xlYXJTZWxlY3Rpb25zKClcblxuICAgICAgICAgICAgaWYgQHNlbGVjdGlvbi5tYXRjaFxuICAgICAgICAgICAgICAgIF9jdXJzb3JTdGFydCA9IEBzZWxlY3Rpb24ubWF0Y2guc3RhcnRcbiAgICAgICAgICAgICAgICBfY3Vyc29yRW5kID0gQHNlbGVjdGlvbi5tYXRjaC5lbmRcbiAgICAgICAgICAgIGVsc2UgX2N1cnNvclN0YXJ0ID0gX2N1cnNvckVuZCA9IEBzZWxlY3Rpb24uY29sdW1uXG5cbiAgICAgICAgICAgICMgU2VsZWN0IHRoZSBjb2xvciB3ZSdyZSBnb2luZyB0byByZXBsYWNlXG4gICAgICAgICAgICBFZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgICAgICAgIFtAc2VsZWN0aW9uLnJvdywgX2N1cnNvclN0YXJ0XVxuICAgICAgICAgICAgICAgIFtAc2VsZWN0aW9uLnJvdywgX2N1cnNvckVuZF1dXG4gICAgICAgICAgICBFZGl0b3IucmVwbGFjZVNlbGVjdGVkVGV4dCBudWxsLCA9PiBjb2xvclxuXG4gICAgICAgICAgICAjIFNlbGVjdCB0aGUgbmV3bHkgaW5zZXJ0ZWQgY29sb3IgYW5kIG1vdmUgdGhlIGN1cnNvciB0byBpdFxuICAgICAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgIEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbXG4gICAgICAgICAgICAgICAgICAgIEBzZWxlY3Rpb24ucm93LCBfY3Vyc29yU3RhcnRdXG4gICAgICAgICAgICAgICAgRWRpdG9yLmNsZWFyU2VsZWN0aW9ucygpXG5cbiAgICAgICAgICAgICAgICAjIFVwZGF0ZSBzZWxlY3Rpb24gbGVuZ3RoXG4gICAgICAgICAgICAgICAgQHNlbGVjdGlvbi5tYXRjaD8uZW5kID0gX2N1cnNvclN0YXJ0ICsgY29sb3IubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICBFZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgICAgICAgICAgICBbQHNlbGVjdGlvbi5yb3csIF9jdXJzb3JTdGFydF1cbiAgICAgICAgICAgICAgICAgICAgW0BzZWxlY3Rpb24ucm93LCBfY3Vyc29yU3RhcnQgKyBjb2xvci5sZW5ndGhdXVxuICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0ICggPT4gQGNhblJlcGxhY2UgPSB5ZXMpLCAxMDBcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgQ2xvc2UgdGhlIENvbG9yIFBpY2tlclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBjbG9zZTogLT5cbiAgICAgICAgICAgIEBlbGVtZW50LmNsb3NlKClcbiAgICAgICAgICAgIEBlbWl0Q2xvc2UoKVxuIl19

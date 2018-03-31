(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitFormatChanged: function(format) {
        return this.Emitter.emit('formatChanged', format);
      },
      onFormatChanged: function(callback) {
        return this.Emitter.on('formatChanged', callback);
      },
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add(_classPrefix + "-format");
            return _el;
          })(),
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var Color, _activeButton, _buttons, _format, i, len, ref, results;
            Color = colorPicker.getExtension('Color');
            _buttons = [];
            _activeButton = null;
            colorPicker.onBeforeOpen(function() {
              var _button, i, len, results;
              results = [];
              for (i = 0, len = _buttons.length; i < len; i++) {
                _button = _buttons[i];
                results.push(_button.deactivate());
              }
              return results;
            });
            Color.onOutputFormat(function(format) {
              var _button, i, len, results;
              results = [];
              for (i = 0, len = _buttons.length; i < len; i++) {
                _button = _buttons[i];
                if (format === _button.format || format === (_button.format + "A")) {
                  _button.activate();
                  results.push(_activeButton = _button);
                } else {
                  results.push(_button.deactivate());
                }
              }
              return results;
            });
            ref = ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'];
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              _format = ref[i];
              results.push((function(_format) {
                var Format, _button, _isClicking, hasChild;
                Format = _this;
                _button = {
                  el: (function() {
                    var _el;
                    _el = document.createElement('button');
                    _el.classList.add(Format.element.el.className + "-button");
                    _el.innerHTML = _format;
                    return _el;
                  })(),
                  format: _format,
                  addClass: function(className) {
                    this.el.classList.add(className);
                    return this;
                  },
                  removeClass: function(className) {
                    this.el.classList.remove(className);
                    return this;
                  },
                  activate: function() {
                    return this.addClass('is--active');
                  },
                  deactivate: function() {
                    return this.removeClass('is--active');
                  }
                };
                _buttons.push(_button);
                if (!_activeButton) {
                  if (_format === atom.config.get('color-picker.preferredFormat')) {
                    _activeButton = _button;
                    _button.activate();
                  }
                }
                hasChild = function(element, child) {
                  var _parent;
                  if (child && (_parent = child.parentNode)) {
                    if (child === element) {
                      return true;
                    } else {
                      return hasChild(element, _parent);
                    }
                  }
                  return false;
                };
                _isClicking = false;
                colorPicker.onMouseDown(function(e, isOnPicker) {
                  if (!(isOnPicker && hasChild(_button.el, e.target))) {
                    return;
                  }
                  e.preventDefault();
                  return _isClicking = true;
                });
                colorPicker.onMouseMove(function(e) {
                  return _isClicking = false;
                });
                colorPicker.onMouseUp(function(e) {
                  if (!_isClicking) {
                    return;
                  }
                  if (_activeButton) {
                    _activeButton.deactivate();
                  }
                  _button.activate();
                  _activeButton = _button;
                  return _this.emitFormatChanged(_format);
                });
                return _this.element.add(_button.el);
              })(_format));
            }
            return results;
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvRm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLSTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRDtXQUNiO01BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7TUFFQSxPQUFBLEVBQVMsSUFGVDtNQUdBLEtBQUEsRUFBTyxJQUhQO01BU0EsaUJBQUEsRUFBbUIsU0FBQyxNQUFEO2VBQ2YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsZUFBZCxFQUErQixNQUEvQjtNQURlLENBVG5CO01BV0EsZUFBQSxFQUFpQixTQUFDLFFBQUQ7ZUFDYixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxlQUFaLEVBQTZCLFFBQTdCO01BRGEsQ0FYakI7TUFpQkEsUUFBQSxFQUFVLFNBQUE7UUFDTixJQUFDLENBQUEsT0FBRCxHQUNJO1VBQUEsRUFBQSxFQUFPLENBQUEsU0FBQTtBQUNILGdCQUFBO1lBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3RDLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtZQUNOLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFzQixZQUFGLEdBQWdCLFNBQXBDO0FBRUEsbUJBQU87VUFMSixDQUFBLENBQUgsQ0FBQSxDQUFKO1VBUUEsR0FBQSxFQUFLLFNBQUMsT0FBRDtZQUNELElBQUMsQ0FBQSxFQUFFLENBQUMsV0FBSixDQUFnQixPQUFoQjtBQUNBLG1CQUFPO1VBRk4sQ0FSTDs7UUFXSixXQUFXLENBQUMsT0FBTyxDQUFDLEdBQXBCLENBQXdCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBakM7UUFJQSxVQUFB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QUF3QixTQUFDLENBQUQ7eUJBQ3BCLFdBQUEsR0FBYztnQkFETSxDQUF4QjtnQkFHQSxXQUFXLENBQUMsU0FBWixDQUFzQixTQUFDLENBQUQ7a0JBQ2xCLElBQUEsQ0FBYyxXQUFkO0FBQUEsMkJBQUE7O2tCQUVBLElBQThCLGFBQTlCO29CQUFBLGFBQWEsQ0FBQyxVQUFkLENBQUEsRUFBQTs7a0JBQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBQTtrQkFDQSxhQUFBLEdBQWdCO3lCQUVoQixLQUFDLENBQUEsaUJBQUQsQ0FBbUIsT0FBbkI7Z0JBUGtCLENBQXRCO3VCQVVBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLE9BQU8sQ0FBQyxFQUFyQjtjQXJEdUQsQ0FBQSxDQUFILENBQUksT0FBSjtBQUF4RDs7VUF0Qk87UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7QUE0RUEsZUFBTztNQTdGRCxDQWpCVjs7RUFEYTtBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgQ29sb3IgUGlja2VyL2V4dGVuc2lvbnM6IEZvcm1hdFxuIyAgVGhlIGVsZW1lbnQgcHJvdmlkaW5nIFVJIHRvIGNvbnZlcnQgYmV0d2VlbiBjb2xvciBmb3JtYXRzXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gKGNvbG9yUGlja2VyKSAtPlxuICAgICAgICBFbWl0dGVyOiAocmVxdWlyZSAnLi4vbW9kdWxlcy9FbWl0dGVyJykoKVxuXG4gICAgICAgIGVsZW1lbnQ6IG51bGxcbiAgICAgICAgY29sb3I6IG51bGxcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFNldCB1cCBldmVudHMgYW5kIGhhbmRsaW5nXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICMgRm9ybWF0IENoYW5nZWQgZXZlbnRcbiAgICAgICAgZW1pdEZvcm1hdENoYW5nZWQ6IChmb3JtYXQpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdmb3JtYXRDaGFuZ2VkJywgZm9ybWF0XG4gICAgICAgIG9uRm9ybWF0Q2hhbmdlZDogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2Zvcm1hdENoYW5nZWQnLCBjYWxsYmFja1xuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgQ3JlYXRlIGFuZCBhY3RpdmF0ZSBGb3JtYXQgZWxlbWVudFxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBhY3RpdmF0ZTogLT5cbiAgICAgICAgICAgIEBlbGVtZW50ID1cbiAgICAgICAgICAgICAgICBlbDogZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgX2NsYXNzUHJlZml4ID0gY29sb3JQaWNrZXIuZWxlbWVudC5lbC5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IF9jbGFzc1ByZWZpeCB9LWZvcm1hdFwiXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9lbFxuXG4gICAgICAgICAgICAgICAgIyBBZGQgYSBjaGlsZCBvbiB0aGUgQ29sb3IgZWxlbWVudFxuICAgICAgICAgICAgICAgIGFkZDogKGVsZW1lbnQpIC0+XG4gICAgICAgICAgICAgICAgICAgIEBlbC5hcHBlbmRDaGlsZCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICBjb2xvclBpY2tlci5lbGVtZW50LmFkZCBAZWxlbWVudC5lbFxuXG4gICAgICAgICMgIEFkZCBjb252ZXJzaW9uIGJ1dHRvbnMgI2ZmMFxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgIENvbG9yID0gY29sb3JQaWNrZXIuZ2V0RXh0ZW5zaW9uICdDb2xvcidcblxuICAgICAgICAgICAgICAgIF9idXR0b25zID0gW11cbiAgICAgICAgICAgICAgICBfYWN0aXZlQnV0dG9uID0gbnVsbFxuXG4gICAgICAgICAgICAgICAgIyBPbiBjb2xvciBwaWNrZXIgb3BlbiwgcmVzZXRcbiAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbkJlZm9yZU9wZW4gLT4gZm9yIF9idXR0b24gaW4gX2J1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbi5kZWFjdGl2YXRlKClcblxuICAgICAgICAgICAgICAgICMgT24gQ29sb3IgZWxlbWVudCBvdXRwdXQgZm9ybWF0LCBhY3RpdmF0ZSBhcHBsaWNhYmxlIGJ1dHRvblxuICAgICAgICAgICAgICAgIENvbG9yLm9uT3V0cHV0Rm9ybWF0IChmb3JtYXQpIC0+IGZvciBfYnV0dG9uIGluIF9idXR0b25zXG4gICAgICAgICAgICAgICAgICAgICMgVE9ETyB0aGlzIGlzIGluZWZmaWNpZW50LiBUaGVyZSBzaG91bGQgYmUgYSB3YXkgdG8gZWFzaWx5XG4gICAgICAgICAgICAgICAgICAgICMgY2hlY2sgaWYgYGZvcm1hdGAgaXMgaW4gYF9idXR0b24uZm9ybWF0YCwgaW5jbHVkaW5nIHRoZVxuICAgICAgICAgICAgICAgICAgICAjIGFscGhhIGNoYW5uZWxcbiAgICAgICAgICAgICAgICAgICAgaWYgZm9ybWF0IGlzIF9idXR0b24uZm9ybWF0IG9yIGZvcm1hdCBpcyBcIiN7IF9idXR0b24uZm9ybWF0IH1BXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idXR0b24uYWN0aXZhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgX2FjdGl2ZUJ1dHRvbiA9IF9idXR0b25cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBfYnV0dG9uLmRlYWN0aXZhdGUoKVxuXG4gICAgICAgICAgICAgICAgIyBDcmVhdGUgZm9ybWF0dGluZyBidXR0b25zXG4gICAgICAgICAgICAgICAgIyBUT0RPIHNhbWUgYXMgc2V0dGluZywgZ2xvYmFsaXplXG4gICAgICAgICAgICAgICAgZm9yIF9mb3JtYXQgaW4gWydSR0InLCAnSEVYJywgJ0hTTCcsICdIU1YnLCAnVkVDJ10gdGhlbiBkbyAoX2Zvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgRm9ybWF0ID0gdGhpc1xuXG4gICAgICAgICAgICAgICAgICAgICMgQ3JlYXRlIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbDogZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdidXR0b24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2VsLmNsYXNzTGlzdC5hZGQgXCIjeyBGb3JtYXQuZWxlbWVudC5lbC5jbGFzc05hbWUgfS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9lbC5pbm5lckhUTUwgPSBfZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9lbFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBfZm9ybWF0XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LmFkZCBjbGFzc05hbWU7IHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVDbGFzczogKGNsYXNzTmFtZSkgLT4gQGVsLmNsYXNzTGlzdC5yZW1vdmUgY2xhc3NOYW1lOyByZXR1cm4gdGhpc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZTogLT4gQGFkZENsYXNzICdpcy0tYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZTogLT4gQHJlbW92ZUNsYXNzICdpcy0tYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICBfYnV0dG9ucy5wdXNoIF9idXR0b25cblxuICAgICAgICAgICAgICAgICAgICAjIFNldCBpbml0aWFsIGZvcm1hdFxuICAgICAgICAgICAgICAgICAgICB1bmxlc3MgX2FjdGl2ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgX2Zvcm1hdCBpcyBhdG9tLmNvbmZpZy5nZXQgJ2NvbG9yLXBpY2tlci5wcmVmZXJyZWRGb3JtYXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2FjdGl2ZUJ1dHRvbiA9IF9idXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYnV0dG9uLmFjdGl2YXRlKClcblxuICAgICAgICAgICAgICAgICAgICAjIENoYW5nZSBjb2xvciBmb3JtYXQgb24gY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgaGFzQ2hpbGQgPSAoZWxlbWVudCwgY2hpbGQpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjaGlsZCBhbmQgX3BhcmVudCA9IGNoaWxkLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBjaGlsZCBpcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gaGFzQ2hpbGQgZWxlbWVudCwgX3BhcmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIF9pc0NsaWNraW5nID0gbm9cblxuICAgICAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbk1vdXNlRG93biAoZSwgaXNPblBpY2tlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgaXNPblBpY2tlciBhbmQgaGFzQ2hpbGQgX2J1dHRvbi5lbCwgZS50YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgX2lzQ2xpY2tpbmcgPSB5ZXNcblxuICAgICAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbk1vdXNlTW92ZSAoZSkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIF9pc0NsaWNraW5nID0gbm9cblxuICAgICAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbk1vdXNlVXAgKGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIF9pc0NsaWNraW5nXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF9hY3RpdmVCdXR0b24uZGVhY3RpdmF0ZSgpIGlmIF9hY3RpdmVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIF9idXR0b24uYWN0aXZhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgX2FjdGl2ZUJ1dHRvbiA9IF9idXR0b25cblxuICAgICAgICAgICAgICAgICAgICAgICAgQGVtaXRGb3JtYXRDaGFuZ2VkIF9mb3JtYXRcblxuICAgICAgICAgICAgICAgICAgICAjIEFkZCBidXR0b24gdG8gdGhlIHBhcmVudCBGb3JtYXQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBAZWxlbWVudC5hZGQgX2J1dHRvbi5lbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiJdfQ==

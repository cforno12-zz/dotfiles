(function() {
  var $, $$, $$$, MessageView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require("atom-space-pen-views"), $ = ref.$, $$ = ref.$$, $$$ = ref.$$$, View = ref.View;

  module.exports = MessageView = (function(superClass) {
    extend(MessageView, superClass);

    MessageView.prototype.messages = [];

    MessageView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'clearMessages'
                    }, 'Clear');
                  });
                  return _this.span({
                    "class": '',
                    outlet: 'title'
                  }, 'Atom Beautify Message');
                });
                return _this.div({
                  "class": "panel-body padded select-list",
                  outlet: 'body'
                }, function() {
                  return _this.ol({
                    "class": 'list-group',
                    outlet: 'messageItems'
                  }, function() {
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'test');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    return _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-added icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-file-text'
                      }, 'Primary line');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    function MessageView() {
      this.refresh = bind(this.refresh, this);
      this.show = bind(this.show, this);
      this.close = bind(this.close, this);
      this.clearMessages = bind(this.clearMessages, this);
      this.addMessage = bind(this.addMessage, this);
      MessageView.__super__.constructor.apply(this, arguments);
    }

    MessageView.prototype.destroy = function() {};

    MessageView.prototype.addMessage = function(message) {
      this.messages.push(message);
      return this.refresh();
    };

    MessageView.prototype.clearMessages = function() {
      this.messages = [];
      return this.refresh();
    };

    MessageView.prototype.close = function(event, element) {
      return this.detach();
    };

    MessageView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspaceView.appendToTop(this);
      }
    };

    MessageView.prototype.refresh = function() {
      if (this.messages.length === 0) {
        return this.close();
      } else {
        return this.show();
      }
    };

    return MessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy92aWV3cy9tZXNzYWdlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBOzs7O0VBQUEsTUFBcUIsT0FBQSxDQUFRLHNCQUFSLENBQXJCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUSxhQUFSLEVBQWE7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7OzBCQUNKLFFBQUEsR0FBVTs7SUFDVixXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUNFO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw2QkFBUDtPQURGLEVBQ3dDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDcEMsS0FBQyxDQUFBLEdBQUQsQ0FDRTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sa0JBQVA7V0FERixFQUM2QixTQUFBO21CQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx5QkFBUDthQUFMLEVBQXVDLFNBQUE7cUJBQ3JDLEtBQUMsQ0FBQSxHQUFELENBQUs7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxhQUFQO2VBQUwsRUFBMkIsU0FBQTtnQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsU0FBQTtrQkFDM0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztvQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO21CQUFMLEVBQXNDLFNBQUE7MkJBQ3BDLEtBQUMsQ0FBQSxNQUFELENBQ0U7c0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUFQO3NCQUNBLEtBQUEsRUFBTyxlQURQO3FCQURGLEVBR0UsT0FIRjtrQkFEb0MsQ0FBdEM7eUJB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LENBQStCLElBQS9CLEVBREY7O0lBREk7OzBCQUlOLE9BQUEsR0FBUyxTQUFBO01BRVAsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsS0FBb0IsQ0FBdkI7ZUFDRSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGOztJQUZPOzs7O0tBeEVlO0FBSDFCIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkLCAkJCQsIFZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTWVzc2FnZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIG1lc3NhZ2VzOiBbXVxuICBAY29udGVudDogLT5cbiAgICBAZGl2XG4gICAgICBjbGFzczogJ2F0b20tYmVhdXRpZnkgbWVzc2FnZS1wYW5lbCcsID0+XG4gICAgICAgIEBkaXZcbiAgICAgICAgICBjbGFzczogJ292ZXJsYXkgZnJvbS10b3AnLCA9PlxuICAgICAgICAgICAgQGRpdiBjbGFzczogXCJ0b29sLXBhbmVsIHBhbmVsLWJvdHRvbVwiLCA9PlxuICAgICAgICAgICAgICBAZGl2IGNsYXNzOiBcImluc2V0LXBhbmVsXCIsID0+XG4gICAgICAgICAgICAgICAgQGRpdiBjbGFzczogXCJwYW5lbC1oZWFkaW5nXCIsID0+XG4gICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLXRvb2xiYXIgcHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgICAgICAgICAgIEBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J0bidcbiAgICAgICAgICAgICAgICAgICAgICBjbGljazogJ2NsZWFyTWVzc2FnZXMnXG4gICAgICAgICAgICAgICAgICAgICAgJ0NsZWFyJ1xuICAgICAgICAgICAgICAgICAgQHNwYW5cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICcnXG4gICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3RpdGxlJ1xuICAgICAgICAgICAgICAgICAgICAnQXRvbSBCZWF1dGlmeSBNZXNzYWdlJ1xuICAgICAgICAgICAgICAgIEBkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzOiBcInBhbmVsLWJvZHkgcGFkZGVkIHNlbGVjdC1saXN0XCJcbiAgICAgICAgICAgICAgICAgIG91dGxldDogJ2JvZHknXG4gICAgICAgICAgICAgICAgICA9PlxuICAgICAgICAgICAgICAgICAgICBAb2xcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2xpc3QtZ3JvdXAnLFxuICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogJ21lc3NhZ2VJdGVtcydcbiAgICAgICAgICAgICAgICAgICAgICA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ3N0YXR1cyBzdGF0dXMtcmVtb3ZlZCBpY29uIGljb24tZGlmZi1hZGRlZCcsICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwcmltYXJ5LWxpbmUgaWNvbiBpY29uLWFsZXJ0JywgJ1RoaXMgaXMgdGhlIHRpdGxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUgbm8taWNvbicsICdTZWNvbmRhcnkgbGluZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIEBsaSBjbGFzczogJ3R3by1saW5lcycsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzdGF0dXMgc3RhdHVzLXJlbW92ZWQgaWNvbiBpY29uLWRpZmYtYWRkZWQnLCAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAncHJpbWFyeS1saW5lIGljb24gaWNvbi1hbGVydCcsICdUaGlzIGlzIHRoZSB0aXRsZSBDdXJyZW50bHkgdGhlcmUgaXMgbm8gd2F5IHRvIGRpc3BsYXkgYSBtZXNzYWdlIHRvIHRoZSB1c2VyLCBzdWNoIGFzIGVycm9ycyBvciB3YXJuaW5ncyBvciBkZXByZWNhdGlvbiBub3RpY2VzIChzZWUgIzQwKS4gTGV0XFwncyBwdXQgYSBsaXR0bGUgb3ZlcmxheSBvbiB0aGUgdG9wIGZvciBkaXNwbGF5aW5nIHN1Y2ggaW5mb3JtYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUgbm8taWNvbicsICdUaGlzIGlzIHRoZSB0aXRsZSBDdXJyZW50bHkgdGhlcmUgaXMgbm8gd2F5IHRvIGRpc3BsYXkgYSBtZXNzYWdlIHRvIHRoZSB1c2VyLCBzdWNoIGFzIGVycm9ycyBvciB3YXJuaW5ncyBvciBkZXByZWNhdGlvbiBub3RpY2VzIChzZWUgIzQwKS4gTGV0XFwncyBwdXQgYSBsaXR0bGUgb3ZlcmxheSBvbiB0aGUgdG9wIGZvciBkaXNwbGF5aW5nIHN1Y2ggaW5mb3JtYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ3N0YXR1cyBzdGF0dXMtcmVtb3ZlZCBpY29uIGljb24tZGlmZi1hZGRlZCcsICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwcmltYXJ5LWxpbmUgaWNvbiBpY29uLWFsZXJ0JywgJ3Rlc3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzZWNvbmRhcnktbGluZSBuby1pY29uJywgJ1NlY29uZGFyeSBsaW5lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ3N0YXR1cyBzdGF0dXMtcmVtb3ZlZCBpY29uIGljb24tZGlmZi1hZGRlZCcsICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwcmltYXJ5LWxpbmUgaWNvbiBpY29uLWFsZXJ0JywgJ1RoaXMgaXMgdGhlIHRpdGxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUgbm8taWNvbicsICdTZWNvbmRhcnkgbGluZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIEBsaSBjbGFzczogJ3R3by1saW5lcycsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzdGF0dXMgc3RhdHVzLXJlbW92ZWQgaWNvbiBpY29uLWRpZmYtYWRkZWQnLCAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAncHJpbWFyeS1saW5lIGljb24gaWNvbi1hbGVydCcsICdUaGlzIGlzIHRoZSB0aXRsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NlY29uZGFyeS1saW5lIG5vLWljb24nLCAnU2Vjb25kYXJ5IGxpbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICBAbGkgY2xhc3M6ICd0d28tbGluZXMnLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnc3RhdHVzIHN0YXR1cy1hZGRlZCBpY29uIGljb24tZGlmZi1hZGRlZCcsICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwcmltYXJ5LWxpbmUgaWNvbiBpY29uLWZpbGUtdGV4dCcsICdQcmltYXJ5IGxpbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzZWNvbmRhcnktbGluZSBuby1pY29uJywgJ1NlY29uZGFyeSBsaW5lJ1xuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgZGVzdHJveTogLT5cblxuICBhZGRNZXNzYWdlOiAobWVzc2FnZSkgPT5cbiAgICBAbWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgIEByZWZyZXNoKClcblxuICBjbGVhck1lc3NhZ2VzOiA9PlxuICAgIEBtZXNzYWdlcyA9IFtdXG4gICAgQHJlZnJlc2goKVxuXG4gIGNsb3NlOiAoZXZlbnQsIGVsZW1lbnQpID0+XG4gICAgQGRldGFjaCgpXG5cbiAgc2hvdzogPT5cbiAgICBpZiBub3QgQC5oYXNQYXJlbnQoKVxuICAgICAgYXRvbS53b3Jrc3BhY2VWaWV3LmFwcGVuZFRvVG9wIEBcblxuICByZWZyZXNoOiA9PlxuICAgICMgSWYgdGhlIG1lc3NhZ2VzIGxpc3QgaXMgZW1wdHksIHZpZXcgc2hvdWxkIGJlIGNsb3NlZC5cbiAgICBpZiBAbWVzc2FnZXMubGVuZ3RoIGlzIDBcbiAgICAgIEBjbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQHNob3coKVxuIl19

(function() {
  var Disposable, IndentationManager, IndentationStatusView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  IndentationManager = require('./indentation-manager');

  IndentationStatusView = (function(superClass) {
    extend(IndentationStatusView, superClass);

    function IndentationStatusView() {
      return IndentationStatusView.__super__.constructor.apply(this, arguments);
    }

    IndentationStatusView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.classList.add('indentation-status', 'inline-block');
      this.indentationLink = document.createElement('a');
      this.indentationLink.classList.add('inline-block');
      this.indentationLink.href = '#';
      this.appendChild(this.indentationLink);
      this.handleEvents();
      return this;
    };

    IndentationStatusView.prototype.attach = function() {
      var ref;
      if ((ref = this.statusBarTile) != null) {
        ref.destroy();
      }
      this.statusBarTile = atom.config.get('auto-detect-indentation.showSpacingInStatusBar') ? this.statusBar.addRightTile({
        item: this,
        priority: 10
      }) : void 0;
      return this.updateIndentationText();
    };

    IndentationStatusView.prototype.handleEvents = function() {
      var clickHandler;
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.configSubscription = atom.config.observe('auto-detect-indentation.showSpacingInStatusBar', (function(_this) {
        return function() {
          return _this.attach();
        };
      })(this));
      clickHandler = (function(_this) {
        return function() {
          return atom.commands.dispatch(atom.views.getView(_this.getActiveTextEditor()), 'auto-detect-indentation:show-indentation-selector');
        };
      })(this);
      this.addEventListener('click', clickHandler);
      this.clickSubscription = new Disposable((function(_this) {
        return function() {
          return _this.removeEventListener('click', clickHandler);
        };
      })(this));
      return this.subscribeToActiveTextEditor();
    };

    IndentationStatusView.prototype.destroy = function() {
      var ref, ref1, ref2, ref3, ref4, ref5, ref6;
      if ((ref = this.activeItemSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.indentationSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.paneOpenSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.paneCreateSubscription) != null) {
        ref3.dispose();
      }
      if ((ref4 = this.paneDestroySubscription) != null) {
        ref4.dispose();
      }
      if ((ref5 = this.clickSubscription) != null) {
        ref5.dispose();
      }
      if ((ref6 = this.configSubscription) != null) {
        ref6.dispose();
      }
      return this.statusBarTile.destroy();
    };

    IndentationStatusView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    IndentationStatusView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref, ref1, ref2, ref3, ref4, workspace;
      workspace = atom.workspace;
      editor = workspace.getActiveTextEditor();
      if ((ref = this.indentationSubscription) != null) {
        ref.dispose();
      }
      this.indentationSubscription = editor != null ? (ref1 = editor.emitter) != null ? ref1.on('did-change-indentation', (function(_this) {
        return function() {
          return _this.updateIndentationText();
        };
      })(this)) : void 0 : void 0;
      if ((ref2 = this.paneOpenSubscription) != null) {
        ref2.dispose();
      }
      this.paneOpenSubscription = workspace.onDidOpen((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      if ((ref3 = this.paneCreateSubscription) != null) {
        ref3.dispose();
      }
      this.paneCreateSubscription = workspace.onDidAddPane((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      if ((ref4 = this.paneDestroySubscription) != null) {
        ref4.dispose();
      }
      this.paneDestroySubscription = workspace.onDidDestroyPaneItem((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      return this.updateIndentationText();
    };

    IndentationStatusView.prototype.updateIndentationText = function() {
      var editor, indentationName;
      editor = this.getActiveTextEditor();
      if (editor) {
        indentationName = IndentationManager.getIndentation(editor);
        this.indentationLink.textContent = indentationName;
        return this.style.display = '';
      } else {
        return this.style.display = 'none';
      }
    };

    return IndentationStatusView;

  })(HTMLDivElement);

  module.exports = document.registerElement('indentation-selector-status', {
    prototype: IndentationStatusView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvLWRldGVjdC1pbmRlbnRhdGlvbi9saWIvaW5kZW50YXRpb24tc3RhdHVzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUNmLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUjs7RUFFZjs7Ozs7OztvQ0FDSixVQUFBLEdBQVksU0FBQyxTQUFEO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxvQkFBZixFQUFxQyxjQUFyQztNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCO01BQ25CLElBQUMsQ0FBQSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQTNCLENBQStCLGNBQS9CO01BQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixHQUF3QjtNQUN4QixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxlQUFkO01BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQTthQUNBO0lBUFU7O29DQVNaLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTs7V0FBYyxDQUFFLE9BQWhCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FDSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0RBQWhCLENBQUgsR0FDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0I7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUFZLFFBQUEsRUFBVSxFQUF0QjtPQUF4QixDQURGLEdBQUE7YUFFRixJQUFDLENBQUEscUJBQUQsQ0FBQTtJQUxNOztvQ0FPUixZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIs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OztvQ0FpQjdCLHFCQUFBLEdBQXVCLFNBQUE7QUFDckIsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsbUJBQUQsQ0FBQTtNQUNULElBQUcsTUFBSDtRQUNFLGVBQUEsR0FBa0Isa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEM7UUFDbEIsSUFBQyxDQUFBLGVBQWUsQ0FBQyxXQUFqQixHQUErQjtlQUMvQixJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUIsR0FIbkI7T0FBQSxNQUFBO2VBS0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLEdBQWlCLE9BTG5COztJQUZxQjs7OztLQTVEVzs7RUFxRXBDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQVEsQ0FBQyxlQUFULENBQXlCLDZCQUF6QixFQUF3RDtJQUFBLFNBQUEsRUFBVyxxQkFBcUIsQ0FBQyxTQUFqQztHQUF4RDtBQXhFakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuSW5kZW50YXRpb25NYW5hZ2VyID0gcmVxdWlyZSAnLi9pbmRlbnRhdGlvbi1tYW5hZ2VyJ1xuXG5jbGFzcyBJbmRlbnRhdGlvblN0YXR1c1ZpZXcgZXh0ZW5kcyBIVE1MRGl2RWxlbWVudFxuICBpbml0aWFsaXplOiAoQHN0YXR1c0JhcikgLT5cbiAgICBAY2xhc3NMaXN0LmFkZCgnaW5kZW50YXRpb24tc3RhdHVzJywgJ2lubGluZS1ibG9jaycpXG4gICAgQGluZGVudGF0aW9uTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIEBpbmRlbnRhdGlvbkxpbmsuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcbiAgICBAaW5kZW50YXRpb25MaW5rLmhyZWYgPSAnIydcbiAgICBAYXBwZW5kQ2hpbGQoQGluZGVudGF0aW9uTGluaylcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICB0aGlzXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQgJ2F1dG8tZGV0ZWN0LWluZGVudGF0aW9uLnNob3dTcGFjaW5nSW5TdGF0dXNCYXInXG4gICAgICAgIEBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKGl0ZW06IHRoaXMsIHByaW9yaXR5OiAxMClcbiAgICBAdXBkYXRlSW5kZW50YXRpb25UZXh0KClcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIEBjb25maWdTdWJzY3JpcHRpb24gPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdhdXRvLWRldGVjdC1pbmRlbnRhdGlvbi5zaG93U3BhY2luZ0luU3RhdHVzQmFyJywgPT5cbiAgICAgIEBhdHRhY2goKVxuXG4gICAgY2xpY2tIYW5kbGVyID0gPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoQGdldEFjdGl2ZVRleHRFZGl0b3IoKSksICdhdXRvLWRldGVjdC1pbmRlbnRhdGlvbjpzaG93LWluZGVudGF0aW9uLXNlbGVjdG9yJylcbiAgICBAYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXG4gICAgQGNsaWNrU3Vic2NyaXB0aW9uID0gbmV3IERpc3Bvc2FibGUgPT4gQHJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxuXG4gICAgQHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGluZGVudGF0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAcGFuZU9wZW5TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBwYW5lQ3JlYXRlU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAcGFuZURlc3Ryb3lTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBjbGlja1N1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGNvbmZpZ1N1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHN0YXR1c0JhclRpbGUuZGVzdHJveSgpXG5cbiAgZ2V0QWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgd29ya3NwYWNlID0gYXRvbS53b3Jrc3BhY2VcbiAgICBlZGl0b3IgPSB3b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGluZGVudGF0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAaW5kZW50YXRpb25TdWJzY3JpcHRpb24gPSBlZGl0b3I/LmVtaXR0ZXI/Lm9uICdkaWQtY2hhbmdlLWluZGVudGF0aW9uJywgPT5cbiAgICAgIEB1cGRhdGVJbmRlbnRhdGlvblRleHQoKVxuICAgIEBwYW5lT3BlblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHBhbmVPcGVuU3Vic2NyaXB0aW9uID0gd29ya3NwYWNlLm9uRGlkT3BlbiAoZXZlbnQpID0+XG4gICAgICBAdXBkYXRlSW5kZW50YXRpb25UZXh0KClcbiAgICBAcGFuZUNyZWF0ZVN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHBhbmVDcmVhdGVTdWJzY3JpcHRpb24gPSB3b3Jrc3BhY2Uub25EaWRBZGRQYW5lIChldmVudCkgPT5cbiAgICAgIEB1cGRhdGVJbmRlbnRhdGlvblRleHQoKVxuICAgIEBwYW5lRGVzdHJveVN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHBhbmVEZXN0cm95U3Vic2NyaXB0aW9uID0gd29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtIChldmVudCkgPT5cbiAgICAgIEB1cGRhdGVJbmRlbnRhdGlvblRleHQoKVxuICAgIEB1cGRhdGVJbmRlbnRhdGlvblRleHQoKVxuXG4gIHVwZGF0ZUluZGVudGF0aW9uVGV4dDogLT5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgZWRpdG9yXG4gICAgICBpbmRlbnRhdGlvbk5hbWUgPSBJbmRlbnRhdGlvbk1hbmFnZXIuZ2V0SW5kZW50YXRpb24gZWRpdG9yXG4gICAgICBAaW5kZW50YXRpb25MaW5rLnRleHRDb250ZW50ID0gaW5kZW50YXRpb25OYW1lXG4gICAgICBAc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgZWxzZVxuICAgICAgQHN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luZGVudGF0aW9uLXNlbGVjdG9yLXN0YXR1cycsIHByb3RvdHlwZTogSW5kZW50YXRpb25TdGF0dXNWaWV3LnByb3RvdHlwZSlcbiJdfQ==

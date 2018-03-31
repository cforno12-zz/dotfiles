(function() {
  var WSHandler, temp;

  temp = require('temp');

  module.exports = WSHandler = (function() {
    function WSHandler(ws) {
      this.ws = ws;
      this.closed = false;
      this.ws.on('message', (function(_this) {
        return function(message) {
          message = JSON.parse(message);
          if (_this[message.type]) {
            return _this[message.type](message.payload);
          }
        };
      })(this));
      this.ws.on('close', (function(_this) {
        return function() {
          _this.closed = true;
          if (_this.changeSubscription) {
            _this.changeSubscription.dispose();
          }
          if (_this.changeSubscription) {
            return _this.destroySubscription.dispose();
          }
        };
      })(this));
    }

    WSHandler.prototype.register = function(data) {
      var filepath;
      filepath = this.getFile(data);
      atom.focus();
      return atom.workspace.open(filepath).then((function(_this) {
        return function(editor) {
          return _this.initEditor(editor, data);
        };
      })(this));
    };

    WSHandler.prototype.getFile = function(data) {
      var extension, ref;
      extension = (ref = data.extension) != null ? ref : atom.config.get('atomic-chrome.defaultExtension');
      return temp.path({
        prefix: data.title + "-",
        suffix: extension
      });
    };

    WSHandler.prototype.initEditor = function(editor, data) {
      this.editor = editor;
      this.updateText(data);
      this.destroySubscription = this.editor.onDidDestroy((function(_this) {
        return function() {
          if (!_this.closed) {
            return _this.ws.close();
          }
        };
      })(this));
      return this.changeSubscription = this.editor.onDidChange((function(_this) {
        return function() {
          if (!(_this.closed || _this.ignoreChanges)) {
            _this.sendChanges();
          }
          return _this.ignoreChanges = false;
        };
      })(this));
    };

    WSHandler.prototype.sendChanges = function() {
      var lines, message;
      lines = this.editor.getBuffer().lines || this.editor.getBuffer().getLines();
      message = {
        type: 'updateText',
        payload: {
          text: lines.join('\n')
        }
      };
      return this.ws.send(JSON.stringify(message));
    };

    WSHandler.prototype.updateText = function(data) {
      if (!(this.editor && this.editor.isAlive())) {
        return;
      }
      this.ignoreChanges = true;
      return this.editor.setText(data.text);
    };

    return WSHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9taWMtY2hyb21lL2xpYi93cy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ1IsbUJBQUMsRUFBRDtNQUFDLElBQUMsQ0FBQSxLQUFEO01BQ1osSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxFQUFFLENBQUMsRUFBSixDQUFPLFNBQVAsRUFBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDaEIsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWDtVQUNWLElBQXVDLEtBQUssQ0FBQSxPQUFPLENBQUMsSUFBUixDQUE1QzttQkFBQSxLQUFLLENBQUEsT0FBTyxDQUFDLElBQVIsQ0FBTCxDQUFtQixPQUFPLENBQUMsT0FBM0IsRUFBQTs7UUFGZ0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO01BR0EsSUFBQyxDQUFBLEVBQUUsQ0FBQyxFQUFKLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDZCxLQUFDLENBQUEsTUFBRCxHQUFVO1VBQ1YsSUFBaUMsS0FBQyxDQUFBLGtCQUFsQztZQUFBLEtBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBLEVBQUE7O1VBQ0EsSUFBa0MsS0FBQyxDQUFBLGtCQUFuQzttQkFBQSxLQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBQSxFQUFBOztRQUhjO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtJQUxXOzt3QkFVYixRQUFBLEdBQVUsU0FBQyxJQUFEO0FBQ1IsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7TUFDWCxJQUFJLENBQUMsS0FBTCxDQUFBO2FBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQ2pDLEtBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixJQUFwQjtRQURpQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7SUFIUTs7d0JBTVYsT0FBQSxHQUFTLFNBQUMsSUFBRDtBQUNQLFVBQUE7TUFBQSxTQUFBLDBDQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO2FBQzdCLElBQUksQ0FBQyxJQUFMLENBQVU7UUFBQyxNQUFBLEVBQVcsSUFBSSxDQUFDLEtBQU4sR0FBWSxHQUF2QjtRQUEyQixNQUFBLEVBQVEsU0FBbkM7T0FBVjtJQUZPOzt3QkFJVCxVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsSUFBVDtNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUMxQyxJQUFBLENBQW1CLEtBQUMsQ0FBQSxNQUFwQjttQkFBQSxLQUFDLENBQUEsRUFBRSxDQUFDLEtBQUosQ0FBQSxFQUFBOztRQUQwQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7YUFFdkIsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDeEMsSUFBQSxDQUFBLENBQXNCLEtBQUMsQ0FBQSxNQUFELElBQVcsS0FBQyxDQUFBLGFBQWxDLENBQUE7WUFBQSxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUE7O2lCQUNBLEtBQUMsQ0FBQSxhQUFELEdBQWlCO1FBRnVCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtJQUxaOzt3QkFTWixXQUFBLEdBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxLQUFwQixJQUE2QixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQUE7TUFDckMsT0FBQSxHQUNFO1FBQUEsSUFBQSxFQUFNLFlBQU47UUFDQSxPQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLENBQU47U0FGRjs7YUFHRixJQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsQ0FBVDtJQU5XOzt3QkFRYixVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBQSxDQUFBLENBQWMsSUFBQyxDQUFBLE1BQUQsSUFBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUF6QixDQUFBO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjthQUNqQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsSUFBSSxDQUFDLElBQXJCO0lBSFU7Ozs7O0FBeENkIiwic291cmNlc0NvbnRlbnQiOlsidGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV1NIYW5kbGVyXG4gIGNvbnN0cnVjdG9yOiAoQHdzKSAtPlxuICAgIEBjbG9zZWQgPSBmYWxzZVxuICAgIEB3cy5vbiAnbWVzc2FnZScsIChtZXNzYWdlKSA9PlxuICAgICAgbWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZSlcbiAgICAgIHRoaXNbbWVzc2FnZS50eXBlXShtZXNzYWdlLnBheWxvYWQpIGlmIHRoaXNbbWVzc2FnZS50eXBlXVxuICAgIEB3cy5vbiAnY2xvc2UnLCAoKSA9PlxuICAgICAgQGNsb3NlZCA9IHRydWVcbiAgICAgIEBjaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpIGlmIEBjaGFuZ2VTdWJzY3JpcHRpb25cbiAgICAgIEBkZXN0cm95U3Vic2NyaXB0aW9uLmRpc3Bvc2UoKSBpZiBAY2hhbmdlU3Vic2NyaXB0aW9uXG5cbiAgcmVnaXN0ZXI6IChkYXRhKSAtPlxuICAgIGZpbGVwYXRoID0gQGdldEZpbGUoZGF0YSlcbiAgICBhdG9tLmZvY3VzKCkgIyBhY3Rpdml2YXRlIEF0b20gYXBwbGljYXRpb25cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVwYXRoKS50aGVuIChlZGl0b3IpID0+XG4gICAgICBAaW5pdEVkaXRvcihlZGl0b3IsIGRhdGEpXG5cbiAgZ2V0RmlsZTogKGRhdGEpIC0+XG4gICAgZXh0ZW5zaW9uID0gZGF0YS5leHRlbnNpb24gPyBhdG9tLmNvbmZpZy5nZXQoJ2F0b21pYy1jaHJvbWUuZGVmYXVsdEV4dGVuc2lvbicpXG4gICAgdGVtcC5wYXRoIHtwcmVmaXg6IFwiI3tkYXRhLnRpdGxlfS1cIiwgc3VmZml4OiBleHRlbnNpb259XG5cbiAgaW5pdEVkaXRvcjogKGVkaXRvciwgZGF0YSkgLT5cbiAgICBAZWRpdG9yID0gZWRpdG9yXG4gICAgQHVwZGF0ZVRleHQoZGF0YSlcbiAgICBAZGVzdHJveVN1YnNjcmlwdGlvbiA9IEBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICBAd3MuY2xvc2UoKSB1bmxlc3MgQGNsb3NlZFxuICAgIEBjaGFuZ2VTdWJzY3JpcHRpb24gPSBAZWRpdG9yLm9uRGlkQ2hhbmdlID0+XG4gICAgICBAc2VuZENoYW5nZXMoKSB1bmxlc3MgQGNsb3NlZCB8fCBAaWdub3JlQ2hhbmdlc1xuICAgICAgQGlnbm9yZUNoYW5nZXMgPSBmYWxzZVxuXG4gIHNlbmRDaGFuZ2VzOiAtPlxuICAgIGxpbmVzID0gQGVkaXRvci5nZXRCdWZmZXIoKS5saW5lcyB8fCBAZWRpdG9yLmdldEJ1ZmZlcigpLmdldExpbmVzKClcbiAgICBtZXNzYWdlID1cbiAgICAgIHR5cGU6ICd1cGRhdGVUZXh0J1xuICAgICAgcGF5bG9hZDpcbiAgICAgICAgdGV4dDogbGluZXMuam9pbignXFxuJylcbiAgICBAd3Muc2VuZCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKVxuXG4gIHVwZGF0ZVRleHQ6IChkYXRhKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvciAmJiBAZWRpdG9yLmlzQWxpdmUoKVxuICAgIEBpZ25vcmVDaGFuZ2VzID0gdHJ1ZSAjIGF2b2lkIHNlbmRpbmcgcmVjZWl2ZWQgY2hhbmdlc1xuICAgIEBlZGl0b3Iuc2V0VGV4dChkYXRhLnRleHQpXG4iXX0=

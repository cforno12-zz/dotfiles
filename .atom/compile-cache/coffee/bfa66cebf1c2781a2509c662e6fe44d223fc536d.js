(function() {
  var CompositeDisposable, MultiCursor, Point;

  CompositeDisposable = require('atom').CompositeDisposable;

  Point = require('atom').Point;

  module.exports = MultiCursor = {
    subscriptions: null,
    editor: null,
    firstActivation: true,
    firstBuffer: null,
    currentPosition: null,
    skipCount: 0,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:expandDown': (function(_this) {
          return function() {
            return _this.expandDown();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:expandUp': (function(_this) {
          return function() {
            return _this.expandUp();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:move-last-cursor-up': (function(_this) {
          return function() {
            return _this.moveLastCursorUp();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:move-last-cursor-down': (function(_this) {
          return function() {
            return _this.moveLastCursorDown();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:move-last-cursor-left': (function(_this) {
          return function() {
            return _this.moveLastCursorLeft();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor:move-last-cursor-right': (function(_this) {
          return function() {
            return _this.moveLastCursorRight();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.currentPosition = null;
      this.firstBuffer = null;
      return this.editor = null;
    },
    serialize: function() {
      return this.currentPosition = null;
    },
    expandDown: function() {
      return this.expandInDirection(1);
    },
    expandUp: function() {
      return this.expandInDirection(-1);
    },
    expandInDirection: function(dir) {
      var coords, cursors, editor, lastCursor, newCoords, newCursor;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (!(lastCursor = editor.getLastCursor())) {
        return;
      }
      cursors = editor.getCursors();
      coords = lastCursor.getBufferPosition();
      newCoords = {
        column: lastCursor.goalColumn || coords.column,
        row: coords.row + dir + this.skipCount
      };
      if (newCoords.row < 0 || newCoords.row > editor.getLastBufferRow()) {
        return;
      }
      newCursor = editor.addCursorAtBufferPosition(newCoords);
      newCursor.goalColumn = lastCursor.goalColumn || coords.column;
      if (cursors.length === editor.getCursors().length) {
        if (editor.hasMultipleCursors()) {
          lastCursor.destroy();
        }
      }
      return this.skipCount = 0;
    },
    moveLastCursorUp: function() {
      var cursor, editor;
      this.skipCount = 0;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (!(cursor = editor.getLastCursor())) {
        return;
      }
      if (cursor.selection.isEmpty()) {
        cursor.moveUp();
      } else {
        cursor.selection.modifySelection(function() {
          return cursor.moveUp();
        });
      }
      return editor.mergeCursors();
    },
    moveLastCursorDown: function() {
      var cursor, editor;
      this.skipCount = 0;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (!(cursor = editor.getLastCursor())) {
        return;
      }
      if (cursor.selection.isEmpty()) {
        cursor.moveDown();
      } else {
        cursor.selection.modifySelection(function() {
          return cursor.moveDown();
        });
      }
      return editor.mergeCursors();
    },
    moveLastCursorLeft: function() {
      var cursor, editor;
      this.skipCount = 0;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (!(cursor = editor.getLastCursor())) {
        return;
      }
      if (cursor.selection.isEmpty()) {
        cursor.moveLeft();
      } else {
        cursor.selection.modifySelection(function() {
          return cursor.moveLeft();
        });
      }
      return editor.mergeCursors();
    },
    moveLastCursorRight: function() {
      var cursor, editor;
      this.skipCount = 0;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (!(cursor = editor.getLastCursor())) {
        return;
      }
      if (cursor.selection.isEmpty()) {
        cursor.moveRight();
      } else {
        cursor.selection.modifySelection(function() {
          return cursor.moveRight();
        });
      }
      return editor.mergeCursors();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9tdWx0aS1jdXJzb3IvbGliL211bHRpLWN1cnNvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLE1BQUEsRUFBUSxJQURSO0lBRUEsZUFBQSxFQUFpQixJQUZqQjtJQUdBLFdBQUEsRUFBYSxJQUhiO0lBSUEsZUFBQSxFQUFpQixJQUpqQjtJQUtBLFNBQUEsRUFBVyxDQUxYO0lBT0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSx5QkFBQSxFQUEyQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0I7T0FBdEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtPQUF0QyxDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FB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XG57UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aUN1cnNvciA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZWRpdG9yOiBudWxsXG4gIGZpcnN0QWN0aXZhdGlvbjogdHJ1ZVxuICBmaXJzdEJ1ZmZlcjogbnVsbFxuICBjdXJyZW50UG9zaXRpb246IG51bGxcbiAgc2tpcENvdW50OiAwXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ211bHRpLWN1cnNvcjpleHBhbmREb3duJzogPT4gQGV4cGFuZERvd24oKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdtdWx0aS1jdXJzb3I6ZXhwYW5kVXAnOiA9PiBAZXhwYW5kVXAoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ211bHRpLWN1cnNvcjptb3ZlLWxhc3QtY3Vyc29yLXVwJzogPT4gQG1vdmVMYXN0Q3Vyc29yVXAoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdtdWx0aS1jdXJzb3I6bW92ZS1sYXN0LWN1cnNvci1kb3duJzogPT4gQG1vdmVMYXN0Q3Vyc29yRG93bigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ211bHRpLWN1cnNvcjptb3ZlLWxhc3QtY3Vyc29yLWxlZnQnOiA9PiBAbW92ZUxhc3RDdXJzb3JMZWZ0KClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnbXVsdGktY3Vyc29yOm1vdmUtbGFzdC1jdXJzb3ItcmlnaHQnOiA9PiBAbW92ZUxhc3RDdXJzb3JSaWdodCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAY3VycmVudFBvc2l0aW9uID0gbnVsbFxuICAgIEBmaXJzdEJ1ZmZlciA9IG51bGxcbiAgICBAZWRpdG9yID0gbnVsbFxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBAY3VycmVudFBvc2l0aW9uID0gbnVsbFxuXG4gIGV4cGFuZERvd246IC0+XG4gICAgQGV4cGFuZEluRGlyZWN0aW9uKDEpXG5cbiAgZXhwYW5kVXA6IC0+XG4gICAgQGV4cGFuZEluRGlyZWN0aW9uKC0xKVxuXG4gIGV4cGFuZEluRGlyZWN0aW9uOiAoZGlyKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBsYXN0Q3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGN1cnNvcnMgPSBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgY29vcmRzID0gbGFzdEN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBuZXdDb29yZHMgPSB7IGNvbHVtbjogbGFzdEN1cnNvci5nb2FsQ29sdW1uIHx8IGNvb3Jkcy5jb2x1bW4sIHJvdzogY29vcmRzLnJvdyArIGRpciArIEBza2lwQ291bnQgfVxuICAgIHJldHVybiBpZiBuZXdDb29yZHMucm93IDwgMCBvciBuZXdDb29yZHMucm93ID4gZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKVxuXG4gICAgbmV3Q3Vyc29yID0gZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24obmV3Q29vcmRzKVxuICAgIG5ld0N1cnNvci5nb2FsQ29sdW1uID0gbGFzdEN1cnNvci5nb2FsQ29sdW1uIHx8IGNvb3Jkcy5jb2x1bW5cblxuICAgIGlmIGN1cnNvcnMubGVuZ3RoIGlzIGVkaXRvci5nZXRDdXJzb3JzKCkubGVuZ3RoXG4gICAgICAjIG5vIGN1cnNvciB3YXMgYWRkZWQgc28gd2UgdHJpZWQgdG8gYWRkIGEgY3Vyc29yIHdoZXJlIHRoZXJlIGlzIG9uZSBhbHJlYWR5XG4gICAgICBsYXN0Q3Vyc29yLmRlc3Ryb3koKSBpZiBlZGl0b3IuaGFzTXVsdGlwbGVDdXJzb3JzKClcblxuICAgIEBza2lwQ291bnQgPSAwXG5cbiAgbW92ZUxhc3RDdXJzb3JVcDogLT5cbiAgICBAc2tpcENvdW50ID0gMFxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgaWYgY3Vyc29yLnNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIGN1cnNvci5tb3ZlVXAoKVxuICAgIGVsc2VcbiAgICAgIGN1cnNvci5zZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uIC0+IGN1cnNvci5tb3ZlVXAoKVxuICAgIGVkaXRvci5tZXJnZUN1cnNvcnMoKVxuXG4gIG1vdmVMYXN0Q3Vyc29yRG93bjogLT5cbiAgICBAc2tpcENvdW50ID0gMFxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgaWYgY3Vyc29yLnNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIGN1cnNvci5tb3ZlRG93bigpXG4gICAgZWxzZVxuICAgICAgY3Vyc29yLnNlbGVjdGlvbi5tb2RpZnlTZWxlY3Rpb24gLT4gY3Vyc29yLm1vdmVEb3duKClcbiAgICBlZGl0b3IubWVyZ2VDdXJzb3JzKClcblxuICBtb3ZlTGFzdEN1cnNvckxlZnQ6IC0+XG4gICAgQHNraXBDb3VudCA9IDBcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGlmIGN1cnNvci5zZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICBjdXJzb3IubW92ZUxlZnQoKVxuICAgIGVsc2VcbiAgICAgIGN1cnNvci5zZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uIC0+IGN1cnNvci5tb3ZlTGVmdCgpXG4gICAgZWRpdG9yLm1lcmdlQ3Vyc29ycygpXG5cbiAgbW92ZUxhc3RDdXJzb3JSaWdodDogLT5cbiAgICBAc2tpcENvdW50ID0gMFxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgaWYgY3Vyc29yLnNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIGN1cnNvci5tb3ZlUmlnaHQoKVxuICAgIGVsc2VcbiAgICAgIGN1cnNvci5zZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uIC0+IGN1cnNvci5tb3ZlUmlnaHQoKVxuICAgIGVkaXRvci5tZXJnZUN1cnNvcnMoKVxuIl19

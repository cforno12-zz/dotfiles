(function() {
  var CompositeDisposable, Mark, Point, State, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point;

  State = require('./state');

  Mark = (function() {
    Mark.deactivatable = [];

    Mark.deactivatePending = function() {
      var i, len, mark, ref1;
      ref1 = this.deactivatable;
      for (i = 0, len = ref1.length; i < len; i++) {
        mark = ref1[i];
        mark.deactivate();
      }
      return this.deactivatable.length = 0;
    };

    function Mark(cursor) {
      this.cursor = cursor;
      this.editor = cursor.editor;
      this.marker = this.editor.markBufferPosition(cursor.getBufferPosition());
      this.active = false;
      this.updating = false;
    }

    Mark.prototype.destroy = function() {
      if (this.active) {
        this.deactivate();
      }
      return this.marker.destroy();
    };

    Mark.prototype.set = function(point) {
      if (point == null) {
        point = this.cursor.getBufferPosition();
      }
      this.deactivate();
      this.marker.setHeadBufferPosition(point);
      this._updateSelection();
      return this;
    };

    Mark.prototype.getBufferPosition = function() {
      return this.marker.getHeadBufferPosition();
    };

    Mark.prototype.activate = function() {
      if (!this.active) {
        this.activeSubscriptions = new CompositeDisposable;
        this.activeSubscriptions.add(this.cursor.onDidChangePosition((function(_this) {
          return function(event) {
            return _this._updateSelection(event);
          };
        })(this)));
        this.activeSubscriptions.add(atom.commands.onDidDispatch((function(_this) {
          return function(event) {
            return _this._updateSelection(event);
          };
        })(this)));
        this.activeSubscriptions.add(this.editor.getBuffer().onDidChange((function(_this) {
          return function(event) {
            if (!(_this._isIndent(event) || _this._isOutdent(event))) {
              if (State.isDuringCommand) {
                return Mark.deactivatable.push(_this);
              } else {
                return _this.deactivate();
              }
            }
          };
        })(this)));
        return this.active = true;
      }
    };

    Mark.prototype.deactivate = function() {
      if (this.active) {
        this.activeSubscriptions.dispose();
        this.active = false;
      }
      if (!this.cursor.editor.isDestroyed()) {
        return this.cursor.clearSelection();
      }
    };

    Mark.prototype.isActive = function() {
      return this.active;
    };

    Mark.prototype.exchange = function() {
      var position;
      position = this.marker.getHeadBufferPosition();
      this.set().activate();
      return this.cursor.setBufferPosition(position);
    };

    Mark.prototype._updateSelection = function(event) {
      var head, tail;
      if (!this.updating) {
        this.updating = true;
        try {
          head = this.cursor.getBufferPosition();
          tail = this.marker.getHeadBufferPosition();
          return this.setSelectionRange(head, tail);
        } finally {
          this.updating = false;
        }
      }
    };

    Mark.prototype.getSelectionRange = function() {
      return this.cursor.selection.getBufferRange();
    };

    Mark.prototype.setSelectionRange = function(head, tail) {
      var reversed;
      reversed = Point.min(head, tail) === head;
      return this.cursor.selection.setBufferRange([head, tail], {
        reversed: reversed
      });
    };

    Mark.prototype._isIndent = function(event) {
      return this._isIndentOutdent(event.newRange, event.newText);
    };

    Mark.prototype._isOutdent = function(event) {
      return this._isIndentOutdent(event.oldRange, event.oldText);
    };

    Mark.prototype._isIndentOutdent = function(range, text) {
      var diff, tabLength;
      tabLength = this.editor.getTabLength();
      diff = range.end.column - range.start.column;
      if (diff === this.editor.getTabLength() && range.start.row === range.end.row && this._checkTextForSpaces(text, tabLength)) {
        return true;
      }
    };

    Mark.prototype._checkTextForSpaces = function(text, tabSize) {
      var ch, i, len;
      if (!(text && text.length === tabSize)) {
        return false;
      }
      for (i = 0, len = text.length; i < len; i++) {
        ch = text[i];
        if (ch !== " ") {
          return false;
        }
      }
      return true;
    };

    return Mark;

  })();

  module.exports = Mark;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL21hcmsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLDZDQUFELEVBQXNCOztFQUN0QixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0VBY0Y7SUFDSixJQUFDLENBQUEsYUFBRCxHQUFpQjs7SUFFakIsSUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUE7QUFDbEIsVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7UUFDRSxJQUFJLENBQUMsVUFBTCxDQUFBO0FBREY7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsR0FBd0I7SUFITjs7SUFLUCxjQUFDLE1BQUQ7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFNLENBQUM7TUFDakIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQTJCLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQTNCO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFMRDs7bUJBT2IsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFpQixJQUFDLENBQUEsTUFBbEI7UUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBQUE7O2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7SUFGTzs7bUJBSVQsR0FBQSxHQUFLLFNBQUMsS0FBRDs7UUFBQyxRQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTs7TUFDVixJQUFDLENBQUEsVUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUE4QixLQUE5QjtNQUNBLElBQUMsQ0FB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QUFBLGlCQUFPLE1BQVA7O0FBREY7YUFFQTtJQUxtQjs7Ozs7O0VBT3ZCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBdEhqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuU3RhdGUgPSByZXF1aXJlICcuL3N0YXRlJ1xuXG4jIFJlcHJlc2VudHMgYW4gRW1hY3Mtc3R5bGUgbWFyay5cbiNcbiMgRWFjaCBjdXJzb3IgbWF5IGhhdmUgYSBNYXJrLiBPbiBjb25zdHJ1Y3Rpb24sIHRoZSBtYXJrIGlzIGF0IHRoZSBjdXJzb3Inc1xuIyBwb3NpdGlvbi5cbiNcbiMgVGhlIG1hcmsgY2FuIHRoZW4gYmUgc2V0KCkgYXQgYW55IHRpbWUsIHdoaWNoIHdpbGwgbW92ZSBpdCB0byB3aGVyZSB0aGUgY3Vyc29yXG4jIGlzLlxuI1xuIyBJdCBjYW4gYWxzbyBiZSBhY3RpdmF0ZSgpZCBhbmQgZGVhY3RpdmF0ZSgpZC4gV2hpbGUgYWN0aXZlLCB0aGUgcmVnaW9uIGJldHdlZW5cbiMgdGhlIG1hcmsgYW5kIHRoZSBjdXJzb3IgaXMgc2VsZWN0ZWQsIGFuZCB0aGlzIHNlbGVjdGlvbiBpcyB1cGRhdGVkIGFzIHRoZVxuIyBjdXJzb3IgaXMgbW92ZWQuIElmIHRoZSBidWZmZXIgaXMgZWRpdGVkLCB0aGUgbWFyayBpcyBhdXRvbWF0aWNhbGx5XG4jIGRlYWN0aXZhdGVkLlxuY2xhc3MgTWFya1xuICBAZGVhY3RpdmF0YWJsZSA9IFtdXG5cbiAgQGRlYWN0aXZhdGVQZW5kaW5nOiAtPlxuICAgIGZvciBtYXJrIGluIEBkZWFjdGl2YXRhYmxlXG4gICAgICBtYXJrLmRlYWN0aXZhdGUoKVxuICAgIEBkZWFjdGl2YXRhYmxlLmxlbmd0aCA9IDBcblxuICBjb25zdHJ1Y3RvcjogKGN1cnNvcikgLT5cbiAgICBAY3Vyc29yID0gY3Vyc29yXG4gICAgQGVkaXRvciA9IGN1cnNvci5lZGl0b3JcbiAgICBAbWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUG9zaXRpb24oY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHVwZGF0aW5nID0gZmFsc2VcblxuICBkZXN0cm95OiAtPlxuICAgIEBkZWFjdGl2YXRlKCkgaWYgQGFjdGl2ZVxuICAgIEBtYXJrZXIuZGVzdHJveSgpXG5cbiAgc2V0OiAocG9pbnQ9QGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKSAtPlxuICAgIEBkZWFjdGl2YXRlKClcbiAgICBAbWFya2VyLnNldEhlYWRCdWZmZXJQb3NpdGlvbihwb2ludClcbiAgICBAX3VwZGF0ZVNlbGVjdGlvbigpXG4gICAgQFxuXG4gIGdldEJ1ZmZlclBvc2l0aW9uOiAtPlxuICAgIEBtYXJrZXIuZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcblxuICBhY3RpdmF0ZTogLT5cbiAgICBpZiBub3QgQGFjdGl2ZVxuICAgICAgQGFjdGl2ZVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgQGFjdGl2ZVN1YnNjcmlwdGlvbnMuYWRkIEBjdXJzb3Iub25EaWRDaGFuZ2VQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgIEBfdXBkYXRlU2VsZWN0aW9uKGV2ZW50KVxuICAgICAgIyBDdXJzb3IgbW92ZW1lbnQgY29tbWFuZHMgbGlrZSBjdXJzb3IubW92ZURvd24gZGVhY3RpdmF0ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAjIHVuY29uZGl0aW9uYWxseSwgYnV0IGRvbid0IHRyaWdnZXIgb25EaWRDaGFuZ2VQb3NpdGlvbiBpZiB0aGUgcG9zaXRpb25cbiAgICAgICMgZG9lc24ndCBjaGFuZ2UgKGUuZy4gYXQgRU9GKS4gU28gd2UgYWxzbyB1cGRhdGUgdGhlIHNlbGVjdGlvbiBhZnRlciBhbnlcbiAgICAgICMgY29tbWFuZC5cbiAgICAgIEBhY3RpdmVTdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLm9uRGlkRGlzcGF0Y2ggKGV2ZW50KSA9PlxuICAgICAgICBAX3VwZGF0ZVNlbGVjdGlvbihldmVudClcbiAgICAgIEBhY3RpdmVTdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlIChldmVudCkgPT5cbiAgICAgICAgdW5sZXNzIEBfaXNJbmRlbnQoZXZlbnQpIG9yIEBfaXNPdXRkZW50KGV2ZW50KVxuICAgICAgICAgICMgSWYgd2UncmUgaW4gYSBjb21tYW5kIChhcyBvcHBvc2VkIHRvIGEgc2ltcGxlIGNoYXJhY3RlciBpbnNlcnQpLFxuICAgICAgICAgICMgZGVsYXkgdGhlIGRlYWN0aXZhdGlvbiB1bnRpbCB0aGUgZW5kIG9mIHRoZSBjb21tYW5kLiBPdGhlcndpc2VcbiAgICAgICAgICAjIHVwZGF0aW5nIG9uZSBzZWxlY3Rpb24gbWF5IHByZW1hdHVyZWx5IGRlYWN0aXZhdGUgdGhlIG1hcmsgYW5kIGNsZWFyXG4gICAgICAgICAgIyBhIHNlY29uZCBzZWxlY3Rpb24gYmVmb3JlIGl0IGhhcyBhIGNoYW5jZSB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgIGlmIFN0YXRlLmlzRHVyaW5nQ29tbWFuZFxuICAgICAgICAgICAgTWFyay5kZWFjdGl2YXRhYmxlLnB1c2godGhpcylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGVhY3RpdmF0ZSgpXG4gICAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgaWYgQGFjdGl2ZVxuICAgICAgQGFjdGl2ZVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBAYWN0aXZlID0gZmFsc2VcbiAgICB1bmxlc3MgQGN1cnNvci5lZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgICAgQGN1cnNvci5jbGVhclNlbGVjdGlvbigpXG5cbiAgaXNBY3RpdmU6IC0+XG4gICAgQGFjdGl2ZVxuXG4gIGV4Y2hhbmdlOiAtPlxuICAgIHBvc2l0aW9uID0gQG1hcmtlci5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIEBzZXQoKS5hY3RpdmF0ZSgpXG4gICAgQGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcblxuICBfdXBkYXRlU2VsZWN0aW9uOiAoZXZlbnQpIC0+XG4gICAgIyBVcGRhdGluZyB0aGUgc2VsZWN0aW9uIHVwZGF0ZXMgdGhlIGN1cnNvciBtYXJrZXIsIHNvIGd1YXJkIGFnYWluc3QgdGhlXG4gICAgIyBuZXN0ZWQgaW52b2NhdGlvbi5cbiAgICBpZiAhQHVwZGF0aW5nXG4gICAgICBAdXBkYXRpbmcgPSB0cnVlXG4gICAgICB0cnlcbiAgICAgICAgaGVhZCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgICB0YWlsID0gQG1hcmtlci5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgICAgICBAc2V0U2VsZWN0aW9uUmFuZ2UoaGVhZCwgdGFpbClcbiAgICAgIGZpbmFsbHlcbiAgICAgICAgQHVwZGF0aW5nID0gZmFsc2VcblxuICBnZXRTZWxlY3Rpb25SYW5nZTogLT5cbiAgICBAY3Vyc29yLnNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgc2V0U2VsZWN0aW9uUmFuZ2U6IChoZWFkLCB0YWlsKSAtPlxuICAgIHJldmVyc2VkID0gUG9pbnQubWluKGhlYWQsIHRhaWwpIGlzIGhlYWRcbiAgICBAY3Vyc29yLnNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShbaGVhZCwgdGFpbF0sIHJldmVyc2VkOiByZXZlcnNlZClcblxuICBfaXNJbmRlbnQ6IChldmVudCktPlxuICAgIEBfaXNJbmRlbnRPdXRkZW50KGV2ZW50Lm5ld1JhbmdlLCBldmVudC5uZXdUZXh0KVxuXG4gIF9pc091dGRlbnQ6IChldmVudCktPlxuICAgIEBfaXNJbmRlbnRPdXRkZW50KGV2ZW50Lm9sZFJhbmdlLCBldmVudC5vbGRUZXh0KVxuXG4gIF9pc0luZGVudE91dGRlbnQ6IChyYW5nZSwgdGV4dCktPlxuICAgIHRhYkxlbmd0aCA9IEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICBkaWZmID0gcmFuZ2UuZW5kLmNvbHVtbiAtIHJhbmdlLnN0YXJ0LmNvbHVtblxuICAgIHRydWUgaWYgZGlmZiA9PSBAZWRpdG9yLmdldFRhYkxlbmd0aCgpIGFuZCByYW5nZS5zdGFydC5yb3cgPT0gcmFuZ2UuZW5kLnJvdyBhbmQgQF9jaGVja1RleHRGb3JTcGFjZXModGV4dCwgdGFiTGVuZ3RoKVxuXG4gIF9jaGVja1RleHRGb3JTcGFjZXM6ICh0ZXh0LCB0YWJTaXplKS0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyB0ZXh0IGFuZCB0ZXh0Lmxlbmd0aCBpcyB0YWJTaXplXG5cbiAgICBmb3IgY2ggaW4gdGV4dFxuICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBjaCBpcyBcIiBcIlxuICAgIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBNYXJrXG4iXX0=

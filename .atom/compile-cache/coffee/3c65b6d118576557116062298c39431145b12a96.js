(function() {
  var StatusBarView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = StatusBarView = (function() {
    function StatusBarView() {
      this.removeElement = bind(this.removeElement, this);
      this.getElement = bind(this.getElement, this);
      this.element = document.createElement('div');
      this.element.classList.add("highlight-selected-status", "inline-block");
    }

    StatusBarView.prototype.updateCount = function(count) {
      var statusBarString;
      statusBarString = atom.config.get("highlight-selected.statusBarString");
      this.element.textContent = statusBarString.replace("%c", count);
      if (count === 0) {
        return this.element.classList.add("highlight-selected-hidden");
      } else {
        return this.element.classList.remove("highlight-selected-hidden");
      }
    };

    StatusBarView.prototype.getElement = function() {
      return this.element;
    };

    StatusBarView.prototype.removeElement = function() {
      this.element.parentNode.removeChild(this.element);
      return this.element = null;
    };

    return StatusBarView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL3N0YXR1cy1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGFBQUE7SUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsdUJBQUE7OztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QiwyQkFBdkIsRUFBbUQsY0FBbkQ7SUFGVzs7NEJBSWIsV0FBQSxHQUFhLFNBQUMsS0FBRDtBQUNYLFVBQUE7TUFBQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEI7TUFDbEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixFQUE4QixLQUE5QjtNQUN2QixJQUFHLEtBQUEsS0FBUyxDQUFaO2VBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsMkJBQXZCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsMkJBQTFCLEVBSEY7O0lBSFc7OzRCQVFiLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7OzRCQUdaLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLE9BQWpDO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZFOzs7OztBQWpCakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdGF0dXNCYXJWaWV3XG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHQtc2VsZWN0ZWQtc3RhdHVzXCIsXCJpbmxpbmUtYmxvY2tcIilcblxuICB1cGRhdGVDb3VudDogKGNvdW50KSAtPlxuICAgIHN0YXR1c0JhclN0cmluZyA9IGF0b20uY29uZmlnLmdldChcImhpZ2hsaWdodC1zZWxlY3RlZC5zdGF0dXNCYXJTdHJpbmdcIilcbiAgICBAZWxlbWVudC50ZXh0Q29udGVudCA9IHN0YXR1c0JhclN0cmluZy5yZXBsYWNlKFwiJWNcIiwgY291bnQpXG4gICAgaWYgY291bnQgPT0gMFxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodC1zZWxlY3RlZC1oaWRkZW5cIilcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLWhpZGRlblwiKVxuXG4gIGdldEVsZW1lbnQ6ID0+XG4gICAgQGVsZW1lbnRcblxuICByZW1vdmVFbGVtZW50OiA9PlxuICAgIEBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoQGVsZW1lbnQpXG4gICAgQGVsZW1lbnQgPSBudWxsXG4iXX0=

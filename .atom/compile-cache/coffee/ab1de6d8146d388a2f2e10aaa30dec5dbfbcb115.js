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
      this.element.textContent = "Highlighted: " + count;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL3N0YXR1cy1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGFBQUE7SUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsdUJBQUE7OztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QiwyQkFBdkIsRUFBbUQsY0FBbkQ7SUFGVzs7NEJBSWIsV0FBQSxHQUFhLFNBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxHQUF1QixlQUFBLEdBQWtCO01BQ3pDLElBQUcsS0FBQSxLQUFTLENBQVo7ZUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QiwyQkFBdkIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFuQixDQUEwQiwyQkFBMUIsRUFIRjs7SUFGVzs7NEJBT2IsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUE7SUFEUzs7NEJBR1osYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFwQixDQUFnQyxJQUFDLENBQUEsT0FBakM7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRkU7Ozs7O0FBaEJqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXR1c0JhclZpZXdcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodC1zZWxlY3RlZC1zdGF0dXNcIixcImlubGluZS1ibG9ja1wiKVxuXG4gIHVwZGF0ZUNvdW50OiAoY291bnQpIC0+XG4gICAgQGVsZW1lbnQudGV4dENvbnRlbnQgPSBcIkhpZ2hsaWdodGVkOiBcIiArIGNvdW50XG4gICAgaWYgY291bnQgPT0gMFxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodC1zZWxlY3RlZC1oaWRkZW5cIilcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLWhpZGRlblwiKVxuXG4gIGdldEVsZW1lbnQ6ID0+XG4gICAgQGVsZW1lbnRcblxuICByZW1vdmVFbGVtZW50OiA9PlxuICAgIEBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoQGVsZW1lbnQpXG4gICAgQGVsZW1lbnQgPSBudWxsXG4iXX0=

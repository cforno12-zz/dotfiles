Object.defineProperty(exports, '__esModule', {
  value: true
});

/** @jsx jsx */
// eslint-disable-next-line no-unused-vars

var _vanillaJsx = require('vanilla-jsx');

var _helpers = require('../helpers');

exports['default'] = (0, _vanillaJsx.createClass)({
  renderView: function renderView(suggestions, selectCallback) {
    var className = 'select-list popover-list';
    if (suggestions.length > 7) {
      className += ' intentions-scroll';
    }

    this.suggestions = suggestions;
    this.suggestionsCount = suggestions.length;
    this.suggestionsIndex = -1;
    this.selectCallback = selectCallback;

    return (0, _vanillaJsx.jsx)(
      'intentions-list',
      { 'class': className, id: 'intentions-list' },
      (0, _vanillaJsx.jsx)(
        'ol',
        { 'class': 'list-group', ref: 'list' },
        suggestions.map(function (suggestion) {
          return (0, _vanillaJsx.jsx)(
            'li',
            null,
            (0, _vanillaJsx.jsx)(
              'span',
              { 'class': suggestion[_helpers.$class], 'on-click': function () {
                  selectCallback(suggestion);
                } },
              suggestion.title
            )
          );
        })
      )
    );
  },
  move: function move(movement) {
    var newIndex = this.suggestionsIndex;

    if (movement === 'up') {
      newIndex--;
    } else if (movement === 'down') {
      newIndex++;
    } else if (movement === 'move-to-top') {
      newIndex = 0;
    } else if (movement === 'move-to-bottom') {
      newIndex = this.suggestionsCount;
    }
    // TODO: Implement page up/down
    newIndex %= this.suggestionsCount;
    if (newIndex < 0) {
      newIndex = this.suggestionsCount + newIndex;
    }
    this.selectIndex(newIndex);
  },
  selectIndex: function selectIndex(index) {
    if (this.refs.active) {
      this.refs.active.classList.remove('selected');
    }

    this.refs.active = this.refs.list.children[index];
    this.refs.active.classList.add('selected');

    this.refs.active.scrollIntoViewIfNeeded(false);
    this.suggestionsIndex = index;
  },
  select: function select() {
    this.selectCallback(this.suggestions[this.suggestionsIndex]);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvZWxlbWVudHMvbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzBCQUlpQyxhQUFhOzt1QkFDdkIsWUFBWTs7cUJBR3BCLDZCQUFZO0FBQ3pCLFlBQVUsRUFBQSxvQkFBQyxXQUFXLEVBQUUsY0FBYyxFQUFFO0FBQ3RDLFFBQUksU0FBUyxHQUFHLDBCQUEwQixDQUFBO0FBQzFDLFFBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDMUIsZUFBUyxJQUFJLG9CQUFvQixDQUFBO0tBQ2xDOztBQUVELFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFBO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMxQixRQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQTs7QUFFcEMsV0FBTzs7UUFBaUIsU0FBTyxTQUFTLEFBQUMsRUFBQyxFQUFFLEVBQUMsaUJBQWlCO01BQzVEOztVQUFJLFNBQU0sWUFBWSxFQUFDLEdBQUcsRUFBQyxNQUFNO1FBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBUyxVQUFVLEVBQUU7QUFDcEMsaUJBQU87OztZQUNMOztnQkFBTSxTQUFPLFVBQVUsaUJBQVEsQUFBQyxFQUFDLFlBQVUsWUFBVztBQUNwRCxnQ0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2lCQUMzQixBQUFDO2NBQUUsVUFBVSxDQUFDLEtBQUs7YUFBUTtXQUN6QixDQUFBO1NBQ04sQ0FBQztPQUNDO0tBQ1csQ0FBQTtHQUNuQjtBQUNELE1BQUksRUFBQSxjQUFDLFFBQXNCLEVBQUU7QUFDM0IsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFBOztBQUVwQyxRQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDckIsY0FBUSxFQUFFLENBQUE7S0FDWCxNQUFNLElBQUksUUFBUSxLQUFLLE1BQU0sRUFBRTtBQUM5QixjQUFRLEVBQUUsQ0FBQTtLQUNYLE1BQU0sSUFBSSxRQUFRLEtBQUssYUFBYSxFQUFFO0FBQ3JDLGNBQVEsR0FBRyxDQUFDLENBQUE7S0FDYixNQUFNLElBQUksUUFBUSxLQUFLLGdCQUFnQixFQUFFO0FBQ3hDLGNBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7S0FDakM7O0FBRUQsWUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtBQUNqQyxRQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFDaEIsY0FBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUE7S0FDNUM7QUFDRCxRQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQzNCO0FBQ0QsYUFBVyxFQUFBLHFCQUFDLEtBQUssRUFBRTtBQUNqQixRQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDOUM7O0FBRUQsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2pELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTFDLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzlDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7R0FDOUI7QUFDRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtHQUM3RDtDQUNGLENBQUMiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9lbGVtZW50cy9saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLyoqIEBqc3gganN4ICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmltcG9ydCB7IGNyZWF0ZUNsYXNzLCBqc3ggfSBmcm9tICd2YW5pbGxhLWpzeCdcbmltcG9ydCB7ICRjbGFzcyB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpc3RNb3ZlbWVudCB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDbGFzcyh7XG4gIHJlbmRlclZpZXcoc3VnZ2VzdGlvbnMsIHNlbGVjdENhbGxiYWNrKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdzZWxlY3QtbGlzdCBwb3BvdmVyLWxpc3QnXG4gICAgaWYgKHN1Z2dlc3Rpb25zLmxlbmd0aCA+IDcpIHtcbiAgICAgIGNsYXNzTmFtZSArPSAnIGludGVudGlvbnMtc2Nyb2xsJ1xuICAgIH1cblxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uc1xuICAgIHRoaXMuc3VnZ2VzdGlvbnNDb3VudCA9IHN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgIHRoaXMuc3VnZ2VzdGlvbnNJbmRleCA9IC0xXG4gICAgdGhpcy5zZWxlY3RDYWxsYmFjayA9IHNlbGVjdENhbGxiYWNrXG5cbiAgICByZXR1cm4gPGludGVudGlvbnMtbGlzdCBjbGFzcz17Y2xhc3NOYW1lfSBpZD1cImludGVudGlvbnMtbGlzdFwiPlxuICAgICAgPG9sIGNsYXNzPVwibGlzdC1ncm91cFwiIHJlZj1cImxpc3RcIj5cbiAgICAgICAge3N1Z2dlc3Rpb25zLm1hcChmdW5jdGlvbihzdWdnZXN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIDxsaT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPXtzdWdnZXN0aW9uWyRjbGFzc119IG9uLWNsaWNrPXtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2VsZWN0Q2FsbGJhY2soc3VnZ2VzdGlvbilcbiAgICAgICAgICAgIH19PntzdWdnZXN0aW9uLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICB9KX1cbiAgICAgIDwvb2w+XG4gICAgPC9pbnRlbnRpb25zLWxpc3Q+XG4gIH0sXG4gIG1vdmUobW92ZW1lbnQ6IExpc3RNb3ZlbWVudCkge1xuICAgIGxldCBuZXdJbmRleCA9IHRoaXMuc3VnZ2VzdGlvbnNJbmRleFxuXG4gICAgaWYgKG1vdmVtZW50ID09PSAndXAnKSB7XG4gICAgICBuZXdJbmRleC0tXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ2Rvd24nKSB7XG4gICAgICBuZXdJbmRleCsrXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ21vdmUtdG8tdG9wJykge1xuICAgICAgbmV3SW5kZXggPSAwXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ21vdmUtdG8tYm90dG9tJykge1xuICAgICAgbmV3SW5kZXggPSB0aGlzLnN1Z2dlc3Rpb25zQ291bnRcbiAgICB9XG4gICAgLy8gVE9ETzogSW1wbGVtZW50IHBhZ2UgdXAvZG93blxuICAgIG5ld0luZGV4ICU9IHRoaXMuc3VnZ2VzdGlvbnNDb3VudFxuICAgIGlmIChuZXdJbmRleCA8IDApIHtcbiAgICAgIG5ld0luZGV4ID0gdGhpcy5zdWdnZXN0aW9uc0NvdW50ICsgbmV3SW5kZXhcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RJbmRleChuZXdJbmRleClcbiAgfSxcbiAgc2VsZWN0SW5kZXgoaW5kZXgpIHtcbiAgICBpZiAodGhpcy5yZWZzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5yZWZzLmFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfVxuXG4gICAgdGhpcy5yZWZzLmFjdGl2ZSA9IHRoaXMucmVmcy5saXN0LmNoaWxkcmVuW2luZGV4XVxuICAgIHRoaXMucmVmcy5hY3RpdmUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXG4gICAgdGhpcy5yZWZzLmFjdGl2ZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKGZhbHNlKVxuICAgIHRoaXMuc3VnZ2VzdGlvbnNJbmRleCA9IGluZGV4XG4gIH0sXG4gIHNlbGVjdCgpIHtcbiAgICB0aGlzLnNlbGVjdENhbGxiYWNrKHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zdWdnZXN0aW9uc0luZGV4XSlcbiAgfSxcbn0pXG4iXX0=
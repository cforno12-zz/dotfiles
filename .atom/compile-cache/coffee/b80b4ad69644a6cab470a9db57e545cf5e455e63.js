(function() {
  module.exports = {
    initialize: function() {
      this._killed = this.killing = false;
      this._yanked = this.yanking = false;
      this.previousCommand = null;
      this.recenters = 0;
      return this._recentered = false;
    },
    beforeCommand: function(event) {
      return this.isDuringCommand = true;
    },
    afterCommand: function(event) {
      if ((this.killing = this._killed)) {
        this._killed = false;
      }
      if ((this.yanking = this._yanked)) {
        this._yanked = false;
      }
      if (this._recentered) {
        this._recentered = false;
        this.recenters = (this.recenters + 1) % 3;
      } else {
        this.recenters = 0;
      }
      this.previousCommand = event.type;
      return this.isDuringCommand = false;
    },
    killed: function() {
      return this._killed = true;
    },
    yanked: function() {
      return this._yanked = true;
    },
    recentered: function() {
      return this._recentered = true;
    },
    yankComplete: function() {
      return this.yanking && !this._yanked;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL3N0YXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxVQUFBLEVBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUN0QixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDdEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7TUFDbkIsSUFBQyxDQUFBLFNBQUQsR0FBYTthQUNiLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFMTCxDQUFaO0lBT0EsYUFBQSxFQUFlLFNBQUMsS0FBRDthQUNiLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBRE4sQ0FQZjtJQVVBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7TUFDWixJQUFHLENBQUMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBYixDQUFIO1FBQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQURiOztNQUdBLElBQUcsQ0FBQyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFiLENBQUg7UUFDRSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BRGI7O01BR0EsSUFBRyxJQUFDLENBQUEsV0FBSjtRQUNFLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFDZixJQUFDLENBQUEsU0FBRCxHQUFhLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFkLENBQUEsR0FBbUIsRUFGbEM7T0FBQSxNQUFBO1FBSUUsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUpmOztNQU1BLElBQUMsQ0FBQSxlQUFELEdBQW1CLEtBQUssQ0FBQzthQUN6QixJQUFDLENBQUEsZUFBRCxHQUFtQjtJQWRQLENBVmQ7SUEwQkEsTUFBQSxFQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsT0FBRCxHQUFXO0lBREwsQ0ExQlI7SUE2QkEsTUFBQSxFQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsT0FBRCxHQUFXO0lBREwsQ0E3QlI7SUFnQ0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsV0FBRCxHQUFlO0lBREwsQ0FoQ1o7SUFtQ0EsWUFBQSxFQUFjLFNBQUE7YUFBRyxJQUFDLENBQUEsT0FBRCxJQUFhLENBQUksSUFBQyxDQUFBO0lBQXJCLENBbkNkOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBpbml0aWFsaXplOiAtPlxuICAgIEBfa2lsbGVkID0gQGtpbGxpbmcgPSBmYWxzZVxuICAgIEBfeWFua2VkID0gQHlhbmtpbmcgPSBmYWxzZVxuICAgIEBwcmV2aW91c0NvbW1hbmQgPSBudWxsXG4gICAgQHJlY2VudGVycyA9IDBcbiAgICBAX3JlY2VudGVyZWQgPSBmYWxzZVxuXG4gIGJlZm9yZUNvbW1hbmQ6IChldmVudCkgLT5cbiAgICBAaXNEdXJpbmdDb21tYW5kID0gdHJ1ZVxuXG4gIGFmdGVyQ29tbWFuZDogKGV2ZW50KSAtPlxuICAgIGlmIChAa2lsbGluZyA9IEBfa2lsbGVkKVxuICAgICAgQF9raWxsZWQgPSBmYWxzZVxuXG4gICAgaWYgKEB5YW5raW5nID0gQF95YW5rZWQpXG4gICAgICBAX3lhbmtlZCA9IGZhbHNlXG5cbiAgICBpZiBAX3JlY2VudGVyZWRcbiAgICAgIEBfcmVjZW50ZXJlZCA9IGZhbHNlXG4gICAgICBAcmVjZW50ZXJzID0gKEByZWNlbnRlcnMgKyAxKSAlIDNcbiAgICBlbHNlXG4gICAgICBAcmVjZW50ZXJzID0gMFxuXG4gICAgQHByZXZpb3VzQ29tbWFuZCA9IGV2ZW50LnR5cGVcbiAgICBAaXNEdXJpbmdDb21tYW5kID0gZmFsc2VcblxuICBraWxsZWQ6IC0+XG4gICAgQF9raWxsZWQgPSB0cnVlXG5cbiAgeWFua2VkOiAtPlxuICAgIEBfeWFua2VkID0gdHJ1ZVxuXG4gIHJlY2VudGVyZWQ6IC0+XG4gICAgQF9yZWNlbnRlcmVkID0gdHJ1ZVxuXG4gIHlhbmtDb21wbGV0ZTogLT4gQHlhbmtpbmcgYW5kIG5vdCBAX3lhbmtlZFxuIl19

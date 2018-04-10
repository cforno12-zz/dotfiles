(function() {
  module.exports = function(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2VzY2FwZS1yZWctZXhwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsTUFBRDtJQUNmLElBQUcsTUFBSDthQUNFLE1BQU0sQ0FBQyxPQUFQLENBQWUsd0JBQWYsRUFBeUMsTUFBekMsRUFERjtLQUFBLE1BQUE7YUFHRSxHQUhGOztFQURlO0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBodHRwczovL2dpdGh1Yi5jb20vYXRvbS91bmRlcnNjb3JlLXBsdXMvYmxvYi80YTAyMmNmNzIvc3JjL3VuZGVyc2NvcmUtcGx1cy5jb2ZmZWUjTDEzNi1MMTQwXG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cmluZykgLT5cbiAgaWYgc3RyaW5nXG4gICAgc3RyaW5nLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpXG4gIGVsc2VcbiAgICAnJ1xuIl19

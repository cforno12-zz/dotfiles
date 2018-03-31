(function() {
  var path;

  path = require('path');

  module.exports = function(p) {
    if (p == null) {
      return;
    }
    if (p.match(/\/\.pigments$/)) {
      return 'pigments';
    } else {
      return path.extname(p).slice(1);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvc2NvcGUtZnJvbS1maWxlLW5hbWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxDQUFEO0lBQ2YsSUFBYyxTQUFkO0FBQUEsYUFBQTs7SUFDQSxJQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsZUFBUixDQUFIO2FBQWlDLFdBQWpDO0tBQUEsTUFBQTthQUFpRCxJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsQ0FBZ0IsVUFBakU7O0VBRmU7QUFEakIiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbm1vZHVsZS5leHBvcnRzID0gKHApIC0+XG4gIHJldHVybiB1bmxlc3MgcD9cbiAgaWYgcC5tYXRjaCgvXFwvXFwucGlnbWVudHMkLykgdGhlbiAncGlnbWVudHMnIGVsc2UgcGF0aC5leHRuYW1lKHApWzEuLi0xXVxuIl19

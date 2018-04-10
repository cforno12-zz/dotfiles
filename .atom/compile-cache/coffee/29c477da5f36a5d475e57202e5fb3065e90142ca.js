(function() {
  var fs, path,
    slice = [].slice;

  fs = require('fs');

  path = require('path');

  module.exports = {
    jsonFixture: function() {
      var paths;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return function(fixture, data) {
        var json, jsonPath;
        jsonPath = path.resolve.apply(path, slice.call(paths).concat([fixture]));
        json = fs.readFileSync(jsonPath).toString();
        json = json.replace(/#\{([\w\[\]]+)\}/g, function(m, w) {
          var _, match;
          if (match = /^\[(\w+)\]$/.exec(w)) {
            _ = match[0], w = match[1];
            return data[w].shift();
          } else {
            return data[w];
          }
        });
        return JSON.parse(json);
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvZml4dHVyZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsV0FBQSxFQUFhLFNBQUE7QUFBYyxVQUFBO01BQWI7YUFBYSxTQUFDLE9BQUQsRUFBVSxJQUFWO0FBQ3pCLFlBQUE7UUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsYUFBYSxXQUFBLEtBQUEsQ0FBQSxRQUFVLENBQUEsT0FBQSxDQUFWLENBQWI7UUFDWCxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsQ0FBeUIsQ0FBQyxRQUExQixDQUFBO1FBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsbUJBQWIsRUFBa0MsU0FBQyxDQUFELEVBQUcsQ0FBSDtBQUN2QyxjQUFBO1VBQUEsSUFBRyxLQUFBLEdBQVEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBbkIsQ0FBWDtZQUNHLFlBQUQsRUFBRzttQkFDSCxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBUixDQUFBLEVBRkY7V0FBQSxNQUFBO21CQUlFLElBQUssQ0FBQSxDQUFBLEVBSlA7O1FBRHVDLENBQWxDO2VBT1AsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO01BVnlCO0lBQWQsQ0FBYjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBqc29uRml4dHVyZTogKHBhdGhzLi4uKSAtPiAoZml4dHVyZSwgZGF0YSkgLT5cbiAgICBqc29uUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRocy4uLiwgZml4dHVyZSlcbiAgICBqc29uID0gZnMucmVhZEZpbGVTeW5jKGpzb25QYXRoKS50b1N0cmluZygpXG4gICAganNvbiA9IGpzb24ucmVwbGFjZSAvI1xceyhbXFx3XFxbXFxdXSspXFx9L2csIChtLHcpIC0+XG4gICAgICBpZiBtYXRjaCA9IC9eXFxbKFxcdyspXFxdJC8uZXhlYyh3KVxuICAgICAgICBbXyx3XSA9IG1hdGNoXG4gICAgICAgIGRhdGFbd10uc2hpZnQoKVxuICAgICAgZWxzZVxuICAgICAgICBkYXRhW3ddXG5cbiAgICBKU09OLnBhcnNlKGpzb24pXG4iXX0=

(function() {
  module.exports = {
    activate: function() {
      var Runner;
      Runner = require('./runner');
      return Runner.run();
    },
    deactivate: function() {
      var Runner;
      Runner = require('./runner');
      return Runner.stop();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9mb250cy9saWIvZm9udHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjthQUNULE1BQU0sQ0FBQyxHQUFQLENBQUE7SUFGUSxDQUFWO0lBSUEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSO2FBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBQTtJQUZVLENBSlo7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIFJ1bm5lciA9IHJlcXVpcmUgJy4vcnVubmVyJ1xuICAgIFJ1bm5lci5ydW4oKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgUnVubmVyID0gcmVxdWlyZSAnLi9ydW5uZXInXG4gICAgUnVubmVyLnN0b3AoKVxuIl19

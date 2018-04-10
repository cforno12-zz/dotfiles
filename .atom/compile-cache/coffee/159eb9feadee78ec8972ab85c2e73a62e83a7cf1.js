(function() {
  var Task;

  Task = null;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      if (Task == null) {
        Task = require('atom').Task;
      }
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGF0aHMtbG9hZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxTQUFBLEVBQVcsU0FBQyxNQUFELEVBQVMsUUFBVDtBQUNULFVBQUE7O1FBQUEsT0FBUSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7O01BRXhCLE9BQUEsR0FBVTtNQUNWLE9BQUEsR0FBVTtNQUNWLFFBQUEsR0FBVyxPQUFPLENBQUMsT0FBUixDQUFnQiw0QkFBaEI7TUFFWCxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FDTCxRQURLLEVBRUwsTUFGSyxFQUdMLFNBQUE7ZUFBRyxRQUFBLENBQVM7VUFBQyxTQUFBLE9BQUQ7VUFBVSxTQUFBLE9BQVY7U0FBVDtNQUFILENBSEs7TUFNUCxJQUFJLENBQUMsRUFBTCxDQUFRLHdCQUFSLEVBQWtDLFNBQUMsS0FBRDtlQUFXLE9BQU8sQ0FBQyxJQUFSLGdCQUFhLEtBQWI7TUFBWCxDQUFsQztNQUNBLElBQUksQ0FBQyxFQUFMLENBQVEsdUJBQVIsRUFBaUMsU0FBQyxLQUFEO2VBQVcsT0FBTyxDQUFDLElBQVIsZ0JBQWEsS0FBYjtNQUFYLENBQWpDO2FBRUE7SUFoQlMsQ0FBWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIlRhc2sgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhcnRUYXNrOiAoY29uZmlnLCBjYWxsYmFjaykgLT5cbiAgICBUYXNrID89IHJlcXVpcmUoJ2F0b20nKS5UYXNrXG5cbiAgICBkaXJ0aWVkID0gW11cbiAgICByZW1vdmVkID0gW11cbiAgICB0YXNrUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnLi90YXNrcy9sb2FkLXBhdGhzLWhhbmRsZXInKVxuXG4gICAgdGFzayA9IFRhc2sub25jZShcbiAgICAgIHRhc2tQYXRoLFxuICAgICAgY29uZmlnLFxuICAgICAgLT4gY2FsbGJhY2soe2RpcnRpZWQsIHJlbW92ZWR9KVxuICAgIClcblxuICAgIHRhc2sub24gJ2xvYWQtcGF0aHM6cGF0aHMtZm91bmQnLCAocGF0aHMpIC0+IGRpcnRpZWQucHVzaChwYXRocy4uLilcbiAgICB0YXNrLm9uICdsb2FkLXBhdGhzOnBhdGhzLWxvc3QnLCAocGF0aHMpIC0+IHJlbW92ZWQucHVzaChwYXRocy4uLilcblxuICAgIHRhc2tcbiJdfQ==

(function() {
  var Task;

  Task = null;

  module.exports = {
    startTask: function(paths, registry, callback) {
      var results, taskPath;
      if (Task == null) {
        Task = require('atom').Task;
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, [paths, registry.serialize()], (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var ref;
      return (ref = this.task) != null ? ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGF0aHMtc2Nhbm5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsUUFBbEI7QUFDVCxVQUFBOztRQUFBLE9BQVEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztNQUV4QixPQUFBLEdBQVU7TUFDVixRQUFBLEdBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCO01BRVgsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUNOLFFBRE0sRUFFTixDQUFDLEtBQUQsRUFBUSxRQUFRLENBQUMsU0FBVCxDQUFBLENBQVIsQ0FGTSxFQUdOLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNFLEtBQUMsQ0FBQSxJQUFELEdBQVE7aUJBQ1IsUUFBQSxDQUFTLE9BQVQ7UUFGRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FITTtNQVFSLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLHlCQUFULEVBQW9DLFNBQUMsTUFBRDtlQUNsQyxPQUFBLEdBQVUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmO01BRHdCLENBQXBDO2FBR0EsSUFBQyxDQUFBO0lBakJRLENBQVg7SUFtQkEsb0JBQUEsRUFBc0IsU0FBQTtBQUNwQixVQUFBOzRDQUFLLENBQUUsU0FBUCxDQUFBO0lBRG9CLENBbkJ0Qjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIlRhc2sgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3RhcnRUYXNrOiAocGF0aHMsIHJlZ2lzdHJ5LCBjYWxsYmFjaykgLT5cbiAgICBUYXNrID89IHJlcXVpcmUoJ2F0b20nKS5UYXNrXG5cbiAgICByZXN1bHRzID0gW11cbiAgICB0YXNrUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnLi90YXNrcy9zY2FuLXBhdGhzLWhhbmRsZXInKVxuXG4gICAgQHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICB0YXNrUGF0aCxcbiAgICAgIFtwYXRocywgcmVnaXN0cnkuc2VyaWFsaXplKCldLFxuICAgICAgPT5cbiAgICAgICAgQHRhc2sgPSBudWxsXG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdHMpXG4gICAgKVxuXG4gICAgQHRhc2sub24gJ3NjYW4tcGF0aHM6cGF0aC1zY2FubmVkJywgKHJlc3VsdCkgLT5cbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChyZXN1bHQpXG5cbiAgICBAdGFza1xuXG4gIHRlcm1pbmF0ZVJ1bm5pbmdUYXNrOiAtPlxuICAgIEB0YXNrPy50ZXJtaW5hdGUoKVxuIl19

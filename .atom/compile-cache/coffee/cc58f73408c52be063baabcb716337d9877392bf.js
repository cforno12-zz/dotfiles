(function() {
  var ExpressionsRegistry, PathScanner, VariableExpression, VariableScanner, async, fs;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  PathScanner = (function() {
    function PathScanner(filePath, scope, registry) {
      this.filePath = filePath;
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
      });
    }

    PathScanner.prototype.load = function(done) {
      var currentChunk, currentLine, currentOffset, lastIndex, line, readStream, results;
      currentChunk = '';
      currentLine = 0;
      currentOffset = 0;
      lastIndex = 0;
      line = 0;
      results = [];
      readStream = fs.createReadStream(this.filePath);
      readStream.on('data', (function(_this) {
        return function(chunk) {
          var i, index, lastLine, len, result, v;
          currentChunk += chunk.toString();
          index = lastIndex;
          while (result = _this.scanner.search(currentChunk, lastIndex)) {
            result.range[0] += index;
            result.range[1] += index;
            for (i = 0, len = result.length; i < len; i++) {
              v = result[i];
              v.path = _this.filePath;
              v.range[0] += index;
              v.range[1] += index;
              v.definitionRange = result.range;
              v.line += line;
              lastLine = v.line;
            }
            results = results.concat(result);
            lastIndex = result.lastIndex;
          }
          if (result != null) {
            currentChunk = currentChunk.slice(lastIndex);
            line = lastLine;
            return lastIndex = 0;
          }
        };
      })(this));
      return readStream.on('end', function() {
        emit('scan-paths:path-scanned', results);
        return done();
      });
    };

    return PathScanner;

  })();

  module.exports = function(arg) {
    var paths, registry;
    paths = arg[0], registry = arg[1];
    registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
    return async.each(paths, function(arg1, next) {
      var p, s;
      p = arg1[0], s = arg1[1];
      return new PathScanner(p, s, registry).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3Mvc2Nhbi1wYXRocy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRWhCO0lBQ1MscUJBQUMsUUFBRCxFQUFZLEtBQVosRUFBbUIsUUFBbkI7TUFBQyxJQUFDLENBQUEsV0FBRDtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxlQUFBLENBQWdCO1FBQUMsVUFBQSxRQUFEO1FBQVcsT0FBQSxLQUFYO09BQWhCO0lBREo7OzBCQUdiLElBQUEsR0FBTSxTQUFDLElBQUQ7QUFDSixVQUFBO01BQUEsWUFBQSxHQUFlO01BQ2YsV0FBQSxHQUFjO01BQ2QsYUFBQSxHQUFnQjtNQUNoQixTQUFBLEdBQVk7TUFDWixJQUFBLEdBQU87TUFDUCxPQUFBLEdBQVU7TUFFVixVQUFBLEdBQWEsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQUMsQ0FBQSxRQUFyQjtNQUViLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtBQUNwQixjQUFBO1VBQUEsWUFBQSxJQUFnQixLQUFLLENBQUMsUUFBTixDQUFBO1VBRWhCLEtBQUEsR0FBUTtBQUVSLGlCQUFNLE1BQUEsR0FBUyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsWUFBaEIsRUFBOEIsU0FBOUIsQ0FBZjtZQUNFLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO1lBQ25CLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO0FBRW5CLGlCQUFBLHdDQUFBOztjQUNFLENBQUMsQ0FBQyxJQUFGLEdBQVMsS0FBQyxDQUFBO2NBQ1YsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYztjQUNkLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWM7Y0FDZCxDQUFDLENBQUMsZUFBRixHQUFvQixNQUFNLENBQUM7Y0FDM0IsQ0FBQyxDQUFDLElBQUYsSUFBVTtjQUNWLFFBQUEsR0FBVyxDQUFDLENBQUM7QUFOZjtZQVFBLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWY7WUFDVCxZQUFhO1VBYmhCO1VBZUEsSUFBRyxjQUFIO1lBQ0UsWUFBQSxHQUFlLFlBQWE7WUFDNUIsSUFBQSxHQUFPO21CQUNQLFNBQUEsR0FBWSxFQUhkOztRQXBCb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO2FBeUJBLFVBQVUsQ0FBQyxFQUFYLENBQWMsS0FBZCxFQUFxQixTQUFBO1FBQ25CLElBQUEsQ0FBSyx5QkFBTCxFQUFnQyxPQUFoQztlQUNBLElBQUEsQ0FBQTtNQUZtQixDQUFyQjtJQW5DSTs7Ozs7O0VBdUNSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsR0FBRDtBQUNmLFFBQUE7SUFEaUIsZ0JBQU87SUFDeEIsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGtCQUExQztXQUNYLEtBQUssQ0FBQyxJQUFOLENBQ0UsS0FERixFQUVFLFNBQUMsSUFBRCxFQUFTLElBQVQ7QUFDRSxVQUFBO01BREEsYUFBRzthQUNDLElBQUEsV0FBQSxDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLFFBQWxCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsSUFBakM7SUFETixDQUZGLEVBSUUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUpGO0VBRmU7QUFqRGpCIiwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgPSByZXF1aXJlICdhc3luYydcbmZzID0gcmVxdWlyZSAnZnMnXG5WYXJpYWJsZVNjYW5uZXIgPSByZXF1aXJlICcuLi92YXJpYWJsZS1zY2FubmVyJ1xuVmFyaWFibGVFeHByZXNzaW9uID0gcmVxdWlyZSAnLi4vdmFyaWFibGUtZXhwcmVzc2lvbidcbkV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuLi9leHByZXNzaW9ucy1yZWdpc3RyeSdcblxuY2xhc3MgUGF0aFNjYW5uZXJcbiAgY29uc3RydWN0b3I6IChAZmlsZVBhdGgsIHNjb3BlLCByZWdpc3RyeSkgLT5cbiAgICBAc2Nhbm5lciA9IG5ldyBWYXJpYWJsZVNjYW5uZXIoe3JlZ2lzdHJ5LCBzY29wZX0pXG5cbiAgbG9hZDogKGRvbmUpIC0+XG4gICAgY3VycmVudENodW5rID0gJydcbiAgICBjdXJyZW50TGluZSA9IDBcbiAgICBjdXJyZW50T2Zmc2V0ID0gMFxuICAgIGxhc3RJbmRleCA9IDBcbiAgICBsaW5lID0gMFxuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgcmVhZFN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oQGZpbGVQYXRoKVxuXG4gICAgcmVhZFN0cmVhbS5vbiAnZGF0YScsIChjaHVuaykgPT5cbiAgICAgIGN1cnJlbnRDaHVuayArPSBjaHVuay50b1N0cmluZygpXG5cbiAgICAgIGluZGV4ID0gbGFzdEluZGV4XG5cbiAgICAgIHdoaWxlIHJlc3VsdCA9IEBzY2FubmVyLnNlYXJjaChjdXJyZW50Q2h1bmssIGxhc3RJbmRleClcbiAgICAgICAgcmVzdWx0LnJhbmdlWzBdICs9IGluZGV4XG4gICAgICAgIHJlc3VsdC5yYW5nZVsxXSArPSBpbmRleFxuXG4gICAgICAgIGZvciB2IGluIHJlc3VsdFxuICAgICAgICAgIHYucGF0aCA9IEBmaWxlUGF0aFxuICAgICAgICAgIHYucmFuZ2VbMF0gKz0gaW5kZXhcbiAgICAgICAgICB2LnJhbmdlWzFdICs9IGluZGV4XG4gICAgICAgICAgdi5kZWZpbml0aW9uUmFuZ2UgPSByZXN1bHQucmFuZ2VcbiAgICAgICAgICB2LmxpbmUgKz0gbGluZVxuICAgICAgICAgIGxhc3RMaW5lID0gdi5saW5lXG5cbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KHJlc3VsdClcbiAgICAgICAge2xhc3RJbmRleH0gPSByZXN1bHRcblxuICAgICAgaWYgcmVzdWx0P1xuICAgICAgICBjdXJyZW50Q2h1bmsgPSBjdXJyZW50Q2h1bmtbbGFzdEluZGV4Li4tMV1cbiAgICAgICAgbGluZSA9IGxhc3RMaW5lXG4gICAgICAgIGxhc3RJbmRleCA9IDBcblxuICAgIHJlYWRTdHJlYW0ub24gJ2VuZCcsIC0+XG4gICAgICBlbWl0KCdzY2FuLXBhdGhzOnBhdGgtc2Nhbm5lZCcsIHJlc3VsdHMpXG4gICAgICBkb25lKClcblxubW9kdWxlLmV4cG9ydHMgPSAoW3BhdGhzLCByZWdpc3RyeV0pIC0+XG4gIHJlZ2lzdHJ5ID0gRXhwcmVzc2lvbnNSZWdpc3RyeS5kZXNlcmlhbGl6ZShyZWdpc3RyeSwgVmFyaWFibGVFeHByZXNzaW9uKVxuICBhc3luYy5lYWNoKFxuICAgIHBhdGhzLFxuICAgIChbcCwgc10sIG5leHQpIC0+XG4gICAgICBuZXcgUGF0aFNjYW5uZXIocCwgcywgcmVnaXN0cnkpLmxvYWQobmV4dClcbiAgICBAYXN5bmMoKVxuICApXG4iXX0=

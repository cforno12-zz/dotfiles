(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry, scope;
      this.buffer = config.buffer, registry = config.registry, scope = config.scope;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
      });
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3Mvc2Nhbi1idWZmZXItdmFyaWFibGVzLWhhbmRsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFDZixrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVI7O0VBQ3JCLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUjs7RUFFdEIsa0JBQUEsR0FBcUI7O0VBRWY7SUFDUyxnQ0FBQyxNQUFEO0FBQ1gsVUFBQTtNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsMEJBQVYsRUFBb0I7TUFDcEIsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGtCQUExQztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxlQUFBLENBQWdCO1FBQUMsVUFBQSxRQUFEO1FBQVcsT0FBQSxLQUFYO09BQWhCO01BQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUpBOztxQ0FNYixJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxTQUFBLEdBQVk7QUFDWixhQUFNLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLFNBQXpCLENBQWhCO1FBQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsT0FBaEI7UUFFWCxJQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsSUFBbUIsa0JBQXhDO1VBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQUFBOztRQUNDLFlBQWE7TUFKaEI7YUFNQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBUkk7O3FDQVVOLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQUEsQ0FBSyw2QkFBTCxFQUFvQyxJQUFDLENBQUEsT0FBckM7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRkc7Ozs7OztFQUlsQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQ7V0FDWCxJQUFBLHNCQUFBLENBQXVCLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBQTtFQURXO0FBNUJqQiIsInNvdXJjZXNDb250ZW50IjpbIlZhcmlhYmxlU2Nhbm5lciA9IHJlcXVpcmUgJy4uL3ZhcmlhYmxlLXNjYW5uZXInXG5Db2xvckNvbnRleHQgPSByZXF1aXJlICcuLi9jb2xvci1jb250ZXh0J1xuVmFyaWFibGVFeHByZXNzaW9uID0gcmVxdWlyZSAnLi4vdmFyaWFibGUtZXhwcmVzc2lvbidcbkV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuLi9leHByZXNzaW9ucy1yZWdpc3RyeSdcblxuVmFyaWFibGVzQ2h1bmtTaXplID0gMTAwXG5cbmNsYXNzIEJ1ZmZlclZhcmlhYmxlc1NjYW5uZXJcbiAgY29uc3RydWN0b3I6IChjb25maWcpIC0+XG4gICAge0BidWZmZXIsIHJlZ2lzdHJ5LCBzY29wZX0gPSBjb25maWdcbiAgICByZWdpc3RyeSA9IEV4cHJlc3Npb25zUmVnaXN0cnkuZGVzZXJpYWxpemUocmVnaXN0cnksIFZhcmlhYmxlRXhwcmVzc2lvbilcbiAgICBAc2Nhbm5lciA9IG5ldyBWYXJpYWJsZVNjYW5uZXIoe3JlZ2lzdHJ5LCBzY29wZX0pXG4gICAgQHJlc3VsdHMgPSBbXVxuXG4gIHNjYW46IC0+XG4gICAgbGFzdEluZGV4ID0gMFxuICAgIHdoaWxlIHJlc3VsdHMgPSBAc2Nhbm5lci5zZWFyY2goQGJ1ZmZlciwgbGFzdEluZGV4KVxuICAgICAgQHJlc3VsdHMgPSBAcmVzdWx0cy5jb25jYXQocmVzdWx0cylcblxuICAgICAgQGZsdXNoVmFyaWFibGVzKCkgaWYgQHJlc3VsdHMubGVuZ3RoID49IFZhcmlhYmxlc0NodW5rU2l6ZVxuICAgICAge2xhc3RJbmRleH0gPSByZXN1bHRzXG5cbiAgICBAZmx1c2hWYXJpYWJsZXMoKVxuXG4gIGZsdXNoVmFyaWFibGVzOiAtPlxuICAgIGVtaXQoJ3NjYW4tYnVmZmVyOnZhcmlhYmxlcy1mb3VuZCcsIEByZXN1bHRzKVxuICAgIEByZXN1bHRzID0gW11cblxubW9kdWxlLmV4cG9ydHMgPSAoY29uZmlnKSAtPlxuICBuZXcgQnVmZmVyVmFyaWFibGVzU2Nhbm5lcihjb25maWcpLnNjYW4oKVxuIl19

(function() {
  var ColorParser;

  module.exports = ColorParser = (function() {
    function ColorParser(registry, context) {
      this.registry = registry;
      this.context = context;
    }

    ColorParser.prototype.parse = function(expression, scope, collectVariables) {
      var e, i, len, ref, res;
      if (scope == null) {
        scope = '*';
      }
      if (collectVariables == null) {
        collectVariables = true;
      }
      if ((expression == null) || expression === '') {
        return void 0;
      }
      ref = this.registry.getExpressionsForScope(scope);
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        if (e.match(expression)) {
          res = e.parse(expression, this.context);
          if (collectVariables) {
            res.variables = this.context.readUsedVariables();
          }
          return res;
        }
      }
      return void 0;
    };

    return ColorParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHFCQUFDLFFBQUQsRUFBWSxPQUFaO01BQUMsSUFBQyxDQUFBLFdBQUQ7TUFBVyxJQUFDLENBQUEsVUFBRDtJQUFaOzswQkFFYixLQUFBLEdBQU8sU0FBQyxVQUFELEVBQWEsS0FBYixFQUF3QixnQkFBeEI7QUFDTCxVQUFBOztRQURrQixRQUFNOzs7UUFBSyxtQkFBaUI7O01BQzlDLElBQXdCLG9CQUFKLElBQW1CLFVBQUEsS0FBYyxFQUFyRDtBQUFBLGVBQU8sT0FBUDs7QUFFQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBSDtVQUNFLEdBQUEsR0FBTSxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsRUFBb0IsSUFBQyxDQUFBLE9BQXJCO1VBQ04sSUFBZ0QsZ0JBQWhEO1lBQUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxpQkFBVCxDQUFBLEVBQWhCOztBQUNBLGlCQUFPLElBSFQ7O0FBREY7QUFNQSxhQUFPO0lBVEY7Ozs7O0FBSlQiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbG9yUGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHJlZ2lzdHJ5LCBAY29udGV4dCkgLT5cblxuICBwYXJzZTogKGV4cHJlc3Npb24sIHNjb3BlPScqJywgY29sbGVjdFZhcmlhYmxlcz10cnVlKSAtPlxuICAgIHJldHVybiB1bmRlZmluZWQgaWYgbm90IGV4cHJlc3Npb24/IG9yIGV4cHJlc3Npb24gaXMgJydcblxuICAgIGZvciBlIGluIEByZWdpc3RyeS5nZXRFeHByZXNzaW9uc0ZvclNjb3BlKHNjb3BlKVxuICAgICAgaWYgZS5tYXRjaChleHByZXNzaW9uKVxuICAgICAgICByZXMgPSBlLnBhcnNlKGV4cHJlc3Npb24sIEBjb250ZXh0KVxuICAgICAgICByZXMudmFyaWFibGVzID0gQGNvbnRleHQucmVhZFVzZWRWYXJpYWJsZXMoKSBpZiBjb2xsZWN0VmFyaWFibGVzXG4gICAgICAgIHJldHVybiByZXNcblxuICAgIHJldHVybiB1bmRlZmluZWRcbiJdfQ==

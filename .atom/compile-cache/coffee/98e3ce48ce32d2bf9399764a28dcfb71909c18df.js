(function() {
  var VariableParser;

  module.exports = VariableParser = (function() {
    function VariableParser(registry) {
      this.registry = registry;
    }

    VariableParser.prototype.parse = function(expression) {
      var e, i, len, ref;
      ref = this.registry.getExpressions();
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        if (e.match(expression)) {
          return e.parse(expression);
        }
      }
    };

    return VariableParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHdCQUFDLFFBQUQ7TUFBQyxJQUFDLENBQUEsV0FBRDtJQUFEOzs2QkFDYixLQUFBLEdBQU8sU0FBQyxVQUFEO0FBQ0wsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxJQUE4QixDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBOUI7QUFBQSxpQkFBTyxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsRUFBUDs7QUFERjtJQURLOzs7OztBQUhUIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWYXJpYWJsZVBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEByZWdpc3RyeSkgLT5cbiAgcGFyc2U6IChleHByZXNzaW9uKSAtPlxuICAgIGZvciBlIGluIEByZWdpc3RyeS5nZXRFeHByZXNzaW9ucygpXG4gICAgICByZXR1cm4gZS5wYXJzZShleHByZXNzaW9uKSBpZiBlLm1hdGNoKGV4cHJlc3Npb24pXG5cbiAgICByZXR1cm5cbiJdfQ==

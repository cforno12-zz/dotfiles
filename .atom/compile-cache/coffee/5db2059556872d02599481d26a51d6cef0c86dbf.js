(function() {
  var Color, ColorExpression, createVariableRegExpString, ref;

  ref = [], createVariableRegExpString = ref[0], Color = ref[1];

  module.exports = ColorExpression = (function() {
    ColorExpression.colorExpressionForContext = function(context) {
      return this.colorExpressionForColorVariables(context.getColorVariables());
    };

    ColorExpression.colorExpressionRegexpForColorVariables = function(colorVariables) {
      if (createVariableRegExpString == null) {
        createVariableRegExpString = require('./regexes').createVariableRegExpString;
      }
      return createVariableRegExpString(colorVariables);
    };

    ColorExpression.colorExpressionForColorVariables = function(colorVariables) {
      var paletteRegexpString;
      paletteRegexpString = this.colorExpressionRegexpForColorVariables(colorVariables);
      return new ColorExpression({
        name: 'pigments:variables',
        regexpString: paletteRegexpString,
        scopes: ['*'],
        priority: 1,
        handle: function(match, expression, context) {
          var _, baseColor, evaluated, name;
          _ = match[0], _ = match[1], name = match[2];
          if (name == null) {
            name = match[0];
          }
          evaluated = context.readColorExpression(name);
          if (evaluated === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(evaluated);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (context.isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        }
      });
    };

    function ColorExpression(arg) {
      this.name = arg.name, this.regexpString = arg.regexpString, this.scopes = arg.scopes, this.priority = arg.priority, this.handle = arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      if (Color == null) {
        Color = require('./color');
      }
      color = new Color();
      color.colorExpression = expression;
      color.expressionHandler = this.name;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, ref1, results;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (ref1 = re.exec(text), match = ref1[0], ref1) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItZXhwcmVzc2lvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQXNDLEVBQXRDLEVBQUMsbUNBQUQsRUFBNkI7O0VBRTdCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixlQUFDLENBQUEseUJBQUQsR0FBNEIsU0FBQyxPQUFEO2FBQzFCLElBQUMsQ0FBQSxnQ0FBRCxDQUFrQyxPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQUFsQztJQUQwQjs7SUFHNUIsZUFBQyxDQUFBLHNDQUFELEdBQXlDLFNBQUMsY0FBRDtNQUN2QyxJQUFPLGtDQUFQO1FBQ0csNkJBQThCLE9BQUEsQ0FBUSxXQUFSLDZCQURqQzs7YUFHQSwwQkFBQSxDQUEyQixjQUEzQjtJQUp1Qzs7SUFNekMsZUFBQyxDQUFBLGdDQUFELEdBQW1DLFNBQUMsY0FBRDtBQUNqQyxVQUFBO01BQUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHNDQUFELENBQXdDLGNBQXhDO2FBRWxCLElBQUEsZUFBQSxDQUNGO1FBQUEsSUFBQSxFQUFNLG9CQUFOO1FBQ0EsWUFBQSxFQUFjLG1CQURkO1FBRUEsTUFBQSxFQUFRLENBQUMsR0FBRCxDQUZSO1FBR0EsUUFBQSxFQUFVLENBSFY7UUFJQSxNQUFBLEVBQVEsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixPQUFwQjtBQUNOLGNBQUE7VUFBQyxZQUFELEVBQUksWUFBSixFQUFNO1VBRU4sSUFBdUIsWUFBdkI7WUFBQSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsRUFBYjs7VUFFQSxTQUFBLEdBQVksT0FBTyxDQUFDLG1CQUFSLENBQTRCLElBQTVCO1VBQ1osSUFBMEIsU0FBQSxLQUFhLElBQXZDO0FBQUEsbUJBQU8sSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFsQjs7VUFFQSxTQUFBLEdBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsU0FBbEI7VUFDWixJQUFDLENBQUEsZUFBRCxHQUFtQjtVQUNuQixJQUFDLENBQUEsU0FBRCx1QkFBYSxTQUFTLENBQUU7VUFFeEIsSUFBMEIsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsU0FBbEIsQ0FBMUI7QUFBQSxtQkFBTyxJQUFDLENBQUEsT0FBRCxHQUFXLEtBQWxCOztpQkFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLFNBQVMsQ0FBQztRQWRaLENBSlI7T0FERTtJQUg2Qjs7SUF3QnRCLHlCQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEsV0FBQSxNQUFNLElBQUMsQ0FBQSxtQkFBQSxjQUFjLElBQUMsQ0FBQSxhQUFBLFFBQVEsSUFBQyxDQUFBLGVBQUEsVUFBVSxJQUFDLENBQUEsYUFBQTtNQUN4RCxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLEdBQUEsR0FBSSxJQUFDLENBQUEsWUFBTCxHQUFrQixHQUF6QjtJQURIOzs4QkFHYixLQUFBLEdBQU8sU0FBQyxVQUFEO2FBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLFVBQWI7SUFBaEI7OzhCQUVQLEtBQUEsR0FBTyxTQUFDLFVBQUQsRUFBYSxPQUFiO0FBQ0wsVUFBQTtNQUFBLElBQUEsQ0FBbUIsSUFBQyxDQUFBLEtBQUQsQ0FBTyxVQUFQLENBQW5CO0FBQUEsZUFBTyxLQUFQOzs7UUFFQSxRQUFTLE9BQUEsQ0FBUSxTQUFSOztNQUVULEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQTtNQUNaLEtBQUssQ0FBQyxlQUFOLEdBQXdCO01BQ3hCLEtBQUssQ0FBQyxpQkFBTixHQUEwQixJQUFDLENBQUE7TUFDM0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsS0FBYixFQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxVQUFiLENBQXBCLEVBQThDLFVBQTlDLEVBQTBELE9BQTFEO2FBQ0E7SUFUSzs7OEJBV1AsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDTixVQUFBOztRQURhLFFBQU07O01BQ25CLE9BQUEsR0FBVTtNQUNWLEVBQUEsR0FBUyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsWUFBUixFQUFzQixHQUF0QjtNQUNULEVBQUUsQ0FBQyxTQUFILEdBQWU7TUFDZixJQUFHLE9BQVUsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLENBQVYsRUFBQyxlQUFELEVBQUEsSUFBSDtRQUNHLFlBQWE7UUFDZCxLQUFBLEdBQVEsQ0FBQyxTQUFBLEdBQVksS0FBSyxDQUFDLE1BQW5CLEVBQTJCLFNBQTNCO1FBQ1IsT0FBQSxHQUNFO1VBQUEsS0FBQSxFQUFPLEtBQVA7VUFDQSxLQUFBLEVBQU8sSUFBSywwQkFEWjtVQUpKOzthQU9BO0lBWE07Ozs7O0FBckRWIiwic291cmNlc0NvbnRlbnQiOlsiW2NyZWF0ZVZhcmlhYmxlUmVnRXhwU3RyaW5nLCBDb2xvcl0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvckV4cHJlc3Npb25cbiAgQGNvbG9yRXhwcmVzc2lvbkZvckNvbnRleHQ6IChjb250ZXh0KSAtPlxuICAgIEBjb2xvckV4cHJlc3Npb25Gb3JDb2xvclZhcmlhYmxlcyhjb250ZXh0LmdldENvbG9yVmFyaWFibGVzKCkpXG5cbiAgQGNvbG9yRXhwcmVzc2lvblJlZ2V4cEZvckNvbG9yVmFyaWFibGVzOiAoY29sb3JWYXJpYWJsZXMpIC0+XG4gICAgdW5sZXNzIGNyZWF0ZVZhcmlhYmxlUmVnRXhwU3RyaW5nP1xuICAgICAge2NyZWF0ZVZhcmlhYmxlUmVnRXhwU3RyaW5nfSA9IHJlcXVpcmUgJy4vcmVnZXhlcydcblxuICAgIGNyZWF0ZVZhcmlhYmxlUmVnRXhwU3RyaW5nKGNvbG9yVmFyaWFibGVzKVxuXG4gIEBjb2xvckV4cHJlc3Npb25Gb3JDb2xvclZhcmlhYmxlczogKGNvbG9yVmFyaWFibGVzKSAtPlxuICAgIHBhbGV0dGVSZWdleHBTdHJpbmcgPSBAY29sb3JFeHByZXNzaW9uUmVnZXhwRm9yQ29sb3JWYXJpYWJsZXMoY29sb3JWYXJpYWJsZXMpXG5cbiAgICBuZXcgQ29sb3JFeHByZXNzaW9uXG4gICAgICBuYW1lOiAncGlnbWVudHM6dmFyaWFibGVzJ1xuICAgICAgcmVnZXhwU3RyaW5nOiBwYWxldHRlUmVnZXhwU3RyaW5nXG4gICAgICBzY29wZXM6IFsnKiddXG4gICAgICBwcmlvcml0eTogMVxuICAgICAgaGFuZGxlOiAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gICAgICAgIFtfLCBfLG5hbWVdID0gbWF0Y2hcblxuICAgICAgICBuYW1lID0gbWF0Y2hbMF0gdW5sZXNzIG5hbWU/XG5cbiAgICAgICAgZXZhbHVhdGVkID0gY29udGV4dC5yZWFkQ29sb3JFeHByZXNzaW9uKG5hbWUpXG4gICAgICAgIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgZXZhbHVhdGVkIGlzIG5hbWVcblxuICAgICAgICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihldmFsdWF0ZWQpXG4gICAgICAgIEBjb2xvckV4cHJlc3Npb24gPSBuYW1lXG4gICAgICAgIEB2YXJpYWJsZXMgPSBiYXNlQ29sb3I/LnZhcmlhYmxlc1xuXG4gICAgICAgIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gICAgICAgIEByZ2JhID0gYmFzZUNvbG9yLnJnYmFcblxuICBjb25zdHJ1Y3RvcjogKHtAbmFtZSwgQHJlZ2V4cFN0cmluZywgQHNjb3BlcywgQHByaW9yaXR5LCBAaGFuZGxlfSkgLT5cbiAgICBAcmVnZXhwID0gbmV3IFJlZ0V4cChcIl4je0ByZWdleHBTdHJpbmd9JFwiKVxuXG4gIG1hdGNoOiAoZXhwcmVzc2lvbikgLT4gQHJlZ2V4cC50ZXN0IGV4cHJlc3Npb25cblxuICBwYXJzZTogKGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIEBtYXRjaChleHByZXNzaW9uKVxuXG4gICAgQ29sb3IgPz0gcmVxdWlyZSAnLi9jb2xvcidcblxuICAgIGNvbG9yID0gbmV3IENvbG9yKClcbiAgICBjb2xvci5jb2xvckV4cHJlc3Npb24gPSBleHByZXNzaW9uXG4gICAgY29sb3IuZXhwcmVzc2lvbkhhbmRsZXIgPSBAbmFtZVxuICAgIEBoYW5kbGUuY2FsbChjb2xvciwgQHJlZ2V4cC5leGVjKGV4cHJlc3Npb24pLCBleHByZXNzaW9uLCBjb250ZXh0KVxuICAgIGNvbG9yXG5cbiAgc2VhcmNoOiAodGV4dCwgc3RhcnQ9MCkgLT5cbiAgICByZXN1bHRzID0gdW5kZWZpbmVkXG4gICAgcmUgPSBuZXcgUmVnRXhwKEByZWdleHBTdHJpbmcsICdnJylcbiAgICByZS5sYXN0SW5kZXggPSBzdGFydFxuICAgIGlmIFttYXRjaF0gPSByZS5leGVjKHRleHQpXG4gICAgICB7bGFzdEluZGV4fSA9IHJlXG4gICAgICByYW5nZSA9IFtsYXN0SW5kZXggLSBtYXRjaC5sZW5ndGgsIGxhc3RJbmRleF1cbiAgICAgIHJlc3VsdHMgPVxuICAgICAgICByYW5nZTogcmFuZ2VcbiAgICAgICAgbWF0Y2g6IHRleHRbcmFuZ2VbMF0uLi5yYW5nZVsxXV1cblxuICAgIHJlc3VsdHNcbiJdfQ==

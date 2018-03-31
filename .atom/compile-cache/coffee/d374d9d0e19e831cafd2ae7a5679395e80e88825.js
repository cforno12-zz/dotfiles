(function() {
  var VariableExpression;

  module.exports = VariableExpression = (function() {
    VariableExpression.DEFAULT_HANDLE = function(match, solver) {
      var _, end, name, start, value;
      _ = match[0], name = match[1], value = match[2];
      start = _.indexOf(name);
      end = _.indexOf(value) + value.length;
      solver.appendResult(name, value, start, end);
      return solver.endParsing(end);
    };

    function VariableExpression(arg) {
      this.name = arg.name, this.regexpString = arg.regexpString, this.scopes = arg.scopes, this.priority = arg.priority, this.handle = arg.handle;
      this.regexp = new RegExp("" + this.regexpString, 'm');
      if (this.handle == null) {
        this.handle = this.constructor.DEFAULT_HANDLE;
      }
    }

    VariableExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    VariableExpression.prototype.parse = function(expression) {
      var lastIndex, match, matchText, parsingAborted, results, solver, startIndex;
      parsingAborted = false;
      results = [];
      match = this.regexp.exec(expression);
      if (match != null) {
        matchText = match[0];
        lastIndex = this.regexp.lastIndex;
        startIndex = lastIndex - matchText.length;
        solver = {
          endParsing: function(end) {
            var start;
            start = expression.indexOf(matchText);
            results.lastIndex = end;
            results.range = [start, end];
            return results.match = matchText.slice(start, end);
          },
          abortParsing: function() {
            return parsingAborted = true;
          },
          appendResult: function(name, value, start, end, arg) {
            var isAlternate, isDefault, noNamePrefix, range, reName, ref;
            ref = arg != null ? arg : {}, isAlternate = ref.isAlternate, noNamePrefix = ref.noNamePrefix, isDefault = ref.isDefault;
            range = [start, end];
            reName = name.replace(/([()$])/g, '\\$1');
            if (!RegExp(reName + "(?![-_])").test(value)) {
              return results.push({
                name: name,
                value: value,
                range: range,
                isAlternate: isAlternate,
                noNamePrefix: noNamePrefix,
                "default": isDefault
              });
            }
          }
        };
        this.handle(match, solver);
      }
      if (parsingAborted) {
        return void 0;
      } else {
        return results;
      }
    };

    return VariableExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtZXhwcmVzc2lvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixrQkFBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxLQUFELEVBQVEsTUFBUjtBQUNmLFVBQUE7TUFBQyxZQUFELEVBQUksZUFBSixFQUFVO01BQ1YsS0FBQSxHQUFRLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVjtNQUNSLEdBQUEsR0FBTSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBQSxHQUFtQixLQUFLLENBQUM7TUFDL0IsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsS0FBakMsRUFBd0MsR0FBeEM7YUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtJQUxlOztJQU9KLDRCQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEsV0FBQSxNQUFNLElBQUMsQ0FBQSxtQkFBQSxjQUFjLElBQUMsQ0FBQSxhQUFBLFFBQVEsSUFBQyxDQUFBLGVBQUEsVUFBVSxJQUFDLENBQUEsYUFBQTtNQUN4RCxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLEVBQUEsR0FBRyxJQUFDLENBQUEsWUFBWCxFQUEyQixHQUEzQjs7UUFDZCxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsV0FBVyxDQUFDOztJQUZiOztpQ0FJYixLQUFBLEdBQU8sU0FBQyxVQUFEO2FBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLFVBQWI7SUFBaEI7O2lDQUVQLEtBQUEsR0FBTyxTQUFDLFVBQUQ7QUFDTCxVQUFBO01BQUEsY0FBQSxHQUFpQjtNQUNqQixPQUFBLEdBQVU7TUFFVixLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsVUFBYjtNQUNSLElBQUcsYUFBSDtRQUVHLFlBQWE7UUFDYixZQUFhLElBQUMsQ0FBQTtRQUNmLFVBQUEsR0FBYSxTQUFBLEdBQVksU0FBUyxDQUFDO1FBRW5DLE1BQUEsR0FDRTtVQUFBLFVBQUEsRUFBWSxTQUFDLEdBQUQ7QUFDVixnQkFBQTtZQUFBLEtBQUEsR0FBUSxVQUFVLENBQUMsT0FBWCxDQUFtQixTQUFuQjtZQUNSLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO1lBQ3BCLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLENBQUMsS0FBRCxFQUFPLEdBQVA7bUJBQ2hCLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLFNBQVU7VUFKaEIsQ0FBWjtVQUtBLFlBQUEsRUFBYyxTQUFBO21CQUNaLGNBQUEsR0FBaUI7VUFETCxDQUxkO1VBT0EsWUFBQSxFQUFjLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXFCLEdBQXJCLEVBQTBCLEdBQTFCO0FBQ1osZ0JBQUE7Z0NBRHNDLE1BQXVDLElBQXRDLCtCQUFhLGlDQUFjO1lBQ2xFLEtBQUEsR0FBUSxDQUFDLEtBQUQsRUFBUSxHQUFSO1lBQ1IsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUF5QixNQUF6QjtZQUNULElBQUEsQ0FBTyxNQUFBLENBQUssTUFBRCxHQUFRLFVBQVosQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixLQUE3QixDQUFQO3FCQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWE7Z0JBQ1gsTUFBQSxJQURXO2dCQUNMLE9BQUEsS0FESztnQkFDRSxPQUFBLEtBREY7Z0JBQ1MsYUFBQSxXQURUO2dCQUNzQixjQUFBLFlBRHRCO2dCQUVYLENBQUEsT0FBQSxDQUFBLEVBQVMsU0FGRTtlQUFiLEVBREY7O1VBSFksQ0FQZDs7UUFnQkYsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBQWUsTUFBZixFQXZCRjs7TUF5QkEsSUFBRyxjQUFIO2VBQXVCLE9BQXZCO09BQUEsTUFBQTtlQUFzQyxRQUF0Qzs7SUE5Qks7Ozs7O0FBZlQiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWYXJpYWJsZUV4cHJlc3Npb25cbiAgQERFRkFVTFRfSEFORExFOiAobWF0Y2gsIHNvbHZlcikgLT5cbiAgICBbXywgbmFtZSwgdmFsdWVdID0gbWF0Y2hcbiAgICBzdGFydCA9IF8uaW5kZXhPZihuYW1lKVxuICAgIGVuZCA9IF8uaW5kZXhPZih2YWx1ZSkgKyB2YWx1ZS5sZW5ndGhcbiAgICBzb2x2ZXIuYXBwZW5kUmVzdWx0KG5hbWUsIHZhbHVlLCBzdGFydCwgZW5kKVxuICAgIHNvbHZlci5lbmRQYXJzaW5nKGVuZClcblxuICBjb25zdHJ1Y3RvcjogKHtAbmFtZSwgQHJlZ2V4cFN0cmluZywgQHNjb3BlcywgQHByaW9yaXR5LCBAaGFuZGxlfSkgLT5cbiAgICBAcmVnZXhwID0gbmV3IFJlZ0V4cChcIiN7QHJlZ2V4cFN0cmluZ31cIiwgJ20nKVxuICAgIEBoYW5kbGUgPz0gQGNvbnN0cnVjdG9yLkRFRkFVTFRfSEFORExFXG5cbiAgbWF0Y2g6IChleHByZXNzaW9uKSAtPiBAcmVnZXhwLnRlc3QgZXhwcmVzc2lvblxuXG4gIHBhcnNlOiAoZXhwcmVzc2lvbikgLT5cbiAgICBwYXJzaW5nQWJvcnRlZCA9IGZhbHNlXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBtYXRjaCA9IEByZWdleHAuZXhlYyhleHByZXNzaW9uKVxuICAgIGlmIG1hdGNoP1xuXG4gICAgICBbbWF0Y2hUZXh0XSA9IG1hdGNoXG4gICAgICB7bGFzdEluZGV4fSA9IEByZWdleHBcbiAgICAgIHN0YXJ0SW5kZXggPSBsYXN0SW5kZXggLSBtYXRjaFRleHQubGVuZ3RoXG5cbiAgICAgIHNvbHZlciA9XG4gICAgICAgIGVuZFBhcnNpbmc6IChlbmQpIC0+XG4gICAgICAgICAgc3RhcnQgPSBleHByZXNzaW9uLmluZGV4T2YobWF0Y2hUZXh0KVxuICAgICAgICAgIHJlc3VsdHMubGFzdEluZGV4ID0gZW5kXG4gICAgICAgICAgcmVzdWx0cy5yYW5nZSA9IFtzdGFydCxlbmRdXG4gICAgICAgICAgcmVzdWx0cy5tYXRjaCA9IG1hdGNoVGV4dFtzdGFydC4uLmVuZF1cbiAgICAgICAgYWJvcnRQYXJzaW5nOiAtPlxuICAgICAgICAgIHBhcnNpbmdBYm9ydGVkID0gdHJ1ZVxuICAgICAgICBhcHBlbmRSZXN1bHQ6IChuYW1lLCB2YWx1ZSwgc3RhcnQsIGVuZCwge2lzQWx0ZXJuYXRlLCBub05hbWVQcmVmaXgsIGlzRGVmYXVsdH09e30pIC0+XG4gICAgICAgICAgcmFuZ2UgPSBbc3RhcnQsIGVuZF1cbiAgICAgICAgICByZU5hbWUgPSBuYW1lLnJlcGxhY2UoLyhbKCkkXSkvZywgJ1xcXFwkMScpXG4gICAgICAgICAgdW5sZXNzIC8vLyN7cmVOYW1lfSg/IVstX10pLy8vLnRlc3QodmFsdWUpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gge1xuICAgICAgICAgICAgICBuYW1lLCB2YWx1ZSwgcmFuZ2UsIGlzQWx0ZXJuYXRlLCBub05hbWVQcmVmaXhcbiAgICAgICAgICAgICAgZGVmYXVsdDogaXNEZWZhdWx0XG4gICAgICAgICAgICB9XG5cbiAgICAgIEBoYW5kbGUobWF0Y2gsIHNvbHZlcilcblxuICAgIGlmIHBhcnNpbmdBYm9ydGVkIHRoZW4gdW5kZWZpbmVkIGVsc2UgcmVzdWx0c1xuIl19

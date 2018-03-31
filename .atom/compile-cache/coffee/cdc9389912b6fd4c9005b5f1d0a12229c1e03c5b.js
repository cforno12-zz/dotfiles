(function() {
  var VariableParser, VariableScanner, countLines, ref;

  ref = [], VariableParser = ref[0], countLines = ref[1];

  module.exports = VariableScanner = (function() {
    function VariableScanner(params) {
      if (params == null) {
        params = {};
      }
      if (VariableParser == null) {
        VariableParser = require('./variable-parser');
      }
      this.parser = params.parser, this.registry = params.registry, this.scope = params.scope;
      if (this.parser == null) {
        this.parser = new VariableParser(this.registry);
      }
    }

    VariableScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExpForScope(this.scope), 'gm');
    };

    VariableScanner.prototype.search = function(text, start) {
      var i, index, lastIndex, len, line, lineCountIndex, match, matchText, regexp, result, v;
      if (start == null) {
        start = 0;
      }
      if (this.registry.getExpressionsForScope(this.scope).length === 0) {
        return;
      }
      if (countLines == null) {
        countLines = require('./utils').countLines;
      }
      regexp = this.getRegExp();
      regexp.lastIndex = start;
      while (match = regexp.exec(text)) {
        matchText = match[0];
        index = match.index;
        lastIndex = regexp.lastIndex;
        result = this.parser.parse(matchText);
        if (result != null) {
          result.lastIndex += index;
          if (result.length > 0) {
            result.range[0] += index;
            result.range[1] += index;
            line = -1;
            lineCountIndex = 0;
            for (i = 0, len = result.length; i < len; i++) {
              v = result[i];
              v.range[0] += index;
              v.range[1] += index;
              line = v.line = line + countLines(text.slice(lineCountIndex, +v.range[0] + 1 || 9e9));
              lineCountIndex = v.range[0];
            }
            return result;
          } else {
            regexp.lastIndex = result.lastIndex;
          }
        }
      }
      return void 0;
    };

    return VariableScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtc2Nhbm5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQStCLEVBQS9CLEVBQUMsdUJBQUQsRUFBaUI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyx5QkFBQyxNQUFEOztRQUFDLFNBQU87OztRQUNuQixpQkFBa0IsT0FBQSxDQUFRLG1CQUFSOztNQUVqQixJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxrQkFBQSxRQUFYLEVBQXFCLElBQUMsQ0FBQSxlQUFBOztRQUN0QixJQUFDLENBQUEsU0FBYyxJQUFBLGNBQUEsQ0FBZSxJQUFDLENBQUEsUUFBaEI7O0lBSko7OzhCQU1iLFNBQUEsR0FBVyxTQUFBO2FBQ0wsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUE0QixJQUFDLENBQUEsS0FBN0IsQ0FBUCxFQUE0QyxJQUE1QztJQURLOzs4QkFHWCxNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sS0FBUDtBQUNOLFVBQUE7O1FBRGEsUUFBTTs7TUFDbkIsSUFBVSxJQUFDLENBQUEsUUFBUSxDQUFDLHNCQUFWLENBQWlDLElBQUMsQ0FBQSxLQUFsQyxDQUF3QyxDQUFDLE1BQXpDLEtBQW1ELENBQTdEO0FBQUEsZUFBQTs7O1FBRUEsYUFBYyxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDOztNQUVqQyxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNULE1BQU0sQ0FBQyxTQUFQLEdBQW1CO0FBRW5CLGFBQU0sS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFkO1FBQ0csWUFBYTtRQUNiLFFBQVM7UUFDVCxZQUFhO1FBRWQsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLFNBQWQ7UUFFVCxJQUFHLGNBQUg7VUFDRSxNQUFNLENBQUMsU0FBUCxJQUFvQjtVQUVwQixJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO1lBQ0UsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUI7WUFDbkIsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUI7WUFFbkIsSUFBQSxHQUFPLENBQUM7WUFDUixjQUFBLEdBQWlCO0FBRWpCLGlCQUFBLHdDQUFBOztjQUNFLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWM7Y0FDZCxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUixJQUFjO2NBQ2QsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFLLDhDQUFoQjtjQUN2QixjQUFBLEdBQWlCLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQTtBQUozQjtBQU1BLG1CQUFPLE9BYlQ7V0FBQSxNQUFBO1lBZUUsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFBTSxDQUFDLFVBZjVCO1dBSEY7O01BUEY7QUEyQkEsYUFBTztJQW5DRDs7Ozs7QUFiViIsInNvdXJjZXNDb250ZW50IjpbIltWYXJpYWJsZVBhcnNlciwgY291bnRMaW5lc10gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWYXJpYWJsZVNjYW5uZXJcbiAgY29uc3RydWN0b3I6IChwYXJhbXM9e30pIC0+XG4gICAgVmFyaWFibGVQYXJzZXIgPz0gcmVxdWlyZSAnLi92YXJpYWJsZS1wYXJzZXInXG5cbiAgICB7QHBhcnNlciwgQHJlZ2lzdHJ5LCBAc2NvcGV9ID0gcGFyYW1zXG4gICAgQHBhcnNlciA/PSBuZXcgVmFyaWFibGVQYXJzZXIoQHJlZ2lzdHJ5KVxuXG4gIGdldFJlZ0V4cDogLT5cbiAgICBuZXcgUmVnRXhwKEByZWdpc3RyeS5nZXRSZWdFeHBGb3JTY29wZShAc2NvcGUpLCAnZ20nKVxuXG4gIHNlYXJjaDogKHRleHQsIHN0YXJ0PTApIC0+XG4gICAgcmV0dXJuIGlmIEByZWdpc3RyeS5nZXRFeHByZXNzaW9uc0ZvclNjb3BlKEBzY29wZSkubGVuZ3RoIGlzIDBcblxuICAgIGNvdW50TGluZXMgPz0gcmVxdWlyZSgnLi91dGlscycpLmNvdW50TGluZXNcblxuICAgIHJlZ2V4cCA9IEBnZXRSZWdFeHAoKVxuICAgIHJlZ2V4cC5sYXN0SW5kZXggPSBzdGFydFxuXG4gICAgd2hpbGUgbWF0Y2ggPSByZWdleHAuZXhlYyh0ZXh0KVxuICAgICAgW21hdGNoVGV4dF0gPSBtYXRjaFxuICAgICAge2luZGV4fSA9IG1hdGNoXG4gICAgICB7bGFzdEluZGV4fSA9IHJlZ2V4cFxuXG4gICAgICByZXN1bHQgPSBAcGFyc2VyLnBhcnNlKG1hdGNoVGV4dClcblxuICAgICAgaWYgcmVzdWx0P1xuICAgICAgICByZXN1bHQubGFzdEluZGV4ICs9IGluZGV4XG5cbiAgICAgICAgaWYgcmVzdWx0Lmxlbmd0aCA+IDBcbiAgICAgICAgICByZXN1bHQucmFuZ2VbMF0gKz0gaW5kZXhcbiAgICAgICAgICByZXN1bHQucmFuZ2VbMV0gKz0gaW5kZXhcblxuICAgICAgICAgIGxpbmUgPSAtMVxuICAgICAgICAgIGxpbmVDb3VudEluZGV4ID0gMFxuXG4gICAgICAgICAgZm9yIHYgaW4gcmVzdWx0XG4gICAgICAgICAgICB2LnJhbmdlWzBdICs9IGluZGV4XG4gICAgICAgICAgICB2LnJhbmdlWzFdICs9IGluZGV4XG4gICAgICAgICAgICBsaW5lID0gdi5saW5lID0gbGluZSArIGNvdW50TGluZXModGV4dFtsaW5lQ291bnRJbmRleC4udi5yYW5nZVswXV0pXG4gICAgICAgICAgICBsaW5lQ291bnRJbmRleCA9IHYucmFuZ2VbMF1cblxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlZ2V4cC5sYXN0SW5kZXggPSByZXN1bHQubGFzdEluZGV4XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4iXX0=

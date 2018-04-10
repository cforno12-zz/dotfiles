
/*
Requires https://github.com/commercialhaskell/hindent
 */

(function() {
  "use strict";
  var Beautifier, Hindent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Hindent = (function(superClass) {
    extend(Hindent, superClass);

    function Hindent() {
      return Hindent.__super__.constructor.apply(this, arguments);
    }

    Hindent.prototype.name = "hindent";

    Hindent.prototype.link = "https://github.com/commercialhaskell/hindent";

    Hindent.prototype.isPreInstalled = false;

    Hindent.prototype.options = {
      Haskell: false
    };

    Hindent.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("hindent", [tempFile = this.tempFile("temp", text)], {
        help: {
          link: "https://github.com/commercialhaskell/hindent"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Hindent;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9oaW5kZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFDTixjQUFBLEdBQWdCOztzQkFFaEIsT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTLEtBREY7OztzQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsQ0FDZCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLENBREcsQ0FBaEIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSw4Q0FERjtTQURMO09BRkwsQ0FPRSxDQUFDLElBUEgsQ0FPUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUFI7SUFEUTs7OztLQVQyQjtBQVB2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2NvbW1lcmNpYWxoYXNrZWxsL2hpbmRlbnRcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSGluZGVudCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJoaW5kZW50XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY29tbWVyY2lhbGhhc2tlbGwvaGluZGVudFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBIYXNrZWxsOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwiaGluZGVudFwiLCBbXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbW1lcmNpYWxoYXNrZWxsL2hpbmRlbnRcIlxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19


/*
Requires https://github.com/OCamlPro/ocp-indent
 */

(function() {
  "use strict";
  var Beautifier, OCPIndent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCPIndent = (function(superClass) {
    extend(OCPIndent, superClass);

    function OCPIndent() {
      return OCPIndent.__super__.constructor.apply(this, arguments);
    }

    OCPIndent.prototype.name = "ocp-indent";

    OCPIndent.prototype.link = "https://www.typerex.org/ocp-indent.html";

    OCPIndent.prototype.isPreInstalled = false;

    OCPIndent.prototype.options = {
      OCaml: true
    };

    OCPIndent.prototype.beautify = function(text, language, options) {
      return this.run("ocp-indent", [this.tempFile("input", text)], {
        help: {
          link: "https://www.typerex.org/ocp-indent.html"
        }
      });
    };

    return OCPIndent;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9vY3AtaW5kZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxxQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFDTixjQUFBLEdBQWdCOzt3QkFFaEIsT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssWUFBTCxFQUFtQixDQUNqQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEaUIsQ0FBbkIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQVQ2QjtBQVB6QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL09DYW1sUHJvL29jcC1pbmRlbnRcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgT0NQSW5kZW50IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIm9jcC1pbmRlbnRcIlxuICBsaW5rOiBcImh0dHBzOi8vd3d3LnR5cGVyZXgub3JnL29jcC1pbmRlbnQuaHRtbFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBPQ2FtbDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwib2NwLWluZGVudFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy50eXBlcmV4Lm9yZy9vY3AtaW5kZW50Lmh0bWxcIlxuICAgICAgICB9XG4gICAgICB9KVxuIl19

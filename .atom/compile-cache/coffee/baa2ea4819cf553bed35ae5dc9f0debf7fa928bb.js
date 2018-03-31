
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

    OCPIndent.prototype.executables = [
      {
        name: "ocp-indent",
        cmd: "ocp-indent",
        homepage: "https://www.typerex.org/ocp-indent.html",
        installation: "https://www.typerex.org/ocp-indent.html#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/(\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/(\d+\.\d+)/)[1] + ".0";
            }
          }
        },
        docker: {
          image: "unibeautify/ocp-indent"
        }
      }
    ];

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9vY3AtaW5kZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxxQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxZQURSO1FBRUUsR0FBQSxFQUFLLFlBRlA7UUFHRSxRQUFBLEVBQVUseUNBSFo7UUFJRSxZQUFBLEVBQWMsc0RBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDtBQUNMO3FCQUNFLElBQUksQ0FBQyxLQUFMLENBQVcsaUJBQVgsQ0FBOEIsQ0FBQSxDQUFBLEVBRGhDO2FBQUEsYUFBQTtxQkFHRSxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVgsQ0FBeUIsQ0FBQSxDQUFBLENBQXpCLEdBQThCLEtBSGhDOztVQURLLENBREE7U0FMWDtRQVlFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyx3QkFERDtTQVpWO09BRFc7Ozt3QkFtQmIsT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7Ozt3QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssWUFBTCxFQUFtQixDQUNqQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEaUIsQ0FBbkIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQTFCNkI7QUFQekMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9PQ2FtbFByby9vY3AtaW5kZW50XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE9DUEluZGVudCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJvY3AtaW5kZW50XCJcbiAgbGluazogXCJodHRwczovL3d3dy50eXBlcmV4Lm9yZy9vY3AtaW5kZW50Lmh0bWxcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib2NwLWluZGVudFwiXG4gICAgICBjbWQ6IFwib2NwLWluZGVudFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy50eXBlcmV4Lm9yZy9vY3AtaW5kZW50Lmh0bWxcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LnR5cGVyZXgub3JnL29jcC1pbmRlbnQuaHRtbCNpbnN0YWxsYXRpb25cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgIHRleHQubWF0Y2goLyhcXGQrXFwuXFxkKykvKVsxXSArIFwiLjBcIlxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L29jcC1pbmRlbnRcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBPQ2FtbDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwib2NwLWluZGVudFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL3d3dy50eXBlcmV4Lm9yZy9vY3AtaW5kZW50Lmh0bWxcIlxuICAgICAgICB9XG4gICAgICB9KSJdfQ==

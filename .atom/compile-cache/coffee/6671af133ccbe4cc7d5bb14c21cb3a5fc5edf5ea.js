
/*
Requires https://github.com/ocaml-ppx/ocamlformat
 */

(function() {
  "use strict";
  var Beautifier, OCamlFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCamlFormat = (function(superClass) {
    extend(OCamlFormat, superClass);

    function OCamlFormat() {
      return OCamlFormat.__super__.constructor.apply(this, arguments);
    }

    OCamlFormat.prototype.name = "ocamlformat";

    OCamlFormat.prototype.link = "https://github.com/ocaml-ppx/ocamlformat";

    OCamlFormat.prototype.executables = [
      {
        name: "ocamlformat",
        cmd: "ocamlformat",
        homepage: "https://github.com/ocaml-ppx/ocamlformat",
        installation: "https://github.com/ocaml-ppx/ocamlformat#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/(\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/(\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    OCamlFormat.prototype.options = {
      OCaml: true
    };

    OCamlFormat.prototype.beautify = function(text, language, options) {
      return this.run("ocamlformat", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/ocaml-ppx/ocamlformat"
        }
      });
    };

    return OCamlFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9vY2FtbGZvcm1hdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsdUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzBCQUNyQixJQUFBLEdBQU07OzBCQUNOLElBQUEsR0FBTTs7MEJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sYUFEUjtRQUVFLEdBQUEsRUFBSyxhQUZQO1FBR0UsUUFBQSxFQUFVLDBDQUhaO1FBSUUsWUFBQSxFQUFjLHVEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTDtxQkFDRSxJQUFJLENBQUMsS0FBTCxDQUFXLGlCQUFYLENBQThCLENBQUEsQ0FBQSxFQURoQzthQUFBLGFBQUE7cUJBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYLENBQXlCLENBQUEsQ0FBQSxDQUF6QixHQUE4QixLQUhoQzs7VUFESyxDQURBO1NBTFg7T0FEVzs7OzBCQWdCYixPQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sSUFEQTs7OzBCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxhQUFMLEVBQW9CLENBQ2xCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURrQixDQUFwQixFQUVLO1FBQ0QsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLDBDQURGO1NBREw7T0FGTDtJQURROzs7O0tBdkIrQjtBQVAzQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL29jYW1sLXBweC9vY2FtbGZvcm1hdFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBPQ2FtbEZvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJvY2FtbGZvcm1hdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL29jYW1sLXBweC9vY2FtbGZvcm1hdFwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvY2FtbGZvcm1hdFwiXG4gICAgICBjbWQ6IFwib2NhbWxmb3JtYXRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL29jYW1sLXBweC9vY2FtbGZvcm1hdFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL29jYW1sLXBweC9vY2FtbGZvcm1hdCNpbnN0YWxsYXRpb25cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgIHRleHQubWF0Y2goLyhcXGQrXFwuXFxkKykvKVsxXSArIFwiLjBcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBPQ2FtbDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwib2NhbWxmb3JtYXRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL29jYW1sLXBweC9vY2FtbGZvcm1hdFwiXG4gICAgICAgIH1cbiAgICAgIH0pXG4iXX0=

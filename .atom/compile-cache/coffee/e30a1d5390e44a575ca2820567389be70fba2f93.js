
/*
Requires terraform installed
 */

(function() {
  "use strict";
  var Beautifier, Terraformfmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Terraformfmt = (function(superClass) {
    extend(Terraformfmt, superClass);

    function Terraformfmt() {
      return Terraformfmt.__super__.constructor.apply(this, arguments);
    }

    Terraformfmt.prototype.name = "terraformfmt";

    Terraformfmt.prototype.link = "https://www.terraform.io/docs/commands/fmt.html";

    Terraformfmt.prototype.options = {
      Terraform: false
    };

    Terraformfmt.prototype.executables = [
      {
        name: "Terraform",
        cmd: "terraform",
        homepage: "https://www.terraform.io",
        installation: "https://www.terraform.io",
        version: {
          parse: function(text) {
            return text.match(/Terraform v(\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "hashicorp/terraform"
        }
      }
    ];

    Terraformfmt.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("terraform").run(["fmt", tempFile = this.tempFile("input", text)]).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Terraformfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90ZXJyYWZvcm1mbXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLHdCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzsyQkFDckIsSUFBQSxHQUFNOzsyQkFDTixJQUFBLEdBQU07OzJCQUVOLE9BQUEsR0FBUztNQUNQLFNBQUEsRUFBVyxLQURKOzs7MkJBSVQsV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sV0FEUjtRQUVFLEdBQUEsRUFBSyxXQUZQO1FBR0UsUUFBQSxFQUFVLDBCQUhaO1FBSUUsWUFBQSxFQUFjLDBCQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyw0QkFBWCxDQUF5QyxDQUFBLENBQUE7VUFBbkQsQ0FEQTtTQUxYO1FBUUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHFCQUREO1NBUlY7T0FEVzs7OzJCQWViLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxDQUFpQixDQUFDLEdBQWxCLENBQXNCLENBQ3BCLEtBRG9CLEVBRXBCLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FGUyxDQUF0QixDQUlFLENBQUMsSUFKSCxDQUlRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKUjtJQURROzs7O0tBdkJnQztBQVA1QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgdGVycmFmb3JtIGluc3RhbGxlZFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUZXJyYWZvcm1mbXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwidGVycmFmb3JtZm10XCJcbiAgbGluazogXCJodHRwczovL3d3dy50ZXJyYWZvcm0uaW8vZG9jcy9jb21tYW5kcy9mbXQuaHRtbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIFRlcnJhZm9ybTogZmFsc2VcbiAgfVxuXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJUZXJyYWZvcm1cIlxuICAgICAgY21kOiBcInRlcnJhZm9ybVwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy50ZXJyYWZvcm0uaW9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LnRlcnJhZm9ybS5pb1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvVGVycmFmb3JtIHYoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwiaGFzaGljb3JwL3RlcnJhZm9ybVwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZXhlKFwidGVycmFmb3JtXCIpLnJ1bihbXG4gICAgICBcImZtdFwiXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdKVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19

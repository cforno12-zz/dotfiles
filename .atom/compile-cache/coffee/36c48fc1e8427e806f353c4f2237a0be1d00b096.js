
/*
Requires [black](https://github.com/ambv/black)
 */

(function() {
  "use strict";
  var Beautifier, Black, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Black = (function(superClass) {
    extend(Black, superClass);

    function Black() {
      return Black.__super__.constructor.apply(this, arguments);
    }

    Black.prototype.name = "black";

    Black.prototype.link = "https://github.com/ambv/black";

    Black.prototype.executables = [
      {
        name: "black",
        cmd: "black",
        homepage: "https://github.com/ambv/black",
        installation: "https://github.com/ambv/black#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/black, version (\d+\.\d+)/)[1] + "." + text.match(/b(\d+)$/)[1];
            } catch (error) {
              return text.match(/black, version (\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    Black.prototype.options = {
      Python: false
    };

    Black.prototype.beautify = function(text, language, options, context) {
      var cwd;
      cwd = context.filePath && path.dirname(context.filePath);
      return this.exe("black").run(["-"], {
        cwd: cwd,
        onStdin: function(stdin) {
          return stdin.end(text);
        }
      });
    };

    return Black;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ibGFjay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsdUJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztvQkFDckIsSUFBQSxHQUFNOztvQkFDTixJQUFBLEdBQU07O29CQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLE9BRFI7UUFFRSxHQUFBLEVBQUssT0FGUDtRQUdFLFFBQUEsRUFBVSwrQkFIWjtRQUlFLFlBQUEsRUFBYyw0Q0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO0FBRUw7cUJBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBVywyQkFBWCxDQUF3QyxDQUFBLENBQUEsQ0FBeEMsR0FBNkMsR0FBN0MsR0FBbUQsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFYLENBQXNCLENBQUEsQ0FBQSxFQUQzRTthQUFBLGFBQUE7cUJBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBVywyQkFBWCxDQUF3QyxDQUFBLENBQUEsQ0FBeEMsR0FBNkMsS0FIL0M7O1VBRkssQ0FEQTtTQUxYO09BRFc7OztvQkFpQmIsT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLEtBREQ7OztvQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFFBQVIsSUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsUUFBckI7YUFFM0IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFkLENBQWtCLENBQUMsR0FBRCxDQUFsQixFQUF5QjtRQUN2QixHQUFBLEVBQUssR0FEa0I7UUFFdkIsT0FBQSxFQUFTLFNBQUMsS0FBRDtpQkFDUCxLQUFLLENBQUMsR0FBTixDQUFVLElBQVY7UUFETyxDQUZjO09BQXpCO0lBSFE7Ozs7S0F4QnlCO0FBUHJDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbYmxhY2tdKGh0dHBzOi8vZ2l0aHViLmNvbS9hbWJ2L2JsYWNrKVxuIyMjXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmxhY2sgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiYmxhY2tcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbWJ2L2JsYWNrXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcImJsYWNrXCJcbiAgICAgIGNtZDogXCJibGFja1wiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vYW1idi9ibGFja1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL2FtYnYvYmxhY2sjaW5zdGFsbGF0aW9uXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPlxuICAgICAgICAgICMgVHJ5IHRvIHJlYWQgYmV0YSB2YWx1ZXMsIGVnIFwiYmxhY2ssIHZlcnNpb24gMTguNmI0XCIgLT4gMTguNi40XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC9ibGFjaywgdmVyc2lvbiAoXFxkK1xcLlxcZCspLylbMV0gKyBcIi5cIiArIHRleHQubWF0Y2goL2IoXFxkKykkLylbMV1cbiAgICAgICAgICBjYXRjaFxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvYmxhY2ssIHZlcnNpb24gKFxcZCtcXC5cXGQrKS8pWzFdICsgXCIuMFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIFB5dGhvbjogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgY3dkID0gY29udGV4dC5maWxlUGF0aCBhbmQgcGF0aC5kaXJuYW1lIGNvbnRleHQuZmlsZVBhdGhcbiAgICAjIGAtYCBhcyBmaWxlbmFtZSByZWFkcyBmcm9tIHN0ZGluXG4gICAgQGV4ZShcImJsYWNrXCIpLnJ1bihbXCItXCJdLCB7XG4gICAgICBjd2Q6IGN3ZFxuICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICBzdGRpbi5lbmQgdGV4dFxuICAgIH0pXG4iXX0=

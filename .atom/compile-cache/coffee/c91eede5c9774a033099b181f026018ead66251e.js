
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(superClass) {
    extend(Autopep8, superClass);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.link = "https://github.com/hhatto/autopep8";

    Autopep8.prototype.executables = [
      {
        name: "autopep8",
        cmd: "autopep8",
        homepage: "https://github.com/hhatto/autopep8",
        installation: "https://github.com/hhatto/autopep8#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/autopep8 (\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/autopep8 (\d+\.\d+)/)[1] + ".0";
            }
          },
          runOptions: {
            returnStdoutOrStderr: true
          }
        },
        docker: {
          image: "unibeautify/autopep8"
        }
      }, {
        name: "isort",
        cmd: "isort",
        optional: true,
        homepage: "https://github.com/timothycrosley/isort",
        installation: "https://github.com/timothycrosley/isort#installing-isort",
        version: {
          parse: function(text) {
            return text.match(/VERSION (\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options, context) {
      var tempFile;
      if (context == null) {
        context = {};
      }
      return this.exe("autopep8").run([tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0]).then((function(_this) {
        return function() {
          var filePath, projectPath;
          if (options.sort_imports) {
            filePath = context.filePath;
            projectPath = typeof atom !== "undefined" && atom !== null ? atom.project.relativizePath(filePath)[0] : void 0;
            return _this.exe("isort").run(["-sp", projectPath, tempFile]);
          }
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9hdXRvcGVwOC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsb0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3VCQUVyQixJQUFBLEdBQU07O3VCQUNOLElBQUEsR0FBTTs7dUJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sVUFEUjtRQUVFLEdBQUEsRUFBSyxVQUZQO1FBR0UsUUFBQSxFQUFVLG9DQUhaO1FBSUUsWUFBQSxFQUFjLGlEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTDtxQkFDRSxJQUFJLENBQUMsS0FBTCxDQUFXLDBCQUFYLENBQXVDLENBQUEsQ0FBQSxFQUR6QzthQUFBLGFBQUE7cUJBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxxQkFBWCxDQUFrQyxDQUFBLENBQUEsQ0FBbEMsR0FBdUMsS0FIekM7O1VBREssQ0FEQTtVQU1QLFVBQUEsRUFBWTtZQUNWLG9CQUFBLEVBQXNCLElBRFo7V0FOTDtTQUxYO1FBZUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHNCQUREO1NBZlY7T0FEVyxFQW9CWDtRQUNFLElBQUEsRUFBTSxPQURSO1FBRUUsR0FBQSxFQUFLLE9BRlA7UUFHRSxRQUFBLEVBQVUsSUFIWjtRQUlFLFFBQUEsRUFBVSx5Q0FKWjtRQUtFLFlBQUEsRUFBYywwREFMaEI7UUFNRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcseUJBQVgsQ0FBc0MsQ0FBQSxDQUFBO1VBQWhELENBREE7U0FOWDtPQXBCVzs7O3VCQWdDYixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsSUFERDs7O3VCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBQ1IsVUFBQTs7UUFEa0MsVUFBVTs7YUFDNUMsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsQ0FDakIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURNLEVBRWpCLElBRmlCLEVBR3NDLCtCQUF2RCxHQUFBLENBQUMsbUJBQUQsRUFBc0IsRUFBQSxHQUFHLE9BQU8sQ0FBQyxlQUFqQyxDQUFBLEdBQUEsTUFIaUIsRUFJNkIsMkJBQTlDLEdBQUEsQ0FBQyxlQUFELEVBQWlCLEVBQUEsR0FBRyxPQUFPLENBQUMsV0FBNUIsQ0FBQSxHQUFBLE1BSmlCLEVBSzZCLHNCQUE5QyxHQUFBLENBQUMsVUFBRCxFQUFZLEVBQUEsR0FBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBZixDQUFvQixHQUFwQixDQUFELENBQWQsQ0FBQSxHQUFBLE1BTGlCLENBQXJCLENBT0UsQ0FBQyxJQVBILENBT1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0osY0FBQTtVQUFBLElBQUcsT0FBTyxDQUFDLFlBQVg7WUFDRSxRQUFBLEdBQVcsT0FBTyxDQUFDO1lBQ25CLFdBQUEsa0RBQWMsSUFBSSxDQUFFLE9BQU8sQ0FBQyxjQUFkLENBQTZCLFFBQTdCLENBQXVDLENBQUEsQ0FBQTttQkFDckQsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFkLENBQWtCLENBQUMsS0FBRCxFQUFRLFdBQVIsRUFBcUIsUUFBckIsQ0FBbEIsRUFIRjs7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FQUixDQWFFLENBQUMsSUFiSCxDQWFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FiUjtJQURROzs7O0tBeEM0QjtBQVB4QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBdXRvcGVwOCBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcImF1dG9wZXA4XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcImF1dG9wZXA4XCJcbiAgICAgIGNtZDogXCJhdXRvcGVwOFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4I2luc3RhbGxhdGlvblwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHRleHQubWF0Y2goL2F1dG9wZXA4IChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgICAgICBjYXRjaFxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvYXV0b3BlcDggKFxcZCtcXC5cXGQrKS8pWzFdICsgXCIuMFwiXG4gICAgICAgIHJ1bk9wdGlvbnM6IHtcbiAgICAgICAgICByZXR1cm5TdGRvdXRPclN0ZGVycjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvYXV0b3BlcDhcIlxuICAgICAgfVxuICAgIH1cbiAgICB7XG4gICAgICBuYW1lOiBcImlzb3J0XCJcbiAgICAgIGNtZDogXCJpc29ydFwiXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL3RpbW90aHljcm9zbGV5L2lzb3J0XCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vdGltb3RoeWNyb3NsZXkvaXNvcnQjaW5zdGFsbGluZy1pc29ydFwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvVkVSU0lPTiAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIFB5dGhvbjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCA9IHt9KSAtPlxuICAgIEBleGUoXCJhdXRvcGVwOFwiKS5ydW4oW1xuICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICAgIFwiLWlcIlxuICAgICAgICBbXCItLW1heC1saW5lLWxlbmd0aFwiLCBcIiN7b3B0aW9ucy5tYXhfbGluZV9sZW5ndGh9XCJdIGlmIG9wdGlvbnMubWF4X2xpbmVfbGVuZ3RoP1xuICAgICAgICBbXCItLWluZGVudC1zaXplXCIsXCIje29wdGlvbnMuaW5kZW50X3NpemV9XCJdIGlmIG9wdGlvbnMuaW5kZW50X3NpemU/XG4gICAgICAgIFtcIi0taWdub3JlXCIsXCIje29wdGlvbnMuaWdub3JlLmpvaW4oJywnKX1cIl0gaWYgb3B0aW9ucy5pZ25vcmU/XG4gICAgICBdKVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgaWYgb3B0aW9ucy5zb3J0X2ltcG9ydHNcbiAgICAgICAgICBmaWxlUGF0aCA9IGNvbnRleHQuZmlsZVBhdGhcbiAgICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20/LnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG4gICAgICAgICAgQGV4ZShcImlzb3J0XCIpLnJ1bihbXCItc3BcIiwgcHJvamVjdFBhdGgsIHRlbXBGaWxlXSlcbiAgICAgIClcbiAgICAgIC50aGVuKD0+IEByZWFkRmlsZSh0ZW1wRmlsZSkpXG4iXX0=

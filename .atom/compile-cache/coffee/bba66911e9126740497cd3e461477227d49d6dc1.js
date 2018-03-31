
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Rubocop = (function(superClass) {
    extend(Rubocop, superClass);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.link = "https://github.com/bbatsov/rubocop";

    Rubocop.prototype.isPreInstalled = false;

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.executables = [
      {
        name: "Rubocop",
        cmd: "rubocop",
        homepage: "http://rubocop.readthedocs.io/",
        installation: "http://rubocop.readthedocs.io/en/latest/installation/",
        version: {
          parse: function(text) {
            return text.match(/(\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    Rubocop.prototype.beautify = function(text, language, options, context) {
      var _relativePath, fullPath, projectPath, ref;
      fullPath = context.filePath || "";
      ref = atom.project.relativizePath(fullPath), projectPath = ref[0], _relativePath = ref[1];
      if (options.rubocop_path) {
        this.deprecateOptionForExecutable("Rubocop", "Ruby - Rubocop Path (rubocop_path)", "Path");
      }
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var config, configFile, exeOptions, rubocopArguments, rubocopPath, tempConfig, yaml;
          _this.debug('rubocop paths', paths);
          rubocopPath = paths.find(function(p) {
            return p && path.isAbsolute(p);
          }) || "rubocop";
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = _this.findFile(path.dirname(fullPath), ".rubocop.yml");
          if (configFile == null) {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            tempConfig = _this.tempFile("rubocop-config", yaml.safeDump(config));
          }
          rubocopArguments = ["--auto-correct", "--force-exclusion", "--stdin", "atom-beautify.rb"];
          exeOptions = {
            ignoreReturnCode: true,
            cwd: configFile != null ? projectPath : void 0,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          };
          if (tempConfig != null) {
            rubocopArguments.push("--config", tempConfig);
          }
          _this.debug("rubocop arguments", rubocopArguments);
          return (options.rubocop_path ? _this.run(rubocopPath, rubocopArguments, exeOptions) : _this.exe("rubocop").run(rubocopArguments, exeOptions)).then(function(stdout) {
            var result;
            _this.debug("rubocop output", stdout);
            if (stdout.length === 0) {
              return text;
            }
            result = stdout.split("====================\n");
            return result[result.length - 1];
          });
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJvY29wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx5QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sY0FBQSxHQUFnQjs7c0JBRWhCLE9BQUEsR0FBUztNQUNQLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsWUFBQSxFQUFjLElBRGQ7T0FGSzs7O3NCQU1ULFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFNBRFI7UUFFRSxHQUFBLEVBQUssU0FGUDtRQUdFLFFBQUEsRUFBVSxnQ0FIWjtRQUlFLFlBQUEsRUFBYyx1REFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsaUJBQVgsQ0FBOEIsQ0FBQSxDQUFBO1VBQXhDLENBREE7U0FMWDtPQURXOzs7c0JBWWIsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxRQUFSLElBQW9CO01BQy9CLE1BQStCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUEvQixFQUFDLG9CQUFELEVBQWM7TUFHZCxJQUFHLE9BQU8sQ0FBQyxZQUFYO1FBQ0UsSUFBQyxDQUFBLDRCQUFELENBQThCLFNBQTlCLEVBQXlDLG9DQUF6QyxFQUErRSxNQUEvRSxFQURGOzthQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3FCLE9BQU8sQ0FBQyxZQUF4QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLFlBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsQ0FGVyxDQUFiLENBSUEsQ0FBQyxJQUpELENBSU0sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7QUFDSixjQUFBO1VBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxlQUFQLEVBQXdCLEtBQXhCO1VBRUEsV0FBQSxHQUFjLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBQyxDQUFEO21CQUFPLENBQUEsSUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQjtVQUFiLENBQVgsQ0FBQSxJQUErQztVQUM3RCxLQUFDLENBQUEsT0FBRCxDQUFTLGFBQVQsRUFBd0IsV0FBeEI7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0IsV0FBdEIsRUFBbUMsS0FBbkM7VUFHQSxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBVixFQUFrQyxjQUFsQztVQUNiLElBQUksa0JBQUo7WUFDRSxJQUFBLEdBQU8sT0FBQSxDQUFRLG1CQUFSO1lBQ1AsTUFBQSxHQUFTO2NBQ1Asd0JBQUEsRUFDRTtnQkFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLFdBQWpCO2VBRks7O1lBSVQsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLENBQTVCLEVBTmY7O1VBUUEsZ0JBQUEsR0FBbUIsQ0FDakIsZ0JBRGlCLEVBRWpCLG1CQUZpQixFQUdqQixTQUhpQixFQUdOLGtCQUhNO1VBS25CLFVBQUEsR0FBYTtZQUNYLGdCQUFBLEVBQWtCLElBRFA7WUFFWCxHQUFBLEVBQW9CLGtCQUFmLEdBQUEsV0FBQSxHQUFBLE1BRk07WUFHWCxPQUFBLEVBQVMsU0FBQyxLQUFEO3FCQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtZQUFYLENBSEU7O1VBS2IsSUFBaUQsa0JBQWpEO1lBQUEsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsVUFBdEIsRUFBa0MsVUFBbEMsRUFBQTs7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLG1CQUFQLEVBQTRCLGdCQUE1QjtpQkFFQSxDQUFJLE9BQU8sQ0FBQyxZQUFYLEdBQ0MsS0FBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLGdCQUFsQixFQUFvQyxVQUFwQyxDQURELEdBRUMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLENBQWUsQ0FBQyxHQUFoQixDQUFvQixnQkFBcEIsRUFBc0MsVUFBdEMsQ0FGRixDQUdDLENBQUMsSUFIRixDQUdPLFNBQUMsTUFBRDtBQUNMLGdCQUFBO1lBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxFQUF5QixNQUF6QjtZQUVBLElBQWUsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBaEM7QUFBQSxxQkFBTyxLQUFQOztZQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsS0FBUCxDQUFhLHdCQUFiO21CQUNULE1BQU8sQ0FBQSxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFoQjtVQU5GLENBSFA7UUE5Qkk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSk47SUFUUTs7OztLQXZCMkI7QUFSdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9iYmF0c292L3J1Ym9jb3BcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUnVib2NvcCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSdWJvY29wXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIFJ1Ynk6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgcnVib2NvcF9wYXRoOiB0cnVlXG4gIH1cblxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiUnVib2NvcFwiXG4gICAgICBjbWQ6IFwicnVib2NvcFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vcnVib2NvcC5yZWFkdGhlZG9jcy5pby9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHA6Ly9ydWJvY29wLnJlYWR0aGVkb2NzLmlvL2VuL2xhdGVzdC9pbnN0YWxsYXRpb24vXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC8oXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBmdWxsUGF0aCA9IGNvbnRleHQuZmlsZVBhdGggb3IgXCJcIlxuICAgIFtwcm9qZWN0UGF0aCwgX3JlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZnVsbFBhdGgpXG5cbiAgICAjIERlcHJlY2F0ZSBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgIGlmIG9wdGlvbnMucnVib2NvcF9wYXRoXG4gICAgICBAZGVwcmVjYXRlT3B0aW9uRm9yRXhlY3V0YWJsZShcIlJ1Ym9jb3BcIiwgXCJSdWJ5IC0gUnVib2NvcCBQYXRoIChydWJvY29wX3BhdGgpXCIsIFwiUGF0aFwiKVxuXG4gICAgIyBGaW5kIHRoZSBydWJvY29wIHBhdGhcbiAgICBAUHJvbWlzZS5hbGwoW1xuICAgICAgQHdoaWNoKG9wdGlvbnMucnVib2NvcF9wYXRoKSBpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgICAgQHdoaWNoKCdydWJvY29wJylcbiAgICBdKVxuICAgIC50aGVuKChwYXRocykgPT5cbiAgICAgIEBkZWJ1ZygncnVib2NvcCBwYXRocycsIHBhdGhzKVxuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIHJ1Ym9jb3BQYXRoID0gcGF0aHMuZmluZCgocCkgLT4gcCBhbmQgcGF0aC5pc0Fic29sdXRlKHApKSBvciBcInJ1Ym9jb3BcIlxuICAgICAgQHZlcmJvc2UoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgpXG4gICAgICBAZGVidWcoJ3J1Ym9jb3BQYXRoJywgcnVib2NvcFBhdGgsIHBhdGhzKVxuXG4gICAgICAjIEZpbmQgb3IgZ2VuZXJhdGUgYSBjb25maWcgZmlsZSBpZiBub24gZXhpc3RzXG4gICAgICBjb25maWdGaWxlID0gQGZpbmRGaWxlKHBhdGguZGlybmFtZShmdWxsUGF0aCksIFwiLnJ1Ym9jb3AueW1sXCIpXG4gICAgICBpZiAhY29uZmlnRmlsZT9cbiAgICAgICAgeWFtbCA9IHJlcXVpcmUoXCJ5YW1sLWZyb250LW1hdHRlclwiKVxuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgXCJTdHlsZS9JbmRlbnRhdGlvbldpZHRoXCI6XG4gICAgICAgICAgICBcIldpZHRoXCI6IG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgfVxuICAgICAgICB0ZW1wQ29uZmlnID0gQHRlbXBGaWxlKFwicnVib2NvcC1jb25maWdcIiwgeWFtbC5zYWZlRHVtcChjb25maWcpKVxuXG4gICAgICBydWJvY29wQXJndW1lbnRzID0gW1xuICAgICAgICBcIi0tYXV0by1jb3JyZWN0XCJcbiAgICAgICAgXCItLWZvcmNlLWV4Y2x1c2lvblwiXG4gICAgICAgIFwiLS1zdGRpblwiLCBcImF0b20tYmVhdXRpZnkucmJcIiAjIGZpbGVuYW1lIGlzIHJlcXVpcmVkIGJ1dCBub3QgdXNlZFxuICAgICAgXVxuICAgICAgZXhlT3B0aW9ucyA9IHtcbiAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZSxcbiAgICAgICAgY3dkOiBwcm9qZWN0UGF0aCBpZiBjb25maWdGaWxlPyxcbiAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPiBzdGRpbi5lbmQgdGV4dFxuICAgICAgfVxuICAgICAgcnVib2NvcEFyZ3VtZW50cy5wdXNoKFwiLS1jb25maWdcIiwgdGVtcENvbmZpZykgaWYgdGVtcENvbmZpZz9cbiAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3AgYXJndW1lbnRzXCIsIHJ1Ym9jb3BBcmd1bWVudHMpXG5cbiAgICAgIChpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aCB0aGVuIFxcXG4gICAgICAgIEBydW4ocnVib2NvcFBhdGgsIHJ1Ym9jb3BBcmd1bWVudHMsIGV4ZU9wdGlvbnMpIGVsc2UgXFxcbiAgICAgICAgQGV4ZShcInJ1Ym9jb3BcIikucnVuKHJ1Ym9jb3BBcmd1bWVudHMsIGV4ZU9wdGlvbnMpXG4gICAgICApLnRoZW4oKHN0ZG91dCkgPT5cbiAgICAgICAgQGRlYnVnKFwicnVib2NvcCBvdXRwdXRcIiwgc3Rkb3V0KVxuICAgICAgICAjIFJ1Ym9jb3Agb3V0cHV0IGFuIGVycm9yIGlmIHN0ZG91dCBpcyBlbXB0eVxuICAgICAgICByZXR1cm4gdGV4dCBpZiBzdGRvdXQubGVuZ3RoID09IDBcblxuICAgICAgICByZXN1bHQgPSBzdGRvdXQuc3BsaXQoXCI9PT09PT09PT09PT09PT09PT09PVxcblwiKVxuICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdXG4gICAgICApXG4gICAgKVxuIl19

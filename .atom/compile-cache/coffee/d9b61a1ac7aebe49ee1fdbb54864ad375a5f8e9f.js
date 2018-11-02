
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
          rubocopArguments = ["--auto-correct", "--force-exclusion", "--stdin", fullPath || "atom-beautify.rb"];
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
            if (result.length === 1) {
              result = stdout.split("====================\r\n");
            }
            return result[result.length - 1];
          });
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJvY29wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx5QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sY0FBQSxHQUFnQjs7c0JBRWhCLE9BQUEsR0FBUztNQUNQLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsWUFBQSxFQUFjLElBRGQ7T0FGSzs7O3NCQU1ULFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFNBRFI7UUFFRSxHQUFBLEVBQUssU0FGUDtRQUdFLFFBQUEsRUFBVSxnQ0FIWjtRQUlFLFlBQUEsRUFBYyx1REFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsaUJBQVgsQ0FBOEIsQ0FBQSxDQUFBO1VBQXhDLENBREE7U0FMWDtPQURXOzs7c0JBWWIsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxRQUFSLElBQW9CO01BQy9CLE1BQStCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUEvQixFQUFDLG9CQUFELEVBQWM7TUFHZCxJQUFHLE9BQU8sQ0FBQyxZQUFYO1FBQ0UsSUFBQyxDQUFBLDRCQUFELENBQThCLFNBQTlCLEVBQXlDLG9DQUF6QyxFQUErRSxNQUEvRSxFQURGOzthQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3FCLE9BQU8sQ0FBQyxZQUF4QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLFlBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsQ0FGVyxDQUFiLENBSUEsQ0FBQyxJQUpELENBSU0sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7QUFDSixjQUFBO1VBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxlQUFQLEVBQXdCLEtBQXhCO1VBRUEsV0FBQSxHQUFjLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBQyxDQUFEO21CQUFPLENBQUEsSUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQjtVQUFiLENBQVgsQ0FBQSxJQUErQztVQUM3RCxLQUFDLENBQUEsT0FBRCxDQUFTLGFBQVQsRUFBd0IsV0FBeEI7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0IsV0FBdEIsRUFBbUMsS0FBbkM7VUFHQSxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBVixFQUFrQyxjQUFsQztVQUNiLElBQUksa0JBQUo7WUFDRSxJQUFBLEdBQU8sT0FBQSxDQUFRLG1CQUFSO1lBQ1AsTUFBQSxHQUFTO2NBQ1Asd0JBQUEsRUFDRTtnQkFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLFdBQWpCO2VBRks7O1lBSVQsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLENBQTVCLEVBTmY7O1VBUUEsZ0JBQUEsR0FBbUIsQ0FDakIsZ0JBRGlCLEVBRWpCLG1CQUZpQixFQUdqQixTQUhpQixFQUdOLFFBQUEsSUFBWSxrQkFITjtVQUtuQixVQUFBLEdBQWE7WUFDWCxnQkFBQSxFQUFrQixJQURQO1lBRVgsR0FBQSxFQUFvQixrQkFBZixHQUFBLFdBQUEsR0FBQSxNQUZNO1lBR1gsT0FBQSxFQUFTLFNBQUMsS0FBRDtxQkFBVyxLQUFLLENBQUMsR0FBTixDQUFVLElBQVY7WUFBWCxDQUhFOztVQUtiLElBQWlELGtCQUFqRDtZQUFBLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLFVBQXRCLEVBQWtDLFVBQWxDLEVBQUE7O1VBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxtQkFBUCxFQUE0QixnQkFBNUI7aUJBRUEsQ0FBSSxPQUFPLENBQUMsWUFBWCxHQUNDLEtBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxFQUFrQixnQkFBbEIsRUFBb0MsVUFBcEMsQ0FERCxHQUVDLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBTCxDQUFlLENBQUMsR0FBaEIsQ0FBb0IsZ0JBQXBCLEVBQXNDLFVBQXRDLENBRkYsQ0FHQyxDQUFDLElBSEYsQ0FHTyxTQUFDLE1BQUQ7QUFDTCxnQkFBQTtZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZ0JBQVAsRUFBeUIsTUFBekI7WUFFQSxJQUFlLE1BQU0sQ0FBQyxNQUFQLEtBQWlCLENBQWhDO0FBQUEscUJBQU8sS0FBUDs7WUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLEtBQVAsQ0FBYSx3QkFBYjtZQUNULElBQXFELE1BQU0sQ0FBQyxNQUFQLEtBQWlCLENBQXRFO2NBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxLQUFQLENBQWEsMEJBQWIsRUFBVDs7bUJBRUEsTUFBTyxDQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQWhCO1VBUkYsQ0FIUDtRQTlCSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKTjtJQVRROzs7O0tBdkIyQjtBQVJ2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2JiYXRzb3YvcnVib2NvcFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSdWJvY29wIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlJ1Ym9jb3BcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9iYmF0c292L3J1Ym9jb3BcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgUnVieTpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBydWJvY29wX3BhdGg6IHRydWVcbiAgfVxuXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJSdWJvY29wXCJcbiAgICAgIGNtZDogXCJydWJvY29wXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHA6Ly9ydWJvY29wLnJlYWR0aGVkb2NzLmlvL1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cDovL3J1Ym9jb3AucmVhZHRoZWRvY3MuaW8vZW4vbGF0ZXN0L2luc3RhbGxhdGlvbi9cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goLyhcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIGZ1bGxQYXRoID0gY29udGV4dC5maWxlUGF0aCBvciBcIlwiXG4gICAgW3Byb2plY3RQYXRoLCBfcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmdWxsUGF0aClcblxuICAgICMgRGVwcmVjYXRlIG9wdGlvbnMucnVib2NvcF9wYXRoXG4gICAgaWYgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICAgIEBkZXByZWNhdGVPcHRpb25Gb3JFeGVjdXRhYmxlKFwiUnVib2NvcFwiLCBcIlJ1YnkgLSBSdWJvY29wIFBhdGggKHJ1Ym9jb3BfcGF0aClcIiwgXCJQYXRoXCIpXG5cbiAgICAjIEZpbmQgdGhlIHJ1Ym9jb3AgcGF0aFxuICAgIEBQcm9taXNlLmFsbChbXG4gICAgICBAd2hpY2gob3B0aW9ucy5ydWJvY29wX3BhdGgpIGlmIG9wdGlvbnMucnVib2NvcF9wYXRoXG4gICAgICBAd2hpY2goJ3J1Ym9jb3AnKVxuICAgIF0pXG4gICAgLnRoZW4oKHBhdGhzKSA9PlxuICAgICAgQGRlYnVnKCdydWJvY29wIHBhdGhzJywgcGF0aHMpXG4gICAgICAjIEdldCBmaXJzdCB2YWxpZCwgYWJzb2x1dGUgcGF0aFxuICAgICAgcnVib2NvcFBhdGggPSBwYXRocy5maW5kKChwKSAtPiBwIGFuZCBwYXRoLmlzQWJzb2x1dGUocCkpIG9yIFwicnVib2NvcFwiXG4gICAgICBAdmVyYm9zZSgncnVib2NvcFBhdGgnLCBydWJvY29wUGF0aClcbiAgICAgIEBkZWJ1ZygncnVib2NvcFBhdGgnLCBydWJvY29wUGF0aCwgcGF0aHMpXG5cbiAgICAgICMgRmluZCBvciBnZW5lcmF0ZSBhIGNvbmZpZyBmaWxlIGlmIG5vbiBleGlzdHNcbiAgICAgIGNvbmZpZ0ZpbGUgPSBAZmluZEZpbGUocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSwgXCIucnVib2NvcC55bWxcIilcbiAgICAgIGlmICFjb25maWdGaWxlP1xuICAgICAgICB5YW1sID0gcmVxdWlyZShcInlhbWwtZnJvbnQtbWF0dGVyXCIpXG4gICAgICAgIGNvbmZpZyA9IHtcbiAgICAgICAgICBcIlN0eWxlL0luZGVudGF0aW9uV2lkdGhcIjpcbiAgICAgICAgICAgIFwiV2lkdGhcIjogb3B0aW9ucy5pbmRlbnRfc2l6ZVxuICAgICAgICB9XG4gICAgICAgIHRlbXBDb25maWcgPSBAdGVtcEZpbGUoXCJydWJvY29wLWNvbmZpZ1wiLCB5YW1sLnNhZmVEdW1wKGNvbmZpZykpXG5cbiAgICAgIHJ1Ym9jb3BBcmd1bWVudHMgPSBbXG4gICAgICAgIFwiLS1hdXRvLWNvcnJlY3RcIlxuICAgICAgICBcIi0tZm9yY2UtZXhjbHVzaW9uXCJcbiAgICAgICAgXCItLXN0ZGluXCIsIGZ1bGxQYXRoIG9yIFwiYXRvbS1iZWF1dGlmeS5yYlwiICMgLS1zdGRpbiByZXF1aXJlcyBhbiBhcmd1bWVudFxuICAgICAgXVxuICAgICAgZXhlT3B0aW9ucyA9IHtcbiAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZSxcbiAgICAgICAgY3dkOiBwcm9qZWN0UGF0aCBpZiBjb25maWdGaWxlPyxcbiAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPiBzdGRpbi5lbmQgdGV4dFxuICAgICAgfVxuICAgICAgcnVib2NvcEFyZ3VtZW50cy5wdXNoKFwiLS1jb25maWdcIiwgdGVtcENvbmZpZykgaWYgdGVtcENvbmZpZz9cbiAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3AgYXJndW1lbnRzXCIsIHJ1Ym9jb3BBcmd1bWVudHMpXG5cbiAgICAgIChpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aCB0aGVuIFxcXG4gICAgICAgIEBydW4ocnVib2NvcFBhdGgsIHJ1Ym9jb3BBcmd1bWVudHMsIGV4ZU9wdGlvbnMpIGVsc2UgXFxcbiAgICAgICAgQGV4ZShcInJ1Ym9jb3BcIikucnVuKHJ1Ym9jb3BBcmd1bWVudHMsIGV4ZU9wdGlvbnMpXG4gICAgICApLnRoZW4oKHN0ZG91dCkgPT5cbiAgICAgICAgQGRlYnVnKFwicnVib2NvcCBvdXRwdXRcIiwgc3Rkb3V0KVxuICAgICAgICAjIFJ1Ym9jb3Agb3V0cHV0IGFuIGVycm9yIGlmIHN0ZG91dCBpcyBlbXB0eVxuICAgICAgICByZXR1cm4gdGV4dCBpZiBzdGRvdXQubGVuZ3RoID09IDBcblxuICAgICAgICByZXN1bHQgPSBzdGRvdXQuc3BsaXQoXCI9PT09PT09PT09PT09PT09PT09PVxcblwiKVxuICAgICAgICByZXN1bHQgPSBzdGRvdXQuc3BsaXQoXCI9PT09PT09PT09PT09PT09PT09PVxcclxcblwiKSBpZiByZXN1bHQubGVuZ3RoID09IDFcblxuICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdXG4gICAgICApXG4gICAgKVxuIl19

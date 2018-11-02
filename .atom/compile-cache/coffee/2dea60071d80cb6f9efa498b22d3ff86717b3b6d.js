
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJvY29wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx5QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUNyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sY0FBQSxHQUFnQjs7c0JBRWhCLE9BQUEsR0FBUztNQUNQLElBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsWUFBQSxFQUFjLElBRGQ7T0FGSzs7O3NCQU1ULFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFNBRFI7UUFFRSxHQUFBLEVBQUssU0FGUDtRQUdFLFFBQUEsRUFBVSxnQ0FIWjtRQUlFLFlBQUEsRUFBYyx1REFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsaUJBQVgsQ0FBOEIsQ0FBQSxDQUFBO1VBQXhDLENBREE7U0FMWDtPQURXOzs7c0JBWWIsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxRQUFSLElBQW9CO01BQy9CLE1BQStCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUEvQixFQUFDLG9CQUFELEVBQWM7TUFHZCxJQUFHLE9BQU8sQ0FBQyxZQUFYO1FBQ0UsSUFBQyxDQUFBLDRCQUFELENBQThCLFNBQTlCLEVBQXlDLG9DQUF6QyxFQUErRSxNQUEvRSxFQURGOzthQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3FCLE9BQU8sQ0FBQyxZQUF4QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLFlBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsQ0FGVyxDQUFiLENBSUEsQ0FBQyxJQUpELENBSU0sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7QUFDSixjQUFBO1VBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxlQUFQLEVBQXdCLEtBQXhCO1VBRUEsV0FBQSxHQUFjLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBQyxDQUFEO21CQUFPLENBQUEsSUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQjtVQUFiLENBQVgsQ0FBQSxJQUErQztVQUM3RCxLQUFDLENBQUEsT0FBRCxDQUFTLGFBQVQsRUFBd0IsV0FBeEI7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0IsV0FBdEIsRUFBbUMsS0FBbkM7VUFHQSxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBVixFQUFrQyxjQUFsQztVQUNiLElBQUksa0JBQUo7WUFDRSxJQUFBLEdBQU8sT0FBQSxDQUFRLG1CQUFSO1lBQ1AsTUFBQSxHQUFTO2NBQ1Asd0JBQUEsRUFDRTtnQkFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLFdBQWpCO2VBRks7O1lBSVQsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLENBQTVCLEVBTmY7O1VBUUEsZ0JBQUEsR0FBbUIsQ0FDakIsZ0JBRGlCLEVBRWpCLG1CQUZpQixFQUdqQixTQUhpQixFQUdOLGtCQUhNO1VBS25CLFVBQUEsR0FBYTtZQUNYLGdCQUFBLEVBQWtCLElBRFA7WUFFWCxHQUFBLEVBQW9CLGtCQUFmLEdBQUEsV0FBQSxHQUFBLE1BRk07WUFHWCxPQUFBLEVBQVMsU0FBQyxLQUFEO3FCQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtZQUFYLENBSEU7O1VBS2IsSUFBaUQsa0JBQWpEO1lBQUEsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsVUFBdEIsRUFBa0MsVUFBbEMsRUFBQTs7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLG1CQUFQLEVBQTRCLGdCQUE1QjtpQkFFQSxDQUFJLE9BQU8sQ0FBQyxZQUFYLEdBQ0MsS0FBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLGdCQUFsQixFQUFvQyxVQUFwQyxDQURELEdBRUMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLENBQWUsQ0FBQyxHQUFoQixDQUFvQixnQkFBcEIsRUFBc0MsVUFBdEMsQ0FGRixDQUdDLENBQUMsSUFIRixDQUdPLFNBQUMsTUFBRDtBQUNMLGdCQUFBO1lBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxFQUF5QixNQUF6QjtZQUVBLElBQWUsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBaEM7QUFBQSxxQkFBTyxLQUFQOztZQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsS0FBUCxDQUFhLHdCQUFiO1lBQ1QsSUFBcUQsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBdEU7Y0FBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLEtBQVAsQ0FBYSwwQkFBYixFQUFUOzttQkFFQSxNQUFPLENBQUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBaEI7VUFSRixDQUhQO1FBOUJJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpOO0lBVFE7Ozs7S0F2QjJCO0FBUnZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1Ym9jb3AgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUnVib2NvcFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JiYXRzb3YvcnVib2NvcFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBSdWJ5OlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIHJ1Ym9jb3BfcGF0aDogdHJ1ZVxuICB9XG5cbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlJ1Ym9jb3BcIlxuICAgICAgY21kOiBcInJ1Ym9jb3BcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3J1Ym9jb3AucmVhZHRoZWRvY3MuaW8vXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vcnVib2NvcC5yZWFkdGhlZG9jcy5pby9lbi9sYXRlc3QvaW5zdGFsbGF0aW9uL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgZnVsbFBhdGggPSBjb250ZXh0LmZpbGVQYXRoIG9yIFwiXCJcbiAgICBbcHJvamVjdFBhdGgsIF9yZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZ1bGxQYXRoKVxuXG4gICAgIyBEZXByZWNhdGUgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICBpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgICAgQGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGUoXCJSdWJvY29wXCIsIFwiUnVieSAtIFJ1Ym9jb3AgUGF0aCAocnVib2NvcF9wYXRoKVwiLCBcIlBhdGhcIilcblxuICAgICMgRmluZCB0aGUgcnVib2NvcCBwYXRoXG4gICAgQFByb21pc2UuYWxsKFtcbiAgICAgIEB3aGljaChvcHRpb25zLnJ1Ym9jb3BfcGF0aCkgaWYgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICAgIEB3aGljaCgncnVib2NvcCcpXG4gICAgXSlcbiAgICAudGhlbigocGF0aHMpID0+XG4gICAgICBAZGVidWcoJ3J1Ym9jb3AgcGF0aHMnLCBwYXRocylcbiAgICAgICMgR2V0IGZpcnN0IHZhbGlkLCBhYnNvbHV0ZSBwYXRoXG4gICAgICBydWJvY29wUGF0aCA9IHBhdGhzLmZpbmQoKHApIC0+IHAgYW5kIHBhdGguaXNBYnNvbHV0ZShwKSkgb3IgXCJydWJvY29wXCJcbiAgICAgIEB2ZXJib3NlKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoKVxuICAgICAgQGRlYnVnKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoLCBwYXRocylcblxuICAgICAgIyBGaW5kIG9yIGdlbmVyYXRlIGEgY29uZmlnIGZpbGUgaWYgbm9uIGV4aXN0c1xuICAgICAgY29uZmlnRmlsZSA9IEBmaW5kRmlsZShwYXRoLmRpcm5hbWUoZnVsbFBhdGgpLCBcIi5ydWJvY29wLnltbFwiKVxuICAgICAgaWYgIWNvbmZpZ0ZpbGU/XG4gICAgICAgIHlhbWwgPSByZXF1aXJlKFwieWFtbC1mcm9udC1tYXR0ZXJcIilcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgIFwiU3R5bGUvSW5kZW50YXRpb25XaWR0aFwiOlxuICAgICAgICAgICAgXCJXaWR0aFwiOiBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgIH1cbiAgICAgICAgdGVtcENvbmZpZyA9IEB0ZW1wRmlsZShcInJ1Ym9jb3AtY29uZmlnXCIsIHlhbWwuc2FmZUR1bXAoY29uZmlnKSlcblxuICAgICAgcnVib2NvcEFyZ3VtZW50cyA9IFtcbiAgICAgICAgXCItLWF1dG8tY29ycmVjdFwiXG4gICAgICAgIFwiLS1mb3JjZS1leGNsdXNpb25cIlxuICAgICAgICBcIi0tc3RkaW5cIiwgXCJhdG9tLWJlYXV0aWZ5LnJiXCIgIyBmaWxlbmFtZSBpcyByZXF1aXJlZCBidXQgbm90IHVzZWRcbiAgICAgIF1cbiAgICAgIGV4ZU9wdGlvbnMgPSB7XG4gICAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWUsXG4gICAgICAgIGN3ZDogcHJvamVjdFBhdGggaWYgY29uZmlnRmlsZT8sXG4gICAgICAgIG9uU3RkaW46IChzdGRpbikgLT4gc3RkaW4uZW5kIHRleHRcbiAgICAgIH1cbiAgICAgIHJ1Ym9jb3BBcmd1bWVudHMucHVzaChcIi0tY29uZmlnXCIsIHRlbXBDb25maWcpIGlmIHRlbXBDb25maWc/XG4gICAgICBAZGVidWcoXCJydWJvY29wIGFyZ3VtZW50c1wiLCBydWJvY29wQXJndW1lbnRzKVxuXG4gICAgICAoaWYgb3B0aW9ucy5ydWJvY29wX3BhdGggdGhlbiBcXFxuICAgICAgICBAcnVuKHJ1Ym9jb3BQYXRoLCBydWJvY29wQXJndW1lbnRzLCBleGVPcHRpb25zKSBlbHNlIFxcXG4gICAgICAgIEBleGUoXCJydWJvY29wXCIpLnJ1bihydWJvY29wQXJndW1lbnRzLCBleGVPcHRpb25zKVxuICAgICAgKS50aGVuKChzdGRvdXQpID0+XG4gICAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3Agb3V0cHV0XCIsIHN0ZG91dClcbiAgICAgICAgIyBSdWJvY29wIG91dHB1dCBhbiBlcnJvciBpZiBzdGRvdXQgaXMgZW1wdHlcbiAgICAgICAgcmV0dXJuIHRleHQgaWYgc3Rkb3V0Lmxlbmd0aCA9PSAwXG5cbiAgICAgICAgcmVzdWx0ID0gc3Rkb3V0LnNwbGl0KFwiPT09PT09PT09PT09PT09PT09PT1cXG5cIilcbiAgICAgICAgcmVzdWx0ID0gc3Rkb3V0LnNwbGl0KFwiPT09PT09PT09PT09PT09PT09PT1cXHJcXG5cIikgaWYgcmVzdWx0Lmxlbmd0aCA9PSAxXG5cbiAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXVxuICAgICAgKVxuICAgIClcbiJdfQ==

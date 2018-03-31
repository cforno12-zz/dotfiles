
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

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

    Rubocop.prototype.beautify = function(text, language, options) {
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var _, config, configFile, fs, path, rubocopPath, tempFile, yaml;
          _this.debug('rubocop paths', paths);
          _ = require('lodash');
          path = require('path');
          rubocopPath = _.find(paths, function(p) {
            return p && path.isAbsolute(p);
          });
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
          fs = require('fs');
          if (fs.existsSync(configFile)) {
            _this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
          } else {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            configFile = _this.tempFile("rubocop-config", yaml.safeDump(config));
            _this.debug("rubocop", config, configFile);
          }
          if (rubocopPath != null) {
            return _this.run(rubocopPath, ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text, '.rb')], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text, '.rb')], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJvY29wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFDTixjQUFBLEdBQWdCOztzQkFFaEIsT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxZQUFBLEVBQWMsSUFEZDtPQUZLOzs7c0JBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNxQixPQUFPLENBQUMsWUFBeEMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8sQ0FBQyxZQUFmLENBQUEsR0FBQSxNQURXLEVBRVgsSUFBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLENBRlcsQ0FBYixDQUdFLENBQUMsSUFISCxDQUdRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO0FBQ04sY0FBQTtVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZUFBUCxFQUF3QixLQUF4QjtVQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjtVQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtVQUVQLFdBQUEsR0FBYyxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxTQUFDLENBQUQ7bUJBQU8sQ0FBQSxJQUFNLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCO1VBQWIsQ0FBZDtVQUNkLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUF3QixXQUF4QjtVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUFzQixXQUF0QixFQUFtQyxLQUFuQztVQUVBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxjQUF0QztVQUViLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjtVQUVMLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQUg7WUFDRSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsRUFBa0IsTUFBbEIsRUFBMEIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsVUFBaEIsRUFBNEIsTUFBNUIsQ0FBMUIsRUFERjtXQUFBLE1BQUE7WUFHRSxJQUFBLEdBQU8sT0FBQSxDQUFRLG1CQUFSO1lBRVAsTUFBQSxHQUFTO2NBQ1Asd0JBQUEsRUFDRTtnQkFBQSxPQUFBLEVBQVMsT0FBTyxDQUFDLFdBQWpCO2VBRks7O1lBS1QsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLENBQTVCO1lBQ2IsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLEVBQWtCLE1BQWxCLEVBQTBCLFVBQTFCLEVBWEY7O1VBY0EsSUFBRyxtQkFBSDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDaEIsZ0JBRGdCLEVBRWhCLFVBRmdCLEVBRUosVUFGSSxFQUdoQixRQUFBLEdBQVcsS0FBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLElBQWxCLEVBQXdCLEtBQXhCLENBSEssQ0FBbEIsRUFJSztjQUFDLGdCQUFBLEVBQWtCLElBQW5CO2FBSkwsQ0FLRSxDQUFDLElBTEgsQ0FLUSxTQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtZQURJLENBTFIsRUFERjtXQUFBLE1BQUE7bUJBVUUsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLEVBQWdCLENBQ2QsZ0JBRGMsRUFFZCxVQUZjLEVBRUYsVUFGRSxFQUdkLFFBQUEsR0FBVyxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0IsS0FBeEIsQ0FIRyxDQUFoQixFQUlLO2NBQUMsZ0JBQUEsRUFBa0IsSUFBbkI7YUFKTCxDQUtFLENBQUMsSUFMSCxDQUtRLFNBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1lBREksQ0FMUixFQVZGOztRQTNCTTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUjtJQURROzs7O0tBWDJCO0FBUHZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1Ym9jb3AgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiUnVib2NvcFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JiYXRzb3YvcnVib2NvcFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBSdWJ5OlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIHJ1Ym9jb3BfcGF0aDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAUHJvbWlzZS5hbGwoW1xuICAgICAgQHdoaWNoKG9wdGlvbnMucnVib2NvcF9wYXRoKSBpZiBvcHRpb25zLnJ1Ym9jb3BfcGF0aFxuICAgICAgQHdoaWNoKCdydWJvY29wJylcbiAgICBdKS50aGVuKChwYXRocykgPT5cbiAgICAgIEBkZWJ1ZygncnVib2NvcCBwYXRocycsIHBhdGhzKVxuICAgICAgXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbiAgICAgIHBhdGggPSByZXF1aXJlICdwYXRoJ1xuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIHJ1Ym9jb3BQYXRoID0gXy5maW5kKHBhdGhzLCAocCkgLT4gcCBhbmQgcGF0aC5pc0Fic29sdXRlKHApIClcbiAgICAgIEB2ZXJib3NlKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoKVxuICAgICAgQGRlYnVnKCdydWJvY29wUGF0aCcsIHJ1Ym9jb3BQYXRoLCBwYXRocylcblxuICAgICAgY29uZmlnRmlsZSA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgXCIucnVib2NvcC55bWxcIilcblxuICAgICAgZnMgPSByZXF1aXJlICdmcydcblxuICAgICAgaWYgZnMuZXhpc3RzU3luYyhjb25maWdGaWxlKVxuICAgICAgICBAZGVidWcoXCJydWJvY29wXCIsIGNvbmZpZywgZnMucmVhZEZpbGVTeW5jKGNvbmZpZ0ZpbGUsICd1dGY4JykpXG4gICAgICBlbHNlXG4gICAgICAgIHlhbWwgPSByZXF1aXJlKFwieWFtbC1mcm9udC1tYXR0ZXJcIilcbiAgICAgICAgIyBHZW5lcmF0ZSBjb25maWcgZmlsZVxuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgXCJTdHlsZS9JbmRlbnRhdGlvbldpZHRoXCI6XG4gICAgICAgICAgICBcIldpZHRoXCI6IG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0ZpbGUgPSBAdGVtcEZpbGUoXCJydWJvY29wLWNvbmZpZ1wiLCB5YW1sLnNhZmVEdW1wKGNvbmZpZykpXG4gICAgICAgIEBkZWJ1ZyhcInJ1Ym9jb3BcIiwgY29uZmlnLCBjb25maWdGaWxlKVxuXG4gICAgICAjIENoZWNrIGlmIFBIUC1DUy1GaXhlciBwYXRoIHdhcyBmb3VuZFxuICAgICAgaWYgcnVib2NvcFBhdGg/XG4gICAgICAgIEBydW4ocnVib2NvcFBhdGgsIFtcbiAgICAgICAgICBcIi0tYXV0by1jb3JyZWN0XCJcbiAgICAgICAgICBcIi0tY29uZmlnXCIsIGNvbmZpZ0ZpbGVcbiAgICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dCwgJy5yYicpXG4gICAgICAgICAgXSwge2lnbm9yZVJldHVybkNvZGU6IHRydWV9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBAcnVuKFwicnVib2NvcFwiLCBbXG4gICAgICAgICAgXCItLWF1dG8tY29ycmVjdFwiXG4gICAgICAgICAgXCItLWNvbmZpZ1wiLCBjb25maWdGaWxlXG4gICAgICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQsICcucmInKVxuICAgICAgICAgIF0sIHtpZ25vcmVSZXR1cm5Db2RlOiB0cnVlfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbilcbiJdfQ==

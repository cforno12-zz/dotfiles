
/*
Requires https://github.com/FriendsOfPHP/phpcbf
 */

(function() {
  "use strict";
  var Beautifier, PHPCBF,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PHPCBF = (function(superClass) {
    extend(PHPCBF, superClass);

    function PHPCBF() {
      return PHPCBF.__super__.constructor.apply(this, arguments);
    }

    PHPCBF.prototype.name = "PHPCBF";

    PHPCBF.prototype.link = "http://php.net/manual/en/install.php";

    PHPCBF.prototype.executables = [
      {
        name: "PHP",
        cmd: "php",
        homepage: "http://php.net/",
        installation: "http://php.net/manual/en/install.php",
        version: {
          parse: function(text) {
            return text.match(/PHP (\d+\.\d+\.\d+)/)[1];
          }
        }
      }, {
        name: "PHPCBF",
        cmd: "phpcbf",
        homepage: "https://github.com/squizlabs/PHP_CodeSniffer",
        installation: "https://github.com/squizlabs/PHP_CodeSniffer#installation",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/phpcbf"
        }
      }
    ];

    PHPCBF.prototype.options = {
      PHP: {
        phpcbf_path: true,
        phpcbf_version: true,
        standard: true
      }
    };

    PHPCBF.prototype.beautify = function(text, language, options) {
      var php, phpcbf, standardFile, standardFiles;
      this.debug('phpcbf', options);
      standardFiles = ['phpcs.xml', 'phpcs.xml.dist', 'phpcs.ruleset.xml', 'ruleset.xml'];
      standardFile = this.findFile(atom.project.getPaths()[0], standardFiles);
      if (standardFile) {
        options.standard = standardFile;
      }
      php = this.exe('php');
      phpcbf = this.exe('phpcbf');
      if (options.phpcbf_path) {
        this.deprecateOptionForExecutable("PHPCBF", "PHP - PHPCBF Path (phpcbf_path)", "Path");
      }
      return this.Promise.all([options.phpcbf_path ? this.which(options.phpcbf_path) : void 0, phpcbf.path(), this.tempFile("temp", text, ".php")]).then((function(_this) {
        return function(arg) {
          var customPhpcbfPath, finalPhpcbfPath, isPhpScript, isVersion3, phpcbfPath, tempFile;
          customPhpcbfPath = arg[0], phpcbfPath = arg[1], tempFile = arg[2];
          finalPhpcbfPath = customPhpcbfPath && path.isAbsolute(customPhpcbfPath) ? customPhpcbfPath : phpcbfPath;
          _this.verbose('finalPhpcbfPath', finalPhpcbfPath, phpcbfPath, customPhpcbfPath);
          isVersion3 = (phpcbf.isInstalled && phpcbf.isVersion('3.x')) || (options.phpcbf_version && phpcbf.versionSatisfies(options.phpcbf_version + ".0.0", '3.x'));
          isPhpScript = (finalPhpcbfPath.indexOf(".phar") !== -1) || (finalPhpcbfPath.indexOf(".php") !== -1);
          _this.verbose('isPhpScript', isPhpScript);
          if (isPhpScript) {
            return php.run([phpcbfPath, !isVersion3 ? "--no-patch" : void 0, options.standard ? "--standard=" + options.standard : void 0, tempFile], {
              ignoreReturnCode: true,
              onStdin: function(stdin) {
                return stdin.end();
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return phpcbf.run([!isVersion3 ? "--no-patch" : void 0, options.standard ? "--standard=" + options.standard : void 0, tempFile = _this.tempFile("temp", text, ".php")], {
              ignoreReturnCode: true,
              onStdin: function(stdin) {
                return stdin.end();
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return PHPCBF;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9waHBjYmYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGtCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztxQkFDckIsSUFBQSxHQUFNOztxQkFDTixJQUFBLEdBQU07O3FCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLEtBRFI7UUFFRSxHQUFBLEVBQUssS0FGUDtRQUdFLFFBQUEsRUFBVSxpQkFIWjtRQUlFLFlBQUEsRUFBYyxzQ0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcscUJBQVgsQ0FBa0MsQ0FBQSxDQUFBO1VBQTVDLENBREE7U0FMWDtPQURXLEVBVVg7UUFDRSxJQUFBLEVBQU0sUUFEUjtRQUVFLEdBQUEsRUFBSyxRQUZQO1FBR0UsUUFBQSxFQUFVLDhDQUhaO1FBSUUsWUFBQSxFQUFjLDJEQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx5QkFBWCxDQUFzQyxDQUFBLENBQUE7VUFBaEQsQ0FEQTtTQUxYO1FBUUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLG9CQUREO1NBUlY7T0FWVzs7O3FCQXdCYixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLGNBQUEsRUFBZ0IsSUFEaEI7UUFFQSxRQUFBLEVBQVUsSUFGVjtPQUZLOzs7cUJBT1QsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxRQUFQLEVBQWlCLE9BQWpCO01BQ0EsYUFBQSxHQUFnQixDQUFDLFdBQUQsRUFBYyxnQkFBZCxFQUFnQyxtQkFBaEMsRUFBcUQsYUFBckQ7TUFDaEIsWUFBQSxHQUFlLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLGFBQXRDO01BRWYsSUFBbUMsWUFBbkM7UUFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixhQUFuQjs7TUFFQSxHQUFBLEdBQU0sSUFBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMO01BQ04sTUFBQSxHQUFTLElBQUMsQ0FBQSxHQUFELENBQUssUUFBTDtNQUVULElBQUcsT0FBTyxDQUFDLFdBQVg7UUFDRSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsUUFBOUIsRUFBd0MsaUNBQXhDLEVBQTJFLE1BQTNFLEVBREY7O2FBSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsQ0FDb0IsT0FBTyxDQUFDLFdBQXZDLEdBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFPLENBQUMsV0FBZixDQUFBLEdBQUEsTUFEVyxFQUVYLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FGVyxFQUdYLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QixNQUF4QixDQUhXLENBQWIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUVOLGNBQUE7VUFGUSwyQkFBa0IscUJBQVk7VUFFdEMsZUFBQSxHQUFxQixnQkFBQSxJQUFxQixJQUFJLENBQUMsVUFBTCxDQUFnQixnQkFBaEIsQ0FBeEIsR0FDaEIsZ0JBRGdCLEdBQ007VUFDeEIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxpQkFBVCxFQUE0QixlQUE1QixFQUE2QyxVQUE3QyxFQUF5RCxnQkFBekQ7VUFFQSxVQUFBLEdBQWMsQ0FBQyxNQUFNLENBQUMsV0FBUCxJQUF1QixNQUFNLENBQUMsU0FBUCxDQUFpQixLQUFqQixDQUF4QixDQUFBLElBQ1osQ0FBQyxPQUFPLENBQUMsY0FBUixJQUEyQixNQUFNLENBQUMsZ0JBQVAsQ0FBMkIsT0FBTyxDQUFDLGNBQVQsR0FBd0IsTUFBbEQsRUFBeUQsS0FBekQsQ0FBNUI7VUFFRixXQUFBLEdBQWMsQ0FBQyxlQUFlLENBQUMsT0FBaEIsQ0FBd0IsT0FBeEIsQ0FBQSxLQUFzQyxDQUFDLENBQXhDLENBQUEsSUFBOEMsQ0FBQyxlQUFlLENBQUMsT0FBaEIsQ0FBd0IsTUFBeEIsQ0FBQSxLQUFxQyxDQUFDLENBQXZDO1VBQzVELEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUF3QixXQUF4QjtVQUVBLElBQUcsV0FBSDttQkFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQ04sVUFETSxFQUVOLENBQW9CLFVBQXBCLEdBQUEsWUFBQSxHQUFBLE1BRk0sRUFHOEIsT0FBTyxDQUFDLFFBQTVDLEdBQUEsYUFBQSxHQUFjLE9BQU8sQ0FBQyxRQUF0QixHQUFBLE1BSE0sRUFJTixRQUpNLENBQVIsRUFLSztjQUNELGdCQUFBLEVBQWtCLElBRGpCO2NBRUQsT0FBQSxFQUFTLFNBQUMsS0FBRDt1QkFDUCxLQUFLLENBQUMsR0FBTixDQUFBO2NBRE8sQ0FGUjthQUxMLENBVUUsQ0FBQyxJQVZILENBVVEsU0FBQTtxQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7WUFESSxDQVZSLEVBREY7V0FBQSxNQUFBO21CQWVFLE1BQU0sQ0FBQyxHQUFQLENBQVcsQ0FDVCxDQUFvQixVQUFwQixHQUFBLFlBQUEsR0FBQSxNQURTLEVBRTJCLE9BQU8sQ0FBQyxRQUE1QyxHQUFBLGFBQUEsR0FBYyxPQUFPLENBQUMsUUFBdEIsR0FBQSxNQUZTLEVBR1QsUUFBQSxHQUFXLEtBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QixNQUF4QixDQUhGLENBQVgsRUFJSztjQUNELGdCQUFBLEVBQWtCLElBRGpCO2NBRUQsT0FBQSxFQUFTLFNBQUMsS0FBRDt1QkFDUCxLQUFLLENBQUMsR0FBTixDQUFBO2NBRE8sQ0FGUjthQUpMLENBU0UsQ0FBQyxJQVRILENBU1EsU0FBQTtxQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7WUFESSxDQVRSLEVBZkY7O1FBWk07TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlI7SUFkUTs7OztLQWxDMEI7QUFQdEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmllbmRzT2ZQSFAvcGhwY2JmXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBIUENCRiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQSFBDQkZcIlxuICBsaW5rOiBcImh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9pbnN0YWxsLnBocFwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJQSFBcIlxuICAgICAgY21kOiBcInBocFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vcGhwLm5ldC9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9pbnN0YWxsLnBocFwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvUEhQIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICB9XG4gICAge1xuICAgICAgbmFtZTogXCJQSFBDQkZcIlxuICAgICAgY21kOiBcInBocGNiZlwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vc3F1aXpsYWJzL1BIUF9Db2RlU25pZmZlclwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL3NxdWl6bGFicy9QSFBfQ29kZVNuaWZmZXIjaW5zdGFsbGF0aW9uXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC92ZXJzaW9uIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9waHBjYmZcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQSFA6XG4gICAgICBwaHBjYmZfcGF0aDogdHJ1ZVxuICAgICAgcGhwY2JmX3ZlcnNpb246IHRydWVcbiAgICAgIHN0YW5kYXJkOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZygncGhwY2JmJywgb3B0aW9ucylcbiAgICBzdGFuZGFyZEZpbGVzID0gWydwaHBjcy54bWwnLCAncGhwY3MueG1sLmRpc3QnLCAncGhwY3MucnVsZXNldC54bWwnLCAncnVsZXNldC54bWwnXVxuICAgIHN0YW5kYXJkRmlsZSA9IEBmaW5kRmlsZShhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgc3RhbmRhcmRGaWxlcylcblxuICAgIG9wdGlvbnMuc3RhbmRhcmQgPSBzdGFuZGFyZEZpbGUgaWYgc3RhbmRhcmRGaWxlXG5cbiAgICBwaHAgPSBAZXhlKCdwaHAnKVxuICAgIHBocGNiZiA9IEBleGUoJ3BocGNiZicpXG5cbiAgICBpZiBvcHRpb25zLnBocGNiZl9wYXRoXG4gICAgICBAZGVwcmVjYXRlT3B0aW9uRm9yRXhlY3V0YWJsZShcIlBIUENCRlwiLCBcIlBIUCAtIFBIUENCRiBQYXRoIChwaHBjYmZfcGF0aClcIiwgXCJQYXRoXCIpXG5cbiAgICAjIEZpbmQgcGhwY2JmLnBoYXIgc2NyaXB0XG4gICAgQFByb21pc2UuYWxsKFtcbiAgICAgIEB3aGljaChvcHRpb25zLnBocGNiZl9wYXRoKSBpZiBvcHRpb25zLnBocGNiZl9wYXRoXG4gICAgICBwaHBjYmYucGF0aCgpXG4gICAgICBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQsIFwiLnBocFwiKVxuICAgIF0pLnRoZW4oKFtjdXN0b21QaHBjYmZQYXRoLCBwaHBjYmZQYXRoLCB0ZW1wRmlsZV0pID0+XG4gICAgICAjIEdldCBmaXJzdCB2YWxpZCwgYWJzb2x1dGUgcGF0aFxuICAgICAgZmluYWxQaHBjYmZQYXRoID0gaWYgY3VzdG9tUGhwY2JmUGF0aCBhbmQgcGF0aC5pc0Fic29sdXRlKGN1c3RvbVBocGNiZlBhdGgpIHRoZW4gXFxcbiAgICAgICAgY3VzdG9tUGhwY2JmUGF0aCBlbHNlIHBocGNiZlBhdGhcbiAgICAgIEB2ZXJib3NlKCdmaW5hbFBocGNiZlBhdGgnLCBmaW5hbFBocGNiZlBhdGgsIHBocGNiZlBhdGgsIGN1c3RvbVBocGNiZlBhdGgpXG5cbiAgICAgIGlzVmVyc2lvbjMgPSAoKHBocGNiZi5pc0luc3RhbGxlZCBhbmQgcGhwY2JmLmlzVmVyc2lvbignMy54JykpIG9yIFxcXG4gICAgICAgIChvcHRpb25zLnBocGNiZl92ZXJzaW9uIGFuZCBwaHBjYmYudmVyc2lvblNhdGlzZmllcyhcIiN7b3B0aW9ucy5waHBjYmZfdmVyc2lvbn0uMC4wXCIsICczLngnKSkpXG5cbiAgICAgIGlzUGhwU2NyaXB0ID0gKGZpbmFsUGhwY2JmUGF0aC5pbmRleE9mKFwiLnBoYXJcIikgaXNudCAtMSkgb3IgKGZpbmFsUGhwY2JmUGF0aC5pbmRleE9mKFwiLnBocFwiKSBpc250IC0xKVxuICAgICAgQHZlcmJvc2UoJ2lzUGhwU2NyaXB0JywgaXNQaHBTY3JpcHQpXG5cbiAgICAgIGlmIGlzUGhwU2NyaXB0XG4gICAgICAgIHBocC5ydW4oW1xuICAgICAgICAgIHBocGNiZlBhdGgsXG4gICAgICAgICAgXCItLW5vLXBhdGNoXCIgdW5sZXNzIGlzVmVyc2lvbjNcbiAgICAgICAgICBcIi0tc3RhbmRhcmQ9I3tvcHRpb25zLnN0YW5kYXJkfVwiIGlmIG9wdGlvbnMuc3RhbmRhcmRcbiAgICAgICAgICB0ZW1wRmlsZVxuICAgICAgICAgIF0sIHtcbiAgICAgICAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWVcbiAgICAgICAgICAgIG9uU3RkaW46IChzdGRpbikgLT5cbiAgICAgICAgICAgICAgc3RkaW4uZW5kKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBwaHBjYmYucnVuKFtcbiAgICAgICAgICBcIi0tbm8tcGF0Y2hcIiB1bmxlc3MgaXNWZXJzaW9uM1xuICAgICAgICAgIFwiLS1zdGFuZGFyZD0je29wdGlvbnMuc3RhbmRhcmR9XCIgaWYgb3B0aW9ucy5zdGFuZGFyZFxuICAgICAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0LCBcIi5waHBcIilcbiAgICAgICAgICBdLCB7XG4gICAgICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgICAgICBvblN0ZGluOiAoc3RkaW4pIC0+XG4gICAgICAgICAgICAgIHN0ZGluLmVuZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgIClcbiJdfQ==

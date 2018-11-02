
/*
Requires https://github.com/FriendsOfPHP/phpcbf
 */

(function() {
  "use strict";
  var Beautifier, PHPCBF, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

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
        optional: true,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9waHBjYmYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLHdCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7cUJBQ3JCLElBQUEsR0FBTTs7cUJBQ04sSUFBQSxHQUFNOztxQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxLQURSO1FBRUUsR0FBQSxFQUFLLEtBRlA7UUFHRSxRQUFBLEVBQVUsaUJBSFo7UUFJRSxZQUFBLEVBQWMsc0NBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHFCQUFYLENBQWtDLENBQUEsQ0FBQTtVQUE1QyxDQURBO1NBTFg7T0FEVyxFQVVYO1FBQ0UsSUFBQSxFQUFNLFFBRFI7UUFFRSxHQUFBLEVBQUssUUFGUDtRQUdFLFFBQUEsRUFBVSw4Q0FIWjtRQUlFLFlBQUEsRUFBYywyREFKaEI7UUFLRSxRQUFBLEVBQVUsSUFMWjtRQU1FLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx5QkFBWCxDQUFzQyxDQUFBLENBQUE7VUFBaEQsQ0FEQTtTQU5YO1FBU0UsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLG9CQUREO1NBVFY7T0FWVzs7O3FCQXlCYixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLGNBQUEsRUFBZ0IsSUFEaEI7UUFFQSxRQUFBLEVBQVUsSUFGVjtP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QixNQUF4QixDQUhGLENBQVgsRUFJSztjQUNELGdCQUFBLEVBQWtCLElBRGpCO2NBRUQsT0FBQSxFQUFTLFNBQUMsS0FBRDt1QkFDUCxLQUFLLENBQUMsR0FBTixDQUFBO2NBRE8sQ0FGUjthQUpMLENBU0UsQ0FBQyxJQVRILENBU1EsU0FBQTtxQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7WUFESSxDQVRSLEVBZkY7O1FBWk07TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlI7SUFkUTs7OztLQW5DMEI7QUFSdEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmllbmRzT2ZQSFAvcGhwY2JmXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBIUENCRiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQSFBDQkZcIlxuICBsaW5rOiBcImh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9pbnN0YWxsLnBocFwiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJQSFBcIlxuICAgICAgY21kOiBcInBocFwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vcGhwLm5ldC9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9pbnN0YWxsLnBocFwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvUEhQIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICB9XG4gICAge1xuICAgICAgbmFtZTogXCJQSFBDQkZcIlxuICAgICAgY21kOiBcInBocGNiZlwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vc3F1aXpsYWJzL1BIUF9Db2RlU25pZmZlclwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL3NxdWl6bGFicy9QSFBfQ29kZVNuaWZmZXIjaW5zdGFsbGF0aW9uXCJcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgICBkb2NrZXI6IHtcbiAgICAgICAgaW1hZ2U6IFwidW5pYmVhdXRpZnkvcGhwY2JmXCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgUEhQOlxuICAgICAgcGhwY2JmX3BhdGg6IHRydWVcbiAgICAgIHBocGNiZl92ZXJzaW9uOiB0cnVlXG4gICAgICBzdGFuZGFyZDogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZGVidWcoJ3BocGNiZicsIG9wdGlvbnMpXG4gICAgc3RhbmRhcmRGaWxlcyA9IFsncGhwY3MueG1sJywgJ3BocGNzLnhtbC5kaXN0JywgJ3BocGNzLnJ1bGVzZXQueG1sJywgJ3J1bGVzZXQueG1sJ11cbiAgICBzdGFuZGFyZEZpbGUgPSBAZmluZEZpbGUoYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sIHN0YW5kYXJkRmlsZXMpXG5cbiAgICBvcHRpb25zLnN0YW5kYXJkID0gc3RhbmRhcmRGaWxlIGlmIHN0YW5kYXJkRmlsZVxuXG4gICAgcGhwID0gQGV4ZSgncGhwJylcbiAgICBwaHBjYmYgPSBAZXhlKCdwaHBjYmYnKVxuXG4gICAgaWYgb3B0aW9ucy5waHBjYmZfcGF0aFxuICAgICAgQGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGUoXCJQSFBDQkZcIiwgXCJQSFAgLSBQSFBDQkYgUGF0aCAocGhwY2JmX3BhdGgpXCIsIFwiUGF0aFwiKVxuXG4gICAgIyBGaW5kIHBocGNiZi5waGFyIHNjcmlwdFxuICAgIEBQcm9taXNlLmFsbChbXG4gICAgICBAd2hpY2gob3B0aW9ucy5waHBjYmZfcGF0aCkgaWYgb3B0aW9ucy5waHBjYmZfcGF0aFxuICAgICAgcGhwY2JmLnBhdGgoKVxuICAgICAgQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0LCBcIi5waHBcIilcbiAgICBdKS50aGVuKChbY3VzdG9tUGhwY2JmUGF0aCwgcGhwY2JmUGF0aCwgdGVtcEZpbGVdKSA9PlxuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIGZpbmFsUGhwY2JmUGF0aCA9IGlmIGN1c3RvbVBocGNiZlBhdGggYW5kIHBhdGguaXNBYnNvbHV0ZShjdXN0b21QaHBjYmZQYXRoKSB0aGVuIFxcXG4gICAgICAgIGN1c3RvbVBocGNiZlBhdGggZWxzZSBwaHBjYmZQYXRoXG4gICAgICBAdmVyYm9zZSgnZmluYWxQaHBjYmZQYXRoJywgZmluYWxQaHBjYmZQYXRoLCBwaHBjYmZQYXRoLCBjdXN0b21QaHBjYmZQYXRoKVxuXG4gICAgICBpc1ZlcnNpb24zID0gKChwaHBjYmYuaXNJbnN0YWxsZWQgYW5kIHBocGNiZi5pc1ZlcnNpb24oJzMueCcpKSBvciBcXFxuICAgICAgICAob3B0aW9ucy5waHBjYmZfdmVyc2lvbiBhbmQgcGhwY2JmLnZlcnNpb25TYXRpc2ZpZXMoXCIje29wdGlvbnMucGhwY2JmX3ZlcnNpb259LjAuMFwiLCAnMy54JykpKVxuXG4gICAgICBpc1BocFNjcmlwdCA9IChmaW5hbFBocGNiZlBhdGguaW5kZXhPZihcIi5waGFyXCIpIGlzbnQgLTEpIG9yIChmaW5hbFBocGNiZlBhdGguaW5kZXhPZihcIi5waHBcIikgaXNudCAtMSlcbiAgICAgIEB2ZXJib3NlKCdpc1BocFNjcmlwdCcsIGlzUGhwU2NyaXB0KVxuXG4gICAgICBpZiBpc1BocFNjcmlwdFxuICAgICAgICBwaHAucnVuKFtcbiAgICAgICAgICBwaHBjYmZQYXRoLFxuICAgICAgICAgIFwiLS1uby1wYXRjaFwiIHVubGVzcyBpc1ZlcnNpb24zXG4gICAgICAgICAgXCItLXN0YW5kYXJkPSN7b3B0aW9ucy5zdGFuZGFyZH1cIiBpZiBvcHRpb25zLnN0YW5kYXJkXG4gICAgICAgICAgdGVtcEZpbGVcbiAgICAgICAgICBdLCB7XG4gICAgICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgICAgICBvblN0ZGluOiAoc3RkaW4pIC0+XG4gICAgICAgICAgICAgIHN0ZGluLmVuZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgIGVsc2VcbiAgICAgICAgcGhwY2JmLnJ1bihbXG4gICAgICAgICAgXCItLW5vLXBhdGNoXCIgdW5sZXNzIGlzVmVyc2lvbjNcbiAgICAgICAgICBcIi0tc3RhbmRhcmQ9I3tvcHRpb25zLnN0YW5kYXJkfVwiIGlmIG9wdGlvbnMuc3RhbmRhcmRcbiAgICAgICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcInRlbXBcIiwgdGV4dCwgXCIucGhwXCIpXG4gICAgICAgICAgXSwge1xuICAgICAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZVxuICAgICAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICAgICAgICBzdGRpbi5lbmQoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgICApXG4gICAgICApXG4iXX0=

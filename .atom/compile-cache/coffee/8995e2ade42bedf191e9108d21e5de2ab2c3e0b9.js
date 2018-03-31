
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(superClass) {
    extend(FortranBeautifier, superClass);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.link = "https://www.gnu.org/software/emacs/";

    FortranBeautifier.prototype.executables = [
      {
        name: "Emacs",
        cmd: "emacs",
        homepage: "https://www.gnu.org/software/emacs/",
        installation: "https://www.gnu.org/software/emacs/",
        version: {
          parse: function(text) {
            return text.match(/Emacs (\d+\.\d+\.\d+)/)[1];
          }
        }
      }
    ];

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs = this.exe("emacs");
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        this.deprecateOptionForExecutable("Emacs", "emacs_path", "Path");
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return emacs.run(args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9mb3J0cmFuLWJlYXV0aWZpZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG1DQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7Z0NBQ3JCLElBQUEsR0FBTTs7Z0NBQ04sSUFBQSxHQUFNOztnQ0FDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxPQURSO1FBRUUsR0FBQSxFQUFLLE9BRlA7UUFHRSxRQUFBLEVBQVUscUNBSFo7UUFJRSxZQUFBLEVBQWMscUNBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHVCQUFYLENBQW9DLENBQUEsQ0FBQTtVQUE5QyxDQURBO1NBTFg7T0FEVzs7O2dDQVliLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxJQURGOzs7Z0NBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxFQUE2QixPQUE3QjtNQUNBLEtBQUEsR0FBUSxJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUw7TUFFUixVQUFBLEdBQWEsT0FBTyxDQUFDO01BQ3JCLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQztNQUU1QixJQUFHLENBQUksaUJBQVA7UUFDRSxpQkFBQSxHQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IscUNBQXhCLEVBRHRCOztNQUdBLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIscUJBQUEsR0FBd0IsaUJBQXJEO01BRUEsSUFBQSxHQUFPLENBQ0wsU0FESyxFQUVMLElBRkssRUFHTCxpQkFISyxFQUlMLElBSkssRUFLTCx5QkFMSyxFQU1MLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FOTjtNQVNQLElBQUcsVUFBSDtRQUNFLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixPQUE5QixFQUF1QyxZQUF2QyxFQUFxRCxNQUFyRDtlQUNBLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFpQixJQUFqQixFQUF1QjtVQUFDLGdCQUFBLEVBQWtCLEtBQW5CO1NBQXZCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7VUFESTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQUZGO09BQUEsTUFBQTtlQU9FLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixFQUFnQjtVQUFDLGdCQUFBLEVBQWtCLEtBQW5CO1NBQWhCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7VUFESTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQVBGOztJQXJCUTs7OztLQW5CcUM7QUFSakQiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEZvcnRyYW5CZWF1dGlmaWVyIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkZvcnRyYW4gQmVhdXRpZmllclwiXG4gIGxpbms6IFwiaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiRW1hY3NcIlxuICAgICAgY21kOiBcImVtYWNzXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvRW1hY3MgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBGb3J0cmFuOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZygnZm9ydHJhbi1iZWF1dGlmaWVyJywgb3B0aW9ucylcbiAgICBlbWFjcyA9IEBleGUoXCJlbWFjc1wiKVxuXG4gICAgZW1hY3NfcGF0aCA9IG9wdGlvbnMuZW1hY3NfcGF0aFxuICAgIGVtYWNzX3NjcmlwdF9wYXRoID0gb3B0aW9ucy5lbWFjc19zY3JpcHRfcGF0aFxuXG4gICAgaWYgbm90IGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICBlbWFjc19zY3JpcHRfcGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZW1hY3MtZm9ydHJhbi1mb3JtYXRpbmctc2NyaXB0Lmxpc3BcIilcblxuICAgIEBkZWJ1ZygnZm9ydHJhbi1iZWF1dGlmaWVyJywgJ2VtYWNzIHNjcmlwdCBwYXRoOiAnICsgZW1hY3Nfc2NyaXB0X3BhdGgpXG5cbiAgICBhcmdzID0gW1xuICAgICAgJy0tYmF0Y2gnXG4gICAgICAnLWwnXG4gICAgICBlbWFjc19zY3JpcHRfcGF0aFxuICAgICAgJy1mJ1xuICAgICAgJ2Y5MC1iYXRjaC1pbmRlbnQtcmVnaW9uJ1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICBdXG5cbiAgICBpZiBlbWFjc19wYXRoXG4gICAgICBAZGVwcmVjYXRlT3B0aW9uRm9yRXhlY3V0YWJsZShcIkVtYWNzXCIsIFwiZW1hY3NfcGF0aFwiLCBcIlBhdGhcIilcbiAgICAgIEBydW4oZW1hY3NfcGF0aCwgYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgIClcbiAgICBlbHNlXG4gICAgICBlbWFjcy5ydW4oYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgIClcbiJdfQ==

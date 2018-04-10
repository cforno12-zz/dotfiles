
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, VhdlBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = VhdlBeautifier = (function(superClass) {
    extend(VhdlBeautifier, superClass);

    function VhdlBeautifier() {
      return VhdlBeautifier.__super__.constructor.apply(this, arguments);
    }

    VhdlBeautifier.prototype.name = "VHDL Beautifier";

    VhdlBeautifier.prototype.link = "https://www.gnu.org/software/emacs/";

    VhdlBeautifier.prototype.executables = [
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

    VhdlBeautifier.prototype.options = {
      VHDL: {
        emacs_script_path: true
      }
    };

    VhdlBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs, emacs_script_path, tempFile;
      this.debug('vhdl-beautifier', options);
      emacs = this.exe("emacs");
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-vhdl-formating-script.lisp");
      }
      this.debug('vhdl-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'vhdl-batch-indent-region', tempFile = this.tempFile("temp", text)];
      return emacs.run(args, {
        ignoreReturnCode: false
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return VhdlBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy92aGRsLWJlYXV0aWZpZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGdDQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7NkJBQ3JCLElBQUEsR0FBTTs7NkJBQ04sSUFBQSxHQUFNOzs2QkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxPQURSO1FBRUUsR0FBQSxFQUFLLE9BRlA7UUFHRSxRQUFBLEVBQVUscUNBSFo7UUFJRSxZQUFBLEVBQWMscUNBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHVCQUFYLENBQW9DLENBQUEsQ0FBQTtVQUE5QyxDQURBO1NBTFg7T0FEVzs7OzZCQVliLE9BQUEsR0FBUztNQUNQLElBQUEsRUFBTTtRQUNKLGlCQUFBLEVBQW1CLElBRGY7T0FEQzs7OzZCQU1ULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8saUJBQVAsRUFBMEIsT0FBMUI7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMO01BRVIsaUJBQUEsR0FBb0IsT0FBTyxDQUFDO01BRTVCLElBQUcsQ0FBSSxpQkFBUDtRQUNFLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixrQ0FBeEIsRUFEdEI7O01BR0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxpQkFBUCxFQUEwQixxQkFBQSxHQUF3QixpQkFBbEQ7TUFFQSxJQUFBLEdBQU8sQ0FDTCxTQURLLEVBRUwsSUFGSyxFQUdMLGlCQUhLLEVBSUwsSUFKSyxFQUtMLDBCQUxLLEVBTUwsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQU5OO2FBU1AsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLEVBQWdCO1FBQUMsZ0JBQUEsRUFBa0IsS0FBbkI7T0FBaEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFI7SUFwQlE7Ozs7S0FyQmtDO0FBUjlDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWaGRsQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJWSERMIEJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIkVtYWNzXCJcbiAgICAgIGNtZDogXCJlbWFjc1wiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2VtYWNzL1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL0VtYWNzIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgVkhETDoge1xuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGg6IHRydWVcbiAgICB9XG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZygndmhkbC1iZWF1dGlmaWVyJywgb3B0aW9ucylcbiAgICBlbWFjcyA9IEBleGUoXCJlbWFjc1wiKVxuXG4gICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBvcHRpb25zLmVtYWNzX3NjcmlwdF9wYXRoXG5cbiAgICBpZiBub3QgZW1hY3Nfc2NyaXB0X3BhdGhcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJlbWFjcy12aGRsLWZvcm1hdGluZy1zY3JpcHQubGlzcFwiKVxuXG4gICAgQGRlYnVnKCd2aGRsLWJlYXV0aWZpZXInLCAnZW1hY3Mgc2NyaXB0IHBhdGg6ICcgKyBlbWFjc19zY3JpcHRfcGF0aClcblxuICAgIGFyZ3MgPSBbXG4gICAgICAnLS1iYXRjaCdcbiAgICAgICctbCdcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoXG4gICAgICAnLWYnXG4gICAgICAndmhkbC1iYXRjaC1pbmRlbnQtcmVnaW9uJ1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICBdXG5cbiAgICBlbWFjcy5ydW4oYXJncywge2lnbm9yZVJldHVybkNvZGU6IGZhbHNlfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==

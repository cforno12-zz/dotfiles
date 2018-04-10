
/*
Requires emacs with verilog-mode https://www.veripool.org/wiki/verilog-mode
 */

(function() {
  "use strict";
  var Beautifier, EmacsVerilogMode, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = EmacsVerilogMode = (function(superClass) {
    extend(EmacsVerilogMode, superClass);

    function EmacsVerilogMode() {
      return EmacsVerilogMode.__super__.constructor.apply(this, arguments);
    }

    EmacsVerilogMode.prototype.name = "Emacs Verilog Mode";

    EmacsVerilogMode.prototype.link = "https://www.veripool.org/projects/verilog-mode/";

    EmacsVerilogMode.prototype.isPreInstalled = false;

    EmacsVerilogMode.prototype.executables = [
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

    EmacsVerilogMode.prototype.options = {
      Verilog: {
        emacs_script_path: true
      }
    };

    EmacsVerilogMode.prototype.beautify = function(text, language, options) {
      var args, emacs_script_path, tempFile;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "verilog-mode.el");
      }
      this.debug('verilog-beautifier', 'emacs script path: ' + emacs_script_path);
      tempFile = this.tempFile("input", text);
      args = ["--batch", tempFile, "-l", emacs_script_path, "-f", "verilog-mode", "-f", "verilog-batch-indent"];
      this.debug('verilog-beautifier', 'emacs args: ' + args);
      return this.exe("emacs").run(args, {
        ignoreReturnCode: false
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return EmacsVerilogMode;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy92ZXJpbG9nLW1vZGUvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGtDQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7K0JBQ3JCLElBQUEsR0FBTTs7K0JBQ04sSUFBQSxHQUFNOzsrQkFDTixjQUFBLEdBQWdCOzsrQkFDaEIsV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sT0FEUjtRQUVFLEdBQUEsRUFBSyxPQUZQO1FBR0UsUUFBQSxFQUFVLHFDQUhaO1FBSUUsWUFBQSxFQUFjLHFDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyx1QkFBWCxDQUFvQyxDQUFBLENBQUE7VUFBOUMsQ0FEQTtTQUxYO09BRFc7OzsrQkFZYixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVM7UUFDUCxpQkFBQSxFQUFtQixJQURaO09BREY7OzsrQkFNVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxpQkFBQSxHQUFvQixPQUFPLENBQUM7TUFFNUIsSUFBRyxDQUFJLGlCQUFQO1FBQ0UsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLGlCQUF4QixFQUR0Qjs7TUFHQSxJQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLEVBQTZCLHFCQUFBLEdBQXdCLGlCQUFyRDtNQUVBLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkI7TUFFWCxJQUFBLEdBQU8sQ0FDTCxTQURLLEVBRUwsUUFGSyxFQUdMLElBSEssRUFJTCxpQkFKSyxFQUtMLElBTEssRUFNTCxjQU5LLEVBT0wsSUFQSyxFQVFMLHNCQVJLO01BV1AsSUFBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxFQUE2QixjQUFBLEdBQWlCLElBQTlDO2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFkLENBQWtCLElBQWxCLEVBQXdCO1FBQUMsZ0JBQUEsRUFBa0IsS0FBbkI7T0FBeEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFI7SUF2QlE7Ozs7S0F0Qm9DO0FBUmhEIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBlbWFjcyB3aXRoIHZlcmlsb2ctbW9kZSBodHRwczovL3d3dy52ZXJpcG9vbC5vcmcvd2lraS92ZXJpbG9nLW1vZGVcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRW1hY3NWZXJpbG9nTW9kZSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJFbWFjcyBWZXJpbG9nIE1vZGVcIlxuICBsaW5rOiBcImh0dHBzOi8vd3d3LnZlcmlwb29sLm9yZy9wcm9qZWN0cy92ZXJpbG9nLW1vZGUvXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJFbWFjc1wiXG4gICAgICBjbWQ6IFwiZW1hY3NcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cuZ251Lm9yZy9zb2Z0d2FyZS9lbWFjcy9cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC9FbWFjcyAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIFZlcmlsb2c6IHtcbiAgICAgIGVtYWNzX3NjcmlwdF9wYXRoOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBlbWFjc19zY3JpcHRfcGF0aCA9IG9wdGlvbnMuZW1hY3Nfc2NyaXB0X3BhdGhcblxuICAgIGlmIG5vdCBlbWFjc19zY3JpcHRfcGF0aFxuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInZlcmlsb2ctbW9kZS5lbFwiKVxuXG4gICAgQGRlYnVnKCd2ZXJpbG9nLWJlYXV0aWZpZXInLCAnZW1hY3Mgc2NyaXB0IHBhdGg6ICcgKyBlbWFjc19zY3JpcHRfcGF0aClcblxuICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcblxuICAgIGFyZ3MgPSBbXG4gICAgICBcIi0tYmF0Y2hcIlxuICAgICAgdGVtcEZpbGVcbiAgICAgIFwiLWxcIlxuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGhcbiAgICAgIFwiLWZcIlxuICAgICAgXCJ2ZXJpbG9nLW1vZGVcIlxuICAgICAgXCItZlwiXG4gICAgICBcInZlcmlsb2ctYmF0Y2gtaW5kZW50XCJcbiAgICAgIF1cblxuICAgIEBkZWJ1ZygndmVyaWxvZy1iZWF1dGlmaWVyJywgJ2VtYWNzIGFyZ3M6ICcgKyBhcmdzKVxuXG4gICAgQGV4ZShcImVtYWNzXCIpLnJ1bihhcmdzLCB7aWdub3JlUmV0dXJuQ29kZTogZmFsc2V9KVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19

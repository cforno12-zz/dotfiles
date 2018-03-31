
/*
Requires [formatR](https://github.com/yihui/formatR)
 */

(function() {
  var Beautifier, R, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = R = (function(superClass) {
    extend(R, superClass);

    function R() {
      return R.__super__.constructor.apply(this, arguments);
    }

    R.prototype.name = "formatR";

    R.prototype.link = "https://github.com/yihui/formatR";

    R.prototype.executables = [
      {
        name: "Rscript",
        cmd: "rscript",
        homepage: "https://github.com/yihui/formatR",
        installation: "https://github.com/yihui/formatR",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+) /)[1];
          },
          runOptions: {
            returnStderr: true
          }
        },
        docker: {
          image: "unibeautify/rscript"
        }
      }
    ];

    R.prototype.options = {
      R: true
    };

    R.prototype.beautify = function(text, language, options) {
      var r_beautifier, rscript;
      rscript = this.exe("rscript");
      r_beautifier = path.resolve(__dirname, "formatR.r");
      return rscript.run([r_beautifier, options.indent_size, this.tempFile("input", text)]);
    };

    return R;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9mb3JtYXRSL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQTs7O0VBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQOztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztnQkFDckIsSUFBQSxHQUFNOztnQkFDTixJQUFBLEdBQU07O2dCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFNBRFI7UUFFRSxHQUFBLEVBQUssU0FGUDtRQUdFLFFBQUEsRUFBVSxrQ0FIWjtRQUlFLFlBQUEsRUFBYyxrQ0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsMEJBQVgsQ0FBdUMsQ0FBQSxDQUFBO1VBQWpELENBREE7VUFFUCxVQUFBLEVBQVk7WUFDVixZQUFBLEVBQWMsSUFESjtXQUZMO1NBTFg7UUFXRSxNQUFBLEVBQVE7VUFDTixLQUFBLEVBQU8scUJBREQ7U0FYVjtPQURXOzs7Z0JBa0JiLE9BQUEsR0FBUztNQUNQLENBQUEsRUFBRyxJQURJOzs7Z0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxHQUFELENBQUssU0FBTDtNQUNWLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsV0FBeEI7YUFDZixPQUFPLENBQUMsR0FBUixDQUFZLENBQ1YsWUFEVSxFQUVWLE9BQU8sQ0FBQyxXQUZFLEVBR1YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBSFUsQ0FBWjtJQUhROzs7O0tBekJxQjtBQVJqQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW2Zvcm1hdFJdKGh0dHBzOi8vZ2l0aHViLmNvbS95aWh1aS9mb3JtYXRSKVxuIyMjXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImZvcm1hdFJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS95aWh1aS9mb3JtYXRSXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlJzY3JpcHRcIlxuICAgICAgY21kOiBcInJzY3JpcHRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL3lpaHVpL2Zvcm1hdFJcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS95aWh1aS9mb3JtYXRSXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC92ZXJzaW9uIChcXGQrXFwuXFxkK1xcLlxcZCspIC8pWzFdXG4gICAgICAgIHJ1bk9wdGlvbnM6IHtcbiAgICAgICAgICByZXR1cm5TdGRlcnI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L3JzY3JpcHRcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBSOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJzY3JpcHQgPSBAZXhlKFwicnNjcmlwdFwiKVxuICAgIHJfYmVhdXRpZmllciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZm9ybWF0Ui5yXCIpXG4gICAgcnNjcmlwdC5ydW4oW1xuICAgICAgcl9iZWF1dGlmaWVyLFxuICAgICAgb3B0aW9ucy5pbmRlbnRfc2l6ZSxcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpLFxuICAgIF0pXG4iXX0=

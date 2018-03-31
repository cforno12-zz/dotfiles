
/*
Requires https://github.com/google/yapf
 */

(function() {
  "use strict";
  var Beautifier, Yapf,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Yapf = (function(superClass) {
    extend(Yapf, superClass);

    function Yapf() {
      return Yapf.__super__.constructor.apply(this, arguments);
    }

    Yapf.prototype.name = "yapf";

    Yapf.prototype.link = "https://github.com/google/yapf";

    Yapf.prototype.isPreInstalled = false;

    Yapf.prototype.options = {
      Python: false
    };

    Yapf.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("yapf", ["-i", tempFile = this.tempFile("input", text)], {
        help: {
          link: "https://github.com/google/yapf"
        },
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          var editor, filePath, projectPath;
          if (options.sort_imports) {
            editor = atom.workspace.getActiveTextEditor();
            filePath = editor.getPath();
            projectPath = atom.project.relativizePath(filePath)[0];
            return _this.run("isort", ["-sp", projectPath, tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Yapf;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy95YXBmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxnQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7bUJBRXJCLElBQUEsR0FBTTs7bUJBQ04sSUFBQSxHQUFNOzttQkFDTixjQUFBLEdBQWdCOzttQkFFaEIsT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLEtBREQ7OzttQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFBYSxDQUNYLElBRFcsRUFFWCxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRkEsQ0FBYixFQUdLO1FBQUEsSUFBQSxFQUFNO1VBQ1AsSUFBQSxFQUFNLGdDQURDO1NBQU47UUFFQSxnQkFBQSxFQUFrQixJQUZsQjtPQUhMLENBTUUsQ0FBQyxJQU5ILENBTVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0osY0FBQTtVQUFBLElBQUcsT0FBTyxDQUFDLFlBQVg7WUFDRSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1lBQ1QsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7WUFDWCxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXNDLENBQUEsQ0FBQTttQkFFcEQsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQ0UsQ0FBQyxLQUFELEVBQVEsV0FBUixFQUFxQixRQUFyQixDQURGLEVBRUU7Y0FBQSxJQUFBLEVBQU07Z0JBQ0osSUFBQSxFQUFNLHlDQURGO2VBQU47YUFGRixDQUtBLENBQUMsSUFMRCxDQUtNLFNBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1lBREksQ0FMTixFQUxGO1dBQUEsTUFBQTttQkFjRSxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFkRjs7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOUjtJQURROzs7O0tBVndCO0FBUHBDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL3lhcGZcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgWWFwZiBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcInlhcGZcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUveWFwZlwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQeXRob246IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJ5YXBmXCIsIFtcbiAgICAgIFwiLWlcIlxuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUveWFwZlwiXG4gICAgICB9LCBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlKVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgaWYgb3B0aW9ucy5zb3J0X2ltcG9ydHNcbiAgICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICAgICAgICAgIEBydW4oXCJpc29ydFwiLFxuICAgICAgICAgICAgW1wiLXNwXCIsIHByb2plY3RQYXRoLCB0ZW1wRmlsZV0sXG4gICAgICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3RpbW90aHljcm9zbGV5L2lzb3J0XCJcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19

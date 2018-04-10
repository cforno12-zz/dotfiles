
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, Crystal,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Crystal = (function(superClass) {
    extend(Crystal, superClass);

    function Crystal() {
      return Crystal.__super__.constructor.apply(this, arguments);
    }

    Crystal.prototype.name = "Crystal";

    Crystal.prototype.link = "http://crystal-lang.org";

    Crystal.prototype.executables = [
      {
        name: "Crystal",
        cmd: "crystal",
        homepage: "http://crystal-lang.org",
        installation: "https://crystal-lang.org/docs/installation/",
        version: {
          parse: function(text) {
            return text.match(/Crystal (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/crystal"
        }
      }
    ];

    Crystal.prototype.options = {
      Crystal: false
    };

    Crystal.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("crystal").run(['tool', 'format', tempFile = this.tempFile("temp", text)], {
        ignoreReturnCode: true
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return Crystal;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jcnlzdGFsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxTQURSO1FBRUUsR0FBQSxFQUFLLFNBRlA7UUFHRSxRQUFBLEVBQVUseUJBSFo7UUFJRSxZQUFBLEVBQWMsNkNBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHlCQUFYLENBQXNDLENBQUEsQ0FBQTtVQUFoRCxDQURBO1NBTFg7UUFRRSxNQUFBLEVBQVE7VUFDTixLQUFBLEVBQU8scUJBREQ7U0FSVjtPQURXOzs7c0JBZWIsT0FBQSxHQUFTO01BQ1AsT0FBQSxFQUFTLEtBREY7OztzQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsQ0FBZSxDQUFDLEdBQWhCLENBQW9CLENBQ2xCLE1BRGtCLEVBRWxCLFFBRmtCLEVBR2xCLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FITyxDQUFwQixFQUlLO1FBQUMsZ0JBQUEsRUFBa0IsSUFBbkI7T0FKTCxDQUtFLENBQUMsSUFMSCxDQUtRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMUjtJQURROzs7O0tBdEIyQjtBQVB2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2phc3BlcnZkai9zdHlsaXNoLWhhc2tlbGxcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ3J5c3RhbCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJDcnlzdGFsXCJcbiAgbGluazogXCJodHRwOi8vY3J5c3RhbC1sYW5nLm9yZ1wiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJDcnlzdGFsXCJcbiAgICAgIGNtZDogXCJjcnlzdGFsXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHA6Ly9jcnlzdGFsLWxhbmcub3JnXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2NyeXN0YWwtbGFuZy5vcmcvZG9jcy9pbnN0YWxsYXRpb24vXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC9DcnlzdGFsIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9jcnlzdGFsXCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgQ3J5c3RhbDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQGV4ZShcImNyeXN0YWxcIikucnVuKFtcbiAgICAgICd0b29sJyxcbiAgICAgICdmb3JtYXQnLFxuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICBdLCB7aWdub3JlUmV0dXJuQ29kZTogdHJ1ZX0pXG4gICAgICAudGhlbig9PlxuICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICApXG4iXX0=

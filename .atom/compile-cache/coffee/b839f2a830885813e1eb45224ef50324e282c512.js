
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(superClass) {
    extend(PuppetFix, superClass);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.link = "http://puppet-lint.com/";

    PuppetFix.prototype.isPreInstalled = false;

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.cli = function(options) {
      if (options.puppet_path == null) {
        return new Error("'puppet-lint' path is not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.puppet_path;
      }
    };

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("puppet-lint", ['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wdXBwZXQtZml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxxQkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBRXJCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFDTixjQUFBLEdBQWdCOzt3QkFFaEIsT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7Ozt3QkFJVCxHQUFBLEdBQUssU0FBQyxPQUFEO01BQ0gsSUFBTywyQkFBUDtBQUNFLGVBQVcsSUFBQSxLQUFBLENBQU0sZ0NBQUEsR0FDZix5REFEUyxFQURiO09BQUEsTUFBQTtBQUlFLGVBQU8sT0FBTyxDQUFDLFlBSmpCOztJQURHOzt3QkFPTCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsRUFBb0IsQ0FDbEIsT0FEa0IsRUFFbEIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUZPLENBQXBCLEVBR0s7UUFDRCxnQkFBQSxFQUFrQixJQURqQjtRQUVELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSx5QkFERjtTQUZMO09BSEwsQ0FTRSxDQUFDLElBVEgsQ0FTUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVFI7SUFEUTs7OztLQWpCNkI7QUFOekMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtwdXBwZXQtbGlua10oaHR0cDovL3B1cHBldC1saW50LmNvbS8pXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQdXBwZXRGaXggZXh0ZW5kcyBCZWF1dGlmaWVyXG4gICMgdGhpcyBpcyB3aGF0IGRpc3BsYXlzIGFzIHlvdXIgRGVmYXVsdCBCZWF1dGlmaWVyIGluIExhbmd1YWdlIENvbmZpZ1xuICBuYW1lOiBcInB1cHBldC1saW50XCJcbiAgbGluazogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQdXBwZXQ6IHRydWVcbiAgfVxuXG4gIGNsaTogKG9wdGlvbnMpIC0+XG4gICAgaWYgbm90IG9wdGlvbnMucHVwcGV0X3BhdGg/XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiJ3B1cHBldC1saW50JyBwYXRoIGlzIG5vdCBzZXQhXCIgK1xuICAgICAgICBcIiBQbGVhc2Ugc2V0IHRoaXMgaW4gdGhlIEF0b20gQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5ncy5cIilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gb3B0aW9ucy5wdXBwZXRfcGF0aFxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHJ1bihcInB1cHBldC1saW50XCIsIFtcbiAgICAgICctLWZpeCdcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZVxuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbig9PlxuICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICApXG4iXX0=

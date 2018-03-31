
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

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.executables = [
      {
        name: "puppet-lint",
        cmd: "puppet-lint",
        homepage: "http://puppet-lint.com/",
        installation: "http://puppet-lint.com/",
        version: {
          parse: function(text) {
            return text.match(/puppet-lint (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/puppet-lint"
        }
      }
    ];

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.exe("puppet-lint").run(['--fix', tempFile = this.tempFile("input", text)], {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wdXBwZXQtZml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxxQkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBRXJCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFFTixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsSUFERDs7O3dCQUlULFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLGFBRFI7UUFFRSxHQUFBLEVBQUssYUFGUDtRQUdFLFFBQUEsRUFBVSx5QkFIWjtRQUlFLFlBQUEsRUFBYyx5QkFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsNkJBQVgsQ0FBMEMsQ0FBQSxDQUFBO1VBQXBELENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTyx5QkFERDtTQVJWO09BRFc7Ozt3QkFlYixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsQ0FBbUIsQ0FBQyxHQUFwQixDQUF3QixDQUN0QixPQURzQixFQUV0QixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRlcsQ0FBeEIsRUFHSztRQUNELGdCQUFBLEVBQWtCLElBRGpCO1FBRUQsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLHlCQURGO1NBRkw7T0FITCxDQVNFLENBQUMsSUFUSCxDQVNRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FUUjtJQURROzs7O0tBeEI2QjtBQU56QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW3B1cHBldC1saW5rXShodHRwOi8vcHVwcGV0LWxpbnQuY29tLylcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFB1cHBldEZpeCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgIyB0aGlzIGlzIHdoYXQgZGlzcGxheXMgYXMgeW91ciBEZWZhdWx0IEJlYXV0aWZpZXIgaW4gTGFuZ3VhZ2UgQ29uZmlnXG4gIG5hbWU6IFwicHVwcGV0LWxpbnRcIlxuICBsaW5rOiBcImh0dHA6Ly9wdXBwZXQtbGludC5jb20vXCJcblxuICBvcHRpb25zOiB7XG4gICAgUHVwcGV0OiB0cnVlXG4gIH1cblxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwicHVwcGV0LWxpbnRcIlxuICAgICAgY21kOiBcInB1cHBldC1saW50XCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHA6Ly9wdXBwZXQtbGludC5jb20vXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vcHVwcGV0LWxpbnQuY29tL1wiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvcHVwcGV0LWxpbnQgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L3B1cHBldC1saW50XCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBleGUoXCJwdXBwZXQtbGludFwiKS5ydW4oW1xuICAgICAgJy0tZml4J1xuICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBpZ25vcmVSZXR1cm5Db2RlOiB0cnVlXG4gICAgICAgIGhlbHA6IHtcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly9wdXBwZXQtbGludC5jb20vXCJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==

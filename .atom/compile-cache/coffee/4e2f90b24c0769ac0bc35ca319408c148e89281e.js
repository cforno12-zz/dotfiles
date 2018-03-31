
/*
Requires [gn](https://chromium.googlesource.com/chromium/src/tools/gn)
 */

(function() {
  "use strict";
  var Beautifier, GN, path, semver,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  semver = require('semver');

  module.exports = GN = (function(superClass) {
    extend(GN, superClass);

    function GN() {
      return GN.__super__.constructor.apply(this, arguments);
    }

    GN.prototype.name = "GN";

    GN.prototype.link = "https://chromium.googlesource.com/chromium/src/tools/gn";

    GN.prototype.executables = [
      {
        name: "gn",
        cmd: "gn",
        homepage: "https://chromium.googlesource.com/chromium/src/tools/gn",
        installation: "https://www.chromium.org/developers/how-tos/get-the-code",
        version: {
          parse: function(text) {
            return semver.clean("0.0." + text);
          }
        }
      }
    ];

    GN.prototype.options = {
      GN: false
    };

    GN.prototype.beautify = function(text, language, options, context) {
      var cwd;
      cwd = context.filePath && path.dirname(context.filePath);
      return this.exe("gn").run(["format", "--stdin"], {
        cwd: cwd,
        onStdin: function(stdin) {
          return stdin.end(text);
        }
      });
    };

    return GN;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9nbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsNEJBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7aUJBQ3JCLElBQUEsR0FBTTs7aUJBQ04sSUFBQSxHQUFNOztpQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxJQURSO1FBRUUsR0FBQSxFQUFLLElBRlA7UUFHRSxRQUFBLEVBQVUseURBSFo7UUFJRSxZQUFBLEVBQWMsMERBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQUEsR0FBUyxJQUF0QjtVQUFWLENBREE7U0FMWDtPQURXOzs7aUJBWWIsT0FBQSxHQUFTO01BQ1AsRUFBQSxFQUFJLEtBREc7OztpQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFFBQVIsSUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsUUFBckI7YUFDM0IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLENBQVUsQ0FBQyxHQUFYLENBQWUsQ0FBQyxRQUFELEVBQVcsU0FBWCxDQUFmLEVBQXNDO1FBQ3BDLEdBQUEsRUFBSyxHQUQrQjtRQUVwQyxPQUFBLEVBQVMsU0FBQyxLQUFEO2lCQUNQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtRQURPLENBRjJCO09BQXRDO0lBRlE7Ozs7S0FuQnNCO0FBUmxDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbZ25dKGh0dHBzOi8vY2hyb21pdW0uZ29vZ2xlc291cmNlLmNvbS9jaHJvbWl1bS9zcmMvdG9vbHMvZ24pXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbnNlbXZlciA9IHJlcXVpcmUoJ3NlbXZlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR04gZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiR05cIlxuICBsaW5rOiBcImh0dHBzOi8vY2hyb21pdW0uZ29vZ2xlc291cmNlLmNvbS9jaHJvbWl1bS9zcmMvdG9vbHMvZ25cIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiZ25cIlxuICAgICAgY21kOiBcImduXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vY2hyb21pdW0uZ29vZ2xlc291cmNlLmNvbS9jaHJvbWl1bS9zcmMvdG9vbHMvZ25cIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LmNocm9taXVtLm9yZy9kZXZlbG9wZXJzL2hvdy10b3MvZ2V0LXRoZS1jb2RlXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiBzZW12ZXIuY2xlYW4oXCIwLjAuXCIgKyB0ZXh0KVxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBHTjogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgY3dkID0gY29udGV4dC5maWxlUGF0aCBhbmQgcGF0aC5kaXJuYW1lIGNvbnRleHQuZmlsZVBhdGhcbiAgICBAZXhlKFwiZ25cIikucnVuKFtcImZvcm1hdFwiLCBcIi0tc3RkaW5cIl0sIHtcbiAgICAgIGN3ZDogY3dkXG4gICAgICBvblN0ZGluOiAoc3RkaW4pIC0+XG4gICAgICAgIHN0ZGluLmVuZCB0ZXh0XG4gICAgfSlcbiJdfQ==


/*
Requires https://godoc.org/golang.org/x/tools/cmd/goimports
 */

(function() {
  "use strict";
  var Beautifier, Goimports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Goimports = (function(superClass) {
    extend(Goimports, superClass);

    function Goimports() {
      return Goimports.__super__.constructor.apply(this, arguments);
    }

    Goimports.prototype.name = "goimports";

    Goimports.prototype.link = "https://godoc.org/golang.org/x/tools/cmd/goimports";

    Goimports.prototype.executables = [
      {
        name: "goimports",
        cmd: "goimports",
        homepage: "https://godoc.org/golang.org/x/tools/cmd/goimports",
        installation: "https://godoc.org/golang.org/x/tools/cmd/goimports",
        version: {
          args: ['--help'],
          parse: function(text) {
            return text.indexOf("usage: goimports") !== -1 && "0.0.0";
          },
          runOptions: {
            ignoreReturnCode: true,
            returnStderr: true
          }
        },
        docker: {
          image: "unibeautify/goimports"
        }
      }
    ];

    Goimports.prototype.options = {
      Go: false
    };

    Goimports.prototype.beautify = function(text, language, options) {
      return this.exe("goimports").run([this.tempFile("input", text)]);
    };

    return Goimports;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9nb2ltcG9ydHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLHFCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt3QkFDckIsSUFBQSxHQUFNOzt3QkFDTixJQUFBLEdBQU07O3dCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLFdBRFI7UUFFRSxHQUFBLEVBQUssV0FGUDtRQUdFLFFBQUEsRUFBVSxvREFIWjtRQUlFLFlBQUEsRUFBYyxvREFKaEI7UUFLRSxPQUFBLEVBQVM7VUFFUCxJQUFBLEVBQU0sQ0FBQyxRQUFELENBRkM7VUFHUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsa0JBQWIsQ0FBQSxLQUFzQyxDQUFDLENBQXZDLElBQTZDO1VBQXZELENBSEE7VUFJUCxVQUFBLEVBQVk7WUFDVixnQkFBQSxFQUFrQixJQURSO1lBRVYsWUFBQSxFQUFjLElBRko7V0FKTDtTQUxYO1FBY0UsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHVCQUREO1NBZFY7T0FEVzs7O3dCQXFCYixPQUFBLEdBQVM7TUFDUCxFQUFBLEVBQUksS0FERzs7O3dCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLENBQWlCLENBQUMsR0FBbEIsQ0FBc0IsQ0FDcEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRG9CLENBQXRCO0lBRFE7Ozs7S0E1QjZCO0FBUHpDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dvZG9jLm9yZy9nb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0c1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHb2ltcG9ydHMgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiZ29pbXBvcnRzXCJcbiAgbGluazogXCJodHRwczovL2dvZG9jLm9yZy9nb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0c1wiXG4gIGV4ZWN1dGFibGVzOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJnb2ltcG9ydHNcIlxuICAgICAgY21kOiBcImdvaW1wb3J0c1wiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dvZG9jLm9yZy9nb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0c1wiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9nb2RvYy5vcmcvZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHNcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICAjIERvZXMgbm90IGRpc3BsYXkgdmVyc2lvblxuICAgICAgICBhcmdzOiBbJy0taGVscCddLFxuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQuaW5kZXhPZihcInVzYWdlOiBnb2ltcG9ydHNcIikgaXNudCAtMSBhbmQgXCIwLjAuMFwiLFxuICAgICAgICBydW5PcHRpb25zOiB7XG4gICAgICAgICAgaWdub3JlUmV0dXJuQ29kZTogdHJ1ZSxcbiAgICAgICAgICByZXR1cm5TdGRlcnI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L2dvaW1wb3J0c1wiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIEdvOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAZXhlKFwiZ29pbXBvcnRzXCIpLnJ1bihbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSlcbiJdfQ==


/*
Requires [dfmt](https://github.com/Hackerpilot/dfmt)
 */

(function() {
  "use strict";
  var Beautifier, Dfmt,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Dfmt = (function(superClass) {
    extend(Dfmt, superClass);

    function Dfmt() {
      return Dfmt.__super__.constructor.apply(this, arguments);
    }

    Dfmt.prototype.name = "dfmt";

    Dfmt.prototype.link = "https://github.com/Hackerpilot/dfmt";

    Dfmt.prototype.executables = [
      {
        name: "Dfmt",
        cmd: "dfmt",
        homepage: "https://github.com/Hackerpilot/dfmt",
        installation: "https://github.com/dlang-community/dfmt#building"
      }
    ];

    Dfmt.prototype.options = {
      D: false
    };

    Dfmt.prototype.beautify = function(text, language, options) {
      return this.exe("dfmt").run([this.tempFile("input", text)]);
    };

    return Dfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9kZm10LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxnQkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7bUJBQ3JCLElBQUEsR0FBTTs7bUJBQ04sSUFBQSxHQUFNOzttQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxNQURSO1FBRUUsR0FBQSxFQUFLLE1BRlA7UUFHRSxRQUFBLEVBQVUscUNBSFo7UUFJRSxZQUFBLEVBQWMsa0RBSmhCO09BRFc7OzttQkFTYixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQUcsS0FESTs7O21CQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLENBQVksQ0FBQyxHQUFiLENBQWlCLENBQ2YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGUsQ0FBakI7SUFEUTs7OztLQWhCd0I7QUFOcEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtkZm10XShodHRwczovL2dpdGh1Yi5jb20vSGFja2VycGlsb3QvZGZtdClcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERmbXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiZGZtdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0hhY2tlcnBpbG90L2RmbXRcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiRGZtdFwiXG4gICAgICBjbWQ6IFwiZGZtdFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vSGFja2VycGlsb3QvZGZtdFwiXG4gICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly9naXRodWIuY29tL2RsYW5nLWNvbW11bml0eS9kZm10I2J1aWxkaW5nXCJcbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgRDogZmFsc2VcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQGV4ZShcImRmbXRcIikucnVuKFtcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdKVxuIl19

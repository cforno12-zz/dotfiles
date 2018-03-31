(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(superClass) {
    extend(CoffeeFormatter, superClass);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.link = "https://github.com/Glavin001/Coffee-Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: false
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jb2ZmZWUtZm9ybWF0dGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSwyQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7OEJBRXJCLElBQUEsR0FBTTs7OEJBQ04sSUFBQSxHQUFNOzs4QkFFTixPQUFBLEdBQVM7TUFDUCxZQUFBLEVBQWMsS0FEUDs7OzhCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBRVIsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUVsQixZQUFBO1FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxrQkFBUjtRQUNMLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7UUFDUixTQUFBLEdBQVk7UUFDWixDQUFBLEdBQUk7UUFDSixHQUFBLEdBQU0sS0FBSyxDQUFDO0FBRVosZUFBTSxDQUFBLEdBQUksR0FBVjtVQUNFLElBQUEsR0FBTyxLQUFNLENBQUEsQ0FBQTtVQUNiLENBQUEsR0FBSSxFQUFFLENBQUMsc0JBQUgsQ0FBMEIsSUFBMUI7VUFDSixDQUFBLEdBQUksRUFBRSxDQUFDLHNCQUFILENBQTBCLENBQTFCO1VBQ0osQ0FBQSxHQUFJLEVBQUUsQ0FBQyxhQUFILENBQWlCLENBQWpCO1VBQ0osU0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmO1VBQ0EsQ0FBQTtRQU5GO1FBT0EsTUFBQSxHQUFTLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZjtlQUNULE9BQUEsQ0FBUSxNQUFSO01BaEJrQixDQUFiO0lBRkM7Ozs7S0FUbUM7QUFIL0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29mZmVlRm9ybWF0dGVyIGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6IFwiQ29mZmVlIEZvcm1hdHRlclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9Db2ZmZWUtRm9ybWF0dGVyXCJcblxuICBvcHRpb25zOiB7XG4gICAgQ29mZmVlU2NyaXB0OiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cblxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cblxuICAgICAgQ0YgPSByZXF1aXJlKFwiY29mZmVlLWZvcm1hdHRlclwiKVxuICAgICAgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpXG4gICAgICByZXN1bHRBcnIgPSBbXVxuICAgICAgaSA9IDBcbiAgICAgIGxlbiA9IGxpbmVzLmxlbmd0aFxuXG4gICAgICB3aGlsZSBpIDwgbGVuXG4gICAgICAgIGN1cnIgPSBsaW5lc1tpXVxuICAgICAgICBwID0gQ0YuZm9ybWF0VHdvU3BhY2VPcGVyYXRvcihjdXJyKVxuICAgICAgICBwID0gQ0YuZm9ybWF0T25lU3BhY2VPcGVyYXRvcihwKVxuICAgICAgICBwID0gQ0Yuc2hvcnRlblNwYWNlcyhwKVxuICAgICAgICByZXN1bHRBcnIucHVzaCBwXG4gICAgICAgIGkrK1xuICAgICAgcmVzdWx0ID0gcmVzdWx0QXJyLmpvaW4oXCJcXG5cIilcbiAgICAgIHJlc29sdmUgcmVzdWx0XG5cbiAgICApXG4iXX0=

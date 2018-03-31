
/*
Requires https://github.com/erniebrodeur/ruby-beautify
 */

(function() {
  "use strict";
  var Beautifier, RubyBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = RubyBeautify = (function(superClass) {
    extend(RubyBeautify, superClass);

    function RubyBeautify() {
      return RubyBeautify.__super__.constructor.apply(this, arguments);
    }

    RubyBeautify.prototype.name = "Ruby Beautify";

    RubyBeautify.prototype.link = "https://github.com/erniebrodeur/ruby-beautify";

    RubyBeautify.prototype.isPreInstalled = false;

    RubyBeautify.prototype.options = {
      Ruby: {
        indent_size: true,
        indent_char: true
      }
    };

    RubyBeautify.prototype.beautify = function(text, language, options) {
      return this.run("rbeautify", [options.indent_char === '\t' ? "--tabs" : "--spaces", "--indent_count", options.indent_size, this.tempFile("input", text)], {
        help: {
          link: "https://github.com/erniebrodeur/ruby-beautify"
        }
      });
    };

    return RubyBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJ5LWJlYXV0aWZ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx3QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MkJBQ3JCLElBQUEsR0FBTTs7MkJBQ04sSUFBQSxHQUFNOzsyQkFDTixjQUFBLEdBQWdCOzsyQkFFaEIsT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxXQUFBLEVBQWEsSUFEYjtPQUZLOzs7MkJBTVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDYixPQUFPLENBQUMsV0FBUixLQUF1QixJQUExQixHQUFvQyxRQUFwQyxHQUFrRCxVQURsQyxFQUVoQixnQkFGZ0IsRUFFRSxPQUFPLENBQUMsV0FGVixFQUdoQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FIZ0IsQ0FBbEIsRUFJSztRQUFBLElBQUEsRUFBTTtVQUNQLElBQUEsRUFBTSwrQ0FEQztTQUFOO09BSkw7SUFEUTs7OztLQVhnQztBQVA1QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2VybmllYnJvZGV1ci9ydWJ5LWJlYXV0aWZ5XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJ1YnlCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSdWJ5IEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXJuaWVicm9kZXVyL3J1YnktYmVhdXRpZnlcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgUnVieTpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBpbmRlbnRfY2hhcjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwicmJlYXV0aWZ5XCIsIFtcbiAgICAgIGlmIG9wdGlvbnMuaW5kZW50X2NoYXIgaXMgJ1xcdCcgdGhlbiBcIi0tdGFic1wiIGVsc2UgXCItLXNwYWNlc1wiXG4gICAgICBcIi0taW5kZW50X2NvdW50XCIsIG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdLCBoZWxwOiB7XG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2VybmllYnJvZGV1ci9ydWJ5LWJlYXV0aWZ5XCJcbiAgICAgIH0pXG4iXX0=

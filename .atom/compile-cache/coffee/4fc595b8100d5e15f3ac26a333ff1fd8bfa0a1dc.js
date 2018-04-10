
/*
 */

(function() {
  var Beautifier, Lua, format, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  format = require('./beautifier');

  module.exports = Lua = (function(superClass) {
    extend(Lua, superClass);

    function Lua() {
      return Lua.__super__.constructor.apply(this, arguments);
    }

    Lua.prototype.name = "Lua beautifier";

    Lua.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/lua-beautifier/beautifier.coffee";

    Lua.prototype.options = {
      Lua: true
    };

    Lua.prototype.beautify = function(text, language, options) {
      options.eol = this.getDefaultLineEnding('\r\n', '\n', options.end_of_line);
      return new this.Promise(function(resolve, reject) {
        var error;
        try {
          return resolve(format(text, options.indent_char.repeat(options.indent_size), this.warn, options));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return Lua;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9sdWEtYmVhdXRpZmllci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7QUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQTs7O0VBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQOztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixNQUFBLEdBQVMsT0FBQSxDQUFRLGNBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7a0JBQ3JCLElBQUEsR0FBTTs7a0JBQ04sSUFBQSxHQUFNOztrQkFFTixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQUssSUFERTs7O2tCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO01BQ1IsT0FBTyxDQUFDLEdBQVIsR0FBYyxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsRUFBNkIsSUFBN0IsRUFBa0MsT0FBTyxDQUFDLFdBQTFDO2FBQ1YsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDWCxZQUFBO0FBQUE7aUJBQ0UsT0FBQSxDQUFRLE1BQUEsQ0FBTyxJQUFQLEVBQWEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFwQixDQUEyQixPQUFPLENBQUMsV0FBbkMsQ0FBYixFQUE4RCxJQUFDLENBQUEsSUFBL0QsRUFBcUUsT0FBckUsQ0FBUixFQURGO1NBQUEsY0FBQTtVQUVNO2lCQUNKLE1BQUEsQ0FBTyxLQUFQLEVBSEY7O01BRFcsQ0FBVDtJQUZJOzs7O0tBUnVCO0FBUm5DIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIyNcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4uL2JlYXV0aWZpZXInKVxuZm9ybWF0ID0gcmVxdWlyZSAnLi9iZWF1dGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEx1YSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJMdWEgYmVhdXRpZmllclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2Jsb2IvbWFzdGVyL3NyYy9iZWF1dGlmaWVycy9sdWEtYmVhdXRpZmllci9iZWF1dGlmaWVyLmNvZmZlZVwiXG5cbiAgb3B0aW9uczoge1xuICAgIEx1YTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLmVvbCA9IEBnZXREZWZhdWx0TGluZUVuZGluZygnXFxyXFxuJywnXFxuJyxvcHRpb25zLmVuZF9vZl9saW5lKVxuICAgIG5ldyBAUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHJlc29sdmUgZm9ybWF0IHRleHQsIG9wdGlvbnMuaW5kZW50X2NoYXIucmVwZWF0KG9wdGlvbnMuaW5kZW50X3NpemUpLCBAd2Fybiwgb3B0aW9uc1xuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmVqZWN0IGVycm9yXG4iXX0=

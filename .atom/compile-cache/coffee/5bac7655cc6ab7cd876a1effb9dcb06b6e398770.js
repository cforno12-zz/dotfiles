
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
      Lua: {
        indent_size: true,
        indent_char: true,
        end_of_line: true
      }
    };

    Lua.prototype.beautify = function(text, language, options) {
      var indent, indentChar, indentSize;
      options.eol = this.getDefaultLineEnding('\r\n', '\n', options.end_of_line);
      indentChar = options.indent_char || " ";
      indentSize = options.indent_size;
      indent = indentChar.repeat(indentSize);
      return new this.Promise(function(resolve, reject) {
        var error;
        try {
          return resolve(format(text, indent, this.warn, options));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return Lua;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9sdWEtYmVhdXRpZmllci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7QUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQTs7O0VBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQOztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixNQUFBLEdBQVMsT0FBQSxDQUFRLGNBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7a0JBQ3JCLElBQUEsR0FBTTs7a0JBQ04sSUFBQSxHQUFNOztrQkFFTixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQUs7UUFDSCxXQUFBLEVBQWEsSUFEVjtRQUVILFdBQUEsRUFBYSxJQUZWO1FBR0gsV0FBQSxFQUFhLElBSFY7T0FERTs7O2tCQVFULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLE9BQU8sQ0FBQyxHQUFSLEdBQWMsSUFBQyxDQUFBLG9CQUFELENBQXNCLE1BQXRCLEVBQTZCLElBQTdCLEVBQW1DLE9BQU8sQ0FBQyxXQUEzQztNQUNkLFVBQUEsR0FBYSxPQUFPLENBQUMsV0FBUixJQUF1QjtNQUNwQyxVQUFBLEdBQWEsT0FBTyxDQUFDO01BQ3JCLE1BQUEsR0FBUyxVQUFVLENBQUMsTUFBWCxDQUFrQixVQUFsQjthQUNULElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1gsWUFBQTtBQUFBO2lCQUNFLE9BQUEsQ0FBUSxNQUFBLENBQU8sSUFBUCxFQUFhLE1BQWIsRUFBcUIsSUFBQyxDQUFBLElBQXRCLEVBQTRCLE9BQTVCLENBQVIsRUFERjtTQUFBLGNBQUE7VUFFTTtpQkFDSixNQUFBLENBQU8sS0FBUCxFQUhGOztNQURXLENBQWI7SUFMUTs7OztLQVp1QjtBQVJuQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIyMjXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcbmZvcm1hdCA9IHJlcXVpcmUgJy4vYmVhdXRpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMdWEgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiTHVhIGJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9ibG9iL21hc3Rlci9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvYmVhdXRpZmllci5jb2ZmZWVcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBMdWE6IHtcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBpbmRlbnRfY2hhcjogdHJ1ZVxuICAgICAgZW5kX29mX2xpbmU6IHRydWVcbiAgICB9XG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMuZW9sID0gQGdldERlZmF1bHRMaW5lRW5kaW5nKCdcXHJcXG4nLCdcXG4nLCBvcHRpb25zLmVuZF9vZl9saW5lKVxuICAgIGluZGVudENoYXIgPSBvcHRpb25zLmluZGVudF9jaGFyIG9yIFwiIFwiXG4gICAgaW5kZW50U2l6ZSA9IG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICBpbmRlbnQgPSBpbmRlbnRDaGFyLnJlcGVhdChpbmRlbnRTaXplKVxuICAgIG5ldyBAUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHJlc29sdmUoZm9ybWF0KHRleHQsIGluZGVudCwgQHdhcm4sIG9wdGlvbnMpKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmVqZWN0IGVycm9yXG4iXX0=

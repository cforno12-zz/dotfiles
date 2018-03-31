(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(superClass) {
    extend(TypeScriptFormatter, superClass);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.link = "https://github.com/vvakame/typescript-formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: {
        indent_with_tabs: true,
        tab_width: true,
        indent_size: true
      },
      TSX: {
        indent_with_tabs: true,
        tab_width: true,
        indent_size: true
      }
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, fileName, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter").format;
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeSettings();
            if (options.indent_with_tabs) {
              opts.convertTabsToSpaces = false;
            } else {
              opts.tabSize = options.tab_width || options.indent_size;
              opts.indentSize = options.indent_size;
              opts.indentStyle = 'space';
            }
            if (language === "TSX") {
              fileName = 'test.tsx';
            } else {
              fileName = '';
            }
            _this.verbose('typescript', text, opts);
            result = format(fileName, text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (error) {
            e = error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90eXBlc2NyaXB0LWZvcm1hdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2tDQUNyQixJQUFBLEdBQU07O2tDQUNOLElBQUEsR0FBTTs7a0NBQ04sT0FBQSxHQUFTO01BQ1AsVUFBQSxFQUNFO1FBQUEsZ0JBQUEsRUFBa0IsSUFBbEI7UUFDQSxTQUFBLEVBQVcsSUFEWDtRQUVBLFdBQUEsRUFBYSxJQUZiO09BRks7TUFLUCxHQUFBLEVBQ0U7UUFBQSxnQkFBQSxFQUFrQixJQUFsQjtRQUNBLFNBQUEsRUFBVyxJQURYO1FBRUEsV0FBQSxFQUFhLElBRmI7T0FOSzs7O2tDQVdULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBRWxCLGNBQUE7QUFBQTtZQUNFLE1BQUEsR0FBUyxPQUFBLENBQVEsb0NBQVIsQ0FBNkMsQ0FBQztZQUN2RCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxnQ0FBUjtZQUdqQixJQUFBLEdBQU8sY0FBYyxDQUFDLCtCQUFmLENBQUE7WUFFUCxJQUFHLE9BQU8sQ0FBQyxnQkFBWDtjQUNFLElBQUksQ0FBQyxtQkFBTCxHQUEyQixNQUQ3QjthQUFBLE1BQUE7Y0FHRSxJQUFJLENBQUMsT0FBTCxHQUFlLE9BQU8sQ0FBQyxTQUFSLElBQXFCLE9BQU8sQ0FBQztjQUM1QyxJQUFJLENBQUMsVUFBTCxHQUFrQixPQUFPLENBQUM7Y0FDMUIsSUFBSSxDQUFDLFdBQUwsR0FBbUIsUUFMckI7O1lBT0EsSUFBRyxRQUFBLEtBQVksS0FBZjtjQUNFLFFBQUEsR0FBVyxXQURiO2FBQUEsTUFBQTtjQUdFLFFBQUEsR0FBVyxHQUhiOztZQUtBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUF2QixFQUE2QixJQUE3QjtZQUNBLE1BQUEsR0FBUyxNQUFBLENBQU8sUUFBUCxFQUFpQixJQUFqQixFQUF1QixJQUF2QjtZQUNULEtBQUMsQ0FBQSxPQUFELENBQVMsTUFBVDttQkFDQSxPQUFBLENBQVEsTUFBUixFQXRCRjtXQUFBLGFBQUE7WUF1Qk07QUFDSixtQkFBTyxNQUFBLENBQU8sQ0FBUCxFQXhCVDs7UUFGa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7SUFEQzs7OztLQWR1QztBQUhuRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUeXBlU2NyaXB0Rm9ybWF0dGVyIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlR5cGVTY3JpcHQgRm9ybWF0dGVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vdnZha2FtZS90eXBlc2NyaXB0LWZvcm1hdHRlclwiXG4gIG9wdGlvbnM6IHtcbiAgICBUeXBlU2NyaXB0OlxuICAgICAgaW5kZW50X3dpdGhfdGFiczogdHJ1ZVxuICAgICAgdGFiX3dpZHRoOiB0cnVlXG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgIFRTWDpcbiAgICAgIGluZGVudF93aXRoX3RhYnM6IHRydWVcbiAgICAgIHRhYl93aWR0aDogdHJ1ZVxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXG4gICAgICB0cnlcbiAgICAgICAgZm9ybWF0ID0gcmVxdWlyZShcInR5cGVzY3JpcHQtZm9ybWF0dGVyL2xpYi9mb3JtYXR0ZXJcIikuZm9ybWF0XG4gICAgICAgIGZvcm1hdHRlclV0aWxzID0gcmVxdWlyZShcInR5cGVzY3JpcHQtZm9ybWF0dGVyL2xpYi91dGlsc1wiKVxuICAgICAgICAjIEB2ZXJib3NlKCdmb3JtYXQnLCBmb3JtYXQsIGZvcm1hdHRlclV0aWxzKVxuXG4gICAgICAgIG9wdHMgPSBmb3JtYXR0ZXJVdGlscy5jcmVhdGVEZWZhdWx0Rm9ybWF0Q29kZVNldHRpbmdzKClcblxuICAgICAgICBpZiBvcHRpb25zLmluZGVudF93aXRoX3RhYnNcbiAgICAgICAgICBvcHRzLmNvbnZlcnRUYWJzVG9TcGFjZXMgPSBmYWxzZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgb3B0cy50YWJTaXplID0gb3B0aW9ucy50YWJfd2lkdGggb3Igb3B0aW9ucy5pbmRlbnRfc2l6ZVxuICAgICAgICAgIG9wdHMuaW5kZW50U2l6ZSA9IG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgICBvcHRzLmluZGVudFN0eWxlID0gJ3NwYWNlJ1xuXG4gICAgICAgIGlmIGxhbmd1YWdlIGlzIFwiVFNYXCJcbiAgICAgICAgICBmaWxlTmFtZSA9ICd0ZXN0LnRzeCdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZpbGVOYW1lID0gJydcblxuICAgICAgICBAdmVyYm9zZSgndHlwZXNjcmlwdCcsIHRleHQsIG9wdHMpXG4gICAgICAgIHJlc3VsdCA9IGZvcm1hdChmaWxlTmFtZSwgdGV4dCwgb3B0cylcbiAgICAgICAgQHZlcmJvc2UocmVzdWx0KVxuICAgICAgICByZXNvbHZlIHJlc3VsdFxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZXR1cm4gcmVqZWN0KGUpXG5cbiAgICApXG4iXX0=

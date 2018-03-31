(function() {
  "use strict";
  var Beautifier, SassConvert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = SassConvert = (function(superClass) {
    extend(SassConvert, superClass);

    function SassConvert() {
      return SassConvert.__super__.constructor.apply(this, arguments);
    }

    SassConvert.prototype.name = "SassConvert";

    SassConvert.prototype.link = "http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax";

    SassConvert.prototype.executables = [
      {
        name: "SassConvert",
        cmd: "sass-convert",
        homepage: "http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax",
        installation: "http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax",
        version: {
          parse: function(text) {
            return text.match(/Sass (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/sass-convert"
        }
      }
    ];

    SassConvert.prototype.options = {
      CSS: false,
      Sass: false,
      SCSS: false
    };

    SassConvert.prototype.beautify = function(text, language, options, context) {
      var lang;
      lang = language.toLowerCase();
      return this.exe("sass-convert").run([this.tempFile("input", text), "--from", lang, "--to", lang]);
    };

    return SassConvert;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9zYXNzLWNvbnZlcnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFDckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLGFBRFI7UUFFRSxHQUFBLEVBQUssY0FGUDtRQUdFLFFBQUEsRUFBVSxvRUFIWjtRQUlFLFlBQUEsRUFBYyxvRUFKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsc0JBQVgsQ0FBbUMsQ0FBQSxDQUFBO1VBQTdDLENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTywwQkFERDtTQVJWO09BRFc7OzswQkFlYixPQUFBLEdBRUU7TUFBQSxHQUFBLEVBQUssS0FBTDtNQUNBLElBQUEsRUFBTSxLQUROO01BRUEsSUFBQSxFQUFNLEtBRk47OzswQkFJRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQjtBQUNSLFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBQTthQUNQLElBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxDQUFvQixDQUFDLEdBQXJCLENBQXlCLENBQ3ZCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUR1QixFQUV2QixRQUZ1QixFQUViLElBRmEsRUFFUCxNQUZPLEVBRUMsSUFGRCxDQUF6QjtJQUZROzs7O0tBeEIrQjtBQUgzQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTYXNzQ29udmVydCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJTYXNzQ29udmVydFwiXG4gIGxpbms6IFwiaHR0cDovL3Nhc3MtbGFuZy5jb20vZG9jdW1lbnRhdGlvbi9maWxlLlNBU1NfUkVGRVJFTkNFLmh0bWwjc3ludGF4XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlNhc3NDb252ZXJ0XCJcbiAgICAgIGNtZDogXCJzYXNzLWNvbnZlcnRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3Nhc3MtbGFuZy5jb20vZG9jdW1lbnRhdGlvbi9maWxlLlNBU1NfUkVGRVJFTkNFLmh0bWwjc3ludGF4XCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vc2Fzcy1sYW5nLmNvbS9kb2N1bWVudGF0aW9uL2ZpbGUuU0FTU19SRUZFUkVOQ0UuaHRtbCNzeW50YXhcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL1Nhc3MgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L3Nhc3MtY29udmVydFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczpcbiAgICAjIFRPRE86IEFkZCBzdXBwb3J0IGZvciBvcHRpb25zXG4gICAgQ1NTOiBmYWxzZVxuICAgIFNhc3M6IGZhbHNlXG4gICAgU0NTUzogZmFsc2VcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIGxhbmcgPSBsYW5ndWFnZS50b0xvd2VyQ2FzZSgpXG4gICAgQGV4ZShcInNhc3MtY29udmVydFwiKS5ydW4oW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dCksXG4gICAgICBcIi0tZnJvbVwiLCBsYW5nLCBcIi0tdG9cIiwgbGFuZ1xuICAgIF0pXG4iXX0=

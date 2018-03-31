
/*
Requires http://hhvm.com/
 */

(function() {
  "use strict";
  var Beautifier, HhFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = HhFormat = (function(superClass) {
    extend(HhFormat, superClass);

    function HhFormat() {
      return HhFormat.__super__.constructor.apply(this, arguments);
    }

    HhFormat.prototype.name = "hh_format";

    HhFormat.prototype.link = "http://hhvm.com/";

    HhFormat.prototype.isPreInstalled = false;

    HhFormat.prototype.options = {
      PHP: false
    };

    HhFormat.prototype.beautify = function(text, language, options) {
      return this.run("hh_format", [this.tempFile("input", text)], {
        help: {
          link: "http://hhvm.com/"
        }
      }).then(function(output) {
        if (output.trim()) {
          return output;
        } else {
          return this.Promise.resolve(new Error("hh_format returned an empty output."));
        }
      });
    };

    return HhFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9oaF9mb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG9CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFDckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUNOLGNBQUEsR0FBZ0I7O3VCQUVoQixPQUFBLEdBQ0U7TUFBQSxHQUFBLEVBQUssS0FBTDs7O3VCQUVGLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBQWtCLENBQ2hCLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQURnQixDQUFsQixFQUdBO1FBQ0UsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLGtCQURGO1NBRFI7T0FIQSxDQU9FLENBQUMsSUFQSCxDQU9RLFNBQUMsTUFBRDtRQUdOLElBQUcsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFIO2lCQUNFLE9BREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFxQixJQUFBLEtBQUEsQ0FBTSxxQ0FBTixDQUFyQixFQUhGOztNQUhNLENBUFI7SUFEUTs7OztLQVI0QjtBQVB4QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cDovL2hodm0uY29tL1xuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBIaEZvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJoaF9mb3JtYXRcIlxuICBsaW5rOiBcImh0dHA6Ly9oaHZtLmNvbS9cIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOlxuICAgIFBIUDogZmFsc2VcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJoaF9mb3JtYXRcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICBdLFxuICAgIHtcbiAgICAgIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwOi8vaGh2bS5jb20vXCJcbiAgICAgIH1cbiAgICB9KS50aGVuKChvdXRwdXQpIC0+XG4gICAgICAjIGhoX2Zvcm1hdCBjYW4gZXhpdCB3aXRoIHN0YXR1cyAwIGFuZCBubyBvdXRwdXQgZm9yIHNvbWUgZmlsZXMgd2hpY2hcbiAgICAgICMgaXQgZG9lc24ndCBmb3JtYXQuICBJbiB0aGF0IGNhc2Ugd2UganVzdCByZXR1cm4gb3JpZ2luYWwgdGV4dC5cbiAgICAgIGlmIG91dHB1dC50cmltKClcbiAgICAgICAgb3V0cHV0XG4gICAgICBlbHNlXG4gICAgICAgIEBQcm9taXNlLnJlc29sdmUobmV3IEVycm9yKFwiaGhfZm9ybWF0IHJldHVybmVkIGFuIGVtcHR5IG91dHB1dC5cIikpXG4gICAgKVxuIl19

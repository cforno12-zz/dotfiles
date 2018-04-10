
/*
Requires https://github.com/lspitzner/brittany
 */

(function() {
  "use strict";
  var Beautifier, Brittany,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Brittany = (function(superClass) {
    extend(Brittany, superClass);

    function Brittany() {
      return Brittany.__super__.constructor.apply(this, arguments);
    }

    Brittany.prototype.name = "brittany";

    Brittany.prototype.link = "https://github.com/lspitzner/brittany";

    Brittany.prototype.isPreInstalled = false;

    Brittany.prototype.options = {
      Haskell: false
    };

    Brittany.prototype.beautify = function(text, language, options) {
      return this.run("brittany", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/lspitzner/brittany"
        }
      });
    };

    return Brittany;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9icml0dGFueS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsb0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3VCQUNyQixJQUFBLEdBQU07O3VCQUNOLElBQUEsR0FBTTs7dUJBQ04sY0FBQSxHQUFnQjs7dUJBRWhCLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxLQURGOzs7dUJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsQ0FDZixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEZSxDQUFqQixFQUVLO1FBQ0QsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLHVDQURGO1NBREw7T0FGTDtJQURROzs7O0tBVDRCO0FBUHhDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vbHNwaXR6bmVyL2JyaXR0YW55XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJyaXR0YW55IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImJyaXR0YW55XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbHNwaXR6bmVyL2JyaXR0YW55XCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIEhhc2tlbGw6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJicml0dGFueVwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbHNwaXR6bmVyL2JyaXR0YW55XCJcbiAgICAgICAgfVxuICAgICAgfSlcbiJdfQ==

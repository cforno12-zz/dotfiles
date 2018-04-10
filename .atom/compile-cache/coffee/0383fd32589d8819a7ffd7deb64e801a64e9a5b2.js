
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Beautifier, ErlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ErlTidy = (function(superClass) {
    extend(ErlTidy, superClass);

    function ErlTidy() {
      return ErlTidy.__super__.constructor.apply(this, arguments);
    }

    ErlTidy.prototype.name = "erl_tidy";

    ErlTidy.prototype.link = "http://erlang.org/doc/man/erl_tidy.html";

    ErlTidy.prototype.isPreInstalled = false;

    ErlTidy.prototype.options = {
      Erlang: true
    };

    ErlTidy.prototype.beautify = function(text, language, options) {
      var tempFile;
      tempFile = void 0;
      return this.tempFile("input", text).then((function(_this) {
        return function(path) {
          tempFile = path;
          return _this.run("erl", [["-eval", 'erl_tidy:file("' + tempFile + '")'], ["-noshell", "-s", "init", "stop"]], {
            help: {
              link: "http://erlang.org/doc/man/erl_tidy.html"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return ErlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9lcmxfdGlkeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUVyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBQ04sY0FBQSxHQUFnQjs7c0JBRWhCLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxJQUREOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsUUFBQSxHQUFXO2FBQ1gsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDNUIsUUFBQSxHQUFXO2lCQUNYLEtBQUMsQ0FBQSxHQUFELENBQUssS0FBTCxFQUFZLENBQ1YsQ0FBQyxPQUFELEVBQVUsaUJBQUEsR0FBb0IsUUFBcEIsR0FBK0IsSUFBekMsQ0FEVSxFQUVWLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsTUFBbkIsRUFBMkIsTUFBM0IsQ0FGVSxDQUFaLEVBSUU7WUFBRSxJQUFBLEVBQU07Y0FBRSxJQUFBLEVBQU0seUNBQVI7YUFBUjtXQUpGO1FBRjRCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixDQVFDLENBQUMsSUFSRixDQVFPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDTCxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FSUDtJQUZROzs7O0tBVjJCO0FBUHZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVybFRpZHkgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJlcmxfdGlkeVwiXG4gIGxpbms6IFwiaHR0cDovL2VybGFuZy5vcmcvZG9jL21hbi9lcmxfdGlkeS5odG1sXCJcbiAgaXNQcmVJbnN0YWxsZWQ6IGZhbHNlXG5cbiAgb3B0aW9uczoge1xuICAgIEVybGFuZzogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICB0ZW1wRmlsZSA9IHVuZGVmaW5lZFxuICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpLnRoZW4oKHBhdGgpID0+XG4gICAgICB0ZW1wRmlsZSA9IHBhdGhcbiAgICAgIEBydW4oXCJlcmxcIiwgW1xuICAgICAgICBbXCItZXZhbFwiLCAnZXJsX3RpZHk6ZmlsZShcIicgKyB0ZW1wRmlsZSArICdcIiknXVxuICAgICAgICBbXCItbm9zaGVsbFwiLCBcIi1zXCIsIFwiaW5pdFwiLCBcInN0b3BcIl1cbiAgICAgICAgXSxcbiAgICAgICAgeyBoZWxwOiB7IGxpbms6IFwiaHR0cDovL2VybGFuZy5vcmcvZG9jL21hbi9lcmxfdGlkeS5odG1sXCIgfSB9XG4gICAgICAgIClcbiAgICApLnRoZW4oPT5cbiAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICApXG4iXX0=

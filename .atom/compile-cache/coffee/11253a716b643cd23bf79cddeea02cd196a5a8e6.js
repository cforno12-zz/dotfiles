(function() {
  "use strict";
  var AlignYaml, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = AlignYaml = (function(superClass) {
    extend(AlignYaml, superClass);

    function AlignYaml() {
      return AlignYaml.__super__.constructor.apply(this, arguments);
    }

    AlignYaml.prototype.name = "align-yaml";

    AlignYaml.prototype.link = "https://github.com/jonschlinkert/align-yaml";

    AlignYaml.prototype.options = {
      YAML: {
        padding: true
      }
    };

    AlignYaml.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var align, result;
        align = require('align-yaml');
        result = align(text, options.padding);
        return resolve(result);
      });
    };

    return AlignYaml;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9hbGlnbi15YW1sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFFTixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsSUFBVDtPQUZLOzs7d0JBS1QsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFlBQVI7UUFDUixNQUFBLEdBQVMsS0FBQSxDQUFNLElBQU4sRUFBWSxPQUFPLENBQUMsT0FBcEI7ZUFDVCxPQUFBLENBQVEsTUFBUjtNQUhrQixDQUFUO0lBREg7Ozs7S0FUNkI7QUFIekMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQWxpZ25ZYW1sIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImFsaWduLXlhbWxcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2FsaWduLXlhbWxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBZQU1MOlxuICAgICAgcGFkZGluZzogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBhbGlnbiA9IHJlcXVpcmUoJ2FsaWduLXlhbWwnKVxuICAgICAgcmVzdWx0ID0gYWxpZ24odGV4dCwgb3B0aW9ucy5wYWRkaW5nKVxuICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgKVxuIl19

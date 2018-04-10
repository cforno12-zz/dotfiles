(function() {
  "use strict";
  var BashBeautify, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = BashBeautify = (function(superClass) {
    extend(BashBeautify, superClass);

    function BashBeautify() {
      return BashBeautify.__super__.constructor.apply(this, arguments);
    }

    BashBeautify.prototype.name = "beautysh";

    BashBeautify.prototype.link = "https://github.com/bemeurer/beautysh";

    BashBeautify.prototype.executables = [
      {
        name: "beautysh",
        cmd: "beautysh",
        homepage: "https://github.com/bemeurer/beautysh",
        installation: "https://github.com/bemeurer/beautysh#installation",
        version: {
          args: ['--help'],
          parse: function(text) {
            return text.indexOf("usage: beautysh") !== -1 && "0.0.0";
          }
        },
        docker: {
          image: "unibeautify/beautysh"
        }
      }
    ];

    BashBeautify.prototype.options = {
      Bash: {
        indent_size: true,
        indent_with_tabs: true
      }
    };

    BashBeautify.prototype.beautify = function(text, language, options) {
      var beautysh, file, tabs;
      beautysh = this.exe("beautysh");
      file = this.tempFile("input", text);
      tabs = options.indent_with_tabs;
      if (tabs === true) {
        return beautysh.run(['-t', '-f', file]).then((function(_this) {
          return function() {
            return _this.readFile(file);
          };
        })(this));
      } else {
        return beautysh.run(['-i', options.indent_size, '-f', file]).then((function(_this) {
          return function() {
            return _this.readFile(file);
          };
        })(this));
      }
    };

    return BashBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9iZWF1dHlzaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzJCQUNyQixJQUFBLEdBQU07OzJCQUNOLElBQUEsR0FBTTs7MkJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sVUFEUjtRQUVFLEdBQUEsRUFBSyxVQUZQO1FBR0UsUUFBQSxFQUFVLHNDQUhaO1FBSUUsWUFBQSxFQUFjLG1EQUpoQjtRQUtFLE9BQUEsRUFBUztVQUVQLElBQUEsRUFBTSxDQUFDLFFBQUQsQ0FGQztVQUdQLEtBQUEsRUFBTyxTQUFDLElBQUQ7bUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBYixDQUFBLEtBQXFDLENBQUMsQ0FBdEMsSUFBNEM7VUFBdEQsQ0FIQTtTQUxYO1FBVUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHNCQUREO1NBVlY7T0FEVzs7OzJCQWlCYixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLGdCQUFBLEVBQWtCLElBRGxCO09BRks7OzsyQkFNVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMO01BQ1gsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQjtNQUNQLElBQUEsR0FBTyxPQUFPLENBQUM7TUFDZixJQUFHLElBQUEsS0FBUSxJQUFYO2VBQ0UsUUFBUSxDQUFDLEdBQVQsQ0FBYSxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWMsSUFBZCxDQUFiLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQURGO09BQUEsTUFBQTtlQUlFLFFBQVEsQ0FBQyxHQUFULENBQWEsQ0FBRSxJQUFGLEVBQVEsT0FBTyxDQUFDLFdBQWhCLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLENBQWIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURSLEVBSkY7O0lBSlE7Ozs7S0ExQmdDO0FBSDVDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJhc2hCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJiZWF1dHlzaFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JlbWV1cmVyL2JlYXV0eXNoXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcImJlYXV0eXNoXCJcbiAgICAgIGNtZDogXCJiZWF1dHlzaFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vYmVtZXVyZXIvYmVhdXR5c2hcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9iZW1ldXJlci9iZWF1dHlzaCNpbnN0YWxsYXRpb25cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICAjIERvZXMgbm90IGRpc3BsYXkgdmVyc2lvblxuICAgICAgICBhcmdzOiBbJy0taGVscCddLFxuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQuaW5kZXhPZihcInVzYWdlOiBiZWF1dHlzaFwiKSBpc250IC0xIGFuZCBcIjAuMC4wXCJcbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9iZWF1dHlzaFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIEJhc2g6XG4gICAgICBpbmRlbnRfc2l6ZTogdHJ1ZVxuICAgICAgaW5kZW50X3dpdGhfdGFiczogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBiZWF1dHlzaCA9IEBleGUoXCJiZWF1dHlzaFwiKVxuICAgIGZpbGUgPSBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgIHRhYnMgPSBvcHRpb25zLmluZGVudF93aXRoX3RhYnNcbiAgICBpZiB0YWJzIGlzIHRydWVcbiAgICAgIGJlYXV0eXNoLnJ1bihbICctdCcsICctZicsIGZpbGUgXSlcbiAgICAgICAgLnRoZW4oPT4gQHJlYWRGaWxlIGZpbGUpXG4gICAgZWxzZVxuICAgICAgYmVhdXR5c2gucnVuKFsgJy1pJywgb3B0aW9ucy5pbmRlbnRfc2l6ZSwgJy1mJywgZmlsZSBdKVxuICAgICAgICAudGhlbig9PiBAcmVhZEZpbGUgZmlsZSlcbiJdfQ==

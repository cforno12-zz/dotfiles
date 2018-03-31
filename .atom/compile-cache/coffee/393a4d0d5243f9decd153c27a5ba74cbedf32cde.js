(function() {
  "use strict";
  var Beautifier, JSBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(superClass) {
    extend(JSBeautify, superClass);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.link = "https://github.com/beautify-web/js-beautify";

    JSBeautify.prototype.options = {
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      JavaScript: true,
      EJS: true,
      JSX: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true,
        end_with_newline: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      this.verbose("JS Beautify language " + language);
      this.info("JS Beautify Options: " + (JSON.stringify(options, null, 4)));
      options.eol = this.getDefaultLineEnding('\r\n', '\n', options.end_of_line);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
              case "JSX":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "EJS":
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
              default:
                return reject(new Error("Unknown language for JS Beautify: " + language));
            }
          } catch (error) {
            err = error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qcy1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBRU4sT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUFNLElBREM7TUFFUCxHQUFBLEVBQUssSUFGRTtNQUdQLFVBQUEsRUFBWSxJQUhMO01BSVAsUUFBQSxFQUFVLElBSkg7TUFLUCxVQUFBLEVBQVksSUFMTDtNQU1QLEdBQUEsRUFBSyxJQU5FO01BT1AsR0FBQSxFQUFLLElBUEU7TUFRUCxJQUFBLEVBQU0sSUFSQztNQVNQLEdBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxJQUFiO1FBQ0EsV0FBQSxFQUFhLElBRGI7UUFFQSwwQkFBQSxFQUE0QixJQUY1QjtRQUdBLHFCQUFBLEVBQXVCLElBSHZCO1FBSUEsaUJBQUEsRUFBbUIsSUFKbkI7UUFLQSxnQkFBQSxFQUFrQixJQUxsQjtRQU1BLGdCQUFBLEVBQWtCLElBTmxCO09BVks7Ozt5QkFtQlQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7TUFDUixJQUFDLENBQUEsT0FBRCxDQUFTLHVCQUFBLEdBQXdCLFFBQWpDO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSx1QkFBQSxHQUF1QixDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFELENBQTdCO01BQ0EsT0FBTyxDQUFDLEdBQVIsR0FBYyxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsRUFBNkIsSUFBN0IsRUFBa0MsT0FBTyxDQUFDLFdBQTFDO0FBQ2QsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLGNBQUE7QUFBQTtBQUNFLG9CQUFPLFFBQVA7QUFBQSxtQkFDTyxNQURQO0FBQUEsbUJBQ2UsWUFEZjtBQUFBLG1CQUM2QixLQUQ3QjtnQkFFSSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7Z0JBQ2IsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLE9BQWpCO3VCQUNQLE9BQUEsQ0FBUSxJQUFSO0FBSkosbUJBS08sWUFMUDtBQUFBLG1CQUtxQixVQUxyQjtnQkFPSSxPQUFPLENBQUMsaUJBQVIsR0FBNEI7Z0JBRTVCLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUN0QyxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFYSixtQkFZTyxLQVpQO0FBQUEsbUJBWWMsZUFaZDtBQUFBLG1CQVkrQixNQVovQjtBQUFBLG1CQVl1QyxLQVp2QztBQUFBLG1CQVk4Qyx1QkFaOUM7QUFBQSxtQkFZdUUsa0JBWnZFO2dCQWFJLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUN0QyxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7Z0JBQ1AsS0FBQyxDQUFBLEtBQUQsQ0FBTyxtQkFBQSxHQUFvQixJQUEzQjt1QkFDQSxPQUFBLENBQVEsSUFBUjtBQWhCSixtQkFpQk8sS0FqQlA7Z0JBa0JJLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUNyQyxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFwQko7dUJBc0JJLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxvQ0FBQSxHQUFxQyxRQUEzQyxDQUFYO0FBdEJKLGFBREY7V0FBQSxhQUFBO1lBd0JNO1lBQ0osS0FBQyxDQUFBLEtBQUQsQ0FBTyxxQkFBQSxHQUFzQixHQUE3QjttQkFDQSxNQUFBLENBQU8sR0FBUCxFQTFCRjs7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFKSDs7OztLQXZCOEI7QUFIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSlNCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJKUyBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JlYXV0aWZ5LXdlYi9qcy1iZWF1dGlmeVwiXG5cbiAgb3B0aW9uczoge1xuICAgIEhUTUw6IHRydWVcbiAgICBYTUw6IHRydWVcbiAgICBIYW5kbGViYXJzOiB0cnVlXG4gICAgTXVzdGFjaGU6IHRydWVcbiAgICBKYXZhU2NyaXB0OiB0cnVlXG4gICAgRUpTOiB0cnVlXG4gICAgSlNYOiB0cnVlXG4gICAgSlNPTjogdHJ1ZVxuICAgIENTUzpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBpbmRlbnRfY2hhcjogdHJ1ZVxuICAgICAgc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmU6IHRydWVcbiAgICAgIG5ld2xpbmVfYmV0d2Vlbl9ydWxlczogdHJ1ZVxuICAgICAgcHJlc2VydmVfbmV3bGluZXM6IHRydWVcbiAgICAgIHdyYXBfbGluZV9sZW5ndGg6IHRydWVcbiAgICAgIGVuZF93aXRoX25ld2xpbmU6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHZlcmJvc2UoXCJKUyBCZWF1dGlmeSBsYW5ndWFnZSAje2xhbmd1YWdlfVwiKVxuICAgIEBpbmZvKFwiSlMgQmVhdXRpZnkgT3B0aW9uczogI3tKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCA0KX1cIilcbiAgICBvcHRpb25zLmVvbCA9IEBnZXREZWZhdWx0TGluZUVuZGluZygnXFxyXFxuJywnXFxuJyxvcHRpb25zLmVuZF9vZl9saW5lKVxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHRyeVxuICAgICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgICB3aGVuIFwiSlNPTlwiLCBcIkphdmFTY3JpcHRcIiwgXCJKU1hcIlxuICAgICAgICAgICAgYmVhdXRpZnlKUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKVxuICAgICAgICAgICAgdGV4dCA9IGJlYXV0aWZ5SlModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJIYW5kbGViYXJzXCIsIFwiTXVzdGFjaGVcIlxuICAgICAgICAgICAgIyBqc2hpbnQgaWdub3JlOiBzdGFydFxuICAgICAgICAgICAgb3B0aW9ucy5pbmRlbnRfaGFuZGxlYmFycyA9IHRydWUgIyBGb3JjZSBqc2JlYXV0aWZ5IHRvIGluZGVudF9oYW5kbGViYXJzXG4gICAgICAgICAgICAjIGpzaGludCBpZ25vcmU6IGVuZFxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJFSlNcIiwgXCJIVE1MIChMaXF1aWQpXCIsIFwiSFRNTFwiLCBcIlhNTFwiLCBcIldlYiBGb3JtL0NvbnRyb2wgKEMjKVwiLCBcIldlYiBIYW5kbGVyIChDIylcIlxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIEBkZWJ1ZyhcIkJlYXV0aWZpZWQgSFRNTDogI3t0ZXh0fVwiKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICAgICAgd2hlbiBcIkNTU1wiXG4gICAgICAgICAgICBiZWF1dGlmeUNTUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5jc3NcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUNTUyh0ZXh0LCBvcHRpb25zKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlVua25vd24gbGFuZ3VhZ2UgZm9yIEpTIEJlYXV0aWZ5OiBcIitsYW5ndWFnZSkpXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgQGVycm9yKFwiSlMgQmVhdXRpZnkgZXJyb3I6ICN7ZXJyfVwiKVxuICAgICAgICByZWplY3QoZXJyKVxuXG4gICAgKVxuIl19

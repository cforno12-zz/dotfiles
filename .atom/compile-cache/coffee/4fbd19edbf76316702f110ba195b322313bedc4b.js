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
      Blade: true,
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
              case "Blade":
                beautifyHTML = require("js-beautify").html;
                text = text.replace(/\@(?!yield)([^\n\s]*)/ig, "<blade $1 />");
                text = beautifyHTML(text, options);
                text = text.replace(/<blade ([^\n\s]*)\s*\/>/ig, "@$1");
                text = text.replace(/\(\ \'/ig, "('");
                _this.debug("Beautified HTML: " + text);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qcy1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBRU4sT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7TUFFUCxJQUFBLEVBQU0sSUFGQztNQUdQLEdBQUEsRUFBSyxJQUhFO01BSVAsVUFBQSxFQUFZLElBSkw7TUFLUCxRQUFBLEVBQVUsSUFMSDtNQU1QLFVBQUEsRUFBWSxJQU5MO01BT1AsR0FBQSxFQUFLLElBUEU7TUFRUCxHQUFBLEVBQUssSUFSRTtNQVNQLElBQUEsRUFBTSxJQVRDO01BVVAsR0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxXQUFBLEVBQWEsSUFEYjtRQUVBLDBCQUFBLEVBQTRCLElBRjVCO1FBR0EscUJBQUEsRUFBdUIsSUFIdkI7UUFJQSxpQkFBQSxFQUFtQixJQUpuQjtRQUtBLGdCQUFBLEVBQWtCLElBTGxCO1FBTUEsZ0JBQUEsRUFBa0IsSUFObEI7T0FYSzs7O3lCQW9CVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtNQUNSLElBQUMsQ0FBQSxPQUFELENBQVMsdUJBQUEsR0FBd0IsUUFBakM7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLHVCQUFBLEdBQXVCLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQUQsQ0FBN0I7TUFDQSxPQUFPLENBQUMsR0FBUixHQUFjLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixNQUF0QixFQUE2QixJQUE3QixFQUFrQyxPQUFPLENBQUMsV0FBMUM7QUFDZCxhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsY0FBQTtBQUFBO0FBQ0Usb0JBQU8sUUFBUDtBQUFBLG1CQUNPLE1BRFA7QUFBQSxtQkFDZSxZQURmO0FBQUEsbUJBQzZCLEtBRDdCO2dCQUVJLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjtnQkFDYixJQUFBLEdBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsT0FBakI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFKSixtQkFLTyxZQUxQO0FBQUEsbUJBS3FCLFVBTHJCO2dCQU9JLE9BQU8sQ0FBQyxpQkFBUixHQUE0QjtnQkFFNUIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7Z0JBQ3RDLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixPQUFuQjt1QkFDUCxPQUFBLENBQVEsSUFBUjtBQVhKLG1CQVlPLEtBWlA7QUFBQSxtQkFZYyxlQVpkO0FBQUEsbUJBWStCLE1BWi9CO0FBQUEsbUJBWXVDLEtBWnZDO0FBQUEsbUJBWThDLHVCQVo5QztBQUFBLG1CQVl1RSxrQkFadkU7Z0JBYUksWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7Z0JBQ3RDLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixPQUFuQjtnQkFDUCxLQUFDLENBQUEsS0FBRCxDQUFPLG1CQUFBLEdBQW9CLElBQTNCO3VCQUNBLE9BQUEsQ0FBUSxJQUFSO0FBaEJKLG1CQWlCTyxLQWpCUDtnQkFrQkksV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7Z0JBQ3JDLElBQUEsR0FBTyxXQUFBLENBQVksSUFBWixFQUFrQixPQUFsQjt1QkFDUCxPQUFBLENBQVEsSUFBUjtBQXBCSixtQkFxQk8sT0FyQlA7Z0JBc0JJLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUV0QyxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSx5QkFBYixFQUF3QyxjQUF4QztnQkFDUCxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7Z0JBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsMkJBQWIsRUFBMEMsS0FBMUM7Z0JBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUF5QixJQUF6QjtnQkFDUCxLQUFDLENBQUEsS0FBRCxDQUFPLG1CQUFBLEdBQW9CLElBQTNCO3VCQUNBLE9BQUEsQ0FBUSxJQUFSO0FBOUJKO3VCQWdDSSxNQUFBLENBQU8sSUFBSSxLQUFKLENBQVUsb0NBQUEsR0FBcUMsUUFBL0MsQ0FBUDtBQWhDSixhQURGO1dBQUEsYUFBQTtZQWtDTTtZQUNKLEtBQUMsQ0FBQSxLQUFELENBQU8scUJBQUEsR0FBc0IsR0FBN0I7bUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUFwQ0Y7O1FBRGtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO0lBSkM7Ozs7S0F4QjhCO0FBSDFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEpTQmVhdXRpZnkgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiSlMgQmVhdXRpZnlcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9iZWF1dGlmeS13ZWIvanMtYmVhdXRpZnlcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBCbGFkZTogdHJ1ZVxuICAgIEhUTUw6IHRydWVcbiAgICBYTUw6IHRydWVcbiAgICBIYW5kbGViYXJzOiB0cnVlXG4gICAgTXVzdGFjaGU6IHRydWVcbiAgICBKYXZhU2NyaXB0OiB0cnVlXG4gICAgRUpTOiB0cnVlXG4gICAgSlNYOiB0cnVlXG4gICAgSlNPTjogdHJ1ZVxuICAgIENTUzpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBpbmRlbnRfY2hhcjogdHJ1ZVxuICAgICAgc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmU6IHRydWVcbiAgICAgIG5ld2xpbmVfYmV0d2Vlbl9ydWxlczogdHJ1ZVxuICAgICAgcHJlc2VydmVfbmV3bGluZXM6IHRydWVcbiAgICAgIHdyYXBfbGluZV9sZW5ndGg6IHRydWVcbiAgICAgIGVuZF93aXRoX25ld2xpbmU6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHZlcmJvc2UoXCJKUyBCZWF1dGlmeSBsYW5ndWFnZSAje2xhbmd1YWdlfVwiKVxuICAgIEBpbmZvKFwiSlMgQmVhdXRpZnkgT3B0aW9uczogI3tKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCA0KX1cIilcbiAgICBvcHRpb25zLmVvbCA9IEBnZXREZWZhdWx0TGluZUVuZGluZygnXFxyXFxuJywnXFxuJyxvcHRpb25zLmVuZF9vZl9saW5lKVxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHRyeVxuICAgICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgICB3aGVuIFwiSlNPTlwiLCBcIkphdmFTY3JpcHRcIiwgXCJKU1hcIlxuICAgICAgICAgICAgYmVhdXRpZnlKUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKVxuICAgICAgICAgICAgdGV4dCA9IGJlYXV0aWZ5SlModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJIYW5kbGViYXJzXCIsIFwiTXVzdGFjaGVcIlxuICAgICAgICAgICAgIyBqc2hpbnQgaWdub3JlOiBzdGFydFxuICAgICAgICAgICAgb3B0aW9ucy5pbmRlbnRfaGFuZGxlYmFycyA9IHRydWUgIyBGb3JjZSBqc2JlYXV0aWZ5IHRvIGluZGVudF9oYW5kbGViYXJzXG4gICAgICAgICAgICAjIGpzaGludCBpZ25vcmU6IGVuZFxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJFSlNcIiwgXCJIVE1MIChMaXF1aWQpXCIsIFwiSFRNTFwiLCBcIlhNTFwiLCBcIldlYiBGb3JtL0NvbnRyb2wgKEMjKVwiLCBcIldlYiBIYW5kbGVyIChDIylcIlxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIEBkZWJ1ZyhcIkJlYXV0aWZpZWQgSFRNTDogI3t0ZXh0fVwiKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICAgICAgd2hlbiBcIkNTU1wiXG4gICAgICAgICAgICBiZWF1dGlmeUNTUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5jc3NcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUNTUyh0ZXh0LCBvcHRpb25zKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICAgICAgd2hlbiBcIkJsYWRlXCJcbiAgICAgICAgICAgIGJlYXV0aWZ5SFRNTCA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5odG1sXG4gICAgICAgICAgICAjIHByZSBzY3JpcHQgKFdvcmthcm91bmQpXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXEAoPyF5aWVsZCkoW15cXG5cXHNdKikvaWcsIFwiPGJsYWRlICQxIC8+XCIpXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlIVE1MKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICAjIHBvc3Qgc2NyaXB0IChXb3JrYXJvdW5kKVxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvPGJsYWRlIChbXlxcblxcc10qKVxccypcXC8+L2lnLCBcIkAkMVwiKVxuICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFwoXFwgXFwnL2lnLCBcIignXCIpXG4gICAgICAgICAgICBAZGVidWcoXCJCZWF1dGlmaWVkIEhUTUw6ICN7dGV4dH1cIilcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJVbmtub3duIGxhbmd1YWdlIGZvciBKUyBCZWF1dGlmeTogXCIrbGFuZ3VhZ2UpKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIEBlcnJvcihcIkpTIEJlYXV0aWZ5IGVycm9yOiAje2Vycn1cIilcbiAgICAgICAgcmVqZWN0KGVycilcblxuICAgIClcbiJdfQ==

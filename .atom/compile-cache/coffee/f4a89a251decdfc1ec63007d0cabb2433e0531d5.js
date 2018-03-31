(function() {
  "use strict";
  var Beautifier, VueBeautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = VueBeautifier = (function(superClass) {
    extend(VueBeautifier, superClass);

    function VueBeautifier() {
      return VueBeautifier.__super__.constructor.apply(this, arguments);
    }

    VueBeautifier.prototype.name = "Vue Beautifier";

    VueBeautifier.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/vue-beautifier.coffee";

    VueBeautifier.prototype.options = {
      Vue: true
    };

    VueBeautifier.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var _, prettydiff, regexp, results;
          prettydiff = require("prettydiff2");
          _ = require('lodash');
          regexp = /(^<(template|script|style)[^>]*>)((\s|\S)*?)^<\/\2>/gim;
          results = text.replace(regexp, function(match, begin, type, text) {
            var beautifiedText, lang, ref, replaceText, result;
            lang = (ref = /lang\s*=\s*['"](\w+)["']/.exec(begin)) != null ? ref[1] : void 0;
            replaceText = text;
            text = text.trim();
            beautifiedText = ((function() {
              switch (type) {
                case "template":
                  switch (lang) {
                    case "pug":
                    case "jade":
                      return require("pug-beautify")(text, options);
                    case void 0:
                      return require("js-beautify").html(text, options);
                    default:
                      return void 0;
                  }
                  break;
                case "script":
                  return require("js-beautify")(text, options);
                case "style":
                  switch (lang) {
                    case "scss":
                      options = _.merge(options, {
                        source: text,
                        lang: "scss",
                        mode: "beautify"
                      });
                      return prettydiff(options);
                    case "less":
                      options = _.merge(options, {
                        source: text,
                        lang: "less",
                        mode: "beautify"
                      });
                      return prettydiff(options);
                    case void 0:
                      return require("js-beautify").css(text, options);
                    default:
                      return void 0;
                  }
              }
            })());
            result = beautifiedText ? match.replace(replaceText, "\n" + (beautifiedText.trim()) + "\n") : match;
            _this.verbose("Vue part", match, begin, type, text, lang, result);
            return result;
          });
          _this.verbose("Vue final results", results);
          return resolve(results);
        };
      })(this));
    };

    return VueBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy92dWUtYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzRCQUNyQixJQUFBLEdBQU07OzRCQUNOLElBQUEsR0FBTTs7NEJBRU4sT0FBQSxHQUNFO01BQUEsR0FBQSxFQUFLLElBQUw7Ozs0QkFFRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixjQUFBO1VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSO1VBQ2IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1VBQ0osTUFBQSxHQUFTO1VBRVQsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixFQUFxQixJQUFyQjtBQUM3QixnQkFBQTtZQUFBLElBQUEsK0RBQStDLENBQUEsQ0FBQTtZQUMvQyxXQUFBLEdBQWM7WUFDZCxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBQTtZQUNQLGNBQUEsR0FBaUI7QUFBQyxzQkFBTyxJQUFQO0FBQUEscUJBQ1gsVUFEVztBQUVkLDBCQUFPLElBQVA7QUFBQSx5QkFDTyxLQURQO0FBQUEseUJBQ2MsTUFEZDs2QkFFSSxPQUFBLENBQVEsY0FBUixDQUFBLENBQXdCLElBQXhCLEVBQThCLE9BQTlCO0FBRkoseUJBR08sTUFIUDs2QkFJSSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQTVCLEVBQWtDLE9BQWxDO0FBSko7NkJBTUk7QUFOSjtBQURHO0FBRFcscUJBU1gsUUFUVzt5QkFVZCxPQUFBLENBQVEsYUFBUixDQUFBLENBQXVCLElBQXZCLEVBQTZCLE9BQTdCO0FBVmMscUJBV1gsT0FYVztBQVlkLDBCQUFPLElBQVA7QUFBQSx5QkFDTyxNQURQO3NCQUVJLE9BQUEsR0FBVSxDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFDUjt3QkFBQSxNQUFBLEVBQVEsSUFBUjt3QkFDQSxJQUFBLEVBQU0sTUFETjt3QkFFQSxJQUFBLEVBQU0sVUFGTjt1QkFEUTs2QkFLVixVQUFBLENBQVcsT0FBWDtBQVBKLHlCQVFPLE1BUlA7c0JBU0ksT0FBQSxHQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsT0FBUixFQUNSO3dCQUFBLE1BQUEsRUFBUSxJQUFSO3dCQUNBLElBQUEsRUFBTSxNQUROO3dCQUVBLElBQUEsRUFBTSxVQUZOO3VCQURROzZCQUtWLFVBQUEsQ0FBVyxPQUFYO0FBZEoseUJBZU8sTUFmUDs2QkFnQkksT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxHQUF2QixDQUEyQixJQUEzQixFQUFpQyxPQUFqQztBQWhCSjs2QkFrQkk7QUFsQko7QUFaYztnQkFBRDtZQWdDakIsTUFBQSxHQUFZLGNBQUgsR0FBdUIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxXQUFkLEVBQTJCLElBQUEsR0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFmLENBQUEsQ0FBRCxDQUFKLEdBQTJCLElBQXRELENBQXZCLEdBQXVGO1lBQ2hHLEtBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxJQUFuQyxFQUF5QyxJQUF6QyxFQUErQyxJQUEvQyxFQUFxRCxNQUFyRDtBQUNBLG1CQUFPO1VBdENzQixDQUFyQjtVQXdDVixLQUFDLENBQUEsT0FBRCxDQUFTLG1CQUFULEVBQThCLE9BQTlCO2lCQUNBLE9BQUEsQ0FBUSxPQUFSO1FBOUNrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtJQURIOzs7O0tBUGlDO0FBSDdDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFZ1ZUJlYXV0aWZpZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiVnVlIEJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9ibG9iL21hc3Rlci9zcmMvYmVhdXRpZmllcnMvdnVlLWJlYXV0aWZpZXIuY29mZmVlXCJcblxuICBvcHRpb25zOlxuICAgIFZ1ZTogdHJ1ZVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcHJldHR5ZGlmZiA9IHJlcXVpcmUoXCJwcmV0dHlkaWZmMlwiKVxuICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gICAgICByZWdleHAgPSAvKF48KHRlbXBsYXRlfHNjcmlwdHxzdHlsZSlbXj5dKj4pKChcXHN8XFxTKSo/KV48XFwvXFwyPi9naW1cblxuICAgICAgcmVzdWx0cyA9IHRleHQucmVwbGFjZShyZWdleHAsIChtYXRjaCwgYmVnaW4sIHR5cGUsIHRleHQpID0+XG4gICAgICAgIGxhbmcgPSAvbGFuZ1xccyo9XFxzKlsnXCJdKFxcdyspW1wiJ10vLmV4ZWMoYmVnaW4pP1sxXVxuICAgICAgICByZXBsYWNlVGV4dCA9IHRleHRcbiAgICAgICAgdGV4dCA9IHRleHQudHJpbSgpXG4gICAgICAgIGJlYXV0aWZpZWRUZXh0ID0gKHN3aXRjaCB0eXBlXG4gICAgICAgICAgd2hlbiBcInRlbXBsYXRlXCJcbiAgICAgICAgICAgIHN3aXRjaCBsYW5nXG4gICAgICAgICAgICAgIHdoZW4gXCJwdWdcIiwgXCJqYWRlXCJcbiAgICAgICAgICAgICAgICByZXF1aXJlKFwicHVnLWJlYXV0aWZ5XCIpKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICAgIHdoZW4gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICAgIHdoZW4gXCJzY3JpcHRcIlxuICAgICAgICAgICAgcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgd2hlbiBcInN0eWxlXCJcbiAgICAgICAgICAgIHN3aXRjaCBsYW5nXG4gICAgICAgICAgICAgIHdoZW4gXCJzY3NzXCJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gXy5tZXJnZShvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgc291cmNlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICBsYW5nOiBcInNjc3NcIlxuICAgICAgICAgICAgICAgICAgbW9kZTogXCJiZWF1dGlmeVwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHByZXR0eWRpZmYob3B0aW9ucylcbiAgICAgICAgICAgICAgd2hlbiBcImxlc3NcIlxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBfLm1lcmdlKG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6IHRleHRcbiAgICAgICAgICAgICAgICAgIGxhbmc6IFwibGVzc1wiXG4gICAgICAgICAgICAgICAgICBtb2RlOiBcImJlYXV0aWZ5XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgcHJldHR5ZGlmZihvcHRpb25zKVxuICAgICAgICAgICAgICB3aGVuIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5jc3ModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICApXG4gICAgICAgIHJlc3VsdCA9IGlmIGJlYXV0aWZpZWRUZXh0IHRoZW4gbWF0Y2gucmVwbGFjZShyZXBsYWNlVGV4dCwgXCJcXG4je2JlYXV0aWZpZWRUZXh0LnRyaW0oKX1cXG5cIikgZWxzZSBtYXRjaFxuICAgICAgICBAdmVyYm9zZShcIlZ1ZSBwYXJ0XCIsIG1hdGNoLCBiZWdpbiwgdHlwZSwgdGV4dCwgbGFuZywgcmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICApXG4gICAgICBAdmVyYm9zZShcIlZ1ZSBmaW5hbCByZXN1bHRzXCIsIHJlc3VsdHMpXG4gICAgICByZXNvbHZlKHJlc3VsdHMpXG4gICAgKVxuIl19

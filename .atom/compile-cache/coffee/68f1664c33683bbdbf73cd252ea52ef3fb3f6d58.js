(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(superClass) {
    extend(PrettyDiff, superClass);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.link = "https://github.com/prettydiff/prettydiff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines",
        bracepadding: "space_in_paren"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      Mustache: true,
      Nunjucks: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      "UX Markup": true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true,
      "Golang Template": true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      options.crlf = this.getDefaultLineEnding(true, false, options.end_of_line);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var _, args, lang, output, prettydiff, result;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "Coldfusion":
              lang = "html";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
            case "Nunjucks":
            case "UX Markup":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            case "Golang Template":
              lang = "go";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wcmV0dHlkaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7eUJBQ3JCLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFDTixPQUFBLEdBQVM7TUFFUCxDQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CO1lBQzFDLElBQUksZ0JBQUEsS0FBb0IsSUFBeEI7cUJBQ0UsS0FERjthQUFBLE1BQUE7cUJBQ1ksWUFEWjs7VUFEMEMsQ0FBcEM7U0FBUjtRQUlBLE1BQUEsRUFBUTtVQUFDLGtCQUFELEVBQXFCLGFBQXJCLEVBQW9DLFNBQUMsZ0JBQUQsRUFBbUIsV0FBbkI7WUFDMUMsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxFQURGO2FBQUEsTUFBQTtxQkFDUyxZQURUOztVQUQwQyxDQUFwQztTQUpSO1FBUUEsT0FBQSxFQUFTLFNBQUMsT0FBRDtpQkFDUCxPQUFBLElBQVc7UUFESixDQVJUO1FBVUEsUUFBQSxFQUFVO1VBQUMsbUJBQUQsRUFBc0IsU0FBQyxpQkFBRDtZQUM5QixJQUFJLGlCQUFBLEtBQXFCLElBQXpCO3FCQUNFLE1BREY7YUFBQSxNQUFBO3FCQUNhLE9BRGI7O1VBRDhCLENBQXRCO1NBVlY7UUFjQSxjQUFBLEVBQWdCLHVCQWRoQjtRQWVBLFFBQUEsRUFBVTtVQUFDLGlCQUFELEVBQW9CLFNBQUMsZUFBRDtZQUM1QixJQUFJLGVBQUEsS0FBbUIsS0FBdkI7cUJBQ0UsV0FERjthQUFBLE1BQUE7cUJBQ2tCLFNBRGxCOztVQUQ0QixDQUFwQjtTQWZWO1FBbUJBLEtBQUEsRUFBTyxtQkFuQlA7UUFvQkEsWUFBQSxFQUFjLGdCQXBCZDtRQXFCQSxRQUFBLEVBQVU7VUFBQyxtQkFBRCxFQUFzQixTQUFDLGlCQUFEO1lBQzlCLElBQUksaUJBQUEsS0FBcUIsSUFBekI7cUJBQ0UsTUFERjthQUFBLE1BQUE7cUJBQ2EsT0FEYjs7VUFEOEIsQ0FBdEI7U0FyQlY7UUF5QkEsSUFBQSxFQUFNLGtCQXpCTjtRQTBCQSxLQUFBLEVBQU8sMkJBMUJQO1FBMkJBLFVBQUEsRUFBWSxjQTNCWjtRQTRCQSxRQUFBLEVBQVUsZ0JBNUJWO1FBNkJBLFdBQUEsRUFBYTtVQUFDLHVCQUFELEVBQTBCLFNBQUMscUJBQUQ7WUFDckMsSUFBSSxxQkFBQSxLQUF5QixJQUE3QjtxQkFDRSxNQURGO2FBQUEsTUFBQTtxQkFDYSxLQURiOztVQURxQyxDQUExQjtTQTdCYjtRQWlDQSxXQUFBLEVBQWEsd0JBakNiO1FBa0NBLFlBQUEsRUFBYyxnQkFsQ2Q7T0FISztNQXVDUCxHQUFBLEVBQUssSUF2Q0U7TUF3Q1AsVUFBQSxFQUFZLElBeENMO01BeUNQLEdBQUEsRUFBSyxJQXpDRTtNQTBDUCxHQUFBLEVBQUssSUExQ0U7TUEyQ1AsSUFBQSxFQUFNLElBM0NDO01BNENQLFVBQUEsRUFBWSxJQTVDTDtNQTZDUCxRQUFBLEVBQVUsSUE3Q0g7TUE4Q1AsUUFBQSxFQUFVLElBOUNIO01BK0NQLEdBQUEsRUFBSyxJQS9DRTtNQWdEUCxHQUFBLEVBQUssSUFoREU7TUFpRFAsU0FBQSxFQUFXLElBakRKO01Ba0RQLEdBQUEsRUFBSyxJQWxERTtNQW1EUCxVQUFBLEVBQVksSUFuREw7TUFvRFAsR0FBQSxFQUFLLElBcERFO01BcURQLElBQUEsRUFBTSxJQXJEQztNQXNEUCxJQUFBLEVBQU0sSUF0REM7TUF1RFAsR0FBQSxFQUFLLElBdkRFO01Bd0RQLElBQUEsRUFBTSxJQXhEQztNQXlEUCxJQUFBLEVBQU0sSUF6REM7TUEwRFAsSUFBQSxFQUFNLElBMURDO01BMkRQLFdBQUEsRUFBYSxJQTNETjtNQTREUCxXQUFBLEVBQWEsSUE1RE47TUE2RFAsU0FBQSxFQUFXLElBN0RKO01BOERQLFNBQUEsRUFBVyxJQTlESjtNQStEUCxpQkFBQSxFQUFtQixJQS9EWjs7O3lCQWtFVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtNQUNSLE9BQU8sQ0FBQyxJQUFSLEdBQWUsSUFBQyxDQUFBLG9CQUFELENBQXNCLElBQXRCLEVBQTJCLEtBQTNCLEVBQWlDLE9BQU8sQ0FBQyxXQUF6QztBQUNmLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixjQUFBO1VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSO1VBQ2IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1VBR0osSUFBQSxHQUFPO0FBQ1Asa0JBQU8sUUFBUDtBQUFBLGlCQUNPLEtBRFA7Y0FFSSxJQUFBLEdBQU87QUFESjtBQURQLGlCQUdPLFlBSFA7Y0FJSSxJQUFBLEdBQU87QUFESjtBQUhQLGlCQUtPLEtBTFA7QUFBQSxpQkFLYyxNQUxkO2NBTUksSUFBQSxHQUFPO0FBREc7QUFMZCxpQkFPTyxLQVBQO2NBUUksSUFBQSxHQUFPO0FBREo7QUFQUCxpQkFTTyxZQVRQO0FBQUEsaUJBU3FCLFVBVHJCO0FBQUEsaUJBU2lDLFdBVGpDO0FBQUEsaUJBUzhDLE1BVDlDO0FBQUEsaUJBU3NELFNBVHREO0FBQUEsaUJBU2lFLFdBVGpFO2NBVUksSUFBQSxHQUFPO0FBRHNEO0FBVGpFLGlCQVdPLE1BWFA7Y0FZSSxJQUFBLEdBQU87QUFESjtBQVhQLGlCQWFPLEtBYlA7QUFBQSxpQkFhYyxhQWJkO0FBQUEsaUJBYTZCLEtBYjdCO2NBY0ksSUFBQSxHQUFPO0FBRGtCO0FBYjdCLGlCQWVPLE1BZlA7QUFBQSxpQkFlZSxVQWZmO0FBQUEsaUJBZTJCLFdBZjNCO2NBZ0JJLElBQUEsR0FBTztBQURnQjtBQWYzQixpQkFpQk8sWUFqQlA7Y0FrQkksSUFBQSxHQUFPO0FBREo7QUFqQlAsaUJBbUJPLE1BbkJQO2NBb0JJLElBQUEsR0FBTztBQURKO0FBbkJQLGlCQXFCTyxLQXJCUDtjQXNCSSxJQUFBLEdBQU87QUFESjtBQXJCUCxpQkF1Qk8sTUF2QlA7Y0F3QkksSUFBQSxHQUFPO0FBREo7QUF2QlAsaUJBeUJPLEtBekJQO2NBMEJJLElBQUEsR0FBTztBQURKO0FBekJQLGlCQTJCTyxNQTNCUDtjQTRCSSxJQUFBLEdBQU87QUFESjtBQTNCUCxpQkE2Qk8sTUE3QlA7Y0E4QkksSUFBQSxHQUFPO0FBREo7QUE3QlAsaUJBK0JPLEtBL0JQO2NBZ0NJLElBQUEsR0FBTztBQURKO0FBL0JQLGlCQWlDTyxpQkFqQ1A7Y0FrQ0ksSUFBQSxHQUFPO0FBREo7QUFqQ1A7Y0FvQ0ksSUFBQSxHQUFPO0FBcENYO1VBdUNBLElBQUEsR0FDRTtZQUFBLE1BQUEsRUFBUSxJQUFSO1lBQ0EsSUFBQSxFQUFNLElBRE47WUFFQSxJQUFBLEVBQU0sVUFGTjs7VUFLRixDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFBaUIsSUFBakI7VUFHQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsT0FBdkI7VUFDQSxNQUFBLEdBQVMsVUFBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmO1VBQ1QsTUFBQSxHQUFTLE1BQU8sQ0FBQSxDQUFBO2lCQUdoQixPQUFBLENBQVEsTUFBUjtRQTNEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFGSDs7OztLQXJFOEI7QUFIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJldHR5RGlmZiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQcmV0dHkgRGlmZlwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3ByZXR0eWRpZmYvcHJldHR5ZGlmZlwiXG4gIG9wdGlvbnM6IHtcbiAgICAjIEFwcGx5IHRoZXNlIG9wdGlvbnMgZmlyc3QgLyBnbG9iYWxseSwgZm9yIGFsbCBsYW5ndWFnZXNcbiAgICBfOlxuICAgICAgaW5jaGFyOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X2NoYXJcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9jaGFyKSAtPlxuICAgICAgICBpZiAoaW5kZW50X3dpdGhfdGFicyBpcyB0cnVlKSB0aGVuIFxcXG4gICAgICAgICAgXCJcXHRcIiBlbHNlIGluZGVudF9jaGFyXG4gICAgICBdXG4gICAgICBpbnNpemU6IFtcImluZGVudF93aXRoX3RhYnNcIiwgXCJpbmRlbnRfc2l6ZVwiLCAoaW5kZW50X3dpdGhfdGFicywgaW5kZW50X3NpemUpIC0+XG4gICAgICAgIGlmIChpbmRlbnRfd2l0aF90YWJzIGlzIHRydWUpIHRoZW4gXFxcbiAgICAgICAgICAxIGVsc2UgaW5kZW50X3NpemVcbiAgICAgIF1cbiAgICAgIG9ianNvcnQ6IChvYmpzb3J0KSAtPlxuICAgICAgICBvYmpzb3J0IG9yIGZhbHNlXG4gICAgICBwcmVzZXJ2ZTogWydwcmVzZXJ2ZV9uZXdsaW5lcycsIChwcmVzZXJ2ZV9uZXdsaW5lcykgLT5cbiAgICAgICAgaWYgKHByZXNlcnZlX25ld2xpbmVzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgXCJhbGxcIiBlbHNlIFwibm9uZVwiXG4gICAgICBdXG4gICAgICBjc3NpbnNlcnRsaW5lczogXCJuZXdsaW5lX2JldHdlZW5fcnVsZXNcIlxuICAgICAgY29tbWVudHM6IFtcImluZGVudF9jb21tZW50c1wiLCAoaW5kZW50X2NvbW1lbnRzKSAtPlxuICAgICAgICBpZiAoaW5kZW50X2NvbW1lbnRzIGlzIGZhbHNlKSB0aGVuIFxcXG4gICAgICAgICAgXCJub2luZGVudFwiIGVsc2UgXCJpbmRlbnRcIlxuICAgICAgXVxuICAgICAgZm9yY2U6IFwiZm9yY2VfaW5kZW50YXRpb25cIlxuICAgICAgcXVvdGVDb252ZXJ0OiBcImNvbnZlcnRfcXVvdGVzXCJcbiAgICAgIHZlcnRpY2FsOiBbJ2FsaWduX2Fzc2lnbm1lbnRzJywgKGFsaWduX2Fzc2lnbm1lbnRzKSAtPlxuICAgICAgICBpZiAoYWxpZ25fYXNzaWdubWVudHMgaXMgdHJ1ZSApIHRoZW4gXFxcbiAgICAgICAgICBcImFsbFwiIGVsc2UgXCJub25lXCJcbiAgICAgIF1cbiAgICAgIHdyYXA6IFwid3JhcF9saW5lX2xlbmd0aFwiXG4gICAgICBzcGFjZTogXCJzcGFjZV9hZnRlcl9hbm9uX2Z1bmN0aW9uXCJcbiAgICAgIG5vbGVhZHplcm86IFwibm9fbGVhZF96ZXJvXCJcbiAgICAgIGVuZGNvbW1hOiBcImVuZF93aXRoX2NvbW1hXCJcbiAgICAgIG1ldGhvZGNoYWluOiBbJ2JyZWFrX2NoYWluZWRfbWV0aG9kcycsIChicmVha19jaGFpbmVkX21ldGhvZHMpIC0+XG4gICAgICAgIGlmIChicmVha19jaGFpbmVkX21ldGhvZHMgaXMgdHJ1ZSApIHRoZW4gXFxcbiAgICAgICAgICBmYWxzZSBlbHNlIHRydWVcbiAgICAgIF1cbiAgICAgIHRlcm5hcnlsaW5lOiBcInByZXNlcnZlX3Rlcm5hcnlfbGluZXNcIlxuICAgICAgYnJhY2VwYWRkaW5nOiBcInNwYWNlX2luX3BhcmVuXCJcbiAgICAjIEFwcGx5IGxhbmd1YWdlLXNwZWNpZmljIG9wdGlvbnNcbiAgICBDU1Y6IHRydWVcbiAgICBDb2xkZnVzaW9uOiB0cnVlXG4gICAgRVJCOiB0cnVlXG4gICAgRUpTOiB0cnVlXG4gICAgSFRNTDogdHJ1ZVxuICAgIEhhbmRsZWJhcnM6IHRydWVcbiAgICBNdXN0YWNoZTogdHJ1ZVxuICAgIE51bmp1Y2tzOiB0cnVlXG4gICAgWE1MOiB0cnVlXG4gICAgU1ZHOiB0cnVlXG4gICAgU3BhY2ViYXJzOiB0cnVlXG4gICAgSlNYOiB0cnVlXG4gICAgSmF2YVNjcmlwdDogdHJ1ZVxuICAgIENTUzogdHJ1ZVxuICAgIFNDU1M6IHRydWVcbiAgICBKU09OOiB0cnVlXG4gICAgVFNTOiB0cnVlXG4gICAgVHdpZzogdHJ1ZVxuICAgIExFU1M6IHRydWVcbiAgICBTd2lnOiB0cnVlXG4gICAgXCJVWCBNYXJrdXBcIjogdHJ1ZVxuICAgIFZpc3VhbGZvcmNlOiB0cnVlXG4gICAgXCJSaW90LmpzXCI6IHRydWVcbiAgICBYVGVtcGxhdGU6IHRydWVcbiAgICBcIkdvbGFuZyBUZW1wbGF0ZVwiOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMuY3JsZiA9IEBnZXREZWZhdWx0TGluZUVuZGluZyh0cnVlLGZhbHNlLG9wdGlvbnMuZW5kX29mX2xpbmUpXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcHJldHR5ZGlmZiA9IHJlcXVpcmUoXCJwcmV0dHlkaWZmXCIpXG4gICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuICAgICAgIyBTZWxlY3QgUHJldHR5ZGlmZiBsYW5ndWFnZVxuICAgICAgbGFuZyA9IFwiYXV0b1wiXG4gICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgd2hlbiBcIkNTVlwiXG4gICAgICAgICAgbGFuZyA9IFwiY3N2XCJcbiAgICAgICAgd2hlbiBcIkNvbGRmdXNpb25cIlxuICAgICAgICAgIGxhbmcgPSBcImh0bWxcIlxuICAgICAgICB3aGVuIFwiRUpTXCIsIFwiVHdpZ1wiXG4gICAgICAgICAgbGFuZyA9IFwiZWpzXCJcbiAgICAgICAgd2hlbiBcIkVSQlwiXG4gICAgICAgICAgbGFuZyA9IFwiaHRtbF9ydWJ5XCJcbiAgICAgICAgd2hlbiBcIkhhbmRsZWJhcnNcIiwgXCJNdXN0YWNoZVwiLCBcIlNwYWNlYmFyc1wiLCBcIlN3aWdcIiwgXCJSaW90LmpzXCIsIFwiWFRlbXBsYXRlXCJcbiAgICAgICAgICBsYW5nID0gXCJoYW5kbGViYXJzXCJcbiAgICAgICAgd2hlbiBcIlNHTUxcIlxuICAgICAgICAgIGxhbmcgPSBcIm1hcmt1cFwiXG4gICAgICAgIHdoZW4gXCJYTUxcIiwgXCJWaXN1YWxmb3JjZVwiLCBcIlNWR1wiXG4gICAgICAgICAgbGFuZyA9IFwieG1sXCJcbiAgICAgICAgd2hlbiBcIkhUTUxcIiwgXCJOdW5qdWNrc1wiLCBcIlVYIE1hcmt1cFwiXG4gICAgICAgICAgbGFuZyA9IFwiaHRtbFwiXG4gICAgICAgIHdoZW4gXCJKYXZhU2NyaXB0XCJcbiAgICAgICAgICBsYW5nID0gXCJqYXZhc2NyaXB0XCJcbiAgICAgICAgd2hlbiBcIkpTT05cIlxuICAgICAgICAgIGxhbmcgPSBcImpzb25cIlxuICAgICAgICB3aGVuIFwiSlNYXCJcbiAgICAgICAgICBsYW5nID0gXCJqc3hcIlxuICAgICAgICB3aGVuIFwiSlNUTFwiXG4gICAgICAgICAgbGFuZyA9IFwianNwXCJcbiAgICAgICAgd2hlbiBcIkNTU1wiXG4gICAgICAgICAgbGFuZyA9IFwiY3NzXCJcbiAgICAgICAgd2hlbiBcIkxFU1NcIlxuICAgICAgICAgIGxhbmcgPSBcImxlc3NcIlxuICAgICAgICB3aGVuIFwiU0NTU1wiXG4gICAgICAgICAgbGFuZyA9IFwic2Nzc1wiXG4gICAgICAgIHdoZW4gXCJUU1NcIlxuICAgICAgICAgIGxhbmcgPSBcInRzc1wiXG4gICAgICAgIHdoZW4gXCJHb2xhbmcgVGVtcGxhdGVcIlxuICAgICAgICAgIGxhbmcgPSBcImdvXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxhbmcgPSBcImF1dG9cIlxuXG4gICAgICAjIFByZXR0eWRpZmYgQXJndW1lbnRzXG4gICAgICBhcmdzID1cbiAgICAgICAgc291cmNlOiB0ZXh0XG4gICAgICAgIGxhbmc6IGxhbmdcbiAgICAgICAgbW9kZTogXCJiZWF1dGlmeVwiXG5cbiAgICAgICMgTWVyZ2UgYXJncyBpbnRvcyBvcHRpb25zXG4gICAgICBfLm1lcmdlKG9wdGlvbnMsIGFyZ3MpXG5cbiAgICAgICMgQmVhdXRpZnlcbiAgICAgIEB2ZXJib3NlKCdwcmV0dHlkaWZmJywgb3B0aW9ucylcbiAgICAgIG91dHB1dCA9IHByZXR0eWRpZmYuYXBpKG9wdGlvbnMpXG4gICAgICByZXN1bHQgPSBvdXRwdXRbMF1cblxuICAgICAgIyBSZXR1cm4gYmVhdXRpZmllZCB0ZXh0XG4gICAgICByZXNvbHZlKHJlc3VsdClcblxuICAgIClcbiJdfQ==

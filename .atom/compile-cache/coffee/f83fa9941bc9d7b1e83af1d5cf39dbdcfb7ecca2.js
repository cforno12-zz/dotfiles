(function() {
  "use strict";
  var Beautifier, Prettier, path, prettier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  prettier = require("prettier");

  path = require("path");

  module.exports = Prettier = (function(superClass) {
    extend(Prettier, superClass);

    function Prettier() {
      return Prettier.__super__.constructor.apply(this, arguments);
    }

    Prettier.prototype.name = "Prettier";

    Prettier.prototype.link = "https://github.com/prettier/prettier";

    Prettier.prototype.options = {
      _: {
        tabWidth: "indent_size",
        useTabs: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            return (indent_with_tabs === true) || (indent_char === "\t");
          }
        ]
      },
      JavaScript: {
        bracketSpacing: "object_curly_spacing"
      },
      TypeScript: false,
      CSS: false,
      LESS: false,
      SCSS: false,
      Vue: false,
      JSON: false,
      Markdown: false
    };

    Prettier.prototype.beautify = function(text, language, options, context) {
      return new this.Promise(function(resolve, reject) {
        var _, err, filePath, parser, prettierLanguage;
        _ = require('lodash');
        prettierLanguage = _.find(prettier.getSupportInfo().languages, {
          'name': language
        });
        if (prettierLanguage) {
          parser = prettierLanguage.parsers[0];
          options.parser = parser;
        } else {
          reject(new Error("Unknown language for Prettier"));
        }
        filePath = context.filePath && path.dirname(context.filePath);
        try {
          return prettier.resolveConfig(filePath).then(function(configOptions) {
            var result;
            result = prettier.format(text, configOptions || options);
            prettier.clearConfigCache();
            return resolve(result);
          });
        } catch (error) {
          err = error;
          return reject(err);
        }
      });
    };

    return Prettier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wcmV0dGllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsb0NBQUE7SUFBQTs7O0VBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7dUJBQ3JCLElBQUEsR0FBTTs7dUJBQ04sSUFBQSxHQUFNOzt1QkFDTixPQUFBLEdBQVM7TUFDUCxDQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQVUsYUFBVjtRQUNBLE9BQUEsRUFBUztVQUFDLGtCQUFELEVBQXFCLGFBQXJCLEVBQW9DLFNBQUMsZ0JBQUQsRUFBbUIsV0FBbkI7QUFDM0MsbUJBQU8sQ0FBQyxnQkFBQSxLQUFvQixJQUFyQixDQUFBLElBQThCLENBQUMsV0FBQSxLQUFlLElBQWhCO1VBRE0sQ0FBcEM7U0FEVDtPQUZLO01BTVAsVUFBQSxFQUNFO1FBQUEsY0FBQSxFQUFnQixzQkFBaEI7T0FQSztNQVFQLFVBQUEsRUFBWSxLQVJMO01BU1AsR0FBQSxFQUFLLEtBVEU7TUFVUCxJQUFBLEVBQU0sS0FWQztNQVdQLElBQUEsRUFBTSxLQVhDO01BWVAsR0FBQSxFQUFLLEtBWkU7TUFhUCxJQUFBLEVBQU0sS0FiQztNQWNQLFFBQUEsRUFBVSxLQWRIOzs7dUJBaUJULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBQ1IsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1FBRUosZ0JBQUEsR0FBbUIsQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFRLENBQUMsY0FBVCxDQUFBLENBQXlCLENBQUMsU0FBakMsRUFBNEM7VUFBQSxNQUFBLEVBQVEsUUFBUjtTQUE1QztRQUNuQixJQUFHLGdCQUFIO1VBQ0UsTUFBQSxHQUFTLGdCQUFnQixDQUFDLE9BQVEsQ0FBQSxDQUFBO1VBQ2xDLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLE9BRm5CO1NBQUEsTUFBQTtVQUlFLE1BQUEsQ0FBTyxJQUFJLEtBQUosQ0FBVSwrQkFBVixDQUFQLEVBSkY7O1FBTUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxRQUFSLElBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLFFBQXJCO0FBRWhDO2lCQUNFLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsU0FBQyxhQUFEO0FBQ3BDLGdCQUFBO1lBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLEVBQXNCLGFBQUEsSUFBaUIsT0FBdkM7WUFDVCxRQUFRLENBQUMsZ0JBQVQsQ0FBQTttQkFDQSxPQUFBLENBQVEsTUFBUjtVQUhvQyxDQUF0QyxFQURGO1NBQUEsYUFBQTtVQU1NO2lCQUNKLE1BQUEsQ0FBTyxHQUFQLEVBUEY7O01BWmtCLENBQWI7SUFEQzs7OztLQXBCNEI7QUFOeEMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnByZXR0aWVyID0gcmVxdWlyZShcInByZXR0aWVyXCIpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQcmV0dGllciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQcmV0dGllclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3ByZXR0aWVyL3ByZXR0aWVyXCJcbiAgb3B0aW9uczoge1xuICAgIF86XG4gICAgICB0YWJXaWR0aDogXCJpbmRlbnRfc2l6ZVwiXG4gICAgICB1c2VUYWJzOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X2NoYXJcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9jaGFyKSAtPlxuICAgICAgICByZXR1cm4gKGluZGVudF93aXRoX3RhYnMgaXMgdHJ1ZSkgb3IgKGluZGVudF9jaGFyIGlzIFwiXFx0XCIpXG4gICAgICBdXG4gICAgSmF2YVNjcmlwdDpcbiAgICAgIGJyYWNrZXRTcGFjaW5nOiBcIm9iamVjdF9jdXJseV9zcGFjaW5nXCJcbiAgICBUeXBlU2NyaXB0OiBmYWxzZVxuICAgIENTUzogZmFsc2VcbiAgICBMRVNTOiBmYWxzZVxuICAgIFNDU1M6IGZhbHNlXG4gICAgVnVlOiBmYWxzZVxuICAgIEpTT046IGZhbHNlXG4gICAgTWFya2Rvd246IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG4gICAgICBwcmV0dGllckxhbmd1YWdlID0gXy5maW5kKHByZXR0aWVyLmdldFN1cHBvcnRJbmZvKCkubGFuZ3VhZ2VzLCAnbmFtZSc6IGxhbmd1YWdlKVxuICAgICAgaWYgcHJldHRpZXJMYW5ndWFnZVxuICAgICAgICBwYXJzZXIgPSBwcmV0dGllckxhbmd1YWdlLnBhcnNlcnNbMF1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIgPSBwYXJzZXJcbiAgICAgIGVsc2VcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlVua25vd24gbGFuZ3VhZ2UgZm9yIFByZXR0aWVyXCIpKVxuXG4gICAgICBmaWxlUGF0aCA9IGNvbnRleHQuZmlsZVBhdGggYW5kIHBhdGguZGlybmFtZSBjb250ZXh0LmZpbGVQYXRoXG5cbiAgICAgIHRyeVxuICAgICAgICBwcmV0dGllci5yZXNvbHZlQ29uZmlnKGZpbGVQYXRoKS50aGVuKChjb25maWdPcHRpb25zKSAtPlxuICAgICAgICAgIHJlc3VsdCA9IHByZXR0aWVyLmZvcm1hdCh0ZXh0LCBjb25maWdPcHRpb25zIG9yIG9wdGlvbnMpXG4gICAgICAgICAgcHJldHRpZXIuY2xlYXJDb25maWdDYWNoZSgpXG4gICAgICAgICAgcmVzb2x2ZSByZXN1bHRcbiAgICAgICAgKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgKSJdfQ==

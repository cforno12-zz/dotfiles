(function() {
  var CompositeDisposable, PigmentsProvider, _, ref, variablesRegExp;

  ref = [], CompositeDisposable = ref[0], variablesRegExp = ref[1], _ = ref[2];

  module.exports = PigmentsProvider = (function() {
    function PigmentsProvider(pigments) {
      this.pigments = pigments;
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.subscriptions = new CompositeDisposable;
      this.selector = atom.config.get('pigments.autocompleteScopes').join(',');
      this.subscriptions.add(atom.config.observe('pigments.autocompleteScopes', (function(_this) {
        return function(scopes) {
          return _this.selector = scopes.join(',');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToVariables', (function(_this) {
        return function(extendAutocompleteToVariables) {
          _this.extendAutocompleteToVariables = extendAutocompleteToVariables;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToColorValue', (function(_this) {
        return function(extendAutocompleteToColorValue) {
          _this.extendAutocompleteToColorValue = extendAutocompleteToColorValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.autocompleteSuggestionsFromValue', (function(_this) {
        return function(autocompleteSuggestionsFromValue) {
          _this.autocompleteSuggestionsFromValue = autocompleteSuggestionsFromValue;
        };
      })(this)));
    }

    PigmentsProvider.prototype.dispose = function() {
      this.disposed = true;
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      if (this.disposed) {
        return;
      }
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = arg.editor, bufferPosition = arg.bufferPosition;
      if (this.disposed) {
        return;
      }
      prefix = this.getPrefix(editor, bufferPosition);
      project = this.getProject();
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      if (project == null) {
        return;
      }
      if (this.extendAutocompleteToVariables) {
        variables = project.getVariables();
      } else {
        variables = project.getColorVariables();
      }
      suggestions = this.findSuggestionsForPrefix(variables, prefix);
      return suggestions;
    };

    PigmentsProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
      if (variablesRegExp == null) {
        variablesRegExp = require('./regexes').variables;
      }
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      if (this.autocompleteSuggestionsFromValue) {
        return (ref1 = (ref2 = (ref3 = (ref4 = (ref5 = line.match(/(?:#[a-fA-F0-9]*|rgb.+)$/)) != null ? ref5[0] : void 0) != null ? ref4 : (ref6 = line.match(new RegExp("(" + variablesRegExp + ")$"))) != null ? ref6[0] : void 0) != null ? ref3 : (ref7 = line.match(/:\s*([^\s].+)$/)) != null ? ref7[1] : void 0) != null ? ref2 : (ref8 = line.match(/^\s*([^\s].+)$/)) != null ? ref8[1] : void 0) != null ? ref1 : '';
      } else {
        return ((ref9 = line.match(new RegExp("(" + variablesRegExp + ")$"))) != null ? ref9[0] : void 0) || '';
      }
    };

    PigmentsProvider.prototype.findSuggestionsForPrefix = function(variables, prefix) {
      var matchedVariables, matchesColorValue, re, suggestions;
      if (variables == null) {
        return [];
      }
      if (_ == null) {
        _ = require('underscore-plus');
      }
      re = RegExp("^" + (_.escapeRegExp(prefix).replace(/,\s*/, '\\s*,\\s*')));
      suggestions = [];
      matchesColorValue = function(v) {
        var res;
        res = re.test(v.value);
        if (v.color != null) {
          res || (res = v.color.suggestionValues.some(function(s) {
            return re.test(s);
          }));
        }
        return res;
      };
      matchedVariables = variables.filter((function(_this) {
        return function(v) {
          return !v.isAlternate && re.test(v.name) || (_this.autocompleteSuggestionsFromValue && matchesColorValue(v));
        };
      })(this));
      matchedVariables.forEach((function(_this) {
        return function(v) {
          var color, rightLabelHTML;
          if (v.isColor) {
            color = v.color.alpha === 1 ? '#' + v.color.hex : v.color.toCSS();
            rightLabelHTML = "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>";
            if (_this.extendAutocompleteToColorValue) {
              rightLabelHTML = color + " " + rightLabelHTML;
            }
            return suggestions.push({
              text: v.name,
              rightLabelHTML: rightLabelHTML,
              replacementPrefix: prefix,
              className: 'color-suggestion'
            });
          } else {
            return suggestions.push({
              text: v.name,
              rightLabel: v.value,
              replacementPrefix: prefix,
              className: 'pigments-suggestion'
            });
          }
        };
      })(this));
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGlnbWVudHMtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUVJLEVBRkosRUFDRSw0QkFERixFQUN1Qix3QkFEdkIsRUFDd0M7O0VBR3hDLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUywwQkFBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFdBQUQ7O1FBQ1osc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzs7TUFFdkMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxHQUFwRDtNQUVaLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNkJBQXBCLEVBQW1ELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUNwRSxLQUFDLENBQUEsUUFBRCxHQUFZLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWjtRQUR3RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdDQUFwQixFQUE4RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsNkJBQUQ7VUFBQyxLQUFDLENBQUEsZ0NBQUQ7UUFBRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHlDQUFwQixFQUErRCxDQUFBLFNB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QSxDQUFDLEtBQUMsQ0FBQSxnQ0FBRCxJQUFzQyxpQkFBQSxDQUFrQixDQUFsQixDQUF2QztRQUZrQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7TUFJbkIsZ0JBQWdCLENBQUMsT0FBakIsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDdkIsY0FBQTtVQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUw7WUFDRSxLQUFBLEdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFSLEtBQWlCLENBQXBCLEdBQTJCLEdBQUEsR0FBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQXpDLEdBQWtELENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBUixDQUFBO1lBQzFELGNBQUEsR0FBaUIsNERBQUEsR0FBNEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQVIsQ0FBQSxDQUFELENBQTVELEdBQTZFO1lBQzlGLElBQWlELEtBQUMsQ0FBQSw4QkFBbEQ7Y0FBQSxjQUFBLEdBQW9CLEtBQUQsR0FBTyxHQUFQLEdBQVUsZUFBN0I7O21CQUVBLFdBQVcsQ0FBQyxJQUFaLENBQWlCO2NBQ2YsSUFBQSxFQUFNLENBQUMsQ0FBQyxJQURPO2NBRWYsZ0JBQUEsY0FGZTtjQUdmLGlCQUFBLEVBQW1CLE1BSEo7Y0FJZixTQUFBLEVBQVcsa0JBSkk7YUFBakIsRUFMRjtXQUFBLE1BQUE7bUJBWUUsV0FBVyxDQUFDLElBQVosQ0FBaUI7Y0FDZixJQUFBLEVBQU0sQ0FBQyxDQUFDLElBRE87Y0FFZixVQUFBLEVBQVksQ0FBQyxDQUFDLEtBRkM7Y0FHZixpQkFBQSxFQUFtQixNQUhKO2NBSWYsU0FBQSxFQUFXLHFCQUpJO2FBQWpCLEVBWkY7O1FBRHVCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjthQW9CQTtJQXJDd0I7Ozs7O0FBekQ1QiIsInNvdXJjZXNDb250ZW50IjpbIltcbiAgQ29tcG9zaXRlRGlzcG9zYWJsZSwgdmFyaWFibGVzUmVnRXhwLCBfXG5dID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUGlnbWVudHNQcm92aWRlclxuICBjb25zdHJ1Y3RvcjogKEBwaWdtZW50cykgLT5cbiAgICBDb21wb3NpdGVEaXNwb3NhYmxlID89IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHNlbGVjdG9yID0gYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5hdXRvY29tcGxldGVTY29wZXMnKS5qb2luKCcsJylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5hdXRvY29tcGxldGVTY29wZXMnLCAoc2NvcGVzKSA9PlxuICAgICAgQHNlbGVjdG9yID0gc2NvcGVzLmpvaW4oJywnKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5leHRlbmRBdXRvY29tcGxldGVUb1ZhcmlhYmxlcycsIChAZXh0ZW5kQXV0b2NvbXBsZXRlVG9WYXJpYWJsZXMpID0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmV4dGVuZEF1dG9jb21wbGV0ZVRvQ29sb3JWYWx1ZScsIChAZXh0ZW5kQXV0b2NvbXBsZXRlVG9Db2xvclZhbHVlKSA9PlxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmF1dG9jb21wbGV0ZVN1Z2dlc3Rpb25zRnJvbVZhbHVlJywgKEBhdXRvY29tcGxldGVTdWdnZXN0aW9uc0Zyb21WYWx1ZSkgPT5cblxuICBkaXNwb3NlOiAtPlxuICAgIEBkaXNwb3NlZCA9IHRydWVcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAcGlnbWVudHMgPSBudWxsXG5cbiAgZ2V0UHJvamVjdDogLT5cbiAgICByZXR1cm4gaWYgQGRpc3Bvc2VkXG4gICAgQHBpZ21lbnRzLmdldFByb2plY3QoKVxuXG4gIGdldFN1Z2dlc3Rpb25zOiAoe2VkaXRvciwgYnVmZmVyUG9zaXRpb259KSAtPlxuICAgIHJldHVybiBpZiBAZGlzcG9zZWRcbiAgICBwcmVmaXggPSBAZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgcHJvamVjdCA9IEBnZXRQcm9qZWN0KClcblxuICAgIHJldHVybiB1bmxlc3MgcHJlZml4Py5sZW5ndGhcbiAgICByZXR1cm4gdW5sZXNzIHByb2plY3Q/XG5cbiAgICBpZiBAZXh0ZW5kQXV0b2NvbXBsZXRlVG9WYXJpYWJsZXNcbiAgICAgIHZhcmlhYmxlcyA9IHByb2plY3QuZ2V0VmFyaWFibGVzKClcbiAgICBlbHNlXG4gICAgICB2YXJpYWJsZXMgPSBwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKClcblxuICAgIHN1Z2dlc3Rpb25zID0gQGZpbmRTdWdnZXN0aW9uc0ZvclByZWZpeCh2YXJpYWJsZXMsIHByZWZpeClcbiAgICBzdWdnZXN0aW9uc1xuXG4gIGdldFByZWZpeDogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgdmFyaWFibGVzUmVnRXhwID89IHJlcXVpcmUoJy4vcmVnZXhlcycpLnZhcmlhYmxlc1xuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG5cbiAgICBpZiBAYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNGcm9tVmFsdWVcbiAgICAgIGxpbmUubWF0Y2goLyg/OiNbYS1mQS1GMC05XSp8cmdiLispJC8pP1swXSA/XG4gICAgICBsaW5lLm1hdGNoKG5ldyBSZWdFeHAoXCIoI3t2YXJpYWJsZXNSZWdFeHB9KSRcIikpP1swXSA/XG4gICAgICBsaW5lLm1hdGNoKC86XFxzKihbXlxcc10uKykkLyk/WzFdID9cbiAgICAgIGxpbmUubWF0Y2goL15cXHMqKFteXFxzXS4rKSQvKT9bMV0gP1xuICAgICAgJydcbiAgICBlbHNlXG4gICAgICBsaW5lLm1hdGNoKG5ldyBSZWdFeHAoXCIoI3t2YXJpYWJsZXNSZWdFeHB9KSRcIikpP1swXSBvciAnJ1xuXG4gIGZpbmRTdWdnZXN0aW9uc0ZvclByZWZpeDogKHZhcmlhYmxlcywgcHJlZml4KSAtPlxuICAgIHJldHVybiBbXSB1bmxlc3MgdmFyaWFibGVzP1xuXG4gICAgXyA/PSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbiAgICByZSA9IC8vL14je18uZXNjYXBlUmVnRXhwKHByZWZpeCkucmVwbGFjZSgvLFxccyovLCAnXFxcXHMqLFxcXFxzKicpfS8vL1xuXG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIG1hdGNoZXNDb2xvclZhbHVlID0gKHYpIC0+XG4gICAgICByZXMgPSByZS50ZXN0KHYudmFsdWUpXG4gICAgICByZXMgfHw9IHYuY29sb3Iuc3VnZ2VzdGlvblZhbHVlcy5zb21lKChzKSAtPiByZS50ZXN0KHMpKSBpZiB2LmNvbG9yP1xuICAgICAgcmVzXG5cbiAgICBtYXRjaGVkVmFyaWFibGVzID0gdmFyaWFibGVzLmZpbHRlciAodikgPT5cbiAgICAgIG5vdCB2LmlzQWx0ZXJuYXRlIGFuZCByZS50ZXN0KHYubmFtZSkgb3JcbiAgICAgIChAYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNGcm9tVmFsdWUgYW5kIG1hdGNoZXNDb2xvclZhbHVlKHYpKVxuXG4gICAgbWF0Y2hlZFZhcmlhYmxlcy5mb3JFYWNoICh2KSA9PlxuICAgICAgaWYgdi5pc0NvbG9yXG4gICAgICAgIGNvbG9yID0gaWYgdi5jb2xvci5hbHBoYSA9PSAxIHRoZW4gJyMnICsgdi5jb2xvci5oZXggZWxzZSB2LmNvbG9yLnRvQ1NTKCk7XG4gICAgICAgIHJpZ2h0TGFiZWxIVE1MID0gXCI8c3BhbiBjbGFzcz0nY29sb3Itc3VnZ2VzdGlvbi1wcmV2aWV3JyBzdHlsZT0nYmFja2dyb3VuZDogI3t2LmNvbG9yLnRvQ1NTKCl9Jz48L3NwYW4+XCJcbiAgICAgICAgcmlnaHRMYWJlbEhUTUwgPSBcIiN7Y29sb3J9ICN7cmlnaHRMYWJlbEhUTUx9XCIgaWYgQGV4dGVuZEF1dG9jb21wbGV0ZVRvQ29sb3JWYWx1ZVxuXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2gge1xuICAgICAgICAgIHRleHQ6IHYubmFtZVxuICAgICAgICAgIHJpZ2h0TGFiZWxIVE1MXG4gICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeFxuICAgICAgICAgIGNsYXNzTmFtZTogJ2NvbG9yLXN1Z2dlc3Rpb24nXG4gICAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCB7XG4gICAgICAgICAgdGV4dDogdi5uYW1lXG4gICAgICAgICAgcmlnaHRMYWJlbDogdi52YWx1ZVxuICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXhcbiAgICAgICAgICBjbGFzc05hbWU6ICdwaWdtZW50cy1zdWdnZXN0aW9uJ1xuICAgICAgICB9XG5cbiAgICBzdWdnZXN0aW9uc1xuIl19

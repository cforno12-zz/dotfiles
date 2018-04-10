(function() {
  var ColorContext, ColorSearch, Emitter, Minimatch, ref, registry;

  ref = [], Emitter = ref[0], Minimatch = ref[1], ColorContext = ref[2], registry = ref[3];

  module.exports = ColorSearch = (function() {
    ColorSearch.deserialize = function(state) {
      return new ColorSearch(state.options);
    };

    function ColorSearch(options) {
      var ref1, subscription;
      this.options = options != null ? options : {};
      ref1 = this.options, this.sourceNames = ref1.sourceNames, this.ignoredNameSources = ref1.ignoredNames, this.context = ref1.context, this.project = ref1.project;
      if (Emitter == null) {
        Emitter = require('atom').Emitter;
      }
      this.emitter = new Emitter;
      if (this.project != null) {
        this.init();
      } else {
        subscription = atom.packages.onDidActivatePackage((function(_this) {
          return function(pkg) {
            if (pkg.name === 'pigments') {
              subscription.dispose();
              _this.project = pkg.mainModule.getProject();
              return _this.init();
            }
          };
        })(this));
      }
    }

    ColorSearch.prototype.init = function() {
      var error, i, ignore, len, ref1;
      if (Minimatch == null) {
        Minimatch = require('minimatch').Minimatch;
      }
      if (ColorContext == null) {
        ColorContext = require('./color-context');
      }
      if (this.context == null) {
        this.context = new ColorContext({
          registry: this.project.getColorExpressionsRegistry()
        });
      }
      this.parser = this.context.parser;
      this.variables = this.context.getVariables();
      if (this.sourceNames == null) {
        this.sourceNames = [];
      }
      if (this.ignoredNameSources == null) {
        this.ignoredNameSources = [];
      }
      this.ignoredNames = [];
      ref1 = this.ignoredNameSources;
      for (i = 0, len = ref1.length; i < len; i++) {
        ignore = ref1[i];
        if (ignore != null) {
          try {
            this.ignoredNames.push(new Minimatch(ignore, {
              matchBase: true,
              dot: true
            }));
          } catch (error1) {
            error = error1;
            console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
          }
        }
      }
      if (this.searchRequested) {
        return this.search();
      }
    };

    ColorSearch.prototype.getTitle = function() {
      return 'Pigments Find Results';
    };

    ColorSearch.prototype.getURI = function() {
      return 'pigments://search';
    };

    ColorSearch.prototype.getIconName = function() {
      return "pigments";
    };

    ColorSearch.prototype.onDidFindMatches = function(callback) {
      return this.emitter.on('did-find-matches', callback);
    };

    ColorSearch.prototype.onDidCompleteSearch = function(callback) {
      return this.emitter.on('did-complete-search', callback);
    };

    ColorSearch.prototype.search = function() {
      var promise, re, results;
      if (this.project == null) {
        this.searchRequested = true;
        return;
      }
      re = new RegExp(this.project.getColorExpressionsRegistry().getRegExp());
      results = [];
      promise = atom.workspace.scan(re, {
        paths: this.sourceNames
      }, (function(_this) {
        return function(m) {
          var i, len, newMatches, ref1, ref2, relativePath, result, scope;
          relativePath = atom.project.relativize(m.filePath);
          scope = _this.project.scopeFromFileName(relativePath);
          if (_this.isIgnored(relativePath)) {
            return;
          }
          newMatches = [];
          ref1 = m.matches;
          for (i = 0, len = ref1.length; i < len; i++) {
            result = ref1[i];
            result.color = _this.parser.parse(result.matchText, scope);
            if (!((ref2 = result.color) != null ? ref2.isValid() : void 0)) {
              continue;
            }
            if (result.range[0] == null) {
              console.warn("Color search returned a result with an invalid range", result);
              continue;
            }
            result.range[0][1] += result.matchText.indexOf(result.color.colorExpression);
            result.matchText = result.color.colorExpression;
            results.push(result);
            newMatches.push(result);
          }
          m.matches = newMatches;
          if (m.matches.length > 0) {
            return _this.emitter.emit('did-find-matches', m);
          }
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          _this.results = results;
          return _this.emitter.emit('did-complete-search', results);
        };
      })(this));
    };

    ColorSearch.prototype.isIgnored = function(relativePath) {
      var i, ignoredName, len, ref1;
      ref1 = this.ignoredNames;
      for (i = 0, len = ref1.length; i < len; i++) {
        ignoredName = ref1[i];
        if (ignoredName.match(relativePath)) {
          return true;
        }
      }
    };

    ColorSearch.prototype.serialize = function() {
      return {
        deserializer: 'ColorSearch',
        options: {
          sourceNames: this.sourceNames,
          ignoredNames: this.ignoredNameSources
        }
      };
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3Itc2VhcmNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBK0MsRUFBL0MsRUFBQyxnQkFBRCxFQUFVLGtCQUFWLEVBQXFCLHFCQUFyQixFQUFtQzs7RUFFbkMsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLFdBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO2FBQWUsSUFBQSxXQUFBLENBQVksS0FBSyxDQUFDLE9BQWxCO0lBQWY7O0lBRUQscUJBQUMsT0FBRDtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsNEJBQUQsVUFBUztNQUNyQixPQUF3RSxJQUFDLENBQUEsT0FBekUsRUFBQyxJQUFDLENBQUEsbUJBQUEsV0FBRixFQUE2QixJQUFDLENBQUEsMEJBQWYsWUFBZixFQUFrRCxJQUFDLENBQUEsZUFBQSxPQUFuRCxFQUE0RCxJQUFDLENBQUEsZUFBQTtNQUM3RCxJQUFrQyxlQUFsQztRQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsVUFBWjs7TUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFHLG9CQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtRQUdFLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFkLENBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDtZQUNoRCxJQUFHLEdBQUcsQ0FBQyxJQUFKLEtBQVksVUFBZjtjQUNFLFlBQVksQ0FBQyxPQUFiLENBQUE7Y0FDQSxLQUFDLENBQUEsT0FBRCxHQUFXLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBZixDQUFBO3FCQUNYLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjs7VUFEZ0Q7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVB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QUFDLE9BQWpCLENBQXlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBdEM7WUFDdEIsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUVoQyxPQUFPLENBQUMsSUFBUixDQUFhLE1BQWI7WUFDQSxVQUFVLENBQUMsSUFBWCxDQUFnQixNQUFoQjtBQWRGO1VBZ0JBLENBQUMsQ0FBQyxPQUFGLEdBQVk7VUFFWixJQUF1QyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQVYsR0FBbUIsQ0FBMUQ7bUJBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsa0JBQWQsRUFBa0MsQ0FBbEMsRUFBQTs7UUF4QnFEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QzthQTBCVixPQUFPLENBQUMsSUFBUixDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNYLEtBQUMsQ0FBQSxPQUFELEdBQVc7aUJBQ1gsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMscUJBQWQsRUFBcUMsT0FBckM7UUFGVztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtJQWxDTTs7MEJBc0NSLFNBQUEsR0FBVyxTQUFDLFlBQUQ7QUFDVCxVQUFBO0FBQUE7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQWUsV0FBVyxDQUFDLEtBQVosQ0FBa0IsWUFBbEIsQ0FBZjtBQUFBLGlCQUFPLEtBQVA7O0FBREY7SUFEUzs7MEJBSVgsU0FBQSxHQUFXLFNBQUE7YUFDVDtRQUNFLFlBQUEsRUFBYyxhQURoQjtRQUVFLE9BQUEsRUFBUztVQUNOLGFBQUQsSUFBQyxDQUFBLFdBRE07VUFFUCxZQUFBLEVBQWMsSUFBQyxDQUFBLGtCQUZSO1NBRlg7O0lBRFM7Ozs7O0FBOUZiIiwic291cmNlc0NvbnRlbnQiOlsiW0VtaXR0ZXIsIE1pbmltYXRjaCwgQ29sb3JDb250ZXh0LCByZWdpc3RyeV0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvclNlYXJjaFxuICBAZGVzZXJpYWxpemU6IChzdGF0ZSkgLT4gbmV3IENvbG9yU2VhcmNoKHN0YXRlLm9wdGlvbnMpXG5cbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cbiAgICB7QHNvdXJjZU5hbWVzLCBpZ25vcmVkTmFtZXM6IEBpZ25vcmVkTmFtZVNvdXJjZXMsIEBjb250ZXh0LCBAcHJvamVjdH0gPSBAb3B0aW9uc1xuICAgIHtFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBFbWl0dGVyP1xuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcblxuICAgIGlmIEBwcm9qZWN0P1xuICAgICAgQGluaXQoKVxuICAgIGVsc2VcbiAgICAgIHN1YnNjcmlwdGlvbiA9IGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UgKHBrZykgPT5cbiAgICAgICAgaWYgcGtnLm5hbWUgaXMgJ3BpZ21lbnRzJ1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgICBAcHJvamVjdCA9IHBrZy5tYWluTW9kdWxlLmdldFByb2plY3QoKVxuICAgICAgICAgIEBpbml0KClcblxuICBpbml0OiAtPlxuICAgIHtNaW5pbWF0Y2h9ID0gcmVxdWlyZSAnbWluaW1hdGNoJyB1bmxlc3MgTWluaW1hdGNoP1xuICAgIENvbG9yQ29udGV4dCA/PSByZXF1aXJlICcuL2NvbG9yLWNvbnRleHQnXG5cbiAgICBAY29udGV4dCA/PSBuZXcgQ29sb3JDb250ZXh0KHJlZ2lzdHJ5OiBAcHJvamVjdC5nZXRDb2xvckV4cHJlc3Npb25zUmVnaXN0cnkoKSlcblxuICAgIEBwYXJzZXIgPSBAY29udGV4dC5wYXJzZXJcbiAgICBAdmFyaWFibGVzID0gQGNvbnRleHQuZ2V0VmFyaWFibGVzKClcbiAgICBAc291cmNlTmFtZXMgPz0gW11cbiAgICBAaWdub3JlZE5hbWVTb3VyY2VzID89IFtdXG5cbiAgICBAaWdub3JlZE5hbWVzID0gW11cbiAgICBmb3IgaWdub3JlIGluIEBpZ25vcmVkTmFtZVNvdXJjZXMgd2hlbiBpZ25vcmU/XG4gICAgICB0cnlcbiAgICAgICAgQGlnbm9yZWROYW1lcy5wdXNoKG5ldyBNaW5pbWF0Y2goaWdub3JlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSkpXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICBjb25zb2xlLndhcm4gXCJFcnJvciBwYXJzaW5nIGlnbm9yZSBwYXR0ZXJuICgje2lnbm9yZX0pOiAje2Vycm9yLm1lc3NhZ2V9XCJcblxuICAgIEBzZWFyY2goKSBpZiBAc2VhcmNoUmVxdWVzdGVkXG5cbiAgZ2V0VGl0bGU6IC0+ICdQaWdtZW50cyBGaW5kIFJlc3VsdHMnXG5cbiAgZ2V0VVJJOiAtPiAncGlnbWVudHM6Ly9zZWFyY2gnXG5cbiAgZ2V0SWNvbk5hbWU6IC0+IFwicGlnbWVudHNcIlxuXG4gIG9uRGlkRmluZE1hdGNoZXM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWZpbmQtbWF0Y2hlcycsIGNhbGxiYWNrXG5cbiAgb25EaWRDb21wbGV0ZVNlYXJjaDogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY29tcGxldGUtc2VhcmNoJywgY2FsbGJhY2tcblxuICBzZWFyY2g6IC0+XG4gICAgdW5sZXNzIEBwcm9qZWN0P1xuICAgICAgQHNlYXJjaFJlcXVlc3RlZCA9IHRydWVcbiAgICAgIHJldHVyblxuXG4gICAgcmUgPSBuZXcgUmVnRXhwIEBwcm9qZWN0LmdldENvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeSgpLmdldFJlZ0V4cCgpXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uuc2NhbiByZSwgcGF0aHM6IEBzb3VyY2VOYW1lcywgKG0pID0+XG4gICAgICByZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZShtLmZpbGVQYXRoKVxuICAgICAgc2NvcGUgPSBAcHJvamVjdC5zY29wZUZyb21GaWxlTmFtZShyZWxhdGl2ZVBhdGgpXG4gICAgICByZXR1cm4gaWYgQGlzSWdub3JlZChyZWxhdGl2ZVBhdGgpXG5cbiAgICAgIG5ld01hdGNoZXMgPSBbXVxuICAgICAgZm9yIHJlc3VsdCBpbiBtLm1hdGNoZXNcbiAgICAgICAgcmVzdWx0LmNvbG9yID0gQHBhcnNlci5wYXJzZShyZXN1bHQubWF0Y2hUZXh0LCBzY29wZSlcbiAgICAgICAgIyBGSVhNRSBpdCBzaG91bGQgYmUgaGFuZGxlZCB3YXkgYmVmb3JlLCBidXQgaXQnbGwgbmVlZCBhIGNoYW5nZVxuICAgICAgICAjIGluIGhvdyB3ZSB0ZXN0IGlmIGEgdmFyaWFibGUgaXMgYSBjb2xvci5cbiAgICAgICAgY29udGludWUgdW5sZXNzIHJlc3VsdC5jb2xvcj8uaXNWYWxpZCgpXG4gICAgICAgICMgRklYTUUgU2VlbXMgbGlrZSwgc29tZXRpbWUgdGhlIHJhbmdlIG9mIHRoZSByZXN1bHQgaXMgdW5kZWZpbmVkLFxuICAgICAgICAjIHdlJ2xsIGlnbm9yZSB0aGF0IGZvciBub3cgYW5kIGxvZyB0aGUgZmF1bHRpbmcgcmVzdWx0LlxuICAgICAgICB1bmxlc3MgcmVzdWx0LnJhbmdlWzBdP1xuICAgICAgICAgIGNvbnNvbGUud2FybiBcIkNvbG9yIHNlYXJjaCByZXR1cm5lZCBhIHJlc3VsdCB3aXRoIGFuIGludmFsaWQgcmFuZ2VcIiwgcmVzdWx0XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgcmVzdWx0LnJhbmdlWzBdWzFdICs9IHJlc3VsdC5tYXRjaFRleHQuaW5kZXhPZihyZXN1bHQuY29sb3IuY29sb3JFeHByZXNzaW9uKVxuICAgICAgICByZXN1bHQubWF0Y2hUZXh0ID0gcmVzdWx0LmNvbG9yLmNvbG9yRXhwcmVzc2lvblxuXG4gICAgICAgIHJlc3VsdHMucHVzaCByZXN1bHRcbiAgICAgICAgbmV3TWF0Y2hlcy5wdXNoIHJlc3VsdFxuXG4gICAgICBtLm1hdGNoZXMgPSBuZXdNYXRjaGVzXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1maW5kLW1hdGNoZXMnLCBtIGlmIG0ubWF0Y2hlcy5sZW5ndGggPiAwXG5cbiAgICBwcm9taXNlLnRoZW4gPT5cbiAgICAgIEByZXN1bHRzID0gcmVzdWx0c1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNvbXBsZXRlLXNlYXJjaCcsIHJlc3VsdHNcblxuICBpc0lnbm9yZWQ6IChyZWxhdGl2ZVBhdGgpIC0+XG4gICAgZm9yIGlnbm9yZWROYW1lIGluIEBpZ25vcmVkTmFtZXNcbiAgICAgIHJldHVybiB0cnVlIGlmIGlnbm9yZWROYW1lLm1hdGNoKHJlbGF0aXZlUGF0aClcblxuICBzZXJpYWxpemU6IC0+XG4gICAge1xuICAgICAgZGVzZXJpYWxpemVyOiAnQ29sb3JTZWFyY2gnXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIEBzb3VyY2VOYW1lcyxcbiAgICAgICAgaWdub3JlZE5hbWVzOiBAaWdub3JlZE5hbWVTb3VyY2VzXG4gICAgICB9XG4gICAgfVxuIl19

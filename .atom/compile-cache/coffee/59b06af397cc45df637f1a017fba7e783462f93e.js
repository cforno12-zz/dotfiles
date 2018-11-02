(function() {
  var CompositeDisposable, HighlightedAreaView;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightedAreaView = require('./highlighted-area-view');

  module.exports = {
    config: {
      onlyHighlightWholeWords: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelectedWord: {
        type: 'boolean',
        "default": false
      },
      ignoreCase: {
        type: 'boolean',
        "default": false
      },
      lightTheme: {
        type: 'boolean',
        "default": false
      },
      highlightBackground: {
        type: 'boolean',
        "default": false
      },
      minimumLength: {
        type: 'integer',
        "default": 2
      },
      timeout: {
        type: 'integer',
        "default": 20,
        description: 'Defers searching for matching strings for X ms'
      },
      showInStatusBar: {
        type: 'boolean',
        "default": true,
        description: 'Show how many matches there are'
      },
      highlightInPanes: {
        type: 'boolean',
        "default": true,
        description: 'Highlight selection in another panes'
      },
      statusBarString: {
        type: 'string',
        "default": 'Highlighted: %c',
        description: 'The text to show in the status bar. %c = number of occurrences'
      },
      allowedCharactersToSelect: {
        type: 'string',
        "default": '$@%-',
        description: 'Non Word Characters that are allowed to be selected'
      },
      showResultsOnScrollBar: {
        type: 'boolean',
        "default": false,
        description: 'Show highlight on the scroll bar'
      }
    },
    areaView: null,
    activate: function(state) {
      this.areaView = new HighlightedAreaView();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-selected:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'highlight-selected:select-all': (function(_this) {
          return function() {
            return _this.selectAll();
          };
        })(this)
      }));
    },
    deactivate: function() {
      var ref, ref1;
      if ((ref = this.areaView) != null) {
        ref.destroy();
      }
      this.areaView = null;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      return this.subscriptions = null;
    },
    provideHighlightSelectedV1Deprecated: function() {
      return this.areaView;
    },
    provideHighlightSelectedV2: function() {
      return this.areaView;
    },
    consumeStatusBar: function(statusBar) {
      return this.areaView.setStatusBar(statusBar);
    },
    toggle: function() {
      if (this.areaView.disabled) {
        return this.areaView.enable();
      } else {
        return this.areaView.disable();
      }
    },
    selectAll: function() {
      return this.areaView.selectAll();
    },
    consumeScrollMarker: function(scrollMarkerAPI) {
      return this.areaView.setScrollMarker(scrollMarkerAPI);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2hpZ2hsaWdodC1zZWxlY3RlZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BREY7TUFHQSwyQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FKRjtNQU1BLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BUEY7TUFTQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQVZGO01BWUEsbUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BYkY7TUFlQSxhQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtPQWhCRjtNQWtCQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxnREFGYjtPQW5CRjtNQXNCQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQXZCRjtNQTBCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsc0NBRmI7T0EzQkY7TUE4QkEsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1FBRUEsV0FBQSxFQUFhLGdFQUZiO09BL0JGO01Ba0NBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLFdBQUEsRUFBYSxxREFGYjtPQW5DRjtNQXNDQSxzQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsa0NBRmI7T0F2Q0Y7S0FERjtJQTRDQSxRQUFBLEVBQVUsSUE1Q1Y7SUE4Q0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxtQkFBSixDQUFBO01BQ1osSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEsMkJBQUEsRUFBNkIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO1FBQ0EsK0JBQUEsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGpDO09BRGUsQ0FBbkI7SUFKUSxDQTlDVjtJQXNEQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQVMsQ0FBRSxPQUFYLENBQUE7O01BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7WUFDRSxDQUFFLE9BQWhCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFKUCxDQXREWjtJQTREQSxvQ0FBQSxFQUFzQyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0E1RHRDO0lBOERBLDBCQUFBLEVBQTRCLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQTlENUI7SUFnRUEsZ0JBQUEsRUFBa0IsU0FBQyxTQUFEO2FBQ2hCLElBQUMsQ0FBQSxRQUFRLENBQUMsWUFBVixDQUF1QixTQUF2QjtJQURnQixDQWhFbEI7SUFtRUEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBYjtlQUNFLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFIRjs7SUFETSxDQW5FUjtJQXlFQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBO0lBRFMsQ0F6RVg7SUE0RUEsbUJBQUEsRUFBcUIsU0FBQyxlQUFEO2FBQ25CLElBQUMsQ0FBQSxRQUFRLENBQUMsZUFBVixDQUEwQixlQUExQjtJQURtQixDQTVFckI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5IaWdobGlnaHRlZEFyZWFWaWV3ID0gcmVxdWlyZSAnLi9oaWdobGlnaHRlZC1hcmVhLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIG9ubHlIaWdobGlnaHRXaG9sZVdvcmRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaGlkZUhpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGlnbm9yZUNhc2U6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgbGlnaHRUaGVtZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBoaWdobGlnaHRCYWNrZ3JvdW5kOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG1pbmltdW1MZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDJcbiAgICB0aW1lb3V0OlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyMFxuICAgICAgZGVzY3JpcHRpb246ICdEZWZlcnMgc2VhcmNoaW5nIGZvciBtYXRjaGluZyBzdHJpbmdzIGZvciBYIG1zJ1xuICAgIHNob3dJblN0YXR1c0JhcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGhvdyBtYW55IG1hdGNoZXMgdGhlcmUgYXJlJ1xuICAgIGhpZ2hsaWdodEluUGFuZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGlnaGxpZ2h0IHNlbGVjdGlvbiBpbiBhbm90aGVyIHBhbmVzJ1xuICAgIHN0YXR1c0JhclN0cmluZzpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnSGlnaGxpZ2h0ZWQ6ICVjJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdGV4dCB0byBzaG93IGluIHRoZSBzdGF0dXMgYmFyLiAlYyA9IG51bWJlciBvZiBvY2N1cnJlbmNlcydcbiAgICBhbGxvd2VkQ2hhcmFjdGVyc1RvU2VsZWN0OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICckQCUtJ1xuICAgICAgZGVzY3JpcHRpb246ICdOb24gV29yZCBDaGFyYWN0ZXJzIHRoYXQgYXJlIGFsbG93ZWQgdG8gYmUgc2VsZWN0ZWQnXG4gICAgc2hvd1Jlc3VsdHNPblNjcm9sbEJhcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyBoaWdobGlnaHQgb24gdGhlIHNjcm9sbCBiYXInXG5cbiAgYXJlYVZpZXc6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBhcmVhVmlldyA9IG5ldyBIaWdobGlnaHRlZEFyZWFWaWV3KClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkOnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuICAgICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkOnNlbGVjdC1hbGwnOiA9PiBAc2VsZWN0QWxsKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBhcmVhVmlldz8uZGVzdHJveSgpXG4gICAgQGFyZWFWaWV3ID0gbnVsbFxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICBwcm92aWRlSGlnaGxpZ2h0U2VsZWN0ZWRWMURlcHJlY2F0ZWQ6IC0+IEBhcmVhVmlld1xuXG4gIHByb3ZpZGVIaWdobGlnaHRTZWxlY3RlZFYyOiAtPiBAYXJlYVZpZXdcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBhcmVhVmlldy5zZXRTdGF0dXNCYXIgc3RhdHVzQmFyXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBhcmVhVmlldy5kaXNhYmxlZFxuICAgICAgQGFyZWFWaWV3LmVuYWJsZSgpXG4gICAgZWxzZVxuICAgICAgQGFyZWFWaWV3LmRpc2FibGUoKVxuXG4gIHNlbGVjdEFsbDogLT5cbiAgICBAYXJlYVZpZXcuc2VsZWN0QWxsKClcblxuICBjb25zdW1lU2Nyb2xsTWFya2VyOiAoc2Nyb2xsTWFya2VyQVBJKSAtPlxuICAgIEBhcmVhVmlldy5zZXRTY3JvbGxNYXJrZXIgc2Nyb2xsTWFya2VyQVBJXG4iXX0=

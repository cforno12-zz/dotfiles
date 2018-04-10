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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2hpZ2hsaWdodC1zZWxlY3RlZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BREY7TUFHQSwyQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FKRjtNQU1BLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BUEY7TUFTQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQVZGO01BWUEsbUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BYkY7TUFlQSxhQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtPQWhCRjtNQWtCQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxnREFGYjtPQW5CRjtNQXNCQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQXZCRjtNQTBCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsc0NBRmI7T0EzQkY7S0FERjtJQWdDQSxRQUFBLEVBQVUsSUFoQ1Y7SUFrQ0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsbUJBQUEsQ0FBQTtNQUNoQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7T0FEZSxDQUFuQjtJQUpRLENBbENWO0lBeUNBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBUyxDQUFFLE9BQVgsQ0FBQTs7TUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZOztZQUNFLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpQLENBekNaO0lBK0NBLG9DQUFBLEVBQXNDLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQS9DdEM7SUFpREEsMEJBQUEsRUFBNEIsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBakQ1QjtJQW1EQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7YUFDaEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFNBQXZCO0lBRGdCLENBbkRsQjtJQXNEQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFiO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQUhGOztJQURNLENBdERSOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuSGlnaGxpZ2h0ZWRBcmVhVmlldyA9IHJlcXVpcmUgJy4vaGlnaGxpZ2h0ZWQtYXJlYS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBvbmx5SGlnaGxpZ2h0V2hvbGVXb3JkczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBpZ25vcmVDYXNlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGxpZ2h0VGhlbWU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgaGlnaGxpZ2h0QmFja2dyb3VuZDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBtaW5pbXVtTGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyXG4gICAgdGltZW91dDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMjBcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmZXJzIHNlYXJjaGluZyBmb3IgbWF0Y2hpbmcgc3RyaW5ncyBmb3IgWCBtcydcbiAgICBzaG93SW5TdGF0dXNCYXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyBob3cgbWFueSBtYXRjaGVzIHRoZXJlIGFyZSdcbiAgICBoaWdobGlnaHRJblBhbmVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0hpZ2hsaWdodCBzZWxlY3Rpb24gaW4gYW5vdGhlciBwYW5lcydcblxuICBhcmVhVmlldzogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGFyZWFWaWV3ID0gbmV3IEhpZ2hsaWdodGVkQXJlYVZpZXcoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICAgICdoaWdobGlnaHQtc2VsZWN0ZWQ6dG9nZ2xlJzogPT4gQHRvZ2dsZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAYXJlYVZpZXc/LmRlc3Ryb3koKVxuICAgIEBhcmVhVmlldyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgcHJvdmlkZUhpZ2hsaWdodFNlbGVjdGVkVjFEZXByZWNhdGVkOiAtPiBAYXJlYVZpZXdcblxuICBwcm92aWRlSGlnaGxpZ2h0U2VsZWN0ZWRWMjogLT4gQGFyZWFWaWV3XG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBAYXJlYVZpZXcuc2V0U3RhdHVzQmFyIHN0YXR1c0JhclxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAYXJlYVZpZXcuZGlzYWJsZWRcbiAgICAgIEBhcmVhVmlldy5lbmFibGUoKVxuICAgIGVsc2VcbiAgICAgIEBhcmVhVmlldy5kaXNhYmxlKClcbiJdfQ==

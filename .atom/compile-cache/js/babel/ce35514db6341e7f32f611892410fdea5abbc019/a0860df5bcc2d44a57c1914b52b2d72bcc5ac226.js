var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var React = undefined;
var ReactDOM = undefined;
var Component = undefined;

var PanelDock = (function () {
  function PanelDock(delegate) {
    var _this = this;

    _classCallCheck(this, PanelDock);

    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ui-default.panelHeight', function (panelHeight) {
      var paneContainer = atom.workspace.paneContainerForItem(_this);
      // NOTE: This is an internal API access
      // It's necessary because there's no Public API for it yet
      if (paneContainer && typeof paneContainer.state === 'object' && typeof paneContainer.state.size === 'number' && typeof paneContainer.render === 'function') {
        paneContainer.state.size = panelHeight;
        paneContainer.render(paneContainer.state);
      }
    }));

    if (!React) {
      React = require('react');
    }
    if (!ReactDOM) {
      ReactDOM = require('react-dom');
    }
    if (!Component) {
      Component = require('./component');
    }

    ReactDOM.render(React.createElement(Component, { delegate: delegate }), this.element);
  }

  _createClass(PanelDock, [{
    key: 'getURI',
    value: function getURI() {
      return _helpers.WORKSPACE_URI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Linter';
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ['center', 'bottom', 'top'];
    }
  }, {
    key: 'getPreferredHeight',
    value: function getPreferredHeight() {
      return atom.config.get('linter-ui-default.panelHeight');
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      var paneContainer = atom.workspace.paneContainerForItem(this);
      if (paneContainer) {
        if (typeof paneContainer.state === 'object' && typeof paneContainer.state.size === 'number') {
          atom.config.set('linter-ui-default.panelHeight', paneContainer.state.size);
        }
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFb0MsTUFBTTs7dUJBQ1osWUFBWTs7QUFFMUMsSUFBSSxLQUFLLFlBQUEsQ0FBQTtBQUNULElBQUksUUFBUSxZQUFBLENBQUE7QUFDWixJQUFJLFNBQVMsWUFBQSxDQUFBOztJQUVQLFNBQVM7QUFJRixXQUpQLFNBQVMsQ0FJRCxRQUFnQixFQUFFOzs7MEJBSjFCLFNBQVM7O0FBS1gsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDM0YsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsT0FBTSxDQUFBOzs7QUFHL0QsVUFBSSxhQUFhLElBQUksT0FBTyxhQUFhLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQzFKLHFCQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUE7QUFDdEMscUJBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzFDO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLFdBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDekI7QUFDRCxRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsY0FBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUNoQztBQUNELFFBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxlQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ25DOztBQUVELFlBQVEsQ0FBQyxNQUFNLENBQUMsb0JBQUMsU0FBUyxJQUFDLFFBQVEsRUFBRSxRQUFRLEFBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNqRTs7ZUE1QkcsU0FBUzs7V0E2QlAsa0JBQUc7QUFDUCxvQ0FBb0I7S0FDckI7OztXQUNPLG9CQUFHO0FBQ1QsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2tCLCtCQUFHO0FBQ3BCLGFBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ25DOzs7V0FDaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMvRCxVQUFJLGFBQWEsRUFBRTtBQUNqQixZQUFJLE9BQU8sYUFBYSxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0YsY0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUMzRTtBQUNELHFCQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDeEQ7S0FDRjs7O1NBckRHLFNBQVM7OztBQXdEZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9kb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBXT1JLU1BBQ0VfVVJJIH0gZnJvbSAnLi4vaGVscGVycydcblxubGV0IFJlYWN0XG5sZXQgUmVhY3RET01cbmxldCBDb21wb25lbnRcblxuY2xhc3MgUGFuZWxEb2NrIHtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoZGVsZWdhdGU6IE9iamVjdCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxIZWlnaHQnLCAocGFuZWxIZWlnaHQpID0+IHtcbiAgICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzKVxuICAgICAgLy8gTk9URTogVGhpcyBpcyBhbiBpbnRlcm5hbCBBUEkgYWNjZXNzXG4gICAgICAvLyBJdCdzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZXJlJ3Mgbm8gUHVibGljIEFQSSBmb3IgaXQgeWV0XG4gICAgICBpZiAocGFuZUNvbnRhaW5lciAmJiB0eXBlb2YgcGFuZUNvbnRhaW5lci5zdGF0ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHBhbmVDb250YWluZXIucmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9IHBhbmVsSGVpZ2h0XG4gICAgICAgIHBhbmVDb250YWluZXIucmVuZGVyKHBhbmVDb250YWluZXIuc3RhdGUpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBpZiAoIVJlYWN0KSB7XG4gICAgICBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbiAgICB9XG4gICAgaWYgKCFSZWFjdERPTSkge1xuICAgICAgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKVxuICAgIH1cbiAgICBpZiAoIUNvbXBvbmVudCkge1xuICAgICAgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuICAgIH1cblxuICAgIFJlYWN0RE9NLnJlbmRlcig8Q29tcG9uZW50IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gLz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIFdPUktTUEFDRV9VUklcbiAgfVxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0xpbnRlcidcbiAgfVxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuICdib3R0b20nXG4gIH1cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucygpIHtcbiAgICByZXR1cm4gWydjZW50ZXInLCAnYm90dG9tJywgJ3RvcCddXG4gIH1cbiAgZ2V0UHJlZmVycmVkSGVpZ2h0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcylcbiAgICBpZiAocGFuZUNvbnRhaW5lcikge1xuICAgICAgaWYgKHR5cGVvZiBwYW5lQ29udGFpbmVyLnN0YXRlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcGFuZUNvbnRhaW5lci5zdGF0ZS5zaXplID09PSAnbnVtYmVyJykge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JywgcGFuZUNvbnRhaW5lci5zdGF0ZS5zaXplKVxuICAgICAgfVxuICAgICAgcGFuZUNvbnRhaW5lci5wYW5lRm9ySXRlbSh0aGlzKS5kZXN0cm95SXRlbSh0aGlzLCB0cnVlKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsRG9ja1xuIl19
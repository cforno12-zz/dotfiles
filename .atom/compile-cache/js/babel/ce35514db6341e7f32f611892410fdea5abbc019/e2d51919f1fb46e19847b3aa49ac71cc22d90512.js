var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var Panel = (function () {
  function Panel() {
    _classCallCheck(this, Panel);

    this.subscriptions = new _atom.CompositeDisposable();

    var element = document.createElement('div');
    var panel = atom.workspace.addBottomPanel({
      item: element,
      visible: true,
      priority: 500
    });
    this.subscriptions.add(new _atom.Disposable(function () {
      panel.destroy();
    }));

    this.delegate = new _delegate2['default'](panel);
    this.subscriptions.add(this.delegate);

    _reactDom2['default'].render(_react2['default'].createElement(_component2['default'], { delegate: this.delegate }), element);
  }

  _createClass(Panel, [{
    key: 'update',
    value: function update(messages) {
      this.delegate.update(messages);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztxQkFFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O29CQUNnQixNQUFNOzt3QkFFakMsWUFBWTs7Ozt5QkFDWCxhQUFhOzs7O0lBRzdCLEtBQUs7QUFJRSxXQUpQLEtBQUssR0FJSzswQkFKVixLQUFLOztBQUtQLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDN0MsUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFDMUMsVUFBSSxFQUFFLE9BQU87QUFDYixhQUFPLEVBQUUsSUFBSTtBQUNiLGNBQVEsRUFBRSxHQUFHO0tBQ2QsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMscUJBQWUsWUFBVztBQUMvQyxXQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDaEIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBYSxLQUFLLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLDBCQUFTLE1BQU0sQ0FBQywyREFBVyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDakU7O2VBckJHLEtBQUs7O1dBc0JILGdCQUFDLFFBQThCLEVBQVE7QUFDM0MsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDL0I7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBM0JHLEtBQUs7OztBQThCWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50J1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsIHtcbiAgZGVsZWdhdGU6IERlbGVnYXRlO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuICAgICAgaXRlbTogZWxlbWVudCxcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBwcmlvcml0eTogNTAwLFxuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgIHBhbmVsLmRlc3Ryb3koKVxuICAgIH0pKVxuXG4gICAgdGhpcy5kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZShwYW5lbClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZGVsZWdhdGUpXG5cbiAgICBSZWFjdERPTS5yZW5kZXIoPENvbXBvbmVudCBkZWxlZ2F0ZT17dGhpcy5kZWxlZ2F0ZX0gLz4sIGVsZW1lbnQpXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPik6IHZvaWQge1xuICAgIHRoaXMuZGVsZWdhdGUudXBkYXRlKG1lc3NhZ2VzKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxcbiJdfQ==
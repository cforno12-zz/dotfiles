Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _viewList = require('./view-list');

var _viewList2 = _interopRequireDefault(_viewList);

var _providersList = require('./providers-list');

var _providersList2 = _interopRequireDefault(_providersList);

var _providersHighlight = require('./providers-highlight');

var _providersHighlight2 = _interopRequireDefault(_providersHighlight);

var Intentions = (function () {
  function Intentions() {
    var _this = this;

    _classCallCheck(this, Intentions);

    this.active = null;
    this.commands = new _commands2['default']();
    this.providersList = new _providersList2['default']();
    this.providersHighlight = new _providersHighlight2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.providersList);
    this.subscriptions.add(this.providersHighlight);

    // eslint-disable-next-line arrow-parens
    this.commands.onListShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersList.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var listView = new _viewList2['default']();
      var subscriptions = new _sbEventKit.CompositeDisposable();

      listView.activate(textEditor, results);
      listView.onDidSelect(function (intention) {
        intention.selected();
        subscriptions.dispose();
      });

      subscriptions.add(listView);
      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onListMove(function (movement) {
        listView.move(movement);
      }));
      subscriptions.add(_this.commands.onListConfirm(function () {
        listView.select();
      }));
      subscriptions.add(_this.commands.onListHide(function () {
        subscriptions.dispose();
      }));
      _this.active = subscriptions;
      return true;
    }));
    // eslint-disable-next-line arrow-parens
    this.commands.onHighlightsShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersHighlight.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var painted = _this.providersHighlight.paint(textEditor, results);
      var subscriptions = new _sbEventKit.CompositeDisposable();

      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onHighlightsHide(function () {
        subscriptions.dispose();
      }));
      subscriptions.add(painted);
      _this.active = subscriptions;

      return true;
    }));
  }

  _createClass(Intentions, [{
    key: 'activate',
    value: function activate() {
      this.commands.activate();
    }
  }, {
    key: 'consumeListProvider',
    value: function consumeListProvider(provider) {
      this.providersList.addProvider(provider);
    }
  }, {
    key: 'deleteListProvider',
    value: function deleteListProvider(provider) {
      this.providersList.deleteProvider(provider);
    }
  }, {
    key: 'consumeHighlightProvider',
    value: function consumeHighlightProvider(provider) {
      this.providersHighlight.addProvider(provider);
    }
  }, {
    key: 'deleteHighlightProvider',
    value: function deleteHighlightProvider(provider) {
      this.providersHighlight.deleteProvider(provider);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.dispose();
      }
    }
  }]);

  return Intentions;
})();

exports['default'] = Intentions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MEJBRWdELGNBQWM7O3dCQUV6QyxZQUFZOzs7O3dCQUNaLGFBQWE7Ozs7NkJBQ1Isa0JBQWtCOzs7O2tDQUNiLHVCQUF1Qjs7OztJQUdqQyxVQUFVO0FBTWxCLFdBTlEsVUFBVSxHQU1mOzs7MEJBTkssVUFBVTs7QUFPM0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsZ0NBQW1CLENBQUE7QUFDeEMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLHFDQUF3QixDQUFBO0FBQ2xELFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDMUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUE7OztBQUcvQyxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsbUJBQUMsV0FBTyxVQUFVLEVBQUs7QUFDN0MsVUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFLLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDNUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbkIsZUFBTyxLQUFLLENBQUE7T0FDYjs7QUFFRCxVQUFNLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQy9CLFVBQU0sYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUUvQyxjQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFP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QUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN0QjtLQUNGOzs7U0EvRmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5cbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IExpc3RWaWV3IGZyb20gJy4vdmlldy1saXN0J1xuaW1wb3J0IFByb3ZpZGVyc0xpc3QgZnJvbSAnLi9wcm92aWRlcnMtbGlzdCdcbmltcG9ydCBQcm92aWRlcnNIaWdobGlnaHQgZnJvbSAnLi9wcm92aWRlcnMtaGlnaGxpZ2h0J1xuaW1wb3J0IHR5cGUgeyBMaXN0UHJvdmlkZXIsIEhpZ2hsaWdodFByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZW50aW9ucyB7XG4gIGFjdGl2ZTogP0Rpc3Bvc2FibGU7XG4gIGNvbW1hbmRzOiBDb21tYW5kcztcbiAgcHJvdmlkZXJzTGlzdDogUHJvdmlkZXJzTGlzdDtcbiAgcHJvdmlkZXJzSGlnaGxpZ2h0OiBQcm92aWRlcnNIaWdobGlnaHQ7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMucHJvdmlkZXJzTGlzdCA9IG5ldyBQcm92aWRlcnNMaXN0KClcbiAgICB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodCA9IG5ldyBQcm92aWRlcnNIaWdobGlnaHQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucHJvdmlkZXJzTGlzdClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0KVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGFycm93LXBhcmVuc1xuICAgIHRoaXMuY29tbWFuZHMub25MaXN0U2hvdyhhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMucHJvdmlkZXJzTGlzdC50cmlnZ2VyKHRleHRFZGl0b3IpXG4gICAgICBpZiAoIXJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0VmlldyA9IG5ldyBMaXN0VmlldygpXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgICBsaXN0Vmlldy5hY3RpdmF0ZSh0ZXh0RWRpdG9yLCByZXN1bHRzKVxuICAgICAgbGlzdFZpZXcub25EaWRTZWxlY3QoZnVuY3Rpb24oaW50ZW50aW9uKSB7XG4gICAgICAgIGludGVudGlvbi5zZWxlY3RlZCgpXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9KVxuXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChsaXN0VmlldylcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uTGlzdE1vdmUoZnVuY3Rpb24obW92ZW1lbnQpIHtcbiAgICAgICAgbGlzdFZpZXcubW92ZShtb3ZlbWVudClcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcy5vbkxpc3RDb25maXJtKGZ1bmN0aW9uKCkge1xuICAgICAgICBsaXN0Vmlldy5zZWxlY3QoKVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9KSlcbiAgICAgIHRoaXMuYWN0aXZlID0gc3Vic2NyaXB0aW9uc1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJvdy1wYXJlbnNcbiAgICB0aGlzLmNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC50cmlnZ2VyKHRleHRFZGl0b3IpXG4gICAgICBpZiAoIXJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBwYWludGVkID0gdGhpcy5wcm92aWRlcnNIaWdobGlnaHQucGFpbnQodGV4dEVkaXRvciwgcmVzdWx0cylcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHBhaW50ZWQpXG4gICAgICB0aGlzLmFjdGl2ZSA9IHN1YnNjcmlwdGlvbnNcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY29tbWFuZHMuYWN0aXZhdGUoKVxuICB9XG4gIGNvbnN1bWVMaXN0UHJvdmlkZXIocHJvdmlkZXI6IExpc3RQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzTGlzdC5hZGRQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBkZWxldGVMaXN0UHJvdmlkZXIocHJvdmlkZXI6IExpc3RQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzTGlzdC5kZWxldGVQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBjb25zdW1lSGlnaGxpZ2h0UHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQuYWRkUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgZGVsZXRlSGlnaGxpZ2h0UHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQuZGVsZXRlUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2ZS5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var PanelDelegate = (function () {
  function PanelDelegate() {
    var _this = this;

    _classCallCheck(this, PanelDelegate);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.filteredMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', function (panelRepresents) {
      var notInitial = typeof _this.panelRepresents !== 'undefined';
      _this.panelRepresents = panelRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    var changeSubscription = undefined;
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
        changeSubscription = null;
      }
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (textEditor) {
        (function () {
          if (_this.panelRepresents !== 'Entire Project') {
            _this.update();
          }
          var oldRow = -1;
          changeSubscription = textEditor.onDidChangeCursorPosition(function (_ref) {
            var newBufferPosition = _ref.newBufferPosition;

            if (oldRow !== newBufferPosition.row && _this.panelRepresents === 'Current Line') {
              oldRow = newBufferPosition.row;
              _this.update();
            }
          });
        })();
      }

      if (_this.panelRepresents !== 'Entire Project' || textEditor) {
        _this.update();
      }
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
      }
    }));
  }

  _createClass(PanelDelegate, [{
    key: 'getFilteredMessages',
    value: function getFilteredMessages() {
      var filteredMessages = [];
      if (this.panelRepresents === 'Entire Project') {
        filteredMessages = this.messages;
      } else if (this.panelRepresents === 'Current File') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        filteredMessages = (0, _helpers.filterMessages)(this.messages, activeEditor.getPath());
      } else if (this.panelRepresents === 'Current Line') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        var activeLine = activeEditor.getCursors()[0].getBufferRow();
        filteredMessages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, activeEditor.getPath(), _atom.Range.fromObject([[activeLine, 0], [activeLine, Infinity]]));
      }
      return filteredMessages;
    }
  }, {
    key: 'update',
    value: function update() {
      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(messages)) {
        this.messages = messages;
      }
      this.filteredMessages = this.getFilteredMessages();
      this.emitter.emit('observe-messages', this.filteredMessages);
    }
  }, {
    key: 'onDidChangeMessages',
    value: function onDidChangeMessages(callback) {
      return this.emitter.on('observe-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return PanelDelegate;
})();

module.exports = PanelDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RlbGVnYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRWdFLE1BQU07O3VCQUVZLFlBQVk7O0lBR3hGLGFBQWE7QUFPTixXQVBQLGFBQWEsR0FPSDs7OzBCQVBWLGFBQWE7O0FBUWYsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsVUFBQyxlQUFlLEVBQUs7QUFDbkcsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLGVBQWUsS0FBSyxXQUFXLENBQUE7QUFDOUQsWUFBSyxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ3RDLFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxNQUFNLEVBQUUsQ0FBQTtPQUNkO0tBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLGtCQUFrQixZQUFBLENBQUE7QUFDdEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFNO0FBQzVFLFVBQUksa0JBQWtCLEVBQUU7QUFDdEIsMEJBQWtCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsMEJBQWtCLEdBQUcsSUFBSSxDQUFBO09BQzFCO0FBQ0QsVUFBTSxVQUFVLEdBQUcsbUNBQXFCLENBQUE7QUFDeEMsVUFBSSxVQUFVLEVBQUU7O0FBQ2QsY0FBSSxNQUFLLGVBQWUsS0FBSyxnQkFBZ0IsRUFBRTtBQUM3QyxrQkFBSyxN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L2xpYi9wYW5lbC9kZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIsIFJhbmdlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IHsgZ2V0QWN0aXZlVGV4dEVkaXRvciwgZmlsdGVyTWVzc2FnZXMsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsRGVsZWdhdGUge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIGZpbHRlcmVkTWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBwYW5lbFJlcHJlc2VudHM6ICdFbnRpcmUgUHJvamVjdCcgfCAnQ3VycmVudCBGaWxlJyB8ICdDdXJyZW50IExpbmUnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmZpbHRlcmVkTWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxSZXByZXNlbnRzJywgKHBhbmVsUmVwcmVzZW50cykgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnBhbmVsUmVwcmVzZW50cyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMucGFuZWxSZXByZXNlbnRzID0gcGFuZWxSZXByZXNlbnRzXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfSkpXG4gICAgbGV0IGNoYW5nZVN1YnNjcmlwdGlvblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgIGlmIChjaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsXG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0RWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAodGV4dEVkaXRvcikge1xuICAgICAgICBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9sZFJvdyA9IC0xXG4gICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbiA9IHRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgICAgaWYgKG9sZFJvdyAhPT0gbmV3QnVmZmVyUG9zaXRpb24ucm93ICYmIHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnQ3VycmVudCBMaW5lJykge1xuICAgICAgICAgICAgb2xkUm93ID0gbmV3QnVmZmVyUG9zaXRpb24ucm93XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICdFbnRpcmUgUHJvamVjdCcgfHwgdGV4dEVkaXRvcikge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG4gIGdldEZpbHRlcmVkTWVzc2FnZXMoKTogQXJyYXk8TGludGVyTWVzc2FnZT4ge1xuICAgIGxldCBmaWx0ZXJlZE1lc3NhZ2VzID0gW11cbiAgICBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgIGZpbHRlcmVkTWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0N1cnJlbnQgRmlsZScpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgKCFhY3RpdmVFZGl0b3IpIHJldHVybiBbXVxuICAgICAgZmlsdGVyZWRNZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIGFjdGl2ZUVkaXRvci5nZXRQYXRoKCkpXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0N1cnJlbnQgTGluZScpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgKCFhY3RpdmVFZGl0b3IpIHJldHVybiBbXVxuICAgICAgY29uc3QgYWN0aXZlTGluZSA9IGFjdGl2ZUVkaXRvci5nZXRDdXJzb3JzKClbMF0uZ2V0QnVmZmVyUm93KClcbiAgICAgIGZpbHRlcmVkTWVzc2FnZXMgPSBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50KHRoaXMubWVzc2FnZXMsIGFjdGl2ZUVkaXRvci5nZXRQYXRoKCksIFJhbmdlLmZyb21PYmplY3QoW1thY3RpdmVMaW5lLCAwXSwgW2FjdGl2ZUxpbmUsIEluZmluaXR5XV0pKVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyZWRNZXNzYWdlc1xuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgfVxuICAgIHRoaXMuZmlsdGVyZWRNZXNzYWdlcyA9IHRoaXMuZ2V0RmlsdGVyZWRNZXNzYWdlcygpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUtbWVzc2FnZXMnLCB0aGlzLmZpbHRlcmVkTWVzc2FnZXMpXG4gIH1cbiAgb25EaWRDaGFuZ2VNZXNzYWdlcyhjYWxsYmFjazogKChtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbERlbGVnYXRlXG4iXX0=
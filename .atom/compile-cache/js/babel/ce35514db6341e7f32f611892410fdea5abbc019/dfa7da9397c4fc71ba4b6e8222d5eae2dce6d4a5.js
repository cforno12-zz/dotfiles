var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var Panel = undefined;
var Editors = undefined;
var TreeView = undefined;

var LinterUI = (function () {
  function LinterUI() {
    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.idleCallbacks = new Set();
    this.signal = new _busySignal2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    var obsShowPanelCB = window.requestIdleCallback((function observeShowPanel() {
      var _this = this;

      this.idleCallbacks['delete'](obsShowPanelCB);
      if (!Panel) {
        Panel = require('./panel');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
        if (showPanel && !_this.panel) {
          _this.panel = new Panel();
          _this.panel.update(_this.messages);
        } else if (!showPanel && _this.panel) {
          _this.panel.dispose();
          _this.panel = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowPanelCB);

    var obsShowDecorationsCB = window.requestIdleCallback((function observeShowDecorations() {
      var _this2 = this;

      this.idleCallbacks['delete'](obsShowDecorationsCB);
      if (!Editors) {
        Editors = require('./editors');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
        if (showDecorations && !_this2.editors) {
          _this2.editors = new Editors();
          _this2.editors.update({ added: _this2.messages, removed: [], messages: _this2.messages });
        } else if (!showDecorations && _this2.editors) {
          _this2.editors.dispose();
          _this2.editors = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowDecorationsCB);
  }

  _createClass(LinterUI, [{
    key: 'render',
    value: function render(difference) {
      var editors = this.editors;

      this.messages = difference.messages;
      if (editors) {
        if (editors.isFirstRender()) {
          editors.update({ added: difference.messages, removed: [], messages: difference.messages });
        } else {
          editors.update(difference);
        }
      }
      // Initialize the TreeView subscription if necessary
      if (!this.treeview) {
        if (!TreeView) {
          TreeView = require('./tree-view');
        }
        this.treeview = new TreeView();
        this.subscriptions.add(this.treeview);
      }
      this.treeview.update(difference.messages);

      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.intentions.update(difference.messages);
      this.statusBar.update(difference.messages);
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      this.signal.didBeginLinting(linter, filePath);
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      this.signal.didFinishLinting(linter, filePath);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
      if (this.panel) {
        this.panel.dispose();
      }
      if (this.editors) {
        this.editors.dispose();
      }
    }
  }]);

  return LinterUI;
})();

module.exports = LinterUI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOzt3QkFDckIsWUFBWTs7Ozt5QkFDWCxjQUFjOzs7OzBCQUNiLGVBQWU7Ozs7MEJBQ2YsY0FBYzs7OztBQUdyQyxJQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsSUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLElBQUksUUFBUSxZQUFBLENBQUE7O0lBRU4sUUFBUTtBQWFELFdBYlAsUUFBUSxHQWFFOzBCQWJWLFFBQVE7O0FBY1YsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxNQUFNLEdBQUcsNkJBQWdCLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsNEJBQWUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFBO0FBQ2xDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUV0QyxRQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQSxTQUFTLGdCQUFnQixHQUFHOzs7QUFDNUUsVUFBSSxDQUFDLGFBQWEsVUFBTyxD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Q0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QjtLQUNGOzs7U0F6R0csUUFBUTs7O0FBNEdkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuL3N0YXR1cy1iYXInXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tICcuL2J1c3ktc2lnbmFsJ1xuaW1wb3J0IEludGVudGlvbnMgZnJvbSAnLi9pbnRlbnRpb25zJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIExpbnRlck1lc3NhZ2UsIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgUGFuZWxcbmxldCBFZGl0b3JzXG5sZXQgVHJlZVZpZXdcblxuY2xhc3MgTGludGVyVUkge1xuICBuYW1lOiBzdHJpbmc7XG4gIHBhbmVsOiA/UGFuZWw7XG4gIHNpZ25hbDogQnVzeVNpZ25hbDtcbiAgZWRpdG9yczogP0VkaXRvcnM7XG4gIHRyZWV2aWV3OiBUcmVlVmlldztcbiAgY29tbWFuZHM6IENvbW1hbmRzO1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIHN0YXR1c0JhcjogU3RhdHVzQmFyO1xuICBpbnRlbnRpb25zOiBJbnRlbnRpb25zO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBpZGxlQ2FsbGJhY2tzOiBTZXQ8bnVtYmVyPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWUgPSAnTGludGVyJ1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc2lnbmFsID0gbmV3IEJ1c3lTaWduYWwoKVxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcigpXG4gICAgdGhpcy5pbnRlbnRpb25zID0gbmV3IEludGVudGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zaWduYWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zdGF0dXNCYXIpXG5cbiAgICBjb25zdCBvYnNTaG93UGFuZWxDQiA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uIG9ic2VydmVTaG93UGFuZWwoKSB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKG9ic1Nob3dQYW5lbENCKVxuICAgICAgaWYgKCFQYW5lbCkge1xuICAgICAgICBQYW5lbCA9IHJlcXVpcmUoJy4vcGFuZWwnKVxuICAgICAgfVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCAoc2hvd1BhbmVsKSA9PiB7XG4gICAgICAgIGlmIChzaG93UGFuZWwgJiYgIXRoaXMucGFuZWwpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsKClcbiAgICAgICAgICB0aGlzLnBhbmVsLnVwZGF0ZSh0aGlzLm1lc3NhZ2VzKVxuICAgICAgICB9IGVsc2UgaWYgKCFzaG93UGFuZWwgJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQob2JzU2hvd1BhbmVsQ0IpXG5cbiAgICBjb25zdCBvYnNTaG93RGVjb3JhdGlvbnNDQiA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uIG9ic2VydmVTaG93RGVjb3JhdGlvbnMoKSB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKG9ic1Nob3dEZWNvcmF0aW9uc0NCKVxuICAgICAgaWYgKCFFZGl0b3JzKSB7XG4gICAgICAgIEVkaXRvcnMgPSByZXF1aXJlKCcuL2VkaXRvcnMnKVxuICAgICAgfVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93RGVjb3JhdGlvbnMnLCAoc2hvd0RlY29yYXRpb25zKSA9PiB7XG4gICAgICAgIGlmIChzaG93RGVjb3JhdGlvbnMgJiYgIXRoaXMuZWRpdG9ycykge1xuICAgICAgICAgIHRoaXMuZWRpdG9ycyA9IG5ldyBFZGl0b3JzKClcbiAgICAgICAgICB0aGlzLmVkaXRvcnMudXBkYXRlKHsgYWRkZWQ6IHRoaXMubWVzc2FnZXMsIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogdGhpcy5tZXNzYWdlcyB9KVxuICAgICAgICB9IGVsc2UgaWYgKCFzaG93RGVjb3JhdGlvbnMgJiYgdGhpcy5lZGl0b3JzKSB7XG4gICAgICAgICAgdGhpcy5lZGl0b3JzLmRpc3Bvc2UoKVxuICAgICAgICAgIHRoaXMuZWRpdG9ycyA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQob2JzU2hvd0RlY29yYXRpb25zQ0IpXG4gIH1cbiAgcmVuZGVyKGRpZmZlcmVuY2U6IE1lc3NhZ2VzUGF0Y2gpIHtcbiAgICBjb25zdCBlZGl0b3JzID0gdGhpcy5lZGl0b3JzXG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gZGlmZmVyZW5jZS5tZXNzYWdlc1xuICAgIGlmIChlZGl0b3JzKSB7XG4gICAgICBpZiAoZWRpdG9ycy5pc0ZpcnN0UmVuZGVyKCkpIHtcbiAgICAgICAgZWRpdG9ycy51cGRhdGUoeyBhZGRlZDogZGlmZmVyZW5jZS5tZXNzYWdlcywgcmVtb3ZlZDogW10sIG1lc3NhZ2VzOiBkaWZmZXJlbmNlLm1lc3NhZ2VzIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlZGl0b3JzLnVwZGF0ZShkaWZmZXJlbmNlKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIHRoZSBUcmVlVmlldyBzdWJzY3JpcHRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKCF0aGlzLnRyZWV2aWV3KSB7XG4gICAgICBpZiAoIVRyZWVWaWV3KSB7XG4gICAgICAgIFRyZWVWaWV3ID0gcmVxdWlyZSgnLi90cmVlLXZpZXcnKVxuICAgICAgfVxuICAgICAgdGhpcy50cmVldmlldyA9IG5ldyBUcmVlVmlldygpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMudHJlZXZpZXcpXG4gICAgfVxuICAgIHRoaXMudHJlZXZpZXcudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG5cbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kcy51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB0aGlzLmludGVudGlvbnMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5zdGF0dXNCYXIudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gIH1cbiAgZGlkQmVnaW5MaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZWRpdG9ycykge1xuICAgICAgdGhpcy5lZGl0b3JzLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclVJXG4iXX0=
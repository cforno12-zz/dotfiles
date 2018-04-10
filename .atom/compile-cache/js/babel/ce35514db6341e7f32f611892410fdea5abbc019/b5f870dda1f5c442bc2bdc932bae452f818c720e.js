var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.executing = new Set();
    this.providerTitles = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.useBusySignal', function (useBusySignal) {
      _this.useBusySignal = useBusySignal;
    }));
  }

  _createClass(BusySignal, [{
    key: 'attach',
    value: function attach(registry) {
      this.provider = registry.create();
      this.update();
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      var provider = this.provider;
      if (!provider) return;
      if (!this.useBusySignal) return;
      var fileMap = new Map();
      var currentTitles = new Set();

      for (var _ref2 of this.executing) {
        var _filePath = _ref2.filePath;
        var _linter = _ref2.linter;

        var names = fileMap.get(_filePath);
        if (!names) {
          fileMap.set(_filePath, names = []);
        }
        names.push(_linter.name);
      }

      var _loop = function (_ref3) {
        _ref32 = _slicedToArray(_ref3, 2);
        var filePath = _ref32[0];
        var names = _ref32[1];

        var path = filePath ? ' on ' + atom.project.relativizePath(filePath)[1] : '';
        names.forEach(function (name) {
          var title = '' + name + path;
          currentTitles.add(title);
          if (!_this2.providerTitles.has(title)) {
            // Add the title since it hasn't been seen before
            _this2.providerTitles.add(title);
            provider.add(title);
          }
        });
      };

      for (var _ref3 of fileMap) {
        var _ref32;

        _loop(_ref3);
      }

      // Remove any titles no longer active
      this.providerTitles.forEach(function (title) {
        if (!currentTitles.has(title)) {
          provider.remove(title);
          _this2.providerTitles['delete'](title);
        }
      });

      fileMap.clear();
    }
  }, {
    key: 'getExecuting',
    value: function getExecuting(linter, filePath) {
      for (var entry of this.executing) {
        if (entry.linter === linter && entry.filePath === filePath) {
          return entry;
        }
      }
      return null;
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      if (this.getExecuting(linter, filePath)) {
        return;
      }
      this.executing.add({ linter: linter, filePath: filePath });
      this.update();
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      var entry = this.getExecuting(linter, filePath);
      if (entry) {
        this.executing['delete'](entry);
        this.update();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.provider) {
        this.provider.clear();
      }
      this.providerTitles.clear();
      this.executing.clear();
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

module.exports = BusySignal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2J1c3ktc2lnbmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7SUFHcEMsVUFBVTtBQVVILFdBVlAsVUFBVSxHQVVBOzs7MEJBVlYsVUFBVTs7QUFXWixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQy9CLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxFQUFFLFVBQUMsYUFBYSxFQUFLO0FBQy9GLFlBQUssYUFBYSxHQUFHLGFBQWEsQ0FBQTtLQUNuQyxDQUFDLENBQUMsQ0FBQTtHQUNKOztlQWxCRyxVQUFVOztXQW1CUixnQkFBQyxRQUFnQixFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2pDLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtLQUNkOzs7V0FDSyxrQkFBRzs7O0FBQ1AsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtBQUM5QixVQUFJLENBQUMsUUFBUSxFQUFFLE9BQU07QUFDckIsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTTtBQUMvQixVQUFNLE9BQW9DLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN0RCxVQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUUvQix3QkFBbUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUF0QyxTQUFRLFNBQVIsUUFBUTtZQUFFLE9BQU0sU0FBTixNQUFNOztBQUMzQixZQUFJLEtBQUssR0FBRyxPQUFPLENB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OiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9idXN5LXNpZ25hbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBCdXN5U2lnbmFsIHtcbiAgcHJvdmlkZXI6ID9PYmplY3Q7XG4gIGV4ZWN1dGluZzogU2V0PHtcbiAgICBsaW50ZXI6IExpbnRlcixcbiAgICBmaWxlUGF0aDogP3N0cmluZyxcbiAgfT47XG4gIHByb3ZpZGVyVGl0bGVzOiBTZXQ8c3RyaW5nPjtcbiAgdXNlQnVzeVNpZ25hbDogYm9vbGVhbjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmV4ZWN1dGluZyA9IG5ldyBTZXQoKVxuICAgIHRoaXMucHJvdmlkZXJUaXRsZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnVzZUJ1c3lTaWduYWwnLCAodXNlQnVzeVNpZ25hbCkgPT4ge1xuICAgICAgdGhpcy51c2VCdXN5U2lnbmFsID0gdXNlQnVzeVNpZ25hbFxuICAgIH0pKVxuICB9XG4gIGF0dGFjaChyZWdpc3RyeTogT2JqZWN0KSB7XG4gICAgdGhpcy5wcm92aWRlciA9IHJlZ2lzdHJ5LmNyZWF0ZSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMucHJvdmlkZXJcbiAgICBpZiAoIXByb3ZpZGVyKSByZXR1cm5cbiAgICBpZiAoIXRoaXMudXNlQnVzeVNpZ25hbCkgcmV0dXJuXG4gICAgY29uc3QgZmlsZU1hcDogTWFwPD9zdHJpbmcsIEFycmF5PHN0cmluZz4+ID0gbmV3IE1hcCgpXG4gICAgY29uc3QgY3VycmVudFRpdGxlcyA9IG5ldyBTZXQoKVxuXG4gICAgZm9yIChjb25zdCB7IGZpbGVQYXRoLCBsaW50ZXIgfSBvZiB0aGlzLmV4ZWN1dGluZykge1xuICAgICAgbGV0IG5hbWVzID0gZmlsZU1hcC5nZXQoZmlsZVBhdGgpXG4gICAgICBpZiAoIW5hbWVzKSB7XG4gICAgICAgIGZpbGVNYXAuc2V0KGZpbGVQYXRoLCBuYW1lcyA9IFtdKVxuICAgICAgfVxuICAgICAgbmFtZXMucHVzaChsaW50ZXIubmFtZSlcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtmaWxlUGF0aCwgbmFtZXNdIG9mIGZpbGVNYXApIHtcbiAgICAgIGNvbnN0IHBhdGggPSBmaWxlUGF0aCA/IGAgb24gJHthdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzFdfWAgOiAnJ1xuICAgICAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGAke25hbWV9JHtwYXRofWBcbiAgICAgICAgY3VycmVudFRpdGxlcy5hZGQodGl0bGUpXG4gICAgICAgIGlmICghdGhpcy5wcm92aWRlclRpdGxlcy5oYXModGl0bGUpKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSB0aXRsZSBzaW5jZSBpdCBoYXNuJ3QgYmVlbiBzZWVuIGJlZm9yZVxuICAgICAgICAgIHRoaXMucHJvdmlkZXJUaXRsZXMuYWRkKHRpdGxlKVxuICAgICAgICAgIHByb3ZpZGVyLmFkZCh0aXRsZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IHRpdGxlcyBubyBsb25nZXIgYWN0aXZlXG4gICAgdGhpcy5wcm92aWRlclRpdGxlcy5mb3JFYWNoKCh0aXRsZSkgPT4ge1xuICAgICAgaWYgKCFjdXJyZW50VGl0bGVzLmhhcyh0aXRsZSkpIHtcbiAgICAgICAgcHJvdmlkZXIucmVtb3ZlKHRpdGxlKVxuICAgICAgICB0aGlzLnByb3ZpZGVyVGl0bGVzLmRlbGV0ZSh0aXRsZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZmlsZU1hcC5jbGVhcigpXG4gIH1cbiAgZ2V0RXhlY3V0aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogP3N0cmluZyk6ID9PYmplY3Qge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5leGVjdXRpbmcpIHtcbiAgICAgIGlmIChlbnRyeS5saW50ZXIgPT09IGxpbnRlciAmJiBlbnRyeS5maWxlUGF0aCA9PT0gZmlsZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgZGlkQmVnaW5MaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogP3N0cmluZykge1xuICAgIGlmICh0aGlzLmdldEV4ZWN1dGluZyhsaW50ZXIsIGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZXhlY3V0aW5nLmFkZCh7IGxpbnRlciwgZmlsZVBhdGggfSlcbiAgICB0aGlzLnVwZGF0ZSgpXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcpIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuZ2V0RXhlY3V0aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICB0aGlzLmV4ZWN1dGluZy5kZWxldGUoZW50cnkpXG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMucHJvdmlkZXIpIHtcbiAgICAgIHRoaXMucHJvdmlkZXIuY2xlYXIoKVxuICAgIH1cbiAgICB0aGlzLnByb3ZpZGVyVGl0bGVzLmNsZWFyKClcbiAgICB0aGlzLmV4ZWN1dGluZy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnVzeVNpZ25hbFxuIl19
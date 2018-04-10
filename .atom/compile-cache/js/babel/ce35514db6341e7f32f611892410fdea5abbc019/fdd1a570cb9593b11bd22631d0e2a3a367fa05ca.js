var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var Element = (function () {
  function Element() {
    var _this = this;

    _classCallCheck(this, Element);

    this.item = document.createElement('div');
    this.itemErrors = document.createElement('span');
    this.itemWarnings = document.createElement('span');
    this.itemInfos = document.createElement('span');

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.item.appendChild(this.itemErrors);
    this.item.appendChild(this.itemWarnings);
    this.item.appendChild(this.itemInfos);
    this.item.classList.add('inline-block');
    this.item.classList.add('linter-status-count');

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.tooltips.add(this.itemErrors, { title: 'Linter Errors' }));
    this.subscriptions.add(atom.tooltips.add(this.itemWarnings, { title: 'Linter Warnings' }));
    this.subscriptions.add(atom.tooltips.add(this.itemInfos, { title: 'Linter Infos' }));

    this.itemErrors.onclick = function () {
      return _this.emitter.emit('click', 'error');
    };
    this.itemWarnings.onclick = function () {
      return _this.emitter.emit('click', 'warning');
    };
    this.itemInfos.onclick = function () {
      return _this.emitter.emit('click', 'info');
    };

    this.update(0, 0, 0);
  }

  _createClass(Element, [{
    key: 'setVisibility',
    value: function setVisibility(prefix, visibility) {
      if (visibility) {
        this.item.classList.remove('hide-' + prefix);
      } else {
        this.item.classList.add('hide-' + prefix);
      }
    }
  }, {
    key: 'update',
    value: function update(countErrors, countWarnings, countInfos) {
      this.itemErrors.textContent = String(countErrors);
      this.itemWarnings.textContent = String(countWarnings);
      this.itemInfos.textContent = String(countInfos);

      if (countErrors) {
        this.itemErrors.classList.remove('highlight');
        this.itemErrors.classList.add('highlight-error');
      } else {
        this.itemErrors.classList.add('highlight');
        this.itemErrors.classList.remove('highlight-error');
      }

      if (countWarnings) {
        this.itemWarnings.classList.remove('highlight');
        this.itemWarnings.classList.add('highlight-warning');
      } else {
        this.itemWarnings.classList.add('highlight');
        this.itemWarnings.classList.remove('highlight-warning');
      }

      if (countInfos) {
        this.itemInfos.classList.remove('highlight');
        this.itemInfos.classList.add('highlight-info');
      } else {
        this.itemInfos.classList.add('highlight');
        this.itemInfos.classList.remove('highlight-info');
      }
    }
  }, {
    key: 'onDidClick',
    value: function onDidClick(callback) {
      return this.emitter.on('click', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Element;
})();

module.exports = Element;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUU2QyxNQUFNOztJQUc3QyxPQUFPO0FBU0EsV0FUUCxPQUFPLEdBU0c7OzswQkFUVixPQUFPOztBQVVULFFBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsUUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2xELFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFL0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN0QyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2QyxRQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FB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VyxDQUFDLENBQUE7QUFDNUMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7T0FDL0MsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN6QyxZQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUNsRDtLQUNGOzs7V0FDUyxvQkFBQyxRQUFrQyxFQUFjO0FBQ3pELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzFDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQTVFRyxPQUFPOzs7QUErRWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUEiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5jbGFzcyBFbGVtZW50IHtcbiAgaXRlbTogSFRNTEVsZW1lbnQ7XG4gIGl0ZW1FcnJvcnM6IEhUTUxFbGVtZW50O1xuICBpdGVtV2FybmluZ3M6IEhUTUxFbGVtZW50O1xuICBpdGVtSW5mb3M6IEhUTUxFbGVtZW50O1xuXG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLml0ZW1FcnJvcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLml0ZW1XYXJuaW5ncyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuaXRlbUluZm9zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5pdGVtLmFwcGVuZENoaWxkKHRoaXMuaXRlbUVycm9ycylcbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtV2FybmluZ3MpXG4gICAgdGhpcy5pdGVtLmFwcGVuZENoaWxkKHRoaXMuaXRlbUluZm9zKVxuICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKCdsaW50ZXItc3RhdHVzLWNvdW50JylcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS50b29sdGlwcy5hZGQodGhpcy5pdGVtRXJyb3JzLCB7IHRpdGxlOiAnTGludGVyIEVycm9ycycgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1XYXJuaW5ncywgeyB0aXRsZTogJ0xpbnRlciBXYXJuaW5ncycgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1JbmZvcywgeyB0aXRsZTogJ0xpbnRlciBJbmZvcycgfSkpXG5cbiAgICB0aGlzLml0ZW1FcnJvcnMub25jbGljayA9ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdjbGljaycsICdlcnJvcicpXG4gICAgdGhpcy5pdGVtV2FybmluZ3Mub25jbGljayA9ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdjbGljaycsICd3YXJuaW5nJylcbiAgICB0aGlzLml0ZW1JbmZvcy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ2luZm8nKVxuXG4gICAgdGhpcy51cGRhdGUoMCwgMCwgMClcbiAgfVxuICBzZXRWaXNpYmlsaXR5KHByZWZpeDogc3RyaW5nLCB2aXNpYmlsaXR5OiBib29sZWFuKSB7XG4gICAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLSR7cHJlZml4fWApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbS5jbGFzc0xpc3QuYWRkKGBoaWRlLSR7cHJlZml4fWApXG4gICAgfVxuICB9XG4gIHVwZGF0ZShjb3VudEVycm9yczogbnVtYmVyLCBjb3VudFdhcm5pbmdzOiBudW1iZXIsIGNvdW50SW5mb3M6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuaXRlbUVycm9ycy50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudEVycm9ycylcbiAgICB0aGlzLml0ZW1XYXJuaW5ncy50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudFdhcm5pbmdzKVxuICAgIHRoaXMuaXRlbUluZm9zLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50SW5mb3MpXG5cbiAgICBpZiAoY291bnRFcnJvcnMpIHtcbiAgICAgIHRoaXMuaXRlbUVycm9ycy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1lcnJvcicpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbUVycm9ycy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodC1lcnJvcicpXG4gICAgfVxuXG4gICAgaWYgKGNvdW50V2FybmluZ3MpIHtcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQtd2FybmluZycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQtd2FybmluZycpXG4gICAgfVxuXG4gICAgaWYgKGNvdW50SW5mb3MpIHtcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQtaW5mbycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQtaW5mbycpXG4gICAgfVxuICB9XG4gIG9uRGlkQ2xpY2soY2FsbGJhY2s6ICgodHlwZTogc3RyaW5nKSA9PiB2b2lkKSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NsaWNrJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50XG4iXX0=
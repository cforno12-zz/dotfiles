Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _elementsList = require('./elements/list');

var _elementsList2 = _interopRequireDefault(_elementsList);

var ListView = (function () {
  function ListView() {
    _classCallCheck(this, ListView);

    this.emitter = new _sbEventKit.Emitter();
    this.element = new _elementsList2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(this.element);
  }

  _createClass(ListView, [{
    key: 'activate',
    value: function activate(editor, suggestions) {
      var _this = this;

      this.element.render(suggestions, function (selected) {
        _this.emitter.emit('did-select', selected);
        _this.dispose();
      });
      this.element.move('move-to-top');

      var bufferPosition = editor.getCursorBufferPosition();
      var marker = editor.markBufferRange([bufferPosition, bufferPosition], { invalidate: 'never' });
      editor.decorateMarker(marker, {
        type: 'overlay',
        item: this.element
      });
      this.subscriptions.add(function () {
        marker.destroy();
      });
    }
  }, {
    key: 'move',
    value: function move(movement) {
      this.element.move(movement);
    }
  }, {
    key: 'select',
    value: function select() {
      this.element.select();
    }
  }, {
    key: 'onDidSelect',
    value: function onDidSelect(callback) {
      return this.emitter.on('did-select', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return ListView;
})();

exports['default'] = ListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvdmlldy1saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRTZDLGNBQWM7OzRCQUluQyxpQkFBaUI7Ozs7SUFHcEIsUUFBUTtBQUtoQixXQUxRLFFBQVEsR0FLYjswQkFMSyxRQUFROztBQU16QixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRywrQkFBaUIsQ0FBQTtBQUNoQyxRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVprQixRQUFROztXQWFuQixrQkFBQyxNQUFrQixFQUFFLFdBQTRCLEVBQUU7OztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBQyxRQUFRLEVBQUs7QUFDN0MsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN6QyxjQUFLLE9BQU8sRUFBRSxDQUFBO09BQ2YsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7O0FBRWhDLFVBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO0FBQ3ZELFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUNoRyxZQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUM1QixZQUFJLEVBQUUsU0FBUztBQUNmLFlBQUksRUFBRSxJQUFJLENBQUMsT0FBTztPQUNuQixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ2hDLGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNqQixDQUFDLENBQUE7S0FDSDs7O1dBQ0csY0FBQyxRQUFzQixFQUFFO0FBQzNCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQzVCOzs7V0FDSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7S0FDdEI7OztXQUNVLHFCQUFDLFFBQWtCLEVBQWM7QUFDMUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBekNrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3ZpZXctbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgTGlzdEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cy9saXN0J1xuaW1wb3J0IHR5cGUgeyBMaXN0SXRlbSwgTGlzdE1vdmVtZW50IH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlzdFZpZXcge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBlbGVtZW50OiBMaXN0RWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5lbGVtZW50ID0gbmV3IExpc3RFbGVtZW50KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWxlbWVudClcbiAgfVxuICBhY3RpdmF0ZShlZGl0b3I6IFRleHRFZGl0b3IsIHN1Z2dlc3Rpb25zOiBBcnJheTxMaXN0SXRlbT4pIHtcbiAgICB0aGlzLmVsZW1lbnQucmVuZGVyKHN1Z2dlc3Rpb25zLCAoc2VsZWN0ZWQpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtc2VsZWN0Jywgc2VsZWN0ZWQpXG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pXG4gICAgdGhpcy5lbGVtZW50Lm1vdmUoJ21vdmUtdG8tdG9wJylcblxuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKFtidWZmZXJQb3NpdGlvbiwgYnVmZmVyUG9zaXRpb25dLCB7IGludmFsaWRhdGU6ICduZXZlcicgfSlcbiAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICBpdGVtOiB0aGlzLmVsZW1lbnQsXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIH0pXG4gIH1cbiAgbW92ZShtb3ZlbWVudDogTGlzdE1vdmVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50Lm1vdmUobW92ZW1lbnQpXG4gIH1cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMuZWxlbWVudC5zZWxlY3QoKVxuICB9XG4gIG9uRGlkU2VsZWN0KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zZWxlY3QnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19
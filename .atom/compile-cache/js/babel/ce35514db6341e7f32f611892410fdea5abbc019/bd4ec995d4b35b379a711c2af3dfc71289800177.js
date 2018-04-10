"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var $ = _require.$;
var TextEditorView = _require.TextEditorView;
var View = _require.View;

var _require2 = require('atom');

var Disposable = _require2.Disposable;
var CompositeDisposable = _require2.CompositeDisposable;

var PdfGoToPageView = (function (_View) {
  _inherits(PdfGoToPageView, _View);

  _createClass(PdfGoToPageView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({ 'class': 'go-to-page' }, function () {
        _this.subview('miniEditor', new TextEditorView({ mini: true }));
        _this.div({ 'class': 'message', outlet: 'message' });
      });
    }
  }]);

  function PdfGoToPageView() {
    var _this2 = this;

    _classCallCheck(this, PdfGoToPageView);

    _get(Object.getPrototypeOf(PdfGoToPageView.prototype), 'constructor', this).call(this);

    this.detaching = false;

    atom.commands.add('atom-workspace', {
      'pdf-view:go-to-page': function pdfViewGoToPage() {
        _this2.toggle();
        return false;
      }
    });

    this.miniEditor.on('blur', function () {
      return _this2.close();
    });

    atom.commands.add(this.element, {
      'core:confirm': function coreConfirm() {
        return _this2.confirm();
      },
      'core:cancel': function coreCancel() {
        return _this2.close();
      }
    });

    this.miniEditor.preempt('textInput', function (e) {
      if (!e.originalEvent.data.match(/[0-9]/)) {
        return false;
      }
    });
  }

  _createClass(PdfGoToPageView, [{
    key: 'toggle',
    value: function toggle() {
      if (this.panel != null && this.panel.isVisible()) {
        return this.close();
      } else {
        return this.attach();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.miniEditor.setText('');
      if (this.panel != null) {
        this.panel.hide();
      }
      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var pageNumber = this.miniEditor.getText();
      pageNumber = parseInt(pageNumber, 10);
      var pdfView = atom.workspace.getActivePaneItem();

      this.close();

      if (pdfView != null && pdfView.pdfDocument != null && pdfView.scrollToPage != null) {
        pdfView.scrollToPage(pageNumber);
      }
    }
  }, {
    key: 'attach',
    value: function attach() {
      var pdfView = atom.workspace.getActivePaneItem();

      if (pdfView != null && pdfView.pdfDocument != null && pdfView.scrollToPage != null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.message.text('Enter a page number 1-' + pdfView.getTotalPageNumber());
        this.miniEditor.focus();
      }
    }
  }]);

  return PdfGoToPageView;
})(View);

exports['default'] = PdfGoToPageView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1nb3RvLXBhZ2Utdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O2VBRW9CLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7SUFBMUQsQ0FBQyxZQUFELENBQUM7SUFBRSxjQUFjLFlBQWQsY0FBYztJQUFFLElBQUksWUFBSixJQUFJOztnQkFDWSxPQUFPLENBQUMsTUFBTSxDQUFDOztJQUFsRCxVQUFVLGFBQVYsVUFBVTtJQUFFLG1CQUFtQixhQUFuQixtQkFBbUI7O0lBRWYsZUFBZTtZQUFmLGVBQWU7O2VBQWYsZUFBZTs7V0FDcEIsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLFNBQU8sWUFBWSxFQUFDLEVBQUUsWUFBTTtBQUMzQyxjQUFLLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELGNBQUssR0FBRyxDQUFDLEVBQUMsU0FBTyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7T0FDakQsQ0FBQyxDQUFBO0tBQ0g7OztBQUVVLFdBUlEsZUFBZSxHQVFwQjs7OzBCQVJLLGVBQWU7O0FBU2hDLCtCQVRpQixlQUFlLDZDQVN4Qjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQ2hDO0FBQ0UsMkJBQXFCLEVBQUUsMkJBQU07QUFDM0IsZUFBSyxNQUFNLEVBQUUsQ0FBQztBQUNkLGVBQU8sS0FBSyxDQUFDO09BQ2Q7S0FDRixDQUNGLENBQUM7O0FBRUYsUUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO2FBQU0sT0FBSyxLQUFLLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRS9DLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQzVCO0FBQ0Usb0JBQWMsRUFBRTtlQUFNLE9BQUssT0FBTyxFQUFFO09BQUE7QUFDcEMsbUJBQWEsRUFBRTtlQUFNLE9BQUssS0FBSyxFQUFFO09BQUE7S0FDbEMsQ0FDRixDQUFDOztBQUVGLFFBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsRUFBSztBQUMxQyxVQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3hDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFwQ2tCLGVBQWU7O1dBc0M1QixrQkFBRztBQUNQLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNoRCxlQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNyQixNQUFNO0FBQ0wsZUFBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDdEI7S0FDRjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDbkI7QUFDRCxVQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNDOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0MsZ0JBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFVBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLElBQUksRUFBRTtBQUNsRixlQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUVqRCxVQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7QUFDbEYsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSw0QkFBMEIsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUcsQ0FBQztBQUMzRSxZQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ3pCO0tBQ0Y7OztTQTFFa0IsZUFBZTtHQUFTLElBQUk7O3FCQUE1QixlQUFlIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1nb3RvLXBhZ2Utdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCB7JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKTtcbmxldCB7RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBkZkdvVG9QYWdlVmlldyBleHRlbmRzIFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYoe2NsYXNzOiAnZ28tdG8tcGFnZSd9LCAoKSA9PiB7XG4gICAgICB0aGlzLnN1YnZpZXcoJ21pbmlFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcoe21pbmk6IHRydWV9KSk7XG4gICAgICB0aGlzLmRpdih7Y2xhc3M6ICdtZXNzYWdlJywgb3V0bGV0OiAnbWVzc2FnZSd9KTtcbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuZGV0YWNoaW5nID0gZmFsc2U7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAge1xuICAgICAgICAncGRmLXZpZXc6Z28tdG8tcGFnZSc6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLm1pbmlFZGl0b3Iub24oJ2JsdXInLCAoKSA9PiB0aGlzLmNsb3NlKCkpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LFxuICAgICAge1xuICAgICAgICAnY29yZTpjb25maXJtJzogKCkgPT4gdGhpcy5jb25maXJtKCksXG4gICAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuY2xvc2UoKVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLm1pbmlFZGl0b3IucHJlZW1wdCgndGV4dElucHV0JywgKGUpID0+IHtcbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LmRhdGEubWF0Y2goL1swLTldLykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICE9IG51bGwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5taW5pRWRpdG9yLnNldFRleHQoJycpO1xuICAgIGlmICh0aGlzLnBhbmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICAgIH1cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGNvbmZpcm0oKSB7XG4gICAgbGV0IHBhZ2VOdW1iZXIgPSB0aGlzLm1pbmlFZGl0b3IuZ2V0VGV4dCgpO1xuICAgIHBhZ2VOdW1iZXIgPSBwYXJzZUludChwYWdlTnVtYmVyLCAxMCk7XG4gICAgbGV0IHBkZlZpZXcgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgaWYgKHBkZlZpZXcgIT0gbnVsbCAmJiBwZGZWaWV3LnBkZkRvY3VtZW50ICE9IG51bGwgJiYgcGRmVmlldy5zY3JvbGxUb1BhZ2UgIT0gbnVsbCkge1xuICAgICAgcGRmVmlldy5zY3JvbGxUb1BhZ2UocGFnZU51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIGxldCBwZGZWaWV3ID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcblxuICAgIGlmIChwZGZWaWV3ICE9IG51bGwgJiYgcGRmVmlldy5wZGZEb2N1bWVudCAhPSBudWxsICYmIHBkZlZpZXcuc2Nyb2xsVG9QYWdlICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiB0aGlzfSk7XG4gICAgICB0aGlzLm1lc3NhZ2UudGV4dChgRW50ZXIgYSBwYWdlIG51bWJlciAxLSR7cGRmVmlldy5nZXRUb3RhbFBhZ2VOdW1iZXIoKX1gKTtcbiAgICAgIHRoaXMubWluaUVkaXRvci5mb2N1cygpO1xuICAgIH1cbiAgfVxufVxuIl19
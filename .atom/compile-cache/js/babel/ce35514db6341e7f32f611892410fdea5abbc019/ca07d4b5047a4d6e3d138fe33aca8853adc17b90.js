"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var View = _require.View;

var _require2 = require('atom');

var Disposable = _require2.Disposable;
var CompositeDisposable = _require2.CompositeDisposable;

var PdfStatusBarView = (function (_View) {
  _inherits(PdfStatusBarView, _View);

  _createClass(PdfStatusBarView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'status-image inline-block' }, function () {
        _this.a({ href: '#', 'class': 'pdf-status inline-block', outlet: 'pdfStatus' });
      });
    }
  }]);

  function PdfStatusBarView() {
    var _this2 = this;

    _classCallCheck(this, PdfStatusBarView);

    _get(Object.getPrototypeOf(PdfStatusBarView.prototype), 'constructor', this).call(this);

    this.attach();

    var disposables = new CompositeDisposable();

    var updatePageCallback = function updatePageCallback() {
      return _this2.updatePdfStatus();
    };

    disposables.add(atom.workspace.onDidChangeActivePaneItem(updatePageCallback));

    atom.views.getView(atom.workspace).addEventListener('pdf-view:current-page-update', updatePageCallback);

    disposables.add(new Disposable(function () {
      return window.removeEventListener('pdf-view:current-page-update', updatePageCallback);
    }));

    var clickCallback = function clickCallback() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'pdf-view:go-to-page');
      return false;
    };

    var elem = this;

    elem.on('click', clickCallback);
    disposables.add(new Disposable(function () {
      return elem.off('click', clickCallback);
    }));
  }

  _createClass(PdfStatusBarView, [{
    key: 'attach',
    value: function attach() {
      var statusBar = document.querySelector("status-bar");

      if (statusBar != null) {
        this.statusBarTile = statusBar.addLeftTile({ item: this, priority: 100 });
      }
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.updatePdfStatus();
    }
  }, {
    key: 'getPdfStatus',
    value: function getPdfStatus(view) {
      this.pdfStatus.text('Page: ' + view.currentPageNumber + '/' + view.totalPageNumber).show();
    }
  }, {
    key: 'updatePdfStatus',
    value: function updatePdfStatus() {
      var pdfView = atom.workspace.getActivePaneItem();

      if (pdfView != null && pdfView.pdfDocument != null) {
        this.getPdfStatus(pdfView);
      } else {
        this.pdfStatus.hide();
      }
    }
  }]);

  return PdfStatusBarView;
})(View);

exports['default'] = PdfStatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1zdGF0dXMtYmFyLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztlQUVDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7SUFBdkMsSUFBSSxZQUFKLElBQUk7O2dCQUMrQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUFsRCxVQUFVLGFBQVYsVUFBVTtJQUFFLG1CQUFtQixhQUFuQixtQkFBbUI7O0lBRWYsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCOztXQUNyQixtQkFBRzs7O0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLFNBQU8sMkJBQTJCLEVBQUMsRUFBRSxZQUFNO0FBQ25ELGNBQUssQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFPLHlCQUF5QixFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO09BQzVFLENBQUMsQ0FBQztLQUNKOzs7QUFFVSxXQVBRLGdCQUFnQixHQU9yQjs7OzBCQVBLLGdCQUFnQjs7QUFRakMsK0JBUmlCLGdCQUFnQiw2Q0FRekI7O0FBRVIsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVkLFFBQUksV0FBVyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQzs7QUFFNUMsUUFBSSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsR0FBUztBQUM3QixhQUFPLE9BQUssZUFBZSxFQUFFLENBQUM7S0FDL0IsQ0FBQzs7QUFFRixlQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDOztBQUU5RSxRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7QUFFeEcsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQzthQUFNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyw4QkFBOEIsRUFBRSxrQkFBa0IsQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFDOztBQUV0SCxRQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLEdBQVM7QUFDeEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDbEYsYUFBTyxLQUFLLENBQUM7S0FDZCxDQUFDOztBQUVGLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQzthQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFDO0dBQ3pFOztlQWpDa0IsZ0JBQWdCOztXQW1DN0Isa0JBQUc7QUFDUCxVQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVyRCxVQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDckIsWUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztPQUN6RTtLQUNGOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN4Qjs7O1dBRVcsc0JBQUMsSUFBSSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxZQUFVLElBQUksQ0FBQyxpQkFBaUIsU0FBSSxJQUFJLENBQUMsZUFBZSxDQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdkY7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFakQsVUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ2xELFlBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDNUIsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdkI7S0FDRjs7O1NBM0RrQixnQkFBZ0I7R0FBUyxJQUFJOztxQkFBN0IsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1zdGF0dXMtYmFyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQge1ZpZXd9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKTtcbmxldCB7RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBkZlN0YXR1c0JhclZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoe2NsYXNzOiAnc3RhdHVzLWltYWdlIGlubGluZS1ibG9jayd9LCAoKSA9PiB7XG4gICAgICB0aGlzLmEoe2hyZWY6ICcjJywgY2xhc3M6ICdwZGYtc3RhdHVzIGlubGluZS1ibG9jaycsIG91dGxldDogJ3BkZlN0YXR1cyd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgbGV0IGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIGxldCB1cGRhdGVQYWdlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVQZGZTdGF0dXMoKTtcbiAgICB9O1xuXG4gICAgZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0odXBkYXRlUGFnZUNhbGxiYWNrKSk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFkZEV2ZW50TGlzdGVuZXIoJ3BkZi12aWV3OmN1cnJlbnQtcGFnZS11cGRhdGUnLCB1cGRhdGVQYWdlQ2FsbGJhY2spO1xuXG4gICAgZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwZGYtdmlldzpjdXJyZW50LXBhZ2UtdXBkYXRlJywgdXBkYXRlUGFnZUNhbGxiYWNrKSkpO1xuXG4gICAgbGV0IGNsaWNrQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdwZGYtdmlldzpnby10by1wYWdlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGxldCBlbGVtID0gdGhpcztcblxuICAgIGVsZW0ub24oJ2NsaWNrJywgY2xpY2tDYWxsYmFjayk7XG4gICAgZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IGVsZW0ub2ZmKCdjbGljaycsIGNsaWNrQ2FsbGJhY2spKSk7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgbGV0IHN0YXR1c0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzdGF0dXMtYmFyXCIpO1xuXG4gICAgaWYgKHN0YXR1c0JhciAhPSBudWxsKSB7XG4gICAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoe2l0ZW06IHRoaXMsIHByaW9yaXR5OiAxMDB9KTtcbiAgICB9XG4gIH1cblxuICBhdHRhY2hlZCgpIHtcbiAgICB0aGlzLnVwZGF0ZVBkZlN0YXR1cygpO1xuICB9XG5cbiAgZ2V0UGRmU3RhdHVzKHZpZXcpIHtcbiAgICB0aGlzLnBkZlN0YXR1cy50ZXh0KGBQYWdlOiAke3ZpZXcuY3VycmVudFBhZ2VOdW1iZXJ9LyR7dmlldy50b3RhbFBhZ2VOdW1iZXJ9YCkuc2hvdygpO1xuICB9XG5cbiAgdXBkYXRlUGRmU3RhdHVzKCkge1xuICAgIGxldCBwZGZWaWV3ID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcblxuICAgIGlmIChwZGZWaWV3ICE9IG51bGwgJiYgcGRmVmlldy5wZGZEb2N1bWVudCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmdldFBkZlN0YXR1cyhwZGZWaWV3KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wZGZTdGF0dXMuaGlkZSgpO1xuICAgIH1cbiAgfVxufVxuIl19
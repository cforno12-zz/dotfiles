"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var $ = _require.$;
var ScrollView = _require.ScrollView;

var _require2 = require('atom');

var Point = _require2.Point;

var fs = require('fs-plus');
var path = require('path');
var _ = require('underscore-plus');

var _require3 = require('atom');

var File = _require3.File;
var Disposable = _require3.Disposable;
var CompositeDisposable = _require3.CompositeDisposable;

var _require4 = require('loophole');

var Function = _require4.Function;

global.Function = Function;

global.PDFJS = { workerSrc: "temp", cMapUrl: "temp", cMapPacked: true };
require('./../node_modules/pdfjs-dist/build/pdf.js');
PDFJS.workerSrc = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.js");
PDFJS.cMapUrl = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/cmaps") + "/";

var _require5 = require('child_process');

var exec = _require5.exec;
var execFile = _require5.execFile;

var PdfEditorView = (function (_ScrollView) {
  _inherits(PdfEditorView, _ScrollView);

  _createClass(PdfEditorView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'pdf-view', tabindex: -1 }, function () {
        _this.div({ outlet: 'container', style: 'position: relative' });
      });
    }
  }]);

  function PdfEditorView(filePath) {
    var scale = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var _this2 = this;

    var scrollTop = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var scrollLeft = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    _classCallCheck(this, PdfEditorView);

    _get(Object.getPrototypeOf(PdfEditorView.prototype), 'constructor', this).call(this);

    this.currentScale = scale ? scale : 1.5;
    this.defaultScale = 1.5;
    this.scaleFactor = 10.0;
    this.fitToWidthOnOpen = !scale && atom.config.get('pdf-view.fitToWidthOnOpen');

    this.filePath = filePath;
    this.file = new File(this.filePath);
    this.scrollTopBeforeUpdate = scrollTop;
    this.scrollLeftBeforeUpdate = scrollLeft;
    this.canvases = [];
    this.updating = false;

    this.updatePdf(true);

    this.currentPageNumber = 0;
    this.totalPageNumber = 0;
    this.centersBetweenPages = [];
    this.pageHeights = [];
    this.maxPageWidth = 0;
    this.toScaleFactor = 1.0;

    var disposables = new CompositeDisposable();

    var needsUpdateCallback = _.debounce(function () {
      if (_this2.updating) {
        _this2.needsUpdate = true;
      } else {
        _this2.updatePdf();
      }
    }, 100);

    disposables.add(atom.config.onDidChange('pdf-view.reverseSyncBehaviour', needsUpdateCallback));

    var autoReloadDisposable = undefined;
    var setupAutoReload = function setupAutoReload() {
      if (atom.config.get('pdf-view.autoReloadOnUpdate')) {
        autoReloadDisposable = _this2.file.onDidChange(needsUpdateCallback);
        disposables.add(autoReloadDisposable);
      } else if (autoReloadDisposable) {
        disposables.remove(autoReloadDisposable);
        autoReloadDisposable.dispose();
      }
    };
    disposables.add(atom.config.observe('pdf-view.autoReloadOnUpdate', setupAutoReload));

    var moveLeftCallback = function moveLeftCallback() {
      return _this2.scrollLeft(_this2.scrollLeft() - $(window).width() / 20);
    };
    var moveRightCallback = function moveRightCallback() {
      return _this2.scrollRight(_this2.scrollRight() + $(window).width() / 20);
    };
    var scrollCallback = function scrollCallback() {
      return _this2.onScroll();
    };
    var resizeHandler = function resizeHandler() {
      return _this2.setCurrentPageNumber();
    };

    var elem = this;

    atom.commands.add('.pdf-view', {
      'core:move-left': moveLeftCallback,
      'core:move-right': moveRightCallback
    });

    elem.on('scroll', scrollCallback);
    disposables.add(new Disposable(function () {
      return $(window).off('scroll', scrollCallback);
    }));

    $(window).on('resize', resizeHandler);
    disposables.add(new Disposable(function () {
      return $(window).off('resize', resizeHandler);
    }));

    atom.commands.add('atom-workspace', {
      'pdf-view:zoom-in': function pdfViewZoomIn() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.zoomIn();
        }
      },
      'pdf-view:zoom-out': function pdfViewZoomOut() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.zoomOut();
        }
      },
      'pdf-view:reset-zoom': function pdfViewResetZoom() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.resetZoom();
        }
      },
      'pdf-view:go-to-next-page': function pdfViewGoToNextPage() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.goToNextPage();
        }
      },
      'pdf-view:go-to-previous-page': function pdfViewGoToPreviousPage() {
        if (atom.workspace.getActivePaneItem() === _this2) {
          _this2.goToPreviousPage();
        }
      },
      'pdf-view:reload': function pdfViewReload() {
        _this2.updatePdf(true);
      }
    });

    this.dragging = null;

    this.onMouseMove = function (e) {
      if (_this2.dragging) {
        _this2.simpleClick = false;

        _this2.scrollTop(_this2.dragging.scrollTop - (e.screenY - _this2.dragging.y));
        _this2.scrollLeft(_this2.dragging.scrollLeft - (e.screenX - _this2.dragging.x));
        e.preventDefault();
      }
    };

    this.onMouseUp = function (e) {
      _this2.dragging = null;
      $(document).unbind('mousemove', _this2.onMouseMove);
      $(document).unbind('mouseup', _this2.onMouseUp);
      e.preventDefault();
    };

    this.on('mousedown', function (e) {
      _this2.simpleClick = true;
      atom.workspace.paneForItem(_this2).activate();
      _this2.dragging = { x: e.screenX, y: e.screenY, scrollTop: _this2.scrollTop(), scrollLeft: _this2.scrollLeft() };
      $(document).on('mousemove', _this2.onMouseMove);
      $(document).on('mouseup', _this2.onMouseUp);
      e.preventDefault();
    });

    this.on('mousewheel', function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.originalEvent.wheelDelta > 0) {
          _this2.zoomIn();
        } else if (e.originalEvent.wheelDelta < 0) {
          _this2.zoomOut();
        }
      }
    });
  }

  _createClass(PdfEditorView, [{
    key: 'reverseSync',
    value: function reverseSync(page, e) {
      var _this3 = this;

      if (this.simpleClick) {
        e.preventDefault();
        this.pdfDocument.getPage(page).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this3.currentScale);
          var x = undefined,
              y = undefined;

          var _viewport$convertToPdfPoint = viewport.convertToPdfPoint(e.offsetX, $(_this3.canvases[page - 1]).height() - e.offsetY);

          var _viewport$convertToPdfPoint2 = _slicedToArray(_viewport$convertToPdfPoint, 2);

          x = _viewport$convertToPdfPoint2[0];
          y = _viewport$convertToPdfPoint2[1];

          var callback = function callback(error, stdout, stderr) {
            if (!error) {
              stdout = stdout.replace(/\r\n/g, '\n');
              var attrs = {};
              for (var _line of stdout.split('\n')) {
                var m = _line.match(/^([a-zA-Z]*):(.*)$/);
                if (m) {
                  attrs[m[1]] = m[2];
                }
              }

              var file = attrs.Input;
              var line = attrs.Line;

              if (file && line) {
                var editor = null;
                var pathToOpen = path.normalize(attrs.Input);
                var lineToOpen = +attrs.Line;
                var done = false;
                for (var _editor of atom.workspace.getTextEditors()) {
                  if (_editor.getPath() === pathToOpen) {
                    var position = new Point(lineToOpen - 1, -1);
                    _editor.scrollToBufferPosition(position, { center: true });
                    _editor.setCursorBufferPosition(position);
                    _editor.moveToFirstCharacterOfLine();
                    var pane = atom.workspace.paneForItem(_editor);
                    pane.activateItem(_editor);
                    pane.activate();
                    done = true;
                    break;
                  }
                }

                if (!done) {
                  var paneopt = atom.config.get('pdf-view.paneToUseInSynctex');
                  atom.workspace.open(pathToOpen, { initialLine: lineToOpen, initialColumn: 0, split: paneopt });
                }
              }
            }
          };

          var synctexPath = atom.config.get('pdf-view.syncTeXPath');
          var clickspec = [page, x, y, _this3.filePath].join(':');

          if (synctexPath) {
            execFile(synctexPath, ["edit", "-o", clickspec], callback);
          } else {
            var cmd = 'synctex edit -o "' + clickspec + '"';
            exec(cmd, callback);
          }
        });
      }
    }
  }, {
    key: 'forwardSync',
    value: function forwardSync(texPath, lineNumber) {
      var _this4 = this;

      if (this.updating) {
        this.forwardSyncAfterUpdate = {
          texPath: texPath,
          lineNumber: lineNumber
        };
        return;
      }

      var callback = function callback(error, stdout, stderr) {
        if (!error) {
          var _ret = (function () {
            stdout = stdout.replace(/\r\n/g, '\n');
            var attrs = {};
            for (var line of stdout.split('\n')) {
              var m = line.match(/^([a-zA-Z]*):(.*)$/);
              if (m) {
                if (m[1] in attrs) {
                  break;
                }

                attrs[m[1]] = m[2];
              }
            }

            var page = parseInt(attrs.Page);

            if (page > _this4.pdfDocument.numPages) {
              return {
                v: undefined
              };
            }

            _this4.pdfDocument.getPage(page).then(function (pdfPage) {
              var viewport = pdfPage.getViewport(_this4.currentScale);
              var canvas = _this4.canvases[page - 1];

              var x = parseFloat(attrs.x);
              var y = parseFloat(attrs.y);

              var _viewport$convertToViewportPoint = viewport.convertToViewportPoint(x, y);

              var _viewport$convertToViewportPoint2 = _slicedToArray(_viewport$convertToViewportPoint, 2);

              x = _viewport$convertToViewportPoint2[0];
              y = _viewport$convertToViewportPoint2[1];

              x = x + canvas.offsetLeft;
              y = viewport.height - y + canvas.offsetTop;

              var visibilityThreshold = 50;

              // Scroll
              if (y < _this4.scrollTop() + visibilityThreshold) {
                _this4.scrollTop(y - visibilityThreshold);
              } else if (y > _this4.scrollBottom() - visibilityThreshold) {
                _this4.scrollBottom(y + visibilityThreshold);
              }

              if (x < _this4.scrollLeft() + visibilityThreshold) {
                _this4.scrollLeft(x - visibilityThreshold);
              } else if (x > _this4.scrollRight() - visibilityThreshold) {
                _this4.scrollBottom(x + visibilityThreshold);
              }

              // Show highlighter
              $('<div/>', {
                'class': "tex-highlight",
                style: 'top: ' + y + 'px; left: ' + x + 'px;'
              }).appendTo(_this4.container).on('animationend', function () {
                $(this).remove();
              });
            });
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
      };

      var synctexPath = atom.config.get('pdf-view.syncTeXPath');
      var inputspec = [lineNumber, 0, texPath].join(':');

      if (synctexPath) {
        execFile(synctexPath, ["view", "-i", inputspec, "-o", this.filePath], callback);
      } else {
        var cmd = 'synctex view -i "' + inputspec + '" -o "' + this.filePath + '"';
        exec(cmd, callback);
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (!this.updating) {
        this.scrollTopBeforeUpdate = this.scrollTop();
        this.scrollLeftBeforeUpdate = this.scrollLeft();
      }

      this.setCurrentPageNumber();
    }
  }, {
    key: 'setCurrentPageNumber',
    value: function setCurrentPageNumber() {
      if (!this.pdfDocument) {
        return;
      }

      var center = (this.scrollBottom() + this.scrollTop()) / 2.0;
      this.currentPageNumber = 1;

      if (this.centersBetweenPages.length === 0 && this.pageHeights.length === this.pdfDocument.numPages) for (var pdfPageNumber of _.range(1, this.pdfDocument.numPages + 1)) {
        this.centersBetweenPages.push(this.pageHeights.slice(0, pdfPageNumber).reduce(function (x, y) {
          return x + y;
        }, 0) + pdfPageNumber * 20 - 10);
      }

      for (var pdfPageNumber of _.range(2, this.pdfDocument.numPages + 1)) {
        if (center >= this.centersBetweenPages[pdfPageNumber - 2] && center < this.centersBetweenPages[pdfPageNumber - 1]) {
          this.currentPageNumber = pdfPageNumber;
        }
      }

      atom.views.getView(atom.workspace).dispatchEvent(new Event('pdf-view:current-page-update'));
    }
  }, {
    key: 'finishUpdate',
    value: function finishUpdate() {
      this.updating = false;
      if (this.needsUpdate) {
        this.updatePdf();
      }
      if (this.toScaleFactor != 1) {
        this.adjustSize(1);
      }
      if (this.scrollToPageAfterUpdate) {
        this.scrollToPage(this.scrollToPageAfterUpdate);
        delete this.scrollToPageAfterUpdate;
      }
      if (this.forwardSyncAfterUpdate) {
        this.forwardSync(this.forwardSyncAfterUpdate.texPath, this.forwardSyncAfterUpdate.lineNumber);
        delete this.forwardSyncAfterUpdate;
      }
    }
  }, {
    key: 'updatePdf',
    value: function updatePdf() {
      var _this5 = this;

      var closeOnError = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.needsUpdate = false;

      if (!fs.existsSync(this.filePath)) {
        return;
      }

      var pdfData = null;

      try {
        pdfData = new Uint8Array(fs.readFileSync(this.filePath));
      } catch (error) {
        if (error.code === 'ENOENT') {
          return;
        }
      }

      this.updating = true;

      var reverseSyncClicktype = null;
      switch (atom.config.get('pdf-view.reverseSyncBehaviour')) {
        case 'Click':
          reverseSyncClicktype = 'click';
          break;
        case 'Double click':
          reverseSyncClicktype = 'dblclick';
          break;
      }

      PDFJS.getDocument(pdfData).then(function (pdfDocument) {
        _this5.container.find("canvas").remove();
        _this5.canvases = [];
        _this5.pageHeights = [];

        _this5.pdfDocument = pdfDocument;
        _this5.totalPageNumber = _this5.pdfDocument.numPages;

        var _loop = function (pdfPageNumber) {
          var canvas = $("<canvas/>", { 'class': "page-container" }).appendTo(_this5.container)[0];
          _this5.canvases.push(canvas);
          _this5.pageHeights.push(0);
          if (reverseSyncClicktype) {
            $(canvas).on(reverseSyncClicktype, function (e) {
              return _this5.reverseSync(pdfPageNumber, e);
            });
          }
        };

        for (var pdfPageNumber of _.range(1, _this5.pdfDocument.numPages + 1)) {
          _loop(pdfPageNumber);
        }

        if (_this5.fitToWidthOnOpen) {
          Promise.all(_.range(1, _this5.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
            return _this5.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
              return pdfPage.getViewport(1.0).width;
            });
          })).then(function (pdfPageWidths) {
            _this5.maxPageWidth = Math.max.apply(Math, _toConsumableArray(pdfPageWidths));
            _this5.renderPdf();
          });
        } else {
          _this5.renderPdf();
        }
      }, function () {
        if (closeOnError) {
          atom.notifications.addError(_this5.filePath + " is not a PDF file.");
          atom.workspace.paneForItem(_this5).destroyItem(_this5);
        } else {
          _this5.finishUpdate();
        }
      });
    }
  }, {
    key: 'renderPdf',
    value: function renderPdf() {
      var _this6 = this;

      var scrollAfterRender = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.centersBetweenPages = [];

      if (this.fitToWidthOnOpen) {
        this.currentScale = this[0].clientWidth / this.maxPageWidth;
        this.fitToWidthOnOpen = false;
      }

      Promise.all(_.range(1, this.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
        var canvas = _this6.canvases[pdfPageNumber - 1];

        return _this6.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this6.currentScale);
          var context = canvas.getContext('2d');

          var outputScale = window.devicePixelRatio;
          canvas.height = Math.floor(viewport.height) * outputScale;
          canvas.width = Math.floor(viewport.width) * outputScale;

          context._scaleX = outputScale;
          context._scaleY = outputScale;
          context.scale(outputScale, outputScale);
          context._transformMatrix = [outputScale, 0, 0, outputScale, 0, 0];
          canvas.style.width = Math.floor(viewport.width) + 'px';
          canvas.style.height = Math.floor(viewport.height) + 'px';

          _this6.pageHeights[pdfPageNumber - 1] = Math.floor(viewport.height);

          return pdfPage.render({ canvasContext: context, viewport: viewport });
        });
      })).then(function (renderTasks) {
        if (scrollAfterRender) {
          _this6.scrollTop(_this6.scrollTopBeforeUpdate);
          _this6.scrollLeft(_this6.scrollLeftBeforeUpdate);
          _this6.setCurrentPageNumber();
        }
        Promise.all(renderTasks).then(function () {
          return _this6.finishUpdate();
        });
      }, function () {
        return _this6.finishUpdate();
      });
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut() {
      return this.adjustSize(100 / (100 + this.scaleFactor));
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn() {
      return this.adjustSize((100 + this.scaleFactor) / 100);
    }
  }, {
    key: 'resetZoom',
    value: function resetZoom() {
      return this.adjustSize(this.defaultScale / this.currentScale);
    }
  }, {
    key: 'goToNextPage',
    value: function goToNextPage() {
      return this.scrollToPage(this.currentPageNumber + 1);
    }
  }, {
    key: 'goToPreviousPage',
    value: function goToPreviousPage() {
      return this.scrollToPage(this.currentPageNumber - 1);
    }
  }, {
    key: 'computeZoomedScrollTop',
    value: function computeZoomedScrollTop(oldScrollTop, oldPageHeights) {
      var pixelsToZoom = 0;
      var spacesToSkip = 0;
      var zoomedPixels = 0;

      for (var pdfPageNumber of _.range(0, this.pdfDocument.numPages)) {
        if (pixelsToZoom + spacesToSkip + oldPageHeights[pdfPageNumber] > oldScrollTop) {
          zoomFactorForPage = this.pageHeights[pdfPageNumber] / oldPageHeights[pdfPageNumber];
          var partOfPageAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          zoomedPixels += Math.round(partOfPageAboveUpperBorder * zoomFactorForPage);
          pixelsToZoom += partOfPageAboveUpperBorder;
          break;
        } else {
          pixelsToZoom += oldPageHeights[pdfPageNumber];
          zoomedPixels += this.pageHeights[pdfPageNumber];
        }

        if (pixelsToZoom + spacesToSkip + 20 > oldScrollTop) {
          var partOfPaddingAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          spacesToSkip += partOfPaddingAboveUpperBorder;
          break;
        } else {
          spacesToSkip += 20;
        }
      }

      return zoomedPixels + spacesToSkip;
    }
  }, {
    key: 'adjustSize',
    value: function adjustSize(factor) {
      var _this7 = this;

      if (!this.pdfDocument) {
        return;
      }

      factor = this.toScaleFactor * factor;

      if (this.updating) {
        this.toScaleFactor = factor;
        return;
      }

      this.updating = true;
      this.toScaleFactor = 1;

      var oldScrollTop = this.scrollTop();
      var oldPageHeights = this.pageHeights.slice(0);
      this.currentScale = this.currentScale * factor;
      this.renderPdf(false);

      process.nextTick(function () {
        var newScrollTop = _this7.computeZoomedScrollTop(oldScrollTop, oldPageHeights);
        _this7.scrollTop(newScrollTop);
      });

      process.nextTick(function () {
        var newScrollLeft = _this7.scrollLeft() * factor;
        _this7.scrollLeft(newScrollLeft);
      });
    }
  }, {
    key: 'getCurrentPageNumber',
    value: function getCurrentPageNumber() {
      return this.currentPageNumber;
    }
  }, {
    key: 'getTotalPageNumber',
    value: function getTotalPageNumber() {
      return this.totalPageNumber;
    }
  }, {
    key: 'scrollToPage',
    value: function scrollToPage(pdfPageNumber) {
      if (this.updating) {
        this.scrollToPageAfterUpdate = pdfPageNumber;
        return;
      }

      if (!this.pdfDocument || isNaN(pdfPageNumber)) {
        return;
      }

      pdfPageNumber = Math.min(pdfPageNumber, this.pdfDocument.numPages);
      pageScrollPosition = this.pageHeights.slice(0, pdfPageNumber - 1).reduce(function (x, y) {
        return x + y;
      }, 0) + (pdfPageNumber - 1) * 20;

      return this.scrollTop(pageScrollPosition);
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        filePath: this.filePath,
        scale: this.currentScale,
        scrollTop: this.scrollTopBeforeUpdate,
        scrollLeft: this.scrollLeftBeforeUpdate,
        deserializer: 'PdfEditorDeserializer'
      };
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.filePath) {
        return path.basename(this.filePath);
      } else {
        return 'untitled';
      }
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.filePath;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.filePath;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this.detach();
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle() {
      return new Disposable(function () {
        return null;
      });
    }
  }, {
    key: 'onDidChangeModified',
    value: function onDidChangeModified() {
      return new Disposable(function () {
        return null;
      });
    }
  }]);

  return PdfEditorView;
})(ScrollView);

exports['default'] = PdfEditorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1lZGl0b3Itdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUVVLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7SUFBaEQsQ0FBQyxZQUFELENBQUM7SUFBRSxVQUFVLFlBQVYsVUFBVTs7Z0JBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEIsS0FBSyxhQUFMLEtBQUs7O0FBQ1YsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7Z0JBQ1csT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEQsSUFBSSxhQUFKLElBQUk7SUFBRSxVQUFVLGFBQVYsVUFBVTtJQUFFLG1CQUFtQixhQUFuQixtQkFBbUI7O2dCQUN6QixPQUFPLENBQUMsVUFBVSxDQUFDOztJQUEvQixRQUFRLGFBQVIsUUFBUTs7QUFDYixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFM0IsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsSUFBSSxFQUFDLENBQUM7QUFDcEUsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7QUFDckQsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztBQUN4RyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxrQ0FBa0MsQ0FBQyxHQUFDLEdBQUcsQ0FBQzs7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QUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDdkIsYUFBSyxFQUFFLElBQUksQ0FBQyxZQUFZO0FBQ3hCLGlCQUFTLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtBQUNyQyxrQkFBVSxFQUFFLElBQUksQ0FBQyxzQkFBc0I7QUFDdkMsb0JBQVksRUFBRSx1QkFBdUI7T0FDdEMsQ0FBQztLQUNIOzs7V0FFTyxvQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3JDLE1BQU07QUFDTCxlQUFPLFVBQVUsQ0FBQztPQUNuQjtLQUNGOzs7V0FFSyxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7O1dBRU0sbUJBQUc7QUFDUixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7OztXQUVNLG1CQUFHO0FBQ1IsYUFBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdEI7OztXQUVlLDRCQUFHO0FBQ2pCLGFBQU8sSUFBSSxVQUFVLENBQUM7ZUFBTSxJQUFJO09BQUEsQ0FBQyxDQUFDO0tBQ25DOzs7V0FFa0IsK0JBQUc7QUFDcEIsYUFBTyxJQUFJLFVBQVUsQ0FBQztlQUFNLElBQUk7T0FBQSxDQUFDLENBQUM7S0FDbkM7OztTQTVrQmtCLGFBQWE7R0FBUyxVQUFVOztxQkFBaEMsYUFBYSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQgeyQsIFNjcm9sbFZpZXd9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKTtcbmxldCB7UG9pbnR9ID0gcmVxdWlyZSgnYXRvbScpO1xubGV0IGZzID0gcmVxdWlyZSgnZnMtcGx1cycpO1xubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5sZXQgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUtcGx1cycpO1xubGV0IHtGaWxlLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcbmxldCB7RnVuY3Rpb259ID0gcmVxdWlyZSgnbG9vcGhvbGUnKTtcbmdsb2JhbC5GdW5jdGlvbiA9IEZ1bmN0aW9uO1xuXG5nbG9iYWwuUERGSlMgPSB7d29ya2VyU3JjOiBcInRlbXBcIiwgY01hcFVybDpcInRlbXBcIiwgY01hcFBhY2tlZDp0cnVlfTtcbnJlcXVpcmUoJy4vLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvYnVpbGQvcGRmLmpzJyk7XG5QREZKUy53b3JrZXJTcmMgPSBcImZpbGU6Ly9cIiArIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvYnVpbGQvcGRmLndvcmtlci5qc1wiKTtcblBERkpTLmNNYXBVcmwgPSBcImZpbGU6Ly9cIiArIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvY21hcHNcIikrXCIvXCI7XG5sZXQge2V4ZWMsIGV4ZWNGaWxlfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGRmRWRpdG9yVmlldyBleHRlbmRzIFNjcm9sbFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7Y2xhc3M6ICdwZGYtdmlldycsIHRhYmluZGV4OiAtMX0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHtvdXRsZXQ6ICdjb250YWluZXInLCBzdHlsZTogJ3Bvc2l0aW9uOiByZWxhdGl2ZSd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVQYXRoLCBzY2FsZSA9IG51bGwsIHNjcm9sbFRvcCA9IDAsIHNjcm9sbExlZnQgPSAwKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY3VycmVudFNjYWxlID0gc2NhbGUgPyBzY2FsZSA6IDEuNTtcbiAgICB0aGlzLmRlZmF1bHRTY2FsZSA9IDEuNTtcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gMTAuMDtcbiAgICB0aGlzLmZpdFRvV2lkdGhPbk9wZW4gPSAhc2NhbGUgJiYgYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5maXRUb1dpZHRoT25PcGVuJylcblxuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcbiAgICB0aGlzLmZpbGUgPSBuZXcgRmlsZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSA9IHNjcm9sbFRvcDtcbiAgICB0aGlzLnNjcm9sbExlZnRCZWZvcmVVcGRhdGUgPSBzY3JvbGxMZWZ0O1xuICAgIHRoaXMuY2FudmFzZXMgPSBbXTtcbiAgICB0aGlzLnVwZGF0aW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLnVwZGF0ZVBkZih0cnVlKTtcblxuICAgIHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgPSAwO1xuICAgIHRoaXMudG90YWxQYWdlTnVtYmVyID0gMDtcbiAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMgPSBbXTtcbiAgICB0aGlzLnBhZ2VIZWlnaHRzID0gW107XG4gICAgdGhpcy5tYXhQYWdlV2lkdGggPSAwO1xuICAgIHRoaXMudG9TY2FsZUZhY3RvciA9IDEuMDtcblxuICAgIGxldCBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICBsZXQgbmVlZHNVcGRhdGVDYWxsYmFjayA9IF8uZGVib3VuY2UoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgICAgdGhpcy5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVBkZigpO1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3BkZi12aWV3LnJldmVyc2VTeW5jQmVoYXZpb3VyJywgbmVlZHNVcGRhdGVDYWxsYmFjaykpO1xuXG4gICAgbGV0IGF1dG9SZWxvYWREaXNwb3NhYmxlO1xuICAgIGxldCBzZXR1cEF1dG9SZWxvYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5hdXRvUmVsb2FkT25VcGRhdGUnKSkge1xuICAgICAgICBhdXRvUmVsb2FkRGlzcG9zYWJsZSA9IHRoaXMuZmlsZS5vbkRpZENoYW5nZShuZWVkc1VwZGF0ZUNhbGxiYWNrKVxuICAgICAgICBkaXNwb3NhYmxlcy5hZGQoYXV0b1JlbG9hZERpc3Bvc2FibGUpO1xuICAgICAgfSBlbHNlIGlmKGF1dG9SZWxvYWREaXNwb3NhYmxlKSB7XG4gICAgICAgIGRpc3Bvc2FibGVzLnJlbW92ZShhdXRvUmVsb2FkRGlzcG9zYWJsZSk7XG4gICAgICAgIGF1dG9SZWxvYWREaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgIH1cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgncGRmLXZpZXcuYXV0b1JlbG9hZE9uVXBkYXRlJywgc2V0dXBBdXRvUmVsb2FkKSk7XG5cbiAgICBsZXQgbW92ZUxlZnRDYWxsYmFjayA9ICgoKSA9PiB0aGlzLnNjcm9sbExlZnQodGhpcy5zY3JvbGxMZWZ0KCkgLSAkKHdpbmRvdykud2lkdGgoKSAvIDIwKSk7XG4gICAgbGV0IG1vdmVSaWdodENhbGxiYWNrID0gKCgpID0+IHRoaXMuc2Nyb2xsUmlnaHQodGhpcy5zY3JvbGxSaWdodCgpICsgJCh3aW5kb3cpLndpZHRoKCkgLyAyMCkpO1xuICAgIGxldCBzY3JvbGxDYWxsYmFjayA9ICgoKSA9PiB0aGlzLm9uU2Nyb2xsKCkpO1xuICAgIGxldCByZXNpemVIYW5kbGVyID0gKCgpID0+IHRoaXMuc2V0Q3VycmVudFBhZ2VOdW1iZXIoKSk7XG5cbiAgICBsZXQgZWxlbSA9IHRoaXM7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnLnBkZi12aWV3Jywge1xuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogbW92ZUxlZnRDYWxsYmFjayxcbiAgICAgICdjb3JlOm1vdmUtcmlnaHQnOiBtb3ZlUmlnaHRDYWxsYmFja1xuICAgIH0pO1xuXG4gICAgZWxlbS5vbignc2Nyb2xsJywgc2Nyb2xsQ2FsbGJhY2spO1xuICAgIGRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBzY3JvbGxDYWxsYmFjaykpKTtcblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG4gICAgZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+ICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpKSk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAncGRmLXZpZXc6em9vbS1pbic6ICgpID0+IHtcbiAgICAgICAgaWYgKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgPT09IHRoaXMpIHtcbiAgICAgICAgICB0aGlzLnpvb21JbigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3Onpvb20tb3V0JzogKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gdGhpcykge1xuICAgICAgICAgIHRoaXMuem9vbU91dCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OnJlc2V0LXpvb20nOiAoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpID09PSB0aGlzKSB7XG4gICAgICAgICAgdGhpcy5yZXNldFpvb20oKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpnby10by1uZXh0LXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpID09PSB0aGlzKSB7XG4gICAgICAgICAgdGhpcy5nb1RvTmV4dFBhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpnby10by1wcmV2aW91cy1wYWdlJzogKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gdGhpcykge1xuICAgICAgICAgIHRoaXMuZ29Ub1ByZXZpb3VzUGFnZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OnJlbG9hZCc6ICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQZGYodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcblxuICAgIHRoaXMub25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5zaW1wbGVDbGljayA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wKHRoaXMuZHJhZ2dpbmcuc2Nyb2xsVG9wIC0gKGUuc2NyZWVuWSAtIHRoaXMuZHJhZ2dpbmcueSkpO1xuICAgICAgICB0aGlzLnNjcm9sbExlZnQodGhpcy5kcmFnZ2luZy5zY3JvbGxMZWZ0IC0gKGUuc2NyZWVuWCAtIHRoaXMuZHJhZ2dpbmcueCkpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgJChkb2N1bWVudCkudW5iaW5kKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICQoZG9jdW1lbnQpLnVuYmluZCgnbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2ltcGxlQ2xpY2sgPSB0cnVlO1xuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcykuYWN0aXZhdGUoKTtcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSB7eDogZS5zY3JlZW5YLCB5OiBlLnNjcmVlblksIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3AoKSwgc2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxMZWZ0KCl9O1xuICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgICAgJChkb2N1bWVudCkub24oJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdtb3VzZXdoZWVsJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPiAwKSB7XG4gICAgICAgICAgdGhpcy56b29tSW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA8IDApIHtcbiAgICAgICAgICB0aGlzLnpvb21PdXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV2ZXJzZVN5bmMocGFnZSwgZSkge1xuICAgIGlmICh0aGlzLnNpbXBsZUNsaWNrKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICBsZXQgdmlld3BvcnQgPSBwZGZQYWdlLmdldFZpZXdwb3J0KHRoaXMuY3VycmVudFNjYWxlKTtcbiAgICAgICAgbGV0IHgseTtcbiAgICAgICAgW3gseV0gPSB2aWV3cG9ydC5jb252ZXJ0VG9QZGZQb2ludChlLm9mZnNldFgsICQodGhpcy5jYW52YXNlc1twYWdlIC0gMV0pLmhlaWdodCgpIC0gZS5vZmZzZXRZKTtcblxuICAgICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIHN0ZG91dCA9IHN0ZG91dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBsaW5lIG9mIHN0ZG91dC5zcGxpdCgnXFxuJykpIHtcbiAgICAgICAgICAgICAgbGV0IG0gPSBsaW5lLm1hdGNoKC9eKFthLXpBLVpdKik6KC4qKSQvKVxuICAgICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW21bMV1dID0gbVsyXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmlsZSA9IGF0dHJzLklucHV0O1xuICAgICAgICAgICAgbGV0IGxpbmUgPSBhdHRycy5MaW5lO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSAmJiBsaW5lKSB7XG4gICAgICAgICAgICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgICAgICAgICAgICBsZXQgcGF0aFRvT3BlbiA9IHBhdGgubm9ybWFsaXplKGF0dHJzLklucHV0KTtcbiAgICAgICAgICAgICAgbGV0IGxpbmVUb09wZW4gPSArYXR0cnMuTGluZTtcbiAgICAgICAgICAgICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgZWRpdG9yIG9mIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSA9PT0gcGF0aFRvT3Blbikge1xuICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IFBvaW50KGxpbmVUb09wZW4tMSwgLTEpO1xuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KTtcbiAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKTtcbiAgICAgICAgICAgICAgICAgIGxldCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yKTtcbiAgICAgICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcik7XG4gICAgICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgIGxldCBwYW5lb3B0ID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5wYW5lVG9Vc2VJblN5bmN0ZXgnKVxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aFRvT3Blbiwge2luaXRpYWxMaW5lOiBsaW5lVG9PcGVuLCBpbml0aWFsQ29sdW1uOiAwLCBzcGxpdDogcGFuZW9wdH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBzeW5jdGV4UGF0aCA9IGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuc3luY1RlWFBhdGgnKTtcbiAgICAgICAgbGV0IGNsaWNrc3BlYyA9IFtwYWdlLCB4LCB5LCB0aGlzLmZpbGVQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgICAgaWYgKHN5bmN0ZXhQYXRoKSB7XG4gICAgICAgICAgZXhlY0ZpbGUoc3luY3RleFBhdGgsIFtcImVkaXRcIiwgXCItb1wiLCBjbGlja3NwZWNdLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IGVkaXQgLW8gXCIke2NsaWNrc3BlY31cImA7XG4gICAgICAgICAgZXhlYyhjbWQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZm9yd2FyZFN5bmModGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgICAgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlID0ge1xuICAgICAgICAgIHRleFBhdGgsXG4gICAgICAgICAgbGluZU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgc3Rkb3V0ID0gc3Rkb3V0LnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgZm9yIChsZXQgbGluZSBvZiBzdGRvdXQuc3BsaXQoJ1xcbicpKSB7XG4gICAgICAgICAgICBsZXQgbSA9IGxpbmUubWF0Y2goL14oW2EtekEtWl0qKTooLiopJC8pXG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICBpZiAobVsxXSBpbiBhdHRycykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgYXR0cnNbbVsxXV0gPSBtWzJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBwYWdlID0gcGFyc2VJbnQoYXR0cnMuUGFnZSk7XG5cbiAgICAgICAgICBpZiAocGFnZSA+IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHZpZXdwb3J0ID0gcGRmUGFnZS5nZXRWaWV3cG9ydCh0aGlzLmN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNlc1twYWdlIC0gMV07XG5cbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VGbG9hdChhdHRycy54KTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VGbG9hdChhdHRycy55KTtcbiAgICAgICAgICAgIFt4LCB5XSA9IHZpZXdwb3J0LmNvbnZlcnRUb1ZpZXdwb3J0UG9pbnQoeCwgeSk7XG5cbiAgICAgICAgICAgIHggPSB4ICsgY2FudmFzLm9mZnNldExlZnQ7XG4gICAgICAgICAgICB5ID0gdmlld3BvcnQuaGVpZ2h0IC0geSArIGNhbnZhcy5vZmZzZXRUb3A7XG5cbiAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5VGhyZXNob2xkID0gNTA7XG5cbiAgICAgICAgICAgIC8vIFNjcm9sbFxuICAgICAgICAgICAgaWYgKHkgPCB0aGlzLnNjcm9sbFRvcCgpICsgdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCh5IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHkgPiB0aGlzLnNjcm9sbEJvdHRvbSgpIC0gdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbEJvdHRvbSh5ICsgdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4IDwgdGhpcy5zY3JvbGxMZWZ0KCkgKyB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGVmdCh4IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHggPiB0aGlzLnNjcm9sbFJpZ2h0KCkgLSB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm90dG9tKHggKyB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyBoaWdobGlnaHRlclxuICAgICAgICAgICAgJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICBjbGFzczogXCJ0ZXgtaGlnaGxpZ2h0XCIsXG4gICAgICAgICAgICAgIHN0eWxlOiBgdG9wOiAke3l9cHg7IGxlZnQ6ICR7eH1weDtgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAgICAgLm9uKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN5bmN0ZXhQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5zeW5jVGVYUGF0aCcpO1xuICAgICAgbGV0IGlucHV0c3BlYyA9IFtsaW5lTnVtYmVyLCAwLCB0ZXhQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgIGlmIChzeW5jdGV4UGF0aCkge1xuICAgICAgICBleGVjRmlsZShzeW5jdGV4UGF0aCwgW1widmlld1wiLCBcIi1pXCIsIGlucHV0c3BlYywgXCItb1wiLCB0aGlzLmZpbGVQYXRoXSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IHZpZXcgLWkgXCIke2lucHV0c3BlY31cIiAtbyBcIiR7dGhpcy5maWxlUGF0aH1cImA7XG4gICAgICAgIGV4ZWMoY21kLCBjYWxsYmFjayk7XG4gICAgICB9XG4gIH1cblxuXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICghdGhpcy51cGRhdGluZykge1xuICAgICAgdGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUgPSB0aGlzLnNjcm9sbFRvcCgpO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0QmVmb3JlVXBkYXRlID0gdGhpcy5zY3JvbGxMZWZ0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpO1xuICB9XG5cbiAgc2V0Q3VycmVudFBhZ2VOdW1iZXIoKSB7XG4gICAgaWYgKCF0aGlzLnBkZkRvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNlbnRlciA9ICh0aGlzLnNjcm9sbEJvdHRvbSgpICsgdGhpcy5zY3JvbGxUb3AoKSkvMi4wXG4gICAgdGhpcy5jdXJyZW50UGFnZU51bWJlciA9IDFcblxuICAgIGlmICh0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMubGVuZ3RoID09PSAwICYmIHRoaXMucGFnZUhlaWdodHMubGVuZ3RoID09PSB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKVxuICAgICAgZm9yIChsZXQgcGRmUGFnZU51bWJlciBvZiBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMrMSkpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJzQmV0d2VlblBhZ2VzLnB1c2godGhpcy5wYWdlSGVpZ2h0cy5zbGljZSgwLCBwZGZQYWdlTnVtYmVyKS5yZWR1Y2UoKCh4LHkpID0+IHggKyB5KSwgMCkgKyBwZGZQYWdlTnVtYmVyICogMjAgLSAxMCk7XG4gICAgICB9XG5cbiAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMiwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcysxKSkge1xuICAgICAgaWYgKGNlbnRlciA+PSB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXNbcGRmUGFnZU51bWJlci0yXSAmJiBjZW50ZXIgPCB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXNbcGRmUGFnZU51bWJlci0xXSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyID0gcGRmUGFnZU51bWJlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdwZGYtdmlldzpjdXJyZW50LXBhZ2UtdXBkYXRlJykpO1xuICB9XG5cbiAgZmluaXNoVXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRpbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5uZWVkc1VwZGF0ZSkge1xuICAgICAgdGhpcy51cGRhdGVQZGYoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudG9TY2FsZUZhY3RvciAhPSAxKSB7XG4gICAgICB0aGlzLmFkanVzdFNpemUoMSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNjcm9sbFRvUGFnZUFmdGVyVXBkYXRlKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnNjcm9sbFRvUGFnZUFmdGVyVXBkYXRlKVxuICAgICAgZGVsZXRlIHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGVcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9yd2FyZFN5bmNBZnRlclVwZGF0ZSkge1xuICAgICAgdGhpcy5mb3J3YXJkU3luYyh0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGUudGV4UGF0aCwgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlLmxpbmVOdW1iZXIpXG4gICAgICBkZWxldGUgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGRmKGNsb3NlT25FcnJvciA9IGZhbHNlKSB7XG4gICAgdGhpcy5uZWVkc1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBkZkRhdGEgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHBkZkRhdGEgPSBuZXcgVWludDhBcnJheShmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuXG4gICAgbGV0IHJldmVyc2VTeW5jQ2xpY2t0eXBlID0gbnVsbFxuICAgIHN3aXRjaChhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LnJldmVyc2VTeW5jQmVoYXZpb3VyJykpIHtcbiAgICAgIGNhc2UgJ0NsaWNrJzpcbiAgICAgICAgcmV2ZXJzZVN5bmNDbGlja3R5cGUgPSAnY2xpY2snXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdEb3VibGUgY2xpY2snOlxuICAgICAgICByZXZlcnNlU3luY0NsaWNrdHlwZSA9ICdkYmxjbGljaydcbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBQREZKUy5nZXREb2N1bWVudChwZGZEYXRhKS50aGVuKChwZGZEb2N1bWVudCkgPT4ge1xuICAgICAgdGhpcy5jb250YWluZXIuZmluZChcImNhbnZhc1wiKS5yZW1vdmUoKTtcbiAgICAgIHRoaXMuY2FudmFzZXMgPSBbXTtcbiAgICAgIHRoaXMucGFnZUhlaWdodHMgPSBbXTtcblxuICAgICAgdGhpcy5wZGZEb2N1bWVudCA9IHBkZkRvY3VtZW50O1xuICAgICAgdGhpcy50b3RhbFBhZ2VOdW1iZXIgPSB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzO1xuXG4gICAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcysxKSkge1xuICAgICAgICBsZXQgY2FudmFzID0gJChcIjxjYW52YXMvPlwiLCB7Y2xhc3M6IFwicGFnZS1jb250YWluZXJcIn0pLmFwcGVuZFRvKHRoaXMuY29udGFpbmVyKVswXTtcbiAgICAgICAgdGhpcy5jYW52YXNlcy5wdXNoKGNhbnZhcyk7XG4gICAgICAgIHRoaXMucGFnZUhlaWdodHMucHVzaCgwKTtcbiAgICAgICAgaWYgKHJldmVyc2VTeW5jQ2xpY2t0eXBlKSB7XG4gICAgICAgICAgJChjYW52YXMpLm9uKHJldmVyc2VTeW5jQ2xpY2t0eXBlLCAoZSkgPT4gdGhpcy5yZXZlcnNlU3luYyhwZGZQYWdlTnVtYmVyLCBlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZml0VG9XaWR0aE9uT3Blbikge1xuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+XG4gICAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT5cbiAgICAgICAgICAgICAgcGRmUGFnZS5nZXRWaWV3cG9ydCgxLjApLndpZHRoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLnRoZW4oKHBkZlBhZ2VXaWR0aHMpID0+IHtcbiAgICAgICAgICB0aGlzLm1heFBhZ2VXaWR0aCA9IE1hdGgubWF4KC4uLnBkZlBhZ2VXaWR0aHMpO1xuICAgICAgICAgIHRoaXMucmVuZGVyUGRmKCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlclBkZigpO1xuICAgICAgfVxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmIChjbG9zZU9uRXJyb3IpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMuZmlsZVBhdGggKyBcIiBpcyBub3QgYSBQREYgZmlsZS5cIik7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRoaXMpLmRlc3Ryb3lJdGVtKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5pc2hVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlclBkZihzY3JvbGxBZnRlclJlbmRlciA9IHRydWUpIHtcbiAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMgPSBbXTtcblxuICAgIGlmICh0aGlzLmZpdFRvV2lkdGhPbk9wZW4pIHtcbiAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gdGhpc1swXS5jbGllbnRXaWR0aCAvIHRoaXMubWF4UGFnZVdpZHRoO1xuICAgICAgdGhpcy5maXRUb1dpZHRoT25PcGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwoXG4gICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+IHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzZXNbcGRmUGFnZU51bWJlciAtIDFdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQodGhpcy5jdXJyZW50U2NhbGUpO1xuICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBsZXQgb3V0cHV0U2NhbGUgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQpICogb3V0cHV0U2NhbGU7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gTWF0aC5mbG9vcih2aWV3cG9ydC53aWR0aCkgKiBvdXRwdXRTY2FsZTtcblxuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWCA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWSA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuc2NhbGUob3V0cHV0U2NhbGUsIG91dHB1dFNjYWxlKTtcbiAgICAgICAgICBjb250ZXh0Ll90cmFuc2Zvcm1NYXRyaXggPSBbb3V0cHV0U2NhbGUsIDAsIDAsIG91dHB1dFNjYWxlLCAwLCAwXTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBNYXRoLmZsb29yKHZpZXdwb3J0LndpZHRoKSArICdweCc7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KSArICdweCc7XG5cbiAgICAgICAgICB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXIgLSAxXSA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KTtcblxuICAgICAgICAgIHJldHVybiBwZGZQYWdlLnJlbmRlcih7Y2FudmFzQ29udGV4dDogY29udGV4dCwgdmlld3BvcnQ6IHZpZXdwb3J0fSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApLnRoZW4oKHJlbmRlclRhc2tzKSA9PiB7XG4gICAgICBpZiAoc2Nyb2xsQWZ0ZXJSZW5kZXIpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb3AodGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUpO1xuICAgICAgICB0aGlzLnNjcm9sbExlZnQodGhpcy5zY3JvbGxMZWZ0QmVmb3JlVXBkYXRlKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpO1xuICAgICAgfVxuICAgICAgUHJvbWlzZS5hbGwocmVuZGVyVGFza3MpLnRoZW4oKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gICAgfSwgKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gIH1cblxuICB6b29tT3V0KCkge1xuICAgIHJldHVybiB0aGlzLmFkanVzdFNpemUoMTAwIC8gKDEwMCArIHRoaXMuc2NhbGVGYWN0b3IpKTtcbiAgfVxuXG4gIHpvb21JbigpIHtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKCgxMDAgKyB0aGlzLnNjYWxlRmFjdG9yKSAvIDEwMCk7XG4gIH1cblxuICByZXNldFpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRqdXN0U2l6ZSh0aGlzLmRlZmF1bHRTY2FsZSAvIHRoaXMuY3VycmVudFNjYWxlKTtcbiAgfVxuXG4gIGdvVG9OZXh0UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JvbGxUb1BhZ2UodGhpcy5jdXJyZW50UGFnZU51bWJlciArIDEpO1xuICB9XG5cbiAgZ29Ub1ByZXZpb3VzUGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JvbGxUb1BhZ2UodGhpcy5jdXJyZW50UGFnZU51bWJlciAtIDEpO1xuICB9XG5cbiAgY29tcHV0ZVpvb21lZFNjcm9sbFRvcChvbGRTY3JvbGxUb3AsIG9sZFBhZ2VIZWlnaHRzKSB7XG4gICAgbGV0IHBpeGVsc1RvWm9vbSA9IDA7XG4gICAgbGV0IHNwYWNlc1RvU2tpcCA9IDA7XG4gICAgbGV0IHpvb21lZFBpeGVscyA9IDA7XG5cbiAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMCwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcykpIHtcbiAgICAgIGlmIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXAgKyBvbGRQYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXSA+IG9sZFNjcm9sbFRvcCkge1xuICAgICAgICB6b29tRmFjdG9yRm9yUGFnZSA9IHRoaXMucGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl0gLyBvbGRQYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXTtcbiAgICAgICAgbGV0IHBhcnRPZlBhZ2VBYm92ZVVwcGVyQm9yZGVyID0gb2xkU2Nyb2xsVG9wIC0gKHBpeGVsc1RvWm9vbSArIHNwYWNlc1RvU2tpcCk7XG4gICAgICAgIHpvb21lZFBpeGVscyArPSBNYXRoLnJvdW5kKHBhcnRPZlBhZ2VBYm92ZVVwcGVyQm9yZGVyICogem9vbUZhY3RvckZvclBhZ2UpO1xuICAgICAgICBwaXhlbHNUb1pvb20gKz0gcGFydE9mUGFnZUFib3ZlVXBwZXJCb3JkZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGl4ZWxzVG9ab29tICs9IG9sZFBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdO1xuICAgICAgICB6b29tZWRQaXhlbHMgKz0gdGhpcy5wYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBpeGVsc1RvWm9vbSArIHNwYWNlc1RvU2tpcCArIDIwID4gb2xkU2Nyb2xsVG9wKSB7XG4gICAgICAgIGxldCBwYXJ0T2ZQYWRkaW5nQWJvdmVVcHBlckJvcmRlciA9IG9sZFNjcm9sbFRvcCAtIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXApO1xuICAgICAgICBzcGFjZXNUb1NraXAgKz0gcGFydE9mUGFkZGluZ0Fib3ZlVXBwZXJCb3JkZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhY2VzVG9Ta2lwICs9IDIwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB6b29tZWRQaXhlbHMgKyBzcGFjZXNUb1NraXA7XG4gIH1cblxuICBhZGp1c3RTaXplKGZhY3Rvcikge1xuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZhY3RvciA9IHRoaXMudG9TY2FsZUZhY3RvciAqIGZhY3RvcjtcblxuICAgIGlmICh0aGlzLnVwZGF0aW5nKSB7XG4gICAgICB0aGlzLnRvU2NhbGVGYWN0b3IgPSBmYWN0b3I7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGluZyA9IHRydWU7XG4gICAgdGhpcy50b1NjYWxlRmFjdG9yID0gMTtcblxuICAgIGxldCBvbGRTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcCgpO1xuICAgIGxldCBvbGRQYWdlSGVpZ2h0cyA9IHRoaXMucGFnZUhlaWdodHMuc2xpY2UoMCk7XG4gICAgdGhpcy5jdXJyZW50U2NhbGUgPSB0aGlzLmN1cnJlbnRTY2FsZSAqIGZhY3RvcjtcbiAgICB0aGlzLnJlbmRlclBkZihmYWxzZSk7XG5cbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIGxldCBuZXdTY3JvbGxUb3AgPSB0aGlzLmNvbXB1dGVab29tZWRTY3JvbGxUb3Aob2xkU2Nyb2xsVG9wLCBvbGRQYWdlSGVpZ2h0cyk7XG4gICAgICB0aGlzLnNjcm9sbFRvcChuZXdTY3JvbGxUb3ApO1xuICAgIH0pO1xuXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBsZXQgbmV3U2Nyb2xsTGVmdCA9IHRoaXMuc2Nyb2xsTGVmdCgpICogZmFjdG9yO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0KG5ld1Njcm9sbExlZnQpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q3VycmVudFBhZ2VOdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VOdW1iZXI7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VOdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxQYWdlTnVtYmVyO1xuICB9XG5cbiAgc2Nyb2xsVG9QYWdlKHBkZlBhZ2VOdW1iZXIpIHtcbiAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgdGhpcy5zY3JvbGxUb1BhZ2VBZnRlclVwZGF0ZSA9IHBkZlBhZ2VOdW1iZXJcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCB8fCBpc05hTihwZGZQYWdlTnVtYmVyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBkZlBhZ2VOdW1iZXIgPSBNYXRoLm1pbihwZGZQYWdlTnVtYmVyLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKTtcbiAgICBwYWdlU2Nyb2xsUG9zaXRpb24gPSAodGhpcy5wYWdlSGVpZ2h0cy5zbGljZSgwLCAocGRmUGFnZU51bWJlci0xKSkucmVkdWNlKCgoeCx5KSA9PiB4K3kpLCAwKSkgKyAocGRmUGFnZU51bWJlciAtIDEpICogMjBcblxuICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcChwYWdlU2Nyb2xsUG9zaXRpb24pO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWxlUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgIHNjYWxlOiB0aGlzLmN1cnJlbnRTY2FsZSxcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUsXG4gICAgICBzY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbExlZnRCZWZvcmVVcGRhdGUsXG4gICAgICBkZXNlcmlhbGl6ZXI6ICdQZGZFZGl0b3JEZXNlcmlhbGl6ZXInXG4gICAgfTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIGlmICh0aGlzLmZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gcGF0aC5iYXNlbmFtZSh0aGlzLmZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd1bnRpdGxlZCc7XG4gICAgfVxuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoO1xuICB9XG5cbiAgZ2V0UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0aDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0YWNoKCk7XG4gIH1cblxuICBvbkRpZENoYW5nZVRpdGxlKCkge1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiBudWxsKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlTW9kaWZpZWQoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IG51bGwpO1xuICB9XG59XG4iXX0=
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

    this.pdfViewElements = [];
    this.binaryViewEditor = null;

    this.currentPageNumber = 0;
    this.totalPageNumber = 0;
    this.centersBetweenPages = [];
    this.pageHeights = [];
    this.maxPageWidth = 0;
    this.toScaleFactor = 1.0;
    this.dragging = null;

    var disposables = new CompositeDisposable();

    var needsUpdateCallback = function needsUpdateCallback() {
      if (_this2.updating) {
        _this2.needsUpdate = true;
      } else {
        _this2.updatePdf();
      }
    };

    var toggleNightModeCallback = function toggleNightModeCallback() {
      _this2.setNightMode();
    };

    disposables.add(atom.config.onDidChange('pdf-view.nightMode', toggleNightModeCallback));
    disposables.add(atom.config.onDidChange('pdf-view.reverseSyncBehaviour', needsUpdateCallback));

    disposables.add(this.file.onDidChange(function () {
      if (atom.config.get('pdf-view.autoReloadOnUpdate')) {
        needsUpdateCallback();
      } else {
        _this2.fileUpdated = true;
      }
    }));

    var autoReloadDisposable = undefined;
    var setupAutoReload = function setupAutoReload() {
      if (!atom.config.get('pdf-view.autoReloadOnUpdate')) {
        autoReloadDisposable = atom.workspace.onDidOpen(function (e) {
          if (e.item == _this2 && _this2.fileUpdated) {
            _this2.fileUpdated = false;
            needsUpdateCallback();
          }
        });
      } else {
        if (autoReloadDisposable) {
          disposables.remove(autoReloadDisposable);
          autoReloadDisposable.dispose();
        }

        if (_this2.fileUpdated) {
          _this2.fileUpdated = false;
          needsUpdateCallback();
        }
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

    atom.commands.add('.pdf-view', {
      'core:move-left': moveLeftCallback,
      'core:move-right': moveRightCallback
    });

    this.on('scroll', scrollCallback);
    $(window).on('resize', resizeHandler);

    disposables.add(new Disposable(function () {
      $(window).off('scroll', scrollCallback);
      $(window).off('resize', resizeHandler);
    }));

    atom.commands.add('atom-workspace', {
      'pdf-view:zoom-fit': function pdfViewZoomFit() {
        if (_this2.hasFocus()) {
          _this2.zoomFit();
        }
      },
      'pdf-view:zoom-in': function pdfViewZoomIn() {
        if (_this2.hasFocus()) {
          _this2.zoomIn();
        }
      },
      'pdf-view:zoom-out': function pdfViewZoomOut() {
        if (_this2.hasFocus()) {
          _this2.zoomOut();
        }
      },
      'pdf-view:reset-zoom': function pdfViewResetZoom() {
        if (_this2.hasFocus()) {
          _this2.resetZoom();
        }
      },
      'pdf-view:go-to-next-page': function pdfViewGoToNextPage() {
        if (_this2.hasFocus()) {
          _this2.goToNextPage();
        }
      },
      'pdf-view:go-to-previous-page': function pdfViewGoToPreviousPage() {
        if (_this2.hasFocus()) {
          _this2.goToPreviousPage();
        }
      },
      'pdf-view:reload': function pdfViewReload() {
        _this2.updatePdf(true);
      }
    });

    this.onMouseMove = function (e) {
      if (_this2.binaryView) {
        return;
      }
      if (_this2.dragging) {
        _this2.simpleClick = false;

        _this2.scrollTop(_this2.dragging.scrollTop - (e.screenY - _this2.dragging.y));
        _this2.scrollLeft(_this2.dragging.scrollLeft - (e.screenX - _this2.dragging.x));
        e.preventDefault();
      }
    };

    this.onMouseUp = function (e) {
      if (_this2.binaryView) {
        return;
      }
      _this2.dragging = null;
      $(document).unbind('mousemove', _this2.onMouseMove);
      $(document).unbind('mouseup', _this2.onMouseUp);
      e.preventDefault();
    };

    this.on('mousedown', function (e) {
      if (_this2.binaryView) {
        return;
      }
      _this2.simpleClick = true;
      atom.workspace.paneForItem(_this2).activate();
      _this2.dragging = { x: e.screenX, y: e.screenY, scrollTop: _this2.scrollTop(), scrollLeft: _this2.scrollLeft() };
      $(document).on('mousemove', _this2.onMouseMove);
      $(document).on('mouseup', _this2.onMouseUp);
      e.preventDefault();
    });

    this.on('mousewheel', function (e) {
      if (_this2.binaryView) {
        return;
      }
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
    key: 'hasFocus',
    value: function hasFocus() {
      return !this.binaryView && atom.workspace.getActivePaneItem() === this;
    }
  }, {
    key: 'setNightMode',
    value: function setNightMode() {
      if (atom.config.get('pdf-view.nightMode')) {
        this.addClass('night-mode');
      } else {
        this.removeClass('night-mode');
      }
    }
  }, {
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

            if (!_this4.pdfDocument) {
              return {
                v: undefined
              };
            }

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
      if (this.binaryView) {
        return;
      }

      if (!this.updating) {
        this.scrollTopBeforeUpdate = this.scrollTop();
        this.scrollLeftBeforeUpdate = this.scrollLeft();
      }

      this.setCurrentPageNumber();
    }
  }, {
    key: 'setCurrentPageNumber',
    value: function setCurrentPageNumber() {
      if (!this.pdfDocument || this.binaryView) {
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
      if (this.scrollToNamedDestAfterUpdate) {
        this.scrollToNamedDest(this.scrollToNamedDestAfterUpdate);
        delete this.scrollToNamedDestAfterUpdate;
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

      this.setNightMode();

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

        _this5.maxPageWidth = 0;

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
    key: 'computeMaxPageWidthAndTryZoomFit',
    value: function computeMaxPageWidthAndTryZoomFit() {
      var _this7 = this;

      Promise.all(_.range(1, this.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
        return _this7.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
          return pdfPage.getViewport(1.0).width;
        });
      })).then(function (pdfPageWidths) {
        _this7.maxPageWidth = Math.max.apply(Math, _toConsumableArray(pdfPageWidths));
        _this7.zoomFit();
      });
    }
  }, {
    key: 'zoomFit',
    value: function zoomFit() {
      if (this.maxPageWidth == 0) {
        this.computeMaxPageWidthAndTryZoomFit();
        return;
      }
      var fitScale = this[0].clientWidth / this.maxPageWidth;
      return this.adjustSize(fitScale / (this.currentScale * this.toScaleFactor));
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
      var _this8 = this;

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
        var newScrollTop = _this8.computeZoomedScrollTop(oldScrollTop, oldPageHeights);
        _this8.scrollTop(newScrollTop);
      });

      process.nextTick(function () {
        var newScrollLeft = _this8.scrollLeft() * factor;
        _this8.scrollLeft(newScrollLeft);
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
    key: 'scrollToNamedDest',
    value: function scrollToNamedDest(namedDest) {
      var _this9 = this;

      if (this.updating) {
        this.scrollToNamedDestAfterUpdate = namedDest;
        return;
      }

      if (!this.pdfDocument) {
        return;
      }

      this.pdfDocument.getDestination(namedDest).then(function (destRef) {
        return _this9.pdfDocument.getPageIndex(destRef[0]);
      }).then(function (pageNumber) {
        return _this9.scrollToPage(pageNumber + 1);
      })['catch'](function () {
        return atom.notifications.addError('Cannot find named destination ' + namedDest + '.');
      });
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
  }, {
    key: 'binaryView',
    get: function get() {
      return this.hasClass('binary-view');
    },
    set: function set(enabled) {
      var container = this.container[0];
      if (!!enabled === this.binaryView) {
        return;
      }
      if (!this.binaryViewEditor) {
        var _require6 = require('atom');

        var TextBuffer = _require6.TextBuffer;
        var TextEditor = _require6.TextEditor;

        var buffer = TextBuffer.loadSync(this.filePath);
        this.binaryViewEditor = new TextEditor({ buffer: buffer, readOnly: true });
      }
      if (enabled) {
        this.addClass('binary-view');
        for (var el of Array.from(container.children)) {
          container.removeChild(el);
          this.pdfViewElements.push(el);
        }
        container.appendChild(this.binaryViewEditor.element);
      } else {
        this.removeClass('binary-view');
        container.removeChild(this.binaryViewEditor.element);
        while (this.pdfViewElements.length) {
          container.appendChild(this.pdfViewElements.shift());
        }
      }
    }
  }]);

  return PdfEditorView;
})(ScrollView);

exports['default'] = PdfEditorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1lZGl0b3Itdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUVVLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7SUFBaEQsQ0FBQyxZQUFELENBQUM7SUFBRSxVQUFVLFlBQVYsVUFBVTs7Z0JBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEIsS0FBSyxhQUFMLEtBQUs7O0FBQ1YsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7Z0JBQ1csT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEQsSUFBSSxhQUFKLElBQUk7SUFBRSxVQUFVLGFBQVYsVUFBVTtJQUFFLG1CQUFtQixhQUFuQixtQkFBbUI7O2dCQUN6QixPQUFPLENBQUMsVUFBVSxDQUFDOztJQUEvQixRQUFRLGFBQVIsUUFBUTs7QUFDYixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFM0IsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsSUFBSSxFQUFDLENBQUM7QUFDcEUsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7QUFDckQsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztBQUN4RyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxrQ0FBa0MsQ0FBQyxHQUFDLEdBQUcsQ0FBQzs7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QUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvQyxtQkFBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQixjQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMvQjtBQUNELGlCQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUN0RCxNQUNJO0FBQ0gsWUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckQsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUNsQyxtQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDckQ7T0FDRjtLQUNGOzs7U0F4TmtCLGFBQWE7R0FBUyxVQUFVOztxQkFBaEMsYUFBYSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQgeyQsIFNjcm9sbFZpZXd9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKTtcbmxldCB7UG9pbnR9ID0gcmVxdWlyZSgnYXRvbScpO1xubGV0IGZzID0gcmVxdWlyZSgnZnMtcGx1cycpO1xubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5sZXQgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUtcGx1cycpO1xubGV0IHtGaWxlLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcbmxldCB7RnVuY3Rpb259ID0gcmVxdWlyZSgnbG9vcGhvbGUnKTtcbmdsb2JhbC5GdW5jdGlvbiA9IEZ1bmN0aW9uO1xuXG5nbG9iYWwuUERGSlMgPSB7d29ya2VyU3JjOiBcInRlbXBcIiwgY01hcFVybDpcInRlbXBcIiwgY01hcFBhY2tlZDp0cnVlfTtcbnJlcXVpcmUoJy4vLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvYnVpbGQvcGRmLmpzJyk7XG5QREZKUy53b3JrZXJTcmMgPSBcImZpbGU6Ly9cIiArIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvYnVpbGQvcGRmLndvcmtlci5qc1wiKTtcblBERkpTLmNNYXBVcmwgPSBcImZpbGU6Ly9cIiArIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vbm9kZV9tb2R1bGVzL3BkZmpzLWRpc3QvY21hcHNcIikrXCIvXCI7XG5sZXQge2V4ZWMsIGV4ZWNGaWxlfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGRmRWRpdG9yVmlldyBleHRlbmRzIFNjcm9sbFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7Y2xhc3M6ICdwZGYtdmlldycsIHRhYmluZGV4OiAtMX0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHtvdXRsZXQ6ICdjb250YWluZXInLCBzdHlsZTogJ3Bvc2l0aW9uOiByZWxhdGl2ZSd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVQYXRoLCBzY2FsZSA9IG51bGwsIHNjcm9sbFRvcCA9IDAsIHNjcm9sbExlZnQgPSAwKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY3VycmVudFNjYWxlID0gc2NhbGUgPyBzY2FsZSA6IDEuNTtcbiAgICB0aGlzLmRlZmF1bHRTY2FsZSA9IDEuNTtcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gMTAuMDtcbiAgICB0aGlzLmZpdFRvV2lkdGhPbk9wZW4gPSAhc2NhbGUgJiYgYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5maXRUb1dpZHRoT25PcGVuJyk7XG5cbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgdGhpcy5maWxlID0gbmV3IEZpbGUodGhpcy5maWxlUGF0aCk7XG4gICAgdGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUgPSBzY3JvbGxUb3A7XG4gICAgdGhpcy5zY3JvbGxMZWZ0QmVmb3JlVXBkYXRlID0gc2Nyb2xsTGVmdDtcbiAgICB0aGlzLmNhbnZhc2VzID0gW107XG4gICAgdGhpcy51cGRhdGluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVQZGYodHJ1ZSk7XG5cbiAgICB0aGlzLnBkZlZpZXdFbGVtZW50cyA9IFtdO1xuICAgIHRoaXMuYmluYXJ5Vmlld0VkaXRvciA9IG51bGw7XG5cbiAgICB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyID0gMDtcbiAgICB0aGlzLnRvdGFsUGFnZU51bWJlciA9IDA7XG4gICAgdGhpcy5jZW50ZXJzQmV0d2VlblBhZ2VzID0gW107XG4gICAgdGhpcy5wYWdlSGVpZ2h0cyA9IFtdO1xuICAgIHRoaXMubWF4UGFnZVdpZHRoID0gMDtcbiAgICB0aGlzLnRvU2NhbGVGYWN0b3IgPSAxLjA7XG4gICAgdGhpcy5kcmFnZ2luZyA9IG51bGw7XG5cbiAgICBsZXQgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgbGV0IG5lZWRzVXBkYXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgICB0aGlzLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlUGRmKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRvZ2dsZU5pZ2h0TW9kZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXROaWdodE1vZGUoKTtcbiAgICB9XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3BkZi12aWV3Lm5pZ2h0TW9kZScsIHRvZ2dsZU5pZ2h0TW9kZUNhbGxiYWNrKSk7XG4gICAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdwZGYtdmlldy5yZXZlcnNlU3luY0JlaGF2aW91cicsIG5lZWRzVXBkYXRlQ2FsbGJhY2spKTtcblxuICAgIGRpc3Bvc2FibGVzLmFkZCh0aGlzLmZpbGUub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuYXV0b1JlbG9hZE9uVXBkYXRlJykpIHtcbiAgICAgICAgbmVlZHNVcGRhdGVDYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maWxlVXBkYXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgbGV0IGF1dG9SZWxvYWREaXNwb3NhYmxlO1xuICAgIGxldCBzZXR1cEF1dG9SZWxvYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoIWF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuYXV0b1JlbG9hZE9uVXBkYXRlJykpIHtcbiAgICAgICAgYXV0b1JlbG9hZERpc3Bvc2FibGUgPSBhdG9tLndvcmtzcGFjZS5vbkRpZE9wZW4oKGUpID0+IHtcbiAgICAgICAgICBpZiAoZS5pdGVtID09IHRoaXMgJiYgdGhpcy5maWxlVXBkYXRlZCkge1xuICAgICAgICAgICAgdGhpcy5maWxlVXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgbmVlZHNVcGRhdGVDYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihhdXRvUmVsb2FkRGlzcG9zYWJsZSkge1xuICAgICAgICAgIGRpc3Bvc2FibGVzLnJlbW92ZShhdXRvUmVsb2FkRGlzcG9zYWJsZSk7XG4gICAgICAgICAgYXV0b1JlbG9hZERpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsZVVwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLmZpbGVVcGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgbmVlZHNVcGRhdGVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdwZGYtdmlldy5hdXRvUmVsb2FkT25VcGRhdGUnLCBzZXR1cEF1dG9SZWxvYWQpKTtcblxuICAgIGxldCBtb3ZlTGVmdENhbGxiYWNrID0gKCgpID0+IHRoaXMuc2Nyb2xsTGVmdCh0aGlzLnNjcm9sbExlZnQoKSAtICQod2luZG93KS53aWR0aCgpIC8gMjApKTtcbiAgICBsZXQgbW92ZVJpZ2h0Q2FsbGJhY2sgPSAoKCkgPT4gdGhpcy5zY3JvbGxSaWdodCh0aGlzLnNjcm9sbFJpZ2h0KCkgKyAkKHdpbmRvdykud2lkdGgoKSAvIDIwKSk7XG4gICAgbGV0IHNjcm9sbENhbGxiYWNrID0gKCgpID0+IHRoaXMub25TY3JvbGwoKSk7XG4gICAgbGV0IHJlc2l6ZUhhbmRsZXIgPSAoKCkgPT4gdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpKTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKCcucGRmLXZpZXcnLCB7XG4gICAgICAnY29yZTptb3ZlLWxlZnQnOiBtb3ZlTGVmdENhbGxiYWNrLFxuICAgICAgJ2NvcmU6bW92ZS1yaWdodCc6IG1vdmVSaWdodENhbGxiYWNrXG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdzY3JvbGwnLCBzY3JvbGxDYWxsYmFjayk7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcbiAgICBcbiAgICBkaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgc2Nyb2xsQ2FsbGJhY2spO1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG4gICAgfSkpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3BkZi12aWV3Onpvb20tZml0JzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgICAgdGhpcy56b29tRml0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6em9vbS1pbic6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgICAgIHRoaXMuem9vbUluKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6em9vbS1vdXQnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLnpvb21PdXQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpyZXNldC16b29tJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgICAgdGhpcy5yZXNldFpvb20oKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpnby10by1uZXh0LXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLmdvVG9OZXh0UGFnZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OmdvLXRvLXByZXZpb3VzLXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLmdvVG9QcmV2aW91c1BhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpyZWxvYWQnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGRmKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5iaW5hcnlWaWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuc2ltcGxlQ2xpY2sgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnNjcm9sbFRvcCh0aGlzLmRyYWdnaW5nLnNjcm9sbFRvcCAtIChlLnNjcmVlblkgLSB0aGlzLmRyYWdnaW5nLnkpKTtcbiAgICAgICAgdGhpcy5zY3JvbGxMZWZ0KHRoaXMuZHJhZ2dpbmcuc2Nyb2xsTGVmdCAtIChlLnNjcmVlblggLSB0aGlzLmRyYWdnaW5nLngpKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uTW91c2VVcCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5iaW5hcnlWaWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgJChkb2N1bWVudCkudW5iaW5kKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICQoZG9jdW1lbnQpLnVuYmluZCgnbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zaW1wbGVDbGljayA9IHRydWU7XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzKS5hY3RpdmF0ZSgpO1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHt4OiBlLnNjcmVlblgsIHk6IGUuc2NyZWVuWSwgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcCgpLCBzY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbExlZnQoKX07XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ21vdXNld2hlZWwnLCAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuYmluYXJ5Vmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCkge1xuICAgICAgICAgIHRoaXMuem9vbUluKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPCAwKSB7XG4gICAgICAgICAgdGhpcy56b29tT3V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBiaW5hcnlWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLmhhc0NsYXNzKCdiaW5hcnktdmlldycpO1xuICB9XG5cbiAgc2V0IGJpbmFyeVZpZXcoZW5hYmxlZCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyWzBdO1xuICAgIGlmICghIWVuYWJsZWQgPT09IHRoaXMuYmluYXJ5Vmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuYmluYXJ5Vmlld0VkaXRvcikge1xuICAgICAgY29uc3Qge1RleHRCdWZmZXIsIFRleHRFZGl0b3J9ID0gcmVxdWlyZSgnYXRvbScpO1xuICAgICAgY29uc3QgYnVmZmVyID0gVGV4dEJ1ZmZlci5sb2FkU3luYyh0aGlzLmZpbGVQYXRoKTtcbiAgICAgIHRoaXMuYmluYXJ5Vmlld0VkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHtidWZmZXIsIHJlYWRPbmx5OiB0cnVlfSk7XG4gICAgfVxuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdiaW5hcnktdmlldycpO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgdGhpcy5wZGZWaWV3RWxlbWVudHMucHVzaChlbCk7XG4gICAgICB9XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iaW5hcnlWaWV3RWRpdG9yLmVsZW1lbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2JpbmFyeS12aWV3Jyk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5iaW5hcnlWaWV3RWRpdG9yLmVsZW1lbnQpO1xuICAgICAgd2hpbGUgKHRoaXMucGRmVmlld0VsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wZGZWaWV3RWxlbWVudHMuc2hpZnQoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuICF0aGlzLmJpbmFyeVZpZXcgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gdGhpcztcbiAgfVxuXG4gIHNldE5pZ2h0TW9kZSgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5uaWdodE1vZGUnKSkge1xuICAgICAgdGhpcy5hZGRDbGFzcygnbmlnaHQtbW9kZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKCduaWdodC1tb2RlJyk7XG4gICAgfVxuICB9XG5cbiAgcmV2ZXJzZVN5bmMocGFnZSwgZSkge1xuICAgIGlmICh0aGlzLnNpbXBsZUNsaWNrKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICBsZXQgdmlld3BvcnQgPSBwZGZQYWdlLmdldFZpZXdwb3J0KHRoaXMuY3VycmVudFNjYWxlKTtcbiAgICAgICAgbGV0IHgseTtcbiAgICAgICAgW3gseV0gPSB2aWV3cG9ydC5jb252ZXJ0VG9QZGZQb2ludChlLm9mZnNldFgsICQodGhpcy5jYW52YXNlc1twYWdlIC0gMV0pLmhlaWdodCgpIC0gZS5vZmZzZXRZKTtcblxuICAgICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIHN0ZG91dCA9IHN0ZG91dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBsaW5lIG9mIHN0ZG91dC5zcGxpdCgnXFxuJykpIHtcbiAgICAgICAgICAgICAgbGV0IG0gPSBsaW5lLm1hdGNoKC9eKFthLXpBLVpdKik6KC4qKSQvKVxuICAgICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW21bMV1dID0gbVsyXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmlsZSA9IGF0dHJzLklucHV0O1xuICAgICAgICAgICAgbGV0IGxpbmUgPSBhdHRycy5MaW5lO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSAmJiBsaW5lKSB7XG4gICAgICAgICAgICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgICAgICAgICAgICBsZXQgcGF0aFRvT3BlbiA9IHBhdGgubm9ybWFsaXplKGF0dHJzLklucHV0KTtcbiAgICAgICAgICAgICAgbGV0IGxpbmVUb09wZW4gPSArYXR0cnMuTGluZTtcbiAgICAgICAgICAgICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgZWRpdG9yIG9mIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSA9PT0gcGF0aFRvT3Blbikge1xuICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IFBvaW50KGxpbmVUb09wZW4tMSwgLTEpO1xuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KTtcbiAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKTtcbiAgICAgICAgICAgICAgICAgIGxldCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yKTtcbiAgICAgICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcik7XG4gICAgICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgIGxldCBwYW5lb3B0ID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5wYW5lVG9Vc2VJblN5bmN0ZXgnKVxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aFRvT3Blbiwge2luaXRpYWxMaW5lOiBsaW5lVG9PcGVuLCBpbml0aWFsQ29sdW1uOiAwLCBzcGxpdDogcGFuZW9wdH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBzeW5jdGV4UGF0aCA9IGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuc3luY1RlWFBhdGgnKTtcbiAgICAgICAgbGV0IGNsaWNrc3BlYyA9IFtwYWdlLCB4LCB5LCB0aGlzLmZpbGVQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgICAgaWYgKHN5bmN0ZXhQYXRoKSB7XG4gICAgICAgICAgZXhlY0ZpbGUoc3luY3RleFBhdGgsIFtcImVkaXRcIiwgXCItb1wiLCBjbGlja3NwZWNdLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IGVkaXQgLW8gXCIke2NsaWNrc3BlY31cImA7XG4gICAgICAgICAgZXhlYyhjbWQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZm9yd2FyZFN5bmModGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgICAgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlID0ge1xuICAgICAgICAgIHRleFBhdGgsXG4gICAgICAgICAgbGluZU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgc3Rkb3V0ID0gc3Rkb3V0LnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgZm9yIChsZXQgbGluZSBvZiBzdGRvdXQuc3BsaXQoJ1xcbicpKSB7XG4gICAgICAgICAgICBsZXQgbSA9IGxpbmUubWF0Y2goL14oW2EtekEtWl0qKTooLiopJC8pXG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICBpZiAobVsxXSBpbiBhdHRycykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgYXR0cnNbbVsxXV0gPSBtWzJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBwYWdlID0gcGFyc2VJbnQoYXR0cnMuUGFnZSk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFnZSA+IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHZpZXdwb3J0ID0gcGRmUGFnZS5nZXRWaWV3cG9ydCh0aGlzLmN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNlc1twYWdlIC0gMV07XG5cbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VGbG9hdChhdHRycy54KTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VGbG9hdChhdHRycy55KTtcbiAgICAgICAgICAgIFt4LCB5XSA9IHZpZXdwb3J0LmNvbnZlcnRUb1ZpZXdwb3J0UG9pbnQoeCwgeSk7XG5cbiAgICAgICAgICAgIHggPSB4ICsgY2FudmFzLm9mZnNldExlZnQ7XG4gICAgICAgICAgICB5ID0gdmlld3BvcnQuaGVpZ2h0IC0geSArIGNhbnZhcy5vZmZzZXRUb3A7XG5cbiAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5VGhyZXNob2xkID0gNTA7XG5cbiAgICAgICAgICAgIC8vIFNjcm9sbFxuICAgICAgICAgICAgaWYgKHkgPCB0aGlzLnNjcm9sbFRvcCgpICsgdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCh5IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHkgPiB0aGlzLnNjcm9sbEJvdHRvbSgpIC0gdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbEJvdHRvbSh5ICsgdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4IDwgdGhpcy5zY3JvbGxMZWZ0KCkgKyB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGVmdCh4IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHggPiB0aGlzLnNjcm9sbFJpZ2h0KCkgLSB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm90dG9tKHggKyB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyBoaWdobGlnaHRlclxuICAgICAgICAgICAgJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICBjbGFzczogXCJ0ZXgtaGlnaGxpZ2h0XCIsXG4gICAgICAgICAgICAgIHN0eWxlOiBgdG9wOiAke3l9cHg7IGxlZnQ6ICR7eH1weDtgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAgICAgLm9uKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN5bmN0ZXhQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5zeW5jVGVYUGF0aCcpO1xuICAgICAgbGV0IGlucHV0c3BlYyA9IFtsaW5lTnVtYmVyLCAwLCB0ZXhQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgIGlmIChzeW5jdGV4UGF0aCkge1xuICAgICAgICBleGVjRmlsZShzeW5jdGV4UGF0aCwgW1widmlld1wiLCBcIi1pXCIsIGlucHV0c3BlYywgXCItb1wiLCB0aGlzLmZpbGVQYXRoXSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IHZpZXcgLWkgXCIke2lucHV0c3BlY31cIiAtbyBcIiR7dGhpcy5maWxlUGF0aH1cImA7XG4gICAgICAgIGV4ZWMoY21kLCBjYWxsYmFjayk7XG4gICAgICB9XG4gIH1cblxuXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudXBkYXRpbmcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9wQmVmb3JlVXBkYXRlID0gdGhpcy5zY3JvbGxUb3AoKTtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSA9IHRoaXMuc2Nyb2xsTGVmdCgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0Q3VycmVudFBhZ2VOdW1iZXIoKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRQYWdlTnVtYmVyKCkge1xuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCB8fCB0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2VudGVyID0gKHRoaXMuc2Nyb2xsQm90dG9tKCkgKyB0aGlzLnNjcm9sbFRvcCgpKS8yLjBcbiAgICB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyID0gMVxuXG4gICAgaWYgKHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5wYWdlSGVpZ2h0cy5sZW5ndGggPT09IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpXG4gICAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcysxKSkge1xuICAgICAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMucHVzaCh0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDAsIHBkZlBhZ2VOdW1iZXIpLnJlZHVjZSgoKHgseSkgPT4geCArIHkpLCAwKSArIHBkZlBhZ2VOdW1iZXIgKiAyMCAtIDEwKTtcbiAgICAgIH1cblxuICAgIGZvciAobGV0IHBkZlBhZ2VOdW1iZXIgb2YgXy5yYW5nZSgyLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKzEpKSB7XG4gICAgICBpZiAoY2VudGVyID49IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTJdICYmIGNlbnRlciA8IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTFdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgPSBwZGZQYWdlTnVtYmVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3BkZi12aWV3OmN1cnJlbnQtcGFnZS11cGRhdGUnKSk7XG4gIH1cblxuICBmaW5pc2hVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLm5lZWRzVXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBkZigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50b1NjYWxlRmFjdG9yICE9IDEpIHtcbiAgICAgIHRoaXMuYWRqdXN0U2l6ZSgxKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpXG4gICAgICBkZWxldGUgdGhpcy5zY3JvbGxUb1BhZ2VBZnRlclVwZGF0ZVxuICAgIH1cbiAgICBpZiAodGhpcy5zY3JvbGxUb05hbWVkRGVzdEFmdGVyVXBkYXRlKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvTmFtZWREZXN0KHRoaXMuc2Nyb2xsVG9OYW1lZERlc3RBZnRlclVwZGF0ZSlcbiAgICAgIGRlbGV0ZSB0aGlzLnNjcm9sbFRvTmFtZWREZXN0QWZ0ZXJVcGRhdGVcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9yd2FyZFN5bmNBZnRlclVwZGF0ZSkge1xuICAgICAgdGhpcy5mb3J3YXJkU3luYyh0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGUudGV4UGF0aCwgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlLmxpbmVOdW1iZXIpXG4gICAgICBkZWxldGUgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGRmKGNsb3NlT25FcnJvciA9IGZhbHNlKSB7XG4gICAgdGhpcy5uZWVkc1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBkZkRhdGEgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHBkZkRhdGEgPSBuZXcgVWludDhBcnJheShmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuXG4gICAgbGV0IHJldmVyc2VTeW5jQ2xpY2t0eXBlID0gbnVsbFxuICAgIHN3aXRjaChhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LnJldmVyc2VTeW5jQmVoYXZpb3VyJykpIHtcbiAgICAgIGNhc2UgJ0NsaWNrJzpcbiAgICAgICAgcmV2ZXJzZVN5bmNDbGlja3R5cGUgPSAnY2xpY2snXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdEb3VibGUgY2xpY2snOlxuICAgICAgICByZXZlcnNlU3luY0NsaWNrdHlwZSA9ICdkYmxjbGljaydcbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICB0aGlzLnNldE5pZ2h0TW9kZSgpO1xuXG4gICAgUERGSlMuZ2V0RG9jdW1lbnQocGRmRGF0YSkudGhlbigocGRmRG9jdW1lbnQpID0+IHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoXCJjYW52YXNcIikucmVtb3ZlKCk7XG4gICAgICB0aGlzLmNhbnZhc2VzID0gW107XG4gICAgICB0aGlzLnBhZ2VIZWlnaHRzID0gW107XG5cbiAgICAgIHRoaXMucGRmRG9jdW1lbnQgPSBwZGZEb2N1bWVudDtcbiAgICAgIHRoaXMudG90YWxQYWdlTnVtYmVyID0gdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcztcblxuICAgICAgZm9yIChsZXQgcGRmUGFnZU51bWJlciBvZiBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMrMSkpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9ICQoXCI8Y2FudmFzLz5cIiwge2NsYXNzOiBcInBhZ2UtY29udGFpbmVyXCJ9KS5hcHBlbmRUbyh0aGlzLmNvbnRhaW5lcilbMF07XG4gICAgICAgIHRoaXMuY2FudmFzZXMucHVzaChjYW52YXMpO1xuICAgICAgICB0aGlzLnBhZ2VIZWlnaHRzLnB1c2goMCk7XG4gICAgICAgIGlmIChyZXZlcnNlU3luY0NsaWNrdHlwZSkge1xuICAgICAgICAgICQoY2FudmFzKS5vbihyZXZlcnNlU3luY0NsaWNrdHlwZSwgKGUpID0+IHRoaXMucmV2ZXJzZVN5bmMocGRmUGFnZU51bWJlciwgZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWF4UGFnZVdpZHRoID0gMDtcblxuICAgICAgaWYgKHRoaXMuZml0VG9XaWR0aE9uT3Blbikge1xuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+XG4gICAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT5cbiAgICAgICAgICAgICAgcGRmUGFnZS5nZXRWaWV3cG9ydCgxLjApLndpZHRoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLnRoZW4oKHBkZlBhZ2VXaWR0aHMpID0+IHtcbiAgICAgICAgICB0aGlzLm1heFBhZ2VXaWR0aCA9IE1hdGgubWF4KC4uLnBkZlBhZ2VXaWR0aHMpO1xuICAgICAgICAgIHRoaXMucmVuZGVyUGRmKCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlclBkZigpO1xuICAgICAgfVxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmIChjbG9zZU9uRXJyb3IpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMuZmlsZVBhdGggKyBcIiBpcyBub3QgYSBQREYgZmlsZS5cIik7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRoaXMpLmRlc3Ryb3lJdGVtKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5pc2hVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlclBkZihzY3JvbGxBZnRlclJlbmRlciA9IHRydWUpIHtcbiAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMgPSBbXTtcblxuICAgIGlmICh0aGlzLmZpdFRvV2lkdGhPbk9wZW4pIHtcbiAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gdGhpc1swXS5jbGllbnRXaWR0aCAvIHRoaXMubWF4UGFnZVdpZHRoO1xuICAgICAgdGhpcy5maXRUb1dpZHRoT25PcGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwoXG4gICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+IHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzZXNbcGRmUGFnZU51bWJlciAtIDFdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQodGhpcy5jdXJyZW50U2NhbGUpO1xuICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBsZXQgb3V0cHV0U2NhbGUgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQpICogb3V0cHV0U2NhbGU7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gTWF0aC5mbG9vcih2aWV3cG9ydC53aWR0aCkgKiBvdXRwdXRTY2FsZTtcblxuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWCA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWSA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuc2NhbGUob3V0cHV0U2NhbGUsIG91dHB1dFNjYWxlKTtcbiAgICAgICAgICBjb250ZXh0Ll90cmFuc2Zvcm1NYXRyaXggPSBbb3V0cHV0U2NhbGUsIDAsIDAsIG91dHB1dFNjYWxlLCAwLCAwXTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBNYXRoLmZsb29yKHZpZXdwb3J0LndpZHRoKSArICdweCc7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KSArICdweCc7XG5cbiAgICAgICAgICB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXIgLSAxXSA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KTtcblxuICAgICAgICAgIHJldHVybiBwZGZQYWdlLnJlbmRlcih7Y2FudmFzQ29udGV4dDogY29udGV4dCwgdmlld3BvcnQ6IHZpZXdwb3J0fSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApLnRoZW4oKHJlbmRlclRhc2tzKSA9PiB7XG4gICAgICBpZiAoc2Nyb2xsQWZ0ZXJSZW5kZXIpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb3AodGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUpO1xuICAgICAgICB0aGlzLnNjcm9sbExlZnQodGhpcy5zY3JvbGxMZWZ0QmVmb3JlVXBkYXRlKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpO1xuICAgICAgfVxuICAgICAgUHJvbWlzZS5hbGwocmVuZGVyVGFza3MpLnRoZW4oKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gICAgfSwgKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gIH1cblxuICBjb21wdXRlTWF4UGFnZVdpZHRoQW5kVHJ5Wm9vbUZpdCgpe1xuICAgIFByb21pc2UuYWxsKFxuICAgICAgXy5yYW5nZSgxLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzICsgMSkubWFwKChwZGZQYWdlTnVtYmVyKSA9PlxuICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT5cbiAgICAgICAgICBwZGZQYWdlLmdldFZpZXdwb3J0KDEuMCkud2lkdGhcbiAgICAgICAgKVxuICAgICAgKVxuICAgICkudGhlbigocGRmUGFnZVdpZHRocykgPT4ge1xuICAgICAgdGhpcy5tYXhQYWdlV2lkdGggPSBNYXRoLm1heCguLi5wZGZQYWdlV2lkdGhzKTtcbiAgICAgIHRoaXMuem9vbUZpdCgpO1xuICAgIH0pXG4gIH1cblxuICB6b29tRml0KCkge1xuICAgIGlmICh0aGlzLm1heFBhZ2VXaWR0aCA9PSAwKSB7XG4gICAgICB0aGlzLmNvbXB1dGVNYXhQYWdlV2lkdGhBbmRUcnlab29tRml0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBmaXRTY2FsZSA9IHRoaXNbMF0uY2xpZW50V2lkdGggLyB0aGlzLm1heFBhZ2VXaWR0aDtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKGZpdFNjYWxlIC8gKHRoaXMuY3VycmVudFNjYWxlICogIHRoaXMudG9TY2FsZUZhY3RvcikpO1xuICB9XG5cbiAgem9vbU91dCgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKDEwMCAvICgxMDAgKyB0aGlzLnNjYWxlRmFjdG9yKSk7XG4gIH1cblxuICB6b29tSW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRqdXN0U2l6ZSgoMTAwICsgdGhpcy5zY2FsZUZhY3RvcikgLyAxMDApO1xuICB9XG5cbiAgcmVzZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLmFkanVzdFNpemUodGhpcy5kZWZhdWx0U2NhbGUgLyB0aGlzLmN1cnJlbnRTY2FsZSk7XG4gIH1cblxuICBnb1RvTmV4dFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgKyAxKTtcbiAgfVxuXG4gIGdvVG9QcmV2aW91c1BhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgLSAxKTtcbiAgfVxuXG4gIGNvbXB1dGVab29tZWRTY3JvbGxUb3Aob2xkU2Nyb2xsVG9wLCBvbGRQYWdlSGVpZ2h0cykge1xuICAgIGxldCBwaXhlbHNUb1pvb20gPSAwO1xuICAgIGxldCBzcGFjZXNUb1NraXAgPSAwO1xuICAgIGxldCB6b29tZWRQaXhlbHMgPSAwO1xuXG4gICAgZm9yIChsZXQgcGRmUGFnZU51bWJlciBvZiBfLnJhbmdlKDAsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpKSB7XG4gICAgICBpZiAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwICsgb2xkUGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl0gPiBvbGRTY3JvbGxUb3ApIHtcbiAgICAgICAgem9vbUZhY3RvckZvclBhZ2UgPSB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdIC8gb2xkUGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl07XG4gICAgICAgIGxldCBwYXJ0T2ZQYWdlQWJvdmVVcHBlckJvcmRlciA9IG9sZFNjcm9sbFRvcCAtIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXApO1xuICAgICAgICB6b29tZWRQaXhlbHMgKz0gTWF0aC5yb3VuZChwYXJ0T2ZQYWdlQWJvdmVVcHBlckJvcmRlciAqIHpvb21GYWN0b3JGb3JQYWdlKTtcbiAgICAgICAgcGl4ZWxzVG9ab29tICs9IHBhcnRPZlBhZ2VBYm92ZVVwcGVyQm9yZGVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpeGVsc1RvWm9vbSArPSBvbGRQYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXTtcbiAgICAgICAgem9vbWVkUGl4ZWxzICs9IHRoaXMucGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl07XG4gICAgICB9XG5cbiAgICAgIGlmIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXAgKyAyMCA+IG9sZFNjcm9sbFRvcCkge1xuICAgICAgICBsZXQgcGFydE9mUGFkZGluZ0Fib3ZlVXBwZXJCb3JkZXIgPSBvbGRTY3JvbGxUb3AgLSAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwKTtcbiAgICAgICAgc3BhY2VzVG9Ta2lwICs9IHBhcnRPZlBhZGRpbmdBYm92ZVVwcGVyQm9yZGVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYWNlc1RvU2tpcCArPSAyMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gem9vbWVkUGl4ZWxzICsgc3BhY2VzVG9Ta2lwO1xuICB9XG5cbiAgYWRqdXN0U2l6ZShmYWN0b3IpIHtcbiAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmYWN0b3IgPSB0aGlzLnRvU2NhbGVGYWN0b3IgKiBmYWN0b3I7XG5cbiAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgdGhpcy50b1NjYWxlRmFjdG9yID0gZmFjdG9yO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuICAgIHRoaXMudG9TY2FsZUZhY3RvciA9IDE7XG5cbiAgICBsZXQgb2xkU2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3AoKTtcbiAgICBsZXQgb2xkUGFnZUhlaWdodHMgPSB0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDApO1xuICAgIHRoaXMuY3VycmVudFNjYWxlID0gdGhpcy5jdXJyZW50U2NhbGUgKiBmYWN0b3I7XG4gICAgdGhpcy5yZW5kZXJQZGYoZmFsc2UpO1xuXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBsZXQgbmV3U2Nyb2xsVG9wID0gdGhpcy5jb21wdXRlWm9vbWVkU2Nyb2xsVG9wKG9sZFNjcm9sbFRvcCwgb2xkUGFnZUhlaWdodHMpO1xuICAgICAgdGhpcy5zY3JvbGxUb3AobmV3U2Nyb2xsVG9wKTtcbiAgICB9KTtcblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgbGV0IG5ld1Njcm9sbExlZnQgPSB0aGlzLnNjcm9sbExlZnQoKSAqIGZhY3RvcjtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdChuZXdTY3JvbGxMZWZ0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRQYWdlTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyO1xuICB9XG5cbiAgZ2V0VG90YWxQYWdlTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZU51bWJlcjtcbiAgfVxuXG4gIHNjcm9sbFRvUGFnZShwZGZQYWdlTnVtYmVyKSB7XG4gICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUgPSBwZGZQYWdlTnVtYmVyXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQgfHwgaXNOYU4ocGRmUGFnZU51bWJlcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwZGZQYWdlTnVtYmVyID0gTWF0aC5taW4ocGRmUGFnZU51bWJlciwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcyk7XG4gICAgcGFnZVNjcm9sbFBvc2l0aW9uID0gKHRoaXMucGFnZUhlaWdodHMuc2xpY2UoMCwgKHBkZlBhZ2VOdW1iZXItMSkpLnJlZHVjZSgoKHgseSkgPT4geCt5KSwgMCkpICsgKHBkZlBhZ2VOdW1iZXIgLSAxKSAqIDIwXG5cbiAgICByZXR1cm4gdGhpcy5zY3JvbGxUb3AocGFnZVNjcm9sbFBvc2l0aW9uKTtcbiAgfVxuXG4gIHNjcm9sbFRvTmFtZWREZXN0KG5hbWVkRGVzdCkge1xuICAgIGlmICh0aGlzLnVwZGF0aW5nKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvTmFtZWREZXN0QWZ0ZXJVcGRhdGUgPSBuYW1lZERlc3RcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5wZGZEb2N1bWVudC5nZXREZXN0aW5hdGlvbihuYW1lZERlc3QpXG4gICAgICAudGhlbihkZXN0UmVmID0+IHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZUluZGV4KGRlc3RSZWZbMF0pKVxuICAgICAgLnRoZW4ocGFnZU51bWJlciA9PiB0aGlzLnNjcm9sbFRvUGFnZShwYWdlTnVtYmVyICsgMSkpXG4gICAgICAuY2F0Y2goKCkgPT4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDYW5ub3QgZmluZCBuYW1lZCBkZXN0aW5hdGlvbiAke25hbWVkRGVzdH0uYCkpXG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgc2NhbGU6IHRoaXMuY3VycmVudFNjYWxlLFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSxcbiAgICAgIHNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSxcbiAgICAgIGRlc2VyaWFsaXplcjogJ1BkZkVkaXRvckRlc2VyaWFsaXplcidcbiAgICB9O1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ3VudGl0bGVkJztcbiAgICB9XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGg7XG4gIH1cblxuICBnZXRQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXRhY2goKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlVGl0bGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IG51bGwpO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VNb2RpZmllZCgpIHtcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4gbnVsbCk7XG4gIH1cbn1cbiJdfQ==
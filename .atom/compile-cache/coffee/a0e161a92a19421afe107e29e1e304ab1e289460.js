(function() {
  var ColorBufferElement, CompositeDisposable, Emitter, EventsDelegation, nextHighlightId, ref, ref1, registerOrUpdateElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-utils'), registerOrUpdateElement = ref.registerOrUpdateElement, EventsDelegation = ref.EventsDelegation;

  ref1 = [], Emitter = ref1[0], CompositeDisposable = ref1[1];

  nextHighlightId = 0;

  ColorBufferElement = (function(superClass) {
    extend(ColorBufferElement, superClass);

    function ColorBufferElement() {
      return ColorBufferElement.__super__.constructor.apply(this, arguments);
    }

    EventsDelegation.includeInto(ColorBufferElement);

    ColorBufferElement.prototype.createdCallback = function() {
      var ref2, ref3;
      if (Emitter == null) {
        ref2 = require('atom'), Emitter = ref2.Emitter, CompositeDisposable = ref2.CompositeDisposable;
      }
      ref3 = [0, 0], this.editorScrollLeft = ref3[0], this.editorScrollTop = ref3[1];
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.displayedMarkers = [];
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return this.viewsByMarkers = new WeakMap;
    };

    ColorBufferElement.prototype.attachedCallback = function() {
      this.attached = true;
      return this.update();
    };

    ColorBufferElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    ColorBufferElement.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    ColorBufferElement.prototype.getModel = function() {
      return this.colorBuffer;
    };

    ColorBufferElement.prototype.setModel = function(colorBuffer) {
      this.colorBuffer = colorBuffer;
      this.editor = this.colorBuffer.editor;
      if (this.editor.isDestroyed()) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(this.colorBuffer.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          return _this.usedMarkers.forEach(function(marker) {
            var ref2;
            if ((ref2 = marker.colorMarker) != null) {
              ref2.invalidateScreenRangeCache();
            }
            return marker.checkScreenRange();
          });
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeSelectionRange((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.maxDecorationsInGutter', (function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          _this.initializeNativeDecorations(type);
          return _this.previousType = type;
        };
      })(this)));
      this.subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          return _this.attach();
        };
      })(this)));
      return this.subscriptions.add(this.editorElement.onDidDetach((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)));
    };

    ColorBufferElement.prototype.attach = function() {
      var ref2;
      if (this.parentNode != null) {
        return;
      }
      if (this.editorElement == null) {
        return;
      }
      return (ref2 = this.getEditorRoot().querySelector('.lines')) != null ? ref2.appendChild(this) : void 0;
    };

    ColorBufferElement.prototype.detach = function() {
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    ColorBufferElement.prototype.destroy = function() {
      this.detach();
      this.subscriptions.dispose();
      this.destroyNativeDecorations();
      return this.colorBuffer = null;
    };

    ColorBufferElement.prototype.update = function() {
      if (this.isGutterType()) {
        return this.updateGutterDecorations();
      } else {
        return this.updateHighlightDecorations(this.previousType);
      }
    };

    ColorBufferElement.prototype.getEditorRoot = function() {
      return this.editorElement;
    };

    ColorBufferElement.prototype.isGutterType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'gutter' || type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.isDotType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.initializeNativeDecorations = function(type) {
      this.destroyNativeDecorations();
      if (this.isGutterType(type)) {
        return this.initializeGutter(type);
      } else {
        return this.updateHighlightDecorations(type);
      }
    };

    ColorBufferElement.prototype.destroyNativeDecorations = function() {
      if (this.isGutterType()) {
        return this.destroyGutter();
      } else {
        return this.destroyHighlightDecorations();
      }
    };

    ColorBufferElement.prototype.updateHighlightDecorations = function(type) {
      var className, i, j, len, len1, m, markers, markersByRows, maxRowLength, ref2, ref3, ref4, ref5, style;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.styleByMarkerId == null) {
        this.styleByMarkerId = {};
      }
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      markers = this.colorBuffer.getValidColorMarkers();
      ref2 = this.displayedMarkers;
      for (i = 0, len = ref2.length; i < len; i++) {
        m = ref2[i];
        if (!(indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((ref3 = this.decorationByMarkerId[m.id]) != null) {
          ref3.destroy();
        }
        this.removeChild(this.styleByMarkerId[m.id]);
        delete this.styleByMarkerId[m.id];
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (((ref4 = m.color) != null ? ref4.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0) {
          ref5 = this.getHighlighDecorationCSS(m, type), className = ref5.className, style = ref5.style;
          this.appendChild(style);
          this.styleByMarkerId[m.id] = style;
          if (type === 'native-background') {
            this.decorationByMarkerId[m.id] = this.editor.decorateMarker(m.marker, {
              type: 'text',
              "class": "pigments-" + type + " " + className
            });
          } else {
            this.decorationByMarkerId[m.id] = this.editor.decorateMarker(m.marker, {
              type: 'highlight',
              "class": "pigments-" + type + " " + className
            });
          }
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.destroyHighlightDecorations = function() {
      var deco, id, ref2;
      ref2 = this.decorationByMarkerId;
      for (id in ref2) {
        deco = ref2[id];
        if (this.styleByMarkerId[id] != null) {
          this.removeChild(this.styleByMarkerId[id]);
        }
        deco.destroy();
      }
      delete this.decorationByMarkerId;
      delete this.styleByMarkerId;
      return this.displayedMarkers = [];
    };

    ColorBufferElement.prototype.getHighlighDecorationCSS = function(marker, type) {
      var className, l, style;
      className = "pigments-highlight-" + (nextHighlightId++);
      style = document.createElement('style');
      l = marker.color.luma;
      if (type === 'native-background') {
        style.innerHTML = "." + className + " {\n  background-color: " + (marker.color.toCSS()) + ";\n  background-image:\n    linear-gradient(to bottom, " + (marker.color.toCSS()) + " 0%, " + (marker.color.toCSS()) + " 100%),\n    url(atom://pigments/resources/transparent-background.png);\n  color: " + (l > 0.43 ? 'black' : 'white') + ";\n}";
      } else if (type === 'native-underline') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n  background-image:\n    linear-gradient(to bottom, " + (marker.color.toCSS()) + " 0%, " + (marker.color.toCSS()) + " 100%),\n    url(atom://pigments/resources/transparent-background.png);\n}";
      } else if (type === 'native-outline') {
        style.innerHTML = "." + className + " .region {\n  border-color: " + (marker.color.toCSS()) + ";\n}";
      }
      return {
        className: className,
        style: style
      };
    };

    ColorBufferElement.prototype.initializeGutter = function(type) {
      var gutterContainer, options;
      options = {
        name: "pigments-" + type
      };
      if (type !== 'gutter') {
        options.priority = 1000;
      }
      this.gutter = this.editor.addGutter(options);
      this.displayedMarkers = [];
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      gutterContainer = this.getEditorRoot().querySelector('.gutter-container');
      this.gutterSubscription = new CompositeDisposable;
      this.gutterSubscription.add(this.subscribeTo(gutterContainer, {
        mousedown: (function(_this) {
          return function(e) {
            var colorMarker, markerId, targetDecoration;
            targetDecoration = e.path[0];
            if (!targetDecoration.matches('span')) {
              targetDecoration = targetDecoration.querySelector('span');
            }
            if (targetDecoration == null) {
              return;
            }
            markerId = targetDecoration.dataset.markerId;
            colorMarker = _this.displayedMarkers.filter(function(m) {
              return m.id === Number(markerId);
            })[0];
            if (!((colorMarker != null) && (_this.colorBuffer != null))) {
              return;
            }
            return _this.colorBuffer.selectColorMarkerAndOpenPicker(colorMarker);
          };
        })(this)
      }));
      if (this.isDotType(type)) {
        this.gutterSubscription.add(this.editorElement.onDidChangeScrollLeft((function(_this) {
          return function() {
            return requestAnimationFrame(function() {
              return _this.updateDotDecorationsOffsets(_this.editorElement.getFirstVisibleScreenRow(), _this.editorElement.getLastVisibleScreenRow());
            });
          };
        })(this)));
        this.gutterSubscription.add(this.editorElement.onDidChangeScrollTop((function(_this) {
          return function() {
            return requestAnimationFrame(function() {
              return _this.updateDotDecorationsOffsets(_this.editorElement.getFirstVisibleScreenRow(), _this.editorElement.getLastVisibleScreenRow());
            });
          };
        })(this)));
        this.gutterSubscription.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            if (Array.isArray(changes)) {
              return changes != null ? changes.forEach(function(change) {
                return _this.updateDotDecorationsOffsets(change.start.row, change.newExtent.row);
              }) : void 0;
            } else if ((changes.start != null) && (changes.newExtent != null)) {
              return _this.updateDotDecorationsOffsets(changes.start.row, changes.newExtent.row);
            }
          };
        })(this)));
      }
      return this.updateGutterDecorations(type);
    };

    ColorBufferElement.prototype.destroyGutter = function() {
      var decoration, id, ref2;
      try {
        this.gutter.destroy();
      } catch (error) {}
      this.gutterSubscription.dispose();
      this.displayedMarkers = [];
      ref2 = this.decorationByMarkerId;
      for (id in ref2) {
        decoration = ref2[id];
        decoration.destroy();
      }
      delete this.decorationByMarkerId;
      return delete this.gutterSubscription;
    };

    ColorBufferElement.prototype.updateGutterDecorations = function(type) {
      var deco, decoWidth, i, j, len, len1, m, markers, markersByRows, maxDecorationsInGutter, maxRowLength, ref2, ref3, ref4, row, rowLength, scrollLeft;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.getValidColorMarkers();
      ref2 = this.displayedMarkers;
      for (i = 0, len = ref2.length; i < len; i++) {
        m = ref2[i];
        if (!(indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((ref3 = this.decorationByMarkerId[m.id]) != null) {
          ref3.destroy();
        }
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      scrollLeft = this.editorElement.getScrollLeft();
      maxDecorationsInGutter = atom.config.get('pigments.maxDecorationsInGutter');
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (((ref4 = m.color) != null ? ref4.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0) {
          this.decorationByMarkerId[m.id] = this.gutter.decorateMarker(m.marker, {
            type: 'gutter',
            "class": 'pigments-gutter-marker',
            item: this.getGutterDecorationItem(m)
          });
        }
        deco = this.decorationByMarkerId[m.id];
        row = m.marker.getStartScreenPosition().row;
        if (markersByRows[row] == null) {
          markersByRows[row] = 0;
        }
        if (markersByRows[row] >= maxDecorationsInGutter) {
          continue;
        }
        rowLength = 0;
        if (type !== 'gutter') {
          try {
            rowLength = this.editorElement.pixelPositionForScreenPosition([row, 2e308]).left;
          } catch (error) {}
        }
        decoWidth = 14;
        deco.properties.item.style.left = ((rowLength + markersByRows[row] * decoWidth) - scrollLeft) + "px";
        markersByRows[row]++;
        maxRowLength = Math.max(maxRowLength, markersByRows[row]);
      }
      if (type === 'gutter') {
        atom.views.getView(this.gutter).style.minWidth = (maxRowLength * decoWidth) + "px";
      } else {
        atom.views.getView(this.gutter).style.width = "0px";
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.updateDotDecorationsOffsets = function(rowStart, rowEnd) {
      var deco, decoWidth, i, m, markerRow, markersByRows, ref2, ref3, results, row, rowLength, scrollLeft;
      markersByRows = {};
      scrollLeft = this.editorElement.getScrollLeft();
      results = [];
      for (row = i = ref2 = rowStart, ref3 = rowEnd; ref2 <= ref3 ? i <= ref3 : i >= ref3; row = ref2 <= ref3 ? ++i : --i) {
        results.push((function() {
          var j, len, ref4, results1;
          ref4 = this.displayedMarkers;
          results1 = [];
          for (j = 0, len = ref4.length; j < len; j++) {
            m = ref4[j];
            deco = this.decorationByMarkerId[m.id];
            if (m.marker == null) {
              continue;
            }
            markerRow = m.marker.getStartScreenPosition().row;
            if (row !== markerRow) {
              continue;
            }
            if (markersByRows[row] == null) {
              markersByRows[row] = 0;
            }
            rowLength = this.editorElement.pixelPositionForScreenPosition([row, 2e308]).left;
            decoWidth = 14;
            deco.properties.item.style.left = ((rowLength + markersByRows[row] * decoWidth) - scrollLeft) + "px";
            results1.push(markersByRows[row]++);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    ColorBufferElement.prototype.getGutterDecorationItem = function(marker) {
      var div;
      div = document.createElement('div');
      div.innerHTML = "<span style='background-image: linear-gradient(to bottom, " + (marker.color.toCSS()) + " 0%, " + (marker.color.toCSS()) + " 100%), url(atom://pigments/resources/transparent-background.png);' data-marker-id='" + marker.id + "'></span>";
      return div;
    };

    ColorBufferElement.prototype.requestSelectionUpdate = function() {
      if (this.updateRequested) {
        return;
      }
      this.updateRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateRequested = false;
          if (_this.editor.getBuffer().isDestroyed()) {
            return;
          }
          return _this.updateSelections();
        };
      })(this));
    };

    ColorBufferElement.prototype.updateSelections = function() {
      var decoration, i, len, marker, ref2, results;
      if (this.editor.isDestroyed()) {
        return;
      }
      ref2 = this.displayedMarkers;
      results = [];
      for (i = 0, len = ref2.length; i < len; i++) {
        marker = ref2[i];
        decoration = this.decorationByMarkerId[marker.id];
        if (decoration != null) {
          results.push(this.hideDecorationIfInSelection(marker, decoration));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ColorBufferElement.prototype.hideDecorationIfInSelection = function(marker, decoration) {
      var classes, i, len, markerRange, props, range, selection, selections;
      selections = this.editor.getSelections();
      props = decoration.getProperties();
      classes = props["class"].split(/\s+/g);
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          if (classes[0].match(/-in-selection$/) == null) {
            classes[0] += '-in-selection';
          }
          props["class"] = classes.join(' ');
          decoration.setProperties(props);
          return;
        }
      }
      classes = classes.map(function(cls) {
        return cls.replace('-in-selection', '');
      });
      props["class"] = classes.join(' ');
      return decoration.setProperties(props);
    };

    ColorBufferElement.prototype.hideMarkerIfInSelectionOrFold = function(marker, view) {
      var i, len, markerRange, range, results, selection, selections;
      selections = this.editor.getSelections();
      results = [];
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          view.classList.add('hidden');
        }
        if (this.editor.isFoldedAtBufferRow(marker.getBufferRange().start.row)) {
          results.push(view.classList.add('in-fold'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ColorBufferElement.prototype.colorMarkerForMouseEvent = function(event) {
      var bufferPosition, position;
      position = this.screenPositionForMouseEvent(event);
      if (position == null) {
        return;
      }
      bufferPosition = this.colorBuffer.editor.bufferPositionForScreenPosition(position);
      return this.colorBuffer.getColorMarkerAtBufferPosition(bufferPosition);
    };

    ColorBufferElement.prototype.screenPositionForMouseEvent = function(event) {
      var pixelPosition;
      pixelPosition = this.pixelPositionForMouseEvent(event);
      if (pixelPosition == null) {
        return;
      }
      if (this.editorElement.screenPositionForPixelPosition != null) {
        return this.editorElement.screenPositionForPixelPosition(pixelPosition);
      } else {
        return this.editor.screenPositionForPixelPosition(pixelPosition);
      }
    };

    ColorBufferElement.prototype.pixelPositionForMouseEvent = function(event) {
      var clientX, clientY, left, ref2, rootElement, scrollTarget, top;
      clientX = event.clientX, clientY = event.clientY;
      scrollTarget = this.editorElement.getScrollTop != null ? this.editorElement : this.editor;
      rootElement = this.getEditorRoot();
      if (rootElement.querySelector('.lines') == null) {
        return;
      }
      ref2 = rootElement.querySelector('.lines').getBoundingClientRect(), top = ref2.top, left = ref2.left;
      top = clientY - top + scrollTarget.getScrollTop();
      left = clientX - left + scrollTarget.getScrollLeft();
      return {
        top: top,
        left: left
      };
    };

    return ColorBufferElement;

  })(HTMLElement);

  module.exports = ColorBufferElement = registerOrUpdateElement('pigments-markers', ColorBufferElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItYnVmZmVyLWVsZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSx1SEFBQTtJQUFBOzs7O0VBQUEsTUFBOEMsT0FBQSxDQUFRLFlBQVIsQ0FBOUMsRUFBQyxxREFBRCxFQUEwQjs7RUFFMUIsT0FBaUMsRUFBakMsRUFBQyxpQkFBRCxFQUFVOztFQUVWLGVBQUEsR0FBa0I7O0VBRVo7Ozs7Ozs7SUFDSixnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixrQkFBN0I7O2lDQUVBLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxJQUFPLGVBQVA7UUFDRSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLHNCQUFELEVBQVUsK0NBRFo7O01BR0EsT0FBd0MsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF4QyxFQUFDLElBQUMsQ0FBQSwwQkFBRixFQUFvQixJQUFDLENBQUE7TUFDckIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxhQUFELEdBQWlCO2FBQ2pCLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUk7SUFWUDs7aUNBWWpCLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBQyxDQUFBLFFBQUQsR0FBWTthQUNaLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGZ0I7O2lDQUlsQixnQkFBQSxHQUFrQixTQUFBO2FBQ2hCLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFESTs7aUNBR2xCLFdBQUEsR0FBYSxTQUFDLFFBQUQ7YUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFFBQTFCO0lBRFc7O2lDQUdiLFFBQUEsR0FBVSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUo7O2lDQUVWLFFBQUEsR0FBVSxTQUFDLFdBQUQ7TUFBQyxJQUFDLENBQUEsY0FBRDtNQUNSLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxZQUFYO01BQ0YsSUFBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQSxDQUFWO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCO01BRWpCLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUFBLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0I7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyx1QkFBYixDQUFxQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBVyxDQUFDLFlBQWIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDckMsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLFNBQUMsTUFBRDtBQUNuQixnQkFBQTs7a0JBQWtCLENBQUUsMEJBQXBCLENBQUE7O21CQUNBLE1BQU0sQ0FBQyxnQkFBUCxDQUFBO1VBRm1CLENBQXJCO1FBRHFDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUFuQjtNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN4QyxLQUFDLENBQUEsc0JBQUQsQ0FBQTtRQUR3QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzNDLEtBQUMsQ0FBQSxzQkFBRCxDQUFBO1FBRDJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDbkQsS0FBQyxDQUFBLHNCQUFELENBQUE7UUFEbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CO01BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUMzQyxLQUFDLENBQUEsc0JBQUQsQ0FBQTtRQUQyQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzlDLEtBQUMsQ0FBQSxzQkFBRCxDQUFBO1FBRDhDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDbkQsS0FBQyxDQUFBLHNCQUFELENBQUE7UUFEbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CO01BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixpQ0FBcEIsRUFBdUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN4RSxLQUFDLENBQUEsTUFBRCxDQUFBO1FBRHdFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxDQUFuQjtNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IscUJBQXBCLEVBQTJDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQzVELEtBQUMsQ0FBQSwyQkFBRCxDQUE2QixJQUE3QjtpQkFDQSxLQUFDLENBQUEsWUFBRCxHQUFnQjtRQUY0QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsQ0FBbkI7TUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxXQUFmLENBQTJCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQW5CO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxhQUFhLENBQUMsV0FBZixDQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFuQjtJQXBDUTs7aUNBc0NWLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQVUsdUJBQVY7QUFBQSxlQUFBOztNQUNBLElBQWMsMEJBQWQ7QUFBQSxlQUFBOztpRkFDd0MsQ0FBRSxXQUExQyxDQUFzRCxJQUF0RDtJQUhNOztpQ0FLUixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQWMsdUJBQWQ7QUFBQSxlQUFBOzthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUF4QjtJQUhNOztpQ0FLUixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSx3QkFBRCxDQUFBO2FBRUEsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUxSOztpQ0FPVCxNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLHVCQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsMEJBQUQsQ0FBNEIsSUFBQyxDQUFBLFlBQTdCLEVBSEY7O0lBRE07O2lDQU1SLGFBQUEsR0FBZSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUo7O2lDQUVmLFlBQUEsR0FBYyxTQUFDLElBQUQ7O1FBQUMsT0FBSyxJQUFDLENBQUE7O2FBQ25CLElBQUEsS0FBUyxRQUFULElBQUEsSUFBQSxLQUFtQixZQUFuQixJQUFBLElBQUEsS0FBaUM7SUFEckI7O2lDQUdkLFNBQUEsR0FBWSxTQUFDLElBQUQ7O1FBQUMsT0FBSyxJQUFDLENBQUE7O2FBQ2pCLElBQUEsS0FBUyxZQUFULElBQUEsSUFBQSxLQUF1QjtJQURiOztpQ0FHWiwyQkFBQSxHQUE2QixTQUFDLElBQUQ7TUFDM0IsSUFBQyxDQUFBLHdCQUFELENBQUE7TUFFQSxJQUFHLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxDQUFIO2VBQ0UsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQWxCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLDBCQUFELENBQTRCLElBQTVCLEVBSEY7O0lBSDJCOztpQ0FRN0Isd0JBQUEsR0FBMEIsU0FBQTtNQUN4QixJQUFHLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBSDtlQUNFLElBQUMsQ0FBQSxhQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsMkJBQUQsQ0FBQSxFQUhGOztJQUR3Qjs7aUNBYzFCLDBCQUFBLEdBQTRCLFNBQUMsSUFBRDtBQUMxQixVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQSxDQUFWO0FBQUEsZUFBQTs7O1FBRUEsSUFBQyxDQUFBLGtCQUFtQjs7O1FBQ3BCLElBQUMsQ0FBQSx1QkFBd0I7O01BRXpCLE9BQUEsR0FBVSxJQUFDLENBQUEsV0FBVyxDQUFDLG9CQUFiLENBQUE7QUFFVjtBQUFBLFdBQUEsc0NBQUE7O2NBQWdDLGFBQVMsT0FBVCxFQUFBLENBQUE7Ozs7Y0FDSCxDQUFFLE9BQTdCLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFDLENBQUMsRUFBRixDQUE5QjtRQUNBLE9BQU8sSUFBQyxDQUFBLGVBQWdCLENBQUEsQ0FBQyxDQUFDLEVBQUY7UUFDeEIsT0FBTyxJQUFDLENBQUEsb0JBQXFCLENBQUEsQ0FBQyxDQUFDLEVBQUY7QUFKL0I7TUFNQSxhQUFBLEdBQWdCO01BQ2hCLFlBQUEsR0FBZTtBQUVmLFdBQUEsMkNBQUE7O1FBQ0Usb0NBQVUsQ0FBRSxPQUFULENBQUEsV0FBQSxJQUF1QixhQUFTLElBQUMsQ0FBQSxnQkFBVixFQUFBLENBQUEsS0FBMUI7VUFDRSxPQUFxQixJQUFDLENBQUEsd0JBQUQsQ0FBMEIsQ0FBMUIsRUFBNkIsSUFBN0IsQ0FBckIsRUFBQywwQkFBRCxFQUFZO1VBQ1osSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiO1VBQ0EsSUFBQyxDQUFBLGVBQWdCLENBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBakIsR0FBeUI7VUFDekIsSUFBRyxJQUFBLEtBQVEsbUJBQVg7WUFDRSxJQUFDLENBQUEsb0JBQXFCLENBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBdEIsR0FBOEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLENBQUMsQ0FBQyxNQUF6QixFQUFpQztjQUM3RCxJQUFBLEVBQU0sTUFEdUQ7Y0FFN0QsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFBLEdBQVksSUFBWixHQUFpQixHQUFqQixHQUFvQixTQUZrQzthQUFqQyxFQURoQztXQUFBLE1BQUE7WUFNRSxJQUFDLENBQUEsb0JBQXFCLENBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBdEIsR0FBOEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLENBQUMsQ0FBQyxNQUF6QixFQUFpQztjQUM3RCxJQUFBLEVBQU0sV0FEdUQ7Y0FFN0QsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFBLEdBQVksSUFBWixHQUFpQixHQUFqQixHQUFvQixTQUZrQzthQUFqQyxFQU5oQztXQUpGOztBQURGO01BZ0JBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjthQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxZQUFkO0lBbEMwQjs7aUNBb0M1QiwyQkFBQSxHQUE2QixTQUFBO0FBQzNCLFVBQUE7QUFBQTtBQUFBLFdBQUEsVUFBQTs7UUFDRSxJQUFzQyxnQ0FBdEM7VUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxlQUFnQixDQUFBLEVBQUEsQ0FBOUIsRUFBQTs7UUFDQSxJQUFJLENBQUMsT0FBTCxDQUFBO0FBRkY7TUFJQSxPQUFPLElBQUMsQ0FBQTtNQUNSLE9BQU8sSUFBQyxDQUFBO2FBQ1IsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBUE87O2lDQVM3Qix3QkFBQSxHQUEwQixTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ3hCLFVBQUE7TUFBQSxTQUFBLEdBQVkscUJBQUEsR0FBcUIsQ0FBQyxlQUFBLEVBQUQ7TUFDakMsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCO01BQ1IsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUM7TUFFakIsSUFBRyxJQUFBLEtBQVEsbUJBQVg7UUFDRSxLQUFLLENBQUMsU0FBTixHQUFrQixHQUFBLEdBQ2YsU0FEZSxHQUNMLDBCQURLLEdBRUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBRkgsR0FFeUIseURBRnpCLEdBSWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBSmQsR0FJb0MsT0FKcEMsR0FJMEMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBSjFDLEdBSWdFLG9GQUpoRSxHQU1SLENBQUksQ0FBQSxHQUFJLElBQVAsR0FBaUIsT0FBakIsR0FBOEIsT0FBL0IsQ0FOUSxHQU0rQixPQVBuRDtPQUFBLE1BVUssSUFBRyxJQUFBLEtBQVEsa0JBQVg7UUFDSCxLQUFLLENBQUMsU0FBTixHQUFrQixHQUFBLEdBQ2YsU0FEZSxHQUNMLGtDQURLLEdBRUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBRkgsR0FFeUIseURBRnpCLEdBSWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBSmQsR0FJb0MsT0FKcEMsR0FJMEMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBSjFDLEdBSWdFLDZFQUwvRTtPQUFBLE1BU0EsSUFBRyxJQUFBLEtBQVEsZ0JBQVg7UUFDSCxLQUFLLENBQUMsU0FBTixHQUFrQixHQUFBLEdBQ2YsU0FEZSxHQUNMLDhCQURLLEdBRUQsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsQ0FBQSxDQUFELENBRkMsR0FFcUIsT0FIcEM7O2FBT0w7UUFBQyxXQUFBLFNBQUQ7UUFBWSxPQUFBLEtBQVo7O0lBL0J3Qjs7aUNBeUMxQixnQkFBQSxHQUFrQixTQUFDLElBQUQ7QUFDaEIsVUFBQTtNQUFBLE9BQUEsR0FBVTtRQUFBLElBQUEsRUFBTSxXQUFBLEdBQVksSUFBbEI7O01BQ1YsSUFBMkIsSUFBQSxLQUFVLFFBQXJDO1FBQUEsT0FBTyxDQUFDLFFBQVIsR0FBbUIsS0FBbkI7O01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBa0IsT0FBbEI7TUFDVixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7O1FBQ3BCLElBQUMsQ0FBQSx1QkFBd0I7O01BQ3pCLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQjtNQUNsQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSTtNQUUxQixJQUFDLENBQUEsa0JBQWtCLENBQUMsR0FBcEIsQ0FBd0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxlQUFiLEVBQ3RCO1FBQUEsU0FBQSxFQUFXLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDtBQUNULGdCQUFBO1lBQUEsZ0JBQUEsR0FBbUIsQ0FBQyxDQUFDLElBQUssQ0FBQSxDQUFBO1lBRTFCLElBQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxPQUFqQixDQUF5QixNQUF6QixDQUFQO2NBQ0UsZ0JBQUEsR0FBbUIsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsTUFBL0IsRUFEckI7O1lBR0EsSUFBYyx3QkFBZDtBQUFBLHFCQUFBOztZQUVBLFFBQUEsR0FBVyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7WUFDcEMsV0FBQSxHQUFjLEtBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxNQUFsQixDQUF5QixTQUFDLENBQUQ7cUJBQU8sQ0FBQyxDQUFDLEVBQUYsS0FBUSxNQUFBLENBQU8sUUFBUDtZQUFmLENBQXpCLENBQTBELENBQUEsQ0FBQTtZQUV4RSxJQUFBLENBQUEsQ0FBYyxxQkFBQSxJQUFpQiwyQkFBL0IsQ0FBQTtBQUFBLHFCQUFBOzttQkFFQSxLQUFDLENBQUEsV0FBVyxDQUFDLDhCQUFiLENBQTRDLFdBQTVDO1VBYlM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7T0FEc0IsQ0FBeEI7TUFnQkEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsQ0FBSDtRQUNFLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsYUFBYSxDQUFDLHFCQUFmLENBQXFDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQzNELHFCQUFBLENBQXNCLFNBQUE7cUJBQ3BCLEtBQUMsQ0FBQSwyQkFBRCxDQUE2QixLQUFDLENBQUEsYUFBYSxDQUFDLHdCQUFmLENBQUEsQ0FBN0IsRUFBd0UsS0FBQyxDQUFBLGFBQWEsQ0FBQyx1QkFBZixDQUFBLENBQXhFO1lBRG9CLENBQXRCO1VBRDJEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxDQUF4QjtRQUlBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsYUFBYSxDQUFDLG9CQUFmLENBQW9DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQzFELHFCQUFBLENBQXNCLFNBQUE7cUJBQ3BCLEtBQUMsQ0FBQSwyQkFBRCxDQUE2QixLQUFDLENBQUEsYUFBYSxDQUFDLHdCQUFmLENBQUEsQ0FBN0IsRUFBd0UsS0FBQyxDQUFBLGFBQWEsQ0FBQyx1QkFBZixDQUFBLENBQXhFO1lBRG9CLENBQXRCO1VBRDBEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUF4QjtRQUlBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxPQUFEO1lBQzFDLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLENBQUg7dUNBQ0UsT0FBTyxDQUFFLE9BQVQsQ0FBaUIsU0FBQyxNQUFEO3VCQUNmLEtBQUMsQ0FBQSwyQkFBRCxDQUE2QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQTFDLEVBQStDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBaEU7Y0FEZSxDQUFqQixXQURGO2FBQUEsTUFJSyxJQUFHLHVCQUFBLElBQW1CLDJCQUF0QjtxQkFDSCxLQUFDLENBQUEsMkJBQUQsQ0FBNkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUEzQyxFQUFnRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxFLEVBREc7O1VBTHFDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUF4QixFQVRGOzthQWlCQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsSUFBekI7SUEzQ2dCOztpQ0E2Q2xCLGFBQUEsR0FBZSxTQUFBO0FBQ2IsVUFBQTtBQUFBO1FBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFBSjtPQUFBO01BQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUE7TUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7QUFDcEI7QUFBQSxXQUFBLFVBQUE7O1FBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBQTtBQUFBO01BQ0EsT0FBTyxJQUFDLENBQUE7YUFDUixPQUFPLElBQUMsQ0FBQTtJQU5LOztpQ0FRZix1QkFBQSxHQUF5QixTQUFDLElBQUQ7QUFDdkIsVUFBQTs7UUFEd0IsT0FBSyxJQUFDLENBQUE7O01BQzlCLElBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUEsQ0FBVjtBQUFBLGVBQUE7O01BRUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFXLENBQUMsb0JBQWIsQ0FBQTtBQUVWO0FBQUEsV0FBQSxzQ0FBQTs7Y0FBZ0MsYUFBUyxPQUFULEVBQUEsQ0FBQTs7OztjQUNILENBQUUsT0FBN0IsQ0FBQTs7UUFDQSxPQUFPLElBQUMsQ0FBQSxvQkFBcUIsQ0FBQSxDQUFDLENBQUMsRUFBRjtBQUYvQjtNQUlBLGFBQUEsR0FBZ0I7TUFDaEIsWUFBQSxHQUFlO01BQ2YsVUFBQSxHQUFhLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUFBO01BQ2Isc0JBQUEsR0FBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtBQUV6QixXQUFBLDJDQUFBOztRQUNFLG9DQUFVLENBQUUsT0FBVCxDQUFBLFdBQUEsSUFBdUIsYUFBUyxJQUFDLENBQUEsZ0JBQVYsRUFBQSxDQUFBLEtBQTFCO1VBQ0UsSUFBQyxDQUFBLG9CQUFxQixDQUFBLENBQUMsQ0FBQyxFQUFGLENBQXRCLEdBQThCLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixDQUFDLENBQUMsTUFBekIsRUFBaUM7WUFDN0QsSUFBQSxFQUFNLFFBRHVEO1lBRTdELENBQUEsS0FBQSxDQUFBLEVBQU8sd0JBRnNEO1lBRzdELElBQUEsRUFBTSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsQ0FBekIsQ0FIdUQ7V0FBakMsRUFEaEM7O1FBT0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxvQkFBcUIsQ0FBQSxDQUFDLENBQUMsRUFBRjtRQUM3QixHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBVCxDQUFBLENBQWlDLENBQUM7O1VBQ3hDLGFBQWMsQ0FBQSxHQUFBLElBQVE7O1FBRXRCLElBQVksYUFBYyxDQUFBLEdBQUEsQ0FBZCxJQUFzQixzQkFBbEM7QUFBQSxtQkFBQTs7UUFFQSxTQUFBLEdBQVk7UUFFWixJQUFHLElBQUEsS0FBVSxRQUFiO0FBQ0U7WUFDRSxTQUFBLEdBQVksSUFBQyxDQUFBLGFBQWEsQ0FBQyw4QkFBZixDQUE4QyxDQUFDLEdBQUQsRUFBTSxLQUFOLENBQTlDLENBQThELENBQUMsS0FEN0U7V0FBQSxpQkFERjs7UUFJQSxTQUFBLEdBQVk7UUFFWixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBM0IsR0FBb0MsQ0FBQyxDQUFDLFNBQUEsR0FBWSxhQUFjLENBQUEsR0FBQSxDQUFkLEdBQXFCLFNBQWxDLENBQUEsR0FBK0MsVUFBaEQsQ0FBQSxHQUEyRDtRQUUvRixhQUFjLENBQUEsR0FBQSxDQUFkO1FBQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxHQUFMLENBQVMsWUFBVCxFQUF1QixhQUFjLENBQUEsR0FBQSxDQUFyQztBQXpCakI7TUEyQkEsSUFBRyxJQUFBLEtBQVEsUUFBWDtRQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsTUFBcEIsQ0FBMkIsQ0FBQyxLQUFLLENBQUMsUUFBbEMsR0FBK0MsQ0FBQyxZQUFBLEdBQWUsU0FBaEIsQ0FBQSxHQUEwQixLQUQzRTtPQUFBLE1BQUE7UUFHRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCLENBQTJCLENBQUMsS0FBSyxDQUFDLEtBQWxDLEdBQTBDLE1BSDVDOztNQUtBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjthQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxZQUFkO0lBL0N1Qjs7aUNBaUR6QiwyQkFBQSxHQUE2QixTQUFDLFFBQUQsRUFBVyxNQUFYO0FBQzNCLFVBQUE7TUFBQSxhQUFBLEdBQWdCO01BQ2hCLFVBQUEsR0FBYSxJQUFDLENBQUEsYUFBYSxDQUFDLGFBQWYsQ0FBQTtBQUViO1dBQVcsOEdBQVg7OztBQUNFO0FBQUE7ZUFBQSxzQ0FBQTs7WUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBLG9CQUFxQixDQUFBLENBQUMsQ0FBQyxFQUFGO1lBQzdCLElBQWdCLGdCQUFoQjtBQUFBLHVCQUFBOztZQUNBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFULENBQUEsQ0FBaUMsQ0FBQztZQUM5QyxJQUFnQixHQUFBLEtBQU8sU0FBdkI7QUFBQSx1QkFBQTs7O2NBRUEsYUFBYyxDQUFBLEdBQUEsSUFBUTs7WUFFdEIsU0FBQSxHQUFZLElBQUMsQ0FBQSxhQUFhLENBQUMsOEJBQWYsQ0FBOEMsQ0FBQyxHQUFELEVBQU0sS0FBTixDQUE5QyxDQUE4RCxDQUFDO1lBRTNFLFNBQUEsR0FBWTtZQUVaLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUEzQixHQUFvQyxDQUFDLENBQUMsU0FBQSxHQUFZLGFBQWMsQ0FBQSxHQUFBLENBQWQsR0FBcUIsU0FBbEMsQ0FBQSxHQUErQyxVQUFoRCxDQUFBLEdBQTJEOzBCQUMvRixhQUFjLENBQUEsR0FBQSxDQUFkO0FBYkY7OztBQURGOztJQUoyQjs7aUNBb0I3Qix1QkFBQSxHQUF5QixTQUFDLE1BQUQ7QUFDdkIsVUFBQTtNQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNOLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLDREQUFBLEdBQzJDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFiLENBQUEsQ0FBRCxDQUQzQyxHQUNpRSxPQURqRSxHQUN1RSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixDQUFBLENBQUQsQ0FEdkUsR0FDNkYsc0ZBRDdGLEdBQ21MLE1BQU0sQ0FBQyxFQUQxTCxHQUM2TDthQUU3TTtJQUx1Qjs7aUNBZXpCLHNCQUFBLEdBQXdCLFNBQUE7TUFDdEIsSUFBVSxJQUFDLENBQUEsZUFBWDtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLGVBQUQsR0FBbUI7YUFDbkIscUJBQUEsQ0FBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BCLEtBQUMsQ0FBQSxlQUFELEdBQW1CO1VBQ25CLElBQVUsS0FBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxXQUFwQixDQUFBLENBQVY7QUFBQSxtQkFBQTs7aUJBQ0EsS0FBQyxDQUFBLGdCQUFELENBQUE7UUFIb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO0lBSnNCOztpQ0FTeEIsZ0JBQUEsR0FBa0IsU0FBQTtBQUNoQixVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQSxDQUFWO0FBQUEsZUFBQTs7QUFDQTtBQUFBO1dBQUEsc0NBQUE7O1FBQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSxvQkFBcUIsQ0FBQSxNQUFNLENBQUMsRUFBUDtRQUVuQyxJQUFvRCxrQkFBcEQ7dUJBQUEsSUFBQyxDQUFBLDJCQUFELENBQTZCLE1BQTdCLEVBQXFDLFVBQXJDLEdBQUE7U0FBQSxNQUFBOytCQUFBOztBQUhGOztJQUZnQjs7aUNBT2xCLDJCQUFBLEdBQTZCLFNBQUMsTUFBRCxFQUFTLFVBQVQ7QUFDM0IsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQTtNQUViLEtBQUEsR0FBUSxVQUFVLENBQUMsYUFBWCxDQUFBO01BQ1IsT0FBQSxHQUFVLEtBQUssRUFBQyxLQUFELEVBQU0sQ0FBQyxLQUFaLENBQWtCLE1BQWxCO0FBRVYsV0FBQSw0Q0FBQTs7UUFDRSxLQUFBLEdBQVEsU0FBUyxDQUFDLGNBQVYsQ0FBQTtRQUNSLFdBQUEsR0FBYyxNQUFNLENBQUMsY0FBUCxDQUFBO1FBRWQsSUFBQSxDQUFBLENBQWdCLHFCQUFBLElBQWlCLGVBQWpDLENBQUE7QUFBQSxtQkFBQTs7UUFDQSxJQUFHLFdBQVcsQ0FBQyxjQUFaLENBQTJCLEtBQTNCLENBQUg7VUFDRSxJQUFxQywwQ0FBckM7WUFBQSxPQUFRLENBQUEsQ0FBQSxDQUFSLElBQWMsZ0JBQWQ7O1VBQ0EsS0FBSyxFQUFDLEtBQUQsRUFBTCxHQUFjLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYjtVQUNkLFVBQVUsQ0FBQyxhQUFYLENBQXlCLEtBQXpCO0FBQ0EsaUJBSkY7O0FBTEY7TUFXQSxPQUFBLEdBQVUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLEdBQUQ7ZUFBUyxHQUFHLENBQUMsT0FBSixDQUFZLGVBQVosRUFBNkIsRUFBN0I7TUFBVCxDQUFaO01BQ1YsS0FBSyxFQUFDLEtBQUQsRUFBTCxHQUFjLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYjthQUNkLFVBQVUsQ0FBQyxhQUFYLENBQXlCLEtBQXpCO0lBbkIyQjs7aUNBcUI3Qiw2QkFBQSxHQUErQixTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQzdCLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUE7QUFFYjtXQUFBLDRDQUFBOztRQUNFLEtBQUEsR0FBUSxTQUFTLENBQUMsY0FBVixDQUFBO1FBQ1IsV0FBQSxHQUFjLE1BQU0sQ0FBQyxjQUFQLENBQUE7UUFFZCxJQUFBLENBQUEsQ0FBZ0IscUJBQUEsSUFBaUIsZUFBakMsQ0FBQTtBQUFBLG1CQUFBOztRQUVBLElBQWdDLFdBQVcsQ0FBQyxjQUFaLENBQTJCLEtBQTNCLENBQWhDO1VBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFmLENBQW1CLFFBQW5CLEVBQUE7O1FBQ0EsSUFBa0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUFNLENBQUMsY0FBUCxDQUFBLENBQXVCLENBQUMsS0FBSyxDQUFDLEdBQTFELENBQWxDO3VCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixTQUFuQixHQUFBO1NBQUEsTUFBQTsrQkFBQTs7QUFQRjs7SUFINkI7O2lDQTRCL0Isd0JBQUEsR0FBMEIsU0FBQyxLQUFEO0FBQ3hCLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLDJCQUFELENBQTZCLEtBQTdCO01BRVgsSUFBYyxnQkFBZDtBQUFBLGVBQUE7O01BRUEsY0FBQSxHQUFpQixJQUFDLENBQUEsV0FBVyxDQUFDLE1BQU0sQ0FBQywrQkFBcEIsQ0FBb0QsUUFBcEQ7YUFFakIsSUFBQyxDQUFBLFdBQVcsQ0FBQyw4QkFBYixDQUE0QyxjQUE1QztJQVB3Qjs7aUNBUzFCLDJCQUFBLEdBQTZCLFNBQUMsS0FBRDtBQUMzQixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsMEJBQUQsQ0FBNEIsS0FBNUI7TUFFaEIsSUFBYyxxQkFBZDtBQUFBLGVBQUE7O01BRUEsSUFBRyx5REFBSDtlQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsOEJBQWYsQ0FBOEMsYUFBOUMsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsTUFBTSxDQUFDLDhCQUFSLENBQXVDLGFBQXZDLEVBSEY7O0lBTDJCOztpQ0FVN0IsMEJBQUEsR0FBNEIsU0FBQyxLQUFEO0FBQzFCLFVBQUE7TUFBQyx1QkFBRCxFQUFVO01BRVYsWUFBQSxHQUFrQix1Q0FBSCxHQUNiLElBQUMsQ0FBQSxhQURZLEdBR2IsSUFBQyxDQUFBO01BRUgsV0FBQSxHQUFjLElBQUMsQ0FBQSxhQUFELENBQUE7TUFFZCxJQUFjLDJDQUFkO0FBQUEsZUFBQTs7TUFFQSxPQUFjLFdBQVcsQ0FBQyxhQUFaLENBQTBCLFFBQTFCLENBQW1DLENBQUMscUJBQXBDLENBQUEsQ0FBZCxFQUFDLGNBQUQsRUFBTTtNQUNOLEdBQUEsR0FBTSxPQUFBLEdBQVUsR0FBVixHQUFnQixZQUFZLENBQUMsWUFBYixDQUFBO01BQ3RCLElBQUEsR0FBTyxPQUFBLEdBQVUsSUFBVixHQUFpQixZQUFZLENBQUMsYUFBYixDQUFBO2FBQ3hCO1FBQUMsS0FBQSxHQUFEO1FBQU0sTUFBQSxJQUFOOztJQWYwQjs7OztLQXphRzs7RUEwYmpDLE1BQU0sQ0FBQyxPQUFQLEdBQ0Esa0JBQUEsR0FDQSx1QkFBQSxDQUF3QixrQkFBeEIsRUFBNEMsa0JBQWtCLENBQUMsU0FBL0Q7QUFsY0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbntyZWdpc3Rlck9yVXBkYXRlRWxlbWVudCwgRXZlbnRzRGVsZWdhdGlvbn0gPSByZXF1aXJlICdhdG9tLXV0aWxzJ1xuXG5bRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZV0gPSBbXVxuXG5uZXh0SGlnaGxpZ2h0SWQgPSAwXG5cbmNsYXNzIENvbG9yQnVmZmVyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50XG4gIEV2ZW50c0RlbGVnYXRpb24uaW5jbHVkZUludG8odGhpcylcblxuICBjcmVhdGVkQ2FsbGJhY2s6IC0+XG4gICAgdW5sZXNzIEVtaXR0ZXI/XG4gICAgICB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG4gICAgW0BlZGl0b3JTY3JvbGxMZWZ0LCBAZWRpdG9yU2Nyb2xsVG9wXSA9IFswLCAwXVxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3BsYXllZE1hcmtlcnMgPSBbXVxuICAgIEB1c2VkTWFya2VycyA9IFtdXG4gICAgQHVudXNlZE1hcmtlcnMgPSBbXVxuICAgIEB2aWV3c0J5TWFya2VycyA9IG5ldyBXZWFrTWFwXG5cbiAgYXR0YWNoZWRDYWxsYmFjazogLT5cbiAgICBAYXR0YWNoZWQgPSB0cnVlXG4gICAgQHVwZGF0ZSgpXG5cbiAgZGV0YWNoZWRDYWxsYmFjazogLT5cbiAgICBAYXR0YWNoZWQgPSBmYWxzZVxuXG4gIG9uRGlkVXBkYXRlOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC11cGRhdGUnLCBjYWxsYmFja1xuXG4gIGdldE1vZGVsOiAtPiBAY29sb3JCdWZmZXJcblxuICBzZXRNb2RlbDogKEBjb2xvckJ1ZmZlcikgLT5cbiAgICB7QGVkaXRvcn0gPSBAY29sb3JCdWZmZXJcbiAgICByZXR1cm4gaWYgQGVkaXRvci5pc0Rlc3Ryb3llZCgpXG4gICAgQGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcilcblxuICAgIEBjb2xvckJ1ZmZlci5pbml0aWFsaXplKCkudGhlbiA9PiBAdXBkYXRlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JCdWZmZXIub25EaWRVcGRhdGVDb2xvck1hcmtlcnMgPT4gQHVwZGF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvckJ1ZmZlci5vbkRpZERlc3Ryb3kgPT4gQGRlc3Ryb3koKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2UgPT5cbiAgICAgIEB1c2VkTWFya2Vycy5mb3JFYWNoIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb2xvck1hcmtlcj8uaW52YWxpZGF0ZVNjcmVlblJhbmdlQ2FjaGUoKVxuICAgICAgICBtYXJrZXIuY2hlY2tTY3JlZW5SYW5nZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZEFkZEN1cnNvciA9PlxuICAgICAgQHJlcXVlc3RTZWxlY3Rpb25VcGRhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkUmVtb3ZlQ3Vyc29yID0+XG4gICAgICBAcmVxdWVzdFNlbGVjdGlvblVwZGF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiA9PlxuICAgICAgQHJlcXVlc3RTZWxlY3Rpb25VcGRhdGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQWRkU2VsZWN0aW9uID0+XG4gICAgICBAcmVxdWVzdFNlbGVjdGlvblVwZGF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRSZW1vdmVTZWxlY3Rpb24gPT5cbiAgICAgIEByZXF1ZXN0U2VsZWN0aW9uVXBkYXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZVNlbGVjdGlvblJhbmdlID0+XG4gICAgICBAcmVxdWVzdFNlbGVjdGlvblVwZGF0ZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMubWF4RGVjb3JhdGlvbnNJbkd1dHRlcicsID0+XG4gICAgICBAdXBkYXRlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5tYXJrZXJUeXBlJywgKHR5cGUpID0+XG4gICAgICBAaW5pdGlhbGl6ZU5hdGl2ZURlY29yYXRpb25zKHR5cGUpXG4gICAgICBAcHJldmlvdXNUeXBlID0gdHlwZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQXR0YWNoID0+IEBhdHRhY2goKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yRWxlbWVudC5vbkRpZERldGFjaCA9PiBAZGV0YWNoKClcblxuICBhdHRhY2g6IC0+XG4gICAgcmV0dXJuIGlmIEBwYXJlbnROb2RlP1xuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvckVsZW1lbnQ/XG4gICAgQGdldEVkaXRvclJvb3QoKS5xdWVyeVNlbGVjdG9yKCcubGluZXMnKT8uYXBwZW5kQ2hpbGQodGhpcylcblxuICBkZXRhY2g6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAcGFyZW50Tm9kZT9cblxuICAgIEBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGV0YWNoKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZGVzdHJveU5hdGl2ZURlY29yYXRpb25zKClcblxuICAgIEBjb2xvckJ1ZmZlciA9IG51bGxcblxuICB1cGRhdGU6IC0+XG4gICAgaWYgQGlzR3V0dGVyVHlwZSgpXG4gICAgICBAdXBkYXRlR3V0dGVyRGVjb3JhdGlvbnMoKVxuICAgIGVsc2VcbiAgICAgIEB1cGRhdGVIaWdobGlnaHREZWNvcmF0aW9ucyhAcHJldmlvdXNUeXBlKVxuXG4gIGdldEVkaXRvclJvb3Q6IC0+IEBlZGl0b3JFbGVtZW50XG5cbiAgaXNHdXR0ZXJUeXBlOiAodHlwZT1AcHJldmlvdXNUeXBlKSAtPlxuICAgIHR5cGUgaW4gWydndXR0ZXInLCAnbmF0aXZlLWRvdCcsICduYXRpdmUtc3F1YXJlLWRvdCddXG5cbiAgaXNEb3RUeXBlOiAgKHR5cGU9QHByZXZpb3VzVHlwZSkgLT5cbiAgICB0eXBlIGluIFsnbmF0aXZlLWRvdCcsICduYXRpdmUtc3F1YXJlLWRvdCddXG5cbiAgaW5pdGlhbGl6ZU5hdGl2ZURlY29yYXRpb25zOiAodHlwZSkgLT5cbiAgICBAZGVzdHJveU5hdGl2ZURlY29yYXRpb25zKClcblxuICAgIGlmIEBpc0d1dHRlclR5cGUodHlwZSlcbiAgICAgIEBpbml0aWFsaXplR3V0dGVyKHR5cGUpXG4gICAgZWxzZVxuICAgICAgQHVwZGF0ZUhpZ2hsaWdodERlY29yYXRpb25zKHR5cGUpXG5cbiAgZGVzdHJveU5hdGl2ZURlY29yYXRpb25zOiAtPlxuICAgIGlmIEBpc0d1dHRlclR5cGUoKVxuICAgICAgQGRlc3Ryb3lHdXR0ZXIoKVxuICAgIGVsc2VcbiAgICAgIEBkZXN0cm95SGlnaGxpZ2h0RGVjb3JhdGlvbnMoKVxuXG4gICMjICAgIyMgICAgICMjICMjICAjIyMjIyMgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICMjIyMjIyAgICMjICAgICAjIyAjIyMjIyMjI1xuICAjIyAgICMjICAgICAjIyAjIyAjIyAgICAjIyAgIyMgICAgICMjICMjICAgICAgICMjICMjICAgICMjICAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAjIyAgICAgIyMgIyMgIyMgICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAjIyAgICAgICAgIyMgICAgICMjICAgICMjXG4gICMjICAgIyMjIyMjIyMjICMjICMjICAgIyMjIyAjIyMjIyMjIyMgIyMgICAgICAgIyMgIyMgICAjIyMjICMjIyMjIyMjIyAgICAjI1xuICAjIyAgICMjICAgICAjIyAjIyAjIyAgICAjIyAgIyMgICAgICMjICMjICAgICAgICMjICMjICAgICMjICAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAjIyAgICAgIyMgIyMgIyMgICAgIyMgICMjICAgICAjIyAjIyAgICAgICAjIyAjIyAgICAjIyAgIyMgICAgICMjICAgICMjXG4gICMjICAgIyMgICAgICMjICMjICAjIyMjIyMgICAjIyAgICAgIyMgIyMjIyMjIyMgIyMgICMjIyMjIyAgICMjICAgICAjIyAgICAjI1xuXG4gIHVwZGF0ZUhpZ2hsaWdodERlY29yYXRpb25zOiAodHlwZSkgLT5cbiAgICByZXR1cm4gaWYgQGVkaXRvci5pc0Rlc3Ryb3llZCgpXG5cbiAgICBAc3R5bGVCeU1hcmtlcklkID89IHt9XG4gICAgQGRlY29yYXRpb25CeU1hcmtlcklkID89IHt9XG5cbiAgICBtYXJrZXJzID0gQGNvbG9yQnVmZmVyLmdldFZhbGlkQ29sb3JNYXJrZXJzKClcblxuICAgIGZvciBtIGluIEBkaXNwbGF5ZWRNYXJrZXJzIHdoZW4gbSBub3QgaW4gbWFya2Vyc1xuICAgICAgQGRlY29yYXRpb25CeU1hcmtlcklkW20uaWRdPy5kZXN0cm95KClcbiAgICAgIEByZW1vdmVDaGlsZChAc3R5bGVCeU1hcmtlcklkW20uaWRdKVxuICAgICAgZGVsZXRlIEBzdHlsZUJ5TWFya2VySWRbbS5pZF1cbiAgICAgIGRlbGV0ZSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF1cblxuICAgIG1hcmtlcnNCeVJvd3MgPSB7fVxuICAgIG1heFJvd0xlbmd0aCA9IDBcblxuICAgIGZvciBtIGluIG1hcmtlcnNcbiAgICAgIGlmIG0uY29sb3I/LmlzVmFsaWQoKSBhbmQgbSBub3QgaW4gQGRpc3BsYXllZE1hcmtlcnNcbiAgICAgICAge2NsYXNzTmFtZSwgc3R5bGV9ID0gQGdldEhpZ2hsaWdoRGVjb3JhdGlvbkNTUyhtLCB0eXBlKVxuICAgICAgICBAYXBwZW5kQ2hpbGQoc3R5bGUpXG4gICAgICAgIEBzdHlsZUJ5TWFya2VySWRbbS5pZF0gPSBzdHlsZVxuICAgICAgICBpZiB0eXBlIGlzICduYXRpdmUtYmFja2dyb3VuZCdcbiAgICAgICAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF0gPSBAZWRpdG9yLmRlY29yYXRlTWFya2VyKG0ubWFya2VyLCB7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgICAgICAgIGNsYXNzOiBcInBpZ21lbnRzLSN7dHlwZX0gI3tjbGFzc05hbWV9XCJcbiAgICAgICAgICB9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGRlY29yYXRpb25CeU1hcmtlcklkW20uaWRdID0gQGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtLm1hcmtlciwge1xuICAgICAgICAgICAgdHlwZTogJ2hpZ2hsaWdodCdcbiAgICAgICAgICAgIGNsYXNzOiBcInBpZ21lbnRzLSN7dHlwZX0gI3tjbGFzc05hbWV9XCJcbiAgICAgICAgICB9KVxuXG4gICAgQGRpc3BsYXllZE1hcmtlcnMgPSBtYXJrZXJzXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZSdcblxuICBkZXN0cm95SGlnaGxpZ2h0RGVjb3JhdGlvbnM6IC0+XG4gICAgZm9yIGlkLCBkZWNvIG9mIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFxuICAgICAgQHJlbW92ZUNoaWxkKEBzdHlsZUJ5TWFya2VySWRbaWRdKSBpZiBAc3R5bGVCeU1hcmtlcklkW2lkXT9cbiAgICAgIGRlY28uZGVzdHJveSgpXG5cbiAgICBkZWxldGUgQGRlY29yYXRpb25CeU1hcmtlcklkXG4gICAgZGVsZXRlIEBzdHlsZUJ5TWFya2VySWRcbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG5cbiAgZ2V0SGlnaGxpZ2hEZWNvcmF0aW9uQ1NTOiAobWFya2VyLCB0eXBlKSAtPlxuICAgIGNsYXNzTmFtZSA9IFwicGlnbWVudHMtaGlnaGxpZ2h0LSN7bmV4dEhpZ2hsaWdodElkKyt9XCJcbiAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBsID0gbWFya2VyLmNvbG9yLmx1bWFcblxuICAgIGlmIHR5cGUgaXMgJ25hdGl2ZS1iYWNrZ3JvdW5kJ1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAuI3tjbGFzc05hbWV9IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI3ttYXJrZXIuY29sb3IudG9DU1MoKX07XG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6XG4gICAgICAgICAgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI3ttYXJrZXIuY29sb3IudG9DU1MoKX0gMCUsICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9IDEwMCUpLFxuICAgICAgICAgIHVybChhdG9tOi8vcGlnbWVudHMvcmVzb3VyY2VzL3RyYW5zcGFyZW50LWJhY2tncm91bmQucG5nKTtcbiAgICAgICAgY29sb3I6ICN7aWYgbCA+IDAuNDMgdGhlbiAnYmxhY2snIGVsc2UgJ3doaXRlJ307XG4gICAgICB9XG4gICAgICBcIlwiXCJcbiAgICBlbHNlIGlmIHR5cGUgaXMgJ25hdGl2ZS11bmRlcmxpbmUnXG4gICAgICBzdHlsZS5pbm5lckhUTUwgPSBcIlwiXCJcbiAgICAgIC4je2NsYXNzTmFtZX0gLnJlZ2lvbiB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9O1xuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOlxuICAgICAgICAgIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9IDAlLCAje21hcmtlci5jb2xvci50b0NTUygpfSAxMDAlKSxcbiAgICAgICAgICB1cmwoYXRvbTovL3BpZ21lbnRzL3Jlc291cmNlcy90cmFuc3BhcmVudC1iYWNrZ3JvdW5kLnBuZyk7XG4gICAgICB9XG4gICAgICBcIlwiXCJcbiAgICBlbHNlIGlmIHR5cGUgaXMgJ25hdGl2ZS1vdXRsaW5lJ1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAuI3tjbGFzc05hbWV9IC5yZWdpb24ge1xuICAgICAgICBib3JkZXItY29sb3I6ICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9O1xuICAgICAgfVxuICAgICAgXCJcIlwiXG5cbiAgICB7Y2xhc3NOYW1lLCBzdHlsZX1cblxuICAjIyAgICAgIyMjIyMjICAgIyMgICAgICMjICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjICAgIyMjIyAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMjIyMjICAgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgIyMgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAjIyAgICAgICAjIyAgICMjXG4gICMjICAgICMjICAgICMjICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyNcbiAgIyMgICAgICMjIyMjIyAgICAjIyMjIyMjICAgICAjIyAgICAgICAjIyAgICAjIyMjIyMjIyAjIyAgICAgIyNcblxuICBpbml0aWFsaXplR3V0dGVyOiAodHlwZSkgLT5cbiAgICBvcHRpb25zID0gbmFtZTogXCJwaWdtZW50cy0je3R5cGV9XCJcbiAgICBvcHRpb25zLnByaW9yaXR5ID0gMTAwMCBpZiB0eXBlIGlzbnQgJ2d1dHRlcidcblxuICAgIEBndXR0ZXIgPSBAZWRpdG9yLmFkZEd1dHRlcihvcHRpb25zKVxuICAgIEBkaXNwbGF5ZWRNYXJrZXJzID0gW11cbiAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWQgPz0ge31cbiAgICBndXR0ZXJDb250YWluZXIgPSBAZ2V0RWRpdG9yUm9vdCgpLnF1ZXJ5U2VsZWN0b3IoJy5ndXR0ZXItY29udGFpbmVyJylcbiAgICBAZ3V0dGVyU3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBndXR0ZXJTdWJzY3JpcHRpb24uYWRkIEBzdWJzY3JpYmVUbyBndXR0ZXJDb250YWluZXIsXG4gICAgICBtb3VzZWRvd246IChlKSA9PlxuICAgICAgICB0YXJnZXREZWNvcmF0aW9uID0gZS5wYXRoWzBdXG5cbiAgICAgICAgdW5sZXNzIHRhcmdldERlY29yYXRpb24ubWF0Y2hlcygnc3BhbicpXG4gICAgICAgICAgdGFyZ2V0RGVjb3JhdGlvbiA9IHRhcmdldERlY29yYXRpb24ucXVlcnlTZWxlY3Rvcignc3BhbicpXG5cbiAgICAgICAgcmV0dXJuIHVubGVzcyB0YXJnZXREZWNvcmF0aW9uP1xuXG4gICAgICAgIG1hcmtlcklkID0gdGFyZ2V0RGVjb3JhdGlvbi5kYXRhc2V0Lm1hcmtlcklkXG4gICAgICAgIGNvbG9yTWFya2VyID0gQGRpc3BsYXllZE1hcmtlcnMuZmlsdGVyKChtKSAtPiBtLmlkIGlzIE51bWJlcihtYXJrZXJJZCkpWzBdXG5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBjb2xvck1hcmtlcj8gYW5kIEBjb2xvckJ1ZmZlcj9cblxuICAgICAgICBAY29sb3JCdWZmZXIuc2VsZWN0Q29sb3JNYXJrZXJBbmRPcGVuUGlja2VyKGNvbG9yTWFya2VyKVxuXG4gICAgaWYgQGlzRG90VHlwZSh0eXBlKVxuICAgICAgQGd1dHRlclN1YnNjcmlwdGlvbi5hZGQgQGVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxMZWZ0ID0+XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgICAgIEB1cGRhdGVEb3REZWNvcmF0aW9uc09mZnNldHMoQGVkaXRvckVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCksIEBlZGl0b3JFbGVtZW50LmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpXG5cbiAgICAgIEBndXR0ZXJTdWJzY3JpcHRpb24uYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wID0+XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgICAgIEB1cGRhdGVEb3REZWNvcmF0aW9uc09mZnNldHMoQGVkaXRvckVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCksIEBlZGl0b3JFbGVtZW50LmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpXG5cbiAgICAgIEBndXR0ZXJTdWJzY3JpcHRpb24uYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2UgKGNoYW5nZXMpID0+XG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkgY2hhbmdlc1xuICAgICAgICAgIGNoYW5nZXM/LmZvckVhY2ggKGNoYW5nZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVEb3REZWNvcmF0aW9uc09mZnNldHMoY2hhbmdlLnN0YXJ0LnJvdywgY2hhbmdlLm5ld0V4dGVudC5yb3cpXG5cbiAgICAgICAgZWxzZSBpZiBjaGFuZ2VzLnN0YXJ0PyBhbmQgY2hhbmdlcy5uZXdFeHRlbnQ/XG4gICAgICAgICAgQHVwZGF0ZURvdERlY29yYXRpb25zT2Zmc2V0cyhjaGFuZ2VzLnN0YXJ0LnJvdywgY2hhbmdlcy5uZXdFeHRlbnQucm93KVxuXG4gICAgQHVwZGF0ZUd1dHRlckRlY29yYXRpb25zKHR5cGUpXG5cbiAgZGVzdHJveUd1dHRlcjogLT5cbiAgICB0cnkgQGd1dHRlci5kZXN0cm95KClcbiAgICBAZ3V0dGVyU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBkaXNwbGF5ZWRNYXJrZXJzID0gW11cbiAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKSBmb3IgaWQsIGRlY29yYXRpb24gb2YgQGRlY29yYXRpb25CeU1hcmtlcklkXG4gICAgZGVsZXRlIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFxuICAgIGRlbGV0ZSBAZ3V0dGVyU3Vic2NyaXB0aW9uXG5cbiAgdXBkYXRlR3V0dGVyRGVjb3JhdGlvbnM6ICh0eXBlPUBwcmV2aW91c1R5cGUpIC0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuXG4gICAgbWFya2VycyA9IEBjb2xvckJ1ZmZlci5nZXRWYWxpZENvbG9yTWFya2VycygpXG5cbiAgICBmb3IgbSBpbiBAZGlzcGxheWVkTWFya2VycyB3aGVuIG0gbm90IGluIG1hcmtlcnNcbiAgICAgIEBkZWNvcmF0aW9uQnlNYXJrZXJJZFttLmlkXT8uZGVzdHJveSgpXG4gICAgICBkZWxldGUgQGRlY29yYXRpb25CeU1hcmtlcklkW20uaWRdXG5cbiAgICBtYXJrZXJzQnlSb3dzID0ge31cbiAgICBtYXhSb3dMZW5ndGggPSAwXG4gICAgc2Nyb2xsTGVmdCA9IEBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuICAgIG1heERlY29yYXRpb25zSW5HdXR0ZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLm1heERlY29yYXRpb25zSW5HdXR0ZXInKVxuXG4gICAgZm9yIG0gaW4gbWFya2Vyc1xuICAgICAgaWYgbS5jb2xvcj8uaXNWYWxpZCgpIGFuZCBtIG5vdCBpbiBAZGlzcGxheWVkTWFya2Vyc1xuICAgICAgICBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF0gPSBAZ3V0dGVyLmRlY29yYXRlTWFya2VyKG0ubWFya2VyLCB7XG4gICAgICAgICAgdHlwZTogJ2d1dHRlcidcbiAgICAgICAgICBjbGFzczogJ3BpZ21lbnRzLWd1dHRlci1tYXJrZXInXG4gICAgICAgICAgaXRlbTogQGdldEd1dHRlckRlY29yYXRpb25JdGVtKG0pXG4gICAgICAgIH0pXG5cbiAgICAgIGRlY28gPSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF1cbiAgICAgIHJvdyA9IG0ubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKS5yb3dcbiAgICAgIG1hcmtlcnNCeVJvd3Nbcm93XSA/PSAwXG5cbiAgICAgIGNvbnRpbnVlIGlmIG1hcmtlcnNCeVJvd3Nbcm93XSA+PSBtYXhEZWNvcmF0aW9uc0luR3V0dGVyXG5cbiAgICAgIHJvd0xlbmd0aCA9IDBcblxuICAgICAgaWYgdHlwZSBpc250ICdndXR0ZXInXG4gICAgICAgIHRyeVxuICAgICAgICAgIHJvd0xlbmd0aCA9IEBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbcm93LCBJbmZpbml0eV0pLmxlZnRcblxuICAgICAgZGVjb1dpZHRoID0gMTRcblxuICAgICAgZGVjby5wcm9wZXJ0aWVzLml0ZW0uc3R5bGUubGVmdCA9IFwiI3socm93TGVuZ3RoICsgbWFya2Vyc0J5Um93c1tyb3ddICogZGVjb1dpZHRoKSAtIHNjcm9sbExlZnR9cHhcIlxuXG4gICAgICBtYXJrZXJzQnlSb3dzW3Jvd10rK1xuICAgICAgbWF4Um93TGVuZ3RoID0gTWF0aC5tYXgobWF4Um93TGVuZ3RoLCBtYXJrZXJzQnlSb3dzW3Jvd10pXG5cbiAgICBpZiB0eXBlIGlzICdndXR0ZXInXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGd1dHRlcikuc3R5bGUubWluV2lkdGggPSBcIiN7bWF4Um93TGVuZ3RoICogZGVjb1dpZHRofXB4XCJcbiAgICBlbHNlXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoQGd1dHRlcikuc3R5bGUud2lkdGggPSBcIjBweFwiXG5cbiAgICBAZGlzcGxheWVkTWFya2VycyA9IG1hcmtlcnNcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlJ1xuXG4gIHVwZGF0ZURvdERlY29yYXRpb25zT2Zmc2V0czogKHJvd1N0YXJ0LCByb3dFbmQpIC0+XG4gICAgbWFya2Vyc0J5Um93cyA9IHt9XG4gICAgc2Nyb2xsTGVmdCA9IEBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuXG4gICAgZm9yIHJvdyBpbiBbcm93U3RhcnQuLnJvd0VuZF1cbiAgICAgIGZvciBtIGluIEBkaXNwbGF5ZWRNYXJrZXJzXG4gICAgICAgIGRlY28gPSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbS5pZF1cbiAgICAgICAgY29udGludWUgdW5sZXNzIG0ubWFya2VyP1xuICAgICAgICBtYXJrZXJSb3cgPSBtLm1hcmtlci5nZXRTdGFydFNjcmVlblBvc2l0aW9uKCkucm93XG4gICAgICAgIGNvbnRpbnVlIHVubGVzcyByb3cgaXMgbWFya2VyUm93XG5cbiAgICAgICAgbWFya2Vyc0J5Um93c1tyb3ddID89IDBcblxuICAgICAgICByb3dMZW5ndGggPSBAZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oW3JvdywgSW5maW5pdHldKS5sZWZ0XG5cbiAgICAgICAgZGVjb1dpZHRoID0gMTRcblxuICAgICAgICBkZWNvLnByb3BlcnRpZXMuaXRlbS5zdHlsZS5sZWZ0ID0gXCIjeyhyb3dMZW5ndGggKyBtYXJrZXJzQnlSb3dzW3Jvd10gKiBkZWNvV2lkdGgpIC0gc2Nyb2xsTGVmdH1weFwiXG4gICAgICAgIG1hcmtlcnNCeVJvd3Nbcm93XSsrXG5cbiAgZ2V0R3V0dGVyRGVjb3JhdGlvbkl0ZW06IChtYXJrZXIpIC0+XG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgPHNwYW4gc3R5bGU9J2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICN7bWFya2VyLmNvbG9yLnRvQ1NTKCl9IDAlLCAje21hcmtlci5jb2xvci50b0NTUygpfSAxMDAlKSwgdXJsKGF0b206Ly9waWdtZW50cy9yZXNvdXJjZXMvdHJhbnNwYXJlbnQtYmFja2dyb3VuZC5wbmcpOycgZGF0YS1tYXJrZXItaWQ9JyN7bWFya2VyLmlkfSc+PC9zcGFuPlxuICAgIFwiXCJcIlxuICAgIGRpdlxuXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjICAgICAgICMjIyMjIyMjICAjIyMjIyMgICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyAgICMjICAgICAgICMjIyMjIyAgICMjICAgICAgICAgICMjXG4gICMjICAgICAgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAgICAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICAjIyMjIyMgICAgICMjXG5cbiAgcmVxdWVzdFNlbGVjdGlvblVwZGF0ZTogLT5cbiAgICByZXR1cm4gaWYgQHVwZGF0ZVJlcXVlc3RlZFxuXG4gICAgQHVwZGF0ZVJlcXVlc3RlZCA9IHRydWVcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT5cbiAgICAgIEB1cGRhdGVSZXF1ZXN0ZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIGlmIEBlZGl0b3IuZ2V0QnVmZmVyKCkuaXNEZXN0cm95ZWQoKVxuICAgICAgQHVwZGF0ZVNlbGVjdGlvbnMoKVxuXG4gIHVwZGF0ZVNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgIGZvciBtYXJrZXIgaW4gQGRpc3BsYXllZE1hcmtlcnNcbiAgICAgIGRlY29yYXRpb24gPSBAZGVjb3JhdGlvbkJ5TWFya2VySWRbbWFya2VyLmlkXVxuXG4gICAgICBAaGlkZURlY29yYXRpb25JZkluU2VsZWN0aW9uKG1hcmtlciwgZGVjb3JhdGlvbikgaWYgZGVjb3JhdGlvbj9cblxuICBoaWRlRGVjb3JhdGlvbklmSW5TZWxlY3Rpb246IChtYXJrZXIsIGRlY29yYXRpb24pIC0+XG4gICAgc2VsZWN0aW9ucyA9IEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBwcm9wcyA9IGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpXG4gICAgY2xhc3NlcyA9IHByb3BzLmNsYXNzLnNwbGl0KC9cXHMrL2cpXG5cbiAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFNjcmVlblJhbmdlKClcbiAgICAgIG1hcmtlclJhbmdlID0gbWFya2VyLmdldFNjcmVlblJhbmdlKClcblxuICAgICAgY29udGludWUgdW5sZXNzIG1hcmtlclJhbmdlPyBhbmQgcmFuZ2U/XG4gICAgICBpZiBtYXJrZXJSYW5nZS5pbnRlcnNlY3RzV2l0aChyYW5nZSlcbiAgICAgICAgY2xhc3Nlc1swXSArPSAnLWluLXNlbGVjdGlvbicgdW5sZXNzIGNsYXNzZXNbMF0ubWF0Y2goLy1pbi1zZWxlY3Rpb24kLyk/XG4gICAgICAgIHByb3BzLmNsYXNzID0gY2xhc3Nlcy5qb2luKCcgJylcbiAgICAgICAgZGVjb3JhdGlvbi5zZXRQcm9wZXJ0aWVzKHByb3BzKVxuICAgICAgICByZXR1cm5cblxuICAgIGNsYXNzZXMgPSBjbGFzc2VzLm1hcCAoY2xzKSAtPiBjbHMucmVwbGFjZSgnLWluLXNlbGVjdGlvbicsICcnKVxuICAgIHByb3BzLmNsYXNzID0gY2xhc3Nlcy5qb2luKCcgJylcbiAgICBkZWNvcmF0aW9uLnNldFByb3BlcnRpZXMocHJvcHMpXG5cbiAgaGlkZU1hcmtlcklmSW5TZWxlY3Rpb25PckZvbGQ6IChtYXJrZXIsIHZpZXcpIC0+XG4gICAgc2VsZWN0aW9ucyA9IEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFNjcmVlblJhbmdlKClcbiAgICAgIG1hcmtlclJhbmdlID0gbWFya2VyLmdldFNjcmVlblJhbmdlKClcblxuICAgICAgY29udGludWUgdW5sZXNzIG1hcmtlclJhbmdlPyBhbmQgcmFuZ2U/XG5cbiAgICAgIHZpZXcuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJykgaWYgbWFya2VyUmFuZ2UuaW50ZXJzZWN0c1dpdGgocmFuZ2UpXG4gICAgICB2aWV3LmNsYXNzTGlzdC5hZGQoJ2luLWZvbGQnKSBpZiAgQGVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0LnJvdylcblxuICAjIyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgICMjICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICMjICAgICAjIyAjIyMgICAjIyAgICAjIyAgICAjIyAgICAgICAgIyMgICAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjIyMgICMjICAgICMjICAgICMjICAgICAgICAgIyMgIyMgICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgIyMgIyMgICAgIyMgICAgIyMjIyMjICAgICAgIyMjICAgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgIyMjIyAgICAjIyAgICAjIyAgICAgICAgICMjICMjICAgICAgIyNcbiAgIyMgICAgIyMgICAgIyMgIyMgICAgICMjICMjICAgIyMjICAgICMjICAgICMjICAgICAgICAjIyAgICMjICAgICAjI1xuICAjIyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgIyMgICAgIyMgICAgIyMjIyMjIyMgIyMgICAgICMjICAgICMjXG4gICMjXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyAgICAjIyAjIyAgICAgIyNcbiAgIyMgICAgIyMjICAgIyMjICMjICAgICAgICMjIyAgICMjICMjICAgICAjI1xuICAjIyAgICAjIyMjICMjIyMgIyMgICAgICAgIyMjIyAgIyMgIyMgICAgICMjXG4gICMjICAgICMjICMjIyAjIyAjIyMjIyMgICAjIyAjIyAjIyAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAjIyMjICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAjIyMgIyMgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyAgICAjIyAgIyMjIyMjI1xuXG4gIGNvbG9yTWFya2VyRm9yTW91c2VFdmVudDogKGV2ZW50KSAtPlxuICAgIHBvc2l0aW9uID0gQHNjcmVlblBvc2l0aW9uRm9yTW91c2VFdmVudChldmVudClcblxuICAgIHJldHVybiB1bmxlc3MgcG9zaXRpb24/XG5cbiAgICBidWZmZXJQb3NpdGlvbiA9IEBjb2xvckJ1ZmZlci5lZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihwb3NpdGlvbilcblxuICAgIEBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlckF0QnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pXG5cbiAgc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgcGl4ZWxQb3NpdGlvbiA9IEBwaXhlbFBvc2l0aW9uRm9yTW91c2VFdmVudChldmVudClcblxuICAgIHJldHVybiB1bmxlc3MgcGl4ZWxQb3NpdGlvbj9cblxuICAgIGlmIEBlZGl0b3JFbGVtZW50LnNjcmVlblBvc2l0aW9uRm9yUGl4ZWxQb3NpdGlvbj9cbiAgICAgIEBlZGl0b3JFbGVtZW50LnNjcmVlblBvc2l0aW9uRm9yUGl4ZWxQb3NpdGlvbihwaXhlbFBvc2l0aW9uKVxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JQaXhlbFBvc2l0aW9uKHBpeGVsUG9zaXRpb24pXG5cbiAgcGl4ZWxQb3NpdGlvbkZvck1vdXNlRXZlbnQ6IChldmVudCkgLT5cbiAgICB7Y2xpZW50WCwgY2xpZW50WX0gPSBldmVudFxuXG4gICAgc2Nyb2xsVGFyZ2V0ID0gaWYgQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wP1xuICAgICAgQGVkaXRvckVsZW1lbnRcbiAgICBlbHNlXG4gICAgICBAZWRpdG9yXG5cbiAgICByb290RWxlbWVudCA9IEBnZXRFZGl0b3JSb290KClcblxuICAgIHJldHVybiB1bmxlc3Mgcm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpbmVzJyk/XG5cbiAgICB7dG9wLCBsZWZ0fSA9IHJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saW5lcycpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdG9wID0gY2xpZW50WSAtIHRvcCArIHNjcm9sbFRhcmdldC5nZXRTY3JvbGxUb3AoKVxuICAgIGxlZnQgPSBjbGllbnRYIC0gbGVmdCArIHNjcm9sbFRhcmdldC5nZXRTY3JvbGxMZWZ0KClcbiAgICB7dG9wLCBsZWZ0fVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5Db2xvckJ1ZmZlckVsZW1lbnQgPVxucmVnaXN0ZXJPclVwZGF0ZUVsZW1lbnQgJ3BpZ21lbnRzLW1hcmtlcnMnLCBDb2xvckJ1ZmZlckVsZW1lbnQucHJvdG90eXBlXG4iXX0=

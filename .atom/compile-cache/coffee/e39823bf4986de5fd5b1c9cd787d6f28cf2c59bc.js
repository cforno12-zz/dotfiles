(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.destroyScrollMarkers = bind(this.destroyScrollMarkers, this);
      this.setScrollMarkerView = bind(this.setScrollMarkerView, this);
      this.setupMarkerLayers = bind(this.setupMarkerLayers, this);
      this.setScrollMarker = bind(this.setScrollMarker, this);
      this.selectAll = bind(this.selectAll, this);
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.removeAllMarkers = bind(this.removeAllMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarkerForEditor = bind(this.onDidAddSelectedMarkerForEditor, this);
      this.onDidAddMarkerForEditor = bind(this.onDidAddMarkerForEditor, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.editorToMarkerLayerMap = {};
      this.markerLayers = [];
      this.resultCount = 0;
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.setupMarkerLayers(editor);
          return _this.setScrollMarkerView(editor);
        };
      })(this)));
      this.editorSubscriptions.add(atom.workspace.onWillDestroyPaneItem((function(_this) {
        return function(item) {
          var editor;
          if (item.item.constructor.name !== 'TextEditor') {
            return;
          }
          editor = item.item;
          _this.removeMarkers(editor.id);
          delete _this.editorToMarkerLayerMap[editor.id];
          return _this.destroyScrollMarkers(editor);
        };
      })(this)));
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
      this.enableScrollViewObserveSubscription = atom.config.observe('highlight-selected.showResultsOnScrollBar', (function(_this) {
        return function(enabled) {
          if (enabled) {
            _this.ensureScrollViewInstalled();
            return atom.workspace.getTextEditors().forEach(_this.setScrollMarkerView);
          } else {
            return atom.workspace.getTextEditors().forEach(_this.destroyScrollMarkers);
          }
        };
      })(this));
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3, ref4, ref5;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.enableScrollViewObserveSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.editorSubscriptions) != null) {
        ref3.dispose();
      }
      if ((ref4 = this.statusBarView) != null) {
        ref4.removeElement();
      }
      if ((ref5 = this.statusBarTile) != null) {
        ref5.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-selected-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeAllMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var allowedCharactersToSelect, editor, lastSelection, nonWordCharacters, nonWordCharactersToStrip, originalEditor, ref1, regex, regexFlags, regexForWholeWord, regexSearch, text;
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.removeAllMarkers();
      if (this.disabled) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      this.selections = editor.getSelections();
      lastSelection = editor.getLastSelection();
      text = lastSelection.getText();
      if (text.length < atom.config.get('highlight-selected.minimumLength')) {
        return;
      }
      regex = new RegExp("\\n");
      if (regex.exec(text)) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      regexSearch = escapeRegExp(text);
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(lastSelection)) {
          return;
        }
        nonWordCharacters = atom.config.get('editor.nonWordCharacters');
        allowedCharactersToSelect = atom.config.get('highlight-selected.allowedCharactersToSelect');
        nonWordCharactersToStrip = nonWordCharacters.replace(new RegExp("[" + allowedCharactersToSelect + "]", 'g'), '');
        regexForWholeWord = new RegExp("[ \\t" + (escapeRegExp(nonWordCharactersToStrip)) + "]", regexFlags);
        if (regexForWholeWord.test(text)) {
          return;
        }
        regexSearch = ("(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|^)(") + regexSearch + (")(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|$)");
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        originalEditor = editor;
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags, originalEditor);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref1 = this.statusBarElement) != null ? ref1.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags, originalEditor) {
      var markerLayer, markerLayerForHiddenMarkers, markerLayers;
      if (editor == null) {
        return;
      }
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      markerLayer = markerLayers['visibleMarkerLayer'];
      markerLayerForHiddenMarkers = markerLayers['selectedMarkerLayer'];
      editor.scan(new RegExp(regexSearch, regexFlags), (function(_this) {
        return function(result) {
          var marker, newResult;
          newResult = result;
          if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
            editor.scanInBufferRange(new RegExp(escapeRegExp(result.match[1])), result.range, function(e) {
              return newResult = e;
            });
          }
          if (newResult == null) {
            return;
          }
          _this.resultCount += 1;
          if (_this.showHighlightOnSelectedWord(newResult.range, _this.selections) && (originalEditor != null ? originalEditor.id : void 0) === editor.id) {
            marker = markerLayerForHiddenMarkers.markBufferRange(newResult.range);
            _this.emitter.emit('did-add-selected-marker', marker);
            return _this.emitter.emit('did-add-selected-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          } else {
            marker = markerLayer.markBufferRange(newResult.range);
            _this.emitter.emit('did-add-marker', marker);
            return _this.emitter.emit('did-add-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          }
        };
      })(this));
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeAllMarkers = function() {
      return Object.keys(this.editorToMarkerLayerMap).forEach(this.removeMarkers);
    };

    HighlightedAreaView.prototype.removeMarkers = function(editorId) {
      var markerLayer, ref1, selectedMarkerLayer;
      if (this.editorToMarkerLayerMap[editorId] == null) {
        return;
      }
      markerLayer = this.editorToMarkerLayerMap[editorId]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editorId]['selectedMarkerLayer'];
      markerLayer.clear();
      selectedMarkerLayer.clear();
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = selectionRange.start.isEqual(lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = selectionRange.end.isEqual(lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    HighlightedAreaView.prototype.selectAll = function() {
      var editor, i, j, len, len1, marker, markerLayer, markerLayers, ranges, ref1, ref2;
      editor = this.getActiveEditor();
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      ranges = [];
      ref1 = [markerLayers['visibleMarkerLayer'], markerLayers['selectedMarkerLayer']];
      for (i = 0, len = ref1.length; i < len; i++) {
        markerLayer = ref1[i];
        ref2 = markerLayer.getMarkers();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          marker = ref2[j];
          ranges.push(marker.getBufferRange());
        }
      }
      if (ranges.length > 0) {
        return editor.setSelectedBufferRanges(ranges, {
          flash: true
        });
      }
    };

    HighlightedAreaView.prototype.setScrollMarker = function(scrollMarkerAPI) {
      this.scrollMarker = scrollMarkerAPI;
      if (atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        this.ensureScrollViewInstalled();
        return atom.workspace.getTextEditors().forEach(this.setScrollMarkerView);
      }
    };

    HighlightedAreaView.prototype.ensureScrollViewInstalled = function() {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('highlight-selected', true);
      }
    };

    HighlightedAreaView.prototype.setupMarkerLayers = function(editor) {
      var markerLayer, markerLayerForHiddenMarkers;
      if (this.editorToMarkerLayerMap[editor.id] != null) {
        markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
        return markerLayerForHiddenMarkers = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      } else {
        markerLayer = editor.addMarkerLayer();
        markerLayerForHiddenMarkers = editor.addMarkerLayer();
        return this.editorToMarkerLayerMap[editor.id] = {
          visibleMarkerLayer: markerLayer,
          selectedMarkerLayer: markerLayerForHiddenMarkers
        };
      }
    };

    HighlightedAreaView.prototype.setScrollMarkerView = function(editor) {
      var markerLayer, scrollMarkerView, selectedMarkerLayer;
      if (!atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        return;
      }
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      scrollMarkerView.getLayer("highlight-selected-marker-layer").syncToMarkerLayer(markerLayer);
      return scrollMarkerView.getLayer("highlight-selected-selected-marker-layer").syncToMarkerLayer(selectedMarkerLayer);
    };

    HighlightedAreaView.prototype.destroyScrollMarkers = function(editor) {
      var scrollMarkerView;
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      return scrollMarkerView.destroy();
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2hpZ2hsaWdodGVkLWFyZWEtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7O0VBQUEsTUFBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyxpQkFBRCxFQUFRLDZDQUFSLEVBQTZCLHFCQUE3QixFQUFzQzs7RUFDdEMsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVI7O0VBQ2hCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDZCQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLHNCQUFELEdBQTBCO01BQzFCLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFFZixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSSxtQkFBSixDQUFBO01BQ3ZCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO1VBQ3pELEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFuQjtpQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckI7UUFGeUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXpCO01BS0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDNUQsY0FBQTtVQUFBLElBQWMsSUFBSSxDQUFDLElBQUksQ0FB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Z0IsQ0FBQyxPQUFqQixDQUFBO0lBSm9COzs7OztBQWhWeEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIE1hcmtlckxheWVyfSA9IHJlcXVpcmUgJ2F0b20nXG5TdGF0dXNCYXJWaWV3ID0gcmVxdWlyZSAnLi9zdGF0dXMtYmFyLXZpZXcnXG5lc2NhcGVSZWdFeHAgPSByZXF1aXJlICcuL2VzY2FwZS1yZWctZXhwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBIaWdobGlnaHRlZEFyZWFWaWV3XG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBlZGl0b3JUb01hcmtlckxheWVyTWFwID0ge31cbiAgICBAbWFya2VyTGF5ZXJzID0gW11cbiAgICBAcmVzdWx0Q291bnQgPSAwXG5cbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+XG4gICAgICBAc2V0dXBNYXJrZXJMYXllcnMoZWRpdG9yKVxuICAgICAgQHNldFNjcm9sbE1hcmtlclZpZXcoZWRpdG9yKVxuICAgICkpXG5cbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25XaWxsRGVzdHJveVBhbmVJdGVtKChpdGVtKSA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBpdGVtLml0ZW0uY29uc3RydWN0b3IubmFtZSA9PSAnVGV4dEVkaXRvcidcbiAgICAgIGVkaXRvciA9IGl0ZW0uaXRlbVxuICAgICAgQHJlbW92ZU1hcmtlcnMoZWRpdG9yLmlkKVxuICAgICAgZGVsZXRlIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1cbiAgICAgIEBkZXN0cm95U2Nyb2xsTWFya2VycyhlZGl0b3IpXG4gICAgKSlcblxuICAgIEBlbmFibGUoKVxuICAgIEBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlKClcbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbiA9IGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gPT5cbiAgICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuICAgICAgQHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGxpc3RlbkZvclN0YXR1c0JhckNoYW5nZSgpXG5cbiAgICBAZW5hYmxlU2Nyb2xsVmlld09ic2VydmVTdWJzY3JpcHRpb24gPVxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dSZXN1bHRzT25TY3JvbGxCYXInLCAoZW5hYmxlZCkgPT5cbiAgICAgICAgaWYgZW5hYmxlZFxuICAgICAgICAgIEBlbnN1cmVTY3JvbGxWaWV3SW5zdGFsbGVkKClcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goQHNldFNjcm9sbE1hcmtlclZpZXcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goQGRlc3Ryb3lTY3JvbGxNYXJrZXJzKVxuXG4gIGRlc3Ryb3k6ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBlbmFibGVTY3JvbGxWaWV3T2JzZXJ2ZVN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBzdGF0dXNCYXJWaWV3Py5yZW1vdmVFbGVtZW50KClcbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBudWxsXG5cbiAgb25EaWRBZGRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBHcmltID0gcmVxdWlyZSAnZ3JpbSdcbiAgICBHcmltLmRlcHJlY2F0ZShcIlBsZWFzZSBkbyBub3QgdXNlLiBUaGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQuXCIpXG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtbWFya2VyJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZFNlbGVjdGVkTWFya2VyOiAoY2FsbGJhY2spID0+XG4gICAgR3JpbSA9IHJlcXVpcmUgJ2dyaW0nXG4gICAgR3JpbS5kZXByZWNhdGUoXCJQbGVhc2UgZG8gbm90IHVzZS4gVGhpcyBtZXRob2Qgd2lsbCBiZSByZW1vdmVkLlwiKVxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLXNlbGVjdGVkLW1hcmtlcicsIGNhbGxiYWNrXG5cbiAgb25EaWRBZGRNYXJrZXJGb3JFZGl0b3I6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXItZm9yLWVkaXRvcicsIGNhbGxiYWNrXG5cbiAgb25EaWRBZGRTZWxlY3RlZE1hcmtlckZvckVkaXRvcjogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLXNlbGVjdGVkLW1hcmtlci1mb3ItZWRpdG9yJywgY2FsbGJhY2tcblxuICBvbkRpZFJlbW92ZUFsbE1hcmtlcnM6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXJlbW92ZS1tYXJrZXItbGF5ZXInLCBjYWxsYmFja1xuXG4gIGRpc2FibGU6ID0+XG4gICAgQGRpc2FibGVkID0gdHJ1ZVxuICAgIEByZW1vdmVBbGxNYXJrZXJzKClcblxuICBlbmFibGU6ID0+XG4gICAgQGRpc2FibGVkID0gZmFsc2VcbiAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcblxuICBzZXRTdGF0dXNCYXI6IChzdGF0dXNCYXIpID0+XG4gICAgQHN0YXR1c0JhciA9IHN0YXR1c0JhclxuICAgIEBzZXR1cFN0YXR1c0JhcigpXG5cbiAgZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uOiA9PlxuICAgIGNsZWFyVGltZW91dChAaGFuZGxlU2VsZWN0aW9uVGltZW91dClcbiAgICBAaGFuZGxlU2VsZWN0aW9uVGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgIEBoYW5kbGVTZWxlY3Rpb24oKVxuICAgICwgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQudGltZW91dCcpXG5cbiAgbGlzdGVuRm9yVGltZW91dENoYW5nZTogLT5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnaGlnaGxpZ2h0LXNlbGVjdGVkLnRpbWVvdXQnLCA9PlxuICAgICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG5cbiAgc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yOiAtPlxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuXG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZUVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcblxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBlZGl0b3Iub25EaWRBZGRTZWxlY3Rpb24gQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvblxuICAgIClcbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIGVkaXRvci5vbkRpZENoYW5nZVNlbGVjdGlvblJhbmdlIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb25cbiAgICApXG4gICAgQGhhbmRsZVNlbGVjdGlvbigpXG5cbiAgZ2V0QWN0aXZlRWRpdG9yOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIGdldEFjdGl2ZUVkaXRvcnM6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKS5tYXAgKHBhbmUpIC0+XG4gICAgICBhY3RpdmVJdGVtID0gcGFuZS5hY3RpdmVJdGVtXG4gICAgICBhY3RpdmVJdGVtIGlmIGFjdGl2ZUl0ZW0gYW5kIGFjdGl2ZUl0ZW0uY29uc3RydWN0b3IubmFtZSA9PSAnVGV4dEVkaXRvcidcblxuICBoYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgZWRpdG9yID0gQGdldEFjdGl2ZUVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcblxuICAgIEByZW1vdmVBbGxNYXJrZXJzKClcblxuICAgIHJldHVybiBpZiBAZGlzYWJsZWRcbiAgICByZXR1cm4gaWYgZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5pc0VtcHR5KClcblxuICAgIEBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgIGxhc3RTZWxlY3Rpb24gPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpXG4gICAgdGV4dCA9IGxhc3RTZWxlY3Rpb24uZ2V0VGV4dCgpXG5cbiAgICByZXR1cm4gaWYgdGV4dC5sZW5ndGggPCBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5taW5pbXVtTGVuZ3RoJylcbiAgICByZWdleCA9IG5ldyBSZWdFeHAoXCJcXFxcblwiKVxuICAgIHJldHVybiBpZiByZWdleC5leGVjKHRleHQpXG5cbiAgICByZWdleEZsYWdzID0gJ2cnXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaWdub3JlQ2FzZScpXG4gICAgICByZWdleEZsYWdzID0gJ2dpJ1xuXG4gICAgcmVnZXhTZWFyY2ggPSBlc2NhcGVSZWdFeHAodGV4dClcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJylcbiAgICAgIHJldHVybiB1bmxlc3MgQGlzV29yZFNlbGVjdGVkKGxhc3RTZWxlY3Rpb24pXG4gICAgICBub25Xb3JkQ2hhcmFjdGVycyA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLm5vbldvcmRDaGFyYWN0ZXJzJylcbiAgICAgIGFsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3QgPSBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5hbGxvd2VkQ2hhcmFjdGVyc1RvU2VsZWN0JylcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJzVG9TdHJpcCA9IG5vbldvcmRDaGFyYWN0ZXJzLnJlcGxhY2UoXG4gICAgICAgIG5ldyBSZWdFeHAoXCJbI3thbGxvd2VkQ2hhcmFjdGVyc1RvU2VsZWN0fV1cIiwgJ2cnKSwgJycpXG4gICAgICByZWdleEZvcldob2xlV29yZCA9IG5ldyBSZWdFeHAoXCJbIFxcXFx0I3tlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnNUb1N0cmlwKX1dXCIsIHJlZ2V4RmxhZ3MpXG4gICAgICByZXR1cm4gaWYgcmVnZXhGb3JXaG9sZVdvcmQudGVzdCh0ZXh0KVxuICAgICAgcmVnZXhTZWFyY2ggPVxuICAgICAgICBcIig/OlsgXFxcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XXxeKShcIiArXG4gICAgICAgIHJlZ2V4U2VhcmNoICtcbiAgICAgICAgXCIpKD86WyBcXFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dfCQpXCJcblxuICAgIEByZXN1bHRDb3VudCA9IDBcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRJblBhbmVzJylcbiAgICAgIG9yaWdpbmFsRWRpdG9yID0gZWRpdG9yXG4gICAgICBAZ2V0QWN0aXZlRWRpdG9ycygpLmZvckVhY2ggKGVkaXRvcikgPT5cbiAgICAgICAgQGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MsIG9yaWdpbmFsRWRpdG9yKVxuICAgIGVsc2VcbiAgICAgIEBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcihlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKVxuXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KEByZXN1bHRDb3VudClcblxuICBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcjogKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MsIG9yaWdpbmFsRWRpdG9yKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuICAgIG1hcmtlckxheWVycyA9ICBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdXG4gICAgcmV0dXJuIHVubGVzcyBtYXJrZXJMYXllcnM/XG4gICAgbWFya2VyTGF5ZXIgPSBtYXJrZXJMYXllcnNbJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzID0gbWFya2VyTGF5ZXJzWydzZWxlY3RlZE1hcmtlckxheWVyJ11cblxuICAgIGVkaXRvci5zY2FuIG5ldyBSZWdFeHAocmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MpLFxuICAgICAgKHJlc3VsdCkgPT5cbiAgICAgICAgbmV3UmVzdWx0ID0gcmVzdWx0XG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJylcbiAgICAgICAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UoXG4gICAgICAgICAgICBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChyZXN1bHQubWF0Y2hbMV0pKSxcbiAgICAgICAgICAgIHJlc3VsdC5yYW5nZSxcbiAgICAgICAgICAgIChlKSAtPiBuZXdSZXN1bHQgPSBlXG4gICAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiB1bmxlc3MgbmV3UmVzdWx0P1xuICAgICAgICBAcmVzdWx0Q291bnQgKz0gMVxuXG4gICAgICAgIGlmIEBzaG93SGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQobmV3UmVzdWx0LnJhbmdlLCBAc2VsZWN0aW9ucykgJiZcbiAgICAgICAgICAgb3JpZ2luYWxFZGl0b3I/LmlkID09IGVkaXRvci5pZFxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vycy5tYXJrQnVmZmVyUmFuZ2UobmV3UmVzdWx0LnJhbmdlKVxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgbWFya2VyXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXItZm9yLWVkaXRvcicsXG4gICAgICAgICAgICBtYXJrZXI6IG1hcmtlclxuICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShuZXdSZXN1bHQucmFuZ2UpXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1tYXJrZXInLCBtYXJrZXJcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJyxcbiAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlckxheWVyKG1hcmtlckxheWVyLCB7XG4gICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgIGNsYXNzOiBAbWFrZUNsYXNzZXMoKVxuICAgIH0pXG5cbiAgbWFrZUNsYXNzZXM6IC0+XG4gICAgY2xhc3NOYW1lID0gJ2hpZ2hsaWdodC1zZWxlY3RlZCdcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5saWdodFRoZW1lJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGxpZ2h0LXRoZW1lJ1xuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlnaGxpZ2h0QmFja2dyb3VuZCcpXG4gICAgICBjbGFzc05hbWUgKz0gJyBiYWNrZ3JvdW5kJ1xuICAgIGNsYXNzTmFtZVxuXG4gIHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZDogKHJhbmdlLCBzZWxlY3Rpb25zKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KFxuICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWRlSGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQnKVxuICAgIG91dGNvbWUgPSBmYWxzZVxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgb3V0Y29tZSA9IChyYW5nZS5zdGFydC5jb2x1bW4gaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2Uuc3RhcnQucm93IGlzIHNlbGVjdGlvblJhbmdlLnN0YXJ0LnJvdykgYW5kXG4gICAgICAgICAgICAgICAgKHJhbmdlLmVuZC5jb2x1bW4gaXMgc2VsZWN0aW9uUmFuZ2UuZW5kLmNvbHVtbikgYW5kXG4gICAgICAgICAgICAgICAgKHJhbmdlLmVuZC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2UuZW5kLnJvdylcbiAgICAgIGJyZWFrIGlmIG91dGNvbWVcbiAgICBvdXRjb21lXG5cbiAgcmVtb3ZlQWxsTWFya2VyczogPT5cbiAgICBPYmplY3Qua2V5cyhAZWRpdG9yVG9NYXJrZXJMYXllck1hcCkuZm9yRWFjaChAcmVtb3ZlTWFya2VycylcblxuICByZW1vdmVNYXJrZXJzOiAoZWRpdG9ySWQpID0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3JJZF0/XG5cbiAgICBtYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvcklkXVsndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICBzZWxlY3RlZE1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9ySWRdWydzZWxlY3RlZE1hcmtlckxheWVyJ11cblxuICAgIG1hcmtlckxheWVyLmNsZWFyKClcbiAgICBzZWxlY3RlZE1hcmtlckxheWVyLmNsZWFyKClcblxuICAgIEBzdGF0dXNCYXJFbGVtZW50Py51cGRhdGVDb3VudCgwKVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1yZW1vdmUtbWFya2VyLWxheWVyJ1xuXG4gIGlzV29yZFNlbGVjdGVkOiAoc2VsZWN0aW9uKSAtPlxuICAgIGlmIHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLmlzU2luZ2xlTGluZSgpXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBsaW5lUmFuZ2UgPSBAZ2V0QWN0aXZlRWRpdG9yKCkuYnVmZmVyUmFuZ2VGb3JCdWZmZXJSb3coXG4gICAgICAgIHNlbGVjdGlvblJhbmdlLnN0YXJ0LnJvdylcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQgPVxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5zdGFydC5pc0VxdWFsKGxpbmVSYW5nZS5zdGFydCkgb3JcbiAgICAgICAgQGlzTm9uV29yZENoYXJhY3RlclRvVGhlTGVmdChzZWxlY3Rpb24pXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodCA9XG4gICAgICAgIHNlbGVjdGlvblJhbmdlLmVuZC5pc0VxdWFsKGxpbmVSYW5nZS5lbmQpIG9yXG4gICAgICAgIEBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0KHNlbGVjdGlvbilcblxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlTGVmdCBhbmQgbm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHRcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG4gIGlzTm9uV29yZENoYXJhY3RlcjogKGNoYXJhY3RlcikgLT5cbiAgICBub25Xb3JkQ2hhcmFjdGVycyA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLm5vbldvcmRDaGFyYWN0ZXJzJylcbiAgICBuZXcgUmVnRXhwKFwiWyBcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XVwiKS50ZXN0KGNoYXJhY3RlcilcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvblN0YXJ0LCAwLCAtMSlcbiAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyKEBnZXRBY3RpdmVFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25FbmQsIDAsIDEpXG4gICAgQGlzTm9uV29yZENoYXJhY3RlcihAZ2V0QWN0aXZlRWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKVxuXG4gIHNldHVwU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiBpZiBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicpXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBuZXcgU3RhdHVzQmFyVmlldygpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlKFxuICAgICAgaXRlbTogQHN0YXR1c0JhckVsZW1lbnQuZ2V0RWxlbWVudCgpLCBwcmlvcml0eTogMTAwKVxuXG4gIHJlbW92ZVN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gdW5sZXNzIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG51bGxcblxuICBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2U6ID0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInLCAoY2hhbmdlZCkgPT5cbiAgICAgIGlmIGNoYW5nZWQubmV3VmFsdWVcbiAgICAgICAgQHNldHVwU3RhdHVzQmFyKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbW92ZVN0YXR1c0JhcigpXG5cbiAgc2VsZWN0QWxsOiA9PlxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIG1hcmtlckxheWVycyA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1cbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlckxheWVycz9cbiAgICByYW5nZXMgPSBbXVxuICAgIGZvciBtYXJrZXJMYXllciBpbiBbbWFya2VyTGF5ZXJzWyd2aXNpYmxlTWFya2VyTGF5ZXInXSwgbWFya2VyTGF5ZXJzWydzZWxlY3RlZE1hcmtlckxheWVyJ11dXG4gICAgICBmb3IgbWFya2VyIGluIG1hcmtlckxheWVyLmdldE1hcmtlcnMoKVxuICAgICAgICByYW5nZXMucHVzaCBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuXG4gICAgaWYgcmFuZ2VzLmxlbmd0aCA+IDBcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhyYW5nZXMsIGZsYXNoOiB0cnVlKVxuXG4gIHNldFNjcm9sbE1hcmtlcjogKHNjcm9sbE1hcmtlckFQSSkgPT5cbiAgICBAc2Nyb2xsTWFya2VyID0gc2Nyb2xsTWFya2VyQVBJXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd1Jlc3VsdHNPblNjcm9sbEJhcicpXG4gICAgICBAZW5zdXJlU2Nyb2xsVmlld0luc3RhbGxlZCgpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goQHNldFNjcm9sbE1hcmtlclZpZXcpXG5cbiAgZW5zdXJlU2Nyb2xsVmlld0luc3RhbGxlZDogLT5cbiAgICB1bmxlc3MgYXRvbS5pblNwZWNNb2RlKClcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCAnaGlnaGxpZ2h0LXNlbGVjdGVkJywgdHJ1ZVxuXG4gIHNldHVwTWFya2VyTGF5ZXJzOiAoZWRpdG9yKSA9PlxuICAgIGlmIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF0/XG4gICAgICBtYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1bJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsnc2VsZWN0ZWRNYXJrZXJMYXllciddXG4gICAgZWxzZVxuICAgICAgbWFya2VyTGF5ZXIgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICAgIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF0gPVxuICAgICAgICB2aXNpYmxlTWFya2VyTGF5ZXI6IG1hcmtlckxheWVyXG4gICAgICAgIHNlbGVjdGVkTWFya2VyTGF5ZXI6IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vyc1xuXG4gIHNldFNjcm9sbE1hcmtlclZpZXc6IChlZGl0b3IpID0+XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93UmVzdWx0c09uU2Nyb2xsQmFyJylcbiAgICByZXR1cm4gdW5sZXNzIEBzY3JvbGxNYXJrZXI/XG5cbiAgICBzY3JvbGxNYXJrZXJWaWV3ID0gQHNjcm9sbE1hcmtlci5zY3JvbGxNYXJrZXJWaWV3Rm9yRWRpdG9yKGVkaXRvcilcblxuICAgIG1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICBzZWxlY3RlZE1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsnc2VsZWN0ZWRNYXJrZXJMYXllciddXG5cbiAgICBzY3JvbGxNYXJrZXJWaWV3LmdldExheWVyKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLW1hcmtlci1sYXllclwiKVxuICAgICAgICAgICAgICAgICAgICAuc3luY1RvTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIpXG4gICAgc2Nyb2xsTWFya2VyVmlldy5nZXRMYXllcihcImhpZ2hsaWdodC1zZWxlY3RlZC1zZWxlY3RlZC1tYXJrZXItbGF5ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnN5bmNUb01hcmtlckxheWVyKHNlbGVjdGVkTWFya2VyTGF5ZXIpXG5cbiAgZGVzdHJveVNjcm9sbE1hcmtlcnM6IChlZGl0b3IpID0+XG4gICAgcmV0dXJuIHVubGVzcyBAc2Nyb2xsTWFya2VyP1xuXG4gICAgc2Nyb2xsTWFya2VyVmlldyA9IEBzY3JvbGxNYXJrZXIuc2Nyb2xsTWFya2VyVmlld0ZvckVkaXRvcihlZGl0b3IpXG4gICAgc2Nyb2xsTWFya2VyVmlldy5kZXN0cm95KClcbiJdfQ==

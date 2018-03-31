(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
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
      this.markerLayers = [];
      this.resultCount = 0;
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
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.statusBarView) != null) {
        ref2.removeElement();
      }
      if ((ref3 = this.statusBarTile) != null) {
        ref3.destroy();
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
      return this.removeMarkers();
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
      var editor, ref1, ref2, ref3, regex, regexFlags, regexSearch, result, text;
      this.removeMarkers();
      if (this.disabled) {
        return;
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(editor.getLastSelection())) {
          return;
        }
      }
      this.selections = editor.getSelections();
      text = escapeRegExp(this.selections[0].getText());
      regex = new RegExp("\\S*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result[0].length < atom.config.get('highlight-selected.minimumLength') || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (regexSearch.indexOf("\$") !== -1 && ((ref1 = (ref2 = editor.getGrammar()) != null ? ref2.name : void 0) === 'PHP' || ref1 === 'HACK')) {
          regexSearch = regexSearch.replace("\$", "\$\\b");
        } else {
          regexSearch = "\\b" + regexSearch;
        }
        regexSearch = regexSearch + "\\b";
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref3 = this.statusBarElement) != null ? ref3.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags) {
      var markerLayer, markerLayerForHiddenMarkers, range;
      markerLayer = editor != null ? editor.addMarkerLayer() : void 0;
      if (markerLayer == null) {
        return;
      }
      markerLayerForHiddenMarkers = editor.addMarkerLayer();
      this.markerLayers.push(markerLayer);
      this.markerLayers.push(markerLayerForHiddenMarkers);
      range = [[0, 0], editor.getEofBufferPosition()];
      editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var marker;
          _this.resultCount += 1;
          if (_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = markerLayerForHiddenMarkers.markBufferRange(result.range);
            _this.emitter.emit('did-add-selected-marker', marker);
            return _this.emitter.emit('did-add-selected-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          } else {
            marker = markerLayer.markBufferRange(result.range);
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

    HighlightedAreaView.prototype.removeMarkers = function() {
      var ref1;
      this.markerLayers.forEach(function(markerLayer) {
        return markerLayer.destroy();
      });
      this.markerLayers = [];
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

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2hpZ2hsaWdodGVkLWFyZWEtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7O0VBQUEsTUFBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyxpQkFBRCxFQUFRLDZDQUFSLEVBQTZCLHFCQUE3QixFQUFzQzs7RUFDdEMsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVI7O0VBQ2hCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDZCQUFBOzs7Ozs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNqRSxLQUFDLENBQUEsd0JBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsMkJBQUQsQ0FBQTtRQUZpRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFHMUIsSUFBQyxDQUFBLDJCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsd0JBQUQsQ0FBQTtJQVZXOztrQ0FZYixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLHNCQUFkO01BQ0EsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUE7O1lBQ3NCLENBQUUsT0FBeEIsQ0FBQTs7O1lBQ2MsQ0FBRSxhQUFoQixDQUFB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LEdBQWlCO2FBQ2pCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUpMOztrQ0FNakIsd0JBQUEsR0FBMEIsU0FBQTthQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0Isb0NBQXhCLEVBQThELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO1VBQzVELElBQUcsT0FBTyxDQUFDLFFBQVg7bUJBQ0UsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsZUFBRCxDQUFBLEVBSEY7O1FBRDREO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RDtJQUR3Qjs7Ozs7QUFsUDVCIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCBNYXJrZXJMYXllcn0gPSByZXF1aXJlICdhdG9tJ1xuU3RhdHVzQmFyVmlldyA9IHJlcXVpcmUgJy4vc3RhdHVzLWJhci12aWV3J1xuZXNjYXBlUmVnRXhwID0gcmVxdWlyZSAnLi9lc2NhcGUtcmVnLWV4cCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSGlnaGxpZ2h0ZWRBcmVhVmlld1xuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAbWFya2VyTGF5ZXJzID0gW11cbiAgICBAcmVzdWx0Q291bnQgPSAwXG4gICAgQGVuYWJsZSgpXG4gICAgQGxpc3RlbkZvclRpbWVvdXRDaGFuZ2UoKVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSA9PlxuICAgICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG4gICAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAbGlzdGVuRm9yU3RhdHVzQmFyQ2hhbmdlKClcblxuICBkZXN0cm95OiA9PlxuICAgIGNsZWFyVGltZW91dChAaGFuZGxlU2VsZWN0aW9uVGltZW91dClcbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAc3RhdHVzQmFyVmlldz8ucmVtb3ZlRWxlbWVudCgpXG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuXG4gIG9uRGlkQWRkTWFya2VyOiAoY2FsbGJhY2spID0+XG4gICAgR3JpbSA9IHJlcXVpcmUgJ2dyaW0nXG4gICAgR3JpbS5kZXByZWNhdGUoXCJQbGVhc2UgZG8gbm90IHVzZS4gVGhpcyBtZXRob2Qgd2lsbCBiZSByZW1vdmVkLlwiKVxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLW1hcmtlcicsIGNhbGxiYWNrXG5cbiAgb25EaWRBZGRTZWxlY3RlZE1hcmtlcjogKGNhbGxiYWNrKSA9PlxuICAgIEdyaW0gPSByZXF1aXJlICdncmltJ1xuICAgIEdyaW0uZGVwcmVjYXRlKFwiUGxlYXNlIGRvIG5vdCB1c2UuIFRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZC5cIilcbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkTWFya2VyRm9yRWRpdG9yOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtbWFya2VyLWZvci1lZGl0b3InLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXJGb3JFZGl0b3I6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXItZm9yLWVkaXRvcicsIGNhbGxiYWNrXG5cbiAgb25EaWRSZW1vdmVBbGxNYXJrZXJzOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtbWFya2VyLWxheWVyJywgY2FsbGJhY2tcblxuICBkaXNhYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IHRydWVcbiAgICBAcmVtb3ZlTWFya2VycygpXG5cbiAgZW5hYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IGZhbHNlXG4gICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG5cbiAgc2V0U3RhdHVzQmFyOiAoc3RhdHVzQmFyKSA9PlxuICAgIEBzdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICBAc2V0dXBTdGF0dXNCYXIoKVxuXG4gIGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAaGFuZGxlU2VsZWN0aW9uKClcbiAgICAsIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnRpbWVvdXQnKVxuXG4gIGxpc3RlbkZvclRpbWVvdXRDaGFuZ2U6IC0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JywgPT5cbiAgICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcblxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQWRkU2VsZWN0aW9uIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb25cbiAgICApXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBoYW5kbGVTZWxlY3Rpb24oKVxuXG4gIGdldEFjdGl2ZUVkaXRvcjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBnZXRBY3RpdmVFZGl0b3JzOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkubWFwIChwYW5lKSAtPlxuICAgICAgYWN0aXZlSXRlbSA9IHBhbmUuYWN0aXZlSXRlbVxuICAgICAgYWN0aXZlSXRlbSBpZiBhY3RpdmVJdGVtIGFuZCBhY3RpdmVJdGVtLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1RleHRFZGl0b3InXG5cbiAgaGFuZGxlU2VsZWN0aW9uOiA9PlxuICAgIEByZW1vdmVNYXJrZXJzKClcblxuICAgIHJldHVybiBpZiBAZGlzYWJsZWRcblxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3JcbiAgICByZXR1cm4gaWYgZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5pc0VtcHR5KClcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJylcbiAgICAgIHJldHVybiB1bmxlc3MgQGlzV29yZFNlbGVjdGVkKGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkpXG5cbiAgICBAc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcblxuICAgIHRleHQgPSBlc2NhcGVSZWdFeHAoQHNlbGVjdGlvbnNbMF0uZ2V0VGV4dCgpKVxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFxTKlxcXFx3KlxcXFxiXCIsICdnaScpXG4gICAgcmVzdWx0ID0gcmVnZXguZXhlYyh0ZXh0KVxuXG4gICAgcmV0dXJuIHVubGVzcyByZXN1bHQ/XG4gICAgcmV0dXJuIGlmIHJlc3VsdFswXS5sZW5ndGggPCBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLm1pbmltdW1MZW5ndGgnKSBvclxuICAgICAgICAgICAgICByZXN1bHQuaW5kZXggaXNudCAwIG9yXG4gICAgICAgICAgICAgIHJlc3VsdFswXSBpc250IHJlc3VsdC5pbnB1dFxuXG4gICAgcmVnZXhGbGFncyA9ICdnJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmlnbm9yZUNhc2UnKVxuICAgICAgcmVnZXhGbGFncyA9ICdnaSdcblxuICAgIEByYW5nZXMgPSBbXVxuICAgIHJlZ2V4U2VhcmNoID0gcmVzdWx0WzBdXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycpXG4gICAgICBpZiByZWdleFNlYXJjaC5pbmRleE9mKFwiXFwkXCIpIGlzbnQgLTEgXFxcbiAgICAgIGFuZCBlZGl0b3IuZ2V0R3JhbW1hcigpPy5uYW1lIGluIFsnUEhQJywgJ0hBQ0snXVxuICAgICAgICByZWdleFNlYXJjaCA9IHJlZ2V4U2VhcmNoLnJlcGxhY2UoXCJcXCRcIiwgXCJcXCRcXFxcYlwiKVxuICAgICAgZWxzZVxuICAgICAgICByZWdleFNlYXJjaCA9ICBcIlxcXFxiXCIgKyByZWdleFNlYXJjaFxuICAgICAgcmVnZXhTZWFyY2ggPSByZWdleFNlYXJjaCArIFwiXFxcXGJcIlxuXG4gICAgQHJlc3VsdENvdW50ID0gMFxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZ2hsaWdodEluUGFuZXMnKVxuICAgICAgQGdldEFjdGl2ZUVkaXRvcnMoKS5mb3JFYWNoIChlZGl0b3IpID0+XG4gICAgICAgIEBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcihlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKVxuICAgIGVsc2VcbiAgICAgIEBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcihlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKVxuXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KEByZXN1bHRDb3VudClcblxuICBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcjogKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MpIC0+XG4gICAgbWFya2VyTGF5ZXIgPSBlZGl0b3I/LmFkZE1hcmtlckxheWVyKClcbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlckxheWVyP1xuICAgIG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2VycyA9IGVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgQG1hcmtlckxheWVycy5wdXNoKG1hcmtlckxheWVyKVxuICAgIEBtYXJrZXJMYXllcnMucHVzaChtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMpXG5cbiAgICByYW5nZSA9ICBbWzAsIDBdLCBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKV1cblxuICAgIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSBuZXcgUmVnRXhwKHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKSwgcmFuZ2UsXG4gICAgICAocmVzdWx0KSA9PlxuICAgICAgICBAcmVzdWx0Q291bnQgKz0gMVxuICAgICAgICBpZiBAc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkKHJlc3VsdC5yYW5nZSwgQHNlbGVjdGlvbnMpXG4gICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzLm1hcmtCdWZmZXJSYW5nZShyZXN1bHQucmFuZ2UpXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBtYXJrZXJcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXNlbGVjdGVkLW1hcmtlci1mb3ItZWRpdG9yJyxcbiAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXIubWFya0J1ZmZlclJhbmdlKHJlc3VsdC5yYW5nZSlcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlcicsIG1hcmtlclxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtbWFya2VyLWZvci1lZGl0b3InLFxuICAgICAgICAgICAgbWFya2VyOiBtYXJrZXJcbiAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIsIHtcbiAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgY2xhc3M6IEBtYWtlQ2xhc3NlcygpXG4gICAgfSlcblxuICBtYWtlQ2xhc3NlczogLT5cbiAgICBjbGFzc05hbWUgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmxpZ2h0VGhlbWUnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgbGlnaHQtdGhlbWUnXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRCYWNrZ3JvdW5kJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGJhY2tncm91bmQnXG4gICAgY2xhc3NOYW1lXG5cbiAgc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOiAocmFuZ2UsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZCcpXG4gICAgb3V0Y29tZSA9IGZhbHNlXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBvdXRjb21lID0gKHJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5zdGFydC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5lbmQucm93KVxuICAgICAgYnJlYWsgaWYgb3V0Y29tZVxuICAgIG91dGNvbWVcblxuICByZW1vdmVNYXJrZXJzOiA9PlxuICAgIEBtYXJrZXJMYXllcnMuZm9yRWFjaCAobWFya2VyTGF5ZXIpIC0+XG4gICAgICBtYXJrZXJMYXllci5kZXN0cm95KClcbiAgICBAbWFya2VyTGF5ZXJzID0gW11cbiAgICBAc3RhdHVzQmFyRWxlbWVudD8udXBkYXRlQ291bnQoMClcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcidcblxuICBpc1dvcmRTZWxlY3RlZDogKHNlbGVjdGlvbikgLT5cbiAgICBpZiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5pc1NpbmdsZUxpbmUoKVxuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgbGluZVJhbmdlID0gQGdldEFjdGl2ZUVkaXRvcigpLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KFxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3cpXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0ID1cbiAgICAgICAgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQuaXNFcXVhbChsaW5lUmFuZ2Uuc3RhcnQpIG9yXG4gICAgICAgIEBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQoc2VsZWN0aW9uKVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQgPVxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5lbmQuaXNFcXVhbChsaW5lUmFuZ2UuZW5kKSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodChzZWxlY3Rpb24pXG5cbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQgYW5kIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBpc05vbldvcmRDaGFyYWN0ZXI6IChjaGFyYWN0ZXIpIC0+XG4gICAgbm9uV29yZENoYXJhY3RlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5ub25Xb3JkQ2hhcmFjdGVycycpXG4gICAgbmV3IFJlZ0V4cChcIlsgXFx0I3tlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpfV1cIikudGVzdChjaGFyYWN0ZXIpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0OiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25TdGFydCwgMCwgLTEpXG4gICAgQGlzTm9uV29yZENoYXJhY3RlcihAZ2V0QWN0aXZlRWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKVxuXG4gIGlzTm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgcmFuZ2UgPSBSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEoc2VsZWN0aW9uRW5kLCAwLCAxKVxuICAgIEBpc05vbldvcmRDaGFyYWN0ZXIoQGdldEFjdGl2ZUVkaXRvcigpLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKSlcblxuICBzZXR1cFN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gaWYgQHN0YXR1c0JhckVsZW1lbnQ/XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInKVxuICAgIEBzdGF0dXNCYXJFbGVtZW50ID0gbmV3IFN0YXR1c0JhclZpZXcoKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gQHN0YXR1c0Jhci5hZGRMZWZ0VGlsZShcbiAgICAgIGl0ZW06IEBzdGF0dXNCYXJFbGVtZW50LmdldEVsZW1lbnQoKSwgcHJpb3JpdHk6IDEwMClcblxuICByZW1vdmVTdGF0dXNCYXI6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBudWxsXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBudWxsXG5cbiAgbGlzdGVuRm9yU3RhdHVzQmFyQ2hhbmdlOiA9PlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd0luU3RhdHVzQmFyJywgKGNoYW5nZWQpID0+XG4gICAgICBpZiBjaGFuZ2VkLm5ld1ZhbHVlXG4gICAgICAgIEBzZXR1cFN0YXR1c0JhcigpXG4gICAgICBlbHNlXG4gICAgICAgIEByZW1vdmVTdGF0dXNCYXIoKVxuIl19

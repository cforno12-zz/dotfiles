(function() {
  var AncestorsMethods, ColorResultsElement, CompositeDisposable, EventsDelegation, Range, SpacePenDSL, _, path, ref, ref1, removeLeadingWhitespace,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = [], Range = ref[0], CompositeDisposable = ref[1], _ = ref[2], path = ref[3];

  ref1 = require('atom-utils'), SpacePenDSL = ref1.SpacePenDSL, EventsDelegation = ref1.EventsDelegation, AncestorsMethods = ref1.AncestorsMethods;

  removeLeadingWhitespace = function(string) {
    return string.replace(/^\s+/, '');
  };

  ColorResultsElement = (function(superClass) {
    extend(ColorResultsElement, superClass);

    function ColorResultsElement() {
      return ColorResultsElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorResultsElement);

    EventsDelegation.includeInto(ColorResultsElement);

    ColorResultsElement.content = function() {
      return this.tag('atom-panel', {
        outlet: 'pane',
        "class": 'preview-pane pane-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.span({
              outlet: 'previewCount',
              "class": 'preview-count inline-block'
            });
            return _this.div({
              outlet: 'loadingMessage',
              "class": 'inline-block'
            }, function() {
              _this.div({
                "class": 'loading loading-spinner-tiny inline-block'
              });
              return _this.div({
                outlet: 'searchedCountBlock',
                "class": 'inline-block'
              }, function() {
                _this.span({
                  outlet: 'searchedCount',
                  "class": 'searched-count'
                });
                return _this.span(' paths searched');
              });
            });
          });
          return _this.ol({
            outlet: 'resultsList',
            "class": 'search-colors-results results-view list-tree focusable-panel has-collapsable-children native-key-bindings',
            tabindex: -1
          });
        };
      })(this));
    };

    ColorResultsElement.prototype.createdCallback = function() {
      var ref2;
      if (CompositeDisposable == null) {
        ref2 = require('atom'), Range = ref2.Range, CompositeDisposable = ref2.CompositeDisposable;
      }
      this.subscriptions = new CompositeDisposable;
      this.pathMapping = {};
      this.files = 0;
      this.colors = 0;
      this.loadingMessage.style.display = 'none';
      this.subscriptions.add(this.subscribeTo(this, '.list-nested-item > .list-item', {
        click: function(e) {
          var fileItem;
          e.stopPropagation();
          fileItem = AncestorsMethods.parents(e.target, '.list-nested-item')[0];
          return fileItem.classList.toggle('collapsed');
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this, '.search-result', {
        click: (function(_this) {
          return function(e) {
            var fileItem, matchItem, pathAttribute, range;
            e.stopPropagation();
            matchItem = e.target.matches('.search-result') ? e.target : AncestorsMethods.parents(e.target, '.search-result')[0];
            fileItem = AncestorsMethods.parents(matchItem, '.list-nested-item')[0];
            range = Range.fromObject([matchItem.dataset.start.split(',').map(Number), matchItem.dataset.end.split(',').map(Number)]);
            pathAttribute = fileItem.dataset.path;
            return atom.workspace.open(_this.pathMapping[pathAttribute]).then(function(editor) {
              return editor.setSelectedBufferRange(range, {
                autoscroll: true
              });
            });
          };
        })(this)
      }));
    };

    ColorResultsElement.prototype.setModel = function(colorSearch) {
      this.colorSearch = colorSearch;
      this.subscriptions.add(this.colorSearch.onDidFindMatches((function(_this) {
        return function(result) {
          return _this.addFileResult(result);
        };
      })(this)));
      this.subscriptions.add(this.colorSearch.onDidCompleteSearch((function(_this) {
        return function() {
          return _this.searchComplete();
        };
      })(this)));
      return this.colorSearch.search();
    };

    ColorResultsElement.prototype.addFileResult = function(result) {
      this.files += 1;
      this.colors += result.matches.length;
      this.resultsList.innerHTML += this.createFileResult(result);
      return this.updateMessage();
    };

    ColorResultsElement.prototype.searchComplete = function() {
      this.updateMessage();
      if (this.colors === 0) {
        this.pane.classList.add('no-results');
        return this.pane.appendChild("<ul class='centered background-message no-results-overlay'>\n  <li>No Results</li>\n</ul>");
      }
    };

    ColorResultsElement.prototype.updateMessage = function() {
      var filesString;
      filesString = this.files === 1 ? 'file' : 'files';
      return this.previewCount.innerHTML = this.colors > 0 ? "<span class='text-info'>\n  " + this.colors + " colors\n</span>\nfound in\n<span class='text-info'>\n  " + this.files + " " + filesString + "\n</span>" : "No colors found in " + this.files + " " + filesString;
    };

    ColorResultsElement.prototype.createFileResult = function(fileResult) {
      var fileBasename, filePath, matches, pathAttribute, pathName;
      if (_ == null) {
        _ = require('underscore-plus');
      }
      if (path == null) {
        path = require('path');
      }
      filePath = fileResult.filePath, matches = fileResult.matches;
      fileBasename = path.basename(filePath);
      pathAttribute = _.escapeAttribute(filePath);
      this.pathMapping[pathAttribute] = filePath;
      pathName = atom.project.relativize(filePath);
      return "<li class=\"path list-nested-item\" data-path=\"" + pathAttribute + "\">\n  <div class=\"path-details list-item\">\n    <span class=\"disclosure-arrow\"></span>\n    <span class=\"icon icon-file-text\" data-name=\"" + fileBasename + "\"></span>\n    <span class=\"path-name bright\">" + pathName + "</span>\n    <span class=\"path-match-number\">(" + matches.length + ")</span></div>\n  </div>\n  <ul class=\"matches list-tree\">\n    " + (matches.map((function(_this) {
        return function(match) {
          return _this.createMatchResult(match);
        };
      })(this)).join('')) + "\n  </ul>\n</li>";
    };

    ColorResultsElement.prototype.createMatchResult = function(match) {
      var filePath, lineNumber, matchEnd, matchStart, prefix, range, ref2, style, suffix, textColor;
      if (CompositeDisposable == null) {
        ref2 = require('atom'), Range = ref2.Range, CompositeDisposable = ref2.CompositeDisposable;
      }
      textColor = match.color.luma > 0.43 ? 'black' : 'white';
      filePath = match.filePath, range = match.range;
      range = Range.fromObject(range);
      matchStart = range.start.column - match.lineTextOffset;
      matchEnd = range.end.column - match.lineTextOffset;
      prefix = removeLeadingWhitespace(match.lineText.slice(0, matchStart));
      suffix = match.lineText.slice(matchEnd);
      lineNumber = range.start.row + 1;
      style = '';
      style += "background: " + (match.color.toCSS()) + ";";
      style += "color: " + textColor + ";";
      return "<li class=\"search-result list-item\" data-start=\"" + range.start.row + "," + range.start.column + "\" data-end=\"" + range.end.row + "," + range.end.column + "\">\n  <span class=\"line-number text-subtle\">" + lineNumber + "</span>\n  <span class=\"preview\">\n    " + prefix + "\n    <span class='match color-match' style='" + style + "'>" + match.matchText + "</span>\n    " + suffix + "\n  </span>\n</li>";
    };

    return ColorResultsElement;

  })(HTMLElement);

  module.exports = ColorResultsElement = document.registerElement('pigments-color-results', {
    prototype: ColorResultsElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcmVzdWx0cy1lbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNklBQUE7SUFBQTs7O0VBQUEsTUFHSSxFQUhKLEVBQ0UsY0FERixFQUNTLDRCQURULEVBRUUsVUFGRixFQUVLOztFQUdMLE9BQW9ELE9BQUEsQ0FBUSxZQUFSLENBQXBELEVBQUMsOEJBQUQsRUFBYyx3Q0FBZCxFQUFnQzs7RUFFaEMsdUJBQUEsR0FBMEIsU0FBQyxNQUFEO1dBQVksTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLEVBQXZCO0VBQVo7O0VBRXBCOzs7Ozs7O0lBQ0osV0FBVyxDQUFDLFdBQVosQ0FBd0IsbUJBQXhCOztJQUNBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLG1CQUE3Qjs7SUFFQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxZQUFMLEVBQW1CO1FBQUEsTUFBQSxFQUFRLE1BQVI7UUFBZ0IsQ0FBQSxLQUFBLENBQUEsRUFBTyx3QkFBdkI7T0FBbkIsRUFBb0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2xFLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixTQUFBO1lBQzNCLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxNQUFBLEVBQVEsY0FBUjtjQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLDRCQUEvQjthQUFOO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsZ0JBQVI7Y0FBMEIsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFqQzthQUFMLEVBQXNELFNBQUE7Y0FDcEQsS0FBQyxDQUFBLEdBQUQsQ0FBSztnQkFBQSxDQUFBLEtBQUEs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RUFxSmxDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQUFBLEdBQ2pCLFFBQVEsQ0FBQyxlQUFULENBQXlCLHdCQUF6QixFQUFtRDtJQUNqRCxTQUFBLEVBQVcsbUJBQW1CLENBQUMsU0FEa0I7R0FBbkQ7QUEvSkEiLCJzb3VyY2VzQ29udGVudCI6WyJbXG4gIFJhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlLFxuICBfLCBwYXRoXG5dID0gW11cblxue1NwYWNlUGVuRFNMLCBFdmVudHNEZWxlZ2F0aW9uLCBBbmNlc3RvcnNNZXRob2RzfSA9IHJlcXVpcmUgJ2F0b20tdXRpbHMnXG5cbnJlbW92ZUxlYWRpbmdXaGl0ZXNwYWNlID0gKHN0cmluZykgLT4gc3RyaW5nLnJlcGxhY2UoL15cXHMrLywgJycpXG5cbmNsYXNzIENvbG9yUmVzdWx0c0VsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxuICBTcGFjZVBlbkRTTC5pbmNsdWRlSW50byh0aGlzKVxuICBFdmVudHNEZWxlZ2F0aW9uLmluY2x1ZGVJbnRvKHRoaXMpXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQHRhZyAnYXRvbS1wYW5lbCcsIG91dGxldDogJ3BhbmUnLCBjbGFzczogJ3ByZXZpZXctcGFuZSBwYW5lLWl0ZW0nLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3BhbmVsLWhlYWRpbmcnLCA9PlxuICAgICAgICBAc3BhbiBvdXRsZXQ6ICdwcmV2aWV3Q291bnQnLCBjbGFzczogJ3ByZXZpZXctY291bnQgaW5saW5lLWJsb2NrJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2xvYWRpbmdNZXNzYWdlJywgY2xhc3M6ICdpbmxpbmUtYmxvY2snLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci10aW55IGlubGluZS1ibG9jaydcbiAgICAgICAgICBAZGl2IG91dGxldDogJ3NlYXJjaGVkQ291bnRCbG9jaycsIGNsYXNzOiAnaW5saW5lLWJsb2NrJywgPT5cbiAgICAgICAgICAgIEBzcGFuIG91dGxldDogJ3NlYXJjaGVkQ291bnQnLCBjbGFzczogJ3NlYXJjaGVkLWNvdW50J1xuICAgICAgICAgICAgQHNwYW4gJyBwYXRocyBzZWFyY2hlZCdcblxuICAgICAgQG9sIG91dGxldDogJ3Jlc3VsdHNMaXN0JywgY2xhc3M6ICdzZWFyY2gtY29sb3JzLXJlc3VsdHMgcmVzdWx0cy12aWV3IGxpc3QtdHJlZSBmb2N1c2FibGUtcGFuZWwgaGFzLWNvbGxhcHNhYmxlLWNoaWxkcmVuIG5hdGl2ZS1rZXktYmluZGluZ3MnLCB0YWJpbmRleDogLTFcblxuICBjcmVhdGVkQ2FsbGJhY2s6IC0+XG4gICAge1JhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBDb21wb3NpdGVEaXNwb3NhYmxlP1xuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBwYXRoTWFwcGluZyA9IHt9XG5cbiAgICBAZmlsZXMgPSAwXG4gICAgQGNvbG9ycyA9IDBcblxuICAgIEBsb2FkaW5nTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHN1YnNjcmliZVRvIHRoaXMsICcubGlzdC1uZXN0ZWQtaXRlbSA+IC5saXN0LWl0ZW0nLFxuICAgICAgY2xpY2s6IChlKSAtPlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGZpbGVJdGVtID0gQW5jZXN0b3JzTWV0aG9kcy5wYXJlbnRzKGUudGFyZ2V0LCcubGlzdC1uZXN0ZWQtaXRlbScpWzBdXG4gICAgICAgIGZpbGVJdGVtLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHN1YnNjcmliZVRvIHRoaXMsICcuc2VhcmNoLXJlc3VsdCcsXG4gICAgICBjbGljazogKGUpID0+XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgbWF0Y2hJdGVtID0gaWYgZS50YXJnZXQubWF0Y2hlcygnLnNlYXJjaC1yZXN1bHQnKVxuICAgICAgICAgIGUudGFyZ2V0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBBbmNlc3RvcnNNZXRob2RzLnBhcmVudHMoZS50YXJnZXQsJy5zZWFyY2gtcmVzdWx0JylbMF1cblxuICAgICAgICBmaWxlSXRlbSA9IEFuY2VzdG9yc01ldGhvZHMucGFyZW50cyhtYXRjaEl0ZW0sJy5saXN0LW5lc3RlZC1pdGVtJylbMF1cbiAgICAgICAgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtcbiAgICAgICAgICBtYXRjaEl0ZW0uZGF0YXNldC5zdGFydC5zcGxpdCgnLCcpLm1hcChOdW1iZXIpXG4gICAgICAgICAgbWF0Y2hJdGVtLmRhdGFzZXQuZW5kLnNwbGl0KCcsJykubWFwKE51bWJlcilcbiAgICAgICAgXSlcbiAgICAgICAgcGF0aEF0dHJpYnV0ZSA9IGZpbGVJdGVtLmRhdGFzZXQucGF0aFxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEBwYXRoTWFwcGluZ1twYXRoQXR0cmlidXRlXSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlLCBhdXRvc2Nyb2xsOiB0cnVlKVxuXG4gIHNldE1vZGVsOiAoQGNvbG9yU2VhcmNoKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JTZWFyY2gub25EaWRGaW5kTWF0Y2hlcyAocmVzdWx0KSA9PlxuICAgICAgQGFkZEZpbGVSZXN1bHQocmVzdWx0KVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvclNlYXJjaC5vbkRpZENvbXBsZXRlU2VhcmNoID0+XG4gICAgICBAc2VhcmNoQ29tcGxldGUoKVxuXG4gICAgQGNvbG9yU2VhcmNoLnNlYXJjaCgpXG5cbiAgYWRkRmlsZVJlc3VsdDogKHJlc3VsdCkgLT5cbiAgICBAZmlsZXMgKz0gMVxuICAgIEBjb2xvcnMgKz0gcmVzdWx0Lm1hdGNoZXMubGVuZ3RoXG5cbiAgICBAcmVzdWx0c0xpc3QuaW5uZXJIVE1MICs9IEBjcmVhdGVGaWxlUmVzdWx0KHJlc3VsdClcbiAgICBAdXBkYXRlTWVzc2FnZSgpXG5cbiAgc2VhcmNoQ29tcGxldGU6IC0+XG4gICAgQHVwZGF0ZU1lc3NhZ2UoKVxuXG4gICAgaWYgQGNvbG9ycyBpcyAwXG4gICAgICBAcGFuZS5jbGFzc0xpc3QuYWRkICduby1yZXN1bHRzJ1xuICAgICAgQHBhbmUuYXBwZW5kQ2hpbGQgXCJcIlwiXG4gICAgICA8dWwgY2xhc3M9J2NlbnRlcmVkIGJhY2tncm91bmQtbWVzc2FnZSBuby1yZXN1bHRzLW92ZXJsYXknPlxuICAgICAgICA8bGk+Tm8gUmVzdWx0czwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgXCJcIlwiXG5cbiAgdXBkYXRlTWVzc2FnZTogLT5cbiAgICBmaWxlc1N0cmluZyA9IGlmIEBmaWxlcyBpcyAxIHRoZW4gJ2ZpbGUnIGVsc2UgJ2ZpbGVzJ1xuXG4gICAgQHByZXZpZXdDb3VudC5pbm5lckhUTUwgPSBpZiBAY29sb3JzID4gMFxuICAgICAgXCJcIlwiXG4gICAgICA8c3BhbiBjbGFzcz0ndGV4dC1pbmZvJz5cbiAgICAgICAgI3tAY29sb3JzfSBjb2xvcnNcbiAgICAgIDwvc3Bhbj5cbiAgICAgIGZvdW5kIGluXG4gICAgICA8c3BhbiBjbGFzcz0ndGV4dC1pbmZvJz5cbiAgICAgICAgI3tAZmlsZXN9ICN7ZmlsZXNTdHJpbmd9XG4gICAgICA8L3NwYW4+XG4gICAgICBcIlwiXCJcbiAgICBlbHNlXG4gICAgICBcIk5vIGNvbG9ycyBmb3VuZCBpbiAje0BmaWxlc30gI3tmaWxlc1N0cmluZ31cIlxuXG4gIGNyZWF0ZUZpbGVSZXN1bHQ6IChmaWxlUmVzdWx0KSAtPlxuICAgIF8gPz0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuICAgIHBhdGggPz0gcmVxdWlyZSAncGF0aCdcblxuICAgIHtmaWxlUGF0aCxtYXRjaGVzfSA9IGZpbGVSZXN1bHRcbiAgICBmaWxlQmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKVxuXG4gICAgcGF0aEF0dHJpYnV0ZSA9IF8uZXNjYXBlQXR0cmlidXRlKGZpbGVQYXRoKVxuICAgIEBwYXRoTWFwcGluZ1twYXRoQXR0cmlidXRlXSA9IGZpbGVQYXRoXG4gICAgcGF0aE5hbWUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZShmaWxlUGF0aClcblxuICAgIFwiXCJcIlxuICAgIDxsaSBjbGFzcz1cInBhdGggbGlzdC1uZXN0ZWQtaXRlbVwiIGRhdGEtcGF0aD1cIiN7cGF0aEF0dHJpYnV0ZX1cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYXRoLWRldGFpbHMgbGlzdC1pdGVtXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZGlzY2xvc3VyZS1hcnJvd1wiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tZmlsZS10ZXh0XCIgZGF0YS1uYW1lPVwiI3tmaWxlQmFzZW5hbWV9XCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInBhdGgtbmFtZSBicmlnaHRcIj4je3BhdGhOYW1lfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwYXRoLW1hdGNoLW51bWJlclwiPigje21hdGNoZXMubGVuZ3RofSk8L3NwYW4+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDx1bCBjbGFzcz1cIm1hdGNoZXMgbGlzdC10cmVlXCI+XG4gICAgICAgICN7bWF0Y2hlcy5tYXAoKG1hdGNoKSA9PiBAY3JlYXRlTWF0Y2hSZXN1bHQgbWF0Y2gpLmpvaW4oJycpfVxuICAgICAgPC91bD5cbiAgICA8L2xpPlwiXCJcIlxuXG4gIGNyZWF0ZU1hdGNoUmVzdWx0OiAobWF0Y2gpIC0+XG4gICAge1JhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBDb21wb3NpdGVEaXNwb3NhYmxlP1xuXG4gICAgdGV4dENvbG9yID0gaWYgbWF0Y2guY29sb3IubHVtYSA+IDAuNDNcbiAgICAgICdibGFjaydcbiAgICBlbHNlXG4gICAgICAnd2hpdGUnXG5cbiAgICB7ZmlsZVBhdGgsIHJhbmdlfSA9IG1hdGNoXG5cbiAgICByYW5nZSA9IFJhbmdlLmZyb21PYmplY3QocmFuZ2UpXG4gICAgbWF0Y2hTdGFydCA9IHJhbmdlLnN0YXJ0LmNvbHVtbiAtIG1hdGNoLmxpbmVUZXh0T2Zmc2V0XG4gICAgbWF0Y2hFbmQgPSByYW5nZS5lbmQuY29sdW1uIC0gbWF0Y2gubGluZVRleHRPZmZzZXRcbiAgICBwcmVmaXggPSByZW1vdmVMZWFkaW5nV2hpdGVzcGFjZShtYXRjaC5saW5lVGV4dFswLi4ubWF0Y2hTdGFydF0pXG4gICAgc3VmZml4ID0gbWF0Y2gubGluZVRleHRbbWF0Y2hFbmQuLl1cbiAgICBsaW5lTnVtYmVyID0gcmFuZ2Uuc3RhcnQucm93ICsgMVxuICAgIHN0eWxlID0gJydcbiAgICBzdHlsZSArPSBcImJhY2tncm91bmQ6ICN7bWF0Y2guY29sb3IudG9DU1MoKX07XCJcbiAgICBzdHlsZSArPSBcImNvbG9yOiAje3RleHRDb2xvcn07XCJcblxuICAgIFwiXCJcIlxuICAgIDxsaSBjbGFzcz1cInNlYXJjaC1yZXN1bHQgbGlzdC1pdGVtXCIgZGF0YS1zdGFydD1cIiN7cmFuZ2Uuc3RhcnQucm93fSwje3JhbmdlLnN0YXJ0LmNvbHVtbn1cIiBkYXRhLWVuZD1cIiN7cmFuZ2UuZW5kLnJvd30sI3tyYW5nZS5lbmQuY29sdW1ufVwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJsaW5lLW51bWJlciB0ZXh0LXN1YnRsZVwiPiN7bGluZU51bWJlcn08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInByZXZpZXdcIj5cbiAgICAgICAgI3twcmVmaXh9XG4gICAgICAgIDxzcGFuIGNsYXNzPSdtYXRjaCBjb2xvci1tYXRjaCcgc3R5bGU9JyN7c3R5bGV9Jz4je21hdGNoLm1hdGNoVGV4dH08L3NwYW4+XG4gICAgICAgICN7c3VmZml4fVxuICAgICAgPC9zcGFuPlxuICAgIDwvbGk+XG4gICAgXCJcIlwiXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvclJlc3VsdHNFbGVtZW50ID1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCAncGlnbWVudHMtY29sb3ItcmVzdWx0cycsIHtcbiAgcHJvdG90eXBlOiBDb2xvclJlc3VsdHNFbGVtZW50LnByb3RvdHlwZVxufVxuIl19

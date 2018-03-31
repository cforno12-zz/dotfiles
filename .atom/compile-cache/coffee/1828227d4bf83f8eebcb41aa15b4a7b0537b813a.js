(function() {
  var manuallyIndented;

  manuallyIndented = new WeakSet();

  module.exports = {
    getIndentation: function(editor) {
      var indentationName, softTabs, tabLength;
      softTabs = editor.getSoftTabs();
      tabLength = editor.getTabLength();
      if (softTabs) {
        indentationName = tabLength + ' Spaces';
      } else {
        indentationName = 'Tabs (' + tabLength + ' wide)';
      }
      return indentationName;
    },
    getIndentations: function() {
      return atom.config.get("auto-detect-indentation.indentationTypes");
    },
    autoDetectIndentation: function(editor) {
      var firstSpaces, found, i, j, length, lineCount, numLinesWithSpaces, numLinesWithTabs, ref, shortest, softTabs, spaceChars, tabLength;
      lineCount = editor.getLineCount();
      shortest = 0;
      numLinesWithTabs = 0;
      numLinesWithSpaces = 0;
      found = false;
      for (i = j = 0, ref = lineCount - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (!(i < 100 || !found)) {
          continue;
        }
        if (editor.isBufferRowCommented(i)) {
          continue;
        }
        firstSpaces = editor.lineTextForBufferRow(i).match(/^([ \t]+)[^ \t]/m);
        if (firstSpaces) {
          spaceChars = firstSpaces[1];
          if (spaceChars[0] === '\t') {
            numLinesWithTabs++;
          } else {
            length = spaceChars.length;
            if (length === 1) {
              continue;
            }
            numLinesWithSpaces++;
            if (length < shortest || shortest === 0) {
              shortest = length;
            }
          }
          found = true;
        }
      }
      softTabs = null;
      tabLength = null;
      if (found) {
        if (numLinesWithTabs > numLinesWithSpaces) {
          softTabs = false;
        } else {
          softTabs = true;
          tabLength = shortest;
        }
      }
      return {
        softTabs: softTabs,
        tabLength: tabLength
      };
    },
    setIndentation: function(editor, indentation, automatic) {
      if (automatic == null) {
        automatic = false;
      }
      if (!automatic) {
        manuallyIndented.add(editor);
      }
      if (indentation.softTabs != null) {
        editor.setSoftTabs(indentation.softTabs);
      } else {
        editor.setSoftTabs(atom.config.get("editor.softTabs", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
      }
      if (indentation.tabLength != null) {
        return editor.setTabLength(indentation.tabLength);
      } else {
        return editor.setTabLength(atom.config.get("editor.tabLength", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
      }
    },
    isManuallyIndented: function(editor) {
      return manuallyIndented.has(editor);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvLWRldGVjdC1pbmRlbnRhdGlvbi9saWIvaW5kZW50YXRpb24tbWFuYWdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGdCQUFBLEdBQXVCLElBQUEsT0FBQSxDQUFBOztFQUV2QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsY0FBQSxFQUFnQixTQUFDLE1BQUQ7QUFDZCxVQUFBO01BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxXQUFQLENBQUE7TUFDWCxTQUFBLEdBQVksTUFBTSxDQUFDLFlBQVAsQ0FBQTtNQUNaLElBQUcsUUFBSDtRQUNFLGVBQUEsR0FBa0IsU0FBQSxHQUFZLFVBRGhDO09BQUEsTUFBQTtRQUdFLGVBQUEsR0FBa0IsUUFBQSxHQUFXLFNBQVgsR0FBdUIsU0FIM0M7O2FBSUE7SUFQYyxDQUFoQjtJQVNBLGVBQUEsRUFBaUIsU0FBQTthQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQ0FBaEI7SUFEZSxDQVRqQjtJQVlBLHFCQUFBLEVBQXVCLFNBQUMsTUFBRDtBQUNyQixVQUFBO01BQUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQUE7TUFDWixRQUFBLEdBQVc7TUFDWCxnQkFBQSxHQUFtQjtNQUNuQixrQkFBQSxHQUFxQjtNQUNyQixLQUFBLEdBQVE7QUFHUixXQUFTLHdGQUFUO2NBQWdDLENBQUEsR0FBSSxHQUFKLElBQVcsQ0FBSTs7O1FBRzdDLElBQVksTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVo7QUFBQSxtQkFBQTs7UUFFQSxXQUFBLEdBQWMsTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQThCLENBQUMsS0FBL0IsQ0FBcUMsa0JBQXJDO1FBRWQsSUFBRyxXQUFIO1VBQ0UsVUFBQSxHQUFhLFdBQVksQ0FBQSxDQUFBO1VBRXpCLElBQUcsVUFBVyxDQUFBLENBQUEsQ0FBWCxLQUFpQixJQUFwQjtZQUNFLGdCQUFBLEdBREY7V0FBQSxNQUFBO1lBR0UsTUFBQSxHQUFTLFVBQVUsQ0FBQztZQUdwQixJQUFZLE1BQUEsS0FBVSxDQUF0QjtBQUFBLHVCQUFBOztZQUVBLGtCQUFBO1lBRUEsSUFBcUIsTUFBQSxHQUFTLFFBQVQsSUFBcUIsUUFBQSxLQUFZLENBQXREO2NBQUEsUUFBQSxHQUFXLE9BQVg7YUFWRjs7VUFZQSxLQUFBLEdBQVEsS0FmVjs7QUFQRjtNQXdCQSxRQUFBLEdBQVc7TUFDWCxTQUFBLEdBQVk7TUFFWixJQUFHLEtBQUg7UUFDRSxJQUFHLGdCQUFBLEdBQW1CLGtCQUF0QjtVQUNFLFFBQUEsR0FBVyxNQURiO1NBQUEsTUFBQTtVQUdFLFFBQUEsR0FBVztVQUNYLFNBQUEsR0FBWSxTQUpkO1NBREY7O0FBT0EsYUFDRTtRQUFBLFFBQUEsRUFBVSxRQUFWO1FBQ0EsU0FBQSxFQUFXLFNBRFg7O0lBM0NtQixDQVp2QjtJQTJEQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsU0FBdEI7O1FBQXNCLFlBQVk7O01BQ2hELElBQUEsQ0FBTyxTQUFQO1FBQ0UsZ0JBQWdCLENBQUMsR0FBakIsQ0FBcUIsTUFBckIsRUFERjs7TUFHQSxJQUFHLDRCQUFIO1FBQ0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsV0FBVyxDQUFDLFFBQS9CLEVBREY7T0FBQSxNQUFBO1FBR0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQztVQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsc0JBQVAsQ0FBQSxDQUErQixDQUFDLE1BQXZDO1NBQW5DLENBQW5CLEVBSEY7O01BS0EsSUFBRyw2QkFBSDtlQUNFLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFdBQVcsQ0FBQyxTQUFoQyxFQURGO09BQUEsTUFBQTtlQUdFLE1BQU0sQ0FBQyxZQUFQLENBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsRUFBb0M7VUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQyxNQUF2QztTQUFwQyxDQUFwQixFQUhGOztJQVRjLENBM0RoQjtJQXlFQSxrQkFBQSxFQUFvQixTQUFDLE1BQUQ7QUFDbEIsYUFBTyxnQkFBZ0IsQ0FBQyxHQUFqQixDQUFxQixNQUFyQjtJQURXLENBekVwQjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIm1hbnVhbGx5SW5kZW50ZWQgPSBuZXcgV2Vha1NldCgpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0SW5kZW50YXRpb246IChlZGl0b3IpIC0+XG4gICAgc29mdFRhYnMgPSBlZGl0b3IuZ2V0U29mdFRhYnMoKVxuICAgIHRhYkxlbmd0aCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgIGlmIHNvZnRUYWJzXG4gICAgICBpbmRlbnRhdGlvbk5hbWUgPSB0YWJMZW5ndGggKyAnIFNwYWNlcydcbiAgICBlbHNlXG4gICAgICBpbmRlbnRhdGlvbk5hbWUgPSAnVGFicyAoJyArIHRhYkxlbmd0aCArICcgd2lkZSknXG4gICAgaW5kZW50YXRpb25OYW1lXG5cbiAgZ2V0SW5kZW50YXRpb25zOiAtPlxuICAgIGF0b20uY29uZmlnLmdldChcImF1dG8tZGV0ZWN0LWluZGVudGF0aW9uLmluZGVudGF0aW9uVHlwZXNcIilcblxuICBhdXRvRGV0ZWN0SW5kZW50YXRpb246IChlZGl0b3IpIC0+XG4gICAgbGluZUNvdW50ID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG4gICAgc2hvcnRlc3QgPSAwXG4gICAgbnVtTGluZXNXaXRoVGFicyA9IDBcbiAgICBudW1MaW5lc1dpdGhTcGFjZXMgPSAwXG4gICAgZm91bmQgPSBmYWxzZVxuXG4gICAgIyBsb29wIHRocm91Z2ggbW9yZSB0aGFuIDEwMCBsaW5lcyBvbmx5IGlmIHdlIGhhdmVuJ3QgZm91bmQgYW55IHNwYWNlcyB5ZXRcbiAgICBmb3IgaSBpbiBbMC4ubGluZUNvdW50LTFdIHdoZW4gKGkgPCAxMDAgb3Igbm90IGZvdW5kKVxuXG4gICAgICAjIFNraXAgY29tbWVudHNcbiAgICAgIGNvbnRpbnVlIGlmIGVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZCBpXG5cbiAgICAgIGZpcnN0U3BhY2VzID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGkpLm1hdGNoIC9eKFsgXFx0XSspW14gXFx0XS9tXG5cbiAgICAgIGlmIGZpcnN0U3BhY2VzXG4gICAgICAgIHNwYWNlQ2hhcnMgPSBmaXJzdFNwYWNlc1sxXVxuXG4gICAgICAgIGlmIHNwYWNlQ2hhcnNbMF0gaXMgJ1xcdCdcbiAgICAgICAgICBudW1MaW5lc1dpdGhUYWJzKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxlbmd0aCA9IHNwYWNlQ2hhcnMubGVuZ3RoXG5cbiAgICAgICAgICAjIGFzc3VtZSBub2JvZHkgdXNlcyBzaW5nbGUgc3BhY2Ugc3BhY2luZ1xuICAgICAgICAgIGNvbnRpbnVlIGlmIGxlbmd0aCBpcyAxXG5cbiAgICAgICAgICBudW1MaW5lc1dpdGhTcGFjZXMrK1xuXG4gICAgICAgICAgc2hvcnRlc3QgPSBsZW5ndGggaWYgbGVuZ3RoIDwgc2hvcnRlc3Qgb3Igc2hvcnRlc3QgaXMgMFxuXG4gICAgICAgIGZvdW5kID0gdHJ1ZVxuXG4gICAgc29mdFRhYnMgPSBudWxsXG4gICAgdGFiTGVuZ3RoID0gbnVsbFxuXG4gICAgaWYgZm91bmRcbiAgICAgIGlmIG51bUxpbmVzV2l0aFRhYnMgPiBudW1MaW5lc1dpdGhTcGFjZXNcbiAgICAgICAgc29mdFRhYnMgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBzb2Z0VGFicyA9IHRydWVcbiAgICAgICAgdGFiTGVuZ3RoID0gc2hvcnRlc3RcblxuICAgIHJldHVybiAoXG4gICAgICBzb2Z0VGFiczogc29mdFRhYnNcbiAgICAgIHRhYkxlbmd0aDogdGFiTGVuZ3RoXG4gICAgKVxuXG4gIHNldEluZGVudGF0aW9uOiAoZWRpdG9yLCBpbmRlbnRhdGlvbiwgYXV0b21hdGljID0gZmFsc2UpIC0+XG4gICAgdW5sZXNzIGF1dG9tYXRpY1xuICAgICAgbWFudWFsbHlJbmRlbnRlZC5hZGQoZWRpdG9yKVxuICAgIFxuICAgIGlmIGluZGVudGF0aW9uLnNvZnRUYWJzP1xuICAgICAgZWRpdG9yLnNldFNvZnRUYWJzIGluZGVudGF0aW9uLnNvZnRUYWJzXG4gICAgZWxzZVxuICAgICAgZWRpdG9yLnNldFNvZnRUYWJzIGF0b20uY29uZmlnLmdldChcImVkaXRvci5zb2Z0VGFic1wiLCBzY29wZTogZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKS5zY29wZXMpXG4gICAgXG4gICAgaWYgaW5kZW50YXRpb24udGFiTGVuZ3RoP1xuICAgICAgZWRpdG9yLnNldFRhYkxlbmd0aCBpbmRlbnRhdGlvbi50YWJMZW5ndGhcbiAgICBlbHNlXG4gICAgICBlZGl0b3Iuc2V0VGFiTGVuZ3RoIGF0b20uY29uZmlnLmdldChcImVkaXRvci50YWJMZW5ndGhcIiwgc2NvcGU6IGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzKVxuXG4gIGlzTWFudWFsbHlJbmRlbnRlZDogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gbWFudWFsbHlJbmRlbnRlZC5oYXMgZWRpdG9yXG4iXX0=

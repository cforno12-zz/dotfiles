(function() {
  var CompositeDisposable, EmacsCursor, EmacsEditor, KillRing, Mark, State,
    slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  EmacsCursor = require('./emacs-cursor');

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  State = require('./state');

  module.exports = EmacsEditor = (function() {
    var capitalize, downcase, upcase;

    EmacsEditor["for"] = function(editor) {
      return editor._atomicEmacs != null ? editor._atomicEmacs : editor._atomicEmacs = new EmacsEditor(editor);
    };

    function EmacsEditor(editor1) {
      this.editor = editor1;
      this.disposable = new CompositeDisposable;
      this.disposable.add(this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          var cursors;
          cursors = _this.editor.getCursors();
          if (cursors.length === 1) {
            return EmacsCursor["for"](cursors[0]).clearLocalKillRing();
          }
        };
      })(this)));
      this.disposable.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
    }

    EmacsEditor.prototype.destroy = function() {
      var cursor, i, len, ref;
      ref = this.getEmacsCursors();
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        cursor.destroy();
      }
      return this.disposable.dispose();
    };

    EmacsEditor.prototype.getEmacsCursors = function() {
      var c, i, len, ref, results;
      ref = this.editor.getCursors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(EmacsCursor["for"](c));
      }
      return results;
    };

    EmacsEditor.prototype.moveEmacsCursors = function(callback) {
      return this.editor.moveCursors(function(cursor) {
        if (cursor.destroyed === true) {
          return;
        }
        return callback(EmacsCursor["for"](cursor), cursor);
      });
    };


    /*
    Section: Navigation
     */

    EmacsEditor.prototype.backwardChar = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveLeft();
      });
    };

    EmacsEditor.prototype.forwardChar = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveRight();
      });
    };

    EmacsEditor.prototype.backwardWord = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        emacsCursor.skipNonWordCharactersBackward();
        return emacsCursor.skipWordCharactersBackward();
      });
    };

    EmacsEditor.prototype.forwardWord = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        emacsCursor.skipNonWordCharactersForward();
        return emacsCursor.skipWordCharactersForward();
      });
    };

    EmacsEditor.prototype.backwardSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipSexpBackward();
      });
    };

    EmacsEditor.prototype.forwardSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipSexpForward();
      });
    };

    EmacsEditor.prototype.backwardList = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipListBackward();
      });
    };

    EmacsEditor.prototype.forwardList = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.skipListForward();
      });
    };

    EmacsEditor.prototype.previousLine = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveUp();
      });
    };

    EmacsEditor.prototype.nextLine = function() {
      return this.editor.moveCursors(function(cursor) {
        return cursor.moveDown();
      });
    };

    EmacsEditor.prototype.backwardParagraph = function() {
      return this.moveEmacsCursors(function(emacsCursor, cursor) {
        var position;
        position = cursor.getBufferPosition();
        if (position.row !== 0) {
          cursor.setBufferPosition([position.row - 1, 0]);
        }
        return emacsCursor.goToMatchStartBackward(/^\s*$/) || cursor.moveToTop();
      });
    };

    EmacsEditor.prototype.forwardParagraph = function() {
      var lastRow;
      lastRow = this.editor.getLastBufferRow();
      return this.moveEmacsCursors(function(emacsCursor, cursor) {
        var position;
        position = cursor.getBufferPosition();
        if (position.row !== lastRow) {
          cursor.setBufferPosition([position.row + 1, 0]);
        }
        return emacsCursor.goToMatchStartForward(/^\s*$/) || cursor.moveToBottom();
      });
    };

    EmacsEditor.prototype.backToIndentation = function() {
      return this.editor.moveCursors((function(_this) {
        return function(cursor) {
          var line, position, targetColumn;
          position = cursor.getBufferPosition();
          line = _this.editor.lineTextForBufferRow(position.row);
          targetColumn = line.search(/\S/);
          if (targetColumn === -1) {
            targetColumn = line.length;
          }
          if (position.column !== targetColumn) {
            return cursor.setBufferPosition([position.row, targetColumn]);
          }
        };
      })(this));
    };


    /*
    Section: Killing & Yanking
     */

    EmacsEditor.prototype.backwardKillWord = function() {
      var method;
      this._pullFromClipboard();
      method = State.killing ? 'prepend' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor, cursor) {
            return emacsCursor.backwardKillWord(method);
          });
        };
      })(this));
      this._updateGlobalKillRing(method);
      return State.killed();
    };

    EmacsEditor.prototype.killWord = function() {
      var method;
      this._pullFromClipboard();
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.killWord(method);
          });
        };
      })(this));
      this._updateGlobalKillRing(method);
      return State.killed();
    };

    EmacsEditor.prototype.killLine = function() {
      var method;
      this._pullFromClipboard();
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.killLine(method);
          });
        };
      })(this));
      this._updateGlobalKillRing(method);
      return State.killed();
    };

    EmacsEditor.prototype.killRegion = function() {
      var method;
      this._pullFromClipboard();
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.killRegion(method);
          });
        };
      })(this));
      this._updateGlobalKillRing(method);
      return State.killed();
    };

    EmacsEditor.prototype.copyRegionAsKill = function() {
      var method;
      this._pullFromClipboard();
      method = State.killing ? 'append' : 'push';
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results, selection;
          ref = _this.editor.getSelections();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            selection = ref[i];
            emacsCursor = EmacsCursor["for"](selection.cursor);
            emacsCursor.killRing()[method](selection.getText());
            emacsCursor.killRing().getCurrentEntry();
            results.push(emacsCursor.mark().deactivate());
          }
          return results;
        };
      })(this));
      return this._updateGlobalKillRing(method);
    };

    EmacsEditor.prototype.yank = function() {
      this._pullFromClipboard();
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            results.push(emacsCursor.yank());
          }
          return results;
        };
      })(this));
      return State.yanked();
    };

    EmacsEditor.prototype.yankPop = function() {
      if (!State.yanking) {
        return;
      }
      this._pullFromClipboard();
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            results.push(emacsCursor.rotateYank(-1));
          }
          return results;
        };
      })(this));
      return State.yanked();
    };

    EmacsEditor.prototype.yankShift = function() {
      if (!State.yanking) {
        return;
      }
      this._pullFromClipboard();
      this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            results.push(emacsCursor.rotateYank(1));
          }
          return results;
        };
      })(this));
      return State.yanked();
    };

    EmacsEditor.prototype._pushToClipboard = function() {
      if (atom.config.get("atomic-emacs.killToClipboard")) {
        return KillRing.pushToClipboard();
      }
    };

    EmacsEditor.prototype._pullFromClipboard = function() {
      var c, killRings;
      if (atom.config.get("atomic-emacs.yankFromClipboard")) {
        killRings = (function() {
          var i, len, ref, results;
          ref = this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            c = ref[i];
            results.push(c.killRing());
          }
          return results;
        }).call(this);
        return KillRing.pullFromClipboard(killRings);
      }
    };

    EmacsEditor.prototype._updateGlobalKillRing = function(method) {
      var c, kills;
      if (this.editor.hasMultipleCursors()) {
        kills = (function() {
          var i, len, ref, results;
          ref = this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            c = ref[i];
            results.push(c.killRing().getCurrentEntry());
          }
          return results;
        }).call(this);
        if (method !== 'push') {
          method = 'replace';
        }
        KillRing.global[method](kills.join('\n') + '\n');
      }
      return this._pushToClipboard();
    };


    /*
    Section: Editing
     */

    EmacsEditor.prototype.deleteHorizontalSpace = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            var range;
            range = emacsCursor.horizontalSpaceRange();
            return _this.editor.setTextInBufferRange(range, '');
          });
        };
      })(this));
    };

    EmacsEditor.prototype.deleteIndentation = function() {
      if (!this.editor) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          _this.editor.moveUp();
          return _this.editor.joinLines();
        };
      })(this));
    };

    EmacsEditor.prototype.openLine = function() {
      return this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            results.push(emacsCursor.insertAfter("\n"));
          }
          return results;
        };
      })(this));
    };

    EmacsEditor.prototype.justOneSpace = function() {
      return this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, range, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            range = emacsCursor.horizontalSpaceRange();
            results.push(_this.editor.setTextInBufferRange(range, ' '));
          }
          return results;
        };
      })(this));
    };

    EmacsEditor.prototype.deleteBlankLines = function() {
      return this.editor.transact((function(_this) {
        return function() {
          var emacsCursor, i, len, ref, results;
          ref = _this.getEmacsCursors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            emacsCursor = ref[i];
            results.push(emacsCursor.deleteBlankLines());
          }
          return results;
        };
      })(this));
    };

    EmacsEditor.prototype.transposeChars = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeChars();
          });
        };
      })(this));
    };

    EmacsEditor.prototype.transposeWords = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeWords();
          });
        };
      })(this));
    };

    EmacsEditor.prototype.transposeLines = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeLines();
          });
        };
      })(this));
    };

    EmacsEditor.prototype.transposeSexps = function() {
      return this.editor.transact((function(_this) {
        return function() {
          return _this.moveEmacsCursors(function(emacsCursor) {
            return emacsCursor.transposeSexps();
          });
        };
      })(this));
    };

    downcase = function(s) {
      return s.toLowerCase();
    };

    upcase = function(s) {
      return s.toUpperCase();
    };

    capitalize = function(s) {
      return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    };

    EmacsEditor.prototype.downcaseWordOrRegion = function() {
      return this._transformWordOrRegion(downcase);
    };

    EmacsEditor.prototype.upcaseWordOrRegion = function() {
      return this._transformWordOrRegion(upcase);
    };

    EmacsEditor.prototype.capitalizeWordOrRegion = function() {
      return this._transformWordOrRegion(capitalize, {
        wordAtATime: true
      });
    };

    EmacsEditor.prototype._transformWordOrRegion = function(transformWord, arg) {
      var wordAtATime;
      wordAtATime = (arg != null ? arg : {}).wordAtATime;
      return this.editor.transact((function(_this) {
        return function() {
          var cursor, i, len, ref;
          if (_this.editor.getSelections().filter(function(s) {
            return !s.isEmpty();
          }).length > 0) {
            return _this.editor.mutateSelectedText(function(selection) {
              var range;
              range = selection.getBufferRange();
              if (wordAtATime) {
                return _this.editor.scanInBufferRange(/\w+/g, range, function(hit) {
                  return hit.replace(transformWord(hit.matchText));
                });
              } else {
                return _this.editor.setTextInBufferRange(range, transformWord(selection.getText()));
              }
            });
          } else {
            ref = _this.editor.getCursors();
            for (i = 0, len = ref.length; i < len; i++) {
              cursor = ref[i];
              cursor.emitter.__track = true;
            }
            return _this.moveEmacsCursors(function(emacsCursor) {
              return emacsCursor.transformWord(transformWord);
            });
          }
        };
      })(this));
    };


    /*
    Section: Marking & Selecting
     */

    EmacsEditor.prototype.setMark = function() {
      var emacsCursor, i, len, ref, results;
      ref = this.getEmacsCursors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        emacsCursor = ref[i];
        results.push(emacsCursor.mark().set().activate());
      }
      return results;
    };

    EmacsEditor.prototype.markSexp = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.markSexp();
      });
    };

    EmacsEditor.prototype.markWholeBuffer = function() {
      var c, emacsCursor, first, i, len, ref, rest;
      ref = this.editor.getCursors(), first = ref[0], rest = 2 <= ref.length ? slice.call(ref, 1) : [];
      for (i = 0, len = rest.length; i < len; i++) {
        c = rest[i];
        c.destroy();
      }
      emacsCursor = EmacsCursor["for"](first);
      first.moveToBottom();
      emacsCursor.mark().set().activate();
      return first.moveToTop();
    };

    EmacsEditor.prototype.exchangePointAndMark = function() {
      return this.moveEmacsCursors(function(emacsCursor) {
        return emacsCursor.mark().exchange();
      });
    };


    /*
    Section: UI
     */

    EmacsEditor.prototype.recenterTopBottom = function() {
      var c, maxOffset, maxRow, minOffset, minRow, view;
      if (!this.editor) {
        return;
      }
      view = atom.views.getView(this.editor);
      minRow = Math.min.apply(Math, (function() {
        var i, len, ref, results;
        ref = this.editor.getCursors();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          c = ref[i];
          results.push(c.getBufferRow());
        }
        return results;
      }).call(this));
      maxRow = Math.max.apply(Math, (function() {
        var i, len, ref, results;
        ref = this.editor.getCursors();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          c = ref[i];
          results.push(c.getBufferRow());
        }
        return results;
      }).call(this));
      minOffset = view.pixelPositionForBufferPosition([minRow, 0]);
      maxOffset = view.pixelPositionForBufferPosition([maxRow, 0]);
      switch (State.recenters) {
        case 0:
          view.setScrollTop((minOffset.top + maxOffset.top - view.getHeight()) / 2);
          break;
        case 1:
          view.setScrollTop(minOffset.top - 2 * this.editor.getLineHeightInPixels());
          break;
        case 2:
          view.setScrollTop(maxOffset.top + 3 * this.editor.getLineHeightInPixels() - view.getHeight());
      }
      return State.recentered();
    };

    EmacsEditor.prototype.scrollUp = function() {
      var currentRow, firstRow, lastRow, rowCount, visibleRowRange;
      if ((visibleRowRange = this.editor.getVisibleRowRange())) {
        if (!visibleRowRange.every((function(_this) {
          return function(e) {
            return !Number.isNaN(e);
          };
        })(this))) {
          return;
        }
        firstRow = visibleRowRange[0], lastRow = visibleRowRange[1];
        currentRow = this.editor.cursors[0].getBufferRow();
        rowCount = (lastRow - firstRow) - 2;
        return this.editor.moveDown(rowCount);
      }
    };

    EmacsEditor.prototype.scrollDown = function() {
      var currentRow, firstRow, lastRow, rowCount, visibleRowRange;
      if ((visibleRowRange = this.editor.getVisibleRowRange())) {
        if (!visibleRowRange.every((function(_this) {
          return function(e) {
            return !Number.isNaN(e);
          };
        })(this))) {
          return;
        }
        firstRow = visibleRowRange[0], lastRow = visibleRowRange[1];
        currentRow = this.editor.cursors[0].getBufferRow();
        rowCount = (lastRow - firstRow) - 2;
        return this.editor.moveUp(rowCount);
      }
    };


    /*
    Section: Other
     */

    EmacsEditor.prototype.keyboardQuit = function() {
      var emacsCursor, i, len, ref, results;
      ref = this.getEmacsCursors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        emacsCursor = ref[i];
        results.push(emacsCursor.mark().deactivate());
      }
      return results;
    };

    return EmacsEditor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2VtYWNzLWVkaXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ1AsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixRQUFBOztJQUFBLFdBQUMsRUFBQSxHQUFBLEVBQUQsR0FBTSxTQUFDLE1BQUQ7MkNBQ0osTUFBTSxDQUFDLGVBQVAsTUFBTSxDQUFDLGVBQW9CLElBQUEsV0FBQSxDQUFZLE1BQVo7SUFEdkI7O0lBR08scUJBQUMsT0FBRDtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQ1osSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJO01BQ2xCLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUN4QyxjQUFBO1VBQUEsT0FBQSxHQUFVLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBO1VBQ1YsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjttQkFDRSxXQUFXLEVBQUMsR0FBRCxFQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENBQXhCLENBQTJCLENBQUMsa0JBQTVCLENBQUEsRUFERjs7UUFGd0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBQWhCO01BSUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxN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LEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFuQixDQUFIO1FBRUUsSUFBQSxDQUFjLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxNQUFNLENBQUMsS0FBUCxDQUFhLENBQWI7VUFBUjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0FBZDtBQUFBLGlCQUFBOztRQUVDLDZCQUFELEVBQVU7UUFDVixVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBbkIsQ0FBQTtRQUNiLFFBQUEsR0FBVyxDQUFDLE9BQUEsR0FBVSxRQUFYLENBQUEsR0FBdUI7ZUFDbEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsUUFBZixFQVBGOztJQURVOzs7QUFVWjs7OzswQkFJQSxZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUNFLFdBQVcsQ0FBQyxJQUFaLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUFBO0FBREY7O0lBRFk7Ozs7O0FBcFdoQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5FbWFjc0N1cnNvciA9IHJlcXVpcmUgJy4vZW1hY3MtY3Vyc29yJ1xuS2lsbFJpbmcgPSByZXF1aXJlICcuL2tpbGwtcmluZydcbk1hcmsgPSByZXF1aXJlICcuL21hcmsnXG5TdGF0ZSA9IHJlcXVpcmUgJy4vc3RhdGUnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVtYWNzRWRpdG9yXG4gIEBmb3I6IChlZGl0b3IpIC0+XG4gICAgZWRpdG9yLl9hdG9taWNFbWFjcyA/PSBuZXcgRW1hY3NFZGl0b3IoZWRpdG9yKVxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBAZGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3Bvc2FibGUuYWRkIEBlZGl0b3Iub25EaWRSZW1vdmVDdXJzb3IgPT5cbiAgICAgIGN1cnNvcnMgPSBAZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAgaWYgY3Vyc29ycy5sZW5ndGggPT0gMVxuICAgICAgICBFbWFjc0N1cnNvci5mb3IoY3Vyc29yc1swXSkuY2xlYXJMb2NhbEtpbGxSaW5nKClcbiAgICBAZGlzcG9zYWJsZS5hZGQgQGVkaXRvci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBkZXN0cm95KClcblxuICBkZXN0cm95OiAtPlxuICAgICMgTmVpdGhlciBjdXJzb3IuZGlkLWRlc3Ryb3kgbm9yIFRleHRFZGl0b3IuZGlkLXJlbW92ZS1jdXJzb3Igc2VlbXMgdG8gZmlyZVxuICAgICMgd2hlbiB0aGUgZWRpdG9yIGlzIGRlc3Ryb3llZC4gKEF0b20gYnVnPykgU28gd2UgZGVzdHJveSBFbWFjc0N1cnNvcnMgaGVyZS5cbiAgICBmb3IgY3Vyc29yIGluIEBnZXRFbWFjc0N1cnNvcnMoKVxuICAgICAgY3Vyc29yLmRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gIGdldEVtYWNzQ3Vyc29yczogKCkgLT5cbiAgICBFbWFjc0N1cnNvci5mb3IoYykgZm9yIGMgaW4gQGVkaXRvci5nZXRDdXJzb3JzKClcblxuICBtb3ZlRW1hY3NDdXJzb3JzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVkaXRvci5tb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPlxuICAgICAgIyBBdG9tIGJ1ZzogaWYgbW92aW5nIG9uZSBjdXJzb3IgZGVzdHJveXMgYW5vdGhlciwgdGhlIGRlc3Ryb3llZCBvbmUnc1xuICAgICAgIyBlbWl0dGVyIGlzIGRpc3Bvc2VkLCBidXQgY3Vyc29yLmlzRGVzdHJveWVkKCkgaXMgc3RpbGwgZmFsc2UuIEhvd2V2ZXJcbiAgICAgICMgY3Vyc29yLmRlc3Ryb3llZCA9PSB0cnVlLiBUZXh0RWRpdG9yLm1vdmVDdXJzb3JzIHByb2JhYmx5IHNob3VsZG4ndCBldmVuXG4gICAgICAjIHlpZWxkIGl0IGluIHRoaXMgY2FzZS5cbiAgICAgIHJldHVybiBpZiBjdXJzb3IuZGVzdHJveWVkID09IHRydWVcbiAgICAgIGNhbGxiYWNrKEVtYWNzQ3Vyc29yLmZvcihjdXJzb3IpLCBjdXJzb3IpXG5cbiAgIyMjXG4gIFNlY3Rpb246IE5hdmlnYXRpb25cbiAgIyMjXG5cbiAgYmFja3dhcmRDaGFyOiAtPlxuICAgIEBlZGl0b3IubW92ZUN1cnNvcnMgKGN1cnNvcikgLT5cbiAgICAgIGN1cnNvci5tb3ZlTGVmdCgpXG5cbiAgZm9yd2FyZENoYXI6IC0+XG4gICAgQGVkaXRvci5tb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPlxuICAgICAgY3Vyc29yLm1vdmVSaWdodCgpXG5cbiAgYmFja3dhcmRXb3JkOiAtPlxuICAgIEBtb3ZlRW1hY3NDdXJzb3JzIChlbWFjc0N1cnNvcikgLT5cbiAgICAgIGVtYWNzQ3Vyc29yLnNraXBOb25Xb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcbiAgICAgIGVtYWNzQ3Vyc29yLnNraXBXb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcblxuICBmb3J3YXJkV29yZDogLT5cbiAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpIC0+XG4gICAgICBlbWFjc0N1cnNvci5za2lwTm9uV29yZENoYXJhY3RlcnNGb3J3YXJkKClcbiAgICAgIGVtYWNzQ3Vyc29yLnNraXBXb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuXG4gIGJhY2t3YXJkU2V4cDogLT5cbiAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpIC0+XG4gICAgICBlbWFjc0N1cnNvci5za2lwU2V4cEJhY2t3YXJkKClcblxuICBmb3J3YXJkU2V4cDogLT5cbiAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpIC0+XG4gICAgICBlbWFjc0N1cnNvci5za2lwU2V4cEZvcndhcmQoKVxuXG4gIGJhY2t3YXJkTGlzdDogLT5cbiAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpIC0+XG4gICAgICBlbWFjc0N1cnNvci5za2lwTGlzdEJhY2t3YXJkKClcblxuICBmb3J3YXJkTGlzdDogLT5cbiAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpIC0+XG4gICAgICBlbWFjc0N1cnNvci5za2lwTGlzdEZvcndhcmQoKVxuXG4gIHByZXZpb3VzTGluZTogLT5cbiAgICBAZWRpdG9yLm1vdmVDdXJzb3JzIChjdXJzb3IpIC0+XG4gICAgICBjdXJzb3IubW92ZVVwKClcblxuICBuZXh0TGluZTogLT5cbiAgICBAZWRpdG9yLm1vdmVDdXJzb3JzIChjdXJzb3IpIC0+XG4gICAgICBjdXJzb3IubW92ZURvd24oKVxuXG4gIGJhY2t3YXJkUGFyYWdyYXBoOiAtPlxuICAgIEBtb3ZlRW1hY3NDdXJzb3JzIChlbWFjc0N1cnNvciwgY3Vyc29yKSAtPlxuICAgICAgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgdW5sZXNzIHBvc2l0aW9uLnJvdyA9PSAwXG4gICAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbcG9zaXRpb24ucm93IC0gMSwgMF0pXG5cbiAgICAgIGVtYWNzQ3Vyc29yLmdvVG9NYXRjaFN0YXJ0QmFja3dhcmQoL15cXHMqJC8pIG9yXG4gICAgICAgIGN1cnNvci5tb3ZlVG9Ub3AoKVxuXG4gIGZvcndhcmRQYXJhZ3JhcGg6IC0+XG4gICAgbGFzdFJvdyA9IEBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpXG4gICAgQG1vdmVFbWFjc0N1cnNvcnMgKGVtYWNzQ3Vyc29yLCBjdXJzb3IpIC0+XG4gICAgICBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICB1bmxlc3MgcG9zaXRpb24ucm93ID09IGxhc3RSb3dcbiAgICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtwb3NpdGlvbi5yb3cgKyAxLCAwXSlcblxuICAgICAgZW1hY3NDdXJzb3IuZ29Ub01hdGNoU3RhcnRGb3J3YXJkKC9eXFxzKiQvKSBvclxuICAgICAgICBjdXJzb3IubW92ZVRvQm90dG9tKClcblxuICBiYWNrVG9JbmRlbnRhdGlvbjogLT5cbiAgICBAZWRpdG9yLm1vdmVDdXJzb3JzIChjdXJzb3IpID0+XG4gICAgICBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwb3NpdGlvbi5yb3cpXG4gICAgICB0YXJnZXRDb2x1bW4gPSBsaW5lLnNlYXJjaCgvXFxTLylcbiAgICAgIHRhcmdldENvbHVtbiA9IGxpbmUubGVuZ3RoIGlmIHRhcmdldENvbHVtbiA9PSAtMVxuXG4gICAgICBpZiBwb3NpdGlvbi5jb2x1bW4gIT0gdGFyZ2V0Q29sdW1uXG4gICAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbcG9zaXRpb24ucm93LCB0YXJnZXRDb2x1bW5dKVxuXG4gICMjI1xuICBTZWN0aW9uOiBLaWxsaW5nICYgWWFua2luZ1xuICAjIyNcblxuICBiYWNrd2FyZEtpbGxXb3JkOiAtPlxuICAgIEBfcHVsbEZyb21DbGlwYm9hcmQoKVxuICAgIG1ldGhvZCA9IGlmIFN0YXRlLmtpbGxpbmcgdGhlbiAncHJlcGVuZCcgZWxzZSAncHVzaCdcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IsIGN1cnNvcikgPT5cbiAgICAgICAgZW1hY3NDdXJzb3IuYmFja3dhcmRLaWxsV29yZChtZXRob2QpXG4gICAgQF91cGRhdGVHbG9iYWxLaWxsUmluZyhtZXRob2QpXG4gICAgU3RhdGUua2lsbGVkKClcblxuICBraWxsV29yZDogLT5cbiAgICBAX3B1bGxGcm9tQ2xpcGJvYXJkKClcbiAgICBtZXRob2QgPSBpZiBTdGF0ZS5raWxsaW5nIHRoZW4gJ2FwcGVuZCcgZWxzZSAncHVzaCdcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLmtpbGxXb3JkKG1ldGhvZClcbiAgICBAX3VwZGF0ZUdsb2JhbEtpbGxSaW5nKG1ldGhvZClcbiAgICBTdGF0ZS5raWxsZWQoKVxuXG4gIGtpbGxMaW5lOiAtPlxuICAgIEBfcHVsbEZyb21DbGlwYm9hcmQoKVxuICAgIG1ldGhvZCA9IGlmIFN0YXRlLmtpbGxpbmcgdGhlbiAnYXBwZW5kJyBlbHNlICdwdXNoJ1xuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIEBtb3ZlRW1hY3NDdXJzb3JzIChlbWFjc0N1cnNvcikgPT5cbiAgICAgICAgZW1hY3NDdXJzb3Iua2lsbExpbmUobWV0aG9kKVxuICAgIEBfdXBkYXRlR2xvYmFsS2lsbFJpbmcobWV0aG9kKVxuICAgIFN0YXRlLmtpbGxlZCgpXG5cbiAga2lsbFJlZ2lvbjogLT5cbiAgICBAX3B1bGxGcm9tQ2xpcGJvYXJkKClcbiAgICBtZXRob2QgPSBpZiBTdGF0ZS5raWxsaW5nIHRoZW4gJ2FwcGVuZCcgZWxzZSAncHVzaCdcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLmtpbGxSZWdpb24obWV0aG9kKVxuICAgIEBfdXBkYXRlR2xvYmFsS2lsbFJpbmcobWV0aG9kKVxuICAgIFN0YXRlLmtpbGxlZCgpXG5cbiAgY29weVJlZ2lvbkFzS2lsbDogLT5cbiAgICBAX3B1bGxGcm9tQ2xpcGJvYXJkKClcbiAgICBtZXRob2QgPSBpZiBTdGF0ZS5raWxsaW5nIHRoZW4gJ2FwcGVuZCcgZWxzZSAncHVzaCdcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgIGVtYWNzQ3Vyc29yID0gRW1hY3NDdXJzb3IuZm9yKHNlbGVjdGlvbi5jdXJzb3IpXG4gICAgICAgIGVtYWNzQ3Vyc29yLmtpbGxSaW5nKClbbWV0aG9kXShzZWxlY3Rpb24uZ2V0VGV4dCgpKVxuICAgICAgICBlbWFjc0N1cnNvci5raWxsUmluZygpLmdldEN1cnJlbnRFbnRyeSgpXG4gICAgICAgIGVtYWNzQ3Vyc29yLm1hcmsoKS5kZWFjdGl2YXRlKClcbiAgICBAX3VwZGF0ZUdsb2JhbEtpbGxSaW5nKG1ldGhvZClcblxuICB5YW5rOiAtPlxuICAgIEBfcHVsbEZyb21DbGlwYm9hcmQoKVxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGZvciBlbWFjc0N1cnNvciBpbiBAZ2V0RW1hY3NDdXJzb3JzKClcbiAgICAgICAgZW1hY3NDdXJzb3IueWFuaygpXG4gICAgU3RhdGUueWFua2VkKClcblxuICB5YW5rUG9wOiAtPlxuICAgIHJldHVybiBpZiBub3QgU3RhdGUueWFua2luZ1xuICAgIEBfcHVsbEZyb21DbGlwYm9hcmQoKVxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGZvciBlbWFjc0N1cnNvciBpbiBAZ2V0RW1hY3NDdXJzb3JzKClcbiAgICAgICAgZW1hY3NDdXJzb3Iucm90YXRlWWFuaygtMSlcbiAgICBTdGF0ZS55YW5rZWQoKVxuXG4gIHlhbmtTaGlmdDogLT5cbiAgICByZXR1cm4gaWYgbm90IFN0YXRlLnlhbmtpbmdcbiAgICBAX3B1bGxGcm9tQ2xpcGJvYXJkKClcbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBmb3IgZW1hY3NDdXJzb3IgaW4gQGdldEVtYWNzQ3Vyc29ycygpXG4gICAgICAgIGVtYWNzQ3Vyc29yLnJvdGF0ZVlhbmsoMSlcbiAgICBTdGF0ZS55YW5rZWQoKVxuXG4gIF9wdXNoVG9DbGlwYm9hcmQ6IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KFwiYXRvbWljLWVtYWNzLmtpbGxUb0NsaXBib2FyZFwiKVxuICAgICAgS2lsbFJpbmcucHVzaFRvQ2xpcGJvYXJkKClcblxuICBfcHVsbEZyb21DbGlwYm9hcmQ6IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KFwiYXRvbWljLWVtYWNzLnlhbmtGcm9tQ2xpcGJvYXJkXCIpXG4gICAgICBraWxsUmluZ3MgPSAoYy5raWxsUmluZygpIGZvciBjIGluIEBnZXRFbWFjc0N1cnNvcnMoKSlcbiAgICAgIEtpbGxSaW5nLnB1bGxGcm9tQ2xpcGJvYXJkKGtpbGxSaW5ncylcblxuICBfdXBkYXRlR2xvYmFsS2lsbFJpbmc6IChtZXRob2QpIC0+XG4gICAgaWYgQGVkaXRvci5oYXNNdWx0aXBsZUN1cnNvcnMoKVxuICAgICAga2lsbHMgPSAoYy5raWxsUmluZygpLmdldEN1cnJlbnRFbnRyeSgpIGZvciBjIGluIEBnZXRFbWFjc0N1cnNvcnMoKSlcbiAgICAgIG1ldGhvZCA9ICdyZXBsYWNlJyBpZiBtZXRob2QgIT0gJ3B1c2gnXG4gICAgICBLaWxsUmluZy5nbG9iYWxbbWV0aG9kXShraWxscy5qb2luKCdcXG4nKSArICdcXG4nKVxuICAgIEBfcHVzaFRvQ2xpcGJvYXJkKClcblxuICAjIyNcbiAgU2VjdGlvbjogRWRpdGluZ1xuICAjIyNcblxuICBkZWxldGVIb3Jpem9udGFsU3BhY2U6IC0+XG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgQG1vdmVFbWFjc0N1cnNvcnMgKGVtYWNzQ3Vyc29yKSA9PlxuICAgICAgICByYW5nZSA9IGVtYWNzQ3Vyc29yLmhvcml6b250YWxTcGFjZVJhbmdlKClcbiAgICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgJycpXG5cbiAgZGVsZXRlSW5kZW50YXRpb246IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yXG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgQGVkaXRvci5tb3ZlVXAoKVxuICAgICAgQGVkaXRvci5qb2luTGluZXMoKVxuXG4gIG9wZW5MaW5lOiAtPlxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGZvciBlbWFjc0N1cnNvciBpbiBAZ2V0RW1hY3NDdXJzb3JzKClcbiAgICAgICAgZW1hY3NDdXJzb3IuaW5zZXJ0QWZ0ZXIoXCJcXG5cIilcblxuICBqdXN0T25lU3BhY2U6IC0+XG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgZm9yIGVtYWNzQ3Vyc29yIGluIEBnZXRFbWFjc0N1cnNvcnMoKVxuICAgICAgICByYW5nZSA9IGVtYWNzQ3Vyc29yLmhvcml6b250YWxTcGFjZVJhbmdlKClcbiAgICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgJyAnKVxuXG4gIGRlbGV0ZUJsYW5rTGluZXM6IC0+XG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgZm9yIGVtYWNzQ3Vyc29yIGluIEBnZXRFbWFjc0N1cnNvcnMoKVxuICAgICAgICBlbWFjc0N1cnNvci5kZWxldGVCbGFua0xpbmVzKClcblxuICB0cmFuc3Bvc2VDaGFyczogLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLnRyYW5zcG9zZUNoYXJzKClcblxuICB0cmFuc3Bvc2VXb3JkczogLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLnRyYW5zcG9zZVdvcmRzKClcblxuICB0cmFuc3Bvc2VMaW5lczogLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLnRyYW5zcG9zZUxpbmVzKClcblxuICB0cmFuc3Bvc2VTZXhwczogLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAbW92ZUVtYWNzQ3Vyc29ycyAoZW1hY3NDdXJzb3IpID0+XG4gICAgICAgIGVtYWNzQ3Vyc29yLnRyYW5zcG9zZVNleHBzKClcblxuICBkb3duY2FzZSA9IChzKSAtPiBzLnRvTG93ZXJDYXNlKClcbiAgdXBjYXNlID0gKHMpIC0+IHMudG9VcHBlckNhc2UoKVxuICBjYXBpdGFsaXplID0gKHMpIC0+IHMuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxuXG4gIGRvd25jYXNlV29yZE9yUmVnaW9uOiAtPlxuICAgIEBfdHJhbnNmb3JtV29yZE9yUmVnaW9uKGRvd25jYXNlKVxuXG4gIHVwY2FzZVdvcmRPclJlZ2lvbjogLT5cbiAgICBAX3RyYW5zZm9ybVdvcmRPclJlZ2lvbih1cGNhc2UpXG5cbiAgY2FwaXRhbGl6ZVdvcmRPclJlZ2lvbjogLT5cbiAgICBAX3RyYW5zZm9ybVdvcmRPclJlZ2lvbihjYXBpdGFsaXplLCB3b3JkQXRBVGltZTogdHJ1ZSlcblxuICBfdHJhbnNmb3JtV29yZE9yUmVnaW9uOiAodHJhbnNmb3JtV29yZCwge3dvcmRBdEFUaW1lfT17fSkgLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBpZiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKS5maWx0ZXIoKHMpIC0+IG5vdCBzLmlzRW1wdHkoKSkubGVuZ3RoID4gMFxuICAgICAgICBAZWRpdG9yLm11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSA9PlxuICAgICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgICBpZiB3b3JkQXRBVGltZVxuICAgICAgICAgICAgQGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSAvXFx3Ky9nLCByYW5nZSwgKGhpdCkgLT5cbiAgICAgICAgICAgICAgaGl0LnJlcGxhY2UodHJhbnNmb3JtV29yZChoaXQubWF0Y2hUZXh0KSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCB0cmFuc2Zvcm1Xb3JkKHNlbGVjdGlvbi5nZXRUZXh0KCkpKVxuICAgICAgZWxzZVxuICAgICAgICBmb3IgY3Vyc29yIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICAgICAgY3Vyc29yLmVtaXR0ZXIuX190cmFjayA9IHRydWVcbiAgICAgICAgQG1vdmVFbWFjc0N1cnNvcnMgKGVtYWNzQ3Vyc29yKSA9PlxuICAgICAgICAgIGVtYWNzQ3Vyc29yLnRyYW5zZm9ybVdvcmQodHJhbnNmb3JtV29yZClcblxuICAjIyNcbiAgU2VjdGlvbjogTWFya2luZyAmIFNlbGVjdGluZ1xuICAjIyNcblxuICBzZXRNYXJrOiAtPlxuICAgIGZvciBlbWFjc0N1cnNvciBpbiBAZ2V0RW1hY3NDdXJzb3JzKClcbiAgICAgIGVtYWNzQ3Vyc29yLm1hcmsoKS5zZXQoKS5hY3RpdmF0ZSgpXG5cbiAgbWFya1NleHA6IC0+XG4gICAgQG1vdmVFbWFjc0N1cnNvcnMgKGVtYWNzQ3Vyc29yKSAtPlxuICAgICAgZW1hY3NDdXJzb3IubWFya1NleHAoKVxuXG4gIG1hcmtXaG9sZUJ1ZmZlcjogLT5cbiAgICBbZmlyc3QsIHJlc3QuLi5dID0gQGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICBjLmRlc3Ryb3koKSBmb3IgYyBpbiByZXN0XG4gICAgZW1hY3NDdXJzb3IgPSBFbWFjc0N1cnNvci5mb3IoZmlyc3QpXG4gICAgZmlyc3QubW92ZVRvQm90dG9tKClcbiAgICBlbWFjc0N1cnNvci5tYXJrKCkuc2V0KCkuYWN0aXZhdGUoKVxuICAgIGZpcnN0Lm1vdmVUb1RvcCgpXG5cbiAgZXhjaGFuZ2VQb2ludEFuZE1hcms6IC0+XG4gICAgQG1vdmVFbWFjc0N1cnNvcnMgKGVtYWNzQ3Vyc29yKSAtPlxuICAgICAgZW1hY3NDdXJzb3IubWFyaygpLmV4Y2hhbmdlKClcblxuICAjIyNcbiAgU2VjdGlvbjogVUlcbiAgIyMjXG5cbiAgcmVjZW50ZXJUb3BCb3R0b206IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yXG4gICAgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhAZWRpdG9yKVxuICAgIG1pblJvdyA9IE1hdGgubWluKChjLmdldEJ1ZmZlclJvdygpIGZvciBjIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpKS4uLilcbiAgICBtYXhSb3cgPSBNYXRoLm1heCgoYy5nZXRCdWZmZXJSb3coKSBmb3IgYyBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKSkuLi4pXG4gICAgbWluT2Zmc2V0ID0gdmlldy5waXhlbFBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oW21pblJvdywgMF0pXG4gICAgbWF4T2Zmc2V0ID0gdmlldy5waXhlbFBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oW21heFJvdywgMF0pXG5cbiAgICBzd2l0Y2ggU3RhdGUucmVjZW50ZXJzXG4gICAgICB3aGVuIDBcbiAgICAgICAgdmlldy5zZXRTY3JvbGxUb3AoKG1pbk9mZnNldC50b3AgKyBtYXhPZmZzZXQudG9wIC0gdmlldy5nZXRIZWlnaHQoKSkvMilcbiAgICAgIHdoZW4gMVxuICAgICAgICAjIEF0b20gYXBwbGllcyBhIChoYXJkY29kZWQpIDItbGluZSBidWZmZXIgd2hpbGUgc2Nyb2xsaW5nIC0tIGRvIHRoYXQgaGVyZS5cbiAgICAgICAgdmlldy5zZXRTY3JvbGxUb3AobWluT2Zmc2V0LnRvcCAtIDIqQGVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSlcbiAgICAgIHdoZW4gMlxuICAgICAgICB2aWV3LnNldFNjcm9sbFRvcChtYXhPZmZzZXQudG9wICsgMypAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpIC0gdmlldy5nZXRIZWlnaHQoKSlcblxuICAgIFN0YXRlLnJlY2VudGVyZWQoKVxuXG4gIHNjcm9sbFVwOiAtPlxuICAgIGlmICh2aXNpYmxlUm93UmFuZ2UgPSBAZWRpdG9yLmdldFZpc2libGVSb3dSYW5nZSgpKVxuICAgICAgIyBJRiB0aGUgYnVmZmVyIGlzIGVtcHR5LCB3ZSBnZXQgTmFOcyBoZXJlIChBdG9tIDEuMjEpLlxuICAgICAgcmV0dXJuIHVubGVzcyB2aXNpYmxlUm93UmFuZ2UuZXZlcnkoKGUpID0+ICFOdW1iZXIuaXNOYU4oZSkpXG5cbiAgICAgIFtmaXJzdFJvdywgbGFzdFJvd10gPSB2aXNpYmxlUm93UmFuZ2VcbiAgICAgIGN1cnJlbnRSb3cgPSBAZWRpdG9yLmN1cnNvcnNbMF0uZ2V0QnVmZmVyUm93KClcbiAgICAgIHJvd0NvdW50ID0gKGxhc3RSb3cgLSBmaXJzdFJvdykgLSAyXG4gICAgICBAZWRpdG9yLm1vdmVEb3duKHJvd0NvdW50KVxuXG4gIHNjcm9sbERvd246IC0+XG4gICAgaWYgKHZpc2libGVSb3dSYW5nZSA9IEBlZGl0b3IuZ2V0VmlzaWJsZVJvd1JhbmdlKCkpXG4gICAgICAjIElGIHRoZSBidWZmZXIgaXMgZW1wdHksIHdlIGdldCBOYU5zIGhlcmUgKEF0b20gMS4yMSkuXG4gICAgICByZXR1cm4gdW5sZXNzIHZpc2libGVSb3dSYW5nZS5ldmVyeSgoZSkgPT4gIU51bWJlci5pc05hTihlKSlcblxuICAgICAgW2ZpcnN0Um93LGxhc3RSb3ddID0gdmlzaWJsZVJvd1JhbmdlXG4gICAgICBjdXJyZW50Um93ID0gQGVkaXRvci5jdXJzb3JzWzBdLmdldEJ1ZmZlclJvdygpXG4gICAgICByb3dDb3VudCA9IChsYXN0Um93IC0gZmlyc3RSb3cpIC0gMlxuICAgICAgQGVkaXRvci5tb3ZlVXAocm93Q291bnQpXG5cbiAgIyMjXG4gIFNlY3Rpb246IE90aGVyXG4gICMjI1xuXG4gIGtleWJvYXJkUXVpdDogLT5cbiAgICBmb3IgZW1hY3NDdXJzb3IgaW4gQGdldEVtYWNzQ3Vyc29ycygpXG4gICAgICBlbWFjc0N1cnNvci5tYXJrKCkuZGVhY3RpdmF0ZSgpXG4iXX0=

(function() {
  var BOB, CLOSERS, CompositeDisposable, EmacsCursor, KillRing, Mark, OPENERS, escapeRegExp;

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  CompositeDisposable = require('atom').CompositeDisposable;

  OPENERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  CLOSERS = {
    ')': '(',
    ']': '[',
    '}': '{',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  module.exports = EmacsCursor = (function() {
    EmacsCursor["for"] = function(cursor) {
      return cursor._atomicEmacs != null ? cursor._atomicEmacs : cursor._atomicEmacs = new EmacsCursor(cursor);
    };

    function EmacsCursor(cursor1) {
      this.cursor = cursor1;
      this.editor = this.cursor.editor;
      this._mark = null;
      this._localKillRing = null;
      this._yankMarker = null;
      this._disposable = this.cursor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    }

    EmacsCursor.prototype.mark = function() {
      return this._mark != null ? this._mark : this._mark = new Mark(this.cursor);
    };

    EmacsCursor.prototype.killRing = function() {
      if (this.editor.hasMultipleCursors()) {
        return this.getLocalKillRing();
      } else {
        return KillRing.global;
      }
    };

    EmacsCursor.prototype.getLocalKillRing = function() {
      return this._localKillRing != null ? this._localKillRing : this._localKillRing = KillRing.global.fork();
    };

    EmacsCursor.prototype.clearLocalKillRing = function() {
      return this._localKillRing = null;
    };

    EmacsCursor.prototype.destroy = function() {
      var ref, ref1;
      this.clearLocalKillRing();
      this._disposable.dispose();
      this._disposable = null;
      if ((ref = this._yankMarker) != null) {
        ref.destroy();
      }
      if ((ref1 = this._mark) != null) {
        ref1.destroy();
      }
      return delete this.cursor._atomicEmacs;
    };

    EmacsCursor.prototype.locateBackward = function(regExp) {
      return this._locateBackwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateForward = function(regExp) {
      return this._locateForwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateWordCharacterBackward = function() {
      return this.locateBackward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateWordCharacterForward = function() {
      return this.locateForward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterBackward = function() {
      return this.locateBackward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterForward = function() {
      return this.locateForward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.goToMatchStartBackward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateBackward(regExp)) != null ? ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchStartForward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateForward(regExp)) != null ? ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchEndBackward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateBackward(regExp)) != null ? ref.end : void 0);
    };

    EmacsCursor.prototype.goToMatchEndForward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateForward(regExp)) != null ? ref.end : void 0);
    };

    EmacsCursor.prototype.skipCharactersBackward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipBackwardUntil(regexp);
    };

    EmacsCursor.prototype.skipCharactersForward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipForwardUntil(regexp);
    };

    EmacsCursor.prototype.skipWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipWordCharactersForward = function() {
      return this.skipForwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersForward = function() {
      return this.skipForwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipBackwardUntil = function(regexp) {
      if (!this.goToMatchEndBackward(regexp)) {
        return this._goTo(BOB);
      }
    };

    EmacsCursor.prototype.skipForwardUntil = function(regexp) {
      if (!this.goToMatchStartForward(regexp)) {
        return this._goTo(this.editor.getEofBufferPosition());
      }
    };

    EmacsCursor.prototype.insertAfter = function(text) {
      var position;
      position = this.cursor.getBufferPosition();
      this.editor.setTextInBufferRange([position, position], "\n");
      return this.cursor.setBufferPosition(position);
    };

    EmacsCursor.prototype.horizontalSpaceRange = function() {
      var end, start;
      this.skipCharactersBackward(' \t');
      start = this.cursor.getBufferPosition();
      this.skipCharactersForward(' \t');
      end = this.cursor.getBufferPosition();
      return [start, end];
    };

    EmacsCursor.prototype.deleteBlankLines = function() {
      var blankLineRe, e, eof, point, s;
      eof = this.editor.getEofBufferPosition();
      blankLineRe = /^[ \t]*$/;
      point = this.cursor.getBufferPosition();
      s = e = point.row;
      while (blankLineRe.test(this.cursor.editor.lineTextForBufferRow(e)) && e <= eof.row) {
        e += 1;
      }
      while (s > 0 && blankLineRe.test(this.cursor.editor.lineTextForBufferRow(s - 1))) {
        s -= 1;
      }
      if (s === e) {
        e += 1;
        while (blankLineRe.test(this.cursor.editor.lineTextForBufferRow(e)) && e <= eof.row) {
          e += 1;
        }
        return this.cursor.editor.setTextInBufferRange([[s + 1, 0], [e, 0]], '');
      } else if (e === s + 1) {
        this.cursor.editor.setTextInBufferRange([[s, 0], [e, 0]], '');
        return this.cursor.setBufferPosition([s, 0]);
      } else {
        this.cursor.editor.setTextInBufferRange([[s, 0], [e, 0]], '\n');
        return this.cursor.setBufferPosition([s, 0]);
      }
    };

    EmacsCursor.prototype.transformWord = function(transformer) {
      var end, range, start, text;
      this.skipNonWordCharactersForward();
      start = this.cursor.getBufferPosition();
      this.skipWordCharactersForward();
      end = this.cursor.getBufferPosition();
      range = [start, end];
      text = this.editor.getTextInBufferRange(range);
      return this.editor.setTextInBufferRange(range, transformer(text));
    };

    EmacsCursor.prototype.backwardKillWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          end = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersBackward();
          _this.skipWordCharactersBackward();
          start = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          start = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersForward();
          _this.skipWordCharactersForward();
          end = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killLine = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, line, start;
          start = _this.cursor.getBufferPosition();
          line = _this.editor.lineTextForBufferRow(start.row);
          if (start.column === 0 && atom.config.get("atomic-emacs.killWholeLine")) {
            end = [start.row + 1, 0];
          } else {
            if (/^\s*$/.test(line.slice(start.column))) {
              end = [start.row + 1, 0];
            } else {
              end = [start.row, line.length];
            }
          }
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killRegion = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var position;
          position = _this.cursor.selection.getBufferRange();
          return [position, position];
        };
      })(this));
    };

    EmacsCursor.prototype._killUnit = function(method, findRange) {
      var killRing, range, text;
      if (method == null) {
        method = 'push';
      }
      if ((this.cursor.selection != null) && !this.cursor.selection.isEmpty()) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        range = findRange();
      }
      text = this.editor.getTextInBufferRange(range);
      this.editor.setTextInBufferRange(range, '');
      killRing = this.killRing();
      killRing[method](text);
      return killRing.getCurrentEntry();
    };

    EmacsCursor.prototype.yank = function() {
      var killRing, newRange, position, range;
      killRing = this.killRing();
      if (killRing.isEmpty()) {
        return;
      }
      if (this.cursor.selection) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        position = this.cursor.getBufferPosition();
        range = [position, position];
      }
      newRange = this.editor.setTextInBufferRange(range, killRing.getCurrentEntry());
      this.cursor.setBufferPosition(newRange.end);
      if (this._yankMarker == null) {
        this._yankMarker = this.editor.markBufferPosition(this.cursor.getBufferPosition());
      }
      return this._yankMarker.setBufferRange(newRange);
    };

    EmacsCursor.prototype.rotateYank = function(n) {
      var entry, range;
      if (this._yankMarker === null) {
        return;
      }
      entry = this.killRing().rotate(n);
      if (entry !== null) {
        range = this.editor.setTextInBufferRange(this._yankMarker.getBufferRange(), entry);
        return this._yankMarker.setBufferRange(range);
      }
    };

    EmacsCursor.prototype.yankComplete = function() {
      var ref;
      if ((ref = this._yankMarker) != null) {
        ref.destroy();
      }
      return this._yankMarker = null;
    };

    EmacsCursor.prototype._nextCharacterFrom = function(position) {
      var lineLength;
      lineLength = this.editor.lineTextForBufferRow(position.row).length;
      if (position.column === lineLength) {
        if (position.row === this.editor.getLastBufferRow()) {
          return null;
        } else {
          return this.editor.getTextInBufferRange([position, [position.row + 1, 0]]);
        }
      } else {
        return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
      }
    };

    EmacsCursor.prototype._previousCharacterFrom = function(position) {
      var column;
      if (position.column === 0) {
        if (position.row === 0) {
          return null;
        } else {
          column = this.editor.lineTextForBufferRow(position.row - 1).length;
          return this.editor.getTextInBufferRange([[position.row - 1, column], position]);
        }
      } else {
        return this.editor.getTextInBufferRange([position.translate([0, -1]), position]);
      }
    };

    EmacsCursor.prototype.nextCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.previousCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.skipSexpForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpForwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.skipSexpBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpBackwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.skipListForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._listForwardFrom(point);
      if (target) {
        return this.cursor.setBufferPosition(target);
      }
    };

    EmacsCursor.prototype.skipListBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._listBackwardFrom(point);
      if (target) {
        return this.cursor.setBufferPosition(target);
      }
    };

    EmacsCursor.prototype.markSexp = function() {
      var mark, newTail, range;
      range = this.cursor.getMarker().getBufferRange();
      newTail = this._sexpForwardFrom(range.end);
      mark = this.mark().set(newTail);
      if (!mark.isActive()) {
        return mark.activate();
      }
    };

    EmacsCursor.prototype.transposeChars = function() {
      var column, line, pair, pairRange, previousLine, ref, row;
      ref = this.cursor.getBufferPosition(), row = ref.row, column = ref.column;
      if (row === 0 && column === 0) {
        return;
      }
      line = this.editor.lineTextForBufferRow(row);
      if (column === 0) {
        previousLine = this.editor.lineTextForBufferRow(row - 1);
        pairRange = [[row - 1, previousLine.length], [row, 1]];
      } else if (column === line.length) {
        pairRange = [[row, column - 2], [row, column]];
      } else {
        pairRange = [[row, column - 1], [row, column + 1]];
      }
      pair = this.editor.getTextInBufferRange(pairRange);
      return this.editor.setTextInBufferRange(pairRange, (pair[1] || '') + pair[0]);
    };

    EmacsCursor.prototype.transposeWords = function() {
      var word1Range, word2Range;
      this.skipNonWordCharactersBackward();
      word1Range = this._wordRange();
      this.skipWordCharactersForward();
      this.skipNonWordCharactersForward();
      if (this.editor.getEofBufferPosition().isEqual(this.cursor.getBufferPosition())) {
        return this.skipNonWordCharactersBackward();
      } else {
        word2Range = this._wordRange();
        return this._transposeRanges(word1Range, word2Range);
      }
    };

    EmacsCursor.prototype.transposeSexps = function() {
      var end1, end2, start1, start2;
      this.skipSexpBackward();
      start1 = this.cursor.getBufferPosition();
      this.skipSexpForward();
      end1 = this.cursor.getBufferPosition();
      this.skipSexpForward();
      end2 = this.cursor.getBufferPosition();
      this.skipSexpBackward();
      start2 = this.cursor.getBufferPosition();
      return this._transposeRanges([start1, end1], [start2, end2]);
    };

    EmacsCursor.prototype.transposeLines = function() {
      var lineRange, row, text;
      row = this.cursor.getBufferRow();
      if (row === 0) {
        this._endLineIfNecessary();
        this.cursor.moveDown();
        row += 1;
      }
      this._endLineIfNecessary();
      lineRange = [[row, 0], [row + 1, 0]];
      text = this.editor.getTextInBufferRange(lineRange);
      this.editor.setTextInBufferRange(lineRange, '');
      return this.editor.setTextInBufferRange([[row - 1, 0], [row - 1, 0]], text);
    };

    EmacsCursor.prototype._wordRange = function() {
      var range, wordEnd, wordStart;
      this.skipWordCharactersBackward();
      range = this.locateNonWordCharacterBackward();
      wordStart = range ? range.end : [0, 0];
      range = this.locateNonWordCharacterForward();
      wordEnd = range ? range.start : this.editor.getEofBufferPosition();
      return [wordStart, wordEnd];
    };

    EmacsCursor.prototype._endLineIfNecessary = function() {
      var length, row;
      row = this.cursor.getBufferPosition().row;
      if (row === this.editor.getLineCount() - 1) {
        length = this.cursor.getCurrentBufferLine().length;
        return this.editor.setTextInBufferRange([[row, length], [row, length]], "\n");
      }
    };

    EmacsCursor.prototype._transposeRanges = function(range1, range2) {
      var text1, text2;
      text1 = this.editor.getTextInBufferRange(range1);
      text2 = this.editor.getTextInBufferRange(range2);
      this.editor.setTextInBufferRange(range2, text1);
      this.editor.setTextInBufferRange(range1, text2);
      return this.cursor.setBufferPosition(range2[1]);
    };

    EmacsCursor.prototype._sexpForwardFrom = function(point) {
      var character, eob, eof, quotes, re, ref, ref1, result, stack;
      eob = this.editor.getEofBufferPosition();
      point = ((ref = this._locateForwardFrom(point, /[\w()[\]{}'"]/i)) != null ? ref.start : void 0) || eob;
      character = this._nextCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        eof = this.editor.getEofBufferPosition();
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.scanInBufferRange(re, [point, eof], (function(_this) {
          return function(hit) {
            var closer;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.end;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((closer = OPENERS[hit.matchText])) {
              if (!(/^["'`]$/.test(closer) && quotes > 0)) {
                stack.push(closer);
                if (/^["'`]$/.test(closer)) {
                  return quotes += 1;
                }
              }
            } else if (CLOSERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((ref1 = this._locateForwardFrom(point, /[\W\n]/i)) != null ? ref1.start : void 0) || eob;
      }
    };

    EmacsCursor.prototype._sexpBackwardFrom = function(point) {
      var character, quotes, re, ref, ref1, result, stack;
      point = ((ref = this._locateBackwardFrom(point, /[\w()[\]{}'"]/i)) != null ? ref.end : void 0) || BOB;
      character = this._previousCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.backwardsScanInBufferRange(re, [BOB, point], (function(_this) {
          return function(hit) {
            var opener;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.start;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((opener = CLOSERS[hit.matchText])) {
              if (!(/^["'`]$/.test(opener) && quotes > 0)) {
                stack.push(opener);
                if (/^["'`]$/.test(opener)) {
                  return quotes += 1;
                }
              }
            } else if (OPENERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((ref1 = this._locateBackwardFrom(point, /[\W\n]/i)) != null ? ref1.end : void 0) || BOB;
      }
    };

    EmacsCursor.prototype._listForwardFrom = function(point) {
      var end, eob, match;
      eob = this.editor.getEofBufferPosition();
      if (!(match = this._locateForwardFrom(point, /[()[\]{}]/i))) {
        return null;
      }
      end = this._sexpForwardFrom(match.start);
      if (end.isEqual(match.start)) {
        return null;
      } else {
        return end;
      }
    };

    EmacsCursor.prototype._listBackwardFrom = function(point) {
      var match, start;
      if (!(match = this._locateBackwardFrom(point, /[()[\]{}]/i))) {
        return null;
      }
      start = this._sexpBackwardFrom(match.end);
      if (start.isEqual(match.end)) {
        return null;
      } else {
        return start;
      }
    };

    EmacsCursor.prototype._locateBackwardFrom = function(point, regExp) {
      var result;
      result = null;
      this.editor.backwardsScanInBufferRange(regExp, [BOB, point], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._locateForwardFrom = function(point, regExp) {
      var eof, result;
      result = null;
      eof = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(regExp, [point, eof], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._getWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[^\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._getNonWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._goTo = function(point) {
      if (point) {
        this.cursor.setBufferPosition(point);
        return true;
      } else {
        return false;
      }
    };

    return EmacsCursor;

  })();

  escapeRegExp = function(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  };

  BOB = {
    row: 0,
    column: 0
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2VtYWNzLWN1cnNvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixPQUFBLEdBQVU7SUFBQyxHQUFBLEVBQUssR0FBTjtJQUFXLEdBQUEsRUFBSyxHQUFoQjtJQUFxQixHQUFBLEVBQUssR0FBMUI7SUFBK0IsSUFBQSxFQUFNLElBQXJDO0lBQTJDLEdBQUEsRUFBSyxHQUFoRDtJQUFxRCxHQUFBLEVBQUssR0FBMUQ7OztFQUNWLE9BQUEsR0FBVTtJQUFDLEdBQUEsRUFBSyxHQUFOO0lBQVcsR0FBQSxFQUFLLEdBQWhCO0lBQXFCLEdBQUEsRUFBSyxHQUExQjtJQUErQixJQUFBLEVBQU0sSUFBckM7SUFBMkMsR0FBQSxFQUFLLEdBQWhEO0lBQXFELEdBQUEsRUFBSyxHQUExRDs7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLFdBQUMsRUFBQSxHQUFBLEVBQUQsR0FBTSxTQUFDLE1BQUQ7MkNBQ0osTUFBTSxDQUFDLGVBQVAsTUFBTSxDQUFDLGVBQW9CLElBQUEsV0FBQSxDQUFZLE1BQVo7SUFEdkI7O0lBR08scUJBQUMsT0FBRDtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQ1osSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDO01BQ2xCLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsY0FBRCxHQUFrQjtNQUNsQixJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7SUFMSjs7MEJBT2IsSUFBQSxHQUFNLFNBQUE7a0NBQ0osSUFBQyxDQUFBLFFBQUQsSUFBQyxDQUFBLFFBQWEsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLE1BQU47SUFEVjs7MEJBR04sUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLGdCQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxRQUFRLENBQUMsT0FIWDs7SUFEUTs7MEJBTVYsZ0JBQUEsR0FBa0IsU0FBQTsyQ0FDaEIsSUFBQyxDQUFBLGlCQUFELElBQUMsQ0FBQSxpQkFBa0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFoQixDQUFBO0lBREg7OzBCQUdsQixrQkFBQSxHQUFvQixTQUFBO2FBQ2xCLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBREE7OzBCQUdwQixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTs7V0FDSCxDQUFFLE9BQWQsQ0FBQTs7O1lBQ00sQ0FBRSxPQUFSLENBQUE7O2FBQ0EsT0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDO0lBTlI7OzBCQVdULGNBQUEsR0FBZ0IsU0FBQyxNQUFEO2FBQ2QsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQSxDQUFyQixFQUFrRCxNQUFsRDtJQURjOzswQkFNaEIsYUFBQSxHQUFlLFNBQUMsTUFBRDthQUNiLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUEsQ0FBcEIsRUFBaUQsTUFBakQ7SUFEYTs7MEJBTWYsMkJBQUEsR0FBNkIsU0FBQTthQUMzQixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFoQjtJQUQyQjs7MEJBTTdCLDBCQUFBLEdBQTRCLFNBQUE7YUFDMUIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFmO0lBRDBCOzswQkFNNUIsOEJBQUEsR0FBZ0MsU0FBQTthQUM5QixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUFoQjtJQUQ4Qjs7MEJBTWhDLDZCQUFBLEdBQStCLFNBQUE7YUFDN0IsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUFmO0lBRDZCOzswQkFNL0Isc0JBQUEsR0FBd0IsU0FBQyxNQUFEO0FBQ3RCLFVBQUE7YUFBQSxJQUFDLENBQUEsS0FBRCxrREFBOEIsQ0FBRSxjQUFoQztJQURzQjs7MEJBTXhCLHFCQUFBLEdBQXVCLFNBQUMsTUFBRDtBQUNyQixVQUFBO2FBQUEsSUFBQyxDQUFBLEtBQUQsaURBQTZCLENBQUUsY0FBL0I7SUFEcUI7OzBCQU12QixvQkFBQSxHQUFzQixTQUFDLE1BQUQ7QUFDcEIsVUFBQTthQUFBLElBQUMsQ0FBQSxLQUFELGtEQUE4QixDQUFFLFlBQWhDO0lBRG9COzswQkFNdEIsbUJBQUEsR0FBcUIsU0FBQyxNQUFEO0FBQ25CLFVBQUE7YUFBQSxJQUFDLENBQUEsS0FBRCxpREFBNkIsQ0FBRSxZQUEvQjtJQURtQjs7MEJBTXJCLHNCQUFBLEdBQXdCLFNBQUMsVUFBRDtBQUN0QixVQUFBO01BQUEsTUFBQSxHQUFhLElBQUEsTUFBQSxDQUFPLElBQUEsR0FBSSxDQUFDLFlBQUEsQ0FBYSxVQUFiLENBQUQsQ0FBSixHQUE4QixHQUFyQzthQUNiLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFuQjtJQUZzQjs7MEJBT3hCLHFCQUFBLEdBQXVCLFNBQUMsVUFBRDtBQUNyQixVQUFBO01BQUEsTUFBQSxHQUFhLElBQUEsTUFBQSxDQUFPLElBQUEsR0FBSSxDQUFDLFlBQUEsQ0FBYSxVQUFiLENBQUQsQ0FBSixHQUE4QixHQUFyQzthQUNiLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixNQUFsQjtJQUZxQjs7MEJBT3ZCLDBCQUFBLEdBQTRCLFNBQUE7YUFDMUIsSUFBQyxDQUFBLGlCQUFELENBQW1CLElBQUMsQ0FBQSwwQkFBRCxDQUFBLENBQW5CO0lBRDBCOzswQkFNNUIseUJBQUEsR0FBMkIsU0FBQTthQUN6QixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLDBCQUFELENBQUEsQ0FBbEI7SUFEeUI7OzBCQU0zQiw2QkFBQSxHQUErQixTQUFBO2FBQzdCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFuQjtJQUQ2Qjs7MEJBTS9CLDRCQUFBLEdBQThCLFNBQUE7YUFDNUIsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBQWxCO0lBRDRCOzswQkFNOUIsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO01BQ2pCLElBQUcsQ0FBSSxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsQ0FBUDtlQUNFLElBQUMsQ0FBQSxLQUFELENBQU8sR0FBUCxFQURGOztJQURpQjs7MEJBT25CLGdCQUFBLEdBQWtCLFNBQUMsTUFBRDtNQUNoQixJQUFHLENBQUksSUFBQyxDQUFBLHFCQUFELENBQXVCLE1BQXZCLENBQVA7ZUFDRSxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBQSxDQUFQLEVBREY7O0lBRGdCOzswQkFLbEIsV0FBQSxHQUFhLFNBQUMsSUFBRDtBQUNYLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO01BQ1gsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixDQUFDLFFBQUQsRUFBVyxRQUFYLENBQTdCLEVBQW1ELElBQW5EO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixRQUExQjtJQUhXOzswQkFLYixvQkFBQSxHQUFzQixTQUFBO0FBQ3BCLFVBQUE7TUFBQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsS0FBeEI7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO01BQ1IsSUFBQyxDQUFBLHFCQUFELENBQXVCLEtBQXZCO01BQ0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTthQUNOLENBQUMsS0FBRCxFQUFRLEdBQVI7SUFMb0I7OzBCQU90QixnQkFBQSxHQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBO01BQ04sV0FBQSxHQUFjO01BRWQsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtNQUNSLENBQUEsR0FBSSxDQUFBLEdBQUksS0FBSyxDQUFDO0FBQ2QsYUFBTSxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFwQyxDQUFqQixDQUFBLElBQTZELENBQUEsSUFBSyxHQUFHLENBQUMsR0FBNUU7UUFDRSxDQUFBLElBQUs7TUFEUDtBQUVBLGFBQU0sQ0FBQSxHQUFJLENBQUosSUFBVSxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFBLEdBQUksQ0FBeEMsQ0FBakIsQ0FBaEI7UUFDRSxDQUFBLElBQUs7TUFEUDtNQUdBLElBQUcsQ0FBQSxLQUFLLENBQVI7UUFFRSxDQUFBLElBQUs7QUFDTCxlQUFNLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFmLENBQW9DLENBQXBDLENBQWpCLENBQUEsSUFBNkQsQ0FBQSxJQUFLLEdBQUcsQ0FBQyxHQUE1RTtVQUNFLENBQUEsSUFBSztRQURQO2VBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFMLEVBQVEsQ0FBUixDQUFELEVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFiLENBQXBDLEVBQTBELEVBQTFELEVBTEY7T0FBQSxNQU1LLElBQUcsQ0FBQSxLQUFLLENBQUEsR0FBSSxDQUFaO1FBRUgsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBcEMsRUFBc0QsRUFBdEQ7ZUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBMUIsRUFIRztPQUFBLE1BQUE7UUFNSCxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFwQyxFQUFzRCxJQUF0RDtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUExQixFQVBHOztJQWpCVzs7MEJBMEJsQixhQUFBLEdBQWUsU0FBQyxXQUFEO0FBQ2IsVUFBQTtNQUFBLElBQUMsQ0FBQSw0QkFBRCxDQUFBO01BQ0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtNQUNSLElBQUMsQ0FBQSx5QkFBRCxDQUFBO01BQ0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtNQUNOLEtBQUEsR0FBUSxDQUFDLEtBQUQsRUFBUSxHQUFSO01BQ1IsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0I7YUFDUCxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCLEVBQW9DLFdBQUEsQ0FBWSxJQUFaLENBQXBDO0lBUGE7OzBCQVNmLGdCQUFBLEdBQWtCLFNBQUMsTUFBRDthQUNoQixJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2pCLGNBQUE7VUFBQSxHQUFBLEdBQU0sS0FBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO1VBQ04sS0FBQyxDQUFBLDZCQUFELENBQUE7VUFDQSxLQUFDLENBQUEsMEJBQUQsQ0FBQTtVQUNBLEtBQUEsR0FBUSxLQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUE7aUJBQ1IsQ0FBQyxLQUFELEVBQVEsR0FBUjtRQUxpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7SUFEZ0I7OzBCQVFsQixRQUFBLEdBQVUsU0FBQyxNQUFEO2FBQ1IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNqQixjQUFBO1VBQUEsS0FBQSxHQUFRLEtBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtVQUNSLEtBQUMsQ0FBQSw0QkFBRCxDQUFBO1VBQ0EsS0FBQyxDQUFBLHlCQUFELENBQUE7VUFDQSxHQUFBLEdBQU0sS0FBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO2lCQUNOLENBQUMsS0FBRCxFQUFRLEdBQVI7UUFMaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0lBRFE7OzBCQVFWLFFBQUEsR0FBVSxTQUFDLE1BQUQ7YUFDUixJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2pCLGNBQUE7VUFBQSxLQUFBLEdBQVEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO1VBQ1IsSUFBQSxHQUFPLEtBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBSyxDQUFDLEdBQW5DO1VBQ1AsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFoQixJQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXpCO1lBQ0ksR0FBQSxHQUFNLENBQUMsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUFiLEVBQWdCLENBQWhCLEVBRFY7V0FBQSxNQUFBO1lBR0UsSUFBRyxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLE1BQWpCLENBQWIsQ0FBSDtjQUNFLEdBQUEsR0FBTSxDQUFDLEtBQUssQ0FBQyxHQUFOLEdBQVksQ0FBYixFQUFnQixDQUFoQixFQURSO2FBQUEsTUFBQTtjQUdFLEdBQUEsR0FBTSxDQUFDLEtBQUssQ0FBQyxHQUFQLEVBQVksSUFBSSxDQUFDLE1BQWpCLEVBSFI7YUFIRjs7aUJBT0EsQ0FBQyxLQUFELEVBQVEsR0FBUjtRQVZpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7SUFEUTs7MEJBYVYsVUFBQSxHQUFZLFNBQUMsTUFBRDthQUNWLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxFQUFtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDakIsY0FBQTtVQUFBLFFBQUEsR0FBVyxLQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFsQixDQUFBO2lCQUNYLENBQUMsUUFBRCxFQUFXLFFBQVg7UUFGaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0lBRFU7OzBCQUtaLFNBQUEsR0FBVyxTQUFDLE1BQUQsRUFBZ0IsU0FBaEI7QUFDVCxVQUFBOztRQURVLFNBQU87O01BQ2pCLElBQUcsK0JBQUEsSUFBdUIsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFsQixDQUFBLENBQTlCO1FBQ0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWxCLENBQUE7UUFDUixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFsQixDQUFBLEVBRkY7T0FBQSxNQUFBO1FBSUUsS0FBQSxHQUFRLFNBQUEsQ0FBQSxFQUpWOztNQU1BLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCO01BQ1AsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUE3QixFQUFvQyxFQUFwQztNQUNBLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFBO01BQ1gsUUFBUyxDQUFBLE1BQUEsQ0FBVCxDQUFpQixJQUFqQjthQUNBLFFBQVEsQ0FBQyxlQUFULENBQUE7SUFYUzs7MEJBYVgsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQUE7TUFDWCxJQUFVLFFBQVEsQ0FBQyxPQUFULENBQUEsQ0FBVjtBQUFBLGVBQUE7O01BQ0EsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVg7UUFDRSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBbEIsQ0FBQTtRQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQWxCLENBQUEsRUFGRjtPQUFBLE1BQUE7UUFJRSxRQUFBLEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO1FBQ1gsS0FBQSxHQUFRLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFMVjs7TUFNQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUE3QixFQUFvQyxRQUFRLENBQUMsZUFBVCxDQUFBLENBQXBDO01BQ1gsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixRQUFRLENBQUMsR0FBbkM7O1FBQ0EsSUFBQyxDQUFBLGNBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUEsQ0FBM0I7O2FBQ2hCLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBYixDQUE0QixRQUE1QjtJQVpJOzswQkFjTixVQUFBLEdBQVksU0FBQyxDQUFEO0FBQ1YsVUFBQTtNQUFBLElBQVUsSUFBQyxDQUFBLFdBQUQsS0FBZ0IsSUFBMUI7QUFBQSxlQUFBOztNQUNBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVcsQ0FBQyxNQUFaLENBQW1CLENBQW5CO01BQ1IsSUFBTyxLQUFBLEtBQVMsSUFBaEI7UUFDRSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsV0FBVyxDQUFDLGNBQWIsQ0FBQSxDQUE3QixFQUE0RCxLQUE1RDtlQUNSLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBYixDQUE0QixLQUE1QixFQUZGOztJQUhVOzswQkFPWixZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7O1dBQVksQ0FBRSxPQUFkLENBQUE7O2FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUZIOzswQkFJZCxrQkFBQSxHQUFvQixTQUFDLFFBQUQ7QUFDbEIsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFFBQVEsQ0FBQyxHQUF0QyxDQUEwQyxDQUFDO01BQ3hELElBQUcsUUFBUSxDQUFDLE1BQVQsS0FBbUIsVUFBdEI7UUFDRSxJQUFHLFFBQVEsQ0FBQyxHQUFULEtBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBQSxDQUFuQjtpQkFDRSxLQURGO1NBQUEsTUFBQTtpQkFHRSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLENBQUMsUUFBRCxFQUFXLENBQUMsUUFBUSxDQUFDLEdBQVQsR0FBZSxDQUFoQixFQUFtQixDQUFuQixDQUFYLENBQTdCLEVBSEY7U0FERjtPQUFBLE1BQUE7ZUFNRSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLENBQUMsUUFBRCxFQUFXLFFBQVEsQ0FBQyxTQUFULENBQW1CLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBbkIsQ0FBWCxDQUE3QixFQU5GOztJQUZrQjs7MEJBVXBCLHNCQUFBLEdBQXdCLFNBQUMsUUFBRDtBQUN0QixVQUFBO01BQUEsSUFBRyxRQUFRLENBQUMsTUFBVCxLQUFtQixDQUF0QjtRQUNFLElBQUcsUUFBUSxDQUFDLEdBQVQsS0FBZ0IsQ0FBbkI7aUJBQ0UsS0FERjtTQUFBLE1BQUE7VUFHRSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixRQUFRLENBQUMsR0FBVCxHQUFlLENBQTVDLENBQThDLENBQUM7aUJBQ3hELElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFULEdBQWUsQ0FBaEIsRUFBbUIsTUFBbkIsQ0FBRCxFQUE2QixRQUE3QixDQUE3QixFQUpGO1NBREY7T0FBQSxNQUFBO2VBT0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixDQUFDLFFBQVEsQ0FBQyxTQUFULENBQW1CLENBQUMsQ0FBRCxFQUFJLENBQUMsQ0FBTCxDQUFuQixDQUFELEVBQThCLFFBQTlCLENBQTdCLEVBUEY7O0lBRHNCOzswQkFVeEIsYUFBQSxHQUFlLFNBQUE7YUFDYixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBLENBQXBCO0lBRGE7OzBCQUdmLGlCQUFBLEdBQW1CLFNBQUE7YUFDakIsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQSxDQUFwQjtJQURpQjs7MEJBSW5CLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO01BQ1IsTUFBQSxHQUFTLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQjthQUNULElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsTUFBMUI7SUFIZTs7MEJBTWpCLGdCQUFBLEdBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUE7TUFDUixNQUFBLEdBQVMsSUFBQyxDQUFBLGlCQUFELENBQW1CLEtBQW5CO2FBQ1QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixNQUExQjtJQUhnQjs7MEJBTWxCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO01BQ1IsTUFBQSxHQUFTLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQjtNQUNULElBQXFDLE1BQXJDO2VBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixNQUExQixFQUFBOztJQUhlOzswQkFNakIsZ0JBQUEsR0FBa0IsU0FBQTtBQUNoQixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtNQUNSLE1BQUEsR0FBUyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkI7TUFDVCxJQUFxQyxNQUFyQztlQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsTUFBMUIsRUFBQTs7SUFIZ0I7OzBCQU1sQixRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxjQUFwQixDQUFBO01BQ1IsT0FBQSxHQUFVLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFLLENBQUMsR0FBeEI7TUFDVixJQUFBLEdBQU8sSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7TUFDUCxJQUFBLENBQXVCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBdkI7ZUFBQSxJQUFJLENBQUMsUUFBTCxDQUFBLEVBQUE7O0lBSlE7OzBCQVVWLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxNQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUEsQ0FBaEIsRUFBQyxhQUFELEVBQU07TUFDTixJQUFVLEdBQUEsS0FBTyxDQUFQLElBQWEsTUFBQSxLQUFVLENBQWpDO0FBQUEsZUFBQTs7TUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUE3QjtNQUNQLElBQUcsTUFBQSxLQUFVLENBQWI7UUFDRSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUFBLEdBQU0sQ0FBbkM7UUFDZixTQUFBLEdBQVksQ0FBQyxDQUFDLEdBQUEsR0FBTSxDQUFQLEVBQVUsWUFBWSxDQUFDLE1BQXZCLENBQUQsRUFBaUMsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFqQyxFQUZkO09BQUEsTUFHSyxJQUFHLE1BQUEsS0FBVSxJQUFJLENBQUMsTUFBbEI7UUFDSCxTQUFBLEdBQVksQ0FBQyxDQUFDLEdBQUQsRUFBTSxNQUFBLEdBQVMsQ0FBZixDQUFELEVBQW9CLENBQUMsR0FBRCxFQUFNLE1BQU4sQ0FBcEIsRUFEVDtPQUFBLE1BQUE7UUFHSCxTQUFBLEdBQVksQ0FBQyxDQUFDLEdBQUQsRUFBTSxNQUFBLEdBQVMsQ0FBZixDQUFELEVBQW9CLENBQUMsR0FBRCxFQUFNLE1BQUEsR0FBUyxDQUFmLENBQXBCLEVBSFQ7O01BSUwsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsU0FBN0I7YUFDUCxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFNBQTdCLEVBQXdDLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBTCxJQUFXLEVBQVosQ0FBQSxHQUFrQixJQUFLLENBQUEsQ0FBQSxDQUEvRDtJQWJjOzswQkFpQmhCLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxJQUFDLENBQUEsNkJBQUQsQ0FBQTtNQUVBLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBRCxDQUFBO01BQ2IsSUFBQyxDQUFBLHlCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsNEJBQUQsQ0FBQTtNQUNBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBLENBQXZDLENBQUg7ZUFFRSxJQUFDLENBQUEsNkJBQUQsQ0FBQSxFQUZGO09BQUEsTUFBQTtRQUlFLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBRCxDQUFBO2VBQ2IsSUFBQyxDQUFBLGdCQUFELENBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBTEY7O0lBTmM7OzBCQWVoQixjQUFBLEdBQWdCLFNBQUE7QUFDZCxVQUFBO01BQUEsSUFBQyxDQUFBLGdCQUFELENBQUE7TUFDQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUFBO01BQ1QsSUFBQyxDQUFBLGVBQUQsQ0FBQTtNQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUE7TUFFUCxJQUFDLENBQUEsZUFBRCxDQUFBO01BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTtNQUNQLElBQUMsQ0FBQSxnQkFBRCxDQUFBO01BQ0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQTthQUVULElBQUMsQ0FBQSxnQkFBRCxDQUFrQixDQUFDLE1BQUQsRUFBUyxJQUFULENBQWxCLEVBQWtDLENBQUMsTUFBRCxFQUFTLElBQVQsQ0FBbEM7SUFYYzs7MEJBZWhCLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUE7TUFDTixJQUFHLEdBQUEsS0FBTyxDQUFWO1FBQ0UsSUFBQyxDQUFBLG1CQUFELENBQUE7UUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBQTtRQUNBLEdBQUEsSUFBTyxFQUhUOztNQUlBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO01BRUEsU0FBQSxHQUFZLENBQUMsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFELEVBQVcsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxFQUFVLENBQVYsQ0FBWDtNQUNaLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFNBQTdCO01BQ1AsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixTQUE3QixFQUF3QyxFQUF4QzthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsQ0FBQyxDQUFDLEdBQUEsR0FBTSxDQUFQLEVBQVUsQ0FBVixDQUFELEVBQWUsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxFQUFVLENBQVYsQ0FBZixDQUE3QixFQUEyRCxJQUEzRDtJQVhjOzswQkFhaEIsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsSUFBQyxDQUFBLDBCQUFELENBQUE7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLDhCQUFELENBQUE7TUFDUixTQUFBLEdBQWUsS0FBSCxHQUFjLEtBQUssQ0FBQyxHQUFwQixHQUE2QixDQUFDLENBQUQsRUFBSSxDQUFKO01BQ3pDLEtBQUEsR0FBUSxJQUFDLENBQUEsNkJBQUQsQ0FBQTtNQUNSLE9BQUEsR0FBYSxLQUFILEdBQWMsS0FBSyxDQUFDLEtBQXBCLEdBQStCLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBQTthQUN6QyxDQUFDLFNBQUQsRUFBWSxPQUFaO0lBTlU7OzBCQVFaLG1CQUFBLEdBQXFCLFNBQUE7QUFDbkIsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUEsQ0FBMkIsQ0FBQztNQUNsQyxJQUFHLEdBQUEsS0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFBLEdBQXlCLENBQW5DO1FBQ0UsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBQSxDQUE4QixDQUFDO2VBQ3hDLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsQ0FBQyxDQUFDLEdBQUQsRUFBTSxNQUFOLENBQUQsRUFBZ0IsQ0FBQyxHQUFELEVBQU0sTUFBTixDQUFoQixDQUE3QixFQUE2RCxJQUE3RCxFQUZGOztJQUZtQjs7MEJBTXJCLGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxFQUFTLE1BQVQ7QUFDaEIsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLE1BQTdCO01BQ1IsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsTUFBN0I7TUFHUixJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLE1BQTdCLEVBQXFDLEtBQXJDO01BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUE3QixFQUFxQyxLQUFyQzthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsTUFBTyxDQUFBLENBQUEsQ0FBakM7SUFQZ0I7OzBCQVNsQixnQkFBQSxHQUFrQixTQUFDLEtBQUQ7QUFDaEIsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQUE7TUFDTixLQUFBLDBFQUFvRCxDQUFFLGVBQTlDLElBQXVEO01BQy9ELFNBQUEsR0FBWSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBcEI7TUFDWixJQUFHLE9BQU8sQ0FBQyxjQUFSLENBQXVCLFNBQXZCLENBQUEsSUFBcUMsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsU0FBdkIsQ0FBeEM7UUFDRSxNQUFBLEdBQVM7UUFDVCxLQUFBLEdBQVE7UUFDUixNQUFBLEdBQVM7UUFDVCxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBO1FBQ04sRUFBQSxHQUFLO1FBQ0wsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixFQUExQixFQUE4QixDQUFDLEtBQUQsRUFBUSxHQUFSLENBQTlCLEVBQTRDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDtBQUMxQyxnQkFBQTtZQUFBLElBQUcsR0FBRyxDQUFDLFNBQUosS0FBaUIsS0FBTSxDQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBZixDQUExQjtjQUNFLEtBQUssQ0FBQyxHQUFOLENBQUE7Y0FDQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO2dCQUNFLE1BQUEsR0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDO3VCQUNuQixHQUFHLENBQUMsSUFBSixDQUFBLEVBRkY7ZUFBQSxNQUdLLElBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxHQUFHLENBQUMsU0FBbkIsQ0FBSDt1QkFDSCxNQUFBLElBQVUsRUFEUDtlQUxQO2FBQUEsTUFPSyxJQUFHLENBQUMsTUFBQSxHQUFTLE9BQVEsQ0FBQSxHQUFHLENBQUMsU0FBSixDQUFsQixDQUFIO2NBQ0gsSUFBQSxDQUFBLENBQU8sU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQUEsSUFBMkIsTUFBQSxHQUFTLENBQTNDLENBQUE7Z0JBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYO2dCQUNBLElBQWUsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQWY7eUJBQUEsTUFBQSxJQUFVLEVBQVY7aUJBRkY7ZUFERzthQUFBLE1BSUEsSUFBRyxPQUFRLENBQUEsR0FBRyxDQUFDLFNBQUosQ0FBWDtjQUNILElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBbkI7dUJBQ0UsR0FBRyxDQUFDLElBQUosQ0FBQSxFQURGO2VBREc7O1VBWnFDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QztlQWVBLE1BQUEsSUFBVSxNQXJCWjtPQUFBLE1BQUE7aUZBdUJ1QyxDQUFFLGVBQXZDLElBQWdELElBdkJsRDs7SUFKZ0I7OzBCQTZCbEIsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO0FBQ2pCLFVBQUE7TUFBQSxLQUFBLDJFQUFxRCxDQUFFLGFBQS9DLElBQXNEO01BQzlELFNBQUEsR0FBWSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsS0FBeEI7TUFDWixJQUFHLE9BQU8sQ0FBQyxjQUFSLENBQXVCLFNBQXZCLENBQUEsSUFBcUMsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsU0FBdkIsQ0FBeEM7UUFDRSxNQUFBLEdBQVM7UUFDVCxLQUFBLEdBQVE7UUFDUixNQUFBLEdBQVM7UUFDVCxFQUFBLEdBQUs7UUFDTCxJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQW1DLEVBQW5DLEVBQXVDLENBQUMsR0FBRCxFQUFNLEtBQU4sQ0FBdkMsRUFBcUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxHQUFEO0FBQ25ELGdCQUFBO1lBQUEsSUFBRyxHQUFHLENBQUMsU0FBSixLQUFpQixLQUFNLENBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLENBQTFCO2NBQ0UsS0FBSyxDQUFDLEdBQU4sQ0FBQTtjQUNBLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBbkI7Z0JBQ0UsTUFBQSxHQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUM7dUJBQ25CLEdBQUcsQ0FBQyxJQUFKLENBQUEsRUFGRjtlQUFBLE1BR0ssSUFBRyxTQUFTLENBQUMsSUFBVixDQUFlLEdBQUcsQ0FBQyxTQUFuQixDQUFIO3VCQUNILE1BQUEsSUFBVSxFQURQO2VBTFA7YUFBQSxNQU9LLElBQUcsQ0FBQyxNQUFBLEdBQVMsT0FBUSxDQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWxCLENBQUg7Y0FDSCxJQUFBLENBQUEsQ0FBTyxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsQ0FBQSxJQUEyQixNQUFBLEdBQVMsQ0FBM0MsQ0FBQTtnQkFDRSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQVg7Z0JBQ0EsSUFBZSxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsQ0FBZjt5QkFBQSxNQUFBLElBQVUsRUFBVjtpQkFGRjtlQURHO2FBQUEsTUFJQSxJQUFHLE9BQVEsQ0FBQSxHQUFHLENBQUMsU0FBSixDQUFYO2NBQ0gsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFuQjt1QkFDRSxHQUFHLENBQUMsSUFBSixDQUFBLEVBREY7ZUFERzs7VUFaOEM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJEO2VBZUEsTUFBQSxJQUFVLE1BcEJaO09BQUEsTUFBQTtrRkFzQndDLENBQUUsYUFBeEMsSUFBK0MsSUF0QmpEOztJQUhpQjs7MEJBMkJuQixnQkFBQSxHQUFrQixTQUFDLEtBQUQ7QUFDaEIsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQUE7TUFDTixJQUFHLENBQUMsQ0FBQyxLQUFBLEdBQVEsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQXBCLEVBQTJCLFlBQTNCLENBQVQsQ0FBSjtBQUNFLGVBQU8sS0FEVDs7TUFFQSxHQUFBLEdBQU0sSUFBSSxDQUFDLGdCQUFMLENBQXNCLEtBQUssQ0FBQyxLQUE1QjtNQUNOLElBQUcsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFLLENBQUMsS0FBbEIsQ0FBSDtlQUFpQyxLQUFqQztPQUFBLE1BQUE7ZUFBMkMsSUFBM0M7O0lBTGdCOzswQkFPbEIsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO0FBQ2pCLFVBQUE7TUFBQSxJQUFHLENBQUMsQ0FBQyxLQUFBLEdBQVEsSUFBQyxDQUFBLG1CQUFELENBQXFCLEtBQXJCLEVBQTRCLFlBQTVCLENBQVQsQ0FBSjtBQUNFLGVBQU8sS0FEVDs7TUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLGlCQUFMLENBQXVCLEtBQUssQ0FBQyxHQUE3QjtNQUNSLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFLLENBQUMsR0FBcEIsQ0FBSDtlQUFpQyxLQUFqQztPQUFBLE1BQUE7ZUFBMkMsTUFBM0M7O0lBSmlCOzswQkFNbkIsbUJBQUEsR0FBcUIsU0FBQyxLQUFELEVBQVEsTUFBUjtBQUNuQixVQUFBO01BQUEsTUFBQSxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxNQUFuQyxFQUEyQyxDQUFDLEdBQUQsRUFBTSxLQUFOLENBQTNDLEVBQXlELFNBQUMsR0FBRDtlQUN2RCxNQUFBLEdBQVMsR0FBRyxDQUFDO01BRDBDLENBQXpEO2FBRUE7SUFKbUI7OzBCQU1yQixrQkFBQSxHQUFvQixTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ2xCLFVBQUE7TUFBQSxNQUFBLEdBQVM7TUFDVCxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBO01BQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixNQUExQixFQUFrQyxDQUFDLEtBQUQsRUFBUSxHQUFSLENBQWxDLEVBQWdELFNBQUMsR0FBRDtlQUM5QyxNQUFBLEdBQVMsR0FBRyxDQUFDO01BRGlDLENBQWhEO2FBRUE7SUFMa0I7OzBCQU9wQix1QkFBQSxHQUF5QixTQUFBO0FBQ3ZCLFVBQUE7TUFBQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCO2FBQ2hCLElBQUEsTUFBQSxDQUFPLE9BQUEsR0FBVSxZQUFBLENBQWEsaUJBQWIsQ0FBVixHQUE0QyxHQUFuRDtJQUZtQjs7MEJBSXpCLDBCQUFBLEdBQTRCLFNBQUE7QUFDMUIsVUFBQTtNQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEI7YUFDaEIsSUFBQSxNQUFBLENBQU8sTUFBQSxHQUFTLFlBQUEsQ0FBYSxpQkFBYixDQUFULEdBQTJDLEdBQWxEO0lBRnNCOzswQkFJNUIsS0FBQSxHQUFPLFNBQUMsS0FBRDtNQUNMLElBQUcsS0FBSDtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsS0FBMUI7ZUFDQSxLQUZGO09BQUEsTUFBQTtlQUlFLE1BSkY7O0lBREs7Ozs7OztFQVNULFlBQUEsR0FBZSxTQUFDLE1BQUQ7SUFDYixJQUFHLE1BQUg7YUFDRSxNQUFNLENBQUMsT0FBUCxDQUFlLHdCQUFmLEVBQXlDLE1BQXpDLEVBREY7S0FBQSxNQUFBO2FBR0UsR0FIRjs7RUFEYTs7RUFNZixHQUFBLEdBQU07SUFBQyxHQUFBLEVBQUssQ0FBTjtJQUFTLE1BQUEsRUFBUSxDQUFqQjs7QUEzZ0JOIiwic291cmNlc0NvbnRlbnQiOlsiS2lsbFJpbmcgPSByZXF1aXJlICcuL2tpbGwtcmluZydcbk1hcmsgPSByZXF1aXJlICcuL21hcmsnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5PUEVORVJTID0geycoJzogJyknLCAnWyc6ICddJywgJ3snOiAnfScsICdcXCcnOiAnXFwnJywgJ1wiJzogJ1wiJywgJ2AnOiAnYCd9XG5DTE9TRVJTID0geycpJzogJygnLCAnXSc6ICdbJywgJ30nOiAneycsICdcXCcnOiAnXFwnJywgJ1wiJzogJ1wiJywgJ2AnOiAnYCd9XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVtYWNzQ3Vyc29yXG4gIEBmb3I6IChjdXJzb3IpIC0+XG4gICAgY3Vyc29yLl9hdG9taWNFbWFjcyA/PSBuZXcgRW1hY3NDdXJzb3IoY3Vyc29yKVxuXG4gIGNvbnN0cnVjdG9yOiAoQGN1cnNvcikgLT5cbiAgICBAZWRpdG9yID0gQGN1cnNvci5lZGl0b3JcbiAgICBAX21hcmsgPSBudWxsXG4gICAgQF9sb2NhbEtpbGxSaW5nID0gbnVsbFxuICAgIEBfeWFua01hcmtlciA9IG51bGxcbiAgICBAX2Rpc3Bvc2FibGUgPSBAY3Vyc29yLm9uRGlkRGVzdHJveSA9PiBAZGVzdHJveSgpXG5cbiAgbWFyazogLT5cbiAgICBAX21hcmsgPz0gbmV3IE1hcmsoQGN1cnNvcilcblxuICBraWxsUmluZzogLT5cbiAgICBpZiBAZWRpdG9yLmhhc011bHRpcGxlQ3Vyc29ycygpXG4gICAgICBAZ2V0TG9jYWxLaWxsUmluZygpXG4gICAgZWxzZVxuICAgICAgS2lsbFJpbmcuZ2xvYmFsXG5cbiAgZ2V0TG9jYWxLaWxsUmluZzogLT5cbiAgICBAX2xvY2FsS2lsbFJpbmcgPz0gS2lsbFJpbmcuZ2xvYmFsLmZvcmsoKVxuXG4gIGNsZWFyTG9jYWxLaWxsUmluZzogLT5cbiAgICBAX2xvY2FsS2lsbFJpbmcgPSBudWxsXG5cbiAgZGVzdHJveTogLT5cbiAgICBAY2xlYXJMb2NhbEtpbGxSaW5nKClcbiAgICBAX2Rpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgQF9kaXNwb3NhYmxlID0gbnVsbFxuICAgIEBfeWFua01hcmtlcj8uZGVzdHJveSgpXG4gICAgQF9tYXJrPy5kZXN0cm95KClcbiAgICBkZWxldGUgQGN1cnNvci5fYXRvbWljRW1hY3NcblxuICAjIExvb2sgZm9yIHRoZSBwcmV2aW91cyBvY2N1cnJlbmNlIG9mIHRoZSBnaXZlbiByZWdleHAuXG4gICNcbiAgIyBSZXR1cm4gYSBSYW5nZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2UuIFRoaXMgZG9lcyBub3QgbW92ZSB0aGUgY3Vyc29yLlxuICBsb2NhdGVCYWNrd2FyZDogKHJlZ0V4cCkgLT5cbiAgICBAX2xvY2F0ZUJhY2t3YXJkRnJvbShAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIHJlZ0V4cClcblxuICAjIExvb2sgZm9yIHRoZSBuZXh0IG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIFJldHVybiBhIFJhbmdlIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZS4gVGhpcyBkb2VzIG5vdCBtb3ZlIHRoZSBjdXJzb3IuXG4gIGxvY2F0ZUZvcndhcmQ6IChyZWdFeHApIC0+XG4gICAgQF9sb2NhdGVGb3J3YXJkRnJvbShAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIHJlZ0V4cClcblxuICAjIExvb2sgZm9yIHRoZSBwcmV2aW91cyB3b3JkIGNoYXJhY3Rlci5cbiAgI1xuICAjIFJldHVybiBhIFJhbmdlIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZS4gVGhpcyBkb2VzIG5vdCBtb3ZlIHRoZSBjdXJzb3IuXG4gIGxvY2F0ZVdvcmRDaGFyYWN0ZXJCYWNrd2FyZDogLT5cbiAgICBAbG9jYXRlQmFja3dhcmQgQF9nZXRXb3JkQ2hhcmFjdGVyUmVnRXhwKClcblxuICAjIExvb2sgZm9yIHRoZSBuZXh0IHdvcmQgY2hhcmFjdGVyLlxuICAjXG4gICMgUmV0dXJuIGEgUmFuZ2UgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlLiBUaGlzIGRvZXMgbm90IG1vdmUgdGhlIGN1cnNvci5cbiAgbG9jYXRlV29yZENoYXJhY3RlckZvcndhcmQ6IC0+XG4gICAgQGxvY2F0ZUZvcndhcmQgQF9nZXRXb3JkQ2hhcmFjdGVyUmVnRXhwKClcblxuICAjIExvb2sgZm9yIHRoZSBwcmV2aW91cyBub253b3JkIGNoYXJhY3Rlci5cbiAgI1xuICAjIFJldHVybiBhIFJhbmdlIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZS4gVGhpcyBkb2VzIG5vdCBtb3ZlIHRoZSBjdXJzb3IuXG4gIGxvY2F0ZU5vbldvcmRDaGFyYWN0ZXJCYWNrd2FyZDogLT5cbiAgICBAbG9jYXRlQmFja3dhcmQgQF9nZXROb25Xb3JkQ2hhcmFjdGVyUmVnRXhwKClcblxuICAjIExvb2sgZm9yIHRoZSBuZXh0IG5vbndvcmQgY2hhcmFjdGVyLlxuICAjXG4gICMgUmV0dXJuIGEgUmFuZ2UgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlLiBUaGlzIGRvZXMgbm90IG1vdmUgdGhlIGN1cnNvci5cbiAgbG9jYXRlTm9uV29yZENoYXJhY3RlckZvcndhcmQ6IC0+XG4gICAgQGxvY2F0ZUZvcndhcmQgQF9nZXROb25Xb3JkQ2hhcmFjdGVyUmVnRXhwKClcblxuICAjIE1vdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBwcmV2aW91cyBvY2N1cnJlbmNlIG9mIHRoZSBnaXZlbiByZWdleHAuXG4gICNcbiAgIyBSZXR1cm4gdHJ1ZSBpZiBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICBnb1RvTWF0Y2hTdGFydEJhY2t3YXJkOiAocmVnRXhwKSAtPlxuICAgIEBfZ29UbyBAbG9jYXRlQmFja3dhcmQocmVnRXhwKT8uc3RhcnRcblxuICAjIE1vdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBuZXh0IG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIFJldHVybiB0cnVlIGlmIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gIGdvVG9NYXRjaFN0YXJ0Rm9yd2FyZDogKHJlZ0V4cCkgLT5cbiAgICBAX2dvVG8gQGxvY2F0ZUZvcndhcmQocmVnRXhwKT8uc3RhcnRcblxuICAjIE1vdmUgdG8gdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgb2NjdXJyZW5jZSBvZiB0aGUgZ2l2ZW4gcmVnZXhwLlxuICAjXG4gICMgUmV0dXJuIHRydWUgaWYgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAgZ29Ub01hdGNoRW5kQmFja3dhcmQ6IChyZWdFeHApIC0+XG4gICAgQF9nb1RvIEBsb2NhdGVCYWNrd2FyZChyZWdFeHApPy5lbmRcblxuICAjIE1vdmUgdG8gdGhlIGVuZCBvZiB0aGUgbmV4dCBvY2N1cnJlbmNlIG9mIHRoZSBnaXZlbiByZWdleHAuXG4gICNcbiAgIyBSZXR1cm4gdHJ1ZSBpZiBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICBnb1RvTWF0Y2hFbmRGb3J3YXJkOiAocmVnRXhwKSAtPlxuICAgIEBfZ29UbyBAbG9jYXRlRm9yd2FyZChyZWdFeHApPy5lbmRcblxuICAjIFNraXAgYmFja3dhcmRzIG92ZXIgdGhlIGdpdmVuIGNoYXJhY3RlcnMuXG4gICNcbiAgIyBJZiB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgcmVhY2hlZCwgcmVtYWluIHRoZXJlLlxuICBza2lwQ2hhcmFjdGVyc0JhY2t3YXJkOiAoY2hhcmFjdGVycykgLT5cbiAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiW14je2VzY2FwZVJlZ0V4cChjaGFyYWN0ZXJzKX1dXCIpXG4gICAgQHNraXBCYWNrd2FyZFVudGlsKHJlZ2V4cClcblxuICAjIFNraXAgZm9yd2FyZHMgb3ZlciB0aGUgZ2l2ZW4gY2hhcmFjdGVycy5cbiAgI1xuICAjIElmIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBDaGFyYWN0ZXJzRm9yd2FyZDogKGNoYXJhY3RlcnMpIC0+XG4gICAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIlteI3tlc2NhcGVSZWdFeHAoY2hhcmFjdGVycyl9XVwiKVxuICAgIEBza2lwRm9yd2FyZFVudGlsKHJlZ2V4cClcblxuICAjIFNraXAgYmFja3dhcmRzIG92ZXIgYW55IHdvcmQgY2hhcmFjdGVycy5cbiAgI1xuICAjIElmIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBXb3JkQ2hhcmFjdGVyc0JhY2t3YXJkOiAtPlxuICAgIEBza2lwQmFja3dhcmRVbnRpbChAX2dldE5vbldvcmRDaGFyYWN0ZXJSZWdFeHAoKSlcblxuICAjIFNraXAgZm9yd2FyZHMgb3ZlciBhbnkgd29yZCBjaGFyYWN0ZXJzLlxuICAjXG4gICMgSWYgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIHJlYWNoZWQsIHJlbWFpbiB0aGVyZS5cbiAgc2tpcFdvcmRDaGFyYWN0ZXJzRm9yd2FyZDogLT5cbiAgICBAc2tpcEZvcndhcmRVbnRpbChAX2dldE5vbldvcmRDaGFyYWN0ZXJSZWdFeHAoKSlcblxuICAjIFNraXAgYmFja3dhcmRzIG92ZXIgYW55IG5vbi13b3JkIGNoYXJhY3RlcnMuXG4gICNcbiAgIyBJZiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIgaXMgcmVhY2hlZCwgcmVtYWluIHRoZXJlLlxuICBza2lwTm9uV29yZENoYXJhY3RlcnNCYWNrd2FyZDogLT5cbiAgICBAc2tpcEJhY2t3YXJkVW50aWwoQF9nZXRXb3JkQ2hhcmFjdGVyUmVnRXhwKCkpXG5cbiAgIyBTa2lwIGZvcndhcmRzIG92ZXIgYW55IG5vbi13b3JkIGNoYXJhY3RlcnMuXG4gICNcbiAgIyBJZiB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgcmVhY2hlZCwgcmVtYWluIHRoZXJlLlxuICBza2lwTm9uV29yZENoYXJhY3RlcnNGb3J3YXJkOiAtPlxuICAgIEBza2lwRm9yd2FyZFVudGlsKEBfZ2V0V29yZENoYXJhY3RlclJlZ0V4cCgpKVxuXG4gICMgU2tpcCBvdmVyIGNoYXJhY3RlcnMgdW50aWwgdGhlIHByZXZpb3VzIG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIElmIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBCYWNrd2FyZFVudGlsOiAocmVnZXhwKSAtPlxuICAgIGlmIG5vdCBAZ29Ub01hdGNoRW5kQmFja3dhcmQocmVnZXhwKVxuICAgICAgQF9nb1RvIEJPQlxuXG4gICMgU2tpcCBvdmVyIGNoYXJhY3RlcnMgdW50aWwgdGhlIG5leHQgb2NjdXJyZW5jZSBvZiB0aGUgZ2l2ZW4gcmVnZXhwLlxuICAjXG4gICMgSWYgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIHJlYWNoZWQsIHJlbWFpbiB0aGVyZS5cbiAgc2tpcEZvcndhcmRVbnRpbDogKHJlZ2V4cCkgLT5cbiAgICBpZiBub3QgQGdvVG9NYXRjaFN0YXJ0Rm9yd2FyZChyZWdleHApXG4gICAgICBAX2dvVG8gQGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG5cbiAgIyBJbnNlcnQgdGhlIGdpdmVuIHRleHQgYWZ0ZXIgdGhpcyBjdXJzb3IuXG4gIGluc2VydEFmdGVyOiAodGV4dCkgLT5cbiAgICBwb3NpdGlvbiA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW3Bvc2l0aW9uLCBwb3NpdGlvbl0sIFwiXFxuXCIpXG4gICAgQGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcblxuICBob3Jpem9udGFsU3BhY2VSYW5nZTogLT5cbiAgICBAc2tpcENoYXJhY3RlcnNCYWNrd2FyZCgnIFxcdCcpXG4gICAgc3RhcnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBAc2tpcENoYXJhY3RlcnNGb3J3YXJkKCcgXFx0JylcbiAgICBlbmQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBbc3RhcnQsIGVuZF1cblxuICBkZWxldGVCbGFua0xpbmVzOiAtPlxuICAgIGVvZiA9IEBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKVxuICAgIGJsYW5rTGluZVJlID0gL15bIFxcdF0qJC9cblxuICAgIHBvaW50ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcyA9IGUgPSBwb2ludC5yb3dcbiAgICB3aGlsZSBibGFua0xpbmVSZS50ZXN0KEBjdXJzb3IuZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGUpKSBhbmQgZSA8PSBlb2Yucm93XG4gICAgICBlICs9IDFcbiAgICB3aGlsZSBzID4gMCBhbmQgYmxhbmtMaW5lUmUudGVzdChAY3Vyc29yLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzIC0gMSkpXG4gICAgICBzIC09IDFcblxuICAgIGlmIHMgPT0gZVxuICAgICAgIyBObyBibGFua3M6IGRlbGV0ZSBibGFua3MgYWhlYWQuXG4gICAgICBlICs9IDFcbiAgICAgIHdoaWxlIGJsYW5rTGluZVJlLnRlc3QoQGN1cnNvci5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZSkpIGFuZCBlIDw9IGVvZi5yb3dcbiAgICAgICAgZSArPSAxXG4gICAgICBAY3Vyc29yLmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW3MgKyAxLCAwXSwgW2UsIDBdXSwgJycpXG4gICAgZWxzZSBpZiBlID09IHMgKyAxXG4gICAgICAjIE9uZSBibGFuazogZGVsZXRlIGl0LlxuICAgICAgQGN1cnNvci5lZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tzLCAwXSwgW2UsIDBdXSwgJycpXG4gICAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtzLCAwXSlcbiAgICBlbHNlXG4gICAgICAjIE11bHRpcGxlIGJsYW5rczogZGVsZXRlIGFsbCBidXQgb25lLlxuICAgICAgQGN1cnNvci5lZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tzLCAwXSwgW2UsIDBdXSwgJ1xcbicpXG4gICAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtzLCAwXSlcblxuICB0cmFuc2Zvcm1Xb3JkOiAodHJhbnNmb3JtZXIpIC0+XG4gICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgIHN0YXJ0ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgQHNraXBXb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgIGVuZCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHJhbmdlID0gW3N0YXJ0LCBlbmRdXG4gICAgdGV4dCA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgdHJhbnNmb3JtZXIodGV4dCkpXG5cbiAgYmFja3dhcmRLaWxsV29yZDogKG1ldGhvZCkgLT5cbiAgICBAX2tpbGxVbml0IG1ldGhvZCwgPT5cbiAgICAgIGVuZCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcbiAgICAgIEBza2lwV29yZENoYXJhY3RlcnNCYWNrd2FyZCgpXG4gICAgICBzdGFydCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgW3N0YXJ0LCBlbmRdXG5cbiAga2lsbFdvcmQ6IChtZXRob2QpIC0+XG4gICAgQF9raWxsVW5pdCBtZXRob2QsID0+XG4gICAgICBzdGFydCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgICAgQHNraXBXb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgICAgZW5kID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBbc3RhcnQsIGVuZF1cblxuICBraWxsTGluZTogKG1ldGhvZCkgLT5cbiAgICBAX2tpbGxVbml0IG1ldGhvZCwgPT5cbiAgICAgIHN0YXJ0ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydC5yb3cpXG4gICAgICBpZiBzdGFydC5jb2x1bW4gPT0gMCBhbmQgYXRvbS5jb25maWcuZ2V0KFwiYXRvbWljLWVtYWNzLmtpbGxXaG9sZUxpbmVcIilcbiAgICAgICAgICBlbmQgPSBbc3RhcnQucm93ICsgMSwgMF1cbiAgICAgIGVsc2VcbiAgICAgICAgaWYgL15cXHMqJC8udGVzdChsaW5lLnNsaWNlKHN0YXJ0LmNvbHVtbikpXG4gICAgICAgICAgZW5kID0gW3N0YXJ0LnJvdyArIDEsIDBdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbmQgPSBbc3RhcnQucm93LCBsaW5lLmxlbmd0aF1cbiAgICAgIFtzdGFydCwgZW5kXVxuXG4gIGtpbGxSZWdpb246IChtZXRob2QpIC0+XG4gICAgQF9raWxsVW5pdCBtZXRob2QsID0+XG4gICAgICBwb3NpdGlvbiA9IEBjdXJzb3Iuc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIFtwb3NpdGlvbiwgcG9zaXRpb25dXG5cbiAgX2tpbGxVbml0OiAobWV0aG9kPSdwdXNoJywgZmluZFJhbmdlKSAtPlxuICAgIGlmIEBjdXJzb3Iuc2VsZWN0aW9uPyBhbmQgbm90IEBjdXJzb3Iuc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgcmFuZ2UgPSBAY3Vyc29yLnNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBAY3Vyc29yLnNlbGVjdGlvbi5jbGVhcigpXG4gICAgZWxzZVxuICAgICAgcmFuZ2UgPSBmaW5kUmFuZ2UoKVxuXG4gICAgdGV4dCA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgJycpXG4gICAga2lsbFJpbmcgPSBAa2lsbFJpbmcoKVxuICAgIGtpbGxSaW5nW21ldGhvZF0odGV4dClcbiAgICBraWxsUmluZy5nZXRDdXJyZW50RW50cnkoKVxuXG4gIHlhbms6IC0+XG4gICAga2lsbFJpbmcgPSBAa2lsbFJpbmcoKVxuICAgIHJldHVybiBpZiBraWxsUmluZy5pc0VtcHR5KClcbiAgICBpZiBAY3Vyc29yLnNlbGVjdGlvblxuICAgICAgcmFuZ2UgPSBAY3Vyc29yLnNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBAY3Vyc29yLnNlbGVjdGlvbi5jbGVhcigpXG4gICAgZWxzZVxuICAgICAgcG9zaXRpb24gPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIHJhbmdlID0gW3Bvc2l0aW9uLCBwb3NpdGlvbl1cbiAgICBuZXdSYW5nZSA9IEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIGtpbGxSaW5nLmdldEN1cnJlbnRFbnRyeSgpKVxuICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24obmV3UmFuZ2UuZW5kKVxuICAgIEBfeWFua01hcmtlciA/PSBAZWRpdG9yLm1hcmtCdWZmZXJQb3NpdGlvbihAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgQF95YW5rTWFya2VyLnNldEJ1ZmZlclJhbmdlKG5ld1JhbmdlKVxuXG4gIHJvdGF0ZVlhbms6IChuKSAtPlxuICAgIHJldHVybiBpZiBAX3lhbmtNYXJrZXIgPT0gbnVsbFxuICAgIGVudHJ5ID0gQGtpbGxSaW5nKCkucm90YXRlKG4pXG4gICAgdW5sZXNzIGVudHJ5IGlzIG51bGxcbiAgICAgIHJhbmdlID0gQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAX3lhbmtNYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSwgZW50cnkpXG4gICAgICBAX3lhbmtNYXJrZXIuc2V0QnVmZmVyUmFuZ2UocmFuZ2UpXG5cbiAgeWFua0NvbXBsZXRlOiAtPlxuICAgIEBfeWFua01hcmtlcj8uZGVzdHJveSgpXG4gICAgQF95YW5rTWFya2VyID0gbnVsbFxuXG4gIF9uZXh0Q2hhcmFjdGVyRnJvbTogKHBvc2l0aW9uKSAtPlxuICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvc2l0aW9uLnJvdykubGVuZ3RoXG4gICAgaWYgcG9zaXRpb24uY29sdW1uID09IGxpbmVMZW5ndGhcbiAgICAgIGlmIHBvc2l0aW9uLnJvdyA9PSBAZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKVxuICAgICAgICBudWxsXG4gICAgICBlbHNlXG4gICAgICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3Bvc2l0aW9uLCBbcG9zaXRpb24ucm93ICsgMSwgMF1dKVxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3Bvc2l0aW9uLCBwb3NpdGlvbi50cmFuc2xhdGUoWzAsIDFdKV0pXG5cbiAgX3ByZXZpb3VzQ2hhcmFjdGVyRnJvbTogKHBvc2l0aW9uKSAtPlxuICAgIGlmIHBvc2l0aW9uLmNvbHVtbiA9PSAwXG4gICAgICBpZiBwb3NpdGlvbi5yb3cgPT0gMFxuICAgICAgICBudWxsXG4gICAgICBlbHNlXG4gICAgICAgIGNvbHVtbiA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocG9zaXRpb24ucm93IC0gMSkubGVuZ3RoXG4gICAgICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1twb3NpdGlvbi5yb3cgLSAxLCBjb2x1bW5dLCBwb3NpdGlvbl0pXG4gICAgZWxzZVxuICAgICAgQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbcG9zaXRpb24udHJhbnNsYXRlKFswLCAtMV0pLCBwb3NpdGlvbl0pXG5cbiAgbmV4dENoYXJhY3RlcjogLT5cbiAgICBAX25leHRDaGFyYWN0ZXJGcm9tKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcblxuICBwcmV2aW91c0NoYXJhY3RlcjogLT5cbiAgICBAX25leHRDaGFyYWN0ZXJGcm9tKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcblxuICAjIFNraXAgdG8gdGhlIGVuZCBvZiB0aGUgY3VycmVudCBvciBuZXh0IHN5bWJvbGljIGV4cHJlc3Npb24uXG4gIHNraXBTZXhwRm9yd2FyZDogLT5cbiAgICBwb2ludCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHRhcmdldCA9IEBfc2V4cEZvcndhcmRGcm9tKHBvaW50KVxuICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24odGFyZ2V0KVxuXG4gICMgU2tpcCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBjdXJyZW50IG9yIHByZXZpb3VzIHN5bWJvbGljIGV4cHJlc3Npb24uXG4gIHNraXBTZXhwQmFja3dhcmQ6IC0+XG4gICAgcG9pbnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICB0YXJnZXQgPSBAX3NleHBCYWNrd2FyZEZyb20ocG9pbnQpXG4gICAgQGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbih0YXJnZXQpXG5cbiAgIyBTa2lwIHRvIHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgb3IgbmV4dCBsaXN0LlxuICBza2lwTGlzdEZvcndhcmQ6IC0+XG4gICAgcG9pbnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICB0YXJnZXQgPSBAX2xpc3RGb3J3YXJkRnJvbShwb2ludClcbiAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHRhcmdldCkgaWYgdGFyZ2V0XG5cbiAgIyBTa2lwIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGN1cnJlbnQgb3IgcHJldmlvdXMgbGlzdC5cbiAgc2tpcExpc3RCYWNrd2FyZDogLT5cbiAgICBwb2ludCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHRhcmdldCA9IEBfbGlzdEJhY2t3YXJkRnJvbShwb2ludClcbiAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHRhcmdldCkgaWYgdGFyZ2V0XG5cbiAgIyBBZGQgdGhlIG5leHQgc2V4cCB0byB0aGUgY3Vyc29yJ3Mgc2VsZWN0aW9uLiBBY3RpdmF0ZSBpZiBuZWNlc3NhcnkuXG4gIG1hcmtTZXhwOiAtPlxuICAgIHJhbmdlID0gQGN1cnNvci5nZXRNYXJrZXIoKS5nZXRCdWZmZXJSYW5nZSgpXG4gICAgbmV3VGFpbCA9IEBfc2V4cEZvcndhcmRGcm9tKHJhbmdlLmVuZClcbiAgICBtYXJrID0gQG1hcmsoKS5zZXQobmV3VGFpbClcbiAgICBtYXJrLmFjdGl2YXRlKCkgdW5sZXNzIG1hcmsuaXNBY3RpdmUoKVxuXG4gICMgVHJhbnNwb3NlIHRoZSB0d28gY2hhcmFjdGVycyBhcm91bmQgdGhlIGN1cnNvci4gQXQgdGhlIGJlZ2lubmluZyBvZiBhIGxpbmUsXG4gICMgdHJhbnNwb3NlIHRoZSBuZXdsaW5lIHdpdGggdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZS4gQXQgdGhlIGVuZCBvZiBhXG4gICMgbGluZSwgdHJhbnNwb3NlIHRoZSBsYXN0IHR3byBjaGFyYWN0ZXJzLiBBdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIsIGRvXG4gICMgbm90aGluZy4gV2VpcmQsIGJ1dCB0aGF0J3MgRW1hY3MhXG4gIHRyYW5zcG9zZUNoYXJzOiAtPlxuICAgIHtyb3csIGNvbHVtbn0gPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICByZXR1cm4gaWYgcm93ID09IDAgYW5kIGNvbHVtbiA9PSAwXG5cbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG4gICAgaWYgY29sdW1uID09IDBcbiAgICAgIHByZXZpb3VzTGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93IC0gMSlcbiAgICAgIHBhaXJSYW5nZSA9IFtbcm93IC0gMSwgcHJldmlvdXNMaW5lLmxlbmd0aF0sIFtyb3csIDFdXVxuICAgIGVsc2UgaWYgY29sdW1uID09IGxpbmUubGVuZ3RoXG4gICAgICBwYWlyUmFuZ2UgPSBbW3JvdywgY29sdW1uIC0gMl0sIFtyb3csIGNvbHVtbl1dXG4gICAgZWxzZVxuICAgICAgcGFpclJhbmdlID0gW1tyb3csIGNvbHVtbiAtIDFdLCBbcm93LCBjb2x1bW4gKyAxXV1cbiAgICBwYWlyID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShwYWlyUmFuZ2UpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShwYWlyUmFuZ2UsIChwYWlyWzFdIG9yICcnKSArIHBhaXJbMF0pXG5cbiAgIyBUcmFuc3Bvc2UgdGhlIHdvcmQgYXQgdGhlIGN1cnNvciB3aXRoIHRoZSBuZXh0IG9uZS4gTW92ZSB0byB0aGUgZW5kIG9mIHRoZVxuICAjIG5leHQgd29yZC5cbiAgdHJhbnNwb3NlV29yZHM6IC0+XG4gICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcblxuICAgIHdvcmQxUmFuZ2UgPSBAX3dvcmRSYW5nZSgpXG4gICAgQHNraXBXb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgIEBza2lwTm9uV29yZENoYXJhY3RlcnNGb3J3YXJkKClcbiAgICBpZiBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKCkuaXNFcXVhbChAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgICAjIE5vIHNlY29uZCB3b3JkIC0ganVzdCBnbyBiYWNrLlxuICAgICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcbiAgICBlbHNlXG4gICAgICB3b3JkMlJhbmdlID0gQF93b3JkUmFuZ2UoKVxuICAgICAgQF90cmFuc3Bvc2VSYW5nZXMod29yZDFSYW5nZSwgd29yZDJSYW5nZSlcblxuICAjIFRyYW5zcG9zZSB0aGUgc2V4cCBhdCB0aGUgY3Vyc29yIHdpdGggdGhlIG5leHQgb25lLiBNb3ZlIHRvIHRoZSBlbmQgb2YgdGhlXG4gICMgbmV4dCBzZXhwLlxuICB0cmFuc3Bvc2VTZXhwczogLT5cbiAgICBAc2tpcFNleHBCYWNrd2FyZCgpXG4gICAgc3RhcnQxID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgQHNraXBTZXhwRm9yd2FyZCgpXG4gICAgZW5kMSA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gICAgQHNraXBTZXhwRm9yd2FyZCgpXG4gICAgZW5kMiA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIEBza2lwU2V4cEJhY2t3YXJkKClcbiAgICBzdGFydDIgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcblxuICAgIEBfdHJhbnNwb3NlUmFuZ2VzKFtzdGFydDEsIGVuZDFdLCBbc3RhcnQyLCBlbmQyXSlcblxuICAjIFRyYW5zcG9zZSB0aGUgbGluZSBhdCB0aGUgY3Vyc29yIHdpdGggdGhlIG9uZSBhYm92ZSBpdC4gTW92ZSB0byB0aGVcbiAgIyBiZWdpbm5pbmcgb2YgdGhlIG5leHQgbGluZS5cbiAgdHJhbnNwb3NlTGluZXM6IC0+XG4gICAgcm93ID0gQGN1cnNvci5nZXRCdWZmZXJSb3coKVxuICAgIGlmIHJvdyA9PSAwXG4gICAgICBAX2VuZExpbmVJZk5lY2Vzc2FyeSgpXG4gICAgICBAY3Vyc29yLm1vdmVEb3duKClcbiAgICAgIHJvdyArPSAxXG4gICAgQF9lbmRMaW5lSWZOZWNlc3NhcnkoKVxuXG4gICAgbGluZVJhbmdlID0gW1tyb3csIDBdLCBbcm93ICsgMSwgMF1dXG4gICAgdGV4dCA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UobGluZVJhbmdlKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UobGluZVJhbmdlLCAnJylcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbcm93IC0gMSwgMF0sIFtyb3cgLSAxLCAwXV0sIHRleHQpXG5cbiAgX3dvcmRSYW5nZTogLT5cbiAgICBAc2tpcFdvcmRDaGFyYWN0ZXJzQmFja3dhcmQoKVxuICAgIHJhbmdlID0gQGxvY2F0ZU5vbldvcmRDaGFyYWN0ZXJCYWNrd2FyZCgpXG4gICAgd29yZFN0YXJ0ID0gaWYgcmFuZ2UgdGhlbiByYW5nZS5lbmQgZWxzZSBbMCwgMF1cbiAgICByYW5nZSA9IEBsb2NhdGVOb25Xb3JkQ2hhcmFjdGVyRm9yd2FyZCgpXG4gICAgd29yZEVuZCA9IGlmIHJhbmdlIHRoZW4gcmFuZ2Uuc3RhcnQgZWxzZSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICBbd29yZFN0YXJ0LCB3b3JkRW5kXVxuXG4gIF9lbmRMaW5lSWZOZWNlc3Nhcnk6IC0+XG4gICAgcm93ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgIGlmIHJvdyA9PSBAZWRpdG9yLmdldExpbmVDb3VudCgpIC0gMVxuICAgICAgbGVuZ3RoID0gQGN1cnNvci5nZXRDdXJyZW50QnVmZmVyTGluZSgpLmxlbmd0aFxuICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW3JvdywgbGVuZ3RoXSwgW3JvdywgbGVuZ3RoXV0sIFwiXFxuXCIpXG5cbiAgX3RyYW5zcG9zZVJhbmdlczogKHJhbmdlMSwgcmFuZ2UyKSAtPlxuICAgIHRleHQxID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZTEpXG4gICAgdGV4dDIgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlMilcblxuICAgICMgVXBkYXRlIHJhbmdlMiBmaXJzdCBzbyBpdCBkb2Vzbid0IGNoYW5nZSByYW5nZTEuXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZTIsIHRleHQxKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UxLCB0ZXh0MilcbiAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHJhbmdlMlsxXSlcblxuICBfc2V4cEZvcndhcmRGcm9tOiAocG9pbnQpIC0+XG4gICAgZW9iID0gQGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG4gICAgcG9pbnQgPSBAX2xvY2F0ZUZvcndhcmRGcm9tKHBvaW50LCAvW1xcdygpW1xcXXt9J1wiXS9pKT8uc3RhcnQgb3IgZW9iXG4gICAgY2hhcmFjdGVyID0gQF9uZXh0Q2hhcmFjdGVyRnJvbShwb2ludClcbiAgICBpZiBPUEVORVJTLmhhc093blByb3BlcnR5KGNoYXJhY3Rlcikgb3IgQ0xPU0VSUy5oYXNPd25Qcm9wZXJ0eShjaGFyYWN0ZXIpXG4gICAgICByZXN1bHQgPSBudWxsXG4gICAgICBzdGFjayA9IFtdXG4gICAgICBxdW90ZXMgPSAwXG4gICAgICBlb2YgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIHJlID0gL1teKClbXFxde31cIidgXFxcXF0rfFxcXFwufFsoKVtcXF17fVwiJ2BdL2dcbiAgICAgIEBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgcmUsIFtwb2ludCwgZW9mXSwgKGhpdCkgPT5cbiAgICAgICAgaWYgaGl0Lm1hdGNoVGV4dCA9PSBzdGFja1tzdGFjay5sZW5ndGggLSAxXVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgaWYgc3RhY2subGVuZ3RoID09IDBcbiAgICAgICAgICAgIHJlc3VsdCA9IGhpdC5yYW5nZS5lbmRcbiAgICAgICAgICAgIGhpdC5zdG9wKClcbiAgICAgICAgICBlbHNlIGlmIC9eW1wiJ2BdJC8udGVzdChoaXQubWF0Y2hUZXh0KVxuICAgICAgICAgICAgcXVvdGVzIC09IDFcbiAgICAgICAgZWxzZSBpZiAoY2xvc2VyID0gT1BFTkVSU1toaXQubWF0Y2hUZXh0XSlcbiAgICAgICAgICB1bmxlc3MgL15bXCInYF0kLy50ZXN0KGNsb3NlcikgYW5kIHF1b3RlcyA+IDBcbiAgICAgICAgICAgIHN0YWNrLnB1c2goY2xvc2VyKVxuICAgICAgICAgICAgcXVvdGVzICs9IDEgaWYgL15bXCInYF0kLy50ZXN0KGNsb3NlcilcbiAgICAgICAgZWxzZSBpZiBDTE9TRVJTW2hpdC5tYXRjaFRleHRdXG4gICAgICAgICAgaWYgc3RhY2subGVuZ3RoID09IDBcbiAgICAgICAgICAgIGhpdC5zdG9wKClcbiAgICAgIHJlc3VsdCBvciBwb2ludFxuICAgIGVsc2VcbiAgICAgIEBfbG9jYXRlRm9yd2FyZEZyb20ocG9pbnQsIC9bXFxXXFxuXS9pKT8uc3RhcnQgb3IgZW9iXG5cbiAgX3NleHBCYWNrd2FyZEZyb206IChwb2ludCkgLT5cbiAgICBwb2ludCA9IEBfbG9jYXRlQmFja3dhcmRGcm9tKHBvaW50LCAvW1xcdygpW1xcXXt9J1wiXS9pKT8uZW5kIG9yIEJPQlxuICAgIGNoYXJhY3RlciA9IEBfcHJldmlvdXNDaGFyYWN0ZXJGcm9tKHBvaW50KVxuICAgIGlmIE9QRU5FUlMuaGFzT3duUHJvcGVydHkoY2hhcmFjdGVyKSBvciBDTE9TRVJTLmhhc093blByb3BlcnR5KGNoYXJhY3RlcilcbiAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgIHN0YWNrID0gW11cbiAgICAgIHF1b3RlcyA9IDBcbiAgICAgIHJlID0gL1teKClbXFxde31cIidgXFxcXF0rfFxcXFwufFsoKVtcXF17fVwiJ2BdL2dcbiAgICAgIEBlZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UgcmUsIFtCT0IsIHBvaW50XSwgKGhpdCkgPT5cbiAgICAgICAgaWYgaGl0Lm1hdGNoVGV4dCA9PSBzdGFja1tzdGFjay5sZW5ndGggLSAxXVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgaWYgc3RhY2subGVuZ3RoID09IDBcbiAgICAgICAgICAgIHJlc3VsdCA9IGhpdC5yYW5nZS5zdGFydFxuICAgICAgICAgICAgaGl0LnN0b3AoKVxuICAgICAgICAgIGVsc2UgaWYgL15bXCInYF0kLy50ZXN0KGhpdC5tYXRjaFRleHQpXG4gICAgICAgICAgICBxdW90ZXMgLT0gMVxuICAgICAgICBlbHNlIGlmIChvcGVuZXIgPSBDTE9TRVJTW2hpdC5tYXRjaFRleHRdKVxuICAgICAgICAgIHVubGVzcyAvXltcIidgXSQvLnRlc3Qob3BlbmVyKSBhbmQgcXVvdGVzID4gMFxuICAgICAgICAgICAgc3RhY2sucHVzaChvcGVuZXIpXG4gICAgICAgICAgICBxdW90ZXMgKz0gMSBpZiAvXltcIidgXSQvLnRlc3Qob3BlbmVyKVxuICAgICAgICBlbHNlIGlmIE9QRU5FUlNbaGl0Lm1hdGNoVGV4dF1cbiAgICAgICAgICBpZiBzdGFjay5sZW5ndGggPT0gMFxuICAgICAgICAgICAgaGl0LnN0b3AoKVxuICAgICAgcmVzdWx0IG9yIHBvaW50XG4gICAgZWxzZVxuICAgICAgQF9sb2NhdGVCYWNrd2FyZEZyb20ocG9pbnQsIC9bXFxXXFxuXS9pKT8uZW5kIG9yIEJPQlxuXG4gIF9saXN0Rm9yd2FyZEZyb206IChwb2ludCkgLT5cbiAgICBlb2IgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICBpZiAhKG1hdGNoID0gQF9sb2NhdGVGb3J3YXJkRnJvbShwb2ludCwgL1soKVtcXF17fV0vaSkpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIGVuZCA9IHRoaXMuX3NleHBGb3J3YXJkRnJvbShtYXRjaC5zdGFydClcbiAgICBpZiBlbmQuaXNFcXVhbChtYXRjaC5zdGFydCkgdGhlbiBudWxsIGVsc2UgZW5kXG5cbiAgX2xpc3RCYWNrd2FyZEZyb206IChwb2ludCkgLT5cbiAgICBpZiAhKG1hdGNoID0gQF9sb2NhdGVCYWNrd2FyZEZyb20ocG9pbnQsIC9bKClbXFxde31dL2kpKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICBzdGFydCA9IHRoaXMuX3NleHBCYWNrd2FyZEZyb20obWF0Y2guZW5kKVxuICAgIGlmIHN0YXJ0LmlzRXF1YWwobWF0Y2guZW5kKSB0aGVuIG51bGwgZWxzZSBzdGFydFxuXG4gIF9sb2NhdGVCYWNrd2FyZEZyb206IChwb2ludCwgcmVnRXhwKSAtPlxuICAgIHJlc3VsdCA9IG51bGxcbiAgICBAZWRpdG9yLmJhY2t3YXJkc1NjYW5JbkJ1ZmZlclJhbmdlIHJlZ0V4cCwgW0JPQiwgcG9pbnRdLCAoaGl0KSAtPlxuICAgICAgcmVzdWx0ID0gaGl0LnJhbmdlXG4gICAgcmVzdWx0XG5cbiAgX2xvY2F0ZUZvcndhcmRGcm9tOiAocG9pbnQsIHJlZ0V4cCkgLT5cbiAgICByZXN1bHQgPSBudWxsXG4gICAgZW9mID0gQGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG4gICAgQGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSByZWdFeHAsIFtwb2ludCwgZW9mXSwgKGhpdCkgLT5cbiAgICAgIHJlc3VsdCA9IGhpdC5yYW5nZVxuICAgIHJlc3VsdFxuXG4gIF9nZXRXb3JkQ2hhcmFjdGVyUmVnRXhwOiAtPlxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnKVxuICAgIG5ldyBSZWdFeHAoJ1teXFxcXHMnICsgZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKSArICddJylcblxuICBfZ2V0Tm9uV29yZENoYXJhY3RlclJlZ0V4cDogLT5cbiAgICBub25Xb3JkQ2hhcmFjdGVycyA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLm5vbldvcmRDaGFyYWN0ZXJzJylcbiAgICBuZXcgUmVnRXhwKCdbXFxcXHMnICsgZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKSArICddJylcblxuICBfZ29UbzogKHBvaW50KSAtPlxuICAgIGlmIHBvaW50XG4gICAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvaW50KVxuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiMgU3RvbGVuIGZyb20gdW5kZXJzY29yZS1wbHVzLCB3aGljaCB3ZSBjYW4ndCBzZWVtIHRvIHJlcXVpcmUoKSBmcm9tIGEgcGFja2FnZVxuIyB3aXRob3V0IGRlcGVuZGluZyBvbiBhIHNlcGFyYXRlIGNvcHkgb2YgdGhlIHdob2xlIGxpYnJhcnkuXG5lc2NhcGVSZWdFeHAgPSAoc3RyaW5nKSAtPlxuICBpZiBzdHJpbmdcbiAgICBzdHJpbmcucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJylcbiAgZWxzZVxuICAgICcnXG5cbkJPQiA9IHtyb3c6IDAsIGNvbHVtbjogMH1cbiJdfQ==

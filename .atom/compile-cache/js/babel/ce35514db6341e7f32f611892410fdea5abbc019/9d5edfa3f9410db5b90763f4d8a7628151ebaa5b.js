Object.defineProperty(exports, '__esModule', {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

'use babel';

var helpers = null;
var clangFlags = null;

var regex = new RegExp(['^(<stdin>|.+):', // Path, usually <stdin>
'(\\d+):(\\d+):', // Base line and column
'(?:({.+}):)?', // Range position(s), if present
' ([\\w \\\\-]+):', // Message type
' ([^[\\n\\r]+)', // The message
'(?: \\[(.+)\\])?\\r?$', // -W flag, if any
'(?:\\r?\\n^ .+$)+', // The visual caret diagnostics, necessary to include in output for fix-its
'(?:\\r?\\n^fix-it:".+":', // Start of fix-it block
'{(\\d+):(\\d+)-(\\d+):(\\d+)}:', // fix-it range
'"(.+)"', // fix-it replacement text
'$)?']. // End of fix-it block
join(''), 'gm');

/**
 * Given a set of ranges in clangs format, determine the range encompasing all points
 * @param  {String} ranges The raw range string to parse
 * @return {Range}        An Atom Range object encompasing all given ranges
 */
var parseClangRanges = function parseClangRanges(ranges) {
  var rangeRE = /{(\d+):(\d+)-(\d+):(\d+)}/g;
  var lineStart = undefined;
  var colStart = undefined;
  var lineEnd = undefined;
  var colEnd = undefined;

  var match = rangeRE.exec(ranges);
  while (match !== null) {
    var rangeLineStart = Number.parseInt(match[1], 10) - 1;
    var rangeColStart = Number.parseInt(match[2], 10) - 1;
    var rangeLineEnd = Number.parseInt(match[3], 10) - 1;
    var rangeColEnd = Number.parseInt(match[4], 10) - 1;
    if (lineStart === undefined) {
      // First match
      lineStart = rangeLineStart;
      colStart = rangeColStart;
      lineEnd = rangeLineEnd;
      colEnd = rangeColEnd;
    } else {
      if (rangeLineStart > lineEnd) {
        // Higher starting line
        lineEnd = rangeLineStart;
        colEnd = rangeColStart;
      }
      if (rangeLineEnd > lineEnd) {
        // Higher ending line
        lineEnd = rangeLineEnd;
        colEnd = rangeColEnd;
      }
      if (rangeColEnd > colEnd) {
        // Higher ending column
        colEnd = rangeColEnd;
      }
    }
    match = rangeRE.exec(ranges);
  }
  return [[lineStart, colStart], [lineEnd, colEnd]];
};

/**
 * Determine if a given path is open in an existing TextEditor
 * @param  {String} filePath The file path to search for an editor of
 * @return {TextEditor | false}      The TextEditor or false if none found
 */
var findTextEditor = function findTextEditor(filePath) {
  var allEditors = atom.workspace.getTextEditors();
  var matchingEditor = allEditors.find(function (textEditor) {
    return textEditor.getPath() === filePath;
  });
  return matchingEditor || false;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-clang');

    // FIXME: Remove backwards compatibility in a future minor version
    var oldPath = atom.config.get('linter-clang.execPath');
    if (oldPath !== undefined) {
      atom.config.unset('linter-clang.execPath');
      if (oldPath !== 'clang') {
        // If the old config wasn't set to the default migrate it over
        atom.config.set('linter-pylint.executablePath', oldPath);
      }
    }

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-clang.executablePath', function (value) {
      _this.executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangIncludePaths', function (value) {
      _this.clangIncludePaths = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangSuppressWarnings', function (value) {
      _this.clangSuppressWarnings = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangDefaultCFlags', function (value) {
      _this.clangDefaultCFlags = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangDefaultCppFlags', function (value) {
      _this.clangDefaultCppFlags = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangDefaultObjCFlags', function (value) {
      _this.clangDefaultObjCFlags = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangDefaultObjCppFlags', function (value) {
      _this.clangDefaultObjCppFlags = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-clang.clangErrorLimit', function (value) {
      _this.clangErrorLimit = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'clang',
      scope: 'file',
      lintsOnChange: true,
      grammarScopes: ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'],
      lint: _asyncToGenerator(function* (editor) {
        if (helpers === null) {
          helpers = require('atom-linter');
        }
        if (clangFlags === null) {
          clangFlags = require('clang-flags');
        }

        var filePath = editor.getPath();
        if (typeof filePath === 'undefined') {
          // The editor has no path, meaning it hasn't been saved. Although
          // clang could give us results for this, Linter needs a path
          return [];
        }
        var fileExt = (0, _path.extname)(filePath);
        var fileDir = (0, _path.dirname)(filePath);
        var fileText = editor.getText();
        var basePath = undefined;

        var args = ['-fsyntax-only', '-fno-color-diagnostics', '-fdiagnostics-parseable-fixits', '-fdiagnostics-print-source-range-info', '-fexceptions', '-ferror-limit=' + _this2.clangErrorLimit];

        // Non-Public API!
        var grammar = editor.getGrammar().name;

        switch (grammar) {
          case 'Objective-C':
            args.push('-xobjective-c');
            args.push.apply(args, _toConsumableArray(_this2.clangDefaultObjCFlags.split(/\s+/)));
            break;
          case 'Objective-C++':
            args.push('-xobjective-c++');
            args.push.apply(args, _toConsumableArray(_this2.clangDefaultObjCppFlags.split(/\s+/)));
            break;
          case 'C':
            args.push('-xc');
            args.push.apply(args, _toConsumableArray(_this2.clangDefaultCFlags.split(/\s+/)));
            break;
          default:
          case 'C++':
          case 'C++14':
            args.push('-xc++');
            args.push.apply(args, _toConsumableArray(_this2.clangDefaultCppFlags.split(/\s+/)));
            break;
        }

        if (fileExt === '.hpp' || fileExt === '.hh' || fileExt === '.h') {
          // Don't warn about #pragma once when linting header files
          args.push('-Wno-pragma-once-outside-header');
        }

        if (_this2.clangSuppressWarnings) {
          args.push('-w');
        }

        if (atom.inDevMode()) {
          args.push('--verbose');
        }

        _this2.clangIncludePaths.forEach(function (path) {
          return args.push('-I' + path);
        });

        var usingClangComplete = false;
        try {
          var flags = clangFlags.getClangFlags(filePath);
          flags.forEach(function (flag) {
            args.push(flag);
            usingClangComplete = true;
            var workingDir = /-working-directory=(.+)/.exec(flag);
            if (workingDir !== null) {
              basePath = workingDir[1];
            }
          });
        } catch (error) {
          if (atom.inDevMode()) {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        }

        if (editor.isModified() && usingClangComplete) {
          // If the user has a .clang-complete file we can't lint current
          // TextEditor contents, return null so nothing gets modified
          return null;
        }

        var execOpts = {
          stream: 'stderr',
          allowEmptyStderr: true
        };

        if (usingClangComplete) {
          args.push(filePath);
        } else {
          args.push('-');
          execOpts.stdin = fileText;
          execOpts.cwd = fileDir;
          basePath = fileDir;
        }

        var output = yield helpers.exec(_this2.executablePath, args, execOpts);

        if (editor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update results
          return null;
        }

        var toReturn = [];

        var match = regex.exec(output);
        while (match !== null) {
          var isCurrentFile = match[1] === '<stdin>';
          // If the "file" is stdin, override to the current editor's path
          var file = undefined;
          if (isCurrentFile) {
            file = filePath;
          } else if ((0, _path.isAbsolute)(match[1])) {
            file = match[1];
          } else {
            file = (0, _path.resolve)(basePath, match[1]);
          }
          var position = undefined;
          if (match[4]) {
            // Clang gave us a range, use that
            position = parseClangRanges(match[4]);
          } else {
            // Generate a range based on the single point
            var line = Number.parseInt(match[2], 10) - 1;
            var col = Number.parseInt(match[3], 10) - 1;
            if (!isCurrentFile) {
              var fileEditor = findTextEditor(file);
              if (fileEditor !== false) {
                // Found an open editor for the file
                position = helpers.generateRange(fileEditor, line, col);
              } else {
                // Generate a one character range in the file
                position = [[line, col], [line, col + 1]];
              }
            } else {
              position = helpers.generateRange(editor, line, col);
            }
          }
          var severity = /error/.test(match[5]) ? 'error' : 'warning';
          var excerpt = undefined;
          if (match[7]) {
            // There is a -Wflag specified, for now just re-insert that into the excerpt
            excerpt = match[6] + ' [' + match[7] + ']';
          } else {
            excerpt = match[6];
          }
          var message = {
            severity: severity,
            location: { file: file, position: position },
            excerpt: excerpt
          };
          if (match[8]) {
            // We have a suggested fix available
            var fixLineStart = Number.parseInt(match[8], 10) - 1;
            var fixColStart = Number.parseInt(match[9], 10) - 1;
            var fixLineEnd = Number.parseInt(match[10], 10) - 1;
            var fixColEnd = Number.parseInt(match[11], 10) - 1;
            message.solutions = [{
              position: [[fixLineStart, fixColStart], [fixLineEnd, fixColEnd]],
              replaceWith: match[12]
            }];
          }
          toReturn.push(message);
          match = regex.exec(output);
        }

        return toReturn;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLWNsYW5nL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUNZLE1BQU07O0FBSjVELFdBQVcsQ0FBQzs7QUFNWixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV0QixJQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUN2QixnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLHVCQUF1QjtBQUN2QixtQkFBbUI7QUFDbkIseUJBQXlCO0FBQ3pCLGdDQUFnQztBQUNoQyxRQUFRO0FBQ1IsS0FBSyxDQUNOO0FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7Ozs7O0FBT2xCLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksTUFBTSxFQUFLO0FBQ25DLE1BQU0sT0FBTyxHQUFHLDRCQUE0QixDQUFDO0FBQzdDLE1BQUksU0FBUyxZQUFBLENBQUM7QUFDZCxNQUFJLFFBQVEsWUFBQSxDQUFDO0FBQ2IsTUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLE1BQUksTUFBTSxZQUFBLENBQUM7O0FBRVgsTUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxTQUFPLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDckIsUUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFH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Q0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEQsZ0JBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RCxnQkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELG1CQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7QUFDbkIsc0JBQVEsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLHlCQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUM7V0FDSjtBQUNELGtCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZCLGVBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCOztBQUVELGVBQU8sUUFBUSxDQUFDO09BQ2pCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jbGFuZy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSwgaXNBYnNvbHV0ZSB9IGZyb20gJ3BhdGgnO1xuXG5sZXQgaGVscGVycyA9IG51bGw7XG5sZXQgY2xhbmdGbGFncyA9IG51bGw7XG5cbmNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gICdeKDxzdGRpbj58LispOicsIC8vIFBhdGgsIHVzdWFsbHkgPHN0ZGluPlxuICAnKFxcXFxkKyk6KFxcXFxkKyk6JywgLy8gQmFzZSBsaW5lIGFuZCBjb2x1bW5cbiAgJyg/Oih7Lit9KTopPycsIC8vIFJhbmdlIHBvc2l0aW9uKHMpLCBpZiBwcmVzZW50XG4gICcgKFtcXFxcdyBcXFxcXFxcXC1dKyk6JywgLy8gTWVzc2FnZSB0eXBlXG4gICcgKFteW1xcXFxuXFxcXHJdKyknLCAvLyBUaGUgbWVzc2FnZVxuICAnKD86IFxcXFxbKC4rKVxcXFxdKT9cXFxccj8kJywgLy8gLVcgZmxhZywgaWYgYW55XG4gICcoPzpcXFxccj9cXFxcbl4gLiskKSsnLCAvLyBUaGUgdmlzdWFsIGNhcmV0IGRpYWdub3N0aWNzLCBuZWNlc3NhcnkgdG8gaW5jbHVkZSBpbiBvdXRwdXQgZm9yIGZpeC1pdHNcbiAgJyg/OlxcXFxyP1xcXFxuXmZpeC1pdDpcIi4rXCI6JywgLy8gU3RhcnQgb2YgZml4LWl0IGJsb2NrXG4gICd7KFxcXFxkKyk6KFxcXFxkKyktKFxcXFxkKyk6KFxcXFxkKyl9OicsIC8vIGZpeC1pdCByYW5nZVxuICAnXCIoLispXCInLCAvLyBmaXgtaXQgcmVwbGFjZW1lbnQgdGV4dFxuICAnJCk/JywgLy8gRW5kIG9mIGZpeC1pdCBibG9ja1xuXS5qb2luKCcnKSwgJ2dtJyk7XG5cbi8qKlxuICogR2l2ZW4gYSBzZXQgb2YgcmFuZ2VzIGluIGNsYW5ncyBmb3JtYXQsIGRldGVybWluZSB0aGUgcmFuZ2UgZW5jb21wYXNpbmcgYWxsIHBvaW50c1xuICogQHBhcmFtICB7U3RyaW5nfSByYW5nZXMgVGhlIHJhdyByYW5nZSBzdHJpbmcgdG8gcGFyc2VcbiAqIEByZXR1cm4ge1JhbmdlfSAgICAgICAgQW4gQXRvbSBSYW5nZSBvYmplY3QgZW5jb21wYXNpbmcgYWxsIGdpdmVuIHJhbmdlc1xuICovXG5jb25zdCBwYXJzZUNsYW5nUmFuZ2VzID0gKHJhbmdlcykgPT4ge1xuICBjb25zdCByYW5nZVJFID0gL3soXFxkKyk6KFxcZCspLShcXGQrKTooXFxkKyl9L2c7XG4gIGxldCBsaW5lU3RhcnQ7XG4gIGxldCBjb2xTdGFydDtcbiAgbGV0IGxpbmVFbmQ7XG4gIGxldCBjb2xFbmQ7XG5cbiAgbGV0IG1hdGNoID0gcmFuZ2VSRS5leGVjKHJhbmdlcyk7XG4gIHdoaWxlIChtYXRjaCAhPT0gbnVsbCkge1xuICAgIGNvbnN0IHJhbmdlTGluZVN0YXJ0ID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxO1xuICAgIGNvbnN0IHJhbmdlQ29sU3RhcnQgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgY29uc3QgcmFuZ2VMaW5lRW5kID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxO1xuICAgIGNvbnN0IHJhbmdlQ29sRW5kID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzRdLCAxMCkgLSAxO1xuICAgIGlmIChsaW5lU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRmlyc3QgbWF0Y2hcbiAgICAgIGxpbmVTdGFydCA9IHJhbmdlTGluZVN0YXJ0O1xuICAgICAgY29sU3RhcnQgPSByYW5nZUNvbFN0YXJ0O1xuICAgICAgbGluZUVuZCA9IHJhbmdlTGluZUVuZDtcbiAgICAgIGNvbEVuZCA9IHJhbmdlQ29sRW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmFuZ2VMaW5lU3RhcnQgPiBsaW5lRW5kKSB7XG4gICAgICAgIC8vIEhpZ2hlciBzdGFydGluZyBsaW5lXG4gICAgICAgIGxpbmVFbmQgPSByYW5nZUxpbmVTdGFydDtcbiAgICAgICAgY29sRW5kID0gcmFuZ2VDb2xTdGFydDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZUxpbmVFbmQgPiBsaW5lRW5kKSB7XG4gICAgICAgIC8vIEhpZ2hlciBlbmRpbmcgbGluZVxuICAgICAgICBsaW5lRW5kID0gcmFuZ2VMaW5lRW5kO1xuICAgICAgICBjb2xFbmQgPSByYW5nZUNvbEVuZDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZUNvbEVuZCA+IGNvbEVuZCkge1xuICAgICAgICAvLyBIaWdoZXIgZW5kaW5nIGNvbHVtblxuICAgICAgICBjb2xFbmQgPSByYW5nZUNvbEVuZDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWF0Y2ggPSByYW5nZVJFLmV4ZWMocmFuZ2VzKTtcbiAgfVxuICByZXR1cm4gW1tsaW5lU3RhcnQsIGNvbFN0YXJ0XSwgW2xpbmVFbmQsIGNvbEVuZF1dO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBnaXZlbiBwYXRoIGlzIG9wZW4gaW4gYW4gZXhpc3RpbmcgVGV4dEVkaXRvclxuICogQHBhcmFtICB7U3RyaW5nfSBmaWxlUGF0aCBUaGUgZmlsZSBwYXRoIHRvIHNlYXJjaCBmb3IgYW4gZWRpdG9yIG9mXG4gKiBAcmV0dXJuIHtUZXh0RWRpdG9yIHwgZmFsc2V9ICAgICAgVGhlIFRleHRFZGl0b3Igb3IgZmFsc2UgaWYgbm9uZSBmb3VuZFxuICovXG5jb25zdCBmaW5kVGV4dEVkaXRvciA9IChmaWxlUGF0aCkgPT4ge1xuICBjb25zdCBhbGxFZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKTtcbiAgY29uc3QgbWF0Y2hpbmdFZGl0b3IgPSBhbGxFZGl0b3JzLmZpbmQoXG4gICAgdGV4dEVkaXRvciA9PiB0ZXh0RWRpdG9yLmdldFBhdGgoKSA9PT0gZmlsZVBhdGgpO1xuICByZXR1cm4gbWF0Y2hpbmdFZGl0b3IgfHwgZmFsc2U7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWNsYW5nJyk7XG5cbiAgICAvLyBGSVhNRTogUmVtb3ZlIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGluIGEgZnV0dXJlIG1pbm9yIHZlcnNpb25cbiAgICBjb25zdCBvbGRQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItY2xhbmcuZXhlY1BhdGgnKTtcbiAgICBpZiAob2xkUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdG9tLmNvbmZpZy51bnNldCgnbGludGVyLWNsYW5nLmV4ZWNQYXRoJyk7XG4gICAgICBpZiAob2xkUGF0aCAhPT0gJ2NsYW5nJykge1xuICAgICAgICAvLyBJZiB0aGUgb2xkIGNvbmZpZyB3YXNuJ3Qgc2V0IHRvIHRoZSBkZWZhdWx0IG1pZ3JhdGUgaXQgb3ZlclxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1weWxpbnQuZXhlY3V0YWJsZVBhdGgnLCBvbGRQYXRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY2xhbmcuZXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWNsYW5nLmNsYW5nSW5jbHVkZVBhdGhzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY2xhbmdJbmNsdWRlUGF0aHMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5jbGFuZ1N1cHByZXNzV2FybmluZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jbGFuZ1N1cHByZXNzV2FybmluZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRDRmxhZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jbGFuZ0RlZmF1bHRDRmxhZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRDcHBGbGFncycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNsYW5nRGVmYXVsdENwcEZsYWdzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0T2JqQ0ZsYWdzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY2xhbmdEZWZhdWx0T2JqQ0ZsYWdzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0T2JqQ3BwRmxhZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jbGFuZ0RlZmF1bHRPYmpDcHBGbGFncyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWNsYW5nLmNsYW5nRXJyb3JMaW1pdCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNsYW5nRXJyb3JMaW1pdCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ2NsYW5nJyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuYycsICdzb3VyY2UuY3BwJywgJ3NvdXJjZS5vYmpjJywgJ3NvdXJjZS5vYmpjcHAnXSxcbiAgICAgIGxpbnQ6IGFzeW5jIChlZGl0b3IpID0+IHtcbiAgICAgICAgaWYgKGhlbHBlcnMgPT09IG51bGwpIHtcbiAgICAgICAgICBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhbmdGbGFncyA9PT0gbnVsbCkge1xuICAgICAgICAgIGNsYW5nRmxhZ3MgPSByZXF1aXJlKCdjbGFuZy1mbGFncycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBpZiAodHlwZW9mIGZpbGVQYXRoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIFRoZSBlZGl0b3IgaGFzIG5vIHBhdGgsIG1lYW5pbmcgaXQgaGFzbid0IGJlZW4gc2F2ZWQuIEFsdGhvdWdoXG4gICAgICAgICAgLy8gY2xhbmcgY291bGQgZ2l2ZSB1cyByZXN1bHRzIGZvciB0aGlzLCBMaW50ZXIgbmVlZHMgYSBwYXRoXG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVFeHQgPSBleHRuYW1lKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgZmlsZURpciA9IGRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBiYXNlUGF0aDtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1xuICAgICAgICAgICctZnN5bnRheC1vbmx5JyxcbiAgICAgICAgICAnLWZuby1jb2xvci1kaWFnbm9zdGljcycsXG4gICAgICAgICAgJy1mZGlhZ25vc3RpY3MtcGFyc2VhYmxlLWZpeGl0cycsXG4gICAgICAgICAgJy1mZGlhZ25vc3RpY3MtcHJpbnQtc291cmNlLXJhbmdlLWluZm8nLFxuICAgICAgICAgICctZmV4Y2VwdGlvbnMnLFxuICAgICAgICAgIGAtZmVycm9yLWxpbWl0PSR7dGhpcy5jbGFuZ0Vycm9yTGltaXR9YCxcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBOb24tUHVibGljIEFQSSFcbiAgICAgICAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZTtcblxuICAgICAgICBzd2l0Y2ggKGdyYW1tYXIpIHtcbiAgICAgICAgICBjYXNlICdPYmplY3RpdmUtQyc6XG4gICAgICAgICAgICBhcmdzLnB1c2goJy14b2JqZWN0aXZlLWMnKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmNsYW5nRGVmYXVsdE9iakNGbGFncy5zcGxpdCgvXFxzKy8pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ09iamVjdGl2ZS1DKysnOlxuICAgICAgICAgICAgYXJncy5wdXNoKCcteG9iamVjdGl2ZS1jKysnKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmNsYW5nRGVmYXVsdE9iakNwcEZsYWdzLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnQyc6XG4gICAgICAgICAgICBhcmdzLnB1c2goJy14YycpO1xuICAgICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuY2xhbmdEZWZhdWx0Q0ZsYWdzLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjYXNlICdDKysnOlxuICAgICAgICAgIGNhc2UgJ0MrKzE0JzpcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnLXhjKysnKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmNsYW5nRGVmYXVsdENwcEZsYWdzLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZUV4dCA9PT0gJy5ocHAnIHx8IGZpbGVFeHQgPT09ICcuaGgnIHx8IGZpbGVFeHQgPT09ICcuaCcpIHtcbiAgICAgICAgICAvLyBEb24ndCB3YXJuIGFib3V0ICNwcmFnbWEgb25jZSB3aGVuIGxpbnRpbmcgaGVhZGVyIGZpbGVzXG4gICAgICAgICAgYXJncy5wdXNoKCctV25vLXByYWdtYS1vbmNlLW91dHNpZGUtaGVhZGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGFuZ1N1cHByZXNzV2FybmluZ3MpIHtcbiAgICAgICAgICBhcmdzLnB1c2goJy13Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgICAgIGFyZ3MucHVzaCgnLS12ZXJib3NlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsYW5nSW5jbHVkZVBhdGhzLmZvckVhY2gocGF0aCA9PlxuICAgICAgICAgIGFyZ3MucHVzaChgLUkke3BhdGh9YCksXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IHVzaW5nQ2xhbmdDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZsYWdzID0gY2xhbmdGbGFncy5nZXRDbGFuZ0ZsYWdzKGZpbGVQYXRoKTtcbiAgICAgICAgICBmbGFncy5mb3JFYWNoKChmbGFnKSA9PiB7XG4gICAgICAgICAgICBhcmdzLnB1c2goZmxhZyk7XG4gICAgICAgICAgICB1c2luZ0NsYW5nQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgd29ya2luZ0RpciA9IC8td29ya2luZy1kaXJlY3Rvcnk9KC4rKS8uZXhlYyhmbGFnKTtcbiAgICAgICAgICAgIGlmICh3b3JraW5nRGlyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGJhc2VQYXRoID0gd29ya2luZ0RpclsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSAmJiB1c2luZ0NsYW5nQ29tcGxldGUpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgdXNlciBoYXMgYSAuY2xhbmctY29tcGxldGUgZmlsZSB3ZSBjYW4ndCBsaW50IGN1cnJlbnRcbiAgICAgICAgICAvLyBUZXh0RWRpdG9yIGNvbnRlbnRzLCByZXR1cm4gbnVsbCBzbyBub3RoaW5nIGdldHMgbW9kaWZpZWRcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4ZWNPcHRzID0ge1xuICAgICAgICAgIHN0cmVhbTogJ3N0ZGVycicsXG4gICAgICAgICAgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodXNpbmdDbGFuZ0NvbXBsZXRlKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGZpbGVQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2goJy0nKTtcbiAgICAgICAgICBleGVjT3B0cy5zdGRpbiA9IGZpbGVUZXh0O1xuICAgICAgICAgIGV4ZWNPcHRzLmN3ZCA9IGZpbGVEaXI7XG4gICAgICAgICAgYmFzZVBhdGggPSBmaWxlRGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKHRoaXMuZXhlY3V0YWJsZVBhdGgsIGFyZ3MsIGV4ZWNPcHRzKTtcblxuICAgICAgICBpZiAoZWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAvLyBFZGl0b3IgY29udGVudHMgaGF2ZSBjaGFuZ2VkLCB0ZWxsIExpbnRlciBub3QgdG8gdXBkYXRlIHJlc3VsdHNcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gW107XG5cbiAgICAgICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBpc0N1cnJlbnRGaWxlID0gbWF0Y2hbMV0gPT09ICc8c3RkaW4+JztcbiAgICAgICAgICAvLyBJZiB0aGUgXCJmaWxlXCIgaXMgc3RkaW4sIG92ZXJyaWRlIHRvIHRoZSBjdXJyZW50IGVkaXRvcidzIHBhdGhcbiAgICAgICAgICBsZXQgZmlsZTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50RmlsZSkge1xuICAgICAgICAgICAgZmlsZSA9IGZpbGVQYXRoO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNBYnNvbHV0ZShtYXRjaFsxXSkpIHtcbiAgICAgICAgICAgIGZpbGUgPSBtYXRjaFsxXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZSA9IHJlc29sdmUoYmFzZVBhdGgsIG1hdGNoWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHBvc2l0aW9uO1xuICAgICAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICAgICAgLy8gQ2xhbmcgZ2F2ZSB1cyBhIHJhbmdlLCB1c2UgdGhhdFxuICAgICAgICAgICAgcG9zaXRpb24gPSBwYXJzZUNsYW5nUmFuZ2VzKG1hdGNoWzRdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSByYW5nZSBiYXNlZCBvbiB0aGUgc2luZ2xlIHBvaW50XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzJdLCAxMCkgLSAxO1xuICAgICAgICAgICAgY29uc3QgY29sID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxO1xuICAgICAgICAgICAgaWYgKCFpc0N1cnJlbnRGaWxlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVFZGl0b3IgPSBmaW5kVGV4dEVkaXRvcihmaWxlKTtcbiAgICAgICAgICAgICAgaWYgKGZpbGVFZGl0b3IgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLy8gRm91bmQgYW4gb3BlbiBlZGl0b3IgZm9yIHRoZSBmaWxlXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UoZmlsZUVkaXRvciwgbGluZSwgY29sKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG9uZSBjaGFyYWN0ZXIgcmFuZ2UgaW4gdGhlIGZpbGVcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IFtbbGluZSwgY29sXSwgW2xpbmUsIGNvbCArIDFdXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcG9zaXRpb24gPSBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UoZWRpdG9yLCBsaW5lLCBjb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBzZXZlcml0eSA9IC9lcnJvci8udGVzdChtYXRjaFs1XSkgPyAnZXJyb3InIDogJ3dhcm5pbmcnO1xuICAgICAgICAgIGxldCBleGNlcnB0O1xuICAgICAgICAgIGlmIChtYXRjaFs3XSkge1xuICAgICAgICAgICAgLy8gVGhlcmUgaXMgYSAtV2ZsYWcgc3BlY2lmaWVkLCBmb3Igbm93IGp1c3QgcmUtaW5zZXJ0IHRoYXQgaW50byB0aGUgZXhjZXJwdFxuICAgICAgICAgICAgZXhjZXJwdCA9IGAke21hdGNoWzZdfSBbJHttYXRjaFs3XX1dYDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhjZXJwdCA9IG1hdGNoWzZdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgc2V2ZXJpdHksXG4gICAgICAgICAgICBsb2NhdGlvbjogeyBmaWxlLCBwb3NpdGlvbiB9LFxuICAgICAgICAgICAgZXhjZXJwdCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChtYXRjaFs4XSkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIHN1Z2dlc3RlZCBmaXggYXZhaWxhYmxlXG4gICAgICAgICAgICBjb25zdCBmaXhMaW5lU3RhcnQgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbOF0sIDEwKSAtIDE7XG4gICAgICAgICAgICBjb25zdCBmaXhDb2xTdGFydCA9IE51bWJlci5wYXJzZUludChtYXRjaFs5XSwgMTApIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IGZpeExpbmVFbmQgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMTBdLCAxMCkgLSAxO1xuICAgICAgICAgICAgY29uc3QgZml4Q29sRW5kID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzExXSwgMTApIC0gMTtcbiAgICAgICAgICAgIG1lc3NhZ2Uuc29sdXRpb25zID0gW3tcbiAgICAgICAgICAgICAgcG9zaXRpb246IFtbZml4TGluZVN0YXJ0LCBmaXhDb2xTdGFydF0sIFtmaXhMaW5lRW5kLCBmaXhDb2xFbmRdXSxcbiAgICAgICAgICAgICAgcmVwbGFjZVdpdGg6IG1hdGNoWzEyXSxcbiAgICAgICAgICAgIH1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b1JldHVybi5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==
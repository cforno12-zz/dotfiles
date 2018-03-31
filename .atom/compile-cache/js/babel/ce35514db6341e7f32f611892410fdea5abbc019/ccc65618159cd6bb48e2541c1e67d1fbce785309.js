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
        atom.config.set('linter-clang.executablePath', oldPath);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvbGludGVyLWNsYW5nL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUNZLE1BQU07O0FBSjVELFdBQVcsQ0FBQzs7QUFNWixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV0QixJQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUN2QixnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLHVCQUF1QjtBQUN2QixtQkFBbUI7QUFDbkIseUJBQXlCO0FBQ3pCLGdDQUFnQztBQUNoQyxRQUFRO0FBQ1IsS0FBSyxDQUNOO0FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7Ozs7O0FBT2xCLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksTUFBTSxFQUFLO0FBQ25DLE1BQU0sT0FBTyxHQUFHLDRCQUE0QixDQUFDO0FBQzdDLE1BQUksU0FBUyxZQUFBLENBQUM7QUFDZCxNQUFJLFFBQVEsWUFBQSxDQUFDO0FBQ2IsTUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLE1BQUksTUFBTSxZQUFBLENBQUM7O0FBRVgsTUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxTQUFPLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDckIsUUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FB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LENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEQsZ0JBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RCxnQkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELG1CQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7QUFDbkIsc0JBQVEsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLHlCQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUM7V0FDSjtBQUNELGtCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZCLGVBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCOztBQUVELGVBQU8sUUFBUSxDQUFDO09BQ2pCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jbGFuZy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSwgaXNBYnNvbHV0ZSB9IGZyb20gJ3BhdGgnO1xuXG5sZXQgaGVscGVycyA9IG51bGw7XG5sZXQgY2xhbmdGbGFncyA9IG51bGw7XG5cbmNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gICdeKDxzdGRpbj58LispOicsIC8vIFBhdGgsIHVzdWFsbHkgPHN0ZGluPlxuICAnKFxcXFxkKyk6KFxcXFxkKyk6JywgLy8gQmFzZSBsaW5lIGFuZCBjb2x1bW5cbiAgJyg/Oih7Lit9KTopPycsIC8vIFJhbmdlIHBvc2l0aW9uKHMpLCBpZiBwcmVzZW50XG4gICcgKFtcXFxcdyBcXFxcXFxcXC1dKyk6JywgLy8gTWVzc2FnZSB0eXBlXG4gICcgKFteW1xcXFxuXFxcXHJdKyknLCAvLyBUaGUgbWVzc2FnZVxuICAnKD86IFxcXFxbKC4rKVxcXFxdKT9cXFxccj8kJywgLy8gLVcgZmxhZywgaWYgYW55XG4gICcoPzpcXFxccj9cXFxcbl4gLiskKSsnLCAvLyBUaGUgdmlzdWFsIGNhcmV0IGRpYWdub3N0aWNzLCBuZWNlc3NhcnkgdG8gaW5jbHVkZSBpbiBvdXRwdXQgZm9yIGZpeC1pdHNcbiAgJyg/OlxcXFxyP1xcXFxuXmZpeC1pdDpcIi4rXCI6JywgLy8gU3RhcnQgb2YgZml4LWl0IGJsb2NrXG4gICd7KFxcXFxkKyk6KFxcXFxkKyktKFxcXFxkKyk6KFxcXFxkKyl9OicsIC8vIGZpeC1pdCByYW5nZVxuICAnXCIoLispXCInLCAvLyBmaXgtaXQgcmVwbGFjZW1lbnQgdGV4dFxuICAnJCk/JywgLy8gRW5kIG9mIGZpeC1pdCBibG9ja1xuXS5qb2luKCcnKSwgJ2dtJyk7XG5cbi8qKlxuICogR2l2ZW4gYSBzZXQgb2YgcmFuZ2VzIGluIGNsYW5ncyBmb3JtYXQsIGRldGVybWluZSB0aGUgcmFuZ2UgZW5jb21wYXNpbmcgYWxsIHBvaW50c1xuICogQHBhcmFtICB7U3RyaW5nfSByYW5nZXMgVGhlIHJhdyByYW5nZSBzdHJpbmcgdG8gcGFyc2VcbiAqIEByZXR1cm4ge1JhbmdlfSAgICAgICAgQW4gQXRvbSBSYW5nZSBvYmplY3QgZW5jb21wYXNpbmcgYWxsIGdpdmVuIHJhbmdlc1xuICovXG5jb25zdCBwYXJzZUNsYW5nUmFuZ2VzID0gKHJhbmdlcykgPT4ge1xuICBjb25zdCByYW5nZVJFID0gL3soXFxkKyk6KFxcZCspLShcXGQrKTooXFxkKyl9L2c7XG4gIGxldCBsaW5lU3RhcnQ7XG4gIGxldCBjb2xTdGFydDtcbiAgbGV0IGxpbmVFbmQ7XG4gIGxldCBjb2xFbmQ7XG5cbiAgbGV0IG1hdGNoID0gcmFuZ2VSRS5leGVjKHJhbmdlcyk7XG4gIHdoaWxlIChtYXRjaCAhPT0gbnVsbCkge1xuICAgIGNvbnN0IHJhbmdlTGluZVN0YXJ0ID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxO1xuICAgIGNvbnN0IHJhbmdlQ29sU3RhcnQgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgY29uc3QgcmFuZ2VMaW5lRW5kID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxO1xuICAgIGNvbnN0IHJhbmdlQ29sRW5kID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzRdLCAxMCkgLSAxO1xuICAgIGlmIChsaW5lU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRmlyc3QgbWF0Y2hcbiAgICAgIGxpbmVTdGFydCA9IHJhbmdlTGluZVN0YXJ0O1xuICAgICAgY29sU3RhcnQgPSByYW5nZUNvbFN0YXJ0O1xuICAgICAgbGluZUVuZCA9IHJhbmdlTGluZUVuZDtcbiAgICAgIGNvbEVuZCA9IHJhbmdlQ29sRW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmFuZ2VMaW5lU3RhcnQgPiBsaW5lRW5kKSB7XG4gICAgICAgIC8vIEhpZ2hlciBzdGFydGluZyBsaW5lXG4gICAgICAgIGxpbmVFbmQgPSByYW5nZUxpbmVTdGFydDtcbiAgICAgICAgY29sRW5kID0gcmFuZ2VDb2xTdGFydDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZUxpbmVFbmQgPiBsaW5lRW5kKSB7XG4gICAgICAgIC8vIEhpZ2hlciBlbmRpbmcgbGluZVxuICAgICAgICBsaW5lRW5kID0gcmFuZ2VMaW5lRW5kO1xuICAgICAgICBjb2xFbmQgPSByYW5nZUNvbEVuZDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZUNvbEVuZCA+IGNvbEVuZCkge1xuICAgICAgICAvLyBIaWdoZXIgZW5kaW5nIGNvbHVtblxuICAgICAgICBjb2xFbmQgPSByYW5nZUNvbEVuZDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWF0Y2ggPSByYW5nZVJFLmV4ZWMocmFuZ2VzKTtcbiAgfVxuICByZXR1cm4gW1tsaW5lU3RhcnQsIGNvbFN0YXJ0XSwgW2xpbmVFbmQsIGNvbEVuZF1dO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBnaXZlbiBwYXRoIGlzIG9wZW4gaW4gYW4gZXhpc3RpbmcgVGV4dEVkaXRvclxuICogQHBhcmFtICB7U3RyaW5nfSBmaWxlUGF0aCBUaGUgZmlsZSBwYXRoIHRvIHNlYXJjaCBmb3IgYW4gZWRpdG9yIG9mXG4gKiBAcmV0dXJuIHtUZXh0RWRpdG9yIHwgZmFsc2V9ICAgICAgVGhlIFRleHRFZGl0b3Igb3IgZmFsc2UgaWYgbm9uZSBmb3VuZFxuICovXG5jb25zdCBmaW5kVGV4dEVkaXRvciA9IChmaWxlUGF0aCkgPT4ge1xuICBjb25zdCBhbGxFZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKTtcbiAgY29uc3QgbWF0Y2hpbmdFZGl0b3IgPSBhbGxFZGl0b3JzLmZpbmQoXG4gICAgdGV4dEVkaXRvciA9PiB0ZXh0RWRpdG9yLmdldFBhdGgoKSA9PT0gZmlsZVBhdGgpO1xuICByZXR1cm4gbWF0Y2hpbmdFZGl0b3IgfHwgZmFsc2U7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWNsYW5nJyk7XG5cbiAgICAvLyBGSVhNRTogUmVtb3ZlIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGluIGEgZnV0dXJlIG1pbm9yIHZlcnNpb25cbiAgICBjb25zdCBvbGRQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItY2xhbmcuZXhlY1BhdGgnKTtcbiAgICBpZiAob2xkUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdG9tLmNvbmZpZy51bnNldCgnbGludGVyLWNsYW5nLmV4ZWNQYXRoJyk7XG4gICAgICBpZiAob2xkUGF0aCAhPT0gJ2NsYW5nJykge1xuICAgICAgICAvLyBJZiB0aGUgb2xkIGNvbmZpZyB3YXNuJ3Qgc2V0IHRvIHRoZSBkZWZhdWx0IG1pZ3JhdGUgaXQgb3ZlclxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1jbGFuZy5leGVjdXRhYmxlUGF0aCcsIG9sZFBhdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY2xhbmcuY2xhbmdJbmNsdWRlUGF0aHMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jbGFuZ0luY2x1ZGVQYXRocyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWNsYW5nLmNsYW5nU3VwcHJlc3NXYXJuaW5ncycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNsYW5nU3VwcHJlc3NXYXJuaW5ncyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWNsYW5nLmNsYW5nRGVmYXVsdENGbGFncycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNsYW5nRGVmYXVsdENGbGFncyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWNsYW5nLmNsYW5nRGVmYXVsdENwcEZsYWdzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY2xhbmdEZWZhdWx0Q3BwRmxhZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRPYmpDRmxhZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jbGFuZ0RlZmF1bHRPYmpDRmxhZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRPYmpDcHBGbGFncycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNsYW5nRGVmYXVsdE9iakNwcEZsYWdzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY2xhbmcuY2xhbmdFcnJvckxpbWl0JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY2xhbmdFcnJvckxpbWl0ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnY2xhbmcnLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5jJywgJ3NvdXJjZS5jcHAnLCAnc291cmNlLm9iamMnLCAnc291cmNlLm9iamNwcCddLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBpZiAoaGVscGVycyA9PT0gbnVsbCkge1xuICAgICAgICAgIGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFuZ0ZsYWdzID09PSBudWxsKSB7XG4gICAgICAgICAgY2xhbmdGbGFncyA9IHJlcXVpcmUoJ2NsYW5nLWZsYWdzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZVBhdGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gVGhlIGVkaXRvciBoYXMgbm8gcGF0aCwgbWVhbmluZyBpdCBoYXNuJ3QgYmVlbiBzYXZlZC4gQWx0aG91Z2hcbiAgICAgICAgICAvLyBjbGFuZyBjb3VsZCBnaXZlIHVzIHJlc3VsdHMgZm9yIHRoaXMsIExpbnRlciBuZWVkcyBhIHBhdGhcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZUV4dCA9IGV4dG5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBmaWxlRGlyID0gZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgbGV0IGJhc2VQYXRoO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAgICAgJy1mc3ludGF4LW9ubHknLFxuICAgICAgICAgICctZm5vLWNvbG9yLWRpYWdub3N0aWNzJyxcbiAgICAgICAgICAnLWZkaWFnbm9zdGljcy1wYXJzZWFibGUtZml4aXRzJyxcbiAgICAgICAgICAnLWZkaWFnbm9zdGljcy1wcmludC1zb3VyY2UtcmFuZ2UtaW5mbycsXG4gICAgICAgICAgJy1mZXhjZXB0aW9ucycsXG4gICAgICAgICAgYC1mZXJyb3ItbGltaXQ9JHt0aGlzLmNsYW5nRXJyb3JMaW1pdH1gLFxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIE5vbi1QdWJsaWMgQVBJIVxuICAgICAgICBjb25zdCBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lO1xuXG4gICAgICAgIHN3aXRjaCAoZ3JhbW1hcikge1xuICAgICAgICAgIGNhc2UgJ09iamVjdGl2ZS1DJzpcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnLXhvYmplY3RpdmUtYycpO1xuICAgICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuY2xhbmdEZWZhdWx0T2JqQ0ZsYWdzLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnT2JqZWN0aXZlLUMrKyc6XG4gICAgICAgICAgICBhcmdzLnB1c2goJy14b2JqZWN0aXZlLWMrKycpO1xuICAgICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuY2xhbmdEZWZhdWx0T2JqQ3BwRmxhZ3Muc3BsaXQoL1xccysvKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICAgIGFyZ3MucHVzaCgnLXhjJyk7XG4gICAgICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5jbGFuZ0RlZmF1bHRDRmxhZ3Muc3BsaXQoL1xccysvKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNhc2UgJ0MrKyc6XG4gICAgICAgICAgY2FzZSAnQysrMTQnOlxuICAgICAgICAgICAgYXJncy5wdXNoKCcteGMrKycpO1xuICAgICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuY2xhbmdEZWZhdWx0Q3BwRmxhZ3Muc3BsaXQoL1xccysvKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlRXh0ID09PSAnLmhwcCcgfHwgZmlsZUV4dCA9PT0gJy5oaCcgfHwgZmlsZUV4dCA9PT0gJy5oJykge1xuICAgICAgICAgIC8vIERvbid0IHdhcm4gYWJvdXQgI3ByYWdtYSBvbmNlIHdoZW4gbGludGluZyBoZWFkZXIgZmlsZXNcbiAgICAgICAgICBhcmdzLnB1c2goJy1Xbm8tcHJhZ21hLW9uY2Utb3V0c2lkZS1oZWFkZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNsYW5nU3VwcHJlc3NXYXJuaW5ncykge1xuICAgICAgICAgIGFyZ3MucHVzaCgnLXcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKCctLXZlcmJvc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xhbmdJbmNsdWRlUGF0aHMuZm9yRWFjaChwYXRoID0+XG4gICAgICAgICAgYXJncy5wdXNoKGAtSSR7cGF0aH1gKSxcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgdXNpbmdDbGFuZ0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZmxhZ3MgPSBjbGFuZ0ZsYWdzLmdldENsYW5nRmxhZ3MoZmlsZVBhdGgpO1xuICAgICAgICAgIGZsYWdzLmZvckVhY2goKGZsYWcpID0+IHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChmbGFnKTtcbiAgICAgICAgICAgIHVzaW5nQ2xhbmdDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCB3b3JraW5nRGlyID0gLy13b3JraW5nLWRpcmVjdG9yeT0oLispLy5leGVjKGZsYWcpO1xuICAgICAgICAgICAgaWYgKHdvcmtpbmdEaXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgYmFzZVBhdGggPSB3b3JraW5nRGlyWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpICYmIHVzaW5nQ2xhbmdDb21wbGV0ZSkge1xuICAgICAgICAgIC8vIElmIHRoZSB1c2VyIGhhcyBhIC5jbGFuZy1jb21wbGV0ZSBmaWxlIHdlIGNhbid0IGxpbnQgY3VycmVudFxuICAgICAgICAgIC8vIFRleHRFZGl0b3IgY29udGVudHMsIHJldHVybiBudWxsIHNvIG5vdGhpbmcgZ2V0cyBtb2RpZmllZFxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhlY09wdHMgPSB7XG4gICAgICAgICAgc3RyZWFtOiAnc3RkZXJyJyxcbiAgICAgICAgICBhbGxvd0VtcHR5U3RkZXJyOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh1c2luZ0NsYW5nQ29tcGxldGUpIHtcbiAgICAgICAgICBhcmdzLnB1c2goZmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCgnLScpO1xuICAgICAgICAgIGV4ZWNPcHRzLnN0ZGluID0gZmlsZVRleHQ7XG4gICAgICAgICAgZXhlY09wdHMuY3dkID0gZmlsZURpcjtcbiAgICAgICAgICBiYXNlUGF0aCA9IGZpbGVEaXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBoZWxwZXJzLmV4ZWModGhpcy5leGVjdXRhYmxlUGF0aCwgYXJncywgZXhlY09wdHMpO1xuXG4gICAgICAgIGlmIChlZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlVGV4dCkge1xuICAgICAgICAgIC8vIEVkaXRvciBjb250ZW50cyBoYXZlIGNoYW5nZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGUgcmVzdWx0c1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBbXTtcblxuICAgICAgICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgICAgIHdoaWxlIChtYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGlzQ3VycmVudEZpbGUgPSBtYXRjaFsxXSA9PT0gJzxzdGRpbj4nO1xuICAgICAgICAgIC8vIElmIHRoZSBcImZpbGVcIiBpcyBzdGRpbiwgb3ZlcnJpZGUgdG8gdGhlIGN1cnJlbnQgZWRpdG9yJ3MgcGF0aFxuICAgICAgICAgIGxldCBmaWxlO1xuICAgICAgICAgIGlmIChpc0N1cnJlbnRGaWxlKSB7XG4gICAgICAgICAgICBmaWxlID0gZmlsZVBhdGg7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc0Fic29sdXRlKG1hdGNoWzFdKSkge1xuICAgICAgICAgICAgZmlsZSA9IG1hdGNoWzFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWxlID0gcmVzb2x2ZShiYXNlUGF0aCwgbWF0Y2hbMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgcG9zaXRpb247XG4gICAgICAgICAgaWYgKG1hdGNoWzRdKSB7XG4gICAgICAgICAgICAvLyBDbGFuZyBnYXZlIHVzIGEgcmFuZ2UsIHVzZSB0aGF0XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHBhcnNlQ2xhbmdSYW5nZXMobWF0Y2hbNF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIHJhbmdlIGJhc2VkIG9uIHRoZSBzaW5nbGUgcG9pbnRcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDE7XG4gICAgICAgICAgICBpZiAoIWlzQ3VycmVudEZpbGUpIHtcbiAgICAgICAgICAgICAgY29uc3QgZmlsZUVkaXRvciA9IGZpbmRUZXh0RWRpdG9yKGZpbGUpO1xuICAgICAgICAgICAgICBpZiAoZmlsZUVkaXRvciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBGb3VuZCBhbiBvcGVuIGVkaXRvciBmb3IgdGhlIGZpbGVcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZShmaWxlRWRpdG9yLCBsaW5lLCBjb2wpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgb25lIGNoYXJhY3RlciByYW5nZSBpbiB0aGUgZmlsZVxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gW1tsaW5lLCBjb2xdLCBbbGluZSwgY29sICsgMV1dO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3NpdGlvbiA9IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZShlZGl0b3IsIGxpbmUsIGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHNldmVyaXR5ID0gL2Vycm9yLy50ZXN0KG1hdGNoWzVdKSA/ICdlcnJvcicgOiAnd2FybmluZyc7XG4gICAgICAgICAgbGV0IGV4Y2VycHQ7XG4gICAgICAgICAgaWYgKG1hdGNoWzddKSB7XG4gICAgICAgICAgICAvLyBUaGVyZSBpcyBhIC1XZmxhZyBzcGVjaWZpZWQsIGZvciBub3cganVzdCByZS1pbnNlcnQgdGhhdCBpbnRvIHRoZSBleGNlcnB0XG4gICAgICAgICAgICBleGNlcnB0ID0gYCR7bWF0Y2hbNl19IFske21hdGNoWzddfV1gO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleGNlcnB0ID0gbWF0Y2hbNl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBzZXZlcml0eSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7IGZpbGUsIHBvc2l0aW9uIH0sXG4gICAgICAgICAgICBleGNlcnB0LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKG1hdGNoWzhdKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3VnZ2VzdGVkIGZpeCBhdmFpbGFibGVcbiAgICAgICAgICAgIGNvbnN0IGZpeExpbmVTdGFydCA9IE51bWJlci5wYXJzZUludChtYXRjaFs4XSwgMTApIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IGZpeENvbFN0YXJ0ID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzldLCAxMCkgLSAxO1xuICAgICAgICAgICAgY29uc3QgZml4TGluZUVuZCA9IE51bWJlci5wYXJzZUludChtYXRjaFsxMF0sIDEwKSAtIDE7XG4gICAgICAgICAgICBjb25zdCBmaXhDb2xFbmQgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMTFdLCAxMCkgLSAxO1xuICAgICAgICAgICAgbWVzc2FnZS5zb2x1dGlvbnMgPSBbe1xuICAgICAgICAgICAgICBwb3NpdGlvbjogW1tmaXhMaW5lU3RhcnQsIGZpeENvbFN0YXJ0XSwgW2ZpeExpbmVFbmQsIGZpeENvbEVuZF1dLFxuICAgICAgICAgICAgICByZXBsYWNlV2l0aDogbWF0Y2hbMTJdLFxuICAgICAgICAgICAgfV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmV0dXJuLnB1c2gobWVzc2FnZSk7XG4gICAgICAgICAgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19
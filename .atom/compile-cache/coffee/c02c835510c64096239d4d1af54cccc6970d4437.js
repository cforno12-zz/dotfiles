(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, _, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, openSettings, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml;

  pkg = require('../package');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getScrollTop = function(editor) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.getScrollTop() : void 0;
  };

  setScrollTop = function(editor, value) {
    var ref, view;
    view = atom.views.getView(editor);
    return view != null ? (ref = view.component) != null ? ref.setScrollTop(value) : void 0 : void 0;
  };

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, j, len, posArray;
    cursors = editor.getCursors();
    posArray = [];
    for (j = 0, len = cursors.length; j < len; j++) {
      cursor = cursors[j];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, j, len;
    for (i = j = 0, len = posArray.length; j < len; i = ++j) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (atom.config.get("atom-beautify.general.showLoadingView")) {
      if (LoadingView == null) {
        LoadingView = require("./views/loading-view");
      }
      if (loadingView == null) {
        loadingView = new LoadingView();
      }
      return loadingView.show();
    }
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, ref, stack;
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (ref = atom.notifications) != null ? ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(arg) {
    var editor, language, onSave;
    editor = arg.editor, onSave = arg.onSave, language = arg.language;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {

        } else if (text instanceof Error) {
          showError(text);
          return reject(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.getBuffer().setTextViaDiff(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return reject(error);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
      }
      isSelection = !!editor.getSelectedText();
      editedFilePath = editor.getPath();
      allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
      text = void 0;
      if (!forceEntireFile && isSelection) {
        text = editor.getSelectedText();
      } else {
        text = editor.getText();
      }
      oldText = text;
      grammarName = editor.getGrammar().name;
      try {
        beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
          onSave: onSave,
          language: language
        }).then(beautifyCompleted)["catch"](beautifyCompleted);
      } catch (error1) {
        e = error1;
        showError(e);
      }
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (error1) {
        e = error1;
        return cb(e);
      }
    });
  };

  beautifyFile = function(arg) {
    var filePath, target;
    target = arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(arg) {
    var $el, dirPath, target;
    target = arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, grammarName, headers, language, linkifyTitle, open, ref, ref1, selectedBeautifier, stack, text, tocEl;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      plugin.checkUnsupportedOptions();
      editor = atom.workspace.getActiveTextEditor();
      linkifyTitle = function(title) {
        var p, sep;
        title = title.toLowerCase();
        p = title.split(/[\s,+#;,\/?:@&=+$]+/);
        sep = "-";
        return p.join(sep);
      };
      if (editor == null) {
        return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
      }
      if (!confirm('Are you ready to debug Atom Beautify?')) {
        return;
      }
      debugInfo = "";
      headers = [];
      tocEl = "<TABLEOFCONTENTS/>";
      addInfo = function(key, val) {
        if (key != null) {
          return debugInfo += "**" + key + "**: " + val + "\n\n";
        } else {
          return debugInfo += val + "\n\n";
        }
      };
      addHeader = function(level, title) {
        debugInfo += (Array(level + 1).join('#')) + " " + title + "\n\n";
        return headers.push({
          level: level,
          title: title
        });
      };
      addHeader(1, "Atom Beautify - Debugging information");
      debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
      addInfo('Platform', process.platform);
      addHeader(2, "Versions");
      addInfo('Atom Version', atom.appVersion);
      addInfo('Atom Beautify Version', pkg.version);
      addHeader(2, "Original file to be beautified");
      filePath = editor.getPath();
      addInfo('Original File Path', "`" + filePath + "`");
      grammarName = editor.getGrammar().name;
      addInfo('Original File Grammar', grammarName);
      language = beautifier.getLanguage(grammarName, filePath);
      addInfo('Original File Language', language != null ? language.name : void 0);
      addInfo('Language namespace', language != null ? language.namespace : void 0);
      beautifiers = beautifier.getBeautifiers(language.name);
      addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
      selectedBeautifier = beautifier.getBeautifierForLanguage(language);
      addInfo('Selected Beautifier', selectedBeautifier.name);
      text = editor.getText() || "";
      codeBlockSyntax = ((ref = language != null ? language.name : void 0) != null ? ref : grammarName).toLowerCase().split(' ')[0];
      addHeader(3, 'Original File Contents');
      addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
      addHeader(3, 'Package Settings');
      addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      addHeader(2, "Beautification options");
      allOptions = beautifier.getOptionsForPath(filePath, editor);
      return Promise.all(allOptions).then(function(allOptions) {
        var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
        editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
        projectOptions = allOptions.slice(4);
        preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
        if (selectedBeautifier) {
          finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
        }
        addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
        addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
        addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
        addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
        addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
        addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
        if (selectedBeautifier) {
          addHeader(3, 'Final Options');
          addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
        }
        logs = "";
        logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
        subscription = logger.onLogging(function(msg) {
          var sep;
          sep = path.sep;
          return logs += msg.replace(logFilePathRegex, function(a, b) {
            var i, p, s;
            s = b.split(sep);
            i = s.indexOf('atom-beautify');
            p = s.slice(i + 2).join(sep);
            return ': [' + p + ']';
          });
        });
        cb = function(result) {
          var JsDiff, bullet, diff, header, indent, indentNum, j, len, toc;
          subscription.dispose();
          addHeader(2, "Results");
          addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
          JsDiff = require('diff');
          if (typeof result === "string") {
            diff = JsDiff.createPatch(filePath || "", text || "", result || "", "original", "beautified");
            addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
          }
          addHeader(3, "Logs");
          addInfo(null, "```\n" + logs + "\n```");
          toc = "## Table Of Contents\n";
          for (j = 0, len = headers.length; j < len; j++) {
            header = headers[j];

            /*
            - Heading 1
              - Heading 1.1
             */
            indent = "  ";
            bullet = "-";
            indentNum = header.level - 2;
            if (indentNum >= 0) {
              toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
            }
          }
          debugInfo = debugInfo.replace(tocEl, toc);
          return atom.workspace.open().then(function(editor) {
            editor.setText(debugInfo);
            return confirm("Please login to GitHub and create a Gist named \"debug.md\" (Markdown file) with your debugging information.\nThen add a link to your Gist in your GitHub Issue.\nThank you!\n\nGist: https://gist.github.com/\nGitHub Issues: https://github.com/Glavin001/atom-beautify/issues");
          })["catch"](function(error) {
            return confirm("An error occurred when creating the Gist: " + error.message);
          });
        };
        try {
          return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
        } catch (error1) {
          e = error1;
          return cb(e);
        }
      })["catch"](function(error) {
        var detail, ref1, stack;
        stack = error.stack;
        detail = error.description || error.message;
        return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
          stack: stack,
          detail: detail,
          dismissable: true
        }) : void 0 : void 0;
      });
    } catch (error1) {
      error = error1;
      stack = error.stack;
      detail = error.description || error.message;
      return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0 : void 0;
    }
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var beautifyOnSaveHandler, disposable, pendingPaths;
      pendingPaths = {};
      beautifyOnSaveHandler = function(arg) {
        var beautifyOnSave, buffer, fileExtension, filePath, grammar, key, language, languages;
        filePath = arg.path;
        logger.verbose('Should beautify on this save?');
        if (pendingPaths[filePath]) {
          logger.verbose("Editor with file path " + filePath + " already beautified!");
          return;
        }
        buffer = editor.getBuffer();
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            logger.verbose('Done beautifying file', filePath);
            if (editor.isAlive() === true) {
              logger.verbose('Saving TextEditor...');
              pendingPaths[filePath] = true;
              return Promise.resolve(editor.save()).then(function() {
                delete pendingPaths[filePath];
                return logger.verbose('Saved TextEditor.');
              });
            }
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.onDidSave(function(arg) {
        var filePath;
        filePath = arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  openSettings = function() {
    return atom.workspace.open('atom://config/packages/atom-beautify');
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You can open the Atom command palette with `cmd-shift-p` (OSX) or `ctrl-shift-p` (Linux/Windows) in Atom. You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(arg) {
        var key, newKey, val;
        key = arg[0], newKey = arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.addLanguageCommands = function() {
    var j, language, languages, len, results;
    languages = beautifier.languages.languages;
    logger.verbose("languages", languages);
    results = [];
    for (j = 0, len = languages.length; j < len; j++) {
      language = languages[j];
      results.push(((function(_this) {
        return function(language) {
          return _this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-language-" + (language.name.toLowerCase()), function() {
            logger.verbose("Beautifying language", language);
            return beautify({
              language: language
            });
          }));
        };
      })(this))(language));
    }
    return results;
  };

  plugin.config = _.merge(require('./config'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:open-settings", openSettings));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
    return this.addLanguageCommands();
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUE7O0VBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSOztFQUdOLE1BQUEsR0FBUyxNQUFNLENBQUM7O0VBQ2Ysc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN4QixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSOztFQUNkLFVBQUEsR0FBaUIsSUFBQSxXQUFBLENBQUE7O0VBQ2pCLHNCQUFBLEdBQXlCLFVBQVUsQ0FBQzs7RUFDcEMsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQUEsQ0FBb0IsVUFBcEI7O0VBQ1QsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUdWLEVBQUEsR0FBSzs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsS0FBQSxHQUFROztFQUNSLElBQUEsR0FBTzs7RUFDUCxLQUFBLEdBQVE7O0VBQ1IsR0FBQSxHQUFNOztFQUNOLFdBQUEsR0FBYzs7RUFDZCxXQUFBLEdBQWM7O0VBQ2QsQ0FBQSxHQUFJOztFQU1KLFlBQUEsR0FBZSxTQUFDLE1BQUQ7QUFDYixRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjswQkFDUCxJQUFJLENBQUUsWUFBTixDQUFBO0VBRmE7O0VBR2YsWUFBQSxHQUFlLFNBQUMsTUFBRCxFQUFTLEtBQVQ7QUFDYixRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjs4REFDUSxDQUFFLFlBQWpCLENBQThCLEtBQTlCO0VBRmE7O0VBSWYsVUFBQSxHQUFhLFNBQUMsTUFBRDtBQUNY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QyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsK0JBQXBDLEVBQXFFLFFBQXJFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUNBQXBDLEVBQXVFLEtBQXZFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNkJBQXBDLEVBQW1FLFlBQW5FLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQix3QkFBbEIsRUFBNEMsNkJBQTVDLEVBQTJFLFlBQTNFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw2QkFBbEIsRUFBaUQsa0NBQWpELEVBQXFGLGlCQUFyRixDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdDQUFwQyxFQUFzRSxNQUFNLENBQUMsZUFBN0UsQ0FBbkI7V0FDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtFQVRnQjs7RUFXbEIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsU0FBQTtXQUNsQixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtFQURrQjtBQXhuQnBCIiwic291cmNlc0NvbnRlbnQiOlsiIyBnbG9iYWwgYXRvbVxuXCJ1c2Ugc3RyaWN0XCJcbnBrZyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UnKVxuXG4jIERlcGVuZGVuY2llc1xucGx1Z2luID0gbW9kdWxlLmV4cG9ydHNcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbl8gPSByZXF1aXJlKFwibG9kYXNoXCIpXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUoXCIuL2JlYXV0aWZpZXJzXCIpXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmRlZmF1bHRMYW5ndWFnZU9wdGlvbnMgPSBiZWF1dGlmaWVyLm9wdGlvbnNcbmxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJykoX19maWxlbmFtZSlcblByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5mcyA9IG51bGxcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuc3RyaXAgPSBudWxsXG55YW1sID0gbnVsbFxuYXN5bmMgPSBudWxsXG5kaXIgPSBudWxsICMgTm9kZS1EaXJcbkxvYWRpbmdWaWV3ID0gbnVsbFxubG9hZGluZ1ZpZXcgPSBudWxsXG4kID0gbnVsbFxuXG4jIGZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhkYXRhLCB0eXBlcykge1xuIyBub3B0LmNsZWFuKGRhdGEsIHR5cGVzKTtcbiMgcmV0dXJuIGRhdGE7XG4jIH1cbmdldFNjcm9sbFRvcCA9IChlZGl0b3IpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5nZXRTY3JvbGxUb3AoKVxuc2V0U2Nyb2xsVG9wID0gKGVkaXRvciwgdmFsdWUpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5jb21wb25lbnQ/LnNldFNjcm9sbFRvcCB2YWx1ZVxuXG5nZXRDdXJzb3JzID0gKGVkaXRvcikgLT5cbiAgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKClcbiAgcG9zQXJyYXkgPSBbXVxuICBmb3IgY3Vyc29yIGluIGN1cnNvcnNcbiAgICBidWZmZXJQb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcG9zQXJyYXkucHVzaCBbXG4gICAgICBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgIF1cbiAgcG9zQXJyYXlcbnNldEN1cnNvcnMgPSAoZWRpdG9yLCBwb3NBcnJheSkgLT5cblxuICAjIGNvbnNvbGUubG9nIFwic2V0Q3Vyc29yczpcbiAgZm9yIGJ1ZmZlclBvc2l0aW9uLCBpIGluIHBvc0FycmF5XG4gICAgaWYgaSBpcyAwXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgICAgIGNvbnRpbnVlXG4gICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gYnVmZmVyUG9zaXRpb25cbiAgcmV0dXJuXG5cbiMgU2hvdyBiZWF1dGlmaWNhdGlvbiBwcm9ncmVzcy9sb2FkaW5nIHZpZXdcbmJlYXV0aWZpZXIub24oJ2JlYXV0aWZ5OjpzdGFydCcsIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5zaG93TG9hZGluZ1ZpZXdcIilcbiAgICBMb2FkaW5nVmlldyA/PSByZXF1aXJlIFwiLi92aWV3cy9sb2FkaW5nLXZpZXdcIlxuICAgIGxvYWRpbmdWaWV3ID89IG5ldyBMb2FkaW5nVmlldygpXG4gICAgbG9hZGluZ1ZpZXcuc2hvdygpXG4pXG5iZWF1dGlmaWVyLm9uKCdiZWF1dGlmeTo6ZW5kJywgLT5cbiAgbG9hZGluZ1ZpZXc/LmhpZGUoKVxuKVxuIyBTaG93IGVycm9yXG5zaG93RXJyb3IgPSAoZXJyb3IpIC0+XG4gIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubXV0ZUFsbEVycm9yc1wiKVxuICAgICMgY29uc29sZS5sb2coZSlcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoZXJyb3IubWVzc2FnZSwge1xuICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlfSlcblxuYmVhdXRpZnkgPSAoeyBlZGl0b3IsIG9uU2F2ZSwgbGFuZ3VhZ2UgfSkgLT5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG5cbiAgICBwbHVnaW4uY2hlY2tVbnN1cHBvcnRlZE9wdGlvbnMoKVxuXG4gICAgIyBDb250aW51ZSBiZWF1dGlmeWluZ1xuICAgIHBhdGggPz0gcmVxdWlyZShcInBhdGhcIilcbiAgICBmb3JjZUVudGlyZUZpbGUgPSBvblNhdmUgYW5kIGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5iZWF1dGlmeUVudGlyZUZpbGVPblNhdmVcIilcblxuICAgICMgR2V0IHRoZSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICAgICMgQWxsIG9mIHRoZSBvcHRpb25zXG4gICAgIyBMaXN0ZWQgaW4gb3JkZXIgZnJvbSBkZWZhdWx0IChiYXNlKSB0byB0aGUgb25lIHdpdGggdGhlIGhpZ2hlc3QgcHJpb3JpdHlcbiAgICAjIExlZnQgPSBEZWZhdWx0LCBSaWdodCA9IFdpbGwgb3ZlcnJpZGUgdGhlIGxlZnQuXG4gICAgIyBBdG9tIEVkaXRvclxuICAgICNcbiAgICAjIFVzZXIncyBIb21lIHBhdGhcbiAgICAjIFByb2plY3QgcGF0aFxuICAgICMgQXN5bmNocm9ub3VzbHkgYW5kIGNhbGxiYWNrLXN0eWxlXG4gICAgYmVhdXRpZnlDb21wbGV0ZWQgPSAodGV4dCkgLT5cblxuICAgICAgaWYgbm90IHRleHQ/XG4gICAgICAgICMgRG8gbm90aGluZywgaXMgdW5kZWZpbmVkXG4gICAgICAgICMgY29uc29sZS5sb2cgJ2JlYXV0aWZ5Q29tcGxldGVkJ1xuICAgICAgZWxzZSBpZiB0ZXh0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgc2hvd0Vycm9yKHRleHQpXG4gICAgICAgIHJldHVybiByZWplY3QodGV4dClcbiAgICAgIGVsc2UgaWYgdHlwZW9mIHRleHQgaXMgXCJzdHJpbmdcIlxuICAgICAgICBpZiBvbGRUZXh0IGlzbnQgdGV4dFxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIlJlcGxhY2luZyBjdXJyZW50IGVkaXRvcidzIHRleHQgd2l0aCBuZXcgdGV4dFwiXG4gICAgICAgICAgcG9zQXJyYXkgPSBnZXRDdXJzb3JzKGVkaXRvcilcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJwb3NBcnJheTpcbiAgICAgICAgICBvcmlnU2Nyb2xsVG9wID0gZ2V0U2Nyb2xsVG9wKGVkaXRvcilcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJvcmlnU2Nyb2xsVG9wOlxuICAgICAgICAgIGlmIG5vdCBmb3JjZUVudGlyZUZpbGUgYW5kIGlzU2VsZWN0aW9uXG4gICAgICAgICAgICBzZWxlY3RlZEJ1ZmZlclJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2VsZWN0ZWRCdWZmZXJSYW5nZTpcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSBzZWxlY3RlZEJ1ZmZlclJhbmdlLCB0ZXh0XG4gICAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2V0VGV4dFwiXG4gICAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dFZpYURpZmYodGV4dClcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZXRDdXJzb3JzXCJcbiAgICAgICAgICBzZXRDdXJzb3JzIGVkaXRvciwgcG9zQXJyYXlcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJEb25lIHNldEN1cnNvcnNcIlxuICAgICAgICAgICMgTGV0IHRoZSBzY3JvbGxUb3Agc2V0dGluZyBydW4gYWZ0ZXIgYWxsIHRoZSBzYXZlIHJlbGF0ZWQgc3R1ZmYgaXMgcnVuLFxuICAgICAgICAgICMgb3RoZXJ3aXNlIHNldFNjcm9sbFRvcCBpcyBub3Qgd29ya2luZywgcHJvYmFibHkgYmVjYXVzZSB0aGUgY3Vyc29yXG4gICAgICAgICAgIyBhZGRpdGlvbiBoYXBwZW5zIGFzeW5jaHJvbm91c2x5XG4gICAgICAgICAgc2V0VGltZW91dCAoIC0+XG5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZXRTY3JvbGxUb3BcIlxuICAgICAgICAgICAgc2V0U2Nyb2xsVG9wIGVkaXRvciwgb3JpZ1Njcm9sbFRvcFxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGV4dClcbiAgICAgICAgICApLCAwXG4gICAgICBlbHNlXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYmVhdXRpZmljYXRpb24gcmVzdWx0ICcje3RleHR9Jy5cIilcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuXG4gICAgICAjIGVsc2VcbiAgICAgICMgY29uc29sZS5sb2cgXCJBbHJlYWR5IEJlYXV0aWZ1bCFcIlxuICAgICAgcmV0dXJuXG5cbiAgICAjIGNvbnNvbGUubG9nICdCZWF1dGlmeSB0aW1lISdcbiAgICAjXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3JcbiAgICBlZGl0b3IgPSBlZGl0b3IgPyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuXG4gICAgIyBDaGVjayBpZiB0aGVyZSBpcyBhbiBhY3RpdmUgZWRpdG9yXG4gICAgaWYgbm90IGVkaXRvcj9cbiAgICAgIHJldHVybiBzaG93RXJyb3IoIG5ldyBFcnJvcihcIkFjdGl2ZSBFZGl0b3Igbm90IGZvdW5kLiBcIlxuICAgICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIikpXG4gICAgaXNTZWxlY3Rpb24gPSAhIWVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuXG5cbiAgICAjIEdldCBlZGl0b3IgcGF0aCBhbmQgY29uZmlndXJhdGlvbnMgZm9yIHBhdGhzXG4gICAgZWRpdGVkRmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cblxuICAgICMgR2V0IGFsbCBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZWRpdGVkRmlsZVBhdGgsIGVkaXRvcilcblxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3IncyB0ZXh0XG4gICAgdGV4dCA9IHVuZGVmaW5lZFxuICAgIGlmIG5vdCBmb3JjZUVudGlyZUZpbGUgYW5kIGlzU2VsZWN0aW9uXG4gICAgICB0ZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICBvbGRUZXh0ID0gdGV4dFxuXG5cbiAgICAjIEdldCBHcmFtbWFyXG4gICAgZ3JhbW1hck5hbWUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcblxuXG4gICAgIyBGaW5hbGx5LCBiZWF1dGlmeSFcbiAgICB0cnlcbiAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGVkaXRlZEZpbGVQYXRoLCBvblNhdmU6IG9uU2F2ZSwgbGFuZ3VhZ2U6IGxhbmd1YWdlKVxuICAgICAgLnRoZW4oYmVhdXRpZnlDb21wbGV0ZWQpXG4gICAgICAuY2F0Y2goYmVhdXRpZnlDb21wbGV0ZWQpXG4gICAgY2F0Y2ggZVxuICAgICAgc2hvd0Vycm9yKGUpXG4gICAgcmV0dXJuXG4gIClcblxuYmVhdXRpZnlGaWxlUGF0aCA9IChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoJywgZmlsZVBhdGgpXG5cbiAgIyBTaG93IGluIHByb2dyZXNzIGluZGljYXRlIG9uIGZpbGUncyB0cmVlLXZpZXcgZW50cnlcbiAgJCA/PSByZXF1aXJlKFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIikuJFxuICAkZWwgPSAkKFwiLmljb24tZmlsZS10ZXh0W2RhdGEtcGF0aD1cXFwiI3tmaWxlUGF0aH1cXFwiXVwiKVxuICAkZWwuYWRkQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcblxuICAjIENsZWFudXAgYW5kIHJldHVybiBjYWxsYmFjayBmdW5jdGlvblxuICBjYiA9IChlcnIsIHJlc3VsdCkgLT5cbiAgICBsb2dnZXIudmVyYm9zZSgnQ2xlYW51cCBiZWF1dGlmeUZpbGVQYXRoJywgZXJyLCByZXN1bHQpXG4gICAgJGVsID0gJChcIi5pY29uLWZpbGUtdGV4dFtkYXRhLXBhdGg9XFxcIiN7ZmlsZVBhdGh9XFxcIl1cIilcbiAgICAkZWwucmVtb3ZlQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcbiAgICByZXR1cm4gY2FsbGJhY2soZXJyLCByZXN1bHQpXG5cbiAgIyBHZXQgY29udGVudHMgb2YgZmlsZVxuICBmcyA/PSByZXF1aXJlIFwiZnNcIlxuICBsb2dnZXIudmVyYm9zZSgncmVhZEZpbGUnLCBmaWxlUGF0aClcbiAgZnMucmVhZEZpbGUoZmlsZVBhdGgsIChlcnIsIGRhdGEpIC0+XG4gICAgbG9nZ2VyLnZlcmJvc2UoJ3JlYWRGaWxlIGNvbXBsZXRlZCcsIGVyciwgZmlsZVBhdGgpXG4gICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgaW5wdXQgPSBkYXRhPy50b1N0cmluZygpXG4gICAgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcihmaWxlUGF0aCwgaW5wdXQpXG4gICAgZ3JhbW1hck5hbWUgPSBncmFtbWFyLm5hbWVcblxuICAgICMgR2V0IHRoZSBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZmlsZVBhdGgpXG4gICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGggYWxsT3B0aW9ucycsIGFsbE9wdGlvbnMpXG5cbiAgICAjIEJlYXV0aWZ5IEZpbGVcbiAgICBjb21wbGV0aW9uRnVuID0gKG91dHB1dCkgLT5cbiAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoIGNvbXBsZXRpb25GdW4nLCBvdXRwdXQpXG4gICAgICBpZiBvdXRwdXQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICByZXR1cm4gY2Iob3V0cHV0LCBudWxsICkgIyBvdXRwdXQgPT0gRXJyb3JcbiAgICAgIGVsc2UgaWYgdHlwZW9mIG91dHB1dCBpcyBcInN0cmluZ1wiXG4gICAgICAgICMgZG8gbm90IGFsbG93IGVtcHR5IHN0cmluZ1xuICAgICAgICBpZiBvdXRwdXQudHJpbSgpIGlzICcnXG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGgsIG91dHB1dCB3YXMgZW1wdHkgc3RyaW5nIScpXG4gICAgICAgICAgcmV0dXJuIGNiKG51bGwsIG91dHB1dClcbiAgICAgICAgIyBzYXZlIHRvIGZpbGVcbiAgICAgICAgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBvdXRwdXQsIChlcnIpIC0+XG4gICAgICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICAgICAgcmV0dXJuIGNiKCBudWxsICwgb3V0cHV0KVxuICAgICAgICApXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBjYiggbmV3IEVycm9yKFwiVW5rbm93biBiZWF1dGlmaWNhdGlvbiByZXN1bHQgI3tvdXRwdXR9LlwiKSwgb3V0cHV0KVxuICAgIHRyeVxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5JywgaW5wdXQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkoaW5wdXQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgIC50aGVuKGNvbXBsZXRpb25GdW4pXG4gICAgICAuY2F0Y2goY29tcGxldGlvbkZ1bilcbiAgICBjYXRjaCBlXG4gICAgICByZXR1cm4gY2IoZSlcbiAgICApXG5cbmJlYXV0aWZ5RmlsZSA9ICh7dGFyZ2V0fSkgLT5cbiAgZmlsZVBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gIHJldHVybiB1bmxlc3MgZmlsZVBhdGhcbiAgYmVhdXRpZnlGaWxlUGF0aChmaWxlUGF0aCwgKGVyciwgcmVzdWx0KSAtPlxuICAgIHJldHVybiBzaG93RXJyb3IoZXJyKSBpZiBlcnJcbiAgICAjIGNvbnNvbGUubG9nKFwiQmVhdXRpZnkgRmlsZVxuICApXG4gIHJldHVyblxuXG5iZWF1dGlmeURpcmVjdG9yeSA9ICh7dGFyZ2V0fSkgLT5cbiAgZGlyUGF0aCA9IHRhcmdldC5kYXRhc2V0LnBhdGhcbiAgcmV0dXJuIHVubGVzcyBkaXJQYXRoXG5cbiAgcmV0dXJuIGlmIGF0b20/LmNvbmZpcm0oXG4gICAgbWVzc2FnZTogXCJUaGlzIHdpbGwgYmVhdXRpZnkgYWxsIG9mIHRoZSBmaWxlcyBmb3VuZCBcXFxuICAgICAgICByZWN1cnNpdmVseSBpbiB0aGlzIGRpcmVjdG9yeSwgJyN7ZGlyUGF0aH0nLiBcXFxuICAgICAgICBEbyB5b3Ugd2FudCB0byBjb250aW51ZT9cIixcbiAgICBidXR0b25zOiBbJ1llcywgY29udGludWUhJywnTm8sIGNhbmNlbCEnXSkgaXNudCAwXG5cbiAgIyBTaG93IGluIHByb2dyZXNzIGluZGljYXRlIG9uIGRpcmVjdG9yeSdzIHRyZWUtdmlldyBlbnRyeVxuICAkID89IHJlcXVpcmUoXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiKS4kXG4gICRlbCA9ICQoXCIuaWNvbi1maWxlLWRpcmVjdG9yeVtkYXRhLXBhdGg9XFxcIiN7ZGlyUGF0aH1cXFwiXVwiKVxuICAkZWwuYWRkQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcblxuICAjIFByb2Nlc3MgRGlyZWN0b3J5XG4gIGRpciA/PSByZXF1aXJlIFwibm9kZS1kaXJcIlxuICBhc3luYyA/PSByZXF1aXJlIFwiYXN5bmNcIlxuICBkaXIuZmlsZXMoZGlyUGF0aCwgKGVyciwgZmlsZXMpIC0+XG4gICAgcmV0dXJuIHNob3dFcnJvcihlcnIpIGlmIGVyclxuXG4gICAgYXN5bmMuZWFjaChmaWxlcywgKGZpbGVQYXRoLCBjYWxsYmFjaykgLT5cbiAgICAgICMgSWdub3JlIGVycm9yc1xuICAgICAgYmVhdXRpZnlGaWxlUGF0aChmaWxlUGF0aCwgLT4gY2FsbGJhY2soKSlcbiAgICAsIChlcnIpIC0+XG4gICAgICAkZWwgPSAkKFwiLmljb24tZmlsZS1kaXJlY3RvcnlbZGF0YS1wYXRoPVxcXCIje2RpclBhdGh9XFxcIl1cIilcbiAgICAgICRlbC5yZW1vdmVDbGFzcygnYmVhdXRpZnlpbmcnKVxuICAgICAgIyBjb25zb2xlLmxvZygnQ29tcGxldGVkIGJlYXV0aWZ5aW5nIGRpcmVjdG9yeSEnLCBkaXJQYXRoKVxuICAgIClcbiAgKVxuICByZXR1cm5cblxuZGVidWcgPSAoKSAtPlxuICB0cnlcbiAgICBvcGVuID0gcmVxdWlyZShcIm9wZW5cIilcbiAgICBmcyA/PSByZXF1aXJlIFwiZnNcIlxuXG4gICAgcGx1Z2luLmNoZWNrVW5zdXBwb3J0ZWRPcHRpb25zKClcblxuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBsaW5raWZ5VGl0bGUgPSAodGl0bGUpIC0+XG4gICAgICB0aXRsZSA9IHRpdGxlLnRvTG93ZXJDYXNlKClcbiAgICAgIHAgPSB0aXRsZS5zcGxpdCgvW1xccywrIzssXFwvPzpAJj0rJF0rLykgIyBzcGxpdCBpbnRvIHBhcnRzXG4gICAgICBzZXAgPSBcIi1cIlxuICAgICAgcC5qb2luKHNlcClcblxuICAgICMgQ2hlY2sgaWYgdGhlcmUgaXMgYW4gYWN0aXZlIGVkaXRvclxuICAgIGlmIG5vdCBlZGl0b3I/XG4gICAgICByZXR1cm4gY29uZmlybShcIkFjdGl2ZSBFZGl0b3Igbm90IGZvdW5kLlxcblwiICtcbiAgICAgIFwiUGxlYXNlIHNlbGVjdCBhIFRleHQgRWRpdG9yIGZpcnN0IHRvIGJlYXV0aWZ5LlwiKVxuICAgIHJldHVybiB1bmxlc3MgY29uZmlybSgnQXJlIHlvdSByZWFkeSB0byBkZWJ1ZyBBdG9tIEJlYXV0aWZ5PycpXG4gICAgZGVidWdJbmZvID0gXCJcIlxuICAgIGhlYWRlcnMgPSBbXVxuICAgIHRvY0VsID0gXCI8VEFCTEVPRkNPTlRFTlRTLz5cIlxuICAgIGFkZEluZm8gPSAoa2V5LCB2YWwpIC0+XG4gICAgICBpZiBrZXk/XG4gICAgICAgIGRlYnVnSW5mbyArPSBcIioqI3trZXl9Kio6ICN7dmFsfVxcblxcblwiXG4gICAgICBlbHNlXG4gICAgICAgIGRlYnVnSW5mbyArPSBcIiN7dmFsfVxcblxcblwiXG4gICAgYWRkSGVhZGVyID0gKGxldmVsLCB0aXRsZSkgLT5cbiAgICAgIGRlYnVnSW5mbyArPSBcIiN7QXJyYXkobGV2ZWwrMSkuam9pbignIycpfSAje3RpdGxlfVxcblxcblwiXG4gICAgICBoZWFkZXJzLnB1c2goe1xuICAgICAgICBsZXZlbCwgdGl0bGVcbiAgICAgICAgfSlcbiAgICBhZGRIZWFkZXIoMSwgXCJBdG9tIEJlYXV0aWZ5IC0gRGVidWdnaW5nIGluZm9ybWF0aW9uXCIpXG4gICAgZGVidWdJbmZvICs9IFwiVGhlIGZvbGxvd2luZyBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gd2FzIFwiICtcbiAgICBcImdlbmVyYXRlZCBieSBgQXRvbSBCZWF1dGlmeWAgb24gYCN7bmV3IERhdGUoKX1gLlwiICtcbiAgICBcIlxcblxcbi0tLVxcblxcblwiICtcbiAgICB0b2NFbCArXG4gICAgXCJcXG5cXG4tLS1cXG5cXG5cIlxuXG4gICAgIyBQbGF0Zm9ybVxuICAgIGFkZEluZm8oJ1BsYXRmb3JtJywgcHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICBhZGRIZWFkZXIoMiwgXCJWZXJzaW9uc1wiKVxuXG5cbiAgICAjIEF0b20gVmVyc2lvblxuICAgIGFkZEluZm8oJ0F0b20gVmVyc2lvbicsIGF0b20uYXBwVmVyc2lvbilcblxuXG4gICAgIyBBdG9tIEJlYXV0aWZ5IFZlcnNpb25cbiAgICBhZGRJbmZvKCdBdG9tIEJlYXV0aWZ5IFZlcnNpb24nLCBwa2cudmVyc2lvbilcbiAgICBhZGRIZWFkZXIoMiwgXCJPcmlnaW5hbCBmaWxlIHRvIGJlIGJlYXV0aWZpZWRcIilcblxuXG4gICAgIyBPcmlnaW5hbCBmaWxlXG4gICAgI1xuICAgICMgR2V0IGVkaXRvciBwYXRoIGFuZCBjb25maWd1cmF0aW9ucyBmb3IgcGF0aHNcbiAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgICMgUGF0aFxuICAgIGFkZEluZm8oJ09yaWdpbmFsIEZpbGUgUGF0aCcsIFwiYCN7ZmlsZVBhdGh9YFwiKVxuXG4gICAgIyBHZXQgR3JhbW1hclxuICAgIGdyYW1tYXJOYW1lID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG5cbiAgICAjIEdyYW1tYXJcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIEdyYW1tYXInLCBncmFtbWFyTmFtZSlcblxuICAgICMgTGFuZ3VhZ2VcbiAgICBsYW5ndWFnZSA9IGJlYXV0aWZpZXIuZ2V0TGFuZ3VhZ2UoZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgIGFkZEluZm8oJ09yaWdpbmFsIEZpbGUgTGFuZ3VhZ2UnLCBsYW5ndWFnZT8ubmFtZSlcbiAgICBhZGRJbmZvKCdMYW5ndWFnZSBuYW1lc3BhY2UnLCBsYW5ndWFnZT8ubmFtZXNwYWNlKVxuXG4gICAgIyBCZWF1dGlmaWVyXG4gICAgYmVhdXRpZmllcnMgPSBiZWF1dGlmaWVyLmdldEJlYXV0aWZpZXJzKGxhbmd1YWdlLm5hbWUpXG4gICAgYWRkSW5mbygnU3VwcG9ydGVkIEJlYXV0aWZpZXJzJywgXy5tYXAoYmVhdXRpZmllcnMsICduYW1lJykuam9pbignLCAnKSlcbiAgICBzZWxlY3RlZEJlYXV0aWZpZXIgPSBiZWF1dGlmaWVyLmdldEJlYXV0aWZpZXJGb3JMYW5ndWFnZShsYW5ndWFnZSlcbiAgICBhZGRJbmZvKCdTZWxlY3RlZCBCZWF1dGlmaWVyJywgc2VsZWN0ZWRCZWF1dGlmaWVyLm5hbWUpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvcidzIHRleHRcbiAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKSBvciBcIlwiXG5cbiAgICAjIENvbnRlbnRzXG4gICAgY29kZUJsb2NrU3ludGF4ID0gKGxhbmd1YWdlPy5uYW1lID8gZ3JhbW1hck5hbWUpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKVswXVxuICAgIGFkZEhlYWRlcigzLCAnT3JpZ2luYWwgRmlsZSBDb250ZW50cycpXG4gICAgYWRkSW5mbyhudWxsLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7dGV4dH1cXG5gYGBcIilcblxuICAgIGFkZEhlYWRlcigzLCAnUGFja2FnZSBTZXR0aW5ncycpXG4gICAgYWRkSW5mbyhudWxsLFxuICAgICAgXCJUaGUgcmF3IHBhY2thZ2Ugc2V0dGluZ3Mgb3B0aW9uc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoYXRvbS5jb25maWcuZ2V0KCdhdG9tLWJlYXV0aWZ5JyksIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG5cbiAgICAjIEJlYXV0aWZpY2F0aW9uIE9wdGlvbnNcbiAgICBhZGRIZWFkZXIoMiwgXCJCZWF1dGlmaWNhdGlvbiBvcHRpb25zXCIpXG4gICAgIyBHZXQgYWxsIG9wdGlvbnNcbiAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChmaWxlUGF0aCwgZWRpdG9yKVxuICAgICMgUmVzb2x2ZSBvcHRpb25zIHdpdGggcHJvbWlzZXNcbiAgICBQcm9taXNlLmFsbChhbGxPcHRpb25zKVxuICAgIC50aGVuKChhbGxPcHRpb25zKSAtPlxuICAgICAgIyBFeHRyYWN0IG9wdGlvbnNcbiAgICAgIFtcbiAgICAgICAgICBlZGl0b3JPcHRpb25zXG4gICAgICAgICAgY29uZmlnT3B0aW9uc1xuICAgICAgICAgIGhvbWVPcHRpb25zXG4gICAgICAgICAgZWRpdG9yQ29uZmlnT3B0aW9uc1xuICAgICAgXSA9IGFsbE9wdGlvbnNcbiAgICAgIHByb2plY3RPcHRpb25zID0gYWxsT3B0aW9uc1s0Li5dXG5cbiAgICAgIHByZVRyYW5zZm9ybWVkT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0Zvckxhbmd1YWdlKGFsbE9wdGlvbnMsIGxhbmd1YWdlKVxuXG4gICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXJcbiAgICAgICAgZmluYWxPcHRpb25zID0gYmVhdXRpZmllci50cmFuc2Zvcm1PcHRpb25zKHNlbGVjdGVkQmVhdXRpZmllciwgbGFuZ3VhZ2UubmFtZSwgcHJlVHJhbnNmb3JtZWRPcHRpb25zKVxuXG4gICAgICAjIFNob3cgb3B0aW9uc1xuICAgICAgIyBhZGRJbmZvKCdBbGwgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgIyBcIkFsbCBvcHRpb25zIGV4dHJhY3RlZCBmb3IgZmlsZVxcblwiICtcbiAgICAgICMgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShhbGxPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnRWRpdG9yIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIEF0b20gRWRpdG9yIHNldHRpbmdzXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShlZGl0b3JPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnQ29uZmlnIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIEF0b20gQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5nc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoY29uZmlnT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0hvbWUgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gYCN7cGF0aC5yZXNvbHZlKGJlYXV0aWZpZXIuZ2V0VXNlckhvbWUoKSwgJy5qc2JlYXV0aWZ5cmMnKX1gXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShob21lT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0VkaXRvckNvbmZpZyBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBbRWRpdG9yQ29uZmlnXShodHRwOi8vZWRpdG9yY29uZmlnLm9yZy8pIGZpbGVcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGVkaXRvckNvbmZpZ09wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdQcm9qZWN0IE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIGAuanNiZWF1dGlmeXJjYCBmaWxlcyBzdGFydGluZyBmcm9tIGRpcmVjdG9yeSBgI3twYXRoLmRpcm5hbWUoZmlsZVBhdGgpfWAgYW5kIGdvaW5nIHVwIHRvIHJvb3RcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KHByb2plY3RPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnUHJlLVRyYW5zZm9ybWVkIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiQ29tYmluZWQgb3B0aW9ucyBiZWZvcmUgdHJhbnNmb3JtaW5nIHRoZW0gZ2l2ZW4gYSBiZWF1dGlmaWVyJ3Mgc3BlY2lmaWNhdGlvbnNcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KHByZVRyYW5zZm9ybWVkT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGlmIHNlbGVjdGVkQmVhdXRpZmllclxuICAgICAgICBhZGRIZWFkZXIoMywgJ0ZpbmFsIE9wdGlvbnMnKVxuICAgICAgICBhZGRJbmZvKG51bGwsXG4gICAgICAgICAgXCJGaW5hbCBjb21iaW5lZCBhbmQgdHJhbnNmb3JtZWQgb3B0aW9ucyB0aGF0IGFyZSB1c2VkXFxuXCIgK1xuICAgICAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZmluYWxPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuXG4gICAgICAjXG4gICAgICBsb2dzID0gXCJcIlxuICAgICAgbG9nRmlsZVBhdGhSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFw6IFxcXFxbKC4qKVxcXFxdJylcbiAgICAgIHN1YnNjcmlwdGlvbiA9IGxvZ2dlci5vbkxvZ2dpbmcoKG1zZykgLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZygnbG9nZ2luZycsIG1zZylcbiAgICAgICAgc2VwID0gcGF0aC5zZXBcbiAgICAgICAgbG9ncyArPSBtc2cucmVwbGFjZShsb2dGaWxlUGF0aFJlZ2V4LCAoYSxiKSAtPlxuICAgICAgICAgIHMgPSBiLnNwbGl0KHNlcClcbiAgICAgICAgICBpID0gcy5pbmRleE9mKCdhdG9tLWJlYXV0aWZ5JylcbiAgICAgICAgICBwID0gcy5zbGljZShpKzIpLmpvaW4oc2VwKVxuICAgICAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBhcmd1bWVudHMsIHMsIGksIHApXG4gICAgICAgICAgcmV0dXJuICc6IFsnK3ArJ10nXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIGNiID0gKHJlc3VsdCkgLT5cbiAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICBhZGRIZWFkZXIoMiwgXCJSZXN1bHRzXCIpXG5cbiAgICAgICAgIyBMb2dzXG4gICAgICAgIGFkZEluZm8oJ0JlYXV0aWZpZWQgRmlsZSBDb250ZW50cycsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3tyZXN1bHR9XFxuYGBgXCIpXG4gICAgICAgICMgRGlmZlxuICAgICAgICBKc0RpZmYgPSByZXF1aXJlKCdkaWZmJylcbiAgICAgICAgaWYgdHlwZW9mIHJlc3VsdCBpcyBcInN0cmluZ1wiXG4gICAgICAgICAgZGlmZiA9IEpzRGlmZi5jcmVhdGVQYXRjaChmaWxlUGF0aCBvciBcIlwiLCB0ZXh0IG9yIFwiXCIsIFxcXG4gICAgICAgICAgICByZXN1bHQgb3IgXCJcIiwgXCJvcmlnaW5hbFwiLCBcImJlYXV0aWZpZWRcIilcbiAgICAgICAgICBhZGRJbmZvKCdPcmlnaW5hbCB2cy4gQmVhdXRpZmllZCBEaWZmJywgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je2RpZmZ9XFxuYGBgXCIpXG5cbiAgICAgICAgYWRkSGVhZGVyKDMsIFwiTG9nc1wiKVxuICAgICAgICBhZGRJbmZvKG51bGwsIFwiYGBgXFxuI3tsb2dzfVxcbmBgYFwiKVxuXG4gICAgICAgICMgQnVpbGQgVGFibGUgb2YgQ29udGVudHNcbiAgICAgICAgdG9jID0gXCIjIyBUYWJsZSBPZiBDb250ZW50c1xcblwiXG4gICAgICAgIGZvciBoZWFkZXIgaW4gaGVhZGVyc1xuICAgICAgICAgICMjI1xuICAgICAgICAgIC0gSGVhZGluZyAxXG4gICAgICAgICAgICAtIEhlYWRpbmcgMS4xXG4gICAgICAgICAgIyMjXG4gICAgICAgICAgaW5kZW50ID0gXCIgIFwiICMgMiBzcGFjZXNcbiAgICAgICAgICBidWxsZXQgPSBcIi1cIlxuICAgICAgICAgIGluZGVudE51bSA9IGhlYWRlci5sZXZlbCAtIDJcbiAgICAgICAgICBpZiBpbmRlbnROdW0gPj0gMFxuICAgICAgICAgICAgdG9jICs9IChcIiN7QXJyYXkoaW5kZW50TnVtKzEpLmpvaW4oaW5kZW50KX0je2J1bGxldH0gWyN7aGVhZGVyLnRpdGxlfV0oXFwjI3tsaW5raWZ5VGl0bGUoaGVhZGVyLnRpdGxlKX0pXFxuXCIpXG4gICAgICAgICMgUmVwbGFjZSBUQUJMRU9GQ09OVEVOVFNcbiAgICAgICAgZGVidWdJbmZvID0gZGVidWdJbmZvLnJlcGxhY2UodG9jRWwsIHRvYylcblxuICAgICAgICAjIFNhdmUgdG8gbmV3IFRleHRFZGl0b3JcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG4gICAgICAgICAgLnRoZW4oKGVkaXRvcikgLT5cbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KGRlYnVnSW5mbylcbiAgICAgICAgICAgIGNvbmZpcm0oXCJcIlwiUGxlYXNlIGxvZ2luIHRvIEdpdEh1YiBhbmQgY3JlYXRlIGEgR2lzdCBuYW1lZCBcXFwiZGVidWcubWRcXFwiIChNYXJrZG93biBmaWxlKSB3aXRoIHlvdXIgZGVidWdnaW5nIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgVGhlbiBhZGQgYSBsaW5rIHRvIHlvdXIgR2lzdCBpbiB5b3VyIEdpdEh1YiBJc3N1ZS5cbiAgICAgICAgICAgIFRoYW5rIHlvdSFcblxuICAgICAgICAgICAgR2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vXG4gICAgICAgICAgICBHaXRIdWIgSXNzdWVzOiBodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvaXNzdWVzXG4gICAgICAgICAgICBcIlwiXCIpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICAgICAgICBjb25maXJtKFwiQW4gZXJyb3Igb2NjdXJyZWQgd2hlbiBjcmVhdGluZyB0aGUgR2lzdDogXCIrZXJyb3IubWVzc2FnZSlcbiAgICAgICAgICApXG4gICAgICB0cnlcbiAgICAgICAgYmVhdXRpZmllci5iZWF1dGlmeSh0ZXh0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICAgIC50aGVuKGNiKVxuICAgICAgICAuY2F0Y2goY2IpXG4gICAgICBjYXRjaCBlXG4gICAgICAgIHJldHVybiBjYihlKVxuICAgIClcbiAgICAuY2F0Y2goKGVycm9yKSAtPlxuICAgICAgc3RhY2sgPSBlcnJvci5zdGFja1xuICAgICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgICAgYXRvbT8ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoZXJyb3IubWVzc2FnZSwge1xuICAgICAgICBzdGFjaywgZGV0YWlsLCBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICAgIH0pXG4gICAgKVxuICBjYXRjaCBlcnJvclxuICAgIHN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgICBkZXRhaWwgPSBlcnJvci5kZXNjcmlwdGlvbiBvciBlcnJvci5tZXNzYWdlXG4gICAgYXRvbT8ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoZXJyb3IubWVzc2FnZSwge1xuICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlXG4gICAgfSlcblxuaGFuZGxlU2F2ZUV2ZW50ID0gLT5cbiAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gICAgcGVuZGluZ1BhdGhzID0ge31cbiAgICBiZWF1dGlmeU9uU2F2ZUhhbmRsZXIgPSAoe3BhdGg6IGZpbGVQYXRofSkgLT5cbiAgICAgIGxvZ2dlci52ZXJib3NlKCdTaG91bGQgYmVhdXRpZnkgb24gdGhpcyBzYXZlPycpXG4gICAgICBpZiBwZW5kaW5nUGF0aHNbZmlsZVBhdGhdXG4gICAgICAgIGxvZ2dlci52ZXJib3NlKFwiRWRpdG9yIHdpdGggZmlsZSBwYXRoICN7ZmlsZVBhdGh9IGFscmVhZHkgYmVhdXRpZmllZCFcIilcbiAgICAgICAgcmV0dXJuXG4gICAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIHBhdGggPz0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAjIEdldCBHcmFtbWFyXG4gICAgICBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG4gICAgICAjIEdldCBmaWxlIGV4dGVuc2lvblxuICAgICAgZmlsZUV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlUGF0aClcbiAgICAgICMgUmVtb3ZlIHByZWZpeCBcIi5cIiAocGVyaW9kKSBpbiBmaWxlRXh0ZW5zaW9uXG4gICAgICBmaWxlRXh0ZW5zaW9uID0gZmlsZUV4dGVuc2lvbi5zdWJzdHIoMSlcbiAgICAgICMgR2V0IGxhbmd1YWdlXG4gICAgICBsYW5ndWFnZXMgPSBiZWF1dGlmaWVyLmxhbmd1YWdlcy5nZXRMYW5ndWFnZXMoe2dyYW1tYXIsIGV4dGVuc2lvbjogZmlsZUV4dGVuc2lvbn0pXG4gICAgICBpZiBsYW5ndWFnZXMubGVuZ3RoIDwgMVxuICAgICAgICByZXR1cm5cbiAgICAgICMgVE9ETzogc2VsZWN0IGFwcHJvcHJpYXRlIGxhbmd1YWdlXG4gICAgICBsYW5ndWFnZSA9IGxhbmd1YWdlc1swXVxuICAgICAgIyBHZXQgbGFuZ3VhZ2UgY29uZmlnXG4gICAgICBrZXkgPSBcImF0b20tYmVhdXRpZnkuI3tsYW5ndWFnZS5uYW1lc3BhY2V9LmJlYXV0aWZ5X29uX3NhdmVcIlxuICAgICAgYmVhdXRpZnlPblNhdmUgPSBhdG9tLmNvbmZpZy5nZXQoa2V5KVxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ3NhdmUgZWRpdG9yIHBvc2l0aW9ucycsIGtleSwgYmVhdXRpZnlPblNhdmUpXG4gICAgICBpZiBiZWF1dGlmeU9uU2F2ZVxuICAgICAgICBsb2dnZXIudmVyYm9zZSgnQmVhdXRpZnlpbmcgZmlsZScsIGZpbGVQYXRoKVxuICAgICAgICBiZWF1dGlmeSh7ZWRpdG9yLCBvblNhdmU6IHRydWV9KVxuICAgICAgICAudGhlbigoKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdEb25lIGJlYXV0aWZ5aW5nIGZpbGUnLCBmaWxlUGF0aClcbiAgICAgICAgICBpZiBlZGl0b3IuaXNBbGl2ZSgpIGlzIHRydWVcbiAgICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdTYXZpbmcgVGV4dEVkaXRvci4uLicpXG4gICAgICAgICAgICAjIFN0b3JlIHRoZSBmaWxlUGF0aCB0byBwcmV2ZW50IGluZmluaXRlIGxvb3BpbmdcbiAgICAgICAgICAgICMgV2hlbiBXaGl0ZXNwYWNlIHBhY2thZ2UgaGFzIG9wdGlvbiBcIkVuc3VyZSBTaW5nbGUgVHJhaWxpbmcgTmV3bGluZVwiIGVuYWJsZWRcbiAgICAgICAgICAgICMgSXQgd2lsbCBhZGQgYSBuZXdsaW5lIGFuZCBrZWVwIHRoZSBmaWxlIGZyb20gY29udmVyZ2luZyBvbiBhIGJlYXV0aWZpZWQgZm9ybVxuICAgICAgICAgICAgIyBhbmQgc2F2aW5nIHdpdGhvdXQgZW1pdHRpbmcgb25EaWRTYXZlIGV2ZW50LCBiZWNhdXNlIHRoZXJlIHdlcmUgbm8gY2hhbmdlcy5cbiAgICAgICAgICAgIHBlbmRpbmdQYXRoc1tmaWxlUGF0aF0gPSB0cnVlXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoZWRpdG9yLnNhdmUoKSkudGhlbigoKSAtPlxuICAgICAgICAgICAgICBkZWxldGUgcGVuZGluZ1BhdGhzW2ZpbGVQYXRoXVxuICAgICAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnU2F2ZWQgVGV4dEVkaXRvci4nKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlcnJvcilcbiAgICAgICAgKVxuICAgIGRpc3Bvc2FibGUgPSBlZGl0b3Iub25EaWRTYXZlKCh7cGF0aCA6IGZpbGVQYXRofSkgLT5cbiAgICAgICMgVE9ETzogSW1wbGVtZW50IGRlYm91bmNpbmdcbiAgICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlcih7cGF0aDogZmlsZVBhdGh9KVxuICAgIClcbiAgICBwbHVnaW4uc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zYWJsZVxuXG5vcGVuU2V0dGluZ3MgPSAtPlxuICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL2F0b20tYmVhdXRpZnknKVxuXG5nZXRVbnN1cHBvcnRlZE9wdGlvbnMgPSAtPlxuICBzZXR0aW5ncyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpXG4gIHNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYSgnYXRvbS1iZWF1dGlmeScpXG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IF8uZmlsdGVyKF8ua2V5cyhzZXR0aW5ncyksIChrZXkpIC0+XG4gICAgIyByZXR1cm4gYXRvbS5jb25maWcuZ2V0U2NoZW1hKFwiYXRvbS1iZWF1dGlmeS4ke2tleX1cIikudHlwZVxuICAgICMgcmV0dXJuIHR5cGVvZiBzZXR0aW5nc1trZXldXG4gICAgc2NoZW1hLnByb3BlcnRpZXNba2V5XSBpcyB1bmRlZmluZWRcbiAgKVxuICByZXR1cm4gdW5zdXBwb3J0ZWRPcHRpb25zXG5cbnBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucyA9IC0+XG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IGdldFVuc3VwcG9ydGVkT3B0aW9ucygpXG4gIGlmIHVuc3VwcG9ydGVkT3B0aW9ucy5sZW5ndGggaXNudCAwXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJQbGVhc2UgcnVuIEF0b20gY29tbWFuZCAnQXRvbS1CZWF1dGlmeTogTWlncmF0ZSBTZXR0aW5ncycuXCIsIHtcbiAgICAgIGRldGFpbCA6IFwiWW91IGNhbiBvcGVuIHRoZSBBdG9tIGNvbW1hbmQgcGFsZXR0ZSB3aXRoIGBjbWQtc2hpZnQtcGAgKE9TWCkgb3IgYGN0cmwtc2hpZnQtcGAgKExpbnV4L1dpbmRvd3MpIGluIEF0b20uIFlvdSBoYXZlIHVuc3VwcG9ydGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIsXG4gICAgICBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICB9KVxuXG5wbHVnaW4ubWlncmF0ZVNldHRpbmdzID0gLT5cbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gZ2V0VW5zdXBwb3J0ZWRPcHRpb25zKClcbiAgbmFtZXNwYWNlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLm5hbWVzcGFjZXNcbiAgIyBjb25zb2xlLmxvZygnbWlncmF0ZS1zZXR0aW5ncycsIHNjaGVtYSwgbmFtZXNwYWNlcywgdW5zdXBwb3J0ZWRPcHRpb25zKVxuICBpZiB1bnN1cHBvcnRlZE9wdGlvbnMubGVuZ3RoIGlzIDBcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIk5vIG9wdGlvbnMgdG8gbWlncmF0ZS5cIilcbiAgZWxzZVxuICAgIHJleCA9IG5ldyBSZWdFeHAoXCIoI3tuYW1lc3BhY2VzLmpvaW4oJ3wnKX0pXyguKilcIilcbiAgICByZW5hbWUgPSBfLnRvUGFpcnMoXy56aXBPYmplY3QodW5zdXBwb3J0ZWRPcHRpb25zLCBfLm1hcCh1bnN1cHBvcnRlZE9wdGlvbnMsIChrZXkpIC0+XG4gICAgICBtID0ga2V5Lm1hdGNoKHJleClcbiAgICAgIGlmIG0gaXMgbnVsbFxuICAgICAgICAjIERpZCBub3QgbWF0Y2hcbiAgICAgICAgIyBQdXQgaW50byBnZW5lcmFsXG4gICAgICAgIHJldHVybiBcImdlbmVyYWwuI3trZXl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFwiI3ttWzFdfS4je21bMl19XCJcbiAgICApKSlcbiAgICAjIGNvbnNvbGUubG9nKCdyZW5hbWUnLCByZW5hbWUpXG4gICAgIyBsb2dnZXIudmVyYm9zZSgncmVuYW1lJywgcmVuYW1lKVxuXG4gICAgIyBNb3ZlIGFsbCBvcHRpb24gdmFsdWVzIHRvIHJlbmFtZWQga2V5XG4gICAgXy5lYWNoKHJlbmFtZSwgKFtrZXksIG5ld0tleV0pIC0+XG4gICAgICAjIENvcHkgdG8gbmV3IGtleVxuICAgICAgdmFsID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2tleX1cIilcbiAgICAgICMgY29uc29sZS5sb2coJ3JlbmFtZScsIGtleSwgbmV3S2V5LCB2YWwpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7bmV3S2V5fVwiLCB2YWwpXG4gICAgICAjIERlbGV0ZSBvbGQga2V5XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7a2V5fVwiLCB1bmRlZmluZWQpXG4gICAgKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiU3VjY2Vzc2Z1bGx5IG1pZ3JhdGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIpXG5cbnBsdWdpbi5hZGRMYW5ndWFnZUNvbW1hbmRzID0gLT5cbiAgbGFuZ3VhZ2VzID0gYmVhdXRpZmllci5sYW5ndWFnZXMubGFuZ3VhZ2VzXG4gIGxvZ2dlci52ZXJib3NlKFwibGFuZ3VhZ2VzXCIsIGxhbmd1YWdlcylcbiAgZm9yIGxhbmd1YWdlIGluIGxhbmd1YWdlc1xuICAgICgobGFuZ3VhZ2UpID0+XG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktbGFuZ3VhZ2UtI3tsYW5ndWFnZS5uYW1lLnRvTG93ZXJDYXNlKCl9XCIsICgpIC0+XG4gICAgICAgIGxvZ2dlci52ZXJib3NlKFwiQmVhdXRpZnlpbmcgbGFuZ3VhZ2VcIiwgbGFuZ3VhZ2UpXG4gICAgICAgIGJlYXV0aWZ5KHsgbGFuZ3VhZ2UgfSlcbiAgICAgIClcbiAgICApKGxhbmd1YWdlKVxuXG5wbHVnaW4uY29uZmlnID0gXy5tZXJnZShyZXF1aXJlKCcuL2NvbmZpZycpLCBkZWZhdWx0TGFuZ3VhZ2VPcHRpb25zKVxucGx1Z2luLmFjdGl2YXRlID0gLT5cbiAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgaGFuZGxlU2F2ZUV2ZW50KClcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWVkaXRvclwiLCBiZWF1dGlmeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6aGVscC1kZWJ1Zy1lZGl0b3JcIiwgZGVidWdcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5Om9wZW4tc2V0dGluZ3NcIiwgb3BlblNldHRpbmdzXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcIi50cmVlLXZpZXcgLmZpbGUgLm5hbWVcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWZpbGVcIiwgYmVhdXRpZnlGaWxlXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcIi50cmVlLXZpZXcgLmRpcmVjdG9yeSAubmFtZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktZGlyZWN0b3J5XCIsIGJlYXV0aWZ5RGlyZWN0b3J5XG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS1iZWF1dGlmeTptaWdyYXRlLXNldHRpbmdzXCIsIHBsdWdpbi5taWdyYXRlU2V0dGluZ3NcbiAgQGFkZExhbmd1YWdlQ29tbWFuZHMoKVxuXG5wbHVnaW4uZGVhY3RpdmF0ZSA9IC0+XG4gIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19

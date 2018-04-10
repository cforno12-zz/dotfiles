(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, _, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml;

  pkg = require('../package.json');

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
    var editor, onSave;
    editor = arg.editor, onSave = arg.onSave;
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
              editor.setText(text);
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
          onSave: onSave
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
              editor.save();
              delete pendingPaths[filePath];
              return logger.verbose('Saved TextEditor.');
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

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    return this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUE7O0VBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUjs7RUFHTixNQUFBLEdBQVMsTUFBTSxDQUFDOztFQUNmLHNCQUF1QixPQUFBLENBQVEsV0FBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7RUFDZCxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBOztFQUNqQixzQkFBQSxHQUF5QixVQUFVLENBQUM7O0VBQ3BDLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLFVBQXBCOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFHVixFQUFBLEdBQUs7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEtBQUEsR0FBUTs7RUFDUixJQUFBLEdBQU87O0VBQ1AsS0FBQSxHQUFROztFQUNSLEdBQUEsR0FBTTs7RUFDTixXQUFBLEdBQWM7O0VBQ2QsV0FBQSxHQUFjOztFQUNkLENBQUEsR0FBSTs7RUFNSixZQUFBLEdBQWUsU0FBQyxNQUFEO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7MEJBQ1AsSUFBSSxDQUFFLFlBQU4sQ0FBQTtFQUZhOztFQUdmLFlBQUEsR0FBZSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7OERBQ1EsQ0FBRSxZQUFqQixDQUE4QixLQUE5QjtFQUZhOztFQUlmLFVBQUEsR0FBYSxTQUFDLE1BQUQ7QUFD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QnpCLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQUMsQ0FBQyxLQUFGLENBQVEsT0FBQSxDQUFRLGlCQUFSLENBQVIsRUFBb0Msc0JBQXBDOztFQUNoQixNQUFNLENBQUMsUUFBUCxHQUFrQixTQUFBO0lBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7SUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLGVBQUEsQ0FBQSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLCtCQUFwQyxFQUFxRSxRQUFyRSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlDQUFwQyxFQUF1RSxLQUF2RSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isd0JBQWxCLEVBQTRDLDZCQUE1QyxFQUEyRSxZQUEzRSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsNkJBQWxCLEVBQWlELGtDQUFqRCxFQUFxRixpQkFBckYsQ0FBbkI7V0FDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBc0UsTUFBTSxDQUFDLGVBQTdFLENBQW5CO0VBUGdCOztFQVNsQixNQUFNLENBQUMsVUFBUCxHQUFvQixTQUFBO1dBQ2xCLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0VBRGtCO0FBdm1CcEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGdsb2JhbCBhdG9tXG5cInVzZSBzdHJpY3RcIlxucGtnID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcblxuIyBEZXBlbmRlbmNpZXNcbnBsdWdpbiA9IG1vZHVsZS5leHBvcnRzXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdldmVudC1raXQnXG5fID0gcmVxdWlyZShcImxvZGFzaFwiKVxuQmVhdXRpZmllcnMgPSByZXF1aXJlKFwiLi9iZWF1dGlmaWVyc1wiKVxuYmVhdXRpZmllciA9IG5ldyBCZWF1dGlmaWVycygpXG5kZWZhdWx0TGFuZ3VhZ2VPcHRpb25zID0gYmVhdXRpZmllci5vcHRpb25zXG5sb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcicpKF9fZmlsZW5hbWUpXG5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG4jIExhenkgbG9hZGVkIGRlcGVuZGVuY2llc1xuZnMgPSBudWxsXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbnN0cmlwID0gbnVsbFxueWFtbCA9IG51bGxcbmFzeW5jID0gbnVsbFxuZGlyID0gbnVsbCAjIE5vZGUtRGlyXG5Mb2FkaW5nVmlldyA9IG51bGxcbmxvYWRpbmdWaWV3ID0gbnVsbFxuJCA9IG51bGxcblxuIyBmdW5jdGlvbiBjbGVhbk9wdGlvbnMoZGF0YSwgdHlwZXMpIHtcbiMgbm9wdC5jbGVhbihkYXRhLCB0eXBlcyk7XG4jIHJldHVybiBkYXRhO1xuIyB9XG5nZXRTY3JvbGxUb3AgPSAoZWRpdG9yKSAtPlxuICB2aWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgdmlldz8uZ2V0U2Nyb2xsVG9wKClcbnNldFNjcm9sbFRvcCA9IChlZGl0b3IsIHZhbHVlKSAtPlxuICB2aWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgdmlldz8uY29tcG9uZW50Py5zZXRTY3JvbGxUb3AgdmFsdWVcblxuZ2V0Q3Vyc29ycyA9IChlZGl0b3IpIC0+XG4gIGN1cnNvcnMgPSBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gIHBvc0FycmF5ID0gW11cbiAgZm9yIGN1cnNvciBpbiBjdXJzb3JzXG4gICAgYnVmZmVyUG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHBvc0FycmF5LnB1c2ggW1xuICAgICAgYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBdXG4gIHBvc0FycmF5XG5zZXRDdXJzb3JzID0gKGVkaXRvciwgcG9zQXJyYXkpIC0+XG5cbiAgIyBjb25zb2xlLmxvZyBcInNldEN1cnNvcnM6XG4gIGZvciBidWZmZXJQb3NpdGlvbiwgaSBpbiBwb3NBcnJheVxuICAgIGlmIGkgaXMgMFxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIGJ1ZmZlclBvc2l0aW9uXG4gICAgICBjb250aW51ZVxuICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIGJ1ZmZlclBvc2l0aW9uXG4gIHJldHVyblxuXG4jIFNob3cgYmVhdXRpZmljYXRpb24gcHJvZ3Jlc3MvbG9hZGluZyB2aWV3XG5iZWF1dGlmaWVyLm9uKCdiZWF1dGlmeTo6c3RhcnQnLCAtPlxuICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwuc2hvd0xvYWRpbmdWaWV3XCIpXG4gICAgTG9hZGluZ1ZpZXcgPz0gcmVxdWlyZSBcIi4vdmlld3MvbG9hZGluZy12aWV3XCJcbiAgICBsb2FkaW5nVmlldyA/PSBuZXcgTG9hZGluZ1ZpZXcoKVxuICAgIGxvYWRpbmdWaWV3LnNob3coKVxuKVxuYmVhdXRpZmllci5vbignYmVhdXRpZnk6OmVuZCcsIC0+XG4gIGxvYWRpbmdWaWV3Py5oaWRlKClcbilcbiMgU2hvdyBlcnJvclxuc2hvd0Vycm9yID0gKGVycm9yKSAtPlxuICBpZiBub3QgYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS5nZW5lcmFsLm11dGVBbGxFcnJvcnNcIilcbiAgICAjIGNvbnNvbGUubG9nKGUpXG4gICAgc3RhY2sgPSBlcnJvci5zdGFja1xuICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZX0pXG5cbmJlYXV0aWZ5ID0gKHtlZGl0b3IsIG9uU2F2ZX0pIC0+XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXG4gICAgcGx1Z2luLmNoZWNrVW5zdXBwb3J0ZWRPcHRpb25zKClcblxuICAgICMgQ29udGludWUgYmVhdXRpZnlpbmdcbiAgICBwYXRoID89IHJlcXVpcmUoXCJwYXRoXCIpXG4gICAgZm9yY2VFbnRpcmVGaWxlID0gb25TYXZlIGFuZCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwuYmVhdXRpZnlFbnRpcmVGaWxlT25TYXZlXCIpXG5cbiAgICAjIEdldCB0aGUgcGF0aCB0byB0aGUgY29uZmlnIGZpbGVcbiAgICAjIEFsbCBvZiB0aGUgb3B0aW9uc1xuICAgICMgTGlzdGVkIGluIG9yZGVyIGZyb20gZGVmYXVsdCAoYmFzZSkgdG8gdGhlIG9uZSB3aXRoIHRoZSBoaWdoZXN0IHByaW9yaXR5XG4gICAgIyBMZWZ0ID0gRGVmYXVsdCwgUmlnaHQgPSBXaWxsIG92ZXJyaWRlIHRoZSBsZWZ0LlxuICAgICMgQXRvbSBFZGl0b3JcbiAgICAjXG4gICAgIyBVc2VyJ3MgSG9tZSBwYXRoXG4gICAgIyBQcm9qZWN0IHBhdGhcbiAgICAjIEFzeW5jaHJvbm91c2x5IGFuZCBjYWxsYmFjay1zdHlsZVxuICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gKHRleHQpIC0+XG5cbiAgICAgIGlmIG5vdCB0ZXh0P1xuICAgICAgICAjIERvIG5vdGhpbmcsIGlzIHVuZGVmaW5lZFxuICAgICAgICAjIGNvbnNvbGUubG9nICdiZWF1dGlmeUNvbXBsZXRlZCdcbiAgICAgIGVsc2UgaWYgdGV4dCBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgIHNob3dFcnJvcih0ZXh0KVxuICAgICAgICByZXR1cm4gcmVqZWN0KHRleHQpXG4gICAgICBlbHNlIGlmIHR5cGVvZiB0ZXh0IGlzIFwic3RyaW5nXCJcbiAgICAgICAgaWYgb2xkVGV4dCBpc250IHRleHRcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJSZXBsYWNpbmcgY3VycmVudCBlZGl0b3IncyB0ZXh0IHdpdGggbmV3IHRleHRcIlxuICAgICAgICAgIHBvc0FycmF5ID0gZ2V0Q3Vyc29ycyhlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwicG9zQXJyYXk6XG4gICAgICAgICAgb3JpZ1Njcm9sbFRvcCA9IGdldFNjcm9sbFRvcChlZGl0b3IpXG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwib3JpZ1Njcm9sbFRvcDpcbiAgICAgICAgICBpZiBub3QgZm9yY2VFbnRpcmVGaWxlIGFuZCBpc1NlbGVjdGlvblxuICAgICAgICAgICAgc2VsZWN0ZWRCdWZmZXJSYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNlbGVjdGVkQnVmZmVyUmFuZ2U6XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2Ugc2VsZWN0ZWRCdWZmZXJSYW5nZSwgdGV4dFxuICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFRleHRcIlxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHQgdGV4dFxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldEN1cnNvcnNcIlxuICAgICAgICAgIHNldEN1cnNvcnMgZWRpdG9yLCBwb3NBcnJheVxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIkRvbmUgc2V0Q3Vyc29yc1wiXG4gICAgICAgICAgIyBMZXQgdGhlIHNjcm9sbFRvcCBzZXR0aW5nIHJ1biBhZnRlciBhbGwgdGhlIHNhdmUgcmVsYXRlZCBzdHVmZiBpcyBydW4sXG4gICAgICAgICAgIyBvdGhlcndpc2Ugc2V0U2Nyb2xsVG9wIGlzIG5vdCB3b3JraW5nLCBwcm9iYWJseSBiZWNhdXNlIHRoZSBjdXJzb3JcbiAgICAgICAgICAjIGFkZGl0aW9uIGhhcHBlbnMgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICBzZXRUaW1lb3V0ICggLT5cblxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNldFNjcm9sbFRvcFwiXG4gICAgICAgICAgICBzZXRTY3JvbGxUb3AgZWRpdG9yLCBvcmlnU2Nyb2xsVG9wXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0ZXh0KVxuICAgICAgICAgICksIDBcbiAgICAgIGVsc2VcbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBiZWF1dGlmaWNhdGlvbiByZXN1bHQgJyN7dGV4dH0nLlwiKVxuICAgICAgICBzaG93RXJyb3IoZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG5cbiAgICAgICMgZWxzZVxuICAgICAgIyBjb25zb2xlLmxvZyBcIkFscmVhZHkgQmVhdXRpZnVsIVwiXG4gICAgICByZXR1cm5cblxuICAgICMgY29uc29sZS5sb2cgJ0JlYXV0aWZ5IHRpbWUhJ1xuICAgICNcbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGVkaXRvciA/IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIHNob3dFcnJvciggbmV3IEVycm9yKFwiQWN0aXZlIEVkaXRvciBub3QgZm91bmQuIFwiXG4gICAgICAgIFwiUGxlYXNlIHNlbGVjdCBhIFRleHQgRWRpdG9yIGZpcnN0IHRvIGJlYXV0aWZ5LlwiKSlcbiAgICBpc1NlbGVjdGlvbiA9ICEhZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG5cblxuICAgICMgR2V0IGVkaXRvciBwYXRoIGFuZCBjb25maWd1cmF0aW9ucyBmb3IgcGF0aHNcbiAgICBlZGl0ZWRGaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuXG4gICAgIyBHZXQgYWxsIG9wdGlvbnNcbiAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChlZGl0ZWRGaWxlUGF0aCwgZWRpdG9yKVxuXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvcidzIHRleHRcbiAgICB0ZXh0ID0gdW5kZWZpbmVkXG4gICAgaWYgbm90IGZvcmNlRW50aXJlRmlsZSBhbmQgaXNTZWxlY3Rpb25cbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuICAgIG9sZFRleHQgPSB0ZXh0XG5cblxuICAgICMgR2V0IEdyYW1tYXJcbiAgICBncmFtbWFyTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuXG5cbiAgICAjIEZpbmFsbHksIGJlYXV0aWZ5IVxuICAgIHRyeVxuICAgICAgYmVhdXRpZmllci5iZWF1dGlmeSh0ZXh0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZWRpdGVkRmlsZVBhdGgsIG9uU2F2ZSA6IG9uU2F2ZSlcbiAgICAgIC50aGVuKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgICAgLmNhdGNoKGJlYXV0aWZ5Q29tcGxldGVkKVxuICAgIGNhdGNoIGVcbiAgICAgIHNob3dFcnJvcihlKVxuICAgIHJldHVyblxuICApXG5cbmJlYXV0aWZ5RmlsZVBhdGggPSAoZmlsZVBhdGgsIGNhbGxiYWNrKSAtPlxuICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCcsIGZpbGVQYXRoKVxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBmaWxlJ3MgdHJlZS12aWV3IGVudHJ5XG4gICQgPz0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpLiRcbiAgJGVsID0gJChcIi5pY29uLWZpbGUtdGV4dFtkYXRhLXBhdGg9XFxcIiN7ZmlsZVBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBDbGVhbnVwIGFuZCByZXR1cm4gY2FsbGJhY2sgZnVuY3Rpb25cbiAgY2IgPSAoZXJyLCByZXN1bHQpIC0+XG4gICAgbG9nZ2VyLnZlcmJvc2UoJ0NsZWFudXAgYmVhdXRpZnlGaWxlUGF0aCcsIGVyciwgcmVzdWx0KVxuICAgICRlbCA9ICQoXCIuaWNvbi1maWxlLXRleHRbZGF0YS1wYXRoPVxcXCIje2ZpbGVQYXRofVxcXCJdXCIpXG4gICAgJGVsLnJlbW92ZUNsYXNzKCdiZWF1dGlmeWluZycpXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcmVzdWx0KVxuXG4gICMgR2V0IGNvbnRlbnRzIG9mIGZpbGVcbiAgZnMgPz0gcmVxdWlyZSBcImZzXCJcbiAgbG9nZ2VyLnZlcmJvc2UoJ3JlYWRGaWxlJywgZmlsZVBhdGgpXG4gIGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAoZXJyLCBkYXRhKSAtPlxuICAgIGxvZ2dlci52ZXJib3NlKCdyZWFkRmlsZSBjb21wbGV0ZWQnLCBlcnIsIGZpbGVQYXRoKVxuICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgIGlucHV0ID0gZGF0YT8udG9TdHJpbmcoKVxuICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIoZmlsZVBhdGgsIGlucHV0KVxuICAgIGdyYW1tYXJOYW1lID0gZ3JhbW1hci5uYW1lXG5cbiAgICAjIEdldCB0aGUgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGZpbGVQYXRoKVxuICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoIGFsbE9wdGlvbnMnLCBhbGxPcHRpb25zKVxuXG4gICAgIyBCZWF1dGlmeSBGaWxlXG4gICAgY29tcGxldGlvbkZ1biA9IChvdXRwdXQpIC0+XG4gICAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCBjb21wbGV0aW9uRnVuJywgb3V0cHV0KVxuICAgICAgaWYgb3V0cHV0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgcmV0dXJuIGNiKG91dHB1dCwgbnVsbCApICMgb3V0cHV0ID09IEVycm9yXG4gICAgICBlbHNlIGlmIHR5cGVvZiBvdXRwdXQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAjIGRvIG5vdCBhbGxvdyBlbXB0eSBzdHJpbmdcbiAgICAgICAgaWYgb3V0cHV0LnRyaW0oKSBpcyAnJ1xuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoLCBvdXRwdXQgd2FzIGVtcHR5IHN0cmluZyEnKVxuICAgICAgICAgIHJldHVybiBjYihudWxsLCBvdXRwdXQpXG4gICAgICAgICMgc2F2ZSB0byBmaWxlXG4gICAgICAgIGZzLndyaXRlRmlsZShmaWxlUGF0aCwgb3V0cHV0LCAoZXJyKSAtPlxuICAgICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICAgIHJldHVybiBjYiggbnVsbCAsIG91dHB1dClcbiAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gY2IoIG5ldyBFcnJvcihcIlVua25vd24gYmVhdXRpZmljYXRpb24gcmVzdWx0ICN7b3V0cHV0fS5cIiksIG91dHB1dClcbiAgICB0cnlcbiAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeScsIGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KGlucHV0LCBhbGxPcHRpb25zLCBncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgICAudGhlbihjb21wbGV0aW9uRnVuKVxuICAgICAgLmNhdGNoKGNvbXBsZXRpb25GdW4pXG4gICAgY2F0Y2ggZVxuICAgICAgcmV0dXJuIGNiKGUpXG4gICAgKVxuXG5iZWF1dGlmeUZpbGUgPSAoe3RhcmdldH0pIC0+XG4gIGZpbGVQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICByZXR1cm4gdW5sZXNzIGZpbGVQYXRoXG4gIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIChlcnIsIHJlc3VsdCkgLT5cbiAgICByZXR1cm4gc2hvd0Vycm9yKGVycikgaWYgZXJyXG4gICAgIyBjb25zb2xlLmxvZyhcIkJlYXV0aWZ5IEZpbGVcbiAgKVxuICByZXR1cm5cblxuYmVhdXRpZnlEaXJlY3RvcnkgPSAoe3RhcmdldH0pIC0+XG4gIGRpclBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gIHJldHVybiB1bmxlc3MgZGlyUGF0aFxuXG4gIHJldHVybiBpZiBhdG9tPy5jb25maXJtKFxuICAgIG1lc3NhZ2U6IFwiVGhpcyB3aWxsIGJlYXV0aWZ5IGFsbCBvZiB0aGUgZmlsZXMgZm91bmQgXFxcbiAgICAgICAgcmVjdXJzaXZlbHkgaW4gdGhpcyBkaXJlY3RvcnksICcje2RpclBhdGh9Jy4gXFxcbiAgICAgICAgRG8geW91IHdhbnQgdG8gY29udGludWU/XCIsXG4gICAgYnV0dG9uczogWydZZXMsIGNvbnRpbnVlIScsJ05vLCBjYW5jZWwhJ10pIGlzbnQgMFxuXG4gICMgU2hvdyBpbiBwcm9ncmVzcyBpbmRpY2F0ZSBvbiBkaXJlY3RvcnkncyB0cmVlLXZpZXcgZW50cnlcbiAgJCA/PSByZXF1aXJlKFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIikuJFxuICAkZWwgPSAkKFwiLmljb24tZmlsZS1kaXJlY3RvcnlbZGF0YS1wYXRoPVxcXCIje2RpclBhdGh9XFxcIl1cIilcbiAgJGVsLmFkZENsYXNzKCdiZWF1dGlmeWluZycpXG5cbiAgIyBQcm9jZXNzIERpcmVjdG9yeVxuICBkaXIgPz0gcmVxdWlyZSBcIm5vZGUtZGlyXCJcbiAgYXN5bmMgPz0gcmVxdWlyZSBcImFzeW5jXCJcbiAgZGlyLmZpbGVzKGRpclBhdGgsIChlcnIsIGZpbGVzKSAtPlxuICAgIHJldHVybiBzaG93RXJyb3IoZXJyKSBpZiBlcnJcblxuICAgIGFzeW5jLmVhY2goZmlsZXMsIChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gICAgICAjIElnbm9yZSBlcnJvcnNcbiAgICAgIGJlYXV0aWZ5RmlsZVBhdGgoZmlsZVBhdGgsIC0+IGNhbGxiYWNrKCkpXG4gICAgLCAoZXJyKSAtPlxuICAgICAgJGVsID0gJChcIi5pY29uLWZpbGUtZGlyZWN0b3J5W2RhdGEtcGF0aD1cXFwiI3tkaXJQYXRofVxcXCJdXCIpXG4gICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcbiAgICAgICMgY29uc29sZS5sb2coJ0NvbXBsZXRlZCBiZWF1dGlmeWluZyBkaXJlY3RvcnkhJywgZGlyUGF0aClcbiAgICApXG4gIClcbiAgcmV0dXJuXG5cbmRlYnVnID0gKCkgLT5cbiAgdHJ5XG4gICAgb3BlbiA9IHJlcXVpcmUoXCJvcGVuXCIpXG4gICAgZnMgPz0gcmVxdWlyZSBcImZzXCJcblxuICAgIHBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucygpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgbGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgdGl0bGUgPSB0aXRsZS50b0xvd2VyQ2FzZSgpXG4gICAgICBwID0gdGl0bGUuc3BsaXQoL1tcXHMsKyM7LFxcLz86QCY9KyRdKy8pICMgc3BsaXQgaW50byBwYXJ0c1xuICAgICAgc2VwID0gXCItXCJcbiAgICAgIHAuam9pbihzZXApXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIGNvbmZpcm0oXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC5cXG5cIiArXG4gICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIilcbiAgICByZXR1cm4gdW5sZXNzIGNvbmZpcm0oJ0FyZSB5b3UgcmVhZHkgdG8gZGVidWcgQXRvbSBCZWF1dGlmeT8nKVxuICAgIGRlYnVnSW5mbyA9IFwiXCJcbiAgICBoZWFkZXJzID0gW11cbiAgICB0b2NFbCA9IFwiPFRBQkxFT0ZDT05URU5UUy8+XCJcbiAgICBhZGRJbmZvID0gKGtleSwgdmFsKSAtPlxuICAgICAgaWYga2V5P1xuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIqKiN7a2V5fSoqOiAje3ZhbH1cXG5cXG5cIlxuICAgICAgZWxzZVxuICAgICAgICBkZWJ1Z0luZm8gKz0gXCIje3ZhbH1cXG5cXG5cIlxuICAgIGFkZEhlYWRlciA9IChsZXZlbCwgdGl0bGUpIC0+XG4gICAgICBkZWJ1Z0luZm8gKz0gXCIje0FycmF5KGxldmVsKzEpLmpvaW4oJyMnKX0gI3t0aXRsZX1cXG5cXG5cIlxuICAgICAgaGVhZGVycy5wdXNoKHtcbiAgICAgICAgbGV2ZWwsIHRpdGxlXG4gICAgICAgIH0pXG4gICAgYWRkSGVhZGVyKDEsIFwiQXRvbSBCZWF1dGlmeSAtIERlYnVnZ2luZyBpbmZvcm1hdGlvblwiKVxuICAgIGRlYnVnSW5mbyArPSBcIlRoZSBmb2xsb3dpbmcgZGVidWdnaW5nIGluZm9ybWF0aW9uIHdhcyBcIiArXG4gICAgXCJnZW5lcmF0ZWQgYnkgYEF0b20gQmVhdXRpZnlgIG9uIGAje25ldyBEYXRlKCl9YC5cIiArXG4gICAgXCJcXG5cXG4tLS1cXG5cXG5cIiArXG4gICAgdG9jRWwgK1xuICAgIFwiXFxuXFxuLS0tXFxuXFxuXCJcblxuICAgICMgUGxhdGZvcm1cbiAgICBhZGRJbmZvKCdQbGF0Zm9ybScsIHByb2Nlc3MucGxhdGZvcm0pXG4gICAgYWRkSGVhZGVyKDIsIFwiVmVyc2lvbnNcIilcblxuXG4gICAgIyBBdG9tIFZlcnNpb25cbiAgICBhZGRJbmZvKCdBdG9tIFZlcnNpb24nLCBhdG9tLmFwcFZlcnNpb24pXG5cblxuICAgICMgQXRvbSBCZWF1dGlmeSBWZXJzaW9uXG4gICAgYWRkSW5mbygnQXRvbSBCZWF1dGlmeSBWZXJzaW9uJywgcGtnLnZlcnNpb24pXG4gICAgYWRkSGVhZGVyKDIsIFwiT3JpZ2luYWwgZmlsZSB0byBiZSBiZWF1dGlmaWVkXCIpXG5cblxuICAgICMgT3JpZ2luYWwgZmlsZVxuICAgICNcbiAgICAjIEdldCBlZGl0b3IgcGF0aCBhbmQgY29uZmlndXJhdGlvbnMgZm9yIHBhdGhzXG4gICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAjIFBhdGhcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIFBhdGgnLCBcImAje2ZpbGVQYXRofWBcIilcblxuICAgICMgR2V0IEdyYW1tYXJcbiAgICBncmFtbWFyTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuXG4gICAgIyBHcmFtbWFyXG4gICAgYWRkSW5mbygnT3JpZ2luYWwgRmlsZSBHcmFtbWFyJywgZ3JhbW1hck5hbWUpXG5cbiAgICAjIExhbmd1YWdlXG4gICAgbGFuZ3VhZ2UgPSBiZWF1dGlmaWVyLmdldExhbmd1YWdlKGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIExhbmd1YWdlJywgbGFuZ3VhZ2U/Lm5hbWUpXG4gICAgYWRkSW5mbygnTGFuZ3VhZ2UgbmFtZXNwYWNlJywgbGFuZ3VhZ2U/Lm5hbWVzcGFjZSlcblxuICAgICMgQmVhdXRpZmllclxuICAgIGJlYXV0aWZpZXJzID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVycyhsYW5ndWFnZS5uYW1lKVxuICAgIGFkZEluZm8oJ1N1cHBvcnRlZCBCZWF1dGlmaWVycycsIF8ubWFwKGJlYXV0aWZpZXJzLCAnbmFtZScpLmpvaW4oJywgJykpXG4gICAgc2VsZWN0ZWRCZWF1dGlmaWVyID0gYmVhdXRpZmllci5nZXRCZWF1dGlmaWVyRm9yTGFuZ3VhZ2UobGFuZ3VhZ2UpXG4gICAgYWRkSW5mbygnU2VsZWN0ZWQgQmVhdXRpZmllcicsIHNlbGVjdGVkQmVhdXRpZmllci5uYW1lKVxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3IncyB0ZXh0XG4gICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCkgb3IgXCJcIlxuXG4gICAgIyBDb250ZW50c1xuICAgIGNvZGVCbG9ja1N5bnRheCA9IChsYW5ndWFnZT8ubmFtZSA/IGdyYW1tYXJOYW1lKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJylbMF1cbiAgICBhZGRIZWFkZXIoMywgJ09yaWdpbmFsIEZpbGUgQ29udGVudHMnKVxuICAgIGFkZEluZm8obnVsbCwgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je3RleHR9XFxuYGBgXCIpXG5cbiAgICBhZGRIZWFkZXIoMywgJ1BhY2thZ2UgU2V0dGluZ3MnKVxuICAgIGFkZEluZm8obnVsbCxcbiAgICAgIFwiVGhlIHJhdyBwYWNrYWdlIHNldHRpbmdzIG9wdGlvbnNcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuXG4gICAgIyBCZWF1dGlmaWNhdGlvbiBPcHRpb25zXG4gICAgYWRkSGVhZGVyKDIsIFwiQmVhdXRpZmljYXRpb24gb3B0aW9uc1wiKVxuICAgICMgR2V0IGFsbCBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZmlsZVBhdGgsIGVkaXRvcilcbiAgICAjIFJlc29sdmUgb3B0aW9ucyB3aXRoIHByb21pc2VzXG4gICAgUHJvbWlzZS5hbGwoYWxsT3B0aW9ucylcbiAgICAudGhlbigoYWxsT3B0aW9ucykgLT5cbiAgICAgICMgRXh0cmFjdCBvcHRpb25zXG4gICAgICBbXG4gICAgICAgICAgZWRpdG9yT3B0aW9uc1xuICAgICAgICAgIGNvbmZpZ09wdGlvbnNcbiAgICAgICAgICBob21lT3B0aW9uc1xuICAgICAgICAgIGVkaXRvckNvbmZpZ09wdGlvbnNcbiAgICAgIF0gPSBhbGxPcHRpb25zXG4gICAgICBwcm9qZWN0T3B0aW9ucyA9IGFsbE9wdGlvbnNbNC4uXVxuXG4gICAgICBwcmVUcmFuc2Zvcm1lZE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JMYW5ndWFnZShhbGxPcHRpb25zLCBsYW5ndWFnZSlcblxuICAgICAgaWYgc2VsZWN0ZWRCZWF1dGlmaWVyXG4gICAgICAgIGZpbmFsT3B0aW9ucyA9IGJlYXV0aWZpZXIudHJhbnNmb3JtT3B0aW9ucyhzZWxlY3RlZEJlYXV0aWZpZXIsIGxhbmd1YWdlLm5hbWUsIHByZVRyYW5zZm9ybWVkT3B0aW9ucylcblxuICAgICAgIyBTaG93IG9wdGlvbnNcbiAgICAgICMgYWRkSW5mbygnQWxsIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgICMgXCJBbGwgb3B0aW9ucyBleHRyYWN0ZWQgZm9yIGZpbGVcXG5cIiArXG4gICAgICAjIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoYWxsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0VkaXRvciBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEVkaXRvciBzZXR0aW5nc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZWRpdG9yT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0NvbmZpZyBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3NcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGNvbmZpZ09wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdIb21lIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIGAje3BhdGgucmVzb2x2ZShiZWF1dGlmaWVyLmdldFVzZXJIb21lKCksICcuanNiZWF1dGlmeXJjJyl9YFxcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoaG9tZU9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdFZGl0b3JDb25maWcgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gW0VkaXRvckNvbmZpZ10oaHR0cDovL2VkaXRvcmNvbmZpZy5vcmcvKSBmaWxlXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShlZGl0b3JDb25maWdPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnUHJvamVjdCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBgLmpzYmVhdXRpZnlyY2AgZmlsZXMgc3RhcnRpbmcgZnJvbSBkaXJlY3RvcnkgYCN7cGF0aC5kaXJuYW1lKGZpbGVQYXRoKX1gIGFuZCBnb2luZyB1cCB0byByb290XFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcm9qZWN0T3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ1ByZS1UcmFuc2Zvcm1lZCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIkNvbWJpbmVkIG9wdGlvbnMgYmVmb3JlIHRyYW5zZm9ybWluZyB0aGVtIGdpdmVuIGEgYmVhdXRpZmllcidzIHNwZWNpZmljYXRpb25zXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShwcmVUcmFuc2Zvcm1lZE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXJcbiAgICAgICAgYWRkSGVhZGVyKDMsICdGaW5hbCBPcHRpb25zJylcbiAgICAgICAgYWRkSW5mbyhudWxsLFxuICAgICAgICAgIFwiRmluYWwgY29tYmluZWQgYW5kIHRyYW5zZm9ybWVkIG9wdGlvbnMgdGhhdCBhcmUgdXNlZFxcblwiICtcbiAgICAgICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGZpbmFsT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcblxuICAgICAgI1xuICAgICAgbG9ncyA9IFwiXCJcbiAgICAgIGxvZ0ZpbGVQYXRoUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcOiBcXFxcWyguKilcXFxcXScpXG4gICAgICBzdWJzY3JpcHRpb24gPSBsb2dnZXIub25Mb2dnaW5nKChtc2cpIC0+XG4gICAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBtc2cpXG4gICAgICAgIHNlcCA9IHBhdGguc2VwXG4gICAgICAgIGxvZ3MgKz0gbXNnLnJlcGxhY2UobG9nRmlsZVBhdGhSZWdleCwgKGEsYikgLT5cbiAgICAgICAgICBzID0gYi5zcGxpdChzZXApXG4gICAgICAgICAgaSA9IHMuaW5kZXhPZignYXRvbS1iZWF1dGlmeScpXG4gICAgICAgICAgcCA9IHMuc2xpY2UoaSsyKS5qb2luKHNlcClcbiAgICAgICAgICAjIGNvbnNvbGUubG9nKCdsb2dnaW5nJywgYXJndW1lbnRzLCBzLCBpLCBwKVxuICAgICAgICAgIHJldHVybiAnOiBbJytwKyddJ1xuICAgICAgICApXG4gICAgICApXG4gICAgICBjYiA9IChyZXN1bHQpIC0+XG4gICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgYWRkSGVhZGVyKDIsIFwiUmVzdWx0c1wiKVxuXG4gICAgICAgICMgTG9nc1xuICAgICAgICBhZGRJbmZvKCdCZWF1dGlmaWVkIEZpbGUgQ29udGVudHMnLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7cmVzdWx0fVxcbmBgYFwiKVxuICAgICAgICAjIERpZmZcbiAgICAgICAgSnNEaWZmID0gcmVxdWlyZSgnZGlmZicpXG4gICAgICAgIGlmIHR5cGVvZiByZXN1bHQgaXMgXCJzdHJpbmdcIlxuICAgICAgICAgIGRpZmYgPSBKc0RpZmYuY3JlYXRlUGF0Y2goZmlsZVBhdGggb3IgXCJcIiwgdGV4dCBvciBcIlwiLCBcXFxuICAgICAgICAgICAgcmVzdWx0IG9yIFwiXCIsIFwib3JpZ2luYWxcIiwgXCJiZWF1dGlmaWVkXCIpXG4gICAgICAgICAgYWRkSW5mbygnT3JpZ2luYWwgdnMuIEJlYXV0aWZpZWQgRGlmZicsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3tkaWZmfVxcbmBgYFwiKVxuXG4gICAgICAgIGFkZEhlYWRlcigzLCBcIkxvZ3NcIilcbiAgICAgICAgYWRkSW5mbyhudWxsLCBcImBgYFxcbiN7bG9nc31cXG5gYGBcIilcblxuICAgICAgICAjIEJ1aWxkIFRhYmxlIG9mIENvbnRlbnRzXG4gICAgICAgIHRvYyA9IFwiIyMgVGFibGUgT2YgQ29udGVudHNcXG5cIlxuICAgICAgICBmb3IgaGVhZGVyIGluIGhlYWRlcnNcbiAgICAgICAgICAjIyNcbiAgICAgICAgICAtIEhlYWRpbmcgMVxuICAgICAgICAgICAgLSBIZWFkaW5nIDEuMVxuICAgICAgICAgICMjI1xuICAgICAgICAgIGluZGVudCA9IFwiICBcIiAjIDIgc3BhY2VzXG4gICAgICAgICAgYnVsbGV0ID0gXCItXCJcbiAgICAgICAgICBpbmRlbnROdW0gPSBoZWFkZXIubGV2ZWwgLSAyXG4gICAgICAgICAgaWYgaW5kZW50TnVtID49IDBcbiAgICAgICAgICAgIHRvYyArPSAoXCIje0FycmF5KGluZGVudE51bSsxKS5qb2luKGluZGVudCl9I3tidWxsZXR9IFsje2hlYWRlci50aXRsZX1dKFxcIyN7bGlua2lmeVRpdGxlKGhlYWRlci50aXRsZSl9KVxcblwiKVxuICAgICAgICAjIFJlcGxhY2UgVEFCTEVPRkNPTlRFTlRTXG4gICAgICAgIGRlYnVnSW5mbyA9IGRlYnVnSW5mby5yZXBsYWNlKHRvY0VsLCB0b2MpXG5cbiAgICAgICAgIyBTYXZlIHRvIG5ldyBUZXh0RWRpdG9yXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgICAgIC50aGVuKChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChkZWJ1Z0luZm8pXG4gICAgICAgICAgICBjb25maXJtKFwiXCJcIlBsZWFzZSBsb2dpbiB0byBHaXRIdWIgYW5kIGNyZWF0ZSBhIEdpc3QgbmFtZWQgXFxcImRlYnVnLm1kXFxcIiAoTWFya2Rvd24gZmlsZSkgd2l0aCB5b3VyIGRlYnVnZ2luZyBpbmZvcm1hdGlvbi5cbiAgICAgICAgICAgIFRoZW4gYWRkIGEgbGluayB0byB5b3VyIEdpc3QgaW4geW91ciBHaXRIdWIgSXNzdWUuXG4gICAgICAgICAgICBUaGFuayB5b3UhXG5cbiAgICAgICAgICAgIEdpc3Q6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1xuICAgICAgICAgICAgR2l0SHViIElzc3VlczogaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2lzc3Vlc1xuICAgICAgICAgICAgXCJcIlwiKVxuICAgICAgICAgIClcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSAtPlxuICAgICAgICAgICAgY29uZmlybShcIkFuIGVycm9yIG9jY3VycmVkIHdoZW4gY3JlYXRpbmcgdGhlIEdpc3Q6IFwiK2Vycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgKVxuICAgICAgdHJ5XG4gICAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgICAgICAudGhlbihjYilcbiAgICAgICAgLmNhdGNoKGNiKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZXR1cm4gY2IoZSlcbiAgICApXG4gICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgIHN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlXG4gICAgICB9KVxuICAgIClcbiAgY2F0Y2ggZXJyb3JcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20/Lm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKGVycm9yLm1lc3NhZ2UsIHtcbiAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgIH0pXG5cbmhhbmRsZVNhdmVFdmVudCA9IC0+XG4gIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgIHBlbmRpbmdQYXRocyA9IHt9XG4gICAgYmVhdXRpZnlPblNhdmVIYW5kbGVyID0gKHtwYXRoOiBmaWxlUGF0aH0pIC0+XG4gICAgICBsb2dnZXIudmVyYm9zZSgnU2hvdWxkIGJlYXV0aWZ5IG9uIHRoaXMgc2F2ZT8nKVxuICAgICAgaWYgcGVuZGluZ1BhdGhzW2ZpbGVQYXRoXVxuICAgICAgICBsb2dnZXIudmVyYm9zZShcIkVkaXRvciB3aXRoIGZpbGUgcGF0aCAje2ZpbGVQYXRofSBhbHJlYWR5IGJlYXV0aWZpZWQhXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBwYXRoID89IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgIyBHZXQgR3JhbW1hclxuICAgICAgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZVxuICAgICAgIyBHZXQgZmlsZSBleHRlbnNpb25cbiAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpXG4gICAgICAjIFJlbW92ZSBwcmVmaXggXCIuXCIgKHBlcmlvZCkgaW4gZmlsZUV4dGVuc2lvblxuICAgICAgZmlsZUV4dGVuc2lvbiA9IGZpbGVFeHRlbnNpb24uc3Vic3RyKDEpXG4gICAgICAjIEdldCBsYW5ndWFnZVxuICAgICAgbGFuZ3VhZ2VzID0gYmVhdXRpZmllci5sYW5ndWFnZXMuZ2V0TGFuZ3VhZ2VzKHtncmFtbWFyLCBleHRlbnNpb246IGZpbGVFeHRlbnNpb259KVxuICAgICAgaWYgbGFuZ3VhZ2VzLmxlbmd0aCA8IDFcbiAgICAgICAgcmV0dXJuXG4gICAgICAjIFRPRE86IHNlbGVjdCBhcHByb3ByaWF0ZSBsYW5ndWFnZVxuICAgICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZXNbMF1cbiAgICAgICMgR2V0IGxhbmd1YWdlIGNvbmZpZ1xuICAgICAga2V5ID0gXCJhdG9tLWJlYXV0aWZ5LiN7bGFuZ3VhZ2UubmFtZXNwYWNlfS5iZWF1dGlmeV9vbl9zYXZlXCJcbiAgICAgIGJlYXV0aWZ5T25TYXZlID0gYXRvbS5jb25maWcuZ2V0KGtleSlcbiAgICAgIGxvZ2dlci52ZXJib3NlKCdzYXZlIGVkaXRvciBwb3NpdGlvbnMnLCBrZXksIGJlYXV0aWZ5T25TYXZlKVxuICAgICAgaWYgYmVhdXRpZnlPblNhdmVcbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ0JlYXV0aWZ5aW5nIGZpbGUnLCBmaWxlUGF0aClcbiAgICAgICAgYmVhdXRpZnkoe2VkaXRvciwgb25TYXZlOiB0cnVlfSlcbiAgICAgICAgLnRoZW4oKCkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnRG9uZSBiZWF1dGlmeWluZyBmaWxlJywgZmlsZVBhdGgpXG4gICAgICAgICAgaWYgZWRpdG9yLmlzQWxpdmUoKSBpcyB0cnVlXG4gICAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnU2F2aW5nIFRleHRFZGl0b3IuLi4nKVxuICAgICAgICAgICAgIyBTdG9yZSB0aGUgZmlsZVBhdGggdG8gcHJldmVudCBpbmZpbml0ZSBsb29waW5nXG4gICAgICAgICAgICAjIFdoZW4gV2hpdGVzcGFjZSBwYWNrYWdlIGhhcyBvcHRpb24gXCJFbnN1cmUgU2luZ2xlIFRyYWlsaW5nIE5ld2xpbmVcIiBlbmFibGVkXG4gICAgICAgICAgICAjIEl0IHdpbGwgYWRkIGEgbmV3bGluZSBhbmQga2VlcCB0aGUgZmlsZSBmcm9tIGNvbnZlcmdpbmcgb24gYSBiZWF1dGlmaWVkIGZvcm1cbiAgICAgICAgICAgICMgYW5kIHNhdmluZyB3aXRob3V0IGVtaXR0aW5nIG9uRGlkU2F2ZSBldmVudCwgYmVjYXVzZSB0aGVyZSB3ZXJlIG5vIGNoYW5nZXMuXG4gICAgICAgICAgICBwZW5kaW5nUGF0aHNbZmlsZVBhdGhdID0gdHJ1ZVxuICAgICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgZGVsZXRlIHBlbmRpbmdQYXRoc1tmaWxlUGF0aF1cbiAgICAgICAgICAgIGxvZ2dlci52ZXJib3NlKCdTYXZlZCBUZXh0RWRpdG9yLicpXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGVycm9yKVxuICAgICAgICApXG4gICAgZGlzcG9zYWJsZSA9IGVkaXRvci5vbkRpZFNhdmUoKHtwYXRoIDogZmlsZVBhdGh9KSAtPlxuICAgICAgIyBUT0RPOiBJbXBsZW1lbnQgZGVib3VuY2luZ1xuICAgICAgYmVhdXRpZnlPblNhdmVIYW5kbGVyKHtwYXRoOiBmaWxlUGF0aH0pXG4gICAgKVxuICAgIHBsdWdpbi5zdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NhYmxlXG5cbmdldFVuc3VwcG9ydGVkT3B0aW9ucyA9IC0+XG4gIHNldHRpbmdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWJlYXV0aWZ5JylcbiAgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKCdhdG9tLWJlYXV0aWZ5JylcbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gXy5maWx0ZXIoXy5rZXlzKHNldHRpbmdzKSwgKGtleSkgLT5cbiAgICAjIHJldHVybiBhdG9tLmNvbmZpZy5nZXRTY2hlbWEoXCJhdG9tLWJlYXV0aWZ5LiR7a2V5fVwiKS50eXBlXG4gICAgIyByZXR1cm4gdHlwZW9mIHNldHRpbmdzW2tleV1cbiAgICBzY2hlbWEucHJvcGVydGllc1trZXldIGlzIHVuZGVmaW5lZFxuICApXG4gIHJldHVybiB1bnN1cHBvcnRlZE9wdGlvbnNcblxucGx1Z2luLmNoZWNrVW5zdXBwb3J0ZWRPcHRpb25zID0gLT5cbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gZ2V0VW5zdXBwb3J0ZWRPcHRpb25zKClcbiAgaWYgdW5zdXBwb3J0ZWRPcHRpb25zLmxlbmd0aCBpc250IDBcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcIlBsZWFzZSBydW4gQXRvbSBjb21tYW5kICdBdG9tLUJlYXV0aWZ5OiBNaWdyYXRlIFNldHRpbmdzJy5cIiwge1xuICAgICAgZGV0YWlsIDogXCJZb3UgY2FuIG9wZW4gdGhlIEF0b20gY29tbWFuZCBwYWxldHRlIHdpdGggYGNtZC1zaGlmdC1wYCAoT1NYKSBvciBgY3RybC1zaGlmdC1wYCAoTGludXgvV2luZG93cykgaW4gQXRvbS4gWW91IGhhdmUgdW5zdXBwb3J0ZWQgb3B0aW9uczogI3t1bnN1cHBvcnRlZE9wdGlvbnMuam9pbignLCAnKX1cIixcbiAgICAgIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgIH0pXG5cbnBsdWdpbi5taWdyYXRlU2V0dGluZ3MgPSAtPlxuICB1bnN1cHBvcnRlZE9wdGlvbnMgPSBnZXRVbnN1cHBvcnRlZE9wdGlvbnMoKVxuICBuYW1lc3BhY2VzID0gYmVhdXRpZmllci5sYW5ndWFnZXMubmFtZXNwYWNlc1xuICAjIGNvbnNvbGUubG9nKCdtaWdyYXRlLXNldHRpbmdzJywgc2NoZW1hLCBuYW1lc3BhY2VzLCB1bnN1cHBvcnRlZE9wdGlvbnMpXG4gIGlmIHVuc3VwcG9ydGVkT3B0aW9ucy5sZW5ndGggaXMgMFxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiTm8gb3B0aW9ucyB0byBtaWdyYXRlLlwiKVxuICBlbHNlXG4gICAgcmV4ID0gbmV3IFJlZ0V4cChcIigje25hbWVzcGFjZXMuam9pbignfCcpfSlfKC4qKVwiKVxuICAgIHJlbmFtZSA9IF8udG9QYWlycyhfLnppcE9iamVjdCh1bnN1cHBvcnRlZE9wdGlvbnMsIF8ubWFwKHVuc3VwcG9ydGVkT3B0aW9ucywgKGtleSkgLT5cbiAgICAgIG0gPSBrZXkubWF0Y2gocmV4KVxuICAgICAgaWYgbSBpcyBudWxsXG4gICAgICAgICMgRGlkIG5vdCBtYXRjaFxuICAgICAgICAjIFB1dCBpbnRvIGdlbmVyYWxcbiAgICAgICAgcmV0dXJuIFwiZ2VuZXJhbC4je2tleX1cIlxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gXCIje21bMV19LiN7bVsyXX1cIlxuICAgICkpKVxuICAgICMgY29uc29sZS5sb2coJ3JlbmFtZScsIHJlbmFtZSlcbiAgICAjIGxvZ2dlci52ZXJib3NlKCdyZW5hbWUnLCByZW5hbWUpXG5cbiAgICAjIE1vdmUgYWxsIG9wdGlvbiB2YWx1ZXMgdG8gcmVuYW1lZCBrZXlcbiAgICBfLmVhY2gocmVuYW1lLCAoW2tleSwgbmV3S2V5XSkgLT5cbiAgICAgICMgQ29weSB0byBuZXcga2V5XG4gICAgICB2YWwgPSBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LiN7a2V5fVwiKVxuICAgICAgIyBjb25zb2xlLmxvZygncmVuYW1lJywga2V5LCBuZXdLZXksIHZhbClcbiAgICAgIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3tuZXdLZXl9XCIsIHZhbClcbiAgICAgICMgRGVsZXRlIG9sZCBrZXlcbiAgICAgIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3trZXl9XCIsIHVuZGVmaW5lZClcbiAgICApXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJTdWNjZXNzZnVsbHkgbWlncmF0ZWQgb3B0aW9uczogI3t1bnN1cHBvcnRlZE9wdGlvbnMuam9pbignLCAnKX1cIilcblxucGx1Z2luLmNvbmZpZyA9IF8ubWVyZ2UocmVxdWlyZSgnLi9jb25maWcuY29mZmVlJyksIGRlZmF1bHRMYW5ndWFnZU9wdGlvbnMpXG5wbHVnaW4uYWN0aXZhdGUgPSAtPlxuICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIEBzdWJzY3JpcHRpb25zLmFkZCBoYW5kbGVTYXZlRXZlbnQoKVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktZWRpdG9yXCIsIGJlYXV0aWZ5XG4gIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiYXRvbS1iZWF1dGlmeTpoZWxwLWRlYnVnLWVkaXRvclwiLCBkZWJ1Z1xuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5maWxlIC5uYW1lXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1maWxlXCIsIGJlYXV0aWZ5RmlsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCIudHJlZS12aWV3IC5kaXJlY3RvcnkgLm5hbWVcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWRpcmVjdG9yeVwiLCBiZWF1dGlmeURpcmVjdG9yeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6bWlncmF0ZS1zZXR0aW5nc1wiLCBwbHVnaW4ubWlncmF0ZVNldHRpbmdzXG5cbnBsdWdpbi5kZWFjdGl2YXRlID0gLT5cbiAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4iXX0=

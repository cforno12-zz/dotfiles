(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, ref, scopeFromFileName,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], ColorBuffer = ref[0], ColorSearch = ref[1], Palette = ref[2], VariablesCollection = ref[3], PathsLoader = ref[4], PathsScanner = ref[5], Emitter = ref[6], CompositeDisposable = ref[7], Range = ref[8], SERIALIZE_VERSION = ref[9], SERIALIZE_MARKERS_VERSION = ref[10], THEME_VARIABLES = ref[11], ATOM_VARIABLES = ref[12], scopeFromFileName = ref[13], minimatch = ref[14];

  compareArray = function(a, b) {
    var i, j, len, v;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = j = 0, len = a.length; j < len; i = ++j) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if (atom.inDevMode() && atom.project.getPaths().some(function(p) {
        return p.match(/\/pigments$/);
      })) {
        markersVersion += '-dev';
      }
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, ref1, svgColorExpression, timestamp, variables;
      if (state == null) {
        state = {};
      }
      if (Emitter == null) {
        ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
      }
      if (VariablesCollection == null) {
        VariablesCollection = require('./variables-collection');
      }
      this.includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.bufferStates = buffers != null ? buffers : {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredBufferNames', (function(_this) {
        return function(ignoredBufferNames) {
          _this.ignoredBufferNames = ignoredBufferNames;
          return _this.updateColorBuffers();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sassShadeAndTintImplementation', (function(_this) {
        return function() {
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      svgColorExpression = this.colorExpressionsRegistry.getExpression('pigments:named_colors');
      this.subscriptions.add(atom.config.observe('pigments.filetypesForColorWords', (function(_this) {
        return function(scopes) {
          svgColorExpression.scopes = scopes != null ? scopes : [];
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            name: svgColorExpression.name,
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(arg) {
          var name;
          name = arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          return _this.variables.evaluateVariables(_this.variables.getVariables(), function() {
            var colorBuffer, id, ref2, results1;
            ref2 = _this.colorBuffersByEditorId;
            results1 = [];
            for (id in ref2) {
              colorBuffer = ref2[id];
              results1.push(colorBuffer.update());
            }
            return results1;
          });
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      this.updateIgnoredFiletypes();
      if (this.paths != null) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = new Promise((function(_this) {
        return function(resolve) {
          return _this.variables.onceInitialized(resolve);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (_this.includeThemes) {
            return _this.includeThemesVariables();
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, ref1;
      if (this.destroyed) {
        return;
      }
      if (PathsScanner == null) {
        PathsScanner = require('./paths-scanner');
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.reload = function() {
      return this.initialize().then((function(_this) {
        return function() {
          _this.variables.reset();
          _this.paths = [];
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (atom.config.get('pigments.notifyReloads')) {
            return atom.notifications.addSuccess("Pigments successfully reloaded", {
              dismissable: atom.config.get('pigments.dismissableReloadNotifications'),
              description: "Found:\n- **" + _this.paths.length + "** path(s)\n- **" + (_this.getVariables().length) + "** variables(s) including **" + (_this.getColorVariables().length) + "** color(s)"
            });
          } else {
            return console.log("Found:\n- " + _this.paths.length + " path(s)\n- " + (_this.getVariables().length) + " variables(s) including " + (_this.getColorVariables().length) + " color(s)");
          }
        };
      })(this))["catch"](function(reason) {
        var detail, stack;
        detail = reason.message;
        stack = reason.stack;
        atom.notifications.addError("Pigments couldn't be reloaded", {
          detail: detail,
          stack: stack,
          dismissable: true
        });
        return console.error(reason);
      });
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, path, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (j = 0, len = dirtied.length; j < len; j++) {
              path = dirtied[j];
              if (indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      if (ColorSearch == null) {
        ColorSearch = require('./color-search');
      }
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        project: this,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.setColorPickerAPI = function(colorPickerAPI) {
      this.colorPickerAPI = colorPickerAPI;
    };

    ColorProject.prototype.initializeBuffers = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement, editorPath;
          editorPath = editor.getPath();
          if ((editorPath == null) || _this.isBufferIgnored(editorPath)) {
            return;
          }
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.hasColorBufferForEditor = function(editor) {
      if (this.destroyed || (editor == null)) {
        return false;
      }
      return this.colorBuffersByEditorId[editor.id] != null;
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (ColorBuffer == null) {
        ColorBuffer = require('./color-buffer');
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.updateColorBuffers = function() {
      var buffer, bufferElement, e, editor, id, j, len, ref1, ref2, results1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        if (this.isBufferIgnored(buffer.editor.getPath())) {
          buffer.destroy();
          delete this.colorBuffersByEditorId[id];
        }
      }
      try {
        if (this.colorBuffersByEditorId != null) {
          ref2 = atom.workspace.getTextEditors();
          results1 = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            editor = ref2[j];
            if (this.hasColorBufferForEditor(editor) || this.isBufferIgnored(editor.getPath())) {
              continue;
            }
            buffer = this.colorBufferForEditor(editor);
            if (buffer != null) {
              bufferElement = atom.views.getView(buffer);
              results1.push(bufferElement.attach());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }
      } catch (error) {
        e = error;
        return console.log(e);
      }
    };

    ColorProject.prototype.isBufferIgnored = function(path) {
      var j, len, ref1, source, sources;
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = (ref1 = this.ignoredBufferNames) != null ? ref1 : [];
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
      return false;
    };

    ColorProject.prototype.getPaths = function() {
      var ref1;
      return (ref1 = this.paths) != null ? ref1.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.hasPath = function(path) {
      var ref1;
      return indexOf.call((ref1 = this.paths) != null ? ref1 : [], path) >= 0;
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      if (PathsLoader == null) {
        PathsLoader = require('./paths-loader');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, ref1, rootPaths;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (ref1 = _this.paths) != null ? ref1 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, j, len, p;
            for (j = 0, len = knownPaths.length; j < len; j++) {
              p = knownPaths[j];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, p, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return indexOf.call(removed, p) < 0;
          });
          for (j = 0, len = dirtied.length; j < len; j++) {
            p = dirtied[j];
            if (indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var j, len, source, sources;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, j, len;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (j = 0, len = ignoredNames.length; j < len; j++) {
        ignore = ignoredNames[j];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.scopeFromFileName = function(path) {
      var scope;
      if (scopeFromFileName == null) {
        scopeFromFileName = require('./scope-from-file-name');
      }
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.getSassScopeSuffix()].join(':');
      }
      return scope;
    };

    ColorProject.prototype.getPalette = function() {
      if (Palette == null) {
        Palette = require('./palette');
      }
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange, ref1;
        if (Range == null) {
          ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
        }
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        if (PathsScanner == null) {
          PathsScanner = require('./paths-scanner');
        }
        return PathsScanner.startTask(paths.map((function(_this) {
          return function(p) {
            return [p, _this.scopeFromFileName(p)];
          };
        })(this)), this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      if (ATOM_VARIABLES == null) {
        ATOM_VARIABLES = require('./atom-variables');
      }
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSassScopeSuffix = function() {
      var ref1, ref2;
      return (ref1 = (ref2 = this.sassShadeAndTintImplementation) != null ? ref2 : atom.config.get('pigments.sassShadeAndTintImplementation')) != null ? ref1 : 'compass';
    };

    ColorProject.prototype.setSassShadeAndTintImplementation = function(sassShadeAndTintImplementation) {
      this.sassShadeAndTintImplementation = sassShadeAndTintImplementation;
      return this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
        registry: this.colorExpressionsRegistry
      });
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, ref1, ref2;
      names = ['.pigments'];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((ref2 = atom.config.get('pigments.sourceNames')) != null ? ref2 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, ref1, ref2, ref3, ref4;
      names = [];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      names = names.concat((ref2 = this.searchNames) != null ? ref2 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((ref3 = atom.config.get('pigments.sourceNames')) != null ? ref3 : []);
        names = names.concat((ref4 = atom.config.get('pigments.extendedSearchNames')) != null ? ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, ref1, ref2, ref3;
      names = (ref1 = this.ignoredNames) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((ref2 = this.getGlobalIgnoredNames()) != null ? ref2 : []);
        names = names.concat((ref3 = atom.config.get('core.ignoredNames')) != null ? ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var ref1;
      return (ref1 = atom.config.get('pigments.ignoredNames')) != null ? ref1.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames1) {
      this.ignoredNames = ignoredNames1 != null ? ignoredNames1 : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return Promise.reject('Project is not initialized yet');
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var ref1, ref2, scopes;
      scopes = (ref1 = this.ignoredScopes) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((ref2 = atom.config.get('pigments.ignoredScopes')) != null ? ref2 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, ref1, ref2, scopes;
      filetypes = (ref1 = this.supportedFiletypes) != null ? ref1 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((ref2 = atom.config.get('pigments.supportedFiletypes')) != null ? ref2 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var ref3;
        return (ref3 = atom.grammars.selectGrammar("file." + ext)) != null ? ref3.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        return this.includeThemesVariables();
      } else {
        return this.disposeThemesVariables();
      }
    };

    ColorProject.prototype.includeThemesVariables = function() {
      this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          var variables;
          if (!_this.includeThemes) {
            return;
          }
          if (THEME_VARIABLES == null) {
            THEME_VARIABLES = require('./uris').THEME_VARIABLES;
          }
          variables = _this.loadThemesVariables();
          return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
        };
      })(this));
      this.subscriptions.add(this.themesSubscription);
      return this.variables.addMany(this.loadThemesVariables());
    };

    ColorProject.prototype.disposeThemesVariables = function() {
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      this.subscriptions.remove(this.themesSubscription);
      this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
      return this.themesSubscription.dispose();
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, ref1;
      out = {};
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9RQUFBO0lBQUE7O0VBQUEsTUFRSSxFQVJKLEVBQ0Usb0JBREYsRUFDZSxvQkFEZixFQUVFLGdCQUZGLEVBRVcsNEJBRlgsRUFHRSxvQkFIRixFQUdlLHFCQUhmLEVBSUUsZ0JBSkYsRUFJVyw0QkFKWCxFQUlnQyxjQUpoQyxFQUtFLDBCQUxGLEVBS3FCLG1DQUxyQixFQUtnRCx5QkFMaEQsRUFLaUUsd0JBTGpFLEVBTUUsMkJBTkYsRUFPRTs7RUFHRixZQUFBLEdBQWUsU0FBQyxDQUFELEVBQUcsQ0FBSDtBQUNiLFFBQUE7SUFBQSxJQUFvQixXQUFKLElBQWMsV0FBOUI7QUFBQSxhQUFPLE1BQVA7O0lBQ0EsSUFBb0IsQ0FBQyxDQUFDLE1BQUYsS0FBWSxDQUFDLENBQUMsTUFBbEM7QUFBQSxhQUFPLE1BQVA7O0FBQ0EsU0FBQSwyQ0FBQTs7VUFBK0IsQ0FBQSxLQUFPLENBQUUsQ0FBQSxDQUFBO0FBQXhDLGVBQU87O0FBQVA7QUFDQSxXQUFPO0VBSk07O0VBTWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO0FBQ1osVUFBQTtNQUFBLElBQU8seUJBQVA7UUFDRSxPQUFpRCxPQUFBLENBQVEsWUFBUixDQUFqRCxFQUFDLDBDQUFELEVBQW9CLDJEQUR0Qjs7TUFHQSxjQUFBLEdBQWlCO01BQ2pCLElBQTRCLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBQSxJQUFxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLElBQXhCLENBQTZCLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsYUFBUjtNQUFQLENBQTdCLENBQWpEO1FBQUEs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QUFHLDBCQUFIO1FBQ0UsSUFBSSxDQUFDLGFBQUwsR0FBcUIsSUFBQyxDQUFBLGNBRHhCOztNQUVBLElBQUcsMEJBQUg7UUFDRSxJQUFJLENBQUMsYUFBTCxHQUFxQixJQUFDLENBQUEsY0FEeEI7O01BRUEsSUFBRyx5QkFBSDtRQUNFLElBQUksQ0FBQyxZQUFMLEdBQW9CLElBQUMsQ0FBQSxhQUR2Qjs7TUFFQSxJQUFHLHdCQUFIO1FBQ0UsSUFBSSxDQUFDLFdBQUwsR0FBbUIsSUFBQyxDQUFBLFlBRHRCOztNQUVBLElBQUcsd0JBQUg7UUFDRSxJQUFJLENBQUMsV0FBTCxHQUFtQixJQUFDLENBQUEsWUFEdEI7O01BR0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtNQUVmLElBQUcsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFIO1FBQ0UsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsU0FBTCxHQUFpQixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBQSxFQUZuQjs7YUFJQTtJQXJDUzs7MkJBdUNYLGdCQUFBLEdBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLEdBQUEsR0FBTTtBQUNOO0FBQUEsV0FBQSxVQUFBOztRQUNFLEdBQUksQ0FBQSxFQUFBLENBQUosR0FBVSxXQUFXLENBQUMsU0FBWixDQUFBO0FBRFo7YUFFQTtJQUpnQjs7Ozs7QUE5ckJwQiIsInNvdXJjZXNDb250ZW50IjpbIltcbiAgQ29sb3JCdWZmZXIsIENvbG9yU2VhcmNoLFxuICBQYWxldHRlLCBWYXJpYWJsZXNDb2xsZWN0aW9uLFxuICBQYXRoc0xvYWRlciwgUGF0aHNTY2FubmVyLFxuICBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZSxcbiAgU0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT04sIFRIRU1FX1ZBUklBQkxFUywgQVRPTV9WQVJJQUJMRVMsXG4gIHNjb3BlRnJvbUZpbGVOYW1lLFxuICBtaW5pbWF0Y2hcbl0gPSBbXVxuXG5jb21wYXJlQXJyYXkgPSAoYSxiKSAtPlxuICByZXR1cm4gZmFsc2UgaWYgbm90IGE/IG9yIG5vdCBiP1xuICByZXR1cm4gZmFsc2UgdW5sZXNzIGEubGVuZ3RoIGlzIGIubGVuZ3RoXG4gIHJldHVybiBmYWxzZSBmb3IgdixpIGluIGEgd2hlbiB2IGlzbnQgYltpXVxuICByZXR1cm4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvclByb2plY3RcbiAgQGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+XG4gICAgdW5sZXNzIFNFUklBTElaRV9WRVJTSU9OP1xuICAgICAge1NFUklBTElaRV9WRVJTSU9OLCBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OfSA9IHJlcXVpcmUgJy4vdmVyc2lvbnMnXG5cbiAgICBtYXJrZXJzVmVyc2lvbiA9IFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT05cbiAgICBtYXJrZXJzVmVyc2lvbiArPSAnLWRldicgaWYgYXRvbS5pbkRldk1vZGUoKSBhbmQgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuc29tZSAocCkgLT4gcC5tYXRjaCgvXFwvcGlnbWVudHMkLylcblxuICAgIGlmIHN0YXRlPy52ZXJzaW9uIGlzbnQgU0VSSUFMSVpFX1ZFUlNJT05cbiAgICAgIHN0YXRlID0ge31cblxuICAgIGlmIHN0YXRlPy5tYXJrZXJzVmVyc2lvbiBpc250IG1hcmtlcnNWZXJzaW9uXG4gICAgICBkZWxldGUgc3RhdGUudmFyaWFibGVzXG4gICAgICBkZWxldGUgc3RhdGUuYnVmZmVyc1xuXG4gICAgaWYgbm90IGNvbXBhcmVBcnJheShzdGF0ZS5nbG9iYWxTb3VyY2VOYW1lcywgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpKSBvciBub3QgY29tcGFyZUFycmF5KHN0YXRlLmdsb2JhbElnbm9yZWROYW1lcywgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkTmFtZXMnKSlcbiAgICAgIGRlbGV0ZSBzdGF0ZS52YXJpYWJsZXNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5idWZmZXJzXG4gICAgICBkZWxldGUgc3RhdGUucGF0aHNcblxuICAgIG5ldyBDb2xvclByb2plY3Qoc3RhdGUpXG5cbiAgY29uc3RydWN0b3I6IChzdGF0ZT17fSkgLT5cbiAgICB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbScgdW5sZXNzIEVtaXR0ZXI/XG4gICAgVmFyaWFibGVzQ29sbGVjdGlvbiA/PSByZXF1aXJlICcuL3ZhcmlhYmxlcy1jb2xsZWN0aW9uJ1xuXG4gICAge1xuICAgICAgQGluY2x1ZGVUaGVtZXMsIEBpZ25vcmVkTmFtZXMsIEBzb3VyY2VOYW1lcywgQGlnbm9yZWRTY29wZXMsIEBwYXRocywgQHNlYXJjaE5hbWVzLCBAaWdub3JlR2xvYmFsU291cmNlTmFtZXMsIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMsIEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzLCBAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXMsIEBpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMsIEBzdXBwb3J0ZWRGaWxldHlwZXMsIHZhcmlhYmxlcywgdGltZXN0YW1wLCBidWZmZXJzXG4gICAgfSA9IHN0YXRlXG5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkID0ge31cbiAgICBAYnVmZmVyU3RhdGVzID0gYnVmZmVycyA/IHt9XG5cbiAgICBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi92YXJpYWJsZS1leHByZXNzaW9ucydcbiAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9jb2xvci1leHByZXNzaW9ucydcblxuICAgIGlmIHZhcmlhYmxlcz9cbiAgICAgIEB2YXJpYWJsZXMgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUodmFyaWFibGVzKVxuICAgIGVsc2VcbiAgICAgIEB2YXJpYWJsZXMgPSBuZXcgVmFyaWFibGVzQ29sbGVjdGlvblxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB2YXJpYWJsZXMub25EaWRDaGFuZ2UgKHJlc3VsdHMpID0+XG4gICAgICBAZW1pdFZhcmlhYmxlc0NoYW5nZUV2ZW50KHJlc3VsdHMpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuc291cmNlTmFtZXMnLCA9PlxuICAgICAgQHVwZGF0ZVBhdGhzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5pZ25vcmVkTmFtZXMnLCA9PlxuICAgICAgQHVwZGF0ZVBhdGhzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5pZ25vcmVkQnVmZmVyTmFtZXMnLCAoQGlnbm9yZWRCdWZmZXJOYW1lcykgPT5cbiAgICAgIEB1cGRhdGVDb2xvckJ1ZmZlcnMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWRTY29wZXMnLCA9PlxuICAgICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuc3VwcG9ydGVkRmlsZXR5cGVzJywgPT5cbiAgICAgIEB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzKClcbiAgICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZVZjc0lnbm9yZWRQYXRocycsID0+XG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nLCA9PlxuICAgICAgQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeS5lbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7XG4gICAgICAgIHJlZ2lzdHJ5OiBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gICAgICB9XG5cbiAgICBzdmdDb2xvckV4cHJlc3Npb24gPSBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmdldEV4cHJlc3Npb24oJ3BpZ21lbnRzOm5hbWVkX2NvbG9ycycpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmZpbGV0eXBlc0ZvckNvbG9yV29yZHMnLCAoc2NvcGVzKSA9PlxuICAgICAgc3ZnQ29sb3JFeHByZXNzaW9uLnNjb3BlcyA9IHNjb3BlcyA/IFtdXG4gICAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgICAgbmFtZTogc3ZnQ29sb3JFeHByZXNzaW9uLm5hbWVcbiAgICAgICAgcmVnaXN0cnk6IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcbiAgICAgIH1cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5Lm9uRGlkVXBkYXRlRXhwcmVzc2lvbnMgKHtuYW1lfSkgPT5cbiAgICAgIHJldHVybiBpZiBub3QgQHBhdGhzPyBvciBuYW1lIGlzICdwaWdtZW50czp2YXJpYWJsZXMnXG4gICAgICBAdmFyaWFibGVzLmV2YWx1YXRlVmFyaWFibGVzIEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzKCksID0+XG4gICAgICAgIGNvbG9yQnVmZmVyLnVwZGF0ZSgpIGZvciBpZCwgY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5Lm9uRGlkVXBkYXRlRXhwcmVzc2lvbnMgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgQHBhdGhzP1xuICAgICAgQHJlbG9hZFZhcmlhYmxlc0ZvclBhdGhzKEBnZXRQYXRocygpKVxuXG4gICAgQHRpbWVzdGFtcCA9IG5ldyBEYXRlKERhdGUucGFyc2UodGltZXN0YW1wKSkgaWYgdGltZXN0YW1wP1xuXG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuXG4gICAgQGluaXRpYWxpemUoKSBpZiBAcGF0aHM/XG4gICAgQGluaXRpYWxpemVCdWZmZXJzKClcblxuICBvbkRpZEluaXRpYWxpemU6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWluaXRpYWxpemUnLCBjYWxsYmFja1xuXG4gIG9uRGlkRGVzdHJveTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtZGVzdHJveScsIGNhbGxiYWNrXG5cbiAgb25EaWRVcGRhdGVWYXJpYWJsZXM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXVwZGF0ZS12YXJpYWJsZXMnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ3JlYXRlQ29sb3JCdWZmZXI6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNyZWF0ZS1jb2xvci1idWZmZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQ2hhbmdlSWdub3JlZFNjb3BlczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgY2FsbGJhY2tcblxuICBvbkRpZENoYW5nZVBhdGhzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UtcGF0aHMnLCBjYWxsYmFja1xuXG4gIG9ic2VydmVDb2xvckJ1ZmZlcnM6IChjYWxsYmFjaykgLT5cbiAgICBjYWxsYmFjayhjb2xvckJ1ZmZlcikgZm9yIGlkLGNvbG9yQnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgQG9uRGlkQ3JlYXRlQ29sb3JCdWZmZXIoY2FsbGJhY2spXG5cbiAgaXNJbml0aWFsaXplZDogLT4gQGluaXRpYWxpemVkXG5cbiAgaXNEZXN0cm95ZWQ6IC0+IEBkZXN0cm95ZWRcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKSkgaWYgQGlzSW5pdGlhbGl6ZWQoKVxuICAgIHJldHVybiBAaW5pdGlhbGl6ZVByb21pc2UgaWYgQGluaXRpYWxpemVQcm9taXNlP1xuICAgIEBpbml0aWFsaXplUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICAgQHZhcmlhYmxlcy5vbmNlSW5pdGlhbGl6ZWQocmVzb2x2ZSlcbiAgICApXG4gICAgLnRoZW4gPT5cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuICAgIC50aGVuID0+XG4gICAgICBAaW5jbHVkZVRoZW1lc1ZhcmlhYmxlcygpIGlmIEBpbmNsdWRlVGhlbWVzXG4gICAgLnRoZW4gPT5cbiAgICAgIEBpbml0aWFsaXplZCA9IHRydWVcblxuICAgICAgdmFyaWFibGVzID0gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWluaXRpYWxpemUnLCB2YXJpYWJsZXNcbiAgICAgIHZhcmlhYmxlc1xuXG4gIGRlc3Ryb3k6IC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcblxuICAgIFBhdGhzU2Nhbm5lciA/PSByZXF1aXJlICcuL3BhdGhzLXNjYW5uZXInXG5cbiAgICBAZGVzdHJveWVkID0gdHJ1ZVxuXG4gICAgUGF0aHNTY2FubmVyLnRlcm1pbmF0ZVJ1bm5pbmdUYXNrKClcblxuICAgIGJ1ZmZlci5kZXN0cm95KCkgZm9yIGlkLGJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkID0gbnVsbFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZGVzdHJveScsIHRoaXNcbiAgICBAZW1pdHRlci5kaXNwb3NlKClcblxuICByZWxvYWQ6IC0+XG4gICAgQGluaXRpYWxpemUoKS50aGVuID0+XG4gICAgICBAdmFyaWFibGVzLnJlc2V0KClcbiAgICAgIEBwYXRocyA9IFtdXG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKClcbiAgICAudGhlbiA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5ub3RpZnlSZWxvYWRzJylcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJQaWdtZW50cyBzdWNjZXNzZnVsbHkgcmVsb2FkZWRcIiwgZGlzbWlzc2FibGU6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuZGlzbWlzc2FibGVSZWxvYWROb3RpZmljYXRpb25zJyksIGRlc2NyaXB0aW9uOiBcIlwiXCJGb3VuZDpcbiAgICAgICAgLSAqKiN7QHBhdGhzLmxlbmd0aH0qKiBwYXRoKHMpXG4gICAgICAgIC0gKioje0BnZXRWYXJpYWJsZXMoKS5sZW5ndGh9KiogdmFyaWFibGVzKHMpIGluY2x1ZGluZyAqKiN7QGdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RofSoqIGNvbG9yKHMpXG4gICAgICAgIFwiXCJcIilcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJcIlwiRm91bmQ6XG4gICAgICAgIC0gI3tAcGF0aHMubGVuZ3RofSBwYXRoKHMpXG4gICAgICAgIC0gI3tAZ2V0VmFyaWFibGVzKCkubGVuZ3RofSB2YXJpYWJsZXMocykgaW5jbHVkaW5nICN7QGdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RofSBjb2xvcihzKVxuICAgICAgICBcIlwiXCIpXG4gICAgLmNhdGNoIChyZWFzb24pIC0+XG4gICAgICBkZXRhaWwgPSByZWFzb24ubWVzc2FnZVxuICAgICAgc3RhY2sgPSByZWFzb24uc3RhY2tcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIlBpZ21lbnRzIGNvdWxkbid0IGJlIHJlbG9hZGVkXCIsIHtkZXRhaWwsIHN0YWNrLCBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgICBjb25zb2xlLmVycm9yIHJlYXNvblxuXG4gIGxvYWRQYXRoc0FuZFZhcmlhYmxlczogLT5cbiAgICBkZXN0cm95ZWQgPSBudWxsXG5cbiAgICBAbG9hZFBhdGhzKCkudGhlbiAoe2RpcnRpZWQsIHJlbW92ZWR9KSA9PlxuICAgICAgIyBXZSBjYW4gZmluZCByZW1vdmVkIGZpbGVzIG9ubHkgd2hlbiB0aGVyZSdzIGFscmVhZHkgcGF0aHMgZnJvbVxuICAgICAgIyBhIHNlcmlhbGl6ZWQgc3RhdGVcbiAgICAgIGlmIHJlbW92ZWQubGVuZ3RoID4gMFxuICAgICAgICBAcGF0aHMgPSBAcGF0aHMuZmlsdGVyIChwKSAtPiBwIG5vdCBpbiByZW1vdmVkXG4gICAgICAgIEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyhyZW1vdmVkKVxuXG4gICAgICAjIFRoZXJlIHdhcyBzZXJpYWxpemVkIHBhdGhzLCBhbmQgdGhlIGluaXRpYWxpemF0aW9uIGRpc2NvdmVyZWRcbiAgICAgICMgc29tZSBuZXcgb3IgZGlydHkgb25lcy5cbiAgICAgIGlmIEBwYXRocz8gYW5kIGRpcnRpZWQubGVuZ3RoID4gMFxuICAgICAgICBAcGF0aHMucHVzaCBwYXRoIGZvciBwYXRoIGluIGRpcnRpZWQgd2hlbiBwYXRoIG5vdCBpbiBAcGF0aHNcblxuICAgICAgICAjIFRoZXJlIHdhcyBhbHNvIHNlcmlhbGl6ZWQgdmFyaWFibGVzLCBzbyB3ZSdsbCByZXNjYW4gb25seSB0aGVcbiAgICAgICAgIyBkaXJ0eSBwYXRoc1xuICAgICAgICBpZiBAdmFyaWFibGVzLmxlbmd0aFxuICAgICAgICAgIGRpcnRpZWRcbiAgICAgICAgIyBUaGVyZSB3YXMgbm8gdmFyaWFibGVzLCBzbyBpdCdzIHByb2JhYmx5IGJlY2F1c2UgdGhlIG1hcmtlcnNcbiAgICAgICAgIyB2ZXJzaW9uIGNoYW5nZWQsIHdlJ2xsIHJlc2NhbiBhbGwgdGhlIGZpbGVzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcGF0aHNcbiAgICAgICMgVGhlcmUgd2FzIG5vIHNlcmlhbGl6ZWQgcGF0aHMsIHNvIHRoZXJlJ3Mgbm8gdmFyaWFibGVzIG5laXRoZXJcbiAgICAgIGVsc2UgdW5sZXNzIEBwYXRocz9cbiAgICAgICAgQHBhdGhzID0gZGlydGllZFxuICAgICAgIyBPbmx5IHRoZSBtYXJrZXJzIHZlcnNpb24gY2hhbmdlZCwgYWxsIHRoZSBwYXRocyBmcm9tIHRoZSBzZXJpYWxpemVkXG4gICAgICAjIHN0YXRlIHdpbGwgYmUgcmVzY2FubmVkXG4gICAgICBlbHNlIHVubGVzcyBAdmFyaWFibGVzLmxlbmd0aFxuICAgICAgICBAcGF0aHNcbiAgICAgICMgTm90aGluZyBjaGFuZ2VkLCB0aGVyZSdzIG5vIGRpcnR5IHBhdGhzIHRvIHJlc2NhblxuICAgICAgZWxzZVxuICAgICAgICBbXVxuICAgIC50aGVuIChwYXRocykgPT5cbiAgICAgIEBsb2FkVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZUNvbGxlY3Rpb24ocmVzdWx0cykgaWYgcmVzdWx0cz9cblxuICBmaW5kQWxsQ29sb3JzOiAtPlxuICAgIENvbG9yU2VhcmNoID89IHJlcXVpcmUgJy4vY29sb3Itc2VhcmNoJ1xuXG4gICAgcGF0dGVybnMgPSBAZ2V0U2VhcmNoTmFtZXMoKVxuICAgIG5ldyBDb2xvclNlYXJjaFxuICAgICAgc291cmNlTmFtZXM6IHBhdHRlcm5zXG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgICBpZ25vcmVkTmFtZXM6IEBnZXRJZ25vcmVkTmFtZXMoKVxuICAgICAgY29udGV4dDogQGdldENvbnRleHQoKVxuXG4gIHNldENvbG9yUGlja2VyQVBJOiAoQGNvbG9yUGlja2VyQVBJKSAtPlxuXG4gICMjICAgICMjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAjIyMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICMjICAgICAgICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgaW5pdGlhbGl6ZUJ1ZmZlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHJldHVybiBpZiBub3QgZWRpdG9yUGF0aD8gb3IgQGlzQnVmZmVySWdub3JlZChlZGl0b3JQYXRoKVxuXG4gICAgICBidWZmZXIgPSBAY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgaWYgYnVmZmVyP1xuICAgICAgICBidWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGJ1ZmZlcilcbiAgICAgICAgYnVmZmVyRWxlbWVudC5hdHRhY2goKVxuXG4gIGhhc0NvbG9yQnVmZmVyRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiBAZGVzdHJveWVkIG9yIG5vdCBlZGl0b3I/XG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXT9cblxuICBjb2xvckJ1ZmZlckZvckVkaXRvcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgQ29sb3JCdWZmZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1idWZmZXInXG5cbiAgICBpZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdP1xuICAgICAgcmV0dXJuIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1cblxuICAgIGlmIEBidWZmZXJTdGF0ZXNbZWRpdG9yLmlkXT9cbiAgICAgIHN0YXRlID0gQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdXG4gICAgICBzdGF0ZS5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIHN0YXRlLnByb2plY3QgPSB0aGlzXG4gICAgICBkZWxldGUgQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdXG4gICAgZWxzZVxuICAgICAgc3RhdGUgPSB7ZWRpdG9yLCBwcm9qZWN0OiB0aGlzfVxuXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSA9IGJ1ZmZlciA9IG5ldyBDb2xvckJ1ZmZlcihzdGF0ZSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBzdWJzY3JpcHRpb24gPSBidWZmZXIub25EaWREZXN0cm95ID0+XG4gICAgICBAc3Vic2NyaXB0aW9ucy5yZW1vdmUoc3Vic2NyaXB0aW9uKVxuICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgZGVsZXRlIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1cblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jcmVhdGUtY29sb3ItYnVmZmVyJywgYnVmZmVyXG5cbiAgICBidWZmZXJcblxuICBjb2xvckJ1ZmZlckZvclBhdGg6IChwYXRoKSAtPlxuICAgIGZvciBpZCxjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgcmV0dXJuIGNvbG9yQnVmZmVyIGlmIGNvbG9yQnVmZmVyLmVkaXRvci5nZXRQYXRoKCkgaXMgcGF0aFxuXG4gIHVwZGF0ZUNvbG9yQnVmZmVyczogLT5cbiAgICBmb3IgaWQsIGJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgaWYgQGlzQnVmZmVySWdub3JlZChidWZmZXIuZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgYnVmZmVyLmRlc3Ryb3koKVxuICAgICAgICBkZWxldGUgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbaWRdXG5cbiAgICB0cnlcbiAgICAgIGlmIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkP1xuICAgICAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgICAgICBjb250aW51ZSBpZiBAaGFzQ29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKSBvciBAaXNCdWZmZXJJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCkpXG5cbiAgICAgICAgICBidWZmZXIgPSBAY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICAgIGlmIGJ1ZmZlcj9cbiAgICAgICAgICAgIGJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYnVmZmVyKVxuICAgICAgICAgICAgYnVmZmVyRWxlbWVudC5hdHRhY2goKVxuXG4gICAgY2F0Y2ggZVxuICAgICAgY29uc29sZS5sb2cgZVxuXG4gIGlzQnVmZmVySWdub3JlZDogKHBhdGgpIC0+XG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcblxuICAgIHBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZShwYXRoKVxuICAgIHNvdXJjZXMgPSBAaWdub3JlZEJ1ZmZlck5hbWVzID8gW11cbiAgICByZXR1cm4gdHJ1ZSBmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBtaW5pbWF0Y2gocGF0aCwgc291cmNlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSlcbiAgICBmYWxzZVxuXG4gICMjICAgICMjIyMjIyMjICAgICAjIyMgICAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAgICAjIyAgICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjIyMgICMjIyMjI1xuICAjIyAgICAjIyAgICAgICAgIyMjIyMjIyMjICAgICMjICAgICMjICAgICAjIyAgICAgICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZ2V0UGF0aHM6IC0+IEBwYXRocz8uc2xpY2UoKVxuXG4gIGFwcGVuZFBhdGg6IChwYXRoKSAtPiBAcGF0aHMucHVzaChwYXRoKSBpZiBwYXRoP1xuXG4gIGhhc1BhdGg6IChwYXRoKSAtPiBwYXRoIGluIChAcGF0aHMgPyBbXSlcblxuICBsb2FkUGF0aHM6IChub0tub3duUGF0aHM9ZmFsc2UpIC0+XG4gICAgUGF0aHNMb2FkZXIgPz0gcmVxdWlyZSAnLi9wYXRocy1sb2FkZXInXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcm9vdFBhdGhzID0gQGdldFJvb3RQYXRocygpXG4gICAgICBrbm93blBhdGhzID0gaWYgbm9Lbm93blBhdGhzIHRoZW4gW10gZWxzZSBAcGF0aHMgPyBbXVxuICAgICAgY29uZmlnID0ge1xuICAgICAgICBrbm93blBhdGhzXG4gICAgICAgIEB0aW1lc3RhbXBcbiAgICAgICAgaWdub3JlZE5hbWVzOiBAZ2V0SWdub3JlZE5hbWVzKClcbiAgICAgICAgcGF0aHM6IHJvb3RQYXRoc1xuICAgICAgICB0cmF2ZXJzZUludG9TeW1saW5rRGlyZWN0b3JpZXM6IGF0b20uY29uZmlnLmdldCAncGlnbWVudHMudHJhdmVyc2VJbnRvU3ltbGlua0RpcmVjdG9yaWVzJ1xuICAgICAgICBzb3VyY2VOYW1lczogQGdldFNvdXJjZU5hbWVzKClcbiAgICAgICAgaWdub3JlVmNzSWdub3JlczogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVWY3NJZ25vcmVkUGF0aHMnKVxuICAgICAgfVxuICAgICAgUGF0aHNMb2FkZXIuc3RhcnRUYXNrIGNvbmZpZywgKHJlc3VsdHMpID0+XG4gICAgICAgIGZvciBwIGluIGtub3duUGF0aHNcbiAgICAgICAgICBpc0Rlc2NlbmRlbnRPZlJvb3RQYXRocyA9IHJvb3RQYXRocy5zb21lIChyb290KSAtPlxuICAgICAgICAgICAgcC5pbmRleE9mKHJvb3QpIGlzIDBcblxuICAgICAgICAgIHVubGVzcyBpc0Rlc2NlbmRlbnRPZlJvb3RQYXRoc1xuICAgICAgICAgICAgcmVzdWx0cy5yZW1vdmVkID89IFtdXG4gICAgICAgICAgICByZXN1bHRzLnJlbW92ZWQucHVzaChwKVxuXG4gICAgICAgIHJlc29sdmUocmVzdWx0cylcblxuICB1cGRhdGVQYXRoczogLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgdW5sZXNzIEBpbml0aWFsaXplZFxuXG4gICAgQGxvYWRQYXRocygpLnRoZW4gKHtkaXJ0aWVkLCByZW1vdmVkfSkgPT5cbiAgICAgIEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyhyZW1vdmVkKVxuXG4gICAgICBAcGF0aHMgPSBAcGF0aHMuZmlsdGVyIChwKSAtPiBwIG5vdCBpbiByZW1vdmVkXG4gICAgICBAcGF0aHMucHVzaChwKSBmb3IgcCBpbiBkaXJ0aWVkIHdoZW4gcCBub3QgaW4gQHBhdGhzXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtcGF0aHMnLCBAZ2V0UGF0aHMoKVxuICAgICAgQHJlbG9hZFZhcmlhYmxlc0ZvclBhdGhzKGRpcnRpZWQpXG5cbiAgaXNWYXJpYWJsZXNTb3VyY2VQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhdGhcblxuICAgIG1pbmltYXRjaCA/PSByZXF1aXJlICdtaW5pbWF0Y2gnXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgc291cmNlcyA9IEBnZXRTb3VyY2VOYW1lcygpXG5cbiAgICByZXR1cm4gdHJ1ZSBmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBtaW5pbWF0Y2gocGF0aCwgc291cmNlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSlcblxuICBpc0lnbm9yZWRQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhdGhcblxuICAgIG1pbmltYXRjaCA/PSByZXF1aXJlICdtaW5pbWF0Y2gnXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgaWdub3JlZE5hbWVzID0gQGdldElnbm9yZWROYW1lcygpXG5cbiAgICByZXR1cm4gdHJ1ZSBmb3IgaWdub3JlIGluIGlnbm9yZWROYW1lcyB3aGVuIG1pbmltYXRjaChwYXRoLCBpZ25vcmUsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuXG4gIHNjb3BlRnJvbUZpbGVOYW1lOiAocGF0aCkgLT5cbiAgICBzY29wZUZyb21GaWxlTmFtZSA/PSByZXF1aXJlICcuL3Njb3BlLWZyb20tZmlsZS1uYW1lJ1xuXG4gICAgc2NvcGUgPSBzY29wZUZyb21GaWxlTmFtZShwYXRoKVxuXG4gICAgaWYgc2NvcGUgaXMgJ3Nhc3MnIG9yIHNjb3BlIGlzICdzY3NzJ1xuICAgICAgc2NvcGUgPSBbc2NvcGUsIEBnZXRTYXNzU2NvcGVTdWZmaXgoKV0uam9pbignOicpXG5cbiAgICBzY29wZVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgICAjIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZ2V0UGFsZXR0ZTogLT5cbiAgICBQYWxldHRlID89IHJlcXVpcmUgJy4vcGFsZXR0ZSdcblxuICAgIHJldHVybiBuZXcgUGFsZXR0ZSB1bmxlc3MgQGlzSW5pdGlhbGl6ZWQoKVxuICAgIG5ldyBQYWxldHRlKEBnZXRDb2xvclZhcmlhYmxlcygpKVxuXG4gIGdldENvbnRleHQ6IC0+IEB2YXJpYWJsZXMuZ2V0Q29udGV4dCgpXG5cbiAgZ2V0VmFyaWFibGVzOiAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpXG5cbiAgZ2V0VmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5OiAtPiBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5XG5cbiAgZ2V0VmFyaWFibGVCeUlkOiAoaWQpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVCeUlkKGlkKVxuXG4gIGdldFZhcmlhYmxlQnlOYW1lOiAobmFtZSkgLT4gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5TmFtZShuYW1lKVxuXG4gIGdldENvbG9yVmFyaWFibGVzOiAtPiBAdmFyaWFibGVzLmdldENvbG9yVmFyaWFibGVzKClcblxuICBnZXRDb2xvckV4cHJlc3Npb25zUmVnaXN0cnk6IC0+IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcblxuICBzaG93VmFyaWFibGVJbkZpbGU6ICh2YXJpYWJsZSkgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHZhcmlhYmxlLnBhdGgpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgUmFuZ2U/XG5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgICBidWZmZXJSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QgW1xuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVswXSlcbiAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodmFyaWFibGUucmFuZ2VbMV0pXG4gICAgICBdXG5cbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKGJ1ZmZlclJhbmdlLCBhdXRvc2Nyb2xsOiB0cnVlKVxuXG4gIGVtaXRWYXJpYWJsZXNDaGFuZ2VFdmVudDogKHJlc3VsdHMpIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS12YXJpYWJsZXMnLCByZXN1bHRzXG5cbiAgbG9hZFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAbG9hZFZhcmlhYmxlc0ZvclBhdGhzIFtwYXRoXVxuXG4gIGxvYWRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAc2NhblBhdGhzRm9yVmFyaWFibGVzIHBhdGhzLCAocmVzdWx0cykgPT4gcmVzb2x2ZShyZXN1bHRzKVxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclBhdGgocGF0aClcblxuICBnZXRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclBhdGhzKHBhdGhzKVxuXG4gIGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgZGVsZXRlVmFyaWFibGVzRm9yUGF0aHM6IChwYXRocykgLT5cbiAgICBAdmFyaWFibGVzLmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHBhdGhzKVxuXG4gIHJlbG9hZFZhcmlhYmxlc0ZvclBhdGg6IChwYXRoKSAtPiBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgcmVsb2FkVmFyaWFibGVzRm9yUGF0aHM6IChwYXRocykgLT5cbiAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgICBwcm9taXNlID0gQGluaXRpYWxpemUoKSB1bmxlc3MgQGlzSW5pdGlhbGl6ZWQoKVxuXG4gICAgcHJvbWlzZVxuICAgIC50aGVuID0+XG4gICAgICBpZiBwYXRocy5zb21lKChwYXRoKSA9PiBwYXRoIG5vdCBpbiBAcGF0aHMpXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICAgIEBsb2FkVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZUNvbGxlY3Rpb24ocmVzdWx0cywgcGF0aHMpXG5cbiAgc2NhblBhdGhzRm9yVmFyaWFibGVzOiAocGF0aHMsIGNhbGxiYWNrKSAtPlxuICAgIGlmIHBhdGhzLmxlbmd0aCBpcyAxIGFuZCBjb2xvckJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvclBhdGgocGF0aHNbMF0pXG4gICAgICBjb2xvckJ1ZmZlci5zY2FuQnVmZmVyRm9yVmFyaWFibGVzKCkudGhlbiAocmVzdWx0cykgLT4gY2FsbGJhY2socmVzdWx0cylcbiAgICBlbHNlXG4gICAgICBQYXRoc1NjYW5uZXIgPz0gcmVxdWlyZSAnLi9wYXRocy1zY2FubmVyJ1xuXG4gICAgICBQYXRoc1NjYW5uZXIuc3RhcnRUYXNrIHBhdGhzLm1hcCgocCkgPT4gW3AsIEBzY29wZUZyb21GaWxlTmFtZShwKV0pLCBAdmFyaWFibGVFeHByZXNzaW9uc1JlZ2lzdHJ5LCAocmVzdWx0cykgLT4gY2FsbGJhY2socmVzdWx0cylcblxuICBsb2FkVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuICAgIEFUT01fVkFSSUFCTEVTID89IHJlcXVpcmUgJy4vYXRvbS12YXJpYWJsZXMnXG5cbiAgICBpdGVyYXRvciA9IDBcbiAgICB2YXJpYWJsZXMgPSBbXVxuICAgIGh0bWwgPSAnJ1xuICAgIEFUT01fVkFSSUFCTEVTLmZvckVhY2ggKHYpIC0+IGh0bWwgKz0gXCI8ZGl2IGNsYXNzPScje3Z9Jz4je3Z9PC9kaXY+XCJcblxuICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LmNsYXNzTmFtZSA9ICdwaWdtZW50cy1zYW1wbGVyJ1xuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICBBVE9NX1ZBUklBQkxFUy5mb3JFYWNoICh2LGkpIC0+XG4gICAgICBub2RlID0gZGl2LmNoaWxkcmVuW2ldXG4gICAgICBjb2xvciA9IGdldENvbXB1dGVkU3R5bGUobm9kZSkuY29sb3JcbiAgICAgIGVuZCA9IGl0ZXJhdG9yICsgdi5sZW5ndGggKyBjb2xvci5sZW5ndGggKyA0XG5cbiAgICAgIHZhcmlhYmxlID1cbiAgICAgICAgbmFtZTogXCJAI3t2fVwiXG4gICAgICAgIGxpbmU6IGlcbiAgICAgICAgdmFsdWU6IGNvbG9yXG4gICAgICAgIHJhbmdlOiBbaXRlcmF0b3IsZW5kXVxuICAgICAgICBwYXRoOiBUSEVNRV9WQVJJQUJMRVNcblxuICAgICAgaXRlcmF0b3IgPSBlbmRcbiAgICAgIHZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpXG4gICAgcmV0dXJuIHZhcmlhYmxlc1xuXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICMjIyMgIyMgICAgIyMgICMjIyMjIyAgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgIyMgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyMgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyMjICAjIyAjIyAgICAgICAgIyNcbiAgIyMgICAgICMjIyMjIyAgIyMjIyMjICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyAjIyAjIyAjIyAgICMjIyMgICMjIyMjI1xuICAjIyAgICAgICAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAjIyMjICMjICAgICMjICAgICAgICAjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAgIyMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgIyMjIyMjICAjIyMjIyMjIyAgICAjIyAgICAgICAjIyAgICAjIyMjICMjICAgICMjICAjIyMjIyMgICAgIyMjIyMjXG5cbiAgZ2V0Um9vdFBhdGhzOiAtPiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4gIGdldFNhc3NTY29wZVN1ZmZpeDogLT5cbiAgICBAc2Fzc1NoYWRlQW5kVGludEltcGxlbWVudGF0aW9uID8gYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nKSA/ICdjb21wYXNzJ1xuXG4gIHNldFNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbjogKEBzYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24pIC0+XG4gICAgQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeS5lbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7XG4gICAgICByZWdpc3RyeTogQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuICAgIH1cblxuICBnZXRTb3VyY2VOYW1lczogLT5cbiAgICBuYW1lcyA9IFsnLnBpZ21lbnRzJ11cbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc291cmNlTmFtZXMgPyBbXSlcbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykgPyBbXSlcbiAgICBuYW1lc1xuXG4gIHNldFNvdXJjZU5hbWVzOiAoQHNvdXJjZU5hbWVzPVtdKSAtPlxuICAgIHJldHVybiBpZiBub3QgQGluaXRpYWxpemVkPyBhbmQgbm90IEBpbml0aWFsaXplUHJvbWlzZT9cblxuICAgIEBpbml0aWFsaXplKCkudGhlbiA9PiBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKHRydWUpXG5cbiAgc2V0SWdub3JlR2xvYmFsU291cmNlTmFtZXM6IChAaWdub3JlR2xvYmFsU291cmNlTmFtZXMpIC0+XG4gICAgQHVwZGF0ZVBhdGhzKClcblxuICBnZXRTZWFyY2hOYW1lczogLT5cbiAgICBuYW1lcyA9IFtdXG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQHNvdXJjZU5hbWVzID8gW10pXG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQHNlYXJjaE5hbWVzID8gW10pXG4gICAgdW5sZXNzIEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lc1xuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpID8gW10pXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmV4dGVuZGVkU2VhcmNoTmFtZXMnKSA/IFtdKVxuICAgIG5hbWVzXG5cbiAgc2V0U2VhcmNoTmFtZXM6IChAc2VhcmNoTmFtZXM9W10pIC0+XG5cbiAgc2V0SWdub3JlR2xvYmFsU2VhcmNoTmFtZXM6IChAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXMpIC0+XG5cbiAgZ2V0SWdub3JlZE5hbWVzOiAtPlxuICAgIG5hbWVzID0gQGlnbm9yZWROYW1lcyA/IFtdXG4gICAgdW5sZXNzIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXNcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KEBnZXRHbG9iYWxJZ25vcmVkTmFtZXMoKSA/IFtdKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdjb3JlLmlnbm9yZWROYW1lcycpID8gW10pXG4gICAgbmFtZXNcblxuICBnZXRHbG9iYWxJZ25vcmVkTmFtZXM6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkTmFtZXMnKT8ubWFwIChwKSAtPlxuICAgICAgaWYgL1xcL1xcKiQvLnRlc3QocCkgdGhlbiBwICsgJyonIGVsc2UgcFxuXG4gIHNldElnbm9yZWROYW1lczogKEBpZ25vcmVkTmFtZXM9W10pIC0+XG4gICAgaWYgbm90IEBpbml0aWFsaXplZD8gYW5kIG5vdCBAaW5pdGlhbGl6ZVByb21pc2U/XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1Byb2plY3QgaXMgbm90IGluaXRpYWxpemVkIHlldCcpXG5cbiAgICBAaW5pdGlhbGl6ZSgpLnRoZW4gPT5cbiAgICAgIGRpcnRpZWQgPSBAcGF0aHMuZmlsdGVyIChwKSA9PiBAaXNJZ25vcmVkUGF0aChwKVxuICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKGRpcnRpZWQpXG5cbiAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApID0+ICFAaXNJZ25vcmVkUGF0aChwKVxuICAgICAgQGxvYWRQYXRoc0FuZFZhcmlhYmxlcyh0cnVlKVxuXG4gIHNldElnbm9yZUdsb2JhbElnbm9yZWROYW1lczogKEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMpIC0+XG4gICAgQHVwZGF0ZVBhdGhzKClcblxuICBnZXRJZ25vcmVkU2NvcGVzOiAtPlxuICAgIHNjb3BlcyA9IEBpZ25vcmVkU2NvcGVzID8gW11cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXNcbiAgICAgIHNjb3BlcyA9IHNjb3Blcy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5pZ25vcmVkU2NvcGVzJykgPyBbXSlcblxuICAgIHNjb3BlcyA9IHNjb3Blcy5jb25jYXQoQGlnbm9yZWRGaWxldHlwZXMpXG4gICAgc2NvcGVzXG5cbiAgc2V0SWdub3JlZFNjb3BlczogKEBpZ25vcmVkU2NvcGVzPVtdKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHNldElnbm9yZUdsb2JhbElnbm9yZWRTY29wZXM6IChAaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcykgLT5cbiAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICBzZXRTdXBwb3J0ZWRGaWxldHlwZXM6IChAc3VwcG9ydGVkRmlsZXR5cGVzPVtdKSAtPlxuICAgIEB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzKClcbiAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICB1cGRhdGVJZ25vcmVkRmlsZXR5cGVzOiAtPlxuICAgIEBpZ25vcmVkRmlsZXR5cGVzID0gQGdldElnbm9yZWRGaWxldHlwZXMoKVxuXG4gIGdldElnbm9yZWRGaWxldHlwZXM6IC0+XG4gICAgZmlsZXR5cGVzID0gQHN1cHBvcnRlZEZpbGV0eXBlcyA/IFtdXG5cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlc1xuICAgICAgZmlsZXR5cGVzID0gZmlsZXR5cGVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnN1cHBvcnRlZEZpbGV0eXBlcycpID8gW10pXG5cbiAgICBmaWxldHlwZXMgPSBbJyonXSBpZiBmaWxldHlwZXMubGVuZ3RoIGlzIDBcblxuICAgIHJldHVybiBbXSBpZiBmaWxldHlwZXMuc29tZSAodHlwZSkgLT4gdHlwZSBpcyAnKidcblxuICAgIHNjb3BlcyA9IGZpbGV0eXBlcy5tYXAgKGV4dCkgLT5cbiAgICAgIGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcihcImZpbGUuI3tleHR9XCIpPy5zY29wZU5hbWUucmVwbGFjZSgvXFwuL2csICdcXFxcLicpXG4gICAgLmZpbHRlciAoc2NvcGUpIC0+IHNjb3BlP1xuXG4gICAgW1wiXig/IVxcXFwuKCN7c2NvcGVzLmpvaW4oJ3wnKX0pKVwiXVxuXG4gIHNldElnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlczogKEBpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMpIC0+XG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHRoZW1lc0luY2x1ZGVkOiAtPiBAaW5jbHVkZVRoZW1lc1xuXG4gIHNldEluY2x1ZGVUaGVtZXM6IChpbmNsdWRlVGhlbWVzKSAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKSBpZiBpbmNsdWRlVGhlbWVzIGlzIEBpbmNsdWRlVGhlbWVzXG5cbiAgICBAaW5jbHVkZVRoZW1lcyA9IGluY2x1ZGVUaGVtZXNcbiAgICBpZiBAaW5jbHVkZVRoZW1lc1xuICAgICAgQGluY2x1ZGVUaGVtZXNWYXJpYWJsZXMoKVxuICAgIGVsc2VcbiAgICAgIEBkaXNwb3NlVGhlbWVzVmFyaWFibGVzKClcblxuICBpbmNsdWRlVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIEB0aGVtZXNTdWJzY3JpcHRpb24gPSBhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lcyA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAaW5jbHVkZVRoZW1lc1xuXG4gICAgICB7VEhFTUVfVkFSSUFCTEVTfSA9IHJlcXVpcmUgJy4vdXJpcycgdW5sZXNzIFRIRU1FX1ZBUklBQkxFUz9cblxuICAgICAgdmFyaWFibGVzID0gQGxvYWRUaGVtZXNWYXJpYWJsZXMoKVxuICAgICAgQHZhcmlhYmxlcy51cGRhdGVQYXRoQ29sbGVjdGlvbihUSEVNRV9WQVJJQUJMRVMsIHZhcmlhYmxlcylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAdGhlbWVzU3Vic2NyaXB0aW9uXG4gICAgQHZhcmlhYmxlcy5hZGRNYW55KEBsb2FkVGhlbWVzVmFyaWFibGVzKCkpXG5cbiAgZGlzcG9zZVRoZW1lc1ZhcmlhYmxlczogLT5cbiAgICB7VEhFTUVfVkFSSUFCTEVTfSA9IHJlcXVpcmUgJy4vdXJpcycgdW5sZXNzIFRIRU1FX1ZBUklBQkxFUz9cblxuICAgIEBzdWJzY3JpcHRpb25zLnJlbW92ZSBAdGhlbWVzU3Vic2NyaXB0aW9uXG4gICAgQHZhcmlhYmxlcy5kZWxldGVWYXJpYWJsZXNGb3JQYXRocyhbVEhFTUVfVkFSSUFCTEVTXSlcbiAgICBAdGhlbWVzU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuXG4gIGdldFRpbWVzdGFtcDogLT4gbmV3IERhdGUoKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICB1bmxlc3MgU0VSSUFMSVpFX1ZFUlNJT04/XG4gICAgICB7U0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT059ID0gcmVxdWlyZSAnLi92ZXJzaW9ucydcblxuICAgIGRhdGEgPVxuICAgICAgZGVzZXJpYWxpemVyOiAnQ29sb3JQcm9qZWN0J1xuICAgICAgdGltZXN0YW1wOiBAZ2V0VGltZXN0YW1wKClcbiAgICAgIHZlcnNpb246IFNFUklBTElaRV9WRVJTSU9OXG4gICAgICBtYXJrZXJzVmVyc2lvbjogU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTlxuICAgICAgZ2xvYmFsU291cmNlTmFtZXM6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc291cmNlTmFtZXMnKVxuICAgICAgZ2xvYmFsSWdub3JlZE5hbWVzOiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpXG5cbiAgICBpZiBAaWdub3JlR2xvYmFsU291cmNlTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzID0gQGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzXG4gICAgaWYgQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzP1xuICAgICAgZGF0YS5pZ25vcmVHbG9iYWxTZWFyY2hOYW1lcyA9IEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lc1xuICAgIGlmIEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbElnbm9yZWROYW1lcyA9IEBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXNcbiAgICBpZiBAaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcyA9IEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzXG4gICAgaWYgQGluY2x1ZGVUaGVtZXM/XG4gICAgICBkYXRhLmluY2x1ZGVUaGVtZXMgPSBAaW5jbHVkZVRoZW1lc1xuICAgIGlmIEBpZ25vcmVkU2NvcGVzP1xuICAgICAgZGF0YS5pZ25vcmVkU2NvcGVzID0gQGlnbm9yZWRTY29wZXNcbiAgICBpZiBAaWdub3JlZE5hbWVzP1xuICAgICAgZGF0YS5pZ25vcmVkTmFtZXMgPSBAaWdub3JlZE5hbWVzXG4gICAgaWYgQHNvdXJjZU5hbWVzP1xuICAgICAgZGF0YS5zb3VyY2VOYW1lcyA9IEBzb3VyY2VOYW1lc1xuICAgIGlmIEBzZWFyY2hOYW1lcz9cbiAgICAgIGRhdGEuc2VhcmNoTmFtZXMgPSBAc2VhcmNoTmFtZXNcblxuICAgIGRhdGEuYnVmZmVycyA9IEBzZXJpYWxpemVCdWZmZXJzKClcblxuICAgIGlmIEBpc0luaXRpYWxpemVkKClcbiAgICAgIGRhdGEucGF0aHMgPSBAcGF0aHNcbiAgICAgIGRhdGEudmFyaWFibGVzID0gQHZhcmlhYmxlcy5zZXJpYWxpemUoKVxuXG4gICAgZGF0YVxuXG4gIHNlcmlhbGl6ZUJ1ZmZlcnM6IC0+XG4gICAgb3V0ID0ge31cbiAgICBmb3IgaWQsY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcbiAgICAgIG91dFtpZF0gPSBjb2xvckJ1ZmZlci5zZXJpYWxpemUoKVxuICAgIG91dFxuIl19

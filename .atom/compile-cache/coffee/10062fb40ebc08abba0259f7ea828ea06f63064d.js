(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorMarkerElement, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, ref, scopeFromFileName,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], ColorBuffer = ref[0], ColorSearch = ref[1], Palette = ref[2], ColorMarkerElement = ref[3], VariablesCollection = ref[4], PathsLoader = ref[5], PathsScanner = ref[6], Emitter = ref[7], CompositeDisposable = ref[8], Range = ref[9], SERIALIZE_VERSION = ref[10], SERIALIZE_MARKERS_VERSION = ref[11], THEME_VARIABLES = ref[12], ATOM_VARIABLES = ref[13], scopeFromFileName = ref[14], minimatch = ref[15];

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
      this.subscriptions.add(atom.config.observe('pigments.markerType', function(type) {
        if (type != null) {
          if (ColorMarkerElement == null) {
            ColorMarkerElement = require('./color-marker-element');
          }
          return ColorMarkerElement.setMarkerType(type);
        }
      }));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdSQUFBO0lBQUE7O0VBQUEsTUFRSSxFQVJKLEVBQ0Usb0JBREYsRUFDZSxvQkFEZixFQUVFLGdCQUZGLEVBRVcsMkJBRlgsRUFFK0IsNEJBRi9CLEVBR0Usb0JBSEYsRUFHZSxxQkFIZixFQUlFLGdCQUpGLEVBSVcsNEJBSlgsRUFJZ0MsY0FKaEMsRUFLRSwyQkFMRixFQUtxQixtQ0FMckIsRUFLZ0QseUJBTGhELEVBS2lFLHdCQUxqRSxFQU1FLDJCQU5GLEVBT0U7O0VBR0YsWUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFHLENBQUg7QUFDYixRQUFBO0lBQUEsSUFBb0IsV0FBSixJQUFjLFdBQTlCO0FBQUEsYUFBTyxNQUFQOztJQUNBLElBQW9CLENBQUMsQ0FBQyxNQUFGLEtBQVksQ0FBQyxDQUFDLE1BQWxDO0FBQUEsYUFBTyxNQUFQOztBQUNBLFNBQUEsMkNBQUE7O1VBQStCLENBQUEsS0FBTyxDQUFFLENBQUEsQ0FBQTtBQUF4QyxlQUFPOztBQUFQO0FBQ0EsV0FBTztFQUpNOztFQU1mLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixZQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRDtBQUNaLFVBQUE7TUFBQSxJQUFPLHlCQUFQO1FBQ0UsT0FBaUQsT0FBQSxDQUFRLFlBQVIsQ0FBakQsRUFBQywwQ0FBRCxFQUFvQiwyREFEdEI7O01BR0EsY0FBQSxHQUFpQjtNQUNqQixJQUE0QixJQUFJLENBQUMsU0FBTCxDQUFBLENBQUEsSUFBcUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLGFBQVI7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ICBQYWxldHRlLCBDb2xvck1hcmtlckVsZW1lbnQsIFZhcmlhYmxlc0NvbGxlY3Rpb24sXG4gIFBhdGhzTG9hZGVyLCBQYXRoc1NjYW5uZXIsXG4gIEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlLFxuICBTRVJJQUxJWkVfVkVSU0lPTiwgU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTiwgVEhFTUVfVkFSSUFCTEVTLCBBVE9NX1ZBUklBQkxFUyxcbiAgc2NvcGVGcm9tRmlsZU5hbWUsXG4gIG1pbmltYXRjaFxuXSA9IFtdXG5cbmNvbXBhcmVBcnJheSA9IChhLGIpIC0+XG4gIHJldHVybiBmYWxzZSBpZiBub3QgYT8gb3Igbm90IGI/XG4gIHJldHVybiBmYWxzZSB1bmxlc3MgYS5sZW5ndGggaXMgYi5sZW5ndGhcbiAgcmV0dXJuIGZhbHNlIGZvciB2LGkgaW4gYSB3aGVuIHYgaXNudCBiW2ldXG4gIHJldHVybiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbG9yUHJvamVjdFxuICBAZGVzZXJpYWxpemU6IChzdGF0ZSkgLT5cbiAgICB1bmxlc3MgU0VSSUFMSVpFX1ZFUlNJT04/XG4gICAgICB7U0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT059ID0gcmVxdWlyZSAnLi92ZXJzaW9ucydcblxuICAgIG1hcmtlcnNWZXJzaW9uID0gU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTlxuICAgIG1hcmtlcnNWZXJzaW9uICs9ICctZGV2JyBpZiBhdG9tLmluRGV2TW9kZSgpIGFuZCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5zb21lIChwKSAtPiBwLm1hdGNoKC9cXC9waWdtZW50cyQvKVxuXG4gICAgaWYgc3RhdGU/LnZlcnNpb24gaXNudCBTRVJJQUxJWkVfVkVSU0lPTlxuICAgICAgc3RhdGUgPSB7fVxuXG4gICAgaWYgc3RhdGU/Lm1hcmtlcnNWZXJzaW9uIGlzbnQgbWFya2Vyc1ZlcnNpb25cbiAgICAgIGRlbGV0ZSBzdGF0ZS52YXJpYWJsZXNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5idWZmZXJzXG5cbiAgICBpZiBub3QgY29tcGFyZUFycmF5KHN0YXRlLmdsb2JhbFNvdXJjZU5hbWVzLCBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykpIG9yIG5vdCBjb21wYXJlQXJyYXkoc3RhdGUuZ2xvYmFsSWdub3JlZE5hbWVzLCBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpKVxuICAgICAgZGVsZXRlIHN0YXRlLnZhcmlhYmxlc1xuICAgICAgZGVsZXRlIHN0YXRlLmJ1ZmZlcnNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5wYXRoc1xuXG4gICAgbmV3IENvbG9yUHJvamVjdChzdGF0ZSlcblxuICBjb25zdHJ1Y3RvcjogKHN0YXRlPXt9KSAtPlxuICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgRW1pdHRlcj9cbiAgICBWYXJpYWJsZXNDb2xsZWN0aW9uID89IHJlcXVpcmUgJy4vdmFyaWFibGVzLWNvbGxlY3Rpb24nXG5cbiAgICB7XG4gICAgICBAaW5jbHVkZVRoZW1lcywgQGlnbm9yZWROYW1lcywgQHNvdXJjZU5hbWVzLCBAaWdub3JlZFNjb3BlcywgQHBhdGhzLCBAc2VhcmNoTmFtZXMsIEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcywgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcywgQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXMsIEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lcywgQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcywgQHN1cHBvcnRlZEZpbGV0eXBlcywgdmFyaWFibGVzLCB0aW1lc3RhbXAsIGJ1ZmZlcnNcbiAgICB9ID0gc3RhdGVcblxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQgPSB7fVxuICAgIEBidWZmZXJTdGF0ZXMgPSBidWZmZXJzID8ge31cblxuICAgIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuL3ZhcmlhYmxlLWV4cHJlc3Npb25zJ1xuICAgIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb25zJ1xuXG4gICAgaWYgdmFyaWFibGVzP1xuICAgICAgQHZhcmlhYmxlcyA9IGF0b20uZGVzZXJpYWxpemVycy5kZXNlcmlhbGl6ZSh2YXJpYWJsZXMpXG4gICAgZWxzZVxuICAgICAgQHZhcmlhYmxlcyA9IG5ldyBWYXJpYWJsZXNDb2xsZWN0aW9uXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHZhcmlhYmxlcy5vbkRpZENoYW5nZSAocmVzdWx0cykgPT5cbiAgICAgIEBlbWl0VmFyaWFibGVzQ2hhbmdlRXZlbnQocmVzdWx0cylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zb3VyY2VOYW1lcycsID0+XG4gICAgICBAdXBkYXRlUGF0aHMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsID0+XG4gICAgICBAdXBkYXRlUGF0aHMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWRCdWZmZXJOYW1lcycsIChAaWdub3JlZEJ1ZmZlck5hbWVzKSA9PlxuICAgICAgQHVwZGF0ZUNvbG9yQnVmZmVycygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuaWdub3JlZFNjb3BlcycsID0+XG4gICAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCA9PlxuICAgICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMubWFya2VyVHlwZScsICh0eXBlKSAtPlxuICAgICAgaWYgdHlwZT9cbiAgICAgICAgQ29sb3JNYXJrZXJFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItbWFya2VyLWVsZW1lbnQnXG4gICAgICAgIENvbG9yTWFya2VyRWxlbWVudC5zZXRNYXJrZXJUeXBlKHR5cGUpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuaWdub3JlVmNzSWdub3JlZFBhdGhzJywgPT5cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicsID0+XG4gICAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgICAgcmVnaXN0cnk6IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcbiAgICAgIH1cblxuICAgIHN2Z0NvbG9yRXhwcmVzc2lvbiA9IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkuZ2V0RXhwcmVzc2lvbigncGlnbWVudHM6bmFtZWRfY29sb3JzJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuZmlsZXR5cGVzRm9yQ29sb3JXb3JkcycsIChzY29wZXMpID0+XG4gICAgICBzdmdDb2xvckV4cHJlc3Npb24uc2NvcGVzID0gc2NvcGVzID8gW11cbiAgICAgIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkuZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLWV4cHJlc3Npb25zJywge1xuICAgICAgICBuYW1lOiBzdmdDb2xvckV4cHJlc3Npb24ubmFtZVxuICAgICAgICByZWdpc3RyeTogQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuICAgICAgfVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkub25EaWRVcGRhdGVFeHByZXNzaW9ucyAoe25hbWV9KSA9PlxuICAgICAgcmV0dXJuIGlmIG5vdCBAcGF0aHM/IG9yIG5hbWUgaXMgJ3BpZ21lbnRzOnZhcmlhYmxlcydcbiAgICAgIEB2YXJpYWJsZXMuZXZhbHVhdGVWYXJpYWJsZXMgQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKSwgPT5cbiAgICAgICAgY29sb3JCdWZmZXIudXBkYXRlKCkgZm9yIGlkLCBjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkub25EaWRVcGRhdGVFeHByZXNzaW9ucyA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAcGF0aHM/XG4gICAgICBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMoQGdldFBhdGhzKCkpXG5cbiAgICBAdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5wYXJzZSh0aW1lc3RhbXApKSBpZiB0aW1lc3RhbXA/XG5cbiAgICBAdXBkYXRlSWdub3JlZEZpbGV0eXBlcygpXG5cbiAgICBAaW5pdGlhbGl6ZSgpIGlmIEBwYXRocz9cbiAgICBAaW5pdGlhbGl6ZUJ1ZmZlcnMoKVxuXG4gIG9uRGlkSW5pdGlhbGl6ZTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtaW5pdGlhbGl6ZScsIGNhbGxiYWNrXG5cbiAgb25EaWREZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1kZXN0cm95JywgY2FsbGJhY2tcblxuICBvbkRpZFVwZGF0ZVZhcmlhYmxlczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtdXBkYXRlLXZhcmlhYmxlcycsIGNhbGxiYWNrXG5cbiAgb25EaWRDcmVhdGVDb2xvckJ1ZmZlcjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY3JlYXRlLWNvbG9yLWJ1ZmZlcicsIGNhbGxiYWNrXG5cbiAgb25EaWRDaGFuZ2VJZ25vcmVkU2NvcGVzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ2hhbmdlUGF0aHM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1wYXRocycsIGNhbGxiYWNrXG5cbiAgb2JzZXJ2ZUNvbG9yQnVmZmVyczogKGNhbGxiYWNrKSAtPlxuICAgIGNhbGxiYWNrKGNvbG9yQnVmZmVyKSBmb3IgaWQsY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcbiAgICBAb25EaWRDcmVhdGVDb2xvckJ1ZmZlcihjYWxsYmFjaylcblxuICBpc0luaXRpYWxpemVkOiAtPiBAaW5pdGlhbGl6ZWRcblxuICBpc0Rlc3Ryb3llZDogLT4gQGRlc3Ryb3llZFxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpKSBpZiBAaXNJbml0aWFsaXplZCgpXG4gICAgcmV0dXJuIEBpbml0aWFsaXplUHJvbWlzZSBpZiBAaW5pdGlhbGl6ZVByb21pc2U/XG4gICAgQGluaXRpYWxpemVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgICBAdmFyaWFibGVzLm9uY2VJbml0aWFsaXplZChyZXNvbHZlKVxuICAgIClcbiAgICAudGhlbiA9PlxuICAgICAgQGxvYWRQYXRoc0FuZFZhcmlhYmxlcygpXG4gICAgLnRoZW4gPT5cbiAgICAgIEBpbmNsdWRlVGhlbWVzVmFyaWFibGVzKCkgaWYgQGluY2x1ZGVUaGVtZXNcbiAgICAudGhlbiA9PlxuICAgICAgQGluaXRpYWxpemVkID0gdHJ1ZVxuXG4gICAgICB2YXJpYWJsZXMgPSBAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtaW5pdGlhbGl6ZScsIHZhcmlhYmxlc1xuICAgICAgdmFyaWFibGVzXG5cbiAgZGVzdHJveTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuXG4gICAgUGF0aHNTY2FubmVyID89IHJlcXVpcmUgJy4vcGF0aHMtc2Nhbm5lcidcblxuICAgIEBkZXN0cm95ZWQgPSB0cnVlXG5cbiAgICBQYXRoc1NjYW5uZXIudGVybWluYXRlUnVubmluZ1Rhc2soKVxuXG4gICAgYnVmZmVyLmRlc3Ryb3koKSBmb3IgaWQsYnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQgPSBudWxsXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1kZXN0cm95JywgdGhpc1xuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIHJlbG9hZDogLT5cbiAgICBAaW5pdGlhbGl6ZSgpLnRoZW4gPT5cbiAgICAgIEB2YXJpYWJsZXMucmVzZXQoKVxuICAgICAgQHBhdGhzID0gW11cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuICAgIC50aGVuID0+XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLm5vdGlmeVJlbG9hZHMnKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIlBpZ21lbnRzIHN1Y2Nlc3NmdWxseSByZWxvYWRlZFwiLCBkaXNtaXNzYWJsZTogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5kaXNtaXNzYWJsZVJlbG9hZE5vdGlmaWNhdGlvbnMnKSwgZGVzY3JpcHRpb246IFwiXCJcIkZvdW5kOlxuICAgICAgICAtICoqI3tAcGF0aHMubGVuZ3RofSoqIHBhdGgocylcbiAgICAgICAgLSAqKiN7QGdldFZhcmlhYmxlcygpLmxlbmd0aH0qKiB2YXJpYWJsZXMocykgaW5jbHVkaW5nICoqI3tAZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGh9KiogY29sb3IocylcbiAgICAgICAgXCJcIlwiKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlwiXCJGb3VuZDpcbiAgICAgICAgLSAje0BwYXRocy5sZW5ndGh9IHBhdGgocylcbiAgICAgICAgLSAje0BnZXRWYXJpYWJsZXMoKS5sZW5ndGh9IHZhcmlhYmxlcyhzKSBpbmNsdWRpbmcgI3tAZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGh9IGNvbG9yKHMpXG4gICAgICAgIFwiXCJcIilcbiAgICAuY2F0Y2ggKHJlYXNvbikgLT5cbiAgICAgIGRldGFpbCA9IHJlYXNvbi5tZXNzYWdlXG4gICAgICBzdGFjayA9IHJlYXNvbi5zdGFja1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiUGlnbWVudHMgY291bGRuJ3QgYmUgcmVsb2FkZWRcIiwge2RldGFpbCwgc3RhY2ssIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgIGNvbnNvbGUuZXJyb3IgcmVhc29uXG5cbiAgbG9hZFBhdGhzQW5kVmFyaWFibGVzOiAtPlxuICAgIGRlc3Ryb3llZCA9IG51bGxcblxuICAgIEBsb2FkUGF0aHMoKS50aGVuICh7ZGlydGllZCwgcmVtb3ZlZH0pID0+XG4gICAgICAjIFdlIGNhbiBmaW5kIHJlbW92ZWQgZmlsZXMgb25seSB3aGVuIHRoZXJlJ3MgYWxyZWFkeSBwYXRocyBmcm9tXG4gICAgICAjIGEgc2VyaWFsaXplZCBzdGF0ZVxuICAgICAgaWYgcmVtb3ZlZC5sZW5ndGggPiAwXG4gICAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApIC0+IHAgbm90IGluIHJlbW92ZWRcbiAgICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHJlbW92ZWQpXG5cbiAgICAgICMgVGhlcmUgd2FzIHNlcmlhbGl6ZWQgcGF0aHMsIGFuZCB0aGUgaW5pdGlhbGl6YXRpb24gZGlzY292ZXJlZFxuICAgICAgIyBzb21lIG5ldyBvciBkaXJ0eSBvbmVzLlxuICAgICAgaWYgQHBhdGhzPyBhbmQgZGlydGllZC5sZW5ndGggPiAwXG4gICAgICAgIEBwYXRocy5wdXNoIHBhdGggZm9yIHBhdGggaW4gZGlydGllZCB3aGVuIHBhdGggbm90IGluIEBwYXRoc1xuXG4gICAgICAgICMgVGhlcmUgd2FzIGFsc28gc2VyaWFsaXplZCB2YXJpYWJsZXMsIHNvIHdlJ2xsIHJlc2NhbiBvbmx5IHRoZVxuICAgICAgICAjIGRpcnR5IHBhdGhzXG4gICAgICAgIGlmIEB2YXJpYWJsZXMubGVuZ3RoXG4gICAgICAgICAgZGlydGllZFxuICAgICAgICAjIFRoZXJlIHdhcyBubyB2YXJpYWJsZXMsIHNvIGl0J3MgcHJvYmFibHkgYmVjYXVzZSB0aGUgbWFya2Vyc1xuICAgICAgICAjIHZlcnNpb24gY2hhbmdlZCwgd2UnbGwgcmVzY2FuIGFsbCB0aGUgZmlsZXNcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXRoc1xuICAgICAgIyBUaGVyZSB3YXMgbm8gc2VyaWFsaXplZCBwYXRocywgc28gdGhlcmUncyBubyB2YXJpYWJsZXMgbmVpdGhlclxuICAgICAgZWxzZSB1bmxlc3MgQHBhdGhzP1xuICAgICAgICBAcGF0aHMgPSBkaXJ0aWVkXG4gICAgICAjIE9ubHkgdGhlIG1hcmtlcnMgdmVyc2lvbiBjaGFuZ2VkLCBhbGwgdGhlIHBhdGhzIGZyb20gdGhlIHNlcmlhbGl6ZWRcbiAgICAgICMgc3RhdGUgd2lsbCBiZSByZXNjYW5uZWRcbiAgICAgIGVsc2UgdW5sZXNzIEB2YXJpYWJsZXMubGVuZ3RoXG4gICAgICAgIEBwYXRoc1xuICAgICAgIyBOb3RoaW5nIGNoYW5nZWQsIHRoZXJlJ3Mgbm8gZGlydHkgcGF0aHMgdG8gcmVzY2FuXG4gICAgICBlbHNlXG4gICAgICAgIFtdXG4gICAgLnRoZW4gKHBhdGhzKSA9PlxuICAgICAgQGxvYWRWYXJpYWJsZXNGb3JQYXRocyhwYXRocylcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEB2YXJpYWJsZXMudXBkYXRlQ29sbGVjdGlvbihyZXN1bHRzKSBpZiByZXN1bHRzP1xuXG4gIGZpbmRBbGxDb2xvcnM6IC0+XG4gICAgQ29sb3JTZWFyY2ggPz0gcmVxdWlyZSAnLi9jb2xvci1zZWFyY2gnXG5cbiAgICBwYXR0ZXJucyA9IEBnZXRTZWFyY2hOYW1lcygpXG4gICAgbmV3IENvbG9yU2VhcmNoXG4gICAgICBzb3VyY2VOYW1lczogcGF0dGVybnNcbiAgICAgIHByb2plY3Q6IHRoaXNcbiAgICAgIGlnbm9yZWROYW1lczogQGdldElnbm9yZWROYW1lcygpXG4gICAgICBjb250ZXh0OiBAZ2V0Q29udGV4dCgpXG5cbiAgc2V0Q29sb3JQaWNrZXJBUEk6IChAY29sb3JQaWNrZXJBUEkpIC0+XG5cbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjIyMjIyAgICMjIyMjIyAgICMjIyMjIyAgICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICMjIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgICAgIyMgICAgICAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBpbml0aWFsaXplQnVmZmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBlZGl0b3JQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgcmV0dXJuIGlmIG5vdCBlZGl0b3JQYXRoPyBvciBAaXNCdWZmZXJJZ25vcmVkKGVkaXRvclBhdGgpXG5cbiAgICAgIGJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICBpZiBidWZmZXI/XG4gICAgICAgIGJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYnVmZmVyKVxuICAgICAgICBidWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgaGFzQ29sb3JCdWZmZXJGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBkZXN0cm95ZWQgb3Igbm90IGVkaXRvcj9cbiAgICBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdP1xuXG4gIGNvbG9yQnVmZmVyRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICBDb2xvckJ1ZmZlciA/PSByZXF1aXJlICcuL2NvbG9yLWJ1ZmZlcidcblxuICAgIGlmIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0/XG4gICAgICByZXR1cm4gQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVxuXG4gICAgaWYgQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdP1xuICAgICAgc3RhdGUgPSBAYnVmZmVyU3RhdGVzW2VkaXRvci5pZF1cbiAgICAgIHN0YXRlLmVkaXRvciA9IGVkaXRvclxuICAgICAgc3RhdGUucHJvamVjdCA9IHRoaXNcbiAgICAgIGRlbGV0ZSBAYnVmZmVyU3RhdGVzW2VkaXRvci5pZF1cbiAgICBlbHNlXG4gICAgICBzdGF0ZSA9IHtlZGl0b3IsIHByb2plY3Q6IHRoaXN9XG5cbiAgICBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0gYnVmZmVyID0gbmV3IENvbG9yQnVmZmVyKHN0YXRlKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIHN1YnNjcmlwdGlvbiA9IGJ1ZmZlci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb24pXG4gICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBkZWxldGUgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVxuXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNyZWF0ZS1jb2xvci1idWZmZXInLCBidWZmZXJcblxuICAgIGJ1ZmZlclxuXG4gIGNvbG9yQnVmZmVyRm9yUGF0aDogKHBhdGgpIC0+XG4gICAgZm9yIGlkLGNvbG9yQnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgICByZXR1cm4gY29sb3JCdWZmZXIgaWYgY29sb3JCdWZmZXIuZWRpdG9yLmdldFBhdGgoKSBpcyBwYXRoXG5cbiAgdXBkYXRlQ29sb3JCdWZmZXJzOiAtPlxuICAgIGZvciBpZCwgYnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgICBpZiBAaXNCdWZmZXJJZ25vcmVkKGJ1ZmZlci5lZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICBidWZmZXIuZGVzdHJveSgpXG4gICAgICAgIGRlbGV0ZSBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtpZF1cblxuICAgIHRyeVxuICAgICAgaWYgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQ/XG4gICAgICAgIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgICAgIGNvbnRpbnVlIGlmIEBoYXNDb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpIG9yIEBpc0J1ZmZlcklnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSlcblxuICAgICAgICAgIGJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgaWYgYnVmZmVyP1xuICAgICAgICAgICAgYnVmZmVyRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhidWZmZXIpXG4gICAgICAgICAgICBidWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmxvZyBlXG5cbiAgaXNCdWZmZXJJZ25vcmVkOiAocGF0aCkgLT5cbiAgICBtaW5pbWF0Y2ggPz0gcmVxdWlyZSAnbWluaW1hdGNoJ1xuXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgc291cmNlcyA9IEBpZ25vcmVkQnVmZmVyTmFtZXMgPyBbXVxuICAgIHJldHVybiB0cnVlIGZvciBzb3VyY2UgaW4gc291cmNlcyB3aGVuIG1pbmltYXRjaChwYXRoLCBzb3VyY2UsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuICAgIGZhbHNlXG5cbiAgIyMgICAgIyMjIyMjIyMgICAgICMjIyAgICAjIyMjIyMjIyAjIyAgICAgIyMgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICAgICMjICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICAgICMjICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICAgICMjICAgICMjIyMjIyMjIyAgIyMjIyMjXG4gICMjICAgICMjICAgICAgICAjIyMjIyMjIyMgICAgIyMgICAgIyMgICAgICMjICAgICAgICMjXG4gICMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICMjICAjIyMjIyNcblxuICBnZXRQYXRoczogLT4gQHBhdGhzPy5zbGljZSgpXG5cbiAgYXBwZW5kUGF0aDogKHBhdGgpIC0+IEBwYXRocy5wdXNoKHBhdGgpIGlmIHBhdGg/XG5cbiAgaGFzUGF0aDogKHBhdGgpIC0+IHBhdGggaW4gKEBwYXRocyA/IFtdKVxuXG4gIGxvYWRQYXRoczogKG5vS25vd25QYXRocz1mYWxzZSkgLT5cbiAgICBQYXRoc0xvYWRlciA/PSByZXF1aXJlICcuL3BhdGhzLWxvYWRlcidcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICByb290UGF0aHMgPSBAZ2V0Um9vdFBhdGhzKClcbiAgICAgIGtub3duUGF0aHMgPSBpZiBub0tub3duUGF0aHMgdGhlbiBbXSBlbHNlIEBwYXRocyA/IFtdXG4gICAgICBjb25maWcgPSB7XG4gICAgICAgIGtub3duUGF0aHNcbiAgICAgICAgQHRpbWVzdGFtcFxuICAgICAgICBpZ25vcmVkTmFtZXM6IEBnZXRJZ25vcmVkTmFtZXMoKVxuICAgICAgICBwYXRoczogcm9vdFBhdGhzXG4gICAgICAgIHRyYXZlcnNlSW50b1N5bWxpbmtEaXJlY3RvcmllczogYXRvbS5jb25maWcuZ2V0ICdwaWdtZW50cy50cmF2ZXJzZUludG9TeW1saW5rRGlyZWN0b3JpZXMnXG4gICAgICAgIHNvdXJjZU5hbWVzOiBAZ2V0U291cmNlTmFtZXMoKVxuICAgICAgICBpZ25vcmVWY3NJZ25vcmVzOiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZVZjc0lnbm9yZWRQYXRocycpXG4gICAgICB9XG4gICAgICBQYXRoc0xvYWRlci5zdGFydFRhc2sgY29uZmlnLCAocmVzdWx0cykgPT5cbiAgICAgICAgZm9yIHAgaW4ga25vd25QYXRoc1xuICAgICAgICAgIGlzRGVzY2VuZGVudE9mUm9vdFBhdGhzID0gcm9vdFBhdGhzLnNvbWUgKHJvb3QpIC0+XG4gICAgICAgICAgICBwLmluZGV4T2Yocm9vdCkgaXMgMFxuXG4gICAgICAgICAgdW5sZXNzIGlzRGVzY2VuZGVudE9mUm9vdFBhdGhzXG4gICAgICAgICAgICByZXN1bHRzLnJlbW92ZWQgPz0gW11cbiAgICAgICAgICAgIHJlc3VsdHMucmVtb3ZlZC5wdXNoKHApXG5cbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuXG4gIHVwZGF0ZVBhdGhzOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKSB1bmxlc3MgQGluaXRpYWxpemVkXG5cbiAgICBAbG9hZFBhdGhzKCkudGhlbiAoe2RpcnRpZWQsIHJlbW92ZWR9KSA9PlxuICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHJlbW92ZWQpXG5cbiAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApIC0+IHAgbm90IGluIHJlbW92ZWRcbiAgICAgIEBwYXRocy5wdXNoKHApIGZvciBwIGluIGRpcnRpZWQgd2hlbiBwIG5vdCBpbiBAcGF0aHNcblxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1wYXRocycsIEBnZXRQYXRocygpXG4gICAgICBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMoZGlydGllZClcblxuICBpc1ZhcmlhYmxlc1NvdXJjZVBhdGg6IChwYXRoKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgcGF0aFxuXG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcbiAgICBwYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocGF0aClcbiAgICBzb3VyY2VzID0gQGdldFNvdXJjZU5hbWVzKClcblxuICAgIHJldHVybiB0cnVlIGZvciBzb3VyY2UgaW4gc291cmNlcyB3aGVuIG1pbmltYXRjaChwYXRoLCBzb3VyY2UsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuXG4gIGlzSWdub3JlZFBhdGg6IChwYXRoKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgcGF0aFxuXG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcbiAgICBwYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocGF0aClcbiAgICBpZ25vcmVkTmFtZXMgPSBAZ2V0SWdub3JlZE5hbWVzKClcblxuICAgIHJldHVybiB0cnVlIGZvciBpZ25vcmUgaW4gaWdub3JlZE5hbWVzIHdoZW4gbWluaW1hdGNoKHBhdGgsIGlnbm9yZSwgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUpXG5cbiAgc2NvcGVGcm9tRmlsZU5hbWU6IChwYXRoKSAtPlxuICAgIHNjb3BlRnJvbUZpbGVOYW1lID89IHJlcXVpcmUgJy4vc2NvcGUtZnJvbS1maWxlLW5hbWUnXG5cbiAgICBzY29wZSA9IHNjb3BlRnJvbUZpbGVOYW1lKHBhdGgpXG5cbiAgICBpZiBzY29wZSBpcyAnc2Fzcycgb3Igc2NvcGUgaXMgJ3Njc3MnXG4gICAgICBzY29wZSA9IFtzY29wZSwgQGdldFNhc3NTY29wZVN1ZmZpeCgpXS5qb2luKCc6JylcblxuICAgIHNjb3BlXG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICAjIyAgICMjICAjIyMjIyMjIyMgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBnZXRQYWxldHRlOiAtPlxuICAgIFBhbGV0dGUgPz0gcmVxdWlyZSAnLi9wYWxldHRlJ1xuXG4gICAgcmV0dXJuIG5ldyBQYWxldHRlIHVubGVzcyBAaXNJbml0aWFsaXplZCgpXG4gICAgbmV3IFBhbGV0dGUoQGdldENvbG9yVmFyaWFibGVzKCkpXG5cbiAgZ2V0Q29udGV4dDogLT4gQHZhcmlhYmxlcy5nZXRDb250ZXh0KClcblxuICBnZXRWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzKClcblxuICBnZXRWYXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnk6IC0+IEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnlcblxuICBnZXRWYXJpYWJsZUJ5SWQ6IChpZCkgLT4gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5SWQoaWQpXG5cbiAgZ2V0VmFyaWFibGVCeU5hbWU6IChuYW1lKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlQnlOYW1lKG5hbWUpXG5cbiAgZ2V0Q29sb3JWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXMuZ2V0Q29sb3JWYXJpYWJsZXMoKVxuXG4gIGdldENvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeTogLT4gQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuXG4gIHNob3dWYXJpYWJsZUluRmlsZTogKHZhcmlhYmxlKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odmFyaWFibGUucGF0aCkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBSYW5nZT9cblxuICAgICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICAgIGJ1ZmZlclJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCBbXG4gICAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHZhcmlhYmxlLnJhbmdlWzBdKVxuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVsxXSlcbiAgICAgIF1cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoYnVmZmVyUmFuZ2UsIGF1dG9zY3JvbGw6IHRydWUpXG5cbiAgZW1pdFZhcmlhYmxlc0NoYW5nZUV2ZW50OiAocmVzdWx0cykgLT5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLXZhcmlhYmxlcycsIHJlc3VsdHNcblxuICBsb2FkVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEBsb2FkVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgbG9hZFZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBzY2FuUGF0aHNGb3JWYXJpYWJsZXMgcGF0aHMsIChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpXG5cbiAgZ2V0VmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzRm9yUGF0aChwYXRoKVxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG5cbiAgZGVsZXRlVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyBbcGF0aF1cblxuICBkZWxldGVWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIEB2YXJpYWJsZXMuZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG5cbiAgcmVsb2FkVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEByZWxvYWRWYXJpYWJsZXNGb3JQYXRocyBbcGF0aF1cblxuICByZWxvYWRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIHByb21pc2UgPSBAaW5pdGlhbGl6ZSgpIHVubGVzcyBAaXNJbml0aWFsaXplZCgpXG5cbiAgICBwcm9taXNlXG4gICAgLnRoZW4gPT5cbiAgICAgIGlmIHBhdGhzLnNvbWUoKHBhdGgpID0+IHBhdGggbm90IGluIEBwYXRocylcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcblxuICAgICAgQGxvYWRWYXJpYWJsZXNGb3JQYXRocyhwYXRocylcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEB2YXJpYWJsZXMudXBkYXRlQ29sbGVjdGlvbihyZXN1bHRzLCBwYXRocylcblxuICBzY2FuUGF0aHNGb3JWYXJpYWJsZXM6IChwYXRocywgY2FsbGJhY2spIC0+XG4gICAgaWYgcGF0aHMubGVuZ3RoIGlzIDEgYW5kIGNvbG9yQnVmZmVyID0gQGNvbG9yQnVmZmVyRm9yUGF0aChwYXRoc1swXSlcbiAgICAgIGNvbG9yQnVmZmVyLnNjYW5CdWZmZXJGb3JWYXJpYWJsZXMoKS50aGVuIChyZXN1bHRzKSAtPiBjYWxsYmFjayhyZXN1bHRzKVxuICAgIGVsc2VcbiAgICAgIFBhdGhzU2Nhbm5lciA/PSByZXF1aXJlICcuL3BhdGhzLXNjYW5uZXInXG5cbiAgICAgIFBhdGhzU2Nhbm5lci5zdGFydFRhc2sgcGF0aHMubWFwKChwKSA9PiBbcCwgQHNjb3BlRnJvbUZpbGVOYW1lKHApXSksIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnksIChyZXN1bHRzKSAtPiBjYWxsYmFjayhyZXN1bHRzKVxuXG4gIGxvYWRUaGVtZXNWYXJpYWJsZXM6IC0+XG4gICAge1RIRU1FX1ZBUklBQkxFU30gPSByZXF1aXJlICcuL3VyaXMnIHVubGVzcyBUSEVNRV9WQVJJQUJMRVM/XG4gICAgQVRPTV9WQVJJQUJMRVMgPz0gcmVxdWlyZSAnLi9hdG9tLXZhcmlhYmxlcydcblxuICAgIGl0ZXJhdG9yID0gMFxuICAgIHZhcmlhYmxlcyA9IFtdXG4gICAgaHRtbCA9ICcnXG4gICAgQVRPTV9WQVJJQUJMRVMuZm9yRWFjaCAodikgLT4gaHRtbCArPSBcIjxkaXYgY2xhc3M9JyN7dn0nPiN7dn08L2Rpdj5cIlxuXG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NOYW1lID0gJ3BpZ21lbnRzLXNhbXBsZXInXG4gICAgZGl2LmlubmVySFRNTCA9IGh0bWxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdilcblxuICAgIEFUT01fVkFSSUFCTEVTLmZvckVhY2ggKHYsaSkgLT5cbiAgICAgIG5vZGUgPSBkaXYuY2hpbGRyZW5baV1cbiAgICAgIGNvbG9yID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5jb2xvclxuICAgICAgZW5kID0gaXRlcmF0b3IgKyB2Lmxlbmd0aCArIGNvbG9yLmxlbmd0aCArIDRcblxuICAgICAgdmFyaWFibGUgPVxuICAgICAgICBuYW1lOiBcIkAje3Z9XCJcbiAgICAgICAgbGluZTogaVxuICAgICAgICB2YWx1ZTogY29sb3JcbiAgICAgICAgcmFuZ2U6IFtpdGVyYXRvcixlbmRdXG4gICAgICAgIHBhdGg6IFRIRU1FX1ZBUklBQkxFU1xuXG4gICAgICBpdGVyYXRvciA9IGVuZFxuICAgICAgdmFyaWFibGVzLnB1c2godmFyaWFibGUpXG5cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdilcbiAgICByZXR1cm4gdmFyaWFibGVzXG5cbiAgIyMgICAgICMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyAjIyAgICAjIyAgIyMjIyMjICAgICMjIyMjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjIyAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjIyMgICMjICMjICAgICAgICAjI1xuICAjIyAgICAgIyMjIyMjICAjIyMjIyMgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICMjICMjICMjICAgIyMjIyAgIyMjIyMjXG4gICMjICAgICAgICAgICMjICMjICAgICAgICAgICMjICAgICAgICMjICAgICAjIyAgIyMgICMjIyMgIyMgICAgIyMgICAgICAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICAgICMjICAgICAgICMjICAgICAjIyAgIyMgICAjIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICAgICMjICAgICAgICMjICAgICMjIyMgIyMgICAgIyMgICMjIyMjIyAgICAjIyMjIyNcblxuICBnZXRSb290UGF0aHM6IC0+IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG5cbiAgZ2V0U2Fzc1Njb3BlU3VmZml4OiAtPlxuICAgIEBzYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24gPyBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicpID8gJ2NvbXBhc3MnXG5cbiAgc2V0U2Fzc1NoYWRlQW5kVGludEltcGxlbWVudGF0aW9uOiAoQHNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbikgLT5cbiAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgIHJlZ2lzdHJ5OiBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gICAgfVxuXG4gIGdldFNvdXJjZU5hbWVzOiAtPlxuICAgIG5hbWVzID0gWycucGlnbWVudHMnXVxuICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KEBzb3VyY2VOYW1lcyA/IFtdKVxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsU291cmNlTmFtZXNcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc291cmNlTmFtZXMnKSA/IFtdKVxuICAgIG5hbWVzXG5cbiAgc2V0U291cmNlTmFtZXM6IChAc291cmNlTmFtZXM9W10pIC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAaW5pdGlhbGl6ZWQ/IGFuZCBub3QgQGluaXRpYWxpemVQcm9taXNlP1xuXG4gICAgQGluaXRpYWxpemUoKS50aGVuID0+IEBsb2FkUGF0aHNBbmRWYXJpYWJsZXModHJ1ZSlcblxuICBzZXRJZ25vcmVHbG9iYWxTb3VyY2VOYW1lczogKEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcykgLT5cbiAgICBAdXBkYXRlUGF0aHMoKVxuXG4gIGdldFNlYXJjaE5hbWVzOiAtPlxuICAgIG5hbWVzID0gW11cbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc291cmNlTmFtZXMgPyBbXSlcbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc2VhcmNoTmFtZXMgPyBbXSlcbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykgPyBbXSlcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuZXh0ZW5kZWRTZWFyY2hOYW1lcycpID8gW10pXG4gICAgbmFtZXNcblxuICBzZXRTZWFyY2hOYW1lczogKEBzZWFyY2hOYW1lcz1bXSkgLT5cblxuICBzZXRJZ25vcmVHbG9iYWxTZWFyY2hOYW1lczogKEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lcykgLT5cblxuICBnZXRJZ25vcmVkTmFtZXM6IC0+XG4gICAgbmFtZXMgPSBAaWdub3JlZE5hbWVzID8gW11cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lc1xuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQGdldEdsb2JhbElnbm9yZWROYW1lcygpID8gW10pXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJykgPyBbXSlcbiAgICBuYW1lc1xuXG4gIGdldEdsb2JhbElnbm9yZWROYW1lczogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpPy5tYXAgKHApIC0+XG4gICAgICBpZiAvXFwvXFwqJC8udGVzdChwKSB0aGVuIHAgKyAnKicgZWxzZSBwXG5cbiAgc2V0SWdub3JlZE5hbWVzOiAoQGlnbm9yZWROYW1lcz1bXSkgLT5cbiAgICBpZiBub3QgQGluaXRpYWxpemVkPyBhbmQgbm90IEBpbml0aWFsaXplUHJvbWlzZT9cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnUHJvamVjdCBpcyBub3QgaW5pdGlhbGl6ZWQgeWV0JylcblxuICAgIEBpbml0aWFsaXplKCkudGhlbiA9PlxuICAgICAgZGlydGllZCA9IEBwYXRocy5maWx0ZXIgKHApID0+IEBpc0lnbm9yZWRQYXRoKHApXG4gICAgICBAZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMoZGlydGllZClcblxuICAgICAgQHBhdGhzID0gQHBhdGhzLmZpbHRlciAocCkgPT4gIUBpc0lnbm9yZWRQYXRoKHApXG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKHRydWUpXG5cbiAgc2V0SWdub3JlR2xvYmFsSWdub3JlZE5hbWVzOiAoQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcykgLT5cbiAgICBAdXBkYXRlUGF0aHMoKVxuXG4gIGdldElnbm9yZWRTY29wZXM6IC0+XG4gICAgc2NvcGVzID0gQGlnbm9yZWRTY29wZXMgPyBbXVxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blc1xuICAgICAgc2NvcGVzID0gc2NvcGVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWRTY29wZXMnKSA/IFtdKVxuXG4gICAgc2NvcGVzID0gc2NvcGVzLmNvbmNhdChAaWdub3JlZEZpbGV0eXBlcylcbiAgICBzY29wZXNcblxuICBzZXRJZ25vcmVkU2NvcGVzOiAoQGlnbm9yZWRTY29wZXM9W10pIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgc2V0SWdub3JlR2xvYmFsSWdub3JlZFNjb3BlczogKEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHNldFN1cHBvcnRlZEZpbGV0eXBlczogKEBzdXBwb3J0ZWRGaWxldHlwZXM9W10pIC0+XG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHVwZGF0ZUlnbm9yZWRGaWxldHlwZXM6IC0+XG4gICAgQGlnbm9yZWRGaWxldHlwZXMgPSBAZ2V0SWdub3JlZEZpbGV0eXBlcygpXG5cbiAgZ2V0SWdub3JlZEZpbGV0eXBlczogLT5cbiAgICBmaWxldHlwZXMgPSBAc3VwcG9ydGVkRmlsZXR5cGVzID8gW11cblxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzXG4gICAgICBmaWxldHlwZXMgPSBmaWxldHlwZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc3VwcG9ydGVkRmlsZXR5cGVzJykgPyBbXSlcblxuICAgIGZpbGV0eXBlcyA9IFsnKiddIGlmIGZpbGV0eXBlcy5sZW5ndGggaXMgMFxuXG4gICAgcmV0dXJuIFtdIGlmIGZpbGV0eXBlcy5zb21lICh0eXBlKSAtPiB0eXBlIGlzICcqJ1xuXG4gICAgc2NvcGVzID0gZmlsZXR5cGVzLm1hcCAoZXh0KSAtPlxuICAgICAgYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKFwiZmlsZS4je2V4dH1cIik/LnNjb3BlTmFtZS5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJylcbiAgICAuZmlsdGVyIChzY29wZSkgLT4gc2NvcGU/XG5cbiAgICBbXCJeKD8hXFxcXC4oI3tzY29wZXMuam9pbignfCcpfSkpXCJdXG5cbiAgc2V0SWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzOiAoQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcykgLT5cbiAgICBAdXBkYXRlSWdub3JlZEZpbGV0eXBlcygpXG4gICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgdGhlbWVzSW5jbHVkZWQ6IC0+IEBpbmNsdWRlVGhlbWVzXG5cbiAgc2V0SW5jbHVkZVRoZW1lczogKGluY2x1ZGVUaGVtZXMpIC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpIGlmIGluY2x1ZGVUaGVtZXMgaXMgQGluY2x1ZGVUaGVtZXNcblxuICAgIEBpbmNsdWRlVGhlbWVzID0gaW5jbHVkZVRoZW1lc1xuICAgIGlmIEBpbmNsdWRlVGhlbWVzXG4gICAgICBAaW5jbHVkZVRoZW1lc1ZhcmlhYmxlcygpXG4gICAgZWxzZVxuICAgICAgQGRpc3Bvc2VUaGVtZXNWYXJpYWJsZXMoKVxuXG4gIGluY2x1ZGVUaGVtZXNWYXJpYWJsZXM6IC0+XG4gICAgQHRoZW1lc1N1YnNjcmlwdGlvbiA9IGF0b20udGhlbWVzLm9uRGlkQ2hhbmdlQWN0aXZlVGhlbWVzID0+XG4gICAgICByZXR1cm4gdW5sZXNzIEBpbmNsdWRlVGhlbWVzXG5cbiAgICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuXG4gICAgICB2YXJpYWJsZXMgPSBAbG9hZFRoZW1lc1ZhcmlhYmxlcygpXG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZVBhdGhDb2xsZWN0aW9uKFRIRU1FX1ZBUklBQkxFUywgdmFyaWFibGVzKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB0aGVtZXNTdWJzY3JpcHRpb25cbiAgICBAdmFyaWFibGVzLmFkZE1hbnkoQGxvYWRUaGVtZXNWYXJpYWJsZXMoKSlcblxuICBkaXNwb3NlVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuXG4gICAgQHN1YnNjcmlwdGlvbnMucmVtb3ZlIEB0aGVtZXNTdWJzY3JpcHRpb25cbiAgICBAdmFyaWFibGVzLmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKFtUSEVNRV9WQVJJQUJMRVNdKVxuICAgIEB0aGVtZXNTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG5cbiAgZ2V0VGltZXN0YW1wOiAtPiBuZXcgRGF0ZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHVubGVzcyBTRVJJQUxJWkVfVkVSU0lPTj9cbiAgICAgIHtTRVJJQUxJWkVfVkVSU0lPTiwgU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTn0gPSByZXF1aXJlICcuL3ZlcnNpb25zJ1xuXG4gICAgZGF0YSA9XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdDb2xvclByb2plY3QnXG4gICAgICB0aW1lc3RhbXA6IEBnZXRUaW1lc3RhbXAoKVxuICAgICAgdmVyc2lvbjogU0VSSUFMSVpFX1ZFUlNJT05cbiAgICAgIG1hcmtlcnNWZXJzaW9uOiBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OXG4gICAgICBnbG9iYWxTb3VyY2VOYW1lczogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpXG4gICAgICBnbG9iYWxJZ25vcmVkTmFtZXM6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuaWdub3JlZE5hbWVzJylcblxuICAgIGlmIEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsU291cmNlTmFtZXMgPSBAaWdub3JlR2xvYmFsU291cmNlTmFtZXNcbiAgICBpZiBAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzID0gQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzXG4gICAgaWYgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsSWdub3JlZE5hbWVzID0gQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lc1xuICAgIGlmIEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzP1xuICAgICAgZGF0YS5pZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzID0gQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXNcbiAgICBpZiBAaW5jbHVkZVRoZW1lcz9cbiAgICAgIGRhdGEuaW5jbHVkZVRoZW1lcyA9IEBpbmNsdWRlVGhlbWVzXG4gICAgaWYgQGlnbm9yZWRTY29wZXM/XG4gICAgICBkYXRhLmlnbm9yZWRTY29wZXMgPSBAaWdub3JlZFNjb3Blc1xuICAgIGlmIEBpZ25vcmVkTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZWROYW1lcyA9IEBpZ25vcmVkTmFtZXNcbiAgICBpZiBAc291cmNlTmFtZXM/XG4gICAgICBkYXRhLnNvdXJjZU5hbWVzID0gQHNvdXJjZU5hbWVzXG4gICAgaWYgQHNlYXJjaE5hbWVzP1xuICAgICAgZGF0YS5zZWFyY2hOYW1lcyA9IEBzZWFyY2hOYW1lc1xuXG4gICAgZGF0YS5idWZmZXJzID0gQHNlcmlhbGl6ZUJ1ZmZlcnMoKVxuXG4gICAgaWYgQGlzSW5pdGlhbGl6ZWQoKVxuICAgICAgZGF0YS5wYXRocyA9IEBwYXRoc1xuICAgICAgZGF0YS52YXJpYWJsZXMgPSBAdmFyaWFibGVzLnNlcmlhbGl6ZSgpXG5cbiAgICBkYXRhXG5cbiAgc2VyaWFsaXplQnVmZmVyczogLT5cbiAgICBvdXQgPSB7fVxuICAgIGZvciBpZCxjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgb3V0W2lkXSA9IGNvbG9yQnVmZmVyLnNlcmlhbGl6ZSgpXG4gICAgb3V0XG4iXX0=

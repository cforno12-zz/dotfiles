(function() {
  var Color, ColorBuffer, ColorMarker, CompositeDisposable, Emitter, Range, Task, VariablesCollection, fs, ref,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Color = ref[0], ColorMarker = ref[1], VariablesCollection = ref[2], Emitter = ref[3], CompositeDisposable = ref[4], Task = ref[5], Range = ref[6], fs = ref[7];

  module.exports = ColorBuffer = (function() {
    function ColorBuffer(params) {
      var colorMarkers, ref1, saveSubscription, tokenized;
      if (params == null) {
        params = {};
      }
      if (Emitter == null) {
        ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Task = ref1.Task, Range = ref1.Range;
      }
      this.editor = params.editor, this.project = params.project, colorMarkers = params.colorMarkers;
      this.id = this.editor.id;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.ignoredScopes = [];
      this.colorMarkersByMarkerId = {};
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      tokenized = (function(_this) {
        return function() {
          var ref2;
          return (ref2 = _this.getColorMarkers()) != null ? ref2.forEach(function(marker) {
            return marker.checkMarkerScope(true);
          }) : void 0;
        };
      })(this);
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize(tokenized));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize(tokenized));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          if (_this.initialized && _this.variableInitialized) {
            _this.terminateRunningTask();
          }
          if (_this.timeout != null) {
            return clearTimeout(_this.timeout);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.delayBeforeScan === 0) {
            return _this.update();
          } else {
            if (_this.timeout != null) {
              clearTimeout(_this.timeout);
            }
            return _this.timeout = setTimeout(function() {
              _this.update();
              return _this.timeout = null;
            }, _this.delayBeforeScan);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangePath((function(_this) {
        return function(path) {
          if (_this.isVariablesSource()) {
            _this.project.appendPath(path);
          }
          return _this.update();
        };
      })(this)));
      if ((this.project.getPaths() != null) && this.isVariablesSource() && !this.project.hasPath(this.editor.getPath())) {
        if (fs == null) {
          fs = require('fs');
        }
        if (fs.existsSync(this.editor.getPath())) {
          this.project.appendPath(this.editor.getPath());
        } else {
          saveSubscription = this.editor.onDidSave((function(_this) {
            return function(arg) {
              var path;
              path = arg.path;
              _this.project.appendPath(path);
              _this.update();
              saveSubscription.dispose();
              return _this.subscriptions.remove(saveSubscription);
            };
          })(this));
          this.subscriptions.add(saveSubscription);
        }
      }
      this.subscriptions.add(this.project.onDidUpdateVariables((function(_this) {
        return function() {
          if (!_this.variableInitialized) {
            return;
          }
          return _this.scanBufferForColors().then(function(results) {
            return _this.updateColorMarkers(results);
          });
        };
      })(this)));
      this.subscriptions.add(this.project.onDidChangeIgnoredScopes((function(_this) {
        return function() {
          return _this.updateIgnoredScopes();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.delayBeforeScan', (function(_this) {
        return function(delayBeforeScan) {
          _this.delayBeforeScan = delayBeforeScan != null ? delayBeforeScan : 0;
        };
      })(this)));
      if (this.editor.addMarkerLayer != null) {
        this.markerLayer = this.editor.addMarkerLayer();
      } else {
        this.markerLayer = this.editor;
      }
      if (colorMarkers != null) {
        this.restoreMarkersState(colorMarkers);
        this.cleanUnusedTextEditorMarkers();
      }
      this.updateIgnoredScopes();
      this.initialize();
    }

    ColorBuffer.prototype.onDidUpdateColorMarkers = function(callback) {
      return this.emitter.on('did-update-color-markers', callback);
    };

    ColorBuffer.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorBuffer.prototype.initialize = function() {
      if (this.colorMarkers != null) {
        return Promise.resolve();
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      this.updateVariableRanges();
      this.initializePromise = this.scanBufferForColors().then((function(_this) {
        return function(results) {
          return _this.createColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function(results) {
          _this.colorMarkers = results;
          return _this.initialized = true;
        };
      })(this));
      this.initializePromise.then((function(_this) {
        return function() {
          return _this.variablesAvailable();
        };
      })(this));
      return this.initializePromise;
    };

    ColorBuffer.prototype.restoreMarkersState = function(colorMarkers) {
      if (Color == null) {
        Color = require('./color');
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      this.updateVariableRanges();
      return this.colorMarkers = colorMarkers.filter(function(state) {
        return state != null;
      }).map((function(_this) {
        return function(state) {
          var color, marker, ref1;
          marker = (ref1 = _this.editor.getMarker(state.markerId)) != null ? ref1 : _this.markerLayer.markBufferRange(state.bufferRange, {
            invalidate: 'touch'
          });
          color = new Color(state.color);
          color.variables = state.variables;
          color.invalid = state.invalid;
          return _this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
            marker: marker,
            color: color,
            text: state.text,
            colorBuffer: _this
          });
        };
      })(this));
    };

    ColorBuffer.prototype.cleanUnusedTextEditorMarkers = function() {
      return this.markerLayer.findMarkers().forEach((function(_this) {
        return function(m) {
          if (_this.colorMarkersByMarkerId[m.id] == null) {
            return m.destroy();
          }
        };
      })(this));
    };

    ColorBuffer.prototype.variablesAvailable = function() {
      if (this.variablesPromise != null) {
        return this.variablesPromise;
      }
      return this.variablesPromise = this.project.initialize().then((function(_this) {
        return function(results) {
          if (_this.destroyed) {
            return;
          }
          if (results == null) {
            return;
          }
          if (_this.isIgnored() && _this.isVariablesSource()) {
            return _this.scanBufferForVariables();
          }
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.variableInitialized = true;
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.update = function() {
      var promise;
      this.terminateRunningTask();
      promise = this.isIgnored() ? this.scanBufferForVariables() : !this.isVariablesSource() ? Promise.resolve([]) : this.project.reloadVariablesForPath(this.editor.getPath());
      return promise.then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.terminateRunningTask = function() {
      var ref1;
      return (ref1 = this.task) != null ? ref1.terminate() : void 0;
    };

    ColorBuffer.prototype.destroy = function() {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.terminateRunningTask();
      this.subscriptions.dispose();
      if ((ref1 = this.colorMarkers) != null) {
        ref1.forEach(function(marker) {
          return marker.destroy();
        });
      }
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    ColorBuffer.prototype.isVariablesSource = function() {
      return this.project.isVariablesSourcePath(this.editor.getPath());
    };

    ColorBuffer.prototype.isIgnored = function() {
      var p;
      p = this.editor.getPath();
      return this.project.isIgnoredPath(p) || !atom.project.contains(p);
    };

    ColorBuffer.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorBuffer.prototype.getPath = function() {
      return this.editor.getPath();
    };

    ColorBuffer.prototype.getScope = function() {
      return this.project.scopeFromFileName(this.getPath());
    };

    ColorBuffer.prototype.updateIgnoredScopes = function() {
      var ref1;
      this.ignoredScopes = this.project.getIgnoredScopes().map(function(scope) {
        try {
          return new RegExp(scope);
        } catch (error) {}
      }).filter(function(re) {
        return re != null;
      });
      if ((ref1 = this.getColorMarkers()) != null) {
        ref1.forEach(function(marker) {
          return marker.checkMarkerScope(true);
        });
      }
      return this.emitter.emit('did-update-color-markers', {
        created: [],
        destroyed: []
      });
    };

    ColorBuffer.prototype.updateVariableRanges = function() {
      var variablesForBuffer;
      variablesForBuffer = this.project.getVariablesForPath(this.editor.getPath());
      return variablesForBuffer.forEach((function(_this) {
        return function(variable) {
          return variable.bufferRange != null ? variable.bufferRange : variable.bufferRange = Range.fromObject([_this.editor.getBuffer().positionForCharacterIndex(variable.range[0]), _this.editor.getBuffer().positionForCharacterIndex(variable.range[1])]);
        };
      })(this));
    };

    ColorBuffer.prototype.scanBufferForVariables = function() {
      var buffer, config, editor, results, taskPath;
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (!this.editor.getPath()) {
        return Promise.resolve([]);
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-variables-handler');
      editor = this.editor;
      buffer = this.editor.getBuffer();
      config = {
        buffer: this.editor.getText(),
        registry: this.project.getVariableExpressionsRegistry().serialize(),
        scope: this.getScope()
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:variables-found', function(variables) {
            return results = results.concat(variables.map(function(variable) {
              variable.path = editor.getPath();
              variable.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
              return variable;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.getMarkerLayer = function() {
      return this.markerLayer;
    };

    ColorBuffer.prototype.getColorMarkers = function() {
      return this.colorMarkers;
    };

    ColorBuffer.prototype.getValidColorMarkers = function() {
      var ref1, ref2;
      return (ref1 = (ref2 = this.getColorMarkers()) != null ? ref2.filter(function(m) {
        var ref3;
        return ((ref3 = m.color) != null ? ref3.isValid() : void 0) && !m.isIgnored();
      }) : void 0) != null ? ref1 : [];
    };

    ColorBuffer.prototype.getColorMarkerAtBufferPosition = function(bufferPosition) {
      var i, len, marker, markers;
      markers = this.markerLayer.findMarkers({
        containsBufferPosition: bufferPosition
      });
      for (i = 0, len = markers.length; i < len; i++) {
        marker = markers[i];
        if (this.colorMarkersByMarkerId[marker.id] != null) {
          return this.colorMarkersByMarkerId[marker.id];
        }
      }
    };

    ColorBuffer.prototype.createColorMarkers = function(results) {
      if (this.destroyed) {
        return Promise.resolve([]);
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var newResults, processResults;
          newResults = [];
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            if (_this.editor.isDestroyed()) {
              return resolve([]);
            }
            while (results.length) {
              result = results.shift();
              marker = _this.markerLayer.markBufferRange(result.bufferRange, {
                invalidate: 'touch'
              });
              newResults.push(_this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
                marker: marker,
                color: result.color,
                text: result.match,
                colorBuffer: _this
              }));
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve(newResults);
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.findExistingMarkers = function(results) {
      var newMarkers, toCreate;
      newMarkers = [];
      toCreate = [];
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var processResults;
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            while (results.length) {
              result = results.shift();
              if (marker = _this.findColorMarker(result)) {
                newMarkers.push(marker);
              } else {
                toCreate.push(result);
              }
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve({
              newMarkers: newMarkers,
              toCreate: toCreate
            });
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.updateColorMarkers = function(results) {
      var createdMarkers, newMarkers;
      newMarkers = null;
      createdMarkers = null;
      return this.findExistingMarkers(results).then((function(_this) {
        return function(arg) {
          var markers, toCreate;
          markers = arg.newMarkers, toCreate = arg.toCreate;
          newMarkers = markers;
          return _this.createColorMarkers(toCreate);
        };
      })(this)).then((function(_this) {
        return function(results) {
          var toDestroy;
          createdMarkers = results;
          newMarkers = newMarkers.concat(results);
          if (_this.colorMarkers != null) {
            toDestroy = _this.colorMarkers.filter(function(marker) {
              return indexOf.call(newMarkers, marker) < 0;
            });
            toDestroy.forEach(function(marker) {
              delete _this.colorMarkersByMarkerId[marker.id];
              return marker.destroy();
            });
          } else {
            toDestroy = [];
          }
          _this.colorMarkers = newMarkers;
          return _this.emitter.emit('did-update-color-markers', {
            created: createdMarkers,
            destroyed: toDestroy
          });
        };
      })(this));
    };

    ColorBuffer.prototype.findColorMarker = function(properties) {
      var i, len, marker, ref1;
      if (properties == null) {
        properties = {};
      }
      if (this.colorMarkers == null) {
        return;
      }
      ref1 = this.colorMarkers;
      for (i = 0, len = ref1.length; i < len; i++) {
        marker = ref1[i];
        if (marker != null ? marker.match(properties) : void 0) {
          return marker;
        }
      }
    };

    ColorBuffer.prototype.findColorMarkers = function(properties) {
      var markers;
      if (properties == null) {
        properties = {};
      }
      markers = this.markerLayer.findMarkers(properties);
      return markers.map((function(_this) {
        return function(marker) {
          return _this.colorMarkersByMarkerId[marker.id];
        };
      })(this)).filter(function(marker) {
        return marker != null;
      });
    };

    ColorBuffer.prototype.findValidColorMarkers = function(properties) {
      return this.findColorMarkers(properties).filter((function(_this) {
        return function(marker) {
          var ref1;
          return (marker != null) && ((ref1 = marker.color) != null ? ref1.isValid() : void 0) && !(marker != null ? marker.isIgnored() : void 0);
        };
      })(this));
    };

    ColorBuffer.prototype.selectColorMarkerAndOpenPicker = function(colorMarker) {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.editor.setSelectedBufferRange(colorMarker.marker.getBufferRange());
      if (!((ref1 = this.editor.getSelectedText()) != null ? ref1.match(/^#[0-9a-fA-F]{3,8}$/) : void 0)) {
        return;
      }
      if (this.project.colorPickerAPI != null) {
        return this.project.colorPickerAPI.open(this.editor, this.editor.getLastCursor());
      }
    };

    ColorBuffer.prototype.scanBufferForColors = function(options) {
      var buffer, collection, config, ref1, ref2, ref3, ref4, ref5, registry, results, taskPath, variables;
      if (options == null) {
        options = {};
      }
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (Color == null) {
        Color = require('./color');
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-colors-handler');
      buffer = this.editor.getBuffer();
      registry = this.project.getColorExpressionsRegistry().serialize();
      if (options.variables != null) {
        if (VariablesCollection == null) {
          VariablesCollection = require('./variables-collection');
        }
        collection = new VariablesCollection();
        collection.addMany(options.variables);
        options.variables = collection;
      }
      variables = this.isVariablesSource() ? ((ref2 = (ref3 = options.variables) != null ? ref3.getVariables() : void 0) != null ? ref2 : []).concat((ref1 = this.project.getVariables()) != null ? ref1 : []) : (ref4 = (ref5 = options.variables) != null ? ref5.getVariables() : void 0) != null ? ref4 : [];
      delete registry.expressions['pigments:variables'];
      delete registry.regexpString;
      config = {
        buffer: this.editor.getText(),
        bufferPath: this.getPath(),
        scope: this.getScope(),
        variables: variables,
        colorVariables: variables.filter(function(v) {
          return v.isColor;
        }),
        registry: registry
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:colors-found', function(colors) {
            return results = results.concat(colors.map(function(res) {
              res.color = new Color(res.color);
              res.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(res.range[0]), buffer.positionForCharacterIndex(res.range[1])]);
              return res;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.serialize = function() {
      var ref1;
      return {
        id: this.id,
        path: this.editor.getPath(),
        colorMarkers: (ref1 = this.colorMarkers) != null ? ref1.map(function(marker) {
          return marker.serialize();
        }) : void 0
      };
    };

    return ColorBuffer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItYnVmZmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTs7RUFBQSxNQUlJLEVBSkosRUFDRSxjQURGLEVBQ1Msb0JBRFQsRUFDc0IsNEJBRHRCLEVBRUUsZ0JBRkYsRUFFVyw0QkFGWCxFQUVnQyxhQUZoQyxFQUVzQyxjQUZ0QyxFQUdFOztFQUdGLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxxQkFBQyxNQUFEO0FBQ1gsVUFBQTs7UUFEWSxTQUFPOztNQUNuQixJQUFPLGVBQVA7UUFDRSxPQUE4QyxPQUFBLENBQVEsTUFBUixDQUE5QyxFQUFDLHNCQUFELEVBQVUsOENBQVYsRUFBK0IsZ0JBQS9CLEVBQXFDLG1CQUR2Qzs7TUFHQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxpQkFBQSxPQUFYLEVBQW9CO01BQ25CLElBQUMsQ0FBQSxLQUFNLElBQUMsQ0FBQSxPQUFQO01BQ0YsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFlO01BRWYsSUFBQyxDQUFBLHNCQUFELEdBQTBCO01BRTFCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkI7TUFFQSxTQUFBLEdBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ1YsY0FBQTtnRUFBa0IsQ0FBRSxPQUFwQixDQUE0QixTQUFDLE1BQUQ7bUJBQzFCLE1BQU0sQ0FBQyxn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O1VBRkYsQ0FITTtpQkFRUixLQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUywwQkFBVCxFQUFxQyxTQUFDLE1BQUQ7bUJBQ25DLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxHQUFEO2NBQ2xDLEdBQUcsQ0FBQyxLQUFKLEdBQWdCLElBQUEsS0FBQSxDQUFNLEdBQUcsQ0FBQyxLQUFWO2NBQ2hCLEdBQUcsQ0FBQyxXQUFKLEdBQWtCLEtBQUssQ0FBQyxVQUFOLENBQWlCLENBQ2pDLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBM0MsQ0FEaUMsRUFFakMsTUFBTSxDQUFDLHlCQUFQLENBQWlDLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUEzQyxDQUZpQyxDQUFqQjtxQkFJbEI7WUFOa0MsQ0FBWCxDQUFmO1VBRHlCLENBQXJDO1FBVFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUF0Q2U7OzBCQXdEckIsU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO2FBQUE7UUFDRyxJQUFELElBQUMsQ0FBQSxFQURIO1FBRUUsSUFBQSxFQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBRlI7UUFHRSxZQUFBLDJDQUEyQixDQUFFLEdBQWYsQ0FBbUIsU0FBQyxNQUFEO2lCQUMvQixNQUFNLENBQUMsU0FBUCxDQUFBO1FBRCtCLENBQW5CLFVBSGhCOztJQURTOzs7OztBQXpiYiIsInNvdXJjZXNDb250ZW50IjpbIltcbiAgQ29sb3IsIENvbG9yTWFya2VyLCBWYXJpYWJsZXNDb2xsZWN0aW9uLFxuICBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBUYXNrLCBSYW5nZSxcbiAgZnNcbl0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvckJ1ZmZlclxuICBjb25zdHJ1Y3RvcjogKHBhcmFtcz17fSkgLT5cbiAgICB1bmxlc3MgRW1pdHRlcj9cbiAgICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBUYXNrLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuXG4gICAge0BlZGl0b3IsIEBwcm9qZWN0LCBjb2xvck1hcmtlcnN9ID0gcGFyYW1zXG4gICAge0BpZH0gPSBAZWRpdG9yXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaWdub3JlZFNjb3Blcz1bXVxuXG4gICAgQGNvbG9yTWFya2Vyc0J5TWFya2VySWQgPSB7fVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWREZXN0cm95ID0+IEBkZXN0cm95KClcblxuICAgIHRva2VuaXplZCA9ID0+XG4gICAgICBAZ2V0Q29sb3JNYXJrZXJzKCk/LmZvckVhY2ggKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNoZWNrTWFya2VyU2NvcGUodHJ1ZSlcblxuICAgIGlmIEBlZGl0b3Iub25EaWRUb2tlbml6ZT9cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkVG9rZW5pemUodG9rZW5pemVkKVxuICAgIGVsc2VcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLmRpc3BsYXlCdWZmZXIub25EaWRUb2tlbml6ZSh0b2tlbml6ZWQpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZSA9PlxuICAgICAgQHRlcm1pbmF0ZVJ1bm5pbmdUYXNrKCkgaWYgQGluaXRpYWxpemVkIGFuZCBAdmFyaWFibGVJbml0aWFsaXplZFxuICAgICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nID0+XG4gICAgICBpZiBAZGVsYXlCZWZvcmVTY2FuIGlzIDBcbiAgICAgICAgQHVwZGF0ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgIEB1cGRhdGUoKVxuICAgICAgICAgIEB0aW1lb3V0ID0gbnVsbFxuICAgICAgICAsIEBkZWxheUJlZm9yZVNjYW5cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlUGF0aCAocGF0aCkgPT5cbiAgICAgIEBwcm9qZWN0LmFwcGVuZFBhdGgocGF0aCkgaWYgQGlzVmFyaWFibGVzU291cmNlKClcbiAgICAgIEB1cGRhdGUoKVxuXG4gICAgaWYgQHByb2plY3QuZ2V0UGF0aHMoKT8gYW5kIEBpc1ZhcmlhYmxlc1NvdXJjZSgpIGFuZCAhQHByb2plY3QuaGFzUGF0aChAZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGZzID89IHJlcXVpcmUgJ2ZzJ1xuXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKEBlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICBAcHJvamVjdC5hcHBlbmRQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgZWxzZVxuICAgICAgICBzYXZlU3Vic2NyaXB0aW9uID0gQGVkaXRvci5vbkRpZFNhdmUgKHtwYXRofSkgPT5cbiAgICAgICAgICBAcHJvamVjdC5hcHBlbmRQYXRoKHBhdGgpXG4gICAgICAgICAgQHVwZGF0ZSgpXG4gICAgICAgICAgc2F2ZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgICBAc3Vic2NyaXB0aW9ucy5yZW1vdmUoc2F2ZVN1YnNjcmlwdGlvbilcblxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoc2F2ZVN1YnNjcmlwdGlvbilcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcHJvamVjdC5vbkRpZFVwZGF0ZVZhcmlhYmxlcyA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAdmFyaWFibGVJbml0aWFsaXplZFxuICAgICAgQHNjYW5CdWZmZXJGb3JDb2xvcnMoKS50aGVuIChyZXN1bHRzKSA9PiBAdXBkYXRlQ29sb3JNYXJrZXJzKHJlc3VsdHMpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHByb2plY3Qub25EaWRDaGFuZ2VJZ25vcmVkU2NvcGVzID0+XG4gICAgICBAdXBkYXRlSWdub3JlZFNjb3BlcygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuZGVsYXlCZWZvcmVTY2FuJywgKEBkZWxheUJlZm9yZVNjYW49MCkgPT5cblxuICAgIGlmIEBlZGl0b3IuYWRkTWFya2VyTGF5ZXI/XG4gICAgICBAbWFya2VyTGF5ZXIgPSBAZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICBlbHNlXG4gICAgICBAbWFya2VyTGF5ZXIgPSBAZWRpdG9yXG5cbiAgICBpZiBjb2xvck1hcmtlcnM/XG4gICAgICBAcmVzdG9yZU1hcmtlcnNTdGF0ZShjb2xvck1hcmtlcnMpXG4gICAgICBAY2xlYW5VbnVzZWRUZXh0RWRpdG9yTWFya2VycygpXG5cbiAgICBAdXBkYXRlSWdub3JlZFNjb3BlcygpXG4gICAgQGluaXRpYWxpemUoKVxuXG4gIG9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycycsIGNhbGxiYWNrXG5cbiAgb25EaWREZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1kZXN0cm95JywgY2FsbGJhY2tcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKSBpZiBAY29sb3JNYXJrZXJzP1xuICAgIHJldHVybiBAaW5pdGlhbGl6ZVByb21pc2UgaWYgQGluaXRpYWxpemVQcm9taXNlP1xuXG4gICAgQHVwZGF0ZVZhcmlhYmxlUmFuZ2VzKClcblxuICAgIEBpbml0aWFsaXplUHJvbWlzZSA9IEBzY2FuQnVmZmVyRm9yQ29sb3JzKCkudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEBjcmVhdGVDb2xvck1hcmtlcnMocmVzdWx0cylcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEBjb2xvck1hcmtlcnMgPSByZXN1bHRzXG4gICAgICBAaW5pdGlhbGl6ZWQgPSB0cnVlXG5cbiAgICBAaW5pdGlhbGl6ZVByb21pc2UudGhlbiA9PiBAdmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgIEBpbml0aWFsaXplUHJvbWlzZVxuXG4gIHJlc3RvcmVNYXJrZXJzU3RhdGU6IChjb2xvck1hcmtlcnMpIC0+XG4gICAgQ29sb3IgPz0gcmVxdWlyZSAnLi9jb2xvcidcbiAgICBDb2xvck1hcmtlciA/PSByZXF1aXJlICcuL2NvbG9yLW1hcmtlcidcblxuICAgIEB1cGRhdGVWYXJpYWJsZVJhbmdlcygpXG5cbiAgICBAY29sb3JNYXJrZXJzID0gY29sb3JNYXJrZXJzXG4gICAgLmZpbHRlciAoc3RhdGUpIC0+IHN0YXRlP1xuICAgIC5tYXAgKHN0YXRlKSA9PlxuICAgICAgbWFya2VyID0gQGVkaXRvci5nZXRNYXJrZXIoc3RhdGUubWFya2VySWQpID8gQG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShzdGF0ZS5idWZmZXJSYW5nZSwgeyBpbnZhbGlkYXRlOiAndG91Y2gnIH0pXG4gICAgICBjb2xvciA9IG5ldyBDb2xvcihzdGF0ZS5jb2xvcilcbiAgICAgIGNvbG9yLnZhcmlhYmxlcyA9IHN0YXRlLnZhcmlhYmxlc1xuICAgICAgY29sb3IuaW52YWxpZCA9IHN0YXRlLmludmFsaWRcbiAgICAgIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkW21hcmtlci5pZF0gPSBuZXcgQ29sb3JNYXJrZXIge1xuICAgICAgICBtYXJrZXJcbiAgICAgICAgY29sb3JcbiAgICAgICAgdGV4dDogc3RhdGUudGV4dFxuICAgICAgICBjb2xvckJ1ZmZlcjogdGhpc1xuICAgICAgfVxuXG4gIGNsZWFuVW51c2VkVGV4dEVkaXRvck1hcmtlcnM6IC0+XG4gICAgQG1hcmtlckxheWVyLmZpbmRNYXJrZXJzKCkuZm9yRWFjaCAobSkgPT5cbiAgICAgIG0uZGVzdHJveSgpIHVubGVzcyBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttLmlkXT9cblxuICB2YXJpYWJsZXNBdmFpbGFibGU6IC0+XG4gICAgcmV0dXJuIEB2YXJpYWJsZXNQcm9taXNlIGlmIEB2YXJpYWJsZXNQcm9taXNlP1xuXG4gICAgQHZhcmlhYmxlc1Byb21pc2UgPSBAcHJvamVjdC5pbml0aWFsaXplKClcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG4gICAgICByZXR1cm4gdW5sZXNzIHJlc3VsdHM/XG5cbiAgICAgIEBzY2FuQnVmZmVyRm9yVmFyaWFibGVzKCkgaWYgQGlzSWdub3JlZCgpIGFuZCBAaXNWYXJpYWJsZXNTb3VyY2UoKVxuICAgIC50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQHNjYW5CdWZmZXJGb3JDb2xvcnMgdmFyaWFibGVzOiByZXN1bHRzXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdXBkYXRlQ29sb3JNYXJrZXJzKHJlc3VsdHMpXG4gICAgLnRoZW4gPT5cbiAgICAgIEB2YXJpYWJsZUluaXRpYWxpemVkID0gdHJ1ZVxuICAgIC5jYXRjaCAocmVhc29uKSAtPlxuICAgICAgY29uc29sZS5sb2cgcmVhc29uXG5cbiAgdXBkYXRlOiAtPlxuICAgIEB0ZXJtaW5hdGVSdW5uaW5nVGFzaygpXG5cbiAgICBwcm9taXNlID0gaWYgQGlzSWdub3JlZCgpXG4gICAgICBAc2NhbkJ1ZmZlckZvclZhcmlhYmxlcygpXG4gICAgZWxzZSB1bmxlc3MgQGlzVmFyaWFibGVzU291cmNlKClcbiAgICAgIFByb21pc2UucmVzb2x2ZShbXSlcbiAgICBlbHNlXG4gICAgICBAcHJvamVjdC5yZWxvYWRWYXJpYWJsZXNGb3JQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgcHJvbWlzZS50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQHNjYW5CdWZmZXJGb3JDb2xvcnMgdmFyaWFibGVzOiByZXN1bHRzXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAdXBkYXRlQ29sb3JNYXJrZXJzKHJlc3VsdHMpXG4gICAgLmNhdGNoIChyZWFzb24pIC0+XG4gICAgICBjb25zb2xlLmxvZyByZWFzb25cblxuICB0ZXJtaW5hdGVSdW5uaW5nVGFzazogLT4gQHRhc2s/LnRlcm1pbmF0ZSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuXG4gICAgQHRlcm1pbmF0ZVJ1bm5pbmdUYXNrKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAY29sb3JNYXJrZXJzPy5mb3JFYWNoIChtYXJrZXIpIC0+IG1hcmtlci5kZXN0cm95KClcbiAgICBAZGVzdHJveWVkID0gdHJ1ZVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1kZXN0cm95J1xuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIGlzVmFyaWFibGVzU291cmNlOiAtPiBAcHJvamVjdC5pc1ZhcmlhYmxlc1NvdXJjZVBhdGgoQGVkaXRvci5nZXRQYXRoKCkpXG5cbiAgaXNJZ25vcmVkOiAtPlxuICAgIHAgPSBAZWRpdG9yLmdldFBhdGgoKVxuICAgIEBwcm9qZWN0LmlzSWdub3JlZFBhdGgocCkgb3Igbm90IGF0b20ucHJvamVjdC5jb250YWlucyhwKVxuXG4gIGlzRGVzdHJveWVkOiAtPiBAZGVzdHJveWVkXG5cbiAgZ2V0UGF0aDogLT4gQGVkaXRvci5nZXRQYXRoKClcblxuICBnZXRTY29wZTogLT4gQHByb2plY3Quc2NvcGVGcm9tRmlsZU5hbWUoQGdldFBhdGgoKSlcblxuICB1cGRhdGVJZ25vcmVkU2NvcGVzOiAtPlxuICAgIEBpZ25vcmVkU2NvcGVzID0gQHByb2plY3QuZ2V0SWdub3JlZFNjb3BlcygpLm1hcCAoc2NvcGUpIC0+XG4gICAgICB0cnkgbmV3IFJlZ0V4cChzY29wZSlcbiAgICAuZmlsdGVyIChyZSkgLT4gcmU/XG5cbiAgICBAZ2V0Q29sb3JNYXJrZXJzKCk/LmZvckVhY2ggKG1hcmtlcikgLT4gbWFya2VyLmNoZWNrTWFya2VyU2NvcGUodHJ1ZSlcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnLCB7Y3JlYXRlZDogW10sIGRlc3Ryb3llZDogW119XG5cblxuICAjIyAgICAjIyAgICAgIyMgICAgIyMjICAgICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAgIyMgICAjIyAgIyMgICAgICMjICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgICMjICAgIyMgICMjIyMjIyMjIyAjIyAgICMjICAgICAgICAgIyNcbiAgIyMgICAgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgIyMgICAgICAgIyMjICAgICMjICAgICAjIyAjIyAgICAgIyMgICMjIyMjI1xuXG4gIHVwZGF0ZVZhcmlhYmxlUmFuZ2VzOiAtPlxuICAgIHZhcmlhYmxlc0ZvckJ1ZmZlciA9IEBwcm9qZWN0LmdldFZhcmlhYmxlc0ZvclBhdGgoQGVkaXRvci5nZXRQYXRoKCkpXG4gICAgdmFyaWFibGVzRm9yQnVmZmVyLmZvckVhY2ggKHZhcmlhYmxlKSA9PlxuICAgICAgdmFyaWFibGUuYnVmZmVyUmFuZ2UgPz0gUmFuZ2UuZnJvbU9iamVjdCBbXG4gICAgICAgIEBlZGl0b3IuZ2V0QnVmZmVyKCkucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVswXSlcbiAgICAgICAgQGVkaXRvci5nZXRCdWZmZXIoKS5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHZhcmlhYmxlLnJhbmdlWzFdKVxuICAgICAgXVxuXG4gIHNjYW5CdWZmZXJGb3JWYXJpYWJsZXM6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiVGhpcyBDb2xvckJ1ZmZlciBpcyBhbHJlYWR5IGRlc3Ryb3llZFwiKSBpZiBAZGVzdHJveWVkXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSkgdW5sZXNzIEBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICByZXN1bHRzID0gW11cbiAgICB0YXNrUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnLi90YXNrcy9zY2FuLWJ1ZmZlci12YXJpYWJsZXMtaGFuZGxlcicpXG4gICAgZWRpdG9yID0gQGVkaXRvclxuICAgIGJ1ZmZlciA9IEBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBjb25maWcgPVxuICAgICAgYnVmZmVyOiBAZWRpdG9yLmdldFRleHQoKVxuICAgICAgcmVnaXN0cnk6IEBwcm9qZWN0LmdldFZhcmlhYmxlRXhwcmVzc2lvbnNSZWdpc3RyeSgpLnNlcmlhbGl6ZSgpXG4gICAgICBzY29wZTogQGdldFNjb3BlKClcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAdGFzayA9IFRhc2sub25jZShcbiAgICAgICAgdGFza1BhdGgsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgPT5cbiAgICAgICAgICBAdGFzayA9IG51bGxcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpXG4gICAgICApXG5cbiAgICAgIEB0YXNrLm9uICdzY2FuLWJ1ZmZlcjp2YXJpYWJsZXMtZm91bmQnLCAodmFyaWFibGVzKSAtPlxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQgdmFyaWFibGVzLm1hcCAodmFyaWFibGUpIC0+XG4gICAgICAgICAgdmFyaWFibGUucGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICB2YXJpYWJsZS5idWZmZXJSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QgW1xuICAgICAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodmFyaWFibGUucmFuZ2VbMF0pXG4gICAgICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVsxXSlcbiAgICAgICAgICBdXG4gICAgICAgICAgdmFyaWFibGVcblxuICAjIyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgICAgICMjIyMjIyMgICMjIyMjIyMjXG4gICMjICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgICMjIyMjIyAgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjICAjIyAgICAgIyNcbiAgIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMjICAgIyMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAjIyAgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICMjIyMgIyMjIyAgIyMgICAjIyAgIyMgICAgICMjICMjICAjIyAgICMjICAgICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAjIyMgIyMgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyAgICAjIyMjIyMgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMjICMjICAgIyMgICAjIyAgIyMgICAjIyAgICAgICAjIyAgICMjICAgICAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAjIyAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICMjICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZ2V0TWFya2VyTGF5ZXI6IC0+IEBtYXJrZXJMYXllclxuXG4gIGdldENvbG9yTWFya2VyczogLT4gQGNvbG9yTWFya2Vyc1xuXG4gIGdldFZhbGlkQ29sb3JNYXJrZXJzOiAtPlxuICAgIEBnZXRDb2xvck1hcmtlcnMoKT8uZmlsdGVyKChtKSAtPiBtLmNvbG9yPy5pc1ZhbGlkKCkgYW5kIG5vdCBtLmlzSWdub3JlZCgpKSA/IFtdXG5cbiAgZ2V0Q29sb3JNYXJrZXJBdEJ1ZmZlclBvc2l0aW9uOiAoYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgbWFya2VycyA9IEBtYXJrZXJMYXllci5maW5kTWFya2Vycyh7XG4gICAgICBjb250YWluc0J1ZmZlclBvc2l0aW9uOiBidWZmZXJQb3NpdGlvblxuICAgIH0pXG5cbiAgICBmb3IgbWFya2VyIGluIG1hcmtlcnNcbiAgICAgIGlmIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkW21hcmtlci5pZF0/XG4gICAgICAgIHJldHVybiBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttYXJrZXIuaWRdXG5cbiAgY3JlYXRlQ29sb3JNYXJrZXJzOiAocmVzdWx0cykgLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKSBpZiBAZGVzdHJveWVkXG5cbiAgICBDb2xvck1hcmtlciA/PSByZXF1aXJlICcuL2NvbG9yLW1hcmtlcidcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBuZXdSZXN1bHRzID0gW11cblxuICAgICAgcHJvY2Vzc1Jlc3VsdHMgPSA9PlxuICAgICAgICBzdGFydERhdGUgPSBuZXcgRGF0ZVxuXG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKSBpZiBAZWRpdG9yLmlzRGVzdHJveWVkKClcblxuICAgICAgICB3aGlsZSByZXN1bHRzLmxlbmd0aFxuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdHMuc2hpZnQoKVxuXG4gICAgICAgICAgbWFya2VyID0gQG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShyZXN1bHQuYnVmZmVyUmFuZ2UsIHtpbnZhbGlkYXRlOiAndG91Y2gnfSlcbiAgICAgICAgICBuZXdSZXN1bHRzLnB1c2ggQGNvbG9yTWFya2Vyc0J5TWFya2VySWRbbWFya2VyLmlkXSA9IG5ldyBDb2xvck1hcmtlciB7XG4gICAgICAgICAgICBtYXJrZXJcbiAgICAgICAgICAgIGNvbG9yOiByZXN1bHQuY29sb3JcbiAgICAgICAgICAgIHRleHQ6IHJlc3VsdC5tYXRjaFxuICAgICAgICAgICAgY29sb3JCdWZmZXI6IHRoaXNcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiBuZXcgRGF0ZSgpIC0gc3RhcnREYXRlID4gMTBcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShwcm9jZXNzUmVzdWx0cylcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJlc29sdmUobmV3UmVzdWx0cylcblxuICAgICAgcHJvY2Vzc1Jlc3VsdHMoKVxuXG4gIGZpbmRFeGlzdGluZ01hcmtlcnM6IChyZXN1bHRzKSAtPlxuICAgIG5ld01hcmtlcnMgPSBbXVxuICAgIHRvQ3JlYXRlID0gW11cblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBwcm9jZXNzUmVzdWx0cyA9ID0+XG4gICAgICAgIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlXG5cbiAgICAgICAgd2hpbGUgcmVzdWx0cy5sZW5ndGhcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHRzLnNoaWZ0KClcblxuICAgICAgICAgIGlmIG1hcmtlciA9IEBmaW5kQ29sb3JNYXJrZXIocmVzdWx0KVxuICAgICAgICAgICAgbmV3TWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0b0NyZWF0ZS5wdXNoKHJlc3VsdClcblxuICAgICAgICAgIGlmIG5ldyBEYXRlKCkgLSBzdGFydERhdGUgPiAxMFxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHByb2Nlc3NSZXN1bHRzKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmVzb2x2ZSh7bmV3TWFya2VycywgdG9DcmVhdGV9KVxuXG4gICAgICBwcm9jZXNzUmVzdWx0cygpXG5cbiAgdXBkYXRlQ29sb3JNYXJrZXJzOiAocmVzdWx0cykgLT5cbiAgICBuZXdNYXJrZXJzID0gbnVsbFxuICAgIGNyZWF0ZWRNYXJrZXJzID0gbnVsbFxuXG4gICAgQGZpbmRFeGlzdGluZ01hcmtlcnMocmVzdWx0cykudGhlbiAoe25ld01hcmtlcnM6IG1hcmtlcnMsIHRvQ3JlYXRlfSkgPT5cbiAgICAgIG5ld01hcmtlcnMgPSBtYXJrZXJzXG4gICAgICBAY3JlYXRlQ29sb3JNYXJrZXJzKHRvQ3JlYXRlKVxuICAgIC50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgY3JlYXRlZE1hcmtlcnMgPSByZXN1bHRzXG4gICAgICBuZXdNYXJrZXJzID0gbmV3TWFya2Vycy5jb25jYXQocmVzdWx0cylcblxuICAgICAgaWYgQGNvbG9yTWFya2Vycz9cbiAgICAgICAgdG9EZXN0cm95ID0gQGNvbG9yTWFya2Vycy5maWx0ZXIgKG1hcmtlcikgLT4gbWFya2VyIG5vdCBpbiBuZXdNYXJrZXJzXG4gICAgICAgIHRvRGVzdHJveS5mb3JFYWNoIChtYXJrZXIpID0+XG4gICAgICAgICAgZGVsZXRlIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICAgICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgICBlbHNlXG4gICAgICAgIHRvRGVzdHJveSA9IFtdXG5cbiAgICAgIEBjb2xvck1hcmtlcnMgPSBuZXdNYXJrZXJzXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnLCB7XG4gICAgICAgIGNyZWF0ZWQ6IGNyZWF0ZWRNYXJrZXJzXG4gICAgICAgIGRlc3Ryb3llZDogdG9EZXN0cm95XG4gICAgICB9XG5cbiAgZmluZENvbG9yTWFya2VyOiAocHJvcGVydGllcz17fSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBjb2xvck1hcmtlcnM/XG4gICAgZm9yIG1hcmtlciBpbiBAY29sb3JNYXJrZXJzXG4gICAgICByZXR1cm4gbWFya2VyIGlmIG1hcmtlcj8ubWF0Y2gocHJvcGVydGllcylcblxuICBmaW5kQ29sb3JNYXJrZXJzOiAocHJvcGVydGllcz17fSkgLT5cbiAgICBtYXJrZXJzID0gQG1hcmtlckxheWVyLmZpbmRNYXJrZXJzKHByb3BlcnRpZXMpXG4gICAgbWFya2Vycy5tYXAgKG1hcmtlcikgPT5cbiAgICAgIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICAuZmlsdGVyIChtYXJrZXIpIC0+IG1hcmtlcj9cblxuICBmaW5kVmFsaWRDb2xvck1hcmtlcnM6IChwcm9wZXJ0aWVzKSAtPlxuICAgIEBmaW5kQ29sb3JNYXJrZXJzKHByb3BlcnRpZXMpLmZpbHRlciAobWFya2VyKSA9PlxuICAgICAgbWFya2VyPyBhbmQgbWFya2VyLmNvbG9yPy5pc1ZhbGlkKCkgYW5kIG5vdCBtYXJrZXI/LmlzSWdub3JlZCgpXG5cbiAgc2VsZWN0Q29sb3JNYXJrZXJBbmRPcGVuUGlja2VyOiAoY29sb3JNYXJrZXIpIC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcblxuICAgIEBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShjb2xvck1hcmtlci5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSlcblxuICAgICMgRm9yIHRoZSBtb21lbnQgaXQgc2VlbXMgb25seSBjb2xvcnMgaW4gI1JSR0dCQiBmb3JtYXQgYXJlIGRldGVjdGVkXG4gICAgIyBieSB0aGUgY29sb3IgcGlja2VyLCBzbyB3ZSdsbCBleGNsdWRlIGFueXRoaW5nIGVsc2VcbiAgICByZXR1cm4gdW5sZXNzIEBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCk/Lm1hdGNoKC9eI1swLTlhLWZBLUZdezMsOH0kLylcblxuICAgIGlmIEBwcm9qZWN0LmNvbG9yUGlja2VyQVBJP1xuICAgICAgQHByb2plY3QuY29sb3JQaWNrZXJBUEkub3BlbihAZWRpdG9yLCBAZWRpdG9yLmdldExhc3RDdXJzb3IoKSlcblxuICBzY2FuQnVmZmVyRm9yQ29sb3JzOiAob3B0aW9ucz17fSkgLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJUaGlzIENvbG9yQnVmZmVyIGlzIGFscmVhZHkgZGVzdHJveWVkXCIpIGlmIEBkZXN0cm95ZWRcblxuICAgIENvbG9yID89IHJlcXVpcmUgJy4vY29sb3InXG5cbiAgICByZXN1bHRzID0gW11cbiAgICB0YXNrUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnLi90YXNrcy9zY2FuLWJ1ZmZlci1jb2xvcnMtaGFuZGxlcicpXG4gICAgYnVmZmVyID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHJlZ2lzdHJ5ID0gQHByb2plY3QuZ2V0Q29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5KCkuc2VyaWFsaXplKClcblxuICAgIGlmIG9wdGlvbnMudmFyaWFibGVzP1xuICAgICAgVmFyaWFibGVzQ29sbGVjdGlvbiA/PSByZXF1aXJlICcuL3ZhcmlhYmxlcy1jb2xsZWN0aW9uJ1xuXG4gICAgICBjb2xsZWN0aW9uID0gbmV3IFZhcmlhYmxlc0NvbGxlY3Rpb24oKVxuICAgICAgY29sbGVjdGlvbi5hZGRNYW55KG9wdGlvbnMudmFyaWFibGVzKVxuICAgICAgb3B0aW9ucy52YXJpYWJsZXMgPSBjb2xsZWN0aW9uXG5cbiAgICB2YXJpYWJsZXMgPSBpZiBAaXNWYXJpYWJsZXNTb3VyY2UoKVxuICAgICAgIyBJbiB0aGUgY2FzZSBvZiBmaWxlcyBjb25zaWRlcmVkIGFzIHNvdXJjZSwgdGhlIHZhcmlhYmxlcyBpbiB0aGUgcHJvamVjdFxuICAgICAgIyBhcmUgbmVlZGVkIHdoZW4gcGFyc2luZyB0aGUgZmlsZXMuXG4gICAgICAob3B0aW9ucy52YXJpYWJsZXM/LmdldFZhcmlhYmxlcygpID8gW10pLmNvbmNhdChAcHJvamVjdC5nZXRWYXJpYWJsZXMoKSA/IFtdKVxuICAgIGVsc2VcbiAgICAgICMgRmlsZXMgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIHNvdXJjZXMgd2lsbCBvbmx5IHVzZSB0aGUgdmFyaWFibGVzXG4gICAgICAjIGRlZmluZWQgaW4gdGhlbSBhbmQgc28gdGhlIGdsb2JhbCB2YXJpYWJsZXMgZXhwcmVzc2lvbiBtdXN0IGJlXG4gICAgICAjIGRpc2NhcmRlZCBiZWZvcmUgc2VuZGluZyB0aGUgcmVnaXN0cnkgdG8gdGhlIGNoaWxkIHByb2Nlc3MuXG4gICAgICBvcHRpb25zLnZhcmlhYmxlcz8uZ2V0VmFyaWFibGVzKCkgPyBbXVxuXG4gICAgZGVsZXRlIHJlZ2lzdHJ5LmV4cHJlc3Npb25zWydwaWdtZW50czp2YXJpYWJsZXMnXVxuICAgIGRlbGV0ZSByZWdpc3RyeS5yZWdleHBTdHJpbmdcblxuICAgIGNvbmZpZyA9XG4gICAgICBidWZmZXI6IEBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBidWZmZXJQYXRoOiBAZ2V0UGF0aCgpXG4gICAgICBzY29wZTogQGdldFNjb3BlKClcbiAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzXG4gICAgICBjb2xvclZhcmlhYmxlczogdmFyaWFibGVzLmZpbHRlciAodikgLT4gdi5pc0NvbG9yXG4gICAgICByZWdpc3RyeTogcmVnaXN0cnlcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAdGFzayA9IFRhc2sub25jZShcbiAgICAgICAgdGFza1BhdGgsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgPT5cbiAgICAgICAgICBAdGFzayA9IG51bGxcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpXG4gICAgICApXG5cbiAgICAgIEB0YXNrLm9uICdzY2FuLWJ1ZmZlcjpjb2xvcnMtZm91bmQnLCAoY29sb3JzKSAtPlxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQgY29sb3JzLm1hcCAocmVzKSAtPlxuICAgICAgICAgIHJlcy5jb2xvciA9IG5ldyBDb2xvcihyZXMuY29sb3IpXG4gICAgICAgICAgcmVzLmJ1ZmZlclJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCBbXG4gICAgICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChyZXMucmFuZ2VbMF0pXG4gICAgICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChyZXMucmFuZ2VbMV0pXG4gICAgICAgICAgXVxuICAgICAgICAgIHJlc1xuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICB7XG4gICAgICBAaWRcbiAgICAgIHBhdGg6IEBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBjb2xvck1hcmtlcnM6IEBjb2xvck1hcmtlcnM/Lm1hcCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuc2VyaWFsaXplKClcbiAgICB9XG4iXX0=

(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, ref, registry,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Emitter = ref[0], ColorExpression = ref[1], ColorContext = ref[2], Color = ref[3], registry = ref[4];

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      if (Emitter == null) {
        Emitter = require('atom').Emitter;
      }
      this.emitter = new Emitter;
      this.reset();
      this.initialize(state != null ? state.content : void 0);
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.onceInitialized = function(callback) {
      var disposable;
      if (callback == null) {
        return;
      }
      if (this.initialized) {
        return callback();
      } else {
        return disposable = this.emitter.on('did-initialize', function() {
          disposable.dispose();
          return callback();
        });
      }
    };

    VariablesCollection.prototype.initialize = function(content) {
      var iteration;
      if (content == null) {
        content = [];
      }
      iteration = (function(_this) {
        return function(cb) {
          var end, start, v;
          start = new Date;
          end = new Date;
          while (content.length > 0 && end - start < 100) {
            v = content.shift();
            _this.restoreVariable(v);
          }
          if (content.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          _this.initialized = true;
          return _this.emitter.emit('did-initialize');
        };
      })(this));
    };

    VariablesCollection.prototype.reset = function() {
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      return this.dependencyGraph = {};
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var ref1;
      return (ref1 = this.variablesByPath[path]) != null ? ref1 : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var i, len, ref1, v;
      ref1 = this.variables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var i, len, p, res;
      res = [];
      for (i = 0, len = paths.length; i < len; i++) {
        p = paths[i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var ref1;
      return (ref1 = this.findAll(properties)) != null ? ref1[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, ref1;
          if (((ref1 = v[k]) != null ? ref1.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, i, j, l, len, len1, len2, name1, path, pathsCollection, pathsToDestroy, ref1, ref2, ref3, ref4, ref5, ref6, ref7, remainingPaths, results, updated, v;
      pathsCollection = {};
      remainingPaths = [];
      for (i = 0, len = collection.length; i < len; i++) {
        v = collection[i];
        if (pathsCollection[name1 = v.path] == null) {
          pathsCollection[name1] = [];
        }
        pathsCollection[v.path].push(v);
        if (ref1 = v.path, indexOf.call(remainingPaths, ref1) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        ref2 = this.updatePathCollection(path, collection, true) || {}, created = ref2.created, updated = ref2.updated, destroyed = ref2.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return indexOf.call(remainingPaths, p) < 0;
        });
        for (j = 0, len1 = pathsToDestroy.length; j < len1; j++) {
          path = pathsToDestroy[j];
          ref3 = this.updatePathCollection(path, collection, true) || {}, created = ref3.created, updated = ref3.updated, destroyed = ref3.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((ref4 = results.created) != null ? ref4.length : void 0) === 0) {
        delete results.created;
      }
      if (((ref5 = results.updated) != null ? ref5.length : void 0) === 0) {
        delete results.updated;
      }
      if (((ref6 = results.destroyed) != null ? ref6.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        ref7 = results.destroyed;
        for (l = 0, len2 = ref7.length; l < len2; l++) {
          v = ref7[l];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, i, j, len, len1, pathCollection, results, status, v;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (i = 0, len = pathCollection.length; i < len; i++) {
        v = pathCollection[i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (j = 0, len1 = destroyed.length; j < len1; j++) {
          v = destroyed[j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, ref1, status;
      if (batch == null) {
        batch = false;
      }
      ref1 = this.getVariableStatus(variable), status = ref1[0], previousVariable = ref1[1];
      variable["default"] || (variable["default"] = variable.path.match(/\/.pigments$/));
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var i, len, res, results, status, v, variable;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, i, j, len, len1, results, v, variable;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (j = 0, len1 = destroyed.length; j < len1; j++) {
          v = destroyed[j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      if (ColorContext == null) {
        ColorContext = require('./color-context');
      }
      if (registry == null) {
        registry = require('./color-expressions');
      }
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables, callback) {
      var iteration, remainingVariables, updated;
      updated = [];
      remainingVariables = variables.slice();
      iteration = (function(_this) {
        return function(cb) {
          var end, isColor, start, v, wasColor;
          start = new Date;
          end = new Date;
          while (remainingVariables.length > 0 && end - start < 100) {
            v = remainingVariables.shift();
            wasColor = v.isColor;
            _this.evaluateVariableColor(v, wasColor);
            isColor = v.isColor;
            if (isColor !== wasColor) {
              updated.push(v);
              if (isColor) {
                _this.buildDependencyGraph(v);
              }
              end = new Date;
            }
          }
          if (remainingVariables.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          if (updated.length > 0) {
            _this.emitChangeEvent(_this.updateDependencies({
              updated: updated
            }));
          }
          return typeof callback === "function" ? callback(updated) : void 0;
        };
      })(this));
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, ref1, removed;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      ref1 = this.diffArrays(previousDependencies, newDependencies), removed = ref1.removed, added = ref1.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var base, name1;
      if (Color == null) {
        Color = require('./color');
      }
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((base = this.variablesByPath)[name1 = variable.path] == null) {
        base[name1] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var base, name1;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((base = this.variablesByPath)[name1 = variable.path] == null) {
        base[name1] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var i, len, status, v;
      for (i = 0, len = collection.length; i < len; i++) {
        v = collection[i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, base, dependencies, dependency, i, len, ref1, results1;
      dependencies = this.getVariableDependencies(variable);
      results1 = [];
      for (i = 0, len = dependencies.length; i < len; i++) {
        dependency = dependencies[i];
        a = (base = this.dependencyGraph)[dependency] != null ? base[dependency] : base[dependency] = [];
        if (ref1 = variable.name, indexOf.call(a, ref1) < 0) {
          results1.push(a.push(variable.name));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, i, len, ref1, ref2, ref3, v, variables;
      dependencies = [];
      if (ref1 = variable.value, indexOf.call(this.variableNames, ref1) >= 0) {
        dependencies.push(variable.value);
      }
      if (((ref2 = variable.color) != null ? (ref3 = ref2.variables) != null ? ref3.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (i = 0, len = variables.length; i < len; i++) {
          v = variables[i];
          if (indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var i, len, ref1, ref2, v, variables;
      variables = [];
      ref1 = this.variables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (ref2 = v.name, indexOf.call(names, ref2) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, i, len, results1, v;
      results1 = [];
      for (i = 0, len = to.length; i < len; i++) {
        v = to[i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            results1.push(delete this.dependencyGraph[v]);
          } else {
            results1.push(void 0);
          }
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var base, i, len, results1, v;
      results1 = [];
      for (i = 0, len = to.length; i < len; i++) {
        v = to[i];
        if ((base = this.dependencyGraph)[v] == null) {
          base[v] = [];
        }
        results1.push(this.dependencyGraph[v].push(from));
      }
      return results1;
    };

    VariablesCollection.prototype.updateDependencies = function(arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, i, j, l, len, len1, len2, name, updated, variable, variables;
      created = arg.created, updated = arg.updated, destroyed = arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (i = 0, len = variables.length; i < len; i++) {
        variable = variables[i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (j = 0, len1 = dependencies.length; j < len1; j++) {
            name = dependencies[j];
            if (indexOf.call(dirtyVariableNames, name) < 0 && indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (l = 0, len2 = dirtyVariables.length; l < len2; l++) {
        variable = dirtyVariables[l];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(arg) {
      var created, destroyed, updated;
      created = arg.created, destroyed = arg.destroyed, updated = arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      if (registry == null) {
        registry = require('./color-expressions');
      }
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        if (ColorExpression == null) {
          ColorExpression = require('./color-expression');
        }
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, i, j, len, len1, removed, v;
      removed = [];
      added = [];
      for (i = 0, len = a.length; i < len; i++) {
        v = a[i];
        if (indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (j = 0, len1 = b.length; j < len1; j++) {
        v = b[j];
        if (indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isAlternate) {
            res.isAlternate = true;
          }
          if (v.noNamePrefix) {
            res.noNamePrefix = true;
          }
          if (v["default"]) {
            res["default"] = true;
          }
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGVzLWNvbGxlY3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5RkFBQTtJQUFBOztFQUFBLE1BQTRELEVBQTVELEVBQUMsZ0JBQUQsRUFBVSx3QkFBVixFQUEyQixxQkFBM0IsRUFBeUMsY0FBekMsRUFBZ0Q7O0VBRWhELE1BQUEsR0FBUzs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO2FBQ1IsSUFBQSxtQkFBQSxDQUFvQixLQUFwQjtJQURROztJQUdkLE1BQU0sQ0FBQyxjQUFQLENBQXNCLG1CQUFDLENBQUEsU0FBdkIsRUFBa0MsUUFBbEMsRUFBNEM7TUFDMUMsR0FBQSxFQUFLLFNBQUE7ZUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDO01BQWQsQ0FEcUM7TUFFMUMsVUFBQSxFQUFZLElBRjhCO0tBQTVDOztJQUthLDZCQUFDLEtBQUQ7O1FBQ1gsVUFBVyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7O01BRTNCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUVmLElBQUMsQ0FBQSxLQUFELENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxpQkFBWSxLQUFLLENBQUUsZ0JBQW5CO0lBTlc7O2tDQVFiLFdBQUEsR0FBYSxTQUFDLFFBQUQ7YUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFFBQTFCO0lBRFc7O2tDQUdiLGVBQUEsR0FBaUIsU0FBQyxRQUFEO0FBQ2YsVUFBQTtNQUFBLElBQWMsZ0JBQWQ7QUFBQSxlQUFBOztNQUNBLElBQUcsSUFBQyxDQUFBLFdBQUo7ZUFDRSxRQUFBLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FB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QUMsQ0FBRDtBQUN0QixjQUFBO1VBQUEsR0FBQSxHQUFNO1lBQ0osSUFBQSxFQUFNLENBQUMsQ0FBQyxJQURKO1lBRUosS0FBQSxFQUFPLENBQUMsQ0FBQyxLQUZMO1lBR0osSUFBQSxFQUFNLENBQUMsQ0FBQyxJQUhKO1lBSUosS0FBQSxFQUFPLENBQUMsQ0FBQyxLQUpMO1lBS0osSUFBQSxFQUFNLENBQUMsQ0FBQyxJQUxKOztVQVFOLElBQTBCLENBQUMsQ0FBQyxXQUE1QjtZQUFBLEdBQUcsQ0FBQyxXQUFKLEdBQWtCLEtBQWxCOztVQUNBLElBQTJCLENBQUMsQ0FBQyxZQUE3QjtZQUFBLEdBQUcsQ0FBQyxZQUFKLEdBQW1CLEtBQW5COztVQUNBLElBQXNCLENBQUMsRUFBQyxPQUFELEVBQXZCO1lBQUEsR0FBRyxFQUFDLE9BQUQsRUFBSCxHQUFjLEtBQWQ7O1VBRUEsSUFBRyxDQUFDLENBQUMsT0FBTDtZQUNFLEdBQUcsQ0FBQyxPQUFKLEdBQWM7WUFDZCxHQUFHLENBQUMsS0FBSixHQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUixDQUFBO1lBQ1osSUFBcUMseUJBQXJDO2NBQUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUF4QjthQUhGOztpQkFLQTtRQWxCc0IsQ0FBZixDQUZYOztJQURTOzs7OztBQW5kYiIsInNvdXJjZXNDb250ZW50IjpbIltFbWl0dGVyLCBDb2xvckV4cHJlc3Npb24sIENvbG9yQ29udGV4dCwgQ29sb3IsIHJlZ2lzdHJ5XSA9IFtdXG5cbm5leHRJZCA9IDBcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmFyaWFibGVzQ29sbGVjdGlvblxuICBAZGVzZXJpYWxpemU6IChzdGF0ZSkgLT5cbiAgICBuZXcgVmFyaWFibGVzQ29sbGVjdGlvbihzdGF0ZSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgJ2xlbmd0aCcsIHtcbiAgICBnZXQ6IC0+IEB2YXJpYWJsZXMubGVuZ3RoXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG5cbiAgY29uc3RydWN0b3I6IChzdGF0ZSkgLT5cbiAgICBFbWl0dGVyID89IHJlcXVpcmUoJ2F0b20nKS5FbWl0dGVyXG5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBAcmVzZXQoKVxuICAgIEBpbml0aWFsaXplKHN0YXRlPy5jb250ZW50KVxuXG4gIG9uRGlkQ2hhbmdlOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UnLCBjYWxsYmFja1xuXG4gIG9uY2VJbml0aWFsaXplZDogKGNhbGxiYWNrKSAtPlxuICAgIHJldHVybiB1bmxlc3MgY2FsbGJhY2s/XG4gICAgaWYgQGluaXRpYWxpemVkXG4gICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgZGlzcG9zYWJsZSA9IEBlbWl0dGVyLm9uICdkaWQtaW5pdGlhbGl6ZScsIC0+XG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICAgIGNhbGxiYWNrKClcblxuICBpbml0aWFsaXplOiAoY29udGVudD1bXSkgLT5cbiAgICBpdGVyYXRpb24gPSAoY2IpID0+XG4gICAgICBzdGFydCA9IG5ldyBEYXRlXG4gICAgICBlbmQgPSBuZXcgRGF0ZVxuXG4gICAgICB3aGlsZSBjb250ZW50Lmxlbmd0aCA+IDAgYW5kIGVuZCAtIHN0YXJ0IDwgMTAwXG4gICAgICAgIHYgPSBjb250ZW50LnNoaWZ0KClcbiAgICAgICAgQHJlc3RvcmVWYXJpYWJsZSh2KVxuXG4gICAgICBpZiBjb250ZW50Lmxlbmd0aCA+IDBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKC0+IGl0ZXJhdGlvbihjYikpXG4gICAgICBlbHNlXG4gICAgICAgIGNiPygpXG5cbiAgICBpdGVyYXRpb24gPT5cbiAgICAgIEBpbml0aWFsaXplZCA9IHRydWVcbiAgICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1pbml0aWFsaXplJylcblxuICByZXNldDogLT5cbiAgICBAdmFyaWFibGVzID0gW11cbiAgICBAdmFyaWFibGVOYW1lcyA9IFtdXG4gICAgQGNvbG9yVmFyaWFibGVzID0gW11cbiAgICBAdmFyaWFibGVzQnlQYXRoID0ge31cbiAgICBAZGVwZW5kZW5jeUdyYXBoID0ge31cblxuICBnZXRWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXMuc2xpY2UoKVxuXG4gIGdldE5vbkNvbG9yVmFyaWFibGVzOiAtPiBAZ2V0VmFyaWFibGVzKCkuZmlsdGVyICh2KSAtPiBub3Qgdi5pc0NvbG9yXG5cbiAgZ2V0VmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEB2YXJpYWJsZXNCeVBhdGhbcGF0aF0gPyBbXVxuXG4gIGdldFZhcmlhYmxlQnlOYW1lOiAobmFtZSkgLT4gQGNvbGxlY3RWYXJpYWJsZXNCeU5hbWUoW25hbWVdKS5wb3AoKVxuXG4gIGdldFZhcmlhYmxlQnlJZDogKGlkKSAtPiByZXR1cm4gdiBmb3IgdiBpbiBAdmFyaWFibGVzIHdoZW4gdi5pZCBpcyBpZFxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+XG4gICAgcmVzID0gW11cblxuICAgIGZvciBwIGluIHBhdGhzIHdoZW4gcCBvZiBAdmFyaWFibGVzQnlQYXRoXG4gICAgICByZXMgPSByZXMuY29uY2F0KEB2YXJpYWJsZXNCeVBhdGhbcF0pXG5cbiAgICByZXNcblxuICBnZXRDb2xvclZhcmlhYmxlczogLT4gQGNvbG9yVmFyaWFibGVzLnNsaWNlKClcblxuICBmaW5kOiAocHJvcGVydGllcykgLT4gQGZpbmRBbGwocHJvcGVydGllcyk/WzBdXG5cbiAgZmluZEFsbDogKHByb3BlcnRpZXM9e30pIC0+XG4gICAga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpXG4gICAgcmV0dXJuIG51bGwgaWYga2V5cy5sZW5ndGggaXMgMFxuXG4gICAgQHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IGtleXMuZXZlcnkgKGspIC0+XG4gICAgICBpZiB2W2tdPy5pc0VxdWFsP1xuICAgICAgICB2W2tdLmlzRXF1YWwocHJvcGVydGllc1trXSlcbiAgICAgIGVsc2UgaWYgQXJyYXkuaXNBcnJheShiID0gcHJvcGVydGllc1trXSlcbiAgICAgICAgYSA9IHZba11cbiAgICAgICAgYS5sZW5ndGggaXMgYi5sZW5ndGggYW5kIGEuZXZlcnkgKHZhbHVlKSAtPiB2YWx1ZSBpbiBiXG4gICAgICBlbHNlXG4gICAgICAgIHZba10gaXMgcHJvcGVydGllc1trXVxuXG4gIHVwZGF0ZUNvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBwYXRocykgLT5cbiAgICBwYXRoc0NvbGxlY3Rpb24gPSB7fVxuICAgIHJlbWFpbmluZ1BhdGhzID0gW11cblxuICAgIGZvciB2IGluIGNvbGxlY3Rpb25cbiAgICAgIHBhdGhzQ29sbGVjdGlvblt2LnBhdGhdID89IFtdXG4gICAgICBwYXRoc0NvbGxlY3Rpb25bdi5wYXRoXS5wdXNoKHYpXG4gICAgICByZW1haW5pbmdQYXRocy5wdXNoKHYucGF0aCkgdW5sZXNzIHYucGF0aCBpbiByZW1haW5pbmdQYXRoc1xuXG4gICAgcmVzdWx0cyA9IHtcbiAgICAgIGNyZWF0ZWQ6IFtdXG4gICAgICBkZXN0cm95ZWQ6IFtdXG4gICAgICB1cGRhdGVkOiBbXVxuICAgIH1cblxuICAgIGZvciBwYXRoLCBjb2xsZWN0aW9uIG9mIHBhdGhzQ29sbGVjdGlvblxuICAgICAge2NyZWF0ZWQsIHVwZGF0ZWQsIGRlc3Ryb3llZH0gPSBAdXBkYXRlUGF0aENvbGxlY3Rpb24ocGF0aCwgY29sbGVjdGlvbiwgdHJ1ZSkgb3Ige31cblxuICAgICAgcmVzdWx0cy5jcmVhdGVkID0gcmVzdWx0cy5jcmVhdGVkLmNvbmNhdChjcmVhdGVkKSBpZiBjcmVhdGVkP1xuICAgICAgcmVzdWx0cy51cGRhdGVkID0gcmVzdWx0cy51cGRhdGVkLmNvbmNhdCh1cGRhdGVkKSBpZiB1cGRhdGVkP1xuICAgICAgcmVzdWx0cy5kZXN0cm95ZWQgPSByZXN1bHRzLmRlc3Ryb3llZC5jb25jYXQoZGVzdHJveWVkKSBpZiBkZXN0cm95ZWQ/XG5cbiAgICBpZiBwYXRocz9cbiAgICAgIHBhdGhzVG9EZXN0cm95ID0gaWYgY29sbGVjdGlvbi5sZW5ndGggaXMgMFxuICAgICAgICBwYXRoc1xuICAgICAgZWxzZVxuICAgICAgICBwYXRocy5maWx0ZXIgKHApIC0+IHAgbm90IGluIHJlbWFpbmluZ1BhdGhzXG5cbiAgICAgIGZvciBwYXRoIGluIHBhdGhzVG9EZXN0cm95XG4gICAgICAgIHtjcmVhdGVkLCB1cGRhdGVkLCBkZXN0cm95ZWR9ID0gQHVwZGF0ZVBhdGhDb2xsZWN0aW9uKHBhdGgsIGNvbGxlY3Rpb24sIHRydWUpIG9yIHt9XG5cbiAgICAgICAgcmVzdWx0cy5jcmVhdGVkID0gcmVzdWx0cy5jcmVhdGVkLmNvbmNhdChjcmVhdGVkKSBpZiBjcmVhdGVkP1xuICAgICAgICByZXN1bHRzLnVwZGF0ZWQgPSByZXN1bHRzLnVwZGF0ZWQuY29uY2F0KHVwZGF0ZWQpIGlmIHVwZGF0ZWQ/XG4gICAgICAgIHJlc3VsdHMuZGVzdHJveWVkID0gcmVzdWx0cy5kZXN0cm95ZWQuY29uY2F0KGRlc3Ryb3llZCkgaWYgZGVzdHJveWVkP1xuXG4gICAgcmVzdWx0cyA9IEB1cGRhdGVEZXBlbmRlbmNpZXMocmVzdWx0cylcblxuICAgIGRlbGV0ZSByZXN1bHRzLmNyZWF0ZWQgaWYgcmVzdWx0cy5jcmVhdGVkPy5sZW5ndGggaXMgMFxuICAgIGRlbGV0ZSByZXN1bHRzLnVwZGF0ZWQgaWYgcmVzdWx0cy51cGRhdGVkPy5sZW5ndGggaXMgMFxuICAgIGRlbGV0ZSByZXN1bHRzLmRlc3Ryb3llZCBpZiByZXN1bHRzLmRlc3Ryb3llZD8ubGVuZ3RoIGlzIDBcblxuICAgIGlmIHJlc3VsdHMuZGVzdHJveWVkP1xuICAgICAgQGRlbGV0ZVZhcmlhYmxlUmVmZXJlbmNlcyh2KSBmb3IgdiBpbiByZXN1bHRzLmRlc3Ryb3llZFxuXG4gICAgQGVtaXRDaGFuZ2VFdmVudChyZXN1bHRzKVxuXG4gIHVwZGF0ZVBhdGhDb2xsZWN0aW9uOiAocGF0aCwgY29sbGVjdGlvbiwgYmF0Y2g9ZmFsc2UpIC0+XG4gICAgcGF0aENvbGxlY3Rpb24gPSBAdmFyaWFibGVzQnlQYXRoW3BhdGhdIG9yIFtdXG5cbiAgICByZXN1bHRzID0gQGFkZE1hbnkoY29sbGVjdGlvbiwgdHJ1ZSlcblxuICAgIGRlc3Ryb3llZCA9IFtdXG4gICAgZm9yIHYgaW4gcGF0aENvbGxlY3Rpb25cbiAgICAgIFtzdGF0dXNdID0gQGdldFZhcmlhYmxlU3RhdHVzSW5Db2xsZWN0aW9uKHYsIGNvbGxlY3Rpb24pXG4gICAgICBkZXN0cm95ZWQucHVzaChAcmVtb3ZlKHYsIHRydWUpKSBpZiBzdGF0dXMgaXMgJ2NyZWF0ZWQnXG5cbiAgICByZXN1bHRzLmRlc3Ryb3llZCA9IGRlc3Ryb3llZCBpZiBkZXN0cm95ZWQubGVuZ3RoID4gMFxuXG4gICAgaWYgYmF0Y2hcbiAgICAgIHJlc3VsdHNcbiAgICBlbHNlXG4gICAgICByZXN1bHRzID0gQHVwZGF0ZURlcGVuZGVuY2llcyhyZXN1bHRzKVxuICAgICAgQGRlbGV0ZVZhcmlhYmxlUmVmZXJlbmNlcyh2KSBmb3IgdiBpbiBkZXN0cm95ZWRcbiAgICAgIEBlbWl0Q2hhbmdlRXZlbnQocmVzdWx0cylcblxuICBhZGQ6ICh2YXJpYWJsZSwgYmF0Y2g9ZmFsc2UpIC0+XG4gICAgW3N0YXR1cywgcHJldmlvdXNWYXJpYWJsZV0gPSBAZ2V0VmFyaWFibGVTdGF0dXModmFyaWFibGUpXG5cbiAgICB2YXJpYWJsZS5kZWZhdWx0IHx8PSB2YXJpYWJsZS5wYXRoLm1hdGNoIC9cXC8ucGlnbWVudHMkL1xuXG4gICAgc3dpdGNoIHN0YXR1c1xuICAgICAgd2hlbiAnbW92ZWQnXG4gICAgICAgIHByZXZpb3VzVmFyaWFibGUucmFuZ2UgPSB2YXJpYWJsZS5yYW5nZVxuICAgICAgICBwcmV2aW91c1ZhcmlhYmxlLmJ1ZmZlclJhbmdlID0gdmFyaWFibGUuYnVmZmVyUmFuZ2VcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgd2hlbiAndXBkYXRlZCdcbiAgICAgICAgQHVwZGF0ZVZhcmlhYmxlKHByZXZpb3VzVmFyaWFibGUsIHZhcmlhYmxlLCBiYXRjaClcbiAgICAgIHdoZW4gJ2NyZWF0ZWQnXG4gICAgICAgIEBjcmVhdGVWYXJpYWJsZSh2YXJpYWJsZSwgYmF0Y2gpXG5cbiAgYWRkTWFueTogKHZhcmlhYmxlcywgYmF0Y2g9ZmFsc2UpIC0+XG4gICAgcmVzdWx0cyA9IHt9XG5cbiAgICBmb3IgdmFyaWFibGUgaW4gdmFyaWFibGVzXG4gICAgICByZXMgPSBAYWRkKHZhcmlhYmxlLCB0cnVlKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBbc3RhdHVzLCB2XSA9IHJlc1xuXG4gICAgICAgIHJlc3VsdHNbc3RhdHVzXSA/PSBbXVxuICAgICAgICByZXN1bHRzW3N0YXR1c10ucHVzaCh2KVxuXG4gICAgaWYgYmF0Y2hcbiAgICAgIHJlc3VsdHNcbiAgICBlbHNlXG4gICAgICBAZW1pdENoYW5nZUV2ZW50KEB1cGRhdGVEZXBlbmRlbmNpZXMocmVzdWx0cykpXG5cbiAgcmVtb3ZlOiAodmFyaWFibGUsIGJhdGNoPWZhbHNlKSAtPlxuICAgIHZhcmlhYmxlID0gQGZpbmQodmFyaWFibGUpXG5cbiAgICByZXR1cm4gdW5sZXNzIHZhcmlhYmxlP1xuXG4gICAgQHZhcmlhYmxlcyA9IEB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2IGlzbnQgdmFyaWFibGVcbiAgICBpZiB2YXJpYWJsZS5pc0NvbG9yXG4gICAgICBAY29sb3JWYXJpYWJsZXMgPSBAY29sb3JWYXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2IGlzbnQgdmFyaWFibGVcblxuICAgIGlmIGJhdGNoXG4gICAgICByZXR1cm4gdmFyaWFibGVcbiAgICBlbHNlXG4gICAgICByZXN1bHRzID0gQHVwZGF0ZURlcGVuZGVuY2llcyhkZXN0cm95ZWQ6IFt2YXJpYWJsZV0pXG5cbiAgICAgIEBkZWxldGVWYXJpYWJsZVJlZmVyZW5jZXModmFyaWFibGUpXG4gICAgICBAZW1pdENoYW5nZUV2ZW50KHJlc3VsdHMpXG5cbiAgcmVtb3ZlTWFueTogKHZhcmlhYmxlcywgYmF0Y2g9ZmFsc2UpIC0+XG4gICAgZGVzdHJveWVkID0gW11cbiAgICBmb3IgdmFyaWFibGUgaW4gdmFyaWFibGVzXG4gICAgICBkZXN0cm95ZWQucHVzaCBAcmVtb3ZlKHZhcmlhYmxlLCB0cnVlKVxuXG4gICAgcmVzdWx0cyA9IHtkZXN0cm95ZWR9XG5cbiAgICBpZiBiYXRjaFxuICAgICAgcmVzdWx0c1xuICAgIGVsc2VcbiAgICAgIHJlc3VsdHMgPSBAdXBkYXRlRGVwZW5kZW5jaWVzKHJlc3VsdHMpXG4gICAgICBAZGVsZXRlVmFyaWFibGVSZWZlcmVuY2VzKHYpIGZvciB2IGluIGRlc3Ryb3llZCB3aGVuIHY/XG4gICAgICBAZW1pdENoYW5nZUV2ZW50KHJlc3VsdHMpXG5cbiAgZGVsZXRlVmFyaWFibGVzRm9yUGF0aHM6IChwYXRocykgLT4gQHJlbW92ZU1hbnkoQGdldFZhcmlhYmxlc0ZvclBhdGhzKHBhdGhzKSlcblxuICBkZWxldGVWYXJpYWJsZVJlZmVyZW5jZXM6ICh2YXJpYWJsZSkgLT5cbiAgICBkZXBlbmRlbmNpZXMgPSBAZ2V0VmFyaWFibGVEZXBlbmRlbmNpZXModmFyaWFibGUpXG5cbiAgICBhID0gQHZhcmlhYmxlc0J5UGF0aFt2YXJpYWJsZS5wYXRoXVxuICAgIGEuc3BsaWNlKGEuaW5kZXhPZih2YXJpYWJsZSksIDEpXG5cbiAgICBhID0gQHZhcmlhYmxlTmFtZXNcbiAgICBhLnNwbGljZShhLmluZGV4T2YodmFyaWFibGUubmFtZSksIDEpXG4gICAgQHJlbW92ZURlcGVuZGVuY2llcyh2YXJpYWJsZS5uYW1lLCBkZXBlbmRlbmNpZXMpXG5cbiAgICBkZWxldGUgQGRlcGVuZGVuY3lHcmFwaFt2YXJpYWJsZS5uYW1lXVxuXG4gIGdldENvbnRleHQ6IC0+XG4gICAgQ29sb3JDb250ZXh0ID89IHJlcXVpcmUgJy4vY29sb3ItY29udGV4dCdcbiAgICByZWdpc3RyeSA/PSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb25zJ1xuXG4gICAgbmV3IENvbG9yQ29udGV4dCh7QHZhcmlhYmxlcywgQGNvbG9yVmFyaWFibGVzLCByZWdpc3RyeX0pXG5cbiAgZXZhbHVhdGVWYXJpYWJsZXM6ICh2YXJpYWJsZXMsIGNhbGxiYWNrKSAtPlxuICAgIHVwZGF0ZWQgPSBbXVxuICAgIHJlbWFpbmluZ1ZhcmlhYmxlcyA9IHZhcmlhYmxlcy5zbGljZSgpXG5cbiAgICBpdGVyYXRpb24gPSAoY2IpID0+XG4gICAgICBzdGFydCA9IG5ldyBEYXRlXG4gICAgICBlbmQgPSBuZXcgRGF0ZVxuXG4gICAgICB3aGlsZSByZW1haW5pbmdWYXJpYWJsZXMubGVuZ3RoID4gMCBhbmQgZW5kIC0gc3RhcnQgPCAxMDBcbiAgICAgICAgdiA9IHJlbWFpbmluZ1ZhcmlhYmxlcy5zaGlmdCgpXG4gICAgICAgIHdhc0NvbG9yID0gdi5pc0NvbG9yXG4gICAgICAgIEBldmFsdWF0ZVZhcmlhYmxlQ29sb3Iodiwgd2FzQ29sb3IpXG4gICAgICAgIGlzQ29sb3IgPSB2LmlzQ29sb3JcblxuICAgICAgICBpZiBpc0NvbG9yIGlzbnQgd2FzQ29sb3JcbiAgICAgICAgICB1cGRhdGVkLnB1c2godilcbiAgICAgICAgICBAYnVpbGREZXBlbmRlbmN5R3JhcGgodikgaWYgaXNDb2xvclxuXG4gICAgICAgICAgZW5kID0gbmV3IERhdGVcblxuICAgICAgaWYgcmVtYWluaW5nVmFyaWFibGVzLmxlbmd0aCA+IDBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKC0+IGl0ZXJhdGlvbihjYikpXG4gICAgICBlbHNlXG4gICAgICAgIGNiPygpXG5cbiAgICBpdGVyYXRpb24gPT5cbiAgICAgIEBlbWl0Q2hhbmdlRXZlbnQoQHVwZGF0ZURlcGVuZGVuY2llcyh7dXBkYXRlZH0pKSBpZiB1cGRhdGVkLmxlbmd0aCA+IDBcbiAgICAgIGNhbGxiYWNrPyh1cGRhdGVkKVxuXG4gIHVwZGF0ZVZhcmlhYmxlOiAocHJldmlvdXNWYXJpYWJsZSwgdmFyaWFibGUsIGJhdGNoKSAtPlxuICAgIHByZXZpb3VzRGVwZW5kZW5jaWVzID0gQGdldFZhcmlhYmxlRGVwZW5kZW5jaWVzKHByZXZpb3VzVmFyaWFibGUpXG4gICAgcHJldmlvdXNWYXJpYWJsZS52YWx1ZSA9IHZhcmlhYmxlLnZhbHVlXG4gICAgcHJldmlvdXNWYXJpYWJsZS5yYW5nZSA9IHZhcmlhYmxlLnJhbmdlXG4gICAgcHJldmlvdXNWYXJpYWJsZS5idWZmZXJSYW5nZSA9IHZhcmlhYmxlLmJ1ZmZlclJhbmdlXG5cbiAgICBAZXZhbHVhdGVWYXJpYWJsZUNvbG9yKHByZXZpb3VzVmFyaWFibGUsIHByZXZpb3VzVmFyaWFibGUuaXNDb2xvcilcbiAgICBuZXdEZXBlbmRlbmNpZXMgPSBAZ2V0VmFyaWFibGVEZXBlbmRlbmNpZXMocHJldmlvdXNWYXJpYWJsZSlcblxuICAgIHtyZW1vdmVkLCBhZGRlZH0gPSBAZGlmZkFycmF5cyhwcmV2aW91c0RlcGVuZGVuY2llcywgbmV3RGVwZW5kZW5jaWVzKVxuICAgIEByZW1vdmVEZXBlbmRlbmNpZXModmFyaWFibGUubmFtZSwgcmVtb3ZlZClcbiAgICBAYWRkRGVwZW5kZW5jaWVzKHZhcmlhYmxlLm5hbWUsIGFkZGVkKVxuXG4gICAgaWYgYmF0Y2hcbiAgICAgIHJldHVybiBbJ3VwZGF0ZWQnLCBwcmV2aW91c1ZhcmlhYmxlXVxuICAgIGVsc2VcbiAgICAgIEBlbWl0Q2hhbmdlRXZlbnQoQHVwZGF0ZURlcGVuZGVuY2llcyh1cGRhdGVkOiBbcHJldmlvdXNWYXJpYWJsZV0pKVxuXG4gIHJlc3RvcmVWYXJpYWJsZTogKHZhcmlhYmxlKSAtPlxuICAgIENvbG9yID89IHJlcXVpcmUgJy4vY29sb3InXG5cbiAgICBAdmFyaWFibGVOYW1lcy5wdXNoKHZhcmlhYmxlLm5hbWUpXG4gICAgQHZhcmlhYmxlcy5wdXNoIHZhcmlhYmxlXG4gICAgdmFyaWFibGUuaWQgPSBuZXh0SWQrK1xuXG4gICAgaWYgdmFyaWFibGUuaXNDb2xvclxuICAgICAgdmFyaWFibGUuY29sb3IgPSBuZXcgQ29sb3IodmFyaWFibGUuY29sb3IpXG4gICAgICB2YXJpYWJsZS5jb2xvci52YXJpYWJsZXMgPSB2YXJpYWJsZS52YXJpYWJsZXNcbiAgICAgIEBjb2xvclZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKVxuICAgICAgZGVsZXRlIHZhcmlhYmxlLnZhcmlhYmxlc1xuXG4gICAgQHZhcmlhYmxlc0J5UGF0aFt2YXJpYWJsZS5wYXRoXSA/PSBbXVxuICAgIEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF0ucHVzaCh2YXJpYWJsZSlcblxuICAgIEBidWlsZERlcGVuZGVuY3lHcmFwaCh2YXJpYWJsZSlcblxuICBjcmVhdGVWYXJpYWJsZTogKHZhcmlhYmxlLCBiYXRjaCkgLT5cbiAgICBAdmFyaWFibGVOYW1lcy5wdXNoKHZhcmlhYmxlLm5hbWUpXG4gICAgQHZhcmlhYmxlcy5wdXNoIHZhcmlhYmxlXG4gICAgdmFyaWFibGUuaWQgPSBuZXh0SWQrK1xuXG4gICAgQHZhcmlhYmxlc0J5UGF0aFt2YXJpYWJsZS5wYXRoXSA/PSBbXVxuICAgIEB2YXJpYWJsZXNCeVBhdGhbdmFyaWFibGUucGF0aF0ucHVzaCh2YXJpYWJsZSlcblxuICAgIEBldmFsdWF0ZVZhcmlhYmxlQ29sb3IodmFyaWFibGUpXG4gICAgQGJ1aWxkRGVwZW5kZW5jeUdyYXBoKHZhcmlhYmxlKVxuXG4gICAgaWYgYmF0Y2hcbiAgICAgIHJldHVybiBbJ2NyZWF0ZWQnLCB2YXJpYWJsZV1cbiAgICBlbHNlXG4gICAgICBAZW1pdENoYW5nZUV2ZW50KEB1cGRhdGVEZXBlbmRlbmNpZXMoY3JlYXRlZDogW3ZhcmlhYmxlXSkpXG5cbiAgZXZhbHVhdGVWYXJpYWJsZUNvbG9yOiAodmFyaWFibGUsIHdhc0NvbG9yPWZhbHNlKSAtPlxuICAgIGNvbnRleHQgPSBAZ2V0Q29udGV4dCgpXG4gICAgY29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcih2YXJpYWJsZS52YWx1ZSwgdHJ1ZSlcblxuICAgIGlmIGNvbG9yP1xuICAgICAgcmV0dXJuIGZhbHNlIGlmIHdhc0NvbG9yIGFuZCBjb2xvci5pc0VxdWFsKHZhcmlhYmxlLmNvbG9yKVxuXG4gICAgICB2YXJpYWJsZS5jb2xvciA9IGNvbG9yXG4gICAgICB2YXJpYWJsZS5pc0NvbG9yID0gdHJ1ZVxuXG4gICAgICBAY29sb3JWYXJpYWJsZXMucHVzaCh2YXJpYWJsZSkgdW5sZXNzIHZhcmlhYmxlIGluIEBjb2xvclZhcmlhYmxlc1xuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGVsc2UgaWYgd2FzQ29sb3JcbiAgICAgIGRlbGV0ZSB2YXJpYWJsZS5jb2xvclxuICAgICAgdmFyaWFibGUuaXNDb2xvciA9IGZhbHNlXG4gICAgICBAY29sb3JWYXJpYWJsZXMgPSBAY29sb3JWYXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2IGlzbnQgdmFyaWFibGVcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgZ2V0VmFyaWFibGVTdGF0dXM6ICh2YXJpYWJsZSkgLT5cbiAgICByZXR1cm4gWydjcmVhdGVkJywgdmFyaWFibGVdIHVubGVzcyBAdmFyaWFibGVzQnlQYXRoW3ZhcmlhYmxlLnBhdGhdP1xuICAgIEBnZXRWYXJpYWJsZVN0YXR1c0luQ29sbGVjdGlvbih2YXJpYWJsZSwgQHZhcmlhYmxlc0J5UGF0aFt2YXJpYWJsZS5wYXRoXSlcblxuICBnZXRWYXJpYWJsZVN0YXR1c0luQ29sbGVjdGlvbjogKHZhcmlhYmxlLCBjb2xsZWN0aW9uKSAtPlxuICAgIGZvciB2IGluIGNvbGxlY3Rpb25cbiAgICAgIHN0YXR1cyA9IEBjb21wYXJlVmFyaWFibGVzKHYsIHZhcmlhYmxlKVxuXG4gICAgICBzd2l0Y2ggc3RhdHVzXG4gICAgICAgIHdoZW4gJ2lkZW50aWNhbCcgdGhlbiByZXR1cm4gWyd1bmNoYW5nZWQnLCB2XVxuICAgICAgICB3aGVuICdtb3ZlJyB0aGVuIHJldHVybiBbJ21vdmVkJywgdl1cbiAgICAgICAgd2hlbiAndXBkYXRlJyB0aGVuIHJldHVybiBbJ3VwZGF0ZWQnLCB2XVxuXG4gICAgcmV0dXJuIFsnY3JlYXRlZCcsIHZhcmlhYmxlXVxuXG4gIGNvbXBhcmVWYXJpYWJsZXM6ICh2MSwgdjIpIC0+XG4gICAgc2FtZU5hbWUgPSB2MS5uYW1lIGlzIHYyLm5hbWVcbiAgICBzYW1lVmFsdWUgPSB2MS52YWx1ZSBpcyB2Mi52YWx1ZVxuICAgIHNhbWVMaW5lID0gdjEubGluZSBpcyB2Mi5saW5lXG4gICAgc2FtZVJhbmdlID0gdjEucmFuZ2VbMF0gaXMgdjIucmFuZ2VbMF0gYW5kIHYxLnJhbmdlWzFdIGlzIHYyLnJhbmdlWzFdXG5cbiAgICBpZiB2MS5idWZmZXJSYW5nZT8gYW5kIHYyLmJ1ZmZlclJhbmdlP1xuICAgICAgc2FtZVJhbmdlICYmPSB2MS5idWZmZXJSYW5nZS5pc0VxdWFsKHYyLmJ1ZmZlclJhbmdlKVxuXG4gICAgaWYgc2FtZU5hbWUgYW5kIHNhbWVWYWx1ZVxuICAgICAgaWYgc2FtZVJhbmdlXG4gICAgICAgICdpZGVudGljYWwnXG4gICAgICBlbHNlXG4gICAgICAgICdtb3ZlJ1xuICAgIGVsc2UgaWYgc2FtZU5hbWVcbiAgICAgIGlmIHNhbWVSYW5nZSBvciBzYW1lTGluZVxuICAgICAgICAndXBkYXRlJ1xuICAgICAgZWxzZVxuICAgICAgICAnZGlmZmVyZW50J1xuXG4gIGJ1aWxkRGVwZW5kZW5jeUdyYXBoOiAodmFyaWFibGUpIC0+XG4gICAgZGVwZW5kZW5jaWVzID0gQGdldFZhcmlhYmxlRGVwZW5kZW5jaWVzKHZhcmlhYmxlKVxuICAgIGZvciBkZXBlbmRlbmN5IGluIGRlcGVuZGVuY2llc1xuICAgICAgYSA9IEBkZXBlbmRlbmN5R3JhcGhbZGVwZW5kZW5jeV0gPz0gW11cbiAgICAgIGEucHVzaCh2YXJpYWJsZS5uYW1lKSB1bmxlc3MgdmFyaWFibGUubmFtZSBpbiBhXG5cbiAgZ2V0VmFyaWFibGVEZXBlbmRlbmNpZXM6ICh2YXJpYWJsZSkgLT5cbiAgICBkZXBlbmRlbmNpZXMgPSBbXVxuICAgIGRlcGVuZGVuY2llcy5wdXNoKHZhcmlhYmxlLnZhbHVlKSBpZiB2YXJpYWJsZS52YWx1ZSBpbiBAdmFyaWFibGVOYW1lc1xuXG4gICAgaWYgdmFyaWFibGUuY29sb3I/LnZhcmlhYmxlcz8ubGVuZ3RoID4gMFxuICAgICAgdmFyaWFibGVzID0gdmFyaWFibGUuY29sb3IudmFyaWFibGVzXG5cbiAgICAgIGZvciB2IGluIHZhcmlhYmxlc1xuICAgICAgICBkZXBlbmRlbmNpZXMucHVzaCh2KSB1bmxlc3MgdiBpbiBkZXBlbmRlbmNpZXNcblxuICAgIGRlcGVuZGVuY2llc1xuXG4gIGNvbGxlY3RWYXJpYWJsZXNCeU5hbWU6IChuYW1lcykgLT5cbiAgICB2YXJpYWJsZXMgPSBbXVxuICAgIHZhcmlhYmxlcy5wdXNoIHYgZm9yIHYgaW4gQHZhcmlhYmxlcyB3aGVuIHYubmFtZSBpbiBuYW1lc1xuICAgIHZhcmlhYmxlc1xuXG4gIHJlbW92ZURlcGVuZGVuY2llczogKGZyb20sIHRvKSAtPlxuICAgIGZvciB2IGluIHRvXG4gICAgICBpZiBkZXBlbmRlbmNpZXMgPSBAZGVwZW5kZW5jeUdyYXBoW3ZdXG4gICAgICAgIGRlcGVuZGVuY2llcy5zcGxpY2UoZGVwZW5kZW5jaWVzLmluZGV4T2YoZnJvbSksIDEpXG5cbiAgICAgICAgZGVsZXRlIEBkZXBlbmRlbmN5R3JhcGhbdl0gaWYgZGVwZW5kZW5jaWVzLmxlbmd0aCBpcyAwXG5cbiAgYWRkRGVwZW5kZW5jaWVzOiAoZnJvbSwgdG8pIC0+XG4gICAgZm9yIHYgaW4gdG9cbiAgICAgIEBkZXBlbmRlbmN5R3JhcGhbdl0gPz0gW11cbiAgICAgIEBkZXBlbmRlbmN5R3JhcGhbdl0ucHVzaChmcm9tKVxuXG4gIHVwZGF0ZURlcGVuZGVuY2llczogKHtjcmVhdGVkLCB1cGRhdGVkLCBkZXN0cm95ZWR9KSAtPlxuICAgIEB1cGRhdGVDb2xvclZhcmlhYmxlc0V4cHJlc3Npb24oKVxuXG4gICAgdmFyaWFibGVzID0gW11cbiAgICBkaXJ0eVZhcmlhYmxlTmFtZXMgPSBbXVxuXG4gICAgaWYgY3JlYXRlZD9cbiAgICAgIHZhcmlhYmxlcyA9IHZhcmlhYmxlcy5jb25jYXQoY3JlYXRlZClcbiAgICAgIGNyZWF0ZWRWYXJpYWJsZU5hbWVzID0gY3JlYXRlZC5tYXAgKHYpIC0+IHYubmFtZVxuICAgIGVsc2VcbiAgICAgIGNyZWF0ZWRWYXJpYWJsZU5hbWVzID0gW11cblxuICAgIHZhcmlhYmxlcyA9IHZhcmlhYmxlcy5jb25jYXQodXBkYXRlZCkgaWYgdXBkYXRlZD9cbiAgICB2YXJpYWJsZXMgPSB2YXJpYWJsZXMuY29uY2F0KGRlc3Ryb3llZCkgaWYgZGVzdHJveWVkP1xuICAgIHZhcmlhYmxlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHY/XG5cbiAgICBmb3IgdmFyaWFibGUgaW4gdmFyaWFibGVzXG4gICAgICBpZiBkZXBlbmRlbmNpZXMgPSBAZGVwZW5kZW5jeUdyYXBoW3ZhcmlhYmxlLm5hbWVdXG4gICAgICAgIGZvciBuYW1lIGluIGRlcGVuZGVuY2llc1xuICAgICAgICAgIGlmIG5hbWUgbm90IGluIGRpcnR5VmFyaWFibGVOYW1lcyBhbmQgbmFtZSBub3QgaW4gY3JlYXRlZFZhcmlhYmxlTmFtZXNcbiAgICAgICAgICAgIGRpcnR5VmFyaWFibGVOYW1lcy5wdXNoKG5hbWUpXG5cbiAgICBkaXJ0eVZhcmlhYmxlcyA9IEBjb2xsZWN0VmFyaWFibGVzQnlOYW1lKGRpcnR5VmFyaWFibGVOYW1lcylcblxuICAgIGZvciB2YXJpYWJsZSBpbiBkaXJ0eVZhcmlhYmxlc1xuICAgICAgaWYgQGV2YWx1YXRlVmFyaWFibGVDb2xvcih2YXJpYWJsZSwgdmFyaWFibGUuaXNDb2xvcilcbiAgICAgICAgdXBkYXRlZCA/PSBbXVxuICAgICAgICB1cGRhdGVkLnB1c2godmFyaWFibGUpXG5cbiAgICB7Y3JlYXRlZCwgZGVzdHJveWVkLCB1cGRhdGVkfVxuXG4gIGVtaXRDaGFuZ2VFdmVudDogKHtjcmVhdGVkLCBkZXN0cm95ZWQsIHVwZGF0ZWR9KSAtPlxuICAgIGlmIGNyZWF0ZWQ/Lmxlbmd0aCBvciBkZXN0cm95ZWQ/Lmxlbmd0aCBvciB1cGRhdGVkPy5sZW5ndGhcbiAgICAgIEB1cGRhdGVDb2xvclZhcmlhYmxlc0V4cHJlc3Npb24oKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZScsIHtjcmVhdGVkLCBkZXN0cm95ZWQsIHVwZGF0ZWR9XG5cbiAgdXBkYXRlQ29sb3JWYXJpYWJsZXNFeHByZXNzaW9uOiAtPlxuICAgIHJlZ2lzdHJ5ID89IHJlcXVpcmUgJy4vY29sb3ItZXhwcmVzc2lvbnMnXG5cbiAgICBjb2xvclZhcmlhYmxlcyA9IEBnZXRDb2xvclZhcmlhYmxlcygpXG4gICAgaWYgY29sb3JWYXJpYWJsZXMubGVuZ3RoID4gMFxuICAgICAgQ29sb3JFeHByZXNzaW9uID89IHJlcXVpcmUgJy4vY29sb3ItZXhwcmVzc2lvbidcblxuICAgICAgcmVnaXN0cnkuYWRkRXhwcmVzc2lvbihDb2xvckV4cHJlc3Npb24uY29sb3JFeHByZXNzaW9uRm9yQ29sb3JWYXJpYWJsZXMoY29sb3JWYXJpYWJsZXMpKVxuICAgIGVsc2VcbiAgICAgIHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24oJ3BpZ21lbnRzOnZhcmlhYmxlcycpXG5cbiAgZGlmZkFycmF5czogKGEsYikgLT5cbiAgICByZW1vdmVkID0gW11cbiAgICBhZGRlZCA9IFtdXG5cbiAgICByZW1vdmVkLnB1c2godikgZm9yIHYgaW4gYSB3aGVuIHYgbm90IGluIGJcbiAgICBhZGRlZC5wdXNoKHYpIGZvciB2IGluIGIgd2hlbiB2IG5vdCBpbiBhXG5cbiAgICB7cmVtb3ZlZCwgYWRkZWR9XG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ1ZhcmlhYmxlc0NvbGxlY3Rpb24nXG4gICAgICBjb250ZW50OiBAdmFyaWFibGVzLm1hcCAodikgLT5cbiAgICAgICAgcmVzID0ge1xuICAgICAgICAgIG5hbWU6IHYubmFtZVxuICAgICAgICAgIHZhbHVlOiB2LnZhbHVlXG4gICAgICAgICAgcGF0aDogdi5wYXRoXG4gICAgICAgICAgcmFuZ2U6IHYucmFuZ2VcbiAgICAgICAgICBsaW5lOiB2LmxpbmVcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5pc0FsdGVybmF0ZSA9IHRydWUgaWYgdi5pc0FsdGVybmF0ZVxuICAgICAgICByZXMubm9OYW1lUHJlZml4ID0gdHJ1ZSBpZiB2Lm5vTmFtZVByZWZpeFxuICAgICAgICByZXMuZGVmYXVsdCA9IHRydWUgaWYgdi5kZWZhdWx0XG5cbiAgICAgICAgaWYgdi5pc0NvbG9yXG4gICAgICAgICAgcmVzLmlzQ29sb3IgPSB0cnVlXG4gICAgICAgICAgcmVzLmNvbG9yID0gdi5jb2xvci5zZXJpYWxpemUoKVxuICAgICAgICAgIHJlcy52YXJpYWJsZXMgPSB2LmNvbG9yLnZhcmlhYmxlcyBpZiB2LmNvbG9yLnZhcmlhYmxlcz9cblxuICAgICAgICByZXNcbiAgICB9XG4iXX0=

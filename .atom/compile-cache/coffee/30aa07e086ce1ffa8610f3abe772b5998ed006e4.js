(function() {
  var Emitter, ExpressionsRegistry, ref, vm,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Emitter = ref[0], vm = ref[1];

  module.exports = ExpressionsRegistry = (function() {
    ExpressionsRegistry.deserialize = function(serializedData, expressionsType) {
      var data, handle, name, ref1, registry;
      if (vm == null) {
        vm = require('vm');
      }
      registry = new ExpressionsRegistry(expressionsType);
      ref1 = serializedData.expressions;
      for (name in ref1) {
        data = ref1[name];
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"), {
          console: console,
          require: require
        });
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpStrings['none'] = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType1) {
      this.expressionsType = expressionsType1;
      if (Emitter == null) {
        Emitter = require('event-kit').Emitter;
      }
      this.colorExpressions = {};
      this.emitter = new Emitter;
      this.regexpStrings = {};
    }

    ExpressionsRegistry.prototype.dispose = function() {
      return this.emitter.dispose();
    };

    ExpressionsRegistry.prototype.onDidAddExpression = function(callback) {
      return this.emitter.on('did-add-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidRemoveExpression = function(callback) {
      return this.emitter.on('did-remove-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidUpdateExpressions = function(callback) {
      return this.emitter.on('did-update-expressions', callback);
    };

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var ref1, results;
        ref1 = this.colorExpressions;
        results = [];
        for (k in ref1) {
          e = ref1[k];
          results.push(e);
        }
        return results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpressionsForScope = function(scope) {
      var expressions, matchScope;
      expressions = this.getExpressions();
      if (scope === '*') {
        return expressions;
      }
      matchScope = function(a) {
        return function(b) {
          var aa, ab, ba, bb, ref1, ref2;
          ref1 = a.split(':'), aa = ref1[0], ab = ref1[1];
          ref2 = b.split(':'), ba = ref2[0], bb = ref2[1];
          return aa === ba && ((ab == null) || (bb == null) || ab === bb);
        };
      };
      return expressions.filter(function(e) {
        return indexOf.call(e.scopes, '*') >= 0 || e.scopes.some(matchScope(scope));
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      var base;
      return (base = this.regexpStrings)['none'] != null ? base['none'] : base['none'] = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      var base;
      return (base = this.regexpStrings)[scope] != null ? base[scope] : base[scope] = this.getExpressionsForScope(scope).map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, scopes, handle) {
      var newExpression;
      if (priority == null) {
        priority = 0;
      }
      if (scopes == null) {
        scopes = ['*'];
      }
      if (typeof priority === 'function') {
        handle = priority;
        scopes = ['*'];
        priority = 0;
      } else if (typeof priority === 'object') {
        if (typeof scopes === 'function') {
          handle = scopes;
        }
        scopes = priority;
        priority = 0;
      }
      if (!(scopes.length === 1 && scopes[0] === '*')) {
        scopes.push('pigments');
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        scopes: scopes,
        priority: priority,
        handle: handle
      });
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression, batch) {
      if (batch == null) {
        batch = false;
      }
      this.regexpStrings = {};
      this.colorExpressions[expression.name] = expression;
      if (!batch) {
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
        this.emitter.emit('did-update-expressions', {
          name: expression.name,
          registry: this
        });
      }
      return expression;
    };

    ExpressionsRegistry.prototype.createExpressions = function(expressions) {
      return this.addExpressions(expressions.map((function(_this) {
        return function(e) {
          var expression, handle, name, priority, regexpString, scopes;
          name = e.name, regexpString = e.regexpString, handle = e.handle, priority = e.priority, scopes = e.scopes;
          if (priority == null) {
            priority = 0;
          }
          expression = new _this.expressionsType({
            name: name,
            regexpString: regexpString,
            scopes: scopes,
            handle: handle
          });
          expression.priority = priority;
          return expression;
        };
      })(this)));
    };

    ExpressionsRegistry.prototype.addExpressions = function(expressions) {
      var expression, i, len;
      for (i = 0, len = expressions.length; i < len; i++) {
        expression = expressions[i];
        this.addExpression(expression, true);
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
      }
      return this.emitter.emit('did-update-expressions', {
        registry: this
      });
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      delete this.colorExpressions[name];
      this.regexpStrings = {};
      this.emitter.emit('did-remove-expression', {
        name: name,
        registry: this
      });
      return this.emitter.emit('did-update-expressions', {
        name: name,
        registry: this
      });
    };

    ExpressionsRegistry.prototype.serialize = function() {
      var expression, key, out, ref1, ref2;
      out = {
        regexpString: this.getRegExp(),
        expressions: {}
      };
      ref1 = this.colorExpressions;
      for (key in ref1) {
        expression = ref1[key];
        out.expressions[key] = {
          name: expression.name,
          regexpString: expression.regexpString,
          priority: expression.priority,
          scopes: expression.scopes,
          handle: (ref2 = expression.handle) != null ? ref2.toString() : void 0
        };
      }
      return out;
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvZXhwcmVzc2lvbnMtcmVnaXN0cnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxQ0FBQTtJQUFBOztFQUFBLE1BQWdCLEVBQWhCLEVBQUMsZ0JBQUQsRUFBVTs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxjQUFELEVBQWlCLGVBQWpCO0FBQ1osVUFBQTs7UUFBQSxLQUFNLE9BQUEsQ0FBUSxJQUFSOztNQUVOLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGVBQXBCO0FBRWY7QUFBQSxXQUFBLFlBQUE7O1FBQ0UsTUFBQSxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxtQkFBaEMsQ0FBbkIsRUFBeUU7VUFBQyxTQUFBLE9BQUQ7VUFBVSxTQUFBLE9BQVY7U0FBekU7UUFDVCxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBSSxDQUFDLFlBQXJDLEVBQW1ELElBQUksQ0FBQyxRQUF4RCxFQUFrRSxJQUFJLENBQUMsTUFBdkUsRUFBK0UsTUFBL0U7QUFGRjtNQUlBLFFBQVEsQ0FBQyxhQUFjLENBQUEsTUFBQSxDQUF2QixHQUFpQyxjQUFjLENBQUM7YUFFaEQ7SUFYWTs7SUFjRCw2QkFBQyxnQkFBRDtNQUFDLElBQUMsQ0FBQSxrQkFBRDs7UUFDWixVQUFXLE9BQUEsQ0FBUSxXQUFSLENBQW9CLENBQUM7O01BRWhDLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUxOOztrQ0FPYixPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxPQUFP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TSxVQUFVLENBQUMsSUFBakI7VUFDQSxZQUFBLEVBQWMsVUFBVSxDQUFDLFlBRHpCO1VBRUEsUUFBQSxFQUFVLFVBQVUsQ0FBQyxRQUZyQjtVQUdBLE1BQUEsRUFBUSxVQUFVLENBQUMsTUFIbkI7VUFJQSxNQUFBLDJDQUF5QixDQUFFLFFBQW5CLENBQUEsVUFKUjs7QUFGSjthQVFBO0lBYlM7Ozs7O0FBNUdiIiwic291cmNlc0NvbnRlbnQiOlsiW0VtaXR0ZXIsIHZtXSA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEV4cHJlc3Npb25zUmVnaXN0cnlcbiAgQGRlc2VyaWFsaXplOiAoc2VyaWFsaXplZERhdGEsIGV4cHJlc3Npb25zVHlwZSkgLT5cbiAgICB2bSA/PSByZXF1aXJlICd2bSdcblxuICAgIHJlZ2lzdHJ5ID0gbmV3IEV4cHJlc3Npb25zUmVnaXN0cnkoZXhwcmVzc2lvbnNUeXBlKVxuXG4gICAgZm9yIG5hbWUsIGRhdGEgb2Ygc2VyaWFsaXplZERhdGEuZXhwcmVzc2lvbnNcbiAgICAgIGhhbmRsZSA9IHZtLnJ1bkluTmV3Q29udGV4dChkYXRhLmhhbmRsZS5yZXBsYWNlKCdmdW5jdGlvbicsIFwiaGFuZGxlID0gZnVuY3Rpb25cIiksIHtjb25zb2xlLCByZXF1aXJlfSlcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24obmFtZSwgZGF0YS5yZWdleHBTdHJpbmcsIGRhdGEucHJpb3JpdHksIGRhdGEuc2NvcGVzLCBoYW5kbGUpXG5cbiAgICByZWdpc3RyeS5yZWdleHBTdHJpbmdzWydub25lJ10gPSBzZXJpYWxpemVkRGF0YS5yZWdleHBTdHJpbmdcblxuICAgIHJlZ2lzdHJ5XG5cbiAgIyBUaGUge09iamVjdH0gd2hlcmUgY29sb3IgZXhwcmVzc2lvbiBoYW5kbGVycyBhcmUgc3RvcmVkXG4gIGNvbnN0cnVjdG9yOiAoQGV4cHJlc3Npb25zVHlwZSkgLT5cbiAgICBFbWl0dGVyID89IHJlcXVpcmUoJ2V2ZW50LWtpdCcpLkVtaXR0ZXJcblxuICAgIEBjb2xvckV4cHJlc3Npb25zID0ge31cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQHJlZ2V4cFN0cmluZ3MgPSB7fVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgQGVtaXR0ZXIuZGlzcG9zZSgpXG5cbiAgb25EaWRBZGRFeHByZXNzaW9uOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtZXhwcmVzc2lvbicsIGNhbGxiYWNrXG5cbiAgb25EaWRSZW1vdmVFeHByZXNzaW9uOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtZXhwcmVzc2lvbicsIGNhbGxiYWNrXG5cbiAgb25EaWRVcGRhdGVFeHByZXNzaW9uczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtdXBkYXRlLWV4cHJlc3Npb25zJywgY2FsbGJhY2tcblxuICBnZXRFeHByZXNzaW9uczogLT5cbiAgICAoZSBmb3IgayxlIG9mIEBjb2xvckV4cHJlc3Npb25zKS5zb3J0KChhLGIpIC0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5KVxuXG4gIGdldEV4cHJlc3Npb25zRm9yU2NvcGU6IChzY29wZSkgLT5cbiAgICBleHByZXNzaW9ucyA9IEBnZXRFeHByZXNzaW9ucygpXG5cbiAgICByZXR1cm4gZXhwcmVzc2lvbnMgaWYgc2NvcGUgaXMgJyonXG5cbiAgICBtYXRjaFNjb3BlID0gKGEpIC0+IChiKSAtPlxuICAgICAgW2FhLCBhYl0gPSBhLnNwbGl0KCc6JylcbiAgICAgIFtiYSwgYmJdID0gYi5zcGxpdCgnOicpXG5cbiAgICAgIGFhIGlzIGJhIGFuZCAobm90IGFiPyBvciBub3QgYmI/IG9yIGFiIGlzIGJiKVxuXG4gICAgZXhwcmVzc2lvbnMuZmlsdGVyIChlKSAtPlxuICAgICAgJyonIGluIGUuc2NvcGVzIG9yIGUuc2NvcGVzLnNvbWUobWF0Y2hTY29wZShzY29wZSkpXG5cbiAgZ2V0RXhwcmVzc2lvbjogKG5hbWUpIC0+IEBjb2xvckV4cHJlc3Npb25zW25hbWVdXG5cbiAgZ2V0UmVnRXhwOiAtPlxuICAgIEByZWdleHBTdHJpbmdzWydub25lJ10gPz0gQGdldEV4cHJlc3Npb25zKCkubWFwKChlKSAtPlxuICAgICAgXCIoI3tlLnJlZ2V4cFN0cmluZ30pXCIpLmpvaW4oJ3wnKVxuXG4gIGdldFJlZ0V4cEZvclNjb3BlOiAoc2NvcGUpIC0+XG4gICAgQHJlZ2V4cFN0cmluZ3Nbc2NvcGVdID89IEBnZXRFeHByZXNzaW9uc0ZvclNjb3BlKHNjb3BlKS5tYXAoKGUpIC0+XG4gICAgICBcIigje2UucmVnZXhwU3RyaW5nfSlcIikuam9pbignfCcpXG5cbiAgY3JlYXRlRXhwcmVzc2lvbjogKG5hbWUsIHJlZ2V4cFN0cmluZywgcHJpb3JpdHk9MCwgc2NvcGVzPVsnKiddLCBoYW5kbGUpIC0+XG4gICAgaWYgdHlwZW9mIHByaW9yaXR5IGlzICdmdW5jdGlvbidcbiAgICAgIGhhbmRsZSA9IHByaW9yaXR5XG4gICAgICBzY29wZXMgPSBbJyonXVxuICAgICAgcHJpb3JpdHkgPSAwXG4gICAgZWxzZSBpZiB0eXBlb2YgcHJpb3JpdHkgaXMgJ29iamVjdCdcbiAgICAgIGhhbmRsZSA9IHNjb3BlcyBpZiB0eXBlb2Ygc2NvcGVzIGlzICdmdW5jdGlvbidcbiAgICAgIHNjb3BlcyA9IHByaW9yaXR5XG4gICAgICBwcmlvcml0eSA9IDBcblxuICAgIHNjb3Blcy5wdXNoKCdwaWdtZW50cycpIHVubGVzcyBzY29wZXMubGVuZ3RoIGlzIDEgYW5kIHNjb3Blc1swXSBpcyAnKidcblxuICAgIG5ld0V4cHJlc3Npb24gPSBuZXcgQGV4cHJlc3Npb25zVHlwZSh7bmFtZSwgcmVnZXhwU3RyaW5nLCBzY29wZXMsIHByaW9yaXR5LCBoYW5kbGV9KVxuICAgIEBhZGRFeHByZXNzaW9uIG5ld0V4cHJlc3Npb25cblxuICBhZGRFeHByZXNzaW9uOiAoZXhwcmVzc2lvbiwgYmF0Y2g9ZmFsc2UpIC0+XG4gICAgQHJlZ2V4cFN0cmluZ3MgPSB7fVxuICAgIEBjb2xvckV4cHJlc3Npb25zW2V4cHJlc3Npb24ubmFtZV0gPSBleHByZXNzaW9uXG5cbiAgICB1bmxlc3MgYmF0Y2hcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtZXhwcmVzc2lvbicsIHtuYW1lOiBleHByZXNzaW9uLm5hbWUsIHJlZ2lzdHJ5OiB0aGlzfVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtuYW1lOiBleHByZXNzaW9uLm5hbWUsIHJlZ2lzdHJ5OiB0aGlzfVxuICAgIGV4cHJlc3Npb25cblxuICBjcmVhdGVFeHByZXNzaW9uczogKGV4cHJlc3Npb25zKSAtPlxuICAgIEBhZGRFeHByZXNzaW9ucyBleHByZXNzaW9ucy5tYXAgKGUpID0+XG4gICAgICB7bmFtZSwgcmVnZXhwU3RyaW5nLCBoYW5kbGUsIHByaW9yaXR5LCBzY29wZXN9ID0gZVxuICAgICAgcHJpb3JpdHkgPz0gMFxuICAgICAgZXhwcmVzc2lvbiA9IG5ldyBAZXhwcmVzc2lvbnNUeXBlKHtuYW1lLCByZWdleHBTdHJpbmcsIHNjb3BlcywgaGFuZGxlfSlcbiAgICAgIGV4cHJlc3Npb24ucHJpb3JpdHkgPSBwcmlvcml0eVxuICAgICAgZXhwcmVzc2lvblxuXG4gIGFkZEV4cHJlc3Npb25zOiAoZXhwcmVzc2lvbnMpIC0+XG4gICAgZm9yIGV4cHJlc3Npb24gaW4gZXhwcmVzc2lvbnNcbiAgICAgIEBhZGRFeHByZXNzaW9uKGV4cHJlc3Npb24sIHRydWUpXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLWV4cHJlc3Npb24nLCB7bmFtZTogZXhwcmVzc2lvbi5uYW1lLCByZWdpc3RyeTogdGhpc31cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLWV4cHJlc3Npb25zJywge3JlZ2lzdHJ5OiB0aGlzfVxuXG4gIHJlbW92ZUV4cHJlc3Npb246IChuYW1lKSAtPlxuICAgIGRlbGV0ZSBAY29sb3JFeHByZXNzaW9uc1tuYW1lXVxuICAgIEByZWdleHBTdHJpbmdzID0ge31cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtcmVtb3ZlLWV4cHJlc3Npb24nLCB7bmFtZSwgcmVnaXN0cnk6IHRoaXN9XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtuYW1lLCByZWdpc3RyeTogdGhpc31cblxuICBzZXJpYWxpemU6IC0+XG4gICAgb3V0ID1cbiAgICAgIHJlZ2V4cFN0cmluZzogQGdldFJlZ0V4cCgpXG4gICAgICBleHByZXNzaW9uczoge31cblxuICAgIGZvciBrZXksIGV4cHJlc3Npb24gb2YgQGNvbG9yRXhwcmVzc2lvbnNcbiAgICAgIG91dC5leHByZXNzaW9uc1trZXldID1cbiAgICAgICAgbmFtZTogZXhwcmVzc2lvbi5uYW1lXG4gICAgICAgIHJlZ2V4cFN0cmluZzogZXhwcmVzc2lvbi5yZWdleHBTdHJpbmdcbiAgICAgICAgcHJpb3JpdHk6IGV4cHJlc3Npb24ucHJpb3JpdHlcbiAgICAgICAgc2NvcGVzOiBleHByZXNzaW9uLnNjb3Blc1xuICAgICAgICBoYW5kbGU6IGV4cHJlc3Npb24uaGFuZGxlPy50b1N0cmluZygpXG5cbiAgICBvdXRcbiJdfQ==

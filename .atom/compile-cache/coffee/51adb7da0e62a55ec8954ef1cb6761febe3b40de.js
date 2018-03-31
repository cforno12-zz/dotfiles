(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, ref, registry;
    ref = [], registry = ref[0], Dummy = ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(arg) {
          this.name = arg.name, this.regexpString = arg.regexpString, this.priority = arg.priority, this.scopes = arg.scopes, this.handle = arg.handle;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
    describe('::serialize', function() {
      return it('serializes the registry with the function content', function() {
        var serialized;
        registry.createExpression('dummy', 'foo');
        registry.createExpression('dummy2', 'bar', function(a, b, c) {
          return a + b - c;
        });
        serialized = registry.serialize();
        expect(serialized.regexpString).toEqual('(foo)|(bar)');
        expect(serialized.expressions.dummy).toEqual({
          name: 'dummy',
          regexpString: 'foo',
          handle: void 0,
          priority: 0,
          scopes: ['*']
        });
        return expect(serialized.expressions.dummy2).toEqual({
          name: 'dummy2',
          regexpString: 'bar',
          handle: registry.getExpression('dummy2').handle.toString(),
          priority: 0,
          scopes: ['*']
        });
      });
    });
    return describe('.deserialize', function() {
      return it('deserializes the provided expressions using the specified model', function() {
        var deserialized, serialized;
        serialized = {
          regexpString: 'foo|bar',
          expressions: {
            dummy: {
              name: 'dummy',
              regexpString: 'foo',
              handle: 'function (a,b,c) { return a + b - c; }',
              priority: 0,
              scopes: ['*']
            }
          }
        };
        deserialized = ExpressionsRegistry.deserialize(serialized, Dummy);
        expect(deserialized.getRegExp()).toEqual('foo|bar');
        expect(deserialized.getExpression('dummy').name).toEqual('dummy');
        expect(deserialized.getExpression('dummy').regexpString).toEqual('foo');
        return expect(deserialized.getExpression('dummy').handle(1, 2, 3)).toEqual(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2V4cHJlc3Npb25zLXJlZ2lzdHJ5LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsNkJBQVI7O0VBRXRCLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO0FBQzlCLFFBQUE7SUFBQSxNQUFvQixFQUFwQixFQUFDLGlCQUFELEVBQVc7SUFFWCxVQUFBLENBQVcsU0FBQTtNQUNIO1FBQ1MsZUFBQyxHQUFEO1VBQUUsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsbUJBQUEsY0FBYyxJQUFDLENBQUEsZUFBQSxVQUFVLElBQUMsQ0FBQSxhQUFBLFFBQVEsSUFBQyxDQUFBLGFBQUE7UUFBN0M7Ozs7O2FBRWYsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEI7SUFKTixDQUFYO0lBTUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7YUFDN0IsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7ZUFDbEMsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUE7QUFDL0QsY0FBQTtVQUFBLFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBbkM7VUFFYixNQUFBLENBQU8sVUFBVSxDQUFDLFdBQWxCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsS0FBcEM7aUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFULENBQUEsQ0FBUCxDQUFpQyxDQUFDLE9BQWxDLENBQTBDLENBQUMsVUFBRCxDQUExQztRQUorRCxDQUFqRTtNQURrQyxDQUFwQztJQUQ2QixDQUEvQjtJQVFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO2FBQzFCLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBO0FBQ3pELFlBQUE7UUFB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LFlBQUEsRUFBYyxTQUFkO1VBQ0EsV0FBQSxFQUNFO1lBQUEsS0FBQSxFQUNFO2NBQUEsSUFBQSxFQUFNLE9BQU47Y0FDQSxZQUFBLEVBQWMsS0FEZDtjQUVBLE1BQUEsRUFBUSx3Q0FGUjtjQUdBLFFBQUEsRUFBVSxDQUhWO2NBSUEsTUFBQSxFQUFRLENBQUMsR0FBRCxDQUpSO2FBREY7V0FGRjs7UUFTRixZQUFBLEdBQWUsbUJBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsVUFBaEMsRUFBNEMsS0FBNUM7UUFFZixNQUFBLENBQU8sWUFBWSxDQUFDLFNBQWIsQ0FBQSxDQUFQLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsU0FBekM7UUFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLGFBQWIsQ0FBMkIsT0FBM0IsQ0FBbUMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFDLE9BQWpELENBQXlELE9BQXpEO1FBQ0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxhQUFiLENBQTJCLE9BQTNCLENBQW1DLENBQUMsWUFBM0MsQ0FBd0QsQ0FBQyxPQUF6RCxDQUFpRSxLQUFqRTtlQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsYUFBYixDQUEyQixPQUEzQixDQUFtQyxDQUFDLE1BQXBDLENBQTJDLENBQTNDLEVBQTZDLENBQTdDLEVBQStDLENBQS9DLENBQVAsQ0FBeUQsQ0FBQyxPQUExRCxDQUFrRSxDQUFsRTtNQWhCb0UsQ0FBdEU7SUFEdUIsQ0FBekI7RUF0RThCLENBQWhDO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJFeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vbGliL2V4cHJlc3Npb25zLXJlZ2lzdHJ5J1xuXG5kZXNjcmliZSAnRXhwcmVzc2lvbnNSZWdpc3RyeScsIC0+XG4gIFtyZWdpc3RyeSwgRHVtbXldID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgY2xhc3MgRHVtbXlcbiAgICAgIGNvbnN0cnVjdG9yOiAoe0BuYW1lLCBAcmVnZXhwU3RyaW5nLCBAcHJpb3JpdHksIEBzY29wZXMsIEBoYW5kbGV9KSAtPlxuXG4gICAgcmVnaXN0cnkgPSBuZXcgRXhwcmVzc2lvbnNSZWdpc3RyeShEdW1teSlcblxuICBkZXNjcmliZSAnOjpjcmVhdGVFeHByZXNzaW9uJywgLT5cbiAgICBkZXNjcmliZSAnY2FsbGVkIHdpdGggZW5vdWdoIGRhdGEnLCAtPlxuICAgICAgaXQgJ2NyZWF0ZXMgYSBuZXcgZXhwcmVzc2lvbiBvZiB0aGlzIHJlZ2lzdHJ5IGV4cHJlc3Npb25zIHR5cGUnLCAtPlxuICAgICAgICBleHByZXNzaW9uID0gcmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAnZHVtbXknLCAnZm9vJ1xuXG4gICAgICAgIGV4cGVjdChleHByZXNzaW9uLmNvbnN0cnVjdG9yKS50b0JlKER1bW15KVxuICAgICAgICBleHBlY3QocmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnMoKSkudG9FcXVhbChbZXhwcmVzc2lvbl0pXG5cbiAgZGVzY3JpYmUgJzo6YWRkRXhwcmVzc2lvbicsIC0+XG4gICAgaXQgJ2FkZHMgYSBwcmV2aW91c2x5IGNyZWF0ZWQgZXhwcmVzc2lvbiBpbiB0aGUgcmVnaXN0cnknLCAtPlxuICAgICAgZXhwcmVzc2lvbiA9IG5ldyBEdW1teShuYW1lOiAnYmFyJylcblxuICAgICAgcmVnaXN0cnkuYWRkRXhwcmVzc2lvbihleHByZXNzaW9uKVxuXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0RXhwcmVzc2lvbignYmFyJykpLnRvQmUoZXhwcmVzc2lvbilcbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRFeHByZXNzaW9ucygpKS50b0VxdWFsKFtleHByZXNzaW9uXSlcblxuICBkZXNjcmliZSAnOjpnZXRFeHByZXNzaW9ucycsIC0+XG4gICAgaXQgJ3JldHVybnMgdGhlIGV4cHJlc3Npb24gYmFzZWQgb24gdGhlaXIgcHJpb3JpdHknLCAtPlxuICAgICAgZXhwcmVzc2lvbjEgPSByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teTEnLCAnJywgMlxuICAgICAgZXhwcmVzc2lvbjIgPSByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teTInLCAnJywgMFxuICAgICAgZXhwcmVzc2lvbjMgPSByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teTMnLCAnJywgMVxuXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnMoKSkudG9FcXVhbChbXG4gICAgICAgIGV4cHJlc3Npb24xXG4gICAgICAgIGV4cHJlc3Npb24zXG4gICAgICAgIGV4cHJlc3Npb24yXG4gICAgICBdKVxuXG4gIGRlc2NyaWJlICc6OnJlbW92ZUV4cHJlc3Npb24nLCAtPlxuICAgIGl0ICdyZW1vdmVzIGFuIGV4cHJlc3Npb24gd2l0aCBpdHMgbmFtZScsIC0+XG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teScsICdmb28nXG5cbiAgICAgIHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24oJ2R1bW15JylcblxuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LmdldEV4cHJlc3Npb25zKCkpLnRvRXF1YWwoW10pXG5cbiAgZGVzY3JpYmUgJzo6c2VyaWFsaXplJywgLT5cbiAgICBpdCAnc2VyaWFsaXplcyB0aGUgcmVnaXN0cnkgd2l0aCB0aGUgZnVuY3Rpb24gY29udGVudCcsIC0+XG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teScsICdmb28nXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teTInLCAnYmFyJywgKGEsYixjKSAtPiBhICsgYiAtIGNcblxuICAgICAgc2VyaWFsaXplZCA9IHJlZ2lzdHJ5LnNlcmlhbGl6ZSgpXG5cbiAgICAgIGV4cGVjdChzZXJpYWxpemVkLnJlZ2V4cFN0cmluZykudG9FcXVhbCgnKGZvbyl8KGJhciknKVxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZWQuZXhwcmVzc2lvbnMuZHVtbXkpLnRvRXF1YWwoe1xuICAgICAgICBuYW1lOiAnZHVtbXknXG4gICAgICAgIHJlZ2V4cFN0cmluZzogJ2ZvbydcbiAgICAgICAgaGFuZGxlOiB1bmRlZmluZWRcbiAgICAgICAgcHJpb3JpdHk6IDBcbiAgICAgICAgc2NvcGVzOiBbJyonXVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZWQuZXhwcmVzc2lvbnMuZHVtbXkyKS50b0VxdWFsKHtcbiAgICAgICAgbmFtZTogJ2R1bW15MidcbiAgICAgICAgcmVnZXhwU3RyaW5nOiAnYmFyJ1xuICAgICAgICBoYW5kbGU6IHJlZ2lzdHJ5LmdldEV4cHJlc3Npb24oJ2R1bW15MicpLmhhbmRsZS50b1N0cmluZygpXG4gICAgICAgIHByaW9yaXR5OiAwXG4gICAgICAgIHNjb3BlczogWycqJ11cbiAgICAgIH0pXG5cbiAgZGVzY3JpYmUgJy5kZXNlcmlhbGl6ZScsIC0+XG4gICAgaXQgJ2Rlc2VyaWFsaXplcyB0aGUgcHJvdmlkZWQgZXhwcmVzc2lvbnMgdXNpbmcgdGhlIHNwZWNpZmllZCBtb2RlbCcsIC0+XG4gICAgICBzZXJpYWxpemVkID1cbiAgICAgICAgcmVnZXhwU3RyaW5nOiAnZm9vfGJhcidcbiAgICAgICAgZXhwcmVzc2lvbnM6XG4gICAgICAgICAgZHVtbXk6XG4gICAgICAgICAgICBuYW1lOiAnZHVtbXknXG4gICAgICAgICAgICByZWdleHBTdHJpbmc6ICdmb28nXG4gICAgICAgICAgICBoYW5kbGU6ICdmdW5jdGlvbiAoYSxiLGMpIHsgcmV0dXJuIGEgKyBiIC0gYzsgfSdcbiAgICAgICAgICAgIHByaW9yaXR5OiAwXG4gICAgICAgICAgICBzY29wZXM6IFsnKiddXG5cbiAgICAgIGRlc2VyaWFsaXplZCA9IEV4cHJlc3Npb25zUmVnaXN0cnkuZGVzZXJpYWxpemUoc2VyaWFsaXplZCwgRHVtbXkpXG5cbiAgICAgIGV4cGVjdChkZXNlcmlhbGl6ZWQuZ2V0UmVnRXhwKCkpLnRvRXF1YWwoJ2Zvb3xiYXInKVxuICAgICAgZXhwZWN0KGRlc2VyaWFsaXplZC5nZXRFeHByZXNzaW9uKCdkdW1teScpLm5hbWUpLnRvRXF1YWwoJ2R1bW15JylcbiAgICAgIGV4cGVjdChkZXNlcmlhbGl6ZWQuZ2V0RXhwcmVzc2lvbignZHVtbXknKS5yZWdleHBTdHJpbmcpLnRvRXF1YWwoJ2ZvbycpXG4gICAgICBleHBlY3QoZGVzZXJpYWxpemVkLmdldEV4cHJlc3Npb24oJ2R1bW15JykuaGFuZGxlKDEsMiwzKSkudG9FcXVhbCgwKVxuIl19

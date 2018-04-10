(function() {
  var VariablesCollection;

  VariablesCollection = require('../lib/variables-collection');

  describe('VariablesCollection', function() {
    var changeSpy, collection, createVar, ref;
    ref = [], collection = ref[0], changeSpy = ref[1];
    createVar = function(name, value, range, path, line) {
      return {
        name: name,
        value: value,
        range: range,
        path: path,
        line: line
      };
    };
    return describe('with an empty collection', function() {
      beforeEach(function() {
        collection = new VariablesCollection;
        changeSpy = jasmine.createSpy('did-change');
        return collection.onDidChange(changeSpy);
      });
      describe('::addMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        it('stores them in the collection', function() {
          return expect(collection.length).toEqual(5);
        });
        it('detects that two of the variables are color variables', function() {
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        it('dispatches a change event', function() {
          var arg;
          expect(changeSpy).toHaveBeenCalled();
          arg = changeSpy.mostRecentCall.args[0];
          expect(arg.created.length).toEqual(5);
          expect(arg.destroyed).toBeUndefined();
          return expect(arg.updated).toBeUndefined();
        });
        it('stores the names of the variables', function() {
          return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz', 'bat', 'bab'].sort());
        });
        it('builds a dependencies map', function() {
          return expect(collection.dependencyGraph).toEqual({
            foo: ['baz'],
            bar: ['bat'],
            bat: ['bab']
          });
        });
        describe('appending an already existing variable', function() {
          beforeEach(function() {
            return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('leaves the collection untouched', function() {
            expect(collection.length).toEqual(5);
            return expect(collection.getColorVariables().length).toEqual(2);
          });
          return it('does not trigger an update event', function() {
            return expect(changeSpy.callCount).toEqual(1);
          });
        });
        return describe('appending an already existing variable with a different value', function() {
          describe('that has a different range', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#aabbcc', [0, 14], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#aabbcc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#aabbcc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that has a different range and a different line', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [52, 64], '/path/to/foo.styl', 6)]);
            });
            it('appends the new variables', function() {
              expect(collection.length).toEqual(6);
              return expect(collection.getColorVariables().length).toEqual(3);
            });
            it('stores the two variables', function() {
              var variables;
              variables = collection.findAll({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              return expect(variables.length).toEqual(2);
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created.length).toEqual(1);
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(1);
            });
          });
          describe('that is still a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that is no longer a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '20px', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection variables untouched', function() {
              return expect(collection.length).toEqual(5);
            });
            it('affects the colors variables within the collection', function() {
              return expect(collection.getColorVariables().length).toEqual(0);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('20px');
              return expect(variable.isColor).toBeFalsy();
            });
            it('updates the variables depending on the changed variable', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              return expect(variable.isColor).toBeFalsy();
            });
            return it('emits a change event', function() {
              var arg;
              arg = changeSpy.mostRecentCall.args[0];
              expect(changeSpy.callCount).toEqual(2);
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that breaks a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', '#abc', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                bar: ['bat'],
                bat: ['bab']
              });
            });
          });
          return describe('that adds a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', 'transparentize(foo, bar)', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('transparentize(foo, bar)');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor(255, 255, 255, 0.5);
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                foo: ['baz'],
                bar: ['bat', 'baz'],
                bat: ['bab']
              });
            });
          });
        });
      });
      describe('::removeMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('with variables that were not colors', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          it('removes the variables from the collection', function() {
            return expect(collection.length).toEqual(3);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(2);
            return expect(arg.updated).toBeUndefined();
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              foo: ['baz']
            });
          });
        });
        return describe('with variables that were referenced by a color variable', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('removes the variables from the collection', function() {
            expect(collection.length).toEqual(4);
            return expect(collection.getColorVariables().length).toEqual(0);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(1);
            return expect(arg.updated.length).toEqual(1);
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['bar', 'baz', 'bat', 'bab'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(4);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              bar: ['bat'],
              bat: ['bab']
            });
          });
        });
      });
      describe('::updatePathCollection', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('when a new variable is added', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5), createVar('baa', '#f00', [52, 60], '/path/to/foo.styl', 6)]);
          });
          return it('detects the addition and leave the rest of the collection unchanged', function() {
            expect(collection.length).toEqual(6);
            expect(collection.getColorVariables().length).toEqual(3);
            expect(changeSpy.mostRecentCall.args[0].created.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        describe('when a variable is removed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4)]);
          });
          return it('removes the variable that is not present in the new array', function() {
            expect(collection.length).toEqual(4);
            expect(collection.getColorVariables().length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        return describe('when a new variable is changed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', '#abc', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          return it('detects the update', function() {
            expect(collection.length).toEqual(5);
            expect(collection.getColorVariables().length).toEqual(4);
            expect(changeSpy.mostRecentCall.args[0].updated.length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
          });
        });
      });
      describe('::serialize', function() {
        describe('with an empty collection', function() {
          return it('returns an empty serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: []
            });
          });
        });
        describe('with a collection that contains a non-color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '0.5',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2
                }
              ]
            });
          });
        });
        describe('with a collection that contains a color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '#abc', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '#abc',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }
              ]
            });
          });
        });
        return describe('with a collection that contains color variables with references', function() {
          beforeEach(function() {
            collection.add(createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1));
            return collection.add(createVar('bar', 'foo', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'foo',
                  value: '#abc',
                  range: [0, 10],
                  path: '/path/to/foo.styl',
                  line: 1,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }, {
                  name: 'bar',
                  value: 'foo',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: ['foo']
                }
              ]
            });
          });
        });
      });
      return describe('.deserialize', function() {
        beforeEach(function() {
          return collection = atom.deserializers.deserialize({
            deserializer: 'VariablesCollection',
            content: [
              {
                name: 'foo',
                value: '#abc',
                range: [0, 10],
                path: '/path/to/foo.styl',
                line: 1,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: []
              }, {
                name: 'bar',
                value: 'foo',
                range: [12, 20],
                path: '/path/to/foo.styl',
                line: 2,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: ['foo']
              }, {
                name: 'baz',
                value: '0.5',
                range: [22, 30],
                path: '/path/to/foo.styl',
                line: 3
              }
            ]
          });
        });
        it('restores the variables', function() {
          expect(collection.length).toEqual(3);
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        return it('restores all the denormalized data in the collection', function() {
          expect(collection.variableNames).toEqual(['foo', 'bar', 'baz']);
          expect(Object.keys(collection.variablesByPath)).toEqual(['/path/to/foo.styl']);
          expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          return expect(collection.dependencyGraph).toEqual({
            foo: ['bar']
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3ZhcmlhYmxlcy1jb2xsZWN0aW9uLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsNkJBQVI7O0VBRXRCLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO0FBQzlCLFFBQUE7SUFBQSxNQUEwQixFQUExQixFQUFDLG1CQUFELEVBQWE7SUFFYixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0I7YUFDVjtRQUFDLE1BQUEsSUFBRDtRQUFPLE9BQUEsS0FBUDtRQUFjLE9BQUEsS0FBZDtRQUFxQixNQUFBLElBQXJCO1FBQTJCLE1BQUEsSUFBM0I7O0lBRFU7V0FHWixRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQTtNQUNuQyxVQUFBLENBQVcsU0FBQTtRQUNULFVBQUEsR0FBYSxJQUFJO1FBQ2pCLFNBQUEsR0FBWSxPQUFPLENBQUMsU0FBUixDQUFrQixZQUFsQjtlQUNaLFVBQVUsQ0FBQyxXQUFYLENBQXVCLFNBQXZCO01BSFMsQ0FBWDtNQWFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUE7UUFDcEIsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsQ0FDakIsU0FBQSxDQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUcsRUFBSCxDQUF6QixFQUFpQyxtQkFBakMsRUFBc0QsQ0FBdEQsQ0FEaUIsRUFFakIsU0FBQSxDQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsQ0FBQyxFQUFELEVBQUksRUFBSixDQUF4QixFQUFpQyxtQkFBakMsRUFBc0QsQ0FBdEQsQ0FGaUIsRUFHakIsU0FBQSxDQUFVLEtBQVYsRUFBaUIsS0FB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QUFDLE1BQXRDLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsQ0FBdEQ7UUFGMkIsQ0FBN0I7ZUFJQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtVQUN6RCxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQWxCLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsQ0FBekM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSxVQUFVLENBQUMsZUFBdkIsQ0FBUCxDQUE4QyxDQUFDLE9BQS9DLENBQXVELENBQUMsbUJBQUQsQ0FBdkQ7VUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLGVBQWdCLENBQUEsbUJBQUEsQ0FBb0IsQ0FBQyxNQUF2RCxDQUE4RCxDQUFDLE9BQS9ELENBQXVFLENBQXZFO2lCQUNBLE1BQUEsQ0FBTyxVQUFVLENBQUMsZUFBbEIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQztZQUN6QyxHQUFBLEVBQUssQ0FBQyxLQUFELENBRG9DO1dBQTNDO1FBSnlELENBQTNEO01BdkN1QixDQUF6QjtJQTdjbUMsQ0FBckM7RUFOOEIsQ0FBaEM7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIlZhcmlhYmxlc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuLi9saWIvdmFyaWFibGVzLWNvbGxlY3Rpb24nXG5cbmRlc2NyaWJlICdWYXJpYWJsZXNDb2xsZWN0aW9uJywgLT5cbiAgW2NvbGxlY3Rpb24sIGNoYW5nZVNweV0gPSBbXVxuXG4gIGNyZWF0ZVZhciA9IChuYW1lLCB2YWx1ZSwgcmFuZ2UsIHBhdGgsIGxpbmUpIC0+XG4gICAge25hbWUsIHZhbHVlLCByYW5nZSwgcGF0aCwgbGluZX1cblxuICBkZXNjcmliZSAnd2l0aCBhbiBlbXB0eSBjb2xsZWN0aW9uJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xsZWN0aW9uID0gbmV3IFZhcmlhYmxlc0NvbGxlY3Rpb25cbiAgICAgIGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtY2hhbmdlJylcbiAgICAgIGNvbGxlY3Rpb24ub25EaWRDaGFuZ2UoY2hhbmdlU3B5KVxuXG4gICAgIyMgICAgICAgIyMjICAgICMjIyMjIyMjICAjIyMjIyMjI1xuICAgICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgICMjXG4gICAgIyMgICAgICMjICAgIyMgICMjICAgICAjIyAjIyAgICAgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjI1xuICAgICMjICAgICMjIyMjIyMjIyAjIyAgICAgIyMgIyMgICAgICMjXG4gICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMjXG5cbiAgICBkZXNjcmliZSAnOjphZGRNYW55JywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICBjcmVhdGVWYXIgJ2ZvbycsICcjZmZmJywgWzAsMTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAxXG4gICAgICAgICAgY3JlYXRlVmFyICdiYXInLCAnMC41JywgWzEyLDIwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMlxuICAgICAgICAgIGNyZWF0ZVZhciAnYmF6JywgJ2ZvbycsIFsyMiwzMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDNcbiAgICAgICAgICBjcmVhdGVWYXIgJ2JhdCcsICdiYXInLCBbMzIsNDBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCA0XG4gICAgICAgICAgY3JlYXRlVmFyICdiYWInLCAnYmF0JywgWzQyLDUwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgNVxuICAgICAgICBdKVxuXG4gICAgICBpdCAnc3RvcmVzIHRoZW0gaW4gdGhlIGNvbGxlY3Rpb24nLCAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5sZW5ndGgpLnRvRXF1YWwoNSlcblxuICAgICAgaXQgJ2RldGVjdHMgdGhhdCB0d28gb2YgdGhlIHZhcmlhYmxlcyBhcmUgY29sb3IgdmFyaWFibGVzJywgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgaXQgJ2Rpc3BhdGNoZXMgYSBjaGFuZ2UgZXZlbnQnLCAtPlxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICBhcmcgPSBjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXVxuICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQubGVuZ3RoKS50b0VxdWFsKDUpXG4gICAgICAgIGV4cGVjdChhcmcuZGVzdHJveWVkKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGFyZy51cGRhdGVkKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgaXQgJ3N0b3JlcyB0aGUgbmFtZXMgb2YgdGhlIHZhcmlhYmxlcycsIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnZhcmlhYmxlTmFtZXMuc29ydCgpKS50b0VxdWFsKFsnZm9vJywnYmFyJywnYmF6JywnYmF0JywnYmFiJ10uc29ydCgpKVxuXG4gICAgICBpdCAnYnVpbGRzIGEgZGVwZW5kZW5jaWVzIG1hcCcsIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmRlcGVuZGVuY3lHcmFwaCkudG9FcXVhbCh7XG4gICAgICAgICAgZm9vOiBbJ2JheiddXG4gICAgICAgICAgYmFyOiBbJ2JhdCddXG4gICAgICAgICAgYmF0OiBbJ2JhYiddXG4gICAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlICdhcHBlbmRpbmcgYW4gYWxyZWFkeSBleGlzdGluZyB2YXJpYWJsZScsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBjb2xsZWN0aW9uLmFkZE1hbnkoW1xuICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2ZmZicsIFswLDEwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgIF0pXG5cbiAgICAgICAgaXQgJ2xlYXZlcyB0aGUgY29sbGVjdGlvbiB1bnRvdWNoZWQnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg1KVxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgaXQgJ2RvZXMgbm90IHRyaWdnZXIgYW4gdXBkYXRlIGV2ZW50JywgLT5cbiAgICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxDb3VudCkudG9FcXVhbCgxKVxuXG4gICAgICBkZXNjcmliZSAnYXBwZW5kaW5nIGFuIGFscmVhZHkgZXhpc3RpbmcgdmFyaWFibGUgd2l0aCBhIGRpZmZlcmVudCB2YWx1ZScsIC0+XG4gICAgICAgIGRlc2NyaWJlICd0aGF0IGhhcyBhIGRpZmZlcmVudCByYW5nZScsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2FhYmJjYycsIFswLDE0XSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgICAgXSlcblxuICAgICAgICAgIGl0ICdsZWF2ZXMgdGhlIGNvbGxlY3Rpb24gdW50b3VjaGVkJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg1KVxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICAgIGl0ICd1cGRhdGVzIHRoZSBleGlzdGluZyB2YXJpYWJsZSB2YWx1ZScsIC0+XG4gICAgICAgICAgICB2YXJpYWJsZSA9IGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgICAgIG5hbWU6ICdmb28nXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGUudmFsdWUpLnRvRXF1YWwoJyNhYWJiY2MnKVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLmlzQ29sb3IpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLmNvbG9yKS50b0JlQ29sb3IoJyNhYWJiY2MnKVxuXG4gICAgICAgICAgaXQgJ2VtaXRzIGEgY2hhbmdlIGV2ZW50JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbENvdW50KS50b0VxdWFsKDIpXG5cbiAgICAgICAgICAgIGFyZyA9IGNoYW5nZVNweS5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdXG4gICAgICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KGFyZy5kZXN0cm95ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KGFyZy51cGRhdGVkLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgIGRlc2NyaWJlICd0aGF0IGhhcyBhIGRpZmZlcmVudCByYW5nZSBhbmQgYSBkaWZmZXJlbnQgbGluZScsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2FiYycsIFs1Miw2NF0sICcvcGF0aC90by9mb28uc3R5bCcsIDZcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICBpdCAnYXBwZW5kcyB0aGUgbmV3IHZhcmlhYmxlcycsIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgICAgICBpdCAnc3RvcmVzIHRoZSB0d28gdmFyaWFibGVzJywgLT5cbiAgICAgICAgICAgIHZhcmlhYmxlcyA9IGNvbGxlY3Rpb24uZmluZEFsbCh7XG4gICAgICAgICAgICAgIG5hbWU6ICdmb28nXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGVzLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgICAgaXQgJ2VtaXRzIGEgY2hhbmdlIGV2ZW50JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbENvdW50KS50b0VxdWFsKDIpXG5cbiAgICAgICAgICAgIGFyZyA9IGNoYW5nZVNweS5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdXG4gICAgICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgICAgICAgICBleHBlY3QoYXJnLmRlc3Ryb3llZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgICBleHBlY3QoYXJnLnVwZGF0ZWQubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3RoYXQgaXMgc3RpbGwgYSBjb2xvcicsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2FiYycsIFswLDEwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgICAgXSlcblxuICAgICAgICAgIGl0ICdsZWF2ZXMgdGhlIGNvbGxlY3Rpb24gdW50b3VjaGVkJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg1KVxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICAgIGl0ICd1cGRhdGVzIHRoZSBleGlzdGluZyB2YXJpYWJsZSB2YWx1ZScsIC0+XG4gICAgICAgICAgICB2YXJpYWJsZSA9IGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgICAgIG5hbWU6ICdmb28nXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGUudmFsdWUpLnRvRXF1YWwoJyNhYmMnKVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLmlzQ29sb3IpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLmNvbG9yKS50b0JlQ29sb3IoJyNhYmMnKVxuXG4gICAgICAgICAgaXQgJ2VtaXRzIGEgY2hhbmdlIGV2ZW50JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbENvdW50KS50b0VxdWFsKDIpXG5cbiAgICAgICAgICAgIGFyZyA9IGNoYW5nZVNweS5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdXG4gICAgICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KGFyZy5kZXN0cm95ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KGFyZy51cGRhdGVkLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgIGRlc2NyaWJlICd0aGF0IGlzIG5vIGxvbmdlciBhIGNvbG9yJywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBjb2xsZWN0aW9uLmFkZE1hbnkoW1xuICAgICAgICAgICAgICBjcmVhdGVWYXIgJ2ZvbycsICcyMHB4JywgWzAsMTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAxXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgaXQgJ2xlYXZlcyB0aGUgY29sbGVjdGlvbiB2YXJpYWJsZXMgdW50b3VjaGVkJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg1KVxuXG4gICAgICAgICAgaXQgJ2FmZmVjdHMgdGhlIGNvbG9ycyB2YXJpYWJsZXMgd2l0aGluIHRoZSBjb2xsZWN0aW9uJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgICAgICBpdCAndXBkYXRlcyB0aGUgZXhpc3RpbmcgdmFyaWFibGUgdmFsdWUnLCAtPlxuICAgICAgICAgICAgdmFyaWFibGUgPSBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgICAgICBuYW1lOiAnZm9vJ1xuICAgICAgICAgICAgICBwYXRoOiAnL3BhdGgvdG8vZm9vLnN0eWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLnZhbHVlKS50b0VxdWFsKCcyMHB4JylcbiAgICAgICAgICAgIGV4cGVjdCh2YXJpYWJsZS5pc0NvbG9yKS50b0JlRmFsc3koKVxuXG4gICAgICAgICAgaXQgJ3VwZGF0ZXMgdGhlIHZhcmlhYmxlcyBkZXBlbmRpbmcgb24gdGhlIGNoYW5nZWQgdmFyaWFibGUnLCAtPlxuICAgICAgICAgICAgdmFyaWFibGUgPSBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgICAgICBuYW1lOiAnYmF6J1xuICAgICAgICAgICAgICBwYXRoOiAnL3BhdGgvdG8vZm9vLnN0eWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLmlzQ29sb3IpLnRvQmVGYWxzeSgpXG5cbiAgICAgICAgICBpdCAnZW1pdHMgYSBjaGFuZ2UgZXZlbnQnLCAtPlxuICAgICAgICAgICAgYXJnID0gY2hhbmdlU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbENvdW50KS50b0VxdWFsKDIpXG5cbiAgICAgICAgICAgIGV4cGVjdChhcmcuY3JlYXRlZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgICBleHBlY3QoYXJnLmRlc3Ryb3llZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgICBleHBlY3QoYXJnLnVwZGF0ZWQubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3RoYXQgYnJlYWtzIGEgZGVwZW5kZW5jeScsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICAgICAgY3JlYXRlVmFyICdiYXonLCAnI2FiYycsIFsyMiwzMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDNcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICBpdCAnbGVhdmVzIHRoZSBjb2xsZWN0aW9uIHVudG91Y2hlZCcsIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5sZW5ndGgpLnRvRXF1YWwoNSlcbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgICBpdCAndXBkYXRlcyB0aGUgZXhpc3RpbmcgdmFyaWFibGUgdmFsdWUnLCAtPlxuICAgICAgICAgICAgdmFyaWFibGUgPSBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgICAgICBuYW1lOiAnYmF6J1xuICAgICAgICAgICAgICBwYXRoOiAnL3BhdGgvdG8vZm9vLnN0eWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLnZhbHVlKS50b0VxdWFsKCcjYWJjJylcbiAgICAgICAgICAgIGV4cGVjdCh2YXJpYWJsZS5pc0NvbG9yKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIGV4cGVjdCh2YXJpYWJsZS5jb2xvcikudG9CZUNvbG9yKCcjYWJjJylcblxuICAgICAgICAgIGl0ICd1cGRhdGVzIHRoZSBkZXBlbmRlbmNpZXMgZ3JhcGgnLCAtPlxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZGVwZW5kZW5jeUdyYXBoKS50b0VxdWFsKHtcbiAgICAgICAgICAgICAgYmFyOiBbJ2JhdCddXG4gICAgICAgICAgICAgIGJhdDogWydiYWInXVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSAndGhhdCBhZGRzIGEgZGVwZW5kZW5jeScsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICAgICAgY3JlYXRlVmFyICdiYXonLCAndHJhbnNwYXJlbnRpemUoZm9vLCBiYXIpJywgWzIyLDMwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgM1xuICAgICAgICAgICAgXSlcblxuICAgICAgICAgIGl0ICdsZWF2ZXMgdGhlIGNvbGxlY3Rpb24gdW50b3VjaGVkJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg1KVxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICAgIGl0ICd1cGRhdGVzIHRoZSBleGlzdGluZyB2YXJpYWJsZSB2YWx1ZScsIC0+XG4gICAgICAgICAgICB2YXJpYWJsZSA9IGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgICAgIG5hbWU6ICdiYXonXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGUudmFsdWUpLnRvRXF1YWwoJ3RyYW5zcGFyZW50aXplKGZvbywgYmFyKScpXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGUuaXNDb2xvcikudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBleHBlY3QodmFyaWFibGUuY29sb3IpLnRvQmVDb2xvcigyNTUsMjU1LDI1NSwgMC41KVxuXG4gICAgICAgICAgaXQgJ3VwZGF0ZXMgdGhlIGRlcGVuZGVuY2llcyBncmFwaCcsIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5kZXBlbmRlbmN5R3JhcGgpLnRvRXF1YWwoe1xuICAgICAgICAgICAgICBmb286IFsnYmF6J11cbiAgICAgICAgICAgICAgYmFyOiBbJ2JhdCcsICdiYXonXVxuICAgICAgICAgICAgICBiYXQ6IFsnYmFiJ11cbiAgICAgICAgICAgIH0pXG5cbiAgICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMjICAgIyMjICMjICAgICAjIyAjIyAgICAgIyMgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMjIyAjIyMjICMjICAgICAjIyAjIyAgICAgIyMgIyNcbiAgICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjICAgIyMgIyMjICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMjXG4gICAgIyMgICAgIyMgICAjIyAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgIyMgICMjICAgIyMgICMjXG4gICAgIyMgICAgIyMgICAgIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgIyMgICAjIyAjIyAgICMjXG4gICAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICMjICAgICAjIyAgIyMjIyMjIyAgICAgIyMjICAgICMjIyMjIyMjXG5cbiAgICBkZXNjcmliZSAnOjpyZW1vdmVNYW55JywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29sbGVjdGlvbi5hZGRNYW55KFtcbiAgICAgICAgICBjcmVhdGVWYXIgJ2ZvbycsICcjZmZmJywgWzAsMTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAxXG4gICAgICAgICAgY3JlYXRlVmFyICdiYXInLCAnMC41JywgWzEyLDIwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMlxuICAgICAgICAgIGNyZWF0ZVZhciAnYmF6JywgJ2ZvbycsIFsyMiwzMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDNcbiAgICAgICAgICBjcmVhdGVWYXIgJ2JhdCcsICdiYXInLCBbMzIsNDBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCA0XG4gICAgICAgICAgY3JlYXRlVmFyICdiYWInLCAnYmF0JywgWzQyLDUwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgNVxuICAgICAgICBdKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCB2YXJpYWJsZXMgdGhhdCB3ZXJlIG5vdCBjb2xvcnMnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmVNYW55KFtcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnYmF0JywgJ2JhcicsIFszMiw0MF0sICcvcGF0aC90by9mb28uc3R5bCcsIDRcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnYmFiJywgJ2JhdCcsIFs0Miw1MF0sICcvcGF0aC90by9mb28uc3R5bCcsIDVcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGl0ICdyZW1vdmVzIHRoZSB2YXJpYWJsZXMgZnJvbSB0aGUgY29sbGVjdGlvbicsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24ubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgICAgaXQgJ2Rpc3BhdGNoZXMgYSBjaGFuZ2UgZXZlbnQnLCAtPlxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgYXJnID0gY2hhbmdlU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChhcmcuZGVzdHJveWVkLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICAgIGV4cGVjdChhcmcudXBkYXRlZCkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICAgICAgaXQgJ3N0b3JlcyB0aGUgbmFtZXMgb2YgdGhlIHZhcmlhYmxlcycsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udmFyaWFibGVOYW1lcy5zb3J0KCkpLnRvRXF1YWwoWydmb28nLCdiYXInLCdiYXonXS5zb3J0KCkpXG5cbiAgICAgICAgaXQgJ3VwZGF0ZXMgdGhlIHZhcmlhYmxlcyBwZXIgcGF0aCBtYXAnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnZhcmlhYmxlc0J5UGF0aFsnL3BhdGgvdG8vZm9vLnN0eWwnXS5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgICAgICBpdCAndXBkYXRlcyB0aGUgZGVwZW5kZW5jaWVzIG1hcCcsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZGVwZW5kZW5jeUdyYXBoKS50b0VxdWFsKHtcbiAgICAgICAgICAgIGZvbzogWydiYXonXVxuICAgICAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIHZhcmlhYmxlcyB0aGF0IHdlcmUgcmVmZXJlbmNlZCBieSBhIGNvbG9yIHZhcmlhYmxlJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlTWFueShbXG4gICAgICAgICAgICBjcmVhdGVWYXIgJ2ZvbycsICcjZmZmJywgWzAsMTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAxXG4gICAgICAgICAgXSlcblxuICAgICAgICBpdCAncmVtb3ZlcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlIGNvbGxlY3Rpb24nLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCg0KVxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgICAgaXQgJ2Rpc3BhdGNoZXMgYSBjaGFuZ2UgZXZlbnQnLCAtPlxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgYXJnID0gY2hhbmdlU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgICBleHBlY3QoYXJnLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChhcmcuZGVzdHJveWVkLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdChhcmcudXBkYXRlZC5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgICBpdCAnc3RvcmVzIHRoZSBuYW1lcyBvZiB0aGUgdmFyaWFibGVzJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi52YXJpYWJsZU5hbWVzLnNvcnQoKSkudG9FcXVhbChbJ2JhcicsJ2JheicsJ2JhdCcsJ2JhYiddLnNvcnQoKSlcblxuICAgICAgICBpdCAndXBkYXRlcyB0aGUgdmFyaWFibGVzIHBlciBwYXRoIG1hcCcsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udmFyaWFibGVzQnlQYXRoWycvcGF0aC90by9mb28uc3R5bCddLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgICAgIGl0ICd1cGRhdGVzIHRoZSBkZXBlbmRlbmNpZXMgbWFwJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5kZXBlbmRlbmN5R3JhcGgpLnRvRXF1YWwoe1xuICAgICAgICAgICAgYmFyOiBbJ2JhdCddXG4gICAgICAgICAgICBiYXQ6IFsnYmFiJ11cbiAgICAgICAgICB9KVxuXG4gICAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyMjIyAgICAgIyMjICAgICMjIyMjIyMjICMjIyMjIyMjXG4gICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgICAjIyAjIyAgICAgICMjICAgICMjXG4gICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgICMjICAgIyMgICAgICMjICAgICMjXG4gICAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICAjIyAgICAgIyMgIyMgICAgICMjICAgICMjICAgICMjIyMjI1xuICAgICMjICAgICMjICAgICAjIyAjIyAgICAgICAgIyMgICAgICMjICMjIyMjIyMjIyAgICAjIyAgICAjI1xuICAgICMjICAgICMjICAgICAjIyAjIyAgICAgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjIyAgICAjI1xuICAgICMjICAgICAjIyMjIyMjICAjIyAgICAgICAgIyMjIyMjIyMgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjI1xuXG4gICAgZGVzY3JpYmUgJzo6dXBkYXRlUGF0aENvbGxlY3Rpb24nLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBjb2xsZWN0aW9uLmFkZE1hbnkoW1xuICAgICAgICAgIGNyZWF0ZVZhciAnZm9vJywgJyNmZmYnLCBbMCwxMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDFcbiAgICAgICAgICBjcmVhdGVWYXIgJ2JhcicsICcwLjUnLCBbMTIsMjBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAyXG4gICAgICAgICAgY3JlYXRlVmFyICdiYXonLCAnZm9vJywgWzIyLDMwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgM1xuICAgICAgICAgIGNyZWF0ZVZhciAnYmF0JywgJ2JhcicsIFszMiw0MF0sICcvcGF0aC90by9mb28uc3R5bCcsIDRcbiAgICAgICAgICBjcmVhdGVWYXIgJ2JhYicsICdiYXQnLCBbNDIsNTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCA1XG4gICAgICAgIF0pXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGEgbmV3IHZhcmlhYmxlIGlzIGFkZGVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24udXBkYXRlUGF0aENvbGxlY3Rpb24oJy9wYXRoL3RvL2Zvby5zdHlsJyAsW1xuICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2ZmZicsIFswLDEwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXInLCAnMC41JywgWzEyLDIwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMlxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXonLCAnZm9vJywgWzIyLDMwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgM1xuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXQnLCAnYmFyJywgWzMyLDQwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgNFxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYWInLCAnYmF0JywgWzQyLDUwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgNVxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYWEnLCAnI2YwMCcsIFs1Miw2MF0sICcvcGF0aC90by9mb28uc3R5bCcsIDZcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGl0ICdkZXRlY3RzIHRoZSBhZGRpdGlvbiBhbmQgbGVhdmUgdGhlIHJlc3Qgb2YgdGhlIGNvbGxlY3Rpb24gdW5jaGFuZ2VkJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgzKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS5jcmVhdGVkLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS5kZXN0cm95ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS51cGRhdGVkKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSB2YXJpYWJsZSBpcyByZW1vdmVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24udXBkYXRlUGF0aENvbGxlY3Rpb24oJy9wYXRoL3RvL2Zvby5zdHlsJyAsW1xuICAgICAgICAgICAgY3JlYXRlVmFyICdmb28nLCAnI2ZmZicsIFswLDEwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXInLCAnMC41JywgWzEyLDIwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMlxuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXonLCAnZm9vJywgWzIyLDMwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgM1xuICAgICAgICAgICAgY3JlYXRlVmFyICdiYXQnLCAnYmFyJywgWzMyLDQwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgNFxuICAgICAgICAgIF0pXG5cbiAgICAgICAgaXQgJ3JlbW92ZXMgdGhlIHZhcmlhYmxlIHRoYXQgaXMgbm90IHByZXNlbnQgaW4gdGhlIG5ldyBhcnJheScsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24ubGVuZ3RoKS50b0VxdWFsKDQpXG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICAgICAgICBleHBlY3QoY2hhbmdlU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0uZGVzdHJveWVkLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS5jcmVhdGVkKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgICBleHBlY3QoY2hhbmdlU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0udXBkYXRlZCkudG9CZVVuZGVmaW5lZCgpXG5cblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSBuZXcgdmFyaWFibGUgaXMgY2hhbmdlZCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZVBhdGhDb2xsZWN0aW9uKCcvcGF0aC90by9mb28uc3R5bCcgLFtcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnZm9vJywgJyNmZmYnLCBbMCwxMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDFcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnYmFyJywgJzAuNScsIFsxMiwyMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDJcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnYmF6JywgJ2ZvbycsIFsyMiwzMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDNcbiAgICAgICAgICAgIGNyZWF0ZVZhciAnYmF0JywgJyNhYmMnLCBbMzIsNDBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCA0XG4gICAgICAgICAgICBjcmVhdGVWYXIgJ2JhYicsICdiYXQnLCBbNDIsNTBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCA1XG4gICAgICAgICAgXSlcblxuICAgICAgICBpdCAnZGV0ZWN0cyB0aGUgdXBkYXRlJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5sZW5ndGgpLnRvRXF1YWwoNSlcbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg0KVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS51cGRhdGVkLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS5kZXN0cm95ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChjaGFuZ2VTcHkubW9zdFJlY2VudENhbGwuYXJnc1swXS5jcmVhdGVkKS50b0JlVW5kZWZpbmVkKClcblxuICAgICMjICAgICMjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMjXG4gICAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAgICMjICAgICMjIyMjIyMjICAjIyMjIyMgICAgIyMjIyMjICAgICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjI1xuICAgICMjICAgICMjICAgIyMgICAjIyAgICAgICAgICAgICAjIyAgICAjIyAgICAjIyAgICAgIyMgIyMgICAjIyAgICMjXG4gICAgIyMgICAgIyMgICAgIyMgICMjICAgICAgICMjICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAjIyAgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyAgICAgIyMgICAgICMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMjI1xuXG4gICAgZGVzY3JpYmUgJzo6c2VyaWFsaXplJywgLT5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGFuIGVtcHR5IGNvbGxlY3Rpb24nLCAtPlxuICAgICAgICBpdCAncmV0dXJucyBhbiBlbXB0eSBzZXJpYWxpemVkIGNvbGxlY3Rpb24nLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnNlcmlhbGl6ZSgpKS50b0VxdWFsKHtcbiAgICAgICAgICAgIGRlc2VyaWFsaXplcjogJ1ZhcmlhYmxlc0NvbGxlY3Rpb24nXG4gICAgICAgICAgICBjb250ZW50OiBbXVxuICAgICAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGEgY29sbGVjdGlvbiB0aGF0IGNvbnRhaW5zIGEgbm9uLWNvbG9yIHZhcmlhYmxlJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24uYWRkIGNyZWF0ZVZhciAnYmFyJywgJzAuNScsIFsxMiwyMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDJcblxuICAgICAgICBpdCAncmV0dXJucyB0aGUgc2VyaWFsaXplZCBjb2xsZWN0aW9uJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5zZXJpYWxpemUoKSkudG9FcXVhbCh7XG4gICAgICAgICAgICBkZXNlcmlhbGl6ZXI6ICdWYXJpYWJsZXNDb2xsZWN0aW9uJ1xuICAgICAgICAgICAgY29udGVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2JhcidcbiAgICAgICAgICAgICAgICB2YWx1ZTogJzAuNSdcbiAgICAgICAgICAgICAgICByYW5nZTogWzEyLDIwXVxuICAgICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgICAgICBsaW5lOiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBhIGNvbGxlY3Rpb24gdGhhdCBjb250YWlucyBhIGNvbG9yIHZhcmlhYmxlJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24uYWRkIGNyZWF0ZVZhciAnYmFyJywgJyNhYmMnLCBbMTIsMjBdLCAnL3BhdGgvdG8vZm9vLnN0eWwnLCAyXG5cbiAgICAgICAgaXQgJ3JldHVybnMgdGhlIHNlcmlhbGl6ZWQgY29sbGVjdGlvbicsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uc2VyaWFsaXplKCkpLnRvRXF1YWwoe1xuICAgICAgICAgICAgZGVzZXJpYWxpemVyOiAnVmFyaWFibGVzQ29sbGVjdGlvbidcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdiYXInXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcjYWJjJ1xuICAgICAgICAgICAgICAgIHJhbmdlOiBbMTIsMjBdXG4gICAgICAgICAgICAgICAgcGF0aDogJy9wYXRoL3RvL2Zvby5zdHlsJ1xuICAgICAgICAgICAgICAgIGxpbmU6IDJcbiAgICAgICAgICAgICAgICBpc0NvbG9yOiB0cnVlXG4gICAgICAgICAgICAgICAgY29sb3I6IFsxNzAsIDE4NywgMjA0LCAxXVxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczogW11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGEgY29sbGVjdGlvbiB0aGF0IGNvbnRhaW5zIGNvbG9yIHZhcmlhYmxlcyB3aXRoIHJlZmVyZW5jZXMnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgY29sbGVjdGlvbi5hZGQgY3JlYXRlVmFyICdmb28nLCAnI2FiYycsIFswLDEwXSwgJy9wYXRoL3RvL2Zvby5zdHlsJywgMVxuICAgICAgICAgIGNvbGxlY3Rpb24uYWRkIGNyZWF0ZVZhciAnYmFyJywgJ2ZvbycsIFsxMiwyMF0sICcvcGF0aC90by9mb28uc3R5bCcsIDJcblxuICAgICAgICBpdCAncmV0dXJucyB0aGUgc2VyaWFsaXplZCBjb2xsZWN0aW9uJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5zZXJpYWxpemUoKSkudG9FcXVhbCh7XG4gICAgICAgICAgICBkZXNlcmlhbGl6ZXI6ICdWYXJpYWJsZXNDb2xsZWN0aW9uJ1xuICAgICAgICAgICAgY29udGVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZvbydcbiAgICAgICAgICAgICAgICB2YWx1ZTogJyNhYmMnXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFswLDEwXVxuICAgICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgICAgICBsaW5lOiAxXG4gICAgICAgICAgICAgICAgaXNDb2xvcjogdHJ1ZVxuICAgICAgICAgICAgICAgIGNvbG9yOiBbMTcwLCAxODcsIDIwNCwgMV1cbiAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IFtdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFyJ1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnZm9vJ1xuICAgICAgICAgICAgICAgIHJhbmdlOiBbMTIsMjBdXG4gICAgICAgICAgICAgICAgcGF0aDogJy9wYXRoL3RvL2Zvby5zdHlsJ1xuICAgICAgICAgICAgICAgIGxpbmU6IDJcbiAgICAgICAgICAgICAgICBpc0NvbG9yOiB0cnVlXG4gICAgICAgICAgICAgICAgY29sb3I6IFsxNzAsIDE4NywgMjA0LCAxXVxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczogWydmb28nXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSlcblxuICAgIGRlc2NyaWJlICcuZGVzZXJpYWxpemUnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBjb2xsZWN0aW9uID0gYXRvbS5kZXNlcmlhbGl6ZXJzLmRlc2VyaWFsaXplKHtcbiAgICAgICAgICBkZXNlcmlhbGl6ZXI6ICdWYXJpYWJsZXNDb2xsZWN0aW9uJ1xuICAgICAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2ZvbydcbiAgICAgICAgICAgICAgdmFsdWU6ICcjYWJjJ1xuICAgICAgICAgICAgICByYW5nZTogWzAsMTBdXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgICAgbGluZTogMVxuICAgICAgICAgICAgICBpc0NvbG9yOiB0cnVlXG4gICAgICAgICAgICAgIGNvbG9yOiBbMTcwLCAxODcsIDIwNCwgMV1cbiAgICAgICAgICAgICAgdmFyaWFibGVzOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2JhcidcbiAgICAgICAgICAgICAgdmFsdWU6ICdmb28nXG4gICAgICAgICAgICAgIHJhbmdlOiBbMTIsMjBdXG4gICAgICAgICAgICAgIHBhdGg6ICcvcGF0aC90by9mb28uc3R5bCdcbiAgICAgICAgICAgICAgbGluZTogMlxuICAgICAgICAgICAgICBpc0NvbG9yOiB0cnVlXG4gICAgICAgICAgICAgIGNvbG9yOiBbMTcwLCAxODcsIDIwNCwgMV1cbiAgICAgICAgICAgICAgdmFyaWFibGVzOiBbJ2ZvbyddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnYmF6J1xuICAgICAgICAgICAgICB2YWx1ZTogJzAuNSdcbiAgICAgICAgICAgICAgcmFuZ2U6IFsyMiwzMF1cbiAgICAgICAgICAgICAgcGF0aDogJy9wYXRoL3RvL2Zvby5zdHlsJ1xuICAgICAgICAgICAgICBsaW5lOiAzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9KVxuXG4gICAgICBpdCAncmVzdG9yZXMgdGhlIHZhcmlhYmxlcycsIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmxlbmd0aCkudG9FcXVhbCgzKVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICBpdCAncmVzdG9yZXMgYWxsIHRoZSBkZW5vcm1hbGl6ZWQgZGF0YSBpbiB0aGUgY29sbGVjdGlvbicsIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnZhcmlhYmxlTmFtZXMpLnRvRXF1YWwoWydmb28nLCAnYmFyJywgJ2JheiddKVxuICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMgY29sbGVjdGlvbi52YXJpYWJsZXNCeVBhdGgpLnRvRXF1YWwoWycvcGF0aC90by9mb28uc3R5bCddKVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi52YXJpYWJsZXNCeVBhdGhbJy9wYXRoL3RvL2Zvby5zdHlsJ10ubGVuZ3RoKS50b0VxdWFsKDMpXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmRlcGVuZGVuY3lHcmFwaCkudG9FcXVhbCh7XG4gICAgICAgICAgZm9vOiBbJ2JhciddXG4gICAgICAgIH0pXG4iXX0=

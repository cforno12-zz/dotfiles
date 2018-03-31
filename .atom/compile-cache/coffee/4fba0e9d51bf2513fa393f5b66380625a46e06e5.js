(function() {
  var ColorContext, ColorParser, registry,
    slice = [].slice;

  ColorContext = require('../lib/color-context');

  ColorParser = require('../lib/color-parser');

  registry = require('../lib/color-expressions');

  describe('ColorContext', function() {
    var context, itParses, parser, ref;
    ref = [], context = ref[0], parser = ref[1];
    itParses = function(expression) {
      return {
        asUndefined: function() {
          return it("parses '" + expression + "' as undefined", function() {
            return expect(context.getValue(expression)).toBeUndefined();
          });
        },
        asUndefinedColor: function() {
          return it("parses '" + expression + "' as undefined color", function() {
            return expect(context.readColor(expression)).toBeUndefined();
          });
        },
        asInt: function(expected) {
          return it("parses '" + expression + "' as an integer with value of " + expected, function() {
            return expect(context.readInt(expression)).toEqual(expected);
          });
        },
        asFloat: function(expected) {
          return it("parses '" + expression + "' as a float with value of " + expected, function() {
            return expect(context.readFloat(expression)).toEqual(expected);
          });
        },
        asIntOrPercent: function(expected) {
          return it("parses '" + expression + "' as an integer or a percentage with value of " + expected, function() {
            return expect(context.readIntOrPercent(expression)).toEqual(expected);
          });
        },
        asFloatOrPercent: function(expected) {
          return it("parses '" + expression + "' as a float or a percentage with value of " + expected, function() {
            return expect(context.readFloatOrPercent(expression)).toEqual(expected);
          });
        },
        asColorExpression: function(expected) {
          return it("parses '" + expression + "' as a color expression", function() {
            return expect(context.readColorExpression(expression)).toEqual(expected);
          });
        },
        asColor: function() {
          var expected;
          expected = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return it("parses '" + expression + "' as a color with value of " + (jasmine.pp(expected)), function() {
            var ref1;
            return (ref1 = expect(context.readColor(expression))).toBeColor.apply(ref1, expected);
          });
        },
        asInvalidColor: function() {
          var expected;
          expected = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return it("parses '" + expression + "' as an invalid color", function() {
            return expect(context.readColor(expression)).not.toBeValid();
          });
        }
      };
    };
    describe('created without any variables', function() {
      beforeEach(function() {
        return context = new ColorContext({
          registry: registry
        });
      });
      itParses('10').asInt(10);
      itParses('10').asFloat(10);
      itParses('0.5').asFloat(0.5);
      itParses('.5').asFloat(0.5);
      itParses('10').asIntOrPercent(10);
      itParses('10%').asIntOrPercent(26);
      itParses('0.1').asFloatOrPercent(0.1);
      itParses('10%').asFloatOrPercent(0.1);
      itParses('red').asColorExpression('red');
      itParses('red').asColor(255, 0, 0);
      itParses('#ff0000').asColor(255, 0, 0);
      return itParses('rgb(255,127,0)').asColor(255, 127, 0);
    });
    describe('with a variables array', function() {
      var createColorVar, createVar;
      createVar = function(name, value, path) {
        return {
          value: value,
          name: name,
          path: path != null ? path : '/path/to/file.coffee'
        };
      };
      createColorVar = function(name, value, path) {
        var v;
        v = createVar(name, value, path);
        v.isColor = true;
        return v;
      };
      describe('that contains valid variables', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createVar('x', '10'), createVar('y', '0.1'), createVar('z', '10%'), createColorVar('c', 'rgb(255,127,0)')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('x').asInt(10);
        itParses('y').asFloat(0.1);
        itParses('z').asIntOrPercent(26);
        itParses('z').asFloatOrPercent(0.1);
        itParses('c').asColorExpression('rgb(255,127,0)');
        return itParses('c').asColor(255, 127, 0);
      });
      describe('that contains alias for named colors', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('$text-color', 'white', '/path/to/file.css.sass'), createColorVar('$background-color', 'black', '/path/to/file.css.sass')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('$text-color').asColor(255, 255, 255);
        return itParses('$background-color').asColor(0, 0, 0);
      });
      describe('that contains invalid colors', function() {
        beforeEach(function() {
          var variables;
          variables = [createVar('@text-height', '@scale-b-xxl * 1rem'), createVar('@component-line-height', '@text-height'), createVar('@list-item-height', '@component-line-height')];
          return context = new ColorContext({
            variables: variables,
            registry: registry
          });
        });
        return itParses('@list-item-height').asUndefinedColor();
      });
      describe('that contains circular references', function() {
        beforeEach(function() {
          var variables;
          variables = [createVar('@foo', '@bar'), createVar('@bar', '@baz'), createVar('@baz', '@foo'), createVar('@taz', '@taz')];
          return context = new ColorContext({
            variables: variables,
            registry: registry
          });
        });
        itParses('@foo').asUndefined();
        return itParses('@taz').asUndefined();
      });
      describe('that contains circular references', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('@foo', '@bar'), createColorVar('@bar', '@baz'), createColorVar('@baz', '@foo'), createColorVar('@taz', '@taz')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('@foo').asInvalidColor();
        itParses('@foo').asUndefined();
        return itParses('@taz').asUndefined();
      });
      return describe('that contains circular references nested in operations', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('@foo', 'complement(@bar)'), createColorVar('@bar', 'transparentize(@baz, 0.5)'), createColorVar('@baz', 'darken(@foo, 10%)')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        return itParses('@foo').asInvalidColor();
      });
    });
    describe('with variables from a default file', function() {
      var createColorVar, createVar, projectPath, ref1, referenceVariable;
      ref1 = [], projectPath = ref1[0], referenceVariable = ref1[1];
      createVar = function(name, value, path, isDefault) {
        if (isDefault == null) {
          isDefault = false;
        }
        if (path == null) {
          path = projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path,
          "default": isDefault
        };
      };
      createColorVar = function(name, value, path, isDefault) {
        var v;
        v = createVar(name, value, path, isDefault);
        v.isColor = true;
        return v;
      };
      describe('when there is another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', projectPath + "/b.styl", true), createVar('b', '20', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(20);
      });
      describe('when there is no another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', projectPath + "/b.styl", true), createVar('b', 'c', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      describe('when there is another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', projectPath + "/b.styl", true), createColorVar('b', '#0000ff', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(0, 0, 255);
      });
      return describe('when there is no another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', projectPath + "/b.styl", true), createColorVar('b', 'c', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(255, 0, 0);
      });
    });
    describe('with a reference variable', function() {
      var createColorVar, createVar, projectPath, ref1, referenceVariable;
      ref1 = [], projectPath = ref1[0], referenceVariable = ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', projectPath + "/b.styl"), createVar('b', '20', projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath, projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
    return describe('with a reference path', function() {
      var createColorVar, createVar, projectPath, ref1, referenceVariable;
      ref1 = [], projectPath = ref1[0], referenceVariable = ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: projectPath + "/a.styl",
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', projectPath + "/b.styl"), createVar('b', '20', projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: projectPath + "/a.styl",
            rootPaths: [projectPath, projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWNvbnRleHQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLG1DQUFBO0lBQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUjs7RUFDZixXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSOztFQUNkLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVI7O0VBRVgsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtBQUN2QixRQUFBO0lBQUEsTUFBb0IsRUFBcEIsRUFBQyxnQkFBRCxFQUFVO0lBRVYsUUFBQSxHQUFXLFNBQUMsVUFBRDthQUNUO1FBQUEsV0FBQSxFQUFhLFNBQUE7aUJBQ1gsRUFBQSxDQUFHLFVBQUEsR0FBVyxVQUFYLEdBQXNCLGdCQUF6QixFQUEwQyxTQUFBO21CQUN4QyxNQUFBLENBQU8sT0FBTyxDQUFDLFFBQVIsQ0FBaUIsVUFBakIsQ0FBUCxDQUFvQyxDQUFDLGFBQXJDLENBQUE7VUFEd0MsQ0FBMUM7UUFEVyxDQUFiO1FBSUEsZ0JBQUEsRUFBa0IsU0FBQTtpQkFDaEIsRUFBQSxDQUFHLFVBQUEsR0FBVyxVQUFYLEdBQXNCLHNCQUF6QixFQUFnRCxTQUFBO21CQUM5QyxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQVIsQ0FBa0IsVUFBbEIsQ0FBUCxDQUFxQyxDQUFDLGFBQXRDLENBQUE7VUFEOEMsQ0FBaEQ7UUFEZ0IsQ0FKbEI7UUFRQSxLQUFBLEVBQU8sU0FBQyxRQUFEO2lCQUNMLEVBQUEsQ0FBRyxVQUFBLEdBQVcsVUFBWCxHQUFzQixnQ0FBdEIsR0FBc0QsUUFBekQsRUFBcUUsU0FBQTttQkFDbkUsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxRQUE1QztVQURtRSxDQUFyRTtR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QyxpQkFBQSxHQUFvQixTQUFBLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBdUIsV0FBRCxHQUFhLFNBQW5DO1VBRXBCLFNBQUEsR0FBWSxDQUNWLGlCQURVLEVBRVYsU0FBQSxDQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXdCLFdBQUQsR0FBYSxTQUFwQyxDQUZVLEVBR1YsU0FBQSxDQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXdCLFdBQUQsR0FBYSxVQUFwQyxDQUhVO1VBTVosY0FBQSxHQUFpQixTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDO1VBQVQsQ0FBakI7aUJBRWpCLE9BQUEsR0FBYyxJQUFBLFlBQUEsQ0FBYTtZQUN6QixVQUFBLFFBRHlCO1lBRXpCLFdBQUEsU0FGeUI7WUFHekIsZ0JBQUEsY0FIeUI7WUFJekIsYUFBQSxFQUFrQixXQUFELEdBQWEsU0FKTDtZQUt6QixTQUFBLEVBQVcsQ0FBQyxXQUFELEVBQWlCLFdBQUQsR0FBYSxHQUE3QixDQUxjO1dBQWI7UUFaTCxDQUFYO2VBb0JBLFFBQUEsQ0FBUyxHQUFULENBQWEsQ0FBQyxLQUFkLENBQW9CLEVBQXBCO01BckJ5QyxDQUEzQztJQWpDZ0MsQ0FBbEM7RUFsVXVCLENBQXpCO0FBSkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbkNvbG9yQ29udGV4dCA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1jb250ZXh0J1xuQ29sb3JQYXJzZXIgPSByZXF1aXJlICcuLi9saWIvY29sb3ItcGFyc2VyJ1xucmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvY29sb3ItZXhwcmVzc2lvbnMnXG5cbmRlc2NyaWJlICdDb2xvckNvbnRleHQnLCAtPlxuICBbY29udGV4dCwgcGFyc2VyXSA9IFtdXG5cbiAgaXRQYXJzZXMgPSAoZXhwcmVzc2lvbikgLT5cbiAgICBhc1VuZGVmaW5lZDogLT5cbiAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyB1bmRlZmluZWRcIiwgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQuZ2V0VmFsdWUoZXhwcmVzc2lvbikpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgYXNVbmRlZmluZWRDb2xvcjogLT5cbiAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyB1bmRlZmluZWQgY29sb3JcIiwgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQucmVhZENvbG9yKGV4cHJlc3Npb24pKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGFzSW50OiAoZXhwZWN0ZWQpIC0+XG4gICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgYW4gaW50ZWdlciB3aXRoIHZhbHVlIG9mICN7ZXhwZWN0ZWR9XCIsIC0+XG4gICAgICAgIGV4cGVjdChjb250ZXh0LnJlYWRJbnQoZXhwcmVzc2lvbikpLnRvRXF1YWwoZXhwZWN0ZWQpXG5cbiAgICBhc0Zsb2F0OiAoZXhwZWN0ZWQpIC0+XG4gICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgYSBmbG9hdCB3aXRoIHZhbHVlIG9mICN7ZXhwZWN0ZWR9XCIsIC0+XG4gICAgICAgIGV4cGVjdChjb250ZXh0LnJlYWRGbG9hdChleHByZXNzaW9uKSkudG9FcXVhbChleHBlY3RlZClcblxuICAgIGFzSW50T3JQZXJjZW50OiAoZXhwZWN0ZWQpIC0+XG4gICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgYW4gaW50ZWdlciBvciBhIHBlcmNlbnRhZ2Ugd2l0aCB2YWx1ZSBvZiAje2V4cGVjdGVkfVwiLCAtPlxuICAgICAgICBleHBlY3QoY29udGV4dC5yZWFkSW50T3JQZXJjZW50KGV4cHJlc3Npb24pKS50b0VxdWFsKGV4cGVjdGVkKVxuXG4gICAgYXNGbG9hdE9yUGVyY2VudDogKGV4cGVjdGVkKSAtPlxuICAgICAgaXQgXCJwYXJzZXMgJyN7ZXhwcmVzc2lvbn0nIGFzIGEgZmxvYXQgb3IgYSBwZXJjZW50YWdlIHdpdGggdmFsdWUgb2YgI3tleHBlY3RlZH1cIiwgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGV4cHJlc3Npb24pKS50b0VxdWFsKGV4cGVjdGVkKVxuXG4gICAgYXNDb2xvckV4cHJlc3Npb246IChleHBlY3RlZCkgLT5cbiAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyBhIGNvbG9yIGV4cHJlc3Npb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQucmVhZENvbG9yRXhwcmVzc2lvbihleHByZXNzaW9uKSkudG9FcXVhbChleHBlY3RlZClcblxuICAgIGFzQ29sb3I6IChleHBlY3RlZC4uLikgLT5cbiAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyBhIGNvbG9yIHdpdGggdmFsdWUgb2YgI3tqYXNtaW5lLnBwIGV4cGVjdGVkfVwiLCAtPlxuICAgICAgICBleHBlY3QoY29udGV4dC5yZWFkQ29sb3IoZXhwcmVzc2lvbikpLnRvQmVDb2xvcihleHBlY3RlZC4uLilcblxuICAgIGFzSW52YWxpZENvbG9yOiAoZXhwZWN0ZWQuLi4pIC0+XG4gICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgYW4gaW52YWxpZCBjb2xvclwiLCAtPlxuICAgICAgICBleHBlY3QoY29udGV4dC5yZWFkQ29sb3IoZXhwcmVzc2lvbikpLm5vdC50b0JlVmFsaWQoKVxuXG4gIGRlc2NyaWJlICdjcmVhdGVkIHdpdGhvdXQgYW55IHZhcmlhYmxlcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgY29udGV4dCA9IG5ldyBDb2xvckNvbnRleHQoe3JlZ2lzdHJ5fSlcblxuICAgIGl0UGFyc2VzKCcxMCcpLmFzSW50KDEwKVxuXG4gICAgaXRQYXJzZXMoJzEwJykuYXNGbG9hdCgxMClcbiAgICBpdFBhcnNlcygnMC41JykuYXNGbG9hdCgwLjUpXG4gICAgaXRQYXJzZXMoJy41JykuYXNGbG9hdCgwLjUpXG5cbiAgICBpdFBhcnNlcygnMTAnKS5hc0ludE9yUGVyY2VudCgxMClcbiAgICBpdFBhcnNlcygnMTAlJykuYXNJbnRPclBlcmNlbnQoMjYpXG5cbiAgICBpdFBhcnNlcygnMC4xJykuYXNGbG9hdE9yUGVyY2VudCgwLjEpXG4gICAgaXRQYXJzZXMoJzEwJScpLmFzRmxvYXRPclBlcmNlbnQoMC4xKVxuXG4gICAgaXRQYXJzZXMoJ3JlZCcpLmFzQ29sb3JFeHByZXNzaW9uKCdyZWQnKVxuXG4gICAgaXRQYXJzZXMoJ3JlZCcpLmFzQ29sb3IoMjU1LCAwLCAwKVxuICAgIGl0UGFyc2VzKCcjZmYwMDAwJykuYXNDb2xvcigyNTUsIDAsIDApXG4gICAgaXRQYXJzZXMoJ3JnYigyNTUsMTI3LDApJykuYXNDb2xvcigyNTUsIDEyNywgMClcblxuICBkZXNjcmliZSAnd2l0aCBhIHZhcmlhYmxlcyBhcnJheScsIC0+XG4gICAgY3JlYXRlVmFyID0gKG5hbWUsIHZhbHVlLCBwYXRoKSAtPlxuICAgICAge3ZhbHVlLCBuYW1lLCBwYXRoOiBwYXRoID8gJy9wYXRoL3RvL2ZpbGUuY29mZmVlJ31cblxuICAgIGNyZWF0ZUNvbG9yVmFyID0gKG5hbWUsIHZhbHVlLCBwYXRoKSAtPlxuICAgICAgdiA9IGNyZWF0ZVZhcihuYW1lLCB2YWx1ZSwgcGF0aClcbiAgICAgIHYuaXNDb2xvciA9IHRydWVcbiAgICAgIHZcblxuICAgIGRlc2NyaWJlICd0aGF0IGNvbnRhaW5zIHZhbGlkIHZhcmlhYmxlcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHZhcmlhYmxlcyA9IFtcbiAgICAgICAgICBjcmVhdGVWYXIgJ3gnLCAnMTAnXG4gICAgICAgICAgY3JlYXRlVmFyICd5JywgJzAuMSdcbiAgICAgICAgICBjcmVhdGVWYXIgJ3onLCAnMTAlJ1xuICAgICAgICAgIGNyZWF0ZUNvbG9yVmFyICdjJywgJ3JnYigyNTUsMTI3LDApJ1xuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7dmFyaWFibGVzLCBjb2xvclZhcmlhYmxlcywgcmVnaXN0cnl9KVxuXG4gICAgICBpdFBhcnNlcygneCcpLmFzSW50KDEwKVxuICAgICAgaXRQYXJzZXMoJ3knKS5hc0Zsb2F0KDAuMSlcbiAgICAgIGl0UGFyc2VzKCd6JykuYXNJbnRPclBlcmNlbnQoMjYpXG4gICAgICBpdFBhcnNlcygneicpLmFzRmxvYXRPclBlcmNlbnQoMC4xKVxuXG4gICAgICBpdFBhcnNlcygnYycpLmFzQ29sb3JFeHByZXNzaW9uKCdyZ2IoMjU1LDEyNywwKScpXG4gICAgICBpdFBhcnNlcygnYycpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG5cbiAgICBkZXNjcmliZSAndGhhdCBjb250YWlucyBhbGlhcyBmb3IgbmFtZWQgY29sb3JzJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgdmFyaWFibGVzID1bXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJyR0ZXh0LWNvbG9yJywgJ3doaXRlJywgJy9wYXRoL3RvL2ZpbGUuY3NzLnNhc3MnXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJyRiYWNrZ3JvdW5kLWNvbG9yJywgJ2JsYWNrJywgJy9wYXRoL3RvL2ZpbGUuY3NzLnNhc3MnXG4gICAgICAgIF1cblxuICAgICAgICBjb2xvclZhcmlhYmxlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHYuaXNDb2xvclxuXG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHt2YXJpYWJsZXMsIGNvbG9yVmFyaWFibGVzLCByZWdpc3RyeX0pXG5cbiAgICAgIGl0UGFyc2VzKCckdGV4dC1jb2xvcicpLmFzQ29sb3IoMjU1LDI1NSwyNTUpXG4gICAgICBpdFBhcnNlcygnJGJhY2tncm91bmQtY29sb3InKS5hc0NvbG9yKDAsMCwwKVxuXG4gICAgZGVzY3JpYmUgJ3RoYXQgY29udGFpbnMgaW52YWxpZCBjb2xvcnMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB2YXJpYWJsZXMgPVtcbiAgICAgICAgICBjcmVhdGVWYXIgJ0B0ZXh0LWhlaWdodCcsICdAc2NhbGUtYi14eGwgKiAxcmVtJ1xuICAgICAgICAgIGNyZWF0ZVZhciAnQGNvbXBvbmVudC1saW5lLWhlaWdodCcsICdAdGV4dC1oZWlnaHQnXG4gICAgICAgICAgY3JlYXRlVmFyICdAbGlzdC1pdGVtLWhlaWdodCcsICdAY29tcG9uZW50LWxpbmUtaGVpZ2h0J1xuICAgICAgICBdXG5cbiAgICAgICAgY29udGV4dCA9IG5ldyBDb2xvckNvbnRleHQoe3ZhcmlhYmxlcywgcmVnaXN0cnl9KVxuXG4gICAgICBpdFBhcnNlcygnQGxpc3QtaXRlbS1oZWlnaHQnKS5hc1VuZGVmaW5lZENvbG9yKClcblxuICAgIGRlc2NyaWJlICd0aGF0IGNvbnRhaW5zIGNpcmN1bGFyIHJlZmVyZW5jZXMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB2YXJpYWJsZXMgPVtcbiAgICAgICAgICBjcmVhdGVWYXIgJ0Bmb28nLCAnQGJhcidcbiAgICAgICAgICBjcmVhdGVWYXIgJ0BiYXInLCAnQGJheidcbiAgICAgICAgICBjcmVhdGVWYXIgJ0BiYXonLCAnQGZvbydcbiAgICAgICAgICBjcmVhdGVWYXIgJ0B0YXonLCAnQHRheidcbiAgICAgICAgXVxuXG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHt2YXJpYWJsZXMsIHJlZ2lzdHJ5fSlcblxuICAgICAgaXRQYXJzZXMoJ0Bmb28nKS5hc1VuZGVmaW5lZCgpXG4gICAgICBpdFBhcnNlcygnQHRheicpLmFzVW5kZWZpbmVkKClcblxuICAgIGRlc2NyaWJlICd0aGF0IGNvbnRhaW5zIGNpcmN1bGFyIHJlZmVyZW5jZXMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB2YXJpYWJsZXMgPVtcbiAgICAgICAgICBjcmVhdGVDb2xvclZhciAnQGZvbycsICdAYmFyJ1xuICAgICAgICAgIGNyZWF0ZUNvbG9yVmFyICdAYmFyJywgJ0BiYXonXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJ0BiYXonLCAnQGZvbydcbiAgICAgICAgICBjcmVhdGVDb2xvclZhciAnQHRheicsICdAdGF6J1xuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7dmFyaWFibGVzLCBjb2xvclZhcmlhYmxlcywgcmVnaXN0cnl9KVxuXG4gICAgICBpdFBhcnNlcygnQGZvbycpLmFzSW52YWxpZENvbG9yKClcbiAgICAgIGl0UGFyc2VzKCdAZm9vJykuYXNVbmRlZmluZWQoKVxuICAgICAgaXRQYXJzZXMoJ0B0YXonKS5hc1VuZGVmaW5lZCgpXG5cbiAgICBkZXNjcmliZSAndGhhdCBjb250YWlucyBjaXJjdWxhciByZWZlcmVuY2VzIG5lc3RlZCBpbiBvcGVyYXRpb25zJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgdmFyaWFibGVzID1bXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJ0Bmb28nLCAnY29tcGxlbWVudChAYmFyKSdcbiAgICAgICAgICBjcmVhdGVDb2xvclZhciAnQGJhcicsICd0cmFuc3BhcmVudGl6ZShAYmF6LCAwLjUpJ1xuICAgICAgICAgIGNyZWF0ZUNvbG9yVmFyICdAYmF6JywgJ2RhcmtlbihAZm9vLCAxMCUpJ1xuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7dmFyaWFibGVzLCBjb2xvclZhcmlhYmxlcywgcmVnaXN0cnl9KVxuXG4gICAgICBpdFBhcnNlcygnQGZvbycpLmFzSW52YWxpZENvbG9yKClcblxuICBkZXNjcmliZSAnd2l0aCB2YXJpYWJsZXMgZnJvbSBhIGRlZmF1bHQgZmlsZScsIC0+XG4gICAgW3Byb2plY3RQYXRoLCByZWZlcmVuY2VWYXJpYWJsZV0gPSBbXVxuICAgIGNyZWF0ZVZhciA9IChuYW1lLCB2YWx1ZSwgcGF0aCwgaXNEZWZhdWx0PWZhbHNlKSAtPlxuICAgICAgcGF0aCA/PSBcIiN7cHJvamVjdFBhdGh9L2ZpbGUuc3R5bFwiXG4gICAgICB7dmFsdWUsIG5hbWUsIHBhdGgsIGRlZmF1bHQ6IGlzRGVmYXVsdH1cblxuICAgIGNyZWF0ZUNvbG9yVmFyID0gKG5hbWUsIHZhbHVlLCBwYXRoLCBpc0RlZmF1bHQpIC0+XG4gICAgICB2ID0gY3JlYXRlVmFyKG5hbWUsIHZhbHVlLCBwYXRoLCBpc0RlZmF1bHQpXG4gICAgICB2LmlzQ29sb3IgPSB0cnVlXG4gICAgICB2XG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGVyZSBpcyBhbm90aGVyIHZhbGlkIHZhbHVlJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICByZWZlcmVuY2VWYXJpYWJsZSA9IGNyZWF0ZVZhciAnYScsICdiJywgXCIje3Byb2plY3RQYXRofS9hLnN0eWxcIlxuXG4gICAgICAgIHZhcmlhYmxlcyA9IFtcbiAgICAgICAgICByZWZlcmVuY2VWYXJpYWJsZVxuICAgICAgICAgIGNyZWF0ZVZhciAnYicsICcxMCcsIFwiI3twcm9qZWN0UGF0aH0vYi5zdHlsXCIsIHRydWVcbiAgICAgICAgICBjcmVhdGVWYXIgJ2InLCAnMjAnLCBcIiN7cHJvamVjdFBhdGh9L2Iuc3R5bFwiXG4gICAgICAgIF1cblxuICAgICAgICBjb2xvclZhcmlhYmxlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHYuaXNDb2xvclxuXG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHtcbiAgICAgICAgICByZWdpc3RyeVxuICAgICAgICAgIHZhcmlhYmxlc1xuICAgICAgICAgIGNvbG9yVmFyaWFibGVzXG4gICAgICAgICAgcmVmZXJlbmNlVmFyaWFibGVcbiAgICAgICAgICByb290UGF0aHM6IFtwcm9qZWN0UGF0aF1cbiAgICAgICAgfSlcblxuICAgICAgaXRQYXJzZXMoJ2EnKS5hc0ludCgyMClcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZXJlIGlzIG5vIGFub3RoZXIgdmFsaWQgdmFsdWUnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlID0gY3JlYXRlVmFyICdhJywgJ2InLCBcIiN7cHJvamVjdFBhdGh9L2Euc3R5bFwiXG5cbiAgICAgICAgdmFyaWFibGVzID0gW1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgY3JlYXRlVmFyICdiJywgJzEwJywgXCIje3Byb2plY3RQYXRofS9iLnN0eWxcIiwgdHJ1ZVxuICAgICAgICAgIGNyZWF0ZVZhciAnYicsICdjJywgXCIje3Byb2plY3RQYXRofS9iLnN0eWxcIlxuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICAgICAgcmVnaXN0cnlcbiAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICBjb2xvclZhcmlhYmxlc1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGhdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNJbnQoMTApXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGVyZSBpcyBhbm90aGVyIHZhbGlkIGNvbG9yJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICByZWZlcmVuY2VWYXJpYWJsZSA9IGNyZWF0ZUNvbG9yVmFyICdhJywgJ2InLCBcIiN7cHJvamVjdFBhdGh9L2Euc3R5bFwiXG5cbiAgICAgICAgdmFyaWFibGVzID0gW1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJ2InLCAnI2ZmMDAwMCcsIFwiI3twcm9qZWN0UGF0aH0vYi5zdHlsXCIsIHRydWVcbiAgICAgICAgICBjcmVhdGVDb2xvclZhciAnYicsICcjMDAwMGZmJywgXCIje3Byb2plY3RQYXRofS9iLnN0eWxcIlxuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICAgICAgcmVnaXN0cnlcbiAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICBjb2xvclZhcmlhYmxlc1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGhdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNDb2xvcigwLCAwLCAyNTUpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGVyZSBpcyBubyBhbm90aGVyIHZhbGlkIGNvbG9yJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICByZWZlcmVuY2VWYXJpYWJsZSA9IGNyZWF0ZUNvbG9yVmFyICdhJywgJ2InLCBcIiN7cHJvamVjdFBhdGh9L2Euc3R5bFwiXG5cbiAgICAgICAgdmFyaWFibGVzID0gW1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgY3JlYXRlQ29sb3JWYXIgJ2InLCAnI2ZmMDAwMCcsIFwiI3twcm9qZWN0UGF0aH0vYi5zdHlsXCIsIHRydWVcbiAgICAgICAgICBjcmVhdGVDb2xvclZhciAnYicsICdjJywgXCIje3Byb2plY3RQYXRofS9iLnN0eWxcIlxuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICAgICAgcmVnaXN0cnlcbiAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICBjb2xvclZhcmlhYmxlc1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGhdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNDb2xvcigyNTUsIDAsIDApXG5cbiAgZGVzY3JpYmUgJ3dpdGggYSByZWZlcmVuY2UgdmFyaWFibGUnLCAtPlxuICAgIFtwcm9qZWN0UGF0aCwgcmVmZXJlbmNlVmFyaWFibGVdID0gW11cbiAgICBjcmVhdGVWYXIgPSAobmFtZSwgdmFsdWUsIHBhdGgpIC0+XG4gICAgICBwYXRoID89IFwiI3twcm9qZWN0UGF0aH0vZmlsZS5zdHlsXCJcbiAgICAgIHt2YWx1ZSwgbmFtZSwgcGF0aH1cblxuICAgIGNyZWF0ZUNvbG9yVmFyID0gKG5hbWUsIHZhbHVlKSAtPlxuICAgICAgdiA9IGNyZWF0ZVZhcihuYW1lLCB2YWx1ZSlcbiAgICAgIHYuaXNDb2xvciA9IHRydWVcbiAgICAgIHZcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZXJlIGlzIGEgc2luZ2xlIHJvb3QgcGF0aCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgcmVmZXJlbmNlVmFyaWFibGUgPSBjcmVhdGVWYXIgJ2EnLCAnMTAnLCBcIiN7cHJvamVjdFBhdGh9L2Euc3R5bFwiXG5cbiAgICAgICAgdmFyaWFibGVzID0gW1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgY3JlYXRlVmFyICdhJywgJzIwJywgXCIje3Byb2plY3RQYXRofS9iLnN0eWxcIlxuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICAgICAgcmVnaXN0cnlcbiAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICBjb2xvclZhcmlhYmxlc1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGhdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNJbnQoMTApXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGVyZSBhcmUgbWFueSByb290IHBhdGhzJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICByZWZlcmVuY2VWYXJpYWJsZSA9IGNyZWF0ZVZhciAnYScsICdiJywgXCIje3Byb2plY3RQYXRofS9hLnN0eWxcIlxuXG4gICAgICAgIHZhcmlhYmxlcyA9IFtcbiAgICAgICAgICByZWZlcmVuY2VWYXJpYWJsZVxuICAgICAgICAgIGNyZWF0ZVZhciAnYicsICcxMCcsIFwiI3twcm9qZWN0UGF0aH0vYi5zdHlsXCJcbiAgICAgICAgICBjcmVhdGVWYXIgJ2InLCAnMjAnLCBcIiN7cHJvamVjdFBhdGh9Mi9iLnN0eWxcIlxuICAgICAgICBdXG5cbiAgICAgICAgY29sb3JWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2LmlzQ29sb3JcblxuICAgICAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICAgICAgcmVnaXN0cnlcbiAgICAgICAgICB2YXJpYWJsZXNcbiAgICAgICAgICBjb2xvclZhcmlhYmxlc1xuICAgICAgICAgIHJlZmVyZW5jZVZhcmlhYmxlXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGgsIFwiI3twcm9qZWN0UGF0aH0yXCJdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNJbnQoMTApXG5cbiAgZGVzY3JpYmUgJ3dpdGggYSByZWZlcmVuY2UgcGF0aCcsIC0+XG4gICAgW3Byb2plY3RQYXRoLCByZWZlcmVuY2VWYXJpYWJsZV0gPSBbXVxuICAgIGNyZWF0ZVZhciA9IChuYW1lLCB2YWx1ZSwgcGF0aCkgLT5cbiAgICAgIHBhdGggPz0gXCIje3Byb2plY3RQYXRofS9maWxlLnN0eWxcIlxuICAgICAge3ZhbHVlLCBuYW1lLCBwYXRofVxuXG4gICAgY3JlYXRlQ29sb3JWYXIgPSAobmFtZSwgdmFsdWUpIC0+XG4gICAgICB2ID0gY3JlYXRlVmFyKG5hbWUsIHZhbHVlKVxuICAgICAgdi5pc0NvbG9yID0gdHJ1ZVxuICAgICAgdlxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlcmUgaXMgYSBzaW5nbGUgcm9vdCBwYXRoJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICByZWZlcmVuY2VWYXJpYWJsZSA9IGNyZWF0ZVZhciAnYScsICcxMCcsIFwiI3twcm9qZWN0UGF0aH0vYS5zdHlsXCJcblxuICAgICAgICB2YXJpYWJsZXMgPSBbXG4gICAgICAgICAgcmVmZXJlbmNlVmFyaWFibGVcbiAgICAgICAgICBjcmVhdGVWYXIgJ2EnLCAnMjAnLCBcIiN7cHJvamVjdFBhdGh9L2Iuc3R5bFwiXG4gICAgICAgIF1cblxuICAgICAgICBjb2xvclZhcmlhYmxlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHYuaXNDb2xvclxuXG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHtcbiAgICAgICAgICByZWdpc3RyeVxuICAgICAgICAgIHZhcmlhYmxlc1xuICAgICAgICAgIGNvbG9yVmFyaWFibGVzXG4gICAgICAgICAgcmVmZXJlbmNlUGF0aDogXCIje3Byb2plY3RQYXRofS9hLnN0eWxcIlxuICAgICAgICAgIHJvb3RQYXRoczogW3Byb2plY3RQYXRoXVxuICAgICAgICB9KVxuXG4gICAgICBpdFBhcnNlcygnYScpLmFzSW50KDEwKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlcmUgYXJlIG1hbnkgcm9vdCBwYXRocycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgcmVmZXJlbmNlVmFyaWFibGUgPSBjcmVhdGVWYXIgJ2EnLCAnYicsIFwiI3twcm9qZWN0UGF0aH0vYS5zdHlsXCJcblxuICAgICAgICB2YXJpYWJsZXMgPSBbXG4gICAgICAgICAgcmVmZXJlbmNlVmFyaWFibGVcbiAgICAgICAgICBjcmVhdGVWYXIgJ2InLCAnMTAnLCBcIiN7cHJvamVjdFBhdGh9L2Iuc3R5bFwiXG4gICAgICAgICAgY3JlYXRlVmFyICdiJywgJzIwJywgXCIje3Byb2plY3RQYXRofTIvYi5zdHlsXCJcbiAgICAgICAgXVxuXG4gICAgICAgIGNvbG9yVmFyaWFibGVzID0gdmFyaWFibGVzLmZpbHRlciAodikgLT4gdi5pc0NvbG9yXG5cbiAgICAgICAgY29udGV4dCA9IG5ldyBDb2xvckNvbnRleHQoe1xuICAgICAgICAgIHJlZ2lzdHJ5XG4gICAgICAgICAgdmFyaWFibGVzXG4gICAgICAgICAgY29sb3JWYXJpYWJsZXNcbiAgICAgICAgICByZWZlcmVuY2VQYXRoOiBcIiN7cHJvamVjdFBhdGh9L2Euc3R5bFwiXG4gICAgICAgICAgcm9vdFBhdGhzOiBbcHJvamVjdFBhdGgsIFwiI3twcm9qZWN0UGF0aH0yXCJdXG4gICAgICAgIH0pXG5cbiAgICAgIGl0UGFyc2VzKCdhJykuYXNJbnQoMTApXG4iXX0=

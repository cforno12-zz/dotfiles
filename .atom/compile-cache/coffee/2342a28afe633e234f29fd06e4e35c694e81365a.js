(function() {
  var Disposable, Pigments, PigmentsAPI, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, ref, registry;

  Disposable = require('atom').Disposable;

  Pigments = require('../lib/pigments');

  PigmentsAPI = require('../lib/pigments-api');

  registry = require('../lib/variable-expressions');

  ref = require('../lib/versions'), SERIALIZE_VERSION = ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref.SERIALIZE_MARKERS_VERSION;

  describe("Pigments", function() {
    var pigments, project, ref1, workspaceElement;
    ref1 = [], workspaceElement = ref1[0], pigments = ref1[1], project = ref1[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.ignoredScopes', []);
      atom.config.set('pigments.autocompleteScopes', []);
      registry.createExpression('pigments:txt_vars', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['txt']);
      return waitsForPromise({
        label: 'pigments activation'
      }, function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      registry.removeExpression('pigments:txt_vars');
      return project != null ? project.destroy() : void 0;
    });
    it('instanciates a ColorProject instance', function() {
      return expect(pigments.getProject()).toBeDefined();
    });
    it('serializes the project', function() {
      var date;
      date = new Date;
      spyOn(pigments.getProject(), 'getTimestamp').andCallFake(function() {
        return date;
      });
      return expect(pigments.serialize()).toEqual({
        project: {
          deserializer: 'ColorProject',
          timestamp: date,
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION,
          globalSourceNames: ['**/*.sass', '**/*.styl'],
          globalIgnoredNames: [],
          buffers: {}
        }
      });
    });
    describe('when deactivated', function() {
      var colorBuffer, editor, editorElement, ref2;
      ref2 = [], editor = ref2[0], editorElement = ref2[1], colorBuffer = ref2[2];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        waitsFor('pigments markers appended to the DOM', function() {
          return editorElement.querySelector('pigments-markers');
        });
        return runs(function() {
          spyOn(project, 'destroy').andCallThrough();
          spyOn(colorBuffer, 'destroy').andCallThrough();
          return pigments.deactivate();
        });
      });
      it('destroys the pigments project', function() {
        return expect(project.destroy).toHaveBeenCalled();
      });
      it('destroys all the color buffers that were created', function() {
        expect(project.colorBufferForEditor(editor)).toBeUndefined();
        expect(project.colorBuffersByEditorId).toBeNull();
        return expect(colorBuffer.destroy).toHaveBeenCalled();
      });
      return it('destroys the color buffer element that were added to the DOM', function() {
        return expect(editorElement.querySelector('pigments-markers')).not.toExist();
      });
    });
    describe('pigments:project-settings', function() {
      var item;
      item = null;
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:project-settings');
        return waitsFor('active pane item', function() {
          item = atom.workspace.getActivePaneItem();
          return item != null;
        });
      });
      return it('opens a settings view in the active pane', function() {
        return item.matches('pigments-color-project');
      });
    });
    describe('API provider', function() {
      var buffer, editor, editorElement, ref2, service;
      ref2 = [], service = ref2[0], editor = ref2[1], editorElement = ref2[2], buffer = ref2[3];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return buffer = project.colorBufferForEditor(editor);
          });
        });
        runs(function() {
          return service = pigments.provideAPI();
        });
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      it('returns an object conforming to the API', function() {
        expect(service instanceof PigmentsAPI).toBeTruthy();
        expect(service.getProject()).toBe(project);
        expect(service.getPalette()).toEqual(project.getPalette());
        expect(service.getPalette()).not.toBe(project.getPalette());
        expect(service.getVariables()).toEqual(project.getVariables());
        return expect(service.getColorVariables()).toEqual(project.getColorVariables());
      });
      return describe('::observeColorBuffers', function() {
        var spy;
        spy = [][0];
        beforeEach(function() {
          spy = jasmine.createSpy('did-create-color-buffer');
          return service.observeColorBuffers(spy);
        });
        it('calls the callback for every existing color buffer', function() {
          expect(spy).toHaveBeenCalled();
          return expect(spy.calls.length).toEqual(1);
        });
        return it('calls the callback on every new buffer creation', function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('buttons.styl');
          });
          return runs(function() {
            return expect(spy.calls.length).toEqual(2);
          });
        });
      });
    });
    describe('color expression consumer', function() {
      var colorBuffer, colorBufferElement, colorProvider, consumerDisposable, editor, editorElement, otherConsumerDisposable, ref2;
      ref2 = [], colorProvider = ref2[0], consumerDisposable = ref2[1], editor = ref2[2], editorElement = ref2[3], colorBuffer = ref2[4], colorBufferElement = ref2[5], otherConsumerDisposable = ref2[6];
      beforeEach(function() {
        return colorProvider = {
          name: 'todo',
          regexpString: 'TODO',
          scopes: ['*'],
          priority: 0,
          handle: function(match, expression, context) {
            return this.red = 255;
          }
        };
      });
      afterEach(function() {
        if (consumerDisposable != null) {
          consumerDisposable.dispose();
        }
        return otherConsumerDisposable != null ? otherConsumerDisposable.dispose() : void 0;
      });
      describe('when consumed before opening a text editor', function() {
        beforeEach(function() {
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('parses the new expression and renders a color', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(1);
        });
        it('returns a Disposable instance', function() {
          return expect(consumerDisposable instanceof Disposable).toBeTruthy();
        });
        return describe('the returned disposable', function() {
          it('removes the provided expression from the registry', function() {
            consumerDisposable.dispose();
            return expect(project.getColorExpressionsRegistry().getExpression('todo')).toBeUndefined();
          });
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable.dispose();
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      describe('when consumed after opening a text editor', function() {
        beforeEach(function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('triggers an update in the opened editors', function() {
          var updateSpy;
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 0;
          });
          runs(function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(1);
            return consumerDisposable.dispose();
          });
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 1;
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        return describe('when an array of expressions is passed', function() {
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable = pigments.consumeColorExpressions({
              expressions: [colorProvider]
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            runs(function() {
              expect(colorBuffer.getColorMarkers().length).toEqual(1);
              return consumerDisposable.dispose();
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 1;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      return describe('when the expression matches a variable value', function() {
        beforeEach(function() {
          return waitsForPromise({
            label: 'project initialized'
          }, function() {
            return project.initialize();
          });
        });
        it('detects the new variable as a color variable', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            return consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          });
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 2;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(5);
          });
        });
        return describe('and there was an expression that could not be resolved before', function() {
          return it('updates the invalid color as a now valid color', function() {
            var variableSpy;
            variableSpy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(variableSpy);
            atom.config.set('pigments.sourceNames', ['**/*.txt']);
            waitsFor('variables updated', function() {
              return variableSpy.callCount > 1;
            });
            return runs(function() {
              otherConsumerDisposable = pigments.consumeColorExpressions({
                name: 'bar',
                regexpString: 'baz\\s+(\\w+)',
                handle: function(match, expression, context) {
                  var _, color, expr;
                  _ = match[0], expr = match[1];
                  color = context.readColor(expr);
                  if (context.isInvalid(color)) {
                    return this.invalid = true;
                  }
                  return this.rgba = color.rgba;
                }
              });
              consumerDisposable = pigments.consumeColorExpressions(colorProvider);
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 2;
              });
              runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(6);
                expect(project.getVariableByName('bar').color.invalid).toBeFalsy();
                return consumerDisposable.dispose();
              });
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 3;
              });
              return runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(5);
                return expect(project.getVariableByName('bar').color.invalid).toBeTruthy();
              });
            });
          });
        });
      });
    });
    return describe('variable expression consumer', function() {
      var colorBuffer, colorBufferElement, consumerDisposable, editor, editorElement, ref2, variableProvider;
      ref2 = [], variableProvider = ref2[0], consumerDisposable = ref2[1], editor = ref2[2], editorElement = ref2[3], colorBuffer = ref2[4], colorBufferElement = ref2[5];
      beforeEach(function() {
        variableProvider = {
          name: 'todo',
          regexpString: '(TODO):\\s*([^;\\n]+)'
        };
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      afterEach(function() {
        return consumerDisposable != null ? consumerDisposable.dispose() : void 0;
      });
      it('updates the project variables when consumed', function() {
        var variableSpy;
        variableSpy = jasmine.createSpy('did-update-variables');
        project.onDidUpdateVariables(variableSpy);
        atom.config.set('pigments.sourceNames', ['**/*.txt']);
        waitsFor('variables updated', function() {
          return variableSpy.callCount > 1;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(6);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable = pigments.consumeVariableExpressions(variableProvider);
        });
        waitsFor('variables updated after service consumed', function() {
          return variableSpy.callCount > 2;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(7);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable.dispose();
        });
        waitsFor('variables updated after service disposed', function() {
          return variableSpy.callCount > 3;
        });
        return runs(function() {
          expect(project.getVariables().length).toEqual(6);
          return expect(project.getColorVariables().length).toEqual(4);
        });
      });
      return describe('when an array of expressions is passed', function() {
        return it('updates the project variables when consumed', function() {
          var previousVariablesCount;
          previousVariablesCount = null;
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables initialized', function() {
            return project.getVariables().length === 45;
          });
          runs(function() {
            return previousVariablesCount = project.getVariables().length;
          });
          waitsFor('variables updated', function() {
            return project.getVariables().length === 6;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable = pigments.consumeVariableExpressions({
              expressions: [variableProvider]
            });
          });
          waitsFor('variables updated after service consumed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(7);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable.dispose();
          });
          waitsFor('variables updated after service disposed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(4);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2FjdGl2YXRpb24tYW5kLWFwaS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBQ2QsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUjs7RUFFWCxNQUFpRCxPQUFBLENBQVEsaUJBQVIsQ0FBakQsRUFBQyx5Q0FBRCxFQUFvQjs7RUFFcEIsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQixrQkFBbkIsRUFBNkI7SUFFN0IsVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FBQyxXQUFELEVBQWMsV0FBZCxDQUF4QztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsRUFBekM7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEVBQTFDO01BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxFQUEvQztNQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixtQkFBMUIsRUFBK0Msb0VBQS9DLEVBQXFILENBQUMsS0FBRCxDQUFySDthQUVBLGVBQUEsQ0FBZ0I7UUFBQSxLQUFBLEVBQU8scUJBQVA7T0FB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QUFBLENBQUssU0FBQTtZQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsWUFBUixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxDQUE5QzttQkFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FBMkIsQ0FBQyxNQUFuQyxDQUEwQyxDQUFDLE9BQTNDLENBQW1ELENBQW5EO1VBRkcsQ0FBTDtRQXJDZ0QsQ0FBbEQ7TUFEaUQsQ0FBbkQ7SUE1Q3VDLENBQXpDO0VBalVtQixDQUFyQjtBQVBBIiwic291cmNlc0NvbnRlbnQiOlsie0Rpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblBpZ21lbnRzID0gcmVxdWlyZSAnLi4vbGliL3BpZ21lbnRzJ1xuUGlnbWVudHNBUEkgPSByZXF1aXJlICcuLi9saWIvcGlnbWVudHMtYXBpJ1xucmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvdmFyaWFibGUtZXhwcmVzc2lvbnMnXG5cbntTRVJJQUxJWkVfVkVSU0lPTiwgU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTn0gPSByZXF1aXJlICcuLi9saWIvdmVyc2lvbnMnXG5cbmRlc2NyaWJlIFwiUGlnbWVudHNcIiwgLT5cbiAgW3dvcmtzcGFjZUVsZW1lbnQsIHBpZ21lbnRzLCBwcm9qZWN0XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKiovKi5zYXNzJywgJyoqLyouc3R5bCddKVxuICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZE5hbWVzJywgW10pXG4gICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5pZ25vcmVkU2NvcGVzJywgW10pXG4gICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5hdXRvY29tcGxldGVTY29wZXMnLCBbXSlcblxuICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnR4dF92YXJzJywgJ15bIFxcXFx0XSooW2EtekEtWl8kXVthLXpBLVowLTlcXFxcLV9dKilcXFxccyo9KD8hPSlcXFxccyooW15cXFxcblxcXFxyO10qKTs/JCcsIFsndHh0J11cblxuICAgIHdhaXRzRm9yUHJvbWlzZSBsYWJlbDogJ3BpZ21lbnRzIGFjdGl2YXRpb24nLCAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3BpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgICBwaWdtZW50cyA9IHBrZy5tYWluTW9kdWxlXG4gICAgICAgIHByb2plY3QgPSBwaWdtZW50cy5nZXRQcm9qZWN0KClcblxuICBhZnRlckVhY2ggLT5cbiAgICByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uICdwaWdtZW50czp0eHRfdmFycydcbiAgICBwcm9qZWN0Py5kZXN0cm95KClcblxuICBpdCAnaW5zdGFuY2lhdGVzIGEgQ29sb3JQcm9qZWN0IGluc3RhbmNlJywgLT5cbiAgICBleHBlY3QocGlnbWVudHMuZ2V0UHJvamVjdCgpKS50b0JlRGVmaW5lZCgpXG5cbiAgaXQgJ3NlcmlhbGl6ZXMgdGhlIHByb2plY3QnLCAtPlxuICAgIGRhdGUgPSBuZXcgRGF0ZVxuICAgIHNweU9uKHBpZ21lbnRzLmdldFByb2plY3QoKSwgJ2dldFRpbWVzdGFtcCcpLmFuZENhbGxGYWtlIC0+IGRhdGVcbiAgICBleHBlY3QocGlnbWVudHMuc2VyaWFsaXplKCkpLnRvRXF1YWwoe1xuICAgICAgcHJvamVjdDpcbiAgICAgICAgZGVzZXJpYWxpemVyOiAnQ29sb3JQcm9qZWN0J1xuICAgICAgICB0aW1lc3RhbXA6IGRhdGVcbiAgICAgICAgdmVyc2lvbjogU0VSSUFMSVpFX1ZFUlNJT05cbiAgICAgICAgbWFya2Vyc1ZlcnNpb246IFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT05cbiAgICAgICAgZ2xvYmFsU291cmNlTmFtZXM6IFsnKiovKi5zYXNzJywgJyoqLyouc3R5bCddXG4gICAgICAgIGdsb2JhbElnbm9yZWROYW1lczogW11cbiAgICAgICAgYnVmZmVyczoge31cbiAgICB9KVxuXG4gIGRlc2NyaWJlICd3aGVuIGRlYWN0aXZhdGVkJywgLT5cbiAgICBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBjb2xvckJ1ZmZlcl0gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSBsYWJlbDogJ3RleHQtZWRpdG9yIG9wZW5lZCcsIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2ZvdXItdmFyaWFibGVzLnN0eWwnKS50aGVuIChlKSAtPlxuICAgICAgICAgIGVkaXRvciA9IGVcbiAgICAgICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGUpXG4gICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgd2FpdHNGb3IgJ3BpZ21lbnRzIG1hcmtlcnMgYXBwZW5kZWQgdG8gdGhlIERPTScsIC0+XG4gICAgICAgIGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcigncGlnbWVudHMtbWFya2VycycpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgc3B5T24ocHJvamVjdCwgJ2Rlc3Ryb3knKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHNweU9uKGNvbG9yQnVmZmVyLCAnZGVzdHJveScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICBwaWdtZW50cy5kZWFjdGl2YXRlKClcblxuICAgIGl0ICdkZXN0cm95cyB0aGUgcGlnbWVudHMgcHJvamVjdCcsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGl0ICdkZXN0cm95cyBhbGwgdGhlIGNvbG9yIGJ1ZmZlcnMgdGhhdCB3ZXJlIGNyZWF0ZWQnLCAtPlxuICAgICAgZXhwZWN0KHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvamVjdC5jb2xvckJ1ZmZlcnNCeUVkaXRvcklkKS50b0JlTnVsbCgpXG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuZGVzdHJveSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBpdCAnZGVzdHJveXMgdGhlIGNvbG9yIGJ1ZmZlciBlbGVtZW50IHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgRE9NJywgLT5cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3BpZ21lbnRzLW1hcmtlcnMnKSkubm90LnRvRXhpc3QoKVxuXG4gIGRlc2NyaWJlICdwaWdtZW50czpwcm9qZWN0LXNldHRpbmdzJywgLT5cbiAgICBpdGVtID0gbnVsbFxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3BpZ21lbnRzOnByb2plY3Qtc2V0dGluZ3MnKVxuXG4gICAgICB3YWl0c0ZvciAnYWN0aXZlIHBhbmUgaXRlbScsIC0+XG4gICAgICAgIGl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIGl0ZW0/XG5cbiAgICBpdCAnb3BlbnMgYSBzZXR0aW5ncyB2aWV3IGluIHRoZSBhY3RpdmUgcGFuZScsIC0+XG4gICAgICBpdGVtLm1hdGNoZXMoJ3BpZ21lbnRzLWNvbG9yLXByb2plY3QnKVxuXG4gICMjICAgICAgICMjIyAgICAjIyMjIyMjIyAgIyMjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICAjI1xuICAjIyAgICAgIyMgICAjIyAgIyMgICAgICMjICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICAjI1xuICAjIyAgICAjIyMjIyMjIyMgIyMgICAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgICMjIyNcblxuICBkZXNjcmliZSAnQVBJIHByb3ZpZGVyJywgLT5cbiAgICBbc2VydmljZSwgZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBidWZmZXJdID0gW11cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgbGFiZWw6ICd0ZXh0LWVkaXRvciBvcGVuZWQnLCAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdmb3VyLXZhcmlhYmxlcy5zdHlsJykudGhlbiAoZSkgLT5cbiAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlKVxuICAgICAgICAgIGJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICBydW5zIC0+IHNlcnZpY2UgPSBwaWdtZW50cy5wcm92aWRlQVBJKClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIGxhYmVsOiAncHJvamVjdCBpbml0aWFsaXplZCcsIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICBpdCAncmV0dXJucyBhbiBvYmplY3QgY29uZm9ybWluZyB0byB0aGUgQVBJJywgLT5cbiAgICAgIGV4cGVjdChzZXJ2aWNlIGluc3RhbmNlb2YgUGlnbWVudHNBUEkpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBleHBlY3Qoc2VydmljZS5nZXRQcm9qZWN0KCkpLnRvQmUocHJvamVjdClcblxuICAgICAgZXhwZWN0KHNlcnZpY2UuZ2V0UGFsZXR0ZSgpKS50b0VxdWFsKHByb2plY3QuZ2V0UGFsZXR0ZSgpKVxuICAgICAgZXhwZWN0KHNlcnZpY2UuZ2V0UGFsZXR0ZSgpKS5ub3QudG9CZShwcm9qZWN0LmdldFBhbGV0dGUoKSlcblxuICAgICAgZXhwZWN0KHNlcnZpY2UuZ2V0VmFyaWFibGVzKCkpLnRvRXF1YWwocHJvamVjdC5nZXRWYXJpYWJsZXMoKSlcbiAgICAgIGV4cGVjdChzZXJ2aWNlLmdldENvbG9yVmFyaWFibGVzKCkpLnRvRXF1YWwocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpKVxuXG4gICAgZGVzY3JpYmUgJzo6b2JzZXJ2ZUNvbG9yQnVmZmVycycsIC0+XG4gICAgICBbc3B5XSA9IFtdXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1jcmVhdGUtY29sb3ItYnVmZmVyJylcbiAgICAgICAgc2VydmljZS5vYnNlcnZlQ29sb3JCdWZmZXJzKHNweSlcblxuICAgICAgaXQgJ2NhbGxzIHRoZSBjYWxsYmFjayBmb3IgZXZlcnkgZXhpc3RpbmcgY29sb3IgYnVmZmVyJywgLT5cbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChzcHkuY2FsbHMubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGl0ICdjYWxscyB0aGUgY2FsbGJhY2sgb24gZXZlcnkgbmV3IGJ1ZmZlciBjcmVhdGlvbicsIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAgbGFiZWw6ICd0ZXh0LWVkaXRvciBvcGVuZWQnLCAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2J1dHRvbnMuc3R5bCcpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgIyMgICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICAjIyMjIyMjICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyAgIyMgICAgICMjICAjIyMjIyNcblxuICBkZXNjcmliZSAnY29sb3IgZXhwcmVzc2lvbiBjb25zdW1lcicsIC0+XG4gICAgW2NvbG9yUHJvdmlkZXIsIGNvbnN1bWVyRGlzcG9zYWJsZSwgZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBjb2xvckJ1ZmZlciwgY29sb3JCdWZmZXJFbGVtZW50LCBvdGhlckNvbnN1bWVyRGlzcG9zYWJsZV0gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNvbG9yUHJvdmlkZXIgPVxuICAgICAgICBuYW1lOiAndG9kbydcbiAgICAgICAgcmVnZXhwU3RyaW5nOiAnVE9ETydcbiAgICAgICAgc2NvcGVzOiBbJyonXVxuICAgICAgICBwcmlvcml0eTogMFxuICAgICAgICBoYW5kbGU6IChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgICAgICAgICBAcmVkID0gMjU1XG5cbiAgICBhZnRlckVhY2ggLT5cbiAgICAgIGNvbnN1bWVyRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgICBvdGhlckNvbnN1bWVyRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG5cbiAgICBkZXNjcmliZSAnd2hlbiBjb25zdW1lZCBiZWZvcmUgb3BlbmluZyBhIHRleHQgZWRpdG9yJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29uc3VtZXJEaXNwb3NhYmxlID0gcGlnbWVudHMuY29uc3VtZUNvbG9yRXhwcmVzc2lvbnMoY29sb3JQcm92aWRlcilcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgbGFiZWw6ICd0ZXh0LWVkaXRvciBvcGVuZWQnLCAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2NvbG9yLWNvbnN1bWVyLXNhbXBsZS50eHQnKS50aGVuIChlKSAtPlxuICAgICAgICAgICAgZWRpdG9yID0gZVxuICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlKVxuICAgICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgbGFiZWw6ICdjb2xvciBidWZmZXIgaW5pdGlhbGl6ZWQnLCAtPlxuICAgICAgICAgIGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgbGFiZWw6ICdjb2xvciBidWZmZXIgdmFyaWFibGVzIGF2YWlsYWJsZScsIC0+XG4gICAgICAgICAgY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgaXQgJ3BhcnNlcyB0aGUgbmV3IGV4cHJlc3Npb24gYW5kIHJlbmRlcnMgYSBjb2xvcicsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgaXQgJ3JldHVybnMgYSBEaXNwb3NhYmxlIGluc3RhbmNlJywgLT5cbiAgICAgICAgZXhwZWN0KGNvbnN1bWVyRGlzcG9zYWJsZSBpbnN0YW5jZW9mIERpc3Bvc2FibGUpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBkZXNjcmliZSAndGhlIHJldHVybmVkIGRpc3Bvc2FibGUnLCAtPlxuICAgICAgICBpdCAncmVtb3ZlcyB0aGUgcHJvdmlkZWQgZXhwcmVzc2lvbiBmcm9tIHRoZSByZWdpc3RyeScsIC0+XG4gICAgICAgICAgY29uc3VtZXJEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5KCkuZ2V0RXhwcmVzc2lvbigndG9kbycpKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgICBpdCAndHJpZ2dlcnMgYW4gdXBkYXRlIGluIHRoZSBvcGVuZWQgZWRpdG9ycycsIC0+XG4gICAgICAgICAgdXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycycpXG5cbiAgICAgICAgICBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2Vycyh1cGRhdGVTcHkpXG4gICAgICAgICAgY29uc3VtZXJEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gICAgICAgICAgd2FpdHNGb3IgJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycyBldmVudCBkaXNwYXRjaGVkJywgLT5cbiAgICAgICAgICAgIHVwZGF0ZVNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBydW5zIC0+IGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAgIGRlc2NyaWJlICd3aGVuIGNvbnN1bWVkIGFmdGVyIG9wZW5pbmcgYSB0ZXh0IGVkaXRvcicsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBsYWJlbDogJ3RleHQtZWRpdG9yIG9wZW5lZCcsIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignY29sb3ItY29uc3VtZXItc2FtcGxlLnR4dCcpLnRoZW4gKGUpIC0+XG4gICAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGUpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBsYWJlbDogJ2NvbG9yIGJ1ZmZlciBpbml0aWFsaXplZCcsIC0+XG4gICAgICAgICAgY29sb3JCdWZmZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBsYWJlbDogJ2NvbG9yIGJ1ZmZlciB2YXJpYWJsZXMgYXZhaWxhYmxlJywgLT5cbiAgICAgICAgICBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBpdCAndHJpZ2dlcnMgYW4gdXBkYXRlIGluIHRoZSBvcGVuZWQgZWRpdG9ycycsIC0+XG4gICAgICAgIHVwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnKVxuXG4gICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKHVwZGF0ZVNweSlcbiAgICAgICAgY29uc3VtZXJEaXNwb3NhYmxlID0gcGlnbWVudHMuY29uc3VtZUNvbG9yRXhwcmVzc2lvbnMoY29sb3JQcm92aWRlcilcblxuICAgICAgICB3YWl0c0ZvciAnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzIGV2ZW50IGRpc3BhdGNoZWQnLCAtPlxuICAgICAgICAgIHVwZGF0ZVNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgICAgIGNvbnN1bWVyRGlzcG9zYWJsZS5kaXNwb3NlKClcblxuICAgICAgICB3YWl0c0ZvciAnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzIGV2ZW50IGRpc3BhdGNoZWQnLCAtPlxuICAgICAgICAgIHVwZGF0ZVNweS5jYWxsQ291bnQgPiAxXG5cbiAgICAgICAgcnVucyAtPiBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGFuIGFycmF5IG9mIGV4cHJlc3Npb25zIGlzIHBhc3NlZCcsIC0+XG4gICAgICAgIGl0ICd0cmlnZ2VycyBhbiB1cGRhdGUgaW4gdGhlIG9wZW5lZCBlZGl0b3JzJywgLT5cbiAgICAgICAgICB1cGRhdGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJylcblxuICAgICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKHVwZGF0ZVNweSlcbiAgICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUgPSBwaWdtZW50cy5jb25zdW1lQ29sb3JFeHByZXNzaW9ucyh7XG4gICAgICAgICAgICBleHByZXNzaW9uczogW2NvbG9yUHJvdmlkZXJdXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHdhaXRzRm9yICdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMgZXZlbnQgZGlzcGF0Y2hlZCcsIC0+XG4gICAgICAgICAgICB1cGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgICAgICAgICB3YWl0c0ZvciAnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzIGV2ZW50IGRpc3BhdGNoZWQnLCAtPlxuICAgICAgICAgICAgdXBkYXRlU3B5LmNhbGxDb3VudCA+IDFcblxuICAgICAgICAgIHJ1bnMgLT4gZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGV4cHJlc3Npb24gbWF0Y2hlcyBhIHZhcmlhYmxlIHZhbHVlJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIGxhYmVsOiAncHJvamVjdCBpbml0aWFsaXplZCcsIC0+XG4gICAgICAgICAgcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgICAgaXQgJ2RldGVjdHMgdGhlIG5ldyB2YXJpYWJsZSBhcyBhIGNvbG9yIHZhcmlhYmxlJywgLT5cbiAgICAgICAgdmFyaWFibGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS12YXJpYWJsZXMnKVxuXG4gICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXModmFyaWFibGVTcHkpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKiovKi50eHQnXVxuXG4gICAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgdXBkYXRlZCcsIC0+IHZhcmlhYmxlU3B5LmNhbGxDb3VudCA+IDFcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDYpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgICAgIGNvbnN1bWVyRGlzcG9zYWJsZSA9IHBpZ21lbnRzLmNvbnN1bWVDb2xvckV4cHJlc3Npb25zKGNvbG9yUHJvdmlkZXIpXG5cbiAgICAgICAgd2FpdHNGb3IgJ3ZhcmlhYmxlcyB1cGRhdGVkJywgLT4gdmFyaWFibGVTcHkuY2FsbENvdW50ID4gMlxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg1KVxuXG4gICAgICBkZXNjcmliZSAnYW5kIHRoZXJlIHdhcyBhbiBleHByZXNzaW9uIHRoYXQgY291bGQgbm90IGJlIHJlc29sdmVkIGJlZm9yZScsIC0+XG4gICAgICAgIGl0ICd1cGRhdGVzIHRoZSBpbnZhbGlkIGNvbG9yIGFzIGEgbm93IHZhbGlkIGNvbG9yJywgLT5cbiAgICAgICAgICB2YXJpYWJsZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLXZhcmlhYmxlcycpXG5cbiAgICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKHZhcmlhYmxlU3B5KVxuXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKiovKi50eHQnXVxuXG4gICAgICAgICAgd2FpdHNGb3IgJ3ZhcmlhYmxlcyB1cGRhdGVkJywgLT4gdmFyaWFibGVTcHkuY2FsbENvdW50ID4gMVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgb3RoZXJDb25zdW1lckRpc3Bvc2FibGUgPSBwaWdtZW50cy5jb25zdW1lQ29sb3JFeHByZXNzaW9uc1xuICAgICAgICAgICAgICBuYW1lOiAnYmFyJ1xuICAgICAgICAgICAgICByZWdleHBTdHJpbmc6ICdiYXpcXFxccysoXFxcXHcrKSdcbiAgICAgICAgICAgICAgaGFuZGxlOiAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gICAgICAgICAgICAgICAgW18sIGV4cHJdID0gbWF0Y2hcblxuICAgICAgICAgICAgICAgIGNvbG9yID0gY29udGV4dC5yZWFkQ29sb3IoZXhwcilcblxuICAgICAgICAgICAgICAgIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoY29sb3IpXG5cbiAgICAgICAgICAgICAgICBAcmdiYSA9IGNvbG9yLnJnYmFcblxuICAgICAgICAgICAgY29uc3VtZXJEaXNwb3NhYmxlID0gcGlnbWVudHMuY29uc3VtZUNvbG9yRXhwcmVzc2lvbnMoY29sb3JQcm92aWRlcilcblxuICAgICAgICAgICAgd2FpdHNGb3IgJ3ZhcmlhYmxlcyB1cGRhdGVkJywgLT4gdmFyaWFibGVTcHkuY2FsbENvdW50ID4gMlxuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg2KVxuICAgICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg2KVxuICAgICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZUJ5TmFtZSgnYmFyJykuY29sb3IuaW52YWxpZCkudG9CZUZhbHN5KClcblxuICAgICAgICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgICAgICAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgdXBkYXRlZCcsIC0+IHZhcmlhYmxlU3B5LmNhbGxDb3VudCA+IDNcblxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNSlcbiAgICAgICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVCeU5hbWUoJ2JhcicpLmNvbG9yLmludmFsaWQpLnRvQmVUcnV0aHkoKVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgICAjIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgIyMjIyMjXG5cbiAgZGVzY3JpYmUgJ3ZhcmlhYmxlIGV4cHJlc3Npb24gY29uc3VtZXInLCAtPlxuICAgIFt2YXJpYWJsZVByb3ZpZGVyLCBjb25zdW1lckRpc3Bvc2FibGUsIGVkaXRvciwgZWRpdG9yRWxlbWVudCwgY29sb3JCdWZmZXIsIGNvbG9yQnVmZmVyRWxlbWVudF0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgdmFyaWFibGVQcm92aWRlciA9XG4gICAgICAgIG5hbWU6ICd0b2RvJ1xuICAgICAgICByZWdleHBTdHJpbmc6ICcoVE9ETyk6XFxcXHMqKFteO1xcXFxuXSspJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgbGFiZWw6ICdwcm9qZWN0IGluaXRpYWxpemVkJywgLT5cbiAgICAgICAgcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgIGFmdGVyRWFjaCAtPiBjb25zdW1lckRpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuXG4gICAgaXQgJ3VwZGF0ZXMgdGhlIHByb2plY3QgdmFyaWFibGVzIHdoZW4gY29uc3VtZWQnLCAtPlxuICAgICAgdmFyaWFibGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS12YXJpYWJsZXMnKVxuXG4gICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKHZhcmlhYmxlU3B5KVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJywgWycqKi8qLnR4dCddXG5cbiAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgdXBkYXRlZCcsIC0+IHZhcmlhYmxlU3B5LmNhbGxDb3VudCA+IDFcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUgPSBwaWdtZW50cy5jb25zdW1lVmFyaWFibGVFeHByZXNzaW9ucyh2YXJpYWJsZVByb3ZpZGVyKVxuXG4gICAgICB3YWl0c0ZvciAndmFyaWFibGVzIHVwZGF0ZWQgYWZ0ZXIgc2VydmljZSBjb25zdW1lZCcsIC0+XG4gICAgICAgIHZhcmlhYmxlU3B5LmNhbGxDb3VudCA+IDJcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNylcbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgdXBkYXRlZCBhZnRlciBzZXJ2aWNlIGRpc3Bvc2VkJywgLT5cbiAgICAgICAgdmFyaWFibGVTcHkuY2FsbENvdW50ID4gM1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg2KVxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gYW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgaXMgcGFzc2VkJywgLT5cbiAgICAgIGl0ICd1cGRhdGVzIHRoZSBwcm9qZWN0IHZhcmlhYmxlcyB3aGVuIGNvbnN1bWVkJywgLT5cbiAgICAgICAgcHJldmlvdXNWYXJpYWJsZXNDb3VudCA9IG51bGxcbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKiovKi50eHQnXVxuXG4gICAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgaW5pdGlhbGl6ZWQnLCAtPlxuICAgICAgICAgIHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoIGlzIDQ1XG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHByZXZpb3VzVmFyaWFibGVzQ291bnQgPSBwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aFxuXG4gICAgICAgIHdhaXRzRm9yICd2YXJpYWJsZXMgdXBkYXRlZCcsIC0+XG4gICAgICAgICAgcHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGggaXMgNlxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNilcbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgICAgICAgcHJldmlvdXNWYXJpYWJsZXNDb3VudCA9IHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoXG5cbiAgICAgICAgICBjb25zdW1lckRpc3Bvc2FibGUgPSBwaWdtZW50cy5jb25zdW1lVmFyaWFibGVFeHByZXNzaW9ucyh7XG4gICAgICAgICAgICBleHByZXNzaW9uczogW3ZhcmlhYmxlUHJvdmlkZXJdXG4gICAgICAgICAgfSlcblxuICAgICAgICB3YWl0c0ZvciAndmFyaWFibGVzIHVwZGF0ZWQgYWZ0ZXIgc2VydmljZSBjb25zdW1lZCcsIC0+XG4gICAgICAgICAgcHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGggaXNudCBwcmV2aW91c1ZhcmlhYmxlc0NvdW50XG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg3KVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICAgICAgICBwcmV2aW91c1ZhcmlhYmxlc0NvdW50ID0gcHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGhcblxuICAgICAgICAgIGNvbnN1bWVyRGlzcG9zYWJsZS5kaXNwb3NlKClcblxuICAgICAgICB3YWl0c0ZvciAndmFyaWFibGVzIHVwZGF0ZWQgYWZ0ZXIgc2VydmljZSBkaXNwb3NlZCcsIC0+XG4gICAgICAgICAgcHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGggaXNudCBwcmV2aW91c1ZhcmlhYmxlc0NvdW50XG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg2KVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDQpXG4iXX0=

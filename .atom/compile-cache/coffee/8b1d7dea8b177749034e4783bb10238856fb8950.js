(function() {
  var ColorBufferElement, mousedown, path, sleep;

  path = require('path');

  require('./helpers/spec-helper');

  mousedown = require('./helpers/events').mousedown;

  ColorBufferElement = require('../lib/color-buffer-element');

  sleep = function(duration) {
    var t;
    t = new Date();
    return waitsFor(function() {
      return new Date() - t > duration;
    });
  };

  describe('ColorBufferElement', function() {
    var colorBuffer, colorBufferElement, editBuffer, editor, editorElement, getEditorDecorations, isVisible, jasmineContent, jsonFixture, pigments, project, ref;
    ref = [], editor = ref[0], editorElement = ref[1], colorBuffer = ref[2], pigments = ref[3], project = ref[4], colorBufferElement = ref[5], jasmineContent = ref[6];
    isVisible = function(decoration) {
      return !/-in-selection/.test(decoration.properties["class"]);
    };
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return advanceClock(500);
      }
    };
    jsonFixture = function(fixture, data) {
      var json, jsonPath;
      jsonPath = path.resolve(__dirname, 'fixtures', fixture);
      json = fs.readFileSync(jsonPath).toString();
      json = json.replace(/#\{(\w+)\}/g, function(m, w) {
        return data[w];
      });
      return JSON.parse(json);
    };
    getEditorDecorations = function(type) {
      return editor.getDecorations().filter(function(d) {
        return d.properties["class"].startsWith('pigments-native-background');
      });
    };
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmineContent = document.body.querySelector('#jasmine-content');
      jasmineContent.appendChild(workspaceElement);
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 40);
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          editor = o;
          return editorElement = atom.views.getView(editor);
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    return describe('when an editor is opened', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        colorBufferElement = atom.views.getView(colorBuffer);
        return colorBufferElement.attach();
      });
      it('is associated to the ColorBuffer model', function() {
        expect(colorBufferElement).toBeDefined();
        return expect(colorBufferElement.getModel()).toBe(colorBuffer);
      });
      it('attaches itself in the target text editor element', function() {
        expect(colorBufferElement.parentNode).toExist();
        return expect(editorElement.querySelector('.lines pigments-markers')).toExist();
      });
      describe('when the color buffer is initialized', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        it('creates markers views for every visible buffer marker', function() {
          return expect(getEditorDecorations('native-background').length).toEqual(3);
        });
        describe('when the project variables are initialized', function() {
          return it('creates markers for the new valid colors', function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(4);
            });
          });
        });
        describe('when a selection intersects a marker range', function() {
          beforeEach(function() {
            return spyOn(colorBufferElement, 'updateSelections').andCallThrough();
          });
          describe('after the markers views was created', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              runs(function() {
                return editor.setSelectedBufferRange([[2, 12], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            return it('hides the intersected marker', function() {
              var decorations;
              decorations = getEditorDecorations('native-background');
              expect(isVisible(decorations[0])).toBeTruthy();
              expect(isVisible(decorations[1])).toBeTruthy();
              expect(isVisible(decorations[2])).toBeTruthy();
              return expect(isVisible(decorations[3])).toBeFalsy();
            });
          });
          return describe('before all the markers views was created', function() {
            beforeEach(function() {
              runs(function() {
                return editor.setSelectedBufferRange([[0, 0], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            it('hides the existing markers', function() {
              var decorations;
              decorations = getEditorDecorations('native-background');
              expect(isVisible(decorations[0])).toBeFalsy();
              expect(isVisible(decorations[1])).toBeTruthy();
              return expect(isVisible(decorations[2])).toBeTruthy();
            });
            return describe('and the markers are updated', function() {
              beforeEach(function() {
                waitsForPromise('colors available', function() {
                  return colorBuffer.variablesAvailable();
                });
                return waitsFor('last marker visible', function() {
                  var decorations;
                  decorations = getEditorDecorations('native-background');
                  return isVisible(decorations[3]);
                });
              });
              return it('hides the created markers', function() {
                var decorations;
                decorations = getEditorDecorations('native-background');
                expect(isVisible(decorations[0])).toBeFalsy();
                expect(isVisible(decorations[1])).toBeTruthy();
                expect(isVisible(decorations[2])).toBeTruthy();
                return expect(isVisible(decorations[3])).toBeTruthy();
              });
            });
          });
        });
        describe('when some markers are destroyed', function() {
          var spy;
          spy = [][0];
          beforeEach(function() {
            var el, i, len, ref1;
            ref1 = colorBufferElement.usedMarkers;
            for (i = 0, len = ref1.length; i < len; i++) {
              el = ref1[i];
              spyOn(el, 'release').andCallThrough();
            }
            spy = jasmine.createSpy('did-update');
            colorBufferElement.onDidUpdate(spy);
            editBuffer('', {
              start: [4, 0],
              end: [8, 0]
            });
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('releases the unused markers', function() {
            return expect(getEditorDecorations('native-background').length).toEqual(2);
          });
        });
        describe('when the current pane is splitted to the right', function() {
          beforeEach(function() {
            var version;
            version = parseFloat(atom.getVersion().split('.').slice(1, 2).join('.'));
            if (version > 5) {
              atom.commands.dispatch(editorElement, 'pane:split-right-and-copy-active-item');
            } else {
              atom.commands.dispatch(editorElement, 'pane:split-right');
            }
            waitsFor('text editor', function() {
              return editor = atom.workspace.getTextEditors()[1];
            });
            waitsFor('color buffer element', function() {
              return colorBufferElement = atom.views.getView(project.colorBufferForEditor(editor));
            });
            return waitsFor('color buffer element markers', function() {
              return getEditorDecorations('native-background').length;
            });
          });
          return it('should keep all the buffer elements attached', function() {
            var editors;
            editors = atom.workspace.getTextEditors();
            return editors.forEach(function(editor) {
              editorElement = atom.views.getView(editor);
              colorBufferElement = editorElement.querySelector('pigments-markers');
              expect(colorBufferElement).toExist();
              return expect(getEditorDecorations('native-background').length).toEqual(4);
            });
          });
        });
        return describe('when the marker type is set to gutter', function() {
          var gutter;
          gutter = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.initialize();
            });
            return runs(function() {
              atom.config.set('pigments.markerType', 'gutter');
              return gutter = editorElement.querySelector('[gutter-name="pigments-gutter"]');
            });
          });
          it('removes the markers', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(0);
          });
          it('adds a custom gutter to the text editor', function() {
            return expect(gutter).toExist();
          });
          it('sets the size of the gutter based on the number of markers in the same row', function() {
            return expect(gutter.style.minWidth).toEqual('14px');
          });
          it('adds a gutter decoration for each color marker', function() {
            var decorations;
            decorations = editor.getDecorations().filter(function(d) {
              return d.properties.type === 'gutter';
            });
            return expect(decorations.length).toEqual(3);
          });
          describe('when the variables become available', function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
            });
            it('creates decorations for the new valid colors', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(4);
            });
            return describe('when many markers are added on the same line', function() {
              beforeEach(function() {
                var updateSpy;
                updateSpy = jasmine.createSpy('did-update');
                colorBufferElement.onDidUpdate(updateSpy);
                editor.moveToBottom();
                editBuffer('\nlist = #123456, #987654, #abcdef\n');
                return waitsFor(function() {
                  return updateSpy.callCount > 0;
                });
              });
              it('adds the new decorations to the gutter', function() {
                var decorations;
                decorations = editor.getDecorations().filter(function(d) {
                  return d.properties.type === 'gutter';
                });
                return expect(decorations.length).toEqual(7);
              });
              it('sets the size of the gutter based on the number of markers in the same row', function() {
                return expect(gutter.style.minWidth).toEqual('42px');
              });
              return describe('clicking on a gutter decoration', function() {
                beforeEach(function() {
                  var decoration;
                  project.colorPickerAPI = {
                    open: jasmine.createSpy('color-picker.open')
                  };
                  decoration = editorElement.querySelector('.pigments-gutter-marker span');
                  return mousedown(decoration);
                });
                it('selects the text in the editor', function() {
                  return expect(editor.getSelectedScreenRange()).toEqual([[0, 13], [0, 17]]);
                });
                return it('opens the color picker', function() {
                  return expect(project.colorPickerAPI.open).toHaveBeenCalled();
                });
              });
            });
          });
          describe('when the marker is changed again', function() {
            beforeEach(function() {
              return atom.config.set('pigments.markerType', 'native-background');
            });
            it('removes the gutter', function() {
              return expect(editorElement.querySelector('[gutter-name="pigments-gutter"]')).not.toExist();
            });
            return it('recreates the markers', function() {
              return expect(getEditorDecorations('native-background').length).toEqual(3);
            });
          });
          return describe('when a new buffer is opened', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return atom.workspace.open('project/styles/variables.styl').then(function(e) {
                  editor = e;
                  editorElement = atom.views.getView(editor);
                  colorBuffer = project.colorBufferForEditor(editor);
                  return colorBufferElement = atom.views.getView(colorBuffer);
                });
              });
              waitsForPromise(function() {
                return colorBuffer.initialize();
              });
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              return runs(function() {
                return gutter = editorElement.querySelector('[gutter-name="pigments-gutter"]');
              });
            });
            return it('creates the decorations in the new buffer gutter', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(10);
            });
          });
        });
      });
      describe('when the editor is moved to another pane', function() {
        var newPane, pane, ref1;
        ref1 = [], pane = ref1[0], newPane = ref1[1];
        beforeEach(function() {
          pane = atom.workspace.getActivePane();
          newPane = pane.splitDown({
            copyActiveItem: false
          });
          colorBuffer = project.colorBufferForEditor(editor);
          colorBufferElement = atom.views.getView(colorBuffer);
          pane.moveItemToPane(editor, newPane, 0);
          return waitsFor(function() {
            return getEditorDecorations('native-background').length;
          });
        });
        return it('moves the editor with the buffer to the new pane', function() {
          return expect(getEditorDecorations('native-background').length).toEqual(3);
        });
      });
      describe('when pigments.supportedFiletypes settings is defined', function() {
        var loadBuffer;
        loadBuffer = function(filePath) {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        };
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('language-less');
          });
        });
        describe('with the default wildcard', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['*']);
          });
          return it('supports every filetype', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(20);
            });
          });
        });
        describe('with a filetype', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['coffee']);
          });
          return it('supports the specified file type', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(0);
            });
          });
        });
        return describe('with many filetypes', function() {
          beforeEach(function() {
            atom.config.set('pigments.supportedFiletypes', ['coffee']);
            return project.setSupportedFiletypes(['less']);
          });
          it('supports the specified file types', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(20);
            });
            loadBuffer('four-variables.styl');
            return runs(function() {
              return expect(getEditorDecorations('native-background').length).toEqual(0);
            });
          });
          return describe('with global file types ignored', function() {
            beforeEach(function() {
              atom.config.set('pigments.supportedFiletypes', ['coffee']);
              project.setIgnoreGlobalSupportedFiletypes(true);
              return project.setSupportedFiletypes(['less']);
            });
            return it('supports the specified file types', function() {
              loadBuffer('scope-filter.coffee');
              runs(function() {
                return expect(getEditorDecorations('native-background').length).toEqual(0);
              });
              loadBuffer('project/vendor/css/variables.less');
              runs(function() {
                return expect(getEditorDecorations('native-background').length).toEqual(20);
              });
              loadBuffer('four-variables.styl');
              return runs(function() {
                return expect(getEditorDecorations('native-background').length).toEqual(0);
              });
            });
          });
        });
      });
      return describe('when pigments.ignoredScopes settings is defined', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          waitsForPromise(function() {
            return atom.workspace.open('scope-filter.coffee').then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        describe('with one filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(getEditorDecorations('native-background').length).toEqual(1);
          });
        });
        describe('with two filters', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.string', '\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(getEditorDecorations('native-background').length).toEqual(0);
          });
        });
        describe('with an invalid filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\']);
          });
          return it('ignores the filter', function() {
            return expect(getEditorDecorations('native-background').length).toEqual(2);
          });
        });
        return describe('when the project ignoredScopes is defined', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.string']);
            return project.setIgnoredScopes(['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(getEditorDecorations('native-background').length).toEqual(0);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWJ1ZmZlci1lbGVtZW50LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsT0FBQSxDQUFRLHVCQUFSOztFQUNDLFlBQWEsT0FBQSxDQUFRLGtCQUFSOztFQUVkLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFckIsS0FBQSxHQUFRLFNBQUMsUUFBRDtBQUNOLFFBQUE7SUFBQSxDQUFBLEdBQVEsSUFBQSxJQUFBLENBQUE7V0FDUixRQUFBLENBQVMsU0FBQTthQUFPLElBQUEsSUFBQSxDQUFBLENBQUosR0FBYSxDQUFiLEdBQWlCO0lBQXBCLENBQVQ7RUFGTTs7RUFJUixRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtBQUM3QixRQUFBO0lBQUEsTUFBOEYsRUFBOUYsRUFBQyxlQUFELEVBQVMsc0JBQVQsRUFBd0Isb0JBQXhCLEVBQXFDLGlCQUFyQyxFQUErQyxnQkFBL0MsRUFBd0QsMkJBQXhELEVBQTRFO0lBRTVFLFNBQUEsR0FBWSxTQUFDLFVBQUQ7YUFDVixDQUFJLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixVQUFVLENBQUMsVUFBVSxFQUFDLEtBQUQsRUFBMUM7SUFETTtJQUdaLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxPQUFQO0FBQ1gsVUFBQTs7UUFEa0IsVUFBUTs7TUFDMUIsSUFBRyxxQkFBSDtRQUNFLElBQUcsbUJBQUg7VUFDRSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxFQUFnQixPQUFPLENBQUMsR0FBeEIsRUFEVjtTQUFBLE1BQUE7VUFHRSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxFQUFnQixPQUFPLENBQUMsS0FBeEIsRUFIVjs7UUFLQSxNQUFNLENB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Uyx3QkFBVCxFQUFtQyxTQUFBO1VBQ2pDLFVBQUEsQ0FBVyxTQUFBO21CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsQ0FBQyxJQUFELENBQTFDO1VBRFMsQ0FBWDtpQkFHQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQTttQkFDdkIsTUFBQSxDQUFPLG9CQUFBLENBQXFCLG1CQUFyQixDQUF5QyxDQUFDLE1BQWpELENBQXdELENBQUMsT0FBekQsQ0FBaUUsQ0FBakU7VUFEdUIsQ0FBekI7UUFKaUMsQ0FBbkM7ZUFPQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQTtVQUNwRCxVQUFBLENBQVcsU0FBQTtZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsQ0FBQyxXQUFELENBQTFDO21CQUNBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixDQUFDLFlBQUQsQ0FBekI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO21CQUN2RCxNQUFBLENBQU8sb0JBQUEsQ0FBcUIsbUJBQXJCLENBQXlDLENBQUMsTUFBakQsQ0FBd0QsQ0FBQyxPQUF6RCxDQUFpRSxDQUFqRTtVQUR1RCxDQUF6RDtRQUxvRCxDQUF0RDtNQXBDMEQsQ0FBNUQ7SUFqVG1DLENBQXJDO0VBekQ2QixDQUEvQjtBQVZBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5yZXF1aXJlICcuL2hlbHBlcnMvc3BlYy1oZWxwZXInXG57bW91c2Vkb3dufSA9IHJlcXVpcmUgJy4vaGVscGVycy9ldmVudHMnXG5cbkNvbG9yQnVmZmVyRWxlbWVudCA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1idWZmZXItZWxlbWVudCdcblxuc2xlZXAgPSAoZHVyYXRpb24pIC0+XG4gIHQgPSBuZXcgRGF0ZSgpXG4gIHdhaXRzRm9yIC0+IG5ldyBEYXRlKCkgLSB0ID4gZHVyYXRpb25cblxuZGVzY3JpYmUgJ0NvbG9yQnVmZmVyRWxlbWVudCcsIC0+XG4gIFtlZGl0b3IsIGVkaXRvckVsZW1lbnQsIGNvbG9yQnVmZmVyLCBwaWdtZW50cywgcHJvamVjdCwgY29sb3JCdWZmZXJFbGVtZW50LCBqYXNtaW5lQ29udGVudF0gPSBbXVxuXG4gIGlzVmlzaWJsZSA9IChkZWNvcmF0aW9uKSAtPlxuICAgIG5vdCAvLWluLXNlbGVjdGlvbi8udGVzdCBkZWNvcmF0aW9uLnByb3BlcnRpZXMuY2xhc3NcblxuICBlZGl0QnVmZmVyID0gKHRleHQsIG9wdGlvbnM9e30pIC0+XG4gICAgaWYgb3B0aW9ucy5zdGFydD9cbiAgICAgIGlmIG9wdGlvbnMuZW5kP1xuICAgICAgICByYW5nZSA9IFtvcHRpb25zLnN0YXJ0LCBvcHRpb25zLmVuZF1cbiAgICAgIGVsc2VcbiAgICAgICAgcmFuZ2UgPSBbb3B0aW9ucy5zdGFydCwgb3B0aW9ucy5zdGFydF1cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG5cbiAgICBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0KVxuICAgIGFkdmFuY2VDbG9jayg1MDApIHVubGVzcyBvcHRpb25zLm5vRXZlbnRcblxuICBqc29uRml4dHVyZSA9IChmaXh0dXJlLCBkYXRhKSAtPlxuICAgIGpzb25QYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgZml4dHVyZSlcbiAgICBqc29uID0gZnMucmVhZEZpbGVTeW5jKGpzb25QYXRoKS50b1N0cmluZygpXG4gICAganNvbiA9IGpzb24ucmVwbGFjZSAvI1xceyhcXHcrKVxcfS9nLCAobSx3KSAtPiBkYXRhW3ddXG5cbiAgICBKU09OLnBhcnNlKGpzb24pXG5cbiAgZ2V0RWRpdG9yRGVjb3JhdGlvbnMgPSAodHlwZSkgLT5cbiAgICBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoKVxuICAgIC5maWx0ZXIoKGQpIC0+IGQucHJvcGVydGllcy5jbGFzcy5zdGFydHNXaXRoICdwaWdtZW50cy1uYXRpdmUtYmFja2dyb3VuZCcpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZUNvbnRlbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNqYXNtaW5lLWNvbnRlbnQnKVxuXG4gICAgamFzbWluZUNvbnRlbnQuYXBwZW5kQ2hpbGQod29ya3NwYWNlRWxlbWVudClcblxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnNvZnRXcmFwJywgdHJ1ZVxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoJywgdHJ1ZVxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCA0MFxuXG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5kZWxheUJlZm9yZVNjYW4nLCAwXG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtcbiAgICAgICcqLnN0eWwnXG4gICAgICAnKi5sZXNzJ1xuICAgIF1cblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignZm91ci12YXJpYWJsZXMuc3R5bCcpLnRoZW4gKG8pIC0+XG4gICAgICAgIGVkaXRvciA9IG9cbiAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3BpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgcGlnbWVudHMgPSBwa2cubWFpbk1vZHVsZVxuICAgICAgcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGNvbG9yQnVmZmVyPy5kZXN0cm95KClcblxuICBkZXNjcmliZSAnd2hlbiBhbiBlZGl0b3IgaXMgb3BlbmVkJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuICAgICAgY29sb3JCdWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICBpdCAnaXMgYXNzb2NpYXRlZCB0byB0aGUgQ29sb3JCdWZmZXIgbW9kZWwnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5nZXRNb2RlbCgpKS50b0JlKGNvbG9yQnVmZmVyKVxuXG4gICAgaXQgJ2F0dGFjaGVzIGl0c2VsZiBpbiB0aGUgdGFyZ2V0IHRleHQgZWRpdG9yIGVsZW1lbnQnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5wYXJlbnROb2RlKS50b0V4aXN0KClcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saW5lcyBwaWdtZW50cy1tYXJrZXJzJykpLnRvRXhpc3QoKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGNvbG9yIGJ1ZmZlciBpcyBpbml0aWFsaXplZCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci5pbml0aWFsaXplKClcblxuICAgICAgaXQgJ2NyZWF0ZXMgbWFya2VycyB2aWV3cyBmb3IgZXZlcnkgdmlzaWJsZSBidWZmZXIgbWFya2VyJywgLT5cbiAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgzKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgcHJvamVjdCB2YXJpYWJsZXMgYXJlIGluaXRpYWxpemVkJywgLT5cbiAgICAgICAgaXQgJ2NyZWF0ZXMgbWFya2VycyBmb3IgdGhlIG5ldyB2YWxpZCBjb2xvcnMnLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSBzZWxlY3Rpb24gaW50ZXJzZWN0cyBhIG1hcmtlciByYW5nZScsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBzcHlPbihjb2xvckJ1ZmZlckVsZW1lbnQsICd1cGRhdGVTZWxlY3Rpb25zJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIGRlc2NyaWJlICdhZnRlciB0aGUgbWFya2VycyB2aWV3cyB3YXMgY3JlYXRlZCcsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG4gICAgICAgICAgICBydW5zIC0+IGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlIFtbMiwxMl0sWzIsIDE0XV1cbiAgICAgICAgICAgIHdhaXRzRm9yIC0+IGNvbG9yQnVmZmVyRWxlbWVudC51cGRhdGVTZWxlY3Rpb25zLmNhbGxDb3VudCA+IDBcblxuICAgICAgICAgIGl0ICdoaWRlcyB0aGUgaW50ZXJzZWN0ZWQgbWFya2VyJywgLT5cbiAgICAgICAgICAgIGRlY29yYXRpb25zID0gZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJylcblxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1swXSkpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1sxXSkpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1syXSkpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1szXSkpLnRvQmVGYWxzeSgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ2JlZm9yZSBhbGwgdGhlIG1hcmtlcnMgdmlld3Mgd2FzIGNyZWF0ZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHJ1bnMgLT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UgW1swLDBdLFsyLCAxNF1dXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlckVsZW1lbnQudXBkYXRlU2VsZWN0aW9ucy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBpdCAnaGlkZXMgdGhlIGV4aXN0aW5nIG1hcmtlcnMnLCAtPlxuICAgICAgICAgICAgZGVjb3JhdGlvbnMgPSBnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKVxuXG4gICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKGRlY29yYXRpb25zWzBdKSkudG9CZUZhbHN5KClcbiAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUoZGVjb3JhdGlvbnNbMV0pKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUoZGVjb3JhdGlvbnNbMl0pKS50b0JlVHJ1dGh5KClcblxuICAgICAgICAgIGRlc2NyaWJlICdhbmQgdGhlIG1hcmtlcnMgYXJlIHVwZGF0ZWQnLCAtPlxuICAgICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgJ2NvbG9ycyBhdmFpbGFibGUnLCAtPlxuICAgICAgICAgICAgICAgIGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG4gICAgICAgICAgICAgIHdhaXRzRm9yICdsYXN0IG1hcmtlciB2aXNpYmxlJywgLT5cbiAgICAgICAgICAgICAgICBkZWNvcmF0aW9ucyA9IGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpXG4gICAgICAgICAgICAgICAgaXNWaXNpYmxlKGRlY29yYXRpb25zWzNdKVxuXG4gICAgICAgICAgICBpdCAnaGlkZXMgdGhlIGNyZWF0ZWQgbWFya2VycycsIC0+XG4gICAgICAgICAgICAgIGRlY29yYXRpb25zID0gZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJylcbiAgICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1swXSkpLnRvQmVGYWxzeSgpXG4gICAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUoZGVjb3JhdGlvbnNbMV0pKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShkZWNvcmF0aW9uc1syXSkpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKGRlY29yYXRpb25zWzNdKSkudG9CZVRydXRoeSgpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIHNvbWUgbWFya2VycyBhcmUgZGVzdHJveWVkJywgLT5cbiAgICAgICAgW3NweV0gPSBbXVxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZm9yIGVsIGluIGNvbG9yQnVmZmVyRWxlbWVudC51c2VkTWFya2Vyc1xuICAgICAgICAgICAgc3B5T24oZWwsICdyZWxlYXNlJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUnKVxuICAgICAgICAgIGNvbG9yQnVmZmVyRWxlbWVudC5vbkRpZFVwZGF0ZShzcHkpXG4gICAgICAgICAgZWRpdEJ1ZmZlciAnJywgc3RhcnQ6IFs0LDBdLCBlbmQ6IFs4LDBdXG4gICAgICAgICAgd2FpdHNGb3IgLT4gc3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAncmVsZWFzZXMgdGhlIHVudXNlZCBtYXJrZXJzJywgLT5cbiAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBjdXJyZW50IHBhbmUgaXMgc3BsaXR0ZWQgdG8gdGhlIHJpZ2h0JywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHZlcnNpb24gPSBwYXJzZUZsb2F0KGF0b20uZ2V0VmVyc2lvbigpLnNwbGl0KCcuJykuc2xpY2UoMSwyKS5qb2luKCcuJykpXG4gICAgICAgICAgaWYgdmVyc2lvbiA+IDVcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgJ3BhbmU6c3BsaXQtcmlnaHQtYW5kLWNvcHktYWN0aXZlLWl0ZW0nKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgJ3BhbmU6c3BsaXQtcmlnaHQnKVxuXG4gICAgICAgICAgd2FpdHNGb3IgJ3RleHQgZWRpdG9yJywgLT5cbiAgICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClbMV1cblxuICAgICAgICAgIHdhaXRzRm9yICdjb2xvciBidWZmZXIgZWxlbWVudCcsIC0+XG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcocHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpKVxuICAgICAgICAgIHdhaXRzRm9yICdjb2xvciBidWZmZXIgZWxlbWVudCBtYXJrZXJzJywgLT5cbiAgICAgICAgICAgIGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aFxuXG4gICAgICAgIGl0ICdzaG91bGQga2VlcCBhbGwgdGhlIGJ1ZmZlciBlbGVtZW50cyBhdHRhY2hlZCcsIC0+XG4gICAgICAgICAgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgICAgICAgIGVkaXRvcnMuZm9yRWFjaCAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3BpZ21lbnRzLW1hcmtlcnMnKVxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudCkudG9FeGlzdCgpXG5cbiAgICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gdGhlIG1hcmtlciB0eXBlIGlzIHNldCB0byBndXR0ZXInLCAtPlxuICAgICAgICBbZ3V0dGVyXSA9IFtdXG5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci5pbml0aWFsaXplKClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLm1hcmtlclR5cGUnLCAnZ3V0dGVyJ1xuICAgICAgICAgICAgZ3V0dGVyID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbZ3V0dGVyLW5hbWU9XCJwaWdtZW50cy1ndXR0ZXJcIl0nKVxuXG4gICAgICAgIGl0ICdyZW1vdmVzIHRoZSBtYXJrZXJzJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICAgIGl0ICdhZGRzIGEgY3VzdG9tIGd1dHRlciB0byB0aGUgdGV4dCBlZGl0b3InLCAtPlxuICAgICAgICAgIGV4cGVjdChndXR0ZXIpLnRvRXhpc3QoKVxuXG4gICAgICAgIGl0ICdzZXRzIHRoZSBzaXplIG9mIHRoZSBndXR0ZXIgYmFzZWQgb24gdGhlIG51bWJlciBvZiBtYXJrZXJzIGluIHRoZSBzYW1lIHJvdycsIC0+XG4gICAgICAgICAgZXhwZWN0KGd1dHRlci5zdHlsZS5taW5XaWR0aCkudG9FcXVhbCgnMTRweCcpXG5cbiAgICAgICAgaXQgJ2FkZHMgYSBndXR0ZXIgZGVjb3JhdGlvbiBmb3IgZWFjaCBjb2xvciBtYXJrZXInLCAtPlxuICAgICAgICAgIGRlY29yYXRpb25zID0gZWRpdG9yLmdldERlY29yYXRpb25zKCkuZmlsdGVyIChkKSAtPlxuICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLnR5cGUgaXMgJ2d1dHRlcidcbiAgICAgICAgICBleHBlY3QoZGVjb3JhdGlvbnMubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3doZW4gdGhlIHZhcmlhYmxlcyBiZWNvbWUgYXZhaWxhYmxlJywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgICAgIGl0ICdjcmVhdGVzIGRlY29yYXRpb25zIGZvciB0aGUgbmV3IHZhbGlkIGNvbG9ycycsIC0+XG4gICAgICAgICAgICBkZWNvcmF0aW9ucyA9IGVkaXRvci5nZXREZWNvcmF0aW9ucygpLmZpbHRlciAoZCkgLT5cbiAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLnR5cGUgaXMgJ2d1dHRlcidcbiAgICAgICAgICAgIGV4cGVjdChkZWNvcmF0aW9ucy5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgICAgIGRlc2NyaWJlICd3aGVuIG1hbnkgbWFya2VycyBhcmUgYWRkZWQgb24gdGhlIHNhbWUgbGluZScsIC0+XG4gICAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICAgIHVwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlJylcbiAgICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50Lm9uRGlkVXBkYXRlKHVwZGF0ZVNweSlcblxuICAgICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgICAgZWRpdEJ1ZmZlciAnXFxubGlzdCA9ICMxMjM0NTYsICM5ODc2NTQsICNhYmNkZWZcXG4nXG4gICAgICAgICAgICAgIHdhaXRzRm9yIC0+IHVwZGF0ZVNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICAgIGl0ICdhZGRzIHRoZSBuZXcgZGVjb3JhdGlvbnMgdG8gdGhlIGd1dHRlcicsIC0+XG4gICAgICAgICAgICAgIGRlY29yYXRpb25zID0gZWRpdG9yLmdldERlY29yYXRpb25zKCkuZmlsdGVyIChkKSAtPlxuICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy50eXBlIGlzICdndXR0ZXInXG5cbiAgICAgICAgICAgICAgZXhwZWN0KGRlY29yYXRpb25zLmxlbmd0aCkudG9FcXVhbCg3KVxuXG4gICAgICAgICAgICBpdCAnc2V0cyB0aGUgc2l6ZSBvZiB0aGUgZ3V0dGVyIGJhc2VkIG9uIHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgc2FtZSByb3cnLCAtPlxuICAgICAgICAgICAgICBleHBlY3QoZ3V0dGVyLnN0eWxlLm1pbldpZHRoKS50b0VxdWFsKCc0MnB4JylcblxuICAgICAgICAgICAgZGVzY3JpYmUgJ2NsaWNraW5nIG9uIGEgZ3V0dGVyIGRlY29yYXRpb24nLCAtPlxuICAgICAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICAgICAgcHJvamVjdC5jb2xvclBpY2tlckFQSSA9XG4gICAgICAgICAgICAgICAgICBvcGVuOiBqYXNtaW5lLmNyZWF0ZVNweSgnY29sb3ItcGlja2VyLm9wZW4nKVxuXG4gICAgICAgICAgICAgICAgZGVjb3JhdGlvbiA9IGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpZ21lbnRzLWd1dHRlci1tYXJrZXIgc3BhbicpXG4gICAgICAgICAgICAgICAgbW91c2Vkb3duKGRlY29yYXRpb24pXG5cbiAgICAgICAgICAgICAgaXQgJ3NlbGVjdHMgdGhlIHRleHQgaW4gdGhlIGVkaXRvcicsIC0+XG4gICAgICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwoW1swLDEzXSxbMCwxN11dKVxuXG4gICAgICAgICAgICAgIGl0ICdvcGVucyB0aGUgY29sb3IgcGlja2VyJywgLT5cbiAgICAgICAgICAgICAgICBleHBlY3QocHJvamVjdC5jb2xvclBpY2tlckFQSS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICBkZXNjcmliZSAnd2hlbiB0aGUgbWFya2VyIGlzIGNoYW5nZWQgYWdhaW4nLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMubWFya2VyVHlwZScsICduYXRpdmUtYmFja2dyb3VuZCdcblxuICAgICAgICAgIGl0ICdyZW1vdmVzIHRoZSBndXR0ZXInLCAtPlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignW2d1dHRlci1uYW1lPVwicGlnbWVudHMtZ3V0dGVyXCJdJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgICAgIGl0ICdyZWNyZWF0ZXMgdGhlIG1hcmtlcnMnLCAtPlxuICAgICAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgzKVxuXG4gICAgICAgIGRlc2NyaWJlICd3aGVuIGEgbmV3IGJ1ZmZlciBpcyBvcGVuZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdwcm9qZWN0L3N0eWxlcy92YXJpYWJsZXMuc3R5bCcpLnRoZW4gKGUpIC0+XG4gICAgICAgICAgICAgICAgZWRpdG9yID0gZVxuICAgICAgICAgICAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICAgICAgICAgIGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBndXR0ZXIgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tndXR0ZXItbmFtZT1cInBpZ21lbnRzLWd1dHRlclwiXScpXG5cbiAgICAgICAgICBpdCAnY3JlYXRlcyB0aGUgZGVjb3JhdGlvbnMgaW4gdGhlIG5ldyBidWZmZXIgZ3V0dGVyJywgLT5cbiAgICAgICAgICAgIGRlY29yYXRpb25zID0gZWRpdG9yLmdldERlY29yYXRpb25zKCkuZmlsdGVyIChkKSAtPlxuICAgICAgICAgICAgICBkLnByb3BlcnRpZXMudHlwZSBpcyAnZ3V0dGVyJ1xuXG4gICAgICAgICAgICBleHBlY3QoZGVjb3JhdGlvbnMubGVuZ3RoKS50b0VxdWFsKDEwKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGVkaXRvciBpcyBtb3ZlZCB0byBhbm90aGVyIHBhbmUnLCAtPlxuICAgICAgW3BhbmUsIG5ld1BhbmVdID0gW11cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBuZXdQYW5lID0gcGFuZS5zcGxpdERvd24oY29weUFjdGl2ZUl0ZW06IGZhbHNlKVxuICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoY29sb3JCdWZmZXIpXG5cbiAgICAgICAgcGFuZS5tb3ZlSXRlbVRvUGFuZShlZGl0b3IsIG5ld1BhbmUsIDApXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGhcblxuICAgICAgaXQgJ21vdmVzIHRoZSBlZGl0b3Igd2l0aCB0aGUgYnVmZmVyIHRvIHRoZSBuZXcgcGFuZScsIC0+XG4gICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgIGRlc2NyaWJlICd3aGVuIHBpZ21lbnRzLnN1cHBvcnRlZEZpbGV0eXBlcyBzZXR0aW5ncyBpcyBkZWZpbmVkJywgLT5cbiAgICAgIGxvYWRCdWZmZXIgPSAoZmlsZVBhdGgpIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICBlZGl0b3IgPSBvXG4gICAgICAgICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoY29sb3JCdWZmZXIpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQuYXR0YWNoKClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1jb2ZmZWUtc2NyaXB0JylcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWxlc3MnKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCB0aGUgZGVmYXVsdCB3aWxkY2FyZCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnN1cHBvcnRlZEZpbGV0eXBlcycsIFsnKiddXG5cbiAgICAgICAgaXQgJ3N1cHBvcnRzIGV2ZXJ5IGZpbGV0eXBlJywgLT5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdzY29wZS1maWx0ZXIuY29mZmVlJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdwcm9qZWN0L3ZlbmRvci9jc3MvdmFyaWFibGVzLmxlc3MnKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoMjApXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGEgZmlsZXR5cGUnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCBbJ2NvZmZlZSddXG5cbiAgICAgICAgaXQgJ3N1cHBvcnRzIHRoZSBzcGVjaWZpZWQgZmlsZSB0eXBlJywgLT5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdzY29wZS1maWx0ZXIuY29mZmVlJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdwcm9qZWN0L3ZlbmRvci9jc3MvdmFyaWFibGVzLmxlc3MnKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAgICAgZGVzY3JpYmUgJ3dpdGggbWFueSBmaWxldHlwZXMnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCBbJ2NvZmZlZSddXG4gICAgICAgICAgcHJvamVjdC5zZXRTdXBwb3J0ZWRGaWxldHlwZXMoWydsZXNzJ10pXG5cbiAgICAgICAgaXQgJ3N1cHBvcnRzIHRoZSBzcGVjaWZpZWQgZmlsZSB0eXBlcycsIC0+XG4gICAgICAgICAgbG9hZEJ1ZmZlcignc2NvcGUtZmlsdGVyLmNvZmZlZScpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgICAgbG9hZEJ1ZmZlcigncHJvamVjdC92ZW5kb3IvY3NzL3ZhcmlhYmxlcy5sZXNzJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDIwKVxuXG4gICAgICAgICAgbG9hZEJ1ZmZlcignZm91ci12YXJpYWJsZXMuc3R5bCcpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICAgIGRlc2NyaWJlICd3aXRoIGdsb2JhbCBmaWxlIHR5cGVzIGlnbm9yZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc3VwcG9ydGVkRmlsZXR5cGVzJywgWydjb2ZmZWUnXVxuICAgICAgICAgICAgcHJvamVjdC5zZXRJZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXModHJ1ZSlcbiAgICAgICAgICAgIHByb2plY3Quc2V0U3VwcG9ydGVkRmlsZXR5cGVzKFsnbGVzcyddKVxuXG4gICAgICAgICAgaXQgJ3N1cHBvcnRzIHRoZSBzcGVjaWZpZWQgZmlsZSB0eXBlcycsIC0+XG4gICAgICAgICAgICBsb2FkQnVmZmVyKCdzY29wZS1maWx0ZXIuY29mZmVlJylcbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICAgICAgICBsb2FkQnVmZmVyKCdwcm9qZWN0L3ZlbmRvci9jc3MvdmFyaWFibGVzLmxlc3MnKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDIwKVxuXG4gICAgICAgICAgICBsb2FkQnVmZmVyKCdmb3VyLXZhcmlhYmxlcy5zdHlsJylcbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KGdldEVkaXRvckRlY29yYXRpb25zKCduYXRpdmUtYmFja2dyb3VuZCcpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gcGlnbWVudHMuaWdub3JlZFNjb3BlcyBzZXR0aW5ncyBpcyBkZWZpbmVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWNvZmZlZS1zY3JpcHQnKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3Njb3BlLWZpbHRlci5jb2ZmZWUnKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgZWRpdG9yID0gb1xuICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBvbmUgZmlsdGVyJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXC5jb21tZW50J10pXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbG9ycyB0aGF0IG1hdGNoZXMgdGhlIGRlZmluZWQgc2NvcGVzJywgLT5cbiAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIHR3byBmaWx0ZXJzJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXC5zdHJpbmcnLCAnXFxcXC5jb21tZW50J10pXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbG9ycyB0aGF0IG1hdGNoZXMgdGhlIGRlZmluZWQgc2NvcGVzJywgLT5cbiAgICAgICAgICBleHBlY3QoZ2V0RWRpdG9yRGVjb3JhdGlvbnMoJ25hdGl2ZS1iYWNrZ3JvdW5kJykubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGFuIGludmFsaWQgZmlsdGVyJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXCddKVxuXG4gICAgICAgIGl0ICdpZ25vcmVzIHRoZSBmaWx0ZXInLCAtPlxuICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gdGhlIHByb2plY3QgaWdub3JlZFNjb3BlcyBpcyBkZWZpbmVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXC5zdHJpbmcnXSlcbiAgICAgICAgICBwcm9qZWN0LnNldElnbm9yZWRTY29wZXMoWydcXFxcLmNvbW1lbnQnXSlcblxuICAgICAgICBpdCAnaWdub3JlcyB0aGUgY29sb3JzIHRoYXQgbWF0Y2hlcyB0aGUgZGVmaW5lZCBzY29wZXMnLCAtPlxuICAgICAgICAgIGV4cGVjdChnZXRFZGl0b3JEZWNvcmF0aW9ucygnbmF0aXZlLWJhY2tncm91bmQnKS5sZW5ndGgpLnRvRXF1YWwoMClcbiJdfQ==

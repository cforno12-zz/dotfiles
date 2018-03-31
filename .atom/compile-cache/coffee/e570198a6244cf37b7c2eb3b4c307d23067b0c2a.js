(function() {
  var ColorBuffer, jsonFixture, path, registry,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  ColorBuffer = require('../lib/color-buffer');

  registry = require('../lib/color-expressions');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  describe('ColorBuffer', function() {
    var colorBuffer, editBuffer, editor, pigments, project, ref, sleep;
    ref = [], editor = ref[0], colorBuffer = ref[1], pigments = ref[2], project = ref[3];
    sleep = function(ms) {
      var start;
      start = new Date;
      return function() {
        return new Date - start >= ms;
      };
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
    beforeEach(function() {
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.ignoredBufferNames', []);
      atom.config.set('pigments.filetypesForColorWords', ['*']);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          return editor = o;
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        })["catch"](function(err) {
          return console.error(err);
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    it('creates a color buffer for each editor in the workspace', function() {
      return expect(project.colorBuffersByEditorId[editor.id]).toBeDefined();
    });
    describe('when the file path matches an entry in ignoredBufferNames', function() {
      beforeEach(function() {
        expect(project.hasColorBufferForEditor(editor)).toBeTruthy();
        return atom.config.set('pigments.ignoredBufferNames', ['**/*.styl']);
      });
      it('destroys the color buffer for this file', function() {
        return expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
      });
      it('recreates the color buffer when the settings no longer ignore the file', function() {
        expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
        atom.config.set('pigments.ignoredBufferNames', []);
        return expect(project.hasColorBufferForEditor(editor)).toBeTruthy();
      });
      return it('prevents the creation of a new color buffer', function() {
        waitsForPromise(function() {
          return atom.workspace.open('variables.styl').then(function(o) {
            return editor = o;
          });
        });
        return runs(function() {
          return expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
        });
      });
    });
    describe('when an editor with a path is not in the project paths is opened', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return project.getPaths() != null;
        });
      });
      describe('when the file is already saved on disk', function() {
        var pathToOpen;
        pathToOpen = null;
        beforeEach(function() {
          return pathToOpen = project.paths.shift();
        });
        return it('adds the path to the project immediately', function() {
          spyOn(project, 'appendPath');
          waitsForPromise(function() {
            return atom.workspace.open(pathToOpen).then(function(o) {
              editor = o;
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          return runs(function() {
            return expect(project.appendPath).toHaveBeenCalledWith(pathToOpen);
          });
        });
      });
      return describe('when the file is not yet saved on disk', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('foo-de-fafa.styl').then(function(o) {
              editor = o;
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('does not fails when updating the colorBuffer', function() {
          return expect(function() {
            return colorBuffer.update();
          }).not.toThrow();
        });
        return it('adds the path to the project paths on save', function() {
          spyOn(colorBuffer, 'update').andCallThrough();
          spyOn(project, 'appendPath');
          editor.getBuffer().emitter.emit('did-save', {
            path: editor.getPath()
          });
          waitsFor(function() {
            return colorBuffer.update.callCount > 0;
          });
          return runs(function() {
            return expect(project.appendPath).toHaveBeenCalledWith(editor.getPath());
          });
        });
      });
    });
    describe('when an editor without path is opened', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open().then(function(o) {
            editor = o;
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('does not fails when updating the colorBuffer', function() {
        return expect(function() {
          return colorBuffer.update();
        }).not.toThrow();
      });
      return describe('when the file is saved and aquires a path', function() {
        describe('that is legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('adds the path to the project paths', function() {
            return expect(indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeTruthy();
          });
        });
        describe('that is not legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.sass');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
        return describe('that is ignored', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('project/vendor/new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
      });
    });
    describe('with rapid changes that triggers a rescan', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        waitsFor(function() {
          return colorBuffer.initialized && colorBuffer.variableInitialized;
        });
        runs(function() {
          spyOn(colorBuffer, 'terminateRunningTask').andCallThrough();
          spyOn(colorBuffer, 'updateColorMarkers').andCallThrough();
          spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          editor.moveToBottom();
          editor.insertText('#fff\n');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
        waitsFor(function() {
          return colorBuffer.scanBufferForVariables.callCount > 0;
        });
        return runs(function() {
          return editor.insertText(' ');
        });
      });
      return it('terminates the currently running task', function() {
        return expect(colorBuffer.terminateRunningTask).toHaveBeenCalled();
      });
    });
    describe('when created without a previous state', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it('scans the buffer for colors without waiting for the project variables', function() {
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        return expect(colorBuffer.getValidColorMarkers().length).toEqual(3);
      });
      it('creates the corresponding markers in the text editor', function() {
        return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
      });
      it('knows that it is legible as a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      describe('when the editor is destroyed', function() {
        return it('destroys the color buffer at the same time', function() {
          editor.destroy();
          return expect(project.colorBuffersByEditorId[editor.id]).toBeUndefined();
        });
      });
      describe('::getColorMarkerAtBufferPosition', function() {
        describe('when the buffer position is contained in a marker range', function() {
          return it('returns the corresponding color marker', function() {
            var colorMarker;
            colorMarker = colorBuffer.getColorMarkerAtBufferPosition([2, 15]);
            return expect(colorMarker).toEqual(colorBuffer.colorMarkers[1]);
          });
        });
        return describe('when the buffer position is not contained in a marker range', function() {
          return it('returns undefined', function() {
            return expect(colorBuffer.getColorMarkerAtBufferPosition([1, 15])).toBeUndefined();
          });
        });
      });
      describe('when the project variables becomes available', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('replaces the invalid markers that are now valid', function() {
          expect(colorBuffer.getValidColorMarkers().length).toEqual(4);
          expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          return expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
        });
        describe('when a variable is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            return editBuffer('#336699', {
              start: [0, 13],
              end: [0, 17]
            });
          });
          return it('updates the modified colors', function() {
            waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
            return runs(function() {
              expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(2);
              return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(2);
            });
          });
        });
        describe('when a new variable is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              updateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(updateSpy);
              editor.moveToBottom();
              editBuffer('\nfoo = base-color');
              return waitsFor(function() {
                return updateSpy.callCount > 0;
              });
            });
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a variable is removed', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            editBuffer('', {
              start: [0, 0],
              end: [0, 17]
            });
            return waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
          });
          return it('invalidates colors that were relying on the deleted variables', function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(3);
            return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
          });
        });
        return describe('::serialize', function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
          });
          return it('returns the whole buffer data', function() {
            var expected;
            expected = jsonFixture("four-variables-buffer.json", {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: colorBuffer.getColorMarkers().map(function(m) {
                return m.marker.id;
              })
            });
            return expect(colorBuffer.serialize()).toEqual(expected);
          });
        });
      });
      describe('with a buffer with only colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('buttons.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(3);
          });
        });
        describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#336699', {
                start: [1, 13],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            return expect(marker.color).toBeColor('#336699');
          });
          return it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when new lines changes the markers range', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#fff\n\n', {
                start: [0, 0],
                end: [0, 0]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          return it('does not destroys the previous markers', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a new color is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editor.moveToBottom();
              editBuffer('\n#336699');
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('adds a marker for the new color', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            expect(markers.length).toEqual(4);
            expect(marker.color).toBeColor('#336699');
            return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        return describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('', {
                start: [1, 2],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(2);
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(0);
          });
          return it('removes the previous editor markers', function() {
            return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(2);
          });
        });
      });
      describe('with a buffer whose scope is not one of source files', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('project/lib/main.coffee').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('does not renders colors from variables', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
      });
      return describe('with a buffer in crlf mode', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('crlf.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('creates a marker for each colors', function() {
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
        });
      });
    });
    describe('with a buffer part of the global ignored files', function() {
      beforeEach(function() {
        project.setIgnoredNames([]);
        atom.config.set('pigments.ignoredNames', ['project/vendor/*']);
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      return it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
    });
    describe('with a buffer part of the project ignored files', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color: @base0;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        return it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(21);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(21);
        });
      });
    });
    describe('with a buffer not being a variable source', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/lib/main.coffee').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is not part of the source files', function() {
        return expect(colorBuffer.isVariablesSource()).toBeFalsy();
      });
      it('knows that it is not part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeFalsy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(4);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          spyOn(project, 'reloadVariablesForPath').andCallThrough();
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color = red;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(5);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(5);
        });
        return it('does not ask the project to reload the variables', function() {
          if (parseFloat(atom.getVersion()) >= 1.19) {
            return expect(project.reloadVariablesForPath).not.toHaveBeenCalled();
          } else {
            return expect(project.reloadVariablesForPath.mostRecentCall.args[0]).not.toEqual(colorBuffer.editor.getPath());
          }
        });
      });
    });
    return describe('when created with a previous state', function() {
      describe('with variables and colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            project.colorBufferForEditor(editor).destroy();
            state = jsonFixture('four-variables-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1, -2, -3, -4]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        it('creates markers from the state object', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
        it('restores the markers properties', function() {
          var colorMarker;
          colorMarker = colorBuffer.getColorMarkers()[3];
          expect(colorMarker.color).toBeColor(255, 255, 255, 0.5);
          return expect(colorMarker.color.variables).toEqual(['base-color']);
        });
        it('restores the editor markers', function() {
          return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
        });
        return it('restores the ability to fetch markers', function() {
          var i, len, marker, ref1, results;
          expect(colorBuffer.findColorMarkers().length).toEqual(4);
          ref1 = colorBuffer.findColorMarkers();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            marker = ref1[i];
            results.push(expect(marker).toBeDefined());
          }
          return results;
        });
      });
      return describe('with an invalid color', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('invalid-color.styl').then(function(o) {
              return editor = o;
            });
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            state = jsonFixture('invalid-color-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        return it('creates markers from the state object', function() {
          expect(colorBuffer.getColorMarkers().length).toEqual(1);
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWJ1ZmZlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFDZCxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FBNkIsQ0FBQyxXQUE5QixDQUEwQyxTQUExQyxFQUFxRCxVQUFyRDs7RUFHZCxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFBQSxNQUEyQyxFQUEzQyxFQUFDLGVBQUQsRUFBUyxvQkFBVCxFQUFzQixpQkFBdEIsRUFBZ0M7SUFFaEMsS0FBQSxHQUFRLFNBQUMsRUFBRDtBQUNOLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBSTthQUNaLFNBQUE7ZUFBRyxJQUFJLElBQUosR0FBVyxLQUFYLElBQW9CO01BQXZCO0lBRk07SUFJUixVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUDtBQUNYLFVBQUE7O1FBRGtCLFVBQVE7O01BQzFCLElBQUcscUJBQUg7UUFDRSxJQUFHLG1CQUFIO1VBQ0UsS0FBQSxHQUFRLENBQUMsT0FBTyxDQUFDLEtBQVQsRUFBZ0IsT0FBTyxDQUFDLEdBQXhCLEVBRFY7U0FBQSxNQUFBO1VBR0UsS0FBQSxHQUFRLENBQUMsT0FBTyxDQUFDLEtBQVQsRUFBZ0IsT0FBTyxDQUFDLEtBQXhCLEVBSFY7O1FBS0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLEtBQTlCLEVBTkY7O01BUUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7TUFDQSxJQUFBLENBQXlCLE9BQU8sQ0FBQyxPQUFqQztlQUFBLFlBQUEsQ0FBYSxHQUFiLEVB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cGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5Db2xvckJ1ZmZlciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1idWZmZXInXG5yZWdpc3RyeSA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1leHByZXNzaW9ucydcbmpzb25GaXh0dXJlID0gcmVxdWlyZSgnLi9oZWxwZXJzL2ZpeHR1cmVzJykuanNvbkZpeHR1cmUoX19kaXJuYW1lLCAnZml4dHVyZXMnKVxuXG5cbmRlc2NyaWJlICdDb2xvckJ1ZmZlcicsIC0+XG4gIFtlZGl0b3IsIGNvbG9yQnVmZmVyLCBwaWdtZW50cywgcHJvamVjdF0gPSBbXVxuXG4gIHNsZWVwID0gKG1zKSAtPlxuICAgIHN0YXJ0ID0gbmV3IERhdGVcbiAgICAtPiBuZXcgRGF0ZSAtIHN0YXJ0ID49IG1zXG5cbiAgZWRpdEJ1ZmZlciA9ICh0ZXh0LCBvcHRpb25zPXt9KSAtPlxuICAgIGlmIG9wdGlvbnMuc3RhcnQ/XG4gICAgICBpZiBvcHRpb25zLmVuZD9cbiAgICAgICAgcmFuZ2UgPSBbb3B0aW9ucy5zdGFydCwgb3B0aW9ucy5lbmRdXG4gICAgICBlbHNlXG4gICAgICAgIHJhbmdlID0gW29wdGlvbnMuc3RhcnQsIG9wdGlvbnMuc3RhcnRdXG5cbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gICAgZWRpdG9yLmluc2VydFRleHQodGV4dClcbiAgICBhZHZhbmNlQ2xvY2soNTAwKSB1bmxlc3Mgb3B0aW9ucy5ub0V2ZW50XG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuZGVsYXlCZWZvcmVTY2FuJywgMFxuICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlZEJ1ZmZlck5hbWVzJywgW11cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmZpbGV0eXBlc0ZvckNvbG9yV29yZHMnLCBbJyonXVxuICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc291cmNlTmFtZXMnLCBbXG4gICAgICAnKi5zdHlsJ1xuICAgICAgJyoubGVzcydcbiAgICBdXG5cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsIFsncHJvamVjdC92ZW5kb3IvKionXVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdmb3VyLXZhcmlhYmxlcy5zdHlsJykudGhlbiAobykgLT4gZWRpdG9yID0gb1xuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgncGlnbWVudHMnKS50aGVuIChwa2cpIC0+XG4gICAgICAgIHBpZ21lbnRzID0gcGtnLm1haW5Nb2R1bGVcbiAgICAgICAgcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuICAgICAgLmNhdGNoIChlcnIpIC0+IGNvbnNvbGUuZXJyb3IgZXJyXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgY29sb3JCdWZmZXI/LmRlc3Ryb3koKVxuXG4gIGl0ICdjcmVhdGVzIGEgY29sb3IgYnVmZmVyIGZvciBlYWNoIGVkaXRvciBpbiB0aGUgd29ya3NwYWNlJywgLT5cbiAgICBleHBlY3QocHJvamVjdC5jb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pLnRvQmVEZWZpbmVkKClcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgZmlsZSBwYXRoIG1hdGNoZXMgYW4gZW50cnkgaW4gaWdub3JlZEJ1ZmZlck5hbWVzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5oYXNDb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpKS50b0JlVHJ1dGh5KClcblxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5pZ25vcmVkQnVmZmVyTmFtZXMnLCBbJyoqLyouc3R5bCddXG5cbiAgICBpdCAnZGVzdHJveXMgdGhlIGNvbG9yIGJ1ZmZlciBmb3IgdGhpcyBmaWxlJywgLT5cbiAgICAgIGV4cGVjdChwcm9qZWN0Lmhhc0NvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVGYWxzeSgpXG5cbiAgICBpdCAncmVjcmVhdGVzIHRoZSBjb2xvciBidWZmZXIgd2hlbiB0aGUgc2V0dGluZ3Mgbm8gbG9uZ2VyIGlnbm9yZSB0aGUgZmlsZScsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5oYXNDb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpKS50b0JlRmFsc3koKVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmlnbm9yZWRCdWZmZXJOYW1lcycsIFtdXG5cbiAgICAgIGV4cGVjdChwcm9qZWN0Lmhhc0NvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVUcnV0aHkoKVxuXG4gICAgaXQgJ3ByZXZlbnRzIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBjb2xvciBidWZmZXInLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3ZhcmlhYmxlcy5zdHlsJykudGhlbiAobykgLT4gZWRpdG9yID0gb1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0Lmhhc0NvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVGYWxzeSgpXG5cbiAgZGVzY3JpYmUgJ3doZW4gYW4gZWRpdG9yIHdpdGggYSBwYXRoIGlzIG5vdCBpbiB0aGUgcHJvamVjdCBwYXRocyBpcyBvcGVuZWQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yIC0+IHByb2plY3QuZ2V0UGF0aHMoKT9cblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBmaWxlIGlzIGFscmVhZHkgc2F2ZWQgb24gZGlzaycsIC0+XG4gICAgICBwYXRoVG9PcGVuID0gbnVsbFxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHBhdGhUb09wZW4gPSBwcm9qZWN0LnBhdGhzLnNoaWZ0KClcblxuICAgICAgaXQgJ2FkZHMgdGhlIHBhdGggdG8gdGhlIHByb2plY3QgaW1tZWRpYXRlbHknLCAtPlxuICAgICAgICBzcHlPbihwcm9qZWN0LCAnYXBwZW5kUGF0aCcpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoVG9PcGVuKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgZWRpdG9yID0gb1xuICAgICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuYXBwZW5kUGF0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aFRvT3BlbilcblxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGZpbGUgaXMgbm90IHlldCBzYXZlZCBvbiBkaXNrJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignZm9vLWRlLWZhZmEuc3R5bCcpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICBlZGl0b3IgPSBvXG4gICAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBpdCAnZG9lcyBub3QgZmFpbHMgd2hlbiB1cGRhdGluZyB0aGUgY29sb3JCdWZmZXInLCAtPlxuICAgICAgICBleHBlY3QoLT4gY29sb3JCdWZmZXIudXBkYXRlKCkpLm5vdC50b1Rocm93KClcblxuICAgICAgaXQgJ2FkZHMgdGhlIHBhdGggdG8gdGhlIHByb2plY3QgcGF0aHMgb24gc2F2ZScsIC0+XG4gICAgICAgIHNweU9uKGNvbG9yQnVmZmVyLCAndXBkYXRlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBzcHlPbihwcm9qZWN0LCAnYXBwZW5kUGF0aCcpXG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQgJ2RpZC1zYXZlJywgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IGNvbG9yQnVmZmVyLnVwZGF0ZS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmFwcGVuZFBhdGgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGVkaXRvci5nZXRQYXRoKCkpXG5cbiAgZGVzY3JpYmUgJ3doZW4gYW4gZWRpdG9yIHdpdGhvdXQgcGF0aCBpcyBvcGVuZWQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCkudGhlbiAobykgLT5cbiAgICAgICAgICBlZGl0b3IgPSBvXG4gICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG5cbiAgICBpdCAnZG9lcyBub3QgZmFpbHMgd2hlbiB1cGRhdGluZyB0aGUgY29sb3JCdWZmZXInLCAtPlxuICAgICAgZXhwZWN0KC0+IGNvbG9yQnVmZmVyLnVwZGF0ZSgpKS5ub3QudG9UaHJvdygpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgZmlsZSBpcyBzYXZlZCBhbmQgYXF1aXJlcyBhIHBhdGgnLCAtPlxuICAgICAgZGVzY3JpYmUgJ3RoYXQgaXMgbGVnaWJsZScsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBzcHlPbihjb2xvckJ1ZmZlciwgJ3VwZGF0ZScpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgICBzcHlPbihlZGl0b3IsICdnZXRQYXRoJykuYW5kUmV0dXJuKCduZXctcGF0aC5zdHlsJylcbiAgICAgICAgICBlZGl0b3IuZW1pdHRlci5lbWl0ICdkaWQtY2hhbmdlLXBhdGgnLCBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlci51cGRhdGUuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICdhZGRzIHRoZSBwYXRoIHRvIHRoZSBwcm9qZWN0IHBhdGhzJywgLT5cbiAgICAgICAgICBleHBlY3QoJ25ldy1wYXRoLnN0eWwnIGluIHByb2plY3QuZ2V0UGF0aHMoKSkudG9CZVRydXRoeSgpXG5cbiAgICAgIGRlc2NyaWJlICd0aGF0IGlzIG5vdCBsZWdpYmxlJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHNweU9uKGNvbG9yQnVmZmVyLCAndXBkYXRlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICAgIHNweU9uKGVkaXRvciwgJ2dldFBhdGgnKS5hbmRSZXR1cm4oJ25ldy1wYXRoLnNhc3MnKVxuICAgICAgICAgIGVkaXRvci5lbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtcGF0aCcsIGVkaXRvci5nZXRQYXRoKClcblxuICAgICAgICAgIHdhaXRzRm9yIC0+IGNvbG9yQnVmZmVyLnVwZGF0ZS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgaXQgJ2RvZXMgbm90IGFkZCB0aGUgcGF0aCB0byB0aGUgcHJvamVjdCBwYXRocycsIC0+XG4gICAgICAgICAgZXhwZWN0KCduZXctcGF0aC5zdHlsJyBpbiBwcm9qZWN0LmdldFBhdGhzKCkpLnRvQmVGYWxzeSgpXG5cbiAgICAgIGRlc2NyaWJlICd0aGF0IGlzIGlnbm9yZWQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgc3B5T24oY29sb3JCdWZmZXIsICd1cGRhdGUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgICAgc3B5T24oZWRpdG9yLCAnZ2V0UGF0aCcpLmFuZFJldHVybigncHJvamVjdC92ZW5kb3IvbmV3LXBhdGguc3R5bCcpXG4gICAgICAgICAgZWRpdG9yLmVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1wYXRoJywgZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gY29sb3JCdWZmZXIudXBkYXRlLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAnZG9lcyBub3QgYWRkIHRoZSBwYXRoIHRvIHRoZSBwcm9qZWN0IHBhdGhzJywgLT5cbiAgICAgICAgICBleHBlY3QoJ25ldy1wYXRoLnN0eWwnIGluIHByb2plY3QuZ2V0UGF0aHMoKSkudG9CZUZhbHN5KClcblxuICAjIEZJWE1FIFVzaW5nIGEgMXMgc2xlZXAgc2VlbXMgdG8gZG8gbm90aGluZyBvbiBUcmF2aXMsIGl0J2xsIG5lZWRcbiAgIyBhIGJldHRlciBzb2x1dGlvbi5cbiAgZGVzY3JpYmUgJ3dpdGggcmFwaWQgY2hhbmdlcyB0aGF0IHRyaWdnZXJzIGEgcmVzY2FuJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgY29sb3JCdWZmZXIuaW5pdGlhbGl6ZWQgYW5kIGNvbG9yQnVmZmVyLnZhcmlhYmxlSW5pdGlhbGl6ZWRcblxuICAgICAgcnVucyAtPlxuICAgICAgICBzcHlPbihjb2xvckJ1ZmZlciwgJ3Rlcm1pbmF0ZVJ1bm5pbmdUYXNrJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBzcHlPbihjb2xvckJ1ZmZlciwgJ3VwZGF0ZUNvbG9yTWFya2VycycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgc3B5T24oY29sb3JCdWZmZXIsICdzY2FuQnVmZmVyRm9yVmFyaWFibGVzJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCcjZmZmXFxuJylcbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmVtaXR0ZXIuZW1pdCgnZGlkLXN0b3AtY2hhbmdpbmcnKVxuXG4gICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlci5zY2FuQnVmZmVyRm9yVmFyaWFibGVzLmNhbGxDb3VudCA+IDBcblxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnICcpXG5cbiAgICBpdCAndGVybWluYXRlcyB0aGUgY3VycmVudGx5IHJ1bm5pbmcgdGFzaycsIC0+XG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIudGVybWluYXRlUnVubmluZ1Rhc2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlICd3aGVuIGNyZWF0ZWQgd2l0aG91dCBhIHByZXZpb3VzIHN0YXRlJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKVxuXG4gICAgaXQgJ3NjYW5zIHRoZSBidWZmZXIgZm9yIGNvbG9ycyB3aXRob3V0IHdhaXRpbmcgZm9yIHRoZSBwcm9qZWN0IHZhcmlhYmxlcycsIC0+XG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDQpXG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0VmFsaWRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgIGl0ICdjcmVhdGVzIHRoZSBjb3JyZXNwb25kaW5nIG1hcmtlcnMgaW4gdGhlIHRleHQgZWRpdG9yJywgLT5cbiAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRNYXJrZXJMYXllcigpLmZpbmRNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICBpdCAna25vd3MgdGhhdCBpdCBpcyBsZWdpYmxlIGFzIGEgdmFyaWFibGVzIHNvdXJjZSBmaWxlJywgLT5cbiAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5pc1ZhcmlhYmxlc1NvdXJjZSgpKS50b0JlVHJ1dGh5KClcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBlZGl0b3IgaXMgZGVzdHJveWVkJywgLT5cbiAgICAgIGl0ICdkZXN0cm95cyB0aGUgY29sb3IgYnVmZmVyIGF0IHRoZSBzYW1lIHRpbWUnLCAtPlxuICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGRlc2NyaWJlICc6OmdldENvbG9yTWFya2VyQXRCdWZmZXJQb3NpdGlvbicsIC0+XG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgYnVmZmVyIHBvc2l0aW9uIGlzIGNvbnRhaW5lZCBpbiBhIG1hcmtlciByYW5nZScsIC0+XG4gICAgICAgIGl0ICdyZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIG1hcmtlcicsIC0+XG4gICAgICAgICAgY29sb3JNYXJrZXIgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlckF0QnVmZmVyUG9zaXRpb24oWzIsIDE1XSlcbiAgICAgICAgICBleHBlY3QoY29sb3JNYXJrZXIpLnRvRXF1YWwoY29sb3JCdWZmZXIuY29sb3JNYXJrZXJzWzFdKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgYnVmZmVyIHBvc2l0aW9uIGlzIG5vdCBjb250YWluZWQgaW4gYSBtYXJrZXIgcmFuZ2UnLCAtPlxuICAgICAgICBpdCAncmV0dXJucyB1bmRlZmluZWQnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlckF0QnVmZmVyUG9zaXRpb24oWzEsIDE1XSkpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAgICMjICAgICMjICAgICAjIyAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjXG4gICAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICAgIyMgICAgICMjICAgIyMgICMjIyMjIyMjIyAjIyAgICMjICAgICAgICAgIyNcbiAgICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAgICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBwcm9qZWN0IHZhcmlhYmxlcyBiZWNvbWVzIGF2YWlsYWJsZScsIC0+XG4gICAgICBbdXBkYXRlU3B5XSA9IFtdXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHVwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnKVxuICAgICAgICBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2Vycyh1cGRhdGVTcHkpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBpdCAncmVwbGFjZXMgdGhlIGludmFsaWQgbWFya2VycyB0aGF0IGFyZSBub3cgdmFsaWQnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0VmFsaWRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoNClcbiAgICAgICAgZXhwZWN0KHVwZGF0ZVNweS5hcmdzRm9yQ2FsbFswXVswXS5jcmVhdGVkLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICBleHBlY3QodXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZC5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSB2YXJpYWJsZSBpcyBlZGl0ZWQnLCAtPlxuICAgICAgICBbY29sb3JzVXBkYXRlU3B5XSA9IFtdXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBjb2xvcnNVcGRhdGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJylcbiAgICAgICAgICBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2Vycyhjb2xvcnNVcGRhdGVTcHkpXG4gICAgICAgICAgZWRpdEJ1ZmZlciAnIzMzNjY5OScsIHN0YXJ0OiBbMCwxM10sIGVuZDogWzAsMTddXG5cbiAgICAgICAgaXQgJ3VwZGF0ZXMgdGhlIG1vZGlmaWVkIGNvbG9ycycsIC0+XG4gICAgICAgICAgd2FpdHNGb3IgLT4gY29sb3JzVXBkYXRlU3B5LmNhbGxDb3VudCA+IDBcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JzVXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZC5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICAgICAgICAgIGV4cGVjdChjb2xvcnNVcGRhdGVTcHkuYXJnc0ZvckNhbGxbMF1bMF0uY3JlYXRlZC5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSBuZXcgdmFyaWFibGUgaXMgYWRkZWQnLCAtPlxuICAgICAgICBbY29sb3JzVXBkYXRlU3B5XSA9IFtdXG5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgdXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycycpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2Vycyh1cGRhdGVTcHkpXG4gICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgIGVkaXRCdWZmZXIgJ1xcbmZvbyA9IGJhc2UtY29sb3InXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiB1cGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICdkaXNwYXRjaGVzIHRoZSBuZXcgbWFya2VyIGluIGEgZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzIGV2ZW50JywgLT5cbiAgICAgICAgICBleHBlY3QodXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZC5sZW5ndGgpLnRvRXF1YWwoMClcbiAgICAgICAgICBleHBlY3QodXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmNyZWF0ZWQubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGEgdmFyaWFibGUgaXMgcmVtb3ZlZCcsIC0+XG4gICAgICAgIFtjb2xvcnNVcGRhdGVTcHldID0gW11cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGNvbG9yc1VwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnKVxuICAgICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKGNvbG9yc1VwZGF0ZVNweSlcbiAgICAgICAgICBlZGl0QnVmZmVyICcnLCBzdGFydDogWzAsMF0sIGVuZDogWzAsMTddXG4gICAgICAgICAgd2FpdHNGb3IgLT4gY29sb3JzVXBkYXRlU3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAnaW52YWxpZGF0ZXMgY29sb3JzIHRoYXQgd2VyZSByZWx5aW5nIG9uIHRoZSBkZWxldGVkIHZhcmlhYmxlcycsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCgzKVxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRWYWxpZENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICBkZXNjcmliZSAnOjpzZXJpYWxpemUnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG5cbiAgICAgICAgaXQgJ3JldHVybnMgdGhlIHdob2xlIGJ1ZmZlciBkYXRhJywgLT5cbiAgICAgICAgICBleHBlY3RlZCA9IGpzb25GaXh0dXJlIFwiZm91ci12YXJpYWJsZXMtYnVmZmVyLmpzb25cIiwge1xuICAgICAgICAgICAgaWQ6IGVkaXRvci5pZFxuICAgICAgICAgICAgcm9vdDogYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgICAgIGNvbG9yTWFya2VyczogY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubWFwIChtKSAtPiBtLm1hcmtlci5pZFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5zZXJpYWxpemUoKSkudG9FcXVhbChleHBlY3RlZClcblxuICAgICMjICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyAgICAgICAgIyMjIyMjIyAgIyMjIyMjIyMgICAjIyMjIyNcbiAgICAjIyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjI1xuICAgICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICMjXG4gICAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAgICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyAgICAgICAgICMjXG4gICAgIyMgICAgIyMgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgICAjIyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMgICMjICAgICAjIyAgIyMjIyMjXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhIGJ1ZmZlciB3aXRoIG9ubHkgY29sb3JzJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYnV0dG9ucy5zdHlsJykudGhlbiAobykgLT4gZWRpdG9yID0gb1xuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICBpdCAnY3JlYXRlcyB0aGUgY29sb3IgbWFya2VycyBmb3IgdGhlIHZhcmlhYmxlcyB1c2VkIGluIHRoZSBidWZmZXInLCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcbiAgICAgICAgcnVucyAtPiBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGEgY29sb3IgbWFya2VyIGlzIGVkaXRlZCcsIC0+XG4gICAgICAgIFtjb2xvcnNVcGRhdGVTcHldID0gW11cblxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBjb2xvcnNVcGRhdGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJylcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKGNvbG9yc1VwZGF0ZVNweSlcbiAgICAgICAgICAgIGVkaXRCdWZmZXIgJyMzMzY2OTknLCBzdGFydDogWzEsMTNdLCBlbmQ6IFsxLDIzXVxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gY29sb3JzVXBkYXRlU3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAndXBkYXRlcyB0aGUgbW9kaWZpZWQgY29sb3IgbWFya2VyJywgLT5cbiAgICAgICAgICBtYXJrZXJzID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKClcbiAgICAgICAgICBtYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoLTFdXG4gICAgICAgICAgZXhwZWN0KG1hcmtlci5jb2xvcikudG9CZUNvbG9yKCcjMzM2Njk5JylcblxuICAgICAgICBpdCAndXBkYXRlcyBvbmx5IHRoZSBhZmZlY3RlZCBtYXJrZXInLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvcnNVcGRhdGVTcHkuYXJnc0ZvckNhbGxbMF1bMF0uZGVzdHJveWVkLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdChjb2xvcnNVcGRhdGVTcHkuYXJnc0ZvckNhbGxbMF1bMF0uY3JlYXRlZC5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gbmV3IGxpbmVzIGNoYW5nZXMgdGhlIG1hcmtlcnMgcmFuZ2UnLCAtPlxuICAgICAgICBbY29sb3JzVXBkYXRlU3B5XSA9IFtdXG5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgY29sb3JzVXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycycpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2Vycyhjb2xvcnNVcGRhdGVTcHkpXG4gICAgICAgICAgICBlZGl0QnVmZmVyICcjZmZmXFxuXFxuJywgc3RhcnQ6IFswLDBdLCBlbmQ6IFswLDBdXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvcnNVcGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICdkb2VzIG5vdCBkZXN0cm95cyB0aGUgcHJldmlvdXMgbWFya2VycycsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbG9yc1VwZGF0ZVNweS5hcmdzRm9yQ2FsbFswXVswXS5kZXN0cm95ZWQubGVuZ3RoKS50b0VxdWFsKDApXG4gICAgICAgICAgZXhwZWN0KGNvbG9yc1VwZGF0ZVNweS5hcmdzRm9yQ2FsbFswXVswXS5jcmVhdGVkLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiBhIG5ldyBjb2xvciBpcyBhZGRlZCcsIC0+XG4gICAgICAgIFtjb2xvcnNVcGRhdGVTcHldID0gW11cblxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBjb2xvcnNVcGRhdGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJylcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKGNvbG9yc1VwZGF0ZVNweSlcbiAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgICAgZWRpdEJ1ZmZlciAnXFxuIzMzNjY5OSdcbiAgICAgICAgICAgIHdhaXRzRm9yIC0+IGNvbG9yc1VwZGF0ZVNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgaXQgJ2FkZHMgYSBtYXJrZXIgZm9yIHRoZSBuZXcgY29sb3InLCAtPlxuICAgICAgICAgIG1hcmtlcnMgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKVxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlcnNbbWFya2Vycy5sZW5ndGgtMV1cbiAgICAgICAgICBleHBlY3QobWFya2Vycy5sZW5ndGgpLnRvRXF1YWwoNClcbiAgICAgICAgICBleHBlY3QobWFya2VyLmNvbG9yKS50b0JlQ29sb3IoJyMzMzY2OTknKVxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRNYXJrZXJMYXllcigpLmZpbmRNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICAgICAgaXQgJ2Rpc3BhdGNoZXMgdGhlIG5ldyBtYXJrZXIgaW4gYSBkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMgZXZlbnQnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvcnNVcGRhdGVTcHkuYXJnc0ZvckNhbGxbMF1bMF0uZGVzdHJveWVkLmxlbmd0aCkudG9FcXVhbCgwKVxuICAgICAgICAgIGV4cGVjdChjb2xvcnNVcGRhdGVTcHkuYXJnc0ZvckNhbGxbMF1bMF0uY3JlYXRlZC5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSBjb2xvciBtYXJrZXIgaXMgZWRpdGVkJywgLT5cbiAgICAgICAgW2NvbG9yc1VwZGF0ZVNweV0gPSBbXVxuXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGNvbG9yc1VwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnKVxuICAgICAgICAgICAgY29sb3JCdWZmZXIub25EaWRVcGRhdGVDb2xvck1hcmtlcnMoY29sb3JzVXBkYXRlU3B5KVxuICAgICAgICAgICAgZWRpdEJ1ZmZlciAnJywgc3RhcnQ6IFsxLDJdLCBlbmQ6IFsxLDIzXVxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gY29sb3JzVXBkYXRlU3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAndXBkYXRlcyB0aGUgbW9kaWZpZWQgY29sb3IgbWFya2VyJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICAgICAgaXQgJ3VwZGF0ZXMgb25seSB0aGUgYWZmZWN0ZWQgbWFya2VyJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JzVXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZC5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICAgICAgICBleHBlY3QoY29sb3JzVXBkYXRlU3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmNyZWF0ZWQubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgICAgaXQgJ3JlbW92ZXMgdGhlIHByZXZpb3VzIGVkaXRvciBtYXJrZXJzJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0TWFya2VyTGF5ZXIoKS5maW5kTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYSBidWZmZXIgd2hvc2Ugc2NvcGUgaXMgbm90IG9uZSBvZiBzb3VyY2UgZmlsZXMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdwcm9qZWN0L2xpYi9tYWluLmNvZmZlZScpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgaXQgJ2RvZXMgbm90IHJlbmRlcnMgY29sb3JzIGZyb20gdmFyaWFibGVzJywgLT5cbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCg0KVxuXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhIGJ1ZmZlciBpbiBjcmxmIG1vZGUnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdjcmxmLnN0eWwnKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgZWRpdG9yID0gb1xuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBpdCAnY3JlYXRlcyBhIG1hcmtlciBmb3IgZWFjaCBjb2xvcnMnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0VmFsaWRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAjIyAgICAjIyMjICAjIyMjIyMgICAjIyAgICAjIyAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjXG4gICMjICAgICAjIyAgIyMgICAgIyMgICMjIyAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICAjIyAgIyMgICAgICAgICMjIyMgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICAjIyAgIyMgICAjIyMjICMjICMjICMjICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjICAgIyMgICAgICMjXG4gICMjICAgICAjIyAgIyMgICAgIyMgICMjICAjIyMjICMjICAgICAjIyAjIyAgICMjICAgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICAjIyAgIyMgICAgIyMgICMjICAgIyMjICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjIyMgICMjIyMjIyAgICMjICAgICMjICAjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyMgIyMjIyMjIyNcblxuICBkZXNjcmliZSAnd2l0aCBhIGJ1ZmZlciBwYXJ0IG9mIHRoZSBnbG9iYWwgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcHJvamVjdC5zZXRJZ25vcmVkTmFtZXMoW10pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsIFsncHJvamVjdC92ZW5kb3IvKiddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigncHJvamVjdC92ZW5kb3IvY3NzL3ZhcmlhYmxlcy5sZXNzJykudGhlbiAobykgLT4gZWRpdG9yID0gb1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgaXQgJ2tub3dzIHRoYXQgaXQgaXMgcGFydCBvZiB0aGUgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuaXNJZ25vcmVkKCkpLnRvQmVUcnV0aHkoKVxuXG4gICAgaXQgJ2tub3dzIHRoYXQgaXQgaXMgYSB2YXJpYWJsZXMgc291cmNlIGZpbGUnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmlzVmFyaWFibGVzU291cmNlKCkpLnRvQmVUcnV0aHkoKVxuXG4gICAgaXQgJ3NjYW5zIHRoZSBidWZmZXIgZm9yIHZhcmlhYmxlcyBmb3IgaW4tYnVmZmVyIHVzZSBvbmx5JywgLT5cbiAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMjApXG4gICAgICB2YWxpZE1hcmtlcnMgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5maWx0ZXIgKG0pIC0+XG4gICAgICAgIG0uY29sb3IuaXNWYWxpZCgpXG5cbiAgICAgIGV4cGVjdCh2YWxpZE1hcmtlcnMubGVuZ3RoKS50b0VxdWFsKDIwKVxuXG4gIGRlc2NyaWJlICd3aXRoIGEgYnVmZmVyIHBhcnQgb2YgdGhlIHByb2plY3QgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3Byb2plY3QvdmVuZG9yL2Nzcy92YXJpYWJsZXMubGVzcycpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgICAgcnVucyAtPlxuICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgIGl0ICdrbm93cyB0aGF0IGl0IGlzIHBhcnQgb2YgdGhlIGlnbm9yZWQgZmlsZXMnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmlzSWdub3JlZCgpKS50b0JlVHJ1dGh5KClcblxuICAgIGl0ICdrbm93cyB0aGF0IGl0IGlzIGEgdmFyaWFibGVzIHNvdXJjZSBmaWxlJywgLT5cbiAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5pc1ZhcmlhYmxlc1NvdXJjZSgpKS50b0JlVHJ1dGh5KClcblxuICAgIGl0ICdzY2FucyB0aGUgYnVmZmVyIGZvciB2YXJpYWJsZXMgZm9yIGluLWJ1ZmZlciB1c2Ugb25seScsIC0+XG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDIwKVxuICAgICAgdmFsaWRNYXJrZXJzID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkuZmlsdGVyIChtKSAtPlxuICAgICAgICBtLmNvbG9yLmlzVmFsaWQoKVxuXG4gICAgICBleHBlY3QodmFsaWRNYXJrZXJzLmxlbmd0aCkudG9FcXVhbCgyMClcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBidWZmZXIgaXMgZWRpdGVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29sb3JzVXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtY29sb3ItbWFya2VycycpXG4gICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKGNvbG9yc1VwZGF0ZVNweSlcbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRCdWZmZXIgJ1xcblxcbkBuZXctY29sb3I6IEBiYXNlMDtcXG4nXG4gICAgICAgIHdhaXRzRm9yIC0+IGNvbG9yc1VwZGF0ZVNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgIGl0ICdmaW5kcyB0aGUgbmV3bHkgYWRkZWQgY29sb3InLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDIxKVxuICAgICAgICB2YWxpZE1hcmtlcnMgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5maWx0ZXIgKG0pIC0+XG4gICAgICAgICAgbS5jb2xvci5pc1ZhbGlkKClcblxuICAgICAgICBleHBlY3QodmFsaWRNYXJrZXJzLmxlbmd0aCkudG9FcXVhbCgyMSlcblxuICAjIyAgICAjIyAgICAjIyAgIyMjIyMjIyAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyMgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMjIyAgIyMgIyMgICAgICMjICMjICAgICAjIyAgIyMgICAjIyAgIyMgICAgICMjICMjXG4gICMjICAgICMjICMjICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjICAjIyMjICMjICAgICAjIyAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAjIyAgICMjIyAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgIyMgICMjIyMjIyMgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBkZXNjcmliZSAnd2l0aCBhIGJ1ZmZlciBub3QgYmVpbmcgYSB2YXJpYWJsZSBzb3VyY2UnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdwcm9qZWN0L2xpYi9tYWluLmNvZmZlZScpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgICAgcnVucyAtPiBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgIGl0ICdrbm93cyB0aGF0IGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBzb3VyY2UgZmlsZXMnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmlzVmFyaWFibGVzU291cmNlKCkpLnRvQmVGYWxzeSgpXG5cbiAgICBpdCAna25vd3MgdGhhdCBpdCBpcyBub3QgcGFydCBvZiB0aGUgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgICBleHBlY3QoY29sb3JCdWZmZXIuaXNJZ25vcmVkKCkpLnRvQmVGYWxzeSgpXG5cbiAgICBpdCAnc2NhbnMgdGhlIGJ1ZmZlciBmb3IgdmFyaWFibGVzIGZvciBpbi1idWZmZXIgdXNlIG9ubHknLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCg0KVxuICAgICAgdmFsaWRNYXJrZXJzID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKCkuZmlsdGVyIChtKSAtPlxuICAgICAgICBtLmNvbG9yLmlzVmFsaWQoKVxuXG4gICAgICBleHBlY3QodmFsaWRNYXJrZXJzLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGJ1ZmZlciBpcyBlZGl0ZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBjb2xvcnNVcGRhdGVTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJylcbiAgICAgICAgc3B5T24ocHJvamVjdCwgJ3JlbG9hZFZhcmlhYmxlc0ZvclBhdGgnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzKGNvbG9yc1VwZGF0ZVNweSlcbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRCdWZmZXIgJ1xcblxcbkBuZXctY29sb3IgPSByZWQ7XFxuJ1xuICAgICAgICB3YWl0c0ZvciAtPiBjb2xvcnNVcGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICBpdCAnZmluZHMgdGhlIG5ld2x5IGFkZGVkIGNvbG9yJywgLT5cbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCg1KVxuICAgICAgICB2YWxpZE1hcmtlcnMgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5maWx0ZXIgKG0pIC0+XG4gICAgICAgICAgbS5jb2xvci5pc1ZhbGlkKClcblxuICAgICAgICBleHBlY3QodmFsaWRNYXJrZXJzLmxlbmd0aCkudG9FcXVhbCg1KVxuXG4gICAgICBpdCAnZG9lcyBub3QgYXNrIHRoZSBwcm9qZWN0IHRvIHJlbG9hZCB0aGUgdmFyaWFibGVzJywgLT5cbiAgICAgICAgaWYgcGFyc2VGbG9hdChhdG9tLmdldFZlcnNpb24oKSkgPj0gMS4xOVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LnJlbG9hZFZhcmlhYmxlc0ZvclBhdGgpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LnJlbG9hZFZhcmlhYmxlc0ZvclBhdGgubW9zdFJlY2VudENhbGwuYXJnc1swXSkubm90LnRvRXF1YWwoY29sb3JCdWZmZXIuZWRpdG9yLmdldFBhdGgoKSlcblxuICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyMgICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgICAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjICAgICMjIyMjIyAgICAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyNcbiAgIyMgICAgIyMgICAjIyAgICMjICAgICAgICAgICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICMjICAgIyNcbiAgIyMgICAgIyMgICAgIyMgICMjICAgICAgICMjICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAjIyAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjICAjIyMjIyMgICAgICMjICAgICAjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyNcblxuICBkZXNjcmliZSAnd2hlbiBjcmVhdGVkIHdpdGggYSBwcmV2aW91cyBzdGF0ZScsIC0+XG4gICAgZGVzY3JpYmUgJ3dpdGggdmFyaWFibGVzIGFuZCBjb2xvcnMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKS5kZXN0cm95KClcblxuICAgICAgICAgIHN0YXRlID0ganNvbkZpeHR1cmUoJ2ZvdXItdmFyaWFibGVzLWJ1ZmZlci5qc29uJywge1xuICAgICAgICAgICAgaWQ6IGVkaXRvci5pZFxuICAgICAgICAgICAgcm9vdDogYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgICAgIGNvbG9yTWFya2VyczogWy0xLi4tNF1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHN0YXRlLmVkaXRvciA9IGVkaXRvclxuICAgICAgICAgIHN0YXRlLnByb2plY3QgPSBwcm9qZWN0XG4gICAgICAgICAgY29sb3JCdWZmZXIgPSBuZXcgQ29sb3JCdWZmZXIoc3RhdGUpXG5cbiAgICAgIGl0ICdjcmVhdGVzIG1hcmtlcnMgZnJvbSB0aGUgc3RhdGUgb2JqZWN0JywgLT5cbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgICBpdCAncmVzdG9yZXMgdGhlIG1hcmtlcnMgcHJvcGVydGllcycsIC0+XG4gICAgICAgIGNvbG9yTWFya2VyID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJzKClbM11cbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyLmNvbG9yKS50b0JlQ29sb3IoMjU1LDI1NSwyNTUsMC41KVxuICAgICAgICBleHBlY3QoY29sb3JNYXJrZXIuY29sb3IudmFyaWFibGVzKS50b0VxdWFsKFsnYmFzZS1jb2xvciddKVxuXG4gICAgICBpdCAncmVzdG9yZXMgdGhlIGVkaXRvciBtYXJrZXJzJywgLT5cbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldE1hcmtlckxheWVyKCkuZmluZE1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgICAgaXQgJ3Jlc3RvcmVzIHRoZSBhYmlsaXR5IHRvIGZldGNoIG1hcmtlcnMnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuZmluZENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgICAgIGZvciBtYXJrZXIgaW4gY29sb3JCdWZmZXIuZmluZENvbG9yTWFya2VycygpXG4gICAgICAgICAgZXhwZWN0KG1hcmtlcikudG9CZURlZmluZWQoKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYW4gaW52YWxpZCBjb2xvcicsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2ludmFsaWQtY29sb3Iuc3R5bCcpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICBlZGl0b3IgPSBvXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHN0YXRlID0ganNvbkZpeHR1cmUoJ2ludmFsaWQtY29sb3ItYnVmZmVyLmpzb24nLCB7XG4gICAgICAgICAgICBpZDogZWRpdG9yLmlkXG4gICAgICAgICAgICByb290OiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICAgICAgY29sb3JNYXJrZXJzOiBbLTFdXG4gICAgICAgICAgfSlcbiAgICAgICAgICBzdGF0ZS5lZGl0b3IgPSBlZGl0b3JcbiAgICAgICAgICBzdGF0ZS5wcm9qZWN0ID0gcHJvamVjdFxuICAgICAgICAgIGNvbG9yQnVmZmVyID0gbmV3IENvbG9yQnVmZmVyKHN0YXRlKVxuXG4gICAgICBpdCAnY3JlYXRlcyBtYXJrZXJzIGZyb20gdGhlIHN0YXRlIG9iamVjdCcsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlcnMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldFZhbGlkQ29sb3JNYXJrZXJzKCkubGVuZ3RoKS50b0VxdWFsKDApXG4iXX0=

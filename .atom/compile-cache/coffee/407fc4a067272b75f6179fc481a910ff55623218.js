(function() {
  var Color, Palette, THEME_VARIABLES, change, click, ref;

  Color = require('../lib/color');

  Palette = require('../lib/palette');

  THEME_VARIABLES = require('../lib/uris').THEME_VARIABLES;

  ref = require('./helpers/events'), change = ref.change, click = ref.click;

  describe('PaletteElement', function() {
    var createVar, nextID, palette, paletteElement, pigments, project, ref1, workspaceElement;
    ref1 = [0], nextID = ref1[0], palette = ref1[1], paletteElement = ref1[2], workspaceElement = ref1[3], pigments = ref1[4], project = ref1[5];
    createVar = function(name, color, path, line, isAlternate) {
      if (isAlternate == null) {
        isAlternate = false;
      }
      return {
        name: name,
        color: color,
        path: path,
        line: line,
        id: nextID++,
        isAlternate: isAlternate
      };
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      return waitsForPromise(function() {
        return project.initialize();
      });
    });
    afterEach(function() {
      return project.destroy();
    });
    describe('as a view provider', function() {
      beforeEach(function() {
        palette = new Palette([createVar('red', new Color('#ff0000'), 'file.styl', 0), createVar('green', new Color('#00ff00'), 'file.styl', 1), createVar('blue', new Color('#0000ff'), 'file.styl', 2), createVar('redCopy', new Color('#ff0000'), 'file.styl', 3), createVar('red_copy', new Color('#ff0000'), 'file.styl', 3, true), createVar('red', new Color('#ff0000'), THEME_VARIABLES, 0)]);
        paletteElement = atom.views.getView(palette);
        return jasmine.attachToDOM(paletteElement);
      });
      it('is associated with the Palette model', function() {
        return expect(paletteElement).toBeDefined();
      });
      it('does not render alernate form of a variable', function() {
        return expect(paletteElement.querySelectorAll('li').length).toEqual(5);
      });
      return it('does not render the file link when the variable comes from a theme', function() {
        return expect(paletteElement.querySelectorAll('li')[4].querySelector(' [data-variable-id]')).not.toExist();
      });
    });
    describe('when pigments:show-palette commands is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        return runs(function() {
          palette = paletteElement.getModel();
          return jasmine.attachToDOM(paletteElement);
        });
      });
      it('opens a palette element', function() {
        return expect(paletteElement).toBeDefined();
      });
      it('creates as many list item as there is colors in the project', function() {
        expect(paletteElement.querySelectorAll('li').length).not.toEqual(0);
        return expect(paletteElement.querySelectorAll('li').length).toEqual(palette.variables.filter(function(v) {
          return !v.isAlternate;
        }).length);
      });
      it('binds colors with project variables', function() {
        var li, projectVariables;
        projectVariables = project.getColorVariables();
        li = paletteElement.querySelector('li');
        return expect(li.querySelector('.path').textContent).toEqual(atom.project.relativize(projectVariables[0].path));
      });
      describe('clicking on a result path', function() {
        return it('shows the variable in its file', function() {
          var pathElement;
          spyOn(project, 'showVariableInFile');
          pathElement = paletteElement.querySelector('[data-variable-id]');
          click(pathElement);
          return waitsFor(function() {
            return project.showVariableInFile.callCount > 0;
          });
        });
      });
      describe('when the sortPaletteColors settings is set to color', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by color');
        });
        return it('reorders the colors', function() {
          var i, j, len, lis, name, results, sortedColors;
          sortedColors = project.getPalette().sortedByColor().filter(function(v) {
            return !v.isAlternate;
          });
          lis = paletteElement.querySelectorAll('li');
          results = [];
          for (i = j = 0, len = sortedColors.length; j < len; i = ++j) {
            name = sortedColors[i].name;
            results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return results;
        });
      });
      describe('when the sortPaletteColors settings is set to name', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by name');
        });
        return it('reorders the colors', function() {
          var i, j, len, lis, name, results, sortedColors;
          sortedColors = project.getPalette().sortedByName().filter(function(v) {
            return !v.isAlternate;
          });
          lis = paletteElement.querySelectorAll('li');
          results = [];
          for (i = j = 0, len = sortedColors.length; j < len; i = ++j) {
            name = sortedColors[i].name;
            results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return results;
        });
      });
      describe('when the groupPaletteColors setting is set to file', function() {
        beforeEach(function() {
          return atom.config.set('pigments.groupPaletteColors', 'by file');
        });
        it('renders the list with sublists for each files', function() {
          var ols;
          ols = paletteElement.querySelectorAll('ol ol');
          return expect(ols.length).toEqual(5);
        });
        it('adds a header with the file path for each sublist', function() {
          var ols;
          ols = paletteElement.querySelectorAll('.pigments-color-group-header');
          return expect(ols.length).toEqual(5);
        });
        describe('and the sortPaletteColors is set to name', function() {
          beforeEach(function() {
            return atom.config.set('pigments.sortPaletteColors', 'by name');
          });
          return it('sorts the nested list items', function() {
            var file, i, lis, n, name, ol, ols, palettes, results, sortedColors;
            palettes = paletteElement.getFilesPalettes();
            ols = paletteElement.querySelectorAll('.pigments-color-group');
            n = 0;
            results = [];
            for (file in palettes) {
              palette = palettes[file];
              ol = ols[n++];
              lis = ol.querySelectorAll('li');
              sortedColors = palette.sortedByName().filter(function(v) {
                return !v.isAlternate;
              });
              results.push((function() {
                var j, len, results1;
                results1 = [];
                for (i = j = 0, len = sortedColors.length; j < len; i = ++j) {
                  name = sortedColors[i].name;
                  results1.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
                }
                return results1;
              })());
            }
            return results;
          });
        });
        return describe('when the mergeColorDuplicates', function() {
          beforeEach(function() {
            return atom.config.set('pigments.mergeColorDuplicates', true);
          });
          return it('groups identical colors together', function() {
            var lis;
            lis = paletteElement.querySelectorAll('li');
            return expect(lis.length).toEqual(40);
          });
        });
      });
      describe('sorting selector', function() {
        var sortSelect;
        sortSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            sortSelect.querySelector('option[value="by name"]').setAttribute('selected', 'selected');
            return change(sortSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.sortPaletteColors')).toEqual('by name');
          });
        });
      });
      return describe('grouping selector', function() {
        var groupSelect;
        groupSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            groupSelect.querySelector('option[value="by file"]').setAttribute('selected', 'selected');
            return change(groupSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.groupPaletteColors')).toEqual('by file');
          });
        });
      });
    });
    describe('when the palette settings differs from defaults', function() {
      beforeEach(function() {
        atom.config.set('pigments.sortPaletteColors', 'by name');
        atom.config.set('pigments.groupPaletteColors', 'by file');
        return atom.config.set('pigments.mergeColorDuplicates', true);
      });
      return describe('when pigments:show-palette commands is triggered', function() {
        beforeEach(function() {
          atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
          waitsFor(function() {
            return paletteElement = workspaceElement.querySelector('pigments-palette');
          });
          return runs(function() {
            return palette = paletteElement.getModel();
          });
        });
        describe('the sorting selector', function() {
          return it('selects the current value', function() {
            var sortSelect;
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            return expect(sortSelect.querySelector('option[selected]').value).toEqual('by name');
          });
        });
        describe('the grouping selector', function() {
          return it('selects the current value', function() {
            var groupSelect;
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            return expect(groupSelect.querySelector('option[selected]').value).toEqual('by file');
          });
        });
        return it('checks the merge checkbox', function() {
          var mergeCheckBox;
          mergeCheckBox = paletteElement.querySelector('#merge-duplicates');
          return expect(mergeCheckBox.checked).toBeTruthy();
        });
      });
    });
    return describe('when the project variables are modified', function() {
      var initialColorCount, ref2, spy;
      ref2 = [], spy = ref2[0], initialColorCount = ref2[1];
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        runs(function() {
          palette = paletteElement.getModel();
          initialColorCount = palette.getColorsCount();
          spy = jasmine.createSpy('onDidUpdateVariables');
          project.onDidUpdateVariables(spy);
          return atom.config.set('pigments.sourceNames', ['*.styl', '*.less', '*.sass']);
        });
        return waitsFor(function() {
          return spy.callCount > 0;
        });
      });
      return it('updates the palette', function() {
        var lis;
        expect(palette.getColorsCount()).not.toEqual(initialColorCount);
        lis = paletteElement.querySelectorAll('li');
        return expect(lis.length).not.toEqual(initialColorCount);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3BhbGV0dGUtZWxlbWVudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztFQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVI7O0VBQ1Qsa0JBQW1CLE9BQUEsQ0FBUSxhQUFSOztFQUNwQixNQUFrQixPQUFBLENBQVEsa0JBQVIsQ0FBbEIsRUFBQyxtQkFBRCxFQUFTOztFQUVULFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0FBQ3pCLFFBQUE7SUFBQSxPQUF5RSxDQUFDLENBQUQsQ0FBekUsRUFBQyxnQkFBRCxFQUFTLGlCQUFULEVBQWtCLHdCQUFsQixFQUFrQywwQkFBbEMsRUFBb0Qsa0JBQXBELEVBQThEO0lBRTlELFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixXQUExQjs7UUFBMEIsY0FBWTs7YUFDaEQ7UUFBQyxNQUFBLElBQUQ7UUFBTyxPQUFBLEtBQVA7UUFBYyxNQUFBLElBQWQ7UUFBb0IsTUFBQSxJQUFwQjtRQUEwQixFQUFBLEVBQUksTUFBQSxFQUE5QjtRQUF3QyxhQUFBLFdBQXhDOztJQURVO0lBR1osVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsUUFEc0MsRUFFdEMsUUFGc0MsQ0FBeEM7TUFLQSxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUFD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QUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0Isc0JBQWxCO1VBRU4sT0FBTyxDQUFDLG9CQUFSLENBQTZCLEdBQTdCO2lCQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsUUFEc0MsRUFFdEMsUUFGc0MsRUFHdEMsUUFIc0MsQ0FBeEM7UUFQRyxDQUFMO2VBYUEsUUFBQSxDQUFTLFNBQUE7aUJBQUcsR0FBRyxDQUFDLFNBQUosR0FBZ0I7UUFBbkIsQ0FBVDtNQW5CUyxDQUFYO2FBcUJBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO0FBQ3hCLFlBQUE7UUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQUFQLENBQWdDLENBQUMsR0FBRyxDQUFDLE9BQXJDLENBQTZDLGlCQUE3QztRQUVBLEdBQUEsR0FBTSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsSUFBaEM7ZUFFTixNQUFBLENBQU8sR0FBRyxDQUFDLE1BQVgsQ0FBa0IsQ0FBQyxHQUFHLENBQUMsT0FBdkIsQ0FBK0IsaUJBQS9CO01BTHdCLENBQTFCO0lBdkJrRCxDQUFwRDtFQW5NeUIsQ0FBM0I7QUFMQSIsInNvdXJjZXNDb250ZW50IjpbIkNvbG9yID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yJ1xuUGFsZXR0ZSA9IHJlcXVpcmUgJy4uL2xpYi9wYWxldHRlJ1xue1RIRU1FX1ZBUklBQkxFU30gPSByZXF1aXJlICcuLi9saWIvdXJpcydcbntjaGFuZ2UsIGNsaWNrfSA9IHJlcXVpcmUgJy4vaGVscGVycy9ldmVudHMnXG5cbmRlc2NyaWJlICdQYWxldHRlRWxlbWVudCcsIC0+XG4gIFtuZXh0SUQsIHBhbGV0dGUsIHBhbGV0dGVFbGVtZW50LCB3b3Jrc3BhY2VFbGVtZW50LCBwaWdtZW50cywgcHJvamVjdF0gPSBbMF1cblxuICBjcmVhdGVWYXIgPSAobmFtZSwgY29sb3IsIHBhdGgsIGxpbmUsIGlzQWx0ZXJuYXRlPWZhbHNlKSAtPlxuICAgIHtuYW1lLCBjb2xvciwgcGF0aCwgbGluZSwgaWQ6IG5leHRJRCsrLCBpc0FsdGVybmF0ZX1cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJywgW1xuICAgICAgJyouc3R5bCdcbiAgICAgICcqLmxlc3MnXG4gICAgXVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwaWdtZW50cycpLnRoZW4gKHBrZykgLT5cbiAgICAgIHBpZ21lbnRzID0gcGtnLm1haW5Nb2R1bGVcbiAgICAgIHByb2plY3QgPSBwaWdtZW50cy5nZXRQcm9qZWN0KClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIHByb2plY3QuZGVzdHJveSgpXG5cbiAgZGVzY3JpYmUgJ2FzIGEgdmlldyBwcm92aWRlcicsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcGFsZXR0ZSA9IG5ldyBQYWxldHRlKFtcbiAgICAgICAgY3JlYXRlVmFyICdyZWQnLCBuZXcgQ29sb3IoJyNmZjAwMDAnKSwgJ2ZpbGUuc3R5bCcsIDBcbiAgICAgICAgY3JlYXRlVmFyICdncmVlbicsIG5ldyBDb2xvcignIzAwZmYwMCcpLCAnZmlsZS5zdHlsJywgMVxuICAgICAgICBjcmVhdGVWYXIgJ2JsdWUnLCBuZXcgQ29sb3IoJyMwMDAwZmYnKSwgJ2ZpbGUuc3R5bCcsIDJcbiAgICAgICAgY3JlYXRlVmFyICdyZWRDb3B5JywgbmV3IENvbG9yKCcjZmYwMDAwJyksICdmaWxlLnN0eWwnLCAzXG4gICAgICAgIGNyZWF0ZVZhciAncmVkX2NvcHknLCBuZXcgQ29sb3IoJyNmZjAwMDAnKSwgJ2ZpbGUuc3R5bCcsIDMsIHRydWVcbiAgICAgICAgY3JlYXRlVmFyICdyZWQnLCBuZXcgQ29sb3IoJyNmZjAwMDAnKSwgVEhFTUVfVkFSSUFCTEVTLCAwXG4gICAgICBdKVxuXG4gICAgICBwYWxldHRlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhwYWxldHRlKVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShwYWxldHRlRWxlbWVudClcblxuICAgIGl0ICdpcyBhc3NvY2lhdGVkIHdpdGggdGhlIFBhbGV0dGUgbW9kZWwnLCAtPlxuICAgICAgZXhwZWN0KHBhbGV0dGVFbGVtZW50KS50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCAnZG9lcyBub3QgcmVuZGVyIGFsZXJuYXRlIGZvcm0gb2YgYSB2YXJpYWJsZScsIC0+XG4gICAgICBleHBlY3QocGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgpLnRvRXF1YWwoNSlcblxuICAgIGl0ICdkb2VzIG5vdCByZW5kZXIgdGhlIGZpbGUgbGluayB3aGVuIHRoZSB2YXJpYWJsZSBjb21lcyBmcm9tIGEgdGhlbWUnLCAtPlxuICAgICAgZXhwZWN0KHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylbNF0ucXVlcnlTZWxlY3RvcignIFtkYXRhLXZhcmlhYmxlLWlkXScpKS5ub3QudG9FeGlzdCgpXG5cbiAgZGVzY3JpYmUgJ3doZW4gcGlnbWVudHM6c2hvdy1wYWxldHRlIGNvbW1hbmRzIGlzIHRyaWdnZXJlZCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAncGlnbWVudHM6c2hvdy1wYWxldHRlJylcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgcGFsZXR0ZUVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3BpZ21lbnRzLXBhbGV0dGUnKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHBhbGV0dGUgPSBwYWxldHRlRWxlbWVudC5nZXRNb2RlbCgpXG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00ocGFsZXR0ZUVsZW1lbnQpXG5cbiAgICBpdCAnb3BlbnMgYSBwYWxldHRlIGVsZW1lbnQnLCAtPlxuICAgICAgZXhwZWN0KHBhbGV0dGVFbGVtZW50KS50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCAnY3JlYXRlcyBhcyBtYW55IGxpc3QgaXRlbSBhcyB0aGVyZSBpcyBjb2xvcnMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgZXhwZWN0KHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoKS5ub3QudG9FcXVhbCgwKVxuICAgICAgZXhwZWN0KHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoKS50b0VxdWFsKHBhbGV0dGUudmFyaWFibGVzLmZpbHRlcigodikgLT4gbm90IHYuaXNBbHRlcm5hdGUpLmxlbmd0aClcblxuICAgIGl0ICdiaW5kcyBjb2xvcnMgd2l0aCBwcm9qZWN0IHZhcmlhYmxlcycsIC0+XG4gICAgICBwcm9qZWN0VmFyaWFibGVzID0gcHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpXG5cbiAgICAgIGxpID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignbGknKVxuICAgICAgZXhwZWN0KGxpLnF1ZXJ5U2VsZWN0b3IoJy5wYXRoJykudGV4dENvbnRlbnQpLnRvRXF1YWwoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocHJvamVjdFZhcmlhYmxlc1swXS5wYXRoKSlcblxuICAgIGRlc2NyaWJlICdjbGlja2luZyBvbiBhIHJlc3VsdCBwYXRoJywgLT5cbiAgICAgIGl0ICdzaG93cyB0aGUgdmFyaWFibGUgaW4gaXRzIGZpbGUnLCAtPlxuICAgICAgICBzcHlPbihwcm9qZWN0LCAnc2hvd1ZhcmlhYmxlSW5GaWxlJylcblxuICAgICAgICBwYXRoRWxlbWVudCA9IHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhcmlhYmxlLWlkXScpXG5cbiAgICAgICAgY2xpY2socGF0aEVsZW1lbnQpXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gcHJvamVjdC5zaG93VmFyaWFibGVJbkZpbGUuY2FsbENvdW50ID4gMFxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIHNvcnRQYWxldHRlQ29sb3JzIHNldHRpbmdzIGlzIHNldCB0byBjb2xvcicsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc29ydFBhbGV0dGVDb2xvcnMnLCAnYnkgY29sb3InXG5cbiAgICAgIGl0ICdyZW9yZGVycyB0aGUgY29sb3JzJywgLT5cbiAgICAgICAgc29ydGVkQ29sb3JzID0gcHJvamVjdC5nZXRQYWxldHRlKCkuc29ydGVkQnlDb2xvcigpLmZpbHRlcigodikgLT4gbm90IHYuaXNBbHRlcm5hdGUpXG4gICAgICAgIGxpcyA9IHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcblxuICAgICAgICBmb3Ige25hbWV9LGkgaW4gc29ydGVkQ29sb3JzXG4gICAgICAgICAgZXhwZWN0KGxpc1tpXS5xdWVyeVNlbGVjdG9yKCcubmFtZScpLnRleHRDb250ZW50KS50b0VxdWFsKG5hbWUpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgc29ydFBhbGV0dGVDb2xvcnMgc2V0dGluZ3MgaXMgc2V0IHRvIG5hbWUnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnNvcnRQYWxldHRlQ29sb3JzJywgJ2J5IG5hbWUnXG5cbiAgICAgIGl0ICdyZW9yZGVycyB0aGUgY29sb3JzJywgLT5cbiAgICAgICAgc29ydGVkQ29sb3JzID0gcHJvamVjdC5nZXRQYWxldHRlKCkuc29ydGVkQnlOYW1lKCkuZmlsdGVyKCh2KSAtPiBub3Qgdi5pc0FsdGVybmF0ZSlcbiAgICAgICAgbGlzID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKVxuXG4gICAgICAgIGZvciB7bmFtZX0saSBpbiBzb3J0ZWRDb2xvcnNcbiAgICAgICAgICBleHBlY3QobGlzW2ldLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJykudGV4dENvbnRlbnQpLnRvRXF1YWwobmFtZSlcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBncm91cFBhbGV0dGVDb2xvcnMgc2V0dGluZyBpcyBzZXQgdG8gZmlsZScsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuZ3JvdXBQYWxldHRlQ29sb3JzJywgJ2J5IGZpbGUnXG5cbiAgICAgIGl0ICdyZW5kZXJzIHRoZSBsaXN0IHdpdGggc3VibGlzdHMgZm9yIGVhY2ggZmlsZXMnLCAtPlxuICAgICAgICBvbHMgPSBwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdvbCBvbCcpXG4gICAgICAgIGV4cGVjdChvbHMubGVuZ3RoKS50b0VxdWFsKDUpXG5cbiAgICAgIGl0ICdhZGRzIGEgaGVhZGVyIHdpdGggdGhlIGZpbGUgcGF0aCBmb3IgZWFjaCBzdWJsaXN0JywgLT5cbiAgICAgICAgb2xzID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBpZ21lbnRzLWNvbG9yLWdyb3VwLWhlYWRlcicpXG4gICAgICAgIGV4cGVjdChvbHMubGVuZ3RoKS50b0VxdWFsKDUpXG5cbiAgICAgIGRlc2NyaWJlICdhbmQgdGhlIHNvcnRQYWxldHRlQ29sb3JzIGlzIHNldCB0byBuYW1lJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc29ydFBhbGV0dGVDb2xvcnMnLCAnYnkgbmFtZSdcblxuICAgICAgICBpdCAnc29ydHMgdGhlIG5lc3RlZCBsaXN0IGl0ZW1zJywgLT5cbiAgICAgICAgICBwYWxldHRlcyA9IHBhbGV0dGVFbGVtZW50LmdldEZpbGVzUGFsZXR0ZXMoKVxuICAgICAgICAgIG9scyA9IHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5waWdtZW50cy1jb2xvci1ncm91cCcpXG4gICAgICAgICAgbiA9IDBcblxuICAgICAgICAgIGZvciBmaWxlLCBwYWxldHRlIG9mIHBhbGV0dGVzXG4gICAgICAgICAgICBvbCA9IG9sc1tuKytdXG4gICAgICAgICAgICBsaXMgPSBvbC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpXG4gICAgICAgICAgICBzb3J0ZWRDb2xvcnMgPSBwYWxldHRlLnNvcnRlZEJ5TmFtZSgpLmZpbHRlcigodikgLT4gbm90IHYuaXNBbHRlcm5hdGUpXG5cbiAgICAgICAgICAgIGZvciB7bmFtZX0saSBpbiBzb3J0ZWRDb2xvcnNcbiAgICAgICAgICAgICAgZXhwZWN0KGxpc1tpXS5xdWVyeVNlbGVjdG9yKCcubmFtZScpLnRleHRDb250ZW50KS50b0VxdWFsKG5hbWUpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBtZXJnZUNvbG9yRHVwbGljYXRlcycsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLm1lcmdlQ29sb3JEdXBsaWNhdGVzJywgdHJ1ZVxuXG4gICAgICAgIGl0ICdncm91cHMgaWRlbnRpY2FsIGNvbG9ycyB0b2dldGhlcicsIC0+XG4gICAgICAgICAgbGlzID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKVxuXG4gICAgICAgICAgZXhwZWN0KGxpcy5sZW5ndGgpLnRvRXF1YWwoNDApXG5cbiAgICBkZXNjcmliZSAnc29ydGluZyBzZWxlY3RvcicsIC0+XG4gICAgICBbc29ydFNlbGVjdF0gPSBbXVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiBjaGFuZ2VkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHNvcnRTZWxlY3QgPSBwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc29ydC1wYWxldHRlLWNvbG9ycycpXG4gICAgICAgICAgc29ydFNlbGVjdC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9XCJieSBuYW1lXCJdJykuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpXG5cbiAgICAgICAgICBjaGFuZ2Uoc29ydFNlbGVjdClcblxuICAgICAgICBpdCAnY2hhbmdlcyB0aGUgc2V0dGluZ3MgdmFsdWUnLCAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvcnRQYWxldHRlQ29sb3JzJykpLnRvRXF1YWwoJ2J5IG5hbWUnKVxuXG4gICAgZGVzY3JpYmUgJ2dyb3VwaW5nIHNlbGVjdG9yJywgLT5cbiAgICAgIFtncm91cFNlbGVjdF0gPSBbXVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiBjaGFuZ2VkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGdyb3VwU2VsZWN0ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI2dyb3VwLXBhbGV0dGUtY29sb3JzJylcbiAgICAgICAgICBncm91cFNlbGVjdC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9XCJieSBmaWxlXCJdJykuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpXG5cbiAgICAgICAgICBjaGFuZ2UoZ3JvdXBTZWxlY3QpXG5cbiAgICAgICAgaXQgJ2NoYW5nZXMgdGhlIHNldHRpbmdzIHZhbHVlJywgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5ncm91cFBhbGV0dGVDb2xvcnMnKSkudG9FcXVhbCgnYnkgZmlsZScpXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHBhbGV0dGUgc2V0dGluZ3MgZGlmZmVycyBmcm9tIGRlZmF1bHRzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLnNvcnRQYWxldHRlQ29sb3JzJywgJ2J5IG5hbWUnKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5ncm91cFBhbGV0dGVDb2xvcnMnLCAnYnkgZmlsZScpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLm1lcmdlQ29sb3JEdXBsaWNhdGVzJywgdHJ1ZSlcblxuICAgIGRlc2NyaWJlICd3aGVuIHBpZ21lbnRzOnNob3ctcGFsZXR0ZSBjb21tYW5kcyBpcyB0cmlnZ2VyZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdwaWdtZW50czpzaG93LXBhbGV0dGUnKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgcGFsZXR0ZUVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3BpZ21lbnRzLXBhbGV0dGUnKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwYWxldHRlID0gcGFsZXR0ZUVsZW1lbnQuZ2V0TW9kZWwoKVxuXG4gICAgICBkZXNjcmliZSAndGhlIHNvcnRpbmcgc2VsZWN0b3InLCAtPlxuICAgICAgICBpdCAnc2VsZWN0cyB0aGUgY3VycmVudCB2YWx1ZScsIC0+XG4gICAgICAgICAgc29ydFNlbGVjdCA9IHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzb3J0LXBhbGV0dGUtY29sb3JzJylcbiAgICAgICAgICBleHBlY3Qoc29ydFNlbGVjdC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bc2VsZWN0ZWRdJykudmFsdWUpLnRvRXF1YWwoJ2J5IG5hbWUnKVxuXG4gICAgICBkZXNjcmliZSAndGhlIGdyb3VwaW5nIHNlbGVjdG9yJywgLT5cbiAgICAgICAgaXQgJ3NlbGVjdHMgdGhlIGN1cnJlbnQgdmFsdWUnLCAtPlxuICAgICAgICAgIGdyb3VwU2VsZWN0ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI2dyb3VwLXBhbGV0dGUtY29sb3JzJylcbiAgICAgICAgICBleHBlY3QoZ3JvdXBTZWxlY3QucXVlcnlTZWxlY3Rvcignb3B0aW9uW3NlbGVjdGVkXScpLnZhbHVlKS50b0VxdWFsKCdieSBmaWxlJylcblxuICAgICAgaXQgJ2NoZWNrcyB0aGUgbWVyZ2UgY2hlY2tib3gnLCAtPlxuICAgICAgICBtZXJnZUNoZWNrQm94ID0gcGFsZXR0ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI21lcmdlLWR1cGxpY2F0ZXMnKVxuICAgICAgICBleHBlY3QobWVyZ2VDaGVja0JveC5jaGVja2VkKS50b0JlVHJ1dGh5KClcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgcHJvamVjdCB2YXJpYWJsZXMgYXJlIG1vZGlmaWVkJywgLT5cbiAgICBbc3B5LCBpbml0aWFsQ29sb3JDb3VudF0gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3BpZ21lbnRzOnNob3ctcGFsZXR0ZScpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHBhbGV0dGVFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdwaWdtZW50cy1wYWxldHRlJylcblxuICAgICAgcnVucyAtPlxuICAgICAgICBwYWxldHRlID0gcGFsZXR0ZUVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgICAgICBpbml0aWFsQ29sb3JDb3VudCA9IHBhbGV0dGUuZ2V0Q29sb3JzQ291bnQoKVxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb25EaWRVcGRhdGVWYXJpYWJsZXMnKVxuXG4gICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMoc3B5KVxuXG4gICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc291cmNlTmFtZXMnLCBbXG4gICAgICAgICAgJyouc3R5bCdcbiAgICAgICAgICAnKi5sZXNzJ1xuICAgICAgICAgICcqLnNhc3MnXG4gICAgICAgIF1cblxuICAgICAgd2FpdHNGb3IgLT4gc3B5LmNhbGxDb3VudCA+IDBcblxuICAgIGl0ICd1cGRhdGVzIHRoZSBwYWxldHRlJywgLT5cbiAgICAgIGV4cGVjdChwYWxldHRlLmdldENvbG9yc0NvdW50KCkpLm5vdC50b0VxdWFsKGluaXRpYWxDb2xvckNvdW50KVxuXG4gICAgICBsaXMgPSBwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpXG5cbiAgICAgIGV4cGVjdChsaXMubGVuZ3RoKS5ub3QudG9FcXVhbChpbml0aWFsQ29sb3JDb3VudClcbiJdfQ==

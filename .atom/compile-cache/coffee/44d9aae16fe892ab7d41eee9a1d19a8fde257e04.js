(function() {
  describe('autocomplete provider', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, jasmineContent, pigments, project, ref;
    ref = [], completionDelay = ref[0], editor = ref[1], editorView = ref[2], pigments = ref[3], autocompleteMain = ref[4], autocompleteManager = ref[5], jasmineContent = ref[6], project = ref[7];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        jasmineContent = document.body.querySelector('#jasmine-content');
        atom.config.set('pigments.autocompleteScopes', ['*']);
        atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmineContent.appendChild(workspaceElement);
      });
      waitsForPromise('autocomplete-plus activation', function() {
        return atom.packages.activatePackage('autocomplete-plus').then(function(pkg) {
          return autocompleteMain = pkg.mainModule;
        });
      });
      waitsForPromise('pigments activation', function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          return pigments = pkg.mainModule;
        });
      });
      runs(function() {
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        return spyOn(pigments, 'provideAutocomplete').andCallThrough();
      });
      waitsForPromise('open sample file', function() {
        return atom.workspace.open('sample.styl').then(function(e) {
          editor = e;
          editor.setText('');
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise('pigments project initialized', function() {
        project = pigments.getProject();
        return project.initialize();
      });
      return runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
      });
    });
    describe('writing the name of a color', function() {
      it('returns suggestions for the matching colors', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('border: 1px solid ');
          editor.moveToBottom();
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          var popup, preview;
          popup = editorView.querySelector('.autocomplete-plus');
          expect(popup).toExist();
          expect(popup.querySelector('span.word').textContent).toEqual('base-color');
          preview = popup.querySelector('.color-suggestion-preview');
          expect(preview).toExist();
          return expect(preview.style.background).toEqual('rgb(255, 255, 255)');
        });
      });
      it('replaces the prefix even when it contains a @', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('@');
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return expect(editor.getText()).not.toContain('@@');
        });
      });
      it('replaces the prefix even when it contains a $', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('$');
          editor.insertText('o');
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          expect(editor.getText()).toContain('$other-color');
          return expect(editor.getText()).not.toContain('$$');
        });
      });
      return describe('when the extendAutocompleteToColorValue setting is enabled', function() {
        beforeEach(function() {
          return atom.config.set('pigments.extendAutocompleteToColorValue', true);
        });
        describe('with an opaque color', function() {
          return it('displays the color hexadecimal code in the completion item', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('b');
              editor.insertText('a');
              editor.insertText('s');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('base-color');
              return expect(popup.querySelector('span.right-label').textContent).toContain('#ffffff');
            });
          });
        });
        describe('when the autocompleteSuggestionsFromValue setting is enabled', function() {
          beforeEach(function() {
            return atom.config.set('pigments.autocompleteSuggestionsFromValue', true);
          });
          it('suggests color variables from hexadecimal values', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('#');
              editor.insertText('f');
              editor.insertText('f');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('var1');
              return expect(popup.querySelector('span.right-label').textContent).toContain('#ffffff');
            });
          });
          it('suggests color variables from hexadecimal values when in a CSS expression', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('border: 1px solid ');
              editor.moveToBottom();
              editor.insertText('#');
              editor.insertText('f');
              editor.insertText('f');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('var1');
              return expect(popup.querySelector('span.right-label').textContent).toContain('#ffffff');
            });
          });
          it('suggests color variables from rgb values', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('border: 1px solid ');
              editor.moveToBottom();
              editor.insertText('r');
              editor.insertText('g');
              editor.insertText('b');
              editor.insertText('(');
              editor.insertText('2');
              editor.insertText('5');
              editor.insertText('5');
              editor.insertText(',');
              editor.insertText(' ');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('var1');
              return expect(popup.querySelector('span.right-label').textContent).toContain('#ffffff');
            });
          });
          return describe('and when extendAutocompleteToVariables is true', function() {
            beforeEach(function() {
              return atom.config.set('pigments.extendAutocompleteToVariables', true);
            });
            return it('returns suggestions for the matching variable value', function() {
              runs(function() {
                expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
                editor.moveToBottom();
                editor.insertText('border: ');
                editor.moveToBottom();
                editor.insertText('6');
                editor.insertText('p');
                editor.insertText('x');
                editor.insertText(' ');
                return advanceClock(completionDelay);
              });
              waitsFor(function() {
                return autocompleteManager.displaySuggestions.calls.length === 1;
              });
              waitsFor(function() {
                return editorView.querySelector('.autocomplete-plus li') != null;
              });
              return runs(function() {
                var popup;
                popup = editorView.querySelector('.autocomplete-plus');
                expect(popup).toExist();
                expect(popup.querySelector('span.word').textContent).toEqual('button-padding');
                return expect(popup.querySelector('span.right-label').textContent).toEqual('6px 8px');
              });
            });
          });
        });
        return describe('with a transparent color', function() {
          return it('displays the color hexadecimal code in the completion item', function() {
            runs(function() {
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              editor.moveToBottom();
              editor.insertText('$');
              editor.insertText('o');
              editor.insertText('t');
              return advanceClock(completionDelay);
            });
            waitsFor(function() {
              return autocompleteManager.displaySuggestions.calls.length === 1;
            });
            waitsFor(function() {
              return editorView.querySelector('.autocomplete-plus li') != null;
            });
            return runs(function() {
              var popup;
              popup = editorView.querySelector('.autocomplete-plus');
              expect(popup).toExist();
              expect(popup.querySelector('span.word').textContent).toEqual('$other-color');
              return expect(popup.querySelector('span.right-label').textContent).toContain('rgba(255,0,0,0.5)');
            });
          });
        });
      });
    });
    describe('writing the name of a non-color variable', function() {
      return it('returns suggestions for the matching variable', function() {
        atom.config.set('pigments.extendAutocompleteToVariables', false);
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('f');
          editor.insertText('o');
          editor.insertText('o');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
    return describe('when extendAutocompleteToVariables is true', function() {
      beforeEach(function() {
        return atom.config.set('pigments.extendAutocompleteToVariables', true);
      });
      return describe('writing the name of a non-color variable', function() {
        return it('returns suggestions for the matching variable', function() {
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            editor.moveToBottom();
            editor.insertText('b');
            editor.insertText('u');
            editor.insertText('t');
            editor.insertText('t');
            editor.insertText('o');
            editor.insertText('n');
            editor.insertText('-');
            editor.insertText('p');
            return advanceClock(completionDelay);
          });
          waitsFor(function() {
            return autocompleteManager.displaySuggestions.calls.length === 1;
          });
          waitsFor(function() {
            return editorView.querySelector('.autocomplete-plus li') != null;
          });
          return runs(function() {
            var popup;
            popup = editorView.querySelector('.autocomplete-plus');
            expect(popup).toExist();
            expect(popup.querySelector('span.word').textContent).toEqual('button-padding');
            return expect(popup.querySelector('span.right-label').textContent).toEqual('6px 8px');
          });
        });
      });
    });
  });

  describe('autocomplete provider', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, jasmineContent, pigments, project, ref;
    ref = [], completionDelay = ref[0], editor = ref[1], editorView = ref[2], pigments = ref[3], autocompleteMain = ref[4], autocompleteManager = ref[5], jasmineContent = ref[6], project = ref[7];
    return describe('for sass files', function() {
      beforeEach(function() {
        runs(function() {
          var workspaceElement;
          jasmineContent = document.body.querySelector('#jasmine-content');
          atom.config.set('pigments.autocompleteScopes', ['*']);
          atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.scss']);
          atom.config.set('autocomplete-plus.enableAutoActivation', true);
          completionDelay = 100;
          atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
          completionDelay += 100;
          workspaceElement = atom.views.getView(atom.workspace);
          return jasmineContent.appendChild(workspaceElement);
        });
        waitsForPromise('autocomplete-plus activation', function() {
          return atom.packages.activatePackage('autocomplete-plus').then(function(pkg) {
            return autocompleteMain = pkg.mainModule;
          });
        });
        waitsForPromise('pigments activation', function() {
          return atom.packages.activatePackage('pigments').then(function(pkg) {
            return pigments = pkg.mainModule;
          });
        });
        runs(function() {
          spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
          return spyOn(pigments, 'provideAutocomplete').andCallThrough();
        });
        waitsForPromise('open sample file', function() {
          return atom.workspace.open('sample.styl').then(function(e) {
            editor = e;
            return editorView = atom.views.getView(editor);
          });
        });
        waitsForPromise('pigments project initialized', function() {
          project = pigments.getProject();
          return project.initialize();
        });
        return runs(function() {
          autocompleteManager = autocompleteMain.autocompleteManager;
          spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
          return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        });
      });
      return it('does not display the alternate sass version', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('$');
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor('suggestions displayed callback', function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor('autocomplete lis', function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          var hasAlternate, lis;
          lis = editorView.querySelectorAll('.autocomplete-plus li');
          hasAlternate = Array.prototype.some.call(lis, function(li) {
            return li.querySelector('span.word').textContent === '$base_color';
          });
          return expect(hasAlternate).toBeFalsy();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3BpZ21lbnRzLXByb3ZpZGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7QUFDaEMsUUFBQTtJQUFBLE1BQWtILEVBQWxILEVBQUMsd0JBQUQsRUFBa0IsZUFBbEIsRUFBMEIsbUJBQTFCLEVBQXNDLGlCQUF0QyxFQUFnRCx5QkFBaEQsRUFBa0UsNEJBQWxFLEVBQXVGLHVCQUF2RixFQUF1RztJQUV2RyxVQUFBLENBQVcsU0FBQTtNQUNULElBQUEsQ0FBSyxTQUFBO0FBQ0gsWUFBQTtRQUFBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFkLENBQTRCLGtCQUE1QjtRQUVqQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLENBQUMsR0FBRCxDQUEvQztRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsV0FEc0MsRUFFdEMsV0FGc0MsQ0FBeEM7UUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFEO1FBRUEsZUFBQSxHQUFrQjtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLEVBQXlELGVBQXpEO1FBQ0EsZUFBQSxJQUFtQjtRQUNuQixnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO2VBRW5CLGNBQWMsQ0FBQyxXQUFmLENBQTJCLGdCQUEzQjtNQWpCRyxDQUFMO01BbUJBLGVBQUEsQ0FBZ0IsOEJBQWhCLEVBQWdELFNBQUE7ZUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG1CQUE5QixDQUFrRCxD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QUE7VUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtVQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7aUJBRUEsWUFBQSxDQUFhLGVBQWI7UUFSRyxDQUFMO1FBVUEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7aUJBQ3pDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUE3QyxLQUF1RDtRQURkLENBQTNDO1FBR0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7aUJBQzNCO1FBRDJCLENBQTdCO2VBR0EsSUFBQSxDQUFLLFNBQUE7QUFDSCxjQUFBO1VBQUEsR0FBQSxHQUFNLFVBQVUsQ0FBQyxnQkFBWCxDQUE0Qix1QkFBNUI7VUFDTixZQUFBLEdBQWUsS0FBSyxDQUFBLFNBQUUsQ0FBQSxJQUFJLENBQUMsSUFBWixDQUFpQixHQUFqQixFQUFzQixTQUFDLEVBQUQ7bUJBQ25DLEVBQUUsQ0FBQyxhQUFILENBQWlCLFdBQWpCLENBQTZCLENBQUMsV0FBOUIsS0FBNkM7VUFEVixDQUF0QjtpQkFHZixNQUFBLENBQU8sWUFBUCxDQUFvQixDQUFDLFNBQXJCLENBQUE7UUFMRyxDQUFMO01BakJnRCxDQUFsRDtJQS9DeUIsQ0FBM0I7RUFIZ0MsQ0FBbEM7QUFyVkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlc2NyaWJlICdhdXRvY29tcGxldGUgcHJvdmlkZXInLCAtPlxuICBbY29tcGxldGlvbkRlbGF5LCBlZGl0b3IsIGVkaXRvclZpZXcsIHBpZ21lbnRzLCBhdXRvY29tcGxldGVNYWluLCBhdXRvY29tcGxldGVNYW5hZ2VyLCBqYXNtaW5lQ29udGVudCwgcHJvamVjdF0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBydW5zIC0+XG4gICAgICBqYXNtaW5lQ29udGVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuYXV0b2NvbXBsZXRlU2NvcGVzJywgWycqJ10pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJywgW1xuICAgICAgICAnKiovKi5zdHlsJ1xuICAgICAgICAnKiovKi5sZXNzJ1xuICAgICAgXSlcblxuICAgICAgIyBTZXQgdG8gbGl2ZSBjb21wbGV0aW9uXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1wbHVzLmVuYWJsZUF1dG9BY3RpdmF0aW9uJywgdHJ1ZSlcbiAgICAgICMgU2V0IHRoZSBjb21wbGV0aW9uIGRlbGF5XG4gICAgICBjb21wbGV0aW9uRGVsYXkgPSAxMDBcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXBsdXMuYXV0b0FjdGl2YXRpb25EZWxheScsIGNvbXBsZXRpb25EZWxheSlcbiAgICAgIGNvbXBsZXRpb25EZWxheSArPSAxMDAgIyBSZW5kZXJpbmcgZGVsYXlcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG5cbiAgICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgJ2F1dG9jb21wbGV0ZS1wbHVzIGFjdGl2YXRpb24nLCAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1wbHVzJykudGhlbiAocGtnKSAtPlxuICAgICAgICBhdXRvY29tcGxldGVNYWluID0gcGtnLm1haW5Nb2R1bGVcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAncGlnbWVudHMgYWN0aXZhdGlvbicsIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgncGlnbWVudHMnKS50aGVuIChwa2cpIC0+XG4gICAgICAgIHBpZ21lbnRzID0gcGtnLm1haW5Nb2R1bGVcblxuICAgIHJ1bnMgLT5cbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbihwaWdtZW50cywgJ3Byb3ZpZGVBdXRvY29tcGxldGUnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgJ29wZW4gc2FtcGxlIGZpbGUnLCAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnN0eWwnKS50aGVuIChlKSAtPlxuICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgIGVkaXRvci5zZXRUZXh0ICcnXG4gICAgICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlICdwaWdtZW50cyBwcm9qZWN0IGluaXRpYWxpemVkJywgLT5cbiAgICAgIHByb2plY3QgPSBwaWdtZW50cy5nZXRQcm9qZWN0KClcbiAgICAgIHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICBydW5zIC0+XG4gICAgICBhdXRvY29tcGxldGVNYW5hZ2VyID0gYXV0b2NvbXBsZXRlTWFpbi5hdXRvY29tcGxldGVNYW5hZ2VyXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYW5hZ2VyLCAnZmluZFN1Z2dlc3Rpb25zJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2Rpc3BsYXlTdWdnZXN0aW9ucycpLmFuZENhbGxUaHJvdWdoKClcblxuICBkZXNjcmliZSAnd3JpdGluZyB0aGUgbmFtZSBvZiBhIGNvbG9yJywgLT5cbiAgICBpdCAncmV0dXJucyBzdWdnZXN0aW9ucyBmb3IgdGhlIG1hdGNoaW5nIGNvbG9ycycsIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdib3JkZXI6IDFweCBzb2xpZCAnKVxuICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2InKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnYScpXG5cbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgd2FpdHNGb3IgLT4gZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMgbGknKT9cblxuICAgICAgcnVucyAtPlxuICAgICAgICBwb3B1cCA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJylcbiAgICAgICAgZXhwZWN0KHBvcHVwKS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ud29yZCcpLnRleHRDb250ZW50KS50b0VxdWFsKCdiYXNlLWNvbG9yJylcblxuICAgICAgICBwcmV2aWV3ID0gcG9wdXAucXVlcnlTZWxlY3RvcignLmNvbG9yLXN1Z2dlc3Rpb24tcHJldmlldycpXG4gICAgICAgIGV4cGVjdChwcmV2aWV3KS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KHByZXZpZXcuc3R5bGUuYmFja2dyb3VuZCkudG9FcXVhbCgncmdiKDI1NSwgMjU1LCAyNTUpJylcblxuICAgIGl0ICdyZXBsYWNlcyB0aGUgcHJlZml4IGV2ZW4gd2hlbiBpdCBjb250YWlucyBhIEAnLCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnQCcpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdiJylcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2EnKVxuXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICAgIHdhaXRzRm9yIC0+IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzIGxpJyk/XG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnYXV0b2NvbXBsZXRlLXBsdXM6Y29uZmlybScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS5ub3QudG9Db250YWluICdAQCdcblxuICAgIGl0ICdyZXBsYWNlcyB0aGUgcHJlZml4IGV2ZW4gd2hlbiBpdCBjb250YWlucyBhICQnLCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnJCcpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdvJylcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3QnKVxuXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICAgIHdhaXRzRm9yIC0+IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzIGxpJyk/XG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnYXV0b2NvbXBsZXRlLXBsdXM6Y29uZmlybScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0NvbnRhaW4gJyRvdGhlci1jb2xvcidcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLm5vdC50b0NvbnRhaW4gJyQkJ1xuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGV4dGVuZEF1dG9jb21wbGV0ZVRvQ29sb3JWYWx1ZSBzZXR0aW5nIGlzIGVuYWJsZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLmV4dGVuZEF1dG9jb21wbGV0ZVRvQ29sb3JWYWx1ZScsIHRydWUpXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGFuIG9wYXF1ZSBjb2xvcicsIC0+XG4gICAgICAgIGl0ICdkaXNwbGF5cyB0aGUgY29sb3IgaGV4YWRlY2ltYWwgY29kZSBpbiB0aGUgY29tcGxldGlvbiBpdGVtJywgLT5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdiJylcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdhJylcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdzJylcblxuICAgICAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzIGxpJyk/XG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwb3B1cCA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJylcbiAgICAgICAgICAgIGV4cGVjdChwb3B1cCkudG9FeGlzdCgpXG4gICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi53b3JkJykudGV4dENvbnRlbnQpLnRvRXF1YWwoJ2Jhc2UtY29sb3InKVxuXG4gICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi5yaWdodC1sYWJlbCcpLnRleHRDb250ZW50KS50b0NvbnRhaW4oJyNmZmZmZmYnKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNGcm9tVmFsdWUgc2V0dGluZyBpcyBlbmFibGVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuYXV0b2NvbXBsZXRlU3VnZ2VzdGlvbnNGcm9tVmFsdWUnLCB0cnVlKVxuXG4gICAgICAgIGl0ICdzdWdnZXN0cyBjb2xvciB2YXJpYWJsZXMgZnJvbSBoZXhhZGVjaW1hbCB2YWx1ZXMnLCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJyMnKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2YnKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2YnKVxuXG4gICAgICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMgbGknKT9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBvcHVwID0gZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKVxuICAgICAgICAgICAgZXhwZWN0KHBvcHVwKS50b0V4aXN0KClcbiAgICAgICAgICAgIGV4cGVjdChwb3B1cC5xdWVyeVNlbGVjdG9yKCdzcGFuLndvcmQnKS50ZXh0Q29udGVudCkudG9FcXVhbCgndmFyMScpXG5cbiAgICAgICAgICAgIGV4cGVjdChwb3B1cC5xdWVyeVNlbGVjdG9yKCdzcGFuLnJpZ2h0LWxhYmVsJykudGV4dENvbnRlbnQpLnRvQ29udGFpbignI2ZmZmZmZicpXG5cbiAgICAgICAgaXQgJ3N1Z2dlc3RzIGNvbG9yIHZhcmlhYmxlcyBmcm9tIGhleGFkZWNpbWFsIHZhbHVlcyB3aGVuIGluIGEgQ1NTIGV4cHJlc3Npb24nLCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2JvcmRlcjogMXB4IHNvbGlkICcpXG4gICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCcjJylcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdmJylcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdmJylcblxuICAgICAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzIGxpJyk/XG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwb3B1cCA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJylcbiAgICAgICAgICAgIGV4cGVjdChwb3B1cCkudG9FeGlzdCgpXG4gICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi53b3JkJykudGV4dENvbnRlbnQpLnRvRXF1YWwoJ3ZhcjEnKVxuXG4gICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi5yaWdodC1sYWJlbCcpLnRleHRDb250ZW50KS50b0NvbnRhaW4oJyNmZmZmZmYnKVxuXG4gICAgICAgIGl0ICdzdWdnZXN0cyBjb2xvciB2YXJpYWJsZXMgZnJvbSByZ2IgdmFsdWVzJywgLT5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdib3JkZXI6IDFweCBzb2xpZCAnKVxuICAgICAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgncicpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnZycpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnYicpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnKCcpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnMicpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnNScpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnNScpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLCcpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnICcpXG5cbiAgICAgICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgICBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyBsaScpP1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgcG9wdXAgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpXG4gICAgICAgICAgICBleHBlY3QocG9wdXApLnRvRXhpc3QoKVxuICAgICAgICAgICAgZXhwZWN0KHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ud29yZCcpLnRleHRDb250ZW50KS50b0VxdWFsKCd2YXIxJylcblxuICAgICAgICAgICAgZXhwZWN0KHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ucmlnaHQtbGFiZWwnKS50ZXh0Q29udGVudCkudG9Db250YWluKCcjZmZmZmZmJylcblxuICAgICAgICBkZXNjcmliZSAnYW5kIHdoZW4gZXh0ZW5kQXV0b2NvbXBsZXRlVG9WYXJpYWJsZXMgaXMgdHJ1ZScsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5leHRlbmRBdXRvY29tcGxldGVUb1ZhcmlhYmxlcycsIHRydWUpXG5cbiAgICAgICAgICBpdCAncmV0dXJucyBzdWdnZXN0aW9ucyBmb3IgdGhlIG1hdGNoaW5nIHZhcmlhYmxlIHZhbHVlJywgLT5cbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2JvcmRlcjogJylcbiAgICAgICAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCc2JylcbiAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3AnKVxuICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgneCcpXG4gICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCcgJylcblxuICAgICAgICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyBsaScpP1xuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIHBvcHVwID0gZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKVxuICAgICAgICAgICAgICBleHBlY3QocG9wdXApLnRvRXhpc3QoKVxuICAgICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi53b3JkJykudGV4dENvbnRlbnQpLnRvRXF1YWwoJ2J1dHRvbi1wYWRkaW5nJylcblxuICAgICAgICAgICAgICBleHBlY3QocG9wdXAucXVlcnlTZWxlY3Rvcignc3Bhbi5yaWdodC1sYWJlbCcpLnRleHRDb250ZW50KS50b0VxdWFsKCc2cHggOHB4JylcblxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBhIHRyYW5zcGFyZW50IGNvbG9yJywgLT5cbiAgICAgICAgaXQgJ2Rpc3BsYXlzIHRoZSBjb2xvciBoZXhhZGVjaW1hbCBjb2RlIGluIHRoZSBjb21wbGV0aW9uIGl0ZW0nLCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJyQnKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ28nKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3QnKVxuXG4gICAgICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMgbGknKT9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBvcHVwID0gZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKVxuICAgICAgICAgICAgZXhwZWN0KHBvcHVwKS50b0V4aXN0KClcbiAgICAgICAgICAgIGV4cGVjdChwb3B1cC5xdWVyeVNlbGVjdG9yKCdzcGFuLndvcmQnKS50ZXh0Q29udGVudCkudG9FcXVhbCgnJG90aGVyLWNvbG9yJylcblxuICAgICAgICAgICAgZXhwZWN0KHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ucmlnaHQtbGFiZWwnKS50ZXh0Q29udGVudCkudG9Db250YWluKCdyZ2JhKDI1NSwwLDAsMC41KScpXG5cbiAgZGVzY3JpYmUgJ3dyaXRpbmcgdGhlIG5hbWUgb2YgYSBub24tY29sb3IgdmFyaWFibGUnLCAtPlxuICAgIGl0ICdyZXR1cm5zIHN1Z2dlc3Rpb25zIGZvciB0aGUgbWF0Y2hpbmcgdmFyaWFibGUnLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5leHRlbmRBdXRvY29tcGxldGVUb1ZhcmlhYmxlcycsIGZhbHNlKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnZicpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdvJylcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ28nKVxuXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJykpLm5vdC50b0V4aXN0KClcblxuICBkZXNjcmliZSAnd2hlbiBleHRlbmRBdXRvY29tcGxldGVUb1ZhcmlhYmxlcyBpcyB0cnVlJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLmV4dGVuZEF1dG9jb21wbGV0ZVRvVmFyaWFibGVzJywgdHJ1ZSlcblxuICAgIGRlc2NyaWJlICd3cml0aW5nIHRoZSBuYW1lIG9mIGEgbm9uLWNvbG9yIHZhcmlhYmxlJywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIHN1Z2dlc3Rpb25zIGZvciB0aGUgbWF0Y2hpbmcgdmFyaWFibGUnLCAtPlxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdiJylcbiAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgndScpXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3QnKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCd0JylcbiAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnbycpXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ24nKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCctJylcbiAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgncCcpXG5cbiAgICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgICB3YWl0c0ZvciAtPiBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyBsaScpP1xuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwb3B1cCA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJylcbiAgICAgICAgICBleHBlY3QocG9wdXApLnRvRXhpc3QoKVxuICAgICAgICAgIGV4cGVjdChwb3B1cC5xdWVyeVNlbGVjdG9yKCdzcGFuLndvcmQnKS50ZXh0Q29udGVudCkudG9FcXVhbCgnYnV0dG9uLXBhZGRpbmcnKVxuXG4gICAgICAgICAgZXhwZWN0KHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4ucmlnaHQtbGFiZWwnKS50ZXh0Q29udGVudCkudG9FcXVhbCgnNnB4IDhweCcpXG5cbmRlc2NyaWJlICdhdXRvY29tcGxldGUgcHJvdmlkZXInLCAtPlxuICBbY29tcGxldGlvbkRlbGF5LCBlZGl0b3IsIGVkaXRvclZpZXcsIHBpZ21lbnRzLCBhdXRvY29tcGxldGVNYWluLCBhdXRvY29tcGxldGVNYW5hZ2VyLCBqYXNtaW5lQ29udGVudCwgcHJvamVjdF0gPSBbXVxuXG4gIGRlc2NyaWJlICdmb3Igc2FzcyBmaWxlcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICBqYXNtaW5lQ29udGVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5hdXRvY29tcGxldGVTY29wZXMnLCBbJyonXSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtcbiAgICAgICAgICAnKiovKi5zYXNzJ1xuICAgICAgICAgICcqKi8qLnNjc3MnXG4gICAgICAgIF0pXG5cbiAgICAgICAgIyBTZXQgdG8gbGl2ZSBjb21wbGV0aW9uXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nLCB0cnVlKVxuICAgICAgICAjIFNldCB0aGUgY29tcGxldGlvbiBkZWxheVxuICAgICAgICBjb21wbGV0aW9uRGVsYXkgPSAxMDBcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcGx1cy5hdXRvQWN0aXZhdGlvbkRlbGF5JywgY29tcGxldGlvbkRlbGF5KVxuICAgICAgICBjb21wbGV0aW9uRGVsYXkgKz0gMTAwICMgUmVuZGVyaW5nIGRlbGF5XG4gICAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG5cbiAgICAgICAgamFzbWluZUNvbnRlbnQuYXBwZW5kQ2hpbGQod29ya3NwYWNlRWxlbWVudClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlICdhdXRvY29tcGxldGUtcGx1cyBhY3RpdmF0aW9uJywgLT5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1wbHVzJykudGhlbiAocGtnKSAtPlxuICAgICAgICAgIGF1dG9jb21wbGV0ZU1haW4gPSBwa2cubWFpbk1vZHVsZVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgJ3BpZ21lbnRzIGFjdGl2YXRpb24nLCAtPlxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgncGlnbWVudHMnKS50aGVuIChwa2cpIC0+XG4gICAgICAgICAgcGlnbWVudHMgPSBwa2cubWFpbk1vZHVsZVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHNweU9uKHBpZ21lbnRzLCAncHJvdmlkZUF1dG9jb21wbGV0ZScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlICdvcGVuIHNhbXBsZSBmaWxlJywgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnN0eWwnKS50aGVuIChlKSAtPlxuICAgICAgICAgIGVkaXRvciA9IGVcbiAgICAgICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcblxuICAgICAgd2FpdHNGb3JQcm9taXNlICdwaWdtZW50cyBwcm9qZWN0IGluaXRpYWxpemVkJywgLT5cbiAgICAgICAgcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuICAgICAgICBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIgPSBhdXRvY29tcGxldGVNYWluLmF1dG9jb21wbGV0ZU1hbmFnZXJcbiAgICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2ZpbmRTdWdnZXN0aW9ucycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2Rpc3BsYXlTdWdnZXN0aW9ucycpLmFuZENhbGxUaHJvdWdoKClcblxuICAgIGl0ICdkb2VzIG5vdCBkaXNwbGF5IHRoZSBhbHRlcm5hdGUgc2FzcyB2ZXJzaW9uJywgLT5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJyQnKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnYicpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdhJylcblxuICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICB3YWl0c0ZvciAnc3VnZ2VzdGlvbnMgZGlzcGxheWVkIGNhbGxiYWNrJywgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgd2FpdHNGb3IgJ2F1dG9jb21wbGV0ZSBsaXMnLCAtPlxuICAgICAgICBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyBsaScpP1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGxpcyA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvckFsbCgnLmF1dG9jb21wbGV0ZS1wbHVzIGxpJylcbiAgICAgICAgaGFzQWx0ZXJuYXRlID0gQXJyYXk6OnNvbWUuY2FsbCBsaXMsIChsaSkgLT5cbiAgICAgICAgICBsaS5xdWVyeVNlbGVjdG9yKCdzcGFuLndvcmQnKS50ZXh0Q29udGVudCBpcyAnJGJhc2VfY29sb3InXG5cbiAgICAgICAgZXhwZWN0KGhhc0FsdGVybmF0ZSkudG9CZUZhbHN5KClcbiJdfQ==

(function() {
  var ColorSearch, click;

  click = require('./helpers/events').click;

  ColorSearch = require('../lib/color-search');

  describe('ColorResultsElement', function() {
    var completeSpy, findSpy, pigments, project, ref, resultsElement, search;
    ref = [], search = ref[0], resultsElement = ref[1], pigments = ref[2], project = ref[3], completeSpy = ref[4], findSpy = ref[5];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      waitsForPromise(function() {
        return project.initialize();
      });
      return runs(function() {
        search = project.findAllColors();
        spyOn(search, 'search').andCallThrough();
        completeSpy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(completeSpy);
        resultsElement = atom.views.getView(search);
        return jasmine.attachToDOM(resultsElement);
      });
    });
    afterEach(function() {
      return waitsFor(function() {
        return completeSpy.callCount > 0;
      });
    });
    it('is associated with ColorSearch model', function() {
      return expect(resultsElement).toBeDefined();
    });
    it('starts the search', function() {
      return expect(search.search).toHaveBeenCalled();
    });
    return describe('when matches are found', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return completeSpy.callCount > 0;
        });
      });
      it('groups results by files', function() {
        var fileResults;
        fileResults = resultsElement.querySelectorAll('.list-nested-item');
        expect(fileResults.length).toEqual(8);
        return expect(fileResults[0].querySelectorAll('li.list-item').length).toEqual(3);
      });
      describe('when a file item is clicked', function() {
        var fileItem;
        fileItem = [][0];
        beforeEach(function() {
          fileItem = resultsElement.querySelector('.list-nested-item > .list-item');
          return click(fileItem);
        });
        return it('collapses the file matches', function() {
          return expect(resultsElement.querySelector('.list-nested-item.collapsed')).toExist();
        });
      });
      return describe('when a matches item is clicked', function() {
        var matchItem, ref1, spy;
        ref1 = [], matchItem = ref1[0], spy = ref1[1];
        beforeEach(function() {
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          matchItem = resultsElement.querySelector('.search-result.list-item');
          click(matchItem);
          return waitsFor(function() {
            return spy.callCount > 0;
          });
        });
        return it('opens the file', function() {
          var textEditor;
          expect(spy).toHaveBeenCalled();
          textEditor = spy.argsForCall[0][0].textEditor;
          return expect(textEditor.getSelectedBufferRange()).toEqual([[1, 13], [1, 23]]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXJlc3VsdHMtZWxlbWVudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsa0JBQVI7O0VBQ1YsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFFZCxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQTtBQUM5QixRQUFBO0lBQUEsTUFBb0UsRUFBcEUsRUFBQyxlQUFELEVBQVMsdUJBQVQsRUFBeUIsaUJBQXpCLEVBQW1DLGdCQUFuQyxFQUE0QyxvQkFBNUMsRUFBeUQ7SUFFekQsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFdBRHNDLEVBRXRDLFdBRnNDLENBQXhDO01BS0EsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFEO1VBQ2hFLFFBQUEsR0FBVyxHQUFHLENBQUM7aUJBQ2YsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUE7UUFGc0QsQ0FBL0M7TUFBSCxDQUFoQjtNQUlBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUE7TUFBSCxDQUFoQjthQUVBLElBQUEsQ0FBSyxTQUFBO1FBQ0gsTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQUE7UUFDVCxLQUFBLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FBdUIsQ0FBQyxjQUF4QixDQUFBO1FBQ0EsV0FBQSxHQUFjLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHFCQUFsQjtRQUNkLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixXQUEzQjtRQUVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO2VBRWpCLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGNBQXBCO01BUkcsQ0FBTDtJQVpTLENBQVg7SUFzQkEsU0FBQSxDQUFVLFNBQUE7YUFBRyxRQUFBLENBQVMsU0FBQTtlQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCO01BQTNCLENBQVQ7SUFBSCxDQUFWO0lBRUEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUE7YUFDekMsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxXQUF2QixDQUFBO0lBRHlDLENBQTNDO0lBR0EsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUE7YUFDdEIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsZ0JBQXRCLENBQUE7SUFEc0IsQ0FBeEI7V0FHQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtNQUNqQyxVQUFBLENBQVcsU0FBQTtlQUFHLFFBQUEsQ0FBUyxTQUFBO2lCQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCO1FBQTNCLENBQVQ7TUFBSCxDQUFYO01BRUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUE7QUFDNUIsWUFBQTtRQUFBLFdBQUEsR0FBYyxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsbUJBQWhDO1FBRWQsTUFBQSxDQUFPLFdBQVcsQ0FBQyxNQUFuQixDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQW5DO2VBRUEsTUFBQSxDQUFPLFdBQVksQ0FBQSxDQUFBLENBQUUsQ0FBQyxnQkFBZixDQUFnQyxjQUFoQyxDQUErQyxDQUFDLE1BQXZELENBQThELENBQUMsT0FBL0QsQ0FBdUUsQ0FBdkU7TUFMNEIsQ0FBOUI7TUFPQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQTtBQUN0QyxZQUFBO1FBQUMsV0FBWTtRQUNiLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsUUFBQSxHQUFXLGNBQWMsQ0FBQyxhQUFmLENBQTZCLGdDQUE3QjtpQkFDWCxLQUFBLENBQU0sUUFBTjtRQUZTLENBQVg7ZUFJQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtpQkFDL0IsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFmLENBQTZCLDZCQUE3QixDQUFQLENBQW1FLENBQUMsT0FBcEUsQ0FBQTtRQUQrQixDQUFqQztNQU5zQyxDQUF4QzthQVNBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO0FBQ3pDLFlBQUE7UUFBQSxPQUFtQixFQUFuQixFQUFDLG1CQUFELEVBQVk7UUFDWixVQUFBLENBQVcsU0FBQTtVQUNULEdBQUEsR0FBTSxPQUFPLENBQUMsU0FBUixDQUFrQixxQkFBbEI7VUFFTixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLEdBQWxDO1VBQ0EsU0FBQSxHQUFZLGNBQWMsQ0FBQyxhQUFmLENBQTZCLDBCQUE3QjtVQUNaLEtBQUEsQ0FBTSxTQUFOO2lCQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUFHLEdBQUcsQ0FBQyxTQUFKLEdBQWdCO1VBQW5CLENBQVQ7UUFQUyxDQUFYO2VBU0EsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7QUFDbkIsY0FBQTtVQUFBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxnQkFBWixDQUFBO1VBQ0MsYUFBYyxHQUFHLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUE7aUJBQ2xDLE1BQUEsQ0FBTyxVQUFVLENBQUMsc0JBQVgsQ0FBQSxDQUFQLENBQTJDLENBQUMsT0FBNUMsQ0FBb0QsQ0FBQyxDQUFDLENBQUQsRUFBRyxFQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FBcEQ7UUFIbUIsQ0FBckI7TUFYeUMsQ0FBM0M7SUFuQmlDLENBQW5DO0VBakM4QixDQUFoQztBQUhBIiwic291cmNlc0NvbnRlbnQiOlsie2NsaWNrfSA9IHJlcXVpcmUgJy4vaGVscGVycy9ldmVudHMnXG5Db2xvclNlYXJjaCA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1zZWFyY2gnXG5cbmRlc2NyaWJlICdDb2xvclJlc3VsdHNFbGVtZW50JywgLT5cbiAgW3NlYXJjaCwgcmVzdWx0c0VsZW1lbnQsIHBpZ21lbnRzLCBwcm9qZWN0LCBjb21wbGV0ZVNweSwgZmluZFNweV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJywgW1xuICAgICAgJyoqLyouc3R5bCdcbiAgICAgICcqKi8qLmxlc3MnXG4gICAgXVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwaWdtZW50cycpLnRoZW4gKHBrZykgLT5cbiAgICAgIHBpZ21lbnRzID0gcGtnLm1haW5Nb2R1bGVcbiAgICAgIHByb2plY3QgPSBwaWdtZW50cy5nZXRQcm9qZWN0KClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgcnVucyAtPlxuICAgICAgc2VhcmNoID0gcHJvamVjdC5maW5kQWxsQ29sb3JzKClcbiAgICAgIHNweU9uKHNlYXJjaCwgJ3NlYXJjaCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIGNvbXBsZXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1jb21wbGV0ZS1zZWFyY2gnKVxuICAgICAgc2VhcmNoLm9uRGlkQ29tcGxldGVTZWFyY2goY29tcGxldGVTcHkpXG5cbiAgICAgIHJlc3VsdHNFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHNlYXJjaClcblxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShyZXN1bHRzRWxlbWVudClcblxuICBhZnRlckVhY2ggLT4gd2FpdHNGb3IgLT4gY29tcGxldGVTcHkuY2FsbENvdW50ID4gMFxuXG4gIGl0ICdpcyBhc3NvY2lhdGVkIHdpdGggQ29sb3JTZWFyY2ggbW9kZWwnLCAtPlxuICAgIGV4cGVjdChyZXN1bHRzRWxlbWVudCkudG9CZURlZmluZWQoKVxuXG4gIGl0ICdzdGFydHMgdGhlIHNlYXJjaCcsIC0+XG4gICAgZXhwZWN0KHNlYXJjaC5zZWFyY2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlICd3aGVuIG1hdGNoZXMgYXJlIGZvdW5kJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IHdhaXRzRm9yIC0+IGNvbXBsZXRlU3B5LmNhbGxDb3VudCA+IDBcblxuICAgIGl0ICdncm91cHMgcmVzdWx0cyBieSBmaWxlcycsIC0+XG4gICAgICBmaWxlUmVzdWx0cyA9IHJlc3VsdHNFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LW5lc3RlZC1pdGVtJylcblxuICAgICAgZXhwZWN0KGZpbGVSZXN1bHRzLmxlbmd0aCkudG9FcXVhbCg4KVxuXG4gICAgICBleHBlY3QoZmlsZVJlc3VsdHNbMF0ucXVlcnlTZWxlY3RvckFsbCgnbGkubGlzdC1pdGVtJykubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICBkZXNjcmliZSAnd2hlbiBhIGZpbGUgaXRlbSBpcyBjbGlja2VkJywgLT5cbiAgICAgIFtmaWxlSXRlbV0gPSBbXVxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBmaWxlSXRlbSA9IHJlc3VsdHNFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LW5lc3RlZC1pdGVtID4gLmxpc3QtaXRlbScpXG4gICAgICAgIGNsaWNrKGZpbGVJdGVtKVxuXG4gICAgICBpdCAnY29sbGFwc2VzIHRoZSBmaWxlIG1hdGNoZXMnLCAtPlxuICAgICAgICBleHBlY3QocmVzdWx0c0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpc3QtbmVzdGVkLWl0ZW0uY29sbGFwc2VkJykpLnRvRXhpc3QoKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gYSBtYXRjaGVzIGl0ZW0gaXMgY2xpY2tlZCcsIC0+XG4gICAgICBbbWF0Y2hJdGVtLCBzcHldID0gW11cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1hZGQtdGV4dC1lZGl0b3InKVxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkVGV4dEVkaXRvcihzcHkpXG4gICAgICAgIG1hdGNoSXRlbSA9IHJlc3VsdHNFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtcmVzdWx0Lmxpc3QtaXRlbScpXG4gICAgICAgIGNsaWNrKG1hdGNoSXRlbSlcblxuICAgICAgICB3YWl0c0ZvciAtPiBzcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICBpdCAnb3BlbnMgdGhlIGZpbGUnLCAtPlxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAge3RleHRFZGl0b3J9ID0gc3B5LmFyZ3NGb3JDYWxsWzBdWzBdXG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKSkudG9FcXVhbChbWzEsMTNdLFsxLDIzXV0pXG4iXX0=

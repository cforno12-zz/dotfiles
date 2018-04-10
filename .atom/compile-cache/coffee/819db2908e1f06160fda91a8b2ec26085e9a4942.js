(function() {
  var ColorSearch;

  require('./helpers/matchers');

  ColorSearch = require('../lib/color-search');

  describe('ColorSearch', function() {
    var pigments, project, ref, search;
    ref = [], search = ref[0], pigments = ref[1], project = ref[2];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      atom.config.set('pigments.extendedSearchNames', ['**/*.css']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
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
    return describe('when created with basic options', function() {
      beforeEach(function() {
        return search = project.findAllColors();
      });
      it('dispatches a did-complete-search when finalizing its search', function() {
        var spy;
        spy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(spy);
        search.search();
        waitsFor(function() {
          return spy.callCount > 0;
        });
        return runs(function() {
          return expect(spy.argsForCall[0][0].length).toEqual(26);
        });
      });
      return it('dispatches a did-find-matches event for every file', function() {
        var completeSpy, findSpy;
        completeSpy = jasmine.createSpy('did-complete-search');
        findSpy = jasmine.createSpy('did-find-matches');
        search.onDidCompleteSearch(completeSpy);
        search.onDidFindMatches(findSpy);
        search.search();
        waitsFor(function() {
          return completeSpy.callCount > 0;
        });
        return runs(function() {
          expect(findSpy.callCount).toEqual(7);
          return expect(findSpy.argsForCall[0][0].matches.length).toEqual(3);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXNlYXJjaC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxDQUFRLG9CQUFSOztFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBRWQsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtBQUN0QixRQUFBO0lBQUEsTUFBOEIsRUFBOUIsRUFBQyxlQUFELEVBQVMsaUJBQVQsRUFBbUI7SUFFbkIsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFdBRHNDLEVBRXRDLFdBRnNDLENBQXhDO01BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxDQUM5QyxVQUQ4QyxDQUFoRDtNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsQ0FDdkMsbUJBRHVDLENBQXpDO01BSUEsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFEO1VBQ2hFLFFBQUEsR0FBVyxHQUFHLENBQUM7aUJBQ2YsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUE7UUFGc0QsQ0FBL0M7TUFBSCxDQUFoQjthQUlBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUE7TUFBSCxDQUFoQjtJQWhCUyxDQUFYO1dBa0JBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBO01BQzFDLFVBQUEsQ0FBVyxTQUFBO2VBQ1QsTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQUE7TUFEQSxDQUFYO01BR0EsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUE7QUFDaEUsWUFBQTtRQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsU0FBUixDQUFrQixxQkFBbEI7UUFDTixNQUFNLENBQUMsbUJBQVAsQ0FBMkIsR0FBM0I7UUFDQSxNQUFNLENBQUMsTUFBUCxDQUFBO1FBQ0EsUUFBQSxDQUFTLFNBQUE7aUJBQUcsR0FBRyxDQUFDLFNBQUosR0FBZ0I7UUFBbkIsQ0FBVDtlQUNBLElBQUEsQ0FBSyxTQUFBO2lCQUFHLE1BQUEsQ0FBTyxHQUFHLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTdCLENBQW9DLENBQUMsT0FBckMsQ0FBNkMsRUFBN0M7UUFBSCxDQUFMO01BTGdFLENBQWxFO2FBT0EsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUE7QUFDdkQsWUFBQTtRQUFBLFdBQUEsR0FBYyxPQUFPLENBQUMsU0FBUixDQUFrQixxQkFBbEI7UUFDZCxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isa0JBQWxCO1FBQ1YsTUFBTSxDQUFDLG1CQUFQLENBQTJCLFdBQTNCO1FBQ0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCO1FBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBQTtRQUNBLFFBQUEsQ0FBUyxTQUFBO2lCQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCO1FBQTNCLENBQVQ7ZUFDQSxJQUFBLENBQUssU0FBQTtVQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLE9BQTFCLENBQWtDLENBQWxDO2lCQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxNQUF6QyxDQUFnRCxDQUFDLE9BQWpELENBQXlELENBQXpEO1FBRkcsQ0FBTDtNQVB1RCxDQUF6RDtJQVgwQyxDQUE1QztFQXJCc0IsQ0FBeEI7QUFIQSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUgJy4vaGVscGVycy9tYXRjaGVycydcbkNvbG9yU2VhcmNoID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLXNlYXJjaCdcblxuZGVzY3JpYmUgJ0NvbG9yU2VhcmNoJywgLT5cbiAgW3NlYXJjaCwgcGlnbWVudHMsIHByb2plY3RdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtcbiAgICAgICcqKi8qLnN0eWwnXG4gICAgICAnKiovKi5sZXNzJ1xuICAgIF1cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmV4dGVuZGVkU2VhcmNoTmFtZXMnLCBbXG4gICAgICAnKiovKi5jc3MnXG4gICAgXVxuICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlZE5hbWVzJywgW1xuICAgICAgJ3Byb2plY3QvdmVuZG9yLyoqJ1xuICAgIF1cblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgncGlnbWVudHMnKS50aGVuIChwa2cpIC0+XG4gICAgICBwaWdtZW50cyA9IHBrZy5tYWluTW9kdWxlXG4gICAgICBwcm9qZWN0ID0gcGlnbWVudHMuZ2V0UHJvamVjdCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcblxuICBkZXNjcmliZSAnd2hlbiBjcmVhdGVkIHdpdGggYmFzaWMgb3B0aW9ucycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc2VhcmNoID0gcHJvamVjdC5maW5kQWxsQ29sb3JzKClcblxuICAgIGl0ICdkaXNwYXRjaGVzIGEgZGlkLWNvbXBsZXRlLXNlYXJjaCB3aGVuIGZpbmFsaXppbmcgaXRzIHNlYXJjaCcsIC0+XG4gICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLWNvbXBsZXRlLXNlYXJjaCcpXG4gICAgICBzZWFyY2gub25EaWRDb21wbGV0ZVNlYXJjaChzcHkpXG4gICAgICBzZWFyY2guc2VhcmNoKClcbiAgICAgIHdhaXRzRm9yIC0+IHNweS5jYWxsQ291bnQgPiAwXG4gICAgICBydW5zIC0+IGV4cGVjdChzcHkuYXJnc0ZvckNhbGxbMF1bMF0ubGVuZ3RoKS50b0VxdWFsKDI2KVxuXG4gICAgaXQgJ2Rpc3BhdGNoZXMgYSBkaWQtZmluZC1tYXRjaGVzIGV2ZW50IGZvciBldmVyeSBmaWxlJywgLT5cbiAgICAgIGNvbXBsZXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1jb21wbGV0ZS1zZWFyY2gnKVxuICAgICAgZmluZFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtZmluZC1tYXRjaGVzJylcbiAgICAgIHNlYXJjaC5vbkRpZENvbXBsZXRlU2VhcmNoKGNvbXBsZXRlU3B5KVxuICAgICAgc2VhcmNoLm9uRGlkRmluZE1hdGNoZXMoZmluZFNweSlcbiAgICAgIHNlYXJjaC5zZWFyY2goKVxuICAgICAgd2FpdHNGb3IgLT4gY29tcGxldGVTcHkuY2FsbENvdW50ID4gMFxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZmluZFNweS5jYWxsQ291bnQpLnRvRXF1YWwoNylcbiAgICAgICAgZXhwZWN0KGZpbmRTcHkuYXJnc0ZvckNhbGxbMF1bMF0ubWF0Y2hlcy5sZW5ndGgpLnRvRXF1YWwoMylcbiJdfQ==

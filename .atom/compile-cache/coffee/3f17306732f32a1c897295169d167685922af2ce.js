(function() {
  var ColorContext, ColorScanner, registry;

  ColorScanner = require('../lib/color-scanner');

  ColorContext = require('../lib/color-context');

  registry = require('../lib/color-expressions');

  describe('ColorScanner', function() {
    var editor, lastIndex, ref, result, scanner, text, withScannerForString, withScannerForTextEditor, withTextEditor;
    ref = [], scanner = ref[0], editor = ref[1], text = ref[2], result = ref[3], lastIndex = ref[4];
    withScannerForString = function(string, block) {
      return describe("with '" + (string.replace(/#/g, '+')) + "'", function() {
        beforeEach(function() {
          var context;
          text = string;
          context = new ColorContext({
            registry: registry
          });
          return scanner = new ColorScanner({
            context: context
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return text = editor.getText();
          });
        });
        afterEach(function() {
          return editor = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          var context;
          context = new ColorContext({
            registry: registry
          });
          return scanner = new ColorScanner({
            context: context
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      withScannerForTextEditor('html-entities.html', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'html');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('css-color-with-prefix.less', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'less');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([13, 17]);
          });
          it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
          it('stores the matched text', function() {
            return expect(result.match).toEqual('#fff');
          });
          it('stores the last index', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          return it('stores match line', function() {
            return expect(result.line).toEqual(0);
          });
        });
        return describe('successive searches', function() {
          it('returns a buffer color for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
          return it('stores the line of successive matches', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch().line).toEqual(2);
            expect(doSearch().line).toEqual(4);
            return expect(doSearch().line).toEqual(6);
          });
        });
      });
      withScannerForTextEditor('class-after-color.sass', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'sass');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        return describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([15, 20]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
        });
      });
      withScannerForTextEditor('project/styles/variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        return describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([18, 25]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#BF616A');
          });
        });
      });
      withScannerForTextEditor('crlf.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([7, 11]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
        });
        return it('finds the second color', function() {
          var doSearch;
          doSearch = function() {
            return result = scanner.search(text, 'styl', result.lastIndex);
          };
          doSearch();
          return expect(result.color).toBeDefined();
        });
      });
      withScannerForTextEditor('color-in-tag-content.html', function() {
        return it('finds both colors', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          expect(doSearch()).toBeDefined();
          expect(doSearch()).toBeDefined();
          return expect(doSearch()).toBeUndefined();
        });
      });
      withScannerForString('#add-something {}, #acedbe-foo {}, #acedbeef-foo {}', function() {
        return it('does not find any matches', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          return expect(doSearch()).toBeUndefined();
        });
      });
      return withScannerForString('#add_something {}, #acedbe_foo {}, #acedbeef_foo {}', function() {
        return it('does not find any matches', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          return expect(doSearch()).toBeUndefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXNjYW5uZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVI7O0VBQ2YsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSOztFQUVYLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUE7QUFDdkIsUUFBQTtJQUFBLE1BQTZDLEVBQTdDLEVBQUMsZ0JBQUQsRUFBVSxlQUFWLEVBQWtCLGFBQWxCLEVBQXdCLGVBQXhCLEVBQWdDO0lBRWhDLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxFQUFTLEtBQVQ7YUFDckIsUUFBQSxDQUFTLFFBQUEsR0FBUSxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQixHQUFyQixDQUFELENBQVIsR0FBbUMsR0FBNUMsRUFBZ0QsU0FBQTtRQUM5QyxVQUFBLENBQVcsU0FBQTtBQUNULGNBQUE7VUFBQSxJQUFBLEdBQU87VUFDUCxPQUFBLEdBQWMsSUFBQSxZQUFBLENBQWE7WUFBQyxVQUFBLFFBQUQ7V0FBYjtpQkFDZCxPQUFBLEdBQWMsSUFBQSxZQUFBLENBQWE7WUFBQyxTQUFBLE9BQUQ7V0FBYjtRQUhMLENBQVg7UUFLQSxTQUFBLENBQVUsU0FBQTtpQkFBRyxPQUFBLEdBQVU7UUFBYixDQUFWO2VBRUcsS0FBSCxDQUFBO01BUjhDLENBQWhEO0lBRHFCO0lBV3ZCLGNBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsS0FBVjthQUNmLFFBQUEsQ0FBUyxPQUFBLEdBQVEsT0FBUixHQUFnQixTQUF6QixFQUFtQyxTQUFBO1FBQ2pDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsZUFBQSxDQUFnQixTQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENB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QSxDQUFPLFFBQUEsQ0FBQSxDQUFQLENBQWtCLENBQUMsV0FBbkIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxRQUFBLENBQUEsQ0FBUCxDQUFrQixDQUFDLFdBQW5CLENBQUE7aUJBQ0EsTUFBQSxDQUFPLFFBQUEsQ0FBQSxDQUFQLENBQWtCLENBQUMsYUFBbkIsQ0FBQTtRQU5zQixDQUF4QjtNQURvRCxDQUF0RDtNQVNBLG9CQUFBLENBQXFCLHFEQUFyQixFQUE0RSxTQUFBO2VBQzFFLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLGNBQUE7VUFBQSxNQUFBLEdBQVM7WUFBQSxTQUFBLEVBQVcsQ0FBWDs7VUFDVCxRQUFBLEdBQVcsU0FBQTttQkFBRyxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFmLEVBQXFCLEtBQXJCLEVBQTRCLE1BQU0sQ0FBQyxTQUFuQztVQUFaO2lCQUVYLE1BQUEsQ0FBTyxRQUFBLENBQUEsQ0FBUCxDQUFrQixDQUFDLGFBQW5CLENBQUE7UUFKOEIsQ0FBaEM7TUFEMEUsQ0FBNUU7YUFPQSxvQkFBQSxDQUFxQixxREFBckIsRUFBNEUsU0FBQTtlQUMxRSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtBQUM5QixjQUFBO1VBQUEsTUFBQSxHQUFTO1lBQUEsU0FBQSxFQUFXLENBQVg7O1VBQ1QsUUFBQSxHQUFXLFNBQUE7bUJBQUcsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBZixFQUFxQixLQUFyQixFQUE0QixNQUFNLENBQUMsU0FBbkM7VUFBWjtpQkFFWCxNQUFBLENBQU8sUUFBQSxDQUFBLENBQVAsQ0FBa0IsQ0FBQyxhQUFuQixDQUFBO1FBSjhCLENBQWhDO01BRDBFLENBQTVFO0lBdkhtQixDQUFyQjtFQXBDdUIsQ0FBekI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbIkNvbG9yU2Nhbm5lciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1zY2FubmVyJ1xuQ29sb3JDb250ZXh0ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLWNvbnRleHQnXG5yZWdpc3RyeSA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1leHByZXNzaW9ucydcblxuZGVzY3JpYmUgJ0NvbG9yU2Nhbm5lcicsIC0+XG4gIFtzY2FubmVyLCBlZGl0b3IsIHRleHQsIHJlc3VsdCwgbGFzdEluZGV4XSA9IFtdXG5cbiAgd2l0aFNjYW5uZXJGb3JTdHJpbmcgPSAoc3RyaW5nLCBibG9jaykgLT5cbiAgICBkZXNjcmliZSBcIndpdGggJyN7c3RyaW5nLnJlcGxhY2UoLyMvZywgJysnKX0nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHRleHQgPSBzdHJpbmdcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb2xvckNvbnRleHQoe3JlZ2lzdHJ5fSlcbiAgICAgICAgc2Nhbm5lciA9IG5ldyBDb2xvclNjYW5uZXIoe2NvbnRleHR9KVxuXG4gICAgICBhZnRlckVhY2ggLT4gc2Nhbm5lciA9IG51bGxcblxuICAgICAgZG8gYmxvY2tcblxuICB3aXRoVGV4dEVkaXRvciA9IChmaXh0dXJlLCBibG9jaykgLT5cbiAgICBkZXNjcmliZSBcIndpdGggI3tmaXh0dXJlfSBidWZmZXJcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oZml4dHVyZSlcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICAgIGFmdGVyRWFjaCAtPiBlZGl0b3IgPSBudWxsXG5cbiAgICAgIGRvIGJsb2NrXG5cbiAgd2l0aFNjYW5uZXJGb3JUZXh0RWRpdG9yID0gKGZpeHR1cmUsIGJsb2NrKSAtPlxuICAgIHdpdGhUZXh0RWRpdG9yIGZpeHR1cmUsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29sb3JDb250ZXh0KHtyZWdpc3RyeX0pXG4gICAgICAgIHNjYW5uZXIgPSBuZXcgQ29sb3JTY2FubmVyKHtjb250ZXh0fSlcblxuICAgICAgYWZ0ZXJFYWNoIC0+IHNjYW5uZXIgPSBudWxsXG5cbiAgICAgIGRvIGJsb2NrXG5cbiAgZGVzY3JpYmUgJzo6c2VhcmNoJywgLT5cbiAgICB3aXRoU2Nhbm5lckZvclRleHRFZGl0b3IgJ2h0bWwtZW50aXRpZXMuaHRtbCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsICdodG1sJylcblxuICAgICAgaXQgJ3JldHVybnMgbm90aGluZycsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgd2l0aFNjYW5uZXJGb3JUZXh0RWRpdG9yICdjc3MtY29sb3Itd2l0aC1wcmVmaXgubGVzcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsICdsZXNzJylcblxuICAgICAgaXQgJ3JldHVybnMgbm90aGluZycsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgd2l0aFNjYW5uZXJGb3JUZXh0RWRpdG9yICdmb3VyLXZhcmlhYmxlcy5zdHlsJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgJ3N0eWwnKVxuXG4gICAgICBpdCAncmV0dXJucyB0aGUgZmlyc3QgYnVmZmVyIGNvbG9yIG1hdGNoJywgLT5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXG4gICAgICBkZXNjcmliZSAndGhlIHJlc3VsdGluZyBidWZmZXIgY29sb3InLCAtPlxuICAgICAgICBpdCAnaGFzIGEgdGV4dCByYW5nZScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5yYW5nZSkudG9FcXVhbChbMTMsMTddKVxuXG4gICAgICAgIGl0ICdoYXMgYSBjb2xvcicsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5jb2xvcikudG9CZUNvbG9yKCcjZmZmZmZmJylcblxuICAgICAgICBpdCAnc3RvcmVzIHRoZSBtYXRjaGVkIHRleHQnLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQubWF0Y2gpLnRvRXF1YWwoJyNmZmYnKVxuXG4gICAgICAgIGl0ICdzdG9yZXMgdGhlIGxhc3QgaW5kZXgnLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQubGFzdEluZGV4KS50b0VxdWFsKDE3KVxuXG4gICAgICAgIGl0ICdzdG9yZXMgbWF0Y2ggbGluZScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5saW5lKS50b0VxdWFsKDApXG5cbiAgICAgIGRlc2NyaWJlICdzdWNjZXNzaXZlIHNlYXJjaGVzJywgLT5cbiAgICAgICAgaXQgJ3JldHVybnMgYSBidWZmZXIgY29sb3IgZm9yIGVhY2ggbWF0Y2ggYW5kIHRoZW4gdW5kZWZpbmVkJywgLT5cbiAgICAgICAgICBkb1NlYXJjaCA9IC0+IHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsICdzdHlsJywgcmVzdWx0Lmxhc3RJbmRleClcblxuICAgICAgICAgIGV4cGVjdChkb1NlYXJjaCgpKS50b0JlRGVmaW5lZCgpXG4gICAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgICBleHBlY3QoZG9TZWFyY2goKSkudG9CZURlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChkb1NlYXJjaCgpKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgICBpdCAnc3RvcmVzIHRoZSBsaW5lIG9mIHN1Y2Nlc3NpdmUgbWF0Y2hlcycsIC0+XG4gICAgICAgICAgZG9TZWFyY2ggPSAtPiByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0LCAnc3R5bCcsIHJlc3VsdC5sYXN0SW5kZXgpXG5cbiAgICAgICAgICBleHBlY3QoZG9TZWFyY2goKS5saW5lKS50b0VxdWFsKDIpXG4gICAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkubGluZSkudG9FcXVhbCg0KVxuICAgICAgICAgIGV4cGVjdChkb1NlYXJjaCgpLmxpbmUpLnRvRXF1YWwoNilcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAnY2xhc3MtYWZ0ZXItY29sb3Iuc2FzcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsICdzYXNzJylcblxuICAgICAgaXQgJ3JldHVybnMgdGhlIGZpcnN0IGJ1ZmZlciBjb2xvciBtYXRjaCcsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblxuICAgICAgZGVzY3JpYmUgJ3RoZSByZXN1bHRpbmcgYnVmZmVyIGNvbG9yJywgLT5cbiAgICAgICAgaXQgJ2hhcyBhIHRleHQgcmFuZ2UnLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQucmFuZ2UpLnRvRXF1YWwoWzE1LDIwXSlcblxuICAgICAgICBpdCAnaGFzIGEgY29sb3InLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQuY29sb3IpLnRvQmVDb2xvcignI2ZmZmZmZicpXG5cbiAgICB3aXRoU2Nhbm5lckZvclRleHRFZGl0b3IgJ3Byb2plY3Qvc3R5bGVzL3ZhcmlhYmxlcy5zdHlsJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgJ3N0eWwnKVxuXG4gICAgICBpdCAncmV0dXJucyB0aGUgZmlyc3QgYnVmZmVyIGNvbG9yIG1hdGNoJywgLT5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXG4gICAgICBkZXNjcmliZSAndGhlIHJlc3VsdGluZyBidWZmZXIgY29sb3InLCAtPlxuICAgICAgICBpdCAnaGFzIGEgdGV4dCByYW5nZScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5yYW5nZSkudG9FcXVhbChbMTgsMjVdKVxuXG4gICAgICAgIGl0ICdoYXMgYSBjb2xvcicsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5jb2xvcikudG9CZUNvbG9yKCcjQkY2MTZBJylcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAnY3JsZi5zdHlsJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgJ3N0eWwnKVxuXG4gICAgICBpdCAncmV0dXJucyB0aGUgZmlyc3QgYnVmZmVyIGNvbG9yIG1hdGNoJywgLT5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuXG4gICAgICBkZXNjcmliZSAndGhlIHJlc3VsdGluZyBidWZmZXIgY29sb3InLCAtPlxuICAgICAgICBpdCAnaGFzIGEgdGV4dCByYW5nZScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5yYW5nZSkudG9FcXVhbChbNywxMV0pXG5cbiAgICAgICAgaXQgJ2hhcyBhIGNvbG9yJywgLT5cbiAgICAgICAgICBleHBlY3QocmVzdWx0LmNvbG9yKS50b0JlQ29sb3IoJyNmZmZmZmYnKVxuXG4gICAgICBpdCAnZmluZHMgdGhlIHNlY29uZCBjb2xvcicsIC0+XG4gICAgICAgIGRvU2VhcmNoID0gLT4gcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgJ3N0eWwnLCByZXN1bHQubGFzdEluZGV4KVxuXG4gICAgICAgIGRvU2VhcmNoKClcblxuICAgICAgICBleHBlY3QocmVzdWx0LmNvbG9yKS50b0JlRGVmaW5lZCgpXG5cbiAgICB3aXRoU2Nhbm5lckZvclRleHRFZGl0b3IgJ2NvbG9yLWluLXRhZy1jb250ZW50Lmh0bWwnLCAtPlxuICAgICAgaXQgJ2ZpbmRzIGJvdGggY29sb3JzJywgLT5cbiAgICAgICAgcmVzdWx0ID0gbGFzdEluZGV4OiAwXG4gICAgICAgIGRvU2VhcmNoID0gLT4gcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgJ2NzcycsIHJlc3VsdC5sYXN0SW5kZXgpXG5cbiAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgd2l0aFNjYW5uZXJGb3JTdHJpbmcgJyNhZGQtc29tZXRoaW5nIHt9LCAjYWNlZGJlLWZvbyB7fSwgI2FjZWRiZWVmLWZvbyB7fScsIC0+XG4gICAgICBpdCAnZG9lcyBub3QgZmluZCBhbnkgbWF0Y2hlcycsIC0+XG4gICAgICAgIHJlc3VsdCA9IGxhc3RJbmRleDogMFxuICAgICAgICBkb1NlYXJjaCA9IC0+IHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsICdjc3MnLCByZXN1bHQubGFzdEluZGV4KVxuXG4gICAgICAgIGV4cGVjdChkb1NlYXJjaCgpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIHdpdGhTY2FubmVyRm9yU3RyaW5nICcjYWRkX3NvbWV0aGluZyB7fSwgI2FjZWRiZV9mb28ge30sICNhY2VkYmVlZl9mb28ge30nLCAtPlxuICAgICAgaXQgJ2RvZXMgbm90IGZpbmQgYW55IG1hdGNoZXMnLCAtPlxuICAgICAgICByZXN1bHQgPSBsYXN0SW5kZXg6IDBcbiAgICAgICAgZG9TZWFyY2ggPSAtPiByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0LCAnY3NzJywgcmVzdWx0Lmxhc3RJbmRleClcblxuICAgICAgICBleHBlY3QoZG9TZWFyY2goKSkudG9CZVVuZGVmaW5lZCgpXG4iXX0=

(function() {
  var VariableScanner, path, registry, scopeFromFileName;

  path = require('path');

  VariableScanner = require('../lib/variable-scanner');

  registry = require('../lib/variable-expressions');

  scopeFromFileName = require('../lib/scope-from-file-name');

  describe('VariableScanner', function() {
    var editor, ref, scanner, scope, text, withScannerForTextEditor, withTextEditor;
    ref = [], scanner = ref[0], editor = ref[1], text = ref[2], scope = ref[3];
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            text = editor.getText();
            return scope = scopeFromFileName(editor.getPath());
          });
        });
        afterEach(function() {
          editor = null;
          return scope = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          return scanner = new VariableScanner({
            registry: registry,
            scope: scope
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      var result;
      result = [][0];
      withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        it('returns the first match', function() {
          return expect(result).toBeDefined();
        });
        describe('the result object', function() {
          it('has a match string', function() {
            return expect(result.match).toEqual('base-color = #fff');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([0, 17]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('base-color');
            expect(result[0].value).toEqual('#fff');
            expect(result[0].range).toEqual([0, 17]);
            return expect(result[0].line).toEqual(0);
          });
        });
        describe('the second result object', function() {
          beforeEach(function() {
            return result = scanner.search(text, result.lastIndex);
          });
          it('has a match string', function() {
            return expect(result.match).toEqual('other-color = transparentize(base-color, 50%)');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(64);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([19, 64]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('other-color');
            expect(result[0].value).toEqual('transparentize(base-color, 50%)');
            expect(result[0].range).toEqual([19, 64]);
            return expect(result[0].line).toEqual(2);
          });
        });
        return describe('successive searches', function() {
          return it('returns a result for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
        });
      });
      withScannerForTextEditor('incomplete-stylus-hash.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-arguments.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('attribute-selectors.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-conditions.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('does not find the variable in the if clause', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-after-mixins.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable after the mixin', function() {
          return expect(result).toBeDefined();
        });
      });
      withScannerForTextEditor('variables-from-other-process.less', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable with an interpolation tag', function() {
          return expect(result).toBeDefined();
        });
      });
      return withScannerForTextEditor('crlf.styl', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('finds all the variables even with crlf mode', function() {
          return expect(result).toBeDefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3ZhcmlhYmxlLXNjYW5uZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDbEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsNkJBQVI7O0VBRXBCLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxNQUFpQyxFQUFqQyxFQUFDLGdCQUFELEVBQVUsZUFBVixFQUFrQixhQUFsQixFQUF3QjtJQUV4QixjQUFBLEdBQWlCLFNBQUMsT0FBRCxFQUFVLEtBQVY7YUFDZixRQUFBLENBQVMsT0FBQSxHQUFRLE9BQVIsR0FBZ0IsU0FBekIsRUFBbUMsU0FBQTtRQUNqQyxVQUFBLENBQVcsU0FBQTtVQUNULGVBQUEsQ0FBZ0IsU0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsT0FBcEI7VUFBSCxDQUFoQjtpQkFDQSxJQUFBLENBQUssU0FBQTtZQUNILE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7WUFDVCxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTttQkFDUCxLQUFBLEdBQVEsaUJBQUEsQ0FBa0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFsQjtVQUhMLENBQUw7UUFGUyxDQUFYO1FBT0EsU0FBQSxDQUFVLFNBQUE7VUFDUixNQUFBLEdBQVM7aUJBQ1QsS0FBQSxHQUFRO1FBRkEsQ0FBVjtlQUlHLEtBQUgsQ0FBQTtNQVppQyxDQUFuQztJQURlO0lBZWpCLHdCQUFBLEdBQTJCLFNBQUMsT0FBRCxFQUFVLEtBQVY7YUFDekIsY0FB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QyxTQUFBO2lCQUN2QyxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsV0FBZixDQUFBO1FBRHVDLENBQXpDO01BUHNELENBQXhEO01BVUEsd0JBQUEsQ0FBeUIsbUNBQXpCLEVBQThELFNBQUE7UUFDNUQsVUFBQSxDQUFXLFNBQUE7QUFDVCxjQUFBO1VBQUEsTUFBQSxHQUFTO1VBQ1QsUUFBQSxHQUFXLFNBQUE7bUJBQUcsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBZixtQkFBcUIsTUFBTSxDQUFFLGtCQUE3QjtVQUFaO2lCQUVYLFFBQUEsQ0FBQTtRQUpTLENBQVg7ZUFNQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQTtpQkFDakQsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFdBQWYsQ0FBQTtRQURpRCxDQUFuRDtNQVA0RCxDQUE5RDthQVVBLHdCQUFBLENBQXlCLFdBQXpCLEVBQXNDLFNBQUE7UUFDcEMsVUFBQSxDQUFXLFNBQUE7QUFDVCxjQUFBO1VBQUEsTUFBQSxHQUFTO1VBQ1QsUUFBQSxHQUFXLFNBQUE7bUJBQUcsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBZixtQkFBcUIsTUFBTSxDQUFFLGtCQUE3QjtVQUFaO1VBRVgsUUFBQSxDQUFBO2lCQUNBLFFBQUEsQ0FBQTtRQUxTLENBQVg7ZUFPQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtpQkFDaEQsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFdBQWYsQ0FBQTtRQURnRCxDQUFsRDtNQVJvQyxDQUF0QztJQTNHbUIsQ0FBckI7RUExQjBCLENBQTVCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblZhcmlhYmxlU2Nhbm5lciA9IHJlcXVpcmUgJy4uL2xpYi92YXJpYWJsZS1zY2FubmVyJ1xucmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvdmFyaWFibGUtZXhwcmVzc2lvbnMnXG5zY29wZUZyb21GaWxlTmFtZSA9IHJlcXVpcmUgJy4uL2xpYi9zY29wZS1mcm9tLWZpbGUtbmFtZSdcblxuZGVzY3JpYmUgJ1ZhcmlhYmxlU2Nhbm5lcicsIC0+XG4gIFtzY2FubmVyLCBlZGl0b3IsIHRleHQsIHNjb3BlXSA9IFtdXG5cbiAgd2l0aFRleHRFZGl0b3IgPSAoZml4dHVyZSwgYmxvY2spIC0+XG4gICAgZGVzY3JpYmUgXCJ3aXRoICN7Zml4dHVyZX0gYnVmZmVyXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpeHR1cmUpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuICAgICAgICAgIHNjb3BlID0gc2NvcGVGcm9tRmlsZU5hbWUoZWRpdG9yLmdldFBhdGgoKSlcblxuICAgICAgYWZ0ZXJFYWNoIC0+XG4gICAgICAgIGVkaXRvciA9IG51bGxcbiAgICAgICAgc2NvcGUgPSBudWxsXG5cbiAgICAgIGRvIGJsb2NrXG5cbiAgd2l0aFNjYW5uZXJGb3JUZXh0RWRpdG9yID0gKGZpeHR1cmUsIGJsb2NrKSAtPlxuICAgIHdpdGhUZXh0RWRpdG9yIGZpeHR1cmUsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IHNjYW5uZXIgPSBuZXcgVmFyaWFibGVTY2FubmVyKHtyZWdpc3RyeSwgc2NvcGV9KVxuXG4gICAgICBhZnRlckVhY2ggLT4gc2Nhbm5lciA9IG51bGxcblxuICAgICAgZG8gYmxvY2tcblxuICBkZXNjcmliZSAnOjpzZWFyY2gnLCAtPlxuICAgIFtyZXN1bHRdID0gW11cblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAnZm91ci12YXJpYWJsZXMuc3R5bCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQpXG5cbiAgICAgIGl0ICdyZXR1cm5zIHRoZSBmaXJzdCBtYXRjaCcsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblxuICAgICAgZGVzY3JpYmUgJ3RoZSByZXN1bHQgb2JqZWN0JywgLT5cbiAgICAgICAgaXQgJ2hhcyBhIG1hdGNoIHN0cmluZycsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5tYXRjaCkudG9FcXVhbCgnYmFzZS1jb2xvciA9ICNmZmYnKVxuXG4gICAgICAgIGl0ICdoYXMgYSBsYXN0SW5kZXggcHJvcGVydHknLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQubGFzdEluZGV4KS50b0VxdWFsKDE3KVxuXG4gICAgICAgIGl0ICdoYXMgYSByYW5nZSBwcm9wZXJ0eScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5yYW5nZSkudG9FcXVhbChbMCwxN10pXG5cbiAgICAgICAgaXQgJ2hhcyBhIHZhcmlhYmxlIHJlc3VsdCcsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdFswXS5uYW1lKS50b0VxdWFsKCdiYXNlLWNvbG9yJylcbiAgICAgICAgICBleHBlY3QocmVzdWx0WzBdLnZhbHVlKS50b0VxdWFsKCcjZmZmJylcbiAgICAgICAgICBleHBlY3QocmVzdWx0WzBdLnJhbmdlKS50b0VxdWFsKFswLDE3XSlcbiAgICAgICAgICBleHBlY3QocmVzdWx0WzBdLmxpbmUpLnRvRXF1YWwoMClcblxuICAgICAgZGVzY3JpYmUgJ3RoZSBzZWNvbmQgcmVzdWx0IG9iamVjdCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0LCByZXN1bHQubGFzdEluZGV4KVxuXG4gICAgICAgIGl0ICdoYXMgYSBtYXRjaCBzdHJpbmcnLCAtPlxuICAgICAgICAgIGV4cGVjdChyZXN1bHQubWF0Y2gpLnRvRXF1YWwoJ290aGVyLWNvbG9yID0gdHJhbnNwYXJlbnRpemUoYmFzZS1jb2xvciwgNTAlKScpXG5cbiAgICAgICAgaXQgJ2hhcyBhIGxhc3RJbmRleCBwcm9wZXJ0eScsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdC5sYXN0SW5kZXgpLnRvRXF1YWwoNjQpXG5cbiAgICAgICAgaXQgJ2hhcyBhIHJhbmdlIHByb3BlcnR5JywgLT5cbiAgICAgICAgICBleHBlY3QocmVzdWx0LnJhbmdlKS50b0VxdWFsKFsxOSw2NF0pXG5cbiAgICAgICAgaXQgJ2hhcyBhIHZhcmlhYmxlIHJlc3VsdCcsIC0+XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdFswXS5uYW1lKS50b0VxdWFsKCdvdGhlci1jb2xvcicpXG4gICAgICAgICAgZXhwZWN0KHJlc3VsdFswXS52YWx1ZSkudG9FcXVhbCgndHJhbnNwYXJlbnRpemUoYmFzZS1jb2xvciwgNTAlKScpXG4gICAgICAgICAgZXhwZWN0KHJlc3VsdFswXS5yYW5nZSkudG9FcXVhbChbMTksNjRdKVxuICAgICAgICAgIGV4cGVjdChyZXN1bHRbMF0ubGluZSkudG9FcXVhbCgyKVxuXG4gICAgICBkZXNjcmliZSAnc3VjY2Vzc2l2ZSBzZWFyY2hlcycsIC0+XG4gICAgICAgIGl0ICdyZXR1cm5zIGEgcmVzdWx0IGZvciBlYWNoIG1hdGNoIGFuZCB0aGVuIHVuZGVmaW5lZCcsIC0+XG4gICAgICAgICAgZG9TZWFyY2ggPSAtPlxuICAgICAgICAgICAgcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dCwgcmVzdWx0Lmxhc3RJbmRleClcblxuICAgICAgICAgIGV4cGVjdChkb1NlYXJjaCgpKS50b0JlRGVmaW5lZCgpXG4gICAgICAgICAgZXhwZWN0KGRvU2VhcmNoKCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgICBleHBlY3QoZG9TZWFyY2goKSkudG9CZURlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChkb1NlYXJjaCgpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAnaW5jb21wbGV0ZS1zdHlsdXMtaGFzaC5zdHlsJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gc2Nhbm5lci5zZWFyY2godGV4dClcblxuICAgICAgaXQgJ2RvZXMgbm90IGZpbmQgYW55IHZhcmlhYmxlcycsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgd2l0aFNjYW5uZXJGb3JUZXh0RWRpdG9yICd2YXJpYWJsZXMtaW4tYXJndW1lbnRzLnNjc3MnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0KVxuXG4gICAgICBpdCAnZG9lcyBub3QgZmluZCBhbnkgdmFyaWFibGVzJywgLT5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICB3aXRoU2Nhbm5lckZvclRleHRFZGl0b3IgJ2F0dHJpYnV0ZS1zZWxlY3RvcnMuc2NzcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQpXG5cbiAgICAgIGl0ICdkb2VzIG5vdCBmaW5kIGFueSB2YXJpYWJsZXMnLCAtPlxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAndmFyaWFibGVzLWluLWNvbmRpdGlvbnMuc2NzcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgICAgZG9TZWFyY2ggPSAtPiByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0LCByZXN1bHQ/Lmxhc3RJbmRleClcblxuICAgICAgICBkb1NlYXJjaCgpXG4gICAgICAgIGRvU2VhcmNoKClcblxuICAgICAgaXQgJ2RvZXMgbm90IGZpbmQgdGhlIHZhcmlhYmxlIGluIHRoZSBpZiBjbGF1c2UnLCAtPlxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAndmFyaWFibGVzLWFmdGVyLW1peGlucy5zY3NzJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICBkb1NlYXJjaCA9IC0+IHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsIHJlc3VsdD8ubGFzdEluZGV4KVxuXG4gICAgICAgIGRvU2VhcmNoKClcblxuICAgICAgaXQgJ2ZpbmRzIHRoZSB2YXJpYWJsZSBhZnRlciB0aGUgbWl4aW4nLCAtPlxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG5cbiAgICB3aXRoU2Nhbm5lckZvclRleHRFZGl0b3IgJ3ZhcmlhYmxlcy1mcm9tLW90aGVyLXByb2Nlc3MubGVzcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgICAgZG9TZWFyY2ggPSAtPiByZXN1bHQgPSBzY2FubmVyLnNlYXJjaCh0ZXh0LCByZXN1bHQ/Lmxhc3RJbmRleClcblxuICAgICAgICBkb1NlYXJjaCgpXG5cbiAgICAgIGl0ICdmaW5kcyB0aGUgdmFyaWFibGUgd2l0aCBhbiBpbnRlcnBvbGF0aW9uIHRhZycsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcblxuICAgIHdpdGhTY2FubmVyRm9yVGV4dEVkaXRvciAnY3JsZi5zdHlsJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICBkb1NlYXJjaCA9IC0+IHJlc3VsdCA9IHNjYW5uZXIuc2VhcmNoKHRleHQsIHJlc3VsdD8ubGFzdEluZGV4KVxuXG4gICAgICAgIGRvU2VhcmNoKClcbiAgICAgICAgZG9TZWFyY2goKVxuXG4gICAgICBpdCAnZmluZHMgYWxsIHRoZSB2YXJpYWJsZXMgZXZlbiB3aXRoIGNybGYgbW9kZScsIC0+XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiJdfQ==

(function() {
  var VariableParser, registry;

  VariableParser = require('../lib/variable-parser');

  registry = require('../lib/variable-expressions');

  describe('VariableParser', function() {
    var itParses, parser;
    parser = [][0];
    itParses = function(expression) {
      return {
        as: function(variables) {
          it("parses '" + expression + "' as variables " + (jasmine.pp(variables)), function() {
            var expected, i, len, name, range, ref, results, results1, value;
            results = parser.parse(expression);
            expect(results.length).toEqual(Object.keys(variables).length);
            results1 = [];
            for (i = 0, len = results.length; i < len; i++) {
              ref = results[i], name = ref.name, value = ref.value, range = ref.range;
              expected = variables[name];
              if (expected.value != null) {
                results1.push(expect(value).toEqual(expected.value));
              } else if (expected.range != null) {
                results1.push(expect(range).toEqual(expected.range));
              } else {
                results1.push(expect(value).toEqual(expected));
              }
            }
            return results1;
          });
          return this;
        },
        asDefault: function(variables) {
          it("parses '" + expression + "' as default variables " + (jasmine.pp(variables)), function() {
            var expected, i, isDefault, len, name, range, ref, results, results1, value;
            results = parser.parse(expression);
            expect(results.length).toEqual(Object.keys(variables).length);
            results1 = [];
            for (i = 0, len = results.length; i < len; i++) {
              ref = results[i], name = ref.name, value = ref.value, range = ref.range, isDefault = ref["default"];
              expected = variables[name];
              expect(isDefault).toBeTruthy();
              if (expected.value != null) {
                results1.push(expect(value).toEqual(expected.value));
              } else if (expected.range != null) {
                results1.push(expect(range).toEqual(expected.range));
              } else {
                results1.push(expect(value).toEqual(expected));
              }
            }
            return results1;
          });
          return this;
        },
        asUndefined: function() {
          return it("does not parse '" + expression + "' as a variable expression", function() {
            var results;
            results = parser.parse(expression);
            return expect(results).toBeUndefined();
          });
        }
      };
    };
    beforeEach(function() {
      return parser = new VariableParser(registry);
    });
    itParses('color = white').as({
      'color': 'white'
    });
    itParses('non-color = 10px').as({
      'non-color': '10px'
    });
    itParses('$color: white').as({
      '$color': 'white'
    });
    itParses('$color: white !default').asDefault({
      '$color': 'white'
    });
    itParses('$color: white // foo').as({
      '$color': 'white'
    });
    itParses('$color  : white').as({
      '$color': 'white'
    });
    itParses('$some-color: white;').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$some_color  : white').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$non-color: 10px;').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('$non_color: 10px').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('@color: white;').as({
      '@color': 'white'
    });
    itParses('@non-color: 10px;').as({
      '@non-color': '10px'
    });
    itParses('@non--color: 10px;').as({
      '@non--color': '10px'
    });
    itParses('--color: white;').as({
      'var(--color)': 'white'
    });
    itParses('--non-color: 10px;').as({
      'var(--non-color)': '10px'
    });
    itParses('\\definecolor{orange}{gray}{1}').as({
      '{orange}': 'gray(100%)'
    });
    itParses('\\definecolor{orange}{RGB}{255,127,0}').as({
      '{orange}': 'rgb(255,127,0)'
    });
    itParses('\\definecolor{orange}{rgb}{1,0.5,0}').as({
      '{orange}': 'rgb(255,127,0)'
    });
    itParses('\\definecolor{orange}{cmyk}{0,0.5,1,0}').as({
      '{orange}': 'cmyk(0,0.5,1,0)'
    });
    itParses('\\definecolor{orange}{HTML}{FF7F00}').as({
      '{orange}': '#FF7F00'
    });
    itParses('\\definecolor{darkgreen}{blue!20!black!30!green}').as({
      '{darkgreen}': '{blue!20!black!30!green}'
    });
    itParses('\n.error--large(@color: red) {\n  background-color: @color;\n}').asUndefined();
    return itParses("colors = {\n  red: rgb(255,0,0),\n  green: rgb(0,255,0),\n  blue: rgb(0,0,255)\n  value: 10px\n  light: {\n    base: lightgrey\n  }\n  dark: {\n    base: slategrey\n  }\n}").as({
      'colors.red': {
        value: 'rgb(255,0,0)',
        range: [[1, 2], [1, 14]]
      },
      'colors.green': {
        value: 'rgb(0,255,0)',
        range: [[2, 2], [2, 16]]
      },
      'colors.blue': {
        value: 'rgb(0,0,255)',
        range: [[3, 2], [3, 15]]
      },
      'colors.value': {
        value: '10px',
        range: [[4, 2], [4, 13]]
      },
      'colors.light.base': {
        value: 'lightgrey',
        range: [[9, 4], [9, 17]]
      },
      'colors.dark.base': {
        value: 'slategrey',
        range: [[12, 4], [12, 14]]
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3ZhcmlhYmxlLXBhcnNlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVI7O0VBQ2pCLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVI7O0VBRVgsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7QUFDekIsUUFBQTtJQUFDLFNBQVU7SUFFWCxRQUFBLEdBQVcsU0FBQyxVQUFEO2FBQ1Q7UUFBQSxFQUFBLEVBQUksU0FBQyxTQUFEO1VBQ0YsRUFBQSxDQUFHLFVBQUEsR0FBVyxVQUFYLEdBQXNCLGlCQUF0QixHQUFzQyxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxDQUFELENBQXpDLEVBQW1FLFNBQUE7QUFDakUsZ0JBQUE7WUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxVQUFiO1lBRVYsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFmLENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFaLENBQXNCLENBQUMsTUFBdEQ7QUFDQTtpQkFBQSx5Q0FBQTtnQ0FBSyxpQkFBTSxtQkFBTztjQUNoQixRQUFBLEdBQVcsU0FBVSxDQUFBLElBQUE7Y0FDckIsSUFBRyxzQkFBSDs4QkFDRSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsT0FBZCxDQUFzQixRQUFRLENBQUMsS0FBL0IsR0FERjtlQUFBLE1BRUssSUFBRyxzQkFBSDs4QkFDSCxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsT0FBZCxDQUFzQixRQUFRLENBQUMsS0FBL0IsR0FERztlQUFBLE1BQUE7OEJBR0gsTUFBQSxDQUFPLEtBQVAsQ0FBYSxDQUFDLE9BQWQsQ0FBc0IsUUFBdEIsR0FIRzs7QUFKUDs7VUFKaUUsQ0FBbkU7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LENBQUQsRUFBRyxFQUFILENBQVIsQ0FEUDtPQUZJO01BSU4sY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGNBQVA7UUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FEUDtPQUxJO01BT04sYUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGNBQVA7UUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxFQUFILENBQVAsQ0FEUDtPQVJJO01BVU4sY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLE1BQVA7UUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxFQUFILENBQVAsQ0FEUDtPQVhJO01BYU4sbUJBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxXQUFQO1FBQ0EsS0FBQSxFQUFPLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsRUFBSCxDQUFQLENBRFA7T0FkSTtNQWdCTixrQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFdBQVA7UUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLEVBQUQsRUFBSSxDQUFKLENBQUQsRUFBUSxDQUFDLEVBQUQsRUFBSSxFQUFKLENBQVIsQ0FEUDtPQWpCSTtLQWJSO0VBeEd5QixDQUEzQjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsiVmFyaWFibGVQYXJzZXIgPSByZXF1aXJlICcuLi9saWIvdmFyaWFibGUtcGFyc2VyJ1xucmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvdmFyaWFibGUtZXhwcmVzc2lvbnMnXG5cbmRlc2NyaWJlICdWYXJpYWJsZVBhcnNlcicsIC0+XG4gIFtwYXJzZXJdID0gW11cblxuICBpdFBhcnNlcyA9IChleHByZXNzaW9uKSAtPlxuICAgIGFzOiAodmFyaWFibGVzKSAtPlxuICAgICAgaXQgXCJwYXJzZXMgJyN7ZXhwcmVzc2lvbn0nIGFzIHZhcmlhYmxlcyAje2phc21pbmUucHAodmFyaWFibGVzKX1cIiwgLT5cbiAgICAgICAgcmVzdWx0cyA9IHBhcnNlci5wYXJzZShleHByZXNzaW9uKVxuXG4gICAgICAgIGV4cGVjdChyZXN1bHRzLmxlbmd0aCkudG9FcXVhbChPYmplY3Qua2V5cyh2YXJpYWJsZXMpLmxlbmd0aClcbiAgICAgICAgZm9yIHtuYW1lLCB2YWx1ZSwgcmFuZ2V9IGluIHJlc3VsdHNcbiAgICAgICAgICBleHBlY3RlZCA9IHZhcmlhYmxlc1tuYW1lXVxuICAgICAgICAgIGlmIGV4cGVjdGVkLnZhbHVlP1xuICAgICAgICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKGV4cGVjdGVkLnZhbHVlKVxuICAgICAgICAgIGVsc2UgaWYgZXhwZWN0ZWQucmFuZ2U/XG4gICAgICAgICAgICBleHBlY3QocmFuZ2UpLnRvRXF1YWwoZXhwZWN0ZWQucmFuZ2UpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKGV4cGVjdGVkKVxuXG4gICAgICB0aGlzXG5cbiAgICBhc0RlZmF1bHQ6ICh2YXJpYWJsZXMpIC0+XG4gICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgZGVmYXVsdCB2YXJpYWJsZXMgI3tqYXNtaW5lLnBwKHZhcmlhYmxlcyl9XCIsIC0+XG4gICAgICAgIHJlc3VsdHMgPSBwYXJzZXIucGFyc2UoZXhwcmVzc2lvbilcblxuICAgICAgICBleHBlY3QocmVzdWx0cy5sZW5ndGgpLnRvRXF1YWwoT2JqZWN0LmtleXModmFyaWFibGVzKS5sZW5ndGgpXG4gICAgICAgIGZvciB7bmFtZSwgdmFsdWUsIHJhbmdlLCBkZWZhdWx0OiBpc0RlZmF1bHR9IGluIHJlc3VsdHNcbiAgICAgICAgICBleHBlY3RlZCA9IHZhcmlhYmxlc1tuYW1lXVxuICAgICAgICAgIGV4cGVjdChpc0RlZmF1bHQpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgIGlmIGV4cGVjdGVkLnZhbHVlP1xuICAgICAgICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKGV4cGVjdGVkLnZhbHVlKVxuICAgICAgICAgIGVsc2UgaWYgZXhwZWN0ZWQucmFuZ2U/XG4gICAgICAgICAgICBleHBlY3QocmFuZ2UpLnRvRXF1YWwoZXhwZWN0ZWQucmFuZ2UpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKGV4cGVjdGVkKVxuXG4gICAgICB0aGlzXG5cblxuICAgIGFzVW5kZWZpbmVkOiAtPlxuICAgICAgaXQgXCJkb2VzIG5vdCBwYXJzZSAnI3tleHByZXNzaW9ufScgYXMgYSB2YXJpYWJsZSBleHByZXNzaW9uXCIsIC0+XG4gICAgICAgIHJlc3VsdHMgPSBwYXJzZXIucGFyc2UoZXhwcmVzc2lvbilcblxuICAgICAgICBleHBlY3QocmVzdWx0cykudG9CZVVuZGVmaW5lZCgpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHBhcnNlciA9IG5ldyBWYXJpYWJsZVBhcnNlcihyZWdpc3RyeSlcblxuICBpdFBhcnNlcygnY29sb3IgPSB3aGl0ZScpLmFzKCdjb2xvcic6ICd3aGl0ZScpXG4gIGl0UGFyc2VzKCdub24tY29sb3IgPSAxMHB4JykuYXMoJ25vbi1jb2xvcic6ICcxMHB4JylcblxuICBpdFBhcnNlcygnJGNvbG9yOiB3aGl0ZScpLmFzKCckY29sb3InOiAnd2hpdGUnKVxuICBpdFBhcnNlcygnJGNvbG9yOiB3aGl0ZSAhZGVmYXVsdCcpLmFzRGVmYXVsdCgnJGNvbG9yJzogJ3doaXRlJylcbiAgaXRQYXJzZXMoJyRjb2xvcjogd2hpdGUgLy8gZm9vJykuYXMoJyRjb2xvcic6ICd3aGl0ZScpXG4gIGl0UGFyc2VzKCckY29sb3IgIDogd2hpdGUnKS5hcygnJGNvbG9yJzogJ3doaXRlJylcbiAgaXRQYXJzZXMoJyRzb21lLWNvbG9yOiB3aGl0ZTsnKS5hcyh7XG4gICAgJyRzb21lLWNvbG9yJzogJ3doaXRlJ1xuICAgICckc29tZV9jb2xvcic6ICd3aGl0ZSdcbiAgfSlcbiAgaXRQYXJzZXMoJyRzb21lX2NvbG9yICA6IHdoaXRlJykuYXMoe1xuICAgICckc29tZS1jb2xvcic6ICd3aGl0ZSdcbiAgICAnJHNvbWVfY29sb3InOiAnd2hpdGUnXG4gIH0pXG4gIGl0UGFyc2VzKCckbm9uLWNvbG9yOiAxMHB4OycpLmFzKHtcbiAgICAnJG5vbi1jb2xvcic6ICcxMHB4J1xuICAgICckbm9uX2NvbG9yJzogJzEwcHgnXG4gIH0pXG4gIGl0UGFyc2VzKCckbm9uX2NvbG9yOiAxMHB4JykuYXMoe1xuICAgICckbm9uLWNvbG9yJzogJzEwcHgnXG4gICAgJyRub25fY29sb3InOiAnMTBweCdcbiAgfSlcblxuICBpdFBhcnNlcygnQGNvbG9yOiB3aGl0ZTsnKS5hcygnQGNvbG9yJzogJ3doaXRlJylcbiAgaXRQYXJzZXMoJ0Bub24tY29sb3I6IDEwcHg7JykuYXMoJ0Bub24tY29sb3InOiAnMTBweCcpXG4gIGl0UGFyc2VzKCdAbm9uLS1jb2xvcjogMTBweDsnKS5hcygnQG5vbi0tY29sb3InOiAnMTBweCcpXG5cbiAgaXRQYXJzZXMoJy0tY29sb3I6IHdoaXRlOycpLmFzKCd2YXIoLS1jb2xvciknOiAnd2hpdGUnKVxuICBpdFBhcnNlcygnLS1ub24tY29sb3I6IDEwcHg7JykuYXMoJ3ZhcigtLW5vbi1jb2xvciknOiAnMTBweCcpXG5cbiAgaXRQYXJzZXMoJ1xcXFxkZWZpbmVjb2xvcntvcmFuZ2V9e2dyYXl9ezF9JykuYXMoe1xuICAgICd7b3JhbmdlfSc6ICdncmF5KDEwMCUpJ1xuICB9KVxuXG4gIGl0UGFyc2VzKCdcXFxcZGVmaW5lY29sb3J7b3JhbmdlfXtSR0J9ezI1NSwxMjcsMH0nKS5hcyh7XG4gICAgJ3tvcmFuZ2V9JzogJ3JnYigyNTUsMTI3LDApJ1xuICB9KVxuXG4gIGl0UGFyc2VzKCdcXFxcZGVmaW5lY29sb3J7b3JhbmdlfXtyZ2J9ezEsMC41LDB9JykuYXMoe1xuICAgICd7b3JhbmdlfSc6ICdyZ2IoMjU1LDEyNywwKSdcbiAgfSlcblxuICBpdFBhcnNlcygnXFxcXGRlZmluZWNvbG9ye29yYW5nZX17Y215a317MCwwLjUsMSwwfScpLmFzKHtcbiAgICAne29yYW5nZX0nOiAnY215aygwLDAuNSwxLDApJ1xuICB9KVxuXG4gIGl0UGFyc2VzKCdcXFxcZGVmaW5lY29sb3J7b3JhbmdlfXtIVE1MfXtGRjdGMDB9JykuYXMoe1xuICAgICd7b3JhbmdlfSc6ICcjRkY3RjAwJ1xuICB9KVxuXG4gIGl0UGFyc2VzKCdcXFxcZGVmaW5lY29sb3J7ZGFya2dyZWVufXtibHVlITIwIWJsYWNrITMwIWdyZWVufScpLmFzKHtcbiAgICAne2RhcmtncmVlbn0nOiAne2JsdWUhMjAhYmxhY2shMzAhZ3JlZW59J1xuICB9KVxuXG4gIGl0UGFyc2VzKCdcXG4uZXJyb3ItLWxhcmdlKEBjb2xvcjogcmVkKSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBAY29sb3I7XFxufScpLmFzVW5kZWZpbmVkKClcblxuICBpdFBhcnNlcyhcIlwiXCJcbiAgICBjb2xvcnMgPSB7XG4gICAgICByZWQ6IHJnYigyNTUsMCwwKSxcbiAgICAgIGdyZWVuOiByZ2IoMCwyNTUsMCksXG4gICAgICBibHVlOiByZ2IoMCwwLDI1NSlcbiAgICAgIHZhbHVlOiAxMHB4XG4gICAgICBsaWdodDoge1xuICAgICAgICBiYXNlOiBsaWdodGdyZXlcbiAgICAgIH1cbiAgICAgIGRhcms6IHtcbiAgICAgICAgYmFzZTogc2xhdGVncmV5XG4gICAgICB9XG4gICAgfVxuICBcIlwiXCIpLmFzKHtcbiAgICAnY29sb3JzLnJlZCc6XG4gICAgICB2YWx1ZTogJ3JnYigyNTUsMCwwKSdcbiAgICAgIHJhbmdlOiBbWzEsMl0sIFsxLDE0XV1cbiAgICAnY29sb3JzLmdyZWVuJzpcbiAgICAgIHZhbHVlOiAncmdiKDAsMjU1LDApJ1xuICAgICAgcmFuZ2U6IFtbMiwyXSwgWzIsMTZdXVxuICAgICdjb2xvcnMuYmx1ZSc6XG4gICAgICB2YWx1ZTogJ3JnYigwLDAsMjU1KSdcbiAgICAgIHJhbmdlOiBbWzMsMl0sWzMsMTVdXVxuICAgICdjb2xvcnMudmFsdWUnOlxuICAgICAgdmFsdWU6ICcxMHB4J1xuICAgICAgcmFuZ2U6IFtbNCwyXSxbNCwxM11dXG4gICAgJ2NvbG9ycy5saWdodC5iYXNlJzpcbiAgICAgIHZhbHVlOiAnbGlnaHRncmV5J1xuICAgICAgcmFuZ2U6IFtbOSw0XSxbOSwxN11dXG4gICAgJ2NvbG9ycy5kYXJrLmJhc2UnOlxuICAgICAgdmFsdWU6ICdzbGF0ZWdyZXknXG4gICAgICByYW5nZTogW1sxMiw0XSxbMTIsMTRdXVxuICB9KVxuIl19

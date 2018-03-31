(function() {
  module.exports = {
    name: "Python",
    namespace: "python",
    scope: ['source.python'],

    /*
    Supported Grammars
     */
    grammars: ["Python"],

    /*
    Supported extensions
     */
    extensions: ["py"],
    options: {
      max_line_length: {
        type: 'integer',
        "default": 79,
        description: "set maximum allowed line length"
      },
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      ignore: {
        type: 'array',
        "default": ["E24"],
        items: {
          type: 'string'
        },
        description: "do not fix these errors/warnings"
      },
      formater: {
        type: 'string',
        "default": 'autopep8',
        "enum": ['autopep8', 'yapf'],
        description: "formatter used by pybeautifier"
      },
      style_config: {
        type: 'string',
        "default": 'pep8',
        description: "formatting style used by yapf"
      },
      sort_imports: {
        type: 'boolean',
        "default": false,
        description: "sort imports (requires isort installed)"
      },
      multi_line_output: {
        type: 'string',
        "default": 'Hanging Grid Grouped',
        "enum": ['Grid', 'Vertical', 'Hanging Indent', 'Vertical Hanging Indent', 'Hanging Grid', 'Hanging Grid Grouped', 'NOQA'],
        description: "defines how from imports wrap (requires isort installed)"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvcHl0aG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLFFBRlM7SUFHZixTQUFBLEVBQVcsUUFISTtJQUlmLEtBQUEsRUFBTyxDQUFDLGVBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsUUFEUSxDQVRLOztBQWFmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixJQURVLENBaEJHO0lBb0JmLE9BQUEsRUFDRTtNQUFBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLGlDQUZiO09BREY7TUFJQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BTEY7TUFTQSxNQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxLQUFELENBRFQ7UUFFQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUhGO1FBSUEsV0FBQSxFQUFhLGtDQUpiO09BVkY7TUFlQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsVUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsTUFBYixDQUZOO1FBR0EsV0FBQSxFQUFhLGdDQUhiO09BaEJGO01Bb0JBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsV0FBQSxFQUFhLCtCQUZiO09BckJGO01Bd0JBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHlDQUZiO09BekJGO01BNEJBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsc0JBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQ0osTUFESSxFQUVKLFVBRkksRUFHSixnQkFISSxFQUlKLHlCQUpJLEVBS0osY0FMSSxFQU1KLHNCQU5JLEVBT0osTUFQSSxDQUZOO1FBV0EsV0FBQSxFQUFhLDBEQVhiO09BN0JGO0tBckJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUHl0aG9uXCJcbiAgbmFtZXNwYWNlOiBcInB5dGhvblwiXG4gIHNjb3BlOiBbJ3NvdXJjZS5weXRob24nXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJQeXRob25cIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJweVwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIG1heF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNzlcbiAgICAgIGRlc2NyaXB0aW9uOiBcInNldCBtYXhpbXVtIGFsbG93ZWQgbGluZSBsZW5ndGhcIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaWdub3JlOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1wiRTI0XCJdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcImRvIG5vdCBmaXggdGhlc2UgZXJyb3JzL3dhcm5pbmdzXCJcbiAgICBmb3JtYXRlcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnYXV0b3BlcDgnXG4gICAgICBlbnVtOiBbJ2F1dG9wZXA4JywgJ3lhcGYnXVxuICAgICAgZGVzY3JpcHRpb246IFwiZm9ybWF0dGVyIHVzZWQgYnkgcHliZWF1dGlmaWVyXCJcbiAgICBzdHlsZV9jb25maWc6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3BlcDgnXG4gICAgICBkZXNjcmlwdGlvbjogXCJmb3JtYXR0aW5nIHN0eWxlIHVzZWQgYnkgeWFwZlwiXG4gICAgc29ydF9pbXBvcnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwic29ydCBpbXBvcnRzIChyZXF1aXJlcyBpc29ydCBpbnN0YWxsZWQpXCJcbiAgICBtdWx0aV9saW5lX291dHB1dDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnSGFuZ2luZyBHcmlkIEdyb3VwZWQnXG4gICAgICBlbnVtOiBbXG4gICAgICAgICdHcmlkJ1xuICAgICAgICAnVmVydGljYWwnXG4gICAgICAgICdIYW5naW5nIEluZGVudCdcbiAgICAgICAgJ1ZlcnRpY2FsIEhhbmdpbmcgSW5kZW50J1xuICAgICAgICAnSGFuZ2luZyBHcmlkJ1xuICAgICAgICAnSGFuZ2luZyBHcmlkIEdyb3VwZWQnXG4gICAgICAgICdOT1FBJ1xuICAgICAgXVxuICAgICAgZGVzY3JpcHRpb246IFwiZGVmaW5lcyBob3cgZnJvbSBpbXBvcnRzIHdyYXAgKHJlcXVpcmVzIGlzb3J0IGluc3RhbGxlZClcIlxufVxuIl19

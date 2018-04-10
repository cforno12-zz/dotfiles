(function() {
  module.exports = {
    name: "Python",
    namespace: "python",
    scope: ['source.python'],

    /*
    Supported Grammars
     */
    grammars: ["Python", "MagicPython"],

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
      formatter: {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvcHl0aG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLFFBRlM7SUFHZixTQUFBLEVBQVcsUUFISTtJQUlmLEtBQUEsRUFBTyxDQUFDLGVBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsUUFEUSxFQUVSLGFBRlEsQ0FUSzs7QUFjZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsSUFEVSxDQWpCRztJQXFCZixPQUFBLEVBQ0U7TUFBQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQURGO01BSUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQUxGO01BU0EsTUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsS0FBRCxDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtRQUlBLFdBQUEsRUFBYSxrQ0FKYjtPQVZGO01BZUEsU0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsVUFBRCxFQUFhLE1BQWIsQ0FGTjtRQUdBLFdBQUEsRUFBYSxnQ0FIYjtPQWhCRjtNQW9CQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLFdBQUEsRUFBYSwrQkFGYjtPQXJCRjtNQXdCQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSx5Q0FGYjtPQXpCRjtNQTRCQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLHNCQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUNKLE1BREksRUFFSixVQUZJLEVBR0osZ0JBSEksRUFJSix5QkFKSSxFQUtKLGNBTEksRUFNSixzQkFOSSxFQU9KLE1BUEksQ0FGTjtRQVdBLFdBQUEsRUFBYSwwREFYYjtPQTdCRjtLQXRCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIlB5dGhvblwiXG4gIG5hbWVzcGFjZTogXCJweXRob25cIlxuICBzY29wZTogWydzb3VyY2UucHl0aG9uJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiUHl0aG9uXCIsXG4gICAgXCJNYWdpY1B5dGhvblwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcInB5XCJcbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgbWF4X2xpbmVfbGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA3OVxuICAgICAgZGVzY3JpcHRpb246IFwic2V0IG1heGltdW0gYWxsb3dlZCBsaW5lIGxlbmd0aFwiXG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBpZ25vcmU6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXCJFMjRcIl1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246IFwiZG8gbm90IGZpeCB0aGVzZSBlcnJvcnMvd2FybmluZ3NcIlxuICAgIGZvcm1hdHRlcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnYXV0b3BlcDgnXG4gICAgICBlbnVtOiBbJ2F1dG9wZXA4JywgJ3lhcGYnXVxuICAgICAgZGVzY3JpcHRpb246IFwiZm9ybWF0dGVyIHVzZWQgYnkgcHliZWF1dGlmaWVyXCJcbiAgICBzdHlsZV9jb25maWc6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3BlcDgnXG4gICAgICBkZXNjcmlwdGlvbjogXCJmb3JtYXR0aW5nIHN0eWxlIHVzZWQgYnkgeWFwZlwiXG4gICAgc29ydF9pbXBvcnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwic29ydCBpbXBvcnRzIChyZXF1aXJlcyBpc29ydCBpbnN0YWxsZWQpXCJcbiAgICBtdWx0aV9saW5lX291dHB1dDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnSGFuZ2luZyBHcmlkIEdyb3VwZWQnXG4gICAgICBlbnVtOiBbXG4gICAgICAgICdHcmlkJ1xuICAgICAgICAnVmVydGljYWwnXG4gICAgICAgICdIYW5naW5nIEluZGVudCdcbiAgICAgICAgJ1ZlcnRpY2FsIEhhbmdpbmcgSW5kZW50J1xuICAgICAgICAnSGFuZ2luZyBHcmlkJ1xuICAgICAgICAnSGFuZ2luZyBHcmlkIEdyb3VwZWQnXG4gICAgICAgICdOT1FBJ1xuICAgICAgXVxuICAgICAgZGVzY3JpcHRpb246IFwiZGVmaW5lcyBob3cgZnJvbSBpbXBvcnRzIHdyYXAgKHJlcXVpcmVzIGlzb3J0IGluc3RhbGxlZClcIlxufVxuIl19

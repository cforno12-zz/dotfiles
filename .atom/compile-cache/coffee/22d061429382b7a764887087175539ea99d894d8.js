(function() {
  module.exports = {
    name: "CSS",
    namespace: "css",
    scope: ['source.css'],

    /*
    Supported Grammars
     */
    grammars: ["CSS"],

    /*
    Supported extensions
     */
    extensions: ["css"],
    defaultBeautifier: "JS Beautify",
    options: {
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": null,
        minimum: 0,
        description: "Indentation character"
      },
      selector_separator_newline: {
        type: 'boolean',
        "default": false,
        description: "Add a newline between multiple selectors"
      },
      newline_between_rules: {
        type: 'boolean',
        "default": true,
        description: "Add a newline between CSS rules"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": false,
        description: "Retain empty lines. " + "Consecutive empty lines will be converted to a single empty line."
      },
      wrap_line_length: {
        type: 'integer',
        "default": 0,
        description: "Maximum amount of characters per line (0 = disable)"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      indent_comments: {
        type: 'boolean',
        "default": true,
        description: "Determines whether comments should be indented."
      },
      force_indentation: {
        type: 'boolean',
        "default": false,
        description: "if indentation should be forcefully applied to markup even if it disruptively adds unintended whitespace to the documents rendered output"
      },
      convert_quotes: {
        type: 'string',
        "default": "none",
        description: "Convert the quote characters delimiting strings from either double or single quotes to the other.",
        "enum": ["none", "double", "single"]
      },
      align_assignments: {
        type: 'boolean',
        "default": false,
        description: "If lists of assignments or properties should be vertically aligned for faster and easier reading."
      },
      no_lead_zero: {
        type: 'boolean',
        "default": false,
        description: "If in CSS values leading 0s immediately preceding a decimal should be removed or prevented."
      },
      configPath: {
        title: "comb custom config file",
        type: 'string',
        "default": "",
        description: "Path to custom CSScomb config file, used in absence of a `.csscomb.json` or `.csscomb.cson` at the root of your project."
      },
      predefinedConfig: {
        title: "comb predefined config",
        type: 'string',
        "default": "csscomb",
        description: "Used if neither a project or custom config file exists.",
        "enum": ["csscomb", "yandex", "zen"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvY3NzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTtJQUlmLEtBQUEsRUFBTyxDQUFDLFlBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsS0FEUSxDQVRLOztBQWFmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixLQURVLENBaEJHO0lBb0JmLGlCQUFBLEVBQW1CLGFBcEJKO0lBc0JmLE9BQUEsRUFFRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtNQUtBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEsdUJBSGI7T0FORjtNQVVBLDBCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSwwQ0FGYjtPQVhGO01BY0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGlDQUZiO09BZkY7TUFrQkEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHNCQUFBLEdBQ1gsbUVBSEY7T0FuQkY7TUF3QkEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO1FBRUEsV0FBQSxFQUFhLHFEQUZiO09BekJGO01BNEJBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSx5QkFGYjtPQTdCRjtNQWdDQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxpREFGYjtPQWpDRjtNQW9DQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsMklBRmI7T0FyQ0Y7TUEwQ0EsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BRFQ7UUFFQSxXQUFBLEVBQWEsbUdBRmI7UUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsUUFBbkIsQ0FKTjtPQTNDRjtNQWdEQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsbUdBRmI7T0FqREY7TUFxREEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsNkZBRmI7T0F0REY7TUEwREEsVUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHlCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsMEhBSGI7T0EzREY7TUFnRUEsZ0JBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyx3QkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQUZUO1FBR0EsV0FBQSxFQUFhLHlEQUhiO1FBSUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLEtBQXRCLENBSk47T0FqRUY7S0F4QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJDU1NcIlxuICBuYW1lc3BhY2U6IFwiY3NzXCJcbiAgc2NvcGU6IFsnc291cmNlLmNzcyddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkNTU1wiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImNzc1wiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJKUyBCZWF1dGlmeVwiXG5cbiAgb3B0aW9uczpcbiAgICAjIENTU1xuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBzZWxlY3Rvcl9zZXBhcmF0b3JfbmV3bGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFkZCBhIG5ld2xpbmUgYmV0d2VlbiBtdWx0aXBsZSBzZWxlY3RvcnNcIlxuICAgIG5ld2xpbmVfYmV0d2Vlbl9ydWxlczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIGEgbmV3bGluZSBiZXR3ZWVuIENTUyBydWxlc1wiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJSZXRhaW4gZW1wdHkgbGluZXMuIFwiK1xuICAgICAgICBcIkNvbnNlY3V0aXZlIGVtcHR5IGxpbmVzIHdpbGwgYmUgY29udmVydGVkIHRvIFxcXG4gICAgICAgICAgICAgICAgYSBzaW5nbGUgZW1wdHkgbGluZS5cIlxuICAgIHdyYXBfbGluZV9sZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1heGltdW0gYW1vdW50IG9mIGNoYXJhY3RlcnMgcGVyIGxpbmUgKDAgPSBkaXNhYmxlKVwiXG4gICAgZW5kX3dpdGhfbmV3bGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkVuZCBvdXRwdXQgd2l0aCBuZXdsaW5lXCJcbiAgICBpbmRlbnRfY29tbWVudHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkRldGVybWluZXMgd2hldGhlciBjb21tZW50cyBzaG91bGQgYmUgaW5kZW50ZWQuXCJcbiAgICBmb3JjZV9pbmRlbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcImlmIGluZGVudGF0aW9uIHNob3VsZCBiZSBmb3JjZWZ1bGx5IGFwcGxpZWQgdG8gXFxcbiAgICAgICAgICAgICAgICBtYXJrdXAgZXZlbiBpZiBpdCBkaXNydXB0aXZlbHkgYWRkcyB1bmludGVuZGVkIHdoaXRlc3BhY2UgXFxcbiAgICAgICAgICAgICAgICB0byB0aGUgZG9jdW1lbnRzIHJlbmRlcmVkIG91dHB1dFwiXG4gICAgY29udmVydF9xdW90ZXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJub25lXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbnZlcnQgdGhlIHF1b3RlIGNoYXJhY3RlcnMgZGVsaW1pdGluZyBzdHJpbmdzIFxcXG4gICAgICAgICAgICAgICAgZnJvbSBlaXRoZXIgZG91YmxlIG9yIHNpbmdsZSBxdW90ZXMgdG8gdGhlIG90aGVyLlwiXG4gICAgICBlbnVtOiBbXCJub25lXCIsIFwiZG91YmxlXCIsIFwic2luZ2xlXCJdXG4gICAgYWxpZ25fYXNzaWdubWVudHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJZiBsaXN0cyBvZiBhc3NpZ25tZW50cyBvciBwcm9wZXJ0aWVzIHNob3VsZCBiZSBcXFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsbHkgYWxpZ25lZCBmb3IgZmFzdGVyIGFuZCBlYXNpZXIgcmVhZGluZy5cIlxuICAgIG5vX2xlYWRfemVybzpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGluIENTUyB2YWx1ZXMgbGVhZGluZyAwcyBpbW1lZGlhdGVseSBwcmVjZWRpbmcgXFxcbiAgICAgICAgICAgICAgICBhIGRlY2ltYWwgc2hvdWxkIGJlIHJlbW92ZWQgb3IgcHJldmVudGVkLlwiXG4gICAgY29uZmlnUGF0aDpcbiAgICAgIHRpdGxlOiBcImNvbWIgY3VzdG9tIGNvbmZpZyBmaWxlXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGN1c3RvbSBDU1Njb21iIGNvbmZpZyBmaWxlLCB1c2VkIGluIGFic2VuY2Ugb2YgYSBcXFxuICAgICAgICAgICAgICAgIGAuY3NzY29tYi5qc29uYCBvciBgLmNzc2NvbWIuY3NvbmAgYXQgdGhlIHJvb3Qgb2YgeW91ciBwcm9qZWN0LlwiXG4gICAgcHJlZGVmaW5lZENvbmZpZzpcbiAgICAgIHRpdGxlOiBcImNvbWIgcHJlZGVmaW5lZCBjb25maWdcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiY3NzY29tYlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJVc2VkIGlmIG5laXRoZXIgYSBwcm9qZWN0IG9yIGN1c3RvbSBjb25maWcgZmlsZSBleGlzdHMuXCJcbiAgICAgIGVudW06IFtcImNzc2NvbWJcIiwgXCJ5YW5kZXhcIiwgXCJ6ZW5cIl1cbn1cbiJdfQ==

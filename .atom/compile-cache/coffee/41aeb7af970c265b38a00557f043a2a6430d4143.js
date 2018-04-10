(function() {
  module.exports = {
    name: "JavaScript",
    namespace: "js",
    scope: ['source.js'],

    /*
    Supported Grammars
     */
    grammars: ["JavaScript"],

    /*
    Supported extensions
     */
    extensions: ["js"],
    defaultBeautifier: "JS Beautify",

    /*
     */
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
        description: "Indentation character"
      },
      indent_level: {
        type: 'integer',
        "default": 0,
        description: "Initial indentation level"
      },
      indent_with_tabs: {
        type: 'boolean',
        "default": null,
        description: "Indentation uses tabs, overrides `Indent Size` and `Indent Char`"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      },
      max_preserve_newlines: {
        type: 'integer',
        "default": 10,
        description: "Number of line-breaks to be preserved in one chunk"
      },
      space_in_paren: {
        type: 'boolean',
        "default": false,
        description: "Add padding spaces within paren, ie. f( a, b )"
      },
      jslint_happy: {
        type: 'boolean',
        "default": false,
        description: "Enable jslint-stricter mode"
      },
      space_after_anon_function: {
        type: 'boolean',
        "default": false,
        description: "Add a space before an anonymous function's parens, ie. function ()"
      },
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "collapse-preserve-inline", "expand", "end-expand", "none"],
        description: "[collapse|collapse-preserve-inline|expand|end-expand|none]"
      },
      break_chained_methods: {
        type: 'boolean',
        "default": false,
        description: "Break chained method calls across subsequent lines"
      },
      keep_array_indentation: {
        type: 'boolean',
        "default": false,
        description: "Preserve array indentation"
      },
      keep_function_indentation: {
        type: 'boolean',
        "default": false,
        description: ""
      },
      space_before_conditional: {
        type: 'boolean',
        "default": true,
        description: ""
      },
      eval_code: {
        type: 'boolean',
        "default": false,
        description: ""
      },
      unescape_strings: {
        type: 'boolean',
        "default": false,
        description: "Decode printable characters encoded in xNN notation"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 0,
        description: "Wrap lines at next opportunity after N characters"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      end_with_comma: {
        type: 'boolean',
        "default": false,
        description: "If a terminating comma should be inserted into arrays, object literals, and destructured objects."
      },
      end_of_line: {
        type: 'string',
        "default": "System Default",
        "enum": ["CRLF", "LF", "System Default"],
        description: "Override EOL from line-ending-selector"
      },
      object_curly_spacing: {
        type: 'boolean',
        "default": false,
        description: "Insert spaces between brackets in object literals"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvamF2YXNjcmlwdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxZQUZTO0lBR2YsU0FBQSxFQUFXLElBSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLFlBRFEsQ0FUSzs7QUFhZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsSUFEVSxDQWhCRztJQW9CZixpQkFBQSxFQUFtQixhQXBCSjs7QUFzQmY7O0lBRUEsT0FBQSxFQUVFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7T0FORjtNQVNBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO1FBRUEsV0FBQSxFQUFhLDJCQUZiO09BVkY7TUFhQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsa0VBRmI7T0FkRjtNQWlCQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsc0JBRmI7T0FsQkY7TUFxQkEscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLG9EQUZiO09BdEJGO01BeUJBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLGdEQUZiO09BMUJGO01BNkJBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDZCQUZiO09BOUJGO01BaUNBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxvRUFGYjtPQWxDRjtNQXFDQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsVUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsMEJBQWIsRUFBeUMsUUFBekMsRUFBbUQsWUFBbkQsRUFBaUUsTUFBakUsQ0FGTjtRQUdBLFdBQUEsRUFBYSw0REFIYjtPQXRDRjtNQTBDQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0RBRmI7T0EzQ0Y7TUE4Q0Esc0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRCQUZiO09BL0NGO01Ba0RBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxFQUZiO09BbkRGO01Bc0RBLHdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxFQUZiO09BdkRGO01BMERBLFNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLEVBRmI7T0EzREY7TUE4REEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHFEQUZiO09BL0RGO01Ba0VBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLFdBQUEsRUFBYSxtREFGYjtPQW5FRjtNQXNFQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEseUJBRmI7T0F2RUY7TUEwRUEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsbUdBRmI7T0EzRUY7TUErRUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdCQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUSxJQUFSLEVBQWEsZ0JBQWIsQ0FGTjtRQUdBLFdBQUEsRUFBYSx3Q0FIYjtPQWhGRjtNQW9GQSxvQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsbURBRmI7T0FyRkY7S0ExQmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJKYXZhU2NyaXB0XCJcbiAgbmFtZXNwYWNlOiBcImpzXCJcbiAgc2NvcGU6IFsnc291cmNlLmpzJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSmF2YVNjcmlwdFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImpzXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIkpTIEJlYXV0aWZ5XCJcblxuICAjIyNcbiAgIyMjXG4gIG9wdGlvbnM6XG4gICAgIyBKYXZhU2NyaXB0XG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIGluZGVudF9sZXZlbDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5pdGlhbCBpbmRlbnRhdGlvbiBsZXZlbFwiXG4gICAgaW5kZW50X3dpdGhfdGFiczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gdXNlcyB0YWJzLCBvdmVycmlkZXMgYEluZGVudCBTaXplYCBhbmQgYEluZGVudCBDaGFyYFwiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGxpbmUtYnJlYWtzXCJcbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICBkZXNjcmlwdGlvbjogXCJOdW1iZXIgb2YgbGluZS1icmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVua1wiXG4gICAgc3BhY2VfaW5fcGFyZW46XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgcGFkZGluZyBzcGFjZXMgd2l0aGluIHBhcmVuLCBpZS4gZiggYSwgYiApXCJcbiAgICBqc2xpbnRfaGFwcHk6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmFibGUganNsaW50LXN0cmljdGVyIG1vZGVcIlxuICAgIHNwYWNlX2FmdGVyX2Fub25fZnVuY3Rpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgYSBzcGFjZSBiZWZvcmUgYW4gYW5vbnltb3VzIGZ1bmN0aW9uJ3MgcGFyZW5zLCBpZS4gZnVuY3Rpb24gKClcIlxuICAgIGJyYWNlX3N0eWxlOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiY29sbGFwc2VcIlxuICAgICAgZW51bTogW1wiY29sbGFwc2VcIiwgXCJjb2xsYXBzZS1wcmVzZXJ2ZS1pbmxpbmVcIiwgXCJleHBhbmRcIiwgXCJlbmQtZXhwYW5kXCIsIFwibm9uZVwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiW2NvbGxhcHNlfGNvbGxhcHNlLXByZXNlcnZlLWlubGluZXxleHBhbmR8ZW5kLWV4cGFuZHxub25lXVwiXG4gICAgYnJlYWtfY2hhaW5lZF9tZXRob2RzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiQnJlYWsgY2hhaW5lZCBtZXRob2QgY2FsbHMgYWNyb3NzIHN1YnNlcXVlbnQgbGluZXNcIlxuICAgIGtlZXBfYXJyYXlfaW5kZW50YXRpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmVzZXJ2ZSBhcnJheSBpbmRlbnRhdGlvblwiXG4gICAga2VlcF9mdW5jdGlvbl9pbmRlbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXG4gICAgc3BhY2VfYmVmb3JlX2NvbmRpdGlvbmFsOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIlxuICAgIGV2YWxfY29kZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXG4gICAgdW5lc2NhcGVfc3RyaW5nczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkRlY29kZSBwcmludGFibGUgY2hhcmFjdGVycyBlbmNvZGVkIGluIHhOTiBub3RhdGlvblwiXG4gICAgd3JhcF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgZGVzY3JpcHRpb246IFwiV3JhcCBsaW5lcyBhdCBuZXh0IG9wcG9ydHVuaXR5IGFmdGVyIE4gY2hhcmFjdGVyc1wiXG4gICAgZW5kX3dpdGhfbmV3bGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkVuZCBvdXRwdXQgd2l0aCBuZXdsaW5lXCJcbiAgICBlbmRfd2l0aF9jb21tYTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGEgdGVybWluYXRpbmcgY29tbWEgc2hvdWxkIGJlIGluc2VydGVkIGludG8gXFxcbiAgICAgICAgICAgICAgICAgIGFycmF5cywgb2JqZWN0IGxpdGVyYWxzLCBhbmQgZGVzdHJ1Y3R1cmVkIG9iamVjdHMuXCJcbiAgICBlbmRfb2ZfbGluZTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlN5c3RlbSBEZWZhdWx0XCJcbiAgICAgIGVudW06IFtcIkNSTEZcIixcIkxGXCIsXCJTeXN0ZW0gRGVmYXVsdFwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiT3ZlcnJpZGUgRU9MIGZyb20gbGluZS1lbmRpbmctc2VsZWN0b3JcIlxuICAgIG9iamVjdF9jdXJseV9zcGFjaW5nOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSW5zZXJ0IHNwYWNlcyBiZXR3ZWVuIGJyYWNrZXRzIGluIG9iamVjdCBsaXRlcmFsc1wiXG5cbn1cbiJdfQ==

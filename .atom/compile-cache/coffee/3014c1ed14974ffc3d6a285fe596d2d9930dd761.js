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
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvamF2YXNjcmlwdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxZQUZTO0lBR2YsU0FBQSxFQUFXLElBSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLFlBRFEsQ0FUSzs7QUFhZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsSUFEVSxDQWhCRztJQW9CZixpQkFBQSxFQUFtQixhQXBCSjs7QUFzQmY7O0lBRUEsT0FBQSxFQUVFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7T0FORjtNQVNBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO1FBRUEsV0FBQSxFQUFhLDJCQUZiO09BVkY7TUFhQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsa0VBRmI7T0FkRjtNQWlCQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsc0JBRmI7T0FsQkY7TUFxQkEscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLG9EQUZiO09BdEJGO01BeUJBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLGdEQUZiO09BMUJGO01BNkJBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDZCQUZiO09BOUJGO01BaUNBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxvRUFGYjtPQWxDRjtNQXFDQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsVUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsMEJBQWIsRUFBeUMsUUFBekMsRUFBbUQsWUFBbkQsRUFBaUUsTUFBakUsQ0FGTjtRQUdBLFdBQUEsRUFBYSw0REFIYjtPQXRDRjtNQTBDQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0RBRmI7T0EzQ0Y7TUE4Q0Esc0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRCQUZiO09BL0NGO01Ba0RBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxFQUZiO09BbkRGO01Bc0RBLHdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxFQUZiO09BdkRGO01BMERBLFNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLEVBRmI7T0EzREY7TUE4REEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHFEQUZiO09BL0RGO01Ba0VBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLFdBQUEsRUFBYSxtREFGYjtPQW5FRjtNQXNFQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEseUJBRmI7T0F2RUY7TUEwRUEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsbUdBRmI7T0EzRUY7TUErRUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdCQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUSxJQUFSLEVBQWEsZ0JBQWIsQ0FGTjtRQUdBLFdBQUEsRUFBYSx3Q0FIYjtPQWhGRjtLQTFCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkphdmFTY3JpcHRcIlxuICBuYW1lc3BhY2U6IFwianNcIlxuICBzY29wZTogWydzb3VyY2UuanMnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJKYXZhU2NyaXB0XCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwianNcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiSlMgQmVhdXRpZnlcIlxuXG4gICMjI1xuICAjIyNcbiAgb3B0aW9uczpcbiAgICAjIEphdmFTY3JpcHRcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgaW5kZW50X2xldmVsOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbml0aWFsIGluZGVudGF0aW9uIGxldmVsXCJcbiAgICBpbmRlbnRfd2l0aF90YWJzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiB1c2VzIHRhYnMsIG92ZXJyaWRlcyBgSW5kZW50IFNpemVgIGFuZCBgSW5kZW50IENoYXJgXCJcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiUHJlc2VydmUgbGluZS1icmVha3NcIlxuICAgIG1heF9wcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMTBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk51bWJlciBvZiBsaW5lLWJyZWFrcyB0byBiZSBwcmVzZXJ2ZWQgaW4gb25lIGNodW5rXCJcbiAgICBzcGFjZV9pbl9wYXJlbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFkZCBwYWRkaW5nIHNwYWNlcyB3aXRoaW4gcGFyZW4sIGllLiBmKCBhLCBiIClcIlxuICAgIGpzbGludF9oYXBweTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkVuYWJsZSBqc2xpbnQtc3RyaWN0ZXIgbW9kZVwiXG4gICAgc3BhY2VfYWZ0ZXJfYW5vbl9mdW5jdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFkZCBhIHNwYWNlIGJlZm9yZSBhbiBhbm9ueW1vdXMgZnVuY3Rpb24ncyBwYXJlbnMsIGllLiBmdW5jdGlvbiAoKVwiXG4gICAgYnJhY2Vfc3R5bGU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJjb2xsYXBzZVwiXG4gICAgICBlbnVtOiBbXCJjb2xsYXBzZVwiLCBcImNvbGxhcHNlLXByZXNlcnZlLWlubGluZVwiLCBcImV4cGFuZFwiLCBcImVuZC1leHBhbmRcIiwgXCJub25lXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJbY29sbGFwc2V8Y29sbGFwc2UtcHJlc2VydmUtaW5saW5lfGV4cGFuZHxlbmQtZXhwYW5kfG5vbmVdXCJcbiAgICBicmVha19jaGFpbmVkX21ldGhvZHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJCcmVhayBjaGFpbmVkIG1ldGhvZCBjYWxscyBhY3Jvc3Mgc3Vic2VxdWVudCBsaW5lc1wiXG4gICAga2VlcF9hcnJheV9pbmRlbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGFycmF5IGluZGVudGF0aW9uXCJcbiAgICBrZWVwX2Z1bmN0aW9uX2luZGVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiXCJcbiAgICBzcGFjZV9iZWZvcmVfY29uZGl0aW9uYWw6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXG4gICAgZXZhbF9jb2RlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiXCJcbiAgICB1bmVzY2FwZV9zdHJpbmdzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiRGVjb2RlIHByaW50YWJsZSBjaGFyYWN0ZXJzIGVuY29kZWQgaW4geE5OIG5vdGF0aW9uXCJcbiAgICB3cmFwX2xpbmVfbGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJXcmFwIGxpbmVzIGF0IG5leHQgb3Bwb3J0dW5pdHkgYWZ0ZXIgTiBjaGFyYWN0ZXJzXCJcbiAgICBlbmRfd2l0aF9uZXdsaW5lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiRW5kIG91dHB1dCB3aXRoIG5ld2xpbmVcIlxuICAgIGVuZF93aXRoX2NvbW1hOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgYSB0ZXJtaW5hdGluZyBjb21tYSBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBcXFxuICAgICAgICAgICAgICAgICAgYXJyYXlzLCBvYmplY3QgbGl0ZXJhbHMsIGFuZCBkZXN0cnVjdHVyZWQgb2JqZWN0cy5cIlxuICAgIGVuZF9vZl9saW5lOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiU3lzdGVtIERlZmF1bHRcIlxuICAgICAgZW51bTogW1wiQ1JMRlwiLFwiTEZcIixcIlN5c3RlbSBEZWZhdWx0XCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJPdmVycmlkZSBFT0wgZnJvbSBsaW5lLWVuZGluZy1zZWxlY3RvclwiXG5cbn1cbiJdfQ==

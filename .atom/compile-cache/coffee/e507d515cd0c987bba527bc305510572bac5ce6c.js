(function() {
  module.exports = {
    name: "HTML",
    namespace: "html",
    scope: ['text.html'],

    /*
    Supported Grammars
     */
    grammars: ["HTML"],

    /*
    Supported extensions
     */
    extensions: ["html"],
    options: {
      indent_inner_html: {
        type: 'boolean',
        "default": false,
        description: "Indent <head> and <body> sections."
      },
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
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "expand", "end-expand", "none"],
        description: "[collapse|expand|end-expand|none]"
      },
      indent_scripts: {
        type: 'string',
        "default": "normal",
        "enum": ["keep", "separate", "normal"],
        description: "[keep|separate|normal]"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      wrap_attributes: {
        type: 'string',
        "default": "auto",
        "enum": ["auto", "aligned-multiple", "force", "force-aligned", "force-expand-multiline"],
        description: "Wrap attributes to new lines [auto|aligned-multiple|force|force-aligned|force-expand-multiline]"
      },
      wrap_attributes_indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indent wrapped attributes to after N characters"
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
      unformatted: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        description: "(Deprecated for most scenarios - consider inline or content_unformatted) List of tags that should not be reformatted at all.  NOTE: Set this to [] to get improved beautifier behavior."
      },
      inline: {
        type: 'array',
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'],
        items: {
          type: 'string'
        },
        description: "List of inline tags. Behaves similar to text content, will not wrap without whitespace."
      },
      content_unformatted: {
        type: 'array',
        "default": ['pre', 'textarea'],
        items: {
          type: 'string'
        },
        description: "List of tags whose contents should not be reformatted. Attributes will be reformatted, inner html will not."
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      extra_liners: {
        type: 'array',
        "default": ['head', 'body', '/html'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to [head,body,/html] that should have an extra newline before them."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvaHRtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsQ0FUSzs7QUFhZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsTUFEVSxDQWhCRztJQW9CZixPQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0NBRmI7T0FERjtNQUlBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FMRjtNQVNBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHVCQUZiO09BVkY7TUFhQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsVUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixZQUF2QixFQUFxQyxNQUFyQyxDQUZOO1FBR0EsV0FBQSxFQUFhLG1DQUhiO09BZEY7TUFrQkEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFFBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFN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LEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSx5QkFGYjtPQXhFRjtNQTJFQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQixDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtRQUlBLFdBQUEsRUFBYSw0RkFKYjtPQTVFRjtLQXJCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkhUTUxcIlxuICBuYW1lc3BhY2U6IFwiaHRtbFwiXG4gIHNjb3BlOiBbJ3RleHQuaHRtbCddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkhUTUxcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJodG1sXCJcbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgaW5kZW50X2lubmVyX2h0bWw6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnQgPGhlYWQ+IGFuZCA8Ym9keT4gc2VjdGlvbnMuXCJcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgYnJhY2Vfc3R5bGU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJjb2xsYXBzZVwiXG4gICAgICBlbnVtOiBbXCJjb2xsYXBzZVwiLCBcImV4cGFuZFwiLCBcImVuZC1leHBhbmRcIiwgXCJub25lXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJbY29sbGFwc2V8ZXhwYW5kfGVuZC1leHBhbmR8bm9uZV1cIlxuICAgIGluZGVudF9zY3JpcHRzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwibm9ybWFsXCJcbiAgICAgIGVudW06IFtcImtlZXBcIiwgXCJzZXBhcmF0ZVwiLCBcIm5vcm1hbFwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiW2tlZXB8c2VwYXJhdGV8bm9ybWFsXVwiXG4gICAgd3JhcF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMjUwXG4gICAgICBkZXNjcmlwdGlvbjogXCJNYXhpbXVtIGNoYXJhY3RlcnMgcGVyIGxpbmUgKDAgZGlzYWJsZXMpXCJcbiAgICB3cmFwX2F0dHJpYnV0ZXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJhdXRvXCJcbiAgICAgIGVudW06IFtcImF1dG9cIiwgXCJhbGlnbmVkLW11bHRpcGxlXCIsIFwiZm9yY2VcIiwgXCJmb3JjZS1hbGlnbmVkXCIsIFwiZm9yY2UtZXhwYW5kLW11bHRpbGluZVwiXVxuICAgICAgZGVzY3JpcHRpb246IFwiV3JhcCBhdHRyaWJ1dGVzIHRvIG5ldyBsaW5lcyBbYXV0b3xhbGlnbmVkLW11bHRpcGxlfGZvcmNlfGZvcmNlLWFsaWduZWR8Zm9yY2UtZXhwYW5kLW11bHRpbGluZV1cIlxuICAgIHdyYXBfYXR0cmlidXRlc19pbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50IHdyYXBwZWQgYXR0cmlidXRlcyB0byBhZnRlciBOIGNoYXJhY3RlcnNcIlxuICAgIHByZXNlcnZlX25ld2xpbmVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmVzZXJ2ZSBsaW5lLWJyZWFrc1wiXG4gICAgbWF4X3ByZXNlcnZlX25ld2xpbmVzOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAxMFxuICAgICAgZGVzY3JpcHRpb246IFwiTnVtYmVyIG9mIGxpbmUtYnJlYWtzIHRvIGJlIHByZXNlcnZlZCBpbiBvbmUgY2h1bmtcIlxuICAgIHVuZm9ybWF0dGVkOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW11cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246IFwiKERlcHJlY2F0ZWQgZm9yIG1vc3Qgc2NlbmFyaW9zIC0gY29uc2lkZXIgaW5saW5lIG9yIGNvbnRlbnRfdW5mb3JtYXR0ZWQpIExpc3Qgb2YgdGFncyB0aGF0IHNob3VsZCBub3QgYmUgcmVmb3JtYXR0ZWQgYXQgYWxsLiAgTk9URTogU2V0IHRoaXMgdG8gW10gdG8gZ2V0IGltcHJvdmVkIGJlYXV0aWZpZXIgYmVoYXZpb3IuXCJcbiAgICBpbmxpbmU6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICAgICAnYScsICdhYmJyJywgJ2FyZWEnLCAnYXVkaW8nLCAnYicsICdiZGknLCAnYmRvJywgJ2JyJywgJ2J1dHRvbicsICdjYW52YXMnLCAnY2l0ZScsXG4gICAgICAgICAgICAnY29kZScsICdkYXRhJywgJ2RhdGFsaXN0JywgJ2RlbCcsICdkZm4nLCAnZW0nLCAnZW1iZWQnLCAnaScsICdpZnJhbWUnLCAnaW1nJyxcbiAgICAgICAgICAgICdpbnB1dCcsICdpbnMnLCAna2JkJywgJ2tleWdlbicsICdsYWJlbCcsICdtYXAnLCAnbWFyaycsICdtYXRoJywgJ21ldGVyJywgJ25vc2NyaXB0JyxcbiAgICAgICAgICAgICdvYmplY3QnLCAnb3V0cHV0JywgJ3Byb2dyZXNzJywgJ3EnLCAncnVieScsICdzJywgJ3NhbXAnLCAnc2VsZWN0JywgJ3NtYWxsJyxcbiAgICAgICAgICAgICdzcGFuJywgJ3N0cm9uZycsICdzdWInLCAnc3VwJywgJ3N2ZycsICd0ZW1wbGF0ZScsICd0ZXh0YXJlYScsICd0aW1lJywgJ3UnLCAndmFyJyxcbiAgICAgICAgICAgICd2aWRlbycsICd3YnInLCAndGV4dCcsXG4gICAgICAgICAgICAnYWNyb255bScsICdhZGRyZXNzJywgJ2JpZycsICdkdCcsICdpbnMnLCAnc3RyaWtlJywgJ3R0J1xuICAgICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgaW5saW5lIHRhZ3MuIEJlaGF2ZXMgc2ltaWxhciB0byB0ZXh0IGNvbnRlbnQsIHdpbGwgbm90IHdyYXAgd2l0aG91dCB3aGl0ZXNwYWNlLlwiXG4gICAgY29udGVudF91bmZvcm1hdHRlZDpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFsgJ3ByZScsICd0ZXh0YXJlYScgXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIHRhZ3Mgd2hvc2UgY29udGVudHMgc2hvdWxkIG5vdCBiZSByZWZvcm1hdHRlZC4gQXR0cmlidXRlcyB3aWxsIGJlIHJlZm9ybWF0dGVkLCBpbm5lciBodG1sIHdpbGwgbm90LlwiXG4gICAgZW5kX3dpdGhfbmV3bGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkVuZCBvdXRwdXQgd2l0aCBuZXdsaW5lXCJcbiAgICBleHRyYV9saW5lcnM6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJ2hlYWQnLCAnYm9keScsICcvaHRtbCddXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgdGFncyAoZGVmYXVsdHMgdG8gW2hlYWQsYm9keSwvaHRtbF0gdGhhdCBzaG91bGQgaGF2ZSBhbiBleHRyYSBuZXdsaW5lIGJlZm9yZSB0aGVtLlwiXG5cbn1cbiJdfQ==

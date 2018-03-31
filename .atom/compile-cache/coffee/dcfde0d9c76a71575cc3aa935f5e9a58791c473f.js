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
        "enum": ["auto", "force", "force-aligned", "force-expand-multiline"],
        description: "Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline]"
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
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'small', 'strike', 'tt', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to inline) that should not be reformatted"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvaHRtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsQ0FUSzs7QUFhZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsTUFEVSxDQWhCRztJQW9CZixPQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsb0NBRmI7T0FERjtNQUlBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FMRjtNQVNBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHVCQUZiO09BVkY7TUFhQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsVUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixZQUF2QixFQUFxQyxNQUFyQyxDQUZOO1FBR0EsV0FBQSxFQUFhLG1DQUhiO09BZEY7TUFrQkEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFFBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsTUFB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ZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiSFRNTFwiXG4gIG5hbWVzcGFjZTogXCJodG1sXCJcbiAgc2NvcGU6IFsndGV4dC5odG1sJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSFRNTFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImh0bWxcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfaW5uZXJfaHRtbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudCA8aGVhZD4gYW5kIDxib2R5PiBzZWN0aW9ucy5cIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBicmFjZV9zdHlsZTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImNvbGxhcHNlXCJcbiAgICAgIGVudW06IFtcImNvbGxhcHNlXCIsIFwiZXhwYW5kXCIsIFwiZW5kLWV4cGFuZFwiLCBcIm5vbmVcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIltjb2xsYXBzZXxleHBhbmR8ZW5kLWV4cGFuZHxub25lXVwiXG4gICAgaW5kZW50X3NjcmlwdHM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJub3JtYWxcIlxuICAgICAgZW51bTogW1wia2VlcFwiLCBcInNlcGFyYXRlXCIsIFwibm9ybWFsXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJba2VlcHxzZXBhcmF0ZXxub3JtYWxdXCJcbiAgICB3cmFwX2xpbmVfbGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyNTBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1heGltdW0gY2hhcmFjdGVycyBwZXIgbGluZSAoMCBkaXNhYmxlcylcIlxuICAgIHdyYXBfYXR0cmlidXRlczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImF1dG9cIlxuICAgICAgZW51bTogW1wiYXV0b1wiLCBcImZvcmNlXCIsIFwiZm9yY2UtYWxpZ25lZFwiLCBcImZvcmNlLWV4cGFuZC1tdWx0aWxpbmVcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIldyYXAgYXR0cmlidXRlcyB0byBuZXcgbGluZXMgW2F1dG98Zm9yY2V8Zm9yY2UtYWxpZ25lZHxmb3JjZS1leHBhbmQtbXVsdGlsaW5lXVwiXG4gICAgd3JhcF9hdHRyaWJ1dGVzX2luZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnQgd3JhcHBlZCBhdHRyaWJ1dGVzIHRvIGFmdGVyIE4gY2hhcmFjdGVyc1wiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGxpbmUtYnJlYWtzXCJcbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICBkZXNjcmlwdGlvbjogXCJOdW1iZXIgb2YgbGluZS1icmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVua1wiXG4gICAgdW5mb3JtYXR0ZWQ6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICAgICAnYScsICdhYmJyJywgJ2FyZWEnLCAnYXVkaW8nLCAnYicsICdiZGknLCAnYmRvJywgJ2JyJywgJ2J1dHRvbicsICdjYW52YXMnLCAnY2l0ZScsXG4gICAgICAgICAgICAnY29kZScsICdkYXRhJywgJ2RhdGFsaXN0JywgJ2RlbCcsICdkZm4nLCAnZW0nLCAnZW1iZWQnLCAnaScsICdpZnJhbWUnLCAnaW1nJyxcbiAgICAgICAgICAgICdpbnB1dCcsICdpbnMnLCAna2JkJywgJ2tleWdlbicsICdsYWJlbCcsICdtYXAnLCAnbWFyaycsICdtYXRoJywgJ21ldGVyJywgJ25vc2NyaXB0JyxcbiAgICAgICAgICAgICdvYmplY3QnLCAnb3V0cHV0JywgJ3Byb2dyZXNzJywgJ3EnLCAncnVieScsICdzJywgJ3NhbXAnLCAnc2VsZWN0JywgJ3NtYWxsJyxcbiAgICAgICAgICAgICdzcGFuJywgJ3N0cm9uZycsICdzdWInLCAnc3VwJywgJ3N2ZycsICd0ZW1wbGF0ZScsICd0ZXh0YXJlYScsICd0aW1lJywgJ3UnLCAndmFyJyxcbiAgICAgICAgICAgICd2aWRlbycsICd3YnInLCAndGV4dCcsXG4gICAgICAgICAgICAnYWNyb255bScsICdhZGRyZXNzJywgJ2JpZycsICdkdCcsICdpbnMnLCAnc21hbGwnLCAnc3RyaWtlJywgJ3R0JyxcbiAgICAgICAgICAgICdwcmUnLFxuICAgICAgICAgICAgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J1xuICAgICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgdGFncyAoZGVmYXVsdHMgdG8gaW5saW5lKSB0aGF0IHNob3VsZCBub3QgYmUgcmVmb3JtYXR0ZWRcIlxuICAgIGVuZF93aXRoX25ld2xpbmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbmQgb3V0cHV0IHdpdGggbmV3bGluZVwiXG4gICAgZXh0cmFfbGluZXJzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydoZWFkJywgJ2JvZHknLCAnL2h0bWwnXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIHRhZ3MgKGRlZmF1bHRzIHRvIFtoZWFkLGJvZHksL2h0bWxdIHRoYXQgc2hvdWxkIGhhdmUgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlbS5cIlxuXG59XG4iXX0=

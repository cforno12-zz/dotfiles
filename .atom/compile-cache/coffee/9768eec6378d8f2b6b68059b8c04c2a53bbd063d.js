(function() {
  module.exports = {
    name: "SQL",
    namespace: "sql",
    scope: ['source.sql'],

    /*
    Supported Grammars
     */
    grammars: ["SQL (Rails)", "SQL"],

    /*
    Supported extensions
     */
    extensions: ["sql"],
    options: {
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      keywords: {
        type: 'string',
        "default": "upper",
        description: "Change case of keywords",
        "enum": ["unchanged", "lower", "upper", "capitalize"]
      },
      identifiers: {
        type: 'string',
        "default": "unchanged",
        description: "Change case of identifiers",
        "enum": ["unchanged", "lower", "upper", "capitalize"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvc3FsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTtJQUlmLEtBQUEsRUFBTyxDQUFDLFlBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsYUFEUSxFQUVSLEtBRlEsQ0FUSzs7QUFjZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxDQWpCRztJQXFCZixPQUFBLEVBRUU7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtRQUVBLFdBQUEsRUFBYSx5QkFGYjtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxXQUFELEVBQWEsT0FBYixFQUFxQixPQUFyQixFQUE2QixZQUE3QixDQUhOO09BTkY7TUFVQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsV0FEVDtRQUVBLFdBQUEsRUFBYSw0QkFGYjtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxXQUFELEVBQWEsT0FBYixFQUFxQixPQUFyQixFQUE2QixZQUE3QixDQUhOO09BWEY7S0F2QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJTUUxcIlxuICBuYW1lc3BhY2U6IFwic3FsXCJcbiAgc2NvcGU6IFsnc291cmNlLnNxbCddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIlNRTCAoUmFpbHMpXCJcbiAgICBcIlNRTFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcInNxbFwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgICMgU1FMXG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBrZXl3b3JkczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcInVwcGVyXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZSBjYXNlIG9mIGtleXdvcmRzXCJcbiAgICAgIGVudW06IFtcInVuY2hhbmdlZFwiLFwibG93ZXJcIixcInVwcGVyXCIsXCJjYXBpdGFsaXplXCJdXG4gICAgaWRlbnRpZmllcnM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJ1bmNoYW5nZWRcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlIGNhc2Ugb2YgaWRlbnRpZmllcnNcIlxuICAgICAgZW51bTogW1widW5jaGFuZ2VkXCIsXCJsb3dlclwiLFwidXBwZXJcIixcImNhcGl0YWxpemVcIl1cblxufVxuIl19

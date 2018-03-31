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
      reindent: {
        type: 'boolean',
        "default": true,
        description: "Change indentations of the statements. Uncheck this option to preserve indentation"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvc3FsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTtJQUlmLEtBQUEsRUFBTyxDQUFDLFlBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsYUFEUSxFQUVSLEtBRlEsQ0FUSzs7QUFjZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxDQWpCRztJQXFCZixPQUFBLEVBRUU7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxvRkFGYjtPQU5GO01BU0EsUUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BRFQ7UUFFQSxXQUFBLEVBQWEseUJBRmI7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsV0FBRCxFQUFhLE9BQWIsRUFBcUIsT0FBckIsRUFBNkIsWUFBN0IsQ0FITjtPQVZGO01BY0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFdBRFQ7UUFFQSxXQUFBLEVBQWEsNEJBRmI7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsV0FBRCxFQUFhLE9BQWIsRUFBcUIsT0FBckIsRUFBNkIsWUFBN0IsQ0FITjtPQWZGO0tBdkJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiU1FMXCJcbiAgbmFtZXNwYWNlOiBcInNxbFwiXG4gIHNjb3BlOiBbJ3NvdXJjZS5zcWwnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJTUUwgKFJhaWxzKVwiXG4gICAgXCJTUUxcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJzcWxcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICAjIFNRTFxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgcmVpbmRlbnQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkNoYW5nZSBpbmRlbnRhdGlvbnMgb2YgdGhlIHN0YXRlbWVudHMuIFVuY2hlY2sgdGhpcyBvcHRpb24gdG8gcHJlc2VydmUgaW5kZW50YXRpb25cIlxuICAgIGtleXdvcmRzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwidXBwZXJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlIGNhc2Ugb2Yga2V5d29yZHNcIlxuICAgICAgZW51bTogW1widW5jaGFuZ2VkXCIsXCJsb3dlclwiLFwidXBwZXJcIixcImNhcGl0YWxpemVcIl1cbiAgICBpZGVudGlmaWVyczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcInVuY2hhbmdlZFwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJDaGFuZ2UgY2FzZSBvZiBpZGVudGlmaWVyc1wiXG4gICAgICBlbnVtOiBbXCJ1bmNoYW5nZWRcIixcImxvd2VyXCIsXCJ1cHBlclwiLFwiY2FwaXRhbGl6ZVwiXVxuXG59XG4iXX0=

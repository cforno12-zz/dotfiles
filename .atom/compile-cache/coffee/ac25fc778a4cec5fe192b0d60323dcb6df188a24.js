(function() {
  module.exports = {
    name: "Lua",
    namespace: "lua",

    /*
    Supported Grammars
     */
    grammars: ["Lua"],

    /*
    Supported extensions
     */
    extensions: ['lua', 'ttslua'],
    defaultBeautifier: "Lua beautifier",
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
      end_of_line: {
        type: 'string',
        "default": "System Default",
        "enum": ["CRLF", "LF", "System Default"],
        description: "Override EOL from line-ending-selector"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbHVhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsS0FEUSxDQVJLOztBQVlmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixLQURVLEVBRVYsUUFGVSxDQWZHO0lBb0JmLGlCQUFBLEVBQW1CLGdCQXBCSjtJQXNCZixPQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLHlCQUhiO09BREY7TUFLQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSx1QkFGYjtPQU5GO01BU0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdCQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUSxJQUFSLEVBQWEsZ0JBQWIsQ0FGTjtRQUdBLFdBQUEsRUFBYSx3Q0FIYjtPQVZGO0tBdkJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiTHVhXCJcbiAgbmFtZXNwYWNlOiBcImx1YVwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkx1YVwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICAnbHVhJ1xuICAgICd0dHNsdWEnXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJMdWEgYmVhdXRpZmllclwiXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgZW5kX29mX2xpbmU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJTeXN0ZW0gRGVmYXVsdFwiXG4gICAgICBlbnVtOiBbXCJDUkxGXCIsXCJMRlwiLFwiU3lzdGVtIERlZmF1bHRcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIk92ZXJyaWRlIEVPTCBmcm9tIGxpbmUtZW5kaW5nLXNlbGVjdG9yXCJcbn1cbiJdfQ==

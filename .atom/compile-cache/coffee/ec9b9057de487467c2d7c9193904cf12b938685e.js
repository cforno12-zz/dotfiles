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
      end_of_line: {
        type: 'string',
        "default": "System Default",
        "enum": ["CRLF", "LF", "System Default"],
        description: "Override EOL from line-ending-selector"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbHVhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsS0FEUSxDQVJLOztBQVlmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixLQURVLEVBRVYsUUFGVSxDQWZHO0lBb0JmLGlCQUFBLEVBQW1CLGdCQXBCSjtJQXNCZixPQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsZ0JBRFQ7UUFFQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsTUFBRCxFQUFRLElBQVIsRUFBYSxnQkFBYixDQUZOO1FBR0EsV0FBQSxFQUFhLHdDQUhiO09BREY7S0F2QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJMdWFcIlxuICBuYW1lc3BhY2U6IFwibHVhXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiTHVhXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgICdsdWEnXG4gICAgJ3R0c2x1YSdcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIkx1YSBiZWF1dGlmaWVyXCJcblxuICBvcHRpb25zOlxuICAgIGVuZF9vZl9saW5lOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiU3lzdGVtIERlZmF1bHRcIlxuICAgICAgZW51bTogW1wiQ1JMRlwiLFwiTEZcIixcIlN5c3RlbSBEZWZhdWx0XCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJPdmVycmlkZSBFT0wgZnJvbSBsaW5lLWVuZGluZy1zZWxlY3RvclwiXG59XG4iXX0=

(function() {
  module.exports = {
    name: "Markdown",
    namespace: "markdown",

    /*
    Supported Grammars
     */
    grammars: ["GitHub Markdown"],

    /*
    Supported extensions
     */
    extensions: ["markdown", "md"],
    defaultBeautifier: "Remark",
    options: {
      gfm: {
        type: 'boolean',
        "default": true,
        description: 'GitHub Flavoured Markdown'
      },
      yaml: {
        type: 'boolean',
        "default": true,
        description: 'Enables raw YAML front matter to be detected (thus ignoring markdown-like syntax).'
      },
      commonmark: {
        type: 'boolean',
        "default": false,
        description: 'Allows and disallows several constructs.'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbWFya2Rvd24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sVUFGUztJQUdmLFNBQUEsRUFBVyxVQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixpQkFEUSxDQVJLOztBQVlmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixVQURVLEVBRVYsSUFGVSxDQWZHO0lBb0JmLGlCQUFBLEVBQW1CLFFBcEJKO0lBc0JmLE9BQUEsRUFDRTtNQUFBLEdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLDJCQUZiO09BREY7TUFJQSxJQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxvRkFGYjtPQUxGO01BUUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsMENBRmI7T0FURjtLQXZCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIk1hcmtkb3duXCJcbiAgbmFtZXNwYWNlOiBcIm1hcmtkb3duXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiR2l0SHViIE1hcmtkb3duXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwibWFya2Rvd25cIlxuICAgIFwibWRcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiUmVtYXJrXCJcblxuICBvcHRpb25zOlxuICAgIGdmbTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdHaXRIdWIgRmxhdm91cmVkIE1hcmtkb3duJ1xuICAgIHlhbWw6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlcyByYXcgWUFNTCBmcm9udCBtYXR0ZXIgdG8gYmUgZGV0ZWN0ZWQgKHRodXMgaWdub3JpbmcgbWFya2Rvd24tbGlrZSBzeW50YXgpLidcbiAgICBjb21tb25tYXJrOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdBbGxvd3MgYW5kIGRpc2FsbG93cyBzZXZlcmFsIGNvbnN0cnVjdHMuJ1xufVxuIl19

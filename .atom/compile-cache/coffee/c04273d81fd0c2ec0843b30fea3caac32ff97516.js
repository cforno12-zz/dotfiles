(function() {
  module.exports = {
    name: "YAML",
    namespace: "yaml",
    fallback: [],
    scope: ['source.yaml'],

    /*
    Supported Grammars
     */
    grammars: ["YAML"],

    /*
    Supported extensions
     */
    extensions: ["yml", "yaml"],
    defaultBeautifier: "align-yaml",
    options: {
      padding: {
        type: 'integer',
        "default": 0,
        minimum: 0,
        description: "The amount of padding to add next to each line."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMveWFtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixRQUFBLEVBQVUsRUFKSztJQUtmLEtBQUEsRUFBTyxDQUFDLGFBQUQsQ0FMUTs7QUFPZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsTUFEUSxDQVZLOztBQWNmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixLQURVLEVBRVYsTUFGVSxDQWpCRztJQXNCZixpQkFBQSxFQUFtQixZQXRCSjtJQXdCZixPQUFBLEVBQVM7TUFDUCxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsV0FBQSxFQUFhLGlEQUhiO09BRks7S0F4Qk07O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJZQU1MXCJcbiAgbmFtZXNwYWNlOiBcInlhbWxcIlxuICBmYWxsYmFjazogW11cbiAgc2NvcGU6IFsnc291cmNlLnlhbWwnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJZQU1MXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwieW1sXCIsXG4gICAgXCJ5YW1sXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcImFsaWduLXlhbWxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBwYWRkaW5nOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIHBhZGRpbmcgdG8gYWRkIG5leHQgdG8gZWFjaCBsaW5lLlwiXG4gIH1cblxufVxuIl19

(function() {
  module.exports = {
    name: "Ruby",
    namespace: "ruby",
    scope: ['source.ruby'],

    /*
    Supported Grammars
     */
    grammars: ["Ruby", "Ruby on Rails"],

    /*
    Supported extensions
     */
    extensions: ["rb"],
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
        description: "Indentation character",
        "enum": [" ", "\t"]
      },
      rubocop_path: {
        title: "Rubocop Path",
        type: 'string',
        "default": "",
        description: "Path to the `rubocop` CLI executable"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvcnVieS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixLQUFBLEVBQU8sQ0FBQyxhQUFELENBSlE7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsRUFFUixlQUZRLENBVEs7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLElBRFUsQ0FqQkc7SUFxQmYsT0FBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsR0FBRCxFQUFNLElBQU4sQ0FITjtPQU5GO01BVUEsWUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGNBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSxzQ0FIYjtPQVhGO0tBdEJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUnVieVwiXG4gIG5hbWVzcGFjZTogXCJydWJ5XCJcbiAgc2NvcGU6IFsnc291cmNlLnJ1YnknXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJSdWJ5XCJcbiAgICBcIlJ1Ynkgb24gUmFpbHNcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJyYlwiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICAgIGVudW06IFtcIiBcIiwgXCJcXHRcIl1cbiAgICBydWJvY29wX3BhdGg6XG4gICAgICB0aXRsZTogXCJSdWJvY29wIFBhdGhcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gdGhlIGBydWJvY29wYCBDTEkgZXhlY3V0YWJsZVwiXG5cbn1cbiJdfQ==

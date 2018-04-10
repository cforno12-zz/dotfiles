(function() {
  module.exports = {
    name: "Jade",
    namespace: "jade",
    fallback: ['html'],
    scope: ['text.jade'],

    /*
    Supported Grammars
     */
    grammars: ["Jade", "Pug"],

    /*
    Supported extensions
     */
    extensions: ["jade", "pug"],
    options: [
      {
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
        omit_div: {
          type: 'boolean',
          "default": false,
          description: "Whether to omit/remove the 'div' tags."
        }
      }
    ],
    defaultBeautifier: "Pug Beautify"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvamFkZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixRQUFBLEVBQVUsQ0FBQyxNQUFELENBSks7SUFLZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBTFE7O0FBT2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsRUFDQSxLQURBLENBVks7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE1BRFUsRUFDRixLQURFLENBakJHO0lBcUJmLE9BQUEsRUFBUztNQUNQO1FBQUEsV0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47VUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7VUFFQSxPQUFBLEVBQVMsQ0FGVDtVQUdBLFdBQUEsRUFBYSx5QkFIYjtTQURGO1FBS0EsV0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47VUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7VUFFQSxXQUFBLEVBQWEsdUJBRmI7U0FORjtRQVNBLFFBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1VBRUEsV0FBQSxFQUFhLHdDQUZiO1NBVkY7T0FETztLQXJCTTtJQXFDZixpQkFBQSxFQUFtQixjQXJDSjs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkphZGVcIlxuICBuYW1lc3BhY2U6IFwiamFkZVwiXG4gIGZhbGxiYWNrOiBbJ2h0bWwnXVxuICBzY29wZTogWyd0ZXh0LmphZGUnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJKYWRlXCIsIFwiUHVnXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiamFkZVwiLCBcInB1Z1wiXG4gIF1cblxuICBvcHRpb25zOiBbXG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHNpemUvbGVuZ3RoXCJcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIG9taXRfZGl2OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiV2hldGhlciB0byBvbWl0L3JlbW92ZSB0aGUgJ2RpdicgdGFncy5cIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiUHVnIEJlYXV0aWZ5XCJcblxufVxuIl19

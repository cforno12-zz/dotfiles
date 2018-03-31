(function() {
  module.exports = {
    name: "Coldfusion",
    description: "Coldfusion Markup; cfscript is also handled via the prettydiff javascript parser",
    namespace: "cfml",
    scope: ['text.html'],

    /*
    Supported Grammars
     */
    grammars: ["html"],

    /*
    Supported extensions
     */
    extensions: ["cfm", "cfml", "cfc"],
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
        minimum: 0,
        description: "Indentation character"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvY29sZGZ1c2lvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxZQUZTO0lBR2YsV0FBQSxFQUFhLGtGQUhFO0lBSWYsU0FBQSxFQUFXLE1BSkk7SUFLZixLQUFBLEVBQU8sQ0FBQyxXQUFELENBTFE7O0FBT2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsQ0FWSzs7QUFjZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxFQUVWLE1BRlUsRUFHVixLQUhVLENBakJHO0lBdUJmLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtNQUtBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEsdUJBSGI7T0FORjtNQVVBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FEVDtRQUVBLFdBQUEsRUFBYSwwQ0FGYjtPQVhGO01BY0EsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHNCQUZiO09BZkY7S0F4QmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJDb2xkZnVzaW9uXCJcbiAgZGVzY3JpcHRpb246IFwiQ29sZGZ1c2lvbiBNYXJrdXA7IGNmc2NyaXB0IGlzIGFsc28gaGFuZGxlZCB2aWEgdGhlIHByZXR0eWRpZmYgamF2YXNjcmlwdCBwYXJzZXJcIlxuICBuYW1lc3BhY2U6IFwiY2ZtbFwiXG4gIHNjb3BlOiBbJ3RleHQuaHRtbCddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcImh0bWxcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJjZm1cIlxuICAgIFwiY2ZtbFwiXG4gICAgXCJjZmNcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfc2l6ZTpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgbWluaW11bTogMFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gc2l6ZS9sZW5ndGhcIlxuICAgIGluZGVudF9jaGFyOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIG1pbmltdW06IDBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgd3JhcF9saW5lX2xlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMjUwXG4gICAgICBkZXNjcmlwdGlvbjogXCJNYXhpbXVtIGNoYXJhY3RlcnMgcGVyIGxpbmUgKDAgZGlzYWJsZXMpXCJcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiUHJlc2VydmUgbGluZS1icmVha3NcIlxuXG59XG4iXX0=

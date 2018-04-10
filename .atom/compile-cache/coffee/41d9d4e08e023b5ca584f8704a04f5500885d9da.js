(function() {
  module.exports = {
    name: "Marko",
    namespace: "marko",
    fallback: ['html'],
    scope: ['text.marko'],

    /*
    Supported Grammars
     */
    grammars: ["Marko"],

    /*
    Supported extensions
     */
    extensions: ["marko"],
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
      syntax: {
        type: 'string',
        "default": "html",
        "enum": ["html", "concise"],
        description: "[html|concise]"
      }
    },
    defaultBeautifier: "Marko Beautifier"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbWFya28uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sT0FGUztJQUdmLFNBQUEsRUFBVyxPQUhJO0lBSWYsUUFBQSxFQUFVLENBQUMsTUFBRCxDQUpLO0lBS2YsS0FBQSxFQUFPLENBQUMsWUFBRCxDQUxROztBQU9mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixPQURRLENBVks7O0FBY2Y7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE9BRFUsQ0FqQkc7SUFxQmYsT0FBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO01BS0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7T0FORjtNQVNBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxTQUFULENBRk47UUFHQSxXQUFBLEVBQWEsZ0JBSGI7T0FWRjtLQXRCYTtJQXFDZixpQkFBQSxFQUFtQixrQkFyQ0o7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJNYXJrb1wiXG4gIG5hbWVzcGFjZTogXCJtYXJrb1wiXG4gIGZhbGxiYWNrOiBbJ2h0bWwnXVxuICBzY29wZTogWyd0ZXh0Lm1hcmtvJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiTWFya29cIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJtYXJrb1wiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBzeW50YXg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJodG1sXCJcbiAgICAgIGVudW06IFtcImh0bWxcIiwgXCJjb25jaXNlXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJbaHRtbHxjb25jaXNlXVwiXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiTWFya28gQmVhdXRpZmllclwiXG5cbn1cbiJdfQ==

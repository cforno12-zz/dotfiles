(function() {
  module.exports = {
    name: "LaTeX",
    namespace: "latex",
    scope: ['source.tex'],

    /*
    Supported Grammars
     */
    grammars: ["BibTeX", "LaTeX", "TeX"],

    /*
    Supported extensions
     */
    extensions: ["bib", "tex", "sty", "cls", "dtx", "ins", "bbx", "cbx"],
    defaultBeautifier: "Latex Beautify",

    /*
     */
    options: {
      indent_char: {
        type: 'string',
        "default": null,
        description: "Indentation character"
      },
      indent_with_tabs: {
        type: 'boolean',
        "default": null,
        description: "Indentation uses tabs, overrides `Indent Size` and `Indent Char`"
      },
      indent_preamble: {
        type: 'boolean',
        "default": false,
        description: "Indent the preamble"
      },
      always_look_for_split_braces: {
        type: 'boolean',
        "default": true,
        description: "If `latexindent` should look for commands that split braces across lines"
      },
      always_look_for_split_brackets: {
        type: 'boolean',
        "default": false,
        description: "If `latexindent` should look for commands that split brackets across lines"
      },
      remove_trailing_whitespace: {
        type: 'boolean',
        "default": false,
        description: "Remove trailing whitespace"
      },
      align_columns_in_environments: {
        type: 'array',
        "default": ["tabular", "matrix", "bmatrix", "pmatrix"],
        description: "Aligns columns by the alignment tabs for environments specified"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbGF0ZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sT0FGUztJQUdmLFNBQUEsRUFBVyxPQUhJO0lBSWYsS0FBQSxFQUFPLENBQUMsWUFBRCxDQUpROztBQU1mOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixRQURRLEVBRVIsT0FGUSxFQUdSLEtBSFEsQ0FUSzs7QUFlZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxFQUVWLEtBRlUsRUFHVixLQUhVLEVBSVYsS0FKVSxFQUtWLEtBTFUsRUFNVixLQU5VLEVBT1YsS0FQVSxFQVFWLEtBUlUsQ0FsQkc7SUE2QmYsaUJBQUEsRUFBbUIsZ0JBN0JKOztBQStCZjs7SUFHQSxPQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSx1QkFGYjtPQURGO01BSUEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGtFQUZiO09BTEY7TUFRQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxxQkFGYjtPQVRGO01BWUEsNEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLDBFQUZiO09BYkY7TUFnQkEsOEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRFQUZiO09BakJGO01Bb0JBLDBCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw0QkFGYjtPQXJCRjtNQXdCQSw2QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFRLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsU0FBdEIsRUFBaUMsU0FBakMsQ0FEUjtRQUVBLFdBQUEsRUFBYSxpRUFGYjtPQXpCRjtLQW5DYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkxhVGVYXCJcbiAgbmFtZXNwYWNlOiBcImxhdGV4XCJcbiAgc2NvcGU6IFsnc291cmNlLnRleCddXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkJpYlRlWFwiXG4gICAgXCJMYVRlWFwiXG4gICAgXCJUZVhcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJiaWJcIlxuICAgIFwidGV4XCJcbiAgICBcInN0eVwiXG4gICAgXCJjbHNcIlxuICAgIFwiZHR4XCJcbiAgICBcImluc1wiXG4gICAgXCJiYnhcIlxuICAgIFwiY2J4XCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIkxhdGV4IEJlYXV0aWZ5XCJcblxuICAjIyNcblxuICAjIyNcbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBjaGFyYWN0ZXJcIlxuICAgIGluZGVudF93aXRoX3RhYnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIHVzZXMgdGFicywgb3ZlcnJpZGVzIGBJbmRlbnQgU2l6ZWAgYW5kIGBJbmRlbnQgQ2hhcmBcIlxuICAgIGluZGVudF9wcmVhbWJsZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudCB0aGUgcHJlYW1ibGVcIlxuICAgIGFsd2F5c19sb29rX2Zvcl9zcGxpdF9icmFjZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGBsYXRleGluZGVudGAgc2hvdWxkIGxvb2sgZm9yIGNvbW1hbmRzIHRoYXQgc3BsaXQgYnJhY2VzIGFjcm9zcyBsaW5lc1wiXG4gICAgYWx3YXlzX2xvb2tfZm9yX3NwbGl0X2JyYWNrZXRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgYGxhdGV4aW5kZW50YCBzaG91bGQgbG9vayBmb3IgY29tbWFuZHMgdGhhdCBzcGxpdCBicmFja2V0cyBhY3Jvc3MgbGluZXNcIlxuICAgIHJlbW92ZV90cmFpbGluZ193aGl0ZXNwYWNlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiUmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VcIlxuICAgIGFsaWduX2NvbHVtbnNfaW5fZW52aXJvbm1lbnRzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDpbXCJ0YWJ1bGFyXCIsIFwibWF0cml4XCIsIFwiYm1hdHJpeFwiLCBcInBtYXRyaXhcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFsaWducyBjb2x1bW5zIGJ5IHRoZSBhbGlnbm1lbnQgdGFicyBmb3IgZW52aXJvbm1lbnRzIHNwZWNpZmllZFwiXG59XG4iXX0=

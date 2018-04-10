(function() {
  module.exports = {
    name: "PHP",
    namespace: "php",

    /*
    Supported Grammars
     */
    grammars: ["PHP"],

    /*
    Supported extensions
     */
    extensions: ["php", "module", "inc"],
    defaultBeautifier: "PHP-CS-Fixer",
    options: {
      cs_fixer_path: {
        title: "PHP-CS-Fixer Path",
        type: 'string',
        "default": "",
        description: "Absolute path to the `php-cs-fixer` CLI executable"
      },
      cs_fixer_version: {
        title: "PHP-CS-Fixer Version",
        type: 'integer',
        "default": 2,
        "enum": [1, 2]
      },
      cs_fixer_config_file: {
        title: "PHP-CS-Fixer Config File",
        type: 'string',
        "default": "",
        description: "Path to php-cs-fixer config file. Will use local `.php_cs` or `.php_cs.dist` if found in the working directory or project root."
      },
      fixers: {
        type: 'string',
        "default": "",
        description: "Add fixer(s). i.e. linefeed,-short_tag,indentation (PHP-CS-Fixer 1 only)"
      },
      level: {
        type: 'string',
        "default": "",
        description: "By default, all PSR-2 fixers and some additional ones are run. (PHP-CS-Fixer 1 only)"
      },
      rules: {
        type: 'string',
        "default": "",
        description: "Add rule(s). i.e. line_ending,-full_opening_tag,@PSR2 (PHP-CS-Fixer 2 only)"
      },
      allow_risky: {
        title: "Allow risky rules",
        type: 'string',
        "default": "no",
        "enum": ["no", "yes"],
        description: "Allow risky rules to be applied (PHP-CS-Fixer 2 only)"
      },
      phpcbf_path: {
        title: "PHPCBF Path",
        type: 'string',
        "default": "",
        description: "Path to the `phpcbf` CLI executable"
      },
      phpcbf_version: {
        title: "PHPCBF Version",
        type: 'integer',
        "default": 2,
        "enum": [1, 2, 3]
      },
      standard: {
        title: "PHPCBF Standard",
        type: 'string',
        "default": "PEAR",
        description: "Standard name Squiz, PSR2, PSR1, PHPCS, PEAR, Zend, MySource... or path to CS rules. Will use local `phpcs.xml`, `phpcs.xml.dist`, `phpcs.ruleset.xml` or `ruleset.xml` if found in the project root."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvcGhwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLEtBRlM7SUFHZixTQUFBLEVBQVcsS0FISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsS0FEUSxDQVJLOztBQVlmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixLQURVLEVBRVYsUUFGVSxFQUdWLEtBSFUsQ0FmRztJQXFCZixpQkFBQSxFQUFtQixjQXJCSjtJQXVCZixPQUFBLEVBQ0U7TUFBQSxhQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sbUJBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSxvREFIYjtPQURGO01BS0EsZ0JBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxzQkFBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUZUO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLENBSE47T0FORjtNQVVBLG9CQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sMEJBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSxpSUFIYjtPQVhGO01BZUEsTUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxXQUFBLEVBQWEsMEVBRmI7T0FoQkY7TUFtQkEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxXQUFBLEVBQWEsc0ZBRmI7T0FwQkY7TUF1QkEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxXQUFBLEVBQWEsNkVBRmI7T0F4QkY7TUEyQkEsV0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsSUFBRCxFQUFPLEtBQVAsQ0FITjtRQUlBLFdBQUEsRUFBYSx1REFKYjtPQTVCRjtNQWlDQSxXQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sYUFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsV0FBQSxFQUFhLHFDQUhiO09BbENGO01Bc0NBLGNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxnQkFBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUZUO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUhOO09BdkNGO01BMkNBLFFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsV0FBQSxFQUFhLHVNQUhiO09BNUNGO0tBeEJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiUEhQXCJcbiAgbmFtZXNwYWNlOiBcInBocFwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIlBIUFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcInBocFwiXG4gICAgXCJtb2R1bGVcIlxuICAgIFwiaW5jXCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIlBIUC1DUy1GaXhlclwiXG5cbiAgb3B0aW9uczpcbiAgICBjc19maXhlcl9wYXRoOlxuICAgICAgdGl0bGU6IFwiUEhQLUNTLUZpeGVyIFBhdGhcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFic29sdXRlIHBhdGggdG8gdGhlIGBwaHAtY3MtZml4ZXJgIENMSSBleGVjdXRhYmxlXCJcbiAgICBjc19maXhlcl92ZXJzaW9uOlxuICAgICAgdGl0bGU6IFwiUEhQLUNTLUZpeGVyIFZlcnNpb25cIlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyXG4gICAgICBlbnVtOiBbMSwgMl1cbiAgICBjc19maXhlcl9jb25maWdfZmlsZTpcbiAgICAgIHRpdGxlOiBcIlBIUC1DUy1GaXhlciBDb25maWcgRmlsZVwiXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBwaHAtY3MtZml4ZXIgY29uZmlnIGZpbGUuIFdpbGwgdXNlIGxvY2FsIGAucGhwX2NzYCBvciBgLnBocF9jcy5kaXN0YCBpZiBmb3VuZCBpbiB0aGUgd29ya2luZyBkaXJlY3Rvcnkgb3IgcHJvamVjdCByb290LlwiXG4gICAgZml4ZXJzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFkZCBmaXhlcihzKS4gaS5lLiBsaW5lZmVlZCwtc2hvcnRfdGFnLGluZGVudGF0aW9uIChQSFAtQ1MtRml4ZXIgMSBvbmx5KVwiXG4gICAgbGV2ZWw6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQnkgZGVmYXVsdCwgYWxsIFBTUi0yIGZpeGVycyBhbmQgc29tZSBhZGRpdGlvbmFsIG9uZXMgYXJlIHJ1bi4gKFBIUC1DUy1GaXhlciAxIG9ubHkpXCJcbiAgICBydWxlczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgcnVsZShzKS4gaS5lLiBsaW5lX2VuZGluZywtZnVsbF9vcGVuaW5nX3RhZyxAUFNSMiAoUEhQLUNTLUZpeGVyIDIgb25seSlcIlxuICAgIGFsbG93X3Jpc2t5OlxuICAgICAgdGl0bGU6IFwiQWxsb3cgcmlza3kgcnVsZXNcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwibm9cIlxuICAgICAgZW51bTogW1wibm9cIiwgXCJ5ZXNcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFsbG93IHJpc2t5IHJ1bGVzIHRvIGJlIGFwcGxpZWQgKFBIUC1DUy1GaXhlciAyIG9ubHkpXCJcbiAgICBwaHBjYmZfcGF0aDpcbiAgICAgIHRpdGxlOiBcIlBIUENCRiBQYXRoXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIHRoZSBgcGhwY2JmYCBDTEkgZXhlY3V0YWJsZVwiLFxuICAgIHBocGNiZl92ZXJzaW9uOlxuICAgICAgdGl0bGU6IFwiUEhQQ0JGIFZlcnNpb25cIlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyXG4gICAgICBlbnVtOiBbMSwgMiwgM11cbiAgICBzdGFuZGFyZDpcbiAgICAgIHRpdGxlOiBcIlBIUENCRiBTdGFuZGFyZFwiXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJQRUFSXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJTdGFuZGFyZCBuYW1lIFNxdWl6LCBQU1IyLCBQU1IxLCBQSFBDUywgUEVBUiwgWmVuZCwgTXlTb3VyY2UuLi4gb3IgcGF0aCB0byBDUyBydWxlcy4gV2lsbCB1c2UgbG9jYWwgYHBocGNzLnhtbGAsIGBwaHBjcy54bWwuZGlzdGAsIGBwaHBjcy5ydWxlc2V0LnhtbGAgb3IgYHJ1bGVzZXQueG1sYCBpZiBmb3VuZCBpbiB0aGUgcHJvamVjdCByb290LlwiXG5cbn1cbiJdfQ==

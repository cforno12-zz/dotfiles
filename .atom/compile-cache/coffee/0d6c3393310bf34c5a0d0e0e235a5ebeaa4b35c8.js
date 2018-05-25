
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, _, extend;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "bash", "blade", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "glsl", "gn", "go", "gohtml", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nginx", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "tsx", "twig", "typescript", "ux_markup", "vala", "vue", "vhdl", "visualforce", "xml", "xtemplate", "yaml", "terraform", "verilog"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(arg) {
      var extension, grammar, name, namespace;
      name = arg.name, namespace = arg.namespace, grammar = arg.grammar, extension = arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBOztFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixNQUFBLEdBQVM7O0VBR1QsTUFBTSxDQUFDLE9BQVAsR0FBdUI7d0JBSXJCLGFBQUEsR0FBZSxDQUNiLE1BRGEsRUFFYixTQUZhLEVBR2IsTUFIYSxFQUliLE9BSmEsRUFLYixTQUxhLEVBTWIsR0FOYSxFQU9iLFNBUGEsRUFRYixjQVJhLEVBU2IsWUFUYSxFQVViLEtBVmEsRUFXYixTQVhhLEVBWWIsS0FaYSxFQWFiLEtBYmEsRUFjYixHQWRhLEVBZWIsS0FmYSxFQWdCYixLQWhCYSxFQWlCYixLQWpCYSxFQWtCYixRQWxCYSxFQW1CYixTQW5CYSxFQW9CYixNQXBCYSxFQXFCYixJQXJCYSxFQXNCYixJQXRCYSxFQXVCYixRQXZCYSxFQXdCYixTQXhCYSxFQXlCYixZQXpCYSxFQTBCYixTQTFCYSxFQTJCYixNQTNCYSxFQTRCYixNQTVCYSxFQTZCYixNQTdCYSxFQThCYixZQTlCYSxFQStCYixNQS9CYSxFQWdDYixLQWhDYSxFQWlDYixPQWpDYSxFQWtDYixNQWxDYSxFQW1DYixLQW5DYSxFQW9DYixVQXBDYSxFQXFDYixPQXJDYSxFQXNDYixVQXRDYSxFQXVDYixPQXZDYSxFQXdDYixVQXhDYSxFQXlDYixhQXpDYSxFQTBDYixPQTFDYSxFQTJDYixNQTNDYSxFQTRDYixNQTVDYSxFQTZDYixLQTdDYSxFQThDYixRQTlDYSxFQStDYixRQS9DYSxFQWdEYixHQWhEYSxFQWlEYixRQWpEYSxFQWtEYixNQWxEYSxFQW1EYixNQW5EYSxFQW9EYixNQXBEYSxFQXFEYixNQXJEYSxFQXNEYixXQXREYSxFQXVEYixLQXZEYSxFQXdEYixLQXhEYSxFQXlEYixNQXpEYSxFQTBEYixLQTFEYSxFQTJEYixLQTNEYSxFQTREYixNQTVEYSxFQTZEYixZQTdEYSxFQThEYixXQTlEYSxFQStEYixNQS9EYSxFQWdFYixLQWhFYSxFQWlFYixNQWpFYSxFQWtFYixhQWxFYSxFQW1FYixLQW5FYSxFQW9FYixXQXBFYSxFQXFFYixNQXJFYSxFQXNFYixXQXRFYSxFQXVFYixTQXZFYTs7O0FBMEVmOzs7O3dCQUdBLFNBQUEsR0FBVzs7O0FBRVg7Ozs7d0JBR0EsVUFBQSxHQUFZOzs7QUFFWjs7OztJQUdhLG1CQUFBO01BQ1gsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxhQUFQLEVBQXNCLFNBQUMsSUFBRDtlQUNqQyxPQUFBLENBQVEsSUFBQSxHQUFLLElBQWI7TUFEaUMsQ0FBdEI7TUFHYixJQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLFNBQVAsRUFBa0IsU0FBQyxRQUFEO2VBQWMsUUFBUSxDQUFDO01BQXZCLENBQWxCO0lBSkg7OztBQU1iOzs7O3dCQUdBLFlBQUEsR0FBYyxTQUFDLEdBQUQ7QUFFWixVQUFBO01BRmMsaUJBQU0sMkJBQVcsdUJBQVM7YUFFeEMsQ0FBQyxDQUFDLEtBQUYsQ0FDRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBUSxDQUFDLElBQW5CLEVBQXlCLElBQXpCO01BQWQsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFEO2VBQWMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxRQUFRLENBQUMsU0FBbkIsRUFBOEIsU0FBOUI7TUFBZCxDQUFyQixDQUZGLEVBR0UsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QjtNQUFkLENBQXJCLENBSEYsRUFJRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxRQUFGLENBQVcsUUFBUSxDQUFDLFVBQXBCLEVBQWdDLFNBQWhDO01BQWQsQ0FBckIsQ0FKRjtJQUZZOzs7OztBQTdHaEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbkxhbmd1YWdlIFN1cHBvcnQgYW5kIGRlZmF1bHQgb3B0aW9ucy5cbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbmV4dGVuZCA9IG51bGxcblxuI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMYW5ndWFnZXNcblxuICAjIFN1cHBvcnRlZCB1bmlxdWUgY29uZmlndXJhdGlvbiBrZXlzXG4gICMgVXNlZCBmb3IgZGV0ZWN0aW5nIG5lc3RlZCBjb25maWd1cmF0aW9ucyBpbiAuanNiZWF1dGlmeXJjXG4gIGxhbmd1YWdlTmFtZXM6IFtcbiAgICBcImFwZXhcIlxuICAgIFwiYXJkdWlub1wiXG4gICAgXCJiYXNoXCJcbiAgICBcImJsYWRlXCJcbiAgICBcImMtc2hhcnBcIlxuICAgIFwiY1wiXG4gICAgXCJjbG9qdXJlXCJcbiAgICBcImNvZmZlZXNjcmlwdFwiXG4gICAgXCJjb2xkZnVzaW9uXCJcbiAgICBcImNwcFwiXG4gICAgXCJjcnlzdGFsXCJcbiAgICBcImNzc1wiXG4gICAgXCJjc3ZcIlxuICAgIFwiZFwiXG4gICAgXCJlanNcIlxuICAgIFwiZWxtXCJcbiAgICBcImVyYlwiXG4gICAgXCJlcmxhbmdcIlxuICAgIFwiZ2hlcmtpblwiXG4gICAgXCJnbHNsXCJcbiAgICBcImduXCJcbiAgICBcImdvXCJcbiAgICBcImdvaHRtbFwiXG4gICAgXCJmb3J0cmFuXCJcbiAgICBcImhhbmRsZWJhcnNcIlxuICAgIFwiaGFza2VsbFwiXG4gICAgXCJodG1sXCJcbiAgICBcImphZGVcIlxuICAgIFwiamF2YVwiXG4gICAgXCJqYXZhc2NyaXB0XCJcbiAgICBcImpzb25cIlxuICAgIFwianN4XCJcbiAgICBcImxhdGV4XCJcbiAgICBcImxlc3NcIlxuICAgIFwibHVhXCJcbiAgICBcIm1hcmtkb3duXCJcbiAgICAnbWFya28nXG4gICAgXCJtdXN0YWNoZVwiXG4gICAgXCJuZ2lueFwiXG4gICAgXCJudW5qdWNrc1wiXG4gICAgXCJvYmplY3RpdmUtY1wiXG4gICAgXCJvY2FtbFwiXG4gICAgXCJwYXduXCJcbiAgICBcInBlcmxcIlxuICAgIFwicGhwXCJcbiAgICBcInB1cHBldFwiXG4gICAgXCJweXRob25cIlxuICAgIFwiclwiXG4gICAgXCJyaW90anNcIlxuICAgIFwicnVieVwiXG4gICAgXCJydXN0XCJcbiAgICBcInNhc3NcIlxuICAgIFwic2Nzc1wiXG4gICAgXCJzcGFjZWJhcnNcIlxuICAgIFwic3FsXCJcbiAgICBcInN2Z1wiXG4gICAgXCJzd2lnXCJcbiAgICBcInRzc1wiXG4gICAgXCJ0c3hcIlxuICAgIFwidHdpZ1wiXG4gICAgXCJ0eXBlc2NyaXB0XCJcbiAgICBcInV4X21hcmt1cFwiXG4gICAgXCJ2YWxhXCJcbiAgICBcInZ1ZVwiXG4gICAgXCJ2aGRsXCJcbiAgICBcInZpc3VhbGZvcmNlXCJcbiAgICBcInhtbFwiXG4gICAgXCJ4dGVtcGxhdGVcIlxuICAgIFwieWFtbFwiXG4gICAgXCJ0ZXJyYWZvcm1cIlxuICAgIFwidmVyaWxvZ1wiXG4gIF1cblxuICAjIyNcbiAgTGFuZ3VhZ2VzXG4gICMjI1xuICBsYW5ndWFnZXM6IG51bGxcblxuICAjIyNcbiAgTmFtZXNwYWNlc1xuICAjIyNcbiAgbmFtZXNwYWNlczogbnVsbFxuXG4gICMjI1xuICBDb25zdHJ1Y3RvclxuICAjIyNcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGxhbmd1YWdlcyA9IF8ubWFwKEBsYW5ndWFnZU5hbWVzLCAobmFtZSkgLT5cbiAgICAgIHJlcXVpcmUoXCIuLyN7bmFtZX1cIilcbiAgICApXG4gICAgQG5hbWVzcGFjZXMgPSBfLm1hcChAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IGxhbmd1YWdlLm5hbWVzcGFjZSlcblxuICAjIyNcbiAgR2V0IGxhbmd1YWdlIGZvciBncmFtbWFyIGFuZCBleHRlbnNpb25cbiAgIyMjXG4gIGdldExhbmd1YWdlczogKHtuYW1lLCBuYW1lc3BhY2UsIGdyYW1tYXIsIGV4dGVuc2lvbn0pIC0+XG4gICAgIyBjb25zb2xlLmxvZygnZ2V0TGFuZ3VhZ2VzJywgbmFtZSwgbmFtZXNwYWNlLCBncmFtbWFyLCBleHRlbnNpb24sIEBsYW5ndWFnZXMpXG4gICAgXy51bmlvbihcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pc0VxdWFsKGxhbmd1YWdlLm5hbWUsIG5hbWUpKVxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmlzRXF1YWwobGFuZ3VhZ2UubmFtZXNwYWNlLCBuYW1lc3BhY2UpKVxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmluY2x1ZGVzKGxhbmd1YWdlLmdyYW1tYXJzLCBncmFtbWFyKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pbmNsdWRlcyhsYW5ndWFnZS5leHRlbnNpb25zLCBleHRlbnNpb24pKVxuICAgIClcbiJdfQ==

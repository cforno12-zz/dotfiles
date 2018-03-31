(function() {
  "use strict";
  var Beautifier, Remark,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(superClass) {
    extend(Remark, superClass);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.link = "https://github.com/remarkjs/remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark().process(text, options).toString();
          return resolve(cleanMarkdown);
        } catch (error) {
          err = error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9yZW1hcmsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztxQkFDckIsSUFBQSxHQUFNOztxQkFDTixJQUFBLEdBQU07O3FCQUNOLE9BQUEsR0FBUztNQUNQLENBQUEsRUFBRztRQUNELEdBQUEsRUFBSyxJQURKO1FBRUQsSUFBQSxFQUFNLElBRkw7UUFHRCxVQUFBLEVBQVksSUFIWDtRQUlELFNBQUEsRUFBVyxJQUpWO1FBS0QsUUFBQSxFQUFVLElBTFQ7UUFNRCxNQUFBLEVBQVEsSUFOUDtRQU9ELFFBQUEsRUFBVSxJQVBUO1FBUUQsTUFBQSxFQUFRLElBUlA7UUFTRCxRQUFBLEVBQVUsSUFUVDtRQVVELFVBQUEsRUFBWSxJQVZYO1FBV0QsV0FBQSxFQUFhLElBWFo7UUFZRCxLQUFBLEVBQU8sSUFaTjtRQWFELE1BQUEsRUFBUSxJQWJQO1FBY0QsTUFBQSxFQUFRLElBZFA7UUFlRCxjQUFBLEVBQWdCLElBZmY7UUFnQkQsbUJBQUEsRUFBcUIsSUFoQnBCO1FBaUJELElBQUEsRUFBTSxJQWpCTDtRQWtCRCxjQUFBLEVBQWdCLElBbEJmO1FBbUJELFVBQUEsRUFBWSxJQW5CWDtRQW9CRCxNQUFBLEVBQVEsSUFwQlA7UUFxQkQsUUFBQSxFQUFVLElBckJUO1FBc0JELFFBQUEsRUFBVSxJQXRCVDtPQURJO01BeUJQLFFBQUEsRUFBVSxJQXpCSDs7O3FCQTRCVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtBQUFBO1VBQ0UsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSO1VBQ1QsYUFBQSxHQUFnQixNQUFBLENBQUEsQ0FBUSxDQUFDLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkIsQ0FBK0IsQ0FBQyxRQUFoQyxDQUFBO2lCQUNoQixPQUFBLENBQVEsYUFBUixFQUhGO1NBQUEsYUFBQTtVQUlNO1VBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBQSxHQUFpQixHQUF4QjtpQkFDQSxNQUFBLENBQU8sR0FBUCxFQU5GOztNQURrQixDQUFiO0lBREM7Ozs7S0EvQjBCO0FBSHRDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlbWFyayBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSZW1hcmtcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9yZW1hcmtqcy9yZW1hcmtcIlxuICBvcHRpb25zOiB7XG4gICAgXzoge1xuICAgICAgZ2ZtOiB0cnVlXG4gICAgICB5YW1sOiB0cnVlXG4gICAgICBjb21tb25tYXJrOiB0cnVlXG4gICAgICBmb290bm90ZXM6IHRydWVcbiAgICAgIHBlZGFudGljOiB0cnVlXG4gICAgICBicmVha3M6IHRydWVcbiAgICAgIGVudGl0aWVzOiB0cnVlXG4gICAgICBzZXRleHQ6IHRydWVcbiAgICAgIGNsb3NlQXR4OiB0cnVlXG4gICAgICBsb29zZVRhYmxlOiB0cnVlXG4gICAgICBzcGFjZWRUYWJsZTogdHJ1ZVxuICAgICAgZmVuY2U6IHRydWVcbiAgICAgIGZlbmNlczogdHJ1ZVxuICAgICAgYnVsbGV0OiB0cnVlXG4gICAgICBsaXN0SXRlbUluZGVudDogdHJ1ZVxuICAgICAgaW5jcmVtZW50TGlzdE1hcmtlcjogdHJ1ZVxuICAgICAgcnVsZTogdHJ1ZVxuICAgICAgcnVsZVJlcGV0aXRpb246IHRydWVcbiAgICAgIHJ1bGVTcGFjZXM6IHRydWVcbiAgICAgIHN0cm9uZzogdHJ1ZVxuICAgICAgZW1waGFzaXM6IHRydWVcbiAgICAgIHBvc2l0aW9uOiB0cnVlXG4gICAgfVxuICAgIE1hcmtkb3duOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRyeVxuICAgICAgICByZW1hcmsgPSByZXF1aXJlICdyZW1hcmsnXG4gICAgICAgIGNsZWFuTWFya2Rvd24gPSByZW1hcmsoKS5wcm9jZXNzKHRleHQsIG9wdGlvbnMpLnRvU3RyaW5nKClcbiAgICAgICAgcmVzb2x2ZSBjbGVhbk1hcmtkb3duXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgQGVycm9yKFwiUmVtYXJrIGVycm9yOiAje2Vycn1cIilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICApXG4iXX0=

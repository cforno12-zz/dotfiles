
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Gherkin = (function(superClass) {
    extend(Gherkin, superClass);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/gherkin.coffee";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      var Lexer, logger;
      Lexer = require('gherkin').Lexer('en');
      logger = this.logger;
      return new this.Promise(function(resolve, reject) {
        var i, len, lexer, line, loggerLevel, recorder, ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var i, len, line, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = content.trim().split("\n");
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              line = ref[i];
              results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return results;
          },
          write_comments: function(indent) {
            var comment, i, len, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = this.comments.splice(0, this.comments.length);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              comment = ref[i];
              results.push(this.write_indented(comment, indent));
            }
            return results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented(keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented(keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          ref = recorder.lines;
          for (i = 0, len = ref.length; i < len; i++) {
            line = ref[i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9naGVya2luLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztBQUFBO0VBR0E7QUFIQSxNQUFBLG1CQUFBO0lBQUE7OztFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFDckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUVOLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxJQURGOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsS0FBbkIsQ0FBeUIsSUFBekI7TUFDUixNQUFBLEdBQVMsSUFBQyxDQUFBO0FBQ1YsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsUUFBQSxHQUFXO1VBQ1QsS0FBQSxFQUFPLEVBREU7VUFFVCxJQUFBLEVBQU0sRUFGRztVQUdULFFBQUEsRUFBVSxFQUhEO1VBS1QsUUFBQSxFQUFVLElBTEQ7VUFPVCxTQUFBLEVBQVcsU0FBQyxZQUFEOztjQUFDLGVBQWU7O0FBQ3pCLG1CQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBcEIsQ0FBMkIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsWUFBakQ7VUFERSxDQVBGO1VBVVQsV0FBQSxFQUFhLFNBQUE7bUJBQ1gsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksRUFBWjtVQURXLENBVko7VUFhVCxjQUFBLEVBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDZCxnQkFBQTs7Y0FEd0IsU0FBUzs7QUFDakM7QUFBQTtpQkFBQSxx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OEUsQ0FBOUU7VUFMVSxDQWxGSDtVQXlGVCxHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsSUFBUjtZQUNILE1BQU0sQ0FBQyxPQUFQLENBQWU7Y0FBQyxLQUFBLEVBQU8sS0FBUjtjQUFlLEtBQUEsRUFBTyxLQUF0QjtjQUE2QixJQUFBLEVBQU0sSUFBbkM7YUFBZjtZQUlBLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCO21CQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUEsR0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFELENBQUosR0FBdUIsSUFBdkMsRUFBNEMsQ0FBNUM7VUFORyxDQXpGSTtVQWlHVCxHQUFBLEVBQUssU0FBQTtZQUNILE1BQU0sQ0FBQyxPQUFQLENBQWU7Y0FBQyxLQUFBLEVBQU8sS0FBUjthQUFmO21CQUVBLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCO1VBSEcsQ0FqR0k7O1FBdUdYLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxRQUFOO1FBQ1osS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO1FBRUEsV0FBQSxrREFBYyxJQUFJLENBQUUsTUFBTSxDQUFDLEdBQWIsQ0FBaUIsbUNBQWpCO1FBQ2QsSUFBRyxXQUFBLEtBQWUsU0FBbEI7QUFDRTtBQUFBLGVBQUEscUNBQUE7O1lBQ0UsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFBLEdBQUssSUFBcEI7QUFERixXQURGOztlQUlBLE9BQUEsQ0FBUSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBUjtNQWhIa0IsQ0FBVDtJQUhIOzs7O0tBUjJCO0FBTnZDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdoZXJraW4gZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiR2hlcmtpbiBmb3JtYXR0ZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9ibG9iL21hc3Rlci9zcmMvYmVhdXRpZmllcnMvZ2hlcmtpbi5jb2ZmZWVcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBnaGVya2luOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIExleGVyID0gcmVxdWlyZSgnZ2hlcmtpbicpLkxleGVyKCdlbicpXG4gICAgbG9nZ2VyID0gQGxvZ2dlclxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHJlY29yZGVyID0ge1xuICAgICAgICBsaW5lczogW11cbiAgICAgICAgdGFnczogW11cbiAgICAgICAgY29tbWVudHM6IFtdXG5cbiAgICAgICAgbGFzdF9vYmo6IG51bGxcblxuICAgICAgICBpbmRlbnRfdG86IChpbmRlbnRfbGV2ZWwgPSAwKSAtPlxuICAgICAgICAgIHJldHVybiBvcHRpb25zLmluZGVudF9jaGFyLnJlcGVhdChvcHRpb25zLmluZGVudF9zaXplICogaW5kZW50X2xldmVsKVxuXG4gICAgICAgIHdyaXRlX2JsYW5rOiAoKSAtPlxuICAgICAgICAgIEBsaW5lcy5wdXNoKCcnKVxuXG4gICAgICAgIHdyaXRlX2luZGVudGVkOiAoY29udGVudCwgaW5kZW50ID0gMCkgLT5cbiAgICAgICAgICBmb3IgbGluZSBpbiBjb250ZW50LnRyaW0oKS5zcGxpdChcIlxcblwiKVxuICAgICAgICAgICAgQGxpbmVzLnB1c2goXCIje0BpbmRlbnRfdG8oaW5kZW50KX0je2xpbmUudHJpbSgpfVwiKVxuXG4gICAgICAgIHdyaXRlX2NvbW1lbnRzOiAoaW5kZW50ID0gMCkgLT5cbiAgICAgICAgICBmb3IgY29tbWVudCBpbiBAY29tbWVudHMuc3BsaWNlKDAsIEBjb21tZW50cy5sZW5ndGgpXG4gICAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoY29tbWVudCwgaW5kZW50KVxuXG4gICAgICAgIHdyaXRlX3RhZ3M6IChpbmRlbnQgPSAwKSAtPlxuICAgICAgICAgIGlmIEB0YWdzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChAdGFncy5zcGxpY2UoMCwgQHRhZ3MubGVuZ3RoKS5qb2luKCcgJyksIGluZGVudClcblxuICAgICAgICBjb21tZW50OiAodmFsdWUsIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnY29tbWVudCcsIHZhbHVlOiB2YWx1ZS50cmltKCksIGxpbmU6IGxpbmV9KVxuICAgICAgICAgIEBjb21tZW50cy5wdXNoKHZhbHVlKVxuXG4gICAgICAgIHRhZzogKHZhbHVlLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ3RhZycsIHZhbHVlOiB2YWx1ZSwgbGluZTogbGluZX0pXG4gICAgICAgICAgQHRhZ3MucHVzaCh2YWx1ZSlcblxuICAgICAgICBmZWF0dXJlOiAoa2V5d29yZCwgbmFtZSwgZGVzY3JpcHRpb24sIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnZmVhdHVyZScsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMClcbiAgICAgICAgICBAd3JpdGVfdGFncygwKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH06ICN7bmFtZX1cIiwgJycpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKGRlc2NyaXB0aW9uLCAxKSBpZiBkZXNjcmlwdGlvblxuXG4gICAgICAgIGJhY2tncm91bmQ6IChrZXl3b3JkLCBuYW1lLCBkZXNjcmlwdGlvbiwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdiYWNrZ3JvdW5kJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9ibGFuaygpXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfTogI3tuYW1lfVwiLCAxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChkZXNjcmlwdGlvbiwgMikgaWYgZGVzY3JpcHRpb25cblxuICAgICAgICBzY2VuYXJpbzogKGtleXdvcmQsIG5hbWUsIGRlc2NyaXB0aW9uLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ3NjZW5hcmlvJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9ibGFuaygpXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDEpXG4gICAgICAgICAgQHdyaXRlX3RhZ3MoMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9OiAje25hbWV9XCIsIDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKGRlc2NyaXB0aW9uLCAyKSBpZiBkZXNjcmlwdGlvblxuXG4gICAgICAgIHNjZW5hcmlvX291dGxpbmU6IChrZXl3b3JkLCBuYW1lLCBkZXNjcmlwdGlvbiwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdvdXRsaW5lJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9ibGFuaygpXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDEpXG4gICAgICAgICAgQHdyaXRlX3RhZ3MoMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9OiAje25hbWV9XCIsIDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKGRlc2NyaXB0aW9uLCAyKSBpZiBkZXNjcmlwdGlvblxuXG4gICAgICAgIGV4YW1wbGVzOiAoa2V5d29yZCwgbmFtZSwgZGVzY3JpcHRpb24sIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnZXhhbXBsZXMnLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2JsYW5rKClcbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMilcbiAgICAgICAgICBAd3JpdGVfdGFncygyKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH06ICN7bmFtZX1cIiwgMilcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoZGVzY3JpcHRpb24sIDMpIGlmIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgc3RlcDogKGtleXdvcmQsIG5hbWUsIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnc3RlcCcsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDIpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfSN7bmFtZX1cIiwgMilcblxuICAgICAgICBkb2Nfc3RyaW5nOiAoY29udGVudF90eXBlLCBzdHJpbmcsIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnZG9jX3N0cmluZycsIGNvbnRlbnRfdHlwZTogY29udGVudF90eXBlLCBzdHJpbmc6IHN0cmluZywgbGluZTogbGluZX0pXG4gICAgICAgICAgdGhyZWVfcXVvdGVzID0gJ1wiXCJcIidcblxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygyKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7dGhyZWVfcXVvdGVzfSN7Y29udGVudF90eXBlfVxcbiN7c3RyaW5nfVxcbiN7dGhyZWVfcXVvdGVzfVwiLCAzKVxuXG4gICAgICAgIHJvdzogKGNlbGxzLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ3JvdycsIGNlbGxzOiBjZWxscywgbGluZTogbGluZX0pXG5cbiAgICAgICAgICAjIFRPRE86IG5lZWQgdG8gY29sbGVjdCByb3dzIHNvIHRoYXQgd2UgY2FuIGFsaWduIHRoZSB2ZXJ0aWNhbCBwaXBlcyB0byB0aGUgd2lkZXN0IGNvbHVtbnNcbiAgICAgICAgICAjIFNlZSBHaGVya2luOjpGb3JtYXR0ZXI6OlByZXR0eUZvcm1hdHRlciN0YWJsZShyb3dzKVxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygzKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcInwgI3tjZWxscy5qb2luKCcgfCAnKX0gfFwiLCAzKVxuXG4gICAgICAgIGVvZjogKCkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdlb2YnfSlcbiAgICAgICAgICAjIElmIHRoZXJlIHdlcmUgYW55IGNvbW1lbnRzIGxlZnQsIHRyZWF0IHRoZW0gYXMgc3RlcCBjb21tZW50cy5cbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMilcbiAgICAgIH1cblxuICAgICAgbGV4ZXIgPSBuZXcgTGV4ZXIocmVjb3JkZXIpXG4gICAgICBsZXhlci5zY2FuKHRleHQpXG5cbiAgICAgIGxvZ2dlckxldmVsID0gYXRvbT8uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeS5nZW5lcmFsLmxvZ2dlckxldmVsJylcbiAgICAgIGlmIGxvZ2dlckxldmVsIGlzICd2ZXJib3NlJ1xuICAgICAgICBmb3IgbGluZSBpbiByZWNvcmRlci5saW5lc1xuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKFwiPiAje2xpbmV9XCIpXG5cbiAgICAgIHJlc29sdmUgcmVjb3JkZXIubGluZXMuam9pbihcIlxcblwiKVxuICAgIClcbiJdfQ==

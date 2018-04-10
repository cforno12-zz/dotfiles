(function() {
  var ExpressionsRegistry, VariableExpression, registry, sass_handler;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n\\r]+);?', ['less']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['scss', 'sass', 'haml'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  sass_handler = function(match, solver) {
    var all_hyphen, all_underscore;
    solver.appendResult(match[1], match[2], 0, match[0].length, {
      isDefault: match[3] != null
    });
    if (match[1].match(/[-_]/)) {
      all_underscore = match[1].replace(/-/g, '_');
      all_hyphen = match[1].replace(/_/g, '-');
      if (match[1] !== all_underscore) {
        solver.appendResult(all_underscore, match[2], 0, match[0].length, {
          isAlternate: true,
          isDefault: match[3] != null
        });
      }
      if (match[1] !== all_hyphen) {
        solver.appendResult(all_hyphen, match[2], 0, match[0].length, {
          isAlternate: true,
          isDefault: match[3] != null
        });
      }
    }
    return solver.endParsing(match[0].length);
  };

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?\\s*;', ['scss', 'haml'], sass_handler);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*([^\\{]*?)(\\s*!default)?\\s*(?:$|\\/)', ['sass', 'haml'], sass_handler);

  registry.createExpression('pigments:css_vars', '(--[^\\s:]+):\\s*([^\\n;]+);', ['css'], function(match, solver) {
    solver.appendResult("var(" + match[1] + ")", match[2], 0, match[0].length);
    return solver.endParsing(match[0].length);
  });

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['styl', 'stylus'], function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, i, inCommaSensitiveContext, key, len, name, ref, ref1, scope, scopeBegin, scopeEnd, value;
    buffer = '';
    ref = match, match = ref[0], name = ref[1], content = ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (i = 0, len = content.length; i < len; i++) {
      char = content[i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = buffer.replace(/\s+/g, '');
        if (buffer.length) {
          ref1 = buffer.split(/\s*:\s*/), key = ref1[0], value = ref1[1];
          solver.appendResult(scope.concat(key).join('.'), value, current - buffer.length - 1, current);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['styl', 'stylus']);

  registry.createExpression('pigments:latex', '\\\\definecolor(\\{[^\\}]+\\})\\{([^\\}]+)\\}\\{([^\\}]+)\\}', ['tex'], function(match, solver) {
    var _, mode, name, value, values;
    _ = match[0], name = match[1], mode = match[2], value = match[3];
    value = (function() {
      switch (mode) {
        case 'RGB':
          return "rgb(" + value + ")";
        case 'gray':
          return "gray(" + (Math.round(parseFloat(value) * 100)) + "%)";
        case 'rgb':
          values = value.split(',').map(function(n) {
            return Math.floor(n * 255);
          });
          return "rgb(" + (values.join(',')) + ")";
        case 'cmyk':
          return "cmyk(" + value + ")";
        case 'HTML':
          return "#" + value;
        default:
          return value;
      }
    })();
    solver.appendResult(name, value, 0, _.length, {
      noNamePrefix: true
    });
    return solver.endParsing(_.length);
  });

  registry.createExpression('pigments:latex_mix', '\\\\definecolor(\\{[^\\}]+\\})(\\{[^\\}\\n!]+[!][^\\}\\n]+\\})', ['tex'], function(match, solver) {
    var _, name, value;
    _ = match[0], name = match[1], value = match[2];
    solver.appendResult(name, value, 0, _.length, {
      noNamePrefix: true
    });
    return solver.endParsing(_.length);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtZXhwcmVzc2lvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVI7O0VBQ3RCLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUjs7RUFFckIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0Isa0JBQXBCOztFQUVoQyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsZUFBMUIsRUFBMkMscURBQTNDLEVBQWtHLENBQUMsTUFBRCxDQUFsRzs7RUFHQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsc0JBQTFCLEVBQWtELHdFQUFsRCxFQUE0SCxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLENBQTVILEVBQXNKLFNBQUMsS0FBRCxFQUFRLE1BQVI7SUFDbkosUUFBUztXQUNWLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBakM7RUFGb0osQ0FBdEo7O0VBSUEsWUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDYixRQUFBO0lBQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsS0FBTSxDQUFBLENBQUEsQ0FBMUIsRUFBOEIsS0FBTSxDQUFBLENBQUEsQ0FBcEMsRUFBd0MsQ0FBeEMsRUFBMkMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXBELEVBQTREO01BQUEsU0FBQSxFQUFXLGdCQUFYO0tBQTVEO0lBRUEsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVCxDQUFlLE1BQWYsQ0FBSDtNQUNFLGNBQUEsR0FBaUIsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsR0FBdkI7TUFDakIsVUFBQSxHQUFh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aXN0cnkgPSByZXF1aXJlICcuL2V4cHJlc3Npb25zLXJlZ2lzdHJ5J1xuVmFyaWFibGVFeHByZXNzaW9uID0gcmVxdWlyZSAnLi92YXJpYWJsZS1leHByZXNzaW9uJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdHJ5ID0gbmV3IEV4cHJlc3Npb25zUmVnaXN0cnkoVmFyaWFibGVFeHByZXNzaW9uKVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsZXNzJywgJ15bIFxcXFx0XSooQFthLXpBLVowLTlcXFxcLV9dKylcXFxccyo6XFxcXHMqKFteO1xcXFxuXFxcXHJdKyk7PycsIFsnbGVzcyddXG5cbiMgSXQgY2F0Y2hlcyBzZXF1ZW5jZXMgbGlrZSBgQG1peGluIGZvbygkZm9vOiAxMClgIGFuZCBpZ25vcmVzIHRoZW0uXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzY3NzX3BhcmFtcycsICdeWyBcXFxcdF0qQChtaXhpbnxpbmNsdWRlfGZ1bmN0aW9uKVxcXFxzK1thLXpBLVowLTlcXFxcLV9dK1xcXFxzKlxcXFwoW15cXFxcKV0rXFxcXCknLCBbJ3Njc3MnLCAnc2FzcycsICdoYW1sJ10sIChtYXRjaCwgc29sdmVyKSAtPlxuICBbbWF0Y2hdID0gbWF0Y2hcbiAgc29sdmVyLmVuZFBhcnNpbmcobWF0Y2gubGVuZ3RoIC0gMSlcblxuc2Fzc19oYW5kbGVyID0gKG1hdGNoLCBzb2x2ZXIpIC0+XG4gIHNvbHZlci5hcHBlbmRSZXN1bHQobWF0Y2hbMV0sIG1hdGNoWzJdLCAwLCBtYXRjaFswXS5sZW5ndGgsIGlzRGVmYXVsdDogbWF0Y2hbM10/KVxuXG4gIGlmIG1hdGNoWzFdLm1hdGNoKC9bLV9dLylcbiAgICBhbGxfdW5kZXJzY29yZSA9IG1hdGNoWzFdLnJlcGxhY2UoLy0vZywgJ18nKVxuICAgIGFsbF9oeXBoZW4gPSBtYXRjaFsxXS5yZXBsYWNlKC9fL2csICctJylcblxuICAgIGlmIG1hdGNoWzFdIGlzbnQgYWxsX3VuZGVyc2NvcmVcbiAgICAgIHNvbHZlci5hcHBlbmRSZXN1bHQoYWxsX3VuZGVyc2NvcmUsIG1hdGNoWzJdLCAwLCBtYXRjaFswXS5sZW5ndGgsIGlzQWx0ZXJuYXRlOiB0cnVlLCBpc0RlZmF1bHQ6IG1hdGNoWzNdPylcbiAgICBpZiBtYXRjaFsxXSBpc250IGFsbF9oeXBoZW5cbiAgICAgIHNvbHZlci5hcHBlbmRSZXN1bHQoYWxsX2h5cGhlbiwgbWF0Y2hbMl0sIDAsIG1hdGNoWzBdLmxlbmd0aCwgaXNBbHRlcm5hdGU6IHRydWUsIGlzRGVmYXVsdDogbWF0Y2hbM10/KVxuXG4gIHNvbHZlci5lbmRQYXJzaW5nKG1hdGNoWzBdLmxlbmd0aClcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2NzcycsICdeWyBcXFxcdF0qKFxcXFwkW2EtekEtWjAtOVxcXFwtX10rKVxcXFxzKjpcXFxccyooLio/KShcXFxccyohZGVmYXVsdCk/XFxcXHMqOycsIFsnc2NzcycsICdoYW1sJ10sIHNhc3NfaGFuZGxlclxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzYXNzJywgJ15bIFxcXFx0XSooXFxcXCRbYS16QS1aMC05XFxcXC1fXSspXFxcXHMqOlxcXFxzKihbXlxcXFx7XSo/KShcXFxccyohZGVmYXVsdCk/XFxcXHMqKD86JHxcXFxcLyknLCBbJ3Nhc3MnLCAnaGFtbCddLCBzYXNzX2hhbmRsZXJcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX3ZhcnMnLCAnKC0tW15cXFxcczpdKyk6XFxcXHMqKFteXFxcXG47XSspOycsIFsnY3NzJ10sIChtYXRjaCwgc29sdmVyKSAtPlxuICBzb2x2ZXIuYXBwZW5kUmVzdWx0KFwidmFyKCN7bWF0Y2hbMV19KVwiLCBtYXRjaFsyXSwgMCwgbWF0Y2hbMF0ubGVuZ3RoKVxuICBzb2x2ZXIuZW5kUGFyc2luZyhtYXRjaFswXS5sZW5ndGgpXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c19oYXNoJywgJ15bIFxcXFx0XSooW2EtekEtWl8kXVthLXpBLVowLTlcXFxcLV9dKilcXFxccyo9XFxcXHMqXFxcXHsoW149XSopXFxcXH0nLCBbJ3N0eWwnLCAnc3R5bHVzJ10sIChtYXRjaCwgc29sdmVyKSAtPlxuICBidWZmZXIgPSAnJ1xuICBbbWF0Y2gsIG5hbWUsIGNvbnRlbnRdID0gbWF0Y2hcbiAgY3VycmVudCA9IG1hdGNoLmluZGV4T2YoY29udGVudClcbiAgc2NvcGUgPSBbbmFtZV1cbiAgc2NvcGVCZWdpbiA9IC9cXHsvXG4gIHNjb3BlRW5kID0gL1xcfS9cbiAgY29tbWFTZW5zaXRpdmVCZWdpbiA9IC9cXCh8XFxbL1xuICBjb21tYVNlbnNpdGl2ZUVuZCA9IC9cXCl8XFxdL1xuICBpbkNvbW1hU2Vuc2l0aXZlQ29udGV4dCA9IGZhbHNlXG4gIGZvciBjaGFyIGluIGNvbnRlbnRcbiAgICBpZiBzY29wZUJlZ2luLnRlc3QoY2hhcilcbiAgICAgIHNjb3BlLnB1c2ggYnVmZmVyLnJlcGxhY2UoL1tcXHM6XS9nLCAnJylcbiAgICAgIGJ1ZmZlciA9ICcnXG4gICAgZWxzZSBpZiBzY29wZUVuZC50ZXN0KGNoYXIpXG4gICAgICBzY29wZS5wb3AoKVxuICAgICAgcmV0dXJuIHNvbHZlci5lbmRQYXJzaW5nKGN1cnJlbnQpIGlmIHNjb3BlLmxlbmd0aCBpcyAwXG4gICAgZWxzZSBpZiBjb21tYVNlbnNpdGl2ZUJlZ2luLnRlc3QoY2hhcilcbiAgICAgIGJ1ZmZlciArPSBjaGFyXG4gICAgICBpbkNvbW1hU2Vuc2l0aXZlQ29udGV4dCA9IHRydWVcbiAgICBlbHNlIGlmIGluQ29tbWFTZW5zaXRpdmVDb250ZXh0XG4gICAgICBidWZmZXIgKz0gY2hhclxuICAgICAgaW5Db21tYVNlbnNpdGl2ZUNvbnRleHQgPSAhY29tbWFTZW5zaXRpdmVFbmQudGVzdChjaGFyKVxuICAgIGVsc2UgaWYgL1ssXFxuXS8udGVzdChjaGFyKVxuICAgICAgYnVmZmVyID0gYnVmZmVyLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgICBpZiBidWZmZXIubGVuZ3RoXG4gICAgICAgIFtrZXksIHZhbHVlXSA9IGJ1ZmZlci5zcGxpdCgvXFxzKjpcXHMqLylcblxuICAgICAgICBzb2x2ZXIuYXBwZW5kUmVzdWx0KHNjb3BlLmNvbmNhdChrZXkpLmpvaW4oJy4nKSwgdmFsdWUsIGN1cnJlbnQgLSBidWZmZXIubGVuZ3RoIC0gMSwgY3VycmVudClcblxuICAgICAgYnVmZmVyID0gJydcbiAgICBlbHNlXG4gICAgICBidWZmZXIgKz0gY2hhclxuXG4gICAgY3VycmVudCsrXG5cbiAgc2NvcGUucG9wKClcbiAgaWYgc2NvcGUubGVuZ3RoIGlzIDBcbiAgICBzb2x2ZXIuZW5kUGFyc2luZyhjdXJyZW50ICsgMSlcbiAgZWxzZVxuICAgIHNvbHZlci5hYm9ydFBhcnNpbmcoKVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzdHlsdXMnLCAnXlsgXFxcXHRdKihbYS16QS1aXyRdW2EtekEtWjAtOVxcXFwtX10qKVxcXFxzKj0oPyE9KVxcXFxzKihbXlxcXFxuXFxcXHI7XSopOz8kJywgWydzdHlsJywgJ3N0eWx1cyddXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4JywgJ1xcXFxcXFxcZGVmaW5lY29sb3IoXFxcXHtbXlxcXFx9XStcXFxcfSlcXFxceyhbXlxcXFx9XSspXFxcXH1cXFxceyhbXlxcXFx9XSspXFxcXH0nLCBbJ3RleCddLCAobWF0Y2gsIHNvbHZlcikgLT5cbiAgW18sIG5hbWUsIG1vZGUsIHZhbHVlXSA9IG1hdGNoXG5cbiAgdmFsdWUgPSBzd2l0Y2ggbW9kZVxuICAgIHdoZW4gJ1JHQicgdGhlbiBcInJnYigje3ZhbHVlfSlcIlxuICAgIHdoZW4gJ2dyYXknIHRoZW4gXCJncmF5KCN7TWF0aC5yb3VuZChwYXJzZUZsb2F0KHZhbHVlKSAqIDEwMCl9JSlcIlxuICAgIHdoZW4gJ3JnYidcbiAgICAgIHZhbHVlcyA9IHZhbHVlLnNwbGl0KCcsJykubWFwIChuKSAtPiBNYXRoLmZsb29yKG4gKiAyNTUpXG4gICAgICBcInJnYigje3ZhbHVlcy5qb2luKCcsJyl9KVwiXG4gICAgd2hlbiAnY215aycgdGhlbiBcImNteWsoI3t2YWx1ZX0pXCJcbiAgICB3aGVuICdIVE1MJyB0aGVuIFwiIyN7dmFsdWV9XCJcbiAgICBlbHNlIHZhbHVlXG5cbiAgc29sdmVyLmFwcGVuZFJlc3VsdChuYW1lLCB2YWx1ZSwgMCwgXy5sZW5ndGgsIG5vTmFtZVByZWZpeDogdHJ1ZSlcbiAgc29sdmVyLmVuZFBhcnNpbmcoXy5sZW5ndGgpXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X21peCcsICdcXFxcXFxcXGRlZmluZWNvbG9yKFxcXFx7W15cXFxcfV0rXFxcXH0pKFxcXFx7W15cXFxcfVxcXFxuIV0rWyFdW15cXFxcfVxcXFxuXStcXFxcfSknLCBbJ3RleCddLCAobWF0Y2gsIHNvbHZlcikgLT5cbiAgW18sIG5hbWUsIHZhbHVlXSA9IG1hdGNoXG5cbiAgc29sdmVyLmFwcGVuZFJlc3VsdChuYW1lLCB2YWx1ZSwgMCwgXy5sZW5ndGgsIG5vTmFtZVByZWZpeDogdHJ1ZSlcbiAgc29sdmVyLmVuZFBhcnNpbmcoXy5sZW5ndGgpXG4iXX0=

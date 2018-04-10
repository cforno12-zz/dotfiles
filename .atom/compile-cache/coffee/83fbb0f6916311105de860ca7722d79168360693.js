(function() {
  'use strict';
  var Beautifier, HOST, MULTI_LINE_OUTPUT_TABLE, PORT, PythonBeautifier, format, net,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  net = require('net');

  Beautifier = require('./beautifier');

  HOST = '127.0.0.1';

  PORT = 36805;

  MULTI_LINE_OUTPUT_TABLE = {
    'Grid': 0,
    'Vertical': 1,
    'Hanging Indent': 2,
    'Vertical Hanging Indent': 3,
    'Hanging Grid': 4,
    'Hanging Grid Grouped': 5,
    'NOQA': 6
  };

  format = function(data, formatters) {
    return new Promise(function(resolve, reject) {
      var client;
      client = new net.Socket();
      client.on('error', function(error) {
        client.destroy();
        return reject(error);
      });
      return client.connect(PORT, HOST, function() {
        var response;
        client.setEncoding('utf8');
        client.write(JSON.stringify({
          'data': data,
          'formatters': formatters
        }));
        response = '';
        client.on('data', function(chunk) {
          return response += chunk;
        });
        return client.on('end', function() {
          response = JSON.parse(response);
          if (response.error != null) {
            reject(Error(response.error));
          } else {
            resolve(response.data);
          }
          return client.destroy();
        });
      });
    });
  };

  module.exports = PythonBeautifier = (function(superClass) {
    extend(PythonBeautifier, superClass);

    function PythonBeautifier() {
      return PythonBeautifier.__super__.constructor.apply(this, arguments);
    }

    PythonBeautifier.prototype.name = "pybeautifier";

    PythonBeautifier.prototype.link = "https://github.com/guyskk/pybeautifier";

    PythonBeautifier.prototype.isPreInstalled = false;

    PythonBeautifier.prototype.options = {
      Python: true
    };

    PythonBeautifier.prototype.beautify = function(text, language, options) {
      var formatter, formatters, multi_line_output;
      formatter = {
        'name': options.formatter
      };
      if (options.formatter === 'autopep8') {
        formatter.config = {
          'ignore': options.ignore,
          'max_line_length': options.max_line_length
        };
      } else if (options.formatter === 'yapf') {
        formatter.config = {
          'style_config': options.style_config
        };
      }
      formatters = [formatter];
      if (options.sort_imports) {
        multi_line_output = MULTI_LINE_OUTPUT_TABLE[options.multi_line_output];
        formatters.push({
          'name': 'isort',
          'config': {
            'multi_line_output': multi_line_output
          }
        });
      }
      return new this.Promise(function(resolve, reject) {
        return format(text, formatters).then(function(data) {
          return resolve(data);
        })["catch"](function(error) {
          return reject(error);
        });
      });
    };

    return PythonBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9weWJlYXV0aWZpZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLDhFQUFBO0lBQUE7OztFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFDTixVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsSUFBQSxHQUFPOztFQUNQLElBQUEsR0FBTzs7RUFDUCx1QkFBQSxHQUEwQjtJQUN4QixNQUFBLEVBQVEsQ0FEZ0I7SUFFeEIsVUFBQSxFQUFZLENBRlk7SUFHeEIsZ0JBQUEsRUFBa0IsQ0FITTtJQUl4Qix5QkFBQSxFQUEyQixDQUpIO0lBS3hCLGNBQUEsRUFBZ0IsQ0FMUTtJQU14QixzQkFBQSxFQUF3QixDQU5BO0lBT3hCLE1BQUEsRUFBUSxDQVBnQjs7O0VBVTFCLE1BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxVQUFQO0FBQ1AsV0FBTyxJQUFJLE9BQUosQ0FBWSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2pCLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxHQUFHLENBQUMsTUFBUixDQUFBO01BQ1QsTUFBTSxDQUFDLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFNBQUMsS0FBRDtRQUNqQixNQUFNLENBQUMsT0FBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLEtBQVA7TUFGaUIsQ0FBbkI7YUFHQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsU0FBQTtBQUN6QixZQUFBO1FBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBbkI7UUFDQSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQUksQ0FBQyxTQUFMLENBQWU7VUFBQyxNQUFBLEVBQVEsSUFBVDtVQUFlLFlBQUEsRUFBYyxVQUE3QjtTQUFmLENBQWI7UUFDQSxRQUFBLEdBQVc7UUFDWCxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsU0FBQyxLQUFEO2lCQUNoQixRQUFBLElBQVk7UUFESSxDQUFsQjtlQUVBLE1BQU0sQ0FBQyxFQUFQLENBQVUsS0FBVixFQUFpQixTQUFBO1VBQ2YsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBWDtVQUNYLElBQUcsc0JBQUg7WUFDRSxNQUFBLENBQU8sS0FBQSxDQUFNLFFBQVEsQ0FBQyxLQUFmLENBQVAsRUFERjtXQUFBLE1BQUE7WUFHRSxPQUFBLENBQVEsUUFBUSxDQUFDLElBQWpCLEVBSEY7O2lCQUlBLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFOZSxDQUFqQjtNQU55QixDQUEzQjtJQUxpQixDQUFaO0VBREE7O0VBb0JULE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OytCQUVyQixJQUFBLEdBQU07OytCQUNOLElBQUEsR0FBTTs7K0JBQ04sY0FBQSxHQUFnQjs7K0JBRWhCLE9BQUEsR0FBUztNQUNQLE1BQUEsRUFBUSxJQUREOzs7K0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsU0FBQSxHQUFZO1FBQUMsTUFBQSxFQUFRLE9BQU8sQ0FBQyxTQUFqQjs7TUFDWixJQUFHLE9BQU8sQ0FBQyxTQUFSLEtBQXFCLFVBQXhCO1FBQ0UsU0FBUyxDQUFDLE1BQVYsR0FBbUI7VUFDakIsUUFBQSxFQUFVLE9BQU8sQ0FBQyxNQUREO1VBRWpCLGlCQUFBLEVBQW1CLE9BQU8sQ0FBQyxlQUZWO1VBRHJCO09BQUEsTUFLSyxJQUFHLE9BQU8sQ0FBQyxTQUFSLEtBQXFCLE1BQXhCO1FBQ0gsU0FBUyxDQUFDLE1BQVYsR0FBbUI7VUFBQyxjQUFBLEVBQWdCLE9BQU8sQ0FBQyxZQUF6QjtVQURoQjs7TUFFTCxVQUFBLEdBQWEsQ0FBQyxTQUFEO01BQ2IsSUFBRyxPQUFPLENBQUMsWUFBWDtRQUNFLGlCQUFBLEdBQW9CLHVCQUF3QixDQUFBLE9BQU8sQ0FBQyxpQkFBUjtRQUM1QyxVQUFVLENBQUMsSUFBWCxDQUNFO1VBQUEsTUFBQSxFQUFRLE9BQVI7VUFDQSxRQUFBLEVBQVU7WUFBQyxtQkFBQSxFQUFxQixpQkFBdEI7V0FEVjtTQURGLEVBRkY7O0FBS0EsYUFBTyxJQUFJLElBQUMsQ0FBQSxPQUFMLENBQWEsU0FBQyxPQUFELEVBQVUsTUFBVjtlQUNsQixNQUFBLENBQU8sSUFBUCxFQUFhLFVBQWIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7aUJBQ0osT0FBQSxDQUFRLElBQVI7UUFESSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLEtBQUQ7aUJBQ0wsTUFBQSxDQUFPLEtBQVA7UUFESyxDQUhQO01BRGtCLENBQWI7SUFmQzs7OztLQVZvQztBQXBDaEQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcbm5ldCA9IHJlcXVpcmUoJ25ldCcpXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxuSE9TVCA9ICcxMjcuMC4wLjEnXG5QT1JUID0gMzY4MDVcbk1VTFRJX0xJTkVfT1VUUFVUX1RBQkxFID0ge1xuICAnR3JpZCc6IDAsXG4gICdWZXJ0aWNhbCc6IDEsXG4gICdIYW5naW5nIEluZGVudCc6IDIsXG4gICdWZXJ0aWNhbCBIYW5naW5nIEluZGVudCc6IDMsXG4gICdIYW5naW5nIEdyaWQnOiA0LFxuICAnSGFuZ2luZyBHcmlkIEdyb3VwZWQnOiA1LFxuICAnTk9RQSc6IDZcbn1cblxuZm9ybWF0ID0gKGRhdGEsIGZvcm1hdHRlcnMpIC0+XG4gIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIGNsaWVudCA9IG5ldyBuZXQuU29ja2V0KClcbiAgICBjbGllbnQub24gJ2Vycm9yJywgKGVycm9yKSAtPlxuICAgICAgY2xpZW50LmRlc3Ryb3koKVxuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIGNsaWVudC5jb25uZWN0IFBPUlQsIEhPU1QsIC0+XG4gICAgICBjbGllbnQuc2V0RW5jb2RpbmcoJ3V0ZjgnKVxuICAgICAgY2xpZW50LndyaXRlKEpTT04uc3RyaW5naWZ5KHsnZGF0YSc6IGRhdGEsICdmb3JtYXR0ZXJzJzogZm9ybWF0dGVyc30pKVxuICAgICAgcmVzcG9uc2UgPSAnJ1xuICAgICAgY2xpZW50Lm9uICdkYXRhJywgKGNodW5rKSAtPlxuICAgICAgICByZXNwb25zZSArPSBjaHVua1xuICAgICAgY2xpZW50Lm9uICdlbmQnLCAtPlxuICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGlmIHJlc3BvbnNlLmVycm9yP1xuICAgICAgICAgIHJlamVjdChFcnJvcihyZXNwb25zZS5lcnJvcikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmRhdGEpXG4gICAgICAgIGNsaWVudC5kZXN0cm95KClcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQeXRob25CZWF1dGlmaWVyIGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6IFwicHliZWF1dGlmaWVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZ3V5c2trL3B5YmVhdXRpZmllclwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBQeXRob246IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgZm9ybWF0dGVyID0geyduYW1lJzogb3B0aW9ucy5mb3JtYXR0ZXJ9XG4gICAgaWYgb3B0aW9ucy5mb3JtYXR0ZXIgPT0gJ2F1dG9wZXA4J1xuICAgICAgZm9ybWF0dGVyLmNvbmZpZyA9IHtcbiAgICAgICAgJ2lnbm9yZSc6IG9wdGlvbnMuaWdub3JlXG4gICAgICAgICdtYXhfbGluZV9sZW5ndGgnOiBvcHRpb25zLm1heF9saW5lX2xlbmd0aFxuICAgICAgfVxuICAgIGVsc2UgaWYgb3B0aW9ucy5mb3JtYXR0ZXIgPT0gJ3lhcGYnXG4gICAgICBmb3JtYXR0ZXIuY29uZmlnID0geydzdHlsZV9jb25maWcnOiBvcHRpb25zLnN0eWxlX2NvbmZpZ31cbiAgICBmb3JtYXR0ZXJzID0gW2Zvcm1hdHRlcl1cbiAgICBpZiBvcHRpb25zLnNvcnRfaW1wb3J0c1xuICAgICAgbXVsdGlfbGluZV9vdXRwdXQgPSBNVUxUSV9MSU5FX09VVFBVVF9UQUJMRVtvcHRpb25zLm11bHRpX2xpbmVfb3V0cHV0XVxuICAgICAgZm9ybWF0dGVycy5wdXNoXG4gICAgICAgICduYW1lJzogJ2lzb3J0J1xuICAgICAgICAnY29uZmlnJzogeydtdWx0aV9saW5lX291dHB1dCc6IG11bHRpX2xpbmVfb3V0cHV0fVxuICAgIHJldHVybiBuZXcgQFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGZvcm1hdCh0ZXh0LCBmb3JtYXR0ZXJzKVxuICAgICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgIHJlamVjdChlcnJvcilcbiJdfQ==

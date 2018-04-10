(function() {
  var BufferedProcess, CompositeDisposable, XRegExp, path, ref, writeGoodRe,
    slice = [].slice;

  path = require('path');

  XRegExp = require('xregexp').XRegExp;

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable;

  writeGoodRe = '[^^]*(?<offset>\\^+)[^^]*\n(?<message>.+?) on line (?<line>\\d+) at column (?<col>\\d+)\n?';

  module.exports = {
    config: {
      writeGoodPath: {
        type: 'string',
        title: 'Path to the write-good executable. Defaults to a built-in write-good.',
        "default": path.join(__dirname, '..', 'node_modules', 'write-good', 'bin', 'write-good.js')
      },
      additionalArgs: {
        type: 'string',
        title: 'Additional arguments to pass to write-good.',
        "default": ''
      },
      nodePath: {
        type: 'string',
        title: 'Path to the node interpreter to use. Defaults to Atom\'s.',
        "default": path.join(atom.packages.getApmPath(), '..', 'node')
      },
      severityLevel: {
        type: 'string',
        title: 'Severity level',
        "default": 'Error',
        "enum": ['Error', 'Warning', 'Info']
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-write-good.writeGoodPath', (function(_this) {
        return function(writeGoodPath) {
          return _this.writeGoodPath = writeGoodPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-write-good.nodePath', (function(_this) {
        return function(nodePath) {
          return _this.nodePath = nodePath;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-write-good.additionalArgs', (function(_this) {
        return function(additionalArgs) {
          return _this.additionalArgs = additionalArgs ? additionalArgs.split(' ') : [];
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        name: 'write-good',
        grammarScopes: ["source.gfm", "gfm.restructuredtext", "source.asciidoc", "text.md", "text.git-commit", "text.plain", "text.plain.null-grammar", "text.restructuredtext", "text.bibtex", "text.tex.latex", "text.tex.latex.beamer", "text.log.latex", "text.tex.latex.memoir", "text.tex"],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            return new Promise(function(resolve, reject) {
              var filePath, output, process;
              filePath = textEditor.getPath();
              output = "";
              process = new BufferedProcess({
                command: _this.nodePath,
                args: [_this.writeGoodPath, filePath].concat(slice.call(_this.additionalArgs)),
                stdout: function(data) {
                  return output += data;
                },
                exit: function(code) {
                  var messages, regex;
                  messages = [];
                  regex = XRegExp(writeGoodRe, this.regexFlags);
                  XRegExp.forEach(output, regex, function(match, i) {
                    match.colStart = parseInt(match.col);
                    match.lineStart = parseInt(match.line) - 1;
                    match.colEnd = match.colStart + match.offset.length;
                    return messages.push({
                      type: atom.config.get('linter-write-good.severityLevel'),
                      text: match.message,
                      filePath: filePath,
                      range: [[match.lineStart, match.colStart], [match.lineStart, match.colEnd]]
                    });
                  });
                  return resolve(messages);
                }
              });
              return process.onWillThrowError(function(arg) {
                var error, handle;
                error = arg.error, handle = arg.handle;
                atom.notifications.addError("Failed to run " + this.nodePath + " " + this.writeGoodPath, {
                  detail: "" + error.message,
                  dismissable: true
                });
                handle();
                return resolve([]);
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItd3JpdGUtZ29vZC9saWIvaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHFFQUFBO0lBQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsT0FBQSxDQUFRLFNBQVI7O0VBQ1osTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyxxQ0FBRCxFQUFrQjs7RUFFbEIsV0FBQSxHQUFjOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxhQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLEtBQUEsRUFBTyx1RUFEUDtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLGNBQTNCLEVBQTJDLFlBQTNDLEVBQXlELEtBQXpELEVBQWdFLGVBQWhFLENBRlQ7T0FERjtNQUlBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsS0FBQSxFQUFPLDZDQURQO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO09BTEY7TUFRQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLEtBQUEsRUFBTywyREFEUDtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQWQsQ0FBQSxDQUFWLEVBQXNDLElBQXRDLEVBQTRDLE1BQTVDLENBRlQ7T0FURjtNQVlBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsS0FBQSxFQUFPLGdCQURQO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQUZUO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE9BQUQs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LE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFOO3NCQUNBLElBQUEsRUFBTSxLQUFLLENBQUMsT0FEWjtzQkFFQSxRQUFBLEVBQVUsUUFGVjtzQkFHQSxLQUFBLEVBQU8sQ0FDTCxDQUFDLEtBQUssQ0FBQyxTQUFQLEVBQWtCLEtBQUssQ0FBQyxRQUF4QixDQURLLEVBRUwsQ0FBQyxLQUFLLENBQUMsU0FBUCxFQUFrQixLQUFLLENBQUMsTUFBeEIsQ0FGSyxDQUhQO3FCQURGO2tCQUo2QixDQUEvQjt5QkFhQSxPQUFBLENBQVEsUUFBUjtnQkFqQkksQ0FQTjtlQURZO3FCQTJCZCxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxHQUFEO0FBQ3ZCLG9CQUFBO2dCQUR5QixtQkFBTTtnQkFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixnQkFBQSxHQUFpQixJQUFDLENBQUEsUUFBbEIsR0FBMkIsR0FBM0IsR0FBOEIsSUFBQyxDQUFBLGFBQTNELEVBQ0U7a0JBQUEsTUFBQSxFQUFRLEVBQUEsR0FBRyxLQUFLLENBQUMsT0FBakI7a0JBQ0EsV0FBQSxFQUFhLElBRGI7aUJBREY7Z0JBR0EsTUFBQSxDQUFBO3VCQUNBLE9BQUEsQ0FBUSxFQUFSO2NBTHVCLENBQXpCO1lBaENpQixDQUFSO1VBRFA7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkJOOztJQUZXLENBeENmOztBQVBGIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57WFJlZ0V4cH0gPSByZXF1aXJlICd4cmVnZXhwJ1xue0J1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG53cml0ZUdvb2RSZSA9ICdbXl5dKig/PG9mZnNldD5cXFxcXispW15eXSpcXG4oPzxtZXNzYWdlPi4rPykgb24gbGluZSAoPzxsaW5lPlxcXFxkKykgYXQgY29sdW1uICg/PGNvbD5cXFxcZCspXFxuPydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgd3JpdGVHb29kUGF0aDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB0aXRsZTogJ1BhdGggdG8gdGhlIHdyaXRlLWdvb2QgZXhlY3V0YWJsZS4gRGVmYXVsdHMgdG8gYSBidWlsdC1pbiB3cml0ZS1nb29kLidcbiAgICAgIGRlZmF1bHQ6IHBhdGguam9pbiBfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnd3JpdGUtZ29vZCcsICdiaW4nLCAnd3JpdGUtZ29vZC5qcydcbiAgICBhZGRpdGlvbmFsQXJnczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB0aXRsZTogJ0FkZGl0aW9uYWwgYXJndW1lbnRzIHRvIHBhc3MgdG8gd3JpdGUtZ29vZC4nXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIG5vZGVQYXRoOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIHRpdGxlOiAnUGF0aCB0byB0aGUgbm9kZSBpbnRlcnByZXRlciB0byB1c2UuIERlZmF1bHRzIHRvIEF0b21cXCdzLidcbiAgICAgIGRlZmF1bHQ6IHBhdGguam9pbiBhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSwgJy4uJywgJ25vZGUnXG4gICAgc2V2ZXJpdHlMZXZlbDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB0aXRsZTogJ1NldmVyaXR5IGxldmVsJ1xuICAgICAgZGVmYXVsdDogJ0Vycm9yJ1xuICAgICAgZW51bTogWydFcnJvcicsICdXYXJuaW5nJywgJ0luZm8nXVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItd3JpdGUtZ29vZC53cml0ZUdvb2RQYXRoJyxcbiAgICAgICh3cml0ZUdvb2RQYXRoKSA9PlxuICAgICAgICBAd3JpdGVHb29kUGF0aCA9IHdyaXRlR29vZFBhdGhcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItd3JpdGUtZ29vZC5ub2RlUGF0aCcsXG4gICAgICAobm9kZVBhdGgpID0+XG4gICAgICAgIEBub2RlUGF0aCA9IG5vZGVQYXRoXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnbGludGVyLXdyaXRlLWdvb2QuYWRkaXRpb25hbEFyZ3MnLFxuICAgICAgKGFkZGl0aW9uYWxBcmdzKSA9PlxuICAgICAgICBAYWRkaXRpb25hbEFyZ3MgPSBpZiBhZGRpdGlvbmFsQXJnc1xuICAgICAgICAgIGFkZGl0aW9uYWxBcmdzLnNwbGl0ICcgJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgW11cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHByb3ZpZGVMaW50ZXI6IC0+XG4gICAgcHJvdmlkZXIgPVxuICAgICAgbmFtZTogJ3dyaXRlLWdvb2QnLFxuXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAgIFwic291cmNlLmdmbVwiXG4gICAgICAgIFwiZ2ZtLnJlc3RydWN0dXJlZHRleHRcIlxuICAgICAgICBcInNvdXJjZS5hc2NpaWRvY1wiXG4gICAgICAgIFwidGV4dC5tZFwiXG4gICAgICAgIFwidGV4dC5naXQtY29tbWl0XCJcbiAgICAgICAgXCJ0ZXh0LnBsYWluXCJcbiAgICAgICAgXCJ0ZXh0LnBsYWluLm51bGwtZ3JhbW1hclwiXG4gICAgICAgIFwidGV4dC5yZXN0cnVjdHVyZWR0ZXh0XCJcbiAgICAgICAgXCJ0ZXh0LmJpYnRleFwiXG4gICAgICAgIFwidGV4dC50ZXgubGF0ZXhcIlxuICAgICAgICBcInRleHQudGV4LmxhdGV4LmJlYW1lclwiXG4gICAgICAgIFwidGV4dC5sb2cubGF0ZXhcIlxuICAgICAgICBcInRleHQudGV4LmxhdGV4Lm1lbW9pclwiXG4gICAgICAgIFwidGV4dC50ZXhcIlxuICAgICAgXVxuXG4gICAgICBzY29wZTogJ2ZpbGUnICMgb3IgJ3Byb2plY3QnXG5cbiAgICAgIGxpbnRPbkZseTogdHJ1ZSAjIG11c3QgYmUgZmFsc2UgZm9yIHNjb3BlOiAncHJvamVjdCdcblxuICAgICAgbGludDogKHRleHRFZGl0b3IpID0+XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgIGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcblxuICAgICAgICAgIG91dHB1dCA9IFwiXCJcblxuICAgICAgICAgIHByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzXG4gICAgICAgICAgICBjb21tYW5kOiBAbm9kZVBhdGhcblxuICAgICAgICAgICAgYXJnczogW0B3cml0ZUdvb2RQYXRoLCBmaWxlUGF0aCwgQGFkZGl0aW9uYWxBcmdzLi4uXVxuXG4gICAgICAgICAgICBzdGRvdXQ6IChkYXRhKSAtPlxuICAgICAgICAgICAgICBvdXRwdXQgKz0gZGF0YVxuXG4gICAgICAgICAgICBleGl0OiAoY29kZSkgLT5cbiAgICAgICAgICAgICAgbWVzc2FnZXMgPSBbXVxuICAgICAgICAgICAgICByZWdleCA9IFhSZWdFeHAgd3JpdGVHb29kUmUsIEByZWdleEZsYWdzXG5cbiAgICAgICAgICAgICAgWFJlZ0V4cC5mb3JFYWNoIG91dHB1dCwgcmVnZXgsIChtYXRjaCwgaSkgLT5cbiAgICAgICAgICAgICAgICBtYXRjaC5jb2xTdGFydCA9IHBhcnNlSW50KG1hdGNoLmNvbClcbiAgICAgICAgICAgICAgICBtYXRjaC5saW5lU3RhcnQgPSBwYXJzZUludChtYXRjaC5saW5lKSAtIDFcbiAgICAgICAgICAgICAgICBtYXRjaC5jb2xFbmQgPSBtYXRjaC5jb2xTdGFydCArIG1hdGNoLm9mZnNldC5sZW5ndGhcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhdG9tLmNvbmZpZy5nZXQgJ2xpbnRlci13cml0ZS1nb29kLnNldmVyaXR5TGV2ZWwnXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBtYXRjaC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICBmaWxlUGF0aDogZmlsZVBhdGhcbiAgICAgICAgICAgICAgICAgIHJhbmdlOiBbXG4gICAgICAgICAgICAgICAgICAgIFttYXRjaC5saW5lU3RhcnQsIG1hdGNoLmNvbFN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICBbbWF0Y2gubGluZVN0YXJ0LCBtYXRjaC5jb2xFbmRdXG4gICAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgICAgcmVzb2x2ZSBtZXNzYWdlc1xuXG4gICAgICAgICAgcHJvY2Vzcy5vbldpbGxUaHJvd0Vycm9yICh7ZXJyb3IsaGFuZGxlfSkgLT5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkZhaWxlZCB0byBydW4gI3tAbm9kZVBhdGh9ICN7QHdyaXRlR29vZFBhdGh9XCIsXG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2Vycm9yLm1lc3NhZ2V9XCJcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIGhhbmRsZSgpXG4gICAgICAgICAgICByZXNvbHZlIFtdXG4iXX0=

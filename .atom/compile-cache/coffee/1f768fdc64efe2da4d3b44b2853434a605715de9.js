(function() {
  var Beautifier, Beautifiers, Executable, Languages, Promise, _, beautifiers, fs, isWindows, path, temp;

  Beautifiers = require("../src/beautifiers");

  Executable = require("../src/beautifiers/executable");

  beautifiers = new Beautifiers();

  Beautifier = require("../src/beautifiers/beautifier");

  Languages = require('../src/languages/');

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  Promise = require("bluebird");

  temp = require('temp');

  temp.track();

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("Atom-Beautify", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        atom.config.set('atom-beautify.general.loggerLevel', 'info');
        return activationPromise;
      });
    });
    afterEach(function() {
      return temp.cleanupSync();
    });
    describe("Beautifiers", function() {
      var beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new Beautifier();
      });
      return describe("Beautifier::run", function() {
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, p;
            p = beautifier.run("program", []);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(typeof v.description).toBe("string", 'Error should have a description.');
              expect(v.description.indexOf("Executable - Beautifier - Path")).toBe(-1, "Error should not have pathOption.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with Windows-specific help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p, terminal, whichCmd;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            Executable.isWindows = function() {
              return true;
            };
            terminal = 'CMD prompt';
            whichCmd = "where.exe";
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              console.log("error", v, v.description);
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
              expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        if (!isWindows) {
          return it("should error with Mac/Linux-specific help description when beautifier's program not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, help, p, terminal, whichCmd;
              help = {
                link: "http://test.com",
                program: "test-program",
                pathOption: "Lang - Test Program Path"
              };
              Executable.isWindows = function() {
                return false;
              };
              terminal = "Terminal";
              whichCmd = "which";
              p = beautifier.run("program", [], {
                help: help
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true);
                expect(v.code).toBe("CommandNotFound");
                expect(v.description).not.toBe(null);
                expect(v.description.indexOf(help.link)).not.toBe(-1);
                expect(v.description.indexOf(help.program)).not.toBe(-1);
                expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
                expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
                return v;
              };
              p.then(cb, cb);
              return p;
            });
          });
        }
      });
    });
    return describe("Options", function() {
      var beautifier, beautifyEditor, editor, workspaceElement;
      editor = null;
      beautifier = null;
      workspaceElement = atom.views.getView(atom.workspace);
      beforeEach(function() {
        beautifier = new Beautifiers();
        return waitsForPromise(function() {
          return atom.workspace.open().then(function(e) {
            editor = e;
            return expect(editor.getText()).toEqual("");
          });
        });
      });
      describe("Migrate Settings", function() {
        var migrateSettings;
        migrateSettings = function(beforeKey, afterKey, val) {
          atom.config.set("atom-beautify." + beforeKey, val);
          atom.commands.dispatch(workspaceElement, "atom-beautify:migrate-settings");
          expect(_.has(atom.config.get('atom-beautify'), beforeKey)).toBe(false);
          return expect(atom.config.get("atom-beautify." + afterKey)).toBe(val);
        };
        it("should migrate js_indent_size to js.indent_size", function() {
          migrateSettings("js_indent_size", "js.indent_size", 1);
          return migrateSettings("js_indent_size", "js.indent_size", 10);
        });
        it("should migrate analytics to general.analytics", function() {
          migrateSettings("analytics", "general.analytics", true);
          return migrateSettings("analytics", "general.analytics", false);
        });
        it("should migrate _analyticsUserId to general._analyticsUserId", function() {
          migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid");
          return migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid2");
        });
        it("should migrate language_js_disabled to js.disabled", function() {
          migrateSettings("language_js_disabled", "js.disabled", false);
          return migrateSettings("language_js_disabled", "js.disabled", true);
        });
        it("should migrate language_js_default_beautifier to js.default_beautifier", function() {
          migrateSettings("language_js_default_beautifier", "js.default_beautifier", "Pretty Diff");
          return migrateSettings("language_js_default_beautifier", "js.default_beautifier", "JS Beautify");
        });
        return it("should migrate language_js_beautify_on_save to js.beautify_on_save", function() {
          migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", true);
          return migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", false);
        });
      });
      beautifyEditor = function(callback) {
        var beforeText, delay, isComplete;
        isComplete = false;
        beforeText = null;
        delay = 500;
        runs(function() {
          beforeText = editor.getText();
          atom.commands.dispatch(workspaceElement, "atom-beautify:beautify-editor");
          return setTimeout(function() {
            return isComplete = true;
          }, delay);
        });
        waitsFor(function() {
          return isComplete;
        });
        return runs(function() {
          var afterText;
          afterText = editor.getText();
          expect(typeof beforeText).toBe('string');
          expect(typeof afterText).toBe('string');
          return callback(beforeText, afterText);
        });
      };
      return describe("JavaScript", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            var packName;
            packName = 'language-javascript';
            return atom.packages.activatePackage(packName);
          });
          return runs(function() {
            var code, grammar;
            code = "var hello='world';function(){console.log('hello '+hello)}";
            editor.setText(code);
            grammar = atom.grammars.selectGrammar('source.js');
            expect(grammar.name).toBe('JavaScript');
            editor.setGrammar(grammar);
            expect(editor.getGrammar().name).toBe('JavaScript');
            return jasmine.unspy(window, 'setTimeout');
          });
        });
        describe(".jsbeautifyrc", function() {
          return it("should look at directories above file", function() {
            var cb, isDone;
            isDone = false;
            cb = function(err) {
              isDone = true;
              return expect(err).toBe(void 0);
            };
            runs(function() {
              var err;
              try {
                return temp.mkdir('dir1', function(err, dirPath) {
                  var myData, myData1, rcPath;
                  if (err) {
                    return cb(err);
                  }
                  rcPath = path.join(dirPath, '.jsbeautifyrc');
                  myData1 = {
                    indent_size: 1,
                    indent_char: '\t'
                  };
                  myData = JSON.stringify(myData1);
                  return fs.writeFile(rcPath, myData, function(err) {
                    if (err) {
                      return cb(err);
                    }
                    dirPath = path.join(dirPath, 'dir2');
                    return fs.mkdir(dirPath, function(err) {
                      var myData2;
                      if (err) {
                        return cb(err);
                      }
                      rcPath = path.join(dirPath, '.jsbeautifyrc');
                      myData2 = {
                        indent_size: 2,
                        indent_char: ' '
                      };
                      myData = JSON.stringify(myData2);
                      return fs.writeFile(rcPath, myData, function(err) {
                        if (err) {
                          return cb(err);
                        }
                        return Promise.all(beautifier.getOptionsForPath(rcPath, null)).then(function(allOptions) {
                          var config1, config2, configOptions, editorConfigOptions, editorOptions, homeOptions, projectOptions, ref;
                          editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
                          projectOptions = allOptions.slice(4);
                          ref = projectOptions.slice(-2), config1 = ref[0], config2 = ref[1];
                          expect(_.get(config1, '_default.indent_size')).toBe(myData1.indent_size);
                          expect(_.get(config2, '_default.indent_size')).toBe(myData2.indent_size);
                          expect(_.get(config1, '_default.indent_char')).toBe(myData1.indent_char);
                          expect(_.get(config2, '_default.indent_char')).toBe(myData2.indent_char);
                          return cb();
                        });
                      });
                    });
                  });
                });
              } catch (error) {
                err = error;
                return cb(err);
              }
            });
            return waitsFor(function() {
              return isDone;
            });
          });
        });
        return describe("Package settings", function() {
          var getOptions;
          getOptions = function(callback) {
            var options;
            options = null;
            waitsForPromise(function() {
              var allOptions;
              allOptions = beautifier.getOptionsForPath(null, null);
              return Promise.all(allOptions).then(function(allOptions) {
                return options = allOptions;
              });
            });
            return runs(function() {
              return callback(options);
            });
          };
          it("should change indent_size to 1", function() {
            atom.config.set('atom-beautify.js.indent_size', 1);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(1);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n console.log('hello ' + hello)\n}");
              });
            });
          });
          return it("should change indent_size to 10", function() {
            atom.config.set('atom-beautify.js.indent_size', 10);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(10);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n          console.log('hello ' + hello)\n}");
              });
            });
          });
        });
      });
    });
  });

  describe("Languages", function() {
    var languages;
    languages = null;
    beforeEach(function() {
      return languages = new Languages();
    });
    return describe("Languages::namespace", function() {
      return it("should verify that multiple languages do not share the same namespace", function() {
        var namespaceGroups, namespaceOverlap, namespacePairs;
        namespaceGroups = _.groupBy(languages.languages, "namespace");
        namespacePairs = _.toPairs(namespaceGroups);
        namespaceOverlap = _.filter(namespacePairs, function(arg) {
          var group, namespace;
          namespace = arg[0], group = arg[1];
          return group.length > 1;
        });
        return expect(namespaceOverlap.length).toBe(0, "Language namespaces are overlapping.\nNamespaces are unique: only one language for each namespace.\n" + _.map(namespaceOverlap, function(arg) {
          var group, namespace;
          namespace = arg[0], group = arg[1];
          return "- '" + namespace + "': Check languages " + (_.map(group, 'name').join(', ')) + " for using namespace '" + namespace + "'.";
        }).join('\n'));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NwZWMvYXRvbS1iZWF1dGlmeS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUjs7RUFDZCxVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSOztFQUNiLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQUE7O0VBQ2xCLFVBQUEsR0FBYSxPQUFBLENBQVEsK0JBQVI7O0VBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUjs7RUFDWixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osRUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLElBQUksQ0FBQyxLQUFMLENBQUE7O0VBUUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXBCLElBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLFFBRFosSUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0I7O0VBRXhCLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7SUFFeEIsVUFBQSxDQUFXLFNBQUE7YUFHVCxlQUFBLENBQWdCLFNBQUE7QUFDZCxZQUFBO1FBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCO1FBRXBCLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CO1FBQ1AsSUFBSSxDQUFDLFdBQUwsQ0FBQTtRQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEIsRUFBcUQsTUFB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aUJBQVcsS0FBSyxDQUFDLE1BQU4sR0FBZTtRQUF2QyxDQUF6QjtlQUVuQixNQUFBLENBQU8sZ0JBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQyxFQUNFLHNHQUFBLEdBRUEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxnQkFBTixFQUF3QixTQUFDLEdBQUQ7QUFBd0IsY0FBQTtVQUF0QixvQkFBVztpQkFBVyxLQUFBLEdBQU0sU0FBTixHQUFnQixxQkFBaEIsR0FBb0MsQ0FBQyxDQUFDLENBQUMsR0FBRixDQUFNLEtBQU4sRUFBYSxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBRCxDQUFwQyxHQUFxRSx3QkFBckUsR0FBNkYsU0FBN0YsR0FBdUc7UUFBL0gsQ0FBeEIsQ0FBMkosQ0FBQyxJQUE1SixDQUFpSyxJQUFqSyxDQUhGO01BTjBFLENBQTVFO0lBRitCLENBQWpDO0VBUG9CLENBQXRCO0FBNVpBIiwic291cmNlc0NvbnRlbnQiOlsiQmVhdXRpZmllcnMgPSByZXF1aXJlIFwiLi4vc3JjL2JlYXV0aWZpZXJzXCJcbkV4ZWN1dGFibGUgPSByZXF1aXJlIFwiLi4vc3JjL2JlYXV0aWZpZXJzL2V4ZWN1dGFibGVcIlxuYmVhdXRpZmllcnMgPSBuZXcgQmVhdXRpZmllcnMoKVxuQmVhdXRpZmllciA9IHJlcXVpcmUgXCIuLi9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllclwiXG5MYW5ndWFnZXMgPSByZXF1aXJlKCcuLi9zcmMvbGFuZ3VhZ2VzLycpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbmZzICAgPSByZXF1aXJlKCdmcycpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5Qcm9taXNlID0gcmVxdWlyZShcImJsdWViaXJkXCIpXG50ZW1wID0gcmVxdWlyZSgndGVtcCcpXG50ZW1wLnRyYWNrKClcblxuIyBVc2UgdGhlIGNvbW1hbmQgYHdpbmRvdzpydW4tcGFja2FnZS1zcGVjc2AgKGNtZC1hbHQtY3RybC1wKSB0byBydW4gc3BlY3MuXG4jXG4jIFRvIHJ1biBhIHNwZWNpZmljIGBpdGAgb3IgYGRlc2NyaWJlYCBibG9jayBhZGQgYW4gYGZgIHRvIHRoZSBmcm9udCAoZS5nLiBgZml0YFxuIyBvciBgZmRlc2NyaWJlYCkuIFJlbW92ZSB0aGUgYGZgIHRvIHVuZm9jdXMgdGhlIGJsb2NrLlxuXG4jIENoZWNrIGlmIFdpbmRvd3NcbmlzV2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJyBvclxuICBwcm9jZXNzLmVudi5PU1RZUEUgaXMgJ2N5Z3dpbicgb3JcbiAgcHJvY2Vzcy5lbnYuT1NUWVBFIGlzICdtc3lzJ1xuXG5kZXNjcmliZSBcIkF0b20tQmVhdXRpZnlcIiwgLT5cblxuICBiZWZvcmVFYWNoIC0+XG5cbiAgICAjIEFjdGl2YXRlIHBhY2thZ2VcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tYmVhdXRpZnknKVxuICAgICAgIyBGb3JjZSBhY3RpdmF0ZSBwYWNrYWdlXG4gICAgICBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKFwiYXRvbS1iZWF1dGlmeVwiKVxuICAgICAgcGFjay5hY3RpdmF0ZU5vdygpXG4gICAgICAjIENoYW5nZSBsb2dnZXIgbGV2ZWxcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1iZWF1dGlmeS5nZW5lcmFsLmxvZ2dlckxldmVsJywgJ2luZm8nKVxuICAgICAgIyBSZXR1cm4gcHJvbWlzZVxuICAgICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgdGVtcC5jbGVhbnVwU3luYygpXG5cbiAgZGVzY3JpYmUgXCJCZWF1dGlmaWVyc1wiLCAtPlxuXG4gICAgYmVhdXRpZmllciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGJlYXV0aWZpZXIgPSBuZXcgQmVhdXRpZmllcigpXG5cbiAgICBkZXNjcmliZSBcIkJlYXV0aWZpZXI6OnJ1blwiLCAtPlxuXG4gICAgICBpdCBcInNob3VsZCBlcnJvciB3aGVuIGJlYXV0aWZpZXIncyBwcm9ncmFtIG5vdCBmb3VuZFwiLCAtPlxuICAgICAgICBleHBlY3QoYmVhdXRpZmllcikubm90LnRvQmUobnVsbClcbiAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyKS50b0JlKHRydWUpXG5cbiAgICAgICAgIyB3YWl0c0ZvclJ1bnMgPSAoZm4sIG1lc3NhZ2UsIHRpbWVvdXQpIC0+XG4gICAgICAgICMgICAgIGlzQ29tcGxldGVkID0gZmFsc2VcbiAgICAgICAgIyAgICAgY29tcGxldGVkID0gLT5cbiAgICAgICAgIyAgICAgICAgIGNvbnNvbGUubG9nKCdjb21wbGV0ZWQnKVxuICAgICAgICAjICAgICAgICAgaXNDb21wbGV0ZWQgPSB0cnVlXG4gICAgICAgICMgICAgIHJ1bnMgLT5cbiAgICAgICAgIyAgICAgICAgIGNvbnNvbGUubG9nKCdydW5zJylcbiAgICAgICAgIyAgICAgICAgIGZuKGNvbXBsZXRlZClcbiAgICAgICAgIyAgICAgd2FpdHNGb3IoLT5cbiAgICAgICAgIyAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0c0ZvcicsIGlzQ29tcGxldGVkKVxuICAgICAgICAjICAgICAgICAgaXNDb21wbGV0ZWRcbiAgICAgICAgIyAgICAgLCBtZXNzYWdlLCB0aW1lb3V0KVxuICAgICAgICAjXG4gICAgICAgICMgd2FpdHNGb3JSdW5zKChjYikgLT5cbiAgICAgICAgIyAgICAgY29uc29sZS5sb2coJ3dhaXRzRm9yUnVucycsIGNiKVxuICAgICAgICAjICAgICBzZXRUaW1lb3V0KGNiLCAyMDAwKVxuICAgICAgICAjICwgXCJXYWl0aW5nIGZvciBiZWF1dGlmaWNhdGlvbiB0byBjb21wbGV0ZVwiLCA1MDAwKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBzaG91bGRSZWplY3Q6IHRydWUsIC0+XG4gICAgICAgICAgcCA9IGJlYXV0aWZpZXIucnVuKFwicHJvZ3JhbVwiLCBbXSlcbiAgICAgICAgICBleHBlY3QocCkubm90LnRvQmUobnVsbClcbiAgICAgICAgICBleHBlY3QocCBpbnN0YW5jZW9mIGJlYXV0aWZpZXIuUHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nKHYpXG4gICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIilcbiAgICAgICAgICAgIGV4cGVjdCh0eXBlb2Ygdi5kZXNjcmlwdGlvbikudG9CZShcInN0cmluZ1wiLCBcXFxuICAgICAgICAgICAgICAnRXJyb3Igc2hvdWxkIGhhdmUgYSBkZXNjcmlwdGlvbi4nKVxuICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgLmluZGV4T2YoXCJFeGVjdXRhYmxlIC0gQmVhdXRpZmllciAtIFBhdGhcIikpLnRvQmUoLTEsIFxcXG4gICAgICAgICAgICAgIFwiRXJyb3Igc2hvdWxkIG5vdCBoYXZlIHBhdGhPcHRpb24uXCIpXG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgIHAudGhlbihjYiwgY2IpXG4gICAgICAgICAgcmV0dXJuIHBcblxuICAgICAgaXQgXCJzaG91bGQgZXJyb3Igd2l0aCBoZWxwIGRlc2NyaXB0aW9uIFxcXG4gICAgICAgICAgICAgICAgd2hlbiBiZWF1dGlmaWVyJ3MgcHJvZ3JhbSBub3QgZm91bmRcIiwgLT5cbiAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIpLm5vdC50b0JlKG51bGwpXG4gICAgICAgIGV4cGVjdChiZWF1dGlmaWVyIGluc3RhbmNlb2YgQmVhdXRpZmllcikudG9CZSh0cnVlKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBzaG91bGRSZWplY3Q6IHRydWUsIC0+XG4gICAgICAgICAgaGVscCA9IHtcbiAgICAgICAgICAgIGxpbms6IFwiaHR0cDovL3Rlc3QuY29tXCJcbiAgICAgICAgICAgIHByb2dyYW06IFwidGVzdC1wcm9ncmFtXCJcbiAgICAgICAgICAgIHBhdGhPcHRpb246IFwiTGFuZyAtIFRlc3QgUHJvZ3JhbSBQYXRoXCJcbiAgICAgICAgICB9XG4gICAgICAgICAgcCA9IGJlYXV0aWZpZXIucnVuKFwicHJvZ3JhbVwiLCBbXSwgaGVscDogaGVscClcbiAgICAgICAgICBleHBlY3QocCkubm90LnRvQmUobnVsbClcbiAgICAgICAgICBleHBlY3QocCBpbnN0YW5jZW9mIGJlYXV0aWZpZXIuUHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nKHYpXG4gICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIilcbiAgICAgICAgICAgIGV4cGVjdCh2LmRlc2NyaXB0aW9uKS5ub3QudG9CZShudWxsKVxuICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb24uaW5kZXhPZihoZWxwLmxpbmspKS5ub3QudG9CZSgtMSlcbiAgICAgICAgICAgIGV4cGVjdCh2LmRlc2NyaXB0aW9uLmluZGV4T2YoaGVscC5wcm9ncmFtKSkubm90LnRvQmUoLTEpXG4gICAgICAgICAgICBleHBlY3Qodi5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAuaW5kZXhPZihoZWxwLnBhdGhPcHRpb24pKS5ub3QudG9CZSgtMSwgXFxcbiAgICAgICAgICAgICAgXCJFcnJvciBzaG91bGQgaGF2ZSBhIGRlc2NyaXB0aW9uLlwiKVxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICBwLnRoZW4oY2IsIGNiKVxuICAgICAgICAgIHJldHVybiBwXG5cbiAgICAgIGl0IFwic2hvdWxkIGVycm9yIHdpdGggV2luZG93cy1zcGVjaWZpYyBoZWxwIGRlc2NyaXB0aW9uIFxcXG4gICAgICAgICAgICAgICAgd2hlbiBiZWF1dGlmaWVyJ3MgcHJvZ3JhbSBub3QgZm91bmRcIiwgLT5cbiAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIpLm5vdC50b0JlKG51bGwpXG4gICAgICAgIGV4cGVjdChiZWF1dGlmaWVyIGluc3RhbmNlb2YgQmVhdXRpZmllcikudG9CZSh0cnVlKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSBzaG91bGRSZWplY3Q6IHRydWUsIC0+XG4gICAgICAgICAgaGVscCA9IHtcbiAgICAgICAgICAgIGxpbms6IFwiaHR0cDovL3Rlc3QuY29tXCJcbiAgICAgICAgICAgIHByb2dyYW06IFwidGVzdC1wcm9ncmFtXCJcbiAgICAgICAgICAgIHBhdGhPcHRpb246IFwiTGFuZyAtIFRlc3QgUHJvZ3JhbSBQYXRoXCJcbiAgICAgICAgICB9XG4gICAgICAgICAgIyBGb3JjZSB0byBiZSBXaW5kb3dzXG4gICAgICAgICAgRXhlY3V0YWJsZS5pc1dpbmRvd3MgPSAoKSAtPnRydWVcbiAgICAgICAgICB0ZXJtaW5hbCA9ICdDTUQgcHJvbXB0J1xuICAgICAgICAgIHdoaWNoQ21kID0gXCJ3aGVyZS5leGVcIlxuICAgICAgICAgICMgUHJvY2Vzc1xuICAgICAgICAgIHAgPSBiZWF1dGlmaWVyLnJ1bihcInByb2dyYW1cIiwgW10sIGhlbHA6IGhlbHApXG4gICAgICAgICAgZXhwZWN0KHApLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgZXhwZWN0KHAgaW5zdGFuY2VvZiBiZWF1dGlmaWVyLlByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBjYiA9ICh2KSAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiLCB2LCB2LmRlc2NyaXB0aW9uKVxuICAgICAgICAgICAgZXhwZWN0KHYpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgICBleHBlY3QodiBpbnN0YW5jZW9mIEVycm9yKS50b0JlKHRydWUpXG4gICAgICAgICAgICBleHBlY3Qodi5jb2RlKS50b0JlKFwiQ29tbWFuZE5vdEZvdW5kXCIpXG4gICAgICAgICAgICBleHBlY3Qodi5kZXNjcmlwdGlvbikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdCh2LmRlc2NyaXB0aW9uLmluZGV4T2YoaGVscC5saW5rKSkubm90LnRvQmUoLTEpXG4gICAgICAgICAgICBleHBlY3Qodi5kZXNjcmlwdGlvbi5pbmRleE9mKGhlbHAucHJvZ3JhbSkpLm5vdC50b0JlKC0xKVxuICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgLmluZGV4T2YoaGVscC5wYXRoT3B0aW9uKSkubm90LnRvQmUoLTEsIFxcXG4gICAgICAgICAgICAgIFwiRXJyb3Igc2hvdWxkIGhhdmUgYSBkZXNjcmlwdGlvbi5cIilcbiAgICAgICAgICAgIGV4cGVjdCh2LmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgIC5pbmRleE9mKHRlcm1pbmFsKSkubm90LnRvQmUoLTEsIFxcXG4gICAgICAgICAgICAgIFwiRXJyb3Igc2hvdWxkIGhhdmUgYSBkZXNjcmlwdGlvbiBpbmNsdWRpbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnI3t0ZXJtaW5hbH0nIGluIG1lc3NhZ2UuXCIpXG4gICAgICAgICAgICBleHBlY3Qodi5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAuaW5kZXhPZih3aGljaENtZCkpLm5vdC50b0JlKC0xLCBcXFxuICAgICAgICAgICAgICBcIkVycm9yIHNob3VsZCBoYXZlIGEgZGVzY3JpcHRpb24gaW5jbHVkaW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyN7d2hpY2hDbWR9JyBpbiBtZXNzYWdlLlwiKVxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICBwLnRoZW4oY2IsIGNiKVxuICAgICAgICAgIHJldHVybiBwXG5cbiAgICAgIHVubGVzcyBpc1dpbmRvd3NcbiAgICAgICAgaXQgXCJzaG91bGQgZXJyb3Igd2l0aCBNYWMvTGludXgtc3BlY2lmaWMgaGVscCBkZXNjcmlwdGlvbiBcXFxuICAgICAgICAgICAgICAgICAgd2hlbiBiZWF1dGlmaWVyJ3MgcHJvZ3JhbSBub3QgZm91bmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoYmVhdXRpZmllcikubm90LnRvQmUobnVsbClcbiAgICAgICAgICBleHBlY3QoYmVhdXRpZmllciBpbnN0YW5jZW9mIEJlYXV0aWZpZXIpLnRvQmUodHJ1ZSlcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSBzaG91bGRSZWplY3Q6IHRydWUsIC0+XG4gICAgICAgICAgICBoZWxwID0ge1xuICAgICAgICAgICAgICBsaW5rOiBcImh0dHA6Ly90ZXN0LmNvbVwiXG4gICAgICAgICAgICAgIHByb2dyYW06IFwidGVzdC1wcm9ncmFtXCJcbiAgICAgICAgICAgICAgcGF0aE9wdGlvbjogXCJMYW5nIC0gVGVzdCBQcm9ncmFtIFBhdGhcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIyBGb3JjZSB0byBiZSBNYWMvTGludXggKG5vdCBXaW5kb3dzKVxuICAgICAgICAgICAgRXhlY3V0YWJsZS5pc1dpbmRvd3MgPSAoKSAtPmZhbHNlXG4gICAgICAgICAgICB0ZXJtaW5hbCA9IFwiVGVybWluYWxcIlxuICAgICAgICAgICAgd2hpY2hDbWQgPSBcIndoaWNoXCJcbiAgICAgICAgICAgICMgUHJvY2Vzc1xuICAgICAgICAgICAgcCA9IGJlYXV0aWZpZXIucnVuKFwicHJvZ3JhbVwiLCBbXSwgaGVscDogaGVscClcbiAgICAgICAgICAgIGV4cGVjdChwKS5ub3QudG9CZShudWxsKVxuICAgICAgICAgICAgZXhwZWN0KHAgaW5zdGFuY2VvZiBiZWF1dGlmaWVyLlByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAgICMgY29uc29sZS5sb2codilcbiAgICAgICAgICAgICAgZXhwZWN0KHYpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgICAgZXhwZWN0KHYuY29kZSkudG9CZShcIkNvbW1hbmROb3RGb3VuZFwiKVxuICAgICAgICAgICAgICBleHBlY3Qodi5kZXNjcmlwdGlvbikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb24uaW5kZXhPZihoZWxwLmxpbmspKS5ub3QudG9CZSgtMSlcbiAgICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb24uaW5kZXhPZihoZWxwLnByb2dyYW0pKS5ub3QudG9CZSgtMSlcbiAgICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAuaW5kZXhPZih0ZXJtaW5hbCkpLm5vdC50b0JlKC0xLCBcXFxuICAgICAgICAgICAgICAgIFwiRXJyb3Igc2hvdWxkIGhhdmUgYSBkZXNjcmlwdGlvbiBpbmNsdWRpbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcje3Rlcm1pbmFsfScgaW4gbWVzc2FnZS5cIilcbiAgICAgICAgICAgICAgZXhwZWN0KHYuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAuaW5kZXhPZih3aGljaENtZCkpLm5vdC50b0JlKC0xLCBcXFxuICAgICAgICAgICAgICAgIFwiRXJyb3Igc2hvdWxkIGhhdmUgYSBkZXNjcmlwdGlvbiBpbmNsdWRpbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcje3doaWNoQ21kfScgaW4gbWVzc2FnZS5cIilcbiAgICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICAgIHAudGhlbihjYiwgY2IpXG4gICAgICAgICAgICByZXR1cm4gcFxuXG4gIGRlc2NyaWJlIFwiT3B0aW9uc1wiLCAtPlxuXG4gICAgZWRpdG9yID0gbnVsbFxuICAgIGJlYXV0aWZpZXIgPSBudWxsXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBiZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCkudGhlbiAoZSkgLT5cbiAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJcIilcblxuICAgIGRlc2NyaWJlIFwiTWlncmF0ZSBTZXR0aW5nc1wiLCAtPlxuXG4gICAgICBtaWdyYXRlU2V0dGluZ3MgPSAoYmVmb3JlS2V5LCBhZnRlcktleSwgdmFsKSAtPlxuICAgICAgICAjIHNldCBvbGQgb3B0aW9uc1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7YmVmb3JlS2V5fVwiLCB2YWwpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgXCJhdG9tLWJlYXV0aWZ5Om1pZ3JhdGUtc2V0dGluZ3NcIlxuICAgICAgICAjIENoZWNrIHJlc3VsdGluZyBjb25maWdcbiAgICAgICAgZXhwZWN0KF8uaGFzKGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpLCBiZWZvcmVLZXkpKS50b0JlKGZhbHNlKVxuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2FmdGVyS2V5fVwiKSkudG9CZSh2YWwpXG5cbiAgICAgIGl0IFwic2hvdWxkIG1pZ3JhdGUganNfaW5kZW50X3NpemUgdG8ganMuaW5kZW50X3NpemVcIiwgLT5cbiAgICAgICAgbWlncmF0ZVNldHRpbmdzKFwianNfaW5kZW50X3NpemVcIixcImpzLmluZGVudF9zaXplXCIsIDEpXG4gICAgICAgIG1pZ3JhdGVTZXR0aW5ncyhcImpzX2luZGVudF9zaXplXCIsXCJqcy5pbmRlbnRfc2l6ZVwiLCAxMClcblxuICAgICAgaXQgXCJzaG91bGQgbWlncmF0ZSBhbmFseXRpY3MgdG8gZ2VuZXJhbC5hbmFseXRpY3NcIiwgLT5cbiAgICAgICAgbWlncmF0ZVNldHRpbmdzKFwiYW5hbHl0aWNzXCIsXCJnZW5lcmFsLmFuYWx5dGljc1wiLCB0cnVlKVxuICAgICAgICBtaWdyYXRlU2V0dGluZ3MoXCJhbmFseXRpY3NcIixcImdlbmVyYWwuYW5hbHl0aWNzXCIsIGZhbHNlKVxuXG4gICAgICBpdCBcInNob3VsZCBtaWdyYXRlIF9hbmFseXRpY3NVc2VySWQgdG8gZ2VuZXJhbC5fYW5hbHl0aWNzVXNlcklkXCIsIC0+XG4gICAgICAgIG1pZ3JhdGVTZXR0aW5ncyhcIl9hbmFseXRpY3NVc2VySWRcIixcImdlbmVyYWwuX2FuYWx5dGljc1VzZXJJZFwiLCBcInVzZXJpZFwiKVxuICAgICAgICBtaWdyYXRlU2V0dGluZ3MoXCJfYW5hbHl0aWNzVXNlcklkXCIsXCJnZW5lcmFsLl9hbmFseXRpY3NVc2VySWRcIiwgXCJ1c2VyaWQyXCIpXG5cbiAgICAgIGl0IFwic2hvdWxkIG1pZ3JhdGUgbGFuZ3VhZ2VfanNfZGlzYWJsZWQgdG8ganMuZGlzYWJsZWRcIiwgLT5cbiAgICAgICAgbWlncmF0ZVNldHRpbmdzKFwibGFuZ3VhZ2VfanNfZGlzYWJsZWRcIixcImpzLmRpc2FibGVkXCIsIGZhbHNlKVxuICAgICAgICBtaWdyYXRlU2V0dGluZ3MoXCJsYW5ndWFnZV9qc19kaXNhYmxlZFwiLFwianMuZGlzYWJsZWRcIiwgdHJ1ZSlcblxuICAgICAgaXQgXCJzaG91bGQgbWlncmF0ZSBsYW5ndWFnZV9qc19kZWZhdWx0X2JlYXV0aWZpZXIgdG8ganMuZGVmYXVsdF9iZWF1dGlmaWVyXCIsIC0+XG4gICAgICAgIG1pZ3JhdGVTZXR0aW5ncyhcImxhbmd1YWdlX2pzX2RlZmF1bHRfYmVhdXRpZmllclwiLFwianMuZGVmYXVsdF9iZWF1dGlmaWVyXCIsIFwiUHJldHR5IERpZmZcIilcbiAgICAgICAgbWlncmF0ZVNldHRpbmdzKFwibGFuZ3VhZ2VfanNfZGVmYXVsdF9iZWF1dGlmaWVyXCIsXCJqcy5kZWZhdWx0X2JlYXV0aWZpZXJcIiwgXCJKUyBCZWF1dGlmeVwiKVxuXG4gICAgICBpdCBcInNob3VsZCBtaWdyYXRlIGxhbmd1YWdlX2pzX2JlYXV0aWZ5X29uX3NhdmUgdG8ganMuYmVhdXRpZnlfb25fc2F2ZVwiLCAtPlxuICAgICAgICBtaWdyYXRlU2V0dGluZ3MoXCJsYW5ndWFnZV9qc19iZWF1dGlmeV9vbl9zYXZlXCIsXCJqcy5iZWF1dGlmeV9vbl9zYXZlXCIsIHRydWUpXG4gICAgICAgIG1pZ3JhdGVTZXR0aW5ncyhcImxhbmd1YWdlX2pzX2JlYXV0aWZ5X29uX3NhdmVcIixcImpzLmJlYXV0aWZ5X29uX3NhdmVcIiwgZmFsc2UpXG5cbiAgICBiZWF1dGlmeUVkaXRvciA9IChjYWxsYmFjaykgLT5cbiAgICAgIGlzQ29tcGxldGUgPSBmYWxzZVxuICAgICAgYmVmb3JlVGV4dCA9IG51bGxcbiAgICAgIGRlbGF5ID0gNTAwXG4gICAgICBydW5zIC0+XG4gICAgICAgIGJlZm9yZVRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWVkaXRvclwiXG4gICAgICAgIHNldFRpbWVvdXQoLT5cbiAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZVxuICAgICAgICAsIGRlbGF5KVxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgaXNDb21wbGV0ZVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGFmdGVyVGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBiZWZvcmVUZXh0KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICBleHBlY3QodHlwZW9mIGFmdGVyVGV4dCkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGJlZm9yZVRleHQsIGFmdGVyVGV4dClcblxuICAgIGRlc2NyaWJlIFwiSmF2YVNjcmlwdFwiLCAtPlxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgcGFja05hbWUgPSAnbGFuZ3VhZ2UtamF2YXNjcmlwdCdcbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShwYWNrTmFtZSlcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgIyBTZXR1cCBFZGl0b3JcbiAgICAgICAgICBjb2RlID0gXCJ2YXIgaGVsbG89J3dvcmxkJztmdW5jdGlvbigpe2NvbnNvbGUubG9nKCdoZWxsbyAnK2hlbGxvKX1cIlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KGNvZGUpXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhhdG9tLmdyYW1tYXJzLmdyYW1tYXJzQnlTY29wZU5hbWUpXG4gICAgICAgICAgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcignc291cmNlLmpzJylcbiAgICAgICAgICBleHBlY3QoZ3JhbW1hci5uYW1lKS50b0JlKCdKYXZhU2NyaXB0JylcbiAgICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihncmFtbWFyKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUpLnRvQmUoJ0phdmFTY3JpcHQnKVxuXG4gICAgICAgICAgIyBTZWUgaHR0cHM6Ly9kaXNjdXNzLmF0b20uaW8vdC9zb2x2ZWQtc2V0dGltZW91dC1ub3Qtd29ya2luZy1maXJpbmctaW4tc3BlY3MtdGVzdHMvMTE0MjcvMTdcbiAgICAgICAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKVxuXG4gICAgICAjIGFmdGVyRWFjaCAtPlxuICAgICAgIyAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2VzKClcbiAgICAgICMgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICAgICAgZGVzY3JpYmUgXCIuanNiZWF1dGlmeXJjXCIsIC0+XG5cbiAgICAgICAgaXQgXCJzaG91bGQgbG9vayBhdCBkaXJlY3RvcmllcyBhYm92ZSBmaWxlXCIsIC0+XG4gICAgICAgICAgaXNEb25lID0gZmFsc2VcbiAgICAgICAgICBjYiA9IChlcnIpIC0+XG4gICAgICAgICAgICBpc0RvbmUgPSB0cnVlXG4gICAgICAgICAgICBleHBlY3QoZXJyKS50b0JlKHVuZGVmaW5lZClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygncnVucycpXG4gICAgICAgICAgICAgICMgTWFrZSB0b3AgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIHRlbXAubWtkaXIoJ2RpcjEnLCAoZXJyLCBkaXJQYXRoKSAtPlxuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICAgICAgICAgICMgQWRkIC5qc2JlYXV0aWZ5cmMgZmlsZVxuICAgICAgICAgICAgICAgIHJjUGF0aCA9IHBhdGguam9pbihkaXJQYXRoLCAnLmpzYmVhdXRpZnlyYycpXG4gICAgICAgICAgICAgICAgbXlEYXRhMSA9IHtcbiAgICAgICAgICAgICAgICAgIGluZGVudF9zaXplOiAxLFxuICAgICAgICAgICAgICAgICAgaW5kZW50X2NoYXI6ICdcXHQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG15RGF0YSA9IEpTT04uc3RyaW5naWZ5KG15RGF0YTEpXG4gICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKHJjUGF0aCwgbXlEYXRhLCAoZXJyKSAtPlxuICAgICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICAgICAgICAgICAgICAgICMgTWFrZSBuZXh0IGRpcmVjdG9yeVxuICAgICAgICAgICAgICAgICAgZGlyUGF0aCA9IHBhdGguam9pbihkaXJQYXRoLCAnZGlyMicpXG4gICAgICAgICAgICAgICAgICBmcy5ta2RpcihkaXJQYXRoLCAoZXJyKSAtPlxuICAgICAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICAgICAgICAgICAgICAgICMgQWRkIC5qc2JlYXV0aWZ5cmMgZmlsZVxuICAgICAgICAgICAgICAgICAgICByY1BhdGggPSBwYXRoLmpvaW4oZGlyUGF0aCwgJy5qc2JlYXV0aWZ5cmMnKVxuICAgICAgICAgICAgICAgICAgICBteURhdGEyID0ge1xuICAgICAgICAgICAgICAgICAgICAgIGluZGVudF9zaXplOiAyLFxuICAgICAgICAgICAgICAgICAgICAgIGluZGVudF9jaGFyOiAnICdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBteURhdGEgPSBKU09OLnN0cmluZ2lmeShteURhdGEyKVxuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGUocmNQYXRoLCBteURhdGEsIChlcnIpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChyY1BhdGgsIG51bGwpKVxuICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChhbGxPcHRpb25zKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnYWxsT3B0aW9ucycsIGFsbE9wdGlvbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgRXh0cmFjdCBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ09wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob21lT3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvckNvbmZpZ09wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIF0gPSBhbGxPcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0T3B0aW9ucyA9IGFsbE9wdGlvbnNbNC4uXVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIENoZWNrIHRoYXQgd2UgZXh0cmFjdGVkIC5qc2JlYXV0aWZ5cmMgZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjb25maWcxLCBjb25maWcyXSA9IHByb2plY3RPcHRpb25zWy0yLi5dXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChfLmdldChjb25maWcxLCdfZGVmYXVsdC5pbmRlbnRfc2l6ZScpKS50b0JlKG15RGF0YTEuaW5kZW50X3NpemUpXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXy5nZXQoY29uZmlnMiwnX2RlZmF1bHQuaW5kZW50X3NpemUnKSkudG9CZShteURhdGEyLmluZGVudF9zaXplKVxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KF8uZ2V0KGNvbmZpZzEsJ19kZWZhdWx0LmluZGVudF9jaGFyJykpLnRvQmUobXlEYXRhMS5pbmRlbnRfY2hhcilcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChfLmdldChjb25maWcyLCdfZGVmYXVsdC5pbmRlbnRfY2hhcicpKS50b0JlKG15RGF0YTIuaW5kZW50X2NoYXIpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgICAgICBjYihlcnIpXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGlzRG9uZVxuXG5cbiAgICAgIGRlc2NyaWJlIFwiUGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuXG4gICAgICAgIGdldE9wdGlvbnMgPSAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgb3B0aW9ucyA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2coJ2JlYXV0aWZpZXInLCBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoLCBiZWF1dGlmaWVyKVxuICAgICAgICAgICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgobnVsbCwgbnVsbClcbiAgICAgICAgICAgICMgUmVzb2x2ZSBvcHRpb25zIHdpdGggcHJvbWlzZXNcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChhbGxPcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oKGFsbE9wdGlvbnMpIC0+XG4gICAgICAgICAgICAgIG9wdGlvbnMgPSBhbGxPcHRpb25zXG4gICAgICAgICAgICApXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgY2FsbGJhY2sob3B0aW9ucylcblxuICAgICAgICBpdCBcInNob3VsZCBjaGFuZ2UgaW5kZW50X3NpemUgdG8gMVwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1iZWF1dGlmeS5qcy5pbmRlbnRfc2l6ZScsIDEpXG5cbiAgICAgICAgICBnZXRPcHRpb25zIChhbGxPcHRpb25zKSAtPlxuICAgICAgICAgICAgZXhwZWN0KHR5cGVvZiBhbGxPcHRpb25zKS50b0JlKCdvYmplY3QnKVxuICAgICAgICAgICAgY29uZmlnT3B0aW9ucyA9IGFsbE9wdGlvbnNbMV1cbiAgICAgICAgICAgIGV4cGVjdCh0eXBlb2YgY29uZmlnT3B0aW9ucykudG9CZSgnb2JqZWN0JylcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdPcHRpb25zLmpzLmluZGVudF9zaXplKS50b0JlKDEpXG5cbiAgICAgICAgICAgIGJlYXV0aWZ5RWRpdG9yIChiZWZvcmVUZXh0LCBhZnRlclRleHQpIC0+XG4gICAgICAgICAgICAgICMgY29uc29sZS5sb2coYmVmb3JlVGV4dCwgYWZ0ZXJUZXh0LCBlZGl0b3IpXG4gICAgICAgICAgICAgIGV4cGVjdChhZnRlclRleHQpLnRvQmUoXCJcIlwidmFyIGhlbGxvID0gJ3dvcmxkJztcblxuICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoZWxsbyAnICsgaGVsbG8pXG4gICAgICAgICAgICAgIH1cIlwiXCIpXG5cbiAgICAgICAgaXQgXCJzaG91bGQgY2hhbmdlIGluZGVudF9zaXplIHRvIDEwXCIsIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLWJlYXV0aWZ5LmpzLmluZGVudF9zaXplJywgMTApXG5cbiAgICAgICAgICBnZXRPcHRpb25zIChhbGxPcHRpb25zKSAtPlxuICAgICAgICAgICAgZXhwZWN0KHR5cGVvZiBhbGxPcHRpb25zKS50b0JlKCdvYmplY3QnKVxuICAgICAgICAgICAgY29uZmlnT3B0aW9ucyA9IGFsbE9wdGlvbnNbMV1cbiAgICAgICAgICAgIGV4cGVjdCh0eXBlb2YgY29uZmlnT3B0aW9ucykudG9CZSgnb2JqZWN0JylcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdPcHRpb25zLmpzLmluZGVudF9zaXplKS50b0JlKDEwKVxuXG4gICAgICAgICAgICBiZWF1dGlmeUVkaXRvciAoYmVmb3JlVGV4dCwgYWZ0ZXJUZXh0KSAtPlxuICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nKGJlZm9yZVRleHQsIGFmdGVyVGV4dCwgZWRpdG9yKVxuICAgICAgICAgICAgICBleHBlY3QoYWZ0ZXJUZXh0KS50b0JlKFwiXCJcInZhciBoZWxsbyA9ICd3b3JsZCc7XG5cbiAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8gJyArIGhlbGxvKVxuICAgICAgICAgICAgICB9XCJcIlwiKVxuXG5cbmRlc2NyaWJlIFwiTGFuZ3VhZ2VzXCIsIC0+XG5cbiAgbGFuZ3VhZ2VzID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBsYW5ndWFnZXMgPSBuZXcgTGFuZ3VhZ2VzKClcblxuICBkZXNjcmliZSBcIkxhbmd1YWdlczo6bmFtZXNwYWNlXCIsIC0+XG5cbiAgICBpdCBcInNob3VsZCB2ZXJpZnkgdGhhdCBtdWx0aXBsZSBsYW5ndWFnZXMgZG8gbm90IHNoYXJlIHRoZSBzYW1lIG5hbWVzcGFjZVwiLCAtPlxuXG4gICAgICBuYW1lc3BhY2VHcm91cHMgPSBfLmdyb3VwQnkobGFuZ3VhZ2VzLmxhbmd1YWdlcywgXCJuYW1lc3BhY2VcIilcbiAgICAgIG5hbWVzcGFjZVBhaXJzID0gXy50b1BhaXJzKG5hbWVzcGFjZUdyb3VwcylcbiAgICAgIG5hbWVzcGFjZU92ZXJsYXAgPSBfLmZpbHRlcihuYW1lc3BhY2VQYWlycywgKFtuYW1lc3BhY2UsIGdyb3VwXSkgLT4gZ3JvdXAubGVuZ3RoID4gMSlcbiAgICAgICMgY29uc29sZS5sb2coJ25hbWVzcGFjZXMnLCBuYW1lc3BhY2VHcm91cHMsIG5hbWVzcGFjZVBhaXJzLCBuYW1lc3BhY2VPdmVybGFwKVxuICAgICAgZXhwZWN0KG5hbWVzcGFjZU92ZXJsYXAubGVuZ3RoKS50b0JlKDAsIFxcXG4gICAgICAgIFwiTGFuZ3VhZ2UgbmFtZXNwYWNlcyBhcmUgb3ZlcmxhcHBpbmcuXFxuXFxcbiAgICAgICAgTmFtZXNwYWNlcyBhcmUgdW5pcXVlOiBvbmx5IG9uZSBsYW5ndWFnZSBmb3IgZWFjaCBuYW1lc3BhY2UuXFxuXCIrXG4gICAgICAgIF8ubWFwKG5hbWVzcGFjZU92ZXJsYXAsIChbbmFtZXNwYWNlLCBncm91cF0pIC0+IFwiLSAnI3tuYW1lc3BhY2V9JzogQ2hlY2sgbGFuZ3VhZ2VzICN7Xy5tYXAoZ3JvdXAsICduYW1lJykuam9pbignLCAnKX0gZm9yIHVzaW5nIG5hbWVzcGFjZSAnI3tuYW1lc3BhY2V9Jy5cIikuam9pbignXFxuJylcbiAgICAgICAgKVxuIl19

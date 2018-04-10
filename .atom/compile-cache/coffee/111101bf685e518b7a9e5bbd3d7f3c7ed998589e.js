(function() {
  var Beautifier, Executable, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  Executable = require("../src/beautifiers/executable");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
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
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier, execSpawn;
      beautifier = null;
      execSpawn = null;
      beforeEach(function() {
        beautifier = new PHPCSFixer();
        return execSpawn = Executable.prototype.spawn;
      });
      afterEach(function() {
        return Executable.prototype.spawn = execSpawn;
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            Executable.prototype.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.loadExecutables().then(function() {
              return beautifier.beautify(text, language, options);
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!Executable.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              Executable.prototype.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.loadExecutables().then(function() {
                return beautifier.beautify(text, language, options);
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('PHP');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return Executable.isWindows = function() {
              return false;
            };
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return Executable.isWindows = function() {
            return true;
          };
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NwZWMvYmVhdXRpZmllci1waHAtY3MtZml4ZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsaUNBQVI7O0VBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSwrQkFBUjs7RUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFRUCxTQUFBLEdBQVksT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBcEIsSUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsUUFEWixJQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQjs7RUFFeEIsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7SUFFbEMsVUFBQSxDQUFXLFNBQUE7YUFHVCxlQUFBLENBQWdCLFNBQUE7QUFDZCxZQUFBO1FBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCO1FBRXBCLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CO1FBQ1AsSUFBSSxDQUFDLFdBQUwsQ0FBQTtRQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEIsRUFBcUQsTUFBckQ7QUFFQSxlQUFPO01BUk8sQ0FBaEI7SUFIUyxDQUFYO1dBYUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7QUFFL0IsVUFBQTtNQUFBLFVBQUEsR0FBYTtNQUNiLFNBQUEsR0FBWTtNQUVaLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQTtlQUVqQixTQUFBLEdBQVksVUFBVSxDQUFDLFNBQVMsQ0FBQztNQUh4QixDQUFY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LENBQU8sQ0FBUCxDQUFTLENBQUMsR0FBRyxDQUFDLElBQWQsQ0FBbUIsSUFBbkI7Y0FDQSxNQUFBLENBQU8sQ0FBQSxZQUFhLFVBQVUsQ0FBQyxPQUEvQixDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDO2NBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQVcsRUFBWDtBQUNBLHFCQUFPO1lBNUMyQixDQUFwQztVQVJvRCxDQUF0RDtRQURpQjtlQXVEbkIsZ0JBQUEsQ0FBaUIsS0FBakI7TUExRmdCO01BNkZsQixJQUFBLENBQU8sU0FBUDtRQUNFLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUE7VUFFcEIsVUFBQSxDQUFXLFNBQUE7bUJBRVQsVUFBVSxDQUFDLFNBQVgsR0FBdUIsU0FBQTtxQkFBTTtZQUFOO1VBRmQsQ0FBWDtpQkFJRyxlQUFILENBQUE7UUFOb0IsQ0FBdEIsRUFERjs7YUFTQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO1FBRWxCLFVBQUEsQ0FBVyxTQUFBO2lCQUVULFVBQVUsQ0FBQyxTQUFYLEdBQXVCLFNBQUE7bUJBQU07VUFBTjtRQUZkLENBQVg7ZUFJRyxlQUFILENBQUE7TUFOa0IsQ0FBcEI7SUFuSCtCLENBQWpDO0VBZmtDLENBQXBDO0FBZkEiLCJzb3VyY2VzQ29udGVudCI6WyJQSFBDU0ZpeGVyID0gcmVxdWlyZSBcIi4uL3NyYy9iZWF1dGlmaWVycy9waHAtY3MtZml4ZXJcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUgXCIuLi9zcmMvYmVhdXRpZmllcnMvYmVhdXRpZmllclwiXG5FeGVjdXRhYmxlID0gcmVxdWlyZSBcIi4uL3NyYy9iZWF1dGlmaWVycy9leGVjdXRhYmxlXCJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG4jIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbiNcbiMgVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4jIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbiMgQ2hlY2sgaWYgV2luZG93c1xuaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIG9yXG4gIHByb2Nlc3MuZW52Lk9TVFlQRSBpcyAnY3lnd2luJyBvclxuICBwcm9jZXNzLmVudi5PU1RZUEUgaXMgJ21zeXMnXG5cbmRlc2NyaWJlIFwiUEhQLUNTLUZpeGVyIEJlYXV0aWZpZXJcIiwgLT5cblxuICBiZWZvcmVFYWNoIC0+XG5cbiAgICAjIEFjdGl2YXRlIHBhY2thZ2VcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tYmVhdXRpZnknKVxuICAgICAgIyBGb3JjZSBhY3RpdmF0ZSBwYWNrYWdlXG4gICAgICBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKFwiYXRvbS1iZWF1dGlmeVwiKVxuICAgICAgcGFjay5hY3RpdmF0ZU5vdygpXG4gICAgICAjIENoYW5nZSBsb2dnZXIgbGV2ZWxcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1iZWF1dGlmeS5nZW5lcmFsLmxvZ2dlckxldmVsJywgJ2luZm8nKVxuICAgICAgIyBSZXR1cm4gcHJvbWlzZVxuICAgICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlXG5cbiAgZGVzY3JpYmUgXCJCZWF1dGlmaWVyOjpiZWF1dGlmeVwiLCAtPlxuXG4gICAgYmVhdXRpZmllciA9IG51bGxcbiAgICBleGVjU3Bhd24gPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBiZWF1dGlmaWVyID0gbmV3IFBIUENTRml4ZXIoKVxuICAgICAgIyBjb25zb2xlLmxvZygnbmV3IGJlYXV0aWZpZXInKVxuICAgICAgZXhlY1NwYXduID0gRXhlY3V0YWJsZS5wcm90b3R5cGUuc3Bhd25cblxuICAgIGFmdGVyRWFjaCAtPlxuICAgICAgRXhlY3V0YWJsZS5wcm90b3R5cGUuc3Bhd24gPSBleGVjU3Bhd25cblxuICAgIE9TU3BlY2lmaWNTcGVjcyA9IC0+XG4gICAgICB0ZXh0ID0gXCI8P3BocCBlY2hvIFxcXCJ0ZXN0XFxcIjsgPz5cIlxuXG4gICAgICBpdCBcInNob3VsZCBlcnJvciB3aGVuIGJlYXV0aWZpZXIncyBwcm9ncmFtIG5vdCBmb3VuZFwiLCAtPlxuICAgICAgICBleHBlY3QoYmVhdXRpZmllcikubm90LnRvQmUobnVsbClcbiAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyKS50b0JlKHRydWUpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIHNob3VsZFJlamVjdDogdHJ1ZSwgLT5cbiAgICAgICAgICBsYW5ndWFnZSA9IFwiUEhQXCJcbiAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgZml4ZXJzOiBcIlwiXG4gICAgICAgICAgICBsZXZlbHM6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgICAgIyBNb2NrIHNwYXduXG4gICAgICAgICAgIyBiZWF1dGlmaWVyLnNwYXduXG4gICAgICAgICAgRXhlY3V0YWJsZS5wcm90b3R5cGUuc3Bhd24gPSAoZXhlLCBhcmdzLCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnc3Bhd24nLCBleGUsIGFyZ3MsIG9wdGlvbnMpXG4gICAgICAgICAgICBlciA9IG5ldyBFcnJvcignRU5PRU5UJylcbiAgICAgICAgICAgIGVyLmNvZGUgPSAnRU5PRU5UJ1xuICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZpZXIuUHJvbWlzZS5yZWplY3QoZXIpXG4gICAgICAgICAgIyBCZWF1dGlmeVxuICAgICAgICAgIHAgPSBiZWF1dGlmaWVyLmxvYWRFeGVjdXRhYmxlcygpLnRoZW4oKCkgLT4gYmVhdXRpZmllci5iZWF1dGlmeSh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykpXG4gICAgICAgICAgZXhwZWN0KHApLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgZXhwZWN0KHAgaW5zdGFuY2VvZiBiZWF1dGlmaWVyLlByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBjYiA9ICh2KSAtPlxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyh2KVxuICAgICAgICAgICAgZXhwZWN0KHYpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgICBleHBlY3QodiBpbnN0YW5jZW9mIEVycm9yKS50b0JlKHRydWUsIFxcXG4gICAgICAgICAgICAgIFwiRXhwZWN0ZWQgJyN7dn0nIHRvIGJlIGluc3RhbmNlIG9mIEVycm9yXCIpXG4gICAgICAgICAgICBleHBlY3Qodi5jb2RlKS50b0JlKFwiQ29tbWFuZE5vdEZvdW5kXCIsIFxcXG4gICAgICAgICAgICAgIFwiRXhwZWN0ZWQgdG8gYmUgQ29tbWFuZE5vdEZvdW5kXCIpXG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgIHAudGhlbihjYiwgY2IpXG4gICAgICAgICAgcmV0dXJuIHBcblxuICAgICAgZmFpbFdoaWNoUHJvZ3JhbSA9IChmYWlsaW5nUHJvZ3JhbSkgLT5cbiAgICAgICAgaXQgXCJzaG91bGQgZXJyb3Igd2hlbiAnI3tmYWlsaW5nUHJvZ3JhbX0nIG5vdCBmb3VuZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdChiZWF1dGlmaWVyKS5ub3QudG9CZShudWxsKVxuICAgICAgICAgIGV4cGVjdChiZWF1dGlmaWVyIGluc3RhbmNlb2YgQmVhdXRpZmllcikudG9CZSh0cnVlKVxuXG4gICAgICAgICAgaWYgbm90IEV4ZWN1dGFibGUuaXNXaW5kb3dzIGFuZCBmYWlsaW5nUHJvZ3JhbSBpcyBcInBocFwiXG4gICAgICAgICAgICAjIE9ubHkgYXBwbGljYWJsZSBvbiBXaW5kb3dzXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSBzaG91bGRSZWplY3Q6IHRydWUsIC0+XG4gICAgICAgICAgICBsYW5ndWFnZSA9IFwiUEhQXCJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGZpeGVyczogXCJcIlxuICAgICAgICAgICAgICBsZXZlbHM6IFwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAgICMgY29uc29sZS5sb2coJ2NiIHZhbHVlJywgdilcbiAgICAgICAgICAgICAgZXhwZWN0KHYpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSwgXFxcbiAgICAgICAgICAgICAgICBcIkV4cGVjdGVkICcje3Z9JyB0byBiZSBpbnN0YW5jZSBvZiBFcnJvclwiKVxuICAgICAgICAgICAgICBleHBlY3Qodi5jb2RlKS50b0JlKFwiQ29tbWFuZE5vdEZvdW5kXCIsIFxcXG4gICAgICAgICAgICAgICAgXCJFeHBlY3RlZCB0byBiZSBDb21tYW5kTm90Rm91bmRcIilcbiAgICAgICAgICAgICAgZXhwZWN0KHYuZmlsZSkudG9CZShmYWlsaW5nUHJvZ3JhbSlcbiAgICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICAgICMgd2hpY2ggPSBiZWF1dGlmaWVyLndoaWNoLmJpbmQoYmVhdXRpZmllcilcbiAgICAgICAgICAgIGJlYXV0aWZpZXIud2hpY2ggPSAoZXhlLCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZmllci5Qcm9taXNlLnJlc29sdmUobnVsbCkgXFxcbiAgICAgICAgICAgICAgICBpZiBub3QgZXhlP1xuICAgICAgICAgICAgICBpZiBleGUgaXMgZmFpbGluZ1Byb2dyYW1cbiAgICAgICAgICAgICAgICBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZShmYWlsaW5nUHJvZ3JhbSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICMgd2hpY2goZXhlLCBvcHRpb25zKVxuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2coJ2Zha2UgZXhlIHBhdGgnLCBleGUpXG4gICAgICAgICAgICAgICAgYmVhdXRpZmllci5Qcm9taXNlLnJlc29sdmUoXCIvI3tleGV9XCIpXG5cbiAgICAgICAgICAgICMgb2xkU3Bhd24gPSBiZWF1dGlmaWVyLnNwYXduLmJpbmQoYmVhdXRpZmllcilcbiAgICAgICAgICAgICMgYmVhdXRpZmllci5zcGF3blxuICAgICAgICAgICAgRXhlY3V0YWJsZS5wcm90b3R5cGUuc3Bhd24gPSAoZXhlLCBhcmdzLCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nKCdzcGF3bicsIGV4ZSwgYXJncywgb3B0aW9ucylcbiAgICAgICAgICAgICAgaWYgZXhlIGlzIGZhaWxpbmdQcm9ncmFtXG4gICAgICAgICAgICAgICAgZXIgPSBuZXcgRXJyb3IoJ0VOT0VOVCcpXG4gICAgICAgICAgICAgICAgZXIuY29kZSA9ICdFTk9FTlQnXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZpZXIuUHJvbWlzZS5yZWplY3QoZXIpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZmllci5Qcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgcmV0dXJuQ29kZTogMCxcbiAgICAgICAgICAgICAgICAgIHN0ZG91dDogJ3N0ZG91dCcsXG4gICAgICAgICAgICAgICAgICBzdGRlcnI6ICcnXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgcCA9IGJlYXV0aWZpZXIubG9hZEV4ZWN1dGFibGVzKCkudGhlbigoKSAtPiBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSlcbiAgICAgICAgICAgIGV4cGVjdChwKS5ub3QudG9CZShudWxsKVxuICAgICAgICAgICAgZXhwZWN0KHAgaW5zdGFuY2VvZiBiZWF1dGlmaWVyLlByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgIHAudGhlbihjYiwgY2IpXG4gICAgICAgICAgICByZXR1cm4gcFxuXG4gICAgICBmYWlsV2hpY2hQcm9ncmFtKCdQSFAnKVxuICAgICAgIyBmYWlsV2hpY2hQcm9ncmFtKCdwaHAtY3MtZml4ZXInKVxuXG4gICAgdW5sZXNzIGlzV2luZG93c1xuICAgICAgZGVzY3JpYmUgXCJNYWMvTGludXhcIiwgLT5cblxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZygnbWFjL2xpbngnKVxuICAgICAgICAgIEV4ZWN1dGFibGUuaXNXaW5kb3dzID0gKCkgLT4gZmFsc2VcblxuICAgICAgICBkbyBPU1NwZWNpZmljU3BlY3NcblxuICAgIGRlc2NyaWJlIFwiV2luZG93c1wiLCAtPlxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICMgY29uc29sZS5sb2coJ3dpbmRvd3MnKVxuICAgICAgICBFeGVjdXRhYmxlLmlzV2luZG93cyA9ICgpIC0+IHRydWVcblxuICAgICAgZG8gT1NTcGVjaWZpY1NwZWNzXG4iXX0=

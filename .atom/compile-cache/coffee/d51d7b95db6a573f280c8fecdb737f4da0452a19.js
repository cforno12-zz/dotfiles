(function() {
  var Beautifier, Executable, Promise, _, fs, path, readFile, shellEnv, temp, which;

  Promise = require('bluebird');

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp').track();

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  path = require('path');

  shellEnv = require('shell-env');

  Executable = require('./executable');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};

    Beautifier.prototype.executables = [];


    /*
    Is the beautifier a command-line interface beautifier?
     */

    Beautifier.prototype.isPreInstalled = function() {
      return this.executables.length === 0;
    };

    Beautifier.prototype._exe = {};

    Beautifier.prototype.loadExecutables = function() {
      var executables;
      this.debug("Load executables");
      if (Object.keys(this._exe).length === this.executables.length) {
        return Promise.resolve(this._exe);
      } else {
        return Promise.resolve(executables = this.executables.map(function(e) {
          return new Executable(e);
        })).then(function(executables) {
          return Promise.all(executables.map(function(exe) {
            return exe.init();
          }));
        }).then((function(_this) {
          return function(es) {
            var exe, missingInstalls;
            _this.debug("Executables loaded", es);
            exe = {};
            missingInstalls = [];
            es.forEach(function(e) {
              exe[e.cmd] = e;
              if (!e.isInstalled && e.required) {
                return missingInstalls.push(e);
              }
            });
            _this._exe = exe;
            _this.debug("exe", exe);
            if (missingInstalls.length === 0) {
              return _this._exe;
            } else {
              _this.debug("Missing required executables: " + (missingInstalls.map(function(e) {
                return e.cmd;
              }).join(' and ')) + ".");
              throw Executable.commandNotFoundError(missingInstalls[0].cmd);
            }
          };
        })(this))["catch"]((function(_this) {
          return function(error) {
            _this.debug("Error loading executables", error);
            return Promise.reject(error);
          };
        })(this));
      }
    };

    Beautifier.prototype.exe = function(cmd) {
      var e;
      console.log('exe', cmd, this._exe);
      e = this._exe[cmd];
      if (e == null) {
        throw Executable.commandNotFoundError(cmd);
      }
      return e;
    };


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var ref;
      return (ref = atom.notifications) != null ? ref.addWarning(warning) : void 0;
    };

    Beautifier.prototype.deprecateOptionForExecutable = function(exeName, oldOption, newOption) {
      var deprecationMessage;
      deprecationMessage = "The \"" + oldOption + "\" configuration option has been deprecated. Please switch to using the option in section \"Executables\" (near the top) in subsection \"" + exeName + "\" labelled \"" + newOption + "\" in Atom-Beautify package settings.";
      return this.deprecate(deprecationMessage);
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents, ext) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      if (ext == null) {
        ext = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open({
            prefix: name,
            suffix: ext
          }, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    Find file
     */

    Beautifier.prototype.findFile = function(startDir, fileNames) {
      var currentDir, fileName, filePath, i, len;
      if (!arguments.length) {
        throw new Error("Specify file names to find.");
      }
      if (!(fileNames instanceof Array)) {
        fileNames = [fileNames];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (i = 0, len = fileNames.length; i < len; i++) {
          fileName = fileNames[i];
          filePath = path.join(currentDir, fileName);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (error1) {}
        }
        startDir.pop();
      }
      return null;
    };

    Beautifier.prototype.getDefaultLineEnding = function(crlf, lf, optionEol) {
      if (!optionEol || optionEol === 'System Default') {
        optionEol = atom.config.get('line-ending-selector.defaultLineEnding');
      }
      switch (optionEol) {
        case 'LF':
          return lf;
        case 'CRLF':
          return crlf;
        case 'OS Default':
          if (process.platform === 'win32') {
            return crlf;
          } else {
            return lf;
          }
        default:
          return lf;
      }
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return Executable.which(exe, options);
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, arg) {
      var cwd, exe, help, ignoreReturnCode, onStdin, ref;
      ref = arg != null ? arg : {}, cwd = ref.cwd, ignoreReturnCode = ref.ignoreReturnCode, help = ref.help, onStdin = ref.onStdin;
      exe = new Executable({
        name: this.name,
        homepage: this.link,
        installation: this.link,
        cmd: executable
      });
      if (help == null) {
        help = {
          program: executable,
          link: this.link,
          pathOption: void 0
        };
      }
      return exe.run(args, {
        cwd: cwd,
        ignoreReturnCode: ignoreReturnCode,
        help: help,
        onStdin: onStdin
      });
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(__filename);
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          ref = this.options;
          for (lang in ref) {
            options = ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9iZWF1dGlmaWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBOztFQUNQLFFBQUEsR0FBVyxPQUFPLENBQUMsU0FBUixDQUFrQixFQUFFLENBQUMsUUFBckI7O0VBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVI7O0VBQ1gsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOztBQUVyQjs7O3lCQUdBLE9BQUEsR0FBUzs7O0FBRVQ7Ozs7eUJBR0EsSUFBQSxHQUFNOzs7QUFFTjs7Ozs7Ozs7Ozs7eUJBVUEsT0FBQSxHQUFTOzt5QkFFVCxXQUFBLEdBQWE7OztBQUViOzs7O3lCQUdBLGNBQUEsR0FBZ0IsU0FBQTthQUNkLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixLQUF1QjtJQURUOzt5QkFHaEIsSUFBQSxHQUFNOzt5QkFDTixlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxrQkFBUDtNQUNBLElBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsSUFBYixDQUFrQixDQUFDLE1BQW5CLEtBQTZCLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBN0M7ZUFDRSxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFD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Q0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCLGNBRG5CO2VBREY7YUFBQSxNQUdLLElBQUcsT0FBTyxPQUFQLEtBQWtCLFFBQXJCO2NBQ0gsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxhQUFSLEVBQXVCLE9BQXZCLEVBRGQ7YUFBQSxNQUFBO2NBR0gsSUFBQyxDQUFBLElBQUQsQ0FBTSxDQUFBLDJCQUFBLEdBQTJCLENBQUMsT0FBTyxPQUFSLENBQTNCLEdBQTJDLGdCQUEzQyxHQUEyRCxJQUEzRCxHQUFnRSxJQUFoRSxDQUFBLEdBQXFFLE9BQTNFLEVBSEc7O0FBTFAsV0FGRjtTQUpGOztNQWVBLElBQUMsQ0FBQSxPQUFELENBQVMsY0FBQSxHQUFlLElBQUMsQ0FBQSxJQUFoQixHQUFxQixHQUE5QixFQUFrQyxJQUFDLENBQUEsT0FBbkM7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVI7SUFyQkY7Ozs7O0FBM05mIiwic291cmNlc0NvbnRlbnQiOlsiUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuZnMgPSByZXF1aXJlKCdmcycpXG50ZW1wID0gcmVxdWlyZSgndGVtcCcpLnRyYWNrKClcbnJlYWRGaWxlID0gUHJvbWlzZS5wcm9taXNpZnkoZnMucmVhZEZpbGUpXG53aGljaCA9IHJlcXVpcmUoJ3doaWNoJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbnNoZWxsRW52ID0gcmVxdWlyZSgnc2hlbGwtZW52JylcbkV4ZWN1dGFibGUgPSByZXF1aXJlKCcuL2V4ZWN1dGFibGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJlYXV0aWZpZXJcblxuICAjIyNcbiAgUHJvbWlzZVxuICAjIyNcbiAgUHJvbWlzZTogUHJvbWlzZVxuXG4gICMjI1xuICBOYW1lIG9mIEJlYXV0aWZpZXJcbiAgIyMjXG4gIG5hbWU6ICdCZWF1dGlmaWVyJ1xuXG4gICMjI1xuICBTdXBwb3J0ZWQgT3B0aW9uc1xuXG4gIEVuYWJsZSBvcHRpb25zIGZvciBzdXBwb3J0ZWQgbGFuZ3VhZ2VzLlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+Ojxib29sZWFuOmFsbF9vcHRpb25zX2VuYWJsZWQ+XG4gIC0gPHN0cmluZzpsYW5ndWFnZT46PHN0cmluZzpvcHRpb25fa2V5Pjo8Ym9vbGVhbjplbmFibGVkPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PHN0cmluZzpyZW5hbWU+XG4gIC0gPHN0cmluZzpsYW5ndWFnZT46PHN0cmluZzpvcHRpb25fa2V5Pjo8ZnVuY3Rpb246dHJhbnNmb3JtPlxuICAtIDxzdHJpbmc6bGFuZ3VhZ2U+OjxzdHJpbmc6b3B0aW9uX2tleT46PGFycmF5Om1hcHBlcj5cbiAgIyMjXG4gIG9wdGlvbnM6IHt9XG5cbiAgZXhlY3V0YWJsZXM6IFtdXG5cbiAgIyMjXG4gIElzIHRoZSBiZWF1dGlmaWVyIGEgY29tbWFuZC1saW5lIGludGVyZmFjZSBiZWF1dGlmaWVyP1xuICAjIyNcbiAgaXNQcmVJbnN0YWxsZWQ6ICgpIC0+XG4gICAgQGV4ZWN1dGFibGVzLmxlbmd0aCBpcyAwXG5cbiAgX2V4ZToge31cbiAgbG9hZEV4ZWN1dGFibGVzOiAoKSAtPlxuICAgIEBkZWJ1ZyhcIkxvYWQgZXhlY3V0YWJsZXNcIilcbiAgICBpZiBPYmplY3Qua2V5cyhAX2V4ZSkubGVuZ3RoIGlzIEBleGVjdXRhYmxlcy5sZW5ndGhcbiAgICAgIFByb21pc2UucmVzb2x2ZShAX2V4ZSlcbiAgICBlbHNlXG4gICAgICBQcm9taXNlLnJlc29sdmUoZXhlY3V0YWJsZXMgPSBAZXhlY3V0YWJsZXMubWFwKChlKSAtPiBuZXcgRXhlY3V0YWJsZShlKSkpXG4gICAgICAgIC50aGVuKChleGVjdXRhYmxlcykgLT4gUHJvbWlzZS5hbGwoZXhlY3V0YWJsZXMubWFwKChleGUpIC0+IGV4ZS5pbml0KCkpKSlcbiAgICAgICAgLnRoZW4oKGVzKSA9PlxuICAgICAgICAgIEBkZWJ1ZyhcIkV4ZWN1dGFibGVzIGxvYWRlZFwiLCBlcylcbiAgICAgICAgICBleGUgPSB7fVxuICAgICAgICAgIG1pc3NpbmdJbnN0YWxscyA9IFtdXG4gICAgICAgICAgZXMuZm9yRWFjaCgoZSkgLT5cbiAgICAgICAgICAgIGV4ZVtlLmNtZF0gPSBlXG4gICAgICAgICAgICBpZiBub3QgZS5pc0luc3RhbGxlZCBhbmQgZS5yZXF1aXJlZFxuICAgICAgICAgICAgICBtaXNzaW5nSW5zdGFsbHMucHVzaChlKVxuICAgICAgICAgIClcbiAgICAgICAgICBAX2V4ZSA9IGV4ZVxuICAgICAgICAgIEBkZWJ1ZyhcImV4ZVwiLCBleGUpXG4gICAgICAgICAgaWYgbWlzc2luZ0luc3RhbGxzLmxlbmd0aCBpcyAwXG4gICAgICAgICAgICByZXR1cm4gQF9leGVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGVidWcoXCJNaXNzaW5nIHJlcXVpcmVkIGV4ZWN1dGFibGVzOiAje21pc3NpbmdJbnN0YWxscy5tYXAoKGUpIC0+IGUuY21kKS5qb2luKCcgYW5kICcpfS5cIilcbiAgICAgICAgICAgIHRocm93IEV4ZWN1dGFibGUuY29tbWFuZE5vdEZvdW5kRXJyb3IobWlzc2luZ0luc3RhbGxzWzBdLmNtZClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICAgIEBkZWJ1ZyhcIkVycm9yIGxvYWRpbmcgZXhlY3V0YWJsZXNcIiwgZXJyb3IpXG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICAgIClcbiAgZXhlOiAoY21kKSAtPlxuICAgIGNvbnNvbGUubG9nKCdleGUnLCBjbWQsIEBfZXhlKVxuICAgIGUgPSBAX2V4ZVtjbWRdXG4gICAgaWYgIWU/XG4gICAgICB0aHJvdyBFeGVjdXRhYmxlLmNvbW1hbmROb3RGb3VuZEVycm9yKGNtZClcbiAgICBlXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBsYW5ndWFnZXMgYnkgdGhpcyBCZWF1dGlmaWVyXG5cbiAgRXh0cmFjdGVkIGZyb20gdGhlIGtleXMgb2YgdGhlIGBvcHRpb25zYCBmaWVsZC5cbiAgIyMjXG4gIGxhbmd1YWdlczogbnVsbFxuXG4gICMjI1xuICBCZWF1dGlmeSB0ZXh0XG5cbiAgT3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4gc3ViY2xhc3Nlc1xuICAjIyNcbiAgYmVhdXRpZnk6IG51bGxcblxuICAjIyNcbiAgU2hvdyBkZXByZWNhdGlvbiB3YXJuaW5nIHRvIHVzZXIuXG4gICMjI1xuICBkZXByZWNhdGU6ICh3YXJuaW5nKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkV2FybmluZyh3YXJuaW5nKVxuXG4gIGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGU6IChleGVOYW1lLCBvbGRPcHRpb24sIG5ld09wdGlvbikgLT5cbiAgICBkZXByZWNhdGlvbk1lc3NhZ2UgPSBcIlRoZSBcXFwiI3tvbGRPcHRpb259XFxcIiBjb25maWd1cmF0aW9uIG9wdGlvbiBoYXMgYmVlbiBkZXByZWNhdGVkLiBQbGVhc2Ugc3dpdGNoIHRvIHVzaW5nIHRoZSBvcHRpb24gaW4gc2VjdGlvbiBcXFwiRXhlY3V0YWJsZXNcXFwiIChuZWFyIHRoZSB0b3ApIGluIHN1YnNlY3Rpb24gXFxcIiN7ZXhlTmFtZX1cXFwiIGxhYmVsbGVkIFxcXCIje25ld09wdGlvbn1cXFwiIGluIEF0b20tQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5ncy5cIlxuICAgIEBkZXByZWNhdGUoZGVwcmVjYXRpb25NZXNzYWdlKVxuXG4gICMjI1xuICBDcmVhdGUgdGVtcG9yYXJ5IGZpbGVcbiAgIyMjXG4gIHRlbXBGaWxlOiAobmFtZSA9IFwiYXRvbS1iZWF1dGlmeS10ZW1wXCIsIGNvbnRlbnRzID0gXCJcIiwgZXh0ID0gXCJcIikgLT5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICMgY3JlYXRlIHRlbXAgZmlsZVxuICAgICAgdGVtcC5vcGVuKHtwcmVmaXg6IG5hbWUsIHN1ZmZpeDogZXh0fSwgKGVyciwgaW5mbykgPT5cbiAgICAgICAgQGRlYnVnKCd0ZW1wRmlsZScsIG5hbWUsIGVyciwgaW5mbylcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICBmcy53cml0ZShpbmZvLmZkLCBjb250ZW50cywgKGVycikgLT5cbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgICAgZnMuY2xvc2UoaW5mby5mZCwgKGVycikgLT5cbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgICAgIHJlc29sdmUoaW5mby5wYXRoKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxuICAjIyNcbiAgUmVhZCBmaWxlXG4gICMjI1xuICByZWFkRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIFByb21pc2UucmVzb2x2ZShmaWxlUGF0aClcbiAgICAudGhlbigoZmlsZVBhdGgpIC0+XG4gICAgICByZXR1cm4gcmVhZEZpbGUoZmlsZVBhdGgsIFwidXRmOFwiKVxuICAgIClcblxuICAjIyNcbiAgRmluZCBmaWxlXG4gICMjI1xuICBmaW5kRmlsZTogKHN0YXJ0RGlyLCBmaWxlTmFtZXMpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU3BlY2lmeSBmaWxlIG5hbWVzIHRvIGZpbmQuXCIgdW5sZXNzIGFyZ3VtZW50cy5sZW5ndGhcbiAgICB1bmxlc3MgZmlsZU5hbWVzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgIGZpbGVOYW1lcyA9IFtmaWxlTmFtZXNdXG4gICAgc3RhcnREaXIgPSBzdGFydERpci5zcGxpdChwYXRoLnNlcClcbiAgICB3aGlsZSBzdGFydERpci5sZW5ndGhcbiAgICAgIGN1cnJlbnREaXIgPSBzdGFydERpci5qb2luKHBhdGguc2VwKVxuICAgICAgZm9yIGZpbGVOYW1lIGluIGZpbGVOYW1lc1xuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihjdXJyZW50RGlyLCBmaWxlTmFtZSlcbiAgICAgICAgdHJ5XG4gICAgICAgICAgZnMuYWNjZXNzU3luYyhmaWxlUGF0aCwgZnMuUl9PSylcbiAgICAgICAgICByZXR1cm4gZmlsZVBhdGhcbiAgICAgIHN0YXJ0RGlyLnBvcCgpXG4gICAgcmV0dXJuIG51bGxcblxuICAjIFJldHJpZXZlcyB0aGUgZGVmYXVsdCBsaW5lIGVuZGluZyBiYXNlZCB1cG9uIHRoZSBBdG9tIGNvbmZpZ3VyYXRpb25cbiAgIyAgYGxpbmUtZW5kaW5nLXNlbGVjdG9yLmRlZmF1bHRMaW5lRW5kaW5nYC4gSWYgdGhlIEF0b20gY29uZmlndXJhdGlvblxuICAjICBpbmRpY2F0ZXMgXCJPUyBEZWZhdWx0XCIsIHRoZSBgcHJvY2Vzcy5wbGF0Zm9ybWAgaXMgcXVlcmllZCwgcmV0dXJuaW5nXG4gICMgIENSTEYgZm9yIFdpbmRvd3Mgc3lzdGVtcyBhbmQgTEYgZm9yIGFsbCBvdGhlciBzeXN0ZW1zLlxuICAjIENvZGUgbW9kaWZpZWQgZnJvbSBhdG9tL2xpbmUtZW5kaW5nLXNlbGVjdG9yXG4gICMgcmV0dXJuczogVGhlIGNvcnJlY3QgbGluZS1lbmRpbmcgY2hhcmFjdGVyIHNlcXVlbmNlIGJhc2VkIHVwb24gdGhlIEF0b21cbiAgIyAgY29uZmlndXJhdGlvbiwgb3IgYG51bGxgIGlmIHRoZSBBdG9tIGxpbmUgZW5kaW5nIGNvbmZpZ3VyYXRpb24gd2FzIG5vdFxuICAjICByZWNvZ25pemVkLlxuICAjIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2F0b20vbGluZS1lbmRpbmctc2VsZWN0b3IvYmxvYi9tYXN0ZXIvbGliL21haW4uanNcbiAgZ2V0RGVmYXVsdExpbmVFbmRpbmc6IChjcmxmLGxmLG9wdGlvbkVvbCkgLT5cbiAgICBpZiAoIW9wdGlvbkVvbCB8fCBvcHRpb25Fb2wgPT0gJ1N5c3RlbSBEZWZhdWx0JylcbiAgICAgIG9wdGlvbkVvbCA9IGF0b20uY29uZmlnLmdldCgnbGluZS1lbmRpbmctc2VsZWN0b3IuZGVmYXVsdExpbmVFbmRpbmcnKVxuICAgIHN3aXRjaCBvcHRpb25Fb2xcbiAgICAgIHdoZW4gJ0xGJ1xuICAgICAgICByZXR1cm4gbGZcbiAgICAgIHdoZW4gJ0NSTEYnXG4gICAgICAgIHJldHVybiBjcmxmXG4gICAgICB3aGVuICdPUyBEZWZhdWx0J1xuICAgICAgICByZXR1cm4gaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gY3JsZiBlbHNlIGxmXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBsZlxuXG4gICMjI1xuICBMaWtlIHRoZSB1bml4IHdoaWNoIHV0aWxpdHkuXG5cbiAgRmluZHMgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGEgc3BlY2lmaWVkIGV4ZWN1dGFibGUgaW4gdGhlIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gIERvZXMgbm90IGNhY2hlIHRoZSByZXN1bHRzLFxuICBzbyBoYXNoIC1yIGlzIG5vdCBuZWVkZWQgd2hlbiB0aGUgUEFUSCBjaGFuZ2VzLlxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLXdoaWNoXG4gICMjI1xuICB3aGljaDogKGV4ZSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgICMgQGRlcHJlY2F0ZShcIkJlYXV0aWZpZXIud2hpY2ggZnVuY3Rpb24gaGFzIGJlZW4gZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBFeGVjdXRhYmxlcy5cIilcbiAgICBFeGVjdXRhYmxlLndoaWNoKGV4ZSwgb3B0aW9ucylcblxuICAjIyNcbiAgUnVuIGNvbW1hbmQtbGluZSBpbnRlcmZhY2UgY29tbWFuZFxuICAjIyNcbiAgcnVuOiAoZXhlY3V0YWJsZSwgYXJncywge2N3ZCwgaWdub3JlUmV0dXJuQ29kZSwgaGVscCwgb25TdGRpbn0gPSB7fSkgLT5cbiAgICAjIEBkZXByZWNhdGUoXCJCZWF1dGlmaWVyLnJ1biBmdW5jdGlvbiBoYXMgYmVlbiBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEV4ZWN1dGFibGVzLlwiKVxuICAgIGV4ZSA9IG5ldyBFeGVjdXRhYmxlKHtcbiAgICAgIG5hbWU6IEBuYW1lXG4gICAgICBob21lcGFnZTogQGxpbmtcbiAgICAgIGluc3RhbGxhdGlvbjogQGxpbmtcbiAgICAgIGNtZDogZXhlY3V0YWJsZVxuICAgIH0pXG4gICAgaGVscCA/PSB7XG4gICAgICBwcm9ncmFtOiBleGVjdXRhYmxlXG4gICAgICBsaW5rOiBAbGlua1xuICAgICAgcGF0aE9wdGlvbjogdW5kZWZpbmVkXG4gICAgfVxuICAgIGV4ZS5ydW4oYXJncywge2N3ZCwgaWdub3JlUmV0dXJuQ29kZSwgaGVscCwgb25TdGRpbn0pXG5cbiAgIyMjXG4gIExvZ2dlciBpbnN0YW5jZVxuICAjIyNcbiAgbG9nZ2VyOiBudWxsXG4gICMjI1xuICBJbml0aWFsaXplIGFuZCBjb25maWd1cmUgTG9nZ2VyXG4gICMjI1xuICBzZXR1cExvZ2dlcjogLT5cbiAgICBAbG9nZ2VyID0gcmVxdWlyZSgnLi4vbG9nZ2VyJykoX19maWxlbmFtZSlcbiAgICAjIEB2ZXJib3NlKEBsb2dnZXIpXG4gICAgIyBNZXJnZSBsb2dnZXIgbWV0aG9kcyBpbnRvIGJlYXV0aWZpZXIgY2xhc3NcbiAgICBmb3Iga2V5LCBtZXRob2Qgb2YgQGxvZ2dlclxuICAgICAgIyBAdmVyYm9zZShrZXksIG1ldGhvZClcbiAgICAgIEBba2V5XSA9IG1ldGhvZFxuICAgIEB2ZXJib3NlKFwiI3tAbmFtZX0gYmVhdXRpZmllciBsb2dnZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXCIpXG5cbiAgIyMjXG4gIENvbnN0cnVjdG9yIHRvIHNldHVwIGJlYXV0aWZlclxuICAjIyNcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgIyBTZXR1cCBsb2dnZXJcbiAgICBAc2V0dXBMb2dnZXIoKVxuICAgICMgSGFuZGxlIGdsb2JhbCBvcHRpb25zXG4gICAgaWYgQG9wdGlvbnMuXz9cbiAgICAgIGdsb2JhbE9wdGlvbnMgPSBAb3B0aW9ucy5fXG4gICAgICBkZWxldGUgQG9wdGlvbnMuX1xuICAgICAgIyBPbmx5IG1lcmdlIGlmIGdsb2JhbE9wdGlvbnMgaXMgYW4gb2JqZWN0XG4gICAgICBpZiB0eXBlb2YgZ2xvYmFsT3B0aW9ucyBpcyBcIm9iamVjdFwiXG4gICAgICAgICMgSXRlcmF0ZSBvdmVyIGFsbCBzdXBwb3J0ZWQgbGFuZ3VhZ2VzXG4gICAgICAgIGZvciBsYW5nLCBvcHRpb25zIG9mIEBvcHRpb25zXG4gICAgICAgICAgI1xuICAgICAgICAgIGlmIHR5cGVvZiBvcHRpb25zIGlzIFwiYm9vbGVhblwiXG4gICAgICAgICAgICBpZiBvcHRpb25zIGlzIHRydWVcbiAgICAgICAgICAgICAgQG9wdGlvbnNbbGFuZ10gPSBnbG9iYWxPcHRpb25zXG4gICAgICAgICAgZWxzZSBpZiB0eXBlb2Ygb3B0aW9ucyBpcyBcIm9iamVjdFwiXG4gICAgICAgICAgICBAb3B0aW9uc1tsYW5nXSA9IF8ubWVyZ2UoZ2xvYmFsT3B0aW9ucywgb3B0aW9ucylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAd2FybihcIlVuc3VwcG9ydGVkIG9wdGlvbnMgdHlwZSAje3R5cGVvZiBvcHRpb25zfSBmb3IgbGFuZ3VhZ2UgI3tsYW5nfTogXCIrIG9wdGlvbnMpXG4gICAgQHZlcmJvc2UoXCJPcHRpb25zIGZvciAje0BuYW1lfTpcIiwgQG9wdGlvbnMpXG4gICAgIyBTZXQgc3VwcG9ydGVkIGxhbmd1YWdlc1xuICAgIEBsYW5ndWFnZXMgPSBfLmtleXMoQG9wdGlvbnMpXG4iXX0=

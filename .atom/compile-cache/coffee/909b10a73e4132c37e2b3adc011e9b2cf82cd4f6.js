(function() {
  var Executable, HybridExecutable, Promise, _, fs, os, parentConfigKey, path, semver, spawn, which,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Promise = require('bluebird');

  _ = require('lodash');

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  semver = require('semver');

  os = require('os');

  fs = require('fs');

  parentConfigKey = "atom-beautify.executables";

  Executable = (function() {
    var isInstalled, version;

    Executable.prototype.name = null;

    Executable.prototype.cmd = null;

    Executable.prototype.key = null;

    Executable.prototype.homepage = null;

    Executable.prototype.installation = null;

    Executable.prototype.versionArgs = ['--version'];

    Executable.prototype.versionParse = function(text) {
      return semver.clean(text);
    };

    Executable.prototype.versionRunOptions = {};

    Executable.prototype.versionsSupported = '>= 0.0.0';

    Executable.prototype.required = true;

    function Executable(options) {
      var versionOptions;
      if (options.cmd == null) {
        throw new Error("The command (i.e. cmd property) is required for an Executable.");
      }
      this.name = options.name;
      this.cmd = options.cmd;
      this.key = this.cmd;
      this.homepage = options.homepage;
      this.installation = options.installation;
      this.required = !options.optional;
      if (options.version != null) {
        versionOptions = options.version;
        if (versionOptions.args) {
          this.versionArgs = versionOptions.args;
        }
        if (versionOptions.parse) {
          this.versionParse = versionOptions.parse;
        }
        if (versionOptions.runOptions) {
          this.versionRunOptions = versionOptions.runOptions;
        }
        if (versionOptions.supported) {
          this.versionsSupported = versionOptions.supported;
        }
      }
      this.setupLogger();
    }

    Executable.prototype.init = function() {
      return Promise.all([this.loadVersion()]).then((function(_this) {
        return function() {
          return _this.verbose("Done init of " + _this.name);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Executable.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Executable.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(this.name + " Executable");
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " executable logger has been initialized.");
    };

    isInstalled = null;

    version = null;

    Executable.prototype.loadVersion = function(force) {
      if (force == null) {
        force = false;
      }
      this.verbose("loadVersion", this.version, force);
      if (force || (this.version == null)) {
        this.verbose("Loading version without cache");
        return this.runVersion().then((function(_this) {
          return function(text) {
            return _this.saveVersion(text);
          };
        })(this));
      } else {
        this.verbose("Loading cached version");
        return Promise.resolve(this.version);
      }
    };

    Executable.prototype.runVersion = function() {
      return this.run(this.versionArgs, this.versionRunOptions).then((function(_this) {
        return function(version) {
          _this.info("Version text: " + version);
          return version;
        };
      })(this));
    };

    Executable.prototype.saveVersion = function(text) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.versionParse(text);
        };
      })(this)).then(function(version) {
        var valid;
        valid = Boolean(semver.valid(version));
        if (!valid) {
          throw new Error("Version is not valid: " + version);
        }
        return version;
      }).then((function(_this) {
        return function(version) {
          _this.isInstalled = true;
          return _this.version = version;
        };
      })(this)).then((function(_this) {
        return function(version) {
          _this.info(_this.cmd + " version: " + version);
          return version;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          var help;
          _this.isInstalled = false;
          _this.error(error);
          help = {
            program: _this.cmd,
            link: _this.installation || _this.homepage,
            pathOption: "Executable - " + (_this.name || _this.cmd) + " - Path"
          };
          return Promise.reject(_this.commandNotFoundError(_this.name || _this.cmd, help));
        };
      })(this));
    };

    Executable.prototype.isSupported = function() {
      return this.isVersion(this.versionsSupported);
    };

    Executable.prototype.isVersion = function(range) {
      return this.versionSatisfies(this.version, range);
    };

    Executable.prototype.versionSatisfies = function(version, range) {
      return semver.satisfies(version, range);
    };

    Executable.prototype.getConfig = function() {
      return (typeof atom !== "undefined" && atom !== null ? atom.config.get(parentConfigKey + "." + this.key) : void 0) || {};
    };


    /*
    Run command-line interface command
     */

    Executable.prototype.run = function(args, options) {
      var cmd, cwd, exeName, help, ignoreReturnCode, onStdin, returnStderr, returnStdoutOrStderr;
      if (options == null) {
        options = {};
      }
      this.debug("Run: ", this.cmd, args, options);
      cmd = options.cmd, cwd = options.cwd, ignoreReturnCode = options.ignoreReturnCode, help = options.help, onStdin = options.onStdin, returnStderr = options.returnStderr, returnStdoutOrStderr = options.returnStdoutOrStderr;
      exeName = cmd || this.cmd;
      if (cwd == null) {
        cwd = os.tmpdir();
      }
      if (help == null) {
        help = {
          program: this.cmd,
          link: this.installation || this.homepage,
          pathOption: "Executable - " + (this.name || this.cmd) + " - Path"
        };
      }
      return Promise.all([this.shellEnv(), this.resolveArgs(args)]).then((function(_this) {
        return function(arg1) {
          var args, env, exePath;
          env = arg1[0], args = arg1[1];
          _this.debug('exeName, args:', exeName, args);
          exePath = _this.path(exeName);
          return Promise.all([exeName, args, env, exePath]);
        };
      })(this)).then((function(_this) {
        return function(arg1) {
          var args, env, exe, exeName, exePath, spawnOptions;
          exeName = arg1[0], args = arg1[1], env = arg1[2], exePath = arg1[3];
          _this.debug('exePath:', exePath);
          _this.debug('env:', env);
          _this.debug('PATH:', env.PATH);
          _this.debug('args', args);
          args = _this.relativizePaths(args);
          _this.debug('relativized args', args);
          exe = exePath != null ? exePath : exeName;
          spawnOptions = {
            cwd: cwd,
            env: env
          };
          _this.debug('spawnOptions', spawnOptions);
          return _this.spawn(exe, args, spawnOptions, onStdin).then(function(arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = arg2.returnCode, stdout = arg2.stdout, stderr = arg2.stderr;
            _this.verbose('spawn result, returnCode', returnCode);
            _this.verbose('spawn result, stdout', stdout);
            _this.verbose('spawn result, stderr', stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows() && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr || stdout);
              }
            } else {
              if (returnStdoutOrStderr) {
                return stdout || stderr;
              } else if (returnStderr) {
                return stderr;
              } else {
                return stdout;
              }
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };

    Executable.prototype.path = function(cmd) {
      var config, exeName;
      if (cmd == null) {
        cmd = this.cmd;
      }
      config = this.getConfig();
      if (config && config.path) {
        return Promise.resolve(config.path);
      } else {
        exeName = cmd;
        return this.which(exeName);
      }
    };

    Executable.prototype.resolveArgs = function(args) {
      args = _.flatten(args);
      return Promise.all(args);
    };

    Executable.prototype.relativizePaths = function(args) {
      var newArgs, tmpDir;
      tmpDir = os.tmpdir();
      newArgs = args.map(function(arg) {
        var isTmpFile;
        isTmpFile = typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && path.dirname(arg).startsWith(tmpDir);
        if (isTmpFile) {
          return path.relative(tmpDir, arg);
        }
        return arg;
      });
      return newArgs;
    };


    /*
    Spawn
     */

    Executable.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Executable.prototype.commandNotFoundError = function(exe, help) {
      if (exe == null) {
        exe = this.name || this.cmd;
      }
      return this.constructor.commandNotFoundError(exe, help);
    };

    Executable.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          docsLink = "https://github.com/Glavin001/atom-beautify#beautifiers";
          helpStr = "See " + exe + " installation instructions at " + docsLink + (help.link ? ' or go to ' + help.link : '') + "\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          helpStr += "Your program is properly installed if running '" + (this.isWindows() ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows() ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable.\n";
          if (help.additional) {
            helpStr += help.additional;
          }
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };

    Executable._envCache = null;

    Executable.prototype.shellEnv = function() {
      var env;
      env = this.constructor.shellEnv();
      this.debug("env", env);
      return env;
    };

    Executable.shellEnv = function() {
      return Promise.resolve(process.env);
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Executable.prototype.which = function(exe, options) {
      return this.constructor.which(exe, options);
    };

    Executable._whichCache = {};

    Executable.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      if (this._whichCache[exe]) {
        return Promise.resolve(this._whichCache[exe]);
      }
      return this.shellEnv().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows()) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = ((ref = process.env.PATHEXT) != null ? ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                return resolve(exe);
              }
              _this._whichCache[exe] = path;
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    If platform is Windows
     */

    Executable.prototype.isWindows = function() {
      return this.constructor.isWindows();
    };

    Executable.isWindows = function() {
      return new RegExp('^win').test(process.platform);
    };

    return Executable;

  })();

  HybridExecutable = (function(superClass) {
    extend(HybridExecutable, superClass);

    HybridExecutable.prototype.dockerOptions = {
      image: void 0,
      workingDir: "/workdir"
    };

    function HybridExecutable(options) {
      HybridExecutable.__super__.constructor.call(this, options);
      if (options.docker != null) {
        this.dockerOptions = Object.assign({}, this.dockerOptions, options.docker);
        this.docker = this.constructor.dockerExecutable();
      }
    }

    HybridExecutable.docker = void 0;

    HybridExecutable.dockerExecutable = function() {
      if (this.docker == null) {
        this.docker = new Executable({
          name: "Docker",
          cmd: "docker",
          homepage: "https://www.docker.com/",
          installation: "https://www.docker.com/get-docker",
          version: {
            parse: function(text) {
              return text.match(/version [0]*([1-9]\d*).[0]*([0-9]\d*).[0]*([0-9]\d*)/).slice(1).join('.');
            }
          }
        });
      }
      return this.docker;
    };

    HybridExecutable.prototype.installedWithDocker = false;

    HybridExecutable.prototype.init = function() {
      return HybridExecutable.__super__.init.call(this)["catch"]((function(_this) {
        return function(error) {
          if (_this.docker == null) {
            return Promise.reject(error);
          }
          return _this.docker.init().then(function() {
            return _this.runImage(_this.versionArgs, _this.versionRunOptions);
          }).then(function(text) {
            return _this.saveVersion(text);
          }).then(function() {
            return _this.installedWithDocker = true;
          }).then(function() {
            return _this;
          })["catch"](function(dockerError) {
            _this.debug(dockerError);
            return Promise.reject(error);
          });
        };
      })(this));
    };

    HybridExecutable.prototype.run = function(args, options) {
      if (options == null) {
        options = {};
      }
      if (this.installedWithDocker && this.docker && this.docker.isInstalled) {
        return this.runImage(args, options);
      }
      return HybridExecutable.__super__.run.call(this, args, options);
    };

    HybridExecutable.prototype.runImage = function(args, options) {
      this.debug("Run Docker executable: ", args, options);
      return this.resolveArgs(args).then((function(_this) {
        return function(args) {
          var cwd, image, newArgs, pwd, rootPath, tmpDir, workingDir;
          cwd = options.cwd;
          tmpDir = os.tmpdir();
          pwd = fs.realpathSync(cwd || tmpDir);
          image = _this.dockerOptions.image;
          workingDir = _this.dockerOptions.workingDir;
          rootPath = '/mountedRoot';
          newArgs = args.map(function(arg) {
            if (typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && !path.dirname(arg).startsWith(tmpDir)) {
              return path.join(rootPath, arg);
            } else {
              return arg;
            }
          });
          return _this.docker.run(["run", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], options);
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9leGVjdXRhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBQ2pDLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxlQUFBLEdBQWtCOztFQUdaO0FBRUosUUFBQTs7eUJBQUEsSUFBQSxHQUFNOzt5QkFDTixHQUFBLEdBQUs7O3lCQUNMLEdBQUEsR0FBSzs7eUJBQ0wsUUFBQSxHQUFVOzt5QkFDVixZQUFBLEdBQWM7O3lCQUNkLFdBQUEsR0FBYSxDQUFDLFdBQUQ7O3lCQUNiLFlBQUEsR0FBYyxTQUFDLElBQUQ7YUFBVSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWI7SUFBVjs7eUJBQ2QsaUJBQUEsR0FBbUI7O3lCQUNuQixpQkFBQSxHQUFtQjs7eUJBQ25CLFFBQUEsR0FBVTs7SUFFRyxvQkFBQyxPQUFEO0FBRVgsVUFBQTtNQUFBLElBQUksbUJBQUo7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLGdFQUFOLEVBRFo7O01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUM7TUFDaEIsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUM7TUFDZixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FB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LFFBQWQsSUFBMkIsQ0FBSSxHQUFHLENBQUMsUUFBSixDQUFhLEdBQWIsQ0FBL0IsSUFDRSxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQURGLElBQzJCLENBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQWlCLENBQUMsVUFBbEIsQ0FBNkIsTUFBN0IsQ0FEbkM7cUJBRU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLEdBQXBCLEVBRlA7YUFBQSxNQUFBO3FCQUVxQyxJQUZyQzs7VUFEaUIsQ0FBVDtpQkFNVixLQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxDQUNSLEtBRFEsRUFFUixVQUZRLEVBRU8sR0FBRCxHQUFLLEdBQUwsR0FBUSxVQUZkLEVBR1IsVUFIUSxFQUdNLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUQsQ0FBQSxHQUFtQixHQUFuQixHQUFzQixRQUg1QixFQUlSLFdBSlEsRUFJSyxVQUpMLEVBS1IsS0FMUSxFQU1SLE9BTlEsQ0FBWixFQVFFLE9BUkY7UUFkSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUjtJQUZROzs7O0tBaERtQjs7RUE4RS9CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBcmJqQiIsInNvdXJjZXNDb250ZW50IjpbIlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbndoaWNoID0gcmVxdWlyZSgnd2hpY2gnKVxuc3Bhd24gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd25cbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbnNlbXZlciA9IHJlcXVpcmUoJ3NlbXZlcicpXG5vcyA9IHJlcXVpcmUoJ29zJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuXG5wYXJlbnRDb25maWdLZXkgPSBcImF0b20tYmVhdXRpZnkuZXhlY3V0YWJsZXNcIlxuXG5cbmNsYXNzIEV4ZWN1dGFibGVcblxuICBuYW1lOiBudWxsXG4gIGNtZDogbnVsbFxuICBrZXk6IG51bGxcbiAgaG9tZXBhZ2U6IG51bGxcbiAgaW5zdGFsbGF0aW9uOiBudWxsXG4gIHZlcnNpb25BcmdzOiBbJy0tdmVyc2lvbiddXG4gIHZlcnNpb25QYXJzZTogKHRleHQpIC0+IHNlbXZlci5jbGVhbih0ZXh0KVxuICB2ZXJzaW9uUnVuT3B0aW9uczoge31cbiAgdmVyc2lvbnNTdXBwb3J0ZWQ6ICc+PSAwLjAuMCdcbiAgcmVxdWlyZWQ6IHRydWVcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAgIyBWYWxpZGF0aW9uXG4gICAgaWYgIW9wdGlvbnMuY21kP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbW1hbmQgKGkuZS4gY21kIHByb3BlcnR5KSBpcyByZXF1aXJlZCBmb3IgYW4gRXhlY3V0YWJsZS5cIilcbiAgICBAbmFtZSA9IG9wdGlvbnMubmFtZVxuICAgIEBjbWQgPSBvcHRpb25zLmNtZFxuICAgIEBrZXkgPSBAY21kXG4gICAgQGhvbWVwYWdlID0gb3B0aW9ucy5ob21lcGFnZVxuICAgIEBpbnN0YWxsYXRpb24gPSBvcHRpb25zLmluc3RhbGxhdGlvblxuICAgIEByZXF1aXJlZCA9IG5vdCBvcHRpb25zLm9wdGlvbmFsXG4gICAgaWYgb3B0aW9ucy52ZXJzaW9uP1xuICAgICAgdmVyc2lvbk9wdGlvbnMgPSBvcHRpb25zLnZlcnNpb25cbiAgICAgIEB2ZXJzaW9uQXJncyA9IHZlcnNpb25PcHRpb25zLmFyZ3MgaWYgdmVyc2lvbk9wdGlvbnMuYXJnc1xuICAgICAgQHZlcnNpb25QYXJzZSA9IHZlcnNpb25PcHRpb25zLnBhcnNlIGlmIHZlcnNpb25PcHRpb25zLnBhcnNlXG4gICAgICBAdmVyc2lvblJ1bk9wdGlvbnMgPSB2ZXJzaW9uT3B0aW9ucy5ydW5PcHRpb25zIGlmIHZlcnNpb25PcHRpb25zLnJ1bk9wdGlvbnNcbiAgICAgIEB2ZXJzaW9uc1N1cHBvcnRlZCA9IHZlcnNpb25PcHRpb25zLnN1cHBvcnRlZCBpZiB2ZXJzaW9uT3B0aW9ucy5zdXBwb3J0ZWRcbiAgICBAc2V0dXBMb2dnZXIoKVxuXG4gIGluaXQ6ICgpIC0+XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgQGxvYWRWZXJzaW9uKClcbiAgICBdKVxuICAgICAgLnRoZW4oKCkgPT4gQHZlcmJvc2UoXCJEb25lIGluaXQgb2YgI3tAbmFtZX1cIikpXG4gICAgICAudGhlbigoKSA9PiBAKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgaWYgbm90IEAucmVxdWlyZWRcbiAgICAgICAgICBAXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgIClcblxuICAjIyNcbiAgTG9nZ2VyIGluc3RhbmNlXG4gICMjI1xuICBsb2dnZXI6IG51bGxcbiAgIyMjXG4gIEluaXRpYWxpemUgYW5kIGNvbmZpZ3VyZSBMb2dnZXJcbiAgIyMjXG4gIHNldHVwTG9nZ2VyOiAtPlxuICAgIEBsb2dnZXIgPSByZXF1aXJlKCcuLi9sb2dnZXInKShcIiN7QG5hbWV9IEV4ZWN1dGFibGVcIilcbiAgICBmb3Iga2V5LCBtZXRob2Qgb2YgQGxvZ2dlclxuICAgICAgQFtrZXldID0gbWV0aG9kXG4gICAgQHZlcmJvc2UoXCIje0BuYW1lfSBleGVjdXRhYmxlIGxvZ2dlciBoYXMgYmVlbiBpbml0aWFsaXplZC5cIilcblxuICBpc0luc3RhbGxlZCA9IG51bGxcbiAgdmVyc2lvbiA9IG51bGxcbiAgbG9hZFZlcnNpb246IChmb3JjZSA9IGZhbHNlKSAtPlxuICAgIEB2ZXJib3NlKFwibG9hZFZlcnNpb25cIiwgQHZlcnNpb24sIGZvcmNlKVxuICAgIGlmIGZvcmNlIG9yICFAdmVyc2lvbj9cbiAgICAgIEB2ZXJib3NlKFwiTG9hZGluZyB2ZXJzaW9uIHdpdGhvdXQgY2FjaGVcIilcbiAgICAgIEBydW5WZXJzaW9uKClcbiAgICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICBlbHNlXG4gICAgICBAdmVyYm9zZShcIkxvYWRpbmcgY2FjaGVkIHZlcnNpb25cIilcbiAgICAgIFByb21pc2UucmVzb2x2ZShAdmVyc2lvbilcblxuICBydW5WZXJzaW9uOiAoKSAtPlxuICAgIEBydW4oQHZlcnNpb25BcmdzLCBAdmVyc2lvblJ1bk9wdGlvbnMpXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGluZm8oXCJWZXJzaW9uIHRleHQ6IFwiICsgdmVyc2lvbilcbiAgICAgICAgdmVyc2lvblxuICAgICAgKVxuXG4gIHNhdmVWZXJzaW9uOiAodGV4dCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oID0+IEB2ZXJzaW9uUGFyc2UodGV4dCkpXG4gICAgICAudGhlbigodmVyc2lvbikgLT5cbiAgICAgICAgdmFsaWQgPSBCb29sZWFuKHNlbXZlci52YWxpZCh2ZXJzaW9uKSlcbiAgICAgICAgaWYgbm90IHZhbGlkXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmVyc2lvbiBpcyBub3QgdmFsaWQ6IFwiK3ZlcnNpb24pXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICAgIEB2ZXJzaW9uID0gdmVyc2lvblxuICAgICAgKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpbmZvKFwiI3tAY21kfSB2ZXJzaW9uOiAje3ZlcnNpb259XCIpXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIEBpc0luc3RhbGxlZCA9IGZhbHNlXG4gICAgICAgIEBlcnJvcihlcnJvcilcbiAgICAgICAgaGVscCA9IHtcbiAgICAgICAgICBwcm9ncmFtOiBAY21kXG4gICAgICAgICAgbGluazogQGluc3RhbGxhdGlvbiBvciBAaG9tZXBhZ2VcbiAgICAgICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgICAgIH1cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoQGNvbW1hbmROb3RGb3VuZEVycm9yKEBuYW1lIG9yIEBjbWQsIGhlbHApKVxuICAgICAgKVxuXG4gIGlzU3VwcG9ydGVkOiAoKSAtPlxuICAgIEBpc1ZlcnNpb24oQHZlcnNpb25zU3VwcG9ydGVkKVxuXG4gIGlzVmVyc2lvbjogKHJhbmdlKSAtPlxuICAgIEB2ZXJzaW9uU2F0aXNmaWVzKEB2ZXJzaW9uLCByYW5nZSlcblxuICB2ZXJzaW9uU2F0aXNmaWVzOiAodmVyc2lvbiwgcmFuZ2UpIC0+XG4gICAgc2VtdmVyLnNhdGlzZmllcyh2ZXJzaW9uLCByYW5nZSlcblxuICBnZXRDb25maWc6ICgpIC0+XG4gICAgYXRvbT8uY29uZmlnLmdldChcIiN7cGFyZW50Q29uZmlnS2V5fS4je0BrZXl9XCIpIG9yIHt9XG5cbiAgIyMjXG4gIFJ1biBjb21tYW5kLWxpbmUgaW50ZXJmYWNlIGNvbW1hbmRcbiAgIyMjXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVidWcoXCJSdW46IFwiLCBAY21kLCBhcmdzLCBvcHRpb25zKVxuICAgIHsgY21kLCBjd2QsIGlnbm9yZVJldHVybkNvZGUsIGhlbHAsIG9uU3RkaW4sIHJldHVyblN0ZGVyciwgcmV0dXJuU3Rkb3V0T3JTdGRlcnIgfSA9IG9wdGlvbnNcbiAgICBleGVOYW1lID0gY21kIG9yIEBjbWRcbiAgICBjd2QgPz0gb3MudG1wZGlyKClcbiAgICBoZWxwID89IHtcbiAgICAgIHByb2dyYW06IEBjbWRcbiAgICAgIGxpbms6IEBpbnN0YWxsYXRpb24gb3IgQGhvbWVwYWdlXG4gICAgICBwYXRoT3B0aW9uOiBcIkV4ZWN1dGFibGUgLSAje0BuYW1lIG9yIEBjbWR9IC0gUGF0aFwiXG4gICAgfVxuXG4gICAgIyBSZXNvbHZlIGV4ZWN1dGFibGUgYW5kIGFsbCBhcmdzXG4gICAgUHJvbWlzZS5hbGwoW0BzaGVsbEVudigpLCB0aGlzLnJlc29sdmVBcmdzKGFyZ3MpXSlcbiAgICAgIC50aGVuKChbZW52LCBhcmdzXSkgPT5cbiAgICAgICAgQGRlYnVnKCdleGVOYW1lLCBhcmdzOicsIGV4ZU5hbWUsIGFyZ3MpXG4gICAgICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgICAgICBleGVQYXRoID0gQHBhdGgoZXhlTmFtZSlcbiAgICAgICAgUHJvbWlzZS5hbGwoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pXG4gICAgICApXG4gICAgICAudGhlbigoW2V4ZU5hbWUsIGFyZ3MsIGVudiwgZXhlUGF0aF0pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlUGF0aDonLCBleGVQYXRoKVxuICAgICAgICBAZGVidWcoJ2VudjonLCBlbnYpXG4gICAgICAgIEBkZWJ1ZygnUEFUSDonLCBlbnYuUEFUSClcbiAgICAgICAgQGRlYnVnKCdhcmdzJywgYXJncylcbiAgICAgICAgYXJncyA9IHRoaXMucmVsYXRpdml6ZVBhdGhzKGFyZ3MpXG4gICAgICAgIEBkZWJ1ZygncmVsYXRpdml6ZWQgYXJncycsIGFyZ3MpXG5cbiAgICAgICAgZXhlID0gZXhlUGF0aCA/IGV4ZU5hbWVcbiAgICAgICAgc3Bhd25PcHRpb25zID0ge1xuICAgICAgICAgIGN3ZDogY3dkXG4gICAgICAgICAgZW52OiBlbnZcbiAgICAgICAgfVxuICAgICAgICBAZGVidWcoJ3NwYXduT3B0aW9ucycsIHNwYXduT3B0aW9ucylcblxuICAgICAgICBAc3Bhd24oZXhlLCBhcmdzLCBzcGF3bk9wdGlvbnMsIG9uU3RkaW4pXG4gICAgICAgICAgLnRoZW4oKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pID0+XG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCByZXR1cm5Db2RlJywgcmV0dXJuQ29kZSlcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZG91dCcsIHN0ZG91dClcbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHN0ZGVycicsIHN0ZGVycilcblxuICAgICAgICAgICAgIyBJZiByZXR1cm4gY29kZSBpcyBub3QgMCB0aGVuIGVycm9yIG9jY3VyZWRcbiAgICAgICAgICAgIGlmIG5vdCBpZ25vcmVSZXR1cm5Db2RlIGFuZCByZXR1cm5Db2RlIGlzbnQgMFxuICAgICAgICAgICAgICAjIG9wZXJhYmxlIHByb2dyYW0gb3IgYmF0Y2ggZmlsZVxuICAgICAgICAgICAgICB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnID0gXCJpcyBub3QgcmVjb2duaXplZCBhcyBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCBjb21tYW5kXCJcblxuICAgICAgICAgICAgICBAdmVyYm9zZShzdGRlcnIsIHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpXG5cbiAgICAgICAgICAgICAgaWYgQGlzV2luZG93cygpIGFuZCByZXR1cm5Db2RlIGlzIDEgYW5kIHN0ZGVyci5pbmRleE9mKHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cpIGlzbnQgLTFcbiAgICAgICAgICAgICAgICB0aHJvdyBAY29tbWFuZE5vdEZvdW5kRXJyb3IoZXhlTmFtZSwgaGVscClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdGRlcnIgb3Igc3Rkb3V0KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBpZiByZXR1cm5TdGRvdXRPclN0ZGVyclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQgb3Igc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2UgaWYgcmV0dXJuU3RkZXJyXG4gICAgICAgICAgICAgICAgc3RkZXJyXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdGRvdXRcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+XG4gICAgICAgICAgICBAZGVidWcoJ2Vycm9yJywgZXJyKVxuXG4gICAgICAgICAgICAjIENoZWNrIGlmIGVycm9yIGlzIEVOT0VOVCAoY29tbWFuZCBjb3VsZCBub3QgYmUgZm91bmQpXG4gICAgICAgICAgICBpZiBlcnIuY29kZSBpcyAnRU5PRU5UJyBvciBlcnIuZXJybm8gaXMgJ0VOT0VOVCdcbiAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICMgY29udGludWUgYXMgbm9ybWFsIGVycm9yXG4gICAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgIClcbiAgICAgIClcblxuICBwYXRoOiAoY21kID0gQGNtZCkgLT5cbiAgICBjb25maWcgPSBAZ2V0Q29uZmlnKClcbiAgICBpZiBjb25maWcgYW5kIGNvbmZpZy5wYXRoXG4gICAgICBQcm9taXNlLnJlc29sdmUoY29uZmlnLnBhdGgpXG4gICAgZWxzZVxuICAgICAgZXhlTmFtZSA9IGNtZFxuICAgICAgQHdoaWNoKGV4ZU5hbWUpXG5cbiAgcmVzb2x2ZUFyZ3M6IChhcmdzKSAtPlxuICAgIGFyZ3MgPSBfLmZsYXR0ZW4oYXJncylcbiAgICBQcm9taXNlLmFsbChhcmdzKVxuXG4gIHJlbGF0aXZpemVQYXRoczogKGFyZ3MpIC0+XG4gICAgdG1wRGlyID0gb3MudG1wZGlyKClcbiAgICBuZXdBcmdzID0gYXJncy5tYXAoKGFyZykgLT5cbiAgICAgIGlzVG1wRmlsZSA9ICh0eXBlb2YgYXJnIGlzICdzdHJpbmcnIGFuZCBub3QgYXJnLmluY2x1ZGVzKCc6JykgYW5kIFxcXG4gICAgICAgIHBhdGguaXNBYnNvbHV0ZShhcmcpIGFuZCBwYXRoLmRpcm5hbWUoYXJnKS5zdGFydHNXaXRoKHRtcERpcikpXG4gICAgICBpZiBpc1RtcEZpbGVcbiAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodG1wRGlyLCBhcmcpXG4gICAgICByZXR1cm4gYXJnXG4gICAgKVxuICAgIG5ld0FyZ3NcblxuICAjIyNcbiAgU3Bhd25cbiAgIyMjXG4gIHNwYXduOiAoZXhlLCBhcmdzLCBvcHRpb25zLCBvblN0ZGluKSAtPlxuICAgICMgUmVtb3ZlIHVuZGVmaW5lZC9udWxsIHZhbHVlc1xuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgdW5kZWZpbmVkKVxuICAgIGFyZ3MgPSBfLndpdGhvdXQoYXJncywgbnVsbClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQGRlYnVnKCdzcGF3bicsIGV4ZSwgYXJncylcblxuICAgICAgY21kID0gc3Bhd24oZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgc3Rkb3V0ID0gXCJcIlxuICAgICAgc3RkZXJyID0gXCJcIlxuXG4gICAgICBjbWQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZG91dCArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpIC0+XG4gICAgICAgIHN0ZGVyciArPSBkYXRhXG4gICAgICApXG4gICAgICBjbWQub24oJ2Nsb3NlJywgKHJldHVybkNvZGUpID0+XG4gICAgICAgIEBkZWJ1Zygnc3Bhd24gZG9uZScsIHJldHVybkNvZGUsIHN0ZGVyciwgc3Rkb3V0KVxuICAgICAgICByZXNvbHZlKHtyZXR1cm5Db2RlLCBzdGRvdXQsIHN0ZGVycn0pXG4gICAgICApXG4gICAgICBjbWQub24oJ2Vycm9yJywgKGVycikgPT5cbiAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIClcblxuICAgICAgb25TdGRpbiBjbWQuc3RkaW4gaWYgb25TdGRpblxuICAgIClcblxuXG4gICMjI1xuICBBZGQgaGVscCB0byBlcnJvci5kZXNjcmlwdGlvblxuXG4gIE5vdGU6IGVycm9yLmRlc2NyaXB0aW9uIGlzIG5vdCBvZmZpY2lhbGx5IHVzZWQgaW4gSmF2YVNjcmlwdCxcbiAgaG93ZXZlciBpdCBpcyB1c2VkIGludGVybmFsbHkgZm9yIEF0b20gQmVhdXRpZnkgd2hlbiBkaXNwbGF5aW5nIGVycm9ycy5cbiAgIyMjXG4gIGNvbW1hbmROb3RGb3VuZEVycm9yOiAoZXhlLCBoZWxwKSAtPlxuICAgIGV4ZSA/PSBAbmFtZSBvciBAY21kXG4gICAgQGNvbnN0cnVjdG9yLmNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZSwgaGVscClcblxuICBAY29tbWFuZE5vdEZvdW5kRXJyb3I6IChleGUsIGhlbHApIC0+XG4gICAgIyBDcmVhdGUgbmV3IGltcHJvdmVkIGVycm9yXG4gICAgIyBub3RpZnkgdXNlciB0aGF0IGl0IG1heSBub3QgYmVcbiAgICAjIGluc3RhbGxlZCBvciBpbiBwYXRoXG4gICAgbWVzc2FnZSA9IFwiQ291bGQgbm90IGZpbmQgJyN7ZXhlfScuIFxcXG4gICAgICAgICAgICBUaGUgcHJvZ3JhbSBtYXkgbm90IGJlIGluc3RhbGxlZC5cIlxuICAgIGVyID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgZXIuY29kZSA9ICdDb21tYW5kTm90Rm91bmQnXG4gICAgZXIuZXJybm8gPSBlci5jb2RlXG4gICAgZXIuc3lzY2FsbCA9ICdiZWF1dGlmaWVyOjpydW4nXG4gICAgZXIuZmlsZSA9IGV4ZVxuICAgIGlmIGhlbHA/XG4gICAgICBpZiB0eXBlb2YgaGVscCBpcyBcIm9iamVjdFwiXG4gICAgICAgICMgQmFzaWMgbm90aWNlXG4gICAgICAgIGRvY3NMaW5rID0gXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkjYmVhdXRpZmllcnNcIlxuICAgICAgICBoZWxwU3RyID0gXCJTZWUgI3tleGV9IGluc3RhbGxhdGlvbiBpbnN0cnVjdGlvbnMgYXQgI3tkb2NzTGlua30je2lmIGhlbHAubGluayB0aGVuICgnIG9yIGdvIHRvICcraGVscC5saW5rKSBlbHNlICcnfVxcblwiXG4gICAgICAgICMgIyBIZWxwIHRvIGNvbmZpZ3VyZSBBdG9tIEJlYXV0aWZ5IGZvciBwcm9ncmFtJ3MgcGF0aFxuICAgICAgICBoZWxwU3RyICs9IFwiWW91IGNhbiBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBcXFxuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoIFxcXG4gICAgICAgICAgICAgICAgICAgIHRvICcje2hlbHAucHJvZ3JhbSBvciBleGV9JyBieSBzZXR0aW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICcje2hlbHAucGF0aE9wdGlvbn0nIGluIFxcXG4gICAgICAgICAgICAgICAgICAgIHRoZSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXFxuXCIgaWYgaGVscC5wYXRoT3B0aW9uXG4gICAgICAgIGhlbHBTdHIgKz0gXCJZb3VyIHByb2dyYW0gaXMgcHJvcGVybHkgaW5zdGFsbGVkIGlmIHJ1bm5pbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnd2hlcmUuZXhlJyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJ3doaWNoJ30gI3tleGV9JyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHlvdXIgI3tpZiBAaXNXaW5kb3dzKCkgdGhlbiAnQ01EIHByb21wdCcgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICdUZXJtaW5hbCd9IFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBleGVjdXRhYmxlLlxcblwiXG4gICAgICAgICMgIyBPcHRpb25hbCwgYWRkaXRpb25hbCBoZWxwXG4gICAgICAgIGhlbHBTdHIgKz0gaGVscC5hZGRpdGlvbmFsIGlmIGhlbHAuYWRkaXRpb25hbFxuICAgICAgICBlci5kZXNjcmlwdGlvbiA9IGhlbHBTdHJcbiAgICAgIGVsc2UgI2lmIHR5cGVvZiBoZWxwIGlzIFwic3RyaW5nXCJcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwXG4gICAgcmV0dXJuIGVyXG5cblxuICBAX2VudkNhY2hlID0gbnVsbFxuICBzaGVsbEVudjogKCkgLT5cbiAgICBlbnYgPSBAY29uc3RydWN0b3Iuc2hlbGxFbnYoKVxuICAgIEBkZWJ1ZyhcImVudlwiLCBlbnYpXG4gICAgcmV0dXJuIGVudlxuICBAc2hlbGxFbnY6ICgpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKHByb2Nlc3MuZW52KVxuXG4gICMjI1xuICBMaWtlIHRoZSB1bml4IHdoaWNoIHV0aWxpdHkuXG5cbiAgRmluZHMgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGEgc3BlY2lmaWVkIGV4ZWN1dGFibGUgaW4gdGhlIFBBVEggZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gIERvZXMgbm90IGNhY2hlIHRoZSByZXN1bHRzLFxuICBzbyBoYXNoIC1yIGlzIG5vdCBuZWVkZWQgd2hlbiB0aGUgUEFUSCBjaGFuZ2VzLlxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLXdoaWNoXG4gICMjI1xuICB3aGljaDogKGV4ZSwgb3B0aW9ucykgLT5cbiAgICBALmNvbnN0cnVjdG9yLndoaWNoKGV4ZSwgb3B0aW9ucylcbiAgQF93aGljaENhY2hlID0ge31cbiAgQHdoaWNoOiAoZXhlLCBvcHRpb25zID0ge30pIC0+XG4gICAgaWYgQF93aGljaENhY2hlW2V4ZV1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQF93aGljaENhY2hlW2V4ZV0pXG4gICAgIyBHZXQgUEFUSCBhbmQgb3RoZXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgQHNoZWxsRW52KClcbiAgICAgIC50aGVuKChlbnYpID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgb3B0aW9ucy5wYXRoID89IGVudi5QQVRIXG4gICAgICAgICAgaWYgQGlzV2luZG93cygpXG4gICAgICAgICAgICAjIEVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSBpbiB3aW5kb3dzXG4gICAgICAgICAgICAjIENoZWNrIGVudiBmb3IgYSBjYXNlLWluc2Vuc2l0aXZlICdwYXRoJyB2YXJpYWJsZVxuICAgICAgICAgICAgaWYgIW9wdGlvbnMucGF0aFxuICAgICAgICAgICAgICBmb3IgaSBvZiBlbnZcbiAgICAgICAgICAgICAgICBpZiBpLnRvTG93ZXJDYXNlKCkgaXMgXCJwYXRoXCJcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGF0aCA9IGVudltpXVxuICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgIyBUcmljayBub2RlLXdoaWNoIGludG8gaW5jbHVkaW5nIGZpbGVzXG4gICAgICAgICAgICAjIHdpdGggbm8gZXh0ZW5zaW9uIGFzIGV4ZWN1dGFibGVzLlxuICAgICAgICAgICAgIyBQdXQgZW1wdHkgZXh0ZW5zaW9uIGxhc3QgdG8gYWxsb3cgZm9yIG90aGVyIHJlYWwgZXh0ZW5zaW9ucyBmaXJzdFxuICAgICAgICAgICAgb3B0aW9ucy5wYXRoRXh0ID89IFwiI3twcm9jZXNzLmVudi5QQVRIRVhUID8gJy5FWEUnfTtcIlxuICAgICAgICAgIHdoaWNoKGV4ZSwgb3B0aW9ucywgKGVyciwgcGF0aCkgPT5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4ZSkgaWYgZXJyXG4gICAgICAgICAgICBAX3doaWNoQ2FjaGVbZXhlXSA9IHBhdGhcbiAgICAgICAgICAgIHJlc29sdmUocGF0aClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcblxuICAjIyNcbiAgSWYgcGxhdGZvcm0gaXMgV2luZG93c1xuICAjIyNcbiAgaXNXaW5kb3dzOiAoKSAtPiBAY29uc3RydWN0b3IuaXNXaW5kb3dzKClcbiAgQGlzV2luZG93czogKCkgLT4gbmV3IFJlZ0V4cCgnXndpbicpLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSlcblxuY2xhc3MgSHlicmlkRXhlY3V0YWJsZSBleHRlbmRzIEV4ZWN1dGFibGVcblxuICBkb2NrZXJPcHRpb25zOiB7XG4gICAgaW1hZ2U6IHVuZGVmaW5lZFxuICAgIHdvcmtpbmdEaXI6IFwiL3dvcmtkaXJcIlxuICB9XG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgaWYgb3B0aW9ucy5kb2NrZXI/XG4gICAgICBAZG9ja2VyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIEBkb2NrZXJPcHRpb25zLCBvcHRpb25zLmRvY2tlcilcbiAgICAgIEBkb2NrZXIgPSBAY29uc3RydWN0b3IuZG9ja2VyRXhlY3V0YWJsZSgpXG5cbiAgQGRvY2tlcjogdW5kZWZpbmVkXG4gIEBkb2NrZXJFeGVjdXRhYmxlOiAoKSAtPlxuICAgIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgQGRvY2tlciA9IG5ldyBFeGVjdXRhYmxlKHtcbiAgICAgICAgbmFtZTogXCJEb2NrZXJcIlxuICAgICAgICBjbWQ6IFwiZG9ja2VyXCJcbiAgICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9cIlxuICAgICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9nZXQtZG9ja2VyXCJcbiAgICAgICAgdmVyc2lvbjoge1xuICAgICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiBbMF0qKFsxLTldXFxkKikuWzBdKihbMC05XVxcZCopLlswXSooWzAtOV1cXGQqKS8pLnNsaWNlKDEpLmpvaW4oJy4nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiBAZG9ja2VyXG5cbiAgaW5zdGFsbGVkV2l0aERvY2tlcjogZmFsc2VcbiAgaW5pdDogKCkgLT5cbiAgICBzdXBlcigpXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgICBAZG9ja2VyLmluaXQoKVxuICAgICAgICAgIC50aGVuKD0+IEBydW5JbWFnZShAdmVyc2lvbkFyZ3MsIEB2ZXJzaW9uUnVuT3B0aW9ucykpXG4gICAgICAgICAgLnRoZW4oKHRleHQpID0+IEBzYXZlVmVyc2lvbih0ZXh0KSlcbiAgICAgICAgICAudGhlbigoKSA9PiBAaW5zdGFsbGVkV2l0aERvY2tlciA9IHRydWUpXG4gICAgICAgICAgLnRoZW4oPT4gQClcbiAgICAgICAgICAuY2F0Y2goKGRvY2tlckVycm9yKSA9PlxuICAgICAgICAgICAgQGRlYnVnKGRvY2tlckVycm9yKVxuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICAgICAgKVxuICAgICAgKVxuXG4gIHJ1bjogKGFyZ3MsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBpZiBAaW5zdGFsbGVkV2l0aERvY2tlciBhbmQgQGRvY2tlciBhbmQgQGRvY2tlci5pc0luc3RhbGxlZFxuICAgICAgcmV0dXJuIEBydW5JbWFnZShhcmdzLCBvcHRpb25zKVxuICAgIHN1cGVyKGFyZ3MsIG9wdGlvbnMpXG5cbiAgcnVuSW1hZ2U6IChhcmdzLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZyhcIlJ1biBEb2NrZXIgZXhlY3V0YWJsZTogXCIsIGFyZ3MsIG9wdGlvbnMpXG4gICAgdGhpcy5yZXNvbHZlQXJncyhhcmdzKVxuICAgICAgLnRoZW4oKGFyZ3MpID0+XG4gICAgICAgIHsgY3dkIH0gPSBvcHRpb25zXG4gICAgICAgIHRtcERpciA9IG9zLnRtcGRpcigpXG4gICAgICAgIHB3ZCA9IGZzLnJlYWxwYXRoU3luYyhjd2Qgb3IgdG1wRGlyKVxuICAgICAgICBpbWFnZSA9IEBkb2NrZXJPcHRpb25zLmltYWdlXG4gICAgICAgIHdvcmtpbmdEaXIgPSBAZG9ja2VyT3B0aW9ucy53b3JraW5nRGlyXG5cbiAgICAgICAgcm9vdFBhdGggPSAnL21vdW50ZWRSb290J1xuICAgICAgICBuZXdBcmdzID0gYXJncy5tYXAoKGFyZykgLT5cbiAgICAgICAgICBpZiAodHlwZW9mIGFyZyBpcyAnc3RyaW5nJyBhbmQgbm90IGFyZy5pbmNsdWRlcygnOicpIFxcXG4gICAgICAgICAgICBhbmQgcGF0aC5pc0Fic29sdXRlKGFyZykgYW5kIG5vdCBwYXRoLmRpcm5hbWUoYXJnKS5zdGFydHNXaXRoKHRtcERpcikpXG4gICAgICAgICAgICB0aGVuIHBhdGguam9pbihyb290UGF0aCwgYXJnKSBlbHNlIGFyZ1xuICAgICAgICApXG5cbiAgICAgICAgQGRvY2tlci5ydW4oW1xuICAgICAgICAgICAgXCJydW5cIixcbiAgICAgICAgICAgIFwiLS12b2x1bWVcIiwgXCIje3B3ZH06I3t3b3JraW5nRGlyfVwiLFxuICAgICAgICAgICAgXCItLXZvbHVtZVwiLCBcIiN7cGF0aC5yZXNvbHZlKCcvJyl9OiN7cm9vdFBhdGh9XCIsXG4gICAgICAgICAgICBcIi0td29ya2RpclwiLCB3b3JraW5nRGlyLFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBuZXdBcmdzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEh5YnJpZEV4ZWN1dGFibGVcbiJdfQ==

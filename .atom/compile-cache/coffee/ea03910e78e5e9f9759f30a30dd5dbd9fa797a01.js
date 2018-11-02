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
            _this.verbose("Not required");
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
      this.verbose("HybridExecutable Options", options);
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
      return HybridExecutable.__super__.init.call(this).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (_this.docker == null) {
            return Promise.reject(error);
          }
          return Promise.resolve(error);
        };
      })(this)).then((function(_this) {
        return function(errorOrThis) {
          var shouldTryWithDocker;
          shouldTryWithDocker = !_this.isInstalled && (_this.docker != null);
          _this.verbose("Executable shouldTryWithDocker", shouldTryWithDocker, _this.isInstalled, _this.docker != null);
          if (shouldTryWithDocker) {
            return _this.initDocker()["catch"](function() {
              return Promise.reject(errorOrThis);
            });
          }
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };

    HybridExecutable.prototype.initDocker = function() {
      return this.docker.init().then((function(_this) {
        return function() {
          return _this.runImage(_this.versionArgs, _this.versionRunOptions);
        };
      })(this)).then((function(_this) {
        return function(text) {
          return _this.saveVersion(text);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.installedWithDocker = true;
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(dockerError) {
          _this.debug(dockerError);
          return Promise.reject(dockerError);
        };
      })(this));
    };

    HybridExecutable.prototype.run = function(args, options) {
      if (options == null) {
        options = {};
      }
      this.verbose("Running HybridExecutable");
      this.verbose("installedWithDocker", this.installedWithDocker);
      this.verbose("docker", this.docker);
      this.verbose("docker.isInstalled", this.docker && this.docker.isInstalled);
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
          return _this.docker.run(["run", "--rm", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], Object.assign({}, options, {
            cmd: void 0
          }));
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9leGVjdXRhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBQ2pDLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxlQUFBLEdBQWtCOztFQUdaO0FBRUosUUFBQTs7eUJBQUEsSUFBQSxHQUFNOzt5QkFDTixHQUFBLEdBQUs7O3lCQUNMLEdBQUEsR0FBSzs7eUJBQ0wsUUFBQSxHQUFVOzt5QkFDVixZQUFBLEdBQWM7O3lCQUNkLFdBQUEsR0FBYSxDQUFDLFdBQUQ7O3lCQUNiLFlBQUEsR0FBYyxTQUFDLElBQUQ7YUFBVSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWI7SUFBVjs7eUJBQ2QsaUJBQUEsR0FBbUI7O3lCQUNuQixpQkFBQSxHQUFtQjs7eUJBQ25CLFFBQUEsR0FBVTs7SUFFRyxvQkFBQyxPQUFEO0FBRVgsVUFBQTtNQUFBLElBQUksbUJBQUo7QUFDRSxjQUFNLElBQUksS0FBSixDQUFVLGdFQUFWLEVBRFI7O01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUM7TUFDaEIsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUM7TUFDZixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FB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LElBQUEsQ0FEUjtJQUZROzs7O0tBekVtQjs7RUF1Ry9CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBL2NqQiIsInNvdXJjZXNDb250ZW50IjpbIlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbndoaWNoID0gcmVxdWlyZSgnd2hpY2gnKVxuc3Bhd24gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd25cbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbnNlbXZlciA9IHJlcXVpcmUoJ3NlbXZlcicpXG5vcyA9IHJlcXVpcmUoJ29zJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuXG5wYXJlbnRDb25maWdLZXkgPSBcImF0b20tYmVhdXRpZnkuZXhlY3V0YWJsZXNcIlxuXG5cbmNsYXNzIEV4ZWN1dGFibGVcblxuICBuYW1lOiBudWxsXG4gIGNtZDogbnVsbFxuICBrZXk6IG51bGxcbiAgaG9tZXBhZ2U6IG51bGxcbiAgaW5zdGFsbGF0aW9uOiBudWxsXG4gIHZlcnNpb25BcmdzOiBbJy0tdmVyc2lvbiddXG4gIHZlcnNpb25QYXJzZTogKHRleHQpIC0+IHNlbXZlci5jbGVhbih0ZXh0KVxuICB2ZXJzaW9uUnVuT3B0aW9uczoge31cbiAgdmVyc2lvbnNTdXBwb3J0ZWQ6ICc+PSAwLjAuMCdcbiAgcmVxdWlyZWQ6IHRydWVcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAgIyBWYWxpZGF0aW9uXG4gICAgaWYgIW9wdGlvbnMuY21kP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbW1hbmQgKGkuZS4gY21kIHByb3BlcnR5KSBpcyByZXF1aXJlZCBmb3IgYW4gRXhlY3V0YWJsZS5cIilcbiAgICBAbmFtZSA9IG9wdGlvbnMubmFtZVxuICAgIEBjbWQgPSBvcHRpb25zLmNtZFxuICAgIEBrZXkgPSBAY21kXG4gICAgQGhvbWVwYWdlID0gb3B0aW9ucy5ob21lcGFnZVxuICAgIEBpbnN0YWxsYXRpb24gPSBvcHRpb25zLmluc3RhbGxhdGlvblxuICAgIEByZXF1aXJlZCA9IG5vdCBvcHRpb25zLm9wdGlvbmFsXG4gICAgaWYgb3B0aW9ucy52ZXJzaW9uP1xuICAgICAgdmVyc2lvbk9wdGlvbnMgPSBvcHRpb25zLnZlcnNpb25cbiAgICAgIEB2ZXJzaW9uQXJncyA9IHZlcnNpb25PcHRpb25zLmFyZ3MgaWYgdmVyc2lvbk9wdGlvbnMuYXJnc1xuICAgICAgQHZlcnNpb25QYXJzZSA9IHZlcnNpb25PcHRpb25zLnBhcnNlIGlmIHZlcnNpb25PcHRpb25zLnBhcnNlXG4gICAgICBAdmVyc2lvblJ1bk9wdGlvbnMgPSB2ZXJzaW9uT3B0aW9ucy5ydW5PcHRpb25zIGlmIHZlcnNpb25PcHRpb25zLnJ1bk9wdGlvbnNcbiAgICAgIEB2ZXJzaW9uc1N1cHBvcnRlZCA9IHZlcnNpb25PcHRpb25zLnN1cHBvcnRlZCBpZiB2ZXJzaW9uT3B0aW9ucy5zdXBwb3J0ZWRcbiAgICBAc2V0dXBMb2dnZXIoKVxuXG4gIGluaXQ6ICgpIC0+XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgQGxvYWRWZXJzaW9uKClcbiAgICBdKVxuICAgICAgLnRoZW4oKCkgPT4gQHZlcmJvc2UoXCJEb25lIGluaXQgb2YgI3tAbmFtZX1cIikpXG4gICAgICAudGhlbigoKSA9PiBAKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgaWYgbm90IEAucmVxdWlyZWRcbiAgICAgICAgICBAdmVyYm9zZShcIk5vdCByZXF1aXJlZFwiKVxuICAgICAgICAgIEBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFByb21pc2UucmVqZWN0KGVycm9yKVxuICAgICAgKVxuXG4gICMjI1xuICBMb2dnZXIgaW5zdGFuY2VcbiAgIyMjXG4gIGxvZ2dlcjogbnVsbFxuICAjIyNcbiAgSW5pdGlhbGl6ZSBhbmQgY29uZmlndXJlIExvZ2dlclxuICAjIyNcbiAgc2V0dXBMb2dnZXI6IC0+XG4gICAgQGxvZ2dlciA9IHJlcXVpcmUoJy4uL2xvZ2dlcicpKFwiI3tAbmFtZX0gRXhlY3V0YWJsZVwiKVxuICAgIGZvciBrZXksIG1ldGhvZCBvZiBAbG9nZ2VyXG4gICAgICBAW2tleV0gPSBtZXRob2RcbiAgICBAdmVyYm9zZShcIiN7QG5hbWV9IGV4ZWN1dGFibGUgbG9nZ2VyIGhhcyBiZWVuIGluaXRpYWxpemVkLlwiKVxuXG4gIGlzSW5zdGFsbGVkID0gbnVsbFxuICB2ZXJzaW9uID0gbnVsbFxuICBsb2FkVmVyc2lvbjogKGZvcmNlID0gZmFsc2UpIC0+XG4gICAgQHZlcmJvc2UoXCJsb2FkVmVyc2lvblwiLCBAdmVyc2lvbiwgZm9yY2UpXG4gICAgaWYgZm9yY2Ugb3IgIUB2ZXJzaW9uP1xuICAgICAgQHZlcmJvc2UoXCJMb2FkaW5nIHZlcnNpb24gd2l0aG91dCBjYWNoZVwiKVxuICAgICAgQHJ1blZlcnNpb24oKVxuICAgICAgICAudGhlbigodGV4dCkgPT4gQHNhdmVWZXJzaW9uKHRleHQpKVxuICAgIGVsc2VcbiAgICAgIEB2ZXJib3NlKFwiTG9hZGluZyBjYWNoZWQgdmVyc2lvblwiKVxuICAgICAgUHJvbWlzZS5yZXNvbHZlKEB2ZXJzaW9uKVxuXG4gIHJ1blZlcnNpb246ICgpIC0+XG4gICAgQHJ1bihAdmVyc2lvbkFyZ3MsIEB2ZXJzaW9uUnVuT3B0aW9ucylcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaW5mbyhcIlZlcnNpb24gdGV4dDogXCIgKyB2ZXJzaW9uKVxuICAgICAgICB2ZXJzaW9uXG4gICAgICApXG5cbiAgc2F2ZVZlcnNpb246ICh0ZXh0KSAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbiggPT4gQHZlcnNpb25QYXJzZSh0ZXh0KSlcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSAtPlxuICAgICAgICB2YWxpZCA9IEJvb2xlYW4oc2VtdmVyLnZhbGlkKHZlcnNpb24pKVxuICAgICAgICBpZiBub3QgdmFsaWRcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWZXJzaW9uIGlzIG5vdCB2YWxpZDogXCIrdmVyc2lvbilcbiAgICAgICAgdmVyc2lvblxuICAgICAgKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpc0luc3RhbGxlZCA9IHRydWVcbiAgICAgICAgQHZlcnNpb24gPSB2ZXJzaW9uXG4gICAgICApXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGluZm8oXCIje0BjbWR9IHZlcnNpb246ICN7dmVyc2lvbn1cIilcbiAgICAgICAgdmVyc2lvblxuICAgICAgKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgQGlzSW5zdGFsbGVkID0gZmFsc2VcbiAgICAgICAgQGVycm9yKGVycm9yKVxuICAgICAgICBoZWxwID0ge1xuICAgICAgICAgIHByb2dyYW06IEBjbWRcbiAgICAgICAgICBsaW5rOiBAaW5zdGFsbGF0aW9uIG9yIEBob21lcGFnZVxuICAgICAgICAgIHBhdGhPcHRpb246IFwiRXhlY3V0YWJsZSAtICN7QG5hbWUgb3IgQGNtZH0gLSBQYXRoXCJcbiAgICAgICAgfVxuICAgICAgICBQcm9taXNlLnJlamVjdChAY29tbWFuZE5vdEZvdW5kRXJyb3IoQG5hbWUgb3IgQGNtZCwgaGVscCkpXG4gICAgICApXG5cbiAgaXNTdXBwb3J0ZWQ6ICgpIC0+XG4gICAgQGlzVmVyc2lvbihAdmVyc2lvbnNTdXBwb3J0ZWQpXG5cbiAgaXNWZXJzaW9uOiAocmFuZ2UpIC0+XG4gICAgQHZlcnNpb25TYXRpc2ZpZXMoQHZlcnNpb24sIHJhbmdlKVxuXG4gIHZlcnNpb25TYXRpc2ZpZXM6ICh2ZXJzaW9uLCByYW5nZSkgLT5cbiAgICBzZW12ZXIuc2F0aXNmaWVzKHZlcnNpb24sIHJhbmdlKVxuXG4gIGdldENvbmZpZzogKCkgLT5cbiAgICBhdG9tPy5jb25maWcuZ2V0KFwiI3twYXJlbnRDb25maWdLZXl9LiN7QGtleX1cIikgb3Ige31cblxuICAjIyNcbiAgUnVuIGNvbW1hbmQtbGluZSBpbnRlcmZhY2UgY29tbWFuZFxuICAjIyNcbiAgcnVuOiAoYXJncywgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWJ1ZyhcIlJ1bjogXCIsIEBjbWQsIGFyZ3MsIG9wdGlvbnMpXG4gICAgeyBjbWQsIGN3ZCwgaWdub3JlUmV0dXJuQ29kZSwgaGVscCwgb25TdGRpbiwgcmV0dXJuU3RkZXJyLCByZXR1cm5TdGRvdXRPclN0ZGVyciB9ID0gb3B0aW9uc1xuICAgIGV4ZU5hbWUgPSBjbWQgb3IgQGNtZFxuICAgIGN3ZCA/PSBvcy50bXBkaXIoKVxuICAgIGhlbHAgPz0ge1xuICAgICAgcHJvZ3JhbTogQGNtZFxuICAgICAgbGluazogQGluc3RhbGxhdGlvbiBvciBAaG9tZXBhZ2VcbiAgICAgIHBhdGhPcHRpb246IFwiRXhlY3V0YWJsZSAtICN7QG5hbWUgb3IgQGNtZH0gLSBQYXRoXCJcbiAgICB9XG5cbiAgICAjIFJlc29sdmUgZXhlY3V0YWJsZSBhbmQgYWxsIGFyZ3NcbiAgICBQcm9taXNlLmFsbChbQHNoZWxsRW52KCksIHRoaXMucmVzb2x2ZUFyZ3MoYXJncyldKVxuICAgICAgLnRoZW4oKFtlbnYsIGFyZ3NdKSA9PlxuICAgICAgICBAZGVidWcoJ2V4ZU5hbWUsIGFyZ3M6JywgZXhlTmFtZSwgYXJncylcbiAgICAgICAgIyBHZXQgUEFUSCBhbmQgb3RoZXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgICAgIGV4ZVBhdGggPSBAcGF0aChleGVOYW1lKVxuICAgICAgICBQcm9taXNlLmFsbChbZXhlTmFtZSwgYXJncywgZW52LCBleGVQYXRoXSlcbiAgICAgIClcbiAgICAgIC50aGVuKChbZXhlTmFtZSwgYXJncywgZW52LCBleGVQYXRoXSkgPT5cbiAgICAgICAgQGRlYnVnKCdleGVQYXRoOicsIGV4ZVBhdGgpXG4gICAgICAgIEBkZWJ1ZygnZW52OicsIGVudilcbiAgICAgICAgQGRlYnVnKCdQQVRIOicsIGVudi5QQVRIKVxuICAgICAgICBAZGVidWcoJ2FyZ3MnLCBhcmdzKVxuICAgICAgICBhcmdzID0gdGhpcy5yZWxhdGl2aXplUGF0aHMoYXJncylcbiAgICAgICAgQGRlYnVnKCdyZWxhdGl2aXplZCBhcmdzJywgYXJncylcblxuICAgICAgICBleGUgPSBleGVQYXRoID8gZXhlTmFtZVxuICAgICAgICBzcGF3bk9wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkOiBjd2RcbiAgICAgICAgICBlbnY6IGVudlxuICAgICAgICB9XG4gICAgICAgIEBkZWJ1Zygnc3Bhd25PcHRpb25zJywgc3Bhd25PcHRpb25zKVxuXG4gICAgICAgIEBzcGF3bihleGUsIGFyZ3MsIHNwYXduT3B0aW9ucywgb25TdGRpbilcbiAgICAgICAgICAudGhlbigoe3JldHVybkNvZGUsIHN0ZG91dCwgc3RkZXJyfSkgPT5cbiAgICAgICAgICAgIEB2ZXJib3NlKCdzcGF3biByZXN1bHQsIHJldHVybkNvZGUnLCByZXR1cm5Db2RlKVxuICAgICAgICAgICAgQHZlcmJvc2UoJ3NwYXduIHJlc3VsdCwgc3Rkb3V0Jywgc3Rkb3V0KVxuICAgICAgICAgICAgQHZlcmJvc2UoJ3NwYXduIHJlc3VsdCwgc3RkZXJyJywgc3RkZXJyKVxuXG4gICAgICAgICAgICAjIElmIHJldHVybiBjb2RlIGlzIG5vdCAwIHRoZW4gZXJyb3Igb2NjdXJlZFxuICAgICAgICAgICAgaWYgbm90IGlnbm9yZVJldHVybkNvZGUgYW5kIHJldHVybkNvZGUgaXNudCAwXG4gICAgICAgICAgICAgICMgb3BlcmFibGUgcHJvZ3JhbSBvciBiYXRjaCBmaWxlXG4gICAgICAgICAgICAgIHdpbmRvd3NQcm9ncmFtTm90Rm91bmRNc2cgPSBcImlzIG5vdCByZWNvZ25pemVkIGFzIGFuIGludGVybmFsIG9yIGV4dGVybmFsIGNvbW1hbmRcIlxuXG4gICAgICAgICAgICAgIEB2ZXJib3NlKHN0ZGVyciwgd2luZG93c1Byb2dyYW1Ob3RGb3VuZE1zZylcblxuICAgICAgICAgICAgICBpZiBAaXNXaW5kb3dzKCkgYW5kIHJldHVybkNvZGUgaXMgMSBhbmQgc3RkZXJyLmluZGV4T2Yod2luZG93c1Byb2dyYW1Ob3RGb3VuZE1zZykgaXNudCAtMVxuICAgICAgICAgICAgICAgIHRocm93IEBjb21tYW5kTm90Rm91bmRFcnJvcihleGVOYW1lLCBoZWxwKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0ZGVyciBvciBzdGRvdXQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGlmIHJldHVyblN0ZG91dE9yU3RkZXJyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ZG91dCBvciBzdGRlcnJcbiAgICAgICAgICAgICAgZWxzZSBpZiByZXR1cm5TdGRlcnJcbiAgICAgICAgICAgICAgICBzdGRlcnJcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN0ZG91dFxuICAgICAgICAgIClcbiAgICAgICAgICAuY2F0Y2goKGVycikgPT5cbiAgICAgICAgICAgIEBkZWJ1ZygnZXJyb3InLCBlcnIpXG5cbiAgICAgICAgICAgICMgQ2hlY2sgaWYgZXJyb3IgaXMgRU5PRU5UIChjb21tYW5kIGNvdWxkIG5vdCBiZSBmb3VuZClcbiAgICAgICAgICAgIGlmIGVyci5jb2RlIGlzICdFTk9FTlQnIG9yIGVyci5lcnJubyBpcyAnRU5PRU5UJ1xuICAgICAgICAgICAgICB0aHJvdyBAY29tbWFuZE5vdEZvdW5kRXJyb3IoZXhlTmFtZSwgaGVscClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgIyBjb250aW51ZSBhcyBub3JtYWwgZXJyb3JcbiAgICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgICAgKVxuICAgICAgKVxuXG4gIHBhdGg6IChjbWQgPSBAY21kKSAtPlxuICAgIGNvbmZpZyA9IEBnZXRDb25maWcoKVxuICAgIGlmIGNvbmZpZyBhbmQgY29uZmlnLnBhdGhcbiAgICAgIFByb21pc2UucmVzb2x2ZShjb25maWcucGF0aClcbiAgICBlbHNlXG4gICAgICBleGVOYW1lID0gY21kXG4gICAgICBAd2hpY2goZXhlTmFtZSlcblxuICByZXNvbHZlQXJnczogKGFyZ3MpIC0+XG4gICAgYXJncyA9IF8uZmxhdHRlbihhcmdzKVxuICAgIFByb21pc2UuYWxsKGFyZ3MpXG5cbiAgcmVsYXRpdml6ZVBhdGhzOiAoYXJncykgLT5cbiAgICB0bXBEaXIgPSBvcy50bXBkaXIoKVxuICAgIG5ld0FyZ3MgPSBhcmdzLm1hcCgoYXJnKSAtPlxuICAgICAgaXNUbXBGaWxlID0gKHR5cGVvZiBhcmcgaXMgJ3N0cmluZycgYW5kIG5vdCBhcmcuaW5jbHVkZXMoJzonKSBhbmQgXFxcbiAgICAgICAgcGF0aC5pc0Fic29sdXRlKGFyZykgYW5kIHBhdGguZGlybmFtZShhcmcpLnN0YXJ0c1dpdGgodG1wRGlyKSlcbiAgICAgIGlmIGlzVG1wRmlsZVxuICAgICAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZSh0bXBEaXIsIGFyZylcbiAgICAgIHJldHVybiBhcmdcbiAgICApXG4gICAgbmV3QXJnc1xuXG4gICMjI1xuICBTcGF3blxuICAjIyNcbiAgc3Bhd246IChleGUsIGFyZ3MsIG9wdGlvbnMsIG9uU3RkaW4pIC0+XG4gICAgIyBSZW1vdmUgdW5kZWZpbmVkL251bGwgdmFsdWVzXG4gICAgYXJncyA9IF8ud2l0aG91dChhcmdzLCB1bmRlZmluZWQpXG4gICAgYXJncyA9IF8ud2l0aG91dChhcmdzLCBudWxsKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAZGVidWcoJ3NwYXduJywgZXhlLCBhcmdzKVxuXG4gICAgICBjbWQgPSBzcGF3bihleGUsIGFyZ3MsIG9wdGlvbnMpXG4gICAgICBzdGRvdXQgPSBcIlwiXG4gICAgICBzdGRlcnIgPSBcIlwiXG5cbiAgICAgIGNtZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgLT5cbiAgICAgICAgc3Rkb3V0ICs9IGRhdGFcbiAgICAgIClcbiAgICAgIGNtZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgLT5cbiAgICAgICAgc3RkZXJyICs9IGRhdGFcbiAgICAgIClcbiAgICAgIGNtZC5vbignY2xvc2UnLCAocmV0dXJuQ29kZSkgPT5cbiAgICAgICAgQGRlYnVnKCdzcGF3biBkb25lJywgcmV0dXJuQ29kZSwgc3RkZXJyLCBzdGRvdXQpXG4gICAgICAgIHJlc29sdmUoe3JldHVybkNvZGUsIHN0ZG91dCwgc3RkZXJyfSlcbiAgICAgIClcbiAgICAgIGNtZC5vbignZXJyb3InLCAoZXJyKSA9PlxuICAgICAgICBAZGVidWcoJ2Vycm9yJywgZXJyKVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgKVxuXG4gICAgICBvblN0ZGluIGNtZC5zdGRpbiBpZiBvblN0ZGluXG4gICAgKVxuXG5cbiAgIyMjXG4gIEFkZCBoZWxwIHRvIGVycm9yLmRlc2NyaXB0aW9uXG5cbiAgTm90ZTogZXJyb3IuZGVzY3JpcHRpb24gaXMgbm90IG9mZmljaWFsbHkgdXNlZCBpbiBKYXZhU2NyaXB0LFxuICBob3dldmVyIGl0IGlzIHVzZWQgaW50ZXJuYWxseSBmb3IgQXRvbSBCZWF1dGlmeSB3aGVuIGRpc3BsYXlpbmcgZXJyb3JzLlxuICAjIyNcbiAgY29tbWFuZE5vdEZvdW5kRXJyb3I6IChleGUsIGhlbHApIC0+XG4gICAgZXhlID89IEBuYW1lIG9yIEBjbWRcbiAgICBAY29uc3RydWN0b3IuY29tbWFuZE5vdEZvdW5kRXJyb3IoZXhlLCBoZWxwKVxuXG4gIEBjb21tYW5kTm90Rm91bmRFcnJvcjogKGV4ZSwgaGVscCkgLT5cbiAgICAjIENyZWF0ZSBuZXcgaW1wcm92ZWQgZXJyb3JcbiAgICAjIG5vdGlmeSB1c2VyIHRoYXQgaXQgbWF5IG5vdCBiZVxuICAgICMgaW5zdGFsbGVkIG9yIGluIHBhdGhcbiAgICBtZXNzYWdlID0gXCJDb3VsZCBub3QgZmluZCAnI3tleGV9Jy4gXFxcbiAgICAgICAgICAgIFRoZSBwcm9ncmFtIG1heSBub3QgYmUgaW5zdGFsbGVkLlwiXG4gICAgZXIgPSBuZXcgRXJyb3IobWVzc2FnZSlcbiAgICBlci5jb2RlID0gJ0NvbW1hbmROb3RGb3VuZCdcbiAgICBlci5lcnJubyA9IGVyLmNvZGVcbiAgICBlci5zeXNjYWxsID0gJ2JlYXV0aWZpZXI6OnJ1bidcbiAgICBlci5maWxlID0gZXhlXG4gICAgaWYgaGVscD9cbiAgICAgIGlmIHR5cGVvZiBoZWxwIGlzIFwib2JqZWN0XCJcbiAgICAgICAgIyBCYXNpYyBub3RpY2VcbiAgICAgICAgZG9jc0xpbmsgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeSNiZWF1dGlmaWVyc1wiXG4gICAgICAgIGhlbHBTdHIgPSBcIlNlZSAje2V4ZX0gaW5zdGFsbGF0aW9uIGluc3RydWN0aW9ucyBhdCAje2RvY3NMaW5rfSN7aWYgaGVscC5saW5rIHRoZW4gKCcgb3IgZ28gdG8gJytoZWxwLmxpbmspIGVsc2UgJyd9XFxuXCJcbiAgICAgICAgIyAjIEhlbHAgdG8gY29uZmlndXJlIEF0b20gQmVhdXRpZnkgZm9yIHByb2dyYW0ncyBwYXRoXG4gICAgICAgIGhlbHBTdHIgKz0gXCJZb3UgY2FuIGNvbmZpZ3VyZSBBdG9tIEJlYXV0aWZ5IFxcXG4gICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGFic29sdXRlIHBhdGggXFxcbiAgICAgICAgICAgICAgICAgICAgdG8gJyN7aGVscC5wcm9ncmFtIG9yIGV4ZX0nIGJ5IHNldHRpbmcgXFxcbiAgICAgICAgICAgICAgICAgICAgJyN7aGVscC5wYXRoT3B0aW9ufScgaW4gXFxcbiAgICAgICAgICAgICAgICAgICAgdGhlIEF0b20gQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5ncy5cXG5cIiBpZiBoZWxwLnBhdGhPcHRpb25cbiAgICAgICAgaGVscFN0ciArPSBcIllvdXIgcHJvZ3JhbSBpcyBwcm9wZXJseSBpbnN0YWxsZWQgaWYgcnVubmluZyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcje2lmIEBpc1dpbmRvd3MoKSB0aGVuICd3aGVyZS5leGUnIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAnd2hpY2gnfSAje2V4ZX0nIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4geW91ciAje2lmIEBpc1dpbmRvd3MoKSB0aGVuICdDTUQgcHJvbXB0JyBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgJ1Rlcm1pbmFsJ30gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5zIGFuIGFic29sdXRlIHBhdGggdG8gdGhlIGV4ZWN1dGFibGUuXFxuXCJcbiAgICAgICAgIyAjIE9wdGlvbmFsLCBhZGRpdGlvbmFsIGhlbHBcbiAgICAgICAgaGVscFN0ciArPSBoZWxwLmFkZGl0aW9uYWwgaWYgaGVscC5hZGRpdGlvbmFsXG4gICAgICAgIGVyLmRlc2NyaXB0aW9uID0gaGVscFN0clxuICAgICAgZWxzZSAjaWYgdHlwZW9mIGhlbHAgaXMgXCJzdHJpbmdcIlxuICAgICAgICBlci5kZXNjcmlwdGlvbiA9IGhlbHBcbiAgICByZXR1cm4gZXJcblxuXG4gIEBfZW52Q2FjaGUgPSBudWxsXG4gIHNoZWxsRW52OiAoKSAtPlxuICAgIGVudiA9IEBjb25zdHJ1Y3Rvci5zaGVsbEVudigpXG4gICAgQGRlYnVnKFwiZW52XCIsIGVudilcbiAgICByZXR1cm4gZW52XG4gIEBzaGVsbEVudjogKCkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUocHJvY2Vzcy5lbnYpXG5cbiAgIyMjXG4gIExpa2UgdGhlIHVuaXggd2hpY2ggdXRpbGl0eS5cblxuICBGaW5kcyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYSBzcGVjaWZpZWQgZXhlY3V0YWJsZSBpbiB0aGUgUEFUSCBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAgRG9lcyBub3QgY2FjaGUgdGhlIHJlc3VsdHMsXG4gIHNvIGhhc2ggLXIgaXMgbm90IG5lZWRlZCB3aGVuIHRoZSBQQVRIIGNoYW5nZXMuXG4gIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtd2hpY2hcbiAgIyMjXG4gIHdoaWNoOiAoZXhlLCBvcHRpb25zKSAtPlxuICAgIEAuY29uc3RydWN0b3Iud2hpY2goZXhlLCBvcHRpb25zKVxuICBAX3doaWNoQ2FjaGUgPSB7fVxuICBAd2hpY2g6IChleGUsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBpZiBAX3doaWNoQ2FjaGVbZXhlXVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShAX3doaWNoQ2FjaGVbZXhlXSlcbiAgICAjIEdldCBQQVRIIGFuZCBvdGhlciBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICBAc2hlbGxFbnYoKVxuICAgICAgLnRoZW4oKGVudikgPT5cbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICBvcHRpb25zLnBhdGggPz0gZW52LlBBVEhcbiAgICAgICAgICBpZiBAaXNXaW5kb3dzKClcbiAgICAgICAgICAgICMgRW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlIGluIHdpbmRvd3NcbiAgICAgICAgICAgICMgQ2hlY2sgZW52IGZvciBhIGNhc2UtaW5zZW5zaXRpdmUgJ3BhdGgnIHZhcmlhYmxlXG4gICAgICAgICAgICBpZiAhb3B0aW9ucy5wYXRoXG4gICAgICAgICAgICAgIGZvciBpIG9mIGVudlxuICAgICAgICAgICAgICAgIGlmIGkudG9Mb3dlckNhc2UoKSBpcyBcInBhdGhcIlxuICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wYXRoID0gZW52W2ldXG4gICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAjIFRyaWNrIG5vZGUtd2hpY2ggaW50byBpbmNsdWRpbmcgZmlsZXNcbiAgICAgICAgICAgICMgd2l0aCBubyBleHRlbnNpb24gYXMgZXhlY3V0YWJsZXMuXG4gICAgICAgICAgICAjIFB1dCBlbXB0eSBleHRlbnNpb24gbGFzdCB0byBhbGxvdyBmb3Igb3RoZXIgcmVhbCBleHRlbnNpb25zIGZpcnN0XG4gICAgICAgICAgICBvcHRpb25zLnBhdGhFeHQgPz0gXCIje3Byb2Nlc3MuZW52LlBBVEhFWFQgPyAnLkVYRSd9O1wiXG4gICAgICAgICAgd2hpY2goZXhlLCBvcHRpb25zLCAoZXJyLCBwYXRoKSA9PlxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXhlKSBpZiBlcnJcbiAgICAgICAgICAgIEBfd2hpY2hDYWNoZVtleGVdID0gcGF0aFxuICAgICAgICAgICAgcmVzb2x2ZShwYXRoKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICMjI1xuICBJZiBwbGF0Zm9ybSBpcyBXaW5kb3dzXG4gICMjI1xuICBpc1dpbmRvd3M6ICgpIC0+IEBjb25zdHJ1Y3Rvci5pc1dpbmRvd3MoKVxuICBAaXNXaW5kb3dzOiAoKSAtPiBuZXcgUmVnRXhwKCded2luJykudGVzdChwcm9jZXNzLnBsYXRmb3JtKVxuXG5jbGFzcyBIeWJyaWRFeGVjdXRhYmxlIGV4dGVuZHMgRXhlY3V0YWJsZVxuXG4gIGRvY2tlck9wdGlvbnM6IHtcbiAgICBpbWFnZTogdW5kZWZpbmVkXG4gICAgd29ya2luZ0RpcjogXCIvd29ya2RpclwiXG4gIH1cblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICBAdmVyYm9zZShcIkh5YnJpZEV4ZWN1dGFibGUgT3B0aW9uc1wiLCBvcHRpb25zKVxuICAgIGlmIG9wdGlvbnMuZG9ja2VyP1xuICAgICAgQGRvY2tlck9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBAZG9ja2VyT3B0aW9ucywgb3B0aW9ucy5kb2NrZXIpXG4gICAgICBAZG9ja2VyID0gQGNvbnN0cnVjdG9yLmRvY2tlckV4ZWN1dGFibGUoKVxuXG4gIEBkb2NrZXI6IHVuZGVmaW5lZFxuICBAZG9ja2VyRXhlY3V0YWJsZTogKCkgLT5cbiAgICBpZiBub3QgQGRvY2tlcj9cbiAgICAgIEBkb2NrZXIgPSBuZXcgRXhlY3V0YWJsZSh7XG4gICAgICAgIG5hbWU6IFwiRG9ja2VyXCJcbiAgICAgICAgY21kOiBcImRvY2tlclwiXG4gICAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vd3d3LmRvY2tlci5jb20vXCJcbiAgICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vd3d3LmRvY2tlci5jb20vZ2V0LWRvY2tlclwiXG4gICAgICAgIHZlcnNpb246IHtcbiAgICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL3ZlcnNpb24gWzBdKihbMS05XVxcZCopLlswXSooWzAtOV1cXGQqKS5bMF0qKFswLTldXFxkKikvKS5zbGljZSgxKS5qb2luKCcuJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gQGRvY2tlclxuXG4gIGluc3RhbGxlZFdpdGhEb2NrZXI6IGZhbHNlXG4gIGluaXQ6ICgpIC0+XG4gICAgc3VwZXIoKVxuICAgICAgLnRoZW4oKCkgPT5cbiAgICAgICAgcmV0dXJuIEBcbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcikgaWYgbm90IEBkb2NrZXI/XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXJyb3IpXG4gICAgICApXG4gICAgICAudGhlbigoZXJyb3JPclRoaXMpID0+XG4gICAgICAgIHNob3VsZFRyeVdpdGhEb2NrZXIgPSBub3QgQGlzSW5zdGFsbGVkIGFuZCBAZG9ja2VyP1xuICAgICAgICBAdmVyYm9zZShcIkV4ZWN1dGFibGUgc2hvdWxkVHJ5V2l0aERvY2tlclwiLCBzaG91bGRUcnlXaXRoRG9ja2VyLCBAaXNJbnN0YWxsZWQsIEBkb2NrZXI/KVxuICAgICAgICBpZiBzaG91bGRUcnlXaXRoRG9ja2VyXG4gICAgICAgICAgcmV0dXJuIEBpbml0RG9ja2VyKCkuY2F0Y2goKCkgLT4gUHJvbWlzZS5yZWplY3QoZXJyb3JPclRoaXMpKVxuICAgICAgICByZXR1cm4gQFxuICAgICAgKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgaWYgbm90IEAucmVxdWlyZWRcbiAgICAgICAgICBAdmVyYm9zZShcIk5vdCByZXF1aXJlZFwiKVxuICAgICAgICAgIEBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFByb21pc2UucmVqZWN0KGVycm9yKVxuICAgICAgKVxuXG4gIGluaXREb2NrZXI6ICgpIC0+XG4gICAgQGRvY2tlci5pbml0KClcbiAgICAgIC50aGVuKD0+IEBydW5JbWFnZShAdmVyc2lvbkFyZ3MsIEB2ZXJzaW9uUnVuT3B0aW9ucykpXG4gICAgICAudGhlbigodGV4dCkgPT4gQHNhdmVWZXJzaW9uKHRleHQpKVxuICAgICAgLnRoZW4oKCkgPT4gQGluc3RhbGxlZFdpdGhEb2NrZXIgPSB0cnVlKVxuICAgICAgLnRoZW4oPT4gQClcbiAgICAgIC5jYXRjaCgoZG9ja2VyRXJyb3IpID0+XG4gICAgICAgIEBkZWJ1Zyhkb2NrZXJFcnJvcilcbiAgICAgICAgUHJvbWlzZS5yZWplY3QoZG9ja2VyRXJyb3IpXG4gICAgICApXG5cbiAgcnVuOiAoYXJncywgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEB2ZXJib3NlKFwiUnVubmluZyBIeWJyaWRFeGVjdXRhYmxlXCIpXG4gICAgQHZlcmJvc2UoXCJpbnN0YWxsZWRXaXRoRG9ja2VyXCIsIEBpbnN0YWxsZWRXaXRoRG9ja2VyKVxuICAgIEB2ZXJib3NlKFwiZG9ja2VyXCIsIEBkb2NrZXIpXG4gICAgQHZlcmJvc2UoXCJkb2NrZXIuaXNJbnN0YWxsZWRcIiwgQGRvY2tlciBhbmQgQGRvY2tlci5pc0luc3RhbGxlZClcbiAgICBpZiBAaW5zdGFsbGVkV2l0aERvY2tlciBhbmQgQGRvY2tlciBhbmQgQGRvY2tlci5pc0luc3RhbGxlZFxuICAgICAgcmV0dXJuIEBydW5JbWFnZShhcmdzLCBvcHRpb25zKVxuICAgIHN1cGVyKGFyZ3MsIG9wdGlvbnMpXG5cbiAgcnVuSW1hZ2U6IChhcmdzLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZyhcIlJ1biBEb2NrZXIgZXhlY3V0YWJsZTogXCIsIGFyZ3MsIG9wdGlvbnMpXG4gICAgdGhpcy5yZXNvbHZlQXJncyhhcmdzKVxuICAgICAgLnRoZW4oKGFyZ3MpID0+XG4gICAgICAgIHsgY3dkIH0gPSBvcHRpb25zXG4gICAgICAgIHRtcERpciA9IG9zLnRtcGRpcigpXG4gICAgICAgIHB3ZCA9IGZzLnJlYWxwYXRoU3luYyhjd2Qgb3IgdG1wRGlyKVxuICAgICAgICBpbWFnZSA9IEBkb2NrZXJPcHRpb25zLmltYWdlXG4gICAgICAgIHdvcmtpbmdEaXIgPSBAZG9ja2VyT3B0aW9ucy53b3JraW5nRGlyXG5cbiAgICAgICAgcm9vdFBhdGggPSAnL21vdW50ZWRSb290J1xuICAgICAgICBuZXdBcmdzID0gYXJncy5tYXAoKGFyZykgLT5cbiAgICAgICAgICBpZiAodHlwZW9mIGFyZyBpcyAnc3RyaW5nJyBhbmQgbm90IGFyZy5pbmNsdWRlcygnOicpIFxcXG4gICAgICAgICAgICBhbmQgcGF0aC5pc0Fic29sdXRlKGFyZykgYW5kIG5vdCBwYXRoLmRpcm5hbWUoYXJnKS5zdGFydHNXaXRoKHRtcERpcikpIFxcXG4gICAgICAgICAgICB0aGVuIHBhdGguam9pbihyb290UGF0aCwgYXJnKSBlbHNlIGFyZ1xuICAgICAgICApXG5cbiAgICAgICAgQGRvY2tlci5ydW4oW1xuICAgICAgICAgICAgXCJydW5cIixcbiAgICAgICAgICAgIFwiLS1ybVwiLFxuICAgICAgICAgICAgXCItLXZvbHVtZVwiLCBcIiN7cHdkfToje3dvcmtpbmdEaXJ9XCIsXG4gICAgICAgICAgICBcIi0tdm9sdW1lXCIsIFwiI3twYXRoLnJlc29sdmUoJy8nKX06I3tyb290UGF0aH1cIixcbiAgICAgICAgICAgIFwiLS13b3JrZGlyXCIsIHdvcmtpbmdEaXIsXG4gICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgIG5ld0FyZ3NcbiAgICAgICAgICBdLFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgY21kOiB1bmRlZmluZWQgfSlcbiAgICAgICAgKVxuICAgICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh5YnJpZEV4ZWN1dGFibGVcbiJdfQ==

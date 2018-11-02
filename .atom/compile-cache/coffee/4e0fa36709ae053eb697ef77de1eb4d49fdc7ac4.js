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
          return _this.docker.run(["run", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], Object.assign({}, options, {
            cmd: void 0
          }));
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9leGVjdXRhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBQ2pDLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxlQUFBLEdBQWtCOztFQUdaO0FBRUosUUFBQTs7eUJBQUEsSUFBQSxHQUFNOzt5QkFDTixHQUFBLEdBQUs7O3lCQUNMLEdBQUEsR0FBSzs7eUJBQ0wsUUFBQSxHQUFVOzt5QkFDVixZQUFBLEdBQWM7O3lCQUNkLFdBQUEsR0FBYSxDQUFDLFdBQUQ7O3lCQUNiLFlBQUEsR0FBYyxTQUFDLElBQUQ7YUFBVSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWI7SUFBVjs7eUJBQ2QsaUJBQUEsR0FBbUI7O3lCQUNuQixpQkFBQSxHQUFtQjs7eUJBQ25CLFFBQUEsR0FBVTs7SUFFRyxvQkFBQyxPQUFEO0FBRVgsVUFBQTtNQUFBLElBQUksbUJBQUo7QUFDRSxjQUFNLElBQUksS0FBSixDQUFVLGdFQUFWLEVBRFI7O01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUM7TUFDaEIsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUM7TUFDZixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FB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O0lBRlE7Ozs7S0F6RW1COztFQXNHL0IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE5Y2pCIiwic291cmNlc0NvbnRlbnQiOlsiUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxud2hpY2ggPSByZXF1aXJlKCd3aGljaCcpXG5zcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3blxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuc2VtdmVyID0gcmVxdWlyZSgnc2VtdmVyJylcbm9zID0gcmVxdWlyZSgnb3MnKVxuZnMgPSByZXF1aXJlKCdmcycpXG5cbnBhcmVudENvbmZpZ0tleSA9IFwiYXRvbS1iZWF1dGlmeS5leGVjdXRhYmxlc1wiXG5cblxuY2xhc3MgRXhlY3V0YWJsZVxuXG4gIG5hbWU6IG51bGxcbiAgY21kOiBudWxsXG4gIGtleTogbnVsbFxuICBob21lcGFnZTogbnVsbFxuICBpbnN0YWxsYXRpb246IG51bGxcbiAgdmVyc2lvbkFyZ3M6IFsnLS12ZXJzaW9uJ11cbiAgdmVyc2lvblBhcnNlOiAodGV4dCkgLT4gc2VtdmVyLmNsZWFuKHRleHQpXG4gIHZlcnNpb25SdW5PcHRpb25zOiB7fVxuICB2ZXJzaW9uc1N1cHBvcnRlZDogJz49IDAuMC4wJ1xuICByZXF1aXJlZDogdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICAjIFZhbGlkYXRpb25cbiAgICBpZiAhb3B0aW9ucy5jbWQ/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY29tbWFuZCAoaS5lLiBjbWQgcHJvcGVydHkpIGlzIHJlcXVpcmVkIGZvciBhbiBFeGVjdXRhYmxlLlwiKVxuICAgIEBuYW1lID0gb3B0aW9ucy5uYW1lXG4gICAgQGNtZCA9IG9wdGlvbnMuY21kXG4gICAgQGtleSA9IEBjbWRcbiAgICBAaG9tZXBhZ2UgPSBvcHRpb25zLmhvbWVwYWdlXG4gICAgQGluc3RhbGxhdGlvbiA9IG9wdGlvbnMuaW5zdGFsbGF0aW9uXG4gICAgQHJlcXVpcmVkID0gbm90IG9wdGlvbnMub3B0aW9uYWxcbiAgICBpZiBvcHRpb25zLnZlcnNpb24/XG4gICAgICB2ZXJzaW9uT3B0aW9ucyA9IG9wdGlvbnMudmVyc2lvblxuICAgICAgQHZlcnNpb25BcmdzID0gdmVyc2lvbk9wdGlvbnMuYXJncyBpZiB2ZXJzaW9uT3B0aW9ucy5hcmdzXG4gICAgICBAdmVyc2lvblBhcnNlID0gdmVyc2lvbk9wdGlvbnMucGFyc2UgaWYgdmVyc2lvbk9wdGlvbnMucGFyc2VcbiAgICAgIEB2ZXJzaW9uUnVuT3B0aW9ucyA9IHZlcnNpb25PcHRpb25zLnJ1bk9wdGlvbnMgaWYgdmVyc2lvbk9wdGlvbnMucnVuT3B0aW9uc1xuICAgICAgQHZlcnNpb25zU3VwcG9ydGVkID0gdmVyc2lvbk9wdGlvbnMuc3VwcG9ydGVkIGlmIHZlcnNpb25PcHRpb25zLnN1cHBvcnRlZFxuICAgIEBzZXR1cExvZ2dlcigpXG5cbiAgaW5pdDogKCkgLT5cbiAgICBQcm9taXNlLmFsbChbXG4gICAgICBAbG9hZFZlcnNpb24oKVxuICAgIF0pXG4gICAgICAudGhlbigoKSA9PiBAdmVyYm9zZShcIkRvbmUgaW5pdCBvZiAje0BuYW1lfVwiKSlcbiAgICAgIC50aGVuKCgpID0+IEApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBpZiBub3QgQC5yZXF1aXJlZFxuICAgICAgICAgIEB2ZXJib3NlKFwiTm90IHJlcXVpcmVkXCIpXG4gICAgICAgICAgQFxuICAgICAgICBlbHNlXG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICApXG5cbiAgIyMjXG4gIExvZ2dlciBpbnN0YW5jZVxuICAjIyNcbiAgbG9nZ2VyOiBudWxsXG4gICMjI1xuICBJbml0aWFsaXplIGFuZCBjb25maWd1cmUgTG9nZ2VyXG4gICMjI1xuICBzZXR1cExvZ2dlcjogLT5cbiAgICBAbG9nZ2VyID0gcmVxdWlyZSgnLi4vbG9nZ2VyJykoXCIje0BuYW1lfSBFeGVjdXRhYmxlXCIpXG4gICAgZm9yIGtleSwgbWV0aG9kIG9mIEBsb2dnZXJcbiAgICAgIEBba2V5XSA9IG1ldGhvZFxuICAgIEB2ZXJib3NlKFwiI3tAbmFtZX0gZXhlY3V0YWJsZSBsb2dnZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXCIpXG5cbiAgaXNJbnN0YWxsZWQgPSBudWxsXG4gIHZlcnNpb24gPSBudWxsXG4gIGxvYWRWZXJzaW9uOiAoZm9yY2UgPSBmYWxzZSkgLT5cbiAgICBAdmVyYm9zZShcImxvYWRWZXJzaW9uXCIsIEB2ZXJzaW9uLCBmb3JjZSlcbiAgICBpZiBmb3JjZSBvciAhQHZlcnNpb24/XG4gICAgICBAdmVyYm9zZShcIkxvYWRpbmcgdmVyc2lvbiB3aXRob3V0IGNhY2hlXCIpXG4gICAgICBAcnVuVmVyc2lvbigpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiBAc2F2ZVZlcnNpb24odGV4dCkpXG4gICAgZWxzZVxuICAgICAgQHZlcmJvc2UoXCJMb2FkaW5nIGNhY2hlZCB2ZXJzaW9uXCIpXG4gICAgICBQcm9taXNlLnJlc29sdmUoQHZlcnNpb24pXG5cbiAgcnVuVmVyc2lvbjogKCkgLT5cbiAgICBAcnVuKEB2ZXJzaW9uQXJncywgQHZlcnNpb25SdW5PcHRpb25zKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpbmZvKFwiVmVyc2lvbiB0ZXh0OiBcIiArIHZlcnNpb24pXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcblxuICBzYXZlVmVyc2lvbjogKHRleHQpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuKCA9PiBAdmVyc2lvblBhcnNlKHRleHQpKVxuICAgICAgLnRoZW4oKHZlcnNpb24pIC0+XG4gICAgICAgIHZhbGlkID0gQm9vbGVhbihzZW12ZXIudmFsaWQodmVyc2lvbikpXG4gICAgICAgIGlmIG5vdCB2YWxpZFxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZlcnNpb24gaXMgbm90IHZhbGlkOiBcIit2ZXJzaW9uKVxuICAgICAgICB2ZXJzaW9uXG4gICAgICApXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGlzSW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgICBAdmVyc2lvbiA9IHZlcnNpb25cbiAgICAgIClcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaW5mbyhcIiN7QGNtZH0gdmVyc2lvbjogI3t2ZXJzaW9ufVwiKVxuICAgICAgICB2ZXJzaW9uXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBAaXNJbnN0YWxsZWQgPSBmYWxzZVxuICAgICAgICBAZXJyb3IoZXJyb3IpXG4gICAgICAgIGhlbHAgPSB7XG4gICAgICAgICAgcHJvZ3JhbTogQGNtZFxuICAgICAgICAgIGxpbms6IEBpbnN0YWxsYXRpb24gb3IgQGhvbWVwYWdlXG4gICAgICAgICAgcGF0aE9wdGlvbjogXCJFeGVjdXRhYmxlIC0gI3tAbmFtZSBvciBAY21kfSAtIFBhdGhcIlxuICAgICAgICB9XG4gICAgICAgIFByb21pc2UucmVqZWN0KEBjb21tYW5kTm90Rm91bmRFcnJvcihAbmFtZSBvciBAY21kLCBoZWxwKSlcbiAgICAgIClcblxuICBpc1N1cHBvcnRlZDogKCkgLT5cbiAgICBAaXNWZXJzaW9uKEB2ZXJzaW9uc1N1cHBvcnRlZClcblxuICBpc1ZlcnNpb246IChyYW5nZSkgLT5cbiAgICBAdmVyc2lvblNhdGlzZmllcyhAdmVyc2lvbiwgcmFuZ2UpXG5cbiAgdmVyc2lvblNhdGlzZmllczogKHZlcnNpb24sIHJhbmdlKSAtPlxuICAgIHNlbXZlci5zYXRpc2ZpZXModmVyc2lvbiwgcmFuZ2UpXG5cbiAgZ2V0Q29uZmlnOiAoKSAtPlxuICAgIGF0b20/LmNvbmZpZy5nZXQoXCIje3BhcmVudENvbmZpZ0tleX0uI3tAa2V5fVwiKSBvciB7fVxuXG4gICMjI1xuICBSdW4gY29tbWFuZC1saW5lIGludGVyZmFjZSBjb21tYW5kXG4gICMjI1xuICBydW46IChhcmdzLCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlYnVnKFwiUnVuOiBcIiwgQGNtZCwgYXJncywgb3B0aW9ucylcbiAgICB7IGNtZCwgY3dkLCBpZ25vcmVSZXR1cm5Db2RlLCBoZWxwLCBvblN0ZGluLCByZXR1cm5TdGRlcnIsIHJldHVyblN0ZG91dE9yU3RkZXJyIH0gPSBvcHRpb25zXG4gICAgZXhlTmFtZSA9IGNtZCBvciBAY21kXG4gICAgY3dkID89IG9zLnRtcGRpcigpXG4gICAgaGVscCA/PSB7XG4gICAgICBwcm9ncmFtOiBAY21kXG4gICAgICBsaW5rOiBAaW5zdGFsbGF0aW9uIG9yIEBob21lcGFnZVxuICAgICAgcGF0aE9wdGlvbjogXCJFeGVjdXRhYmxlIC0gI3tAbmFtZSBvciBAY21kfSAtIFBhdGhcIlxuICAgIH1cblxuICAgICMgUmVzb2x2ZSBleGVjdXRhYmxlIGFuZCBhbGwgYXJnc1xuICAgIFByb21pc2UuYWxsKFtAc2hlbGxFbnYoKSwgdGhpcy5yZXNvbHZlQXJncyhhcmdzKV0pXG4gICAgICAudGhlbigoW2VudiwgYXJnc10pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlTmFtZSwgYXJnczonLCBleGVOYW1lLCBhcmdzKVxuICAgICAgICAjIEdldCBQQVRIIGFuZCBvdGhlciBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICAgICAgZXhlUGF0aCA9IEBwYXRoKGV4ZU5hbWUpXG4gICAgICAgIFByb21pc2UuYWxsKFtleGVOYW1lLCBhcmdzLCBlbnYsIGV4ZVBhdGhdKVxuICAgICAgKVxuICAgICAgLnRoZW4oKFtleGVOYW1lLCBhcmdzLCBlbnYsIGV4ZVBhdGhdKSA9PlxuICAgICAgICBAZGVidWcoJ2V4ZVBhdGg6JywgZXhlUGF0aClcbiAgICAgICAgQGRlYnVnKCdlbnY6JywgZW52KVxuICAgICAgICBAZGVidWcoJ1BBVEg6JywgZW52LlBBVEgpXG4gICAgICAgIEBkZWJ1ZygnYXJncycsIGFyZ3MpXG4gICAgICAgIGFyZ3MgPSB0aGlzLnJlbGF0aXZpemVQYXRocyhhcmdzKVxuICAgICAgICBAZGVidWcoJ3JlbGF0aXZpemVkIGFyZ3MnLCBhcmdzKVxuXG4gICAgICAgIGV4ZSA9IGV4ZVBhdGggPyBleGVOYW1lXG4gICAgICAgIHNwYXduT3B0aW9ucyA9IHtcbiAgICAgICAgICBjd2Q6IGN3ZFxuICAgICAgICAgIGVudjogZW52XG4gICAgICAgIH1cbiAgICAgICAgQGRlYnVnKCdzcGF3bk9wdGlvbnMnLCBzcGF3bk9wdGlvbnMpXG5cbiAgICAgICAgQHNwYXduKGV4ZSwgYXJncywgc3Bhd25PcHRpb25zLCBvblN0ZGluKVxuICAgICAgICAgIC50aGVuKCh7cmV0dXJuQ29kZSwgc3Rkb3V0LCBzdGRlcnJ9KSA9PlxuICAgICAgICAgICAgQHZlcmJvc2UoJ3NwYXduIHJlc3VsdCwgcmV0dXJuQ29kZScsIHJldHVybkNvZGUpXG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCBzdGRvdXQnLCBzdGRvdXQpXG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCBzdGRlcnInLCBzdGRlcnIpXG5cbiAgICAgICAgICAgICMgSWYgcmV0dXJuIGNvZGUgaXMgbm90IDAgdGhlbiBlcnJvciBvY2N1cmVkXG4gICAgICAgICAgICBpZiBub3QgaWdub3JlUmV0dXJuQ29kZSBhbmQgcmV0dXJuQ29kZSBpc250IDBcbiAgICAgICAgICAgICAgIyBvcGVyYWJsZSBwcm9ncmFtIG9yIGJhdGNoIGZpbGVcbiAgICAgICAgICAgICAgd2luZG93c1Byb2dyYW1Ob3RGb3VuZE1zZyA9IFwiaXMgbm90IHJlY29nbml6ZWQgYXMgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgY29tbWFuZFwiXG5cbiAgICAgICAgICAgICAgQHZlcmJvc2Uoc3RkZXJyLCB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnKVxuXG4gICAgICAgICAgICAgIGlmIEBpc1dpbmRvd3MoKSBhbmQgcmV0dXJuQ29kZSBpcyAxIGFuZCBzdGRlcnIuaW5kZXhPZih3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnKSBpc250IC0xXG4gICAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyIG9yIHN0ZG91dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgaWYgcmV0dXJuU3Rkb3V0T3JTdGRlcnJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Rkb3V0IG9yIHN0ZGVyclxuICAgICAgICAgICAgICBlbHNlIGlmIHJldHVyblN0ZGVyclxuICAgICAgICAgICAgICAgIHN0ZGVyclxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3Rkb3V0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PlxuICAgICAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcblxuICAgICAgICAgICAgIyBDaGVjayBpZiBlcnJvciBpcyBFTk9FTlQgKGNvbW1hbmQgY291bGQgbm90IGJlIGZvdW5kKVxuICAgICAgICAgICAgaWYgZXJyLmNvZGUgaXMgJ0VOT0VOVCcgb3IgZXJyLmVycm5vIGlzICdFTk9FTlQnXG4gICAgICAgICAgICAgIHRocm93IEBjb21tYW5kTm90Rm91bmRFcnJvcihleGVOYW1lLCBoZWxwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAjIGNvbnRpbnVlIGFzIG5vcm1hbCBlcnJvclxuICAgICAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgICApXG4gICAgICApXG5cbiAgcGF0aDogKGNtZCA9IEBjbWQpIC0+XG4gICAgY29uZmlnID0gQGdldENvbmZpZygpXG4gICAgaWYgY29uZmlnIGFuZCBjb25maWcucGF0aFxuICAgICAgUHJvbWlzZS5yZXNvbHZlKGNvbmZpZy5wYXRoKVxuICAgIGVsc2VcbiAgICAgIGV4ZU5hbWUgPSBjbWRcbiAgICAgIEB3aGljaChleGVOYW1lKVxuXG4gIHJlc29sdmVBcmdzOiAoYXJncykgLT5cbiAgICBhcmdzID0gXy5mbGF0dGVuKGFyZ3MpXG4gICAgUHJvbWlzZS5hbGwoYXJncylcblxuICByZWxhdGl2aXplUGF0aHM6IChhcmdzKSAtPlxuICAgIHRtcERpciA9IG9zLnRtcGRpcigpXG4gICAgbmV3QXJncyA9IGFyZ3MubWFwKChhcmcpIC0+XG4gICAgICBpc1RtcEZpbGUgPSAodHlwZW9mIGFyZyBpcyAnc3RyaW5nJyBhbmQgbm90IGFyZy5pbmNsdWRlcygnOicpIGFuZCBcXFxuICAgICAgICBwYXRoLmlzQWJzb2x1dGUoYXJnKSBhbmQgcGF0aC5kaXJuYW1lKGFyZykuc3RhcnRzV2l0aCh0bXBEaXIpKVxuICAgICAgaWYgaXNUbXBGaWxlXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRtcERpciwgYXJnKVxuICAgICAgcmV0dXJuIGFyZ1xuICAgIClcbiAgICBuZXdBcmdzXG5cbiAgIyMjXG4gIFNwYXduXG4gICMjI1xuICBzcGF3bjogKGV4ZSwgYXJncywgb3B0aW9ucywgb25TdGRpbikgLT5cbiAgICAjIFJlbW92ZSB1bmRlZmluZWQvbnVsbCB2YWx1ZXNcbiAgICBhcmdzID0gXy53aXRob3V0KGFyZ3MsIHVuZGVmaW5lZClcbiAgICBhcmdzID0gXy53aXRob3V0KGFyZ3MsIG51bGwpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBkZWJ1Zygnc3Bhd24nLCBleGUsIGFyZ3MpXG5cbiAgICAgIGNtZCA9IHNwYXduKGV4ZSwgYXJncywgb3B0aW9ucylcbiAgICAgIHN0ZG91dCA9IFwiXCJcbiAgICAgIHN0ZGVyciA9IFwiXCJcblxuICAgICAgY21kLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSAtPlxuICAgICAgICBzdGRvdXQgKz0gZGF0YVxuICAgICAgKVxuICAgICAgY21kLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSAtPlxuICAgICAgICBzdGRlcnIgKz0gZGF0YVxuICAgICAgKVxuICAgICAgY21kLm9uKCdjbG9zZScsIChyZXR1cm5Db2RlKSA9PlxuICAgICAgICBAZGVidWcoJ3NwYXduIGRvbmUnLCByZXR1cm5Db2RlLCBzdGRlcnIsIHN0ZG91dClcbiAgICAgICAgcmVzb2x2ZSh7cmV0dXJuQ29kZSwgc3Rkb3V0LCBzdGRlcnJ9KVxuICAgICAgKVxuICAgICAgY21kLm9uKCdlcnJvcicsIChlcnIpID0+XG4gICAgICAgIEBkZWJ1ZygnZXJyb3InLCBlcnIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICApXG5cbiAgICAgIG9uU3RkaW4gY21kLnN0ZGluIGlmIG9uU3RkaW5cbiAgICApXG5cblxuICAjIyNcbiAgQWRkIGhlbHAgdG8gZXJyb3IuZGVzY3JpcHRpb25cblxuICBOb3RlOiBlcnJvci5kZXNjcmlwdGlvbiBpcyBub3Qgb2ZmaWNpYWxseSB1c2VkIGluIEphdmFTY3JpcHQsXG4gIGhvd2V2ZXIgaXQgaXMgdXNlZCBpbnRlcm5hbGx5IGZvciBBdG9tIEJlYXV0aWZ5IHdoZW4gZGlzcGxheWluZyBlcnJvcnMuXG4gICMjI1xuICBjb21tYW5kTm90Rm91bmRFcnJvcjogKGV4ZSwgaGVscCkgLT5cbiAgICBleGUgPz0gQG5hbWUgb3IgQGNtZFxuICAgIEBjb25zdHJ1Y3Rvci5jb21tYW5kTm90Rm91bmRFcnJvcihleGUsIGhlbHApXG5cbiAgQGNvbW1hbmROb3RGb3VuZEVycm9yOiAoZXhlLCBoZWxwKSAtPlxuICAgICMgQ3JlYXRlIG5ldyBpbXByb3ZlZCBlcnJvclxuICAgICMgbm90aWZ5IHVzZXIgdGhhdCBpdCBtYXkgbm90IGJlXG4gICAgIyBpbnN0YWxsZWQgb3IgaW4gcGF0aFxuICAgIG1lc3NhZ2UgPSBcIkNvdWxkIG5vdCBmaW5kICcje2V4ZX0nLiBcXFxuICAgICAgICAgICAgVGhlIHByb2dyYW0gbWF5IG5vdCBiZSBpbnN0YWxsZWQuXCJcbiAgICBlciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgIGVyLmNvZGUgPSAnQ29tbWFuZE5vdEZvdW5kJ1xuICAgIGVyLmVycm5vID0gZXIuY29kZVxuICAgIGVyLnN5c2NhbGwgPSAnYmVhdXRpZmllcjo6cnVuJ1xuICAgIGVyLmZpbGUgPSBleGVcbiAgICBpZiBoZWxwP1xuICAgICAgaWYgdHlwZW9mIGhlbHAgaXMgXCJvYmplY3RcIlxuICAgICAgICAjIEJhc2ljIG5vdGljZVxuICAgICAgICBkb2NzTGluayA9IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5I2JlYXV0aWZpZXJzXCJcbiAgICAgICAgaGVscFN0ciA9IFwiU2VlICN7ZXhlfSBpbnN0YWxsYXRpb24gaW5zdHJ1Y3Rpb25zIGF0ICN7ZG9jc0xpbmt9I3tpZiBoZWxwLmxpbmsgdGhlbiAoJyBvciBnbyB0byAnK2hlbHAubGluaykgZWxzZSAnJ31cXG5cIlxuICAgICAgICAjICMgSGVscCB0byBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBmb3IgcHJvZ3JhbSdzIHBhdGhcbiAgICAgICAgaGVscFN0ciArPSBcIllvdSBjYW4gY29uZmlndXJlIEF0b20gQmVhdXRpZnkgXFxcbiAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgYWJzb2x1dGUgcGF0aCBcXFxuICAgICAgICAgICAgICAgICAgICB0byAnI3toZWxwLnByb2dyYW0gb3IgZXhlfScgYnkgc2V0dGluZyBcXFxuICAgICAgICAgICAgICAgICAgICAnI3toZWxwLnBhdGhPcHRpb259JyBpbiBcXFxuICAgICAgICAgICAgICAgICAgICB0aGUgQXRvbSBCZWF1dGlmeSBwYWNrYWdlIHNldHRpbmdzLlxcblwiIGlmIGhlbHAucGF0aE9wdGlvblxuICAgICAgICBoZWxwU3RyICs9IFwiWW91ciBwcm9ncmFtIGlzIHByb3Blcmx5IGluc3RhbGxlZCBpZiBydW5uaW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyN7aWYgQGlzV2luZG93cygpIHRoZW4gJ3doZXJlLmV4ZScgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICd3aGljaCd9ICN7ZXhlfScgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB5b3VyICN7aWYgQGlzV2luZG93cygpIHRoZW4gJ0NNRCBwcm9tcHQnIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAnVGVybWluYWwnfSBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybnMgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZXhlY3V0YWJsZS5cXG5cIlxuICAgICAgICAjICMgT3B0aW9uYWwsIGFkZGl0aW9uYWwgaGVscFxuICAgICAgICBoZWxwU3RyICs9IGhlbHAuYWRkaXRpb25hbCBpZiBoZWxwLmFkZGl0aW9uYWxcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwU3RyXG4gICAgICBlbHNlICNpZiB0eXBlb2YgaGVscCBpcyBcInN0cmluZ1wiXG4gICAgICAgIGVyLmRlc2NyaXB0aW9uID0gaGVscFxuICAgIHJldHVybiBlclxuXG5cbiAgQF9lbnZDYWNoZSA9IG51bGxcbiAgc2hlbGxFbnY6ICgpIC0+XG4gICAgZW52ID0gQGNvbnN0cnVjdG9yLnNoZWxsRW52KClcbiAgICBAZGVidWcoXCJlbnZcIiwgZW52KVxuICAgIHJldHVybiBlbnZcbiAgQHNoZWxsRW52OiAoKSAtPlxuICAgIFByb21pc2UucmVzb2x2ZShwcm9jZXNzLmVudilcblxuICAjIyNcbiAgTGlrZSB0aGUgdW5peCB3aGljaCB1dGlsaXR5LlxuXG4gIEZpbmRzIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhIHNwZWNpZmllZCBleGVjdXRhYmxlIGluIHRoZSBQQVRIIGVudmlyb25tZW50IHZhcmlhYmxlLlxuICBEb2VzIG5vdCBjYWNoZSB0aGUgcmVzdWx0cyxcbiAgc28gaGFzaCAtciBpcyBub3QgbmVlZGVkIHdoZW4gdGhlIFBBVEggY2hhbmdlcy5cbiAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS13aGljaFxuICAjIyNcbiAgd2hpY2g6IChleGUsIG9wdGlvbnMpIC0+XG4gICAgQC5jb25zdHJ1Y3Rvci53aGljaChleGUsIG9wdGlvbnMpXG4gIEBfd2hpY2hDYWNoZSA9IHt9XG4gIEB3aGljaDogKGV4ZSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGlmIEBfd2hpY2hDYWNoZVtleGVdXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEBfd2hpY2hDYWNoZVtleGVdKVxuICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgIEBzaGVsbEVudigpXG4gICAgICAudGhlbigoZW52KSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgIG9wdGlvbnMucGF0aCA/PSBlbnYuUEFUSFxuICAgICAgICAgIGlmIEBpc1dpbmRvd3MoKVxuICAgICAgICAgICAgIyBFbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgaW4gd2luZG93c1xuICAgICAgICAgICAgIyBDaGVjayBlbnYgZm9yIGEgY2FzZS1pbnNlbnNpdGl2ZSAncGF0aCcgdmFyaWFibGVcbiAgICAgICAgICAgIGlmICFvcHRpb25zLnBhdGhcbiAgICAgICAgICAgICAgZm9yIGkgb2YgZW52XG4gICAgICAgICAgICAgICAgaWYgaS50b0xvd2VyQ2FzZSgpIGlzIFwicGF0aFwiXG4gICAgICAgICAgICAgICAgICBvcHRpb25zLnBhdGggPSBlbnZbaV1cbiAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICMgVHJpY2sgbm9kZS13aGljaCBpbnRvIGluY2x1ZGluZyBmaWxlc1xuICAgICAgICAgICAgIyB3aXRoIG5vIGV4dGVuc2lvbiBhcyBleGVjdXRhYmxlcy5cbiAgICAgICAgICAgICMgUHV0IGVtcHR5IGV4dGVuc2lvbiBsYXN0IHRvIGFsbG93IGZvciBvdGhlciByZWFsIGV4dGVuc2lvbnMgZmlyc3RcbiAgICAgICAgICAgIG9wdGlvbnMucGF0aEV4dCA/PSBcIiN7cHJvY2Vzcy5lbnYuUEFUSEVYVCA/ICcuRVhFJ307XCJcbiAgICAgICAgICB3aGljaChleGUsIG9wdGlvbnMsIChlcnIsIHBhdGgpID0+XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShleGUpIGlmIGVyclxuICAgICAgICAgICAgQF93aGljaENhY2hlW2V4ZV0gPSBwYXRoXG4gICAgICAgICAgICByZXNvbHZlKHBhdGgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgIyMjXG4gIElmIHBsYXRmb3JtIGlzIFdpbmRvd3NcbiAgIyMjXG4gIGlzV2luZG93czogKCkgLT4gQGNvbnN0cnVjdG9yLmlzV2luZG93cygpXG4gIEBpc1dpbmRvd3M6ICgpIC0+IG5ldyBSZWdFeHAoJ153aW4nKS50ZXN0KHByb2Nlc3MucGxhdGZvcm0pXG5cbmNsYXNzIEh5YnJpZEV4ZWN1dGFibGUgZXh0ZW5kcyBFeGVjdXRhYmxlXG5cbiAgZG9ja2VyT3B0aW9uczoge1xuICAgIGltYWdlOiB1bmRlZmluZWRcbiAgICB3b3JraW5nRGlyOiBcIi93b3JrZGlyXCJcbiAgfVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBzdXBlcihvcHRpb25zKVxuICAgIEB2ZXJib3NlKFwiSHlicmlkRXhlY3V0YWJsZSBPcHRpb25zXCIsIG9wdGlvbnMpXG4gICAgaWYgb3B0aW9ucy5kb2NrZXI/XG4gICAgICBAZG9ja2VyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIEBkb2NrZXJPcHRpb25zLCBvcHRpb25zLmRvY2tlcilcbiAgICAgIEBkb2NrZXIgPSBAY29uc3RydWN0b3IuZG9ja2VyRXhlY3V0YWJsZSgpXG5cbiAgQGRvY2tlcjogdW5kZWZpbmVkXG4gIEBkb2NrZXJFeGVjdXRhYmxlOiAoKSAtPlxuICAgIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgQGRvY2tlciA9IG5ldyBFeGVjdXRhYmxlKHtcbiAgICAgICAgbmFtZTogXCJEb2NrZXJcIlxuICAgICAgICBjbWQ6IFwiZG9ja2VyXCJcbiAgICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9cIlxuICAgICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9nZXQtZG9ja2VyXCJcbiAgICAgICAgdmVyc2lvbjoge1xuICAgICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiBbMF0qKFsxLTldXFxkKikuWzBdKihbMC05XVxcZCopLlswXSooWzAtOV1cXGQqKS8pLnNsaWNlKDEpLmpvaW4oJy4nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiBAZG9ja2VyXG5cbiAgaW5zdGFsbGVkV2l0aERvY2tlcjogZmFsc2VcbiAgaW5pdDogKCkgLT5cbiAgICBzdXBlcigpXG4gICAgICAudGhlbigoKSA9PlxuICAgICAgICByZXR1cm4gQFxuICAgICAgKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKSBpZiBub3QgQGRvY2tlcj9cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlcnJvcilcbiAgICAgIClcbiAgICAgIC50aGVuKChlcnJvck9yVGhpcykgPT5cbiAgICAgICAgc2hvdWxkVHJ5V2l0aERvY2tlciA9IG5vdCBAaXNJbnN0YWxsZWQgYW5kIEBkb2NrZXI/XG4gICAgICAgIEB2ZXJib3NlKFwiRXhlY3V0YWJsZSBzaG91bGRUcnlXaXRoRG9ja2VyXCIsIHNob3VsZFRyeVdpdGhEb2NrZXIsIEBpc0luc3RhbGxlZCwgQGRvY2tlcj8pXG4gICAgICAgIGlmIHNob3VsZFRyeVdpdGhEb2NrZXJcbiAgICAgICAgICByZXR1cm4gQGluaXREb2NrZXIoKS5jYXRjaCgoKSAtPiBQcm9taXNlLnJlamVjdChlcnJvck9yVGhpcykpXG4gICAgICAgIHJldHVybiBAXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBpZiBub3QgQC5yZXF1aXJlZFxuICAgICAgICAgIEB2ZXJib3NlKFwiTm90IHJlcXVpcmVkXCIpXG4gICAgICAgICAgQFxuICAgICAgICBlbHNlXG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICApXG5cbiAgaW5pdERvY2tlcjogKCkgLT5cbiAgICBAZG9ja2VyLmluaXQoKVxuICAgICAgLnRoZW4oPT4gQHJ1bkltYWdlKEB2ZXJzaW9uQXJncywgQHZlcnNpb25SdW5PcHRpb25zKSlcbiAgICAgIC50aGVuKCh0ZXh0KSA9PiBAc2F2ZVZlcnNpb24odGV4dCkpXG4gICAgICAudGhlbigoKSA9PiBAaW5zdGFsbGVkV2l0aERvY2tlciA9IHRydWUpXG4gICAgICAudGhlbig9PiBAKVxuICAgICAgLmNhdGNoKChkb2NrZXJFcnJvcikgPT5cbiAgICAgICAgQGRlYnVnKGRvY2tlckVycm9yKVxuICAgICAgICBQcm9taXNlLnJlamVjdChkb2NrZXJFcnJvcilcbiAgICAgIClcblxuICBydW46IChhcmdzLCBvcHRpb25zID0ge30pIC0+XG4gICAgQHZlcmJvc2UoXCJSdW5uaW5nIEh5YnJpZEV4ZWN1dGFibGVcIilcbiAgICBAdmVyYm9zZShcImluc3RhbGxlZFdpdGhEb2NrZXJcIiwgQGluc3RhbGxlZFdpdGhEb2NrZXIpXG4gICAgQHZlcmJvc2UoXCJkb2NrZXJcIiwgQGRvY2tlcilcbiAgICBAdmVyYm9zZShcImRvY2tlci5pc0luc3RhbGxlZFwiLCBAZG9ja2VyIGFuZCBAZG9ja2VyLmlzSW5zdGFsbGVkKVxuICAgIGlmIEBpbnN0YWxsZWRXaXRoRG9ja2VyIGFuZCBAZG9ja2VyIGFuZCBAZG9ja2VyLmlzSW5zdGFsbGVkXG4gICAgICByZXR1cm4gQHJ1bkltYWdlKGFyZ3MsIG9wdGlvbnMpXG4gICAgc3VwZXIoYXJncywgb3B0aW9ucylcblxuICBydW5JbWFnZTogKGFyZ3MsIG9wdGlvbnMpIC0+XG4gICAgQGRlYnVnKFwiUnVuIERvY2tlciBleGVjdXRhYmxlOiBcIiwgYXJncywgb3B0aW9ucylcbiAgICB0aGlzLnJlc29sdmVBcmdzKGFyZ3MpXG4gICAgICAudGhlbigoYXJncykgPT5cbiAgICAgICAgeyBjd2QgfSA9IG9wdGlvbnNcbiAgICAgICAgdG1wRGlyID0gb3MudG1wZGlyKClcbiAgICAgICAgcHdkID0gZnMucmVhbHBhdGhTeW5jKGN3ZCBvciB0bXBEaXIpXG4gICAgICAgIGltYWdlID0gQGRvY2tlck9wdGlvbnMuaW1hZ2VcbiAgICAgICAgd29ya2luZ0RpciA9IEBkb2NrZXJPcHRpb25zLndvcmtpbmdEaXJcblxuICAgICAgICByb290UGF0aCA9ICcvbW91bnRlZFJvb3QnXG4gICAgICAgIG5ld0FyZ3MgPSBhcmdzLm1hcCgoYXJnKSAtPlxuICAgICAgICAgIGlmICh0eXBlb2YgYXJnIGlzICdzdHJpbmcnIGFuZCBub3QgYXJnLmluY2x1ZGVzKCc6JykgXFxcbiAgICAgICAgICAgIGFuZCBwYXRoLmlzQWJzb2x1dGUoYXJnKSBhbmQgbm90IHBhdGguZGlybmFtZShhcmcpLnN0YXJ0c1dpdGgodG1wRGlyKSkgXFxcbiAgICAgICAgICAgIHRoZW4gcGF0aC5qb2luKHJvb3RQYXRoLCBhcmcpIGVsc2UgYXJnXG4gICAgICAgIClcblxuICAgICAgICBAZG9ja2VyLnJ1bihbXG4gICAgICAgICAgICBcInJ1blwiLFxuICAgICAgICAgICAgXCItLXZvbHVtZVwiLCBcIiN7cHdkfToje3dvcmtpbmdEaXJ9XCIsXG4gICAgICAgICAgICBcIi0tdm9sdW1lXCIsIFwiI3twYXRoLnJlc29sdmUoJy8nKX06I3tyb290UGF0aH1cIixcbiAgICAgICAgICAgIFwiLS13b3JrZGlyXCIsIHdvcmtpbmdEaXIsXG4gICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgIG5ld0FyZ3NcbiAgICAgICAgICBdLFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgY21kOiB1bmRlZmluZWQgfSlcbiAgICAgICAgKVxuICAgICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh5YnJpZEV4ZWN1dGFibGVcbiJdfQ==

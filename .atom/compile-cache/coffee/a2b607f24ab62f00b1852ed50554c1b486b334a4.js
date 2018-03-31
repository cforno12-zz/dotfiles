(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('async');

  fs = require('fs');

  path = require('path');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath1, config) {
      var ignoreVcsIgnores, repo;
      this.rootPath = rootPath1;
      this.timestamp = config.timestamp, this.sourceNames = config.sourceNames, ignoreVcsIgnores = config.ignoreVcsIgnores, this.traverseSymlinkDirectories = config.traverseSymlinkDirectories, this.ignoredNames = config.ignoredNames, this.knownPaths = config.knownPaths;
      if (this.knownPaths == null) {
        this.knownPaths = [];
      }
      this.paths = [];
      this.lostPaths = [];
      this.scannedPaths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var i, len, p, ref, ref1;
          ref = _this.knownPaths;
          for (i = 0, len = ref.length; i < len; i++) {
            p = ref[i];
            if (indexOf.call(_this.scannedPaths, p) < 0 && p.indexOf(_this.rootPath) === 0) {
              _this.lostPaths.push(p);
            }
          }
          _this.flushPaths();
          if ((ref1 = _this.repo) != null) {
            ref1.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isSource = function(loadedPath) {
      var i, len, ref, relativePath, sourceName;
      relativePath = path.relative(this.rootPath, loadedPath);
      ref = this.sourceNames;
      for (i = 0, len = ref.length; i < len; i++) {
        sourceName = ref[i];
        if (sourceName.match(relativePath)) {
          return true;
        }
      }
    };

    PathLoader.prototype.isIgnored = function(loadedPath, stats) {
      var i, ignoredName, len, ref, ref1, relativePath;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((ref = this.repo) != null ? ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        ref1 = this.ignoredNames;
        for (i = 0, len = ref1.length; i < len; i++) {
          ignoredName = ref1[i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
        return false;
      }
    };

    PathLoader.prototype.isKnown = function(loadedPath) {
      return indexOf.call(this.knownPaths, loadedPath) >= 0;
    };

    PathLoader.prototype.hasChanged = function(loadedPath, stats) {
      if (stats && (this.timestamp != null)) {
        return stats.ctime >= this.timestamp;
      } else {
        return false;
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, stats, done) {
      this.scannedPaths.push(loadedPath);
      if (this.isSource(loadedPath) && !this.isIgnored(loadedPath, stats)) {
        if (this.isKnown(loadedPath)) {
          if (this.hasChanged(loadedPath, stats)) {
            this.paths.push(loadedPath);
          }
        } else {
          this.paths.push(loadedPath);
        }
      } else {
        if (indexOf.call(this.knownPaths, loadedPath) >= 0) {
          this.lostPaths.push(loadedPath);
        }
      }
      if (this.paths.length + this.lostPaths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      if (this.paths.length) {
        emit('load-paths:paths-found', this.paths);
      }
      if (this.lostPaths.length) {
        emit('load-paths:paths-lost', this.lostPaths);
      }
      this.paths = [];
      return this.lostPaths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, stats, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, stats, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(config) {
    var error, i, ignore, j, len, len1, newConf, ref, ref1, source;
    newConf = {
      ignoreVcsIgnores: config.ignoreVcsIgnores,
      traverseSymlinkDirectories: config.traverseSymlinkDirectories,
      knownPaths: config.knownPaths,
      ignoredNames: [],
      sourceNames: []
    };
    if (config.timestamp != null) {
      newConf.timestamp = new Date(Date.parse(config.timestamp));
    }
    ref = config.sourceNames;
    for (i = 0, len = ref.length; i < len; i++) {
      source = ref[i];
      if (source) {
        try {
          newConf.sourceNames.push(new Minimatch(source, {
            matchBase: true,
            dot: true
          }));
        } catch (error1) {
          error = error1;
          console.warn("Error parsing source pattern (" + source + "): " + error.message);
        }
      }
    }
    ref1 = config.ignoredNames;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      ignore = ref1[j];
      if (ignore) {
        try {
          newConf.ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (error1) {
          error = error1;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    return async.each(config.paths, function(rootPath, next) {
      return new PathLoader(rootPath, newConf).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3MvbG9hZC1wYXRocy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQTs7RUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixnQkFBaUIsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLFlBQWEsT0FBQSxDQUFRLFdBQVI7O0VBRWQsY0FBQSxHQUFpQjs7RUFFWDtJQUNVLG9CQUFDLFNBQUQsRUFBWSxNQUFaO0FBQ1osVUFBQTtNQURhLElBQUMsQ0FBQSxXQUFEO01BQ1osSUFBQyxDQUFBLG1CQUFBLFNBQUYsRUFBYSxJQUFDLENBQUEscUJBQUEsV0FBZCxFQUEyQiwwQ0FBM0IsRUFBNkMsSUFBQyxDQUFBLG9DQUFBLDBCQUE5QyxFQUEwRSxJQUFDLENBQUEsc0JBQUEsWUFBM0UsRUFBeUYsSUFBQyxDQUFBLG9CQUFBOztRQUUxRixJQUFDLENBQUEsYUFBYzs7TUFDZixJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BRWhCLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFHLGdCQUFIO1FBQ0UsSUFBQSxHQUFPLGFBQWEsQ0FBQyxJQUFkLENBQW1CLElBQUMsQ0FBQSxRQUFwQixFQUE4QjtVQUFBLG9CQUFBLEVBQXNCLEtBQXRCO1NBQTlCO1FBQ1Asb0JBQWdCLElBQUksQ0FBRSxVQUFOLENBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLFFBQVgsRUFBcUIsTUFBckIsQ0FBakIsV0FBQSxLQUFrRCxNQUFsRTtVQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FBUjtTQUZGOztJQVRZOzt5QkFhZCxJQUFBLEdBQU0sU0FBQyxJQUFEO2FBQ0osSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsUUFBWCxFQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDbkIsY0FBQTtBQUFBO0FBQUEsZUFBQSxxQ0FBQTs7WUFDRSxJQUFHLGFBQVMsS0FBQyxDQUFBLFlBQVYsRUFBQSxDQUFBLEtBQUEsSUFBMkIsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFDLENBQUEsUUFBWCxDQUFBLEtBQXdCLENBQXREO2NBQ0UsS0FBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLENBQWhCLEVBREY7O0FBREY7VUFJQSxLQUFDLENBQUEsVUFBRCxDQUFBOztnQkFDSyxDQUFFLE9BQVAsQ0FBQTs7aUJBQ0EsSUFBQSxDQUFBO1FBUG1CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtJQURJOzt5QkFVTixRQUFBLEdBQVUsU0FBQyxVQUFEO0FBQ1IsVUFBQTtNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxRQUFmLEVBQXlCLFVBQXpCO0FBQ2Y7QUFBQSxXQUFBLHFDQUFBOztRQUNFLElBQWUsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsWUFBakIsQ0FBZjtBQUFBLGlCQUFPLEtBQVA7O0FBREY7SUFGUTs7eUJBS1YsU0FBQSxHQUFXLFNBQUMsVUFBRCxFQUFhLEtBQWI7QUFDVCxVQUFBO01BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLFFBQWYsRUFBeUIsVUFBekI7TUFDZixtQ0FBUSxDQUFFLGFBQVAsQ0FBcUIsWUFBckIsVUFBSDtlQUNFLEtBREY7T0FBQSxNQUFBO0FBR0U7QUFBQSxhQUFBLHNDQUFBOztVQUNFLElBQWUsV0FBVyxDQUFDLEtBQVosQ0FBa0IsWUFBbEIsQ0FBZjtBQUFBLG1CQUFPLEtBQVA7O0FBREY7QUFHQSxlQUFPLE1BTlQ7O0lBRlM7O3lCQVVYLE9BQUEsR0FBUyxTQUFDLFVBQUQ7YUFBZ0IsYUFBYyxJQUFDLENBQUEsVUFBZixFQUFBLFVBQUE7SUFBaEI7O3lCQUVULFVBQUEsR0FBWSxTQUFDLFVBQUQsRUFBYSxLQUFiO01BQ1YsSUFBRyxLQUFBLElBQVUsd0JBQWI7ZUFDRSxLQUFLLENBQUMsS0FBTixJQUFlLElBQUMsQ0FBQSxVQURsQjtPQUFBLE1BQUE7ZUFHRSxNQUhGOztJQURVOzt5QkFNWixVQUFBLEdBQVksU0FBQyxVQUFELEVBQWEsS0FBYixFQUFvQixJQUFwQjtNQUNWLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixVQUFuQjtNQUNBLElBQUcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxVQUFWLENBQUEsSUFBMEIsQ0FBQyxJQUFDLENBQUEsU0FBRCxDQUFXLFVBQVgsRUFBdUIsS0FBdkIsQ0FBOUI7UUFDRSxJQUFHLElBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxDQUFIO1VBQ0UsSUFBMkIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLEtBQXhCLENBQTNCO1lBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksVUFBWixFQUFBO1dBREY7U0FBQSxNQUFBO1VBR0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksVUFBWixFQUhGO1NBREY7T0FBQSxNQUFBO1FBTUUsSUFBK0IsYUFBYyxJQUFDLENBQUEsVUFBZixFQUFBLFVBQUEsTUFBL0I7VUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsVUFBaEIsRUFBQTtTQU5GOztNQVFBLElBQWlCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQTNCLEtBQXFDLGNBQXREO1FBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUFBOzthQUNBLElBQUEsQ0FBQTtJQVhVOzt5QkFhWixVQUFBLEdBQVksU0FBQTtNQUNWLElBQTBDLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBakQ7UUFBQSxJQUFBLENBQUssd0JBQUwsRUFBK0IsSUFBQyxDQUFBLEtBQWhDLEVBQUE7O01BQ0EsSUFBNkMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF4RDtRQUFBLElBQUEsQ0FBSyx1QkFBTCxFQUE4QixJQUFDLENBQUEsU0FBL0IsRUFBQTs7TUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO2FBQ1QsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUpIOzt5QkFNWixRQUFBLEdBQVUsU0FBQyxVQUFELEVBQWEsSUFBYjtNQUNSLElBQWlCLElBQUMsQ0FBQSxTQUFELENBQVcsVUFBWCxDQUFqQjtBQUFBLGVBQU8sSUFBQSxDQUFBLEVBQVA7O2FBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxVQUFULEVBQXFCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsS0FBUjtVQUNuQixJQUFpQixhQUFqQjtBQUFBLG1CQUFPLElBQUEsQ0FBQSxFQUFQOztVQUNBLElBQUcsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQUFIO21CQUNFLEVBQUUsQ0FBQyxJQUFILENBQVEsVUFBUixFQUFvQixTQUFDLEtBQUQsRUFBUSxLQUFSO2NBQ2xCLElBQWlCLGFBQWpCO0FBQUEsdUJBQU8sSUFBQSxDQUFBLEVBQVA7O2NBQ0EsSUFBRyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUg7dUJBQ0UsS0FBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLEVBREY7ZUFBQSxNQUVLLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFIO2dCQUNILElBQUcsS0FBQyxDQUFBLDBCQUFKO3lCQUNFLEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixJQUF4QixFQURGO2lCQUFBLE1BQUE7eUJBR0UsSUFBQSxDQUFBLEVBSEY7aUJBREc7O1lBSmEsQ0FBcEIsRUFERjtXQUFBLE1BVUssSUFBRyxLQUFLLENBQUMsV0FBTixDQUFBLENBQUg7bUJBQ0gsS0FBQyxDQUFBLFVBQUQsQ0FBWSxVQUFaLEVBQXdCLElBQXhCLEVBREc7V0FBQSxNQUVBLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFIO21CQUNILEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixLQUF4QixFQUErQixJQUEvQixFQURHO1dBQUEsTUFBQTttQkFHSCxJQUFBLENBQUEsRUFIRzs7UUFkYztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7SUFGUTs7eUJBcUJWLFVBQUEsR0FBWSxTQUFDLFVBQUQsRUFBYSxJQUFiO2FBQ1YsRUFBRSxDQUFDLE9BQUgsQ0FBVyxVQUFYLEVBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsUUFBUjs7WUFBUSxXQUFTOztpQkFDdEMsS0FBSyxDQUFDLElBQU4sQ0FDRSxRQURGLEVBRUUsU0FBQyxTQUFELEVBQVksSUFBWjttQkFDRSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsVUFBVixFQUFzQixTQUF0QixDQUFWLEVBQTRDLElBQTVDO1VBREYsQ0FGRixFQUlFLElBSkY7UUFEcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBRFU7Ozs7OztFQVNkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsTUFBRDtBQUNmLFFBQUE7SUFBQSxPQUFBLEdBQ0U7TUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO01BQ0EsMEJBQUEsRUFBNEIsTUFBTSxDQUFDLDBCQURuQztNQUVBLFVBQUEsRUFBWSxNQUFNLENBQUMsVUFGbkI7TUFHQSxZQUFBLEVBQWMsRUFIZDtNQUlBLFdBQUEsRUFBYSxFQUpiOztJQU1GLElBQUcsd0JBQUg7TUFDRSxPQUFPLENBQUMsU0FBUixHQUF3QixJQUFBLElBQUEsQ0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxTQUFsQixDQUFMLEVBRDFCOztBQUdBO0FBQUEsU0FBQSxxQ0FBQTs7VUFBc0M7QUFDcEM7VUFDRSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQXBCLENBQTZCLElBQUEsU0FBQSxDQUFVLE1BQVYsRUFBa0I7WUFBQSxTQUFBLEVBQVcsSUFBWDtZQUFpQixHQUFBLEVBQUssSUFBdEI7V0FBbEIsQ0FBN0IsRUFERjtTQUFBLGNBQUE7VUFFTTtVQUNKLE9BQU8sQ0FBQyxJQUFSLENBQWEsZ0NBQUEsR0FBaUMsTUFBakMsR0FBd0MsS0FBeEMsR0FBNkMsS0FBSyxDQUFDLE9BQWhFLEVBSEY7OztBQURGO0FBTUE7QUFBQSxTQUFBLHdDQUFBOztVQUF1QztBQUNyQztVQUNFLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBckIsQ0FBOEIsSUFBQSxTQUFBLENBQVUsTUFBVixFQUFrQjtZQUFBLFNBQUEsRUFBVyxJQUFYO1lBQWlCLEdBQUEsRUFBSyxJQUF0QjtXQUFsQixDQUE5QixFQURGO1NBQUEsY0FBQTtVQUVNO1VBQ0osT0FBTyxDQUFDLElBQVIsQ0FBYSxnQ0FBQSxHQUFpQyxNQUFqQyxHQUF3QyxLQUF4QyxHQUE2QyxLQUFLLENBQUMsT0FBaEUsRUFIRjs7O0FBREY7V0FNQSxLQUFLLENBQUMsSUFBTixDQUNFLE1BQU0sQ0FBQyxLQURULEVBRUUsU0FBQyxRQUFELEVBQVcsSUFBWDthQUNNLElBQUEsVUFBQSxDQUFXLFFBQVgsRUFBcUIsT0FBckIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxJQUFuQztJQUROLENBRkYsRUFJRSxJQUFDLENBQUEsS0FBRCxDQUFBLENBSkY7RUF2QmU7QUF4R2pCIiwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgPSByZXF1aXJlICdhc3luYydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbntHaXRSZXBvc2l0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG57TWluaW1hdGNofSA9IHJlcXVpcmUgJ21pbmltYXRjaCdcblxuUGF0aHNDaHVua1NpemUgPSAxMDBcblxuY2xhc3MgUGF0aExvYWRlclxuICBjb25zdHJ1Y3RvcjogIChAcm9vdFBhdGgsIGNvbmZpZykgLT5cbiAgICB7QHRpbWVzdGFtcCwgQHNvdXJjZU5hbWVzLCBpZ25vcmVWY3NJZ25vcmVzLCBAdHJhdmVyc2VTeW1saW5rRGlyZWN0b3JpZXMsIEBpZ25vcmVkTmFtZXMsIEBrbm93blBhdGhzfSA9IGNvbmZpZ1xuXG4gICAgQGtub3duUGF0aHMgPz0gW11cbiAgICBAcGF0aHMgPSBbXVxuICAgIEBsb3N0UGF0aHMgPSBbXVxuICAgIEBzY2FubmVkUGF0aHMgPSBbXVxuXG4gICAgQHJlcG8gPSBudWxsXG4gICAgaWYgaWdub3JlVmNzSWdub3Jlc1xuICAgICAgcmVwbyA9IEdpdFJlcG9zaXRvcnkub3BlbihAcm9vdFBhdGgsIHJlZnJlc2hPbldpbmRvd0ZvY3VzOiBmYWxzZSlcbiAgICAgIEByZXBvID0gcmVwbyBpZiByZXBvPy5yZWxhdGl2aXplKHBhdGguam9pbihAcm9vdFBhdGgsICd0ZXN0JykpIGlzICd0ZXN0J1xuXG4gIGxvYWQ6IChkb25lKSAtPlxuICAgIEBsb2FkUGF0aCBAcm9vdFBhdGgsID0+XG4gICAgICBmb3IgcCBpbiBAa25vd25QYXRoc1xuICAgICAgICBpZiBwIG5vdCBpbiBAc2Nhbm5lZFBhdGhzIGFuZCBwLmluZGV4T2YoQHJvb3RQYXRoKSBpcyAwXG4gICAgICAgICAgQGxvc3RQYXRocy5wdXNoKHApXG5cbiAgICAgIEBmbHVzaFBhdGhzKClcbiAgICAgIEByZXBvPy5kZXN0cm95KClcbiAgICAgIGRvbmUoKVxuXG4gIGlzU291cmNlOiAobG9hZGVkUGF0aCkgLT5cbiAgICByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKEByb290UGF0aCwgbG9hZGVkUGF0aClcbiAgICBmb3Igc291cmNlTmFtZSBpbiBAc291cmNlTmFtZXNcbiAgICAgIHJldHVybiB0cnVlIGlmIHNvdXJjZU5hbWUubWF0Y2gocmVsYXRpdmVQYXRoKVxuXG4gIGlzSWdub3JlZDogKGxvYWRlZFBhdGgsIHN0YXRzKSAtPlxuICAgIHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUoQHJvb3RQYXRoLCBsb2FkZWRQYXRoKVxuICAgIGlmIEByZXBvPy5pc1BhdGhJZ25vcmVkKHJlbGF0aXZlUGF0aClcbiAgICAgIHRydWVcbiAgICBlbHNlXG4gICAgICBmb3IgaWdub3JlZE5hbWUgaW4gQGlnbm9yZWROYW1lc1xuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBpZ25vcmVkTmFtZS5tYXRjaChyZWxhdGl2ZVBhdGgpXG5cbiAgICAgIHJldHVybiBmYWxzZVxuXG4gIGlzS25vd246IChsb2FkZWRQYXRoKSAtPiBsb2FkZWRQYXRoIGluIEBrbm93blBhdGhzXG5cbiAgaGFzQ2hhbmdlZDogKGxvYWRlZFBhdGgsIHN0YXRzKSAtPlxuICAgIGlmIHN0YXRzIGFuZCBAdGltZXN0YW1wP1xuICAgICAgc3RhdHMuY3RpbWUgPj0gQHRpbWVzdGFtcFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgcGF0aExvYWRlZDogKGxvYWRlZFBhdGgsIHN0YXRzLCBkb25lKSAtPlxuICAgIEBzY2FubmVkUGF0aHMucHVzaChsb2FkZWRQYXRoKVxuICAgIGlmIEBpc1NvdXJjZShsb2FkZWRQYXRoKSBhbmQgIUBpc0lnbm9yZWQobG9hZGVkUGF0aCwgc3RhdHMpXG4gICAgICBpZiBAaXNLbm93bihsb2FkZWRQYXRoKVxuICAgICAgICBAcGF0aHMucHVzaChsb2FkZWRQYXRoKSBpZiBAaGFzQ2hhbmdlZChsb2FkZWRQYXRoLCBzdGF0cylcbiAgICAgIGVsc2VcbiAgICAgICAgQHBhdGhzLnB1c2gobG9hZGVkUGF0aClcbiAgICBlbHNlXG4gICAgICBAbG9zdFBhdGhzLnB1c2gobG9hZGVkUGF0aCkgaWYgbG9hZGVkUGF0aCBpbiBAa25vd25QYXRoc1xuXG4gICAgQGZsdXNoUGF0aHMoKSBpZiBAcGF0aHMubGVuZ3RoICsgQGxvc3RQYXRocy5sZW5ndGggaXMgUGF0aHNDaHVua1NpemVcbiAgICBkb25lKClcblxuICBmbHVzaFBhdGhzOiAtPlxuICAgIGVtaXQoJ2xvYWQtcGF0aHM6cGF0aHMtZm91bmQnLCBAcGF0aHMpIGlmIEBwYXRocy5sZW5ndGhcbiAgICBlbWl0KCdsb2FkLXBhdGhzOnBhdGhzLWxvc3QnLCBAbG9zdFBhdGhzKSBpZiBAbG9zdFBhdGhzLmxlbmd0aFxuICAgIEBwYXRocyA9IFtdXG4gICAgQGxvc3RQYXRocyA9IFtdXG5cbiAgbG9hZFBhdGg6IChwYXRoVG9Mb2FkLCBkb25lKSAtPlxuICAgIHJldHVybiBkb25lKCkgaWYgQGlzSWdub3JlZChwYXRoVG9Mb2FkKVxuICAgIGZzLmxzdGF0IHBhdGhUb0xvYWQsIChlcnJvciwgc3RhdHMpID0+XG4gICAgICByZXR1cm4gZG9uZSgpIGlmIGVycm9yP1xuICAgICAgaWYgc3RhdHMuaXNTeW1ib2xpY0xpbmsoKVxuICAgICAgICBmcy5zdGF0IHBhdGhUb0xvYWQsIChlcnJvciwgc3RhdHMpID0+XG4gICAgICAgICAgcmV0dXJuIGRvbmUoKSBpZiBlcnJvcj9cbiAgICAgICAgICBpZiBzdGF0cy5pc0ZpbGUoKVxuICAgICAgICAgICAgQHBhdGhMb2FkZWQocGF0aFRvTG9hZCwgc3RhdHMsIGRvbmUpXG4gICAgICAgICAgZWxzZSBpZiBzdGF0cy5pc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICBpZiBAdHJhdmVyc2VTeW1saW5rRGlyZWN0b3JpZXNcbiAgICAgICAgICAgICAgQGxvYWRGb2xkZXIocGF0aFRvTG9hZCwgZG9uZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICBlbHNlIGlmIHN0YXRzLmlzRGlyZWN0b3J5KClcbiAgICAgICAgQGxvYWRGb2xkZXIocGF0aFRvTG9hZCwgZG9uZSlcbiAgICAgIGVsc2UgaWYgc3RhdHMuaXNGaWxlKClcbiAgICAgICAgQHBhdGhMb2FkZWQocGF0aFRvTG9hZCwgc3RhdHMsIGRvbmUpXG4gICAgICBlbHNlXG4gICAgICAgIGRvbmUoKVxuXG4gIGxvYWRGb2xkZXI6IChmb2xkZXJQYXRoLCBkb25lKSAtPlxuICAgIGZzLnJlYWRkaXIgZm9sZGVyUGF0aCwgKGVycm9yLCBjaGlsZHJlbj1bXSkgPT5cbiAgICAgIGFzeW5jLmVhY2goXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICAoY2hpbGROYW1lLCBuZXh0KSA9PlxuICAgICAgICAgIEBsb2FkUGF0aChwYXRoLmpvaW4oZm9sZGVyUGF0aCwgY2hpbGROYW1lKSwgbmV4dClcbiAgICAgICAgZG9uZVxuICAgICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChjb25maWcpIC0+XG4gIG5ld0NvbmYgPVxuICAgIGlnbm9yZVZjc0lnbm9yZXM6IGNvbmZpZy5pZ25vcmVWY3NJZ25vcmVzXG4gICAgdHJhdmVyc2VTeW1saW5rRGlyZWN0b3JpZXM6IGNvbmZpZy50cmF2ZXJzZVN5bWxpbmtEaXJlY3Rvcmllc1xuICAgIGtub3duUGF0aHM6IGNvbmZpZy5rbm93blBhdGhzXG4gICAgaWdub3JlZE5hbWVzOiBbXVxuICAgIHNvdXJjZU5hbWVzOiBbXVxuXG4gIGlmIGNvbmZpZy50aW1lc3RhbXA/XG4gICAgbmV3Q29uZi50aW1lc3RhbXAgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKGNvbmZpZy50aW1lc3RhbXApKVxuXG4gIGZvciBzb3VyY2UgaW4gY29uZmlnLnNvdXJjZU5hbWVzIHdoZW4gc291cmNlXG4gICAgdHJ5XG4gICAgICBuZXdDb25mLnNvdXJjZU5hbWVzLnB1c2gobmV3IE1pbmltYXRjaChzb3VyY2UsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKSlcbiAgICBjYXRjaCBlcnJvclxuICAgICAgY29uc29sZS53YXJuIFwiRXJyb3IgcGFyc2luZyBzb3VyY2UgcGF0dGVybiAoI3tzb3VyY2V9KTogI3tlcnJvci5tZXNzYWdlfVwiXG5cbiAgZm9yIGlnbm9yZSBpbiBjb25maWcuaWdub3JlZE5hbWVzIHdoZW4gaWdub3JlXG4gICAgdHJ5XG4gICAgICBuZXdDb25mLmlnbm9yZWROYW1lcy5wdXNoKG5ldyBNaW5pbWF0Y2goaWdub3JlLCBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSkpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGNvbnNvbGUud2FybiBcIkVycm9yIHBhcnNpbmcgaWdub3JlIHBhdHRlcm4gKCN7aWdub3JlfSk6ICN7ZXJyb3IubWVzc2FnZX1cIlxuXG4gIGFzeW5jLmVhY2goXG4gICAgY29uZmlnLnBhdGhzLFxuICAgIChyb290UGF0aCwgbmV4dCkgLT5cbiAgICAgIG5ldyBQYXRoTG9hZGVyKHJvb3RQYXRoLCBuZXdDb25mKS5sb2FkKG5leHQpXG4gICAgQGFzeW5jKClcbiAgKVxuIl19

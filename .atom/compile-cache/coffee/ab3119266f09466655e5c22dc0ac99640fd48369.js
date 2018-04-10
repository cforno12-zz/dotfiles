(function() {
  var DB, OpenRecent, minimatch;

  minimatch = null;

  DB = (function() {
    function DB(key) {
      this.key = key;
    }

    DB.prototype.getData = function() {
      var data;
      data = localStorage[this.key];
      data = data != null ? JSON.parse(data) : {};
      return data;
    };

    DB.prototype.setData = function(data) {
      return localStorage[this.key] = JSON.stringify(data);
    };

    DB.prototype.removeData = function() {
      return localStorage.removeItem(this.key);
    };

    DB.prototype.get = function(name) {
      var data;
      data = this.getData();
      return data[name];
    };

    DB.prototype.set = function(name, value) {
      var data;
      data = this.getData();
      data[name] = value;
      return this.setData(data);
    };

    DB.prototype.remove = function(name) {
      var data;
      data = this.getData();
      delete data[name];
      return this.setData(data);
    };

    return DB;

  })();

  OpenRecent = (function() {
    function OpenRecent() {
      this.eventListenerDisposables = [];
      this.commandListenerDisposables = [];
      this.localStorageEventListener = this.onLocalStorageEvent.bind(this);
      this.db = new DB('openRecent');
    }

    OpenRecent.prototype.onUriOpened = function() {
      var editor, filePath, ref, ref1;
      editor = atom.workspace.getActiveTextEditor();
      filePath = editor != null ? (ref = editor.buffer) != null ? (ref1 = ref.file) != null ? ref1.path : void 0 : void 0 : void 0;
      if (!filePath) {
        return;
      }
      if (!filePath.indexOf('://' === -1)) {
        return;
      }
      if (filePath) {
        return this.insertFilePath(filePath);
      }
    };

    OpenRecent.prototype.onProjectPathChange = function(projectPaths) {
      return this.insertCurrentPaths();
    };

    OpenRecent.prototype.onLocalStorageEvent = function(e) {
      if (e.key === this.db.key) {
        return this.update();
      }
    };

    OpenRecent.prototype.encodeEventName = function(s) {
      s = s.replace('-', '\u2010');
      s = s.replace(':', '\u02D0');
      return s;
    };

    OpenRecent.prototype.commandEventName = function(prefix, path) {
      return "open-recent:" + prefix + "-" + (this.encodeEventName(path));
    };

    OpenRecent.prototype.addCommandListeners = function() {
      var disposable, fn, fn1, i, index, j, len, len1, path, ref, ref1;
      ref = this.db.get('files');
      fn = (function(_this) {
        return function(path) {
          var disposable;
          disposable = atom.commands.add("atom-workspace", _this.commandEventName("File" + index, path), function() {
            return _this.openFile(path);
          });
          return _this.commandListenerDisposables.push(disposable);
        };
      })(this);
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        path = ref[index];
        fn(path);
      }
      ref1 = this.db.get('paths');
      fn1 = (function(_this) {
        return function(path) {
          var disposable;
          disposable = atom.commands.add("atom-workspace", _this.commandEventName("Dir" + index, path), function() {
            return _this.openPath(path);
          });
          return _this.commandListenerDisposables.push(disposable);
        };
      })(this);
      for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
        path = ref1[index];
        fn1(path);
      }
      disposable = atom.commands.add("atom-workspace", "open-recent:clear-all" + '-'.repeat(1024), (function(_this) {
        return function() {
          _this.db.set('files', []);
          _this.db.set('paths', []);
          return _this.update();
        };
      })(this));
      return this.commandListenerDisposables.push(disposable);
    };

    OpenRecent.prototype.getProjectPath = function(path) {
      var ref;
      return (ref = atom.project.getPaths()) != null ? ref[0] : void 0;
    };

    OpenRecent.prototype.openFile = function(path) {
      return atom.workspace.open(path);
    };

    OpenRecent.prototype.openPath = function(path) {
      var options, replaceCurrentProject, workspaceElement;
      replaceCurrentProject = false;
      options = {};
      if (!this.getProjectPath() && atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')) {
        replaceCurrentProject = true;
      } else if (this.getProjectPath() && atom.config.get('open-recent.replaceProjectOnOpenDirectory')) {
        replaceCurrentProject = true;
      }
      if (replaceCurrentProject) {
        atom.project.setPaths([path]);
        if (workspaceElement = atom.views.getView(atom.workspace)) {
          return atom.commands.dispatch(workspaceElement, 'tree-view:toggle-focus');
        }
      } else {
        return atom.open({
          pathsToOpen: [path],
          newWindow: !atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')
        });
      }
    };

    OpenRecent.prototype.addListeners = function() {
      var disposable;
      this.addCommandListeners();
      disposable = atom.workspace.onDidOpen(this.onUriOpened.bind(this));
      this.eventListenerDisposables.push(disposable);
      disposable = atom.project.onDidChangePaths(this.onProjectPathChange.bind(this));
      this.eventListenerDisposables.push(disposable);
      return window.addEventListener("storage", this.localStorageEventListener);
    };

    OpenRecent.prototype.removeCommandListeners = function() {
      var disposable, i, len, ref;
      ref = this.commandListenerDisposables;
      for (i = 0, len = ref.length; i < len; i++) {
        disposable = ref[i];
        disposable.dispose();
      }
      return this.commandListenerDisposables = [];
    };

    OpenRecent.prototype.removeListeners = function() {
      var disposable, i, len, ref;
      this.removeCommandListeners();
      ref = this.eventListenerDisposables;
      for (i = 0, len = ref.length; i < len; i++) {
        disposable = ref[i];
        disposable.dispose();
      }
      this.eventListenerDisposables = [];
      return window.removeEventListener('storage', this.localStorageEventListener);
    };

    OpenRecent.prototype.init = function() {
      if (atom.config.get('open-recent.recentDirectories') || atom.config.get('open-recent.recentFiles')) {
        this.db.set('paths', atom.config.get('open-recent.recentDirectories'));
        this.db.set('files', atom.config.get('open-recent.recentFiles'));
        atom.config.unset('open-recent.recentDirectories');
        atom.config.unset('open-recent.recentFiles');
      }
      if (!this.db.get('paths')) {
        this.db.set('paths', []);
      }
      if (!this.db.get('files')) {
        this.db.set('files', []);
      }
      this.addListeners();
      this.insertCurrentPaths();
      return this.update();
    };

    OpenRecent.prototype.filterPath = function(path) {
      var i, ignoredNames, len, match, name;
      ignoredNames = atom.config.get('core.ignoredNames');
      if (ignoredNames) {
        if (minimatch == null) {
          minimatch = require('minimatch');
        }
        for (i = 0, len = ignoredNames.length; i < len; i++) {
          name = ignoredNames[i];
          match = [name, "**/" + name + "/**"].some(function(comparison) {
            return minimatch(path, comparison, {
              matchBase: true,
              dot: true
            });
          });
          if (match) {
            return true;
          }
        }
      }
      return false;
    };

    OpenRecent.prototype.insertCurrentPaths = function() {
      var i, index, len, maxRecentDirectories, path, projectDirectory, recentPaths, ref;
      if (!(atom.project.getDirectories().length > 0)) {
        return;
      }
      recentPaths = this.db.get('paths');
      ref = atom.project.getDirectories();
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        projectDirectory = ref[index];
        if (index > 0 && !atom.config.get('open-recent.listDirectoriesAddedToProject')) {
          continue;
        }
        path = projectDirectory.path;
        if (this.filterPath(path)) {
          continue;
        }
        index = recentPaths.indexOf(path);
        if (index !== -1) {
          recentPaths.splice(index, 1);
        }
        recentPaths.splice(0, 0, path);
        maxRecentDirectories = atom.config.get('open-recent.maxRecentDirectories');
        if (recentPaths.length > maxRecentDirectories) {
          recentPaths.splice(maxRecentDirectories, recentPaths.length - maxRecentDirectories);
        }
      }
      this.db.set('paths', recentPaths);
      return this.update();
    };

    OpenRecent.prototype.insertFilePath = function(path) {
      var index, maxRecentFiles, recentFiles;
      if (this.filterPath(path)) {
        return;
      }
      recentFiles = this.db.get('files');
      index = recentFiles.indexOf(path);
      if (index !== -1) {
        recentFiles.splice(index, 1);
      }
      recentFiles.splice(0, 0, path);
      maxRecentFiles = atom.config.get('open-recent.maxRecentFiles');
      if (recentFiles.length > maxRecentFiles) {
        recentFiles.splice(maxRecentFiles, recentFiles.length - maxRecentFiles);
      }
      this.db.set('files', recentFiles);
      return this.update();
    };

    OpenRecent.prototype.createSubmenu = function() {
      var i, index, j, len, len1, menuItem, path, recentFiles, recentPaths, submenu;
      submenu = [];
      submenu.push({
        command: "pane:reopen-closed-item",
        label: "Reopen Closed File"
      });
      submenu.push({
        type: "separator"
      });
      recentFiles = this.db.get('files');
      if (recentFiles.length) {
        for (index = i = 0, len = recentFiles.length; i < len; index = ++i) {
          path = recentFiles[index];
          menuItem = {
            label: path,
            command: this.commandEventName("File" + index, path)
          };
          if (path.length > 100) {
            menuItem.label = path.substr(-60);
            menuItem.sublabel = path;
          }
          submenu.push(menuItem);
        }
        submenu.push({
          type: "separator"
        });
      }
      recentPaths = this.db.get('paths');
      if (recentPaths.length) {
        for (index = j = 0, len1 = recentPaths.length; j < len1; index = ++j) {
          path = recentPaths[index];
          menuItem = {
            label: path,
            command: this.commandEventName("Dir" + index, path)
          };
          if (path.length > 100) {
            menuItem.label = path.substr(-60);
            menuItem.sublabel = path;
          }
          submenu.push(menuItem);
        }
        submenu.push({
          type: "separator"
        });
      }
      submenu.push({
        command: "open-recent:clear-all" + '-'.repeat(1024),
        label: "Clear List"
      });
      return submenu;
    };

    OpenRecent.prototype.updateMenu = function() {
      var dropdown, i, item, j, len, len1, ref, ref1, results;
      ref = atom.menu.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        dropdown = ref[i];
        if (dropdown.label === "File" || dropdown.label === "&File") {
          ref1 = dropdown.submenu;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            item = ref1[j];
            if (item.command === "pane:reopen-closed-item" || item.label === "Open Recent") {
              delete item.accelerator;
              delete item.command;
              delete item.click;
              item.label = "Open Recent";
              item.enabled = true;
              if (item.metadata == null) {
                item.metadata = {};
              }
              item.metadata.windowSpecific = false;
              item.submenu = this.createSubmenu();
              atom.menu.update();
              break;
            }
          }
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    OpenRecent.prototype.update = function() {
      this.removeCommandListeners();
      this.updateMenu();
      return this.addCommandListeners();
    };

    OpenRecent.prototype.destroy = function() {
      return this.removeListeners();
    };

    return OpenRecent;

  })();

  module.exports = {
    config: {
      maxRecentFiles: {
        type: 'number',
        "default": 8
      },
      maxRecentDirectories: {
        type: 'number',
        "default": 8
      },
      replaceNewWindowOnOpenDirectory: {
        type: 'boolean',
        "default": true,
        description: 'When checked, opening a recent directory will "open" in the current window, but only if the window does not have a project path set. Eg: The window that appears when doing File > New Window.'
      },
      replaceProjectOnOpenDirectory: {
        type: 'boolean',
        "default": false,
        description: 'When checked, opening a recent directory will "open" in the current window, replacing the current project.'
      },
      listDirectoriesAddedToProject: {
        type: 'boolean',
        "default": false,
        description: 'When checked, the all root directories in a project will be added to the history and not just the 1st root directory.'
      },
      ignoredNames: {
        type: 'boolean',
        "default": true,
        description: 'When checked, skips files and directories specified in Atom\'s "Ignored Names" setting.'
      }
    },
    instance: null,
    activate: function() {
      this.instance = new OpenRecent();
      return this.instance.init();
    },
    deactivate: function() {
      this.instance.destroy();
      return this.instance = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9vcGVuLXJlY2VudC9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWTs7RUFHTjtJQUNTLFlBQUMsR0FBRDtNQUFDLElBQUMsQ0FBQSxNQUFEO0lBQUQ7O2lCQUViLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUEsR0FBTyxZQUFhLENBQUEsSUFBQyxDQUFBLEdBQUQ7TUFDcEIsSUFBQSxHQUFVLFlBQUgsR0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBZCxHQUFvQztBQUMzQyxhQUFPO0lBSEE7O2lCQUtULE9BQUEsR0FBUyxTQUFDLElBQUQ7YUFDUCxZQUFhLENBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBYixHQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLElBQWY7SUFEZDs7aUJBR1QsVUFBQSxHQUFZLFNBQUE7YUFDVixZQUFZLENBQUMsVUFBYixDQUF3QixJQUFDLENBQUEsR0FBekI7SUFEVTs7aUJBR1osR0FBQSxHQUFLLFNBQUMsSUFBRDtBQUNILFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUNQLGFBQU8sSUFBSyxDQUFBLElBQUE7SUFGVDs7aUJBSUwsR0FBQSxHQUFLLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDSCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDUCxJQUFLLENBQUEsSUFBQSxDQUFMLEdBQWE7YUFDYixJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7SUFIRzs7aUJBS0wsTUFBQSxHQUFRLFNBQUMsSUFBRDtBQUNOLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBQTtNQUNQLE9BQU8sSUFBSyxDQUFBLElBQUE7YUFDWixJQUFDLENBQUEs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LENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRHQUZiO09BWEY7TUFjQSw2QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsdUhBRmI7T0FmRjtNQWtCQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSx5RkFGYjtPQW5CRjtLQURGO0lBd0JBLFFBQUEsRUFBVSxJQXhCVjtJQTBCQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsVUFBQSxDQUFBO2FBQ2hCLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFBO0lBRlEsQ0ExQlY7SUE4QkEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFGRixDQTlCWjs7QUFuU0YiLCJzb3VyY2VzQ29udGVudCI6WyJtaW5pbWF0Y2ggPSBudWxsXG5cbiMtLS0gbG9jYWxTdG9yYWdlIERCXG5jbGFzcyBEQlxuICBjb25zdHJ1Y3RvcjogKEBrZXkpIC0+XG5cbiAgZ2V0RGF0YTogLT5cbiAgICBkYXRhID0gbG9jYWxTdG9yYWdlW0BrZXldXG4gICAgZGF0YSA9IGlmIGRhdGE/IHRoZW4gSlNPTi5wYXJzZShkYXRhKSBlbHNlIHt9XG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBsb2NhbFN0b3JhZ2VbQGtleV0gPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuXG4gIHJlbW92ZURhdGE6IC0+XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQGtleSlcblxuICBnZXQ6IChuYW1lKSAtPlxuICAgIGRhdGEgPSBAZ2V0RGF0YSgpXG4gICAgcmV0dXJuIGRhdGFbbmFtZV1cblxuICBzZXQ6IChuYW1lLCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQGdldERhdGEoKVxuICAgIGRhdGFbbmFtZV0gPSB2YWx1ZVxuICAgIEBzZXREYXRhKGRhdGEpXG5cbiAgcmVtb3ZlOiAobmFtZSkgLT5cbiAgICBkYXRhID0gQGdldERhdGEoKVxuICAgIGRlbGV0ZSBkYXRhW25hbWVdXG4gICAgQHNldERhdGEoZGF0YSlcblxuXG4jLS0tIE9wZW5SZWNlbnRcbmNsYXNzIE9wZW5SZWNlbnRcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGV2ZW50TGlzdGVuZXJEaXNwb3NhYmxlcyA9IFtdXG4gICAgQGNvbW1hbmRMaXN0ZW5lckRpc3Bvc2FibGVzID0gW11cbiAgICBAbG9jYWxTdG9yYWdlRXZlbnRMaXN0ZW5lciA9IEBvbkxvY2FsU3RvcmFnZUV2ZW50LmJpbmQoQClcbiAgICBAZGIgPSBuZXcgREIoJ29wZW5SZWNlbnQnKVxuXG4gICMtLS0gRXZlbnQgSGFuZGxlcnNcbiAgb25VcmlPcGVuZWQ6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgZmlsZVBhdGggPSBlZGl0b3I/LmJ1ZmZlcj8uZmlsZT8ucGF0aFxuXG4gICAgIyBJZ25vcmUgYW55dGhpbmcgdGhhdHMgbm90IGEgZmlsZS5cbiAgICByZXR1cm4gdW5sZXNzIGZpbGVQYXRoXG4gICAgcmV0dXJuIHVubGVzcyBmaWxlUGF0aC5pbmRleE9mICc6Ly8nIGlzIC0xXG5cbiAgICBAaW5zZXJ0RmlsZVBhdGgoZmlsZVBhdGgpIGlmIGZpbGVQYXRoXG5cbiAgb25Qcm9qZWN0UGF0aENoYW5nZTogKHByb2plY3RQYXRocykgLT5cbiAgICBAaW5zZXJ0Q3VycmVudFBhdGhzKClcblxuICBvbkxvY2FsU3RvcmFnZUV2ZW50OiAoZSkgLT5cbiAgICBpZiBlLmtleSBpcyBAZGIua2V5XG4gICAgICBAdXBkYXRlKClcblxuICBlbmNvZGVFdmVudE5hbWU6IChzKSAtPlxuICAgIHMgPSBzLnJlcGxhY2UoJy0nLCAnXFx1MjAxMCcpICMgSFlQSEVOXG4gICAgcyA9IHMucmVwbGFjZSgnOicsICdcXHUwMkQwJykgIyBNT8KtREnCrUZJwq1FUiBMRVTCrVRFUiBUUklBTkdVTEFSIENPTE9OXG4gICAgcmV0dXJuIHNcblxuICBjb21tYW5kRXZlbnROYW1lOiAocHJlZml4LCBwYXRoKSAtPlxuICAgIHJldHVybiBcIm9wZW4tcmVjZW50OiN7cHJlZml4fS0je0BlbmNvZGVFdmVudE5hbWUocGF0aCl9XCJcblxuICAjLS0tIExpc3RlbmVyc1xuICBhZGRDb21tYW5kTGlzdGVuZXJzOiAtPlxuICAgICMtLS0gQ29tbWFuZHNcbiAgICAjIG9wZW4tcmVjZW50OkZpbGUjLXBhdGhcbiAgICBmb3IgcGF0aCwgaW5kZXggaW4gQGRiLmdldCgnZmlsZXMnKVxuICAgICAgZG8gKHBhdGgpID0+ICMgRXhwbGljaXQgY2xvc3VyZVxuICAgICAgICBkaXNwb3NhYmxlID0gYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBAY29tbWFuZEV2ZW50TmFtZShcIkZpbGUje2luZGV4fVwiLCBwYXRoKSwgPT5cbiAgICAgICAgICBAb3BlbkZpbGUgcGF0aFxuICAgICAgICBAY29tbWFuZExpc3RlbmVyRGlzcG9zYWJsZXMucHVzaCBkaXNwb3NhYmxlXG5cbiAgICAjIG9wZW4tcmVjZW50OkRpciMtcGF0aFxuICAgIGZvciBwYXRoLCBpbmRleCBpbiBAZGIuZ2V0KCdwYXRocycpXG4gICAgICBkbyAocGF0aCkgPT4gIyBFeHBsaWNpdCBjbG9zdXJlXG4gICAgICAgIGRpc3Bvc2FibGUgPSBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIEBjb21tYW5kRXZlbnROYW1lKFwiRGlyI3tpbmRleH1cIiwgcGF0aCksID0+XG4gICAgICAgICAgQG9wZW5QYXRoIHBhdGhcbiAgICAgICAgQGNvbW1hbmRMaXN0ZW5lckRpc3Bvc2FibGVzLnB1c2ggZGlzcG9zYWJsZVxuXG4gICAgIyBvcGVuLXJlY2VudDpjbGVhci1hbGwtLS0tLS0uLi5cbiAgICAjIEFkZCB0b25zIG9mIC0tLSBhdCB0aGUgZW5kIHRvIHNvcnQgdGhpcyBpdGVtIGF0IHRoZSBib3R0b20gb2YgdGhlIGNvbW1hbmQgcGFsZXR0ZS5cbiAgICAjIE11bHRpcGxlIHNwYWNlcyBhcmUgaWdub3JlZCBpbnNpZGUgdGhlIGNvbW1hbmQgcGFsZXR0ZS5cbiAgICBkaXNwb3NhYmxlID0gYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcIm9wZW4tcmVjZW50OmNsZWFyLWFsbFwiICsgJy0nLnJlcGVhdCgxMDI0KSwgPT5cbiAgICAgIEBkYi5zZXQoJ2ZpbGVzJywgW10pXG4gICAgICBAZGIuc2V0KCdwYXRocycsIFtdKVxuICAgICAgQHVwZGF0ZSgpXG4gICAgQGNvbW1hbmRMaXN0ZW5lckRpc3Bvc2FibGVzLnB1c2ggZGlzcG9zYWJsZVxuXG4gIGdldFByb2plY3RQYXRoOiAocGF0aCkgLT5cbiAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk/WzBdXG5cbiAgb3BlbkZpbGU6IChwYXRoKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gcGF0aFxuXG4gIG9wZW5QYXRoOiAocGF0aCkgLT5cbiAgICByZXBsYWNlQ3VycmVudFByb2plY3QgPSBmYWxzZVxuICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgaWYgbm90IEBnZXRQcm9qZWN0UGF0aCgpIGFuZCBhdG9tLmNvbmZpZy5nZXQoJ29wZW4tcmVjZW50LnJlcGxhY2VOZXdXaW5kb3dPbk9wZW5EaXJlY3RvcnknKVxuICAgICAgcmVwbGFjZUN1cnJlbnRQcm9qZWN0ID0gdHJ1ZVxuICAgIGVsc2UgaWYgQGdldFByb2plY3RQYXRoKCkgYW5kIGF0b20uY29uZmlnLmdldCgnb3Blbi1yZWNlbnQucmVwbGFjZVByb2plY3RPbk9wZW5EaXJlY3RvcnknKVxuICAgICAgcmVwbGFjZUN1cnJlbnRQcm9qZWN0ID0gdHJ1ZVxuXG4gICAgaWYgcmVwbGFjZUN1cnJlbnRQcm9qZWN0XG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3BhdGhdKVxuICAgICAgaWYgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAndHJlZS12aWV3OnRvZ2dsZS1mb2N1cydcbiAgICBlbHNlXG4gICAgICBhdG9tLm9wZW4ge1xuICAgICAgICBwYXRoc1RvT3BlbjogW3BhdGhdXG4gICAgICAgIG5ld1dpbmRvdzogIWF0b20uY29uZmlnLmdldCgnb3Blbi1yZWNlbnQucmVwbGFjZU5ld1dpbmRvd09uT3BlbkRpcmVjdG9yeScpXG4gICAgICB9XG5cbiAgYWRkTGlzdGVuZXJzOiAtPlxuICAgICMtLS0gQ29tbWFuZHNcbiAgICBAYWRkQ29tbWFuZExpc3RlbmVycygpXG5cbiAgICAjLS0tIEV2ZW50c1xuICAgIGRpc3Bvc2FibGUgPSBhdG9tLndvcmtzcGFjZS5vbkRpZE9wZW4gQG9uVXJpT3BlbmVkLmJpbmQoQClcbiAgICBAZXZlbnRMaXN0ZW5lckRpc3Bvc2FibGVzLnB1c2goZGlzcG9zYWJsZSlcblxuICAgIGRpc3Bvc2FibGUgPSBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyBAb25Qcm9qZWN0UGF0aENoYW5nZS5iaW5kKEApXG4gICAgQGV2ZW50TGlzdGVuZXJEaXNwb3NhYmxlcy5wdXNoKGRpc3Bvc2FibGUpXG5cbiAgICAjIE5vdGlmeSBvdGhlciB3aW5kb3dzIGR1cmluZyBhIHNldHRpbmcgZGF0YSBpbiBsb2NhbFN0b3JhZ2UuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgXCJzdG9yYWdlXCIsIEBsb2NhbFN0b3JhZ2VFdmVudExpc3RlbmVyXG5cbiAgcmVtb3ZlQ29tbWFuZExpc3RlbmVyczogLT5cbiAgICAjLS0tIENvbW1hbmRzXG4gICAgZm9yIGRpc3Bvc2FibGUgaW4gQGNvbW1hbmRMaXN0ZW5lckRpc3Bvc2FibGVzXG4gICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgIEBjb21tYW5kTGlzdGVuZXJEaXNwb3NhYmxlcyA9IFtdXG5cbiAgcmVtb3ZlTGlzdGVuZXJzOiAtPlxuICAgICMtLS0gQ29tbWFuZHNcbiAgICBAcmVtb3ZlQ29tbWFuZExpc3RlbmVycygpXG5cbiAgICAjLS0tIEV2ZW50c1xuICAgIGZvciBkaXNwb3NhYmxlIGluIEBldmVudExpc3RlbmVyRGlzcG9zYWJsZXNcbiAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgQGV2ZW50TGlzdGVuZXJEaXNwb3NhYmxlcyA9IFtdXG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciAnc3RvcmFnZScsIEBsb2NhbFN0b3JhZ2VFdmVudExpc3RlbmVyXG5cbiAgIy0tLSBNZXRob2RzXG4gIGluaXQ6IC0+XG4gICAgIyBNaWdyYXRlXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdvcGVuLXJlY2VudC5yZWNlbnREaXJlY3RvcmllcycpIG9yIGF0b20uY29uZmlnLmdldCgnb3Blbi1yZWNlbnQucmVjZW50RmlsZXMnKVxuICAgICAgQGRiLnNldCgncGF0aHMnLCBhdG9tLmNvbmZpZy5nZXQoJ29wZW4tcmVjZW50LnJlY2VudERpcmVjdG9yaWVzJykpXG4gICAgICBAZGIuc2V0KCdmaWxlcycsIGF0b20uY29uZmlnLmdldCgnb3Blbi1yZWNlbnQucmVjZW50RmlsZXMnKSlcbiAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdvcGVuLXJlY2VudC5yZWNlbnREaXJlY3RvcmllcycpXG4gICAgICBhdG9tLmNvbmZpZy51bnNldCgnb3Blbi1yZWNlbnQucmVjZW50RmlsZXMnKVxuXG4gICAgIyBEZWZhdWx0c1xuICAgIEBkYi5zZXQoJ3BhdGhzJywgW10pIHVubGVzcyBAZGIuZ2V0KCdwYXRocycpXG4gICAgQGRiLnNldCgnZmlsZXMnLCBbXSkgdW5sZXNzIEBkYi5nZXQoJ2ZpbGVzJylcblxuICAgIEBhZGRMaXN0ZW5lcnMoKVxuICAgIEBpbnNlcnRDdXJyZW50UGF0aHMoKVxuICAgIEB1cGRhdGUoKVxuXG4gICMgUmV0dXJucyB0cnVlIGlmIHRoZSBwYXRoIHNob3VsZCBiZSBmaWx0ZXJlZCBvdXQsIGJhc2VkIG9uIHNldHRpbmdzLlxuICBmaWx0ZXJQYXRoOiAocGF0aCkgLT5cbiAgICBpZ25vcmVkTmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJylcbiAgICBpZiBpZ25vcmVkTmFtZXNcbiAgICAgIG1pbmltYXRjaCA/PSByZXF1aXJlKCdtaW5pbWF0Y2gnKVxuICAgICAgZm9yIG5hbWUgaW4gaWdub3JlZE5hbWVzXG4gICAgICAgIG1hdGNoID0gW25hbWUsIFwiKiovI3tuYW1lfS8qKlwiXS5zb21lIChjb21wYXJpc29uKSAtPlxuICAgICAgICAgIHJldHVybiBtaW5pbWF0Y2gocGF0aCwgY29tcGFyaXNvbiwgeyBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSB9KVxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiBtYXRjaFxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgaW5zZXJ0Q3VycmVudFBhdGhzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkubGVuZ3RoID4gMFxuXG4gICAgcmVjZW50UGF0aHMgPSBAZGIuZ2V0KCdwYXRocycpXG4gICAgZm9yIHByb2plY3REaXJlY3RvcnksIGluZGV4IGluIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICAjIElnbm9yZSB0aGUgc2Vjb25kLCB0aGlyZCwgLi4uIGZvbGRlcnMgaW4gYSBwcm9qZWN0XG4gICAgICBjb250aW51ZSBpZiBpbmRleCA+IDAgYW5kIG5vdCBhdG9tLmNvbmZpZy5nZXQoJ29wZW4tcmVjZW50Lmxpc3REaXJlY3Rvcmllc0FkZGVkVG9Qcm9qZWN0JylcblxuICAgICAgcGF0aCA9IHByb2plY3REaXJlY3RvcnkucGF0aFxuXG4gICAgICBjb250aW51ZSBpZiBAZmlsdGVyUGF0aChwYXRoKVxuXG4gICAgICAjIFJlbW92ZSBpZiBhbHJlYWR5IGxpc3RlZFxuICAgICAgaW5kZXggPSByZWNlbnRQYXRocy5pbmRleE9mIHBhdGhcbiAgICAgIGlmIGluZGV4ICE9IC0xXG4gICAgICAgIHJlY2VudFBhdGhzLnNwbGljZSBpbmRleCwgMVxuXG4gICAgICByZWNlbnRQYXRocy5zcGxpY2UgMCwgMCwgcGF0aFxuXG4gICAgICAjIExpbWl0XG4gICAgICBtYXhSZWNlbnREaXJlY3RvcmllcyA9IGF0b20uY29uZmlnLmdldCgnb3Blbi1yZWNlbnQubWF4UmVjZW50RGlyZWN0b3JpZXMnKVxuICAgICAgaWYgcmVjZW50UGF0aHMubGVuZ3RoID4gbWF4UmVjZW50RGlyZWN0b3JpZXNcbiAgICAgICAgcmVjZW50UGF0aHMuc3BsaWNlIG1heFJlY2VudERpcmVjdG9yaWVzLCByZWNlbnRQYXRocy5sZW5ndGggLSBtYXhSZWNlbnREaXJlY3Rvcmllc1xuXG4gICAgQGRiLnNldCgncGF0aHMnLCByZWNlbnRQYXRocylcbiAgICBAdXBkYXRlKClcblxuICBpbnNlcnRGaWxlUGF0aDogKHBhdGgpIC0+XG4gICAgcmV0dXJuIGlmIEBmaWx0ZXJQYXRoKHBhdGgpXG5cbiAgICByZWNlbnRGaWxlcyA9IEBkYi5nZXQoJ2ZpbGVzJylcblxuICAgICMgUmVtb3ZlIGlmIGFscmVhZHkgbGlzdGVkXG4gICAgaW5kZXggPSByZWNlbnRGaWxlcy5pbmRleE9mIHBhdGhcbiAgICBpZiBpbmRleCAhPSAtMVxuICAgICAgcmVjZW50RmlsZXMuc3BsaWNlIGluZGV4LCAxXG5cbiAgICByZWNlbnRGaWxlcy5zcGxpY2UgMCwgMCwgcGF0aFxuXG4gICAgIyBMaW1pdFxuICAgIG1heFJlY2VudEZpbGVzID0gYXRvbS5jb25maWcuZ2V0KCdvcGVuLXJlY2VudC5tYXhSZWNlbnRGaWxlcycpXG4gICAgaWYgcmVjZW50RmlsZXMubGVuZ3RoID4gbWF4UmVjZW50RmlsZXNcbiAgICAgIHJlY2VudEZpbGVzLnNwbGljZSBtYXhSZWNlbnRGaWxlcywgcmVjZW50RmlsZXMubGVuZ3RoIC0gbWF4UmVjZW50RmlsZXNcblxuICAgIEBkYi5zZXQoJ2ZpbGVzJywgcmVjZW50RmlsZXMpXG4gICAgQHVwZGF0ZSgpXG5cbiAgIy0tLSBNZW51XG4gIGNyZWF0ZVN1Ym1lbnU6IC0+XG4gICAgc3VibWVudSA9IFtdXG4gICAgc3VibWVudS5wdXNoIHsgY29tbWFuZDogXCJwYW5lOnJlb3Blbi1jbG9zZWQtaXRlbVwiLCBsYWJlbDogXCJSZW9wZW4gQ2xvc2VkIEZpbGVcIiB9XG4gICAgc3VibWVudS5wdXNoIHsgdHlwZTogXCJzZXBhcmF0b3JcIiB9XG5cbiAgICAjIEZpbGVzXG4gICAgcmVjZW50RmlsZXMgPSBAZGIuZ2V0KCdmaWxlcycpXG4gICAgaWYgcmVjZW50RmlsZXMubGVuZ3RoXG4gICAgICBmb3IgcGF0aCwgaW5kZXggaW4gcmVjZW50RmlsZXNcbiAgICAgICAgbWVudUl0ZW0gPSB7XG4gICAgICAgICAgbGFiZWw6IHBhdGhcbiAgICAgICAgICBjb21tYW5kOiBAY29tbWFuZEV2ZW50TmFtZShcIkZpbGUje2luZGV4fVwiLCBwYXRoKVxuICAgICAgICB9XG4gICAgICAgIGlmIHBhdGgubGVuZ3RoID4gMTAwXG4gICAgICAgICAgbWVudUl0ZW0ubGFiZWwgPSBwYXRoLnN1YnN0cigtNjApXG4gICAgICAgICAgbWVudUl0ZW0uc3VibGFiZWwgPSBwYXRoXG4gICAgICAgIHN1Ym1lbnUucHVzaCBtZW51SXRlbVxuICAgICAgc3VibWVudS5wdXNoIHsgdHlwZTogXCJzZXBhcmF0b3JcIiB9XG5cbiAgICAjIFJvb3QgUGF0aHNcbiAgICByZWNlbnRQYXRocyA9IEBkYi5nZXQoJ3BhdGhzJylcbiAgICBpZiByZWNlbnRQYXRocy5sZW5ndGhcbiAgICAgIGZvciBwYXRoLCBpbmRleCBpbiByZWNlbnRQYXRoc1xuICAgICAgICBtZW51SXRlbSA9IHtcbiAgICAgICAgICBsYWJlbDogcGF0aFxuICAgICAgICAgIGNvbW1hbmQ6IEBjb21tYW5kRXZlbnROYW1lKFwiRGlyI3tpbmRleH1cIiwgcGF0aClcbiAgICAgICAgfVxuICAgICAgICBpZiBwYXRoLmxlbmd0aCA+IDEwMFxuICAgICAgICAgIG1lbnVJdGVtLmxhYmVsID0gcGF0aC5zdWJzdHIoLTYwKVxuICAgICAgICAgIG1lbnVJdGVtLnN1YmxhYmVsID0gcGF0aFxuICAgICAgICBzdWJtZW51LnB1c2ggbWVudUl0ZW1cbiAgICAgIHN1Ym1lbnUucHVzaCB7IHR5cGU6IFwic2VwYXJhdG9yXCIgfVxuXG4gICAgc3VibWVudS5wdXNoIHsgY29tbWFuZDogXCJvcGVuLXJlY2VudDpjbGVhci1hbGxcIiArICctJy5yZXBlYXQoMTAyNCksIGxhYmVsOiBcIkNsZWFyIExpc3RcIiB9XG4gICAgcmV0dXJuIHN1Ym1lbnVcblxuICB1cGRhdGVNZW51OiAtPlxuICAgICMgTmVlZCB0byBwbGFjZSBvdXIgbWVudSBpbiB0b3Agc2VjdGlvblxuICAgIGZvciBkcm9wZG93biBpbiBhdG9tLm1lbnUudGVtcGxhdGVcbiAgICAgIGlmIGRyb3Bkb3duLmxhYmVsIGlzIFwiRmlsZVwiIG9yIGRyb3Bkb3duLmxhYmVsIGlzIFwiJkZpbGVcIlxuICAgICAgICBmb3IgaXRlbSBpbiBkcm9wZG93bi5zdWJtZW51XG4gICAgICAgICAgaWYgaXRlbS5jb21tYW5kIGlzIFwicGFuZTpyZW9wZW4tY2xvc2VkLWl0ZW1cIiBvciBpdGVtLmxhYmVsIGlzIFwiT3BlbiBSZWNlbnRcIlxuICAgICAgICAgICAgZGVsZXRlIGl0ZW0uYWNjZWxlcmF0b3JcbiAgICAgICAgICAgIGRlbGV0ZSBpdGVtLmNvbW1hbmRcbiAgICAgICAgICAgIGRlbGV0ZSBpdGVtLmNsaWNrXG4gICAgICAgICAgICBpdGVtLmxhYmVsID0gXCJPcGVuIFJlY2VudFwiXG4gICAgICAgICAgICBpdGVtLmVuYWJsZWQgPSB0cnVlXG4gICAgICAgICAgICBpdGVtLm1ldGFkYXRhID89IHt9XG4gICAgICAgICAgICBpdGVtLm1ldGFkYXRhLndpbmRvd1NwZWNpZmljID0gZmFsc2VcbiAgICAgICAgICAgIGl0ZW0uc3VibWVudSA9IEBjcmVhdGVTdWJtZW51KClcbiAgICAgICAgICAgIGF0b20ubWVudS51cGRhdGUoKVxuICAgICAgICAgICAgYnJlYWsgIyBicmVhayBmb3IgaXRlbVxuICAgICAgICBicmVhayAjIGJyZWFrIGZvciBkcm9wZG93blxuXG4gICMtLS1cbiAgdXBkYXRlOiAtPlxuICAgIEByZW1vdmVDb21tYW5kTGlzdGVuZXJzKClcbiAgICBAdXBkYXRlTWVudSgpXG4gICAgQGFkZENvbW1hbmRMaXN0ZW5lcnMoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlbW92ZUxpc3RlbmVycygpXG5cblxuIy0tLSBNb2R1bGVcbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIG1heFJlY2VudEZpbGVzOlxuICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgIGRlZmF1bHQ6IDhcbiAgICBtYXhSZWNlbnREaXJlY3RvcmllczpcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiA4XG4gICAgcmVwbGFjZU5ld1dpbmRvd09uT3BlbkRpcmVjdG9yeTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdXaGVuIGNoZWNrZWQsIG9wZW5pbmcgYSByZWNlbnQgZGlyZWN0b3J5IHdpbGwgXCJvcGVuXCIgaW4gdGhlIGN1cnJlbnQgd2luZG93LCBidXQgb25seSBpZiB0aGUgd2luZG93IGRvZXMgbm90IGhhdmUgYSBwcm9qZWN0IHBhdGggc2V0LiBFZzogVGhlIHdpbmRvdyB0aGF0IGFwcGVhcnMgd2hlbiBkb2luZyBGaWxlID4gTmV3IFdpbmRvdy4nXG4gICAgcmVwbGFjZVByb2plY3RPbk9wZW5EaXJlY3Rvcnk6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZW4gY2hlY2tlZCwgb3BlbmluZyBhIHJlY2VudCBkaXJlY3Rvcnkgd2lsbCBcIm9wZW5cIiBpbiB0aGUgY3VycmVudCB3aW5kb3csIHJlcGxhY2luZyB0aGUgY3VycmVudCBwcm9qZWN0LidcbiAgICBsaXN0RGlyZWN0b3JpZXNBZGRlZFRvUHJvamVjdDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBjaGVja2VkLCB0aGUgYWxsIHJvb3QgZGlyZWN0b3JpZXMgaW4gYSBwcm9qZWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGhpc3RvcnkgYW5kIG5vdCBqdXN0IHRoZSAxc3Qgcm9vdCBkaXJlY3RvcnkuJ1xuICAgIGlnbm9yZWROYW1lczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdXaGVuIGNoZWNrZWQsIHNraXBzIGZpbGVzIGFuZCBkaXJlY3RvcmllcyBzcGVjaWZpZWQgaW4gQXRvbVxcJ3MgXCJJZ25vcmVkIE5hbWVzXCIgc2V0dGluZy4nXG5cbiAgaW5zdGFuY2U6IG51bGxcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAaW5zdGFuY2UgPSBuZXcgT3BlblJlY2VudCgpXG4gICAgQGluc3RhbmNlLmluaXQoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGluc3RhbmNlLmRlc3Ryb3koKVxuICAgIEBpbnN0YW5jZSA9IG51bGxcbiJdfQ==

(function() {
  "use strict";
  var Beautifier, ESLintFixer, Path, allowUnsafeNewFunction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Path = require('path');

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

  module.exports = ESLintFixer = (function(superClass) {
    extend(ESLintFixer, superClass);

    function ESLintFixer() {
      return ESLintFixer.__super__.constructor.apply(this, arguments);
    }

    ESLintFixer.prototype.name = "ESLint Fixer";

    ESLintFixer.prototype.link = "https://github.com/eslint/eslint";

    ESLintFixer.prototype.options = {
      JavaScript: false,
      Vue: false
    };

    ESLintFixer.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var editor, filePath, projectPath, result;
        editor = atom.workspace.getActiveTextEditor();
        filePath = editor.getPath();
        projectPath = atom.project.relativizePath(filePath)[0];
        result = null;
        return allowUnsafeNewFunction(function() {
          var CLIEngine, cli, err, importPath;
          importPath = Path.join(projectPath, 'node_modules', 'eslint');
          try {
            CLIEngine = require(importPath).CLIEngine;
            cli = new CLIEngine({
              fix: true,
              cwd: projectPath
            });
            result = cli.executeOnText(text).results[0];
            return resolve(result.output);
          } catch (error) {
            err = error;
            return reject(err);
          }
        });
      });
    };

    return ESLintFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9lc2xpbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7OztFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04seUJBQTBCLE9BQUEsQ0FBUSxVQUFSOztFQUUzQixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFDckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUVOLE9BQUEsR0FBUztNQUNQLFVBQUEsRUFBWSxLQURMO01BRVAsR0FBQSxFQUFLLEtBRkU7OzswQkFLVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7UUFDVCxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQTtRQUNYLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBNUIsQ0FBc0MsQ0FBQSxDQUFBO1FBRXBELE1BQUEsR0FBUztlQUNULHNCQUFBLENBQXVCLFNBQUE7QUFDckIsY0FBQTtVQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBdUIsY0FBdkIsRUFBdUMsUUFBdkM7QUFDYjtZQUNFLFNBQUEsR0FBWSxPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDO1lBRWhDLEdBQUEsR0FBTSxJQUFJLFNBQUosQ0FBYztjQUFBLEdBQUEsRUFBSyxJQUFMO2NBQVcsR0FBQSxFQUFLLFdBQWhCO2FBQWQ7WUFDTixNQUFBLEdBQVMsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsQ0FBdUIsQ0FBQyxPQUFRLENBQUEsQ0FBQTttQkFFekMsT0FBQSxDQUFRLE1BQU0sQ0FBQyxNQUFmLEVBTkY7V0FBQSxhQUFBO1lBT007bUJBQ0osTUFBQSxDQUFPLEdBQVAsRUFSRjs7UUFGcUIsQ0FBdkI7TUFOa0IsQ0FBYjtJQURDOzs7O0tBVCtCO0FBTjNDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcblxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5QYXRoID0gcmVxdWlyZSgncGF0aCcpXG57YWxsb3dVbnNhZmVOZXdGdW5jdGlvbn0gPSByZXF1aXJlICdsb29waG9sZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFU0xpbnRGaXhlciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJFU0xpbnQgRml4ZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50XCJcblxuICBvcHRpb25zOiB7XG4gICAgSmF2YVNjcmlwdDogZmFsc2VcbiAgICBWdWU6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgYWxsb3dVbnNhZmVOZXdGdW5jdGlvbiAtPlxuICAgICAgICBpbXBvcnRQYXRoID0gUGF0aC5qb2luKHByb2plY3RQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICAgIHRyeVxuICAgICAgICAgIENMSUVuZ2luZSA9IHJlcXVpcmUoaW1wb3J0UGF0aCkuQ0xJRW5naW5lXG5cbiAgICAgICAgICBjbGkgPSBuZXcgQ0xJRW5naW5lKGZpeDogdHJ1ZSwgY3dkOiBwcm9qZWN0UGF0aClcbiAgICAgICAgICByZXN1bHQgPSBjbGkuZXhlY3V0ZU9uVGV4dCh0ZXh0KS5yZXN1bHRzWzBdXG5cbiAgICAgICAgICByZXNvbHZlIHJlc3VsdC5vdXRwdXRcbiAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICApXG4iXX0=

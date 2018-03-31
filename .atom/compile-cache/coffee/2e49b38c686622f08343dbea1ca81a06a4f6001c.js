(function() {
  var fs, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path;

  path = require('path');

  fs = require('fs');

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags.length === 0) {
        flags = getClangFlagsDotClangComplete(fileName);
      }
      return flags;
    },
    activate: function(state) {}
  };

  getFileContents = function(startFile, fileName) {
    var contents, error, parentDir, searchDir, searchFilePath, searchFileStats;
    searchDir = path.dirname(startFile);
    while (searchDir) {
      searchFilePath = path.join(searchDir, fileName);
      try {
        searchFileStats = fs.statSync(searchFilePath);
        if (searchFileStats.isFile()) {
          try {
            contents = fs.readFileSync(searchFilePath, 'utf8');
            return [searchDir, contents];
          } catch (error1) {
            error = error1;
            console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
            console.log(error);
          }
          return [null, null];
        }
      } catch (error1) {}
      parentDir = path.dirname(searchDir);
      if (parentDir === searchDir) {
        break;
      }
      searchDir = parentDir;
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var allArgs, args, compDB, compDBContents, config, doubleArgs, i, it, j, k, l, len, len1, nextArg, ref, ref1, relativeName, searchDir, singleArgs;
    ref = getFileContents(fileName, "compile_commands.json"), searchDir = ref[0], compDBContents = ref[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (j = 0, len = compDB.length; j < len; j++) {
        config = compDB[j];
        relativeName = fileName.slice(searchDir.length + 1, +fileName.length + 1 || 9e9);
        if (fileName === config['file'] || relativeName === config['file']) {
          allArgs = config.command.replace(/\s+/g, " ").split(' ');
          singleArgs = [];
          doubleArgs = [];
          for (i = k = 0, ref1 = allArgs.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
            nextArg = allArgs[i + 1];
            if (allArgs[i][0] === '-' && (!nextArg || nextArg[0] === '-')) {
              singleArgs.push(allArgs[i]);
            }
            if (allArgs[i][0] === '-' && nextArg && (nextArg[0] !== '-')) {
              doubleArgs.push(allArgs[i] + " " + nextArg);
            }
          }
          args = singleArgs;
          for (l = 0, len1 = doubleArgs.length; l < len1; l++) {
            it = doubleArgs[l];
            if (it.slice(0, 8) === '-isystem') {
              args.push(it);
            }
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, ref, searchDir;
    ref = getFileContents(fileName, ".clang_complete"), searchDir = ref[0], clangCompleteContents = ref[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItY2xhbmcvbm9kZV9tb2R1bGVzL2NsYW5nLWZsYWdzL2xpYi9jbGFuZy1mbGFncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxTQUFDLFFBQUQ7QUFDYixVQUFBO01BQUEsS0FBQSxHQUFRLG1CQUFBLENBQW9CLFFBQXBCO01BQ1IsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFuQjtRQUNFLEtBQUEsR0FBUSw2QkFBQSxDQUE4QixRQUE5QixFQURWOztBQUVBLGFBQU87SUFKTSxDQUFmO0lBS0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBLENBTFY7OztFQU9GLGVBQUEsR0FBa0IsU0FBQyxTQUFELEVBQVksUUFBWjtBQUNoQixRQUFBO0lBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYjtBQUNaLFdBQU0sU0FBTjtNQUNFLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFFBQXJCO0FBQ2pCO1FBQ0UsZUFBQSxHQUFrQixFQUFFLENBQUMsUUFBSCxDQUFZLGNBQVo7UUFDbEIsSUFBRyxlQUFlLENBQUMsTUFBaEIsQ0FBQSxDQUFIO0FBQ0U7WUFDRSxRQUFBLEdBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsY0FBaEIsRUFBZ0MsTUFBaEM7QUFDWCxtQkFBTyxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBRlQ7V0FBQSxjQUFBO1lBR007WUFDSixPQUFPLENBQUMsR0FBUixDQUFZLGtCQUFBLEdBQXFCLFFBQXJCLEdBQWdDLHNCQUFoQyxHQUF5RCxjQUFyRTtZQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixFQUxGOztBQU1BLGlCQUFPLENBQUMsSUFBRCxFQUFPLElBQVAsRUFQVDtTQUZGO09BQUE7TUFVQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiO01BQ1osSUFBUyxTQUFBLEtBQWEsU0FBdEI7QUFBQSxjQUFBOztNQUNBLFNBQUEsR0FBWTtJQWRkO0FBZUEsV0FBTyxDQUFDLElBQUQsRUFBTyxJQUFQO0VBakJTOztFQW1CbEIsbUJBQUEsR0FBc0IsU0FBQyxRQUFEO0FBQ3BCLFFBQUE7SUFBQSxNQUE4QixlQUFBLENBQWdCLFFBQWhCLEVBQTBCLHVCQUExQixDQUE5QixFQUFDLGtCQUFELEVBQVk7SUFDWixJQUFBLEdBQU87SUFDUCxJQUFHLGNBQUEsS0FBa0IsSUFBbEIsSUFBMEIsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBckQ7TUFDRSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxjQUFYO0FBQ1QsV0FBQSx3Q0FBQTs7UUFFRSxZQUFBLEdBQWUsUUFBUztRQUN4QixJQUFHLFFBQUEsS0FBWSxNQUFPLENBQUEsTUFBQSxDQUFuQixJQUE4QixZQUFBLEtBQWdCLE1BQU8sQ0FBQSxNQUFBLENBQXhEO1VBQ0UsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixNQUF2QixFQUErQixHQUEvQixDQUFtQyxDQUFDLEtBQXBDLENBQTBDLEdBQTFDO1VBQ1YsVUFBQSxHQUFhO1VBQ2IsVUFBQSxHQUFhO0FBQ2IsZUFBUyxrR0FBVDtZQUNFLE9BQUEsR0FBVSxPQUFRLENBQUEsQ0FBQSxHQUFFLENBQUY7WUFFbEIsSUFBOEIsT0FBUSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBWCxLQUFpQixHQUFqQixJQUF5QixDQUFDLENBQUksT0FBSixJQUFlLE9BQVEsQ0FBQSxDQUFBLENBQVIsS0FBYyxHQUE5QixDQUF2RDtjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENBQXhCLEVBQUE7O1lBQ0EsSUFBOEMsT0FBUSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBWCxLQUFpQixHQUFqQixJQUF5QixPQUF6QixJQUFxQyxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQVIsS0FBYyxHQUFmLENBQW5GO2NBQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsT0FBUSxDQUFBLENBQUEsQ0FBUixHQUFhLEdBQWIsR0FBbUIsT0FBbkMsRUFBQTs7QUFKRjtVQUtBLElBQUEsR0FBTztBQUNQLGVBQUEsOENBQUE7O2dCQUF1QyxFQUFHLFlBQUgsS0FBWTtjQUFuRCxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQVY7O0FBQUE7VUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFDLHFCQUFBLEdBQXNCLFNBQXZCLENBQVo7QUFDUCxnQkFaRjs7QUFIRixPQUZGOztBQWtCQSxXQUFPO0VBckJhOztFQXVCdEIsNkJBQUEsR0FBZ0MsU0FBQyxRQUFEO0FBQzlCLFFBQUE7SUFBQSxNQUFxQyxlQUFBLENBQWdCLFFBQWhCLEVBQTBCLGlCQUExQixDQUFyQyxFQUFDLGtCQUFELEVBQVk7SUFDWixJQUFBLEdBQU87SUFDUCxJQUFHLHFCQUFBLEtBQXlCLElBQXpCLElBQWlDLHFCQUFxQixDQUFDLE1BQXRCLEdBQStCLENBQW5FO01BQ0UsSUFBQSxHQUFPLHFCQUFxQixDQUFDLElBQXRCLENBQUEsQ0FBNEIsQ0FBQyxLQUE3QixDQUFtQyxJQUFuQztNQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMscUJBQUEsR0FBc0IsU0FBdkIsQ0FBWixFQUZUOztBQUdBLFdBQU87RUFOdUI7QUFyRGhDIiwic291cmNlc0NvbnRlbnQiOlsiIyBDbGFuZ0ZsYWdzVmlldyA9IHJlcXVpcmUgJy4vY2xhbmctZmxhZ3MtdmlldydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZXRDbGFuZ0ZsYWdzOiAoZmlsZU5hbWUpIC0+XG4gICAgZmxhZ3MgPSBnZXRDbGFuZ0ZsYWdzQ29tcERCKGZpbGVOYW1lKVxuICAgIGlmIGZsYWdzLmxlbmd0aCA9PSAwXG4gICAgICBmbGFncyA9IGdldENsYW5nRmxhZ3NEb3RDbGFuZ0NvbXBsZXRlKGZpbGVOYW1lKVxuICAgIHJldHVybiBmbGFnc1xuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG5nZXRGaWxlQ29udGVudHMgPSAoc3RhcnRGaWxlLCBmaWxlTmFtZSkgLT5cbiAgc2VhcmNoRGlyID0gcGF0aC5kaXJuYW1lIHN0YXJ0RmlsZVxuICB3aGlsZSBzZWFyY2hEaXJcbiAgICBzZWFyY2hGaWxlUGF0aCA9IHBhdGguam9pbiBzZWFyY2hEaXIsIGZpbGVOYW1lXG4gICAgdHJ5XG4gICAgICBzZWFyY2hGaWxlU3RhdHMgPSBmcy5zdGF0U3luYyBzZWFyY2hGaWxlUGF0aFxuICAgICAgaWYgc2VhcmNoRmlsZVN0YXRzLmlzRmlsZSgpXG4gICAgICAgIHRyeVxuICAgICAgICAgIGNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jIHNlYXJjaEZpbGVQYXRoLCAndXRmOCdcbiAgICAgICAgICByZXR1cm4gW3NlYXJjaERpciwgY29udGVudHNdXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJjbGFuZy1mbGFncyBmb3IgXCIgKyBmaWxlTmFtZSArIFwiIGNvdWxkbid0IHJlYWQgZmlsZSBcIiArIHNlYXJjaEZpbGVQYXRoXG4gICAgICAgICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICAgICAgcmV0dXJuIFtudWxsLCBudWxsXVxuICAgIHBhcmVudERpciA9IHBhdGguZGlybmFtZSBzZWFyY2hEaXJcbiAgICBicmVhayBpZiBwYXJlbnREaXIgPT0gc2VhcmNoRGlyXG4gICAgc2VhcmNoRGlyID0gcGFyZW50RGlyXG4gIHJldHVybiBbbnVsbCwgbnVsbF1cblxuZ2V0Q2xhbmdGbGFnc0NvbXBEQiA9IChmaWxlTmFtZSkgLT5cbiAgW3NlYXJjaERpciwgY29tcERCQ29udGVudHNdID0gZ2V0RmlsZUNvbnRlbnRzKGZpbGVOYW1lLCBcImNvbXBpbGVfY29tbWFuZHMuanNvblwiKVxuICBhcmdzID0gW11cbiAgaWYgY29tcERCQ29udGVudHMgIT0gbnVsbCAmJiBjb21wREJDb250ZW50cy5sZW5ndGggPiAwXG4gICAgY29tcERCID0gSlNPTi5wYXJzZShjb21wREJDb250ZW50cylcbiAgICBmb3IgY29uZmlnIGluIGNvbXBEQlxuICAgICAgIyBXZSBtaWdodCBoYXZlIGZ1bGwgcGF0aHMsIG9yIHdlIG1pZ2h0IGhhdmUgcmVsYXRpdmUgcGF0aHMuIFRyeSB0byBndWVzcyB0aGUgcmVsYXRpdmUgcGF0aCBieSByZW1vdmluZyB0aGUgc2VhcmNoIHBhdGggZnJvbSB0aGUgZmlsZSBwYXRoXG4gICAgICByZWxhdGl2ZU5hbWUgPSBmaWxlTmFtZVtzZWFyY2hEaXIubGVuZ3RoKzEuLmZpbGVOYW1lLmxlbmd0aF1cbiAgICAgIGlmIGZpbGVOYW1lID09IGNvbmZpZ1snZmlsZSddIHx8IHJlbGF0aXZlTmFtZSA9PSBjb25maWdbJ2ZpbGUnXVxuICAgICAgICBhbGxBcmdzID0gY29uZmlnLmNvbW1hbmQucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikuc3BsaXQoJyAnKVxuICAgICAgICBzaW5nbGVBcmdzID0gW11cbiAgICAgICAgZG91YmxlQXJncyA9IFtdXG4gICAgICAgIGZvciBpIGluIFswLi5hbGxBcmdzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgbmV4dEFyZyA9IGFsbEFyZ3NbaSsxXVxuICAgICAgICAgICMgd29yayBvdXQgd2hpY2ggYXJlIHN0YW5kYWxvbmUgYXJndW1lbnRzLCBhbmQgd2hpY2ggdGFrZSBhIHBhcmFtZXRlclxuICAgICAgICAgIHNpbmdsZUFyZ3MucHVzaCBhbGxBcmdzW2ldIGlmIGFsbEFyZ3NbaV1bMF0gPT0gJy0nIGFuZCAobm90IG5leHRBcmcgfHwgbmV4dEFyZ1swXSA9PSAnLScpXG4gICAgICAgICAgZG91YmxlQXJncy5wdXNoIGFsbEFyZ3NbaV0gKyBcIiBcIiArIG5leHRBcmcgaWYgYWxsQXJnc1tpXVswXSA9PSAnLScgYW5kIG5leHRBcmcgYW5kIChuZXh0QXJnWzBdICE9ICctJylcbiAgICAgICAgYXJncyA9IHNpbmdsZUFyZ3NcbiAgICAgICAgYXJncy5wdXNoIGl0IGZvciBpdCBpbiBkb3VibGVBcmdzIHdoZW4gaXRbMC4uN10gPT0gJy1pc3lzdGVtJ1xuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQgW1wiLXdvcmtpbmctZGlyZWN0b3J5PSN7c2VhcmNoRGlyfVwiXVxuICAgICAgICBicmVha1xuICByZXR1cm4gYXJnc1xuXG5nZXRDbGFuZ0ZsYWdzRG90Q2xhbmdDb21wbGV0ZSA9IChmaWxlTmFtZSkgLT5cbiAgW3NlYXJjaERpciwgY2xhbmdDb21wbGV0ZUNvbnRlbnRzXSA9IGdldEZpbGVDb250ZW50cyhmaWxlTmFtZSwgXCIuY2xhbmdfY29tcGxldGVcIilcbiAgYXJncyA9IFtdXG4gIGlmIGNsYW5nQ29tcGxldGVDb250ZW50cyAhPSBudWxsICYmIGNsYW5nQ29tcGxldGVDb250ZW50cy5sZW5ndGggPiAwXG4gICAgYXJncyA9IGNsYW5nQ29tcGxldGVDb250ZW50cy50cmltKCkuc3BsaXQoXCJcXG5cIilcbiAgICBhcmdzID0gYXJncy5jb25jYXQgW1wiLXdvcmtpbmctZGlyZWN0b3J5PSN7c2VhcmNoRGlyfVwiXVxuICByZXR1cm4gYXJnc1xuIl19

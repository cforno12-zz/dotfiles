(function() {
  var Beautifiers, Handlebars, _, beautifier, beautifierName, beautifierNames, beautifierOptions, beautifiers, beautifiersMap, beautifyLanguageCommands, context, exampleConfig, executableOptions, fs, j, keywords, languageNames, languageOptions, languagesMap, len, linkifyTitle, lo, optionDef, optionGroup, optionGroupTemplate, optionGroupTemplatePath, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, path, pkg, readmePath, readmeResult, readmeTemplate, readmeTemplatePath, ref, ref1, result, sortKeysBy, sortSettings, template;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  _ = require('lodash');

  path = require('path');

  pkg = require('../package.json');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  executableOptions = languageOptions.executables;

  delete languageOptions.executables;

  packageOptions = require('../src/config.coffee');

  packageOptions.executables = executableOptions;

  beautifiersMap = _.keyBy(beautifier.beautifiers, 'name');

  languagesMap = _.keyBy(beautifier.languages.languages, 'name');

  beautifierOptions = {};

  for (lo in languageOptions) {
    optionGroup = languageOptions[lo];
    ref = optionGroup.properties;
    for (optionName in ref) {
      optionDef = ref[optionName];
      beautifiers = (ref1 = optionDef.beautifiers) != null ? ref1 : [];
      for (j = 0, len = beautifiers.length; j < len; j++) {
        beautifierName = beautifiers[j];
        if (beautifierOptions[beautifierName] == null) {
          beautifierOptions[beautifierName] = {};
        }
        beautifierOptions[beautifierName][optionName] = optionDef;
      }
    }
  }

  console.log('Loading options template...');

  readmeTemplatePath = path.resolve(__dirname, '../README-template.md');

  readmePath = path.resolve(__dirname, '../README.md');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionGroupTemplatePath = __dirname + '/option-group-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionGroupTemplate = fs.readFileSync(optionGroupTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  readmeTemplate = fs.readFileSync(readmeTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  Handlebars.registerPartial('option-group', optionGroupTemplate);

  template = Handlebars.compile(optionsTemplate);

  readmeTemplate = Handlebars.compile(readmeTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-beautifiers-support', function(languageOptions, options) {
    var results, rows;
    rows = _.chain(languageOptions).filter(function(val, k) {
      return k !== "executables";
    }).map(function(val, k) {
      var defaultBeautifier, extensions, grammars, name;
      name = val.title;
      defaultBeautifier = _.get(val, "properties.default_beautifier.default");
      beautifiers = _.chain(val.beautifiers).sortBy().sortBy(function(b) {
        var isDefault;
        beautifier = beautifiersMap[b];
        isDefault = b === defaultBeautifier;
        return !isDefault;
      }).map(function(b) {
        var isDefault, r;
        beautifier = beautifiersMap[b];
        isDefault = b === defaultBeautifier;
        if (beautifier.link) {
          r = "[`" + b + "`](" + beautifier.link + ")";
        } else {
          r = "`" + b + "`";
        }
        if (isDefault) {
          r = "**" + r + "**";
        }
        return r;
      }).value();
      grammars = _.map(val.grammars, function(b) {
        return "`" + b + "`";
      });
      extensions = _.map(val.extensions, function(b) {
        return "`." + b + "`";
      });
      return "| " + name + " | " + (grammars.join(', ')) + " |" + (extensions.join(', ')) + " | " + (beautifiers.join(', ')) + " |";
    }).value();
    results = "| Language | Grammars | File Extensions | Supported Beautifiers |\n| --- | --- | --- | ---- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-options-support', function(languageOptions, options) {

    /*
    | Option | PrettyDiff | JS-Beautify |
    | --- | --- | --- |
    | `brace_style` | ? | ? |
    | `break_chained_methods` | ? | ? |
    | `end_with_comma` | ? | ? |
    | `end_with_newline` | ? | ? |
    | `eval_code` | ? | ? |
    | `indent_size` | :white_check_mark: | :white_check_mark: |
    | `indent_char` | :white_check_mark: | :white_check_mark: |
     */
    var headers, results, rows;
    rows = [];
    beautifiers = languageOptions.beautifiers.sort();
    headers = ['Option'].concat(beautifiers);
    rows.push(headers);
    rows.push(_.map(headers, function() {
      return '---';
    }));
    _.each(Object.keys(languageOptions.properties), function(op) {
      var field, support;
      field = languageOptions.properties[op];
      support = _.map(beautifiers, function(b) {
        if (_.includes(field.beautifiers, b) || _.includes(["disabled", "default_beautifier", "beautify_on_save"], op)) {
          return ':white_check_mark:';
        } else {
          return ':x:';
        }
      });
      return rows.push(["`" + op + "`"].concat(support));
    });
    results = _.map(rows, function(r) {
      return "| " + (r.join(' | ')) + " |";
    }).join('\n');
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('beautifiers-info', function(beautifiers, options) {

    /*
    | Beautifier | Preinstalled? | Installation Instructions |
    | --- | ---- |
    | Pretty Diff | :white_check_mark: | N/A |
    | AutoPEP8 | :x: | LINK |
     */
    var results, rows;
    rows = _.map(beautifiers, function(beautifier, k) {
      var dockerCell, dockerExecutables, executables, hasDockerExecutables, hasExecutables, installWithDocker, installationInstructions, isPreInstalled, link, name, preinstalledCell;
      name = beautifier.name;
      isPreInstalled = beautifier.isPreInstalled;
      if (typeof isPreInstalled === "function") {
        isPreInstalled = beautifier.isPreInstalled();
      }
      link = beautifier.link;
      executables = beautifier.executables || [];
      hasExecutables = executables.length > 0;
      dockerExecutables = executables.filter(function(exe) {
        return !!exe.docker;
      });
      hasDockerExecutables = dockerExecutables.length > 0;
      installWithDocker = dockerExecutables.map(function(d) {
        return "- " + d.docker.image;
      }).join('\n');
      preinstalledCell = (function() {
        if (isPreInstalled) {
          return ":white_check_mark:";
        } else {
          if (executables.length > 0) {
            return ":warning: " + executables.length + " executable" + (executables.length === 1 ? '' : 's');
          } else {
            return ":warning: Manual installation";
          }
        }
      })();
      dockerCell = (function() {
        if (isPreInstalled) {
          return ":ok_hand: Not necessary";
        } else {
          if (hasExecutables) {
            if (dockerExecutables.length === executables.length) {
              return ":white_check_mark: :100:% of executables";
            } else if (dockerExecutables.length > 0) {
              return ":warning: Only " + dockerExecutables.length + " of " + executables.length + " executables";
            } else {
              return ":x: No Docker support";
            }
          } else {
            return ":construction: Not an executable";
          }
        }
      })();
      installationInstructions = (function() {
        var executablesInstallation;
        if (isPreInstalled) {
          return ":smiley: Nothing!";
        } else {
          if (hasExecutables) {
            executablesInstallation = "";
            if (hasDockerExecutables) {
              executablesInstallation += ":whale: With [Docker](https://www.docker.com/):<br/>";
              dockerExecutables.forEach(function(e, i) {
                return executablesInstallation += (i + 1) + ". Install [" + (e.name || e.cmd) + " (`" + e.cmd + "`)](" + e.homepage + ") with `docker pull " + e.docker.image + "`<br/>";
              });
              executablesInstallation += "<br/>";
            }
            executablesInstallation += ":bookmark_tabs: Manually:<br/>";
            executables.forEach(function(e, i) {
              return executablesInstallation += (i + 1) + ". Install [" + (e.name || e.cmd) + " (`" + e.cmd + "`)](" + e.homepage + ") by following " + e.installation + "<br/>";
            });
            return executablesInstallation;
          } else {
            return ":page_facing_up: Go to " + link + " and follow the instructions.";
          }
        }
      })();
      return "| " + name + " | " + preinstalledCell + " | " + dockerCell + " | " + installationInstructions + " |";
    });
    results = "| Beautifier | Preinstalled | [:whale: Docker](https://www.docker.com/) | Installation |\n| --- | --- | --- |--- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  sortKeysBy = function(obj, comparator) {
    var keys;
    keys = _.sortBy(_.keys(obj), function(key) {
      if (comparator) {
        return comparator(obj[key], key);
      } else {
        return key;
      }
    });
    return _.zipObject(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  };

  sortSettings = function(settings) {
    var r;
    r = _.mapValues(settings, function(op) {
      if (op.type === "object" && op.properties) {
        op.properties = sortSettings(op.properties);
      }
      return op;
    });
    r = sortKeysBy(sortKeysBy(r), function(op) {
      return op.order;
    });
    return r;
  };

  context = {
    "package": pkg,
    packageOptions: sortSettings(packageOptions),
    languageOptions: sortSettings(languageOptions),
    beautifierOptions: sortSettings(beautifierOptions),
    beautifiers: _.sortBy(beautifier.beautifiers, function(beautifier) {
      return beautifier.name.toLowerCase();
    })
  };

  result = template(context);

  readmeResult = readmeTemplate(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  fs.writeFileSync(readmePath, readmeResult);

  console.log('Updating package.json');

  languageNames = _.map(Object.keys(languagesMap), function(a) {
    return a.toLowerCase();
  });

  beautifierNames = _.map(Object.keys(beautifiersMap), function(a) {
    return a.toLowerCase();
  });

  keywords = _.union(pkg.keywords, languageNames, beautifierNames);

  pkg.keywords = keywords;

  beautifyLanguageCommands = _.map(languageNames, function(languageName) {
    return "atom-beautify:beautify-language-" + languageName;
  });

  pkg.activationCommands["atom-workspace"] = _.union(pkg.activationCommands["atom-workspace"], beautifyLanguageCommands);

  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, void 0, 2));

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L2RvY3MvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0VBQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUjs7RUFDZCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxHQUFBLEdBQU0sT0FBQSxDQUFRLGlCQUFSOztFQUVOLE9BQU8sQ0FBQyxHQUFSLENBQVksdUJBQVo7O0VBQ0EsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQTs7RUFDakIsZUFBQSxHQUFrQixVQUFVLENBQUM7O0VBQzdCLGlCQUFBLEdBQW9CLGVBQWUsQ0FBQzs7RUFDcEMsT0FBTyxlQUFlLENBQUM7O0VBQ3ZCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHNCQUFSOztFQUNqQixjQUFjLENBQUMsV0FBZixHQUE2Qjs7RUFFN0IsY0FBQSxHQUFpQixDQUFDLENBQUMsS0FBRixDQUFRLFVBQVUsQ0FBQyxXQUFuQixFQUFnQyxNQUFoQzs7RUFDakIsWUFBQSxHQUFlLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUE3QixFQUF3QyxNQUF4Qzs7RUFDZixpQkFBQSxHQUFvQjs7QUFDcEIsT0FBQSxxQkFBQTs7QUFDRTtBQUFBLFNBQUEsaUJBQUE7O01BQ0UsV0FBQSxtREFBc0M7QUFDdEMsV0FBQSw2Q0FBQTs7O1VBQ0UsaUJBQWtCLENBQUEsY0FBQSxJQUFtQjs7UUFDckMsaUJBQWtCLENBQUEsY0FBQSxDQUFnQixDQUFBLFVBQUEsQ0FBbEMsR0FBZ0Q7QUFGbEQ7QUFGRjtBQURGOztFQU9BLE9BQU8sQ0FBQyxHQUFS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O1dBQWtCLGtDQUFBLEdBQW1DO0VBQXJELENBQXJCOztFQUMzQixHQUFHLENBQUMsa0JBQW1CLENBQUEsZ0JBQUEsQ0FBdkIsR0FBMkMsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFHLENBQUMsa0JBQW1CLENBQUEsZ0JBQUEsQ0FBL0IsRUFBa0Qsd0JBQWxEOztFQUUzQyxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBdUIsaUJBQXZCLENBQWpCLEVBQTRELElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixFQUFvQixNQUFwQixFQUErQixDQUEvQixDQUE1RDs7RUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7QUEzUkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMhL3Vzci9iaW4vZW52IGNvZmZlZVxuXG4jIERlcGVuZGVuY2llc1xuSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMnKVxuQmVhdXRpZmllcnMgPSByZXF1aXJlKFwiLi4vc3JjL2JlYXV0aWZpZXJzXCIpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxucGtnID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcblxuY29uc29sZS5sb2coJ0dlbmVyYXRpbmcgb3B0aW9ucy4uLicpXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmxhbmd1YWdlT3B0aW9ucyA9IGJlYXV0aWZpZXIub3B0aW9uc1xuZXhlY3V0YWJsZU9wdGlvbnMgPSBsYW5ndWFnZU9wdGlvbnMuZXhlY3V0YWJsZXNcbmRlbGV0ZSBsYW5ndWFnZU9wdGlvbnMuZXhlY3V0YWJsZXNcbnBhY2thZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vc3JjL2NvbmZpZy5jb2ZmZWUnKVxucGFja2FnZU9wdGlvbnMuZXhlY3V0YWJsZXMgPSBleGVjdXRhYmxlT3B0aW9uc1xuIyBCdWlsZCBvcHRpb25zIGJ5IEJlYXV0aWZpZXJcbmJlYXV0aWZpZXJzTWFwID0gXy5rZXlCeShiZWF1dGlmaWVyLmJlYXV0aWZpZXJzLCAnbmFtZScpXG5sYW5ndWFnZXNNYXAgPSBfLmtleUJ5KGJlYXV0aWZpZXIubGFuZ3VhZ2VzLmxhbmd1YWdlcywgJ25hbWUnKVxuYmVhdXRpZmllck9wdGlvbnMgPSB7fVxuZm9yIGxvLCBvcHRpb25Hcm91cCBvZiBsYW5ndWFnZU9wdGlvbnNcbiAgZm9yIG9wdGlvbk5hbWUsIG9wdGlvbkRlZiBvZiBvcHRpb25Hcm91cC5wcm9wZXJ0aWVzXG4gICAgYmVhdXRpZmllcnMgPSBvcHRpb25EZWYuYmVhdXRpZmllcnMgPyBbXVxuICAgIGZvciBiZWF1dGlmaWVyTmFtZSBpbiBiZWF1dGlmaWVyc1xuICAgICAgYmVhdXRpZmllck9wdGlvbnNbYmVhdXRpZmllck5hbWVdID89IHt9XG4gICAgICBiZWF1dGlmaWVyT3B0aW9uc1tiZWF1dGlmaWVyTmFtZV1bb3B0aW9uTmFtZV0gPSBvcHRpb25EZWZcblxuY29uc29sZS5sb2coJ0xvYWRpbmcgb3B0aW9ucyB0ZW1wbGF0ZS4uLicpXG5yZWFkbWVUZW1wbGF0ZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vUkVBRE1FLXRlbXBsYXRlLm1kJylcbnJlYWRtZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vUkVBRE1FLm1kJylcbm9wdGlvbnNUZW1wbGF0ZVBhdGggPSBfX2Rpcm5hbWUgKyAnL29wdGlvbnMtdGVtcGxhdGUubWQnXG5vcHRpb25UZW1wbGF0ZVBhdGggPSBfX2Rpcm5hbWUgKyAnL29wdGlvbi10ZW1wbGF0ZS5tZCdcbm9wdGlvbkdyb3VwVGVtcGxhdGVQYXRoID0gX19kaXJuYW1lICsgJy9vcHRpb24tZ3JvdXAtdGVtcGxhdGUubWQnXG5vcHRpb25zUGF0aCA9IF9fZGlybmFtZSArICcvb3B0aW9ucy5tZCdcblxub3B0aW9uc1RlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKG9wdGlvbnNUZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKClcbm9wdGlvbkdyb3VwVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMob3B0aW9uR3JvdXBUZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKClcbm9wdGlvblRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKG9wdGlvblRlbXBsYXRlUGF0aCkudG9TdHJpbmcoKVxucmVhZG1lVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMocmVhZG1lVGVtcGxhdGVQYXRoKS50b1N0cmluZygpXG5cbmNvbnNvbGUubG9nKCdCdWlsZGluZyBkb2N1bWVudGF0aW9uIGZyb20gdGVtcGxhdGUgYW5kIG9wdGlvbnMuLi4nKVxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoJ29wdGlvbicsIG9wdGlvblRlbXBsYXRlKVxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoJ29wdGlvbi1ncm91cCcsIG9wdGlvbkdyb3VwVGVtcGxhdGUpXG50ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShvcHRpb25zVGVtcGxhdGUpXG5yZWFkbWVUZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShyZWFkbWVUZW1wbGF0ZSlcblxubGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICB0aXRsZSA9IHRpdGxlLnRvTG93ZXJDYXNlKClcbiAgcCA9IHRpdGxlLnNwbGl0KC9bXFxzLCsjOyxcXC8/OkAmPSskXSsvKSAjIHNwbGl0IGludG8gcGFydHNcbiAgc2VwID0gXCItXCJcbiAgcC5qb2luKHNlcClcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbGlua2lmeScsICh0aXRsZSwgb3B0aW9ucykgLT5cbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoXG4gICAgXCJbI3tvcHRpb25zLmZuKHRoaXMpfV0oXFwjI3tsaW5raWZ5VGl0bGUodGl0bGUpfSlcIlxuICApXG4pXG5cbmV4YW1wbGVDb25maWcgPSAob3B0aW9uKSAtPlxuICAjIGNvbnNvbGUubG9nKG9wdGlvbilcbiAgdCA9IG9wdGlvbi50eXBlXG4gIGQgPSBzd2l0Y2hcbiAgICB3aGVuIG9wdGlvbi5kZWZhdWx0PyB0aGVuIG9wdGlvbi5kZWZhdWx0XG4gICAgd2hlbiB0IGlzIFwic3RyaW5nXCIgdGhlbiBcIlwiXG4gICAgd2hlbiB0IGlzIFwiaW50ZWdlclwiIHRoZW4gMFxuICAgIHdoZW4gdCBpcyBcImJvb2xlYW5cIiB0aGVuIGZhbHNlXG4gICAgZWxzZSBudWxsXG5cbiAganNvbiA9IHt9XG4gIG5hbWVzcGFjZSA9IG9wdGlvbi5sYW5ndWFnZS5uYW1lc3BhY2VcbiAgayA9IG9wdGlvbi5rZXlcbiAgYyA9IHt9XG4gIGNba10gPSBkXG4gIGpzb25bbmFtZXNwYWNlXSA9IGNcbiAgcmV0dXJuIFwiXCJcImBgYGpzb25cbiAgI3tKU09OLnN0cmluZ2lmeShqc29uLCB1bmRlZmluZWQsIDQpfVxuICBgYGBcIlwiXCJcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZXhhbXBsZS1jb25maWcnLCAoa2V5LCBvcHRpb24sIG9wdGlvbnMpIC0+XG4gIHJlc3VsdHMgPSBleGFtcGxlQ29uZmlnKGtleSwgb3B0aW9uKVxuICAjIGNvbnNvbGUubG9nKHJlc3VsdHMpXG4gIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHJlc3VsdHMpXG4pXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2xhbmd1YWdlLWJlYXV0aWZpZXJzLXN1cHBvcnQnLCAobGFuZ3VhZ2VPcHRpb25zLCBvcHRpb25zKSAtPlxuXG4gIHJvd3MgPSBfLmNoYWluKGxhbmd1YWdlT3B0aW9ucylcbiAgICAuZmlsdGVyKCh2YWwsIGspIC0+IGsgaXNudCBcImV4ZWN1dGFibGVzXCIpXG4gICAgLm1hcCgodmFsLCBrKSAtPlxuICAgICAgbmFtZSA9IHZhbC50aXRsZVxuICAgICAgZGVmYXVsdEJlYXV0aWZpZXIgPSBfLmdldCh2YWwsIFwicHJvcGVydGllcy5kZWZhdWx0X2JlYXV0aWZpZXIuZGVmYXVsdFwiKVxuICAgICAgYmVhdXRpZmllcnMgPSBfLmNoYWluKHZhbC5iZWF1dGlmaWVycylcbiAgICAgICAgLnNvcnRCeSgpXG4gICAgICAgIC5zb3J0QnkoKGIpIC0+XG4gICAgICAgICAgYmVhdXRpZmllciA9IGJlYXV0aWZpZXJzTWFwW2JdXG4gICAgICAgICAgaXNEZWZhdWx0ID0gYiBpcyBkZWZhdWx0QmVhdXRpZmllclxuICAgICAgICAgIHJldHVybiAhaXNEZWZhdWx0XG4gICAgICAgIClcbiAgICAgICAgLm1hcCgoYikgLT5cbiAgICAgICAgICBiZWF1dGlmaWVyID0gYmVhdXRpZmllcnNNYXBbYl1cbiAgICAgICAgICBpc0RlZmF1bHQgPSBiIGlzIGRlZmF1bHRCZWF1dGlmaWVyXG4gICAgICAgICAgaWYgYmVhdXRpZmllci5saW5rXG4gICAgICAgICAgICByID0gXCJbYCN7Yn1gXSgje2JlYXV0aWZpZXIubGlua30pXCJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByID0gXCJgI3tifWBcIlxuICAgICAgICAgIGlmIGlzRGVmYXVsdFxuICAgICAgICAgICAgciA9IFwiKioje3J9KipcIlxuICAgICAgICAgIHJldHVybiByXG4gICAgICAgIClcbiAgICAgICAgLnZhbHVlKClcbiAgICAgIGdyYW1tYXJzID0gXy5tYXAodmFsLmdyYW1tYXJzLCAoYikgLT4gXCJgI3tifWBcIilcbiAgICAgIGV4dGVuc2lvbnMgPSBfLm1hcCh2YWwuZXh0ZW5zaW9ucywgKGIpIC0+IFwiYC4je2J9YFwiKVxuXG4gICAgICByZXR1cm4gXCJ8ICN7bmFtZX0gfCAje2dyYW1tYXJzLmpvaW4oJywgJyl9IHwje2V4dGVuc2lvbnMuam9pbignLCAnKX0gfCAje2JlYXV0aWZpZXJzLmpvaW4oJywgJyl9IHxcIlxuICAgIClcbiAgICAudmFsdWUoKVxuICByZXN1bHRzID0gXCJcIlwiXG4gIHwgTGFuZ3VhZ2UgfCBHcmFtbWFycyB8IEZpbGUgRXh0ZW5zaW9ucyB8IFN1cHBvcnRlZCBCZWF1dGlmaWVycyB8XG4gIHwgLS0tIHwgLS0tIHwgLS0tIHwgLS0tLSB8XG4gICN7cm93cy5qb2luKCdcXG4nKX1cbiAgXCJcIlwiXG4gIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHJlc3VsdHMpXG4pXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2xhbmd1YWdlLW9wdGlvbnMtc3VwcG9ydCcsIChsYW5ndWFnZU9wdGlvbnMsIG9wdGlvbnMpIC0+XG5cbiAgIyMjXG4gIHwgT3B0aW9uIHwgUHJldHR5RGlmZiB8IEpTLUJlYXV0aWZ5IHxcbiAgfCAtLS0gfCAtLS0gfCAtLS0gfFxuICB8IGBicmFjZV9zdHlsZWAgfCA/IHwgPyB8XG4gIHwgYGJyZWFrX2NoYWluZWRfbWV0aG9kc2AgfCA/IHwgPyB8XG4gIHwgYGVuZF93aXRoX2NvbW1hYCB8ID8gfCA/IHxcbiAgfCBgZW5kX3dpdGhfbmV3bGluZWAgfCA/IHwgPyB8XG4gIHwgYGV2YWxfY29kZWAgfCA/IHwgPyB8XG4gIHwgYGluZGVudF9zaXplYCB8IDp3aGl0ZV9jaGVja19tYXJrOiB8IDp3aGl0ZV9jaGVja19tYXJrOiB8XG4gIHwgYGluZGVudF9jaGFyYCB8IDp3aGl0ZV9jaGVja19tYXJrOiB8IDp3aGl0ZV9jaGVja19tYXJrOiB8XG4gICMjI1xuXG4gIHJvd3MgPSBbXVxuICBiZWF1dGlmaWVycyA9IGxhbmd1YWdlT3B0aW9ucy5iZWF1dGlmaWVycy5zb3J0KClcbiAgaGVhZGVycyA9IFsnT3B0aW9uJ10uY29uY2F0KGJlYXV0aWZpZXJzKVxuICByb3dzLnB1c2goaGVhZGVycylcbiAgcm93cy5wdXNoKF8ubWFwKGhlYWRlcnMsICgpIC0+ICctLS0nKSlcbiAgIyBjb25zb2xlLmxvZyhsYW5ndWFnZU9wdGlvbnMpXG4gIF8uZWFjaChPYmplY3Qua2V5cyhsYW5ndWFnZU9wdGlvbnMucHJvcGVydGllcyksIChvcCkgLT5cbiAgICBmaWVsZCA9IGxhbmd1YWdlT3B0aW9ucy5wcm9wZXJ0aWVzW29wXVxuICAgIHN1cHBvcnQgPSBfLm1hcChiZWF1dGlmaWVycywgKGIpIC0+XG4gICAgICBpZiAoXy5pbmNsdWRlcyhmaWVsZC5iZWF1dGlmaWVycywgYikgb3IgXy5pbmNsdWRlcyhbXCJkaXNhYmxlZFwiLCBcImRlZmF1bHRfYmVhdXRpZmllclwiLCBcImJlYXV0aWZ5X29uX3NhdmVcIl0sIG9wKSlcbiAgICAgICAgcmV0dXJuICc6d2hpdGVfY2hlY2tfbWFyazonXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnOng6J1xuICAgIClcbiAgICByb3dzLnB1c2goW1wiYCN7b3B9YFwiXS5jb25jYXQoc3VwcG9ydCkpXG4gIClcblxuICByZXN1bHRzID0gXy5tYXAocm93cywgKHIpIC0+IFwifCAje3Iuam9pbignIHwgJyl9IHxcIikuam9pbignXFxuJylcbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcocmVzdWx0cylcbilcblxuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdiZWF1dGlmaWVycy1pbmZvJywgKGJlYXV0aWZpZXJzLCBvcHRpb25zKSAtPlxuXG4gICMjI1xuICB8IEJlYXV0aWZpZXIgfCBQcmVpbnN0YWxsZWQ/IHwgSW5zdGFsbGF0aW9uIEluc3RydWN0aW9ucyB8XG4gIHwgLS0tIHwgLS0tLSB8XG4gIHwgUHJldHR5IERpZmYgfCA6d2hpdGVfY2hlY2tfbWFyazogfCBOL0EgfFxuICB8IEF1dG9QRVA4IHwgOng6IHwgTElOSyB8XG4gICMjI1xuXG4gIHJvd3MgPSBfLm1hcChiZWF1dGlmaWVycywgKGJlYXV0aWZpZXIsIGspIC0+XG4gICAgbmFtZSA9IGJlYXV0aWZpZXIubmFtZVxuICAgIGlzUHJlSW5zdGFsbGVkID0gYmVhdXRpZmllci5pc1ByZUluc3RhbGxlZFxuICAgIGlmIHR5cGVvZiBpc1ByZUluc3RhbGxlZCBpcyBcImZ1bmN0aW9uXCJcbiAgICAgIGlzUHJlSW5zdGFsbGVkID0gYmVhdXRpZmllci5pc1ByZUluc3RhbGxlZCgpXG4gICAgbGluayA9IGJlYXV0aWZpZXIubGlua1xuICAgIGV4ZWN1dGFibGVzID0gYmVhdXRpZmllci5leGVjdXRhYmxlcyBvciBbXVxuICAgIGhhc0V4ZWN1dGFibGVzID0gZXhlY3V0YWJsZXMubGVuZ3RoID4gMFxuICAgIGRvY2tlckV4ZWN1dGFibGVzID0gZXhlY3V0YWJsZXMuZmlsdGVyKChleGUpIC0+ICEhZXhlLmRvY2tlcilcbiAgICBoYXNEb2NrZXJFeGVjdXRhYmxlcyA9IGRvY2tlckV4ZWN1dGFibGVzLmxlbmd0aCA+IDBcbiAgICBpbnN0YWxsV2l0aERvY2tlciA9IGRvY2tlckV4ZWN1dGFibGVzLm1hcCgoZCkgLT4gXCItICN7ZC5kb2NrZXIuaW1hZ2V9XCIpLmpvaW4oJ1xcbicpXG5cbiAgICBwcmVpbnN0YWxsZWRDZWxsID0gZG8gKCgpIC0+XG4gICAgICBpZiBpc1ByZUluc3RhbGxlZFxuICAgICAgICBcIjp3aGl0ZV9jaGVja19tYXJrOlwiXG4gICAgICBlbHNlXG4gICAgICAgIGlmIGV4ZWN1dGFibGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICBcIjp3YXJuaW5nOiAje2V4ZWN1dGFibGVzLmxlbmd0aH0gZXhlY3V0YWJsZSN7aWYgZXhlY3V0YWJsZXMubGVuZ3RoIGlzIDEgdGhlbiAnJyBlbHNlICdzJ31cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgXCI6d2FybmluZzogTWFudWFsIGluc3RhbGxhdGlvblwiXG4gICAgKVxuICAgIGRvY2tlckNlbGwgPSBkbyAoKCkgLT5cbiAgICAgIGlmIGlzUHJlSW5zdGFsbGVkXG4gICAgICAgIFwiOm9rX2hhbmQ6IE5vdCBuZWNlc3NhcnlcIlxuICAgICAgZWxzZVxuICAgICAgICBpZiBoYXNFeGVjdXRhYmxlc1xuICAgICAgICAgIGlmIGRvY2tlckV4ZWN1dGFibGVzLmxlbmd0aCBpcyBleGVjdXRhYmxlcy5sZW5ndGhcbiAgICAgICAgICAgIFwiOndoaXRlX2NoZWNrX21hcms6IDoxMDA6JSBvZiBleGVjdXRhYmxlc1wiXG4gICAgICAgICAgZWxzZSBpZiBkb2NrZXJFeGVjdXRhYmxlcy5sZW5ndGggPiAwXG4gICAgICAgICAgICBcIjp3YXJuaW5nOiBPbmx5ICN7ZG9ja2VyRXhlY3V0YWJsZXMubGVuZ3RofSBvZiAje2V4ZWN1dGFibGVzLmxlbmd0aH0gZXhlY3V0YWJsZXNcIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFwiOng6IE5vIERvY2tlciBzdXBwb3J0XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFwiOmNvbnN0cnVjdGlvbjogTm90IGFuIGV4ZWN1dGFibGVcIlxuICAgIClcbiAgICBpbnN0YWxsYXRpb25JbnN0cnVjdGlvbnMgPSBkbyAoKCkgLT5cbiAgICAgIGlmIGlzUHJlSW5zdGFsbGVkXG4gICAgICAgIFwiOnNtaWxleTogTm90aGluZyFcIlxuICAgICAgZWxzZVxuICAgICAgICBpZiBoYXNFeGVjdXRhYmxlc1xuICAgICAgICAgIGV4ZWN1dGFibGVzSW5zdGFsbGF0aW9uID0gXCJcIlxuICAgICAgICAgIGlmIGhhc0RvY2tlckV4ZWN1dGFibGVzXG4gICAgICAgICAgICBleGVjdXRhYmxlc0luc3RhbGxhdGlvbiArPSBcIjp3aGFsZTogV2l0aCBbRG9ja2VyXShodHRwczovL3d3dy5kb2NrZXIuY29tLyk6PGJyLz5cIlxuICAgICAgICAgICAgZG9ja2VyRXhlY3V0YWJsZXMuZm9yRWFjaCgoZSwgaSkgLT5cbiAgICAgICAgICAgICAgZXhlY3V0YWJsZXNJbnN0YWxsYXRpb24gKz0gXCIje2krMX0uIEluc3RhbGwgWyN7ZS5uYW1lIG9yIGUuY21kfSAoYCN7ZS5jbWR9YCldKCN7ZS5ob21lcGFnZX0pIHdpdGggYGRvY2tlciBwdWxsICN7ZS5kb2NrZXIuaW1hZ2V9YDxici8+XCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGV4ZWN1dGFibGVzSW5zdGFsbGF0aW9uICs9IFwiPGJyLz5cIlxuICAgICAgICAgIGV4ZWN1dGFibGVzSW5zdGFsbGF0aW9uICs9IFwiOmJvb2ttYXJrX3RhYnM6IE1hbnVhbGx5Ojxici8+XCJcbiAgICAgICAgICBleGVjdXRhYmxlcy5mb3JFYWNoKChlLCBpKSAtPlxuICAgICAgICAgICAgZXhlY3V0YWJsZXNJbnN0YWxsYXRpb24gKz0gXCIje2krMX0uIEluc3RhbGwgWyN7ZS5uYW1lIG9yIGUuY21kfSAoYCN7ZS5jbWR9YCldKCN7ZS5ob21lcGFnZX0pIGJ5IGZvbGxvd2luZyAje2UuaW5zdGFsbGF0aW9ufTxici8+XCJcbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIGV4ZWN1dGFibGVzSW5zdGFsbGF0aW9uXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBcIjpwYWdlX2ZhY2luZ191cDogR28gdG8gI3tsaW5rfSBhbmQgZm9sbG93IHRoZSBpbnN0cnVjdGlvbnMuXCJcbiAgICApXG4gICAgcmV0dXJuIFwifCAje25hbWV9IHwgI3twcmVpbnN0YWxsZWRDZWxsfSB8ICN7ZG9ja2VyQ2VsbH0gfCAje2luc3RhbGxhdGlvbkluc3RydWN0aW9uc30gfFwiXG4gIClcbiAgcmVzdWx0cyA9IFwiXCJcIlxuICB8IEJlYXV0aWZpZXIgfCBQcmVpbnN0YWxsZWQgfCBbOndoYWxlOiBEb2NrZXJdKGh0dHBzOi8vd3d3LmRvY2tlci5jb20vKSB8IEluc3RhbGxhdGlvbiB8XG4gIHwgLS0tIHwgLS0tIHwgLS0tIHwtLS0gfFxuICAje3Jvd3Muam9pbignXFxuJyl9XG4gIFwiXCJcIlxuICByZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhyZXN1bHRzKVxuKVxuXG5zb3J0S2V5c0J5ID0gKG9iaiwgY29tcGFyYXRvcikgLT5cbiAga2V5cyA9IF8uc29ydEJ5KF8ua2V5cyhvYmopLCAoa2V5KSAtPlxuICAgIHJldHVybiBpZiBjb21wYXJhdG9yIHRoZW4gY29tcGFyYXRvcihvYmpba2V5XSwga2V5KSBlbHNlIGtleVxuICApXG4gIHJldHVybiBfLnppcE9iamVjdChrZXlzLCBfLm1hcChrZXlzLCAoa2V5KSAtPlxuICAgIHJldHVybiBvYmpba2V5XVxuICApKVxuXG5zb3J0U2V0dGluZ3MgPSAoc2V0dGluZ3MpIC0+XG4gICMgVE9ETzogUHJvY2VzcyBvYmplY3QgdHlwZSBvcHRpb25zXG4gIHIgPSBfLm1hcFZhbHVlcyhzZXR0aW5ncywgKG9wKSAtPlxuICAgIGlmIG9wLnR5cGUgaXMgXCJvYmplY3RcIiBhbmQgb3AucHJvcGVydGllc1xuICAgICAgb3AucHJvcGVydGllcyA9IHNvcnRTZXR0aW5ncyhvcC5wcm9wZXJ0aWVzKVxuICAgIHJldHVybiBvcFxuICApXG4gICMgUHJvY2VzcyB0aGVzZSBzZXR0aW5nc1xuICByID0gc29ydEtleXNCeShzb3J0S2V5c0J5KHIpLCAob3ApIC0+IG9wLm9yZGVyKVxuICAjIHIgPSBfLmNoYWluKHIpLnNvcnRCeSgob3ApIC0+IG9wLmtleSkuc29ydEJ5KChvcCkgLT4gc2V0dGluZ3Nbb3Aua2V5XT8ub3JkZXIpLnZhbHVlKClcbiAgIyBjb25zb2xlLmxvZygnc29ydCcsIHNldHRpbmdzLCByKVxuICByZXR1cm4gclxuXG5jb250ZXh0ID0ge1xuICBwYWNrYWdlOiBwa2csXG4gIHBhY2thZ2VPcHRpb25zOiBzb3J0U2V0dGluZ3MocGFja2FnZU9wdGlvbnMpXG4gIGxhbmd1YWdlT3B0aW9uczogc29ydFNldHRpbmdzKGxhbmd1YWdlT3B0aW9ucylcbiAgYmVhdXRpZmllck9wdGlvbnM6IHNvcnRTZXR0aW5ncyhiZWF1dGlmaWVyT3B0aW9ucylcbiAgYmVhdXRpZmllcnM6IF8uc29ydEJ5KGJlYXV0aWZpZXIuYmVhdXRpZmllcnMsIChiZWF1dGlmaWVyKSAtPiBiZWF1dGlmaWVyLm5hbWUudG9Mb3dlckNhc2UoKSlcbn1cbnJlc3VsdCA9IHRlbXBsYXRlKGNvbnRleHQpXG5yZWFkbWVSZXN1bHQgPSByZWFkbWVUZW1wbGF0ZShjb250ZXh0KVxuXG5jb25zb2xlLmxvZygnV3JpdGluZyBkb2N1bWVudGF0aW9uIHRvIGZpbGUuLi4nKVxuZnMud3JpdGVGaWxlU3luYyhvcHRpb25zUGF0aCwgcmVzdWx0KVxuZnMud3JpdGVGaWxlU3luYyhyZWFkbWVQYXRoLCByZWFkbWVSZXN1bHQpXG4jIGZzLndyaXRlRmlsZVN5bmMoX19kaXJuYW1lKycvY29udGV4dC5qc29uJywgSlNPTi5zdHJpbmdpZnkoY29udGV4dCwgdW5kZWZpbmVkLCAyKSlcblxuY29uc29sZS5sb2coJ1VwZGF0aW5nIHBhY2thZ2UuanNvbicpXG4jIEFkZCBMYW5ndWFnZSBrZXl3b3Jkc1xubGFuZ3VhZ2VOYW1lcyA9IF8ubWFwKE9iamVjdC5rZXlzKGxhbmd1YWdlc01hcCksIChhKS0+YS50b0xvd2VyQ2FzZSgpKVxuXG4jIEFkZCBCZWF1dGlmaWVyIGtleXdvcmRzXG5iZWF1dGlmaWVyTmFtZXMgPSBfLm1hcChPYmplY3Qua2V5cyhiZWF1dGlmaWVyc01hcCksIChhKS0+YS50b0xvd2VyQ2FzZSgpKVxua2V5d29yZHMgPSBfLnVuaW9uKHBrZy5rZXl3b3JkcywgbGFuZ3VhZ2VOYW1lcywgYmVhdXRpZmllck5hbWVzKVxucGtnLmtleXdvcmRzID0ga2V5d29yZHNcblxuIyBBZGQgTGFuZ3VhZ2Utc3BlY2lmaWMgYmVhdXRpZnkgY29tbWFuZHNcbmJlYXV0aWZ5TGFuZ3VhZ2VDb21tYW5kcyA9IF8ubWFwKGxhbmd1YWdlTmFtZXMsIChsYW5ndWFnZU5hbWUpIC0+IFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1sYW5ndWFnZS0je2xhbmd1YWdlTmFtZX1cIilcbnBrZy5hY3RpdmF0aW9uQ29tbWFuZHNbXCJhdG9tLXdvcmtzcGFjZVwiXSA9IF8udW5pb24ocGtnLmFjdGl2YXRpb25Db21tYW5kc1tcImF0b20td29ya3NwYWNlXCJdLCBiZWF1dGlmeUxhbmd1YWdlQ29tbWFuZHMpXG5cbmZzLndyaXRlRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwnLi4vcGFja2FnZS5qc29uJyksIEpTT04uc3RyaW5naWZ5KHBrZywgdW5kZWZpbmVkLCAyKSlcblxuY29uc29sZS5sb2coJ0RvbmUuJylcbiJdfQ==

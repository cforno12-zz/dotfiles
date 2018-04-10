(function() {
  var ColorBuffer, ColorBufferElement, ColorMarker, ColorProject, ColorProjectElement, ColorResultsElement, ColorSearch, Disposable, Palette, PaletteElement, PigmentsAPI, PigmentsProvider, VariablesCollection, ref, uris, url;

  ref = [], Palette = ref[0], PaletteElement = ref[1], ColorSearch = ref[2], ColorResultsElement = ref[3], ColorProject = ref[4], ColorProjectElement = ref[5], ColorBuffer = ref[6], ColorBufferElement = ref[7], ColorMarker = ref[8], VariablesCollection = ref[9], PigmentsProvider = ref[10], PigmentsAPI = ref[11], Disposable = ref[12], url = ref[13], uris = ref[14];

  module.exports = {
    activate: function(state) {
      var convertMethod, copyMethod;
      if (ColorProject == null) {
        ColorProject = require('./color-project');
      }
      this.project = state.project != null ? ColorProject.deserialize(state.project) : new ColorProject();
      atom.commands.add('atom-workspace', {
        'pigments:find-colors': (function(_this) {
          return function() {
            return _this.findColors();
          };
        })(this),
        'pigments:show-palette': (function(_this) {
          return function() {
            return _this.showPalette();
          };
        })(this),
        'pigments:project-settings': (function(_this) {
          return function() {
            return _this.showSettings();
          };
        })(this),
        'pigments:reload': (function(_this) {
          return function() {
            return _this.reloadProjectVariables();
          };
        })(this),
        'pigments:report': (function(_this) {
          return function() {
            return _this.createPigmentsReport();
          };
        })(this)
      });
      convertMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, editor;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              editor.getCursors().forEach(function(cursor) {
                var marker;
                marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
                return action(marker);
              });
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      copyMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, cursor, editor, marker;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              cursor = editor.getLastCursor();
              marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
              action(marker);
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      atom.commands.add('atom-text-editor', {
        'pigments:convert-to-hex': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHex();
          }
        }),
        'pigments:convert-to-rgb': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGB();
          }
        }),
        'pigments:convert-to-rgba': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGBA();
          }
        }),
        'pigments:convert-to-hsl': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSL();
          }
        }),
        'pigments:convert-to-hsla': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSLA();
          }
        }),
        'pigments:copy-as-hex': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHex();
          }
        }),
        'pigments:copy-as-rgb': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGB();
          }
        }),
        'pigments:copy-as-rgba': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGBA();
          }
        }),
        'pigments:copy-as-hsl': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSL();
          }
        }),
        'pigments:copy-as-hsla': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSLA();
          }
        })
      });
      atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var host, protocol, ref1;
          url || (url = require('url'));
          ref1 = url.parse(uriToOpen), protocol = ref1.protocol, host = ref1.host;
          if (protocol !== 'pigments:') {
            return;
          }
          switch (host) {
            case 'search':
              return _this.project.findAllColors();
            case 'palette':
              return _this.project.getPalette();
            case 'settings':
              return atom.views.getView(_this.project);
          }
        };
      })(this));
      return atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Pigments',
            submenu: [
              {
                label: 'Convert to hexadecimal',
                command: 'pigments:convert-to-hex'
              }, {
                label: 'Convert to RGB',
                command: 'pigments:convert-to-rgb'
              }, {
                label: 'Convert to RGBA',
                command: 'pigments:convert-to-rgba'
              }, {
                label: 'Convert to HSL',
                command: 'pigments:convert-to-hsl'
              }, {
                label: 'Convert to HSLA',
                command: 'pigments:convert-to-hsla'
              }, {
                type: 'separator'
              }, {
                label: 'Copy as hexadecimal',
                command: 'pigments:copy-as-hex'
              }, {
                label: 'Copy as RGB',
                command: 'pigments:copy-as-rgb'
              }, {
                label: 'Copy as RGBA',
                command: 'pigments:copy-as-rgba'
              }, {
                label: 'Copy as HSL',
                command: 'pigments:copy-as-hsl'
              }, {
                label: 'Copy as HSLA',
                command: 'pigments:copy-as-hsla'
              }
            ],
            shouldDisplay: (function(_this) {
              return function(event) {
                return _this.shouldDisplayContextMenu(event);
              };
            })(this)
          }
        ]
      });
    },
    deactivate: function() {
      var ref1;
      return (ref1 = this.getProject()) != null ? typeof ref1.destroy === "function" ? ref1.destroy() : void 0 : void 0;
    },
    provideAutocomplete: function() {
      if (PigmentsProvider == null) {
        PigmentsProvider = require('./pigments-provider');
      }
      return new PigmentsProvider(this);
    },
    provideAPI: function() {
      if (PigmentsAPI == null) {
        PigmentsAPI = require('./pigments-api');
      }
      return new PigmentsAPI(this.getProject());
    },
    consumeColorPicker: function(api) {
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      this.getProject().setColorPickerAPI(api);
      return new Disposable((function(_this) {
        return function() {
          return _this.getProject().setColorPickerAPI(null);
        };
      })(this));
    },
    consumeColorExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      registry = this.getProject().getColorExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var i, len, name, results;
          results = [];
          for (i = 0, len = names.length; i < len; i++) {
            name = names[i];
            results.push(registry.removeExpression(name));
          }
          return results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    consumeVariableExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      if (Disposable == null) {
        Disposable = require('atom').Disposable;
      }
      registry = this.getProject().getVariableExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var i, len, name, results;
          results = [];
          for (i = 0, len = names.length; i < len; i++) {
            name = names[i];
            results.push(registry.removeExpression(name));
          }
          return results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    deserializePalette: function(state) {
      if (Palette == null) {
        Palette = require('./palette');
      }
      return Palette.deserialize(state);
    },
    deserializeColorSearch: function(state) {
      if (ColorSearch == null) {
        ColorSearch = require('./color-search');
      }
      return ColorSearch.deserialize(state);
    },
    deserializeColorProject: function(state) {
      if (ColorProject == null) {
        ColorProject = require('./color-project');
      }
      return ColorProject.deserialize(state);
    },
    deserializeColorProjectElement: function(state) {
      var element, subscription;
      if (ColorProjectElement == null) {
        ColorProjectElement = require('./color-project-element');
      }
      element = new ColorProjectElement;
      if (this.project != null) {
        element.setModel(this.getProject());
      } else {
        subscription = atom.packages.onDidActivatePackage((function(_this) {
          return function(pkg) {
            if (pkg.name === 'pigments') {
              subscription.dispose();
              return element.setModel(_this.getProject());
            }
          };
        })(this));
      }
      return element;
    },
    deserializeVariablesCollection: function(state) {
      if (VariablesCollection == null) {
        VariablesCollection = require('./variables-collection');
      }
      return VariablesCollection.deserialize(state);
    },
    pigmentsViewProvider: function(model) {
      var element;
      element = model instanceof (ColorBuffer != null ? ColorBuffer : ColorBuffer = require('./color-buffer')) ? (ColorBufferElement != null ? ColorBufferElement : ColorBufferElement = require('./color-buffer-element'), element = new ColorBufferElement) : model instanceof (ColorSearch != null ? ColorSearch : ColorSearch = require('./color-search')) ? (ColorResultsElement != null ? ColorResultsElement : ColorResultsElement = require('./color-results-element'), element = new ColorResultsElement) : model instanceof (ColorProject != null ? ColorProject : ColorProject = require('./color-project')) ? (ColorProjectElement != null ? ColorProjectElement : ColorProjectElement = require('./color-project-element'), element = new ColorProjectElement) : model instanceof (Palette != null ? Palette : Palette = require('./palette')) ? (PaletteElement != null ? PaletteElement : PaletteElement = require('./palette-element'), element = new PaletteElement) : void 0;
      if (element != null) {
        element.setModel(model);
      }
      return element;
    },
    shouldDisplayContextMenu: function(event) {
      this.lastEvent = event;
      setTimeout(((function(_this) {
        return function() {
          return _this.lastEvent = null;
        };
      })(this)), 10);
      return this.colorMarkerForMouseEvent(event) != null;
    },
    colorMarkerForMouseEvent: function(event) {
      var colorBuffer, colorBufferElement, editor;
      editor = atom.workspace.getActiveTextEditor();
      colorBuffer = this.project.colorBufferForEditor(editor);
      colorBufferElement = atom.views.getView(colorBuffer);
      return colorBufferElement != null ? colorBufferElement.colorMarkerForMouseEvent(event) : void 0;
    },
    serialize: function() {
      return {
        project: this.project.serialize()
      };
    },
    getProject: function() {
      return this.project;
    },
    findColors: function() {
      var pane;
      if (uris == null) {
        uris = require('./uris');
      }
      pane = atom.workspace.paneForURI(uris.SEARCH);
      pane || (pane = atom.workspace.getActivePane());
      return atom.workspace.openURIInPane(uris.SEARCH, pane, {});
    },
    showPalette: function() {
      if (uris == null) {
        uris = require('./uris');
      }
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.PALETTE);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.PALETTE, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    showSettings: function() {
      if (uris == null) {
        uris = require('./uris');
      }
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.SETTINGS);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.SETTINGS, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    reloadProjectVariables: function() {
      return this.project.reload();
    },
    createPigmentsReport: function() {
      return atom.workspace.open('pigments-report.json').then((function(_this) {
        return function(editor) {
          return editor.setText(_this.createReport());
        };
      })(this));
    },
    createReport: function() {
      var o;
      o = {
        atom: atom.getVersion(),
        pigments: atom.packages.getLoadedPackage('pigments').metadata.version,
        platform: require('os').platform(),
        config: atom.config.get('pigments'),
        project: {
          config: {
            sourceNames: this.project.sourceNames,
            searchNames: this.project.searchNames,
            ignoredNames: this.project.ignoredNames,
            ignoredScopes: this.project.ignoredScopes,
            includeThemes: this.project.includeThemes,
            ignoreGlobalSourceNames: this.project.ignoreGlobalSourceNames,
            ignoreGlobalSearchNames: this.project.ignoreGlobalSearchNames,
            ignoreGlobalIgnoredNames: this.project.ignoreGlobalIgnoredNames,
            ignoreGlobalIgnoredScopes: this.project.ignoreGlobalIgnoredScopes
          },
          paths: this.project.getPaths(),
          variables: {
            colors: this.project.getColorVariables().length,
            total: this.project.getVariables().length
          }
        }
      };
      return JSON.stringify(o, null, 2).replace(RegExp("" + (atom.project.getPaths().join('|')), "g"), '<root>');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGlnbWVudHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQVNJLEVBVEosRUFDRSxnQkFERixFQUNXLHVCQURYLEVBRUUsb0JBRkYsRUFFZSw0QkFGZixFQUdFLHFCQUhGLEVBR2dCLDRCQUhoQixFQUlFLG9CQUpGLEVBSWUsMkJBSmYsRUFLRSxvQkFMRixFQU1FLDRCQU5GLEVBTXVCLDBCQU52QixFQU15QyxxQkFOekMsRUFPRSxvQkFQRixFQVFFLGFBUkYsRUFRTzs7RUFHUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7O1FBQUEsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSOztNQUVoQixJQUFDLENBQUEsT0FBRCxHQUFjLHFCQUFILEdBQ1QsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsS0FBSyxDQUFDLE9BQS9CLENBRFMsR0FHTCxJQUFBLFlBQUEsQ0FBQTtNQUVOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtRQUFBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtRQUNBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR6QjtRQUVBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUY3QjtRQUdBLGlCQUFBLEVBQW1C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YWxldHRlRWxlbWVudCxcbiAgQ29sb3JTZWFyY2gsIENvbG9yUmVzdWx0c0VsZW1lbnQsXG4gIENvbG9yUHJvamVjdCwgQ29sb3JQcm9qZWN0RWxlbWVudCxcbiAgQ29sb3JCdWZmZXIsIENvbG9yQnVmZmVyRWxlbWVudCxcbiAgQ29sb3JNYXJrZXIsXG4gIFZhcmlhYmxlc0NvbGxlY3Rpb24sIFBpZ21lbnRzUHJvdmlkZXIsIFBpZ21lbnRzQVBJLFxuICBEaXNwb3NhYmxlLFxuICB1cmwsIHVyaXNcbl0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQ29sb3JQcm9qZWN0ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdCdcblxuICAgIEBwcm9qZWN0ID0gaWYgc3RhdGUucHJvamVjdD9cbiAgICAgIENvbG9yUHJvamVjdC5kZXNlcmlhbGl6ZShzdGF0ZS5wcm9qZWN0KVxuICAgIGVsc2VcbiAgICAgIG5ldyBDb2xvclByb2plY3QoKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdwaWdtZW50czpmaW5kLWNvbG9ycyc6ID0+IEBmaW5kQ29sb3JzKClcbiAgICAgICdwaWdtZW50czpzaG93LXBhbGV0dGUnOiA9PiBAc2hvd1BhbGV0dGUoKVxuICAgICAgJ3BpZ21lbnRzOnByb2plY3Qtc2V0dGluZ3MnOiA9PiBAc2hvd1NldHRpbmdzKClcbiAgICAgICdwaWdtZW50czpyZWxvYWQnOiA9PiBAcmVsb2FkUHJvamVjdFZhcmlhYmxlcygpXG4gICAgICAncGlnbWVudHM6cmVwb3J0JzogPT4gQGNyZWF0ZVBpZ21lbnRzUmVwb3J0KClcblxuICAgIGNvbnZlcnRNZXRob2QgPSAoYWN0aW9uKSA9PiAoZXZlbnQpID0+XG4gICAgICBpZiBAbGFzdEV2ZW50P1xuICAgICAgICBhY3Rpb24gQGNvbG9yTWFya2VyRm9yTW91c2VFdmVudChAbGFzdEV2ZW50KVxuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgY29sb3JCdWZmZXIgPSBAcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG5cbiAgICAgICAgZWRpdG9yLmdldEN1cnNvcnMoKS5mb3JFYWNoIChjdXJzb3IpID0+XG4gICAgICAgICAgbWFya2VyID0gY29sb3JCdWZmZXIuZ2V0Q29sb3JNYXJrZXJBdEJ1ZmZlclBvc2l0aW9uKGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgICAgIGFjdGlvbihtYXJrZXIpXG5cbiAgICAgIEBsYXN0RXZlbnQgPSBudWxsXG5cbiAgICBjb3B5TWV0aG9kID0gKGFjdGlvbikgPT4gKGV2ZW50KSA9PlxuICAgICAgaWYgQGxhc3RFdmVudD9cbiAgICAgICAgYWN0aW9uIEBjb2xvck1hcmtlckZvck1vdXNlRXZlbnQoQGxhc3RFdmVudClcbiAgICAgIGVsc2VcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGNvbG9yQnVmZmVyID0gQHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgICAgIG1hcmtlciA9IGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VyQXRCdWZmZXJQb3NpdGlvbihjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgICAgYWN0aW9uKG1hcmtlcilcblxuICAgICAgQGxhc3RFdmVudCA9IG51bGxcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgICdwaWdtZW50czpjb252ZXJ0LXRvLWhleCc6IGNvbnZlcnRNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvbnZlcnRDb250ZW50VG9IZXgoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb252ZXJ0LXRvLXJnYic6IGNvbnZlcnRNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvbnZlcnRDb250ZW50VG9SR0IoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb252ZXJ0LXRvLXJnYmEnOiBjb252ZXJ0TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb252ZXJ0Q29udGVudFRvUkdCQSgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvbnZlcnQtdG8taHNsJzogY29udmVydE1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29udmVydENvbnRlbnRUb0hTTCgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvbnZlcnQtdG8taHNsYSc6IGNvbnZlcnRNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvbnZlcnRDb250ZW50VG9IU0xBKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29weS1hcy1oZXgnOiBjb3B5TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb3B5Q29udGVudEFzSGV4KCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29weS1hcy1yZ2InOiBjb3B5TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb3B5Q29udGVudEFzUkdCKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29weS1hcy1yZ2JhJzogY29weU1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29weUNvbnRlbnRBc1JHQkEoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb3B5LWFzLWhzbCc6IGNvcHlNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvcHlDb250ZW50QXNIU0woKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb3B5LWFzLWhzbGEnOiBjb3B5TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb3B5Q29udGVudEFzSFNMQSgpIGlmIG1hcmtlcj9cblxuICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpVG9PcGVuKSA9PlxuICAgICAgdXJsIHx8PSByZXF1aXJlICd1cmwnXG5cbiAgICAgIHtwcm90b2NvbCwgaG9zdH0gPSB1cmwucGFyc2UgdXJpVG9PcGVuXG4gICAgICByZXR1cm4gdW5sZXNzIHByb3RvY29sIGlzICdwaWdtZW50czonXG5cbiAgICAgIHN3aXRjaCBob3N0XG4gICAgICAgIHdoZW4gJ3NlYXJjaCcgdGhlbiBAcHJvamVjdC5maW5kQWxsQ29sb3JzKClcbiAgICAgICAgd2hlbiAncGFsZXR0ZScgdGhlbiBAcHJvamVjdC5nZXRQYWxldHRlKClcbiAgICAgICAgd2hlbiAnc2V0dGluZ3MnIHRoZW4gYXRvbS52aWV3cy5nZXRWaWV3KEBwcm9qZWN0KVxuXG4gICAgYXRvbS5jb250ZXh0TWVudS5hZGRcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJzogW3tcbiAgICAgICAgbGFiZWw6ICdQaWdtZW50cydcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtsYWJlbDogJ0NvbnZlcnQgdG8gaGV4YWRlY2ltYWwnLCBjb21tYW5kOiAncGlnbWVudHM6Y29udmVydC10by1oZXgnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvbnZlcnQgdG8gUkdCJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvbnZlcnQtdG8tcmdiJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb252ZXJ0IHRvIFJHQkEnLCBjb21tYW5kOiAncGlnbWVudHM6Y29udmVydC10by1yZ2JhJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb252ZXJ0IHRvIEhTTCcsIGNvbW1hbmQ6ICdwaWdtZW50czpjb252ZXJ0LXRvLWhzbCd9XG4gICAgICAgICAge2xhYmVsOiAnQ29udmVydCB0byBIU0xBJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvbnZlcnQtdG8taHNsYSd9XG4gICAgICAgICAge3R5cGU6ICdzZXBhcmF0b3InfVxuICAgICAgICAgIHtsYWJlbDogJ0NvcHkgYXMgaGV4YWRlY2ltYWwnLCBjb21tYW5kOiAncGlnbWVudHM6Y29weS1hcy1oZXgnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvcHkgYXMgUkdCJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvcHktYXMtcmdiJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb3B5IGFzIFJHQkEnLCBjb21tYW5kOiAncGlnbWVudHM6Y29weS1hcy1yZ2JhJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb3B5IGFzIEhTTCcsIGNvbW1hbmQ6ICdwaWdtZW50czpjb3B5LWFzLWhzbCd9XG4gICAgICAgICAge2xhYmVsOiAnQ29weSBhcyBIU0xBJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvcHktYXMtaHNsYSd9XG4gICAgICAgIF1cbiAgICAgICAgc2hvdWxkRGlzcGxheTogKGV2ZW50KSA9PiBAc2hvdWxkRGlzcGxheUNvbnRleHRNZW51KGV2ZW50KVxuICAgICAgfV1cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBnZXRQcm9qZWN0KCk/LmRlc3Ryb3k/KClcblxuICBwcm92aWRlQXV0b2NvbXBsZXRlOiAtPlxuICAgIFBpZ21lbnRzUHJvdmlkZXIgPz0gcmVxdWlyZSAnLi9waWdtZW50cy1wcm92aWRlcidcbiAgICBuZXcgUGlnbWVudHNQcm92aWRlcih0aGlzKVxuXG4gIHByb3ZpZGVBUEk6IC0+XG4gICAgUGlnbWVudHNBUEkgPz0gcmVxdWlyZSAnLi9waWdtZW50cy1hcGknXG4gICAgbmV3IFBpZ21lbnRzQVBJKEBnZXRQcm9qZWN0KCkpXG5cbiAgY29uc3VtZUNvbG9yUGlja2VyOiAoYXBpKSAtPlxuICAgIERpc3Bvc2FibGUgPz0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGVcblxuICAgIEBnZXRQcm9qZWN0KCkuc2V0Q29sb3JQaWNrZXJBUEkoYXBpKVxuXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIEBnZXRQcm9qZWN0KCkuc2V0Q29sb3JQaWNrZXJBUEkobnVsbClcblxuICBjb25zdW1lQ29sb3JFeHByZXNzaW9uczogKG9wdGlvbnM9e30pIC0+XG4gICAgRGlzcG9zYWJsZSA/PSByZXF1aXJlKCdhdG9tJykuRGlzcG9zYWJsZVxuXG4gICAgcmVnaXN0cnkgPSBAZ2V0UHJvamVjdCgpLmdldENvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeSgpXG5cbiAgICBpZiBvcHRpb25zLmV4cHJlc3Npb25zP1xuICAgICAgbmFtZXMgPSBvcHRpb25zLmV4cHJlc3Npb25zLm1hcCAoZSkgLT4gZS5uYW1lXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9ucyhvcHRpb25zLmV4cHJlc3Npb25zKVxuXG4gICAgICBuZXcgRGlzcG9zYWJsZSAtPiByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKG5hbWUpIGZvciBuYW1lIGluIG5hbWVzXG4gICAgZWxzZVxuICAgICAge25hbWUsIHJlZ2V4cFN0cmluZywgaGFuZGxlLCBzY29wZXMsIHByaW9yaXR5fSA9IG9wdGlvbnNcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24obmFtZSwgcmVnZXhwU3RyaW5nLCBwcmlvcml0eSwgc2NvcGVzLCBoYW5kbGUpXG5cbiAgICAgIG5ldyBEaXNwb3NhYmxlIC0+IHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24obmFtZSlcblxuICBjb25zdW1lVmFyaWFibGVFeHByZXNzaW9uczogKG9wdGlvbnM9e30pIC0+XG4gICAgRGlzcG9zYWJsZSA/PSByZXF1aXJlKCdhdG9tJykuRGlzcG9zYWJsZVxuXG4gICAgcmVnaXN0cnkgPSBAZ2V0UHJvamVjdCgpLmdldFZhcmlhYmxlRXhwcmVzc2lvbnNSZWdpc3RyeSgpXG5cbiAgICBpZiBvcHRpb25zLmV4cHJlc3Npb25zP1xuICAgICAgbmFtZXMgPSBvcHRpb25zLmV4cHJlc3Npb25zLm1hcCAoZSkgLT4gZS5uYW1lXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9ucyhvcHRpb25zLmV4cHJlc3Npb25zKVxuXG4gICAgICBuZXcgRGlzcG9zYWJsZSAtPiByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKG5hbWUpIGZvciBuYW1lIGluIG5hbWVzXG4gICAgZWxzZVxuICAgICAge25hbWUsIHJlZ2V4cFN0cmluZywgaGFuZGxlLCBzY29wZXMsIHByaW9yaXR5fSA9IG9wdGlvbnNcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24obmFtZSwgcmVnZXhwU3RyaW5nLCBwcmlvcml0eSwgc2NvcGVzLCBoYW5kbGUpXG5cbiAgICAgIG5ldyBEaXNwb3NhYmxlIC0+IHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24obmFtZSlcblxuICBkZXNlcmlhbGl6ZVBhbGV0dGU6IChzdGF0ZSkgLT5cbiAgICBQYWxldHRlID89IHJlcXVpcmUgJy4vcGFsZXR0ZSdcbiAgICBQYWxldHRlLmRlc2VyaWFsaXplKHN0YXRlKVxuXG4gIGRlc2VyaWFsaXplQ29sb3JTZWFyY2g6IChzdGF0ZSkgLT5cbiAgICBDb2xvclNlYXJjaCA/PSByZXF1aXJlICcuL2NvbG9yLXNlYXJjaCdcbiAgICBDb2xvclNlYXJjaC5kZXNlcmlhbGl6ZShzdGF0ZSlcblxuICBkZXNlcmlhbGl6ZUNvbG9yUHJvamVjdDogKHN0YXRlKSAtPlxuICAgIENvbG9yUHJvamVjdCA/PSByZXF1aXJlICcuL2NvbG9yLXByb2plY3QnXG4gICAgQ29sb3JQcm9qZWN0LmRlc2VyaWFsaXplKHN0YXRlKVxuXG4gIGRlc2VyaWFsaXplQ29sb3JQcm9qZWN0RWxlbWVudDogKHN0YXRlKSAtPlxuICAgIENvbG9yUHJvamVjdEVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1wcm9qZWN0LWVsZW1lbnQnXG4gICAgZWxlbWVudCA9IG5ldyBDb2xvclByb2plY3RFbGVtZW50XG5cbiAgICBpZiBAcHJvamVjdD9cbiAgICAgIGVsZW1lbnQuc2V0TW9kZWwoQGdldFByb2plY3QoKSlcbiAgICBlbHNlXG4gICAgICBzdWJzY3JpcHRpb24gPSBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlIChwa2cpID0+XG4gICAgICAgIGlmIHBrZy5uYW1lIGlzICdwaWdtZW50cydcbiAgICAgICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgICAgZWxlbWVudC5zZXRNb2RlbChAZ2V0UHJvamVjdCgpKVxuXG4gICAgZWxlbWVudFxuXG4gIGRlc2VyaWFsaXplVmFyaWFibGVzQ29sbGVjdGlvbjogKHN0YXRlKSAtPlxuICAgIFZhcmlhYmxlc0NvbGxlY3Rpb24gPz0gcmVxdWlyZSAnLi92YXJpYWJsZXMtY29sbGVjdGlvbidcbiAgICBWYXJpYWJsZXNDb2xsZWN0aW9uLmRlc2VyaWFsaXplKHN0YXRlKVxuXG4gIHBpZ21lbnRzVmlld1Byb3ZpZGVyOiAobW9kZWwpIC0+XG4gICAgZWxlbWVudCA9IGlmIG1vZGVsIGluc3RhbmNlb2YgKENvbG9yQnVmZmVyID89IHJlcXVpcmUgJy4vY29sb3ItYnVmZmVyJylcbiAgICAgIENvbG9yQnVmZmVyRWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLWJ1ZmZlci1lbGVtZW50J1xuICAgICAgZWxlbWVudCA9IG5ldyBDb2xvckJ1ZmZlckVsZW1lbnRcbiAgICBlbHNlIGlmIG1vZGVsIGluc3RhbmNlb2YgKENvbG9yU2VhcmNoID89IHJlcXVpcmUgJy4vY29sb3Itc2VhcmNoJylcbiAgICAgIENvbG9yUmVzdWx0c0VsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1yZXN1bHRzLWVsZW1lbnQnXG4gICAgICBlbGVtZW50ID0gbmV3IENvbG9yUmVzdWx0c0VsZW1lbnRcbiAgICBlbHNlIGlmIG1vZGVsIGluc3RhbmNlb2YgKENvbG9yUHJvamVjdCA/PSByZXF1aXJlICcuL2NvbG9yLXByb2plY3QnKVxuICAgICAgQ29sb3JQcm9qZWN0RWxlbWVudCA/PSByZXF1aXJlICcuL2NvbG9yLXByb2plY3QtZWxlbWVudCdcbiAgICAgIGVsZW1lbnQgPSBuZXcgQ29sb3JQcm9qZWN0RWxlbWVudFxuICAgIGVsc2UgaWYgbW9kZWwgaW5zdGFuY2VvZiAoUGFsZXR0ZSA/PSByZXF1aXJlICcuL3BhbGV0dGUnKVxuICAgICAgUGFsZXR0ZUVsZW1lbnQgPz0gcmVxdWlyZSAnLi9wYWxldHRlLWVsZW1lbnQnXG4gICAgICBlbGVtZW50ID0gbmV3IFBhbGV0dGVFbGVtZW50XG5cbiAgICBlbGVtZW50LnNldE1vZGVsKG1vZGVsKSBpZiBlbGVtZW50P1xuICAgIGVsZW1lbnRcblxuICBzaG91bGREaXNwbGF5Q29udGV4dE1lbnU6IChldmVudCkgLT5cbiAgICBAbGFzdEV2ZW50ID0gZXZlbnRcbiAgICBzZXRUaW1lb3V0ICg9PiBAbGFzdEV2ZW50ID0gbnVsbCksIDEwXG4gICAgQGNvbG9yTWFya2VyRm9yTW91c2VFdmVudChldmVudCk/XG5cbiAgY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY29sb3JCdWZmZXIgPSBAcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuICAgIGNvbG9yQnVmZmVyRWxlbWVudD8uY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50KGV2ZW50KVxuXG4gIHNlcmlhbGl6ZTogLT4ge3Byb2plY3Q6IEBwcm9qZWN0LnNlcmlhbGl6ZSgpfVxuXG4gIGdldFByb2plY3Q6IC0+IEBwcm9qZWN0XG5cbiAgZmluZENvbG9yczogLT5cbiAgICB1cmlzID89IHJlcXVpcmUgJy4vdXJpcydcblxuICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKHVyaXMuU0VBUkNIKVxuICAgIHBhbmUgfHw9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlblVSSUluUGFuZSh1cmlzLlNFQVJDSCwgcGFuZSwge30pXG5cbiAgc2hvd1BhbGV0dGU6IC0+XG4gICAgdXJpcyA/PSByZXF1aXJlICcuL3VyaXMnXG5cbiAgICBAcHJvamVjdC5pbml0aWFsaXplKCkudGhlbiAtPlxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpcy5QQUxFVFRFKVxuICAgICAgcGFuZSB8fD0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW5VUklJblBhbmUodXJpcy5QQUxFVFRFLCBwYW5lLCB7fSlcbiAgICAuY2F0Y2ggKHJlYXNvbikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IgcmVhc29uXG5cbiAgc2hvd1NldHRpbmdzOiAtPlxuICAgIHVyaXMgPz0gcmVxdWlyZSAnLi91cmlzJ1xuXG4gICAgQHByb2plY3QuaW5pdGlhbGl6ZSgpLnRoZW4gLT5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKHVyaXMuU0VUVElOR1MpXG4gICAgICBwYW5lIHx8PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlblVSSUluUGFuZSh1cmlzLlNFVFRJTkdTLCBwYW5lLCB7fSlcbiAgICAuY2F0Y2ggKHJlYXNvbikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IgcmVhc29uXG5cbiAgcmVsb2FkUHJvamVjdFZhcmlhYmxlczogLT4gQHByb2plY3QucmVsb2FkKClcblxuICBjcmVhdGVQaWdtZW50c1JlcG9ydDogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdwaWdtZW50cy1yZXBvcnQuanNvbicpLnRoZW4gKGVkaXRvcikgPT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KEBjcmVhdGVSZXBvcnQoKSlcblxuICBjcmVhdGVSZXBvcnQ6IC0+XG4gICAgbyA9XG4gICAgICBhdG9tOiBhdG9tLmdldFZlcnNpb24oKVxuICAgICAgcGlnbWVudHM6IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZSgncGlnbWVudHMnKS5tZXRhZGF0YS52ZXJzaW9uXG4gICAgICBwbGF0Zm9ybTogcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gICAgICBjb25maWc6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMnKVxuICAgICAgcHJvamVjdDpcbiAgICAgICAgY29uZmlnOlxuICAgICAgICAgIHNvdXJjZU5hbWVzOiBAcHJvamVjdC5zb3VyY2VOYW1lc1xuICAgICAgICAgIHNlYXJjaE5hbWVzOiBAcHJvamVjdC5zZWFyY2hOYW1lc1xuICAgICAgICAgIGlnbm9yZWROYW1lczogQHByb2plY3QuaWdub3JlZE5hbWVzXG4gICAgICAgICAgaWdub3JlZFNjb3BlczogQHByb2plY3QuaWdub3JlZFNjb3Blc1xuICAgICAgICAgIGluY2x1ZGVUaGVtZXM6IEBwcm9qZWN0LmluY2x1ZGVUaGVtZXNcbiAgICAgICAgICBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lczogQHByb2plY3QuaWdub3JlR2xvYmFsU291cmNlTmFtZXNcbiAgICAgICAgICBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lczogQHByb2plY3QuaWdub3JlR2xvYmFsU2VhcmNoTmFtZXNcbiAgICAgICAgICBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXM6IEBwcm9qZWN0Lmlnbm9yZUdsb2JhbElnbm9yZWROYW1lc1xuICAgICAgICAgIGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXM6IEBwcm9qZWN0Lmlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXNcbiAgICAgICAgcGF0aHM6IEBwcm9qZWN0LmdldFBhdGhzKClcbiAgICAgICAgdmFyaWFibGVzOlxuICAgICAgICAgIGNvbG9yczogQHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGhcbiAgICAgICAgICB0b3RhbDogQHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoXG5cbiAgICBKU09OLnN0cmluZ2lmeShvLCBudWxsLCAyKVxuICAgIC5yZXBsYWNlKC8vLyN7YXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuam9pbignfCcpfS8vL2csICc8cm9vdD4nKVxuIl19

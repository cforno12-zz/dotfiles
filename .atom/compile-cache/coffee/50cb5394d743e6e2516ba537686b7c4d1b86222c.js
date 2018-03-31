(function() {
  var ColorBuffer, ColorBufferElement, ColorMarker, ColorMarkerElement, ColorProject, ColorProjectElement, ColorResultsElement, ColorSearch, Disposable, Palette, PaletteElement, PigmentsAPI, PigmentsProvider, VariablesCollection, ref, uris, url;

  ref = [], Palette = ref[0], PaletteElement = ref[1], ColorSearch = ref[2], ColorResultsElement = ref[3], ColorProject = ref[4], ColorProjectElement = ref[5], ColorBuffer = ref[6], ColorBufferElement = ref[7], ColorMarker = ref[8], ColorMarkerElement = ref[9], VariablesCollection = ref[10], PigmentsProvider = ref[11], PigmentsAPI = ref[12], Disposable = ref[13], url = ref[14], uris = ref[15];

  module.exports = {
    activate: function(state) {
      var convertMethod, copyMethod;
      if (ColorProject == null) {
        ColorProject = require('./color-project');
      }
      this.patchAtom();
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
          var j, len, name, results;
          results = [];
          for (j = 0, len = names.length; j < len; j++) {
            name = names[j];
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
          var j, len, name, results;
          results = [];
          for (j = 0, len = names.length; j < len; j++) {
            name = names[j];
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
      element = model instanceof (ColorBuffer != null ? ColorBuffer : ColorBuffer = require('./color-buffer')) ? (ColorBufferElement != null ? ColorBufferElement : ColorBufferElement = require('./color-buffer-element'), element = new ColorBufferElement) : model instanceof (ColorMarker != null ? ColorMarker : ColorMarker = require('./color-marker')) ? (ColorMarkerElement != null ? ColorMarkerElement : ColorMarkerElement = require('./color-marker-element'), element = new ColorMarkerElement) : model instanceof (ColorSearch != null ? ColorSearch : ColorSearch = require('./color-search')) ? (ColorResultsElement != null ? ColorResultsElement : ColorResultsElement = require('./color-results-element'), element = new ColorResultsElement) : model instanceof (ColorProject != null ? ColorProject : ColorProject = require('./color-project')) ? (ColorProjectElement != null ? ColorProjectElement : ColorProjectElement = require('./color-project-element'), element = new ColorProjectElement) : model instanceof (Palette != null ? Palette : Palette = require('./palette')) ? (PaletteElement != null ? PaletteElement : PaletteElement = require('./palette-element'), element = new PaletteElement) : void 0;
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
    },
    patchAtom: function() {
      var HighlightComponent, TextEditorPresenter, _buildHighlightRegions, _updateHighlightRegions, getModuleFromNodeCache, getModuleFromSnapshotCache, requireCore;
      getModuleFromNodeCache = function(name) {
        var modulePath;
        modulePath = Object.keys(require.cache).filter(function(s) {
          return s.indexOf(name) > -1;
        })[0];
        return require.cache[modulePath];
      };
      getModuleFromSnapshotCache = function(name) {
        var modulePath;
        if (typeof snapshotResult === 'undefined') {
          return null;
        } else {
          modulePath = Object.keys(snapshotResult.customRequire.cache).filter(function(s) {
            return s.indexOf(name) > -1;
          })[0];
          return snapshotResult.customRequire.cache[modulePath];
        }
      };
      requireCore = function(name) {
        var module, ref1;
        module = (ref1 = getModuleFromNodeCache(name)) != null ? ref1 : getModuleFromSnapshotCache(name);
        if (module != null) {
          return module.exports;
        } else {
          throw new Error("Cannot find '" + name + "' in the require cache.");
        }
      };
      HighlightComponent = requireCore('highlights-component');
      TextEditorPresenter = requireCore('text-editor-presenter');
      if (TextEditorPresenter.getTextInScreenRange == null) {
        TextEditorPresenter.prototype.getTextInScreenRange = function(screenRange) {
          if (this.displayLayer != null) {
            return this.model.getTextInRange(this.displayLayer.translateScreenRange(screenRange));
          } else {
            return this.model.getTextInRange(this.model.bufferRangeForScreenRange(screenRange));
          }
        };
        _buildHighlightRegions = TextEditorPresenter.prototype.buildHighlightRegions;
        TextEditorPresenter.prototype.buildHighlightRegions = function(screenRange) {
          var regions;
          regions = _buildHighlightRegions.call(this, screenRange);
          if (regions.length === 1) {
            regions[0].text = this.getTextInScreenRange(screenRange);
          } else {
            regions[0].text = this.getTextInScreenRange([screenRange.start, [screenRange.start.row, 2e308]]);
            regions[regions.length - 1].text = this.getTextInScreenRange([[screenRange.end.row, 0], screenRange.end]);
            if (regions.length > 2) {
              regions[1].text = this.getTextInScreenRange([[screenRange.start.row + 1, 0], [screenRange.end.row - 1, 2e308]]);
            }
          }
          return regions;
        };
        _updateHighlightRegions = HighlightComponent.prototype.updateHighlightRegions;
        return HighlightComponent.prototype.updateHighlightRegions = function(id, newHighlightState) {
          var i, j, len, newRegionState, ref1, ref2, regionNode, results;
          _updateHighlightRegions.call(this, id, newHighlightState);
          if ((ref1 = newHighlightState["class"]) != null ? ref1.match(/^pigments-native-background\s/) : void 0) {
            ref2 = newHighlightState.regions;
            results = [];
            for (i = j = 0, len = ref2.length; j < len; i = ++j) {
              newRegionState = ref2[i];
              regionNode = this.regionNodesByHighlightId[id][i];
              if (newRegionState.text != null) {
                results.push(regionNode.textContent = newRegionState.text);
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGlnbWVudHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQVNJLEVBVEosRUFDRSxnQkFERixFQUNXLHVCQURYLEVBRUUsb0JBRkYsRUFFZSw0QkFGZixFQUdFLHFCQUhGLEVBR2dCLDRCQUhoQixFQUlFLG9CQUpGLEVBSWUsMkJBSmYsRUFLRSxvQkFMRixFQUtlLDJCQUxmLEVBTUUsNkJBTkYsRUFNdUIsMEJBTnZCLEVBTXlDLHFCQU56QyxFQU9FLG9CQVBGLEVBUUUsYUFSRixFQVFPOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTs7UUFBQSxlQUFnQixPQUFBLENBQVEsaUJBQVI7O01BRWhCLElBQUMsQ0FBQSxTQUFELENBQUE7TUFFQSxJQUFDLENBQUEsT0FBRCxHQUFjLHFCQUFILEdBQ1QsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsS0FBSyxDQUFDLE9BQS9CLENBRFMsR0FHTCxJQUFBLFlBQUEsQ0FBQTtNQUVOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtRQUFBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtRQUNBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR6QjtRQUVBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQTtVQUFIO1FB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QUFzQixDQUF0QixDQUR1RCxFQUV2RCxXQUFXLENBQUMsR0FGMkMsQ0FBdEI7WUFLbkMsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQjtjQUNFLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFYLEdBQWtCLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixDQUN0QyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBbEIsR0FBd0IsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FEc0MsRUFFdEMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQWhCLEdBQXNCLENBQXZCLEVBQTBCLEtBQTFCLENBRnNDLENBQXRCLEVBRHBCO2FBWkY7O2lCQWtCQTtRQXJCMkM7UUF1QjdDLHVCQUFBLEdBQTBCLGtCQUFrQixDQUFBLFNBQUUsQ0FBQTtlQUM5QyxrQkFBa0IsQ0FBQSxTQUFFLENBQUEsc0JBQXBCLEdBQTZDLFNBQUMsRUFBRCxFQUFLLGlCQUFMO0FBQzNDLGNBQUE7VUFBQSx1QkFBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QixFQUFtQyxFQUFuQyxFQUF1QyxpQkFBdkM7VUFFQSxzREFBMEIsQ0FBRSxLQUF6QixDQUErQiwrQkFBL0IsVUFBSDtBQUNFO0FBQUE7aUJBQUEsOENBQUE7O2NBQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSx3QkFBeUIsQ0FBQSxFQUFBLENBQUksQ0FBQSxDQUFBO2NBRTNDLElBQWdELDJCQUFoRDs2QkFBQSxVQUFVLENBQUMsV0FBWCxHQUF5QixjQUFjLENBQUMsTUFBeEM7ZUFBQSxNQUFBO3FDQUFBOztBQUhGOzJCQURGOztRQUgyQyxFQWhDL0M7O0lBdEJTLENBeFJYOztBQVpGIiwic291cmNlc0NvbnRlbnQiOlsiW1xuICBQYWxldHRlLCBQYWxldHRlRWxlbWVudCxcbiAgQ29sb3JTZWFyY2gsIENvbG9yUmVzdWx0c0VsZW1lbnQsXG4gIENvbG9yUHJvamVjdCwgQ29sb3JQcm9qZWN0RWxlbWVudCxcbiAgQ29sb3JCdWZmZXIsIENvbG9yQnVmZmVyRWxlbWVudCxcbiAgQ29sb3JNYXJrZXIsIENvbG9yTWFya2VyRWxlbWVudCxcbiAgVmFyaWFibGVzQ29sbGVjdGlvbiwgUGlnbWVudHNQcm92aWRlciwgUGlnbWVudHNBUEksXG4gIERpc3Bvc2FibGUsXG4gIHVybCwgdXJpc1xuXSA9IFtdXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBDb2xvclByb2plY3QgPz0gcmVxdWlyZSAnLi9jb2xvci1wcm9qZWN0J1xuXG4gICAgQHBhdGNoQXRvbSgpXG5cbiAgICBAcHJvamVjdCA9IGlmIHN0YXRlLnByb2plY3Q/XG4gICAgICBDb2xvclByb2plY3QuZGVzZXJpYWxpemUoc3RhdGUucHJvamVjdClcbiAgICBlbHNlXG4gICAgICBuZXcgQ29sb3JQcm9qZWN0KClcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAncGlnbWVudHM6ZmluZC1jb2xvcnMnOiA9PiBAZmluZENvbG9ycygpXG4gICAgICAncGlnbWVudHM6c2hvdy1wYWxldHRlJzogPT4gQHNob3dQYWxldHRlKClcbiAgICAgICdwaWdtZW50czpwcm9qZWN0LXNldHRpbmdzJzogPT4gQHNob3dTZXR0aW5ncygpXG4gICAgICAncGlnbWVudHM6cmVsb2FkJzogPT4gQHJlbG9hZFByb2plY3RWYXJpYWJsZXMoKVxuICAgICAgJ3BpZ21lbnRzOnJlcG9ydCc6ID0+IEBjcmVhdGVQaWdtZW50c1JlcG9ydCgpXG5cbiAgICBjb252ZXJ0TWV0aG9kID0gKGFjdGlvbikgPT4gKGV2ZW50KSA9PlxuICAgICAgaWYgQGxhc3RFdmVudD9cbiAgICAgICAgYWN0aW9uIEBjb2xvck1hcmtlckZvck1vdXNlRXZlbnQoQGxhc3RFdmVudClcbiAgICAgIGVsc2VcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGNvbG9yQnVmZmVyID0gQHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICAgIGVkaXRvci5nZXRDdXJzb3JzKCkuZm9yRWFjaCAoY3Vyc29yKSA9PlxuICAgICAgICAgIG1hcmtlciA9IGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VyQXRCdWZmZXJQb3NpdGlvbihjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgICAgICBhY3Rpb24obWFya2VyKVxuXG4gICAgICBAbGFzdEV2ZW50ID0gbnVsbFxuXG4gICAgY29weU1ldGhvZCA9IChhY3Rpb24pID0+IChldmVudCkgPT5cbiAgICAgIGlmIEBsYXN0RXZlbnQ/XG4gICAgICAgIGFjdGlvbiBAY29sb3JNYXJrZXJGb3JNb3VzZUV2ZW50KEBsYXN0RXZlbnQpXG4gICAgICBlbHNlXG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBjb2xvckJ1ZmZlciA9IEBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcbiAgICAgICAgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgICAgICBtYXJrZXIgPSBjb2xvckJ1ZmZlci5nZXRDb2xvck1hcmtlckF0QnVmZmVyUG9zaXRpb24oY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgICAgIGFjdGlvbihtYXJrZXIpXG5cbiAgICAgIEBsYXN0RXZlbnQgPSBudWxsXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAncGlnbWVudHM6Y29udmVydC10by1oZXgnOiBjb252ZXJ0TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb252ZXJ0Q29udGVudFRvSGV4KCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29udmVydC10by1yZ2InOiBjb252ZXJ0TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb252ZXJ0Q29udGVudFRvUkdCKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29udmVydC10by1yZ2JhJzogY29udmVydE1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29udmVydENvbnRlbnRUb1JHQkEoKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb252ZXJ0LXRvLWhzbCc6IGNvbnZlcnRNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvbnZlcnRDb250ZW50VG9IU0woKSBpZiBtYXJrZXI/XG5cbiAgICAgICdwaWdtZW50czpjb252ZXJ0LXRvLWhzbGEnOiBjb252ZXJ0TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb252ZXJ0Q29udGVudFRvSFNMQSgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvcHktYXMtaGV4JzogY29weU1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29weUNvbnRlbnRBc0hleCgpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvcHktYXMtcmdiJzogY29weU1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29weUNvbnRlbnRBc1JHQigpIGlmIG1hcmtlcj9cblxuICAgICAgJ3BpZ21lbnRzOmNvcHktYXMtcmdiYSc6IGNvcHlNZXRob2QgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLmNvcHlDb250ZW50QXNSR0JBKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29weS1hcy1oc2wnOiBjb3B5TWV0aG9kIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jb3B5Q29udGVudEFzSFNMKCkgaWYgbWFya2VyP1xuXG4gICAgICAncGlnbWVudHM6Y29weS1hcy1oc2xhJzogY29weU1ldGhvZCAobWFya2VyKSAtPlxuICAgICAgICBtYXJrZXIuY29weUNvbnRlbnRBc0hTTEEoKSBpZiBtYXJrZXI/XG5cbiAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaVRvT3BlbikgPT5cbiAgICAgIHVybCB8fD0gcmVxdWlyZSAndXJsJ1xuXG4gICAgICB7cHJvdG9jb2wsIGhvc3R9ID0gdXJsLnBhcnNlIHVyaVRvT3BlblxuICAgICAgcmV0dXJuIHVubGVzcyBwcm90b2NvbCBpcyAncGlnbWVudHM6J1xuXG4gICAgICBzd2l0Y2ggaG9zdFxuICAgICAgICB3aGVuICdzZWFyY2gnIHRoZW4gQHByb2plY3QuZmluZEFsbENvbG9ycygpXG4gICAgICAgIHdoZW4gJ3BhbGV0dGUnIHRoZW4gQHByb2plY3QuZ2V0UGFsZXR0ZSgpXG4gICAgICAgIHdoZW4gJ3NldHRpbmdzJyB0aGVuIGF0b20udmlld3MuZ2V0VmlldyhAcHJvamVjdClcblxuICAgIGF0b20uY29udGV4dE1lbnUuYWRkXG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFt7XG4gICAgICAgIGxhYmVsOiAnUGlnbWVudHMnXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7bGFiZWw6ICdDb252ZXJ0IHRvIGhleGFkZWNpbWFsJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvbnZlcnQtdG8taGV4J31cbiAgICAgICAgICB7bGFiZWw6ICdDb252ZXJ0IHRvIFJHQicsIGNvbW1hbmQ6ICdwaWdtZW50czpjb252ZXJ0LXRvLXJnYid9XG4gICAgICAgICAge2xhYmVsOiAnQ29udmVydCB0byBSR0JBJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvbnZlcnQtdG8tcmdiYSd9XG4gICAgICAgICAge2xhYmVsOiAnQ29udmVydCB0byBIU0wnLCBjb21tYW5kOiAncGlnbWVudHM6Y29udmVydC10by1oc2wnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvbnZlcnQgdG8gSFNMQScsIGNvbW1hbmQ6ICdwaWdtZW50czpjb252ZXJ0LXRvLWhzbGEnfVxuICAgICAgICAgIHt0eXBlOiAnc2VwYXJhdG9yJ31cbiAgICAgICAgICB7bGFiZWw6ICdDb3B5IGFzIGhleGFkZWNpbWFsJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvcHktYXMtaGV4J31cbiAgICAgICAgICB7bGFiZWw6ICdDb3B5IGFzIFJHQicsIGNvbW1hbmQ6ICdwaWdtZW50czpjb3B5LWFzLXJnYid9XG4gICAgICAgICAge2xhYmVsOiAnQ29weSBhcyBSR0JBJywgY29tbWFuZDogJ3BpZ21lbnRzOmNvcHktYXMtcmdiYSd9XG4gICAgICAgICAge2xhYmVsOiAnQ29weSBhcyBIU0wnLCBjb21tYW5kOiAncGlnbWVudHM6Y29weS1hcy1oc2wnfVxuICAgICAgICAgIHtsYWJlbDogJ0NvcHkgYXMgSFNMQScsIGNvbW1hbmQ6ICdwaWdtZW50czpjb3B5LWFzLWhzbGEnfVxuICAgICAgICBdXG4gICAgICAgIHNob3VsZERpc3BsYXk6IChldmVudCkgPT4gQHNob3VsZERpc3BsYXlDb250ZXh0TWVudShldmVudClcbiAgICAgIH1dXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZ2V0UHJvamVjdCgpPy5kZXN0cm95PygpXG5cbiAgcHJvdmlkZUF1dG9jb21wbGV0ZTogLT5cbiAgICBQaWdtZW50c1Byb3ZpZGVyID89IHJlcXVpcmUgJy4vcGlnbWVudHMtcHJvdmlkZXInXG4gICAgbmV3IFBpZ21lbnRzUHJvdmlkZXIodGhpcylcblxuICBwcm92aWRlQVBJOiAtPlxuICAgIFBpZ21lbnRzQVBJID89IHJlcXVpcmUgJy4vcGlnbWVudHMtYXBpJ1xuICAgIG5ldyBQaWdtZW50c0FQSShAZ2V0UHJvamVjdCgpKVxuXG4gIGNvbnN1bWVDb2xvclBpY2tlcjogKGFwaSkgLT5cbiAgICBEaXNwb3NhYmxlID89IHJlcXVpcmUoJ2F0b20nKS5EaXNwb3NhYmxlXG5cbiAgICBAZ2V0UHJvamVjdCgpLnNldENvbG9yUGlja2VyQVBJKGFwaSlcblxuICAgIG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBAZ2V0UHJvamVjdCgpLnNldENvbG9yUGlja2VyQVBJKG51bGwpXG5cbiAgY29uc3VtZUNvbG9yRXhwcmVzc2lvbnM6IChvcHRpb25zPXt9KSAtPlxuICAgIERpc3Bvc2FibGUgPz0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGVcblxuICAgIHJlZ2lzdHJ5ID0gQGdldFByb2plY3QoKS5nZXRDb2xvckV4cHJlc3Npb25zUmVnaXN0cnkoKVxuXG4gICAgaWYgb3B0aW9ucy5leHByZXNzaW9ucz9cbiAgICAgIG5hbWVzID0gb3B0aW9ucy5leHByZXNzaW9ucy5tYXAgKGUpIC0+IGUubmFtZVxuICAgICAgcmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbnMob3B0aW9ucy5leHByZXNzaW9ucylcblxuICAgICAgbmV3IERpc3Bvc2FibGUgLT4gcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbihuYW1lKSBmb3IgbmFtZSBpbiBuYW1lc1xuICAgIGVsc2VcbiAgICAgIHtuYW1lLCByZWdleHBTdHJpbmcsIGhhbmRsZSwgc2NvcGVzLCBwcmlvcml0eX0gPSBvcHRpb25zXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uKG5hbWUsIHJlZ2V4cFN0cmluZywgcHJpb3JpdHksIHNjb3BlcywgaGFuZGxlKVxuXG4gICAgICBuZXcgRGlzcG9zYWJsZSAtPiByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKG5hbWUpXG5cbiAgY29uc3VtZVZhcmlhYmxlRXhwcmVzc2lvbnM6IChvcHRpb25zPXt9KSAtPlxuICAgIERpc3Bvc2FibGUgPz0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGVcblxuICAgIHJlZ2lzdHJ5ID0gQGdldFByb2plY3QoKS5nZXRWYXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkoKVxuXG4gICAgaWYgb3B0aW9ucy5leHByZXNzaW9ucz9cbiAgICAgIG5hbWVzID0gb3B0aW9ucy5leHByZXNzaW9ucy5tYXAgKGUpIC0+IGUubmFtZVxuICAgICAgcmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbnMob3B0aW9ucy5leHByZXNzaW9ucylcblxuICAgICAgbmV3IERpc3Bvc2FibGUgLT4gcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbihuYW1lKSBmb3IgbmFtZSBpbiBuYW1lc1xuICAgIGVsc2VcbiAgICAgIHtuYW1lLCByZWdleHBTdHJpbmcsIGhhbmRsZSwgc2NvcGVzLCBwcmlvcml0eX0gPSBvcHRpb25zXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uKG5hbWUsIHJlZ2V4cFN0cmluZywgcHJpb3JpdHksIHNjb3BlcywgaGFuZGxlKVxuXG4gICAgICBuZXcgRGlzcG9zYWJsZSAtPiByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKG5hbWUpXG5cbiAgZGVzZXJpYWxpemVQYWxldHRlOiAoc3RhdGUpIC0+XG4gICAgUGFsZXR0ZSA/PSByZXF1aXJlICcuL3BhbGV0dGUnXG4gICAgUGFsZXR0ZS5kZXNlcmlhbGl6ZShzdGF0ZSlcblxuICBkZXNlcmlhbGl6ZUNvbG9yU2VhcmNoOiAoc3RhdGUpIC0+XG4gICAgQ29sb3JTZWFyY2ggPz0gcmVxdWlyZSAnLi9jb2xvci1zZWFyY2gnXG4gICAgQ29sb3JTZWFyY2guZGVzZXJpYWxpemUoc3RhdGUpXG5cbiAgZGVzZXJpYWxpemVDb2xvclByb2plY3Q6IChzdGF0ZSkgLT5cbiAgICBDb2xvclByb2plY3QgPz0gcmVxdWlyZSAnLi9jb2xvci1wcm9qZWN0J1xuICAgIENvbG9yUHJvamVjdC5kZXNlcmlhbGl6ZShzdGF0ZSlcblxuICBkZXNlcmlhbGl6ZUNvbG9yUHJvamVjdEVsZW1lbnQ6IChzdGF0ZSkgLT5cbiAgICBDb2xvclByb2plY3RFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItcHJvamVjdC1lbGVtZW50J1xuICAgIGVsZW1lbnQgPSBuZXcgQ29sb3JQcm9qZWN0RWxlbWVudFxuXG4gICAgaWYgQHByb2plY3Q/XG4gICAgICBlbGVtZW50LnNldE1vZGVsKEBnZXRQcm9qZWN0KCkpXG4gICAgZWxzZVxuICAgICAgc3Vic2NyaXB0aW9uID0gYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSAocGtnKSA9PlxuICAgICAgICBpZiBwa2cubmFtZSBpcyAncGlnbWVudHMnXG4gICAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICAgIGVsZW1lbnQuc2V0TW9kZWwoQGdldFByb2plY3QoKSlcblxuICAgIGVsZW1lbnRcblxuICBkZXNlcmlhbGl6ZVZhcmlhYmxlc0NvbGxlY3Rpb246IChzdGF0ZSkgLT5cbiAgICBWYXJpYWJsZXNDb2xsZWN0aW9uID89IHJlcXVpcmUgJy4vdmFyaWFibGVzLWNvbGxlY3Rpb24nXG4gICAgVmFyaWFibGVzQ29sbGVjdGlvbi5kZXNlcmlhbGl6ZShzdGF0ZSlcblxuICBwaWdtZW50c1ZpZXdQcm92aWRlcjogKG1vZGVsKSAtPlxuICAgIGVsZW1lbnQgPSBpZiBtb2RlbCBpbnN0YW5jZW9mIChDb2xvckJ1ZmZlciA/PSByZXF1aXJlICcuL2NvbG9yLWJ1ZmZlcicpXG4gICAgICBDb2xvckJ1ZmZlckVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1idWZmZXItZWxlbWVudCdcbiAgICAgIGVsZW1lbnQgPSBuZXcgQ29sb3JCdWZmZXJFbGVtZW50XG4gICAgZWxzZSBpZiBtb2RlbCBpbnN0YW5jZW9mIChDb2xvck1hcmtlciA/PSByZXF1aXJlICcuL2NvbG9yLW1hcmtlcicpXG4gICAgICBDb2xvck1hcmtlckVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXItZWxlbWVudCdcbiAgICAgIGVsZW1lbnQgPSBuZXcgQ29sb3JNYXJrZXJFbGVtZW50XG4gICAgZWxzZSBpZiBtb2RlbCBpbnN0YW5jZW9mIChDb2xvclNlYXJjaCA/PSByZXF1aXJlICcuL2NvbG9yLXNlYXJjaCcpXG4gICAgICBDb2xvclJlc3VsdHNFbGVtZW50ID89IHJlcXVpcmUgJy4vY29sb3ItcmVzdWx0cy1lbGVtZW50J1xuICAgICAgZWxlbWVudCA9IG5ldyBDb2xvclJlc3VsdHNFbGVtZW50XG4gICAgZWxzZSBpZiBtb2RlbCBpbnN0YW5jZW9mIChDb2xvclByb2plY3QgPz0gcmVxdWlyZSAnLi9jb2xvci1wcm9qZWN0JylcbiAgICAgIENvbG9yUHJvamVjdEVsZW1lbnQgPz0gcmVxdWlyZSAnLi9jb2xvci1wcm9qZWN0LWVsZW1lbnQnXG4gICAgICBlbGVtZW50ID0gbmV3IENvbG9yUHJvamVjdEVsZW1lbnRcbiAgICBlbHNlIGlmIG1vZGVsIGluc3RhbmNlb2YgKFBhbGV0dGUgPz0gcmVxdWlyZSAnLi9wYWxldHRlJylcbiAgICAgIFBhbGV0dGVFbGVtZW50ID89IHJlcXVpcmUgJy4vcGFsZXR0ZS1lbGVtZW50J1xuICAgICAgZWxlbWVudCA9IG5ldyBQYWxldHRlRWxlbWVudFxuXG4gICAgZWxlbWVudC5zZXRNb2RlbChtb2RlbCkgaWYgZWxlbWVudD9cbiAgICBlbGVtZW50XG5cbiAgc2hvdWxkRGlzcGxheUNvbnRleHRNZW51OiAoZXZlbnQpIC0+XG4gICAgQGxhc3RFdmVudCA9IGV2ZW50XG4gICAgc2V0VGltZW91dCAoPT4gQGxhc3RFdmVudCA9IG51bGwpLCAxMFxuICAgIEBjb2xvck1hcmtlckZvck1vdXNlRXZlbnQoZXZlbnQpP1xuXG4gIGNvbG9yTWFya2VyRm9yTW91c2VFdmVudDogKGV2ZW50KSAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbG9yQnVmZmVyID0gQHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgIGNvbG9yQnVmZmVyRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyhjb2xvckJ1ZmZlcilcbiAgICBjb2xvckJ1ZmZlckVsZW1lbnQ/LmNvbG9yTWFya2VyRm9yTW91c2VFdmVudChldmVudClcblxuICBzZXJpYWxpemU6IC0+IHtwcm9qZWN0OiBAcHJvamVjdC5zZXJpYWxpemUoKX1cblxuICBnZXRQcm9qZWN0OiAtPiBAcHJvamVjdFxuXG4gIGZpbmRDb2xvcnM6IC0+XG4gICAgdXJpcyA/PSByZXF1aXJlICcuL3VyaXMnXG5cbiAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmlzLlNFQVJDSClcbiAgICBwYW5lIHx8PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW5VUklJblBhbmUodXJpcy5TRUFSQ0gsIHBhbmUsIHt9KVxuXG4gIHNob3dQYWxldHRlOiAtPlxuICAgIHVyaXMgPz0gcmVxdWlyZSAnLi91cmlzJ1xuXG4gICAgQHByb2plY3QuaW5pdGlhbGl6ZSgpLnRoZW4gLT5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKHVyaXMuUEFMRVRURSlcbiAgICAgIHBhbmUgfHw9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuVVJJSW5QYW5lKHVyaXMuUEFMRVRURSwgcGFuZSwge30pXG4gICAgLmNhdGNoIChyZWFzb24pIC0+XG4gICAgICBjb25zb2xlLmVycm9yIHJlYXNvblxuXG4gIHNob3dTZXR0aW5nczogLT5cbiAgICB1cmlzID89IHJlcXVpcmUgJy4vdXJpcydcblxuICAgIEBwcm9qZWN0LmluaXRpYWxpemUoKS50aGVuIC0+XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmlzLlNFVFRJTkdTKVxuICAgICAgcGFuZSB8fD0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW5VUklJblBhbmUodXJpcy5TRVRUSU5HUywgcGFuZSwge30pXG4gICAgLmNhdGNoIChyZWFzb24pIC0+XG4gICAgICBjb25zb2xlLmVycm9yIHJlYXNvblxuXG4gIHJlbG9hZFByb2plY3RWYXJpYWJsZXM6IC0+IEBwcm9qZWN0LnJlbG9hZCgpXG5cbiAgY3JlYXRlUGlnbWVudHNSZXBvcnQ6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbigncGlnbWVudHMtcmVwb3J0Lmpzb24nKS50aGVuIChlZGl0b3IpID0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChAY3JlYXRlUmVwb3J0KCkpXG5cbiAgY3JlYXRlUmVwb3J0OiAtPlxuICAgIG8gPVxuICAgICAgYXRvbTogYXRvbS5nZXRWZXJzaW9uKClcbiAgICAgIHBpZ21lbnRzOiBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3BpZ21lbnRzJykubWV0YWRhdGEudmVyc2lvblxuICAgICAgcGxhdGZvcm06IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICAgICAgY29uZmlnOiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzJylcbiAgICAgIHByb2plY3Q6XG4gICAgICAgIGNvbmZpZzpcbiAgICAgICAgICBzb3VyY2VOYW1lczogQHByb2plY3Quc291cmNlTmFtZXNcbiAgICAgICAgICBzZWFyY2hOYW1lczogQHByb2plY3Quc2VhcmNoTmFtZXNcbiAgICAgICAgICBpZ25vcmVkTmFtZXM6IEBwcm9qZWN0Lmlnbm9yZWROYW1lc1xuICAgICAgICAgIGlnbm9yZWRTY29wZXM6IEBwcm9qZWN0Lmlnbm9yZWRTY29wZXNcbiAgICAgICAgICBpbmNsdWRlVGhlbWVzOiBAcHJvamVjdC5pbmNsdWRlVGhlbWVzXG4gICAgICAgICAgaWdub3JlR2xvYmFsU291cmNlTmFtZXM6IEBwcm9qZWN0Lmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzXG4gICAgICAgICAgaWdub3JlR2xvYmFsU2VhcmNoTmFtZXM6IEBwcm9qZWN0Lmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzXG4gICAgICAgICAgaWdub3JlR2xvYmFsSWdub3JlZE5hbWVzOiBAcHJvamVjdC5pZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXNcbiAgICAgICAgICBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzOiBAcHJvamVjdC5pZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzXG4gICAgICAgIHBhdGhzOiBAcHJvamVjdC5nZXRQYXRocygpXG4gICAgICAgIHZhcmlhYmxlczpcbiAgICAgICAgICBjb2xvcnM6IEBwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoXG4gICAgICAgICAgdG90YWw6IEBwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aFxuXG4gICAgSlNPTi5zdHJpbmdpZnkobywgbnVsbCwgMilcbiAgICAucmVwbGFjZSgvLy8je2F0b20ucHJvamVjdC5nZXRQYXRocygpLmpvaW4oJ3wnKX0vLy9nLCAnPHJvb3Q+JylcblxuICBwYXRjaEF0b206IC0+XG4gICAgZ2V0TW9kdWxlRnJvbU5vZGVDYWNoZSA9IChuYW1lKSAtPlxuICAgICAgbW9kdWxlUGF0aCA9IE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZpbHRlcigocykgLT4gcy5pbmRleE9mKG5hbWUpID4gLTEpWzBdXG4gICAgICByZXF1aXJlLmNhY2hlW21vZHVsZVBhdGhdXG5cbiAgICBnZXRNb2R1bGVGcm9tU25hcHNob3RDYWNoZSA9IChuYW1lKSAtPlxuICAgICAgaWYgdHlwZW9mIHNuYXBzaG90UmVzdWx0IGlzICd1bmRlZmluZWQnXG4gICAgICAgIG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgbW9kdWxlUGF0aCA9IE9iamVjdC5rZXlzKHNuYXBzaG90UmVzdWx0LmN1c3RvbVJlcXVpcmUuY2FjaGUpLmZpbHRlcigocykgLT4gcy5pbmRleE9mKG5hbWUpID4gLTEpWzBdXG4gICAgICAgIHNuYXBzaG90UmVzdWx0LmN1c3RvbVJlcXVpcmUuY2FjaGVbbW9kdWxlUGF0aF1cblxuICAgIHJlcXVpcmVDb3JlID0gKG5hbWUpIC0+XG4gICAgICBtb2R1bGUgPSBnZXRNb2R1bGVGcm9tTm9kZUNhY2hlKG5hbWUpID8gZ2V0TW9kdWxlRnJvbVNuYXBzaG90Q2FjaGUobmFtZSlcbiAgICAgIGlmIG1vZHVsZT9cbiAgICAgICAgbW9kdWxlLmV4cG9ydHNcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgJyN7bmFtZX0nIGluIHRoZSByZXF1aXJlIGNhY2hlLlwiKVxuXG4gICAgSGlnaGxpZ2h0Q29tcG9uZW50ID0gcmVxdWlyZUNvcmUoJ2hpZ2hsaWdodHMtY29tcG9uZW50JylcbiAgICBUZXh0RWRpdG9yUHJlc2VudGVyID0gcmVxdWlyZUNvcmUoJ3RleHQtZWRpdG9yLXByZXNlbnRlcicpXG5cbiAgICB1bmxlc3MgVGV4dEVkaXRvclByZXNlbnRlci5nZXRUZXh0SW5TY3JlZW5SYW5nZT9cbiAgICAgIFRleHRFZGl0b3JQcmVzZW50ZXI6OmdldFRleHRJblNjcmVlblJhbmdlID0gKHNjcmVlblJhbmdlKSAtPlxuICAgICAgICBpZiBAZGlzcGxheUxheWVyP1xuICAgICAgICAgIEBtb2RlbC5nZXRUZXh0SW5SYW5nZShAZGlzcGxheUxheWVyLnRyYW5zbGF0ZVNjcmVlblJhbmdlKHNjcmVlblJhbmdlKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBtb2RlbC5nZXRUZXh0SW5SYW5nZShAbW9kZWwuYnVmZmVyUmFuZ2VGb3JTY3JlZW5SYW5nZShzY3JlZW5SYW5nZSkpXG5cbiAgICAgIF9idWlsZEhpZ2hsaWdodFJlZ2lvbnMgPSBUZXh0RWRpdG9yUHJlc2VudGVyOjpidWlsZEhpZ2hsaWdodFJlZ2lvbnNcbiAgICAgIFRleHRFZGl0b3JQcmVzZW50ZXI6OmJ1aWxkSGlnaGxpZ2h0UmVnaW9ucyA9IChzY3JlZW5SYW5nZSkgLT5cbiAgICAgICAgcmVnaW9ucyA9IF9idWlsZEhpZ2hsaWdodFJlZ2lvbnMuY2FsbCh0aGlzLCBzY3JlZW5SYW5nZSlcblxuICAgICAgICBpZiByZWdpb25zLmxlbmd0aCBpcyAxXG4gICAgICAgICAgcmVnaW9uc1swXS50ZXh0ID0gQGdldFRleHRJblNjcmVlblJhbmdlKHNjcmVlblJhbmdlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVnaW9uc1swXS50ZXh0ID0gQGdldFRleHRJblNjcmVlblJhbmdlKFtcbiAgICAgICAgICAgIHNjcmVlblJhbmdlLnN0YXJ0XG4gICAgICAgICAgICBbc2NyZWVuUmFuZ2Uuc3RhcnQucm93LCBJbmZpbml0eV1cbiAgICAgICAgICBdKVxuICAgICAgICAgIHJlZ2lvbnNbcmVnaW9ucy5sZW5ndGggLSAxXS50ZXh0ID0gQGdldFRleHRJblNjcmVlblJhbmdlKFtcbiAgICAgICAgICAgIFtzY3JlZW5SYW5nZS5lbmQucm93LCAwXVxuICAgICAgICAgICAgc2NyZWVuUmFuZ2UuZW5kXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGlmIHJlZ2lvbnMubGVuZ3RoID4gMlxuICAgICAgICAgICAgcmVnaW9uc1sxXS50ZXh0ID0gQGdldFRleHRJblNjcmVlblJhbmdlKFtcbiAgICAgICAgICAgICAgW3NjcmVlblJhbmdlLnN0YXJ0LnJvdyArIDEsIDBdXG4gICAgICAgICAgICAgIFtzY3JlZW5SYW5nZS5lbmQucm93IC0gMSwgSW5maW5pdHldXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgIHJlZ2lvbnNcblxuICAgICAgX3VwZGF0ZUhpZ2hsaWdodFJlZ2lvbnMgPSBIaWdobGlnaHRDb21wb25lbnQ6OnVwZGF0ZUhpZ2hsaWdodFJlZ2lvbnNcbiAgICAgIEhpZ2hsaWdodENvbXBvbmVudDo6dXBkYXRlSGlnaGxpZ2h0UmVnaW9ucyA9IChpZCwgbmV3SGlnaGxpZ2h0U3RhdGUpIC0+XG4gICAgICAgIF91cGRhdGVIaWdobGlnaHRSZWdpb25zLmNhbGwodGhpcywgaWQ7IG5ld0hpZ2hsaWdodFN0YXRlKVxuXG4gICAgICAgIGlmIG5ld0hpZ2hsaWdodFN0YXRlLmNsYXNzPy5tYXRjaCAvXnBpZ21lbnRzLW5hdGl2ZS1iYWNrZ3JvdW5kXFxzL1xuICAgICAgICAgIGZvciBuZXdSZWdpb25TdGF0ZSwgaSBpbiBuZXdIaWdobGlnaHRTdGF0ZS5yZWdpb25zXG4gICAgICAgICAgICByZWdpb25Ob2RlID0gQHJlZ2lvbk5vZGVzQnlIaWdobGlnaHRJZFtpZF1baV1cblxuICAgICAgICAgICAgcmVnaW9uTm9kZS50ZXh0Q29udGVudCA9IG5ld1JlZ2lvblN0YXRlLnRleHQgaWYgbmV3UmVnaW9uU3RhdGUudGV4dD9cbiJdfQ==

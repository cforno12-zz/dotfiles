(function() {
  var ColorProjectElement, CompositeDisposable, EventsDelegation, SpacePenDSL, capitalize, ref, registerOrUpdateElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-utils'), SpacePenDSL = ref.SpacePenDSL, EventsDelegation = ref.EventsDelegation, registerOrUpdateElement = ref.registerOrUpdateElement;

  CompositeDisposable = null;

  capitalize = function(s) {
    return s.replace(/^./, function(m) {
      return m.toUpperCase();
    });
  };

  ColorProjectElement = (function(superClass) {
    extend(ColorProjectElement, superClass);

    function ColorProjectElement() {
      return ColorProjectElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorProjectElement);

    EventsDelegation.includeInto(ColorProjectElement);

    ColorProjectElement.content = function() {
      var arrayField, booleanField, selectField;
      arrayField = (function(_this) {
        return function(name, label, setting, description) {
          var settingName;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.tag('atom-text-editor', {
                  mini: true,
                  outlet: name,
                  type: 'array',
                  property: name
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName).join(', ')) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                });
              });
            });
          });
        };
      })(this);
      selectField = (function(_this) {
        return function(name, label, arg) {
          var description, options, ref1, setting, settingName, useBoolean;
          ref1 = arg != null ? arg : {}, options = ref1.options, setting = ref1.setting, description = ref1.description, useBoolean = ref1.useBoolean;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.select({
                  outlet: name,
                  "class": 'form-control',
                  required: true
                }, function() {
                  return options.forEach(function(option) {
                    if (option === '') {
                      return _this.option({
                        value: option
                      }, 'Use global config');
                    } else {
                      return _this.option({
                        value: option
                      }, capitalize(option));
                    }
                  });
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName)) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  if (useBoolean) {
                    return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                  }
                });
              });
            });
          });
        };
      })(this);
      booleanField = (function(_this) {
        return function(name, label, description, nested) {
          return _this.div({
            "class": 'control-group boolean'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.input({
                type: 'checkbox',
                id: "pigments-" + name,
                outlet: name
              });
              _this.label({
                "class": 'control-label',
                "for": "pigments-" + name
              }, function() {
                return _this.span({
                  "class": (nested ? 'setting-description' : 'setting-title')
                }, label);
              });
              if (description != null) {
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  return _this.raw(description);
                });
              }
            });
          });
        };
      })(this);
      return this.section({
        "class": 'settings-view pane-item'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'settings-wrapper'
          }, function() {
            _this.div({
              "class": 'header'
            }, function() {
              _this.div({
                "class": 'logo'
              }, function() {
                return _this.img({
                  src: 'atom://pigments/resources/logo.svg',
                  width: 140,
                  height: 35
                });
              });
              return _this.p({
                "class": 'setting-description'
              }, "These settings apply on the current project only and are complementary\nto the package settings.");
            });
            return _this.div({
              "class": 'fields'
            }, function() {
              var themes;
              themes = atom.themes.getActiveThemeNames();
              arrayField('sourceNames', 'Source Names');
              arrayField('ignoredNames', 'Ignored Names');
              arrayField('supportedFiletypes', 'Supported Filetypes');
              arrayField('ignoredScopes', 'Ignored Scopes');
              arrayField('searchNames', 'Extended Search Names', 'pigments.extendedSearchNames');
              selectField('sassShadeAndTintImplementation', 'Sass Shade And Tint Implementation', {
                options: ['', 'compass', 'bourbon'],
                setting: 'pigments.sassShadeAndTintImplementation',
                description: "Sass doesn't provide any implementation for shade and tint function, and Compass and Bourbon have different implementation for these two methods. This setting allow you to chose which implementation use."
              });
              return booleanField('includeThemes', 'Include Atom Themes Stylesheets', "The variables from <code>" + themes[0] + "</code> and\n<code>" + themes[1] + "</code> themes will be automatically added to the\nproject palette.");
            });
          });
        };
      })(this));
    };

    ColorProjectElement.prototype.createdCallback = function() {
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      return this.subscriptions = new CompositeDisposable;
    };

    ColorProjectElement.prototype.setModel = function(project) {
      this.project = project;
      return this.initializeBindings();
    };

    ColorProjectElement.prototype.initializeBindings = function() {
      var grammar;
      grammar = atom.grammars.grammarForScopeName('source.js.regexp');
      this.ignoredScopes.getModel().setGrammar(grammar);
      this.initializeTextEditor('sourceNames');
      this.initializeTextEditor('searchNames');
      this.initializeTextEditor('ignoredNames');
      this.initializeTextEditor('ignoredScopes');
      this.initializeTextEditor('supportedFiletypes');
      this.initializeCheckbox('includeThemes');
      this.initializeCheckbox('ignoreGlobalSourceNames');
      this.initializeCheckbox('ignoreGlobalIgnoredNames');
      this.initializeCheckbox('ignoreGlobalIgnoredScopes');
      this.initializeCheckbox('ignoreGlobalSearchNames');
      this.initializeCheckbox('ignoreGlobalSupportedFiletypes');
      return this.initializeSelect('sassShadeAndTintImplementation');
    };

    ColorProjectElement.prototype.initializeTextEditor = function(name) {
      var capitalizedName, editor, ref1;
      capitalizedName = capitalize(name);
      editor = this[name].getModel();
      editor.setText(((ref1 = this.project[name]) != null ? ref1 : []).join(', '));
      return this.subscriptions.add(editor.onDidStopChanging((function(_this) {
        return function() {
          var array;
          array = editor.getText().split(/\s*,\s*/g).filter(function(s) {
            return s.length > 0;
          });
          return _this.project["set" + capitalizedName](array);
        };
      })(this)));
    };

    ColorProjectElement.prototype.initializeSelect = function(name) {
      var capitalizedName, optionValues, select;
      capitalizedName = capitalize(name);
      select = this[name];
      optionValues = [].slice.call(select.querySelectorAll('option')).map(function(o) {
        return o.value;
      });
      if (this.project[name]) {
        select.selectedIndex = optionValues.indexOf(this.project[name]);
      }
      return this.subscriptions.add(this.subscribeTo(select, {
        change: (function(_this) {
          return function() {
            var ref1, value;
            value = (ref1 = select.selectedOptions[0]) != null ? ref1.value : void 0;
            return _this.project["set" + capitalizedName](value === '' ? null : value);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.initializeCheckbox = function(name) {
      var capitalizedName, checkbox;
      capitalizedName = capitalize(name);
      checkbox = this[name];
      checkbox.checked = this.project[name];
      return this.subscriptions.add(this.subscribeTo(checkbox, {
        change: (function(_this) {
          return function() {
            return _this.project["set" + capitalizedName](checkbox.checked);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.getTitle = function() {
      return 'Project Settings';
    };

    ColorProjectElement.prototype.getURI = function() {
      return 'pigments://settings';
    };

    ColorProjectElement.prototype.getIconName = function() {
      return "pigments";
    };

    ColorProjectElement.prototype.serialize = function() {
      return {
        deserializer: 'ColorProjectElement'
      };
    };

    return ColorProjectElement;

  })(HTMLElement);

  module.exports = ColorProjectElement = registerOrUpdateElement('pigments-color-project', ColorProjectElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC1lbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUhBQUE7SUFBQTs7O0VBQUEsTUFBMkQsT0FBQSxDQUFRLFlBQVIsQ0FBM0QsRUFBQyw2QkFBRCxFQUFjLHVDQUFkLEVBQWdDOztFQUNoQyxtQkFBQSxHQUFzQjs7RUFFdEIsVUFBQSxHQUFhLFNBQUMsQ0FBRDtXQUFPLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVixFQUFnQixTQUFDLENBQUQ7YUFBTyxDQUFDLENBQUMsV0FBRixDQUFBO0lBQVAsQ0FBaEI7RUFBUDs7RUFFUDs7Ozs7OztJQUNKLFdBQVcsQ0FBQyxXQUFaLENBQXdCLG1CQUF4Qjs7SUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixtQkFBN0I7O0lBRUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxVQUFBLEdBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsT0FBZCxFQUF1QixXQUF2QjtBQUNYLGNBQUE7VUFBQSxXQUFBLEdBQWMsV0FBQSxHQUFZO2lCQUUxQixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLFNBQUE7bUJBQ2pDLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFVBQVA7YUFBTCxFQUF3QixTQUFBO2NBQ3RCLEtBQUMsQ0FBQSxLQUFELENBQU87Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO2VBQVAsRUFBK0IsU0FBQTt1QkFDN0IsS0FBQyxDQUFBLElBQUQsQ0FBTTtrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7aUJBQU4sRUFBOEIsS0FB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LEtBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxHQUFNLGVBQU4sQ0FBVCxDQUFrQyxRQUFRLENBQUMsT0FBM0M7VUFEZ0Q7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7T0FBdkIsQ0FBbkI7SUFMa0I7O2tDQVFwQixRQUFBLEdBQVUsU0FBQTthQUFHO0lBQUg7O2tDQUVWLE1BQUEsR0FBUSxTQUFBO2FBQUc7SUFBSDs7a0NBRVIsV0FBQSxHQUFhLFNBQUE7YUFBRztJQUFIOztrQ0FFYixTQUFBLEdBQVcsU0FBQTthQUFHO1FBQUMsWUFBQSxFQUFjLHFCQUFmOztJQUFIOzs7O0tBdEpxQjs7RUF3SmxDLE1BQU0sQ0FBQyxPQUFQLEdBQ0EsbUJBQUEsR0FDQSx1QkFBQSxDQUF3Qix3QkFBeEIsRUFBa0QsbUJBQW1CLENBQUMsU0FBdEU7QUEvSkEiLCJzb3VyY2VzQ29udGVudCI6WyJ7U3BhY2VQZW5EU0wsIEV2ZW50c0RlbGVnYXRpb24sIHJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50fSA9IHJlcXVpcmUgJ2F0b20tdXRpbHMnXG5Db21wb3NpdGVEaXNwb3NhYmxlID0gbnVsbFxuXG5jYXBpdGFsaXplID0gKHMpIC0+IHMucmVwbGFjZSAvXi4vLCAobSkgLT4gbS50b1VwcGVyQ2FzZSgpXG5cbmNsYXNzIENvbG9yUHJvamVjdEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxuICBTcGFjZVBlbkRTTC5pbmNsdWRlSW50byh0aGlzKVxuICBFdmVudHNEZWxlZ2F0aW9uLmluY2x1ZGVJbnRvKHRoaXMpXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgYXJyYXlGaWVsZCA9IChuYW1lLCBsYWJlbCwgc2V0dGluZywgZGVzY3JpcHRpb24pID0+XG4gICAgICBzZXR0aW5nTmFtZSA9IFwicGlnbWVudHMuI3tuYW1lfVwiXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdjb250cm9sLWdyb3VwIGFycmF5JywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2NvbnRyb2xzJywgPT5cbiAgICAgICAgICBAbGFiZWwgY2xhc3M6ICdjb250cm9sLWxhYmVsJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc2V0dGluZy10aXRsZScsIGxhYmVsXG5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAnY29udHJvbC13cmFwcGVyJywgPT5cbiAgICAgICAgICAgIEB0YWcgJ2F0b20tdGV4dC1lZGl0b3InLCBtaW5pOiB0cnVlLCBvdXRsZXQ6IG5hbWUsIHR5cGU6ICdhcnJheScsIHByb3BlcnR5OiBuYW1lXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc2V0dGluZy1kZXNjcmlwdGlvbicsID0+XG4gICAgICAgICAgICAgIEBkaXYgPT5cbiAgICAgICAgICAgICAgICBAcmF3IFwiR2xvYmFsIGNvbmZpZzogPGNvZGU+I3thdG9tLmNvbmZpZy5nZXQoc2V0dGluZyA/IHNldHRpbmdOYW1lKS5qb2luKCcsICcpfTwvY29kZT5cIlxuXG4gICAgICAgICAgICAgICAgQHAoPT4gQHJhdyBkZXNjcmlwdGlvbikgaWYgZGVzY3JpcHRpb24/XG5cbiAgICAgICAgICAgICAgYm9vbGVhbkZpZWxkKFwiaWdub3JlR2xvYmFsI3tjYXBpdGFsaXplIG5hbWV9XCIsICdJZ25vcmUgR2xvYmFsJywgbnVsbCwgdHJ1ZSlcblxuICAgIHNlbGVjdEZpZWxkID0gKG5hbWUsIGxhYmVsLCB7b3B0aW9ucywgc2V0dGluZywgZGVzY3JpcHRpb24sIHVzZUJvb2xlYW59PXt9KSA9PlxuICAgICAgc2V0dGluZ05hbWUgPSBcInBpZ21lbnRzLiN7bmFtZX1cIlxuXG4gICAgICBAZGl2IGNsYXNzOiAnY29udHJvbC1ncm91cCBhcnJheScsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdjb250cm9scycsID0+XG4gICAgICAgICAgQGxhYmVsIGNsYXNzOiAnY29udHJvbC1sYWJlbCcsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ3NldHRpbmctdGl0bGUnLCBsYWJlbFxuXG4gICAgICAgICAgQGRpdiBjbGFzczogJ2NvbnRyb2wtd3JhcHBlcicsID0+XG4gICAgICAgICAgICBAc2VsZWN0IG91dGxldDogbmFtZSwgY2xhc3M6ICdmb3JtLWNvbnRyb2wnLCByZXF1aXJlZDogdHJ1ZSwgPT5cbiAgICAgICAgICAgICAgb3B0aW9ucy5mb3JFYWNoIChvcHRpb24pID0+XG4gICAgICAgICAgICAgICAgaWYgb3B0aW9uIGlzICcnXG4gICAgICAgICAgICAgICAgICBAb3B0aW9uIHZhbHVlOiBvcHRpb24sICdVc2UgZ2xvYmFsIGNvbmZpZydcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBAb3B0aW9uIHZhbHVlOiBvcHRpb24sIGNhcGl0YWxpemUgb3B0aW9uXG5cbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzZXR0aW5nLWRlc2NyaXB0aW9uJywgPT5cbiAgICAgICAgICAgICAgQGRpdiA9PlxuICAgICAgICAgICAgICAgIEByYXcgXCJHbG9iYWwgY29uZmlnOiA8Y29kZT4je2F0b20uY29uZmlnLmdldChzZXR0aW5nID8gc2V0dGluZ05hbWUpfTwvY29kZT5cIlxuXG4gICAgICAgICAgICAgICAgQHAoPT4gQHJhdyBkZXNjcmlwdGlvbikgaWYgZGVzY3JpcHRpb24/XG5cbiAgICAgICAgICAgICAgaWYgdXNlQm9vbGVhblxuICAgICAgICAgICAgICAgIGJvb2xlYW5GaWVsZChcImlnbm9yZUdsb2JhbCN7Y2FwaXRhbGl6ZSBuYW1lfVwiLCAnSWdub3JlIEdsb2JhbCcsIG51bGwsIHRydWUpXG5cbiAgICBib29sZWFuRmllbGQgPSAobmFtZSwgbGFiZWwsIGRlc2NyaXB0aW9uLCBuZXN0ZWQpID0+XG4gICAgICBAZGl2IGNsYXNzOiAnY29udHJvbC1ncm91cCBib29sZWFuJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2NvbnRyb2xzJywgPT5cbiAgICAgICAgICBAaW5wdXQgdHlwZTogJ2NoZWNrYm94JywgaWQ6IFwicGlnbWVudHMtI3tuYW1lfVwiLCBvdXRsZXQ6IG5hbWVcbiAgICAgICAgICBAbGFiZWwgY2xhc3M6ICdjb250cm9sLWxhYmVsJywgZm9yOiBcInBpZ21lbnRzLSN7bmFtZX1cIiwgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAoaWYgbmVzdGVkIHRoZW4gJ3NldHRpbmctZGVzY3JpcHRpb24nIGVsc2UgJ3NldHRpbmctdGl0bGUnKSwgbGFiZWxcblxuICAgICAgICAgIGlmIGRlc2NyaXB0aW9uP1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NldHRpbmctZGVzY3JpcHRpb24nLCA9PlxuICAgICAgICAgICAgICBAcmF3IGRlc2NyaXB0aW9uXG5cbiAgICBAc2VjdGlvbiBjbGFzczogJ3NldHRpbmdzLXZpZXcgcGFuZS1pdGVtJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdzZXR0aW5ncy13cmFwcGVyJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2hlYWRlcicsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2xvZ28nLCA9PlxuICAgICAgICAgICAgQGltZyBzcmM6ICdhdG9tOi8vcGlnbWVudHMvcmVzb3VyY2VzL2xvZ28uc3ZnJywgd2lkdGg6IDE0MCwgaGVpZ2h0OiAzNVxuXG4gICAgICAgICAgQHAgY2xhc3M6ICdzZXR0aW5nLWRlc2NyaXB0aW9uJywgXCJcIlwiXG4gICAgICAgICAgVGhlc2Ugc2V0dGluZ3MgYXBwbHkgb24gdGhlIGN1cnJlbnQgcHJvamVjdCBvbmx5IGFuZCBhcmUgY29tcGxlbWVudGFyeVxuICAgICAgICAgIHRvIHRoZSBwYWNrYWdlIHNldHRpbmdzLlxuICAgICAgICAgIFwiXCJcIlxuXG4gICAgICAgIEBkaXYgY2xhc3M6ICdmaWVsZHMnLCA9PlxuICAgICAgICAgIHRoZW1lcyA9IGF0b20udGhlbWVzLmdldEFjdGl2ZVRoZW1lTmFtZXMoKVxuICAgICAgICAgIGFycmF5RmllbGQoJ3NvdXJjZU5hbWVzJywgJ1NvdXJjZSBOYW1lcycpXG4gICAgICAgICAgYXJyYXlGaWVsZCgnaWdub3JlZE5hbWVzJywgJ0lnbm9yZWQgTmFtZXMnKVxuICAgICAgICAgIGFycmF5RmllbGQoJ3N1cHBvcnRlZEZpbGV0eXBlcycsICdTdXBwb3J0ZWQgRmlsZXR5cGVzJylcbiAgICAgICAgICBhcnJheUZpZWxkKCdpZ25vcmVkU2NvcGVzJywgJ0lnbm9yZWQgU2NvcGVzJylcbiAgICAgICAgICBhcnJheUZpZWxkKCdzZWFyY2hOYW1lcycsICdFeHRlbmRlZCBTZWFyY2ggTmFtZXMnLCAncGlnbWVudHMuZXh0ZW5kZWRTZWFyY2hOYW1lcycpXG4gICAgICAgICAgc2VsZWN0RmllbGQoJ3Nhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicsICdTYXNzIFNoYWRlIEFuZCBUaW50IEltcGxlbWVudGF0aW9uJywge1xuICAgICAgICAgICAgb3B0aW9uczogWycnLCAnY29tcGFzcycsICdib3VyYm9uJ11cbiAgICAgICAgICAgIHNldHRpbmc6ICdwaWdtZW50cy5zYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXNzIGRvZXNuJ3QgcHJvdmlkZSBhbnkgaW1wbGVtZW50YXRpb24gZm9yIHNoYWRlIGFuZCB0aW50IGZ1bmN0aW9uLCBhbmQgQ29tcGFzcyBhbmQgQm91cmJvbiBoYXZlIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlc2UgdHdvIG1ldGhvZHMuIFRoaXMgc2V0dGluZyBhbGxvdyB5b3UgdG8gY2hvc2Ugd2hpY2ggaW1wbGVtZW50YXRpb24gdXNlLlwiXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGJvb2xlYW5GaWVsZCgnaW5jbHVkZVRoZW1lcycsICdJbmNsdWRlIEF0b20gVGhlbWVzIFN0eWxlc2hlZXRzJywgXCJcIlwiXG4gICAgICAgICAgVGhlIHZhcmlhYmxlcyBmcm9tIDxjb2RlPiN7dGhlbWVzWzBdfTwvY29kZT4gYW5kXG4gICAgICAgICAgPGNvZGU+I3t0aGVtZXNbMV19PC9jb2RlPiB0aGVtZXMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZVxuICAgICAgICAgIHByb2plY3QgcGFsZXR0ZS5cbiAgICAgICAgICBcIlwiXCIpXG5cbiAgY3JlYXRlZENhbGxiYWNrOiAtPlxuICAgIHtDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBDb21wb3NpdGVEaXNwb3NhYmxlP1xuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIHNldE1vZGVsOiAoQHByb2plY3QpIC0+XG4gICAgQGluaXRpYWxpemVCaW5kaW5ncygpXG5cbiAgaW5pdGlhbGl6ZUJpbmRpbmdzOiAtPlxuICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3NvdXJjZS5qcy5yZWdleHAnKVxuICAgIEBpZ25vcmVkU2NvcGVzLmdldE1vZGVsKCkuc2V0R3JhbW1hcihncmFtbWFyKVxuXG4gICAgQGluaXRpYWxpemVUZXh0RWRpdG9yKCdzb3VyY2VOYW1lcycpXG4gICAgQGluaXRpYWxpemVUZXh0RWRpdG9yKCdzZWFyY2hOYW1lcycpXG4gICAgQGluaXRpYWxpemVUZXh0RWRpdG9yKCdpZ25vcmVkTmFtZXMnKVxuICAgIEBpbml0aWFsaXplVGV4dEVkaXRvcignaWdub3JlZFNjb3BlcycpXG4gICAgQGluaXRpYWxpemVUZXh0RWRpdG9yKCdzdXBwb3J0ZWRGaWxldHlwZXMnKVxuICAgIEBpbml0aWFsaXplQ2hlY2tib3goJ2luY2x1ZGVUaGVtZXMnKVxuICAgIEBpbml0aWFsaXplQ2hlY2tib3goJ2lnbm9yZUdsb2JhbFNvdXJjZU5hbWVzJylcbiAgICBAaW5pdGlhbGl6ZUNoZWNrYm94KCdpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMnKVxuICAgIEBpbml0aWFsaXplQ2hlY2tib3goJ2lnbm9yZUdsb2JhbElnbm9yZWRTY29wZXMnKVxuICAgIEBpbml0aWFsaXplQ2hlY2tib3goJ2lnbm9yZUdsb2JhbFNlYXJjaE5hbWVzJylcbiAgICBAaW5pdGlhbGl6ZUNoZWNrYm94KCdpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMnKVxuICAgIEBpbml0aWFsaXplU2VsZWN0KCdzYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24nKVxuXG4gIGluaXRpYWxpemVUZXh0RWRpdG9yOiAobmFtZSkgLT5cbiAgICBjYXBpdGFsaXplZE5hbWUgPSBjYXBpdGFsaXplIG5hbWVcbiAgICBlZGl0b3IgPSBAW25hbWVdLmdldE1vZGVsKClcblxuICAgIGVkaXRvci5zZXRUZXh0KChAcHJvamVjdFtuYW1lXSA/IFtdKS5qb2luKCcsICcpKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgYXJyYXkgPSBlZGl0b3IuZ2V0VGV4dCgpLnNwbGl0KC9cXHMqLFxccyovZykuZmlsdGVyIChzKSAtPiBzLmxlbmd0aCA+IDBcbiAgICAgIEBwcm9qZWN0W1wic2V0I3tjYXBpdGFsaXplZE5hbWV9XCJdKGFycmF5KVxuXG4gIGluaXRpYWxpemVTZWxlY3Q6IChuYW1lKSAtPlxuICAgIGNhcGl0YWxpemVkTmFtZSA9IGNhcGl0YWxpemUgbmFtZVxuICAgIHNlbGVjdCA9IEBbbmFtZV1cbiAgICBvcHRpb25WYWx1ZXMgPSBbXS5zbGljZS5jYWxsKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKSkubWFwIChvKSAtPiBvLnZhbHVlXG5cbiAgICBpZiBAcHJvamVjdFtuYW1lXVxuICAgICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSBvcHRpb25WYWx1ZXMuaW5kZXhPZihAcHJvamVjdFtuYW1lXSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAc3Vic2NyaWJlVG8gc2VsZWN0LCBjaGFuZ2U6ID0+XG4gICAgICB2YWx1ZSA9IHNlbGVjdC5zZWxlY3RlZE9wdGlvbnNbMF0/LnZhbHVlXG4gICAgICBAcHJvamVjdFtcInNldCN7Y2FwaXRhbGl6ZWROYW1lfVwiXShpZiB2YWx1ZSBpcyAnJyB0aGVuIG51bGwgZWxzZSB2YWx1ZSlcblxuICBpbml0aWFsaXplQ2hlY2tib3g6IChuYW1lKSAtPlxuICAgIGNhcGl0YWxpemVkTmFtZSA9IGNhcGl0YWxpemUgbmFtZVxuICAgIGNoZWNrYm94ID0gQFtuYW1lXVxuICAgIGNoZWNrYm94LmNoZWNrZWQgPSBAcHJvamVjdFtuYW1lXVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBzdWJzY3JpYmVUbyBjaGVja2JveCwgY2hhbmdlOiA9PlxuICAgICAgQHByb2plY3RbXCJzZXQje2NhcGl0YWxpemVkTmFtZX1cIl0oY2hlY2tib3guY2hlY2tlZClcblxuICBnZXRUaXRsZTogLT4gJ1Byb2plY3QgU2V0dGluZ3MnXG5cbiAgZ2V0VVJJOiAtPiAncGlnbWVudHM6Ly9zZXR0aW5ncydcblxuICBnZXRJY29uTmFtZTogLT4gXCJwaWdtZW50c1wiXG5cbiAgc2VyaWFsaXplOiAtPiB7ZGVzZXJpYWxpemVyOiAnQ29sb3JQcm9qZWN0RWxlbWVudCd9XG5cbm1vZHVsZS5leHBvcnRzID1cbkNvbG9yUHJvamVjdEVsZW1lbnQgPVxucmVnaXN0ZXJPclVwZGF0ZUVsZW1lbnQgJ3BpZ21lbnRzLWNvbG9yLXByb2plY3QnLCBDb2xvclByb2plY3RFbGVtZW50LnByb3RvdHlwZVxuIl19

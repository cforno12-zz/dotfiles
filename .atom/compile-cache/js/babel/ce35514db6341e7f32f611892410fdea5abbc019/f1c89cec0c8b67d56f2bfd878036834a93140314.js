Object.defineProperty(exports, '__esModule', {
  value: true
});

require('object-assign-shim');

var _atom = require('atom');

// helper functions

// get the key in namespace
'use babel';
function getConfig(key) {
  var namespace = arguments.length <= 1 || arguments[1] === undefined ? 'block-cursor' : arguments[1];

  return atom.config.get(key ? namespace + '.' + key : namespace);
}

// set the key in namespace
function setConfig(key, value) {
  var namespace = arguments.length <= 2 || arguments[2] === undefined ? 'block-cursor' : arguments[2];

  return atom.config.set(namespace + '.' + key, value);
}

// get a clone of the global config
function getGlobalConfig() {
  var config = Object.assign({}, getConfig('global'));
  Object.assign(config.blinkOn, getConfig('global.blinkOn'));
  Object.assign(config.blinkOff, getConfig('global.blinkOff'));
  return config;
}

// convert a color to a string
function toRGBAString(color) {
  if (typeof color == 'string') return color;
  if (typeof color.toRGBAString == 'function') return color.toRGBAString();
  return 'rgba(' + color.red + ', ' + color.green + ', ' + color.blue + ', ' + color.alpha + ')';
}

// private API

// keep a reference to the stylesheet
var style;

// create a stylesheet element and
// attach it to the DOM
function setupStylesheet() {
  style = document.createElement('style');
  style.type = 'text/css';
  document.querySelector('head atom-styles').appendChild(style);

  // return a disposable for easy removal :)
  return new _atom.Disposable(function () {
    style.parentNode.removeChild(style);
    style = null;
  });
}

// update the stylesheet when config changes
function updateCursorStyles(config) {
  // clear stylesheet
  style.innerHTML = '';
  for (var key of Object.keys(config)) {
    // and add styles for each cursor style
    style.innerHTML += cssForCursorStyle(config[key]);
  }
}

function cssForCursorStyle(cursorStyle) {
  // fill the cursor style with global as defaults
  cursorStyle = Object.assign(getGlobalConfig(), cursorStyle);
  var blinkOn = Object.assign({}, getConfig('global.blinkOn'), cursorStyle.blinkOn);
  var blinkOff = Object.assign({}, getConfig('global.blinkOff'), cursorStyle.blinkOff);
  var _cursorStyle = cursorStyle;
  var selector = _cursorStyle.selector;
  var scopes = _cursorStyle.scopes;
  var pulseDuration = _cursorStyle.pulseDuration;
  var cursorLineFix = _cursorStyle.cursorLineFix;

  // if cursor blinking is off, set the secondaryColor the same
  // as primaryColor to prevent cursor blinking in [mini] editors
  if (atom.packages.isPackageActive('cursor-blink-interval') && getConfig('cursorBlinkInterval', 'cursor-blink-interval') == 0) blinkOff = Object.assign({}, blinkOn);

  // blink on rule
  Object.assign(blinkOn, {
    selector: selectorForScopes(selector, scopes),
    properties: Object.assign({
      // blink on background color
      'background-color': toRGBAString(blinkOn.backgroundColor),
      // pulse animation duration
      'transition-duration': pulseDuration + 'ms'
    }, // cursor line fix
    // 'z-index': cursorLineFix ? 1 : -1 // @TODO: enable this when a solution is found for #20
    createBorderStyle(blinkOn))
  });
  // end blink on rule

  // blink off rule
  Object.assign(blinkOff, {
    selector: selectorForScopes(selector, scopes, true),
    properties: {}
  });
  if (blinkOff.backgroundColor.alpha == 0 && (blinkOff.borderWidth == 0 || blinkOff.borderStyle == 'none' || blinkOff.borderColor.alpha == 0)) {
    // better animation performance by animating opacity
    // if blink off cursor is invisible
    blinkOff.properties.opacity = 0;
  } else {
    Object.assign(blinkOff.properties, {
      // blink off background color
      'background-color': toRGBAString(blinkOff.backgroundColor)
    }, createBorderStyle(blinkOff));
  }
  // end blink off rule

  return createCSSRule(blinkOn) + createCSSRule(blinkOff);
}

// create a css properties object for given border properties
function createBorderStyle(_ref) {
  var borderWidth = _ref.borderWidth;
  var borderStyle = _ref.borderStyle;
  var borderColor = _ref.borderColor;

  var borderString = borderWidth + 'px solid ' + toRGBAString(borderColor);
  switch (borderStyle) {
    case 'bordered-box':
      // border on all sides
      return { border: borderString };
    case 'i-beam':
      // border on left side
      return { border: 'none', 'border-left': borderString };
    case 'underline':
      // border on bottom side
      return { border: 'none', 'border-bottom': borderString };
    default:
      // no border
      return { border: 'none' };
  }
}

// create a css rule from a selector and an
// object containint propertyNames and values
// of the form
// <selector> {
//    <propertyName1>: <value1>;
//    <propertyName2>: <value2>;
//    ...
// }

function createCSSRule(_ref2) {
  var selector = _ref2.selector;
  var properties = _ref2.properties;

  return selector + ' { ' + Object.keys(properties).map(function (key) {
    return key + ': ' + properties[key] + ';';
  }).join('') + ' }';
}

// creates a css selector for the given scopes
// @param base: selector that selects the atom-text-editor element
// @param scopes: array of scopes to select
// @param blinkOff: create a blink-off selector?
function selectorForScopes(base, scopes) {
  var blinkOff = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  var selectors = [];

  function grammarSelectorsForScopeName(scopeName) {
    return scopeName.split('.').map(function (scope) {
      return '[data-grammar~="' + scope + '"]';
    }).join('');
  }

  if (blinkOff) blinkOff = '.blink-off';

  for (var scopeName of scopes) {
    var grammarSelectors = scopeName == '*' ? '' : grammarSelectorsForScopeName(scopeName);
    selectors.push('' + base + grammarSelectors + '.editor .cursors' + blinkOff + ' .cursor');
  }
  return selectors.join(',');
}

// add a custom cursor to the config. an easy
// shortcut when you want to define a new cursor type
function addCustomCursor() {
  var i = 0;
  while (getConfig('custom-' + i)) i++;
  setConfig('custom-' + i, getGlobalConfig());
}

// public API

// module.exports = BlockCursor = {
var config = {
  global: {
    type: 'object',
    properties: {
      scopes: {
        type: 'array',
        'default': ['*']
      },
      selector: {
        type: 'string',
        'default': 'atom-text-editor'
      },
      blinkOn: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'color',
            'default': '#393939'
          },
          borderWidth: {
            type: 'integer',
            'default': 1,
            minimum: 0
          },
          borderStyle: {
            type: 'string',
            'default': 'none',
            'enum': ['none', 'bordered-box', 'i-beam', 'underline']
          },
          borderColor: {
            type: 'color',
            'default': 'transparent'
          }
        }
      },
      blinkOff: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'color',
            'default': 'transparent'
          },
          borderWidth: {
            type: 'integer',
            'default': 1,
            minimum: 0
          },
          borderStyle: {
            type: 'string',
            'default': 'none',
            'enum': ['none', 'bordered-box', 'i-beam', 'underline']
          },
          borderColor: {
            type: 'color',
            'default': 'transparent'
          }
        }
      },
      pulseDuration: {
        type: 'integer',
        'default': 0,
        minimum: 0
      },
      cursorLineFix: {
        description: 'Temporarily ignored (always true) because of an issue with the tile rendering introduced in Atom 0.209.0.',
        type: 'boolean',
        'default': false
      }
    }
  }
};

var disposables;

function activate() {
  // wait for cursor-blink-interval package to activate
  // if it is loaded
  Promise.resolve(atom.packages.isPackageLoaded('cursor-blink-interval') && atom.packages.activatePackage('cursor-blink-interval')).then(function go() {
    disposables = new _atom.CompositeDisposable(setupStylesheet(), atom.config.observe('block-cursor', updateCursorStyles), atom.commands.add('atom-workspace', 'block-cursor:new-custom-cursor', addCustomCursor));
  })['catch'](function (error) {
    console.error(error.message);
  });
}

function deactivate() {
  disposables.dispose();
  disposables = null;
}

exports.config = config;
exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxvY2stY3Vyc29yL2xpYi9ibG9jay1jdXJzb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztRQUNPLG9CQUFvQjs7b0JBQ21CLE1BQU07Ozs7O0FBRnBELFdBQVcsQ0FBQztBQU9aLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBOEI7TUFBNUIsU0FBUyx5REFBRyxjQUFjOztBQUNoRCxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBTSxTQUFTLFNBQUksR0FBRyxHQUFLLFNBQVMsQ0FBQyxDQUFDO0NBQ2pFOzs7QUFHRCxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUE4QjtNQUE1QixTQUFTLHlEQUFHLGNBQWM7O0FBQ3ZELFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUksU0FBUyxTQUFJLEdBQUcsRUFBSSxLQUFLLENBQUMsQ0FBQztDQUN0RDs7O0FBR0QsU0FBUyxlQUFlLEdBQUc7QUFDekIsTUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDM0QsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFDN0QsU0FBTyxNQUFNLENBQUM7Q0FDZjs7O0FBR0QsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO0FBQzNCLE1BQUcsT0FBTyxLQUFLLElBQUksUUFBUSxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzFDLE1BQUcsT0FBTyxLQUFLLENBQUMsWUFBWSxJQUFJLFVBQVUsRUFBRSxPQUFPLEtBQUssQ0FBQyxZQUFZ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QUFFLENBQUM7T0FDWDtBQUNELG1CQUFhLEVBQUU7QUFDYixtQkFBVyxFQUFFLDJHQUEyRztBQUN4SCxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtLQUNGO0dBQ0Y7Q0FDRixDQUFDOztBQUVGLElBQUksV0FBVyxDQUFDOztBQUVoQixTQUFTLFFBQVEsR0FBRzs7O0FBR2xCLFNBQU8sQ0FBQyxPQUFPLENBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FDekQsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUc7QUFDbkIsZUFBVyxHQUFHLDhCQUNaLGVBQWUsRUFBRSxFQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsRUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsZ0NBQWdDLEVBQUUsZUFBZSxDQUFDLENBQ3ZGLENBQUM7R0FDSCxDQUFDLFNBQU0sQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNoQixXQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUM5QixDQUFDLENBQUM7Q0FDSjs7QUFFRCxTQUFTLFVBQVUsR0FBRztBQUNwQixhQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEIsYUFBVyxHQUFHLElBQUksQ0FBQztDQUNwQjs7UUFFTyxNQUFNLEdBQU4sTUFBTTtRQUFFLFFBQVEsR0FBUixRQUFRO1FBQUUsVUFBVSxHQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibG9jay1jdXJzb3IvbGliL2Jsb2NrLWN1cnNvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0ICdvYmplY3QtYXNzaWduLXNoaW0nO1xuaW1wb3J0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuLy8gaGVscGVyIGZ1bmN0aW9uc1xuXG4vLyBnZXQgdGhlIGtleSBpbiBuYW1lc3BhY2VcbmZ1bmN0aW9uIGdldENvbmZpZyhrZXksIG5hbWVzcGFjZSA9ICdibG9jay1jdXJzb3InKSB7XG4gIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoa2V5ID8gYCR7bmFtZXNwYWNlfS4ke2tleX1gIDogbmFtZXNwYWNlKTtcbn1cblxuLy8gc2V0IHRoZSBrZXkgaW4gbmFtZXNwYWNlXG5mdW5jdGlvbiBzZXRDb25maWcoa2V5LCB2YWx1ZSwgbmFtZXNwYWNlID0gJ2Jsb2NrLWN1cnNvcicpIHtcbiAgcmV0dXJuIGF0b20uY29uZmlnLnNldChgJHtuYW1lc3BhY2V9LiR7a2V5fWAsIHZhbHVlKTtcbn1cblxuLy8gZ2V0IGEgY2xvbmUgb2YgdGhlIGdsb2JhbCBjb25maWdcbmZ1bmN0aW9uIGdldEdsb2JhbENvbmZpZygpIHtcbiAgdmFyIGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGdldENvbmZpZygnZ2xvYmFsJykpO1xuICBPYmplY3QuYXNzaWduKGNvbmZpZy5ibGlua09uLCBnZXRDb25maWcoJ2dsb2JhbC5ibGlua09uJykpO1xuICBPYmplY3QuYXNzaWduKGNvbmZpZy5ibGlua09mZiwgZ2V0Q29uZmlnKCdnbG9iYWwuYmxpbmtPZmYnKSk7XG4gIHJldHVybiBjb25maWc7XG59XG5cbi8vIGNvbnZlcnQgYSBjb2xvciB0byBhIHN0cmluZ1xuZnVuY3Rpb24gdG9SR0JBU3RyaW5nKGNvbG9yKSB7XG4gIGlmKHR5cGVvZiBjb2xvciA9PSAnc3RyaW5nJykgcmV0dXJuIGNvbG9yO1xuICBpZih0eXBlb2YgY29sb3IudG9SR0JBU3RyaW5nID09ICdmdW5jdGlvbicpIHJldHVybiBjb2xvci50b1JHQkFTdHJpbmcoKTtcbiAgcmV0dXJuIGByZ2JhKCR7Y29sb3IucmVkfSwgJHtjb2xvci5ncmVlbn0sICR7Y29sb3IuYmx1ZX0sICR7Y29sb3IuYWxwaGF9KWA7XG59XG5cbi8vIHByaXZhdGUgQVBJXG5cbi8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHN0eWxlc2hlZXRcbnZhciBzdHlsZTtcblxuLy8gY3JlYXRlIGEgc3R5bGVzaGVldCBlbGVtZW50IGFuZFxuLy8gYXR0YWNoIGl0IHRvIHRoZSBET01cbmZ1bmN0aW9uIHNldHVwU3R5bGVzaGVldCgpIHtcbiAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCBhdG9tLXN0eWxlcycpLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICAvLyByZXR1cm4gYSBkaXNwb3NhYmxlIGZvciBlYXN5IHJlbW92YWwgOilcbiAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcbiAgICBzdHlsZSA9IG51bGw7XG4gIH0pO1xufVxuXG4vLyB1cGRhdGUgdGhlIHN0eWxlc2hlZXQgd2hlbiBjb25maWcgY2hhbmdlc1xuZnVuY3Rpb24gdXBkYXRlQ3Vyc29yU3R5bGVzKGNvbmZpZykge1xuICAvLyBjbGVhciBzdHlsZXNoZWV0XG4gIHN0eWxlLmlubmVySFRNTCA9ICcnO1xuICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb25maWcpKSB7XG4gICAgLy8gYW5kIGFkZCBzdHlsZXMgZm9yIGVhY2ggY3Vyc29yIHN0eWxlXG4gICAgc3R5bGUuaW5uZXJIVE1MICs9IGNzc0ZvckN1cnNvclN0eWxlKGNvbmZpZ1trZXldKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjc3NGb3JDdXJzb3JTdHlsZShjdXJzb3JTdHlsZSkge1xuICAvLyBmaWxsIHRoZSBjdXJzb3Igc3R5bGUgd2l0aCBnbG9iYWwgYXMgZGVmYXVsdHNcbiAgY3Vyc29yU3R5bGUgPSBPYmplY3QuYXNzaWduKGdldEdsb2JhbENvbmZpZygpLCBjdXJzb3JTdHlsZSk7XG4gIHZhciBibGlua09uID0gT2JqZWN0LmFzc2lnbih7fSwgZ2V0Q29uZmlnKCdnbG9iYWwuYmxpbmtPbicpLCBjdXJzb3JTdHlsZS5ibGlua09uKTtcbiAgdmFyIGJsaW5rT2ZmID0gT2JqZWN0LmFzc2lnbih7fSwgZ2V0Q29uZmlnKCdnbG9iYWwuYmxpbmtPZmYnKSwgY3Vyc29yU3R5bGUuYmxpbmtPZmYpO1xuICB2YXIge3NlbGVjdG9yLCBzY29wZXMsIHB1bHNlRHVyYXRpb24sIGN1cnNvckxpbmVGaXh9ID0gY3Vyc29yU3R5bGU7XG5cbiAgLy8gaWYgY3Vyc29yIGJsaW5raW5nIGlzIG9mZiwgc2V0IHRoZSBzZWNvbmRhcnlDb2xvciB0aGUgc2FtZVxuICAvLyBhcyBwcmltYXJ5Q29sb3IgdG8gcHJldmVudCBjdXJzb3IgYmxpbmtpbmcgaW4gW21pbmldIGVkaXRvcnNcbiAgaWYoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUoJ2N1cnNvci1ibGluay1pbnRlcnZhbCcpICYmXG4gICAgZ2V0Q29uZmlnKCdjdXJzb3JCbGlua0ludGVydmFsJywgJ2N1cnNvci1ibGluay1pbnRlcnZhbCcpID09IDApXG4gICAgYmxpbmtPZmYgPSBPYmplY3QuYXNzaWduKHt9LCBibGlua09uKTtcblxuICAvLyBibGluayBvbiBydWxlXG4gIE9iamVjdC5hc3NpZ24oYmxpbmtPbiwge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvckZvclNjb3BlcyhzZWxlY3Rvciwgc2NvcGVzKSxcbiAgICBwcm9wZXJ0aWVzOiBPYmplY3QuYXNzaWduKHtcbiAgICAgIC8vIGJsaW5rIG9uIGJhY2tncm91bmQgY29sb3JcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogdG9SR0JBU3RyaW5nKGJsaW5rT24uYmFja2dyb3VuZENvbG9yKSxcbiAgICAgIC8vIHB1bHNlIGFuaW1hdGlvbiBkdXJhdGlvblxuICAgICAgJ3RyYW5zaXRpb24tZHVyYXRpb24nOiBgJHtwdWxzZUR1cmF0aW9ufW1zYCxcbiAgICAgIC8vIGN1cnNvciBsaW5lIGZpeFxuICAgICAgLy8gJ3otaW5kZXgnOiBjdXJzb3JMaW5lRml4ID8gMSA6IC0xIC8vIEBUT0RPOiBlbmFibGUgdGhpcyB3aGVuIGEgc29sdXRpb24gaXMgZm91bmQgZm9yICMyMFxuICAgIH0sIGNyZWF0ZUJvcmRlclN0eWxlKGJsaW5rT24pKSxcbiAgfSk7XG4gIC8vIGVuZCBibGluayBvbiBydWxlXG5cbiAgLy8gYmxpbmsgb2ZmIHJ1bGVcbiAgT2JqZWN0LmFzc2lnbihibGlua09mZiwge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvckZvclNjb3BlcyhzZWxlY3Rvciwgc2NvcGVzLCB0cnVlKSxcbiAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgfSk7XG4gIGlmKGJsaW5rT2ZmLmJhY2tncm91bmRDb2xvci5hbHBoYSA9PSAwICYmIChibGlua09mZi5ib3JkZXJXaWR0aCA9PSAwIHx8XG4gICAgYmxpbmtPZmYuYm9yZGVyU3R5bGUgPT0gJ25vbmUnIHx8IGJsaW5rT2ZmLmJvcmRlckNvbG9yLmFscGhhID09IDApKSB7XG4gICAgLy8gYmV0dGVyIGFuaW1hdGlvbiBwZXJmb3JtYW5jZSBieSBhbmltYXRpbmcgb3BhY2l0eVxuICAgIC8vIGlmIGJsaW5rIG9mZiBjdXJzb3IgaXMgaW52aXNpYmxlXG4gICAgYmxpbmtPZmYucHJvcGVydGllcy5vcGFjaXR5ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBPYmplY3QuYXNzaWduKGJsaW5rT2ZmLnByb3BlcnRpZXMsIHtcbiAgICAgIC8vIGJsaW5rIG9mZiBiYWNrZ3JvdW5kIGNvbG9yXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHRvUkdCQVN0cmluZyhibGlua09mZi5iYWNrZ3JvdW5kQ29sb3IpLFxuICAgIH0sIGNyZWF0ZUJvcmRlclN0eWxlKGJsaW5rT2ZmKSk7XG4gIH1cbiAgLy8gZW5kIGJsaW5rIG9mZiBydWxlXG5cbiAgcmV0dXJuIGNyZWF0ZUNTU1J1bGUoYmxpbmtPbikgKyBjcmVhdGVDU1NSdWxlKGJsaW5rT2ZmKTtcbn1cblxuLy8gY3JlYXRlIGEgY3NzIHByb3BlcnRpZXMgb2JqZWN0IGZvciBnaXZlbiBib3JkZXIgcHJvcGVydGllc1xuZnVuY3Rpb24gY3JlYXRlQm9yZGVyU3R5bGUoe2JvcmRlcldpZHRoLCBib3JkZXJTdHlsZSwgYm9yZGVyQ29sb3J9KSB7XG4gIHZhciBib3JkZXJTdHJpbmcgPSBgJHtib3JkZXJXaWR0aH1weCBzb2xpZCAke3RvUkdCQVN0cmluZyhib3JkZXJDb2xvcil9YDtcbiAgc3dpdGNoKGJvcmRlclN0eWxlKSB7XG4gICAgY2FzZSAnYm9yZGVyZWQtYm94JzpcbiAgICAgIC8vIGJvcmRlciBvbiBhbGwgc2lkZXNcbiAgICAgIHJldHVybiB7IGJvcmRlcjogYm9yZGVyU3RyaW5nIH07XG4gICAgY2FzZSAnaS1iZWFtJzpcbiAgICAgIC8vIGJvcmRlciBvbiBsZWZ0IHNpZGVcbiAgICAgIHJldHVybiB7IGJvcmRlcjogJ25vbmUnLCAnYm9yZGVyLWxlZnQnOiBib3JkZXJTdHJpbmcgfTtcbiAgICBjYXNlICd1bmRlcmxpbmUnOlxuICAgICAgLy8gYm9yZGVyIG9uIGJvdHRvbSBzaWRlXG4gICAgICByZXR1cm4geyBib3JkZXI6ICdub25lJywgJ2JvcmRlci1ib3R0b20nOiBib3JkZXJTdHJpbmcgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gbm8gYm9yZGVyXG4gICAgICByZXR1cm4geyBib3JkZXI6ICdub25lJyB9O1xuICB9XG59XG5cbi8vIGNyZWF0ZSBhIGNzcyBydWxlIGZyb20gYSBzZWxlY3RvciBhbmQgYW5cbi8vIG9iamVjdCBjb250YWluaW50IHByb3BlcnR5TmFtZXMgYW5kIHZhbHVlc1xuLy8gb2YgdGhlIGZvcm1cbi8vIDxzZWxlY3Rvcj4ge1xuLy8gICAgPHByb3BlcnR5TmFtZTE+OiA8dmFsdWUxPjtcbi8vICAgIDxwcm9wZXJ0eU5hbWUyPjogPHZhbHVlMj47XG4vLyAgICAuLi5cbi8vIH1cblxuZnVuY3Rpb24gY3JlYXRlQ1NTUnVsZSh7c2VsZWN0b3IsIHByb3BlcnRpZXN9KSB7XG4gIHJldHVybiBgJHtzZWxlY3Rvcn0geyAke09iamVjdC5rZXlzKHByb3BlcnRpZXMpLm1hcCgoa2V5KSA9PiBgJHtrZXl9OiAke3Byb3BlcnRpZXNba2V5XX07YCkuam9pbignJyl9IH1gO1xufVxuXG4vLyBjcmVhdGVzIGEgY3NzIHNlbGVjdG9yIGZvciB0aGUgZ2l2ZW4gc2NvcGVzXG4vLyBAcGFyYW0gYmFzZTogc2VsZWN0b3IgdGhhdCBzZWxlY3RzIHRoZSBhdG9tLXRleHQtZWRpdG9yIGVsZW1lbnRcbi8vIEBwYXJhbSBzY29wZXM6IGFycmF5IG9mIHNjb3BlcyB0byBzZWxlY3Rcbi8vIEBwYXJhbSBibGlua09mZjogY3JlYXRlIGEgYmxpbmstb2ZmIHNlbGVjdG9yP1xuZnVuY3Rpb24gc2VsZWN0b3JGb3JTY29wZXMoYmFzZSwgc2NvcGVzLCBibGlua09mZiA9ICcnKSB7XG4gIHZhciBzZWxlY3RvcnMgPSBbXTtcblxuICBmdW5jdGlvbiBncmFtbWFyU2VsZWN0b3JzRm9yU2NvcGVOYW1lKHNjb3BlTmFtZSkge1xuICAgIHJldHVybiBzY29wZU5hbWUuc3BsaXQoJy4nKS5tYXAoc2NvcGUgPT4gYFtkYXRhLWdyYW1tYXJ+PVwiJHtzY29wZX1cIl1gKS5qb2luKCcnKTtcbiAgfVxuXG4gIGlmKGJsaW5rT2ZmKSBibGlua09mZiA9ICcuYmxpbmstb2ZmJztcblxuICBmb3IobGV0IHNjb3BlTmFtZSBvZiBzY29wZXMpIHtcbiAgICBsZXQgZ3JhbW1hclNlbGVjdG9ycyA9IHNjb3BlTmFtZSA9PSAnKicgPyAnJyA6IGdyYW1tYXJTZWxlY3RvcnNGb3JTY29wZU5hbWUoc2NvcGVOYW1lKTtcbiAgICBzZWxlY3RvcnMucHVzaChgJHtiYXNlfSR7Z3JhbW1hclNlbGVjdG9yc30uZWRpdG9yIC5jdXJzb3JzJHtibGlua09mZn0gLmN1cnNvcmApO1xuICB9XG4gIHJldHVybiBzZWxlY3RvcnMuam9pbignLCcpO1xufVxuXG4vLyBhZGQgYSBjdXN0b20gY3Vyc29yIHRvIHRoZSBjb25maWcuIGFuIGVhc3lcbi8vIHNob3J0Y3V0IHdoZW4geW91IHdhbnQgdG8gZGVmaW5lIGEgbmV3IGN1cnNvciB0eXBlXG5mdW5jdGlvbiBhZGRDdXN0b21DdXJzb3IoKSB7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUoZ2V0Q29uZmlnKGBjdXN0b20tJHtpfWApKSBpKys7XG4gIHNldENvbmZpZyhgY3VzdG9tLSR7aX1gLCBnZXRHbG9iYWxDb25maWcoKSk7XG59XG5cbi8vIHB1YmxpYyBBUElcblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBCbG9ja0N1cnNvciA9IHtcbmNvbnN0IGNvbmZpZyA9IHtcbiAgZ2xvYmFsOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgc2NvcGVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IFsgJyonIF0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6ICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgIH0sXG4gICAgICBibGlua09uOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB7XG4gICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgICAgZGVmYXVsdDogJyMzOTM5MzknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyU3R5bGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ25vbmUnLFxuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICAnbm9uZScsXG4gICAgICAgICAgICAgICdib3JkZXJlZC1ib3gnLFxuICAgICAgICAgICAgICAnaS1iZWFtJyxcbiAgICAgICAgICAgICAgJ3VuZGVybGluZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyQ29sb3I6IHtcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYmxpbmtPZmY6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyU3R5bGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ25vbmUnLFxuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICAnbm9uZScsXG4gICAgICAgICAgICAgICdib3JkZXJlZC1ib3gnLFxuICAgICAgICAgICAgICAnaS1iZWFtJyxcbiAgICAgICAgICAgICAgJ3VuZGVybGluZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyQ29sb3I6IHtcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHVsc2VEdXJhdGlvbjoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIG1pbmltdW06IDAsXG4gICAgICB9LFxuICAgICAgY3Vyc29yTGluZUZpeDoge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RlbXBvcmFyaWx5IGlnbm9yZWQgKGFsd2F5cyB0cnVlKSBiZWNhdXNlIG9mIGFuIGlzc3VlIHdpdGggdGhlIHRpbGUgcmVuZGVyaW5nIGludHJvZHVjZWQgaW4gQXRvbSAwLjIwOS4wLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuXG52YXIgZGlzcG9zYWJsZXM7XG5cbmZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAvLyB3YWl0IGZvciBjdXJzb3ItYmxpbmstaW50ZXJ2YWwgcGFja2FnZSB0byBhY3RpdmF0ZVxuICAvLyBpZiBpdCBpcyBsb2FkZWRcbiAgUHJvbWlzZS5yZXNvbHZlKFxuICAgIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdjdXJzb3ItYmxpbmstaW50ZXJ2YWwnKSAmJlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2N1cnNvci1ibGluay1pbnRlcnZhbCcpXG4gICkudGhlbihmdW5jdGlvbiBnbygpIHtcbiAgICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgc2V0dXBTdHlsZXNoZWV0KCksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdibG9jay1jdXJzb3InLCB1cGRhdGVDdXJzb3JTdHlsZXMpLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2Jsb2NrLWN1cnNvcjpuZXctY3VzdG9tLWN1cnNvcicsIGFkZEN1c3RvbUN1cnNvcilcbiAgICApO1xuICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgZGlzcG9zYWJsZXMgPSBudWxsO1xufVxuXG5leHBvcnQge2NvbmZpZywgYWN0aXZhdGUsIGRlYWN0aXZhdGV9O1xuIl19
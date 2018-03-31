Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fontsSetFontSize = require('./fonts/set-font-size');

var _fontsSetFontSize2 = _interopRequireDefault(_fontsSetFontSize);

var _helperToggleClassName = require('./helper/toggle-class-name');

var _helperToggleClassName2 = _interopRequireDefault(_helperToggleClassName);

require('./colors');

require('./fonts');

require('./tab-bar');

require('./user-interface');

'use babel';

var classNames = {
    // Fonts
    'amu-paint-cursor': atom.config.get('atom-material-ui.colors.paintCursor'),

    // Tabs settings
    'amu-compact-tab-bar': atom.config.get('atom-material-ui.tabs.compactTabs'),
    'amu-no-tab-min-width': atom.config.get('atom-material-ui.tabs.noTabMinWidth'),
    'amu-tinted-tab-bar': atom.config.get('atom-material-ui.tabs.tintedTabBar'),

    // General UI settings
    'amu-use-animations': atom.config.get('atom-material-ui.ui.useAnimations'),
    'amu-panel-contrast': atom.config.get('atom-material-ui.ui.panelContrast'),
    'amu-panel-shadows': atom.config.get('atom-material-ui.ui.panelShadows')
};

exports['default'] = {
    activate: function activate() {
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, classNames[className]);
        });

        (0, _fontsSetFontSize2['default'])(atom.config.get('atom-material-ui.fonts.fontSize'));
    },

    deactivate: function deactivate() {
        // Reset all the things!
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, false);
        });
        (0, _fontsSetFontSize2['default'])(null);
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Z0NBRXdCLHVCQUF1Qjs7OztxQ0FDbkIsNEJBQTRCOzs7O1FBQ2pELFVBQVU7O1FBQ1YsU0FBUzs7UUFDVCxXQUFXOztRQUNYLGtCQUFrQjs7QUFQekIsV0FBVyxDQUFDOztBQVNaLElBQU0sVUFBVSxHQUFHOztBQUVmLHNCQUFrQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDOzs7QUFHMUUseUJBQXFCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUM7QUFDM0UsMEJBQXNCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUM7QUFDOUUsd0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUM7OztBQUczRSx3QkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQztBQUMxRSx3QkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQztBQUMxRSx1QkFBbUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQztDQUMzRSxDQUFDOztxQkFFYTtBQUNYLFlBQVEsRUFBQSxvQkFBRztBQUNQLGNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUzttQkFDckMsd0NBQWdCLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7U0FBQyxDQUNyRCxDQUFDOztBQUVGLDJDQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztLQUNuRTs7QUFFRCxjQUFVLEVBQUEsc0JBQUc7O0FBRVQsY0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO21CQUFJLHdDQUFnQixTQUFTLEVBQUUsS0FBSyxDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ2hGLDJDQUFZLElBQUksQ0FBQyxDQUFDO0tBQ3JCO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBzZXRGb250U2l6ZSBmcm9tICcuL2ZvbnRzL3NldC1mb250LXNpemUnO1xuaW1wb3J0IHRvZ2dsZUNsYXNzTmFtZSBmcm9tICcuL2hlbHBlci90b2dnbGUtY2xhc3MtbmFtZSc7XG5pbXBvcnQgJy4vY29sb3JzJztcbmltcG9ydCAnLi9mb250cyc7XG5pbXBvcnQgJy4vdGFiLWJhcic7XG5pbXBvcnQgJy4vdXNlci1pbnRlcmZhY2UnO1xuXG5jb25zdCBjbGFzc05hbWVzID0ge1xuICAgIC8vIEZvbnRzXG4gICAgJ2FtdS1wYWludC1jdXJzb3InOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLnBhaW50Q3Vyc29yJyksXG5cbiAgICAvLyBUYWJzIHNldHRpbmdzXG4gICAgJ2FtdS1jb21wYWN0LXRhYi1iYXInOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy5jb21wYWN0VGFicycpLFxuICAgICdhbXUtbm8tdGFiLW1pbi13aWR0aCc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS50YWJzLm5vVGFiTWluV2lkdGgnKSxcbiAgICAnYW11LXRpbnRlZC10YWItYmFyJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMudGludGVkVGFiQmFyJyksXG5cbiAgICAvLyBHZW5lcmFsIFVJIHNldHRpbmdzXG4gICAgJ2FtdS11c2UtYW5pbWF0aW9ucyc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS51c2VBbmltYXRpb25zJyksXG4gICAgJ2FtdS1wYW5lbC1jb250cmFzdCc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS5wYW5lbENvbnRyYXN0JyksXG4gICAgJ2FtdS1wYW5lbC1zaGFkb3dzJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnVpLnBhbmVsU2hhZG93cycpLFxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFjdGl2YXRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiAoXG4gICAgICAgICAgICB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBjbGFzc05hbWVzW2NsYXNzTmFtZV0pKSxcbiAgICAgICAgKTtcblxuICAgICAgICBzZXRGb250U2l6ZShhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkuZm9udHMuZm9udFNpemUnKSk7XG4gICAgfSxcblxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIC8vIFJlc2V0IGFsbCB0aGUgdGhpbmdzIVxuICAgICAgICBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBmYWxzZSkpO1xuICAgICAgICBzZXRGb250U2l6ZShudWxsKTtcbiAgICB9LFxufTtcbiJdfQ==
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helperToggleClassName = require('../helper/toggle-class-name');

var _helperToggleClassName2 = _interopRequireDefault(_helperToggleClassName);

'use babel';

atom.config.observe('atom-material-ui.tabs.tintedTabBar', function (value) {
    (0, _helperToggleClassName2['default'])('amu-tinted-tab-bar', value);
});

atom.config.observe('atom-material-ui.tabs.compactTabs', function (value) {
    (0, _helperToggleClassName2['default'])('amu-compact-tab-bar', value);
});

atom.config.observe('atom-material-ui.tabs.noTabMinWidth', function (value) {
    (0, _helperToggleClassName2['default'])('amu-no-tab-min-width', value);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvdGFiLWJhci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztxQ0FFNEIsNkJBQTZCOzs7O0FBRnpELFdBQVcsQ0FBQzs7QUFJWixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNqRSw0Q0FBZ0Isb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7Q0FDaEQsQ0FBQyxDQUFDOztBQUVILElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2hFLDRDQUFnQixxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztDQUNqRCxDQUFDLENBQUM7O0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUNBQXFDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDbEUsNENBQWdCLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQ2xELENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL3RhYi1iYXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHRvZ2dsZUNsYXNzTmFtZSBmcm9tICcuLi9oZWxwZXIvdG9nZ2xlLWNsYXNzLW5hbWUnO1xuXG5hdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMudGludGVkVGFiQmFyJywgKHZhbHVlKSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3NOYW1lKCdhbXUtdGludGVkLXRhYi1iYXInLCB2YWx1ZSk7XG59KTtcblxuYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS1tYXRlcmlhbC11aS50YWJzLmNvbXBhY3RUYWJzJywgKHZhbHVlKSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3NOYW1lKCdhbXUtY29tcGFjdC10YWItYmFyJywgdmFsdWUpO1xufSk7XG5cbmF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy5ub1RhYk1pbldpZHRoJywgKHZhbHVlKSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3NOYW1lKCdhbXUtbm8tdGFiLW1pbi13aWR0aCcsIHZhbHVlKTtcbn0pO1xuIl19
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libFontsSetFontSize = require('../../lib/fonts/set-font-size');

var _libFontsSetFontSize2 = _interopRequireDefault(_libFontsSetFontSize);

'use babel';

describe('Font size setter', function () {
    var root = document.documentElement;

    it('should be able to change root element\'s font-size', function () {
        expect(root.style.fontSize).toBe('');
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
    });

    it('should be able to unset root element\'s font-size', function () {
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
        (0, _libFontsSetFontSize2['default'])(null);
        expect(root.style.fontSize).toBe('');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL2ZvbnRzL3NldC1mb250LXNpemUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzttQ0FFd0IsK0JBQStCOzs7O0FBRnZELFdBQVcsQ0FBQzs7QUFJWixRQUFRLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtBQUMvQixRQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDOztBQUV0QyxNQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBTTtBQUMzRCxjQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsOENBQVksRUFBRSxDQUFDLENBQUM7QUFDaEIsY0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUMxRCw4Q0FBWSxFQUFFLENBQUMsQ0FBQztBQUNoQixjQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsOENBQVksSUFBSSxDQUFDLENBQUM7QUFDbEIsY0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9mb250cy9zZXQtZm9udC1zaXplLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHNldEZvbnRTaXplIGZyb20gJy4uLy4uL2xpYi9mb250cy9zZXQtZm9udC1zaXplJztcblxuZGVzY3JpYmUoJ0ZvbnQgc2l6ZSBzZXR0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBjaGFuZ2Ugcm9vdCBlbGVtZW50XFwncyBmb250LXNpemUnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyb290LnN0eWxlLmZvbnRTaXplKS50b0JlKCcnKTtcbiAgICAgICAgc2V0Rm9udFNpemUoMjIpO1xuICAgICAgICBleHBlY3Qocm9vdC5zdHlsZS5mb250U2l6ZSkudG9CZSgnMjJweCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHVuc2V0IHJvb3QgZWxlbWVudFxcJ3MgZm9udC1zaXplJywgKCkgPT4ge1xuICAgICAgICBzZXRGb250U2l6ZSgyMik7XG4gICAgICAgIGV4cGVjdChyb290LnN0eWxlLmZvbnRTaXplKS50b0JlKCcyMnB4Jyk7XG4gICAgICAgIHNldEZvbnRTaXplKG51bGwpO1xuICAgICAgICBleHBlY3Qocm9vdC5zdHlsZS5mb250U2l6ZSkudG9CZSgnJyk7XG4gICAgfSk7XG59KTtcbiJdfQ==
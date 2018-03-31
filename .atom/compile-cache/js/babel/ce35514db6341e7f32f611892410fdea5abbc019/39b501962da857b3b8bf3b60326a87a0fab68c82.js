function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libHelperToCamelCase = require('../../lib/helper/to-camel-case');

var _libHelperToCamelCase2 = _interopRequireDefault(_libHelperToCamelCase);

'use babel';

describe('camelCaseHelper', function () {
    it('should convert spaces to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello world')).toEqual('helloWorld');
    });

    it('should convert lisp-case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello-world')).toEqual('helloWorld');
    });

    it('should convert snake_case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello_world')).toEqual('helloWorld');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL2hlbHBlci90by1jYW1lbC1jYXNlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0NBRXdCLGdDQUFnQzs7OztBQUZ4RCxXQUFXLENBQUM7O0FBSVosUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDOUIsTUFBRSxDQUFDLG9DQUFvQyxFQUFFLFlBQU07QUFDM0MsY0FBTSxDQUFDLHVDQUFZLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsdUNBQXVDLEVBQUUsWUFBTTtBQUM5QyxjQUFNLENBQUMsdUNBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFNO0FBQy9DLGNBQU0sQ0FBQyx1Q0FBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvaGVscGVyL3RvLWNhbWVsLWNhc2Utc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgdG9DYW1lbENhc2UgZnJvbSAnLi4vLi4vbGliL2hlbHBlci90by1jYW1lbC1jYXNlJztcblxuZGVzY3JpYmUoJ2NhbWVsQ2FzZUhlbHBlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgc3BhY2VzIHRvIGNhbWVsQ2FzZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvQ2FtZWxDYXNlKCdoZWxsbyB3b3JsZCcpKS50b0VxdWFsKCdoZWxsb1dvcmxkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbGlzcC1jYXNlIHRvIGNhbWVsQ2FzZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvQ2FtZWxDYXNlKCdoZWxsby13b3JsZCcpKS50b0VxdWFsKCdoZWxsb1dvcmxkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgc25ha2VfY2FzZSB0byBjYW1lbENhc2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b0NhbWVsQ2FzZSgnaGVsbG9fd29ybGQnKSkudG9FcXVhbCgnaGVsbG9Xb3JsZCcpO1xuICAgIH0pO1xufSk7XG4iXX0=
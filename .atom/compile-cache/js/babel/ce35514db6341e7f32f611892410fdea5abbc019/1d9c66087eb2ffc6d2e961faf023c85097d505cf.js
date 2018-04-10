Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getMessage = getMessage;
exports.getLinter = getLinter;
exports.dispatchCommand = dispatchCommand;

function getMessage(type, filePath, range) {
  if (type === undefined) type = 'Error';

  var message = {
    type: type,
    text: 'Some Message',
    filePath: filePath,
    range: range,
    version: 1
  };
  return message;
}

function getLinter() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'some' : arguments[0];

  return {
    name: name,
    grammarScopes: [],
    lint: function lint() {}
  };
}

function dispatchCommand(target, commandName) {
  atom.commands.dispatch(atom.views.getView(target), commandName);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvc3BlYy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFTyxTQUFTLFVBQVUsQ0FBQyxJQUFhLEVBQVksUUFBaUIsRUFBRSxLQUFjLEVBQVU7TUFBcEUsSUFBYSxnQkFBYixJQUFhLEdBQUcsT0FBTzs7QUFDaEQsTUFBTSxPQUFPLEdBQUc7QUFDZCxRQUFJLEVBQUosSUFBSTtBQUNKLFFBQUksRUFBRSxjQUFjO0FBQ3BCLFlBQVEsRUFBUixRQUFRO0FBQ1IsU0FBSyxFQUFMLEtBQUs7QUFDTCxXQUFPLEVBQUUsQ0FBQztHQUNYLENBQUE7QUFDRCxTQUFPLE9BQU8sQ0FBQTtDQUNmOztBQUVNLFNBQVMsU0FBUyxHQUFpQztNQUFoQyxJQUFhLHlEQUFHLE1BQU07O0FBQzlDLFNBQU87QUFDTCxRQUFJLEVBQUosSUFBSTtBQUNKLGlCQUFhLEVBQUUsRUFBRTtBQUNqQixRQUFJLEVBQUEsZ0JBQUcsRUFBRTtHQUNWLENBQUE7Q0FDRjs7QUFFTSxTQUFTLGVBQWUsQ0FBQyxNQUFjLEVBQUUsV0FBbUIsRUFBRTtBQUNuRSxNQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQTtDQUNoRSIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L3NwZWMvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlKHR5cGU6ID9zdHJpbmcgPSAnRXJyb3InLCBmaWxlUGF0aDogP3N0cmluZywgcmFuZ2U6ID9PYmplY3QpOiBPYmplY3Qge1xuICBjb25zdCBtZXNzYWdlID0ge1xuICAgIHR5cGUsXG4gICAgdGV4dDogJ1NvbWUgTWVzc2FnZScsXG4gICAgZmlsZVBhdGgsXG4gICAgcmFuZ2UsXG4gICAgdmVyc2lvbjogMSxcbiAgfVxuICByZXR1cm4gbWVzc2FnZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGludGVyKG5hbWU6ID9zdHJpbmcgPSAnc29tZScpOiBPYmplY3Qge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgbGludCgpIHt9LFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaENvbW1hbmQodGFyZ2V0OiBPYmplY3QsIGNvbW1hbmROYW1lOiBzdHJpbmcpIHtcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcodGFyZ2V0KSwgY29tbWFuZE5hbWUpXG59XG4iXX0=
(function() {
  var slice = [].slice;

  module.exports = function() {
    return {
      bindings: {},
      emit: function() {
        var _bindings, _callback, args, event, i, len;
        event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        for (i = 0, len = _bindings.length; i < len; i++) {
          _callback = _bindings[i];
          _callback.apply(null, args);
        }
      },
      on: function(event, callback) {
        if (!this.bindings[event]) {
          this.bindings[event] = [];
        }
        this.bindings[event].push(callback);
        return callback;
      },
      off: function(event, callback) {
        var _binding, _bindings, _i;
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        _i = _bindings.length;
        while (_i-- && (_binding = _bindings[_i])) {
          if (_binding === callback) {
            _bindings.splice(_i, 1);
          }
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL21vZHVsZXMvRW1pdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0k7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7V0FDYjtNQUFBLFFBQUEsRUFBVSxFQUFWO01BRUEsSUFBQSxFQUFNLFNBQUE7QUFDRixZQUFBO1FBREcsc0JBQU87UUFDVixJQUFBLENBQWMsQ0FBQSxTQUFBLEdBQVksSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQXRCLENBQWQ7QUFBQSxpQkFBQTs7QUFDQSxhQUFBLDJDQUFBOztVQUFBLFNBQVMsQ0FBQyxLQUFWLENBQWdCLElBQWhCLEVBQXNCLElBQXRCO0FBQUE7TUFGRSxDQUZOO01BT0EsRUFBQSxFQUFJLFNBQUMsS0FBRCxFQUFRLFFBQVI7UUFDQSxJQUFBLENBQTZCLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUF2QztVQUFBLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUFWLEdBQW1CLEdBQW5COztRQUNBLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUFNLENBQUMsSUFBakIsQ0FBc0IsUUFBdEI7QUFDQSxlQUFPO01BSFAsQ0FQSjtNQVlBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxRQUFSO0FBQ0QsWUFBQTtRQUFBLElBQUEsQ0FBYyxDQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsUUFBUyxDQUFBLEtBQUEsQ0FBdEIsQ0FBZDtBQUFBLGlCQUFBOztRQUVBLEVBQUEsR0FBSyxTQUFTLENBQUM7QUFBUSxlQUFNLEVBQUEsRUFBQSxJQUFTLENBQUEsUUFBQSxHQUFXLFNBQVUsQ0FBQSxFQUFBLENBQXJCLENBQWY7VUFDbkIsSUFBRyxRQUFBLEtBQVksUUFBZjtZQUE2QixTQUFTLENBQUMsTUFBVixDQUFpQixFQUFqQixFQUFxQixDQUFyQixFQUE3Qjs7UUFEbUI7TUFIdEIsQ0FaTDs7RUFEYTtBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgRW1pdHRlclxuIyAgYSByZWFsbHkgbGlnaHR3ZWlnaHQgdGFrZSBvbiBhbiBFbWl0dGVyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gLT5cbiAgICAgICAgYmluZGluZ3M6IHt9XG5cbiAgICAgICAgZW1pdDogKGV2ZW50LCBhcmdzLi4uKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBfYmluZGluZ3MgPSBAYmluZGluZ3NbZXZlbnRdXG4gICAgICAgICAgICBfY2FsbGJhY2suYXBwbHkgbnVsbCwgYXJncyBmb3IgX2NhbGxiYWNrIGluIF9iaW5kaW5nc1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgb246IChldmVudCwgY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBAYmluZGluZ3NbZXZlbnRdID0gW10gdW5sZXNzIEBiaW5kaW5nc1tldmVudF1cbiAgICAgICAgICAgIEBiaW5kaW5nc1tldmVudF0ucHVzaCBjYWxsYmFja1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrXG5cbiAgICAgICAgb2ZmOiAoZXZlbnQsIGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBfYmluZGluZ3MgPSBAYmluZGluZ3NbZXZlbnRdXG5cbiAgICAgICAgICAgIF9pID0gX2JpbmRpbmdzLmxlbmd0aDsgd2hpbGUgX2ktLSBhbmQgX2JpbmRpbmcgPSBfYmluZGluZ3NbX2ldXG4gICAgICAgICAgICAgICAgaWYgX2JpbmRpbmcgaXMgY2FsbGJhY2sgdGhlbiBfYmluZGluZ3Muc3BsaWNlIF9pLCAxXG4gICAgICAgICAgICByZXR1cm5cbiJdfQ==

(function() {
  var event, mouseEvent, objectCenterCoordinates;

  event = function(type, properties) {
    if (properties == null) {
      properties = {};
    }
    return new Event(type, properties);
  };

  mouseEvent = function(type, properties) {
    var defaults, k, v;
    defaults = {
      bubbles: true,
      cancelable: type !== "mousemove",
      view: window,
      detail: 0,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: void 0
    };
    for (k in defaults) {
      v = defaults[k];
      if (properties[k] == null) {
        properties[k] = v;
      }
    }
    return new MouseEvent(type, properties);
  };

  objectCenterCoordinates = function(target) {
    var height, left, ref, top, width;
    ref = target.getBoundingClientRect(), top = ref.top, left = ref.left, width = ref.width, height = ref.height;
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  };

  module.exports = {
    objectCenterCoordinates: objectCenterCoordinates,
    mouseEvent: mouseEvent,
    event: event
  };

  ['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function(key) {
    return module.exports[key] = function(target, x, y, cx, cy, btn) {
      var ref;
      if (!((x != null) && (y != null))) {
        ref = objectCenterCoordinates(target), x = ref.x, y = ref.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return target.dispatchEvent(mouseEvent(key, {
        target: target,
        pageX: x,
        pageY: y,
        clientX: cx,
        clientY: cy,
        button: btn
      }));
    };
  });

  module.exports.mousewheel = function(target, deltaX, deltaY) {
    if (deltaX == null) {
      deltaX = 0;
    }
    if (deltaY == null) {
      deltaY = 0;
    }
    return target.dispatchEvent(mouseEvent('mousewheel', {
      target: target,
      deltaX: deltaX,
      deltaY: deltaY
    }));
  };

  module.exports.change = function(target) {
    return target.dispatchEvent(event('change', {
      target: target
    }));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvZXZlbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLFVBQVA7O01BQU8sYUFBVzs7V0FBVyxJQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWjtFQUE3Qjs7RUFFUixVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sVUFBUDtBQUNYLFFBQUE7SUFBQSxRQUFBLEdBQVc7TUFDVCxPQUFBLEVBQVMsSUFEQTtNQUVULFVBQUEsRUFBYSxJQUFBLEtBQVUsV0FGZDtNQUdULElBQUEsRUFBTSxNQUhHO01BSVQsTUFBQSxFQUFRLENBSkM7TUFLVCxLQUFBLEVBQU8sQ0FMRTtNQU1ULEtBQUEsRUFBTyxDQU5FO01BT1QsT0FBQSxFQUFTLENBUEE7TUFRVCxPQUFBLEVBQVMsQ0FSQTtNQVNULE9BQUEsRUFBUyxLQVRBO01BVVQsTUFBQSxFQUFRLEtBVkM7TUFXVCxRQUFBLEVBQVUsS0FYRDtNQVlULE9BQUEsRUFBUyxLQVpBO01BYVQsTUFBQSxFQUFRLENBYkM7TUFjVCxhQUFBLEVBQWUsTUFkTjs7QUFpQlgsU0FBQSxhQUFBOztVQUErQztRQUEvQyxVQUFXLENBQUEsQ0FBQSxDQUFYLEdBQWdCOztBQUFoQjtXQUVJLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUIsVUFBakI7RUFwQk87O0VBc0JiLHVCQUFBLEdBQTBCLFNBQUMsTUFBRDtBQUN4QixRQUFBO0lBQUEsTUFBNkIsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBN0IsRUFBQyxhQUFELEVBQU0sZUFBTixFQUFZLGlCQUFaLEVBQW1CO1dBQ25CO01BQUMsQ0FBQSxFQUFHLElBQUEsR0FBTyxLQUFBLEdBQVEsQ0FBbkI7TUFBc0IsQ0FBQSxFQUFHLEdBQUEsR0FBTSxNQUFBLEdBQVMsQ0FBeEM7O0VBRndCOztFQUkxQixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFDLHlCQUFBLHVCQUFEO0lBQTBCLFlBQUEsVUFBMUI7SUFBc0MsT0FBQSxLQUF0Qzs7O0VBRWpCLENBQUMsV0FBRCxFQUFjLFdBQWQsRUFBMkIsU0FBM0IsRUFBc0MsT0FBdEMsQ0FBOEMsQ0FBQyxPQUEvQyxDQUF1RCxTQUFDLEdBQUQ7V0FDckQsTUFBTSxDQUFDLE9BQVEsQ0FBQSxHQUFBLENBQWYsR0FBc0IsU0FBQyxNQUFELEVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxFQUFmLEVBQW1CLEVBQW5CLEVBQXVCLEdBQXZCO0FBQ3BCLFVBQUE7TUFBQSxJQUFBLENBQUEsQ0FBK0MsV0FBQSxJQUFPLFdBQXRELENBQUE7UUFBQSxNQUFRLHVCQUFBLENBQXdCLE1BQXhCLENBQVIsRUFBQyxTQUFELEVBQUcsVUFBSDs7TUFFQSxJQUFBLENBQUEsQ0FBTyxZQUFBLElBQVEsWUFBZixDQUFBO1FBQ0UsRUFBQSxHQUFLO1FBQ0wsRUFBQSxHQUFLLEVBRlA7O2FBSUEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsVUFBQSxDQUFXLEdBQVgsRUFBZ0I7UUFBQyxRQUFBLE1BQUQ7UUFBUyxLQUFBLEVBQU8sQ0FBaEI7UUFBbUIsS0FBQSxFQUFPLENBQTFCO1FBQTZCLE9BQUEsRUFBUyxFQUF0QztRQUEwQyxPQUFBLEVBQVMsRUFBbkQ7UUFBdUQsTUFBQSxFQUFRLEdBQS9EO09BQWhCLENBQXJCO0lBUG9CO0VBRCtCLENBQXZEOztFQVVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBZixHQUE0QixTQUFDLE1BQUQsRUFBUyxNQUFULEVBQW1CLE1BQW5COztNQUFTLFNBQU87OztNQUFHLFNBQU87O1dBQ3BELE1BQU0sQ0FBQyxhQUFQLENBQXFCLFVBQUEsQ0FBVyxZQUFYLEVBQXlCO01BQUMsUUFBQSxNQUFEO01BQVMsUUFBQSxNQUFUO01BQWlCLFFBQUEsTUFBakI7S0FBekIsQ0FBckI7RUFEMEI7O0VBRzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBZixHQUF3QixTQUFDLE1BQUQ7V0FDdEIsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsS0FBQSxDQUFNLFFBQU4sRUFBZ0I7TUFBQyxRQUFBLE1BQUQ7S0FBaEIsQ0FBckI7RUFEc0I7QUEzQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiZXZlbnQgPSAodHlwZSwgcHJvcGVydGllcz17fSkgLT4gbmV3IEV2ZW50IHR5cGUsIHByb3BlcnRpZXNcblxubW91c2VFdmVudCA9ICh0eXBlLCBwcm9wZXJ0aWVzKSAtPlxuICBkZWZhdWx0cyA9IHtcbiAgICBidWJibGVzOiB0cnVlXG4gICAgY2FuY2VsYWJsZTogKHR5cGUgaXNudCBcIm1vdXNlbW92ZVwiKVxuICAgIHZpZXc6IHdpbmRvd1xuICAgIGRldGFpbDogMFxuICAgIHBhZ2VYOiAwXG4gICAgcGFnZVk6IDBcbiAgICBjbGllbnRYOiAwXG4gICAgY2xpZW50WTogMFxuICAgIGN0cmxLZXk6IGZhbHNlXG4gICAgYWx0S2V5OiBmYWxzZVxuICAgIHNoaWZ0S2V5OiBmYWxzZVxuICAgIG1ldGFLZXk6IGZhbHNlXG4gICAgYnV0dG9uOiAwXG4gICAgcmVsYXRlZFRhcmdldDogdW5kZWZpbmVkXG4gIH1cblxuICBwcm9wZXJ0aWVzW2tdID0gdiBmb3Igayx2IG9mIGRlZmF1bHRzIHdoZW4gbm90IHByb3BlcnRpZXNba10/XG5cbiAgbmV3IE1vdXNlRXZlbnQgdHlwZSwgcHJvcGVydGllc1xuXG5vYmplY3RDZW50ZXJDb29yZGluYXRlcyA9ICh0YXJnZXQpIC0+XG4gIHt0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHR9ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHt4OiBsZWZ0ICsgd2lkdGggLyAyLCB5OiB0b3AgKyBoZWlnaHQgLyAyfVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtvYmplY3RDZW50ZXJDb29yZGluYXRlcywgbW91c2VFdmVudCwgZXZlbnR9XG5cblsnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJywgJ2NsaWNrJ10uZm9yRWFjaCAoa2V5KSAtPlxuICBtb2R1bGUuZXhwb3J0c1trZXldID0gKHRhcmdldCwgeCwgeSwgY3gsIGN5LCBidG4pIC0+XG4gICAge3gseX0gPSBvYmplY3RDZW50ZXJDb29yZGluYXRlcyh0YXJnZXQpIHVubGVzcyB4PyBhbmQgeT9cblxuICAgIHVubGVzcyBjeD8gYW5kIGN5P1xuICAgICAgY3ggPSB4XG4gICAgICBjeSA9IHlcblxuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQga2V5LCB7dGFyZ2V0LCBwYWdlWDogeCwgcGFnZVk6IHksIGNsaWVudFg6IGN4LCBjbGllbnRZOiBjeSwgYnV0dG9uOiBidG59KVxuXG5tb2R1bGUuZXhwb3J0cy5tb3VzZXdoZWVsID0gKHRhcmdldCwgZGVsdGFYPTAsIGRlbHRhWT0wKSAtPlxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50ICdtb3VzZXdoZWVsJywge3RhcmdldCwgZGVsdGFYLCBkZWx0YVl9KVxuXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSAodGFyZ2V0KSAtPlxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudCAnY2hhbmdlJywge3RhcmdldH0pXG4iXX0=

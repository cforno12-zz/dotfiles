(function() {
  beforeEach(function() {
    var compare;
    compare = function(a, b, p) {
      return Math.abs(b - a) < (Math.pow(10, -p) / 2);
    };
    return this.addMatchers({
      toBeComponentArrayCloseTo: function(arr, precision) {
        var notText;
        if (precision == null) {
          precision = 0;
        }
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be an array whose values are close to " + (jasmine.pp(arr)) + " with a precision of " + precision;
          };
        })(this);
        if (this.actual.length !== arr.length) {
          return false;
        }
        return this.actual.every(function(value, i) {
          return compare(value, arr[i], precision);
        });
      },
      toBeValid: function() {
        var notText;
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a valid color";
          };
        })(this);
        return this.actual.isValid();
      },
      toBeColor: function(colorOrRed, green, blue, alpha) {
        var color, hex, notText, red;
        if (green == null) {
          green = 0;
        }
        if (blue == null) {
          blue = 0;
        }
        if (alpha == null) {
          alpha = 1;
        }
        color = (function() {
          switch (typeof colorOrRed) {
            case 'object':
              return colorOrRed;
            case 'number':
              return {
                red: colorOrRed,
                green: green,
                blue: blue,
                alpha: alpha
              };
            case 'string':
              colorOrRed = colorOrRed.replace(/#|0x/, '');
              hex = parseInt(colorOrRed, 16);
              switch (colorOrRed.length) {
                case 8:
                  alpha = (hex >> 24 & 0xff) / 255;
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 6:
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 3:
                  red = (hex >> 8 & 0xf) * 17;
                  green = (hex >> 4 & 0xf) * 17;
                  blue = (hex & 0xf) * 17;
                  break;
                default:
                  red = 0;
                  green = 0;
                  blue = 0;
                  alpha = 1;
              }
              return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
              };
            default:
              return {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1
              };
          }
        })();
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a color equal to " + (jasmine.pp(color));
          };
        })(this);
        return Math.round(this.actual.red) === color.red && Math.round(this.actual.green) === color.green && Math.round(this.actual.blue) === color.blue && compare(this.actual.alpha, color.alpha, 1);
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvbWF0Y2hlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsVUFBQSxDQUFXLFNBQUE7QUFDVCxRQUFBO0lBQUEsT0FBQSxHQUFVLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO2FBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksQ0FBYixDQUFBLEdBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBQyxDQUFkLENBQUEsR0FBbUIsQ0FBcEI7SUFBN0I7V0FFVixJQUFDLENBQUEsV0FBRCxDQUNFO01BQUEseUJBQUEsRUFBMkIsU0FBQyxHQUFELEVBQU0sU0FBTjtBQUN6QixZQUFBOztVQUQrQixZQUFVOztRQUN6QyxPQUFBLEdBQWEsSUFBQyxDQUFBLEtBQUosR0FBZSxNQUFmLEdBQTJCO1FBQ3JDLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxXQUFBLEdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEtBQUMsQ0FBQSxNQUFaLENBQUQsQ0FBWCxHQUFnQyxLQUFoQyxHQUFxQyxPQUFyQyxHQUE2Qyx5Q0FBN0MsR0FBcUYsQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEdBQVgsQ0FBRCxDQUFyRixHQUFzRyx1QkFBdEcsR0FBNkg7VUFBaEk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO1FBRWYsSUFBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEtBQW9CLEdBQUcsQ0FBQyxNQUF4QztBQUFBLGlCQUFPLE1BQVA7O2VBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsU0FBQyxLQUFELEVBQU8sQ0FBUDtpQkFBYSxPQUFBLENBQVEsS0FBUixFQUFlLEdBQUksQ0FBQSxDQUFB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R0FBbkIsQ0FBQSxLQUEyQixLQUFLLENBQUMsR0FBakMsSUFDQSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBbkIsQ0FBQSxLQUE2QixLQUFLLENBQUMsS0FEbkMsSUFFQSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBbkIsQ0FBQSxLQUE0QixLQUFLLENBQUMsSUFGbEMsSUFHQSxPQUFBLENBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFoQixFQUF1QixLQUFLLENBQUMsS0FBN0IsRUFBb0MsQ0FBcEM7TUFyQ1MsQ0FkWDtLQURGO0VBSFMsQ0FBWDtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5iZWZvcmVFYWNoIC0+XG4gIGNvbXBhcmUgPSAoYSxiLHApIC0+IE1hdGguYWJzKGIgLSBhKSA8IChNYXRoLnBvdygxMCwgLXApIC8gMilcblxuICBAYWRkTWF0Y2hlcnNcbiAgICB0b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvOiAoYXJyLCBwcmVjaXNpb249MCkgLT5cbiAgICAgIG5vdFRleHQgPSBpZiBAaXNOb3QgdGhlbiBcIiBub3RcIiBlbHNlIFwiXCJcbiAgICAgIHRoaXMubWVzc2FnZSA9ID0+IFwiRXhwZWN0ZWQgI3tqYXNtaW5lLnBwKEBhY3R1YWwpfSB0byN7bm90VGV4dH0gYmUgYW4gYXJyYXkgd2hvc2UgdmFsdWVzIGFyZSBjbG9zZSB0byAje2phc21pbmUucHAoYXJyKX0gd2l0aCBhIHByZWNpc2lvbiBvZiAje3ByZWNpc2lvbn1cIlxuXG4gICAgICByZXR1cm4gZmFsc2UgaWYgQGFjdHVhbC5sZW5ndGggaXNudCBhcnIubGVuZ3RoXG5cbiAgICAgIEBhY3R1YWwuZXZlcnkgKHZhbHVlLGkpIC0+IGNvbXBhcmUodmFsdWUsIGFycltpXSwgcHJlY2lzaW9uKVxuXG4gICAgdG9CZVZhbGlkOiAtPlxuICAgICAgbm90VGV4dCA9IGlmIEBpc05vdCB0aGVuIFwiIG5vdFwiIGVsc2UgXCJcIlxuICAgICAgdGhpcy5tZXNzYWdlID0gPT4gXCJFeHBlY3RlZCAje2phc21pbmUucHAoQGFjdHVhbCl9IHRvI3tub3RUZXh0fSBiZSBhIHZhbGlkIGNvbG9yXCJcblxuICAgICAgQGFjdHVhbC5pc1ZhbGlkKClcblxuICAgIHRvQmVDb2xvcjogKGNvbG9yT3JSZWQsZ3JlZW49MCxibHVlPTAsYWxwaGE9MSkgLT5cbiAgICAgIGNvbG9yID0gc3dpdGNoIHR5cGVvZiBjb2xvck9yUmVkXG4gICAgICAgIHdoZW4gJ29iamVjdCcgdGhlbiBjb2xvck9yUmVkXG4gICAgICAgIHdoZW4gJ251bWJlcicgdGhlbiB7cmVkOiBjb2xvck9yUmVkLCBncmVlbiwgYmx1ZSwgYWxwaGF9XG4gICAgICAgIHdoZW4gJ3N0cmluZydcbiAgICAgICAgICBjb2xvck9yUmVkID0gY29sb3JPclJlZC5yZXBsYWNlKC8jfDB4LywgJycpXG4gICAgICAgICAgaGV4ID0gcGFyc2VJbnQoY29sb3JPclJlZCwgMTYpXG4gICAgICAgICAgc3dpdGNoIGNvbG9yT3JSZWQubGVuZ3RoXG4gICAgICAgICAgICB3aGVuIDhcbiAgICAgICAgICAgICAgYWxwaGEgPSAoaGV4ID4+IDI0ICYgMHhmZikgLyAyNTVcbiAgICAgICAgICAgICAgcmVkID0gaGV4ID4+IDE2ICYgMHhmZlxuICAgICAgICAgICAgICBncmVlbiA9IGhleCA+PiA4ICYgMHhmZlxuICAgICAgICAgICAgICBibHVlID0gaGV4ICYgMHhmZlxuICAgICAgICAgICAgd2hlbiA2XG4gICAgICAgICAgICAgIHJlZCA9IGhleCA+PiAxNiAmIDB4ZmZcbiAgICAgICAgICAgICAgZ3JlZW4gPSBoZXggPj4gOCAmIDB4ZmZcbiAgICAgICAgICAgICAgYmx1ZSA9IGhleCAmIDB4ZmZcbiAgICAgICAgICAgIHdoZW4gM1xuICAgICAgICAgICAgICByZWQgPSAoaGV4ID4+IDggJiAweGYpICogMTdcbiAgICAgICAgICAgICAgZ3JlZW4gPSAoaGV4ID4+IDQgJiAweGYpICogMTdcbiAgICAgICAgICAgICAgYmx1ZSA9IChoZXggJiAweGYpICogMTdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmVkID0gMFxuICAgICAgICAgICAgICBncmVlbiA9IDBcbiAgICAgICAgICAgICAgYmx1ZSA9IDBcbiAgICAgICAgICAgICAgYWxwaGEgPSAxXG5cbiAgICAgICAgICB7cmVkLCBncmVlbiwgYmx1ZSwgYWxwaGF9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB7cmVkOiAwLCBncmVlbjogMCwgYmx1ZTogMCwgYWxwaGE6IDF9XG5cbiAgICAgIG5vdFRleHQgPSBpZiBAaXNOb3QgdGhlbiBcIiBub3RcIiBlbHNlIFwiXCJcbiAgICAgIHRoaXMubWVzc2FnZSA9ID0+IFwiRXhwZWN0ZWQgI3tqYXNtaW5lLnBwKEBhY3R1YWwpfSB0byN7bm90VGV4dH0gYmUgYSBjb2xvciBlcXVhbCB0byAje2phc21pbmUucHAoY29sb3IpfVwiXG5cbiAgICAgIE1hdGgucm91bmQoQGFjdHVhbC5yZWQpIGlzIGNvbG9yLnJlZCBhbmRcbiAgICAgIE1hdGgucm91bmQoQGFjdHVhbC5ncmVlbikgaXMgY29sb3IuZ3JlZW4gYW5kXG4gICAgICBNYXRoLnJvdW5kKEBhY3R1YWwuYmx1ZSkgaXMgY29sb3IuYmx1ZSBhbmRcbiAgICAgIGNvbXBhcmUoQGFjdHVhbC5hbHBoYSwgY29sb3IuYWxwaGEsIDEpXG4iXX0=

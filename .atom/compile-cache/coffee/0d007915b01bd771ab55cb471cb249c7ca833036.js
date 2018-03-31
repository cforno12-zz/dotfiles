(function() {
  var utils;

  utils = {
    fill: function(str, length, filler) {
      if (filler == null) {
        filler = '0';
      }
      while (str.length < length) {
        str = filler + str;
      }
      return str;
    },
    strip: function(str) {
      return str.replace(/\s+/g, '');
    },
    clamp: function(n) {
      return Math.min(1, Math.max(0, n));
    },
    clampInt: function(n, max) {
      if (max == null) {
        max = 100;
      }
      return Math.min(max, Math.max(0, n));
    },
    insensitive: function(s) {
      return s.split(/(?:)/).map(function(c) {
        return "(?:" + c + "|" + (c.toUpperCase()) + ")";
      }).join('');
    },
    readFloat: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      res = parseFloat(value);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseFloat(vars[value].value);
      }
      return res;
    },
    readInt: function(value, vars, color, base) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseInt(vars[value].value, base);
      }
      return res;
    },
    countLines: function(string) {
      return string.split(/\r\n|\r|\n/g).length;
    },
    readIntOrPercent: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(value) && (vars[value] != null)) {
        color.usedVariables.push(value);
        value = vars[value].value;
      }
      if (value == null) {
        return 0/0;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    },
    readFloatOrPercent: function(amount, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(amount) && (vars[amount] != null)) {
        color.usedVariables.push(amount);
        amount = vars[amount].value;
      }
      if (amount == null) {
        return 0/0;
      }
      if (amount.indexOf('%') !== -1) {
        res = parseFloat(amount) / 100;
      } else {
        res = parseFloat(amount);
      }
      return res;
    },
    findClosingIndex: function(s, startIndex, openingChar, closingChar) {
      var curStr, index, nests;
      if (startIndex == null) {
        startIndex = 0;
      }
      if (openingChar == null) {
        openingChar = "[";
      }
      if (closingChar == null) {
        closingChar = "]";
      }
      index = startIndex;
      nests = 1;
      while (nests && index < s.length) {
        curStr = s.substr(index++, 1);
        if (curStr === closingChar) {
          nests--;
        } else if (curStr === openingChar) {
          nests++;
        }
      }
      if (nests === 0) {
        return index - 1;
      } else {
        return -1;
      }
    },
    split: function(s, sep) {
      var a, c, i, l, previousStart, start;
      if (sep == null) {
        sep = ",";
      }
      a = [];
      l = s.length;
      i = 0;
      start = 0;
      previousStart = start;
      whileLoop: //;
      while (i < l) {
        c = s.substr(i, 1);
        switch (c) {
          case "(":
            i = utils.findClosingIndex(s, i + 1, c, ")");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case ")":
            break whileLoop;
            break;
          case "[":
            i = utils.findClosingIndex(s, i + 1, c, "]");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case "":
            i = utils.findClosingIndex(s, i + 1, c, "");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case sep:
            a.push(utils.strip(s.substr(start, i - start)));
            start = i + 1;
            if (previousStart === start) {
              break whileLoop;
            }
            previousStart = start;
        }
        i++;
      }
      a.push(utils.strip(s.substr(start, i - start)));
      return a.filter(function(s) {
        return (s != null) && s.length;
      });
    }
  };

  module.exports = utils;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLE1BQWQ7O1FBQWMsU0FBTzs7QUFDTixhQUFNLEdBQUcsQ0FBQyxNQUFKLEdBQWEsTUFBbkI7UUFBbkIsR0FBQSxHQUFNLE1BQUEsR0FBUztNQUFJO2FBQ25CO0lBRkksQ0FBTjtJQUlBLEtBQUEsRUFBTyxTQUFDLEdBQUQ7YUFBUyxHQUFHLENBQUMsT0FBSixDQUFZLE1BQVosRUFBb0IsRUFBcEI7SUFBVCxDQUpQO0lBTUEsS0FBQSxFQUFPLFNBQUMsQ0FBRDthQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBWjtJQUFQLENBTlA7SUFRQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUksR0FBSjs7UUFBSSxNQUFJOzthQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxFQUFjLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBZDtJQUFoQixDQVJWO0lBVUEsV0FBQSxFQUFhLFNBQUMsQ0FBRDthQUNYLENBQUMsQ0FBQyxLQUFGLENBQVEsTUFBUixDQUFlLENBQUMsR0FBaEIsQ0FBb0IsU0FBQyxDQUFEO2VBQU8sS0FBQSxHQUFNLENBQU4sR0FBUSxHQUFSLEdBQVUsQ0FBQyxDQUFDLENBQUMsV0FBRixDQUFBLENBQUQsQ0FBVixHQUEyQjtNQUFsQyxDQUFwQixDQUF5RCxDQUFDLElBQTFELENBQStELEVBQS9EO0lBRFcsQ0FWYjtJQWFBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCLEtBQWpCO0FBQ1QsVUFBQTs7UUFEaUIsT0FBSzs7TUFDdEIsR0FBQSxHQUFNLFVBQUEsQ0FBVyxLQUFYO01BQ04sSUFBRyxLQUFBLENBQU0sR0FBTixDQUFBLElBQWUscUJBQWxCO1FBQ0UsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFwQixDQUF5QixLQUF6QjtRQUNBLEdBQUEsR0FBTSxVQUFBLENBQVcsSUFBSyxDQUFBLEtBQUEsQ0FBTSxDQUFDLEtBQXZCLEVBRlI7O2FBR0E7SUFMUyxDQWJYO0lBb0JBLE9BQUEsRUFBUyxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCLEtBQWpCLEVBQXdCLElBQXhCO0FBQ1AsVUFBQTs7UUFEZSxPQUFLOzs7UUFBVyxPQUFLOztNQUNwQyxHQUFBLEdBQU0sUUFBQSxDQUFTLEtBQVQsRUFBZ0IsSUFBaEI7TUFDTixJQUFHLEtBQUEsQ0FBTSxHQUFOLENBQUEsSUFBZSxxQkFBbEI7UUFDRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQXBCLENBQXlCLEtBQXpCO1FBQ0EsR0FBQSxHQUFNLFFBQUEsQ0FBUyxJQUFLLENBQUEsS0FBQSxDQUFNLENBQUMsS0FBckIsRUFBNEIsSUFBNUIsRUFGUjs7YUFHQTtJQUxPLENBcEJUO0lBMkJBLFVBQUEsRUFBWSxTQUFDLE1BQUQ7YUFBWSxNQUFNLENBQUMsS0FBUCxDQUFhLGFBQWIsQ0FBMkIsQ0FBQztJQUF4QyxDQTNCWjtJQTZCQSxnQkFBQSxFQUFrQixTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCLEtBQWpCO0FBQ2hCLFVBQUE7O1FBRHdCLE9BQUs7O01BQzdCLElBQUcsQ0FBSSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsQ0FBSixJQUEwQixxQkFBN0I7UUFDRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQXBCLENBQXlCLEtBQXpCO1FBQ0EsS0FBQSxHQUFRLElBQUssQ0FBQSxLQUFBLENBQU0sQ0FBQyxNQUZ0Qjs7TUFJQSxJQUFrQixhQUFsQjtBQUFBLGVBQU8sSUFBUDs7TUFFQSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFBLEtBQXdCLENBQUMsQ0FBNUI7UUFDRSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFBLENBQVcsS0FBWCxDQUFBLEdBQW9CLElBQS9CLEVBRFI7T0FBQSxNQUFBO1FBR0UsR0FBQSxHQUFNLFFBQUEsQ0FBUyxLQUFULEVBSFI7O2FBS0E7SUFaZ0IsQ0E3QmxCO0lBMkNBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBa0IsS0FBbEI7QUFDbEIsVUFBQTs7UUFEMkIsT0FBSzs7TUFDaEMsSUFBRyxDQUFJLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQUFKLElBQTJCLHNCQUE5QjtRQUNFLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBcEIsQ0FBeUIsTUFBekI7UUFDQSxNQUFBLEdBQVMsSUFBSyxDQUFBLE1BQUEsQ0FBTyxDQUFDLE1BRnhCOztNQUlBLElBQWtCLGNBQWxCO0FBQUEsZUFBTyxJQUFQOztNQUVBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFmLENBQUEsS0FBeUIsQ0FBQyxDQUE3QjtRQUNFLEdBQUEsR0FBTSxVQUFBLENBQVcsTUFBWCxDQUFBLEdBQXFCLElBRDdCO09BQUEsTUFBQTtRQUdFLEdBQUEsR0FBTSxVQUFBLENBQVcsTUFBWCxFQUhSOzthQUtBO0lBWmtCLENBM0NwQjtJQXlEQSxnQkFBQSxFQUFrQixTQUFDLENBQUQsRUFBSSxVQUFKLEVBQWtCLFdBQWxCLEVBQW1DLFdBQW5DO0FBQ2hCLFVBQUE7O1FBRG9CLGFBQVc7OztRQUFHLGNBQVk7OztRQUFLLGNBQVk7O01BQy9ELEtBQUEsR0FBUTtNQUNSLEtBQUEsR0FBUTtBQUVSLGFBQU0sS0FBQSxJQUFVLEtBQUEsR0FBUSxDQUFDLENBQUMsTUFBMUI7UUFDRSxNQUFBLEdBQVMsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFBLEVBQVQsRUFBa0IsQ0FBbEI7UUFFVCxJQUFHLE1BQUEsS0FBVSxXQUFiO1VBQ0UsS0FBQSxHQURGO1NBQUEsTUFFSyxJQUFHLE1BQUEsS0FBVSxXQUFiO1VBQ0gsS0FBQSxHQURHOztNQUxQO01BUUEsSUFBRyxLQUFBLEtBQVMsQ0FBWjtlQUFtQixLQUFBLEdBQVEsRUFBM0I7T0FBQSxNQUFBO2VBQWtDLENBQUMsRUFBbkM7O0lBWmdCLENBekRsQjtJQXVFQSxLQUFBLEVBQU8sU0FBQyxDQUFELEVBQUksR0FBSjtBQUNMLFVBQUE7O1FBRFMsTUFBSTs7TUFDYixDQUFBLEdBQUk7TUFDSixDQUFBLEdBQUksQ0FBQyxDQUFDO01BQ04sQ0FBQSxHQUFJO01BQ0osS0FBQSxHQUFRO01BQ1IsYUFBQSxHQUFnQjtNQUNoQjtBQUNBLGFBQU0sQ0FBQSxHQUFJLENBQVY7UUFDRSxDQUFBLEdBQUksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVksQ0FBWjtBQUVKLGdCQUFPLENBQVA7QUFBQSxlQUNPLEdBRFA7WUFFSSxDQUFBLEdBQUksS0FBSyxDQUFDLGdCQUFOLENBQXVCLENBQXZCLEVBQTBCLENBQUEsR0FBSSxDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxHQUFwQztZQUNKLElBQXFCLENBQUEsS0FBSyxDQUFDLENBQTNCO2NBQUEsZ0JBQUE7O0FBRkc7QUFEUCxlQU9PLEdBUFA7WUFRSTtBQURHO0FBUFAsZUFTTyxHQVRQO1lBVUksQ0FBQSxHQUFJLEtBQUssQ0FBQyxnQkFBTixDQUF1QixDQUF2QixFQUEwQixDQUFBLEdBQUksQ0FBOUIsRUFBaUMsQ0FBakMsRUFBb0MsR0FBcEM7WUFDSixJQUFxQixDQUFBLEtBQUssQ0FBQyxDQUEzQjtjQUFBLGdCQUFBOztBQUZHO0FBVFAsZUFZTyxFQVpQO1lBYUksQ0FBQSxHQUFJLEtBQUssQ0FBQyxnQkFBTixDQUF1QixDQUF2QixFQUEwQixDQUFBLEdBQUksQ0FBOUIsRUFBaUMsQ0FBakMsRUFBb0MsRUFBcEM7WUFDSixJQUFxQixDQUFBLEtBQUssQ0FBQyxDQUEzQjtjQUFBLGdCQUFBOztBQUZHO0FBWlAsZUFlTyxHQWZQO1lBZ0JJLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLEtBQVQsRUFBZ0IsQ0FBQSxHQUFJLEtBQXBCLENBQVosQ0FBUDtZQUNBLEtBQUEsR0FBUSxDQUFBLEdBQUk7WUFDWixJQUFxQixhQUFBLEtBQWlCLEtBQXRDO2NBQUEsZ0JBQUE7O1lBQ0EsYUFBQSxHQUFnQjtBQW5CcEI7UUFxQkEsQ0FBQTtNQXhCRjtNQTBCQSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQUssQ0FBQyxLQUFOLENBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFULEVBQWdCLENBQUEsR0FBSSxLQUFwQixDQUFaLENBQVA7YUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQUMsQ0FBRDtlQUFPLFdBQUEsSUFBTyxDQUFDLENBQUM7TUFBaEIsQ0FBVDtJQWxDSyxDQXZFUDs7O0VBNEdGLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBN0dqQiIsInNvdXJjZXNDb250ZW50IjpbIlxudXRpbHMgPVxuICBmaWxsOiAoc3RyLCBsZW5ndGgsIGZpbGxlcj0nMCcpIC0+XG4gICAgc3RyID0gZmlsbGVyICsgc3RyIHdoaWxlIHN0ci5sZW5ndGggPCBsZW5ndGhcbiAgICBzdHJcblxuICBzdHJpcDogKHN0cikgLT4gc3RyLnJlcGxhY2UoL1xccysvZywgJycpXG5cbiAgY2xhbXA6IChuKSAtPiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCBuKSlcblxuICBjbGFtcEludDogKG4sIG1heD0xMDApIC0+IE1hdGgubWluKG1heCwgTWF0aC5tYXgoMCwgbikpXG5cbiAgaW5zZW5zaXRpdmU6IChzKSAtPlxuICAgIHMuc3BsaXQoLyg/OikvKS5tYXAoKGMpIC0+IFwiKD86I3tjfXwje2MudG9VcHBlckNhc2UoKX0pXCIpLmpvaW4oJycpXG5cbiAgcmVhZEZsb2F0OiAodmFsdWUsIHZhcnM9e30sIGNvbG9yKSAtPlxuICAgIHJlcyA9IHBhcnNlRmxvYXQodmFsdWUpXG4gICAgaWYgaXNOYU4ocmVzKSBhbmQgdmFyc1t2YWx1ZV0/XG4gICAgICBjb2xvci51c2VkVmFyaWFibGVzLnB1c2godmFsdWUpXG4gICAgICByZXMgPSBwYXJzZUZsb2F0KHZhcnNbdmFsdWVdLnZhbHVlKVxuICAgIHJlc1xuXG4gIHJlYWRJbnQ6ICh2YWx1ZSwgdmFycz17fSwgY29sb3IsIGJhc2U9MTApIC0+XG4gICAgcmVzID0gcGFyc2VJbnQodmFsdWUsIGJhc2UpXG4gICAgaWYgaXNOYU4ocmVzKSBhbmQgdmFyc1t2YWx1ZV0/XG4gICAgICBjb2xvci51c2VkVmFyaWFibGVzLnB1c2godmFsdWUpXG4gICAgICByZXMgPSBwYXJzZUludCh2YXJzW3ZhbHVlXS52YWx1ZSwgYmFzZSlcbiAgICByZXNcblxuICBjb3VudExpbmVzOiAoc3RyaW5nKSAtPiBzdHJpbmcuc3BsaXQoL1xcclxcbnxcXHJ8XFxuL2cpLmxlbmd0aFxuXG4gIHJlYWRJbnRPclBlcmNlbnQ6ICh2YWx1ZSwgdmFycz17fSwgY29sb3IpIC0+XG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgdmFyc1t2YWx1ZV0/XG4gICAgICBjb2xvci51c2VkVmFyaWFibGVzLnB1c2godmFsdWUpXG4gICAgICB2YWx1ZSA9IHZhcnNbdmFsdWVdLnZhbHVlXG5cbiAgICByZXR1cm4gTmFOIHVubGVzcyB2YWx1ZT9cblxuICAgIGlmIHZhbHVlLmluZGV4T2YoJyUnKSBpc250IC0xXG4gICAgICByZXMgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQodmFsdWUpICogMi41NSlcbiAgICBlbHNlXG4gICAgICByZXMgPSBwYXJzZUludCh2YWx1ZSlcblxuICAgIHJlc1xuXG4gIHJlYWRGbG9hdE9yUGVyY2VudDogKGFtb3VudCwgdmFycz17fSwgY29sb3IpIC0+XG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KGFtb3VudCkgYW5kIHZhcnNbYW1vdW50XT9cbiAgICAgIGNvbG9yLnVzZWRWYXJpYWJsZXMucHVzaChhbW91bnQpXG4gICAgICBhbW91bnQgPSB2YXJzW2Ftb3VudF0udmFsdWVcblxuICAgIHJldHVybiBOYU4gdW5sZXNzIGFtb3VudD9cblxuICAgIGlmIGFtb3VudC5pbmRleE9mKCclJykgaXNudCAtMVxuICAgICAgcmVzID0gcGFyc2VGbG9hdChhbW91bnQpIC8gMTAwXG4gICAgZWxzZVxuICAgICAgcmVzID0gcGFyc2VGbG9hdChhbW91bnQpXG5cbiAgICByZXNcblxuICBmaW5kQ2xvc2luZ0luZGV4OiAocywgc3RhcnRJbmRleD0wLCBvcGVuaW5nQ2hhcj1cIltcIiwgY2xvc2luZ0NoYXI9XCJdXCIpIC0+XG4gICAgaW5kZXggPSBzdGFydEluZGV4XG4gICAgbmVzdHMgPSAxXG5cbiAgICB3aGlsZSBuZXN0cyBhbmQgaW5kZXggPCBzLmxlbmd0aFxuICAgICAgY3VyU3RyID0gcy5zdWJzdHIgaW5kZXgrKywgMVxuXG4gICAgICBpZiBjdXJTdHIgaXMgY2xvc2luZ0NoYXJcbiAgICAgICAgbmVzdHMtLVxuICAgICAgZWxzZSBpZiBjdXJTdHIgaXMgb3BlbmluZ0NoYXJcbiAgICAgICAgbmVzdHMrK1xuXG4gICAgaWYgbmVzdHMgaXMgMCB0aGVuIGluZGV4IC0gMSBlbHNlIC0xXG5cbiAgc3BsaXQ6IChzLCBzZXA9XCIsXCIpIC0+XG4gICAgYSA9IFtdXG4gICAgbCA9IHMubGVuZ3RoXG4gICAgaSA9IDBcbiAgICBzdGFydCA9IDBcbiAgICBwcmV2aW91c1N0YXJ0ID0gc3RhcnRcbiAgICBgd2hpbGVMb29wOiAvL2BcbiAgICB3aGlsZSBpIDwgbFxuICAgICAgYyA9IHMuc3Vic3RyKGksIDEpXG5cbiAgICAgIHN3aXRjaChjKVxuICAgICAgICB3aGVuIFwiKFwiXG4gICAgICAgICAgaSA9IHV0aWxzLmZpbmRDbG9zaW5nSW5kZXggcywgaSArIDEsIGMsIFwiKVwiXG4gICAgICAgICAgYGJyZWFrIHdoaWxlTG9vcGAgaWYgaSBpcyAtMVxuICAgICAgICAjIEEgcGFyc2VyIHJlZ2V4cCB3aWxsIGVuZCB3aXRoIHRoZSBsYXN0ICksIHNvIHNlcXVlbmNlcyBsaWtlICguLi4pKC4uLilcbiAgICAgICAgIyB3aWxsIGVuZCBhZnRlciB0aGUgc2Vjb25kIHBhcmVudGhlc2lzIHBhaXIsIGJ5IG1hdGhpbmcgKSB3ZSBwcmV2ZW50XG4gICAgICAgICMgYW4gaW5maW5pdGUgbG9vcCB3aGVuIHNwbGl0dGluZyB0aGUgc3RyaW5nLlxuICAgICAgICB3aGVuIFwiKVwiXG4gICAgICAgICAgYGJyZWFrIHdoaWxlTG9vcGBcbiAgICAgICAgd2hlbiBcIltcIlxuICAgICAgICAgIGkgPSB1dGlscy5maW5kQ2xvc2luZ0luZGV4IHMsIGkgKyAxLCBjLCBcIl1cIlxuICAgICAgICAgIGBicmVhayB3aGlsZUxvb3BgIGlmIGkgaXMgLTFcbiAgICAgICAgd2hlbiBcIlwiXG4gICAgICAgICAgaSA9IHV0aWxzLmZpbmRDbG9zaW5nSW5kZXggcywgaSArIDEsIGMsIFwiXCJcbiAgICAgICAgICBgYnJlYWsgd2hpbGVMb29wYCBpZiBpIGlzIC0xXG4gICAgICAgIHdoZW4gc2VwXG4gICAgICAgICAgYS5wdXNoIHV0aWxzLnN0cmlwIHMuc3Vic3RyIHN0YXJ0LCBpIC0gc3RhcnRcbiAgICAgICAgICBzdGFydCA9IGkgKyAxXG4gICAgICAgICAgYGJyZWFrIHdoaWxlTG9vcGAgaWYgcHJldmlvdXNTdGFydCBpcyBzdGFydFxuICAgICAgICAgIHByZXZpb3VzU3RhcnQgPSBzdGFydFxuXG4gICAgICBpKytcblxuICAgIGEucHVzaCB1dGlscy5zdHJpcCBzLnN1YnN0ciBzdGFydCwgaSAtIHN0YXJ0XG4gICAgYS5maWx0ZXIgKHMpIC0+IHM/IGFuZCBzLmxlbmd0aFxuXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHNcbiJdfQ==

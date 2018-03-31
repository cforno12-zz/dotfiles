
/*
Requires https://github.com/jaspervdj/stylish-haskell
 */

(function() {
  "use strict";
  var Beautifier, StylishHaskell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = StylishHaskell = (function(superClass) {
    extend(StylishHaskell, superClass);

    function StylishHaskell() {
      return StylishHaskell.__super__.constructor.apply(this, arguments);
    }

    StylishHaskell.prototype.name = "stylish-haskell";

    StylishHaskell.prototype.link = "https://github.com/jaspervdj/stylish-haskell";

    StylishHaskell.prototype.isPreInstalled = false;

    StylishHaskell.prototype.options = {
      Haskell: true
    };

    StylishHaskell.prototype.beautify = function(text, language, options) {
      return this.run("stylish-haskell", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/jaspervdj/stylish-haskell"
        }
      });
    };

    return StylishHaskell;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9zdHlsaXNoLWhhc2tlbGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLDBCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozs2QkFDckIsSUFBQSxHQUFNOzs2QkFDTixJQUFBLEdBQU07OzZCQUNOLGNBQUEsR0FBZ0I7OzZCQUVoQixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsSUFERjs7OzZCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxpQkFBTCxFQUF3QixDQUN0QixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FEc0IsQ0FBeEIsRUFFSztRQUNELElBQUEsRUFBTTtVQUNKLElBQUEsRUFBTSw4Q0FERjtTQURMO09BRkw7SUFEUTs7OztLQVRrQztBQVA5QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2phc3BlcnZkai9zdHlsaXNoLWhhc2tlbGxcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3R5bGlzaEhhc2tlbGwgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwic3R5bGlzaC1oYXNrZWxsXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vamFzcGVydmRqL3N0eWxpc2gtaGFza2VsbFwiXG4gIGlzUHJlSW5zdGFsbGVkOiBmYWxzZVxuXG4gIG9wdGlvbnM6IHtcbiAgICBIYXNrZWxsOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJzdHlsaXNoLWhhc2tlbGxcIiwgW1xuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0sIHtcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2phc3BlcnZkai9zdHlsaXNoLWhhc2tlbGxcIlxuICAgICAgICB9XG4gICAgICB9KVxuIl19

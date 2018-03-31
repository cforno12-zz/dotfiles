(function() {
  var Palette;

  module.exports = Palette = (function() {
    Palette.deserialize = function(state) {
      return new Palette(state.variables);
    };

    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

    Palette.prototype.getTitle = function() {
      return 'Palette';
    };

    Palette.prototype.getURI = function() {
      return 'pigments://palette';
    };

    Palette.prototype.getIconName = function() {
      return "pigments";
    };

    Palette.prototype.sortedByColor = function() {
      return this.variables.slice().sort((function(_this) {
        return function(arg, arg1) {
          var a, b;
          a = arg.color;
          b = arg1.color;
          return _this.compareColors(a, b);
        };
      })(this));
    };

    Palette.prototype.sortedByName = function() {
      var collator;
      collator = new Intl.Collator("en-US", {
        numeric: true
      });
      return this.variables.slice().sort(function(arg, arg1) {
        var a, b;
        a = arg.name;
        b = arg1.name;
        return collator.compare(a, b);
      });
    };

    Palette.prototype.getColorsNames = function() {
      return this.variables.map(function(v) {
        return v.name;
      });
    };

    Palette.prototype.getColorsCount = function() {
      return this.variables.length;
    };

    Palette.prototype.eachColor = function(iterator) {
      var i, len, ref, results, v;
      ref = this.variables;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        v = ref[i];
        results.push(iterator(v));
      }
      return results;
    };

    Palette.prototype.compareColors = function(a, b) {
      var aHue, aLightness, aSaturation, bHue, bLightness, bSaturation, ref, ref1;
      ref = a.hsl, aHue = ref[0], aSaturation = ref[1], aLightness = ref[2];
      ref1 = b.hsl, bHue = ref1[0], bSaturation = ref1[1], bLightness = ref1[2];
      if (aHue < bHue) {
        return -1;
      } else if (aHue > bHue) {
        return 1;
      } else if (aSaturation < bSaturation) {
        return -1;
      } else if (aSaturation > bSaturation) {
        return 1;
      } else if (aLightness < bLightness) {
        return -1;
      } else if (aLightness > bLightness) {
        return 1;
      } else {
        return 0;
      }
    };

    Palette.prototype.serialize = function() {
      return {
        deserializer: 'Palette',
        variables: this.variables
      };
    };

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGFsZXR0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixPQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRDthQUFlLElBQUEsT0FBQSxDQUFRLEtBQUssQ0FBQyxTQUFkO0lBQWY7O0lBRUQsaUJBQUMsU0FBRDtNQUFDLElBQUMsQ0FBQSxnQ0FBRCxZQUFXO0lBQVo7O3NCQUViLFFBQUEsR0FBVSxTQUFBO2FBQUc7SUFBSDs7c0JBRVYsTUFBQSxHQUFRLFNBQUE7YUFBRztJQUFIOztzQkFFUixXQUFBLEdBQWEsU0FBQTthQUFHO0lBQUg7O3NCQUViLGFBQUEsR0FBZSxTQUFBO2FBQ2IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFZLElBQVo7QUFBMEIsY0FBQTtVQUFsQixJQUFQLElBQUM7VUFBaUIsSUFBUCxLQUFDO2lCQUFhLEtBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixFQUFpQixDQUFqQjtRQUExQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7SUFEYTs7c0JBR2YsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO01BQUEsUUFBQSxHQUFlLElBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLEVBQXVCO1FBQUEsT0FBQSxFQUFTLElBQVQ7T0FBdkI7YUFDZixJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxDQUFrQixDQUFDLElBQW5CLENBQXdCLFNBQUMsR0FBRCxFQUFXLElBQVg7QUFBd0IsWUFBQTtRQUFqQixJQUFOLElBQUM7UUFBZSxJQUFOLEtBQUM7ZUFBWSxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFqQixFQUFtQixDQUFuQjtNQUF4QixDQUF4QjtJQUZZOztzQkFJZCxjQUFBLEdBQWdCLFNBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUM7TUFBVCxDQUFmO0lBQUg7O3NCQUVoQixjQUFBLEdBQWdCLFNBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDO0lBQWQ7O3NCQUVoQixTQUFBLEdBQVcsU0FBQyxRQUFEO0FBQWMsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQUEsUUFBQSxDQUFTLENBQVQ7QUFBQTs7SUFBZDs7c0JBRVgsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFHLENBQUg7QUFDYixVQUFBO01BQUEsTUFBa0MsQ0FBQyxDQUFDLEdBQXBDLEVBQUMsYUFBRCxFQUFPLG9CQUFQLEVBQW9CO01BQ3BCLE9BQWtDLENBQUMsQ0FBQyxHQUFwQyxFQUFDLGNBQUQsRUFBTyxxQkFBUCxFQUFvQjtNQUNwQixJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0UsQ0FBQyxFQURIO09BQUEsTUFFSyxJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxXQUFBLEdBQWMsV0FBakI7ZUFDSCxDQUFDLEVBREU7T0FBQSxNQUVBLElBQUcsV0FBQSxHQUFjLFdBQWpCO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxVQUFBLEdBQWEsVUFBaEI7ZUFDSCxDQUFDLEVBREU7T0FBQSxNQUVBLElBQUcsVUFBQSxHQUFhLFVBQWhCO2VBQ0gsRUFERztPQUFBLE1BQUE7ZUFHSCxFQUhHOztJQWJROztzQkFrQmYsU0FBQSxHQUFXLFNBQUE7YUFDVDtRQUNFLFlBQUEsRUFBYyxTQURoQjtRQUVHLFdBQUQsSUFBQyxDQUFBLFNBRkg7O0lBRFM7Ozs7O0FBM0NiIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQYWxldHRlXG4gIEBkZXNlcmlhbGl6ZTogKHN0YXRlKSAtPiBuZXcgUGFsZXR0ZShzdGF0ZS52YXJpYWJsZXMpXG5cbiAgY29uc3RydWN0b3I6IChAdmFyaWFibGVzPVtdKSAtPlxuXG4gIGdldFRpdGxlOiAtPiAnUGFsZXR0ZSdcblxuICBnZXRVUkk6IC0+ICdwaWdtZW50czovL3BhbGV0dGUnXG5cbiAgZ2V0SWNvbk5hbWU6IC0+IFwicGlnbWVudHNcIlxuXG4gIHNvcnRlZEJ5Q29sb3I6IC0+XG4gICAgQHZhcmlhYmxlcy5zbGljZSgpLnNvcnQgKHtjb2xvcjphfSwge2NvbG9yOmJ9KSA9PiBAY29tcGFyZUNvbG9ycyhhLGIpXG5cbiAgc29ydGVkQnlOYW1lOiAtPlxuICAgIGNvbGxhdG9yID0gbmV3IEludGwuQ29sbGF0b3IoXCJlbi1VU1wiLCBudW1lcmljOiB0cnVlKVxuICAgIEB2YXJpYWJsZXMuc2xpY2UoKS5zb3J0ICh7bmFtZTphfSwge25hbWU6Yn0pIC0+IGNvbGxhdG9yLmNvbXBhcmUoYSxiKVxuXG4gIGdldENvbG9yc05hbWVzOiAtPiBAdmFyaWFibGVzLm1hcCAodikgLT4gdi5uYW1lXG5cbiAgZ2V0Q29sb3JzQ291bnQ6IC0+IEB2YXJpYWJsZXMubGVuZ3RoXG5cbiAgZWFjaENvbG9yOiAoaXRlcmF0b3IpIC0+IGl0ZXJhdG9yKHYpIGZvciB2IGluIEB2YXJpYWJsZXNcblxuICBjb21wYXJlQ29sb3JzOiAoYSxiKSAtPlxuICAgIFthSHVlLCBhU2F0dXJhdGlvbiwgYUxpZ2h0bmVzc10gPSBhLmhzbFxuICAgIFtiSHVlLCBiU2F0dXJhdGlvbiwgYkxpZ2h0bmVzc10gPSBiLmhzbFxuICAgIGlmIGFIdWUgPCBiSHVlXG4gICAgICAtMVxuICAgIGVsc2UgaWYgYUh1ZSA+IGJIdWVcbiAgICAgIDFcbiAgICBlbHNlIGlmIGFTYXR1cmF0aW9uIDwgYlNhdHVyYXRpb25cbiAgICAgIC0xXG4gICAgZWxzZSBpZiBhU2F0dXJhdGlvbiA+IGJTYXR1cmF0aW9uXG4gICAgICAxXG4gICAgZWxzZSBpZiBhTGlnaHRuZXNzIDwgYkxpZ2h0bmVzc1xuICAgICAgLTFcbiAgICBlbHNlIGlmIGFMaWdodG5lc3MgPiBiTGlnaHRuZXNzXG4gICAgICAxXG4gICAgZWxzZVxuICAgICAgMFxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdQYWxldHRlJ1xuICAgICAgQHZhcmlhYmxlc1xuICAgIH1cbiJdfQ==

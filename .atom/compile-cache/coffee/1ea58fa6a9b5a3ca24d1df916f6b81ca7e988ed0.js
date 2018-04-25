(function() {
  var Color;

  require('./helpers/matchers');

  Color = require('../lib/color');

  describe('Color', function() {
    var color;
    color = [][0];
    beforeEach(function() {
      return color = new Color('#66ff6933');
    });
    describe('created with separated components', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color(255, 127, 64, 0.5)).toBeColor(255, 127, 64, 0.5);
      });
    });
    describe('created with a hexa rgb string', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color('#ff6933')).toBeColor(255, 105, 51, 1);
      });
    });
    describe('created with a hexa argb string', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color('#66ff6933')).toBeColor(255, 105, 51, 0.4);
      });
    });
    describe('created with the name of a svg color', function() {
      return it('creates the color using its name', function() {
        return expect(new Color('orange')).toBeColor('#ffa500');
      });
    });
    describe('::isValid', function() {
      it('returns true when all the color components are valid', function() {
        return expect(new Color).toBeValid();
      });
      it('returns false when one component is NaN', function() {
        expect(new Color(0/0, 0, 0, 1)).not.toBeValid();
        expect(new Color(0, 0/0, 0, 1)).not.toBeValid();
        expect(new Color(0, 0, 0/0, 1)).not.toBeValid();
        return expect(new Color(0, 0, 1, 0/0)).not.toBeValid();
      });
      return it('returns false when the color has the invalid flag', function() {
        color = new Color;
        color.invalid = true;
        return expect(color).not.toBeValid();
      });
    });
    describe('::isLiteral', function() {
      it('returns true when the color does not rely on variables', function() {
        return expect(new Color('orange').isLiteral()).toBeTruthy();
      });
      return it('returns false when the color does rely on variables', function() {
        color = new Color(0, 0, 0, 1);
        color.variables = ['foo'];
        return expect(color.isLiteral()).toBeFalsy();
      });
    });
    describe('::rgb', function() {
      it('returns an array with the color components', function() {
        return expect(color.rgb).toBeComponentArrayCloseTo([color.red, color.green, color.blue]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.rgb = [1, 2, 3];
        return expect(color).toBeColor(1, 2, 3, 0.4);
      });
    });
    describe('::rgba', function() {
      it('returns an array with the color and alpha components', function() {
        return expect(color.rgba).toBeComponentArrayCloseTo([color.red, color.green, color.blue, color.alpha]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.rgba = [1, 2, 3, 0.7];
        return expect(color).toBeColor(1, 2, 3, 0.7);
      });
    });
    describe('::argb', function() {
      it('returns an array with the alpha and color components', function() {
        return expect(color.argb).toBeComponentArrayCloseTo([color.alpha, color.red, color.green, color.blue]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.argb = [0.7, 1, 2, 3];
        return expect(color).toBeColor(1, 2, 3, 0.7);
      });
    });
    describe('::hsv', function() {
      it('returns an array with the hue, saturation and value components', function() {
        return expect(color.hsv).toBeComponentArrayCloseTo([16, 80, 100]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsv = [200, 50, 50];
        return expect(color).toBeColor(64, 106, 128, 0.4);
      });
    });
    describe('::hsva', function() {
      it('returns an array with the hue, saturation, value and alpha components', function() {
        return expect(color.hsva).toBeComponentArrayCloseTo([16, 80, 100, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsva = [200, 50, 50, 0.7];
        return expect(color).toBeColor(64, 106, 128, 0.7);
      });
    });
    describe('::hcg', function() {
      it('returns an array with the hue, chroma and gray components', function() {
        return expect(color.hcg).toBeComponentArrayCloseTo([16, 80, 100]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hcg = [200, 50, 50];
        return expect(color).toBeColor(64, 149, 191, 0.4);
      });
    });
    describe('::hcga', function() {
      it('returns an array with the hue, chroma, gray and alpha components', function() {
        return expect(color.hcga).toBeComponentArrayCloseTo([16, 80, 100, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hcga = [200, 50, 50, 0.7];
        return expect(color).toBeColor(64, 149, 191, 0.7);
      });
    });
    describe('::hsl', function() {
      it('returns an array with the hue, saturation and luminosity components', function() {
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 100, 60]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsl = [200, 50, 50];
        return expect(color).toBeColor(64, 149, 191, 0.4);
      });
    });
    describe('::hsla', function() {
      it('returns an array with the hue, saturation, luminosity and alpha components', function() {
        return expect(color.hsla).toBeComponentArrayCloseTo([16, 100, 60, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsla = [200, 50, 50, 0.7];
        return expect(color).toBeColor(64, 149, 191, 0.7);
      });
    });
    describe('::hwb', function() {
      it('returns an array with the hue, whiteness and blackness components', function() {
        return expect(color.hwb).toBeComponentArrayCloseTo([16, 20, 0]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hwb = [210, 40, 40];
        return expect(color).toBeColor(102, 128, 153, 0.4);
      });
    });
    describe('::hwba', function() {
      it('returns an array with the hue, whiteness, blackness and alpha components', function() {
        return expect(color.hwba).toBeComponentArrayCloseTo([16, 20, 0, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hwba = [210, 40, 40, 0.7];
        return expect(color).toBeColor(102, 128, 153, 0.7);
      });
    });
    describe('::hex', function() {
      it('returns the color as a hexadecimal string', function() {
        return expect(color.hex).toEqual('ff6933');
      });
      return it('parses the string and sets the color components accordingly', function() {
        color.hex = '00ff00';
        return expect(color).toBeColor(0, 255, 0, 0.4);
      });
    });
    describe('::hexARGB', function() {
      it('returns the color component as a hexadecimal string', function() {
        return expect(color.hexARGB).toEqual('66ff6933');
      });
      return it('parses the string and sets the color components accordingly', function() {
        color.hexARGB = 'ff00ff00';
        return expect(color).toBeColor(0, 255, 0, 1);
      });
    });
    describe('::hue', function() {
      it('returns the hue component', function() {
        return expect(color.hue).toEqual(color.hsl[0]);
      });
      return it('sets the hue component', function() {
        color.hue = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([20, 100, 60]);
      });
    });
    describe('::saturation', function() {
      it('returns the saturation component', function() {
        return expect(color.saturation).toEqual(color.hsl[1]);
      });
      return it('sets the saturation component', function() {
        color.saturation = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 20, 60]);
      });
    });
    describe('::lightness', function() {
      it('returns the lightness component', function() {
        return expect(color.lightness).toEqual(color.hsl[2]);
      });
      return it('sets the lightness component', function() {
        color.lightness = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 100, 20]);
      });
    });
    describe('::cmyk', function() {
      it('returns an array with the color in CMYK color space', function() {
        color = new Color('#FF7F00');
        return expect(color.cmyk).toBeComponentArrayCloseTo([0, 0.5, 1, 0]);
      });
      return it('sets the color components using cmyk values', function() {
        color.alpha = 1;
        color.cmyk = [0, 0.5, 1, 0];
        return expect(color).toBeColor('#FF7F00');
      });
    });
    describe('::clone', function() {
      return it('returns a copy of the current color', function() {
        expect(color.clone()).toBeColor(color);
        return expect(color.clone()).not.toBe(color);
      });
    });
    describe('::toCSS', function() {
      describe('when the color alpha channel is not 1', function() {
        return it('returns the color as a rgba() color', function() {
          return expect(color.toCSS()).toEqual('rgba(255,105,51,0.4)');
        });
      });
      describe('when the color alpha channel is 1', function() {
        return it('returns the color as a rgb() color', function() {
          color.alpha = 1;
          return expect(color.toCSS()).toEqual('rgb(255,105,51)');
        });
      });
      return describe('when the color have a CSS name', function() {
        return it('only returns the color name', function() {
          color = new Color('orange');
          return expect(color.toCSS()).toEqual('rgb(255,165,0)');
        });
      });
    });
    describe('::interpolate', function() {
      return it('blends the passed-in color linearly based on the passed-in ratio', function() {
        var colorA, colorB, colorC;
        colorA = new Color('#ff0000');
        colorB = new Color('#0000ff');
        colorC = colorA.interpolate(colorB, 0.5);
        return expect(colorC).toBeColor('#7f007f');
      });
    });
    describe('::blend', function() {
      return it('blends the passed-in color based on the passed-in blend function', function() {
        var colorA, colorB, colorC;
        colorA = new Color('#ff0000');
        colorB = new Color('#0000ff');
        colorC = colorA.blend(colorB, function(a, b) {
          return a / 2 + b / 2;
        });
        return expect(colorC).toBeColor('#800080');
      });
    });
    describe('::transparentize', function() {
      return it('returns a new color whose alpha is the passed-in value', function() {
        expect(color.transparentize(1)).toBeColor(255, 105, 51, 1);
        expect(color.transparentize(0.7)).toBeColor(255, 105, 51, 0.7);
        return expect(color.transparentize(0.1)).toBeColor(255, 105, 51, 0.1);
      });
    });
    return describe('::luma', function() {
      return it('returns the luma value of the color', function() {
        return expect(color.luma).toBeCloseTo(0.31, 1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLENBQVEsb0JBQVI7O0VBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztFQUVSLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUE7QUFDaEIsUUFBQTtJQUFDLFFBQVM7SUFFVixVQUFBLENBQVcsU0FBQTthQUNULEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxXQUFOO0lBREgsQ0FBWDtJQUdBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBO2FBQzVDLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBO2VBQ25ELE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixFQUFvQixHQUFwQixDQUFYLENBQW9DLENBQUMsU0FBckMsQ0FBK0MsR0FBL0MsRUFBb0QsR0FBcEQsRUFBeUQsRUFBekQsRUFBNkQsR0FBN0Q7TUFEbUQsQ0FBckQ7SUFENEMsQ0FBOUM7SUFJQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQTthQUN6QyxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQTtlQUNuRCxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0sU0FBTixDQUFYLENBQTRCLENBQUMsU0FBN0IsQ0FBdUMsR0FBdkMsRUFBNEMsR0FBNUMsRUFBaUQsRUFBakQsRUFBcUQsQ0FBckQ7TUFEbUQsQ0FBckQ7SUFEeUMsQ0FBM0M7SUFJQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTthQUMxQyxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQTtlQUNuRCxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0sV0FBTixDQUFYLENBQThCLENBQUMsU0FBL0IsQ0FBeUMsR0FBekMsRUFBOEMsR0FBOUMsRUFB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QUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTthQUMzQixFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQTtRQUMzRCxNQUFBLENBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsQ0FBckIsQ0FBUCxDQUErQixDQUFDLFNBQWhDLENBQTBDLEdBQTFDLEVBQThDLEdBQTlDLEVBQWtELEVBQWxELEVBQXFELENBQXJEO1FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLENBQVAsQ0FBaUMsQ0FBQyxTQUFsQyxDQUE0QyxHQUE1QyxFQUFnRCxHQUFoRCxFQUFvRCxFQUFwRCxFQUF1RCxHQUF2RDtlQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFxQixHQUFyQixDQUFQLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsR0FBNUMsRUFBZ0QsR0FBaEQsRUFBb0QsRUFBcEQsRUFBdUQsR0FBdkQ7TUFIMkQsQ0FBN0Q7SUFEMkIsQ0FBN0I7V0FNQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBO2FBQ2pCLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBO2VBQ3hDLE1BQUEsQ0FBTyxLQUFLLENBQUMsSUFBYixDQUFrQixDQUFDLFdBQW5CLENBQStCLElBQS9CLEVBQXFDLENBQXJDO01BRHdDLENBQTFDO0lBRGlCLENBQW5CO0VBblFnQixDQUFsQjtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSAnLi9oZWxwZXJzL21hdGNoZXJzJ1xuXG5Db2xvciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvcidcblxuZGVzY3JpYmUgJ0NvbG9yJywgLT5cbiAgW2NvbG9yXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGNvbG9yID0gbmV3IENvbG9yKCcjNjZmZjY5MzMnKVxuXG4gIGRlc2NyaWJlICdjcmVhdGVkIHdpdGggc2VwYXJhdGVkIGNvbXBvbmVudHMnLCAtPlxuICAgIGl0ICdjcmVhdGVzIHRoZSBjb2xvciB3aXRoIHRoZSBwcm92aWRlZCBjb21wb25lbnRzJywgLT5cbiAgICAgIGV4cGVjdChuZXcgQ29sb3IoMjU1LCAxMjcsIDY0LCAwLjUpKS50b0JlQ29sb3IoMjU1LCAxMjcsIDY0LCAwLjUpXG5cbiAgZGVzY3JpYmUgJ2NyZWF0ZWQgd2l0aCBhIGhleGEgcmdiIHN0cmluZycsIC0+XG4gICAgaXQgJ2NyZWF0ZXMgdGhlIGNvbG9yIHdpdGggdGhlIHByb3ZpZGVkIGNvbXBvbmVudHMnLCAtPlxuICAgICAgZXhwZWN0KG5ldyBDb2xvcignI2ZmNjkzMycpKS50b0JlQ29sb3IoMjU1LCAxMDUsIDUxLCAxKVxuXG4gIGRlc2NyaWJlICdjcmVhdGVkIHdpdGggYSBoZXhhIGFyZ2Igc3RyaW5nJywgLT5cbiAgICBpdCAnY3JlYXRlcyB0aGUgY29sb3Igd2l0aCB0aGUgcHJvdmlkZWQgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QobmV3IENvbG9yKCcjNjZmZjY5MzMnKSkudG9CZUNvbG9yKDI1NSwgMTA1LCA1MSwgMC40KVxuXG4gIGRlc2NyaWJlICdjcmVhdGVkIHdpdGggdGhlIG5hbWUgb2YgYSBzdmcgY29sb3InLCAtPlxuICAgIGl0ICdjcmVhdGVzIHRoZSBjb2xvciB1c2luZyBpdHMgbmFtZScsIC0+XG4gICAgICBleHBlY3QobmV3IENvbG9yKCdvcmFuZ2UnKSkudG9CZUNvbG9yKCcjZmZhNTAwJylcblxuICBkZXNjcmliZSAnOjppc1ZhbGlkJywgLT5cbiAgICBpdCAncmV0dXJucyB0cnVlIHdoZW4gYWxsIHRoZSBjb2xvciBjb21wb25lbnRzIGFyZSB2YWxpZCcsIC0+XG4gICAgICBleHBlY3QobmV3IENvbG9yKS50b0JlVmFsaWQoKVxuXG4gICAgaXQgJ3JldHVybnMgZmFsc2Ugd2hlbiBvbmUgY29tcG9uZW50IGlzIE5hTicsIC0+XG4gICAgICBleHBlY3QobmV3IENvbG9yIE5hTiwgMCwgMCwgMSkubm90LnRvQmVWYWxpZCgpXG4gICAgICBleHBlY3QobmV3IENvbG9yIDAsIE5hTiwgMCwgMSkubm90LnRvQmVWYWxpZCgpXG4gICAgICBleHBlY3QobmV3IENvbG9yIDAsIDAsIE5hTiwgMSkubm90LnRvQmVWYWxpZCgpXG4gICAgICBleHBlY3QobmV3IENvbG9yIDAsIDAsIDEsIE5hTikubm90LnRvQmVWYWxpZCgpXG5cbiAgICBpdCAncmV0dXJucyBmYWxzZSB3aGVuIHRoZSBjb2xvciBoYXMgdGhlIGludmFsaWQgZmxhZycsIC0+XG4gICAgICBjb2xvciA9IG5ldyBDb2xvclxuICAgICAgY29sb3IuaW52YWxpZCA9IHRydWVcbiAgICAgIGV4cGVjdChjb2xvcikubm90LnRvQmVWYWxpZCgpXG5cbiAgZGVzY3JpYmUgJzo6aXNMaXRlcmFsJywgLT5cbiAgICBpdCAncmV0dXJucyB0cnVlIHdoZW4gdGhlIGNvbG9yIGRvZXMgbm90IHJlbHkgb24gdmFyaWFibGVzJywgLT5cbiAgICAgIGV4cGVjdChuZXcgQ29sb3IoJ29yYW5nZScpLmlzTGl0ZXJhbCgpKS50b0JlVHJ1dGh5KClcblxuICAgIGl0ICdyZXR1cm5zIGZhbHNlIHdoZW4gdGhlIGNvbG9yIGRvZXMgcmVseSBvbiB2YXJpYWJsZXMnLCAtPlxuICAgICAgY29sb3IgPSBuZXcgQ29sb3IoMCwwLDAsMSlcbiAgICAgIGNvbG9yLnZhcmlhYmxlcyA9IFsnZm9vJ11cblxuICAgICAgZXhwZWN0KGNvbG9yLmlzTGl0ZXJhbCgpKS50b0JlRmFsc3koKVxuXG4gIGRlc2NyaWJlICc6OnJnYicsIC0+XG4gICAgaXQgJ3JldHVybnMgYW4gYXJyYXkgd2l0aCB0aGUgY29sb3IgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sb3IucmdiKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFtcbiAgICAgICAgY29sb3IucmVkXG4gICAgICAgIGNvbG9yLmdyZWVuXG4gICAgICAgIGNvbG9yLmJsdWVcbiAgICAgIF0pXG5cbiAgICBpdCAnc2V0cyB0aGUgY29sb3IgY29tcG9uZW50cyBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIHZhbHVlcycsIC0+XG4gICAgICBjb2xvci5yZ2IgPSBbMSwyLDNdXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDEsMiwzLDAuNClcblxuICBkZXNjcmliZSAnOjpyZ2JhJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBjb2xvciBhbmQgYWxwaGEgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sb3IucmdiYSkudG9CZUNvbXBvbmVudEFycmF5Q2xvc2VUbyhbXG4gICAgICAgIGNvbG9yLnJlZFxuICAgICAgICBjb2xvci5ncmVlblxuICAgICAgICBjb2xvci5ibHVlXG4gICAgICAgIGNvbG9yLmFscGhhXG4gICAgICBdKVxuXG4gICAgaXQgJ3NldHMgdGhlIGNvbG9yIGNvbXBvbmVudHMgYmFzZWQgb24gdGhlIHBhc3NlZC1pbiB2YWx1ZXMnLCAtPlxuICAgICAgY29sb3IucmdiYSA9IFsxLDIsMywwLjddXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDEsMiwzLDAuNylcblxuICBkZXNjcmliZSAnOjphcmdiJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBhbHBoYSBhbmQgY29sb3IgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sb3IuYXJnYikudG9CZUNvbXBvbmVudEFycmF5Q2xvc2VUbyhbXG4gICAgICAgIGNvbG9yLmFscGhhXG4gICAgICAgIGNvbG9yLnJlZFxuICAgICAgICBjb2xvci5ncmVlblxuICAgICAgICBjb2xvci5ibHVlXG4gICAgICBdKVxuXG4gICAgaXQgJ3NldHMgdGhlIGNvbG9yIGNvbXBvbmVudHMgYmFzZWQgb24gdGhlIHBhc3NlZC1pbiB2YWx1ZXMnLCAtPlxuICAgICAgY29sb3IuYXJnYiA9IFswLjcsMSwyLDNdXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDEsMiwzLDAuNylcblxuICBkZXNjcmliZSAnOjpoc3YnLCAtPlxuICAgIGl0ICdyZXR1cm5zIGFuIGFycmF5IHdpdGggdGhlIGh1ZSwgc2F0dXJhdGlvbiBhbmQgdmFsdWUgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sb3IuaHN2KS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgODAsIDEwMF0pXG5cbiAgICBpdCAnc2V0cyB0aGUgY29sb3IgY29tcG9uZW50cyBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIHZhbHVlcycsIC0+XG4gICAgICBjb2xvci5oc3YgPSBbMjAwLDUwLDUwXVxuXG4gICAgICBleHBlY3QoY29sb3IpLnRvQmVDb2xvcig2NCwgMTA2LCAxMjgsIDAuNClcblxuICBkZXNjcmliZSAnOjpoc3ZhJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIHNhdHVyYXRpb24sIHZhbHVlIGFuZCBhbHBoYSBjb21wb25lbnRzJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5oc3ZhKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgODAsIDEwMCwgMC40XSlcblxuICAgIGl0ICdzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gdmFsdWVzJywgLT5cbiAgICAgIGNvbG9yLmhzdmEgPSBbMjAwLDUwLDUwLDAuN11cblxuICAgICAgZXhwZWN0KGNvbG9yKS50b0JlQ29sb3IoNjQsIDEwNiwgMTI4LCAwLjcpXG5cbiAgZGVzY3JpYmUgJzo6aGNnJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIGNocm9tYSBhbmQgZ3JheSBjb21wb25lbnRzJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5oY2cpLnRvQmVDb21wb25lbnRBcnJheUNsb3NlVG8oWzE2LCA4MCwgMTAwXSlcblxuICAgIGl0ICdzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gdmFsdWVzJywgLT5cbiAgICAgIGNvbG9yLmhjZyA9IFsyMDAsNTAsNTBdXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDY0LCAxNDksIDE5MSwgMC40KVxuXG4gIGRlc2NyaWJlICc6OmhjZ2EnLCAtPlxuICAgIGl0ICdyZXR1cm5zIGFuIGFycmF5IHdpdGggdGhlIGh1ZSwgY2hyb21hLCBncmF5IGFuZCBhbHBoYSBjb21wb25lbnRzJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5oY2dhKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgODAsIDEwMCwgMC40XSlcblxuICAgIGl0ICdzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gdmFsdWVzJywgLT5cbiAgICAgIGNvbG9yLmhjZ2EgPSBbMjAwLDUwLDUwLDAuN11cblxuICAgICAgZXhwZWN0KGNvbG9yKS50b0JlQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjcpXG5cbiAgZGVzY3JpYmUgJzo6aHNsJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIHNhdHVyYXRpb24gYW5kIGx1bWlub3NpdHkgY29tcG9uZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sb3IuaHNsKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgMTAwLCA2MF0pXG5cbiAgICBpdCAnc2V0cyB0aGUgY29sb3IgY29tcG9uZW50cyBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIHZhbHVlcycsIC0+XG4gICAgICBjb2xvci5oc2wgPSBbMjAwLDUwLDUwXVxuXG4gICAgICBleHBlY3QoY29sb3IpLnRvQmVDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNClcblxuICBkZXNjcmliZSAnOjpoc2xhJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIHNhdHVyYXRpb24sIGx1bWlub3NpdHkgYW5kIGFscGhhIGNvbXBvbmVudHMnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yLmhzbGEpLnRvQmVDb21wb25lbnRBcnJheUNsb3NlVG8oWzE2LCAxMDAsIDYwLCAwLjRdKVxuXG4gICAgaXQgJ3NldHMgdGhlIGNvbG9yIGNvbXBvbmVudHMgYmFzZWQgb24gdGhlIHBhc3NlZC1pbiB2YWx1ZXMnLCAtPlxuICAgICAgY29sb3IuaHNsYSA9IFsyMDAsNTAsNTAsIDAuN11cblxuICAgICAgZXhwZWN0KGNvbG9yKS50b0JlQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjcpXG5cbiAgZGVzY3JpYmUgJzo6aHdiJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIHdoaXRlbmVzcyBhbmQgYmxhY2tuZXNzIGNvbXBvbmVudHMnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yLmh3YikudG9CZUNvbXBvbmVudEFycmF5Q2xvc2VUbyhbMTYsIDIwLCAwXSlcblxuICAgIGl0ICdzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gdmFsdWVzJywgLT5cbiAgICAgIGNvbG9yLmh3YiA9IFsyMTAsNDAsNDBdXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDEwMiwgMTI4LCAxNTMsIDAuNClcblxuICBkZXNjcmliZSAnOjpod2JhJywgLT5cbiAgICBpdCAncmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBodWUsIHdoaXRlbmVzcywgYmxhY2tuZXNzIGFuZCBhbHBoYSBjb21wb25lbnRzJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5od2JhKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgMjAsIDAsIDAuNF0pXG5cbiAgICBpdCAnc2V0cyB0aGUgY29sb3IgY29tcG9uZW50cyBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIHZhbHVlcycsIC0+XG4gICAgICBjb2xvci5od2JhID0gWzIxMCw0MCw0MCwwLjddXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDEwMiwgMTI4LCAxNTMsIDAuNylcblxuICBkZXNjcmliZSAnOjpoZXgnLCAtPlxuICAgIGl0ICdyZXR1cm5zIHRoZSBjb2xvciBhcyBhIGhleGFkZWNpbWFsIHN0cmluZycsIC0+XG4gICAgICBleHBlY3QoY29sb3IuaGV4KS50b0VxdWFsKCdmZjY5MzMnKVxuXG4gICAgaXQgJ3BhcnNlcyB0aGUgc3RyaW5nIGFuZCBzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIGFjY29yZGluZ2x5JywgLT5cbiAgICAgIGNvbG9yLmhleCA9ICcwMGZmMDAnXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKDAsMjU1LDAsMC40KVxuXG4gIGRlc2NyaWJlICc6OmhleEFSR0InLCAtPlxuICAgIGl0ICdyZXR1cm5zIHRoZSBjb2xvciBjb21wb25lbnQgYXMgYSBoZXhhZGVjaW1hbCBzdHJpbmcnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yLmhleEFSR0IpLnRvRXF1YWwoJzY2ZmY2OTMzJylcblxuICAgIGl0ICdwYXJzZXMgdGhlIHN0cmluZyBhbmQgc2V0cyB0aGUgY29sb3IgY29tcG9uZW50cyBhY2NvcmRpbmdseScsIC0+XG4gICAgICBjb2xvci5oZXhBUkdCID0gJ2ZmMDBmZjAwJ1xuXG4gICAgICBleHBlY3QoY29sb3IpLnRvQmVDb2xvcigwLDI1NSwwLDEpXG5cbiAgZGVzY3JpYmUgJzo6aHVlJywgLT5cbiAgICBpdCAncmV0dXJucyB0aGUgaHVlIGNvbXBvbmVudCcsIC0+XG4gICAgICBleHBlY3QoY29sb3IuaHVlKS50b0VxdWFsKGNvbG9yLmhzbFswXSlcblxuICAgIGl0ICdzZXRzIHRoZSBodWUgY29tcG9uZW50JywgLT5cbiAgICAgIGNvbG9yLmh1ZSA9IDIwXG5cbiAgICAgIGV4cGVjdChjb2xvci5oc2wpLnRvQmVDb21wb25lbnRBcnJheUNsb3NlVG8oWzIwLCAxMDAsIDYwXSlcblxuICBkZXNjcmliZSAnOjpzYXR1cmF0aW9uJywgLT5cbiAgICBpdCAncmV0dXJucyB0aGUgc2F0dXJhdGlvbiBjb21wb25lbnQnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yLnNhdHVyYXRpb24pLnRvRXF1YWwoY29sb3IuaHNsWzFdKVxuXG4gICAgaXQgJ3NldHMgdGhlIHNhdHVyYXRpb24gY29tcG9uZW50JywgLT5cbiAgICAgIGNvbG9yLnNhdHVyYXRpb24gPSAyMFxuXG4gICAgICBleHBlY3QoY29sb3IuaHNsKS50b0JlQ29tcG9uZW50QXJyYXlDbG9zZVRvKFsxNiwgMjAsIDYwXSlcblxuICBkZXNjcmliZSAnOjpsaWdodG5lc3MnLCAtPlxuICAgIGl0ICdyZXR1cm5zIHRoZSBsaWdodG5lc3MgY29tcG9uZW50JywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5saWdodG5lc3MpLnRvRXF1YWwoY29sb3IuaHNsWzJdKVxuXG4gICAgaXQgJ3NldHMgdGhlIGxpZ2h0bmVzcyBjb21wb25lbnQnLCAtPlxuICAgICAgY29sb3IubGlnaHRuZXNzID0gMjBcblxuICAgICAgZXhwZWN0KGNvbG9yLmhzbCkudG9CZUNvbXBvbmVudEFycmF5Q2xvc2VUbyhbMTYsIDEwMCwgMjBdKVxuXG4gIGRlc2NyaWJlICc6OmNteWsnLCAtPlxuICAgIGl0ICdyZXR1cm5zIGFuIGFycmF5IHdpdGggdGhlIGNvbG9yIGluIENNWUsgY29sb3Igc3BhY2UnLCAtPlxuICAgICAgY29sb3IgPSBuZXcgQ29sb3IoJyNGRjdGMDAnKVxuXG4gICAgICBleHBlY3QoY29sb3IuY215aykudG9CZUNvbXBvbmVudEFycmF5Q2xvc2VUbyhbMCwwLjUsMSwwXSlcblxuICAgIGl0ICdzZXRzIHRoZSBjb2xvciBjb21wb25lbnRzIHVzaW5nIGNteWsgdmFsdWVzJywgLT5cbiAgICAgIGNvbG9yLmFscGhhID0gMVxuICAgICAgY29sb3IuY215ayA9IFswLCAwLjUsIDEsIDBdXG5cbiAgICAgIGV4cGVjdChjb2xvcikudG9CZUNvbG9yKCcjRkY3RjAwJylcblxuICBkZXNjcmliZSAnOjpjbG9uZScsIC0+XG4gICAgaXQgJ3JldHVybnMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGNvbG9yJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci5jbG9uZSgpKS50b0JlQ29sb3IoY29sb3IpXG4gICAgICBleHBlY3QoY29sb3IuY2xvbmUoKSkubm90LnRvQmUoY29sb3IpXG5cbiAgZGVzY3JpYmUgJzo6dG9DU1MnLCAtPlxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBjb2xvciBhbHBoYSBjaGFubmVsIGlzIG5vdCAxJywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIHRoZSBjb2xvciBhcyBhIHJnYmEoKSBjb2xvcicsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvci50b0NTUygpKS50b0VxdWFsKCdyZ2JhKDI1NSwxMDUsNTEsMC40KScpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgY29sb3IgYWxwaGEgY2hhbm5lbCBpcyAxJywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIHRoZSBjb2xvciBhcyBhIHJnYigpIGNvbG9yJywgLT5cbiAgICAgICAgY29sb3IuYWxwaGEgPSAxXG4gICAgICAgIGV4cGVjdChjb2xvci50b0NTUygpKS50b0VxdWFsKCdyZ2IoMjU1LDEwNSw1MSknKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGNvbG9yIGhhdmUgYSBDU1MgbmFtZScsIC0+XG4gICAgICBpdCAnb25seSByZXR1cm5zIHRoZSBjb2xvciBuYW1lJywgLT5cbiAgICAgICAgY29sb3IgPSBuZXcgQ29sb3IgJ29yYW5nZSdcbiAgICAgICAgZXhwZWN0KGNvbG9yLnRvQ1NTKCkpLnRvRXF1YWwoJ3JnYigyNTUsMTY1LDApJylcblxuICBkZXNjcmliZSAnOjppbnRlcnBvbGF0ZScsIC0+XG4gICAgaXQgJ2JsZW5kcyB0aGUgcGFzc2VkLWluIGNvbG9yIGxpbmVhcmx5IGJhc2VkIG9uIHRoZSBwYXNzZWQtaW4gcmF0aW8nLCAtPlxuICAgICAgY29sb3JBID0gbmV3IENvbG9yKCcjZmYwMDAwJylcbiAgICAgIGNvbG9yQiA9IG5ldyBDb2xvcignIzAwMDBmZicpXG4gICAgICBjb2xvckMgPSBjb2xvckEuaW50ZXJwb2xhdGUoY29sb3JCLCAwLjUpXG5cbiAgICAgIGV4cGVjdChjb2xvckMpLnRvQmVDb2xvcignIzdmMDA3ZicpXG5cbiAgZGVzY3JpYmUgJzo6YmxlbmQnLCAtPlxuICAgIGl0ICdibGVuZHMgdGhlIHBhc3NlZC1pbiBjb2xvciBiYXNlZCBvbiB0aGUgcGFzc2VkLWluIGJsZW5kIGZ1bmN0aW9uJywgLT5cbiAgICAgIGNvbG9yQSA9IG5ldyBDb2xvcignI2ZmMDAwMCcpXG4gICAgICBjb2xvckIgPSBuZXcgQ29sb3IoJyMwMDAwZmYnKVxuICAgICAgY29sb3JDID0gY29sb3JBLmJsZW5kIGNvbG9yQiwgKGEsYikgLT4gYSAvIDIgKyBiIC8gMlxuXG4gICAgICBleHBlY3QoY29sb3JDKS50b0JlQ29sb3IoJyM4MDAwODAnKVxuXG4gIGRlc2NyaWJlICc6OnRyYW5zcGFyZW50aXplJywgLT5cbiAgICBpdCAncmV0dXJucyBhIG5ldyBjb2xvciB3aG9zZSBhbHBoYSBpcyB0aGUgcGFzc2VkLWluIHZhbHVlJywgLT5cbiAgICAgIGV4cGVjdChjb2xvci50cmFuc3BhcmVudGl6ZSgxKSkudG9CZUNvbG9yKDI1NSwxMDUsNTEsMSlcbiAgICAgIGV4cGVjdChjb2xvci50cmFuc3BhcmVudGl6ZSgwLjcpKS50b0JlQ29sb3IoMjU1LDEwNSw1MSwwLjcpXG4gICAgICBleHBlY3QoY29sb3IudHJhbnNwYXJlbnRpemUoMC4xKSkudG9CZUNvbG9yKDI1NSwxMDUsNTEsMC4xKVxuXG4gIGRlc2NyaWJlICc6Omx1bWEnLCAtPlxuICAgIGl0ICdyZXR1cm5zIHRoZSBsdW1hIHZhbHVlIG9mIHRoZSBjb2xvcicsIC0+XG4gICAgICBleHBlY3QoY29sb3IubHVtYSkudG9CZUNsb3NlVG8oMC4zMSwgMSlcbiJdfQ==
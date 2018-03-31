(function() {
  var Color, ColorMarker;

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  describe('ColorMarker', function() {
    var colorMarker, editor, jasmineContent, marker, ref;
    ref = [], editor = ref[0], marker = ref[1], colorMarker = ref[2], jasmineContent = ref[3];
    beforeEach(function() {
      var color, colorBuffer, text;
      editor = atom.workspace.buildTextEditor({});
      editor.setText("body {\n  color: hsva(0, 100%, 100%, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [1, 33]]);
      color = new Color(255, 0, 0, 0.5);
      text = 'hsva(0, 100%, 100%, 0.5)';
      colorBuffer = {
        editor: editor
      };
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: colorBuffer
      });
    });
    describe('::copyContentAsHex', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHex();
      });
      return it('write the hexadecimal version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("#ff0000");
      });
    });
    describe('::copyContentAsRGB', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsRGB();
      });
      return it('write the rgb version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("rgb(255, 0, 0)");
      });
    });
    describe('::copyContentAsRGBA', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsRGBA();
      });
      return it('write the rgba version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("rgba(255, 0, 0, 0.5)");
      });
    });
    describe('::copyContentAsHSL', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHSL();
      });
      return it('write the hsl version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("hsl(0, 100%, 50%)");
      });
    });
    describe('::copyContentAsHSLA', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHSLA();
      });
      return it('write the hsla version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("hsla(0, 100%, 50%, 0.5)");
      });
    });
    describe('::convertContentToHex', function() {
      beforeEach(function() {
        return colorMarker.convertContentToHex();
      });
      return it('replaces the text in the editor by the hexadecimal version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: #ff0000;\n  bar: foo;\n  foo: bar;\n}");
      });
    });
    describe('::convertContentToRGBA', function() {
      beforeEach(function() {
        return colorMarker.convertContentToRGBA();
      });
      it('replaces the text in the editor by the rgba version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: rgba(255, 0, 0, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is 1', function() {
        beforeEach(function() {
          colorMarker.color.alpha = 1;
          return colorMarker.convertContentToRGBA();
        });
        return it('replaces the text in the editor by the rgba version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: rgba(255, 0, 0, 1);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    describe('::convertContentToRGB', function() {
      beforeEach(function() {
        colorMarker.color.alpha = 1;
        return colorMarker.convertContentToRGB();
      });
      it('replaces the text in the editor by the rgb version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: rgb(255, 0, 0);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is not 1', function() {
        beforeEach(function() {
          return colorMarker.convertContentToRGB();
        });
        return it('replaces the text in the editor by the rgb version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: rgb(255, 0, 0);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    describe('::convertContentToHSLA', function() {
      beforeEach(function() {
        return colorMarker.convertContentToHSLA();
      });
      it('replaces the text in the editor by the hsla version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: hsla(0, 100%, 50%, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is 1', function() {
        beforeEach(function() {
          colorMarker.color.alpha = 1;
          return colorMarker.convertContentToHSLA();
        });
        return it('replaces the text in the editor by the hsla version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: hsla(0, 100%, 50%, 1);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    return describe('::convertContentToHSL', function() {
      beforeEach(function() {
        colorMarker.color.alpha = 1;
        return colorMarker.convertContentToHSL();
      });
      it('replaces the text in the editor by the hsl version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: hsl(0, 100%, 50%);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is not 1', function() {
        beforeEach(function() {
          return colorMarker.convertContentToHSL();
        });
        return it('replaces the text in the editor by the hsl version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: hsl(0, 100%, 50%);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLW1hcmtlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztFQUNSLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBRWQsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtBQUN0QixRQUFBO0lBQUEsTUFBZ0QsRUFBaEQsRUFBQyxlQUFELEVBQVMsZUFBVCxFQUFpQixvQkFBakIsRUFBOEI7SUFFOUIsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixFQUEvQjtNQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUseUVBQWY7TUFPQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxFQUFILENBQVAsQ0FBdkI7TUFDVCxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLEdBQWpCO01BQ1osSUFBQSxHQUFPO01BQ1AsV0FBQSxHQUFjO1FBQUMsUUFBQSxNQUFEOzthQUVkLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQVk7UUFBQyxRQUFBLE1BQUQ7UUFBUyxPQUFBLEtBQVQ7UUFBZ0IsTUFBQSxJQUFoQjtRQUFzQixhQUFBLFdBQXRCO09BQVo7SUFkVCxDQUFYO0lBZ0JBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO01BQzdCLFVBQUEsQ0FBVyxTQUFBO2VBQ1QsV0FBVyxDQUFDLGdCQUFaLENBQUE7TUFEUyxDQUFYO2FBR0EsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7ZUFDbkQsTUFBQSxDQUFP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LENBQUMsS0FBbEIsR0FBMEI7ZUFDMUIsV0FBVyxDQUFDLG1CQUFaLENBQUE7TUFGUyxDQUFYO01BSUEsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUE7ZUFDdkQsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLGtFQUFqQztNQUR1RCxDQUF6RDthQVNBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBO1FBQ3hDLFVBQUEsQ0FBVyxTQUFBO2lCQUNULFdBQVcsQ0FBQyxtQkFBWixDQUFBO1FBRFMsQ0FBWDtlQUdBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO2lCQUN2RCxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsa0VBQWpDO1FBRHVELENBQXpEO01BSndDLENBQTFDO0lBZGdDLENBQWxDO0VBcEpzQixDQUF4QjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsiQ29sb3IgPSByZXF1aXJlICcuLi9saWIvY29sb3InXG5Db2xvck1hcmtlciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1tYXJrZXInXG5cbmRlc2NyaWJlICdDb2xvck1hcmtlcicsIC0+XG4gIFtlZGl0b3IsIG1hcmtlciwgY29sb3JNYXJrZXIsIGphc21pbmVDb250ZW50XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcbiAgICBlZGl0b3Iuc2V0VGV4dChcIlwiXCJcbiAgICBib2R5IHtcbiAgICAgIGNvbG9yOiBoc3ZhKDAsIDEwMCUsIDEwMCUsIDAuNSk7XG4gICAgICBiYXI6IGZvbztcbiAgICAgIGZvbzogYmFyO1xuICAgIH1cbiAgICBcIlwiXCIpXG4gICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSBbWzEsOV0sWzEsMzNdXVxuICAgIGNvbG9yID0gbmV3IENvbG9yKDI1NSwgMCwgMCwgMC41KVxuICAgIHRleHQgPSAnaHN2YSgwLCAxMDAlLCAxMDAlLCAwLjUpJ1xuICAgIGNvbG9yQnVmZmVyID0ge2VkaXRvcn1cblxuICAgIGNvbG9yTWFya2VyID0gbmV3IENvbG9yTWFya2VyKHttYXJrZXIsIGNvbG9yLCB0ZXh0LCBjb2xvckJ1ZmZlcn0pXG5cbiAgZGVzY3JpYmUgJzo6Y29weUNvbnRlbnRBc0hleCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgY29sb3JNYXJrZXIuY29weUNvbnRlbnRBc0hleCgpXG5cbiAgICBpdCAnd3JpdGUgdGhlIGhleGFkZWNpbWFsIHZlcnNpb24gaW4gdGhlIGNsaXBib2FyZCcsIC0+XG4gICAgICBleHBlY3QoYXRvbS5jbGlwYm9hcmQucmVhZCgpKS50b0VxdWFsKFwiI2ZmMDAwMFwiKVxuXG4gIGRlc2NyaWJlICc6OmNvcHlDb250ZW50QXNSR0InLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNvbG9yTWFya2VyLmNvcHlDb250ZW50QXNSR0IoKVxuXG4gICAgaXQgJ3dyaXRlIHRoZSByZ2IgdmVyc2lvbiBpbiB0aGUgY2xpcGJvYXJkJywgLT5cbiAgICAgIGV4cGVjdChhdG9tLmNsaXBib2FyZC5yZWFkKCkpLnRvRXF1YWwoXCJyZ2IoMjU1LCAwLCAwKVwiKVxuXG4gIGRlc2NyaWJlICc6OmNvcHlDb250ZW50QXNSR0JBJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvck1hcmtlci5jb3B5Q29udGVudEFzUkdCQSgpXG5cbiAgICBpdCAnd3JpdGUgdGhlIHJnYmEgdmVyc2lvbiBpbiB0aGUgY2xpcGJvYXJkJywgLT5cbiAgICAgIGV4cGVjdChhdG9tLmNsaXBib2FyZC5yZWFkKCkpLnRvRXF1YWwoXCJyZ2JhKDI1NSwgMCwgMCwgMC41KVwiKVxuXG4gIGRlc2NyaWJlICc6OmNvcHlDb250ZW50QXNIU0wnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNvbG9yTWFya2VyLmNvcHlDb250ZW50QXNIU0woKVxuXG4gICAgaXQgJ3dyaXRlIHRoZSBoc2wgdmVyc2lvbiBpbiB0aGUgY2xpcGJvYXJkJywgLT5cbiAgICAgIGV4cGVjdChhdG9tLmNsaXBib2FyZC5yZWFkKCkpLnRvRXF1YWwoXCJoc2woMCwgMTAwJSwgNTAlKVwiKVxuXG4gIGRlc2NyaWJlICc6OmNvcHlDb250ZW50QXNIU0xBJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvck1hcmtlci5jb3B5Q29udGVudEFzSFNMQSgpXG5cbiAgICBpdCAnd3JpdGUgdGhlIGhzbGEgdmVyc2lvbiBpbiB0aGUgY2xpcGJvYXJkJywgLT5cbiAgICAgIGV4cGVjdChhdG9tLmNsaXBib2FyZC5yZWFkKCkpLnRvRXF1YWwoXCJoc2xhKDAsIDEwMCUsIDUwJSwgMC41KVwiKVxuXG4gIGRlc2NyaWJlICc6OmNvbnZlcnRDb250ZW50VG9IZXgnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNvbG9yTWFya2VyLmNvbnZlcnRDb250ZW50VG9IZXgoKVxuXG4gICAgaXQgJ3JlcGxhY2VzIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3IgYnkgdGhlIGhleGFkZWNpbWFsIHZlcnNpb24nLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJcIlwiXG4gICAgICBib2R5IHtcbiAgICAgICAgY29sb3I6ICNmZjAwMDA7XG4gICAgICAgIGJhcjogZm9vO1xuICAgICAgICBmb286IGJhcjtcbiAgICAgIH1cbiAgICAgIFwiXCJcIilcblxuICBkZXNjcmliZSAnOjpjb252ZXJ0Q29udGVudFRvUkdCQScsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgY29sb3JNYXJrZXIuY29udmVydENvbnRlbnRUb1JHQkEoKVxuXG4gICAgaXQgJ3JlcGxhY2VzIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3IgYnkgdGhlIHJnYmEgdmVyc2lvbicsIC0+XG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcIlwiXCJcbiAgICAgIGJvZHkge1xuICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuNSk7XG4gICAgICAgIGJhcjogZm9vO1xuICAgICAgICBmb286IGJhcjtcbiAgICAgIH1cbiAgICAgIFwiXCJcIilcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBjb2xvciBhbHBoYSBpcyAxJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29sb3JNYXJrZXIuY29sb3IuYWxwaGEgPSAxXG4gICAgICAgIGNvbG9yTWFya2VyLmNvbnZlcnRDb250ZW50VG9SR0JBKClcblxuICAgICAgaXQgJ3JlcGxhY2VzIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3IgYnkgdGhlIHJnYmEgdmVyc2lvbicsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwiXCJcIlxuICAgICAgICBib2R5IHtcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDAsIDAsIDEpO1xuICAgICAgICAgIGJhcjogZm9vO1xuICAgICAgICAgIGZvbzogYmFyO1xuICAgICAgICB9XG4gICAgICAgIFwiXCJcIilcblxuICBkZXNjcmliZSAnOjpjb252ZXJ0Q29udGVudFRvUkdCJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvck1hcmtlci5jb2xvci5hbHBoYSA9IDFcbiAgICAgIGNvbG9yTWFya2VyLmNvbnZlcnRDb250ZW50VG9SR0IoKVxuXG4gICAgaXQgJ3JlcGxhY2VzIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3IgYnkgdGhlIHJnYiB2ZXJzaW9uJywgLT5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwiXCJcIlxuICAgICAgYm9keSB7XG4gICAgICAgIGNvbG9yOiByZ2IoMjU1LCAwLCAwKTtcbiAgICAgICAgYmFyOiBmb287XG4gICAgICAgIGZvbzogYmFyO1xuICAgICAgfVxuICAgICAgXCJcIlwiKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGNvbG9yIGFscGhhIGlzIG5vdCAxJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgY29sb3JNYXJrZXIuY29udmVydENvbnRlbnRUb1JHQigpXG5cbiAgICAgIGl0ICdyZXBsYWNlcyB0aGUgdGV4dCBpbiB0aGUgZWRpdG9yIGJ5IHRoZSByZ2IgdmVyc2lvbicsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwiXCJcIlxuICAgICAgICBib2R5IHtcbiAgICAgICAgICBjb2xvcjogcmdiKDI1NSwgMCwgMCk7XG4gICAgICAgICAgYmFyOiBmb287XG4gICAgICAgICAgZm9vOiBiYXI7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiKVxuXG4gIGRlc2NyaWJlICc6OmNvbnZlcnRDb250ZW50VG9IU0xBJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvck1hcmtlci5jb252ZXJ0Q29udGVudFRvSFNMQSgpXG5cbiAgICBpdCAncmVwbGFjZXMgdGhlIHRleHQgaW4gdGhlIGVkaXRvciBieSB0aGUgaHNsYSB2ZXJzaW9uJywgLT5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwiXCJcIlxuICAgICAgYm9keSB7XG4gICAgICAgIGNvbG9yOiBoc2xhKDAsIDEwMCUsIDUwJSwgMC41KTtcbiAgICAgICAgYmFyOiBmb287XG4gICAgICAgIGZvbzogYmFyO1xuICAgICAgfVxuICAgICAgXCJcIlwiKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGNvbG9yIGFscGhhIGlzIDEnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBjb2xvck1hcmtlci5jb2xvci5hbHBoYSA9IDFcbiAgICAgICAgY29sb3JNYXJrZXIuY29udmVydENvbnRlbnRUb0hTTEEoKVxuXG4gICAgICBpdCAncmVwbGFjZXMgdGhlIHRleHQgaW4gdGhlIGVkaXRvciBieSB0aGUgaHNsYSB2ZXJzaW9uJywgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJcIlwiXG4gICAgICAgIGJvZHkge1xuICAgICAgICAgIGNvbG9yOiBoc2xhKDAsIDEwMCUsIDUwJSwgMSk7XG4gICAgICAgICAgYmFyOiBmb287XG4gICAgICAgICAgZm9vOiBiYXI7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiKVxuXG4gIGRlc2NyaWJlICc6OmNvbnZlcnRDb250ZW50VG9IU0wnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGNvbG9yTWFya2VyLmNvbG9yLmFscGhhID0gMVxuICAgICAgY29sb3JNYXJrZXIuY29udmVydENvbnRlbnRUb0hTTCgpXG5cbiAgICBpdCAncmVwbGFjZXMgdGhlIHRleHQgaW4gdGhlIGVkaXRvciBieSB0aGUgaHNsIHZlcnNpb24nLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJcIlwiXG4gICAgICBib2R5IHtcbiAgICAgICAgY29sb3I6IGhzbCgwLCAxMDAlLCA1MCUpO1xuICAgICAgICBiYXI6IGZvbztcbiAgICAgICAgZm9vOiBiYXI7XG4gICAgICB9XG4gICAgICBcIlwiXCIpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgY29sb3IgYWxwaGEgaXMgbm90IDEnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBjb2xvck1hcmtlci5jb252ZXJ0Q29udGVudFRvSFNMKClcblxuICAgICAgaXQgJ3JlcGxhY2VzIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3IgYnkgdGhlIGhzbCB2ZXJzaW9uJywgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJcIlwiXG4gICAgICAgIGJvZHkge1xuICAgICAgICAgIGNvbG9yOiBoc2woMCwgMTAwJSwgNTAlKTtcbiAgICAgICAgICBiYXI6IGZvbztcbiAgICAgICAgICBmb286IGJhcjtcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIpXG4iXX0=

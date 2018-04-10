(function() {
  module.exports = {
    run: function() {
      var applyFont, body, fixer, fixerProto, triggerMeasurements;
      body = document.querySelector('body');
      triggerMeasurements = function(force) {
        atom.workspace.increaseFontSize();
        return atom.workspace.decreaseFontSize();
      };
      applyFont = function() {
        var font;
        font = "'" + atom.config.get('fonts.fontFamily') + "', " + atom.config.get('fonts.secondaryFonts');
        body.setAttribute('style', '--fonts-package-editorfont: ' + font + ';');
        return triggerMeasurements();
      };
      applyFont();
      this.observer = atom.config.observe('fonts.fontFamily', function() {
        return applyFont();
      });
      this.observer = atom.config.observe('fonts.secondaryFonts', function() {
        return applyFont();
      });
      setTimeout((function() {
        return triggerMeasurements();
      }), 500);
      if (document.getElementsByTagName('fonts-fixer').length === 0) {
        fixerProto = Object.create(HTMLElement.prototype);
        fixerProto.createdCallback = function() {
          this.innerHTML = "regular<b>bold<i>italic</i></b><i>italic</i>";
        };
        fixer = document.registerElement("fonts-fixer", {
          prototype: fixerProto
        });
        return atom.views.getView(atom.workspace).appendChild(new fixer());
      }
    },
    stop: function() {
      var body, ref;
      body = document.querySelector('body');
      body.removeAttribute('fonts-editor-font');
      return (ref = this.observer) != null ? ref.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9mb250cy9saWIvcnVubmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxHQUFBLEVBQUssU0FBQTtBQUNILFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFFUCxtQkFBQSxHQUFzQixTQUFDLEtBQUQ7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZixDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZixDQUFBO01BRm9CO01BSXRCLFNBQUEsR0FBWSxTQUFBO0FBQ1YsWUFBQTtRQUFBLElBQUEsR0FDRSxHQUFBLEdBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQURBLEdBRUEsS0FGQSxHQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEI7UUFFRixJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixFQUEyQiw4QkFBQSxHQUFpQyxJQUFqQyxHQUF3QyxHQUFuRTtlQUNBLG1CQUFBLENBQUE7TUFSVTtNQVdaLFNBQUEsQ0FBQTtNQUlBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGtCQUFwQixFQUF3QyxTQUFBO2VBQ2xELFNBQUEsQ0FBQTtNQURrRCxDQUF4QztNQUVaLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHNCQUFwQixFQUE0QyxTQUFBO2VBQ3RELFNBQUEsQ0FBQTtNQURzRCxDQUE1QztNQUtaLFVBQUEsQ0FBVyxDQUFDLFNBQUE7ZUFDVixtQkFBQSxDQUFBO01BRFUsQ0FBRCxDQUFYLEVBRUcsR0FGSDtNQUlBLElBQUcsUUFBUSxDQUFDLG9CQUFULENBQThCLGFBQTlCLENBQTRDLENBQUMsTUFBN0MsS0FBdUQsQ0FBMUQ7UUFHRSxVQUFBLEdBQWEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxXQUFXLENBQUEsU0FBekI7UUFDYixVQUFVLENBQUMsZUFBWCxHQUE2QixTQUFBO1VBQzNCLElBQUMsQ0FBQSxTQUFELEdBQWE7UUFEYztRQUk3QixLQUFBLEdBQVEsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsYUFBekIsRUFDTjtVQUFBLFNBQUEsRUFBVyxVQUFYO1NBRE07ZUFJUixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBbUQsSUFBQSxLQUFBLENBQUEsQ0FBbkQsRUFaRjs7SUFqQ0csQ0FBTDtJQStDQSxJQUFBLEVBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDUCxJQUFJLENBQUMsZUFBTCxDQUFxQixtQkFBckI7Z0RBRVMsQ0FBRSxPQUFYLENBQUE7SUFKSSxDQS9DTjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgcnVuOiAoKSAtPlxuICAgIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICAgIHRyaWdnZXJNZWFzdXJlbWVudHMgPSAoZm9yY2UpIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5pbmNyZWFzZUZvbnRTaXplKClcbiAgICAgIGF0b20ud29ya3NwYWNlLmRlY3JlYXNlRm9udFNpemUoKVxuXG4gICAgYXBwbHlGb250ID0gKCkgLT5cbiAgICAgIGZvbnQgPVxuICAgICAgICBcIidcIiArXG4gICAgICAgIGF0b20uY29uZmlnLmdldCgnZm9udHMuZm9udEZhbWlseScpICtcbiAgICAgICAgXCInLCBcIiArXG4gICAgICAgIGF0b20uY29uZmlnLmdldCgnZm9udHMuc2Vjb25kYXJ5Rm9udHMnKVxuXG4gICAgICBib2R5LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnLS1mb250cy1wYWNrYWdlLWVkaXRvcmZvbnQ6ICcgKyBmb250ICsgJzsnKVxuICAgICAgdHJpZ2dlck1lYXN1cmVtZW50cygpXG5cbiAgICAjIGFwcGx5IGZvbnRzIHdoZW4gYXRvbSBpcyByZWFkeVxuICAgIGFwcGx5Rm9udCgpXG5cbiAgICAjIGFwcGx5IGZvbnRzIHdoZW4gY29uZmlnIGNoYW5nZXNcbiAgICAjIGFmdGVyIGNvbmZpZyBjaGFuZ2VzIG1lYXN1cmVtZW50cyBhcmUgYWxyZWFkeSB0cmlnZ2VyZWQgYnkgYXRvbVxuICAgIEBvYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2ZvbnRzLmZvbnRGYW1pbHknLCAtPlxuICAgICAgYXBwbHlGb250KClcbiAgICBAb2JzZXJ2ZXIgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdmb250cy5zZWNvbmRhcnlGb250cycsIC0+XG4gICAgICBhcHBseUZvbnQoKVxuXG4gICAgIyBnaXZlIGNocm9taXVtIHNvbWUgdGltZSB0byBsb2FkIHRoZSBmb250c1xuICAgICMgdGhlbiB0cmlnZ2VyIG1lYXN1cmVtZW50c1xuICAgIHNldFRpbWVvdXQgKC0+XG4gICAgICB0cmlnZ2VyTWVhc3VyZW1lbnRzKClcbiAgICApLCA1MDBcblxuICAgIGlmIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb250cy1maXhlcicpLmxlbmd0aCBpcyAwXG4gICAgICAjIGNyZWF0ZSBhIGZpeGVyIGVsZW1lbnQgdGhhdCBmb3JjZXMgY2hyb21lIHRvIGxvYWQgZm9udCBzdHlsZXNcbiAgICAgICMgY29udGFpbnMgKnIqZWd1bGFyLCAqYipvbGQsICppKnRhbGljIGFuZCBpIGluIGJcbiAgICAgIGZpeGVyUHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50OjopXG4gICAgICBmaXhlclByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IC0+XG4gICAgICAgIEBpbm5lckhUTUwgPSBcInJlZ3VsYXI8Yj5ib2xkPGk+aXRhbGljPC9pPjwvYj48aT5pdGFsaWM8L2k+XCJcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGZpeGVyID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZm9udHMtZml4ZXJcIixcbiAgICAgICAgcHJvdG90eXBlOiBmaXhlclByb3RvXG4gICAgICApXG5cbiAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQobmV3IGZpeGVyKCkpXG5cbiAgc3RvcDogLT5cbiAgICBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG4gICAgYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2ZvbnRzLWVkaXRvci1mb250JylcblxuICAgIEBvYnNlcnZlcj8uZGlzcG9zZSgpXG4iXX0=

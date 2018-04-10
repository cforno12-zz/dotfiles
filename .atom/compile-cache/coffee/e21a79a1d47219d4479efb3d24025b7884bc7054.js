(function() {
  module.exports = {
    run: function() {
      var applyFont, body, fixer, fixerProto, triggerMeasurements;
      body = document.querySelector('body');
      triggerMeasurements = function(force) {
        atom.workspace.increaseFontSize();
        return atom.workspace.decreaseFontSize();
      };
      applyFont = function(font) {
        body.setAttribute('fonts-editor-font', font);
        return triggerMeasurements();
      };
      applyFont(atom.config.get('fonts.fontFamily'));
      this.observer = atom.config.observe('fonts.fontFamily', function() {
        return applyFont(atom.config.get('fonts.fontFamily'));
      });
      setTimeout((function() {
        return triggerMeasurements();
      }), 500);
      if (!document.getElementsByTagName('fonts-fixer')) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9mb250cy9saWIvcnVubmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxHQUFBLEVBQUssU0FBQTtBQUNILFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFFUCxtQkFBQSxHQUFzQixTQUFDLEtBQUQ7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZixDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZixDQUFBO01BRm9CO01BSXRCLFNBQUEsR0FBWSxTQUFDLElBQUQ7UUFDVixJQUFJLENBQUMsWUFBTCxDQUFrQixtQkFBbEIsRUFBdUMsSUFBdkM7ZUFDQSxtQkFBQSxDQUFBO01BRlU7TUFLWixTQUFBLENBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQURGO01BTUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isa0JBQXBCLEVBQXdDLFNBQUE7ZUFDbEQsU0FBQSxDQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBVjtNQURrRCxDQUF4QztNQUtaLFVBQUEsQ0FBVyxDQUFDLFNBQUE7ZUFDVixtQkFBQSxDQUFBO01BRFUsQ0FBRCxDQUFYLEVBRUcsR0FGSDtNQUlBLElBQUEsQ0FBTyxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsYUFBOUIsQ0FBUDtRQUdFLFVBQUEsR0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLFdBQVcsQ0FBQSxTQUF6QjtRQUNiLFVBQVUsQ0FBQyxlQUFYLEdBQTZCLFNBQUE7VUFDM0IsSUFBQyxDQUFBLFNBQUQsR0FBYTtRQURjO1FBSTdCLEtBQUEsR0FBUSxRQUFRLENBQUMsZUFBVCxDQUF5QixhQUF6QixFQUNOO1VBQUEsU0FBQSxFQUFXLFVBQVg7U0FETTtlQUlSLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxXQUFuQyxDQUFtRCxJQUFBLEtBQUEsQ0FBQSxDQUFuRCxFQVpGOztJQTNCRyxDQUFMO0lBeUNBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNQLElBQUksQ0FBQyxlQUFMLENBQXFCLG1CQUFyQjtnREFFUyxDQUFFLE9BQVgsQ0FBQTtJQUpJLENBekNOOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBydW46ICgpIC0+XG4gICAgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKVxuXG4gICAgdHJpZ2dlck1lYXN1cmVtZW50cyA9IChmb3JjZSkgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLmluY3JlYXNlRm9udFNpemUoKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZGVjcmVhc2VGb250U2l6ZSgpXG5cbiAgICBhcHBseUZvbnQgPSAoZm9udCkgLT5cbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKCdmb250cy1lZGl0b3ItZm9udCcsIGZvbnQpXG4gICAgICB0cmlnZ2VyTWVhc3VyZW1lbnRzKClcblxuICAgICMgYXBwbHkgZm9udHMgd2hlbiBhdG9tIGlzIHJlYWR5XG4gICAgYXBwbHlGb250KFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdmb250cy5mb250RmFtaWx5JylcbiAgICApXG5cbiAgICAjIGFwcGx5IGZvbnRzIHdoZW4gY29uZmlnIGNoYW5nZXNcbiAgICAjIGFmdGVyIGNvbmZpZyBjaGFuZ2VzIG1lYXN1cmVtZW50cyBhcmUgYWxyZWFkeSB0cmlnZ2VyZWQgYnkgYXRvbVxuICAgIEBvYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2ZvbnRzLmZvbnRGYW1pbHknLCAtPlxuICAgICAgYXBwbHlGb250KGF0b20uY29uZmlnLmdldCgnZm9udHMuZm9udEZhbWlseScpKVxuXG4gICAgIyBnaXZlIGNocm9taXVtIHNvbWUgdGltZSB0byBsb2FkIHRoZSBmb250c1xuICAgICMgdGhlbiB0cmlnZ2VyIG1lYXN1cmVtZW50c1xuICAgIHNldFRpbWVvdXQgKC0+XG4gICAgICB0cmlnZ2VyTWVhc3VyZW1lbnRzKClcbiAgICApLCA1MDBcblxuICAgIHVubGVzcyBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZm9udHMtZml4ZXInKVxuICAgICAgIyBjcmVhdGUgYSBmaXhlciBlbGVtZW50IHRoYXQgZm9yY2VzIGNocm9tZSB0byBsb2FkIGZvbnQgc3R5bGVzXG4gICAgICAjIGNvbnRhaW5zICpyKmVndWxhciwgKmIqb2xkLCAqaSp0YWxpYyBhbmQgaSBpbiBiXG4gICAgICBmaXhlclByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudDo6KVxuICAgICAgZml4ZXJQcm90by5jcmVhdGVkQ2FsbGJhY2sgPSAtPlxuICAgICAgICBAaW5uZXJIVE1MID0gXCJyZWd1bGFyPGI+Ym9sZDxpPml0YWxpYzwvaT48L2I+PGk+aXRhbGljPC9pPlwiXG4gICAgICAgIHJldHVyblxuXG4gICAgICBmaXhlciA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImZvbnRzLWZpeGVyXCIsXG4gICAgICAgIHByb3RvdHlwZTogZml4ZXJQcm90b1xuICAgICAgKVxuXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKG5ldyBmaXhlcigpKVxuXG4gIHN0b3A6IC0+XG4gICAgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKVxuICAgIGJvZHkucmVtb3ZlQXR0cmlidXRlKCdmb250cy1lZGl0b3ItZm9udCcpXG5cbiAgICBAb2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuIl19

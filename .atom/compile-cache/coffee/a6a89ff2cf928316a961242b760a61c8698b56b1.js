(function() {
  var ColorMarker, CompositeDisposable, fill, ref;

  ref = [], CompositeDisposable = ref[0], fill = ref[1];

  module.exports = ColorMarker = (function() {
    function ColorMarker(arg) {
      this.marker = arg.marker, this.color = arg.color, this.text = arg.text, this.invalid = arg.invalid, this.colorBuffer = arg.colorBuffer;
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      ref1 = {}, this.marker = ref1.marker, this.color = ref1.color, this.text = ref1.text, this.colorBuffer = ref1.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, ref1, scope, scopeChain;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.colorBuffer.editor.scopeDescriptorForBufferPosition != null ? this.colorBuffer.editor.scopeDescriptorForBufferPosition(range.start) : this.colorBuffer.editor.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = ((ref1 = this.colorBuffer.ignoredScopes) != null ? ref1 : []).some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (error) {
        e = error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getBufferRange = function() {
      return this.marker.getBufferRange();
    };

    ColorMarker.prototype.getScreenRange = function() {
      var ref1;
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = (ref1 = this.marker) != null ? ref1.getScreenRange() : void 0;
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      return this.convertContentInPlace('hex');
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      return this.convertContentInPlace('rgb');
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      return this.convertContentInPlace('rgba');
    };

    ColorMarker.prototype.convertContentToHSL = function() {
      return this.convertContentInPlace('hsl');
    };

    ColorMarker.prototype.convertContentToHSLA = function() {
      return this.convertContentInPlace('hsla');
    };

    ColorMarker.prototype.copyContentAsHex = function() {
      return atom.clipboard.write(this.convertContent('hex'));
    };

    ColorMarker.prototype.copyContentAsRGB = function() {
      return atom.clipboard.write(this.convertContent('rgb'));
    };

    ColorMarker.prototype.copyContentAsRGBA = function() {
      return atom.clipboard.write(this.convertContent('rgba'));
    };

    ColorMarker.prototype.copyContentAsHSL = function() {
      return atom.clipboard.write(this.convertContent('hsl'));
    };

    ColorMarker.prototype.copyContentAsHSLA = function() {
      return atom.clipboard.write(this.convertContent('hsla'));
    };

    ColorMarker.prototype.convertContentInPlace = function(mode) {
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), this.convertContent(mode));
    };

    ColorMarker.prototype.convertContent = function(mode) {
      if (fill == null) {
        fill = require('./utils').fill;
      }
      switch (mode) {
        case 'hex':
          return '#' + fill(this.color.hex, 6);
        case 'rgb':
          return "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
        case 'rgba':
          return "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
        case 'hsl':
          return "hsl(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%)";
        case 'hsla':
          return "hsla(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%, " + this.color.alpha + ")";
      }
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItbWFya2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBOEIsRUFBOUIsRUFBQyw0QkFBRCxFQUFzQjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHFCQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEsYUFBQSxRQUFRLElBQUMsQ0FBQSxZQUFBLE9BQU8sSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsY0FBQSxTQUFTLElBQUMsQ0FBQSxrQkFBQTtNQUNoRCxJQUE4QywyQkFBOUM7UUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsc0JBQXhCOztNQUVBLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQztNQUNkLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNyQyxJQUFHLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQUg7WUFDRSxLQUFDLENBQUEsMEJBQUQsQ0FBQTttQkFDQSxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUZGO1dBQUEsTUFBQTttQkFJRSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBSkY7O1FBRHFDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFw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RGlzcG9zYWJsZSwgZmlsbF0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb2xvck1hcmtlclxuICBjb25zdHJ1Y3RvcjogKHtAbWFya2VyLCBAY29sb3IsIEB0ZXh0LCBAaW52YWxpZCwgQGNvbG9yQnVmZmVyfSkgLT5cbiAgICB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgQ29tcG9zaXRlRGlzcG9zYWJsZT9cblxuICAgIEBpZCA9IEBtYXJrZXIuaWRcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtYXJrZXIub25EaWREZXN0cm95ID0+IEBtYXJrZXJXYXNEZXN0cm95ZWQoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWFya2VyLm9uRGlkQ2hhbmdlID0+XG4gICAgICBpZiBAbWFya2VyLmlzVmFsaWQoKVxuICAgICAgICBAaW52YWxpZGF0ZVNjcmVlblJhbmdlQ2FjaGUoKVxuICAgICAgICBAY2hlY2tNYXJrZXJTY29wZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBkZXN0cm95KClcblxuICAgIEBjaGVja01hcmtlclNjb3BlKClcblxuICBkZXN0cm95OiAtPlxuICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG4gICAgQG1hcmtlci5kZXN0cm95KClcblxuICBtYXJrZXJXYXNEZXN0cm95ZWQ6IC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB7QG1hcmtlciwgQGNvbG9yLCBAdGV4dCwgQGNvbG9yQnVmZmVyfSA9IHt9XG4gICAgQGRlc3Ryb3llZCA9IHRydWVcblxuICBtYXRjaDogKHByb3BlcnRpZXMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBkZXN0cm95ZWRcblxuICAgIGJvb2wgPSB0cnVlXG5cbiAgICBpZiBwcm9wZXJ0aWVzLmJ1ZmZlclJhbmdlP1xuICAgICAgYm9vbCAmJj0gQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmlzRXF1YWwocHJvcGVydGllcy5idWZmZXJSYW5nZSlcbiAgICBib29sICYmPSBwcm9wZXJ0aWVzLmNvbG9yLmlzRXF1YWwoQGNvbG9yKSBpZiBwcm9wZXJ0aWVzLmNvbG9yP1xuICAgIGJvb2wgJiY9IHByb3BlcnRpZXMubWF0Y2ggaXMgQHRleHQgaWYgcHJvcGVydGllcy5tYXRjaD9cbiAgICBib29sICYmPSBwcm9wZXJ0aWVzLnRleHQgaXMgQHRleHQgaWYgcHJvcGVydGllcy50ZXh0P1xuXG4gICAgYm9vbFxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgIG91dCA9IHtcbiAgICAgIG1hcmtlcklkOiBTdHJpbmcoQG1hcmtlci5pZClcbiAgICAgIGJ1ZmZlclJhbmdlOiBAbWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc2VyaWFsaXplKClcbiAgICAgIGNvbG9yOiBAY29sb3Iuc2VyaWFsaXplKClcbiAgICAgIHRleHQ6IEB0ZXh0XG4gICAgICB2YXJpYWJsZXM6IEBjb2xvci52YXJpYWJsZXNcbiAgICB9XG4gICAgb3V0LmludmFsaWQgPSB0cnVlIHVubGVzcyBAY29sb3IuaXNWYWxpZCgpXG4gICAgb3V0XG5cbiAgY2hlY2tNYXJrZXJTY29wZTogKGZvcmNlRXZhbHVhdGlvbj1mYWxzZSkgLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZCBvciAhQGNvbG9yQnVmZmVyP1xuICAgIHJhbmdlID0gQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgICB0cnlcbiAgICAgIHNjb3BlID0gaWYgQGNvbG9yQnVmZmVyLmVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbj9cbiAgICAgICAgQGNvbG9yQnVmZmVyLmVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydClcbiAgICAgIGVsc2VcbiAgICAgICAgQGNvbG9yQnVmZmVyLmVkaXRvci5kaXNwbGF5QnVmZmVyLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLnN0YXJ0KVxuICAgICAgc2NvcGVDaGFpbiA9IHNjb3BlLmdldFNjb3BlQ2hhaW4oKVxuXG4gICAgICByZXR1cm4gaWYgbm90IHNjb3BlQ2hhaW4gb3IgKCFmb3JjZUV2YWx1YXRpb24gYW5kIHNjb3BlQ2hhaW4gaXMgQGxhc3RTY29wZUNoYWluKVxuXG4gICAgICBAaWdub3JlZCA9IChAY29sb3JCdWZmZXIuaWdub3JlZFNjb3BlcyA/IFtdKS5zb21lIChzY29wZVJlZ0V4cCkgLT5cbiAgICAgICAgc2NvcGVDaGFpbi5tYXRjaChzY29wZVJlZ0V4cClcblxuICAgICAgQGxhc3RTY29wZUNoYWluID0gc2NvcGVDaGFpblxuICAgIGNhdGNoIGVcbiAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gIGlzSWdub3JlZDogLT4gQGlnbm9yZWRcblxuICBnZXRCdWZmZXJSYW5nZTogLT4gQG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgZ2V0U2NyZWVuUmFuZ2U6IC0+IEBzY3JlZW5SYW5nZUNhY2hlID89IEBtYXJrZXI/LmdldFNjcmVlblJhbmdlKClcblxuICBpbnZhbGlkYXRlU2NyZWVuUmFuZ2VDYWNoZTogLT4gQHNjcmVlblJhbmdlQ2FjaGUgPSBudWxsXG5cbiAgY29udmVydENvbnRlbnRUb0hleDogLT4gQGNvbnZlcnRDb250ZW50SW5QbGFjZSgnaGV4JylcblxuICBjb252ZXJ0Q29udGVudFRvUkdCOiAtPiBAY29udmVydENvbnRlbnRJblBsYWNlKCdyZ2InKVxuXG4gIGNvbnZlcnRDb250ZW50VG9SR0JBOiAtPiBAY29udmVydENvbnRlbnRJblBsYWNlKCdyZ2JhJylcblxuICBjb252ZXJ0Q29udGVudFRvSFNMOiAtPiBAY29udmVydENvbnRlbnRJblBsYWNlKCdoc2wnKVxuXG4gIGNvbnZlcnRDb250ZW50VG9IU0xBOiAtPiBAY29udmVydENvbnRlbnRJblBsYWNlKCdoc2xhJylcblxuICBjb3B5Q29udGVudEFzSGV4OiAtPiBhdG9tLmNsaXBib2FyZC53cml0ZShAY29udmVydENvbnRlbnQoJ2hleCcpKVxuXG4gIGNvcHlDb250ZW50QXNSR0I6IC0+IGF0b20uY2xpcGJvYXJkLndyaXRlKEBjb252ZXJ0Q29udGVudCgncmdiJykpXG5cbiAgY29weUNvbnRlbnRBc1JHQkE6IC0+IGF0b20uY2xpcGJvYXJkLndyaXRlKEBjb252ZXJ0Q29udGVudCgncmdiYScpKVxuXG4gIGNvcHlDb250ZW50QXNIU0w6IC0+IGF0b20uY2xpcGJvYXJkLndyaXRlKEBjb252ZXJ0Q29udGVudCgnaHNsJykpXG5cbiAgY29weUNvbnRlbnRBc0hTTEE6IC0+IGF0b20uY2xpcGJvYXJkLndyaXRlKEBjb252ZXJ0Q29udGVudCgnaHNsYScpKVxuXG4gIGNvbnZlcnRDb250ZW50SW5QbGFjZTogKG1vZGUpIC0+XG4gICAgQGNvbG9yQnVmZmVyLmVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0SW5SYW5nZShAbWFya2VyLmdldEJ1ZmZlclJhbmdlKCksIEBjb252ZXJ0Q29udGVudChtb2RlKSlcblxuICBjb252ZXJ0Q29udGVudDogKG1vZGUpIC0+XG4gICAge2ZpbGx9ID0gcmVxdWlyZSAnLi91dGlscycgdW5sZXNzIGZpbGw/XG5cbiAgICBzd2l0Y2ggbW9kZVxuICAgICAgd2hlbiAnaGV4J1xuICAgICAgICAnIycgKyBmaWxsKEBjb2xvci5oZXgsIDYpXG4gICAgICB3aGVuICdyZ2InXG4gICAgICAgIFwicmdiKCN7TWF0aC5yb3VuZCBAY29sb3IucmVkfSwgI3tNYXRoLnJvdW5kIEBjb2xvci5ncmVlbn0sICN7TWF0aC5yb3VuZCBAY29sb3IuYmx1ZX0pXCJcbiAgICAgIHdoZW4gJ3JnYmEnXG4gICAgICAgIFwicmdiYSgje01hdGgucm91bmQgQGNvbG9yLnJlZH0sICN7TWF0aC5yb3VuZCBAY29sb3IuZ3JlZW59LCAje01hdGgucm91bmQgQGNvbG9yLmJsdWV9LCAje0Bjb2xvci5hbHBoYX0pXCJcbiAgICAgIHdoZW4gJ2hzbCdcbiAgICAgICAgXCJoc2woI3tNYXRoLnJvdW5kIEBjb2xvci5odWV9LCAje01hdGgucm91bmQgQGNvbG9yLnNhdHVyYXRpb259JSwgI3tNYXRoLnJvdW5kIEBjb2xvci5saWdodG5lc3N9JSlcIlxuICAgICAgd2hlbiAnaHNsYSdcbiAgICAgICAgXCJoc2xhKCN7TWF0aC5yb3VuZCBAY29sb3IuaHVlfSwgI3tNYXRoLnJvdW5kIEBjb2xvci5zYXR1cmF0aW9ufSUsICN7TWF0aC5yb3VuZCBAY29sb3IubGlnaHRuZXNzfSUsICN7QGNvbG9yLmFscGhhfSlcIlxuIl19

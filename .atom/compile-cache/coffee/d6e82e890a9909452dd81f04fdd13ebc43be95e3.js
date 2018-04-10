(function() {
  var KillRing;

  module.exports = KillRing = (function() {
    function KillRing() {
      this.currentIndex = -1;
      this.entries = [];
      this.limit = 500;
      this.lastClip = void 0;
    }

    KillRing.prototype.fork = function() {
      var fork;
      fork = new KillRing;
      fork.setEntries(this.entries);
      fork.currentIndex = this.currentIndex;
      fork.lastClip = this.lastClip;
      return fork;
    };

    KillRing.prototype.isEmpty = function() {
      return this.entries.length === 0;
    };

    KillRing.prototype.reset = function() {
      return this.entries = [];
    };

    KillRing.prototype.getEntries = function() {
      return this.entries.slice();
    };

    KillRing.prototype.setEntries = function(entries) {
      this.entries = entries.slice();
      this.currentIndex = this.entries.length - 1;
      return this;
    };

    KillRing.prototype.push = function(text) {
      this.entries.push(text);
      if (this.entries.length > this.limit) {
        this.entries.shift();
      }
      return this.currentIndex = this.entries.length - 1;
    };

    KillRing.prototype.append = function(text) {
      var index;
      if (this.entries.length === 0) {
        return this.push(text);
      } else {
        index = this.entries.length - 1;
        this.entries[index] = this.entries[index] + text;
        return this.currentIndex = this.entries.length - 1;
      }
    };

    KillRing.prototype.prepend = function(text) {
      var index;
      if (this.entries.length === 0) {
        return this.push(text);
      } else {
        index = this.entries.length - 1;
        this.entries[index] = "" + text + this.entries[index];
        return this.currentIndex = this.entries.length - 1;
      }
    };

    KillRing.prototype.replace = function(text) {
      var index;
      if (this.entries.length === 0) {
        return this.push(text);
      } else {
        index = this.entries.length - 1;
        this.entries[index] = text;
        return this.currentIndex = this.entries.length - 1;
      }
    };

    KillRing.prototype.getCurrentEntry = function() {
      if (this.entries.length === 0) {
        return null;
      } else {
        return this.entries[this.currentIndex];
      }
    };

    KillRing.prototype.rotate = function(n) {
      if (this.entries.length === 0) {
        return null;
      }
      this.currentIndex = (this.currentIndex + n) % this.entries.length;
      if (this.currentIndex < 0) {
        this.currentIndex += this.entries.length;
      }
      return this.entries[this.currentIndex];
    };

    KillRing.global = new KillRing;

    KillRing.pullFromClipboard = function(killRings) {
      var entries, text;
      text = atom.clipboard.read();
      if (text !== KillRing.lastClip) {
        KillRing.global.push(text);
        KillRing.lastClip = text;
        if (killRings.length > 1) {
          entries = text.split(/\r?\n/);
          return killRings.forEach(function(killRing, i) {
            var entry, ref;
            entry = (ref = entries[i]) != null ? ref : '';
            return killRing.push(entry);
          });
        }
      }
    };

    KillRing.pushToClipboard = function() {
      var text;
      text = KillRing.global.getCurrentEntry();
      atom.clipboard.write(text);
      return KillRing.lastClip = text;
    };

    return KillRing;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2tpbGwtcmluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxrQkFBQTtNQUNYLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUM7TUFDakIsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBSkQ7O3VCQU1iLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJO01BQ1gsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBQyxDQUFBLE9BQWpCO01BQ0EsSUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBQyxDQUFBO01BQ3JCLElBQUksQ0FBQyxRQUFMLEdBQWdCLElBQUMsQ0FBQTthQUNqQjtJQUxJOzt1QkFPTixPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQjtJQURaOzt1QkFHVCxLQUFBLEdBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFETjs7dUJBR1AsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBQTtJQURVOzt1QkFHWixVQUFBLEdBQVksU0FBQyxPQUFEO01BQ1YsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFPLENBQUMsS0FBUixDQUFBO01BQ1gsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCO2FBQ2xDO0lBSFU7O3VCQUtaLElBQUEsR0FBTSxTQUFDLElBQUQ7TUFDSixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFkO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FB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QUFWLEdBQW1CLENBQXRCO1VBQ0UsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWDtpQkFDVixTQUFTLENBQUMsT0FBVixDQUFrQixTQUFDLFFBQUQsRUFBVyxDQUFYO0FBQ2hCLGdCQUFBO1lBQUEsS0FBQSxzQ0FBcUI7bUJBQ3JCLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBZDtVQUZnQixDQUFsQixFQUZGO1NBSEY7O0lBRmtCOztJQVdwQixRQUFDLENBQUEsZUFBRCxHQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFoQixDQUFBO01BQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLElBQXJCO2FBQ0EsUUFBUSxDQUFDLFFBQVQsR0FBb0I7SUFISjs7Ozs7QUFwRnBCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgS2lsbFJpbmdcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGN1cnJlbnRJbmRleCA9IC0xXG4gICAgQGVudHJpZXMgPSBbXVxuICAgIEBsaW1pdCA9IDUwMFxuICAgIEBsYXN0Q2xpcCA9IHVuZGVmaW5lZFxuXG4gIGZvcms6IC0+XG4gICAgZm9yayA9IG5ldyBLaWxsUmluZ1xuICAgIGZvcmsuc2V0RW50cmllcyhAZW50cmllcylcbiAgICBmb3JrLmN1cnJlbnRJbmRleCA9IEBjdXJyZW50SW5kZXhcbiAgICBmb3JrLmxhc3RDbGlwID0gQGxhc3RDbGlwXG4gICAgZm9ya1xuXG4gIGlzRW1wdHk6IC0+XG4gICAgQGVudHJpZXMubGVuZ3RoID09IDBcblxuICByZXNldDogLT5cbiAgICBAZW50cmllcyA9IFtdXG5cbiAgZ2V0RW50cmllczogLT5cbiAgICBAZW50cmllcy5zbGljZSgpXG5cbiAgc2V0RW50cmllczogKGVudHJpZXMpIC0+XG4gICAgQGVudHJpZXMgPSBlbnRyaWVzLnNsaWNlKClcbiAgICBAY3VycmVudEluZGV4ID0gQGVudHJpZXMubGVuZ3RoIC0gMVxuICAgIHRoaXNcblxuICBwdXNoOiAodGV4dCkgLT5cbiAgICBAZW50cmllcy5wdXNoKHRleHQpXG4gICAgaWYgQGVudHJpZXMubGVuZ3RoID4gQGxpbWl0XG4gICAgICBAZW50cmllcy5zaGlmdCgpXG4gICAgQGN1cnJlbnRJbmRleCA9IEBlbnRyaWVzLmxlbmd0aCAtIDFcblxuICBhcHBlbmQ6ICh0ZXh0KSAtPlxuICAgIGlmIEBlbnRyaWVzLmxlbmd0aCA9PSAwXG4gICAgICBAcHVzaCh0ZXh0KVxuICAgIGVsc2VcbiAgICAgIGluZGV4ID0gQGVudHJpZXMubGVuZ3RoIC0gMVxuICAgICAgQGVudHJpZXNbaW5kZXhdID0gQGVudHJpZXNbaW5kZXhdICsgdGV4dFxuICAgICAgQGN1cnJlbnRJbmRleCA9IEBlbnRyaWVzLmxlbmd0aCAtIDFcblxuICBwcmVwZW5kOiAodGV4dCkgLT5cbiAgICBpZiBAZW50cmllcy5sZW5ndGggPT0gMFxuICAgICAgQHB1c2godGV4dClcbiAgICBlbHNlXG4gICAgICBpbmRleCA9IEBlbnRyaWVzLmxlbmd0aCAtIDFcbiAgICAgIEBlbnRyaWVzW2luZGV4XSA9IFwiI3t0ZXh0fSN7QGVudHJpZXNbaW5kZXhdfVwiXG4gICAgICBAY3VycmVudEluZGV4ID0gQGVudHJpZXMubGVuZ3RoIC0gMVxuXG4gIHJlcGxhY2U6ICh0ZXh0KSAtPlxuICAgIGlmIEBlbnRyaWVzLmxlbmd0aCA9PSAwXG4gICAgICBAcHVzaCh0ZXh0KVxuICAgIGVsc2VcbiAgICAgIGluZGV4ID0gQGVudHJpZXMubGVuZ3RoIC0gMVxuICAgICAgQGVudHJpZXNbaW5kZXhdID0gdGV4dFxuICAgICAgQGN1cnJlbnRJbmRleCA9IEBlbnRyaWVzLmxlbmd0aCAtIDFcblxuICBnZXRDdXJyZW50RW50cnk6IC0+XG4gICAgaWYgQGVudHJpZXMubGVuZ3RoID09IDBcbiAgICAgIHJldHVybiBudWxsXG4gICAgZWxzZVxuICAgICAgQGVudHJpZXNbQGN1cnJlbnRJbmRleF1cblxuICByb3RhdGU6IChuKSAtPlxuICAgIHJldHVybiBudWxsIGlmIEBlbnRyaWVzLmxlbmd0aCA9PSAwXG4gICAgQGN1cnJlbnRJbmRleCA9IChAY3VycmVudEluZGV4ICsgbikgJSBAZW50cmllcy5sZW5ndGhcbiAgICBAY3VycmVudEluZGV4ICs9IEBlbnRyaWVzLmxlbmd0aCBpZiBAY3VycmVudEluZGV4IDwgMFxuICAgIHJldHVybiBAZW50cmllc1tAY3VycmVudEluZGV4XVxuXG4gIEBnbG9iYWwgPSBuZXcgS2lsbFJpbmdcblxuICBAcHVsbEZyb21DbGlwYm9hcmQ6IChraWxsUmluZ3MpIC0+XG4gICAgdGV4dCA9IGF0b20uY2xpcGJvYXJkLnJlYWQoKVxuICAgIGlmIHRleHQgIT0gS2lsbFJpbmcubGFzdENsaXBcbiAgICAgIEtpbGxSaW5nLmdsb2JhbC5wdXNoKHRleHQpXG4gICAgICBLaWxsUmluZy5sYXN0Q2xpcCA9IHRleHRcbiAgICAgIGlmIGtpbGxSaW5ncy5sZW5ndGggPiAxXG4gICAgICAgIGVudHJpZXMgPSB0ZXh0LnNwbGl0KC9cXHI/XFxuLylcbiAgICAgICAga2lsbFJpbmdzLmZvckVhY2ggKGtpbGxSaW5nLCBpKSAtPlxuICAgICAgICAgIGVudHJ5ID0gZW50cmllc1tpXSA/ICcnXG4gICAgICAgICAga2lsbFJpbmcucHVzaChlbnRyeSlcblxuICBAcHVzaFRvQ2xpcGJvYXJkOiAtPlxuICAgIHRleHQgPSBLaWxsUmluZy5nbG9iYWwuZ2V0Q3VycmVudEVudHJ5KClcbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZSh0ZXh0KVxuICAgIEtpbGxSaW5nLmxhc3RDbGlwID0gdGV4dFxuIl19

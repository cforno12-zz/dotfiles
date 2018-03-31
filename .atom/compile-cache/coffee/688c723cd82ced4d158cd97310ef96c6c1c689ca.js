(function() {
  var CompositeDisposable, EventsDelegation, StickyTitle;

  EventsDelegation = require('atom-utils').EventsDelegation;

  CompositeDisposable = null;

  module.exports = StickyTitle = (function() {
    EventsDelegation.includeInto(StickyTitle);

    function StickyTitle(stickies, scrollContainer) {
      this.stickies = stickies;
      this.scrollContainer = scrollContainer;
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.subscriptions = new CompositeDisposable;
      Array.prototype.forEach.call(this.stickies, function(sticky) {
        sticky.parentNode.style.height = sticky.offsetHeight + 'px';
        return sticky.style.width = sticky.offsetWidth + 'px';
      });
      this.subscriptions.add(this.subscribeTo(this.scrollContainer, {
        'scroll': (function(_this) {
          return function(e) {
            return _this.scroll(e);
          };
        })(this)
      }));
    }

    StickyTitle.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.stickies = null;
      return this.scrollContainer = null;
    };

    StickyTitle.prototype.scroll = function(e) {
      var delta;
      delta = this.lastScrollTop ? this.lastScrollTop - this.scrollContainer.scrollTop : 0;
      Array.prototype.forEach.call(this.stickies, (function(_this) {
        return function(sticky, i) {
          var nextSticky, nextTop, parentTop, prevSticky, prevTop, scrollTop, top;
          nextSticky = _this.stickies[i + 1];
          prevSticky = _this.stickies[i - 1];
          scrollTop = _this.scrollContainer.getBoundingClientRect().top;
          parentTop = sticky.parentNode.getBoundingClientRect().top;
          top = sticky.getBoundingClientRect().top;
          if (parentTop < scrollTop) {
            if (!sticky.classList.contains('absolute')) {
              sticky.classList.add('fixed');
              sticky.style.top = scrollTop + 'px';
              if (nextSticky != null) {
                nextTop = nextSticky.parentNode.getBoundingClientRect().top;
                if (top + sticky.offsetHeight >= nextTop) {
                  sticky.classList.add('absolute');
                  return sticky.style.top = _this.scrollContainer.scrollTop + 'px';
                }
              }
            }
          } else {
            sticky.classList.remove('fixed');
            if ((prevSticky != null) && prevSticky.classList.contains('absolute')) {
              prevTop = prevSticky.getBoundingClientRect().top;
              if (delta < 0) {
                prevTop -= prevSticky.offsetHeight;
              }
              if (scrollTop <= prevTop) {
                prevSticky.classList.remove('absolute');
                return prevSticky.style.top = scrollTop + 'px';
              }
            }
          }
        };
      })(this));
      return this.lastScrollTop = this.scrollContainer.scrollTop;
    };

    return StickyTitle;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvc3RpY2t5LXRpdGxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsbUJBQW9CLE9BQUEsQ0FBUSxZQUFSOztFQUNyQixtQkFBQSxHQUFzQjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLFdBQTdCOztJQUVhLHFCQUFDLFFBQUQsRUFBWSxlQUFaO01BQUMsSUFBQyxDQUFBLFdBQUQ7TUFBVyxJQUFDLENBQUEsa0JBQUQ7O1FBQ3ZCLHNCQUF1QixPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7O01BRXZDLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsS0FBSyxDQUFBLFNBQUUsQ0FBQSxPQUFPLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsUUFBckIsRUFBK0IsU0FBQyxNQUFEO1FBQzdCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQXhCLEdBQWlDLE1BQU0sQ0FBQyxZQUFQLEdBQXNCO2VBQ3ZELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixNQUFNLENBQUMsV0FBUCxHQUFxQjtNQUZiLENBQS9CO01BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLGVBQWQsRUFBK0I7UUFBQSxRQUFBLEVBQVUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUMxRCxLQUFDLENBQUEsTUFBRCxDQUFRLENBQVI7VUFEMEQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7T0FBL0IsQ0FBbkI7SUFSVzs7MEJBV2IsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVk7YUFDWixJQUFDLENBQUEsZUFBRCxHQUFtQjtJQUhaOzswQkFLVCxNQUFBLEdBQVEsU0FBQyxDQUFEO0FBQ04sVUFBQTtNQUFBLEtBQUEsR0FBVyxJQUFDLENBQUEsYUFBSixHQUNOLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxlQUFlLENBQUMsU0FENUIsR0FHTjtNQUVGLEtBQUssQ0FBQSxTQUFFLENBQUEsT0FBTyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLFFBQXJCLEVBQStCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFELEVBQVMsQ0FBVDtBQUM3QixjQUFBO1VBQUEsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxHQUFJLENBQUo7VUFDdkIsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxHQUFJLENBQUo7VUFDdkIsU0FBQSxHQUFZLEtBQUMsQ0FBQSxlQUFlLENBQUMscUJBQWpCLENBQUEsQ0FBd0MsQ0FBQztVQUNyRCxTQUFBLEdBQVksTUFBTSxDQUFDLFVBQVUsQ0FBQyxxQkFBbEIsQ0FBQSxDQUF5QyxDQUFDO1VBQ3JELE1BQU8sTUFBTSxDQUFDLHFCQUFQLENBQUE7VUFFUixJQUFHLFNBQUEsR0FBWSxTQUFmO1lBQ0UsSUFBQSxDQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBakIsQ0FBMEIsVUFBMUIsQ0FBUDtjQUNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsT0FBckI7Y0FDQSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWIsR0FBbUIsU0FBQSxHQUFZO2NBRS9CLElBQUcsa0JBQUg7Z0JBQ0UsT0FBQSxHQUFVLFVBQVUsQ0FBQyxVQUFVLENBQUMscUJBQXRCLENBQUEsQ0FBNkMsQ0FBQztnQkFDeEQsSUFBRyxHQUFBLEdBQU0sTUFBTSxDQUFDLFlBQWIsSUFBNkIsT0FBaEM7a0JBQ0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixVQUFyQjt5QkFDQSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWIsR0FBbUIsS0FBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixHQUE2QixLQUZsRDtpQkFGRjtlQUpGO2FBREY7V0FBQSxNQUFBO1lBWUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFqQixDQUF3QixPQUF4QjtZQUVBLElBQUcsb0JBQUEsSUFBZ0IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFyQixDQUE4QixVQUE5QixDQUFuQjtjQUNFLE9BQUEsR0FBVSxVQUFVLENBQUMscUJBQVgsQ0FBQSxDQUFrQyxDQUFDO2NBQzdDLElBQXNDLEtBQUEsR0FBUSxDQUE5QztnQkFBQSxPQUFBLElBQVcsVUFBVSxDQUFDLGFBQXRCOztjQUVBLElBQUcsU0FBQSxJQUFhLE9BQWhCO2dCQUNFLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBckIsQ0FBNEIsVUFBNUI7dUJBQ0EsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFqQixHQUF1QixTQUFBLEdBQVksS0FGckM7ZUFKRjthQWRGOztRQVA2QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0I7YUE2QkEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLGVBQWUsQ0FBQztJQW5DNUI7Ozs7O0FBdkJWIiwic291cmNlc0NvbnRlbnQiOlsie0V2ZW50c0RlbGVnYXRpb259ID0gcmVxdWlyZSAnYXRvbS11dGlscydcbkNvbXBvc2l0ZURpc3Bvc2FibGUgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0aWNreVRpdGxlXG4gIEV2ZW50c0RlbGVnYXRpb24uaW5jbHVkZUludG8odGhpcylcblxuICBjb25zdHJ1Y3RvcjogKEBzdGlja2llcywgQHNjcm9sbENvbnRhaW5lcikgLT5cbiAgICBDb21wb3NpdGVEaXNwb3NhYmxlID89IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQXJyYXk6OmZvckVhY2guY2FsbCBAc3RpY2tpZXMsIChzdGlja3kpIC0+XG4gICAgICBzdGlja3kucGFyZW50Tm9kZS5zdHlsZS5oZWlnaHQgPSBzdGlja3kub2Zmc2V0SGVpZ2h0ICsgJ3B4J1xuICAgICAgc3RpY2t5LnN0eWxlLndpZHRoID0gc3RpY2t5Lm9mZnNldFdpZHRoICsgJ3B4J1xuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBzdWJzY3JpYmVUbyBAc2Nyb2xsQ29udGFpbmVyLCAnc2Nyb2xsJzogKGUpID0+XG4gICAgICBAc2Nyb2xsKGUpXG5cbiAgZGlzcG9zZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3RpY2tpZXMgPSBudWxsXG4gICAgQHNjcm9sbENvbnRhaW5lciA9IG51bGxcblxuICBzY3JvbGw6IChlKSAtPlxuICAgIGRlbHRhID0gaWYgQGxhc3RTY3JvbGxUb3BcbiAgICAgIEBsYXN0U2Nyb2xsVG9wIC0gQHNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3BcbiAgICBlbHNlXG4gICAgICAwXG5cbiAgICBBcnJheTo6Zm9yRWFjaC5jYWxsIEBzdGlja2llcywgKHN0aWNreSwgaSkgPT5cbiAgICAgIG5leHRTdGlja3kgPSBAc3RpY2tpZXNbaSArIDFdXG4gICAgICBwcmV2U3RpY2t5ID0gQHN0aWNraWVzW2kgLSAxXVxuICAgICAgc2Nyb2xsVG9wID0gQHNjcm9sbENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgIHBhcmVudFRvcCA9IHN0aWNreS5wYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAge3RvcH0gPSBzdGlja3kuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgaWYgcGFyZW50VG9wIDwgc2Nyb2xsVG9wXG4gICAgICAgIHVubGVzcyBzdGlja3kuY2xhc3NMaXN0LmNvbnRhaW5zKCdhYnNvbHV0ZScpXG4gICAgICAgICAgc3RpY2t5LmNsYXNzTGlzdC5hZGQgJ2ZpeGVkJ1xuICAgICAgICAgIHN0aWNreS5zdHlsZS50b3AgPSBzY3JvbGxUb3AgKyAncHgnXG5cbiAgICAgICAgICBpZiBuZXh0U3RpY2t5P1xuICAgICAgICAgICAgbmV4dFRvcCA9IG5leHRTdGlja3kucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgICAgIGlmIHRvcCArIHN0aWNreS5vZmZzZXRIZWlnaHQgPj0gbmV4dFRvcFxuICAgICAgICAgICAgICBzdGlja3kuY2xhc3NMaXN0LmFkZCgnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICBzdGlja3kuc3R5bGUudG9wID0gQHNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3AgKyAncHgnXG5cbiAgICAgIGVsc2VcbiAgICAgICAgc3RpY2t5LmNsYXNzTGlzdC5yZW1vdmUgJ2ZpeGVkJ1xuXG4gICAgICAgIGlmIHByZXZTdGlja3k/IGFuZCBwcmV2U3RpY2t5LmNsYXNzTGlzdC5jb250YWlucygnYWJzb2x1dGUnKVxuICAgICAgICAgIHByZXZUb3AgPSBwcmV2U3RpY2t5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICAgIHByZXZUb3AgLT0gcHJldlN0aWNreS5vZmZzZXRIZWlnaHQgaWYgZGVsdGEgPCAwXG5cbiAgICAgICAgICBpZiBzY3JvbGxUb3AgPD0gcHJldlRvcFxuICAgICAgICAgICAgcHJldlN0aWNreS5jbGFzc0xpc3QucmVtb3ZlKCdhYnNvbHV0ZScpXG4gICAgICAgICAgICBwcmV2U3RpY2t5LnN0eWxlLnRvcCA9IHNjcm9sbFRvcCArICdweCdcblxuICAgIEBsYXN0U2Nyb2xsVG9wID0gQHNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3BcbiJdfQ==

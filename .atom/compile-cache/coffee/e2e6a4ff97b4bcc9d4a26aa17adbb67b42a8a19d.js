(function() {
  var IndentationListView, IndentationManager, SelectListView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectListView = require('atom-space-pen-views').SelectListView;

  IndentationManager = require('./indentation-manager');

  module.exports = IndentationListView = (function(superClass) {
    extend(IndentationListView, superClass);

    function IndentationListView() {
      return IndentationListView.__super__.constructor.apply(this, arguments);
    }

    IndentationListView.prototype.initialize = function() {
      IndentationListView.__super__.initialize.apply(this, arguments);
      this.addClass('auto-detect-indentation-selector');
      return this.list.addClass('mark-active');
    };

    IndentationListView.prototype.getFilterKey = function() {
      return 'name';
    };

    IndentationListView.prototype.destroy = function() {
      return this.cancel();
    };

    IndentationListView.prototype.viewForItem = function(indentation) {
      var element;
      element = document.createElement('li');
      if (indentation.name === this.currentIndentation) {
        element.classList.add('active');
      }
      element.textContent = indentation.name;
      return element;
    };

    IndentationListView.prototype.cancelled = function() {
      var ref;
      if ((ref = this.panel) != null) {
        ref.destroy();
      }
      this.panel = null;
      return this.currentIndentation = null;
    };

    IndentationListView.prototype.confirmed = function(indentation) {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      IndentationManager.setIndentation(editor, indentation);
      return this.cancel();
    };

    IndentationListView.prototype.attach = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      return this.focusFilterEditor();
    };

    IndentationListView.prototype.toggle = function() {
      var editor;
      if (this.panel != null) {
        return this.cancel();
      } else {
        editor = atom.workspace.getActiveTextEditor();
        if (editor) {
          this.currentIndentation = IndentationManager.getIndentation(editor);
          this.setItems(IndentationManager.getIndentations());
          return this.attach();
        }
      }
    };

    return IndentationListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvLWRldGVjdC1pbmRlbnRhdGlvbi9saWIvaW5kZW50YXRpb24tbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdURBQUE7SUFBQTs7O0VBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDbkIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSOztFQUdyQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O2tDQUNKLFVBQUEsR0FBWSxTQUFBO01BQ1YscURBQUEsU0FBQTtNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsa0NBQVY7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBZSxhQUFmO0lBSlU7O2tDQU1aLFlBQUEsR0FBYyxTQUFBO2FBQ1o7SUFEWTs7a0NBR2QsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRE87O2tDQUdULFdBQUEsR0FBYSxTQUFDLFdBQUQ7QUFDWCxVQUFBO01BQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCO01BQ1YsSUFBbUMsV0FBVyxDQUFDLElBQVosS0FBb0IsSUFBQyxDQUFBLGtCQUF4RDtRQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsUUFBdEIsRUFBQTs7TUFDQSxPQUFPLENBQUMsV0FBUixHQUFzQixXQUFXLENBQUM7YUFDbEM7SUFKVzs7a0NBTWIsU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBOztXQUFNLENBQUUsT0FBUixDQUFBOztNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7YUFDVCxJQUFDLENBQUEsa0JBQUQsR0FBc0I7SUFIYjs7a0NBS1gsU0FBQSxHQUFXLFNBQUMsV0FBRDtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1Qsa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEMsRUFBMEMsV0FBMUM7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBSFM7O2tDQUtYLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBQyxDQUFBLG1CQUFELENBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O2FBQ1YsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFITTs7a0NBS1IsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBRyxrQkFBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1FBQ1QsSUFBRyxNQUFIO1VBQ0UsSUFBQyxDQUFBLGtCQUFELEdBQXNCLGtCQUFrQixDQUFDLGNBQW5CLENBQWtDLE1BQWxDO1VBQ3RCLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQWtCLENBQUMsZUFBbkIsQ0FBQSxDQUFWO2lCQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIRjtTQUpGOztJQURNOzs7O0tBbEN3QjtBQUxsQyIsInNvdXJjZXNDb250ZW50IjpbIntTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbkluZGVudGF0aW9uTWFuYWdlciA9IHJlcXVpcmUgJy4vaW5kZW50YXRpb24tbWFuYWdlcidcblxuIyBWaWV3IHRvIGRpc3BsYXkgYSBsaXN0IG9mIGluZGVudGF0aW9ucyB0byBhcHBseSB0byB0aGUgY3VycmVudCBlZGl0b3IuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbmRlbnRhdGlvbkxpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBzdXBlclxuXG4gICAgQGFkZENsYXNzKCdhdXRvLWRldGVjdC1pbmRlbnRhdGlvbi1zZWxlY3RvcicpXG4gICAgQGxpc3QuYWRkQ2xhc3MoJ21hcmstYWN0aXZlJylcblxuICBnZXRGaWx0ZXJLZXk6IC0+XG4gICAgJ25hbWUnXG5cbiAgZGVzdHJveTogLT5cbiAgICBAY2FuY2VsKClcblxuICB2aWV3Rm9ySXRlbTogKGluZGVudGF0aW9uKSAtPlxuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSBpZiBpbmRlbnRhdGlvbi5uYW1lIGlzIEBjdXJyZW50SW5kZW50YXRpb25cbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gaW5kZW50YXRpb24ubmFtZVxuICAgIGVsZW1lbnRcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICBAcGFuZWwgPSBudWxsXG4gICAgQGN1cnJlbnRJbmRlbnRhdGlvbiA9IG51bGxcblxuICBjb25maXJtZWQ6IChpbmRlbnRhdGlvbikgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBJbmRlbnRhdGlvbk1hbmFnZXIuc2V0SW5kZW50YXRpb24oZWRpdG9yLCBpbmRlbnRhdGlvbilcbiAgICBAY2FuY2VsKClcblxuICBhdHRhY2g6IC0+XG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHBhbmVsP1xuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiBlZGl0b3JcbiAgICAgICAgQGN1cnJlbnRJbmRlbnRhdGlvbiA9IEluZGVudGF0aW9uTWFuYWdlci5nZXRJbmRlbnRhdGlvbiBlZGl0b3JcbiAgICAgICAgQHNldEl0ZW1zKEluZGVudGF0aW9uTWFuYWdlci5nZXRJbmRlbnRhdGlvbnMoKSlcbiAgICAgICAgQGF0dGFjaCgpXG4iXX0=

(function() {
  var CompositeDisposable, IndentationManager;

  CompositeDisposable = require('atom').CompositeDisposable;

  IndentationManager = require('./indentation-manager');

  module.exports = {
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this)));
      this.disposables.add(atom.commands.add('atom-text-editor', 'auto-detect-indentation:show-indentation-selector', this.createIndentationListView));
      this.indentationListView = null;
      return this.indentationStatusView = null;
    },
    _handleLoad: function(editor) {
      var onSaveDisposable, onTokenizeDisposable, ref;
      this._attach(editor);
      onSaveDisposable = editor.buffer.onDidSave((function(_this) {
        return function() {
          var indentation;
          if (IndentationManager.isManuallyIndented(editor)) {
            return onSaveDisposable != null ? onSaveDisposable.dispose() : void 0;
          } else {
            indentation = IndentationManager.autoDetectIndentation(editor);
            return IndentationManager.setIndentation(editor, indentation, true);
          }
        };
      })(this));
      if ((ref = editor.buffer) != null ? ref.onDidTokenize : void 0) {
        onTokenizeDisposable = editor.buffer.onDidTokenize((function(_this) {
          return function() {
            _this._attach(editor);
            if (onTokenizeDisposable != null) {
              onTokenizeDisposable.dispose();
            }
            return onTokenizeDisposable = null;
          };
        })(this));
      } else {
        onTokenizeDisposable = null;
      }
      return editor.onDidDestroy(function() {
        if (onSaveDisposable != null) {
          onSaveDisposable.dispose();
        }
        return onTokenizeDisposable != null ? onTokenizeDisposable.dispose() : void 0;
      });
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    createIndentationListView: (function(_this) {
      return function() {
        var IndentationListView, indentationListView;
        if (_this.indentationListView == null) {
          IndentationListView = require('./indentation-list-view');
          indentationListView = new IndentationListView();
        }
        return indentationListView.toggle();
      };
    })(this),
    consumeStatusBar: function(statusBar) {
      var IndentationStatusView, indentationStatusView;
      if (this.IndentationStatusView == null) {
        IndentationStatusView = require('./indentation-status-view');
        indentationStatusView = new IndentationStatusView().initialize(statusBar);
      }
      return indentationStatusView.attach();
    },
    _attach: function(editor) {
      var indentation, originalSetSoftTabs, originalSetTabLength;
      originalSetSoftTabs = editor.setSoftTabs;
      originalSetTabLength = editor.setTabLength;
      editor.shouldUseSoftTabs = function() {
        return this.softTabs;
      };
      editor.setSoftTabs = function(softTabs) {
        var value;
        this.softTabs = softTabs;
        value = originalSetSoftTabs.call(editor, this.softTabs);
        this.emitter.emit('did-change-indentation');
        return value;
      };
      editor.setTabLength = function(tabLength) {
        var value;
        value = originalSetTabLength.call(editor, tabLength);
        this.emitter.emit('did-change-indentation');
        return value;
      };
      indentation = IndentationManager.autoDetectIndentation(editor);
      return IndentationManager.setIndentation(editor, indentation, true);
    },
    config: {
      showSpacingInStatusBar: {
        type: 'boolean',
        "default": true,
        title: 'Show spacing in status bar',
        description: 'Show current editor\'s spacing settings in status bar'
      },
      indentationTypes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            softTabs: {
              type: 'boolean'
            },
            tabLength: {
              type: 'integer'
            }
          }
        },
        "default": [
          {
            name: "2 Spaces",
            softTabs: true,
            tabLength: 2
          }, {
            name: "4 Spaces",
            softTabs: true,
            tabLength: 4
          }, {
            name: "8 Spaces",
            softTabs: true,
            tabLength: 8
          }, {
            name: "Tabs (default width)",
            softTabs: false
          }, {
            name: "Tabs (2 wide)",
            softTabs: false,
            tabLength: 2
          }, {
            name: "Tabs (4 wide)",
            softTabs: false,
            tabLength: 4
          }, {
            name: "Tabs (8 wide)",
            softTabs: false,
            tabLength: 8
          }
        ]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvLWRldGVjdC1pbmRlbnRhdGlvbi9saWIvYXV0by1kZXRlY3QtaW5kZW50YXRpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUjs7RUFFckIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQ2pELEtBQUMsQ0FBQSxXQUFELENBQWEsTUFBYjtRQURpRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakI7TUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxtREFBdEMsRUFBMkYsSUFBQyxDQUFBLHlCQUE1RixDQUFqQjtNQUVBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QjthQUN2QixJQUFDLENBQUEscUJBQUQsR0FBeUI7SUFQakIsQ0FBVjtJQVNBLFdBQUEsRUFBYSxTQUFDLE1BQUQ7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxNQUFUO01BRUEsZ0JBQUEsR0FBbUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFkLENBQXdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUN6QyxjQUFBO1VBQUEsSUFBRyxrQkFBa0IsQ0FBQyxrQkFBbkIsQ0FBc0MsTUFBdEMsQ0FBSDs4Q0FDRSxnQkFBZ0Is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UUFDQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtVQUNBLFVBQUEsRUFDRTtZQUFBLElBQUEsRUFDRTtjQUFBLElBQUEsRUFBTSxRQUFOO2FBREY7WUFFQSxRQUFBLEVBQ0U7Y0FBQSxJQUFBLEVBQU0sU0FBTjthQUhGO1lBSUEsU0FBQSxFQUNFO2NBQUEsSUFBQSxFQUFNLFNBQU47YUFMRjtXQUZGO1NBRkY7UUFVQSxDQUFBLE9BQUEsQ0FBQSxFQUNFO1VBQ0U7WUFDRSxJQUFBLEVBQU0sVUFEUjtZQUVFLFFBQUEsRUFBVSxJQUZaO1lBR0UsU0FBQSxFQUFXLENBSGI7V0FERixFQU1FO1lBQ0UsSUFBQSxFQUFNLFVBRFI7WUFFRSxRQUFBLEVBQVUsSUFGWjtZQUdFLFNBQUEsRUFBVyxDQUhiO1dBTkYsRUFXRTtZQUNFLElBQUEsRUFBTSxVQURSO1lBRUUsUUFBQSxFQUFVLElBRlo7WUFHRSxTQUFBLEVBQVcsQ0FIYjtXQVhGLEVBZ0JFO1lBQ0UsSUFBQSxFQUFNLHNCQURSO1lBRUUsUUFBQSxFQUFVLEtBRlo7V0FoQkYsRUFvQkU7WUFDRSxJQUFBLEVBQU0sZUFEUjtZQUVFLFFBQUEsRUFBVSxLQUZaO1lBR0UsU0FBQSxFQUFXLENBSGI7V0FwQkYsRUF5QkU7WUFDRSxJQUFBLEVBQU0sZUFEUjtZQUVFLFFBQUEsRUFBVSxLQUZaO1lBR0UsU0FBQSxFQUFXLENBSGI7V0F6QkYsRUE4QkU7WUFDRSxJQUFBLEVBQU0sZUFEUjtZQUVFLFFBQUEsRUFBVSxLQUZaO1lBR0UsU0FBQSxFQUFXLENBSGI7V0E5QkY7U0FYRjtPQU5GO0tBekVGOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkluZGVudGF0aW9uTWFuYWdlciA9IHJlcXVpcmUgJy4vaW5kZW50YXRpb24tbWFuYWdlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBfaGFuZGxlTG9hZCBlZGl0b3JcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F1dG8tZGV0ZWN0LWluZGVudGF0aW9uOnNob3ctaW5kZW50YXRpb24tc2VsZWN0b3InLCBAY3JlYXRlSW5kZW50YXRpb25MaXN0VmlldylcblxuICAgIEBpbmRlbnRhdGlvbkxpc3RWaWV3ID0gbnVsbFxuICAgIEBpbmRlbnRhdGlvblN0YXR1c1ZpZXcgPSBudWxsXG5cbiAgX2hhbmRsZUxvYWQ6IChlZGl0b3IpIC0+XG4gICAgQF9hdHRhY2ggZWRpdG9yXG5cbiAgICBvblNhdmVEaXNwb3NhYmxlID0gZWRpdG9yLmJ1ZmZlci5vbkRpZFNhdmUgPT5cbiAgICAgIGlmIEluZGVudGF0aW9uTWFuYWdlci5pc01hbnVhbGx5SW5kZW50ZWQgZWRpdG9yXG4gICAgICAgIG9uU2F2ZURpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuICAgICAgZWxzZVxuICAgICAgICBpbmRlbnRhdGlvbiA9IEluZGVudGF0aW9uTWFuYWdlci5hdXRvRGV0ZWN0SW5kZW50YXRpb24gZWRpdG9yXG4gICAgICAgIEluZGVudGF0aW9uTWFuYWdlci5zZXRJbmRlbnRhdGlvbiBlZGl0b3IsIGluZGVudGF0aW9uLCB0cnVlXG5cbiAgICBpZiBlZGl0b3IuYnVmZmVyPy5vbkRpZFRva2VuaXplXG4gICAgICBvblRva2VuaXplRGlzcG9zYWJsZSA9IGVkaXRvci5idWZmZXIub25EaWRUb2tlbml6ZSA9PlxuICAgICAgICAjIFRoaXMgZXZlbnQgZmlyZXMgd2hlbiB0aGUgZ3JhbW1hciBpcyBmaXJzdCBsb2FkZWQuXG4gICAgICAgICMgV2UgcmUtYW5hbHl6ZSB0aGUgZmlsZSdzIGluZGVudGF0aW9uLCBpbiBvcmRlciB0byBpZ25vcmUgaW5kZW50YXRpb24gaW5zaWRlIGNvbW1lbnRzXG4gICAgICAgIEBfYXR0YWNoIGVkaXRvclxuICAgICAgICBvblRva2VuaXplRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgICAgIG9uVG9rZW5pemVEaXNwb3NhYmxlID0gbnVsbFxuICAgIGVsc2VcbiAgICAgIG9uVG9rZW5pemVEaXNwb3NhYmxlID0gbnVsbFxuXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSAtPlxuICAgICAgb25TYXZlRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgICBvblRva2VuaXplRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgY3JlYXRlSW5kZW50YXRpb25MaXN0VmlldzogPT5cbiAgICB1bmxlc3MgQGluZGVudGF0aW9uTGlzdFZpZXc/XG4gICAgICBJbmRlbnRhdGlvbkxpc3RWaWV3ID0gcmVxdWlyZSAnLi9pbmRlbnRhdGlvbi1saXN0LXZpZXcnXG4gICAgICBpbmRlbnRhdGlvbkxpc3RWaWV3ID0gbmV3IEluZGVudGF0aW9uTGlzdFZpZXcoKVxuICAgIGluZGVudGF0aW9uTGlzdFZpZXcudG9nZ2xlKClcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIHVubGVzcyBASW5kZW50YXRpb25TdGF0dXNWaWV3P1xuICAgICAgSW5kZW50YXRpb25TdGF0dXNWaWV3ID0gcmVxdWlyZSAnLi9pbmRlbnRhdGlvbi1zdGF0dXMtdmlldydcbiAgICAgIGluZGVudGF0aW9uU3RhdHVzVmlldyA9IG5ldyBJbmRlbnRhdGlvblN0YXR1c1ZpZXcoKS5pbml0aWFsaXplKHN0YXR1c0JhcilcbiAgICBpbmRlbnRhdGlvblN0YXR1c1ZpZXcuYXR0YWNoKClcblxuICBfYXR0YWNoOiAoZWRpdG9yKSAtPlxuICAgIG9yaWdpbmFsU2V0U29mdFRhYnMgPSBlZGl0b3Iuc2V0U29mdFRhYnNcbiAgICBvcmlnaW5hbFNldFRhYkxlbmd0aCA9IGVkaXRvci5zZXRUYWJMZW5ndGhcblxuICAgICMgRGlzYWJsZSBhdG9tJ3MgbmF0aXZlIGRldGVjdGlvbiBvZiBzcGFjZXMvdGFic1xuICAgIGVkaXRvci5zaG91bGRVc2VTb2Z0VGFicyA9IC0+XG4gICAgICBAc29mdFRhYnNcblxuICAgICMgVHJpZ2dlciBcImRpZC1jaGFuZ2UtaW5kZW50YXRpb25cIiBldmVudCB3aGVuIGluZGVudGF0aW9uIGlzIGNoYW5nZWRcbiAgICBlZGl0b3Iuc2V0U29mdFRhYnMgPSAoQHNvZnRUYWJzKSAtPlxuICAgICAgIyBhbm90aGVyIGxpbmVcbiAgICAgIHZhbHVlID0gb3JpZ2luYWxTZXRTb2Z0VGFicy5jYWxsKGVkaXRvciwgQHNvZnRUYWJzKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1pbmRlbnRhdGlvbidcbiAgICAgIHZhbHVlXG5cbiAgICAjIFRyaWdnZXIgXCJkaWQtY2hhbmdlLWluZGVudGF0aW9uXCIgZXZlbnQgd2hlbiBpbmRlbnRhdGlvbiBpcyBjaGFuZ2VkXG4gICAgZWRpdG9yLnNldFRhYkxlbmd0aCA9ICh0YWJMZW5ndGgpIC0+XG4gICAgICB2YWx1ZSA9IG9yaWdpbmFsU2V0VGFiTGVuZ3RoLmNhbGwoZWRpdG9yLCB0YWJMZW5ndGgpXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2hhbmdlLWluZGVudGF0aW9uJ1xuICAgICAgdmFsdWVcblxuICAgIGluZGVudGF0aW9uID0gSW5kZW50YXRpb25NYW5hZ2VyLmF1dG9EZXRlY3RJbmRlbnRhdGlvbiBlZGl0b3JcbiAgICBJbmRlbnRhdGlvbk1hbmFnZXIuc2V0SW5kZW50YXRpb24gZWRpdG9yLCBpbmRlbnRhdGlvbiwgdHJ1ZVxuXG4gIGNvbmZpZzpcbiAgICBzaG93U3BhY2luZ0luU3RhdHVzQmFyOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB0aXRsZTogJ1Nob3cgc3BhY2luZyBpbiBzdGF0dXMgYmFyJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGN1cnJlbnQgZWRpdG9yXFwncyBzcGFjaW5nIHNldHRpbmdzIGluIHN0YXR1cyBiYXInXG4gICAgaW5kZW50YXRpb25UeXBlczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIHNvZnRUYWJzOlxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgdGFiTGVuZ3RoOlxuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCIyIFNwYWNlc1wiXG4gICAgICAgICAgICBzb2Z0VGFiczogdHJ1ZVxuICAgICAgICAgICAgdGFiTGVuZ3RoOiAyXG4gICAgICAgICAgfVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiNCBTcGFjZXNcIlxuICAgICAgICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgICAgICAgIHRhYkxlbmd0aDogNFxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIjggU3BhY2VzXCJcbiAgICAgICAgICAgIHNvZnRUYWJzOiB0cnVlXG4gICAgICAgICAgICB0YWJMZW5ndGg6IDhcbiAgICAgICAgICB9XG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJUYWJzIChkZWZhdWx0IHdpZHRoKVwiXG4gICAgICAgICAgICBzb2Z0VGFiczogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJUYWJzICgyIHdpZGUpXCJcbiAgICAgICAgICAgIHNvZnRUYWJzOiBmYWxzZVxuICAgICAgICAgICAgdGFiTGVuZ3RoOiAyXG4gICAgICAgICAgfVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiVGFicyAoNCB3aWRlKVwiXG4gICAgICAgICAgICBzb2Z0VGFiczogZmFsc2VcbiAgICAgICAgICAgIHRhYkxlbmd0aDogNFxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlRhYnMgKDggd2lkZSlcIlxuICAgICAgICAgICAgc29mdFRhYnM6IGZhbHNlXG4gICAgICAgICAgICB0YWJMZW5ndGg6IDhcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiJdfQ==

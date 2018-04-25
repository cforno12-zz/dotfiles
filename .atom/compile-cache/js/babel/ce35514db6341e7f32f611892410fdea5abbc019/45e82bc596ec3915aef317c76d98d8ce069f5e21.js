"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.deserialize = deserialize;
var path = null;
var PdfEditorView = null;

var config = {
  reverseSyncBehaviour: {
    type: "string",
    "enum": ['Disabled', 'Click', 'Double click'],
    'default': 'Click',
    title: "SyncTeX Reverse sync behaviour",
    description: "Specify the action on the PDF generated with the `--synctex=1` option that takes you to the source."
  },
  syncTeXPath: {
    type: "string",
    'default': "",
    title: "Path to synctex binary",
    description: "If not specified, look for `synctex` in `PATH`"
  },
  fitToWidthOnOpen: {
    type: "boolean",
    'default': false,
    title: "Fit to width on open",
    description: "When opening a document, fit it to the pane width"
  },
  paneToUseInSynctex: {
    type: "string",
    'enum': ['default', 'left', 'right', 'up', 'down'],
    'default': 'default',
    title: "Pane to use when opening new tex files",
    description: "When using reverse sync and a new tex source file has to be opened, use the provided pane to open the new file. 'default' will use the pane of the PDF viewer."
  },
  autoReloadOnUpdate: {
    type: "boolean",
    'default': true,
    title: "Auto reload on update",
    description: "Auto reload when the file is updated"
  }
};

exports.config = config;

function activate(state) {
  this.subscription = atom.workspace.addOpener(openUri);
  atom.packages.onDidActivateInitialPackages(createPdfStatusView);
}

function deactivate() {
  this.subscription.dispose();
}

// Files with these extensions will be opened as PDFs
var pdfExtensions = new Set(['.pdf']);

function openUri(uriToOpen) {
  if (path === null) {
    path = require('path');
  }

  var uriExtension = path.extname(uriToOpen).toLowerCase();
  if (pdfExtensions.has(uriExtension)) {
    if (PdfEditorView === null) {
      PdfEditorView = require('./pdf-editor-view');
    }
    return new PdfEditorView(uriToOpen);
  }
}

function createPdfStatusView() {
  var PdfStatusBarView = require('./pdf-status-bar-view');
  new PdfStatusBarView();
  var PdfGoToPageView = require('./pdf-goto-page-view');
  new PdfGoToPageView();
}

function deserialize(_ref) {
  var filePath = _ref.filePath;
  var scale = _ref.scale;
  var scrollTop = _ref.scrollTop;
  var scrollLeft = _ref.scrollLeft;

  if (require('fs-plus').isFileSync(filePath)) {
    if (PdfEditorView === null) {
      PdfEditorView = require('./pdf-editor-view');
    }
    return new PdfEditorView(filePath, scale, scrollTop, scrollLeft);
  } else {
    console.warn("Could not deserialize PDF editor for path '#{filePath}' because that file no longer exists");
  }
}

if (parseFloat(atom.getVersion()) < 1.7) {
  atom.deserializers.add({
    "name": "PdfEditorDeserializer",
    "deserialize": deserialize
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGRmLXZpZXcvbGliL3BkZi1lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7OztBQUVaLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRWxCLElBQU0sTUFBTSxHQUFHO0FBQ3BCLHNCQUFvQixFQUFFO0FBQ3BCLFFBQUksRUFBRSxRQUFRO0FBQ2QsWUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDO0FBQzNDLGFBQVMsRUFBRSxPQUFPO0FBQ2xCLFNBQUssRUFBRSxnQ0FBZ0M7QUFDdkMsZUFBVyxFQUFFLHFHQUFxRztHQUNuSDtBQUNELGFBQVcsRUFBRTtBQUNYLFFBQUksRUFBRSxRQUFRO0FBQ2QsYUFBUyxFQUFFLEVBQUU7QUFDYixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSxnREFBZ0Q7R0FDOUQ7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixRQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsRUFBRSxLQUFLO0FBQ2hCLFNBQUssRUFBRSxzQkFBc0I7QUFDN0IsZUFBVyxFQUFFLG1EQUFtRDtHQUNqRTtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLFFBQUksRUFBRSxRQUFRO0FBQ2QsVUFBTSxFQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQztBQUNuRCxhQUFTLEVBQUUsU0FBUztBQUNwQixTQUFLLEVBQUUsd0NBQXdDO0FBQy9DLGVBQVcsRUFBRSxnS0FBZ0s7R0FDOUs7QUFDRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsRUFBRSxJQUFJO0FBQ2YsU0FBSyxFQUFFLHVCQUF1QjtBQUM5QixlQUFXLEVBQUUsc0NBQXNDO0dBQ3BEO0NBQ0YsQ0FBQTs7OztBQUVNLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUM5QixNQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RELE1BQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztDQUNqRTs7QUFFTSxTQUFTLFVBQVUsR0FBRztBQUMzQixNQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQzdCOzs7QUFHRCxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRXhDLFNBQVMsT0FBTyxDQUFDLFNBQVMsRUFBRTtBQUMxQixNQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDakIsUUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN4Qjs7QUFFRCxNQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ3hELE1BQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNuQyxRQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7QUFDMUIsbUJBQWEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUM5QztBQUNELFdBQU8sSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDckM7Q0FDRjs7QUFFRCxTQUFTLG1CQUFtQixHQUFHO0FBQzdCLE1BQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDeEQsTUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3ZCLE1BQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3RELE1BQUksZUFBZSxFQUFFLENBQUM7Q0FDdkI7O0FBRU0sU0FBUyxXQUFXLENBQUMsSUFBd0MsRUFBRTtNQUF6QyxRQUFRLEdBQVQsSUFBd0MsQ0FBdkMsUUFBUTtNQUFFLEtBQUssR0FBaEIsSUFBd0MsQ0FBN0IsS0FBSztNQUFFLFNBQVMsR0FBM0IsSUFBd0MsQ0FBdEIsU0FBUztNQUFFLFVBQVUsR0FBdkMsSUFBd0MsQ0FBWCxVQUFVOztBQUNqRSxNQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0MsUUFBSSxhQUFhLEtBQUssSUFBSSxFQUFFO0FBQzFCLG1CQUFhLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDOUM7QUFDRCxXQUFPLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0dBQ2xFLE1BQU07QUFDTCxXQUFPLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUM7R0FDNUc7Q0FDRjs7QUFFRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFDdkMsTUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDckIsVUFBTSxFQUFFLHVCQUF1QjtBQUMvQixpQkFBYSxFQUFFLFdBQVc7R0FDM0IsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9wZGYtdmlldy9saWIvcGRmLWVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbnZhciBwYXRoID0gbnVsbDtcbnZhciBQZGZFZGl0b3JWaWV3ID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgcmV2ZXJzZVN5bmNCZWhhdmlvdXI6IHtcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIGVudW06IFsnRGlzYWJsZWQnLCAnQ2xpY2snLCAnRG91YmxlIGNsaWNrJ10sXG4gICAgJ2RlZmF1bHQnOiAnQ2xpY2snLFxuICAgIHRpdGxlOiBcIlN5bmNUZVggUmV2ZXJzZSBzeW5jIGJlaGF2aW91clwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIlNwZWNpZnkgdGhlIGFjdGlvbiBvbiB0aGUgUERGIGdlbmVyYXRlZCB3aXRoIHRoZSBgLS1zeW5jdGV4PTFgIG9wdGlvbiB0aGF0IHRha2VzIHlvdSB0byB0aGUgc291cmNlLlwiXG4gIH0sXG4gIHN5bmNUZVhQYXRoOiB7XG4gICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAnZGVmYXVsdCc6IFwiXCIsXG4gICAgdGl0bGU6IFwiUGF0aCB0byBzeW5jdGV4IGJpbmFyeVwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIklmIG5vdCBzcGVjaWZpZWQsIGxvb2sgZm9yIGBzeW5jdGV4YCBpbiBgUEFUSGBcIlxuICB9LFxuICBmaXRUb1dpZHRoT25PcGVuOiB7XG4gICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgJ2RlZmF1bHQnOiBmYWxzZSxcbiAgICB0aXRsZTogXCJGaXQgdG8gd2lkdGggb24gb3BlblwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIldoZW4gb3BlbmluZyBhIGRvY3VtZW50LCBmaXQgaXQgdG8gdGhlIHBhbmUgd2lkdGhcIlxuICB9LFxuICBwYW5lVG9Vc2VJblN5bmN0ZXg6IHtcbiAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICdlbnVtJyA6IFsnZGVmYXVsdCcsICdsZWZ0JywgJ3JpZ2h0JywgJ3VwJywgJ2Rvd24nXSxcbiAgICAnZGVmYXVsdCc6ICdkZWZhdWx0JyxcbiAgICB0aXRsZTogXCJQYW5lIHRvIHVzZSB3aGVuIG9wZW5pbmcgbmV3IHRleCBmaWxlc1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIldoZW4gdXNpbmcgcmV2ZXJzZSBzeW5jIGFuZCBhIG5ldyB0ZXggc291cmNlIGZpbGUgaGFzIHRvIGJlIG9wZW5lZCwgdXNlIHRoZSBwcm92aWRlZCBwYW5lIHRvIG9wZW4gdGhlIG5ldyBmaWxlLiAnZGVmYXVsdCcgd2lsbCB1c2UgdGhlIHBhbmUgb2YgdGhlIFBERiB2aWV3ZXIuXCJcbiAgfSxcbiAgYXV0b1JlbG9hZE9uVXBkYXRlOiB7XG4gICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgJ2RlZmF1bHQnOiB0cnVlLFxuICAgIHRpdGxlOiBcIkF1dG8gcmVsb2FkIG9uIHVwZGF0ZVwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkF1dG8gcmVsb2FkIHdoZW4gdGhlIGZpbGUgaXMgdXBkYXRlZFwiXG4gIH0sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZSkge1xuICB0aGlzLnN1YnNjcmlwdGlvbiA9IGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcihvcGVuVXJpKTtcbiAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKGNyZWF0ZVBkZlN0YXR1c1ZpZXcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgdGhpcy5zdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xufVxuXG4vLyBGaWxlcyB3aXRoIHRoZXNlIGV4dGVuc2lvbnMgd2lsbCBiZSBvcGVuZWQgYXMgUERGc1xuY29uc3QgcGRmRXh0ZW5zaW9ucyA9IG5ldyBTZXQoWycucGRmJ10pO1xuXG5mdW5jdGlvbiBvcGVuVXJpKHVyaVRvT3Blbikge1xuICBpZiAocGF0aCA9PT0gbnVsbCkge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gIH1cblxuICBsZXQgdXJpRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKHVyaVRvT3BlbikudG9Mb3dlckNhc2UoKVxuICBpZiAocGRmRXh0ZW5zaW9ucy5oYXModXJpRXh0ZW5zaW9uKSkge1xuICAgIGlmIChQZGZFZGl0b3JWaWV3ID09PSBudWxsKSB7XG4gICAgICBQZGZFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi9wZGYtZWRpdG9yLXZpZXcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQZGZFZGl0b3JWaWV3KHVyaVRvT3Blbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUGRmU3RhdHVzVmlldygpIHtcbiAgbGV0IFBkZlN0YXR1c0JhclZpZXcgPSByZXF1aXJlKCcuL3BkZi1zdGF0dXMtYmFyLXZpZXcnKTtcbiAgbmV3IFBkZlN0YXR1c0JhclZpZXcoKTtcbiAgbGV0IFBkZkdvVG9QYWdlVmlldyA9IHJlcXVpcmUoJy4vcGRmLWdvdG8tcGFnZS12aWV3Jyk7XG4gIG5ldyBQZGZHb1RvUGFnZVZpZXcoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplKHtmaWxlUGF0aCwgc2NhbGUsIHNjcm9sbFRvcCwgc2Nyb2xsTGVmdH0pIHtcbiAgaWYgKHJlcXVpcmUoJ2ZzLXBsdXMnKS5pc0ZpbGVTeW5jKGZpbGVQYXRoKSkge1xuICAgIGlmIChQZGZFZGl0b3JWaWV3ID09PSBudWxsKSB7XG4gICAgICBQZGZFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi9wZGYtZWRpdG9yLXZpZXcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQZGZFZGl0b3JWaWV3KGZpbGVQYXRoLCBzY2FsZSwgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgZGVzZXJpYWxpemUgUERGIGVkaXRvciBmb3IgcGF0aCAnI3tmaWxlUGF0aH0nIGJlY2F1c2UgdGhhdCBmaWxlIG5vIGxvbmdlciBleGlzdHNcIik7XG4gIH1cbn1cblxuaWYgKHBhcnNlRmxvYXQoYXRvbS5nZXRWZXJzaW9uKCkpIDwgMS43KSB7XG4gIGF0b20uZGVzZXJpYWxpemVycy5hZGQoe1xuICAgIFwibmFtZVwiOiBcIlBkZkVkaXRvckRlc2VyaWFsaXplclwiLFxuICAgIFwiZGVzZXJpYWxpemVcIjogZGVzZXJpYWxpemVcbiAgfSk7XG59XG4iXX0=
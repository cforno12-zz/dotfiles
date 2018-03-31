(function() {
  module.exports = {
    general: {
      title: 'General',
      type: 'object',
      collapsed: true,
      order: -2,
      description: 'General options for Atom Beautify',
      properties: {
        _analyticsUserId: {
          title: 'Analytics User Id',
          type: 'string',
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        loggerLevel: {
          title: "Logger Level",
          type: 'string',
          "default": 'warn',
          description: 'Set the level for the logger',
          "enum": ['verbose', 'debug', 'info', 'warn', 'error']
        },
        beautifyEntireFileOnSave: {
          title: "Beautify Entire File On Save",
          type: 'boolean',
          "default": true,
          description: "When beautifying on save, use the entire file, even if there is selected text in the editor. Important: The `beautify on save` option for the specific language must be enabled for this to be applicable. This option is not `beautify on save`."
        },
        muteUnsupportedLanguageErrors: {
          title: "Mute Unsupported Language Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show \"Unsupported Language\" errors when they occur"
        },
        muteAllErrors: {
          title: "Mute All Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show any/all errors when they occur"
        },
        showLoadingView: {
          title: "Show Loading View",
          type: 'boolean',
          "default": true,
          description: "Show loading view when beautifying"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDZixPQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sU0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsU0FBQSxFQUFXLElBRlg7TUFHQSxLQUFBLEVBQU8sQ0FBQyxDQUhSO01BSUEsV0FBQSxFQUFhLG1DQUpiO01BS0EsVUFBQSxFQUNFO1FBQUEsZ0JBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxtQkFBUDtVQUNBLElBQUEsRUFBTyxRQURQO1VBRUEsQ0FBQSxPQUFBLENBQUEsRUFBVSxFQUZWO1VBR0EsV0FBQSxFQUFjLDhEQUhkO1NBREY7UUFLQSxXQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sY0FBUDtVQUNBLElBQUEsRUFBTyxRQURQO1VBRUEsQ0FBQSxPQUFBLENBQUEsRUFBVSxNQUZWO1VBR0EsV0FBQSxFQUFjLDhCQUhkO1VBSUEsQ0FBQSxJQUFBLENBQUEsRUFBTyxDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDLE9BQXJDLENBSlA7U0FORjtRQVdBLHdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sOEJBQVA7VUFDQSxJQUFBLEVBQU8sU0FEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsSUFGVjtVQUdBLFdBQUEsRUFBYyxtUEFIZDtTQVpGO1FBZ0JBLDZCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sa0NBQVA7VUFDQSxJQUFBLEVBQU8sU0FEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsS0FGVjtVQUdBLFdBQUEsRUFBYyw2REFIZDtTQWpCRjtRQXFCQSxhQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8saUJBQVA7VUFDQSxJQUFBLEVBQU8sU0FEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsS0FGVjtVQUdBLFdBQUEsRUFBYyw0Q0FIZDtTQXRCRjtRQTBCQSxlQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sbUJBQVA7VUFDQSxJQUFBLEVBQU8sU0FEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsSUFGVjtVQUdBLFdBQUEsRUFBYyxvQ0FIZDtTQTNCRjtPQU5GO0tBRmE7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdlbmVyYWw6XG4gICAgdGl0bGU6ICdHZW5lcmFsJ1xuICAgIHR5cGU6ICdvYmplY3QnXG4gICAgY29sbGFwc2VkOiB0cnVlXG4gICAgb3JkZXI6IC0yXG4gICAgZGVzY3JpcHRpb246ICdHZW5lcmFsIG9wdGlvbnMgZm9yIEF0b20gQmVhdXRpZnknXG4gICAgcHJvcGVydGllczpcbiAgICAgIF9hbmFseXRpY3NVc2VySWQgOlxuICAgICAgICB0aXRsZTogJ0FuYWx5dGljcyBVc2VyIElkJ1xuICAgICAgICB0eXBlIDogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdCA6IFwiXCJcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIlVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIHVzZXIgZm9yIHRyYWNraW5nIHVzYWdlIGFuYWx5dGljc1wiXG4gICAgICBsb2dnZXJMZXZlbCA6XG4gICAgICAgIHRpdGxlOiBcIkxvZ2dlciBMZXZlbFwiXG4gICAgICAgIHR5cGUgOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0IDogJ3dhcm4nXG4gICAgICAgIGRlc2NyaXB0aW9uIDogJ1NldCB0aGUgbGV2ZWwgZm9yIHRoZSBsb2dnZXInXG4gICAgICAgIGVudW0gOiBbJ3ZlcmJvc2UnLCAnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ11cbiAgICAgIGJlYXV0aWZ5RW50aXJlRmlsZU9uU2F2ZSA6XG4gICAgICAgIHRpdGxlOiBcIkJlYXV0aWZ5IEVudGlyZSBGaWxlIE9uIFNhdmVcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJXaGVuIGJlYXV0aWZ5aW5nIG9uIHNhdmUsIHVzZSB0aGUgZW50aXJlIGZpbGUsIGV2ZW4gaWYgdGhlcmUgaXMgc2VsZWN0ZWQgdGV4dCBpbiB0aGUgZWRpdG9yLiBJbXBvcnRhbnQ6IFRoZSBgYmVhdXRpZnkgb24gc2F2ZWAgb3B0aW9uIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgbXVzdCBiZSBlbmFibGVkIGZvciB0aGlzIHRvIGJlIGFwcGxpY2FibGUuIFRoaXMgb3B0aW9uIGlzIG5vdCBgYmVhdXRpZnkgb24gc2F2ZWAuXCJcbiAgICAgIG11dGVVbnN1cHBvcnRlZExhbmd1YWdlRXJyb3JzIDpcbiAgICAgICAgdGl0bGU6IFwiTXV0ZSBVbnN1cHBvcnRlZCBMYW5ndWFnZSBFcnJvcnNcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiRG8gbm90IHNob3cgXFxcIlVuc3VwcG9ydGVkIExhbmd1YWdlXFxcIiBlcnJvcnMgd2hlbiB0aGV5IG9jY3VyXCJcbiAgICAgIG11dGVBbGxFcnJvcnMgOlxuICAgICAgICB0aXRsZTogXCJNdXRlIEFsbCBFcnJvcnNcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiRG8gbm90IHNob3cgYW55L2FsbCBlcnJvcnMgd2hlbiB0aGV5IG9jY3VyXCJcbiAgICAgIHNob3dMb2FkaW5nVmlldyA6XG4gICAgICAgIHRpdGxlOiBcIlNob3cgTG9hZGluZyBWaWV3XCJcbiAgICAgICAgdHlwZSA6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0IDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiU2hvdyBsb2FkaW5nIHZpZXcgd2hlbiBiZWF1dGlmeWluZ1wiXG4gICAgfVxuIl19

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _elementsHighlight = require('./elements/highlight');

var ProvidersHighlight = (function () {
  function ProvidersHighlight() {
    _classCallCheck(this, ProvidersHighlight);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersHighlight, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      if (!this.hasProvider(provider)) {
        (0, _validate.provider)(provider);
        this.providers.add(provider);
      }
    }
  }, {
    key: 'hasProvider',
    value: function hasProvider(provider) {
      return this.providers.has(provider);
    }
  }, {
    key: 'deleteProvider',
    value: function deleteProvider(provider) {
      if (this.hasProvider(provider)) {
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'trigger',
    value: _asyncToGenerator(function* (textEditor) {
      var editorPath = textEditor.getPath();
      var bufferPosition = textEditor.getCursorBufferPosition();

      if (!editorPath) {
        return [];
      }

      var scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray();
      scopes.push('*');

      var visibleRange = _atom.Range.fromObject([textEditor.bufferPositionForScreenPosition([textEditor.getFirstVisibleScreenRow(), 0]), textEditor.bufferPositionForScreenPosition([textEditor.getLastVisibleScreenRow(), 0])]);
      // Setting this to infinity on purpose, cause the buffer position just marks visible column
      // according to element width
      visibleRange.end.column = Infinity;

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, visibleRange: visibleRange }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsShow)(results);
            }
            return results;
          }));
        }
      });

      var number = ++this.number;
      var results = (yield Promise.all(promises)).reduce(function (items, item) {
        if (Array.isArray(item)) {
          return items.concat(item);
        }
        return items;
      }, []);

      if (number !== this.number || !results.length) {
        // If has been executed one more time, ignore these results
        // Or we just don't have any results
        return [];
      }

      return results;
    })
  }, {
    key: 'paint',
    value: function paint(textEditor, intentions) {
      var markers = [];

      var _loop = function (intention) {
        var matchedText = textEditor.getTextInBufferRange(intention.range);
        var marker = textEditor.markBufferRange(intention.range);
        var element = (0, _elementsHighlight.create)(intention, matchedText.length);
        intention.created({ textEditor: textEditor, element: element, marker: marker, matchedText: matchedText });
        textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'tail',
          item: element
        });
        marker.onDidChange(function (_ref) {
          var start = _ref.newHeadBufferPosition;
          var end = _ref.oldTailBufferPosition;

          element.textContent = _elementsHighlight.PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length);
        });
        markers.push(marker);
      };

      for (var intention of intentions) {
        _loop(intention);
      }
      return function () {
        markers.forEach(function (marker) {
          try {
            marker.destroy();
          } catch (_) {/* No Op */}
        });
      };
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersHighlight;
})();

exports['default'] = ProvidersHighlight;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvcHJvdmlkZXJzLWhpZ2hsaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOzt3QkFFeUQsWUFBWTs7aUNBQ3RDLHNCQUFzQjs7SUFHNUQsa0JBQWtCO0FBSTFCLFdBSlEsa0JBQWtCLEdBSXZCOzBCQUpLLGtCQUFrQjs7QUFLbkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7QUFDZixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDM0I7O2VBUGtCLGtCQUFrQjs7V0FRMUIscUJBQUMsUUFBMkIsRUFBRTtBQUN2QyxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvQixnQ0FBaUIsUUFBUSxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0I7S0FDRjs7O1dBQ1UscUJBQUMsUUFBMkIsRUFBVztBQUNoRCxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3BDOzs7V0FDYSx3QkFBQyxRQUEyQixFQUFFO0FBQzFDLFVBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixZQUFJLENBQUMsU0FBUyxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjs7OzZCQUNZLFdBQUMsVUFBc0IsRUFBaUM7QUFDbkUsVUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3ZDLFVBQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxDQUFBOztBQUUzRCxVQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsZUFBTyxFQUFFLENBQUE7T0FDVjs7QUFFRCxVQUFNLE1BQU0sR0FBRyxVQUFVLENB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LENBQUMsV0FBVyxDQUFDLFVBQVMsSUFBNEQsRUFBRTtjQUFyQyxLQUFLLEdBQTlCLElBQTRELENBQTFELHFCQUFxQjtjQUFnQyxHQUFHLEdBQTFELElBQTRELENBQTVCLHFCQUFxQjs7QUFDL0UsaUJBQU8sQ0FBQyxXQUFXLEdBQUcscUNBQWtCLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNyRyxDQUFDLENBQUE7QUFDRixlQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBOzs7QUFidEIsV0FBSyxJQUFNLFNBQVMsSUFBSyxVQUFVLEVBQXlCO2NBQWpELFNBQVM7T0FjbkI7QUFDRCxhQUFPLFlBQVc7QUFDaEIsZUFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUMvQixjQUFJO0FBQ0Ysa0JBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtXQUNqQixDQUFDLE9BQU8sQ0FBQyxFQUFFLGFBQWU7U0FDNUIsQ0FBQyxDQUFBO09BQ0gsQ0FBQTtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdkI7OztTQWxHa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvQ3Jpc0Zvcm5vLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3Byb3ZpZGVycy1oaWdobGlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBSYW5nZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgcHJvdmlkZXIgYXMgdmFsaWRhdGVQcm92aWRlciwgc3VnZ2VzdGlvbnNTaG93IGFzIHZhbGlkYXRlU3VnZ2VzdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZUVsZW1lbnQsIFBBRERJTkdfQ0hBUkFDVEVSIH0gZnJvbSAnLi9lbGVtZW50cy9oaWdobGlnaHQnXG5pbXBvcnQgdHlwZSB7IEhpZ2hsaWdodFByb3ZpZGVyLCBIaWdobGlnaHRJdGVtIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXJzSGlnaGxpZ2h0IHtcbiAgbnVtYmVyOiBudW1iZXI7XG4gIHByb3ZpZGVyczogU2V0PEhpZ2hsaWdodFByb3ZpZGVyPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm51bWJlciA9IDBcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBTZXQoKVxuICB9XG4gIGFkZFByb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcikge1xuICAgIGlmICghdGhpcy5oYXNQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgIHZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXIpXG4gICAgICB0aGlzLnByb3ZpZGVycy5hZGQocHJvdmlkZXIpXG4gICAgfVxuICB9XG4gIGhhc1Byb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5oYXMocHJvdmlkZXIpXG4gIH1cbiAgZGVsZXRlUHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgaWYgKHRoaXMuaGFzUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUocHJvdmlkZXIpXG4gICAgfVxuICB9XG4gIGFzeW5jIHRyaWdnZXIodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6IFByb21pc2U8QXJyYXk8SGlnaGxpZ2h0SXRlbT4+IHtcbiAgICBjb25zdCBlZGl0b3JQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICBjb25zdCBidWZmZXJQb3NpdGlvbiA9IHRleHRFZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgaWYgKCFlZGl0b3JQYXRoKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSB0ZXh0RWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKS5nZXRTY29wZXNBcnJheSgpXG4gICAgc2NvcGVzLnB1c2goJyonKVxuXG4gICAgY29uc3QgdmlzaWJsZVJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbXG4gICAgICB0ZXh0RWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oW3RleHRFZGl0b3IuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCksIDBdKSxcbiAgICAgIHRleHRFZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbdGV4dEVkaXRvci5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpLCAwXSksXG4gICAgXSlcbiAgICAvLyBTZXR0aW5nIHRoaXMgdG8gaW5maW5pdHkgb24gcHVycG9zZSwgY2F1c2UgdGhlIGJ1ZmZlciBwb3NpdGlvbiBqdXN0IG1hcmtzIHZpc2libGUgY29sdW1uXG4gICAgLy8gYWNjb3JkaW5nIHRvIGVsZW1lbnQgd2lkdGhcbiAgICB2aXNpYmxlUmFuZ2UuZW5kLmNvbHVtbiA9IEluZmluaXR5XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgaWYgKHNjb3Blcy5zb21lKHNjb3BlID0+IHByb3ZpZGVyLmdyYW1tYXJTY29wZXMuaW5kZXhPZihzY29wZSkgIT09IC0xKSkge1xuICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICByZXNvbHZlKHByb3ZpZGVyLmdldEludGVudGlvbnMoeyB0ZXh0RWRpdG9yLCB2aXNpYmxlUmFuZ2UgfSkpXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZVN1Z2dlc3Rpb25zKHJlc3VsdHMpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBudW1iZXIgPSArK3RoaXMubnVtYmVyXG4gICAgY29uc3QgcmVzdWx0cyA9IChhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcykpLnJlZHVjZShmdW5jdGlvbihpdGVtcywgaXRlbSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLmNvbmNhdChpdGVtKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgfSwgW10pXG5cbiAgICBpZiAobnVtYmVyICE9PSB0aGlzLm51bWJlciB8fCAhcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgIC8vIElmIGhhcyBiZWVuIGV4ZWN1dGVkIG9uZSBtb3JlIHRpbWUsIGlnbm9yZSB0aGVzZSByZXN1bHRzXG4gICAgICAvLyBPciB3ZSBqdXN0IGRvbid0IGhhdmUgYW55IHJlc3VsdHNcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbiAgcGFpbnQodGV4dEVkaXRvcjogVGV4dEVkaXRvciwgaW50ZW50aW9uczogQXJyYXk8SGlnaGxpZ2h0SXRlbT4pOiAoKCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IG1hcmtlcnMgPSBbXVxuICAgIGZvciAoY29uc3QgaW50ZW50aW9uIG9mIChpbnRlbnRpb25zOiBBcnJheTxIaWdobGlnaHRJdGVtPikpIHtcbiAgICAgIGNvbnN0IG1hdGNoZWRUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShpbnRlbnRpb24ucmFuZ2UpXG4gICAgICBjb25zdCBtYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShpbnRlbnRpb24ucmFuZ2UpXG4gICAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpbnRlbnRpb24sIG1hdGNoZWRUZXh0Lmxlbmd0aClcbiAgICAgIGludGVudGlvbi5jcmVhdGVkKHsgdGV4dEVkaXRvciwgZWxlbWVudCwgbWFya2VyLCBtYXRjaGVkVGV4dCB9KVxuICAgICAgdGV4dEVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBwb3NpdGlvbjogJ3RhaWwnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICAgIG1hcmtlci5vbkRpZENoYW5nZShmdW5jdGlvbih7IG5ld0hlYWRCdWZmZXJQb3NpdGlvbjogc3RhcnQsIG9sZFRhaWxCdWZmZXJQb3NpdGlvbjogZW5kIH0pIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IFBBRERJTkdfQ0hBUkFDVEVSLnJlcGVhdCh0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtzdGFydCwgZW5kXSkubGVuZ3RoKVxuICAgICAgfSlcbiAgICAgIG1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbihtYXJrZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgICAgIH0gY2F0Y2ggKF8pIHsgLyogTm8gT3AgKi8gfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5jbGVhcigpXG4gIH1cbn1cbiJdfQ==
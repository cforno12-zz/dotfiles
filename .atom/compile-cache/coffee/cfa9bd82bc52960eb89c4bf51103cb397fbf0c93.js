(function() {
  var Pigments, deserializers, registry;

  registry = require('../../lib/color-expressions');

  Pigments = require('../../lib/pigments');

  deserializers = {
    Palette: 'deserializePalette',
    ColorSearch: 'deserializeColorSearch',
    ColorProject: 'deserializeColorProject',
    ColorProjectElement: 'deserializeColorProjectElement',
    VariablesCollection: 'deserializeVariablesCollection'
  };

  beforeEach(function() {
    var jasmineContent, k, v;
    atom.config.set('pigments.markerType', 'native-background');
    atom.views.addViewProvider(Pigments.pigmentsViewProvider);
    for (k in deserializers) {
      v = deserializers[k];
      atom.deserializers.add({
        name: k,
        deserialize: Pigments[v]
      });
    }
    registry.removeExpression('pigments:variables');
    jasmineContent = document.body.querySelector('#jasmine-content');
    jasmineContent.style.width = '100%';
    return jasmineContent.style.height = '100%';
  });

  afterEach(function() {
    return registry.removeExpression('pigments:variables');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvc3BlYy1oZWxwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSOztFQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVI7O0VBRVgsYUFBQSxHQUNFO0lBQUEsT0FBQSxFQUFTLG9CQUFUO0lBQ0EsV0FBQSxFQUFhLHdCQURiO0lBRUEsWUFBQSxFQUFjLHlCQUZkO0lBR0EsbUJBQUEsRUFBcUIsZ0NBSHJCO0lBSUEsbUJBQUEsRUFBcUIsZ0NBSnJCOzs7RUFNRixVQUFBLENBQVcsU0FBQTtBQUNULFFBQUE7SUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLG1CQUF2QztJQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBWCxDQUEyQixRQUFRLENBQUMsb0JBQXBDO0FBRUEsU0FBQSxrQkFBQTs7TUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCO1FBQUEsSUFBQSxFQUFNLENBQU47UUFBUyxXQUFBLEVBQWEsUUFBUyxDQUFBLENBQUEsQ0FBL0I7T0FBdkI7QUFERjtJQUdBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUI7SUFFQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUI7SUFDakIsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFyQixHQUE2QjtXQUM3QixjQUFjLENBQUMsS0FBSyxDQUFDLE1BQXJCLEdBQThCO0VBWHJCLENBQVg7O0VBYUEsU0FBQSxDQUFVLFNBQUE7V0FDUixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsb0JBQTFCO0VBRFEsQ0FBVjtBQXZCQSIsInNvdXJjZXNDb250ZW50IjpbInJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vLi4vbGliL2NvbG9yLWV4cHJlc3Npb25zJ1xuUGlnbWVudHMgPSByZXF1aXJlICcuLi8uLi9saWIvcGlnbWVudHMnXG5cbmRlc2VyaWFsaXplcnMgPVxuICBQYWxldHRlOiAnZGVzZXJpYWxpemVQYWxldHRlJ1xuICBDb2xvclNlYXJjaDogJ2Rlc2VyaWFsaXplQ29sb3JTZWFyY2gnXG4gIENvbG9yUHJvamVjdDogJ2Rlc2VyaWFsaXplQ29sb3JQcm9qZWN0J1xuICBDb2xvclByb2plY3RFbGVtZW50OiAnZGVzZXJpYWxpemVDb2xvclByb2plY3RFbGVtZW50J1xuICBWYXJpYWJsZXNDb2xsZWN0aW9uOiAnZGVzZXJpYWxpemVWYXJpYWJsZXNDb2xsZWN0aW9uJ1xuXG5iZWZvcmVFYWNoIC0+XG4gIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMubWFya2VyVHlwZScsICduYXRpdmUtYmFja2dyb3VuZCcpXG4gIGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKFBpZ21lbnRzLnBpZ21lbnRzVmlld1Byb3ZpZGVyKVxuXG4gIGZvciBrLHYgb2YgZGVzZXJpYWxpemVyc1xuICAgIGF0b20uZGVzZXJpYWxpemVycy5hZGQgbmFtZTogaywgZGVzZXJpYWxpemU6IFBpZ21lbnRzW3ZdXG5cbiAgcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbigncGlnbWVudHM6dmFyaWFibGVzJylcblxuICBqYXNtaW5lQ29udGVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpXG4gIGphc21pbmVDb250ZW50LnN0eWxlLndpZHRoID0gJzEwMCUnXG4gIGphc21pbmVDb250ZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xuXG5hZnRlckVhY2ggLT5cbiAgcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbigncGlnbWVudHM6dmFyaWFibGVzJylcbiJdfQ==

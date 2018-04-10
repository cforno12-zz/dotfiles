(function() {
  var PigmentsAPI;

  module.exports = PigmentsAPI = (function() {
    function PigmentsAPI(project) {
      this.project = project;
    }

    PigmentsAPI.prototype.getProject = function() {
      return this.project;
    };

    PigmentsAPI.prototype.getPalette = function() {
      return this.project.getPalette();
    };

    PigmentsAPI.prototype.getVariables = function() {
      return this.project.getVariables();
    };

    PigmentsAPI.prototype.getColorVariables = function() {
      return this.project.getColorVariables();
    };

    PigmentsAPI.prototype.observeColorBuffers = function(callback) {
      return this.project.observeColorBuffers(callback);
    };

    return PigmentsAPI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGlnbWVudHMtYXBpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHFCQUFDLE9BQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDtJQUFEOzswQkFFYixVQUFBLEdBQVksU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKOzswQkFFWixVQUFBLEdBQVksU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxDQUFBO0lBQUg7OzBCQUVaLFlBQUEsR0FBYyxTQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUE7SUFBSDs7MEJBRWQsaUJBQUEsR0FBbUIsU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBQVQsQ0FBQTtJQUFIOzswQkFFbkIsbUJBQUEsR0FBcUIsU0FBQyxRQUFEO2FBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxtQkFBVCxDQUE2QixRQUE3QjtJQUFkOzs7OztBQVp2QiIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUGlnbWVudHNBUElcbiAgY29uc3RydWN0b3I6IChAcHJvamVjdCkgLT5cblxuICBnZXRQcm9qZWN0OiAtPiBAcHJvamVjdFxuXG4gIGdldFBhbGV0dGU6IC0+IEBwcm9qZWN0LmdldFBhbGV0dGUoKVxuXG4gIGdldFZhcmlhYmxlczogLT4gQHByb2plY3QuZ2V0VmFyaWFibGVzKClcblxuICBnZXRDb2xvclZhcmlhYmxlczogLT4gQHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKVxuXG4gIG9ic2VydmVDb2xvckJ1ZmZlcnM6IChjYWxsYmFjaykgLT4gQHByb2plY3Qub2JzZXJ2ZUNvbG9yQnVmZmVycyhjYWxsYmFjaylcbiJdfQ==

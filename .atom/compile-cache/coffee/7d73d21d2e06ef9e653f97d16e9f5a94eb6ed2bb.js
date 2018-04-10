(function() {
  var AtomicChrome, CompositeDisposable, Server, WSHandler, WS_PORT;

  CompositeDisposable = require('atom').CompositeDisposable;

  Server = require('ws').Server;

  WSHandler = require('./ws-handler');

  WS_PORT = 64292;

  module.exports = AtomicChrome = {
    activate: function(state) {
      this.wss = new Server({
        port: WS_PORT
      });
      this.wss.on('connection', function(ws) {
        return new WSHandler(ws);
      });
      return this.wss.on('error', function(err) {
        if (err.code !== 'EADDRINUSE') {
          return console.error(err);
        }
      });
    },
    deactivate: function() {
      return this.wss.close();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdG9taWMtY2hyb21lL2xpYi9hdG9taWMtY2hyb21lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixTQUF1QixPQUFBLENBQVEsSUFBUjs7RUFFeEIsU0FBQSxHQUF3QixPQUFBLENBQVEsY0FBUjs7RUFFeEIsT0FBQSxHQUFVOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBQUEsR0FDZjtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsR0FBRCxHQUFXLElBQUEsTUFBQSxDQUFPO1FBQUMsSUFBQSxFQUFNLE9BQVA7T0FBUDtNQUVYLElBQUMsQ0FBQSxHQUFHLENBQUMsRUFBTCxDQUFRLFlBQVIsRUFBc0IsU0FBQyxFQUFEO2VBQ2hCLElBQUEsU0FBQSxDQUFVLEVBQVY7TUFEZ0IsQ0FBdEI7YUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFNBQUMsR0FBRDtRQUNmLElBQTBCLEdBQUcsQ0FBQyxJQUFKLEtBQVksWUFBdEM7aUJBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLEVBQUE7O01BRGUsQ0FBakI7SUFMUSxDQUFWO0lBUUEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQTtJQURVLENBUlo7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1NlcnZlcn0gICAgICAgICAgICAgID0gcmVxdWlyZSAnd3MnXG5cbldTSGFuZGxlciAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vd3MtaGFuZGxlcidcblxuV1NfUE9SVCA9IDY0MjkyXG5cbm1vZHVsZS5leHBvcnRzID0gQXRvbWljQ2hyb21lID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAd3NzID0gbmV3IFNlcnZlcih7cG9ydDogV1NfUE9SVH0pXG5cbiAgICBAd3NzLm9uICdjb25uZWN0aW9uJywgKHdzKSAtPlxuICAgICAgbmV3IFdTSGFuZGxlcih3cylcbiAgICBAd3NzLm9uICdlcnJvcicsIChlcnIpIC0+XG4gICAgICBjb25zb2xlLmVycm9yKGVycikgdW5sZXNzIGVyci5jb2RlID09ICdFQUREUklOVVNFJ1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHdzcy5jbG9zZSgpXG4iXX0=

(function() {
  var AtomicChrome, Server, WSHandler, WS_PORT;

  Server = require('ws').Server;

  WSHandler = null;

  WS_PORT = 64292;

  module.exports = AtomicChrome = {
    activate: function(state) {
      this.wss = new Server({
        port: WS_PORT
      });
      this.wss.on('connection', function(ws) {
        if (WSHandler == null) {
          WSHandler = require('./ws-handler');
        }
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
    },
    config: {
      defaultExtension: {
        type: 'string',
        "default": '.md'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9taWMtY2hyb21lL2xpYi9hdG9taWMtY2hyb21lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsU0FBVSxPQUFBLENBQVEsSUFBUjs7RUFDWCxTQUFBLEdBQVk7O0VBQ1osT0FBQSxHQUFVOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBQUEsR0FDZjtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsR0FBRCxHQUFXLElBQUEsTUFBQSxDQUFPO1FBQUMsSUFBQSxFQUFNLE9BQVA7T0FBUDtNQUVYLElBQUMsQ0FBQSxHQUFHLENBQUMsRUFBTCxDQUFRLFlBQVIsRUFBc0IsU0FBQyxFQUFEOztVQUNwQixZQUFhLE9BQUEsQ0FBUSxjQUFSOztlQUNULElBQUEsU0FBQSxDQUFVLEVBQVY7TUFGZ0IsQ0FBdEI7YUFHQSxJQUFDLENBQUEsR0FBRyxDQUFDLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFNBQUMsR0FBRDtRQUNmLElBQTBCLEdBQUcsQ0FBQyxJQUFKLEtBQVksWUFBdEM7aUJBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLEVBQUE7O01BRGUsQ0FBakI7SUFOUSxDQUFWO0lBU0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQTtJQURVLENBVFo7SUFZQSxNQUFBLEVBQ0U7TUFBQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FERjtLQWJGOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie1NlcnZlcn0gPSByZXF1aXJlICd3cydcbldTSGFuZGxlciA9IG51bGwgIyBkZWZlciByZXF1aXJlIHRpbGwgbmVjZXNzYXJ5XG5XU19QT1JUID0gNjQyOTJcblxubW9kdWxlLmV4cG9ydHMgPSBBdG9taWNDaHJvbWUgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEB3c3MgPSBuZXcgU2VydmVyKHtwb3J0OiBXU19QT1JUfSlcblxuICAgIEB3c3Mub24gJ2Nvbm5lY3Rpb24nLCAod3MpIC0+XG4gICAgICBXU0hhbmRsZXIgPz0gcmVxdWlyZSAnLi93cy1oYW5kbGVyJ1xuICAgICAgbmV3IFdTSGFuZGxlcih3cylcbiAgICBAd3NzLm9uICdlcnJvcicsIChlcnIpIC0+XG4gICAgICBjb25zb2xlLmVycm9yKGVycikgdW5sZXNzIGVyci5jb2RlID09ICdFQUREUklOVVNFJ1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHdzcy5jbG9zZSgpXG5cbiAgY29uZmlnOlxuICAgIGRlZmF1bHRFeHRlbnNpb246XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy5tZCdcbiJdfQ==

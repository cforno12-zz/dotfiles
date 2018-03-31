
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, _, cfg, expandHomeDir, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(superClass) {
    extend(Uncrustify, superClass);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.link = "https://github.com/uncrustify/uncrustify";

    Uncrustify.prototype.executables = [
      {
        name: "Uncrustify",
        cmd: "uncrustify",
        homepage: "http://uncrustify.sourceforge.net/",
        installation: "https://github.com/uncrustify/uncrustify",
        version: {
          parse: function(text) {
            var error, v;
            try {
              v = text.match(/uncrustify (\d+\.\d+)/)[1];
            } catch (error1) {
              error = error1;
              this.error(error);
              if (v == null) {
                v = text.match(/Uncrustify-(\d+\.\d+)/)[1];
              }
            }
            if (v) {
              return v + ".0";
            }
          }
        },
        docker: {
          image: "unibeautify/uncrustify"
        }
      }
    ];

    Uncrustify.prototype.options = {
      Apex: true,
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options, context) {
      var fileExtension, uncrustify;
      fileExtension = context.fileExtension;
      uncrustify = this.exe("uncrustify");
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor, expandedConfigPath, projectPath;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            projectPath = atom.workspace.project.getPaths()[0];
            expandedConfigPath = expandHomeDir(configPath);
            configPath = path.resolve(projectPath, expandedConfigPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          lang = "C";
          switch (language) {
            case "Apex":
              lang = "Apex";
              break;
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return uncrustify.run(["-c", configPath, "-f", _this.tempFile("input", text, fileExtension && ("." + fileExtension)), "-o", outputFile = _this.tempFile("output", text, fileExtension && ("." + fileExtension)), "-l", lang]).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy91bmNydXN0aWZ5L2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxtREFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2IsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUjs7RUFDaEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3lCQUNyQixJQUFBLEdBQU07O3lCQUNOLElBQUEsR0FBTTs7eUJBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sWUFEUjtRQUVFLEdBQUEsRUFBSyxZQUZQO1FBR0UsUUFBQSxFQUFVLG9DQUhaO1FBSUUsWUFBQSxFQUFjLDBDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTCxnQkFBQTtBQUFBO2NBQ0UsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsdUJBQVgsQ0FBb0MsQ0FBQSxDQUFBLEVBRDFDO2FBQUEsY0FBQTtjQUVNO2NBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBTyxLQUFQO2NBQ0EsSUFBa0QsU0FBbEQ7Z0JBQUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsdUJBQVgsQ0FBb0MsQ0FBQSxDQUFBLEVBQXhDO2VBSkY7O1lBS0EsSUFBRyxDQUFIO0FBQ0UscUJBQU8sQ0FBQSxHQUFJLEtBRGI7O1VBTkssQ0FEQTtTQUxYO1FBZUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLHdCQUREO1NBZlY7T0FEVzs7O3lCQXNCYixPQUFB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QSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBckJLO0lBTEg7Ozs7S0F0QzhCO0FBVjFDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwOi8vdW5jcnVzdGlmeS5zb3VyY2Vmb3JnZS5uZXQvXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5jZmcgPSByZXF1aXJlKFwiLi9jZmdcIilcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuZXhwYW5kSG9tZURpciA9IHJlcXVpcmUoJ2V4cGFuZC1ob21lLWRpcicpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBVbmNydXN0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlVuY3J1c3RpZnlcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS91bmNydXN0aWZ5L3VuY3J1c3RpZnlcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiVW5jcnVzdGlmeVwiXG4gICAgICBjbWQ6IFwidW5jcnVzdGlmeVwiXG4gICAgICBob21lcGFnZTogXCJodHRwOi8vdW5jcnVzdGlmeS5zb3VyY2Vmb3JnZS5uZXQvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vdW5jcnVzdGlmeS91bmNydXN0aWZ5XCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPlxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgdiA9IHRleHQubWF0Y2goL3VuY3J1c3RpZnkgKFxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIEBlcnJvcihlcnJvcilcbiAgICAgICAgICAgIHYgPSB0ZXh0Lm1hdGNoKC9VbmNydXN0aWZ5LShcXGQrXFwuXFxkKykvKVsxXSBpZiBub3Qgdj9cbiAgICAgICAgICBpZiB2XG4gICAgICAgICAgICByZXR1cm4gdiArIFwiLjBcIlxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L3VuY3J1c3RpZnlcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBBcGV4OiB0cnVlXG4gICAgQzogdHJ1ZVxuICAgIFwiQysrXCI6IHRydWVcbiAgICBcIkMjXCI6IHRydWVcbiAgICBcIk9iamVjdGl2ZS1DXCI6IHRydWVcbiAgICBEOiB0cnVlXG4gICAgUGF3bjogdHJ1ZVxuICAgIFZhbGE6IHRydWVcbiAgICBKYXZhOiB0cnVlXG4gICAgQXJkdWlubzogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBmaWxlRXh0ZW5zaW9uID0gY29udGV4dC5maWxlRXh0ZW5zaW9uXG5cbiAgICB1bmNydXN0aWZ5ID0gQGV4ZShcInVuY3J1c3RpZnlcIilcbiAgICAjIGNvbnNvbGUubG9nKCd1bmNydXN0aWZ5LmJlYXV0aWZ5JywgbGFuZ3VhZ2UsIG9wdGlvbnMpXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgY29uZmlnUGF0aCA9IG9wdGlvbnMuY29uZmlnUGF0aFxuICAgICAgdW5sZXNzIGNvbmZpZ1BhdGhcbiAgICAgICAgIyBObyBjdXN0b20gY29uZmlnIHBhdGhcbiAgICAgICAgY2ZnIG9wdGlvbnMsIChlcnJvciwgY1BhdGgpIC0+XG4gICAgICAgICAgdGhyb3cgZXJyb3IgaWYgZXJyb3JcbiAgICAgICAgICByZXNvbHZlIGNQYXRoXG4gICAgICBlbHNlXG4gICAgICAgICMgSGFzIGN1c3RvbSBjb25maWcgcGF0aFxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgaWYgZWRpdG9yP1xuICAgICAgICAgIGJhc2VQYXRoID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLndvcmtzcGFjZS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKGJhc2VQYXRoKTtcbiAgICAgICAgICAjIEV4cGFuZCBIb21lIERpcmVjdG9yeSBpbiBDb25maWcgUGF0aFxuICAgICAgICAgIGV4cGFuZGVkQ29uZmlnUGF0aCA9IGV4cGFuZEhvbWVEaXIoY29uZmlnUGF0aClcbiAgICAgICAgICBjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKHByb2plY3RQYXRoLCBleHBhbmRlZENvbmZpZ1BhdGgpXG4gICAgICAgICAgcmVzb2x2ZSBjb25maWdQYXRoXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiTm8gVW5jcnVzdGlmeSBDb25maWcgUGF0aCBzZXQhIFBsZWFzZSBjb25maWd1cmUgVW5jcnVzdGlmeSB3aXRoIEF0b20gQmVhdXRpZnkuXCIpKVxuICAgIClcbiAgICAudGhlbigoY29uZmlnUGF0aCkgPT5cbiAgICAgICMgU2VsZWN0IFVuY3J1c3RpZnkgbGFuZ3VhZ2VcbiAgICAgIGxhbmcgPSBcIkNcIiAjIERlZmF1bHQgaXMgQ1xuICAgICAgc3dpdGNoIGxhbmd1YWdlXG4gICAgICAgIHdoZW4gXCJBcGV4XCJcbiAgICAgICAgICBsYW5nID0gXCJBcGV4XCJcbiAgICAgICAgd2hlbiBcIkNcIlxuICAgICAgICAgIGxhbmcgPSBcIkNcIlxuICAgICAgICB3aGVuIFwiQysrXCJcbiAgICAgICAgICBsYW5nID0gXCJDUFBcIlxuICAgICAgICB3aGVuIFwiQyNcIlxuICAgICAgICAgIGxhbmcgPSBcIkNTXCJcbiAgICAgICAgd2hlbiBcIk9iamVjdGl2ZS1DXCIsIFwiT2JqZWN0aXZlLUMrK1wiXG4gICAgICAgICAgbGFuZyA9IFwiT0MrXCJcbiAgICAgICAgd2hlbiBcIkRcIlxuICAgICAgICAgIGxhbmcgPSBcIkRcIlxuICAgICAgICB3aGVuIFwiUGF3blwiXG4gICAgICAgICAgbGFuZyA9IFwiUEFXTlwiXG4gICAgICAgIHdoZW4gXCJWYWxhXCJcbiAgICAgICAgICBsYW5nID0gXCJWQUxBXCJcbiAgICAgICAgd2hlbiBcIkphdmFcIlxuICAgICAgICAgIGxhbmcgPSBcIkpBVkFcIlxuICAgICAgICB3aGVuIFwiQXJkdWlub1wiXG4gICAgICAgICAgbGFuZyA9IFwiQ1BQXCJcblxuICAgICAgdW5jcnVzdGlmeS5ydW4oW1xuICAgICAgICBcIi1jXCJcbiAgICAgICAgY29uZmlnUGF0aFxuICAgICAgICBcIi1mXCJcbiAgICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dCwgZmlsZUV4dGVuc2lvbiBhbmQgXCIuI3tmaWxlRXh0ZW5zaW9ufVwiKVxuICAgICAgICBcIi1vXCJcbiAgICAgICAgb3V0cHV0RmlsZSA9IEB0ZW1wRmlsZShcIm91dHB1dFwiLCB0ZXh0LCBmaWxlRXh0ZW5zaW9uIGFuZCBcIi4je2ZpbGVFeHRlbnNpb259XCIpXG4gICAgICAgIFwiLWxcIlxuICAgICAgICBsYW5nXG4gICAgICAgIF0pXG4gICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgQHJlYWRGaWxlKG91dHB1dEZpbGUpXG4gICAgICAgIClcbiAgICApXG4iXX0=

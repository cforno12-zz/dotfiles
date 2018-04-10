(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(superClass) {
    extend(LatexBeautify, superClass);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.link = "https://github.com/cmhughes/latexindent.pl";

    LatexBeautify.prototype.isPreInstalled = false;

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, i, indentChar, len, ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      ref = options.align_columns_in_environments;
      for (i = 0, len = ref.length; i < len; i++) {
        delim = ref[i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-s", "-l", "-c=" + dirPath, _this.texFile, "-o", _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9sYXRleC1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzRCQUNyQixJQUFBLEdBQU07OzRCQUNOLElBQUEsR0FBTTs7NEJBQ04sY0FBQSxHQUFnQjs7NEJBRWhCLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxJQURBOzs7NEJBTVQsZUFBQSxHQUFpQixTQUFDLE9BQUQ7QUFDZixVQUFBO01BQUEsVUFBQSxHQUFhLE9BQU8sQ0FBQztNQUNyQixJQUFHLE9BQU8sQ0FBQyxnQkFBWDtRQUNFLFVBQUEsR0FBYSxNQURmOztNQUdBLE1BQUEsR0FBUyxtQkFBQSxHQUNtQixVQURuQixHQUM4QixnQ0FEOUIsR0FFMkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBVixDQUYzQixHQUVrRSxnQ0FGbEUsR0FHNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBVixDQUg3QixHQUdzRSxvQkFIdEUsR0FJaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFWLENBSmpCLEdBSTJDLDhCQUozQyxHQUsyQixDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUFWLENBTDNCLEdBS2dFO0FBR3pFO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxNQUFBLElBQVUsSUFBQSxHQUFLLEtBQUwsR0FBVztBQUR2QjtBQUVBLGFBQU87SUFmUTs7NEJBcUJqQixRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixNQUFoQjtNQUNSLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLFdBQW5CO01BQ1gsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUF1QixJQUF2QixFQUE2QixTQUFDLEdBQUQ7UUFDM0IsSUFBc0IsR0FBdEI7QUFBQSxpQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztNQUQyQixDQUE3QjtNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLG9CQUFuQjtNQUNkLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFVBQWQsRUFBMEIsTUFBMUIsRUFBa0MsU0FBQyxHQUFEO1FBQ2hDLElBQXNCLEdBQXRCO0FBQUEsaUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7TUFEZ0MsQ0FBbEM7TUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixZQUFuQjthQUNYLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBdUIsRUFBdkIsRUFBMkIsU0FBQyxHQUFEO1FBQ3pCLElBQXNCLEdBQXRCO0FBQUEsaUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7TUFEeUIsQ0FBM0I7SUFSUTs7NEJBWVYsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDSixJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtlQUNYLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxFQUFvQixTQUFDLEdBQUQsRUFBTSxPQUFOO1VBQ2xCLElBQXNCLEdBQXRCO0FBQUEsbUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7aUJBQ0EsT0FBQSxDQUFRLE9BQVI7UUFGa0IsQ0FBcEI7TUFEVyxDQUFULENBTUosQ0FBQyxJQU5HLENBTUUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFDSixjQUFBO1VBQUEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLEtBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLENBQXpCO2lCQUNBLEdBQUEsR0FBTSxLQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsRUFBb0IsQ0FDeEIsSUFEd0IsRUFFeEIsSUFGd0IsRUFHeEIsS0FBQSxHQUFRLE9BSGdCLEVBSXhCLEtBQUMsQ0FBQSxPQUp1QixFQUt4QixJQUx3QixFQU14QixLQUFDLENBQUEsT0FOdUIsQ0FBcEIsRUFPSDtZQUFBLElBQUEsRUFBTTtjQUNQLElBQUEsRUFBTSw0Q0FEQzthQUFOO1dBUEc7UUFGRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FORixDQW1CSixDQUFDLElBbkJHLENBbUJHLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDTCxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQUMsQ0FBQSxPQUFYO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBbkJIO0lBREk7Ozs7S0E1Q2lDO0FBUDdDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgPSByZXF1aXJlKFwiZnNcIilcbnRlbXAgPSByZXF1aXJlKFwidGVtcFwiKS50cmFjaygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMYXRleEJlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkxhdGV4IEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY21odWdoZXMvbGF0ZXhpbmRlbnQucGxcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgTGFUZVg6IHRydWVcbiAgfVxuXG4gICMgVGhlcmUgYXJlIHRvbyBtYW55IG9wdGlvbnMgd2l0aCBsYXRleG1rLCBJIGhhdmUgdHJpZWQgdG8gc2xpbSB0aGlzIGRvd24gdG8gdGhlIG1vc3QgdXNlZnVsIG9uZXMuXG4gICMgVGhpcyBtZXRob2QgY3JlYXRlcyBhIGNvbmZpZ3VyYXRpb24gZmlsZSBmb3IgbGF0ZXhpbmRlbnQuXG4gIGJ1aWxkQ29uZmlnRmlsZTogKG9wdGlvbnMpIC0+XG4gICAgaW5kZW50Q2hhciA9IG9wdGlvbnMuaW5kZW50X2NoYXJcbiAgICBpZiBvcHRpb25zLmluZGVudF93aXRoX3RhYnNcbiAgICAgIGluZGVudENoYXIgPSBcIlxcXFx0XCJcbiAgICAjICt0cnVlID0gMSBhbmQgK2ZhbHNlID0gMFxuICAgIGNvbmZpZyA9IFwiXCJcIlxuICAgICAgICAgICAgIGRlZmF1bHRJbmRlbnQ6IFxcXCIje2luZGVudENoYXJ9XFxcIlxuICAgICAgICAgICAgIGFsd2F5c0xvb2tmb3JTcGxpdEJyYWNlczogI3srb3B0aW9ucy5hbHdheXNfbG9va19mb3Jfc3BsaXRfYnJhY2VzfVxuICAgICAgICAgICAgIGFsd2F5c0xvb2tmb3JTcGxpdEJyYWNrZXRzOiAjeytvcHRpb25zLmFsd2F5c19sb29rX2Zvcl9zcGxpdF9icmFja2V0c31cbiAgICAgICAgICAgICBpbmRlbnRQcmVhbWJsZTogI3srb3B0aW9ucy5pbmRlbnRfcHJlYW1ibGV9XG4gICAgICAgICAgICAgcmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlOiAjeytvcHRpb25zLnJlbW92ZV90cmFpbGluZ193aGl0ZXNwYWNlfVxuICAgICAgICAgICAgIGxvb2tGb3JBbGlnbkRlbGltczpcXG5cbiAgICAgICAgICAgICBcIlwiXCJcbiAgICBmb3IgZGVsaW0gaW4gb3B0aW9ucy5hbGlnbl9jb2x1bW5zX2luX2Vudmlyb25tZW50c1xuICAgICAgY29uZmlnICs9IFwiXFx0I3tkZWxpbX06IDFcXG5cIlxuICAgIHJldHVybiBjb25maWdcblxuICAjIExhdGV4aW5kZW50IGFjY2VwdHMgY29uZmlndXJhdGlvbiBfZmlsZXNfIG9ubHkuXG4gICMgVGhpcyBmaWxlIGhhcyB0byBiZSBuYW1lZCBsb2NhbFNldHRpbmdzLnlhbWwgYW5kIGJlIGluIHRoZSBzYW1lIGZvbGRlciBhcyB0aGUgdGV4IGZpbGUuXG4gICMgSXQgYWxzbyBpbnNpc3RzIG9uIGNyZWF0aW5nIGEgbG9nIGZpbGUgc29tZXdoZXJlLlxuICAjIFNvIHdlIHNldCB1cCBhIGRpcmVjdG9yeSB3aXRoIGFsbCB0aGUgZmlsZXMgaW4gcGxhY2UuXG4gIHNldFVwRGlyOiAoZGlyUGF0aCwgdGV4dCwgY29uZmlnKSAtPlxuICAgIEB0ZXhGaWxlID0gcGF0aC5qb2luKGRpclBhdGgsIFwibGF0ZXgudGV4XCIpXG4gICAgZnMud3JpdGVGaWxlIEB0ZXhGaWxlLCB0ZXh0LCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgIEBjb25maWdGaWxlID0gcGF0aC5qb2luKGRpclBhdGgsIFwibG9jYWxTZXR0aW5ncy55YW1sXCIpXG4gICAgZnMud3JpdGVGaWxlIEBjb25maWdGaWxlLCBjb25maWcsIChlcnIpIC0+XG4gICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgQGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZGlyUGF0aCwgXCJpbmRlbnQubG9nXCIpXG4gICAgZnMud3JpdGVGaWxlIEBsb2dGaWxlLCBcIlwiLCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuXG4gICNCZWF1dGlmaWVyIGRvZXMgbm90IGN1cnJlbnRseSBoYXZlIGEgbWV0aG9kIGZvciBjcmVhdGluZyBkaXJlY3Rvcmllcywgc28gd2UgY2FsbCB0ZW1wIGRpcmVjdGx5LlxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdGVtcC5ta2RpcihcImxhdGV4XCIsIChlcnIsIGRpclBhdGgpIC0+XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgcmVzb2x2ZShkaXJQYXRoKVxuICAgICAgKVxuICAgIClcbiAgICAudGhlbigoZGlyUGF0aCk9PlxuICAgICAgQHNldFVwRGlyKGRpclBhdGgsIHRleHQsIEBidWlsZENvbmZpZ0ZpbGUob3B0aW9ucykpXG4gICAgICBydW4gPSBAcnVuIFwibGF0ZXhpbmRlbnRcIiwgW1xuICAgICAgICBcIi1zXCIgICAgICAgICAgICAjU2lsZW50IG1vZGVcbiAgICAgICAgXCItbFwiICAgICAgICAgICAgI1RlbGwgbGF0ZXhpbmRlbnQgd2UgaGF2ZSBhIGxvY2FsIGNvbmZpZ3VyYXRpb24gZmlsZVxuICAgICAgICBcIi1jPVwiICsgZGlyUGF0aCAjVGVsbCBsYXRleGluZGVudCB0byBwbGFjZSB0aGUgbG9nIGZpbGUgaW4gdGhpcyBkaXJlY3RvcnlcbiAgICAgICAgQHRleEZpbGVcbiAgICAgICAgXCItb1wiICAgICAgICAgICAgI091dHB1dCB0byB0aGUgc2FtZSBsb2NhdGlvbiBhcyBmaWxlLCAtdyBjcmVhdGVzIGEgYmFja3VwIGZpbGUsIHdoZXJlYXMgdGhpcyBkb2VzIG5vdFxuICAgICAgICBAdGV4RmlsZVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jbWh1Z2hlcy9sYXRleGluZGVudC5wbFwiXG4gICAgICB9XG4gICAgKVxuICAgIC50aGVuKCA9PlxuICAgICAgQHJlYWRGaWxlKEB0ZXhGaWxlKVxuICAgIClcbiJdfQ==

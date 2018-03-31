
/*
Requires https://github.com/FriendsOfPHP/PHP-CS-Fixer
 */

(function() {
  "use strict";
  var Beautifier, PHPCSFixer, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = PHPCSFixer = (function(superClass) {
    extend(PHPCSFixer, superClass);

    function PHPCSFixer() {
      return PHPCSFixer.__super__.constructor.apply(this, arguments);
    }

    PHPCSFixer.prototype.name = 'PHP-CS-Fixer';

    PHPCSFixer.prototype.link = "https://github.com/FriendsOfPHP/PHP-CS-Fixer";

    PHPCSFixer.prototype.executables = [
      {
        name: "PHP",
        cmd: "php",
        homepage: "http://php.net/",
        installation: "http://php.net/manual/en/install.php",
        version: {
          parse: function(text) {
            return text.match(/PHP (\d+\.\d+\.\d+)/)[1];
          }
        }
      }, {
        name: "PHP-CS-Fixer",
        cmd: "php-cs-fixer",
        homepage: "https://github.com/FriendsOfPHP/PHP-CS-Fixer",
        installation: "https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation",
        optional: true,
        version: {
          parse: function(text) {
            try {
              return text.match(/version (.*) by/)[1] + ".0";
            } catch (error) {
              return text.match(/PHP CS Fixer (\d+\.\d+\.\d+)/)[1];
            }
          }
        },
        docker: {
          image: "unibeautify/php-cs-fixer",
          workingDir: "/project"
        }
      }
    ];

    PHPCSFixer.prototype.options = {
      PHP: {
        rules: true,
        cs_fixer_path: true,
        cs_fixer_version: true,
        cs_fixer_config_file: true,
        allow_risky: true,
        level: true,
        fixers: true
      }
    };

    PHPCSFixer.prototype.beautify = function(text, language, options, context) {
      var configFiles, isVersion1, php, phpCsFixer, phpCsFixerOptions, runOptions;
      this.debug('php-cs-fixer', options);
      php = this.exe('php');
      phpCsFixer = this.exe('php-cs-fixer');
      configFiles = ['.php_cs', '.php_cs.dist'];
      if (!options.cs_fixer_config_file) {
        options.cs_fixer_config_file = (context != null) && (context.filePath != null) ? this.findFile(path.dirname(context.filePath), configFiles) : void 0;
      }
      if (!options.cs_fixer_config_file) {
        options.cs_fixer_config_file = this.findFile(atom.project.getPaths()[0], configFiles);
      }
      phpCsFixerOptions = ["fix", options.rules ? "--rules=" + options.rules : void 0, options.cs_fixer_config_file ? "--config=" + options.cs_fixer_config_file : void 0, options.allow_risky ? "--allow-risky=" + options.allow_risky : void 0, "--using-cache=no"];
      isVersion1 = (phpCsFixer.isInstalled && phpCsFixer.isVersion('1.x')) || (options.cs_fixer_version && phpCsFixer.versionSatisfies(options.cs_fixer_version + ".0.0", '1.x'));
      if (isVersion1) {
        phpCsFixerOptions = ["fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, options.cs_fixer_config_file ? "--config-file=" + options.cs_fixer_config_file : void 0];
      }
      runOptions = {
        ignoreReturnCode: true,
        help: {
          link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
        }
      };
      if (options.cs_fixer_path) {
        this.deprecateOptionForExecutable("PHP-CS-Fixer", "PHP - PHP-CS-Fixer Path (cs_fixer_path)", "Path");
      }
      return this.Promise.all([options.cs_fixer_path ? this.which(options.cs_fixer_path) : void 0, phpCsFixer.path(), this.tempFile("temp", text, '.php')]).then((function(_this) {
        return function(arg) {
          var customPhpCsFixerPath, finalPhpCsFixerPath, isPhpScript, phpCsFixerPath, tempFile;
          customPhpCsFixerPath = arg[0], phpCsFixerPath = arg[1], tempFile = arg[2];
          finalPhpCsFixerPath = customPhpCsFixerPath && path.isAbsolute(customPhpCsFixerPath) ? customPhpCsFixerPath : phpCsFixerPath;
          _this.verbose('finalPhpCsFixerPath', finalPhpCsFixerPath, phpCsFixerPath, customPhpCsFixerPath);
          isPhpScript = (finalPhpCsFixerPath.indexOf(".phar") !== -1) || (finalPhpCsFixerPath.indexOf(".php") !== -1);
          _this.verbose('isPhpScript', isPhpScript);
          if (finalPhpCsFixerPath && isPhpScript) {
            return php.run([finalPhpCsFixerPath, phpCsFixerOptions, tempFile], runOptions).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return phpCsFixer.run([phpCsFixerOptions, tempFile], Object.assign({}, runOptions, {
              cmd: finalPhpCsFixerPath
            })).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return PHPCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9waHAtY3MtZml4ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLDRCQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7eUJBRXJCLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxLQURSO1FBRUUsR0FBQSxFQUFLLEtBRlA7UUFHRSxRQUFBLEVBQVUsaUJBSFo7UUFJRSxZQUFBLEVBQWMsc0NBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDttQkFBVSxJQUFJLENBQUMsS0FBTCxDQUFXLHFCQUFYLENBQWtDLENBQUEsQ0FBQTtVQUE1QyxDQURBO1NBTFg7T0FEVyxFQVVYO1FBQ0UsSUFBQSxFQUFNLGNBRFI7UUFFRSxHQUFBLEVBQUssY0FGUDtRQUdFLFFBQUEsRUFBVSw4Q0FIWjtRQUlFLFlBQUEsRUFBYywyREFKaEI7UUFLRSxRQUFBLEVBQVUsSUFMWjtRQU1FLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFDTDtxQkFDRSxJQUFJLENBQUMsS0FBTCxDQUFXLGlCQUFYLENBQThCLENBQUEsQ0FBQSxDQUE5QixHQUFtQyxLQURyQzthQUFBLGFBQUE7cUJBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyw4QkFBWCxDQUEyQyxDQUFBLENBQUEsRUFIN0M7O1VBREssQ0FEQTtTQU5YO1FBYUUsTUFBQSxFQUFRO1VBQ04sS0FBQSxFQUFPLDBCQUREO1VBRU4sVUFBQSxFQUFZLFVBRk47U0Fi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ZW5kc09mUEhQL1BIUC1DUy1GaXhlclxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQSFBDU0ZpeGVyIGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6ICdQSFAtQ1MtRml4ZXInXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0ZyaWVuZHNPZlBIUC9QSFAtQ1MtRml4ZXJcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiUEhQXCJcbiAgICAgIGNtZDogXCJwaHBcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cDovL3BocC5uZXQvXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwOi8vcGhwLm5ldC9tYW51YWwvZW4vaW5zdGFsbC5waHBcIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+IHRleHQubWF0Y2goL1BIUCAoXFxkK1xcLlxcZCtcXC5cXGQrKS8pWzFdXG4gICAgICB9XG4gICAgfVxuICAgIHtcbiAgICAgIG5hbWU6IFwiUEhQLUNTLUZpeGVyXCJcbiAgICAgIGNtZDogXCJwaHAtY3MtZml4ZXJcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9naXRodWIuY29tL0ZyaWVuZHNPZlBIUC9QSFAtQ1MtRml4ZXJcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9GcmllbmRzT2ZQSFAvUEhQLUNTLUZpeGVyI2luc3RhbGxhdGlvblwiXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC92ZXJzaW9uICguKikgYnkvKVsxXSArIFwiLjBcIlxuICAgICAgICAgIGNhdGNoXG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC9QSFAgQ1MgRml4ZXIgKFxcZCtcXC5cXGQrXFwuXFxkKykvKVsxXVxuICAgICAgfVxuICAgICAgZG9ja2VyOiB7XG4gICAgICAgIGltYWdlOiBcInVuaWJlYXV0aWZ5L3BocC1jcy1maXhlclwiXG4gICAgICAgIHdvcmtpbmdEaXI6IFwiL3Byb2plY3RcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgUEhQOlxuICAgICAgcnVsZXM6IHRydWVcbiAgICAgIGNzX2ZpeGVyX3BhdGg6IHRydWVcbiAgICAgIGNzX2ZpeGVyX3ZlcnNpb246IHRydWVcbiAgICAgIGNzX2ZpeGVyX2NvbmZpZ19maWxlOiB0cnVlXG4gICAgICBhbGxvd19yaXNreTogdHJ1ZVxuICAgICAgbGV2ZWw6IHRydWVcbiAgICAgIGZpeGVyczogdHJ1ZVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG4gICAgQGRlYnVnKCdwaHAtY3MtZml4ZXInLCBvcHRpb25zKVxuICAgIHBocCA9IEBleGUoJ3BocCcpXG4gICAgcGhwQ3NGaXhlciA9IEBleGUoJ3BocC1jcy1maXhlcicpXG4gICAgY29uZmlnRmlsZXMgPSBbJy5waHBfY3MnLCAnLnBocF9jcy5kaXN0J11cblxuICAgICMgRmluZCBhIGNvbmZpZyBmaWxlIGluIHRoZSB3b3JraW5nIGRpcmVjdG9yeSBpZiBhIGN1c3RvbSBvbmUgd2FzIG5vdCBwcm92aWRlZFxuICAgIGlmIG5vdCBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlXG4gICAgICBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlID0gaWYgY29udGV4dD8gYW5kIGNvbnRleHQuZmlsZVBhdGg/IHRoZW4gQGZpbmRGaWxlKHBhdGguZGlybmFtZShjb250ZXh0LmZpbGVQYXRoKSwgY29uZmlnRmlsZXMpXG5cbiAgICAjIFRyeSBhZ2FpbiB0byBmaW5kIGEgY29uZmlnIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdFxuICAgIGlmIG5vdCBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlXG4gICAgICBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlID0gQGZpbmRGaWxlKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCBjb25maWdGaWxlcylcblxuICAgIHBocENzRml4ZXJPcHRpb25zID0gW1xuICAgICAgXCJmaXhcIlxuICAgICAgXCItLXJ1bGVzPSN7b3B0aW9ucy5ydWxlc31cIiBpZiBvcHRpb25zLnJ1bGVzXG4gICAgICBcIi0tY29uZmlnPSN7b3B0aW9ucy5jc19maXhlcl9jb25maWdfZmlsZX1cIiBpZiBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlXG4gICAgICBcIi0tYWxsb3ctcmlza3k9I3tvcHRpb25zLmFsbG93X3Jpc2t5fVwiIGlmIG9wdGlvbnMuYWxsb3dfcmlza3lcbiAgICAgIFwiLS11c2luZy1jYWNoZT1ub1wiXG4gICAgXVxuXG4gICAgaXNWZXJzaW9uMSA9ICgocGhwQ3NGaXhlci5pc0luc3RhbGxlZCBhbmQgcGhwQ3NGaXhlci5pc1ZlcnNpb24oJzEueCcpKSBvciBcXFxuICAgICAgKG9wdGlvbnMuY3NfZml4ZXJfdmVyc2lvbiBhbmQgcGhwQ3NGaXhlci52ZXJzaW9uU2F0aXNmaWVzKFwiI3tvcHRpb25zLmNzX2ZpeGVyX3ZlcnNpb259LjAuMFwiLCAnMS54JykpKVxuICAgIGlmIGlzVmVyc2lvbjFcbiAgICAgIHBocENzRml4ZXJPcHRpb25zID0gW1xuICAgICAgICBcImZpeFwiXG4gICAgICAgIFwiLS1sZXZlbD0je29wdGlvbnMubGV2ZWx9XCIgaWYgb3B0aW9ucy5sZXZlbFxuICAgICAgICBcIi0tZml4ZXJzPSN7b3B0aW9ucy5maXhlcnN9XCIgaWYgb3B0aW9ucy5maXhlcnNcbiAgICAgICAgXCItLWNvbmZpZy1maWxlPSN7b3B0aW9ucy5jc19maXhlcl9jb25maWdfZmlsZX1cIiBpZiBvcHRpb25zLmNzX2ZpeGVyX2NvbmZpZ19maWxlXG4gICAgICBdXG4gICAgcnVuT3B0aW9ucyA9IHtcbiAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWVcbiAgICAgIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vRnJpZW5kc09mUEhQL1BIUC1DUy1GaXhlclwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgIyBGaW5kIHBocC1jcy1maXhlci5waGFyIHNjcmlwdFxuICAgIGlmIG9wdGlvbnMuY3NfZml4ZXJfcGF0aFxuICAgICAgQGRlcHJlY2F0ZU9wdGlvbkZvckV4ZWN1dGFibGUoXCJQSFAtQ1MtRml4ZXJcIiwgXCJQSFAgLSBQSFAtQ1MtRml4ZXIgUGF0aCAoY3NfZml4ZXJfcGF0aClcIiwgXCJQYXRoXCIpXG5cbiAgICBAUHJvbWlzZS5hbGwoW1xuICAgICAgQHdoaWNoKG9wdGlvbnMuY3NfZml4ZXJfcGF0aCkgaWYgb3B0aW9ucy5jc19maXhlcl9wYXRoXG4gICAgICBwaHBDc0ZpeGVyLnBhdGgoKVxuICAgICAgQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0LCAnLnBocCcpXG4gICAgXSkudGhlbigoW2N1c3RvbVBocENzRml4ZXJQYXRoLCBwaHBDc0ZpeGVyUGF0aCwgdGVtcEZpbGVdKSA9PlxuICAgICAgIyBHZXQgZmlyc3QgdmFsaWQsIGFic29sdXRlIHBhdGhcbiAgICAgIGZpbmFsUGhwQ3NGaXhlclBhdGggPSBpZiBjdXN0b21QaHBDc0ZpeGVyUGF0aCBhbmQgcGF0aC5pc0Fic29sdXRlKGN1c3RvbVBocENzRml4ZXJQYXRoKSB0aGVuIFxcXG4gICAgICAgIGN1c3RvbVBocENzRml4ZXJQYXRoIGVsc2UgcGhwQ3NGaXhlclBhdGhcbiAgICAgIEB2ZXJib3NlKCdmaW5hbFBocENzRml4ZXJQYXRoJywgZmluYWxQaHBDc0ZpeGVyUGF0aCwgcGhwQ3NGaXhlclBhdGgsIGN1c3RvbVBocENzRml4ZXJQYXRoKVxuXG4gICAgICBpc1BocFNjcmlwdCA9IChmaW5hbFBocENzRml4ZXJQYXRoLmluZGV4T2YoXCIucGhhclwiKSBpc250IC0xKSBvciAoZmluYWxQaHBDc0ZpeGVyUGF0aC5pbmRleE9mKFwiLnBocFwiKSBpc250IC0xKVxuICAgICAgQHZlcmJvc2UoJ2lzUGhwU2NyaXB0JywgaXNQaHBTY3JpcHQpXG5cbiAgICAgIGlmIGZpbmFsUGhwQ3NGaXhlclBhdGggYW5kIGlzUGhwU2NyaXB0XG4gICAgICAgIHBocC5ydW4oW2ZpbmFsUGhwQ3NGaXhlclBhdGgsIHBocENzRml4ZXJPcHRpb25zLCB0ZW1wRmlsZV0sIHJ1bk9wdGlvbnMpXG4gICAgICAgICAgLnRoZW4oPT5cbiAgICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgICApXG4gICAgICBlbHNlXG4gICAgICAgIHBocENzRml4ZXIucnVuKFtwaHBDc0ZpeGVyT3B0aW9ucywgdGVtcEZpbGVdLFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHJ1bk9wdGlvbnMsIHsgY21kOiBmaW5hbFBocENzRml4ZXJQYXRoIH0pXG4gICAgICAgIClcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICApXG4iXX0=

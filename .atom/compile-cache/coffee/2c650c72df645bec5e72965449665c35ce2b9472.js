(function() {
  var BlendModes, Color, ColorContext, ColorExpression, ColorParser, SVGColors, clamp, clampInt, comma, float, floatOrPercent, hexadecimal, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, ref, scopeFromFileName, split, variables,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Color = ref[0], ColorParser = ref[1], ColorExpression = ref[2], SVGColors = ref[3], BlendModes = ref[4], int = ref[5], float = ref[6], percent = ref[7], optionalPercent = ref[8], intOrPercent = ref[9], floatOrPercent = ref[10], comma = ref[11], notQuote = ref[12], hexadecimal = ref[13], ps = ref[14], pe = ref[15], variables = ref[16], namePrefixes = ref[17], split = ref[18], clamp = ref[19], clampInt = ref[20], scopeFromFileName = ref[21];

  module.exports = ColorContext = (function() {
    function ColorContext(options) {
      var colorVariables, expr, i, j, len, len1, ref1, ref2, ref3, sorted, v;
      if (options == null) {
        options = {};
      }
      this.sortPaths = bind(this.sortPaths, this);
      if (Color == null) {
        Color = require('./color');
        SVGColors = require('./svg-colors');
        BlendModes = require('./blend-modes');
        if (ColorExpression == null) {
          ColorExpression = require('./color-expression');
        }
        ref1 = require('./regexes'), int = ref1.int, float = ref1.float, percent = ref1.percent, optionalPercent = ref1.optionalPercent, intOrPercent = ref1.intOrPercent, floatOrPercent = ref1.floatOrPercent, comma = ref1.comma, notQuote = ref1.notQuote, hexadecimal = ref1.hexadecimal, ps = ref1.ps, pe = ref1.pe, variables = ref1.variables, namePrefixes = ref1.namePrefixes;
        ColorContext.prototype.SVGColors = SVGColors;
        ColorContext.prototype.Color = Color;
        ColorContext.prototype.BlendModes = BlendModes;
        ColorContext.prototype.int = int;
        ColorContext.prototype.float = float;
        ColorContext.prototype.percent = percent;
        ColorContext.prototype.optionalPercent = optionalPercent;
        ColorContext.prototype.intOrPercent = intOrPercent;
        ColorContext.prototype.floatOrPercent = floatOrPercent;
        ColorContext.prototype.comma = comma;
        ColorContext.prototype.notQuote = notQuote;
        ColorContext.prototype.hexadecimal = hexadecimal;
        ColorContext.prototype.ps = ps;
        ColorContext.prototype.pe = pe;
        ColorContext.prototype.variablesRE = variables;
        ColorContext.prototype.namePrefixes = namePrefixes;
      }
      variables = options.variables, colorVariables = options.colorVariables, this.referenceVariable = options.referenceVariable, this.referencePath = options.referencePath, this.rootPaths = options.rootPaths, this.parser = options.parser, this.colorVars = options.colorVars, this.vars = options.vars, this.defaultVars = options.defaultVars, this.defaultColorVars = options.defaultColorVars, sorted = options.sorted, this.registry = options.registry, this.sassScopeSuffix = options.sassScopeSuffix;
      if (variables == null) {
        variables = [];
      }
      if (colorVariables == null) {
        colorVariables = [];
      }
      if (this.rootPaths == null) {
        this.rootPaths = [];
      }
      if (this.referenceVariable != null) {
        if (this.referencePath == null) {
          this.referencePath = this.referenceVariable.path;
        }
      }
      if (this.sorted) {
        this.variables = variables;
        this.colorVariables = colorVariables;
      } else {
        this.variables = variables.slice().sort(this.sortPaths);
        this.colorVariables = colorVariables.slice().sort(this.sortPaths);
      }
      if (this.vars == null) {
        this.vars = {};
        this.colorVars = {};
        this.defaultVars = {};
        this.defaultColorVars = {};
        ref2 = this.variables;
        for (i = 0, len = ref2.length; i < len; i++) {
          v = ref2[i];
          if (!v["default"]) {
            this.vars[v.name] = v;
          }
          if (v["default"]) {
            this.defaultVars[v.name] = v;
          }
        }
        ref3 = this.colorVariables;
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          v = ref3[j];
          if (!v["default"]) {
            this.colorVars[v.name] = v;
          }
          if (v["default"]) {
            this.defaultColorVars[v.name] = v;
          }
        }
      }
      if ((this.registry.getExpression('pigments:variables') == null) && this.colorVariables.length > 0) {
        expr = ColorExpression.colorExpressionForColorVariables(this.colorVariables);
        this.registry.addExpression(expr);
      }
      if (this.parser == null) {
        if (ColorParser == null) {
          ColorParser = require('./color-parser');
        }
        this.parser = new ColorParser(this.registry, this);
      }
      this.usedVariables = [];
      this.resolvedVariables = [];
    }

    ColorContext.prototype.sortPaths = function(a, b) {
      var rootA, rootB, rootReference;
      if (this.referencePath != null) {
        if (a.path === b.path) {
          return 0;
        }
        if (a.path === this.referencePath) {
          return 1;
        }
        if (b.path === this.referencePath) {
          return -1;
        }
        rootReference = this.rootPathForPath(this.referencePath);
        rootA = this.rootPathForPath(a.path);
        rootB = this.rootPathForPath(b.path);
        if (rootA === rootB) {
          return 0;
        }
        if (rootA === rootReference) {
          return 1;
        }
        if (rootB === rootReference) {
          return -1;
        }
        return 0;
      } else {
        return 0;
      }
    };

    ColorContext.prototype.rootPathForPath = function(path) {
      var i, len, ref1, root;
      ref1 = this.rootPaths;
      for (i = 0, len = ref1.length; i < len; i++) {
        root = ref1[i];
        if (path.indexOf(root + "/") === 0) {
          return root;
        }
      }
    };

    ColorContext.prototype.clone = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        referenceVariable: this.referenceVariable,
        parser: this.parser,
        vars: this.vars,
        colorVars: this.colorVars,
        defaultVars: this.defaultVars,
        defaultColorVars: this.defaultColorVars,
        sorted: true
      });
    };

    ColorContext.prototype.containsVariable = function(variableName) {
      return indexOf.call(this.getVariablesNames(), variableName) >= 0;
    };

    ColorContext.prototype.hasColorVariables = function() {
      return this.colorVariables.length > 0;
    };

    ColorContext.prototype.getVariables = function() {
      return this.variables;
    };

    ColorContext.prototype.getColorVariables = function() {
      return this.colorVariables;
    };

    ColorContext.prototype.getVariablesNames = function() {
      return this.varNames != null ? this.varNames : this.varNames = Object.keys(this.vars);
    };

    ColorContext.prototype.getVariablesCount = function() {
      return this.varCount != null ? this.varCount : this.varCount = this.getVariablesNames().length;
    };

    ColorContext.prototype.readUsedVariables = function() {
      var i, len, ref1, usedVariables, v;
      usedVariables = [];
      ref1 = this.usedVariables;
      for (i = 0, len = ref1.length; i < len; i++) {
        v = ref1[i];
        if (indexOf.call(usedVariables, v) < 0) {
          usedVariables.push(v);
        }
      }
      this.usedVariables = [];
      this.resolvedVariables = [];
      return usedVariables;
    };

    ColorContext.prototype.getValue = function(value) {
      var lastRealValue, lookedUpValues, realValue, ref1, ref2;
      ref1 = [], realValue = ref1[0], lastRealValue = ref1[1];
      lookedUpValues = [value];
      while ((realValue = (ref2 = this.vars[value]) != null ? ref2.value : void 0) && indexOf.call(lookedUpValues, realValue) < 0) {
        this.usedVariables.push(value);
        value = lastRealValue = realValue;
        lookedUpValues.push(realValue);
      }
      if (indexOf.call(lookedUpValues, realValue) >= 0) {
        return void 0;
      } else {
        return lastRealValue;
      }
    };

    ColorContext.prototype.readColorExpression = function(value) {
      if (this.colorVars[value] != null) {
        this.usedVariables.push(value);
        return this.colorVars[value].value;
      } else if (this.defaultColorVars[value] != null) {
        this.usedVariables.push(value);
        return this.defaultColorVars[value].value;
      } else {
        return value;
      }
    };

    ColorContext.prototype.readColor = function(value, keepAllVariables) {
      var realValue, ref1, result, scope;
      if (keepAllVariables == null) {
        keepAllVariables = false;
      }
      if (indexOf.call(this.usedVariables, value) >= 0 && !(indexOf.call(this.resolvedVariables, value) >= 0)) {
        return;
      }
      realValue = this.readColorExpression(value);
      if ((realValue == null) || indexOf.call(this.usedVariables, realValue) >= 0) {
        return;
      }
      scope = this.colorVars[value] != null ? this.scopeFromFileName(this.colorVars[value].path) : '*';
      this.usedVariables = this.usedVariables.filter(function(v) {
        return v !== realValue;
      });
      result = this.parser.parse(realValue, scope, false);
      if (result != null) {
        if (result.invalid && (this.defaultColorVars[realValue] != null)) {
          result = this.readColor(this.defaultColorVars[realValue].value);
          value = realValue;
        }
      } else if (this.defaultColorVars[value] != null) {
        this.usedVariables.push(value);
        result = this.readColor(this.defaultColorVars[value].value);
      } else {
        if (this.vars[value] != null) {
          this.usedVariables.push(value);
        }
      }
      if (result != null) {
        this.resolvedVariables.push(value);
        if (keepAllVariables || indexOf.call(this.usedVariables, value) < 0) {
          result.variables = ((ref1 = result.variables) != null ? ref1 : []).concat(this.readUsedVariables());
        }
      }
      return result;
    };

    ColorContext.prototype.scopeFromFileName = function(path) {
      var scope;
      if (scopeFromFileName == null) {
        scopeFromFileName = require('./scope-from-file-name');
      }
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.sassScopeSuffix].join(':');
      }
      return scope;
    };

    ColorContext.prototype.readFloat = function(value) {
      var res;
      res = parseFloat(value);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readInt = function(value, base) {
      var res;
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readPercent = function(value) {
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.defaultVars[value].value);
      }
      return Math.round(parseFloat(value) * 2.55);
    };

    ColorContext.prototype.readIntOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return 0/0;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    };

    ColorContext.prototype.readFloatOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return 0/0;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = parseFloat(value) / 100;
      } else {
        res = parseFloat(value);
        if (res > 1) {
          res = res / 100;
        }
        res;
      }
      return res;
    };

    ColorContext.prototype.split = function(value) {
      var ref1;
      if (split == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return split(value);
    };

    ColorContext.prototype.clamp = function(value) {
      var ref1;
      if (clamp == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return clamp(value);
    };

    ColorContext.prototype.clampInt = function(value) {
      var ref1;
      if (clampInt == null) {
        ref1 = require('./utils'), split = ref1.split, clamp = ref1.clamp, clampInt = ref1.clampInt;
      }
      return clampInt(value);
    };

    ColorContext.prototype.isInvalid = function(color) {
      return !Color.isValid(color);
    };

    ColorContext.prototype.readParam = function(param, block) {
      var _, name, re, ref1, value;
      re = RegExp("\\$(\\w+):\\s*((-?" + this.float + ")|" + this.variablesRE + ")");
      if (re.test(param)) {
        ref1 = re.exec(param), _ = ref1[0], name = ref1[1], value = ref1[2];
        return block(name, value);
      }
    };

    ColorContext.prototype.contrast = function(base, dark, light, threshold) {
      var ref1;
      if (dark == null) {
        dark = new Color('black');
      }
      if (light == null) {
        light = new Color('white');
      }
      if (threshold == null) {
        threshold = 0.43;
      }
      if (dark.luma > light.luma) {
        ref1 = [dark, light], light = ref1[0], dark = ref1[1];
      }
      if (base.luma > threshold) {
        return dark;
      } else {
        return light;
      }
    };

    ColorContext.prototype.mixColors = function(color1, color2, amount, round) {
      var color, inverse;
      if (amount == null) {
        amount = 0.5;
      }
      if (round == null) {
        round = Math.floor;
      }
      if (!((color1 != null) && (color2 != null) && !isNaN(amount))) {
        return new Color(0/0, 0/0, 0/0, 0/0);
      }
      inverse = 1 - amount;
      color = new Color;
      color.rgba = [round(color1.red * amount + color2.red * inverse), round(color1.green * amount + color2.green * inverse), round(color1.blue * amount + color2.blue * inverse), color1.alpha * amount + color2.alpha * inverse];
      return color;
    };

    return ColorContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJQQUFBO0lBQUE7OztFQUFBLE1BS0ksRUFMSixFQUNFLGNBREYsRUFDUyxvQkFEVCxFQUNzQix3QkFEdEIsRUFDdUMsa0JBRHZDLEVBQ2tELG1CQURsRCxFQUVFLFlBRkYsRUFFTyxjQUZQLEVBRWMsZ0JBRmQsRUFFdUIsd0JBRnZCLEVBRXdDLHFCQUZ4QyxFQUVzRCx3QkFGdEQsRUFFc0UsZUFGdEUsRUFHRSxrQkFIRixFQUdZLHFCQUhaLEVBR3lCLFlBSHpCLEVBRzZCLFlBSDdCLEVBR2lDLG1CQUhqQyxFQUc0QyxzQkFINUMsRUFJRSxlQUpGLEVBSVMsZUFKVCxFQUlnQixrQkFKaEIsRUFJMEI7O0VBRzFCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxzQkFBQyxPQUFEO0FBQ1gsVUFBQTs7UUFEWSxVQUFROzs7TUFDcEIsSUFBTyxhQUFQO1FBQ0UsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSO1FBQ1IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSO1FBQ1osVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztVQUNiLGtCQUFtQixPQUFBLENBQVEsb0JBQVI7O1FBRW5CLE9BR0ksT0FBQSxDQUFRLFdBQVIsQ0FISixFQUNFLGNBREYsRUFDTyxrQkFEUCxFQUNjLHNCQURkLEVBQ3VCLHNDQUR2QixFQUN3QyxnQ0FEeEMsRUFDc0Qsb0NBRHRELEVBRUUsa0JBRkYsRUFFUyx3QkFGVCxFQUVtQiw4QkFGbkIsRUFFZ0MsWUFGaEMsRUFFb0MsWUFGcEMsRUFFd0MsMEJBRnhDLEVBRW1EO1FBR25ELFlBQVksQ0FBQSxTQUFFLENBQUEsU0FBZCxHQUEwQjtRQUMxQixZQUFZLENBQUEsU0FBRSxDQUFBLEtBQWQsR0FBc0I7UUFDdEIs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QUFBLEdBQUk7TUFDZCxLQUFBLEdBQVEsSUFBSTtNQUVaLEtBQUssQ0FBQyxJQUFOLEdBQWEsQ0FDWCxLQUFBLENBQU0sTUFBTSxDQUFDLEdBQVAsR0FBYSxNQUFiLEdBQXNCLE1BQU0sQ0FBQyxHQUFQLEdBQWEsT0FBekMsQ0FEVyxFQUVYLEtBQUEsQ0FBTSxNQUFNLENBQUMsS0FBUCxHQUFlLE1BQWYsR0FBd0IsTUFBTSxDQUFDLEtBQVAsR0FBZSxPQUE3QyxDQUZXLEVBR1gsS0FBQSxDQUFNLE1BQU0sQ0FBQyxJQUFQLEdBQWMsTUFBZCxHQUF1QixNQUFNLENBQUMsSUFBUCxHQUFjLE9BQTNDLENBSFcsRUFJWCxNQUFNLENBQUMsS0FBUCxHQUFlLE1BQWYsR0FBd0IsTUFBTSxDQUFDLEtBQVAsR0FBZSxPQUo1QjthQU9iO0lBYlM7Ozs7O0FBclViIiwic291cmNlc0NvbnRlbnQiOlsiW1xuICBDb2xvciwgQ29sb3JQYXJzZXIsIENvbG9yRXhwcmVzc2lvbiwgU1ZHQ29sb3JzLCBCbGVuZE1vZGVzLFxuICBpbnQsIGZsb2F0LCBwZXJjZW50LCBvcHRpb25hbFBlcmNlbnQsIGludE9yUGVyY2VudCwgZmxvYXRPclBlcmNlbnQsIGNvbW1hLFxuICBub3RRdW90ZSwgaGV4YWRlY2ltYWwsIHBzLCBwZSwgdmFyaWFibGVzLCBuYW1lUHJlZml4ZXMsXG4gIHNwbGl0LCBjbGFtcCwgY2xhbXBJbnQsIHNjb3BlRnJvbUZpbGVOYW1lXG5dID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cbiAgICB1bmxlc3MgQ29sb3I/XG4gICAgICBDb2xvciA9IHJlcXVpcmUgJy4vY29sb3InXG4gICAgICBTVkdDb2xvcnMgPSByZXF1aXJlICcuL3N2Zy1jb2xvcnMnXG4gICAgICBCbGVuZE1vZGVzID0gcmVxdWlyZSAnLi9ibGVuZC1tb2RlcydcbiAgICAgIENvbG9yRXhwcmVzc2lvbiA/PSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb24nXG5cbiAgICAgIHtcbiAgICAgICAgaW50LCBmbG9hdCwgcGVyY2VudCwgb3B0aW9uYWxQZXJjZW50LCBpbnRPclBlcmNlbnQsIGZsb2F0T3JQZXJjZW50XG4gICAgICAgIGNvbW1hLCBub3RRdW90ZSwgaGV4YWRlY2ltYWwsIHBzLCBwZSwgdmFyaWFibGVzLCBuYW1lUHJlZml4ZXNcbiAgICAgIH0gPSByZXF1aXJlICcuL3JlZ2V4ZXMnXG5cbiAgICAgIENvbG9yQ29udGV4dDo6U1ZHQ29sb3JzID0gU1ZHQ29sb3JzXG4gICAgICBDb2xvckNvbnRleHQ6OkNvbG9yID0gQ29sb3JcbiAgICAgIENvbG9yQ29udGV4dDo6QmxlbmRNb2RlcyA9IEJsZW5kTW9kZXNcbiAgICAgIENvbG9yQ29udGV4dDo6aW50ID0gaW50XG4gICAgICBDb2xvckNvbnRleHQ6OmZsb2F0ID0gZmxvYXRcbiAgICAgIENvbG9yQ29udGV4dDo6cGVyY2VudCA9IHBlcmNlbnRcbiAgICAgIENvbG9yQ29udGV4dDo6b3B0aW9uYWxQZXJjZW50ID0gb3B0aW9uYWxQZXJjZW50XG4gICAgICBDb2xvckNvbnRleHQ6OmludE9yUGVyY2VudCA9IGludE9yUGVyY2VudFxuICAgICAgQ29sb3JDb250ZXh0OjpmbG9hdE9yUGVyY2VudCA9IGZsb2F0T3JQZXJjZW50XG4gICAgICBDb2xvckNvbnRleHQ6OmNvbW1hID0gY29tbWFcbiAgICAgIENvbG9yQ29udGV4dDo6bm90UXVvdGUgPSBub3RRdW90ZVxuICAgICAgQ29sb3JDb250ZXh0OjpoZXhhZGVjaW1hbCA9IGhleGFkZWNpbWFsXG4gICAgICBDb2xvckNvbnRleHQ6OnBzID0gcHNcbiAgICAgIENvbG9yQ29udGV4dDo6cGUgPSBwZVxuICAgICAgQ29sb3JDb250ZXh0Ojp2YXJpYWJsZXNSRSA9IHZhcmlhYmxlc1xuICAgICAgQ29sb3JDb250ZXh0OjpuYW1lUHJlZml4ZXMgPSBuYW1lUHJlZml4ZXNcblxuICAgIHt2YXJpYWJsZXMsIGNvbG9yVmFyaWFibGVzLCBAcmVmZXJlbmNlVmFyaWFibGUsIEByZWZlcmVuY2VQYXRoLCBAcm9vdFBhdGhzLCBAcGFyc2VyLCBAY29sb3JWYXJzLCBAdmFycywgQGRlZmF1bHRWYXJzLCBAZGVmYXVsdENvbG9yVmFycywgc29ydGVkLCBAcmVnaXN0cnksIEBzYXNzU2NvcGVTdWZmaXh9ID0gb3B0aW9uc1xuXG4gICAgdmFyaWFibGVzID89IFtdXG4gICAgY29sb3JWYXJpYWJsZXMgPz0gW11cbiAgICBAcm9vdFBhdGhzID89IFtdXG4gICAgQHJlZmVyZW5jZVBhdGggPz0gQHJlZmVyZW5jZVZhcmlhYmxlLnBhdGggaWYgQHJlZmVyZW5jZVZhcmlhYmxlP1xuXG4gICAgaWYgQHNvcnRlZFxuICAgICAgQHZhcmlhYmxlcyA9IHZhcmlhYmxlc1xuICAgICAgQGNvbG9yVmFyaWFibGVzID0gY29sb3JWYXJpYWJsZXNcbiAgICBlbHNlXG4gICAgICBAdmFyaWFibGVzID0gdmFyaWFibGVzLnNsaWNlKCkuc29ydChAc29ydFBhdGhzKVxuICAgICAgQGNvbG9yVmFyaWFibGVzID0gY29sb3JWYXJpYWJsZXMuc2xpY2UoKS5zb3J0KEBzb3J0UGF0aHMpXG5cbiAgICB1bmxlc3MgQHZhcnM/XG4gICAgICBAdmFycyA9IHt9XG4gICAgICBAY29sb3JWYXJzID0ge31cbiAgICAgIEBkZWZhdWx0VmFycyA9IHt9XG4gICAgICBAZGVmYXVsdENvbG9yVmFycyA9IHt9XG5cbiAgICAgIGZvciB2IGluIEB2YXJpYWJsZXNcbiAgICAgICAgQHZhcnNbdi5uYW1lXSA9IHYgdW5sZXNzIHYuZGVmYXVsdFxuICAgICAgICBAZGVmYXVsdFZhcnNbdi5uYW1lXSA9IHYgaWYgdi5kZWZhdWx0XG5cbiAgICAgIGZvciB2IGluIEBjb2xvclZhcmlhYmxlc1xuICAgICAgICBAY29sb3JWYXJzW3YubmFtZV0gPSB2IHVubGVzcyB2LmRlZmF1bHRcbiAgICAgICAgQGRlZmF1bHRDb2xvclZhcnNbdi5uYW1lXSA9IHYgaWYgdi5kZWZhdWx0XG5cbiAgICBpZiBub3QgQHJlZ2lzdHJ5LmdldEV4cHJlc3Npb24oJ3BpZ21lbnRzOnZhcmlhYmxlcycpPyBhbmQgQGNvbG9yVmFyaWFibGVzLmxlbmd0aCA+IDBcbiAgICAgIGV4cHIgPSBDb2xvckV4cHJlc3Npb24uY29sb3JFeHByZXNzaW9uRm9yQ29sb3JWYXJpYWJsZXMoQGNvbG9yVmFyaWFibGVzKVxuICAgICAgQHJlZ2lzdHJ5LmFkZEV4cHJlc3Npb24oZXhwcilcblxuICAgIHVubGVzcyBAcGFyc2VyP1xuICAgICAgQ29sb3JQYXJzZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1wYXJzZXInXG4gICAgICBAcGFyc2VyID0gbmV3IENvbG9yUGFyc2VyKEByZWdpc3RyeSwgdGhpcylcblxuICAgIEB1c2VkVmFyaWFibGVzID0gW11cbiAgICBAcmVzb2x2ZWRWYXJpYWJsZXMgPSBbXVxuXG4gIHNvcnRQYXRoczogKGEsYikgPT5cbiAgICBpZiBAcmVmZXJlbmNlUGF0aD9cbiAgICAgIHJldHVybiAwIGlmIGEucGF0aCBpcyBiLnBhdGhcbiAgICAgIHJldHVybiAxIGlmIGEucGF0aCBpcyBAcmVmZXJlbmNlUGF0aFxuICAgICAgcmV0dXJuIC0xIGlmIGIucGF0aCBpcyBAcmVmZXJlbmNlUGF0aFxuXG4gICAgICByb290UmVmZXJlbmNlID0gQHJvb3RQYXRoRm9yUGF0aChAcmVmZXJlbmNlUGF0aClcbiAgICAgIHJvb3RBID0gQHJvb3RQYXRoRm9yUGF0aChhLnBhdGgpXG4gICAgICByb290QiA9IEByb290UGF0aEZvclBhdGgoYi5wYXRoKVxuXG4gICAgICByZXR1cm4gMCBpZiByb290QSBpcyByb290QlxuICAgICAgcmV0dXJuIDEgaWYgcm9vdEEgaXMgcm9vdFJlZmVyZW5jZVxuICAgICAgcmV0dXJuIC0xIGlmIHJvb3RCIGlzIHJvb3RSZWZlcmVuY2VcblxuICAgICAgMFxuICAgIGVsc2VcbiAgICAgIDBcblxuICByb290UGF0aEZvclBhdGg6IChwYXRoKSAtPlxuICAgIHJldHVybiByb290IGZvciByb290IGluIEByb290UGF0aHMgd2hlbiBwYXRoLmluZGV4T2YoXCIje3Jvb3R9L1wiKSBpcyAwXG5cbiAgY2xvbmU6IC0+XG4gICAgbmV3IENvbG9yQ29udGV4dCh7XG4gICAgICBAdmFyaWFibGVzXG4gICAgICBAY29sb3JWYXJpYWJsZXNcbiAgICAgIEByZWZlcmVuY2VWYXJpYWJsZVxuICAgICAgQHBhcnNlclxuICAgICAgQHZhcnNcbiAgICAgIEBjb2xvclZhcnNcbiAgICAgIEBkZWZhdWx0VmFyc1xuICAgICAgQGRlZmF1bHRDb2xvclZhcnNcbiAgICAgIHNvcnRlZDogdHJ1ZVxuICAgIH0pXG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICAjIyAgICMjICAjIyMjIyMjIyMgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBjb250YWluc1ZhcmlhYmxlOiAodmFyaWFibGVOYW1lKSAtPiB2YXJpYWJsZU5hbWUgaW4gQGdldFZhcmlhYmxlc05hbWVzKClcblxuICBoYXNDb2xvclZhcmlhYmxlczogLT4gQGNvbG9yVmFyaWFibGVzLmxlbmd0aCA+IDBcblxuICBnZXRWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXNcblxuICBnZXRDb2xvclZhcmlhYmxlczogLT4gQGNvbG9yVmFyaWFibGVzXG5cbiAgZ2V0VmFyaWFibGVzTmFtZXM6IC0+IEB2YXJOYW1lcyA/PSBPYmplY3Qua2V5cyhAdmFycylcblxuICBnZXRWYXJpYWJsZXNDb3VudDogLT4gQHZhckNvdW50ID89IEBnZXRWYXJpYWJsZXNOYW1lcygpLmxlbmd0aFxuXG4gIHJlYWRVc2VkVmFyaWFibGVzOiAtPlxuICAgIHVzZWRWYXJpYWJsZXMgPSBbXVxuICAgIHVzZWRWYXJpYWJsZXMucHVzaCB2IGZvciB2IGluIEB1c2VkVmFyaWFibGVzIHdoZW4gdiBub3QgaW4gdXNlZFZhcmlhYmxlc1xuICAgIEB1c2VkVmFyaWFibGVzID0gW11cbiAgICBAcmVzb2x2ZWRWYXJpYWJsZXMgPSBbXVxuICAgIHVzZWRWYXJpYWJsZXNcblxuICAjIyAgICAjIyAgICAgIyMgICAgIyMjICAgICMjICAgICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAgICMjICMjICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAgIyMgICAjIyAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjIyMjIyAgICAjIyMjIyNcbiAgIyMgICAgICMjICAgIyMgICMjIyMjIyMjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgICAgICAgIyNcbiAgIyMgICAgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyNcbiAgIyMgICAgICAgIyMjICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjI1xuXG4gIGdldFZhbHVlOiAodmFsdWUpIC0+XG4gICAgW3JlYWxWYWx1ZSwgbGFzdFJlYWxWYWx1ZV0gPSBbXVxuICAgIGxvb2tlZFVwVmFsdWVzID0gW3ZhbHVlXVxuXG4gICAgd2hpbGUgKHJlYWxWYWx1ZSA9IEB2YXJzW3ZhbHVlXT8udmFsdWUpIGFuZCByZWFsVmFsdWUgbm90IGluIGxvb2tlZFVwVmFsdWVzXG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgdmFsdWUgPSBsYXN0UmVhbFZhbHVlID0gcmVhbFZhbHVlXG4gICAgICBsb29rZWRVcFZhbHVlcy5wdXNoKHJlYWxWYWx1ZSlcblxuICAgIGlmIHJlYWxWYWx1ZSBpbiBsb29rZWRVcFZhbHVlcyB0aGVuIHVuZGVmaW5lZCBlbHNlIGxhc3RSZWFsVmFsdWVcblxuICByZWFkQ29sb3JFeHByZXNzaW9uOiAodmFsdWUpIC0+XG4gICAgaWYgQGNvbG9yVmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgQGNvbG9yVmFyc1t2YWx1ZV0udmFsdWVcbiAgICBlbHNlIGlmIEBkZWZhdWx0Q29sb3JWYXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2godmFsdWUpXG4gICAgICBAZGVmYXVsdENvbG9yVmFyc1t2YWx1ZV0udmFsdWVcbiAgICBlbHNlXG4gICAgICB2YWx1ZVxuXG4gIHJlYWRDb2xvcjogKHZhbHVlLCBrZWVwQWxsVmFyaWFibGVzPWZhbHNlKSAtPlxuICAgIHJldHVybiBpZiB2YWx1ZSBpbiBAdXNlZFZhcmlhYmxlcyBhbmQgbm90ICh2YWx1ZSBpbiBAcmVzb2x2ZWRWYXJpYWJsZXMpXG5cbiAgICByZWFsVmFsdWUgPSBAcmVhZENvbG9yRXhwcmVzc2lvbih2YWx1ZSlcblxuICAgIHJldHVybiBpZiBub3QgcmVhbFZhbHVlPyBvciByZWFsVmFsdWUgaW4gQHVzZWRWYXJpYWJsZXNcblxuICAgIHNjb3BlID0gaWYgQGNvbG9yVmFyc1t2YWx1ZV0/XG4gICAgICBAc2NvcGVGcm9tRmlsZU5hbWUoQGNvbG9yVmFyc1t2YWx1ZV0ucGF0aClcbiAgICBlbHNlXG4gICAgICAnKidcblxuICAgIEB1c2VkVmFyaWFibGVzID0gQHVzZWRWYXJpYWJsZXMuZmlsdGVyICh2KSAtPiB2IGlzbnQgcmVhbFZhbHVlXG4gICAgcmVzdWx0ID0gQHBhcnNlci5wYXJzZShyZWFsVmFsdWUsIHNjb3BlLCBmYWxzZSlcblxuICAgIGlmIHJlc3VsdD9cbiAgICAgIGlmIHJlc3VsdC5pbnZhbGlkIGFuZCBAZGVmYXVsdENvbG9yVmFyc1tyZWFsVmFsdWVdP1xuICAgICAgICByZXN1bHQgPSBAcmVhZENvbG9yKEBkZWZhdWx0Q29sb3JWYXJzW3JlYWxWYWx1ZV0udmFsdWUpXG4gICAgICAgIHZhbHVlID0gcmVhbFZhbHVlXG5cbiAgICBlbHNlIGlmIEBkZWZhdWx0Q29sb3JWYXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2godmFsdWUpXG4gICAgICByZXN1bHQgPSBAcmVhZENvbG9yKEBkZWZhdWx0Q29sb3JWYXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIGVsc2VcbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2godmFsdWUpIGlmIEB2YXJzW3ZhbHVlXT9cblxuICAgIGlmIHJlc3VsdD9cbiAgICAgIEByZXNvbHZlZFZhcmlhYmxlcy5wdXNoKHZhbHVlKVxuICAgICAgaWYga2VlcEFsbFZhcmlhYmxlcyBvciB2YWx1ZSBub3QgaW4gQHVzZWRWYXJpYWJsZXNcbiAgICAgICAgcmVzdWx0LnZhcmlhYmxlcyA9IChyZXN1bHQudmFyaWFibGVzID8gW10pLmNvbmNhdChAcmVhZFVzZWRWYXJpYWJsZXMoKSlcblxuICAgIHJldHVybiByZXN1bHRcblxuICBzY29wZUZyb21GaWxlTmFtZTogKHBhdGgpIC0+XG4gICAgc2NvcGVGcm9tRmlsZU5hbWUgPz0gcmVxdWlyZSAnLi9zY29wZS1mcm9tLWZpbGUtbmFtZSdcblxuICAgIHNjb3BlID0gc2NvcGVGcm9tRmlsZU5hbWUocGF0aClcblxuICAgIGlmIHNjb3BlIGlzICdzYXNzJyBvciBzY29wZSBpcyAnc2NzcydcbiAgICAgIHNjb3BlID0gW3Njb3BlLCBAc2Fzc1Njb3BlU3VmZml4XS5qb2luKCc6JylcblxuICAgIHNjb3BlXG5cbiAgcmVhZEZsb2F0OiAodmFsdWUpIC0+XG4gICAgcmVzID0gcGFyc2VGbG9hdCh2YWx1ZSlcblxuICAgIGlmIGlzTmFOKHJlcykgYW5kIEB2YXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2ggdmFsdWVcbiAgICAgIHJlcyA9IEByZWFkRmxvYXQoQHZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgaWYgaXNOYU4ocmVzKSBhbmQgQGRlZmF1bHRWYXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2ggdmFsdWVcbiAgICAgIHJlcyA9IEByZWFkRmxvYXQoQGRlZmF1bHRWYXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIHJlc1xuXG4gIHJlYWRJbnQ6ICh2YWx1ZSwgYmFzZT0xMCkgLT5cbiAgICByZXMgPSBwYXJzZUludCh2YWx1ZSwgYmFzZSlcblxuICAgIGlmIGlzTmFOKHJlcykgYW5kIEB2YXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2ggdmFsdWVcbiAgICAgIHJlcyA9IEByZWFkSW50KEB2YXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIGlmIGlzTmFOKHJlcykgYW5kIEBkZWZhdWx0VmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICByZXMgPSBAcmVhZEludChAZGVmYXVsdFZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgcmVzXG5cbiAgcmVhZFBlcmNlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBub3QgL1xcZCsvLnRlc3QodmFsdWUpIGFuZCBAdmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICB2YWx1ZSA9IEByZWFkUGVyY2VudChAdmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICBpZiBub3QgL1xcZCsvLnRlc3QodmFsdWUpIGFuZCBAZGVmYXVsdFZhcnNbdmFsdWVdP1xuICAgICAgQHVzZWRWYXJpYWJsZXMucHVzaCB2YWx1ZVxuICAgICAgdmFsdWUgPSBAcmVhZFBlcmNlbnQoQGRlZmF1bHRWYXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIE1hdGgucm91bmQocGFyc2VGbG9hdCh2YWx1ZSkgKiAyLjU1KVxuXG4gIHJlYWRJbnRPclBlcmNlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBub3QgL1xcZCsvLnRlc3QodmFsdWUpIGFuZCBAdmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICB2YWx1ZSA9IEByZWFkSW50T3JQZXJjZW50KEB2YXJzW3ZhbHVlXS52YWx1ZSlcblxuICAgIGlmIG5vdCAvXFxkKy8udGVzdCh2YWx1ZSkgYW5kIEBkZWZhdWx0VmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICB2YWx1ZSA9IEByZWFkSW50T3JQZXJjZW50KEBkZWZhdWx0VmFyc1t2YWx1ZV0udmFsdWUpXG5cbiAgICByZXR1cm4gTmFOIHVubGVzcyB2YWx1ZT9cbiAgICByZXR1cm4gdmFsdWUgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG5cbiAgICBpZiB2YWx1ZS5pbmRleE9mKCclJykgaXNudCAtMVxuICAgICAgcmVzID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KHZhbHVlKSAqIDIuNTUpXG4gICAgZWxzZVxuICAgICAgcmVzID0gcGFyc2VJbnQodmFsdWUpXG5cbiAgICByZXNcblxuICByZWFkRmxvYXRPclBlcmNlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBub3QgL1xcZCsvLnRlc3QodmFsdWUpIGFuZCBAdmFyc1t2YWx1ZV0/XG4gICAgICBAdXNlZFZhcmlhYmxlcy5wdXNoIHZhbHVlXG4gICAgICB2YWx1ZSA9IEByZWFkRmxvYXRPclBlcmNlbnQoQHZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgaWYgbm90IC9cXGQrLy50ZXN0KHZhbHVlKSBhbmQgQGRlZmF1bHRWYXJzW3ZhbHVlXT9cbiAgICAgIEB1c2VkVmFyaWFibGVzLnB1c2ggdmFsdWVcbiAgICAgIHZhbHVlID0gQHJlYWRGbG9hdE9yUGVyY2VudChAZGVmYXVsdFZhcnNbdmFsdWVdLnZhbHVlKVxuXG4gICAgcmV0dXJuIE5hTiB1bmxlc3MgdmFsdWU/XG4gICAgcmV0dXJuIHZhbHVlIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuXG4gICAgaWYgdmFsdWUuaW5kZXhPZignJScpIGlzbnQgLTFcbiAgICAgIHJlcyA9IHBhcnNlRmxvYXQodmFsdWUpIC8gMTAwXG4gICAgZWxzZVxuICAgICAgcmVzID0gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgICAgIHJlcyA9IHJlcyAvIDEwMCBpZiByZXMgPiAxXG4gICAgICByZXNcblxuICAgIHJlc1xuXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjICMjICAgICAgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjICAgICAjIyAgIyMgICAgICAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjICAgICAjIyAgIyMgICAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAgICMjICAgICAjIyAgIyMgICAgICAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAgIyMgICAgICMjICAjIyAgICAgICAgICAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICAgIyMgICAgICMjICAjIyAgICAgICAjIyAgICAjI1xuICAjIyAgICAgIyMjIyMjIyAgICAgIyMgICAgIyMjIyAjIyMjIyMjIyAgIyMjIyMjXG5cbiAgc3BsaXQ6ICh2YWx1ZSkgLT5cbiAgICB7c3BsaXQsIGNsYW1wLCBjbGFtcEludH0gPSByZXF1aXJlICcuL3V0aWxzJyB1bmxlc3Mgc3BsaXQ/XG4gICAgc3BsaXQodmFsdWUpXG5cbiAgY2xhbXA6ICh2YWx1ZSkgLT5cbiAgICB7c3BsaXQsIGNsYW1wLCBjbGFtcEludH0gPSByZXF1aXJlICcuL3V0aWxzJyB1bmxlc3MgY2xhbXA/XG4gICAgY2xhbXAodmFsdWUpXG5cbiAgY2xhbXBJbnQ6ICh2YWx1ZSkgLT5cbiAgICB7c3BsaXQsIGNsYW1wLCBjbGFtcEludH0gPSByZXF1aXJlICcuL3V0aWxzJyB1bmxlc3MgY2xhbXBJbnQ/XG4gICAgY2xhbXBJbnQodmFsdWUpXG5cbiAgaXNJbnZhbGlkOiAoY29sb3IpIC0+IG5vdCBDb2xvci5pc1ZhbGlkKGNvbG9yKVxuXG4gIHJlYWRQYXJhbTogKHBhcmFtLCBibG9jaykgLT5cbiAgICByZSA9IC8vL1xcJChcXHcrKTpcXHMqKCgtPyN7QGZsb2F0fSl8I3tAdmFyaWFibGVzUkV9KS8vL1xuICAgIGlmIHJlLnRlc3QocGFyYW0pXG4gICAgICBbXywgbmFtZSwgdmFsdWVdID0gcmUuZXhlYyhwYXJhbSlcblxuICAgICAgYmxvY2sobmFtZSwgdmFsdWUpXG5cbiAgY29udHJhc3Q6IChiYXNlLCBkYXJrPW5ldyBDb2xvcignYmxhY2snKSwgbGlnaHQ9bmV3IENvbG9yKCd3aGl0ZScpLCB0aHJlc2hvbGQ9MC40MykgLT5cbiAgICBbbGlnaHQsIGRhcmtdID0gW2RhcmssIGxpZ2h0XSBpZiBkYXJrLmx1bWEgPiBsaWdodC5sdW1hXG5cbiAgICBpZiBiYXNlLmx1bWEgPiB0aHJlc2hvbGRcbiAgICAgIGRhcmtcbiAgICBlbHNlXG4gICAgICBsaWdodFxuXG4gIG1peENvbG9yczogKGNvbG9yMSwgY29sb3IyLCBhbW91bnQ9MC41LCByb3VuZD1NYXRoLmZsb29yKSAtPlxuICAgIHJldHVybiBuZXcgQ29sb3IoTmFOLCBOYU4sIE5hTiwgTmFOKSB1bmxlc3MgY29sb3IxPyBhbmQgY29sb3IyPyBhbmQgbm90IGlzTmFOKGFtb3VudClcblxuICAgIGludmVyc2UgPSAxIC0gYW1vdW50XG4gICAgY29sb3IgPSBuZXcgQ29sb3JcblxuICAgIGNvbG9yLnJnYmEgPSBbXG4gICAgICByb3VuZChjb2xvcjEucmVkICogYW1vdW50ICsgY29sb3IyLnJlZCAqIGludmVyc2UpXG4gICAgICByb3VuZChjb2xvcjEuZ3JlZW4gKiBhbW91bnQgKyBjb2xvcjIuZ3JlZW4gKiBpbnZlcnNlKVxuICAgICAgcm91bmQoY29sb3IxLmJsdWUgKiBhbW91bnQgKyBjb2xvcjIuYmx1ZSAqIGludmVyc2UpXG4gICAgICBjb2xvcjEuYWxwaGEgKiBhbW91bnQgKyBjb2xvcjIuYWxwaGEgKiBpbnZlcnNlXG4gICAgXVxuXG4gICAgY29sb3JcblxuICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyMjICMjICAgICAjIyAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyMgICMjICAgICAgICAjIyAgICMjICAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICAjIyAgICAgICAgICMjICMjICAgIyMgICAgICMjXG4gICMjICAgICMjIyMjIyMjICAjIyMjIyMgICAjIyAgICMjIyMgIyMjIyMjICAgICAgIyMjICAgICMjIyMjIyMjXG4gICMjICAgICMjICAgIyMgICAjIyAgICAgICAjIyAgICAjIyAgIyMgICAgICAgICAjIyAjIyAgICMjXG4gICMjICAgICMjICAgICMjICAjIyAgICAgICAjIyAgICAjIyAgIyMgICAgICAgICMjICAgIyMgICMjXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjICAgIyMjIyMjIyMgIyMgICAgICMjICMjXG4iXX0=

(function() {
  var ColorExpression, ExpressionsRegistry, SVGColors, colorRegexp, colors, comma, elmAngle, float, floatOrPercent, hexadecimal, insensitive, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, ref, ref1, registry, strip, variables;

  ref = require('./regexes'), int = ref.int, float = ref.float, percent = ref.percent, optionalPercent = ref.optionalPercent, intOrPercent = ref.intOrPercent, floatOrPercent = ref.floatOrPercent, comma = ref.comma, notQuote = ref.notQuote, hexadecimal = ref.hexadecimal, ps = ref.ps, pe = ref.pe, variables = ref.variables, namePrefixes = ref.namePrefixes;

  ref1 = require('./utils'), strip = ref1.strip, insensitive = ref1.insensitive;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  module.exports = registry = new ExpressionsRegistry(ColorExpression);

  registry.createExpression('pigments:css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", 1, ['css', 'less', 'styl', 'stylus', 'sass', 'scss'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexRGBA = hexa;
  });

  registry.createExpression('pigments:argb_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_hexa_4', "(?:" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, colorAsInt, hexa;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 12 & 0xf) * 17;
    this.green = (colorAsInt >> 8 & 0xf) * 17;
    this.blue = (colorAsInt >> 4 & 0xf) * 17;
    return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
  });

  registry.createExpression('pigments:css_hexa_3', "(?:" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, colorAsInt, hexa;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 8 & 0xf) * 17;
    this.green = (colorAsInt >> 4 & 0xf) * 17;
    return this.blue = (colorAsInt & 0xf) * 17;
  });

  registry.createExpression('pigments:int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_rgb', strip("" + (insensitive('rgb')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_rgba', strip("" + (insensitive('rgba')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, baseColor, subexpr;
    _ = match[0], subexpr = match[1], a = match[2];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:css_hsl', strip("" + (insensitive('hsl')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['css', 'sass', 'scss', 'styl', 'stylus'], function(match, expression, context) {
    var _, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:less_hsl', strip("hsl" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['less'], function(match, expression, context) {
    var _, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloatOrPercent(s) * 100, context.readFloatOrPercent(l) * 100];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_hsla', strip("" + (insensitive('hsla')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hsv', strip("(?:" + (insensitive('hsv')) + "|" + (insensitive('hsb')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, h, hsv, s, v;
    _ = match[0], h = match[1], s = match[2], v = match[3];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hsva', strip("(?:" + (insensitive('hsva')) + "|" + (insensitive('hsba')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, hsv, s, v;
    _ = match[0], h = match[1], s = match[2], v = match[3], a = match[4];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hcg', strip("(?:" + (insensitive('hcg')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, c, gr, h, hcg;
    _ = match[0], h = match[1], c = match[2], gr = match[3];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hcga', strip("(?:" + (insensitive('hcga')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, c, gr, h, hcg;
    _ = match[0], h = match[1], c = match[2], gr = match[3], a = match[4];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
  });

  registry.createExpression('pigments:hwb', strip("" + (insensitive('hwb')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), ['*'], function(match, expression, context) {
    var _, a, b, h, w;
    _ = match[0], h = match[1], w = match[2], b = match[3], a = match[4];
    this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  registry.createExpression('pigments:cmyk', strip("" + (insensitive('cmyk')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, c, k, m, y;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    return this.cmyk = [context.readFloat(c), context.readFloat(m), context.readFloat(y), context.readFloat(k)];
  });

  registry.createExpression('pigments:gray', strip("" + (insensitive('gray')) + ps + "\\s* (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), 1, ['*'], function(match, expression, context) {
    var _, a, p;
    _ = match[0], p = match[1], a = match[2];
    p = context.readFloat(p) / 100 * 255;
    this.rgb = [p, p, p];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  colors = Object.keys(SVGColors.allCases);

  colorRegexp = "(?:" + namePrefixes + ")(" + (colors.join('|')) + ")\\b(?![ \\t]*[-\\.:=\\(])";

  registry.createExpression('pigments:named_colors', colorRegexp, [], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    this.colorExpression = this.name = name;
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, s, context.clampInt(l - amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, s, context.clampInt(l + amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:fade', strip("(?:fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = amount;
  });

  registry.createExpression('pigments:transparentize', strip("(?:transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha - amount);
  });

  registry.createExpression('pigments:opacify', strip("(?:opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha + amount);
  });

  registry.createExpression('pigments:stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, channel, subexpr;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    return this[channel] = amount;
  });

  registry.createExpression('pigments:transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var _, alpha, bestAlpha, bottom, expr, processChannel, ref2, top;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), top = ref2[0], bottom = ref2[1], alpha = ref2[2];
    top = context.readColor(top);
    bottom = context.readColor(bottom);
    alpha = context.readFloatOrPercent(alpha);
    if (context.isInvalid(top)) {
      return this.invalid = true;
    }
    if ((bottom != null) && context.isInvalid(bottom)) {
      return this.invalid = true;
    }
    if (bottom == null) {
      bottom = new context.Color(255, 255, 255, 1);
    }
    if (isNaN(alpha)) {
      alpha = void 0;
    }
    bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
      var res;
      res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
      return res;
    }).sort(function(a, b) {
      return a < b;
    })[0];
    processChannel = function(channel) {
      if (bestAlpha === 0) {
        return bottom[channel];
      } else {
        return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
      }
    };
    if (alpha != null) {
      bestAlpha = alpha;
    }
    bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
    this.red = processChannel('red');
    this.green = processChannel('green');
    this.blue = processChannel('blue');
    return this.alpha = Math.round(bestAlpha * 100) / 100;
  });

  registry.createExpression('pigments:hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [amount % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, channel, subexpr;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    baseColor[channel] = amount;
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + amount) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:mix', "mix" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, amount, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1], amount = ref2[2];
    if (amount != null) {
      amount = context.readFloatOrPercent(amount);
    } else {
      amount = 0.5;
    }
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = context.mixColors(baseColor1, baseColor2, amount), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:stylus_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:stylus_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:compass_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(baseColor, white, amount).rgba;
  });

  registry.createExpression('pigments:compass_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(baseColor, black, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, context.clampInt(s - amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, context.clampInt(s + amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:grayscale', "gr(?:a|e)yscale" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, 0, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:invert', "invert" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, b, baseColor, g, r, ref2, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.rgb, r = ref2[0], g = ref2[1], b = ref2[2];
    this.rgb = [255 - r, 255 - g, 255 - b];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:complement', "complement" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, angle, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], angle = match[2];
    baseColor = context.readColor(subexpr);
    angle = context.readInt(angle);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(360 + h + angle) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, base, baseColor, dark, expr, light, ref2, ref3, res, threshold;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), base = ref2[0], dark = ref2[1], light = ref2[2], threshold = ref2[3];
    baseColor = context.readColor(base);
    dark = context.readColor(dark);
    light = context.readColor(light);
    if (threshold != null) {
      threshold = context.readPercent(threshold);
    }
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (dark != null ? dark.invalid : void 0) {
      return this.invalid = true;
    }
    if (light != null ? light.invalid : void 0) {
      return this.invalid = true;
    }
    res = context.contrast(baseColor, dark, light);
    if (context.isInvalid(res)) {
      return this.invalid = true;
    }
    return ref3 = context.contrast(baseColor, dark, light, threshold), this.rgb = ref3.rgb, ref3;
  });

  registry.createExpression('pigments:contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var _, baseColor, ref2, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    return ref2 = context.contrast(baseColor), this.rgb = ref2.rgb, ref2;
  });

  registry.createExpression('pigments:css_color_function', "(?:" + namePrefixes + ")(" + (insensitive('color')) + ps + "(" + notQuote + ")" + pe + ")", ['css'], function(match, expression, context) {
    var _, cssColor, e, expr, k, ref2, rgba, v;
    try {
      _ = match[0], expr = match[1];
      ref2 = context.vars;
      for (k in ref2) {
        v = ref2[k];
        expr = expr.replace(RegExp("" + (k.replace(/\(/g, '\\(').replace(/\)/g, '\\)')), "g"), v.value);
      }
      cssColor = require('css-color-function');
      rgba = cssColor.convert(expr.toLowerCase());
      this.rgba = context.readColor(rgba).rgba;
      return this.colorExpression = expr;
    } catch (error) {
      e = error;
      return this.invalid = true;
    }
  });

  registry.createExpression('pigments:sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var _, baseColor, i, len, param, params, res, subexpr, subject;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        return baseColor[name] += context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var MAX_PER_COMPONENT, _, baseColor, i, len, param, params, res, subexpr, subject;
    MAX_PER_COMPONENT = {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
      hue: 360,
      saturation: 100,
      lightness: 100
    };
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        var dif, result;
        value = context.readFloat(value) / 100;
        result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
        return baseColor[name] = result;
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var _, baseColor, i, len, param, params, res, subexpr, subject;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        return baseColor[name] = context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
  });

  registry.createExpression('pigments:lua_rgba', strip("(?:" + namePrefixes + ")Color" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['lua'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readInt(a) / 255;
  });

  registry.createExpression('pigments:multiply', strip("multiply" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.MULTIPLY), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:screen', strip("screen" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.SCREEN), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:overlay', strip("overlay" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.OVERLAY), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:softlight', strip("softlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.SOFT_LIGHT), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:hardlight', strip("hardlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.HARD_LIGHT), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:difference', strip("difference" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.DIFFERENCE), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:exclusion', strip("exclusion" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.EXCLUSION), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:average', strip("average" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.AVERAGE), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:negation', strip("negation" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.NEGATION), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:elm_rgba', strip("rgba\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_rgb', strip("rgb\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    return this.blue = context.readInt(b);
  });

  elmAngle = "(?:" + float + "|\\(degrees\\s+(?:" + int + "|" + variables + ")\\))";

  registry.createExpression('pigments:elm_hsl', strip("hsl\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, elmDegreesRegexp, h, hsl, l, m, s;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:elm_hsla', strip("hsla\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, a, elmDegreesRegexp, h, hsl, l, m, s;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_grayscale', "gr(?:a|e)yscale\\s+(" + float + "|" + variables + ")", ['elm'], function(match, expression, context) {
    var _, amount;
    _ = match[0], amount = match[1];
    amount = Math.floor(255 - context.readFloat(amount) * 255);
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:elm_complement', strip("complement\\s+(" + notQuote + ")"), ['elm'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:latex_gray', strip("\\[gray\\]\\{(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, amount;
    _ = match[0], amount = match[1];
    amount = context.readFloat(amount) * 255;
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:latex_html', strip("\\[HTML\\]\\{(" + hexadecimal + "{6})\\}"), ['tex'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:latex_rgb', strip("\\[rgb\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = Math.floor(context.readFloat(r) * 255);
    g = Math.floor(context.readFloat(g) * 255);
    b = Math.floor(context.readFloat(b) * 255);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_RGB', strip("\\[RGB\\]\\{(" + int + ")" + comma + "(" + int + ")" + comma + "(" + int + ")\\}"), ['tex'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = context.readInt(r);
    g = context.readInt(g);
    b = context.readInt(b);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_cmyk', strip("\\[cmyk\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, c, k, m, y;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    c = context.readFloat(c);
    m = context.readFloat(m);
    y = context.readFloat(y);
    k = context.readFloat(k);
    return this.cmyk = [c, m, y, k];
  });

  registry.createExpression('pigments:latex_predefined', strip('\\{(black|blue|brown|cyan|darkgray|gray|green|lightgray|lime|magenta|olive|orange|pink|purple|red|teal|violet|white|yellow)\\}'), ['tex'], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_predefined_dvipnames', strip('\\{(Apricot|Aquamarine|Bittersweet|Black|Blue|BlueGreen|BlueViolet|BrickRed|Brown|BurntOrange|CadetBlue|CarnationPink|Cerulean|CornflowerBlue|Cyan|Dandelion|DarkOrchid|Emerald|ForestGreen|Fuchsia|Goldenrod|Gray|Green|GreenYellow|JungleGreen|Lavender|LimeGreen|Magenta|Mahogany|Maroon|Melon|MidnightBlue|Mulberry|NavyBlue|OliveGreen|Orange|OrangeRed|Orchid|Peach|Periwinkle|PineGreen|Plum|ProcessBlue|Purple|RawSienna|Red|RedOrange|RedViolet|Rhodamine|RoyalBlue|RoyalPurple|RubineRed|Salmon|SeaGreen|Sepia|SkyBlue|SpringGreen|Tan|TealBlue|Thistle|Turquoise|Violet|VioletRed|White|WildStrawberry|Yellow|YellowGreen|YellowOrange)\\}'), ['tex'], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    return this.hex = context.DVIPnames[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_mix', strip('\\{([^!\\n\\}]+[!][^\\}\\n]+)\\}'), ['tex'], function(match, expression, context) {
    var _, expr, mix, nextColor, op, triplet;
    _ = match[0], expr = match[1];
    op = expr.split('!');
    mix = function(arg) {
      var a, b, colorA, colorB, p;
      a = arg[0], p = arg[1], b = arg[2];
      colorA = a instanceof context.Color ? a : context.readColor("{" + a + "}");
      colorB = b instanceof context.Color ? b : context.readColor("{" + b + "}");
      percent = context.readInt(p);
      return context.mixColors(colorA, colorB, percent / 100);
    };
    if (op.length === 2) {
      op.push(new context.Color(255, 255, 255));
    }
    nextColor = null;
    while (op.length > 0) {
      triplet = op.splice(0, 3);
      nextColor = mix(triplet);
      if (op.length > 0) {
        op.unshift(nextColor);
      }
    }
    return this.rgb = nextColor.rgb;
  });

  registry.createExpression('pigments:qt_rgba', strip("Qt\\.rgba" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['qml', 'c', 'cc', 'cpp'], 1, function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readFloat(r) * 255;
    this.green = context.readFloat(g) * 255;
    this.blue = context.readFloat(b) * 255;
    return this.alpha = context.readFloat(a);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItZXhwcmVzc2lvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQWNJLE9BQUEsQ0FBUSxXQUFSLENBZEosRUFDRSxhQURGLEVBRUUsaUJBRkYsRUFHRSxxQkFIRixFQUlFLHFDQUpGLEVBS0UsK0JBTEYsRUFNRSxtQ0FORixFQU9FLGlCQVBGLEVBUUUsdUJBUkYsRUFTRSw2QkFURixFQVVFLFdBVkYsRUFXRSxXQVhGLEVBWUUseUJBWkYsRUFhRTs7RUFHRixPQUF1QixPQUFBLENBQVEsU0FBUixDQUF2QixFQUFDLGtCQUFELEVBQVE7O0VBRVIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSOztFQUN0QixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDbEIsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ0EsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0IsZUFBcEI7O0VBV2YsUUFBUSxDQUFDLGdCQUFULENBQTBCLHFCQUExQixFQUFpRCxJQUFBLEdBQUssV0FBTCxHQUFpQixtQkFBbEUsRUFBc0YsQ0FBdEYsRUFBeUYsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQyxNQUFsQyxFQUEwQyxNQUExQyxDQUF6RixFQUE0SSxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLE9BQXBCO0FBQzFJLFFBQUE7SUFBQyxZQUFELEVBQUk7V0FFSixJQUFDLENBQUEsT0FBRCxHQUFXO0VBSCtILENBQTVJOztFQU1BLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixzQkFBMUIsRUFBa0QsSUFBQSxHQUFLLFdBQUwsR0FBaUIsbUJBQW5FLEVBQXVGLENBQUMsR0FBRCxDQUF2RixFQUE4RixTQUFDLEtB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QUFiLEVBQW1CLEtBQW5CLENBVkosRUFVK0IsQ0FWL0IsRUFVa0MsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixPQUFwQjtBQUNoQyxRQUFBO0lBQUMsWUFBRCxFQUFHLFlBQUgsRUFBSyxZQUFMLEVBQU8sWUFBUCxFQUFTO0lBRVQsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUMsU0FBUixDQUFrQixDQUFsQixDQUFBLEdBQXVCO0lBQzlCLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsQ0FBbEIsQ0FBQSxHQUF1QjtJQUNoQyxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQWxCLENBQUEsR0FBdUI7V0FDL0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxPQUFPLENBQUMsU0FBUixDQUFrQixDQUFsQjtFQU51QixDQVZsQztBQXQ2Q0EiLCJzb3VyY2VzQ29udGVudCI6WyJ7XG4gIGludFxuICBmbG9hdFxuICBwZXJjZW50XG4gIG9wdGlvbmFsUGVyY2VudFxuICBpbnRPclBlcmNlbnRcbiAgZmxvYXRPclBlcmNlbnRcbiAgY29tbWFcbiAgbm90UXVvdGVcbiAgaGV4YWRlY2ltYWxcbiAgcHNcbiAgcGVcbiAgdmFyaWFibGVzXG4gIG5hbWVQcmVmaXhlc1xufSA9IHJlcXVpcmUgJy4vcmVnZXhlcydcblxue3N0cmlwLCBpbnNlbnNpdGl2ZX0gPSByZXF1aXJlICcuL3V0aWxzJ1xuXG5FeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9leHByZXNzaW9ucy1yZWdpc3RyeSdcbkNvbG9yRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4vY29sb3ItZXhwcmVzc2lvbidcblNWR0NvbG9ycyA9IHJlcXVpcmUgJy4vc3ZnLWNvbG9ycydcblxubW9kdWxlLmV4cG9ydHMgPVxucmVnaXN0cnkgPSBuZXcgRXhwcmVzc2lvbnNSZWdpc3RyeShDb2xvckV4cHJlc3Npb24pXG5cbiMjICAgICMjICAgICAgICMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgICAgICMjIyAgICAjI1xuIyMgICAgIyMgICAgICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjXG4jIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICAjIyAgIyMgICAjIyAgIyNcbiMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMjIyMjICAgIyMjIyMjIyMgICMjICAgICAjIyAjI1xuIyMgICAgIyMgICAgICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICMjICAgIyMjIyMjIyMjICMjXG4jIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjICAgICAgICMjICAgICMjICAjIyAgICAgIyMgIyNcbiMjICAgICMjIyMjIyMjICMjIyMgICAgIyMgICAgIyMjIyMjIyMgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjI1xuXG4jICM2ZjM0ODllZlxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX2hleGFfOCcsIFwiIygje2hleGFkZWNpbWFsfXs4fSkoPyFbXFxcXGRcXFxcdy1dKVwiLCAxLCBbJ2NzcycsICdsZXNzJywgJ3N0eWwnLCAnc3R5bHVzJywgJ3Nhc3MnLCAnc2NzcyddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBoZXhhXSA9IG1hdGNoXG5cbiAgQGhleFJHQkEgPSBoZXhhXG5cbiMgIzZmMzQ4OWVmXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czphcmdiX2hleGFfOCcsIFwiIygje2hleGFkZWNpbWFsfXs4fSkoPyFbXFxcXGRcXFxcdy1dKVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuXG4gIEBoZXhBUkdCID0gaGV4YVxuXG4jICMzNDg5ZWZcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19oZXhhXzYnLCBcIiMoI3toZXhhZGVjaW1hbH17Nn0pKD8hW1xcXFxkXFxcXHctXSlcIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcblxuICBAaGV4ID0gaGV4YVxuXG4jICM2ZjM0XG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfaGV4YV80JywgXCIoPzoje25hbWVQcmVmaXhlc30pIygje2hleGFkZWNpbWFsfXs0fSkoPyFbXFxcXGRcXFxcdy1dKVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuICBjb2xvckFzSW50ID0gY29udGV4dC5yZWFkSW50KGhleGEsIDE2KVxuXG4gIEBjb2xvckV4cHJlc3Npb24gPSBcIiMje2hleGF9XCJcbiAgQHJlZCA9IChjb2xvckFzSW50ID4+IDEyICYgMHhmKSAqIDE3XG4gIEBncmVlbiA9IChjb2xvckFzSW50ID4+IDggJiAweGYpICogMTdcbiAgQGJsdWUgPSAoY29sb3JBc0ludCA+PiA0ICYgMHhmKSAqIDE3XG4gIEBhbHBoYSA9ICgoY29sb3JBc0ludCAmIDB4ZikgKiAxNykgLyAyNTVcblxuIyAjMzhlXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfaGV4YV8zJywgXCIoPzoje25hbWVQcmVmaXhlc30pIygje2hleGFkZWNpbWFsfXszfSkoPyFbXFxcXGRcXFxcdy1dKVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuICBjb2xvckFzSW50ID0gY29udGV4dC5yZWFkSW50KGhleGEsIDE2KVxuXG4gIEBjb2xvckV4cHJlc3Npb24gPSBcIiMje2hleGF9XCJcbiAgQHJlZCA9IChjb2xvckFzSW50ID4+IDggJiAweGYpICogMTdcbiAgQGdyZWVuID0gKGNvbG9yQXNJbnQgPj4gNCAmIDB4ZikgKiAxN1xuICBAYmx1ZSA9IChjb2xvckFzSW50ICYgMHhmKSAqIDE3XG5cbiMgMHhhYjM0ODllZlxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aW50X2hleGFfOCcsIFwiMHgoI3toZXhhZGVjaW1hbH17OH0pKD8hI3toZXhhZGVjaW1hbH0pXCIsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBoZXhhXSA9IG1hdGNoXG5cbiAgQGhleEFSR0IgPSBoZXhhXG5cbiMgMHgzNDg5ZWZcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmludF9oZXhhXzYnLCBcIjB4KCN7aGV4YWRlY2ltYWx9ezZ9KSg/ISN7aGV4YWRlY2ltYWx9KVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuXG4gIEBoZXggPSBoZXhhXG5cbiMgcmdiKDUwLDEyMCwyMDApXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfcmdiJywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAncmdiJ30je3BzfVxcXFxzKlxuICAgICgje2ludE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18scixnLGJdID0gbWF0Y2hcblxuICBAcmVkID0gY29udGV4dC5yZWFkSW50T3JQZXJjZW50KHIpXG4gIEBncmVlbiA9IGNvbnRleHQucmVhZEludE9yUGVyY2VudChnKVxuICBAYmx1ZSA9IGNvbnRleHQucmVhZEludE9yUGVyY2VudChiKVxuICBAYWxwaGEgPSAxXG5cbiMgcmdiYSg1MCwxMjAsMjAwLDAuNylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19yZ2JhJywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAncmdiYSd9I3twc31cXFxccypcbiAgICAoI3tpbnRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxyLGcsYixhXSA9IG1hdGNoXG5cbiAgQHJlZCA9IGNvbnRleHQucmVhZEludE9yUGVyY2VudChyKVxuICBAZ3JlZW4gPSBjb250ZXh0LnJlYWRJbnRPclBlcmNlbnQoZylcbiAgQGJsdWUgPSBjb250ZXh0LnJlYWRJbnRPclBlcmNlbnQoYilcbiAgQGFscGhhID0gY29udGV4dC5yZWFkRmxvYXQoYSlcblxuIyByZ2JhKGdyZWVuLDAuNylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c19yZ2JhJywgc3RyaXAoXCJcbiAgcmdiYSN7cHN9XFxcXHMqXG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sc3ViZXhwcixhXSA9IG1hdGNoXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBAcmdiID0gYmFzZUNvbG9yLnJnYlxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIGhzbCgyMTAsNTAlLDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19oc2wnLCBzdHJpcChcIlxuICAje2luc2Vuc2l0aXZlICdoc2wnfSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnY3NzJywgJ3Nhc3MnLCAnc2NzcycsICdzdHlsJywgJ3N0eWx1cyddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgscyxsXSA9IG1hdGNoXG5cbiAgaHNsID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KHMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQobClcbiAgXVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaHNsLnNvbWUgKHYpIC0+IG5vdCB2PyBvciBpc05hTih2KVxuXG4gIEBoc2wgPSBoc2xcbiAgQGFscGhhID0gMVxuXG4jIGhzbCgyMTAsNTAlLDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxlc3NfaHNsJywgc3RyaXAoXCJcbiAgaHNsI3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnbGVzcyddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgscyxsXSA9IG1hdGNoXG5cbiAgaHNsID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KHMpICogMTAwXG4gICAgY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQobCkgKiAxMDBcbiAgXVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaHNsLnNvbWUgKHYpIC0+IG5vdCB2PyBvciBpc05hTih2KVxuXG4gIEBoc2wgPSBoc2xcbiAgQGFscGhhID0gMVxuXG4jIGhzbGEoMjEwLDUwJSw1MCUsMC43KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX2hzbGEnLCBzdHJpcChcIlxuICAje2luc2Vuc2l0aXZlICdoc2xhJ30je3BzfVxcXFxzKlxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCxzLGwsYV0gPSBtYXRjaFxuXG4gIGhzbCA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdChzKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGwpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhzbC5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaHNsID0gaHNsXG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0KGEpXG5cbiMgaHN2KDIxMCw3MCUsOTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aHN2Jywgc3RyaXAoXCJcbiAgKD86I3tpbnNlbnNpdGl2ZSAnaHN2J318I3tpbnNlbnNpdGl2ZSAnaHNiJ30pI3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCxzLHZdID0gbWF0Y2hcblxuICBoc3YgPSBbXG4gICAgY29udGV4dC5yZWFkSW50KGgpXG4gICAgY29udGV4dC5yZWFkRmxvYXQocylcbiAgICBjb250ZXh0LnJlYWRGbG9hdCh2KVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoc3Yuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhzdiA9IGhzdlxuICBAYWxwaGEgPSAxXG5cbiMgaHN2YSgyMTAsNzAlLDkwJSwwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpoc3ZhJywgc3RyaXAoXCJcbiAgKD86I3tpbnNlbnNpdGl2ZSAnaHN2YSd9fCN7aW5zZW5zaXRpdmUgJ2hzYmEnfSkje3BzfVxcXFxzKlxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCxzLHYsYV0gPSBtYXRjaFxuXG4gIGhzdiA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdChzKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KHYpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhzdi5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaHN2ID0gaHN2XG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0KGEpXG5cbiMgaGNnKDIxMCw2MCUsNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aGNnJywgc3RyaXAoXCJcbiAgKD86I3tpbnNlbnNpdGl2ZSAnaGNnJ30pI3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCxjLGdyXSA9IG1hdGNoXG5cbiAgaGNnID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQoZ3IpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhjZy5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaGNnID0gaGNnXG4gIEBhbHBoYSA9IDFcblxuIyBoY2dhKDIxMCw2MCUsNTAlLDAuNylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmhjZ2EnLCBzdHJpcChcIlxuICAoPzoje2luc2Vuc2l0aXZlICdoY2dhJ30pI3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgsYyxncixhXSA9IG1hdGNoXG5cbiAgaGNnID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQoZ3IpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhjZy5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaGNnID0gaGNnXG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0KGEpXG5cbiMgdmVjNCgwLjIsIDAuNSwgMC45LCAwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czp2ZWM0Jywgc3RyaXAoXCJcbiAgdmVjNCN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxoLHMsbCxhXSA9IG1hdGNoXG5cbiAgQHJnYmEgPSBbXG4gICAgY29udGV4dC5yZWFkRmxvYXQoaCkgKiAyNTVcbiAgICBjb250ZXh0LnJlYWRGbG9hdChzKSAqIDI1NVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGwpICogMjU1XG4gICAgY29udGV4dC5yZWFkRmxvYXQoYSlcbiAgXVxuXG4jIGh3YigyMTAsNDAlLDQwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmh3YicsIHN0cmlwKFwiXG4gICN7aW5zZW5zaXRpdmUgJ2h3Yid9I3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAoPzoje2NvbW1hfSgje2Zsb2F0fXwje3ZhcmlhYmxlc30pKT9cbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCx3LGIsYV0gPSBtYXRjaFxuXG4gIEBod2IgPSBbXG4gICAgY29udGV4dC5yZWFkSW50KGgpXG4gICAgY29udGV4dC5yZWFkRmxvYXQodylcbiAgICBjb250ZXh0LnJlYWRGbG9hdChiKVxuICBdXG4gIEBhbHBoYSA9IGlmIGE/IHRoZW4gY29udGV4dC5yZWFkRmxvYXQoYSkgZWxzZSAxXG5cbiMgY215aygwLDAuNSwxLDApXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjbXlrJywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAnY215ayd9I3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxjLG0seSxrXSA9IG1hdGNoXG5cbiAgQGNteWsgPSBbXG4gICAgY29udGV4dC5yZWFkRmxvYXQoYylcbiAgICBjb250ZXh0LnJlYWRGbG9hdChtKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KHkpXG4gICAgY29udGV4dC5yZWFkRmxvYXQoaylcbiAgXVxuXG4jIGdyYXkoNTAlKVxuIyBUaGUgcHJpb3JpdHkgaXMgc2V0IHRvIDEgdG8gbWFrZSBzdXJlIHRoYXQgaXQgYXBwZWFycyBiZWZvcmUgbmFtZWQgY29sb3JzXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpncmF5Jywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAnZ3JheSd9I3twc31cXFxccypcbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAoPzoje2NvbW1hfSgje2Zsb2F0fXwje3ZhcmlhYmxlc30pKT9cbiAgI3twZX1cIiksIDEsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG5cbiAgW18scCxhXSA9IG1hdGNoXG5cbiAgcCA9IGNvbnRleHQucmVhZEZsb2F0KHApIC8gMTAwICogMjU1XG4gIEByZ2IgPSBbcCwgcCwgcF1cbiAgQGFscGhhID0gaWYgYT8gdGhlbiBjb250ZXh0LnJlYWRGbG9hdChhKSBlbHNlIDFcblxuIyBkb2RnZXJibHVlXG5jb2xvcnMgPSBPYmplY3Qua2V5cyhTVkdDb2xvcnMuYWxsQ2FzZXMpXG5jb2xvclJlZ2V4cCA9IFwiKD86I3tuYW1lUHJlZml4ZXN9KSgje2NvbG9ycy5qb2luKCd8Jyl9KVxcXFxiKD8hWyBcXFxcdF0qWy1cXFxcLjo9XFxcXChdKVwiXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOm5hbWVkX2NvbG9ycycsIGNvbG9yUmVnZXhwLCBbXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxuYW1lXSA9IG1hdGNoXG5cbiAgQGNvbG9yRXhwcmVzc2lvbiA9IEBuYW1lID0gbmFtZVxuICBAaGV4ID0gY29udGV4dC5TVkdDb2xvcnMuYWxsQ2FzZXNbbmFtZV0ucmVwbGFjZSgnIycsJycpXG5cbiMjICAgICMjIyMjIyMjICMjICAgICAjIyAjIyAgICAjIyAgIyMjIyMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjICAgIyMgIyMgICAgIyNcbiMjICAgICMjICAgICAgICMjICAgICAjIyAjIyMjICAjIyAjI1xuIyMgICAgIyMjIyMjICAgIyMgICAgICMjICMjICMjICMjICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICMjIyMgIyNcbiMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICMjIyAjIyAgICAjI1xuIyMgICAgIyMgICAgICAgICMjIyMjIyMgICMjICAgICMjICAjIyMjIyNcblxuIyBkYXJrZW4oIzY2NjY2NiwgMjAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZGFya2VuJywgc3RyaXAoXCJcbiAgZGFya2VuI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbaCwgcywgY29udGV4dC5jbGFtcEludChsIC0gYW1vdW50KV1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMgbGlnaHRlbigjNjY2NjY2LCAyMCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsaWdodGVuJywgc3RyaXAoXCJcbiAgbGlnaHRlbiN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gW2gsIHMsIGNvbnRleHQuY2xhbXBJbnQobCArIGFtb3VudCldXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGZhZGUoI2ZmZmZmZiwgMC41KVxuIyBhbHBoYSgjZmZmZmZmLCAwLjUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpmYWRlJywgc3RyaXAoXCJcbiAgKD86ZmFkZXxhbHBoYSkje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgQHJnYiA9IGJhc2VDb2xvci5yZ2JcbiAgQGFscGhhID0gYW1vdW50XG5cbiMgdHJhbnNwYXJlbnRpemUoI2ZmZmZmZiwgMC41KVxuIyB0cmFuc3BhcmVudGl6ZSgjZmZmZmZmLCA1MCUpXG4jIGZhZGVvdXQoI2ZmZmZmZiwgMC41KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6dHJhbnNwYXJlbnRpemUnLCBzdHJpcChcIlxuICAoPzp0cmFuc3BhcmVudGl6ZXxmYWRlb3V0fGZhZGUtb3V0fGZhZGVfb3V0KSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBAcmdiID0gYmFzZUNvbG9yLnJnYlxuICBAYWxwaGEgPSBjb250ZXh0LmNsYW1wKGJhc2VDb2xvci5hbHBoYSAtIGFtb3VudClcblxuIyBvcGFjaWZ5KDB4NzhmZmZmZmYsIDAuNSlcbiMgb3BhY2lmeSgweDc4ZmZmZmZmLCA1MCUpXG4jIGZhZGVpbigweDc4ZmZmZmZmLCAwLjUpXG4jIGFscGhhKDB4NzhmZmZmZmYsIDAuNSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOm9wYWNpZnknLCBzdHJpcChcIlxuICAoPzpvcGFjaWZ5fGZhZGVpbnxmYWRlLWlufGZhZGVfaW4pI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIEByZ2IgPSBiYXNlQ29sb3IucmdiXG4gIEBhbHBoYSA9IGNvbnRleHQuY2xhbXAoYmFzZUNvbG9yLmFscGhhICsgYW1vdW50KVxuXG4jIHJlZCgjMDAwLDI1NSlcbiMgZ3JlZW4oIzAwMCwyNTUpXG4jIGJsdWUoIzAwMCwyNTUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzdHlsdXNfY29tcG9uZW50X2Z1bmN0aW9ucycsIHN0cmlwKFwiXG4gIChyZWR8Z3JlZW58Ymx1ZSkje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgY2hhbm5lbCwgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkSW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBpc05hTihhbW91bnQpXG5cbiAgQFtjaGFubmVsXSA9IGFtb3VudFxuXG4jIHRyYW5zcGFyZW50aWZ5KCM4MDgwODApXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czp0cmFuc3BhcmVudGlmeScsIHN0cmlwKFwiXG4gIHRyYW5zcGFyZW50aWZ5I3twc31cbiAgKCN7bm90UXVvdGV9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFt0b3AsIGJvdHRvbSwgYWxwaGFdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIHRvcCA9IGNvbnRleHQucmVhZENvbG9yKHRvcClcbiAgYm90dG9tID0gY29udGV4dC5yZWFkQ29sb3IoYm90dG9tKVxuICBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFscGhhKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQodG9wKVxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGJvdHRvbT8gYW5kIGNvbnRleHQuaXNJbnZhbGlkKGJvdHRvbSlcblxuICBib3R0b20gPz0gbmV3IGNvbnRleHQuQ29sb3IoMjU1LDI1NSwyNTUsMSlcbiAgYWxwaGEgPSB1bmRlZmluZWQgaWYgaXNOYU4oYWxwaGEpXG5cbiAgYmVzdEFscGhhID0gWydyZWQnLCdncmVlbicsJ2JsdWUnXS5tYXAoKGNoYW5uZWwpIC0+XG4gICAgcmVzID0gKHRvcFtjaGFubmVsXSAtIChib3R0b21bY2hhbm5lbF0pKSAvICgoaWYgMCA8IHRvcFtjaGFubmVsXSAtIChib3R0b21bY2hhbm5lbF0pIHRoZW4gMjU1IGVsc2UgMCkgLSAoYm90dG9tW2NoYW5uZWxdKSlcbiAgICByZXNcbiAgKS5zb3J0KChhLCBiKSAtPiBhIDwgYilbMF1cblxuICBwcm9jZXNzQ2hhbm5lbCA9IChjaGFubmVsKSAtPlxuICAgIGlmIGJlc3RBbHBoYSBpcyAwXG4gICAgICBib3R0b21bY2hhbm5lbF1cbiAgICBlbHNlXG4gICAgICBib3R0b21bY2hhbm5lbF0gKyAodG9wW2NoYW5uZWxdIC0gKGJvdHRvbVtjaGFubmVsXSkpIC8gYmVzdEFscGhhXG5cbiAgYmVzdEFscGhhID0gYWxwaGEgaWYgYWxwaGE/XG4gIGJlc3RBbHBoYSA9IE1hdGgubWF4KE1hdGgubWluKGJlc3RBbHBoYSwgMSksIDApXG5cbiAgQHJlZCA9IHByb2Nlc3NDaGFubmVsKCdyZWQnKVxuICBAZ3JlZW4gPSBwcm9jZXNzQ2hhbm5lbCgnZ3JlZW4nKVxuICBAYmx1ZSA9IHByb2Nlc3NDaGFubmVsKCdibHVlJylcbiAgQGFscGhhID0gTWF0aC5yb3VuZChiZXN0QWxwaGEgKiAxMDApIC8gMTAwXG5cbiMgaHVlKCM4NTUsIDYwZGVnKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aHVlJywgc3RyaXAoXCJcbiAgaHVlI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnR9ZGVnfCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBpc05hTihhbW91bnQpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gW2Ftb3VudCAlIDM2MCwgcywgbF1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMgc2F0dXJhdGlvbigjODU1LCA2MGRlZylcbiMgbGlnaHRuZXNzKCM4NTUsIDYwZGVnKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c3R5bHVzX3NsX2NvbXBvbmVudF9mdW5jdGlvbnMnLCBzdHJpcChcIlxuICAoc2F0dXJhdGlvbnxsaWdodG5lc3MpI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGNoYW5uZWwsIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEludChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaXNOYU4oYW1vdW50KVxuXG4gIGJhc2VDb2xvcltjaGFubmVsXSA9IGFtb3VudFxuICBAcmdiYSA9IGJhc2VDb2xvci5yZ2JhXG5cbiMgYWRqdXN0LWh1ZSgjODU1LCA2MGRlZylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmFkanVzdC1odWUnLCBzdHJpcChcIlxuICBhZGp1c3QtaHVlI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoLT8je2ludH1kZWd8I3t2YXJpYWJsZXN9fC0/I3tvcHRpb25hbFBlcmNlbnR9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFsoaCArIGFtb3VudCkgJSAzNjAsIHMsIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIG1peCgjZjAwLCAjMDBGLCAyNSUpXG4jIG1peCgjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bWl4JywgXCJtaXgje3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMiwgYW1vdW50XSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICBpZiBhbW91bnQ/XG4gICAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBlbHNlXG4gICAgYW1vdW50ID0gMC41XG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGNvbnRleHQubWl4Q29sb3JzKGJhc2VDb2xvcjEsIGJhc2VDb2xvcjIsIGFtb3VudClcblxuIyB0aW50KHJlZCwgNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c3R5bHVzX3RpbnQnLCBzdHJpcChcIlxuICB0aW50I3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ3N0eWwnLCAnc3R5bHVzJywgJ2xlc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIHdoaXRlID0gbmV3IGNvbnRleHQuQ29sb3IoMjU1LCAyNTUsIDI1NSlcblxuICBAcmdiYSA9IGNvbnRleHQubWl4Q29sb3JzKHdoaXRlLCBiYXNlQ29sb3IsIGFtb3VudCkucmdiYVxuXG4jIHNoYWRlKHJlZCwgNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c3R5bHVzX3NoYWRlJywgc3RyaXAoXCJcbiAgc2hhZGUje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnc3R5bCcsICdzdHlsdXMnLCAnbGVzcyddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgYmxhY2sgPSBuZXcgY29udGV4dC5Db2xvcigwLDAsMClcblxuICBAcmdiYSA9IGNvbnRleHQubWl4Q29sb3JzKGJsYWNrLCBiYXNlQ29sb3IsIGFtb3VudCkucmdiYVxuXG4jIHRpbnQocmVkLCA1MCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjb21wYXNzX3RpbnQnLCBzdHJpcChcIlxuICB0aW50I3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ3Nhc3M6Y29tcGFzcycsICdzY3NzOmNvbXBhc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIHdoaXRlID0gbmV3IGNvbnRleHQuQ29sb3IoMjU1LCAyNTUsIDI1NSlcblxuICBAcmdiYSA9IGNvbnRleHQubWl4Q29sb3JzKGJhc2VDb2xvciwgd2hpdGUsIGFtb3VudCkucmdiYVxuXG4jIHNoYWRlKHJlZCwgNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y29tcGFzc19zaGFkZScsIHN0cmlwKFwiXG4gIHNoYWRlI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ3Nhc3M6Y29tcGFzcycsICdzY3NzOmNvbXBhc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIGJsYWNrID0gbmV3IGNvbnRleHQuQ29sb3IoMCwwLDApXG5cbiAgQHJnYmEgPSBjb250ZXh0Lm1peENvbG9ycyhiYXNlQ29sb3IsIGJsYWNrLCBhbW91bnQpLnJnYmFcblxuIyB0aW50KHJlZCwgNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Ym91cmJvbl90aW50Jywgc3RyaXAoXCJcbiAgdGludCN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWydzYXNzOmJvdXJib24nLCAnc2Nzczpib3VyYm9uJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICB3aGl0ZSA9IG5ldyBjb250ZXh0LkNvbG9yKDI1NSwgMjU1LCAyNTUpXG5cbiAgQHJnYmEgPSBjb250ZXh0Lm1peENvbG9ycyh3aGl0ZSwgYmFzZUNvbG9yLCBhbW91bnQpLnJnYmFcblxuIyBzaGFkZShyZWQsIDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmJvdXJib25fc2hhZGUnLCBzdHJpcChcIlxuICBzaGFkZSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWydzYXNzOmJvdXJib24nLCAnc2Nzczpib3VyYm9uJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBibGFjayA9IG5ldyBjb250ZXh0LkNvbG9yKDAsMCwwKVxuXG4gIEByZ2JhID0gY29udGV4dC5taXhDb2xvcnMoYmxhY2ssIGJhc2VDb2xvciwgYW1vdW50KS5yZ2JhXG5cbiMgZGVzYXR1cmF0ZSgjODU1LCAyMCUpXG4jIGRlc2F0dXJhdGUoIzg1NSwgMC4yKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZGVzYXR1cmF0ZScsIFwiZGVzYXR1cmF0ZSN7cHN9KCN7bm90UXVvdGV9KSN7Y29tbWF9KCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSkje3BlfVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFtoLCBjb250ZXh0LmNsYW1wSW50KHMgLSBhbW91bnQgKiAxMDApLCBsXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBzYXR1cmF0ZSgjODU1LCAyMCUpXG4jIHNhdHVyYXRlKCM4NTUsIDAuMilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNhdHVyYXRlJywgc3RyaXAoXCJcbiAgc2F0dXJhdGUje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gW2gsIGNvbnRleHQuY2xhbXBJbnQocyArIGFtb3VudCAqIDEwMCksIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGdyYXlzY2FsZShyZWQpXG4jIGdyZXlzY2FsZShyZWQpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpncmF5c2NhbGUnLCBcImdyKD86YXxlKXlzY2FsZSN7cHN9KCN7bm90UXVvdGV9KSN7cGV9XCIsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByXSA9IG1hdGNoXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbaCwgMCwgbF1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMgaW52ZXJ0KGdyZWVuKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aW52ZXJ0JywgXCJpbnZlcnQje3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW3IsZyxiXSA9IGJhc2VDb2xvci5yZ2JcblxuICBAcmdiID0gWzI1NSAtIHIsIDI1NSAtIGcsIDI1NSAtIGJdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGNvbXBsZW1lbnQoZ3JlZW4pXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjb21wbGVtZW50JywgXCJjb21wbGVtZW50I3twc30oI3tub3RRdW90ZX0pI3twZX1cIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHJdID0gbWF0Y2hcblxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFsoaCArIDE4MCkgJSAzNjAsIHMsIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIHNwaW4oZ3JlZW4sIDIwKVxuIyBzcGluKGdyZWVuLCAyMGRlZylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNwaW4nLCBzdHJpcChcIlxuICBzcGluI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoLT8oI3tpbnR9KShkZWcpP3wje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbmdsZV0gPSBtYXRjaFxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG4gIGFuZ2xlID0gY29udGV4dC5yZWFkSW50KGFuZ2xlKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFsoMzYwICsgaCArIGFuZ2xlKSAlIDM2MCwgcywgbF1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMgY29udHJhc3QoIzY2NjY2NiwgIzExMTExMSwgIzk5OTk5OSwgdGhyZXNob2xkKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y29udHJhc3Rfbl9hcmd1bWVudHMnLCBzdHJpcChcIlxuICBjb250cmFzdCN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbYmFzZSwgZGFyaywgbGlnaHQsIHRocmVzaG9sZF0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3IoYmFzZSlcbiAgZGFyayA9IGNvbnRleHQucmVhZENvbG9yKGRhcmspXG4gIGxpZ2h0ID0gY29udGV4dC5yZWFkQ29sb3IobGlnaHQpXG4gIHRocmVzaG9sZCA9IGNvbnRleHQucmVhZFBlcmNlbnQodGhyZXNob2xkKSBpZiB0aHJlc2hvbGQ/XG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgZGFyaz8uaW52YWxpZFxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGxpZ2h0Py5pbnZhbGlkXG5cbiAgcmVzID0gY29udGV4dC5jb250cmFzdChiYXNlQ29sb3IsIGRhcmssIGxpZ2h0KVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQocmVzKVxuXG4gIHtAcmdifSA9IGNvbnRleHQuY29udHJhc3QoYmFzZUNvbG9yLCBkYXJrLCBsaWdodCwgdGhyZXNob2xkKVxuXG4jIGNvbnRyYXN0KCM2NjY2NjYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjb250cmFzdF8xX2FyZ3VtZW50Jywgc3RyaXAoXCJcbiAgY29udHJhc3Qje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHJdID0gbWF0Y2hcblxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIHtAcmdifSA9IGNvbnRleHQuY29udHJhc3QoYmFzZUNvbG9yKVxuXG4jIGNvbG9yKGdyZWVuIHRpbnQoNTAlKSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19jb2xvcl9mdW5jdGlvbicsIFwiKD86I3tuYW1lUHJlZml4ZXN9KSgje2luc2Vuc2l0aXZlICdjb2xvcid9I3twc30oI3tub3RRdW90ZX0pI3twZX0pXCIsIFsnY3NzJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgdHJ5XG4gICAgW18sZXhwcl0gPSBtYXRjaFxuICAgIGZvciBrLHYgb2YgY29udGV4dC52YXJzXG4gICAgICBleHByID0gZXhwci5yZXBsYWNlKC8vL1xuICAgICAgICAje2sucmVwbGFjZSgvXFwoL2csICdcXFxcKCcpLnJlcGxhY2UoL1xcKS9nLCAnXFxcXCknKX1cbiAgICAgIC8vL2csIHYudmFsdWUpXG5cbiAgICBjc3NDb2xvciA9IHJlcXVpcmUgJ2Nzcy1jb2xvci1mdW5jdGlvbidcbiAgICByZ2JhID0gY3NzQ29sb3IuY29udmVydChleHByLnRvTG93ZXJDYXNlKCkpXG4gICAgQHJnYmEgPSBjb250ZXh0LnJlYWRDb2xvcihyZ2JhKS5yZ2JhXG4gICAgQGNvbG9yRXhwcmVzc2lvbiA9IGV4cHJcbiAgY2F0Y2ggZVxuICAgIEBpbnZhbGlkID0gdHJ1ZVxuXG4jIGFkanVzdC1jb2xvcihyZWQsICRsaWdodG5lc3M6IDMwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNhc3NfYWRqdXN0X2NvbG9yJywgXCJhZGp1c3QtY29sb3Ije3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCAxLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuICByZXMgPSBjb250ZXh0LnNwbGl0KHN1YmV4cHIpXG4gIHN1YmplY3QgPSByZXNbMF1cbiAgcGFyYW1zID0gcmVzLnNsaWNlKDEpXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViamVjdClcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBmb3IgcGFyYW0gaW4gcGFyYW1zXG4gICAgY29udGV4dC5yZWFkUGFyYW0gcGFyYW0sIChuYW1lLCB2YWx1ZSkgLT5cbiAgICAgIGJhc2VDb2xvcltuYW1lXSArPSBjb250ZXh0LnJlYWRGbG9hdCh2YWx1ZSlcblxuICBAcmdiYSA9IGJhc2VDb2xvci5yZ2JhXG5cbiMgc2NhbGUtY29sb3IocmVkLCAkbGlnaHRuZXNzOiAzMCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzYXNzX3NjYWxlX2NvbG9yJywgXCJzY2FsZS1jb2xvciN7cHN9KCN7bm90UXVvdGV9KSN7cGV9XCIsIDEsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIE1BWF9QRVJfQ09NUE9ORU5UID1cbiAgICByZWQ6IDI1NVxuICAgIGdyZWVuOiAyNTVcbiAgICBibHVlOiAyNTVcbiAgICBhbHBoYTogMVxuICAgIGh1ZTogMzYwXG4gICAgc2F0dXJhdGlvbjogMTAwXG4gICAgbGlnaHRuZXNzOiAxMDBcblxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuICByZXMgPSBjb250ZXh0LnNwbGl0KHN1YmV4cHIpXG4gIHN1YmplY3QgPSByZXNbMF1cbiAgcGFyYW1zID0gcmVzLnNsaWNlKDEpXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViamVjdClcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBmb3IgcGFyYW0gaW4gcGFyYW1zXG4gICAgY29udGV4dC5yZWFkUGFyYW0gcGFyYW0sIChuYW1lLCB2YWx1ZSkgLT5cbiAgICAgIHZhbHVlID0gY29udGV4dC5yZWFkRmxvYXQodmFsdWUpIC8gMTAwXG5cbiAgICAgIHJlc3VsdCA9IGlmIHZhbHVlID4gMFxuICAgICAgICBkaWYgPSBNQVhfUEVSX0NPTVBPTkVOVFtuYW1lXSAtIGJhc2VDb2xvcltuYW1lXVxuICAgICAgICByZXN1bHQgPSBiYXNlQ29sb3JbbmFtZV0gKyBkaWYgKiB2YWx1ZVxuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQgPSBiYXNlQ29sb3JbbmFtZV0gKiAoMSArIHZhbHVlKVxuXG4gICAgICBiYXNlQ29sb3JbbmFtZV0gPSByZXN1bHRcblxuICBAcmdiYSA9IGJhc2VDb2xvci5yZ2JhXG5cbiMgY2hhbmdlLWNvbG9yKHJlZCwgJGxpZ2h0bmVzczogMzAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2Fzc19jaGFuZ2VfY29sb3InLCBcImNoYW5nZS1jb2xvciN7cHN9KCN7bm90UXVvdGV9KSN7cGV9XCIsIDEsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByXSA9IG1hdGNoXG4gIHJlcyA9IGNvbnRleHQuc3BsaXQoc3ViZXhwcilcbiAgc3ViamVjdCA9IHJlc1swXVxuICBwYXJhbXMgPSByZXMuc2xpY2UoMSlcblxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJqZWN0KVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIGZvciBwYXJhbSBpbiBwYXJhbXNcbiAgICBjb250ZXh0LnJlYWRQYXJhbSBwYXJhbSwgKG5hbWUsIHZhbHVlKSAtPlxuICAgICAgYmFzZUNvbG9yW25hbWVdID0gY29udGV4dC5yZWFkRmxvYXQodmFsdWUpXG5cbiAgQHJnYmEgPSBiYXNlQ29sb3IucmdiYVxuXG4jIGJsZW5kKHJnYmEoI0ZGREUwMCwuNDIpLCAweDE5QzI2MSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c19ibGVuZCcsIHN0cmlwKFwiXG4gIGJsZW5kI3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAgQHJnYmEgPSBbXG4gICAgYmFzZUNvbG9yMS5yZWQgKiBiYXNlQ29sb3IxLmFscGhhICsgYmFzZUNvbG9yMi5yZWQgKiAoMSAtIGJhc2VDb2xvcjEuYWxwaGEpXG4gICAgYmFzZUNvbG9yMS5ncmVlbiAqIGJhc2VDb2xvcjEuYWxwaGEgKyBiYXNlQ29sb3IyLmdyZWVuICogKDEgLSBiYXNlQ29sb3IxLmFscGhhKVxuICAgIGJhc2VDb2xvcjEuYmx1ZSAqIGJhc2VDb2xvcjEuYWxwaGEgKyBiYXNlQ29sb3IyLmJsdWUgKiAoMSAtIGJhc2VDb2xvcjEuYWxwaGEpXG4gICAgYmFzZUNvbG9yMS5hbHBoYSArIGJhc2VDb2xvcjIuYWxwaGEgLSBiYXNlQ29sb3IxLmFscGhhICogYmFzZUNvbG9yMi5hbHBoYVxuICBdXG5cbiMgQ29sb3IoNTAsMTIwLDIwMCwyNTUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsdWFfcmdiYScsIHN0cmlwKFwiXG4gICg/OiN7bmFtZVByZWZpeGVzfSlDb2xvciN7cHN9XFxcXHMqXG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnbHVhJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18scixnLGIsYV0gPSBtYXRjaFxuXG4gIEByZWQgPSBjb250ZXh0LnJlYWRJbnQocilcbiAgQGdyZWVuID0gY29udGV4dC5yZWFkSW50KGcpXG4gIEBibHVlID0gY29udGV4dC5yZWFkSW50KGIpXG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEludChhKSAvIDI1NVxuXG4jIyAgICAjIyMjIyMjIyAgIyMgICAgICAgIyMjIyMjIyMgIyMgICAgIyMgIyMjIyMjIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyMgICAjIyAjIyAgICAgIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyMjICAjIyAjIyAgICAgIyNcbiMjICAgICMjIyMjIyMjICAjIyAgICAgICAjIyMjIyMgICAjIyAjIyAjIyAjIyAgICAgIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgIyMjIyAjIyAgICAgIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICMjIyAjIyAgICAgIyNcbiMjICAgICMjIyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAjIyAjIyMjIyMjI1xuXG4jIG11bHRpcGx5KCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czptdWx0aXBseScsIHN0cmlwKFwiXG4gIG11bHRpcGx5I3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLk1VTFRJUExZKVxuXG4jIHNjcmVlbigjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2NyZWVuJywgc3RyaXAoXCJcbiAgc2NyZWVuI3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLlNDUkVFTilcblxuXG4jIG92ZXJsYXkoI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOm92ZXJsYXknLCBzdHJpcChcIlxuICBvdmVybGF5I3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLk9WRVJMQVkpXG5cblxuIyBzb2Z0bGlnaHQoI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNvZnRsaWdodCcsIHN0cmlwKFwiXG4gIHNvZnRsaWdodCN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5TT0ZUX0xJR0hUKVxuXG5cbiMgaGFyZGxpZ2h0KCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpoYXJkbGlnaHQnLCBzdHJpcChcIlxuICBoYXJkbGlnaHQje3BzfVxuICAgIChcbiAgICAgICN7bm90UXVvdGV9XG4gICAgICAje2NvbW1hfVxuICAgICAgI3tub3RRdW90ZX1cbiAgICApXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgW2NvbG9yMSwgY29sb3IyXSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICBiYXNlQ29sb3IxID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IxKVxuICBiYXNlQ29sb3IyID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IyKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMSkgb3IgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMilcblxuICB7QHJnYmF9ID0gYmFzZUNvbG9yMS5ibGVuZChiYXNlQ29sb3IyLCBjb250ZXh0LkJsZW5kTW9kZXMuSEFSRF9MSUdIVClcblxuXG4jIGRpZmZlcmVuY2UoI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmRpZmZlcmVuY2UnLCBzdHJpcChcIlxuICBkaWZmZXJlbmNlI3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLkRJRkZFUkVOQ0UpXG5cbiMgZXhjbHVzaW9uKCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpleGNsdXNpb24nLCBzdHJpcChcIlxuICBleGNsdXNpb24je3BzfVxuICAgIChcbiAgICAgICN7bm90UXVvdGV9XG4gICAgICAje2NvbW1hfVxuICAgICAgI3tub3RRdW90ZX1cbiAgICApXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgW2NvbG9yMSwgY29sb3IyXSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICBiYXNlQ29sb3IxID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IxKVxuICBiYXNlQ29sb3IyID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IyKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMSkgb3IgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMilcblxuICB7QHJnYmF9ID0gYmFzZUNvbG9yMS5ibGVuZChiYXNlQ29sb3IyLCBjb250ZXh0LkJsZW5kTW9kZXMuRVhDTFVTSU9OKVxuXG4jIGF2ZXJhZ2UoI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmF2ZXJhZ2UnLCBzdHJpcChcIlxuICBhdmVyYWdlI3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuICAgIHJldHVybiBAaW52YWxpZCA9IHRydWVcblxuICB7QHJnYmF9ID0gYmFzZUNvbG9yMS5ibGVuZChiYXNlQ29sb3IyLCBjb250ZXh0LkJsZW5kTW9kZXMuQVZFUkFHRSlcblxuIyBuZWdhdGlvbigjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bmVnYXRpb24nLCBzdHJpcChcIlxuICBuZWdhdGlvbiN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5ORUdBVElPTilcblxuIyMgICAgIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgICAjIyMgICAjIyNcbiMjICAgICMjICAgICAgICMjICAgICAgICMjIyMgIyMjI1xuIyMgICAgIyMjIyMjICAgIyMgICAgICAgIyMgIyMjICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyNcbiMjICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuIyMgICAgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgICMjXG5cbiMgcmdiYSA1MCAxMjAgMjAwIDFcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmVsbV9yZ2JhJywgc3RyaXAoXCJcbiAgcmdiYVxcXFxzK1xuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG5cIiksIFsnZWxtJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18scixnLGIsYV0gPSBtYXRjaFxuXG4gIEByZWQgPSBjb250ZXh0LnJlYWRJbnQocilcbiAgQGdyZWVuID0gY29udGV4dC5yZWFkSW50KGcpXG4gIEBibHVlID0gY29udGV4dC5yZWFkSW50KGIpXG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0KGEpXG5cbiMgcmdiIDUwIDEyMCAyMDBcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmVsbV9yZ2InLCBzdHJpcChcIlxuICByZ2JcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcblwiKSwgWydlbG0nXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxyLGcsYl0gPSBtYXRjaFxuXG4gIEByZWQgPSBjb250ZXh0LnJlYWRJbnQocilcbiAgQGdyZWVuID0gY29udGV4dC5yZWFkSW50KGcpXG4gIEBibHVlID0gY29udGV4dC5yZWFkSW50KGIpXG5cbmVsbUFuZ2xlID0gXCIoPzoje2Zsb2F0fXxcXFxcKGRlZ3JlZXNcXFxccysoPzoje2ludH18I3t2YXJpYWJsZXN9KVxcXFwpKVwiXG5cbiMgaHNsIDIxMCA1MCA1MFxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZWxtX2hzbCcsIHN0cmlwKFwiXG4gIGhzbFxcXFxzK1xuICAgICgje2VsbUFuZ2xlfXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuXCIpLCBbJ2VsbSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIGVsbURlZ3JlZXNSZWdleHAgPSBuZXcgUmVnRXhwKFwiXFxcXChkZWdyZWVzXFxcXHMrKCN7Y29udGV4dC5pbnR9fCN7Y29udGV4dC52YXJpYWJsZXNSRX0pXFxcXClcIilcblxuICBbXyxoLHMsbF0gPSBtYXRjaFxuXG4gIGlmIG0gPSBlbG1EZWdyZWVzUmVnZXhwLmV4ZWMoaClcbiAgICBoID0gY29udGV4dC5yZWFkSW50KG1bMV0pXG4gIGVsc2VcbiAgICBoID0gY29udGV4dC5yZWFkRmxvYXQoaCkgKiAxODAgLyBNYXRoLlBJXG5cbiAgaHNsID0gW1xuICAgIGhcbiAgICBjb250ZXh0LnJlYWRGbG9hdChzKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGwpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhzbC5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaHNsID0gaHNsXG4gIEBhbHBoYSA9IDFcblxuIyBoc2xhIDIxMCA1MCA1MCAwLjdcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmVsbV9oc2xhJywgc3RyaXAoXCJcbiAgaHNsYVxcXFxzK1xuICAgICgje2VsbUFuZ2xlfXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG5cIiksIFsnZWxtJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgZWxtRGVncmVlc1JlZ2V4cCA9IG5ldyBSZWdFeHAoXCJcXFxcKGRlZ3JlZXNcXFxccysoI3tjb250ZXh0LmludH18I3tjb250ZXh0LnZhcmlhYmxlc1JFfSlcXFxcKVwiKVxuXG4gIFtfLGgscyxsLGFdID0gbWF0Y2hcblxuICBpZiBtID0gZWxtRGVncmVlc1JlZ2V4cC5leGVjKGgpXG4gICAgaCA9IGNvbnRleHQucmVhZEludChtWzFdKVxuICBlbHNlXG4gICAgaCA9IGNvbnRleHQucmVhZEZsb2F0KGgpICogMTgwIC8gTWF0aC5QSVxuXG4gIGhzbCA9IFtcbiAgICBoXG4gICAgY29udGV4dC5yZWFkRmxvYXQocylcbiAgICBjb250ZXh0LnJlYWRGbG9hdChsKVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoc2wuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhzbCA9IGhzbFxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIGdyYXlzY2FsZSAxXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czplbG1fZ3JheXNjYWxlJywgXCJncig/OmF8ZSl5c2NhbGVcXFxccysoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVwiLCBbJ2VsbSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGFtb3VudF0gPSBtYXRjaFxuICBhbW91bnQgPSBNYXRoLmZsb29yKDI1NSAtIGNvbnRleHQucmVhZEZsb2F0KGFtb3VudCkgKiAyNTUpXG4gIEByZ2IgPSBbYW1vdW50LCBhbW91bnQsIGFtb3VudF1cblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZWxtX2NvbXBsZW1lbnQnLCBzdHJpcChcIlxuICBjb21wbGVtZW50XFxcXHMrKCN7bm90UXVvdGV9KVxuXCIpLCBbJ2VsbSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByXSA9IG1hdGNoXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbKGggKyAxODApICUgMzYwLCBzLCBsXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyMgICAgIyMgICAgICAgICAgIyMjICAgICMjIyMjIyMjICMjIyMjIyMjICMjICAgICAjI1xuIyMgICAgIyMgICAgICAgICAjIyAjIyAgICAgICMjICAgICMjICAgICAgICAjIyAgICMjXG4jIyAgICAjIyAgICAgICAgIyMgICAjIyAgICAgIyMgICAgIyMgICAgICAgICAjIyAjI1xuIyMgICAgIyMgICAgICAgIyMgICAgICMjICAgICMjICAgICMjIyMjIyAgICAgICMjI1xuIyMgICAgIyMgICAgICAgIyMjIyMjIyMjICAgICMjICAgICMjICAgICAgICAgIyMgIyNcbiMjICAgICMjICAgICAgICMjICAgICAjIyAgICAjIyAgICAjIyAgICAgICAgIyMgICAjI1xuIyMgICAgIyMjIyMjIyMgIyMgICAgICMjICAgICMjICAgICMjIyMjIyMjICMjICAgICAjI1xuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9ncmF5Jywgc3RyaXAoXCJcbiAgXFxcXFtncmF5XFxcXF1cXFxceygje2Zsb2F0fSlcXFxcfVxuXCIpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdChhbW91bnQpICogMjU1XG4gIEByZ2IgPSBbYW1vdW50LCBhbW91bnQsIGFtb3VudF1cblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGF0ZXhfaHRtbCcsIHN0cmlwKFwiXG4gIFxcXFxbSFRNTFxcXFxdXFxcXHsoI3toZXhhZGVjaW1hbH17Nn0pXFxcXH1cblwiKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuXG4gIEBoZXggPSBoZXhhXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X3JnYicsIHN0cmlwKFwiXG4gIFxcXFxbcmdiXFxcXF1cXFxceygje2Zsb2F0fSkje2NvbW1hfSgje2Zsb2F0fSkje2NvbW1hfSgje2Zsb2F0fSlcXFxcfVxuXCIpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCByLGcsYl0gPSBtYXRjaFxuXG4gIHIgPSBNYXRoLmZsb29yKGNvbnRleHQucmVhZEZsb2F0KHIpICogMjU1KVxuICBnID0gTWF0aC5mbG9vcihjb250ZXh0LnJlYWRGbG9hdChnKSAqIDI1NSlcbiAgYiA9IE1hdGguZmxvb3IoY29udGV4dC5yZWFkRmxvYXQoYikgKiAyNTUpXG4gIEByZ2IgPSBbciwgZywgYl1cblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGF0ZXhfUkdCJywgc3RyaXAoXCJcbiAgXFxcXFtSR0JcXFxcXVxcXFx7KCN7aW50fSkje2NvbW1hfSgje2ludH0pI3tjb21tYX0oI3tpbnR9KVxcXFx9XG5cIiksIFsndGV4J10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHIsZyxiXSA9IG1hdGNoXG5cbiAgciA9IGNvbnRleHQucmVhZEludChyKVxuICBnID0gY29udGV4dC5yZWFkSW50KGcpXG4gIGIgPSBjb250ZXh0LnJlYWRJbnQoYilcbiAgQHJnYiA9IFtyLCBnLCBiXVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9jbXlrJywgc3RyaXAoXCJcbiAgXFxcXFtjbXlrXFxcXF1cXFxceygje2Zsb2F0fSkje2NvbW1hfSgje2Zsb2F0fSkje2NvbW1hfSgje2Zsb2F0fSkje2NvbW1hfSgje2Zsb2F0fSlcXFxcfVxuXCIpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBjLG0seSxrXSA9IG1hdGNoXG5cbiAgYyA9IGNvbnRleHQucmVhZEZsb2F0KGMpXG4gIG0gPSBjb250ZXh0LnJlYWRGbG9hdChtKVxuICB5ID0gY29udGV4dC5yZWFkRmxvYXQoeSlcbiAgayA9IGNvbnRleHQucmVhZEZsb2F0KGspXG4gIEBjbXlrID0gW2MsbSx5LGtdXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X3ByZWRlZmluZWQnLCBzdHJpcCgnXG4gIFxcXFx7KGJsYWNrfGJsdWV8YnJvd258Y3lhbnxkYXJrZ3JheXxncmF5fGdyZWVufGxpZ2h0Z3JheXxsaW1lfG1hZ2VudGF8b2xpdmV8b3JhbmdlfHBpbmt8cHVycGxlfHJlZHx0ZWFsfHZpb2xldHx3aGl0ZXx5ZWxsb3cpXFxcXH1cbicpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBuYW1lXSA9IG1hdGNoXG4gIEBoZXggPSBjb250ZXh0LlNWR0NvbG9ycy5hbGxDYXNlc1tuYW1lXS5yZXBsYWNlKCcjJywnJylcblxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9wcmVkZWZpbmVkX2R2aXBuYW1lcycsIHN0cmlwKCdcbiAgXFxcXHsoQXByaWNvdHxBcXVhbWFyaW5lfEJpdHRlcnN3ZWV0fEJsYWNrfEJsdWV8Qmx1ZUdyZWVufEJsdWVWaW9sZXR8QnJpY2tSZWR8QnJvd258QnVybnRPcmFuZ2V8Q2FkZXRCbHVlfENhcm5hdGlvblBpbmt8Q2VydWxlYW58Q29ybmZsb3dlckJsdWV8Q3lhbnxEYW5kZWxpb258RGFya09yY2hpZHxFbWVyYWxkfEZvcmVzdEdyZWVufEZ1Y2hzaWF8R29sZGVucm9kfEdyYXl8R3JlZW58R3JlZW5ZZWxsb3d8SnVuZ2xlR3JlZW58TGF2ZW5kZXJ8TGltZUdyZWVufE1hZ2VudGF8TWFob2dhbnl8TWFyb29ufE1lbG9ufE1pZG5pZ2h0Qmx1ZXxNdWxiZXJyeXxOYXZ5Qmx1ZXxPbGl2ZUdyZWVufE9yYW5nZXxPcmFuZ2VSZWR8T3JjaGlkfFBlYWNofFBlcml3aW5rbGV8UGluZUdyZWVufFBsdW18UHJvY2Vzc0JsdWV8UHVycGxlfFJhd1NpZW5uYXxSZWR8UmVkT3JhbmdlfFJlZFZpb2xldHxSaG9kYW1pbmV8Um95YWxCbHVlfFJveWFsUHVycGxlfFJ1YmluZVJlZHxTYWxtb258U2VhR3JlZW58U2VwaWF8U2t5Qmx1ZXxTcHJpbmdHcmVlbnxUYW58VGVhbEJsdWV8VGhpc3RsZXxUdXJxdW9pc2V8VmlvbGV0fFZpb2xldFJlZHxXaGl0ZXxXaWxkU3RyYXdiZXJyeXxZZWxsb3d8WWVsbG93R3JlZW58WWVsbG93T3JhbmdlKVxcXFx9XG4nKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgbmFtZV0gPSBtYXRjaFxuICBAaGV4ID0gY29udGV4dC5EVklQbmFtZXNbbmFtZV0ucmVwbGFjZSgnIycsJycpXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X21peCcsIHN0cmlwKCdcbiAgXFxcXHsoW14hXFxcXG5cXFxcfV0rWyFdW15cXFxcfVxcXFxuXSspXFxcXH1cbicpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgb3AgPSBleHByLnNwbGl0KCchJylcblxuICBtaXggPSAoW2EscCxiXSkgLT5cbiAgICBjb2xvckEgPSBpZiBhIGluc3RhbmNlb2YgY29udGV4dC5Db2xvciB0aGVuIGEgZWxzZSBjb250ZXh0LnJlYWRDb2xvcihcInsje2F9fVwiKVxuICAgIGNvbG9yQiA9IGlmIGIgaW5zdGFuY2VvZiBjb250ZXh0LkNvbG9yIHRoZW4gYiBlbHNlIGNvbnRleHQucmVhZENvbG9yKFwieyN7Yn19XCIpXG4gICAgcGVyY2VudCA9IGNvbnRleHQucmVhZEludChwKVxuXG4gICAgY29udGV4dC5taXhDb2xvcnMoY29sb3JBLCBjb2xvckIsIHBlcmNlbnQgLyAxMDApXG5cbiAgb3AucHVzaChuZXcgY29udGV4dC5Db2xvcigyNTUsIDI1NSwgMjU1KSkgaWYgb3AubGVuZ3RoIGlzIDJcblxuICBuZXh0Q29sb3IgPSBudWxsXG5cbiAgd2hpbGUgb3AubGVuZ3RoID4gMFxuICAgIHRyaXBsZXQgPSBvcC5zcGxpY2UoMCwzKVxuICAgIG5leHRDb2xvciA9IG1peCh0cmlwbGV0KVxuICAgIG9wLnVuc2hpZnQobmV4dENvbG9yKSBpZiBvcC5sZW5ndGggPiAwXG5cbiAgQHJnYiA9IG5leHRDb2xvci5yZ2JcblxuIyAgICAgIyMjIyMjIyAgIyMjIyMjIyNcbiMgICAgIyMgICAgICMjICAgICMjXG4jICAgICMjICAgICAjIyAgICAjI1xuIyAgICAjIyAgICAgIyMgICAgIyNcbiMgICAgIyMgICMjICMjICAgICMjXG4jICAgICMjICAgICMjICAgICAjI1xuIyAgICAgIyMjIyMgIyMgICAgIyNcblxuIyBRdC5yZ2JhKDEuMCwwLjUsMC4wLDAuNylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnF0X3JnYmEnLCBzdHJpcChcIlxuICBRdFxcXFwucmdiYSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9KVxuICAje3BlfVxuXCIpLCBbJ3FtbCcsICdjJywgJ2NjJywgJ2NwcCddLCAxLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLHIsZyxiLGFdID0gbWF0Y2hcblxuICBAcmVkID0gY29udGV4dC5yZWFkRmxvYXQocikgKiAyNTVcbiAgQGdyZWVuID0gY29udGV4dC5yZWFkRmxvYXQoZykgKiAyNTVcbiAgQGJsdWUgPSBjb250ZXh0LnJlYWRGbG9hdChiKSAqIDI1NVxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuIl19

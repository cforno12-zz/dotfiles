(function() {
  var ColorContext, ColorExpression, ColorParser, registry;

  require('./helpers/matchers');

  ColorParser = require('../lib/color-parser');

  ColorContext = require('../lib/color-context');

  ColorExpression = require('../lib/color-expression');

  registry = require('../lib/color-expressions');

  describe('ColorParser', function() {
    var asColor, getParser, itParses, parser;
    parser = [][0];
    beforeEach(function() {
      var svgColorExpression;
      svgColorExpression = registry.getExpression('pigments:named_colors');
      return svgColorExpression.scopes = ['*'];
    });
    asColor = function(value) {
      return "color:" + value;
    };
    getParser = function(context) {
      context = new ColorContext(context != null ? context : {
        registry: registry
      });
      return context.parser;
    };
    itParses = function(expression) {
      return {
        description: '',
        asColor: function(r, g, b, a) {
          var context;
          if (a == null) {
            a = 1;
          }
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as a color", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).toBeColor(r, g, b, a);
            });
          });
        },
        asUndefined: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("does not parse '" + expression + "' and return undefined", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).toBeUndefined();
            });
          });
        },
        asInvalid: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as an invalid color", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).not.toBeValid();
            });
          });
        },
        withContext: function(variables) {
          var colorVars, name, path, value, vars;
          vars = [];
          colorVars = [];
          path = "/path/to/file.styl";
          for (name in variables) {
            value = variables[name];
            if (value.indexOf('color:') !== -1) {
              value = value.replace('color:', '');
              vars.push({
                name: name,
                value: value,
                path: path
              });
              colorVars.push({
                name: name,
                value: value,
                path: path
              });
            } else {
              vars.push({
                name: name,
                value: value,
                path: path
              });
            }
          }
          this.context = {
            variables: vars,
            colorVariables: colorVars,
            registry: registry
          };
          this.description = "with variables context " + (jasmine.pp(variables)) + " ";
          return this;
        }
      };
    };
    itParses('@list-item-height').withContext({
      '@text-height': '@scale-b-xxl * 1rem',
      '@component-line-height': '@text-height',
      '@list-item-height': '@component-line-height'
    }).asUndefined();
    itParses('$text-color !default').withContext({
      '$text-color': asColor('cyan')
    }).asColor(0, 255, 255);
    itParses('c').withContext({
      'c': 'c'
    }).asUndefined();
    itParses('c').withContext({
      'c': 'd',
      'd': 'e',
      'e': 'c'
    }).asUndefined();
    itParses('#ff7f00').asColor(255, 127, 0);
    itParses('#f70').asColor(255, 119, 0);
    itParses('#ff7f00cc').asColor(255, 127, 0, 0.8);
    itParses('#f70c').asColor(255, 119, 0, 0.8);
    itParses('0xff7f00').asColor(255, 127, 0);
    itParses('0x00ff7f00').asColor(255, 127, 0, 0);
    describe('in context other than css and pre-processors', function() {
      beforeEach(function() {
        return this.scope = 'xaml';
      });
      return itParses('#ccff7f00').asColor(255, 127, 0, 0.8);
    });
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('RGB(255,127,0)').asColor(255, 127, 0);
    itParses('RgB(255,127,0)').asColor(255, 127, 0);
    itParses('rGb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb($r,$g,$b)').asInvalid();
    itParses('rgb($r,0,0)').asInvalid();
    itParses('rgb(0,$g,0)').asInvalid();
    itParses('rgb(0,0,$b)').asInvalid();
    itParses('rgb($r,$g,$b)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0'
    }).asColor(255, 127, 0);
    itParses('rgba(255,127,0,0.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('RGBA(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rGbA(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,)').asUndefined();
    itParses('rgba($r,$g,$b,$a)').asInvalid();
    itParses('rgba($r,0,0,0)').asInvalid();
    itParses('rgba(0,$g,0,0)').asInvalid();
    itParses('rgba(0,0,$b,0)').asInvalid();
    itParses('rgba(0,0,0,$a)').asInvalid();
    itParses('rgba($r,$g,$b,$a)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0',
      '$a': '0.5'
    }).asColor(255, 127, 0, 0.5);
    itParses('rgba(green, 0.5)').asColor(0, 128, 0, 0.5);
    itParses('rgba($c,$a,)').asUndefined();
    itParses('rgba($c,$a)').asInvalid();
    itParses('rgba($c,1)').asInvalid();
    itParses('rgba($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('rgba($c,$a)').withContext({
      '$c': asColor('green'),
      '$a': '0.5'
    }).asColor(0, 128, 0, 0.5);
    describe('css', function() {
      beforeEach(function() {
        return this.scope = 'css';
      });
      itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
      itParses('hsl(200,50,50)').asColor(64, 149, 191);
      itParses('HSL(200,50,50)').asColor(64, 149, 191);
      itParses('hSl(200,50,50)').asColor(64, 149, 191);
      itParses('hsl(200.5,50.5,50.5)').asColor(65, 150, 193);
      itParses('hsl($h,$s,$l,)').asUndefined();
      itParses('hsl($h,$s,$l)').asInvalid();
      itParses('hsl($h,0%,0%)').asInvalid();
      itParses('hsl(0,$s,0%)').asInvalid();
      itParses('hsl(0,0%,$l)').asInvalid();
      return itParses('hsl($h,$s,$l)').withContext({
        '$h': '200',
        '$s': '50%',
        '$l': '50%'
      }).asColor(64, 149, 191);
    });
    describe('less', function() {
      beforeEach(function() {
        return this.scope = 'less';
      });
      itParses('hsl(285, 0.7, 0.7)').asColor('#cd7de8');
      return itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
    });
    itParses('hsla(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('HSLA(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('HsLa(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200.5,50.5,50.5,.5)').asColor(65, 150, 193, 0.5);
    itParses('hsla(200,50%,50%,)').asUndefined();
    itParses('hsla($h,$s,$l,$a)').asInvalid();
    itParses('hsla($h,0%,0%,0)').asInvalid();
    itParses('hsla(0,$s,0%,0)').asInvalid();
    itParses('hsla(0,0%,$l,0)').asInvalid();
    itParses('hsla(0,0%,0%,$a)').asInvalid();
    itParses('hsla($h,$s,$l,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hsv(200,50%,50%)').asColor(64, 106, 128);
    itParses('HSV(200,50%,50%)').asColor(64, 106, 128);
    itParses('hSv(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50,50)').asColor(64, 106, 128);
    itParses('hsb(200.5,50.5,50.5)').asColor(64, 107, 129);
    itParses('hsv($h,$s,$v,)').asUndefined();
    itParses('hsv($h,$s,$v)').asInvalid();
    itParses('hsv($h,0%,0%)').asInvalid();
    itParses('hsv(0,$s,0%)').asInvalid();
    itParses('hsv(0,0%,$v)').asInvalid();
    itParses('hsv($h,$s,$v)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%'
    }).asColor(64, 106, 128);
    itParses('hsva(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('HSVA(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsba(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('HsBa(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50%,50%,.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200.5,50.5,50.5,.5)').asColor(64, 107, 129, 0.5);
    itParses('hsva(200,50%,50%,)').asUndefined();
    itParses('hsva($h,$s,$v,$a)').asInvalid();
    itParses('hsva($h,0%,0%,0)').asInvalid();
    itParses('hsva(0,$s,0%,0)').asInvalid();
    itParses('hsva(0,0%,$v,0)').asInvalid();
    itParses('hsva($h,$s,$v,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%',
      '$a': '0.5'
    }).asColor(64, 106, 128, 0.5);
    itParses('hcg(200,50%,50%)').asColor(64, 149, 191);
    itParses('HCG(200,50%,50%)').asColor(64, 149, 191);
    itParses('hcg(200,50,50)').asColor(64, 149, 191);
    itParses('hcg(200.5,50.5,50.5)').asColor(64, 150, 193);
    itParses('hcg($h,$c,$g,)').asUndefined();
    itParses('hcg($h,$c,$g)').asInvalid();
    itParses('hcg($h,0%,0%)').asInvalid();
    itParses('hcg(0,$c,0%)').asInvalid();
    itParses('hcg(0,0%,$g)').asInvalid();
    itParses('hcg($h,$c,$g)').withContext({
      '$h': '200',
      '$c': '50%',
      '$g': '50%'
    }).asColor(64, 149, 191);
    itParses('hcga(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200,50,50,0.5)').asColor(64, 149, 191, 0.5);
    itParses('HCGA(200,50,50,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200.5,50.5,50.5,.5)').asColor(64, 150, 193, 0.5);
    itParses('hcga(200,50%,50%,)').asUndefined();
    itParses('hcga($h,$c,$g,$a)').asInvalid();
    itParses('hcga($h,0%,0%,0)').asInvalid();
    itParses('hcga(0,$c,0%,0)').asInvalid();
    itParses('hcga(0,0%,$g,0)').asInvalid();
    itParses('hcga($h,$c,$g,$a)').withContext({
      '$h': '200',
      '$c': '50%',
      '$g': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hwb(210,40%,40%)').asColor(102, 128, 153);
    itParses('hwb(210,40,40)').asColor(102, 128, 153);
    itParses('HWB(210,40,40)').asColor(102, 128, 153);
    itParses('hWb(210,40,40)').asColor(102, 128, 153);
    itParses('hwb(210,40%,40%, 0.5)').asColor(102, 128, 153, 0.5);
    itParses('hwb(210.5,40.5,40.5)').asColor(103, 128, 152);
    itParses('hwb(210.5,40.5%,40.5%, 0.5)').asColor(103, 128, 152, 0.5);
    itParses('hwb($h,$w,$b,)').asUndefined();
    itParses('hwb($h,$w,$b)').asInvalid();
    itParses('hwb($h,0%,0%)').asInvalid();
    itParses('hwb(0,$w,0%)').asInvalid();
    itParses('hwb(0,0%,$b)').asInvalid();
    itParses('hwb($h,0%,0%,0)').asInvalid();
    itParses('hwb(0,$w,0%,0)').asInvalid();
    itParses('hwb(0,0%,$b,0)').asInvalid();
    itParses('hwb(0,0%,0%,$a)').asInvalid();
    itParses('hwb($h,$w,$b)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%'
    }).asColor(102, 128, 153);
    itParses('hwb($h,$w,$b,$a)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%',
      '$a': '0.5'
    }).asColor(102, 128, 153, 0.5);
    itParses('cmyk(0,0.5,1,0)').asColor('#ff7f00');
    itParses('CMYK(0,0.5,1,0)').asColor('#ff7f00');
    itParses('cMyK(0,0.5,1,0)').asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').withContext({
      'c': '0',
      'm': '0.5',
      'y': '1',
      'k': '0'
    }).asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').asInvalid();
    itParses('gray(100%)').asColor(255, 255, 255);
    itParses('gray(100)').asColor(255, 255, 255);
    itParses('GRAY(100)').asColor(255, 255, 255);
    itParses('gRaY(100)').asColor(255, 255, 255);
    itParses('gray(100%, 0.5)').asColor(255, 255, 255, 0.5);
    itParses('gray($c, $a,)').asUndefined();
    itParses('gray($c, $a)').asInvalid();
    itParses('gray(0%, $a)').asInvalid();
    itParses('gray($c, 0)').asInvalid();
    itParses('gray($c, $a)').withContext({
      '$c': '100%',
      '$a': '0.5'
    }).asColor(255, 255, 255, 0.5);
    itParses('yellowgreen').asColor('#9acd32');
    itParses('YELLOWGREEN').asColor('#9acd32');
    itParses('yellowGreen').asColor('#9acd32');
    itParses('YellowGreen').asColor('#9acd32');
    itParses('yellow_green').asColor('#9acd32');
    itParses('YELLOW_GREEN').asColor('#9acd32');
    itParses('>YELLOW_GREEN').asColor('#9acd32');
    itParses('darken(cyan, 20%)').asColor(0, 153, 153);
    itParses('darken(cyan, 20)').asColor(0, 153, 153);
    itParses('darken(#fff, 100%)').asColor(0, 0, 0);
    itParses('darken(cyan, $r)').asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('darken($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('lighten(cyan, 20%)').asColor(102, 255, 255);
    itParses('lighten(cyan, 20)').asColor(102, 255, 255);
    itParses('lighten(#000, 100%)').asColor(255, 255, 255);
    itParses('lighten(cyan, $r)').asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('lighten($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('transparentize(cyan, 50%)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 50)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade-out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade_out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, @r)').asInvalid();
    itParses('fadeout($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadeout(@c, @r)').withContext({
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('fadeout(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('opacify(0x7800FFFF, 50%)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 50)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade-in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade_in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, @r)').asInvalid();
    itParses('fadein($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadein(@c, @r)').withContext({
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('fadein(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('saturate(#855, 20%)').asColor(158, 63, 63);
    itParses('saturate(#855, 20)').asColor(158, 63, 63);
    itParses('saturate(#855, 0.2)').asColor(158, 63, 63);
    itParses('saturate(#855, @r)').asInvalid();
    itParses('saturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('saturate(@c, @r)').withContext({
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('saturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('desaturate(#9e3f3f, 20%)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 20)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 0.2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, .2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, @r)').asInvalid();
    itParses('desaturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('desaturate(@c, @r)').withContext({
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('desaturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('grayscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('greyscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('grayscale(@c)').asInvalid();
    itParses('grayscale($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('grayscale(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('grayscale(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('invert(#9e3f3f)').asColor(97, 192, 192);
    itParses('invert(@c)').asInvalid();
    itParses('invert($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('invert(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('invert(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('adjust-hue(#811, 45deg)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45deg)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45%)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45%)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45)').asColor(136, 17, 106);
    itParses('adjust-hue($c, $r)').asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106);
    itParses('adjust-hue($a, $r)').withContext({
      '$a': asColor('rgba($c, 0.5)'),
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106, 0.5);
    itParses('mix(rgb(255,0,0), blue)').asColor(127, 0, 127);
    itParses('mix(red, rgb(0,0,255), 25%)').asColor(63, 0, 191);
    itParses('mix(#ff0000, 0x0000ff)').asColor('#7f007f');
    itParses('mix(#ff0000, 0x0000ff, 25%)').asColor('#3f00bf');
    itParses('mix(red, rgb(0,0,255), 25)').asColor(63, 0, 191);
    itParses('mix($a, $b, $r)').asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('hsv($h, $s, $v)'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('blue'),
      '$b': asColor('hsv($h, $s, $v)'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    itParses('mix($c, $d, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$c': asColor('rgba($a, 1)'),
      '$d': asColor('rgba($b, 1)'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    describe('stylus and less', function() {
      beforeEach(function() {
        return this.scope = 'styl';
      });
      itParses('tint(#fd0cc7,66%)').asColor(254, 172, 235);
      itParses('tint(#fd0cc7,66)').asColor(254, 172, 235);
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(254, 172, 235);
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(254, 172, 235, 0.966);
      itParses('shade(#fd0cc7,66%)').asColor(86, 4, 67);
      itParses('shade(#fd0cc7,66)').asColor(86, 4, 67);
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(86, 4, 67);
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(86, 4, 67, 0.966);
    });
    describe('scss and sass', function() {
      describe('with compass implementation', function() {
        beforeEach(function() {
          return this.scope = 'sass:compass';
        });
        itParses('tint(#BADA55, 42%)').asColor('#e2efb7');
        itParses('tint(#BADA55, 42)').asColor('#e2efb7');
        itParses('tint($c,$r)').asInvalid();
        itParses('tint($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('tint($c,$r)').withContext({
          '$c': asColor('#BADA55'),
          '$r': '42%'
        }).asColor('#e2efb7');
        itParses('tint($c,$r)').withContext({
          '$a': asColor('#BADA55'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(226, 239, 183, 0.942);
        itParses('shade(#663399, 42%)').asColor('#2a1540');
        itParses('shade(#663399, 42)').asColor('#2a1540');
        itParses('shade($c,$r)').asInvalid();
        itParses('shade($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('shade($c,$r)').withContext({
          '$c': asColor('#663399'),
          '$r': '42%'
        }).asColor('#2a1540');
        return itParses('shade($c,$r)').withContext({
          '$a': asColor('#663399'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(0x2a, 0x15, 0x40, 0.942);
      });
      return describe('with bourbon implementation', function() {
        beforeEach(function() {
          return this.scope = 'sass:bourbon';
        });
        itParses('tint(#BADA55, 42%)').asColor(214, 233, 156);
        itParses('tint(#BADA55, 42)').asColor(214, 233, 156);
        itParses('tint($c,$r)').asInvalid();
        itParses('tint($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('tint($c,$r)').withContext({
          '$c': asColor('#BADA55'),
          '$r': '42%'
        }).asColor(214, 233, 156);
        itParses('tint($c,$r)').withContext({
          '$a': asColor('#BADA55'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(214, 233, 156, 0.942);
        itParses('shade(#663399, 42%)').asColor(59, 29, 88);
        itParses('shade(#663399, 42)').asColor(59, 29, 88);
        itParses('shade($c,$r)').asInvalid();
        itParses('shade($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('shade($c,$r)').withContext({
          '$c': asColor('#663399'),
          '$r': '42%'
        }).asColor(59, 29, 88);
        return itParses('shade($c,$r)').withContext({
          '$a': asColor('#663399'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(59, 29, 88, 0.942);
      });
    });
    itParses('adjust-color(#102030, $red: -5, $blue: 5)', 11, 32, 53);
    itParses('adjust-color(hsl(25, 100%, 80%), $lightness: -30%, $alpha: -0.4)', 255, 106, 0, 0.6);
    itParses('adjust-color($c, $red: $a, $blue: $b)').asInvalid();
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('adjust-color($c, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030')
    }).asColor(11, 32, 53);
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(11, 32, 53);
    itParses('scale-color(rgb(200, 150, 170), $green: -40%, $blue: 70%)').asColor(200, 90, 230);
    itParses('change-color(rgb(200, 150, 170), $green: 40, $blue: 70)').asColor(200, 40, 70);
    itParses('scale-color($c, $green: $a, $blue: $b)').asInvalid();
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('scale-color($c, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)')
    }).asColor(200, 90, 230);
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(200, 90, 230);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120deg)').asColor(0, 255, 0);
    itParses('spin(#F00, -120)').asColor(0, 0, 255);
    itParses('spin(#F00, -120deg)').asColor(0, 0, 255);
    itParses('spin(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '120'
    }).asColor(0, 255, 0);
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a,)').asUndefined();
    itParses('fade(#F00, 0.5)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50%)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50)').asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '0.5'
    }).asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a,)').asUndefined();
    itParses('contrast(#bbbbbb)').asColor(0, 0, 0);
    itParses('contrast(#333333)').asColor(255, 255, 255);
    itParses('contrast(#bbbbbb, rgb(20,20,20))').asColor(20, 20, 20);
    itParses('contrast(#333333, rgb(20,20,20), rgb(140,140,140))').asColor(140, 140, 140);
    itParses('contrast(#666666, rgb(20,20,20), rgb(140,140,140), 13%)').asColor(140, 140, 140);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#bbbbbb')
    }).asColor(0, 0, 0);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#333333')
    }).asColor(255, 255, 255);
    itParses('contrast(@base, @dark)').withContext({
      '@base': asColor('#bbbbbb'),
      '@dark': asColor('rgb(20,20,20)')
    }).asColor(20, 20, 20);
    itParses('contrast(@base, @dark, @light)').withContext({
      '@base': asColor('#333333'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)')
    }).asColor(140, 140, 140);
    itParses('contrast(@base, @dark, @light, @threshold)').withContext({
      '@base': asColor('#666666'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)'),
      '@threshold': '13%'
    }).asColor(140, 140, 140);
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base, @dark)').asInvalid();
    itParses('contrast(@base, @dark, @light)').asInvalid();
    itParses('contrast(@base, @dark, @light, @threshold)').asInvalid();
    itParses('multiply(#ff6600, 0x666666)').asColor('#662900');
    itParses('multiply(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#662900');
    itParses('multiply(@base, @modifier)').asInvalid();
    itParses('screen(#ff6600, 0x666666)').asColor('#ffa366');
    itParses('screen(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ffa366');
    itParses('screen(@base, @modifier)').asInvalid();
    itParses('overlay(#ff6600, 0x666666)').asColor('#ff5200');
    itParses('overlay(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5200');
    itParses('overlay(@base, @modifier)').asInvalid();
    itParses('softlight(#ff6600, 0x666666)').asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').asInvalid();
    itParses('hardlight(#ff6600, 0x666666)').asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').asInvalid();
    itParses('difference(#ff6600, 0x666666)').asColor('#990066');
    itParses('difference(#ff6600,)()').asInvalid();
    itParses('difference(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#990066');
    itParses('difference(@base, @modifier)').asInvalid();
    itParses('exclusion(#ff6600, 0x666666)').asColor('#997a66');
    itParses('exclusion(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#997a66');
    itParses('exclusion(@base, @modifier)').asInvalid();
    itParses('average(#ff6600, 0x666666)').asColor('#b36633');
    itParses('average(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#b36633');
    itParses('average(@base, @modifier)').asInvalid();
    itParses('average(@gradient-b, @gradient-mean)').withContext({
      '@gradient-a': asColor('#00d38b'),
      '@gradient-b': asColor('#009285'),
      '@gradient-mean': asColor('average(@gradient-a, @gradient-b)')
    }).asColor('#00a287');
    itParses('negation(#ff6600, 0x666666)').asColor('#99cc66');
    itParses('negation(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#99cc66');
    itParses('negation(@base, @modifier)').asInvalid();
    itParses('blend(rgba(#FFDE00,.42), 0x19C261)').asColor('#7ace38');
    itParses('blend(@top, @bottom)').withContext({
      '@top': asColor('rgba(#FFDE00,.42)'),
      '@bottom': asColor('0x19C261')
    }).asColor('#7ace38');
    itParses('blend(@top, @bottom)').asInvalid();
    itParses('complement(red)').asColor('#00ffff');
    itParses('complement(@base)').withContext({
      '@base': asColor('red')
    }).asColor('#00ffff');
    itParses('complement(@base)').asInvalid();
    itParses('transparentify(#808080)').asColor(0, 0, 0, 0.5);
    itParses('transparentify(#414141, black)').asColor(255, 255, 255, 0.25);
    itParses('transparentify(#91974C, 0xF34949, 0.5)').asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').withContext({
      'a': asColor('#808080')
    }).asColor(0, 0, 0, 0.5);
    itParses('transparentify(a, b, 0.5)').withContext({
      'a': asColor('#91974C'),
      'b': asColor('#F34949')
    }).asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').asInvalid();
    itParses('red(#000, 255)').asColor(255, 0, 0);
    itParses('red(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(255, 0, 0);
    itParses('red(a, b)').asInvalid();
    itParses('green(#000, 255)').asColor(0, 255, 0);
    itParses('green(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 255, 0);
    itParses('green(a, b)').asInvalid();
    itParses('blue(#000, 255)').asColor(0, 0, 255);
    itParses('blue(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 0, 255);
    itParses('blue(a, b)').asInvalid();
    itParses('alpha(#000, 0.5)').asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').withContext({
      'a': asColor('#000'),
      'b': '0.5'
    }).asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').asInvalid();
    itParses('hue(#00c, 90deg)').asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '90deg'
    }).asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').asInvalid();
    itParses('saturation(#00c, 50%)').asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '50%'
    }).asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').asInvalid();
    itParses('lightness(#00c, 80%)').asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '80%'
    }).asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').asInvalid();
    describe('CSS color function', function() {
      beforeEach(function() {
        return this.scope = 'css';
      });
      itParses('color(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      itParses('COLOR(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      itParses('cOlOr(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      return itParses('color(var(--foo) tint(66%))').withContext({
        'var(--foo)': asColor('#fd0cc7')
      }).asColor(254, 172, 236);
    });
    describe('lua color', function() {
      beforeEach(function() {
        return this.scope = 'lua';
      });
      itParses('Color(255, 0, 0, 255)').asColor(255, 0, 0);
      itParses('Color(r, g, b, a)').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '255'
      }).asColor(255, 0, 0);
      return itParses('Color(r, g, b, a)').asInvalid();
    });
    describe('elm-lang support', function() {
      beforeEach(function() {
        return this.scope = 'elm';
      });
      itParses('rgba 255 0 0 1').asColor(255, 0, 0);
      itParses('rgba r g b a').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '1'
      }).asColor(255, 0, 0);
      itParses('rgba r g b a').asInvalid();
      itParses('rgb 255 0 0').asColor(255, 0, 0);
      itParses('rgb r g b').withContext({
        'r': '255',
        'g': '0',
        'b': '0'
      }).asColor(255, 0, 0);
      itParses('rgb r g b').asInvalid();
      itParses('hsla (degrees 200) 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').withContext({
        'h': '200',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').asInvalid();
      itParses('hsla 3.49 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').withContext({
        'h': '3.49',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').asInvalid();
      itParses('hsl (degrees 200) 50 50').asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').withContext({
        'h': '200',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').asInvalid();
      itParses('hsl 3.49 50 50').asColor(64, 149, 191);
      itParses('hsl h s l').withContext({
        'h': '3.49',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl h s l').asInvalid();
      itParses('grayscale 1').asColor(0, 0, 0);
      itParses('greyscale 0.5').asColor(127, 127, 127);
      itParses('grayscale 0').asColor(255, 255, 255);
      itParses('grayscale g').withContext({
        'g': '0.5'
      }).asColor(127, 127, 127);
      itParses('grayscale g').asInvalid();
      itParses('complement rgb 255 0 0').asColor('#00ffff');
      itParses('complement base').withContext({
        'base': asColor('red')
      }).asColor('#00ffff');
      return itParses('complement base').asInvalid();
    });
    describe('latex support', function() {
      beforeEach(function() {
        return this.scope = 'tex';
      });
      itParses('[gray]{1}').asColor('#ffffff');
      itParses('[rgb]{1,0.5,0}').asColor('#ff7f00');
      itParses('[RGB]{255,127,0}').asColor('#ff7f00');
      itParses('[cmyk]{0,0.5,1,0}').asColor('#ff7f00');
      itParses('[HTML]{ff7f00}').asColor('#ff7f00');
      itParses('{blue}').asColor('#0000ff');
      itParses('{blue!20}').asColor('#ccccff');
      itParses('{blue!20!black}').asColor('#000033');
      return itParses('{blue!20!black!30!green}').asColor('#00590f');
    });
    describe('qt support', function() {
      beforeEach(function() {
        return this.scope = 'qml';
      });
      return itParses('Qt.rgba(1.0,1.0,0,0.5)').asColor(255, 255, 0, 0.5);
    });
    return describe('qt cpp support', function() {
      beforeEach(function() {
        return this.scope = 'cpp';
      });
      return itParses('Qt.rgba(1.0,1.0,0,0.5)').asColor(255, 255, 0, 0.5);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXBhcnNlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxDQUFRLG9CQUFSOztFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBQ2QsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUjs7RUFDZixlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDbEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUjs7RUFFWCxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFBQyxTQUFVO0lBRVgsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsa0JBQUEsR0FBcUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsdUJBQXZCO2FBQ3JCLGtCQUFrQixDQUFDLE1BQW5CLEdBQTRCLENBQUMsR0FBRDtJQUZuQixDQUFYO0lBSUEsT0FBQSxHQUFVLFNBQUMsS0FBRDthQUFXLFFBQUEsR0FBUztJQUFwQjtJQUVWLFNBQUEsR0FBWSxTQUFDLE9BQUQ7TUFDVixPQUFBLEdBQWMsSUFBQSxZQUFBLG1CQUFhLFVBQVU7UUFBQyxVQUFBLFFBQUQ7T0FBdkI7YUFDZCxPQUFPLENBQUM7SUFGRTtJQUlaLFFBQUEsR0FBVyxTQUFDLFVBQUQ7YUFDVDtRQUFBLFdBQUEsRUFBYSxFQUFiO1FBQ0EsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUDtBQUNQLGNBQUE7O1lBRGMsSUFBRTs7VUFDaEIsT0FBQSxHQUFVLElBQUMsQ0FBQTtpQkFDWCxRQUFBLENBQVMsSUFBQyxDQUFBLFdBQVYsRUFBdUIsU0FBQTtZQUNyQixVQUFBLENBQVcsU0FBQTtxQkFBRyxNQUFBLEdBQVMsU0FBQSxDQUFVLE9BQVY7WUFBWixDQUFYO21C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WDthQUVBLFFBQUEsQ0FBUyx3QkFBVCxDQUFrQyxDQUFDLE9BQW5DLENBQTJDLEdBQTNDLEVBQWdELEdBQWhELEVBQXFELENBQXJELEVBQXdELEdBQXhEO0lBSHFCLENBQXZCO1dBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7TUFDekIsVUFBQSxDQUFXLFNBQUE7ZUFBRyxJQUFDLENBQUEsS0FBRCxHQUFTO01BQVosQ0FBWDthQUVBLFFBQUEsQ0FBUyx3QkFBVCxDQUFrQyxDQUFDLE9BQW5DLENBQTJDLEdBQTNDLEVBQWdELEdBQWhELEVBQXFELENBQXJELEVBQXdELEdBQXhEO0lBSHlCLENBQTNCO0VBbitCc0IsQ0FBeEI7QUFQQSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUgJy4vaGVscGVycy9tYXRjaGVycydcblxuQ29sb3JQYXJzZXIgPSByZXF1aXJlICcuLi9saWIvY29sb3ItcGFyc2VyJ1xuQ29sb3JDb250ZXh0ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLWNvbnRleHQnXG5Db2xvckV4cHJlc3Npb24gPSByZXF1aXJlICcuLi9saWIvY29sb3ItZXhwcmVzc2lvbidcbnJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLWV4cHJlc3Npb25zJ1xuXG5kZXNjcmliZSAnQ29sb3JQYXJzZXInLCAtPlxuICBbcGFyc2VyXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHN2Z0NvbG9yRXhwcmVzc2lvbiA9IHJlZ2lzdHJ5LmdldEV4cHJlc3Npb24oJ3BpZ21lbnRzOm5hbWVkX2NvbG9ycycpXG4gICAgc3ZnQ29sb3JFeHByZXNzaW9uLnNjb3BlcyA9IFsnKiddXG5cbiAgYXNDb2xvciA9ICh2YWx1ZSkgLT4gXCJjb2xvcjoje3ZhbHVlfVwiXG5cbiAgZ2V0UGFyc2VyID0gKGNvbnRleHQpIC0+XG4gICAgY29udGV4dCA9IG5ldyBDb2xvckNvbnRleHQoY29udGV4dCA/IHtyZWdpc3RyeX0pXG4gICAgY29udGV4dC5wYXJzZXJcblxuICBpdFBhcnNlcyA9IChleHByZXNzaW9uKSAtPlxuICAgIGRlc2NyaXB0aW9uOiAnJ1xuICAgIGFzQ29sb3I6IChyLGcsYixhPTEpIC0+XG4gICAgICBjb250ZXh0ID0gQGNvbnRleHRcbiAgICAgIGRlc2NyaWJlIEBkZXNjcmlwdGlvbiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBwYXJzZXIgPSBnZXRQYXJzZXIoY29udGV4dClcblxuICAgICAgICBpdCBcInBhcnNlcyAnI3tleHByZXNzaW9ufScgYXMgYSBjb2xvclwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYXJzZXIucGFyc2UoZXhwcmVzc2lvbiwgQHNjb3BlID8gJ2xlc3MnKSkudG9CZUNvbG9yKHIsZyxiLGEpXG5cbiAgICBhc1VuZGVmaW5lZDogLT5cbiAgICAgIGNvbnRleHQgPSBAY29udGV4dFxuICAgICAgZGVzY3JpYmUgQGRlc2NyaXB0aW9uLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IHBhcnNlciA9IGdldFBhcnNlcihjb250ZXh0KVxuXG4gICAgICAgIGl0IFwiZG9lcyBub3QgcGFyc2UgJyN7ZXhwcmVzc2lvbn0nIGFuZCByZXR1cm4gdW5kZWZpbmVkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhcnNlci5wYXJzZShleHByZXNzaW9uLCBAc2NvcGUgPyAnbGVzcycpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGFzSW52YWxpZDogLT5cbiAgICAgIGNvbnRleHQgPSBAY29udGV4dFxuICAgICAgZGVzY3JpYmUgQGRlc2NyaXB0aW9uLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IHBhcnNlciA9IGdldFBhcnNlcihjb250ZXh0KVxuXG4gICAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyBhbiBpbnZhbGlkIGNvbG9yXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhcnNlci5wYXJzZShleHByZXNzaW9uLCBAc2NvcGUgPyAnbGVzcycpKS5ub3QudG9CZVZhbGlkKClcblxuICAgIHdpdGhDb250ZXh0OiAodmFyaWFibGVzKSAtPlxuICAgICAgdmFycyA9IFtdXG4gICAgICBjb2xvclZhcnMgPSBbXVxuICAgICAgcGF0aCA9IFwiL3BhdGgvdG8vZmlsZS5zdHlsXCJcbiAgICAgIGZvciBuYW1lLHZhbHVlIG9mIHZhcmlhYmxlc1xuICAgICAgICBpZiB2YWx1ZS5pbmRleE9mKCdjb2xvcjonKSBpc250IC0xXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCdjb2xvcjonLCAnJylcbiAgICAgICAgICB2YXJzLnB1c2gge25hbWUsIHZhbHVlLCBwYXRofVxuICAgICAgICAgIGNvbG9yVmFycy5wdXNoIHtuYW1lLCB2YWx1ZSwgcGF0aH1cblxuICAgICAgICBlbHNlXG4gICAgICAgICAgdmFycy5wdXNoIHtuYW1lLCB2YWx1ZSwgcGF0aH1cbiAgICAgIEBjb250ZXh0ID0ge3ZhcmlhYmxlczogdmFycywgY29sb3JWYXJpYWJsZXM6IGNvbG9yVmFycywgcmVnaXN0cnl9XG4gICAgICBAZGVzY3JpcHRpb24gPSBcIndpdGggdmFyaWFibGVzIGNvbnRleHQgI3tqYXNtaW5lLnBwIHZhcmlhYmxlc30gXCJcblxuICAgICAgcmV0dXJuIHRoaXNcblxuICBpdFBhcnNlcygnQGxpc3QtaXRlbS1oZWlnaHQnKS53aXRoQ29udGV4dCh7XG4gICAgJ0B0ZXh0LWhlaWdodCc6ICdAc2NhbGUtYi14eGwgKiAxcmVtJ1xuICAgICdAY29tcG9uZW50LWxpbmUtaGVpZ2h0JzogJ0B0ZXh0LWhlaWdodCdcbiAgICAnQGxpc3QtaXRlbS1oZWlnaHQnOiAnQGNvbXBvbmVudC1saW5lLWhlaWdodCdcbiAgICB9KS5hc1VuZGVmaW5lZCgpXG5cbiAgaXRQYXJzZXMoJyR0ZXh0LWNvbG9yICFkZWZhdWx0Jykud2l0aENvbnRleHQoe1xuICAgICckdGV4dC1jb2xvcic6IGFzQ29sb3IgJ2N5YW4nXG4gIH0pLmFzQ29sb3IoMCwyNTUsMjU1KVxuXG4gIGl0UGFyc2VzKCdjJykud2l0aENvbnRleHQoeydjJzogJ2MnfSkuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygnYycpLndpdGhDb250ZXh0KHtcbiAgICAnYyc6ICdkJ1xuICAgICdkJzogJ2UnXG4gICAgJ2UnOiAnYydcbiAgfSkuYXNVbmRlZmluZWQoKVxuXG4gIGl0UGFyc2VzKCcjZmY3ZjAwJykuYXNDb2xvcigyNTUsIDEyNywgMClcbiAgaXRQYXJzZXMoJyNmNzAnKS5hc0NvbG9yKDI1NSwgMTE5LCAwKVxuXG4gIGl0UGFyc2VzKCcjZmY3ZjAwY2MnKS5hc0NvbG9yKDI1NSwgMTI3LCAwLCAwLjgpXG4gIGl0UGFyc2VzKCcjZjcwYycpLmFzQ29sb3IoMjU1LCAxMTksIDAsIDAuOClcblxuICBpdFBhcnNlcygnMHhmZjdmMDAnKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygnMHgwMGZmN2YwMCcpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDApXG5cbiAgZGVzY3JpYmUgJ2luIGNvbnRleHQgb3RoZXIgdGhhbiBjc3MgYW5kIHByZS1wcm9jZXNzb3JzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICd4YW1sJ1xuXG4gICAgaXRQYXJzZXMoJyNjY2ZmN2YwMCcpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuOClcblxuICBpdFBhcnNlcygncmdiKDI1NSwxMjcsMCknKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygncmdiKDI1NSwxMjcsMCknKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygnUkdCKDI1NSwxMjcsMCknKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygnUmdCKDI1NSwxMjcsMCknKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygnckdiKDI1NSwxMjcsMCknKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygncmdiKCRyLCRnLCRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2IoJHIsMCwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2IoMCwkZywwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2IoMCwwLCRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2IoJHIsJGcsJGIpJykud2l0aENvbnRleHQoe1xuICAgICckcic6ICcyNTUnXG4gICAgJyRnJzogJzEyNydcbiAgICAnJGInOiAnMCdcbiAgfSkuYXNDb2xvcigyNTUsIDEyNywgMClcblxuICBpdFBhcnNlcygncmdiYSgyNTUsMTI3LDAsMC41KScpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ3JnYmEoMjU1LDEyNywwLC41KScpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ1JHQkEoMjU1LDEyNywwLC41KScpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ3JHYkEoMjU1LDEyNywwLC41KScpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ3JnYmEoMjU1LDEyNywwLCknKS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKCRyLCRnLCRiLCRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKCRyLDAsMCwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKDAsJGcsMCwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKDAsMCwkYiwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKDAsMCwwLCRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKCRyLCRnLCRiLCRhKScpLndpdGhDb250ZXh0KHtcbiAgICAnJHInOiAnMjU1J1xuICAgICckZyc6ICcxMjcnXG4gICAgJyRiJzogJzAnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcigyNTUsIDEyNywgMCwgMC41KVxuXG4gIGl0UGFyc2VzKCdyZ2JhKGdyZWVuLCAwLjUpJykuYXNDb2xvcigwLCAxMjgsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ3JnYmEoJGMsJGEsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJGMsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJGMsMSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygncmdiYSgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJGMsJGEpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2dyZWVuJ1xuICAgICckYSc6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwgMTI4LCAwLCAwLjUpXG5cbiAgZGVzY3JpYmUgJ2NzcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnY3NzJ1xuXG4gICAgaXRQYXJzZXMoJ2hzbCgyMDAsNTAlLDUwJSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaHNsKDIwMCw1MCw1MCknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnSFNMKDIwMCw1MCw1MCknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaFNsKDIwMCw1MCw1MCknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaHNsKDIwMC41LDUwLjUsNTAuNSknKS5hc0NvbG9yKDY1LCAxNTAsIDE5MylcbiAgICBpdFBhcnNlcygnaHNsKCRoLCRzLCRsLCknKS5hc1VuZGVmaW5lZCgpXG4gICAgaXRQYXJzZXMoJ2hzbCgkaCwkcywkbCknKS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdoc2woJGgsMCUsMCUpJykuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygnaHNsKDAsJHMsMCUpJykuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygnaHNsKDAsMCUsJGwpJykuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygnaHNsKCRoLCRzLCRsKScpLndpdGhDb250ZXh0KHtcbiAgICAgICckaCc6ICcyMDAnXG4gICAgICAnJHMnOiAnNTAlJ1xuICAgICAgJyRsJzogJzUwJSdcbiAgICB9KS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcblxuICBkZXNjcmliZSAnbGVzcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnbGVzcydcblxuICAgIGl0UGFyc2VzKCdoc2woMjg1LCAwLjcsIDAuNyknKS5hc0NvbG9yKCcjY2Q3ZGU4JylcbiAgICBpdFBhcnNlcygnaHNsKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuXG4gIGl0UGFyc2VzKCdoc2xhKDIwMCw1MCUsNTAlLDAuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaHNsYSgyMDAsNTAlLDUwJSwuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaHNsYSgyMDAsNTAsNTAsLjUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgaXRQYXJzZXMoJ0hTTEEoMjAwLDUwLDUwLC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdIc0xhKDIwMCw1MCw1MCwuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaHNsYSgyMDAuNSw1MC41LDUwLjUsLjUpJykuYXNDb2xvcig2NSwgMTUwLCAxOTMsIDAuNSlcbiAgaXRQYXJzZXMoJ2hzbGEoMjAwLDUwJSw1MCUsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2hzbGEoJGgsJHMsJGwsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzbGEoJGgsMCUsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHNsYSgwLCRzLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzbGEoMCwwJSwkbCwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc2xhKDAsMCUsMCUsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzbGEoJGgsJHMsJGwsJGEpJykud2l0aENvbnRleHQoe1xuICAgICckaCc6ICcyMDAnXG4gICAgJyRzJzogJzUwJSdcbiAgICAnJGwnOiAnNTAlJ1xuICAgICckYSc6ICcwLjUnXG4gIH0pLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG5cbiAgaXRQYXJzZXMoJ2hzdigyMDAsNTAlLDUwJSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcbiAgaXRQYXJzZXMoJ0hTVigyMDAsNTAlLDUwJSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcbiAgaXRQYXJzZXMoJ2hTdigyMDAsNTAlLDUwJSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcbiAgaXRQYXJzZXMoJ2hzYigyMDAsNTAlLDUwJSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcbiAgaXRQYXJzZXMoJ2hzYigyMDAsNTAsNTApJykuYXNDb2xvcig2NCwgMTA2LCAxMjgpXG4gIGl0UGFyc2VzKCdoc2IoMjAwLjUsNTAuNSw1MC41KScpLmFzQ29sb3IoNjQsIDEwNywgMTI5KVxuICBpdFBhcnNlcygnaHN2KCRoLCRzLCR2LCknKS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdoc3YoJGgsJHMsJHYpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdigkaCwwJSwwJSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHN2KDAsJHMsMCUpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdigwLDAlLCR2KScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc3YoJGgsJHMsJHYpJykud2l0aENvbnRleHQoe1xuICAgICckaCc6ICcyMDAnXG4gICAgJyRzJzogJzUwJSdcbiAgICAnJHYnOiAnNTAlJ1xuICB9KS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcblxuICBpdFBhcnNlcygnaHN2YSgyMDAsNTAlLDUwJSwwLjUpJykuYXNDb2xvcig2NCwgMTA2LCAxMjgsIDAuNSlcbiAgaXRQYXJzZXMoJ2hzdmEoMjAwLDUwLDUwLDAuNSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuICBpdFBhcnNlcygnSFNWQSgyMDAsNTAsNTAsMC41KScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4LCAwLjUpXG4gIGl0UGFyc2VzKCdoc2JhKDIwMCw1MCUsNTAlLDAuNSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuICBpdFBhcnNlcygnSHNCYSgyMDAsNTAlLDUwJSwwLjUpJykuYXNDb2xvcig2NCwgMTA2LCAxMjgsIDAuNSlcbiAgaXRQYXJzZXMoJ2hzdmEoMjAwLDUwJSw1MCUsLjUpJykuYXNDb2xvcig2NCwgMTA2LCAxMjgsIDAuNSlcbiAgaXRQYXJzZXMoJ2hzdmEoMjAwLjUsNTAuNSw1MC41LC41KScpLmFzQ29sb3IoNjQsIDEwNywgMTI5LCAwLjUpXG4gIGl0UGFyc2VzKCdoc3ZhKDIwMCw1MCUsNTAlLCknKS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdoc3ZhKCRoLCRzLCR2LCRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc3ZhKCRoLDAlLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdmEoMCwkcywwJSwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc3ZhKDAsMCUsJHYsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHN2YSgkaCwkcywkdiwkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIwMCdcbiAgICAnJHMnOiAnNTAlJ1xuICAgICckdic6ICc1MCUnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcig2NCwgMTA2LCAxMjgsIDAuNSlcblxuICBpdFBhcnNlcygnaGNnKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICBpdFBhcnNlcygnSENHKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICBpdFBhcnNlcygnaGNnKDIwMCw1MCw1MCknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgaXRQYXJzZXMoJ2hjZygyMDAuNSw1MC41LDUwLjUpJykuYXNDb2xvcig2NCwgMTUwLCAxOTMpXG4gIGl0UGFyc2VzKCdoY2coJGgsJGMsJGcsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2hjZygkaCwkYywkZyknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaGNnKCRoLDAlLDAlKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2coMCwkYywwJSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaGNnKDAsMCUsJGcpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hjZygkaCwkYywkZyknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIwMCdcbiAgICAnJGMnOiAnNTAlJ1xuICAgICckZyc6ICc1MCUnXG4gIH0pLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuXG4gIGl0UGFyc2VzKCdoY2dhKDIwMCw1MCUsNTAlLDAuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaGNnYSgyMDAsNTAsNTAsMC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdIQ0dBKDIwMCw1MCw1MCwwLjUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgaXRQYXJzZXMoJ2hjZ2EoMjAwLDUwJSw1MCUsLjUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgaXRQYXJzZXMoJ2hjZ2EoMjAwLjUsNTAuNSw1MC41LC41KScpLmFzQ29sb3IoNjQsIDE1MCwgMTkzLCAwLjUpXG4gIGl0UGFyc2VzKCdoY2dhKDIwMCw1MCUsNTAlLCknKS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdoY2dhKCRoLCRjLCRnLCRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2dhKCRoLDAlLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hjZ2EoMCwkYywwJSwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2dhKDAsMCUsJGcsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaGNnYSgkaCwkYywkZywkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIwMCdcbiAgICAnJGMnOiAnNTAlJ1xuICAgICckZyc6ICc1MCUnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcblxuICBpdFBhcnNlcygnaHdiKDIxMCw0MCUsNDAlKScpLmFzQ29sb3IoMTAyLCAxMjgsIDE1MylcbiAgaXRQYXJzZXMoJ2h3YigyMTAsNDAsNDApJykuYXNDb2xvcigxMDIsIDEyOCwgMTUzKVxuICBpdFBhcnNlcygnSFdCKDIxMCw0MCw0MCknKS5hc0NvbG9yKDEwMiwgMTI4LCAxNTMpXG4gIGl0UGFyc2VzKCdoV2IoMjEwLDQwLDQwKScpLmFzQ29sb3IoMTAyLCAxMjgsIDE1MylcbiAgaXRQYXJzZXMoJ2h3YigyMTAsNDAlLDQwJSwgMC41KScpLmFzQ29sb3IoMTAyLCAxMjgsIDE1MywgMC41KVxuICBpdFBhcnNlcygnaHdiKDIxMC41LDQwLjUsNDAuNSknKS5hc0NvbG9yKDEwMywgMTI4LCAxNTIpXG4gIGl0UGFyc2VzKCdod2IoMjEwLjUsNDAuNSUsNDAuNSUsIDAuNSknKS5hc0NvbG9yKDEwMywgMTI4LCAxNTIsIDAuNSlcbiAgaXRQYXJzZXMoJ2h3YigkaCwkdywkYiwpJykuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygnaHdiKCRoLCR3LCRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdod2IoJGgsMCUsMCUpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigwLCR3LDAlKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdod2IoMCwwJSwkYiknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHdiKCRoLDAlLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigwLCR3LDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigwLDAlLCRiLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigwLDAlLDAlLCRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdod2IoJGgsJHcsJGIpJykud2l0aENvbnRleHQoe1xuICAgICckaCc6ICcyMTAnXG4gICAgJyR3JzogJzQwJSdcbiAgICAnJGInOiAnNDAlJ1xuICB9KS5hc0NvbG9yKDEwMiwgMTI4LCAxNTMpXG4gIGl0UGFyc2VzKCdod2IoJGgsJHcsJGIsJGEpJykud2l0aENvbnRleHQoe1xuICAgICckaCc6ICcyMTAnXG4gICAgJyR3JzogJzQwJSdcbiAgICAnJGInOiAnNDAlJ1xuICAgICckYSc6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMTAyLCAxMjgsIDE1MywgMC41KVxuXG4gIGl0UGFyc2VzKCdjbXlrKDAsMC41LDEsMCknKS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgaXRQYXJzZXMoJ0NNWUsoMCwwLjUsMSwwKScpLmFzQ29sb3IoJyNmZjdmMDAnKVxuICBpdFBhcnNlcygnY015SygwLDAuNSwxLDApJykuYXNDb2xvcignI2ZmN2YwMCcpXG4gIGl0UGFyc2VzKCdjbXlrKGMsbSx5LGspJykud2l0aENvbnRleHQoe1xuICAgICdjJzogJzAnXG4gICAgJ20nOiAnMC41J1xuICAgICd5JzogJzEnXG4gICAgJ2snOiAnMCdcbiAgfSkuYXNDb2xvcignI2ZmN2YwMCcpXG4gIGl0UGFyc2VzKCdjbXlrKGMsbSx5LGspJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnZ3JheSgxMDAlKScpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ2dyYXkoMTAwKScpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ0dSQVkoMTAwKScpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ2dSYVkoMTAwKScpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ2dyYXkoMTAwJSwgMC41KScpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygnZ3JheSgkYywgJGEsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2dyYXkoJGMsICRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdncmF5KDAlLCAkYSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZ3JheSgkYywgMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZ3JheSgkYywgJGEpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6ICcxMDAlJ1xuICAgICckYSc6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSwgMC41KVxuXG4gIGl0UGFyc2VzKCd5ZWxsb3dncmVlbicpLmFzQ29sb3IoJyM5YWNkMzInKVxuICBpdFBhcnNlcygnWUVMTE9XR1JFRU4nKS5hc0NvbG9yKCcjOWFjZDMyJylcbiAgaXRQYXJzZXMoJ3llbGxvd0dyZWVuJykuYXNDb2xvcignIzlhY2QzMicpXG4gIGl0UGFyc2VzKCdZZWxsb3dHcmVlbicpLmFzQ29sb3IoJyM5YWNkMzInKVxuICBpdFBhcnNlcygneWVsbG93X2dyZWVuJykuYXNDb2xvcignIzlhY2QzMicpXG4gIGl0UGFyc2VzKCdZRUxMT1dfR1JFRU4nKS5hc0NvbG9yKCcjOWFjZDMyJylcbiAgaXRQYXJzZXMoJz5ZRUxMT1dfR1JFRU4nKS5hc0NvbG9yKCcjOWFjZDMyJylcblxuICBpdFBhcnNlcygnZGFya2VuKGN5YW4sIDIwJSknKS5hc0NvbG9yKDAsIDE1MywgMTUzKVxuICBpdFBhcnNlcygnZGFya2VuKGN5YW4sIDIwKScpLmFzQ29sb3IoMCwgMTUzLCAxNTMpXG4gIGl0UGFyc2VzKCdkYXJrZW4oI2ZmZiwgMTAwJSknKS5hc0NvbG9yKDAsIDAsIDApXG4gIGl0UGFyc2VzKCdkYXJrZW4oY3lhbiwgJHIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2RhcmtlbigkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2RhcmtlbigkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJyRyJzogJzIwJSdcbiAgfSkuYXNDb2xvcigwLCAxNTMsIDE1MylcbiAgaXRQYXJzZXMoJ2RhcmtlbigkYSwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ3JnYmEoJGMsIDEpJ1xuICAgICckYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJyRyJzogJzIwJSdcbiAgfSkuYXNDb2xvcigwLCAxNTMsIDE1MylcblxuICBpdFBhcnNlcygnbGlnaHRlbihjeWFuLCAyMCUpJykuYXNDb2xvcigxMDIsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnbGlnaHRlbihjeWFuLCAyMCknKS5hc0NvbG9yKDEwMiwgMjU1LCAyNTUpXG4gIGl0UGFyc2VzKCdsaWdodGVuKCMwMDAsIDEwMCUpJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnbGlnaHRlbihjeWFuLCAkciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnbGlnaHRlbigkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2xpZ2h0ZW4oJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdjeWFuJ1xuICAgICckcic6ICcyMCUnXG4gIH0pLmFzQ29sb3IoMTAyLCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ2xpZ2h0ZW4oJGEsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiBhc0NvbG9yICdyZ2JhKCRjLCAxKSdcbiAgICAnJGMnOiBhc0NvbG9yICdjeWFuJ1xuICAgICckcic6ICcyMCUnXG4gIH0pLmFzQ29sb3IoMTAyLCAyNTUsIDI1NSlcblxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpemUoY3lhbiwgNTAlKScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aXplKGN5YW4sIDUwKScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aXplKGN5YW4sIDAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCd0cmFuc3BhcmVudGl6ZShjeWFuLCAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlb3V0KGN5YW4sIDAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlLW91dChjeWFuLCAwLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygnZmFkZV9vdXQoY3lhbiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGVvdXQoY3lhbiwgLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygnZmFkZW91dChjeWFuLCBAciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZmFkZW91dCgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2ZhZGVvdXQoQGMsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGMnOiBhc0NvbG9yICdjeWFuJ1xuICAgICdAcic6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGVvdXQoQGEsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiBhc0NvbG9yICdyZ2JhKEBjLCAxKSdcbiAgICAnQGMnOiBhc0NvbG9yICdjeWFuJ1xuICAgICdAcic6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcblxuICBpdFBhcnNlcygnb3BhY2lmeSgweDc4MDBGRkZGLCA1MCUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ29wYWNpZnkoMHg3ODAwRkZGRiwgNTApJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ29wYWNpZnkoMHg3ODAwRkZGRiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdvcGFjaWZ5KDB4NzgwMEZGRkYsIC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdmYWRlaW4oMHg3ODAwRkZGRiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdmYWRlLWluKDB4NzgwMEZGRkYsIDAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAxKVxuICBpdFBhcnNlcygnZmFkZV9pbigweDc4MDBGRkZGLCAwLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ2ZhZGVpbigweDc4MDBGRkZGLCAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAxKVxuICBpdFBhcnNlcygnZmFkZWluKDB4NzgwMEZGRkYsIEByKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdmYWRlaW4oJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgJyRyJzogJzEnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdmYWRlaW4oQGMsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGMnOiBhc0NvbG9yICcweDc4MDBGRkZGJ1xuICAgICdAcic6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdmYWRlaW4oQGEsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiBhc0NvbG9yICdyZ2JhKEBjLCAxKSdcbiAgICAnQGMnOiBhc0NvbG9yICcweDc4MDBGRkZGJ1xuICAgICdAcic6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG5cbiAgaXRQYXJzZXMoJ3NhdHVyYXRlKCM4NTUsIDIwJSknKS5hc0NvbG9yKDE1OCwgNjMsIDYzKVxuICBpdFBhcnNlcygnc2F0dXJhdGUoIzg1NSwgMjApJykuYXNDb2xvcigxNTgsIDYzLCA2MylcbiAgaXRQYXJzZXMoJ3NhdHVyYXRlKCM4NTUsIDAuMiknKS5hc0NvbG9yKDE1OCwgNjMsIDYzKVxuICBpdFBhcnNlcygnc2F0dXJhdGUoIzg1NSwgQHIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3NhdHVyYXRlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnc2F0dXJhdGUoQGMsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGMnOiBhc0NvbG9yICcjODU1J1xuICAgICdAcic6ICcwLjInXG4gIH0pLmFzQ29sb3IoMTU4LCA2MywgNjMpXG4gIGl0UGFyc2VzKCdzYXR1cmF0ZShAYSwgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6IGFzQ29sb3IgJ3JnYmEoQGMsIDEpJ1xuICAgICdAYyc6IGFzQ29sb3IgJyM4NTUnXG4gICAgJ0ByJzogJzAuMidcbiAgfSkuYXNDb2xvcigxNTgsIDYzLCA2MylcblxuICBpdFBhcnNlcygnZGVzYXR1cmF0ZSgjOWUzZjNmLCAyMCUpJykuYXNDb2xvcigxMzYsIDg1LCA4NSlcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoIzllM2YzZiwgMjApJykuYXNDb2xvcigxMzYsIDg1LCA4NSlcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoIzllM2YzZiwgMC4yKScpLmFzQ29sb3IoMTM2LCA4NSwgODUpXG4gIGl0UGFyc2VzKCdkZXNhdHVyYXRlKCM5ZTNmM2YsIC4yKScpLmFzQ29sb3IoMTM2LCA4NSwgODUpXG4gIGl0UGFyc2VzKCdkZXNhdHVyYXRlKCM5ZTNmM2YsIEByKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdkZXNhdHVyYXRlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZGVzYXR1cmF0ZShAYywgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJyM5ZTNmM2YnXG4gICAgJ0ByJzogJzAuMidcbiAgfSkuYXNDb2xvcigxMzYsIDg1LCA4NSlcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoQGEsIEByKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiBhc0NvbG9yICdyZ2JhKEBjLCAxKSdcbiAgICAnQGMnOiBhc0NvbG9yICcjOWUzZjNmJ1xuICAgICdAcic6ICcwLjInXG4gIH0pLmFzQ29sb3IoMTM2LCA4NSwgODUpXG5cbiAgaXRQYXJzZXMoJ2dyYXlzY2FsZSgjOWUzZjNmKScpLmFzQ29sb3IoMTExLCAxMTEsIDExMSlcbiAgaXRQYXJzZXMoJ2dyZXlzY2FsZSgjOWUzZjNmKScpLmFzQ29sb3IoMTExLCAxMTEsIDExMSlcbiAgaXRQYXJzZXMoJ2dyYXlzY2FsZShAYyknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZ3JheXNjYWxlKCRjKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdncmF5c2NhbGUoQGMpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJyM5ZTNmM2YnXG4gIH0pLmFzQ29sb3IoMTExLCAxMTEsIDExMSlcbiAgaXRQYXJzZXMoJ2dyYXlzY2FsZShAYSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BhJzogYXNDb2xvciAncmdiYShAYywgMSknXG4gICAgJ0BjJzogYXNDb2xvciAnIzllM2YzZidcbiAgfSkuYXNDb2xvcigxMTEsIDExMSwgMTExKVxuXG4gIGl0UGFyc2VzKCdpbnZlcnQoIzllM2YzZiknKS5hc0NvbG9yKDk3LCAxOTIsIDE5MilcbiAgaXRQYXJzZXMoJ2ludmVydChAYyknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaW52ZXJ0KCRjKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdpbnZlcnQoQGMpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJyM5ZTNmM2YnXG4gIH0pLmFzQ29sb3IoOTcsIDE5MiwgMTkyKVxuICBpdFBhcnNlcygnaW52ZXJ0KEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiBhc0NvbG9yICdyZ2JhKEBjLCAxKSdcbiAgICAnQGMnOiBhc0NvbG9yICcjOWUzZjNmJ1xuICB9KS5hc0NvbG9yKDk3LCAxOTIsIDE5MilcblxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgjODExLCA0NWRlZyknKS5hc0NvbG9yKDEzNiwgMTA2LCAxNylcbiAgaXRQYXJzZXMoJ2FkanVzdC1odWUoIzgxMSwgLTQ1ZGVnKScpLmFzQ29sb3IoMTM2LCAxNywgMTA2KVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgjODExLCA0NSUpJykuYXNDb2xvcigxMzYsIDEwNiwgMTcpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCM4MTEsIC00NSUpJykuYXNDb2xvcigxMzYsIDE3LCAxMDYpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCM4MTEsIDQ1KScpLmFzQ29sb3IoMTM2LCAxMDYsIDE3KVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgjODExLCAtNDUpJykuYXNDb2xvcigxMzYsIDE3LCAxMDYpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCRjLCAkciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2FkanVzdC1odWUoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICcjODExJ1xuICAgICckcic6ICctNDVkZWcnXG4gIH0pLmFzQ29sb3IoMTM2LCAxNywgMTA2KVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgkYSwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ3JnYmEoJGMsIDAuNSknXG4gICAgJyRjJzogYXNDb2xvciAnIzgxMSdcbiAgICAnJHInOiAnLTQ1ZGVnJ1xuICB9KS5hc0NvbG9yKDEzNiwgMTcsIDEwNiwgMC41KVxuXG4gIGl0UGFyc2VzKCdtaXgocmdiKDI1NSwwLDApLCBibHVlKScpLmFzQ29sb3IoMTI3LCAwLCAxMjcpXG4gIGl0UGFyc2VzKCdtaXgocmVkLCByZ2IoMCwwLDI1NSksIDI1JSknKS5hc0NvbG9yKDYzLCAwLCAxOTEpXG4gIGl0UGFyc2VzKCdtaXgoI2ZmMDAwMCwgMHgwMDAwZmYpJykuYXNDb2xvcignIzdmMDA3ZicpXG4gIGl0UGFyc2VzKCdtaXgoI2ZmMDAwMCwgMHgwMDAwZmYsIDI1JSknKS5hc0NvbG9yKCcjM2YwMGJmJylcbiAgaXRQYXJzZXMoJ21peChyZWQsIHJnYigwLDAsMjU1KSwgMjUpJykuYXNDb2xvcig2MywgMCwgMTkxKVxuICBpdFBhcnNlcygnbWl4KCRhLCAkYiwgJHIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ21peCgkYSwgJGIsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgJyRiJzogYXNDb2xvciAnYmx1ZSdcbiAgICAnJHInOiAnMjUlJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnbWl4KCRhLCAkYiwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ2JsdWUnXG4gICAgJyRiJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcyNSUnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdtaXgoJGEsICRiLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogYXNDb2xvciAncmVkJ1xuICAgICckYic6IGFzQ29sb3IgJ2JsdWUnXG4gICAgJyRyJzogJzI1JSdcbiAgfSkuYXNDb2xvcig2MywgMCwgMTkxKVxuICBpdFBhcnNlcygnbWl4KCRjLCAkZCwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ3JlZCdcbiAgICAnJGInOiBhc0NvbG9yICdibHVlJ1xuICAgICckYyc6IGFzQ29sb3IgJ3JnYmEoJGEsIDEpJ1xuICAgICckZCc6IGFzQ29sb3IgJ3JnYmEoJGIsIDEpJ1xuICAgICckcic6ICcyNSUnXG4gIH0pLmFzQ29sb3IoNjMsIDAsIDE5MSlcblxuICBkZXNjcmliZSAnc3R5bHVzIGFuZCBsZXNzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdzdHlsJ1xuXG4gICAgaXRQYXJzZXMoJ3RpbnQoI2ZkMGNjNyw2NiUpJykuYXNDb2xvcigyNTQsIDE3MiwgMjM1KVxuICAgIGl0UGFyc2VzKCd0aW50KCNmZDBjYzcsNjYpJykuYXNDb2xvcigyNTQsIDE3MiwgMjM1KVxuICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgaXRQYXJzZXMoJ3RpbnQoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAgICckcic6ICcxJ1xuICAgIH0pLmFzSW52YWxpZCgpXG4gICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRjJzogYXNDb2xvciAnI2ZkMGNjNydcbiAgICAgICckcic6ICc2NiUnXG4gICAgfSkuYXNDb2xvcigyNTQsIDE3MiwgMjM1KVxuICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICckYSc6IGFzQ29sb3IgJyNmZDBjYzcnXG4gICAgICAnJGMnOiBhc0NvbG9yICdyZ2JhKCRhLCAwLjkpJ1xuICAgICAgJyRyJzogJzY2JSdcbiAgICB9KS5hc0NvbG9yKDI1NCwgMTcyLCAyMzUsIDAuOTY2KVxuXG4gICAgaXRQYXJzZXMoJ3NoYWRlKCNmZDBjYzcsNjYlKScpLmFzQ29sb3IoODYsIDQsIDY3KVxuICAgIGl0UGFyc2VzKCdzaGFkZSgjZmQwY2M3LDY2KScpLmFzQ29sb3IoODYsIDQsIDY3KVxuICAgIGl0UGFyc2VzKCdzaGFkZSgkYywkciknKS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdzaGFkZSgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICAgJyRyJzogJzEnXG4gICAgfSkuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygnc2hhZGUoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRjJzogYXNDb2xvciAnI2ZkMGNjNydcbiAgICAgICckcic6ICc2NiUnXG4gICAgfSkuYXNDb2xvcig4NiwgNCwgNjcpXG4gICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICckYSc6IGFzQ29sb3IgJyNmZDBjYzcnXG4gICAgICAnJGMnOiBhc0NvbG9yICdyZ2JhKCRhLCAwLjkpJ1xuICAgICAgJyRyJzogJzY2JSdcbiAgICB9KS5hc0NvbG9yKDg2LCA0LCA2NywgMC45NjYpXG5cbiAgZGVzY3JpYmUgJ3Njc3MgYW5kIHNhc3MnLCAtPlxuICAgIGRlc2NyaWJlICd3aXRoIGNvbXBhc3MgaW1wbGVtZW50YXRpb24nLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnc2Fzczpjb21wYXNzJ1xuXG4gICAgICBpdFBhcnNlcygndGludCgjQkFEQTU1LCA0MiUpJykuYXNDb2xvcignI2UyZWZiNycpXG4gICAgICBpdFBhcnNlcygndGludCgjQkFEQTU1LCA0MiknKS5hc0NvbG9yKCcjZTJlZmI3JylcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygndGludCgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgICAgICckcic6ICcxJ1xuICAgICAgfSkuYXNJbnZhbGlkKClcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnI0JBREE1NSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoJyNlMmVmYjcnKVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGEnOiBhc0NvbG9yICcjQkFEQTU1J1xuICAgICAgICAnJGMnOiBhc0NvbG9yICdyZ2JhKCRhLCAwLjkpJ1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcigyMjYsMjM5LDE4MywwLjk0MilcblxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCM2NjMzOTksIDQyJSknKS5hc0NvbG9yKCcjMmExNTQwJylcbiAgICAgIGl0UGFyc2VzKCdzaGFkZSgjNjYzMzk5LCA0MiknKS5hc0NvbG9yKCcjMmExNTQwJylcbiAgICAgIGl0UGFyc2VzKCdzaGFkZSgkYywkciknKS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAgICAgJyRyJzogJzEnXG4gICAgICB9KS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnIzY2MzM5OSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoJyMyYTE1NDAnKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRhJzogYXNDb2xvciAnIzY2MzM5OSdcbiAgICAgICAgJyRjJzogYXNDb2xvciAncmdiYSgkYSwgMC45KSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoMHgyYSwweDE1LDB4NDAsMC45NDIpXG5cbiAgICBkZXNjcmliZSAnd2l0aCBib3VyYm9uIGltcGxlbWVudGF0aW9uJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gQHNjb3BlID0gJ3Nhc3M6Ym91cmJvbidcblxuICAgICAgaXRQYXJzZXMoJ3RpbnQoI0JBREE1NSwgNDIlKScpLmFzQ29sb3IoMjE0LCAyMzMsIDE1NilcbiAgICAgIGl0UGFyc2VzKCd0aW50KCNCQURBNTUsIDQyKScpLmFzQ29sb3IoMjE0LCAyMzMsIDE1NilcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygndGludCgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgICAgICckcic6ICcxJ1xuICAgICAgfSkuYXNJbnZhbGlkKClcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnI0JBREE1NSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoMjE0LCAyMzMsIDE1NilcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRhJzogYXNDb2xvciAnI0JBREE1NSdcbiAgICAgICAgJyRjJzogYXNDb2xvciAncmdiYSgkYSwgMC45KSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoMjE0LCAyMzMsIDE1NiwgMC45NDIpXG5cbiAgICAgIGl0UGFyc2VzKCdzaGFkZSgjNjYzMzk5LCA0MiUpJykuYXNDb2xvcig1OSwgMjksIDg4KVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCM2NjMzOTksIDQyKScpLmFzQ29sb3IoNTksIDI5LCA4OClcbiAgICAgIGl0UGFyc2VzKCdzaGFkZSgkYywkciknKS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAgICAgJyRyJzogJzEnXG4gICAgICB9KS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnIzY2MzM5OSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoNTksIDI5LCA4OClcbiAgICAgIGl0UGFyc2VzKCdzaGFkZSgkYywkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYSc6IGFzQ29sb3IgJyM2NjMzOTknXG4gICAgICAgICckYyc6IGFzQ29sb3IgJ3JnYmEoJGEsIDAuOSknXG4gICAgICAgICckcic6ICc0MiUnXG4gICAgICB9KS5hc0NvbG9yKDU5LCAyOSwgODgsIDAuOTQyKVxuXG4gIGl0UGFyc2VzKCdhZGp1c3QtY29sb3IoIzEwMjAzMCwgJHJlZDogLTUsICRibHVlOiA1KScsIDExLCAzMiwgNTMpXG4gIGl0UGFyc2VzKCdhZGp1c3QtY29sb3IoaHNsKDI1LCAxMDAlLCA4MCUpLCAkbGlnaHRuZXNzOiAtMzAlLCAkYWxwaGE6IC0wLjQpJywgMjU1LCAxMDYsIDAsIDAuNilcbiAgaXRQYXJzZXMoJ2FkanVzdC1jb2xvcigkYywgJHJlZDogJGEsICRibHVlOiAkYiknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnYWRqdXN0LWNvbG9yKCRkLCAkcmVkOiAkYSwgJGJsdWU6ICRiKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiAnLTUnXG4gICAgJyRiJzogJzUnXG4gICAgJyRkJzogYXNDb2xvciAncmdiYSgkYywgMSknXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdhZGp1c3QtY29sb3IoJGMsICRyZWQ6ICRhLCAkYmx1ZTogJGIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6ICctNSdcbiAgICAnJGInOiAnNSdcbiAgICAnJGMnOiBhc0NvbG9yICcjMTAyMDMwJ1xuICB9KS5hc0NvbG9yKDExLCAzMiwgNTMpXG4gIGl0UGFyc2VzKCdhZGp1c3QtY29sb3IoJGQsICRyZWQ6ICRhLCAkYmx1ZTogJGIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6ICctNSdcbiAgICAnJGInOiAnNSdcbiAgICAnJGMnOiBhc0NvbG9yICcjMTAyMDMwJ1xuICAgICckZCc6IGFzQ29sb3IgJ3JnYmEoJGMsIDEpJ1xuICB9KS5hc0NvbG9yKDExLCAzMiwgNTMpXG5cbiAgaXRQYXJzZXMoJ3NjYWxlLWNvbG9yKHJnYigyMDAsIDE1MCwgMTcwKSwgJGdyZWVuOiAtNDAlLCAkYmx1ZTogNzAlKScpLmFzQ29sb3IoMjAwLCA5MCwgMjMwKVxuICBpdFBhcnNlcygnY2hhbmdlLWNvbG9yKHJnYigyMDAsIDE1MCwgMTcwKSwgJGdyZWVuOiA0MCwgJGJsdWU6IDcwKScpLmFzQ29sb3IoMjAwLCA0MCwgNzApXG4gIGl0UGFyc2VzKCdzY2FsZS1jb2xvcigkYywgJGdyZWVuOiAkYSwgJGJsdWU6ICRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdzY2FsZS1jb2xvcigkZCwgJGdyZWVuOiAkYSwgJGJsdWU6ICRiKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiAnLTQwJSdcbiAgICAnJGInOiAnNzAlJ1xuICAgICckZCc6IGFzQ29sb3IgJ3JnYmEoJGMsIDEpJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnc2NhbGUtY29sb3IoJGMsICRncmVlbjogJGEsICRibHVlOiAkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogJy00MCUnXG4gICAgJyRiJzogJzcwJSdcbiAgICAnJGMnOiBhc0NvbG9yICdyZ2IoMjAwLCAxNTAsIDE3MCknXG4gIH0pLmFzQ29sb3IoMjAwLCA5MCwgMjMwKVxuICBpdFBhcnNlcygnc2NhbGUtY29sb3IoJGQsICRncmVlbjogJGEsICRibHVlOiAkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogJy00MCUnXG4gICAgJyRiJzogJzcwJSdcbiAgICAnJGMnOiBhc0NvbG9yICdyZ2IoMjAwLCAxNTAsIDE3MCknXG4gICAgJyRkJzogYXNDb2xvciAncmdiYSgkYywgMSknXG4gIH0pLmFzQ29sb3IoMjAwLCA5MCwgMjMwKVxuXG4gIGl0UGFyc2VzKCdzcGluKCNGMDAsIDEyMCknKS5hc0NvbG9yKDAsIDI1NSwgMClcbiAgaXRQYXJzZXMoJ3NwaW4oI0YwMCwgMTIwKScpLmFzQ29sb3IoMCwgMjU1LCAwKVxuICBpdFBhcnNlcygnc3BpbigjRjAwLCAxMjBkZWcpJykuYXNDb2xvcigwLCAyNTUsIDApXG4gIGl0UGFyc2VzKCdzcGluKCNGMDAsIC0xMjApJykuYXNDb2xvcigwLCAwLCAyNTUpXG4gIGl0UGFyc2VzKCdzcGluKCNGMDAsIC0xMjBkZWcpJykuYXNDb2xvcigwLCAwLCAyNTUpXG4gIGl0UGFyc2VzKCdzcGluKEBjLCBAYSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BjJzogYXNDb2xvciAnI0YwMCdcbiAgICAnQGEnOiAnMTIwJ1xuICB9KS5hc0NvbG9yKDAsIDI1NSwgMClcbiAgaXRQYXJzZXMoJ3NwaW4oQGMsIEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiAnMTIwJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnc3BpbihAYywgQGEpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6ICcxMjAnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdzcGluKEBjLCBAYSwpJykuYXNVbmRlZmluZWQoKVxuXG4gIGl0UGFyc2VzKCdmYWRlKCNGMDAsIDAuNSknKS5hc0NvbG9yKDI1NSwgMCwgMCwgMC41KVxuICBpdFBhcnNlcygnZmFkZSgjRjAwLCA1MCUpJykuYXNDb2xvcigyNTUsIDAsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGUoI0YwMCwgNTApJykuYXNDb2xvcigyNTUsIDAsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGUoQGMsIEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGMnOiBhc0NvbG9yICcjRjAwJ1xuICAgICdAYSc6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMjU1LCAwLCAwLCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlKEBjLCBAYSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BhJzogJzAuNSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2ZhZGUoQGMsIEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiAnMC41J1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZmFkZShAYywgQGEsKScpLmFzVW5kZWZpbmVkKClcblxuICBpdFBhcnNlcygnY29udHJhc3QoI2JiYmJiYiknKS5hc0NvbG9yKDAsMCwwKVxuICBpdFBhcnNlcygnY29udHJhc3QoIzMzMzMzMyknKS5hc0NvbG9yKDI1NSwyNTUsMjU1KVxuICBpdFBhcnNlcygnY29udHJhc3QoI2JiYmJiYiwgcmdiKDIwLDIwLDIwKSknKS5hc0NvbG9yKDIwLDIwLDIwKVxuICBpdFBhcnNlcygnY29udHJhc3QoIzMzMzMzMywgcmdiKDIwLDIwLDIwKSwgcmdiKDE0MCwxNDAsMTQwKSknKS5hc0NvbG9yKDE0MCwxNDAsMTQwKVxuICBpdFBhcnNlcygnY29udHJhc3QoIzY2NjY2NiwgcmdiKDIwLDIwLDIwKSwgcmdiKDE0MCwxNDAsMTQwKSwgMTMlKScpLmFzQ29sb3IoMTQwLDE0MCwxNDApXG5cbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjYmJiYmJiJ1xuICB9KS5hc0NvbG9yKDAsMCwwKVxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyMzMzMzMzMnXG4gIH0pLmFzQ29sb3IoMjU1LDI1NSwyNTUpXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSwgQGRhcmspJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNiYmJiYmInXG4gICAgJ0BkYXJrJzogYXNDb2xvciAncmdiKDIwLDIwLDIwKSdcbiAgfSkuYXNDb2xvcigyMCwyMCwyMClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyaywgQGxpZ2h0KScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjMzMzMzMzJ1xuICAgICdAZGFyayc6IGFzQ29sb3IgJ3JnYigyMCwyMCwyMCknXG4gICAgJ0BsaWdodCc6IGFzQ29sb3IgJ3JnYigxNDAsMTQwLDE0MCknXG4gIH0pLmFzQ29sb3IoMTQwLDE0MCwxNDApXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSwgQGRhcmssIEBsaWdodCwgQHRocmVzaG9sZCknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnIzY2NjY2NidcbiAgICAnQGRhcmsnOiBhc0NvbG9yICdyZ2IoMjAsMjAsMjApJ1xuICAgICdAbGlnaHQnOiBhc0NvbG9yICdyZ2IoMTQwLDE0MCwxNDApJ1xuICAgICdAdGhyZXNob2xkJzogJzEzJSdcbiAgfSkuYXNDb2xvcigxNDAsMTQwLDE0MClcblxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSwgQGRhcmspJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyaywgQGxpZ2h0KScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSwgQGRhcmssIEBsaWdodCwgQHRocmVzaG9sZCknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdtdWx0aXBseSgjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjNjYyOTAwJylcbiAgaXRQYXJzZXMoJ211bHRpcGx5KEBiYXNlLCBAbW9kaWZpZXIpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNmZjY2MDAnXG4gICAgJ0Btb2RpZmllcic6IGFzQ29sb3IgJyM2NjY2NjYnXG4gIH0pLmFzQ29sb3IoJyM2NjI5MDAnKVxuICBpdFBhcnNlcygnbXVsdGlwbHkoQGJhc2UsIEBtb2RpZmllciknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdzY3JlZW4oI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignI2ZmYTM2NicpXG4gIGl0UGFyc2VzKCdzY3JlZW4oQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignI2ZmYTM2NicpXG4gIGl0UGFyc2VzKCdzY3JlZW4oQGJhc2UsIEBtb2RpZmllciknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdvdmVybGF5KCNmZjY2MDAsIDB4NjY2NjY2KScpLmFzQ29sb3IoJyNmZjUyMDAnKVxuICBpdFBhcnNlcygnb3ZlcmxheShAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjZmY1MjAwJylcbiAgaXRQYXJzZXMoJ292ZXJsYXkoQGJhc2UsIEBtb2RpZmllciknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdzb2Z0bGlnaHQoI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignI2ZmNWEwMCcpXG4gIGl0UGFyc2VzKCdzb2Z0bGlnaHQoQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignI2ZmNWEwMCcpXG4gIGl0UGFyc2VzKCdzb2Z0bGlnaHQoQGJhc2UsIEBtb2RpZmllciknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdoYXJkbGlnaHQoI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignI2NjNTIwMCcpXG4gIGl0UGFyc2VzKCdoYXJkbGlnaHQoQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignI2NjNTIwMCcpXG4gIGl0UGFyc2VzKCdoYXJkbGlnaHQoQGJhc2UsIEBtb2RpZmllciknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdkaWZmZXJlbmNlKCNmZjY2MDAsIDB4NjY2NjY2KScpLmFzQ29sb3IoJyM5OTAwNjYnKVxuICBpdFBhcnNlcygnZGlmZmVyZW5jZSgjZmY2NjAwLCkoKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdkaWZmZXJlbmNlKEBiYXNlLCBAbW9kaWZpZXIpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNmZjY2MDAnXG4gICAgJ0Btb2RpZmllcic6IGFzQ29sb3IgJyM2NjY2NjYnXG4gIH0pLmFzQ29sb3IoJyM5OTAwNjYnKVxuICBpdFBhcnNlcygnZGlmZmVyZW5jZShAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2V4Y2x1c2lvbigjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjOTk3YTY2JylcbiAgaXRQYXJzZXMoJ2V4Y2x1c2lvbihAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjOTk3YTY2JylcbiAgaXRQYXJzZXMoJ2V4Y2x1c2lvbihAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2F2ZXJhZ2UoI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignI2IzNjYzMycpXG4gIGl0UGFyc2VzKCdhdmVyYWdlKEBiYXNlLCBAbW9kaWZpZXIpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNmZjY2MDAnXG4gICAgJ0Btb2RpZmllcic6IGFzQ29sb3IgJyM2NjY2NjYnXG4gIH0pLmFzQ29sb3IoJyNiMzY2MzMnKVxuICBpdFBhcnNlcygnYXZlcmFnZShAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdhdmVyYWdlKEBncmFkaWVudC1iLCBAZ3JhZGllbnQtbWVhbiknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BncmFkaWVudC1hJzogYXNDb2xvciAnIzAwZDM4YidcbiAgICAnQGdyYWRpZW50LWInOiBhc0NvbG9yICcjMDA5Mjg1J1xuICAgICdAZ3JhZGllbnQtbWVhbic6IGFzQ29sb3IgJ2F2ZXJhZ2UoQGdyYWRpZW50LWEsIEBncmFkaWVudC1iKSdcbiAgfSkuYXNDb2xvcignIzAwYTI4NycpXG5cbiAgaXRQYXJzZXMoJ25lZ2F0aW9uKCNmZjY2MDAsIDB4NjY2NjY2KScpLmFzQ29sb3IoJyM5OWNjNjYnKVxuICBpdFBhcnNlcygnbmVnYXRpb24oQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignIzk5Y2M2NicpXG4gIGl0UGFyc2VzKCduZWdhdGlvbihAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2JsZW5kKHJnYmEoI0ZGREUwMCwuNDIpLCAweDE5QzI2MSknKS5hc0NvbG9yKCcjN2FjZTM4JylcbiAgaXRQYXJzZXMoJ2JsZW5kKEB0b3AsIEBib3R0b20pJykud2l0aENvbnRleHQoe1xuICAgICdAdG9wJzogYXNDb2xvciAncmdiYSgjRkZERTAwLC40MiknXG4gICAgJ0Bib3R0b20nOiBhc0NvbG9yICcweDE5QzI2MSdcbiAgfSkuYXNDb2xvcignIzdhY2UzOCcpXG4gIGl0UGFyc2VzKCdibGVuZChAdG9wLCBAYm90dG9tKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2NvbXBsZW1lbnQocmVkKScpLmFzQ29sb3IoJyMwMGZmZmYnKVxuICBpdFBhcnNlcygnY29tcGxlbWVudChAYmFzZSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAncmVkJ1xuICB9KS5hc0NvbG9yKCcjMDBmZmZmJylcbiAgaXRQYXJzZXMoJ2NvbXBsZW1lbnQoQGJhc2UpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoIzgwODA4MCknKS5hc0NvbG9yKDAsMCwwLDAuNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aWZ5KCM0MTQxNDEsIGJsYWNrKScpLmFzQ29sb3IoMjU1LDI1NSwyNTUsMC4yNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aWZ5KCM5MTk3NEMsIDB4RjM0OTQ5LCAwLjUpJykuYXNDb2xvcig0NywyMjksNzksMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoYSknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjODA4MDgwJ1xuICB9KS5hc0NvbG9yKDAsMCwwLDAuNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aWZ5KGEsIGIsIDAuNSknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjOTE5NzRDJ1xuICAgICdiJzogYXNDb2xvciAnI0YzNDk0OSdcbiAgfSkuYXNDb2xvcig0NywyMjksNzksMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoYSknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdyZWQoIzAwMCwgMjU1KScpLmFzQ29sb3IoMjU1LDAsMClcbiAgaXRQYXJzZXMoJ3JlZChhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMDAnXG4gICAgJ2InOiAnMjU1J1xuICB9KS5hc0NvbG9yKDI1NSwwLDApXG4gIGl0UGFyc2VzKCdyZWQoYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdncmVlbigjMDAwLCAyNTUpJykuYXNDb2xvcigwLDI1NSwwKVxuICBpdFBhcnNlcygnZ3JlZW4oYSwgYiknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjMDAwJ1xuICAgICdiJzogJzI1NSdcbiAgfSkuYXNDb2xvcigwLDI1NSwwKVxuICBpdFBhcnNlcygnZ3JlZW4oYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdibHVlKCMwMDAsIDI1NSknKS5hc0NvbG9yKDAsMCwyNTUpXG4gIGl0UGFyc2VzKCdibHVlKGEsIGIpJykud2l0aENvbnRleHQoe1xuICAgICdhJzogYXNDb2xvciAnIzAwMCdcbiAgICAnYic6ICcyNTUnXG4gIH0pLmFzQ29sb3IoMCwwLDI1NSlcbiAgaXRQYXJzZXMoJ2JsdWUoYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdhbHBoYSgjMDAwLCAwLjUpJykuYXNDb2xvcigwLDAsMCwwLjUpXG4gIGl0UGFyc2VzKCdhbHBoYShhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMDAnXG4gICAgJ2InOiAnMC41J1xuICB9KS5hc0NvbG9yKDAsMCwwLDAuNSlcbiAgaXRQYXJzZXMoJ2FscGhhKGEsIGIpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnaHVlKCMwMGMsIDkwZGVnKScpLmFzQ29sb3IoMHg2NiwweENDLDApXG4gIGl0UGFyc2VzKCdodWUoYSwgYiknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjMDBjJ1xuICAgICdiJzogJzkwZGVnJ1xuICB9KS5hc0NvbG9yKDB4NjYsMHhDQywwKVxuICBpdFBhcnNlcygnaHVlKGEsIGIpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnc2F0dXJhdGlvbigjMDBjLCA1MCUpJykuYXNDb2xvcigweDMzLDB4MzMsMHg5OSlcbiAgaXRQYXJzZXMoJ3NhdHVyYXRpb24oYSwgYiknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjMDBjJ1xuICAgICdiJzogJzUwJSdcbiAgfSkuYXNDb2xvcigweDMzLDB4MzMsMHg5OSlcbiAgaXRQYXJzZXMoJ3NhdHVyYXRpb24oYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdsaWdodG5lc3MoIzAwYywgODAlKScpLmFzQ29sb3IoMHg5OSwweDk5LDB4ZmYpXG4gIGl0UGFyc2VzKCdsaWdodG5lc3MoYSwgYiknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjMDBjJ1xuICAgICdiJzogJzgwJSdcbiAgfSkuYXNDb2xvcigweDk5LDB4OTksMHhmZilcbiAgaXRQYXJzZXMoJ2xpZ2h0bmVzcyhhLCBiKScpLmFzSW52YWxpZCgpXG5cbiAgZGVzY3JpYmUgJ0NTUyBjb2xvciBmdW5jdGlvbicsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnY3NzJ1xuXG4gICAgaXRQYXJzZXMoJ2NvbG9yKCNmZDBjYzcgdGludCg2NiUpKScpLmFzQ29sb3IoMjU0LCAxNzIsIDIzNilcbiAgICBpdFBhcnNlcygnQ09MT1IoI2ZkMGNjNyB0aW50KDY2JSkpJykuYXNDb2xvcigyNTQsIDE3MiwgMjM2KVxuICAgIGl0UGFyc2VzKCdjT2xPcigjZmQwY2M3IHRpbnQoNjYlKSknKS5hc0NvbG9yKDI1NCwgMTcyLCAyMzYpXG4gICAgaXRQYXJzZXMoJ2NvbG9yKHZhcigtLWZvbykgdGludCg2NiUpKScpLndpdGhDb250ZXh0KHtcbiAgICAgICd2YXIoLS1mb28pJzogYXNDb2xvciAnI2ZkMGNjNydcbiAgICB9KS5hc0NvbG9yKDI1NCwgMTcyLCAyMzYpXG5cbiAgZGVzY3JpYmUgJ2x1YSBjb2xvcicsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnbHVhJ1xuXG4gICAgaXRQYXJzZXMoJ0NvbG9yKDI1NSwgMCwgMCwgMjU1KScpLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygnQ29sb3IociwgZywgYiwgYSknKS53aXRoQ29udGV4dCh7XG4gICAgICAncic6ICcyNTUnXG4gICAgICAnZyc6ICcwJ1xuICAgICAgJ2InOiAnMCdcbiAgICAgICdhJzogJzI1NSdcbiAgICB9KS5hc0NvbG9yKDI1NSwwLDApXG4gICAgaXRQYXJzZXMoJ0NvbG9yKHIsIGcsIGIsIGEpJykuYXNJbnZhbGlkKClcblxuICAjICAgICMjIyMjIyMjICMjICAgICAgICMjICAgICAjI1xuICAjICAgICMjICAgICAgICMjICAgICAgICMjIyAgICMjI1xuICAjICAgICMjICAgICAgICMjICAgICAgICMjIyMgIyMjI1xuICAjICAgICMjIyMjIyAgICMjICAgICAgICMjICMjIyAjI1xuICAjICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuICAjICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuICAjICAgICMjIyMjIyMjICMjIyMjIyMjICMjICAgICAjI1xuXG4gIGRlc2NyaWJlICdlbG0tbGFuZyBzdXBwb3J0JywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdlbG0nXG5cbiAgICBpdFBhcnNlcygncmdiYSAyNTUgMCAwIDEnKS5hc0NvbG9yKDI1NSwwLDApXG4gICAgaXRQYXJzZXMoJ3JnYmEgciBnIGIgYScpLndpdGhDb250ZXh0KHtcbiAgICAgICdyJzogJzI1NSdcbiAgICAgICdnJzogJzAnXG4gICAgICAnYic6ICcwJ1xuICAgICAgJ2EnOiAnMSdcbiAgICB9KS5hc0NvbG9yKDI1NSwwLDApXG4gICAgaXRQYXJzZXMoJ3JnYmEgciBnIGIgYScpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygncmdiIDI1NSAwIDAnKS5hc0NvbG9yKDI1NSwwLDApXG4gICAgaXRQYXJzZXMoJ3JnYiByIGcgYicpLndpdGhDb250ZXh0KHtcbiAgICAgICdyJzogJzI1NSdcbiAgICAgICdnJzogJzAnXG4gICAgICAnYic6ICcwJ1xuICAgIH0pLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygncmdiIHIgZyBiJykuYXNJbnZhbGlkKClcblxuICAgIGl0UGFyc2VzKCdoc2xhIChkZWdyZWVzIDIwMCkgNTAgNTAgMC41JykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgICBpdFBhcnNlcygnaHNsYSAoZGVncmVlcyBoKSBzIGwgYScpLndpdGhDb250ZXh0KHtcbiAgICAgICdoJzogJzIwMCdcbiAgICAgICdzJzogJzUwJ1xuICAgICAgJ2wnOiAnNTAnXG4gICAgICAnYSc6ICcwLjUnXG4gICAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgICBpdFBhcnNlcygnaHNsYSAoZGVncmVlcyBoKSBzIGwgYScpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygnaHNsYSAzLjQ5IDUwIDUwIDAuNScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gICAgaXRQYXJzZXMoJ2hzbGEgaCBzIGwgYScpLndpdGhDb250ZXh0KHtcbiAgICAgICdoJzogJzMuNDknXG4gICAgICAncyc6ICc1MCdcbiAgICAgICdsJzogJzUwJ1xuICAgICAgJ2EnOiAnMC41J1xuICAgIH0pLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gICAgaXRQYXJzZXMoJ2hzbGEgaCBzIGwgYScpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygnaHNsIChkZWdyZWVzIDIwMCkgNTAgNTAnKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaHNsIChkZWdyZWVzIGgpIHMgbCcpLndpdGhDb250ZXh0KHtcbiAgICAgICdoJzogJzIwMCdcbiAgICAgICdzJzogJzUwJ1xuICAgICAgJ2wnOiAnNTAnXG4gICAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG4gICAgaXRQYXJzZXMoJ2hzbCAoZGVncmVlcyBoKSBzIGwnKS5hc0ludmFsaWQoKVxuXG4gICAgaXRQYXJzZXMoJ2hzbCAzLjQ5IDUwIDUwJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG4gICAgaXRQYXJzZXMoJ2hzbCBoIHMgbCcpLndpdGhDb250ZXh0KHtcbiAgICAgICdoJzogJzMuNDknXG4gICAgICAncyc6ICc1MCdcbiAgICAgICdsJzogJzUwJ1xuICAgIH0pLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdoc2wgaCBzIGwnKS5hc0ludmFsaWQoKVxuXG4gICAgaXRQYXJzZXMoJ2dyYXlzY2FsZSAxJykuYXNDb2xvcigwLCAwLCAwKVxuICAgIGl0UGFyc2VzKCdncmV5c2NhbGUgMC41JykuYXNDb2xvcigxMjcsIDEyNywgMTI3KVxuICAgIGl0UGFyc2VzKCdncmF5c2NhbGUgMCcpLmFzQ29sb3IoMjU1LCAyNTUsIDI1NSlcbiAgICBpdFBhcnNlcygnZ3JheXNjYWxlIGcnKS53aXRoQ29udGV4dCh7XG4gICAgICAnZyc6ICcwLjUnXG4gICAgfSkuYXNDb2xvcigxMjcsIDEyNywgMTI3KVxuICAgIGl0UGFyc2VzKCdncmF5c2NhbGUgZycpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygnY29tcGxlbWVudCByZ2IgMjU1IDAgMCcpLmFzQ29sb3IoJyMwMGZmZmYnKVxuICAgIGl0UGFyc2VzKCdjb21wbGVtZW50IGJhc2UnKS53aXRoQ29udGV4dCh7XG4gICAgICAnYmFzZSc6IGFzQ29sb3IgJ3JlZCdcbiAgICB9KS5hc0NvbG9yKCcjMDBmZmZmJylcbiAgICBpdFBhcnNlcygnY29tcGxlbWVudCBiYXNlJykuYXNJbnZhbGlkKClcblxuICAjICAgICMjICAgICAgICAgICMjIyAgICAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAgIyNcbiAgIyAgICAjIyAgICAgICAgICMjICMjICAgICAgIyMgICAgIyMgICAgICAgICMjICAgIyNcbiAgIyAgICAjIyAgICAgICAgIyMgICAjIyAgICAgIyMgICAgIyMgICAgICAgICAjIyAjI1xuICAjICAgICMjICAgICAgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMgICAgICAjIyNcbiAgIyAgICAjIyAgICAgICAjIyMjIyMjIyMgICAgIyMgICAgIyMgICAgICAgICAjIyAjI1xuICAjICAgICMjICAgICAgICMjICAgICAjIyAgICAjIyAgICAjIyAgICAgICAgIyMgICAjI1xuICAjICAgICMjIyMjIyMjICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjIyAjIyAgICAgIyNcblxuICBkZXNjcmliZSAnbGF0ZXggc3VwcG9ydCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAndGV4J1xuXG4gICAgaXRQYXJzZXMoJ1tncmF5XXsxfScpLmFzQ29sb3IoJyNmZmZmZmYnKVxuICAgIGl0UGFyc2VzKCdbcmdiXXsxLDAuNSwwfScpLmFzQ29sb3IoJyNmZjdmMDAnKVxuICAgIGl0UGFyc2VzKCdbUkdCXXsyNTUsMTI3LDB9JykuYXNDb2xvcignI2ZmN2YwMCcpXG4gICAgaXRQYXJzZXMoJ1tjbXlrXXswLDAuNSwxLDB9JykuYXNDb2xvcignI2ZmN2YwMCcpXG4gICAgaXRQYXJzZXMoJ1tIVE1MXXtmZjdmMDB9JykuYXNDb2xvcignI2ZmN2YwMCcpXG4gICAgaXRQYXJzZXMoJ3tibHVlfScpLmFzQ29sb3IoJyMwMDAwZmYnKVxuXG4gICAgaXRQYXJzZXMoJ3tibHVlITIwfScpLmFzQ29sb3IoJyNjY2NjZmYnKVxuICAgIGl0UGFyc2VzKCd7Ymx1ZSEyMCFibGFja30nKS5hc0NvbG9yKCcjMDAwMDMzJylcbiAgICBpdFBhcnNlcygne2JsdWUhMjAhYmxhY2shMzAhZ3JlZW59JykuYXNDb2xvcignIzAwNTkwZicpXG5cbiAgIyAgICAgIyMjIyMjIyAgIyMjIyMjIyNcbiAgIyAgICAjIyAgICAgIyMgICAgIyNcbiAgIyAgICAjIyAgICAgIyMgICAgIyNcbiAgIyAgICAjIyAgICAgIyMgICAgIyNcbiAgIyAgICAjIyAgIyMgIyMgICAgIyNcbiAgIyAgICAjIyAgICAjIyAgICAgIyNcbiAgIyAgICAgIyMjIyMgIyMgICAgIyNcblxuICBkZXNjcmliZSAncXQgc3VwcG9ydCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAncW1sJ1xuXG4gICAgaXRQYXJzZXMoJ1F0LnJnYmEoMS4wLDEuMCwwLDAuNSknKS5hc0NvbG9yKDI1NSwgMjU1LCAwLCAwLjUpXG5cbiAgZGVzY3JpYmUgJ3F0IGNwcCBzdXBwb3J0JywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdjcHAnXG5cbiAgICBpdFBhcnNlcygnUXQucmdiYSgxLjAsMS4wLDAsMC41KScpLmFzQ29sb3IoMjU1LCAyNTUsIDAsIDAuNSlcbiJdfQ==

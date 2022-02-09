import Render from './render';
import '../utils/htmlCanvasExtends.js';

export default class HTMLRender extends Render {
  constructor(width, height, {ratio}) {
    super(width, height);

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    //获取设备像素比 canvas画布扩大， 保证能够高清显示
    ratio = ratio || (devicePixelRatio / backingStoreRatio);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    canvas.style.transform = `scale(${1 / ratio})`;
    canvas.style.transformOrigin = 'left top';

    this.ratio = ratio;
    this.canvas = canvas;
    this.ctx = context;
  } 

  // 绘制 DIV 元素
  div ({y, x, css, _clipChildrenStart, _clipChildrenEnd }) {
    const { padding = [0,0,0,0], width, height, borderWidth = 0, radius = 0, backgroundColor, opacity, borderColor, borderStyle } = css || {}

    const r = radius
    const w = width + padding[1] + padding[3]
    const h = height + padding[0] + padding[2]

    const {ctx} = this;
    
    let fillStyle = backgroundColor
    if (Array.isArray(fillStyle)) {
      const gr =
        config.direction == 'vertical'
          ? ctx.createLinearGradient(0, 0, 0, config.css.layerHeight)
          : ctx.createLinearGradient(0, 0, config.css.layerWidth, 0);
      fillStyle.forEach(item => {
        gr.addColorStop(item.scale, item.val);
      });
      fillStyle = gr;
    }


    if(r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
    }

    if (_clipChildrenEnd) {
      ctx.restore()
    }

    ctx.save();
    ctx.fillStyle = fillStyle;
    if (opacity >= 0) {
      ctx.globalAlpha = opacity
    }
    ctx.beginPath();
    borderStyle == 'dashed' && ctx.setLineDash([1, 3]);
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    fillStyle && ctx.fill();
    borderWidth && ctx.stroke()
    ctx.closePath();
    ctx.restore();
    if (_clipChildrenStart) {
      ctx.save()
      ctx.clip()
    }


    return Promise.resolve(this);
  }

  // 绘制图片
  image ({ url, y, x, css, _clipChildrenEnd }) {

    let { width, height, radius, opacity } = css || {}
    const {ctx} = this;

    if (_clipChildrenEnd) {
      ctx.restore()
    }

    return new Promise((resolve, reject) => {
      ctx.save();
      if (radius) {
        this.div({x, y, css })
        ctx.clip();
      }
      const img = new Image();
      img.setAttribute('crossOrigin', 'Anonymous');
      img.onload = function() {
        if(!width && !height) {
          width = img.width;
          height = img.height;
        } else if(!width) {
          width = img.width / img.height * height;
        } else if(!height) {
          height = img.height / img.width * width;
        }
        if (opacity >= 0) {
          ctx.globalAlpha = opacity
        }
        ctx.drawImage(img, x, y, width, height);
        ctx.restore()
        resolve();
      }
      img.onerror = reject;
      img.src = url;
    })
  }

  // 绘制文字
  text({ text, x, y, css, _clipChildrenEnd }) {
    const { fontSize, lineHeight, color, textAlign, fontWeight, width, deorationLine } = css || {}
    const {ctx} = this;

    if (_clipChildrenEnd) {
      ctx.restore()
    }

    ctx.save();
    ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
    ctx.fillStyle = color;
    
    let translateX = 0
    if (textAlign === 'right') {
      translateX = width
    } else if (textAlign === 'center') {
      translateX = width / 2
    }
    ctx.textAlign = textAlign || 'left';
    ctx.textBaseline = 'middle'; // 适配安卓 ios 下的文字居中问题

    if (textAlign === 'justify') { //两端对齐
      y += lineHeight
      ctx.letterSpacingText(text, x, y, (width - (text.length * fontSize)) / (text.length - 1))
    } else {
      ctx.translate(translateX, -(lineHeight / 2)) // 适配安卓 ios 下的文字居中问题
      y += lineHeight
      ctx.fillText(text, x, y, width)
    }
    // 支持下划线
    if (deorationLine) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      y = deorationLine == 'line-through' ? y : y + fontSize / 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();
    }
    ctx.restore();
    return Promise.resolve(this);
  }

  // 绘制多行文字
  wrapText({ text = '', x, y, css, _clipChildrenEnd }) {
    const { fontSize, lineHeight, color, width, height, textAlign, fontWeight } = css || {}
    const {ctx} = this; 

    if (_clipChildrenEnd) {
      ctx.restore()
    }
    
    ctx.save();
    ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
    var arrText = text.split('');
    var line = '';
    var result = [];
    for (var n = 0; n < arrText.length; n++) {
      var testLine = line + arrText[n];
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > width && n > 0) {
        result.push({line, y, x});
        line = arrText[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    result.push({line, y, x});
    ctx.restore();

    result.forEach(({line: text, y, x}, idx) => {
      if(height && (idx + 1) * lineHeight > height) {
        return;
      }
      this.text({text, y, x, css: {fontSize, lineHeight, color, width, textAlign, fontWeight} });
    });
    return result;
  }
}
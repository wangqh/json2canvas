
import canvas from 'canvas';
import HTMLRender from './html';

/**
* @author zhangxinxu(.com)
* @licence MIT
* @description http://www.zhangxinxu.com/wordpress/?p=7362
*/
CanvasRenderingContext2D.prototype.letterSpacingText = function (text, x, y, letterSpacing) {
  var context = this
  var canvas = context.canvas

  if (!letterSpacing && canvas) {
    letterSpacing = parseFloat(window.getComputedStyle(canvas).letterSpacing)
  }
  if (!letterSpacing) {
    return this.fillText(text, x, y)
  }

  var arrText = text.split('')
  var align = context.textAlign || 'left'

  // 这里仅考虑水平排列
  var originWidth = context.measureText(text).width
  // 应用letterSpacing占据宽度
  var actualWidth = originWidth + letterSpacing * (arrText.length - 1)
  // 根据水平对齐方式确定第一个字符的坐标
  if (align === 'center') {
    x = x - actualWidth / 2
  } else if (align === 'right') {
    x = x - actualWidth
  }

  // 临时修改为文本左对齐
  context.textAlign = 'left'
  // 开始逐字绘制
  arrText.forEach(function (letter) {
    var letterWidth = context.measureText(letter).width
    context.fillText(letter, x, y)
    // 确定下一个字符的横坐标
    x = x + letterWidth + letterSpacing
  })
  // 对齐方式还原
  context.textAlign = align
}

const { createCanvas, loadImage } = canvas;

export default class NodeRender extends HTMLRender {
  constructor(width, height, {rate}) {
    super(width, height);

    const canvas = createCanvas(width, height);

    this.rate = rate;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  //图片
  image({url, top: y, left: x, width, height}) {
    [x, y, width, height] = [x, y, width, height].map(v => v * this.rate);

    const {ctx} = this;
    return new Promise((resolve, reject) => {
      ctx.save();
      loadImage(url).then(img => {
        ctx.drawImage(img, x, y, width, height);
        ctx.resolve();
      });
    })
  }
}
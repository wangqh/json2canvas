import Renders from './render';

const isNumber = function(num) {
  return typeof num === 'number' && !isNaN(num);
}

const isFunction = function(fn) {
  return typeof fn === 'function';
}

const formatCoord = function({top, left, width, height, right, bottom}, {width: canvasWidth, height: canvasHeight}) {
  if(isNumber(right) && isNumber(width)) {
    left = canvasWidth - width - right;
  }
  if(isNumber(bottom) && isNumber(height)) {
    top = canvasHeight - height - bottom;
  }
  return {top, left};
}

/**
 * 设置一些基础默认值
 *
 * @param {Object} config JSON配置
 * @returns {Object} 修改过的配置信息
 */
const setDefaultConfig = function (config) {
  config.css.padding = config.css.padding || [0, 0, 0, 0];
  config.css.textAlign = config.css.textAlign || 'left'
  // 给文字默认添加颜色,行高,最大宽度，配置
  if (config.type == 'text') {
    config.css.color = config.css.color || '#ffffff';
    if (!config.css.lineHeight) {
      let result = config.css.fontSize;
      if (result) {
        config.css.lineHeight = result;
      }
    }
    if (config.css.width) {
      config.css.maxWidth = config.css.maxWidth || config.css.width;
    }
  }
  if (config.children) {
    for (let item of config.children) {
      setDefaultConfig(item);
    }
  }
  return config;
}

/**
 * setInlineBlock 方法会将连续排列的 inline-block 节点聚合新建一个空白的 div 插入原先的位置然后将这些 inline-block 节点作为 children 插入其中
 *
 * @param {Object} config JSON配置
 * @returns {Object} 修改过的配置信息
 */
const setInlineBlock = function (config) {
  const arr = config.children;
  if (arr) {
    const common = []; // 二维数组整合成新的div
    const diffed = []; // 已经比较过相同的下次不进行比较
    for (let i = 0; i < arr.length; i++) {
      if (diffed.includes(i)) {
        continue;
      }
      let start = i;
      let row = [i];
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].css.display == 'inline-block' && arr[j].css.display == 'inline-block' && j == start + 1) {
          row.push(j);
          start = j;
        }
      }
      if (row.length > 1) {
        diffed.push(...row);
        common.push(row);
      } else {
        common.push(start);
      }
    }
    // 重新递归构建结构
    const newChildren = common.map(item => {
      if (Array.isArray(item)) {
        const obj = {
          type: 'div',
          css: {
            padding: [0, 0, 0, 0],
            textAlign: config.css.textAlign
          },
          children: item.map(d => setInlineBlock(arr[d])),
        };
        return obj;
      }
      return setInlineBlock(arr[item]);
    });
    config.children = newChildren;
  }
  return config;
}

//计算完的 width，height 会结合 margin，border 等 css 属性再次计算各种盒模型宽。
const addBoxWidth = function (element, boxWidth) {
  element.css.boxWidth = boxWidth;
}
const addLayerWidth = function (element, layerWidth) {
  element.css.layerWidth = layerWidth;
}
const addBoxHeight = function (element, boxHeight) {
  element.css.boxHeight = boxHeight;
}
const addLayerHeight = function (element, layerHeight) {
  element.css.layerHeight = layerHeight;
}

/**
 * 获取文本宽度
 * @param {Object} words 文本字符串
 * @param {Object} option JOSN中的文本配置
 * @param {Object} ctx canvas context
 * @returns {Object} 文本宽高对象
 */
const getTextWidth = function (words, option, ctx) {
  let { fontSize, fontWeight, width } = option.css || {};
  ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
  width = width || ctx.measureText(words).width;
  return width;
}

/**
 * 获取文本宽高/或者执行文本绘制
 * @param {Object} option JOSN中的文本配置
 * @param {Object} ctx canvas context
 * @param {Function} drawText 绘制文本方法
 * @returns {Object} 文本宽高对象
 */
let render = null
const getText = function (option, renderType = 'html') {
  const Render = isFunction(renderType) ? renderType : (Renders[renderType] || Renders.html);
  render = render || new Render(10000,  10000, {});
  const ctx = render.ctx;
  // coolzjy@v2ex 提供的正则 https://regexr.com/4f12l 优化可断行的位置
  const pattern = /\b(?![\u0020-\u002F\u003A-\u003F\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F\uFF00-\uFF1F])|(?=[\u2E80-\u2FFF\u3040-\u9FFF])/g;
  let fillText = '';
  let fillTop = option.css.lineHeight; // 返回实际换行后的高度
  let fillWidth = 0; // 返回实际换行后的宽度
  let lineNum = 1;
  //利用正则获取可断行的下标
  let breakLines = [];
  if (!option.text) {
    return {
      width: fillWidth,
      height: fillTop
    }
  }
  option.text.replace(pattern, function() {
    breakLines.push(arguments[arguments.length - 2] - 1);
  });
  let tempBreakLine = 0; // 此时换行的下标
  // 一个字一个子加
  for (let i = 0; i < option.text.length; i++) {
    if (breakLines.indexOf(i) !== -1) {
      tempBreakLine = i - 1;
    }
    fillText += [option.text[i]];
    // 支持 \n 换行
    if (getTextWidth(fillText, option, ctx) > option.css.maxWidth || option.text[i].charCodeAt(0) === 10) {
      let tempText = '';
      //最大行数限制
      if (lineNum === option.lineClamp && i !== option.text.length) {
        tempText = fillText.substring(0, fillText.length - 2) + '...';
        fillText = '';
      } else {
        if (tempBreakLine === i || option.text[i].charCodeAt(0) === 10) {
          tempText = fillText;
          fillText = '';
        } else {
          tempText = fillText.substring(0, fillText.length - (i - tempBreakLine));
          fillText = fillText.substring(fillText.length - (i - tempBreakLine), fillText.length);
        }
      }

      if (option.text[i].charCodeAt(0) === 10) {
        tempText = tempText.substring(0, tempText.length - 1);
      }

      if (lineNum === option.lineClamp && i !== option.text.length) {
        break;
      }
      fillTop += option.css.lineHeight || 0;
      const width = getTextWidth(tempText, option, ctx);
      if (width > fillWidth) {
        fillWidth = width;
      }
      lineNum++;
    }
  }
  if (fillText) {
    const width = getTextWidth(fillText, option, ctx);
    if (width > fillWidth) {
      fillWidth = width;
    }
  }

  return {
    width: fillWidth,
    height: fillTop
  };
}

/**
 *  计算所有节点的宽
 *
 * @param {Object} config 当前节点JSON配置
 * @param {Object} parent 父节点配置
 * @param {Object} ctx canvas context
 * @returns {Object} 修改过的配置信息
 */
const setWidth = function (config, parent) {
  const borderWidth = config.css && config.css.borderWidth ? config.css.borderWidth * 2 : 0
  const paddingWidth = config.css && config.css.padding ? config.css.padding[1] + config.css.padding[3] : 0
  // 文字可能没有宽 ，图片一定要有宽高, 宽度有最大值和继承父的宽度限定边界
  const children = config.children;
  if (!config.css.width) {
    if (config.type == 'text') {
      const { fontSize, fontWeight } = config.css
      let width = getText(config).width;
      if (parent && width > parent.css.width) {
        width = parent.css.width;
      }
      if (config.css.maxWidth) {
        width = Math.max(config.css.maxWidth, width);
      }
      config.css.width = width;
    }
    // div含有字节点继承父节点的宽度
    if (config.type == 'div' && parent && config.css.display !== 'inline-block') {
      config.css.width = parent.css.width - borderWidth - paddingWidth;
      if (config.children) {
        config.children.forEach(element => {
          setWidth(element, config);
        });
      }
    } else if (children) {
      config.css.width = children.reduce((sum, item) => {
        const res = setWidth(item, config);
        return sum + res.css.width;
      }, 0);
    }
  } else if (children) {
    children.forEach(element => {
      setWidth(element, config);
    });
  }
  const boxWidth = config.css.width + borderWidth + paddingWidth;
  const layerWidth = boxWidth + (config.css.marginLeft || 0) + (config.css.marginRight || 0);
  addBoxWidth(config, boxWidth);
  addLayerWidth(config, layerWidth);
  return config;
}

/**
 *  计算所有节点的高
 *
 * @param {Object} config 当前节点JSON配置
 * @param {Object} ctx canvas context
 * @returns {Object} 修改过的配置信息
 */
const setHeight = function (config) {
  const children = config.children;
  if (!config.css.height) {
    if (config.type == 'text') {
      config.css.height = getText(config).height;
    }
    // div含有子节点继承父节点的高度 行内元素取行内元素里面的最大高度
    else if (children) {
      let inlineBlockMax = 0;
      let height = children.reduce((sum, item) => {
        if (item.css.display !== 'inline-block') {
          const res = setHeight(item);
          return sum + res.css.layerHeight;
        } else {
          inlineBlockMax = Math.max(inlineBlockMax, setHeight(item).css.height);
          return sum;
        }
      }, 0);
      config.css.height = height + inlineBlockMax;
    }
  } else if (children) {
    children.forEach(element => {
      setHeight(element);
    });
  }
  let boxHeight = config.css.borderWidth ? config.css.height + config.css.borderWidth * 2 : config.css.height;
  boxHeight = config.css.padding ? boxHeight + config.css.padding[0] + config.css.padding[2] : boxHeight;
  const layerHeight = boxHeight + (config.css.marginTop || 0) + (config.css.marginBottom || 0);
  addBoxHeight(config, boxHeight);
  addLayerHeight(config, layerHeight);
  return config;
}

/**
 *  计算所有节点的位置 x,y
 *
 * @param {Object} config 当前节点JSON配置
 * @returns {Object} 修改过的配置信息
 */
const setOrigin = function (config) {
  const children = config.children;
  const borderWidth = config.css.borderWidth || 0
  const padding = config.css.padding
  config._clipChildrenStart = !!config.css.radius
  if (children) {
    let prev = {}; //上一个相邻节点的位置
    const childrenWidth = children.reduce((sum, item) => {
      return sum + item.css.layerWidth
    }, 0)
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      if (prev._clipChildrenStart) {
        item._clipChildrenEnd = true
      }
      item.x = (item.css.marginLeft || 0);
      item.y = (item.css.marginTop || 0);
      // 父节点下的第一个元素相对于父节点0，0
      if (i == 0) {
        item.x += config.x + borderWidth + padding[3];
        item.y += config.y + borderWidth + padding[0];
      } else if (item.css.position === 'absolute') {
        item.x += config.x + borderWidth + (item.css.left || 0);
        item.y += config.y + borderWidth + (item.css.top || 0);
      } else {
        // first block
        if (item.css.display !== 'inline-block' || prev.css.display !== 'inline-block') {
          item.x += config.x + borderWidth + padding[3];
          item.y += prev.y + prev.css.boxHeight + (prev.css.marginBottom||0);
        } else {// 第二个+ inline-block
          item.x += prev.x + prev.css.boxWidth + (prev.css.marginRight||0);
          item.y += config.y;
        }
      }
      if (i == 0 && config.css.textAlign === 'center' && item.type === 'text') {
        item.x += (config.css.width - childrenWidth) / 2
      }
      prev = item;
      setOrigin(item);
    }
    return config;
  }
}

export default {
  getTextWidth,
  isNumber,
  isFunction,
  formatCoord,
  setDefaultConfig,
  setInlineBlock,
  setWidth,
  setHeight,
  setOrigin
};
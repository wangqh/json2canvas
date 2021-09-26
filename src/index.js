import Render from './render/render';
import Renders from './render';
import utils from './helper';
const {
  isFunction,
  setDefaultConfig,
  setInlineBlock,
  setWidth,
  setHeight,
  setOrigin,
} = utils;

function generator({ ratio, render = 'html', config }) {
  const defaultConfig = setDefaultConfig(config || {});
  const inlineBlockConfig = setInlineBlock(defaultConfig);
  const widthConfig = setWidth(inlineBlockConfig, null);
  const heightConfig = setHeight(widthConfig);
  const originConfig = setOrigin(heightConfig);
  const Render = isFunction(render) ? render : (Renders[render] || Renders.html);
  const width = widthConfig.css.layerWidth || 200
  const height = heightConfig.css.layerHeight || 100
  render = new Render(width,  height, {ratio});

  const { canvas } = render

  canvas.ratio = render.ratio


  const processes = drawCanvas([originConfig], render)

  return processes.then(() => canvas);
}

function drawCanvas (elements, render) {
  return elements.reduce((defer, opt) => {
    return defer
      .then(() => {
        if(isFunction(opt.type)) {
          return opt.type.call(render, opt);
        } else if(isFunction(render[opt.type])) {
          return render[opt.type](opt);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        if (Array.isArray(opt.children)) {
          return drawCanvas(opt.children, render)
        } else {
          return Promise.resolve()
        }
      })
  }, Promise.resolve());
}

generator.Render = Render;
generator.Renders = Renders;
generator.utils = utils;

export default generator;
# html-json2canvas

基于类 html 语法的 JSON 配置，使用 Canvas 绘制网页界面；
在线示例： <https://json2canvas.netlify.app/>

## 安装

You can install it with npm or `<script>`:

```bash
npm install html-json2canvas
```

```html
<script src="./dist/json2canvas.umd.min.js"></script>
```

## 用法

```js
const json2canvas = require("json2canvas");
const options = {
  ratio: 2,
  config: {
    type: "div",
    x: 0,
    y: 0,
    css: {
      width: 200,
      radius: 10,
    },
    children: [
      {
        type: "div",
        css: {
          padding: [8, 16, 8, 16],
          backgroundColor: "#268dff",
          opacity: 0.7,
          textAlign: "center",
        },
        children: [
          {
            type: "text",
            text: "我是标题",
            css: {
              lineHeight: 20,
              display: "inline-block",
              color: "#fff",
              fontSize: 14,
            },
          },
        ],
      },
      {
        type: "div",
        css: {
          padding: [6, 8, 6, 8],
          backgroundColor: "#FFF",
          opacity: 0.7,
        },
        children: [
          {
            type: "div",
            css: {
              padding: [5, 0, 5, 0],
            },
            children: [
              {
                type: "text",
                text: "我是Label：",
                css: {
                  width: 80,
                  color: "#1f1f1f",
                  fontSize: 13,
                  lineHeight: 20,
                  textAlign: "right",
                  display: "inline-block",
                },
              },
              {
                type: "text",
                text: "我是Value",
                css: {
                  color: "#1f1f1f",
                  fontSize: 13,
                  lineHeight: 20,
                  display: "inline-block",
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

(async () => {
  const canvas = await json2canvas(options);

  document.body.appendChild(canvas);
})();
```

## 参数配置

| name   | required | default  | description               |
| ------ | :------: | :------: | ------------------------- |
| config |    ✔️    |    {}    | canvas elements config    |
| width  |          | 自动计算 | canvas width              |
| height |          | 自动计算 | canvas height             |
| ratio  |          | 自动计算 | canvas pixel ratio        |
| render |          |  'html'  | canvas render: html, node |

### Elements JSON Schema

#### div

```js
{
  type: 'div',
  x: 0, // 仅限根元素，子元素自动计算
  y: 0, // 仅限根元素，子元素自动计算
  css: {
    width: 200,
    radius: 10,
    padding: [8, 16, 8, 16],
    backgroundColor: '#268dff',
    opacity: 0.7,
    textAlign: 'center'
  },
  children: []
}
```

#### image

```js
{
  type: 'image',
  url: '', // 支持跨域图片
  css: {
    width: 200,
    height: 100,
    radius: 10,
    opacity: 0.7
  }
}
```

#### text

```js
{
  type: 'text',
  text: '',
  css: {
    color: '#1f1f1f',
    fontSize: 14,
    lineHeight: 20,
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  }
}
```

#### wrapText

```js
{
  type: 'wrapText',
  text: '',
  css: {
    color: '#1f1f1f',
    fontSize: 14,
    width: 200, // 到宽度边界时换行
    height: 80, // 超过高度的文字会被截掉
    lineHeight: 20,
    lineClamp: 2, // 文字超过两行结尾追加"..."
    textAlign: 'right',
    display: 'inline-block'
  }
}
```

#### custom function

```js
{
  type: function ({ x, y, url, css }) {
    const { ctx, canvas, ratio } = this
  },
  x: 0,
  y: 0,
  url: '',
  // text: '',
  css: {}
}
```
> 自定义函数类型：可使用canvas API自由绘制一些基本类型不能满足的或者复杂的元素

## Example

启动本地服务： http://localhost:3000

在线示例: <https://json2canvas.netlify.app/>

## License

json2canvas is released under the MIT license.

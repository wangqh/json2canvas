# html-json2canvas
Generate image with json data by canvas https://json2canvas.netlify.com/

## Installation

You can install it with npm or `<script>`:

```bash
npm install html-json2canvas --save-dev
```

```html
<script src="https://unpkg/json2canvas/dist/json2canvas.umd.min.js"></script>
```

## Usage

```js
const json2canvas = require('json2canvas');
const options = {
  ratio: 2,
  config: {
    type: 'div',
    x: 0,
    y: 0,
    css: {
      width: 200,
      radius: 10
    },
    afterClip: true,
    children: [
      {
        type: 'div',
        css: {
          padding: [8, 16, 8, 16],
          backgroundColor: '#268dff',
          opacity: 0.7,
          textAlign: 'center'
        },
        children: [
          {
            type: 'text',
            text: '工程记录示例',
            css: {
              lineHeight: 20,
              display: 'inline-block',
              color: '#fff', fontSize: 14
            }
          }
        ]
      },
      {
        type: 'div',
        css: {
          padding: [6, 8, 6, 8],
          backgroundColor: '#FFF',
          opacity: 0.7
        },
        children: [
          {
            type: 'div',
            css: {
              padding: [5, 0, 5, 0]
            },
            children: [
              {
                type: 'text',
                text: '拍摄时间：',
                css: {
                  width: 80,
                  color: '#1f1f1f', fontSize: 13, lineHeight: 20, textAlign: 'right', display: 'inline-block'
                }
              },
              {
                type: 'text',
                text: '2021-09-09 19:27',
                css: {
                  color: '#1f1f1f', fontSize: 13, lineHeight: 20, display: 'inline-block'
                }
              }
            ]
          }
        ]
      },
      {
        type: 'div',
        css: {
          padding: [8, 16, 8, 16],
          backgroundColor: '#268dff',
          opacity: 0.7,
          textAlign: 'center'
        },
        children: [
          {
            type: 'text',
            text: '施工区域示例',
            css: {
              lineHeight: 20,
              display: 'inline-block',
              color: '#fff', 
              fontSize: 14
            }
          }
        ]
      }
    ]
  }
};

(async() => {
  const canvas = await json2canvas(options);
  
  document.body.appendChild(canvas);
})();
```

## Configuration

| name | required | default | description |
|------|:----------:|:---------:|-------------|
| width | | | canvas init width |
| height | | | canvas init height |
| ratio | | 1 | canvas pixel ratio |
| render | | 'html' | canvas render |
| config | ✔️ | [] | canvas elements config |

### Elements Configuration

#### div

- `top`
- `left`
- `width`
- `height`
- `fill`
- `round`

#### image

- `top`
- `left`
- `width`
- `height`
- `url`

#### text

- `top`
- `left`
- `fontSize`
- `lineHeight`
- `text`
- `color`
- `textAlign`
- `fontWeight`

## Example
run npm start and open http://localhost:3000

online example: https://json2canvas.netlify.com/

## License
json2canvas is released under the MIT license.
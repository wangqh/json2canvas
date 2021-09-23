# json2canvas
Generate image with json data by canvas https://json2canvas.netlify.com/

## Installation

You can install it with npm or `<script>`:

```bash
npm install json2canvas --save-dev
```

```html
<script src="https://unpkg/json2canvas/dist/json2canvas.umd.min.js"></script>
```

## Usage

```js
const json2canvas = require('json2canvas');
const options = {
  width: 360,
  height: 360,
  rate: 2,
  elements: [
    {
      type: 'rect',
      width: 360,
      height: 360,
      top: 0,
      left: 0,
      fill: '#FFF'
    },
    {
      type: 'text',
      text: 'Hello World!',
      top: 10, 
      left: 10,
      fontSize: 18,
      lineHeight: 18,
      color: 'black'
    }
  ]
};

(async() => {
  const canvas = await json2canvas(options);
  
  const img = document.createElement('img');
  img.style.width = options.width + 'px';
  img.style.height = options.height + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();
```

## Configuration

| name | required | default | description |
|------|:----------:|:---------:|-------------|
| width | ✔️ | | canvas width |
| height | ✔️ | | canvas height |
| rate | | 1 | canvas pixel ratio |
| render | | 'html' | canvas render |
| elements | | [] | canvas elements |

### Elements Configuration

#### rect

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
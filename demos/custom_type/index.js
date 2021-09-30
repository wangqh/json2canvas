const options = {
  ratio: 3,
  config: {
    type: 'div',
    x: 0,
    y: 0,
    css: {
      width: 360,
      height: 564,
      backgroundColor: '#0091f9'
    },
    children: [
      {
        type: 'image',
        url: 'https://i.loli.net/2021/09/30/cLDigyqCkVfxNvj.png', 
        css: {
          width: 360, height: 166
        }
      },
      {
        type: 'div',
        css: {
          width: 330, height: 379, backgroundColor: '#FFF', radius: 7,
          left: 15,
          top: 50,
          position: 'absolute'
        },
        children: [
          //谣言卡片上半部分的蓝色背景
          {
            type: 'image',
            url: 'https://p5.ssl.qhimg.com/t01d6f520aa46d3306f.png',
            css: {
              width: 330,
              height: 160,
            }
          },
          //标题上方图片
          {
            type: 'image',
            url: 'https://p2.ssl.qhimg.com/t01435ac27bbe17c70e.png', 
            css: {
              height: 48,
              position: 'absolute',
              top: 30,
              left: 12
            }
          },
          //标题
          {
            type: 'wrapText', 
            text: '钟南山预测3月多数省份将解除限制？',
            css: {
              width: 306, 
              height: 40,
              marginTop: 12,
              marginLeft: 12,
              fontSize: 15, 
              fontWeight: 600, 
              lineHeight: 20, 
              color: '#FFF', 
            },
            y: 140, 
            x: 27, 
          },
          //印章图片
          {
            type: 'image',
            url: 'https://p4.ssl.qhimg.com/t019749f5c7ef94d271.png',
            css: {
              width: 100, 
              height: 100, 
              position: 'absolute',
              top: 12,
              left: 218
            }, 
            y: 62, 
            x: 233
          },
          //简介
          {
            type: 'wrapText',
            text: '近日，网上流传“钟南山院士有望初步对各地解除限制作预测”，提及：3月10日到25日前后，大多数省份将解除限制，4月15日前后湖北也将解除限制。事实上钟南山院士没这么说过，现阶段全国各省（市）依然采取严格防疫措施，具体恢复时间，属地相关部门会第一时间告知公众。',
            css: {
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 20,
              color: '#222',
              width: 306,
              height: 160,
              marginTop: 60,
              marginLeft: 12,
            },
            y: 222,
            x: 27
          },
          //查证者
          {
            type: 'text',
            text: '查证者：互联网联合辟谣平台',
            css: {
              fontSize: 11,
              lineHeight: 11,
              color: '#888',
              width: 320,
              textAlign: 'right',
              marginTop: 12
            }
          },
        ]
      },
      // 快资讯logo
      {
        type: 'image',
        url: 'https://p1.ssl.qhimg.com/t01c2572a1effaa3fa8.png',
        css: {
          width: 60,
          height: 15,
          marginTop: 55,
          marginLeft: 15
        },
        left: 15,
        top: 484
      },
      {
        type: 'text',
        text: '长按识别二维码，查询辟谣+获取更多信息',
        css: {
          fontSize: 10,
          color: '#fff',
          lineHeight: 13,
          marginTop: 7,
          marginLeft: 15
        },
        left: 15,
        top: 506
      },
      // 二维码遮罩
      {
        type: 'div',
        css: {
          width: 87,
          height: 87,
          backgroundColor: '#FFF',
          position: 'absolute',
          left: 258,
          top: 446
        },
        y: 446,
        x: 258,
      },
      {
        type: 'image',
        url: 'https://p5.ssl.qhimg.com/t01c58db0f47ae4c594.png',
        // y: 448,
        // x: 260,
        css: {
          width: 83,
          height: 83,
          position: 'absolute',
          left: 260,
          top: 448
        }
      },
    ]
  }
};
  
(async () => {
  const canvas = await json2canvas(options);
  const img = document.createElement('img');
  img.style.width = canvas.width / canvas.ratio + 'px';
  img.style.height = canvas.height / canvas.ratio + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();
const templateId = 'testwet234234324'
const watermarkStyle = {
  width: 300,
  opacity: 0.7,
  themeColor: '#268dff'
}
const watermarkItemList = [
  {
    code: 'title',
    label: '工程记录',
    value: '工程记录2'
  },
  {
    code: 'location',
    label: '施工区域',
    value: '一楼卫生间'
  },
  {
    code: 'location2',
    label: '施工区域2',
    value: '二楼卫生间'
  },
  {
    code: 'time',
    label: '拍摄时间',
    value: '2021-09-10 17：34'
  }
];

function getWatermarkTemplateConfigById (id) {
  return {
    type: 'div',
    x: 0,
    y: 0,
    themeColorCss: ['backgroundColor'],
    resettableCss: ['width'],
    css: {
      width: 300,
      radius: 20
    },
    afterClip: true,
    children: [
      {
        type: 'div',
        resettableCss: ['backgroundColor', 'opacity'],
        css: {
          padding: [5, 16, 5, 16],
          backgroundColor: '#268dff',
          opacity: 0.5,
          textAlign: 'center'
        },
        itemType: 'group',
        itemGroupOrder: 1,
        itemMaxCount: 1,
        children: [
          {
            type: 'text',
            itemCode: 'title',
            itemType: 'value',
            text: '工程记录示例',
            css: {
              lineHeight: 30,
              display: 'inline-block',
              color: '#fff', fontSize: 18
            }
          }
        ]
      },
      {
        type: 'div',
        resettableCss: ['opacity'],
        css: {
          padding: [5, 16, 5, 16],
          backgroundColor: '#FFF',
          opacity: 0.5
        },
        itemType: 'group',
        itemGroupOrder: 2,
        itemMaxCount: 100,
        children: [
          {
            type: 'div',
            css: {
              padding: [5, 8, 5, 8]
            },
            children: [
              {
                type: 'text',
                itemCode: 'time',
                itemType: 'label',
                text: '拍摄时间：',
                css: {
                  width: 80,
                  color: '#fff', fontSize: 14, lineHeight: 20, textAlign: 'right', display: 'inline-block'
                }
              },
              {
                type: 'text',
                itemCode: 'time',
                itemType: 'value',
                text: '2021-09-09 19:27',
                css: {
                  color: '#fff', fontSize: 14, lineHeight: 20, display: 'inline-block'
                }
              }
            ]
          }
        ]
      },
      {
        type: 'div',
        resettableCss: ['backgroundColor', 'opacity'],
        css: {
          padding: [5, 16, 5, 16],
          backgroundColor: '#268dff',
          opacity: 0.5,
          textAlign: 'center'
        },
        itemType: 'group',
        itemGroupIsLast: true,
        itemGroupOrder: 3,
        itemMaxCount: 1,
        children: [
          {
            type: 'text',
            itemCode: 'location',
            itemType: 'value',
            text: '施工区域示例',
            css: {
              lineHeight: 30,
              display: 'inline-block',
              color: '#fff', 
              fontSize: 18
            }
          }
        ]
      }
    ]
  };
}

function custom(ctx, config) {
  ctx.save()
  ctx.beginPath();
  const offsetX1 = (config.css.marginLeft || 0) + config.css.padding[3];
  const offsetX2 = (config.css.marginRight || 0) + config.css.padding[1];
  const offsetY1 = (config.css.marginTop || 0) + config.css.padding[0];
  const offsetY2 = (config.css.marginBottom || 0) + config.css.padding[2];
  ctx.moveTo(config.x - offsetX1, config.y - offsetY1);
  ctx.lineTo(config.x - offsetX1, config.y + config.css.height + offsetY2);
  ctx.lineTo(config.x + config.css.width + offsetX2, config.y + config.css.height + offsetY2);
  ctx.lineTo(config.x + config.css.width + offsetX2, config.y - offsetY1);
  ctx.lineTo(config.x - offsetX1, config.y - offsetY1);
  
  if (this.boxShow) {
    ctx.strokeStyle = "#fff"
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore()
  
}

function setWatermarkConfig (templateConfig) {
  const styleConfig = setWatermarkTemplateStyleConfig(templateConfig, watermarkStyle)
  const itemsConfig = setWatermarkItemsConfig(styleConfig, watermarkItemList)
  return itemsConfig
}

function setWatermarkTemplateStyleConfig (templateConfig, watermarkStyle) {
  if (!templateConfig) {
    return null
  }

  if (watermarkStyle.themeColor && templateConfig.themeColorCss) {
    templateConfig.themeColorCss
      .forEach(cssProp => {
        watermarkStyle[cssProp] = watermarkStyle.themeColor
      })
  }


  recursionSetWatermarkTemplateStyle(templateConfig)
  
  function recursionSetWatermarkTemplateStyle (templateConfig) {
    if (Array.isArray(templateConfig.resettableCss)) {
      templateConfig.resettableCss.forEach(cssProp => {
        if (watermarkStyle[cssProp]) {
          templateConfig.css[cssProp] = watermarkStyle[cssProp]
        }
      })
    }
  
    templateConfig.children && templateConfig.children.forEach(
      config => {
        recursionSetWatermarkTemplateStyle(config)
      }
    )
  }

  return templateConfig
}


function setWatermarkItemsConfig (templateConfig, watermarkItemList) {
  if (!templateConfig) {
    return null
  }
  const itemGroupList = recursionGetWatermarkTemplateItemGroupsConfig(templateConfig)
    .sort((a, b) => a.itemGroupOrder - b.itemGroupOrder)
  const lastItemGroup = itemGroupList.pop()
  const lastItemGroupIsLimit = lastItemGroup.itemMaxCount === 1

  if (lastItemGroupIsLimit && watermarkItemList.length >= itemGroupList.length) {
    resetWatermarkTemplateItems(lastItemGroup, [watermarkItemList.pop()])
  }


  itemGroupList.forEach((group) => {
    if (!group.children || !group.children.length) {
      return
    }
    const groupItemsData = watermarkItemList.splice(0, group.itemMaxCount)

    resetWatermarkTemplateItems(group, groupItemsData)
  })
  
  
  return templateConfig
}

function recursionGetWatermarkTemplateItemGroupsConfig (templateConfig) {

  const itemGroupList = []
  const tmpStack = []
  tmpStack.unshift(templateConfig)

  while (tmpStack.length) {
    const activeConfig = tmpStack.pop()
    if (activeConfig.itemType === 'group') {
      itemGroupList.push(activeConfig)
    }
    activeConfig.children && activeConfig.children.forEach(
      config => {
        tmpStack.unshift(config)
      }
    )
  }

  return itemGroupList
}

function resetWatermarkTemplateItems (group, itemsData) {
  const newGroupChildren = []
  const groupChildren = group.children
  
  itemsData.forEach(itemData => {
    let itemConfig = []
    let itemRowConfig = []
    if (groupChildren[0].type === 'text') {
      itemConfig = resetItemConfig(groupChildren, itemData)
      newGroupChildren.push(...itemConfig)
    } else if (groupChildren[0].children[0].type === 'text') {
      itemConfig = resetItemConfig(groupChildren[0].children, itemData)
      itemRowConfig = {
        ...groupChildren[0],
        children: itemConfig
      }
      newGroupChildren.push(itemRowConfig)
    }
  })
  group.children = newGroupChildren
}

function resetItemConfig (itemConfig, itemData) {
  return itemConfig.map(item => {
    let text = itemData[item.itemType]
    if (item.itemType === 'label') {
      text += '：'
    }
    const css = { ...item.css }
    return {
      ...item,
      css,
      text
    }
  })
}


(async () => {
  const templateConfig = getWatermarkTemplateConfigById(templateId);
  const config = setWatermarkConfig(templateConfig)
  const options = {
    width: 300,
    height: 400,
    config
  }
  const canvas = await json2canvas(options);
  document.body.appendChild(canvas);

})();
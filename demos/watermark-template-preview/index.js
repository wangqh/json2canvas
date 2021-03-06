const layoutTemplateId = 'testwet234234324'
const watermarkTemplateStyle = {
  width: 194,
  opacity: 0.5,
  themeColor: '#268dff'
}
const watermarkTemplateItemList = [
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
    value: '2021-09-10 17:34'
  },
  {
    code: 'time',
    label: '拍摄时间',
    value: '2021-09-10 17:34'
  }
];

function getWatermarkLayoutById (id) {
  return {
    type: 'div',
    x: 0,
    y: 0,
    themeColorCss: ['backgroundColor'],
    resettableCss: ['width'],
    css: {
      width: 194,
      radius: 2
    },
    children: [
      {
        type: 'div',
        resettableCss: ['backgroundColor', 'opacity'],
        css: {
          padding: [8, 16, 8, 16],
          backgroundColor: '#268dff',
          opacity: 0.7,
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
              lineHeight: 20,
              display: 'inline-block',
              color: '#fff', fontSize: 14
            }
          }
        ]
      },
      {
        type: 'div',
        resettableCss: ['opacity'],
        css: {
          padding: [6, 8, 6, 8],
          backgroundColor: '#FFF',
          opacity: 0.7
        },
        itemType: 'group',
        itemGroupOrder: 2,
        itemMaxCount: 100,
        children: [
          {
            type: 'div',
            css: {
              padding: [5, 0, 5, 0]
            },
            children: [
              {
                type: 'text',
                itemCode: 'time',
                itemType: 'label',
                text: '拍摄时间：',
                css: {
                  width: 80,
                  color: '#1f1f1f', fontSize: 13, lineHeight: 20, textAlign: 'right', display: 'inline-block'
                }
              },
              {
                type: 'text',
                itemCode: 'time',
                itemType: 'value',
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
        resettableCss: ['backgroundColor', 'opacity'],
        css: {
          padding: [8, 16, 8, 16],
          backgroundColor: '#268dff',
          opacity: 0.7,
          textAlign: 'center'
        },
        itemType: 'group',
        itemGroupOrder: 3,
        itemMaxCount: 1,
        children: [
          {
            type: 'text',
            itemCode: 'location',
            itemType: 'value',
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
  };
}

function setWatermarkTemplateConfig (layoutTemplateConfig) {
  const styleConfig = setWatermarkTemplateStyleConfig(layoutTemplateConfig, watermarkTemplateStyle)
  const itemsConfig = setWatermarkItemsConfig(styleConfig, watermarkTemplateItemList)
  return itemsConfig
}

function setWatermarkTemplateStyleConfig (layoutTemplateConfig, watermarkStyle) {
  if (!layoutTemplateConfig) {
    return null
  }

  if (watermarkStyle.themeColor && layoutTemplateConfig.themeColorCss) {
    layoutTemplateConfig.themeColorCss
      .forEach(cssProp => {
        watermarkStyle[cssProp] = watermarkStyle.themeColor
      })
  }

  recursionSetWatermarkTemplateStyle(layoutTemplateConfig)
  
  function recursionSetWatermarkTemplateStyle (templateConfig) {
    if (Array.isArray(templateConfig.resettableCss)) {
      templateConfig.resettableCss.forEach(prop => {
        if (watermarkStyle[prop] !== undefined) {
          templateConfig.css[prop] = watermarkStyle[prop]
        }
      })
    }
  
    templateConfig.children && templateConfig.children.forEach(
      config => {
        recursionSetWatermarkTemplateStyle(config)
      }
    )
  }

  return layoutTemplateConfig
}


function setWatermarkItemsConfig (layoutTemplateConfig, watermarkItemList) {
  if (!layoutTemplateConfig) {
    throw new Error('模板配置不能为空')
  }
  const itemGroupList = recursionGetWatermarkTemplateItemGroupsConfig(layoutTemplateConfig)
    .sort((a, b) => a.itemGroupOrder - b.itemGroupOrder)
  if (!itemGroupList.length) {
    throw new Error('模板配置无可用空间')
  }
  const lastItemGroup = itemGroupList.slice(-1)[0]
  const lastItemGroupIsLimit = lastItemGroup.itemMaxCount === 1

  if (lastItemGroupIsLimit && watermarkItemList.length >= itemGroupList.length) {
    resetWatermarkTemplateItems(itemGroupList.pop(), [watermarkItemList.pop()])
  }


  itemGroupList.forEach((group) => {
    if (!group.children || !group.children.length) {
      return
    }
    const groupItemsData = watermarkItemList.splice(0, group.itemMaxCount)

    resetWatermarkTemplateItems(group, groupItemsData)
  })
  
  
  return layoutTemplateConfig
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
  const layoutTemplateConfig = getWatermarkLayoutById(layoutTemplateId);
  const config = setWatermarkTemplateConfig(layoutTemplateConfig)
  const options = {
    ratio: 2,
    config
  }
  const canvas = await json2canvas(options);
  const img = document.createElement('img');
  img.style.width = canvas.width / canvas.ratio + 'px';
  img.style.height = canvas.height / canvas.ratio + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();
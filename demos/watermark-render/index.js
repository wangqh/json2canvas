const templateId = 'testwet234234324'
const watermarkStyle = {
  width: 194,
  opacity: 0.5,
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
    value: '一楼卫生间一楼卫生间一楼卫生间一楼卫生间一楼卫生间一楼卫生间一楼卫生间'
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
                // resettableCss: ['width'],
                css: {
                  width: 88,
                  color: '#1f1f1f', fontSize: 13, lineHeight: 20, textAlign: 'right', display: 'inline-block'
                }
              },
              {
                type: 'wrapText',
                itemCode: 'time',
                itemType: 'value',
                text: '2021-09-09 19:27',
                resettableCss: ['width'],
                css: {
                  width: 90,
                  lineClamp: 4,
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

  const rootConfig = templateConfig
  const rootConfigWidth = rootConfig.css.width

  if (!rootConfigWidth) {
    throw new Error('模板配置根元素必须设置宽度！')
  }

  recursionSetWatermarkTemplateStyle(templateConfig, 0)
  
  function recursionSetWatermarkTemplateStyle (templateConfig, offsetWidth) {
    offsetWidth += templateConfig.css.padding ? (templateConfig.css.padding[1] + templateConfig.css.padding[3]) : 0
    if (Array.isArray(templateConfig.resettableCss)) {
      templateConfig.resettableCss.forEach(cssProp => {
        let styleCssValue = watermarkStyle[cssProp]
        if (styleCssValue !== undefined) {
          if (cssProp === 'width') {
            styleCssValue = computedResettableWidth(templateConfig, rootConfig, rootConfigWidth, styleCssValue, offsetWidth)
          }
          templateConfig.css[cssProp] = styleCssValue
        }
      })
    }

    if (templateConfig.children) {
      offsetWidth = templateConfig.children.reduce((prev, item) => {
        const isNotResettableWidth = !Array.isArray(item.resettableCss) || !item.resettableCss.includes('width')
        if (item.css.display === 'inline-block' && isNotResettableWidth) {
          prev += item.css.width || 0
        }
        return prev
      }, offsetWidth)
  
      templateConfig.children.forEach(
        config => {
          recursionSetWatermarkTemplateStyle(config, offsetWidth)
        }
      )
    }

  }

  return templateConfig
}

function computedResettableWidth (templateConfig, rootConfig, rootConfigWidth, newRootWidth, offsetWidth) {
  const isNotRoot = templateConfig !== rootConfig
  rootConfigWidth -= offsetWidth
  newRootWidth -= offsetWidth
  const isChangedStyleWidth = newRootWidth !== rootConfigWidth
  let configWidth = templateConfig.css.width
  if (configWidth && isChangedStyleWidth) {
    configWidth = isNotRoot ? ((configWidth / rootConfigWidth) * newRootWidth) : newRootWidth
  }
  return configWidth
}


function setWatermarkItemsConfig (templateConfig, watermarkItemList) {
  if (!templateConfig) {
    throw new Error('模板配置不能为空')
  }
  const itemGroupList = recursionGetWatermarkTemplateItemGroupsConfig(templateConfig)
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
  const itemsTypes = ['text', 'wrapText']
  
  itemsData.forEach(itemData => {
    let itemConfig = []
    let itemRowConfig = {}
    if (itemsTypes.includes(groupChildren[0].type)) {
      itemConfig = resetItemConfig(groupChildren, itemData)
      newGroupChildren.push(...itemConfig)
    } else if (itemsTypes.includes(groupChildren[0].children[0].type)) {
      const itemRowConfigCss = groupChildren[0].css
      itemConfig = resetItemConfig(groupChildren[0].children, itemData)
      itemRowConfig = {
        ...groupChildren[0],
        css: { ...itemRowConfigCss },
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
    ratio: 2,
    config
  }
  const canvas = await json2canvas(options);
  document.body.appendChild(canvas);

})();
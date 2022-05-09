# Drag & Drop API
> 浏览器原生提供的api

## 拖拽元素的事件
- ondragstart

        开始拖拽元素时触发，此时可以做一些对拖拽元素的信息保存

- ondragend

        结束拖拽元素时触发，对保存信息的清楚或状态还原

## 放置元素的事件

- ondragover

        当拖拽元素在此元素内移动时触发
        ps: 1. 此元素的子元素内移动也会触发此事件，如非必要需要判断触发此事件的元素是否是最外层的容器元素
            2. 需要在此方法内执行preventDefault()阻止元素的默认行为，否则无法触发ondrop事件

- ondragenter

        当拖拽元素进入此元素时触发
        ps: 此元素的子元素也会触发此事件，从子元素离开重新回到父元素时也会触发

- ondragleave

        当拖拽元素离开此元素时触发
        ps: 当enter和leave一起触发时，会先执行ondragenter，在执行ondragleave

- ondrop

        拖拽元素在此元素上释放鼠标时触发
        可以根据dragstart时保存的数据来执行对应逻辑

## 拖拽相关的属性

- dataTransfer 

        拖拽事件中的数据传输对象
        用于源对象与目标对象中传输数据
  
  > 常用方法
  
  + setData
  
          dataTransfer.setData(format, data);
          format: 数据类型, 例如text/plain、text/uri-list等，或自定义类型
          data: 需要保存的数据内容
          已被设置过的数据类型的内容将会被覆盖，未设置过的则会新添加，并且把数据类型保存到dataTransfer.types数组的末尾
      
  + getData
  
          dataTransfer.getData(fromat);
          format: 数据类型
          获取dataTransfer.types中已有的数据类型，如果不存在则会返回一个空字符串，存在则返回dataTransfer.items中的对应数据
  
  + setDragImage
  
          dataTransfer.setDragImage(Element | img, xOffset, yOffset);
          Element | img: 用于替换拖拽元素的反馈图像
          xOffset: 横向偏移量
          yOffset: 纵向偏移量
  
  > 属性
  
  + dropEffect
  
          获取当前选定的拖放操作类型或者设置的为一个新的类型。值必须为  none, copy, link 或 move。
          如果值非法，则不会进行变更，依旧为旧值
          当dataTransfer.dropEffect为none则ondrop事件不会触发
          其他的属性则会改遍鼠标的样子
  
  + effectAllowed
  
          限制dropEffect可设置的属性，值必须为none, copy, copyLink, copyMove, link, linkMove, move, all or uninitialized 之一。
  
  + files
  
          包含数据传输中可用的所有本地文件的列表。如果拖动操作不涉及拖动文件，则此属性为空列表。
  
  + items
  
          包含所有拖动数据的列表
          里面提供有getAsFile()获取文件数据和getAsString()获取字符串类型数据
  
  + types
  
          包含所有数据类型的列表


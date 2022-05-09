import { createElement, sameVNode, patchVNode } from './utils.js'

export function updateChildren(parentEl, oldCh, newCh) {
  // 都有子节点，进行命中查找
  /**
   * 新前与旧前             命中 -> 新前与旧前指针下移 
   * 新后与旧后             命中 -> 新后与旧后指针上移
   * 新后与旧前             命中 -> 新后与旧前 新后指向的节点移动到旧后的后面，新后指针上移，旧前指针下移
   * 新前与旧后             命中 -> 新前与旧后 移动新前指向的节点到旧前的前面，新前指针下移，旧后指针上移
   * 
   * 循环完毕如果新前与新后之间仍有节点则全部向尾部添加
   * 如果旧前与旧后之间仍有节点则需要全部移除
   */
  let newFront = 0;
  let oldFront = 0;
  let newLast = newCh.length - 1;
  let oldLast = oldCh.length - 1;

  let newFrontVnode = newCh[0];
  let oldFrontVnode = oldCh[0];
  let newLastVnode = newCh[newLast];
  let oldLastVnode = oldCh[oldLast];

  let keyMap;

  while (newFront <= newLast && oldFront <= oldLast) {
    // 略过undefined（已经被处理过的元素）
    if(oldFrontVnode === undefined) {
      oldFrontVnode = oldCh[++oldFront];
    } else if(oldLastVnode === undefined) {
      oldLastVnode = oldCh[--oldLast];
    } else if(newFrontVnode === undefined) {
      newFrontVnode = newCh[++newFront];
    } else if(newLastVnode === undefined) {
      newLastVnode = newCh[--newLast];
    } else if(sameVNode(newFrontVnode, oldFrontVnode)) {
      console.log('命中 - 新前与旧前');
      patchVNode(oldFrontVnode, newFrontVnode);
      // 新前旧前指针下移，并重新获取新指针指向的节点
      newFrontVnode = newCh[++newFront];
      oldFrontVnode = oldCh[++oldFront];
    } else if(sameVNode(newLastVnode, oldLastVnode)) {
      console.log('命中 - 新后与旧后');
      patchVNode(oldLastVnode, newLastVnode);
      // 新后旧后指针上移，并重新获取新指针指向的节点
      newLastVnode = newCh[--newLast];
      oldLastVnode = oldCh[--oldLast];
    } else if(sameVNode(newLastVnode, oldFrontVnode)) {
      console.log('命中 - 新后与旧前');
      patchVNode(oldFrontVnode, newLastVnode);
      // 新后指针上移，旧前指针下移，并重新获取新指针指向的节点
      parentEl.insertBefore(newLastVnode.elm, oldLastVnode.elm.nextSibling);
      newLastVnode = newCh[--newLast];
      oldFrontVnode = oldCh[++oldFront];
    } else if(sameVNode(newFrontVnode, oldLastVnode)) {
      console.log('命中 - 新前与旧后');
      patchVNode(oldLastVnode, newFrontVnode);
      parentEl.insertBefore(newFrontVnode.elm, oldFrontVnode.elm);
      // 新前指针下移，旧后指针上移，并重新获取新指针指向的节点
      newFrontVnode = newCh[++newFront];
      oldLastVnode = oldCh[--oldLast];
    } else {
      // 前四种方式都没有匹配
      // 如果keyMap没有值则进行初始化
      if(keyMap === undefined) {
        keyMap = createKeyToOldIdx(oldCh, oldFront, oldLast);
      }
      // 寻找当前新节点是否存在旧节点中
      const moveIndex = keyMap[newFrontVnode.key];
      if(moveIndex === undefined) {
        // 没找到代表是全新元素
        const realNode = createElement(newFrontVnode);
        newFrontVnode.elm = realNode;
        console.log(oldFrontVnode, '前插入', newFrontVnode);
        parentEl.insertBefore(realNode, oldFrontVnode.elm);
      } else {
        // 找到了代表是移动
        const moveNode = oldCh[moveIndex];
        patchVNode(moveNode, newFrontVnode);
        console.log(moveNode, '移动到', oldFrontVnode, '之前');
        // 此元素已经被处理过，标记为undefined
        oldCh[moveIndex] = undefined;
        parentEl.insertBefore(moveNode.elm, oldFrontVnode.elm);
      }
      newFrontVnode = newCh[++newFront];
    }
  }

  // 新旧节点至少会遍历完一个，不会出现两个都有剩余情况
  // 剩余节点插入
  if(newFront <= newLast) {
    const before = newCh[newLast + 1] === undefined ? null : newCh[newLast + 1].elm;
    for(let i = newFront; i <= newLast; i++){
      const realNode = createElement(newCh[i]);
      newCh[i].elm = realNode;
      // 如果insertBefore第二个参数为null，则会将插入元素放到队尾
      if(before) console.log(newCh[newLast + 1], '前添加', newCh[i]);
      else console.log('尾部添加', newCh[i]);
      parentEl.insertBefore(realNode, before);
    }
  } else if(oldFront <= oldLast) {
    // 多余节点删除
    for(let i = oldFront; i <= oldLast; i++){
      if(oldCh[i] === undefined) continue;
      console.log('删除', oldCh[i]);
      oldCh[i].elm.remove();
      oldCh[i].elm = undefined;
    }
  }
}

// 创建一个key与索引的关系对照表
function createKeyToOldIdx(oldCh, oldFront, oldLast) {
  const map = {};
  for(let i = oldFront; i <= oldLast; i++) {
    const key = oldCh[i]?.key;
    if(key !== undefined) {
      map[key] = i;
    }
  };
  return map;
}
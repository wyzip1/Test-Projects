import { updateChildren } from './updateChildren.js'

// 判断是否是同一个节点
export function sameVNode(VNode1, VNode2) {
  return VNode1.sel === VNode2.sel && VNode1.key === VNode2.key;
}

// 创建真实节点
export function createElement(vnode) {
  let dom = document.createElement(vnode.sel);
  // 判断子节点是否为文本节点
  if (vnode.text !== '' && vnode.text !== undefined && (vnode.children === undefined || vnode.children.length === 0)) {
    let textNode = document.createTextNode(vnode.text);
    dom.appendChild(textNode);
  } else if (Array.isArray(vnode.children) && vnode.children.length !== 0) {
    for (let c of vnode.children) {
      dom.appendChild(createElement(c));
    }
  }
  vnode.elm = dom;
  return vnode.elm;
}

// 深度化比较节点内容
export function patchVNode(oldVNode, newVNode) {
  // 新旧节点完全一致不做操作
  if (oldVNode === newVNode) return;
  // 新节点具有文本内容且内容与老节点文本内容不一致
  if (newVNode.text !== undefined &&
    (newVNode.children === undefined || newVNode.children.length === 0)) {
    // 更新旧节点dom的text，如果旧节点有其他子节点会被清除
    if(oldVNode.text !== newVNode.text) {
      console.log('内容更新', oldVNode.text + ' -> ' +newVNode.text);
      oldVNode.elm.innerText = newVNode.text;
    }
  } else {
    if (Array.isArray(oldVNode.children) && oldVNode.children.length !== 0) { 
      const nVnodes = newVNode.children;
      const oVnodes = oldVNode.children;
      updateChildren(oldVNode.elm, oVnodes, nVnodes);
    }
    else {
      oldVNode.elm.innerText = '';
      for (let c of newVNode.children) {
        oldVNode.elm.appendChild(createElement(c));
      }
    }
  }
  newVNode.elm = oldVNode.elm
};
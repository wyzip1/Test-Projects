import { vnode } from '../createVnode/utils.js'
import { sameVNode, createElement, patchVNode } from './utils.js'


export default function (oldVNode, newVNode) {
  // 判断旧节点是否是虚拟节点
  if(oldVNode.sel === undefined || oldVNode.sel === ''){
      // 将真实dom转换为VNode
      oldVNode = vnode(oldVNode.tagName.toLowerCase(), {}, [], undefined, oldVNode);
  }
  // 判断是否是同一个节点
  if(sameVNode(oldVNode, newVNode)) {
    patchVNode(oldVNode, newVNode)
  } else {
      // 不是同一个节点，暴力插入新的，删除旧的
      const newVNodeElm = createElement(newVNode, oldVNode.elm);
      newVNode.elm = newVNodeElm;
      oldVNode.elm.parentNode.insertBefore(newVNodeElm, oldVNode.elm);
      oldVNode.elm.remove();
      
  }
}
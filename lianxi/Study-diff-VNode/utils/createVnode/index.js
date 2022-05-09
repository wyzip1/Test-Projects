import { vnode } from './utils.js'

/**
 * createVNode
 * @param {string} sel 标签名
 * @param {object} data 标签属性
 * @param {number | string | VNode | Array } c 文本内容或单个虚拟节点或以数组存储的多个虚拟节点
 * @returns 
 */
export default function createVNode(sel, data, c) {
  // 参数不足，抛出错误
  if(arguments.length < 3) throw new Error('必须传入三个参数');
  
  if(typeof c === 'string' || ['number', 'undefined'].includes(typeof c)){
    return vnode(sel, data, undefined, c, undefined);
  } else if(Array.isArray(c)) {
    let children = [];
    for(let i of c) {
      // 检测children元素数据结构是否合法
      if(typeof i === 'object' && !i.hasOwnProperty('sel')) throw new Error('传入的数组参数中' + i + '不是有效参数');
      children.push(i);
    }
    return vnode(sel, data, children, undefined, undefined);
  } else if(typeof c === 'object' && c.hasOwnProperty('sel')){
    return vnode(sel, data, [c], undefined, undefined);
  } else throw new Error('第三个参数格式错误 ')
} 

import { def } from "./utils.js";

// 需要重写的方法  ps：这些方法会修改数组本身
const fns = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

const arrayMethods = Object.create(Array.prototype);

// 重写数组方法
for(let fn of fns) {
  // 让此方法不可枚举
  def(arrayMethods, fn, function(...rest) {
    let inserted = rest;
    if(fn === 'splice') inserted = rest.slice(2);
    
    this.__ob__.observerArray(inserted);
    // 做一些其他的事
    console.log('restFn '+ fn, ...rest);
    // 调用原来的数组方法
    return Array.prototype[fn].call(this, ...rest);
  
  }, false);
}

// 将被劫持的数组的原型链指向重写方法的arrayMethods
export default function (arr) {
  arr.__proto__ = arrayMethods;
}
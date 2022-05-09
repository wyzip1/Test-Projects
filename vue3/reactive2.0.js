// vue 2.0 Object.defineProperty
/**
 * 问题点
 * 1: 新增的属性无法定义为响应式
 * 2: 无法对数组进行监听，需要重写数组的操作方法，但是下标的操作仍然无法捕捉
 */
let oldArrayPrototype = Array.prototype;
// 利用数组原形创建一个新对象，在此基础上添加方法，而不影响原型
let proto = Object.create(oldArrayPrototype);
['push', 'shift', 'unshift'].forEach(method => {
  proto[method] = function(...arg) {
    oldArrayPrototype[method].call(this, ...arg);
    updateView(method);
  }
})

function observer(target) {
  if (Array.isArray(target)) return target.__proto__ = proto;
  if (typeof target !== 'object' || target === null) return target;
  
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}

function defineReactive(target, key, value){
  observer(value)
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      observer(newValue);
      if(newValue !== value){
        updateView(value, newValue);
        value = newValue;
      }
    }
  })
}

function updateView(v, n) {
  console.log('视图更新:', `${v} => ${n}`);
}

const data = { name: 'test', arr: [1, 2, 3, 4] };
observer(data);
data.arr[1] = 100;
data.arr.push('99')
data.arr.shift();
console.log(data.arr);
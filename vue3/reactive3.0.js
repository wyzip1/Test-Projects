// vue 3.0 Proxy
// 建立两个关系对照表，来判断对象是否已经被代理过，或对已代理对象进行多次代理
// 原对象: 代理对象
let toProxy = new WeakMap();
// 代理对象: 原对象
let toRaw = new WeakMap();

Object.prototype.type = getType;
function getType() {
  const type = Object.prototype.toString.call(this);
  switch (type) {
    case '[object Undefined]': return 'undefined';
    case '[object Null]': return 'null';
    case '[object Boolean]': return 'boolean';
    case '[object Function]': return 'function';
    case '[object Object]': return 'object';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
    case '[object Number]': return 'number';
    case '[object Promise]': return 'Promise'
    case '[object RegExp]': return 'RegExp';
    case '[object Symbol]': return 'Symbol';
    case '[object Date]': return 'Date';
    case '[object Map]': return 'Map';
    case '[object Set]': return 'Set';
    case '[object WeakMap]': return 'WeakMap';
    case '[object WeakSet]': return 'WeakSet';
    default: return type;
  }
}

function canProxy(val) {
  return ['object', 'array'].includes(val.type());
}

function hasOwn(target, key) {
  return Reflect.ownKeys(target).includes(key);
}

function reactive(target) {
  return createReactiveObject(target);
}

function createReactiveObject(target) {
  if(!canProxy(target)) return target;

  const proxy = toProxy.get(target);
  if(proxy) return proxy; // 当前对象代理过则直接返回已代理的对象
  if(toRaw.has(target)) return target; // 防止一个proxy被多次代理
  const baseHandler = {
    get(target, key, receiver) {
      return reactive(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
      let hadkey = hasOwn(target, key);
      let res = Reflect.set(target, key, value, receiver);
      if(hadkey) {
        // 原来没有这个属性则是新增
        console.log('新增属性');
      } else if(target[key] !== value){
        // 表示如果原来的值与新值不相等才是修改值，阻止无意义的更新
        // 例如数组添加元素是length属性值也会发生变化而触发set
        // reflect.set添加新值之后length已经是最新的长度了，则会与即将改变的值一直，则不触发修改属性
        console.log('修改属性');
      }
      return res;
    },
    deleteProperty(target, key) {
      return Reflect.defineProperty(target, key);
    },
  }
  let observed = new Proxy(target, baseHandler);
  toProxy(target, observed);
  toProxy(observed, target);
  return observed;
}

const data = {
  name: {n: 'z', x: [{a: 100}]}
};

const state = reactive(data);

state.name.x[0].a = 'as'
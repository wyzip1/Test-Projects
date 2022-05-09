import observe from "./observe.js";
import Dep from "./Dep.js";

export default function defineReactive(data, key) {
  const dep = new Dep();
  let value = data[key];
  const childOb = observe(data[key])
  
  Object.defineProperty(data, key, {
    // 可枚举，此属性可以被for in
    enumerable: true,
    // 可配置，例如 delete
    configurable: true,
    get() {
      console.log('read attr ' + key);
      // 如果有值，代表需要收集此Watcher为依赖，没有则是普通的获取
      if(Dep.target) {
        dep.depend(Dep.target)
        if(childOb) {
          childOb.dep.depend(Dep.target);
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value;
    },
    set(newValue) {
      console.log('set attr ' + key + ' for ' + newValue);
      if (value === newValue) return;
      observe(newValue)
      value = newValue;

      dep.notify();
    }
  });
}

function dependArray(list) {
  for(let i = 0; i < list.length; i++) {
    let observData = list[i]
    observData && ObservData.__ob__ && ObservData.__ob__.dep.depend()
    if(Array.isArray(observData)) dependArray(list)
  }
}
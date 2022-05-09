import Dep from "./Dep.js";
import observe from "./observe.js";

export default function defineReactive(data, key) {
  const dep = new Dep();

  let value = data[key];

  let childOb = observe(data[key]);

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,

    get() {
      if(Dep.target) {
        dep.depend();
        if(childOb) childOb.dep.depend();
      }
      return value;
    },

    set(newValue) {
      if(newValue === value) return;
      childOb = observe(newValue);
      value = newValue;

      dep.notify();
    }
  });
}
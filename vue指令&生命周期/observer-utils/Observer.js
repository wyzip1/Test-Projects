import defineReactive from "./defineReactive.js";
import Dep from "./Dep.js";
import observe from "./observe.js";
import { def } from "./utis.js";

export default class Observer {

  dep = new Dep();

  constructor(data) {
    if (Array.isArray(data)) {
      this.observerArray(data);
    } else this.walk(data);

    def(data, '__ob__', this, false);
  }

  walk(data) {
    for (let key in data) {
      defineReactive(data, key);
    }
  }

  observerArray(arr) {
    for (let i of arr) {
      observe(i)
    }
  }
}
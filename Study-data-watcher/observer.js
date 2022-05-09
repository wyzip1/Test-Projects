import defineReactive from "./defineReactive.js";
import array from "./array.js";
import { def } from "./utils.js";
import observe from "./observe.js";
import Dep from "./Dep.js";

export default class Observer {

  dep = new Dep();

  constructor(data) {
    def(data, '__ob__',  this, false);
    if(Array.isArray(data)) {
      this.observerArray(data)
      return array(data)
    }
    this.walk(data);
  }

  walk(value) {
    for(let key in value) {
      defineReactive(value, key);
    }
  }

  observerArray(arr) {
    for (const i of arr) {
      observe(i)
    }
  }
}


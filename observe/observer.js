import { arrayMethods } from "./array.js";
import defineReactive from "./defineReactive.js";
import Dep from "./dep.js";
import observe from "./observe.js";
import { def } from "./utils.js";

export default class Observer {
  dep = null
  
  constructor(data) {
    def(data, '__ob__', this)
    this.dep = new Dep()
    if(Array.isArray(data)) {
      protoAugment(data, arrayMethods)
      this.observeArray(data)
      return void 0
    }
    this.walk(data);
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for(let i = 0; i < keys.length; i ++){
      defineReactive(obj, keys[i])
    }
  }

  observeArray(list) {
    for (let i = 0; i < list.length; i ++) {
      observe(list[i])
    }
  }
}

function protoAugment (target, src) {
  target.__proto__ = src
}
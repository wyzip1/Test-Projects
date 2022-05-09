import Dep from "./Dep.js";
import { parsePath } from "./utis.js";

let uid = 0;

export default class Watcher {
  constructor(target, expression, callback) {
    this.target = target;
    this.getter = parsePath(expression);
    this.callback = callback;
    this.value = this.get();
    this.id = uid ++;
  }

  get() {
    Dep.target = this;

    const value = this.getter(this.target);

    Dep.target = null;

    return value;
  }

  update() {
    this.run();
  }

  run() {
    this.getAndInvoke(this.callback);
  }

  getAndInvoke(cb) {
    const value = this.get();

    if(value !== this.value || typeof value === 'object') {
      let oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue)
    }
  }
}
import Dep from "./Dep.js";
import { guid, parsePath } from "./utils.js";

export default class Watcher {
  uuid = guid();

  constructor(target, expression, callback) {
    this.target = target;
    this.getter = parsePath(expression)
    this.callback = callback;
    this.value = this.get();
  }

  update() {
    // 更新的时候重新获取值，并告诉回调函数发生了更新操作
    this.run();
  }

  get() {
    // 给Dep设置当前实例的Watcher对象，代表此时劫持数据的get中需要收集此依赖
    Dep.target = this;

    const obj = this.target;

    let value;

    try {
      // 只要还能找就一直找
      value = this.getter(obj)
    } finally {
      // 当次对象的属性找完之后代表依赖收集完毕
      Dep.target = null;
    }

    return value;
  }

  run() {
    this.getAndInvoke(this.callback);
  }

  getAndInvoke(cb) {
    const value = this.get();

    if(value !== this.value || typeof value === 'object') {
      const oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue)
    }
  }
}
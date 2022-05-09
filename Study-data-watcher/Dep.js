import { guid } from "./utils.js";

export default class Dep {
  subs = [];
  uuid = guid();

  addSub(sub) {
    // 如果找到了当前的wather，则代表已经收集过了，直接返回
    if (this.subs.find(item => item.uuid === sub.uuid)) return;
    this.subs.push(sub);
  }

  depend() {
    Dep.target && this.addSub(Dep.target);
  }

  notify() {
    const subs = this.subs.slice();
    for (const sub of subs) {
      sub.update();
    }
  }

  static target = null;
}
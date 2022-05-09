let uid = 0;

export default class Dep {
  static target = null;

  subs = [];

  id = uid ++;

  notify() {
    const subs = this.subs.slice();
    for(const sub of subs) {
      sub.update();
    }
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  depend() {
    if(Dep.target) this.addSub(Dep.target);
  }
}
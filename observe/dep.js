let uid = 0

export default class Dep {
  static target = null;
  id = uid ++;
  subs = []

  depend() {
    if(Dep.target !== null) {
      Dep.target.addDep(this)
    }
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    const subs = this.subs.slice()
    for(let i = 0; i < subs.length; i ++) {
      subs[i].update();
    }
  }
}
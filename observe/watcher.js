import Dep from "./dep.js";
import { parsePath } from "./utils.js";

let uid = 0

export default class Watcher {
  id = uid ++;
  deps = new Set();
  vm = null
  cb = null
  getter = null
  expression = null
  value = null

  constructor(vm, expression, cb) {
    this.vm = vm
    this.expression = expression
    this.getter = parsePath(expression)
    this.cb = cb
    this.value = this.get()
  }

  addDep(dep) {
    if(this.deps.has(dep)) return
    this.deps.add(dep)
    dep.addSub(this)
  }

  get() {
    Dep.target = this
    let value 
    try {
      value = this.getter(this.vm)
    } catch (e) {
      console.error(e, this.vm, `getter for watcher "${this.expression}"`);
    } finally {
      Dep.target = null
    }
    return value
  }

  update() {
    this.run()
  }

  run() {
    const value = this.get()
    const oldvalue = this.value
    if(value === oldvalue) return
    this.value = value
    this.cb.call(this.vm, value, oldvalue)
  }
}
import Dep from "./dep.js"
import observe from "./observe.js"

export default function(target, key) {
  const dep = new Dep()
  
  let value = target[key]
  let childOb = observe(value)
  
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,

    get() {
      if(Dep.target) {
        target.__ob__.dep.depend()
        dep.depend()
        if(childOb) {
          childOb.dep.depend()
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      if(newVal === value) return
      observe(newVal)
      value = newVal

      dep.notify()
    },
  })
}

function dependArray(list) {
  for (let i = 0; i < list.length; i++) {
    const observeData = list[i];
    observeData && observeData.__ob__ && observeData.__ob__.dep.depend()
    if(Array.isArray(observeData)) dependArray(observeData)
  }
}
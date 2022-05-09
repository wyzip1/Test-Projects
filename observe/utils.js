export function isObject(target) {
  return target !== null && typeof target === 'object'
}

export function def(obj, key, val,enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    configurable: true,
    writable: true
  })
}

export function parsePath(expression) {
  const attrs = expression.split('.')
  return obj => {
    for (const attr of attrs) {
      obj = obj[attr]
    }
    return obj
  }
}
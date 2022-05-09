export function def(data, key, value, enumerable = false) {
  Object.defineProperty(data, key, {
    value,
    enumerable,
    configurable: true,
    writable: true
  })
}

export function parsePath(expression) {
  const attrs = expression.split('.')
  return (obj) => {
    for(const attr of attrs) {
      obj = obj[attr];
    }
    return obj;
  }
}
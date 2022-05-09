export function def(data, key, value, enumerable = false) {
  Object.defineProperty(data, key, {
    value,
    enumerable,
    configurable: true,
    writable: true
  })
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export function parsePath(expression) {
  const attrs = expression.split('.');
  
  return obj => {
    for (const attr of attrs) {
      obj = obj[attr]
    }
    return obj
  };
}
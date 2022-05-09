import observe from "./observe.js";
import Watcher from './watcher.js'

const data = {
  msg: '123',
  child: {
    age: '100',
    name: 'test'
  },
  arr: ['0']
}

window.d = data;

observe(data)

new Watcher(data, 'child.name', function (newVal, oldVal) {
  console.log('newVal', newVal);
  console.log('oldVal', oldVal);
  data.child.name = oldVal
})
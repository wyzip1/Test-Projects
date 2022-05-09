import observe from "./observe.js";
import Watcher from './Watcher.js'

const data = {
  age: 10,
  name: 'sfaf',
  sex: true,
  children: {
    name: 'ccc',
    age: 5,
    sex: false
  },
  arr: [1, 22, 33]
}

window.d = data;

observe(data);

new Watcher(data, 'children.name', (newVal, oldVal) => {
  console.log('watcher update', newVal, oldVal);
});
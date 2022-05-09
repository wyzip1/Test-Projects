import observe from "./observe.js";
import Watcher from "./Watcher.js";


const data = {
  name: 'sdad',
  age: 123,
  children: {
    name: 'ch',
    age: 80
  }
}

observe(data);

new Watcher(data, 'children.name', (newVal, oldVal) => {
  console.log('watcher update', newVal, oldVal);
});

window.d = data;
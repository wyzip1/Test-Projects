import Observer from "./Observer.js";

export default function observe(data) {
  if(typeof data !== 'object') return;
  let ob;
  if(typeof data.__ob__  === 'undefined') {
    ob = new Observer(data);
  } else ob = data.__ob__;
  return ob;
}
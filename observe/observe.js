import Observer from './observer.js'
import { isObject } from './utils.js'

export default function (data) {
  if(!isObject(data)) return
  let ob;
  if(typeof data.__ob__ === 'undefined') {
    ob = new Observer(data)
  } else ob = data.__ob__
  return ob;
}
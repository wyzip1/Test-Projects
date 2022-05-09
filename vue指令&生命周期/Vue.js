import Compile from "./Compile.js";

export default class Vue {
  constructor(options) {
    this.$options = options || {};
    this._data = options?.data;
    new Compile(options.el, this);
  }
}
export default class Compile {
  constructor(el, vm) { 
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if(this.$el) {
      const $fragment = this.node2Fragment(this.$el);
      this.compile($fragment)
    }
  }

  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while(child = el.firstChild) {
      fragment.appendChild(child);
    }
    console.log(fragment);
    return fragment
  }

  compile(fragment) {}
}
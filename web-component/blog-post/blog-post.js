const template = document.createElement('template');
template.innerHTML = `
  <style>
    h1 {
      font-size: 18px;
      font-weight: bold;
    }
    .aricle {
      font-size: 14px;
      color: #929292;
      margin-bottom: 12px;
      display: block;
    }
    button {
      padding: 8px 24px;
      background: linear-gradient(to right, #2b87f0 40%, #71e8f8 100%);
      border: 0;
      border-radius: 5px;
      color: #fff;
    }
  </style>
  <h1></h1>
  <slot name="content" class="aricle"></slot>
  <button>查看全文</button>
`

class BlogPost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    this.titleEl = this.shadowRoot.querySelector('h1');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    if (name === 'title') {
      this.titleEl.textContent = newValue;
    }
  };

  static get observedAttributes() {
    return ['title'];
  }

}
customElements.define('blog-post', BlogPost);
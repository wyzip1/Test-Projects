const template = document.createElement('template');
template.innerHTML = `
  <style>
    .container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      row-gap: 10px;
      column-gap: 10px;
    }
    blog-post {
      box-shadow: 0 0 4px 0px rgba(0, 0, 0, .3);
      padding: 10px 15px;
      box-sizing: border-box;
    }
  </style>
  <div class="container"></div>
`;

class PostList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()).then(data => {
      console.log(data);
      this.initPosts(data);
    });
  }

  initPosts(list) {
    list.forEach(item => {
      const blogPost = document.createElement('blog-post');
      blogPost.setAttribute('title', item.title);
      const article = document.createElement('article');
      article.textContent = item.body;;
      article.slot = 'content';
      blogPost.appendChild(article);
      this.shadowRoot.querySelector('.container').appendChild(blogPost);
    })
  }
}

customElements.define('post-list', PostList);
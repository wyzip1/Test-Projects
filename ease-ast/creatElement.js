function createElement (ast) {
  if(!ast) return [];
  if(Array.isArray(ast)){
    let childrens = [];
    for(let i of ast) childrens.push(createElement(i));
    return childrens;
  }

  if(ast.type === 1) {
    let el = document.createElement(ast.tag);
    ast.attrs.forEach(item => el.setAttribute(item.name, item.value));
    createElement(ast.children).forEach(children => {
      el.appendChild(children);
    });
    return el;
  } else if(ast.type === 3) {
    let text = document.createTextNode(ast.text);
    return text;
  }
}

export default createElement;
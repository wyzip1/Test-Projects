import Scanner from "./Scanner.js";

export default function (template, data) {
  const scanner = new Scanner({ template });


  console.log(scanner);
  const html = createHTML(scanner.tokens, data);
  console.log(html);
  return html;
}


function createHTML(tokens, data) {
  let html = '';
  if(Array.isArray(data)) {
    for(const _data of data) {
      html += createItem(tokens, _data);
    }
    return html;
  }
  html += createItem(tokens, data);
  return html;
}


function createItem(tokens, data) {
  let result = '';
  for (const token of tokens) {
    if (token[0] === 'text') result += token[1];
    else if (token[0] === '#') result += createHTML(token[2], data[token[1]])
    else if (token[0] === 'name') {
      if (token[1] === '.') result += data;
      else result += getData(data, token[1].split('.'));
    }
  }
  return result;
}

function getData(data, props) {
  let result = data;
  for(let prop of props) {
    result = result[prop];
  }
  return result;
}
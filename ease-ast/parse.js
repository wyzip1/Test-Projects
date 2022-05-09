import parseAttrsString from "./parseAttrsString.js";

export default function (template = '') {
  template = template.trim();

  let AST = {};

  let index = 0;
  let rest = '';
  let stack = [];
  let stack2 = [];

  let startRegExp = /^\<([a-z]+[1-6]?)(\s[^<]+)?\>/;
  let endRegExp = /^\<\/([a-z]+[1-6]?)\>/;

  let isAloneTag = /^\<([a-z]+[1-6]?)(\s[^<]+)?\/\>/

  let wordKey = /^([^<]+)\<\/[a-z]+[1-6]?\>/;
  let wordKey2 = /^([^<]+)\<([a-z]+[1-6]?)(\s[^<]+)?\>/;


  let emptyRegExp = /^\s+$/;

  while(index < template.length - 1) {
    rest = template.substring(index);
    if(startRegExp.test(rest)) {
      if(isAloneTag.test(rest)){
        let tag = rest.match(isAloneTag)[1];
        let attrsString = rest.match(isAloneTag)[2] || '';
        let attrs = parseAttrsString(attrsString);
        stack2[stack2.length - 1].children.push({ tag, type: 1, attrs});
        index += tag.length + attrsString.length + 3;
        continue;
      }
      let tag = rest.match(startRegExp)[1];
      let attrsString = rest.match(startRegExp)[2] || '';
      let attrs = parseAttrsString(attrsString);
      stack.push(tag);
      stack2.push({ tag, type: 1, children: [], attrs })
      index += tag.length + attrsString.length + 2;
    } else if(endRegExp.test(rest)){
      let tag = rest.match(endRegExp)[1];
      let stackTagTop = stack[stack.length - 1];
      if(tag === stackTagTop) {
        let startTag = stack.pop();
        let content = stack2.pop();
        
        if(stack2.length) {
          stack2[stack2.length-1].children.push(content);
        } else AST = content;
        index += tag.length + 3;
      } else throw new Error(tag + '没有闭合')
    } else if(wordKey.test(rest)) {
      let word = rest.match(wordKey)[1];
      if(!emptyRegExp.test(word)) {
        stack2[stack2.length - 1].children.push({ text: word, type: 3 });
      }
      index += word.length;
    } else if(wordKey2.test(rest)) {
      let word = rest.match(wordKey2)[1];
      if(!emptyRegExp.test(word)) {
        stack2[stack2.length - 1].children.push({ text: word, type: 3 });
      }
      index += word.length;
    } else {
      index++;
    }
  }
  
  return AST;
}
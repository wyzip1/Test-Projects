import parseAttrsSting from "./parseAttrsSting.js";

export default function (templateString = '') {
    templateString = templateString.trim();
    // 标签栈
    const stack_tag = [];
    // 内容栈
    const stack_content = [];
    // 索引
    let index = 0;
    // 剩余字符串
    let rest = '';
    // 匹配开始标签                     此处匹配attrs
    let startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
    // 匹配结束标签
    let endRegExp = /^\<\/([a-z]+[0-9]?)\>/;
    // 匹配自闭合标签
    let isAloneClone = /^\<([a-z]+[0-9]?)(\s[^\<&\>]+)?\/\>/;
    // 匹配结束标记前的文字
    let wordKey = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
    // 匹配开始标签前的文字
    let wordKey2 = /^([^\<]+)\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
    // 全空文本，由换行符、空格等组成的内容
    let emptyRegExp = /^\s+$/;
    // AST对象
    let AST;
    while (index < templateString.length - 1) {
        rest = templateString.substring(index);
        if (startRegExp.test(rest)) {
            // 判断是否是自闭合标签，是则直接写入其父节点的children数组中
            if (isAloneClone.test(rest)) {
                let aloneCloseTag = rest.match(isAloneClone)[1];
                let attrsString = rest.match(isAloneClone)[2] || '';
                let attrs = parseAttrsSting(attrsString);
                index+=aloneCloseTag.length + attrsString.length + 3;
                stack_content[stack_content.length - 1].children.push({ tag: aloneCloseTag, type: 1, attrs })
                continue;
            } 
            let tag = rest.match(startRegExp)[1]
            let attrsString = rest.match(startRegExp)[2] || '';
            stack_tag.push(tag);
            let attrs = parseAttrsSting(attrsString)
            stack_content.push({ tag, type: 1, children: [], attrs })
            // 索引需要指到tag后面，<>占两位所以加2
            index += tag.length + attrsString.length + 2;
        } else if (endRegExp.test(rest)) {
            let tag = rest.match(endRegExp)[1]
            // 获取当前栈顶标签名
            let stackTopTag = stack_tag[stack_tag.length - 1];
            // 此时栈顶元素与所匹配的结束标签一定是相同的，否则模板中标签未闭合
            if (tag === stackTopTag) {
                let _tag = stack_tag.pop();
                let content = stack_content.pop();
                if (stack_content.length) stack_content[stack_content.length - 1].children.push(content);
                else {
                    AST = content
                }
            } else throw new Error(stackTopTag + '标签未闭合')
            // 索引需要指到tag后面，</>占两位所以加3
            index += tag.length + 3;
        } else if (wordKey.test(rest)) {
            let word = rest.match(wordKey)[1];
            // word的内容不全是空
            if (!emptyRegExp.test(word)) {
                stack_content[stack_content.length - 1].children.push({ text: word, type: 3 });
            }
            index += word.length;
        } else if(wordKey2.test(rest)) {
            let word = rest.match(wordKey2)[1];
            // word的内容不全是空
            if (!emptyRegExp.test(word)) {
                stack_content[stack_content.length - 1].children.push({ text: word, type: 3 });
            }
            index += word.length;
        } else {
            index++;
        }
    }
    return AST;
}

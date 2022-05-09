# VUE中的AST抽象语法树（Abstract Syntax Tree）

## AST 是什么
- AST语法树的本质就是一个js对象

    ```JavaScript
    <!-- 例子 -->
    const ast = {
        tag: 'div',
        type: 1,
        children: [...],
        attrsList: [...],
        attrsMap: [...]
    }
    ```
- AST语法树是模板语法编译为html的一个过渡，为了简化模板的编译过程
- AST语法树并不是vue专有的，比如babel、还有react都有用到
- AST语法树会转变为渲染函数，vue中的h函数，然后生成虚拟dom节点，最后通过diff算法比较后生成真实dom，渲染到页面上

    <img src="https://upload-images.jianshu.io/upload_images/4642829-7cbcce71144146e9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp" />

## vue中的AST

>在vue源码中，有一个函数叫createCompilerCreator，里面调用的parse函数，将template字符串解析成AST语法树，里面最核心的方法就是parseHTML

```JavaScript
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
        optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
        ast: ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    }
});
```

## parse和parseHTML的关系

+ parse: parseHTML是在parse中被调用，主要是负责用正则匹配的方式，逐一循环HTML
    字符串，分类不同匹配项，保存最基本的tagName，attrs，此时属性并没有区
    分是内置属性还是普通属性，只是简单的分隔了属性名和属性值
    
    

+ parseHTML: 从parseHTML解析的基本属性数组中重新解析，区分不同属性做不同处理，普通
    属性与内置属性处理方式是不一样的。并且判断该元素是在哪个位置，也就是确
    定该元素的父节点、兄弟节点、子节点，最终形成ast。

## optimize

> 在createComopilerCreator函数中调用完parse之后还有一个optimize函数，这个函数主要是对静态标签做标记，如果一个父节点的所有子节点都是静态的，那么这个父节点也会被标记为静态节点，在后续的diff比对中，会跳过这些被标记过的节点

```JavaScript
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
}
```

## 词法解析正则

```JavaScript
// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;
```

## AST 字段解释

http://caibaojian.com/vue-design/appendix/ast.html

# AST 简单实现

## 词法解析
> 循环template模版字符串，通过正则判断出其中的标签，属性，内容

### 开始标签判断
```JavaScript
const startRegExp = /^\<([a-z]+[1-6]?)\>/;
```

### 带属性的开始标签
```JavaScript
const startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
```

### 自闭合标签
```JavaScript
const isAloneClose = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\/\>/;
```

### 结束标签
```JavaScript
const endRegExp = /^\<\/([a-z]+[0-9]?)\>/;
```

### 结束标签前的文字
```JavaScript
const wordKey = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
```

### 开始标签前的文字
```JavaScript
const wordKey2 = /^([^\<]+)\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
```


## 判断标签闭合
> 可以通过栈来很方便的判断标签是否闭合

### 例子：判断括号合法
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

[({})[{}()]]

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。

思路：利用栈，循环字符串当遇到左括号则入栈，右括号出栈，判断出栈括号是否与右括号相匹配，循环完毕后判断栈是否为空，
     以上都满足则代表括号合法，否则代表括号未有效闭合

```JavaScript
const isValid = function(s) {
    // 创建括号的关系对应表
    let map = {'(': ')', '[':']', '{':'}'};
    let stack = [];
    for(let i of s){
        // 判断左括号
        if(i in map) stack.push(i);
        // 判断出栈括号对应的右括号是否与此时的右括号一致
        else if(map[stack.pop()]!==i)return false;
    }
    return !stack.length;
};
```


### 标签闭合

    标签闭合的判断思路与上方例子一致，都是通过栈来实现，只是内容从括号变成的tag名称

## attrsString解析
> 属性一般都是以 **id="asf" data="123"** 的形式存在，但是也有 **class="name1 name2 name3"** 的存在，所以不能直接使用 **split(' ')** 来进行暴力分割

    思路：设置一个记录点，记录上一个属性的开始位置；循环字符串，判断当前字符是否处于 **""** 之间，如果是则不管，如果不是，且字符为空，则以此处进行及记录点的位置进行截取，存入数组中，最后对数组元素进行格式化，通过=号分割出属性名和属性值

## 完整代码

```JavaScript
/* parse.js */ 
function parse (templateString = '') {
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
```

```JavaScript
/* parseAttrsString.js */ 
function parseAttrsString(attrsString = '') {
    if (attrsString === '') return [];
    // 去除首位多余空格减少无意义判断，尾部增加一个空格用于标记最后一个元素的结尾位置
    attrsString = attrsString.trim() + ' ';
    // 判断当前是否在引号内 默认开始不在
    let isIn = false;
    // 记录上一个属性开始位置
    let point = 0;
    let attrs = [];
    for (let i = 0; i < attrsString.length; i++) {
        let char = attrsString[i];
        // 遇见引号更改状态
        if (char === '"') isIn = !isIn;
        else if (char === ' ' && !isIn) {
            // 如果不在引号内，且当前为空格，则代表处在属性之间，
            // 根据上一个属性的开始位置截取到当前索引为一个属性
            attrs.push(attrsString.substring(point, i));
            // 重新记录属性的位置
            point = i
        }
    }
    // 格式化 attrs 去除多余空格和引号
    return attrs.map(item => ({
        name: item.split('=')[0].trim(),
        value: valueFormat(item.split('=')[1])
    }));
    
}

function valueFormat(value) {
    if(!value) return true
    return value.trim().replace(/\"/g, '');
}
```
function createElements(ast) {
    if (ast === undefined) return [];
    if (Array.isArray(ast)) {
        let childrens = [];
        for (let i of ast) childrens.push(createElements(i));
        return childrens;
    }

    if (ast.type === 1) {
        const el = document.createElement(ast.tag);
        ast.attrs.forEach(item => {
            el.setAttribute(item.name, item.value);
        })
        createElements(ast.children).forEach(item => el.appendChild(item));
        return el;
    } else if (ast.type === 3) {
        return document.createTextNode(ast.text);
    }
}

export default createElements;
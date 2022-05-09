import parse from "./parse";
import createElements from "./createElements";

export default function ({ el, template }) {
    const app = document.querySelector(el) || document.body;
    const ast = parse(template);
    console.log('AST', ast);
    app.appendChild(createElements(ast));
}
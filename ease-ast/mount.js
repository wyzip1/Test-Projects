import parse from "./parse.js";
import createElement from "./creatElement.js";

export default function({ el, template }) {
  const container = document.querySelector(el) || document.body;

  const ast = parse(template);
  console.log('AST', ast);
  const app = createElement(ast);
  console.log(app);
  container.appendChild(app);
}
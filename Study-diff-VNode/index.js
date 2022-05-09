import { createVNode, patch } from './utils/index.js'

// let v1 = createVNode('section', {}, [
//   createVNode('div', {key: 'A'}, 'QA'),
//   createVNode('h3', {key: 'B'}, 'QB')
// ]);

// let v2 = createVNode('section', {}, [
//   createVNode('div', {key: 'A'}, 'QA'),
//   createVNode('span', {key: 'ADD1'}, 'add1'),
//   createVNode('p', {key: 'ADD2'}, 'add2'),
//   createVNode('h3', {key: 'B'}, 'QB'),
//   createVNode('h1', {key: 'G'}, 'QG'),
//   createVNode('h1', {key: 'D'}, 'QD'),
//   createVNode('h1', {key: 'S'}, 'QS')
// ]);

let v1 = createVNode('ul', {}, [
  createVNode('li', { key: 'A' }, 'QA'),
  createVNode('li', { key: 'B' }, 'QB'),
  createVNode('li', { key: 'C' }, 'QC'),
  createVNode('li', { key: 'D' }, 'QD'),
]);

let v2 = createVNode('ul', {}, [
  createVNode('li', { key: 'S' }, 'QS'),
  createVNode('li', { key: 'A' }, 'QA'),
  createVNode('li', { key: 'B' }, 'QB'),
  createVNode('li', { key: 'C' }, 'QC'),
  createVNode('li', { key: 'D' }, 'QD'),
]);


const container = document.querySelector('#container-self');
const btn = document.querySelector('#btn-self');

patch(container, v1);

let active = v1;
let deActive = v2;


btn.addEventListener('click', () => {
  active = active === v1 ? v2 : v1;
  deActive = active === v1 ? v2 : v1;
  patch(deActive, active);
})
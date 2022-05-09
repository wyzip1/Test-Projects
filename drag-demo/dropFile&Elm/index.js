import './drop-elm.js';
import './drop-file.js'

const draggable = document.getElementById('draggable');

draggable.addEventListener('dragstart', ev => {
  ev.dataTransfer.setData('text/plain', ev.target.id);
  draggable.classList.add('dragging');
})

draggable.addEventListener('dragend', ev => {
  draggable.classList.remove('dragging');
})
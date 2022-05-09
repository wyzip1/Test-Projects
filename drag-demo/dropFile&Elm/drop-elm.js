const dropable = document.getElementById('dropable');

dropable.addEventListener('dragover', ev => {
  ev.preventDefault();
  if(ev.dataTransfer.items[0].type !== 'text/plain') {
    return ev.dataTransfer.dropEffect = 'none';
  } else ev.dataTransfer.dropEffect = 'move'
  dropable.classList.add('over');
})

dropable.addEventListener('dragleave', ev => {
  // dropable.classList.remove('active');
  dropable.classList.remove('over');
})

dropable.addEventListener('drop', ev => {
  console.log('drop-elm');
  ev.preventDefault();
  dropable.classList.remove('over');
  const id = ev.dataTransfer.getData('text/plain');
  const dragElm = document.getElementById(id);
  dropable.appendChild(dragElm);
  dropable.classList.add('active');
})
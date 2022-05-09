const dropFile = document.getElementById('dropFile');

dropFile.addEventListener('dragover', ev => {
  ev.preventDefault();
  if(ev.dataTransfer.items[0].kind !== 'file') {
    ev.dataTransfer.dropEffect = 'none';
    return;
  } else ev.dataTransfer.dropEffect = true;
  dropFile.classList.add('over');
});

dropFile.addEventListener('dragleave', ev => {
  dropFile.classList.remove('over');
  ev.preventDefault();
});

dropFile.addEventListener('drop', ev => {
  console.log('drop-file');
  ev.preventDefault();
  dropFile.classList.remove('over');
  console.log(ev.dataTransfer.items);
  console.log(ev.dataTransfer.types);
  console.log(ev.dataTransfer.files);
  [...ev.dataTransfer.items].forEach(item => {
    if(item.kind === 'file') {
      const file = item.getAsFile();
      createView(file)
    }
  })
});

function createView(imageFile) {
  if(!imageFile.type.startsWith('image/')) return alert('选择文件非图片文件');

  const image = document.createElement('img');
  image.classList.add('image');
  image.src = URL.createObjectURL(imageFile);
  dropFile.appendChild(image);
  dropFile.classList.add('active');
}
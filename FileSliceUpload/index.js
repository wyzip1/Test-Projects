function uploadFile(el) {
  const file = el.files[0];
  uploadSlice(file, 999999999999)
}

function uploadSlice(file, sliceSize = 1024) {
  const upload = (startIndex = 0) => {
    const { blobFile, isLast } = sliceFile(file, startIndex, sliceSize)
    const formData = new FormData();
    formData.append('file', blobFile)
    fetch('uploadFile', {
      method: 'post',
      body: formData
    }).then(res => res.text()).then(info => {
      console.log(info);
      if(isLast) return console.log('所有切片上传完毕');
      upload(startIndex + 1)
    })
  }
  upload()
}

function sliceFile(file, index, sliceSize) {
  const start = index * sliceSize;
  const end = start + sliceSize;
  
  const blob = file.slice(start, end);
  const [filename, ext] = file.name.split('.');
  const blobFile = new File([blob], `${filename}${index}.${ext}`);
  const isLast = end > file.size;
  return { blobFile, isLast }
}
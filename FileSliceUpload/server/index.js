let uploadOriginFile;
let uploadIndex;
let controllAbort = new AbortController();
let signal = controllAbort.signal
let fileUid;

function uploadFile(el) {
  const file = el.files[0];
  uploadOriginFile = file
  fileUid = guid();
  uploadSlice(file, 1024 * 100)
}

function uploadSlice(file, sliceSize = 1024, startIndex = 0) {
  
  const upload = (startIndex) => {
    const { blobFile, isLast } = sliceFile(file, startIndex, sliceSize)
    const formData = new FormData();
    formData.append('file', blobFile)
    fetch('uploadFile', {
      method: 'post',
      body: formData,
      headers: {
        fileuid: fileUid,
        uploadend: isLast ? 'isLast' : 'continue'
      },
      signal
    }).then(res => res.json()).then(info => {
      log(startIndex + 1, Math.ceil(file.size / sliceSize))
      if(isLast) {
        uploadOriginFile = null;
        uploadIndex = null;
        fileUid = null;
        return console.log('所有切片上传完毕', info);
      }
      uploadIndex = startIndex + 1
      upload(uploadIndex)
    })
  }
  upload(startIndex)
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

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function pause() {
  controllAbort.abort()
  controllAbort = new AbortController()
  signal = controllAbort.signal
}

function uploadContinue() {
  uploadSlice(uploadOriginFile, 1024 * 100, uploadIndex)
}

function log(current, total) {
  console.log('上传进度:', `${current}/${total}`);
}
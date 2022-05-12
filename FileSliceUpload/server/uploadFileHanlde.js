const fs = require('fs')
const { parse, resolve } = require('path')

const fileCaches = {}

 function combinFile(fileList, writePath) {
  const bufferList = []
  fileList.forEach(file => {
    const filePath = file.filePath
    bufferList.push(fs.readFileSync(filePath))
    fs.unlinkSync(filePath)
  })
  const buffers = Buffer.concat(bufferList)
  fs.writeFileSync(writePath, buffers)
}

function parseFileName(file) {
  const { ext } = parse(file.originalFilename)
  const filename = file.newFilename + ext
  return [filename, ext]
}

exports.fileQueueAdd = function(uid, file, index = -1) {
    !fileCaches[uid] && (fileCaches[uid] = [])
    const fileList = fileCaches[uid]
    file.filePath = resolve(__dirname, 'upload', file.newFilename)
    if(index === -1) return fileList.push(file)
    const originFile = fileList[index];
    fileList[index] = file
    if(originFile && originFile.filePath !== file.filePath) {
      fs.unlinkSync(originFile.filePath)
    }
    
}

exports.handleLastUpload = function(file, uid) {
  const [filename] = parseFileName(file)
  const fileList = fileCaches[uid]
  combinFile(fileList, resolve(__dirname, 'files', filename))
  delete fileCaches[uid]
  return `http://localhost:3000/files/${filename}`
}
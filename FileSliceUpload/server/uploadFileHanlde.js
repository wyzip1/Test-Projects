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

exports.fileQueueAdd = function(uid, file) {
    !fileCaches[uid] && (fileCaches[uid] = [])
    const fileList = fileCaches[uid]
    file.filePath = resolve(__dirname, 'upload', file.newFilename)
    fileList.push(file)
}

exports.handleLastUpload = function(file, uid) {
  const [filename] = parseFileName(file)
  const fileList = fileCaches[uid]
  combinFile(fileList, resolve(__dirname, 'files', filename))
  delete fileCaches[uid]
  return `http://localhost:3000/files/${filename}`
}
const express = require('express');
const app = express();
const fs = require('fs')
const { resolve, parse } = require('path')
const { IncomingForm } = require('formidable')

app.engine('html', require('ejs').__express)
app.set('view engine', 'html'); 

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.render('index')
})

const fileCaches = {}

app.post('/uploadFile', (req, res) => {
  const form = new IncomingForm({ uploadDir: './upload' });
  form.parse(req, (err, _, { file }) => {
    if(err) throw err
    const responseJson = { success: true, file }

    const fileUid = req.headers.fileuid;
    !fileCaches[fileUid] && (fileCaches[fileUid] = [])
    const fileList = fileCaches[fileUid]
    const uploadSliceFile = { 
      filePath: resolve(__dirname, 'upload', file.newFilename),
      originName: file.originalFilename, 
      newName: file.newFilename 
    }
    fileList.push(uploadSliceFile)
    
    if(req.headers.uploadend === 'isLast') {
      const { ext } = parse(uploadSliceFile.originName)
      const filename = uploadSliceFile.newName + ext
      combinFile(fileList, resolve(__dirname, 'files', filename))
      responseJson.url = `http://localhost:3000/files/${filename}`
      delete fileCaches[fileUid]
    };
    res.json(responseJson)
  })
})

app.listen(3000, () => {
  console.log('Server run at http://localhost:3000');
})

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
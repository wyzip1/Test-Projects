const express = require('express');
const app = express();

const { IncomingForm } = require('formidable')
const { fileQueueAdd, handleLastUpload } = require('./uploadFileHanlde')

app.engine('html', require('ejs').__express)
app.set('view engine', 'html');

app.use(express.static(__dirname + '/'));

// 设置允许跨域访问该服务
app.all('*', (req, res, next) => {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type,file-uid,upload-end,file-index");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.sendStatus(200); //让options尝试请求快速结束
  else
    next();
});

app.get('/', (_, res) => {
  res.render('index')
})

app.post('/uploadFile', (req, res) => {
  const form = new IncomingForm({ uploadDir: './upload' });
  form.parse(req, (err, _, { file }) => {
    if (err) return console.log(err);
    const responseJson = { success: true, file }
    const fileUid = req.headers['file-uid']
    const fileIndex = req.headers['file-index']
    fileQueueAdd(fileUid, file, fileIndex)
    const isLast = req.headers['upload-end'] === 'isLast'
    if (isLast) responseJson.url = handleLastUpload(file, fileUid)
    res.json(responseJson)
  })
})

app.listen(3000, () => {
  console.log('Server run at http://localhost:3000');
})
const express = require('express');


const app = express();
const WXBizDataCrypt = require('./WXBizDataCrypt');

app.use(express.json());

//设置跨域访问
app.all('*', function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*');
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})

app.post('/decrypt', (req, res) => {
  const {appId, sessionKey, encryptedData, iv} = req.body;
  const pc = new WXBizDataCrypt(appId, sessionKey)
  const data = pc.decryptData(encryptedData, iv);
  res.json(data);
});

module.exports = app;
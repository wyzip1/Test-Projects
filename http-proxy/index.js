const http = require('http');
const httpProxy = require('http-proxy');
const axios = require('axios');

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:8000'
  })
});

server.listen(3000, () => {
  axios.get('http://localhost:3000/test').then(res => {
    console.log(res.data);
  })
});

const targetServer = http.createServer((req, res) => {
  console.log('targetServer 被访问', req.url);
  res.end('1111')
})

targetServer.listen(8000);
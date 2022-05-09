const express = require('express');
const app = express();
const fs = require('fs')

app.engine('html', require('ejs').__express)
app.set('view engine', 'html'); 

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/uploadFile', (req, res) => {
  let chunk;
  req.on('data', (data) => {
    if(!chunk) chunk = data;
    else {
      console.log(chunk);
      chunk.concat(data);
    }
  })
  req.on('end', () => {
    const filename = chunk.toString().match(/filename="(.+)"/)[1]
    const buffer = Buffer.from(chunk, 'binary')
    console.log(buffer);
    fs.writeFileSync('./upload/' + filename, buffer)
    console.log('end', chunk);
    res.send('end')
  })
})

app.listen(3000, () => {
  console.log('Server run at http://localhost:3000');
})
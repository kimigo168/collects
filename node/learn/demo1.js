const http = require('http') // 引入http模块
const fs = require('fs')
const url = require('url')
const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain')
  let urlData = url.parse(req.url)
  console.log(`urlData${urlData.href}`)
  if (req.url !== '/favicon.ico') {
    let out = fs.createWriteStream('./log.txt');
    out.write(`请求方法：${req.method} \n`)
    out.write(`请求url：${req.url} \n`)
    out.write(`请求头对象：${JSON.stringify(req.headers, null, 4)} \n`)
    out.write(`请求http版本：${req.httpVersion} \n`)
  }
  res.end('Hello World\n')
})

server.timeout = 8000; // 8秒请求超时
server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})

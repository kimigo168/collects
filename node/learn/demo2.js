const http = require('http')
const url = require('url')

const hostname = '127.0.0.1'
const port = 3000

function parsetime(time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}
function unixtime(time) {
  return { unixtime: time.getTime() }
}
const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  console.log('parsedUrl', parsedUrl.query)
  let time = new Date(parsedUrl.query.iso)
  console.log('time', time);
  let result = '';
  // 主页，返回当前时间json
  if (req.url === '/') {
    result = parsetime(new Date())
    console.log('11')
  } else if (/^\/api\/parsetime/.test(req.url)) {
    result = parsetime(time)
    console.log('22')
  } else if (/^\/api\/unixtime/.test(req.url)) {
    result = unixtime(time)
    console.log('33')
  } else {
    console.log('44', req.url)
  }

  if (result) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(result))
  } else {
    res.writeHead(404);
    res.end();
  }
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在http://${hostname}:${port}`)
})
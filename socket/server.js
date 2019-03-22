const http = require('http');
const Server = require('ws').Server;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
}).listen(3000, () => {
  console.log("Server has started.");
})


// 这里设置服务器的端口，和上面3000
const ws = new Server({port: 9999})
ws.on('connection', (socket) => {
  // 监听客户端发来的消息
  socket.on('message', (msg) => {
    console.log('msg', msg)
    socket.send(`这是服务端对你的对话：<span>${msg}</span>`)
  });
})

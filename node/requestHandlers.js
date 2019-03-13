const exec = require('child_process').exec;
const queryString = require('querystring');
const fs = require('fs')

function start (response) {
  console.log('Request handler start was called.')
  
  // exec('find /', { timeout: 10000, maxBuffer: 20000*1024}, (err, stdout, stderr) => {
  //   response.writeHead(200, {'Content-Type': 'text/plain'});
  //   response.write(stdout);
  //   response.end();
  // });
  let body = `<html>
                <head>
                  <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
                </head>
                <body>
                  <form action="/upload" enctype="multipart/form-data" method="post">
                    <input type="file" name="upload" />
                    <input type="submit" value="Upload file" />
                  </form>
                </body>
            </html>`;
  response.writeHead(200, {'Content-Type': 'text/html'}); // text/plain返回数据,text/html返回html
  response.write(body);
  response.end();
}

function upload (response, request) {
  console.log('Request handler upload was called.')
  var form = new formidable.IncomingForm();
  console.log('about to parse')
  form.parse(request, (error, fields, files) => {
    console.log('parsing done')
    fs.renameSync(files.upload.path, '/tmp/test.jpg')
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write('Received image:<br/>')
    response.write(`<img src="/show" />`)
    response.end();
  })
}

function show (response) {
  console.log('Request handler show was called.')
  fs.readFile('/tmp/test.jpg', 'binary', (error, file) => {
    if (error) {
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.write(error + '\n');
      response.end();
    } else {
      response.writeHead(200, {'Content-Type': 'image/jpg'});
      response.write(file, 'binary');
      response.end();
    }
  })
}

exports.start = start;
exports.upload = upload;
exports.show = show;
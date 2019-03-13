var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    // var pathname = url.parse(request.url).pathname;
    // route(handle, pathname, response);
    let postData = ''
    let pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
    // request.setEncoding('utf8');
    // request.addListener('data', (postDataChunk) => {
    //   postData += postDataChunk;
    //   console.log(`Received POST data chunk ${postDataChunk}.`)
    // })
    // request.addListener('end', () => {
    //   route(handle, pathname, response, postData);
    // });
  }
  http.createServer(onRequest).listen(8886);
  console.log("Server has started.");
}

exports.start = start;

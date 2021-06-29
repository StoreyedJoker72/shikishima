let http = require('http');

http.createServer(function (req, res) {
  res.write("Official Shikishima Bot");
  res.end();
}).listen(8080);
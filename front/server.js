const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Parse URL and remove query string
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  let filePath = '.' + (pathname === '/' ? '/index.html' : pathname);
  filePath = path.resolve(filePath);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(path.resolve('.'))) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

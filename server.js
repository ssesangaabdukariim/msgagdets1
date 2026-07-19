const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;
// We set your main dashboard as the default landing page
const mainPage = path.join(rootDir, 'MSGAGDETS1.html');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  // If user visits the homepage, serve your main dashboard
  if (pathname === '/') {
    sendFile(res, mainPage);
    return;
  }

  // Sanitize path to prevent security issues
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const requestedPath = path.join(rootDir, safePath);

  // Check if file exists and serve it
  if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    sendFile(res, requestedPath);
  } else {
    // If file isn't found, try to redirect to main page or return 404
    sendFile(res, mainPage); 
  }
});

server.listen(port, () => {
  console.log(`MS-GADGETS app running on http://localhost:${port}`);
});

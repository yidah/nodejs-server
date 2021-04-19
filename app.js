const http = require('http');
const fs = require('fs');

// create Server receives  function that will execute for every incoming request
const server = http.createServer((req, res) => {
  // we recive from client
  //console.log(req.url, req.method, req.headers);
  const url = req.url;
  const method = req.method;

  // response when user navigates http//localhost:3000
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Click Me!</button></form></body>'
    );
    res.write('<html>');
    return res.end();
  }

  // user uses form  with POST action and handle data sent
  if (url === '/message' && method === 'POST') {
    const body = [];
    // Subscribing with req.on to event 'data' when data are recieved as chunks
    // in this case  from our form
    req.on('data', (chunk) => {
      // Chunk data example <Buffer 6d 65 73 73 61 67 65 3d 4d 69 2b 6d 61 6d 61 2b 6d 65 2b 6d 69 6d 61>
      console.log('a chunk', chunk);
      body.push(chunk);
    });

    // Subscribing with req.on to event 'end' once of the chunks are transmited
    // we parse them using Buffer provided by Nodejs
    return req.on('end', () => {
      // I know what my data is string so I use toString if a file we have to do something different
      const parsedBody = Buffer.concat(body).toString();
      // parsed body with Buffer example message=Mi+mama+me+mima
      // "message"  is the name of the input in the form "Mi+mama+me+mima" the value
      console.log('parsed body with Buffer', parsedBody);
      const message = parsedBody.split('=')[1];
      // writeFileSync blocks code until writing the file ends for small file is ok but not for huge one
      // it is better writeFile
      // fs.writeFileSync('message.txt', message);
      fs.writeFile('message.txt', message, (err) => {
        // 302 means redirection, in this case to /
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  // we sent to client
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My node js server</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('<html>');

  // do not write after end
  res.end();

  // stops server (normally we want server to keep listening)
  // process.exit;
});

// in production will take the default port 80
// in development we will use 3000 port and will access the
// server by navigating to http:localhost:3000
server.listen(3000);

const http = require('http');
const fs = require('fs');

// create Server receives  function that will execute for every incoming request
const server = http.createServer((req, res)=>{
    // we recive from client
    //console.log(req.url, req.method, req.headers);
     const url  = req.url;
     const method = req.method;

    // response when user navigates http//localhost:3000
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Click Me!</button></form></body>');
        res.write('<html>');
        return res.end();
    }

    // user uses form  with POST action and handle data sent
    if (url === '/message' && method === 'POST'){
        const body = [];

        // Data is recieved as chunks with req.on 
        //we listen for data sent from the user (in this case form)
        req.on('data', (chunk)=> {
            console.log(chunk);
            body.push(chunk);
        });

        // once of the chunks are transmited we parse them 
        // using Buffer
        req.on('end', ()=>{
            // Buffer is provided by Nodejs
            // I know what my data is string so I use toString if a file we have to do something different
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message);
        });

        // 302 means redirection to in this case /
        res.statusCode = 302; 
        res.setHeader('Location', '/');
        return res.end();

    }

    // we sent to client 
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My node js server</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('<html>');
    
    // no write after end
    res.end();

    // stops server (normally we want server to keep listening)
    // process.exit;

});

// in production will take the default port 80
// in development we will use 3000 port and will access the 
// server by navigating to http:localhost:3000 
server.listen(3000);
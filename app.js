//imports
const http = require('http');
const routes = require('./routes');

// create Server receives  function that will execute for every incoming request
const server = http.createServer(routes);

// in production will take the default port 80
// in development we will use 3000 port and will access the
// server by navigating to http:localhost:3000
server.listen(3000);

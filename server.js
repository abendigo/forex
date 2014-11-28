var restify = require('restify');
var api = require('./src/api');

var server = restify.createServer({
    // certificate: ...,
    // key: ...,
    // formatters: ...,
    // log: ...,
    name: "MyApp"
});

var service = api(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
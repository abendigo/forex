var restify = require('restify');
var bunyan = require('bunyan');

var stream = require('./src/stream');
var api = require('./src/api');

var log = bunyan.createLogger({
        name: 'name',
        stream: process.stdout,
        level: 'info'
    });

var server = restify.createServer({
    // certificate: ...,
    // key: ...,
    // formatters: ...,
    log: log,
    name: "MyApp"
});

// server.use(restify.requestLogger({
//         name: 'req', 
//         stream: process.stdout
//     }));

// server.on('after', restify.auditLogger({
//   log: bunyan.createLogger({
//     name: 'audit',
//     stream: process.stdout
//   })
// }));

var service = api.api({
        server: server,
        log: log 
    });

// var client = stream({
//         hooks: api.getHooks(),
//         token: "TOKEN"
//     }); 

server.listen(9001, function() {
  log.info('%s listening at %s', server.name, server.url);
});
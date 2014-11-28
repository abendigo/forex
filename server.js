var restify = require('restify');

var server = restify.createServer({
    // certificate: ...,
    // key: ...,
    // formatters: ...,
    // log: ...,
    name: "MyApp"
});

server.get('/api/info', function(request, response, next) {
    response.send({
        hello: 'world',
        hooks: server.router.render('resthooks')
    });

    next();
});

var subscriptions = [];


server.get({
        name: 'resthooks',
        path: '/api/subscription'
    }, function(request, response, next) {
        response.send(subscriptions);
        next();
    });
server.post('/api/subscription', function(request, response, next) {
    subscriptions.put({
        target: "https://foo.com",
        event: "event",
        id: 1
    });
});
server.get('/api/subscription/:id', function(request, response, next) {

});
server.put('/api/subscription/:id', function(request, response, next) {

});
server.del('/api/subscription/:id', function(request, response, next) {

});


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
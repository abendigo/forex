var restify = require('restify');

var api = function(server) {
    server.use(restify.bodyParser());

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
//        console.log('-------', request.body);
        subscriptions.push(request.body);
        response.send(200);
        // subscriptions.put({
        //     target: "https://foo.com",
        //     event: "event",
        //     id: 1
        // });
        next();
    });
    server.get('/api/subscription/:id', function(request, response, next) {

    });
    server.put('/api/subscription/:id', function(request, response, next) {

    });
    server.del('/api/subscription/:id', function(request, response, next) {

    });

}

module.exports = api;

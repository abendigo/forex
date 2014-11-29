var restify = require('restify');

var subscriptions = {};

function getHooks() {
    return subscriptions;
}

var api = function(config) {
    config = config || {};

    var server = config.server;
    var log = config.log;
    
    server.use(restify.bodyParser());

    server.get('/api/info', function(request, response, next) {
        response.send({
            hello: 'world',
            hooks: server.router.render('resthooks')
        });

        next();
    });

    var index = 1;

    server.get({
            name: 'resthooks',
            path: '/api/subscription'
        }, function(request, response, next) {
            response.send(Object.keys(subscriptions).map(function(i) {return subscriptions[i];}));
            next();
        });
    server.post('/api/subscription', function(request, response, next) {
        subscriptions[index] = {
                target: request.body.target_url,
                event: request.body.event,
                id: index
            };
        index += 1;
        response.send(200);
        next();
    });
    server.get('/api/subscription/:id', function(request, response, next) {
        response.send(200, subscriptions[request.params.id]);
        next();
    });
    server.put('/api/subscription/:id', function(request, response, next) {
        subscriptions[request.params.id] = {
                target: request.body.target_url,
                event: request.body.event,
                id: request.params.id
            };
        response.send(200);
        next();
    });
    server.del('/api/subscription/:id', function(request, response, next) {
        delete subscriptions[request.params.id];
        response.send(200);
        next();
    });

    server.get('/api/trigger/:id', function(request, response, next) {
        var client = restify.createJsonClient({
            url: subscriptions[request.params.id].target
        });
        client.post(subscriptions[request.params.id].target, {
            
        }, function(err, request, response, payload) {
            console.log('err', err);
            console.log('payload', payload);
        });
        response.send(200);
        next();
    });

}

module.exports = {
    api: api,
    getHooks: getHooks
};

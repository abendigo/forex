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
        log.info('GET /api/info');
        response.send({
            hello: 'world',
            hooks: server.router.render('resthooks')
        });

        next();
    });

    server.get('/api/accounts', function(request, response, next) {
        log.info('GET /api/accounts');
        log.info('Authorization', request.headers.authorization);

        var client = restify.createJsonClient({
                url: 'https://api-fxtrade.oanda.com'
            });
        client.get({
                path: '/api/v1/accounts',
                headers: {"Authorization": request.headers.authorization}
            }, function(err, request, response, payload) {
                response.send(payload);
                next();
            }));
    });

    var index = 1;

    server.get({
            name: 'resthooks',
            path: '/api/subscription'
        }, function(request, response, next) {
            log.info('GET /api/subscription');
            response.send(Object.keys(subscriptions).map(function(i) {return subscriptions[i];}));
            next();
        });
    server.post('/api/subscription', function(request, response, next) {
            log.info('POST /api/subscription', index, request.body.event);
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
        log.info('GET /api/subscription/', request.params.id);
        response.send(200, subscriptions[request.params.id]);
        next();
    });
    server.put('/api/subscription/:id', function(request, response, next) {
        log.info('PUT /api/subscription/', request.params.id);
        subscriptions[request.params.id] = {
                target: request.body.target_url,
                event: request.body.event,
                id: request.params.id
            };
        response.send(200);
        next();
    });
    server.del('/api/subscription/:id', function(request, response, next) {
        log.info('DELETE /api/subscription/', request.params.id);
        delete subscriptions[request.params.id];
        response.send(200);
        next();
    });

    server.get('/api/trigger/:id', function(request, response, next) {
        log.info('GET /api/trigger/', request.params.id);
        var client = restify.createJsonClient({
            url: subscriptions[request.params.id].target
        });
        client.post(subscriptions[request.params.id].target, {
            id: 760264812,
            accountId: 5137271,
            time: '2014-11-29T16:42:56.000000Z',
            type: 'MARKET_IF_TOUCHED_ORDER_CREATE',
            instrument: 'AUD_JPY',
            units: 5,
            side: 'sell',
            price: 100.778,
            expiry: '2014-11-29T17:42:56.000000Z',
            reason: 'CLIENT_REQUEST'
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

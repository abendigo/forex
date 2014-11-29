var restify = require('restify');

var stream = function(config) {
    config = config || {};

    var hooks = config.hooks;
    console.log('config', config);

    var access_token = 'd1fe909f6fbbb9940b7ce93bd7e419b6-bd66d87e616c7c69c4cb5302f07e6ec4'
    var client = restify.createClient({
        url: 'https://stream-fxpractice.oanda.com'
    });
    client.get({
        path: '/v1/events',
        headers: {"Authorization" : "Bearer " + access_token}
    }, function(err, request) {
        request.on('result', function(err, response) {
            console.log('result', err);

            response.on("data", function(data) {
                var json = JSON.parse(data.toString());
                console.log("data", json);

                Object.keys(hooks).map(function(i) {
                    var hook = hooks[i];
                    if (json[hook.event]) {
                        console.log('POST', hooks[i].target);
                        var client = restify.createJsonClient({
                            url: hooks[i].target
                        });
                        client.post(subscriptions[request.params.id].target, json[hook.event], 
                            function(err, request, response, payload) {
                                console.log('err', err);
                                console.log('payload', payload);
                            });                        
                    }
                });
            });
            response.on("end", function(chunk) {
                console.log("Error connecting to OANDA HTTP Rates Server");
                console.log("HTTP - " + response.statusCode);
                console.log(bodyChunk);
                process.exit(1);
            });
        });
    });
};

module.exports = stream;
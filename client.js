var restify = require('restify');

var client = restify.createJsonClient({
    url: 'http://localhost:8080'
});

client.get('/api/info', function(err, request, response, payload) {
    console.log('err', err);
    console.log('payload', payload);
});
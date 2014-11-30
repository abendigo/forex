var restify = require('restify');
var bunyan = require('bunyan');
var api = require('../../src/api.js');

var wrapper = function() {
//    this.World = require("../support/world.js").World;
    var world = this;
    var server = null;

    this.registerHandler('AfterScenario', function(event, callback) {
        if (server != null && server.started)
            server.close();
        callback();
    });

    this.Given(/^a running server$/, function (callback) {
        var log = bunyan.createLogger({name: 'testing', streams: []});
        server = restify.createServer({log: log});
        world.service = api.api({
                server: server,
                log: log
            });

        server.listen(8080, function() {
            server.started = true;
            callback();
        });
    });
}

module.exports = wrapper;
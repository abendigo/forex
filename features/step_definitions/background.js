var restify = require('restify');
var api = require('../../src/api.js');

var wrapper = function() {
//    this.World = require("../support/world.js").World;
    var world = this;
    var server = null;

    this.registerHandler('AfterScenario', function(event, callback) {
        if (server != null)
            server.close();
        callback();
    });

    this.Given(/^a running server$/, function (callback) {
        var log = bunyan.createLogger({name: 'testing', streams: []});
        server = restify.createServer({log: log});
        world.service = api({
                server: server,
                log: log
            });

        server.listen(8080, function() {
             callback();
        });
    });
}

module.exports = wrapper;
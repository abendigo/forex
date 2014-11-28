var restify = require('restify');

var wrapper = function() {
//    this.World = require("../support/world.js").World;
    var payload;

    this.When(/^I GET \/api\/info$/, function (callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        client.get('/api/info',function(err, request, response, obj) {
            client.close();
            if (err != null)
                callback.fail();
            else {
                payload = obj;
                callback();
            }
        });
    });

    this.Then(/^I see something$/, function (callback) {
        if (payload != null)
            callback();
        else
            callback.fail();
    });
}

module.exports = wrapper;
var restify = require('restify');
var assert = require('assert');

var wrapper = function() {
//    this.World = require("../support/world.js").World;

    this.Given(/^I have no hooks registered$/, function (callback) {
        callback();
    });

    var subscribe = function(client, callback) {
        client.post('/api/subscription', {
            subscription_url: 'https://example.com/',
            target_url: 'https://example.com/',
            event: 'transactions'
        }, function(err, request, response, obj) {
            callback();
        });
    };

    this.Given(/^I have one hook registered$/, function (callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        subscribe(client, function() {
            client.close();
            callback();
        });
    });

    this.Given(/^I have multiple hooks registered$/, function (callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        subscribe(client, function() {
            subscribe(client, function() {
                client.close();
                callback();
            });
        });
    });

    this.When(/^I GET \/api\/subscription$/, function (callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        client.get('/api/subscription', function(err, request, response, obj) {
            client.close();
            if (err != null) {
                callback.fail();
            } else {
                payload = obj;
                callback();
            }
        });
    });

    this.When(/^I subscribe to transactions$/, function (callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        client.post('/api/subscription', {
            subscription_url: 'https://zapier.com/hooks/standard/t2X7Q864FoHUa6U9Q6qozL0gxssIcGaM/',
            target_url: 'https://zapier.com/hooks/standard/t2X7Q864FoHUa6U9Q6qozL0gxssIcGaM/',
            event: 'transactions'
        }, function(err, request, response, obj) {
            statusCode = response.statusCode;
            client.close();

            assert.ifError(err);
            payload = obj;
            callback();
        });
    });

    this.When(/^I GET \/api\/subscription\/(\d+)$/, function (id, callback) {
        var client = restify.createJsonClient({
            url: 'http://localhost:8080'
        });
        client.get('/api/subscription/' + id, function(err, request, response, obj) {
            client.close();

            assert.ifError(err);
            payload = obj;
            callback();
        });
    });

    this.Then(/^an Empty List is returned$/, function (callback) {
        if (payload != null && payload.length == 0)
            callback();
        else
            callback.fail();
    });

    this.Then(/^an List containing one entry is returned$/, function (callback) {
        if (payload != null && payload.length == 1)
            callback();
        else
            callback.fail();
    });

    this.Then(/^an List containing multiple entries is returned$/, function (callback) {
        if (payload != null && payload.length > 1)
            callback();
        else
            callback.fail();
    });

    this.Then(/^details are returned$/, function (callback) {
        assert.ok(payload);
        callback();
    });

    this.Then(/^a (\d+) status code is returned$/, function (expected, callback) {
        assert.equal(expected, statusCode);
        callback();
    });    

    this.Then(/^a Subscription ID is returned$/, function (callback) {
        assert.equal(1, payload.id);
        callback();
    });

    this.Then(/^a link to fetch details is returned$/, function (callback) {
        assert.equal('/api/subscription/1', payload.subscription);
        callback();
    });
}

module.exports = wrapper;
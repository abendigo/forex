var wrapper = function() {
//    this.World = require("../support/world.js").World;
    var payload;

    this.Given(/^a running server$/, function (callback) {
        callback();
    });
}

module.exports = wrapper;
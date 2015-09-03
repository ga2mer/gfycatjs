var Promise = require('bluebird');
var getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("error", function() {
            reject(this.response);
        });
        xhr.addEventListener("load", function() {
            resolve(JSON.parse(this.response));
        });
        xhr.open("GET", url);
        xhr.send(null);
    });
};
module.exports = {
    getJSON: getJSON
};
var Promise = require('bluebird');
var Request = Promise.promisify(require('request'));

function getJSON(url) {
    return Request(url).spread(function(res, body) {
        if (res.statusCode == 404) throw new Error(404);
        return JSON.parse(body);
    });
}
module.exports = {
    get: function(id, callback) {
        return getJSON('http://gfycat.com/cajax/get/' + id).then(function(json) {
            if (json.error) throw json.error;
            return json.gfyItem;
        }).nodeify(callback);
    },
    transcode: function(url, callback) {
        return getJSON('http://upload.gfycat.com/transcode?fetchUrl=' + url).then(function(json) {
            if (json.task == 'error') throw json.error;
            return json;
        }).nodeify(callback);
    },
    checkURL: function(url, callback) {
        return getJSON('http://gfycat.com/cajax/checkUrl/' + url).then(function(json) {
            if (!json.urlKnown) throw 'URL not found';
            return json;
        }).nodeify(callback);
    },
    checkStatus: function(randomString, callback) {
        return getJSON('http://upload.gfycat.com/status/' + randomString).then(function(json) {
            if (json.task == 'NotFoundo') throw 'RandomString not found';
            return json;
        }).nodeify(callback);
    },
    transcodeRelease: function(url, callback) {
        var random = Math.random().toString(36).substring(7);
        return getJSON('http://upload.gfycat.com/transcodeRelease/' + random + '?fetchUrl=' + url).then(function(json) {
            if (json.task == 'error') throw json.error;
            return random;
        }).nodeify(callback);
    }
};
var Promise = require('bluebird');
var util = require('./util.js');
function getJSON(url) {
    return Promise.resolve(util.getJSON(url));
}
var get = function(id, callback) {
    return getJSON('http://gfycat.com/cajax/get/' + id).then(function(json) {
        if (json.error) throw json.error;
        return json.gfyItem;
    }).nodeify(callback);
};
var transcode = function(url, callback) {
    return getJSON('http://upload.gfycat.com/transcode?fetchUrl=' + url).then(function(json) {
        if (json.task == 'error') throw json.error;
        return json;
    }).nodeify(callback);
};
var checkURL = function(url, callback) {
    return getJSON('http://gfycat.com/cajax/checkUrl/' + url).then(function(json) {
        if (!json.urlKnown) throw 'URL not found';
        return json;
    }).nodeify(callback);
};
var checkStatus = function(randomString, callback) {
    return getJSON('http://upload.gfycat.com/status/' + randomString).then(function(json) {
        if (json.task == 'NotFoundo') throw 'RandomString not found';
        return json;
    }).nodeify(callback);
};
var transcodeRelease = function(url, callback) {
    var random = Math.random().toString(36).substring(7);
    return getJSON('http://upload.gfycat.com/transcodeRelease/' + random + '?fetchUrl=' + url).then(function(json) {
        if (json.task == 'error') throw json.error;
        return random;
    }).nodeify(callback);
};
module.exports = {
    get: get,
    transcode: transcode,
    transcodeRelease: transcodeRelease,
    checkStatus: checkStatus,
    checkURL: checkURL
};
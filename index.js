var Promise = require('bluebird');
var api = require('./api');
var get = function(id, callback) {
    return api.get(id, callback);
};
var transcode = function(url, callback) {
    return api.transcode(url, callback);
};
var checkURL = function(url, callback) {
    return api.checkURL(url, callback);
};
var checkStatus = function(randomString, callback) {
    return api.checkStatus(randomString, callback);
};
var checkOrComplete = function(randomString) {
    return checkStatus(randomString).then(function(res) {
        if (res.task == 'error') throw res.error;
        if (['fetching', 'fetchingURL', 'uploading', 'encoding'].indexOf(res.task) != -1) return Promise.resolve(randomString).delay(1000).then(checkOrComplete);
        if (res.task == 'complete') return get(res.gfyname);
    });
};
var transcodeRelease = function(url, callback) {
    return api.transcodeRelease(url).then(checkOrComplete).nodeify(callback);
};
module.exports = {
    api: api,
    get: get,
    transcode: transcode,
    transcodeRelease: transcodeRelease,
    checkStatus: checkStatus,
    checkURL: checkURL
};
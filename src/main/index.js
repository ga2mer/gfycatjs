var Promise = require('bluebird');
var api = require('./lib/api');
var events = require('events');
var eventEmitter;
var get = function(id, callback) {
    return api.get(id, callback);
};
var getEE = function(id, callback) {
    return api.get(id, function(err, res) {
        if (err) eventEmitter.emit('error', res);
        eventEmitter.emit('complete', res);
    });
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
var checkOrCompleteEE = function(randomString) {
    return checkStatus(randomString).then(function(res) {
        if (res.task == 'error') eventEmitter.emit('err', res.error);
        else if (['fetching', 'fetchingURL', 'uploading', 'encoding'].indexOf(res.task) != -1) {
            eventEmitter.emit(res.task);
            return Promise.resolve(randomString).delay(1000).then(checkOrCompleteEE);
        } else if (res.task == 'complete') return getEE(res.gfyname);
    });
};
var transcodeRelease = function(url, callback) {
    return api.transcodeRelease(url).then(checkOrComplete).nodeify(callback);
};
var transcodeReleaseEvent = function(url, callback) {
    eventEmitter = new events.EventEmitter();
    api.transcodeRelease(url).then(checkOrCompleteEE);
    return callback(eventEmitter);
};
module.exports = {
    api: api,
    get: get,
    transcode: transcode,
    transcodeRelease: transcodeRelease,
    transcodeReleaseEvent: transcodeReleaseEvent,
    checkStatus: checkStatus,
    checkURL: checkURL
};
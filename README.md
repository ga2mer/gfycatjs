API wrapper and lib for working with gfycat for node.js and browserify
=========================
Install
-------
```
npm install gfycatjs
```
Usage example
-------------
##### API wrapper
```js
var gfycatApi = require('gfycatjs').api;
gfycatApi.get('FelineThirstyKangaroo', function(err, res) {
    if (err) return console.log(err); // get error string
	console.log(res); // get object with info about this gfy
});
```
##### Working with lib
```js
var gfycat = require('gfycatjs');
gfycat.get('FelineThirstyKangaroo', function(err, res) {
    if (err) return console.log(err); // get error string
	console.log(res); // get object with all info about this gfy
});
gfycat.transcodeReleaseEvent('https://media3.giphy.com/media/ZNoP4o13sUxHO/200.gif', function(res) {
    res.on('err', function(err) {
        console.error(err);
    }).on('fetching', function() {
        console.log('fetching', '10%');
    }).on('fetchingURL', function() {
        console.log('fetchingURL', '30%');
    }).on('uploading', function() {
        console.log('uploading', '60%');
    }).on('encoding', function() {
        console.log('encoding', '90%');
    }).on('complete', function(complete) {
        console.log('complete', '100%');
        console.log(complete.mp4Url);
    });
});
```

##### All api methods
```js
get(id, callback); // get object with info about this gfy
transcode(url, callback); //upload gif, will hold the connection open until your conversion is complete and return object with info or error 30 sencods timeout
checkURL(url, callback); // check url on exists and return object with info about this gfy/url and name or urlKnown = false
checkStatus(randomString, callback); // check status gfy conversion(transcodeRelease)
transcodeRelease(url, callback); // start upload gif by url and return random string for checkStatus
```
##### All lib methods
```js
get(id, callback); // get object with info about this gfy
transcode(url, callback); //upload gif by url, will hold the connection open until your conversion is complete and get object with info or error 30 sencods timeout
checkURL(url, callback); // check url on exists and get object with info about this gfy/url and name or urlKnown = false
checkStatus(randomString, callback); // check status gfy conversion(transcodeRelease)
transcodeRelease(url, callback); // start upload gif by url, checkStatus while task will not == 'complete' and get object with info about this gfy
transcodeReleaseEvent(url, callback); // return eventemitter with status conversion (err, fetching, fetchingURL, uploading, encoding, complete(gfy))
```
TO-DO
=====
- [x] Status of uploading and conversion gif
- [ ] Upload local file
- [ ] CLI
- [ ] Refactoring code

Thanks to
=========
- [thepheer](https://github.com/thepheer) behind rewriting code to [Promise](https://www.npmjs.com/package/bluebird)
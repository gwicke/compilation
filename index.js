'use strict';

var P = require('bluebird');
var backendModules = require('./lib/index');

function DeeJay(options) {
    // TODO: merge default options in
    this._options = options = options || this._defaultOptions;
    var backends = this._backends = {};
    Object.keys(options.backends).forEach(function(name) {
        backends[name] = new backendModules[name](options.backends[name]);
    });
    this._backendNames = Object.keys(this._backends);
}

DeeJay.prototype._defaultOptions = {
    backends: {
        lastfm: {
            apiKey: 'bb9b81026cd44fd086fa5533420ac9b4',
            apiSecret: '2309a40ae3e271de966bf320498a8f09',
        },
        pandora: {},
        spotify: {},
    },
    weights: {
        similarArtists: {
            lastfm: 1.0,
            pandora: 1.0,
            spotify: 1.0,
        },
        similarTracks: {
            lastfm: 1.0,
        }
    }
};

DeeJay.prototype._mergeRankings = function(results, operation) {
    var self = this;
    var by = {
        key: {},
        id: {},
    };
    var resultKeys = Object.keys(results);
    resultKeys.forEach(function(backendName) {
        var backendWeight = self._options.weights[operation][backendName];
        if (!results[backendName]) {
            return;
        }
        results[backendName].forEach(function(res) {
            // Scale each backend's result by its weight.
            res.similarity *= backendWeight;
            Object.keys(by).forEach(function(k) {
                if (by[k][res.key]) {
                    by[k][res.key].push(res);
                } else {
                    by[k][res.key] = [res];
                }
            });
        });
    });

    function sortBySimilarity(array) {
        array.sort(function(a, b) {
            return b.similarity - a.similarity;
        });
        return array;
    }

    // Really only by key is likely to work for now.
    var mergedResults = [];
    Object.keys(by.key).forEach(function(key) {
        var results = by.key[key];
        // Calculate the weighted similarity score.
        var similarity = 0;
        sortBySimilarity(results);
        results.forEach(function(res) {
            similarity += res.similarity;
        });
        results[0].similarity = similarity / resultKeys.length;
        // Represent the merged cluster with the data from the first result.
        mergedResults.push(results[0]);
    });

    return sortBySimilarity(mergedResults);
};

DeeJay.prototype._runQuery = function(info, queryName) {
    var self = this;
    return P.map(this._backendNames, function(backendName) {
        var backend = self._backends[backendName];
        if (!backend[queryName]) {
            return null;
        } else {
            return backend[queryName](info)
            .catch(function(e) {
                // console.log(e.stack);
                // TODO: Report error?
                return null;
            });
        }
    })
    .then(function(results) {
        var resultObj = {};
        for (var i = 0; i < results.length; i++) {
            var res = results[i];
            if (res) {
                resultObj[self._backendNames[i]] = res;
            }
        }
        return self._mergeRankings(resultObj, queryName);
    });
};

DeeJay.prototype.similarArtists = function(info) {
    // Validate info
    if (!info) {
        throw new Error('Expecting an info object containing an artist property.');
    }
    if (!info.artist) {
        throw new Error('Artist missing.');
    }
    return this._runQuery(info, 'similarArtists');
};

DeeJay.prototype.similarTracks = function(info) {
    // Validate info
    if (!info) {
        throw new Error('Expecting an info object containing an artist property.');
    }
    if (!info.artist) {
        throw new Error('Artist missing.');
    }
    if (!info.track) {
        throw new Error('Track missing.');
    }
    return this._runQuery(info, 'similarTracks');
};

module.exports = DeeJay;


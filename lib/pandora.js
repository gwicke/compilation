'use strict';

// Pandora backend

var preq = require('preq');

function Pandora(options) {
    this._options = options;
    this._options.timeout = this._options.timeout || 600;
    this._apiURL = 'http://pandora.com/json/music';
}

Pandora.prototype._massageArtist = function(artist, similarity) {
    return {
        key: artist['@name'],
        name: artist['@name'],
        similarity: similarity,
        mbid: artist['@musicId'],
        href: artist['@detailUrl'],
    };
};

Pandora.prototype.similarArtists = function(info) {
    var self = this;
    return preq.get({
        uri: this._apiURL + '/artist/' + encodeURIComponent(info.artist),
        timeout: self._options.timeout
    })
    .then(function(res) {
        var artists = res.body.artistExplorer.similar;
        var similarity = 1.0;
        var decrement = 1.0 / artists.length;
        return artists.map(function(artist) {
            res = self._massageArtist(artist, similarity);
            similarity -= decrement;
            return res;
        });
    });
};

/*
 * Not sure if Pandora actually supports track similarity.
 *
Pandora.prototype._massageTrack = function(track) {
    var trackArtist = this._massageArtist(track.artist);
    return {
        key: trackArtist.key + ' - ' + track.name,
        name: track.name,
        similarity: Number(track.match),
        mbid: track.mbid,
        href: track.url,
        artist: trackArtist,
    };
};

Pandora.prototype.similarTracks = function(info) {
    var self = this;
    return preq.get({
        uri: this._apiURL,
        query: {
            method: 'track.getsimilar',
            artist: info.artist,
            track: info.track,
            api_key: this._options.apiKey,
            format: 'json',
        }
    })
    .then(function(res) {
        return res.body.similartracks.track
            .map(self._massageTrack);
    });
};
*/

module.exports = Pandora;

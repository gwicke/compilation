'use strict';

// Last.fm backend

var preq = require('preq');

function LastFM(options) {
    this._options = options;
    this._options.timeout = this._options.timeout || 600;
    this._apiURL = 'https://ws.audioscrobbler.com/2.0/';
}

LastFM.prototype._massageArtist = function(artist) {
    return {
        key: artist.name,
        name: artist.name,
        similarity: Number(artist.match),
        mbid: artist.mbid,
        href: artist.url,
    };
};

LastFM.prototype.similarArtists = function(info) {
    var self = this;
    return preq.get({
        uri: this._apiURL,
        query: {
            method: 'artist.getsimilar',
            artist: info.artist,
            api_key: this._options.apiKey,
            format: 'json',
        },
        timeout: self._options.timeout
    })
    .then(function(res) {
        return res.body.similarartists.artist
            .map(self._massageArtist);
    });
};

LastFM.prototype._massageTrack = function(track) {
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

LastFM.prototype.similarTracks = function(info) {
    var self = this;
    return preq.get({
        uri: this._apiURL,
        query: {
            method: 'track.getsimilar',
            artist: info.artist,
            track: info.track,
            api_key: this._options.apiKey,
            format: 'json',
        },
        timeout: self._options.timeout
    })
    .then(function(res) {
        return res.body.similartracks.track
            .map(self._massageTrack.bind(self));
    });
};

module.exports = LastFM;

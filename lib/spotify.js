'use strict';

// Spotify backend

var preq = require('preq');

function Spotify(options) {
    this._options = options;
    this._options.timeout = this._options.timeout || 600;
    this._apiURL = 'https://api.spotify.com/v1';
}

Spotify.prototype._massageArtist = function(artist, similarity) {
    return {
        key: artist.name,
        name: artist.name,
        similarity: similarity,
        mbid: artist.id,
        href: artist.href,
    };
};

Spotify.prototype.similarArtists = function(info) {
    var self = this;
    return preq.get({
        uri: this._apiURL + '/search',
        query: {
            q: info.artist,
            type: 'artist',
        },
        timeout: self._options.timeout
    })
    .then(function(res) {
        var id = res.body.artists.items[0].id;
        return preq.get({
            uri: self._apiURL +'/artists/' + id + '/related-artists',
            timeout: self._options.timeout
        });
    })
    .then(function(res) {
        var artists = res.body.artists;
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
 * Not sure if Spotify actually supports track similarity.
 *
Spotify.prototype._massageTrack = function(track) {
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

Spotify.prototype.similarTracks = function(info) {
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

module.exports = Spotify;

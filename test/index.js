'use strict';

var DeeJay = require('../index');
var dj = new DeeJay();
module.exports = {
    'similarArtists': {
        'Wim Mertens': function() {
            return dj.similarArtists({
                artist: 'Wim Mertens'
            })
            .then(console.log);
        },
        'Junior Boys': function() {
            return dj.similarArtists({
                artist: 'Junior Boys'
            })
            .then(console.log);
        },
        'Berlioz': function() {
            return dj.similarArtists({
                artist: 'Hector Berlioz'
            })
            .then(console.log);
        },
    },
    'similarTracks': {
        'Bonobo': function() {
            return dj.similarTracks({
                artist: 'Bonobo',
                track: 'Silver'
            })
            .then(console.log);
        },
    }
};

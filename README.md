# Compilation
A music similarity library, returning a weighted combination of several API and tool results.

## Installation

```bash
npm install compilation
```

## Usage

For now, see [the tests](test/index.js).

## Features

### `similarArtists({ artist: 'Hector Berlioz' })`

Returns `Promise` resolving to an `Array`, ordered by similarity:

```javascript
[ { name: 'Johannes Brahms',
    similarity: 0.5204596666666667,
    href: 'https://api.spotify.com/v1/artists/5wTAi7QkpP6kp8a54lmTOq' },
  { name: 'Carl Maria von Weber',
    similarity: 0.49999999999999983,
    href: 'http://www.last.fm/music/Carl+Maria+von+Weber' },
	...
]
```

Backends:
- Pandora
- Last.fm
- Spotify

### `similarTracks({ artist: 'Bonobo', track: 'Silver' })`

Returns `Promise` resolving to an `Array`, ordered by similarity:

```javascript
[ { name: 'The Plug',
    similarity: 0.3333333333333333,
    href: 'http://www.last.fm/music/Bonobo/_/The+Plug',
    artist: 
     { name: 'Bonobo',
       href: 'http://www.last.fm/music/Bonobo' } },
  ...
]
```

Backends:
- Last.fm

## See also
- [metalminer](https://github.com/sjaak666/metalminer), a similar library
    without the weighted result merging.
- [Spotify API documentation](https://developer.spotify.com/web-api/)
- [Last.fm API documentation](http://www.last.fm/api/show/artist.getSimilar)
- [Groovebasin](https://github.com/andrewrk/groovebasin), a rather nice
    C++ / nodejs based player with a web frontend. It is lacking support for
    using similarity in its auto-dj functionality.

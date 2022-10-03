let accessToken;

let Spotify = {

    /**
     * getAccesToken method
     * Runs when the search method is called
     * Should return the accessToken if either the accessToken exists in the system,
     * or in the current page's URL. If both cases failed, window will be redirect to the Spotify API.
     * @returns {string} accessToken
     */
    getAccessToken() {
        if (accessToken) {
            return accessToken;;
        }

        const clientID = '7e991a71baa64e2eaf56dd2bd4e8ecc2';
        const redirectURI = 'http://localhost:3000/';

        // check for accessing token and experies in values matched
        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);

            // set accesToken to expire at the expiresIn values
            // clear accessToken such that the system does not try to grab the expired accessToken
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            let redirectURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = redirectURL;
        }
    },

    /**
     * search method
     * Runs when search button is clicked
     * Should return a promise of array consisting of id, name, artist, album, and URI
     * @param {string} searchTerm
     * @returns {Array} tracks
     */
    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        const fetchURL = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
        const init = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        return fetch(fetchURL, init)
            .then(response => response.json())
            .then(JSONResponse => {
                if (!JSONResponse.tracks) return [];
                else {
                    return JSONResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        URI: track.uri
                    }))
                }
            });
    },

    /**
     * savePlaylist method
     * Runs when the Save To Spotify button is clicked
     * Should save the playlist with songs and songs to Spotify
     * @param {string} playlistName 
     * @param {Array} trackURIs 
     * @returns {JSON} responses from Spotify API request
     */
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName && !trackURIs.length) return;

        let userID;
        const accessToken = Spotify.getAccessToken();
        const fetchURL = 'https://api.spotify.com/v1/me';
        const init = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        return fetch(fetchURL, init)
            .then(response => response.json())
            .then(JSONResponse => {
                userID = JSONResponse.id;
                const init = {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    method: 'POST',
                    body: JSON.stringify({
                        name: playlistName,
                    })
                }
                const fetchURL = `https://api.spotify.com/v1/users/${userID}/playlists`;

                return fetch(fetchURL, init)
                    .then(response => response.json())
                    .then(JSONResponse => {
                        let playlistID = JSONResponse.id;
                        const init = {
                            headers: { Authorization: `Bearer ${accessToken}` },
                            method: 'POST',
                            body: JSON.stringify({
                                uris: trackURIs,
                            })
                        }
                        const fetchURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;

                        return fetch(fetchURL, init)
                    });
            })
    },

    // playTrack(trackURI) {
    //     const accessToken = Spotify.getAccessToken();
    //     const fetchURL = 'https://api.spotify.com/v1/me/player/devices';
    //     const init = { headers: { Authorization: `Bearer ${accessToken}` } }

    //     return fetch(fetchURL, init)
    //         .then(response => response.json())
    //         .then(JSONResponse => {
    //             console.log(JSONResponse);
    //         })
    //         .catch(err => console.log(err));
    // }
};

export default Spotify;
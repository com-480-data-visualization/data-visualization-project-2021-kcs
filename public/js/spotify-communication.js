(function () {

    /**
     * Get spotify api tokens from url after login
     * @returns {{api token}}
     */
    function getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    // Instantiate user profile variables
    let userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    // Instantiate playlist embedding variables
    let playlistEmbeddingSource = document.getElementById('user-playlist-embedding-template').innerHTML,
        playlistEmbeddingTemplate = Handlebars.compile(playlistEmbeddingSource),
        playlistEmbeddingPlaceholder = document.getElementById('user-playlists');

    // Get spotify api token parameters
    let params = getHashParams();
    //console.log(params);
    let access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error,
        app_access_token = params.app_access_token;

    // List audio features to analyse
    const audio_features = ['danceability', 'energy', 'loudness', 'mode',
        'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'];

    // List default displayed playlists.
    let default_playlists = [
        {id: '37i9dQZF1DWXRqgorJj26U', name: 'Rock'},
        {id: '3P6fMeN40WHk1nuKMjhOXH', name: 'Classical Music'},
        {id: '37i9dQZF1DXch2nNxu927l', name: 'R&B'},
        {id: '37i9dQZF1DXbITWG1ZJKYt', name: 'Jazz'},
        {id: '37i9dQZF1DWX0o6sD1a6P5', name: 'Afro Music'},
        {id: '37i9dQZF1DX4RDXswvP6Mj', name: 'K-POP'},
        {id: '37i9dQZF1DWWl7MndYYxge', name: '80\'s'},
        {id: '37i9dQZF1DWTcqUzwhNmKv', name: 'Metal'}
    ];


    // Display the default playlists
    let defaultPlaylistsEmbeddingPlaceholder = document.getElementById('default-playlists');
    display_playlists(defaultPlaylistsEmbeddingPlaceholder, default_playlists);

    let user_playlists = [];

    let all_playlists = [];

    // Hide visualization block by default
    let visualizationBlock = document.getElementById('playlist-viz');
    visualizationBlock.style.display = "none";

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {

            headers = {'Authorization': 'Bearer ' + access_token};

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: headers,
                success: function (response) {
                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                    $('#login').hide();
                    $('#loggedin').show();
                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();

            // Get app token
            if (!app_access_token) {
                window.location.href = '/anonymous';
            } else {
                headers = {'Authorization': 'Bearer ' + app_access_token};
            }

        }
    }


    function display_playlists(placeholder, playlists) {
        placeholder.innerHTML = "";
        for (let i = 0; i < playlists.length; i++) {
            placeholder.innerHTML += playlistEmbeddingTemplate({
                id: playlists[i].id,
                name: playlists[i].name
            });
        }
    }

    function show_visualization() {
        visualizationBlock.style.display = "block";
        setTimeout(function () {
            visualizationBlock.scrollIntoView({behavior: "smooth"});
        }, 300);

    }

    // Refresh spotify api methods
    document.getElementById('obtain-new-token').addEventListener('click', function () {
        $.ajax({
            url: '/refresh_token',
            data: {
                'refresh_token': refresh_token
            }
        }).done(function (data) {
            access_token = data.access_token;
        });
    }, false);

    // Get display user playlists
    document.getElementById('get-playlists').addEventListener('click', function () {
        $.ajax({
            url: "https://api.spotify.com/v1/me/playlists?limit=8&offset=0",
            headers: headers,
            success: function (response) {

                user_playlists = response.items;
                display_playlists(playlistEmbeddingPlaceholder, user_playlists);

            }
        });
    }, false);

    function clean_track_data(track) {
        let clean_track = {};
        clean_track.artists = track.artists.map(a => clean_artist_data(a));
        clean_track.id = track.id;
        clean_track.name = track.name;
        return clean_track
    }


    document.getElementById('analyze').addEventListener('click', function () {
        // Reset user_data array
        user_data = [];
        graph_data = [];
        let color_id = 0;

        // Merge user and default playlists
        all_playlists = user_playlists.concat(default_playlists);

        //console.log(all_playlists);

        // For each playlist in the array
        for (let i = 0; i < all_playlists.length; i++) {
            let playlist_toggle_id = '#toggle-' + all_playlists[i].id;

            // If the playlist have been selected
            if ($(playlist_toggle_id).is(':checked')) {
                let playlist_data = {}; //Object containing all playlist data for visualisation.
                let track_graph_data = {}; //Object containing tracks data from graph visualisation

                // Get the tracks data from the given playlist
                $.ajax({
                    url: `https://api.spotify.com/v1/playlists/${all_playlists[i].id}/tracks`,
                    headers: headers,
                    success: function (response) {
                        color_id++; // Increment color
                        let playlist_tracks = response.items.map(a => a.track);

                        track_graph_data.playlist_color = color_id;
                        track_graph_data.playlist_name = all_playlists[i].name;
                        track_graph_data.tracks = playlist_tracks.map(t => clean_track_data(t));
                        graph_data.push(track_graph_data);

                        //console.log('Tracks data:');
                        //console.log(graph_data);

                        // Add playlist track data to data object from plot
                        playlist_data.color = color_id;
                        playlist_data.playlist_name = all_playlists[i].name;
                        playlist_data.track_names = playlist_tracks.map(t => t.name);
                        playlist_data.popularity = playlist_tracks.map(t => t.popularity);
                        playlist_data.duration = playlist_tracks.map(t => t.duration_ms);
                        playlist_data.track_ids = playlist_tracks.map(t => t.id);
                    },
                    complete: function () {
                        // Build audio-features query from the first 100 tracks' id.
                        const tracks_100 = playlist_data.track_ids.slice(0,
                            Math.min(playlist_data.track_ids.length, 100)).join();
                        // Get the audio-features for the first 100 tracks
                        $.ajax({
                            url: `https://api.spotify.com/v1/audio-features?ids=${tracks_100}`,
                            headers: headers,
                            success: function (response) {
                                // Add audio features to the playlist data
                                for (const f of audio_features) {
                                    playlist_data[f] = response.audio_features.map(a => a[f])
                                }
                                // Add user_data object (create in html, carries data into scatter plot).
                                user_data.push(playlist_data);
                                // Display and scroll to visualisation block
                                show_visualization();
                            },
                        })

                    }

                })

            }
        }

        //console.log('User data:');
        //console.log(user_data);

    })

})();
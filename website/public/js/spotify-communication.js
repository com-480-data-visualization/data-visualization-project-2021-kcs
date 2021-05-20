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
    console.log(params);
    let access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error,
        app_access_token = params.app_access_token;

    // List audio features to analyse
    const audio_features = ['danceability', 'energy', 'loudness', 'mode',
        'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']


    // List default displayed playlists.
    let displayed_playlists = [
        '37i9dQZF1DWXRqgorJj26U', '3P6fMeN40WHk1nuKMjhOXH', '37i9dQZF1DXch2nNxu927l', '37i9dQZF1DXbITWG1ZJKYt',
        '37i9dQZF1DWX0o6sD1a6P5', '37i9dQZF1DX4RDXswvP6Mj', '37i9dQZF1DWWl7MndYYxge', '37i9dQZF1DWTcqUzwhNmKv'];
    let defaultPlaylistsEmbeddingPlaceholder = document.getElementById('default-playlists')
    // Display the default playlists.

    let all_playlists = [], selected_playlists = [];

    // Hide visualization block by default
    let visualizationBlock = document.getElementById('playlist-viz');
    visualizationBlock.style.display = "none";

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
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
            }

        }
    }


    function display_playlists(placeholder, playlists) {
        for (let i = 0; i < playlists.length; i++) {
            placeholder.innerHTML += playlistEmbeddingTemplate({
                id: playlists[i].id,
                name: playlists[i].name,
                toggle_nb: i
            });
        }
    }

    function show_visualization() {
        visualizationBlock.style.display = "block";
        setTimeout(function() {
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
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                display_playlists(playlistEmbeddingPlaceholder, response.items);
                all_playlists = response.items;
                console.log("User playlists:");
                console.log(all_playlists);
            }
        });
    }, false);

    function set_playlist_data_audio_features(playlist_data, response) {
        console.log("Audio features:");
        console.log(response);

        for (const f of audio_features) {
            playlist_data[f] = response.audio_features.map(a => a[f])
        }
    }


    document.getElementById('analyze-1').addEventListener('click', function () {

        user_data = [];
        let id_number = 0;

        for (let i = 0; i < all_playlists.length; i++) {

            let toggle_name = '#toggle-' + i;

            if ($(toggle_name).is(':checked')) {

                let playlist_data = {};
                let track_ids = [];

                selected_playlists.push(all_playlists[i]);
                console.log(toggle_name);

                $.ajax({
                    url: all_playlists[i].tracks.href,
                    headers: {'Authorization': 'Bearer ' + access_token},
                    success: function (response) {

                        let result = response.items.map(a => a.track);
                        id_number++;

                        playlist_data.nb = id_number;
                        playlist_data.playlist_name = all_playlists[i].name;
                        playlist_data.tracknames = result.map(a => a.name);
                        playlist_data.popularity = result.map(a => a.popularity);
                        playlist_data.duration = result.map(a => a.duration_ms);

                        track_ids = result.map(a => a.id);

                    },
                    complete: function () {

                        track_string = track_ids.slice(0, Math.min(track_ids.length, 100)).join();

                        $.ajax({
                            url: "https://api.spotify.com/v1/audio-features?ids=" + track_string,
                            headers: {'Authorization': 'Bearer ' + access_token},
                            success: function (response) {
                                set_playlist_data_audio_features(playlist_data, response);
                                user_data.push(playlist_data);
                                // Show visualization
                                show_visualization();
                            },
                            complete: function () {

                                console.log(user_data);


                            }
                        });
                    }
                });

            }
        }
    }, false);


    document.getElementById('analyze-2').addEventListener('click', function () {

        for (let i = 0; i < displayed_playlists.length; i++) {     //change 8 to variable

            let toggle_name = '#switch-' + i;
            let id_number = 0;

            if ($(toggle_name).is(':checked')) {

                let playlist_data = {};
                let track_ids = [];
                let playlist_id = displayed_playlists[i];

                console.log(toggle_name);

                let token;

                if (access_token) {
                    token = access_token
                } else {
                    token = app_access_token
                }

                $.ajax({
                    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
                    headers: {'Authorization': 'Bearer ' + token},
                    success: function (response) {

                        id_number++;
                        let result = response.items.map(a => a.track);

                        playlist_data.nb = id_number;
                        playlist_data.playlist_name = 'To be implemented';
                        playlist_data.tracknames = result.map(a => a.name);
                        playlist_data.popularity = result.map(a => a.popularity);
                        playlist_data.duration = result.map(a => a.duration_ms);

                        track_ids = result.map(a => a.id);

                    },
                    complete: function () {

                        let track_string = track_ids.slice(0, Math.min(track_ids.length, 100)).join();

                        $.ajax({
                            url: "https://api.spotify.com/v1/audio-features?ids=" + track_string,
                            headers: {'Authorization': 'Bearer ' + token},
                            success: function (response) {
                                set_playlist_data_audio_features(playlist_data, response);
                                website_data.push(playlist_data);
                                user_data.push(playlist_data);
                                show_visualization()

                            },
                            complete: function () {

                                console.log(website_data);

                            }
                        });
                    }
                });

            }
        }
    }, false);


})();
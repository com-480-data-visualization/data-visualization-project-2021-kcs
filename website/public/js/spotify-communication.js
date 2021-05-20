(function() {



    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    var playlistEmbeddingSource = document.getElementById('user-playlist-embedding-template').innerHTML, 
        playlistEmbeddingTemplate = Handlebars.compile(playlistEmbeddingSource), 
        playlistEmbeddingPlaceholder = document.getElementById('user-playlists');

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;


    var displayed_playlists = [ 
    '37i9dQZF1DWXRqgorJj26U', '3P6fMeN40WHk1nuKMjhOXH', '37i9dQZF1DXch2nNxu927l', '37i9dQZF1DXbITWG1ZJKYt', 
    '37i9dQZF1DWX0o6sD1a6P5', '37i9dQZF1DX4RDXswvP6Mj', '37i9dQZF1DWWl7MndYYxge', '37i9dQZF1DWTcqUzwhNmKv' ]


    var nb_playlists = 0; 
    var all_playlists = [], selected_playlists = []; 


    if (error) {
      alert('There was an error during the authentication');
    } 
    else {
      
      if (access_token) {

        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              userProfilePlaceholder.innerHTML = userProfileTemplate(response);

              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } 
      else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
      }


      document.getElementById('obtain-new-token').addEventListener('click', function() {
        $.ajax({
          url: '/refresh_token',
          data: {
            'refresh_token': refresh_token
          }
        }).done(function(data) {
          access_token = data.access_token;
        });
      }, false);




      document.getElementById('get-playlists').addEventListener('click', function() {
        $.ajax({
          url: "https://api.spotify.com/v1/me/playlists?limit=8&offset=0",
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
              all_playlists = response.items;
              nb_playlists = response.items.length;
              for (let p=0; p<nb_playlists; p++) {
                playlistEmbeddingPlaceholder.innerHTML += playlistEmbeddingTemplate({
                  id:response.items[p].id, 
                  name:response.items[p].name, 
                  toggle_nb: p});
                }
            }
        });
      }, false);




      document.getElementById('analyze-1').addEventListener('click', function() {

        user_data = []
        var id_number = 0

        for (let i=0; i<nb_playlists; i++) {

          let toggle_name = '#toggle-' + i;

          if ($(toggle_name).is(':checked')) {

            let playlist_data = {};
            let track_ids = [];

            selected_playlists.push(all_playlists[i]);
            console.log(toggle_name);

            $.ajax({
              url: all_playlists[i].tracks.href,
              headers: { 'Authorization': 'Bearer ' + access_token },
              success: function(response) {

                let result = response.items.map(a => a.track);
                id_number ++; 

                playlist_data.nb = id_number;
                playlist_data.playlist_name = all_playlists[i].name;
                playlist_data.tracknames = result.map(a => a.name);
                playlist_data.popularity = result.map(a => a.popularity);
                playlist_data.duration = result.map(a => a.duration_ms);
        
                track_ids = result.map(a => a.id); 

              }, 
              complete: function() {

                track_string = track_ids.slice(0, Math.min(track_ids.length, 100)).join();  

                $.ajax({
                  url: "https://api.spotify.com/v1/audio-features?ids=" + track_string,
                  headers: { 'Authorization': 'Bearer ' + access_token },
                  success: function(response) {

                    playlist_data.danceability = response.audio_features.map(a => a.danceability); 
                    playlist_data.energy = response.audio_features.map(a => a.energy); 
                    playlist_data.key = response.audio_features.map(a => a.key);
                    playlist_data.loudness = response.audio_features.map(a => a.loudness);
                    playlist_data.mode = response.audio_features.map(a => a.mode);
                    playlist_data.speechiness = response.audio_features.map(a => a.speechiness);
                    playlist_data.acousticness = response.audio_features.map(a => a.acousticness);
                    playlist_data.instrumentalness = response.audio_features.map(a => a.instrumentalness);
                    playlist_data.liveness = response.audio_features.map(a => a.liveness);
                    playlist_data.valence = response.audio_features.map(a => a.valence);
                    playlist_data.tempo = response.audio_features.map(a => a.tempo);

                    user_data.push(playlist_data);

                  }, 
                  complete: function() {

                    console.log(user_data);


                  }
                }); 
              }
            }); 

          }
        }
      }, false);



      document.getElementById('analyze-2').addEventListener('click', function() {

        for (let i=0; i<8; i++) {     //change 8 to variable

          let toggle_name = '#switch-' + i;
          var id_number = 0

          if ($(toggle_name).is(':checked')) {

            let playlist_data = {};
            let track_ids = [];
            let playlist_id = displayed_playlists[i]

            console.log(toggle_name);

            $.ajax({
              url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', 
              headers: { 'Authorization': 'Bearer ' + access_token },
              success: function(response) {

                id_number ++; 
                let result = response.items.map(a => a.track);

                playlist_data.nb = id_number;
                playlist_data.playlist_name = 'To be implemented';
                playlist_data.tracknames = result.map(a => a.name);
                playlist_data.popularity = result.map(a => a.popularity);
                playlist_data.duration = result.map(a => a.duration_ms);
        
                track_ids = result.map(a => a.id); 

              }, 
              complete: function() {

                track_string = track_ids.slice(0, Math.min(track_ids.length, 100)).join();  

                $.ajax({
                  url: "https://api.spotify.com/v1/audio-features?ids=" + track_string,
                  headers: { 'Authorization': 'Bearer ' + access_token },
                  success: function(response) {

                    playlist_data.danceability = response.audio_features.map(a => a.valence); 
                    playlist_data.energy = response.audio_features.map(a => a.energy); 
                    playlist_data.key = response.audio_features.map(a => a.key);
                    playlist_data.loudness = response.audio_features.map(a => a.loudness);
                    playlist_data.mode = response.audio_features.map(a => a.mode);
                    playlist_data.speechiness = response.audio_features.map(a => a.speechiness);
                    playlist_data.acousticness = response.audio_features.map(a => a.acousticness);
                    playlist_data.instrumentalness = response.audio_features.map(a => a.instrumentalness);
                    playlist_data.liveness = response.audio_features.map(a => a.liveness);
                    playlist_data.valence = response.audio_features.map(a => a.valence);
                    playlist_data.tempo = response.audio_features.map(a => a.tempo);

                    website_data.push(playlist_data);
                    user_data.push(playlist_data);

                  }, 
                  complete: function() {

                    console.log(website_data);

                  }
                }); 
              }
            }); 

          }
        }
      }, false);

    }
})();
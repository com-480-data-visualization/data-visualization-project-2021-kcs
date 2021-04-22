var express = require('express');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = 'dd83ca9f00b346fc9a54dee65924ff35';
var redirect_uri = 'http://localhost:8080';

var app = express();

app.use(express.static(__dirname)).use(cors()).use(cookieParser());

app.get('/login', function(req, res) {
  var scope = 'user-read-private user-read-email'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
})

app.listen(8080);
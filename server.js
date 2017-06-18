/**
 * Created by evan on 11/5/17.
 */
// server.js
const express = require('express');
const app = express();
const path = require('path');

// If an incoming request uses a protocol other than HTTPS,
// redirect that request to the same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

console.log('Running in NODE_ENV: ', process.env.NODE_ENV);


// Instruct the app to use the forceSSL middleware
if (process.env.NODE_ENV === 'production') {
  app.use(forceSSL());
}



// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// providing the ability to override the environment.ts settings here
app.get('/env', function(req, res) {

  if (process.env.TREE_STORIES_SERVER) {
    res.json({ TREE_STORIES_SERVER: process.env.TREE_STORIES_SERVER });
  } else {
    res.status(400).json({ message: 'No env set.' });
  }

});


// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

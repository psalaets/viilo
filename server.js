var mongoose = require('mongoose');
var Player = require('./lib/player');

var express = require('express');
var app = express();

// serve front-end
app.use(express.static('public'));

app.get('/leaderboard', function(req, resp) {
  Player.leaderboard().then(function(leaderboard) {
    resp.send({
      players: leaderboard
    });
  });
});

app.get('/players', function(req, resp) {
  Player.list().then(function(players) {
    resp.send({
      players: players
    });
  });
});

connectToDb(function(err) {
  if (err) throw err;

  startWebServer(addDummyData);
})

function connectToDb(cb) {
  var url = 'mongodb://127.0.0.1:27017/viilo-dev';
  mongoose.connect(url, function(err) {
    if (err) return cb(err);

    console.log('connected to db: ' + url);
    cb();
  });
}

function startWebServer(cb) {
  var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);

    cb();
  });
}

function addDummyData() {
  var p1 = new Player({name: 'Joe'});
  var p2 = new Player({name: 'Bob'});

  p1.save().then(function() {
    return p2.save();
  }).then(function() {
    return Player.result(p1, p2);
  }).then(function() {
    return Player.result(p1, p2);
  }).then(function() {
    return Player.result(p2, p1);
  });
}
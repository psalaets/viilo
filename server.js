var mongoose = require('mongoose');
var Player = require('./lib/player');
var Result = require('./lib/result');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// serve front-end
app.use(express.static('public'));
// parse json of request bodies, this populates req.body in handlers
app.use(bodyParser.json());

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

app.post('/players', function(req, resp) {
  var player = req.body;

  // don't let anything else but name be set on create
  player = {
    name: player.name
  };

  Player.create(player).then(function() {
    resp.status(200).end();
  }, function(error) {
    resp.status(500).send(error.message);
  });
});

app.get('/results', function(req, resp) {
  Result.recent().then(function(results) {
    resp.send({
      results: results
    });
  });
});

app.post('/results', function(req, resp) {
  var result = req.body;

  /*
  TODO validate req.body looks like
  {
    winner: {id, name},
    loser:  {id, name}
  }
  */

  result = {
    winnerId: result.winner.id,
    winnerName: result.winner.name,
    loserId: result.loser.id,
    loserName: result.loser.mame
  };

  Result.create(result).then(function() {
    resp.status(200).end();
  }, function(error) {
    resp.status(500).send(error.message);
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
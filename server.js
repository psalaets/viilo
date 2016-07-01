var path = require('path');
var mongoose = require('mongoose');
var Promise = require('promise');
var Player = require('./lib/player');
var Result = require('./lib/result');

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var expressHandlebars = require('express-handlebars');

var app = express();

/*********************
Config
**********************/

// middleware for flash messages
// https://gist.github.com/tpblanke/11061808
app.use(cookieParser('secretasdf'));
app.use(session({
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
  secret: 'secretasdf'
}));
app.use(flash());

// server-side templating
app.engine('hbs', expressHandlebars({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');

// public/foo.css is served at <host:port>/foo.css
var staticPath = path.resolve(__dirname, 'public');
app.use('/', express.static(staticPath));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parses incoming application/json and sets as request.body
app.use(bodyParser.json());

/*********************
Routes
**********************/

app.get('/leaderboard.json', function(req, resp, next) {
  Player.leaderboard().then(function(players) {
    resp.send(players);
  });
});

app.get('/players', function(req, resp) {
  Player.list().then(function(players) {
    resp.render('players', {
      players: players,
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
});

app.get('/players.json', function(req, resp) {
  Player.list().then(function(players) {
    resp.send(players);
  });
});

app.post('/players', function(req, resp) {
  var player = req.body;
  var name = player.name;

  Player.add(player).then(function() {
    req.flash('success', 'Added ' + name);
    resp.redirect('/players');
  }, function(error) {
    console.log(error);
    req.flash('error', 'Could not add ' + name);
    resp.redirect('/players');
  });
});

app.post('/players.json', function(req, resp) {
  var player = req.body;
  var name = player.name;

  Player.add(player).then(function() {
    resp.send({
      message: 'Added ' + name
    });
  }, function(error) {
    console.log(error);

    resp.status(500).send({
      message: 'Could not add ' + name
    });
  });
});

// hack for populating rank on existing data
app.post('/players/rank.json', function(req, resp) {
  Player.rank().then(function() {
    resp.sendStatus(200);
  }, function(error) {
    console.log(error)

    resp.status(500).send({
      message: 'Could not rank players'
    });
  });
});

app.get('/results', function(req, resp) {
  Player.list().then(function(players) {
    return Result.recent().then(function(results) {
      return {
        players: players,
        results: results
      };
    });
  }).then(function(data) {
    resp.render('results', {
      results: renderResults(data.results),
      players: data.players,
      winnerMessage: req.flash('winnerMessage'),
      loserMessage: req.flash('loserMessage'),
      error: req.flash('error')
    });
  });
});

app.get('/results.json', function(req, resp) {
  Result.recent().then(function(results) {
    resp.send(renderResults(results));
  });
});

app.post('/results', function(req, resp) {
  var result = req.body;

  Promise.all([
    Player.findById(result.winnerId).exec(),
    Player.findById(result.loserId).exec()
  ]).then(function(players) {
    var winner = players[0];
    var loser = players[1];

    return Result.record(winner, loser);
  }).then(function(newElos) {
    req.flash('winnerMessage', newElos.winner.name + ' ' + newElos.winner.eloDelta);
    req.flash('loserMessage', newElos.loser.name + ' ' + newElos.loser.eloDelta);
    resp.redirect('/results');
  }, function(error) {
    console.log(error);

    req.flash('error', 'Could not record result');
    resp.redirect('/results');
  });
});

app.post('/results.json', function(req, resp) {
  var result = req.body;

  Promise.all([
    Player.findById(result.winnerId).exec(),
    Player.findById(result.loserId).exec()
  ]).then(function(players) {
    var winner = players[0];
    var loser = players[1];

    return Result.record(winner, loser);
  }).then(function(newElos) {
    resp.send({
      winner: {
        id: result.winnerId,
        name: newElos.winner.name,
        eloDelta: newElos.winner.eloDelta
      },
      loser: {
        id: result.loserId,
        name: newElos.loser.name,
        eloDelta: newElos.loser.eloDelta
      }
    });
  }, function(error) {
    console.log(error)

    resp.status(500).send({
      message: 'Could not record result'
    });
  });
});

function renderResults(results) {
  return results.map(function(r) {
    return r.toObject();
  });
}

/*******************************
Connect to DB and launch server
*******************************/

connectToDb(function(err) {
  if (err) throw err;

  startWebServer();
})

function connectToDb(cb) {
  var url = 'mongodb://127.0.0.1:27017/viilo-dev';
  mongoose.connect(url, function(err) {
    if (err) return cb(err);

    console.log('connected to db: ' + url);
    cb();
  });
}

function startWebServer() {
  var server = app.listen(process.env.PORT || 80, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);
  });
}

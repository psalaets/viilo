var mongoose = require('mongoose');
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

// public/foo.css is served at <host:port>/static/foo.css
app.use('/static', express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

/*********************
Routes
**********************/

app.get('/', function(req, resp, next) {
  Player.leaderboard().then(function(players) {
    resp.render('leaderboard', {
      players: renderPlayers(players)
    });
  });
});

app.get('/players', function(req, resp) {
  Player.list().then(function(players) {
    resp.render('players', {
      players: renderPlayers(players),
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
});

app.post('/players', function(req, resp) {
  var body = req.body;
  var name = body.name;

  var player = {
    name: name
  };

  Player.create(player).then(function() {
    req.flash('success', 'Added ' + name);
    resp.redirect('/players');
  }, function(error) {
    req.flash('error', 'Could not add ' + name);
    resp.redirect('/players');
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
      players: renderPlayers(data.players)
    });
  });
});

app.post('/results', function(req, resp) {
  var result = req.body;

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

function renderResults(results) {
  return results.map(function(r) {
    return r.toObject();
  });
}

function renderPlayers(players) {
  return players.map(function(p) {
    return p.toObject();
  });
}

/*******************************
Connect to DB and launch server
*******************************/

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
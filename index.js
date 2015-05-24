var Player = require('./lib/player');
var mongoose = require('mongoose');

var url = 'mongodb://127.0.0.1:27017/viilo-dev';
mongoose.connect(url, function(err) {
  if (err) {
    throw err;
  }

  console.log('connected to mongo at ' + url);
});


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
}).then(function(blah) {
  return Player.leaderboard();
}).then(function(leaderboard) {
  console.log(JSON.stringify(leaderboard))
}).then(function() {
  mongoose.disconnect()
}, function(err) {
  console.log(err);

  mongoose.disconnect()
});

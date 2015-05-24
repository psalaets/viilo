var mongoose = require('mongoose');
var Player = require('../lib/player');
var Result = require('../lib/result');

var url = 'mongodb://127.0.0.1:27017/viilo-test';

module.exports = {
  connect: function(cb) {
    mongoose.connect(url, cb);
  },
  disconnect: function(cb) {
    mongoose.disconnect(cb);
  },
  dropPlayers: function(cb) {
    Player.remove(cb);
  },
  dropResults: function(cb) {
    Result.remove(cb);
  }
};
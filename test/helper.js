var mongoose = require('mongoose');

var url = 'mongodb://127.0.0.1:27017/viilo-test';

module.exports = {
  connect: function(cb) {
    mongoose.connect(url, cb);
  },
  disconnect: function(cb) {
    mongoose.disconnect(cb);
  },
  dropPlayers: function(cb) {
    var players = mongoose.connection.collections.players;

    players.count(function(err, count) {
      if (err) return cb(err);

      if (count > 0) {
        return players.drop(cb);
      }
      cb();
    });
  }
};
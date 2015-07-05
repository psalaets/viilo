var mongoose = require('mongoose');
var Promise = require('promise');
var standings = require('standings');

var Schema = mongoose.Schema;

var playerSchema = Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  elo:  {
    type: Number,
    default: 1200,
    index: true
  },
  provisional: {
    type: Boolean,
    default: true
  },
  rank: {
    type: Number
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  streak: {
    type: Schema.Types.Mixed,
    default: function() {
      return {
        // W or L
        outcome: 'W',
        // how many of <outcome> in a row
        count: 0
      };
    }
  },
  // Array of W and L for 10 most recent outcomes
  // New outcomes are pushed onto back of Array
  lastTen: [String]
});

playerSchema.set('toJSON', {
  transform: function(player, ret, options) {
    ret.id = player._id;
    delete ret._id;

    ret.name = player.name;
    ret.rank = player.rank;
    ret.wins = player.wins;
    ret.losses = player.losses;
    ret.provisional = player.provisional;
    ret.streak = player.streak;
    ret.lastTen = player.lastTen;
  }
});

// derived properties

playerSchema.virtual('gamesPlayed').get(function() {
  return this.wins + this.losses;
});

// instance methods

playerSchema.methods.won = function() {
  this.wins += 1;

  updateProvisional(this);
  updateStreak(this, 'W');
  updateLastTen(this, 'W');
};

playerSchema.methods.lost = function() {
  this.losses += 1;

  updateProvisional(this);
  updateStreak(this, 'L');
  updateLastTen(this, 'L');
};

function updateProvisional(player) {
  if (player.gamesPlayed >= 5) {
    player.provisional = false;
  }
}

function updateStreak(player, outcome) {
  var streak = player.streak;

  // continue current streak
  if (streak.outcome === outcome) {
    streak.count += 1;
  } else {
    // start new streak
    streak.outcome = outcome;
    streak.count = 1;
  }

  // since streak is a Mixed, must signal to mongoose when it's changed
  player.markModified('streak');
}

function updateLastTen(player, outcome) {
  var lastTen = player.lastTen;

  lastTen.push(outcome);

  while (lastTen.length > 10) {
    lastTen.shift();
  }
}

// methods on Player constructor

// players by ascending rank
playerSchema.statics.leaderboard = function() {
  var query = this.find();
  query.sort({
    rank: 1
  });
  return query.exec();
};

// players by ascending name
playerSchema.statics.list = function() {
  var query = this.find();
  query.sort({
    name: 1
  });
  return query.exec();
};

// recalc rank for all players
playerSchema.statics.rank = function() {
  return this.find().exec().then(function(players) {
    var rankings = standings(players, function(player) {
      if (player.provisional) {
        return 0;
      }
      return player.elo;
    });

    var updates = rankings.map(function(ranking) {
      var player = ranking.item;

      player.rank = ranking.rank;
      return player.save();
    });

    return Promise.all(updates);
  });
};

playerSchema.statics.add = function(playerObject) {
  var player = {
    name: playerObject.name
  };

  var self = this;
  return this.create(player).then(function() {
    return self.rank();
  });
};

module.exports = mongoose.model('Player', playerSchema);

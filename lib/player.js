var mongoose = require('mongoose');
var elo = require('./elo');

var Schema = mongoose.Schema;

var playerSchema = Schema({
  name: String,
  elo:  {
    type: Number,
    default: 1200
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
  // include virtual properties for JSON.stringify()
  virtuals: true
});

// derived properties

playerSchema.virtual('gamesPlayed').get(function() {
  return this.wins + this.losses;
});

// instance methods

playerSchema.methods.won = function() {
  this.wins += 1;

  updateStreak(this, 'W');
  updateLastTen(this, 'W');
};

playerSchema.methods.lost = function() {
  this.losses += 1;

  updateStreak(this, 'L');
  updateLastTen(this, 'L');
};

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

// players by descending elo
playerSchema.statics.leaderboard = function() {
  var query = this.find();
  query.sort({
    elo: -1
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

playerSchema.statics.result = function(winner, loser) {
  var newElos = elo(winner.elo, loser.elo);

  var eloChanges = {
    winner: {
      name: winner.name,
      oldElo: winner.elo,
      newElo: newElos.winner
    },
    loser: {
      name: loser.name,
      oldElo: loser.elo,
      newElo: newElos.loser
    }
  };

  // actually update players
  winner.elo = newElos.winner;
  winner.won();

  loser.elo = newElos.loser;
  loser.lost();

  return winner.save().then(function() {
    return loser.save();
  }).then(function() {
    return eloChanges;
  });
};

module.exports = mongoose.model('Player', playerSchema);
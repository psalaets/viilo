var createEloRanker = require('elo-rank');
var tier = require('./tier');

// elo-rank outcomes
var WON = 1;
var LOST = 0;

/**
* Calculate new elo ratings.
*
* @param {object} winner - Object with elo and tier Number properties
* @param {object} loser  - Object with elo and tier Number properties
* @return {object} with new elo ratings: {winner, loser}
*/
module.exports = function(winner, loser) {
  var winnerElo = winner.elo;
  var loserElo = loser.elo;

  var winnerTier = tier.byId(winner.tier);
  var winnerRanker = createEloRanker(winnerTier.kFactor);
  var winnerExpectedScore = winnerRanker.getExpected(winnerElo, loserElo);

  var loserTier = tier.byId(loser.tier);
  var loserRanker = createEloRanker(loserTier.kFactor);
  var loserExpectedScore = loserRanker.getExpected(loserElo, winnerElo);

  return {
    winner: winnerRanker.updateRating(winnerExpectedScore, WON, winnerElo),
    loser: loserRanker.updateRating(loserExpectedScore, LOST, loserElo)
  };
};
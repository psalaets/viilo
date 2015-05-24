var kFactor = 32;
var eloRank = require('elo-rank')(kFactor);

// elo-rank outcomes
var WON = 1;
var LOST = 0;

/**
* Calculate new elo ratings.
*
* @param {Number} winnerElo - current elo rating of winner
* @param {Number} loserElo  - current elo rating of loser
* @return {object} with new elo ratings: {winner, loser}
*/
module.exports = function(winnerElo, loserElo) {
  var winnerExpectedScore = eloRank.getExpected(winnerElo, loserElo);
  var loserExpectedScore = eloRank.getExpected(loserElo, winnerElo);

  return {
    winner: eloRank.updateRating(winnerExpectedScore, WON, winnerElo),
    loser: eloRank.updateRating(loserExpectedScore, LOST, loserElo)
  };
};
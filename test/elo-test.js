var assert = require('assert');
var elo = require('../lib/elo');

describe('elo', function () {
  it('returns new elo ratings for players', function () {
    var winner = {
      elo: 1200,
      tier: 1
    };

    var loser = {
      elo: 1200,
      tier: 1
    };

    var result = elo(winner, loser);

    assert(result.winner > 1200);
    assert(result.loser < 1200);
  });

  it('uses tier to determine player\'s k-factor', function () {
    var favored = {
      elo: 1600,
      tier: 1
    };

    var underdog = {
      elo: 900,
      tier: 4
    };

    // huge upset
    var result = elo(underdog, favored);

    // favored didn't drop more than 4
    assert.equal(1596, result.loser);
    // underdog didn't gain more than 32
    assert.equal(931, result.winner);
  });
});
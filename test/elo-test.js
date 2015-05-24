var assert = require('assert');
var elo = require('../lib/elo');

describe('elo', function () {
  it('returns new elo ratings for players', function () {
    var result = elo(1200, 1200);

    assert(result.winner > 1200);
    assert(result.loser < 1200);
  });
});
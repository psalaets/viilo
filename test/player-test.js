var assert = require('assert');

var Player = require('../lib/player');
var helper = require('./helper');

describe('Player', function () {
  before(helper.connect);
  beforeEach(helper.dropPlayers)

  after(helper.disconnect);

  it('must have a name', function (done) {
    var noName = new Player();

    return noName.save().then(function() {
      done(new Error('expect rejected promise from noName.save()'))
    }, function(err) {
      done();
    });
  });

  it('cannot have duplicate names', function (done) {
    var bob = new Player({name: 'bob'});
    var otherBob = new Player({name: 'bob'});

    return bob.save().then(function() {
      return otherBob.save();
    }).then(function() {
      done(new Error('expect rejected promise from otherBob.save()'))
    }, function(err) {
      done();
    });
  });

  describe('newly created', function () {
    it('has elo of 1200', function () {
      var p = new Player({name: 'bob'});

      assert.equal(p.elo, 1200);
    });

    it('has 0 wins', function () {
      var p = new Player({name: 'bob'});

      assert.equal(p.wins, 0);
    });

    it('has 0 losses', function () {
      var p = new Player({name: 'bob'});

      assert.equal(p.losses, 0);
    });

    it('has no streak', function () {
      var p = new Player({name: 'bob'});

      assert.equal(p.streak.count, 0);
    });

    it('has empty last ten', function () {
      var p = new Player({name: 'bob'});

      assert.equal(p.lastTen.length, 0);
    });
  });

  describe('after one win', function () {
    it('has 1 win, 0 losses', function () {
      var p = new Player({name: 'bob'});

      p.won();

      assert.equal(p.wins, 1);
      assert.equal(p.losses, 0);
    });

    it('most recent in last ten is a W', function () {
      var p = new Player({name: 'bob'});

      p.won();

      assert.equal(p.lastTen.slice(-1), 'W');
    });

    it('is on a winning streak', function () {
      var p = new Player({name: 'bob'});

      p.won();

      assert.equal(p.streak.outcome, 'W');
      assert.equal(p.streak.count, 1);
    });
  });

  describe('after two consecutive wins', function () {
    it('has 2 wins, 0 losses', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.won();

      assert.equal(p.wins, 2);
      assert.equal(p.losses, 0);
    });

    it('is on a 2 game winning streak', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.won();

      assert.equal(p.streak.outcome, 'W');
      assert.equal(p.streak.count, 2);
    });

    it('2 most recent in last ten are W', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.won();

      assert.deepEqual(p.lastTen.slice(-2), ['W', 'W']);
    });
  });

  describe('after win, loss', function () {
    it('has 1 win, 1 loss', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.lost();

      assert.equal(p.wins, 1);
      assert.equal(p.losses, 1);
    });

    it('is on a 1 game losing streak', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.lost();

      assert.equal(p.streak.outcome, 'L');
      assert.equal(p.streak.count, 1);
    });

    it('2 most recent in last ten are W, L', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.lost();

      assert.deepEqual(p.lastTen.slice(-2), ['W', 'L']);
    });
  });

  describe('after more than 10 games', function () {
    it('last ten reflects 10 most recent outcomes', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.won();
      p.won();
      p.won();
      p.won();

      // everything below here should still be in lastTen

      p.lost();
      p.lost();
      p.lost();
      p.lost();
      p.lost();

      p.won();
      p.won();
      p.won();

      p.lost();
      p.lost();

      assert.deepEqual(
        p.lastTen.toObject(),
        ['L', 'L', 'L', 'L', 'L', 'W', 'W', 'W', 'L', 'L']
      );
    });
  });

  describe('#gamesPlayed', function () {
    it('is sum of wins and losses', function () {
      var p = new Player({name: 'bob'});

      p.won();
      p.lost();
      p.lost();

      assert.equal(p.gamesPlayed, 3);
    });

    it('is in player json', function () {
      var p = new Player({name: 'bob'});

      var json = JSON.stringify(p);
      var restored = JSON.parse(json);

      assert('gamesPlayed' in restored);
    });
  });

  describe('.leaderboard()', function () {
    it('lists players by descending elo rating', function () {
      var adam = new Player({name: 'adam', elo: 500});
      var bob = new Player({name: 'bob', elo: 700});

      return adam.save().then(function() {
        return bob.save();
      }).then(function() {
        return Player.leaderboard();
      }).then(function(leaderboard) {
        assert.equal(leaderboard[0].name, 'bob');
        assert.equal(leaderboard[1].name, 'adam');
      });
    });
  });

  describe('.list()', function () {
    it('lists players by name in abc order', function () {
      var adam = new Player({name: 'adam'});
      var bob = new Player({name: 'bob'});

      return bob.save().then(function() {
        return adam.save();
      }).then(function() {
        return Player.list();
      }).then(function(leaderboard) {
        assert.equal(leaderboard[0].name, 'adam');
        assert.equal(leaderboard[1].name, 'bob');
      });
    });
  });

  describe('#toObject()', function () {
    it('lots of stuff here');
  });

  describe('.rank()', function () {
    it('ranks by elo');
    it('can have ties');
  });
});
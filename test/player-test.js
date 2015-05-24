var assert = require('assert');
var mongoose = require('mongoose');
var Player = require('../lib/player');

describe('Player', function () {
  before(function (done) {
    mongoose.connect('mongodb://127.0.0.1:27017/viilo-test', done);
  });

  beforeEach(function (done) {
    Player.count().then(function(count) {
      // drop fails if collection doesn't exist
      if (count > 0) {
        return mongoose.connection.collections.players.drop(done);
      }
      done();
    })
  });

  after(function (done) {
    mongoose.disconnect(done);
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
});

/*
- JSON includes games played
- .leaderboard
- .list
- .result
*/

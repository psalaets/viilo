var assert = require('assert');
var tier = require('../lib/tier');

describe('tiers', function () {
  describe('1st tier', function () {
    it('is for ranks 1 and 2', function () {
      assert.equal(tier.byRank(1).id, 1);
      assert.equal(tier.byRank(2).id, 1);
    });

    it('has k-factor of 4', function () {
      assert.equal(tier.byId(1).kFactor, 4);
    });
  });

  describe('2nd tier', function () {
    it('is for ranks 3, 4, 5', function () {
      assert.equal(tier.byRank(3).id, 2);
      assert.equal(tier.byRank(4).id, 2);
      assert.equal(tier.byRank(5).id, 2);
    });

    it('has k-factor of 8', function () {
      assert.equal(tier.byId(2).kFactor, 8);
    });
  });

  describe('3rd tier', function () {
    it('is for ranks 6-10 inclusive', function () {
      assert.equal(tier.byRank(6).id, 3);
      assert.equal(tier.byRank(7).id, 3);
      assert.equal(tier.byRank(8).id, 3);
      assert.equal(tier.byRank(9).id, 3);
      assert.equal(tier.byRank(10).id, 3);
    });

    it('has k-factor of 16', function () {
      assert.equal(tier.byId(3).kFactor, 16);
    });
  });

  describe('4th tier', function () {
    it('is for ranks 11 and beyond', function () {
      assert.equal(tier.byRank(11).id, 4);
      assert.equal(tier.byRank(12).id, 4);
      assert.equal(tier.byRank(13).id, 4);
      assert.equal(tier.byRank(10000).id, 4);
    });

    it('has k-factor of 32', function () {
      assert.equal(tier.byId(4).kFactor, 32);
    });
  });
});
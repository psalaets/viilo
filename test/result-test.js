var assert = require('assert');
var Promise = require('promise');

var Result = require('../lib/result');
var helper = require('./helper');

describe('Result', function () {
  before(helper.connect);
  beforeEach(helper.dropResults);
  after(helper.disconnect);

  it('must have a winner id');
  it('must have a winner name');
  it('must have a loser id');
  it('must have a loser name');

  describe('.recent()', function () {
    beforeEach(function() {
      return Promise.all(
        Result.create({date: new Date(1)}),
        Result.create({date: new Date(2)}),
        Result.create({date: new Date(3)})
      );
    });

    describe('with no arguments', function () {
      it('lists all results, newest first', function() {
        return Result.recent().then(function(results) {
          assert.equal(results.length, 3);
          assert.deepEqual(results[0].date, new Date(3));
          assert.deepEqual(results[1].date, new Date(2));
          assert.deepEqual(results[2].date, new Date(1));
        });
      });
    });

    describe('with a limit in options argument', function() {
      it('lists the x newest games, newest first', function() {
        return Result.recent({
          limit: 2
        }).then(function(results) {
          assert.equal(results.length, 2);
          assert.deepEqual(results[0].date, new Date(3));
          assert.deepEqual(results[1].date, new Date(2));
        });
      });
    });
  });

  describe('.record()', function () {
    it('records a result');
  });
});
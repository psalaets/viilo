var assert = require('assert');

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
    it('lists results by date, newest first');
  });
});
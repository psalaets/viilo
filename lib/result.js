var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = Schema({
  winnerId: Schema.Types.ObjectId,
  winnerName: String,
  loserId: Schema.Types.ObjectId,
  loserName: String,
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
});

resultSchema.set('toObject', {
  transform: function(result, ret, options) {
    ret.id = result._id;
    ret.winner = result.winnerName;
    ret.loser = result.loserName;
    ret.date = moment(result.date).format('MMM Do YYYY');
  }
});

resultSchema.statics.recent = function() {
  var query = this.find();
  query.sort({
    date: -1
  });
  return query.exec();
};

module.exports = mongoose.model('Result', resultSchema);
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

module.exports = mongoose.model('Result', resultSchema);
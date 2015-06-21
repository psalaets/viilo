var React = require('react')
var Viilo = require('./components/viilo.jsx');

var request = require('superagent');

loadLeaderboard()

function loadLeaderboard(playerCallback) {
  playerCallback = playerCallback || function(players) {return players};

  request
    .get('/leaderboard.json')
    .end(function(err, res) {
      var players = playerCallback(res.body);

      render({
        players: players
      })
    });
}

function submitResult(result) {
  request
    .post('/results.json')
    .send(result)
    .end(function(err, res) {
      var winner = res.body.winner;
      var loser = res.body.loser;

      loadLeaderboard(function(players) {
        players.forEach(function(player) {
          if (player.id == winner.id) {
            player.eloDelta = winner.eloDelta;
          }

          if (player.id == loser.id) {
            player.eloDelta = loser.eloDelta;
          }
        });
        return players;
      });
    });
}

function render(data) {
  var players = data.players;

  React.render(<Viilo players={players} leader={players[0]} resultReported={submitResult}/>, document.getElementById('viilo'));
}
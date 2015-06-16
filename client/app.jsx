var React = require('react')
var Viilo = require('./components/viilo');

var request = require('superagent');

loadLeaderboard()

function loadLeaderboard() {
  request
    .get('/leaderboard.json')
    .end(function(err, res) {
      render({
        players: res.body
      })
    });
}

function render(data) {
  var players = data.players;

  React.render(<Viilo players={players} leader={players[0]}/>, document.getElementById('viilo'));
}
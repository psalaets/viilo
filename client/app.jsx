var React = require('react')
var smoothScroll = require('smoothscroll');
var Viilo = require('./components/viilo.jsx');

var request = require('superagent');

loadLeaderboard()

function loadLeaderboard(playerCallback, renderCallback) {
  playerCallback = playerCallback || function(players) {return players};
  renderCallback = renderCallback || function() {};

  request
    .get('/leaderboard.json')
    .end(function(err, res) {
      var players = playerCallback(res.body);

      render({
        players: players
      }, renderCallback);
    });
}

function submitResult(result) {
  request
    .post('/results.json')
    .send(result)
    .end(function(err, res) {
      var winner = res.body.winner;
      var loser = res.body.loser;

      var highestRankedOfRecentPlayers;

      loadLeaderboard(function(players) {
        var recents = players.filter(function(player) {
          return player.id == winner.id || player.id == loser.id;
        });
        highestRankedOfRecentPlayers = recents[0] || null;

        return players.map(makeDeltaAdder(winner, loser));
      }, function() {
        if (highestRankedOfRecentPlayers) {
          scrollToPlayerRow(highestRankedOfRecentPlayers.id);
        }
      });
    });
}

function makeDeltaAdder(winner, loser) {
  return function deltaAdder(player) {
    if (player.id == winner.id) {
      player.eloDelta = winner.eloDelta;
    }

    if (player.id == loser.id) {
      player.eloDelta = loser.eloDelta;
    }

    return player;
  };
}

function render(data, callback) {
  var players = data.players;

  React.render(<Viilo players={players} resultReported={submitResult}/>, document.getElementById('viilo'), callback);
}

function scrollToPlayerRow(playerId) {
  smoothScroll(scrollTarget(playerId));
}

function scrollTarget(playerId) {
  // offset to account for top bar
  var offset = -100;
  return topOfPlayerRow(playerId) + offset;
}

function topOfPlayerRow(playerId) {
  return document.querySelector('[data-player-id="' + playerId + '"]').getBoundingClientRect().top;
}

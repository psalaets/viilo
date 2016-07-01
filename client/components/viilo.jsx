var React = require('react');

var Leaderboard = require('./leaderboard.jsx');
var Showoff = require('./showoff.jsx');
var TopBar = require('./top-bar.jsx');

var Viilo = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    resultReported: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      resultReported: function() {}
    };
  },
  render: function () {

    return (
      <div>
        <Showoff playersByName={this.playersByName()} resultReported={this.props.resultReported}/>
        <Leaderboard players={this.props.players}/>
      </div>
    );
  },
  playersByName: function() {
    var players = this.props.players.map(function(player) {
      return {
        name: player.name,
        id: player.id
      };
    });
    players.sort(function(p1, p2) {
      if (p1.name < p2.name) {
        return -1;
      } else if (p1.name > p2.name) {
        return 1;
      }
      return 0;
    });
    return players;
  }
});

module.exports = Viilo;

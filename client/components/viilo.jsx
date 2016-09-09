var React = require('react');

var Leaderboard = require('./leaderboard.jsx');
var Showoff = require('./showoff.jsx');
var Overlay = require('./overlay.jsx');

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
  getInitialState: function () {
    return { mainOverlayState: false };
  },
  toggleMainOverlayState: function(e) {
    this.state.mainOverlayState ? this.setState({ mainOverlayState: false }) : this.setState({ mainOverlayState: true });
  },
  render: function () {
    return (
      <main>
        <Overlay active={this.state.mainOverlayState} toggle={this.toggleMainOverlayState} title="this is an overlay">
          <strong> Works </strong>
        </Overlay>
        <Showoff playersByName={this.playersByName()} resultReported={this.props.resultReported}/>
        <div data-layout="main-page">
          <header data-area="title">
            <div className="wrapper">
              <h2 className="trafalgar" onClick={this.toggleMainOverlayState}>Rankings &middot; Season 3</h2>
            </div>
          </header>
          <main data-area="main">
            <div className="wrapper">
              <Leaderboard players={this.props.players}/>
            </div>
          </main>
        </div>
      </main>
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

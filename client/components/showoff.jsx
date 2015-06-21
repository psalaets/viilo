var React = require('react');

var PlayerSelector = require('./player-selector.jsx');

var Showoff = React.createClass({
  propTypes: {
      leader: React.PropTypes.object.isRequired,
      playersByName: React.PropTypes.array
  },
  getDefaultProps: function () {
    return {
      playersByName: []
    };
  },
  getInitialState: function () {
    return {
      loserListExcludeId: null,
      winnerListExcludeId: null
    };
  },
  render: function() {
    return (
      <div data-showoff>
        <div className="panel">
          <span className="subtitle">Report Result</span>
          <PlayerSelector
            name="winnerId"
            playerSelected={this.winnerSelected}
            players={this.props.playersByName}
            defaultOptionText="Winner"
            excludeId={this.state.winnerListExcludeId}/>
          beat
          <PlayerSelector
            name="loserId"
            playerSelected={this.loserSelected}
            players={this.props.playersByName}
            defaultOptionText="Loser"
            excludeId={this.state.loserListExcludeId}/>
        </div>
        <div className="panel">
          <span className="subtitle">Currently Dominating</span>
          <h2 className="king"><i className="fa fa-trophy"></i> {this.props.leader.name}</h2>
        </div>
      </div>
    );
  },
  winnerSelected: function(id) {
    this.setState({
      loserListExcludeId: id
    });
  },
  loserSelected: function(id) {
    this.setState({
      winnerListExcludeId: id
    });
  }
});

module.exports = Showoff;
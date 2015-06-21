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
            ref="winnerList"
            playerSelected={this.winnerSelected}
            players={this.props.playersByName}
            defaultOptionText="Winner"
            excludeId={this.state.winnerListExcludeId}/>
          beat
          <PlayerSelector
            ref="loserList"
            playerSelected={this.loserSelected}
            players={this.props.playersByName}
            defaultOptionText="Loser"
            excludeId={this.state.loserListExcludeId}/>
          <div>
            <button>Submit</button>
            <button onClick={this.resetResultPickers}>Reset</button>
          </div>
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
  },
  resetResultPickers: function() {
    this.loserSelected(null);
    this.refs.loserList.reset();

    this.winnerSelected(null);
    this.refs.winnerList.reset();
  }
});

module.exports = Showoff;
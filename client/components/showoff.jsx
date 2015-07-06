var React = require('react');

var PlayerSelector = require('./player-selector.jsx');

var Showoff = React.createClass({
  propTypes: {
      leader: React.PropTypes.object.isRequired,
      playersByName: React.PropTypes.array,
      resultReported: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      playersByName: [],
      resultReported: function() {}
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
        {/* TODO move this into its own component */}
        <div data-showoff-panel="selector">
          <span className="subtitle">Report Result</span>
          <PlayerSelector
            ref="winnerList"
            playerSelected={this.winnerSelected}
            players={this.props.playersByName}
            defaultOptionText="Winner"
            excludeId={this.state.winnerListExcludeId}/>
          <span className="radical">has defeated</span>
          <PlayerSelector
            ref="loserList"
            playerSelected={this.loserSelected}
            players={this.props.playersByName}
            defaultOptionText="Loser"
            excludeId={this.state.loserListExcludeId}/>
          <div className="controls">
            <button onClick={this.handleResultReported}>Submit</button>
            <button onClick={this.handleReset}>Reset</button>
          </div>
        </div>

        <div data-showoff-panel="king">
          <span className="subtitle">Currently Dominating</span>
          <h2 className="king"><i className="fa fa-trophy"></i> {this.props.leader.name}</h2>
        </div>

      </div>
    );
  },
  handleResultReported: function() {
    var winnerId = this.refs.winnerList.getSelectedId();
    var loserId = this.refs.loserList.getSelectedId();

    if (winnerId && loserId) {
      this.props.resultReported({
        winnerId: winnerId,
        loserId: loserId
      });

      this.handleReset();
    }
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
  handleReset: function() {
    this.loserSelected(null);
    this.refs.loserList.reset();

    this.winnerSelected(null);
    this.refs.winnerList.reset();
  }
});

module.exports = Showoff;

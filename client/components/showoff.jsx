var React = require('react');

var PlayerSelector = require('./player-selector.jsx');

var Showoff = React.createClass({
  propTypes: {
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
      <div data-player-select>
        <div data-layout="triple">

          <div data-area="generic">
            <div className="wrapper">
              <PlayerSelector
                ref="winnerList"
                playerSelected={this.winnerSelected}
                players={this.props.playersByName}
                defaultOptionText="Winner"
                excludeId={this.state.winnerListExcludeId}/>
            </div>
          </div>

          <div data-area="generic">
            <div className="wrapper">
              <PlayerSelector
                ref="loserList"
                playerSelected={this.loserSelected}
                players={this.props.playersByName}
                defaultOptionText="Loser"
                excludeId={this.state.loserListExcludeId}/>
            </div>
          </div>

          <div data-area="generic">
            <div className="wrapper">
              <button onClick={this.handleResultReported}>Log It!</button>
            </div>
          </div>

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

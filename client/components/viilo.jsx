var React = require('react');

var Leaderboard = require('./leaderboard');
var Showoff = require('./showoff');
var TopBar = require('./top-bar');

var Viilo = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    leader: React.PropTypes.object.isRequired
  },
  render: function () {
    var wrapperDivStyle = {
      paddingTop: '4.5rem'
    };

    return (
      <div>
        <TopBar/>
        <div style={wrapperDivStyle}>
          <Showoff leader={this.props.leader}/>
          <Leaderboard players={this.props.players}/>
        </div>
      </div>
    );
  }
});

module.exports = Viilo;
var React = require('react');

var PlayerSelector = React.createClass({
  propTypes: {
    players: React.PropTypes.array,
    excludeId: React.PropTypes.string,
    defaultOptionText: React.PropTypes.string,
    playerSelected: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      players: [],
      excludeId: null,
      defaultOptionText: '-',
      playerSelected: function() {}
    };
  },
  getInitialState: function () {
    return {
      selectedId: ''
    };
  },
  render: function() {
    var options = this.props.players.filter(function(player) {
      return player.id !== this.props.excludeId;
    }, this).map(function(player) {
      return (
        <option key={player.id} value={player.id}>{player.name}</option>
      );
    });

    // default option
    options.unshift(<option key="" value="">{this.props.defaultOptionText}</option>)

    return (
      <select ref="select" value={this.state.selectedId} onChange={this.handleSelection}>
        {options}
      </select>
    );
  },
  handleSelection: function(event) {
    var selectedId = event.target.value;

    this.setState({
      selectedId: selectedId
    });

    this.props.playerSelected(selectedId);
  },
  reset: function() {
    this.setState({
      selectedId: ''
    });
  },
  getSelectedId: function() {
    return this.state.selectedId;
  }
});

module.exports = PlayerSelector;
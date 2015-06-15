var React = require('react');

var Showoff = React.createClass({
  propTypes: {
      leader: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div data-showoff>
        <div className="panel">
          <span className="subtitle">Currently Dominating</span>
          <h2 className="king"><i className="fa fa-trophy"></i> {this.props.leader.name}</h2>
        </div>
      </div>
    );
  }
});

module.exports = Showoff;
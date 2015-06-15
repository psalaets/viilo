var React = require('react');

var Showoff = React.createClass({
  propTypes: {
      leader: React.PropTypes.object
  },
  render: function() {
    <div data-showoff>
      <div className="panel">
        <span className="subtitle">Currently Dominating</span>
        <h2 className="king"><i className="fa fa-trophy"></i> {{leader.name}}</h2>
      </div>
    </div>
  }
});

module.exports = Showoff;
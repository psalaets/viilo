var React = require('react');

var TopBar = React.createClass({
  render: function() {
    return (
      <div data-top-bar>
        <img src="static/img/logo.png" alt="" />
        <h1><a href="/">King of Pong</a></h1>
      </div>
    );
  }
});

module.exports = TopBar;
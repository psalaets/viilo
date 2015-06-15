var React = require('react')
var Viilo = require('./components/viilo.jsx');

var players = [{"_id":"5563761927a15ac525275408","name":"bob","__v":5,"rank":2,"lastTen":"2 - 3","streak":"W1","losses":3,"wins":2,"provisional":false,"elo":1188,"id":"5563761927a15ac525275408","gamePlayed":5},{"_id":"5563761c27a15ac525275409","name":"joe","__v":6,"rank":1,"lastTen":"4 - 2","streak":"L1","losses":2,"wins":4,"provisional":false,"elo":1223,"id":"5563761c27a15ac525275409","gamePlayed":6},{"_id":"5563762027a15ac52527540a","name":"tom","__v":1,"rank":3,"lastTen":"0 - 1","streak":"L1","losses":1,"wins":0,"provisional":true,"elo":1184,"id":"5563762027a15ac52527540a","gamePlayed":1}]

React.render(<Viilo players={players} leader={players[0]}/>, document.getElementById('viilo'));

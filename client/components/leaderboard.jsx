var React = require('react');

var Leaderboard = React.createClass({
  propTypes: {
    // TODO more specific re: array contents
    players: React.PropTypes.array.isRequired
  },
  render: function() {
    var rows = this.createRows(this.props.players);

    return (
      <div data-leaderboard>
        <table>
          <thead>
            <tr>
              <th className="rank-heading"><i className="fa fa-certificate"></i></th>
              <th className="name-heading">Name </th>
              <th className="elo-heading">Elo</th>
              <th className="winlose">
                <i className="win-heading fa fa-trophy"></i> &middot; <i className="lose-heading fa fa-frown-o"></i>
              </th>
              <th className="percent-heading">%</th>
              <th className="streak-heading"><i className="fa fa-fire"></i></th>
              <th className="lastten-heading">L10</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  },
  createRows: function(players) {
    var rows = [];

    var previousTier;
    for (var i = 0; i < players.length; i++) {
      var player = players[i];

      // tier divider if needed
      if (player.tier !== previousTier) {
        previousTier = player.tier;
        rows.push(this.tierHeaderRow(player.tier));
      }

      // the player
      rows.push(this.playerRow(player));
    }

    return rows;
  },
  tierHeaderRow: function(tier) {
    // NOTE: keep this in sync with number of <td> in platerRow()
    var columns = 7;
    var tierName;
    var tierIcon;

    switch(tier) {
      case 1:
        tierName = 'diamond';
        tierIcon = 'diamond';
        break;
      case 2:
        tierName = 'gold';
        tierIcon = 'trophy';
        break;
      case 3:
        tierName = 'silver';
        tierIcon = 'shield';
        break;
      case 4:
        tierName = 'bronze';
        tierIcon = 'circle';
        break;
    }

    return (
      <tr className={'great-primer tier tier-' + tierName} key={'tier-' + tier + '-header'}>
        <td colSpan={columns}>{tierName} &middot; <i className={'fa fa-' + tierIcon} aria-hidden="true"></i></td>
      </tr>
    );
  },
  playerRow: function(player) {
    var rowClass = null;
    if (player.provisional) {
      rowClass = 'provisional';
    }

    // NOTE: keep 'columns' in tierHeaderRow() in sync with number of <td> here
    return (
      <tr key={player.id} className={rowClass} data-player-id={player.id}>
        <td className="rank">{this.rank(player)}</td>
        <td className="name">{player.name} {this.playerEloDelta(player)}</td>
        <td className="elo">{player.elo}</td>
        <td className="winlose">
          <span className="win">{player.wins}</span> &middot; <span className="lose">{player.losses}</span>
        </td>
        <td className="percent">{this.winningPercentage(player)}</td>
        <td className="streak">{this.streak(player.streak)}</td>
        <td className="lastten">{this.lastTen(player.lastTen)}</td>
      </tr>
    );
  },
  rank: function(player) {
    if (player.provisional) {
      return 'P';
    } else {
      return player.rank;
    }
  },
  //because cameron likes PERCENT, PAUL!
  winningPercentage: function(player) {
    var totalGames = player.wins + player.losses;

    if (totalGames > 0) {
      if (player.wins == totalGames) {
        return '100%';
      } else if (player.wins == 0) {
        return '0%';
      } else {
        var percent = player.wins / totalGames;
        var fixed = percent.toFixed(2);
        return Number(fixed.slice(2)) + '%';
      }
    } else {
      return '-';
    }
  },
  playerEloDelta: function(player) {
    if ('eloDelta' in player) {
      if (player.eloDelta >= 0) { // gained elo
        return (<span>({player.eloDelta})</span>);
      } else { // lost elo
        return (<span>({player.eloDelta})</span>);
      }
    }
  },
  /**
  * @param {object} rawStreak - Streak object from player json
  */
  streak: function(rawStreak) {
    if (rawStreak.count == 0) {
      return '-';
    } else {
      return rawStreak.outcome + rawStreak.count;
    }
  },
  /**
  * @param {string[]} rawLastTen - Last ten object from player json
  */
  lastTen: function(rawLastTen) {
    var counts = rawLastTen.reduce(function(prev, curr) {
      prev[curr] += 1;
      return prev;
    }, {W: 0, L: 0});

    return counts.W + ' · ' + counts.L;
  }
})

module.exports = Leaderboard;

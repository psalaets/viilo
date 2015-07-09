var tiers = [{
  id: 1,
  kFactor: 8,
  rankRange: [1, 2]
}, {
  id: 2,
  kFactor: 16,
  rankRange: [3, 5]
}, {
  id: 3,
  kFactor: 24,
  rankRange: [6, 10]
}, {
  id: 4,
  kFactor: 32,
  rankRange: [11, Infinity]
}];

module.exports = {
  byRank: function(rank) {
    return findTier(function(tier) {
      var minRank = tier.rankRange[0];
      var maxRank = tier.rankRange[1];

      return minRank <= rank && rank <= maxRank;
    });
  },
  byId: function(id) {
    return findTier(function(tier) {
      return tier.id == id;
    });
  },
  lowest: function() {
    return tiers[tiers.length - 1];
  }
};

function findTier(by) {
  return tiers.filter(by)[0] || null;
}
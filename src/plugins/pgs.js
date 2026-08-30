const PGS = {
  submitScore: async ({ leaderboardID, score }) => {
    return await Capacitor.Plugins.PGS.submitScore({ leaderboardID, score });
  },
  unlock: async ({ achievementID }) => {
    return await Capacitor.Plugins.PGS.unlock({ achievementID });
  }
};

export { PGS };

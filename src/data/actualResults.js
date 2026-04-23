// src/data/actualResults.js

// These are the "real" results used for scoring.
// For now, we are hardcoding them so we can test the scoring system.

export const actualResults = {
    // Group A
    A1: { homeScore: 2, awayScore: 1 },
    A2: { homeScore: 1, awayScore: 2 },
    A3: { homeScore: 1, awayScore: 1 },
    A4: { homeScore: 2, awayScore: 0 },
    A5: { homeScore: 3, awayScore: 1 },
    A6: { homeScore: 1, awayScore: 2 },
  
    // Group B
    B1: { homeScore: 2, awayScore: 2 },
    B2: { homeScore: 1, awayScore: 0 },
    B3: { homeScore: 0, awayScore: 1 },
    B4: { homeScore: 2, awayScore: 1 },
    B5: { homeScore: 3, awayScore: 0 },
    B6: { homeScore: 1, awayScore: 1 },
  
    // Knockout round
    K1: { homeScore: 2, awayScore: 1, advancingTeamId: "MEX" },
    K2: { homeScore: 1, awayScore: 1, advancingTeamId: "CZE" },
  
    // Final
    FINAL: { homeScore: 3, awayScore: 3, advancingTeamId: "POR" },
  };
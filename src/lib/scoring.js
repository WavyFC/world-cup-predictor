// src/lib/scoring.js

function toNum(value) {
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }
  
  function getResultType(homeScore, awayScore) {
    if (homeScore === awayScore) return "draw";
    return homeScore > awayScore ? "home" : "away";
  }
  
  function isExactScore(prediction, actual) {
    const pHome = toNum(prediction?.homeScore);
    const pAway = toNum(prediction?.awayScore);
    const aHome = toNum(actual?.homeScore);
    const aAway = toNum(actual?.awayScore);
  
    if ([pHome, pAway, aHome, aAway].some((v) => v === null)) return false;
  
    return pHome === aHome && pAway === aAway;
  }
  
  function isCorrectResult(prediction, actual) {
    const pHome = toNum(prediction?.homeScore);
    const pAway = toNum(prediction?.awayScore);
    const aHome = toNum(actual?.homeScore);
    const aAway = toNum(actual?.awayScore);
  
    if ([pHome, pAway, aHome, aAway].some((v) => v === null)) return false;
  
    return getResultType(pHome, pAway) === getResultType(aHome, aAway);
  }
  
  function isDraw(actual) {
    const aHome = toNum(actual?.homeScore);
    const aAway = toNum(actual?.awayScore);
  
    if ([aHome, aAway].some((v) => v === null)) return false;
  
    return aHome === aAway;
  }
  
  function isCorrectAdvancer(prediction, actual) {
    if (!prediction?.advancingTeamId || !actual?.advancingTeamId) return false;
    return prediction.advancingTeamId === actual.advancingTeamId;
  }
  
  // ---------------------------------------------
  // GROUP STAGE
  // ---------------------------------------------
  function scoreGroupMatch(prediction, actual) {
    if (!prediction || !actual) return 0;
  
    if (isExactScore(prediction, actual)) {
      return 5;
    }
  
    if (isCorrectResult(prediction, actual)) {
      return 2;
    }
  
    return 0;
  }
  
  export function scoreGroupStage(predictions, actualResults) {
    const breakdown = {};
    let total = 0;
  
    Object.entries(actualResults || {}).forEach(([matchId, actual]) => {
      // only group-stage matches, like A1, B3, etc.
      if (matchId.startsWith("R32_") || matchId.startsWith("roundOf16_") ||
          matchId.startsWith("quarterfinals_") || matchId.startsWith("semifinals_") ||
          matchId.startsWith("thirdPlace_") || matchId.startsWith("final_") ||
          matchId === "FINAL") {
        return;
      }
  
      const points = scoreGroupMatch(predictions?.[matchId], actual);
      breakdown[matchId] = points;
      total += points;
    });
  
    return { total, breakdown };
  }
  
  // ---------------------------------------------
  // KNOCKOUT STAGE
  // ---------------------------------------------
  function scoreKnockoutMatch(prediction, actual) {
    if (!prediction || !actual) return 0;
  
    const exact = isExactScore(prediction, actual);
    const correctResult = isCorrectResult(prediction, actual);
    const actualWasDraw = isDraw(actual);
    const correctAdvancer = isCorrectAdvancer(prediction, actual);
  
    // Draw after 90 minutes: advancing team matters
    // Draw after 90 minutes: custom scoring
    if (actualWasDraw) {
        if (exact && correctAdvancer) return 5;
        if (!exact && correctAdvancer) return 3;
        if (exact && !correctAdvancer) return 2;
        return 1;
    }
  
    // Normal non-draw knockout result
    if (exact) return 5;
    if (correctResult) return 2;
    return 0;
  }
  
  export function scoreKnockoutStage(knockoutPredictions, actualResults) {
    const breakdown = {};
    let total = 0;
  
    Object.entries(actualResults || {}).forEach(([matchId, actual]) => {
      const isKnockoutMatch =
        matchId.startsWith("R32_") ||
        matchId.startsWith("roundOf16_") ||
        matchId.startsWith("quarterfinals_") ||
        matchId.startsWith("semifinals_") ||
        matchId.startsWith("thirdPlace_");
  
      if (!isKnockoutMatch) return;
  
      const points = scoreKnockoutMatch(knockoutPredictions?.[matchId], actual);
      breakdown[matchId] = points;
      total += points;
    });
  
    return { total, breakdown };
  }
  
  // ---------------------------------------------
  // FINAL
  // ---------------------------------------------
  function scoreFinalMatch(prediction, actual) {
    if (!prediction || !actual) return 0;
  
    const exact = isExactScore(prediction, actual);
    const correctResult = isCorrectResult(prediction, actual);
    const actualWasDraw = isDraw(actual);
    const correctAdvancer = isCorrectAdvancer(prediction, actual);
  
    if (actualWasDraw) {
        if (exact && correctAdvancer) return 5;
        if (!exact && correctAdvancer) return 3;
        if (exact && !correctAdvancer) return 2;
        return 1;
      }
  
    if (exact) return 5;
    if (correctResult) return 2;
    return 0;
  }
  
  export function scoreFinal(finalPrediction, actualResults) {
    const breakdown = {};
    let total = 0;
  
    // supports either final_1 or FINAL depending on your actualResults shape
    const finalMatchId = actualResults?.final_1
      ? "final_1"
      : actualResults?.FINAL
      ? "FINAL"
      : null;
  
    if (!finalMatchId) {
      return { total, breakdown };
    }
  
    const actual = actualResults[finalMatchId];
    const points = scoreFinalMatch(finalPrediction, actual);
  
    breakdown[finalMatchId] = points;
    total += points;
  
    return { total, breakdown };
  }
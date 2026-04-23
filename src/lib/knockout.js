// src/lib/knockout.js

import { getThirdPlaceSlotMapping } from "../data/knockoutThirdPlaceMap";

// ---------------------------------------------
// BASIC HELPERS
// ---------------------------------------------
export function getKnockoutWinner(match, prediction) {
  if (!prediction || !match) return null;

  const homeScore = Number(prediction.homeScore);
  const awayScore = Number(prediction.awayScore);

  if (isNaN(homeScore) || isNaN(awayScore)) return null;

  if (homeScore > awayScore) return match.homeTeam;
  if (awayScore > homeScore) return match.awayTeam;

  if (
    prediction.advancingTeamId &&
    (prediction.advancingTeamId === match.homeTeam ||
      prediction.advancingTeamId === match.awayTeam)
  ) {
    return prediction.advancingTeamId;
  }

  return null;
}

export function getChampion(finalMatch, finalPrediction) {
  if (!finalMatch || !finalPrediction) return null;
  return getKnockoutWinner(finalMatch, finalPrediction);
}

export function getTopTwoTeams(allGroupStandings) {
  const qualified = [];

  Object.values(allGroupStandings).forEach((groupTable) => {
    const first = groupTable[0];
    const second = groupTable[1];

    if (first) qualified.push(first.teamId);
    if (second) qualified.push(second.teamId);
  });

  return qualified;
}

export function getThirdPlacedTeams(allGroupStandings) {
  const thirdPlaced = [];

  Object.entries(allGroupStandings).forEach(([groupName, groupTable]) => {
    const third = groupTable[2];
    if (third) {
      thirdPlaced.push({
        ...third,
        group: groupName,
      });
    }
  });

  thirdPlaced.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  return thirdPlaced;
}

export function getBestThirdPlacedTeams(allGroupStandings, count = 8) {
  return getThirdPlacedTeams(allGroupStandings).slice(0, count);
}

// ---------------------------------------------
// ROUND OF 32
// ---------------------------------------------
export function buildRoundOf32(allGroupStandings) {
  const winners = {};
  const runnersUp = {};
  const thirdPlaced = [];

  for (const [groupName, table] of Object.entries(allGroupStandings)) {
    if (table[0]) winners[groupName] = table[0].teamId;
    if (table[1]) runnersUp[groupName] = table[1].teamId;

    if (table[2]) {
      thirdPlaced.push({
        ...table[2],
        group: groupName,
      });
    }
  }

  thirdPlaced.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  const bestThirds = thirdPlaced.slice(0, 8);

  if (bestThirds.length < 8) return [];

  const thirdByGroup = Object.fromEntries(
    bestThirds.map((team) => [team.group, team.teamId])
  );

  const thirdComboKey = Object.keys(thirdByGroup).sort().join("");
  const combo = getThirdPlaceSlotMapping(thirdComboKey);

  if (!combo) {
    console.warn("Missing Round of 32 third-place mapping for:", thirdComboKey);
    return [];
  }

  return [
    {
      id: "R32_73",
      round: "roundOf32",
      label: "Round of 32 - Match 73",
      homeTeam: runnersUp.A || null,
      awayTeam: runnersUp.B || null,
      startTime: "2026-06-28T19:00:00",
    },
    {
      id: "R32_74",
      round: "roundOf32",
      label: "Round of 32 - Match 74",
      homeTeam: winners.E || null,
      awayTeam: thirdByGroup[combo.E] || null,
      startTime: "2026-06-29T19:00:00",
    },
    {
      id: "R32_75",
      round: "roundOf32",
      label: "Round of 32 - Match 75",
      homeTeam: winners.F || null,
      awayTeam: runnersUp.C || null,
      startTime: "2026-06-29T22:00:00",
    },
    {
      id: "R32_76",
      round: "roundOf32",
      label: "Round of 32 - Match 76",
      homeTeam: winners.C || null,
      awayTeam: runnersUp.F || null,
      startTime: "2026-06-30T19:00:00",
    },
    {
      id: "R32_77",
      round: "roundOf32",
      label: "Round of 32 - Match 77",
      homeTeam: winners.I || null,
      awayTeam: thirdByGroup[combo.I] || null,
      startTime: "2026-06-30T22:00:00",
    },
    {
      id: "R32_78",
      round: "roundOf32",
      label: "Round of 32 - Match 78",
      homeTeam: runnersUp.E || null,
      awayTeam: runnersUp.I || null,
      startTime: "2026-07-01T19:00:00",
    },
    {
      id: "R32_79",
      round: "roundOf32",
      label: "Round of 32 - Match 79",
      homeTeam: winners.A || null,
      awayTeam: thirdByGroup[combo.A] || null,
      startTime: "2026-07-01T22:00:00",
    },
    {
      id: "R32_80",
      round: "roundOf32",
      label: "Round of 32 - Match 80",
      homeTeam: winners.L || null,
      awayTeam: thirdByGroup[combo.L] || null,
      startTime: "2026-07-02T19:00:00",
    },
    {
      id: "R32_81",
      round: "roundOf32",
      label: "Round of 32 - Match 81",
      homeTeam: winners.D || null,
      awayTeam: thirdByGroup[combo.D] || null,
      startTime: "2026-07-02T22:00:00",
    },
    {
      id: "R32_82",
      round: "roundOf32",
      label: "Round of 32 - Match 82",
      homeTeam: winners.G || null,
      awayTeam: thirdByGroup[combo.G] || null,
      startTime: "2026-07-03T19:00:00",
    },
    {
      id: "R32_83",
      round: "roundOf32",
      label: "Round of 32 - Match 83",
      homeTeam: runnersUp.K || null,
      awayTeam: runnersUp.L || null,
      startTime: "2026-07-03T22:00:00",
    },
    {
      id: "R32_84",
      round: "roundOf32",
      label: "Round of 32 - Match 84",
      homeTeam: winners.H || null,
      awayTeam: runnersUp.J || null,
      startTime: "2026-07-04T19:00:00",
    },
    {
      id: "R32_85",
      round: "roundOf32",
      label: "Round of 32 - Match 85",
      homeTeam: winners.B || null,
      awayTeam: thirdByGroup[combo.B] || null,
      startTime: "2026-07-04T22:00:00",
    },
    {
      id: "R32_86",
      round: "roundOf32",
      label: "Round of 32 - Match 86",
      homeTeam: winners.J || null,
      awayTeam: runnersUp.H || null,
      startTime: "2026-07-05T19:00:00",
    },
    {
      id: "R32_87",
      round: "roundOf32",
      label: "Round of 32 - Match 87",
      homeTeam: winners.K || null,
      awayTeam: thirdByGroup[combo.K] || null,
      startTime: "2026-07-05T22:00:00",
    },
    {
      id: "R32_88",
      round: "roundOf32",
      label: "Round of 32 - Match 88",
      homeTeam: runnersUp.D || null,
      awayTeam: runnersUp.G || null,
      startTime: "2026-07-06T19:00:00",
    },
  ];
}

// ---------------------------------------------
// OFFICIAL FIFA LATER ROUNDS
// ---------------------------------------------
export function buildRoundOf16(roundOf32Matches, predictions) {
  if (!roundOf32Matches || roundOf32Matches.length === 0) return [];

  const byId = Object.fromEntries(roundOf32Matches.map((m) => [m.id, m]));

  const pairings = [
    ["R32_74", "R32_77"], // Match 89
    ["R32_73", "R32_75"], // Match 90
    ["R32_76", "R32_78"], // Match 91
    ["R32_79", "R32_80"], // Match 92
    ["R32_83", "R32_84"], // Match 93
    ["R32_81", "R32_82"], // Match 94
    ["R32_86", "R32_88"], // Match 95
    ["R32_85", "R32_87"], // Match 96
  ];

  return pairings.map(([idA, idB], index) => {
    const matchA = byId[idA];
    const matchB = byId[idB];

    return {
      id: `roundOf16_${index + 1}`,
      round: "roundOf16",
      label: `Round of 16 ${index + 1}`,
      homeTeam: matchA ? getKnockoutWinner(matchA, predictions[matchA.id]) : null,
      awayTeam: matchB ? getKnockoutWinner(matchB, predictions[matchB.id]) : null,
      startTime: "2026-07-04T19:00:00",
    };
  });
}

export function buildQuarterfinals(roundOf16Matches, predictions) {
  if (!roundOf16Matches || roundOf16Matches.length === 0) return [];

  const byId = Object.fromEntries(roundOf16Matches.map((m) => [m.id, m]));

  const pairings = [
    ["roundOf16_1", "roundOf16_2"], // Match 97
    ["roundOf16_5", "roundOf16_6"], // Match 98
    ["roundOf16_3", "roundOf16_4"], // Match 99
    ["roundOf16_7", "roundOf16_8"], // Match 100
  ];

  return pairings.map(([idA, idB], index) => {
    const matchA = byId[idA];
    const matchB = byId[idB];

    return {
      id: `quarterfinals_${index + 1}`,
      round: "quarterfinals",
      label: `Quarter-final ${index + 1}`,
      homeTeam: matchA ? getKnockoutWinner(matchA, predictions[matchA.id]) : null,
      awayTeam: matchB ? getKnockoutWinner(matchB, predictions[matchB.id]) : null,
      startTime: "2026-07-09T19:00:00",
    };
  });
}

export function buildSemifinals(quarterfinalMatches, predictions) {
  if (!quarterfinalMatches || quarterfinalMatches.length === 0) return [];

  const byId = Object.fromEntries(quarterfinalMatches.map((m) => [m.id, m]));

  const pairings = [
    ["quarterfinals_1", "quarterfinals_2"], // Match 101
    ["quarterfinals_3", "quarterfinals_4"], // Match 102
  ];

  return pairings.map(([idA, idB], index) => {
    const matchA = byId[idA];
    const matchB = byId[idB];

    return {
      id: `semifinals_${index + 1}`,
      round: "semifinals",
      label: `Semi-final ${index + 1}`,
      homeTeam: matchA ? getKnockoutWinner(matchA, predictions[matchA.id]) : null,
      awayTeam: matchB ? getKnockoutWinner(matchB, predictions[matchB.id]) : null,
      startTime: "2026-07-14T19:00:00",
    };
  });
}

export function buildFinal(semifinalMatches, predictions) {
  if (!semifinalMatches || semifinalMatches.length < 2) return [];

  const byId = Object.fromEntries(semifinalMatches.map((m) => [m.id, m]));

  const matchA = byId["semifinals_1"];
  const matchB = byId["semifinals_2"];

  return [
    {
      id: "final_1",
      round: "final",
      label: "Final 1",
      homeTeam: matchA ? getKnockoutWinner(matchA, predictions[matchA.id]) : null,
      awayTeam: matchB ? getKnockoutWinner(matchB, predictions[matchB.id]) : null,
      startTime: "2026-07-19T19:00:00",
    },
  ];
}

export function buildThirdPlaceMatch(semifinalMatches, predictions) {
  if (!semifinalMatches || semifinalMatches.length < 2) return null;

  const semis = semifinalMatches.slice(0, 2);

  const loserIds = semis.map((match) => {
    const winner = getKnockoutWinner(match, predictions[match.id]);
    if (!winner) return null;

    return winner === match.homeTeam ? match.awayTeam : match.homeTeam;
  });

  if (!loserIds[0] || !loserIds[1]) return null;

  return {
    id: "thirdPlace_1",
    round: "thirdPlace",
    label: "Third Place Match",
    homeTeam: loserIds[0],
    awayTeam: loserIds[1],
    startTime: "2026-07-18T19:00:00",
  };
}
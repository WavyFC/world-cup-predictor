// src/lib/standings.js

// This function calculates the standings table for one group.
// It takes:
// 1. groupTeams: the 4 teams in that group
// 2. groupMatches: the 6 matches in that group
// 3. predictions: the scores the user entered
export function calculateStandings(groupTeams, groupMatches, predictions) {
    // We store each team's stats in an object first.
    // Using team IDs as keys makes lookup easy.
    const table = {};
  
    // Step 1: Create an empty row for each team
    groupTeams.forEach((team) => {
      table[team.id] = {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    });
  
    // Step 2: Apply each predicted match result to the table
    groupMatches.forEach((match) => {
      const prediction = predictions[match.id];
  
      // If no prediction has been entered yet, skip this match
      if (!prediction) return;
  
      // Turn input values into numbers
      const homeScore = Number(prediction.homeScore);
      const awayScore = Number(prediction.awayScore);
  
      // If either value is invalid, skip this match
      if (isNaN(homeScore) || isNaN(awayScore)) return;
  
      const homeTeamRow = table[match.homeTeam];
      const awayTeamRow = table[match.awayTeam];
  
      // Update played count
      homeTeamRow.played += 1;
      awayTeamRow.played += 1;
  
      // Update goals for / against
      homeTeamRow.goalsFor += homeScore;
      homeTeamRow.goalsAgainst += awayScore;
  
      awayTeamRow.goalsFor += awayScore;
      awayTeamRow.goalsAgainst += homeScore;
  
      // Update win / draw / loss and points
      if (homeScore > awayScore) {
        homeTeamRow.won += 1;
        homeTeamRow.points += 3;
        awayTeamRow.lost += 1;
      } else if (awayScore > homeScore) {
        awayTeamRow.won += 1;
        awayTeamRow.points += 3;
        homeTeamRow.lost += 1;
      } else {
        homeTeamRow.drawn += 1;
        awayTeamRow.drawn += 1;
        homeTeamRow.points += 1;
        awayTeamRow.points += 1;
      }
    });
  
    // Step 3: Calculate goal difference for each team
    Object.values(table).forEach((teamRow) => {
      teamRow.goalDifference = teamRow.goalsFor - teamRow.goalsAgainst;
    });
  
    // Step 4: Sort standings
    return Object.values(table).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return 0;
    });
  }
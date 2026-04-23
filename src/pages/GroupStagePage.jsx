// src/pages/GroupStagePage.jsx

export default function GroupStagePage({ tournament }) {
    const {
      groupNames,
      groupsData,
      predictions,
      handleScoreChange,
      getTeamName,
      getTeamFlag,
      isMatchLocked,
      groupScore,
      actualResults,
    } = tournament;
  
    function isMatchCompleted(matchId) {
      const actual = actualResults?.[matchId];
  
      if (!actual) return false;
  
      return (
        actual.homeScore !== undefined &&
        actual.awayScore !== undefined &&
        actual.homeScore !== "" &&
        actual.awayScore !== ""
      );
    }
  
    function getMatchPoints(matchId) {
      return groupScore?.breakdown?.[matchId] ?? 0;
    }
  
    function getPointsBadgeClass(points) {
      if (points >= 3) return "match-points-badge points-3";
      if (points >= 1) return "match-points-badge points-1";
      return "match-points-badge points-0";
    }
  
    function TeamBar({ teamId, align = "left" }) {
      return (
        <div className={`team-bar team-bar-${align}`}>
          <img
            src={getTeamFlag(teamId)}
            alt={`${getTeamName(teamId)} flag`}
            className="team-flag"
          />
          <span className="team-name">{getTeamName(teamId)}</span>
        </div>
      );
    }
  
    function renderStandingsTable(standings) {
        return (
          <div className="group-standings-card">
            <div className="group-standings-header full-standings-header">
              <span>#</span>
              <span>Team</span>
              <span>P</span>
              <span>W</span>
              <span>D</span>
              <span>L</span>
              <span>GF</span>
              <span>GA</span>
              <span>GD</span>
              <span>Pts</span>
            </div>
      
            {standings.map((team, index) => (
              <div
              key={team.teamId}
              className={`group-standings-row full-standings-row ${
                index === 0
                  ? "qualified-row qualified-row-first"
                  : index === 1
                  ? "qualified-row qualified-row-second"
                  : ""
              }`}
            >
                <span className="group-rank">{index + 1}</span>
      
                <div className="group-standings-team">
                  <img
                    src={getTeamFlag(team.teamId)}
                    alt={`${getTeamName(team.teamId)} flag`}
                    className="summary-flag"
                  />
                  <span>{getTeamName(team.teamId)}</span>
                </div>
      
                <span>{team.played}</span>
                <span>{team.won}</span>
                <span>{team.drawn}</span>
                <span>{team.lost}</span>
                <span>{team.goalsFor}</span>
                <span>{team.goalsAgainst}</span>
                <span>{team.goalDifference}</span>
                <span className="group-pts">{team.points}</span>
              </div>
            ))}
          </div>
        );
      }
  
    function renderGroup(groupName, groupInfo, index) {
        const pairIndex = Math.floor(index / 2);
        const baseThemeClass = pairIndex % 2 === 0 ? "group-theme-dark" : "group-theme-light";

        const accentClasses = [
        "group-accent-blue",
        "group-accent-emerald",
        "group-accent-red",
        "group-accent-amber",
        "group-accent-purple",
        "group-accent-cyan",
        ];

        const accentClass = accentClasses[pairIndex] || "group-accent-blue";
      return (
        <div
            key={groupName}
            className={`group-stage-card ${baseThemeClass} ${accentClass}`}
            >
          <h3 className="group-stage-title">Group {groupName}</h3>
  
          <div className="group-stage-matches">
            {groupInfo.matches.map((match) => {
              const matchPoints = getMatchPoints(match.id);
              const completed = isMatchCompleted(match.id);
  
              return (
                <div key={match.id} className="prediction-row-wrap">
                  <div className="prediction-row">
                    <TeamBar teamId={match.homeTeam} align="left" />
  
                    <input
                      className="score-input prediction-score-input"
                      type="number"
                      min="0"
                      value={predictions[match.id]?.homeScore ?? ""}
                      onChange={(e) =>
                        handleScoreChange(match.id, "homeScore", e.target.value)
                      }
                      disabled={isMatchLocked(match.startTime)}
                    />
  
                    <span className="vs-text">vs</span>
  
                    <input
                      className="score-input prediction-score-input"
                      type="number"
                      min="0"
                      value={predictions[match.id]?.awayScore ?? ""}
                      onChange={(e) =>
                        handleScoreChange(match.id, "awayScore", e.target.value)
                      }
                      disabled={isMatchLocked(match.startTime)}
                    />
  
                    <TeamBar teamId={match.awayTeam} align="right" />
                  </div>
  
                  {completed && (
                    <div className={getPointsBadgeClass(matchPoints)}>
                      {matchPoints === 1 ? "+1 pt" : `+${matchPoints} pts`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
  
          {renderStandingsTable(groupInfo.standings)}
        </div>
      );
    }
  
    return (
      <div className="section-card">
        <h2 className="section-title">Group Stage Predictions</h2>
  
        <div className="group-stage-grid">
            {groupNames.map((groupName, index) =>
                renderGroup(groupName, groupsData[groupName], index)
            )}
        </div>
      </div>
    );
  }
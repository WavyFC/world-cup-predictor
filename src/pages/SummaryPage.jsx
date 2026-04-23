// src/pages/SummaryPage.jsx

export default function SummaryPage({ tournament, pool }) {
    const {
      qualifiedTeams,
      roundOf32Matches,
      roundOf16Matches,
      quarterfinalMatches,
      semifinalMatches,
      thirdPlaceMatch,
      finalMatch,
      champion,
      resetAllPredictions,
      groupScore,
      knockoutScore,
      finalScore,
      totalScore,
      predictions,
      knockoutPredictions,
      finalPrediction,
      actualResults,
      matches,
      getTeamName,
      getTeamFlag,
    } = tournament;
  
    const knockoutMatchesCombined = [
      ...(roundOf32Matches || []),
      ...(roundOf16Matches || []),
      ...(quarterfinalMatches || []),
      ...(semifinalMatches || []),
      ...(thirdPlaceMatch ? [thirdPlaceMatch] : []),
      ...(finalMatch ? [finalMatch] : []),
    ];
  
    if (!pool.currentPoolId) {
      return (
        <div className="section-card">
          <h2 className="section-title">Summary</h2>
          <p className="empty-text">Join a pool to view your summary.</p>
        </div>
      );
    }
  
    if (!pool.isUserInCurrentPool) {
      return (
        <div className="section-card">
          <h2 className="section-title">Access Restricted</h2>
          <p className="empty-text">You are not a member of this pool.</p>
        </div>
      );
    }
  
    function handleResetClick() {
      const confirmed = window.confirm(
        "Are you sure you want to clear all predictions and start over?"
      );
  
      if (confirmed) {
        resetAllPredictions();
      }
    }
  
    function getMatchById(matchId) {
      const allMatches = [...matches, ...knockoutMatchesCombined];
      return allMatches.find((match) => match.id === matchId);
    }
  
    function getPredictionByMatchId(matchId) {
      if (matchId === "FINAL") return finalPrediction;
      return knockoutPredictions[matchId] || predictions[matchId];
    }
  
    function getMatchLabel(matchId) {
      if (matchId === "FINAL" && finalMatch) {
        return {
          homeTeam: finalMatch.homeTeam,
          awayTeam: finalMatch.awayTeam,
        };
      }
  
      const match = getMatchById(matchId);
      if (!match) return null;
  
      return {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
      };
    }
  
    function getAdvancingText(matchId, prediction, actual) {
      const actualHome = Number(actual?.homeScore);
      const actualAway = Number(actual?.awayScore);
  
      if (isNaN(actualHome) || isNaN(actualAway)) return null;
      if (actualHome !== actualAway) return null;
  
      const predictedTeam =
        prediction?.advancingTeamId && getTeamName(prediction.advancingTeamId);
      const actualTeam =
        actual?.advancingTeamId && getTeamName(actual.advancingTeamId);
  
      if (!predictedTeam && !actualTeam) return null;
  
      return {
        predictedText: predictedTeam || "—",
        actualText: actualTeam || "—",
      };
    }
  
    function getBreakdownCardClass(points) {
      if (points >= 3) return "breakdown-card breakdown-card-green";
      if (points >= 1) return "breakdown-card breakdown-card-yellow";
      return "breakdown-card breakdown-card-red";
    }
  
    function BreakdownMatchHeader({ teamIds }) {
      if (!teamIds) {
        return <div className="breakdown-match-title">Unknown Match</div>;
      }
  
      return (
        <div className="breakdown-match-header">
          <div className="breakdown-team-inline">
            <img
              src={getTeamFlag(teamIds.homeTeam)}
              alt={`${getTeamName(teamIds.homeTeam)} flag`}
              className="summary-flag"
            />
            <span>{getTeamName(teamIds.homeTeam)}</span>
          </div>
  
          <span className="summary-vs">vs</span>
  
          <div className="breakdown-team-inline">
            <img
              src={getTeamFlag(teamIds.awayTeam)}
              alt={`${getTeamName(teamIds.awayTeam)} flag`}
              className="summary-flag"
            />
            <span>{getTeamName(teamIds.awayTeam)}</span>
          </div>
        </div>
      );
    }
  
    function renderBreakdownCard(matchId, points) {
      const prediction = getPredictionByMatchId(matchId);
      const actual = actualResults[matchId];
      const teamIds = getMatchLabel(matchId);
      const advancingInfo = getAdvancingText(matchId, prediction, actual);
  
      return (
        <div key={matchId} className={getBreakdownCardClass(points)}>
          <div className="breakdown-card-top">
            <div className="breakdown-match-id">{matchId}</div>
            <div className="breakdown-points-badge">{points} pts</div>
          </div>
  
          <BreakdownMatchHeader teamIds={teamIds} />
  
          <div className="breakdown-score-grid">
            <div className="breakdown-score-box">
              <span className="breakdown-score-label">Your Pick</span>
              <strong className="breakdown-score-value">
                {prediction?.homeScore ?? "—"} - {prediction?.awayScore ?? "—"}
              </strong>
            </div>
  
            <div className="breakdown-score-box">
              <span className="breakdown-score-label">Actual</span>
              <strong className="breakdown-score-value">
                {actual?.homeScore ?? "—"} - {actual?.awayScore ?? "—"}
              </strong>
            </div>
          </div>
  
          {advancingInfo && (
            <div className="breakdown-advancing-row">
              <span>
                <strong>Your Advancer:</strong> {advancingInfo.predictedText}
              </span>
              <span>
                <strong>Actual Advancer:</strong> {advancingInfo.actualText}
              </span>
            </div>
          )}
        </div>
      );
    }
  
    function renderStageBreakdown(title, breakdown) {
      const entries = Object.entries(breakdown || {});
      if (entries.length === 0) return null;
  
      return (
        <div className="breakdown-section">
          <h3 className="breakdown-title">{title}</h3>
          <div className="breakdown-card-grid">
            {entries.map(([matchId, points]) => renderBreakdownCard(matchId, points))}
          </div>
        </div>
      );
    }
  
    return (
      <>
        <div className="section-card">
          <h2 className="section-title">Your Score</h2>
  
          <div className="score-summary-grid">
            <div className="score-box">
              <span className="score-label">Group Stage</span>
              <strong className="score-value">{groupScore.total}</strong>
            </div>
  
            <div className="score-box">
              <span className="score-label">Knockout</span>
              <strong className="score-value">{knockoutScore.total}</strong>
            </div>
  
            <div className="score-box">
              <span className="score-label">Final</span>
              <strong className="score-value">{finalScore.total}</strong>
            </div>
  
            <div className="score-box score-box-total">
              <span className="score-label">Total</span>
              <strong className="score-value">{totalScore}</strong>
            </div>
          </div>
  
          <p className="subtle-text" style={{ marginTop: "14px" }}>
            Exact score = 3 points. Correct result only = 1 point. Tied
            knockout/final with correct advancing team = +1 bonus.
          </p>
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Detailed Score Breakdown</h2>
          {renderStageBreakdown("Knockout", knockoutScore.breakdown)}
          {renderStageBreakdown("Final", finalScore.breakdown)}
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Qualified Teams</h2>
          <ul className="qualified-list">
            {qualifiedTeams.map((teamId) => (
              <li key={teamId} className="qualified-item">
                <img
                  src={getTeamFlag(teamId)}
                  alt={`${getTeamName(teamId)} flag`}
                  className="summary-flag"
                />
                <span>{getTeamName(teamId)}</span>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Final Matchup</h2>
          {finalMatch ? (
            <div className="final-card summary-final-row">
              <div className="summary-team-inline">
                <img
                  src={getTeamFlag(finalMatch.homeTeam)}
                  alt={`${getTeamName(finalMatch.homeTeam)} flag`}
                  className="summary-flag"
                />
                <span>{getTeamName(finalMatch.homeTeam)}</span>
              </div>
  
              <span className="summary-vs">vs</span>
  
              <div className="summary-team-inline">
                <img
                  src={getTeamFlag(finalMatch.awayTeam)}
                  alt={`${getTeamName(finalMatch.awayTeam)} flag`}
                  className="summary-flag"
                />
                <span>{getTeamName(finalMatch.awayTeam)}</span>
              </div>
            </div>
          ) : (
            <p className="empty-text">Final matchup not decided yet.</p>
          )}
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Champion</h2>
          {champion ? (
            <div className="champion-card summary-team-inline">
              <img
                src={getTeamFlag(champion)}
                alt={`${getTeamName(champion)} flag`}
                className="summary-flag"
              />
              <span>{getTeamName(champion)} wins the tournament.</span>
            </div>
          ) : (
            <p className="empty-text">Champion not decided yet.</p>
          )}
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Controls</h2>
          <p className="subtle-text">
            Use this to clear all saved predictions and start a new tournament run.
          </p>
  
          <button className="reset-button" onClick={handleResetClick}>
            Reset All Predictions
          </button>
        </div>
      </>
    );
  }
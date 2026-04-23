// src/pages/FinalPage.jsx

export default function FinalPage({ tournament, pool }) {
    const {
      finalMatch,
      finalPrediction,
      champion,
      handleFinalScoreChange,
      handleFinalAdvancingTeamChange,
      getTeamName,
      getTeamFlag,
    } = tournament;

    if (!pool.currentPoolId) {
        return (
          <div className="section-card">
            <h2 className="section-title">Final</h2>
            <p className="empty-text">Join a pool to view the final.</p>
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
  
    if (!finalMatch) {
      return (
        <div className="section-card">
          <p className="empty-text">
            Complete the knockout predictions first to generate the final.
          </p>
        </div>
      );
    }
  
    const isTie =
      finalPrediction.homeScore !== undefined &&
      finalPrediction.awayScore !== undefined &&
      finalPrediction.homeScore !== "" &&
      finalPrediction.awayScore !== "" &&
      Number(finalPrediction.homeScore) === Number(finalPrediction.awayScore);
  
    return (
      <>
        <div className="section-card">
          <h2 className="section-title">Final</h2>
  
          <div className="final-card">
            <div className="match-row">
              <span className="team-home">
                {getTeamFlag(finalMatch.homeTeam)} {getTeamName(finalMatch.homeTeam)}
              </span>
  
              <input
                className="score-input"
                type="number"
                min="0"
                value={finalPrediction.homeScore ?? ""}
                onChange={(e) => handleFinalScoreChange("homeScore", e.target.value)}
              />
  
              <span className="vs-text">vs</span>
  
              <input
                className="score-input"
                type="number"
                min="0"
                value={finalPrediction.awayScore ?? ""}
                onChange={(e) => handleFinalScoreChange("awayScore", e.target.value)}
              />
  
              <span className="team-away">
                {getTeamFlag(finalMatch.awayTeam)} {getTeamName(finalMatch.awayTeam)}
              </span>
            </div>
  
            {isTie && (
              <div>
                <p className="subtle-text">Final is tied. Choose the champion:</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="final-champion"
                      checked={finalPrediction.advancingTeamId === finalMatch.homeTeam}
                      onChange={() =>
                        handleFinalAdvancingTeamChange(finalMatch.homeTeam)
                      }
                    />
                    {getTeamFlag(finalMatch.homeTeam)} {getTeamName(finalMatch.homeTeam)}
                  </label>
  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="final-champion"
                      checked={finalPrediction.advancingTeamId === finalMatch.awayTeam}
                      onChange={() =>
                        handleFinalAdvancingTeamChange(finalMatch.awayTeam)
                      }
                    />
                    {getTeamFlag(finalMatch.awayTeam)} {getTeamName(finalMatch.awayTeam)}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
  
        <div className="section-card">
          <h2 className="section-title">Champion</h2>
          {champion ? (
            <div className="champion-card">
              {getTeamFlag(champion)} {getTeamName(champion)} wins the tournament.
            </div>
          ) : (
            <p className="empty-text">
              Complete the final prediction to decide the champion.
            </p>
          )}
        </div>
      </>
    );
  }
// src/pages/KnockoutPage.jsx
import { useState } from "react";
export default function KnockoutPage({ tournament, pool }) {
    const {
      knockoutPredictions,
      finalPrediction,
      champion,
      roundOf32Matches,
      roundOf16Matches,
      quarterfinalMatches,
      semifinalMatches,
      thirdPlaceMatch,
      finalMatch,
      handleKnockoutScoreChange,
      handleAdvancingTeamChange,
      handleFinalScoreChange,
      handleFinalAdvancingTeamChange,
      getTeamName,
      getTeamFlag,
      getKnockoutWinner,
      isMatchLocked,
    } = tournament;
  
    if (!pool.currentPoolId) {
      return (
        <div className="section-card">
          <h2 className="section-title">Knockout</h2>
          <p className="empty-text">Join a pool to view the bracket.</p>
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
  
    function getMatchById(matchesArray, id) {
        return matchesArray.find((m) => m.id === id) || null;
      }
      
      // Display order must match FIFA bracket layout, not raw numeric order.
      const leftR32 = [
        getMatchById(roundOf32Matches, "R32_74"),
        getMatchById(roundOf32Matches, "R32_77"),
        getMatchById(roundOf32Matches, "R32_73"),
        getMatchById(roundOf32Matches, "R32_75"),
        getMatchById(roundOf32Matches, "R32_83"),
        getMatchById(roundOf32Matches, "R32_84"),
        getMatchById(roundOf32Matches, "R32_81"),
        getMatchById(roundOf32Matches, "R32_82"),
      ].filter(Boolean);
      
      const rightR32 = [
        getMatchById(roundOf32Matches, "R32_76"),
        getMatchById(roundOf32Matches, "R32_78"),
        getMatchById(roundOf32Matches, "R32_79"),
        getMatchById(roundOf32Matches, "R32_80"),
        getMatchById(roundOf32Matches, "R32_86"),
        getMatchById(roundOf32Matches, "R32_88"),
        getMatchById(roundOf32Matches, "R32_85"),
        getMatchById(roundOf32Matches, "R32_87"),
      ].filter(Boolean);
      
      const leftR16 = [
        getMatchById(roundOf16Matches, "roundOf16_1"),
        getMatchById(roundOf16Matches, "roundOf16_2"),
        getMatchById(roundOf16Matches, "roundOf16_5"),
        getMatchById(roundOf16Matches, "roundOf16_6"),
      ].filter(Boolean);
      
      const rightR16 = [
        getMatchById(roundOf16Matches, "roundOf16_3"),
        getMatchById(roundOf16Matches, "roundOf16_4"),
        getMatchById(roundOf16Matches, "roundOf16_7"),
        getMatchById(roundOf16Matches, "roundOf16_8"),
      ].filter(Boolean);
      
      const leftQF = [
        getMatchById(quarterfinalMatches, "quarterfinals_1"),
        getMatchById(quarterfinalMatches, "quarterfinals_2"),
      ].filter(Boolean);
      
      const rightQF = [
        getMatchById(quarterfinalMatches, "quarterfinals_3"),
        getMatchById(quarterfinalMatches, "quarterfinals_4"),
      ].filter(Boolean);
      
      const leftSF = [
        getMatchById(semifinalMatches, "semifinals_1"),
      ].filter(Boolean);
      
      const rightSF = [
        getMatchById(semifinalMatches, "semifinals_2"),
      ].filter(Boolean);

    const [collapsedTiePickers, setCollapsedTiePickers] = useState({});

    function toggleTiePicker(matchId) {
        setCollapsedTiePickers((prev) => ({
          ...prev,
          [matchId]: !prev[matchId],
        }));
      }
  
    function renderTeamDisplay(teamId) {
      if (!teamId) {
        return (
          <div className="bracket-team-name">
            <span>TBD</span>
          </div>
        );
      }
  
      return (
        <div className="bracket-team-name">
          <img
            src={getTeamFlag(teamId)}
            alt={`${getTeamName(teamId)} flag`}
            className="bracket-flag"
          />
          <span>{getTeamName(teamId)}</span>
        </div>
      );
    }
  
    function renderInlineTeam(teamId) {
      if (!teamId) return "TBD";
  
      return (
        <span className="bracket-inline-team">
          <img
            src={getTeamFlag(teamId)}
            alt={`${getTeamName(teamId)} flag`}
            className="bracket-flag"
          />
          {getTeamName(teamId)}
        </span>
      );
    }
  
    function renderKnockoutMatch(match, mirror = false) {
      const rawPrediction = knockoutPredictions[match.id] || {};
  
      const prediction = {
        ...rawPrediction,
        advancingTeamId:
          rawPrediction.advancingTeamId === match.homeTeam ||
          rawPrediction.advancingTeamId === match.awayTeam
            ? rawPrediction.advancingTeamId
            : "",
      };
  
      const hasBothTeams = !!match.homeTeam && !!match.awayTeam;
  
      const isTie =
        hasBothTeams &&
        prediction.homeScore !== undefined &&
        prediction.awayScore !== undefined &&
        prediction.homeScore !== "" &&
        prediction.awayScore !== "" &&
        Number(prediction.homeScore) === Number(prediction.awayScore);
    
        const isCollapsed = !!collapsedTiePickers[match.id];
  
      const winner = hasBothTeams ? getKnockoutWinner(match, prediction) : null;
  
      return (
        <div
          className={`fifa-bracket-match-card ${mirror ? "mirror-card" : ""}`}
          key={match.id}
        >
          <div className="fifa-bracket-match-label">{match.label}</div>
  
          <div className="bracket-team-row">
            {renderTeamDisplay(match.homeTeam)}
            <input
              className="score-input bracket-score-input"
              type="number"
              min="0"
              value={prediction.homeScore ?? ""}
              onChange={(e) =>
                handleKnockoutScoreChange(match.id, "homeScore", e.target.value)
              }
              disabled={
                isMatchLocked(match.startTime) || !match.homeTeam || !match.awayTeam
              }
            />
          </div>
  
          <div className="bracket-team-row">
            {renderTeamDisplay(match.awayTeam)}
            <input
              className="score-input bracket-score-input"
              type="number"
              min="0"
              value={prediction.awayScore ?? ""}
              onChange={(e) =>
                handleKnockoutScoreChange(match.id, "awayScore", e.target.value)
              }
              disabled={
                isMatchLocked(match.startTime) || !match.homeTeam || !match.awayTeam
              }
            />
          </div>
  
          {isTie && match.homeTeam && match.awayTeam && (
  <>
    <button
      type="button"
      className="tie-toggle-button"
      onClick={() => toggleTiePicker(match.id)}
    >
      {isCollapsed ? "⌄ Show tiebreaker" : "⌃ Hide tiebreaker"}
    </button>

    {!isCollapsed && (
      <div className="bracket-advance-box">
        <p className="subtle-text">Tied match. Choose who advances:</p>

        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name={`advancer-${match.id}`}
              checked={prediction.advancingTeamId === match.homeTeam}
              onChange={() =>
                handleAdvancingTeamChange(match.id, match.homeTeam)
              }
              disabled={isMatchLocked(match.startTime)}
            />
            <img
              src={getTeamFlag(match.homeTeam)}
              alt={`${getTeamName(match.homeTeam)} flag`}
              className="bracket-flag"
            />
            {getTeamName(match.homeTeam)}
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name={`advancer-${match.id}`}
              checked={prediction.advancingTeamId === match.awayTeam}
              onChange={() =>
                handleAdvancingTeamChange(match.id, match.awayTeam)
              }
              disabled={isMatchLocked(match.startTime)}
            />
            <img
              src={getTeamFlag(match.awayTeam)}
              alt={`${getTeamName(match.awayTeam)} flag`}
              className="bracket-flag"
            />
            {getTeamName(match.awayTeam)}
          </label>
        </div>
      </div>
    )}
  </>
)}
  
          {!hasBothTeams && (
            <p className="empty-text">Waiting for previous round winners.</p>
          )}
  
          {isMatchLocked(match.startTime) && (
            <p className="match-lock-text">Predictions locked</p>
          )}
  
          <div className="bracket-match-footer">
            <strong>Advancing:</strong>{" "}
            {winner ? renderInlineTeam(winner) : "Not decided yet"}
          </div>
        </div>
      );
    }
  
    function renderFinalCard(match) {
      const hasBothTeams = !!match.homeTeam && !!match.awayTeam;
  
      const safeFinalPrediction = {
        ...finalPrediction,
        advancingTeamId:
          finalPrediction.advancingTeamId === match.homeTeam ||
          finalPrediction.advancingTeamId === match.awayTeam
            ? finalPrediction.advancingTeamId
            : "",
      };
  
      const isTie =
        hasBothTeams &&
        safeFinalPrediction.homeScore !== undefined &&
        safeFinalPrediction.awayScore !== undefined &&
        safeFinalPrediction.homeScore !== "" &&
        safeFinalPrediction.awayScore !== "" &&
        Number(safeFinalPrediction.homeScore) ===
          Number(safeFinalPrediction.awayScore);
  
      return (
        <div className="fifa-bracket-match-card fifa-bracket-final-card">
          <div className="fifa-bracket-match-label">{match.label}</div>
  
          <div className="bracket-team-row">
            {renderTeamDisplay(match.homeTeam)}
            <input
              className="score-input bracket-score-input"
              type="number"
              min="0"
              value={safeFinalPrediction.homeScore ?? ""}
              onChange={(e) => handleFinalScoreChange("homeScore", e.target.value)}
              disabled={
                isMatchLocked(match.startTime) || !match.homeTeam || !match.awayTeam
              }
            />
          </div>
  
          <div className="bracket-team-row">
            {renderTeamDisplay(match.awayTeam)}
            <input
              className="score-input bracket-score-input"
              type="number"
              min="0"
              value={safeFinalPrediction.awayScore ?? ""}
              onChange={(e) => handleFinalScoreChange("awayScore", e.target.value)}
              disabled={
                isMatchLocked(match.startTime) || !match.homeTeam || !match.awayTeam
              }
            />
          </div>
  
          {isTie && match.homeTeam && match.awayTeam && (
            <div className="bracket-advance-box">
              <p className="subtle-text">Final is tied. Choose the champion:</p>
  
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="final-champion"
                    checked={safeFinalPrediction.advancingTeamId === match.homeTeam}
                    onChange={() =>
                      handleFinalAdvancingTeamChange(match.homeTeam)
                    }
                    disabled={isMatchLocked(match.startTime)}
                  />
                  <img
                    src={getTeamFlag(match.homeTeam)}
                    alt={`${getTeamName(match.homeTeam)} flag`}
                    className="bracket-flag"
                  />
                  {getTeamName(match.homeTeam)}
                </label>
  
                <label className="radio-label">
                  <input
                    type="radio"
                    name="final-champion"
                    checked={safeFinalPrediction.advancingTeamId === match.awayTeam}
                    onChange={() =>
                      handleFinalAdvancingTeamChange(match.awayTeam)
                    }
                    disabled={isMatchLocked(match.startTime)}
                  />
                  <img
                    src={getTeamFlag(match.awayTeam)}
                    alt={`${getTeamName(match.awayTeam)} flag`}
                    className="bracket-flag"
                  />
                  {getTeamName(match.awayTeam)}
                </label>
              </div>
            </div>
          )}
  
          {!hasBothTeams && (
            <p className="empty-text">The final will appear once the semi-finals are decided.</p>
          )}
  
          <div className="bracket-match-footer">
            <strong>Champion:</strong>{" "}
            {champion ? renderInlineTeam(champion) : "Not decided yet"}
          </div>
        </div>
      );
    }


      function isTieMatch(match) {
        const prediction = knockoutPredictions[match.id] || {};
      
        return (
          !!match.homeTeam &&
          !!match.awayTeam &&
          prediction.homeScore !== undefined &&
          prediction.awayScore !== undefined &&
          prediction.homeScore !== "" &&
          prediction.awayScore !== "" &&
          Number(prediction.homeScore) === Number(prediction.awayScore)
        );
      }

      function getFinalFourStandings() {
        const finalWinner = finalMatch ? getKnockoutWinner(finalMatch, finalPrediction) : null;
        const finalRunnerUp =
          finalMatch && finalWinner
            ? finalWinner === finalMatch.homeTeam
              ? finalMatch.awayTeam
              : finalMatch.homeTeam
            : null;
      
        const thirdPlaceWinner = thirdPlaceMatch
          ? getKnockoutWinner(thirdPlaceMatch, knockoutPredictions[thirdPlaceMatch.id] || {})
          : null;
      
        const fourthPlace =
          thirdPlaceMatch && thirdPlaceWinner
            ? thirdPlaceWinner === thirdPlaceMatch.homeTeam
              ? thirdPlaceMatch.awayTeam
              : thirdPlaceMatch.homeTeam
            : null;
      
        return [
          { label: "1st", teamId: finalWinner },
          { label: "2nd", teamId: finalRunnerUp },
          { label: "3rd", teamId: thirdPlaceWinner },
          { label: "4th", teamId: fourthPlace },
        ];
      }

      function renderFinalFourStandings() {
        const standings = getFinalFourStandings();
      
        return (
          <div className="fifa-final-four-box">
            <h3 className="fifa-bracket-round-title">Final Standings</h3>
      
            <div className="fifa-final-four-list">
            {standings.map((entry, index) => (
                <div
                    key={entry.label}
                    className={`fifa-final-four-row rank-${index + 1}`}
                >
                    <span className="fifa-final-four-rank">{entry.label}</span>

                    <div className="fifa-final-four-team">
                    {entry.teamId ? (
                        <>
                        <img
                            src={getTeamFlag(entry.teamId)}
                            alt={`${getTeamName(entry.teamId)} flag`}
                            className="bracket-flag"
                        />
                        <span>{getTeamName(entry.teamId)}</span>
                        </>
                    ) : (
                        <span>TBD</span>
                    )}
                    </div>
                </div>
                ))}
            </div>
          </div>
        );
      }

      function getBaseBracketTop(roundKey, index) {
        switch (roundKey) {
          case "r32":
            return index * 220;
          case "r16":
            return 110 + index * 440;
          case "qf":
            return 330 + index * 880;
          case "sf":
            return 770;
          default:
            return 0;
        }
      }
      
      function getBracketTop(roundKey, index) {
        const positions = {
          // left and right R32 display order is already grouped correctly
          r32: [0, 230, 500, 730, 1120, 1350, 1620, 1850],
      
          // centered between each R32 pair:
          // (0,230) -> 115
          // (500,730) -> 615
          // (1120,1350) -> 1235
          // (1620,1850) -> 1735
          r16: [115, 615, 1235, 1735],
      
          // centered between each R16 pair:
          // (115,615) -> 365
          // (1235,1735) -> 1485
          qf: [365, 1485],
      
          // centered between QFs:
          // (365,1485) -> 925
          sf: [925],
        };
      
        return positions[roundKey]?.[index] ?? 0;
      }
  
      function renderRoundColumn(title, matchesArray, className, mirror = false) {
        return (
          <div className={`fifa-side-column ${className} ${mirror ? "mirror-column" : ""}`}>
            <h3 className="fifa-bracket-round-title">{title}</h3>
      
            <div className={`fifa-side-column-body ${className}`}>
              {matchesArray.map((match, index) => (
                <div
                  key={match.id}
                  className="fifa-positioned-match"
                  style={{ top: `${getBracketTop(className, index)}px` }}
                >
                  {renderKnockoutMatch(match, mirror)}
                </div>
              ))}
            </div>
          </div>
        );
      }
  
    return (
        <div className="section-card knockout-section-card">
        <div className="knockout-hero">
          <div>
            <p className="knockout-eyebrow">FIFA WORLD CUP 2026 INSPIRED BRACKET</p>
            <h2 className="section-title knockout-main-title">Knockout Bracket</h2>
            <p className="knockout-subtitle">
              Follow every round from the Round of 32 to the final.
            </p>
          </div>
      
          <div className="knockout-badge-card">
            <div className="knockout-badge-year">26</div>
            <div className="knockout-badge-text">World Cup</div>
          </div>
        </div>
      
        <div className="knockout-board-shell">
          <div className="fifa-two-sided-bracket">
            
          <div className="fifa-bracket-side left-side">
            {renderRoundColumn("Round of 32", leftR32, "r32")}
            {renderRoundColumn("Round of 16", leftR16, "r16")}
            {renderRoundColumn("Quarter-finals", leftQF, "qf")}
            {renderRoundColumn("Semi-finals", leftSF, "sf")}
          </div>
  
          <div className="fifa-bracket-center">

                {/* 🏆 Trophy image */}
                <img
                    src="/images/worldcup.png"
                    alt="World Cup Trophy"
                    className="knockout-trophy"
                />

                <h3 className="fifa-bracket-round-title">Final</h3>
            <div className="fifa-center-final">
              {finalMatch ? (
                renderFinalCard(finalMatch)
              ) : (
                <div className="fifa-bracket-empty">Waiting for semi-finals</div>
              )}
            </div>
  
            <h3 className="fifa-bracket-round-title">Champion</h3>
            <div className="fifa-champion-box">
              {champion ? (
                <>
                  <div className="fifa-champion-label">Winner</div>
                  <div className="fifa-champion-team">
                    <img
                      src={getTeamFlag(champion)}
                      alt={`${getTeamName(champion)} flag`}
                      className="bracket-flag"
                    />
                    <span>{getTeamName(champion)}</span>
                  </div>
                </>
              ) : (
                <div className="fifa-bracket-empty">Not decided yet</div>
              )}
            </div>
  
            <div className="fifa-third-place-box">
            <h3 className="fifa-bracket-round-title">Third Place Match</h3>
              {thirdPlaceMatch ? (
                renderKnockoutMatch(thirdPlaceMatch)
              ) : (
                <div className="fifa-bracket-empty">Waiting for semi-finals</div>
              )}
            </div>
            {renderFinalFourStandings()}
          </div>
  
          <div className="fifa-bracket-side right-side">
            {renderRoundColumn("Semi-finals", rightSF, "sf", true)}
            {renderRoundColumn("Quarter-finals", rightQF, "qf", true)}
            {renderRoundColumn("Round of 16", rightR16, "r16", true)}
            {renderRoundColumn("Round of 32", rightR32, "r32", true)}
          </div>
        </div>
      </div>
      </div>
    );
  }
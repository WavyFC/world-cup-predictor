import { useLeaderboard } from "../hooks/useLeaderboard";

export default function LeaderboardPage({ pool }) {
  const { leaderboard, isLoadingLeaderboard } = useLeaderboard(pool.currentPoolId);

  if (!pool.currentPoolId) {
    return (
      <div className="section-card">
        <h2 className="section-title">Leaderboard</h2>
        <p className="empty-text">Join or create a pool first.</p>
      </div>
    );
  }

  

  if (isLoadingLeaderboard) {
    return (
      <div className="section-card">
        <h2 className="section-title">Leaderboard</h2>
        <p className="empty-text">Loading leaderboard...</p>
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


  return (
    <div className="section-card">
      <h2 className="section-title">Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p className="empty-text">No players in this pool yet.</p>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="leaderboard-row">
              <span className="leaderboard-rank">#{index + 1}</span>
              <span className="leaderboard-name">{user.username}</span>
              <span className="leaderboard-score">{user.totalScore} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
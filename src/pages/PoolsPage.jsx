// src/pages/PoolsPage.jsx

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { createPool, joinPoolByCode } from "../firebase/pools";

export default function PoolsPage({ user, pool }) {
  const [poolName, setPoolName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    async function loadUsername() {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUsername(snap.data().username || "");
      }
    }

    loadUsername();
  }, [user]);

  async function handleCreatePool(e) {
    e.preventDefault();
    setMessage("");
    setCopyMessage("");

    try {
      const result = await createPool({
        ownerId: user.uid,
        ownerUsername: username,
        poolName,
      });

      pool.setPoolId(result.poolId);
      setMessage(`Pool created. Invite code: ${result.inviteCode}`);
      setPoolName("");
    } catch (error) {
      setMessage(error.message || "Failed to create pool.");
    }
  }

  async function handleJoinPool(e) {
    e.preventDefault();
    setMessage("");
    setCopyMessage("");

    try {
      const result = await joinPoolByCode({
        userId: user.uid,
        username,
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      pool.setPoolId(result.poolId);
      setMessage("Joined pool successfully.");
      setInviteCode("");
    } catch (error) {
      setMessage(error.message || "Failed to join pool.");
    }
  }

  async function handleCopyInviteCode() {
    if (!pool.currentPool?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(pool.currentPool.inviteCode);
      setCopyMessage("Invite code copied.");
    } catch (error) {
      setCopyMessage("Could not copy invite code.");
    }

    setTimeout(() => setCopyMessage(""), 2000);
  }

  async function handleCopyShareMessage() {
    if (!pool.currentPool) return;

    const shareText = `Join my World Cup Predictor pool: ${pool.currentPool.name}\nInvite code: ${pool.currentPool.inviteCode}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyMessage("Share message copied.");
    } catch (error) {
      setCopyMessage("Could not copy share message.");
    }

    setTimeout(() => setCopyMessage(""), 2000);
  }

  return (
    <>
      <div className="section-card">
        <h2 className="section-title">Current Pool</h2>

        {pool.currentPool ? (
          <div className="pool-details">
            <div className="pool-summary-grid">
              <div className="pool-summary-box">
                <span className="score-label">Pool Name</span>
                <strong>{pool.currentPool.name}</strong>
              </div>

              <div className="pool-summary-box">
                <span className="score-label">Invite Code</span>
                <strong>{pool.currentPool.inviteCode}</strong>
              </div>

              <div className="pool-summary-box">
                <span className="score-label">Members</span>
                <strong>{pool.poolMembers.length}</strong>
              </div>
            </div>

            <div className="pool-button-row">
              <button className="reset-button" onClick={handleCopyInviteCode}>
                Copy Invite Code
              </button>

              <button className="reset-button" onClick={handleCopyShareMessage}>
                Copy Share Message
              </button>

              <button className="reset-button" onClick={pool.clearPoolId}>
                Leave Current Pool View
              </button>
            </div>

            {copyMessage ? (
              <p className="subtle-text" style={{ marginTop: "10px" }}>
                {copyMessage}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="empty-text">You are not viewing a pool yet.</p>
        )}
      </div>

      <div className="section-card">
        <h2 className="section-title">Your Pools</h2>

        {pool.userPools.length === 0 ? (
          <p className="empty-text">You have not joined any pools yet.</p>
        ) : (
          <div className="user-pools-list">
            {pool.userPools.map((item) => {
              const isActive = item.id === pool.currentPoolId;
              const isOwner = item.membership?.role === "owner";

              return (
                <div
                  key={item.id}
                  className={`user-pool-row ${isActive ? "user-pool-row-active" : ""}`}
                >
                  <div className="user-pool-left">
                    <span className="pool-member-name">{item.name}</span>

                    {isOwner ? (
                      <span className="pool-member-badge owner-badge">
                        👑 Owner
                      </span>
                    ) : null}

                    {isActive ? (
                      <span className="pool-member-badge you-badge">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <button
                    className="switch-pool-button"
                    onClick={() => pool.setPoolId(item.id)}
                    disabled={isActive}
                  >
                    {isActive ? "Viewing" : "Switch To Pool"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pool.currentPool ? (
        <div className="section-card">
          <h2 className="section-title">Pool Members</h2>

          {pool.poolMembers.length === 0 ? (
            <p className="empty-text">No members found yet.</p>
          ) : (
            <div className="pool-members-list">
              {pool.poolMembers.map((member) => {
                const isCurrentUser = member.userId === user.uid;
                const isOwner = member.role === "owner";

                return (
                  <div
                    key={member.id}
                    className={`pool-member-row ${
                      isCurrentUser ? "pool-member-row-current" : ""
                    }`}
                  >
                    <div className="pool-member-left">
                      <span className="pool-member-name">
                        {member.username || "Unknown User"}
                      </span>

                      {isOwner && (
                        <span className="pool-member-badge owner-badge">
                          👑 Owner
                        </span>
                      )}

                      {isCurrentUser && (
                        <span className="pool-member-badge you-badge">
                          You
                        </span>
                      )}
                    </div>

                    <span className="pool-member-date subtle-text">
                      Joined{" "}
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      <div className="section-card">
        <h2 className="section-title">Create Pool</h2>

        <form onSubmit={handleCreatePool} style={{ display: "grid", gap: "12px" }}>
          <input
            className="score-input"
            type="text"
            placeholder="Pool name"
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
            required
          />

          <button className="reset-button" type="submit">
            Create Pool
          </button>
        </form>
      </div>

      <div className="section-card">
        <h2 className="section-title">Join Pool</h2>

        <form onSubmit={handleJoinPool} style={{ display: "grid", gap: "12px" }}>
          <input
            className="score-input"
            type="text"
            placeholder="Invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
          />

          <button className="reset-button" type="submit">
            Join Pool
          </button>
        </form>
      </div>

      {message ? (
        <div className="section-card">
          <p>{message}</p>
        </div>
      ) : null}
    </>
  );
}
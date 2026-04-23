// src/App.jsx

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "./firebase/auth";

import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import GroupStagePage from "./pages/GroupStagePage";
import KnockoutPage from "./pages/KnockoutPage";
import FinalPage from "./pages/FinalPage";
import SummaryPage from "./pages/SummaryPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PoolsPage from "./pages/PoolsPage";

import { useTournamentPredictor } from "./hooks/useTournamentPredictor";
import { usePool } from "./hooks/usePool";

function App() {
  // ---------------------------------------------
  // AUTH STATE
  // ---------------------------------------------
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------------------------------------------
  // POOL STATE
  // This tracks the currently selected pool
  // ---------------------------------------------
  const pool = usePool(user);

  // ---------------------------------------------
  // TOURNAMENT STATE
  // This now depends on:
  // - signed-in user
  // - current pool ID
  // ---------------------------------------------
  const tournament = useTournamentPredictor(user, pool.currentPoolId);

  // ---------------------------------------------
  // LOADING SCREEN
  // ---------------------------------------------
  if (authLoading) {
    return (
      <main className="app-shell">
        <div className="section-card">
          <h2 className="section-title">Loading...</h2>
          <p className="empty-text">Checking your account.</p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // IF NOT SIGNED IN
  // Show auth page only
  // ---------------------------------------------
  if (!user) {
    return (
      <main className="app-shell">
        <AuthPage />
      </main>
    );
  }

  // ---------------------------------------------
  // SIGNED-IN APP
  // ---------------------------------------------
  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-shell">
        {/* Signed-in status bar */}
        <div className="section-card" style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ margin: 0 }}>
                Signed in as <strong>{user.email}</strong>
              </p>

              {pool.currentPool ? (
                <p
                  className="subtle-text"
                  style={{ margin: "6px 0 0 0" }}
                >
                  Current Pool: <strong>{pool.currentPool.name}</strong>{" "}
                  ({pool.currentPool.inviteCode})
                </p>
              ) : (
                <p
                  className="subtle-text"
                  style={{ margin: "6px 0 0 0" }}
                >
                  No pool selected yet.
                </p>
              )}
            </div>

            <button
              className="reset-button"
              onClick={() => signOut(auth)}
            >
              Sign Out
            </button>
          </div>
        </div>

        <Routes>
          <Route
  path="/"
  element={<GroupStagePage tournament={tournament} pool={pool} />}
/>

<Route
  path="/knockout"
  element={<KnockoutPage tournament={tournament} pool={pool} />}
/>

<Route
  path="/final"
  element={<FinalPage tournament={tournament} pool={pool} />}
/>

<Route
  path="/summary"
  element={<SummaryPage tournament={tournament} pool={pool} />}
/>

<Route
  path="/leaderboard"
  element={<LeaderboardPage pool={pool} />}
/>

<Route
  path="/pools"
  element={<PoolsPage user={user} pool={pool} />}
/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
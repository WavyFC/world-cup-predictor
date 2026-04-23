// src/hooks/useLeaderboard.js

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firestore";

export function useLeaderboard(poolId) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    // If there is no pool selected, just stop here.
    // No need to subscribe.
    if (!poolId) {
      return;
    }

    setIsLoadingLeaderboard(true);

    const unsubscribe = onSnapshot(
      collection(db, "pools", poolId, "predictions"),
      (snapshot) => {
        const users = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            username: data.username || data.email || "Unknown User",
            totalScore: data.totalScore || 0,
          };
        });

        users.sort((a, b) => b.totalScore - a.totalScore);

        setLeaderboard(users);
        setIsLoadingLeaderboard(false);
      },
      (error) => {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
        setIsLoadingLeaderboard(false);
      }
    );

    return () => unsubscribe();
  }, [poolId]);

  // If there is no pool, return an empty leaderboard directly
  if (!poolId) {
    return {
      leaderboard: [],
      isLoadingLeaderboard: false,
    };
  }

  return { leaderboard, isLoadingLeaderboard };
}
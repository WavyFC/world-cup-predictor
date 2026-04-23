// src/hooks/useTournamentPredictor.js

import { useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { teams } from "../data/teams";
import { matches } from "../data/matches";
import { actualResults } from "../data/actualResults";

import { db } from "../firebase/firestore";

import { calculateStandings } from "../lib/standings";
import {
  getTopTwoTeams,
  buildRoundOf32,
  buildRoundOf16,
  buildQuarterfinals,
  buildSemifinals,
  buildFinal,
  buildThirdPlaceMatch,
  getKnockoutWinner,
  getChampion,
} from "../lib/knockout";
import {
  scoreGroupStage,
  scoreKnockoutStage,
  scoreFinal,
} from "../lib/scoring";

export function useTournamentPredictor(user, poolId) {
  const [predictions, setPredictions] = useState({});
  const [knockoutPredictions, setKnockoutPredictions] = useState({});
  const [finalPrediction, setFinalPrediction] = useState({});
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true);

  // Prevent autosave from firing before the initial Firestore load finishes
  const hasLoadedInitialDataRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  function getTeam(teamId) {
    return teams.find((t) => t.id === teamId);
  }

  function getTeamName(teamId) {
    const team = getTeam(teamId);
    return team ? team.name : teamId;
  }

  function getTeamFlag(teamId) {
    const team = getTeam(teamId);
    return team ? team.flagUrl : "";
  }

  function isMatchLocked(startTime) {
    if (!startTime) return false;

    const now = new Date();
    const kickoff = new Date(startTime);

    return now >= kickoff;
  }

  function getPredictionDocRef(currentUserId, currentPoolId) {
    return doc(db, "pools", currentPoolId, "predictions", currentUserId);
  }

  async function savePredictionsToFirestore({
    nextPredictions,
    nextKnockoutPredictions,
    nextFinalPrediction,
  }) {
    if (!user?.uid || !poolId) return;

    try {
      const ref = getPredictionDocRef(user.uid, poolId);

      await setDoc(
        ref,
        {
          predictions: nextPredictions,
          knockoutPredictions: nextKnockoutPredictions,
          finalPrediction: nextFinalPrediction,
          username: user.email || "Unknown User",
          email: user.email || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving predictions:", error);
    }
  }

  async function loadPredictionsFromFirestore(currentUser) {
    if (!currentUser?.uid || !poolId) {
      setPredictions({});
      setKnockoutPredictions({});
      setFinalPrediction({});
      setIsLoadingPredictions(false);
      hasLoadedInitialDataRef.current = true;
      return;
    }

    setIsLoadingPredictions(true);
    hasLoadedInitialDataRef.current = false;

    try {
      const ref = getPredictionDocRef(currentUser.uid, poolId);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setPredictions(data.predictions || {});
        setKnockoutPredictions(data.knockoutPredictions || {});
        setFinalPrediction(data.finalPrediction || {});
      } else {
        setPredictions({});
        setKnockoutPredictions({});
        setFinalPrediction({});
      }
    } catch (error) {
      console.error("Error loading predictions:", error);
      setPredictions({});
      setKnockoutPredictions({});
      setFinalPrediction({});
    } finally {
      setIsLoadingPredictions(false);
      hasLoadedInitialDataRef.current = true;
    }
  }

  useEffect(() => {
    loadPredictionsFromFirestore(user);
  }, [user?.uid, poolId]);

  function scheduleAutosave({
    nextPredictions,
    nextKnockoutPredictions,
    nextFinalPrediction,
  }) {
    if (!hasLoadedInitialDataRef.current) return;
    if (!user?.uid || !poolId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      savePredictionsToFirestore({
        nextPredictions,
        nextKnockoutPredictions,
        nextFinalPrediction,
      });
    }, 250);
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  function handleScoreChange(matchId, side, value) {
    setPredictions((prev) => {
      const updatedPredictions = {
        ...prev,
        [matchId]: {
          ...prev[matchId],
          [side]: value,
        },
      };

      scheduleAutosave({
        nextPredictions: updatedPredictions,
        nextKnockoutPredictions: knockoutPredictions,
        nextFinalPrediction: finalPrediction,
      });

      return updatedPredictions;
    });
  }

  function handleKnockoutScoreChange(matchId, side, value) {
    setKnockoutPredictions((prev) => {
      const updatedKnockoutPredictions = {
        ...prev,
        [matchId]: {
          ...prev[matchId],
          [side]: value,
        },
      };

      scheduleAutosave({
        nextPredictions: predictions,
        nextKnockoutPredictions: updatedKnockoutPredictions,
        nextFinalPrediction: finalPrediction,
      });

      return updatedKnockoutPredictions;
    });
  }

  function handleAdvancingTeamChange(matchId, teamId) {
    setKnockoutPredictions((prev) => {
      const updatedKnockoutPredictions = {
        ...prev,
        [matchId]: {
          ...prev[matchId],
          advancingTeamId: teamId,
        },
      };

      scheduleAutosave({
        nextPredictions: predictions,
        nextKnockoutPredictions: updatedKnockoutPredictions,
        nextFinalPrediction: finalPrediction,
      });

      return updatedKnockoutPredictions;
    });
  }

  function handleFinalScoreChange(side, value) {
    setFinalPrediction((prev) => {
      const updatedFinalPrediction = {
        ...prev,
        [side]: value,
      };

      scheduleAutosave({
        nextPredictions: predictions,
        nextKnockoutPredictions: knockoutPredictions,
        nextFinalPrediction: updatedFinalPrediction,
      });

      return updatedFinalPrediction;
    });
  }

  function handleFinalAdvancingTeamChange(teamId) {
    setFinalPrediction((prev) => {
      const updatedFinalPrediction = {
        ...prev,
        advancingTeamId: teamId,
      };

      scheduleAutosave({
        nextPredictions: predictions,
        nextKnockoutPredictions: knockoutPredictions,
        nextFinalPrediction: updatedFinalPrediction,
      });

      return updatedFinalPrediction;
    });
  }

  // ---------------------------------------------
  // GROUPS (DYNAMIC)
  // ---------------------------------------------
  const groupNames = [...new Set(teams.map((team) => team.group))].sort();

  const groupsData = useMemo(() => {
    const result = {};

    groupNames.forEach((groupName) => {
      const groupTeams = teams.filter((team) => team.group === groupName);
      const groupMatches = matches.filter((match) => match.group === groupName);

      const standings = calculateStandings(groupTeams, groupMatches, predictions);

      result[groupName] = {
        teams: groupTeams,
        matches: groupMatches,
        standings,
      };
    });

    return result;
  }, [groupNames, predictions]);

  const allStandings = Object.fromEntries(
    Object.entries(groupsData).map(([groupName, groupInfo]) => [
      groupName,
      groupInfo.standings,
    ])
  );

  // ---------------------------------------------
  // KNOCKOUT
  // ---------------------------------------------
  const qualifiedTeams = getTopTwoTeams(allStandings);

  const roundOf32Matches = buildRoundOf32(allStandings);

  const roundOf16Matches = buildRoundOf16(
    roundOf32Matches,
    knockoutPredictions
  );

  const quarterfinalMatches = buildQuarterfinals(
    roundOf16Matches,
    knockoutPredictions
  );

  const semifinalMatches = buildSemifinals(
    quarterfinalMatches,
    knockoutPredictions
  );

  const finalMatches = buildFinal(semifinalMatches, knockoutPredictions);
  const finalMatch = finalMatches[0] || null;

  const thirdPlaceMatch = buildThirdPlaceMatch(
    semifinalMatches,
    knockoutPredictions
  );

  const champion = getChampion(finalMatch, finalPrediction);

  // ---------------------------------------------
  // SCORING
  // ---------------------------------------------
  const groupScore = scoreGroupStage(predictions, actualResults);
  const knockoutScore = scoreKnockoutStage(knockoutPredictions, actualResults);
  const finalScore = scoreFinal(finalPrediction, actualResults);

  const totalScore =
    groupScore.total + knockoutScore.total + finalScore.total;

  useEffect(() => {
    async function saveScore() {
      if (!user?.uid || !poolId) return;

      try {
        const ref = getPredictionDocRef(user.uid, poolId);

        await setDoc(
          ref,
          {
            totalScore,
            username: user.email || "Unknown User",
            email: user.email || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }

    if (hasLoadedInitialDataRef.current) {
      saveScore();
    }
  }, [totalScore, user?.uid, poolId]);

  function resetAllPredictions() {
    const emptyPredictions = {};
    const emptyKnockoutPredictions = {};
    const emptyFinalPrediction = {};

    setPredictions(emptyPredictions);
    setKnockoutPredictions(emptyKnockoutPredictions);
    setFinalPrediction(emptyFinalPrediction);

    scheduleAutosave({
      nextPredictions: emptyPredictions,
      nextKnockoutPredictions: emptyKnockoutPredictions,
      nextFinalPrediction: emptyFinalPrediction,
    });
  }

  return {
    teams,
    matches,
    actualResults,

    predictions,
    knockoutPredictions,
    finalPrediction,
    isLoadingPredictions,

    groupNames,
    groupsData,
    allStandings,

    qualifiedTeams,
    roundOf32Matches,
    roundOf16Matches,
    quarterfinalMatches,
    semifinalMatches,
    thirdPlaceMatch,
    finalMatch,
    champion,

    getTeam,
    getTeamName,
    getTeamFlag,
    getKnockoutWinner,
    isMatchLocked,

    handleScoreChange,
    handleKnockoutScoreChange,
    handleAdvancingTeamChange,
    handleFinalScoreChange,
    handleFinalAdvancingTeamChange,
    resetAllPredictions,
    loadPredictionsFromFirestore,

    groupScore,
    knockoutScore,
    finalScore,
    totalScore,
  };
}
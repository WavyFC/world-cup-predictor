// src/hooks/usePool.js

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firestore";

export function usePool(user) {
  // Build a user-specific localStorage key
  const storageKey = useMemo(() => {
    return user?.uid ? `currentPoolId_${user.uid}` : null;
  }, [user?.uid]);

  const [currentPoolId, setCurrentPoolId] = useState("");
  const [currentPool, setCurrentPool] = useState(null);
  const [poolMembers, setPoolMembers] = useState([]);
  const [userPools, setUserPools] = useState([]);
  const [poolLoading, setPoolLoading] = useState(false);

  // Load current pool ID from user-specific localStorage
  useEffect(() => {
    if (!storageKey) {
      setCurrentPoolId("");
      return;
    }

    const savedPoolId = localStorage.getItem(storageKey) || "";
    setCurrentPoolId(savedPoolId);
  }, [storageKey]);

  // Load all pools the current user belongs to
  useEffect(() => {
    async function loadUserPools() {
      if (!user?.uid) {
        setUserPools([]);
        return;
      }

      try {
        const membersQuery = query(
          collectionGroup(db, "members"),
          where("userId", "==", user.uid)
        );

        const memberSnapshots = await getDocs(membersQuery);

        const poolList = await Promise.all(
          memberSnapshots.docs.map(async (memberDoc) => {
            const poolId = memberDoc.ref.parent.parent?.id;
            if (!poolId) return null;

            const poolSnap = await getDoc(doc(db, "pools", poolId));
            if (!poolSnap.exists()) return null;

            return {
              id: poolSnap.id,
              ...poolSnap.data(),
              membership: memberDoc.data(),
            };
          })
        );

        const cleaned = poolList
          .filter(Boolean)
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        setUserPools(cleaned);

        // Important:
        // If the saved/current pool is NOT one of this user's pools,
        // clear it instead of showing someone else's pool.
        const validPoolIds = cleaned.map((p) => p.id);
        const currentIsValid =
          currentPoolId && validPoolIds.includes(currentPoolId);

        if (!currentIsValid) {
          if (cleaned.length > 0) {
            setCurrentPoolId(cleaned[0].id);
            if (storageKey) {
              localStorage.setItem(storageKey, cleaned[0].id);
            }
          } else {
            setCurrentPoolId("");
            if (storageKey) {
              localStorage.removeItem(storageKey);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user pools:", error);
        setUserPools([]);
      }
    }

    loadUserPools();
  }, [user?.uid, currentPoolId, storageKey]);

  // Load the current pool document
  useEffect(() => {
    async function loadPool() {
      if (!currentPoolId) {
        setCurrentPool(null);
        return;
      }

      setPoolLoading(true);

      try {
        const snap = await getDoc(doc(db, "pools", currentPoolId));

        if (snap.exists()) {
          setCurrentPool({
            id: snap.id,
            ...snap.data(),
          });
        } else {
          setCurrentPool(null);
        }
      } catch (error) {
        console.error("Error loading pool:", error);
      } finally {
        setPoolLoading(false);
      }
    }

    loadPool();
  }, [currentPoolId, user?.uid]);

  // Listen to members of the current pool
  useEffect(() => {
    if (!currentPoolId) {
      setPoolMembers([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "pools", currentPoolId, "members"),
      (snapshot) => {
        const members = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        members.sort((a, b) => {
          if (a.role === "owner" && b.role !== "owner") return -1;
          if (a.role !== "owner" && b.role === "owner") return 1;

          const nameA = (a.username || "").toLowerCase();
          const nameB = (b.username || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setPoolMembers(members);
      },
      (error) => {
        console.error("Error loading pool members:", error);
        setPoolMembers([]);
      }
    );

    return () => unsubscribe();
  }, [currentPoolId]);

  function setPoolId(poolId) {
    setCurrentPoolId(poolId);

    if (storageKey) {
      localStorage.setItem(storageKey, poolId);
    }
  }

  function clearPoolId() {
    setCurrentPoolId("");
    setCurrentPool(null);
    setPoolMembers([]);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }

  const isUserInCurrentPool = poolMembers.some(
    (member) => member.userId === user?.uid
  );

  

  return {
    currentPoolId,
    currentPool,
    poolMembers,
    userPools,
    poolLoading,
    isUserInCurrentPool,
    setPoolId,
    clearPoolId,
  };
}
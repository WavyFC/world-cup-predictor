// src/firebase/pools.js

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
  } from "firebase/firestore";
  import { db } from "./firestore";
  
  // Create a random short invite code
  function generateInviteCode(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
  
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  
    return code;
  }
  
  // Create a new pool
  export async function createPool({ ownerId, ownerUsername, poolName }) {
    const poolId = crypto.randomUUID();
    const inviteCode = generateInviteCode();
  
    await setDoc(doc(db, "pools", poolId), {
      name: poolName,
      ownerId,
      inviteCode,
      createdAt: new Date().toISOString(),
    });
  
    await setDoc(doc(db, "pools", poolId, "members", ownerId), {
      userId: ownerId,
      username: ownerUsername,
      joinedAt: new Date().toISOString(),
      role: "owner",
    });
  
    return { poolId, inviteCode };
  }
  
  // Join a pool by invite code
  export async function joinPoolByCode({ userId, username, inviteCode }) {
    const poolsRef = collection(db, "pools");
    const q = query(poolsRef, where("inviteCode", "==", inviteCode));
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) {
      throw new Error("Pool not found.");
    }
  
    const poolDoc = snapshot.docs[0];
    const poolId = poolDoc.id;
  
    await setDoc(doc(db, "pools", poolId, "members", userId), {
      userId,
      username,
      joinedAt: new Date().toISOString(),
      role: "member",
    });
  
    return { poolId };
  }
  
  // Get one pool by ID
  export async function getPool(poolId) {
    const snap = await getDoc(doc(db, "pools", poolId));
    if (!snap.exists()) return null;
  
    return {
      id: snap.id,
      ...snap.data(),
    };
  }
// src/pages/AuthPage.jsx

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorText("");

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        // Save a user profile document
        await setDoc(doc(db, "users", cred.user.uid), {
          username: username.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        // Optional: make sure the user doc exists
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              username: email.split("@")[0],
              email: email.trim(),
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    } catch (error) {
      setErrorText(error.message || "Authentication failed.");
    }
  }

  return (
    <div className="section-card">
      <h2 className="section-title">{isSignup ? "Create Account" : "Sign In"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        {isSignup && (
          <input
            className="score-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          className="score-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="score-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="reset-button" type="submit">
          {isSignup ? "Create Account" : "Sign In"}
        </button>
      </form>

      {errorText ? (
        <p className="empty-text" style={{ marginTop: "12px" }}>
          {errorText}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setIsSignup((prev) => !prev)}
        style={{
          marginTop: "14px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isSignup ? "Already have an account? Sign in" : "Need an account? Create one"}
      </button>
    </div>
  );
}
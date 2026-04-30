// src/pages/LoginPage.jsx

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/auth";

export default function LoginPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCreateMode = mode === "create";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isCreateMode) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(getFriendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function getFriendlyAuthError(code) {
    switch (code) {
      case "auth/email-already-in-use":
        return "That email already has an account. Try signing in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">World Cup Predictor</p>
          <h1>{isCreateMode ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isCreateMode
              ? "Join your friends and start building your bracket."
              : "Sign in to continue your predictions."}
          </p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            className={mode === "create" ? "active" : ""}
            onClick={() => {
              setMode("create");
              setError("");
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isCreateMode
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
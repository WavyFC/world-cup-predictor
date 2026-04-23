// src/data/knockoutConfig.js

// This file defines the SHAPE of the knockout bracket.
// We are not fully wiring the official 2026 Round of 32 pairings yet.
// First, we refactor the engine to support any number of knockout rounds.

export const knockoutRounds = [
    {
      key: "roundOf32",
      label: "Round of 32",
      matchCount: 16,
    },
    {
      key: "roundOf16",
      label: "Round of 16",
      matchCount: 8,
    },
    {
      key: "quarterfinals",
      label: "Quarter-finals",
      matchCount: 4,
    },
    {
      key: "semifinals",
      label: "Semi-finals",
      matchCount: 2,
    },
    {
      key: "thirdPlace",
      label: "Third Place Match",
      matchCount: 1,
    },
    {
      key: "final",
      label: "Final",
      matchCount: 1,
    },
  ];
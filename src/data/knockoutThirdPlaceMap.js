// src/data/knockoutThirdPlaceMap.js

export const THIRD_PLACE_SLOTS = ["A", "B", "D", "E", "G", "I", "K", "L"];

export function normalizeThirdPlaceKey(groups) {
  if (!Array.isArray(groups)) return "";
  return [...groups].sort().join("");
}

export function validateThirdPlaceMappingEntry(key, entry) {
  const groups = key.split("");

  if (groups.length !== 8) {
    return {
      valid: false,
      reason: `Key "${key}" must contain exactly 8 group letters.`,
    };
  }

  for (const slot of THIRD_PLACE_SLOTS) {
    if (!entry[slot]) {
      return {
        valid: false,
        reason: `Key "${key}" is missing slot "${slot}".`,
      };
    }
  }

  for (const slot of THIRD_PLACE_SLOTS) {
    if (!groups.includes(entry[slot])) {
      return {
        valid: false,
        reason: `Key "${key}" has invalid value "${entry[slot]}" in slot "${slot}".`,
      };
    }
  }

  const usedGroups = THIRD_PLACE_SLOTS.map((slot) => entry[slot]).sort().join("");
  const expectedGroups = groups.slice().sort().join("");

  if (usedGroups !== expectedGroups) {
    return {
      valid: false,
      reason: `Key "${key}" does not use each advancing third-place group exactly once.`,
    };
  }

  return { valid: true };
}

export const THIRD_PLACE_MAPPING = {
  ABCDEFGH: { A: "H", B: "G", D: "B", E: "C", G: "A", I: "F", K: "D", L: "E" },
  ABCDFGIJ: { A: "C", B: "G", D: "B", E: "D", G: "A", I: "F", K: "I", L: "J" },
  ABCDEFGI: { A: "I", B: "G", D: "B", E: "C", G: "A", I: "F", K: "D", L: "E" },
  ABCDEFGJ: { A: "J", B: "G", D: "B", E: "C", G: "A", I: "F", K: "D", L: "E" },
  ABCDEFGK: { A: "K", B: "G", D: "B", E: "C", G: "A", I: "F", K: "D", L: "E" },
  ABCDEFGL: { A: "L", B: "G", D: "B", E: "C", G: "A", I: "F", K: "D", L: "E" },
  ABCDEFIJ: { A: "J", B: "F", D: "B", E: "C", G: "A", I: "D", K: "E", L: "I" },

  ABCEFGIK: { A: "E", B: "G", D: "B", E: "C", G: "A", I: "F", K: "I", L: "K" },
  ABCDGHIK: { A: "H", B: "G", D: "B", E: "C", G: "A", I: "D", K: "I", L: "K" },
  ABCDGIKL: { A: "I", B: "G", D: "B", E: "C", G: "A", I: "D", K: "L", L: "K" },
};

export function getThirdPlaceSlotMapping(groupsOrKey) {
  const groups = Array.isArray(groupsOrKey)
    ? groupsOrKey
    : groupsOrKey.split("");

  const key = [...groups].sort().join("");

  if (THIRD_PLACE_MAPPING[key]) {
    return THIRD_PLACE_MAPPING[key];
  }

  console.warn("Missing official third-place mapping for combo:", key);
  return null;
}

export function validateAllThirdPlaceMappings() {
  const results = Object.entries(THIRD_PLACE_MAPPING).map(([key, entry]) => ({
    key,
    ...validateThirdPlaceMappingEntry(key, entry),
  }));

  return {
    allValid: results.every((r) => r.valid),
    results,
  };
}
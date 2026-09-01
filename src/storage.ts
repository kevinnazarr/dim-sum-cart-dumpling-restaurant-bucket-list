import type { DimSumEntry, FilterValue, SortValue } from "./types";

const KEY = "dimsum-cart:entries";
const PREF_KEY = "dimsum-cart:prefs";

export function loadEntries(): DimSumEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function saveEntries(entries: DimSumEntry[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function loadPrefs(): { filter: FilterValue; sort: SortValue; search: string } | null {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
export function savePrefs(p: { filter: FilterValue; sort: SortValue; search: string }) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

function isValidEntry(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const o = e as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.name === "string" && typeof o.city === "string"
    && (o.status === "want_to_try" || o.status === "been_there");
}

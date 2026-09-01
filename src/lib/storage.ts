import type { DimSumEntry, FilterValue, SortValue } from "../types/entry"
import { STORAGE_KEY, PREF_KEY } from "./constants"

export function loadEntries(): DimSumEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry)
  } catch {
    return []
  }
}

export function saveEntries(entries: DimSumEntry[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    return true
  } catch {
    return false
  }
}

export function loadPrefs(): { filter: FilterValue; sort: SortValue; search: string } | null {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { filter: FilterValue; sort: SortValue; search: string }
  } catch {
    return null
  }
}

export function savePrefs(p: { filter: FilterValue; sort: SortValue; search: string }): void {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(p))
  } catch {
    // ignore quota errors
  }
}

function isValidEntry(e: unknown): boolean {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  return typeof o.id === "string" && typeof o.name === "string" && typeof o.city === "string" && (o.status === "want_to_try" || o.status === "been_there")
}

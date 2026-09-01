import { useEffect, useState } from "react"
import type { DimSumEntry, FilterValue, SortValue } from "../types/entry"
import { loadEntries, loadPrefs, saveEntries, savePrefs } from "../lib/storage"

export type UseEntriesReturn = {
  entries: DimSumEntry[]
  filter: FilterValue
  search: string
  sort: SortValue
  setEntries: React.Dispatch<React.SetStateAction<DimSumEntry[]>>
  setFilter: (v: FilterValue) => void
  setSearch: (v: string) => void
  setSort: (v: SortValue) => void
  persistError: boolean
}

export function useEntries(): UseEntriesReturn {
  const [entries, setEntries] = useState<DimSumEntry[]>(() => loadEntries())
  const [filter, setFilter] = useState<FilterValue>("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortValue>("newest")
  const [persistError, setPersistError] = useState(false)

  useEffect(() => {
    const p = loadPrefs()
    if (p) {
      if (["all", "want_to_try", "been_there"].includes(p.filter)) setFilter(p.filter)
      if (["newest", "alpha", "rating"].includes(p.sort)) setSort(p.sort)
      if (typeof p.search === "string") setSearch(p.search)
    }
  }, [])

  useEffect(() => {
    savePrefs({ filter, sort, search })
  }, [filter, sort, search])

  useEffect(() => {
    const ok = saveEntries(entries)
    setPersistError(!ok)
  }, [entries])

  return { entries, filter, search, sort, setEntries, setFilter, setSearch, setSort, persistError }
}

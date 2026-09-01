import { Search, X, Dices, Download } from "lucide-react"
import type { FilterValue, SortValue } from "../../types/entry"

type Props = {
  filter: FilterValue
  search: string
  sort: SortValue
  wantCount: number
  total: number
  filteredCount: number
  onFilter: (v: FilterValue)=>void
  onSearch: (v: string)=>void
  onSort: (v: SortValue)=>void
  onSurprise: ()=>void
  onExport: ()=>void
  onClearFilters: ()=>void
}

export function FilterBar({ filter, search, sort, wantCount, filteredCount, total, onFilter, onSearch, onSort, onSurprise, onExport, onClearFilters }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by status" className="inline-flex p-1 bg-white border border-border rounded-full">
          {(["all","want_to_try","been_there"] as FilterValue[]).map(v=>{
            const label = v==="all" ? "All" : v==="want_to_try" ? "Want to Try" : "Been There"
            const active = filter===v
            return (
              <button key={v} onClick={()=>onFilter(v)} aria-pressed={active}
                className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[36px] border transition-all inline-flex items-center gap-1.5 ${active ? "bg-primary text-white border-primary shadow" : "bg-transparent text-muted border-transparent hover:bg-bg"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : v==="been_there" ? "bg-primary" : v==="want_to_try" ? "bg-secondary" : "bg-muted"}`}/>
                {label}
                {active && <span className="ml-1 underline decoration-white/60 underline-offset-4">●</span>}
              </button>
            )
          })}
        </div>
        <div className="flex-1 min-w-[180px] flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
            <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search name or city"
              className="w-full pl-9 pr-9 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Search restaurants" />
            {search && <button onClick={()=>onSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full hover:bg-bg text-muted"><X size={14}/></button>}
          </div>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={e=>onSort(e.target.value as SortValue)} className="rounded-full border border-border bg-white px-3 py-2.5 text-sm font-medium min-h-[44px]">
            <option value="newest">Newest</option>
            <option value="alpha">A → Z</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={onSurprise} disabled={wantCount===0} className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 min-h-[44px] inline-flex items-center justify-center gap-1.5"><Dices size={16}/> Surprise Me</button>
          <button onClick={onExport} disabled={total===0} className="px-4 py-2.5 rounded-full border border-border bg-white font-semibold text-sm hover:bg-bg disabled:opacity-40 min-h-[44px] inline-flex items-center gap-1.5"><Download size={16}/> Export JSON</button>
        </div>
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        Showing <strong className="text-text">{filteredCount}</strong> of {total} {filter!=="all" ? `· ${filter==="been_there" ? "Been There" : "Want to Try"}` : ""} {search ? `· search “${search}”` : ""}
        {(filter!=="all" || search) && filteredCount!==total && (
          <button onClick={onClearFilters} className="ml-2 underline font-medium text-primary hover:text-primary-hover">Clear filters</button>
        )}
      </p>
    </div>
  )
}

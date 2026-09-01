import { useEffect, useMemo, useState } from "react"
import type { DimSumEntry, FormState } from "../types/entry"
import { useEntries } from "../hooks/useEntries"
import { SummaryBar } from "../components/SummaryBar/SummaryBar"
import { FilterBar } from "../components/FilterBar/FilterBar"
import { EntryList } from "../components/EntryList/EntryList"
import { EmptyState } from "../components/EmptyState/EmptyState"
import { EntryFormModal } from "../components/EntryFormModal/EntryFormModal"
import { Plus, UtensilsCrossed } from "lucide-react"

const genId = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36)

export default function App(){
  const { entries, filter, search, sort, setEntries, setFilter, setSearch, setSort, persistError } = useEntries()
  const [editing, setEditing] = useState<DimSumEntry|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [highlightId, setHighlightId] = useState<string|null>(null)
  const [surpriseId, setSurpriseId] = useState<string|null>(null)

  useEffect(()=>{ if(!highlightId) return; const t=setTimeout(()=>setHighlightId(null),1400); return()=>clearTimeout(t)},[highlightId])
  useEffect(()=>{ if(!surpriseId) return; const t=setTimeout(()=>setSurpriseId(null),2200); return()=>clearTimeout(t)},[surpriseId])

  const counts = useMemo(()=>{
    const been = entries.filter(e=>e.status==="been_there").length
    return { been, want: entries.length - been, total: entries.length }
  },[entries])

  const filtered = useMemo(()=>{
    let out = [...entries]
    if(filter!=="all") out = out.filter(e=>e.status===filter)
    if(search.trim()){
      const q = search.trim().toLowerCase()
      out = out.filter(e=> e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q))
    }
    if(sort==="alpha") out.sort((a,b)=> a.name.localeCompare(b.name))
    else if(sort==="rating") out.sort((a,b)=> (b.rating?? -1) - (a.rating?? -1) || b.createdAt - a.createdAt)
    else out.sort((a,b)=> b.createdAt - a.createdAt)
    return out
  },[entries, filter, search, sort])

  const handleSave = (data: FormState) => {
    if(editing){
      const prevStatus = editing.status
      const updated: DimSumEntry = { ...editing, name:data.name.trim(), city:data.city.trim(), status:data.status, rating:data.rating, dish:data.dish.trim(), note:data.note.trim() }
      setEntries(prev=> prev.map(e=> e.id===editing.id ? updated : e))
      if(prevStatus!=="been_there" && data.status==="been_there") setHighlightId(editing.id)
      else setHighlightId(editing.id)
      setEditing(null); setShowForm(false)
    } else {
      const ne: DimSumEntry = { id:genId(), name:data.name.trim(), city:data.city.trim(), status:data.status, rating:data.rating, dish:data.dish.trim(), note:data.note.trim(), createdAt:Date.now() }
      setEntries(prev=> [ne, ...prev])
      setHighlightId(ne.id)
      setShowForm(false)
    }
  }

  const handleDelete = (id:string) => { setEntries(prev=> prev.filter(e=>e.id!==id)); setDeleteId(null) }

  const surprise = () => {
    const pool = entries.filter(e=>e.status==="want_to_try")
    if(!pool.length) return
    const pick = pool[Math.floor(Math.random()*pool.length)]
    setSurpriseId(pick.id); setFilter("all")
    setTimeout(()=>{ document.getElementById(`card-${pick.id}`)?.scrollIntoView({behavior:"smooth", block:"center"}) }, 100)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {type:"application/json"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href=url; a.download=`dim-sum-cart-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-border">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[28px] sm:text-[36px] font-bold leading-none tracking-tight text-text flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center"><UtensilsCrossed size={18}/></span> Dim Sum Cart
              </h1>
              <p className="text-sm text-muted mt-1">Your personal steamer basket — wishlist & visited, all in one menu.</p>
            </div>
            <button onClick={()=>{setEditing(null); setShowForm(true)}} className="w-full sm:w-auto mt-1 sm:mt-0 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(192,57,43,0.3)] flex items-center justify-center gap-2 text-[15px] min-h-[44px]">
              <Plus size={18}/> Add Restaurant
            </button>
          </div>
          <div className="mt-4">
            <SummaryBar total={counts.total} been={counts.been} want={counts.want} persistError={persistError} />
          </div>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
        <FilterBar filter={filter} search={search} sort={sort} wantCount={counts.want} total={counts.total} filteredCount={filtered.length}
          onFilter={setFilter} onSearch={setSearch} onSort={setSort} onSurprise={surprise} onExport={exportJson} onClearFilters={()=>{setFilter("all"); setSearch("")}} />

        <div className="mt-6">
          {entries.length===0 ? (
            <EmptyState type="empty" onAdd={()=>{setEditing(null); setShowForm(true)}} />
          ) : filtered.length===0 ? (
            <EmptyState type="filtered" filter={filter} search={search} onClear={()=>{setFilter("all"); setSearch("")}} />
          ) : (
            <EntryList entries={filtered} highlightId={highlightId} surpriseId={surpriseId} deleteId={deleteId}
              onEdit={(e)=>{setEditing(e); setShowForm(true)}} onDeleteRequest={setDeleteId} onDeleteConfirm={handleDelete} onDeleteCancel={()=>setDeleteId(null)} />
          )}
        </div>
        <footer className="mt-10 text-center text-xs text-muted border-t border-border pt-6">
          Steamer-basket vibes · Data stays in your browser · {entries.length} spots saved
        </footer>
      </main>
      <EntryFormModal initial={editing} open={showForm} onClose={()=>{setShowForm(false); setEditing(null)}} onSave={handleSave} />
      <div className="sr-only" aria-live="polite">{highlightId ? "Entry saved" : ""}{surpriseId ? "Surprise pick highlighted" : ""}</div>
    </div>
  )
}

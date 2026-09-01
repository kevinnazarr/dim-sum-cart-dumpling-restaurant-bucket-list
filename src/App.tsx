import { useEffect, useMemo, useRef, useState } from "react"
import type { DimSumEntry, FilterValue, SortValue, Status } from "./types"
import { loadEntries, loadPrefs, saveEntries, savePrefs } from "./storage"
import { Search, X, Plus, Pencil, Trash2, Dices, Download, MapPin, AlertTriangle, ShoppingBasket, Soup, Check, Bookmark, UtensilsCrossed, Wind } from "lucide-react"

const genId = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36)

function RatingInput({ value, onChange, error, required }: {
  value: number | null; onChange: (v: number)=>void; error?: string; required?: boolean
}) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value ?? 0
  return (
    <div>
      <div role="radiogroup" aria-label="Rating in dumplings" aria-required={required} aria-invalid={!!error} className="flex gap-1" onMouseLeave={()=>setHover(null)}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" role="radio" aria-checked={value===n} aria-label={`${n} of 5 dumplings`}
            onMouseEnter={()=>setHover(n)} onFocus={()=>setHover(n)} onBlur={()=>setHover(null)}
            onClick={()=>onChange(n)}
            onKeyDown={e=>{
              if(e.key==="ArrowRight"||e.key==="ArrowUp"){ e.preventDefault(); onChange(Math.min(5,(value??0)+1||1)) }
              if(e.key==="ArrowLeft"||e.key==="ArrowDown"){ e.preventDefault(); onChange(Math.max(1,(value??1)-1)) }
            }}
            className={`w-11 h-11 text-[22px] rounded-md flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border ${display>=n ? "bg-[#FFF2CF] border-[#E9C97A] opacity-100 scale-105" : "bg-white border-border opacity-40 hover:opacity-70"} ${value===n ? "ring-2 ring-primary ring-offset-1" : ""}`}
          ><span aria-hidden>{display>=n ? "🥟" : "🥟"}</span></button>
        ))}
      </div>
      <p className="text-xs text-muted mt-1 min-h-[16px]" aria-live="polite">
        {value ? `${value} of 5 dumplings` : required ? "Pick a rating" : "No rating yet"}
        {hover && hover!==value ? ` — preview ${hover}` : ""}
      </p>
      {error && <p className="text-sm text-danger mt-1 flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {error}</p>}
    </div>
  )
}

type FormState = { name:string; city:string; status:Status; rating:number|null; dish:string; note:string }
const emptyForm: FormState = { name:"", city:"", status:"want_to_try", rating:null, dish:"", note:"" }

function EntryFormModal({ initial, open, onClose, onSave }: {
  initial: Partial<DimSumEntry> | null; open:boolean; onClose:()=>void; onSave:(data:FormState)=>void
}) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    if(open){
      if(initial) setForm({ name:initial.name??"", city:initial.city??"", status:initial.status??"want_to_try", rating:initial.rating??null, dish:initial.dish??"", note:initial.note??"" })
      else setForm(emptyForm)
      setErrors({})
      setTimeout(()=>firstInputRef.current?.focus(), 50)
      const h = (e:KeyboardEvent)=>{ if(e.key==="Escape") onClose() }
      document.addEventListener("keydown", h)
      return ()=>document.removeEventListener("keydown", h)
    }
  },[open, initial, onClose])

  useEffect(()=>{
    if(!open) return
    const root = dialogRef.current
    if(!root) return
    const getFocusable = ()=> Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el=>!el.hasAttribute("disabled"))
    const handler = (e:KeyboardEvent)=>{
      if(e.key!=="Tab") return
      const els = getFocusable()
      if(!els.length) return
      const first = els[0], last = els[els.length-1]
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus() }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus() }
    }
    root.addEventListener("keydown", handler as unknown as EventListener)
    return ()=>root.removeEventListener("keydown", handler as unknown as EventListener)
  },[open])

  if(!open) return null

  const validate = (): boolean => {
    const e: Record<string,string> = {}
    if(!form.name.trim()) e.name = "Restaurant name is required"
    else if(form.name.trim().length>80) e.name = "Keep name under 80 characters"
    if(!form.city.trim()) e.city = "City is required"
    else if(form.city.trim().length>60) e.city = "Keep city under 60 characters"
    if(form.dish.length>60) e.dish = "Keep dish under 60 characters"
    if(form.note.length>200) e.note = "Keep note under 200 characters"
    if(form.status==="been_there" && !form.rating) e.rating = "Pick a rating for Been There"
    setErrors(e)
    return Object.keys(e).length===0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if(!validate()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog" aria-label={initial?.id ? "Edit restaurant" : "Add restaurant"}>
      <button aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-[#3A2318]/40 backdrop-blur-[2px]" />
      <div ref={dialogRef} className="relative bg-surface w-full sm:max-w-[520px] max-h-[92vh] sm:max-h-[90vh] overflow-auto rounded-t-[20px] sm:rounded-[16px] shadow-[0_20px_60px_rgba(58,35,24,0.3)] border border-border animate-fade flex flex-col">
        <div className="sticky top-0 bg-surface z-10 px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-[22px] font-bold text-text">{initial?.id ? "Edit spot" : "Add a spot"}</h2>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full border border-border bg-white hover:bg-bg flex items-center justify-center"><X size={18}/></button>
        </div>
        <form onSubmit={submit} noValidate className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label htmlFor="f-name" className="text-xs font-semibold tracking-widest uppercase text-muted">Restaurant name *</label>
            <input ref={firstInputRef} id="f-name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} maxLength={80} placeholder="e.g. Tim Ho Wan"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.name ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.name}</span> : <span/>}
              <span className={`text-xs ${form.name.length>70 ? "text-danger" : "text-muted"}`}>{form.name.length}/80</span>
            </div>
          </div>
          <div>
            <label htmlFor="f-city" className="text-xs font-semibold tracking-widest uppercase text-muted">City *</label>
            <input id="f-city" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} maxLength={60} placeholder="e.g. Hong Kong"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.city ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.city}</span> : <span/>}
              <span className={`text-xs ${form.city.length>50 ? "text-danger" : "text-muted"}`}>{form.city.length}/60</span>
            </div>
          </div>
          <fieldset>
            <legend className="text-xs font-semibold tracking-widest uppercase text-muted">Status *</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 p-1 bg-bg rounded-full border border-border">
              {(["want_to_try","been_there"] as Status[]).map(s=>(
                <button key={s} type="button" aria-pressed={form.status===s} onClick={()=>setForm({...form,status:s})}
                  className={`py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 ${form.status===s ? "bg-primary text-white border-primary shadow" : "bg-white text-muted border-transparent hover:border-border"}`}>
                  {s==="been_there" ? <><Check size={16}/> Been There</> : <><Bookmark size={16}/> Want to Try</>}
                </button>
              ))}
            </div>
          </fieldset>
          <div className={`rounded-xl border p-4 transition-colors ${form.status==="been_there" ? "bg-[#FFF8E7] border-[#E9C97A]" : "bg-bg/60 border-border"}`}>
            <label className="text-xs font-semibold tracking-widest uppercase text-muted flex items-center gap-2">
              Rating {form.status==="been_there" ? <span className="normal-case tracking-normal text-danger text-xs font-medium">* required</span> : <span className="normal-case tracking-normal font-normal">— only for Been There</span>}
            </label>
            <div className="mt-2"><RatingInput value={form.rating} onChange={v=>setForm({...form,rating:v})} error={errors.rating} required={form.status==="been_there"} /></div>
            {form.status==="want_to_try" && form.rating && <p className="text-xs text-muted mt-2">Rating saved but hidden until you mark Been There.</p>}
          </div>
          <div>
            <label htmlFor="f-dish" className="text-xs font-semibold tracking-widest uppercase text-muted">Must-order dish <span className="normal-case tracking-normal font-normal">(optional)</span></label>
            <input id="f-dish" value={form.dish} onChange={e=>setForm({...form,dish:e.target.value})} maxLength={60} placeholder="e.g. Har gow, siu mai"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.dish ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.dish ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.dish}</span> : <span/>}
              <span className={`text-xs ${form.dish.length>50 ? "text-amber-700" : "text-muted"}`}>{form.dish.length}/60</span>
            </div>
          </div>
          <div>
            <label htmlFor="f-note" className="text-xs font-semibold tracking-widest uppercase text-muted">Note <span className="normal-case tracking-normal font-normal">(optional)</span></label>
            <textarea id="f-note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} maxLength={200} rows={3} placeholder="First visit, go early, ask for chili oil..."
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary ${errors.note ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.note ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.note}</span> : <span/>}
              <span className={`text-xs ${form.note.length>180 ? "text-danger font-medium" : form.note.length>150 ? "text-amber-700" : "text-muted"}`}>{form.note.length}/200</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-border bg-white font-semibold text-text hover:bg-bg">Cancel</button>
            <button type="submit" className="flex-[1.2] py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-hover shadow">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App(){
  const [entries, setEntries] = useState<DimSumEntry[]>(()=>loadEntries())
  const [filter, setFilter] = useState<FilterValue>("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortValue>("newest")
  const [editing, setEditing] = useState<DimSumEntry|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [highlightId, setHighlightId] = useState<string|null>(null)
  const [surpriseId, setSurpriseId] = useState<string|null>(null)
  const [persistError, setPersistError] = useState(false)

  useEffect(()=>{
    const p = loadPrefs()
    if(p){
      if(["all","want_to_try","been_there"].includes(p.filter)) setFilter(p.filter)
      if(["newest","alpha","rating"].includes(p.sort)) setSort(p.sort)
      if(typeof p.search==="string") setSearch(p.search)
    }
  },[])
  useEffect(()=>{ savePrefs({ filter, sort, search }) },[filter, sort, search])
  useEffect(()=>{ const ok = saveEntries(entries); setPersistError(!ok) },[entries])
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
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-surface border border-border rounded-[12px] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF2CF] border border-[#E9C97A] grid place-items-center"><ShoppingBasket size={18} className="text-[#8A5A00]"/></div>
              <div><div className="text-xl font-bold leading-none text-text">{counts.total}</div><div className="text-[11px] font-semibold tracking-widest uppercase text-muted">Total spots</div></div>
            </div>
            <div className="bg-surface border border-border rounded-[12px] px-4 py-3">
              <div className="text-xl font-bold leading-none text-primary">{counts.been}</div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"/> Been There</div>
            </div>
            <div className="bg-surface border border-border rounded-[12px] px-4 py-3">
              <div className="text-xl font-bold leading-none text-text">{counts.want}</div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block"/> Want to Try</div>
            </div>
          </div>
          {persistError && <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg px-3 py-2 flex items-center gap-2"><AlertTriangle size={16}/> Changes may not persist — storage is full or blocked.</div>}
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Filter by status" className="inline-flex p-1 bg-white border border-border rounded-full">
              {(["all","want_to_try","been_there"] as FilterValue[]).map(v=>{
                const label = v==="all" ? "All" : v==="want_to_try" ? "Want to Try" : "Been There"
                const active = filter===v
                return (
                  <button key={v} onClick={()=>setFilter(v)} aria-pressed={active}
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
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or city"
                  className="w-full pl-9 pr-9 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Search restaurants" />
                {search && <button onClick={()=>setSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full hover:bg-bg text-muted"><X size={14}/></button>}
              </div>
              <label className="sr-only" htmlFor="sort">Sort</label>
              <select id="sort" value={sort} onChange={e=>setSort(e.target.value as SortValue)} className="rounded-full border border-border bg-white px-3 py-2.5 text-sm font-medium min-h-[44px]">
                <option value="newest">Newest</option>
                <option value="alpha">A → Z</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={surprise} disabled={counts.want===0} className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 min-h-[44px] inline-flex items-center justify-center gap-1.5"><Dices size={16}/> Surprise Me</button>
              <button onClick={exportJson} disabled={entries.length===0} className="px-4 py-2.5 rounded-full border border-border bg-white font-semibold text-sm hover:bg-bg disabled:opacity-40 min-h-[44px] inline-flex items-center gap-1.5"><Download size={16}/> Export JSON</button>
            </div>
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            Showing <strong className="text-text">{filtered.length}</strong> of {entries.length} {filter!=="all" ? `· ${filter==="been_there" ? "Been There" : "Want to Try"}` : ""} {search ? `· search “${search}”` : ""}
            {(filter!=="all" || search) && filtered.length!==entries.length && (
              <button onClick={()=>{setFilter("all"); setSearch("")}} className="ml-2 underline font-medium text-primary hover:text-primary-hover">Clear filters</button>
            )}
          </p>
        </div>

        <div className="mt-6">
          {entries.length===0 ? (
            <div className="text-center bg-surface border border-border rounded-[16px] px-6 py-14">
              <div className="w-14 h-14 rounded-full bg-bg border border-border grid place-items-center mx-auto mb-3"><ShoppingBasket size={26} className="text-muted"/></div>
              <h2 className="font-display text-[22px] font-bold text-text">Your steamer basket is empty</h2>
              <p className="text-muted mt-1 max-w-[420px] mx-auto">Add your first must-try spot — the best har gow in town is waiting.</p>
              <button onClick={()=>{setEditing(null); setShowForm(true)}} className="mt-5 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-hover inline-flex items-center gap-2"><Plus size={18}/> Add your first restaurant</button>
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center bg-surface border border-dashed border-border rounded-[16px] px-6 py-12">
              <div className="w-14 h-14 rounded-full bg-bg border border-border grid place-items-center mx-auto mb-3"><Soup size={26} className="text-muted"/></div>
              <h2 className="font-display text-xl font-bold text-text">
                {filter==="been_there" ? "No spots marked “Been There” yet — get out there!" : filter==="want_to_try" ? "No wishlist spots — everything visited!" : "No matches"}
              </h2>
              <p className="text-muted mt-1">{search ? `No results for “${search}”` : "Try a different filter or add a new spot."}</p>
              <button onClick={()=>{setFilter("all"); setSearch("")}} className="mt-4 px-5 py-2.5 rounded-full border border-border bg-white font-semibold hover:bg-bg inline-flex items-center gap-2"><X size={16}/> Clear filter</button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(e=>{
                const isBeen = e.status==="been_there"
                const isHighlight = highlightId===e.id
                const isSurprise = surpriseId===e.id
                const isDeleteConfirm = deleteId===e.id
                return (
                  <article id={`card-${e.id}`} key={e.id}
                    className={`relative bg-surface border rounded-[16px] p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(58,35,24,0.08)] hover:shadow-[0_8px_24px_rgba(58,35,24,0.12)] transition-all ${isBeen ? "border-[#E9C97A] bg-[#FFFEFB]" : "border-border"} ${isHighlight ? "animate-pop ring-2 ring-primary ring-offset-2" : ""} ${isSurprise ? "ring-2 ring-secondary ring-offset-2 scale-[1.01]" : ""}`}>
                    {isHighlight && isBeen && (
                      <div aria-hidden className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                        <Wind size={18} className="opacity-60" style={{animation:"steam-rise 900ms ease-out forwards"}}/>
                        <Wind size={18} className="opacity-60" style={{animation:"steam-rise 900ms 120ms ease-out forwards"}}/>
                      </div>
                    )}
                    {isSurprise && <div className="absolute -top-3 -right-2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow rotate-3 inline-flex items-center gap-1"><Dices size={12}/> Your pick!</div>}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-[18px] font-bold leading-tight text-text break-words">{e.name}</h3>
                        <p className="text-sm text-muted flex items-center gap-1 mt-0.5"><MapPin size={14}/> {e.city}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${isBeen ? "bg-primary text-white border-primary" : "bg-[#FFF2CF] text-[#8A5A00] border-[#E9C97A]"}`}>
                        {isBeen ? <Check size={12}/> : <Bookmark size={12}/>} {isBeen ? "Been There" : "Want to Try"}
                      </span>
                    </div>
                    {isBeen && e.rating ? (
                      <div className="flex items-center gap-1" aria-label={`Rating ${e.rating} of 5 dumplings`}>
                        {[1,2,3,4,5].map(n=>(
                          <span key={n} className={`text-[18px] ${n<=e.rating! ? "opacity-100" : "opacity-25"}`}>🥟</span>
                        ))}
                        <span className="ml-1 text-xs font-semibold text-muted">{e.rating}/5</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted italic">No rating — mark Been There to rate</div>
                    )}
                    {e.dish && <p className="text-sm"><span className="font-semibold text-secondary inline-flex items-center gap-1"><UtensilsCrossed size={14}/> Order this:</span> <span className="text-text break-words">{e.dish}</span></p>}
                    {e.note && <p className="text-sm text-muted bg-bg/60 border border-border/60 rounded-lg px-3 py-2 break-words whitespace-pre-wrap">“{e.note}”</p>}
                    <div className="mt-auto flex gap-2 pt-2">
                      <button onClick={()=>{setEditing(e); setShowForm(true)}} className="flex-1 py-2.5 rounded-full bg-white border border-border font-semibold text-sm hover:bg-bg min-h-[44px] inline-flex items-center justify-center gap-1.5"><Pencil size={14}/> Edit</button>
                      {!isDeleteConfirm ? (
                        <button onClick={()=>setDeleteId(e.id)} className="px-4 py-2.5 rounded-full bg-white border border-border text-danger font-semibold text-sm hover:bg-red-50 min-h-[44px] inline-flex items-center gap-1.5"><Trash2 size={14}/> Delete</button>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-50 border border-danger/20 rounded-full px-2 py-1">
                          <span className="text-xs font-semibold text-danger hidden sm:inline">Sure?</span>
                          <button onClick={()=>handleDelete(e.id)} className="px-3 py-1.5 rounded-full bg-danger text-white text-xs font-bold hover:bg-red-700">Yes</button>
                          <button onClick={()=>setDeleteId(null)} autoFocus className="px-3 py-1.5 rounded-full bg-white border border-border text-xs font-semibold">Cancel</button>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
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

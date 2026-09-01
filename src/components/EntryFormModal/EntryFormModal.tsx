import { useEffect, useRef, useState } from "react"
import { X, Check, Bookmark, AlertTriangle } from "lucide-react"
import type { DimSumEntry, FormState, Status } from "../../types/entry"
import { RatingInput } from "../RatingInput/RatingInput"
import { validateEntry } from "../../lib/validation"
import { MAX_NAME, MAX_CITY, MAX_DISH, MAX_NOTE } from "../../lib/constants"

const emptyForm: FormState = { name:"", city:"", status:"want_to_try", rating:null, dish:"", note:"" }

type Props = {
  initial: Partial<DimSumEntry> | null
  open: boolean
  onClose: ()=>void
  onSave: (data: FormState)=>void
}

export function EntryFormModal({ initial, open, onClose, onSave }: Props) {
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

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const { valid, errors: e } = validateEntry(form)
    setErrors(e as Record<string,string>)
    if(!valid) return
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
            <input ref={firstInputRef} id="f-name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} maxLength={MAX_NAME} placeholder="e.g. Tim Ho Wan"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.name ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.name}</span> : <span/>}
              <span className={`text-xs ${form.name.length>70 ? "text-danger" : "text-muted"}`}>{form.name.length}/{MAX_NAME}</span>
            </div>
          </div>
          <div>
            <label htmlFor="f-city" className="text-xs font-semibold tracking-widest uppercase text-muted">City *</label>
            <input id="f-city" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} maxLength={MAX_CITY} placeholder="e.g. Hong Kong"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.city ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.city}</span> : <span/>}
              <span className={`text-xs ${form.city.length>50 ? "text-danger" : "text-muted"}`}>{form.city.length}/{MAX_CITY}</span>
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
            <input id="f-dish" value={form.dish} onChange={e=>setForm({...form,dish:e.target.value})} maxLength={MAX_DISH} placeholder="e.g. Har gow, siu mai"
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.dish ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.dish ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.dish}</span> : <span/>}
              <span className={`text-xs ${form.dish.length>50 ? "text-amber-700" : "text-muted"}`}>{form.dish.length}/{MAX_DISH}</span>
            </div>
          </div>
          <div>
            <label htmlFor="f-note" className="text-xs font-semibold tracking-widest uppercase text-muted">Note <span className="normal-case tracking-normal font-normal">(optional)</span></label>
            <textarea id="f-note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} maxLength={MAX_NOTE} rows={3} placeholder="First visit, go early, ask for chili oil..."
              className={`mt-1 w-full rounded-[10px] border px-3 py-2.5 text-[15px] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary ${errors.note ? "border-danger" : "border-border"}`} />
            <div className="flex justify-between mt-1">
              {errors.note ? <span className="text-sm text-danger flex items-center gap-1" role="alert"><AlertTriangle size={14}/> {errors.note}</span> : <span/>}
              <span className={`text-xs ${form.note.length>180 ? "text-danger font-medium" : form.note.length>150 ? "text-amber-700" : "text-muted"}`}>{form.note.length}/{MAX_NOTE}</span>
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

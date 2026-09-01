import { MapPin, Pencil, Trash2, UtensilsCrossed, Wind, Dices } from "lucide-react"
import type { DimSumEntry } from "../../types/entry"
import { Badge } from "../ui/Badge"

type Props = {
  entry: DimSumEntry
  isHighlight?: boolean
  isSurprise?: boolean
  isDeleteConfirm?: boolean
  onEdit: (e: DimSumEntry)=>void
  onDeleteRequest: (id: string)=>void
  onDeleteConfirm: (id: string)=>void
  onDeleteCancel: ()=>void
}

export function EntryCard({ entry: e, isHighlight, isSurprise, isDeleteConfirm, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel }: Props) {
  const isBeen = e.status==="been_there"
  return (
    <article id={`card-${e.id}`} className={`relative bg-surface border rounded-[16px] p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(58,35,24,0.08)] hover:shadow-[0_8px_24px_rgba(58,35,24,0.12)] transition-all ${isBeen ? "border-[#E9C97A] bg-[#FFFEFB]" : "border-border"} ${isHighlight ? "animate-pop ring-2 ring-primary ring-offset-2" : ""} ${isSurprise ? "ring-2 ring-secondary ring-offset-2 scale-[1.01]" : ""}`}>
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
        <Badge status={e.status} />
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
        <button onClick={()=>onEdit(e)} className="flex-1 py-2.5 rounded-full bg-white border border-border font-semibold text-sm hover:bg-bg min-h-[44px] inline-flex items-center justify-center gap-1.5"><Pencil size={14}/> Edit</button>
        {!isDeleteConfirm ? (
          <button onClick={()=>onDeleteRequest(e.id)} className="px-4 py-2.5 rounded-full bg-white border border-border text-danger font-semibold text-sm hover:bg-red-50 min-h-[44px] inline-flex items-center gap-1.5"><Trash2 size={14}/> Delete</button>
        ) : (
          <div className="flex items-center gap-2 bg-red-50 border border-danger/20 rounded-full px-2 py-1">
            <span className="text-xs font-semibold text-danger hidden sm:inline">Sure?</span>
            <button onClick={()=>onDeleteConfirm(e.id)} className="px-3 py-1.5 rounded-full bg-danger text-white text-xs font-bold hover:bg-red-700">Yes</button>
            <button onClick={onDeleteCancel} autoFocus className="px-3 py-1.5 rounded-full bg-white border border-border text-xs font-semibold">Cancel</button>
          </div>
        )}
      </div>
    </article>
  )
}

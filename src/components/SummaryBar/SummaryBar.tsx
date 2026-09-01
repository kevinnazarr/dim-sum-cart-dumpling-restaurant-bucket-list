import { ShoppingBasket } from "lucide-react"
type Props = { total: number; been: number; want: number; persistError?: boolean }
export function SummaryBar({ total, been, want, persistError }: Props) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-[12px] px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF2CF] border border-[#E9C97A] grid place-items-center"><ShoppingBasket size={18} className="text-[#8A5A00]"/></div>
          <div><div className="text-xl font-bold leading-none text-text">{total}</div><div className="text-[11px] font-semibold tracking-widest uppercase text-muted">Total spots</div></div>
        </div>
        <div className="bg-surface border border-border rounded-[12px] px-4 py-3">
          <div className="text-xl font-bold leading-none text-primary">{been}</div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"/> Been There</div>
        </div>
        <div className="bg-surface border border-border rounded-[12px] px-4 py-3">
          <div className="text-xl font-bold leading-none text-text">{want}</div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block"/> Want to Try</div>
        </div>
      </div>
      {persistError && <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg px-3 py-2">⚠ Changes may not persist — storage is full or blocked.</div>}
    </div>
  )
}

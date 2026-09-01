import { ShoppingBasket, Soup, X } from "lucide-react"
type Props = { type: "empty" | "filtered"; filter?: string; search?: string; onClear?: ()=>void; onAdd?: ()=>void }
export function EmptyState({ type, filter, search, onClear, onAdd }: Props) {
  if (type==="empty") return (
    <div className="text-center bg-surface border border-border rounded-[16px] px-6 py-14">
      <div className="w-14 h-14 rounded-full bg-bg border border-border grid place-items-center mx-auto mb-3"><ShoppingBasket size={26} className="text-muted"/></div>
      <h2 className="font-display text-[22px] font-bold text-text">Your steamer basket is empty</h2>
      <p className="text-muted mt-1 max-w-[420px] mx-auto">Add your first must-try spot — the best har gow in town is waiting.</p>
      <button onClick={onAdd} className="mt-5 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-hover inline-flex items-center gap-2">Add your first restaurant</button>
    </div>
  )
  return (
    <div className="text-center bg-surface border border-dashed border-border rounded-[16px] px-6 py-12">
      <div className="w-14 h-14 rounded-full bg-bg border border-border grid place-items-center mx-auto mb-3"><Soup size={26} className="text-muted"/></div>
      <h2 className="font-display text-xl font-bold text-text">
        {filter==="been_there" ? "No spots marked “Been There” yet — get out there!" : filter==="want_to_try" ? "No wishlist spots — everything visited!" : "No matches"}
      </h2>
      <p className="text-muted mt-1">{search ? `No results for “${search}”` : "Try a different filter or add a new spot."}</p>
      <button onClick={onClear} className="mt-4 px-5 py-2.5 rounded-full border border-border bg-white font-semibold hover:bg-bg inline-flex items-center gap-2"><X size={16}/> Clear filter</button>
    </div>
  )
}

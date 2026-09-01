import type { DimSumEntry } from "../../types/entry"
import { EntryCard } from "../EntryCard/EntryCard"

type Props = {
  entries: DimSumEntry[]
  highlightId: string | null
  surpriseId: string | null
  deleteId: string | null
  onEdit: (e: DimSumEntry)=>void
  onDeleteRequest: (id: string)=>void
  onDeleteConfirm: (id: string)=>void
  onDeleteCancel: ()=>void
}

export function EntryList({ entries, highlightId, surpriseId, deleteId, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {entries.map(e=>(
        <EntryCard key={e.id} entry={e} isHighlight={highlightId===e.id} isSurprise={surpriseId===e.id} isDeleteConfirm={deleteId===e.id}
          onEdit={onEdit} onDeleteRequest={onDeleteRequest} onDeleteConfirm={onDeleteConfirm} onDeleteCancel={onDeleteCancel} />
      ))}
    </div>
  )
}

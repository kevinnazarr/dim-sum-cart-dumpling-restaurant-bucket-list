import type { Status } from "../../types/entry"
export function Badge({ status }: { status: Status }) {
  const isBeen = status==="been_there"
  return (
    <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${isBeen ? "bg-primary text-white border-primary" : "bg-[#FFF2CF] text-[#8A5A00] border-[#E9C97A]"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isBeen ? "bg-white" : "bg-secondary"}`} />
      {isBeen ? "Been There" : "Want to Try"}
    </span>
  )
}

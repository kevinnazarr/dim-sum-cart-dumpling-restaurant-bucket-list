import { useEffect, useRef } from "react"
type Props = { open: boolean; onClose: ()=>void; label: string; children: React.ReactNode }
export function Modal({ open, onClose, label, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!open) return
    const h = (e:KeyboardEvent)=>{ if(e.key==="Escape") onClose() }
    document.addEventListener("keydown", h)
    return ()=>document.removeEventListener("keydown", h)
  },[open, onClose])
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog" aria-label={label}>
      <button aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-[#3A2318]/40 backdrop-blur-[2px]" />
      <div ref={ref} className="relative bg-surface w-full sm:max-w-[520px] max-h-[92vh] overflow-auto rounded-t-[20px] sm:rounded-[16px] shadow-[0_20px_60px_rgba(58,35,24,0.3)] border border-border animate-fade flex flex-col">
        {children}
      </div>
    </div>
  )
}

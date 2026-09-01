import { useState } from "react"
import { AlertTriangle } from "lucide-react"

type Props = {
  value: number | null
  onChange: (v: number)=>void
  error?: string
  required?: boolean
}

export function RatingInput({ value, onChange, error, required }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value ?? 0
  return (
    <div>
      <div role="radiogroup" aria-label="Rating in dumplings" aria-required={required} aria-invalid={!!error} className="flex gap-1" onMouseLeave={()=>setHover(null)}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" role="radio" aria-checked={value===n} aria-label={`${n} of 5 dumplings`}
            onMouseEnter={()=>setHover(n)} onFocus={()=>setHover(n)} onBlur={()=>setHover(null)}
            onClick={()=>onChange(n)}
            onKeyDown={(e)=>{
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

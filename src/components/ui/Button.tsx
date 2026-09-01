import type { ButtonHTMLAttributes } from "react"
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost"|"danger" }
export function Button({ variant="primary", className="", ...props }: Props) {
  const base = "rounded-full font-semibold min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  const v = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow",
    secondary: "bg-white border border-border text-text hover:bg-bg",
    ghost: "bg-transparent text-muted hover:bg-bg",
    danger: "bg-danger text-white hover:bg-red-700",
  }[variant]
  return <button className={`${base} ${v} ${className}`} {...props} />
}

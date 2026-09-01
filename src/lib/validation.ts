import { MAX_NAME, MAX_CITY, MAX_DISH, MAX_NOTE } from "./constants"
import type { FormState } from "../types/entry"

export type ValidationErrors = Partial<Record<keyof FormState, string>>

export function validateEntry(form: FormState): { valid: boolean; errors: ValidationErrors } {
  const e: ValidationErrors = {}
  if (!form.name.trim()) e.name = "Restaurant name is required"
  else if (form.name.trim().length > MAX_NAME) e.name = `Keep name under ${MAX_NAME} characters`
  if (!form.city.trim()) e.city = "City is required"
  else if (form.city.trim().length > MAX_CITY) e.city = `Keep city under ${MAX_CITY} characters`
  if (form.dish.length > MAX_DISH) e.dish = `Keep dish under ${MAX_DISH} characters`
  if (form.note.length > MAX_NOTE) e.note = `Keep note under ${MAX_NOTE} characters`
  if (form.status === "been_there" && !form.rating) e.rating = "Pick a rating for Been There"
  return { valid: Object.keys(e).length === 0, errors: e }
}

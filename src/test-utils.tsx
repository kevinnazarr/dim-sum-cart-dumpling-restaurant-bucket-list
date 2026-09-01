import { render as rtlRender } from '@testing-library/react'
import type { DimSumEntry } from './types'

export function makeEntry(overrides: Partial<DimSumEntry> = {}): DimSumEntry {
  return {
    id: Math.random().toString(36).slice(2,9),
    name: 'Test Restaurant',
    city: 'Test City',
    status: 'want_to_try',
    rating: null,
    dish: '',
    note: '',
    createdAt: Date.now(),
    ...overrides,
  }
}

export function resetStorage() {
  localStorage.clear()
}

export function seedStorage(entries: DimSumEntry[]) {
  localStorage.setItem('dimsum-cart:entries', JSON.stringify(entries))
}

export * from '@testing-library/react'
export { rtlRender as render }

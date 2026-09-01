import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
beforeEach(()=> localStorage.clear())

describe('SummaryBar', ()=>{
  it('shows correct counts', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    expect(screen.getByText(/total spots/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'S1')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    expect(screen.getByText(/been there/i)).toBeInTheDocument()
    expect(screen.getByText(/want to try/i)).toBeInTheDocument()
  })
  it('updates on change', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'S2')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    const dialog = await screen.findByRole('dialog')
    const { within } = await import('@testing-library/react')
    await within(dialog).getByRole('button', {name:/been there/i}).click()
    await user.click(screen.getByRole('radio', {name:/5 of 5 dumplings/}))
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    expect(await screen.findByText('S2')).toBeInTheDocument()
    expect(screen.getByText(/total spots/i)).toBeInTheDocument()
  })
})

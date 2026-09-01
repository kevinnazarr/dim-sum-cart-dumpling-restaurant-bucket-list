import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
beforeEach(()=> localStorage.clear())

describe('FilterBar', ()=>{
  it('renders All/Want/Been controls', async ()=>{
    render(<App/>)
    expect(screen.getByRole('button', {name:/^all$/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/want to try/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/been there/i})).toBeInTheDocument()
  })
  it('clicking calls filter change', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'F1')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    await user.click(screen.getByRole('button', {name:/been there/i}))
    expect(screen.getByRole('button', {name:/been there/i})).toHaveAttribute('aria-pressed','true')
  })
  it('active filter indicated via aria-pressed not just color', async ()=>{
    render(<App/>)
    expect(screen.getByRole('button', {name:/^all$/i})).toHaveAttribute('aria-pressed','true')
  })
  it('keyboard operable', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    const all = screen.getByRole('button', {name:/^all$/i})
    all.focus(); expect(all).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(all).toHaveAttribute('aria-pressed','true')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
beforeEach(()=> localStorage.clear())

describe('EmptyState', ()=>{
  it('zero entries shows no entries message + CTA', async ()=>{
    render(<App/>)
    expect(screen.getByText(/steamer basket is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/add your first restaurant/i})).toBeInTheDocument()
  })
  it('filtered to zero shows different message', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'OnlyWant')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    await user.click(screen.getByRole('button', {name:/been there/i}))
    expect(screen.getByText(/no spots marked.*been there/i)).toBeInTheDocument()
    expect(screen.queryByText(/steamer basket is empty/i)).not.toBeInTheDocument()
  })
})

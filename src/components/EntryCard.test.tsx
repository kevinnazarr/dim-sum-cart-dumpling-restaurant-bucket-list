import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
beforeEach(()=> localStorage.clear())

describe('EntryCard', ()=>{
  it('renders name city status dish note', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'CardTest')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.type(screen.getByLabelText(/must-order dish/i), 'Har gow')
    await user.type(screen.getByLabelText(/^note/i), 'nice')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    const card = (await screen.findByText('CardTest')).closest('article')!
    expect(within(card).getByText('HK')).toBeInTheDocument()
    expect(within(card).getByText(/har gow/i)).toBeInTheDocument()
    expect(within(card).getByText(/nice/)).toBeInTheDocument()
  })
  it('renders rating only for been_there', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'WantCard')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    const card = (await screen.findByText('WantCard')).closest('article')!
    expect(within(card).getByText(/no rating/i)).toBeInTheDocument()
    // add been
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'BeenCard')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/been there/i}))
    await user.click(screen.getByRole('radio', {name:/4 of 5 dumplings/}))
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    const beenCard = (await screen.findByText('BeenCard')).closest('article')!
    expect(within(beenCard).getByLabelText(/rating 4 of 5/i)).toBeInTheDocument()
  })
  it('Edit opens form prefilled', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'EditCard')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    await user.click(screen.getByRole('button', {name:/edit/i}))
    expect(screen.getByLabelText(/restaurant name/i)).toHaveValue('EditCard')
  })
  it('Delete needs confirmation', async ()=>{
    const user = userEvent.setup(); render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    await user.type(screen.getByLabelText(/restaurant name/i), 'DelCard')
    await user.type(screen.getByLabelText(/^city/i), 'HK')
    await user.click(screen.getByRole('button', {name:/^save$/i}))
    await user.click(screen.getByRole('button', {name:/delete/i}))
    expect(screen.getByText(/sure\?/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/^yes$/i})).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name:/^yes$/i}))
    expect(screen.queryByText('DelCard')).not.toBeInTheDocument()
  })
})

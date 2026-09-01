import { describe, it, expect } from "vitest"
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('RatingInput', ()=>{
  it('renders 5 dumpling icons', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getAllByRole('radio')).toHaveLength(5)
  })
  it('clicking 3rd calls onChange', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    const third = within(dialog).getByRole('radio', {name:/3 of 5 dumplings/})
    await user.click(third)
    expect(third).toHaveAttribute('aria-checked','true')
  })
  it('keyboard ArrowRight changes value', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    await within(dialog).getByRole('button', {name:/been there/i}).click()
    const first = within(dialog).getByRole('radio', {name:/1 of 5 dumplings/})
    await user.click(first)
    first.focus()
    await user.keyboard('{ArrowRight}')
    expect(within(dialog).getByRole('radio', {name:/2 of 5 dumplings/})).toHaveAttribute('aria-checked','true')
  })
  it('exposes value to assistive tech', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    await within(dialog).getByRole('button', {name:/been there/i}).click()
    await user.click(within(dialog).getByRole('radio', {name:/4 of 5 dumplings/}))
    expect(within(dialog).getByText(/4 of 5 dumplings/i)).toBeInTheDocument()
  })
})

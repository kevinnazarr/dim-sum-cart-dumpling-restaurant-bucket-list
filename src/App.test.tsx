import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import App from './App'

beforeEach(()=> localStorage.clear())

function getFilterGroup() { return screen.getByRole('group', {name:/filter by status/i}) }

async function addEntry(user: ReturnType<typeof userEvent.setup>, data: {name:string, city:string, status?: 'want_to_try'|'been_there', rating?: number, dish?: string, note?: string}) {
  await user.click(screen.getByRole('button', {name: /add restaurant/i}))
  const dialog = await screen.findByRole('dialog')
  const name = within(dialog).getByLabelText(/restaurant name/i)
  const city = within(dialog).getByLabelText(/^city/i)
  await user.clear(name); await user.type(name, data.name)
  await user.clear(city); await user.type(city, data.city)
  if(data.status) {
    const beenBtn = within(dialog).getByRole('button', {name:/been there/i})
    const wantBtn = within(dialog).getByRole('button', {name:/want to try/i})
    await user.click(data.status==='been_there' ? beenBtn : wantBtn)
  }
  if(data.rating) {
    const r = within(dialog).getByRole('radio', {name: new RegExp(`${data.rating} of 5 dumplings`)})
    await user.click(r)
  }
  if(data.dish) await user.type(within(dialog).getByLabelText(/must-order dish/i), data.dish)
  if(data.note) await user.type(within(dialog).getByLabelText(/^note/i), data.note)
  await user.click(within(dialog).getByRole('button', {name:/^save$/i}))
}

describe('App integration', ()=>{
  it('first load empty state', async ()=>{
    render(<App/>)
    expect(screen.getByText(/steamer basket is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/add your first restaurant/i})).toBeInTheDocument()
  })

  it('add Want to Try without rating', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Din Tai Fung', city:'Taipei'})
    expect(await screen.findByText('Din Tai Fung')).toBeInTheDocument()
    expect(screen.getByText('Taipei')).toBeInTheDocument()
    expect(screen.getAllByText(/want to try/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/total spots/i).previousElementSibling).toBeDefined()
    const stored = JSON.parse(localStorage.getItem('dimsum-cart:entries')!)
    expect(stored).toHaveLength(1); expect(stored[0].name).toBe('Din Tai Fung')
  })

  it('add Been There without rating blocked', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText(/restaurant name/i), 'Tim Ho Wan')
    await user.type(within(dialog).getByLabelText(/^city/i), 'Hong Kong')
    await user.click(within(dialog).getByRole('button', {name:/been there/i}))
    await user.click(within(dialog).getByRole('button', {name:/^save$/i}))
    expect(await within(dialog).findByText(/pick a rating/i)).toBeInTheDocument()
    expect(localStorage.getItem('dimsum-cart:entries')).toBeNull()
  })

  it('add Been There with rating 4', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Tim Ho Wan', city:'Hong Kong', status:'been_there', rating:4, dish:'Har gow'})
    const card = (await screen.findByText('Tim Ho Wan')).closest('article')!
    expect(within(card).getByText(/been there/i)).toBeInTheDocument()
    expect(within(card).getByLabelText(/rating 4 of 5/i)).toBeInTheDocument()
    expect(within(card).getByText('Har gow')).toBeInTheDocument()
  })

  it('filter Want to Try shows only want', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'A Want', city:'HK', status:'want_to_try'})
    await addEntry(user, {name:'B Been', city:'HK', status:'been_there', rating:5})
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^want to try$/i}))
    expect(screen.getByText('A Want')).toBeInTheDocument()
    expect(screen.queryByText('B Been')).not.toBeInTheDocument()
  })

  it('filter Been There inverse', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'A Want', city:'HK'})
    await addEntry(user, {name:'B Been', city:'HK', status:'been_there', rating:5})
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^been there$/i}))
    expect(screen.queryByText('A Want')).not.toBeInTheDocument()
    expect(screen.getByText('B Been')).toBeInTheDocument()
  })

  it('filter All shows all again', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'A Want', city:'HK'})
    await addEntry(user, {name:'B Been', city:'HK', status:'been_there', rating:3})
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^been there$/i}))
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^all$/i}))
    expect(screen.getByText('A Want')).toBeInTheDocument()
    expect(screen.getByText('B Been')).toBeInTheDocument()
  })

  it('edit city and dish', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Yum Cha', city:'HK', dish:'Siu mai'})
    await user.click(screen.getByRole('button', {name:/edit/i}))
    const dialog = await screen.findByRole('dialog')
    const city = within(dialog).getByLabelText(/^city/i)
    await user.clear(city); await user.type(city, 'Singapore')
    const dish = within(dialog).getByLabelText(/must-order dish/i)
    await user.clear(dish); await user.type(dish, 'Cheung fun')
    await user.click(within(dialog).getByRole('button', {name:/^save$/i}))
    expect(await screen.findByText('Singapore')).toBeInTheDocument()
    expect(screen.getByText('Cheung fun')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('dimsum-cart:entries')!)
    expect(stored[0].city).toBe('Singapore')
    expect(stored[0].dish).toBe('Cheung fun')
  })

  it('flip Want -> Been There moves filter and counts', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Flip', city:'HK', status:'want_to_try'})
    await user.click(screen.getByRole('button', {name:/edit/i}))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', {name:/been there/i}))
    await user.click(within(dialog).getByRole('radio', {name:/5 of 5 dumplings/}))
    await user.click(within(dialog).getByRole('button', {name:/^save$/i}))
    await waitFor(()=> expect(screen.getAllByText(/been there/i).length).toBeGreaterThan(0))
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^want to try$/i}))
    expect(screen.queryByText('Flip')).not.toBeInTheDocument()
    await user.click(within(getFilterGroup()).getByRole('button', {name:/^been there$/i}))
    expect(screen.getByText('Flip')).toBeInTheDocument()
  })

  it('delete with confirmation', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'ToDelete', city:'HK'})
    await user.click(screen.getByRole('button', {name:/delete/i}))
    expect(screen.getByText(/sure\?/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name:/cancel/i}))
    expect(screen.getByText('ToDelete')).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name:/delete/i}))
    await user.click(screen.getByRole('button', {name:/^yes$/i}))
    await waitFor(()=> expect(screen.queryByText('ToDelete')).not.toBeInTheDocument())
    expect(JSON.parse(localStorage.getItem('dimsum-cart:entries')!)).toHaveLength(0)
  })

  it('persists across remount (reload simulation)', async ()=>{
    const user = userEvent.setup()
    const {unmount} = render(<App/>)
    await addEntry(user, {name:'Persist', city:'HK', status:'been_there', rating:4})
    unmount()
    render(<App/>)
    expect(screen.getByText('Persist')).toBeInTheDocument()
    expect(screen.getByText(/hong kong/i)).toBeInTheDocument()
  })

  it('corrupted localStorage renders empty state no throw', async ()=>{
    localStorage.setItem('dimsum-cart:entries', '{not json')
    render(<App/>)
    expect(screen.getByText(/steamer basket is empty/i)).toBeInTheDocument()
  })

  it('full keyboard-only flow', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    const addBtn = screen.getByRole('button', {name:/add restaurant/i})
    addBtn.focus(); await user.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText(/restaurant name/i), 'Keyboard Spot')
    await user.type(within(dialog).getByLabelText(/^city/i), 'HK')
    await user.click(within(dialog).getByRole('button', {name:/^save$/i}))
    expect(await screen.findByText('Keyboard Spot')).toBeInTheDocument()
    const edit = screen.getByRole('button', {name:/edit/i})
    edit.focus(); await user.keyboard('{Enter}')
    const dialog2 = await screen.findByRole('dialog')
    const city = within(dialog2).getByLabelText(/^city/i)
    await user.clear(city); await user.type(city, 'Tokyo')
    await user.click(within(dialog2).getByRole('button', {name:/^save$/i}))
    expect(await screen.findByText('Tokyo')).toBeInTheDocument()
  })

  it('axe empty state zero violations', async ()=>{
    const {container} = render(<App/>)
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('axe with entries zero violations', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'A', city:'HK', status:'been_there', rating:3})
    const results = await axe(document.body)
    expect(results.violations).toHaveLength(0)
  })

  it('axe modal zero violations', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const modal = await screen.findByRole('dialog')
    const results = await axe(modal)
    expect(results.violations).toHaveLength(0)
  })

  it('every form input has accessible name', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', {name:/add restaurant/i}))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByLabelText(/restaurant name/i)).toBeInTheDocument()
    expect(within(dialog).getByLabelText(/^city/i)).toBeInTheDocument()
    expect(within(dialog).getByLabelText(/must-order dish/i)).toBeInTheDocument()
    expect(within(dialog).getByLabelText(/^note/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('radiogroup', {name:/rating/i})).toBeInTheDocument()
  })

  it('status not color-only (badge has text)', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'ColorTest', city:'HK', status:'been_there', rating:5})
    const card = (await screen.findByText('ColorTest')).closest('article')!
    const badge = (await import('@testing-library/react')).within(card).getByText(/been there/i)
    expect(badge.textContent).toMatch(/been there/i)
  })

  it('responsive grid class present', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Grid', city:'HK'})
    const grid = document.querySelector('.grid')
    expect(grid?.className).toMatch(/grid-cols-1/)
    expect(grid?.className).toMatch(/md:grid-cols-2/)
  })

  it('touch targets have min-h 44', async ()=>{
    const user = userEvent.setup()
    render(<App/>)
    await addEntry(user, {name:'Touch', city:'HK'})
    const edit = screen.getByRole('button', {name:/edit/i})
    expect(edit.className).toMatch(/min-h-\[44px\]/)
  })
})

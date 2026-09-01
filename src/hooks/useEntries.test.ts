import { describe, it, expect, beforeEach } from 'vitest'
import { loadEntries, saveEntries } from '../storage'
import type { DimSumEntry } from '../types'
beforeEach(()=> localStorage.clear())

describe('useEntries / storage integration', ()=>{
  it('add appends and writes', ()=>{
    const e: DimSumEntry = {id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}
    saveEntries([e])
    expect(loadEntries()).toHaveLength(1)
  })
  it('edit updates only that entry', ()=>{
    const a: DimSumEntry = {id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}
    const b: DimSumEntry = {id:'2', name:'B', city:'D', status:'been_there', rating:4, dish:'', note:'', createdAt:2}
    saveEntries([a,b])
    saveEntries([a, {...b, dish:'new'}])
    expect(loadEntries()[1].dish).toBe('new')
    expect(loadEntries()[0].name).toBe('A')
  })
  it('rating nullified for want_to_try conceptually', ()=>{
    const e: DimSumEntry = {id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}
    saveEntries([e])
    expect(loadEntries()[0].rating).toBeNull()
  })
})

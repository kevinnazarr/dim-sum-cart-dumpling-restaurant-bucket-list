import { describe, it, expect, beforeEach } from 'vitest'
import { loadEntries, saveEntries } from './storage'
import type { DimSumEntry } from './types'

beforeEach(()=> localStorage.clear())

describe('storage / persistence', ()=>{
  it('empty -> [] no throw', ()=> expect(loadEntries()).toEqual([]))
  it('invalid JSON -> [] no throw', ()=>{ localStorage.setItem('dimsum-cart:entries','{bad'); expect(loadEntries()).toEqual([]) })
  it('hydrates valid array exactly', ()=>{
    const e: DimSumEntry[] = [{id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}]
    localStorage.setItem('dimsum-cart:entries', JSON.stringify(e))
    expect(loadEntries()).toEqual(e)
  })
  it('filters invalid entries', ()=>{
    localStorage.setItem('dimsum-cart:entries', JSON.stringify([{id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1},{bad:true},{id:'2', name:'B', city:'D', status:'x'}]))
    expect(loadEntries()).toHaveLength(1)
  })
  it('add writes full array', ()=>{
    const e: DimSumEntry = {id:'a1', name:'Tim Ho Wan', city:'HK', status:'been_there', rating:5, dish:'Har gow', note:'', createdAt:Date.now()}
    expect(saveEntries([e])).toBe(true)
    expect(loadEntries()).toEqual([e])
  })
  it('edit leaves others untouched', ()=>{
    const a: DimSumEntry = {id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}
    const b: DimSumEntry = {id:'2', name:'B', city:'D', status:'been_there', rating:4, dish:'', note:'', createdAt:2}
    saveEntries([a,b])
    const edited = {...b, city:'NYC'}
    saveEntries([a, edited])
    const out = loadEntries()
    expect(out[0]).toEqual(a); expect(out[1].city).toBe('NYC')
  })
  it('delete removes', ()=>{
    const a: DimSumEntry = {id:'1', name:'A', city:'C', status:'want_to_try', rating:null, dish:'', note:'', createdAt:1}
    saveEntries([a]); saveEntries([]); expect(loadEntries()).toEqual([])
  })
  it('derived counts match array', ()=>{
    const entries: DimSumEntry[] = [{id:'1', name:'A', city:'C', status:'been_there', rating:5, dish:'', note:'', createdAt:1},{id:'2', name:'B', city:'D', status:'want_to_try', rating:null, dish:'', note:'', createdAt:2}]
    saveEntries(entries)
    const loaded = loadEntries()
    expect(loaded.filter(e=>e.status==='been_there')).toHaveLength(1)
    expect(loaded.filter(e=>e.status==='want_to_try')).toHaveLength(1)
  })
})

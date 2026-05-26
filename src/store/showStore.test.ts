import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useShowStore } from './showStore'
import type { TrackedShow } from '@/types/tvmaze'

const BASE_SHOW: TrackedShow = {
  id: 1,
  name: 'Breaking Bad',
  image: null,
  status: 'Ended',
  network: 'AMC',
  premiered: '2008-01-20',
  seasons: 5,
  nextEpDate: null,
  nextEpName: null,
  nextEpSeason: null,
  nextEpNum: null,
  myStatus: 'watching',
  added: 0,
}

beforeEach(() => {
  // Merge-update only — passing true (replace) would strip the action functions
  useShowStore.setState({ shows: [], statusMessage: 'READY', currentFilter: 'all' })
})

afterEach(() => {
  localStorage.clear()
})

describe('addShow', () => {
  it('prepends a show to the list', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    expect(useShowStore.getState().shows).toHaveLength(1)
    expect(useShowStore.getState().shows[0].name).toBe('Breaking Bad')
  })

  it('prepends so newest shows appear first', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    useShowStore.getState().addShow({ ...BASE_SHOW, id: 2, name: 'Severance' })
    expect(useShowStore.getState().shows[0].name).toBe('Severance')
  })
})

describe('removeShow', () => {
  it('removes the show with the given id', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    useShowStore.getState().removeShow(1)
    expect(useShowStore.getState().shows).toHaveLength(0)
  })

  it('leaves other shows intact', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    useShowStore.getState().addShow({ ...BASE_SHOW, id: 2, name: 'The Wire' })
    useShowStore.getState().removeShow(1)
    expect(useShowStore.getState().shows).toHaveLength(1)
    expect(useShowStore.getState().shows[0].name).toBe('The Wire')
  })
})

describe('cycleStatus', () => {
  it('cycles watching → waiting → dropped → watching', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    const { cycleStatus } = useShowStore.getState()

    cycleStatus(1)
    expect(useShowStore.getState().shows[0].myStatus).toBe('waiting')
    cycleStatus(1)
    expect(useShowStore.getState().shows[0].myStatus).toBe('dropped')
    cycleStatus(1)
    expect(useShowStore.getState().shows[0].myStatus).toBe('watching')
  })
})

describe('updateShow', () => {
  it('merges partial updates into the matching show', () => {
    useShowStore.getState().addShow(BASE_SHOW)
    useShowStore.getState().updateShow(1, { name: 'Better Call Saul', seasons: 6 })
    const show = useShowStore.getState().shows[0]
    expect(show.name).toBe('Better Call Saul')
    expect(show.seasons).toBe(6)
    expect(show.network).toBe('AMC') // unchanged
  })
})

describe('setStatus', () => {
  it('updates the status message', () => {
    useShowStore.getState().setStatus('SCANNING...')
    expect(useShowStore.getState().statusMessage).toBe('SCANNING...')
  })
})

describe('setFilter', () => {
  it('updates the current filter', () => {
    useShowStore.getState().setFilter('dropped')
    expect(useShowStore.getState().currentFilter).toBe('dropped')
  })
})

describe('setSortBy', () => {
  it('updates the sort order', () => {
    useShowStore.getState().setSortBy('airDate')
    expect(useShowStore.getState().sortBy).toBe('airDate')
  })

  it('cycles through all sort values', () => {
    const values = ['added', 'airDate', 'network', 'status'] as const
    for (const v of values) {
      useShowStore.getState().setSortBy(v)
      expect(useShowStore.getState().sortBy).toBe(v)
    }
  })
})

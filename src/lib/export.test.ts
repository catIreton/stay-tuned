import { describe, it, expect, vi } from 'vitest'
import { exportShowsAsJson, parseImportedShows } from './export'
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
  added: 1000,
  rating: null,
  notes: '',
  lastRefreshed: null,
}

describe('exportShowsAsJson', () => {
  it('triggers a JSON file download', () => {
    const clickSpy = vi.fn()
    const anchor = { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor)
    vi.spyOn(document.body, 'appendChild').mockReturnValueOnce(anchor)
    vi.spyOn(document.body, 'removeChild').mockReturnValueOnce(anchor)

    exportShowsAsJson([BASE_SHOW])

    expect(anchor.download).toMatch(/stay-tuned-.*\.json$/)
    expect(clickSpy).toHaveBeenCalled()
  })
})

describe('parseImportedShows', () => {
  it('parses a valid export payload', () => {
    const payload = JSON.stringify({ version: 2, shows: [BASE_SHOW] })
    const result = parseImportedShows(payload)
    expect(result).toHaveLength(1)
    expect(result![0].name).toBe('Breaking Bad')
  })

  it('returns null for malformed JSON', () => {
    expect(parseImportedShows('not json')).toBeNull()
  })

  it('returns null when shows array is missing', () => {
    expect(parseImportedShows(JSON.stringify({ version: 2 }))).toBeNull()
  })

  it('returns null when shows is not an array', () => {
    expect(parseImportedShows(JSON.stringify({ version: 2, shows: 'bad' }))).toBeNull()
  })

  it('filters out entries missing required fields', () => {
    const payload = JSON.stringify({
      version: 2,
      shows: [BASE_SHOW, { id: 'bad', name: 123 }],
    })
    const result = parseImportedShows(payload)
    expect(result).toHaveLength(1)
  })
})

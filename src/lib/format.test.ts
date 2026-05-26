import { describe, it, expect } from 'vitest'
import { formatAirDate, padEpisode, daysUntil, timeAgo } from './format'

describe('padEpisode', () => {
  it('pads single-digit numbers', () => expect(padEpisode(1)).toBe('01'))
  it('leaves two-digit numbers unchanged', () => expect(padEpisode(12)).toBe('12'))
  it('leaves three-digit numbers unchanged', () => expect(padEpisode(100)).toBe('100'))
})

describe('daysUntil', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]
    // Math.round returns -0 when called before midnight; Math.abs normalises it
    expect(Math.abs(daysUntil(today))).toBe(0)
  })

  it('returns a positive number for a future date', () => {
    const future = new Date(Date.now() + 5 * 86_400_000).toISOString().split('T')[0]
    expect(daysUntil(future)).toBeGreaterThan(0)
  })

  it('returns a negative number for a past date', () => {
    const past = new Date(Date.now() - 5 * 86_400_000).toISOString().split('T')[0]
    expect(daysUntil(past)).toBeLessThan(0)
  })
})

describe('formatAirDate', () => {
  it('returns null for null input', () => {
    expect(formatAirDate(null)).toBeNull()
  })

  it('returns airing variant and "AIRS TODAY!" for today', () => {
    const today = new Date().toISOString().split('T')[0]
    const result = formatAirDate(today)
    expect(result?.variant).toBe('airing')
    expect(result?.text).toBe('AIRS TODAY!')
  })

  it('returns airing variant for dates within 7 days', () => {
    const soon = new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0]
    const result = formatAirDate(soon)
    expect(result?.variant).toBe('airing')
    expect(result?.text).toMatch(/AIRS IN \d+D/)
  })

  it('returns default variant with NEXT: prefix for dates beyond 7 days', () => {
    const future = new Date(Date.now() + 30 * 86_400_000).toISOString().split('T')[0]
    const result = formatAirDate(future)
    expect(result?.variant).toBe('default')
    expect(result?.text).toMatch(/^NEXT:/)
  })

  it('returns default variant with AIRED prefix for past dates', () => {
    const past = new Date(Date.now() - 10 * 86_400_000).toISOString().split('T')[0]
    const result = formatAirDate(past)
    expect(result?.variant).toBe('default')
    expect(result?.text).toMatch(/^AIRED/)
  })
})

describe('timeAgo', () => {
  it('returns JUST NOW for very recent timestamps', () => {
    expect(timeAgo(Date.now() - 30_000)).toBe('JUST NOW')
  })

  it('returns minutes for timestamps under an hour', () => {
    expect(timeAgo(Date.now() - 5 * 60_000)).toBe('5M AGO')
  })

  it('returns hours for timestamps under a day', () => {
    expect(timeAgo(Date.now() - 3 * 3_600_000)).toBe('3H AGO')
  })

  it('returns days for timestamps under a week', () => {
    expect(timeAgo(Date.now() - 4 * 86_400_000)).toBe('4D AGO')
  })

  it('returns weeks for older timestamps', () => {
    expect(timeAgo(Date.now() - 14 * 86_400_000)).toBe('2W AGO')
  })
})

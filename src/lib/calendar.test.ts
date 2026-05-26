import { describe, it, expect } from 'vitest'
import {
  buildEventTitle,
  googleCalendarUrl,
  outlookCalendarUrl,
  generateIcs,
  mailtoReminderUrl,
} from './calendar'

describe('buildEventTitle', () => {
  it('formats a standard episode', () => {
    expect(buildEventTitle('Severance', 2, 5)).toBe('Severance S02E05')
  })

  it('appends SEASON PREMIERE for episode 1', () => {
    expect(buildEventTitle('The Bear', 3, 1)).toBe('The Bear S03E01 — SEASON PREMIERE')
  })

  it('returns just the show name when episode data is missing', () => {
    expect(buildEventTitle('Dark', null, null)).toBe('Dark')
  })
})

describe('googleCalendarUrl', () => {
  it('points to calendar.google.com', () => {
    const url = googleCalendarUrl('Breaking Bad S05E14', '2026-06-01', 'New episode')
    expect(url).toContain('calendar.google.com/calendar/render')
  })

  it('includes the date in YYYYMMDD format', () => {
    const url = googleCalendarUrl('Show', '2026-06-01', 'desc')
    expect(url).toContain('20260601')
  })

  it('includes the event title', () => {
    const url = googleCalendarUrl('The Wire', '2026-07-15', 'desc')
    expect(url).toContain('The+Wire')
  })
})

describe('outlookCalendarUrl', () => {
  it('points to outlook.live.com', () => {
    const url = outlookCalendarUrl('Succession', '2026-08-01', 'desc')
    expect(url).toContain('outlook.live.com')
  })

  it('includes ISO date string', () => {
    const url = outlookCalendarUrl('Show', '2026-08-01', 'desc')
    expect(url).toContain('2026-08-01')
  })
})

describe('generateIcs', () => {
  it('wraps content in VCALENDAR and VEVENT blocks', () => {
    const ics = generateIcs('Severance', '2026-06-01', 'New episode')
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('END:VCALENDAR')
  })

  it('sets the summary to the event title', () => {
    const ics = generateIcs('The Penguin', '2026-06-01', 'desc')
    expect(ics).toContain('SUMMARY:The Penguin')
  })

  it('uses all-day DATE format for DTSTART', () => {
    const ics = generateIcs('Show', '2026-06-01', 'desc')
    expect(ics).toContain('DTSTART;VALUE=DATE:20260601')
  })

  it('uses CRLF line endings', () => {
    const ics = generateIcs('Show', '2026-06-01', 'desc')
    expect(ics).toContain('\r\n')
  })
})

describe('mailtoReminderUrl', () => {
  it('starts with mailto:', () => {
    const url = mailtoReminderUrl('Silo', '2026-05-30', 'S02E01')
    expect(url).toMatch(/^mailto:/)
  })

  it('encodes the show name in the subject', () => {
    const url = mailtoReminderUrl('The Last of Us', '2026-06-15', '')
    expect(url).toContain(encodeURIComponent('The Last of Us'))
  })
})

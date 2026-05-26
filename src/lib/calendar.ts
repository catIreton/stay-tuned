import { padEpisode } from './format'

export function buildEventTitle(
  showName: string,
  epSeason: number | null,
  epNum: number | null
): string {
  const ep =
    epSeason && epNum ? ` S${padEpisode(epSeason)}E${padEpisode(epNum)}` : ''
  const tag = epNum === 1 ? ' — SEASON PREMIERE' : ''
  return `${showName}${ep}${tag}`
}

export function googleCalendarUrl(title: string, date: string, description: string): string {
  const d = date.replace(/-/g, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${d}/${d}`,
    details: description,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function outlookCalendarUrl(title: string, date: string, description: string): string {
  const params = new URLSearchParams({
    rru: 'addevent',
    startdt: date,
    enddt: date,
    subject: title,
    body: description,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`
}

export function generateIcs(title: string, date: string, description: string): string {
  const d = date.replace(/-/g, '')
  const uid = `${d}-${title.replace(/\s+/g, '-').toLowerCase()}@stay-tuned`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stay Tuned//TV Tracker//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${d}`,
    `DESCRIPTION:${description.replace(/,/g, '\\,')}`,
    `UID:${uid}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function mailtoReminderUrl(showName: string, date: string, epInfo: string): string {
  const subject = `Reminder: ${showName} airs on ${date}`
  const body = `Don't forget!\n\n${showName}${epInfo ? ` (${epInfo})` : ''} airs on ${date}.\n\nSent from Stay Tuned TV Tracker.`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

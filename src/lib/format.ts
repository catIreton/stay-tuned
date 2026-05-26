export interface FormattedDate {
  text: string
  variant: 'default' | 'airing' | 'ended'
}

export function formatAirDate(dateStr: string | null): FormattedDate | null {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((d.getTime() - Date.now()) / 86_400_000)
  const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

  if (diff < 0) return { text: 'AIRED ' + formatted, variant: 'default' }
  if (diff === 0) return { text: 'AIRS TODAY!', variant: 'airing' }
  if (diff <= 7) return { text: `AIRS IN ${diff}D — ${formatted}`, variant: 'airing' }
  return { text: 'NEXT: ' + formatted, variant: 'default' }
}

export function padEpisode(n: number): string {
  return String(n).padStart(2, '0')
}

export function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr + 'T00:00:00').getTime() - Date.now()) / 86_400_000)
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'JUST NOW'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}M AGO`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}H AGO`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}D AGO`
  return `${Math.floor(days / 7)}W AGO`
}

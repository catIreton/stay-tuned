import type { TrackedShow } from '@/types/tvmaze'

export function exportShowsAsJson(shows: TrackedShow[]): void {
  const payload = { version: 2, exported: new Date().toISOString(), shows }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `stay-tuned-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function parseImportedShows(jsonString: string): TrackedShow[] | null {
  try {
    const data: unknown = JSON.parse(jsonString)
    if (!data || typeof data !== 'object') return null
    const shows = (data as Record<string, unknown>).shows
    if (!Array.isArray(shows)) return null
    return shows.filter(
      (s): s is TrackedShow =>
        typeof s === 'object' && s !== null && 'id' in s && 'name' in s && 'myStatus' in s
    )
  } catch {
    return null
  }
}

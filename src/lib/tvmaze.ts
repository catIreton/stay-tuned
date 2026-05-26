import type { TVMazeEpisode, TVMazeSearchResult, TVMazeShow } from '@/types/tvmaze'

const BASE = 'https://api.tvmaze.com'

export async function searchShows(query: string): Promise<TVMazeSearchResult[]> {
  const res = await fetch(`${BASE}/search/shows?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function fetchShowWithNext(id: number): Promise<TVMazeShow> {
  const res = await fetch(`${BASE}/shows/${id}?embed=nextepisode`)
  if (!res.ok) throw new Error('Show fetch failed')
  return res.json()
}

export async function fetchShowEpisodes(id: number): Promise<TVMazeEpisode[]> {
  const res = await fetch(`${BASE}/shows/${id}/episodes`)
  if (!res.ok) throw new Error('Episodes fetch failed')
  return res.json()
}

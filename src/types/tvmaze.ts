export type WatchStatus = 'watching' | 'waiting' | 'dropped'
export type SortBy = 'added' | 'airDate' | 'network' | 'status'

export interface TVMazeNetwork {
  id: number
  name: string
}

export interface TVMazeImage {
  medium: string
  original: string
}

export interface TVMazeEpisode {
  id: number
  name: string
  season: number
  number: number
  airdate: string
}

export interface TVMazeShow {
  id: number
  name: string
  status: string
  premiered: string | null
  image: TVMazeImage | null
  network: TVMazeNetwork | null
  webChannel: TVMazeNetwork | null
  _embedded?: {
    nextepisode?: TVMazeEpisode
  }
}

export interface TVMazeSearchResult {
  score: number
  show: TVMazeShow
}

export interface TrackedShow {
  id: number
  name: string
  image: string | null
  status: string
  network: string
  premiered: string | null
  seasons: number | null
  nextEpDate: string | null
  nextEpName: string | null
  nextEpSeason: number | null
  nextEpNum: number | null
  myStatus: WatchStatus
  added: number
  // Phase 2 additions — optional so existing persisted shows migrate gracefully
  rating?: number | null
  notes?: string
  lastRefreshed?: number | null
}

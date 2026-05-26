import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrackedShow, WatchStatus, SortBy } from '@/types/tvmaze'

const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  watching: 'waiting',
  waiting: 'dropped',
  dropped: 'watching',
}

interface ShowState {
  shows: TrackedShow[]
  statusMessage: string
  currentFilter: WatchStatus | 'all'
  sortBy: SortBy
  addShow: (show: TrackedShow) => void
  removeShow: (id: number) => void
  cycleStatus: (id: number) => void
  updateShow: (id: number, updates: Partial<TrackedShow>) => void
  setStatus: (msg: string) => void
  setFilter: (filter: WatchStatus | 'all') => void
  setSortBy: (sortBy: SortBy) => void
}

export const useShowStore = create<ShowState>()(
  persist(
    (set) => ({
      shows: [],
      statusMessage: 'READY',
      currentFilter: 'all',
      sortBy: 'added',
      addShow: (show) => set((s) => ({ shows: [show, ...s.shows] })),
      removeShow: (id) => set((s) => ({ shows: s.shows.filter((show) => show.id !== id) })),
      cycleStatus: (id) =>
        set((s) => ({
          shows: s.shows.map((show) =>
            show.id === id ? { ...show, myStatus: STATUS_CYCLE[show.myStatus] } : show
          ),
        })),
      updateShow: (id, updates) =>
        set((s) => ({
          shows: s.shows.map((show) => (show.id === id ? { ...show, ...updates } : show)),
        })),
      setStatus: (msg) => set({ statusMessage: msg }),
      setFilter: (filter) => set({ currentFilter: filter }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    { name: 'tunedIn_shows_v2' }
  )
)

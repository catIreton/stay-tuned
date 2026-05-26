import { useMutation } from '@tanstack/react-query'

const ERR_DUPLICATE = 'ALREADY IN YOUR LIST'
import { fetchShowWithNext, fetchShowEpisodes } from '@/lib/tvmaze'
import { useShowStore } from '@/store/showStore'
import type { TrackedShow } from '@/types/tvmaze'

export function useAddShow() {
  const addShow = useShowStore((s) => s.addShow)
  const setStatus = useShowStore((s) => s.setStatus)

  return useMutation({
    mutationFn: async (id: number): Promise<TrackedShow> => {
      const currentShows = useShowStore.getState().shows
      if (currentShows.find((s) => s.id === id)) {
        throw new Error(ERR_DUPLICATE)
      }

      const [show, episodes] = await Promise.all([
        fetchShowWithNext(id),
        fetchShowEpisodes(id),
      ])

      const lastSeason = episodes.length > 0 ? episodes[episodes.length - 1].season : null
      const nextEp = show._embedded?.nextepisode

      return {
        id: show.id,
        name: show.name,
        image: show.image?.medium ?? null,
        status: show.status,
        network: show.network?.name ?? show.webChannel?.name ?? '',
        premiered: show.premiered,
        seasons: lastSeason,
        nextEpDate: nextEp?.airdate ?? null,
        nextEpName: nextEp?.name ?? null,
        nextEpSeason: nextEp?.season ?? null,
        nextEpNum: nextEp?.number ?? null,
        myStatus: 'watching',
        added: Date.now(),
        rating: null,
        notes: '',
        lastRefreshed: Date.now(),
      }
    },
    onMutate: () => setStatus('LOADING SHOW DATA...'),
    onSuccess: (show) => {
      addShow(show)
      setStatus('ADDED: ' + show.name.toUpperCase())
    },
    onError: (err: Error) => {
      setStatus(err.message === ERR_DUPLICATE ? err.message : 'SIGNAL ERROR — RETRY')
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { searchShows } from '@/lib/tvmaze'

export function useSearchShows(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchShows(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

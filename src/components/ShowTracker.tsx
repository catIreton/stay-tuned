'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useShowStore } from '@/store/showStore'
import { useSearchShows } from '@/hooks/useSearchShows'
import { useAddShow } from '@/hooks/useAddShow'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import AiringSoonBanner from './AiringSoonBanner'
import FilterTabs from './FilterTabs'
import ShowList from './ShowList'
import ToolBar from './ToolBar'
import StatusBar from './StatusBar'

export default function ShowTracker() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchAreaRef = useRef<HTMLDivElement>(null)

  const currentFilter = useShowStore((s) => s.currentFilter)
  const setFilter = useShowStore((s) => s.setFilter)
  const shows = useShowStore((s) => s.shows)

  const { data: searchResults = [], isFetching } = useSearchShows(searchQuery)
  const { mutate: addShow } = useAddShow()

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setSearchQuery('')
      return
    }
    debounceRef.current = setTimeout(() => setSearchQuery(value), 500)
  }, [])

  const handleSearchSubmit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchQuery(inputValue)
  }, [inputValue])

  const handleResultSelect = useCallback(() => {
    setInputValue('')
    setSearchQuery('')
    setActiveIndex(-1)
  }, [])

  const handleSelectShow = useCallback(
    (id: number) => {
      addShow(id)
      handleResultSelect()
    },
    [addShow, handleResultSelect]
  )

  const handleKeyboardNav = useCallback(
    (key: 'ArrowDown' | 'ArrowUp' | 'Escape' | 'Enter') => {
      const maxIndex = Math.min(searchResults.length, 6) - 1
      if (key === 'ArrowDown') setActiveIndex((i) => Math.min(i + 1, maxIndex))
      if (key === 'ArrowUp') setActiveIndex((i) => Math.max(i - 1, -1))
      if (key === 'Escape') handleResultSelect()
      if (key === 'Enter') {
        if (activeIndex >= 0 && searchResults[activeIndex]) {
          handleSelectShow(searchResults[activeIndex].show.id)
        } else {
          handleSearchSubmit()
        }
      }
    },
    [activeIndex, searchResults, handleSelectShow, handleSearchSubmit, handleResultSelect]
  )

  useEffect(() => {
    setActiveIndex(-1)
  }, [searchQuery])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchAreaRef.current && !searchAreaRef.current.contains(e.target as Node)) {
        handleResultSelect()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [handleResultSelect])

  const showResults = searchQuery.trim().length > 0

  return (
    <div
      className="bg-shell rounded-2xl p-7 pb-5 border-2 border-[#1a1510] shadow-[inset_0_2px_0_#3a3228] font-vt323 text-crt-green"
      role="main"
    >
      <h1 className="sr-only">Stay Tuned — Retro TV Show Tracker</h1>

      <div className="bg-screen-bg rounded-xl border-2 border-[#0d1a0d] p-4 min-h-[520px] scanlines">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-crt-green/45">
          <span className="font-vt323 text-3xl tracking-widest drop-shadow-[0_0_8px_#39ff14]">
            &#9654; STAY TUNED
          </span>
          <span className="bg-crt-green text-screen-bg font-vt323 text-xs px-1.5 py-0.5 rounded tracking-widest">
            TV TRACKER
          </span>
        </div>

        <div ref={searchAreaRef}>
          <SearchBar
            value={inputValue}
            onChange={handleInputChange}
            onSubmit={handleSearchSubmit}
            onKeyboardNav={handleKeyboardNav}
            isLoading={isFetching}
          />

          {showResults && (
            <SearchResults
              results={searchResults}
              isLoading={isFetching}
              activeIndex={activeIndex}
              onSelect={handleSelectShow}
            />
          )}
        </div>

        <AiringSoonBanner />

        <FilterTabs currentFilter={currentFilter} onFilter={setFilter} />

        {shows.length > 0 && <ToolBar />}

        <ShowList />

        <StatusBar />
      </div>
    </div>
  )
}

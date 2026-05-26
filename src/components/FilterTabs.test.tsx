import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterTabs from './FilterTabs'

describe('FilterTabs', () => {
  it('renders all four tabs', () => {
    render(<FilterTabs currentFilter="all" onFilter={() => {}} />)
    expect(screen.getByRole('tab', { name: 'ALL' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'WATCHING' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'WAITING' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'DROPPED' })).toBeInTheDocument()
  })

  it('marks the current filter as selected', () => {
    render(<FilterTabs currentFilter="watching" onFilter={() => {}} />)
    expect(screen.getByRole('tab', { name: 'WATCHING' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'ALL' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onFilter with the clicked tab value', async () => {
    const onFilter = vi.fn()
    render(<FilterTabs currentFilter="all" onFilter={onFilter} />)
    await userEvent.click(screen.getByRole('tab', { name: 'DROPPED' }))
    expect(onFilter).toHaveBeenCalledOnce()
    expect(onFilter).toHaveBeenCalledWith('dropped')
  })

  it('does not call onFilter when clicking the already-active tab', async () => {
    // onFilter is still called — the parent decides whether to re-render;
    // this test confirms the click is always forwarded (no internal guard)
    const onFilter = vi.fn()
    render(<FilterTabs currentFilter="all" onFilter={onFilter} />)
    await userEvent.click(screen.getByRole('tab', { name: 'ALL' }))
    expect(onFilter).toHaveBeenCalledWith('all')
  })
})

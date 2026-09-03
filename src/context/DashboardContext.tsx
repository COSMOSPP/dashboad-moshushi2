import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { defaultFilters, filterOptions } from '../mock/dashboard'
import type { FilterState } from '../types/dashboard'

interface DashboardContextValue {
  filters: FilterState
  draftFilters: FilterState
  options: typeof filterOptions
  setDraftFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  applyFilters: () => void
  resetFilters: () => void
  filterSummary: string[]
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

function readFilters(searchParams: URLSearchParams): FilterState {
  return {
    period: searchParams.get('period') || defaultFilters.period,
    className: searchParams.get('class') || defaultFilters.className,
    course: searchParams.get('course') || defaultFilters.course,
    institution: searchParams.get('institution') || defaultFilters.institution,
    startDate: searchParams.get('start') || defaultFilters.startDate,
    endDate: searchParams.get('end') || defaultFilters.endDate,
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => readFilters(searchParams))
  const [draftFilters, setDraftFilters] = useState<FilterState>(() => readFilters(searchParams))

  const syncToUrl = useCallback((next: FilterState) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('period', next.period)
    nextParams.set('class', next.className)
    nextParams.set('course', next.course)
    nextParams.set('institution', next.institution)
    nextParams.set('start', next.startDate)
    nextParams.set('end', next.endDate)
    nextParams.delete('state')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const setDraftFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const applyFilters = useCallback(() => {
    setFilters(draftFilters)
    syncToUrl(draftFilters)
  }, [draftFilters, syncToUrl])

  const resetFilters = useCallback(() => {
    setDraftFilters(defaultFilters)
    setFilters(defaultFilters)
    syncToUrl(defaultFilters)
  }, [syncToUrl])

  const filterSummary = useMemo(() => [
    filters.period,
    filters.course,
    filters.className,
  ].filter((value) => !value.startsWith('全部')), [filters])

  const value = useMemo(() => ({
    filters,
    draftFilters,
    options: filterOptions,
    setDraftFilter,
    applyFilters,
    resetFilters,
    filterSummary,
  }), [filters, draftFilters, setDraftFilter, applyFilters, resetFilters, filterSummary])

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboardContext must be used inside DashboardProvider')
  return context
}

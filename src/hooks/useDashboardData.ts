import { useCallback, useEffect, useRef, useState } from 'react'
import { dashboardService } from '../services/dashboard'
import type { DashboardData, FilterState, ViewState } from '../types/dashboard'

export function useDashboardData(filters: FilterState) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [viewState, setViewState] = useState<ViewState>('loading')
  const requestId = useRef(0)

  const load = useCallback(async (silent = false) => {
    const currentRequest = ++requestId.current
    if (!silent) setViewState('loading')
    try {
      const result = await dashboardService.getDashboard(filters)
      if (currentRequest !== requestId.current) return
      setData(result)
      setViewState(result ? 'normal' : 'empty')
    } catch {
      if (currentRequest !== requestId.current) return
      setViewState('error')
    }
  }, [filters])

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(true), 60_000)
    return () => window.clearInterval(timer)
  }, [load])

  return { data, viewState, reload: () => load(false) }
}

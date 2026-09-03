import { createDashboardData, filterOptions } from '../mock/dashboard'
import type { DashboardData, FilterOptions, FilterState } from '../types/dashboard'

const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration))

export const dashboardService = {
  async getFilterOptions(): Promise<FilterOptions> {
    await wait(180)
    return filterOptions
  },

  async getDashboard(filters: FilterState): Promise<DashboardData | null> {
    await wait(420)
    if (new URLSearchParams(window.location.search).get('state') === 'error') {
      throw new Error('dashboard_fetch_failed')
    }
    return createDashboardData(filters)
  },
}

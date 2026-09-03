import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardPanels } from '../components/dashboard/DashboardPanels'
import { KPIGrid } from '../components/dashboard/KPIGrid'
import { ResultFlow } from '../components/dashboard/ResultFlow'
import { ModuleState } from '../components/common/ModuleState'
import { DetailDrawer } from '../components/detail/DetailDrawer'
import { useDashboardContext } from '../context/DashboardContext'
import { useDashboardData } from '../hooks/useDashboardData'
import type { DrillContext, KPIItem } from '../types/dashboard'

function buildQuery(filters: ReturnType<typeof useDashboardContext>['filters']) {
  const params = new URLSearchParams({
    period: filters.period,
    class: filters.className,
    course: filters.course,
    institution: filters.institution,
    start: filters.startDate,
    end: filters.endDate,
  })
  return params.toString()
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { filters, resetFilters } = useDashboardContext()
  const { data, viewState, reload } = useDashboardData(filters)
  const [drawerContext, setDrawerContext] = useState<DrillContext | null>(null)

  const openDrawer = useCallback((context: DrillContext) => setDrawerContext(context), [])
  const drillKpi = (item: KPIItem) => {
    if (item.drill === 'students' && item.key === 'training') {
      navigate(`/students?${buildQuery(filters)}&status=在训`)
      return
    }
    if (item.drill === 'courses') {
      navigate(`/courses?${buildQuery(filters)}`)
      return
    }
    if (item.drill === 'teachers') {
      navigate(`/teachers?${buildQuery(filters)}`)
      return
    }
    openDrawer({ title: `${item.label}明细`, description: `${item.label}当前统计值 ${item.value.toLocaleString()}${item.unit}` })
  }

  return (
    <div className="dashboard-shell">
      <DashboardHeader updateTime={data?.updateTime ?? ''} refreshing={viewState === 'loading'} onRefresh={reload} />
      {viewState !== 'normal' || !data ? (
        <ModuleState state={viewState} onReset={resetFilters} onRetry={reload} />
      ) : (
        <>
          <KPIGrid items={data.kpis} onDrill={drillKpi} />
          <DashboardPanels data={data} onDrill={openDrawer} />
          <ResultFlow data={data} onDrill={(name) => openDrawer({ title: `${name}学员明细`, description: `培训成果链路 · ${name}阶段` })} />
          <DetailDrawer open={Boolean(drawerContext)} context={drawerContext} records={data.students} filters={filters} onClose={() => setDrawerContext(null)} />
        </>
      )}
    </div>
  )
}

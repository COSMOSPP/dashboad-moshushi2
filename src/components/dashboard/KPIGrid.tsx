import {
  Activity, Award, BadgeCheck, BookOpen, CalendarCheck, CircleCheckBig, GraduationCap,
  LayoutGrid, Star, UserPlus, ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon,
} from 'lucide-react'
import type { KPIItem } from '../../types/dashboard'

interface KPIGridProps {
  items: KPIItem[]
  onDrill: (item: KPIItem) => void
}

function formatValue(item: KPIItem) {
  return item.value.toLocaleString('zh-CN', {
    minimumFractionDigits: item.decimals ?? 0,
    maximumFractionDigits: item.decimals ?? 0,
  })
}

const kpiIcons: Record<string, LucideIcon> = {
  registered: UserPlus,
  training: Activity,
  classes: LayoutGrid,
  teachers: GraduationCap,
  courses: BookOpen,
  attendance: CalendarCheck,
  completion: CircleCheckBig,
  pass: BadgeCheck,
  rating: Star,
  works: Award,
}

const sparkHeights = [34, 47, 42, 61, 55, 74, 86]

export function KPIGrid({ items, onDrill }: KPIGridProps) {
  return (
    <section className="kpi-grid" aria-label="核心指标">
      {items.map((item, itemIndex) => {
        const TrendIcon = item.trend >= 0 ? ArrowUpRight : ArrowDownRight
        const MetricIcon = kpiIcons[item.key] ?? Activity
        return (
          <button className={`kpi-card tone-${item.tone}`} type="button" key={item.key} onClick={() => onDrill(item)}>
            <span className="kpi-accent" />
            <span className="kpi-topline"><i>{String(itemIndex + 1).padStart(2, '0')}</i><MetricIcon size={15} /></span>
            <span className="kpi-label">{item.label}<ArrowRight size={13} /></span>
            <span className="kpi-main"><strong>{formatValue(item)}</strong><small>{item.unit}</small></span>
            <span className="kpi-bottomline">
              <span className={`kpi-trend ${item.trend >= 0 ? 'up' : 'down'}`}><TrendIcon size={13} />{Math.abs(item.trend)}% <i>{item.trendLabel}</i></span>
              <span className="kpi-spark" aria-hidden="true">{sparkHeights.map((height, index) => <i key={index} style={{ height: `${Math.min(94, height + (itemIndex % 3) * 4)}%` }} />)}</span>
            </span>
          </button>
        )
      })}
    </section>
  )
}

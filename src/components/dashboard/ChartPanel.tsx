import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface ChartPanelProps {
  index: string
  title: string
  subtitle: string
  children: ReactNode
  className?: string
  onMore?: () => void
  extra?: ReactNode
}

export function ChartPanel({ index, title, subtitle, children, className = '', onMore, extra }: ChartPanelProps) {
  return (
    <section className={`chart-panel ${className}`}>
      <header className="panel-heading">
        <span className="panel-index">{index}</span>
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        {extra || (onMore && <button type="button" onClick={onMore}>查看明细<ArrowUpRight size={13} /></button>)}
      </header>
      <div className="panel-content">{children}</div>
    </section>
  )
}

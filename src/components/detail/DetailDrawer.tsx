import { BriefcaseBusiness, GraduationCap, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { DrillContext, FilterState, StudentRecord } from '../../types/dashboard'
import { DataTable } from './DataTable'

interface DetailDrawerProps {
  open: boolean
  context: DrillContext | null
  records: StudentRecord[]
  filters: FilterState
  onClose: () => void
}

export function DetailDrawer({ open, context, records, filters, onClose }: DetailDrawerProps) {
  const [selected, setSelected] = useState<StudentRecord | null>(null)
  const scopedRecords = useMemo(() => {
    if (!context?.dimension || !/^L(?:10|[1-9])$/.test(context.dimension)) return records
    return records.filter((record) => record.level === context.dimension)
  }, [context?.dimension, records])

  useEffect(() => {
    if (!open) setSelected(null)
    document.body.classList.toggle('drawer-open', open)
    return () => document.body.classList.remove('drawer-open')
  }, [open])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  if (!open || !context) return null

  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-mask" type="button" aria-label="关闭明细" onClick={onClose} />
      <aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header>
          <div><span className="drawer-eyebrow">数据下钻</span><h2 id="drawer-title">{context.title}</h2><p>{context.description}</p></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><X size={19} /></button>
        </header>
        <div className="drawer-filters"><span>当前筛选</span><b>{filters.period}</b><b>{filters.course}</b><b>{filters.className}</b>{context.dimension && <b>{context.dimension}</b>}</div>
        {selected && (
          <section className="student-detail">
            <button type="button" onClick={() => setSelected(null)} aria-label="关闭学员详情"><X size={14} /></button>
            <div className="student-avatar"><UserRound size={21} /></div>
            <div className="student-name"><strong>{selected.name}</strong><span>{selected.id} · {selected.gender} · {selected.age}岁 · {selected.level}</span></div>
            <div><GraduationCap size={15} /><span>{selected.course}<small>{selected.className}</small></span></div>
            <div><BriefcaseBusiness size={15} /><span>{selected.employment}<small>考试成绩 {selected.score} 分</small></span></div>
          </section>
        )}
        <DataTable records={scopedRecords} filters={filters} onSelect={setSelected} compact />
      </aside>
    </div>
  )
}

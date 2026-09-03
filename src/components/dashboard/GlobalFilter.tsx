import { RotateCcw, Search } from 'lucide-react'
import { useDashboardContext } from '../../context/DashboardContext'

interface SelectFieldProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

export function GlobalFilter() {
  const { draftFilters, options, setDraftFilter, applyFilters, resetFilters, filterSummary } = useDashboardContext()

  return (
    <section className="filter-bar" aria-label="全局筛选">
      <div className="filter-fields">
        <SelectField label="培训期次" value={draftFilters.period} options={options.periods} onChange={(value) => setDraftFilter('period', value)} />
        <SelectField label="培训班级" value={draftFilters.className} options={options.classes} onChange={(value) => setDraftFilter('className', value)} />
        <SelectField label="课程" value={draftFilters.course} options={options.courses} onChange={(value) => setDraftFilter('course', value)} />
        <SelectField label="培训机构" value={draftFilters.institution} options={options.institutions} onChange={(value) => setDraftFilter('institution', value)} />
        <label className="filter-field date-range">
          <span>时间范围</span>
          <div><input type="date" value={draftFilters.startDate} onChange={(event) => setDraftFilter('startDate', event.target.value)} /><i />
          <input type="date" value={draftFilters.endDate} onChange={(event) => setDraftFilter('endDate', event.target.value)} /></div>
        </label>
      </div>
      <div className="filter-actions">
        <div className="active-filter" title={filterSummary.join(' / ')}><span>当前条件</span><strong>{filterSummary.join(' / ') || '全部数据'}</strong></div>
        <button className="primary-button" type="button" onClick={applyFilters}><Search size={15} />查询</button>
        <button className="ghost-button" type="button" onClick={resetFilters}><RotateCcw size={15} />重置</button>
      </div>
    </section>
  )
}

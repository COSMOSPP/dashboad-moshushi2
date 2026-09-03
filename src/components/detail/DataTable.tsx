import { ChevronLeft, ChevronRight, ChevronsUpDown, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FilterState, StudentRecord } from '../../types/dashboard'
import { exportStudentRecords } from '../../utils/export'
import { ExportButton } from '../common/ExportButton'

type SortKey = 'name' | 'age' | 'attendanceRate' | 'completionRate' | 'score'

interface DataTableProps {
  records: StudentRecord[]
  filters: FilterState
  onSelect: (record: StudentRecord) => void
  compact?: boolean
}

export function DataTable({ records, filters, onSelect, compact = false }: DataTableProps) {
  const [keyword, setKeyword] = useState('')
  const [employment, setEmployment] = useState('全部状态')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [descending, setDescending] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = compact ? 6 : 10

  const filteredRecords = useMemo(() => {
    const result = records.filter((record) => {
      const matchesKeyword = !keyword || [record.name, record.className, record.course, record.institution].some((value) => value.includes(keyword))
      const matchesEmployment = employment === '全部状态' || record.employment === employment
      return matchesKeyword && matchesEmployment
    })
    return [...result].sort((left, right) => {
      const a = left[sortKey]
      const b = right[sortKey]
      const comparison = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'zh-CN')
      return descending ? -comparison : comparison
    })
  }, [records, keyword, employment, sortKey, descending])

  const pages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(page, pages)
  const visibleRecords = filteredRecords.slice((safePage - 1) * pageSize, safePage * pageSize)

  const sort = (key: SortKey) => {
    if (sortKey === key) setDescending((current) => !current)
    else {
      setSortKey(key)
      setDescending(true)
    }
  }

  return (
    <div className={`data-table-wrap ${compact ? 'compact' : ''}`}>
      <div className="table-toolbar">
        <label className="table-search"><Search size={15} /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1) }} placeholder="搜索姓名、班级或课程" /></label>
        <select value={employment} onChange={(event) => { setEmployment(event.target.value); setPage(1) }} aria-label="就业状态筛选">
          <option>全部状态</option><option>已就业</option><option>待就业</option><option>继续学习</option>
        </select>
        <span className="table-count">共 <strong>{filteredRecords.length}</strong> 条</span>
        <ExportButton onExport={(scope) => exportStudentRecords(scope === 'current' ? filteredRecords : records, filters, scope)} />
      </div>
      <div className="table-scroll" tabIndex={0} aria-label="学员培训明细表格">
        <table>
          <thead><tr>
            <th><button type="button" onClick={() => sort('name')}>姓名<ChevronsUpDown size={12} /></button></th>
            <th>班级 / 课程</th>
            <th><button type="button" onClick={() => sort('attendanceRate')}>出勤率<ChevronsUpDown size={12} /></button></th>
            <th><button type="button" onClick={() => sort('completionRate')}>完课率<ChevronsUpDown size={12} /></button></th>
            <th><button type="button" onClick={() => sort('score')}>成绩<ChevronsUpDown size={12} /></button></th>
            <th>就业状态</th><th>操作</th>
          </tr></thead>
          <tbody>
            {visibleRecords.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.name}</strong><small>{record.gender} · {record.age}岁</small></td>
                <td><strong>{record.className}</strong><small>{record.course}</small></td>
                <td><span className={record.attendanceRate < 90 ? 'warning-text' : ''}>{record.attendanceRate}%</span></td>
                <td>{record.completionRate}%</td><td>{record.score}</td>
                <td><span className={`status-tag status-${record.employment}`}>{record.employment}</span></td>
                <td><button className="table-action" type="button" onClick={() => onSelect(record)} aria-label={`查看${record.name}详情`}><Eye size={14} />查看</button></td>
              </tr>
            ))}
            {!visibleRecords.length && <tr><td colSpan={7} className="table-empty">暂无符合条件的数据</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>第 {safePage} / {pages} 页</span>
        <button type="button" aria-label="上一页" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={15} /></button>
        <button type="button" aria-label="下一页" disabled={safePage === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}><ChevronRight size={15} /></button>
      </div>
    </div>
  )
}

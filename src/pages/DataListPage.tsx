import { ArrowLeft, Building2, Database } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataTable } from '../components/detail/DataTable'
import { useDashboardContext } from '../context/DashboardContext'
import { useDashboardData } from '../hooks/useDashboardData'
import type { StudentRecord } from '../types/dashboard'

const titles: Record<string, { title: string; subtitle: string }> = {
  '/students': { title: '学员培训明细', subtitle: '学员报名、培训过程与就业结果' },
  '/courses': { title: '课程数据明细', subtitle: '课程学习、完课与评价数据' },
  '/teachers': { title: '师资授课明细', subtitle: '教师资质、授课负载与教学评价' },
  '/employment': { title: '就业成果明细', subtitle: '结业学员就业状态与就业去向' },
}

export function DataListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { filters } = useDashboardContext()
  const { data } = useDashboardData(filters)
  const [selected, setSelected] = useState<StudentRecord | null>(null)
  const pageMeta = titles[location.pathname] ?? titles['/students']
  const records = useMemo(() => {
    const status = new URLSearchParams(location.search).get('status')
    if (!data) return []
    return status ? data.students.filter((record) => record.status === status) : data.students
  }, [data, location.search])

  return (
    <div className="list-page">
      <header className="list-header">
        <button className="back-button" type="button" onClick={() => navigate(`/dashboard?${new URLSearchParams(location.search).toString()}`)}><ArrowLeft size={17} />返回驾驶舱</button>
        <div className="list-brand"><span><Building2 size={21} /></span><div><h1>{pageMeta.title}</h1><p>{pageMeta.subtitle}</p></div></div>
        <div className="list-scope"><Database size={15} /><span>数据范围</span><strong>市级全域</strong></div>
      </header>
      <main className="list-content">
        <div className="list-breadcrumb">领导驾驶舱 / <strong>{pageMeta.title}</strong></div>
        <section className="list-summary">
          <div><span>当前期次</span><strong>{filters.period}</strong></div><div><span>当前课程</span><strong>{filters.course}</strong></div><div><span>当前机构</span><strong>{filters.institution}</strong></div><div><span>结果数量</span><strong>{records.length.toLocaleString()} 条</strong></div>
        </section>
        <section className="list-table-panel"><DataTable records={records} filters={filters} onSelect={setSelected} /></section>
      </main>
      {selected && <div className="quick-detail"><button type="button" onClick={() => setSelected(null)}>×</button><span>学员详情</span><h2>{selected.name}</h2><p>{selected.id} · {selected.gender} · {selected.age}岁</p><dl><dt>培训课程</dt><dd>{selected.course}</dd><dt>所在班级</dt><dd>{selected.className}</dd><dt>出勤 / 完课</dt><dd>{selected.attendanceRate}% / {selected.completionRate}%</dd><dt>考试成绩</dt><dd>{selected.score} 分</dd><dt>就业状态</dt><dd>{selected.employment}</dd></dl></div>}
    </div>
  )
}

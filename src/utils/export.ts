import type { FilterState, StudentRecord } from '../types/dashboard'

const headers: Record<keyof Pick<StudentRecord, 'name' | 'gender' | 'age' | 'level' | 'className' | 'course' | 'institution' | 'attendanceRate' | 'completionRate' | 'score' | 'employment'>, string> = {
  name: '姓名', gender: '性别', age: '年龄', level: '学员等级', className: '班级', course: '课程', institution: '培训机构',
  attendanceRate: '出勤率', completionRate: '完课率', score: '考试成绩', employment: '就业状态',
}

export async function exportStudentRecords(records: StudentRecord[], filters: FilterState, scope: 'current' | 'all') {
  const XLSX = await import('xlsx')
  const rows = records.map((record) => Object.fromEntries(
    Object.entries(headers).map(([key, label]) => {
      const value = record[key as keyof StudentRecord]
      return [label, key.endsWith('Rate') ? `${value}%` : value]
    }),
  ))
  const sheet = XLSX.utils.json_to_sheet(rows)
  const filterSheet = XLSX.utils.aoa_to_sheet([
    ['筛选项', '当前条件'],
    ['培训期次', filters.period], ['培训班级', filters.className], ['课程', filters.course], ['培训机构', filters.institution],
    ['时间范围', `${filters.startDate} 至 ${filters.endDate}`], ['导出范围', scope === 'current' ? '当前筛选结果' : '全部数据'],
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, '学员明细')
  XLSX.utils.book_append_sheet(workbook, filterSheet, '筛选条件')
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const filename = `学员培训明细_${filters.period}_${date}.xlsx`
  const content = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const url = URL.createObjectURL(new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

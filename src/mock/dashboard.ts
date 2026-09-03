import type { DashboardData, FilterOptions, FilterState, KPIItem, StudentRecord } from '../types/dashboard'

export const filterOptions: FilterOptions = {
  periods: ['2026年第3期', '2026年第2期', '2026年第1期', '2025年第4期', '暂无数据期次'],
  classes: ['全部班级', 'AI应用提高班', '电商运营实训班', '数字媒体创作班', '智能制造技能班'],
  courses: ['全部课程', '人工智能应用', '电商运营', '短视频运营', '智能制造', '养老护理'],
  institutions: ['全部机构', '市职业技能培训中心', '新城职业学院', '产教融合实训基地', '数字人才培训中心'],
}

export const defaultFilters: FilterState = {
  period: '2026年第3期',
  className: '全部班级',
  course: '全部课程',
  institution: '全部机构',
  startDate: '2026-01-01',
  endDate: '2026-09-03',
}

const baseStudents: StudentRecord[] = [
  ['ST2026001', '李沐晨', '女', 27, 'AI应用提高班', '人工智能应用', '市职业技能培训中心', 98, 100, 94, '就业', '已就业'],
  ['ST2026002', '周启航', '男', 32, '电商运营实训班', '电商运营', '新城职业学院', 96, 100, 91, '通过', '待就业'],
  ['ST2026003', '陈雨桐', '女', 24, '数字媒体创作班', '短视频运营', '数字人才培训中心', 93, 96, 89, '完课', '继续学习'],
  ['ST2026004', '赵子谦', '男', 38, '智能制造技能班', '智能制造', '产教融合实训基地', 97, 100, 96, '就业', '已就业'],
  ['ST2026005', '孙若琳', '女', 29, 'AI应用提高班', '人工智能应用', '市职业技能培训中心', 91, 82, 84, '在训', '待就业'],
  ['ST2026006', '王思远', '男', 43, '电商运营实训班', '电商运营', '新城职业学院', 88, 76, 78, '在训', '待就业'],
  ['ST2026007', '刘知夏', '女', 35, '数字媒体创作班', '短视频运营', '数字人才培训中心', 99, 100, 97, '就业', '已就业'],
  ['ST2026008', '吴嘉树', '男', 22, '智能制造技能班', '智能制造', '产教融合实训基地', 95, 94, 90, '通过', '待就业'],
  ['ST2026009', '徐安然', '女', 47, '电商运营实训班', '养老护理', '新城职业学院', 92, 100, 88, '就业', '已就业'],
  ['ST2026010', '何景明', '男', 31, 'AI应用提高班', '人工智能应用', '市职业技能培训中心', 97, 98, 93, '通过', '待就业'],
  ['ST2026011', '高星澜', '女', 26, '数字媒体创作班', '短视频运营', '数字人才培训中心', 94, 87, 86, '在训', '待就业'],
  ['ST2026012', '林致远', '男', 41, '智能制造技能班', '智能制造', '产教融合实训基地', 90, 100, 85, '就业', '已就业'],
] .map((row) => ({
  id: row[0], name: row[1], gender: row[2], age: row[3], className: row[4], course: row[5],
  institution: row[6], attendanceRate: row[7], completionRate: row[8], score: row[9], status: row[10], employment: row[11],
})) as StudentRecord[]

const makeKpis = (factor: number): KPIItem[] => {
  const number = (value: number) => Math.round(value * factor)
  const rateAdjust = (value: number) => Math.min(99.9, Number((value + (factor - 1) * 5).toFixed(1)))
  return [
    { key: 'registered', label: '报名人数', value: number(12856), unit: '人', trend: 12.6, trendLabel: '较上期', tone: 'blue', drill: 'students' },
    { key: 'training', label: '在训人数', value: number(8632), unit: '人', trend: 8.2, trendLabel: '较上期', tone: 'cyan', drill: 'students' },
    { key: 'classes', label: '班级数', value: number(326), unit: '个', trend: 6.4, trendLabel: '较上期', tone: 'blue', drill: 'drawer' },
    { key: 'teachers', label: '师资数', value: number(486), unit: '人', trend: 4.1, trendLabel: '较上期', tone: 'amber', drill: 'teachers' },
    { key: 'courses', label: '课程数', value: number(182), unit: '门', trend: 5.7, trendLabel: '较上期', tone: 'cyan', drill: 'courses' },
    { key: 'attendance', label: '平均出勤率', value: rateAdjust(94.8), unit: '%', decimals: 1, trend: 1.8, trendLabel: '较上期', tone: 'green', drill: 'drawer' },
    { key: 'completion', label: '完课率', value: rateAdjust(87.6), unit: '%', decimals: 1, trend: 3.2, trendLabel: '较上期', tone: 'green', drill: 'drawer' },
    { key: 'pass', label: '通过率', value: rateAdjust(91.2), unit: '%', decimals: 1, trend: 2.6, trendLabel: '较上期', tone: 'green', drill: 'drawer' },
    { key: 'rating', label: '课程评价', value: Number((4.86 + (factor - 1) * 0.1).toFixed(2)), unit: '分', decimals: 2, trend: 0.12, trendLabel: '较上期', tone: 'amber', drill: 'drawer' },
    { key: 'works', label: '作品数量', value: number(8625), unit: '件', trend: 15.3, trendLabel: '较上期', tone: 'blue', drill: 'drawer' },
  ]
}

const factors: Record<string, number> = {
  '2026年第3期': 1,
  '2026年第2期': 0.91,
  '2026年第1期': 0.84,
  '2025年第4期': 0.76,
  '人工智能应用': 0.31,
  '电商运营': 0.24,
  '短视频运营': 0.19,
  '智能制造': 0.17,
  '养老护理': 0.13,
}

export function createDashboardData(filters: FilterState): DashboardData | null {
  if (filters.period === '暂无数据期次') return null
  let factor = factors[filters.period] ?? 1
  if (filters.course !== '全部课程') factor *= factors[filters.course] ?? 0.2
  if (filters.className !== '全部班级') factor *= 0.22
  if (filters.institution !== '全部机构') factor *= 0.36
  factor = Math.max(0.045, factor)

  const kpis = makeKpis(factor)
  const scale = (value: number) => Math.max(1, Math.round(value * factor))
  const students = baseStudents.filter((student) =>
    (filters.course === '全部课程' || student.course === filters.course)
    && (filters.className === '全部班级' || student.className === filters.className)
    && (filters.institution === '全部机构' || student.institution === filters.institution),
  )

  const studentProfiles: DashboardData['studentProfiles'] = {
    年龄: [
      { name: '18-25岁', value: 32, count: scale(4114) }, { name: '26-35岁', value: 41, count: scale(5271) },
      { name: '36-45岁', value: 19, count: scale(2443) }, { name: '46岁以上', value: 8, count: scale(1028) },
    ],
    学历: [
      { name: '本科及以上', value: 28, count: scale(3600) }, { name: '大专', value: 39, count: scale(5014) },
      { name: '高中/中职', value: 25, count: scale(3214) }, { name: '其他', value: 8, count: scale(1028) },
    ],
    性别: [
      { name: '女性', value: 53, count: scale(6814) }, { name: '男性', value: 47, count: scale(6042) },
    ],
    区域: [
      { name: '新城区', value: 31, count: scale(3985) }, { name: '开发区', value: 27, count: scale(3471) },
      { name: '临江区', value: 23, count: scale(2957) }, { name: '高新区', value: 19, count: scale(2443) },
    ],
  }

  return {
    kpis,
    trend: [
      ['1月', 1062, 726, 4.2], ['2月', 1188, 804, 6.1], ['3月', 1386, 946, 8.4],
      ['4月', 1512, 1038, 9.1], ['5月', 1694, 1142, 10.6], ['6月', 1858, 1269, 7.8],
      ['7月', 2014, 1451, 8.3], ['8月', 2186, 1632, 8.6], ['9月', 2354, 1810, 7.7],
    ].map(([month, registered, training, change]) => ({ month: String(month), registered: scale(Number(registered)), training: scale(Number(training)), change: Number(change) })),
    studentAge: studentProfiles.年龄,
    studentProfiles,
    courseRanking: [
      { id: 'C001', name: '人工智能应用', students: scale(1286), completionRate: 92.1, passRate: 94.2, rating: 4.92 },
      { id: 'C002', name: '电商运营', students: scale(1125), completionRate: 90.4, passRate: 92.6, rating: 4.89 },
      { id: 'C003', name: '短视频运营', students: scale(986), completionRate: 89.7, passRate: 91.8, rating: 4.87 },
      { id: 'C004', name: '智能制造', students: scale(842), completionRate: 88.5, passRate: 93.1, rating: 4.85 },
    ],
    teacherLevels: [
      { name: '高级', value: 86, count: scale(86) }, { name: '中级', value: 214, count: scale(214) }, { name: '初级', value: 186, count: scale(186) },
    ],
    teacherRanking: [
      { id: 'T001', name: '张文博', level: '高级', hours: 128, students: scale(286), rating: 4.96 },
      { id: 'T002', name: '宋佳宁', level: '高级', hours: 116, students: scale(254), rating: 4.94 },
      { id: 'T003', name: '韩志强', level: '中级', hours: 108, students: scale(238), rating: 4.92 },
    ],
    employmentDestinations: [
      { name: '企业就业', value: 48, count: scale(2316) }, { name: '灵活就业', value: 22, count: scale(1062) },
      { name: '自主创业', value: 18, count: scale(869) }, { name: '继续学习', value: 8, count: scale(386) },
      { name: '其他', value: 4, count: scale(193) },
    ],
    employmentIndustries: [
      { name: '互联网/信息技术', value: 1328, count: scale(1328) }, { name: '现代服务业', value: 1086, count: scale(1086) },
      { name: '电子商务', value: 964, count: scale(964) }, { name: '制造业', value: 818, count: scale(818) },
    ],
    flow: [
      { name: '报名', value: scale(12856) }, { name: '在训', value: scale(8632) }, { name: '完课', value: scale(6821) },
      { name: '通过', value: scale(6203) }, { name: '就业', value: scale(4826) },
    ],
    students: students.length ? students : baseStudents.slice(0, 5),
    completed: scale(6821),
    shouldComplete: scale(7787),
    passed: scale(6203),
    examined: scale(6803),
    graduates: scale(6203),
    employed: scale(4826),
    employmentRate: 77.8,
    updateTime: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
  }
}

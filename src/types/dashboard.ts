export type ViewState = 'loading' | 'normal' | 'empty' | 'error'

export interface FilterState {
  period: string
  className: string
  course: string
  institution: string
  startDate: string
  endDate: string
}

export interface FilterOptions {
  periods: string[]
  classes: string[]
  courses: string[]
  institutions: string[]
}

export interface KPIItem {
  key: string
  label: string
  value: number
  unit: string
  decimals?: number
  trend: number
  trendLabel: string
  tone: 'blue' | 'cyan' | 'green' | 'amber'
  drill: 'drawer' | 'students' | 'courses' | 'teachers' | 'employment'
}

export interface TrendPoint {
  month: string
  registered: number
  training: number
  change: number
}

export interface DistributionItem {
  name: string
  value: number
  count: number
}

export interface CourseRanking {
  id: string
  name: string
  students: number
  completionRate: number
  passRate: number
  rating: number
}

export interface TeacherRanking {
  id: string
  name: string
  level: string
  hours: number
  students: number
  rating: number
}

export type StudentLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10'

export interface StudentRecord {
  id: string
  name: string
  gender: '男' | '女'
  age: number
  level: StudentLevel
  className: string
  course: string
  institution: string
  attendanceRate: number
  completionRate: number
  score: number
  status: '报名' | '在训' | '完课' | '通过' | '就业'
  employment: '已就业' | '待就业' | '继续学习'
}

export interface DashboardData {
  kpis: KPIItem[]
  trend: TrendPoint[]
  studentAge: DistributionItem[]
  studentLevels: DistributionItem[]
  studentProfiles: Record<'年龄' | '学历' | '性别' | '区域', DistributionItem[]>
  courseRanking: CourseRanking[]
  teacherLevels: DistributionItem[]
  teacherRanking: TeacherRanking[]
  employmentDestinations: DistributionItem[]
  employmentIndustries: DistributionItem[]
  flow: Array<{ name: string; value: number }>
  students: StudentRecord[]
  completed: number
  shouldComplete: number
  passed: number
  examined: number
  graduates: number
  employed: number
  employmentRate: number
  updateTime: string
}

export interface DrillContext {
  title: string
  description: string
  dimension?: string
}

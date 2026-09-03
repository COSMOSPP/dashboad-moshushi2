import { BookOpenCheck, BriefcaseBusiness, CircleCheckBig, Pause, Play, Star, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { EChartsOption } from 'echarts'
import type { DashboardData, DrillContext } from '../../types/dashboard'
import { EChart } from '../charts/EChart'
import { ChartPanel } from './ChartPanel'

const axisLabel = { color: '#b0d1ed', fontSize: 10 }
const splitLine = { lineStyle: { color: 'rgba(171, 215, 250, 0.16)' } }
const tooltipBase = {
  backgroundColor: '#052b68',
  borderColor: '#5ca9eb',
  textStyle: { color: '#edf5ff', fontSize: 12 },
  extraCssText: 'box-shadow:0 12px 28px rgba(0,0,0,.35);border-radius:6px;',
}
const studentDimensions = ['年龄', '学历', '性别', '区域'] as const
const coursePageSize = 4
const teacherPageSize = 4

function shouldPauseMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useAutoCarousel(itemCount: number, pageSize: number, interval: number) {
  const pageCount = Math.max(1, Math.ceil(itemCount / pageSize))
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(shouldPauseMotion)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    setPage(0)
  }, [itemCount, pageSize])

  useEffect(() => {
    if (paused || interacting || pageCount <= 1) return
    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount)
    }, interval)
    return () => window.clearInterval(timer)
  }, [interacting, interval, pageCount, paused])

  return {
    page,
    pageCount,
    paused,
    setPage,
    setPaused,
    interactionProps: {
      onMouseEnter: () => setInteracting(true),
      onMouseLeave: () => setInteracting(false),
      onFocusCapture: () => setInteracting(true),
      onBlurCapture: () => setInteracting(false),
    },
  }
}

function getLevelStage(index: number) {
  if (index < 3) return '基础段'
  if (index < 7) return '进阶段'
  return '高阶段'
}

interface DashboardPanelsProps {
  data: DashboardData
  onDrill: (context: DrillContext) => void
}

export function DashboardPanels({ data, onDrill }: DashboardPanelsProps) {
  const studentCarousel = useAutoCarousel(studentDimensions.length, 1, 4_000)
  const courseCarousel = useAutoCarousel(data.courseRanking.length, coursePageSize, 3_400)
  const teacherCarousel = useAutoCarousel(data.teacherRanking.length, teacherPageSize, 3_200)
  const studentDimension = studentDimensions[studentCarousel.page] ?? '年龄'
  const activeStudentProfile = data.studentProfiles[studentDimension]
  const latestTrend = data.trend.at(-1) ?? data.trend[0]
  const trainingShare = latestTrend ? Math.round((latestTrend.training / latestTrend.registered) * 1000) / 10 : 0
  const studentLevelTotal = data.studentLevels.reduce((sum, item) => sum + item.count, 0)
  const dominantStudentLevel = data.studentLevels.reduce((largest, item) => item.count > largest.count ? item : largest, data.studentLevels[0])
  const visibleCourses = data.courseRanking.slice(courseCarousel.page * coursePageSize, (courseCarousel.page + 1) * coursePageSize)
  const visibleTeachers = data.teacherRanking.slice(teacherCarousel.page * teacherPageSize, (teacherCarousel.page + 1) * teacherPageSize)
  const averageCourseCompletion = data.courseRanking.length
    ? data.courseRanking.reduce((sum, course) => sum + course.completionRate, 0) / data.courseRanking.length
    : 0
  const averageTeacherRating = data.teacherRanking.length
    ? data.teacherRanking.reduce((sum, teacher) => sum + teacher.rating, 0) / data.teacherRanking.length
    : 0

  const trendOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    color: ['#6ec6ff', '#38dba5'],
    grid: { left: 42, right: 18, top: 28, bottom: 25 },
    legend: { top: 0, right: 6, itemWidth: 16, itemHeight: 7, textStyle: { color: '#a7b9cf', fontSize: 10 } },
    tooltip: {
      ...tooltipBase,
      trigger: 'axis',
      formatter: (params) => {
        const list = Array.isArray(params) ? params : [params]
        const point = data.trend[list[0]?.dataIndex ?? 0]
        return `<b>2026年${point.month}</b><br/><br/>${list.map((item) => `${item.marker}${item.seriesName}：<b>${Number(item.value).toLocaleString()}</b> 人`).join('<br/>')}<br/><span style="color:#20c997">较上月 ↑ ${point.change}%</span>`
      },
    },
    xAxis: { type: 'category', boundaryGap: false, data: data.trend.map((item) => item.month), axisLabel, axisLine: { lineStyle: { color: 'rgba(178, 219, 252, .35)' } }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel, splitLine },
    series: [
      { name: '报名人数', type: 'line', smooth: true, symbolSize: 5, data: data.trend.map((item) => item.registered), lineStyle: { width: 2 }, areaStyle: { color: 'rgba(110,198,255,.15)' } },
      { name: '在训人数', type: 'line', smooth: true, symbolSize: 5, data: data.trend.map((item) => item.training), lineStyle: { width: 2 }, areaStyle: { color: 'rgba(56,219,165,.10)' } },
    ],
  }), [data.trend])

  const studentLevelOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    grid: { left: 48, right: 18, top: 28, bottom: 28 },
    tooltip: {
      ...tooltipBase,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const item = Array.isArray(params) ? params[0] : params
        const source = data.studentLevels[item.dataIndex ?? 0]
        return `<b>${source.name} 学员等级</b><br/>等级阶段：${getLevelStage(item.dataIndex ?? 0)}<br/>学员人数：<b>${source.count.toLocaleString()}</b> 人<br/>人数占比：${source.value}%`
      },
    },
    xAxis: { type: 'category', data: data.studentLevels.map((item) => item.name), axisLabel: { ...axisLabel, color: '#c0d6e8' }, axisLine: { lineStyle: { color: 'rgba(178, 219, 252, .32)' } }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel, splitLine },
    series: [{
      name: '学员人数',
      type: 'bar',
      barMaxWidth: 28,
      data: data.studentLevels.map((item, index) => ({
        value: item.count,
        itemStyle: { color: index < 3 ? '#6ec6ff' : index < 7 ? '#38dba5' : '#ffc857', borderRadius: [3, 3, 0, 0] },
      })),
      label: { show: true, position: 'top', color: '#dceaf6', fontSize: 9, formatter: (params) => Number(params.value).toLocaleString() },
    }],
  }), [data.studentLevels])

  const ageOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    grid: { left: 58, right: 26, top: 8, bottom: 32 },
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const item = Array.isArray(params) ? params[0] : params
      const source = activeStudentProfile[item.dataIndex ?? 0]
      return `<b>${source.name}</b><br/>学员人数：${source.count.toLocaleString()} 人<br/>占比：${source.value}%`
    } },
    xAxis: { type: 'value', max: 50, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine },
    yAxis: { type: 'category', inverse: true, data: activeStudentProfile.map((item) => item.name), axisLabel: { ...axisLabel, color: '#afc1d7' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: activeStudentProfile.map((item, index) => ({ value: item.value, itemStyle: { color: ['#6ec6ff', '#38dba5', '#ffc857', '#b49cff'][index], borderRadius: [0, 3, 3, 0] } })), barWidth: 11, label: { show: true, position: 'right', formatter: '{c}%', color: '#edf8ff', fontSize: 10 } }],
  }), [activeStudentProfile])

  const employmentOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    grid: { left: 82, right: 24, top: 16, bottom: 36 },
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const item = Array.isArray(params) ? params[0] : params
      return `<b>${item.name}</b><br/>就业人数：${Number(item.value).toLocaleString()} 人`
    } },
    xAxis: { type: 'value', axisLabel, splitLine },
    yAxis: { type: 'category', inverse: true, data: data.employmentIndustries.map((item) => item.name), axisLabel: { ...axisLabel, color: '#afc1d7' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: data.employmentIndustries.map((item, index) => ({ value: item.count, itemStyle: { color: index === 0 ? '#38dba5' : '#6ec6ff', borderRadius: [0, 3, 3, 0] } })), barWidth: 10 }],
  }), [data.employmentIndustries])

  return (
    <main className="analysis-grid">
      <ChartPanel index="01" className="panel-trend" title="培训规模趋势" subtitle="报名与在训规模月度变化" onMore={() => onDrill({ title: '培训规模明细', description: '按月份查看报名与在训学员' })}>
        <div className="trend-layout">
          <div className="trend-summary">
            <span>本月报名<strong>{latestTrend?.registered.toLocaleString()}</strong><small>人</small></span>
            <span>本月在训<strong>{latestTrend?.training.toLocaleString()}</strong><small>人</small></span>
            <div><b>在训转化</b><strong>{trainingShare}%</strong><i><span style={{ width: `${trainingShare}%` }} /></i></div>
          </div>
          <EChart option={trendOption} ariaLabel="2026年1月至9月报名人数与在训人数趋势折线图" onPointClick={(name, series) => onDrill({ title: `${name}${series}明细`, description: `查看2026年${name}的${series}`, dimension: name })} />
        </div>
      </ChartPanel>

      <ChartPanel index="02" className="panel-employment" title="就业成果" subtitle="就业规模、就业率与重点流向行业" onMore={() => onDrill({ title: '就业成果明细', description: '查看就业人员与就业去向' })}>
        <div className="employment-layout">
          <div className="employment-summary">
            <BriefcaseBusiness size={20} />
            <button className="employment-metric" type="button" onClick={() => onDrill({ title: '就业人员明细', description: `当前就业人数 ${data.employed.toLocaleString()} 人` })}><span>就业人数</span><strong>{data.employed.toLocaleString()}<small>人</small></strong></button>
            <button className="employment-metric" type="button" onClick={() => onDrill({ title: '就业率明细', description: `当前就业率 ${data.employmentRate}%` })}><span>就业率</span><strong>{data.employmentRate}<small>%</small></strong></button>
            <div className="destination-mini">
              {data.employmentDestinations.slice(0, 3).map((item) => <button type="button" key={item.name} onClick={() => onDrill({ title: `${item.name}明细`, description: `就业去向：${item.name}` })}><span>{item.name}</span><b>{item.value}%</b></button>)}
            </div>
          </div>
          <EChart option={employmentOption} ariaLabel="重点就业行业人数横向柱状图" onPointClick={(name) => onDrill({ title: `${name}就业明细`, description: `就业行业：${name}` })} />
        </div>
      </ChartPanel>

      <ChartPanel index="03" className="panel-completion" title="学员等级" subtitle="L1-L10 各等级学员数量分布" onMore={() => onDrill({ title: '学员等级明细', description: '按等级查看学员数量与占比' })}>
        <div className="level-layout">
          <div className="level-summary">
            <span><UsersRound size={14} /><small>学员总量</small><strong>{studentLevelTotal.toLocaleString()}</strong></span>
            <span><small>人数最多</small><strong>{dominantStudentLevel.name} · {dominantStudentLevel.count.toLocaleString()}</strong></span>
            <div className="level-legend"><i className="is-basic" />L1-L3<i className="is-progress" />L4-L7<i className="is-advanced" />L8-L10</div>
          </div>
          <EChart option={studentLevelOption} ariaLabel={`L1至L10学员等级数量柱状图，共${studentLevelTotal.toLocaleString()}人`} onPointClick={(name) => onDrill({ title: `${name}等级学员明细`, description: `学员等级：${name}`, dimension: name })} />
        </div>
      </ChartPanel>

      <ChartPanel
        index="04"
        className="panel-quality"
        title="课程质量分析"
        subtitle="课程学习表现 · TOP10 自动轮播"
        onMore={() => onDrill({ title: '课程质量明细', description: '按课程查看学习与评价数据' })}
      >
        <div className="quality-layout" {...courseCarousel.interactionProps}>
          <div className="course-rank-summary">
            <span><BookOpenCheck size={14} /><small>上榜课程</small><strong>{data.courseRanking.length}</strong></span>
            <span><CircleCheckBig size={13} /><small>平均完课率</small><strong>{averageCourseCompletion.toFixed(1)}%</strong></span>
            <i>{String(courseCarousel.page + 1).padStart(2, '0')} / {String(courseCarousel.pageCount).padStart(2, '0')}</i>
            <button type="button" aria-label={courseCarousel.paused ? '继续课程榜轮播' : '暂停课程榜轮播'} title={courseCarousel.paused ? '继续轮播' : '暂停轮播'} onClick={() => courseCarousel.setPaused((current) => !current)}>{courseCarousel.paused ? <Play size={13} /> : <Pause size={13} />}</button>
          </div>
          <div className="ranking-head"><span>排名 / 课程</span><span>学习人数</span><span>完课率</span><span>评价</span></div>
          <div className="ranking-viewport" aria-label="课程质量排行榜">
            <div className="ranking-list" key={courseCarousel.page}>
              {visibleCourses.map((course, index) => {
                const rank = courseCarousel.page * coursePageSize + index + 1
                return <button type="button" key={course.id} onClick={() => onDrill({ title: `${course.name}课程明细`, description: `完课率 ${course.completionRate}% · 通过率 ${course.passRate}%` })}>
                  <span><i className={rank <= 3 ? `top-${rank}` : ''}>{String(rank).padStart(2, '0')}</i><strong>{course.name}</strong></span><em>{course.students.toLocaleString()}<small>人</small></em><em>{course.completionRate}<small>%</small></em><b>{course.rating}<small>分</small></b>
                </button>
              })}
            </div>
          </div>
        </div>
      </ChartPanel>

      <ChartPanel index="05" className="panel-teachers" title="师资排行榜" subtitle="按教学评价排序 · 授课数据自动轮播" onMore={() => onDrill({ title: '师资排行榜明细', description: '查看师资授课负载与教学评价' })}>
        <div className="teacher-ranking-layout" {...teacherCarousel.interactionProps}>
          <div className="teacher-rank-summary">
            <span><UsersRound size={14} /><small>参评师资</small><strong>{data.kpis[3].value.toLocaleString()}</strong></span>
            <span><Star size={13} /><small>榜单均分</small><strong>{averageTeacherRating.toFixed(2)}</strong></span>
            <i>{String(teacherCarousel.page + 1).padStart(2, '0')} / {String(teacherCarousel.pageCount).padStart(2, '0')}</i>
            <button type="button" aria-label={teacherCarousel.paused ? '继续师资榜轮播' : '暂停师资榜轮播'} title={teacherCarousel.paused ? '继续轮播' : '暂停轮播'} onClick={() => teacherCarousel.setPaused((current) => !current)}>{teacherCarousel.paused ? <Play size={13} /> : <Pause size={13} />}</button>
          </div>
          <div className="teacher-rank-head"><span>排名 / 教师</span><span>授课学时</span><span>学员</span><span>评分</span></div>
          <div className="teacher-rank-viewport" aria-label="师资授课评价排行榜">
            <div className="teacher-rank-list" key={teacherCarousel.page}>
              {visibleTeachers.map((teacher, index) => {
                const rank = teacherCarousel.page * teacherPageSize + index + 1
                return <button type="button" key={teacher.id} onClick={() => onDrill({ title: `${teacher.name}授课详情`, description: `${teacher.level}教师 · ${teacher.hours} 学时 · ${teacher.students} 名学员` })}><span className="teacher-identity"><i className={rank <= 3 ? `top-${rank}` : ''}>{String(rank).padStart(2, '0')}</i><span><strong>{teacher.name}</strong><small>{teacher.level}</small></span></span><em>{teacher.hours}<small>h</small></em><em>{teacher.students.toLocaleString()}<small>人</small></em><b>{teacher.rating}<small>分</small></b></button>
              })}
            </div>
          </div>
        </div>
      </ChartPanel>

      <ChartPanel
        index="06"
        className="panel-students"
        title="学员培训分析"
        subtitle="年龄、学历、性别、区域自动轮播"
        onMore={() => onDrill({ title: '学员结构明细', description: `${studentDimension}维度学员分析` })}
        extra={
          <div className="panel-switcher" {...studentCarousel.interactionProps}>
            <div className="panel-tabs" role="tablist">{studentDimensions.map((item, index) => <button type="button" role="tab" aria-selected={studentDimension === item} className={studentDimension === item ? 'active' : ''} key={item} onClick={() => studentCarousel.setPage(index)}>{item}</button>)}</div>
            <button className="panel-cycle-toggle" type="button" aria-label={studentCarousel.paused ? '继续学员结构轮播' : '暂停学员结构轮播'} title={studentCarousel.paused ? '继续轮播' : '暂停轮播'} onClick={() => studentCarousel.setPaused((current) => !current)}>{studentCarousel.paused ? <Play size={12} /> : <Pause size={12} />}</button>
          </div>
        }
      >
        <div className="student-layout" {...studentCarousel.interactionProps}>
          <EChart option={ageOption} ariaLabel={`学员${studentDimension}人数占比横向柱状图`} onPointClick={(name) => onDrill({ title: `${name}学员明细`, description: `筛选${studentDimension}为${name}的学员`, dimension: name })} />
          <div className="flow-mini" aria-label="培训状态漏斗">
            {data.flow.map((item, index) => <button type="button" key={item.name} style={{ width: `${100 - index * 8}%` }} onClick={() => onDrill({ title: `${item.name}学员明细`, description: `培训状态：${item.name}` })}><span>{item.name}</span><strong>{item.value.toLocaleString()}</strong></button>)}
          </div>
        </div>
      </ChartPanel>
    </main>
  )
}

import { BriefcaseBusiness, Star, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
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

interface DashboardPanelsProps {
  data: DashboardData
  onDrill: (context: DrillContext) => void
}

export function DashboardPanels({ data, onDrill }: DashboardPanelsProps) {
  const dimensions = ['年龄', '学历', '性别', '区域'] as const
  const [studentDimension, setStudentDimension] = useState<(typeof dimensions)[number]>('年龄')
  const activeStudentProfile = data.studentProfiles[studentDimension]
  const completionRate = data.kpis.find((item) => item.key === 'completion')?.value ?? 0
  const passRate = data.kpis.find((item) => item.key === 'pass')?.value ?? 0
  const courseRating = data.kpis.find((item) => item.key === 'rating')?.value ?? 0
  const latestTrend = data.trend.at(-1) ?? data.trend[0]
  const trainingShare = latestTrend ? Math.round((latestTrend.training / latestTrend.registered) * 1000) / 10 : 0

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

  const completionOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    tooltip: { ...tooltipBase, trigger: 'item', formatter: '{b}<br/>{c}%' },
    series: [
      {
        name: '完课率', type: 'pie', radius: ['57%', '72%'], center: ['27%', '53%'], silent: false,
        label: { show: true, position: 'center', formatter: `{value|${completionRate.toFixed(1)}%}\n{name|完课率}`, rich: { value: { color: '#f3f7ff', fontSize: 22, fontWeight: 700, lineHeight: 27 }, name: { color: '#8fa6c2', fontSize: 11, lineHeight: 19 } } },
        data: [{ value: completionRate, name: '已完课', itemStyle: { color: '#6ec6ff' } }, { value: 100 - completionRate, name: '未完课', itemStyle: { color: 'rgba(3,37,91,.52)' }, label: { show: false } }],
      },
      {
        name: '通过率', type: 'pie', radius: ['57%', '72%'], center: ['73%', '53%'],
        label: { show: true, position: 'center', formatter: `{value|${passRate.toFixed(1)}%}\n{name|通过率}`, rich: { value: { color: '#f3f7ff', fontSize: 22, fontWeight: 700, lineHeight: 27 }, name: { color: '#8fa6c2', fontSize: 11, lineHeight: 19 } } },
        data: [{ value: passRate, name: '已通过', itemStyle: { color: '#38dba5' } }, { value: 100 - passRate, name: '未通过', itemStyle: { color: 'rgba(3,37,91,.52)' }, label: { show: false } }],
      },
    ],
  }), [completionRate, passRate])

  const ageOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    grid: { left: 58, right: 26, top: 8, bottom: 12 },
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const item = Array.isArray(params) ? params[0] : params
      const source = activeStudentProfile[item.dataIndex ?? 0]
      return `<b>${source.name}</b><br/>学员人数：${source.count.toLocaleString()} 人<br/>占比：${source.value}%`
    } },
    xAxis: { type: 'value', max: 50, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine },
    yAxis: { type: 'category', inverse: true, data: activeStudentProfile.map((item) => item.name), axisLabel: { ...axisLabel, color: '#afc1d7' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: activeStudentProfile.map((item, index) => ({ value: item.value, itemStyle: { color: ['#6ec6ff', '#38dba5', '#ffc857', '#b49cff'][index], borderRadius: [0, 3, 3, 0] } })), barWidth: 11, label: { show: true, position: 'right', formatter: '{c}%', color: '#edf8ff', fontSize: 10 } }],
  }), [activeStudentProfile])

  const teacherOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    tooltip: { ...tooltipBase, trigger: 'item', formatter: (params) => {
      const item = Array.isArray(params) ? params[0] : params
      return `${item.name}<br/>${Number(item.value).toLocaleString()} 人`
    } },
    color: ['#ffc857', '#6ec6ff', '#38dba5'],
    series: [{
      type: 'pie', radius: ['53%', '72%'], center: ['50%', '50%'],
      label: { show: false }, emphasis: { scaleSize: 4 },
      data: data.teacherLevels.map((item) => ({ name: item.name, value: item.count })),
    }],
  }), [data.teacherLevels])

  const employmentOption = useMemo<EChartsOption>(() => ({
    animationDuration: 420,
    grid: { left: 78, right: 25, top: 8, bottom: 14 },
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
      const item = Array.isArray(params) ? params[0] : params
      return `<b>${item.name}</b><br/>就业人数：${Number(item.value).toLocaleString()} 人`
    } },
    xAxis: { type: 'value', axisLabel, splitLine },
    yAxis: { type: 'category', inverse: true, data: data.employmentIndustries.map((item) => item.name), axisLabel: { ...axisLabel, color: '#afc1d7' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: data.employmentIndustries.map((item, index) => ({ value: item.count, itemStyle: { color: index === 0 ? '#38dba5' : '#6ec6ff', borderRadius: [0, 3, 3, 0] } })), barWidth: 9 }],
  }), [data.employmentIndustries])

  return (
    <main className="analysis-grid">
      <ChartPanel index="01" className="panel-trend" title="培训规模趋势" subtitle="报名与在训规模月度变化" onMore={() => onDrill({ title: '培训规模明细', description: '按月份查看报名与在训学员' })}>
        <div className="trend-layout">
          <div className="trend-summary">
            <span>本月报名<strong>{latestTrend?.registered.toLocaleString()}</strong><small>人</small></span>
            <span>本月在训<strong>{latestTrend?.training.toLocaleString()}</strong><small>人</small></span>
            <div><b>在训转化</b><strong>{trainingShare}%</strong><i><span style={{ width: `${trainingShare}%` }} /></i></div>
            <p>规模连续 9 个月增长，当前培训承载能力稳定</p>
          </div>
          <EChart option={trendOption} ariaLabel="2026年1月至9月报名人数与在训人数趋势折线图" onPointClick={(name, series) => onDrill({ title: `${name}${series}明细`, description: `查看2026年${name}的${series}`, dimension: name })} />
        </div>
      </ChartPanel>

      <ChartPanel index="02" className="panel-completion" title="培训完成情况" subtitle="从应完课到考试通过的转化质量" onMore={() => onDrill({ title: '培训完成明细', description: '完课与通过学员统计' })}>
        <div className="completion-layout">
          <EChart option={completionOption} ariaLabel="完课率87.6%，通过率91.2%的双环形图" className="completion-chart" onPointClick={(name) => onDrill({ title: `${name}学员明细`, description: '培训完成情况下钻' })} />
          <div className="completion-meta"><span>完课 <b>{data.completed.toLocaleString()}</b> / {data.shouldComplete.toLocaleString()}</span><i /><span>通过 <b>{data.passed.toLocaleString()}</b> / {data.examined.toLocaleString()}</span></div>
        </div>
      </ChartPanel>

      <ChartPanel
        index="03"
        className="panel-students"
        title="学员培训分析"
        subtitle="人群结构与关键年龄段分布"
        onMore={() => onDrill({ title: '学员结构明细', description: `${studentDimension}维度学员分析` })}
        extra={<div className="panel-tabs" role="tablist">{dimensions.map((item) => <button type="button" role="tab" aria-selected={studentDimension === item} className={studentDimension === item ? 'active' : ''} key={item} onClick={() => setStudentDimension(item)}>{item}</button>)}</div>}
      >
        <div className="student-layout">
          <EChart option={ageOption} ariaLabel={`学员${studentDimension}人数占比横向柱状图`} onPointClick={(name) => onDrill({ title: `${name}学员明细`, description: `筛选${studentDimension}为${name}的学员`, dimension: name })} />
          <div className="flow-mini" aria-label="培训状态漏斗">
            {data.flow.map((item, index) => <button type="button" key={item.name} style={{ width: `${100 - index * 8}%` }} onClick={() => onDrill({ title: `${item.name}学员明细`, description: `培训状态：${item.name}` })}><span>{item.name}</span><strong>{item.value.toLocaleString()}</strong></button>)}
          </div>
        </div>
      </ChartPanel>

      <ChartPanel index="04" className="panel-quality" title="课程质量分析" subtitle={`综合评价 ${courseRating.toFixed(2)} · 重点课程表现`} onMore={() => onDrill({ title: '课程质量明细', description: '按课程查看学习与评价数据' })}>
        <div className="quality-layout">
          <div className="score-block"><span>综合评分</span><strong>{courseRating.toFixed(2)}</strong><div aria-label="五星评价">★★★★★</div><small><Star size={11} fill="currentColor" />评价覆盖率 96.4%</small></div>
          <div className="ranking-table">
            <div className="ranking-head"><span>课程</span><span>学习人数</span><span>完课率</span><span>评价</span></div>
            {data.courseRanking.slice(0, 4).map((course, index) => (
              <button type="button" key={course.id} onClick={() => onDrill({ title: `${course.name}课程明细`, description: `完课率 ${course.completionRate}% · 通过率 ${course.passRate}%` })}>
                <span><i>{String(index + 1).padStart(2, '0')}</i>{course.name}</span><span>{course.students.toLocaleString()}</span><span>{course.completionRate}%</span><b>{course.rating}</b>
              </button>
            ))}
          </div>
        </div>
      </ChartPanel>

      <ChartPanel index="05" className="panel-teachers" title="师资情况" subtitle="师资结构、授课负载与教学评价" onMore={() => onDrill({ title: '师资明细', description: '查看师资等级与授课情况' })}>
        <div className="teacher-layout">
          <div className="teacher-donut"><EChart option={teacherOption} ariaLabel="高级、中级、初级师资数量环形图" onPointClick={(name) => onDrill({ title: `${name}师资明细`, description: `师资等级：${name}` })} /><div><UsersRound size={15} /><strong>{data.kpis[3].value.toLocaleString()}</strong><span>师资总数</span></div></div>
          <div className="teacher-list">
            {data.teacherRanking.map((teacher, index) => <button type="button" key={teacher.id} onClick={() => onDrill({ title: `${teacher.name}授课详情`, description: `${teacher.level}教师 · ${teacher.hours} 学时` })}><i>{index + 1}</i><span><strong>{teacher.name}</strong><small>{teacher.level} · {teacher.hours} 学时</small></span><b>{teacher.rating}<small>分</small></b></button>)}
          </div>
        </div>
      </ChartPanel>

      <ChartPanel index="06" className="panel-employment" title="就业成果" subtitle="结业转就业情况与重点流向行业" onMore={() => onDrill({ title: '就业成果明细', description: '查看就业人员与就业去向' })}>
        <div className="employment-layout">
          <div className="employment-summary">
            <BriefcaseBusiness size={20} /><span>就业人数<strong>{data.employed.toLocaleString()}</strong></span><span>就业率<strong>{data.employmentRate}%</strong></span><small>结业统计口径 {data.graduates.toLocaleString()} 人</small>
            <div className="destination-mini">
              {data.employmentDestinations.slice(0, 3).map((item) => <button type="button" key={item.name} onClick={() => onDrill({ title: `${item.name}明细`, description: `就业去向：${item.name}` })}><span>{item.name}</span><b>{item.value}%</b></button>)}
            </div>
          </div>
          <EChart option={employmentOption} ariaLabel="重点就业行业人数横向柱状图" onPointClick={(name) => onDrill({ title: `${name}就业明细`, description: `就业行业：${name}` })} />
        </div>
      </ChartPanel>
    </main>
  )
}

import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { AriaComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts'

echarts.use([BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, AriaComponent, CanvasRenderer])

interface EChartProps {
  option: EChartsOption
  ariaLabel: string
  onPointClick?: (name: string, seriesName: string) => void
  className?: string
}

export function EChart({ option, ariaLabel, onPointClick, className = '' }: EChartProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const onPointClickRef = useRef(onPointClick)
  onPointClickRef.current = onPointClick

  useEffect(() => {
    if (!elementRef.current) return
    const chart = echarts.init(elementRef.current, undefined, { renderer: 'canvas' })
    chart.setOption(option)
    chart.on('click', (params) => onPointClickRef.current?.(params.name, params.seriesName ?? ''))
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(elementRef.current)
    return () => {
      observer.disconnect()
      chart.dispose()
    }
  }, [])

  useEffect(() => {
    const chart = elementRef.current ? echarts.getInstanceByDom(elementRef.current) : undefined
    chart?.setOption(option, { notMerge: true })
  }, [option])

  return <div ref={elementRef} className={`echart ${className}`} role="img" aria-label={ariaLabel} />
}

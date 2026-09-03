import { AlertCircle, Inbox, RefreshCw } from 'lucide-react'
import type { ViewState } from '../../types/dashboard'

interface ModuleStateProps {
  state: ViewState
  onReset?: () => void
  onRetry?: () => void
}

export function ModuleState({ state, onReset, onRetry }: ModuleStateProps) {
  if (state === 'loading') {
    return (
      <div className="page-loading" aria-live="polite" aria-label="正在加载驾驶舱数据">
        <div className="skeleton-row skeleton-kpis" />
        <div className="skeleton-panels">
          {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
        </div>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div className="state-page">
        <Inbox size={42} strokeWidth={1.5} />
        <strong>暂无培训数据</strong>
        <span>请调整期次或筛选条件后重试</span>
        <button className="primary-button" type="button" onClick={onReset}><RefreshCw size={15} />重置筛选</button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="state-page error-state">
        <AlertCircle size={42} strokeWidth={1.5} />
        <strong>数据加载失败</strong>
        <span>服务暂时不可用，请稍后重新加载</span>
        <button className="primary-button" type="button" onClick={onRetry}><RefreshCw size={15} />重新加载</button>
      </div>
    )
  }

  return null
}

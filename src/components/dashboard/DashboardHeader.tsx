import { Building2, MapPinned, Maximize2, RefreshCw, ShieldCheck } from 'lucide-react'

interface DashboardHeaderProps {
  updateTime: string
  refreshing: boolean
  onRefresh: () => void
}

export function DashboardHeader({ updateTime, refreshing, onRefresh }: DashboardHeaderProps) {
  const displayDate = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen()
    else void document.exitFullscreen()
  }

  return (
    <header className="dashboard-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true"><Building2 size={25} /></div>
        <div>
          <h1>模数师数字平台驾驶舱</h1>
          <p>职业技能培训数字化监管平台</p>
        </div>
      </div>
      <div className="header-status">
        <span className="scope-badge"><MapPinned size={13} />市级全域</span>
        <div className="update-copy"><span>{displayDate} · 数据更新</span><strong>{updateTime || '--:--:--'}</strong></div>
        <span className="health-badge"><ShieldCheck size={14} />数据正常</span>
        <button className="icon-button" type="button" onClick={onRefresh} title="刷新数据" aria-label="刷新数据"><RefreshCw size={17} className={refreshing ? 'spin' : ''} /></button>
        <button className="icon-button" type="button" onClick={toggleFullscreen} title="全屏显示" aria-label="全屏显示"><Maximize2 size={17} /></button>
      </div>
    </header>
  )
}

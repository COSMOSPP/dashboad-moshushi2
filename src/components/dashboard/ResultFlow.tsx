import { ArrowRight, CheckCircle2, Radio } from 'lucide-react'
import type { DashboardData } from '../../types/dashboard'

interface ResultFlowProps {
  data: DashboardData
  onDrill: (name: string) => void
}

export function ResultFlow({ data, onDrill }: ResultFlowProps) {
  return (
    <footer className="result-footer">
      <span className="result-label">培训成果链路</span>
      <div className="result-flow">
        {data.flow.map((item, index) => (
          <span className="flow-step" key={item.name}>
            <button type="button" onClick={() => onDrill(item.name)}><small>{item.name}</small><strong>{item.value.toLocaleString()}</strong></button>
            {index < data.flow.length - 1 && <ArrowRight size={14} />}
          </span>
        ))}
      </div>
      <div className="footer-status"><Radio size={14} /><span>自动刷新 60s</span><CheckCircle2 size={14} /><strong>数据状态正常</strong></div>
    </footer>
  )
}

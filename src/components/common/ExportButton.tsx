import { ChevronDown, Download, ListFilter, Rows3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ExportButtonProps {
  onExport: (scope: 'current' | 'all') => void | Promise<void>
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const selectScope = async (scope: 'current' | 'all') => {
    setOpen(false)
    try {
      await onExport(scope)
      setFeedback('导出文件已生成')
    } catch {
      setFeedback('导出失败，请重试')
    }
    window.setTimeout(() => setFeedback(''), 2_400)
  }

  return (
    <div className="export-control" ref={wrapperRef}>
      <button className="secondary-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <Download size={15} />导出数据<ChevronDown size={13} />
      </button>
      {open && (
        <div className="export-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => selectScope('current')}><ListFilter size={15} /><span>当前筛选结果<small>按当前条件与排序导出</small></span></button>
          <button type="button" role="menuitem" onClick={() => selectScope('all')}><Rows3 size={15} /><span>全部数据<small>导出当前权限范围数据</small></span></button>
        </div>
      )}
      {feedback && <span className={`export-feedback ${feedback.startsWith('导出失败') ? 'is-error' : ''}`} role="status">{feedback}</span>}
    </div>
  )
}

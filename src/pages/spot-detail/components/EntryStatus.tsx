import { AlertTriangle, CheckCircle } from 'lucide-react'

interface EntryStatusProps {
  visitWarning?: string
}

export function EntryStatus({ visitWarning }: EntryStatusProps) {
  const hasWarning = Boolean(visitWarning?.trim())

  if (!hasWarning) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-gray-7/80 bg-spot-input/80 px-4 py-4">
        <CheckCircle size={18} className="mt-0.5 shrink-0 text-gray-3" />
        <div className="min-w-0 flex-1 space-y-1 px-0.5 py-0.5">
          <p className="text-sm font-semibold text-white">출입 가능</p>
          <p className="text-xs leading-relaxed text-spot-muted">
            현재 일반인 출입이 허용된 장소입니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/50 bg-primary/25 px-4 py-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-white" fill="currentColor" />
      <div className="min-w-0 flex-1 space-y-1 px-0.5 py-0.5">
        <p className="text-sm font-semibold text-white">방문 주의</p>
        <p className="text-xs leading-relaxed text-gray-2">{visitWarning}</p>
      </div>
    </div>
  )
}

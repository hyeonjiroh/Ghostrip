import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function SpotPageHeader() {
  const navigate = useNavigate()

  return (
    <header className="px-4 pt-3 pb-2">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="flex h-8 w-8 items-center justify-center text-secondary transition-opacity hover:opacity-80"
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>
    </header>
  )
}

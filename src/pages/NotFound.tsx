import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-spot-bg px-4 text-white">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-sm text-spot-muted">페이지를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className="rounded-xl bg-primary px-5 py-2.5 text-sm text-white transition-colors hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}health`)
      .then((res) => {
        if (res.ok) {
          console.log('[HealthCheck] ✅ API 서버 정상:', res.status);
        } else {
          console.error('[HealthCheck] ❌ API 서버 응답 오류:', res.status, res.statusText);
        }
      })
      .catch((err) => {
        console.error('[HealthCheck] ❌ API 서버 연결 실패:', err.message);
      });
  }, []);

  return <div>API Test</div>;
}

import axios from 'axios'

// TODO(API): src/apis/spot.ts 등에서 apiClient.get/post 호출 — Spot·Home·댓글·관련콘텐츠 fetch
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

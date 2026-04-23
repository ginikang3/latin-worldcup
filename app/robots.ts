// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // 노출하기 싫은 관리자 페이지 등이 있다면 추가
    },
    sitemap: 'https://latin-worldcup.vercel.app/sitemap.xml',
  }
}
import type { Metadata } from "next";
// ... 기존 폰트 및 스타일 import는 유지 ...

export const metadata: Metadata = {
  // 아이돌 월드컵, 타로, 궁합 키워드를 제목에 집중 배치
  title: "Mundial K-Pop Idol 2026 | Tarot y Compatibilidad de Amor",
  description: "Vota en el Mundial K-Pop, descubre tu destino con el Tarot Idol y mide tu compatibilidad con tu bias. ¡El juego definitivo para fans de K-Pop en Latam!",
  keywords: [
    "mundial kpop", 
    "ideal type worldcup kpop", 
    "tarot kpop", 
    "compatibilidad amorosa kpop", 
    "juego kpop", 
    "kpop mexico", 
    "kpop latam"
  ],

  // SNS 공유(왓츠앱, 틱톡 등) 시 팬들의 클릭을 유도하는 설정
  openGraph: {
    title: "Mundial K-Pop Idol & K-Tarot 2026",
    description: "¿Quién es tu idol ideal? ¡Mide tu compatibilidad y juega ahora!",
    url: "https://latin-worldcup.vercel.app",
    siteName: "Latin Worldcup",
    locale: "es_MX",
    type: "website",
  },

  // 구글 서치 콘솔 인증 (기존에 발급받은 코드 사용)
  verification: {
    google: "n0h7YBDy8iiuMhb1xrE4NYG3wWCD66K11XfK0bNBRT4",
    other: {
      "agd-partner-manual-verification": "true",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* 기존 head 내용 절대 보존 */}
      </head>
      <body
        className="... 기존 클래스 유지 ..."
      >
        {children}

        {/* 기존에 설정된 모든 광고 및 서비스 워커 스크립트 절대 보존 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered');
                  }).catch(function(err) {
                    console.log('SW error:', err);
                  });
                });
              }
            `,
          }}
        />
        {/* ... 이하 기존 광고 스크립트 생략 (파일에 있는 그대로 두시면 됩니다) ... */}
      </body>
    </html>
  );
}
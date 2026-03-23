"use client";

import React, { useState } from 'react';
import WorldCup from './components/WorldCup';
import AffinityGame from './components/AffinityGame';
import Tarot from './components/Tarot'; // 👈 타로 컴포넌트 임포트!

export default function Home() {
  // 'tarot' 모드 추가
  const [mode, setMode] = useState<'menu' | 'worldcup' | 'affinity' | 'tarot'>('menu');

  if (mode === 'worldcup') {
    return <WorldCup onBack={() => setMode('menu')} />;
  }

  if (mode === 'affinity') {
    return <AffinityGame onBack={() => setMode('menu')} />;
  }

  if (mode === 'tarot') {
    return <Tarot onBack={() => setMode('menu')} />; // 👈 타로 화면으로 연결
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 text-center relative overflow-hidden font-sans">
      {/* 배경 장식 */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-900/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/10 blur-[100px] rounded-full" />
      
      <h1 className="text-7xl md:text-[10rem] font-black mb-4 tracking-tighter italic uppercase leading-[0.8] z-10">
        K-POP <br/><span className="text-red-600">BIAS</span>
      </h1>
      <p className="text-zinc-500 font-bold mb-16 z-10 tracking-[0.2em] uppercase text-sm">Elige tu destino</p>

      {/* 버튼 그리드: 3개 버튼을 위해 grid 설정 변경 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl z-10 px-4">
        {/* 월드컵 버튼 */}
        <button 
          onClick={() => setMode('worldcup')}
          className="group bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-10 rounded-[3rem] hover:border-red-600 transition-all active:scale-95 shadow-2xl flex flex-col items-center justify-center"
        >
          <span className="text-4xl md:text-5xl font-black italic group-hover:text-red-500 transition-colors uppercase tracking-tighter leading-none mb-3 text-center">
            BIAS<br/>MUNDIAL
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">Mundial de Idols</span>
        </button>

        {/* 궁합 게임 버튼 */}
        <button 
          onClick={() => setMode('affinity')}
          className="group bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-10 rounded-[3rem] hover:border-yellow-500 transition-all active:scale-95 shadow-2xl flex flex-col items-center justify-center"
        >
          <span className="text-4xl md:text-5xl font-black italic group-hover:text-yellow-500 transition-colors uppercase tracking-tighter leading-none mb-3 text-center">
            DESTINO<br/>BIAS
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">Calculadora de Amor</span>
        </button>

        {/* ✨ 타로 버튼 추가 (하단에 크게 배치) */}
        <button 
          onClick={() => setMode('tarot')}
          className="group md:col-span-2 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-2 border-purple-800/50 p-8 md:p-10 rounded-[3rem] hover:border-purple-500 transition-all active:scale-95 shadow-[0_0_30px_rgba(147,51,234,0.1)] flex flex-col items-center justify-center"
        >
          <span className="text-4xl md:text-6xl font-black italic group-hover:text-purple-400 transition-colors uppercase tracking-tighter leading-none mb-3 text-center">
            🔮 TAROT BIAS
          </span>
          <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest text-center">Predice tu futuro con idols</span>
        </button>
      </div>
      
      <p className="mt-16 text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] z-10">Desarrollado para fans en México</p>
    </div>
  );
}
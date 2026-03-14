"use client";

import React, { useState } from 'react';
import WorldCup from './components/WorldCup';
import AffinityGame from './components/AffinityGame';

export default function Home() {
  const [mode, setMode] = useState<'menu' | 'worldcup' | 'affinity'>('menu');

  if (mode === 'worldcup') {
    return <WorldCup onBack={() => setMode('menu')} />;
  }

  if (mode === 'affinity') {
    return <AffinityGame onBack={() => setMode('menu')} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 text-center relative overflow-hidden font-sans">
      {/* 배경 장식 */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-900/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-900/10 blur-[100px] rounded-full" />
      
      <h1 className="text-7xl md:text-[10rem] font-black mb-4 tracking-tighter italic uppercase leading-[0.8] z-10">
        K-POP <br/><span className="text-red-600">BIAS</span>
      </h1>
      <p className="text-zinc-500 font-bold mb-16 z-10 tracking-[0.2em] uppercase text-sm">Elige tu destino</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl z-10 px-4">
        {/* 월드컵 버튼: BIAS MUNDIAL */}
        <button 
          onClick={() => setMode('worldcup')}
          className="group bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-10 rounded-[3rem] hover:border-red-600 transition-all active:scale-95 shadow-2xl flex flex-col items-center justify-center"
        >
          <span className="text-4xl md:text-5xl font-black italic group-hover:text-red-500 transition-colors uppercase tracking-tighter leading-none mb-3">
            BIAS<br/>MUNDIAL
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mundial de Idols</span>
        </button>

        {/* 궁합 게임 버튼: DESTINO BIAS */}
        <button 
          onClick={() => setMode('affinity')}
          className="group bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-10 rounded-[3rem] hover:border-yellow-500 transition-all active:scale-95 shadow-2xl flex flex-col items-center justify-center"
        >
          <span className="text-4xl md:text-5xl font-black italic group-hover:text-yellow-500 transition-colors uppercase tracking-tighter leading-none mb-3">
            DESTINO<br/>BIAS
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Calculadora de Amor</span>
        </button>
      </div>
      
      <p className="mt-16 text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] z-10">Desarrollado para fans en México</p>
    </div>
  );
}
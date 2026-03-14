"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AffinityGame({ onBack }: { onBack: () => void }) {
  const [userName, setUserName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [selectedIdol, setSelectedIdol] = useState<any | null>(null);
  
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // 로딩 상태 추가
  const [resultData, setResultData] = useState<any | null>(null);

  const years = Array.from({ length: 2026 - 1920 + 1 }, (_, i) => (1920 + i).toString()).reverse(); 
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const [maxDays, setMaxDays] = useState(31);

  useEffect(() => {
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    setMaxDays(lastDay);
    if (parseInt(day) > lastDay) {
      setDay(lastDay.toString().padStart(2, '0'));
    }
  }, [year, month, day]);

  const days = Array.from({ length: maxDays }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const searchIdol = async (val: string) => {
    setSearchKeyword(val);
    if (val.length > 0) {
      const { data } = await supabase.from('rankings').select('*').or(`kor_name.ilike.%${val}%,eng_name.ilike.%${val}%`).limit(5);
      setSearchResult(data || []);
    } else {
      setSearchResult([]);
    }
  };

  const handleCalculate = () => {
    if (!selectedIdol || !userName) {
      alert("¡Por favor completa todos los campos!");
      return;
    }
    
    // 1. 계산 중 상태로 변경 (로딩 화면)
    setIsCalculating(true);

    // 2. 버튼 클릭 시점에만 광고 스크립트 전격 투입
    const script = document.createElement('script');
    script.src = "https://al5sm.com/tag.min.js?zone=10729967";
    script.async = true;
    document.body.appendChild(script);

    // 3. 1.5초 딜레이 (광고가 터질 시간을 벌어주고 로딩 효과)
    setTimeout(() => {
      const userDateStr = year + month + day;
      const userSum = userDateStr.split('').reduce((acc: number, curr: string) => acc + (parseInt(curr) || 0), 0);
      const idolBdayStr = (selectedIdol.birthday || '1997-09-01').replace(/-/g, '');
      const idolSum = idolBdayStr.split('').reduce((acc: number, curr: string) => acc + (parseInt(curr) || 0), 0);
      
      const score = 70 + ((userSum + idolSum) % 31);
      
      let message = "";
      if (score >= 98) message = "¡ES TU ESPOSO! 💍"; 
      else if (score >= 94) message = "¡DESTINO FATAL! ❤️";
      else if (score >= 88) message = "¡AMOR PURO! ✨";
      else if (score >= 80) message = "¡ALMA GEMELA! 💘";
      else message = "¡CONEXIÓN REAL! 😊";

      setResultData({ score, message });
      setIsCalculating(false);
      setShowResult(true);
      window.scrollTo(0, 0);
    }, 1500); 
  };

  // --- 로딩 화면 ---
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-2xl font-black italic uppercase tracking-tighter animate-pulse text-red-600">Calculando Destino...</p>
      </div>
    );
  }

  // --- 결과 화면 ---
  if (showResult && resultData && selectedIdol) {
    const shareText = `¡Mira! Mi compatibilidad con ${selectedIdol.eng_name.replace('_', ' ')} es del ${resultData.score}%. ❤️`;
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center relative overflow-hidden font-sans">
        <style jsx>{`
          @keyframes microFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .animate-micro { animation: microFloat 2s ease-in-out infinite; }
        `}</style>
        <button onClick={() => setShowResult(false)} className="absolute top-6 left-6 z-50 text-zinc-500 font-bold uppercase text-[10px] border border-zinc-800 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">← Reintentar</button>
        <div className="z-10 w-full max-w-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
          <p className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            {userName} <span className="text-red-600 animate-pulse text-3xl">❤</span> {selectedIdol.eng_name.replace('_', ' ')}
          </p>
          <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-[6px] border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.3)] mb-10 bg-zinc-950 animate-micro">
            <img src={selectedIdol.img_url} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="text-[10rem] md:text-[13rem] font-black text-red-600 italic leading-[0.7] mb-6 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-micro [animation-delay:0.5s]">
            {resultData.score}<span className="text-4xl md:text-5xl font-black">%</span>
          </div>
          <p className="text-3xl md:text-4xl font-black italic text-yellow-500 uppercase tracking-tighter mb-12 leading-tight">{resultData.message}</p>
          <button onClick={() => window.location.reload()} className="w-full max-w-xs border border-zinc-800 text-zinc-600 py-4 rounded-2xl font-black text-[10px] uppercase italic hover:bg-zinc-900 transition-all">Jugar de nuevo</button>
        </div>
      </div>
    );
  }

  // --- 입력 화면 ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden font-sans text-center">
      <button onClick={onBack} className="absolute top-6 left-6 z-50 text-zinc-500 font-bold uppercase text-[10px] border border-zinc-800 px-4 py-2 rounded-full">← Menu</button>
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-6xl md:text-7xl font-black mb-2 italic tracking-tighter uppercase leading-[0.8]">
          <span className="text-white">DESTINO</span> <br/>
          <span className="text-red-600">BIAS</span>
        </h1>
        <p className="text-zinc-600 text-[10px] font-black mb-10 tracking-[0.3em] uppercase">K-Pop Compatibility</p>
        <div className="w-full bg-zinc-950/50 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl backdrop-blur-sm">
          <div className="mb-10 text-left relative">
            <label className="flex items-center gap-2 text-xs font-black text-yellow-500 uppercase tracking-tighter mb-4">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-sm">1</span>
              <span className="text-sm font-black">Selecciona tu Bias</span>
            </label>
            <input type="text" value={searchKeyword} onChange={(e) => searchIdol(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl text-white text-lg font-bold outline-none focus:border-yellow-500" placeholder="Escribe nombre..." />
            {searchResult.length > 0 && (
              <div className="absolute w-full mt-2 bg-zinc-900 border-2 border-yellow-500/50 rounded-2xl overflow-hidden z-50 shadow-2xl">
                {searchResult.map(idol => (
                  <div key={idol.id} onClick={() => { setSelectedIdol(idol); setSearchKeyword(idol.eng_name.replace('_', ' ')); setSearchResult([]); }} className="p-4 hover:bg-yellow-500 hover:text-black cursor-pointer flex items-center gap-4 border-b border-zinc-800 transition-colors">
                    <img src={idol.img_url} className="w-12 h-12 rounded-full object-cover" alt=""/>
                    <span className="font-black uppercase tracking-tighter text-sm">{idol.eng_name.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-10 text-left">
            <label className="flex items-center gap-2 text-xs font-black text-yellow-500 uppercase tracking-tighter mb-4">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-sm">2</span>
              <span className="text-sm font-black">Tu Nombre</span>
            </label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl text-white text-lg font-bold" placeholder="Tu nombre" />
          </div>
          <div className="mb-12 text-left">
            <label className="flex items-center gap-2 text-xs font-black text-yellow-500 uppercase tracking-tighter mb-4">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-sm">3</span>
              <span className="text-sm font-black">Tu Cumpleaños</span>
            </label>
            <div className="flex gap-2">
              <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-20 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="w-20 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
            </div>
          </div>
          <button onClick={handleCalculate} className="w-full bg-yellow-500 text-black py-6 rounded-[2rem] font-black text-xl uppercase italic shadow-xl active:scale-95 transition-all">Ver Resultado</button>
        </div>
      </div>
    </div>
  );
}
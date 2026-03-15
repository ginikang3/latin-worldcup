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
  const [isCalculating, setIsCalculating] = useState(false);
  const [isReadyToSee, setIsReadyToSee] = useState(false); 
  const [resultData, setResultData] = useState<any | null>(null);

  // ✅ 1. 페이지 로드 시 배너 및 자동 광고 스크립트 주입
  useEffect(() => {
    // 배너/태그 광고 (10716658)
    const script1 = document.createElement('script');
    script1.innerHTML = `(function(s){s.dataset.zone='10716658',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(script1);

    // 추가 배너/액션 태그 (10716656)
    const script2 = document.createElement('script');
    script2.src = "https://5gvci.com/act/files/tag.min.js?z=10716656";
    script2.setAttribute('data-cfasync', 'false');
    script2.async = true;
    document.body.appendChild(script2);

    // 비네트(전면형) 광고 (10716622)
    const script3 = document.createElement('script');
    script3.innerHTML = `(function(s){s.dataset.zone='10716622',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(script3);
  }, []);

  // ✅ 2. 클릭형(OnClick) 광고 주입 함수 (결과 보기 클릭 시 실행)
  const loadOnClickAd = () => {
    const script = document.createElement('script');
    script.innerHTML = `(function(s){s.dataset.zone='10729967',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(script);
  };

  const searchIdol = async (val: string) => {
    setSearchKeyword(val);
    if (val.trim().length > 0) {
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
    setIsCalculating(true);
    loadOnClickAd(); // 로딩 중에 OnClick 광고 세팅

    setTimeout(() => {
      const userDateStr = year + month + day;
      const userSum = userDateStr.split('').reduce((acc: number, curr: string) => acc + (parseInt(curr) || 0), 0);
      const idolBdayStr = (selectedIdol.birthday || '1997-09-01').replace(/-/g, '');
      const idolSum = idolBdayStr.split('').reduce((acc: number, curr: string) => acc + (parseInt(curr) || 0), 0);
      const score = 70 + ((userSum + idolSum) % 31);
      
      let message = (score >= 98) ? "¡ES TU ESPOSO! 💍" : (score >= 94) ? "¡DESTINO FATAL! ❤️" : (score >= 88) ? "¡AMOR PURO! ✨" : (score >= 80) ? "¡ALMA GEMELA! 💘" : "¡CONEXIÓN REAL! 😊";

      setResultData({ score, message });
      setIsCalculating(false);
      setIsReadyToSee(true); 
    }, 2500); 
  };

  const shareSNS = (platform: string) => {
    const url = window.location.href;
    const shareText = `¡Mi compatibilidad con ${selectedIdol?.eng_name.replace('_', ' ')} es del ${resultData?.score}%! ${resultData?.message} ❤️`;
    let shareUrl = platform === 'wa' ? `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + url)}` : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  // UI 렌더링 부분 (로딩, 준비완료, 결과창 등은 이전과 동일하되 디자인 유지)
  if (isCalculating) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-2xl font-black italic uppercase animate-pulse text-red-600">Calculando Destino...</p>
    </div>
  );

  if (isReadyToSee) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] shadow-2xl">
        <h2 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-white">¿Estás lista para <br/><span className="text-red-600 text-5xl">tu destino?</span></h2>
        <button onClick={() => { setShowResult(true); setIsReadyToSee(false); window.scrollTo(0,0); }} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl uppercase italic animate-bounce">Ver Resultado Ahora</button>
      </div>
    </div>
  );

  if (showResult && resultData && selectedIdol) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center font-sans">
      <button onClick={() => setShowResult(false)} className="absolute top-6 left-6 text-zinc-500 font-bold text-[10px] border border-zinc-800 px-4 py-2 rounded-full">← Reintentar</button>
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in">
        <p className="text-2xl font-black italic uppercase mb-8">{userName} <span className="text-red-600 animate-pulse">❤</span> {selectedIdol.eng_name.replace('_', ' ')}</p>
        <div className="relative w-72 h-72 rounded-[3rem] overflow-hidden border-[6px] border-yellow-500 mb-10"><img src={selectedIdol.img_url} className="w-full h-full object-cover" alt="" /></div>
        <div className="text-[10rem] font-black text-red-600 italic leading-[0.7] mb-6">{resultData.score}<span className="text-4xl">%</span></div>
        <p className="text-3xl font-black italic text-yellow-500 uppercase mb-8">{resultData.message}</p>
        <div className="flex flex-col gap-3 w-full mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => shareSNS('wa')} className="bg-[#25D366] py-5 rounded-2xl flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" className="w-7 h-7" alt="" /></button>
            <button onClick={() => shareSNS('fb')} className="bg-[#1877F2] py-5 rounded-2xl flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" className="w-7 h-7" alt="" /></button>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('¡Enlace copiado!'); }} className="bg-zinc-800 text-white py-5 rounded-2xl font-black text-sm italic uppercase">🔗 Copiar enlace</button>
        </div>
        <button onClick={() => window.location.reload()} className="w-full bg-zinc-950 border-2 border-zinc-800 text-zinc-400 py-6 rounded-2xl font-black text-sm uppercase italic">Jugar de nuevo</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6 text-center">
      <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 font-bold text-[10px] border border-zinc-800 px-4 py-2 rounded-full">← Menu</button>
      <div className="w-full max-w-md">
        <h1 className="text-6xl font-black mb-10 italic uppercase leading-[0.8]"><span className="text-white">DESTINO</span> <br/><span className="text-red-600">BIAS</span></h1>
        <div className="w-full bg-zinc-950/50 border border-zinc-900 p-8 rounded-[3rem] text-left">
          <div className="mb-10 relative">
            <label className="text-xs font-black text-yellow-500 uppercase mb-4 block">1. Selecciona tu Bias</label>
            <input type="text" value={searchKeyword} onChange={(e) => searchIdol(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-yellow-500" placeholder="Escribe nombre..." />
            {searchResult.length > 0 && (
              <div className="absolute w-full mt-2 bg-zinc-900 border-2 border-yellow-500/50 rounded-2xl overflow-hidden z-50">
                {searchResult.map(idol => (
                  <div key={idol.id} onClick={() => { setSelectedIdol(idol); setSearchKeyword(idol.eng_name.replace('_', ' ')); setSearchResult([]); }} className="p-4 hover:bg-yellow-500 hover:text-black cursor-pointer flex items-center gap-4 border-b border-zinc-800"><img src={idol.img_url} className="w-12 h-12 rounded-full object-cover" alt="" /><span className="font-black uppercase text-sm">{idol.eng_name.replace('_', ' ')}</span></div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-10">
            <label className="text-xs font-black text-yellow-500 uppercase mb-4 block">2. Tu Nombre</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-yellow-500" placeholder="Tu 이름" />
          </div>
          <div className="mb-12">
            <label className="text-xs font-black text-yellow-500 uppercase mb-4 block">3. Tu Cumpleaños</label>
            <div className="flex gap-2">
              <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">
                {Array.from({ length: 107 }, (_, i) => (2026 - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-20 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="w-20 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl text-white font-bold">
                {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleCalculate} className="w-full bg-yellow-500 text-black py-6 rounded-[2rem] font-black text-xl uppercase italic shadow-xl active:scale-95 transition-all">Ver Resultado</button>
        </div>
      </div>
    </div>
  );
}
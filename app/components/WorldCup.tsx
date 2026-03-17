"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; 
import html2canvas from 'html2canvas';

export default function WorldCup({ onBack }: { onBack: () => void }) {
  const [totalRound, setTotalRound] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [matchCount, setMatchCount] = useState(1);
  const [finalWinner, setFinalWinner] = useState<any | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [clickCount, setClickCount] = useState(0); // ✅ 광고 카운터 추가

  useEffect(() => {
    setIsClient(true);
    const meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.getElementsByTagName('head')[0].appendChild(meta);
    fetchRankings();
  }, []);

  // ✅ 광고 1: 10번 클릭마다 터지는 비네트 광고
  const loadVignetteAd = () => {
    const s = document.createElement('script');
    s.innerHTML = `(function(s){s.dataset.zone='10716622',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(s);
  };

  // ✅ 광고 2: 최종 우승 시 터지는 팝업 광고
  const loadWinnerPopUpAd = () => {
    const s = document.createElement('script');
    s.innerHTML = `(function(s){s.dataset.zone='10729967',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(s);
  };

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      if (error) throw error;
      setRankings(data || []);
    } catch (e) {
      console.error("Ranking Load Error:", e);
    }
  };

  const resetGame = () => {
    setFinalWinner(null);
    setTotalRound(null);
    setCandidates([]);
    setMatchCount(1);
    setClickCount(0); // 카운트 리셋
  };

  const copyLink = async () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      alert("¡Enlace copiado!");
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("¡Enlace copiado!");
    }
  };

  const shareToWhatsApp = () => {
    const text = `¡Mira mi K-pop Bias! Mi ganador es ${finalWinner?.eng_name?.replace('_', ' ') || finalWinner?.kor_name}. Juega aquí: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const saveAsImage = async () => {
    const element = document.getElementById('winner-card');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { 
        useCORS: true, 
        backgroundColor: "#000000",
        scale: 2 
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `mi-kpop-bias.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert("Por favor, toma una captura de pantalla.");
    }
  };

  const startWorldCup = async (round: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('rankings').select('*');
      if (error) throw error;
      const validData = data?.filter(item => item.img_url && item.img_url.length > 10) || [];
      if (validData.length < round) {
        alert(`Faltan ídolos: Actualmente solo hay ${validData.length} disponibles`);
        return;
      }
      const shuffled = [...validData].sort(() => Math.random() - 0.5).slice(0, round);
      setCandidates(shuffled);
      setTotalRound(round);
      setWinners([]);
      setMatchCount(1);
      setFinalWinner(null);
      setClickCount(0); // 게임 시작 시 초기화
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectWinner = async (winner: any) => {
    // ✅ 클릭 시마다 카운트 올리고 10번마다 비네트 광고
    const nextClickCount = clickCount + 1;
    setClickCount(nextClickCount);
    if (nextClickCount % 10 === 0) {
      loadVignetteAd();
    }

    const nextWinners = [...winners, winner];
    const remainingCandidates = candidates.slice(2);
    if (candidates.length <= 2) {
      if (totalRound === 2) {
        // ✅ 결승전 승리 시 팝업 광고
        loadWinnerPopUpAd();
        setFinalWinner(winner);
        const { data } = await supabase.from('rankings').select('score').eq('kor_name', winner.kor_name).maybeSingle();
        await supabase.from('rankings').update({ score: (data?.score || 0) + 1 }).eq('kor_name', winner.kor_name);
        fetchRankings();
      } else {
        setCandidates(nextWinners);
        setWinners([]);
        setMatchCount(1);
        setTotalRound(totalRound! / 2);
      }
    } else {
      setWinners(nextWinners);
      setCandidates(remainingCandidates);
      setMatchCount(matchCount + 1);
    }
  };

  if (!isClient) return null;

  const GlobalBackButton = () => (
    <button 
      onClick={onBack} 
      className="absolute top-6 left-6 z-50 bg-black/50 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-full font-bold text-[10px] uppercase hover:bg-white hover:text-black transition-all"
    >
      ← MENU
    </button>
  );

  const RankingChart = () => (
    <div className="mt-12 p-8 bg-zinc-950/80 backdrop-blur-2xl rounded-[3rem] w-full max-w-lg border border-zinc-800 shadow-2xl z-10">
      <h2 className="text-3xl font-black mb-8 text-center bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent italic uppercase tracking-tighter">Ranking Global</h2>
      <div className="flex flex-col gap-3 text-left">
        {rankings.map((rank, index) => (
          <div key={index} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex items-center gap-4">
              <span className={`text-xl font-black ${index < 3 ? 'text-yellow-500' : 'text-zinc-600'}`}>{index + 1}</span>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-700">
                <img src={rank.img_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base leading-tight uppercase truncate max-w-[150px]">
                  {rank.eng_name?.replace('_', ' ') || rank.kor_name}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">{rank.kor_name}</span>
              </div>
            </div>
            <span className="font-black text-yellow-500 text-xl tracking-tighter">{rank.score}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (finalWinner) {
    const nameParts = finalWinner.eng_name?.split('_') || [finalWinner.kor_name];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 relative overflow-hidden">
        <GlobalBackButton />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-600/20 blur-[120px] rounded-full" />
        <h1 className="text-6xl md:text-8xl font-black text-yellow-500 mb-8 z-10 italic uppercase tracking-tighter">¡Ganador!</h1>
        <div id="winner-card" className="relative w-72 aspect-[2/3.2] rounded-[3rem] border-[8px] border-yellow-500 overflow-hidden z-10 shadow-[0_0_100px_rgba(234,179,8,0.3)] bg-zinc-950">
          <img src={finalWinner.img_url} className="w-full h-full object-contain" crossOrigin="anonymous" alt="" />
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 pt-6 pb-10 text-center px-4">
            {nameParts.length > 1 && <p className="text-black/60 text-xs font-black uppercase mb-1 tracking-widest">{nameParts[0]}</p>}
            <p className="text-black text-3xl font-black uppercase tracking-tighter leading-none break-words">
              {nameParts.length > 1 ? nameParts[1] : nameParts[0]}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-8 z-10 w-full max-w-xs px-2">
          <button onClick={shareToWhatsApp} className="bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg">WhatsApp</button>
          <button onClick={shareToFacebook} className="bg-[#1877F2] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Facebook</button>
          <button onClick={saveAsImage} className="bg-white text-black py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Guardar Foto</button>
          <button onClick={copyLink} className="bg-zinc-800 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Copiar Link</button>
        </div>
        <button onClick={resetGame} className="mt-12 bg-white text-black px-12 py-5 rounded-full font-black text-xl z-10 hover:bg-yellow-500 transition-all shadow-xl uppercase">Volver a jugar</button>
        <RankingChart />
      </div>
    );
  }

  if (!totalRound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 relative overflow-hidden text-center">
        <GlobalBackButton />
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-900/20 blur-[100px] rounded-full" />
        <h1 className="text-7xl md:text-[11rem] font-black mb-12 tracking-tighter italic uppercase text-white leading-[0.8] z-10">
          BIAS <br/><span className="text-red-600">MUNDIAL</span>
        </h1>
        <p className="text-zinc-500 font-bold mb-8 z-10 tracking-[0.15em] uppercase px-4 text-sm">¡Elige a tu favorito definitivo!</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-16 z-10">
          {[32, 64, 128, 256].map(r => (
            <button key={r} onClick={() => startWorldCup(r)} className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] hover:border-red-600 active:scale-95 transition-all backdrop-blur-sm">
              <span className="block text-4xl font-black italic text-white group-hover:text-red-500 transition-colors">TOP {r}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">EMPEZAR</span>
            </button>
          ))}
        </div>
        <RankingChart />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-2 overflow-hidden relative font-sans">
      <GlobalBackButton />
      <div className="h-[12%] flex flex-col items-center justify-center mb-2 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-red-600 italic uppercase tracking-tighter">Ronda de {totalRound}</h2>
        <p className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-1">{matchCount} / {totalRound / 2} DUELOS</p>
      </div>
      <div className="flex flex-row gap-2 md:gap-4 w-full max-w-7xl h-[83%] items-center justify-center px-1 md:px-4 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black font-black italic w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-full z-30 text-xl md:text-3xl border-[6px] border-black shadow-[0_0_30px_rgba(255,255,255,0.2)]">VS</div>
        {[candidates[0], candidates[1]].map((person, idx) => {
          const nameData = person?.eng_name?.split('_') || [person?.kor_name];
          return (
            <div key={idx} onClick={() => selectWinner(person)} className="flex-1 flex flex-col items-center cursor-pointer h-full relative group">
              <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border-2 border-zinc-800 group-hover:border-red-600 transition-all duration-500 shadow-2xl bg-zinc-950">
                <img src={person?.img_url} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-8 md:bottom-12 left-0 right-0 text-center px-4 md:px-8 z-20">
                  {nameData.length > 1 && (
                    <p className="text-red-500 text-xs md:text-lg font-black uppercase tracking-[0.2em] mb-1 drop-shadow-lg">
                      {nameData[0]}
                    </p>
                  )}
                  <h3 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-2xl break-words">
                    {nameData.length > 1 ? nameData[1] : nameData[0]}
                  </h3>
                  <p className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-widest mt-4 opacity-50">{person?.kor_name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase' 

interface TarotProps {
  onBack: () => void;
}

interface IdolData {
  tarot_id: number;
  eng_name: string;
  kor_name: string;
  img_url: string;
}

export default function Tarot({ onBack }: TarotProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const [messages, setMessages] = useState<Record<number, any> | null>(null);
  const [idolsData, setIdolsData] = useState<IdolData[]>([]); 
  const [selectedCards, setSelectedCards] = useState<(number | null)[]>([null, null, null]);
  const [step, setStep] = useState(0); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isResultPhase, setIsResultPhase] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<number[]>([]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const loadingTexts = [
    "Interpretando las estrellas...",
    "Conectando con tu Bias...",
    "Revelando tu destino...",
    "La magia está sucediendo..."
  ];
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  useEffect(() => {
    setIsMounted(true);

    const cards = Array.from({ length: 22 }, (_, i) => i);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setShuffledCards(cards);

    fetch('/data/tarot_messages.json')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length);
      }, 850);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (step === 3 && buttonRef.current) {
      buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step]);

  const fetchIdolData = async (selectedIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('tarot_id, eng_name, kor_name, img_url')
        .in('tarot_id', selectedIds);
      if (error) throw error;
      if (data) setIdolsData(data as IdolData[]);
    } catch (error) {
      console.error("Error fetching idols:", error);
    }
  };

  const selectCard = (cardIdx: number) => {
    if (step > 2 || selectedCards.includes(cardIdx)) return;
    const newSelected = [...selectedCards];
    newSelected[step] = cardIdx;
    setSelectedCards(newSelected);
    if (step === 2) {
      fetchIdolData(newSelected.filter((id): id is number => id !== null));
    }
    setStep(step + 1);
  };

  // ★ 몬태그 비네트 광고 강제 호출 및 결과 보기 함수
  const handleShowResult = () => {
    // 1. 로딩창 띄우기
    setIsLoading(true);

    // 2. 몬태그 비네트 스크립트 동적 삽입 (광고 트리거)
    try {
      const s = document.createElement('script');
      s.dataset.zone = '10716622';
      s.src = 'https://izcle.com/vignette.min.js';
      // 필터링된 요소를 찾아 스크립트 추가
      const target = [document.documentElement, document.body].filter(Boolean).pop();
      if (target) {
        target.appendChild(s);
        console.log("Monetag Vignette Triggered");
      }
    } catch (err) {
      console.error("Ad error:", err);
    }

    // 3. 로딩 대기 후 결과 화면 전환
    setTimeout(() => {
      setIsLoading(false);
      setIsResultPhase(true);
      setTimeout(() => setShowFinalText(true), 5500);
    }, 3500);
  };

  const resetGame = () => {
    window.location.reload();
  };

  if (!isMounted || !messages || shuffledCards.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f051a] flex items-center justify-center text-purple-400 font-black italic tracking-widest animate-pulse font-serif uppercase">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f051a] text-white flex flex-col items-center p-4 md:p-10 relative overflow-hidden font-sans">
      
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f051a] flex flex-col items-center justify-center backdrop-blur-xl"
          >
            <div className="relative w-28 h-28 mb-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-t-purple-500 border-r-pink-500 border-b-orange-500 border-l-transparent rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              />
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">🔮</div>
            </div>
            <motion.p key={loadingTextIdx} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -15, opacity: 0 }}
              className="text-purple-300 font-black text-2xl italic tracking-tighter text-center px-6"
            >
              {loadingTexts[loadingTextIdx]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isResultPhase && (
        <button onClick={onBack} className="absolute top-6 left-6 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full z-50 text-[10px] font-bold tracking-widest hover:bg-purple-500/20 transition-all backdrop-blur-md">
          ← VOLVER
        </button>
      )}

      {/* ✅ 상단 제목 이모티콘 제거됨 */}
      <h1 className={`font-black italic transition-all duration-1000 ${isResultPhase ? 'text-2xl mt-4 text-purple-400' : 'text-5xl md:text-7xl mt-12 mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-pink-300 uppercase tracking-tighter'}`}>
        {isResultPhase ? "TU DESTINO" : "TAROT BIAS"}
      </h1>

      <div className={`flex gap-3 md:gap-8 z-10 transition-all duration-1000 ${isResultPhase ? 'mt-12 scale-110 md:scale-125' : 'mb-12 mt-5'}`}>
        {['PASADO', 'PRESENTE', 'FUTURO'].map((label, i) => {
          const cardId = selectedCards[i];
          const idol = idolsData.find(item => item.tarot_id === cardId);
          return (
            <div key={label} className="flex flex-col items-center">
              <div className="relative w-24 h-36 md:w-36 md:h-52 border-2 border-purple-500/30 rounded-2xl bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                {cardId !== null && (
                  <motion.div initial={{ y: 0, opacity: 1 }}
                    animate={isResultPhase ? { rotateY: 180, scale: [1, 1.15, 1], transition: { delay: i * 1.5 + 1, duration: 0.8 } } : {}}
                    className="absolute w-full h-full" style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] to-black border-2 border-purple-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]" style={{ backfaceVisibility: "hidden" }}>
                      <div className="text-purple-300 font-black text-xl italic opacity-70 font-serif">?</div>
                    </div>
                    <div className="absolute inset-0 bg-white rounded-xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.5)] border-2 border-purple-400" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <div className="w-full h-full flex flex-col items-center bg-gray-50">
                        <div className="w-full h-[75%] bg-zinc-200 overflow-hidden relative">
                          {idol ? (
                            <>
                              <img src={idol.img_url} alt={idol.kor_name} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-md py-1.5 border-t border-purple-500/20 text-white font-black text-center uppercase text-[8px] md:text-[10px] leading-none tracking-tighter">
                                {idol.eng_name}
                              </div>
                            </>
                          ) : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 uppercase font-bold animate-pulse font-serif">...</div>}
                        </div>
                        <div className="h-[25%] w-full bg-black flex flex-col items-center justify-center px-2 text-center border-t border-purple-500/30">
                          <span className="text-[8px] md:text-[9px] text-purple-400 font-black uppercase truncate w-full tracking-tighter">
                            {messages[cardId]?.name || 'Tarjeta'}
                          </span>
                          <p className="text-[6.5px] md:text-[8px] text-gray-400 leading-tight mt-1 line-clamp-2 italic font-light font-serif">
                             {messages[cardId]?.[i === 0 ? 'p' : i === 1 ? 'pr' : 'f'] || 'Cargando...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <span className="mt-4 font-black text-purple-300 italic text-[9px] md:text-[11px] tracking-[0.4em] uppercase">{label}</span>
            </div>
          );
        })}
      </div>

      {!isResultPhase && !isLoading && (
        <div className="w-full flex flex-col items-center mt-8">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pink-400 font-black text-sm md:text-lg italic tracking-widest mb-3 uppercase shadow-sm"
          >
            ¡ELIGE 3 CARTAS DE TAROT BIAS!
          </motion.p>
          
          <div className="relative w-full max-w-6xl h-56 flex justify-start items-end overflow-x-auto pb-6 px-10 no-scrollbar">
            <div className="flex -space-x-12 md:-space-x-16 px-20 pt-10">
              {shuffledCards.map((c: number) => (
                <motion.div key={c} whileHover={{ y: -50, rotate: 5, zIndex: 50 }} onClick={() => selectCard(c)}
                  className={`w-24 h-38 md:w-32 md:h-46 bg-gradient-to-br from-[#1a0b2e] to-[#0a0510] border-2 border-purple-400 rounded-xl cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] flex-shrink-0 transition-all duration-500 active:scale-95 ${selectedCards.includes(c) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                />
              ))}
            </div>
          </div>
          {step > 2 && (
            <motion.button 
              ref={buttonRef}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={handleShowResult} 
              className="mt-12 px-20 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full font-black text-2xl shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-bounce active:scale-95"
            >
              VER MI DESTINO ✨
            </motion.button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showFinalText && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mt-16 mb-20 bg-[#1a0b2e]/90 border border-purple-500/30 p-10 rounded-[50px] max-w-lg text-center backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-t-purple-500/20">
            <h3 className="text-pink-400 font-black mb-6 tracking-[0.6em] text-[11px] uppercase underline underline-offset-8 underline-thickness-2">LECTURA FINAL</h3>
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed font-serif italic font-light px-2">
              "El destino ha hablado a través de tus Bias. Tu pasado te dio fuerza, tu presente es un regalo divino y tu futuro brilla con una luz inigualable. ¡Confía en la magia!"
            </p>
            <button onClick={resetGame} className="mt-12 px-12 py-4 border border-purple-500/40 rounded-full text-purple-300 text-xs font-black tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all uppercase active:scale-90 shadow-lg">
              NUEVA LECTURA (REINTENTAR)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/10 blur-[150px] -z-10 rounded-full" />
    </div>
  )
}
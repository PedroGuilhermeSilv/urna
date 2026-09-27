import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, ViewTab, VoteRecord, VotingStage, VoteResultData } from './types';
import { INITIAL_CANDIDATES } from './data/candidates';
import { soundEngine } from './utils/sound';
import { HeaderNavbar } from './components/HeaderNavbar';
import { UrnaMachine } from './components/UrnaMachine';
import { CandidateCatalog } from './components/CandidateCatalog';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BoletimUrna } from './components/BoletimUrna';
import { GoogleAd } from './components/GoogleAd';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Users } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8001`;

export const App: React.FC = () => {
  // Application State
  const [candidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [digits, setDigits] = useState<string>('');
  const [isWhiteVote, setIsWhiteVote] = useState<boolean>(false);
  const [stage, setStage] = useState<VotingStage>('INPUT');
  const [activeTab, setActiveTab] = useState<ViewTab>('SIMULATOR');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showBU, setShowBU] = useState<boolean>(false);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [wsVoteResult, setWsVoteResult] = useState<VoteResultData | null>(null);

  // Vote Records (LocalStorage)
  const [records, setRecords] = useState<VoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('urna_vote_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('urna_vote_records', JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save votes:', e);
    }
  }, [records]);

  // Initial HTTP Fetch of vote counts from Redis backend
  useEffect(() => {
    const fetchInitialResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/votes/results`);
        if (res.ok) {
          const data: VoteResultData = await res.json();
          setWsVoteResult(data);
        }
      } catch (err) {
        console.warn('Initial GET /v1/votes/results fetch warning:', err);
      }
    };
    fetchInitialResults();
  }, []);

  // WebSocket Integration with Python FastAPI Backend (Redis Pub/Sub)
  useEffect(() => {
    const wsUrl = `${WS_BASE_URL}/v1/ws/results`;
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connectWs = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('⚡ WebSocket connected to backend Redis real-time stream!');
          setIsWsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (
              payload.event === 'INITIAL_COUNT' ||
              payload.event === 'VOTE_COUNT_UPDATED' ||
              payload.event === 'VOTES_RESET'
            ) {
              console.log('📡 Real-time Redis Vote Event:', payload);
              if (payload.data) {
                setWsVoteResult(payload.data);
              }
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        socket.onclose = () => {
          setIsWsConnected(false);
          reconnectTimeout = setTimeout(connectWs, 3000);
        };

        socket.onerror = () => {
          setIsWsConnected(false);
          socket?.close();
        };
      } catch (err) {
        setIsWsConnected(false);
        reconnectTimeout = setTimeout(connectWs, 3000);
      }
    };

    connectWs();

    return () => {
      clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, []);

  // Candidate Match
  const candidateMatch = candidates.find((c) => c.number === digits) || null;
  const isInvalidVote = digits.length === 2 && !candidateMatch && !isWhiteVote;

  // Audio Toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  // Keyboard Handlers
  const handleNumberClick = useCallback((num: string) => {
    if (stage === 'ENDED') return;
    if (isWhiteVote) return;
    if (digits.length >= 2) {
      soundEngine.playErrorBeep();
      return;
    }
    soundEngine.playBeep();
    setDigits((prev) => prev + num);
  }, [digits.length, isWhiteVote, stage]);

  const handleWhiteClick = useCallback(() => {
    if (stage === 'ENDED') return;
    if (digits.length > 0) {
      soundEngine.playErrorBeep();
      return;
    }
    soundEngine.playBeep();
    setIsWhiteVote(true);
  }, [digits.length, stage]);

  const handleCorrigeClick = useCallback(() => {
    if (stage === 'ENDED') return;
    soundEngine.playBeep();
    setDigits('');
    setIsWhiteVote(false);
  }, [stage]);

  const handleConfirmaClick = useCallback(() => {
    if (stage === 'ENDED') return;

    const canConfirmWhite = isWhiteVote;
    const canConfirmCandidate = digits.length === 2;

    if (!canConfirmWhite && !canConfirmCandidate) {
      soundEngine.playErrorBeep();
      return;
    }

    setStage('ENDED');

    // Confetti Animation
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00875a', '#f36b00', '#f59e0b', '#38bdf8'],
    });

    // Save Vote Record & Send to Python Backend Queue Schema (Redis)
    let newRecord: VoteRecord;
    let voteTypeStr: 'WHITE' | 'VALID' | 'NULL';

    if (isWhiteVote) {
      voteTypeStr = 'WHITE';
      newRecord = {
        id: Date.now().toString(),
        candidateName: 'VOTO EM BRANCO',
        voteType: 'WHITE',
        timestamp: new Date().toISOString(),
      };
    } else if (candidateMatch) {
      voteTypeStr = 'VALID';
      newRecord = {
        id: Date.now().toString(),
        candidateNumber: candidateMatch.number,
        candidateName: candidateMatch.name,
        partyAcronym: candidateMatch.partyAcronym,
        voteType: 'VALID',
        timestamp: new Date().toISOString(),
      };
    } else {
      voteTypeStr = 'NULL';
      newRecord = {
        id: Date.now().toString(),
        candidateName: 'VOTO NULO',
        voteType: 'NULL',
        timestamp: new Date().toISOString(),
      };
    }

    setRecords((prev) => [...prev, newRecord]);

    // Async POST to Python Backend Queue endpoint
    fetch(`${API_BASE_URL}/v1/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vote_type: voteTypeStr,
        candidate_number: candidateMatch?.number,
        candidate_name: candidateMatch?.name,
        party_acronym: candidateMatch?.partyAcronym,
      }),
    }).catch((err) => {
      console.warn('Backend API connection warning:', err);
    });

    // Play TSE Pilili Audio Tone
    soundEngine.playPilili();

    // Auto Reset Machine for next voter after 3 seconds
    setTimeout(() => {
      setDigits('');
      setIsWhiteVote(false);
      setStage('INPUT');
    }, 3200);
  }, [candidateMatch, digits.length, isWhiteVote, stage]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.repeat) return; // Prevent continuous repeat when key is held down

      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleCorrigeClick();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleConfirmaClick();
      } else if (e.key.toLowerCase() === 'b') {
        handleWhiteClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleConfirmaClick, handleCorrigeClick, handleNumberClick, handleWhiteClick]);

  const totalVotesCount = wsVoteResult?.total_votes ?? records.length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        totalVotesCount={totalVotesCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
        
        {/* Top Overview Banner: Contagem Geral */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Contagem Geral de Votos
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    isWsConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isWsConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                    }`}
                  />
                  {isWsConnected ? 'Ao Vivo (Redis)' : 'Off-line'}
                </span>
              </div>
              <div className="text-xl sm:text-3xl font-black text-white font-mono mt-0.5">
                {totalVotesCount} <span className="text-xs sm:text-sm font-sans text-slate-400 font-semibold">votos computados</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
            <span>🗳️ Digite o número do candidato na Urna para registrar seu voto</span>
          </div>
        </motion.div>

        {/* Candidate Quick Ribbon (Visible on Tablet/Desktop, Hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:flex bg-slate-900/70 border border-slate-800 rounded-2xl p-3 items-center justify-between gap-4 overflow-x-auto shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Escolha um Candidato:
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto py-1">
            {candidates.map((cand) => (
              <motion.button
                key={cand.number}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  handleCorrigeClick();
                  soundEngine.playBeep();
                  setDigits(cand.number);
                  if (activeTab !== 'SIMULATOR') setActiveTab('SIMULATOR');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                  digits === cand.number
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <img
                  src={cand.photoUrl}
                  alt={cand.name}
                  className="w-5 h-6 object-cover rounded-md bg-slate-950"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      cand.name
                    )}&size=64`;
                  }}
                />
                <span className="font-mono text-emerald-400 font-extrabold">{cand.number}</span>
                <span className="truncate max-w-[130px]">{cand.name.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('CANDIDATES')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 group"
          >
            <span>Ver fotos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Tab Views */}
        <AnimatePresence mode="wait">
          {activeTab === 'SIMULATOR' && (
            <motion.div
              key="SIMULATOR"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Electronic Voting Machine */}
              <UrnaMachine
                stage={stage}
                digits={digits}
                candidate={candidateMatch}
                isWhiteVote={isWhiteVote}
                isInvalidVote={isInvalidVote}
                onNumberClick={handleNumberClick}
                onWhiteClick={handleWhiteClick}
                onCorrigeClick={handleCorrigeClick}
                onConfirmaClick={handleConfirmaClick}
              />

              {/* Google AdSense Banner */}
              <GoogleAd className="my-4" />

              {/* Real-time Vote Count & Apuração Dashboard */}
              <ResultsDashboard
                records={records}
                candidates={candidates}
                voteResult={wsVoteResult}
                onOpenBU={() => setShowBU(true)}
                onClearVotes={() => {
                  if (window.confirm('Tem certeza que deseja zerar os votos desta urna?')) {
                    setRecords([]);
                    setWsVoteResult({
                      total_votes: 0,
                      candidate_counts: {},
                      white_votes: 0,
                      null_votes: 0,
                    });
                    fetch(`${API_BASE_URL}/v1/votes`, { method: 'DELETE' }).catch((err) =>
                      console.warn('Failed to clear votes on backend:', err)
                    );
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'CANDIDATES' && (
            <motion.div
              key="CANDIDATES"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CandidateCatalog
                candidates={candidates}
                onSelectCandidate={(num) => {
                  handleCorrigeClick();
                  setDigits(num);
                  setActiveTab('SIMULATOR');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'RESULTS' && (
            <motion.div
              key="RESULTS"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ResultsDashboard
                records={records}
                candidates={candidates}
                voteResult={wsVoteResult}
                onOpenBU={() => setShowBU(true)}
                onClearVotes={() => {
                  if (window.confirm('Tem certeza que deseja zerar os votos desta urna?')) {
                    setRecords([]);
                    setWsVoteResult({
                      total_votes: 0,
                      candidate_counts: {},
                      white_votes: 0,
                      null_votes: 0,
                    });
                    fetch(`${API_BASE_URL}/v1/votes`, { method: 'DELETE' }).catch((err) =>
                      console.warn('Failed to clear votes on backend:', err)
                    );
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Boletim de Urna Ticket Modal */}
      {showBU && (
        <BoletimUrna
          records={records}
          candidates={candidates}
          voteResult={wsVoteResult}
          onClose={() => setShowBU(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 mt-12 bg-slate-950/50 text-slate-400 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Simulador de Urna Eletrônica
          </span>
          <span className="text-slate-500">
            Este site é apenas uma simulação interativa sem vínculo com a Justiça Eleitoral e não representa a realidade.
          </span>
        </div>
      </footer>
    </div>
  );
};


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, VotingStage } from '../types';

interface UrnaScreenProps {
  stage: VotingStage;
  digits: string;
  candidate: Candidate | null;
  isWhiteVote: boolean;
  isInvalidVote: boolean;
}

export const UrnaScreen: React.FC<UrnaScreenProps> = ({
  stage,
  digits,
  candidate,
  isWhiteVote,
  isInvalidVote,
}) => {
  if (stage === 'ENDED') {
    return (
      <div className="w-full h-full min-h-[220px] sm:min-h-[340px] md:min-h-[400px] bg-[#dbe5e7] text-[#0f172a] rounded-xl p-3 sm:p-5 md:p-6 flex flex-col items-center justify-between shadow-inner font-mono relative overflow-hidden select-none border-2 sm:border-4 border-[#a3b5bc]">
        <div className="absolute inset-0 bg-[radial-gradient(#9bb0bb_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-35 pointer-events-none" />

        <div className="w-full text-right text-[9px] sm:text-xs font-bold tracking-widest text-slate-600 uppercase border-b border-slate-400/60 pb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[8px] sm:text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
            SIMULADOR INTERATIVO
          </span>
          <span className="truncate">SIMULADOR ELEITORAL</span>
        </div>

        {/* Big Animated FIM Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex-1 flex flex-col items-center justify-center my-auto text-center py-2 sm:py-4"
        >
          <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-widest text-[#05202a] font-mono drop-shadow-md">
            FIM
          </span>
          <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-200/60 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded border border-emerald-400/50 animate-pulse">
            Voto Gravado com Sucesso
          </span>
        </motion.div>

        <div className="w-full text-center text-[9px] sm:text-xs font-bold tracking-wider text-slate-700 uppercase border-t border-slate-400/60 pt-1">
          OBRIGADO PELO SEU VOTO
        </div>
      </div>
    );
  }

  const maxDigits = 2;
  const digitsArray = Array.from({ length: maxDigits }, (_, index) => digits[index] || '');

  return (
    <div className="w-full h-full min-h-[220px] sm:min-h-[340px] md:min-h-[400px] bg-[#dce6e8] text-[#0f172a] rounded-xl p-2.5 sm:p-4 md:p-5 flex flex-col justify-between shadow-inner font-mono relative overflow-hidden select-none border-2 sm:border-4 border-[#abbcc3]">
      {/* LCD Texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#98adb8_1.5px,transparent_1.5px)] [background-size:10px_10px] opacity-30 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        
        {/* Top Header */}
        <div>
          <div className="text-[9px] sm:text-xs font-bold tracking-wider uppercase text-slate-600">
            SEU VOTO VAI PARA
          </div>

          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-0.5 text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-slate-900"
          >
            PRESIDENTE
          </motion.div>
        </div>

        {/* Middle Inputs & Candidate Details */}
        <div className="my-1 sm:my-2 flex-1 flex justify-between items-start gap-2 sm:gap-4">
          
          <div className="flex-1 min-w-0 pr-1">
            {/* Digits Display */}
            {!isWhiteVote && (
              <div className="flex items-center gap-1 sm:gap-2 my-1 sm:my-2">
                <span className="text-[9px] sm:text-xs font-bold uppercase text-slate-700 mr-0.5">Nº:</span>
                {digitsArray.map((digit, idx) => {
                  const isActive = idx === digits.length && stage === 'INPUT';
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: digit ? [1.1, 1] : 1 }}
                      transition={{ duration: 0.15 }}
                      className={`w-8 h-10 sm:w-12 sm:h-14 md:h-16 border-2 flex items-center justify-center text-xl sm:text-3xl md:text-4xl font-black bg-white/90 rounded-md shadow-sm ${
                        isActive
                          ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-500/30'
                          : 'border-slate-700'
                      }`}
                    >
                      {digit ? (
                        <span className="text-slate-900">{digit}</span>
                      ) : isActive ? (
                        <span className="animate-pulse text-emerald-700 text-lg sm:text-xl font-extrabold">_</span>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Candidate Details */}
            <AnimatePresence mode="wait">
              {candidate && (
                <motion.div
                  key={candidate.number}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 text-xs sm:text-sm"
                >
                  <div>
                    <span className="font-bold uppercase text-slate-600 text-[9px] sm:text-[11px] block">Nome:</span>
                    <span className="font-black text-slate-950 text-xs sm:text-base md:text-lg leading-tight uppercase block break-words">
                      {candidate.name}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold uppercase text-slate-600 text-[9px] sm:text-[11px] block">Partido:</span>
                    <span className="font-extrabold text-slate-900 text-[11px] sm:text-sm block">
                      {candidate.partyAcronym} <span className="text-slate-700 font-bold hidden sm:inline">({candidate.party})</span>
                    </span>
                  </div>

                  {candidate.viceName && (
                    <div className="pt-0.5">
                      <span className="font-bold uppercase text-slate-600 text-[8px] sm:text-[10px] block">Vice:</span>
                      <span className="font-bold text-slate-800 text-[10px] sm:text-xs block truncate">
                        {candidate.viceName}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* White Vote Display */}
              {isWhiteVote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="my-auto py-3 sm:py-6 text-center"
                >
                  <div className="text-base sm:text-2xl md:text-3xl font-black tracking-wider text-slate-900 animate-pulse bg-white/40 py-1.5 sm:py-2.5 px-2 rounded-lg border border-slate-400">
                    VOTO EM BRANCO
                  </div>
                </motion.div>
              )}

              {/* Invalid Vote Display */}
              {isInvalidVote && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 sm:mt-3 space-y-0.5 bg-red-100/70 p-1.5 sm:p-2.5 rounded-lg border border-red-300"
                >
                  <div className="text-[9px] sm:text-xs font-bold text-amber-900 uppercase">
                    NÚMERO ERRADO
                  </div>
                  <div className="text-sm sm:text-xl md:text-2xl font-black tracking-wider text-red-700 uppercase animate-pulse">
                    VOTO NULO
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Candidate Photo Frame - Mobile-Optimized HD Size */}
          <AnimatePresence>
            {candidate && candidate.photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-16 sm:w-28 md:w-36 flex flex-col items-center bg-white p-0.5 sm:p-1 rounded-lg sm:rounded-xl border-2 border-slate-700 shadow-xl shrink-0"
              >
                <div className="w-full h-20 sm:h-36 md:h-44 bg-slate-200 overflow-hidden relative border border-slate-300 rounded sm:rounded-lg">
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        candidate.name
                      )}&background=00875a&color=fff&size=256`;
                    }}
                  />
                </div>
                <div className="w-full text-center bg-slate-900 text-white font-bold text-[7px] sm:text-[10px] py-0.5 sm:py-1 tracking-wider uppercase mt-0.5 sm:mt-1 rounded-sm sm:rounded-md">
                  PRESIDENTE
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Instructions Footer */}
        <div className="border-t sm:border-t-2 border-slate-700/80 pt-1 sm:pt-2 text-[9px] sm:text-[11px] leading-tight text-slate-800">
          <div className="font-bold text-[8px] sm:text-[10px] uppercase text-slate-600 mb-0.5">
            Aperte a tecla:
          </div>
          <div className="flex flex-wrap justify-between items-center gap-1 font-bold">
            <span className="text-emerald-900 bg-emerald-200/80 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded border border-emerald-400/50">
              VERDE <span className="font-normal text-slate-800">para</span> CONFIRMAR
            </span>
            <span className="text-amber-900 bg-amber-200/80 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded border border-amber-400/50">
              LARANJA <span className="font-normal text-slate-800">para</span> REINICIAR
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

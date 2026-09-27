import React from 'react';
import { motion } from 'framer-motion';
import { Candidate, VotingStage } from '../types';
import { UrnaScreen } from './UrnaScreen';
import { UrnaKeypad } from './UrnaKeypad';
import { ShieldCheck, Lock } from 'lucide-react';

interface UrnaMachineProps {
  stage: VotingStage;
  digits: string;
  candidate: Candidate | null;
  isWhiteVote: boolean;
  isInvalidVote: boolean;
  onNumberClick: (num: string) => void;
  onWhiteClick: () => void;
  onCorrigeClick: () => void;
  onConfirmaClick: () => void;
}

export const UrnaMachine: React.FC<UrnaMachineProps> = ({
  stage,
  digits,
  candidate,
  isWhiteVote,
  isInvalidVote,
  onNumberClick,
  onWhiteClick,
  onCorrigeClick,
  onConfirmaClick,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Outer Physical Urna Shell Frame */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-gradient-to-b from-[#232936] via-[#1a202c] to-[#121620] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 border border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Hardware Metallic Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/40 via-teal-400/80 to-blue-500/40" />

        {/* Machine Header Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#141822] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-800 mb-4 sm:mb-6">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-wider text-slate-100 uppercase">
                  Terminal de Votação
                </h2>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">
                  NÃO OFICIAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">SIMULAÇÃO INTERATIVA</p>
            </div>
          </div>

          {/* Hardware Status Indicator */}
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${stage === 'ENDED' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-slate-300 font-bold uppercase text-[10px] sm:text-[11px]">
                {stage === 'ENDED' ? 'GRAVANDO VOTO' : 'PRONTA'}
              </span>
            </div>
          </div>

        </div>

        {/* Main Machine Grid (Screen + Keypad) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          
          {/* LCD Screen Section */}
          <div className="lg:col-span-7 h-[360px] sm:h-[420px] md:h-[460px]">
            <UrnaScreen
              stage={stage}
              digits={digits}
              candidate={candidate}
              isWhiteVote={isWhiteVote}
              isInvalidVote={isInvalidVote}
            />
          </div>

          {/* Physical Keypad Section */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <UrnaKeypad
              onNumberClick={onNumberClick}
              onWhiteClick={onWhiteClick}
              onCorrigeClick={onCorrigeClick}
              onConfirmaClick={onConfirmaClick}
              disabled={stage === 'ENDED'}
            />
          </div>

        </div>

      </motion.div>
    </div>
  );
};

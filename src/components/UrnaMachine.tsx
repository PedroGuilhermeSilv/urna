import React from 'react';
import { motion } from 'framer-motion';
import { Candidate, VotingStage } from '../types';
import { UrnaScreen } from './UrnaScreen';
import { UrnaKeypad } from './UrnaKeypad';
import { ShieldCheck, Cpu, Signal, Lock } from 'lucide-react';

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
        className="bg-gradient-to-b from-[#232936] via-[#1a202c] to-[#121620] rounded-3xl p-5 md:p-8 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Subtle Hardware Metallic Highlights */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/40 via-teal-400/80 to-blue-500/40" />

        {/* Machine Header Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141822] px-5 py-3 rounded-2xl border border-slate-800 mb-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-wider text-slate-100 uppercase">
                  Terminal de Votação (Simulador)
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  NÃO OFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">SIMULAÇÃO INTERATIVA DE URNA ELETRÔNICA</p>
            </div>
          </div>

          {/* Hardware Status Indicators */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${stage === 'ENDED' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-slate-300 font-bold uppercase text-[11px]">
                {stage === 'ENDED' ? 'GRAVANDO VOTO' : 'ONLINE PRONTA'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>LACRE DIGITAL TICKET #85E6</span>
            </div>
          </div>

        </div>

        {/* Main Machine Grid (Screen + Keypad) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LCD Screen Section (7 cols) */}
          <div className="lg:col-span-7 h-[420px] md:h-[460px]">
            <UrnaScreen
              stage={stage}
              digits={digits}
              candidate={candidate}
              isWhiteVote={isWhiteVote}
              isInvalidVote={isInvalidVote}
            />
          </div>

          {/* Physical Keypad Section (5 cols) */}
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

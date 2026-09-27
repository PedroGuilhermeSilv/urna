import React from 'react';
import { motion } from 'framer-motion';
import { VoteRecord, Candidate } from '../types';
import { BarChart3, FileText, Trash2, PieChart, Users, Trophy } from 'lucide-react';

interface ResultsDashboardProps {
  records: VoteRecord[];
  candidates: Candidate[];
  onOpenBU: () => void;
  onClearVotes: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  records,
  candidates,
  onOpenBU,
  onClearVotes,
}) => {
  const totalVotes = records.length;

  const counts: Record<string, number> = {};
  candidates.forEach((c) => (counts[c.number] = 0));
  let whiteVotes = 0;
  let nullVotes = 0;

  records.forEach((rec) => {
    if (rec.voteType === 'WHITE') {
      whiteVotes++;
    } else if (rec.voteType === 'NULL') {
      nullVotes++;
    } else if (rec.candidateNumber && counts[rec.candidateNumber] !== undefined) {
      counts[rec.candidateNumber]++;
    }
  });

  const sortedCandidates = [...candidates].sort((a, b) => (counts[b.number] || 0) - (counts[a.number] || 0));
  const leadingCandidate = totalVotes > 0 && counts[sortedCandidates[0].number] > 0 ? sortedCandidates[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-100 flex items-center gap-2">
              Apuração dos Votos
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Contagem em tempo real nesta sessão</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onOpenBU}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Boletim de Urna</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onClearVotes}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl text-xs font-semibold transition-all"
            title="Zerar Urna"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Zerar</span>
          </motion.button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-lg">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{totalVotes}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Total de Votos</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-lg">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-black text-slate-100 truncate">
              {leadingCandidate ? leadingCandidate.name : 'Aguardando votos'}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
              {leadingCandidate ? `Líder (${counts[leadingCandidate.number]} votos)` : 'Nenhum voto gravado'}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-lg">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <PieChart className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-100">
              Brancos: {whiteVotes} | Nulos: {nullVotes}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Declarações</div>
          </div>
        </div>

      </div>

      {/* Candidate Votes Breakdown */}
      <div className="space-y-2.5 sm:space-y-3">
        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
          Distribuição dos Votos por Candidato
        </h4>

        <div className="space-y-2.5 sm:space-y-3">
          {sortedCandidates.map((cand) => {
            const count = counts[cand.number] || 0;
            const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
            const isWinner = leadingCandidate?.number === cand.number && count > 0;

            return (
              <div
                key={cand.number}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 sm:p-4 space-y-2 hover:border-slate-600 transition-colors shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-black text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      {cand.number}
                    </span>
                    <span className="font-extrabold text-slate-100 truncate max-w-[140px] sm:max-w-none">{cand.name}</span>
                    <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">({cand.partyAcronym})</span>
                    {isWinner && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.2 rounded-full border border-amber-500/30 flex items-center gap-1">
                        🏆 1º
                      </span>
                    )}
                  </div>

                  <div className="text-right font-mono text-xs sm:text-sm font-black text-slate-100 shrink-0">
                    {count} <span className="text-[10px] sm:text-xs text-slate-400 font-normal">({percentage}%)</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 sm:h-3 overflow-hidden p-0.5 border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(Number(percentage), 0)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isWinner
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-sm'
                        : 'bg-gradient-to-r from-slate-500 to-slate-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

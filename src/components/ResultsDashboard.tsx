import React from 'react';
import { motion } from 'framer-motion';
import { VoteRecord, Candidate } from '../types';
import { BarChart3, FileText, Trash2, Award, PieChart, Users, Trophy } from 'lucide-react';

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
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
              Apuramento de Votos em Tempo Real
            </h3>
            <p className="text-xs text-slate-400">Resultados da sessão atual de votação</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onOpenBU}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            Gerar Boletim de Urna (BU)
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onClearVotes}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl text-xs font-semibold transition-all"
            title="Zerar Urna"
          >
            <Trash2 className="w-4 h-4" />
            Zerar Urna
          </motion.button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100 font-mono">{totalVotes}</div>
            <div className="text-xs text-slate-400 font-medium">Total de Votos Registrados</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-black text-slate-100 truncate">
              {leadingCandidate ? leadingCandidate.name : 'Aguardando votos'}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {leadingCandidate ? `Líder (${counts[leadingCandidate.number]} votos)` : 'Nenhum voto gravado'}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PieChart className="w-7 h-7" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-100">
              Brancos: {whiteVotes} | Nulos: {nullVotes}
            </div>
            <div className="text-xs text-slate-400 font-medium">Declarações Alternativas</div>
          </div>
        </div>

      </div>

      {/* Candidate Votes Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Distribuição dos Votos por Candidato
        </h4>

        <div className="space-y-3">
          {sortedCandidates.map((cand) => {
            const count = counts[cand.number] || 0;
            const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
            const isWinner = leadingCandidate?.number === cand.number && count > 0;

            return (
              <div
                key={cand.number}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-2.5 hover:border-slate-600 transition-colors shadow-md"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      {cand.number}
                    </span>
                    <span className="font-extrabold text-slate-100 truncate">{cand.name}</span>
                    <span className="text-xs text-slate-400 font-semibold">({cand.partyAcronym})</span>
                    {isWinner && (
                      <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-sm">
                        🏆 1º Lugar
                      </span>
                    )}
                  </div>

                  <div className="text-right font-mono text-sm font-black text-slate-100 shrink-0">
                    {count} votos <span className="text-xs text-slate-400 font-normal">({percentage}%)</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
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

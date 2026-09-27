import React from 'react';
import { motion } from 'framer-motion';
import { Candidate, VoteRecord, VoteResultData } from '../types';
import { Trophy } from 'lucide-react';

interface Top3LeadersProps {
  candidates: Candidate[];
  records: VoteRecord[];
  voteResult?: VoteResultData | null;
  onSelectCandidate?: (number: string) => void;
}

export const Top3Leaders: React.FC<Top3LeadersProps> = ({
  candidates,
  records,
  voteResult,
  onSelectCandidate,
}) => {
  const counts: Record<string, number> = {};
  candidates.forEach((c) => (counts[c.number] = 0));

  let totalVotes = 0;

  if (voteResult) {
    totalVotes = voteResult.total_votes;
    candidates.forEach((c) => {
      counts[c.number] = voteResult.candidate_counts[c.number] || 0;
    });
  } else {
    totalVotes = records.length;
    records.forEach((rec) => {
      if (rec.candidateNumber && counts[rec.candidateNumber] !== undefined) {
        counts[rec.candidateNumber]++;
      }
    });
  }

  const sortedCandidates = [...candidates].sort(
    (a, b) => (counts[b.number] || 0) - (counts[a.number] || 0)
  );

  const top3 = sortedCandidates.slice(0, 3);

  const badges = [
    {
      title: '1º LUGAR',
      medal: '🥇',
      bg: 'from-amber-500/20 via-slate-900 to-slate-950',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      progressBg: 'from-amber-500 via-yellow-400 to-emerald-400',
    },
    {
      title: '2º LUGAR',
      medal: '🥈',
      bg: 'from-slate-700/30 via-slate-900 to-slate-950',
      border: 'border-slate-500/40',
      text: 'text-slate-300',
      progressBg: 'from-slate-400 to-slate-200',
    },
    {
      title: '3º LUGAR',
      medal: '🥉',
      bg: 'from-amber-800/20 via-slate-900 to-slate-950',
      border: 'border-amber-700/40',
      text: 'text-amber-500',
      progressBg: 'from-amber-700 to-amber-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span>Top 3 Candidatos</span>
        </h3>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
          {totalVotes} {totalVotes === 1 ? 'voto total' : 'votos totais'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {top3.map((cand, index) => {
          const count = counts[cand.number] || 0;
          const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
          const badgeStyle = badges[index] || badges[2];
          const firstName = cand.name.split(' ')[0];

          return (
            <motion.div
              key={cand.number}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCandidate && onSelectCandidate(cand.number)}
              className={`relative bg-gradient-to-b ${badgeStyle.bg} border ${badgeStyle.border} rounded-xl sm:rounded-2xl p-2 sm:p-3.5 flex flex-col justify-between shadow-lg cursor-pointer transition-all group overflow-hidden`}
            >
              {/* Top Row: Medal Badge & Candidate Number */}
              <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
                <span className="flex items-center gap-1 font-extrabold text-[9px] sm:text-[11px] bg-slate-950/80 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-slate-700/80 shadow-inner truncate">
                  <span className="text-xs sm:text-sm">{badgeStyle.medal}</span>
                  <span className={`${badgeStyle.text} hidden xs:inline sm:inline`}>{badgeStyle.title}</span>
                </span>
                <span className="font-mono font-black text-[9px] sm:text-xs text-emerald-400 bg-emerald-950/90 px-1 sm:px-2 py-0.5 rounded border border-emerald-800/60 shadow-sm shrink-0">
                  {cand.number}
                </span>
              </div>

              {/* Candidate Info + Photo */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 my-0.5">
                <div className="relative w-10 h-12 sm:w-14 sm:h-16 rounded-lg sm:rounded-xl bg-slate-950 overflow-hidden border border-slate-700 shadow-md shrink-0">
                  <img
                    src={cand.photoUrl}
                    alt={cand.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        cand.name
                      )}&background=00875a&color=fff&size=128`;
                    }}
                  />
                  {cand.partyIconUrl && (
                    <img
                      src={cand.partyIconUrl}
                      alt={cand.partyAcronym}
                      className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded bg-slate-900/90 p-0.5 border border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left w-full">
                  <div className="font-extrabold text-[11px] sm:text-base text-slate-100 truncate leading-tight group-hover:text-emerald-400 transition-colors">
                    <span className="sm:hidden">{firstName}</span>
                    <span className="hidden sm:inline">{cand.name}</span>
                  </div>
                  <div className="text-[9px] sm:text-xs text-slate-400 font-semibold truncate mt-0.5">
                    {cand.partyAcronym}
                    <span className="hidden sm:inline text-[10px] text-slate-500 font-normal"> ({cand.party})</span>
                  </div>
                  <div className="mt-0.5 sm:mt-1 flex items-baseline justify-center sm:justify-start gap-1 font-mono">
                    <span className="text-xs sm:text-lg font-black text-white">{percentage}%</span>
                    <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">({count} {count === 1 ? 'voto' : 'votos'})</span>
                  </div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden p-0.5 border border-slate-800 mt-1 sm:mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(Number(percentage), 0)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${badgeStyle.progressBg}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

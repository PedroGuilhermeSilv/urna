import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '../types';
import { UserCheck, Shield, Sparkles, X, Search } from 'lucide-react';

interface CandidateCatalogProps {
  candidates: Candidate[];
  onSelectCandidate: (number: string) => void;
  onClose?: () => void;
}

export const CandidateCatalog: React.FC<CandidateCatalogProps> = ({
  candidates,
  onSelectCandidate,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase()) ||
      c.partyAcronym.toLowerCase().includes(search.toLowerCase()) ||
      c.number.includes(search)
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.25 }}
      className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 sm:p-6 md:p-7 shadow-2xl backdrop-blur-xl space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner shrink-0">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-100 flex items-center gap-2">
              Candidatos a Presidente
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Clique para preencher o número na Urna
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar candidato ou nº..."
              className="bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60 w-full sm:w-56 transition-all"
            />
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Candidates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence>
          {filteredCandidates.map((candidate, idx) => (
            <motion.div
              key={candidate.number}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ scale: 1.02, y: -3 }}
              onClick={() => onSelectCandidate(candidate.number)}
              className="group relative bg-gradient-to-b from-slate-800/80 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/60 hover:border-emerald-500/60 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-emerald-950/40 flex gap-3.5 items-center overflow-hidden"
            >
              {/* Number Badge */}
              <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-300 font-mono font-black text-base sm:text-lg px-2.5 py-0.5 rounded-xl border border-emerald-500/40 shadow-sm group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                {candidate.number}
              </div>

              {/* Candidate Photo */}
              <div className="w-16 h-22 sm:w-20 sm:h-26 rounded-xl bg-slate-950 overflow-hidden border-2 border-slate-700 group-hover:border-emerald-500/70 shrink-0 relative shadow-md">
                <img
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      candidate.name
                    )}&background=00875a&color=fff&size=256`;
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 text-[8px] sm:text-[9px] text-center text-slate-200 py-0.5 font-bold uppercase tracking-wider">
                  {candidate.partyAcronym}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-bold mb-0.5">
                  <Shield className="w-3 h-3" />
                  <span>{candidate.party}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-100 truncate group-hover:text-emerald-300 transition-colors uppercase">
                  {candidate.name}
                </h4>
                {candidate.viceName && (
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5 sm:mt-1">
                    <span className="text-slate-500 font-medium">Vice:</span> {candidate.viceName}
                  </p>
                )}

                <div className="mt-2 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Selecionar</span>
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

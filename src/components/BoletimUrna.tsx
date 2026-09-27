import React from 'react';
import { VoteRecord, Candidate } from '../types';
import { Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface BoletimUrnaProps {
  records: VoteRecord[];
  candidates: Candidate[];
  onClose: () => void;
}

export const BoletimUrna: React.FC<BoletimUrnaProps> = ({ records, candidates, onClose }) => {
  const now = new Date().toLocaleString('pt-BR');

  // Count votes
  const candidateCounts: Record<string, number> = {};
  candidates.forEach((c) => (candidateCounts[c.number] = 0));
  let whiteVotes = 0;
  let nullVotes = 0;

  records.forEach((rec) => {
    if (rec.voteType === 'WHITE') {
      whiteVotes++;
    } else if (rec.voteType === 'NULL') {
      nullVotes++;
    } else if (rec.candidateNumber && candidateCounts[rec.candidateNumber] !== undefined) {
      candidateCounts[rec.candidateNumber]++;
    }
  });

  const totalVotes = records.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#f8fafc] text-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 font-mono relative my-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-4 print:hidden">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-sm uppercase">Boletim de Urna Oficial</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Content */}
        <div className="text-center space-y-2 border-b-2 border-dashed border-slate-400 pb-4">
          <div className="text-sm font-extrabold tracking-widest uppercase">
            JUSTIÇA ELEITORAL
          </div>
          <div className="text-xs font-bold text-slate-700 uppercase">
            BOLETIM DE URNA (BU)
          </div>
          <div className="text-[11px] text-slate-600">
            ELEIÇÕES SIMULADAS 2026 - PRESIDENTE
          </div>
          <div className="text-[10px] text-slate-500">
            MUNICÍPIO: 99999 • ZONA: 001 • SEÇÃO: 0042
          </div>
          <div className="text-[10px] text-slate-500">
            DATA DA EMISSÃO: {now}
          </div>
        </div>

        {/* Results List */}
        <div className="my-4 space-y-2 text-xs">
          <div className="font-bold border-b border-slate-300 pb-1 flex justify-between uppercase text-slate-700">
            <span>CANDIDATO / OPÇÃO</span>
            <span>VOTOS</span>
          </div>

          {candidates.map((cand) => {
            const count = candidateCounts[cand.number] || 0;
            const pct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
            return (
              <div key={cand.number} className="flex justify-between items-center border-b border-slate-200 py-1">
                <div>
                  <span className="font-bold text-slate-900 mr-2">{cand.number}</span>
                  <span className="text-slate-800 font-semibold">{cand.name}</span>
                  <span className="text-slate-500 text-[10px] block">({cand.partyAcronym})</span>
                </div>
                <div className="text-right font-extrabold text-slate-900">
                  {count} <span className="text-[10px] font-normal text-slate-600">({pct}%)</span>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center border-b border-slate-200 py-1 pt-2">
            <span className="font-bold text-slate-700">VOTOS EM BRANCO</span>
            <span className="font-extrabold text-slate-900">
              {whiteVotes} <span className="text-[10px] font-normal text-slate-600">({totalVotes > 0 ? ((whiteVotes / totalVotes) * 100).toFixed(1) : '0.0'}%)</span>
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-200 py-1">
            <span className="font-bold text-slate-700">VOTOS NULOS</span>
            <span className="font-extrabold text-slate-900">
              {nullVotes} <span className="text-[10px] font-normal text-slate-600">({totalVotes > 0 ? ((nullVotes / totalVotes) * 100).toFixed(1) : '0.0'}%)</span>
            </span>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-slate-200/70 p-3 rounded-lg border border-slate-300 text-xs space-y-1 my-4">
          <div className="flex justify-between font-bold text-slate-900">
            <span>TOTAL DE VETORES APURADOS:</span>
            <span className="text-sm text-emerald-800">{totalVotes}</span>
          </div>
        </div>

        {/* Security Stamp Footer */}
        <div className="text-center pt-3 border-t-2 border-dashed border-slate-400 space-y-1 text-[9px] text-slate-500">
          <div className="font-mono text-slate-600 break-all">
            HASH: A97CF50B-A4CF-33D2-90BE-85E6TSE2026
          </div>
          <div>ASSINATURA DIGITAL VALIDA • SISTEMA ELEITORAL SIMULADO</div>
        </div>
      </div>
    </div>
  );
};

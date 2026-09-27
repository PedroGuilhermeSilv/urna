import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, MessageCircle, Send, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';
import { VoteRecord, Candidate, VoteResultData } from '../types';

interface ShareVoteModalProps {
  lastVote?: VoteRecord | null;
  candidates?: Candidate[];
  voteResult?: VoteResultData | null;
  onClose: () => void;
}

export const ShareVoteModal: React.FC<ShareVoteModalProps> = ({
  lastVote,
  candidates = [],
  voteResult,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin + window.location.pathname;

  // Match candidate details
  const candidateMatch = lastVote?.candidateNumber
    ? candidates.find((c) => c.number === lastVote.candidateNumber) || null
    : null;

  // Calculate vote metrics
  const totalVotes = voteResult?.total_votes || 0;
  const candidateCount = candidateMatch && voteResult?.candidate_counts
    ? (voteResult.candidate_counts[candidateMatch.number] || 0)
    : 0;
  const percentage = totalVotes > 0 && candidateCount > 0
    ? ((candidateCount / totalVotes) * 100).toFixed(1)
    : null;

  // Dynamic share text
  let shareMessage = `🗳️ Participe da Pesquisa Eleitoral 2026 (Não Oficial) e acompanhe a apuração ao vivo! Vote aqui: ${siteUrl}`;

  if (lastVote?.voteType === 'WHITE') {
    shareMessage = `🗳️ Acabei de registrar meu voto EM BRANCO na Pesquisa Eleitoral 2026! 🚀 E você, quem apoia? Vote ao vivo aqui: ${siteUrl}`;
  } else if (lastVote?.voteType === 'NULL') {
    shareMessage = `🗳️ Acabei de registrar meu voto NULO na Pesquisa Eleitoral 2026! 🚀 Deixe seu voto ao vivo aqui: ${siteUrl}`;
  } else if (candidateMatch) {
    shareMessage = `🗳️ Acabei de votar no candidato ${candidateMatch.name} (${candidateMatch.number} - ${candidateMatch.partyAcronym}) na Pesquisa Eleitoral 2026! 🚀 Quem vence essa eleição? Deixe seu voto ao vivo aqui: ${siteUrl}`;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pesquisa Eleitoral (Não Oficial)',
          text: shareMessage,
          url: siteUrl,
        });
      } catch (err) {
        console.log('Native share cancelled:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/40',
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: 'Twitter / X',
      color: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-slate-950/40',
      icon: Share2,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-950/40',
      icon: ExternalLink,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-slate-100 relative overflow-hidden my-8"
        >
          {/* Top Metallic Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Engaje e Compartilhe seu Voto</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            {/* Visual Vote Card (Engaging Preview Card with candidate image & numbers) */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  VOTO COMPUTADO COM SUCESSO
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  AO VIVO
                </span>
              </div>

              {candidateMatch ? (
                <div className="flex items-center gap-3.5">
                  {/* Candidate Avatar Photo */}
                  <div className="w-16 h-20 rounded-xl bg-slate-950 border-2 border-emerald-500/50 overflow-hidden shadow-lg shrink-0">
                    <img
                      src={candidateMatch.photoUrl}
                      alt={candidateMatch.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          candidateMatch.name
                        )}&background=00875a&color=fff&size=128`;
                      }}
                    />
                  </div>

                  {/* Candidate Vote Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-950 bg-emerald-400 px-2 py-0.5 rounded shadow">
                        Nº {candidateMatch.number}
                      </span>
                      <span className="text-xs font-extrabold text-slate-300">
                        {candidateMatch.partyAcronym}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white truncate mt-1">
                      {candidateMatch.name}
                    </h4>

                    {percentage && (
                      <div className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-1.5">
                        <span className="font-bold text-emerald-400 text-sm">{percentage}% dos votos</span>
                        <span className="text-slate-500 text-[10px]">({candidateCount} {candidateCount === 1 ? 'voto' : 'votos'})</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center">
                  <div className="text-lg font-black text-amber-300">
                    {lastVote?.voteType === 'WHITE' ? 'VOTO EM BRANCO' : lastVote?.voteType === 'NULL' ? 'VOTO NULO' : 'SEU VOTO FOI REGISTRADO'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Seu voto foi computado com sucesso na pesquisa ao vivo!</p>
                </div>
              )}
            </div>

            {/* Share Text Box */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
              {shareMessage}
            </div>

            {/* Native Mobile Share Button */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar no Celular</span>
              </button>
            )}

            {/* Social Media Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${item.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Copy Link Input & Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={siteUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

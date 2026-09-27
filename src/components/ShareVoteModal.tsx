import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, MessageCircle, Send, Sparkles, ExternalLink } from 'lucide-react';
import { VoteRecord } from '../types';

interface ShareVoteModalProps {
  lastVote?: VoteRecord | null;
  onClose: () => void;
}

export const ShareVoteModal: React.FC<ShareVoteModalProps> = ({ lastVote, onClose }) => {
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin + window.location.pathname;

  let voteText = 'Acabei de participar da Pesquisa Eleitoral (Não Oficial)! 🗳️';
  if (lastVote?.candidateName && lastVote.voteType === 'VALID') {
    voteText = `Acabei de votar na Pesquisa Eleitoral (Não Oficial)! 🗳️`;
  }

  const shareMessage = `${voteText} Vote você também e veja o resultado ao vivo: ${siteUrl}`;

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
        console.log('Native share error/cancelled:', err);
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
              <span>Compartilhe com Amigos</span>
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
            <p className="text-xs text-slate-300">
              Convide amigos para votar e acompanhar a apuração em tempo real!
            </p>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed font-mono">
              🗳️ {shareMessage}
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

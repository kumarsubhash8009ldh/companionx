// ==========================================
// COMPANIONX: IN-APP SECURE MESSAGING
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertTriangle,
  Smile,
} from 'lucide-react';
import { store } from '../../services/store';
import { SecurityGuard } from '../../services/securityRules';
import { Conversation, Message } from '../../types';

interface ClientChatProps {
  conversationId?: string;
  onBack: () => void;
}

export const ClientChat: React.FC<ClientChatProps> = ({ conversationId, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = store.getCurrentUser();
  const state = store.getState();

  // Find active conversation
  const conv = conversationId
    ? state.conversations.find((c) => c.id === conversationId)
    : state.conversations[0];

  const messages = conv
    ? state.messages.filter((m) => m.conversationId === conv.id)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conv) {
    return (
      <div className="bg-[#0B132B] rounded-2xl p-8 text-center border border-[#1C2541]">
        <Lock className="w-10 h-10 text-slate-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white mb-1">No Active Chat</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          In-app messaging unlocks automatically once a companion formally accepts your booking request.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012]"
        >
          Return to Bookings
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    setWarningMsg(null);

    // Security check: anti-solicitation keyword scanning
    const compliance = SecurityGuard.checkMessageForCompliance(inputText);
    if (!compliance.compliant) {
      setWarningMsg(
        `Message blocked: Contains prohibited keyword "${compliance.flaggedWord}". CompanionX strictly prohibits sexual solicitation. Please keep communication professional and lawful.`
      );
      return;
    }

    const sent = store.sendMessage(conv.id, inputText);
    setInputText('');

    // Simulate companion response for live feel
    if (sent.success) {
      setTimeout(() => {
        const replies = [
          'Understood! I will be dressed formally and arrive 10 minutes early at the venue.',
          'Looking forward to our conversation and dinner on Saturday evening!',
          'Sounds wonderful. I have noted the venue details and special preferences.',
          'Thank you for confirming. I will see you then.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        store.sendMessage(conv.id, randomReply);
      }, 1500);
    }
  };

  return (
    <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden flex flex-col h-[600px] text-left">
      {/* Chat Header */}
      <div className="bg-[#070B19] px-4 py-3 border-b border-[#1C2541] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#1C2541] border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#D4AF37]">
            {conv.companionName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{conv.companionName}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            </div>
            <span className="text-[10px] text-slate-400">
              Verified Companion • In-App Secure Chat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-[#070B19]/70 px-4 py-2 border-b border-[#1C2541] flex items-center gap-2 text-[11px] text-slate-400">
        <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
        <span>
          Keep all discussions focused on your public meeting logistics, arrival, and interests. Zero sexual solicitation permitted.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isMe = currentUser ? m.senderId === currentUser.id : false;
          const isSystem = m.senderId === 'system';

          if (isSystem) {
            return (
              <div key={m.id} className="text-center my-2">
                <span className="inline-block text-[11px] text-slate-400 bg-[#070B19] px-3 py-1 rounded-full border border-[#1C2541]">
                  {m.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 font-medium rounded-br-none shadow-sm'
                    : 'bg-[#1C2541] text-slate-100 rounded-bl-none border border-slate-700/50'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Warning Box */}
      {warningMsg && (
        <div className="p-2.5 mx-4 mb-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{warningMsg}</span>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 bg-[#070B19] border-t border-[#1C2541] flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message (e.g. Table reservation is under my name)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#0B132B] border border-[#1C2541] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          onClick={handleSend}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Defines the structure of a chat message within the Dialectical Chat interface.
 */
interface Message {
  role: 'user' | 'model';
  content: string;
}

import { parseAIError } from '@/utils/errorHandling';

/**
 * Renders the Dialectical Chat interface, a high-reasoning STEM collaboration interface using Gemini.
 * Supports persistent local storage, LaTeX rendering, and advanced "Thinking" models.
 *
 * @param {Object} props - The component properties.
 * @param {string} [props.initialQuery] - An optional initial query string to prepopulate the chat.
 * @returns {JSX.Element} The rendered Chatbot component.
 */
export default function Chatbot({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tactile_chatbot_messages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });
  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If initialQuery changes, update the input
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    localStorage.setItem('tactile_chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatRef = useRef<any>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-3.1-pro-preview',
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            systemInstruction: 'You are a highly advanced STEM assistant. You must use LaTeX formatting for all mathematical expressions. You are an expert in disambiguating symbols and reasoning procedurally through complex math, physics, and ML problems.'
          }
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'model', content: response.text || '' }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'model', content: `**Error:** ${parseAIError(err)}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4">
      <div className="mb-4 flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-mono font-bold text-blue-400">Dialectical Chat</h2>
          <p className="text-zinc-500 font-mono text-xs">High-reasoning STEM collaboration interface</p>
        </div>
      </div>

      <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-sm">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p>Ask me to disambiguate symbols, solve equations, or explain concepts.</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                msg.role === 'user' 
                  ? 'bg-[#2a2a2a] text-zinc-200 border border-[#333]' 
                  : 'bg-[#1a1a1a] text-zinc-300 border border-[#2a2a2a] prose prose-invert prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#333]'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-mono text-sm">{msg.content}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#0a0a0a] border-t border-[#2a2a2a]">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
              className="flex-1 bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-zinc-300 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none h-14"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSend();
                }
              }}
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

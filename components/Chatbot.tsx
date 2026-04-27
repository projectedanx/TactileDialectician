'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel, Chat } from '@google/genai';
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

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

  const chatRef = useRef<Chat | null>(null);

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
          model: 'gemini-2.5-pro',
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
      <div className="mb-4 flex items-center gap-4">
        <Sparkles className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-display-sm font-mono font-bold text-primary">Dialectical Chat</h2>
          <p className="text-on-surface-muted font-mono text-xs">High-reasoning STEM collaboration interface</p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border rounded-none overflow-hidden flex flex-col ">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-muted font-mono text-sm">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p>Ask me to disambiguate symbols, solve equations, or explain concepts.</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-none px-4 py-4 ${
                msg.role === 'user' 
                  ? 'bg-surface-raised text-on-surface border border-border'
                  : 'bg-surface-raised text-on-surface-muted border border-border prose prose-invert prose-pre:bg-surface prose-pre:border prose-pre:border-border'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-mono text-sm">{msg.content}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[
                      rehypeKatex,
                      [
                        rehypeSanitize,
                        {
                          ...defaultSchema,
                          attributes: {
                            ...defaultSchema.attributes,
                            div: [...(defaultSchema.attributes?.div || []), ['className', /^math/, /^katex/], 'style'],
                            span: [...(defaultSchema.attributes?.span || []), ['className'], 'style'],
                            math: ['xmlns', 'display'],
                            annotation: ['encoding'],
                          },
                          tagNames: [
                            ...(defaultSchema.tagNames || []),
                            'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'msubsup', 'mfrac', 'msqrt', 'mroot', 'mstyle', 'merror', 'mpadded', 'mphantom', 'mfenced', 'menclose', 'mspace', 'munderover', 'mover', 'munder', 'mtable', 'mtr', 'mtd', 'mlabeledtr', 'annotation'
                          ]
                        }
                      ]
                    ]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-none bg-surface-raised flex items-center justify-center flex-shrink-0 border border-border">
                  <User className="w-4 h-4 text-on-surface-muted" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-surface-raised border border-border rounded-none px-4 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-none animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-none animate-bounce delay-75" />
                <div className="w-2 h-2 bg-primary rounded-none animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-surface border-t border-border">
          <div className="flex gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
              className="flex-1 bg-surface border border-border rounded-none px-4 py-3 text-on-surface-muted font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none h-16"
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
              className="w-16 h-16 bg-primary hover:bg-primary text-on-primary rounded-none flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

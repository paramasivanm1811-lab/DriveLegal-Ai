"use client";

import { Send, Bot, User, MapPin, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useStore } from "@/lib/store";

type Message = { id: string, role: 'user' | 'assistant', content: string };

const T = {
  en: {
    welcomeMessage: 'Vanakkam! I am the DriveLegal TN AI Assistant. Ask me anything about traffic laws, fines, or rules in Tamil Nadu. (You can ask in English or Tamil!)',
    suggestedPrompts: [
      "Is wearing a helmet mandatory for pillion riders?",
      "What is the speed limit in Chennai?",
      "How much is the fine for no parking in TN?"
    ],
    title: "TN Traffic AI Assistant",
    subtitle: "Ask in Tamil or English",
    contextLabel: "Tamil Nadu Context",
    inputPlaceholder: "Ask about fine amounts, traffic laws, or rules...",
    toggleLangBtn: "தமிழில் பேச (Ask in Tamil)"
  },
  ta: {
    welcomeMessage: 'வணக்கம்! நான் டிரைவ்லீகல் தமிழ்நாடு AI உதவியாளர். தமிழ்நாட்டில் போக்குவரத்து விதிகள், அபராதங்கள் அல்லது சட்டங்கள் பற்றி என்னிடம் கேளுங்கள். (நீங்கள் தமிழ் அல்லது ஆங்கிலத்தில் கேட்கலாம்!)',
    suggestedPrompts: [
      "என் ஊரில் ஹெல்மெட் அணிவது கட்டாயமா?",
      "சென்னையில் வேக வரம்பு என்ன?",
      "தமிழ்நாட்டில் நோ பார்க்கிங் அபராதம் எவ்வளவு?"
    ],
    title: "தமிழக போக்குவரத்து AI உதவியாளர்",
    subtitle: "தமிழ் அல்லது ஆங்கிலத்தில் கேட்கவும்",
    contextLabel: "தமிழ்நாடு சூழல்",
    inputPlaceholder: "அபராதத் தொகைகள், போக்குவரத்துச் சட்டங்கள் அல்லது விதிகள் பற்றி கேட்கவும்...",
    toggleLangBtn: "Ask in English"
  }
};

// Provide typings for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}
declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export default function ChatPage() {
  const { laws, language, toggleLanguage } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: T[language].welcomeMessage }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if the user switches languages before starting conversation
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([
        { id: '1', role: 'assistant', content: T[language].welcomeMessage }
      ]);
    }
  }, [language]);

  // Synchronize Speech Recognition locale based on active language
  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => {
          const space = prev.endsWith(" ") || prev === "" ? "" : " ";
          return prev + space + transcript;
        });
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition is not supported in this browser (Try Chrome).");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          lawsContext: laws 
        })
      });

      if (!response.ok) throw new Error("Failed to fetch");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessageContent = "";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          assistantMessageContent += chunk;
          
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = assistantMessageContent;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: language === 'ta' ? 'மன்னிக்கவும், பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col h-[calc(100vh-80px)]">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col flex-1 overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-[var(--color-brand-dark)] text-white p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-brand-green)] rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{T[language].title}</h1>
              <p className="text-sm text-gray-400">{T[language].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl border border-white/15 transition-all active:scale-95"
            >
              {T[language].toggleLangBtn}
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 px-4 py-2.5 rounded-xl border border-white/5">
              <MapPin className="w-4 h-4 text-[var(--color-brand-green-light)]" />
              <span className="text-sm font-medium text-gray-300">{T[language].contextLabel}</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((message) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={message.id} 
              className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-[var(--color-brand-dark)] text-white' : 'bg-[var(--color-brand-green)] text-white'}`}>
                {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${message.role === 'user' ? 'bg-[var(--color-brand-dark)] text-white rounded-tr-sm' : 'bg-white text-gray-900 border border-gray-100 shadow-sm rounded-tl-sm'}`}>
                <div className="prose prose-sm max-w-none text-inherit">
                  {message.content.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-green)] text-white flex items-center justify-center shrink-0"><Bot className="w-5 h-5" /></div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pre-loaded Prompts */}
        <div className="px-6 pb-2 pt-2 flex flex-wrap gap-2">
          {T[language].suggestedPrompts.map((prompt, i) => (
            <button 
              key={i}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={T[language].inputPlaceholder}
                className="w-full text-gray-900 bg-gray-50 border border-gray-200 rounded-xl py-4 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] transition-all"
                disabled={isLoading}
              />
              <button 
                type="button" 
                onClick={toggleListening}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] disabled:opacity-50 text-white w-14 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

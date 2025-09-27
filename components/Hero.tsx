'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Hero() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello, I'm Dr. Sarah, your AI therapist. I'm here to listen and support you in a safe, non-judgmental space. What's on your mind today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const fullPlaceholder = "Type your message...";
  const [parallaxY, setParallaxY] = useState(0);
  const [hasSecondBotMsg, setHasSecondBotMsg] = useState(false);
  const isTypingGuardRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInUpDelay = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  };

  const fadeInUpDelayMore = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.4 }
  };

  const bounceIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.6, 
      delay: 0.6, 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  };

  const chatWindowAnimation = {
    initial: { opacity: 0, scale: 0.9, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 1, delay: 0.8 }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      isTypingGuardRef.current = false;
    };
  }, []);

  // Typing animation for placeholder when input is idle
  useEffect(() => {
    if (inputText || isTyping || isInputFocused) {
      setPlaceholderText('');
      return;
    }
    let index = 0;
    let cancelled = false;
    const typeNext = () => {
      if (cancelled) return;
      setPlaceholderText(fullPlaceholder.slice(0, index));
      index += 1;
      if (index <= fullPlaceholder.length) {
        setTimeout(typeNext, 60);
      } else {
        setTimeout(() => {
          setPlaceholderText('');
          index = 0;
          setTimeout(typeNext, 600);
        }, 1200);
      }
    };
    const t = setTimeout(typeNext, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [inputText, isTyping, isInputFocused]);

  // Subtle parallax on scroll for floating shapes
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setParallaxY(y * 0.02);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Demo: delayed second bot message
  useEffect(() => {
    if (hasSecondBotMsg) return;
    const t = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "If you'd like, I can suggest a quick breathing exercise to help you feel more centered.",
        isBot: true,
        timestamp: new Date()
      }]);
      setHasSecondBotMsg(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [hasSecondBotMsg]);

  const botResponses = [
    "I'm here to listen. Would you like a breathing exercise or a calming tip?",
    "That sounds challenging. Can you tell me more about what's on your mind?",
    "I understand. It's okay to feel this way. What would help you feel better right now?",
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "I'm here to support you. Would you like to try a mindfulness exercise?",
    "Your feelings are valid. What's one small thing that might help you today?",
    "I appreciate you opening up. What's been the most difficult part of your day?",
    "It takes courage to talk about these things. How can I best support you right now?"
  ];

  const getRandomBotResponse = () => {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLearnMore = () => {
    router.push('/signup');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (isTyping || isTypingGuardRef.current) return;

    // Clear any pending typing animation
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);
    isTypingGuardRef.current = true;

    try {
      // Prepare messages for ChatGPT API
      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      // Add the new user message
      chatHistory.push({
        role: 'user',
        content: newMessage.text
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send only user/assistant turns; backend injects therapeutic system prompt
        body: JSON.stringify({ 
          messages: chatHistory,
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      });

      // Always attempt to read JSON and surface fallback content even if status is not OK
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {
        // ignore parse errors; handled below
      }
      const aiResponse = data?.choices?.[0]?.message?.content
        || data?.error
        || "I’m here to listen. I had trouble responding just now—would you like to try a quick 4-6 breath while we try again?";

      const botResponse: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      const friendlyFallback: Message = {
        id: messages.length + 2,
        text: "I’m here with you. It looks like I hit a hiccup. Want to try again or do a quick grounding exercise (5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste)?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, friendlyFallback]);
    } finally {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      isTypingGuardRef.current = false;
      setIsTyping(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-white z-0 overflow-hidden"
    >
      {/* Subtle grid + gradient overlay background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 gradient-overlay pointer-events-none" aria-hidden="true" />

      {/* Floating geometric shapes removed for cleaner style */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-[color:var(--color-text-dark)]">
        <div className="mb-6">
          <span className="badge-live"><span className="badge-dot" />Live Demo</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight text-text-dark opacity-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            >
              Your AI Therapist — <span className="gradient-text">Always Here to Listen</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-secondary leading-relaxed opacity-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
            >
              Empowering you with personalized, interactive support for mental health and wellness.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 opacity-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
            >
              <motion.button
                className="btn-primary text-lg px-10 py-4 hover-scale-shadow focus-visible-ring"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handleGetStarted}
              >
                Get Started
              </motion.button>
              <motion.button
                className="btn-secondary text-lg px-10 py-4 hover-scale-shadow focus-visible-ring"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" 
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handleLearnMore}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - Chatbot Window */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.45 }}
            style={{ transform: `translateY(${parallaxY * 0.4}px)` }}
          >
            <div className="rounded-2xl p-6 md:p-8 bg-white/70 backdrop-blur-md border border-border glow-soft shadow-md animate-float-gentle">
              <div className="rounded-2xl overflow-hidden bg-white">
                {/* Title Bar */}
                <div className="px-6 py-4 flex items-center space-x-3 border-b border-border">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border">
                    <span className="text-xs text-text-dark font-medium">AI</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-dark">Dr. Sarah - AI Therapist</h3>
                </div>
                
                {/* Message Area */}
                <div ref={chatContainerRef} className="h-80 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? 'space-x-3' : 'justify-end space-x-3'}`}>
                      {message.isBot ? (
                        <>
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border flex-shrink-0">
                            <span className="text-xs text-text-dark font-medium">AI</span>
                          </div>
                          <div className="bubble-bot rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs bg-gray-50">
                            <p className="text-text-dark text-sm">{message.text}</p>
                            <p className="mt-1 text-[11px] text-secondary">{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bubble-user rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                            <p className="text-white text-sm">{message.text}</p>
                            <p className="mt-1 text-[11px] text-white/80">{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                          </div>
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border flex-shrink-0">
                            <span className="text-xs text-text-dark font-medium">U</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border flex-shrink-0">
                        <span className="text-xs text-text-dark font-medium">AI</span>
                      </div>
                      <div className="bubble-bot rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs bg-gray-50">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-secondary/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-secondary/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-secondary/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder={placeholderText || ' '}
                        className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm bg-white border border-border caret-accent placeholder-typing focus-visible-ring"
                        disabled={isTyping}
                      />
                      {(!inputText && !isInputFocused) && (
                        <span
                          className="absolute top-1/2 -translate-y-1/2 h-5 w-px bg-gray-400/70"
                          style={{ left: `calc(1rem + ${placeholderText.length}ch)`, animation: 'blinkCursor 1s step-start infinite' }}
                          aria-hidden
                        />
                      )}
                    </div>
                    <button 
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 h-12 btn-primary animate-pulse-subtle disabled:opacity-50 disabled:cursor-not-allowed hover-scale-shadow focus-visible-ring"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            {/* Background accents removed for consistency */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

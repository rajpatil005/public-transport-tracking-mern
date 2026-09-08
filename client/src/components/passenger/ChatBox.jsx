import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, X, Bot, User, Loader, Sparkles, AlertCircle, Minimize2, Maximize2, Trash2, Clock, WifiOff } from "lucide-react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://public-transport-tracking-mern-1.onrender.com' 
      : 'http://localhost:5000');

  console.log(`🔗 API Base URL: ${API_BASE_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const STORAGE_KEYS = {
    SESSION_ID: 'kolhapur_chat_session_id'
  };

  const quickSuggestions = [
    { icon: "🚍", label: "Bus Routes", query: "Show me all bus routes" },
    { icon: "🎫", label: "Book Ticket", query: "How to book a ticket?" },
    { icon: "📍", label: "Track Bus", query: "How to track a bus?" },
    { icon: "💰", label: "Fare", query: "What is the bus fare?" },
    { icon: "🏛️", label: "Tourist Places", query: "Best places to visit in Kolhapur" },
    { icon: "⏰", label: "Schedule", query: "What are the bus timings?" }
  ];

  const loadChatHistory = async (sessionId) => {
    try {
      console.log(`📥 Loading history for session: ${sessionId}`);
      const response = await axios.get(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
        timeout: 10000
      });
      
      if (response.data.success && response.data.messages && response.data.messages.length > 0) {
        const formattedMessages = response.data.messages.map((msg, index) => ({
          id: Date.now() + index,
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString()
        }));
        setMessages(formattedMessages);
        console.log(`📚 Loaded ${formattedMessages.length} messages from backend`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      return false;
    }
  };

  const initializeChat = () => {
    const welcomeMessages = [
      {
        id: Date.now(),
        role: "assistant",
        content: "👋 Hello! I'm your Kolhapur Bus Assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Date.now() + 1,
        role: "assistant",
        content: "You can ask me about:\n• 🚍 Bus routes and schedules\n• 🎫 Ticket booking\n• 📍 Live bus tracking\n• 💰 Fare information\n• 🏛️ Tourist places in Kolhapur",
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    
    setMessages(welcomeMessages);
  };

  useEffect(() => {
    const loadSavedChatHistory = async () => {
      try {
        const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (savedSession) {
          setSessionId(savedSession);
          const loaded = await loadChatHistory(savedSession);
          if (loaded) {
            setIsInitialized(true);
            return;
          }
        }

        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
        initializeChat();
        setIsInitialized(true);
        
      } catch (error) {
        console.error('❌ Error loading chat history:', error);
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
        initializeChat();
        setIsInitialized(true);
      }
    };

    loadSavedChatHistory();
    checkBackendHealth();
    
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      console.log(`🔍 Checking backend at: ${API_BASE_URL}/api/health`);
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 5000
      });
      console.log("✅ Backend is online:", response.data);
      setBackendStatus('online');
      setError(null);
    } catch (error) {
      console.error("❌ Backend is offline:", error.message);
      setBackendStatus('offline');
      setError("⚠️ Backend server is not running. Please try again later.");
      
      if (isOpen && messages.length === 0 && isInitialized) {
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            content: "⚠️ **Backend server is not running**\n\nPlease try again later or contact support.",
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearChatHistory = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/chat/history/${sessionId}`);
      setMessages([]);
      initializeChat();
      setShowClearConfirm(false);
      console.log('🗑️ Chat history cleared');
    } catch (error) {
      console.error('❌ Error clearing chat:', error);
      setMessages([]);
      initializeChat();
      setShowClearConfirm(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    if (backendStatus === 'offline') {
      setError("⚠️ Backend server is not running. Please try again later.");
      
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        content: "🔴 **Server Offline**\n\nI can't process your request right now. Please try again later.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setNewMessage("");
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = newMessage.trim();
    setNewMessage("");
    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      const timeoutMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "⏰ **Request Timeout**\n\nThe server is taking too long to respond. Please try:\n• Asking a simpler question\n• Breaking down your question\n• Trying again in a moment",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, timeoutMessage]);
    }, 20000);

    try {
      console.log(`📤 Sending to: ${API_BASE_URL}/api/chat`);
      console.log(`🔑 Session ID: ${sessionId}`);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        {
          question: question,
          session_id: sessionId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 20000
        }
      );

      clearTimeout(timeoutId);

      console.log("✅ Response received:", response.data);

      if (response.data.session_id && response.data.session_id !== sessionId) {
        setSessionId(response.data.session_id);
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, response.data.session_id);
      }

      let answer = "I processed your request but didn't get a response.";
      
      if (response.data) {
        if (response.data.success && response.data.answer) {
          answer = response.data.answer;
        } else if (response.data.answer) {
          answer = response.data.answer;
        } else if (response.data.message) {
          answer = `⚠️ ${response.data.message}`;
        } else if (typeof response.data === 'string') {
          answer = response.data;
        } else {
          answer = JSON.stringify(response.data);
        }
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("❌ Chat API Error:", error);
      
      let errorMessage = "⚠️ Sorry, I'm having trouble connecting to the server. ";
      
      if (error.code === 'ECONNABORTED' || error.message === 'Request timeout') {
        errorMessage = "⏰ **Request Timeout**\n\nThe server is taking too long to respond. Please try:\n• Asking a simpler question\n• Breaking down your question\n• Trying again in a moment";
      } else if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "❌ **Endpoint Not Found**\n\nThe AI endpoint was not found. Please check the server configuration.";
        } else if (error.response.status === 500) {
          errorMessage = "⚠️ **Server Error**\n\nThe server encountered an error. Please try again later.";
        } else if (error.response.status === 503) {
          errorMessage = "🔴 **Service Unavailable**\n\nThe AI service is temporarily unavailable. Please try again in a few minutes.";
        } else {
          errorMessage = `⚠️ **Error ${error.response.status}**\n\nThe server returned an error. Please try again.`;
        }
      } else if (error.request) {
        errorMessage = "🌐 **Network Error**\n\nUnable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = "⚠️ **Unknown Error**\n\nAn unexpected error occurred. Please try again.";
      }
      
      setError(errorMessage);
      
      const errorResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickSuggestion = (query) => {
    if (backendStatus === 'offline') {
      setError("⚠️ Backend server is not running. Please try again later.");
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        content: "🔴 **Server Offline**\n\nI can't process your request right now. Please try again later.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    setNewMessage(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatMessage = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formattedLine.trim().startsWith('•')) {
        formattedLine = `<span class="inline-block w-3 text-emerald-500">•</span> ${formattedLine.trim().substring(1)}`;
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[8px] font-bold items-center justify-center text-white">
                {messages.length > 0 ? messages.length : 'AI'}
              </span>
            </span>
          </div>
          <div className="relative flex flex-col items-center">
            <Sparkles className="h-5 w-5" />
            <span className="text-[6px] font-medium mt-0.5">Ask AI</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-64 h-12 sm:w-72 sm:h-14' : 'w-[calc(100vw-2rem)] sm:w-[480px] md:w-[520px] h-[calc(100vh-8rem)] sm:h-[600px] md:h-[700px]'
    } rounded-2xl shadow-3xl flex flex-col overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-6rem)]`}>
      
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
              backendStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}></div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 truncate">
              Kolhapur AI
              <span className="text-[8px] sm:text-[10px] bg-emerald-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3" />
                GPT
              </span>
            </h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`text-[8px] sm:text-xs flex items-center gap-0.5 ${
                backendStatus === 'online' ? 'text-emerald-100' : 'text-red-200'
              }`}>
                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full inline-block ${
                  backendStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></span>
                {backendStatus === 'online' ? 'Online' : 'Offline'}
              </span>
              <span className="text-[8px] sm:text-xs text-emerald-100/70 hidden xs:inline">•</span>
              <span className="text-[8px] sm:text-xs text-emerald-100/70 hidden xs:inline">{onlineUsers} online</span>
              <span className="text-[8px] sm:text-xs text-emerald-100/70 hidden sm:inline">•</span>
              <span className="text-[8px] sm:text-xs text-emerald-100/70 hidden sm:inline">
                {messages.length} msgs
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            aria-label="Minimize"
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>
          <button
            onClick={toggleChat}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            aria-label="Close chat"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Clear Chat History?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will delete all messages from your chat history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={clearChatHistory}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {!isMinimized && (
        <>
          <div 
            className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50"
            ref={chatContainerRef}
          >
            <div className="space-y-3 sm:space-y-4">
              {backendStatus === 'offline' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <WifiOff className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 text-sm sm:text-base">
                        Server Offline
                      </h4>
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-300 mt-1">
                        The backend server is not responding. Please try again later.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.role === "user";
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slideIn`}
                  >
                    <div className={`flex gap-2 sm:gap-3 max-w-[92%] ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        {isUser ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg ring-2 ring-blue-400/20">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg ring-2 ring-emerald-400/20">
                            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`relative ${
                            isUser
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-emerald-500/20'
                              : msg.content.includes('🔴') || msg.content.includes('Server Offline')
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl rounded-tl-sm shadow-lg border border-red-200 dark:border-red-800'
                                : msg.content.includes('⚠️') || msg.content.includes('Error')
                                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl rounded-tl-sm shadow-lg border border-orange-200 dark:border-orange-800'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm shadow-lg border border-gray-200 dark:border-gray-700'
                          } p-2.5 sm:p-3 md:p-4`}
                        >
                          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {formatMessage(msg.content)}
                          </div>
                        </div>
                        
                        <span className={`text-[8px] sm:text-[10px] text-gray-400 mt-0.5 ${isUser ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start animate-slideIn">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Loader className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 animate-spin" />
                        <span className="text-xs sm:text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="px-2 py-1.5 sm:px-4 sm:py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion.query)}
                  className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm transition-all text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0 border ${
                    backendStatus === 'offline'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:shadow-md hover:scale-105 active:scale-95 border-gray-200 dark:border-gray-600'
                  }`}
                  disabled={backendStatus === 'offline'}
                  title={backendStatus === 'offline' ? 'Server offline - Cannot use suggestions' : ''}
                >
                  <span className="text-xs sm:text-sm">{suggestion.icon}</span>
                  <span className="hidden xs:inline">{suggestion.label}</span>
                  {backendStatus === 'offline' && (
                    <span className="text-[8px] text-red-400 ml-0.5">🔴</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-end gap-1.5 sm:gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={backendStatus === 'online' ? "Ask me about buses..." : "🔴 Server offline - Try again later"}
                  rows={1}
                  disabled={backendStatus === 'offline'}
                  className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl focus:outline-none focus:ring-2 resize-none text-xs sm:text-sm placeholder-gray-500 ${
                    backendStatus === 'offline'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-emerald-500'
                  }`}
                  style={{ minHeight: '32px', maxHeight: '80px' }}
                />
                {backendStatus === 'offline' && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <WifiOff className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading || backendStatus === 'offline'}
                className={`p-1.5 sm:p-2 rounded-xl transition-all active:scale-90 ${
                  newMessage.trim() && !isLoading && backendStatus === 'online'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
                title={backendStatus === 'offline' ? 'Server offline - Cannot send message' : ''}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="mt-1.5 text-center flex items-center justify-center gap-2 sm:gap-4">
              <span className={`text-[8px] sm:text-[10px] flex items-center gap-1 ${
                backendStatus === 'online' ? 'text-green-500' : 'text-red-400'
              }`}>
                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full inline-block ${
                  backendStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-400'
                }`}></span>
                {backendStatus === 'online' ? 'Connected to AI' : '🔴 Disconnected'}
              </span>
              <span className="text-[8px] sm:text-[10px] text-gray-300">|</span>
              <span className="text-[8px] sm:text-[10px] text-gray-400">
                {messages.length} messages
              </span>
              {sessionId && (
                <>
                  <span className="text-[8px] sm:text-[10px] text-gray-300">|</span>
                  <span className="text-[8px] sm:text-[10px] text-gray-400 truncate max-w-[80px]">
                    {sessionId.substring(0, 12)}...
                  </span>
                </>
              )}
              {backendStatus === 'offline' && (
                <>
                  <span className="text-[8px] sm:text-[10px] text-gray-300">|</span>
                  <span className="text-[8px] sm:text-[10px] text-red-400 animate-pulse">
                    ⚠️ Server Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        .shadow-3xl {
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 640px) {
          .xs\\:inline {
            display: none;
          }
        }
        @media (min-width: 641px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
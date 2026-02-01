import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Copy, ThumbsUp } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: 'Hello! I am your Smart Research Assistant. Upload your notes, and I can help you prepare for your exams. Try asking "Explain the key concepts of Chapter 1 in 5 marks".' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('concise'); // concise, 5-mark, 10-mark

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate AI response based on mode
        setTimeout(() => {
            let responseText = "I'm processing your query based on the uploaded notes...";
            if (mode === '5-mark') {
                responseText = `**Answer (5 Marks):**\n\n1. **Definition**: [Concept] is defined as...\n2. **Key Feature 1**: It enables...\n3. **Key Feature 2**: It ensures...\n4. **Example**: For instance...\n5. **Conclusion**: Therefore, it is critical for...`;
            } else if (mode === '10-mark') {
                responseText = `**Detailed Explanation (10 Marks):**\n\n**Introduction**\n[Concept] is a fundamental aspect of...\n\n**Core Principles**\n- Principle A: ...\n- Principle B: ...\n\n**Detailed Analysis**\nThe system operates by...\n\n**Comparison**\nCompared to traditional methods...\n\n**Conclusion**\nIn summary...`;
            } else {
                responseText = "Here is the information from your notes: [Relevant excerpt would appear here].";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: responseText }]);
            setLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '900px', height: '600px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 auto'
        }}>

            {/* Header / Mode Selector */}
            <div style={{
                padding: '1rem', borderBottom: '1px solid var(--glass-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} color="hsl(var(--accent-primary))" />
                    <span style={{ fontWeight: 600 }}>Smart Research Assistant</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', background: 'hsl(var(--bg-primary))', padding: '4px', borderRadius: '8px' }}>
                    {['concise', '5-mark', '10-mark'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                background: mode === m ? 'hsl(var(--accent-primary))' : 'transparent',
                                color: mode === m ? 'white' : 'hsl(var(--text-secondary))',
                                border: 'none', padding: '4px 12px', borderRadius: '6px',
                                fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {m === 'concise' ? 'Short' : m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        display: 'flex', gap: '1rem',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        {msg.role === 'bot' && (
                            <div style={{
                                minWidth: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, hsl(var(--accent-primary)), #4f46e5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot size={18} color="white" />
                            </div>
                        )}

                        <div style={{
                            maxWidth: '80%', padding: '1rem',
                            borderRadius: '12px',
                            borderTopLeftRadius: msg.role === 'user' ? '12px' : '4px',
                            borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                            background: msg.role === 'user' ? 'hsl(var(--accent-primary))' : 'hsl(var(--bg-card))',
                            color: msg.role === 'user' ? 'white' : 'hsl(var(--text-primary))',
                            boxShadow: 'var(--shadow-sm)',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg.text}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{
                                minWidth: '32px', height: '32px', borderRadius: '50%',
                                background: 'hsl(var(--bg-card))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <User size={18} color="hsl(var(--text-secondary))" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: 32, height: 32 }} />
                        <div style={{ padding: '0.5rem', display: 'flex', gap: '4px' }}>
                            <span className="dot" style={{ width: 8, height: 8, background: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                            <span className="dot" style={{ width: 8, height: 8, background: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></span>
                            <span className="dot" style={{ width: 8, height: 8, background: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{
                    display: 'flex', gap: '1rem',
                    background: 'hsl(var(--bg-secondary))',
                    padding: '0.5rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid hsl(var(--border-color))'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question from your notes..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            color: 'hsl(var(--text-primary))', outline: 'none', padding: '0.5rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default ChatInterface;

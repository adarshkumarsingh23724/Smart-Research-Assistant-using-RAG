import React, { useState } from 'react';
import { BookOpen, GraduationCap, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

function App() {
  const [view, setView] = useState('home'); // home, chat

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Background Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(120, 100, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)', borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, rgba(50, 150, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)', borderRadius: '50%'
        }}></div>
      </div>

      {/* Header */}
      <header className="glass-panel" style={{
        margin: '1rem 2rem', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: '1rem', zIndex: 100
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setView('home')}
        >
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--accent-primary)), #4f46e5)',
            padding: '8px', borderRadius: '8px', display: 'flex'
          }}>
            <GraduationCap size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Smart Research Assistant</h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {view !== 'home' && (
            <button className="btn btn-secondary" onClick={() => setView('home')} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            <BookOpen size={16} /> History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container animate-fade-in" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '4rem 1rem'
      }}>

        {view === 'home' && (
          <>
            <div style={{
              marginBottom: '1.5rem',
              background: 'rgba(120, 100, 255, 0.1)',
              color: 'hsl(var(--accent-primary))',
              padding: '0.5rem 1rem', borderRadius: '50px',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.9rem', fontWeight: 600
            }}>
              <Sparkles size={16} /> Intelligent Exam Preparation
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              marginBottom: '1.5rem',
              backgroundImage: 'linear-gradient(to right, white, #9ca3af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              Ace Your Exams with <br />
              <span style={{ color: 'hsl(var(--accent-primary))', WebkitTextFillColor: 'initial' }}>
                Institutional Notes
              </span>
            </h2>

            <p style={{ maxWidth: '600px', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Access the official knowledge base. Get precise, syllabus-aligned answers
              derived directly from college notes. No hallucinations, just facts.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setView('chat')}
                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
              >
                <MessageCircle size={20} /> Start Study Session
              </button>
            </div>
          </>
        )}

        {view === 'chat' && (
          <div className="animate-fade-in" style={{ width: '100%' }}>
            <ChatInterface />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;

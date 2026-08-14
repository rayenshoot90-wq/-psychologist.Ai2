'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'مرحباً بك. أنا هنا للاستماع إليك ومشاركتك الحديث بكل هدوء. كيف تشعر اليوم وما الذي يشغل بالك؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'عذراً، تعذر الاتصال بالخادم حالياً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '800px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
      {/* Header */}
      <header style={{ paddingBottom: '16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(20, 184, 166, 0.2)', border: '1px solid rgba(20, 184, 166, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          🌱
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>المستمع الذكي - AI Companion</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#14b8a6' }}>متاح للاستماع والحديث</p>
        </div>
      </header>

      {/* Disclaimer */}
      <div style={{ margin: '12px 0', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', fontSize: '12px', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
        💡 تنبيه: هذا تطبيق ذكاء اصطناعي مُصمم للدعم الحواري والاستماع، ولا يغني عن الاستشارة النفسية أو الطبية المباشرة.
      </div>

      {/* Messages Window */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '16px',
              fontSize: '14px',
              lineHeight: '1.6',
              backgroundColor: msg.sender === 'user' ? '#0d9488' : '#0f172a',
              color: '#ffffff',
              border: msg.sender === 'user' ? 'none' : '1px solid #1e293b'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#14b8a6', borderRadius: '16px', fontSize: '12px' }}>
              جاري التفكير وصياغة الرد...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ paddingTop: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '8px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب ما تود الحديث عنه هنا..."
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#ffffff', padding: '8px', fontSize: '14px', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ backgroundColor: '#14b8a6', color: '#020617', border: 'none', fontWeight: 'bold', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', opacity: (loading || !input.trim()) ? 0.5 : 1 }}
          >
            إرسال 🚀
          </button>
        </div>
      </form>
    </main>
  );
}
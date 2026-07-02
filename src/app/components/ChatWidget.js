'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Xin chào! 🌿 Tôi là trợ lý AI của cửa hàng OASIS. Tôi có thể tư vấn giúp bạn chọn cây cảnh phù hợp. Bạn cần hỗ trợ gì?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'model', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại! 🌿' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-fab"
        aria-label="Chat với AI"
      >
        {isOpen ? '✕' : '🌿'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🌿</div>
              <div>
                <h4>Tư vấn cây cảnh AI</h4>
                <span className="chat-status">● Trực tuyến</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-close">&times;</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bot chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về cây cảnh..."
              className="chat-input"
              disabled={loading}
            />
            <button type="submit" className="chat-send" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

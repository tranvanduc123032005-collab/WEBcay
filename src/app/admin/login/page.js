'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Giả lập xác thực (tài khoản cứng admin / admin123)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdminLoggedIn', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác!')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1E3F20',
      backgroundImage: 'linear-gradient(135deg, #1E3F20 0%, #3A5F43 100%)',
      fontFamily: 'var(--font-inter), sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '50px 40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            color: '#1E3F20',
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 10px 0'
          }}>
            OASIS ADMIN
          </h1>
          <p style={{ color: '#5F6F65', fontSize: '14px', margin: 0 }}>
            Vui lòng đăng nhập để truy cập hệ thống quản trị
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fde8e8',
            color: '#e74c3c',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'left',
            borderLeft: '4px solid #e74c3c',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1E3F20',
              marginBottom: '8px'
            }}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1.5px solid #d1d1d1',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3F20'}
              onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1E3F20',
              marginBottom: '8px'
            }}>
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1.5px solid #d1d1d1',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3F20'}
              onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1E3F20',
              color: '#fff',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.1s',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if(!loading) e.currentTarget.style.backgroundColor = '#2d5a30'
            }}
            onMouseOut={(e) => {
              if(!loading) e.currentTarget.style.backgroundColor = '#1E3F20'
            }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '25px', fontSize: '12px', color: '#5F6F65' }}>
          <span>Tài khoản kiểm thử: <strong>admin</strong> / <strong>admin123</strong></span>
        </div>
      </div>
    </div>
  )
}

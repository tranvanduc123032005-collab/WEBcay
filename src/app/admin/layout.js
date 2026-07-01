'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const authStatus = localStorage.getItem('isAdminLoggedIn')
    
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      // Nếu đang ở trang login mà đã đăng nhập thì chuyển sang dashboard
      if (pathname === '/admin/login') {
        router.push('/admin/dashboard')
      }
    } else {
      setIsAuthenticated(false)
      // Nếu chưa đăng nhập và không phải đang ở trang login thì chuyển sang trang login
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  // Hiển thị trạng thái tải
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF9F6',
        color: '#1E3F20',
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Đang tải hệ thống quản trị...
      </div>
    )
  }

  // Nếu là trang Login thì render thẳng không cần Sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Layout Dashboard có Sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7F4', fontFamily: 'var(--font-inter), sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#1E3F20',
        color: '#fff',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 15px rgba(0,0,0,0.05)',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '24px', fontWeight: '700', color: '#FAF9F6', margin: 0 }}>
            OASIS CMS
          </h2>
          <span style={{ fontSize: '12px', color: '#A3B899', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Hệ thống quản trị
          </span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/admin/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: pathname === '/admin/dashboard' ? '#1E3F20' : '#A3B899',
            backgroundColor: pathname === '/admin/dashboard' ? '#FAF9F6' : 'transparent',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}>
            📁 Quản lý sản phẩm
          </Link>
          
          <Link href="/" target="_blank" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#A3B899',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}>
            🌐 Xem trang chủ ↗
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        >
          🚪 Đăng xuất
        </button>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Admin Header */}
        <header style={{
          height: '70px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#3A5F43',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              AD
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E3F20' }}>Adminstrator</span>
              <span style={{ display: 'block', fontSize: '11px', color: '#5F6F65' }}>Quản lý tối cao</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main style={{ flex: 1, padding: '40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

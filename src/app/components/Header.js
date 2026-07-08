'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  // Đồng bộ theme khi khởi tạo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Thay đổi theme
  const toggleTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100)
    }
  }, [searchOpen])

  // Close search on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Tìm kiếm trên trang - cuộn đến phần phù hợp hoặc tìm trên Google
    const query = searchQuery.trim().toLowerCase()
    const sections = {
      'home': '#hero',
      'trang chủ': '#hero',
      'about': '#about',
      'giới thiệu': '#about',
      'product': '#best-sellers',
      'sản phẩm': '#best-sellers',
      'cây': '#best-sellers',
      'plant': '#best-sellers',
      'monstera': '#best-sellers',
      'snake': '#best-sellers',
      'fiddle': '#best-sellers',
      'aloe': '#best-sellers',
      'testimonial': '#testimonial',
      'đánh giá': '#testimonial',
      'contact': '#footer',
      'liên hệ': '#footer',
      'category': '#categories',
      'danh mục': '#categories',
      'cart': '/cart',
      'giỏ hàng': '/cart',
    }

    let found = false
    for (const [keyword, target] of Object.entries(sections)) {
      if (query.includes(keyword)) {
        if (target.startsWith('/')) {
          window.location.href = target
        } else {
          if (pathname !== '/') {
            window.location.href = '/' + target
          } else {
            const element = document.querySelector(target)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }
        }
        found = true
        break
      }
    }

    if (!found) {
      // Tìm trên Google với site filter
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}+site:oasis+plant+shop`, '_blank')
    }

    setSearchOpen(false)
    setSearchQuery('')
  }

  const isHome = pathname === '/'

  const navItems = [
    { label: 'Trang chủ', href: isHome ? '#hero' : '/' },
    { label: 'Giới thiệu', href: isHome ? '#about' : '/#about' },
    { label: 'Sản phẩm', href: isHome ? '#best-sellers' : '/#best-sellers' },
    { label: 'Đánh giá', href: isHome ? '#testimonial' : '/#testimonial' },
    { label: 'Liên hệ', href: isHome ? '#footer' : '/#footer' },
  ]

  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container">
        <Link href="/" className="logo">Đức Cây</Link>
          <nav className="navbar">
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      (item.label === 'Trang chủ' && pathname === '/') ||
                      (item.label === 'Sản phẩm' && pathname === '/detail')
                        ? 'active'
                        : ''
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-icons">
            {/* Light/Dark Mode Switcher (Two Buttons) */}
            <div className="theme-switcher">
              <button
                onClick={() => toggleTheme('light')}
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                title="Chế độ sáng"
                aria-label="Chuyển sang chế độ sáng"
              >
                ☀️
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                title="Chế độ tối"
                aria-label="Chuyển sang chế độ tối"
              >
                🌙
              </button>
            </div>

            {/* Icon Search */}
            <button onClick={() => setSearchOpen(true)} aria-label="Search" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            {/* Icon Cart */}
            <Link href="/cart" className="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className={`cart-badge ${cartCount === 0 ? 'hidden' : ''}`} id="cart-badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}>
        <button className="search-close-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
          ✕
        </button>
        <div className="search-overlay-content">
          <h3>Tìm kiếm sản phẩm</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm... (vd: Monstera, cây, plant)"
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Tìm
            </button>
          </form>
          <p className="search-results-hint">Nhấn Enter để tìm kiếm • Nhấn Esc để đóng</p>
        </div>
      </div>
    </>
  )
}

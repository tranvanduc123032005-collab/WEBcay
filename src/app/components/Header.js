'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')
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

  const isHome = pathname === '/'

  const navItems = [
    { label: 'Home', href: isHome ? '#hero' : '/' },
    { label: 'About Us', href: isHome ? '#about' : '/#about' },
    { label: 'Product', href: isHome ? '#best-sellers' : '/#best-sellers' },
    { label: 'Testimonial', href: isHome ? '#testimonial' : '/#testimonial' },
    { label: 'Contact', href: isHome ? '#footer' : '/#footer' },
  ]

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="logo">ĐỨC NGƯỜI CÂY</Link>
        <nav className="navbar">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={
                    (item.label === 'Home' && pathname === '/') ||
                    (item.label === 'Product' && pathname === '/detail')
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
            >
              ☀️
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              title="Chế độ tối"
            >
              🌙
            </button>
          </div>

          {/* Icon Search */}
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </a>
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
  )
}

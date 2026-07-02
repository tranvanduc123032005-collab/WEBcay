'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const ChatWidget = dynamic(() => import('../components/ChatWidget'), { ssr: false })

export default function DetailPage() {
  const [productId, setProductId] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeSize, setActiveSize] = useState('Small')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [toast, setToast] = useState({ visible: false, message: '' })

  // Đọc ID từ URL query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id') || '1'
      setProductId(id)
    }
  }, [])

  // Fetch thông tin sản phẩm
  useEffect(() => {
    if (!productId) return
    async function loadProduct() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          const found = data.find((p) => p.id === productId)
          if (found) {
            setProduct(found)
          } else if (data.length > 0) {
            // Mặc định lấy sản phẩm đầu tiên nếu không khớp ID hoặc truy cập trực tiếp
            setProduct(data[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId])

  function handleQuantityChange(delta) {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', color: '#1E3F20', fontWeight: '600' }}>
          Đang tải chi tiết cây cảnh...
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', height: '60vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <h2 style={{ color: '#e74c3c' }}>Không tìm thấy sản phẩm!</h2>
          <Link href="/" className="btn btn-primary">Quay lại Trang chủ</Link>
        </div>
        <Footer />
      </>
    )
  }

  const thumbnails = [
    product.image,
    '/images/product-2.jpg',
    '/images/product-3.jpg',
  ]

  const sizes = ['Small', 'Medium', 'Large']

  return (
    <>
      <Header />
      <div className="page-transition">

      {/* PRODUCT DETAIL */}
      <main className="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">{product.name}</span>
          </nav>

          <div className="detail-wrapper">
            {/* Bên trái: Ảnh sản phẩm */}
            <div className="product-gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnails[activeThumb] || product.image}
                alt={product.name}
                className="main-image"
                fetchPriority="high"
                loading="eager"
              />
              <div className="thumbnail-list">
                {thumbnails.map((thumb, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={thumb}
                    alt={`View ${i + 1}`}
                    className={`thumbnail ${i === activeThumb ? 'active' : ''}`}
                    onClick={() => setActiveThumb(i)}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>

            {/* Bên phải: Thông tin sản phẩm */}
            <div className="product-info-detail">
              <span className="product-category">{product.category}</span>
              <h1>{product.name}</h1>
              <div className="product-rating-detail">
                <span className="stars">★★★★★</span>
                <span>({product.ratingValue?.toFixed(1) || '5.0'} - {product.ratingCount || 100} reviews)</span>
              </div>
              <p className="product-price-detail">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </p>
              <p className="product-desc">
                {product.description || 'Chưa có mô tả chi tiết về sản phẩm này.'}
              </p>

              <div className="product-options">
                <div className="option-group">
                  <label>Size</label>
                  <div className="size-buttons">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${activeSize === size ? 'active' : ''}`}
                        onClick={() => setActiveSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="option-group">
                  <label>Quantity</label>
                  <div className="quantity-selector">
                    <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      className="qty-input"
                      readOnly
                    />
                    <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                  </div>
                </div>
              </div>
              <div className="detail-actions">
                <button className="btn btn-primary btn-full" onClick={() => {
                  addToCart(product, quantity, activeSize)
                  setToast({ visible: true, message: `Đã thêm ${quantity} x ${product.name} (${activeSize}) vào giỏ hàng!` })
                  setTimeout(() => setToast({ visible: false, message: '' }), 3000)
                }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <div className={`toast ${toast.visible ? 'toast-visible' : ''}`} id="toast">
        <span className="toast-icon">✓</span>
        <span className="toast-message">{toast.message}</span>
      </div>

      {/* AI Chatbot Gemini */}
      <ChatWidget />
      </div>

      <Footer />
    </>
  )
}

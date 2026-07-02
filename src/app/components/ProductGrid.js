'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedIndex, setAddedIndex] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const toastTimer = useRef(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  function handleAddToCart(index, product) {
    addToCart(product)
    setAddedIndex(index)

    // Show toast
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ visible: true, message: `${product.name} đã thêm vào giỏ hàng!` })
    toastTimer.current = setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 3000)

    // Reset button
    setTimeout(() => setAddedIndex(null), 1500)
  }

  return (
    <>
      <section className="best-sellers" id="best-sellers">
        <div className="container">
          <div className="best-sellers-header">
            <span className="section-label">Best Sellers</span>
            <h2 className="section-title">Our Best Sellers</h2>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-image" />
                  <div className="skeleton-title" />
                  <div className="skeleton-text" />
                  <div className="skeleton-footer">
                    <div className="skeleton-price" />
                    <div className="skeleton-btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, i) => (
                <div className="product-card" key={product.id || i}>
                  <div className="product-image">
                    <Link href={`/detail?id=${product.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} style={{ cursor: 'pointer' }} loading="lazy" />
                    </Link>
                  </div>
                  <div className="product-info">
                    <Link href={`/detail?id=${product.id}`}>
                      <h3 style={{ cursor: 'pointer' }}>{product.name}</h3>
                    </Link>
                    <div className="product-rating">
                      <span className="stars">{product.rating || '★★★★★'}</span>
                      <span className="rating-count">({product.ratingValue?.toFixed(1) || '5.0'})</span>
                    </div>
                    <div className="product-price-row">
                      <span className="price">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </span>
                      <button
                        className={`add-to-cart ${addedIndex === i ? 'cart-added' : ''}`}
                        onClick={() => handleAddToCart(i, product)}
                        aria-label={`Thêm ${product.name} vào giỏ hàng`}
                      >
                        {addedIndex === i ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast ${toast.visible ? 'toast-visible' : ''}`} id="toast">
        <span className="toast-icon">✓</span>
        <span className="toast-message">{toast.message}</span>
      </div>
    </>
  )
}


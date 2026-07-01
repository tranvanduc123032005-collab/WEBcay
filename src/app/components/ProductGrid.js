'use client'

import { useState, useRef } from 'react'

const products = [
  { name: 'Monstera Deliciosa', rating: '★★★★★', ratingCount: '(5.0)', price: '$25.00', image: '/images/product-1.jpg' },
  { name: 'Snake Plant', rating: '★★★★★', ratingCount: '(4.9)', price: '$18.00', image: '/images/product-2.jpg' },
  { name: 'Fiddle Leaf Fig', rating: '★★★★★', ratingCount: '(4.8)', price: '$35.00', image: '/images/product-3.jpg' },
  { name: 'Aloe Vera', rating: '★★★★★', ratingCount: '(4.7)', price: '$15.00', image: '/images/product-4.jpg' },
]

export default function ProductGrid() {
  const [cartCount, setCartCount] = useState(0)
  const [addedIndex, setAddedIndex] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const toastTimer = useRef(null)

  function handleAddToCart(index, productName) {
    const newCount = cartCount + 1
    setCartCount(newCount)
    setAddedIndex(index)

    // Dispatch cart-update event for Header
    window.dispatchEvent(new CustomEvent('cart-update', { detail: { count: newCount } }))

    // Show toast
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ visible: true, message: `${productName} đã thêm vào giỏ hàng!` })
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
          <div className="products-grid">
            {products.map((product, i) => (
              <div className="product-card" key={i}>
                <div className="product-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">{product.rating}</span>
                    <span className="rating-count">{product.ratingCount}</span>
                  </div>
                  <div className="product-price-row">
                    <span className="price">{product.price}</span>
                    <button
                      className={`add-to-cart ${addedIndex === i ? 'cart-added' : ''}`}
                      onClick={() => handleAddToCart(i, product.name)}
                    >
                      {addedIndex === i ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

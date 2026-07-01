'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function DetailPage() {
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeSize, setActiveSize] = useState('Small')
  const [quantity, setQuantity] = useState(1)

  const thumbnails = [
    '/images/product-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
  ]

  const sizes = ['Small', 'Medium', 'Large']

  function handleQuantityChange(delta) {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  return (
    <>
      <Header />

      {/* PRODUCT DETAIL */}
      <main className="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">Monstera Deliciosa</span>
          </nav>

          <div className="detail-wrapper">
            {/* Bên trái: Ảnh sản phẩm */}
            <div className="product-gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnails[activeThumb]}
                alt="Monstera Deliciosa"
                className="main-image"
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
                  />
                ))}
              </div>
            </div>

            {/* Bên phải: Thông tin sản phẩm */}
            <div className="product-info-detail">
              <span className="product-category">Indoor Plants</span>
              <h1>Monstera Deliciosa</h1>
              <div className="product-rating-detail">
                <span className="stars">★★★★★</span>
                <span>(5.0 - 120 reviews)</span>
              </div>
              <p className="product-price-detail">$25.00</p>
              <p className="product-desc">
                The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular
                tropical houseplant. Its large, glossy, heart-shaped leaves develop distinctive holes as they
                mature, making it a stunning decorative piece for any room.
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
                <button className="btn btn-primary btn-full">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

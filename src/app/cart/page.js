'use client'

import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart()

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="cart-page">
          <div className="container">
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <h2>Giỏ hàng trống</h2>
              <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
              <Link href="/#best-sellers" className="btn btn-primary">Mua sắm ngay</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="page-transition">
      <main className="cart-page">
        <div className="container">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <p className="cart-subtitle">{getItemCount()} sản phẩm</p>

          <div className="cart-layout">
            {/* Danh sách sản phẩm */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <span className="cart-item-category">{item.category} (Size: {item.size || 'Small'})</span>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size || 'Small', item.quantity - 1)}>-</button>
                      <input type="number" value={item.quantity} readOnly className="qty-input" />
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size || 'Small', item.quantity + 1)}>+</button>
                    </div>
                    <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id, item.size || 'Small')}>✕ Xóa</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng kết đơn hàng */}
            <div className="cart-summary">
              <h3>Tổng đơn hàng</h3>
              <div className="cart-summary-row">
                <span>Tạm tính</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí giao hàng</span>
                <span className="free-shipping">Miễn phí</span>
              </div>
              <div className="cart-summary-total">
                <span>Tổng cộng</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary btn-full">Tiến hành thanh toán</Link>
              <Link href="/#best-sellers" className="btn btn-outline btn-full" style={{ marginTop: '10px' }}>Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  )
}

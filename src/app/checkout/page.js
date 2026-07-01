'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', customerAddress: '', customerEmail: '', note: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: getTotal(),
          paymentMethod
        })
      })

      if (res.ok) {
        const data = await res.json()
        setOrderId(data._id)
        setOrderSuccess(true)
        clearCart()
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!')
    } finally {
      setSubmitting(false)
    }
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <h2>Giỏ hàng trống</h2>
              <p>Vui lòng thêm sản phẩm trước khi thanh toán.</p>
              <Link href="/#best-sellers" className="btn btn-primary">Mua sắm ngay</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="order-success">
              <span className="success-icon">✅</span>
              <h2>Đặt hàng thành công!</h2>
              <p>Mã đơn hàng: <strong>{orderId}</strong></p>
              <p>Cảm ơn bạn đã mua sắm tại ĐỨC NGƯỜI CÂY. Chúng tôi sẽ liên hệ sớm nhất!</p>

              {paymentMethod === 'bank_transfer' && (
                <div className="payment-info-box">
                  <h3>💳 Thông tin chuyển khoản</h3>
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số tài khoản:</strong> 1234 5678 9012</p>
                  <p><strong>Chủ tài khoản:</strong> TRAN VAN DUC</p>
                  <p><strong>Nội dung CK:</strong> DH {orderId?.slice(-6)}</p>
                </div>
              )}

              {paymentMethod === 'online_payment' && (
                <div className="payment-info-box">
                  <h3>📱 Quét mã QR để thanh toán</h3>
                  <div className="qr-placeholder">
                    <div className="qr-code">QR CODE</div>
                    <p>Quét mã QR bằng ứng dụng ngân hàng</p>
                    <p><strong>Số tiền:</strong> ${getTotal().toFixed(2)}</p>
                  </div>
                </div>
              )}

              <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Quay lại trang chủ</Link>
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
      <main className="checkout-page">
        <div className="container">
          <h1 className="cart-title">Thanh toán</h1>

          <form onSubmit={handleSubmit} className="checkout-layout">
            {/* Thông tin giao hàng */}
            <div className="checkout-form">
              <h3>📦 Thông tin giao hàng</h3>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} placeholder="0912 345 678" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng *</label>
                <input type="text" name="customerAddress" required value={formData.customerAddress} onChange={handleChange} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea name="note" rows="3" value={formData.note} onChange={handleChange} placeholder="Ghi chú thêm cho đơn hàng..." />
              </div>

              {/* Phương thức thanh toán */}
              <h3 style={{ marginTop: '30px' }}>💳 Phương thức thanh toán</h3>
              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="payment-option-content">
                    <span className="payment-icon">🚚</span>
                    <div>
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="payment-option-content">
                    <span className="payment-icon">🏦</span>
                    <div>
                      <strong>Chuyển khoản ngân hàng</strong>
                      <p>Chuyển khoản qua tài khoản ngân hàng</p>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${paymentMethod === 'online_payment' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="online_payment" checked={paymentMethod === 'online_payment'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="payment-option-content">
                    <span className="payment-icon">📱</span>
                    <div>
                      <strong>Thanh toán trực tuyến (QR Code)</strong>
                      <p>Quét mã QR qua ứng dụng ngân hàng</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="cart-summary">
              <h3>Đơn hàng ({cartItems.length} sản phẩm)</h3>
              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="checkout-item-img" />
                    <div className="checkout-item-info">
                      <span>{item.name}</span>
                      <span className="checkout-item-qty">x{item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
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
              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Đang xử lý...' : '🛒 Đặt hàng'}
              </button>
            </div>
          </form>
        </div>
      </main>
      </div>
      <Footer />
    </>
  )
}

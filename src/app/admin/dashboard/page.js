'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(null)
  
  // State form cho Thêm / Sửa
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Indoor Plants')
  const [formPrice, setFormPrice] = useState('')
  const [formRatingValue, setFormRatingValue] = useState('5.0')
  const [formRatingCount, setFormRatingCount] = useState('100')
  const [formDescription, setFormDescription] = useState('')
  const [formImage, setFormImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })

  // Tải danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      showToast('Không thể kết nối đến máy chủ!', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: '' }), 3000)
  }

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setEditProduct(null)
    setFormName('')
    setFormCategory('Indoor Plants')
    setFormPrice('')
    setFormRatingValue('5.0')
    setFormRatingCount('100')
    setFormDescription('')
    setFormImage('')
    setShowModal(true)
  }

  // Mở modal Chỉnh sửa
  const handleOpenEditModal = (product) => {
    setEditProduct(product)
    setFormName(product.name)
    setFormCategory(product.category)
    setFormPrice(product.price)
    setFormRatingValue(product.ratingValue || '5.0')
    setFormRatingCount(product.ratingCount || '100')
    setFormDescription(product.description || '')
    setFormImage(product.image)
    setShowModal(true)
  }

  // Xử lý upload ảnh trực tiếp
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const data = await res.json()
        setFormImage(data.url)
        showToast('Tải ảnh lên thành công!')
      } else {
        showToast('Tải ảnh lên thất bại!', 'error')
      }
    } catch (error) {
      showToast('Lỗi khi tải ảnh lên!', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Xử lý gửi Form (Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formImage) {
      showToast('Vui lòng tải ảnh lên hoặc điền link ảnh!', 'error')
      return
    }

    const payload = {
      name: formName,
      category: formCategory,
      price: parseFloat(formPrice),
      ratingValue: parseFloat(formRatingValue),
      ratingCount: parseInt(formRatingCount),
      description: formDescription,
      image: formImage
    }

    try {
      let res
      if (editProduct) {
        // Chế độ Edit
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editProduct.id })
        })
      } else {
        // Chế độ Add
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        showToast(editProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!')
        setShowModal(false)
        fetchProducts()
      } else {
        showToast('Đã có lỗi xảy ra!', 'error')
      }
    } catch (error) {
      showToast('Lỗi gửi dữ liệu!', 'error')
    }
  }

  // Xử lý Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        showToast('Đã xóa sản phẩm thành công!')
        fetchProducts()
      } else {
        showToast('Xóa sản phẩm thất bại!', 'error')
      }
    } catch (error) {
      showToast('Lỗi khi xóa sản phẩm!', 'error')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast Notification */}
      {notification.message && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          backgroundColor: notification.type === 'error' ? '#e74c3c' : '#1E3F20',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: '500',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {notification.type === 'error' ? '❌' : '✓'} {notification.message}
        </div>
      )}

      {/* Thống kê Tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '14px', color: '#5F6F65', fontWeight: '500' }}>Tổng số sản phẩm</span>
          <h2 style={{ fontSize: '32px', color: '#1E3F20', margin: '8px 0 0 0', fontWeight: '700' }}>{products.length}</h2>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '14px', color: '#5F6F65', fontWeight: '500' }}>Số danh mục</span>
          <h2 style={{ fontSize: '32px', color: '#1E3F20', margin: '8px 0 0 0', fontWeight: '700' }}>
            {new Set(products.map(p => p.category)).size}
          </h2>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '14px', color: '#5F6F65', fontWeight: '500' }}>Đơn giá trung bình</span>
          <h2 style={{ fontSize: '32px', color: '#1E3F20', margin: '8px 0 0 0', fontWeight: '700' }}>
            ${products.length > 0 ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2) : 0}
          </h2>
        </div>
      </div>

      {/* Header section danh sách */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', color: '#1E3F20', margin: 0, fontWeight: '700' }}>Danh sách sản phẩm</h3>
        <button 
          onClick={handleOpenAddModal}
          style={{
            backgroundColor: '#1E3F20',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2d5a30'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E3F20'}
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#5F6F65' }}>Đang tải danh sách...</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9F6', borderBottom: '1.5px solid #E0E5DC' }}>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600' }}>Hình ảnh</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600' }}>Tên sản phẩm</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600' }}>Danh mục</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600' }}>Giá</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600' }}>Đánh giá</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: '#5F6F65', fontWeight: '600', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #F0F4EF', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '12px 24px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#F5F7F4' }} 
                    />
                  </td>
                  <td style={{ padding: '12px 24px', fontWeight: '600', color: '#1E3F20', fontSize: '14px' }}>{product.name}</td>
                  <td style={{ padding: '12px 24px', color: '#5F6F65', fontSize: '14px' }}>{product.category}</td>
                  <td style={{ padding: '12px 24px', fontWeight: '700', color: '#1E3F20', fontSize: '14px' }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '12px 24px', fontSize: '13px', color: '#5F6F65' }}>
                    ⭐️ {product.ratingValue} ({product.ratingCount})
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenEditModal(product)}
                        style={{
                          backgroundColor: '#F5F7F4',
                          border: 'none',
                          color: '#3A5F43',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#3A5F43'; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#F5F7F4'; e.currentTarget.style.color = '#3A5F43' }}
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        style={{
                          backgroundColor: '#fde8e8',
                          border: 'none',
                          color: '#e74c3c',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e74c3c'; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fde8e8'; e.currentTarget.style.color = '#e74c3c' }}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa Sản phẩm */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '550px',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            fontFamily: 'var(--font-inter), sans-serif'
          }}>
            <header style={{
              padding: '20px 24px',
              borderBottom: '1px solid #FAF9F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAF9F6'
            }}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E3F20' }}>
                {editProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
              </h4>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#5F6F65' }}
              >
                &times;
              </button>
            </header>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Tên cây cảnh</label>
                  <input 
                    type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} 
                    placeholder="Ví dụ: Monstera Deliciosa"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Danh mục</label>
                  <select 
                    value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="Indoor Plants">Indoor Plants</option>
                    <option value="Outdoor Plants">Outdoor Plants</option>
                    <option value="Office Plants">Office Plants</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Giá ($)</label>
                  <input 
                    type="number" step="0.01" required value={formPrice} onChange={(e) => setFormPrice(e.target.value)} 
                    placeholder="25.00"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Điểm đánh giá (0-5)</label>
                  <input 
                    type="number" step="0.1" min="0" max="5" required value={formRatingValue} onChange={(e) => setFormRatingValue(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Số lượt đánh giá</label>
                  <input 
                    type="number" required value={formRatingCount} onChange={(e) => setFormRatingCount(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Mô tả sản phẩm</label>
                <textarea 
                  rows="3" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d1d1', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Tải hình ảnh lên (Upload & Preview) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E3F20', marginBottom: '6px' }}>Hình ảnh sản phẩm</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    flex: 1,
                    border: '2px dashed #d1d1d1',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#FAF9F6'
                  }}>
                    <input 
                      type="file" accept="image/*" onChange={handleImageUpload}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#5F6F65', fontWeight: '500' }}>
                      {uploading ? '⏳ Đang tải ảnh lên...' : '📁 Chọn ảnh từ thiết bị để tải lên'}
                    </span>
                  </div>
                  
                  {formImage && (
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid #E0E5DC', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7F4' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              </div>

              <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  style={{ border: 'none', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#F5F7F4', color: '#5F6F65', fontWeight: '600', cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" disabled={uploading}
                  style={{ border: 'none', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1E3F20', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                >
                  {editProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

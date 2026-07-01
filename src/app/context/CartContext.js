'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // Khôi phục giỏ hàng từ localStorage khi tải trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem('oasis-cart')
      if (saved) setCartItems(JSON.parse(saved))
    } catch (e) { /* ignore */ }
  }, [])

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('oasis-cart', JSON.stringify(cartItems))
    // Phát sự kiện cập nhật badge giỏ hàng cho Header
    window.dispatchEvent(new CustomEvent('cart-update', { detail: { count: cartItems.reduce((s, i) => s + i.quantity, 0) } }))
  }, [cartItems])

  function addToCart(product, quantityToAdd = 1, size = 'Small') {
    setCartItems(prev => {
      const itemKey = `${product.id}-${size}`
      const existing = prev.find(item => `${item.id}-${item.size || 'Small'}` === itemKey)
      if (existing) {
        return prev.map(item =>
          `${item.id}-${item.size || 'Small'}` === itemKey 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        )
      }
      return [...prev, { ...product, quantity: quantityToAdd, size }]
    })
  }

  function removeFromCart(productId, size = 'Small') {
    setCartItems(prev => prev.filter(item => !(item.id === productId && (item.size || 'Small') === size)))
  }

  function updateQuantity(productId, size = 'Small', quantity) {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setCartItems(prev =>
      prev.map(item => (item.id === productId && (item.size || 'Small') === size) ? { ...item, quantity } : item)
    )
  }

  function clearCart() {
    setCartItems([])
  }

  function getTotal() {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  function getItemCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CART_STORAGE_KEY = 'mini-ecommerce-cart'

const CartContext = createContext(null)

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > product.stock) {
          throw new Error(`Stock insuffisant (max: ${product.stock})`)
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        )
      }
      if (quantity > product.stock) {
        throw new Error(`Stock insuffisant (max: ${product.stock})`)
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock: product.stock,
          quantity,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== productId)
      }
      return prev.map((item) => {
        if (item.id !== productId) return item
        if (quantity > item.stock) {
          throw new Error(`Stock insuffisant (max: ${item.stock})`)
        }
        return { ...item, quantity }
      })
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useCart } from '../context/CartContext'
import { formatPrice, getProductImageUrl } from '../utils/helpers'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (items.length === 0) return

    setLoading(true)
    setError('')

    const orderItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }))

    const { data, error: orderError } = await supabase.rpc('place_order', {
      order_items: orderItems,
    })

    if (orderError) {
      setError(orderError.message)
      setLoading(false)
      return
    }

    clearCart()
    navigate(`/orders/${data}`, { replace: true })
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Panier vide</h1>
        <Link to="/products" className="mt-4 inline-block text-primary-600">
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Confirmation de commande</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Récapitulatif</h2>
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              <img
                src={getProductImageUrl(item.image_url)}
                alt={item.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 flex gap-4">
        <Link
          to="/cart"
          className="flex-1 rounded-xl border border-gray-300 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
        >
          Retour au panier
        </Link>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 rounded-xl bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  )
}

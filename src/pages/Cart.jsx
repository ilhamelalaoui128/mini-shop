import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/helpers'

export default function Cart() {
  const { items, subtotal, total, updateQuantity, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <svg
          className="mx-auto h-16 w-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Votre panier est vide</h1>
        <p className="mt-2 text-gray-500">Ajoutez des produits pour commencer vos achats.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Panier</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Récapitulatif</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-xl bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700"
          >
            {user ? 'Passer commande' : 'Se connecter pour commander'}
          </button>
          <Link
            to="/products"
            className="mt-3 block text-center text-sm text-primary-600 hover:text-primary-700"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useCart } from '../context/CartContext'
import { formatPrice, getProductImageUrl } from '../utils/helpers'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('id', id)
        .single()

      setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    setError('')
    setMessage('')
    try {
      addToCart(product, quantity)
      setMessage(`${quantity} article(s) ajouté(s) au panier !`)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Produit introuvable</h1>
        <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          ← Retour aux produits
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/products" className="mb-6 inline-block text-sm text-primary-600 hover:text-primary-700">
        ← Retour aux produits
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={getProductImageUrl(product.image_url)}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          {product.categories && (
            <Link
              to={`/products?category=${product.categories.id}`}
              className="text-sm font-medium uppercase tracking-wide text-primary-600 hover:text-primary-700"
            >
              {product.categories.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} en stock`
              : 'Rupture de stock'}
          </p>

          <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

          {product.stock > 0 && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantité
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="min-w-[3rem] text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>
          )}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

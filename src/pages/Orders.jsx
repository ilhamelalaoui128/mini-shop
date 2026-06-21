import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { formatPrice } from '../utils/helpers'

const STATUS_LABELS = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
}

function OrderStatusBadge({ status }) {
  const config = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase
          .from('order_items')
          .select('*, products(name, image_url)')
          .eq('order_id', id),
      ])

      setOrder(orderRes.data)
      setItems(itemsRes.data || [])
      setLoading(false)
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
  }

  if (!order) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Commande introuvable</h2>
        <Link to="/orders" className="mt-4 inline-block text-primary-600">
          ← Mes commandes
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/orders" className="mb-6 inline-block text-sm text-primary-600 hover:text-primary-700">
        ← Mes commandes
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-900">{item.products?.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

function OrdersList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Aucune commande</h2>
        <p className="mt-2 text-gray-500">Vous n'avez pas encore passé de commande.</p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Découvrir nos produits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-gray-900">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <OrderStatusBadge status={order.status} />
            <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function Orders() {
  const { id } = useParams()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {!id && (
        <>
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Mes commandes</h1>
          <OrdersList />
        </>
      )}
      {id && <OrderDetail />}
    </div>
  )
}

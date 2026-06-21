import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { formatPrice } from '../../utils/helpers'
import { useNotification } from '../../context/NotificationContext'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export default function AdminOrders() {
  const { showNotification } = useNotification()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, id)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const viewOrder = async (order) => {
    setSelectedOrder(order)
    const { data } = await supabase
      .from('order_items')
      .select('*, products(name)')
      .eq('order_id', order.id)
    setOrderItems(data || [])
  }

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    if (error) {
      showNotification(error.message, 'error')
      return
    }
    showNotification('Statut de la commande mis à jour !')
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status }))
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Gestion des commandes</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Orders List Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">Aucune commande.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const clientName = order.profiles?.full_name || '—'
                const isSelected = selectedOrder?.id === order.id

                const statusColor = 
                  order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                  order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'

                const statusLabel = STATUS_LABELS[order.status] || order.status

                return (
                  <div
                    key={order.id}
                    onClick={() => viewOrder(order)}
                    className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/20 ring-2 ring-primary-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-150">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor} font-semibold`}>
                        {statusLabel}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{clientName}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-primary-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side: Order Detail Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 h-fit sticky top-24">
          {selectedOrder ? (
            <div className="animate-slide-in">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Commande #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Client : <span className="font-semibold text-gray-700">{selectedOrder.profiles?.full_name}</span>
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Date : {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Mettre à jour le statut
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Articles commandés
              </label>
              <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-1 max-h-60 overflow-y-auto mb-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{item.products?.name || 'Produit retiré'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-150 font-bold">
                <span className="text-sm text-gray-500">Total Général</span>
                <span className="text-xl text-primary-600">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">Sélectionnez une commande à gauche pour afficher ses détails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

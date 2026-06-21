import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { formatPrice } from '../utils/helpers'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [products, categories, orders, users, recent] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const revenue = (orders.data || [])
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total), 0)

      setStats({
        products: products.count || 0,
        categories: categories.count || 0,
        orders: orders.data?.length || 0,
        users: users.count || 0,
        revenue,
      })
      setRecentOrders(recent.data || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Produits', value: stats.products, link: '/admin/products', color: 'bg-blue-500' },
    { label: 'Catégories', value: stats.categories, link: '/admin/categories', color: 'bg-green-500' },
    { label: 'Commandes', value: stats.orders, link: '/admin/orders', color: 'bg-purple-500' },
    { label: 'Utilisateurs', value: stats.users, link: '/admin/users', color: 'bg-orange-500' },
    { label: 'Revenus', value: formatPrice(stats.revenue), link: '/admin/orders', color: 'bg-primary-600', sub: 'Hors commandes annulées' },
  ]

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Tableau de bord</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`h-1.5 ${card.color}`} />
            <div className="p-6">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              {card.sub && <p className="mt-1 text-xs text-gray-400 font-medium">{card.sub}</p>}
            </div>
          </Link>
        ))}
      </div>


      <div className="mt-10 rounded-xl bg-white p-6 shadow-sm border border-gray-150">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
          <Link to="/admin/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            Voir tout →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-center py-6 text-gray-500">Aucune commande pour le moment.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recentOrders.map((order) => {
              const clientName = order.profiles?.full_name || 'Utilisateur'
              const initials = clientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              const statusColor = 
                order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-200'

              const statusLabel = 
                order.status === 'delivered' ? 'Livrée' :
                order.status === 'cancelled' ? 'Annulée' :
                order.status === 'shipped' ? 'Expédiée' :
                order.status === 'confirmed' ? 'Confirmée' :
                'En attente'

              return (
                <div
                  key={order.id}
                  className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200 animate-slide-in"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusColor} font-semibold`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-none">{clientName}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                    <span className="text-xs text-gray-400">Montant total</span>
                    <span className="text-sm font-bold text-primary-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


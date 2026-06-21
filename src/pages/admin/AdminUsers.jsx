import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Utilisateurs</h2>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">Aucun utilisateur inscrit.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => {
            const clientName = user.full_name || 'Utilisateur'
            const initials = clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 animate-slide-in"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900" title={clientName}>
                    {clientName}
                  </p>
                  <p className="text-[10px] text-gray-450 mt-0.5">
                    Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-gray-50 text-gray-650 border border-gray-200'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-8 text-sm text-gray-500 bg-gray-50 border border-gray-150 rounded-xl p-4 h-fit max-w-xl">
        💡 **Note :** Pour promouvoir un utilisateur au rang d'administrateur, exécutez la commande SQL suivante dans votre SQL Editor Supabase :<br />
        <code className="block mt-2 rounded bg-gray-200/60 p-2 font-mono text-xs text-gray-800 border border-gray-300">
          UPDATE profiles SET role = 'admin' WHERE id = 'L_ID_UUID_DE_L_UTILISATEUR';
        </code>
      </p>
    </div>
  )
}

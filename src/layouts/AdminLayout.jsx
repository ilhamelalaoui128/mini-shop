import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { 
    to: '/admin', 
    label: 'Tableau de bord', 
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    to: '/admin/categories', 
    label: 'Catégories',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  { 
    to: '/admin/products', 
    label: 'Produits',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  },
  { 
    to: '/admin/orders', 
    label: 'Commandes',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  { 
    to: '/admin/users', 
    label: 'Utilisateurs',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  const isActive = (link) =>
    link.exact
      ? location.pathname === link.to
      : location.pathname.startsWith(link.to)

  return (
    <div className="relative flex min-h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary-100/40 blur-[120px] translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-indigo-100/40 blur-[120px] -translate-x-1/3 translate-y-1/4"></div>
      </div>

      {/* Premium Glassmorphism Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-72 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transition-all">
        <div className="flex flex-col items-center border-b border-gray-100/50 p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex transition-transform group-hover:scale-105">
              <svg className="h-10 w-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="nav-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <rect x="4" y="10" width="24" height="18" rx="4" fill="url(#nav-logo-gradient)" />
                <path d="M10 10V7C10 4.23858 12.2386 2 15 2H17C19.7614 2 22 4.23858 22 7V10" stroke="url(#nav-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
                <path d="M10 22V15L16 19L22 15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Mini Shop
            </span>
          </Link>
          <span className="mt-4 inline-block rounded-full bg-gradient-to-r from-primary-50 to-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 ring-1 ring-primary-500/10">
            Espace Admin
          </span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {adminLinks.map((link) => {
            const active = isActive(link)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25 translate-x-1'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md hover:shadow-gray-200/50 hover:translate-x-1'
                }`}
              >
                <span className={`${active ? 'text-white' : 'text-gray-400 transition-colors group-hover:text-primary-500'}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-100/50 p-6 bg-white/30 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-100 to-indigo-100 text-sm font-bold text-primary-700 shadow-inner">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-gray-900">{profile?.full_name}</p>
              <p className="truncate text-xs text-gray-500">Connecté en tant qu'admin</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm border border-gray-200 transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              Boutique
            </Link>
            <button
              onClick={signOut}
              className="flex-1 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-100 hover:text-red-700"
            >
              Quitter
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-72 flex-1 relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-xl px-10 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {adminLinks.find((l) => isActive(l))?.label || 'Administration'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm font-medium text-gray-500 bg-white/50 px-4 py-2 rounded-full border border-gray-200/50 shadow-sm">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-10 animate-slide-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

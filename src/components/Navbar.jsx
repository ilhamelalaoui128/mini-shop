import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Mini Shop
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            Accueil
          </Link>
          <Link 
            to="/categories" 
            className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/categories') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            Catégories
          </Link>
          <Link 
            to="/products" 
            className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/products') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            Produits
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-primary-600 sm:block"
              >
                Mes commandes
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md sm:block"
                >
                  Admin
                </Link>
              )}
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-100 to-indigo-100 text-sm font-bold text-primary-700 lg:flex">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleSignOut}
                className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:block"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-600 hover:bg-gray-50"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5"
              >
                Inscription
              </Link>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Fermer le menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
            >
              Accueil
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive('/categories') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
            >
              Catégories
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive('/products') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
            >
              Produits
            </Link>

            <hr className="my-6 border-gray-100" />

            {user ? (
              <div className="flex flex-col gap-2">
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-100 to-indigo-100 text-xl font-bold text-primary-700">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold text-gray-900">{profile?.full_name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600"
                >
                  Mes commandes
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 rounded-xl bg-gray-900 px-4 py-3 text-center text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800"
                  >
                    Espace Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-base font-bold text-red-600 shadow-sm transition-colors hover:bg-red-100 hover:text-red-700"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-xl border border-gray-200 py-3.5 text-center text-base font-bold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-center text-base font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  Inscription
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}


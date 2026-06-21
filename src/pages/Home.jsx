import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*, products(count)').order('name'),
        supabase
          .from('products')
          .select('*, categories(name)')
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      if (categoriesRes.data) {
        setCategories(
          categoriesRes.data.map((c) => ({
            ...c,
            product_count: c.products?.[0]?.count ?? 0,
          }))
        )
      }
      if (productsRes.data) setProducts(productsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Abstract Background Glowing Orbs */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary-600/30 blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] translate-y-1/3 rounded-full bg-indigo-600/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300 ring-1 ring-inset ring-primary-500/20">
            Nouveautés 2026 disponibles
          </span>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Bienvenue sur <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Mini Shop</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Découvrez notre sélection de produits de qualité. Parcourez, comparez et commandez en quelques clics dans un univers conçu pour vous.
          </p>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/5 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-md sm:mt-12">
            <SearchBar className="[&_input]:text-gray-900 [&_input]:h-12 [&_input]:text-base" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
          <Link to="/categories" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Produits récents</h2>
            <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">Aucun produit disponible.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

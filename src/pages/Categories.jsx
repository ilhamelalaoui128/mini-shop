import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import CategoryCard from '../components/CategoryCard'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*, products(count)')
        .order('name')

      if (data) {
        setCategories(
          data.map((c) => ({
            ...c,
            product_count: c.products?.[0]?.count ?? 0,
          }))
        )
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Catégories</h1>
      <p className="mb-8 text-gray-500">Parcourez nos catégories de produits</p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">Aucune catégorie disponible.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

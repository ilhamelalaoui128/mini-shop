import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar({ initialValue = '', className = '' }) {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  // Sync state if initialValue or search parameter changes externally
  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    const params = new URLSearchParams(searchParams)

    if (trimmed) {
      params.set('search', trimmed)
    } else {
      params.delete('search')
    }

    // Reset pagination to first page when changing the search criteria
    params.delete('page')

    navigate(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un produit..."
        aria-label="Champ de recherche"
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-600 p-2 text-white hover:bg-primary-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}


import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { formatPrice, getProductImageUrl } from '../../utils/helpers'
import { useNotification } from '../../context/NotificationContext'
import { uploadImage } from '../../services/storage'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  image_url: '',
}

export default function AdminProducts() {
  const { showNotification } = useNotification()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('name'),
      supabase.from('categories').select('id, name').order('name'),
    ])
    setProducts(productsRes.data || [])
    setCategories(categoriesRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file, 'products')
      setForm((prev) => ({ ...prev, image_url: url }))
      showNotification('Image téléversée avec succès !')
    } catch (err) {
      showNotification(`Erreur lors de l'upload : ${err.message}`, 'error')
      setError(`Erreur upload : ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)

    if (!form.name.trim() || !form.category_id) {
      setError('Nom et catégorie sont obligatoires.')
      return
    }
    if (isNaN(price) || price <= 0) {
      setError('Le prix doit être supérieur à 0.')
      return
    }
    if (isNaN(stock) || stock < 0) {
      setError('Le stock doit être un nombre positif.')
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      price,
      stock,
      category_id: form.category_id,
      image_url: form.image_url,
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId)
      if (updateError) { setError(updateError.message); return }
      showNotification('Produit mis à jour avec succès !')
    } else {
      const { error: insertError } = await supabase.from('products').insert(payload)
      if (insertError) { setError(insertError.message); return }
      showNotification('Produit créé avec succès !')
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    fetchData()
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      category_id: product.category_id,
      image_url: product.image_url || '',
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (product) => {
    if (!confirm(`Supprimer le produit "${product.name}" ?`)) return
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)
    if (deleteError) {
      showNotification(deleteError.message, 'error')
      return
    }
    showNotification('Produit supprimé avec succès !')
    fetchData()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-150 animate-slide-in">
          <h3 className="mb-4 font-semibold text-gray-900 text-lg">{editingId ? 'Modifier le produit' : 'Nouveau produit'}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie *</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" required>
                <option value="">Sélectionner...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (€) *</label>
              <input type="number" step="0.01" min="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock *</label>
              <input type="number" min="0" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" required />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image du produit</label>
              <div className="mt-2 flex items-center gap-4">
                {form.image_url ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={form.image_url}
                      alt="Prévisualisation"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: '' })}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600 shadow-sm"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="flex-1">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                    <span>{uploading ? 'Téléchargement...' : 'Choisir un fichier'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-[11px] text-gray-400">PNG, JPG, GIF jusqu'à 5Mo. Téléversé sur Supabase Storage.</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={uploading} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm">
              {editingId ? 'Enregistrer' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Annuler</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">Aucun produit disponible.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const isLowStock = p.stock <= 5
            const isOutOfStock = p.stock === 0
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={getProductImageUrl(p.image_url)}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.categories?.name && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm backdrop-blur-sm">
                      {p.categories.name}
                    </span>
                  )}
                  {isOutOfStock ? (
                    <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Rupture
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Stock bas ({p.stock})
                    </span>
                  ) : (
                    <span className="absolute right-3 top-3 rounded-full bg-green-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Stock : {p.stock}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-base line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-1 flex-1 text-xs text-gray-500 line-clamp-2">
                    {p.description || 'Aucune description.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-lg font-extrabold text-primary-600">
                      {formatPrice(p.price)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Modifier"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

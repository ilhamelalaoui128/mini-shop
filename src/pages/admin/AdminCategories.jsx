import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { getCategoryImageUrl } from '../../utils/helpers'
import { useNotification } from '../../context/NotificationContext'
import { uploadImage } from '../../services/storage'

const emptyForm = { name: '', description: '', image_url: '' }

export default function AdminCategories() {
  const { showNotification } = useNotification()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name')
    setCategories(
      (data || []).map((c) => ({
        ...c,
        product_count: c.products?.[0]?.count ?? 0,
      }))
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file, 'categories')
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

    if (!form.name.trim()) {
      setError('Le nom est obligatoire.')
      return
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from('categories')
        .update(form)
        .eq('id', editingId)
      if (updateError) {
        setError(updateError.message)
        return
      }
      showNotification('Catégorie mise à jour avec succès !')
    } else {
      const { error: insertError } = await supabase.from('categories').insert(form)
      if (insertError) {
        setError(insertError.message)
        return
      }
      showNotification('Catégorie créée avec succès !')
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    fetchCategories()
  }

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (category) => {
    if (category.product_count > 0) {
      showNotification('Impossible de supprimer une catégorie contenant des produits.', 'error')
      return
    }
    if (!confirm(`Supprimer la catégorie "${category.name}" ?`)) return

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)

    if (deleteError) {
      showNotification(deleteError.message, 'error')
      return
    }
    showNotification('Catégorie supprimée avec succès !')
    fetchCategories()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des catégories</h2>
        <button
          onClick={() => {
            setForm(emptyForm)
            setEditingId(null)
            setShowForm(true)
          }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-150 animate-slide-in">
          <h3 className="mb-4 font-semibold text-gray-900 text-lg">
            {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Image de la catégorie</label>
              <div className="mt-2 flex items-center gap-4">
                {form.image_url ? (
                  <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-gray-200">
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
                  <div className="h-16 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
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
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {editingId ? 'Enregistrer' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">Aucune catégorie disponible.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={getCategoryImageUrl(cat.image_url)}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-600 shadow-sm backdrop-blur-sm">
                  {cat.product_count} produit{cat.product_count !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-500 line-clamp-3">
                  {cat.description || 'Aucune description fournie.'}
                </p>
                <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { supabase } from './supabase'

/**
 * Téléverse un fichier image vers le bucket public 'images' de Supabase.
 * @param {File} file Le fichier image sélectionné par l'utilisateur.
 * @param {string} folder Le sous-dossier de destination ('products' ou 'categories').
 * @returns {Promise<string>} L'URL publique de l'image téléversée.
 */
export async function uploadImage(file, folder) {
  if (!file) {
    throw new Error('Aucun fichier sélectionné')
  }

  // Obtenir l'extension du fichier
  const fileExt = file.name.split('.').pop()
  // Générer un identifiant de fichier unique pour éviter l'écrasement
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  // Téléverser l'image vers le bucket 'images'
  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  // Récupérer l'URL publique de l'image téléversée
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

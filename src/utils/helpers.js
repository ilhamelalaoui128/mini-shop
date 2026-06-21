export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function getProductImageUrl(url) {
  if (!url || url.includes('unsplash.com')) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="100%" stop-color="%23e2e8f0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><path d="M170 170 h60 v60 h-60 z M185 170 c0-15 30-15 30 0" fill="none" stroke="%2394a3b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="260" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="%2364748b" text-anchor="middle">Aucune image</text></svg>'
  }
  return url
}

export function getCategoryImageUrl(url) {
  if (!url || url.includes('unsplash.com')) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="100%" stop-color="%23e2e8f0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><path d="M175 110 h20 v20 h-20 z M205 110 h20 v20 h-20 z M175 140 h20 v20 h-20 z M205 140 h20 v20 h-20 z" fill="none" stroke="%2394a3b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="195" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="%2364748b" text-anchor="middle">Aucune image</text></svg>'
  }
  return url
}



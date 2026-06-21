import { Link } from 'react-router-dom'
import { formatPrice, getProductImageUrl, truncateText } from '../utils/helpers'

export default function ProductCard({ product }) {
  const categoryName = product.categories?.name || product.category_name

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={getProductImageUrl(product.image_url)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wide text-primary-600">
            {categoryName}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
          {product.name}
        </h3>
        <p className="mt-1 flex-1 text-sm text-gray-500">
          {truncateText(product.description, 80)}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.stock === 0 ? (
            <span className="text-xs font-medium text-red-500">Rupture</span>
          ) : (
            <span className="text-xs text-gray-400">{product.stock} en stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}

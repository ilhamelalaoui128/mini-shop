import { Link } from 'react-router-dom'
import { getCategoryImageUrl } from '../utils/helpers'

export default function CategoryCard({ category }) {
  const productCount = category.product_count ?? category.products?.[0]?.count ?? 0

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={getCategoryImageUrl(category.image_url)}
          alt={category.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{category.description}</p>
        )}
        <p className="mt-2 text-sm font-medium text-primary-600">
          {productCount} produit{productCount !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}

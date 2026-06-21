import { formatPrice, getProductImageUrl } from '../utils/helpers'
import { useNotification } from '../context/NotificationContext'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { showNotification } = useNotification()

  const handleDecrease = () => {
    try {
      onUpdateQuantity(item.id, item.quantity - 1)
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const handleIncrease = () => {
    try {
      onUpdateQuantity(item.id, item.quantity + 1)
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }


  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <img
        src={getProductImageUrl(item.image_url)}
        alt={item.name}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">{formatPrice(item.price)} / unité</p>
        </div>
        <div className="mt-3 flex items-center gap-4 sm:mt-0">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={handleDecrease}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <p className="min-w-[5rem] text-right font-semibold text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

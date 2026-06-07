import { AlertTriangle, X } from 'lucide-react'

function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Eliminar', danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in">

        {/* Botón cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Ícono */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          danger ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-blue-500'} />
        </div>

        {/* Contenido */}
        <h3 className="text-base font-semibold text-gray-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-medium py-2.5 rounded-xl text-sm transition-colors ${
              danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
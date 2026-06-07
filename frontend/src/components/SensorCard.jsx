import StatusBadge from './StatusBadge'
import { Cpu, Calendar, RefreshCw, SlidersHorizontal, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'


const UNITS = {
  temperatura: '°C',
  presion: 'bar',
  vibracion: 'mm/s',
  flujo: 'L/min'
}

function SensorCard({ monitoring, onEdit, onDelete }) {
  const { sensor, reading_type, threshold_value, current_value, status, is_alert, installation_date, updated_at } = monitoring

  const unit = UNITS[reading_type] || ''

  const [showConfirm, setShowConfirm] = useState(false)
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }
  const handleDelete = () => setShowConfirm(true)

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${
      is_alert ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${is_alert ? 'bg-red-100' : 'bg-blue-50'}`}>
            <Cpu size={16} className={is_alert ? 'text-red-500' : 'text-blue-500'} />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{sensor.name}</p>
            <p className="text-xs text-gray-400">{sensor.manufacturer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar sensor de la zona"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Tipo de lectura */}
      <div className="mb-3">
        <span className="text-xs text-gray-400 block mb-0.5">Tipo de lectura</span>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {reading_type} <span className="text-gray-400 text-xs">({unit})</span>
        </span>
      </div>
      {/* Valores grandes estilo dashboard */}
      <div className="grid grid-cols-2 gap-4 mb-1">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Valor actual</p>
          <p className={`text-2xl font-bold tracking-tight ${is_alert ? 'text-red-600' : 'text-gray-800'}`}>
            {parseFloat(current_value).toLocaleString('es-CO')}
            <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
          </p>
          {is_alert
            ? <div className="flex items-center gap-1 mt-1"><AlertTriangle size={11} className="text-red-500" /><span className="text-xs text-red-500 font-medium">Fuera de umbral</span></div>
            : <div className="flex items-center gap-1 mt-1"><CheckCircle size={11} className="text-green-500" /><span className="text-xs text-green-500 font-medium">Normal</span></div>
          }
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Umbral máx.</p>
          <p className="text-2xl font-bold tracking-tight text-gray-300">
            {parseFloat(threshold_value).toLocaleString('es-CO')}
            <span className="text-sm font-normal text-gray-300 ml-1">{unit}</span>
          </p>
        </div>
      </div>

      {/* Fechas */}
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-gray-300 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-400 block">Instalación</span>
            <span className="text-xs font-medium text-gray-600">{formatDate(installation_date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={12} className="text-gray-300 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-400 block">Actualización</span>
            <span className="text-xs font-medium text-gray-600">{formatDate(updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Botón editar umbral */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg py-2 transition-colors"
        >
          <SlidersHorizontal size={13} />
          Editar umbral
        </button>
      )}
      {showConfirm && (
        <ConfirmModal
          title="¿Eliminar sensor de la zona?"
          message={`El sensor ${sensor.name} será desvinculado de esta zona. Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          onConfirm={() => {
            setShowConfirm(false)
            onDelete && onDelete(monitoring.id)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

export default SensorCard
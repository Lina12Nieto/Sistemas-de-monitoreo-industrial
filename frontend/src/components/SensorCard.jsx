import StatusBadge from './StatusBadge'
import AlertIndicator from './AlertIndicator'
import { Cpu, Calendar, RefreshCw, SlidersHorizontal } from 'lucide-react'

const UNITS = {
  temperatura: '°C',
  presion: 'bar',
  vibracion: 'mm/s',
  flujo: 'L/min'
}

function SensorCard({ monitoring, onEdit }) {
  const { sensor, reading_type, threshold_value, current_value, status, is_alert, installation_date, updated_at } = monitoring

  const unit = UNITS[reading_type] || ''

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

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
        <StatusBadge status={status} />
      </div>

      {/* Tipo de lectura y unidad */}
      <div className="mb-3">
        <span className="text-xs text-gray-400 block mb-0.5">Tipo de lectura</span>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {reading_type} <span className="text-gray-400 text-xs">({unit})</span>
        </span>
      </div>

      {/* Valor actual vs umbral */}
      <AlertIndicator
        currentValue={`${current_value} ${unit}`}
        thresholdValue={`${threshold_value} ${unit}`}
        isAlert={is_alert}
      />

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
    </div>
  )
}

export default SensorCard
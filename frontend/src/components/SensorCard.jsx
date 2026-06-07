import StatusBadge from './StatusBadge'
import AlertIndicator from './AlertIndicator'
import { Cpu } from 'lucide-react'

function SensorCard({ monitoring }) {
  const { sensor, reading_type, threshold_value, current_value, status, is_alert } = monitoring

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${
      is_alert ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
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

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
        <div>
          <span className="block text-gray-400">Tipo sensor</span>
          <span className="font-medium text-gray-700 capitalize">{sensor.type}</span>
        </div>
        <div>
          <span className="block text-gray-400">Tipo lectura</span>
          <span className="font-medium text-gray-700 capitalize">{reading_type}</span>
        </div>
      </div>

      <AlertIndicator
        currentValue={current_value}
        thresholdValue={threshold_value}
        isAlert={is_alert}
      />
    </div>
  )
}

export default SensorCard
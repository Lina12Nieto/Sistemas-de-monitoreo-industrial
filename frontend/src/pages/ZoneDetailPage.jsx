import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getZoneById } from '../services/api'
import SensorCard from '../components/SensorCard'
import EditThresholdModal from '../components/EditThresholdModal'
import AssignSensorModal from '../components/AssignSensorModal'
import { ArrowLeft, MapPin, AlertTriangle, Plus } from 'lucide-react'

function ZoneDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [monitorings, setMonitorings]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [selected, setSelected]         = useState(null)  // modal editar umbral
  const [showAssign, setShowAssign]     = useState(false) // modal asignar sensor

  useEffect(() => {
    getZoneById(id)
      .then(res => setMonitorings(res.data))
      .catch(() => setError('Error al cargar los sensores de esta zona'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdated = (updated) => {
    setMonitorings(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  const handleAssigned = (newMonitoring) => {
    setMonitorings(prev => [...prev, newMonitoring])
  }

  const alerts = monitorings.filter(m => m.is_alert)
  const zone   = monitorings[0]?.zone

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
      {error}
    </div>
  )

  return (
    <div>
      <button
        onClick={() => navigate('/zones')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a zonas
      </button>

      {zone && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{zone.name}</h1>
                <p className="text-sm text-gray-400">{zone.location}</p>
              </div>
            </div>
            {/* Botón asignar sensor */}
            <button
              onClick={() => setShowAssign(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors flex-shrink-0"
            >
              <Plus size={15} />
              Asignar Sensor
            </button>
          </div>
          {zone.description && (
            <p className="text-sm text-gray-500 mt-2">{zone.description}</p>
          )}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">
            {alerts.length} sensor{alerts.length > 1 ? 'es' : ''} superando el umbral configurado
          </p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-700">
          Sensores ({monitorings.length})
        </h2>
      </div>

      {monitorings.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No hay sensores asignados a esta zona
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitorings.map(monitoring => (
            <SensorCard
              key={monitoring.id}
              monitoring={monitoring}
              onEdit={() => setSelected(monitoring)}
            />
          ))}
        </div>
      )}

      {selected && (
        <EditThresholdModal
          monitoring={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}

      {showAssign && zone && (
        <AssignSensorModal
          zoneId={parseInt(id)}
          zoneName={zone.name}
          onClose={() => setShowAssign(false)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  )
}

export default ZoneDetailPage
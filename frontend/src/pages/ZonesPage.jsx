import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getZones, getMonitorings } from '../services/api'
import { MapPin, Cpu, ChevronRight, AlertTriangle, Plus } from 'lucide-react'
import CreateZoneModal from '../components/CreateZoneModal'

function ZonesPage() {
  const [zones, setZones] = useState([])
  const [alertZones, setAlertZones] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getZones(), getMonitorings()])
      .then(([zonesRes, monitoringsRes]) => {
        setZones(zonesRes.data)
        const zonesWithAlert = new Set(
          monitoringsRes.data.filter(m => m.is_alert).map(m => m.zone_id)
        )
        setAlertZones(zonesWithAlert)
      })
      .catch(() => setError('Error al cargar las zonas'))
      .finally(() => setLoading(false))
  }, [])

  const handleZoneCreated = (newZone) => {
    setZones(prev => [...prev, { ...newZone, active_sensors_count: 0 }])
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>
  )

  const alertCount = alertZones.size

  // Helpers de estilo por estado
  const statusStyle = (s) => ({
    operacional:   'bg-emerald-100 text-emerald-700',
    mantenimiento: 'bg-amber-100 text-amber-700',
    inactivo:      'bg-gray-100 text-gray-500',
  }[s] || 'bg-gray-100 text-gray-500')

  const statusDot = (s) => ({
    operacional:   'bg-emerald-400 animate-pulse',
    mantenimiento: 'bg-amber-400',
    inactivo:      'bg-gray-400',
  }[s] || 'bg-gray-400')

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zonas de Monitoreo</h1>
          <p className="text-gray-400 text-sm mt-1">{zones.length} zonas registradas en la planta</p>
        </div>
        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium">
              <AlertTriangle size={15} />
              {alertCount} zona{alertCount > 1 ? 's' : ''} con alertas
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5"
          >
            <Plus size={15} />
            Nueva Zona
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map(zone => {
          const hasAlert = alertZones.has(zone.id)
          return (
            <div
              key={zone.id}
              onClick={() => navigate(`/zones/${zone.id}`, { state: { zone } })}
              className={`
                relative bg-white rounded-2xl border p-5 cursor-pointer
                transition-all duration-200 group overflow-hidden
                ${hasAlert
                  ? 'border-red-200 shadow-md shadow-red-100 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5'
                  : 'border-gray-100 shadow-sm hover:shadow-md hover:shadow-blue-100 hover:-translate-y-0.5 hover:border-blue-200'
                }
              `}
            >
              {/* Borde izquierdo de color */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                hasAlert ? 'bg-red-400' :
                zone.operational_status === 'operacional' ? 'bg-emerald-400' :
                zone.operational_status === 'mantenimiento' ? 'bg-amber-400' : 'bg-gray-300'
              }`} />

              {/* Header card */}
              <div className="flex items-start justify-between mb-3 pl-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${hasAlert ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <MapPin size={16} className={hasAlert ? 'text-red-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{zone.name}</p>
                    <p className="text-xs text-gray-400">{zone.location}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1 group-hover:text-blue-400 transition-colors" />
              </div>

              {zone.description && (
                <p className="text-xs text-gray-400 mb-3 pl-2 line-clamp-2">{zone.description}</p>
              )}

              {hasAlert && (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 mb-3 ml-2">
                  <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
                  <span className="text-xs text-red-600 font-medium">Sensor fuera del umbral</span>
                </div>
              )}

              {/* Footer card */}
              <div className="flex items-center justify-between pl-2 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Cpu size={13} className={hasAlert ? 'text-red-400' : 'text-blue-400'} />
                  <span className={`text-sm font-semibold ${hasAlert ? 'text-red-600' : 'text-blue-600'}`}>
                    {zone.active_sensors_count}
                  </span>
                  <span className="text-xs text-gray-400">sensores activos</span>
                </div>

                {/* Badge con punto pulsante */}
                <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle(zone.operational_status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(zone.operational_status)}`} />
                  {zone.operational_status}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <CreateZoneModal onClose={() => setShowModal(false)} onCreated={handleZoneCreated} />
      )}
    </div>
  )
}

export default ZonesPage
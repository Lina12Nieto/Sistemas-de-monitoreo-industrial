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
          monitoringsRes.data
            .filter(m => m.is_alert)
            .map(m => m.zone_id)
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
      {error}
    </div>
  )

  const alertCount = alertZones.size

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Zonas de Monitoreo</h1>
          <p className="text-gray-500 text-sm mt-1">
            {zones.length} zonas registradas en la planta
          </p>
        </div>

        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium">
              <AlertTriangle size={15} />
              {alertCount} zona{alertCount > 1 ? 's' : ''} con alertas activas
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Plus size={15} />
            Nueva Zona
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map(zone => {
          const hasAlert = alertZones.has(zone.id)
          return (
            <div
              key={zone.id}
              onClick={() => navigate(`/zones/${zone.id}`)}
              className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all ${
                hasAlert
                  ? 'border-red-300 hover:border-red-400 hover:shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${hasAlert ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <MapPin size={16} className={hasAlert ? 'text-red-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{zone.name}</p>
                    <p className="text-xs text-gray-400">{zone.location}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1" />
              </div>

              {zone.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{zone.description}</p>
              )}

              {hasAlert && (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 mb-3">
                  <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                  <span className="text-xs text-red-600 font-medium">Sensor fuera del umbral</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cpu size={14} className={hasAlert ? 'text-red-400' : 'text-blue-400'} />
                  <span className={`text-sm font-medium ${hasAlert ? 'text-red-600' : 'text-blue-600'}`}>
                    {zone.active_sensors_count}
                  </span>
                  <span className="text-xs text-gray-400">sensores activos</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  zone.operational_status === 'operacional'
                    ? 'bg-green-100 text-green-600'
                    : zone.operational_status === 'mantenimiento'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {zone.operational_status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <CreateZoneModal
          onClose={() => setShowModal(false)}
          onCreated={handleZoneCreated}
        />
      )}
    </div>
  )
}

export default ZonesPage
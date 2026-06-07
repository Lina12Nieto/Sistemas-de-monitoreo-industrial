import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getZones } from '../services/api'
import { MapPin, Cpu, ChevronRight, AlertTriangle } from 'lucide-react'

function ZonesPage() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getZones()
      .then(res => setZones(res.data))
      .catch(() => setError('Error al cargar las zonas'))
      .finally(() => setLoading(false))
  }, [])

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Zonas de Monitoreo</h1>
        <p className="text-gray-500 text-sm mt-1">
          {zones.length} zonas registradas en la planta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map(zone => (
          <div
            key={zone.id}
            onClick={() => navigate(`/zones/${zone.id}`)}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin size={16} className="text-blue-500" />
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-600">
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
        ))}
      </div>
    </div>
  )
}

export default ZonesPage
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getZones, getMonitorings, deleteZone } from '../services/api'
import { MapPin, Cpu, ChevronRight, AlertTriangle, Plus } from 'lucide-react'
import CreateZoneModal from '../components/CreateZoneModal'
import ConfirmModal from '../components/ConfirmModal'

function ZonesPage() {
  const [zones, setZones] = useState([])
  const [alertZones, setAlertZones] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState(null)

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
  const handleDelete = async () => {
    try {
      await deleteZone(toDelete.id)
      setZones(prev => prev.filter(z => z.id !== toDelete.id))
      setAlertZones(prev => { prev.delete(toDelete.id); return new Set(prev) })
    } catch {
      setError('Error al eliminar la zona')
    } finally {
      setToDelete(null)
    }
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
                <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setToDelete(zone) }}
                  className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar zona"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
                <ChevronRight size={16} className="text-gray-300 mt-1 group-hover:text-blue-400 transition-colors" />
              </div>
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
        {toDelete && (
          <ConfirmModal
            title="¿Eliminar zona?"
            message={`La zona "${toDelete.name}" y todos sus monitoreos asociados serán eliminados permanentemente.`}
            confirmText="Sí, eliminar"
            onConfirm={handleDelete}
            onCancel={() => setToDelete(null)}
          />
        )}
      </div>
      {showModal && (
        <CreateZoneModal onClose={() => setShowModal(false)} onCreated={handleZoneCreated} />
      )}
    </div>
  )
}

export default ZonesPage
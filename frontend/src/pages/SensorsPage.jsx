import { useEffect, useState } from 'react'
import { getSensors, deleteSensor } from '../services/api'
import { Cpu, Plus, Calendar } from 'lucide-react'
import CreateSensorModal from '../components/CreateSensorModal'
import ConfirmModal from '../components/ConfirmModal'

function SensorsPage() {
  const [sensors, setSensors]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [showModal, setShowModal]       = useState(false)
  const [toDelete, setToDelete]         = useState(null)

  useEffect(() => {
    getSensors()
      .then(res => setSensors(res.data))
      .catch(() => setError('Error al cargar los sensores'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (newSensor) => {
    setSensors(prev => [...prev, newSensor])
  }

  const handleDelete = async () => {
    try {
      await deleteSensor(toDelete.id)
      setSensors(prev => prev.filter(s => s.id !== toDelete.id))
    } catch {
      setError('Error al eliminar el sensor')
    } finally {
      setToDelete(null)
    }
  }

  const TYPE_COLORS = {
    temperatura: 'bg-orange-50 text-orange-600',
    presion:     'bg-blue-50 text-blue-600',
    vibracion:   'bg-purple-50 text-purple-600',
    flujo:       'bg-green-50 text-green-600'
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

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sensores</h1>
          <p className="text-gray-500 text-sm mt-1">
            {sensors.length} sensores registrados en el sistema
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
        >
          <Plus size={15} />
          Nuevo Sensor
        </button>
      </div>

      {sensors.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No hay sensores registrados
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map(sensor => (
            <div key={sensor.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Cpu size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{sensor.name}</p>
                    <p className="text-xs text-gray-400">{sensor.manufacturer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setToDelete(sensor)}
                  className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar sensor"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>

              {/* Tipo de sensor */}
              <div className="mb-3">
                <span className="text-xs text-gray-400 block mb-1">Tipo de sensor</span>
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${TYPE_COLORS[sensor.type] || 'bg-gray-100 text-gray-600'}`}>
                  {sensor.type}
                </span>
              </div>

              {/* Fecha de fabricación */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                <Calendar size={12} className="text-gray-300 flex-shrink-0" />
                <div>
                  <span className="text-xs text-gray-400 block">Fecha de fabricación</span>
                  <span className="text-xs font-medium text-gray-600">
                    {new Date(sensor.manufacturing_date).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateSensorModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="¿Eliminar sensor?"
          message={`El sensor ${toDelete.name} de ${toDelete.manufacturer} será eliminado permanentemente del sistema.`}
          confirmText="Sí, eliminar"
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default SensorsPage
import { useEffect, useState } from 'react'
import { getSensors } from '../services/api'
import { Cpu, Plus } from 'lucide-react'
import CreateSensorModal from '../components/CreateSensorModal'

function SensorsPage() {
  const [sensors, setSensors]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [showModal, setShowModal]   = useState(false)

  useEffect(() => {
    getSensors()
      .then(res => setSensors(res.data))
      .catch(() => setError('Error al cargar los sensores'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (newSensor) => {
    setSensors(prev => [...prev, newSensor])
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
            <div key={sensor.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Cpu size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{sensor.name}</p>
                  <p className="text-xs text-gray-400">{sensor.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{sensor.type}</span>
                <span className="text-xs text-gray-400">
                  {new Date(sensor.manufacturing_date).toLocaleDateString('es-CO')}
                </span>
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
    </div>
  )
}

export default SensorsPage
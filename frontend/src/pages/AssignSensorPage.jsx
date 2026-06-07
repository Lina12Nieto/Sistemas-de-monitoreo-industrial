import { useEffect, useState } from 'react'
import { getSensors, getZones, createMonitoring } from '../services/api'
import { PlusCircle, CheckCircle } from 'lucide-react'

const READING_TYPES = ['temperatura', 'presion', 'vibracion', 'flujo']

function AssignSensorPage() {
  const [sensors, setSensors] = useState([])
  const [zones, setZones] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    sensor_id: '',
    zone_id: '',
    installation_date: '',
    reading_type: '',
    threshold_value: '',
    status: 'activo'
  })

  useEffect(() => {
    Promise.all([getSensors(), getZones()])
      .then(([sensorsRes, zonesRes]) => {
        setSensors(sensorsRes.data)
        setZones(zonesRes.data)
      })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (!form.sensor_id) return 'Selecciona un sensor'
    if (!form.zone_id) return 'Selecciona una zona'
    if (!form.installation_date) return 'Ingresa la fecha de instalación'
    if (!form.reading_type) return 'Selecciona el tipo de lectura'
    if (!form.threshold_value || isNaN(form.threshold_value) || Number(form.threshold_value) <= 0)
      return 'El umbral debe ser un número mayor a 0'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    try {
      await createMonitoring({
        ...form,
        sensor_id: parseInt(form.sensor_id),
        zone_id: parseInt(form.zone_id),
        threshold_value: parseFloat(form.threshold_value)
      })
      setSuccess(true)
      setForm({
        sensor_id: '', zone_id: '', installation_date: '',
        reading_type: '', threshold_value: '', status: 'activo'
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al asignar el sensor')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white"
  const labelClass = "block text-xs font-medium text-gray-500 mb-1"

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asignar Sensor</h1>
        <p className="text-gray-500 text-sm mt-1">Vincula un sensor a una zona de monitoreo</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col gap-4">

          <div>
            <label className={labelClass}>Sensor</label>
            <select name="sensor_id" value={form.sensor_id} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona un sensor</option>
              {sensors.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Zona</label>
            <select name="zone_id" value={form.zone_id} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona una zona</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Fecha de instalación</label>
            <input
              type="date" name="installation_date"
              value={form.installation_date} onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tipo de lectura</label>
            <select name="reading_type" value={form.reading_type} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona el tipo</option>
              {READING_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Valor umbral</label>
            <input
              type="number" name="threshold_value" placeholder="Ej: 85"
              value={form.threshold_value} onChange={handleChange}
              className={inputClass} min="0" step="0.01"
            />
          </div>

          <div>
            <label className={labelClass}>Estado inicial</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="activo">Activo</option>
              <option value="pausado">Pausado</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
              <CheckCircle size={15} />
              Sensor asignado correctamente
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle size={16} />
            {loading ? 'Asignando...' : 'Asignar Sensor'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default AssignSensorPage
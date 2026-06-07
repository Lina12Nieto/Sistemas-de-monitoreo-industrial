import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSensor } from '../services/api'
import { CheckCircle, Cpu } from 'lucide-react'

const SENSOR_TYPES = ['temperatura', 'presion', 'vibracion', 'flujo']

const TYPE_INFO = {
  temperatura: { desc: 'Mide temperatura ambiente o de superficie', unit: '°C' },
  presion:     { desc: 'Mide presión de fluidos o gases',           unit: 'bar' },
  vibracion:   { desc: 'Detecta vibraciones mecánicas',             unit: 'mm/s' },
  flujo:       { desc: 'Mide caudal de líquidos o gases',           unit: 'L/min' }
}

function CreateSensorPage() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    type: '',
    manufacturer: '',
    manufacturing_date: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (!form.name.trim()) return 'El nombre del sensor es obligatorio'
    if (!form.type) return 'Selecciona el tipo de sensor'
    if (!form.manufacturer.trim()) return 'El fabricante es obligatorio'
    if (!form.manufacturing_date) return 'La fecha de fabricación es obligatoria'
    const date = new Date(form.manufacturing_date)
    if (date > new Date()) return 'La fecha de fabricación no puede ser futura'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    try {
      await createSensor(form)
      setSuccess(true)
      setForm({ name: '', type: '', manufacturer: '', manufacturing_date: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el sensor')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white"
  const labelClass = "block text-xs font-medium text-gray-500 mb-1"

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nuevo Sensor</h1>
        <p className="text-gray-500 text-sm mt-1">Registra un nuevo sensor en el sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col gap-4">

          <div>
            <label className={labelClass}>Nombre del sensor</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: ST-104, SP-205"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              Usa un código identificador único para el sensor
            </p>
          </div>

          <div>
            <label className={labelClass}>Tipo de sensor</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona el tipo</option>
              {SENSOR_TYPES.map(t => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)} ({TYPE_INFO[t].unit})
                </option>
              ))}
            </select>
            {form.type && (
              <p className="text-xs text-blue-500 mt-1">
                ℹ {TYPE_INFO[form.type].desc}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Fabricante</label>
            <input
              type="text"
              name="manufacturer"
              placeholder="Ej: Siemens, Honeywell, ABB"
              value={form.manufacturer}
              onChange={handleChange}
              className={inputClass}
              maxLength={100}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de fabricación</label>
            <input
              type="date"
              name="manufacturing_date"
              value={form.manufacturing_date}
              onChange={handleChange}
              className={inputClass}
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-400 mt-1">
              No puede ser una fecha futura
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
              <CheckCircle size={15} />
              Sensor creado correctamente
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/sensors')}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Cpu size={15} />
              {loading ? 'Creando...' : 'Crear Sensor'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateSensorPage
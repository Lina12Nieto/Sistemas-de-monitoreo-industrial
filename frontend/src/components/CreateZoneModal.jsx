import { useState } from 'react'
import { X, MapPin, CheckCircle } from 'lucide-react'
import { createZone } from '../services/api'

const STATUS_OPTIONS = [
  { value: 'operacional', label: 'Operacional', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'mantenimiento', label: 'Mantenimiento', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { value: 'inactivo', label: 'Inactivo', color: 'text-gray-500 bg-gray-50 border-gray-200' },
]

function CreateZoneModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    operational_status: 'operacional',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (!form.name.trim()) return 'El nombre de la zona es obligatorio'
    if (!form.location.trim()) return 'La ubicación es obligatoria'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)
    setLoading(true)
    try {
      const res = await createZone(form)
      setSuccess(true)
      setTimeout(() => {
        onCreated(res.data)
        onClose()
      }, 900)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear la zona')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white'
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <MapPin size={16} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Nueva Zona</h2>
              <p className="text-xs text-gray-400">Registra una nueva zona de monitoreo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nombre de la zona *</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Sala de Compresores, Línea A"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              maxLength={100}
            />
          </div>

          <div>
            <label className={labelClass}>Ubicación *</label>
            <input
              type="text"
              name="location"
              placeholder="Ej: Planta 2, Piso 3, Sector Norte"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              maxLength={150}
            />
          </div>

          <div>
            <label className={labelClass}>Descripción <span className="text-gray-300">(opcional)</span></label>
            <textarea
              name="description"
              placeholder="Describe brevemente el propósito de esta zona..."
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              rows={3}
            />
          </div>

          <div>
            <label className={labelClass}>Estado operacional</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setForm({ ...form, operational_status: opt.value }); setError(null) }}
                  className={`flex-1 text-xs font-medium px-2 py-2 rounded-lg border transition-all ${
                    form.operational_status === opt.value
                      ? opt.color + ' ring-2 ring-offset-1 ring-blue-300'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
              <CheckCircle size={15} />
              Zona creada correctamente
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin size={14} />
            {loading ? 'Creando...' : success ? 'Creada ✓' : 'Crear Zona'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateZoneModal
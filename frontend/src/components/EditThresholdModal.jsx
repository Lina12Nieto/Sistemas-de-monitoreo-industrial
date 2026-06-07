import { useState } from 'react'
import { X, SlidersHorizontal, CheckCircle } from 'lucide-react'
import { updateMonitoring } from '../services/api'

const STATUS_OPTIONS = [
  { value: 'activo',  label: 'Activo',  color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'pausado', label: 'Pausado', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
]

function EditThresholdModal({ monitoring, onClose, onUpdated }) {
  const [form, setForm] = useState({
    threshold_value: monitoring.threshold_value ?? '',
    current_value:   monitoring.current_value   ?? '',
    status:          monitoring.status          ?? 'activo',
  })
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const isPaused = form.status === 'pausado'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (form.threshold_value === '' || isNaN(Number(form.threshold_value)))
      return 'El umbral debe ser un número válido'
    if (Number(form.threshold_value) < 0)
      return 'El umbral no puede ser negativo'
    if (form.current_value !== '' && isNaN(Number(form.current_value)))
      return 'El valor actual debe ser un número válido'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    try {
      const payload = {
        threshold_value: Number(form.threshold_value),
        status: form.status,
        ...(form.current_value !== '' && { current_value: Number(form.current_value) }),
      }
      const res = await updateMonitoring(monitoring.id, payload)
      
      setSuccess(true)
      setTimeout(() => {
        onUpdated(res.data)
        onClose()
      }, 900)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar el monitoreo')
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

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <SlidersHorizontal size={16} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Editar Umbral</h2>
              <p className="text-xs text-gray-400">
                {monitoring.sensor?.name ?? `Sensor #${monitoring.sensor_id}`} · {monitoring.reading_type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>
              Valor umbral *
              {isPaused && <span className="ml-2 text-yellow-500 font-normal">— bloqueado mientras está pausado</span>}
            </label>
            <input
              type="number"
              name="threshold_value"
              value={form.threshold_value}
              onChange={handleChange}
              className={`${inputClass} ${isPaused ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}`}
              step="0.01"
              min="0"
              placeholder="Ej: 85.00"
              disabled={isPaused}
            />
            <p className="text-xs text-gray-400 mt-1">Valor máximo permitido para este tipo de lectura</p>
          </div>

          <div>
            <label className={labelClass}>
              Valor actual <span className="text-gray-300">(opcional)</span>
              {isPaused && <span className="ml-2 text-yellow-500 font-normal">— bloqueado mientras está pausado</span>}
            </label>
            <input
              type="number"
              name="current_value"
              value={form.current_value}
              onChange={handleChange}
              className={`${inputClass} ${isPaused ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}`}
              step="0.01"
              placeholder="Ej: 72.50"
              disabled={isPaused}
            />
            <p className="text-xs text-gray-400 mt-1">Última lectura registrada por el sensor</p>
          </div>
          {isPaused && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-3 py-2 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Activa el monitoreo primero para poder modificar el umbral y el valor actual
            </div>
          )}
          <div>
            <label className={labelClass}>Estado del monitoreo</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setForm({ ...form, status: opt.value }); setError(null) }}
                  className={`flex-1 text-xs font-medium px-2 py-2 rounded-lg border transition-all ${
                    form.status === opt.value
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
              Monitoreo actualizado correctamente
            </div>
          )}
        </div>

        {/* Footer */}
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
            <SlidersHorizontal size={14} />
            {loading ? 'Guardando...' : success ? 'Guardado ✓' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditThresholdModal
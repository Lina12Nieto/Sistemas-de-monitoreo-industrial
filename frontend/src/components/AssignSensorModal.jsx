import { useEffect, useState } from 'react'
import { X, PlusCircle, CheckCircle } from 'lucide-react'
import { getSensors, getZones, createMonitoring } from '../services/api'

const READING_TYPES = ['temperatura', 'presion', 'vibracion', 'flujo']
const RANGES = {
  temperatura: { min: 0, max: 200, unit: '°C' },
  presion:     { min: 0, max: 500, unit: 'bar' },
  vibracion:   { min: 0, max: 50,  unit: 'mm/s' },
  flujo:       { min: 0, max: 200, unit: 'L/min' }
}

function AssignSensorModal({ zoneId, zoneName, onClose, onAssigned }) {
  const [sensors, setSensors] = useState([])
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    sensor_id:         '',
    zone_id:           zoneId,   // pre-fijado
    installation_date: '',
    reading_type:      '',
    threshold_value:   '',
    status:            'activo'
  })

  useEffect(() => {
    getSensors().then(res => setSensors(res.data))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (!form.sensor_id)        return 'Selecciona un sensor'
    if (!form.installation_date) return 'Ingresa la fecha de instalación'
    if (!form.reading_type)      return 'Selecciona el tipo de lectura'
    if (!form.threshold_value || isNaN(form.threshold_value) || Number(form.threshold_value) <= 0)
      return 'El umbral debe ser un número mayor a 0'
    const range = RANGES[form.reading_type]
    if (Number(form.threshold_value) < range.min || Number(form.threshold_value) > range.max)
      return `El umbral para ${form.reading_type} debe estar entre ${range.min} y ${range.max} ${range.unit}`
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    try {
      const res = await createMonitoring({
        ...form,
        sensor_id:       parseInt(form.sensor_id),
        zone_id:         parseInt(form.zone_id),
        threshold_value: parseFloat(form.threshold_value)
      })
      setSuccess(true)
      setTimeout(() => {
        onAssigned(res.data)
        onClose()
      }, 900)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al asignar el sensor')
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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <PlusCircle size={16} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Asignar Sensor</h2>
              <p className="text-xs text-gray-400">{zoneName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">

          <div>
            <label className={labelClass}>Sensor</label>
            <select name="sensor_id" value={form.sensor_id} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona un sensor</option>
              {sensors.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.type}</option>
              ))}
            </select>
          </div>

          {/* Zona fija — solo informativo */}
          <div>
            <label className={labelClass}>Zona</label>
            <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50">
              {zoneName}
            </div>
          </div>

          <div>
            <label className={labelClass}>Fecha de instalación</label>
            <input
              type="date"
              name="installation_date"
              value={form.installation_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tipo de lectura</label>
            <select name="reading_type" value={form.reading_type} onChange={handleChange} className={inputClass}>
              <option value="">Selecciona el tipo</option>
              {READING_TYPES.map(t => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)} — {RANGES[t].min} a {RANGES[t].max} {RANGES[t].unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Valor umbral
              {form.reading_type && (
                <span className="text-blue-500 ml-1">
                  (rango: {RANGES[form.reading_type].min} - {RANGES[form.reading_type].max} {RANGES[form.reading_type].unit})
                </span>
              )}
            </label>
            <input
              type="number"
              name="threshold_value"
              placeholder={form.reading_type ? `Ej: ${RANGES[form.reading_type].max / 2}` : 'Selecciona tipo de lectura primero'}
              value={form.threshold_value}
              onChange={handleChange}
              className={inputClass}
              min={form.reading_type ? RANGES[form.reading_type].min : 0}
              max={form.reading_type ? RANGES[form.reading_type].max : undefined}
              step="0.01"
              disabled={!form.reading_type}
            />
            {form.reading_type && form.threshold_value && (
              Number(form.threshold_value) > RANGES[form.reading_type].max ||
              Number(form.threshold_value) < RANGES[form.reading_type].min
            ) && (
              <p className="text-red-500 text-xs mt-1">
                ⚠ Valor fuera del rango permitido
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Estado inicial</label>
            <div className="flex gap-2">
              {['activo', 'pausado'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setForm({ ...form, status: opt }); setError(null) }}
                  className={`flex-1 text-xs font-medium px-2 py-2 rounded-lg border transition-all capitalize ${
                    form.status === opt
                      ? opt === 'activo'
                        ? 'text-green-600 bg-green-50 border-green-200 ring-2 ring-offset-1 ring-blue-300'
                        : 'text-yellow-600 bg-yellow-50 border-yellow-200 ring-2 ring-offset-1 ring-blue-300'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {opt}
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
              Sensor asignado correctamente
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
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
            <PlusCircle size={14} />
            {loading ? 'Asignando...' : success ? 'Asignado ✓' : 'Asignar Sensor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignSensorModal
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Zonas
export const getZones = () => api.get('/zones/')
export const getZoneById = (id) => api.get(`/zones/${id}/sensorsall`)
export const createZone = (data) => api.post('/zones/', data)
export const deleteZone = (id) => api.delete(`/zones/${id}`)

// Sensores
export const getSensors = () => api.get('/sensors/')
export const getSensorZones = (id) => api.get(`/sensors/${id}/zones`)
export const createSensor = (data) => api.post('/sensors/', data)
export const deleteSensor = (id) => api.delete(`/sensors/${id}`)

// Monitoreos
export const getMonitorings = (status = null) =>
  api.get('/monitorings/', { params: status ? { status } : {} })
export const createMonitoring = (data) => api.post('/monitorings/', data)
export const updateMonitoring = (id, data) => api.patch(`/monitorings/${id}`, data)
export const deleteMonitoring = (id) => api.delete(`/monitorings/${id}`)

export default api
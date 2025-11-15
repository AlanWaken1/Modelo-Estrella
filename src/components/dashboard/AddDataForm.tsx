'use client'

import { useState } from 'react'
import { notifySyncEvent } from '@/hooks/useRealtimeSync'

interface AddDataFormProps {
  dimension: string | null
  onClose: () => void
  onSuccess: () => void
}

export default function AddDataForm({ dimension: initialDimension, onClose, onSuccess }: AddDataFormProps) {
  const [dimension, setDimension] = useState(initialDimension || 'produccion')
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Agregar fecha actual si no se especificó
      const data = {
        ...formData,
        fecha: formData.fecha || new Date().toISOString(),
      }

      // Enviar datos al servidor
      const response = await fetch(`/api/dimensions/${dimension}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al crear registro')
      }

      // SINCRONIZACIÓN AUTOMÁTICA: Notificar a todos los clientes conectados
      await notifySyncEvent({
        type: 'create',
        dimension,
        data: result.data,
      })

      console.log(' Datos guardados y sincronizados automáticamente')
      onSuccess()
    } catch (err: any) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Agregar Datos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Los datos se sincronizarán automáticamente en tiempo real
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Selector de Dimensión */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensión *
            </label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="produccion">=æ Producción</option>
              <option value="finanzas">=° Finanzas</option>
              <option value="recursos-humanos">=e Recursos Humanos</option>
              <option value="desarrollo-digital">=» Desarrollo Digital</option>
            </select>
          </div>

          {/* Campos específicos por dimensión */}
          {dimension === 'produccion' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidades Producidas *
                  </label>
                  <input
                    type="number"
                    required
                    onChange={(e) => handleChange('unidadesProducidas', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productos Defectuosos
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    onChange={(e) => handleChange('productosDefectuosos', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo Producción (hrs) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    onChange={(e) => handleChange('tiempoProduccion', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Producción *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    onChange={(e) => handleChange('costoProduccion', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eficiencia (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    onChange={(e) => handleChange('eficiencia', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turno *
                  </label>
                  <select
                    required
                    onChange={(e) => handleChange('turno', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="mañana">Mañana</option>
                    <option value="tarde">Tarde</option>
                    <option value="noche">Noche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Línea *
                  </label>
                  <input
                    type="text"
                    required
                    onChange={(e) => handleChange('linea', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operador *
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleChange('operador', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {dimension === 'finanzas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    required
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                    <option value="inversión">Inversión</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  onChange={(e) => handleChange('monto', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleChange('concepto', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleChange('departamento', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar y Sincronizar'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

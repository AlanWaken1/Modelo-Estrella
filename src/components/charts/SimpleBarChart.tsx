'use client'

import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'

interface SimpleBarChartProps {
  dimension: string
  title: string
}

export default function SimpleBarChart({ dimension, title }: SimpleBarChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [dimension])

  const loadData = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      const response = await fetch(
        `/api/dimensions/${dimension}?fechaInicio=${sevenDaysAgo.toISOString()}&fechaFin=${today.toISOString()}&limit=7`
      )
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    )
  }

  // Calcular valor máximo para escalar las barras
  const getValue = (item: any) => {
    if (dimension === 'produccion') return item.unidadesProducidas || 0
    if (dimension === 'finanzas') return Math.abs(item.monto || 0)
    if (dimension === 'recursos-humanos') return item.horasTrabajadas || 0
    if (dimension === 'desarrollo-digital') return item.tareas || 0
    return 0
  }

  const maxValue = Math.max(...data.map(getValue), 1)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-3">
        {data.slice(0, 7).map((item, index) => {
          const value = getValue(item)
          const percentage = (value / maxValue) * 100
          const date = new Date(item.fecha).toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric',
          })

          return (
            <div key={item.id || index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{date}</span>
                <span className="font-semibold text-gray-800">{formatNumber(value)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { DashboardStats } from '@/types/types'

interface AISummaryCardProps {
  stats: DashboardStats | null
}

export default function AISummaryCard({ stats }: AISummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    try {
      // Aquí se podría hacer una llamada a la API de IA para generar un resumen
      // Por ahora mostramos un resumen básico
      const mockSummary = `=Ê Resumen Ejecutivo:

" Producción muestra una tendencia ${stats?.produccion.tendencia === 'up' ? 'positiva' : 'estable'} con ${stats?.produccion.totalUnidades.toLocaleString()} unidades
" Finanzas: Balance ${stats?.finanzas.balance >= 0 ? 'positivo' : 'negativo'} de ${stats?.finanzas.balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
" RRHH: ${stats?.recursosHumanos.totalEmpleados} empleados activos con ${stats?.recursosHumanos.horasPromedio.toFixed(1)}h promedio
" Desarrollo: ${stats?.desarrolloDigital.proyectosActivos} proyectos activos, ${stats?.desarrolloDigital.tareasCompletadas} tareas completadas`

      setSummary(mockSummary)
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!stats) return null

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">></span>
          <h2 className="text-xl font-bold text-gray-800">Resumen Inteligente</h2>
        </div>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:shadow-md transition-all border border-purple-200 disabled:opacity-50"
        >
          {loading ? 'Generando...' : summary ? 'Actualizar' : 'Generar con IA'}
        </button>
      </div>

      {summary ? (
        <div className="bg-white rounded-lg p-4 whitespace-pre-line text-gray-700 leading-relaxed">
          {summary}
        </div>
      ) : (
        <p className="text-gray-600 italic">
          Haz clic en "Generar con IA" para obtener un análisis inteligente de tus datos
        </p>
      )}
    </div>
  )
}

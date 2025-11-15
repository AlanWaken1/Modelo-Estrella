'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import type { DashboardStats } from '@/types/types'
import SimpleBarChart from '@/components/charts/SimpleBarChart'
import AISummaryCard from '@/components/dashboard/AISummaryCard'
import AddDataForm from '@/components/dashboard/AddDataForm'
import SearchBar from '@/components/dashboard/SearchBar'
import CrystalBackground from '@/components/ui/crystal-background'

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null)

  // Hook de sincronización en tiempo real
  const { connected, events } = useRealtimeSync()

  // Cargar estadísticas iniciales
  const loadStats = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stats?dias=30')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  // Recargar stats cuando hay eventos de sincronización
  useEffect(() => {
    if (events.length > 0) {
      const lastEvent = events[events.length - 1]
      if (lastEvent.type === 'create' || lastEvent.type === 'update') {
        // Recargar stats automáticamente
        loadStats()
      }
    }
  }, [events])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando Modelo Estrella...</p>
        </div>
      </div>
    )
  }

  const dimensions = [
    {
      id: 'produccion',
      name: 'Producción',
      icon: '📦',
      color: 'blue',
      stats: stats?.produccion,
    },
    {
      id: 'finanzas',
      name: 'Finanzas',
      icon: '💰',
      color: 'green',
      stats: stats?.finanzas,
    },
    {
      id: 'recursos-humanos',
      name: 'Recursos Humanos',
      icon: '👥',
      color: 'purple',
      stats: stats?.recursosHumanos,
    },
    {
      id: 'desarrollo-digital',
      name: 'Desarrollo Digital',
      icon: '💻',
      color: 'orange',
      stats: stats?.desarrolloDigital,
    },
  ]

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <CrystalBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ⭐ Modelo Estrella
              </h1>
              <p className="text-gray-600 mt-2">Dashboard de Análisis Empresarial con IA</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {connected ? 'Sincronizado' : 'Desconectado'}
                </span>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                + Agregar Datos
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </header>

        {/* AI Summary Card */}
        <AISummaryCard stats={stats} />

        {/* Dimension Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dimensions.map((dimension) => (
            <Link
              key={dimension.id}
              href={`/dimensions/${dimension.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{dimension.icon}</span>
                  <span className={`text-2xl ${getTrendColor(dimension.stats?.tendencia)}`}>
                    {getTrendIcon(dimension.stats?.tendencia)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {dimension.name}
                </h3>

                {dimension.id === 'produccion' && dimension.stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Unidades:</span>
                      <span className="font-semibold text-gray-800">
                        {formatNumber(dimension.stats.totalUnidades)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eficiencia:</span>
                      <span className="font-semibold text-green-600">
                        {formatPercentage(dimension.stats.eficienciaPromedio)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Defectos:</span>
                      <span className="font-semibold text-red-600">
                        {formatPercentage(dimension.stats.defectosPromedio)}
                      </span>
                    </div>
                  </div>
                )}

                {dimension.id === 'finanzas' && dimension.stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ingresos:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(dimension.stats.totalIngresos)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Egresos:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(dimension.stats.totalEgresos)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Balance:</span>
                      <span className={`font-semibold ${
                        dimension.stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(dimension.stats.balance)}
                      </span>
                    </div>
                  </div>
                )}

                {dimension.id === 'recursos-humanos' && dimension.stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Empleados:</span>
                      <span className="font-semibold text-gray-800">
                        {formatNumber(dimension.stats.totalEmpleados)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hrs Promedio:</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(dimension.stats.horasPromedio, 1)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ausentismo:</span>
                      <span className="font-semibold text-orange-600">
                        {formatNumber(dimension.stats.ausentismo, 1)}%
                      </span>
                    </div>
                  </div>
                )}

                {dimension.id === 'desarrollo-digital' && dimension.stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Proyectos:</span>
                      <span className="font-semibold text-gray-800">
                        {formatNumber(dimension.stats.proyectosActivos)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tareas:</span>
                      <span className="font-semibold text-green-600">
                        {formatNumber(dimension.stats.tareasCompletadas)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bugs:</span>
                      <span className="font-semibold text-red-600">
                        {formatNumber(dimension.stats.bugsAbiertos)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-blue-600 group-hover:text-purple-600 flex items-center gap-2">
                  Ver detalles
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleBarChart dimension="produccion" title="Producción - Últimos 7 días" />
          <SimpleBarChart dimension="finanzas" title="Finanzas - Últimos 7 días" />
        </div>

        {/* Add Data Form Modal */}
        {showAddForm && (
          <AddDataForm
            dimension={selectedDimension}
            onClose={() => {
              setShowAddForm(false)
              setSelectedDimension(null)
            }}
            onSuccess={() => {
              // Los datos se sincronizarán automáticamente vía SSE
              setShowAddForm(false)
              setSelectedDimension(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// API Route para obtener estadísticas del dashboard
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseError, getDateRange, average } from '@/lib/utils'
import type { ApiResponse, DashboardStats } from '@/types/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dias = parseInt(searchParams.get('dias') || '30')

    const { start, end } = getDateRange(dias)

    // Obtener datos de Producción
    const produccionRecords = await prisma.produccion.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end,
        },
      },
    })

    const totalUnidades = produccionRecords.reduce(
      (sum, r) => sum + r.unidadesProducidas,
      0
    )
    const eficienciaPromedio = produccionRecords.length > 0
      ? average(produccionRecords.map(r => r.eficiencia))
      : 0
    const defectosPromedio = produccionRecords.length > 0
      ? average(produccionRecords.map(r => (r.productosDefectuosos / r.unidadesProducidas) * 100))
      : 0

    // Obtener datos de Finanzas
    const finanzasRecords = await prisma.finanzas.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end,
        },
      },
    })

    const totalIngresos = finanzasRecords
      .filter(r => r.tipo === 'ingreso')
      .reduce((sum, r) => sum + r.monto, 0)
    const totalEgresos = finanzasRecords
      .filter(r => r.tipo === 'egreso')
      .reduce((sum, r) => sum + r.monto, 0)
    const balance = totalIngresos - totalEgresos

    // Obtener datos de Recursos Humanos
    const rrhhRecords = await prisma.recursosHumanos.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end,
        },
      },
    })

    const empleadosUnicos = new Set(rrhhRecords.map(r => r.empleadoId))
    const totalEmpleados = empleadosUnicos.size

    const asistenciaRecords = rrhhRecords.filter(r => r.tipo === 'asistencia')
    const horasPromedio = asistenciaRecords.length > 0
      ? average(asistenciaRecords.map(r => r.horasTrabajadas || 0))
      : 0

    const totalAusencias = rrhhRecords.reduce((sum, r) => sum + (r.ausencias || 0), 0)
    const ausentismo = totalEmpleados > 0 ? (totalAusencias / totalEmpleados) : 0

    // Obtener datos de Desarrollo Digital
    const digitalRecords = await prisma.desarrolloDigital.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end,
        },
      },
    })

    const proyectosActivos = new Set(digitalRecords.map(r => r.proyecto)).size
    const tareasCompletadas = digitalRecords.reduce((sum, r) => sum + r.tareas, 0)
    const bugsAbiertos = digitalRecords.reduce((sum, r) => sum + r.bugs, 0)

    // Calcular tendencias (comparar con período anterior)
    const previousStart = new Date(start)
    previousStart.setDate(previousStart.getDate() - dias)

    const previousProduccion = await prisma.produccion.findMany({
      where: {
        fecha: {
          gte: previousStart,
          lt: start,
        },
      },
    })

    const previousUnidades = previousProduccion.reduce(
      (sum, r) => sum + r.unidadesProducidas,
      0
    )

    const produccionTrend = totalUnidades > previousUnidades ? 'up' :
                           totalUnidades < previousUnidades ? 'down' : 'stable'

    const previousFinanzas = await prisma.finanzas.findMany({
      where: {
        fecha: {
          gte: previousStart,
          lt: start,
        },
      },
    })

    const previousBalance = previousFinanzas
      .filter(r => r.tipo === 'ingreso')
      .reduce((sum, r) => sum + r.monto, 0) -
      previousFinanzas
      .filter(r => r.tipo === 'egreso')
      .reduce((sum, r) => sum + r.monto, 0)

    const finanzasTrend = balance > previousBalance ? 'up' :
                         balance < previousBalance ? 'down' : 'stable'

    const stats: DashboardStats = {
      produccion: {
        totalUnidades,
        eficienciaPromedio,
        defectosPromedio,
        tendencia: produccionTrend,
      },
      finanzas: {
        totalIngresos,
        totalEgresos,
        balance,
        tendencia: finanzasTrend,
      },
      recursosHumanos: {
        totalEmpleados,
        horasPromedio,
        ausentismo,
        tendencia: 'stable',
      },
      desarrolloDigital: {
        proyectosActivos,
        tareasCompletadas,
        bugsAbiertos,
        tendencia: 'stable',
      },
    }

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

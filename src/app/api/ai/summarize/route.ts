// API Route para generar resúmenes con IA
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { aiSummarize, aiPredictiveAnalysis, aiAnomalyDetection } from '@/lib/ai-provider'
import { dimensionToModel, parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dimension, fechaInicio, fechaFin, tipo = 'resumen', reporteId } = body

    if (!dimension) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere especificar la dimensión' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = {}
    if (fechaInicio || fechaFin) {
      where.fecha = {}
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio)
      if (fechaFin) where.fecha.lte = new Date(fechaFin)
    }

    const modelName = dimensionToModel(dimension) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).findMany !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    // Obtener datos
    const data = await (prisma[modelName] as any).findMany({
      where,
      orderBy: { fecha: 'desc' },
    })

    if (data.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No hay datos para generar resumen' },
        { status: 404 }
      )
    }

    let result: any = {}

    switch (tipo) {
      case 'resumen':
        // Generar resumen ejecutivo
        const resumen = await aiSummarize(data, dimension)
        result = { resumen }
        break

      case 'predictivo':
        // Generar análisis predictivo
        const predictivo = await aiPredictiveAnalysis(data, dimension)
        result = predictivo
        break

      case 'anomalias':
        // Detectar anomalías
        const anomalias = await aiAnomalyDetection(data, dimension)
        result = anomalias
        break

      case 'completo':
        // Generar análisis completo
        const [resumenCompleto, predictivoCompleto, anomaliasCompleto] = await Promise.all([
          aiSummarize(data, dimension),
          aiPredictiveAnalysis(data, dimension),
          aiAnomalyDetection(data, dimension),
        ])

        result = {
          resumen: resumenCompleto,
          predictivo: predictivoCompleto,
          anomalias: anomaliasCompleto,
        }
        break

      default:
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Tipo de análisis no válido' },
          { status: 400 }
        )
    }

    // Si se proporcionó un reporteId, actualizar el reporte con el resumen de IA
    if (reporteId && tipo === 'resumen') {
      await prisma.reporte.update({
        where: { id: reporteId },
        data: {
          resumenIA: result.resumen,
          insightsIA: result,
        },
      })
    }

    const response: ApiResponse = {
      success: true,
      data: {
        dimension,
        tipo,
        fechaInicio,
        fechaFin,
        totalRegistros: data.length,
        ...result,
      },
      message: 'Análisis completado exitosamente',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in AI summarization:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

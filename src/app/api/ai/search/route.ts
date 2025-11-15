// API Route para búsqueda inteligente con IA
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { aiSearch } from '@/lib/ai-provider'
import { dimensionToModel, parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, dimension, fechaInicio, fechaFin, limit = 100 } = body

    if (!query) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere una consulta' },
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

    let contextData: any[] = []

    // Si se especifica dimensión, buscar solo en esa dimensión
    if (dimension) {
      const modelName = dimensionToModel(dimension) as keyof typeof prisma

      if (prisma[modelName] && typeof (prisma[modelName] as any).findMany === 'function') {
        contextData = await (prisma[modelName] as any).findMany({
          where,
          take: limit,
          orderBy: { fecha: 'desc' },
        })
      }
    } else {
      // Buscar en todas las dimensiones
      const [produccion, finanzas, rrhh, digital] = await Promise.all([
        prisma.produccion.findMany({
          where,
          take: Math.floor(limit / 4),
          orderBy: { fecha: 'desc' },
        }),
        prisma.finanzas.findMany({
          where,
          take: Math.floor(limit / 4),
          orderBy: { fecha: 'desc' },
        }),
        prisma.recursosHumanos.findMany({
          where,
          take: Math.floor(limit / 4),
          orderBy: { fecha: 'desc' },
        }),
        prisma.desarrolloDigital.findMany({
          where,
          take: Math.floor(limit / 4),
          orderBy: { fecha: 'desc' },
        }),
      ])

      contextData = [
        ...produccion.map(r => ({ ...r, _dimension: 'produccion' })),
        ...finanzas.map(r => ({ ...r, _dimension: 'finanzas' })),
        ...rrhh.map(r => ({ ...r, _dimension: 'recursos-humanos' })),
        ...digital.map(r => ({ ...r, _dimension: 'desarrollo-digital' })),
      ]
    }

    // Realizar búsqueda con IA
    const aiResult = await aiSearch({
      query,
      context: contextData,
      dimension,
    })

    // Guardar búsqueda en la base de datos
    const searchRecord = await prisma.busquedaIA.create({
      data: {
        query,
        dimension,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        resultados: aiResult.relevantData,
        resumen: aiResult.summary,
        insights: aiResult.insights,
        relevancia: 0.95, // Esto podría calcularse basado en varios factores
      },
    })

    const response: ApiResponse = {
      success: true,
      data: {
        searchId: searchRecord.id,
        ...aiResult,
      },
      message: 'Búsqueda completada exitosamente',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in AI search:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// GET - Obtener historial de búsquedas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const dimension = searchParams.get('dimension')

    const where: any = {}
    if (dimension) {
      where.dimension = dimension
    }

    const searches = await prisma.busquedaIA.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const response: ApiResponse = {
      success: true,
      data: searches,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching search history:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

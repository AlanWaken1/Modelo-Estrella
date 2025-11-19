import { NextRequest } from 'next/server'
import { streamDataAnalysis } from '@/lib/ai/gemini-client'
import { getDimensionRecords } from '@/actions/dimension-actions'
import type { DimensionTableName } from '@/types/database.types'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { tableName } = await req.json()

    if (!tableName) {
      return new Response('Missing tableName', { status: 400 })
    }

    // Obtener los datos
    const result = await getDimensionRecords(tableName as DimensionTableName)

    if (!result.success || !result.data || result.data.length === 0) {
      return new Response('No data available', { status: 404 })
    }

    // Contexto según la dimensión
    const contextMap: Record<DimensionTableName, string> = {
      dim_finanzas: 'Datos financieros de la organización incluyendo gastos, ingresos y categorías',
      dim_produccion: 'Métricas de producción, eficiencia y cantidades producidas',
      dim_recursos_humanos: 'Información de recursos humanos, incluyendo empleados, salarios y departamentos',
      dim_desarrollo_digital: 'Inversiones y proyectos de transformación digital',
    }

    const context = contextMap[tableName as DimensionTableName]

    // Generar análisis con streaming
    const stream = await streamDataAnalysis(result.data, context)

    return stream.toTextStreamResponse()
  } catch (error: any) {
    console.error('Error in analyze route:', error)
    return new Response(error.message, { status: 500 })
  }
}

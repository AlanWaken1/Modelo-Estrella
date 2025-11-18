'use server'

import { generateDataAnalysis } from '@/lib/ai/gemini-client'
import { getDimensionRecords } from './dimension-actions'
import type { DimensionTableName } from '@/types/database.types'

/**
 * Genera un análisis de IA para una dimensión específica
 */
export async function analyzeDimension(tableName: DimensionTableName) {
  try {
    // Obtener los datos de la dimensión
    const result = await getDimensionRecords(tableName)

    if (!result.success || !result.data || result.data.length === 0) {
      return {
        success: false,
        error: 'No hay datos disponibles para analizar',
      }
    }

    // Determinar el contexto según la dimensión
    const contextMap: Record<DimensionTableName, string> = {
      dim_finanzas: 'Datos financieros de la organización incluyendo gastos, ingresos y categorías',
      dim_produccion: 'Métricas de producción, eficiencia y cantidades producidas',
      dim_recursos_humanos: 'Información de recursos humanos, incluyendo empleados, salarios y departamentos',
      dim_desarrollo_digital: 'Inversiones y proyectos de transformación digital',
    }

    const context = contextMap[tableName]

    // Generar el análisis
    const analysisResult = await generateDataAnalysis(result.data, context)

    if (!analysisResult.success) {
      return {
        success: false,
        error: analysisResult.error || 'Error al generar el análisis',
      }
    }

    return {
      success: true,
      analysis: analysisResult.analysis,
      dataCount: result.data.length,
    }
  } catch (error: any) {
    console.error('Error en analyzeDimension:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al analizar',
    }
  }
}

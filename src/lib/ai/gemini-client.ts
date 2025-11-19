/**
 * Cliente de Google Gemini configurado con Vercel AI SDK
 */

import { google } from '@ai-sdk/google'
import { generateText, streamText } from 'ai'

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!apiKey) {
  console.warn('⚠️ GOOGLE_GENERATIVE_AI_API_KEY no está configurada')
}

// Modelo a utilizar
const model = google('gemini-1.5-flash')

/**
 * Genera un análisis de datos usando Gemini
 */
export async function generateDataAnalysis(data: any[], context: string) {
  if (!apiKey) {
    throw new Error('API key de Gemini no configurada')
  }

  try {
    const prompt = `
Eres un analista de Business Intelligence experto. Analiza los siguientes datos y proporciona un resumen ejecutivo en español.

Contexto: ${context}

Datos (formato JSON):
${JSON.stringify(data.slice(0, 50), null, 2)}

Proporciona:
1. **Resumen General**: Una visión general de los datos (2-3 oraciones)
2. **Insights Clave**: 3-4 hallazgos importantes en formato de bullet points
3. **Tendencias**: Patrones o tendencias identificadas
4. **Recomendaciones**: 2-3 acciones sugeridas basadas en los datos

Formatea la respuesta en Markdown para mejor legibilidad.
`

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return { success: true, analysis: text }
  } catch (error: any) {
    console.error('Error generando análisis:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Genera un análisis streaming (para efectos de typewriter)
 */
export async function streamDataAnalysis(data: any[], context: string) {
  if (!apiKey) {
    throw new Error('API key de Gemini no configurada')
  }

  const prompt = `
Eres un analista de Business Intelligence experto. Analiza los siguientes datos y proporciona un resumen ejecutivo en español.

Contexto: ${context}

Datos (formato JSON):
${JSON.stringify(data.slice(0, 50), null, 2)}

Proporciona:
1. **Resumen General**: Una visión general de los datos (2-3 oraciones)
2. **Insights Clave**: 3-4 hallazgos importantes en formato de bullet points
3. **Tendencias**: Patrones o tendencias identificadas
4. **Recomendaciones**: 2-3 acciones sugeridas basadas en los datos

Formatea la respuesta en Markdown para mejor legibilidad.
`

  return streamText({
    model,
    prompt,
    temperature: 0.7,
    maxTokens: 1000,
  })
}

/**
 * Interpreta una consulta en lenguaje natural y devuelve filtros
 */
export async function interpretNaturalLanguageQuery(query: string, availableFields: string[]) {
  if (!apiKey) {
    throw new Error('API key de Gemini no configurada')
  }

  const prompt = `
Eres un asistente de BI. Interpreta la siguiente consulta en lenguaje natural y extrae:
1. La dimensión/tabla que el usuario está buscando (finanzas, produccion, recursos_humanos, desarrollo_digital)
2. Los filtros que se deben aplicar
3. El periodo de tiempo mencionado

Consulta del usuario: "${query}"

Campos disponibles: ${availableFields.join(', ')}

Responde SOLO en formato JSON sin explicaciones adicionales:
{
  "dimension": "nombre_de_la_dimension",
  "filters": {
    "campo": "valor"
  },
  "timeframe": {
    "periodo": "Enero",
    "año": 2024
  }
}
`

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    // Parsear la respuesta JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return { success: true, data: parsed }
    }

    return { success: false, error: 'No se pudo parsear la respuesta' }
  } catch (error: any) {
    console.error('Error interpretando consulta:', error)
    return { success: false, error: error.message }
  }
}

// Proveedor de IA para búsqueda y análisis
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AISearchParams {
  query: string
  context: any[]
  dimension?: string
}

export interface AISearchResult {
  summary: string
  relevantData: any[]
  insights: {
    key: string
    value: string
    importance: 'high' | 'medium' | 'low'
  }[]
  recommendations?: string[]
}

/**
 * Realiza búsqueda inteligente con IA
 */
export async function aiSearch(params: AISearchParams): Promise<AISearchResult> {
  const { query, context, dimension } = params

  const systemPrompt = `Eres un asistente de análisis de datos empresariales especializado en el Modelo Estrella.
Analiza datos de ${dimension || 'todas las dimensiones'} (Producción, Finanzas, Recursos Humanos, Desarrollo Digital).
Tu trabajo es encontrar información relevante, identificar patrones y proporcionar insights accionables.

Responde SIEMPRE en formato JSON con esta estructura:
{
  "summary": "Resumen de los hallazgos",
  "relevantData": [array de datos relevantes],
  "insights": [
    {
      "key": "nombre del insight",
      "value": "descripción del insight",
      "importance": "high|medium|low"
    }
  ],
  "recommendations": ["lista de recomendaciones"]
}`

  const userPrompt = `Consulta del usuario: ${query}

Datos disponibles:
${JSON.stringify(context, null, 2)}

Analiza estos datos y proporciona insights relevantes en formato JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result as AISearchResult
  } catch (error) {
    console.error('Error in AI search:', error)
    throw new Error('Error al realizar búsqueda con IA')
  }
}

/**
 * Genera resumen con IA
 */
export async function aiSummarize(data: any[], dimension: string): Promise<string> {
  const systemPrompt = `Eres un analista de datos empresariales. Genera resúmenes ejecutivos concisos y accionables.
Enfócate en métricas clave, tendencias y recomendaciones.`

  const userPrompt = `Genera un resumen ejecutivo de los siguientes datos de ${dimension}:

${JSON.stringify(data, null, 2)}

El resumen debe incluir:
- Métricas principales
- Tendencias observadas
- Puntos de atención
- Recomendaciones breves

Máximo 300 palabras.`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    return completion.choices[0].message.content || ''
  } catch (error) {
    console.error('Error in AI summarization:', error)
    throw new Error('Error al generar resumen con IA')
  }
}

/**
 * Genera insights predictivos
 */
export async function aiPredictiveAnalysis(
  historicalData: any[],
  dimension: string
): Promise<{
  predictions: { metric: string; value: number; confidence: number }[]
  trends: string[]
  alerts: string[]
}> {
  const systemPrompt = `Eres un analista predictivo especializado en análisis de series temporales.
Identifica tendencias, patrones y genera predicciones basadas en datos históricos.

Responde en formato JSON con esta estructura:
{
  "predictions": [
    {
      "metric": "nombre de la métrica",
      "value": número predicho,
      "confidence": porcentaje de confianza (0-100)
    }
  ],
  "trends": ["lista de tendencias identificadas"],
  "alerts": ["lista de alertas y puntos de atención"]
}`

  const userPrompt = `Analiza estos datos históricos de ${dimension} y genera predicciones:

${JSON.stringify(historicalData, null, 2)}

Proporciona predicciones para el próximo período en formato JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Error in predictive analysis:', error)
    throw new Error('Error al realizar análisis predictivo')
  }
}

/**
 * Genera recomendaciones basadas en anomalías
 */
export async function aiAnomalyDetection(
  data: any[],
  dimension: string
): Promise<{
  anomalies: { record: any; reason: string; severity: 'low' | 'medium' | 'high' }[]
  recommendations: string[]
}> {
  const systemPrompt = `Eres un experto en detección de anomalías en datos empresariales.
Identifica valores atípicos, patrones irregulares y situaciones que requieren atención.

Responde en formato JSON:
{
  "anomalies": [
    {
      "record": objeto del registro anómalo,
      "reason": "razón de la anomalía",
      "severity": "low|medium|high"
    }
  ],
  "recommendations": ["recomendaciones para abordar las anomalías"]
}`

  const userPrompt = `Analiza estos datos de ${dimension} y detecta anomalías:

${JSON.stringify(data, null, 2)}`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Error in anomaly detection:', error)
    throw new Error('Error al detectar anomalías')
  }
}

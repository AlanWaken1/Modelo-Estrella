import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind CSS de manera inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea números como moneda
 */
export function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formatea fechas en formato legible
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Formatea fechas en formato corto
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/**
 * Formatea fechas para inputs de tipo date
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Formatea números con separadores de miles
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Formatea porcentajes
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Calcula el porcentaje de cambio entre dos valores
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Determina la tendencia basada en un porcentaje de cambio
 */
export function getTrend(percentageChange: number): 'up' | 'down' | 'stable' {
  if (Math.abs(percentageChange) < 1) return 'stable'
  return percentageChange > 0 ? 'up' : 'down'
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Genera un color basado en un string (para gráficas)
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return `hsl(${h}, 70%, 60%)`
}

/**
 * Debounce para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Trunca texto con ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Capitaliza la primera letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Agrupa un array por una propiedad
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key])
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Calcula el promedio de un array de números
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * Calcula la suma de un array de números
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}

/**
 * Obtiene un rango de fechas
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)

  return { start, end }
}

/**
 * Verifica si una fecha está en un rango
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

/**
 * Parsea errores de forma segura
 */
export function parseError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ha ocurrido un error desconocido'
}

/**
 * Sleep function para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry function con backoff exponencial
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i))
      }
    }
  }

  throw lastError!
}

/**
 * Valida dimensión
 */
export function isValidDimension(dimension: string): boolean {
  const validDimensions = ['produccion', 'finanzas', 'recursos-humanos', 'desarrollo-digital']
  return validDimensions.includes(dimension)
}

/**
 * Convierte slug a nombre de modelo Prisma
 */
export function dimensionToModel(dimension: string): string {
  const map: Record<string, string> = {
    'produccion': 'produccion',
    'finanzas': 'finanzas',
    'recursos-humanos': 'recursosHumanos',
    'desarrollo-digital': 'desarrolloDigital',
  }
  return map[dimension] || dimension
}

/**
 * Sanitiza input para prevenir inyecciones
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}

/**
 * Valida rango de fechas
 */
export function validateDateRange(start: string | Date, end: string | Date): boolean {
  const startDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : end

  return startDate <= endDate
}

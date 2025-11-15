// ============================================
// TIPOS DE DIMENSIONES
// ============================================

export type Dimension = 'produccion' | 'finanzas' | 'recursos-humanos' | 'desarrollo-digital'

export const DIMENSION_LABELS: Record<string, string> = {
  'produccion': 'Producción',
  'finanzas': 'Finanzas',
  'recursos-humanos': 'Recursos Humanos',
  'desarrollo-digital': 'Desarrollo Digital',
}

// ============================================
// DIMENSIÓN: PRODUCCIÓN
// ============================================

export interface ProduccionData {
  id?: string
  fecha: Date | string
  unidadesProducidas: number
  productosDefectuosos?: number
  tiempoProduccion: number
  costoProduccion: number
  eficiencia: number
  turno: 'mañana' | 'tarde' | 'noche'
  linea: string
  operador: string
  observaciones?: string
}

// ============================================
// DIMENSIÓN: FINANZAS
// ============================================

export interface FinanzasData {
  id?: string
  fecha: Date | string
  tipo: 'ingreso' | 'egreso' | 'inversión'
  categoria: string
  monto: number
  moneda?: string
  metodoPago?: string
  proveedor?: string
  cliente?: string
  factura?: string
  concepto: string
  departamento: string
  aprobadoPor?: string
  observaciones?: string
}

// ============================================
// DIMENSIÓN: RECURSOS HUMANOS
// ============================================

export interface RecursosHumanosData {
  id?: string
  fecha: Date | string
  empleadoId: string
  nombreEmpleado: string
  departamento: string
  puesto: string
  tipo: 'asistencia' | 'vacaciones' | 'capacitación' | 'evaluación' | 'incidencia'
  horasTrabajadas?: number
  horasExtra?: number
  ausencias?: number
  calificacion?: number
  cursosCompletados?: number
  incidencia?: string
  salario?: number
  bonos?: number
  observaciones?: string
}

// ============================================
// DIMENSIÓN: DESARROLLO DIGITAL
// ============================================

export interface DesarrolloDigitalData {
  id?: string
  fecha: Date | string
  proyecto: string
  tipo: 'desarrollo' | 'mantenimiento' | 'infraestructura' | 'seguridad'
  categoria: 'frontend' | 'backend' | 'devops' | 'qa' | 'diseño'
  tareas: number
  bugs?: number
  prioridad: 'baja' | 'media' | 'alta' | 'crítica'
  estado: 'planificación' | 'desarrollo' | 'testing' | 'producción'
  desarrollador: string
  tiempoEstimado: number
  tiempoReal: number
  tecnologias: string[]
  repositorio?: string
  sprint?: string
  observaciones?: string
}

// ============================================
// REPORTES
// ============================================

export interface ReporteData {
  id?: string
  titulo: string
  descripcion?: string
  tipo: 'mensual' | 'trimestral' | 'anual' | 'especial'
  dimension: string
  fechaInicio: Date | string
  fechaFin: Date | string
  archivoUrl?: string
  archivoNombre?: string
  archivoTamanio?: number
  generadoPor: string
  formato: 'pdf' | 'excel' | 'word'
  resumenIA?: string
  insightsIA?: any
}

// ============================================
// BÚSQUEDA IA
// ============================================

export interface BusquedaIAData {
  query: string
  dimension?: Dimension
  fechaInicio?: Date | string
  fechaFin?: Date | string
}

export interface BusquedaIAResult {
  id: string
  query: string
  dimension?: string
  resultados: any
  resumen?: string
  insights?: any
  relevancia?: number
  createdAt: Date
}

// ============================================
// NOTIFICACIONES
// ============================================

export interface NotificacionData {
  id?: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  titulo: string
  mensaje: string
  dimension?: string
  registroId?: string
  leida?: boolean
  prioridad?: 'baja' | 'normal' | 'alta'
  metadata?: any
}

// ============================================
// MÉTRICAS Y KPIs
// ============================================

export interface MetricaCalculada {
  id?: string
  nombre: string
  dimension: string
  valor: number
  unidad?: string
  periodo: 'diario' | 'semanal' | 'mensual'
  fecha: Date | string
  formula?: string
  metadata?: any
}

// ============================================
// RESPUESTAS API
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  metadata?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// FILTROS Y CONSULTAS
// ============================================

export interface FilterParams {
  dimension?: Dimension
  fechaInicio?: string
  fechaFin?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

// ============================================
// EVENTOS DE SINCRONIZACIÓN
// ============================================

export type SyncEventType = 'create' | 'update' | 'delete'

export interface SyncEvent {
  type: SyncEventType
  dimension: Dimension
  data: any
  timestamp: number
  id: string
}

// ============================================
// ESTADÍSTICAS DEL DASHBOARD
// ============================================

export interface DashboardStats {
  produccion: {
    totalUnidades: number
    eficienciaPromedio: number
    defectosPromedio: number
    tendencia: 'up' | 'down' | 'stable'
  }
  finanzas: {
    totalIngresos: number
    totalEgresos: number
    balance: number
    tendencia: 'up' | 'down' | 'stable'
  }
  recursosHumanos: {
    totalEmpleados: number
    horasPromedio: number
    ausentismo: number
    tendencia: 'up' | 'down' | 'stable'
  }
  desarrolloDigital: {
    proyectosActivos: number
    tareasCompletadas: number
    bugsAbiertos: number
    tendencia: 'up' | 'down' | 'stable'
  }
}

// ============================================
// CONFIGURACIÓN
// ============================================

export interface ConfiguracionSistema {
  clave: string
  valor: any
  descripcion?: string
  categoria: string
}

// ============================================
// TIPOS HELPER
// ============================================

export type DimensionData =
  | ProduccionData
  | FinanzasData
  | RecursosHumanosData
  | DesarrolloDigitalData

export type ChartDataPoint = {
  label: string
  value: number
  date?: string
  metadata?: any
}

export type TimeSeriesData = {
  fecha: string
  [key: string]: number | string
}

export type ExportFormat = 'excel' | 'csv' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  dimension: Dimension
  fechaInicio?: string
  fechaFin?: string
  includeCharts?: boolean
}

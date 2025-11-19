/**
 * Tipos de TypeScript generados para las tablas de Supabase
 * Basados en el esquema del modelo estrella
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dim_finanzas: {
        Row: {
          id: string
          documento: string
          periodo: string
          año: number
          monto: number
          categoria: string
          subcategoria: string | null
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          documento: string
          periodo: string
          año: number
          monto: number
          categoria: string
          subcategoria?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          documento?: string
          periodo?: string
          año?: number
          monto?: number
          categoria?: string
          subcategoria?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dim_produccion: {
        Row: {
          id: string
          documento: string
          periodo: string
          año: number
          area_especifica: string
          cantidad_producida: number | null
          unidad_medida: string | null
          eficiencia_porcentaje: number | null
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          documento: string
          periodo: string
          año: number
          area_especifica: string
          cantidad_producida?: number | null
          unidad_medida?: string | null
          eficiencia_porcentaje?: number | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          documento?: string
          periodo?: string
          año?: number
          area_especifica?: string
          cantidad_producida?: number | null
          unidad_medida?: string | null
          eficiencia_porcentaje?: number | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dim_recursos_humanos: {
        Row: {
          id: string
          documento: string
          periodo: string
          año: number
          tipo_contratacion: string
          numero_empleados: number | null
          departamento: string | null
          salario_promedio: number | null
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          documento: string
          periodo: string
          año: number
          tipo_contratacion: string
          numero_empleados?: number | null
          departamento?: string | null
          salario_promedio?: number | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          documento?: string
          periodo?: string
          año?: number
          tipo_contratacion?: string
          numero_empleados?: number | null
          departamento?: string | null
          salario_promedio?: number | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dim_desarrollo_digital: {
        Row: {
          id: string
          documento: string
          periodo: string
          año: number
          subdimension: string
          inversion: number | null
          tecnologia: string | null
          impacto_negocio: string | null
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          documento: string
          periodo: string
          año: number
          subdimension: string
          inversion?: number | null
          tecnologia?: string | null
          impacto_negocio?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          documento?: string
          periodo?: string
          año?: number
          subdimension?: string
          inversion?: number | null
          tecnologia?: string | null
          impacto_negocio?: string | null
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fact_eventos: {
        Row: {
          id: string
          finanzas_id: string | null
          produccion_id: string | null
          recursos_humanos_id: string | null
          desarrollo_digital_id: string | null
          fecha: string
          valor_total: number | null
          kpi_principal: string | null
          estado: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          finanzas_id?: string | null
          produccion_id?: string | null
          recursos_humanos_id?: string | null
          desarrollo_digital_id?: string | null
          fecha: string
          valor_total?: number | null
          kpi_principal?: string | null
          estado?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          finanzas_id?: string | null
          produccion_id?: string | null
          recursos_humanos_id?: string | null
          desarrollo_digital_id?: string | null
          fecha?: string
          valor_total?: number | null
          kpi_principal?: string | null
          estado?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reportes: {
        Row: {
          id: string
          nombre_archivo: string
          dimension: string
          tipo_analisis: string | null
          resumen_ia: string | null
          total_registros: number | null
          archivo_url: string | null
          fecha_carga: string
          estado: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre_archivo: string
          dimension: string
          tipo_analisis?: string | null
          resumen_ia?: string | null
          total_registros?: number | null
          archivo_url?: string | null
          fecha_carga?: string
          estado?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_archivo?: string
          dimension?: string
          tipo_analisis?: string | null
          resumen_ia?: string | null
          total_registros?: number | null
          archivo_url?: string | null
          fecha_carga?: string
          estado?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      v_resumen_financiero: {
        Row: {
          categoria: string | null
          año: number | null
          periodo: string | null
          total_transacciones: number | null
          total_monto: number | null
          promedio_monto: number | null
        }
      }
      v_eficiencia_produccion: {
        Row: {
          area_especifica: string | null
          año: number | null
          periodo: string | null
          total_producido: number | null
          eficiencia_promedio: number | null
        }
      }
      v_analisis_rrhh: {
        Row: {
          departamento: string | null
          tipo_contratacion: string | null
          año: number | null
          periodo: string | null
          total_empleados: number | null
          salario_promedio: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia para uso en la aplicación
export type DimFinanzas = Database['public']['Tables']['dim_finanzas']['Row']
export type DimProduccion = Database['public']['Tables']['dim_produccion']['Row']
export type DimRecursosHumanos = Database['public']['Tables']['dim_recursos_humanos']['Row']
export type DimDesarrolloDigital = Database['public']['Tables']['dim_desarrollo_digital']['Row']
export type FactEventos = Database['public']['Tables']['fact_eventos']['Row']
export type Reporte = Database['public']['Tables']['reportes']['Row']

// Tipos para inserción
export type NewDimFinanzas = Database['public']['Tables']['dim_finanzas']['Insert']
export type NewDimProduccion = Database['public']['Tables']['dim_produccion']['Insert']
export type NewDimRecursosHumanos = Database['public']['Tables']['dim_recursos_humanos']['Insert']
export type NewDimDesarrolloDigital = Database['public']['Tables']['dim_desarrollo_digital']['Insert']
export type NewFactEventos = Database['public']['Tables']['fact_eventos']['Insert']
export type NewReporte = Database['public']['Tables']['reportes']['Insert']

// Tipo unión para todas las dimensiones
export type Dimension = DimFinanzas | DimProduccion | DimRecursosHumanos | DimDesarrolloDigital

// Nombres de tablas como tipo literal
export type DimensionTableName = 'dim_finanzas' | 'dim_produccion' | 'dim_recursos_humanos' | 'dim_desarrollo_digital'

'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { DimensionTableName } from '@/types/database.types'

/**
 * Acción para crear un nuevo registro en una dimensión
 */
export async function createDimensionRecord(
  tableName: DimensionTableName,
  data: Record<string, any>
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: newRecord, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating record:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dimensions/${tableName.replace('dim_', '')}`)
    return { success: true, data: newRecord }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al crear el registro' }
  }
}

/**
 * Acción para actualizar un registro existente
 */
export async function updateDimensionRecord(
  tableName: DimensionTableName,
  id: string,
  data: Record<string, any>
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: updatedRecord, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating record:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dimensions/${tableName.replace('dim_', '')}`)
    return { success: true, data: updatedRecord }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al actualizar el registro' }
  }
}

/**
 * Acción para eliminar un registro
 */
export async function deleteDimensionRecord(
  tableName: DimensionTableName,
  id: string
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting record:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dimensions/${tableName.replace('dim_', '')}`)
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al eliminar el registro' }
  }
}

/**
 * Acción para obtener todos los registros de una dimensión
 */
export async function getDimensionRecords(tableName: DimensionTableName) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching records:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al obtener los registros', data: [] }
  }
}

/**
 * Acción para importar múltiples registros desde CSV
 */
export async function bulkImportRecords(
  tableName: DimensionTableName,
  records: Record<string, any>[]
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from(tableName)
      .insert(records)
      .select()

    if (error) {
      console.error('Error importing records:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dimensions/${tableName.replace('dim_', '')}`)
    return { success: true, data, count: data?.length || 0 }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al importar los registros' }
  }
}

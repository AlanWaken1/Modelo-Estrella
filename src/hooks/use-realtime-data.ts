'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DimensionTableName } from '@/types/database.types'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Hook personalizado para suscribirse a cambios en tiempo real de Supabase
 * @param tableName - Nombre de la tabla de dimensión
 * @param initialData - Datos iniciales (desde Server Component)
 */
export function useRealtimeData<T>(
  tableName: DimensionTableName,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      try {
        setIsLoading(true)

        // Cargar datos iniciales si no se proporcionaron
        if (initialData.length === 0) {
          const { data: fetchedData, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false })

          if (fetchError) throw fetchError
          setData((fetchedData as T[]) || [])
        }

        // Configurar suscripción a cambios en tiempo real
        channel = supabase
          .channel(`${tableName}_changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: tableName,
            },
            (payload) => {
              console.log('Change received!', payload)

              if (payload.eventType === 'INSERT') {
                setData((current) => [payload.new as T, ...current])
              } else if (payload.eventType === 'UPDATE') {
                setData((current) =>
                  current.map((item: any) =>
                    item.id === (payload.new as any).id ? (payload.new as T) : item
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                setData((current) =>
                  current.filter((item: any) => item.id !== (payload.old as any).id)
                )
              }
            }
          )
          .subscribe((status) => {
            console.log(`Subscription status for ${tableName}:`, status)
          })

        setIsLoading(false)
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    }

    setupSubscription()

    // Cleanup: desuscribirse al desmontar
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [tableName, supabase])

  return { data, isLoading, error, setData }
}

/**
 * Hook para refrescar datos manualmente
 */
export function useRefreshData<T>(tableName: DimensionTableName) {
  const supabase = createClient()

  const refresh = async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as T[]
  }

  return { refresh }
}

import { useState, useEffect, useCallback } from 'react'
import type { SyncEvent } from '@/types/types'

interface UseRealtimeSyncReturn {
  connected: boolean
  events: SyncEvent[]
  subscribe: () => void
  unsubscribe: () => void
}

/**
 * Hook para sincronización en tiempo real usando Server-Sent Events (SSE)
 * Este hook mantiene una conexión persistente con el servidor y recibe
 * eventos de sincronización automáticamente
 */
export function useRealtimeSync(dimension?: string): UseRealtimeSyncReturn {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<SyncEvent[]>([])
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const subscribe = useCallback(() => {
    // Evitar múltiples conexiones
    if (eventSource) {
      return
    }

    try {
      const url = dimension
        ? `/api/sync?dimension=${dimension}`
        : '/api/sync'

      const es = new EventSource(url)

      es.onopen = () => {
        console.log('✅ Conectado al servidor de sincronización')
        setConnected(true)
      }

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Ignorar mensajes de heartbeat
          if (data.type === 'heartbeat') {
            return
          }

          // Agregar evento a la lista
          setEvents((prev) => [...prev, data])

          console.log('📨 Evento de sincronización recibido:', data)
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      }

      es.onerror = (error) => {
        console.error('❌ Error en conexión SSE:', error)
        setConnected(false)

        // Reintentar conexión después de 5 segundos
        setTimeout(() => {
          if (es.readyState === EventSource.CLOSED) {
            es.close()
            setEventSource(null)
            subscribe()
          }
        }, 5000)
      }

      setEventSource(es)
    } catch (error) {
      console.error('Error creating EventSource:', error)
      setConnected(false)
    }
  }, [dimension, eventSource])

  const unsubscribe = useCallback(() => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
      setConnected(false)
      console.log('🔌 Desconectado del servidor de sincronización')
    }
  }, [eventSource])

  // Auto-conectar al montar el componente
  useEffect(() => {
    subscribe()

    // Cleanup al desmontar
    return () => {
      unsubscribe()
    }
  }, []) // Solo ejecutar una vez al montar

  return {
    connected,
    events,
    subscribe,
    unsubscribe,
  }
}

/**
 * Hook para notificar eventos de sincronización al servidor
 */
export async function notifySyncEvent(event: Omit<SyncEvent, 'timestamp' | 'id'>) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error notifying sync event:', error)
    throw error
  }
}

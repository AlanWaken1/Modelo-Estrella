// API Route para sincronización en tiempo real con Server-Sent Events (SSE)
import { NextResponse } from 'next/server'

// Store para mantener las conexiones activas
const clients = new Set<ReadableStreamDefaultController>()

// Función para notificar a todos los clientes
export function notifyClients(event: any) {
  const message = `data: ${JSON.stringify(event)}\n\n`
  clients.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Cliente desconectado, remover del set
      clients.delete(controller)
    }
  })
}

// GET - Endpoint SSE para sincronización en tiempo real
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dimension = searchParams.get('dimension')

  // Crear un stream de respuesta
  const stream = new ReadableStream({
    start(controller) {
      // Agregar cliente al set
      clients.add(controller)

      // Enviar mensaje inicial de conexión
      const connectMessage = `data: ${JSON.stringify({
        type: 'connected',
        message: 'Conectado al servidor de sincronización',
        timestamp: Date.now(),
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(connectMessage))

      // Heartbeat cada 30 segundos para mantener la conexión viva
      const heartbeat = setInterval(() => {
        try {
          const heartbeatMessage = `data: ${JSON.stringify({
            type: 'heartbeat',
            timestamp: Date.now(),
          })}\n\n`
          controller.enqueue(new TextEncoder().encode(heartbeatMessage))
        } catch (error) {
          clearInterval(heartbeat)
          clients.delete(controller)
        }
      }, 30000)

      // Cleanup cuando la conexión se cierra
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        clients.delete(controller)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// POST - Endpoint para recibir eventos de sincronización
export async function POST(request: Request) {
  try {
    const event = await request.json()

    // Validar evento
    if (!event.type || !event.dimension) {
      return NextResponse.json(
        { success: false, error: 'Evento inválido' },
        { status: 400 }
      )
    }

    // Agregar timestamp si no existe
    if (!event.timestamp) {
      event.timestamp = Date.now()
    }

    // Notificar a todos los clientes conectados
    notifyClients(event)

    return NextResponse.json({
      success: true,
      message: 'Evento de sincronización enviado',
      clientsNotified: clients.size,
    })
  } catch (error) {
    console.error('Error processing sync event:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar evento' },
      { status: 500 }
    )
  }
}

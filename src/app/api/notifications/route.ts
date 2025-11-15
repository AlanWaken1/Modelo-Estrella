// API Routes para notificaciones
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'

// GET - Obtener notificaciones con filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const leida = searchParams.get('leida')
    const dimension = searchParams.get('dimension')
    const prioridad = searchParams.get('prioridad')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (leida !== null) {
      where.leida = leida === 'true'
    }

    if (dimension) {
      where.dimension = dimension
    }

    if (prioridad) {
      where.prioridad = prioridad
    }

    // Solo mostrar notificaciones no expiradas
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gte: new Date() } },
    ]

    const notificaciones = await prisma.notificacion.findMany({
      where,
      take: limit,
      orderBy: [
        { prioridad: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    const total = await prisma.notificacion.count({ where })
    const noLeidas = await prisma.notificacion.count({
      where: { ...where, leida: false },
    })

    const response: ApiResponse = {
      success: true,
      data: notificaciones,
      metadata: {
        total,
        noLeidas,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// POST - Crear nueva notificación
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const notificacion = await prisma.notificacion.create({
      data: body,
    })

    const response: ApiResponse = {
      success: true,
      data: notificacion,
      message: 'Notificación creada exitosamente',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// PUT - Marcar notificación(es) como leída(s)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { ids, leida = true } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere un array de IDs' },
        { status: 400 }
      )
    }

    await prisma.notificacion.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        leida,
      },
    })

    const response: ApiResponse = {
      success: true,
      message: `${ids.length} notificación(es) actualizada(s)`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar notificaciones antiguas
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dias = parseInt(searchParams.get('dias') || '30')

    const fecha = new Date()
    fecha.setDate(fecha.getDate() - dias)

    const result = await prisma.notificacion.deleteMany({
      where: {
        createdAt: {
          lt: fecha,
        },
        leida: true,
      },
    })

    const response: ApiResponse = {
      success: true,
      message: `${result.count} notificación(es) eliminada(s)`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

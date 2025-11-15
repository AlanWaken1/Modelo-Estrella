// API Routes para operaciones CRUD por dimensión
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { dimensionToModel, parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'

// GET - Obtener todos los registros de una dimensión con filtros
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)

    // Parámetros de paginación y filtros
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const fechaInicio = searchParams.get('fechaInicio')
    const fechaFin = searchParams.get('fechaFin')
    const sortBy = searchParams.get('sortBy') || 'fecha'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros
    const where: any = {}
    if (fechaInicio || fechaFin) {
      where.fecha = {}
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio)
      if (fechaFin) where.fecha.lte = new Date(fechaFin)
    }

    const modelName = dimensionToModel(slug) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).findMany !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    // Obtener datos y total
    const [records, total] = await Promise.all([
      (prisma[modelName] as any).findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      (prisma[modelName] as any).count({ where }),
    ])

    const response: ApiResponse = {
      success: true,
      data: records,
      metadata: {
        total,
        page,
        limit,
        hasMore: skip + records.length < total,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching records:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo registro en la dimensión
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    const modelName = dimensionToModel(slug) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).create !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    // Convertir fecha si viene como string
    if (body.fecha && typeof body.fecha === 'string') {
      body.fecha = new Date(body.fecha)
    }

    const newRecord = await (prisma[modelName] as any).create({ data: body })

    // Crear notificación de nuevo registro
    await prisma.notificacion.create({
      data: {
        tipo: 'info',
        titulo: 'Nuevo registro creado',
        mensaje: `Se ha creado un nuevo registro en ${slug}`,
        dimension: slug,
        registroId: newRecord.id,
        prioridad: 'normal',
      },
    })

    const response: ApiResponse = {
      success: true,
      data: newRecord,
      message: 'Registro creado exitosamente',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}
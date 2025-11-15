// API Routes para operaciones individuales de registros (por ID)
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { dimensionToModel, parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'

// GET - Obtener un registro específico por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const dimension = searchParams.get('dimension')

    if (!dimension) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere especificar la dimensión' },
        { status: 400 }
      )
    }

    const modelName = dimensionToModel(dimension) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).findUnique !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    const record = await (prisma[modelName] as any).findUnique({
      where: { id },
    })

    if (!record) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }

    const response: ApiResponse = {
      success: true,
      data: record,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching record:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un registro específico
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { dimension, ...updateData } = body

    if (!dimension) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere especificar la dimensión' },
        { status: 400 }
      )
    }

    const modelName = dimensionToModel(dimension) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).update !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    // Convertir fecha si viene como string
    if (updateData.fecha && typeof updateData.fecha === 'string') {
      updateData.fecha = new Date(updateData.fecha)
    }

    // Verificar que el registro existe
    const exists = await (prisma[modelName] as any).findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }

    const updatedRecord = await (prisma[modelName] as any).update({
      where: { id },
      data: updateData,
    })

    // Crear notificación de actualización
    await prisma.notificacion.create({
      data: {
        tipo: 'info',
        titulo: 'Registro actualizado',
        mensaje: `Se ha actualizado un registro en ${dimension}`,
        dimension,
        registroId: id,
        prioridad: 'normal',
      },
    })

    const response: ApiResponse = {
      success: true,
      data: updatedRecord,
      message: 'Registro actualizado exitosamente',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un registro específico
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const dimension = searchParams.get('dimension')

    if (!dimension) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere especificar la dimensión' },
        { status: 400 }
      )
    }

    const modelName = dimensionToModel(dimension) as keyof typeof prisma

    if (!prisma[modelName] || typeof (prisma[modelName] as any).delete !== 'function') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Dimensión no válida' },
        { status: 400 }
      )
    }

    // Verificar que el registro existe
    const exists = await (prisma[modelName] as any).findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      )
    }

    await (prisma[modelName] as any).delete({
      where: { id },
    })

    // Crear notificación de eliminación
    await prisma.notificacion.create({
      data: {
        tipo: 'warning',
        titulo: 'Registro eliminado',
        mensaje: `Se ha eliminado un registro en ${dimension}`,
        dimension,
        registroId: id,
        prioridad: 'normal',
      },
    })

    const response: ApiResponse = {
      success: true,
      message: 'Registro eliminado exitosamente',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

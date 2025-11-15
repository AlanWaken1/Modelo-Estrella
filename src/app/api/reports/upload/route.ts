// API Route para subir reportes y archivos
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseError } from '@/lib/utils'
import type { ApiResponse } from '@/types/types'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const titulo = formData.get('titulo') as string
    const descripcion = formData.get('descripcion') as string
    const tipo = formData.get('tipo') as string
    const dimension = formData.get('dimension') as string
    const fechaInicio = formData.get('fechaInicio') as string
    const fechaFin = formData.get('fechaFin') as string
    const generadoPor = formData.get('generadoPor') as string

    // Validaciones
    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Se requiere un archivo' },
        { status: 400 }
      )
    }

    if (!titulo || !tipo || !dimension || !fechaInicio || !fechaFin || !generadoPor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `El archivo excede el tamaño máximo permitido (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/csv',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tipo de archivo no permitido' },
        { status: 400 }
      )
    }

    // Crear directorio de uploads si no existe
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR, dimension)
    await mkdir(uploadPath, { recursive: true })

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = path.join(uploadPath, fileName)

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Determinar formato
    let formato: 'pdf' | 'excel' | 'word' = 'pdf'
    if (file.type.includes('sheet') || file.type.includes('excel') || file.type.includes('csv')) {
      formato = 'excel'
    } else if (file.type.includes('word')) {
      formato = 'word'
    }

    // Guardar información del reporte en la base de datos
    const reporte = await prisma.reporte.create({
      data: {
        titulo,
        descripcion,
        tipo,
        dimension,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        archivoUrl: `/uploads/${dimension}/${fileName}`,
        archivoNombre: file.name,
        archivoTamanio: file.size,
        generadoPor,
        formato,
      },
    })

    // Crear notificación
    await prisma.notificacion.create({
      data: {
        tipo: 'success',
        titulo: 'Nuevo reporte subido',
        mensaje: `Se ha subido el reporte "${titulo}"`,
        dimension,
        registroId: reporte.id,
        prioridad: 'normal',
      },
    })

    const response: ApiResponse = {
      success: true,
      data: reporte,
      message: 'Reporte subido exitosamente',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error uploading report:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

// GET - Listar reportes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dimension = searchParams.get('dimension')
    const tipo = searchParams.get('tipo')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (dimension) where.dimension = dimension
    if (tipo) where.tipo = tipo

    const reportes = await prisma.reporte.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.reporte.count({ where })

    const response: ApiResponse = {
      success: true,
      data: reportes,
      metadata: { total },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: parseError(error) },
      { status: 500 }
    )
  }
}

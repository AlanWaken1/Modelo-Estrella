import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('<1 Seeding database...')

  // Limpiar datos existentes
  await prisma.notificacion.deleteMany()
  await prisma.metricaCalculada.deleteMany()
  await prisma.busquedaIA.deleteMany()
  await prisma.reporte.deleteMany()
  await prisma.desarrolloDigital.deleteMany()
  await prisma.recursosHumanos.deleteMany()
  await prisma.finanzas.deleteMany()
  await prisma.produccion.deleteMany()

  // ============================================
  // DIMENSIÓN: PRODUCCIÓN
  // ============================================
  console.log('=æ Creando registros de Producción...')

  const produccionData = []
  const lineas = ['Línea A', 'Línea B', 'Línea C']
  const turnos = ['mañana', 'tarde', 'noche']
  const operadores = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez']

  for (let i = 0; i < 50; i++) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)

    produccionData.push({
      fecha,
      unidadesProducidas: Math.floor(Math.random() * 500) + 100,
      productosDefectuosos: Math.floor(Math.random() * 20),
      tiempoProduccion: Math.random() * 8 + 4,
      costoProduccion: Math.random() * 10000 + 5000,
      eficiencia: Math.random() * 30 + 70,
      turno: turnos[Math.floor(Math.random() * turnos.length)],
      linea: lineas[Math.floor(Math.random() * lineas.length)],
      operador: operadores[Math.floor(Math.random() * operadores.length)],
      observaciones: i % 5 === 0 ? 'Producción normal' : null,
    })
  }

  await prisma.produccion.createMany({ data: produccionData })

  // ============================================
  // DIMENSIÓN: FINANZAS
  // ============================================
  console.log('=° Creando registros de Finanzas...')

  const finanzasData = []
  const tipos = ['ingreso', 'egreso', 'inversión']
  const categorias = ['ventas', 'gastos operativos', 'salarios', 'marketing', 'infraestructura']
  const departamentos = ['Ventas', 'Operaciones', 'TI', 'Marketing', 'RRHH']

  for (let i = 0; i < 80; i++) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]

    finanzasData.push({
      fecha,
      tipo,
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      monto: tipo === 'ingreso'
        ? Math.random() * 50000 + 10000
        : Math.random() * 30000 + 5000,
      moneda: 'MXN',
      metodoPago: ['efectivo', 'transferencia', 'tarjeta'][Math.floor(Math.random() * 3)],
      concepto: `Concepto de ${tipo} ${i + 1}`,
      departamento: departamentos[Math.floor(Math.random() * departamentos.length)],
      factura: i % 3 === 0 ? `FAC-${String(i).padStart(6, '0')}` : null,
    })
  }

  await prisma.finanzas.createMany({ data: finanzasData })

  // ============================================
  // DIMENSIÓN: RECURSOS HUMANOS
  // ============================================
  console.log('=e Creando registros de Recursos Humanos...')

  const rrhhData = []
  const empleados = [
    { id: 'EMP001', nombre: 'Juan Pérez' },
    { id: 'EMP002', nombre: 'María García' },
    { id: 'EMP003', nombre: 'Carlos López' },
    { id: 'EMP004', nombre: 'Ana Martínez' },
    { id: 'EMP005', nombre: 'Luis Rodríguez' },
  ]
  const puestos = ['Desarrollador', 'Gerente', 'Analista', 'Coordinador', 'Técnico']
  const tiposRRHH = ['asistencia', 'vacaciones', 'capacitación', 'evaluación']

  for (let i = 0; i < 100; i++) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    const empleado = empleados[Math.floor(Math.random() * empleados.length)]
    const tipo = tiposRRHH[Math.floor(Math.random() * tiposRRHH.length)]

    rrhhData.push({
      fecha,
      empleadoId: empleado.id,
      nombreEmpleado: empleado.nombre,
      departamento: departamentos[Math.floor(Math.random() * departamentos.length)],
      puesto: puestos[Math.floor(Math.random() * puestos.length)],
      tipo,
      horasTrabajadas: tipo === 'asistencia' ? Math.random() * 8 + 4 : null,
      horasExtra: tipo === 'asistencia' ? Math.random() * 3 : 0,
      calificacion: tipo === 'evaluación' ? Math.random() * 30 + 70 : null,
      cursosCompletados: tipo === 'capacitación' ? Math.floor(Math.random() * 5) : 0,
      salario: i % 10 === 0 ? Math.random() * 20000 + 15000 : null,
    })
  }

  await prisma.recursosHumanos.createMany({ data: rrhhData })

  // ============================================
  // DIMENSIÓN: DESARROLLO DIGITAL
  // ============================================
  console.log('=» Creando registros de Desarrollo Digital...')

  const desarrolloData = []
  const proyectos = ['App Mobile', 'Web Dashboard', 'API REST', 'Sistema ERP', 'E-commerce']
  const tiposDesarrollo = ['desarrollo', 'mantenimiento', 'infraestructura', 'seguridad']
  const categorias_dev = ['frontend', 'backend', 'devops', 'qa', 'diseño']
  const prioridades = ['baja', 'media', 'alta', 'crítica']
  const estados = ['planificación', 'desarrollo', 'testing', 'producción']
  const tecnologias = [
    ['React', 'TypeScript', 'Next.js'],
    ['Node.js', 'PostgreSQL', 'Prisma'],
    ['Docker', 'Kubernetes', 'AWS'],
    ['Python', 'FastAPI', 'MongoDB'],
  ]

  for (let i = 0; i < 60; i++) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    const tiempoEstimado = Math.random() * 40 + 10

    desarrolloData.push({
      fecha,
      proyecto: proyectos[Math.floor(Math.random() * proyectos.length)],
      tipo: tiposDesarrollo[Math.floor(Math.random() * tiposDesarrollo.length)],
      categoria: categorias_dev[Math.floor(Math.random() * categorias_dev.length)],
      tareas: Math.floor(Math.random() * 20) + 1,
      bugs: Math.floor(Math.random() * 10),
      prioridad: prioridades[Math.floor(Math.random() * prioridades.length)],
      estado: estados[Math.floor(Math.random() * estados.length)],
      desarrollador: empleados[Math.floor(Math.random() * empleados.length)].nombre,
      tiempoEstimado,
      tiempoReal: tiempoEstimado * (Math.random() * 0.4 + 0.8), // +/- 20%
      tecnologias: tecnologias[Math.floor(Math.random() * tecnologias.length)],
      sprint: `Sprint ${Math.floor(i / 10) + 1}`,
    })
  }

  await prisma.desarrolloDigital.createMany({ data: desarrolloData })

  // ============================================
  // REPORTES
  // ============================================
  console.log('=Ê Creando reportes...')

  const reportes = [
    {
      titulo: 'Reporte Mensual de Producción - Enero',
      tipo: 'mensual',
      dimension: 'produccion',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-01-31'),
      generadoPor: 'Sistema',
      formato: 'pdf',
    },
    {
      titulo: 'Análisis Financiero Q1 2025',
      tipo: 'trimestral',
      dimension: 'finanzas',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-03-31'),
      generadoPor: 'Sistema',
      formato: 'excel',
    },
    {
      titulo: 'Evaluación de Personal - Febrero',
      tipo: 'mensual',
      dimension: 'rrhh',
      fechaInicio: new Date('2025-02-01'),
      fechaFin: new Date('2025-02-28'),
      generadoPor: 'Sistema',
      formato: 'pdf',
    },
    {
      titulo: 'Sprint Review - Q1',
      tipo: 'trimestral',
      dimension: 'digital',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-03-31'),
      generadoPor: 'Sistema',
      formato: 'pdf',
    },
  ]

  await prisma.reporte.createMany({ data: reportes })

  // ============================================
  // NOTIFICACIONES
  // ============================================
  console.log('= Creando notificaciones...')

  const notificaciones = [
    {
      tipo: 'warning',
      titulo: 'Alta tasa de defectos',
      mensaje: 'La línea B ha superado el 5% de productos defectuosos hoy',
      dimension: 'produccion',
      prioridad: 'alta',
    },
    {
      tipo: 'success',
      titulo: 'Meta de producción alcanzada',
      mensaje: 'Se ha cumplido la meta mensual de producción',
      dimension: 'produccion',
      prioridad: 'normal',
    },
    {
      tipo: 'info',
      titulo: 'Nuevo reporte disponible',
      mensaje: 'El reporte financiero de enero está listo para revisión',
      dimension: 'finanzas',
      prioridad: 'normal',
    },
    {
      tipo: 'error',
      titulo: 'Presupuesto excedido',
      mensaje: 'El departamento de Marketing ha excedido su presupuesto mensual',
      dimension: 'finanzas',
      prioridad: 'alta',
    },
  ]

  await prisma.notificacion.createMany({ data: notificaciones })

  // ============================================
  // CONFIGURACIÓN DEL SISTEMA
  // ============================================
  console.log('™ Configurando sistema...')

  await prisma.configuracionSistema.createMany({
    data: [
      {
        clave: 'eficiencia_minima',
        valor: { porcentaje: 80 },
        descripcion: 'Eficiencia mínima aceptable en producción',
        categoria: 'produccion',
      },
      {
        clave: 'defectos_maximos',
        valor: { porcentaje: 5 },
        descripcion: 'Porcentaje máximo de defectos permitido',
        categoria: 'produccion',
      },
      {
        clave: 'sync_interval',
        valor: { milisegundos: 5000 },
        descripcion: 'Intervalo de sincronización en tiempo real',
        categoria: 'api',
      },
    ],
  })

  console.log(' Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('L Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
